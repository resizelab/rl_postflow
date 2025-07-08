"""
Test simple des nouveaux modules sans configuration externe
"""

import asyncio
import logging
from pathlib import Path

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ajout du chemin pour les imports
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))


def test_imports():
    """Test des imports des nouveaux modules."""
    logger.info("📦 Test des imports...")
    
    try:
        # Test import sheets
        from src.integrations.sheets.auth import GoogleSheetsAuth, GoogleSheetsConfig
        logger.info("✅ Import sheets.auth réussi")
        
        from src.integrations.sheets.users import get_assigned_user
        logger.info("✅ Import sheets.users réussi")
        
        from src.integrations.sheets.status import SheetsStatusTracker
        logger.info("✅ Import sheets.status réussi")
        
        # Test import discord
        from src.integrations.discord.notifier import DiscordNotifier, create_discord_notifier
        logger.info("✅ Import discord.notifier réussi")
        
        try:
            from src.integrations.discord.bot import DiscordBot
            logger.info("✅ Import discord.bot réussi")
        except ImportError as e:
            logger.warning(f"⚠️ Import discord.bot échoué: {e}")
        
        # Test import frameio enrichi
        from src.integrations.frameio.upload import FrameIOUploadManager
        logger.info("✅ Import frameio.upload réussi")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur import: {e}")
        return False


def test_structures():
    """Test des structures de données."""
    logger.info("🏗️ Test des structures...")
    
    try:
        from src.integrations.sheets.auth import GoogleSheetsConfig
        from src.integrations.sheets.users import User
        from src.integrations.frameio.upload import FrameIOFile, UploadResult
        
        # Test GoogleSheetsConfig
        config = GoogleSheetsConfig(
            credentials_file="test.json",
            spreadsheet_id="test-id",
            worksheet_name="Test"
        )
        logger.info(f"✅ GoogleSheetsConfig créé: {config.worksheet_name}")
        
        # Test User
        user = User(
            name="Test User",
            discord_id="123456789",
            email="test@example.com",
            role="Supervisor"
        )
        logger.info(f"✅ User créé: {user.name}")
        
        # Test FrameIOFile avec nouveaux champs
        frameio_file = FrameIOFile(
            id="test-id",
            name="test.mp4",
            size=1024,
            status="completed",
            folder_id="folder-id",
            project_id="project-id",
            workspace_id="workspace-id",
            account_id="account-id",
            review_url="https://app.frame.io/test",
            share_url="https://share.frame.io/test"
        )
        logger.info(f"✅ FrameIOFile créé avec liens: {frameio_file.review_url}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur structures: {e}")
        return False


def test_discord_notifier():
    """Test du notificateur Discord sans webhook."""
    logger.info("📢 Test Discord notifier...")
    
    try:
        from src.integrations.discord.notifier import DiscordNotifier, DiscordNotifierConfig
        
        # Créer une config de test
        config = DiscordNotifierConfig(
            webhook_url="https://discord.com/api/webhooks/test",
            channel_name="test-channel",
            bot_name="Test Bot"
        )
        
        # Créer le notificateur
        notifier = DiscordNotifier(config)
        logger.info("✅ DiscordNotifier créé")
        
        # Test des méthodes utilitaires
        emoji = notifier._get_status_emoji("completed")
        color = notifier._get_status_color("completed")
        logger.info(f"✅ Emoji: {emoji}, Color: {color}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur Discord notifier: {e}")
        return False


async def test_frameio_methods():
    """Test des nouvelles méthodes Frame.io."""
    logger.info("🎬 Test Frame.io enrichi...")
    
    try:
        from src.integrations.frameio.upload import FrameIOUploadManager, FrameIOFile
        from src.integrations.frameio.auth import FrameIOAuth
        
        # Créer l'auth (sans se connecter)
        auth = FrameIOAuth()
        
        # Créer l'upload manager
        upload_manager = FrameIOUploadManager(auth)
        logger.info("✅ FrameIOUploadManager créé")
        
        # Test des nouvelles méthodes (sans exécution réelle)
        # Vérifier que les méthodes existent
        assert hasattr(upload_manager, 'get_file_review_link')
        assert hasattr(upload_manager, 'get_file_share_link')
        assert hasattr(upload_manager, 'enrich_file_with_links')
        logger.info("✅ Nouvelles méthodes Frame.io présentes")
        
        # Test avec un fichier factice
        test_file = FrameIOFile(
            id="test-id",
            name="test.mp4",
            size=1024,
            status="completed",
            folder_id="folder-id",
            project_id="project-id",
            workspace_id="workspace-id",
            account_id="account-id"
        )
        
        # Vérifier que les nouveaux champs existent
        assert hasattr(test_file, 'review_url')
        assert hasattr(test_file, 'share_url')
        logger.info("✅ Nouveaux champs FrameIOFile présents")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur Frame.io: {e}")
        return False


