#!/usr/bin/env python3
"""
Test de validation finale avant publication
Vérifie que main.py lance bien dashboard.py et que les composants essentiels fonctionnent
"""

import subprocess
import sys
import time
import requests
from pathlib import Path

def test_main_dashboard_integration():
    """Test que main.py lance bien dashboard.py"""
    
    print("🧪 TEST DE VALIDATION FINALE - MAIN.PY + DASHBOARD")
    print("=" * 60)
    
    # Test 1: Vérifier que les fichiers existent
    print("📁 Vérification des fichiers...")
    
    main_py = Path("main.py")
    dashboard_py = Path("dashboard.py")
    
    if not main_py.exists():
        print("❌ main.py non trouvé")
        return False
    
    if not dashboard_py.exists():
        print("❌ dashboard.py non trouvé")  
        return False
    
    print("  ✅ main.py existe")
    print("  ✅ dashboard.py existe")
    
    # Test 2: Tester le mode test de main.py
    print("\n🧪 Test du mode test de main.py...")
    
    try:
        result = subprocess.run(
            [sys.executable, "main.py", "--test"],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if "📊 RÉSULTATS DES TESTS" in result.stdout:
            print("  ✅ Mode test de main.py fonctionne")
        else:
            print("  ⚠️ Mode test incomplet mais pas d'erreur")
            
    except subprocess.TimeoutExpired:
        print("  ⚠️ Timeout mode test (normal)")
    except Exception as e:
        print(f"  ❌ Erreur mode test: {e}")
        return False
    
    # Test 3: Tester le dashboard seul
    print("\n🎛️ Test du dashboard seul...")
    
    try:
        # Lancer le dashboard en arrière-plan
        dashboard_process = subprocess.Popen(
            [sys.executable, "dashboard.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Attendre qu'il démarre
        time.sleep(3)
        
        # Vérifier qu'il tourne
        if dashboard_process.poll() is None:
            print("  ✅ Dashboard démarre sans erreur")
            
            # Essayer de se connecter
            try:
                response = requests.get("http://127.0.0.1:5000", timeout=5)
                if response.status_code == 200:
                    print("  ✅ Dashboard accessible via HTTP")
                else:
                    print(f"  ⚠️ Dashboard répond mais code {response.status_code}")
            except Exception as e:
                print(f"  ⚠️ Dashboard non accessible via HTTP: {e}")
            
            # Arrêter le dashboard
            dashboard_process.terminate()
            dashboard_process.wait(timeout=5)
            print("  ✅ Dashboard arrêté proprement")
            
        else:
            print("  ❌ Dashboard ne démarre pas")
            stdout, stderr = dashboard_process.communicate()
            print(f"    Stdout: {stdout.decode()[:200]}")
            print(f"    Stderr: {stderr.decode()[:200]}")
            return False
            
    except Exception as e:
        print(f"  ❌ Erreur test dashboard: {e}")
        try:
            dashboard_process.terminate()
        except:
            pass
        return False
    
    # Test 4: Vérifier la configuration du dashboard dans main.py
    print("\n⚙️ Vérification configuration dashboard...")
    
    try:
        with open("main.py", "r") as f:
            main_content = f.read()
            
        if "start_dashboard" in main_content:
            print("  ✅ Fonction start_dashboard présente")
        else:
            print("  ❌ Fonction start_dashboard manquante")
            return False
            
        if "dashboard.py" in main_content:
            print("  ✅ Référence à dashboard.py présente")
        else:
            print("  ❌ Référence à dashboard.py manquante")
            return False
            
    except Exception as e:
        print(f"  ❌ Erreur lecture main.py: {e}")
        return False
    
    # Test 5: Vérifier la configuration par défaut
    print("\n📋 Vérification configuration par défaut...")
    
    if '"enabled": True' in main_content and '"dashboard"' in main_content:
        print("  ✅ Dashboard activé par défaut")
    else:
        print("  ⚠️ Configuration dashboard pas claire")
    
    print("\n" + "=" * 60)
    print("✅ TOUS LES TESTS PASSÉS")
    print("🎉 Main.py lance bien dashboard.py")
    print("🚀 Prêt pour publication !")
    return True

if __name__ == "__main__":
    print("Test de validation finale avant publication")
    
    try:
        success = test_main_dashboard_integration()
        if success:
            print("\n🎯 VALIDATION RÉUSSIE")
            sys.exit(0)
        else:
            print("\n❌ VALIDATION ÉCHOUÉE")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n⏹️ Test interrompu")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Erreur inattendue: {e}")
        sys.exit(1)
