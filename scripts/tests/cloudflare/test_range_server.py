#!/usr/bin/env python3
"""
Test avec serveur HTTP amélioré supportant les Range requests
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
from src.integrations.frameio.range_server import RangeFileServer
from src.integrations.frameio.production_upload import NgrokTunnelManager
from src.utils.lucidlink_utils import lucidlink_waiter, lucidlink_detector

async def test_range_server_upload(file_path: str):
    """Test d'upload avec serveur HTTP amélioré"""
    try:
        test_file = Path(file_path)
        if not test_file.exists():
            logger.error(f"❌ Fichier non trouvé: {file_path}")
            return False
        
        logger.info(f"🚀 Test avec serveur HTTP amélioré...")
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
        
        # Démarrer le serveur HTTP amélioré
        range_server = RangeFileServer(host="127.0.0.1", port=0)
        if not range_server.start():
            logger.error("❌ Impossible de démarrer le serveur HTTP")
            return False
        
        logger.info(f"✅ Serveur HTTP amélioré démarré sur port {range_server.actual_port}")
        
        # Démarrer ngrok
        ngrok_manager = NgrokTunnelManager(range_server.actual_port)
        if not await ngrok_manager.start():
            logger.error("❌ Impossible de démarrer ngrok")
            range_server.stop()
            return False
        
        logger.info(f"✅ Tunnel ngrok actif: {ngrok_manager.public_url}")
        
        # Exposer le fichier
        local_url = range_server.add_file(str(test_file))
        if not local_url:
            logger.error("❌ Impossible d'exposer le fichier")
            ngrok_manager.stop()
            range_server.stop()
            return False
        
        # Construire l'URL publique
        file_name = local_url.split('/')[-1]
        public_url = f"{ngrok_manager.public_url}/{file_name}"
        
        logger.info(f"🌐 URL publique: {public_url}")
        
        # Créer l'authentification
        auth = create_frameio_auth()
        
        # Créer les managers
        structure_manager = FrameIOStructureManager(auth)
        upload_manager = FrameIOUploadManager(auth)
        
        # Récupérer le projet
        projects = await structure_manager.get_projects()
        if not projects:
            logger.error("❌ Aucun projet trouvé")
            ngrok_manager.stop()
            range_server.stop()
            return False
        
        target_project = projects[0]
        logger.info(f"🎬 Projet cible: {target_project.name}")
        
        # Upload avec remote_upload
        logger.info("📤 Démarrage remote upload...")
        frameio_file = await upload_manager._create_file_remote_upload(
            str(test_file),
            target_project.root_folder_id,
            public_url
        )
        
        if frameio_file:
            logger.info("✅ Upload avec serveur amélioré réussi !")
            logger.info(f"🎬 Frame.io File ID: {frameio_file.id}")
            # Note: filesize peut ne pas être disponible immédiatement
            
            # Construire l'URL de visualisation
            view_url = f"https://app.frame.io/project/{target_project.id}/asset/{frameio_file.id}"
            logger.info(f"🔗 View URL: {view_url}")
            
            success = True
        else:
            logger.error("❌ Échec upload avec serveur amélioré")
            success = False
        
        # Cleanup
        ngrok_manager.stop()
        range_server.stop()
        
        return success
        
    except Exception as e:
        logger.error(f"❌ Erreur test serveur amélioré: {e}")
        return False

async def main():
    """Fonction principale"""
    if len(sys.argv) != 2:
        print("Usage: python test_range_server.py <fichier_lucidlink>")
        return 1
    
    file_path = sys.argv[1]
    success = await test_range_server_upload(file_path)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
