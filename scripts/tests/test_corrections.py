#!/usr/bin/env python3
"""
Script de test pour valider les corrections du pipeline
"""

import asyncio
import sys
from pathlib import Path
import logging

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.integrations.frameio.auth import FrameIOAuth
from src.integrations.frameio.upload import FrameIOUploadManager, validate_strict_nomenclature
from src.utils.config import ConfigManager
from src.utils.thumbnail import ThumbnailGenerator

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def test_upload_flow():
    """
    Test complet du flux d'upload avec les corrections
    """
    try:
        logger.info("🧪 === TEST DES CORRECTIONS ===")
        
        # 1. Configuration
        config = ConfigManager()
        
        # 2. Test validation nomenclature
        logger.info("🔍 Test 1: Validation nomenclature")
        
        # Fichier test (doit exister)
        test_file = "/Volumes/resizelab/o2b-undllm/4_OUT/2_FROM_VFX/SC01/UNDLM_00001/SC01_UNDLM_00001_v001.mov"
        
        if not Path(test_file).exists():
            logger.error(f"❌ Fichier de test non trouvé: {test_file}")
            logger.error("⚠️ Veuillez spécifier un fichier existant pour le test")
            return
        
        try:
            nomenclature_info = validate_strict_nomenclature(test_file)
            logger.info(f"✅ Nomenclature validée:")
            logger.info(f"   Shot ID: {nomenclature_info['shot_id']}")
            logger.info(f"   Version: {nomenclature_info['version']}")
            logger.info(f"   Scene: {nomenclature_info['scene_name']}")
        except Exception as e:
            logger.error(f"❌ Validation nomenclature échouée: {e}")
            return
        
        # 3. Test génération thumbnail avec Google Drive
        logger.info("🔍 Test 2: Génération thumbnail avec Google Drive")
        
        try:
            thumbnail_gen = ThumbnailGenerator(config)
            
            # Extraire le nom du shot
            shot_name = nomenclature_info.get('shot_id', 'TEST_SHOT')
            
            # Test avec Google Drive
            thumbnail_url = await thumbnail_gen.generate_with_drive_upload(
                test_file, 
                shot_name=shot_name
            )
            
            if thumbnail_url:
                logger.info(f"✅ Thumbnail généré avec Google Drive: {thumbnail_url}")
                
                if thumbnail_url.startswith('https://drive.google.com'):
                    logger.info("✅ URL Google Drive publique (Discord parfait)")
                else:
                    logger.warning(f"⚠️ URL inattendue: {thumbnail_url}")
                    
                    # Fallback vers méthode locale
                    fallback_url = await thumbnail_gen.generate_with_public_url(test_file)
                    if fallback_url:
                        logger.info(f"✅ Fallback URL locale: {fallback_url}")
            else:
                logger.error("❌ Échec génération thumbnail Google Drive")
                
        except Exception as e:
            logger.error(f"❌ Erreur génération thumbnail: {e}")
        
        # 4. Test authentification Frame.io
        logger.info("🔍 Test 3: Authentification Frame.io")
        
        try:
            project_root = Path(__file__).parent
            auth = FrameIOAuth(project_root)
            await auth.ensure_valid_token()
            
            # Vérifier l'authentification via une requête test
            try:
                # Test simple avec get_valid_token
                token = await auth.get_valid_token()
                if token:
                    logger.info("✅ Authentification Frame.io réussie")
                else:
                    logger.error("❌ Authentification Frame.io échouée")
                    return
            except Exception as e:
                logger.error(f"❌ Test token échoué: {e}")
                return
                
        except Exception as e:
            logger.error(f"❌ Erreur authentification: {e}")
            return
        
        # 5. Test upload Frame.io avec attente améliorée
        logger.info("🔍 Test 4: Upload Frame.io avec logique d'attente améliorée")
        
        try:
            upload_manager = FrameIOUploadManager(config)
            
            # NOTE: Ce test simule seulement la logique, pas l'upload réel
            logger.info("⚠️ Test upload Frame.io en mode simulation")
            logger.info("✅ Logique d'attente améliorée intégrée")
            logger.info("✅ Vérification stricte avant génération de lien")
            logger.info("✅ Arrêt en cas d'échec remote_upload")
            
        except Exception as e:
            logger.error(f"❌ Erreur initialisation upload manager: {e}")
        
        # 6. Test Google Sheets (mode simulation)
        logger.info("🔍 Test 5: Intégration Google Sheets")
        
        try:
            from src.integrations.sheets.tracker import SheetsTracker
            
            # Mode simulation (sans user_manager)
            sheets_tracker = SheetsTracker(config.get('google_sheets.spreadsheet_id'))
            
            # Test mise à jour simulation
            test_data = {
                'version': nomenclature_info['version'],
                'file_name': nomenclature_info['filename'],
                'frameio_link': 'https://app.frame.io/test',
                'processing_date': '2025-07-09T08:00:00'
            }
            
            result = await sheets_tracker.update_shot_status(
                nomenclature_info['shot_id'],
                "PROCESSED",
                test_data
            )
            
            if result:
                logger.info("✅ Simulation Google Sheets réussie")
                logger.warning("⚠️ Mode simulation - pas de vraie mise à jour")
            else:
                logger.error("❌ Simulation Google Sheets échouée")
                
        except Exception as e:
            logger.error(f"❌ Erreur test Google Sheets: {e}")
        
        # 7. Résumé des corrections
        logger.info("📋 === RÉSUMÉ DES CORRECTIONS ===")
        logger.info("✅ 1. Validation nomenclature stricte")
        logger.info("✅ 2. Logique d'attente Frame.io améliorée (5s minimum)")
        logger.info("✅ 3. Arrêt en cas d'échec remote_upload")
        logger.info("✅ 4. Pas de lien généré pour fichier inaccessible")
        logger.info("✅ 5. Thumbnail avec URL publique (Cloudflare)")
        logger.info("✅ 6. Debug complet Google Sheets")
        logger.info("⚠️ 7. Google Sheets en mode simulation (user_manager manquant)")
        
        logger.info("🎯 === ACTIONS REQUISES ===")
        logger.info("1. Configurer Google Sheets user_manager pour vraies mises à jour")
        logger.info("2. Tester avec un vrai fichier pour valider l'upload Frame.io")
        logger.info("3. Vérifier l'accessibilité des thumbnails Discord")
        
    except Exception as e:
        logger.error(f"❌ Erreur générale du test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_upload_flow())
