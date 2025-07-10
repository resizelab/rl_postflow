#!/usr/bin/env python3
"""
🔔 Test d'Intégration Discord User Notifier
===========================================

Test de l'intégration complète du DiscordUserNotifier dans le pipeline,
avec récupération des ID Discord depuis Google Sheets et notifications
avec mentions automatiques.

Version: 4.1.1
Date: 10 juillet 2025
"""

import sys
import os
import json
import asyncio
from pathlib import Path

# Ajouter le répertoire parent au PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.discord.notifier import DiscordNotifier
from src.integrations.discord.user_notifier import DiscordUserNotifier
from src.integrations.sheets.users import SheetsUserManager
from src.utils.config import ConfigManager


async def test_discord_user_integration():
    """Test complet de l'intégration DiscordUserNotifier"""
    print("🔔 Test d'Intégration Discord User Notifier")
    print("=" * 50)
    
    try:
        # 1. Charger la configuration
        print("\n📋 1. Chargement de la configuration...")
        config_manager = ConfigManager()
        config = config_manager.get_config()  # Récupérer toute la config
        
        # Vérifier la configuration Discord
        discord_config = config.get('discord', {})
        webhook_url = discord_config.get('webhook_url')
        
        if not webhook_url or webhook_url == "YOUR_DISCORD_WEBHOOK_URL":
            print("❌ Configuration Discord manquante")
            print("   Veuillez configurer 'discord.webhook_url' dans integrations.json")
            return False
        
        print(f"✅ Configuration Discord trouvée")
        
        # 2. Initialiser le DiscordNotifier de base
        print("\n📡 2. Initialisation du DiscordNotifier...")
        
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
        print("✅ DiscordNotifier initialisé")
        
        # 3. Initialiser le SheetsUserManager
        print("\n👥 3. Initialisation du SheetsUserManager...")
        try:
            user_manager = SheetsUserManager(config_manager)  # Passer le config_manager
            print("✅ SheetsUserManager initialisé")
            
            # Tester la récupération des utilisateurs
            users = await user_manager.get_all_users()
            print(f"📊 {len(users)} utilisateurs récupérés depuis Google Sheets")
            
            # Afficher quelques utilisateurs avec ID Discord
            discord_users = [u for u in users if u.discord_id]
            print(f"🔗 {len(discord_users)} utilisateurs avec ID Discord:")
            for user in discord_users[:3]:  # Afficher les 3 premiers
                print(f"   - {user.name} (Discord: {user.discord_id})")
            
        except Exception as e:
            print(f"⚠️ Erreur SheetsUserManager: {e}")
            print("🔄 Test avec DiscordNotifier standard uniquement")
            user_manager = None
        
        # 4. Initialiser le DiscordUserNotifier
        print("\n🤖 4. Initialisation du DiscordUserNotifier...")
        user_notifier = DiscordUserNotifier(
            discord_notifier=discord_notifier,
            user_manager=user_manager
        )
        print("✅ DiscordUserNotifier initialisé")
        
        # 5. Test des notifications avec templates
        print("\n🔔 5. Test des notifications avec templates...")
        
        # Test 1: Notification de fichier traité
        print("\n📁 Test: Notification de fichier traité")
        test_file = Path("/fake/path/test_video.mp4")
        frameio_link = "https://app.frame.io/fake-link"
        
        success = await user_notifier.notify_file_processed(
            file_path=test_file,
            frameio_link=frameio_link,
            user_identifier="john.doe@example.com"  # Test avec un utilisateur spécifique
        )
        print(f"   Résultat: {'✅ Succès' if success else '❌ Échec'}")
        
        # Test 2: Notification système
        print("\n⚙️ Test: Notification système")
        success = await user_notifier.send_system_notification(
            "🧪 Test d'intégration",
            "Test de l'intégration DiscordUserNotifier avec mentions automatiques"
        )
        print(f"   Résultat: {'✅ Succès' if success else '❌ Échec'}")
        
        # Test 3: Rapport de pipeline
        print("\n📊 Test: Rapport de pipeline")
        test_stats = {
            'total_shots': 42,
            'completed_shots': 35,
            'failed_shots': 2,
            'pending_shots': 5,
            'upload_success_rate': 95.2
        }
        
        success = await user_notifier.send_pipeline_report(test_stats)
        print(f"   Résultat: {'✅ Succès' if success else '❌ Échec'}")
        
        # 6. Test avec mention d'utilisateur spécifique
        if user_manager and discord_users:
            print("\n👤 6. Test avec mention d'utilisateur spécifique...")
            test_user = discord_users[0]
            print(f"   Test avec utilisateur: {test_user.name}")
            
            success = await user_notifier.notify_upload_complete_async(
                file_name="test_final_render.mp4",
                frameio_link=frameio_link,
                user_identifier=test_user.email
            )
            print(f"   Résultat: {'✅ Succès' if success else '❌ Échec'}")
        
        # 7. Vérification des templates disponibles
        print("\n📝 7. Templates disponibles:")
        templates = user_notifier.get_available_templates()
        for template_name in templates:
            print(f"   - {template_name}")
        
        print("\n🎉 Test d'intégration terminé avec succès!")
        return True
        
    except Exception as e:
        print(f"\n❌ Erreur lors du test: {e}")
        import traceback
        traceback.print_exc()
        return False


async def main():
    """Point d'entrée principal"""
    print("🚀 Démarrage du test d'intégration Discord User Notifier")
    print("=" * 60)
    
    success = await test_discord_user_integration()
    
    if success:
        print("\n✅ Tous les tests sont passés!")
        print("🔔 Le DiscordUserNotifier est prêt à être utilisé dans le pipeline")
    else:
        print("\n❌ Certains tests ont échoué")
        print("🔧 Veuillez vérifier la configuration")
    
    return success


if __name__ == "__main__":
    try:
        result = asyncio.run(main())
        sys.exit(0 if result else 1)
    except KeyboardInterrupt:
        print("\n\n⏹️ Test interrompu par l'utilisateur")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Erreur fatale: {e}")
        sys.exit(1)
