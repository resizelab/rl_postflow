"""
Script de test pour l'intégration complète PostFlow
Teste les nouvelles fonctionnalités Frame.io + Discord + Google Sheets
"""

import asyncio
import logging
import os
from pathlib import Path

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ajout du chemin pour les imports
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.frameio.auth import FrameIOAuth
from src.integrations.discord.notifier import create_discord_notifier
from src.integrations.sheets.auth import GoogleSheetsAuth, GoogleSheetsConfig
from src.integrations.sheets.users import init_sheets_user_manager, get_assigned_user
from examples.complete_integration import PostFlowIntegration


async def test_complete_integration():
    """Test de l'intégration complète."""
    
    try:
        logger.info("🚀 Test intégration complète PostFlow")
        
        # Configuration Frame.io
        frameio_auth = FrameIOAuth()
        
        # Configuration Discord (utilise le webhook existant)
        discord_webhook = os.getenv('DISCORD_WEBHOOK_URL', 'https://discord.com/api/webhooks/YOUR-WEBHOOK-URL')
        
        # Configuration Google Sheets
        sheets_config = GoogleSheetsConfig(
            credentials_file=os.getenv('GOOGLE_SHEETS_CREDENTIALS', 'config/google_sheets_credentials.json'),
            spreadsheet_id=os.getenv('GOOGLE_SHEETS_ID', 'your-spreadsheet-id'),
            worksheet_name="Shot Tracking"
        )
        
        # Créer l'intégration
        integration = PostFlowIntegration(frameio_auth, discord_webhook, sheets_config)
        
        # Initialiser
        logger.info("📋 Initialisation de l'intégration...")
        if not await integration.initialize():
            logger.error("❌ Impossible d'initialiser l'intégration")
            return
        
        logger.info("✅ Intégration initialisée avec succès")
        
        # Test des fonctionnalités
        
        # 1. Test récupération utilisateur assigné
        logger.info("👤 Test récupération utilisateur assigné...")
        test_shot_id = "UNDLM_00412"
        assigned_user = integration.get_assigned_user_info(test_shot_id)
        
        if assigned_user:
            logger.info(f"✅ Utilisateur assigné: {assigned_user}")
        else:
            logger.warning("⚠️ Aucun utilisateur assigné trouvé")
        
        # 2. Test récupération statut plan
        logger.info("📊 Test récupération statut plan...")
        shot_status = integration.get_shot_status(test_shot_id)
        
        if shot_status:
            logger.info(f"✅ Statut du plan: {shot_status}")
        else:
            logger.warning("⚠️ Aucun statut trouvé pour le plan")
        
        # 3. Test notification Discord
        logger.info("📢 Test notification Discord...")
        discord_notifier = create_discord_notifier(discord_webhook)
        
        notification_sent = discord_notifier.notify_shot_upload_complete(
            shot_nomenclature="UNDLM_TEST",
            scene_name="TEST SCENE",
            version="v001",
            frameio_link="https://app.frame.io/workspace/test/asset/test",
            mention_user_id=assigned_user.get('discord_id') if assigned_user else None
        )
        
        if notification_sent:
            logger.info("✅ Notification Discord envoyée")
        else:
            logger.warning("⚠️ Notification Discord non envoyée")
        
        # 4. Test simulation d'upload complet (sans fichier réel)
        logger.info("🎬 Test simulation upload complet...")
        
        # Créer un fichier de test temporaire
        test_file = Path("/tmp/test_upload.mp4")
        test_file.write_text("test content")
        
        try:
            # Simuler un upload (va échouer mais tester la logique)
            success = await integration.process_shot_upload(
                shot_id="UNDLM_TEST",
                file_path=str(test_file),
                scene_name="TEST SCENE"
            )
            
            if success:
                logger.info("✅ Upload simulé réussi")
            else:
                logger.info("ℹ️ Upload simulé échoué (normal avec fichier test)")
                
        except Exception as e:
            logger.info(f"ℹ️ Upload simulé échoué: {e} (normal)")
        
        finally:
            # Nettoyer
            if test_file.exists():
                test_file.unlink()
        
        logger.info("🎉 Test intégration complète terminé")
        
    except Exception as e:
        logger.error(f"❌ Erreur test intégration: {e}")


async def test_discord_notifier():
    """Test spécifique du notificateur Discord."""
    
    try:
        logger.info("📢 Test notificateur Discord")
        
        discord_webhook = os.getenv('DISCORD_WEBHOOK_URL', 'https://discord.com/api/webhooks/YOUR-WEBHOOK-URL')
        
        if 'YOUR-WEBHOOK-URL' in discord_webhook:
            logger.warning("⚠️ Webhook Discord non configuré, skip du test")
            return
        
        notifier = create_discord_notifier(discord_webhook)
        
        # Test message simple
        success = notifier.send_message("🧪 Test message depuis PostFlow Integration")
        
        if success:
            logger.info("✅ Message Discord envoyé")
        else:
            logger.warning("⚠️ Message Discord non envoyé")
        
        # Test notification complète
        success = notifier.notify_shot_upload_complete(
            shot_nomenclature="UNDLM_TEST",
            scene_name="TEST INTEGRATION",
            version="v001",
            frameio_link="https://app.frame.io/workspace/test/asset/test",
            mention_user_id=None  # Pas de mention pour le test
        )
        
        if success:
            logger.info("✅ Notification upload Discord envoyée")
        else:
            logger.warning("⚠️ Notification upload Discord non envoyée")
            
    except Exception as e:
        logger.error(f"❌ Erreur test Discord: {e}")


async def test_sheets_connection():
    """Test spécifique de la connexion Google Sheets."""
    
    try:
        logger.info("📊 Test connexion Google Sheets")
        
        credentials_file = os.getenv('GOOGLE_SHEETS_CREDENTIALS', 'config/google_sheets_credentials.json')
        spreadsheet_id = os.getenv('GOOGLE_SHEETS_ID', 'your-spreadsheet-id')
        
        if not Path(credentials_file).exists():
            logger.warning("⚠️ Fichier credentials Google Sheets non trouvé, skip du test")
            return
        
        if spreadsheet_id == 'your-spreadsheet-id':
            logger.warning("⚠️ ID Google Sheets non configuré, skip du test")
            return
        
        # Configuration
        config = GoogleSheetsConfig(
            credentials_file=credentials_file,
            spreadsheet_id=spreadsheet_id,
            worksheet_name="Shot Tracking"
        )
        
        # Test connexion
        auth = GoogleSheetsAuth(config)
        
        if auth.connect():
            logger.info("✅ Connexion Google Sheets réussie")
            
            # Test récupération worksheet
            worksheet = auth.get_worksheet("Shot Tracking")
            if worksheet:
                logger.info("✅ Worksheet 'Shot Tracking' trouvée")
            else:
                logger.warning("⚠️ Worksheet 'Shot Tracking' non trouvée")
                
        else:
            logger.warning("⚠️ Connexion Google Sheets échouée")
            
    except Exception as e:
        logger.error(f"❌ Erreur test Google Sheets: {e}")


async def main():
    """Fonction principale de test."""
    
    logger.info("🔧 Démarrage des tests d'intégration PostFlow")
    
    # Test 1: Discord
    await test_discord_notifier()
    
    # Test 2: Google Sheets
    await test_sheets_connection()
    
    # Test 3: Intégration complète
    await test_complete_integration()
    
    logger.info("🎯 Tests terminés")


if __name__ == "__main__":
    asyncio.run(main())
