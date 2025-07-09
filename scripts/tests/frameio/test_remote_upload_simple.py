#!/usr/bin/env python3
"""
Test Frame.io Remote Upload simplifié avec URL publique
Test sans ngrok en utilisant une URL publique existante
"""

import asyncio
import sys
import os
from pathlib import Path
import logging

# Ajouter le chemin du projet
sys.path.insert(0, str(Path(__file__).parent))

from src.integrations.frameio.auth import FrameIOAuth
from src.integrations.frameio.upload import FrameIOUploadManager

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def test_remote_upload_simple():
    """Test de l'upload remote avec une URL publique simple"""
    
    try:
        # 1. Configuration
        config_path = Path("config/integrations.json")
        if not config_path.exists():
            logger.error("❌ Fichier de configuration manquant: config/integrations.json")
            return False
        
        # 2. URL publique de test (fichier vidéo de test)
        # Utilisons une URL publique qui fonctionne vraiment
        public_url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        test_filename = "BigBuckBunny_Test.mp4"
        
        logger.info(f"🌐 URL publique de test: {public_url}")
        
        # 3. Vérifier que l'URL est accessible
        import requests
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
        
        # 4. Initialiser l'auth Frame.io
        logger.info("🔑 Initialisation de l'authentification Frame.io...")
        auth = FrameIOAuth(Path(__file__).parent)
        
        # Vérifier l'authentification
        if not await auth.test_connection():
            logger.error("❌ Échec de l'authentification Frame.io")
            return False
        
        logger.info("✅ Authentification Frame.io OK")
        
        # 5. Initialiser l'upload manager
        logger.info("📤 Initialisation de l'upload manager...")
        upload_manager = FrameIOUploadManager(auth)
        
        # 6. Paramètres de test
        scene_name = "TEST_SCENE_PUBLIC"
        shot_id = "TEST_PUBLIC_001"
        
        # 7. Récupérer les projets pour avoir le root_folder_id
        logger.info("📁 Récupération des projets...")
        projects = await upload_manager.structure_manager.get_projects()
        
        if not projects:
            logger.error("❌ Aucun projet trouvé")
            return False
            
        # Prendre le premier projet (UNDLM_DOCU)
        project = projects[0]
        project_id = project.id
        root_folder_id = project.root_folder_id
        
        logger.info(f"📁 Projet: {project.name} (ID: {project_id})")
        logger.info(f"📁 Root folder: {root_folder_id}")
        
        # 8. Trouver ou créer le dossier de la scène
        logger.info(f"📁 Recherche/création du dossier: {scene_name}")
        scene_folder = await upload_manager.structure_manager.find_or_create_scene_folder(
            scene_name, 
            root_folder_id,
            project_id,
            upload_manager.structure_manager.workspace_id
        )
        
        if not scene_folder:
            logger.error(f"❌ Impossible de créer le dossier {scene_name}")
            return False
        
        logger.info(f"✅ Dossier créé/trouvé: {scene_folder.name} (ID: {scene_folder.id})")
        
        # 9. Test de l'upload remote avec URL publique
        logger.info("🚀 Test remote upload avec URL publique...")
        
        # Créer un fichier temporaire local pour simuler le chemin
        temp_file = Path("temp") / test_filename
        temp_file.parent.mkdir(exist_ok=True)
        temp_file.write_text("dummy")  # Fichier fictif pour les métadonnées
        
        try:
            result = await upload_manager._create_file_remote_upload(
                str(temp_file),
                scene_folder.id,
                public_url
            )
            
            if result:
                logger.info("✅ Upload remote initié avec succès!")
                logger.info(f"📊 Résultat:")
                logger.info(f"   - File ID: {result.id}")
                logger.info(f"   - Name: {result.name}")
                logger.info(f"   - Size: {result.size} bytes")
                logger.info(f"   - Status: {result.status}")
                logger.info(f"   - Project ID: {result.project_id}")
                
                # 9. Attendre le traitement
                logger.info("⏳ Attente du traitement par Frame.io...")
                await asyncio.sleep(10)
                
                # Vérifier le statut
                processing_success = await upload_manager._wait_for_processing(result.id, max_wait=120)
                if processing_success:
                    logger.info("✅ Traitement terminé avec succès")
                else:
                    logger.warning("⚠️ Traitement en cours (peut prendre plus de temps)")
                
                return True
            else:
                logger.error("❌ Upload remote échoué")
                return False
                
        finally:
            # Nettoyer le fichier temporaire
            if temp_file.exists():
                temp_file.unlink()
            
    except Exception as e:
        logger.error(f"❌ Erreur dans le test: {e}")
        return False

async def main():
    """Fonction principale"""
    
    logger.info("🧪 Test Frame.io Remote Upload Simplifié")
    logger.info("=" * 60)
    
    success = await test_remote_upload_simple()
    
    if success:
        logger.info("🎉 Test réussi!")
        logger.info("✅ L'endpoint remote_upload fonctionne correctement")
        logger.info("💡 Vous pouvez maintenant utiliser ngrok pour vos fichiers locaux")
    else:
        logger.error("❌ Test échoué")
        logger.error("🔍 Vérifiez les logs pour plus de détails")
    
    return success

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
