#!/usr/bin/env python3
"""
Test simple Frame.io : Upload direct dans le root folder avec ngrok
"""

import asyncio
import sys
import logging
import subprocess
import time
import requests
from pathlib import Path

# Ajouter le chemin du projet
sys.path.insert(0, str(Path(__file__).parent))

from src.integrations.frameio.auth import FrameIOAuth
from src.integrations.frameio.structure import FrameIOStructureManager
from src.integrations.frameio.upload import FrameIOUploadManager
from src.integrations.frameio.public_server import PublicFileServer

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SimpleNgrok:
    """Gestionnaire ngrok simplifié"""
    
    def __init__(self, port: int):
        self.port = port
        self.process = None
        self.public_url = None
        
    async def start(self) -> bool:
        """Démarrer ngrok"""
        try:
            logger.info(f"🚀 Démarrage ngrok sur le port {self.port}...")
            self.process = subprocess.Popen(
                ['ngrok', 'http', str(self.port)],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            await asyncio.sleep(5)
            
            for _ in range(5):
                try:
                    response = requests.get('http://localhost:4040/api/tunnels', timeout=10)
                    if response.status_code == 200:
                        tunnels = response.json()
                        for tunnel in tunnels.get('tunnels', []):
                            if tunnel.get('proto') == 'https':
                                self.public_url = tunnel['public_url']
                                logger.info(f"✅ Tunnel actif: {self.public_url}")
                                return True
                    await asyncio.sleep(2)
                except:
                    await asyncio.sleep(2)
            
            return False
        except Exception as e:
            logger.error(f"❌ Erreur ngrok: {e}")
            return False
    
    def stop(self):
        if self.process:
            self.process.terminate()
            self.process.wait()

async def test_simple_upload():
    """Test simple d'upload dans le root folder"""
    
    server = None
    ngrok = None
    
    try:
        logger.info("🧪 Test simple Frame.io: Upload direct")
        logger.info("=" * 50)
        
        # 1. Fichier de test
        test_file = Path("data/TEST_DEFAUT_VIDEO.mp4")
        if not test_file.exists():
            logger.error(f"❌ Fichier manquant: {test_file}")
            return False
        
        logger.info(f"📁 Fichier: {test_file} ({test_file.stat().st_size} bytes)")
        
        # 2. Auth Frame.io
        auth = FrameIOAuth()
        if not await auth.test_connection():
            logger.error("❌ Auth échouée")
            return False
        
        logger.info("✅ Auth OK")
        
        # 3. Projet
        structure_manager = FrameIOStructureManager(auth)
        projects = await structure_manager.get_projects()
        
        target_project = None
        for project in projects:
            if project.name == "UNDLM_DOCU":
                target_project = project
                break
        
        if not target_project:
            logger.error("❌ Projet non trouvé")
            return False
        
        logger.info(f"✅ Projet: {target_project.name}")
        logger.info(f"📂 Root folder: {target_project.root_folder_id}")
        
        # 4. Créer un dossier simple directement
        logger.info("📁 Création d'un dossier simple...")
        
        try:
            test_folder = await structure_manager.create_folder(
                "TEST_SIMPLE_UPLOAD", 
                target_project.root_folder_id
            )
            
            if test_folder:
                folder_id = test_folder.id
                logger.info(f"✅ Dossier créé: {test_folder.name} (ID: {folder_id})")
            else:
                # Si la création échoue, utiliser le root folder
                logger.info("⚠️ Création échouée, utilisation du root folder")
                folder_id = target_project.root_folder_id
                
        except Exception as e:
            logger.warning(f"⚠️ Erreur création dossier: {e}")
            logger.info("📂 Utilisation du root folder directement")
            folder_id = target_project.root_folder_id
        
        # 5. Serveur HTTP + ngrok
        logger.info("🌐 Préparation ngrok...")
        
        server = PublicFileServer(host="127.0.0.1", port=0)
        if not server.start():
            logger.error("❌ Serveur HTTP échoué")
            return False
        
        local_url = server.add_file(str(test_file))
        logger.info(f"📂 Fichier exposé: {local_url}")
        
        ngrok = SimpleNgrok(server.actual_port)
        if not await ngrok.start():
            logger.error("❌ Ngrok échoué")
            return False
        
        file_name = local_url.split('/')[-1]
        public_url = f"{ngrok.public_url}/{file_name}"
        logger.info(f"🌍 URL publique: {public_url}")
        
        # Test accessibilité
        try:
            response = requests.head(public_url, timeout=10)
            if response.status_code != 200:
                logger.error(f"❌ URL non accessible: {response.status_code}")
                return False
            logger.info("✅ URL accessible")
        except Exception as e:
            logger.error(f"❌ Test URL: {e}")
            return False
        
        # 6. Upload
        logger.info("📤 Upload Frame.io...")
        
        upload_manager = FrameIOUploadManager(auth)
        
        result = await upload_manager._create_file_remote_upload(
            str(test_file),
            folder_id,
            public_url
        )
        
        if result:
            logger.info("=" * 50)
            logger.info("✅ UPLOAD RÉUSSI!")
            logger.info("=" * 50)
            logger.info(f"📁 File ID: {result.id}")
            logger.info(f"📁 Name: {result.name}")
            logger.info(f"📁 Status: {result.status}")
            logger.info(f"📁 Folder ID: {folder_id}")
            logger.info(f"📁 Project ID: {result.project_id}")
            logger.info("=" * 50)
            
            # Attendre traitement
            logger.info("⏳ Attente traitement (10s)...")
            await asyncio.sleep(10)
            
            return True
        else:
            logger.error("❌ Upload échoué")
            return False
        
    except Exception as e:
        logger.error(f"❌ Erreur: {e}")
        return False
    
    finally:
        if ngrok:
            ngrok.stop()
        if server:
            server.stop()

async def main():
    success = await test_simple_upload()
    
    if success:
        logger.info("🎉 Test simple réussi!")
        logger.info("✅ Upload Frame.io + ngrok opérationnel")
    else:
        logger.error("❌ Test simple échoué")
    
    return success

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
