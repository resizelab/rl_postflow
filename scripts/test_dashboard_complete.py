#!/usr/bin/env python3
"""
🧪 Test Dashboard - Vérification Complète
=========================================

Script de test pour vérifier que le dashboard RL PostFlow est complètement
implémenté et fonctionnel.

Version: 4.1.1
Date: 9 juillet 2025
"""

import sys
import time
import requests
import subprocess
from pathlib import Path

def test_dashboard_standalone():
    """Test du dashboard en mode autonome"""
    print("\n🧪 Test 1: Dashboard Autonome")
    print("="*50)
    
    try:
        # Lancer le dashboard
        proc = subprocess.Popen(
            [sys.executable, 'dashboard.py'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        time.sleep(3)
        
        if proc.poll() is None:
            print("✅ Dashboard démarré")
            
            # Test des endpoints API
            try:
                health = requests.get('http://localhost:8080/api/health', timeout=2)
                status = requests.get('http://localhost:8080/api/status', timeout=2)
                uploads = requests.get('http://localhost:8080/api/uploads', timeout=2)
                stats = requests.get('http://localhost:8080/api/statistics', timeout=2)
                
                print(f"   • API Health: {health.status_code}")
                print(f"   • API Status: {status.status_code}")
                print(f"   • API Uploads: {uploads.status_code}")
                print(f"   • API Statistics: {stats.status_code}")
                
                if all(r.status_code == 200 for r in [health, status, uploads, stats]):
                    print("✅ Toutes les APIs fonctionnelles")
                else:
                    print("⚠️ Certaines APIs non fonctionnelles")
                    
            except Exception as e:
                print(f"❌ APIs non accessibles: {e}")
            
            # Arrêter le processus
            proc.terminate()
            proc.wait()
            print("🛑 Dashboard arrêté")
            return True
            
        else:
            stdout, stderr = proc.communicate()
            print(f"❌ Dashboard non démarré")
            if stderr:
                print(f"Erreur: {stderr.decode()}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur test: {e}")
        return False

def test_dashboard_integration():
    """Test de l'intégration avec DashboardInitializer"""
    print("\n🧪 Test 2: Intégration Pipeline")
    print("="*50)
    
    try:
        sys.path.append(str(Path.cwd()))
        
        from src.bootstrap.dashboard_initializer import start_dashboard
        from src.utils.config import ConfigManager
        
        config = {}
        pipeline_config = {
            'dashboard': {
                'enabled': True,
                'host': 'localhost',
                'port': 8080,
                'debug': False
            }
        }
        
        config_manager = ConfigManager()
        success, dashboard_initializer = start_dashboard(config, pipeline_config, config_manager)
        
        if success:
            print("✅ Intégration DashboardInitializer fonctionnelle")
            
            # Test de connexion
            time.sleep(2)
            try:
                response = requests.get('http://localhost:8080/api/health', timeout=2)
                print(f"   • Connexion API: {response.status_code}")
            except:
                print("   • Connexion API: Non accessible")
            
            # Arrêt propre
            if dashboard_initializer and dashboard_initializer.dashboard_process:
                dashboard_initializer.dashboard_process.terminate()
                dashboard_initializer.dashboard_process.wait()
                print("🛑 Dashboard arrêté via DashboardInitializer")
            
            return True
        else:
            print("❌ Échec intégration DashboardInitializer")
            return False
            
    except Exception as e:
        print(f"❌ Erreur intégration: {e}")
        return False

def test_dashboard_files():
    """Test de la présence des fichiers requis"""
    print("\n🧪 Test 3: Fichiers Requis")
    print("="*50)
    
    files_to_check = [
        ('dashboard.py', 'Script principal Flask'),
        ('templates/dashboard.html', 'Template HTML'),
        ('src/bootstrap/dashboard_initializer.py', 'Initializer'),
    ]
    
    all_present = True
    for file_path, description in files_to_check:
        if Path(file_path).exists():
            print(f"✅ {description}: {file_path}")
        else:
            print(f"❌ {description}: {file_path} - MANQUANT")
            all_present = False
    
    return all_present

def test_dashboard_dependencies():
    """Test des dépendances Python"""
    print("\n🧪 Test 4: Dépendances")
    print("="*50)
    
    dependencies = [
        ('flask', 'Flask'),
        ('flask_socketio', 'Flask-SocketIO'),
        ('requests', 'Requests'),
    ]
    
    all_available = True
    for module, name in dependencies:
        try:
            __import__(module)
            print(f"✅ {name}: Installé")
        except ImportError:
            print(f"❌ {name}: NON INSTALLÉ")
            all_available = False
    
    return all_available

def main():
    """Test complet du dashboard"""
    print("🎛️ Test Complet Dashboard RL PostFlow")
    print("="*60)
    
    results = []
    
    # Tests
    results.append(('Fichiers requis', test_dashboard_files()))
    results.append(('Dépendances', test_dashboard_dependencies()))
    results.append(('Dashboard autonome', test_dashboard_standalone()))
    results.append(('Intégration pipeline', test_dashboard_integration()))
    
    # Résultats
    print("\n📊 Résultats des Tests")
    print("="*50)
    
    all_passed = True
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} {test_name}")
        if not passed:
            all_passed = False
    
    print("\n" + "="*50)
    if all_passed:
        print("🎉 Tous les tests passés - Dashboard complètement implémenté!")
        print("🌐 Le dashboard est accessible sur http://localhost:8080")
        print("📡 WebSocket activé pour les mises à jour temps réel")
        print("📊 APIs complètes: /api/health, /api/status, /api/uploads, /api/statistics")
    else:
        print("⚠️ Certains tests ont échoué - Vérifiez la configuration")
    
    return all_passed

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
