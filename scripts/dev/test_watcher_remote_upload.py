#!/usr/bin/env python3
"""
T        # Initialiser les composants Frame.io
        self.auth = FrameIOOAuthAuth(self.config)
        self.structure_manager = FrameIOStructureManager(self.auth)
        self.upload_manager = FrameIOUploadManager(self.auth)du watcher LucidLink avec remote_upload Frame.io v4
Pour éviter les problèmes de signature S3, utilise le remote_upload avec URL publique
"""

import os
import sys
import asyncio
import tempfile
import json
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.frameio.oauth_auth import FrameIOOAuthAuth
from src.integrations.frameio.upload import FrameIOUploadManager
from src.integrations.frameio.structure import FrameIOStructureManager

class WatcherRemoteUploadTester:
    """Testeur pour le workflow watcher avec remote_upload"""
    
    def __init__(self):
        self.config_path = Path(__file__).parent.parent / "config" / "integrations.json"
        self.config = self._load_config()
        
        # Initialiser les composants Frame.io
        self.auth = FrameIOOAuthAuth(self.config)
        self.structure_manager = FrameIOStructureManager(self.auth)
        self.upload_manager = FrameIOUploadManager(self.auth)
    
    def _load_config(self):
        """Charger la configuration"""
        try:
            with open(self.config_path, 'r') as f:
                config = json.load(f)
                return config
        except Exception as e:
            print(f"❌ Erreur chargement config: {e}")
            return {}
    
    async def test_create_temp_public_file(self, file_path: str) -> str:
        """
        Simule la création d'une URL publique temporaire
        En production, ceci devrait utiliser un service cloud (S3, etc.)
        Pour les tests, on utilise une URL publique connue
        """
        # Pour les tests, utilisons une petite vidéo d'exemple publique
        test_urls = [
            "https://upload.wikimedia.org/wikipedia/commons/transcoded/b/b3/Big_Buck_Bunny_Trailer_1080p.ogv/Big_Buck_Bunny_Trailer_1080p.ogv.360p.vp9.webm",
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        ]
        
        # Pour le test, on prend la première URL (qui fonctionne)
        public_url = test_urls[0]
        print(f"📡 Utilisation URL publique de test: {public_url}")
        return public_url
    
    async def test_watcher_remote_upload(self):
        """
        Test du workflow complet watcher avec remote_upload
        """
        try:
            print("🧪 === TEST WATCHER REMOTE UPLOAD ===")
            
            # 1. Simuler un fichier détecté par le watcher
            fake_file_path = "/path/to/UNDLM_00413_v002.mov"  # Fichier simulé
            shot_id = "UNDLM_00413"
            scene_name = "TEST_WATCHER_REMOTE"
            version = "v002"
            
            # 2. Récupérer les IDs depuis la config
            frameio_config = self.config.get('frameio', {})
            project_id = frameio_config.get('project_id')
            workspace_id = frameio_config.get('workspace_id')
            
            if not project_id or not workspace_id:
                print("❌ project_id ou workspace_id manquant dans la config")
                return False
            
            print(f"📁 Simulation upload: {shot_id} vers scène '{scene_name}'")
            print(f"📋 Projet: {project_id}, Workspace: {workspace_id}")
            
            # 3. Créer une URL publique temporaire (simulation)
            public_url = await self.test_create_temp_public_file(fake_file_path)
            
            # 4. Tester le remote_upload
            metadata = {
                "description": f"Upload automatique watcher {shot_id}",
                "tags": [shot_id, scene_name, version, "watcher_test"]
            }
            
            print(f"🚀 Début remote upload...")
            result = await self.upload_manager.remote_upload_file(
                shot_id=shot_id,
                file_path=fake_file_path,  # Le fichier n'existe pas mais on utilise l'URL publique
                scene_name=scene_name,
                project_id=project_id,
                workspace_id=workspace_id,
                metadata=metadata,
                public_url=public_url
            )
            
            if result:
                print(f"✅ Upload réussi!")
                print(f"   File ID: {result.id}")
                print(f"   Nom: {result.name}")
                print(f"   Statut: {result.status}")
                print(f"   Taille: {result.size}")
                
                # 5. Vérifier le statut après quelques secondes
                print(f"⏳ Vérification du statut dans 10 secondes...")
                await asyncio.sleep(10)
                
                final_status = await self.upload_manager._check_file_status(result.id, workspace_id)
                if final_status:
                    print(f"📊 Statut final: {final_status}")
                
                # 6. Simuler la notification Discord (comme dans le vrai watcher)
                self._simulate_discord_notification(shot_id, version, scene_name, result.id)
                
                return True
            else:
                print(f"❌ Échec de l'upload")
                return False
                
        except Exception as e:
            print(f"❌ Erreur durant le test: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def _simulate_discord_notification(self, shot_id: str, version: str, scene_name: str, file_id: str):
        """Simule l'envoi d'une notification Discord"""
        print(f"📢 NOTIFICATION DISCORD (simulation)")
        print(f"   🎬 NOUVEAU FICHIER PRÊT")
        print(f"   📁 Fichier: {shot_id}_{version}.mov")
        print(f"   🎭 Scène: {scene_name}")
        print(f"   🔢 Version: {version}")
        print(f"   🆔 Frame.io ID: {file_id}")
        print(f"   🕒 Détecté à: {datetime.now().strftime('%H:%M:%S')}")
        print(f"   🎯 Status: Prêt pour review")
    
    async def test_scene_folder_creation(self):
        """Test la création de dossier de scène (prérequis pour l'upload)"""
        try:
            print("🧪 === TEST CRÉATION DOSSIER SCÈNE ===")
            
            scene_name = "TEST_WATCHER_REMOTE"
            frameio_config = self.config.get('frameio', {})
            project_id = frameio_config.get('project_id')
            workspace_id = frameio_config.get('workspace_id')
            
            if not project_id:
                print("❌ project_id manquant dans la config")
                return False
            
            print(f"📁 Création/recherche dossier: {scene_name}")
            
            scene_folder = await self.structure_manager.find_or_create_scene_folder(
                scene_name, project_id, workspace_id
            )
            
            if scene_folder:
                print(f"✅ Dossier OK: {scene_folder.name} (id: {scene_folder.id})")
                return True
            else:
                print(f"❌ Impossible de créer/trouver le dossier")
                return False
                
        except Exception as e:
            print(f"❌ Erreur test dossier: {e}")
            return False

async def main():
    """Test principal"""
    tester = WatcherRemoteUploadTester()
    
    print("🔧 Initialisation des tests...")
    
    # Test 1: Création de dossier
    folder_ok = await tester.test_scene_folder_creation()
    if not folder_ok:
        print("❌ Test dossier échoué, arrêt")
        return
    
    # Test 2: Remote upload complet
    upload_ok = await tester.test_watcher_remote_upload()
    
    if upload_ok:
        print("🎉 TOUS LES TESTS RÉUSSIS!")
        print("💡 Le watcher peut maintenant utiliser remote_upload pour éviter les problèmes S3")
    else:
        print("❌ ÉCHEC DES TESTS")

if __name__ == "__main__":
    asyncio.run(main())
