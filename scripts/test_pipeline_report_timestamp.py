#!/usr/bin/env python3
"""
📊 Test Rapport Pipeline Timestamp
==================================

Test spécifiquement le rapport de pipeline qui causait le problème.
"""

import sys
import asyncio
from pathlib import Path

# Ajouter le répertoire parent au PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.discord.notifier import DiscordNotifier
from src.integrations.discord.user_notifier import DiscordUserNotifier
from src.utils.config import ConfigManager


async def test_pipeline_report_timestamp():
    """Test spécifique du rapport de pipeline"""
    print("📊 TEST RAPPORT PIPELINE TIMESTAMP")
    print("=" * 40)
    
    try:
        # Configuration
        config_manager = ConfigManager()
        config = config_manager.get_config()
        
        discord_config = config.get('discord', {})
        webhook_url = discord_config.get('webhook_url')
        
        if not webhook_url or webhook_url == "YOUR_DISCORD_WEBHOOK_URL":
            print("❌ Configuration Discord manquante")
            return False
        
        # Setup notifier
        class DiscordConfigWrapper:
            def __init__(self, discord_config):
                self.discord_config = discord_config
            
            def get(self, key, default=None):
                if key == 'discord.webhook_url':
                    return self.discord_config.get('webhook_url', default)
                elif key == 'discord.username':
                    return self.discord_config.get('username', default)
                elif key == 'discord.avatar_url':
                    return self.discord_config.get('avatar_url', default)
                return default
        
        config_wrapper = DiscordConfigWrapper(discord_config)
        discord_notifier = DiscordNotifier(config_wrapper)
        user_notifier = DiscordUserNotifier(discord_notifier=discord_notifier, user_manager=None)
        
        print("✅ Configuration OK")
        
        # Test timestamp actuel
        from src.integrations.discord.user_notifier import get_paris_time
        paris_time = get_paris_time()
        print(f"🇫🇷 Heure Paris : {paris_time.strftime('%H:%M:%S')}")
        
        # Envoyer un rapport de pipeline
        print("\n📊 Envoi rapport pipeline...")
        
        test_stats = {
            'total_shots': 50,
            'completed_shots': 45,
            'failed_shots': 1,
            'pending_shots': 4,
            'upload_success_rate': 97.8
        }
        
        success = await user_notifier.send_pipeline_report(test_stats)
        
        if success:
            print("✅ Rapport envoyé!")
            print(f"⏰ L'heure attendue sur Discord : 'Aujourd'hui à {paris_time.strftime('%H:%M')}'")
            print("📱 Vérifiez Discord - le timestamp doit maintenant être correct")
        else:
            print("❌ Échec envoi rapport")
        
        return success
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    result = asyncio.run(test_pipeline_report_timestamp())
    if result:
        print("\n🎉 Test réussi - Le timestamp du rapport doit être corrigé!")
    else:
        print("\n💥 Test échoué")
