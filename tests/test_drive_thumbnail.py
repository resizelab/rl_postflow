#!/usr/bin/env python3
"""
Test des thumbnails avec Google Drive
"""

import asyncio
import sys
from pathlib import Path
import logging

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.utils.config import ConfigManager
from src.utils.thumbnail import ThumbnailGenerator

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def test_drive_thumbnail():
    """Test de génération de thumbnail avec Google Drive."""
    try:
        logger.info("🎯 Test thumbnail avec Google Drive")
        
        # Configuration
        config = ConfigManager()
        
        # Fichier de test
        test_file = "/Volumes/resizelab/o2b-undllm/4_OUT/2_FROM_VFX/SC01/UNDLM_00001/SC01_UNDLM_00001_v001.mov"
        
        if not Path(test_file).exists():
            logger.error(f"❌ Fichier de test non trouvé: {test_file}")
            return
        
        # Créer le générateur
        thumbnail_gen = ThumbnailGenerator(config)
        
        # Test 1: Génération avec Google Drive
        logger.info("🔍 Test 1: Génération avec Google Drive")
        drive_url = await thumbnail_gen.generate_with_drive_upload(test_file, shot_name="UNDLM_00001")
        
        if drive_url:
            logger.info(f"✅ URL Google Drive: {drive_url}")
            
            # Vérifier que c'est une URL publique
            if drive_url.startswith('https://drive.google.com'):
                logger.info("✅ URL Google Drive valide pour Discord")
            else:
                logger.warning(f"⚠️ URL inattendue: {drive_url}")
        else:
            logger.error("❌ Échec génération thumbnail Google Drive")
        
        # Test 2: Comparaison avec méthode locale (fallback)
        logger.info("\n🔍 Test 2: Comparaison avec méthode locale")
        local_url = await thumbnail_gen.generate_with_public_url(test_file)
        
        if local_url:
            logger.info(f"✅ URL locale: {local_url}")
        else:
            logger.error("❌ Échec génération thumbnail locale")
        
        # Résumé
        logger.info("\n📋 === RÉSUMÉ ===")
        logger.info(f"Google Drive: {'✅' if drive_url else '❌'}")
        logger.info(f"Méthode locale: {'✅' if local_url else '❌'}")
        
        if drive_url:
            logger.info("🎉 Thumbnails Discord-ready avec Google Drive !")
        else:
            logger.warning("⚠️ Fallback vers méthode locale nécessaire")
            
    except Exception as e:
        logger.error(f"❌ Erreur générale: {e}")
        import traceback
        traceback.print_exc()

def main():
    """Point d'entrée principal."""
    if len(sys.argv) > 1:
        test_file = sys.argv[1]
        logger.info(f"📁 Utilisation du fichier: {test_file}")
        # Modifier le fichier dans la fonction de test
        global test_file_override
        test_file_override = test_file
    
    asyncio.run(test_drive_thumbnail())

if __name__ == "__main__":
    main()
