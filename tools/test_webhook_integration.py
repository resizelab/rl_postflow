#!/usr/bin/env python3
"""
Script de test et intégration du système webhook Frame.io avec Cloudflare Tunnel
"""

import asyncio
import logging
import time
import json
from pathlib import Path
import sys

# Ajouter le répertoire parent au path pour les imports
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.integrations.frameio.webhook_manager import FrameIOWebhookManager
from src.integrations.frameio.auth import FrameIOAuth
from src.utils.upload_tracker import UploadTracker

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class WebhookIntegrationManager:
    """
    Gestionnaire d'intégration du système webhook Frame.io
    """
    
    def __init__(self, config_path: str = "config/frameio_config.json"):
        """
        Initialise le gestionnaire d'intégration
        
        Args:
            config_path: Chemin vers la configuration Frame.io
        """
        self.config_path = Path(config_path)
        self.config = self._load_config()
        
        # Composants du système
        self.frameio_auth = None
        self.upload_tracker = None
        self.webhook_manager = None
        
    def _load_config(self) -> dict:
        """Charge la configuration Frame.io"""
        try:
            if self.config_path.exists():
                with open(self.config_path, 'r') as f:
                    return json.load(f)
            else:
                logger.error(f"❌ Fichier config non trouvé: {self.config_path}")
                return {}
        except Exception as e:
            logger.error(f"❌ Erreur chargement config: {e}")
            return {}
    
    async def initialize_components(self):
        """Initialise tous les composants nécessaires"""
        try:
            # Initialiser l'authentification Frame.io
            self.frameio_auth = FrameIOAuth(
                client_id=self.config.get("client_id"),
                client_secret=self.config.get("client_secret"),
                redirect_uri=self.config.get("redirect_uri")
            )
            
            # Initialiser le tracker d'uploads
            self.upload_tracker = UploadTracker()
            
            # Initialiser le gestionnaire de webhooks avec Cloudflare Tunnel
            self.webhook_manager = FrameIOWebhookManager(
                upload_tracker=self.upload_tracker,
                webhook_port=8080,  # Port dédié aux webhooks
                webhook_path="/frameio-webhook",
                use_cloudflare_tunnel=True
            )
            
            logger.info("✅ Composants initialisés")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur initialisation: {e}")
            return False
    
    async def start_webhook_system(self) -> bool:
        """
        Démarre le système webhook complet
        
        Returns:
            bool: True si démarré avec succès
        """
        try:
            logger.info("🚀 Démarrage du système webhook Frame.io...")
            
            # Démarrer le serveur webhook avec tunnel Cloudflare
            if not self.webhook_manager.start_webhook_server():
                logger.error("❌ Échec démarrage serveur webhook")
                return False
            
            # Attendre que le tunnel soit stable
            await asyncio.sleep(5)
            
            # Vérifier que le tunnel est opérationnel
            public_url = self.webhook_manager.get_public_webhook_url()
            if not public_url:
                logger.error("❌ URL publique webhook non disponible")
                return False
            
            logger.info(f"✅ Système webhook opérationnel: {public_url}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur démarrage système webhook: {e}")
            return False
    
    async def create_frameio_webhook(self) -> bool:
        """
        Crée le webhook Frame.io
        
        Returns:
            bool: True si créé avec succès
        """
        try:
            # Vérifier l'authentification
            if not self.frameio_auth or not self.frameio_auth.is_authenticated():
                logger.error("❌ Authentification Frame.io requise")
                return False
            
            # Récupérer les infos du compte
            account_id = self.config.get("account_id")
            workspace_id = self.config.get("workspace_id")
            
            if not account_id or not workspace_id:
                logger.error("❌ account_id et workspace_id requis dans la config")
                return False
            
            # Créer le webhook
            success = self.webhook_manager.create_webhook_sync(
                frameio_auth=self.frameio_auth,
                account_id=account_id,
                workspace_id=workspace_id,
                webhook_name="PostFlow Webhook v2"
            )
            
            if success:
                logger.info("✅ Webhook Frame.io créé avec succès")
                return True
            else:
                logger.error("❌ Échec création webhook Frame.io")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur création webhook: {e}")
            return False
    
    async def monitor_webhooks(self, duration: int = 300):
        """
        Surveille les webhooks pendant une durée donnée
        
        Args:
            duration: Durée de surveillance en secondes
        """
        try:
            logger.info(f"👁️ Surveillance webhooks pendant {duration}s...")
            
            start_time = time.time()
            while time.time() - start_time < duration:
                # Afficher les statistiques toutes les 30 secondes
                if int(time.time() - start_time) % 30 == 0:
                    stats = self.webhook_manager.get_webhook_stats()
                    logger.info(f"📊 Stats webhook: {stats['total_events']} événements")
                    
                    # Afficher les événements récents
                    if stats.get('last_event'):
                        last_event = stats['last_event']
                        logger.info(f"   Dernier: {last_event['event_type']} - {last_event['file_name']}")
                
                await asyncio.sleep(1)
                
        except KeyboardInterrupt:
            logger.info("🛑 Surveillance interrompue par l'utilisateur")
        except Exception as e:
            logger.error(f"❌ Erreur surveillance: {e}")
    
    async def stop_webhook_system(self):
        """Arrête le système webhook"""
        try:
            if self.webhook_manager:
                # Supprimer le webhook Frame.io si nécessaire
                account_id = self.config.get("account_id")
                workspace_id = self.config.get("workspace_id")
                
                if account_id and workspace_id:
                    self.webhook_manager.delete_webhook_sync(
                        frameio_auth=self.frameio_auth,
                        account_id=account_id,
                        workspace_id=workspace_id
                    )
                
                # Arrêter le serveur et le tunnel
                self.webhook_manager.stop_webhook_server()
                
            logger.info("🛑 Système webhook arrêté")
            
        except Exception as e:
            logger.error(f"❌ Erreur arrêt système: {e}")
    
    def print_system_status(self):
        """Affiche le statut du système"""
        try:
            print("\n" + "="*60)
            print("📊 STATUT SYSTÈME WEBHOOK FRAME.IO")
            print("="*60)
            
            if self.webhook_manager:
                stats = self.webhook_manager.get_webhook_stats()
                
                print(f"🔗 URL webhook: {stats.get('webhook_url', 'Non définie')}")
                print(f"📡 Statut: {stats.get('webhook_status', 'Inactif')}")
                print(f"🆔 Webhook ID: {stats.get('webhook_id', 'Non créé')}")
                print(f"📈 Total événements: {stats.get('total_events', 0)}")
                
                # Tunnel info
                tunnel_info = stats.get('tunnel_info')
                if tunnel_info:
                    print(f"🌐 Tunnel Cloudflare: {'✅ Actif' if tunnel_info.get('is_healthy') else '❌ Inactif'}")
                    print(f"🔌 Port webhook: {tunnel_info.get('webhook_port')}")
                
                # Événements par type
                events_by_type = stats.get('events_by_type', {})
                if events_by_type:
                    print("\n📋 Événements par type:")
                    for event_type, count in events_by_type.items():
                        print(f"   {event_type}: {count}")
                
                # Dernier événement
                last_event = stats.get('last_event')
                if last_event:
                    print(f"\n⏰ Dernier événement: {last_event['event_type']}")
                    print(f"   Fichier: {last_event.get('file_name', 'N/A')}")
                    print(f"   Timestamp: {last_event.get('timestamp', 'N/A')}")
            
            print("="*60)
            
        except Exception as e:
            logger.error(f"❌ Erreur affichage statut: {e}")


async def main():
    """Fonction principale de test"""
    integration_manager = WebhookIntegrationManager()
    
    try:
        # Initialiser les composants
        if not await integration_manager.initialize_components():
            return
        
        # Démarrer le système webhook
        if not await integration_manager.start_webhook_system():
            return
        
        # Afficher le statut
        integration_manager.print_system_status()
        
        # Créer le webhook Frame.io (optionnel, nécessite auth)
        print("\n⚠️ Pour créer le webhook Frame.io, vous devez être authentifié")
        print("   Configurez client_id, client_secret, account_id, workspace_id dans config/frameio_config.json")
        
        # Surveiller les webhooks
        await integration_manager.monitor_webhooks(duration=300)  # 5 minutes
        
    except KeyboardInterrupt:
        logger.info("🛑 Arrêt demandé par l'utilisateur")
    finally:
        # Arrêter le système
        await integration_manager.stop_webhook_system()


if __name__ == "__main__":
    asyncio.run(main())
