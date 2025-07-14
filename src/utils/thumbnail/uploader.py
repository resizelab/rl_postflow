#!/usr/bin/env python3
"""
Uploader pour thumbnails avec Hostinger uniquement
Module simplifié pour upload et gestion des URLs publiques
"""

import logging
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


class ThumbnailUploader:
    """Uploader Hostinger-only pour thumbnails."""
    
    def __init__(self, config_manager=None):
        """
        Initialiser l'uploader.
        
        Args:
            config_manager: Instance de ConfigManager (optionnel)
        """
        self.config_manager = config_manager
        self._hostinger_uploader = None
    
    def _get_hostinger_uploader(self):
        """Initialise l'uploader Hostinger si nécessaire."""
        if self._hostinger_uploader is None:
            try:
                from .hostinger_uploader import HostingerUploader
                self._hostinger_uploader = HostingerUploader()
            except ImportError as e:
                logger.warning(f"⚠️ Module Hostinger non disponible: {e}")
                self._hostinger_uploader = False
        
        return self._hostinger_uploader if self._hostinger_uploader is not False else None
    
    def upload_thumbnail(self, image_path: str, shot_id: str = None, version: str = None) -> Optional[str]:
        """
        Upload une image vers Hostinger.
        
        Args:
            image_path: Chemin local de l'image
            shot_id: ID du shot
            version: Version du shot
            
        Returns:
            str: URL publique ou None si échec
        """
        # Upload via Hostinger
        hostinger_uploader = self._get_hostinger_uploader()
        if hostinger_uploader and hostinger_uploader.is_enabled():
            logger.info("📤 Upload via Hostinger...")
            result = hostinger_uploader.upload_thumbnail(image_path, shot_id or "unknown", version or "v1")
            if result:
                return result
            else:
                logger.error("❌ Upload Hostinger échoué")
                return None
        else:
            logger.error("❌ Hostinger non configuré ou non disponible")
            return None
    
    def is_available(self) -> bool:
        """Vérifie si le service d'upload est disponible."""
        hostinger_uploader = self._get_hostinger_uploader()
        return hostinger_uploader and hostinger_uploader.is_enabled()
    
    def test_connection(self) -> bool:
        """Teste la connexion au service d'upload."""
        hostinger_uploader = self._get_hostinger_uploader()
        if hostinger_uploader and hostinger_uploader.is_enabled():
            return hostinger_uploader.test_connection()
        return False
    
    def get_status(self) -> dict:
        """Retourne le statut du service d'upload."""
        hostinger_uploader = self._get_hostinger_uploader()
        
        return {
            'hostinger_available': hostinger_uploader is not None and hostinger_uploader is not False,
            'hostinger_enabled': hostinger_uploader and hostinger_uploader.is_enabled(),
            'hostinger_connected': hostinger_uploader and hostinger_uploader.test_connection() if hostinger_uploader else False
        }
