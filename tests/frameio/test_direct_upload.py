#!/usr/bin/env python3
"""
Test d'upload direct sans ngrok pour diagnostiquer le problème
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

from src.integrations.frameio.auth import create_frameio_auth
from src.integrations.frameio.upload import FrameIOUploadManager
from src.integrations.frameio.structure import FrameIOStructureManager
from src.utils.lucidlink_utils import lucidlink_waiter, lucidlink_detector

async def test_direct_upload(file_path: str):
    """Test d'upload direct multipart (sans ngrok)"""
    try:
        test_file = Path(file_path)
        if not test_file.exists():
            logger.error(f"❌ Fichier non trouvé: {file_path}")
            return False
        
        logger.info(f"🚀 Test d'upload direct multipart...")
        logger.info(f"📄 Fichier: {test_file}")
        logger.info(f"📏 Taille: {test_file.stat().st_size:,} bytes")
        
        # Vérifier si c'est un fichier LucidLink et le mettre en cache
        if lucidlink_detector.is_lucidlink_file(test_file):
            logger.info("🔄 Fichier LucidLink détecté, vérification du cache...")
            
            # Attendre la synchronisation complète
            cache_ok = await lucidlink_waiter.wait_for_complete_sync(test_file, max_wait=300)
            if not cache_ok:
                logger.error("❌ Échec mise en cache LucidLink")
                return False
            
            logger.info("✅ Fichier LucidLink en cache")
        
        # Créer l'authentification
        auth = create_frameio_auth()
        
        # Vérifier le token
        if not auth.is_token_valid():
            logger.error("❌ Token Frame.io invalide")
            return False
        
        # Créer les managers
        structure_manager = FrameIOStructureManager(auth)
        upload_manager = FrameIOUploadManager(auth)
        
        # Récupérer le projet
        projects = await structure_manager.get_projects()
        if not projects:
            logger.error("❌ Aucun projet trouvé")
            return False
        
        target_project = projects[0]
        logger.info(f"🎬 Projet cible: {target_project.name}")
        
        # Upload direct multipart
        logger.info("📤 Démarrage upload direct multipart...")
        frameio_file = await upload_manager.upload_file_to_folder(
            str(test_file),
            target_project.root_folder_id
        )
        
        if frameio_file:
            logger.info("✅ Upload direct réussi !")
            logger.info(f"🎬 Frame.io File ID: {frameio_file.id}")
            logger.info(f"📏 Taille uploadée: {frameio_file.filesize:,} bytes")
            
            # Construire l'URL de visualisation
            view_url = f"https://app.frame.io/project/{target_project.id}/asset/{frameio_file.id}"
            logger.info(f"🔗 View URL: {view_url}")
            
            return True
        else:
            logger.error("❌ Échec upload direct")
            return False
        
    except Exception as e:
        logger.error(f"❌ Erreur test direct: {e}")
        return False

async def main():
    """Fonction principale"""
    if len(sys.argv) != 2:
        print("Usage: python test_direct_upload.py <fichier_lucidlink>")
        return 1
    
    file_path = sys.argv[1]
    success = await test_direct_upload(file_path)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
