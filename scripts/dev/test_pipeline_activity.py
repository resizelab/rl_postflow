#!/usr/bin/env python3
"""
Script pour simuler de l'activité dans le pipeline et tester les changements de statut
"""

import sys
import os
import time
import json
import requests
from pathlib import Path

# Ajouter le répertoire parent au path pour les imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from src.core.error_handler import ErrorHandler
from src.core.config_manager import ConfigManager

def test_pipeline_activity():
    """Test l'activité du pipeline en créant de fausses tâches"""
    
    print("🔧 Simulation d'activité dans le pipeline...")
    
    try:
        # Initialiser les composants
        config_manager = ConfigManager()
        error_handler = ErrorHandler(config_manager)
        
        print("✅ Composants initialisés")
        
        # Créer quelques tâches de test
        test_files = [
            "/tmp/test_file1.mp4",
            "/tmp/test_file2.mp4",
            "/tmp/test_file3.mp4"
        ]
        
        for i, file_path in enumerate(test_files):
            print(f"📝 Ajout de la tâche {i+1}: {file_path}")
            error_handler.queue.enqueue_task(
                task_type="test_upload",
                file_path=file_path,
                metadata={"test": True, "task_id": i+1}
            )
            time.sleep(1)
            
        print(f"📊 Tâches ajoutées: {len(test_files)}")
        
        # Vérifier le statut via l'API
        print("\n🔍 Vérification du statut via l'API...")
        
        for i in range(10):
            try:
                response = requests.get("http://localhost:8080/api/status", timeout=3)
                if response.status_code == 200:
                    status = response.json()
                    processing = status.get('processing', False)
                    queue_size = status.get('queue_size', 0)
                    
                    print(f"[{i+1:2d}] Processing: {processing}, Queue: {queue_size}")
                    
                    if processing and queue_size > 0:
                        print("✅ Le pipeline traite correctement les tâches !")
                        break
                else:
                    print(f"❌ Erreur API: {response.status_code}")
                    
            except Exception as e:
                print(f"❌ Erreur requête: {e}")
                
            time.sleep(2)
        
        print("\n🏁 Fin de la simulation")
        
    except Exception as e:
        print(f"❌ Erreur simulation: {e}")

def check_dashboard_consistency():
    """Vérifie la cohérence entre le dashboard et l'état réel du pipeline"""
    
    print("🔍 Vérification de la cohérence du dashboard...")
    
    apis_to_check = [
        "/api/status",
        "/api/queue/stats", 
        "/api/health"
    ]
    
    for api in apis_to_check:
        try:
            response = requests.get(f"http://localhost:8080{api}", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {api}: OK")
                
                # Afficher quelques clés importantes
                if 'processing' in data:
                    print(f"   - Processing: {data['processing']}")
                if 'queue_size' in data:
                    print(f"   - Queue size: {data['queue_size']}")
                if 'pending' in data:
                    print(f"   - Pending: {data['pending']}")
                if 'healthy' in data:
                    print(f"   - Healthy: {data['healthy']}")
                    
            else:
                print(f"❌ {api}: Error {response.status_code}")
                
        except Exception as e:
            print(f"❌ {api}: Exception {e}")
    
    print("\n✅ Vérification terminée")

if __name__ == "__main__":
    print("🚀 Test d'activité du pipeline RL PostFlow")
    print("=" * 60)
    
    # Vérifier la cohérence d'abord
    check_dashboard_consistency()
    
    print("\n" + "=" * 60)
    
    # Simuler de l'activité
    test_pipeline_activity()
    
    print("\n" + "=" * 60)
    
    # Vérifier à nouveau après l'activité
    check_dashboard_consistency()
    
    print("\n✅ Tests d'activité terminés")
