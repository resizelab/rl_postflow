#!/usr/bin/env python3
"""
🚀 Démarrage du pipeline avec logs détaillés
==========================================

Script pour démarrer le pipeline complet avec surveillance active
"""

import asyncio
import logging
import sys
import signal
from pathlib import Path

# Configuration du logging détaillé
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('logs/pipeline_live.log')
    ]
)

# Réduire le bruit des logs HTTP
logging.getLogger('httpx').setLevel(logging.WARNING)
logging.getLogger('asyncio').setLevel(logging.WARNING)

logger = logging.getLogger(__name__)

# Ajouter le répertoire parent au path
sys.path.insert(0, str(Path(__file__).parent))

# Variable globale pour le pipeline
pipeline = None

def signal_handler(signum, frame):
    """Gestionnaire de signal pour arrêt propre"""
    logger.info(f"🛑 Signal {signum} reçu, arrêt du pipeline...")
    if pipeline:
        asyncio.create_task(pipeline.shutdown())
    sys.exit(0)

async def start_pipeline_with_logs():
    """Démarre le pipeline avec logs détaillés"""
    global pipeline
    
    from main import RLPostFlowPipeline
    
    logger.info("🚀 Démarrage du pipeline RL PostFlow avec logs détaillés...")
    
    # Créer le pipeline
    pipeline = RLPostFlowPipeline()
    
    # Configurer les gestionnaires de signaux
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Afficher la bannière
    pipeline.print_banner()
    
    # Désactiver le dashboard pour ce test
    pipeline.pipeline_config['dashboard'] = {'enabled': False}
    
    logger.info("📋 Configuration active:")
    logger.info(f"   - Path LucidLink: {pipeline.config.get('lucidlink', {}).get('base_path')}")
    logger.info(f"   - Extensions: {pipeline.config.get('lucidlink', {}).get('file_extensions')}")
    logger.info(f"   - Project Frame.io: {pipeline.config.get('frameio', {}).get('default_project_id')}")
    
    # Démarrer le pipeline
    try:
        await pipeline.run_pipeline()
    except KeyboardInterrupt:
        logger.info("🛑 Arrêt demandé par l'utilisateur")
    except Exception as e:
        logger.error(f"❌ Erreur dans le pipeline: {e}")
    finally:
        if pipeline:
            await pipeline.shutdown()

async def main():
    """Fonction principale"""
    logger.info("🎬 RL PostFlow - Pipeline avec surveillance active")
    logger.info("="*60)
    logger.info("📂 Surveille: /Volumes/resizelab/o2b-undllm")
    logger.info("🎯 Extensions: .mp4, .mov, .avi, .mkv")
    logger.info("📤 Upload automatique vers Frame.io")
    logger.info("🔄 Logs en temps réel ci-dessous...")
    logger.info("="*60)
    
    try:
        await start_pipeline_with_logs()
        return 0
    except Exception as e:
        logger.error(f"❌ Erreur fatale: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
