#!/usr/bin/env python3
"""
🧪 Test d'upload LucidLink vers Frame.io
======================================

Test d'upload avec détection LucidLink améliorée
"""

import asyncio
import logging
import sys
import time
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
from src.integrations.frameio.production_upload import FrameIOProductionUploader
from src.integrations.frameio.public_server import PublicFileServer
from src.integrations.frameio.auth import FrameIOAuth

async def test_lucidlink_upload():
    """Test d'upload avec détection LucidLink"""
    logger.info("🔍 Test d'upload LucidLink vers Frame.io...")
    
    # Chercher un fichier vidéo LucidLink
    potential_files = [
        Path.home() / "LucidLink" / "*.mp4",
        Path("/Volumes/LucidLink") / "*.mp4",
        Path("/mnt/lucidlink") / "*.mp4"
    ]
    
    test_file = None
    for pattern in potential_files:
        parent = pattern.parent
        if parent.exists():
            for file_path in parent.glob("*.mp4"):
                if file_path.is_file() and file_path.stat().st_size > 1024*1024:  # > 1MB
                    test_file = file_path
                    break
            if test_file:
                break
    
    if not test_file:
        logger.warning("⚠️ Aucun fichier LucidLink trouvé, test avec fichier local")
        # Utiliser le fichier de test par défaut
        test_file = Path("data/TEST_DEFAUT_VIDEO.mp4")
        if not test_file.exists():
            logger.error("❌ Aucun fichier de test disponible")
            return False
    
    logger.info(f"📄 Fichier de test: {test_file}")
    logger.info(f"📏 Taille: {test_file.stat().st_size:,} bytes")
    
    # Vérifier si c'est un fichier LucidLink
    is_lucidlink = lucidlink_detector.is_lucidlink_file(test_file)
    logger.info(f"🔍 LucidLink détecté: {is_lucidlink}")
    
    if is_lucidlink:
        status = lucidlink_detector.get_lucidlink_file_status(test_file)
        logger.info(f"📊 Statut LucidLink: {status}")
    
    # Test d'attente de synchronisation
    logger.info("⏳ Attente de synchronisation complète...")
    start_time = time.time()
    
    is_ready = await lucidlink_waiter.wait_for_complete_sync(
        test_file, 
        max_wait=300,  # 5 minutes
        check_interval=5
    )
    
    sync_time = time.time() - start_time
    logger.info(f"⏱️ Temps de synchronisation: {sync_time:.1f}s")
    
    if not is_ready:
        logger.error("❌ Fichier non prêt pour l'upload")
        return False
    
    logger.info("✅ Fichier prêt pour l'upload")
    
    # Test d'upload vers Frame.io
    logger.info("🔄 Démarrage de l'upload vers Frame.io...")
    
    try:
        # Initialiser le serveur public
        public_server = PublicFileServer()
        await public_server.start()
        
        # Initialiser l'authentification Frame.io
        auth = FrameIOAuth()
        
        # Initialiser le gestionnaire d'upload
        upload_manager = FrameIOProductionUploader(auth)
        
        # Effectuer l'upload
        result = await upload_manager.upload_file_with_structure(test_file)
        
        if result and result.get('success'):
            logger.info("✅ Upload réussi !")
            logger.info(f"🎬 Frame.io URL: {result.get('frameio_url', 'Non disponible')}")
            
            # Vérifier la taille sur Frame.io
            if 'file_size' in result:
                local_size = test_file.stat().st_size
                remote_size = result['file_size']
                logger.info(f"📏 Taille locale: {local_size:,} bytes")
                logger.info(f"📏 Taille Frame.io: {remote_size:,} bytes")
                
                if local_size == remote_size:
                    logger.info("✅ Tailles identiques - Upload complet")
                else:
                    logger.warning(f"⚠️ Tailles différentes - Upload potentiellement incomplet")
            
            return True
        else:
            logger.error("❌ Upload échoué")
            return False
            
    except Exception as e:
        logger.error(f"❌ Erreur lors de l'upload: {e}")
        return False
    
    finally:
        # Nettoyer
        if 'public_server' in locals():
            await public_server.stop()

async def main():
    """Fonction principale du test"""
    logger.info("🚀 Test d'upload LucidLink vers Frame.io...")
    
    try:
        success = await test_lucidlink_upload()
        
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
