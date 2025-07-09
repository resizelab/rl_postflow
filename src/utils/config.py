#!/usr/bin/env python3
"""
Configuration Manager pour PostFlow
Gère la configuration centralisée des intégrations
"""

import os
import json
import logging
from typing import Dict, Any, Optional
from pathlib import Path

logger = logging.getLogger(__name__)


class ConfigManager:
    """Gestionnaire de configuration centralisé."""
    
    def __init__(self, config_path: str = "config/integrations.json"):
        """
        Initialiser le gestionnaire de configuration.
        
        Args:
            config_path: Chemin vers le fichier de configuration
        """
        self.config_path = Path(config_path)
        self._config = {}
        self._load_config()
    
    def _load_config(self):
        """Charger la configuration depuis le fichier."""
        try:
            if self.config_path.exists():
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    self._config = json.load(f)
                logger.info(f"✅ Configuration chargée: {self.config_path}")
            else:
                logger.warning(f"⚠️ Fichier de configuration introuvable: {self.config_path}")
                self._config = {}
        except Exception as e:
            logger.error(f"❌ Erreur chargement configuration: {e}")
            self._config = {}
    
    def reload_config(self):
        """Recharger la configuration depuis le fichier."""
        self._load_config()
    
    def get_config(self, section: str = None) -> Dict[str, Any]:
        """
        Obtenir une section de configuration.
        
        Args:
            section: Nom de la section (None pour toute la config)
            
        Returns:
            Dict: Configuration demandée
        """
        if section is None:
            return self._config
        
        return self._config.get(section, {})
    
    def get_value(self, section: str, key: str, default: Any = None) -> Any:
        """
        Obtenir une valeur spécifique de configuration.
        
        Args:
            section: Nom de la section
            key: Clé de la valeur
            default: Valeur par défaut
            
        Returns:
            Any: Valeur de configuration
        """
        section_config = self.get_config(section)
        return section_config.get(key, default)
    
    def get(self, key_path: str, default: Any = None) -> Any:
        """
        Obtenir une valeur de configuration via un chemin de clé.
        
        Args:
            key_path: Chemin de la clé (ex: "section.key")
            default: Valeur par défaut
            
        Returns:
            Any: Valeur de configuration
        """
        try:
            parts = key_path.split('.')
            current = self._config
            
            for part in parts:
                if isinstance(current, dict) and part in current:
                    current = current[part]
                else:
                    return default
            
            return current
        except Exception:
            return default
    
    def set_value(self, section: str, key: str, value: Any):
        """
        Définir une valeur de configuration.
        
        Args:
            section: Nom de la section
            key: Clé de la valeur
            value: Nouvelle valeur
        """
        if section not in self._config:
            self._config[section] = {}
        
        self._config[section][key] = value
    
    def save_config(self):
        """Sauvegarder la configuration dans le fichier."""
        try:
            # Créer le dossier si nécessaire
            self.config_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(self.config_path, 'w', encoding='utf-8') as f:
                json.dump(self._config, f, indent=2, ensure_ascii=False)
            
            logger.info(f"✅ Configuration sauvegardée: {self.config_path}")
            
        except Exception as e:
            logger.error(f"❌ Erreur sauvegarde configuration: {e}")
    
    def get_frameio_config(self) -> Dict[str, Any]:
        """Obtenir la configuration Frame.io."""
        return self.get_config("frameio")
    
    def get_discord_config(self) -> Dict[str, Any]:
        """Obtenir la configuration Discord."""
        return self.get_config("discord")
    
    def get_sheets_config(self) -> Dict[str, Any]:
        """Obtenir la configuration Google Sheets."""
        return self.get_config("sheets")
    
    def get_lucidlink_config(self) -> Dict[str, Any]:
        """Obtenir la configuration LucidLink."""
        return self.get_config("lucidlink")
    
    def validate_config(self) -> bool:
        """
        Valider la configuration.
        
        Returns:
            bool: True si la configuration est valide
        """
        required_sections = ["frameio", "discord", "sheets", "lucidlink"]
        
        for section in required_sections:
            if section not in self._config:
                logger.error(f"❌ Section manquante: {section}")
                return False
        
        # Valider Frame.io
        frameio_config = self.get_frameio_config()
        if not frameio_config.get("token"):
            logger.error("❌ Token Frame.io manquant")
            return False
        
        # Valider Discord
        discord_config = self.get_discord_config()
        if not discord_config.get("webhook_url"):
            logger.error("❌ Webhook Discord manquant")
            return False
        
        # Valider Google Sheets
        sheets_config = self.get_sheets_config()
        if not sheets_config.get("spreadsheet_id"):
            logger.error("❌ ID spreadsheet Google Sheets manquant")
            return False
        
        # Valider LucidLink
        lucidlink_config = self.get_lucidlink_config()
        if not lucidlink_config.get("watch_directory"):
            logger.error("❌ Répertoire LucidLink manquant")
            return False
        
        logger.info("✅ Configuration valide")
        return True
    
    def create_default_config(self):
        """Créer une configuration par défaut."""
        default_config = {
            "frameio": {
                "token": "",
                "project_id": "",
                "upload_folder": "UNDLM_EXPORTS",
                "enable_review_links": True,
                "enable_share_links": True
            },
            "discord": {
                "webhook_url": "",
                "username": "PostFlow",
                "avatar_url": "",
                "enable_notifications": True
            },
            "sheets": {
                "spreadsheet_id": "",
                "credentials_path": "config/google_credentials.json",
                "scopes": [
                    "https://www.googleapis.com/auth/spreadsheets",
                    "https://www.googleapis.com/auth/drive.readonly"
                ]
            },
            "lucidlink": {
                "watch_directory": "/Volumes/LucidLink/UNDLM_EXPORTS",
                "watch_patterns": [
                    "UNDLM_\\d+_v\\d+\\.(mov|mp4|avi|mxf)$",
                    ".*_v\\d+\\.(mov|mp4|avi|mxf)$"
                ],
                "stability_timeout": 30
            },
            "workflow": {
                "enable_thumbnails": True,
                "thumbnail_output_dir": "output/thumbnails",
                "enable_frameio_upload": True,
                "enable_discord_notifications": True,
                "enable_sheets_updates": True
            }
        }
        
        self._config = default_config
        self.save_config()
        
        logger.info("✅ Configuration par défaut créée")


def get_config_manager(config_path: str = None) -> ConfigManager:
    """
    Obtenir une instance du gestionnaire de configuration.
    
    Args:
        config_path: Chemin vers le fichier de configuration
        
    Returns:
        ConfigManager: Instance du gestionnaire
    """
    return ConfigManager(config_path or "config/integrations.json")
