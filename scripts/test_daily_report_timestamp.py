#!/usr/bin/env python3
"""
Test du daily_report corrigé pour timestamp
"""

import sys
import json
from pathlib import Path
import pytz
from datetime import datetime

# Ajouter le répertoire parent au path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.discord import DiscordNotifier

def get_paris_time():
    """Retourne l'heure actuelle à Paris."""
    paris_tz = pytz.timezone('Europe/Paris')
    return datetime.now(paris_tz)

def test_daily_report_timestamp():
    """Test la création d'un embed de rapport quotidien avec timestamp."""
    
    print("🧪 Test du timestamp dans le rapport quotidien...")
    
    try:
        # Configuration Discord
        webhook_url = "https://discord.com/api/webhooks/1310946063334842450/rLrpHlVo7gm9Bnk1xXrVQvQzQrK0f4Pqoa7UZxz2lO01j4J4Oj4j_Vr9Vp4D4eJ1J4j4"
        discord_config = {
            'webhook_url': webhook_url,
            'username': 'PostFlow BOT Test',
            'avatar_url': ''
        }
        
        notifier = DiscordNotifier(discord_config)
        
        # Debug: vérifier la configuration
        print(f"🔍 Webhook URL configuré: {notifier.webhook_url is not None}")
        print(f"🔍 Bot name: {notifier.bot_name}")
        
        if not notifier.webhook_url:
            print("⚠️ Webhook URL non configuré, on utilise une URL de test")
            notifier.webhook_url = webhook_url
        
        # Créer l'embed comme dans daily_report.py
        embed = {
            "title": "📋 Rapport Quotidien de Production",
            "description": "Statistiques détaillées du pipeline PostFlow",
            "color": 0x9932cc,  # Violet
            "fields": [
                {"name": "🎬 Scènes Uniques", "value": "15", "inline": True},
                {"name": "📁 Fichiers Sources", "value": "320", "inline": True},
                {"name": "🔄 Doublons Détectés", "value": "8", "inline": True},
                {"name": "⚠️ Trous Nomenclature", "value": "3", "inline": True},
                {"name": "📊 Taux de Completion", "value": "85.2%", "inline": True}
            ],
            "timestamp": get_paris_time().isoformat()
        }
        
        # Ajouter une attention si nécessaire
        embed["fields"].append({
            "name": "🚨 Attention",
            "value": "2 plans en erreur nécessitent une attention",
            "inline": False
        })
        
        print(f"📊 Timestamp généré: {get_paris_time().isoformat()}")
        print(f"🕐 Heure Paris: {get_paris_time().strftime('%H:%M')}")
        
        # Envoyer le message
        result = notifier.send_message("", embed)
        
        if result:
            print("✅ Rapport quotidien envoyé avec timestamp correct!")
            print("💡 Vérifiez sur Discord: un seul timestamp doit apparaître en bas")
        else:
            print("❌ Échec de l'envoi")
            
        return result
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == "__main__":
    test_daily_report_timestamp()
