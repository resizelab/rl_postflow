#!/usr/bin/env python3
"""
Test simple du système webhook avec Cloudflare Tunnel
"""

import sys
import os
import time
import logging
import requests

# Ajouter le répertoire parent pour les imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.integrations.frameio.webhook_manager import FrameIOWebhookManager
from src.utils.upload_tracker import UploadTracker

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def test_webhook_simple():
    """Test simple du webhook avec Cloudflare"""
    
    print("🚀 Test simple du webhook PostFlow avec Cloudflare")
    
    # Créer le tracker d'uploads
    upload_tracker = UploadTracker()
    
    # Créer le gestionnaire de webhook avec Cloudflare
    webhook_manager = FrameIOWebhookManager(
        upload_tracker=upload_tracker,
        webhook_port=8080
    )
    
    try:
        # Démarrer le serveur webhook (qui va aussi démarrer le tunnel)
        print("🚀 Démarrage du serveur webhook avec tunnel Cloudflare...")
        webhook_manager.start_webhook_server()
        
        # Attendre que le serveur soit prêt
        time.sleep(5)
        
        # Récupérer l'URL publique
        webhook_url = webhook_manager.get_public_webhook_url()
        
        if not webhook_url:
            print("❌ Impossible d'obtenir l'URL publique du webhook")
            return False
        
        print(f"✅ Webhook actif: {webhook_url}")
        
        # Tester l'endpoint GET
        print("🧪 Test de l'endpoint GET...")
        try:
            response = requests.get(webhook_url, timeout=10)
            if response.status_code == 200:
                print("✅ Endpoint GET fonctionne!")
                print("📊 Réponse:", response.json())
            else:
                print(f"⚠️ Endpoint GET: {response.status_code}")
        except Exception as e:
            print(f"❌ Erreur test GET: {e}")
        
        # Garder le serveur en vie pour test manuel
        print(f"\n🌐 Webhook disponible sur: {webhook_url}")
        print("📝 Tu peux maintenant tester avec ton navigateur!")
        print("⏹️ Appuie sur Ctrl+C pour arrêter...")
        
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Arrêt demandé...")
    
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False
    
    finally:
        # Nettoyage
        print("🧹 Nettoyage...")
        webhook_manager.stop_webhook_server()
        print("✅ Test terminé")

if __name__ == "__main__":
    test_webhook_simple()
