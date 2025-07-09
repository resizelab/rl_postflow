#!/usr/bin/env python3
"""
Script de test et démonstration du dashboard PostFlow
"""

import requests
import time
import json
from pathlib import Path

def test_dashboard():
    """Test les fonctionnalités du dashboard."""
    print("🚀 Test du Dashboard PostFlow")
    print("=" * 50)
    
    base_url = "http://localhost:5000"
    
    # Tester la page principale
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        if response.status_code == 200:
            print("✅ Page principale accessible")
        else:
            print(f"❌ Page principale: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur page principale: {e}")
        return False
    
    # Tester l'API status
    try:
        response = requests.get(f"{base_url}/api/status", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ API Status fonctionnelle")
            print(f"   Timestamp: {data.get('timestamp', 'N/A')}")
            print(f"   Queue stats: {data.get('queue_stats', {})}")
        else:
            print(f"❌ API Status: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur API Status: {e}")
    
    # Tester l'API health
    try:
        response = requests.get(f"{base_url}/api/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ API Health fonctionnelle")
            print(f"   Status: {data.get('status', 'N/A')}")
        else:
            print(f"❌ API Health: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur API Health: {e}")
    
    # Tester l'API queue stats
    try:
        response = requests.get(f"{base_url}/api/queue/stats", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ API Queue Stats fonctionnelle")
            print(f"   Stats: {data}")
        else:
            print(f"❌ API Queue Stats: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur API Queue Stats: {e}")
    
    return True

def show_dashboard_info():
    """Affiche les informations du dashboard."""
    print("\n📊 Dashboard PostFlow - Informations")
    print("=" * 50)
    
    print("🌐 **URLs Disponibles:**")
    print("   • Dashboard principal: http://localhost:5000/")
    print("   • API Status:         http://localhost:5000/api/status")
    print("   • API Health:         http://localhost:5000/api/health")
    print("   • API Queue Stats:    http://localhost:5000/api/queue/stats")
    print("   • API Errors:         http://localhost:5000/api/errors")
    
    print("\n🎯 **Fonctionnalités:**")
    print("   • Monitoring temps réel du pipeline")
    print("   • Statistiques des tâches et erreurs")
    print("   • Interface web moderne avec WebSocket")
    print("   • Graphiques et visualisations")
    print("   • Santé du système")
    
    print("\n⚡ **Technologies:**")
    print("   • Flask + Flask-SocketIO")
    print("   • WebSocket pour temps réel")
    print("   • Chart.js pour les graphiques")
    print("   • Interface responsive")
    
    print("\n🔧 **Configuration:**")
    config_path = Path("config/error_handling.json")
    if config_path.exists():
        with open(config_path) as f:
            config = json.load(f)
        print(f"   • Base de données: {config.get('db_path', 'N/A')}")
        print(f"   • Monitoring interval: {config.get('health_monitor', {}).get('check_interval', 'N/A')}s")
        print(f"   • Alertes Discord: {config.get('alerts', {}).get('discord_enabled', False)}")
    else:
        print("   • Configuration non trouvée")

if __name__ == "__main__":
    show_dashboard_info()
    
    print("\n🚀 Lancement du test...")
    time.sleep(2)
    
    success = test_dashboard()
    
    if success:
        print("\n🎉 Dashboard testé avec succès !")
        print("💡 Ouvrez http://localhost:5000/ dans votre navigateur")
    else:
        print("\n❌ Problème avec le dashboard")
        print("💡 Assurez-vous que le dashboard est démarré avec: python dashboard.py")
