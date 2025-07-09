#!/usr/bin/env python3
"""
Test d'upload Frame.io avec tunnel Cloudflare.
Alternative robuste à ngrok et Serveo.
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
from src.integrations.frameio.cloudflare_manager import CloudflareManager
from src.utils.lucidlink_utils import lucidlink_waiter, lucidlink_detector

async def test_cloudflare_upload(file_path: str):
    """Test d'upload avec Cloudflare Tunnel"""
    try:
        test_file = Path(file_path)
        if not test_file.exists():
            logger.error(f"❌ Fichier non trouvé: {file_path}")
            return False
        
        logger.info(f"🚀 Test d'upload avec Cloudflare...")
        logger.info(f"📄 Fichier: {test_file}")
        logger.info(f"📏 Taille: {test_file.stat().st_size:,} bytes")
        
        # Vérifier et mettre en cache le fichier LucidLink
        if lucidlink_detector.is_lucidlink_file(test_file):
            logger.info("🔄 Fichier LucidLink détecté, vérification du cache...")
            cache_ok = await lucidlink_waiter.wait_for_complete_sync(test_file, max_wait=300)
            if not cache_ok:
                logger.error("❌ Échec mise en cache LucidLink")
                return False
            logger.info("✅ Fichier LucidLink en cache")
        
        # Démarrer le serveur HTTP
        http_server = RangeFileServer(host="127.0.0.1", port=0)
        if not http_server.start():
            logger.error("❌ Impossible de démarrer le serveur HTTP")
            return False
        
        logger.info(f"✅ Serveur HTTP démarré sur port {http_server.actual_port}")
        
        # Démarrer Cloudflare Tunnel
        cf_manager = CloudflareManager()
        tunnel_url = cf_manager.start_tunnel(http_server.actual_port, timeout=60)
        
        if not tunnel_url:
            logger.error("❌ Impossible de démarrer Cloudflare Tunnel")
            http_server.stop()
            return False
        
        logger.info(f"✅ Tunnel Cloudflare actif: {tunnel_url}")
        
        # Exposer le fichier
        local_url = http_server.add_file(str(test_file))
        if not local_url:
            logger.error("❌ Impossible d'exposer le fichier")
            cf_manager.stop_tunnel()
            http_server.stop()
            return False
        
        # Construire l'URL publique
        file_name = local_url.split('/')[-1]
        public_url = f"{tunnel_url}/{file_name}"
        
        logger.info(f"🌐 URL publique Cloudflare: {public_url}")
        
        # Test manuel de l'URL
        logger.info("� Test de l'URL Cloudflare...")
        try:
            import subprocess
            result = subprocess.run(['curl', '-I', public_url], capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                logger.info("✅ URL Cloudflare accessible")
                logger.debug(f"Response headers: {result.stdout}")
            else:
                logger.warning(f"⚠️ Problème avec URL Cloudflare: {result.stderr}")
        except Exception as e:
            logger.warning(f"⚠️ Erreur test URL: {e}")
        
        # Créer les managers Frame.io
        auth = create_frameio_auth()
        structure_manager = FrameIOStructureManager(auth)
        upload_manager = FrameIOUploadManager(auth)
        
        # Récupérer le projet
        projects = await structure_manager.get_projects()
        if not projects:
            logger.error("❌ Aucun projet trouvé")
            cf_manager.stop_tunnel()
            http_server.stop()
            return False
        
        target_project = projects[0]
        logger.info(f"🎬 Projet cible: {target_project.name}")
        
        # Upload avec remote_upload
        logger.info("📤 Démarrage remote upload avec Cloudflare...")
        frameio_file = await upload_manager._create_file_remote_upload(
            str(test_file),
            target_project.root_folder_id,
            public_url
        )
        
        if frameio_file:
            logger.info("✅ Upload avec Cloudflare initié avec succès !")
            logger.info(f"🎬 Frame.io File ID: {frameio_file.id}")
            
            # Construire l'URL de visualisation
            view_url = f"https://app.frame.io/project/{target_project.id}/asset/{frameio_file.id}"
            logger.info(f"🔗 View URL: {view_url}")
            
            # Garder le serveur ouvert pour Frame.io
            logger.info("⏳ Serveur reste ouvert pour téléchargement Frame.io...")
            logger.info("💡 Cloudflare robuste, patientez...")
            
            # Surveiller l'activité pendant 10 minutes
            wait_time = 600  # 10 minutes pour les gros fichiers
            logger.info(f"⏰ Surveillance pendant {wait_time} secondes...")
            
            # Vérifier l'état du fichier sur Frame.io périodiquement
            file_id = frameio_file.id
            
            for i in range(wait_time // 30):  # Check chaque 30 secondes
                await asyncio.sleep(30)
                remaining = wait_time - (i + 1) * 30
                
                # Vérifier que Cloudflare est toujours actif
                if not cf_manager.is_running():
                    logger.error("❌ Tunnel Cloudflare fermé prématurément")
                    break
                
                # Vérifier le statut du fichier sur Frame.io
                try:
                    # Utiliser le client Frame.io depuis l'auth
                    frameio_client = auth.client
                    file_info = await frameio_client.get_file(file_id)
                    if file_info and hasattr(file_info, 'file_size'):
                        current_size = getattr(file_info, 'file_size', 0)
                        expected_size = test_file.stat().st_size
                        
                        if current_size > 0:
                            percentage = (current_size / expected_size) * 100
                            logger.info(f"📊 Frame.io: {current_size:,} bytes ({percentage:.1f}%)")
                            
                            # Si le fichier est complètement téléchargé
                            if current_size >= expected_size:
                                logger.info("✅ Téléchargement Frame.io terminé !")
                                break
                        else:
                            logger.info("⏳ Frame.io: téléchargement en cours...")
                    else:
                        logger.info("⏳ Frame.io: statut indéterminé...")
                except Exception as e:
                    logger.warning(f"⚠️ Erreur vérification Frame.io: {e}")
                
                logger.info(f"⏳ Cloudflare actif - encore {remaining} secondes...")
            
            logger.info("✅ Période de surveillance terminée")
            success = True
        else:
            logger.error("❌ Échec upload avec Cloudflare")
            success = False
        
        # Cleanup
        logger.info("🛑 Arrêt des services...")
        cf_manager.stop_tunnel()
        http_server.stop()
        
        return success
        
    except Exception as e:
        logger.error(f"❌ Erreur test Cloudflare: {e}")
        return False

async def main():
    """Fonction principale"""
    if len(sys.argv) != 2:
        print("Usage: python test_cloudflare.py <fichier_lucidlink>")
        return 1
    
    file_path = sys.argv[1]
    success = await test_cloudflare_upload(file_path)
    
    return 0 if success else 1

if __name__ == "__main__":
    import sys
    sys.exit(asyncio.run(main()))
