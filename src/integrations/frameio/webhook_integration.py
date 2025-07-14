#!/usr/bin/env python3
"""
Frame.io Webhook Integration
Intégration complète du système webhook Frame.io avec PostFlow
"""

import json
import logging
import os
from pathlib import Path
from typing import Dict, Any, Optional
import requests

from .webhook_manager import FrameIOWebhookManager
from ...utils.upload_tracker import UploadTracker
from .auth import FrameIOAuth

logger = logging.getLogger(__name__)


class FrameIOWebhookIntegration:
    """
    Intégration complète du système webhook Frame.io
    """
    
    def __init__(self, config_path: str = "config/frameio_config.json"):
        """
        Initialise l'intégration webhook
        
        Args:
            config_path: Chemin vers la configuration Frame.io
        """
        self.config_path = Path(config_path)
        self.config = self._load_config()
        self.upload_tracker = UploadTracker()
        
        # Configuration webhook
        self.webhook_url = self.config.get("webhook", {}).get("public_url", "https://your-domain.com")
        self.webhook_port = self.config.get("webhook", {}).get("port", 8080)
        
        # Initialiser le webhook manager
        self.webhook_manager = FrameIOWebhookManager(
            upload_tracker=self.upload_tracker,
            webhook_url=self.webhook_url,
            webhook_port=self.webhook_port
        )
        
        # Client Frame.io
        self.frameio_auth = None
        
    def _load_config(self) -> Dict[str, Any]:
        """
        Charge la configuration Frame.io
        
        Returns:
            Dict: Configuration Frame.io
        """
        try:
            if self.config_path.exists():
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                logger.warning(f"⚠️ Configuration non trouvée: {self.config_path}")
                return self._create_default_config()
        except Exception as e:
            logger.error(f"❌ Erreur chargement config: {e}")
            return self._create_default_config()
    
    def _create_default_config(self) -> Dict[str, Any]:
        """
        Crée une configuration par défaut
        
        Returns:
            Dict: Configuration par défaut
        """
        default_config = {
            "api": {
                "token": "",
                "account_id": "",
                "workspace_id": "",
                "project_id": ""
            },
            "webhook": {
                "public_url": "https://your-domain.com",
                "port": 8080,
                "path": "/frameio-webhook",
                "enabled": False
            },
            "settings": {
                "auto_create_webhook": True,
                "auto_start_server": True,
                "webhook_retry_count": 3
            }
        }
        
        # Sauvegarder la config par défaut
        try:
            self.config_path.parent.mkdir(parents=True, exist_ok=True)
            with open(self.config_path, 'w', encoding='utf-8') as f:
                json.dump(default_config, f, indent=2)
            logger.info(f"📝 Configuration par défaut créée: {self.config_path}")
        except Exception as e:
            logger.error(f"❌ Erreur création config: {e}")
        
        return default_config
    
    def setup_frameio_client(self) -> bool:
        """
        Configure le client Frame.io
        
        Returns:
            bool: True si configuré avec succès
        """
        try:
            api_config = self.config.get("api", {})
            token = api_config.get("token")
            
            if not token:
                logger.error("❌ Token Frame.io manquant dans la configuration")
                return False
            
            # Initialiser l'authentification Frame.io
            self.frameio_auth = FrameIOAuth()
            
            # Utiliser le token existant
            from .auth import TokenInfo
            self.frameio_auth.token_info = TokenInfo(token)
            
            # Vérifier la connexion en testant une requête simple
            if self._test_frameio_connection():
                logger.info("✅ Client Frame.io configuré et connecté")
                return True
            else:
                logger.error("❌ Échec de connexion Frame.io")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur configuration client Frame.io: {e}")
            return False
    
    def _test_frameio_connection(self) -> bool:
        """
        Teste la connexion Frame.io
        
        Returns:
            bool: True si connecté
        """
        try:
            import httpx
            headers = {
                "Authorization": self.frameio_auth.token_info.authorization_header,
                "Content-Type": "application/json"
            }
            
            # Test simple avec l'API Frame.io
            response = httpx.get("https://api.frame.io/v4/me", headers=headers, timeout=10)
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"❌ Erreur test connexion: {e}")
            return False
    
    def start_webhook_system(self) -> bool:
        """
        Démarre le système webhook complet
        
        Returns:
            bool: True si démarré avec succès
        """
        try:
            # Vérifier la configuration
            if not self.config.get("webhook", {}).get("enabled", False):
                logger.warning("⚠️ Webhooks désactivés dans la configuration")
                return False
            
            # Configurer le client Frame.io
            if not self.setup_frameio_client():
                return False
            
            # Démarrer le serveur webhook
            if self.config.get("settings", {}).get("auto_start_server", True):
                self.webhook_manager.start_webhook_server()
                logger.info(f"🚀 Serveur webhook démarré sur port {self.webhook_port}")
            
            # Créer le webhook Frame.io
            if self.config.get("settings", {}).get("auto_create_webhook", True):
                api_config = self.config.get("api", {})
                account_id = api_config.get("account_id")
                workspace_id = api_config.get("workspace_id")
                
                if account_id and workspace_id:
                    success = self.webhook_manager.create_webhook_sync(
                        self.frameio_auth,
                        account_id,
                        workspace_id
                    )
                    
                    if success:
                        logger.info("✅ Webhook Frame.io créé et activé")
                        return True
                    else:
                        logger.error("❌ Échec création webhook Frame.io")
                        return False
                else:
                    logger.error("❌ account_id ou workspace_id manquant")
                    return False
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur démarrage système webhook: {e}")
            return False
    
    def stop_webhook_system(self) -> bool:
        """
        Arrête le système webhook
        
        Returns:
            bool: True si arrêté avec succès
        """
        try:
            # Supprimer le webhook Frame.io
            if self.frameio_auth and self.webhook_manager.webhook_data.get("webhook_id"):
                api_config = self.config.get("api", {})
                account_id = api_config.get("account_id")
                workspace_id = api_config.get("workspace_id")
                
                if account_id and workspace_id:
                    self.webhook_manager.delete_webhook_sync(
                        self.frameio_auth,
                        account_id,
                        workspace_id
                    )
            
            # Arrêter le serveur
            self.webhook_manager.stop_webhook_server()
            
            logger.info("🛑 Système webhook arrêté")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur arrêt système webhook: {e}")
            return False
    
    def get_webhook_status(self) -> Dict[str, Any]:
        """
        Retourne le statut complet du système webhook
        
        Returns:
            Dict: Statut du système
        """
        try:
            webhook_stats = self.webhook_manager.get_webhook_stats()
            
            return {
                "system_status": "active" if self.webhook_manager.is_running else "inactive",
                "config_loaded": bool(self.config),
                "frameio_connected": bool(self.frameio_auth),
                "webhook_url": self.webhook_url,
                "webhook_port": self.webhook_port,
                "webhook_stats": webhook_stats,
                "upload_tracker_status": {
                    "total_uploads": len(self.upload_tracker.tracking_data.get("uploads", {})),
                    "active_uploads": len([
                        u for u in self.upload_tracker.tracking_data.get("uploads", {}).values()
                        if u.get("status") in ["UPLOADING", "PROCESSING"]
                    ])
                }
            }
        except Exception as e:
            logger.error(f"❌ Erreur statut webhook: {e}")
            return {"error": str(e)}
    
    def test_webhook_connection(self) -> bool:
        """
        Teste la connexion webhook
        
        Returns:
            bool: True si le test réussit
        """
        try:
            # Test du health check
            health_url = f"{self.webhook_url}:{self.webhook_port}/health"
            response = requests.get(health_url, timeout=5)
            
            if response.status_code == 200:
                logger.info("✅ Test webhook réussi")
                return True
            else:
                logger.error(f"❌ Test webhook échoué: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur test webhook: {e}")
            return False
    
    def simulate_webhook_event(self, event_type: str, file_data: Dict[str, Any]) -> bool:
        """
        Simule un événement webhook pour les tests
        
        Args:
            event_type: Type d'événement
            file_data: Données du fichier
            
        Returns:
            bool: True si traité avec succès
        """
        try:
            webhook_data = {
                "event_type": event_type,
                "resource": file_data
            }
            
            self.webhook_manager.process_webhook_sync(webhook_data)
            logger.info(f"✅ Événement simulé: {event_type}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur simulation webhook: {e}")
            return False


def main():
    """Test rapide de l'intégration webhook"""
    logging.basicConfig(level=logging.INFO)
    
    # Initialiser l'intégration
    integration = FrameIOWebhookIntegration()
    
    # Afficher le statut
    status = integration.get_webhook_status()
    print("📊 Statut système webhook:")
    print(json.dumps(status, indent=2))
    
    # Test si configuré
    if status.get("config_loaded"):
        print("\n🚀 Démarrage du système webhook...")
        if integration.start_webhook_system():
            print("✅ Système webhook actif")
            
            # Test de connexion
            if integration.test_webhook_connection():
                print("✅ Test de connexion réussi")
            
            # Attendre puis arrêter
            input("\nAppuyez sur Entrée pour arrêter...")
            integration.stop_webhook_system()
        else:
            print("❌ Échec démarrage système webhook")
    else:
        print("⚠️ Configuration requise")


if __name__ == "__main__":
    main()
