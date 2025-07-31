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


def create_webhook_http_handler(webhook_manager):
    """
    Crée un gestionnaire de webhook compatible avec le RangeHTTPRequestHandler
    
    Args:
        webhook_manager: Instance du FrameIOWebhookManager
        
    Returns:
        function: Gestionnaire de requête HTTP pour les webhooks
    """
    def handle_webhook_request(request_handler):
        """
        Traite une requête webhook HTTP brute
        
        Args:
            request_handler: Instance du RangeHTTPRequestHandler
        """
        try:
            # Lire le contenu de la requête
            content_length = int(request_handler.headers.get('Content-Length', 0))
            raw_body = request_handler.rfile.read(content_length).decode('utf-8')
            
            # Extraire les headers nécessaires
            headers = dict(request_handler.headers)
            signature = headers.get('X-FrameIO-Signature')
            timestamp = headers.get('X-FrameIO-Timestamp')
            content_type = headers.get('Content-Type', 'application/json')
            
            logger.info(f"🔔 Webhook reçu via range_server")
            logger.debug(f"📋 Headers: {headers}")
            logger.debug(f"📋 Body: {raw_body}")
            
            # Vérifier la signature si configurée
            if webhook_manager.webhook_data.get("signing_secret") and signature and timestamp:
                if not webhook_manager.verify_frameio_signature(signature, timestamp, raw_body, 
                                                   webhook_manager.webhook_data["signing_secret"]):
                    logger.warning("⚠️ Signature webhook Frame.io invalide")
                    request_handler.send_error(401, "Invalid signature")
                    return
                logger.debug("✅ Signature webhook vérifiée")
            
            # Parser les données JSON
            try:
                webhook_data = json.loads(raw_body) if raw_body else {}
            except json.JSONDecodeError as e:
                logger.error(f"❌ Erreur parsing JSON: {e}")
                request_handler.send_error(400, "Invalid JSON")
                return
            
            # Traiter le webhook
            webhook_manager.process_webhook_sync(webhook_data)
            
            # Envoyer la réponse de succès
            request_handler.send_response(200)
            request_handler.send_header('Content-Type', 'application/json')
            request_handler.end_headers()
            
            response = json.dumps({
                "status": "success",
                "message": "Webhook processed"
            }).encode('utf-8')
            
            request_handler.wfile.write(response)
            
            logger.info("✅ Webhook traité avec succès via range_server")
            
        except Exception as e:
            logger.error(f"❌ Erreur traitement webhook via range_server: {e}")
            try:
                request_handler.send_error(500, "Internal server error")
            except:
                pass  # Ignorer si on ne peut pas envoyer l'erreur
    
    return handle_webhook_request


