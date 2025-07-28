#!/usr/bin/env python3
"""
Générateur de thumbnails pour PostFlow
Génère des thumbnails à partir de fichiers vidéo
"""

import os
import logging
import asyncio
import json
import subprocess
import time
from pathlib import Path
from typing import Optional, Dict, Any, List
from datetime import datetime

logger = logging.getLogger(__name__)


class ThumbnailGenerator:
    """Générateur de thumbnails pour fichiers vidéo."""
    
    def __init__(self, config_or_ffmpeg_path="ffmpeg"):
        """
        Initialiser le générateur.
        
        Args:
            config_or_ffmpeg_path: ConfigManager ou chemin vers ffmpeg
        """
        if hasattr(config_or_ffmpeg_path, 'get'):
            # C'est un ConfigManager
            self.config = config_or_ffmpeg_path
            self.config_manager = config_or_ffmpeg_path  # Alias pour compatibilité
            self.ffmpeg_path = "ffmpeg"  # Par défaut
            self.output_dir = config_or_ffmpeg_path.get('workflow.thumbnail_output_dir', 'output/thumbnails')
        else:
            # C'est un chemin ffmpeg
            self.ffmpeg_path = config_or_ffmpeg_path
            self.config = None
            self.config_manager = None
            self.output_dir = "output/thumbnails"
        
        self._verify_ffmpeg()
        self._drive_service = None
        self._thumbnails_folder_id = None
        
        # Initialiser Google Drive automatiquement si ConfigManager disponible
        if self.config_manager:
            logger.info("🔧 Initialisation automatique Google Drive pour thumbnails...")
            if self._setup_google_drive():
                logger.info("✅ Google Drive initialisé pour thumbnails")
            else:
                logger.warning("⚠️ Google Drive non disponible, thumbnails locaux uniquement")
    
    def _verify_ffmpeg(self):
        """Vérifier que ffmpeg est disponible."""
        try:
            result = subprocess.run(
                [self.ffmpeg_path, "-version"],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode == 0:
                logger.info("✅ FFmpeg disponible")
            else:
                logger.warning("⚠️ FFmpeg introuvable, thumbnails désactivés")
        except Exception as e:
            logger.warning(f"⚠️ Erreur vérification FFmpeg: {e}")
    
    async def generate(self, video_path: str, output_dir: str = "output/thumbnails", 
                      timestamp: str = "00:00:05", size: str = "320x180") -> Optional[str]:
        """
        Générer un thumbnail depuis un fichier vidéo.
        
        Args:
            video_path: Chemin vers le fichier vidéo
            output_dir: Répertoire de sortie
            timestamp: Timestamp où extraire le thumbnail
            size: Taille du thumbnail (WxH)
            
        Returns:
            Optional[str]: Chemin du thumbnail généré
        """
        try:
            # Vérifier que le fichier existe
            if not os.path.exists(video_path):
                logger.error(f"❌ Fichier vidéo introuvable: {video_path}")
                return None
            
            # Obtenir les infos vidéo pour déterminer la durée
            video_info = self.get_video_info(video_path)
            duration = video_info.get('duration', 0)
            
            # Ajuster le timestamp selon la durée
            if duration > 0:
                if duration < 2:
                    timestamp = "00:00:00.5"  # 0.5 secondes
                elif duration < 5:
                    timestamp = "00:00:01"    # 1 seconde
                else:
                    timestamp = "00:00:05"    # 5 secondes par défaut
            
            logger.info(f"🖼️ Génération thumbnail: {Path(video_path).name} (durée: {duration:.1f}s, timestamp: {timestamp})")
            
            # Créer le répertoire de sortie
            output_path = Path(output_dir)
            output_path.mkdir(parents=True, exist_ok=True)
            
            # Nom du thumbnail
            video_name = Path(video_path).stem
            thumbnail_name = f"{video_name}_thumb_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
            thumbnail_path = output_path / thumbnail_name
            
            # Essayer différentes méthodes de génération
            success = await self._try_thumbnail_generation(video_path, thumbnail_path, timestamp)
            
            if success and thumbnail_path.exists() and thumbnail_path.stat().st_size > 0:
                logger.info(f"✅ Thumbnail généré: {thumbnail_path}")
                return str(thumbnail_path)
            else:
                logger.error(f"❌ Échec génération thumbnail pour: {video_name}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Erreur génération thumbnail: {e}")
            return None
    
    async def _try_thumbnail_generation(self, video_path: str, thumbnail_path: Path, timestamp: str) -> bool:
        """
        Essayer différentes méthodes de génération de thumbnail.
        
        Args:
            video_path: Chemin vers le fichier vidéo
            thumbnail_path: Chemin de sortie du thumbnail
            timestamp: Timestamp initial
            
        Returns:
            bool: True si succès, False sinon
        """
        video_name = Path(video_path).name
        
        # Méthode 1: Optimisée pour ProRes/10-bit
        logger.info(f"🖼️ Génération thumbnail (méthode optimisée): {video_name}")
        if await self._generate_with_method1(video_path, thumbnail_path, timestamp):
            return True
        
        # Méthode 2: Simplifiée sans filtres complexes
        logger.warning(f"⚠️ Méthode 1 échouée, essai méthode simplifiée: {video_name}")
        if await self._generate_with_method2(video_path, thumbnail_path, timestamp):
            return True
        
        # Méthode 3: Première frame disponible
        logger.warning(f"⚠️ Méthode 2 échouée, essai première frame: {video_name}")
        if await self._generate_with_method3(video_path, thumbnail_path):
            return True
        
        # Méthode 4: Frame au milieu de la vidéo
        logger.warning(f"⚠️ Méthode 3 échouée, essai frame centrale: {video_name}")
        if await self._generate_with_method4(video_path, thumbnail_path):
            return True
        
        return False
    
    async def _generate_with_method1(self, video_path: str, thumbnail_path: Path, timestamp: str) -> bool:
        """Méthode optimisée pour ProRes/10-bit."""
        try:
            cmd = [
                self.ffmpeg_path,
                "-v", "error",  # Réduire la verbosité
                "-i", video_path,
                "-ss", timestamp,
                "-vframes", "1",
                "-vf", "scale=320:180:force_original_aspect_ratio=decrease,pad=320:180:(ow-iw)/2:(oh-ih)/2,format=yuv420p",
                "-pix_fmt", "yuv420p",
                "-f", "image2",
                "-q:v", "2",
                "-y",
                str(thumbnail_path)
            ]
            
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode == 0 and thumbnail_path.exists() and thumbnail_path.stat().st_size > 0:
                return True
        except Exception as e:
            logger.debug(f"Méthode 1 échouée: {e}")
        
        return False
    
    async def _generate_with_method2(self, video_path: str, thumbnail_path: Path, timestamp: str) -> bool:
        """Méthode simplifiée sans filtres complexes."""
        try:
            cmd = [
                self.ffmpeg_path,
                "-v", "error",
                "-i", video_path,
                "-ss", timestamp,
                "-vframes", "1",
                "-vf", "scale=320:180",
                "-q:v", "3",
                "-y",
                str(thumbnail_path)
            ]
            
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode == 0 and thumbnail_path.exists() and thumbnail_path.stat().st_size > 0:
                return True
        except Exception as e:
            logger.debug(f"Méthode 2 échouée: {e}")
        
        return False
    
    async def _generate_with_method3(self, video_path: str, thumbnail_path: Path) -> bool:
        """Extraire la première frame disponible."""
        try:
            cmd = [
                self.ffmpeg_path,
                "-v", "error",
                "-i", video_path,
                "-vframes", "1",
                "-vf", "scale=320:180",
                "-q:v", "3",
                "-y",
                str(thumbnail_path)
            ]
            
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode == 0 and thumbnail_path.exists() and thumbnail_path.stat().st_size > 0:
                return True
        except Exception as e:
            logger.debug(f"Méthode 3 échouée: {e}")
        
        return False
    
    async def _generate_with_method4(self, video_path: str, thumbnail_path: Path) -> bool:
        """Extraire une frame au milieu de la vidéo."""
        try:
            # Obtenir la durée et extraire au milieu
            video_info = self.get_video_info(video_path)
            if video_info and video_info.get('duration'):
                duration = float(video_info['duration'])
                middle_seconds = duration / 2
                middle_timestamp = f"00:00:{middle_seconds:06.3f}"
            else:
                middle_timestamp = "00:00:01"
            
            cmd = [
                self.ffmpeg_path,
                "-v", "error",
                "-i", video_path,
                "-ss", middle_timestamp,
                "-vframes", "1",
                "-vf", "scale=320:180",
                "-q:v", "3",
                "-y",
                str(thumbnail_path)
            ]
            
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode == 0 and thumbnail_path.exists() and thumbnail_path.stat().st_size > 0:
                return True
        except Exception as e:
            logger.debug(f"Méthode 4 échouée: {e}")
        
        return False
    
    async def generate_multiple(self, video_path: str, output_dir: str = "output/thumbnails",
                               timestamps: list = None, size: str = "320x180") -> Dict[str, str]:
        """
        Générer plusieurs thumbnails depuis un fichier vidéo.
        
        Args:
            video_path: Chemin vers le fichier vidéo
            output_dir: Répertoire de sortie
            timestamps: Liste des timestamps
            size: Taille des thumbnails
            
        Returns:
            Dict[str, str]: Mapping timestamp -> chemin_thumbnail
        """
        if timestamps is None:
            timestamps = ["00:00:05", "00:00:15", "00:00:30"]
        
        results = {}
        
        for timestamp in timestamps:
            thumbnail_path = await self.generate(
                video_path=video_path,
                output_dir=output_dir,
                timestamp=timestamp,
                size=size
            )
            
            if thumbnail_path:
                results[timestamp] = thumbnail_path
        
        return results
    
    async def generate_thumbnail(self, video_path: str, output_dir: str = None, 
                               timestamp: str = "00:00:05", size: str = "320x180") -> Optional[str]:
        """
        Générer un thumbnail depuis un fichier vidéo.
        
        Args:
            video_path: Chemin du fichier vidéo
            output_dir: Répertoire de sortie (optionnel)
            timestamp: Timestamp pour le thumbnail
            size: Taille du thumbnail
            
        Returns:
            str: Chemin du thumbnail généré ou None si échec
        """
        if not output_dir:
            output_dir = self.output_dir
            
        return await self.generate(video_path, output_dir, timestamp, size)
    
    def get_video_info(self, video_path: str) -> Dict[str, Any]:
        """
        Obtenir les informations d'un fichier vidéo.
        
        Args:
            video_path: Chemin vers le fichier vidéo
            
        Returns:
            Dict: Informations vidéo
        """
        try:
            import subprocess
            
            # Utiliser ffprobe pour obtenir les infos
            cmd = [
                "ffprobe",
                "-v", "quiet",
                "-print_format", "json",
                "-show_format",
                "-show_streams",
                video_path
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                import json
                info = json.loads(result.stdout)
                
                # Extraire les infos pertinentes
                video_info = {
                    'duration': None,
                    'width': None,
                    'height': None,
                    'fps': None,
                    'bitrate': None,
                    'format': None
                }
                
                # Format
                if 'format' in info:
                    video_info['duration'] = float(info['format'].get('duration', 0))
                    video_info['bitrate'] = int(info['format'].get('bit_rate', 0))
                    video_info['format'] = info['format'].get('format_name', '')
                
                # Streams vidéo
                for stream in info.get('streams', []):
                    if stream.get('codec_type') == 'video':
                        video_info['width'] = stream.get('width')
                        video_info['height'] = stream.get('height')
                        
                        # FPS
                        r_frame_rate = stream.get('r_frame_rate', '0/1')
                        if '/' in r_frame_rate:
                            num, den = r_frame_rate.split('/')
                            if int(den) > 0:
                                video_info['fps'] = float(num) / float(den)
                        
                        break
                
                return video_info
                
        except Exception as e:
            logger.error(f"❌ Erreur obtention infos vidéo: {e}")
        
        return {}
    
    async def _get_video_duration(self, video_path: str) -> Dict[str, Any]:
        """
        Obtenir la durée d'un fichier vidéo de manière asynchrone.
        
        Args:
            video_path: Chemin vers le fichier vidéo
            
        Returns:
            Dict: Informations sur la durée
        """
        try:
            cmd = [
                "ffprobe",
                "-v", "quiet",
                "-print_format", "json",
                "-show_format",
                video_path
            ]
            
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode == 0:
                import json
                info = json.loads(stdout.decode())
                
                if 'format' in info and 'duration' in info['format']:
                    duration = float(info['format']['duration'])
                    return {'duration': duration}
            
            return {}
            
        except Exception as e:
            logger.debug(f"Erreur obtention durée vidéo: {e}")
            return {}
    
    def _parse_timestamp_to_seconds(self, timestamp: str) -> float:
        """
        Convertir un timestamp HH:MM:SS.fff en secondes.
        
        Args:
            timestamp: Timestamp au format "HH:MM:SS" ou "HH:MM:SS.fff"
            
        Returns:
            float: Nombre de secondes
        """
        try:
            parts = timestamp.split(':')
            if len(parts) == 3:
                hours = int(parts[0])
                minutes = int(parts[1])
                seconds = float(parts[2])
                return hours * 3600 + minutes * 60 + seconds
            elif len(parts) == 2:
                minutes = int(parts[0])
                seconds = float(parts[1])
                return minutes * 60 + seconds
            else:
                return float(parts[0])
        except Exception:
            return 0.0
    
    def _seconds_to_timestamp(self, seconds: float) -> str:
        """
        Convertir des secondes en timestamp HH:MM:SS.fff.
        
        Args:
            seconds: Nombre de secondes
            
        Returns:
            str: Timestamp formaté
        """
        try:
            hours = int(seconds // 3600)
            minutes = int((seconds % 3600) // 60)
            secs = seconds % 60
            return f"{hours:02d}:{minutes:02d}:{secs:06.3f}"
        except Exception:
            return "00:00:01.000"

    def cleanup_old_thumbnails(self, output_dir: str = "output/thumbnails", 
                              max_age_days: int = 7):
        """
        Nettoyer les anciens thumbnails.
        
        Args:
            output_dir: Répertoire des thumbnails
            max_age_days: Âge maximum en jours
        """
        try:
            output_path = Path(output_dir)
            if not output_path.exists():
                return
            
            cutoff_time = datetime.now().timestamp() - (max_age_days * 24 * 3600)
            
            deleted_count = 0
            for thumbnail_file in output_path.glob("*.jpg"):
                if thumbnail_file.stat().st_mtime < cutoff_time:
                    thumbnail_file.unlink()
                    deleted_count += 1
            
            if deleted_count > 0:
                logger.info(f"🗑️ {deleted_count} anciens thumbnails supprimés")
                
        except Exception as e:
            logger.error(f"❌ Erreur nettoyage thumbnails: {e}")
    
    async def generate_with_public_url(self, video_path: str, output_dir: str = None, 
                                     timestamp: str = "00:00:05", size: str = "320x180") -> Optional[str]:
        """
        Générer un thumbnail et retourner une URL publique Google Drive.
        
        Args:
            video_path: Chemin du fichier vidéo
            output_dir: Répertoire de sortie (optionnel)
            timestamp: Timestamp pour le thumbnail
            size: Taille du thumbnail
            
        Returns:
            str: URL publique Google Drive du thumbnail ou None si échec
        """
        try:
            # 1. Générer le thumbnail localement
            thumbnail_path = await self.generate_thumbnail(video_path, output_dir, timestamp, size)
            if not thumbnail_path:
                logger.error("❌ Impossible de générer le thumbnail")
                return None
                
            # 2. Uploader vers Google Drive UNIQUEMENT
            public_url = await self.upload_to_external_service(thumbnail_path)
            if public_url:
                logger.info(f"✅ Thumbnail uploadé vers Google Drive: {public_url}")
                return public_url
            else:
                logger.error("❌ Échec upload thumbnail vers Google Drive")
                return None
            
        except Exception as e:
            logger.error(f"❌ Erreur génération thumbnail avec URL Google Drive: {e}")
            return None
    

    async def upload_to_external_service(self, thumbnail_path: str) -> Optional[str]:
        """
        Uploader un thumbnail vers Google Drive via GoogleConnectionManager.
        
        Args:
            thumbnail_path: Chemin local du thumbnail
            
        Returns:
            str: URL publique Google Drive ou None si échec
        """
        try:
            # Configurer Google Drive si pas encore fait
            if not self._drive_service:
                if not self._setup_google_drive():
                    logger.error("❌ Google Drive non disponible pour upload thumbnail")
                    return None
            
            # Vérifier que le dossier est configuré
            if not self._thumbnails_folder_id:
                self._setup_drive_folder()
            
            # Upload vers Google Drive
            from pathlib import Path
            path_obj = Path(thumbnail_path)
            timestamp = int(time.time())
            drive_filename = f"thumb_{path_obj.stem}_{timestamp}.jpg"
            
            public_url = self._upload_to_drive(thumbnail_path, drive_filename)
            if public_url:
                logger.info(f"☁️ Thumbnail uploadé vers Google Drive: {drive_filename}")
                return public_url
            else:
                logger.error("❌ Échec upload vers Google Drive")
                return None
            
        except Exception as e:
            logger.error(f"❌ Erreur upload thumbnail vers Google Drive: {e}")
            return None

    def _setup_google_drive(self):
        """Configure Google Drive pour l'upload des thumbnails via GoogleConnectionManager."""
        try:
            # Si déjà configuré, retourner True
            if self._drive_service:
                return True
            
            # Utiliser le GoogleConnectionManager directement
            if self.config_manager and hasattr(self.config_manager, 'google_connection_manager'):
                connection_manager = self.config_manager.google_connection_manager
                
                # SOLUTION: Utiliser les credentials OAuth utilisateur au lieu du Service Account
                # pour éviter les limitations de quota storage
                try:
                    # Essayer d'abord le service Drive persistant (Service Account)
                    self._drive_service = connection_manager.get_drive_service()
                    
                    if self._drive_service:
                        logger.info("✅ Google Drive configuré via GoogleConnectionManager (Service Account)")
                        
                        # Tester avec un Shared Drive d'abord
                        shared_drive_id = self._get_shared_drive()
                        if shared_drive_id:
                            logger.info("✅ Shared Drive détecté, utilisation du Service Account")
                            self._setup_drive_folder()
                            return True
                        else:
                            logger.warning("⚠️ Aucun Shared Drive accessible au Service Account")
                            logger.info("🔄 Basculement vers credentials OAuth utilisateur pour éviter les limitations...")
                            
                            # Basculer vers OAuth credentials si possible
                            oauth_service = self._setup_oauth_drive_service(connection_manager)
                            if oauth_service:
                                self._drive_service = oauth_service
                                logger.info("✅ Google Drive configuré via OAuth utilisateur")
                                self._setup_drive_folder()
                                return True
                            else:
                                logger.error("❌ Impossible de configurer OAuth Drive service")
                                return False
                    else:
                        logger.error("❌ Service Drive non disponible dans GoogleConnectionManager")
                        return False
                        
                except Exception as e:
                    logger.error(f"❌ Erreur configuration Drive via Service Account: {e}")
                    
                    # Fallback vers OAuth si possible
                    oauth_service = self._setup_oauth_drive_service(connection_manager)
                    if oauth_service:
                        self._drive_service = oauth_service
                        logger.info("✅ Google Drive configuré via OAuth utilisateur (fallback)")
                        self._setup_drive_folder()
                        return True
                    else:
                        return False
            else:
                logger.error("❌ GoogleConnectionManager non disponible pour thumbnails")
                return False
                
        except Exception as e:
            logger.error(f"❌ Impossible de configurer Google Drive pour thumbnails: {e}")
            return False
    
    def _setup_drive_folder(self):
        """Crée et configure le dossier Google Drive pour les thumbnails dans un Shared Drive."""
        try:
            from datetime import datetime
            
            # D'abord, essayer de trouver un Shared Drive disponible
            shared_drive_id = self._get_shared_drive()
            
            if shared_drive_id:
                # Utiliser un véritable Shared Drive
                logger.info(f"🚗 Utilisation du Shared Drive ID: {shared_drive_id}")
                
                project_name = "PostFlow_Project"
                current_month = datetime.now().strftime("%Y-%m")
                
                # Créer le dossier principal dans le Shared Drive
                main_folder_name = "PostFlow_Thumbnails"
                logger.info(f"📁 Création dossier principal dans Shared Drive: {main_folder_name}")
                main_folder_id = self._get_or_create_folder_in_shared_drive(main_folder_name, shared_drive_id)
                logger.info(f"✅ Dossier principal créé/trouvé: {main_folder_id}")
                
                # Créer le dossier projet
                logger.info(f"📁 Création dossier projet: {project_name}")
                project_folder_id = self._get_or_create_folder_in_shared_drive(project_name, shared_drive_id, main_folder_id)
                logger.info(f"✅ Dossier projet créé/trouvé: {project_folder_id}")
                
                # Créer le dossier du mois
                logger.info(f"📁 Création dossier mois: {current_month}")
                self._thumbnails_folder_id = self._get_or_create_folder_in_shared_drive(current_month, shared_drive_id, project_folder_id)
                logger.info(f"✅ Dossier final configuré dans Shared Drive: {self._thumbnails_folder_id}")
                
                logger.info(f"📁 Dossier Drive (Shared Drive): {main_folder_name}/{project_name}/{current_month}")
                return
            
            else:
                # Fallback vers dossier partagé spécifique (solution alternative)
                logger.warning("⚠️ Aucun Shared Drive disponible, utilisation d'un dossier partagé...")
                shared_folder_id = "11ywyx7AQSldrxyJnFIWPV9Atxh-s9jHs"  # Dossier partagé pour thumbnails
                logger.info(f"🔧 Configuration dossier partagé ID: {shared_folder_id}")
                
                project_name = "PostFlow_Project"
                current_month = datetime.now().strftime("%Y-%m")
                
                try:
                    # Créer le dossier principal dans le dossier partagé
                    main_folder_name = "PostFlow_Thumbnails"
                    logger.info(f"📁 Création dossier principal: {main_folder_name}")
                    main_folder_id = self._get_or_create_folder_in_shared_folder(main_folder_name, shared_folder_id)
                    logger.info(f"✅ Dossier principal créé/trouvé: {main_folder_id}")
                    
                    # Créer le dossier projet
                    logger.info(f"📁 Création dossier projet: {project_name}")
                    project_folder_id = self._get_or_create_folder_in_shared_folder(project_name, main_folder_id)
                    logger.info(f"✅ Dossier projet créé/trouvé: {project_folder_id}")
                    
                    # Créer le dossier du mois
                    logger.info(f"📁 Création dossier mois: {current_month}")
                    self._thumbnails_folder_id = self._get_or_create_folder_in_shared_folder(current_month, project_folder_id)
                    logger.info(f"✅ Dossier final configuré: {self._thumbnails_folder_id}")
                    
                    logger.info(f"📁 Dossier Drive (Partagé): {main_folder_name}/{project_name}/{current_month}")
                    return
                    
                except Exception as e:
                    logger.error(f"❌ Erreur création dossier dans dossier partagé: {e}")
                    logger.info("🔄 Fallback vers Drive personnel...")
                    
                    # Fallback vers Drive personnel (sans Shared Drive)
                    main_folder_name = "PostFlow_Thumbnails"
                    main_folder_id = self._get_or_create_folder_personal(main_folder_name)
                    
                    # Créer le dossier projet
                    project_folder_id = self._get_or_create_folder_personal(project_name, main_folder_id)
                    
                    # Créer le dossier du mois
                    self._thumbnails_folder_id = self._get_or_create_folder_personal(current_month, project_folder_id)
                    
                    logger.info(f"📁 Dossier Drive (Personnel): {main_folder_name}/{project_name}/{current_month}")
            
        except Exception as e:
            logger.error(f"❌ Erreur setup dossier Drive: {e}")
            # Fallback vers le stockage local uniquement
            self._thumbnails_folder_id = None
    
    def _get_shared_drive(self):
        """Récupère l'ID du premier Shared Drive disponible ou cherche un Shared Drive spécifique."""
        try:
            # Lister les Shared Drives disponibles pour le Service Account
            logger.info("🔍 Recherche des Shared Drives disponibles...")
            results = self._drive_service.drives().list().execute()
            drives = results.get('drives', [])
            
            if drives:
                # Lister tous les Shared Drives trouvés
                logger.info(f"📁 {len(drives)} Shared Drive(s) trouvé(s):")
                for drive in drives:
                    drive_id = drive['id']
                    drive_name = drive['name']
                    logger.info(f"  - {drive_name} (ID: {drive_id})")
                
                # Prendre le premier Shared Drive disponible
                first_drive = drives[0]
                drive_id = first_drive['id']
                drive_name = first_drive['name']
                logger.info(f"✅ Utilisation du Shared Drive: {drive_name} (ID: {drive_id})")
                return drive_id
            else:
                logger.warning("⚠️ Aucun Shared Drive accessible au Service Account")
                logger.info("💡 Le Service Account doit être invité dans un Shared Drive pour éviter les limitations de quota")
                return None
                
        except Exception as e:
            logger.warning(f"⚠️ Erreur accès Shared Drives: {e}")
            logger.info("💡 Vérifiez que le Service Account a accès aux Shared Drives de l'organisation")
            return None
    
    def _get_or_create_folder_in_shared_folder(self, folder_name, parent_id):
        """Trouve ou crée un dossier dans le dossier partagé spécifique."""
        try:
            # Construire la requête de recherche dans le dossier partagé
            query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and '{parent_id}' in parents"
            
            results = self._drive_service.files().list(
                q=query, 
                supportsAllDrives=True,
                includeItemsFromAllDrives=True
            ).execute()
            files = results.get('files', [])
            
            if files:
                return files[0]['id']
            
            # Créer le dossier dans le dossier partagé
            folder_metadata = {
                'name': folder_name,
                'mimeType': 'application/vnd.google-apps.folder',
                'parents': [parent_id]
            }
            
            folder = self._drive_service.files().create(
                body=folder_metadata,
                supportsAllDrives=True
            ).execute()
            return folder.get('id')
            
        except Exception as e:
            logger.error(f"❌ Erreur création dossier dans dossier partagé '{folder_name}': {e}")
            raise
    
    def _get_or_create_folder_in_shared_drive(self, folder_name, shared_drive_id, parent_id=None):
        """Trouve ou crée un dossier dans un Shared Drive spécifique."""
        try:
            # Construire la requête de recherche dans le Shared Drive
            query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder'"
            if parent_id:
                query += f" and '{parent_id}' in parents"
            
            # Paramètres pour recherche dans Shared Drive
            list_params = {
                'q': query,
                'driveId': shared_drive_id,
                'corpora': 'drive',
                'includeItemsFromAllDrives': True,
                'supportsAllDrives': True
            }
            
            results = self._drive_service.files().list(**list_params).execute()
            files = results.get('files', [])
            
            if files:
                return files[0]['id']
            
            # Créer le dossier dans le Shared Drive
            folder_metadata = {
                'name': folder_name,
                'mimeType': 'application/vnd.google-apps.folder'
            }
            
            # Si pas de parent, créer à la racine du Shared Drive
            if parent_id:
                folder_metadata['parents'] = [parent_id]
            else:
                folder_metadata['parents'] = [shared_drive_id]
            
            folder = self._drive_service.files().create(
                body=folder_metadata,
                supportsAllDrives=True
            ).execute()
            
            return folder.get('id')
            
        except Exception as e:
            logger.error(f"❌ Erreur création dossier Shared Drive '{folder_name}': {e}")
            raise
    
    def _get_or_create_folder_personal(self, folder_name, parent_id=None):
        """Trouve ou crée un dossier dans le Drive personnel."""
        try:
            # Construire la requête de recherche
            query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder'"
            if parent_id:
                query += f" and '{parent_id}' in parents"
            
            results = self._drive_service.files().list(q=query).execute()
            files = results.get('files', [])
            
            if files:
                return files[0]['id']
            
            # Créer le dossier
            folder_metadata = {
                'name': folder_name,
                'mimeType': 'application/vnd.google-apps.folder'
            }
            if parent_id:
                folder_metadata['parents'] = [parent_id]
            
            folder = self._drive_service.files().create(body=folder_metadata).execute()
            return folder.get('id')
            
        except Exception as e:
            logger.error(f"❌ Erreur création dossier personnel '{folder_name}': {e}")
            raise
            
        except Exception as e:
            logger.error(f"❌ Erreur création dossier {folder_name}: {e}")
            return None
    
    def _upload_to_drive(self, image_path, file_name):
        """Upload une image vers Google Drive (dossier partagé) et retourne l'URL publique."""
        try:
            from googleapiclient.http import MediaFileUpload
            
            # Vérifier que le dossier de destination existe
            if not self._thumbnails_folder_id:
                logger.error("❌ Dossier de destination Google Drive non configuré")
                return None
            
            logger.info(f"📁 Upload vers dossier ID: {self._thumbnails_folder_id}")
            
            # Vérifier les propriétés du dossier pour déterminer s'il fait partie d'un Shared Drive
            try:
                folder_info = self._drive_service.files().get(
                    fileId=self._thumbnails_folder_id,
                    fields='parents,driveId',
                    supportsAllDrives=True
                ).execute()
                
                drive_id = folder_info.get('driveId')
                logger.info(f"🔍 Dossier analysé - driveId: {drive_id}")
                
            except Exception as e:
                logger.warning(f"⚠️ Impossible d'analyser le dossier: {e}")
                drive_id = None
            
            # Métadonnées du fichier
            file_metadata = {
                'name': file_name,
                'parents': [self._thumbnails_folder_id]
            }
            
            # Upload du fichier avec support dossier partagé
            media = MediaFileUpload(image_path, mimetype='image/jpeg')
            
            # Paramètres d'upload adaptatifs selon le type de dossier
            upload_params = {
                'body': file_metadata,
                'media_body': media,
                'fields': 'id',
                'supportsAllDrives': True
            }
            
            # Si le dossier fait partie d'un Shared Drive, ajouter le driveId
            if drive_id:
                logger.info(f"📁 Upload vers Shared Drive ID: {drive_id}")
                # Note: Le driveId n'est pas nécessaire pour files().create(), 
                # mais supportsAllDrives=True devrait suffire
            else:
                logger.info("📁 Upload vers dossier partagé (non Shared Drive)")
            
            file = self._drive_service.files().create(**upload_params).execute()
            
            file_id = file.get('id')
            logger.info(f"✅ Fichier uploadé avec ID: {file_id}")
            
            # Rendre le fichier public avec support dossier partagé
            permission = {
                'type': 'anyone',
                'role': 'reader'
            }
            self._drive_service.permissions().create(
                fileId=file_id,
                body=permission,
                supportsAllDrives=True  # Support pour dossiers partagés
            ).execute()
            
            # URL publique pour Google Sheets =IMAGE() et Discord
            public_url = f"https://drive.google.com/thumbnail?id={file_id}&sz=w400"
            
            logger.info(f"☁️ Thumbnail uploadé vers dossier partagé: {file_name}")
            logger.info(f"🔗 URL publique: {public_url}")
            return public_url
            
        except Exception as e:
            logger.error(f"❌ Erreur upload Drive: {e}")
            logger.error(f"❌ Échec upload vers Google Drive")
            return None
    
    async def generate_with_drive_upload(self, video_or_thumbnail_path: str, shot_name: str = None) -> Optional[str]:
        """
        Génère un thumbnail et l'upload vers Google Drive.
        
        Args:
            video_or_thumbnail_path: Chemin vers le fichier vidéo OU vers un thumbnail existant
            shot_name: Nom du plan (optionnel)
            
        Returns:
            Optional[str]: URL publique du thumbnail sur Google Drive
        """
        try:
            path_obj = Path(video_or_thumbnail_path)
            
            # Vérifier si c'est déjà un thumbnail (image) ou un fichier vidéo
            if path_obj.suffix.lower() in ['.jpg', '.jpeg', '.png']:
                # C'est déjà un thumbnail, juste l'uploader
                logger.info(f"📤 Upload thumbnail existant vers Google Drive: {path_obj.name}")
                
                if shot_name:
                    drive_filename = f"thumb_{shot_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
                else:
                    drive_filename = f"thumb_{path_obj.stem}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
                
                # Configurer Google Drive
                if not self._drive_service:
                    if not self._setup_google_drive():
                        logger.error("❌ Google Drive non disponible")
                        return None
                
                if not self._thumbnails_folder_id:
                    self._setup_drive_folder()
                
                public_url = self._upload_to_drive(str(path_obj), drive_filename)
                
                if public_url:
                    logger.info(f"✅ Thumbnail uploadé vers Drive: {drive_filename}")
                    return public_url
                else:
                    logger.error("❌ Échec upload thumbnail vers Drive")
                    return None
            
            else:
                # C'est un fichier vidéo, générer le thumbnail puis l'uploader
                logger.info(f"🎬 Génération + upload thumbnail depuis vidéo: {path_obj.name}")
                
                # Générer le thumbnail
                thumbnail_path = await self.generate_with_public_url(video_or_thumbnail_path)
                return thumbnail_path
                
        except Exception as e:
            logger.error(f"❌ Erreur generate_with_drive_upload: {e}")
            return None

    async def upload_and_insert_to_sheets(self, video_or_thumbnail_path: str, shot_name: str, 
                                          sheets_adapter=None, row_number: int = None) -> Optional[str]:
        """
        Upload un thumbnail vers Google Drive et insère la formule =IMAGE() dans Google Sheets.
        
        Args:
            video_or_thumbnail_path: Chemin vers le fichier vidéo ou thumbnail
            shot_name: Nom du plan
            sheets_adapter: Instance de OptimizedSheetsStatusAdapter
            row_number: Numéro de ligne pour l'insertion directe
            
        Returns:
            Optional[str]: URL publique du thumbnail sur Google Drive
        """
        try:
            # 1. Upload vers Google Drive
            drive_url = await self.generate_with_drive_upload(video_or_thumbnail_path, shot_name)
            
            if not drive_url:
                logger.warning(f"⚠️ Échec upload thumbnail pour {shot_name}")
                return None
            
            # 2. Insertion dans Google Sheets si adaptateur fourni
            if sheets_adapter:
                if row_number:
                    # Insertion directe si numéro de ligne fourni
                    success = await sheets_adapter.update_status(
                        row_number=row_number,
                        status=None,
                        additional_data={'thumbnail_url': drive_url}
                    )
                    if success:
                        logger.info(f"📸 Thumbnail inséré ligne {row_number}: {shot_name}")
                else:
                    # Recherche automatique du shot
                    found_row = await sheets_adapter.find_shot_row(shot_name)
                    if found_row:
                        success = await sheets_adapter.update_status(
                            row_number=found_row,
                            status=None,
                            additional_data={'thumbnail_url': drive_url}
                        )
                        if success:
                            logger.info(f"📸 Thumbnail inséré automatiquement ligne {found_row}: {shot_name}")
            
            return drive_url
            
        except Exception as e:
            logger.error(f"❌ Erreur upload_and_insert_to_sheets: {e}")
            return None

    async def bulk_process_thumbnails(self, file_paths: List[str], sheets_adapter=None, 
                                    shot_name_extractor=None) -> Dict[str, Any]:
        """
        Traite plusieurs thumbnails en batch avec OptimizedSheetsStatusAdapter.
        
        Args:
            file_paths: Liste des chemins de fichiers à traiter
            sheets_adapter: Instance de OptimizedSheetsStatusAdapter
            shot_name_extractor: Fonction pour extraire le nom du shot
            
        Returns:
            Dict: Résultats du traitement batch
        """
        try:
            results = {
                'processed': 0,
                'uploaded': 0,
                'sheets_updated': 0,
                'errors': [],
                'urls': {}
            }
            
            batch_updates = []
            
            for file_path in file_paths:
                try:
                    # Extraire le nom du shot
                    if shot_name_extractor:
                        shot_name = shot_name_extractor(file_path)
                    else:
                        shot_name = Path(file_path).stem
                    
                    # Upload vers Google Drive
                    drive_url = await self.generate_with_drive_upload(file_path, shot_name)
                    
                    results['processed'] += 1
                    
                    if drive_url:
                        results['uploaded'] += 1
                        results['urls'][shot_name] = drive_url
                        
                        # Préparer pour batch update
                        if sheets_adapter:
                            row_number = await sheets_adapter.find_shot_row(shot_name)
                            if row_number:
                                batch_updates.append({
                                    'row_number': row_number,
                                    'status': None,
                                    'additional_data': {'thumbnail_url': drive_url}
                                })
                    else:
                        results['errors'].append(f"Échec upload: {shot_name}")
                        
                except Exception as item_error:
                    results['errors'].append(f"Erreur {file_path}: {item_error}")
            
            # Exécuter les mises à jour en batch
            if batch_updates and sheets_adapter:
                try:
                    batch_success = await sheets_adapter.batch_update_multiple_rows(batch_updates)
                    if batch_success:
                        results['sheets_updated'] = len(batch_updates)
                        logger.info(f"📊 Batch update réussi: {len(batch_updates)} thumbnails insérés")
                    else:
                        results['errors'].append("Échec batch update Google Sheets")
                        
                except Exception as batch_error:
                    results['errors'].append(f"Erreur batch update: {batch_error}")
            
            logger.info(f"🎯 Traitement batch terminé: {results['uploaded']}/{results['processed']} thumbnails uploadés")
            return results
            
        except Exception as e:
            logger.error(f"❌ Erreur bulk_process_thumbnails: {e}")
            return {'error': str(e)}


def create_thumbnail_generator(ffmpeg_path: str = "ffmpeg") -> ThumbnailGenerator:
    """
    Créer un générateur de thumbnails.
    
    Args:
        ffmpeg_path: Chemin vers ffmpeg
        
    Returns:
        ThumbnailGenerator: Instance du générateur
    """
    return ThumbnailGenerator(ffmpeg_path)
