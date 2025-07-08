"""
Test de l'intégration Google Sheets avec la vraie configuration
"""

import asyncio
import logging
import json
from pathlib import Path

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ajout du chemin pour les imports
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.sheets.auth import GoogleSheetsAuth, GoogleSheetsConfig
from src.integrations.sheets.users import init_sheets_user_manager, get_assigned_user
from src.integrations.sheets.status import SheetsStatusTracker


def load_sheets_config():
    """Charge la configuration Google Sheets depuis integrations.json."""
    config_path = Path("config/integrations.json")
    if not config_path.exists():
        logger.error("❌ Fichier config/integrations.json non trouvé")
        return None
    
    try:
        with open(config_path, 'r') as f:
            config_data = json.load(f)
        
        sheets_config = config_data.get('google_sheets', {})
        
        # Vérifier le fichier de credentials
        credentials_file = sheets_config.get('service_account_file')
        if credentials_file and not Path(credentials_file).exists():
            logger.warning(f"⚠️ Fichier credentials non trouvé: {credentials_file}")
            return None
        
        # Créer la config
        config = GoogleSheetsConfig(
            credentials_file=credentials_file,
            spreadsheet_id=sheets_config.get('spreadsheet_id'),
            worksheet_shots_tracks=sheets_config.get('worksheet_shots_tracks', 'SHOTS_TRACK'),
            worksheet_users=sheets_config.get('worksheet_users', 'USERS_INFOS')
        )
        
        logger.info(f"✅ Configuration Google Sheets chargée:")
        logger.info(f"   - Spreadsheet ID: {config.spreadsheet_id[:20]}...")
        logger.info(f"   - Worksheet shots: {config.worksheet_shots_tracks}")
        logger.info(f"   - Worksheet users: {config.worksheet_users}")
        logger.info(f"   - Credentials file: {config.credentials_file}")
        
        return config
        
    except Exception as e:
        logger.error(f"❌ Erreur chargement config: {e}")
        return None


async def test_sheets_connection():
    """Test de la connexion Google Sheets."""
    logger.info("📊 Test connexion Google Sheets...")
    
    config = load_sheets_config()
    if not config:
        logger.warning("⚠️ Configuration Google Sheets non disponible, skip du test")
        return False
    
    try:
        # Test de connexion
        auth = GoogleSheetsAuth(config)
        
        if not auth.connect():
            logger.error("❌ Échec de la connexion Google Sheets")
            return False
        
        logger.info("✅ Connexion Google Sheets réussie")
        
        # Test des worksheets
        shots_worksheet = auth.get_worksheet(config.worksheet_shots_tracks)
        if shots_worksheet:
            logger.info(f"✅ Worksheet '{config.worksheet_shots_tracks}' trouvée")
        else:
            logger.warning(f"⚠️ Worksheet '{config.worksheet_shots_tracks}' non trouvée")
        
        users_worksheet = auth.get_worksheet(config.worksheet_users)
        if users_worksheet:
            logger.info(f"✅ Worksheet '{config.worksheet_users}' trouvée")
        else:
            logger.warning(f"⚠️ Worksheet '{config.worksheet_users}' non trouvée")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur test connexion: {e}")
        return False


async def test_status_tracker():
    """Test du tracker de statut."""
    logger.info("📈 Test status tracker...")
    
    config = load_sheets_config()
    if not config:
        return False
    
    try:
        auth = GoogleSheetsAuth(config)
        if not auth.connect():
            return False
        
        # Créer le tracker
        status_tracker = SheetsStatusTracker(auth)
        
        logger.info(f"✅ Status tracker créé pour worksheet: {status_tracker.worksheet_name}")
        
        # Test récupération des plans
        shots = status_tracker.get_all_shots()
        logger.info(f"✅ Récupéré {len(shots)} plans depuis Google Sheets")
        
        # Afficher quelques exemples
        for i, shot in enumerate(shots[:3]):  # Premiers 3 plans
            logger.info(f"   Plan {i+1}: {shot.get('nomenclature', 'N/A')} - {shot.get('status', 'N/A')}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur test status tracker: {e}")
        return False


