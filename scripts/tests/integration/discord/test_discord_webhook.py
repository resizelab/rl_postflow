#!/usr/bin/env python3
"""
Test rapide du webhook Discord avec notification réelle.
Ce script teste le webhook Discord configuré dans integrations.json.
"""

import sys
import os
from pathlib import Path

# Ajouter le répertoire parent au path pour importer les modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.discord import DiscordNotifier, DiscordConfig
import json

def test_discord_webhook():
    """Test du webhook Discord avec notification réelle"""
    
    print("🔧 Test du webhook Discord PostFlow...")
    
    try:
        # Charger la configuration
        config_path = Path(__file__).parent.parent / "config" / "integrations.json"
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        # Vérifier que le webhook est configuré
        webhook_url = config['discord']['webhook_url']
        if webhook_url.startswith('https://discord.com/api/webhooks/'):
            print(f"✅ Webhook URL configuré : {webhook_url[:50]}...")
        else:
            print("❌ Webhook URL non configuré ou invalide")
            return False
        
        # Créer la configuration Discord
        discord_config = DiscordConfig(
            webhook_url=webhook_url,
            bot_name=config['discord'].get('username', 'PostFlow BOT'),
            avatar_url=config['discord'].get('avatar_url', '')
        )
        
        # Initialiser le notificateur Discord
        notifier = DiscordNotifier(discord_config)
        
        # Test 1: Message simple
        print("\n📤 Test 1: Message simple...")
        success = notifier.send_message("🎉 Test de connexion Discord - tout fonctionne !")
        if success:
            print("✅ Test 1 réussi")
        else:
            print("❌ Test 1 échoué")
            return False
        
        # Test 2: Message avec embed
        print("\n📤 Test 2: Message avec embed...")
        embed = {
            "title": "Test PostFlow",
            "description": "Test d'intégration Discord",
            "color": 0x00ff00,
            "fields": [
                {
                    "name": "Statut",
                    "value": "✅ Fonctionnel",
                    "inline": True
                },
                {
                    "name": "Pipeline",
                    "value": "PostFlow UNDLM",
                    "inline": True
                }
            ]
        }
        success = notifier.send_message("📋 Test avec embed", embed)
        if success:
            print("✅ Test 2 réussi")
        else:
            print("❌ Test 2 échoué")
            return False
        
        # Test 3: Rapport quotidien
        print("\n📤 Test 3: Rapport quotidien...")
        stats = {
            "total_shots": 100,
            "completion_percentage": 85.0,
            "status_counts": {
                "final_delivery": 75,
                "review_approved": 10,
                "ae_in_progress": 12,
                "error": 3
            }
        }
        success = notifier.notify_daily_report(stats)
        if success:
            print("✅ Test 3 réussi")
        else:
            print("❌ Test 3 échoué")
            return False
        
        print("\n🎉 Tous les tests Discord ont réussi !")
        print("👀 Vérifiez votre serveur Discord pour voir les notifications.")
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors du test Discord : {str(e)}")
        return False

if __name__ == "__main__":
    success = test_discord_webhook()
    sys.exit(0 if success else 1)
