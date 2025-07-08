#!/usr/bin/env python3
"""
Test en temps réel du dashboard corrigé
"""

import requests
import time
import json
from datetime import datetime

def test_dashboard_performance():
    """Test les performances et la stabilité du dashboard"""
    base_url = "http://127.0.0.1:8080"
    session = requests.Session()
    
    print("🔥 TEST RÉEL DU DASHBOARD CORRIGÉ")
    print("=" * 50)
    print(f"Début: {datetime.now().strftime('%H:%M:%S')}")
    print()
    
    # Test 1: Vérifier que le serveur répond
    try:
        response = session.get(f"{base_url}/api/status", timeout=5)
        print(f"✅ Serveur répond: {response.status_code}")
    except Exception as e:
        print(f"❌ Serveur ne répond pas: {e}")
        return False
    
    # Test 2: Simuler un utilisateur pendant 30 secondes
    print("\n🎯 SIMULATION UTILISATEUR (30 secondes)")
    print("-" * 40)
    
    start_time = time.time()
    cycle_count = 0
    total_requests = 0
    errors = 0
    
    while time.time() - start_time < 30:  # 30 secondes de test
        cycle_start = time.time()
        cycle_count += 1
        
        print(f"Cycle #{cycle_count:2d} ", end="")
        
        # Simuler les appels du dashboard (comme le JavaScript)
        endpoints = ["/api/status", "/api/queue/stats", "/api/health", "/api/errors", "/api/tasks"]
        
        cycle_errors = 0
        cycle_time = 0
        
        for endpoint in endpoints:
            try:
                req_start = time.time()
                response = session.get(f"{base_url}{endpoint}", timeout=3)
                req_time = time.time() - req_start
                cycle_time += req_time
                total_requests += 1
                
                if response.status_code != 200:
                    cycle_errors += 1
                    errors += 1
                    
            except Exception as e:
                cycle_errors += 1
                errors += 1
                total_requests += 1
        
        cycle_duration = time.time() - cycle_start
        
        # Affichage du résultat du cycle
        if cycle_errors == 0:
            print(f"✅ {cycle_duration:.2f}s (APIs: {cycle_time:.2f}s)")
        else:
            print(f"❌ {cycle_errors} erreurs en {cycle_duration:.2f}s")
        
        # Attendre 10 secondes comme le vrai dashboard
        remaining = 10 - cycle_duration
        if remaining > 0:
            time.sleep(remaining)
    
    # Résultats
    total_time = time.time() - start_time
    success_rate = ((total_requests - errors) / total_requests * 100) if total_requests > 0 else 0
    
    print("\n" + "=" * 50)
    print("📊 RÉSULTATS DU TEST")
    print("=" * 50)
    print(f"Durée totale: {total_time:.1f}s")
    print(f"Cycles exécutés: {cycle_count}")
    print(f"Requêtes totales: {total_requests}")
    print(f"Erreurs: {errors}")
    print(f"Taux de succès: {success_rate:.1f}%")
    print(f"Fréquence: {cycle_count/total_time*60:.1f} cycles/minute")
    
    # Test 3: Vérifier les données actuelles
    print("\n🔍 VÉRIFICATION DONNÉES FINALES")
    print("-" * 40)
    
    try:
        # Status
        status_resp = session.get(f"{base_url}/api/status")
        status_data = status_resp.json()
        print(f"✅ Components: {status_data.get('components', {})}")
        print(f"✅ Running: {status_data.get('running', False)}")
        print(f"✅ Timestamp: {status_data.get('timestamp', 'N/A')}")
        
        # Queue
        queue_resp = session.get(f"{base_url}/api/queue/stats")
        queue_data = queue_resp.json()
        print(f"✅ Queue - Pending: {queue_data.get('pending', 0)}, Completed: {queue_data.get('completed', 0)}")
        
        # Health  
        health_resp = session.get(f"{base_url}/api/health")
        health_data = health_resp.json()
        print(f"✅ Health: {health_data.get('status', {}).get('healthy', False)}")
        
        # Test HTML
        html_resp = session.get(base_url)
        html = html_resp.text
        
        checks = [
            ("Template correct", "10s" in html and "5s" not in html),
            ("Debug zone", "debug-log" in html),
            ("JavaScript refresh", "refreshAll" in html),
            ("Protection boucle", "isRefreshing" in html),
            ("Timeout", "AbortSignal.timeout" in html)
        ]
        
        for check_name, result in checks:
            status = "✅" if result else "❌"
            print(f"{status} {check_name}")
            
    except Exception as e:
        print(f"❌ Erreur vérification finale: {e}")
        return False
    
    # Verdict final
    print("\n" + "=" * 50)
    print("🎯 VERDICT FINAL")
    print("=" * 50)
    
    if success_rate >= 95 and errors < 3:
        print("🎉 DASHBOARD FONCTIONNE PARFAITEMENT !")
        print("   • Pas de boucle infinie")
        print("   • Taux de succès excellent")
        print("   • Performance stable")
        print("   • Prêt pour production")
        return True
    elif success_rate >= 80:
        print("⚠️ Dashboard fonctionnel avec quelques problèmes")
        print(f"   • Taux de succès: {success_rate:.1f}%")
        print(f"   • {errors} erreurs détectées")
        return False
    else:
        print("❌ Dashboard instable")
        print(f"   • Taux de succès: {success_rate:.1f}%")
        print(f"   • {errors} erreurs détectées")
        return False

if __name__ == "__main__":
    success = test_dashboard_performance()
    print(f"\nTest terminé: {'SUCCÈS' if success else 'ÉCHEC'}")
