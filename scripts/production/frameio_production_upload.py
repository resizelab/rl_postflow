#!/usr/bin/env python3
"""
RL PostFlow - Solution d'Upload Frame.io Production
Intégration finale de la solution remote_upload + ngrok dans le pipeline principal
"""

import asyncio
import sys
import os
from pathlib import Path
import logging
import subprocess
import time
import requests
from typing import Optional, Dict, Any

# Ajouter le chemin du projet
sys.path.insert(0, str(Path(__file__).parent))

from src.integrations.frameio.auth import FrameIOAuth
from src.integrations.frameio.upload import FrameIOUploadManager
from src.integrations.frameio.public_server import PublicFileServer
from src.utils.nomenclature import NomenclatureManager

logger = logging.getLogger(__name__)

class ProductionFrameIOUploader:
    """Gestionnaire d'upload Frame.io pour la production avec ngrok"""
    
    def __init__(self, config_path: Optional[Path] = None):
        self.config_path = config_path or Path("config/integrations.json")
        self.auth = None
        self.upload_manager = None
        self.nomenclature = NomenclatureManager()
        self.ngrok_process = None
        self.current_server = None
        
    async def initialize(self) -> bool:
        """Initialiser l'authentification et l'upload manager"""
        try:
            self.auth = FrameIOAuth(Path(__file__).parent)
            if not await self.auth.test_connection():
                logger.error("❌ Échec authentification Frame.io")
                return False
            
            self.upload_manager = FrameIOUploadManager(self.auth)
            logger.info("✅ Frame.io initialisé")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur initialisation: {e}")
            return False
    
    def _check_ngrok_available(self) -> bool:
        """Vérifier si ngrok est disponible et configuré"""
        try:
            # Vérifier installation
            result = subprocess.run(['which', 'ngrok'], capture_output=True, text=True)
            if result.returncode != 0:
                logger.warning("⚠️ ngrok non installé - utilisez: brew install ngrok")
                return False
            
            # Vérifier configuration
            auth_check = subprocess.run(['ngrok', 'config', 'check'], capture_output=True, text=True)
            if auth_check.returncode != 0:
                logger.warning("⚠️ ngrok non configuré - configurez avec: ngrok config add-authtoken <token>")
                return False
            
            return True
            
        except Exception as e:
            logger.warning(f"⚠️ Erreur vérification ngrok: {e}")
            return False
    
    def _start_ngrok_tunnel(self, port: int) -> Optional[str]:
        """Démarrer un tunnel ngrok et retourner l'URL publique"""
        try:
            # Démarrer ngrok
            self.ngrok_process = subprocess.Popen(
                ['ngrok', 'http', str(port), '--log=stdout'],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Attendre que ngrok soit prêt
            time.sleep(5)
            
            # Récupérer l'URL publique
            for attempt in range(10):
                try:
                    api_response = requests.get('http://localhost:4040/api/tunnels', timeout=10)
                    if api_response.status_code == 200:
                        tunnels = api_response.json()
                        for tunnel in tunnels.get('tunnels', []):
                            if tunnel.get('proto') == 'https':
                                public_url = tunnel['public_url']
                                logger.info(f"✅ Tunnel ngrok: {public_url}")
                                return public_url
                    
                    time.sleep(2)
                except:
                    time.sleep(2)
            
            logger.error("❌ Impossible d'obtenir l'URL ngrok")
            return None
            
        except Exception as e:
            logger.error(f"❌ Erreur ngrok: {e}")
            return None
    
    def _stop_ngrok(self):
        """Arrêter le tunnel ngrok"""
        if self.ngrok_process:
            self.ngrok_process.terminate()
            self.ngrok_process.wait()
            self.ngrok_process = None
    
    async def upload_file_to_frameio(self, 
                                   file_path: str, 
                                   scene_name: str, 
                                   shot_id: str,
                                   metadata: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        """
        Upload un fichier vers Frame.io en utilisant remote_upload + ngrok
        
        Args:
            file_path: Chemin vers le fichier local
            scene_name: Nom de la scène
            shot_id: ID du plan  
            metadata: Métadonnées optionnelles
            
        Returns:
            Dictionnaire avec les infos du fichier uploadé ou None si erreur
        """
        server = None
        ngrok_url = None
        
        try:
            file_path_obj = Path(file_path)
            if not file_path_obj.exists():
                logger.error(f"❌ Fichier non trouvé: {file_path_obj}")
                return None
            
            logger.info(f"🚀 Upload Frame.io: {file_path_obj.name}")
            
            # 1. Vérifier si ngrok est disponible
            if not self._check_ngrok_available():
                logger.error("❌ ngrok requis pour l'upload - configurez ngrok d'abord")
                return None
            
            # 2. Démarrer le serveur local
            server = PublicFileServer(host="127.0.0.1", port=0)
            if not server.start():
                logger.error("❌ Impossible de démarrer le serveur local")
                return None
            
            # 3. Exposer le fichier
            local_url = server.add_file(str(file_path_obj))
            if not local_url:
                logger.error("❌ Impossible d'exposer le fichier")
                return None
            
            # 4. Démarrer ngrok
            ngrok_url = self._start_ngrok_tunnel(server.actual_port)
            if not ngrok_url:
                logger.error("❌ Impossible de créer le tunnel ngrok")
                return None
            
            # 5. Construire l'URL publique
            file_path_part = local_url.split('/')[-1]
            public_url = f"{ngrok_url}/{file_path_part}"
            
            logger.info(f"🌍 URL publique: {public_url}")
            
            # 6. Vérifier accessibilité
            try:
                response = requests.head(public_url, timeout=10)
                if response.status_code != 200:
                    logger.error(f"❌ URL inaccessible: {response.status_code}")
                    return None
            except Exception as e:
                logger.error(f"❌ Erreur test URL: {e}")
                return None
            
            # 7. Trouver/créer le dossier de la scène
            scene_folder = await self.upload_manager.structure_manager.find_or_create_scene_folder(
                scene_name,
                self.upload_manager.structure_manager.root_folder_id
            )
            
            if not scene_folder:
                logger.error(f"❌ Impossible de créer le dossier {scene_name}")
                return None
            
            # 8. Initier l'upload remote
            result = await self.upload_manager._create_file_remote_upload(
                str(file_path_obj),
                scene_folder.id,
                public_url
            )
            
            if not result:
                logger.error("❌ Échec upload remote")
                return None
            
            # 9. Attendre un peu pour que Frame.io télécharge
            await asyncio.sleep(10)
            
            # 10. Retourner les informations
            upload_result = {
                'file_id': result.id,
                'name': result.name,
                'status': result.status,
                'folder_id': scene_folder.id,
                'scene_name': scene_name,
                'shot_id': shot_id,
                'project_id': result.project_id,
                'public_url': public_url,
                'local_path': str(file_path_obj),
                'upload_method': 'remote_upload_ngrok',
                'metadata': metadata or {}
            }
            
            logger.info(f"✅ Upload terminé: {result.name} (ID: {result.id})")
            return upload_result
            
        except Exception as e:
            logger.error(f"❌ Erreur upload: {e}")
            return None
        
        finally:
            # Nettoyage
            self._stop_ngrok()
            if server:
                server.stop()
    
    async def upload_from_nomenclature(self, file_path: str) -> Optional[Dict[str, Any]]:
        """
        Upload un fichier en analysant sa nomenclature automatiquement
        
        Args:
            file_path: Chemin vers le fichier
            
        Returns:
            Résultat de l'upload ou None si erreur
        """
        try:
            # Analyser la nomenclature
            file_info = self.nomenclature.parse_filename(Path(file_path).name)
            if not file_info:
                logger.error(f"❌ Nomenclature invalide: {Path(file_path).name}")
                return None
            
            # Extraire les informations
            scene_name = file_info.get('scene_name', 'UNKNOWN_SCENE')
            shot_id = file_info.get('shot_id', 'UNKNOWN_SHOT')
            
            metadata = {
                'description': f"Upload automatique - {shot_id}",
                'tags': [shot_id, scene_name, 'auto_upload'],
                'nomenclature_info': file_info
            }
            
            logger.info(f"📋 Nomenclature détectée: {shot_id} - {scene_name}")
            
            # Upload
            return await self.upload_file_to_frameio(
                file_path, scene_name, shot_id, metadata
            )
            
        except Exception as e:
            logger.error(f"❌ Erreur upload nomenclature: {e}")
            return None

# Fonction utilitaire pour usage simple
async def upload_file_simple(file_path: str) -> bool:
    """Fonction simple pour uploader un fichier"""
    uploader = ProductionFrameIOUploader()
    
    if not await uploader.initialize():
        return False
    
    result = await uploader.upload_from_nomenclature(file_path)
    return result is not None

# Test rapide
async def test_production_upload():
    """Test de la solution de production"""
    test_file = "data/TEST_DEFAUT_VIDEO.mp4"
    
    if not Path(test_file).exists():
        logger.error(f"❌ Fichier de test manquant: {test_file}")
        return False
    
    uploader = ProductionFrameIOUploader()
    
    if not await uploader.initialize():
        return False
    
    result = await uploader.upload_file_to_frameio(
        test_file,
        "TEST_PRODUCTION",
        "TEST_PROD_001"
    )
    
    if result:
        logger.info("🎉 Test production réussi!")
        return True
    else:
        logger.error("❌ Test production échoué")
        return False

if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    success = asyncio.run(test_production_upload())
    sys.exit(0 if success else 1)
