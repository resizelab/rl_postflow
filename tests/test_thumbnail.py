#!/usr/bin/env python3
"""
Test du ThumbnailGenerator pour identifier les erreurs
"""
import sys
import asyncio
import logging
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.utils.thumbnail import ThumbnailGenerator
from src.utils.config import ConfigManager

# Configuration du logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def test_thumbnail_generation():
    """Test de génération de thumbnail"""
    try:
        # Créer un fichier vidéo test factice
        test_video = "/tmp/test_video.mp4"
        
        # Vérifier s'il existe déjà un fichier vidéo dans les exemples
        project_root = Path(__file__).parent
        examples_dir = project_root / "examples"
        
        # Chercher des fichiers vidéo dans le projet
        video_files = []
        for ext in [".mp4", ".mov", ".avi", ".mkv"]:
            video_files.extend(list(project_root.rglob(f"*{ext}")))
        
        if video_files:
            test_video = str(video_files[0])
            logger.info(f"📹 Fichier vidéo trouvé: {test_video}")
        else:
            logger.warning("⚠️ Aucun fichier vidéo trouvé pour le test")
            
            # Créer un fichier vidéo test avec ffmpeg
            import subprocess
            try:
                cmd = [
                    "ffmpeg",
                    "-f", "lavfi",
                    "-i", "testsrc=duration=10:size=320x240:rate=30",
                    "-y",
                    test_video
                ]
                
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
                if result.returncode == 0:
                    logger.info(f"✅ Fichier vidéo test créé: {test_video}")
                else:
                    logger.error(f"❌ Erreur création vidéo test: {result.stderr}")
                    return False
                    
            except Exception as e:
                logger.error(f"❌ Impossible de créer le fichier vidéo test: {e}")
                return False
        
        # Initialiser le générateur
        config_path = project_root / "config" / "integrations.json"
        if config_path.exists():
            config = ConfigManager(str(config_path))
            generator = ThumbnailGenerator(config)
        else:
            generator = ThumbnailGenerator()
        
        # Tester la génération
        logger.info("🖼️ Test de génération de thumbnail...")
        
        thumbnail_path = await generator.generate_thumbnail(
            video_path=test_video,
            output_dir="temp/thumbnails",
            timestamp="00:00:02",
            size="320x180"
        )
        
        if thumbnail_path:
            logger.info(f"✅ Thumbnail généré avec succès: {thumbnail_path}")
            
            # Vérifier que le fichier existe
            if Path(thumbnail_path).exists():
                logger.info(f"✅ Fichier thumbnail confirmé: {Path(thumbnail_path).stat().st_size} bytes")
                return True
            else:
                logger.error("❌ Fichier thumbnail non trouvé après génération")
                return False
        else:
            logger.error("❌ Génération de thumbnail échouée")
            return False
            
    except Exception as e:
        logger.error(f"❌ Erreur durant le test: {e}")
        return False

async def test_video_info():
    """Test d'obtention d'informations vidéo"""
    try:
        # Chercher un fichier vidéo
        project_root = Path(__file__).parent
        video_files = []
        for ext in [".mp4", ".mov", ".avi", ".mkv"]:
            video_files.extend(list(project_root.rglob(f"*{ext}")))
        
        if not video_files:
            logger.warning("⚠️ Aucun fichier vidéo trouvé pour le test d'info")
            return False
        
        test_video = str(video_files[0])
        logger.info(f"📹 Test d'info pour: {test_video}")
        
        generator = ThumbnailGenerator()
        info = generator.get_video_info(test_video)
        
        if info:
            logger.info(f"✅ Informations vidéo obtenues:")
            for key, value in info.items():
                logger.info(f"  {key}: {value}")
            return True
        else:
            logger.error("❌ Impossible d'obtenir les informations vidéo")
            return False
            
    except Exception as e:
        logger.error(f"❌ Erreur test info vidéo: {e}")
        return False

async def main():
    """Fonction principale de test"""
    logger.info("🧪 Test du ThumbnailGenerator")
    logger.info("=" * 50)
    
    # Test 1: Vérifier ffmpeg
    logger.info("1. Test de ffmpeg...")
    generator = ThumbnailGenerator()
    
    # Test 2: Génération de thumbnail
    logger.info("2. Test de génération de thumbnail...")
    thumb_ok = await test_thumbnail_generation()
    
    # Test 3: Informations vidéo
    logger.info("3. Test d'obtention d'informations vidéo...")
    info_ok = await test_video_info()
    
    # Résumé
    logger.info("\n📊 RÉSULTATS DES TESTS")
    logger.info("-" * 30)
    logger.info(f"{'✅' if thumb_ok else '❌'} Génération thumbnail: {'OK' if thumb_ok else 'ECHEC'}")
    logger.info(f"{'✅' if info_ok else '❌'} Informations vidéo: {'OK' if info_ok else 'ECHEC'}")
    
    return thumb_ok and info_ok

if __name__ == "__main__":
    try:
        success = asyncio.run(main())
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        logger.info("🛑 Test interrompu")
        sys.exit(1)
    except Exception as e:
        logger.error(f"💥 Erreur fatale: {e}")
        sys.exit(1)
