#!/usr/bin/env python3
"""
📖 Live Log Viewer pour RL PostFlow
================================

Affichage en temps réel des logs du pipeline
"""

import time
import sys
from pathlib import Path
import subprocess
import argparse

def tail_logs(log_file: Path, lines: int = 50):
    """Affiche les logs en temps réel"""
    try:
        print(f"📖 Affichage des logs en temps réel: {log_file}")
        print("=" * 80)
        
        # Afficher les dernières lignes
        result = subprocess.run(['tail', f'-{lines}', str(log_file)], 
                              capture_output=True, text=True)
        if result.stdout:
            print(result.stdout)
        
        print("=" * 80)
        print("🔄 Logs en temps réel (Ctrl+C pour arrêter):")
        print("=" * 80)
        
        # Suivre les nouveaux logs
        process = subprocess.Popen(['tail', '-f', str(log_file)], 
                                 stdout=subprocess.PIPE, 
                                 stderr=subprocess.PIPE,
                                 text=True)
        
        try:
            for line in iter(process.stdout.readline, ''):
                print(line.rstrip())
                sys.stdout.flush()
        except KeyboardInterrupt:
            process.terminate()
            print("\n\n✅ Arrêt de l'affichage des logs")
            
    except Exception as e:
        print(f"❌ Erreur lors de l'affichage des logs: {e}")

def main():
    parser = argparse.ArgumentParser(description='Live Log Viewer pour RL PostFlow')
    parser.add_argument('--lines', '-n', type=int, default=50, 
                       help='Nombre de lignes à afficher initialement')
    parser.add_argument('--file', '-f', type=str, default='logs/postflow.log',
                       help='Fichier de log à afficher')
    
    args = parser.parse_args()
    
    log_file = Path(args.file)
    
    if not log_file.exists():
        print(f"❌ Fichier de log non trouvé: {log_file}")
        print("📂 Fichiers de logs disponibles:")
        logs_dir = Path("logs")
        if logs_dir.exists():
            for log in logs_dir.glob("*.log"):
                print(f"  - {log}")
        return 1
    
    tail_logs(log_file, args.lines)
    return 0

if __name__ == "__main__":
    sys.exit(main())
