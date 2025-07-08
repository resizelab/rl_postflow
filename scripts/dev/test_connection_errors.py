#!/usr/bin/env python3
"""
Script pour tester la gestion des erreurs de connexion du serveur HTTP
"""

import requests
import time
import threading
from pathlib import Path

def test_connection_interrupted():
    """Test les interruptions de connexion"""
    
    print("🔍 Test de la gestion des erreurs de connexion...")
    
    # Attendre que le pipeline démarre
    time.sleep(2)
    
    # Obtenir le port du serveur HTTP
    try:
        response = requests.get("http://localhost:8080/api/status", timeout=5)
        if response.status_code == 200:
            print("✅ Dashboard accessible")
        else:
            print("❌ Dashboard non accessible")
            return
    except Exception as e:
        print(f"❌ Erreur dashboard: {e}")
        return
    
    # Tester la résistance aux interruptions
    print("\n🌐 Test de résistance aux interruptions de connexion...")
    
    # Simuler plusieurs connexions interrompues
    def interrupted_request():
        """Simule une requête interrompue"""
        try:
            # Faire une requête mais l'interrompre rapidement
            response = requests.get("http://localhost:8080", timeout=0.1)
        except requests.exceptions.Timeout:
            pass  # Normal
        except Exception as e:
            print(f"⚠️  Erreur simulée: {e}")
    
    # Lancer plusieurs requêtes interrompues
    threads = []
    for i in range(5):
        thread = threading.Thread(target=interrupted_request)
        threads.append(thread)
        thread.start()
        time.sleep(0.1)
    
    # Attendre que toutes les requêtes se terminent
    for thread in threads:
        thread.join()
    
    print("✅ Test d'interruption terminé")
    
    # Vérifier que le serveur fonctionne toujours
    try:
        response = requests.get("http://localhost:8080/api/status", timeout=5)
        if response.status_code == 200:
            print("✅ Serveur toujours fonctionnel après interruptions")
        else:
            print("❌ Serveur endommagé après interruptions")
    except Exception as e:
        print(f"❌ Erreur après interruptions: {e}")

def monitor_logs():
    """Surveille les logs pour détecter les erreurs de connexion"""
    
    print("\n📊 Surveillance des logs d'erreur...")
    print("   (Appuyez sur Ctrl+C pour arrêter)")
    
    last_check_time = time.time()
    
    try:
        while True:
            time.sleep(5)
            
            # Vérifier que le pipeline fonctionne toujours
            try:
                response = requests.get("http://localhost:8080/api/status", timeout=3)
                if response.status_code == 200:
                    status = response.json()
                    running = status.get('running', False)
                    timestamp = time.strftime("%H:%M:%S")
                    
                    if running:
                        print(f"[{timestamp}] ✅ Pipeline actif")
                    else:
                        print(f"[{timestamp}] ❌ Pipeline arrêté")
                else:
                    print(f"[{timestamp}] ❌ Erreur API: {response.status_code}")
                    
            except Exception as e:
                timestamp = time.strftime("%H:%M:%S")
                print(f"[{timestamp}] ❌ Erreur connexion: {e}")
                
    except KeyboardInterrupt:
        print("\n⏹️  Arrêt de la surveillance demandé")

if __name__ == "__main__":
    print("🚀 Test de gestion des erreurs de connexion")
    print("=" * 60)
    
    # Test des interruptions
    test_connection_interrupted()
    
    print("\n" + "=" * 60)
    
    # Surveillance des logs
    monitor_logs()
    
    print("\n✅ Tests terminés")
