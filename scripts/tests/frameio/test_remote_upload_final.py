#!/usr/bin/env python3
"""
Test Frame.io Remote Upload Final - Version de production
Test définitif de la solution remote_upload + ngrok
"""

import asyncio
import sys
import os
from pathlib import Path
import logging
import subprocess
import time
import json
import requests

# Ajouter le chemin du projet
sys.path.insert(0, str(Path(__file__).parent))

from src.integrations.frameio.auth import FrameIOAuth
from src.integrations.frameio.upload import FrameIOUploadManager
from src.integrations.frameio.public_server import PublicFileServer

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class NgrokTunnel:
    """Gestionnaire de tunnel ngrok pour exposer le serveur local"""
    
    def __init__(self, port: int):
        self.port = port
        self.process = None
        self.public_url = None
        
    def start(self) -> bool:
        """Démarrer le tunnel ngrok"""
        try:
            # Vérifier que ngrok est installé
            result = subprocess.run(['which', 'ngrok'], capture_output=True, text=True)
            if result.returncode != 0:
                logger.error("❌ ngrok non trouvé. Installez-le avec: brew install ngrok")
                return False
            
            # Vérifier l'authentification ngrok
            auth_check = subprocess.run(['ngrok', 'config', 'check'], capture_output=True, text=True)
            if auth_check.returncode != 0:
                logger.error("❌ ngrok non configuré.")
                return False
            
            # Démarrer ngrok
            logger.info(f"🚀 Démarrage ngrok sur le port {self.port}...")
            self.process = subprocess.Popen(
                ['ngrok', 'http', str(self.port), '--log=stdout'],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Attendre que ngrok soit prêt
            time.sleep(5)
            
            # Récupérer l'URL publique
            max_attempts = 10
            for attempt in range(max_attempts):
                try:
                    api_response = requests.get('http://localhost:4040/api/tunnels', timeout=10)
                    if api_response.status_code == 200:
                        tunnels = api_response.json()
                        for tunnel in tunnels.get('tunnels', []):
                            if tunnel.get('proto') == 'https':
                                self.public_url = tunnel['public_url']
                                logger.info(f"✅ Tunnel ngrok actif: {self.public_url}")
                                return True
                    
                    logger.info(f"⏳ Tentative {attempt + 1}/{max_attempts} - Attente de ngrok...")
                    time.sleep(2)
                    
                except Exception as e:
                    if attempt == max_attempts - 1:
                        logger.error(f"❌ Erreur API ngrok après {max_attempts} tentatives: {e}")
                        return False
                    time.sleep(2)
                
            logger.error("❌ Impossible de récupérer l'URL publique ngrok")
            return False
                
        except Exception as e:
            logger.error(f"❌ Erreur démarrage ngrok: {e}")
            return False
    
    def stop(self):
        """Arrêter le tunnel ngrok"""
        if self.process:
            self.process.terminate()
            self.process.wait()
            logger.info("🛑 Tunnel ngrok arrêté")

async def test_remote_upload_final():
    """Test final de l'upload remote avec ngrok"""
    
    server = None
    ngrok = None
    
    try:
        # 1. Configuration
        config_path = Path("config/integrations.json")
        if not config_path.exists():
            logger.error("❌ Fichier de configuration manquant: config/integrations.json")
            return False
        
        # 2. Fichier de test
        test_file = Path("data/TEST_DEFAUT_VIDEO.mp4")
        if not test_file.exists():
            logger.error(f"❌ Fichier de test manquant: {test_file}")
            return False
        
        logger.info(f"📁 Fichier de test: {test_file} ({test_file.stat().st_size} bytes)")
        
        # 3. Démarrer le serveur local
        logger.info("🌐 Démarrage du serveur local...")
        server = PublicFileServer(host="127.0.0.1", port=0)
        if not server.start():
            logger.error("❌ Impossible de démarrer le serveur local")
            return False
        
        # 4. Exposer le fichier
        public_file_path = server.add_file(str(test_file))
        if not public_file_path:
            logger.error("❌ Impossible d'exposer le fichier")
            return False
        
        logger.info(f"📂 Fichier exposé localement: {public_file_path}")
        
        # 5. Démarrer ngrok
        logger.info("🚀 Démarrage du tunnel ngrok...")
        ngrok = NgrokTunnel(server.actual_port)
        if not ngrok.start():
            logger.error("❌ Impossible de démarrer ngrok")
            return False
        
        # 6. Construire l'URL publique du fichier
        local_url_parts = public_file_path.split('/')
        file_path_part = local_url_parts[-1]
        
        public_url = f"{ngrok.public_url}/{file_path_part}"
        logger.info(f"🌍 URL publique: {public_url}")
        
        # 7. Vérifier que l'URL est accessible
        try:
            response = requests.head(public_url, timeout=10)
            if response.status_code == 200:
                logger.info("✅ URL publique accessible")
                logger.info(f"📊 Content-Type: {response.headers.get('Content-Type')}")
                logger.info(f"📊 Content-Length: {response.headers.get('Content-Length')}")
            else:
                logger.error(f"❌ URL publique inaccessible: {response.status_code}")
                return False
        except Exception as e:
            logger.error(f"❌ Erreur test URL publique: {e}")
            return False
        
        # 8. Initialiser l'auth Frame.io
        logger.info("🔑 Initialisation de l'authentification Frame.io...")
        auth = FrameIOAuth(Path(__file__).parent)
        
        # Vérifier l'authentification
        if not await auth.test_connection():
            logger.error("❌ Échec de l'authentification Frame.io")
            return False
        
        logger.info("✅ Authentification Frame.io OK")
        
        # 9. Initialiser l'upload manager
        logger.info("📤 Initialisation de l'upload manager...")
        upload_manager = FrameIOUploadManager(auth)
        
        # 10. Test de l'upload remote avec URL publique
        logger.info("🚀 Démarrage du test remote upload avec ngrok...")
        
        result = await upload_manager._create_file_remote_upload(
            str(test_file),
            "28e4ea24-3405-4383-ae5d-60a606bbd0a8",  # ID du dossier TEST_SCENE
            public_url
        )
        
        if result:
            logger.info("🎉 SUCCÈS COMPLET!")
            logger.info("="*60)
            logger.info("✅ La solution remote_upload + ngrok fonctionne parfaitement!")
            logger.info("")
            logger.info("📊 Résultats:")
            logger.info(f"   - File ID: {result.id}")
            logger.info(f"   - Name: {result.name}")
            logger.info(f"   - Status: {result.status}")
            logger.info(f"   - Project ID: {result.project_id}")
            logger.info(f"   - URL publique utilisée: {public_url}")
            logger.info("")
            logger.info("🔗 Vérifiez votre projet Frame.io pour voir le fichier!")
            logger.info("="*60)
            
            # Attendre un peu pour laisser Frame.io traiter
            logger.info("⏳ Attente de 30 secondes pour le traitement Frame.io...")
            await asyncio.sleep(30)
            
            return True
        else:
            logger.error("❌ Upload remote échoué")
            return False
            
    except Exception as e:
        logger.error(f"❌ Erreur dans le test: {e}")
        return False
    
    finally:
        # Nettoyage
        if ngrok:
            ngrok.stop()
        if server:
            server.stop()

async def main():
    """Fonction principale"""
    
    logger.info("🧪 Test Frame.io Remote Upload - Version finale")
    logger.info("=" * 60)
    
    # Vérifier la configuration ngrok
    ngrok_check = subprocess.run(['ngrok', 'config', 'check'], capture_output=True, text=True)
    if ngrok_check.returncode != 0:
        logger.error("❌ ngrok non configuré. Veuillez d'abord:")
        logger.error("   1. Créer un compte sur https://ngrok.com")
        logger.error("   2. Récupérer votre auth token")
        logger.error("   3. Exécuter: ngrok config add-authtoken <your-token>")
        return False
    
    success = await test_remote_upload_final()
    
    if success:
        logger.info("")
        logger.info("🎉 MISSION ACCOMPLIE!")
        logger.info("✅ La solution Frame.io remote_upload est opérationnelle")
        logger.info("✅ Les fichiers locaux peuvent être uploadés via ngrok")
        logger.info("✅ Le pipeline PostFlow peut maintenant utiliser Frame.io")
        logger.info("")
        logger.info("📋 Prochaines étapes:")
        logger.info("   1. Intégrer cette solution dans le pipeline principal")
        logger.info("   2. Configurer les notifications Discord")
        logger.info("   3. Tester avec de vrais fichiers de production")
        logger.info("")
    else:
        logger.error("❌ Test échoué")
    
    return success

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
