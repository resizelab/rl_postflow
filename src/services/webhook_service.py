#!/usr/bin/env python3
"""
Webhook Service Manager pour PostFlow
Gestionnaire central des webhooks Frame.io intégré au pipeline principal
"""

import json
import logging
import threading
import time
from pathlib import Path
from typing import Dict, Any, Optional

from ..integrations.frameio.webhook_manager import FrameIOWebhookManager
from ..utils.upload_tracker import UploadTracker

logger = logging.getLogger(__name__)


class WebhookService:
    """
    Service central pour la gestion des webhooks Frame.io
    Intégré dans le pipeline principal PostFlow
    """
    
    def __init__(self, 
                 upload_tracker: UploadTracker,
                 config: Dict[str, Any],
                 auto_start: bool = True):
        """
        Initialise le service webhook
        
        Args:
            upload_tracker: Instance du tracker d'uploads
            config: Configuration du pipeline
            auto_start: Démarrer automatiquement le service
        """
        self.upload_tracker = upload_tracker
        self.config = config
        self.auto_start = auto_start
        
        # Configuration webhook
        webhook_config = config.get('webhook', {})
        self.webhook_port = webhook_config.get('port', 5000)
        self.webhook_enabled = webhook_config.get('enabled', True)
        
        # Gestionnaire webhook
        self.webhook_manager = None
        self.is_running = False
        self.service_thread = None
        
        # État du service
        self.service_stats = {
            "status": "inactive",
            "start_time": None,
            "webhook_url": None,
            "webhook_port": self.webhook_port,
            "events_processed": 0,
            "last_event": None
        }
        
        # Fichier de statut pour le dashboard
        self.status_file = Path("data/webhook_status.json")
        
        logger.info(f"🎣 Service webhook initialisé (port: {self.webhook_port}, auto_start: {auto_start})")
    
    def _save_status_to_file(self):
        """Sauvegarde le statut du webhook dans un fichier JSON pour le dashboard"""
        try:
            self.status_file.parent.mkdir(exist_ok=True)
            with open(self.status_file, 'w', encoding='utf-8') as f:
                json.dump(self.service_stats, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.error(f"❌ Erreur sauvegarde statut webhook: {e}")

    def start_service(self) -> bool:
        """
        Démarre le service webhook
        
        Returns:
            bool: True si démarré avec succès
        """
        try:
            if not self.webhook_enabled:
                logger.info("⚠️ Service webhook désactivé dans la configuration")
                return False
            
            if self.is_running:
                logger.warning("⚠️ Service webhook déjà en cours")
                return True
            
            logger.info("🚀 Démarrage du service webhook...")
            
            # Créer le gestionnaire webhook
            self.webhook_manager = FrameIOWebhookManager(
                upload_tracker=self.upload_tracker,
                webhook_port=self.webhook_port
            )
            
            # Démarrer en arrière-plan
            self.service_thread = threading.Thread(
                target=self._run_webhook_service,
                daemon=True,
                name="WebhookService"
            )
            self.service_thread.start()
            
            # Attendre que le service soit prêt
            max_wait = 30  # secondes
            waited = 0
            while waited < max_wait and not self.is_running:
                time.sleep(1)
                waited += 1
            
            if self.is_running:
                webhook_url = self.webhook_manager.get_public_webhook_url()
                self.service_stats.update({
                    "status": "active",
                    "start_time": time.time(),
                    "webhook_url": webhook_url
                })
                
                logger.info(f"✅ Service webhook actif: {webhook_url}")
                return True
            else:
                logger.error("❌ Timeout démarrage service webhook")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur démarrage service webhook: {e}")
            return False
    
    def _run_webhook_service(self):
        """Exécute le service webhook en arrière-plan"""
        try:
            # Démarrer le serveur webhook (avec tunnel)
            self.webhook_manager.start_webhook_server()
            self.is_running = True
            
            logger.info("🌐 Service webhook en cours d'exécution...")
            
            # Boucle de monitoring
            while self.is_running:
                try:
                    # Vérifier l'état du tunnel
                    if (self.webhook_manager.tunnel_manager and 
                        not self.webhook_manager.tunnel_manager.is_tunnel_healthy()):
                        logger.warning("⚠️ Tunnel webhook en panne, tentative de redémarrage...")
                        # Le webhook manager devrait gérer le redémarrage automatiquement
                    
                    time.sleep(30)  # Vérification toutes les 30 secondes
                    
                except Exception as e:
                    logger.error(f"❌ Erreur monitoring webhook: {e}")
                    time.sleep(5)
                    
        except Exception as e:
            logger.error(f"❌ Erreur service webhook: {e}")
        finally:
            self.is_running = False
    
    def stop_service(self):
        """Arrête le service webhook"""
        try:
            logger.info("🛑 Arrêt du service webhook...")
            
            self.is_running = False
            
            if self.webhook_manager:
                self.webhook_manager.stop_webhook_server()
            
            if self.service_thread and self.service_thread.is_alive():
                self.service_thread.join(timeout=10)
            
            self.service_stats.update({
                "status": "stopped",
                "webhook_url": None
            })
            
            logger.info("✅ Service webhook arrêté")
            
        except Exception as e:
            logger.error(f"❌ Erreur arrêt service webhook: {e}")
    
    def get_service_status(self) -> Dict[str, Any]:
        """
        Retourne le statut du service webhook
        
        Returns:
            Dict: Statut du service
        """
        status = self.service_stats.copy()
        
        if self.webhook_manager:
            # Ajouter les stats du webhook manager
            webhook_stats = self.webhook_manager.get_webhook_stats()
            status.update({
                "webhook_stats": webhook_stats,
                "tunnel_info": webhook_stats.get("tunnel_info"),
                "events_processed": webhook_stats.get("total_events", 0),
                "last_event": webhook_stats.get("last_event")
            })
        
        return status
    
    def configure_frameio_webhook(self, account_id: str, workspace_id: str, frameio_auth) -> bool:
        """
        Configure automatiquement le webhook Frame.io
        
        Args:
            account_id: ID du compte Frame.io
            workspace_id: ID du workspace Frame.io
            frameio_auth: Authentification Frame.io
            
        Returns:
            bool: True si configuré avec succès
        """
        try:
            if not self.webhook_manager:
                logger.error("❌ Service webhook non démarré")
                return False
            
            if not self.webhook_manager.get_public_webhook_url():
                logger.error("❌ URL publique webhook non disponible")
                return False
            
            logger.info("📡 Configuration du webhook Frame.io...")
            
            success = self.webhook_manager.create_webhook_sync(
                frameio_auth=frameio_auth,
                account_id=account_id,
                workspace_id=workspace_id,
                webhook_name="PostFlow Webhook (Auto)"
            )
            
            if success:
                logger.info("✅ Webhook Frame.io configuré automatiquement")
                return True
            else:
                logger.error("❌ Échec configuration webhook Frame.io")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur configuration webhook Frame.io: {e}")
            return False
    
    def get_webhook_url(self) -> Optional[str]:
        """Retourne l'URL publique du webhook"""
        if self.webhook_manager:
            return self.webhook_manager.get_public_webhook_url()
        return None
    
    def test_webhook(self) -> bool:
        """
        Teste le webhook avec un événement simulé
        
        Returns:
            bool: True si le test réussit
        """
        try:
            if not self.webhook_manager:
                return False
            
            # Événement de test
            test_event = {
                "event_type": "file.ready",
                "resource": {
                    "id": "test_file_webhook",
                    "name": "test_webhook.mp4",
                    "status": "active",
                    "review_status": "needs_review"
                }
            }
            
            # Traiter l'événement
            self.webhook_manager.process_webhook_sync(test_event)
            
            logger.info("✅ Test webhook réussi")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur test webhook: {e}")
            return False
