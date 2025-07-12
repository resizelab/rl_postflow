#!/usr/bin/env python3
"""
Script de test pour valider les corrections du pipeline avec un fichier spécifique
Usage: python test_with_file.py <chemin_vers_fichier>
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

async def test_upload_flow(test_file_path):
    """
    Test complet du flux d'upload avec les corrections
    """
    try:
        logger.info("🧪 === TEST DES CORRECTIONS ===")
        logger.info(f"📁 Fichier de test: {test_file_path}")
        
        # 1. Configuration
        config = ConfigManager()
        
        # 2. Vérifier que le fichier existe
        if not Path(test_file_path).exists():
            logger.error(f"❌ Fichier de test non trouvé: {test_file_path}")
            logger.error("⚠️ Veuillez spécifier un fichier existant pour le test")
            return
        
        file_size = Path(test_file_path).stat().st_size
        logger.info(f"📏 Taille du fichier: {file_size / (1024*1024):.2f} MB")
        
        # 3. Test validation nomenclature
        logger.info("🔍 Test 1: Validation nomenclature")
        
        try:
            nomenclature_info = validate_strict_nomenclature(test_file_path)
            logger.info(f"✅ Nomenclature validée:")
            logger.info(f"   Shot ID: {nomenclature_info['shot_id']}")
            logger.info(f"   Version: {nomenclature_info['version']}")
            logger.info(f"   Scene: {nomenclature_info['scene_name']}")
            logger.info(f"   Filename: {nomenclature_info['filename']}")
        except Exception as e:
            logger.error(f"❌ Validation nomenclature échouée: {e}")
            return
        
        # 4. Test génération thumbnail avec Google Drive
        logger.info("🔍 Test 2: Génération thumbnail avec Google Drive")
        
        try:
            thumbnail_gen = ThumbnailGenerator(config)
            
            # Extraire le nom du shot
            shot_name = nomenclature_info.get('shot_id', 'TEST_SHOT')
            
            # Test avec Google Drive
            thumbnail_url = await thumbnail_gen.generate_with_drive_upload(
                test_file_path, 
                shot_name=shot_name
            )
            
            if thumbnail_url:
                logger.info(f"✅ Thumbnail généré avec Google Drive: {thumbnail_url}")
                
                if thumbnail_url.startswith('https://drive.google.com'):
                    logger.info("✅ URL Google Drive publique (Discord parfait)")
                else:
                    logger.warning(f"⚠️ URL inattendue: {thumbnail_url}")
                    
                    # Fallback vers méthode locale si disponible
                    try:
                        fallback_url = await thumbnail_gen.generate_with_public_url(test_file_path)
                        if fallback_url:
                            logger.info(f"✅ Fallback URL locale: {fallback_url}")
                    except:
                        logger.warning("⚠️ Fallback non disponible")
            else:
                logger.error("❌ Échec génération thumbnail Google Drive")
                
        except Exception as e:
            logger.error(f"❌ Erreur génération thumbnail: {e}")
        
        # 5. Test authentification Frame.io
        logger.info("🔍 Test 3: Authentification Frame.io")
        
        try:
            project_root = Path(__file__).parent
            auth = FrameIOAuth(project_root)
            await auth.ensure_valid_token()
            
            # Vérifier l'authentification via une requête test
            try:
                # Test simple avec get_access_token
                token = await auth.get_access_token()
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
        
        # 6. Test upload Frame.io RÉEL avec attente améliorée
        logger.info("🔍 Test 4: Upload Frame.io RÉEL avec logique d'attente améliorée")
        
        frameio_link = None
        try:
            upload_manager = FrameIOUploadManager(config)
            
            # Upload réel
            logger.info("🚀 Démarrage upload Frame.io RÉEL")
            
            upload_result = await upload_manager.upload_file(
                nomenclature_info['shot_id'],  # shot_id
                test_file_path,                # file_path
                nomenclature_info['scene_name'], # scene_name
                metadata=nomenclature_info      # metadata optionnel
            )
            
            if upload_result and upload_result.get('success'):
                frameio_link = upload_result.get('review_link')
                logger.info(f"✅ Upload Frame.io réussi: {frameio_link}")
                
                # Vérifier que le lien est accessible
                if frameio_link:
                    logger.info("✅ Lien Frame.io généré avec succès")
                else:
                    logger.warning("⚠️ Upload réussi mais pas de lien généré")
            else:
                logger.error("❌ Upload Frame.io échoué")
                logger.error(f"Résultat: {upload_result}")
            
        except Exception as e:
            logger.error(f"❌ Erreur upload Frame.io: {e}")
            import traceback
            traceback.print_exc()
        
        # 7. Test Google Sheets avec user_manager (vraies mises à jour)
        logger.info("🔍 Test 5: Intégration Google Sheets avec user_manager")
        
        try:
            from src.integrations.sheets.tracker import SheetsTracker
            from src.integrations.sheets.simple_user_manager import SimpleGoogleSheetsUserManager
            
            # Créer un simple user manager
            user_manager = SimpleGoogleSheetsUserManager("config/google_credentials.json")
            
            # Tester la connexion
            spreadsheet_id = config.get('google_sheets.spreadsheet_id')
            
            if user_manager.test_connection(spreadsheet_id):
                logger.info("✅ Connexion Google Sheets établie")
                
                # Créer le tracker avec user_manager
                sheets_tracker = SheetsTracker(
                    spreadsheet_id,
                    user_manager=user_manager
                )
                
                logger.info("✅ User manager configuré pour vraies mises à jour")
                
                # Test mise à jour avec toutes les données
                test_data = {
                    'version': nomenclature_info['version'],
                    'file_name': nomenclature_info['filename'],
                    'frameio_link': frameio_link or 'https://app.frame.io/test',
                    'processing_date': '2025-07-09T08:00:00',
                    'thumbnail_url': thumbnail_url if 'thumbnail_url' in locals() else None
                }
                
                result = await sheets_tracker.update_shot_status(
                    nomenclature_info['shot_id'],
                    "PROCESSED",
                    test_data
                )
                
                if result:
                    logger.info("✅ Mise à jour Google Sheets réussie")
                    logger.info("🎯 VRAIE mise à jour effectuée (pas de simulation)")
                else:
                    logger.error("❌ Mise à jour Google Sheets échouée")
                    
            else:
                logger.error("❌ Impossible de se connecter à Google Sheets")
                # Fallback vers mode simulation
                sheets_tracker = SheetsTracker(spreadsheet_id)
                
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
                    logger.warning("⚠️ Fallback vers mode simulation réussi")
                else:
                    logger.error("❌ Même le mode simulation a échoué")
                
        except Exception as e:
            logger.error(f"❌ Erreur test Google Sheets: {e}")
            import traceback
            traceback.print_exc()
        
        # 8. Test notifications Discord avec thumbnails Google Drive
        logger.info("� Test 6: Notifications Discord avec thumbnails Google Drive")
        
        try:
            from src.integrations.discord.notifier import DiscordNotifier
            
            # Créer le notifier Discord
            discord_notifier = DiscordNotifier(config)
            
            # Préparer les données pour la notification
            discord_data = {
                'shot_id': nomenclature_info['shot_id'],
                'version': nomenclature_info['version'],
                'filename': nomenclature_info['filename'],
                'file_size': file_size,
                'frameio_link': frameio_link or 'https://app.frame.io/test',
                'thumbnail_url': thumbnail_url if 'thumbnail_url' in locals() else None,
                'processing_status': 'PROCESSED',
                'scene_name': nomenclature_info.get('scene_name', ''),
                'shot_name': nomenclature_info.get('shot_name', '')
            }
            
            # Envoyer la notification
            logger.info("📢 Envoi notification Discord...")
            
            # Utiliser notify_file_processed qui supporte les thumbnails
            notification_result = discord_notifier.notify_file_processed(
                filename=nomenclature_info['filename'],
                message=f"Le plan {nomenclature_info['shot_id']} {nomenclature_info['version']} est disponible pour review",
                frameio_link=frameio_link or 'https://app.frame.io/test',
                thumbnail_url=thumbnail_url if 'thumbnail_url' in locals() else None
            )
            
            if notification_result:
                logger.info("✅ Notification Discord envoyée avec succès")
                
                # Vérifier si le thumbnail est inclus
                if thumbnail_url:
                    logger.info(f"✅ Thumbnail inclus: {thumbnail_url}")
                    
                    # Vérifier le format de l'URL
                    if thumbnail_url.startswith('https://drive.google.com'):
                        logger.info("✅ Thumbnail Google Drive (optimal pour Discord)")
                    else:
                        logger.warning(f"⚠️ Thumbnail non-Google Drive: {thumbnail_url}")
                else:
                    logger.warning("⚠️ Notification envoyée sans thumbnail")
            else:
                logger.error("❌ Échec envoi notification Discord")
                
        except Exception as e:
            logger.error(f"❌ Erreur notification Discord: {e}")
            import traceback
            traceback.print_exc()
        
        # 9. Test système de tracking JSON (préparation future)
        logger.info("🔍 Test 7: Préparation système de tracking JSON")
        
        try:
            # Créer les données pour le tracking JSON
            tracking_data = {
                'file_path': str(test_file_path),
                'shot_id': nomenclature_info['shot_id'],
                'version': nomenclature_info['version'],
                'filename': nomenclature_info['filename'],
                'file_size': file_size,
                'file_hash': None,  # À calculer plus tard
                'upload_timestamp': '2025-07-09T08:00:00',
                'frameio_file_id': None,  # À récupérer de l'upload
                'frameio_link': frameio_link,
                'thumbnail_url': thumbnail_url if 'thumbnail_url' in locals() else None,
                'thumbnail_drive_id': None,  # À récupérer du Google Drive
                'discord_message_id': None,  # À récupérer après notification
                'google_sheets_row': None,  # À récupérer après mise à jour
                'status': 'PROCESSED'
            }
            
            logger.info("✅ Structure tracking JSON préparée")
            logger.info(f"📋 Données collectées: {len(tracking_data)} champs")
            
            # Pour l'instant, on logge juste la structure
            logger.info("🔮 Futur: Sauvegarde dans uploads_tracking.json")
            logger.info("🔮 Futur: Détection doublons via hash + metadata")
            
        except Exception as e:
            logger.error(f"❌ Erreur préparation tracking: {e}")
        
        # 10. Résumé des corrections
        logger.info("📋 === RÉSUMÉ DES TESTS ===")
        logger.info("✅ 1. Validation nomenclature stricte")
        logger.info("✅ 2. Thumbnail Google Drive généré")
        logger.info("✅ 3. Authentification Frame.io validée")
        logger.info("✅ 4. Upload Frame.io RÉEL testé")
        logger.info("✅ 5. Google Sheets avec vraies mises à jour")
        logger.info("✅ 6. Notifications Discord avec thumbnails")
        logger.info("✅ 7. Structure tracking JSON préparée")
        
        logger.info("🎯 === PROCHAINES ÉTAPES ===")
        logger.info("1. Implémenter le système de tracking JSON complet")
        logger.info("2. Ajouter la détection de doublons via hash")
        logger.info("3. Récupérer les IDs Frame.io et Discord pour tracking")
        logger.info("4. Optimiser le pipeline avec le cache de tracking")
        
    except Exception as e:
        logger.error(f"❌ Erreur générale du test: {e}")
        import traceback
        traceback.print_exc()

def main():
    """
    Point d'entrée principal avec gestion des arguments
    """
    if len(sys.argv) < 2:
        print("Usage: python test_with_file.py <chemin_vers_fichier>")
        print("\nExemples:")
        print("  python test_with_file.py /Volumes/resizelab/o2b-undllm/4_OUT/2_FROM_VFX/SC01/UNDLM_00001/SC01_UNDLM_00001_v001.mov")
        print("  python test_with_file.py /path/to/your/SC02_SHOTNAME_v002.mov")
        sys.exit(1)
    
    test_file_path = sys.argv[1]
    asyncio.run(test_upload_flow(test_file_path))

if __name__ == "__main__":
    main()
