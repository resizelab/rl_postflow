#!/usr/bin/env python3
"""
Module de génération de thumbnails pour PostFlow
Interface publique simplifiée avec upload Hostinger uniquement
Google Sheets reste intégré pour les mises à jour
"""

import logging
from typing import Optional
from .generator import ThumbnailGenerator as BaseGenerator
from .uploader import ThumbnailUploader

logger = logging.getLogger(__name__)


class ThumbnailGenerator:
    """
    Générateur de thumbnails unifié pour PostFlow.
    Orchestre la génération, l'upload Hostinger et l'intégration Google Sheets.
    """
    
    def __init__(self, config_or_ffmpeg_path="ffmpeg"):
        """
        Initialiser le générateur unifié.
        
        Args:
            config_or_ffmpeg_path: ConfigManager ou chemin vers ffmpeg
        """
        # Initialiser les composants
        self.generator = BaseGenerator(config_or_ffmpeg_path)
        self.uploader = None
        
        # Configurer les services d'upload si ConfigManager disponible
        if hasattr(config_or_ffmpeg_path, 'get'):
            self.config_manager = config_or_ffmpeg_path
            logger.info("🔧 Initialisation service d'upload Hostinger pour thumbnails...")
            self._setup_upload_service()
        else:
            self.config_manager = None
            logger.info("🔧 Mode local uniquement (pas de ConfigManager)")
    
    def _setup_upload_service(self):
        """Configure le service d'upload Hostinger uniquement."""
        try:
            # Initialiser l'uploader Hostinger uniquement
            self.uploader = ThumbnailUploader(config_manager=self.config_manager)
            
            # Tester Hostinger
            hostinger_uploader = self.uploader._get_hostinger_uploader()
            if hostinger_uploader and hostinger_uploader.is_enabled():
                if hostinger_uploader.test_connection():
                    logger.info("✅ Hostinger configuré et connecté")
                else:
                    logger.warning("⚠️ Hostinger configuré mais connexion échouée")
            else:
                logger.warning("⚠️ Hostinger non configuré - thumbnails locaux uniquement")
            
        except Exception as e:
            logger.error(f"❌ Erreur configuration service upload: {e}")
    
    # =================== Interface publique ===================
    
    def generate(self, video_path: str, output_path: str = None, timestamp: str = "00:00:01") -> Optional[str]:
        """Génère un thumbnail depuis une vidéo (local uniquement)."""
        import asyncio
        
        # Gérer l'event loop pour les appels synchrones
        try:
            # Essayer d'obtenir le loop existant
            loop = asyncio.get_event_loop()
            if loop.is_running():
                # Si le loop est en cours, créer une nouvelle tâche
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    future = executor.submit(asyncio.run, self.generator.generate(video_path, output_path, timestamp))
                    return future.result()
            else:
                # Si pas de loop en cours, utiliser run
                return asyncio.run(self.generator.generate(video_path, output_path, timestamp))
        except RuntimeError:
            # Pas de loop, créer un nouveau
            return asyncio.run(self.generator.generate(video_path, output_path, timestamp))
    
    def generate_with_hostinger_upload(self, video_or_thumbnail_path: str, shot_id: str = None, version: str = None) -> Optional[str]:
        """Génère un thumbnail et l'upload vers Hostinger."""
        if not self.uploader:
            logger.error("❌ Aucun service d'upload configuré")
            return None
        
        # Extraire shot_id et version du nom si pas fournis
        if not shot_id or not version:
            try:
                from src.integrations.frameio.upload import validate_strict_nomenclature
                nomenclature = validate_strict_nomenclature(video_or_thumbnail_path)
                shot_id = shot_id or nomenclature.get('shot_id', 'unknown')
                version = version or nomenclature.get('version', 'v1')
            except:
                shot_id = shot_id or 'unknown'
                version = version or 'v1'
        
        # Générer le thumbnail si c'est une vidéo
        if video_or_thumbnail_path.lower().endswith(('.mp4', '.mov', '.avi', '.mkv')):
            thumbnail_path = self.generate(video_or_thumbnail_path)
            if not thumbnail_path:
                return None
        else:
            thumbnail_path = video_or_thumbnail_path
        
        # Upload vers Hostinger
        return self.uploader.upload_thumbnail(thumbnail_path, shot_id, version)
    
    # Alias pour compatibilité (à supprimer plus tard)
    def generate_with_drive_upload(self, video_or_thumbnail_path: str, shot_id: str = None, version: str = None) -> Optional[str]:
        """DEPRECATED: Utiliser generate_with_hostinger_upload() à la place."""
        logger.warning("⚠️ generate_with_drive_upload() est deprecated, utilisez generate_with_hostinger_upload()")
        return self.generate_with_hostinger_upload(video_or_thumbnail_path, shot_id, version)
    
    def upload_to_external_service(self, thumbnail_path: str, shot_id: str = None, version: str = None) -> Optional[str]:
        """Uploader un thumbnail vers Hostinger."""
        if not self.uploader:
            logger.error("❌ Aucun service d'upload configuré")
            return None
        
        return self.uploader.upload_thumbnail(thumbnail_path, shot_id or 'unknown', version or 'v1')
    
    def upload_and_insert_to_sheets(self, video_or_thumbnail_path: str, shot_name: str, 
                                    sheets_adapter=None, row_number: int = None) -> Optional[str]:
        """Upload un thumbnail vers Hostinger et insère la formule =IMAGE() dans Google Sheets."""
        
        # Upload vers Hostinger
        public_url = self.generate_with_hostinger_upload(video_or_thumbnail_path)
        
        if not public_url:
            logger.error("❌ Échec upload thumbnail vers Hostinger")
            return None
        
        # Insérer dans Google Sheets si adapter fourni
        if sheets_adapter and row_number:
            try:
                # Utiliser la formule =IMAGE() pour Google Sheets
                image_formula = f'=IMAGE("{public_url}")'
                
                # Mettre à jour Google Sheets
                if hasattr(sheets_adapter, 'update_cell'):
                    sheets_adapter.update_cell(row_number, 'thumbnail_column', image_formula)
                    logger.info(f"✅ Formule =IMAGE() insérée dans Google Sheets: {image_formula}")
                else:
                    logger.warning("⚠️ Adapter Google Sheets non compatible")
                
            except Exception as e:
                logger.error(f"❌ Erreur insertion Google Sheets: {e}")
        
        return public_url
    
    def get_status(self) -> dict:
        """Retourne le statut des services."""
        hostinger_status = False
        
        if self.uploader:
            hostinger_uploader = self.uploader._get_hostinger_uploader()
            if hostinger_uploader and hostinger_uploader.is_enabled():
                hostinger_status = True
        
        return {
            'generator_available': True,
            'hostinger_configured': hostinger_status,
            'config_manager_available': self.config_manager is not None
        }


# Interface publique simplifiée
def create_thumbnail_generator(config_or_ffmpeg_path="ffmpeg"):
    """
    Créer un générateur de thumbnails unifié.
    
    Args:
        config_or_ffmpeg_path: ConfigManager ou chemin vers ffmpeg
        
    Returns:
        ThumbnailGenerator: Instance du générateur
    """
    return ThumbnailGenerator(config_or_ffmpeg_path)


# Export de l'interface publique
__all__ = [
    'ThumbnailGenerator',
    'create_thumbnail_generator'
]
