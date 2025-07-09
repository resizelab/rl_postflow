#!/usr/bin/env python3
"""
Test d'intégration Discord dans le pipeline principal
Ce script teste l'intégration Discord avec le pipeline complet
"""

import sys
import os
from pathlib import Path

# Ajouter le répertoire parent au path
sys.path.insert(0, str(Path(__file__).parent.parent))

import json
from src.integrations.discord import DiscordNotifier, DiscordConfig

def test_pipeline_integration():
    """Test d'intégration complète avec Discord"""
    
    print("🔧 Test d'intégration Discord dans le pipeline...")
    
    try:
        # Charger la configuration
        config_path = Path(__file__).parent.parent / "config" / "integrations.json"
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        # Créer la configuration Discord
        discord_config = DiscordConfig(
            webhook_url=config['discord']['webhook_url'],
            bot_name=config['discord'].get('username', 'PostFlow BOT'),
            avatar_url=config['discord'].get('avatar_url', '')
        )
        
        # Initialiser le notificateur Discord
        notifier = DiscordNotifier(discord_config)
        
        # Simulation du pipeline complet
        print("🚀 Simulation du pipeline complet...")
        
        # 1. Début du pipeline
        print("\n📤 1. Notification de début de pipeline...")
        notifier.send_message("🚀 **Pipeline Started** - Processing UNDLM documentary shots")
        
        # 2. Parsing CSV
        print("\n📤 2. Notification de parsing CSV...")
        embed = {
            "title": "📊 CSV Parsing Completed",
            "description": "Successfully parsed 347 shots",
            "color": 0x00ff00,
            "fields": [
                {"name": "Total Shots", "value": "347", "inline": True},
                {"name": "Unique Scenes", "value": "23", "inline": True},
                {"name": "Source Files", "value": "12", "inline": True}
            ]
        }
        notifier.send_message("📋 **CSV Parsing Results**", embed)
        
        # 3. Export des données
        print("\n📤 3. Notification d'export des données...")
        file_list = "• JSON: undlm_shots_detailed.json\n• CSV: undlm_shots_flat.csv\n• AE: undlm_shots_ae.json"
        embed = {
            "title": "📤 Data Export Completed",
            "description": "Successfully exported 3 files",
            "color": 0x0099ff,
            "fields": [
                {"name": "Exported Files", "value": file_list, "inline": False}
            ]
        }
        notifier.send_message("📁 **Export Results**", embed)
        
        # 4. Completion du pipeline
        print("\n📤 4. Notification de completion du pipeline...")
        embed = {
            "title": "🎉 Pipeline Processing Completed",
            "description": "UNDLM documentary post-production data processing finished successfully",
            "color": 0x00ff00,
            "fields": [
                {"name": "Total Shots", "value": "347", "inline": True},
                {"name": "Duplicates Found", "value": "23", "inline": True},
                {"name": "Nomenclature Gaps", "value": "0", "inline": True},
                {"name": "Files Exported", "value": "3", "inline": True}
            ]
        }
        notifier.send_message("✅ **Pipeline Completed Successfully**", embed)
        
        # 5. Simulation d'erreur
        print("\n📤 5. Notification d'erreur (simulation)...")
        embed = {
            "title": "❌ Pipeline Error",
            "description": "Error during post-production data processing",
            "color": 0xff0000,
            "fields": [
                {"name": "Error Message", "value": "FileNotFoundError: shots.csv not found", "inline": False}
            ]
        }
        notifier.send_message("🚨 **Pipeline Error**", embed)
        
        print("\n🎉 Test d'intégration Discord terminé avec succès !")
        print("👀 Vérifiez votre serveur Discord pour voir toutes les notifications.")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors du test d'intégration : {str(e)}")
        return False

if __name__ == "__main__":
    success = test_pipeline_integration()
    sys.exit(0 if success else 1)
