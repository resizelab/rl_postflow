#!/usr/bin/env python3
"""
🔔 Test Complet - Tous les Templates Discord
===========================================

Teste et envoie TOUS les templates de notifications Discord disponibles
pour vérifier leur fonctionnement et leur rendu.

Version: 4.1.1
Date: 10 juillet 2025
"""

import sys
import os
import json
import asyncio
from pathlib import Path
from datetime import datetime

# Ajouter le répertoire parent au PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.discord.notifier import DiscordNotifier
from src.integrations.discord.user_notifier import DiscordUserNotifier
from src.integrations.sheets.users import SheetsUserManager
from src.utils.config import ConfigManager


async def test_all_discord_templates():
    """Test TOUS les templates Discord disponibles"""
    print("🔔 TEST COMPLET - TOUS LES TEMPLATES DISCORD")
    print("=" * 60)
    
    try:
        # Configuration
        print("\n📋 Initialisation...")
        config_manager = ConfigManager()
        config = config_manager.get_config()
        
        discord_config = config.get('discord', {})
        webhook_url = discord_config.get('webhook_url')
        
        if not webhook_url or webhook_url == "YOUR_DISCORD_WEBHOOK_URL":
            print("❌ Configuration Discord manquante")
            return False
        
        # Setup notifiers
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
        
        try:
            user_manager = SheetsUserManager(config_manager)
        except:
            user_manager = None
        
        user_notifier = DiscordUserNotifier(
            discord_notifier=discord_notifier,
            user_manager=user_manager
        )
        
        print("✅ Configuration terminée")
        
        # Message d'introduction
        await user_notifier.send_system_notification(
            "🧪 DÉBUT DES TESTS",
            "Test de tous les templates Discord - RL PostFlow v4.1.1"
        )
        
        await asyncio.sleep(2)  # Pause entre notifications
        
        print("\n🎬 1. Test: notify_file_processed")
        await user_notifier.notify_file_processed(
            file_path=Path("SQ01_UNDLM_12345_v001.mp4"),
            frameio_link="https://app.frame.io/fake-link-test",
            user_identifier="test@example.com",
            thumbnail_url="https://drive.google.com/fake-thumbnail"
        )
        await asyncio.sleep(2)
        
        print("\n⚙️ 2. Test: send_system_notification")
        await user_notifier.send_system_notification(
            "🚀 Système opérationnel",
            "Le pipeline RL PostFlow fonctionne parfaitement !",
            user_identifier="admin@example.com"
        )
        await asyncio.sleep(2)
        
        print("\n📊 3. Test: send_pipeline_report")
        test_stats = {
            'total_shots': 50,
            'completed_shots': 42,
            'failed_shots': 3,
            'pending_shots': 5,
            'upload_success_rate': 93.3
        }
        await user_notifier.send_pipeline_report(test_stats)
        await asyncio.sleep(2)
        
        print("\n✅ 4. Test: notify_upload_complete_async")
        await user_notifier.notify_upload_complete_async(
            file_name="FINAL_RENDER_4K.mp4",
            frameio_link="https://app.frame.io/final-render",
            user_identifier="director@example.com",
            additional_info="Rendu 4K HDR terminé - Prêt pour review"
        )
        await asyncio.sleep(2)
        
        print("\n❌ 5. Test: notify_error")
        await user_notifier.notify_error(
            error_type="Upload Timeout",
            file_path=Path("problematic_large_file.mp4"),
            error_message="Connexion Frame.io timeout après 10min - Fichier trop volumineux",
            user_identifier="admin@example.com"
        )
        await asyncio.sleep(2)
        
        # Tests des templates hérités (synchrones)
        print("\n🔄 6. Test: upload_complete (template hérité)")
        user_notifier.notify_upload_complete(
            shot_name="SQ01_UNDLM_12345",
            scene="SQ01",
            version="v003",
            frameio_link="https://app.frame.io/sq01-shot",
            assigned_user="artist@example.com"
        )
        await asyncio.sleep(2)
        
        print("\n💥 7. Test: upload_failed (template hérité)")
        user_notifier.notify_upload_failed(
            shot_name="SQ02_UNDLM_67890",
            scene="SQ02",
            error_message="Erreur codec non supporté",
            assigned_user="editor@example.com"
        )
        await asyncio.sleep(2)
        
        print("\n👤 8. Test: shot_assigned (template hérité)")
        user_notifier.notify_shot_assigned(
            shot_name="SQ03_UNDLM_11111",
            scene="SQ03",
            assigned_user="compositor@example.com",
            priority="HIGH",
            deadline="15 juillet 2025"
        )
        await asyncio.sleep(2)
        
        print("\n🎯 9. Test: review_requested (template hérité)")
        user_notifier.notify_review_requested(
            shot_name="SQ01_UNDLM_99999",
            frameio_link="https://app.frame.io/review-request",
            reviewer="supervisor@example.com",
            requested_by="artist@example.com"
        )
        await asyncio.sleep(2)
        
        print("\n🏆 10. Test: scene_complete (template hérité)")
        user_notifier.notify_scene_complete(
            scene="SQ01",
            completed_shots_count=12,
            total_duration="02:35",
            team_members=["artist1@example.com", "artist2@example.com"]
        )
        await asyncio.sleep(2)
        
        print("\n🚨 11. Test: error_alert (template hérité)")
        user_notifier.notify_error_alert(
            module="Frame.io Uploader",
            error_message="API Rate limit atteint - Retry dans 5min",
            severity="WARNING",
            admin_user="devops@example.com"
        )
        await asyncio.sleep(2)
        
        # Test template personnalisé
        print("\n🎨 12. Test: Template personnalisé")
        
        # Ajouter un template custom
        from src.integrations.discord.user_notifier import NotificationTemplate
        
        custom_template = NotificationTemplate(
            title="🎨 Template Personnalisé",
            message="Ceci est un exemple de template personnalisé pour RL PostFlow",
            color=0xFF6B6B,  # Rouge pastel
            fields=[
                {"name": "🎬 Projet", "value": "RL PostFlow v4.1.1", "inline": True},
                {"name": "📅 Date", "value": "10 juillet 2025", "inline": True},
                {"name": "🔧 Status", "value": "Test en cours", "inline": True},
                {"name": "💡 Note", "value": "Les templates personnalisés permettent une flexibilité totale", "inline": False}
            ]
        )
        
        user_notifier.add_custom_template("test_custom", custom_template)
        user_notifier.send_templated_notification(
            template_name="test_custom",
            user_identifier="developer@example.com"
        )
        await asyncio.sleep(2)
        
        # Message de fin
        await user_notifier.send_system_notification(
            "🎉 TESTS TERMINÉS",
            f"Tous les {len(user_notifier.get_available_templates())} templates ont été testés avec succès !"
        )
        
        print(f"\n🎉 TOUS LES TESTS TERMINÉS!")
        print(f"📊 {len(user_notifier.get_available_templates())} templates testés")
        print("✅ Vérifiez Discord pour voir tous les résultats")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Erreur lors des tests: {e}")
        import traceback
        traceback.print_exc()
        return False


async def main():
    """Point d'entrée principal"""
    print("🚀 DÉMARRAGE DU TEST COMPLET DES TEMPLATES DISCORD")
    print("🎯 Ce script va envoyer TOUS les templates sur Discord")
    print("=" * 70)
    
    # Confirmation utilisateur
    confirm = input("\n⚠️  Êtes-vous sûr de vouloir envoyer tous les templates sur Discord ? (o/N): ")
    if confirm.lower() not in ['o', 'oui', 'y', 'yes']:
        print("❌ Test annulé par l'utilisateur")
        return False
    
    print("\n🎬 Lancement du test complet...")
    
    success = await test_all_discord_templates()
    
    if success:
        print("\n🎉 SUCCÈS TOTAL!")
        print("✅ Tous les templates Discord ont été envoyés")
        print("📱 Vérifiez votre canal Discord pour voir les résultats")
    else:
        print("\n❌ ÉCHEC DU TEST")
        print("🔧 Vérifiez la configuration et les logs")
    
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
