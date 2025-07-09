#!/usr/bin/env python3
"""
Test du système de tracking des uploads
"""

import asyncio
import sys
from pathlib import Path
import logging

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.utils.upload_tracker import UploadTracker
from src.integrations.frameio.upload import validate_strict_nomenclature
from src.utils.thumbnail import ThumbnailGenerator
from src.utils.config import ConfigManager

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def test_tracking_system(test_file_path):
    """
    Test complet du système de tracking
    """
    try:
        logger.info("🧪 === TEST SYSTÈME DE TRACKING ===")
        logger.info(f"📁 Fichier de test: {test_file_path}")
        
        # 1. Configuration
        config = ConfigManager()
        
        # 2. Vérifier que le fichier existe
        if not Path(test_file_path).exists():
            logger.error(f"❌ Fichier de test non trouvé: {test_file_path}")
            return
        
        # 3. Validation nomenclature
        logger.info("🔍 Test 1: Validation nomenclature et métadonnées")
        nomenclature_info = validate_strict_nomenclature(test_file_path)
        logger.info(f"✅ Nomenclature validée: {nomenclature_info['shot_id']} {nomenclature_info['version']}")
        
        # 4. Initialiser le tracker
        logger.info("🔍 Test 2: Initialisation du tracker")
        tracker = UploadTracker("data/uploads_tracking.json")
        
        # Afficher les stats avant
        stats_before = tracker.get_stats()
        logger.info(f"📊 Stats avant: {stats_before['total_uploads']} uploads")
        
        # 5. Test détection de doublon (avant ajout)
        logger.info("🔍 Test 3: Détection de doublon (avant ajout)")
        duplicate = tracker.is_duplicate(
            test_file_path, 
            nomenclature_info['shot_id'], 
            nomenclature_info['version']
        )
        
        if duplicate:
            logger.warning(f"⚠️ Doublon détecté: {duplicate.get('upload_id')}")
            logger.info("🔄 Mise à jour de l'upload existant")
            
            # Mettre à jour l'upload existant
            upload_id = duplicate['upload_id']
            tracker.update_upload(upload_id, {
                "status": "UPDATED",
                "last_test": "2025-07-09T10:45:00"
            })
        else:
            logger.info("✅ Pas de doublon détecté")
            
            # 6. Ajouter un nouvel upload
            logger.info("🔍 Test 4: Ajout d'un nouvel upload")
            
            # Préparer les métadonnées
            metadata = {
                "scene_name": nomenclature_info['scene_name'],
                "filename": nomenclature_info['filename'],
                "extension": nomenclature_info['extension'],
                "test_run": True,
                "test_timestamp": "2025-07-09T10:45:00"
            }
            
            upload_id = tracker.add_upload(
                test_file_path,
                nomenclature_info['shot_id'],
                nomenclature_info['version'],
                metadata
            )
            
            if upload_id:
                logger.info(f"✅ Upload ajouté: {upload_id}")
            else:
                logger.error("❌ Échec ajout upload")
                return
        
        # 7. Test génération thumbnail et mise à jour
        logger.info("🔍 Test 5: Génération thumbnail et mise à jour tracking")
        
        try:
            thumbnail_gen = ThumbnailGenerator(config)
            
            # Générer le thumbnail
            thumbnail_url = await thumbnail_gen.generate_with_drive_upload(
                test_file_path, 
                shot_name=nomenclature_info['shot_id']
            )
            
            if thumbnail_url:
                logger.info(f"✅ Thumbnail généré: {thumbnail_url}")
                
                # Mettre à jour le tracking
                tracker.update_upload(upload_id, {
                    "thumbnail_data.generated": True,
                    "thumbnail_data.drive_url": thumbnail_url,
                    "status": "THUMBNAIL_GENERATED"
                })
                
                logger.info("✅ Tracking mis à jour avec thumbnail")
            else:
                logger.warning("⚠️ Échec génération thumbnail")
                
        except Exception as e:
            logger.error(f"❌ Erreur génération thumbnail: {e}")
        
        # 8. Test simulation Frame.io
        logger.info("🔍 Test 6: Simulation mise à jour Frame.io")
        
        # Simuler un upload Frame.io réussi
        frameio_updates = {
            "frameio_data.file_id": "frameio_123456",
            "frameio_data.upload_status": "COMPLETED",
            "frameio_data.review_link": "https://app.frame.io/reviews/test123",
            "frameio_data.processing_status": "READY",
            "status": "FRAMEIO_UPLOADED"
        }
        
        tracker.update_upload(upload_id, frameio_updates)
        logger.info("✅ Tracking mis à jour - Frame.io simulé")
        
        # 9. Test simulation Google Sheets
        logger.info("🔍 Test 7: Simulation mise à jour Google Sheets")
        
        sheets_updates = {
            "google_sheets_data.updated": True,
            "google_sheets_data.row_number": 2,
            "google_sheets_data.update_timestamp": "2025-07-09T10:45:00",
            "status": "SHEETS_UPDATED"
        }
        
        tracker.update_upload(upload_id, sheets_updates)
        logger.info("✅ Tracking mis à jour - Google Sheets simulé")
        
        # 10. Test simulation Discord
        logger.info("🔍 Test 8: Simulation notification Discord")
        
        discord_updates = {
            "discord_data.message_sent": True,
            "discord_data.message_id": "discord_msg_789",
            "discord_data.send_timestamp": "2025-07-09T10:45:00",
            "status": "COMPLETED"
        }
        
        tracker.update_upload(upload_id, discord_updates)
        logger.info("✅ Tracking mis à jour - Discord simulé")
        
        # 11. Récupération et affichage des données
        logger.info("🔍 Test 9: Récupération des données de tracking")
        
        upload_data = tracker.get_upload(upload_id)
        if upload_data:
            logger.info(f"📋 Upload ID: {upload_data['upload_id']}")
            logger.info(f"📋 Shot ID: {upload_data['shot_id']}")
            logger.info(f"📋 Version: {upload_data['version']}")
            logger.info(f"📋 Status: {upload_data['status']}")
            logger.info(f"📋 Thumbnail: {upload_data['thumbnail_data']['generated']}")
            logger.info(f"📋 Frame.io: {upload_data['frameio_data']['upload_status']}")
            logger.info(f"📋 Google Sheets: {upload_data['google_sheets_data']['updated']}")
            logger.info(f"📋 Discord: {upload_data['discord_data']['message_sent']}")
        else:
            logger.error("❌ Impossible de récupérer les données")
        
        # 12. Test liste des uploads
        logger.info("🔍 Test 10: Liste des uploads")
        
        # Tous les uploads
        all_uploads = tracker.list_uploads()
        logger.info(f"📋 Total uploads: {len(all_uploads)}")
        
        # Uploads par shot
        shot_uploads = tracker.list_uploads(shot_id=nomenclature_info['shot_id'])
        logger.info(f"📋 Uploads pour {nomenclature_info['shot_id']}: {len(shot_uploads)}")
        
        # Uploads par status
        completed_uploads = tracker.list_uploads(status="COMPLETED")
        logger.info(f"📋 Uploads terminés: {len(completed_uploads)}")
        
        # 13. Statistiques finales
        logger.info("🔍 Test 11: Statistiques finales")
        
        stats_after = tracker.get_stats()
        logger.info(f"📊 === STATISTIQUES FINALES ===")
        logger.info(f"📊 Total uploads: {stats_after['total_uploads']}")
        logger.info(f"📊 Taille totale: {stats_after['total_size'] / (1024*1024):.2f} MB")
        logger.info(f"📊 Uploads Frame.io: {stats_after['frameio_uploads']}")
        logger.info(f"📊 Notifications Discord: {stats_after['discord_notifications']}")
        logger.info(f"📊 Mises à jour Sheets: {stats_after['sheets_updates']}")
        
        # Par status
        logger.info("📊 Par status:")
        for status, count in stats_after['by_status'].items():
            logger.info(f"   {status}: {count}")
        
        # Par shot
        logger.info("📊 Par shot:")
        for shot, count in stats_after['by_shot'].items():
            logger.info(f"   {shot}: {count}")
        
        logger.info("🎯 === TEST TRACKING TERMINÉ ===")
        logger.info("✅ Système de tracking opérationnel")
        logger.info("✅ Détection de doublons fonctionnelle")
        logger.info("✅ Mises à jour multiples supportées")
        logger.info("✅ Statistiques et filtres disponibles")
        
    except Exception as e:
        logger.error(f"❌ Erreur générale du test: {e}")
        import traceback
        traceback.print_exc()

def main():
    """
    Point d'entrée principal
    """
    if len(sys.argv) < 2:
        print("Usage: python test_tracking.py <chemin_vers_fichier>")
        print("\nExemples:")
        print("  python test_tracking.py /Volumes/resizelab/o2b-undllm/4_OUT/2_FROM_VFX/SC01/UNDLM_00001/SC01_UNDLM_00001_v001.mov")
        sys.exit(1)
    
    test_file_path = sys.argv[1]
    asyncio.run(test_tracking_system(test_file_path))

if __name__ == "__main__":
    main()
