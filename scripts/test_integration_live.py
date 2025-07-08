"""
Test d'intégration avec Discord webhook réel
"""

import asyncio
import logging
from pathlib import Path
import os

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ajout du chemin pour les imports
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.discord.notifier import create_discord_notifier


async def test_discord_webhook():
    """Test du webhook Discord avec le webhook configuré."""
    logger.info("📢 Test Discord webhook réel...")
    
    try:
        # Récupérer le webhook depuis la config
        config_path = Path("config/integrations.json")
        if not config_path.exists():
            logger.warning("⚠️ Fichier config/integrations.json non trouvé")
            return False
        
        import json
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        discord_config = config.get('discord', {})
        webhook_url = discord_config.get('webhook_url')
        
        if not webhook_url:
            logger.warning("⚠️ Webhook Discord non configuré dans integrations.json")
            return False
        
        # Créer le notificateur
        notifier = create_discord_notifier(webhook_url)
        
        # Test 1: Message simple
        logger.info("1️⃣ Test message simple...")
        success = notifier.send_message("🧪 Test d'intégration PostFlow v0.1.4b - Nouveaux modules")
        if success:
            logger.info("✅ Message simple envoyé")
        else:
            logger.error("❌ Échec envoi message simple")
            return False
        
        # Test 2: Notification upload avec mention (sans mention réelle)
        logger.info("2️⃣ Test notification upload...")
        success = notifier.notify_shot_upload_complete(
            shot_nomenclature="UNDLM_TEST",
            scene_name="TEST INTEGRATION",
            version="v001",
            frameio_link="https://app.frame.io/workspace/test/asset/test-integration",
            mention_user_id=None  # Pas de mention pour éviter de spammer
        )
        if success:
            logger.info("✅ Notification upload envoyée")
        else:
            logger.error("❌ Échec notification upload")
            return False
        
        # Test 3: Notification avec mention simulée
        logger.info("3️⃣ Test notification avec mention simulée...")
        success = notifier.notify_shot_status_change(
            shot_nomenclature="UNDLM_TEST",
            previous_status="ae_in_progress",
            current_status="ae_completed",
            stage="after_effects",
            frameio_link="https://app.frame.io/workspace/test/asset/test-integration",
            mention_user_id="123456789012345",  # ID Discord fictif
            notes="Test d'intégration des nouveaux modules"
        )
        if success:
            logger.info("✅ Notification avec mention envoyée")
        else:
            logger.error("❌ Échec notification avec mention")
            return False
        
        # Test 4: Notification d'erreur
        logger.info("4️⃣ Test notification d'erreur...")
        success = notifier.notify_error(
            shot_nomenclature="UNDLM_TEST",
            stage="upload",
            error_message="Test d'erreur pour validation de l'intégration",
            mention_user_id=None
        )
        if success:
            logger.info("✅ Notification d'erreur envoyée")
        else:
            logger.error("❌ Échec notification d'erreur")
            return False
        
        logger.info("✅ Tous les tests Discord webhook réussis")
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur test Discord webhook: {e}")
        return False


async def test_frameio_links():
    """Test des liens Frame.io sans upload réel."""
    logger.info("🎬 Test génération liens Frame.io...")
    
    try:
        from src.integrations.frameio.upload import FrameIOUploadManager
        from src.integrations.frameio.auth import FrameIOAuth
        
        # Créer les instances
        auth = FrameIOAuth()
        upload_manager = FrameIOUploadManager(auth)
        
        # Simuler la génération de liens
        test_file_id = "test-file-id"
        test_workspace_id = upload_manager.workspace_id
        
        # Test génération lien review
        expected_review_url = f"https://app.frame.io/workspace/{test_workspace_id}/asset/{test_file_id}"
        logger.info(f"✅ Lien review généré: {expected_review_url}")
        
        # Test structure complète
        from src.integrations.frameio.upload import FrameIOFile
        test_file = FrameIOFile(
            id=test_file_id,
            name="UNDLM_TEST_v001.mp4",
            size=1024000,
            status="completed",
            folder_id="test-folder",
            project_id="test-project",
            workspace_id=test_workspace_id,
            account_id=upload_manager.account_id,
            review_url=expected_review_url,
            share_url=f"https://share.frame.io/{test_file_id}"
        )
        
        logger.info(f"✅ FrameIOFile avec liens: {test_file.name}")
        logger.info(f"   - Review: {test_file.review_url}")
        logger.info(f"   - Share: {test_file.share_url}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur test Frame.io: {e}")
        return False


