#!/usr/bin/env python3
"""
Test complet Frame.io : Création de dossiers + Upload d'assets avec ngrok
Combine la création de structure hiérarchique avec l'upload de fichiers
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
from src.utils.nomenclature import get_nomenclature_manager

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class NgrokManager:
    """Gestionnaire simplifié pour ngrok"""
    
    def __init__(self, port: int):
        self.port = port
        self.process = None
        self.public_url = None
        
    async def start(self) -> bool:
        """Démarrer ngrok et récupérer l'URL publique"""
        try:
            # Vérifier ngrok
            result = subprocess.run(['which', 'ngrok'], capture_output=True, text=True)
            if result.returncode != 0:
                logger.error("❌ ngrok non trouvé")
                return False
            
            # Démarrer ngrok
            logger.info(f"🚀 Démarrage ngrok sur le port {self.port}...")
            self.process = subprocess.Popen(
                ['ngrok', 'http', str(self.port)],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            # Attendre et récupérer l'URL
            await asyncio.sleep(5)
            
            for attempt in range(5):
                try:
                    response = requests.get('http://localhost:4040/api/tunnels', timeout=10)
                    if response.status_code == 200:
                        tunnels = response.json()
                        for tunnel in tunnels.get('tunnels', []):
                            if tunnel.get('proto') == 'https':
                                self.public_url = tunnel['public_url']
                                logger.info(f"✅ Tunnel ngrok actif: {self.public_url}")
                                return True
                    
                    await asyncio.sleep(2)
                except Exception as e:
                    logger.warning(f"Tentative {attempt + 1}: {e}")
                    await asyncio.sleep(2)
            
            logger.error("❌ Impossible de récupérer l'URL ngrok")
            return False
            
        except Exception as e:
            logger.error(f"❌ Erreur démarrage ngrok: {e}")
            return False
    
    def stop(self):
        """Arrêter ngrok"""
        if self.process:
            self.process.terminate()
            self.process.wait()
            logger.info("🛑 Tunnel ngrok arrêté")

async def test_folder_creation_and_upload():
    """Test complet : création de dossiers + upload"""
    
    server = None
    ngrok = None
    
    try:
        logger.info("🧪 Test complet Frame.io: Dossiers + Upload")
        logger.info("=" * 60)
        
        # 1. Fichier de test
        test_file = Path("data/TEST_DEFAUT_VIDEO.mp4")
        if not test_file.exists():
            logger.error(f"❌ Fichier de test manquant: {test_file}")
            return False
        
        logger.info(f"📁 Fichier de test: {test_file} ({test_file.stat().st_size} bytes)")
        
        # 2. Authentification
        logger.info("🔑 Authentification Frame.io...")
        auth = FrameIOAuth()
        
        if not await auth.test_connection():
            logger.error("❌ Échec de l'authentification Frame.io")
            return False
        
        logger.info("✅ Authentification Frame.io OK")
        
        # 3. Récupérer le projet
        logger.info("📊 Récupération du projet...")
        structure_manager = FrameIOStructureManager(auth)
        
        projects = await structure_manager.get_projects()
        target_project = None
        for project in projects:
            if project.name == "UNDLM_DOCU":
                target_project = project
                break
        
        if not target_project:
            logger.error("❌ Projet UNDLM_DOCU non trouvé")
            return False
        
        logger.info(f"✅ Projet trouvé: {target_project.name}")
        logger.info(f"📂 Root folder ID: {target_project.root_folder_id}")
        
        # 4. Test avec nomenclature
        logger.info("🎬 Test avec nomenclature...")
        nomenclature_manager = get_nomenclature_manager()
        
        # Simuler un fichier avec nomenclature (format correct)
        test_filename = "UNDLM_00001_v001.mov"
        file_info = nomenclature_manager.parse_filename(test_filename)
        
        if not file_info.valid:
            logger.warning(f"⚠️ Fichier nomenclature invalide: {test_filename}")
            logger.info("📝 Utilisation de valeurs par défaut pour les tests...")
            
            # Utiliser des valeurs par défaut pour les tests
            scene_name = "TEST_SCENE_COMPLETE"
            shot_name = "S001"
        else:
            logger.info(f"✅ Fichier parsé: {file_info.project}_{file_info.shot}_v{file_info.version}")
            
            # Récupérer le nom du dossier Frame.io
            scene_name = nomenclature_manager.get_frameio_folder_name(file_info)
            shot_name = file_info.shot
        
        logger.info(f"📂 Scène: {scene_name}, Shot: {shot_name}")
        
        # 5. Créer la structure de dossiers
        logger.info("📁 Création de la structure de dossiers...")
        
        try:
            # Créer la structure SCENES > SCENE > SHOT
            shot_folder_id = await structure_manager.get_or_create_folder_path(
                scene_name,  # Nom de la scène
                shot_name,   # Nom du shot
                target_project.id
            )
            
            if not shot_folder_id:
                logger.error("❌ Impossible de créer la structure de dossiers")
                return False
            
            logger.info(f"✅ Structure créée - Shot folder ID: {shot_folder_id}")
            
        except Exception as e:
            logger.error(f"❌ Erreur création structure: {e}")
            return False
        
        # 6. Préparer l'upload avec ngrok
        logger.info("🌐 Préparation de l'upload avec ngrok...")
        
        # Démarrer le serveur HTTP
        server = PublicFileServer(host="127.0.0.1", port=0)
        if not server.start():
            logger.error("❌ Impossible de démarrer le serveur local")
            return False
        
        # Exposer le fichier
        local_url = server.add_file(str(test_file))
        if not local_url:
            logger.error("❌ Impossible d'exposer le fichier")
            return False
        
        logger.info(f"📂 Fichier exposé: {local_url}")
        
        # Démarrer ngrok
        ngrok = NgrokManager(server.actual_port)
        if not await ngrok.start():
            logger.error("❌ Impossible de démarrer ngrok")
            return False
        
        # Construire l'URL publique
        file_name = local_url.split('/')[-1]
        public_url = f"{ngrok.public_url}/{file_name}"
        logger.info(f"🌍 URL publique: {public_url}")
        
        # Vérifier l'accessibilité
        try:
            response = requests.head(public_url, timeout=10)
            if response.status_code != 200:
                logger.error(f"❌ URL publique non accessible: {response.status_code}")
                return False
            
            logger.info("✅ URL publique accessible")
        except Exception as e:
            logger.error(f"❌ Erreur test URL: {e}")
            return False
        
        # 7. Upload dans le dossier créé
        logger.info("📤 Upload du fichier dans le dossier créé...")
        
        upload_manager = FrameIOUploadManager(auth)
        
        try:
            # Upload dans le dossier shot spécifique
            result = await upload_manager._create_file_remote_upload(
                str(test_file),
                shot_folder_id,  # Utiliser le dossier shot créé
                public_url
            )
            
            if result:
                logger.info("=" * 60)
                logger.info("✅ UPLOAD RÉUSSI DANS LE DOSSIER CRÉÉ!")
                logger.info("=" * 60)
                logger.info(f"📁 File ID: {result.id}")
                logger.info(f"📁 Name: {result.name}")
                logger.info(f"📁 Status: {result.status}")
                logger.info(f"📁 Folder ID: {shot_folder_id}")
                logger.info(f"📁 Project ID: {result.project_id}")
                logger.info("=" * 60)
                
                # Attendre le traitement
                logger.info("⏳ Attente du traitement...")
                await asyncio.sleep(10)
                
                return True
            else:
                logger.error("❌ Upload échoué")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur upload: {e}")
            return False
        
    except Exception as e:
        logger.error(f"❌ Erreur générale: {e}")
        return False
    
    finally:
        # Nettoyage
        if ngrok:
            ngrok.stop()
        if server:
            server.stop()

async def main():
    """Fonction principale"""
    
    logger.info("🚀 Démarrage du test complet Frame.io")
    
    success = await test_folder_creation_and_upload()
    
    if success:
        logger.info("🎉 Test complet réussi!")
        logger.info("✅ Création de dossiers + Upload fonctionnels")
        logger.info("💡 Vérifiez dans Frame.io que le fichier est dans le bon dossier")
    else:
        logger.error("❌ Test complet échoué")
    
    return success

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
