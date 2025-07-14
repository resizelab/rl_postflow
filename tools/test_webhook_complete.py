#!/usr/bin/env python3
"""
Test complet du système webhook Frame.io avec Cloudflare Tunnel
"""

import sys
import logging
import time
import json
from pathlib import Path

# Ajouter le répertoire parent au path pour les imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.frameio.webhook_manager import FrameIOWebhookManager
from src.integrations.frameio.webhook_tunnel import WebhookTunnelManager
from src.utils.upload_tracker import UploadTracker

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def test_webhook_system():
    """Test complet du système webhook"""
    
    print("🧪 Test du système webhook Frame.io complet")
    print("=" * 60)
    
    # Initialiser les composants
    upload_tracker = UploadTracker()
    tunnel_manager = WebhookTunnelManager(webhook_port=8080)
    
    print("🔧 Initialisation du webhook manager...")
    webhook_manager = FrameIOWebhookManager(
        upload_tracker=upload_tracker,
        webhook_port=8080,
        use_cloudflare_tunnel=True
    )
    
    try:
        # 1. Démarrer le tunnel Cloudflare
        print("\n1️⃣ Démarrage du tunnel Cloudflare...")
        tunnel_url = tunnel_manager.start_webhook_tunnel(timeout=30)
        
        if not tunnel_url:
            print("❌ Échec du démarrage du tunnel")
            return False
        
        print(f"✅ Tunnel actif: {tunnel_url}")
        
        # 2. Mettre à jour l'URL du webhook manager
        webhook_manager.webhook_url = tunnel_url
        webhook_endpoint = f"{tunnel_url}/frameio-webhook"
        print(f"🔗 Endpoint webhook: {webhook_endpoint}")
        
        # 3. Démarrer le serveur webhook Flask
        print("\n2️⃣ Démarrage du serveur webhook Flask...")
        webhook_manager.start_webhook_server()
        time.sleep(2)
        
        if not webhook_manager.is_running:
            print("❌ Échec du démarrage du serveur webhook")
            return False
        
        print(f"✅ Serveur webhook actif sur port {webhook_manager.webhook_port}")
        
        # 4. Simuler un webhook Frame.io
        print("\n3️⃣ Test de simulation webhook...")
        test_webhook_data = {
            "event_type": "file.upload.completed",
            "resource": {
                "id": "test-file-123",
                "name": "test_video.mp4",
                "status": "processing",
                "project_id": "test-project-456",
                "share_link": "https://frame.io/share/test"
            }
        }
        
        # Traiter le webhook test
        webhook_manager.process_webhook_sync(test_webhook_data)
        print("✅ Webhook test traité")
        
        # 5. Vérifier les statistiques
        print("\n4️⃣ Statistiques webhook:")
        stats = webhook_manager.get_webhook_stats()
        print(f"   📊 Total événements: {stats['total_events']}")
        print(f"   📋 Types d'événements: {stats['events_by_type']}")
        
        # 6. Informations du tunnel
        print("\n5️⃣ Informations tunnel:")
        tunnel_info = tunnel_manager.get_tunnel_info()
        print(f"   🌐 URL: {tunnel_info['tunnel_url']}")
        print(f"   🔌 Port: {tunnel_info['webhook_port']}")
        print(f"   🟢 Statut: {'Sain' if tunnel_info['is_healthy'] else '⚠️ Problème'}")
        
        print("\n✅ Test complet réussi !")
        print("💡 Le système webhook est opérationnel")
        
        # Garder le système ouvert pour test manuel
        print("\n⏳ Système ouvert pour test manuel...")
        print(f"🔗 Testez avec: curl -X POST {webhook_endpoint} -H 'Content-Type: application/json' -d '{{\"test\": true}}'")
        print("   Appuyez sur Ctrl+C pour arrêter...")
        
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Arrêt demandé")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur test webhook: {e}")
        return False
        
    finally:
        # Nettoyage
        print("\n6️⃣ Nettoyage...")
        webhook_manager.stop_webhook_server()
        tunnel_manager.stop_webhook_tunnel()
        print("✅ Nettoyage terminé")


if __name__ == "__main__":
    success = test_webhook_system()
    exit(0 if success else 1)