async def test_user_manager():
    """Test du gestionnaire d'utilisateurs."""
    logger.info("👥 Test user manager...")
    
    config = load_sheets_config()
    if not config:
        return False
    
    try:
        auth = GoogleSheetsAuth(config)
        if not auth.connect():
            return False
        
        # Initialiser le gestionnaire d'utilisateurs
        user_manager = init_sheets_user_manager(auth)
        
        logger.info(f"✅ User manager initialisé")
        
        # Test récupération des utilisateurs
        users = user_manager.get_all_users()
        logger.info(f"✅ Récupéré {len(users)} utilisateurs depuis Google Sheets")
        
        # Afficher quelques exemples
        for i, user in enumerate(users[:3]):  # Premiers 3 utilisateurs
            logger.info(f"   User {i+1}: {user.name} - Discord: {user.discord_id or 'N/A'}")
        
        # Test fonction get_assigned_user
        test_shot_id = "UNDLM_00412"
        assigned_user = get_assigned_user(test_shot_id)
        
        if assigned_user:
            logger.info(f"✅ Utilisateur assigné pour {test_shot_id}: {assigned_user['name']}")
        else:
            logger.info(f"ℹ️ Aucun utilisateur assigné pour {test_shot_id}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur test user manager: {e}")
        return False


async def test_integration_with_discord():
    """Test d'intégration avec Discord."""
    logger.info("🔗 Test intégration Google Sheets + Discord...")
    
    config = load_sheets_config()
    if not config:
        return False
    
    # Charger config Discord
    config_path = Path("config/integrations.json")
    with open(config_path, 'r') as f:
        config_data = json.load(f)
    
    discord_config = config_data.get('discord', {})
    webhook_url = discord_config.get('webhook_url')
    
    if not webhook_url:
        logger.warning("⚠️ Webhook Discord non configuré, skip du test")
        return True
    
    try:
        # Initialiser Google Sheets
        auth = GoogleSheetsAuth(config)
        if not auth.connect():
            return False
        
        user_manager = init_sheets_user_manager(auth)
        status_tracker = SheetsStatusTracker(auth)
        
        # Initialiser Discord
        from src.integrations.discord.notifier import create_discord_notifier
        notifier = create_discord_notifier(webhook_url)
        
        # Récupérer un plan et son utilisateur assigné
        shots = status_tracker.get_all_shots()
        users = user_manager.get_all_users()
        
        if shots and users:
            test_shot = shots[0]
            test_user = users[0]
            
            # Simuler une notification avec les vraies données
            success = notifier.notify_shot_upload_complete(
                shot_nomenclature=test_shot.get('nomenclature', 'TEST_SHOT'),
                scene_name=test_shot.get('scene_name', 'TEST SCENE'),
                version="v001",
                frameio_link="https://app.frame.io/test",
                mention_user_id=test_user.discord_id
            )
            
            if success:
                logger.info("✅ Notification Discord envoyée avec données Google Sheets")
            else:
                logger.error("❌ Échec notification Discord")
                return False
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur test intégration: {e}")
        return False


async def main():
    """Test principal Google Sheets."""
    logger.info("📊 Test intégration Google Sheets PostFlow v0.1.4b")
    
    tests = [
        ("Connexion Google Sheets", test_sheets_connection),
        ("Status Tracker", test_status_tracker),
        ("User Manager", test_user_manager),
        ("Intégration Discord", test_integration_with_discord)
    ]
    
    results = []
    for name, test_func in tests:
        logger.info(f"\n--- Test: {name} ---")
        success = await test_func()
        results.append((name, success))
        logger.info(f"{'✅' if success else '❌'} {name}: {'PASS' if success else 'FAIL'}")
    
    # Résumé
    logger.info("\n🎯 Résumé des tests Google Sheets:")
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for name, success in results:
        logger.info(f"  {'✅' if success else '❌'} {name}")
    
    logger.info(f"\n📊 Tests: {passed}/{total} réussis")
    
    if passed == total:
        logger.info("🎉 Intégration Google Sheets opérationnelle !")
    else:
        logger.warning("⚠️ Certains tests ont échoué. Vérifiez la configuration et les credentials.")


if __name__ == "__main__":
    asyncio.run(main())
