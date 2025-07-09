#!/usr/bin/env python3
"""
Test du pipeline principal avec système de tracking intégré
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

# Imports du pipeline
from main import RLPostFlowPipeline

async def test_pipeline_with_tracking(test_file_path):
    """
    Test du pipeline complet avec système de tracking
    """
    try:
        logger.info("🧪 === TEST PIPELINE AVEC TRACKING ===")
        logger.info(f"📁 Fichier de test: {test_file_path}")
        
        # Vérifier que le fichier existe
        if not Path(test_file_path).exists():
            logger.error(f"❌ Fichier de test non trouvé: {test_file_path}")
            return
        
        # Initialiser le pipeline
        logger.info("🔧 Initialisation du pipeline...")
        pipeline = RLPostFlowPipeline()
        
        # Vérifier que le tracker est initialisé
        if pipeline.upload_tracker:
            logger.info("✅ Upload tracker initialisé")
            
            # Afficher les stats avant
            stats_before = pipeline.upload_tracker.get_stats()
            logger.info(f"📊 Stats avant: {stats_before['total_uploads']} uploads")
        else:
            logger.warning("⚠️ Upload tracker non disponible")
        
        # Traiter le fichier avec le workflow complet
        logger.info("🚀 Démarrage du workflow complet...")
        
        result = await pipeline._process_file_workflow(Path(test_file_path))
        
        # Vérifier les résultats
        if pipeline.upload_tracker:
            stats_after = pipeline.upload_tracker.get_stats()
            logger.info(f"📊 === RÉSULTATS FINAUX ===")
            logger.info(f"📊 Total uploads: {stats_after['total_uploads']}")
            logger.info(f"📊 Par status:")
            for status, count in stats_after['by_status'].items():
                logger.info(f"   {status}: {count}")
                
            # Afficher les derniers uploads
            logger.info("📋 Derniers uploads:")
            all_uploads = pipeline.upload_tracker.list_uploads()
            for upload in all_uploads[-3:]:  # Les 3 derniers
                logger.info(f"   {upload.get('upload_id')} - {upload.get('shot_id')} - {upload.get('status')}")
        
        logger.info("🎯 === TEST TERMINÉ ===")
        
    except Exception as e:
        logger.error(f"❌ Erreur générale du test: {e}")
        import traceback
        traceback.print_exc()

def main():
    """
    Point d'entrée principal
    """
    if len(sys.argv) < 2:
        print("Usage: python test_pipeline_tracking.py <chemin_vers_fichier>")
        print("\nExemples:")
        print("  python test_pipeline_tracking.py /Volumes/resizelab/o2b-undllm/4_OUT/2_FROM_VFX/SC01/UNDLM_00001/SC01_UNDLM_00001_v001.mov")
        sys.exit(1)
    
    test_file_path = sys.argv[1]
    asyncio.run(test_pipeline_with_tracking(test_file_path))

if __name__ == "__main__":
    main()
