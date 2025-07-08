"""
Test spécifique pour la configuration Google Sheets avec les deux worksheets
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
    
    return config.get('google_sheets', {})


def test_google_sheets_connection():
    """Test de connexion Google Sheets."""
    logger.info("📊 Test connexion Google Sheets...")
    
    try:
        # Charger la configuration
        sheets_config_data = load_config()
        logger.info(f"Configuration chargée: {sheets_config_data.keys()}")
        
        # Créer la configuration
        config = GoogleSheetsConfig(
            credentials_file=sheets_config_data.get('service_account_file'),
            spreadsheet_id=sheets_config_data.get('spreadsheet_id'),
            worksheet_shots_tracks=sheets_config_data.get('worksheet_shots_tracks', 'SHOTS_TRACK'),
            worksheet_users=sheets_config_data.get('worksheet_users', 'USERS_INFOS')
        )
        
        logger.info(f"Config créée - Spreadsheet: {config.spreadsheet_id}")
        logger.info(f"Worksheets - Shots: {config.worksheet_shots_tracks}, Users: {config.worksheet_users}")
        
        # Test connexion
        auth = GoogleSheetsAuth(config)
        
        if auth.connect():
            logger.info("✅ Connexion Google Sheets réussie")
            return auth, config
        else:
            logger.error("❌ Connexion Google Sheets échouée")
            return None, None
            
    except Exception as e:
        logger.error(f"❌ Erreur test connexion: {e}")
        return None, None


def test_worksheets_access(auth: GoogleSheetsAuth, config: GoogleSheetsConfig):
    """Test d'accès aux worksheets."""
    logger.info("📋 Test accès aux worksheets...")
    
    try:
        results = {}
        
        # Test worksheet SHOTS_TRACK
        logger.info(f"Test accès à '{config.worksheet_shots_tracks}'...")
        shots_worksheet = auth.get_worksheet(config.worksheet_shots_tracks)
        if shots_worksheet:
            logger.info(f"✅ Worksheet '{config.worksheet_shots_tracks}' trouvée")
            # Compter les lignes
            try:
                all_values = shots_worksheet.get_all_values()
                rows_count = len(all_values)
                logger.info(f"   📊 {rows_count} lignes dans '{config.worksheet_shots_tracks}'")
                results['shots_worksheet'] = True
                results['shots_rows'] = rows_count
            except Exception as e:
                logger.warning(f"   ⚠️ Erreur lecture données: {e}")
                results['shots_worksheet'] = True
                results['shots_rows'] = 0
        else:
            logger.warning(f"⚠️ Worksheet '{config.worksheet_shots_tracks}' non trouvée")
            results['shots_worksheet'] = False
        
        # Test worksheet USERS_INFOS
        logger.info(f"Test accès à '{config.worksheet_users}'...")
        users_worksheet = auth.get_worksheet(config.worksheet_users)
        if users_worksheet:
            logger.info(f"✅ Worksheet '{config.worksheet_users}' trouvée")
            # Compter les lignes
            try:
                all_values = users_worksheet.get_all_values()
                rows_count = len(all_values)
                logger.info(f"   👥 {rows_count} lignes dans '{config.worksheet_users}'")
                results['users_worksheet'] = True
                results['users_rows'] = rows_count
            except Exception as e:
                logger.warning(f"   ⚠️ Erreur lecture données: {e}")
                results['users_worksheet'] = True
                results['users_rows'] = 0
        else:
            logger.warning(f"⚠️ Worksheet '{config.worksheet_users}' non trouvée")
            results['users_worksheet'] = False
        
        return results
        
    except Exception as e:
        logger.error(f"❌ Erreur test worksheets: {e}")
        return {}


