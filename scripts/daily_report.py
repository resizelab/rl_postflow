#!/usr/bin/env python3
"""
Rapport quotidien automatisé Discord
Ce script génère et envoie un rapport quotidien du pipeline PostFlow
"""

import sys
import os
import json
from pathlib import Path
from datetime import datetime
import pytz

# Ajouter le répertoire parent au path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.discord import DiscordNotifier
from src.parsers.csv_parser import parse_shots_csv

def get_paris_time():
    """Retourne l'heure actuelle à Paris."""
    paris_tz = pytz.timezone('Europe/Paris')
    return datetime.now(paris_tz)

def generate_daily_report():
    """Génère et envoie un rapport quotidien"""
    
    print("📊 Génération du rapport quotidien PostFlow...")
    
    try:
        # Charger la configuration
        project_root = Path(__file__).parent.parent
        config_path = project_root / "config" / "integrations.json"
        
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        # Créer la configuration Discord
        discord_config = {
            'webhook_url': config['discord']['webhook_url'],
            'username': config['discord'].get('username', 'PostFlow BOT'),
            'avatar_url': config['discord'].get('avatar_url', '')
        }
        
        # Initialiser le notificateur Discord
        notifier = DiscordNotifier(discord_config)
        
        # Analyser les données du pipeline
        csv_file = project_root / "data" / "shots.csv"
        
        if csv_file.exists():
            # Parser le CSV pour obtenir les statistiques
            post_production_data = parse_shots_csv(str(csv_file))
            
            # Calculer les statistiques
            total_shots = post_production_data.project_info.total_shots
            unique_scenes = post_production_data.project_info.unique_scenes
            source_files = len(post_production_data.project_info.source_files)
            duplicates = len(post_production_data.get_duplicate_shots())
            gaps = len(post_production_data.get_nomenclature_gaps())
            
            # Analyser les statuts des plans (simulation)
            # En réalité, ces données viendraient du tracker de statuts
            stats = {
                "total_shots": total_shots,
                "completion_percentage": 78.5,  # Simulation
                "status_counts": {
                    "final_delivery": 198,
                    "review_approved": 45,
                    "ae_completed": 67,
                    "ae_in_progress": 23,
                    "ebsynth_in_progress": 8,
                    "error": 6
                }
            }
            
            # Envoyer le rapport quotidien
            print("📤 Envoi du rapport quotidien...")
            success = notifier.notify_daily_report(stats)
            
            if success:
                # Envoyer un rapport détaillé supplémentaire
                embed = {
                    "title": "� Rapport Quotidien de Production",
                    "description": "Statistiques détaillées du pipeline PostFlow",
                    "color": 0x9932cc,  # Violet
                    "fields": [
                        {"name": "🎬 Scènes Uniques", "value": str(unique_scenes), "inline": True},
                        {"name": "📁 Fichiers Sources", "value": str(source_files), "inline": True},
                        {"name": "🔄 Doublons Détectés", "value": str(duplicates), "inline": True},
                        {"name": "⚠️ Trous Nomenclature", "value": str(gaps), "inline": True},
                        {"name": "📊 Taux de Completion", "value": f"{stats['completion_percentage']:.1f}%", "inline": True}
                    ],
                    "timestamp": get_paris_time().isoformat()
                }
                
                # Ajouter une analyse des erreurs si il y en a
                if stats['status_counts']['error'] > 0:
                    embed["fields"].append({
                        "name": "🚨 Attention",
                        "value": f"{stats['status_counts']['error']} plans en erreur nécessitent une attention",
                        "inline": False
                    })
                
                notifier.send_message("", embed)
                
                print("✅ Rapport quotidien envoyé avec succès!")
                return True
            else:
                print("❌ Échec de l'envoi du rapport quotidien")
                return False
                
        else:
            print("❌ Fichier CSV introuvable. Envoi d'un rapport basique...")
            
            # Rapport basique sans données
            embed = {
                "title": "⚠️ Rapport Quotidien - Données Limitées",
                "description": f"Rapport automatique du {get_paris_time().strftime('%d/%m/%Y')}",
                "color": 0xff9900,  # Orange
                "fields": [
                    {"name": "Status", "value": "Pipeline en attente de données", "inline": False},
                    {"name": "Action Requise", "value": "Vérifier la disponibilité du fichier shots.csv", "inline": False}
                ]
            }
            
            success = notifier.send_message("📊 **Rapport Quotidien**", embed)
            return success
            
    except Exception as e:
        print(f"❌ Erreur lors de la génération du rapport : {str(e)}")
        
        # Envoyer une notification d'erreur
        try:
            discord_config = {
                'webhook_url': config['discord']['webhook_url'],
                'username': config['discord'].get('username', 'PostFlow BOT'),
                'avatar_url': config['discord'].get('avatar_url', '')
            }
            notifier = DiscordNotifier(discord_config)
            
            embed = {
                "title": "❌ Erreur Rapport Quotidien",
                "description": "Erreur lors de la génération du rapport quotidien",
                "color": 0xff0000,
                "fields": [
                    {"name": "Erreur", "value": str(e), "inline": False}
                ],
                "timestamp": get_paris_time().isoformat()
            }
            
            notifier.send_message("🚨 **Erreur Système**", embed)
        except:
            pass
        
        return False

def schedule_daily_report():
    """Information sur la planification du rapport quotidien"""
    
    print("📅 Configuration du rapport quotidien automatique")
    print("=" * 50)
    print()
    print("Pour automatiser l'envoi du rapport quotidien, vous pouvez :")
    print()
    print("1. 🍎 macOS - Utiliser launchd:")
    print("   Créer un fichier ~/Library/LaunchAgents/com.postflow.daily.plist")
    print()
    print("2. 🐧 Linux - Utiliser cron:")
    print("   Ajouter à crontab: 0 9 * * * /path/to/python /path/to/daily_report.py")
    print()
    print("3. 🖥️ Manuel - Exécuter ce script:")
    print("   python scripts/daily_report.py")
    print()
    print("📧 Le rapport sera envoyé chaque jour à 9h00 sur Discord.")
    print()
    
    # Exemple de configuration launchd pour macOS
    launchd_config = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.postflow.daily</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/python3</string>
        <string>/Users/home/Library/CloudStorage/OneDrive-Personnel/WORK/_DEV/rl_postflow/scripts/daily_report.py</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>9</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
</dict>
</plist>"""
    
    print("📄 Exemple de configuration launchd (macOS):")
    print(launchd_config)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--schedule":
        schedule_daily_report()
    else:
        success = generate_daily_report()
        sys.exit(0 if success else 1)
