#!/usr/bin/env python3
"""
🧪 Test simple d'upload avec LucidLink
====================================

Test basique d'upload avec les nouvelles fonctionnalités LucidLink
"""

import asyncio
import logging
import sys
from pathlib import Path

# Ajouter le répertoire parent au path
sys.path.insert(0, str(Path(__file__).parent))

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

from src.utils.lucidlink_utils import lucidlink_detector, lucidlink_waiter

async def test_file_stability():
    """Test de stabilité d'un fichier"""
    logger.info("🧪 Test de stabilité de fichier avec LucidLink...")
    
    # Utiliser un fichier de test existant
    test_file = Path("data/TEST_DEFAUT_VIDEO.mp4")
    
    if not test_file.exists():
        logger.warning("⚠️ Fichier de test non trouvé, création d'un fichier temporaire")
        test_file = Path("/tmp/test_video.mp4")
        # Créer un fichier de test (4MB)
        with open(test_file, 'wb') as f:
            f.write(b'0' * (4 * 1024 * 1024))
    
    logger.info(f"📄 Fichier de test: {test_file}")
    logger.info(f"📏 Taille initiale: {test_file.stat().st_size:,} bytes")
    
    # Tester la détection LucidLink
    is_lucidlink = lucidlink_detector.is_lucidlink_file(test_file)
    logger.info(f"🔍 LucidLink détecté: {is_lucidlink}")
    
    if is_lucidlink:
        status = lucidlink_detector.get_lucidlink_file_status(test_file)
        logger.info(f"📊 Statut LucidLink: {status}")
    
    # Tester l'attente de synchronisation
    logger.info("⏳ Test d'attente de synchronisation...")
    start_time = asyncio.get_event_loop().time()
    
    result = await lucidlink_waiter.wait_for_complete_sync(
        test_file,
        max_wait=60,  # 1 minute pour le test
        check_interval=2
    )
    
    elapsed = asyncio.get_event_loop().time() - start_time
    logger.info(f"⏱️ Temps d'attente: {elapsed:.1f}s")
    logger.info(f"✅ Résultat: {result}")
    
    if result:
        logger.info(f"📏 Taille finale: {test_file.stat().st_size:,} bytes")
        logger.info("✅ Fichier prêt pour l'upload")
    else:
        logger.error("❌ Fichier non prêt")
    
    # Nettoyer si fichier temporaire
    if test_file.name == "test_video.mp4":
        test_file.unlink()
    
    return result

async def main():
    """Fonction principale du test"""
    logger.info("🚀 Test simple LucidLink...")
    
    try:
        success = await test_file_stability()
        
        if success:
            logger.info("✅ Test terminé avec succès")
            logger.info("🎯 Le système LucidLink fonctionne correctement")
            return 0
        else:
            logger.error("❌ Test échoué")
            return 1
            
    except Exception as e:
        logger.error(f"❌ Erreur lors du test: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
