#!/usr/bin/env python3
"""
🧪 Test d'upload simple avec LucidLink
====================================

Test rapide d'upload avec les nouvelles fonctionnalités LucidLink
"""

import asyncio
import logging
import sys
from pathlib import Path

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Ajouter le répertoire parent au path
sys.path.insert(0, str(Path(__file__).parent))

async def test_simple_upload():
    """Test d'upload simple avec détection LucidLink"""
    
    # Import du pipeline
    from main import RLPostFlowPipeline
    
    logger.info("🧪 Test d'upload simple avec LucidLink...")
    
    # Créer une instance du pipeline
    pipeline = RLPostFlowPipeline()
    
    # Initialiser les composants nécessaires
    logger.info("🔄 Initialisation des composants...")
    
    frameio_ok = await pipeline.initialize_frameio()
    if not frameio_ok:
        logger.error("❌ Impossible d'initialiser Frame.io")
        return False
    
    infrastructure_ok = await pipeline.initialize_shared_infrastructure()
    if not infrastructure_ok:
        logger.error("❌ Impossible d'initialiser l'infrastructure")
        return False
    
    # Trouver un fichier de test
    test_files = [
        Path("data/TEST_DEFAUT_VIDEO.mp4"),
        Path.home() / "Downloads" / "test.mp4",
        Path.home() / "Desktop" / "test.mp4"
    ]
    
    test_file = None
    for file_path in test_files:
        if file_path.exists() and file_path.stat().st_size > 1024:  # > 1KB
            test_file = file_path
            break
    
    if not test_file:
        logger.error("❌ Aucun fichier de test trouvé")
        logger.info("📋 Créer un fichier de test:")
        for path in test_files:
            logger.info(f"   - {path}")
        return False
    
    logger.info(f"📄 Fichier de test: {test_file}")
    logger.info(f"📏 Taille: {test_file.stat().st_size:,} bytes")
    
    # Traiter le fichier
    logger.info("🔄 Traitement du fichier...")
    
    try:
        success = await pipeline.process_file(test_file)
        
        if success:
            logger.info("✅ Upload réussi !")
            logger.info(f"🎬 Fichier uploadé: {test_file.name}")
            
            # Afficher les métriques
            logger.info("📊 Métriques finales:")
            logger.info(f"   - Fichiers traités: {pipeline.metrics['files_processed']}")
            logger.info(f"   - Uploads réussis: {pipeline.metrics['uploads_success']}")
            logger.info(f"   - Uploads échoués: {pipeline.metrics['uploads_failed']}")
            
            return True
        else:
            logger.error("❌ Upload échoué")
            return False
            
    except Exception as e:
        logger.error(f"❌ Erreur lors du traitement: {e}")
        return False
    
    finally:
        # Nettoyer
        await pipeline.shutdown()

async def main():
    """Fonction principale"""
    logger.info("🚀 Test d'upload simple avec LucidLink...")
    
    try:
        success = await test_simple_upload()
        
        if success:
            logger.info("✅ Test terminé avec succès")
            return 0
        else:
            logger.error("❌ Test échoué")
            return 1
            
    except Exception as e:
        logger.error(f"❌ Erreur lors du test: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
