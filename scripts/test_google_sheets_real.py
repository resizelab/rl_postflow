"""
Test Google Sheets avec la vraie configuration depuis integrations.json
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


def load_config():
    """Charger la configuration depuis integrations.json."""
    config_path = Path("config/integrations.json")
    if not config_path.exists():
        raise FileNotFoundError("config/integrations.json non trouvé")
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    return config


async def test_google_sheets_connection():
    """Test de connexion Google Sheets avec la vraie config."""
    logger.info("📊 Test connexion Google Sheets avec configuration réelle")
    
    try:
        # Charger la config
        config = load_config()
        sheets_config = config.get('google_sheets', {})
        
        logger.info(f"Configuration chargée:")
        logger.info(f"  - service_account_file: {sheets_config.get('service_account_file')}")
        logger.info(f"  - spreadsheet_id: {sheets_config.get('spreadsheet_id')}")
        logger.info(f"  - worksheet_shots_tracks: {sheets_config.get('worksheet_shots_tracks')}")
        logger.info(f"  - worksheet_users: {sheets_config.get('worksheet_users')}")
        
        # Créer la config avec les vraies valeurs
        google_config = GoogleSheetsConfig(
            credentials_file=sheets_config.get('service_account_file'),
            spreadsheet_id=sheets_config.get('spreadsheet_id'),
            worksheet_name=sheets_config.get('worksheet_shots_tracks', 'SHOTS_TRACK')
        )
        
        # Ajouter les champs personnalisés
        google_config.worksheet_users = sheets_config.get('worksheet_users', 'USERS_INFOS')
        google_config.worksheet_shots_tracks = sheets_config.get('worksheet_shots_tracks', 'SHOTS_TRACK')
        
        logger.info(f"GoogleSheetsConfig créé avec spreadsheet_id: {google_config.spreadsheet_id}")
        
        # Test connexion
        auth = GoogleSheetsAuth(google_config)
        
        if auth.connect():
            logger.info("✅ Connexion Google Sheets réussie!")
            
            # Test worksheets
            shots_worksheet = auth.get_worksheet(google_config.worksheet_shots_tracks)
            if shots_worksheet:
                logger.info(f"✅ Worksheet '{google_config.worksheet_shots_tracks}' trouvée")
                logger.info(f"   - Titre: {shots_worksheet.title}")
                logger.info(f"   - Lignes: {shots_worksheet.row_count}")
                logger.info(f"   - Colonnes: {shots_worksheet.col_count}")
            else:
                logger.warning(f"⚠️ Worksheet '{google_config.worksheet_shots_tracks}' non trouvée")
            
            users_worksheet = auth.get_worksheet(google_config.worksheet_users)
            if users_worksheet:
                logger.info(f"✅ Worksheet '{google_config.worksheet_users}' trouvée")
                logger.info(f"   - Titre: {users_worksheet.title}")
                logger.info(f"   - Lignes: {users_worksheet.row_count}")
                logger.info(f"   - Colonnes: {users_worksheet.col_count}")
            else:
                logger.warning(f"⚠️ Worksheet '{google_config.worksheet_users}' non trouvée")
                
                # Créer la worksheet Users si elle n'existe pas
                logger.info(f"🔧 Création de la worksheet '{google_config.worksheet_users}'...")
                users_worksheet = auth.create_worksheet(google_config.worksheet_users, rows=100, cols=10)
                
                if users_worksheet:
                    # Ajouter les headers
                    headers = [
                        "Name", "Discord ID", "Email", "Role", 
                        "Department", "Active", "Shot Assignment", "Notes"
                    ]
                    users_worksheet.update('A1:H1', [headers])
                    
                    # Format headers
                    users_worksheet.format('A1:H1', {
                        "backgroundColor": {"red": 0.2, "green": 0.6, "blue": 0.9},
                        "textFormat": {"bold": True, "foregroundColor": {"red": 1, "green": 1, "blue": 1}}
                    })
                    
                    logger.info(f"✅ Worksheet '{google_config.worksheet_users}' créée avec headers")
            
            return True
            
        else:
            logger.error("❌ Connexion Google Sheets échouée")
            return False
            
    except Exception as e:
        logger.error(f"❌ Erreur test Google Sheets: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_sheets_status_tracker():
    """Test du tracker de statuts."""
    logger.info("📋 Test SheetsStatusTracker")
    
    try:
        # Charger la config
        config = load_config()
        sheets_config = config.get('google_sheets', {})
        
        # Créer la config
        google_config = GoogleSheetsConfig(
            credentials_file=sheets_config.get('service_account_file'),
            spreadsheet_id=sheets_config.get('spreadsheet_id'),
            worksheet_name=sheets_config.get('worksheet_shots_tracks', 'SHOTS_TRACK')
        )
        
        # Connexion
        auth = GoogleSheetsAuth(google_config)
        if not auth.connect():
            logger.error("Impossible de se connecter pour le test status tracker")
            return False
        
        # Créer le tracker
        status_tracker = SheetsStatusTracker(auth, google_config.worksheet_name)
        
        # Test récupération des plans
        logger.info("📋 Récupération des plans...")
        shots = status_tracker.get_all_shots()
        
        logger.info(f"✅ {len(shots)} plans trouvés")
        for shot in shots[:3]:  # Afficher les 3 premiers
            logger.info(f"   - {shot.get('nomenclature', 'N/A')}: {shot.get('status', 'N/A')}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur test status tracker: {e}")
        return False


async def test_users_manager():
    """Test du gestionnaire d'utilisateurs."""
    logger.info("👤 Test SheetsUserManager")
    
    try:
        # Charger la config
        config = load_config()
        sheets_config = config.get('google_sheets', {})
        
        # Créer la config
        google_config = GoogleSheetsConfig(
            credentials_file=sheets_config.get('service_account_file'),
            spreadsheet_id=sheets_config.get('spreadsheet_id'),
            worksheet_name=sheets_config.get('worksheet_shots_tracks', 'SHOTS_TRACK')
        )
        google_config.worksheet_users = sheets_config.get('worksheet_users', 'USERS_INFOS')
        
        # Connexion
        auth = GoogleSheetsAuth(google_config)
        if not auth.connect():
            logger.error("Impossible de se connecter pour le test users manager")
            return False
        
        # Initialiser le user manager
        user_manager = init_sheets_user_manager(auth)
        
        # Test récupération utilisateurs
        logger.info("👤 Récupération des utilisateurs...")
        users = user_manager.get_all_users()
        
        logger.info(f"✅ {len(users)} utilisateurs trouvés")
        for user in users:
            logger.info(f"   - {user.name}: {user.email} (Discord: {user.discord_id})")
        
        # Test fonction get_assigned_user
        logger.info("🎯 Test get_assigned_user...")
        assigned_user = get_assigned_user("UNDLM_00412")
        
        if assigned_user:
            logger.info(f"✅ Utilisateur assigné: {assigned_user}")
        else:
            logger.info("ℹ️ Aucun utilisateur assigné trouvé (normal si pas de données)")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur test users manager: {e}")
        return False


async def main():
    """Test principal Google Sheets."""
    logger.info("🚀 Test Google Sheets PostFlow v0.1.4b")
    
    tests = [
        ("Connexion Google Sheets", test_google_sheets_connection),
        ("Status Tracker", test_sheets_status_tracker),
        ("Users Manager", test_users_manager)
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
        logger.info("🎉 Google Sheets est bien configuré et fonctionnel !")
    else:
        logger.warning("⚠️ Certains tests ont échoué. Vérifiez la configuration.")


if __name__ == "__main__":
    asyncio.run(main())
