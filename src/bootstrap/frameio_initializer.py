#!/usr/bin/env python3
"""
🎬 Frame.io Bootstrap Module
==========================================

Initialise l'intégration Frame.io avec gestion OAuth et refresh token.
Extrait de main.py pour une meilleure organisation.

Version: 4.1.1
Date: 9 juillet 2025
"""

import os
import logging
from typing import Dict, Any, Optional, Tuple
from src.utils.config import ConfigManager

logger = logging.getLogger(__name__)

try:
    from src.integrations.frameio.upload import FrameIOUploadManager
    from src.integrations.frameio.auth import FrameIOAuth
    FRAMEIO_AVAILABLE = True
except ImportError as e:
    logger.error(f"PostFlow v2.0 modules not available: {e}")
    FRAMEIO_AVAILABLE = False


class FrameIOInitializer:
    """Gestionnaire d'initialisation Frame.io"""
    
    def __init__(self, config: Dict[str, Any], config_manager: ConfigManager):
        self.config = config
        self.config_manager = config_manager
        self.frameio_auth = None
        self.frameio_manager = None
        
    async def initialize_frameio(self) -> bool:
        """Initialise l'intégration Frame.io avec gestion du refresh token"""
        if not FRAMEIO_AVAILABLE:
            logger.error("❌ Frame.io integration not available")
            return False
        
        try:
            logger.info("🎬 Initialisation de l'intégration Frame.io...")
            
            # Mettre à jour les variables d'environnement
            self._update_environment_variables()
            
            # Initialiser le gestionnaire d'upload directement (comme dans l'original)
            logger.info("📤 Initialisation du gestionnaire d'upload Frame.io...")
            logger.info(f"🔍 Debug: config_manager type = {type(self.config_manager)}")
            logger.info(f"🔍 Debug: config_manager = {self.config_manager}")
            self.frameio_manager = FrameIOUploadManager(self.config_manager)
            
            if not self.frameio_manager:
                logger.error("❌ FrameIOUploadManager non initialisé")
                return False
            
            # Vérifier et rafraîchir le token si nécessaire (comme dans l'original)
            if not await self._check_and_refresh_token():
                logger.error("❌ Impossible d'obtenir un token Frame.io valide")
                return False
            
            logger.info("✅ Intégration Frame.io initialisée")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'initialisation Frame.io: {e}")
            return False
    
    async def _check_and_refresh_token(self) -> bool:
        """Vérifie et rafraîchit le token Frame.io si nécessaire"""
        try:
            # Vérifier si le token existe
            access_token = self.config_manager.get('frameio.access_token')
            if not access_token:
                logger.error("❌ Token Frame.io manquant")
                return False
            
            # Vérifier l'expiration
            expires_in = self.config_manager.get('frameio.expires_in', 86400)  # 24h par défaut
            last_updated = self.config_manager.get('frameio.last_updated')
            
            if last_updated:
                from datetime import datetime, timedelta
                try:
                    last_update_time = datetime.fromisoformat(last_updated.replace('Z', '+00:00'))
                    expiry_time = last_update_time + timedelta(seconds=expires_in)
                    
                    # Rafraîchir si expire dans moins de 1 heure
                    if datetime.now() > (expiry_time - timedelta(hours=1)):
                        logger.info("🔄 Token Frame.io expire bientôt, rafraîchissement...")
                        return await self._refresh_frameio_token()
                except ValueError:
                    logger.warning("⚠️ Format de date invalide pour last_updated")
            
            # Tester le token actuel
            return await self._test_frameio_token()
            
        except Exception as e:
            logger.error(f"❌ Erreur vérification token Frame.io: {e}")
            return False
    
    async def _refresh_frameio_token(self) -> bool:
        """Rafraîchit le token Frame.io"""
        try:
            # Créer une instance d'auth temporaire pour le refresh
            self.frameio_auth = FrameIOAuth()
            
            # Effectuer le refresh
            if await self.frameio_auth.refresh_token():
                logger.info("✅ Token Frame.io rafraîchi avec succès")
                return True
            else:
                logger.error("❌ Échec du rafraîchissement du token Frame.io")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur rafraîchissement token: {e}")
            return False
    
    async def _test_frameio_token(self) -> bool:
        """Teste la validité du token Frame.io"""
        try:
            # Test simple avec l'API Frame.io
            if not self.frameio_auth:
                self.frameio_auth = FrameIOAuth()
            
            # Tester la connexion
            if await self.frameio_auth.test_connection():
                logger.info("✅ Token Frame.io valide")
                return True
            else:
                logger.warning("⚠️ Token Frame.io invalide ou expiré")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur test token: {e}")
            return False
    
    def _update_environment_variables(self):
        """Met à jour les variables d'environnement Frame.io"""
        try:
            frameio_config = self.config.get('frameio', {})
            
            # Variables d'environnement critiques pour Frame.io
            env_vars = {
                'FRAMEIO_ACCOUNT_ID': frameio_config.get('account_id'),
                'FRAMEIO_WORKSPACE_ID': frameio_config.get('workspace_id'),
                'FRAMEIO_DEFAULT_WORKSPACE_ID': frameio_config.get('workspace_id'),
                'FRAMEIO_DEFAULT_PROJECT_ID': frameio_config.get('project_id'),
                'FRAMEIO_ROOT_FOLDER_ID': frameio_config.get('root_folder_id'),
                'FRAMEIO_CLIENT_ID': frameio_config.get('client_id'),
                'FRAMEIO_CLIENT_SECRET': frameio_config.get('client_secret')
            }
            
            for var_name, var_value in env_vars.items():
                if var_value:
                    os.environ[var_name] = str(var_value)
                    logger.info(f"✅ Variable d'environnement {var_name} mise à jour: {var_value}")
                else:
                    logger.warning(f"⚠️ Variable d'environnement {var_name} manquante")
                    
        except Exception as e:
            logger.error(f"❌ Erreur mise à jour variables d'environnement: {e}")
    
    def get_frameio_manager(self) -> Optional[Any]:
        """Retourne le gestionnaire Frame.io initialisé"""
        return self.frameio_manager
    
    def get_frameio_auth(self) -> Optional[Any]:
        """Retourne l'instance d'authentification Frame.io"""
        return self.frameio_auth
    
    async def cleanup(self):
        """Nettoie les ressources Frame.io"""
        try:
            if self.frameio_auth:
                await self.frameio_auth.close()
                logger.info("🧹 Ressources Frame.io nettoyées")
        except Exception as e:
            logger.error(f"❌ Erreur nettoyage Frame.io: {e}")
    
async def initialize_frameio(config: Dict[str, Any], config_manager: ConfigManager) -> Tuple[bool, Optional[Any], Optional[Any]]:
    """
    Fonction d'initialisation Frame.io pour compatibilité avec main.py
    
    Args:
        config: Configuration générale
        config_manager: Gestionnaire de configuration
        
    Returns:
        Tuple[bool, Optional[Any], Optional[Any]]: (success, auth, manager)
    """
    try:
        initializer = FrameIOInitializer(config, config_manager)
        success = await initializer.initialize_frameio()
        
        if success:
            return True, initializer.get_frameio_auth(), initializer.get_frameio_manager()
        else:
            return False, None, None
            
    except Exception as e:
        logger.error(f"❌ Erreur fonction initialize_frameio: {e}")
        return False, None, None
