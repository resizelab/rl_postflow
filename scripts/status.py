#!/usr/bin/env python3
"""
📊 Pipeline Status Monitor
========================

Affichage du statut du pipeline RL PostFlow
"""

import json
import time
import sys
from pathlib import Path
import subprocess
import argparse

def get_pipeline_status():
    """Récupère le statut du pipeline"""
    try:
        # Vérifier si le pipeline est en cours d'exécution
        result = subprocess.run(['pgrep', '-f', 'main.py'], 
                              capture_output=True, text=True)
        
        pipeline_running = result.returncode == 0
        
        # Vérifier ngrok
        ngrok_result = subprocess.run(['pgrep', '-f', 'ngrok'], 
                                    capture_output=True, text=True)
        ngrok_running = ngrok_result.returncode == 0
        
        # Lire les métriques depuis les logs
        log_file = Path("logs/postflow.log")
        metrics = {}
        
        if log_file.exists():
            # Lire les dernières lignes pour extraire les métriques
            result = subprocess.run(['tail', '-100', str(log_file)], 
                                  capture_output=True, text=True)
            
            lines = result.stdout.split('\n')
            for line in lines:
                if 'Fichier uploadé avec succès' in line:
                    metrics['last_upload'] = line.split(' - ')[-1]
                elif 'Tunnel ngrok actif' in line:
                    # Extraire l'URL ngrok
                    parts = line.split(': ')
                    if len(parts) > 1:
                        metrics['ngrok_url'] = parts[-1]
        
        return {
            'pipeline_running': pipeline_running,
            'ngrok_running': ngrok_running,
            'metrics': metrics,
            'timestamp': time.time()
        }
        
    except Exception as e:
        return {'error': str(e)}

def display_status(status: dict):
    """Affiche le statut de manière formatée"""
    print("📊 STATUT DU PIPELINE RL POSTFLOW")
    print("=" * 50)
    
    if 'error' in status:
        print(f"❌ Erreur: {status['error']}")
        return
    
    # Statut des composants
    pipeline_icon = "✅" if status['pipeline_running'] else "❌"
    ngrok_icon = "✅" if status['ngrok_running'] else "❌"
    
    print(f"{pipeline_icon} Pipeline principal: {'En cours' if status['pipeline_running'] else 'Arrêté'}")
    print(f"{ngrok_icon} Tunnel ngrok: {'Actif' if status['ngrok_running'] else 'Inactif'}")
    
    # Métriques
    metrics = status.get('metrics', {})
    if metrics:
        print("\n📈 MÉTRIQUES:")
        print("-" * 30)
        
        if 'ngrok_url' in metrics:
            print(f"🌐 URL ngrok: {metrics['ngrok_url']}")
        
        if 'last_upload' in metrics:
            print(f"📤 Dernier upload: {metrics['last_upload']}")
    
    # Timestamp
    import datetime
    timestamp = datetime.datetime.fromtimestamp(status['timestamp'])
    print(f"\n🕐 Dernière vérification: {timestamp.strftime('%H:%M:%S')}")

def monitor_continuous():
    """Surveillance continue du statut"""
    try:
        while True:
            # Effacer l'écran
            print("\033[2J\033[H")
            
            status = get_pipeline_status()
            display_status(status)
            
            print("\n🔄 Actualisation toutes les 5 secondes (Ctrl+C pour arrêter)")
            time.sleep(5)
            
    except KeyboardInterrupt:
        print("\n✅ Surveillance arrêtée")

def main():
    parser = argparse.ArgumentParser(description='Pipeline Status Monitor')
    parser.add_argument('--continuous', '-c', action='store_true',
                       help='Surveillance continue')
    parser.add_argument('--logs', '-l', action='store_true',
                       help='Afficher les logs après le statut')
    
    args = parser.parse_args()
    
    if args.continuous:
        monitor_continuous()
    else:
        status = get_pipeline_status()
        display_status(status)
        
        if args.logs:
            print("\n📖 DERNIERS LOGS:")
            print("=" * 50)
            log_file = Path("logs/postflow.log")
            if log_file.exists():
                result = subprocess.run(['tail', '-20', str(log_file)], 
                                      capture_output=True, text=True)
                print(result.stdout)
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
