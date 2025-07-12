#!/usr/bin/env python3
"""
Script pour arrêter proprement le pipeline PostFlow
"""

import os
import sys
import signal
import subprocess
import time

def stop_postflow():
    """Arrête tous les processus PostFlow"""
    print("🛑 Arrêt du pipeline PostFlow...")
    
    processes_found = False
    
    # Arrêter main.py
    try:
        result = subprocess.run(['pgrep', '-f', 'main.py'], capture_output=True, text=True)
        if result.stdout:
            pids = result.stdout.strip().split('\n')
            for pid in pids:
                if pid:
                    try:
                        print(f"🔥 Arrêt du processus principal {pid}")
                        os.kill(int(pid), signal.SIGTERM)
                        processes_found = True
                    except Exception as e:
                        print(f"⚠️ Erreur arrêt processus {pid}: {e}")
    except Exception as e:
        print(f"⚠️ Erreur recherche processus main.py: {e}")
    
    # Arrêter dashboard.py
    try:
        result = subprocess.run(['pgrep', '-f', 'dashboard.py'], capture_output=True, text=True)
        if result.stdout:
            pids = result.stdout.strip().split('\n')
            for pid in pids:
                if pid:
                    try:
                        print(f"🔥 Arrêt du dashboard {pid}")
                        os.kill(int(pid), signal.SIGTERM)
                        processes_found = True
                    except Exception as e:
                        print(f"⚠️ Erreur arrêt dashboard {pid}: {e}")
    except Exception as e:
        print(f"⚠️ Erreur recherche processus dashboard.py: {e}")
    
    # Attendre un peu
    if processes_found:
        print("⏳ Attente de l'arrêt des processus...")
        time.sleep(3)
        
        # Vérifier si des processus sont encore actifs
        remaining = []
        
        # Vérifier main.py
        try:
            result = subprocess.run(['pgrep', '-f', 'main.py'], capture_output=True, text=True)
            if result.stdout:
                remaining.extend(result.stdout.strip().split('\n'))
        except:
            pass
        
        # Vérifier dashboard.py
        try:
            result = subprocess.run(['pgrep', '-f', 'dashboard.py'], capture_output=True, text=True)
            if result.stdout:
                remaining.extend(result.stdout.strip().split('\n'))
        except:
            pass
        
        # Arrêt forcé si nécessaire
        if remaining:
            print("⚠️ Processus encore actifs, arrêt forcé...")
            for pid in remaining:
                if pid:
                    try:
                        os.kill(int(pid), signal.SIGKILL)
                        print(f"🔥 Processus {pid} arrêté de force")
                    except:
                        pass
        
        print("✅ Tous les processus PostFlow ont été arrêtés")
    else:
        print("ℹ️ Aucun processus PostFlow trouvé")

if __name__ == "__main__":
    try:
        stop_postflow()
    except KeyboardInterrupt:
        print("\n🛑 Arrêt du script")
    except Exception as e:
        print(f"❌ Erreur: {e}")
        sys.exit(1)
