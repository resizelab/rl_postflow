#!/usr/bin/env python3
"""
Script pour tester les améliorations Frame.io spécifiquement:
- Improved waiting logic
- Better file accessibility checking
- Robust link generation
"""

import asyncio
import sys
import logging
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.integrations.frameio.upload import FrameIOUploadManager, validate_strict_nomenclature
from src.utils.config import ConfigManager

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def test_frameio_improvements():
    """
    Teste les améliorations Frame.io avec un fichier test.
    """
    try:
        logger.info(f"🚀 === TEST AMÉLIORATIONS FRAME.IO ===")
        
        # Charger la configuration
        config = ConfigManager()
        frameio_manager = FrameIOUploadManager(config)
        
        # Créer un fichier test
        test_dir = Path("temp")
        test_dir.mkdir(exist_ok=True)
        test_file = test_dir / "SC01_UNDLM_99999_v001.mov"
        
        # Créer un fichier test de 10MB pour simuler un vrai fichier
        logger.info(f"📁 Création fichier test: {test_file}")
        with open(test_file, 'wb') as f:
            f.write(b'0' * (10 * 1024 * 1024))  # 10MB
        
        # Validation nomenclature
        nomenclature_info = validate_strict_nomenclature(str(test_file))
        logger.info(f"✅ Nomenclature: {nomenclature_info}")
        
        # Test upload avec la nouvelle logique d'attente
        logger.info(f"📤 Test upload avec attente améliorée...")
        
        frameio_link = await frameio_manager.upload_file_production(
            str(test_file),
            shot_name=nomenclature_info.get('shot_id'),
            scene_name=nomenclature_info.get('scene_name')
        )
        
        if frameio_link:
            logger.info(f"✅ Upload réussi: {frameio_link}")
            
            # Tester l'accessibilité du lien immédiatement
            import httpx
            async with httpx.AsyncClient() as client:
                try:
                    response = await client.get(frameio_link, timeout=30)
                    if response.status_code == 200:
                        logger.info(f"✅ Lien accessible immédiatement (200)")
                    elif response.status_code == 404:
                        logger.warning(f"⚠️ Lien pas encore accessible (404) - attente...")
                        
                        # Attendre un peu et réessayer
                        await asyncio.sleep(30)
                        response = await client.get(frameio_link, timeout=30)
                        if response.status_code == 200:
                            logger.info(f"✅ Lien accessible après attente (200)")
                        else:
                            logger.error(f"❌ Lien toujours non accessible ({response.status_code})")
                    else:
                        logger.warning(f"⚠️ Status inattendu: {response.status_code}")
                except Exception as e:
                    logger.error(f"❌ Erreur test accessibilité: {e}")
        else:
            logger.error(f"❌ Upload échoué")
        
        # Nettoyer
        try:
            test_file.unlink()
            logger.info(f"🗑️ Fichier test nettoyé")
        except:
            pass
        
        return frameio_link is not None
        
    except Exception as e:
        logger.error(f"❌ Erreur test Frame.io: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_frameio_improvements())
    if success:
        logger.info(f"🎉 Test Frame.io réussi!")
    else:
        logger.error(f"❌ Test Frame.io échoué!")
        sys.exit(1)
