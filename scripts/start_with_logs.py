#!/usr/bin/env python3
"""
🚀 Quick Start Pipeline avec logs en temps réel
==============================================

Script pour démarrer le pipeline et afficher les logs
"""

import subprocess
import time
import sys
import os
from pathlib import Path

def start_pipeline_with_logs():
    """Démarre le pipeline et affiche les logs en temps réel"""
    try:
        print("🚀 Démarrage du pipeline RL PostFlow...")
        print("=" * 60)
        
        # Démarrer le pipeline en arrière-plan
        pipeline_process = subprocess.Popen(
            [sys.executable, 'main.py', '--no-dashboard'],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            universal_newlines=True
        )
        
        print("✅ Pipeline démarré")
        print("📖 Logs en temps réel (Ctrl+C pour arrêter):")
        print("=" * 60)
        
        # Afficher les logs en temps réel
        try:
            for line in iter(pipeline_process.stdout.readline, ''):
                if line:
                    print(line.rstrip())
                    sys.stdout.flush()
        except KeyboardInterrupt:
            print("\n🛑 Arrêt demandé...")
            pipeline_process.terminate()
            pipeline_process.wait()
            print("✅ Pipeline arrêté")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

def main():
    # Vérifier si le pipeline est déjà en cours
    result = subprocess.run(['pgrep', '-f', 'main.py'], 
                          capture_output=True, text=True)
    
    if result.returncode == 0:
        print("⚠️ Le pipeline semble déjà en cours d'exécution")
        print("📖 Affichage des logs en temps réel...")
        
        # Juste afficher les logs
        log_file = Path("logs/postflow.log")
        if log_file.exists():
            subprocess.run(['python', 'view_logs.py'])
    else:
        start_pipeline_with_logs()
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
