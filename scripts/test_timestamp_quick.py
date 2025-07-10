#!/usr/bin/env python3
"""
🔔 Test rapide notification Discord
===================================

Test une seule notification pour vérifier le timestamp.
"""

import sys
import asyncio
from pathlib import Path

# Ajouter le répertoire parent au PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.discord.notifier import DiscordNotifier
from src.integrations.discord.user_notifier import DiscordUserNotifier
from src.utils.config import ConfigManager


async def test_timestamp_quick():
    """Test rapide du timestamp"""
    print("🕐 TEST RAPIDE TIMESTAMP DISCORD")
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
        print(f"📅 ISO format  : {paris_time.isoformat()}")
        
        # Envoyer une notification de test
        print("\n📡 Envoi notification test...")
        
        success = await user_notifier.send_system_notification(
            "🕐 TEST TIMESTAMP",
            f"Test de correction du fuseau horaire\n⏰ Heure Paris : {paris_time.strftime('%H:%M:%S')}"
        )
        
        if success:
            print("✅ Notification envoyée!")
            print("📱 Vérifiez Discord - l'heure doit correspondre à l'heure locale de Paris")
        else:
            print("❌ Échec envoi notification")
        
        return success
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False


if __name__ == "__main__":
    result = asyncio.run(test_timestamp_quick())
    if result:
        print("\n🎉 Test réussi - Vérifiez Discord!")
    else:
        print("\n💥 Test échoué")