class WebhookService:
    """
    Service central pour la gestion des webhooks Frame.io
    Intégré dans le pipeline principal PostFlow
    """
    
    def __init__(self, 
                 upload_tracker: UploadTracker,
                 config: Dict[str, Any],
                 auto_start: bool = True,
                 frameio_auth=None):
        """
        Initialise le service webhook
        
        Args:
            upload_tracker: Instance du tracker d'uploads
            config: Configuration du pipeline
            auto_start: Démarrer automatiquement le service
            frameio_auth: Instance d'authentification Frame.io
        """
        self.upload_tracker = upload_tracker
        self.config = config
        self.auto_start = auto_start
        self.frameio_auth = frameio_auth  # Stocker la référence frameio_auth
        
        # Configuration webhook
        webhook_config = config.get('webhook', {})
        self.webhook_port = webhook_config.get('port', 5000)
        self.webhook_enabled = webhook_config.get('enabled', True)
        self.intelligent_tracking_enabled = webhook_config.get('intelligent_tracking', True)
        
        # Gestionnaire webhook
        self.webhook_manager = None
        self.intelligent_tracker = None  # Tracking intelligent
        self.is_running = False
        self.service_thread = None
        
        # État du service
        self.service_stats = {
            "status": "inactive",
            "start_time": None,
            "webhook_url": None,
            "webhook_port": self.webhook_port,
            "events_processed": 0,
            "last_event": None,
            "intelligent_tracking_enabled": self.intelligent_tracking_enabled
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
                webhook_port=self.webhook_port,
                frameio_auth=self.frameio_auth
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
                
                # Activer le tracking intelligent si configuré
                if self.intelligent_tracking_enabled:
                    self._setup_intelligent_tracking()
                
                logger.info(f"✅ Service webhook actif: {webhook_url}")
                return True
            else:
                logger.error("❌ Timeout démarrage service webhook")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur démarrage service webhook: {e}")
            return False
    
    def integrate_with_shared_server(self, shared_http_server):
        """
        Intègre le service webhook avec le serveur HTTP partagé (range_server)
        
        Args:
            shared_http_server: Instance du RangeFileServer partagé
        """
        try:
            if not self.webhook_manager:
                logger.warning("⚠️ Webhook manager non initialisé pour l'intégration")
                return False
            
            # Créer le gestionnaire de webhook pour le range_server
            webhook_handler = create_webhook_http_handler(self.webhook_manager)
            
            # Configurer le range_server avec le gestionnaire
            shared_http_server.set_webhook_handler(webhook_handler)
            
            logger.info("🔗 Service webhook intégré au serveur HTTP partagé")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur intégration serveur partagé: {e}")
            return False
    
    def start_service_with_shared_server(self, shared_http_server) -> bool:
        """
        Démarre le service webhook en utilisant le serveur HTTP partagé au lieu de Flask
        
        Args:
            shared_http_server: Instance du RangeFileServer partagé
            
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
            
            logger.info("🚀 Démarrage du service webhook avec serveur partagé...")
            
            # Créer le gestionnaire webhook (sans démarrer Flask)
            self.webhook_manager = FrameIOWebhookManager(
                upload_tracker=self.upload_tracker,
                webhook_port=self.webhook_port,
                use_cloudflare_tunnel=True,  # Garder le tunnel pour l'exposition publique
                frameio_auth=self.frameio_auth
            )
            
            # Démarrer seulement le tunnel Cloudflare (pas le serveur Flask)
            if self.webhook_manager.tunnel_manager:
                logger.info("🌐 Démarrage du tunnel Cloudflare...")
                tunnel_url = self.webhook_manager.tunnel_manager.start_webhook_tunnel(timeout=60)
                
                if tunnel_url:
                    self.webhook_manager.webhook_url = tunnel_url
                    self.webhook_manager.webhook_data["tunnel_info"] = self.webhook_manager.tunnel_manager.get_tunnel_info()
                    logger.info(f"✅ Tunnel Cloudflare actif: {tunnel_url}")
                else:
                    logger.error("❌ Échec démarrage tunnel Cloudflare")
                    return False
            
            # Intégrer avec le serveur HTTP partagé
            if not self.integrate_with_shared_server(shared_http_server):
                logger.error("❌ Échec intégration serveur partagé")
                return False
            
            # Marquer comme actif
            self.is_running = True
            webhook_url = self.webhook_manager.get_public_webhook_url()
            self.service_stats.update({
                "status": "active",
                "start_time": time.time(),
                "webhook_url": webhook_url
            })
            
            # Activer le tracking intelligent si configuré
            if self.intelligent_tracking_enabled:
                self._setup_intelligent_tracking()
            
            logger.info(f"✅ Service webhook actif avec serveur partagé: {webhook_url}")
            return True
                
        except Exception as e:
            logger.error(f"❌ Erreur démarrage service webhook partagé: {e}")
            return False
    
    def _setup_intelligent_tracking(self):
        """Configure le tracking intelligent"""
        try:
            from ..integrations.frameio.intelligent_tracker import IntelligentWebhookTracker
            
            self.intelligent_tracker = IntelligentWebhookTracker(
                webhook_manager=self.webhook_manager,
                upload_tracker=self.upload_tracker
            )
            
            # Passer l'intelligent_tracker au webhook_manager
            self.webhook_manager.intelligent_tracker = self.intelligent_tracker
            
            # Intégrer avec le webhook manager
            original_process = self.webhook_manager.process_webhook_sync
            
            def enhanced_process_webhook(webhook_data):
                # Traitement original
                original_process(webhook_data)
                
                # Traitement intelligent
                if self.intelligent_tracker:
                    self.intelligent_tracker.process_webhook_intelligently(webhook_data)
            
            self.webhook_manager.process_webhook_sync = enhanced_process_webhook
            
            logger.info("🧠 Tracking intelligent activé")
            
        except ImportError as e:
            logger.warning(f"⚠️ Tracking intelligent non disponible: {e}")
        except Exception as e:
            logger.error(f"❌ Erreur setup tracking intelligent: {e}")
    
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
    
    def register_upload_for_intelligent_tracking(self, 
                                               upload_id: str, 
                                               filename: str,
                                               file_id: Optional[str] = None,
                                               project_id: Optional[str] = None,
                                               workspace_id: Optional[str] = None) -> bool:
        """
        Enregistre un upload pour tracking intelligent
        
        Args:
            upload_id: ID interne de l'upload
            filename: Nom du fichier
            file_id: ID Frame.io du fichier (optionnel)
            project_id: ID du projet Frame.io (optionnel)
            workspace_id: ID du workspace Frame.io (optionnel)
            
        Returns:
            bool: True si enregistré avec succès
        """
        try:
            if not self.intelligent_tracker:
                logger.warning("⚠️ Tracking intelligent non disponible")
                return False
            
            self.intelligent_tracker.register_upload_for_tracking(
                upload_id=upload_id,
                filename=filename,
                file_id=file_id,
                project_id=project_id,
                workspace_id=workspace_id
            )
            
            logger.info(f"📝 Upload enregistré pour tracking intelligent: {filename}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur enregistrement tracking: {e}")
            return False
    
    def get_intelligent_tracking_stats(self) -> Dict[str, Any]:
        """
        Retourne les statistiques du tracking intelligent
        
        Returns:
            Dict: Statistiques ou dictionnaire vide si non disponible
        """
        try:
            if self.intelligent_tracker:
                return self.intelligent_tracker.get_tracking_statistics()
            else:
                return {"error": "Tracking intelligent non disponible"}
        except Exception as e:
            logger.error(f"❌ Erreur récupération stats tracking: {e}")
            return {"error": str(e)}
    
    def get_upload_tracking_details(self, upload_id: str) -> Optional[Dict[str, Any]]:
        """
        Retourne les détails de tracking pour un upload spécifique
        
        Args:
            upload_id: ID de l'upload
            
        Returns:
            Dict: Détails de l'upload ou None
        """
        try:
            if self.intelligent_tracker:
                return self.intelligent_tracker.get_upload_details(upload_id)
            else:
                return None
        except Exception as e:
            logger.error(f"❌ Erreur récupération détails upload: {e}")
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
            
            # Événement de test Frame.io V4
            test_event = {
                "type": "file.ready",
                "account": {"id": "test_account"},
                "project": {"id": "test_project"},
                "workspace": {"id": "test_workspace"},
                "resource": {
                    "id": "test_file_webhook",
                    "type": "file",
                    "name": "test_webhook.mp4",
                    "status": "ready"
                },
                "user": {"id": "test_user"}
            }
            
            # Traiter l'événement
            self.webhook_manager.process_webhook_sync(test_event)
            
            logger.info("✅ Test webhook réussi")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur test webhook: {e}")
            return False
