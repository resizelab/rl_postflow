#!/usr/bin/env python3
"""
🚀 Démarrage rapide du pipeline avec logs console
==============================================

Démarre le pipeline avec logs visibles dans la console
"""

import subprocess
import sys
import time
import signal
from pathlib import Path

def start_pipeline_with_console_logs():
    """Démarre le pipeline avec logs en console"""
    print("🚀 Démarrage du pipeline RL PostFlow...")
    print("📖 Logs en temps réel (Ctrl+C pour arrêter)")
    print("=" * 60)
    
    try:
        # Démarrer le pipeline avec logs en console
        process = subprocess.Popen(
            [sys.executable, 'main.py', '--no-dashboard', '--debug'],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            universal_newlines=True
        )
        
        # Afficher les logs en temps réel
        try:
            while True:
                output = process.stdout.readline()
                if output == '' and process.poll() is not None:
                    break
                if output:
                    print(output.strip())
                    sys.stdout.flush()
        except KeyboardInterrupt:
            print("\n🛑 Arrêt demandé...")
            process.terminate()
            process.wait()
            print("✅ Pipeline arrêté")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

def signal_handler(sig, frame):
    """Gestionnaire de signal pour arrêt propre"""
    print("\n🛑 Signal d'arrêt reçu...")
    sys.exit(0)

def main():
    # Configurer le gestionnaire de signal
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    start_pipeline_with_console_logs()

if __name__ == "__main__":
    main()
