#!/usr/bin/env python3
"""
Script simple pour tester la cohérence du dashboard
"""

import requests
import time
from datetime import datetime

def test_api_consistency():
    """Test la cohérence des APIs du dashboard"""
    
    print("🔍 Test de cohérence des APIs du dashboard...")
    
    base_url = "http://localhost:8080"
    
    apis = {
        "status": "/api/status",
        "queue_stats": "/api/queue/stats",
        "health": "/api/health"
    }
    
    results = {}
    
    for name, endpoint in apis.items():
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            if response.status_code == 200:
                results[name] = response.json()
                print(f"✅ {name}: OK")
            else:
                print(f"❌ {name}: Error {response.status_code}")
                results[name] = None
                
        except Exception as e:
            print(f"❌ {name}: Exception {e}")
            results[name] = None
    
    print("\n📊 Résumé des statuts:")
    
    # Analyser les résultats
    if results.get("status"):
        status = results["status"]
        print(f"  - Pipeline running: {status.get('running', False)}")
        print(f"  - Pipeline processing: {status.get('processing', False)}")
        print(f"  - Components actifs: {sum(status.get('components', {}).values())}")
        print(f"  - Queue size: {status.get('queue_size', 0)}")
        print(f"  - Error count: {status.get('error_count', 0)}")
    
    if results.get("queue_stats"):
        queue = results["queue_stats"]
        print(f"  - Queue pending: {queue.get('pending', 0)}")
        print(f"  - Queue processing: {queue.get('processing', 0)}")
        print(f"  - Queue completed: {queue.get('completed', 0)}")
        print(f"  - Queue failed: {queue.get('failed', 0)}")
    
    if results.get("health"):
        health = results["health"]
        health_status = health.get('status', {})
        if isinstance(health_status, dict):
            print(f"  - Health checks: {health_status.get('healthy', False)}")
            print(f"  - Health checks count: {len(health_status.get('checks', []))}")
    
    return results

def simulate_file_event():
    """Simule un événement de fichier pour tester la réactivité"""
    
    print("\n🎬 Simulation d'événement de fichier...")
    
    # Créer un fichier temporaire pour déclencher le watcher
    import tempfile
    import os
    
    try:
        # Créer un fichier temporaire dans un répertoire surveillé
        test_file = "/tmp/test_postflow_file.mov"
        with open(test_file, 'w') as f:
            f.write("Test file for PostFlow")
        
        print(f"📁 Fichier créé: {test_file}")
        
        # Surveiller les changements de statut
        print("👀 Surveillance des changements de statut...")
        
        previous_status = None
        
        for i in range(10):
            try:
                response = requests.get("http://localhost:8080/api/status", timeout=3)
                if response.status_code == 200:
                    current_status = response.json()
                    processing = current_status.get('processing', False)
                    queue_size = current_status.get('queue_size', 0)
                    
                    if processing != previous_status:
                        timestamp = datetime.now().strftime("%H:%M:%S")
                        state = "ACTIF" if processing else "ARRÊTÉ"
                        print(f"[{timestamp}] Changement: {state} (Queue: {queue_size})")
                        previous_status = processing
                        
                    if i % 3 == 0:
                        timestamp = datetime.now().strftime("%H:%M:%S")
                        state = "ACTIF" if processing else "ARRÊTÉ"
                        print(f"[{timestamp}] Statut: {state}, Queue: {queue_size}")
                        
            except Exception as e:
                print(f"❌ Erreur surveillance: {e}")
                
            time.sleep(2)
        
        # Nettoyer
        if os.path.exists(test_file):
            os.remove(test_file)
            print(f"🗑️  Fichier nettoyé: {test_file}")
            
    except Exception as e:
        print(f"❌ Erreur simulation: {e}")

def main():
    """Fonction principale"""
    
    print("🚀 Test de cohérence du dashboard RL PostFlow")
    print("=" * 60)
    
    # Test initial
    results = test_api_consistency()
    
    # Vérifier si le pipeline est vraiment actif
    if results.get("status"):
        running = results["status"].get("running", False)
        processing = results["status"].get("processing", False)
        components = results["status"].get("components", {})
        
        print(f"\n🔍 Analyse de l'état du pipeline:")
        print(f"  - Pipeline lancé: {running}")
        print(f"  - En cours de traitement: {processing}")
        print(f"  - Composants actifs: {components}")
        
        # Diagnostiquer les problèmes
        if running and not processing:
            print("ℹ️  Le pipeline est lancé mais n'a pas de tâches à traiter")
            print("   C'est normal s'il n'y a pas de nouveaux fichiers détectés")
        elif not running:
            print("⚠️  Le pipeline n'est pas marqué comme actif")
        
        if not any(components.values()):
            print("⚠️  Aucun composant n'est actif")
    
    print("\n" + "=" * 60)
    
    # Simulation d'événement
    simulate_file_event()
    
    print("\n" + "=" * 60)
    print("✅ Test terminé")

if __name__ == "__main__":
    main()
