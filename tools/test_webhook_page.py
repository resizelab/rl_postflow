#!/usr/bin/env python3
"""
Test rapide de la page webhook du dashboard
"""

import requests
import time

def test_webhook_page():
    """Teste l'accès à la page webhook"""
    
    print("🧪 Test de la page webhook dashboard...")
    
    # Attendre que le dashboard soit prêt
    time.sleep(2)
    
    try:
        # Tester la page webhook
        print("📄 Test page webhook...")
        response = requests.get("http://localhost:8081/webhook", timeout=5)
        
        if response.status_code == 200:
            print("✅ Page webhook accessible")
            print(f"📊 Taille réponse: {len(response.text)} caractères")
        else:
            print(f"❌ Page webhook erreur: {response.status_code}")
            
        # Tester l'API webhook status
        print("🔗 Test API webhook status...")
        response = requests.get("http://localhost:8081/api/webhook/status", timeout=5)
        
        if response.status_code == 200:
            print("✅ API webhook status accessible")
            data = response.json()
            print(f"📊 Statut webhook: {data.get('status', 'unknown')}")
        else:
            print(f"❌ API webhook status erreur: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erreur test: {e}")

if __name__ == "__main__":
    test_webhook_page()
