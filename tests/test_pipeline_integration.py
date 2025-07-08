#!/usr/bin/env python3
"""
Script de validation finale pour RL PostFlow avec Cloudflare Tunnel
Teste l'intégration complète du pipeline principal
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

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

async def test_pipeline_integration():
    """Test d'intégration du pipeline principal avec Cloudflare"""
    try:
        logger.info("🚀 Test d'intégration RL PostFlow avec Cloudflare Tunnel")
        
        # Import du pipeline principal
        from main import PostFlowPipeline
        
        # Créer une instance du pipeline
        pipeline = PostFlowPipeline()
        
        # Test de l'infrastructure partagée
        logger.info("📋 Test infrastructure partagée...")
        if await pipeline.initialize_shared_infrastructure():
            logger.info("✅ Infrastructure partagée initialisée avec succès")
            
            # Vérifier que Cloudflare Tunnel est actif
            if pipeline.shared_cloudflare_manager and pipeline.shared_cloudflare_manager.is_running():
                logger.info(f"✅ Tunnel Cloudflare actif: {pipeline.shared_cloudflare_manager.tunnel_url}")
            else:
                logger.error("❌ Tunnel Cloudflare non actif")
                return False
                
            # Vérifier le serveur HTTP
            if pipeline.shared_http_server and pipeline.shared_http_server.server:
                logger.info(f"✅ Serveur HTTP actif sur port {pipeline.shared_http_server.actual_port}")
            else:
                logger.error("❌ Serveur HTTP non actif")
                return False
            
            # Nettoyer
            await pipeline.cleanup()
            logger.info("✅ Nettoyage effectué")
            
            return True
        else:
            logger.error("❌ Échec initialisation infrastructure")
            return False
            
    except Exception as e:
        logger.error(f"❌ Erreur test intégration: {e}")
        return False

async def test_file_upload(file_path: str):
    """Test d'upload d'un fichier spécifique"""
    try:
        from main import PostFlowPipeline
        
        pipeline = PostFlowPipeline()
        
        # Initialiser l'infrastructure
        if not await pipeline.initialize_shared_infrastructure():
            logger.error("❌ Impossible d'initialiser l'infrastructure")
            return False
        
        # Tester l'upload du fichier
        file_pathlib = Path(file_path)
        if not file_pathlib.exists():
            logger.error(f"❌ Fichier non trouvé: {file_path}")
            return False
        
        logger.info(f"📤 Test upload: {file_pathlib}")
        success = await pipeline.process_file(file_pathlib)
        
        if success:
            logger.info("✅ Upload réussi via pipeline principal")
        else:
            logger.error("❌ Échec upload via pipeline principal")
        
        # Nettoyer
        await pipeline.cleanup()
        
        return success
        
    except Exception as e:
        logger.error(f"❌ Erreur test upload: {e}")
        return False

async def main():
    """Fonction principale de test"""
    logger.info("🎬 RL PostFlow - Test d'intégration finale")
    logger.info("=" * 50)
    
    # Test 1: Infrastructure
    logger.info("\n1️⃣ Test infrastructure...")
    infra_ok = await test_pipeline_integration()
    
    if not infra_ok:
        logger.error("❌ Test infrastructure échoué")
        return 1
    
    # Test 2: Upload si fichier fourni
    if len(sys.argv) > 1:
        logger.info("\n2️⃣ Test upload...")
        file_path = sys.argv[1]
        upload_ok = await test_file_upload(file_path)
        
        if not upload_ok:
            logger.error("❌ Test upload échoué")
            return 1
    
    logger.info("\n✅ Tous les tests réussis !")
    logger.info("🚀 RL PostFlow prêt avec Cloudflare Tunnel")
    
    return 0

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
