#!/usr/bin/env python3
"""
Test du webhook Frame.io V4 avec format correct et vérification signature
"""

import sys
import os
import time
import logging
import requests
import json
import hmac
import hashlib

# Ajouter le répertoire parent pour les imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.integrations.frameio.webhook_manager import FrameIOWebhookManager
from src.utils.upload_tracker import UploadTracker

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def test_webhook_v4():
    """Test du webhook avec format Frame.io V4"""
    
    print("🚀 Test webhook Frame.io V4 avec format correct")
    print("="*60)
    
    # Initialiser les composants
    upload_tracker = UploadTracker()
    webhook_manager = FrameIOWebhookManager(
        upload_tracker=upload_tracker,
        webhook_port=8080,
        use_cloudflare_tunnel=True
    )
    
    try:
        # Démarrer le serveur webhook
        print("🌐 Démarrage du serveur webhook...")
        webhook_manager.start_webhook_server()
        
        if not webhook_manager.is_running:
            print("❌ Échec démarrage serveur webhook")
            return False
        
        webhook_url = webhook_manager.get_public_webhook_url()
        print(f"✅ Webhook actif: {webhook_url}")
        
        # Test 1: Vérification endpoint GET
        print("\n1️⃣ Test endpoint GET...")
        try:
            response = requests.get(webhook_url, timeout=10)
            if response.status_code == 200:
                print("✅ Endpoint GET fonctionne")
                print(f"📊 Réponse: {json.dumps(response.json(), indent=2)}")
            else:
                print(f"⚠️ Endpoint GET: {response.status_code}")
        except Exception as e:
            print(f"❌ Erreur test GET: {e}")
        
        # Test 2: Simuler un webhook Frame.io V4 valide
        print("\n2️⃣ Test webhook Frame.io V4...")
        
        # Payload selon format Frame.io V4
        v4_payload = {
            "account": {
                "id": "6f70f1bd-7e89-4a7e-b4d3-7e576585a181"
            },
            "project": {
                "id": "7e46e495-4444-4555-8649-bee4d391a997"
            },
            "resource": {
                "id": "d3075547-4e64-45f0-ad12-d075660eddd2",
                "type": "file",
                "name": "test_video_v4.mp4",
                "status": "ready"
            },
            "type": "file.ready",
            "user": {
                "id": "56556a3f-859f-4b38-b6c6-e8625b5da8a5"
            },
            "workspace": {
                "id": "378fcbf7-6f88-4224-8139-6a743ed940b2"
            }
        }
        
        try:
            response = requests.post(
                webhook_url,
                json=v4_payload,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                print("✅ Webhook V4 traité avec succès")
                print(f"📊 Réponse: {response.json()}")
            else:
                print(f"⚠️ Webhook V4: {response.status_code}")
                print(f"📋 Réponse: {response.text}")
                
        except Exception as e:
            print(f"❌ Erreur test webhook V4: {e}")
        
        # Test 3: Vérifier les statistiques
        print("\n3️⃣ Vérification des statistiques...")
        stats = webhook_manager.get_webhook_stats()
        print(f"📊 Événements traités: {stats.get('total_events', 0)}")
        print(f"📋 Types d'événements: {stats.get('events_by_type', {})}")
        
        # Test 4: Test avec signature HMAC (simulation)
        print("\n4️⃣ Test avec signature HMAC...")
        test_signature_verification(webhook_manager)
        
        print(f"\n🌐 Webhook disponible sur: {webhook_url}")
        print("📝 Tu peux maintenant tester manuellement!")
        print("⏹️ Appuie sur Ctrl+C pour arrêter...")
        
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Arrêt demandé...")
            
    finally:
        # Nettoyage
        print("🧹 Nettoyage...")
        webhook_manager.stop_webhook_server()
        print("✅ Test terminé")

def test_signature_verification(webhook_manager):
    """Test de la vérification de signature HMAC"""
    
    print("🔐 Test vérification signature HMAC...")
    
    # Simuler un secret et des données
    test_secret = "test_signing_secret_123"
    timestamp = str(int(time.time()))
    test_body = '{"type":"file.ready","resource":{"id":"test"}}'
    
    # Calculer la signature correcte
    message = f"v0:{timestamp}:{test_body}"
    signature = hmac.new(
        bytes(test_secret, 'latin-1'),
        msg=bytes(message, 'latin-1'),
        digestmod=hashlib.sha256
    ).hexdigest()
    correct_signature = f"v0={signature}"
    
    # Test avec signature correcte
    webhook_manager.webhook_data["signing_secret"] = test_secret
    result = webhook_manager.verify_frameio_signature(
        correct_signature, timestamp, test_body, test_secret
    )
    
    if result:
        print("✅ Vérification signature correcte")
    else:
        print("❌ Échec vérification signature correcte")
    
    # Test avec signature incorrecte
    wrong_signature = "v0=wrong_signature"
    result = webhook_manager.verify_frameio_signature(
        wrong_signature, timestamp, test_body, test_secret
    )
    
    if not result:
        print("✅ Rejet signature incorrecte")
    else:
        print("❌ Échec rejet signature incorrecte")

if __name__ == "__main__":
    test_webhook_v4()
