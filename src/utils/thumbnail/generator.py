#!/usr/bin/env python3
"""
Générateur de thumbnails FFmpeg pour PostFlow
Module focalisé sur la génération pure des thumbnails
"""

import os
import logging
import asyncio
import subprocess
from pathlib import Path
from typing import Optional, Dict, Any
from datetime import datetime

logger = logging.getLogger(__name__)


class ThumbnailGenerator:
    """Générateur de thumbnails pour fichiers vidéo via FFmpeg."""
    
    def __init__(self, config_or_ffmpeg_path="ffmpeg"):
        """
        Initialiser le générateur.
        
        Args:
            config_or_ffmpeg_path: ConfigManager ou chemin vers ffmpeg
        """
        if hasattr(config_or_ffmpeg_path, 'get'):
            # C'est un ConfigManager
            self.config = config_or_ffmpeg_path
            self.config_manager = config_or_ffmpeg_path
            self.ffmpeg_path = "ffmpeg"
            self.output_dir = config_or_ffmpeg_path.get('workflow.thumbnail_output_dir', 'output/thumbnails')
        else:
            # C'est un chemin ffmpeg
            self.ffmpeg_path = config_or_ffmpeg_path
            self.config = None
            self.config_manager = None
            self.output_dir = "output/thumbnails"
        
        self._verify_ffmpeg()
    
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
    
    async def generate(self, video_path: str, output_dir: str = None, 
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
            if not output_dir:
                output_dir = self.output_dir
                
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
                    timestamp = "00:00:00.5"
                elif duration < 5:
                    timestamp = "00:00:01"
                else:
                    timestamp = "00:00:05"
            
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
        """Essayer différentes méthodes de génération de thumbnail."""
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
                "-v", "error",
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
            return process.returncode == 0 and thumbnail_path.exists() and thumbnail_path.stat().st_size > 0
            
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
            return process.returncode == 0 and thumbnail_path.exists() and thumbnail_path.stat().st_size > 0
            
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
            return process.returncode == 0 and thumbnail_path.exists() and thumbnail_path.stat().st_size > 0
            
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
            return process.returncode == 0 and thumbnail_path.exists() and thumbnail_path.stat().st_size > 0
            
        except Exception as e:
            logger.debug(f"Méthode 4 échouée: {e}")
            return False
    
    def get_video_info(self, video_path: str) -> Dict[str, Any]:
        """Obtenir les informations d'un fichier vidéo."""
        try:
            import json
            
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
    
    def cleanup_old_thumbnails(self, output_dir: str = None, max_age_days: int = 7):
        """Nettoyer les anciens thumbnails."""
        try:
            if not output_dir:
                output_dir = self.output_dir
                
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
