#!/usr/bin/env python3
"""
🔍 Test de détection de fichiers en temps réel
===========================================

Script pour tester la détection de fichiers avec logs visibles
"""

import asyncio
import logging
import sys
import time
from pathlib import Path

# Configuration du logging avec plus de détails
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Ajouter le répertoire parent au path
sys.path.insert(0, str(Path(__file__).parent))

async def test_file_detection():
    """Test de détection de fichiers en temps réel"""
    
    from main import RLPostFlowPipeline
    
    logger.info("🔍 Test de détection de fichiers en temps réel...")
    
    # Créer une instance du pipeline
    pipeline = RLPostFlowPipeline()
    
    # Afficher la configuration du watcher
    lucidlink_config = pipeline.config.get('lucidlink', {})
    logger.info(f"📂 Configuration LucidLink:")
    logger.info(f"   - Mount path: {lucidlink_config.get('mount_path')}")
    logger.info(f"   - Base path: {lucidlink_config.get('base_path')}")
    logger.info(f"   - Extensions: {lucidlink_config.get('file_extensions')}")
    
    # Démarrer seulement le watcher pour le test
    logger.info("🔄 Initialisation du watcher...")
    watcher_ok = pipeline.initialize_watcher()
    
    if not watcher_ok:
        logger.error("❌ Impossible d'initialiser le watcher")
        return False
    
    # Stocker la boucle d'événements
    pipeline._event_loop = asyncio.get_running_loop()
    
    # Configuration du callback pour afficher les détections
    def test_callback(file_event):
        logger.info(f"🎯 FICHIER DÉTECTÉ: {file_event.file_path}")
        logger.info(f"   - Type: {file_event.event_type}")
        logger.info(f"   - Timestamp: {file_event.timestamp}")
    
    # Ajouter le callback de test
    pipeline.watcher.add_callback(test_callback)
    
    # Démarrer le watcher
    logger.info("👁️ Démarrage du watcher...")
    pipeline.watcher.start()
    
    # Afficher les répertoires surveillés
    logger.info("📁 Répertoires surveillés:")
    if hasattr(pipeline.watcher, 'config'):
        base_path = pipeline.watcher.config.get('base_path')
        logger.info(f"   - Base: {base_path}")
        
        if Path(base_path).exists():
            logger.info(f"   - Existe: ✅")
            # Lister les sous-répertoires
            try:
                subdirs = [d for d in Path(base_path).iterdir() if d.is_dir()]
                logger.info(f"   - Sous-répertoires: {[d.name for d in subdirs[:5]]}")
            except Exception as e:
                logger.warning(f"   - Erreur liste: {e}")
        else:
            logger.error(f"   - Existe: ❌")
    
    # Instructions pour l'utilisateur
    print("\n" + "="*80)
    print("🎯 TEST DE DÉTECTION DE FICHIERS")
    print("="*80)
    print("📋 Instructions:")
    print("1. Copiez un fichier .mp4, .mov ou .avi dans le répertoire LucidLink")
    print("2. Observez les logs ci-dessous pour voir la détection")
    print("3. Appuyez sur Ctrl+C pour arrêter le test")
    print("="*80)
    
    try:
        # Boucle de surveillance
        start_time = time.time()
        last_status = time.time()
        
        while True:
            # Afficher un statut toutes les 30 secondes
            if time.time() - last_status > 30:
                logger.info(f"👁️ Watcher actif depuis {int(time.time() - start_time)}s")
                last_status = time.time()
                
                # Afficher les métriques du watcher si disponibles
                if hasattr(pipeline.watcher, 'metrics'):
                    metrics = pipeline.watcher.metrics
                    logger.info(f"📊 Métriques: {metrics}")
            
            await asyncio.sleep(1)
            
    except KeyboardInterrupt:
        logger.info("🛑 Arrêt du test demandé")
    
    finally:
        # Arrêter proprement
        if pipeline.watcher:
            pipeline.watcher.stop()
        logger.info("✅ Test terminé")
    
    return True

async def main():
    """Fonction principale"""
    logger.info("🚀 Démarrage du test de détection...")
    
    try:
        await test_file_detection()
        return 0
    except Exception as e:
        logger.error(f"❌ Erreur lors du test: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
