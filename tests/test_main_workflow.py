#!/usr/bin/env python3
"""
Test qui reproduit exactement le comportement de main.py pour identifier les problèmes
"""

import asyncio
import sys
from pathlib import Path
import logging

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def test_main_py_workflow(test_file_path):
    """
    Test qui reproduit exactement le workflow de main.py
    """
    try:
        logger.info("🧪 === TEST WORKFLOW MAIN.PY ===")
        logger.info(f"📁 Fichier de test: {test_file_path}")
        
        # Vérifier que le fichier existe
        if not Path(test_file_path).exists():
            logger.error(f"❌ Fichier de test non trouvé: {test_file_path}")
            return
        
        # 1. Reproduire l'initialisation de main.py
        logger.info("🔧 === PHASE 1: INITIALISATION ===")
        
        # Imports comme dans main.py
        from src.utils.config import ConfigManager
        from src.integrations.frameio.upload import FrameIOUploadManager
        from src.integrations.discord.notifier import DiscordNotifier
        from src.integrations.sheets.tracker import SheetsTracker
        from src.utils.thumbnail import ThumbnailGenerator
        from src.utils.upload_tracker import UploadTracker
        
        # Configuration comme dans main.py
        config_manager = ConfigManager("config/integrations.json")
        frameio_manager = FrameIOUploadManager(config_manager)
        discord_notifier = DiscordNotifier(config_manager)
        sheets_tracker = SheetsTracker(config_manager)  # Mode simulation possible
        thumbnail_generator = ThumbnailGenerator(config_manager)
        upload_tracker = UploadTracker("data/uploads_tracking.json")
        
        logger.info("✅ Composants initialisés comme dans main.py")
        
        # 2. Reproduire _extract_metadata_from_path
        logger.info("🔧 === PHASE 2: EXTRACTION MÉTADONNÉES ===")
        
        # Simuler _extract_metadata_from_path de main.py
        try:
            from src.integrations.frameio.upload import validate_strict_nomenclature
            nomenclature_data = validate_strict_nomenclature(str(test_file_path))
            
            metadata = nomenclature_data.copy()
            metadata['shot_name'] = nomenclature_data.get('shot_id', '')
            metadata['nomenclature'] = nomenclature_data.get('shot_id', '')
            
            logger.info(f"✅ Métadonnées extraites: {metadata.get('shot_id')} {metadata.get('version')}")
            
        except Exception as e:
            logger.error(f"❌ Erreur extraction métadonnées: {e}")
            return
        
        # 3. Tracking comme dans main.py
        logger.info("🔧 === PHASE 3: TRACKING ===")
        
        upload_id = None
        shot_id = metadata.get('shot_id', 'UNKNOWN')
        version = metadata.get('version', 'v001')
        
        # Détection de doublon
        duplicate = upload_tracker.is_duplicate(str(test_file_path), shot_id, version)
        
        if duplicate:
            logger.warning(f"⚠️ Doublon détecté: {duplicate.get('upload_id')}")
            if duplicate.get('status') == 'COMPLETED':
                logger.info("✅ Upload déjà terminé, arrêt du traitement")
                return
            else:
                upload_id = duplicate.get('upload_id')
        else:
            upload_id = upload_tracker.add_upload(
                str(test_file_path), shot_id, version,
                metadata={'scene_name': metadata.get('scene_name', '')}
            )
            logger.info(f"📝 Nouvel upload créé: {upload_id}")
        
        # 4. Thumbnail comme dans main.py
        logger.info("🔧 === PHASE 4: THUMBNAIL ===")
        
        thumbnail_url = None
        try:
            thumbnail_url = await thumbnail_generator.generate_with_drive_upload(
                str(test_file_path), 
                shot_name=metadata.get('shot_id')
            )
            
            if thumbnail_url:
                logger.info(f"✅ Thumbnail généré: {thumbnail_url}")
                upload_tracker.update_upload(upload_id, {
                    'thumbnail_data.generated': True,
                    'thumbnail_data.drive_url': thumbnail_url,
                    'status': 'THUMBNAIL_GENERATED'
                })
            else:
                logger.warning("⚠️ Échec génération thumbnail")
                
        except Exception as e:
            logger.error(f"❌ Erreur thumbnail: {e}")
        
        # 5. Frame.io comme dans main.py
        logger.info("🔧 === PHASE 5: FRAME.IO ===")
        
        frameio_link = None
        try:
            # Utiliser la même méthode que main.py
            frameio_link = await frameio_manager.upload_file_production(
                str(test_file_path),
                shot_name=metadata.get('shot_name'),
                scene_name=metadata.get('scene_name'),
                thumbnail_path=None  # On utilise l'URL Google Drive
            )
            
            if frameio_link:
                logger.info(f"✅ Upload Frame.io réussi: {frameio_link}")
                upload_tracker.update_upload(upload_id, {
                    'frameio_data.upload_status': 'COMPLETED',
                    'frameio_data.review_link': frameio_link,
                    'status': 'FRAMEIO_UPLOADED'
                })
            else:
                logger.error("❌ Upload Frame.io échoué")
                upload_tracker.update_upload(upload_id, {
                    'frameio_data.upload_status': 'FAILED',
                    'status': 'FRAMEIO_FAILED'
                })
                
        except Exception as e:
            logger.error(f"❌ Erreur Frame.io: {e}")
            upload_tracker.update_upload(upload_id, {
                'frameio_data.upload_status': 'ERROR',
                'status': 'FRAMEIO_ERROR'
            })
        
        # 6. Google Sheets comme dans main.py
        logger.info("🔧 === PHASE 6: GOOGLE SHEETS ===")
        
        try:
            # Simuler _update_sheets_with_processing_info
            if hasattr(sheets_tracker, 'update_shot_status'):
                result = await sheets_tracker.update_shot_status(
                    metadata.get('nomenclature', ''),
                    "PROCESSED",
                    {
                        'version': metadata.get('version', ''),
                        'file_name': metadata.get('filename', ''),
                        'frameio_link': frameio_link or '',
                        'thumbnail_url': thumbnail_url or '',
                        'processing_date': '2025-07-09T11:00:00'
                    }
                )
                
                if result:
                    logger.info("✅ Google Sheets mis à jour")
                    upload_tracker.update_upload(upload_id, {
                        'google_sheets_data.updated': True,
                        'status': 'SHEETS_UPDATED'
                    })
                else:
                    logger.warning("⚠️ Google Sheets échec")
                    
        except Exception as e:
            logger.error(f"❌ Erreur Google Sheets: {e}")
        
        # 7. Discord comme dans main.py
        logger.info("🔧 === PHASE 7: DISCORD ===")
        
        try:
            success = discord_notifier.notify_file_processed(
                Path(test_file_path).name,
                f"Fichier traité avec succès via main.py workflow",
                frameio_link or "Pas d'upload Frame.io",
                thumbnail_url=thumbnail_url
            )
            
            if success:
                logger.info("✅ Notification Discord envoyée")
                upload_tracker.update_upload(upload_id, {
                    'discord_data.message_sent': True,
                    'status': 'COMPLETED'
                })
            else:
                logger.warning("⚠️ Notification Discord échouée")
                
        except Exception as e:
            logger.error(f"❌ Erreur Discord: {e}")
        
        # 8. Résumé final
        logger.info("📊 === RÉSUMÉ FINAL ===")
        
        upload_data = upload_tracker.get_upload(upload_id)
        if upload_data:
            logger.info(f"📊 Upload ID: {upload_id}")
            logger.info(f"📊 Status: {upload_data.get('status')}")
            logger.info(f"📊 Frame.io: {upload_data.get('frameio_data', {}).get('upload_status')}")
            logger.info(f"📊 Sheets: {upload_data.get('google_sheets_data', {}).get('updated')}")
            logger.info(f"📊 Discord: {upload_data.get('discord_data', {}).get('message_sent')}")
        
        logger.info("🎯 === TEST TERMINÉ ===")
        
        # Diagnostics
        logger.info("🔍 === DIAGNOSTICS ===")
        if frameio_link:
            logger.info("✅ Frame.io intégration: SUCCÈS")
        else:
            logger.error("❌ Frame.io intégration: ÉCHEC")
            
        if thumbnail_url:
            logger.info("✅ Thumbnail intégration: SUCCÈS")
        else:
            logger.warning("⚠️ Thumbnail intégration: ÉCHEC")
        
    except Exception as e:
        logger.error(f"❌ Erreur générale: {e}")
        import traceback
        traceback.print_exc()

def main():
    """
    Point d'entrée principal
    """
    if len(sys.argv) < 2:
        print("Usage: python test_main_workflow.py <chemin_vers_fichier>")
        sys.exit(1)
    
    test_file_path = sys.argv[1]
    asyncio.run(test_main_py_workflow(test_file_path))

if __name__ == "__main__":
    main()
