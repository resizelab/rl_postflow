#!/usr/bin/env python3
"""
Test d'intégration du ThumbnailGenerator avec le pipeline
"""
import sys
import asyncio
import logging
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.utils.thumbnail import ThumbnailGenerator
from src.utils.config import ConfigManager

# Configuration du logging comme dans main.py
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def test_production_workflow():
    """Test du workflow de production comme dans main.py"""
    try:
        # Charger la configuration comme dans main.py
        config_path = Path(__file__).parent / "config" / "integrations.json"
        config_manager = ConfigManager(str(config_path))
        
        # Créer le générateur comme dans main.py
        thumbnail_generator = ThumbnailGenerator(config_manager)
        
        # Simuler un fichier vidéo d'upload
        test_video = Path(__file__).parent / "temp/sample_videos/test_A_0002C125X250401_113451FW_UNDLM.mov.mp4"
        
        if not test_video.exists():
            logger.error(f"❌ Fichier de test non trouvé: {test_video}")
            return False
        
        logger.info(f"🎬 Test workflow production avec: {test_video.name}")
        
        # Test comme dans _process_file_workflow
        thumbnail_path = None
        if config_manager.get('workflow.enable_thumbnails', True):
            try:
                thumbnail_path = await thumbnail_generator.generate_thumbnail(str(test_video))
                if thumbnail_path:
                    logger.info(f"✅ Miniature générée: {thumbnail_path}")
                    
                    # Vérifier que le fichier existe et a une taille correcte
                    thumb_file = Path(thumbnail_path)
                    if thumb_file.exists():
                        size = thumb_file.stat().st_size
                        if size > 1000:  # Au moins 1KB
                            logger.info(f"✅ Thumbnail valide: {size} bytes")
                            return True
                        else:
                            logger.error(f"❌ Thumbnail trop petit: {size} bytes")
                            return False
                    else:
                        logger.error("❌ Fichier thumbnail non trouvé")
                        return False
                else:
                    logger.error("❌ Génération thumbnail échouée")
                    return False
                    
            except Exception as e:
                logger.error(f"❌ Erreur génération miniature: {e}")
                return False
        
        return False
        
    except Exception as e:
        logger.error(f"❌ Erreur test workflow: {e}")
        return False

async def test_multiple_formats():
    """Test avec différents formats de fichier"""
    try:
        config_path = Path(__file__).parent / "config" / "integrations.json"
        config_manager = ConfigManager(str(config_path))
        thumbnail_generator = ThumbnailGenerator(config_manager)
        
        # Chercher différents formats
        video_dir = Path(__file__).parent / "temp/sample_videos"
        if not video_dir.exists():
            logger.warning("⚠️ Répertoire de test non trouvé")
            return False
        
        formats_tested = []
        success_count = 0
        
        for video_file in video_dir.glob("*"):
            if video_file.suffix.lower() in ['.mp4', '.mov', '.avi', '.mkv']:
                logger.info(f"🎬 Test format {video_file.suffix}: {video_file.name}")
                
                try:
                    thumbnail_path = await thumbnail_generator.generate_thumbnail(str(video_file))
                    if thumbnail_path and Path(thumbnail_path).exists():
                        logger.info(f"✅ Format {video_file.suffix} OK")
                        success_count += 1
                    else:
                        logger.warning(f"⚠️ Format {video_file.suffix} échoué")
                except Exception as e:
                    logger.error(f"❌ Erreur format {video_file.suffix}: {e}")
                
                formats_tested.append(video_file.suffix)
        
        logger.info(f"📊 Résultats: {success_count}/{len(formats_tested)} formats réussis")
        return success_count > 0
        
    except Exception as e:
        logger.error(f"❌ Erreur test formats: {e}")
        return False

async def main():
    """Fonction principale"""
    logger.info("🧪 Test d'intégration ThumbnailGenerator")
    logger.info("=" * 50)
    
    # Test 1: Workflow de production
    logger.info("1. Test workflow production...")
    workflow_ok = await test_production_workflow()
    
    # Test 2: Formats multiples
    logger.info("2. Test formats multiples...")
    formats_ok = await test_multiple_formats()
    
    # Résumé
    logger.info("\n📊 RÉSULTATS FINAUX")
    logger.info("-" * 30)
    logger.info(f"{'✅' if workflow_ok else '❌'} Workflow production: {'OK' if workflow_ok else 'ECHEC'}")
    logger.info(f"{'✅' if formats_ok else '❌'} Formats multiples: {'OK' if formats_ok else 'ECHEC'}")
    
    if workflow_ok and formats_ok:
        logger.info("🎉 Tous les tests réussis - Thumbnails prêts pour production !")
        return True
    else:
        logger.error("❌ Certains tests ont échoué")
        return False

if __name__ == "__main__":
    try:
        success = asyncio.run(main())
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        logger.info("🛑 Test interrompu")
        sys.exit(1)
