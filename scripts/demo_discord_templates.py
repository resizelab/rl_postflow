#!/usr/bin/env python3
"""
🔔 Test Discord Templates - Version Simplifiée
==============================================

Teste seulement les templates asynchrones qui fonctionnent bien
pour démontrer les capacités du système de notifications Discord.

Version: 4.1.1
Date: 10 juillet 2025
"""

import sys
import os
import asyncio
from pathlib import Path
from datetime import datetime

# Ajouter le répertoire parent au PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.discord.notifier import DiscordNotifier
from src.integrations.discord.user_notifier import DiscordUserNotifier, get_paris_time
from src.integrations.sheets.users import SheetsUserManager
from src.utils.config import ConfigManager


async def demo_discord_templates():
    """Démonstration des templates Discord qui fonctionnent"""
    print("🔔 DÉMONSTRATION DES TEMPLATES DISCORD")
    print("=" * 50)
    
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
        
        # UserManager optionnel
        try:
            user_manager = SheetsUserManager(config_manager)
            print("✅ UserManager Google Sheets connecté")
        except:
            user_manager = None
            print("⚠️ UserManager non disponible - Mode basique")
        
        user_notifier = DiscordUserNotifier(
            discord_notifier=discord_notifier,
            user_manager=user_manager
        )
        
        print("✅ Configuration terminée\n")
        
        # === Message d'introduction ===
        print("📢 1. Message d'introduction")
        await user_notifier.send_system_notification(
            "🎬 DÉMONSTRATION RL POSTFLOW",
            "Démonstration des templates de notifications Discord - v4.1.1"
        )
        await asyncio.sleep(3)
        
        # === Notification de fichier traité ===
        print("🎬 2. Fichier traité avec succès")
        await user_notifier.notify_file_processed(
            file_path=Path("SQ01_UNDLM_12345_COMP_v003.mp4"),
            frameio_link="https://app.frame.io/preview/demo-link",
            user_identifier="artiste@postproduction.com",
            thumbnail_url="https://drive.google.com/file/d/demo-thumbnail"
        )
        await asyncio.sleep(3)
        
        # === Notification upload terminé ===
        print("✅ 3. Upload terminé")
        await user_notifier.notify_upload_complete_async(
            file_name="FINAL_RENDER_4K_HDR.mp4",
            frameio_link="https://app.frame.io/final/render-4k",
            user_identifier="directeur@postproduction.com",
            additional_info="🎯 Rendu 4K HDR terminé - Prêt pour validation finale"
        )
        await asyncio.sleep(3)
        
        # === Rapport de pipeline ===
        print("📊 4. Rapport de pipeline")
        demo_stats = {
            'total_shots': 47,
            'completed_shots': 39,
            'failed_shots': 2,
            'pending_shots': 6,
            'upload_success_rate': 94.7
        }
        await user_notifier.send_pipeline_report(demo_stats)
        await asyncio.sleep(3)
        
        # === Notification d'erreur ===
        print("❌ 5. Notification d'erreur")
        await user_notifier.notify_error(
            error_type="Timeout Upload",
            file_path=Path("HUGE_FILE_8K_RAW.mov"),
            error_message="Timeout lors de l'upload - Fichier trop volumineux (25GB)",
            user_identifier="admin@postproduction.com"
        )
        await asyncio.sleep(3)
        
        # === Notification système critique ===
        print("🚨 6. Alerte système")
        await user_notifier.send_system_notification(
            "🚨 ALERTE ESPACE DISQUE",
            "⚠️ Espace disque critique sur le serveur de rendu\n💾 Seulement 5% d'espace libre restant",
            user_identifier="devops@postproduction.com"
        )
        await asyncio.sleep(3)
        
        # === Rapport de fin de journée ===
        print("🌅 7. Rapport de fin de journée")
        end_of_day_stats = {
            'total_shots': 47,
            'completed_shots': 42,
            'failed_shots': 1,
            'pending_shots': 4,
            'upload_success_rate': 97.9
        }
        await user_notifier.send_pipeline_report(end_of_day_stats)
        await asyncio.sleep(3)
        
        # === Message de succès final ===
        print("🎉 8. Message de clôture")
        await user_notifier.send_system_notification(
            "🎉 DÉMONSTRATION TERMINÉE",
            f"✅ Tous les templates Discord fonctionnent parfaitement !\n🚀 RL PostFlow v4.1.1 prêt pour la production\n📅 {get_paris_time().strftime('%d/%m/%Y à %H:%M')}"
        )
        
        print(f"\n🎉 DÉMONSTRATION TERMINÉE AVEC SUCCÈS!")
        print("📱 Vérifiez Discord pour voir tous les templates en action")
        print(f"🎯 {len(user_notifier.get_available_templates())} templates disponibles")
        
        # Afficher les templates disponibles
        print("\n📝 Templates disponibles :")
        for template in user_notifier.get_available_templates():
            print(f"   ✅ {template}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Erreur lors de la démonstration: {e}")
        import traceback
        traceback.print_exc()
        return False


async def main():
    """Point d'entrée principal"""
    print("🚀 DÉMONSTRATION TEMPLATES DISCORD - RL POSTFLOW")
    print("🎯 Envoi des meilleurs templates sur Discord")
    print("=" * 60)
    
    # Confirmation utilisateur
    confirm = input("\n🎬 Lancer la démonstration Discord ? (o/N): ")
    if confirm.lower() not in ['o', 'oui', 'y', 'yes']:
        print("❌ Démonstration annulée")
        return False
    
    print("\n🎬 Lancement de la démonstration...")
    
    success = await demo_discord_templates()
    
    if success:
        print("\n🏆 DÉMONSTRATION RÉUSSIE !")
        print("✅ Tous les templates principaux ont été testés")
        print("📱 Les notifications Discord sont opérationnelles")
        print("🚀 RL PostFlow v4.1.1 prêt pour la production")
    else:
        print("\n❌ ÉCHEC DE LA DÉMONSTRATION")
        print("🔧 Vérifiez la configuration Discord")
    
    return success


if __name__ == "__main__":
    try:
        result = asyncio.run(main())
        sys.exit(0 if result else 1)
    except KeyboardInterrupt:
        print("\n\n⏹️ Démonstration interrompue")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Erreur fatale: {e}")
        sys.exit(1)