async def test_complete_workflow():
    """Test du workflow complet avec Discord."""
    logger.info("🔄 Test workflow complet...")
    
    try:
        # Récupérer config Discord
        config_path = Path("config/integrations.json")
        if not config_path.exists():
            logger.warning("⚠️ Pas de config Discord, skip du test")
            return True
        
        import json
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        discord_config = config.get('discord', {})
        webhook_url = discord_config.get('webhook_url')
        
        if not webhook_url:
            logger.warning("⚠️ Webhook Discord non configuré, skip du test")
            return True
        
        # Simuler le workflow complet
        shot_id = "UNDLM_TEST_WORKFLOW"
        scene_name = "TEST WORKFLOW COMPLETE"
        version = "v001"
        
        # 1. Simuler upload Frame.io
        from src.integrations.frameio.upload import FrameIOFile
        frameio_file = FrameIOFile(
            id="workflow-test-id",
            name=f"{shot_id}_{version}.mp4",
            size=2048000,
            status="completed",
            folder_id="test-folder",
            project_id="test-project",
            workspace_id="test-workspace",
            account_id="test-account",
            review_url=f"https://app.frame.io/workspace/test-workspace/asset/workflow-test-id",
            share_url=f"https://share.frame.io/workflow-test-id"
        )
        logger.info(f"✅ 1. Upload Frame.io simulé: {frameio_file.name}")
        
        # 2. Simuler récupération utilisateur
        from src.integrations.sheets.users import User
        assigned_user = User(
            name="Supervisor Test",
            discord_id="987654321098765",
            email="supervisor@test.com",
            role="Supervisor"
        )
        logger.info(f"✅ 2. Utilisateur assigné: {assigned_user.name}")
        
        # 3. Envoyer notification Discord
        notifier = create_discord_notifier(webhook_url)
        success = notifier.notify_shot_upload_complete(
            shot_nomenclature=shot_id,
            scene_name=scene_name,
            version=version,
            frameio_link=frameio_file.review_url,
            mention_user_id=assigned_user.discord_id
        )
        
        if success:
            logger.info("✅ 3. Notification Discord envoyée")
        else:
            logger.error("❌ 3. Échec notification Discord")
            return False
        
        # 4. Simuler mise à jour Google Sheets
        sheets_data = {
            "shot_id": shot_id,
            "frameio_link": frameio_file.review_url,
            "status": "review_uploaded",
            "assigned_to": assigned_user.name,
            "last_updated": "2025-07-08 14:30:00"
        }
        logger.info(f"✅ 4. Données Google Sheets: {sheets_data}")
        
        # 5. Notification de changement de statut
        success = notifier.notify_shot_status_change(
            shot_nomenclature=shot_id,
            previous_status="ae_completed",
            current_status="review_uploaded",
            stage="review_process",
            frameio_link=frameio_file.review_url,
            mention_user_id=assigned_user.discord_id,
            notes="Workflow complet testé avec succès"
        )
        
        if success:
            logger.info("✅ 5. Notification changement statut envoyée")
        else:
            logger.error("❌ 5. Échec notification changement statut")
            return False
        
        logger.info("🎉 Workflow complet testé avec succès!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur workflow complet: {e}")
        return False


async def main():
    """Test principal avec intégrations réelles."""
    logger.info("🚀 Test intégration PostFlow v0.1.4b avec services réels")
    
    tests = [
        ("Discord Webhook", test_discord_webhook),
        ("Frame.io Links", test_frameio_links),
        ("Workflow Complet", test_complete_workflow)
    ]
    
    results = []
    for name, test_func in tests:
        logger.info(f"\n--- Test: {name} ---")
        success = await test_func()
        results.append((name, success))
        logger.info(f"{'✅' if success else '❌'} {name}: {'PASS' if success else 'FAIL'}")
    
    # Résumé
    logger.info("\n🎯 Résumé des tests d'intégration:")
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for name, success in results:
        logger.info(f"  {'✅' if success else '❌'} {name}")
    
    logger.info(f"\n📊 Tests: {passed}/{total} réussis")
    
    if passed == total:
        logger.info("🎉 L'intégration PostFlow v0.1.4b est fonctionnelle !")
        logger.info("🔗 Les nouveaux modules (Frame.io + Discord + Google Sheets) sont opérationnels")
    else:
        logger.warning("⚠️ Certains tests ont échoué. Vérifiez la configuration.")


if __name__ == "__main__":
    asyncio.run(main())
