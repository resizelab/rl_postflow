#!/usr/bin/env python3
"""
Script pour tester le statut du pipeline en temps réel
"""

import requests
import time
import json
from datetime import datetime

def test_dashboard_api():
    """Test l'API du dashboard pour vérifier la cohérence des statuts"""
    base_url = "http://localhost:8080"
    
    print("🔍 Test du statut du pipeline via l'API dashboard...")
    
    try:
        # Test de l'API status
        response = requests.get(f"{base_url}/api/status", timeout=5)
        if response.status_code == 200:
            status = response.json()
            print(f"✅ API Status OK")
            print(f"  - Running: {status.get('running', False)}")
            print(f"  - Processing: {status.get('processing', False)}")
            print(f"  - Components: {status.get('components', {})}")
            
            if 'demo_mode' in status:
                print(f"  - Mode démo: {status['demo_mode']}")
            
            if 'queue_size' in status:
                print(f"  - Queue size: {status['queue_size']}")
            
            if 'error_count' in status:
                print(f"  - Error count: {status['error_count']}")
        else:
            print(f"❌ API Status Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erreur API Status: {e}")
    
    print()
    
    try:
        # Test de l'API queue stats
        response = requests.get(f"{base_url}/api/queue/stats", timeout=5)
        if response.status_code == 200:
            stats = response.json()
            print(f"✅ API Queue Stats OK")
            print(f"  - Pending: {stats.get('pending', 0)}")
            print(f"  - Processing: {stats.get('processing', 0)}")
            print(f"  - Completed: {stats.get('completed', 0)}")
            print(f"  - Failed: {stats.get('failed', 0)}")
            print(f"  - Success rate: {stats.get('success_rate', 0)}%")
        else:
            print(f"❌ API Queue Stats Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erreur API Queue Stats: {e}")

    print()
    
    try:
        # Test de l'API health
        response = requests.get(f"{base_url}/api/health", timeout=5)
        if response.status_code == 200:
            health = response.json()
            print(f"✅ API Health OK")
            print(f"  - Status: {health.get('status', 'unknown')}")
            print(f"  - Uptime: {health.get('uptime', 'unknown')}")
        else:
            print(f"❌ API Health Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erreur API Health: {e}")

def monitor_pipeline_status(duration=30):
    """Surveille le statut du pipeline pendant une durée donnée"""
    print(f"📊 Surveillance du statut du pipeline pendant {duration} secondes...")
    
    start_time = time.time()
    last_processing_state = None
    
    while time.time() - start_time < duration:
        try:
            response = requests.get("http://localhost:8080/api/status", timeout=5)
            if response.status_code == 200:
                status = response.json()
                processing = status.get('processing', False)
                
                if processing != last_processing_state:
                    timestamp = datetime.now().strftime("%H:%M:%S")
                    state_text = "ACTIF" if processing else "ARRÊTÉ"
                    print(f"[{timestamp}] Changement d'état: {state_text}")
                    last_processing_state = processing
                
                # Afficher les détails toutes les 10 secondes
                if int(time.time() - start_time) % 10 == 0:
                    timestamp = datetime.now().strftime("%H:%M:%S")
                    state_text = "ACTIF" if processing else "ARRÊTÉ"
                    queue_size = status.get('queue_size', 0)
                    error_count = status.get('error_count', 0)
                    print(f"[{timestamp}] Status: {state_text}, Queue: {queue_size}, Erreurs: {error_count}")
                    
        except Exception as e:
            print(f"❌ Erreur surveillance: {e}")
            
        time.sleep(1)
    
    print("🏁 Fin de la surveillance")

if __name__ == "__main__":
    print("🚀 Test du statut du pipeline RL PostFlow")
    print("=" * 50)
    
    # Test des APIs
    test_dashboard_api()
    
    print("\n" + "=" * 50)
    
    # Surveillance en continu
    try:
        monitor_pipeline_status(30)
    except KeyboardInterrupt:
        print("\n⏹️  Arrêt demandé par l'utilisateur")
    
    print("\n✅ Tests terminés")