def test_status_tracker(auth: GoogleSheetsAuth, config: GoogleSheetsConfig):
    """Test du SheetsStatusTracker."""
    logger.info("📊 Test SheetsStatusTracker...")
    
    try:
        # Créer le tracker
        tracker = SheetsStatusTracker(auth, config.worksheet_shots_tracks)
        
        # Test récupération des plans
        logger.info("Récupération des plans...")
        shots = tracker.get_all_shots()
        
        logger.info(f"✅ {len(shots)} plans récupérés")
        
        # Afficher quelques exemples
        for i, shot in enumerate(shots[:3]):
            logger.info(f"   Plan {i+1}: {shot.get('nomenclature', 'N/A')} - {shot.get('status', 'N/A')}")
        
        return len(shots)
        
    except Exception as e:
        logger.error(f"❌ Erreur test status tracker: {e}")
        return 0


def test_user_manager(auth: GoogleSheetsAuth, config: GoogleSheetsConfig):
    """Test du SheetsUserManager."""
    logger.info("👥 Test SheetsUserManager...")
    
    try:
        # Initialiser le user manager
        user_manager = init_sheets_user_manager(auth)
        
        # Test récupération des utilisateurs
        logger.info("Récupération des utilisateurs...")
        users = user_manager.get_all_users()
        
        logger.info(f"✅ {len(users)} utilisateurs récupérés")
        
        # Afficher les utilisateurs
        for user in users:
            discord_info = f" (Discord: {user.discord_id})" if user.discord_id else ""
            logger.info(f"   👤 {user.name} - {user.role}{discord_info}")
        
        # Test fonction get_assigned_user
        logger.info("Test get_assigned_user...")
        assigned_user = get_assigned_user("UNDLM_00412")
        
        if assigned_user:
            logger.info(f"✅ Utilisateur assigné: {assigned_user}")
        else:
            logger.warning("⚠️ Aucun utilisateur assigné trouvé")
        
        return len(users)
        
    except Exception as e:
        logger.error(f"❌ Erreur test user manager: {e}")
        return 0


def test_integration_complete():
    """Test d'intégration complète."""
    logger.info("🔄 Test intégration complète...")
    
    try:
        # Test connexion
        auth, config = test_google_sheets_connection()
        if not auth:
            logger.error("❌ Impossible de se connecter à Google Sheets")
            return False
        
        # Test worksheets
        worksheets_results = test_worksheets_access(auth, config)
        
        # Test status tracker si SHOTS_TRACK disponible
        shots_count = 0
        if worksheets_results.get('shots_worksheet'):
            shots_count = test_status_tracker(auth, config)
        
        # Test user manager si USERS_INFOS disponible
        users_count = 0
        if worksheets_results.get('users_worksheet'):
            users_count = test_user_manager(auth, config)
        
        # Résumé
        logger.info("\n🎯 Résumé de l'intégration Google Sheets:")
        logger.info(f"  📊 Worksheet '{config.worksheet_shots_tracks}': {'✅' if worksheets_results.get('shots_worksheet') else '❌'}")
        logger.info(f"  👥 Worksheet '{config.worksheet_users}': {'✅' if worksheets_results.get('users_worksheet') else '❌'}")
        logger.info(f"  📋 Plans récupérés: {shots_count}")
        logger.info(f"  👤 Utilisateurs récupérés: {users_count}")
        
        success = (
            worksheets_results.get('shots_worksheet', False) and 
            worksheets_results.get('users_worksheet', False)
        )
        
        if success:
            logger.info("✅ Intégration Google Sheets complètement fonctionnelle!")
        else:
            logger.warning("⚠️ Intégration Google Sheets partiellement fonctionnelle")
        
        return success
        
    except Exception as e:
        logger.error(f"❌ Erreur intégration complète: {e}")
        return False


async def main():
    """Test principal."""
    logger.info("🧪 Test configuration Google Sheets PostFlow v0.1.4b")
    logger.info("Worksheets: SHOTS_TRACK & USERS_INFOS")
    
    success = test_integration_complete()
    
    if success:
        logger.info("\n🎉 Configuration Google Sheets validée!")
        logger.info("🔗 Prêt pour l'intégration complète avec Frame.io et Discord")
    else:
        logger.info("\n⚠️ Configuration Google Sheets à ajuster")
        logger.info("💡 Vérifiez que les worksheets existent et contiennent des données")


if __name__ == "__main__":
    asyncio.run(main())
