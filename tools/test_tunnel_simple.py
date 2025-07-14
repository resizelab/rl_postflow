#!/usr/bin/env python3
"""
Test simple du tunnel Cloudflare pour webhooks
"""

import sys
import logging
import time
from pathlib import Path

# Ajouter le répertoire parent au path pour les imports
sys.path.append(str(Path(__file__).parent.parent))

from src.integrations.frameio.webhook_tunnel import WebhookTunnelManager

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def test_tunnel():
    """Test simple du tunnel webhook"""
    
    print("🧪 Test du tunnel Cloudflare pour webhooks")
    print("="*50)
    
    # Créer le gestionnaire de tunnel
    tunnel_manager = WebhookTunnelManager(webhook_port=8080)
    
    try:
        # Vérifier cloudflared
        if not tunnel_manager.is_cloudflared_available():
            print("❌ cloudflared n'est pas installé")
            print("   Installez avec: brew install cloudflared (macOS) ou téléchargez depuis https://github.com/cloudflare/cloudflared/releases")
            return
        
        print("✅ cloudflared disponible")
        
        # Démarrer le tunnel
        print("🚀 Démarrage du tunnel Cloudflare...")
        tunnel_url = tunnel_manager.start_webhook_tunnel(timeout=60)
        
        if tunnel_url:
            print(f"✅ Tunnel actif: {tunnel_url}")
            print(f"🔗 Endpoint webhook: {tunnel_url}/frameio-webhook")
            
            # Afficher les infos du tunnel
            tunnel_info = tunnel_manager.get_tunnel_info()
            print(f"📊 Port local: {tunnel_info['webhook_port']}")
            print(f"🟢 Statut: {'Sain' if tunnel_info['is_healthy'] else 'Problème'}")
            
            # Maintenir le tunnel ouvert pour test
            print("\n⏳ Tunnel ouvert pour test (Ctrl+C pour arrêter)...")
            try:
                while True:
                    time.sleep(1)
                    if not tunnel_manager.is_tunnel_healthy():
                        print("⚠️ Tunnel devenu non-sain")
                        break
            except KeyboardInterrupt:
                print("\n🛑 Arrêt demandé")
        else:
            print("❌ Échec démarrage tunnel")
            
    except Exception as e:
        logger.error(f"❌ Erreur test tunnel: {e}")
    finally:
        # Arrêter le tunnel
        print("🛑 Arrêt du tunnel...")
        tunnel_manager.stop_webhook_tunnel()
        print("✅ Tunnel arrêté")


if __name__ == "__main__":
    test_tunnel()
