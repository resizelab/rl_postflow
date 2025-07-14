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
from pathlib import Path
from typing import Optional, Dict, Any
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
            self.ffmpeg_path = "ffmpeg"  # Par défaut
            self.output_dir = config_or_ffmpeg_path.get('workflow.thumbnail_output_dir', 'output/thumbnails')
        else:
            # C'est un chemin ffmpeg
            self.ffmpeg_path = config_or_ffmpeg_path
            self.config = None
            self.output_dir = "output/thumbnails"
        
        self._verify_ffmpeg()
        self._drive_service = None
        self._thumbnails_folder_id = None
    
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
        Générer un thumbnail et retourner une URL publique accessible.
        
        Args:
            video_path: Chemin du fichier vidéo
            output_dir: Répertoire de sortie (optionnel)
            timestamp: Timestamp pour le thumbnail
            size: Taille du thumbnail
            
        Returns:
            str: URL publique du thumbnail ou None si échec
        """
        try:
            # 1. Générer le thumbnail localement
            thumbnail_path = await self.generate_thumbnail(video_path, output_dir, timestamp, size)
            if not thumbnail_path:
                logger.error("❌ Impossible de générer le thumbnail")
                return None
                
            # 2. Essayer d'uploader vers un service externe
            public_url = await self.upload_to_external_service(thumbnail_path)
            if public_url:
                logger.info(f"✅ Thumbnail uploadé vers service externe: {public_url}")
                return public_url
            
            # 3. Fallback: utiliser le serveur HTTP partagé si disponible
            public_url = await self._serve_via_shared_server(thumbnail_path)
            if public_url:
                logger.info(f"✅ Thumbnail servi via serveur partagé: {public_url}")
                return public_url
            
            # 4. Dernier fallback: URL file:// (ne fonctionnera pas pour Discord)
            logger.warning(f"⚠️ Aucune URL publique disponible, fallback vers file://")
            return f"file://{thumbnail_path}"
            
        except Exception as e:
            logger.error(f"❌ Erreur génération thumbnail avec URL publique: {e}")
            return None
    
    async def _serve_via_shared_server(self, thumbnail_path: str) -> Optional[str]:
        """
        Servir un thumbnail via le serveur HTTP partagé (avec Cloudflare si disponible).
        
        Args:
            thumbnail_path: Chemin local du thumbnail
            
        Returns:
            str: URL publique ou None
        """
        try:
            # Essayer d'importer les modules du serveur partagé
            try:
                from ..integrations.frameio.range_server import RangeFileServer
                from ..integrations.frameio.cloudflare_manager import CloudflareManager
            except ImportError:
                logger.warning("⚠️ Modules serveur partagé non disponibles")
                return None
            
            # Créer ou utiliser un serveur existant
            # Note: Dans un vrai déploiement, on utiliserait le serveur partagé global
            temp_server = RangeFileServer()
            temp_server.start()
            
            # Ajouter le fichier au serveur
            local_url = temp_server.add_file(thumbnail_path)
            if not local_url:
                logger.error("❌ Impossible d'ajouter le thumbnail au serveur")
                return None
            
            # Essayer d'utiliser Cloudflare pour une URL publique
            try:
                cloudflare_manager = CloudflareManager()
                tunnel_url = cloudflare_manager.start_tunnel(temp_server.actual_port)
                
                if tunnel_url:
                    # Construire l'URL publique
                    filename = local_url.split('/')[-1]
                    public_url = f"{tunnel_url}/{filename}"
                    
                    logger.info(f"✅ Thumbnail accessible via Cloudflare: {public_url}")
                    return public_url
                    
            except Exception as e:
                logger.warning(f"⚠️ Impossible d'utiliser Cloudflare pour le thumbnail: {e}")
            
            # Fallback: URL locale (ne fonctionnera que localement)
            logger.warning(f"⚠️ Thumbnail seulement accessible localement: {local_url}")
            return local_url
            
        except Exception as e:
            logger.error(f"❌ Erreur serveur partagé pour thumbnail: {e}")
            return None

    async def upload_to_external_service(self, thumbnail_path: str) -> Optional[str]:
        """
        Uploader un thumbnail vers un service externe (Imgur, etc.).
        
        Args:
            thumbnail_path: Chemin local du thumbnail
            
        Returns:
            str: URL publique ou None
        """
        try:
            # TODO: Implémenter l'upload vers Imgur ou un autre service
            # Pour l'instant, retourner None pour forcer l'utilisation du serveur local
            
            logger.info(f"🔄 Upload externe non implémenté pour: {thumbnail_path}")
            return None
            
        except Exception as e:
            logger.error(f"❌ Erreur upload externe: {e}")
            return None

    def _setup_google_drive(self):
        """Configure Google Drive pour l'upload des thumbnails."""
        # Désactivé temporairement - problème de quota service account
        logger.warning("⚠️ Google Drive désactivé temporairement (quota service account)")
        return False
    
    def _setup_drive_folder(self):
        """Crée et configure le dossier Google Drive pour les thumbnails."""
        try:
            from datetime import datetime
            
            project_name = "PostFlow_Project"
            current_month = datetime.now().strftime("%Y-%m")
            
            # Créer le dossier principal
            main_folder_name = "PostFlow_Thumbnails"
            main_folder_id = self._get_or_create_folder(main_folder_name)
            
            # Créer le dossier projet
            project_folder_id = self._get_or_create_folder(project_name, main_folder_id)
            
            # Créer le dossier du mois
            self._thumbnails_folder_id = self._get_or_create_folder(current_month, project_folder_id)
            
            logger.info(f"📁 Dossier Drive: {main_folder_name}/{project_name}/{current_month}")
            
        except Exception as e:
            logger.error(f"❌ Erreur setup dossier Drive: {e}")
    
    def _get_or_create_folder(self, folder_name, parent_id=None):
        """Trouve ou crée un dossier dans Google Drive."""
        try:
            # Chercher le dossier existant
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
            logger.error(f"❌ Erreur création dossier {folder_name}: {e}")
            return None
    
    def _upload_to_drive(self, image_path, file_name):
        """Upload une image vers Google Drive et retourne l'URL publique."""
        try:
            from googleapiclient.http import MediaFileUpload
            
            # Métadonnées du fichier
            file_metadata = {
                'name': file_name,
                'parents': [self._thumbnails_folder_id]
            }
            
            # Upload du fichier
            media = MediaFileUpload(image_path, mimetype='image/jpeg')
            file = self._drive_service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id'
            ).execute()
            
            file_id = file.get('id')
            
            # Rendre le fichier public
            permission = {
                'type': 'anyone',
                'role': 'reader'
            }
            self._drive_service.permissions().create(
                fileId=file_id,
                body=permission
            ).execute()
            
            # URL publique pour Discord (affichage direct)
            public_url = f"https://drive.google.com/thumbnail?id={file_id}&sz=w400"
            
            logger.info(f"☁️ Thumbnail uploadé: {file_name}")
            return public_url
            
        except Exception as e:
            logger.error(f"❌ Erreur upload Drive: {e}")
            return None
    
    async def generate_with_drive_upload(self, video_or_thumbnail_path: str, shot_name: str = None) -> Optional[str]:
        """
        Génère un thumbnail et l'upload vers Google Drive, ou upload un thumbnail existant.
        
        Args:
            video_or_thumbnail_path: Chemin vers le fichier vidéo OU vers un thumbnail existant
            shot_name: Nom du plan (optionnel)
            
        Returns:
            Optional[str]: URL publique du thumbnail sur Google Drive
        """
        try:
            # Configurer Google Drive si nécessaire
            if not self._drive_service:
                if not self._setup_google_drive():
                    logger.warning("⚠️ Google Drive non disponible, fallback vers méthode locale")
                    return await self.generate_with_public_url(video_or_thumbnail_path)
            
            path_obj = Path(video_or_thumbnail_path)
            
            # Vérifier si c'est déjà un thumbnail (image) ou un fichier vidéo
            if path_obj.suffix.lower() in ['.jpg', '.jpeg', '.png']:
                # C'est déjà un thumbnail, juste l'uploader
                logger.info(f"📤 Upload thumbnail existant vers Google Drive: {path_obj.name}")
                
                if shot_name:
                    drive_filename = f"thumb_{shot_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
                else:
                    drive_filename = f"thumb_{path_obj.stem}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
                
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
                
                # Créer le répertoire temporaire
                temp_dir = Path("temp/thumbnails")
                temp_dir.mkdir(parents=True, exist_ok=True)
                
                # Nom du fichier
                video_name = path_obj.stem
                if shot_name:
                    output_name = f"thumb_{shot_name}_{video_name}"
                else:
                    output_name = f"thumb_{video_name}"
                
                temp_image = temp_dir / f"{output_name}.jpg"
                
                # Générer le thumbnail avec notre système robuste
                success = await self._try_thumbnail_generation(video_or_thumbnail_path, temp_image, "00:00:02")
                
                if not success or not temp_image.exists():
                    logger.error(f"❌ Échec génération thumbnail pour: {video_name}")
                    return None
                
                # Upload vers Google Drive
                drive_filename = f"{output_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
                public_url = self._upload_to_drive(str(temp_image), drive_filename)
                
                # Nettoyer le fichier temporaire
                try:
                    temp_image.unlink()
                except:
                    pass
                
                if public_url:
                    logger.info(f"✅ Thumbnail généré et uploadé: {drive_filename}")
                    return public_url
                else:
                    logger.warning("⚠️ Échec upload Drive, fallback vers méthode locale")
                    return await self.generate_with_public_url(video_or_thumbnail_path)
                
        except Exception as e:
            logger.error(f"❌ Erreur generate_with_drive_upload: {e}")
            # Fallback vers la méthode locale
            return await self.generate_with_public_url(video_or_thumbnail_path)

def create_thumbnail_generator(ffmpeg_path: str = "ffmpeg") -> ThumbnailGenerator:
    """
    Créer un générateur de thumbnails.
    
    Args:
        ffmpeg_path: Chemin vers ffmpeg
        
    Returns:
        ThumbnailGenerator: Instance du générateur
    """
    return ThumbnailGenerator(ffmpeg_path)
