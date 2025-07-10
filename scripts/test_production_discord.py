#!/usr/bin/env python3
"""
Test des notifications Discord avec la configuration de production
"""

import sys
import json
from pathlib import Path
import pytz
from datetime import datetime

# Ajouter le répertoire parent au path
sys.path.insert(0, str(Path(__file__).parent.parent))

def get_paris_time():
    """Retourne l'heure actuelle à Paris."""
    paris_tz = pytz.timezone('Europe/Paris')
    return datetime.now(paris_tz)

def test_production_discord():
    """Test les notifications avec la config de production."""
    
    print("🧪 Test notifications Discord avec config production...")
    print("=" * 60)
    
    try:
        from src.integrations.discord import DiscordNotifier
        
        # Charger la configuration de production
        config_path = Path(__file__).parent.parent / "config" / "integrations.json"
        
        if not config_path.exists():
            print("❌ Fichier de configuration non trouvé")
            return False
        
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        discord_config = config.get('discord', {})
        
        if not discord_config.get('webhook_url'):
            print("❌ Webhook URL non configuré dans la production")
            return False
        
        print(f"🔗 Webhook URL: {discord_config['webhook_url'][:50]}...")
        
        # Créer le notifier avec la config de production
        notifier = DiscordNotifier(discord_config)
        
        print(f"🤖 Bot configuré: {notifier.bot_name}")
        print(f"🔗 Webhook configuré: {notifier.webhook_url is not None}")
        
        # Test 1: Message simple
        print("\n📄 Test 1: Message simple...")
        result1 = notifier.send_message("🧪 Test de compatibilité pipeline - Message simple")
        print(f"   {'✅ Succès' if result1 else '❌ Échec'}")
        
        import time
        time.sleep(2)
        
        # Test 2: Embed avec timestamp
        print("📊 Test 2: Embed avec timestamp Paris...")
        embed = {
            "title": "🧪 Test Pipeline RL PostFlow",
            "description": "Test de compatibilité après modifications timestamp",
            "color": 0x00ff00,
            "fields": [
                {"name": "Test", "value": "Compatibilité modifications", "inline": True},
                {"name": "Timestamp", "value": "Automatique Discord", "inline": True}
            ],
            "timestamp": get_paris_time().isoformat(),
            "footer": {"text": "Test Pipeline"}
        }
        
        result2 = notifier.send_message("", embed)
        print(f"   {'✅ Succès' if result2 else '❌ Échec'}")
        
        time.sleep(2)
        
        # Test 3: Notification d'erreur (comme dans le pipeline)
        print("❌ Test 3: Notification d'erreur (format pipeline)...")
        result3 = notifier.notify_error(
            "Test Erreur Pipeline",
            "Test de compatibilité des notifications d'erreur"
        )
        print(f"   {'✅ Succès' if result3 else '❌ Échec'}")
        
        # Résumé
        total_success = sum([result1, result2, result3])
        print(f"\n🎯 Résultat: {total_success}/3 tests réussis")
        
        if total_success == 3:
            print("🎉 PARFAIT ! Le pipeline Discord fonctionne normalement.")
            print("✅ Nos modifications n'ont pas cassé les notifications du pipeline.")
        elif total_success > 0:
            print("⚠️ Succès partiel. Certaines notifications fonctionnent.")
        else:
            print("❌ PROBLÈME ! Aucune notification ne fonctionne.")
            print("🔧 Il faut investiguer la configuration Discord.")
            
        return total_success == 3
        
    except Exception as e:
        print(f"❌ Erreur critique: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_production_discord()
    if success:
        print("\n✨ Pipeline Discord entièrement fonctionnel!")
    else:
        print("\n🚨 Problème avec les notifications Discord du pipeline!")