def test_integration_flow():
    """Test du flux d'intégration sans connexions réelles."""
    logger.info("🔄 Test flux d'intégration...")
    
    try:
        # Simuler le workflow
        shot_id = "UNDLM_00412"
        scene_name = "TEST SCENE"
        version = "v001"
        
        # 1. Simuler un fichier Frame.io
        from src.integrations.frameio.upload import FrameIOFile
        frameio_file = FrameIOFile(
            id="test-file-id",
            name=f"{shot_id}_{version}.mp4",
            size=1024000,
            status="completed",
            folder_id="test-folder",
            project_id="test-project",
            workspace_id="test-workspace",
            account_id="test-account",
            review_url=f"https://app.frame.io/workspace/test-workspace/asset/test-file-id",
            share_url=f"https://share.frame.io/test-file-id"
        )
        logger.info(f"✅ Fichier Frame.io simulé: {frameio_file.name}")
        
        # 2. Simuler un utilisateur assigné
        from src.integrations.sheets.users import User
        assigned_user = User(
            name="John Supervisor",
            discord_id="123456789012345",
            email="john@example.com",
            role="Supervisor"
        )
        logger.info(f"✅ Utilisateur assigné simulé: {assigned_user.name}")
        
        # 3. Simuler la notification Discord
        from src.integrations.discord.notifier import DiscordNotifier, DiscordNotifierConfig
        config = DiscordNotifierConfig(
            webhook_url="https://discord.com/api/webhooks/test",
            channel_name="test-channel"
        )
        notifier = DiscordNotifier(config)
        
        # Tester la structure du message (sans envoyer)
        message_parts = []
        if assigned_user.discord_id:
            message_parts.append(f"Hey <@{assigned_user.discord_id}>")
        message_parts.append(f"🎬 Le plan **{shot_id}** ({scene_name}) {version} est disponible pour review")
        
        message = " ".join(message_parts)
        logger.info(f"✅ Message Discord formaté: {message}")
        
        # 4. Simuler la mise à jour Google Sheets
        update_data = {
            "shot_id": shot_id,
            "frameio_link": frameio_file.review_url,
            "status": "review_uploaded"
        }
        logger.info(f"✅ Données Google Sheets préparées: {update_data}")
        
        logger.info("✅ Flux d'intégration simulé avec succès")
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur flux d'intégration: {e}")
        return False


async def main():
    """Test principal."""
    logger.info("🧪 Test des nouveaux modules PostFlow v0.1.4b")
    
    tests = [
        ("Imports", test_imports),
        ("Structures", test_structures),
        ("Discord Notifier", test_discord_notifier),
        ("Frame.io Enrichi", test_frameio_methods),
        ("Flux d'intégration", test_integration_flow)
    ]
    
    results = []
    for name, test_func in tests:
        logger.info(f"\n--- Test: {name} ---")
        if asyncio.iscoroutinefunction(test_func):
            success = await test_func()
        else:
            success = test_func()
        results.append((name, success))
        logger.info(f"{'✅' if success else '❌'} {name}: {'PASS' if success else 'FAIL'}")
    
    # Résumé
    logger.info("\n🎯 Résumé des tests:")
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for name, success in results:
        logger.info(f"  {'✅' if success else '❌'} {name}")
    
    logger.info(f"\n📊 Tests: {passed}/{total} réussis")
    
    if passed == total:
        logger.info("🎉 Tous les tests sont passés ! Les nouveaux modules sont fonctionnels.")
    else:
        logger.warning("⚠️ Certains tests ont échoué. Vérifiez les erreurs ci-dessus.")


if __name__ == "__main__":
    asyncio.run(main())
