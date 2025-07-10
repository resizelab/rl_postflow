#!/usr/bin/env python3
"""
Test de compatibilité des modifications DiscordNotifier
Vérifie que les changements ne cassent pas les usages existants
"""

import sys
from pathlib import Path

# Ajouter le répertoire parent au path
sys.path.insert(0, str(Path(__file__).parent.parent))

def test_discord_notifier_compatibility():
    """Test la compatibilité des différents types de configuration."""
    
    print("🧪 Test de compatibilité DiscordNotifier...")
    print("=" * 50)
    
    try:
        from src.integrations.discord import DiscordNotifier
        from src.integrations.discord.notifier import DiscordNotifierConfig
        
        results = []
        
        # Test 1: Dictionnaire simple (notre nouveau cas)
        print("📄 Test 1: Configuration par dictionnaire...")
        try:
            config_dict = {
                'webhook_url': 'https://test.com/webhook',
                'username': 'Test Bot',
                'avatar_url': 'https://test.com/avatar.png'
            }
            notifier1 = DiscordNotifier(config_dict)
            success1 = (notifier1.webhook_url == 'https://test.com/webhook' and 
                       notifier1.bot_name == 'Test Bot')
            print(f"   {'✅ Succès' if success1 else '❌ Échec'}")
            results.append(("Dictionnaire", success1))
        except Exception as e:
            print(f"   ❌ Erreur: {e}")
            results.append(("Dictionnaire", False))
        
        # Test 2: DiscordNotifierConfig (ancien cas)
        print("🔧 Test 2: Configuration par DiscordNotifierConfig...")
        try:
            config_obj = DiscordNotifierConfig(
                webhook_url='https://test2.com/webhook',
                bot_name='Test Bot 2',
                avatar_url='https://test2.com/avatar.png'
            )
            notifier2 = DiscordNotifier(config_obj)
            success2 = (notifier2.webhook_url == 'https://test2.com/webhook' and 
                       notifier2.bot_name == 'Test Bot 2')
            print(f"   {'✅ Succès' if success2 else '❌ Échec'}")
            results.append(("DiscordNotifierConfig", success2))
        except Exception as e:
            print(f"   ❌ Erreur: {e}")
            results.append(("DiscordNotifierConfig", False))
        
        # Test 3: Configuration wrapper (cas pipeline)
        print("📦 Test 3: Configuration wrapper (pipeline)...")
        try:
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
            
            discord_config = {
                'webhook_url': 'https://test3.com/webhook',
                'username': 'Pipeline Bot',
                'avatar_url': 'https://test3.com/avatar.png'
            }
            config_wrapper = DiscordConfigWrapper(discord_config)
            notifier3 = DiscordNotifier(config_wrapper)
            success3 = (notifier3.webhook_url == 'https://test3.com/webhook' and 
                       notifier3.bot_name == 'Pipeline Bot')
            print(f"   {'✅ Succès' if success3 else '❌ Échec'}")
            results.append(("Wrapper Pipeline", success3))
        except Exception as e:
            print(f"   ❌ Erreur: {e}")
            results.append(("Wrapper Pipeline", False))
        
        # Test 4: create_discord_notifier (fonction helper)
        print("🏭 Test 4: Fonction create_discord_notifier...")
        try:
            from src.integrations.discord import create_discord_notifier
            notifier4 = create_discord_notifier(
                'https://test4.com/webhook',
                'test-channel'
            )
            success4 = (notifier4.webhook_url == 'https://test4.com/webhook' and 
                       notifier4.bot_name == 'RL PostFlow Bot')
            print(f"   {'✅ Succès' if success4 else '❌ Échec'}")
            results.append(("create_discord_notifier", success4))
        except Exception as e:
            print(f"   ❌ Erreur: {e}")
            results.append(("create_discord_notifier", False))
        
        # Résumé
        print("\n" + "=" * 50)
        print("📋 RÉSUMÉ DE COMPATIBILITÉ:")
        print("=" * 50)
        
        success_count = 0
        for test_name, success in results:
            status = "✅ COMPATIBLE" if success else "❌ CASSÉ"
            print(f"{status} - {test_name}")
            if success:
                success_count += 1
        
        print(f"\n🎯 Compatibilité globale: {success_count}/{len(results)} configurations fonctionnent")
        
        if success_count == len(results):
            print("\n🎉 EXCELLENT ! Toutes les configurations sont compatibles.")
            print("💡 Le pipeline peut continuer à fonctionner normalement.")
        else:
            print("\n⚠️ ATTENTION ! Certaines configurations ne fonctionnent plus.")
            print("🔧 Il faut corriger la logique de configuration.")
            
        return success_count == len(results)
        
    except Exception as e:
        print(f"❌ Erreur critique: {e}")
        return False

if __name__ == "__main__":
    success = test_discord_notifier_compatibility()
    if success:
        print("\n✨ Tests de compatibilité réussis!")
    else:
        print("\n🚨 Des corrections de compatibilité sont nécessaires!")
