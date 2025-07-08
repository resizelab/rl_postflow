#!/usr/bin/env python3
"""
🧪 Test d'upload LucidLink avec mise en cache
==========================================

Test complet : détection → cache → upload vers Frame.io
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

async def test_full_lucidlink_upload():
    """Test complet d'upload LucidLink avec mise en cache"""
    
    # Import du pipeline
    from main import RLPostFlowPipeline
    
    logger.info("🚀 Test complet d'upload LucidLink avec mise en cache...")
    
    # Fichier de test LucidLink
    test_file = Path("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00402.mov")
    
    if not test_file.exists():
        logger.error("❌ Fichier de test non trouvé")
        return False
    
    logger.info(f"📄 Fichier de test: {test_file}")
    logger.info(f"📏 Taille: {test_file.stat().st_size:,} bytes")
    
    # Créer une instance du pipeline
    pipeline = RLPostFlowPipeline()
    
    try:
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
        
        logger.info("✅ Tous les composants initialisés")
        
        # Traiter le fichier avec la nouvelle logique LucidLink
        logger.info("🔄 Traitement du fichier LucidLink...")
        
        success = await pipeline.process_file(test_file)
        
        if success:
            logger.info("🎉 Upload LucidLink réussi !")
            logger.info("✅ Le fichier devrait maintenant être complet sur Frame.io")
            
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
        logger.error(f"❌ Erreur lors du test: {e}")
        return False
    
    finally:
        # Nettoyer
        await pipeline.shutdown()

async def main():
    """Fonction principale"""
    try:
        success = await test_full_lucidlink_upload()
        
        if success:
            logger.info("🎉 Test d'upload LucidLink terminé avec succès !")
            logger.info("🔍 Vérifiez Frame.io pour confirmer que le fichier fait bien 909 MB")
            return 0
        else:
            logger.error("❌ Test d'upload LucidLink échoué")
            return 1
            
    except Exception as e:
        logger.error(f"❌ Erreur lors du test: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
