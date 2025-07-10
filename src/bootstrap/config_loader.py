#!/usr/bin/env python3
"""
🔧 Configuration Loader - Bootstrap Module
==========================================

Charge et valide la configuration du pipeline PostFlow.
Extrait de main.py pour une meilleure organisation.

Version: 4.1.1
Date: 9 juillet 2025
"""

import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional
from src.utils.config import ConfigManager

logger = logging.getLogger(__name__)


class ConfigLoader:
    """Gestionnaire de chargement et validation de la configuration"""
    
    def __init__(self, config_path: Optional[Path] = None):
        self.config_path = config_path
        self.project_root = Path(__file__).parent.parent.parent
        self.config_dir = self.project_root / "config"
        self.config_manager = None
        self.config = {}
        self.pipeline_config = {}
        
    def load_configurations(self) -> tuple[Dict[str, Any], Dict[str, Any], ConfigManager]:
        """
        Charge toutes les configurations nécessaires
        
        Returns:
            tuple: (config, pipeline_config, config_manager)
        """
        try:
            logger.info("🔧 Chargement des configurations...")
            
            # Initialiser le gestionnaire de configuration
            main_config_path = self.config_path or (self.config_dir / "integrations.json")
            self.config_manager = ConfigManager(str(main_config_path))
            
            # Charger la configuration principale
            main_config_path = self.config_path or (self.config_dir / "integrations.json")
            
            if main_config_path.exists():
                logger.info(f"📄 Chargement de la configuration: {main_config_path}")
                with open(main_config_path, 'r', encoding='utf-8') as f:
                    self.config = json.load(f)
            else:
                logger.warning(f"⚠️ Configuration non trouvée: {main_config_path}")
                logger.info("📝 Création d'une configuration par défaut...")
                self.config = self._create_default_config()
                
                # Sauvegarder la configuration par défaut
                with open(main_config_path, 'w', encoding='utf-8') as f:
                    json.dump(self.config, f, indent=2, ensure_ascii=False)
                logger.info(f"✅ Configuration par défaut créée: {main_config_path}")
            
            # Charger la configuration du pipeline
            pipeline_config_path = self.project_root / "pipeline_config.json"
            
            if pipeline_config_path.exists():
                logger.info(f"📄 Chargement de la configuration pipeline: {pipeline_config_path}")
                with open(pipeline_config_path, 'r', encoding='utf-8') as f:
                    self.pipeline_config = json.load(f)
            else:
                logger.warning(f"⚠️ Configuration pipeline non trouvée: {pipeline_config_path}")
                logger.info("📝 Création d'une configuration pipeline par défaut...")
                self.pipeline_config = self._create_default_pipeline_config()
                
                # Sauvegarder la configuration pipeline par défaut
                with open(pipeline_config_path, 'w', encoding='utf-8') as f:
                    json.dump(self.pipeline_config, f, indent=2, ensure_ascii=False)
                logger.info(f"✅ Configuration pipeline par défaut créée: {pipeline_config_path}")
            
            # Valider les configurations
            self._validate_configurations()
            
            logger.info("✅ Configurations chargées avec succès")
            return self.config, self.pipeline_config, self.config_manager
            
        except Exception as e:
            logger.error(f"❌ Erreur lors du chargement des configurations: {e}")
            raise
    
    def _create_default_config(self) -> Dict[str, Any]:
        """Crée une configuration par défaut"""
        return {
            "frameio": {
                "client_id": "YOUR_CLIENT_ID",
                "client_secret": "YOUR_CLIENT_SECRET",
                "redirect_uri": "http://localhost:8080/callback",
                "scope": "offline asset.create asset.read asset.update project.read team.read account.read",
                "account_id": "YOUR_ACCOUNT_ID",
                "workspace_id": "YOUR_WORKSPACE_ID",
                "default_workspace_id": "YOUR_DEFAULT_WORKSPACE_ID",
                "default_project_id": "YOUR_DEFAULT_PROJECT_ID",
                "project_id": "YOUR_PROJECT_ID",
                "oauth_url": "https://applications.frame.io/oauth2/auth",
                "token_url": "https://applications.frame.io/oauth2/token",
                "api_base_url": "https://api.frame.io/v2",
                "enabled": True
            },
            "discord": {
                "webhook_url": "YOUR_DISCORD_WEBHOOK_URL",
                "enabled": True
            },
            "google_sheets": {
                "enabled": True,
                "spreadsheet_id": "YOUR_SPREADSHEET_ID",
                "service_account_file": "config/google_credentials.json",
                "sheet_name": "PostFlow_Tracking"
            },
            "lucidlink": {
                "base_path": "/Volumes/resizelab/o2b-undllm",
                "watch_path": "/Volumes/resizelab/o2b-undllm/4_OUT/2_FROM_ANIM",
                "enabled": True
            },
            "workflow": {
                "enable_thumbnails": True,
                "enable_frameio_upload": True,
                "enable_google_drive_thumbnails": True,
                "enable_sheets_updates": True,
                "enable_discord_notifications": True
            },
            "thumbnails": {
                "enabled": True,
                "width": 400,
                "height": 225,
                "quality": 85
            }
        }
    
    def _create_default_pipeline_config(self) -> Dict[str, Any]:
        """Crée une configuration pipeline par défaut"""
        return {
            "version": "4.1.1",
            "name": "RL PostFlow Pipeline",
            "description": "Pipeline automatisé LucidLink → Frame.io",
            "watcher": {
                "enabled": True,
                "polling_interval": 2.0,
                "ignore_patterns": [
                    "*.tmp",
                    "*.lock",
                    ".*",
                    "__pycache__",
                    "*.pyc"
                ],
                "file_extensions": [".mov", ".mp4", ".avi", ".mkv"],
                "stability_check": {
                    "enabled": True,
                    "max_wait": 60,
                    "check_interval": 2,
                    "required_stable_checks": 3
                }
            },
            "dashboard": {
                "enabled": True,
                "host": "localhost",
                "port": 8081,
                "debug": False
            },
            "frameio": {
                "upload_timeout": 300,
                "max_retries": 3,
                "retry_delay": 5,
                "chunk_size": 8192
            },
            "infrastructure": {
                "http_server": {
                    "enabled": True,
                    "host": "localhost",
                    "port": 8080,
                    "cleanup_delay": 3600
                },
                "cloudflare_tunnel": {
                    "enabled": False,
                    "tunnel_name": "postflow-tunnel"
                }
            },
            "notifications": {
                "discord": {
                    "enabled": True,
                    "include_thumbnails": True,
                    "mention_roles": []
                }
            },
            "logging": {
                "level": "INFO",
                "file": "logs/postflow.log",
                "max_size": "10MB",
                "backup_count": 5
            },
            "metrics": {
                "enabled": True,
                "token_check_interval": 300
            }
        }
    
    def _validate_configurations(self):
        """Valide les configurations chargées"""
        try:
            logger.info("🔍 Validation des configurations...")
            
            # Validation configuration principale
            required_sections = ['frameio', 'discord', 'google_sheets', 'lucidlink']
            for section in required_sections:
                if section not in self.config:
                    logger.warning(f"⚠️ Section manquante dans la configuration: {section}")
            
            # Validation configuration pipeline
            required_pipeline_sections = ['watcher', 'dashboard', 'frameio']
            for section in required_pipeline_sections:
                if section not in self.pipeline_config:
                    logger.warning(f"⚠️ Section manquante dans la configuration pipeline: {section}")
            
            # Validation des chemins
            lucidlink_path = self.config.get('lucidlink', {}).get('base_path', '')
            if lucidlink_path and not Path(lucidlink_path).exists():
                logger.warning(f"⚠️ Chemin LucidLink non trouvé: {lucidlink_path}")
            
            watch_path = self.config.get('lucidlink', {}).get('watch_path', '')
            if watch_path and not Path(watch_path).exists():
                logger.warning(f"⚠️ Chemin de surveillance non trouvé: {watch_path}")
            
            logger.info("✅ Validation des configurations terminée")
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de la validation: {e}")
            raise
    
    def setup_directories(self):
        """Crée les répertoires nécessaires"""
        try:
            logger.info("📁 Création des répertoires nécessaires...")
            
            directories = [
                self.project_root / "logs",
                self.project_root / "output",
                self.project_root / "temp",
                self.project_root / "backups",
                self.config_dir
            ]
            
            for directory in directories:
                directory.mkdir(exist_ok=True)
                logger.debug(f"📁 Répertoire créé/vérifié: {directory}")
            
            logger.info("✅ Répertoires créés avec succès")
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de la création des répertoires: {e}")
            raise


def load_config(config_path: Optional[Path] = None) -> tuple[Dict[str, Any], Dict[str, Any], ConfigManager]:
    """
    Fonction utilitaire pour charger la configuration
    
    Args:
        config_path: Chemin optionnel vers le fichier de configuration
        
    Returns:
        tuple: (config, pipeline_config, config_manager)
    """
    loader = ConfigLoader(config_path)
    loader.setup_directories()
    return loader.load_configurations()
