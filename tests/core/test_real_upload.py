#!/usr/bin/env python3
"""
Test d'upload réel avec un fichier du système LucidLink
Utilise ngrok pour exposer le fichier localement
"""

import asyncio
import sys
import os
from pathlib import Path
import logging

# Ajouter le chemin du projet
sys.path.insert(0, str(Path(__file__).parent))

from src.integrations.frameio.auth import FrameIOAuth
from src.integrations.frameio.production_upload import upload_file_to_frameio

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def test_real_upload():
    """Test d'upload réel avec un fichier depuis LucidLink"""
    
    try:
        # 1. Trouver un fichier réel à uploader
        lucidlink_base = Path("/Volumes/resizelab/o2b-undllm/4_OUT/2_FROM_VFX/BY_SHOT/UNDLM_00001")
        
        # Chercher les fichiers disponibles
        video_files = []
        if lucidlink_base.exists():
            for ext in ['.mov', '.mp4', '.avi']:
                video_files.extend(list(lucidlink_base.glob(f"*{ext}")))
        
        if not video_files:
            logger.error(f"❌ Aucun fichier vidéo trouvé dans {lucidlink_base}")
            return False
        
        # Prendre le premier fichier trouvé
        file_to_upload = video_files[0]
        logger.info(f"📁 Fichier sélectionné: {file_to_upload}")
        logger.info(f"📊 Taille: {file_to_upload.stat().st_size / (1024*1024):.2f} MB")
        
        # 2. Initialiser l'auth Frame.io
        logger.info("🔑 Initialisation de l'authentification Frame.io...")
        auth = FrameIOAuth(Path(__file__).parent)
        
        # Vérifier l'authentification
        if not await auth.test_connection():
            logger.error("❌ Échec de l'authentification Frame.io")
            return False
        
        logger.info("✅ Authentification Frame.io OK")
        
        # 3. Paramètres d'upload
        project_name = "UNDLM_DOCU"
        scene_name = "UNDLM_00001"
        
        # 4. Configuration Discord (optionnel)
        discord_webhook = os.getenv("DISCORD_WEBHOOK_URL")
        
        # 5. Lancer l'upload avec la fonction utilitaire
        logger.info("🚀 Démarrage de l'upload avec ngrok...")
        
        result = await upload_file_to_frameio(
            file_path=file_to_upload,
            auth=auth,
            discord_webhook_url=discord_webhook,
            project_name=project_name
        )
        
        if result['success']:
            logger.info("🎉 Upload réussi!")
            logger.info(f"📊 Résultat:")
            logger.info(f"   - File ID: {result['file_id']}")
            logger.info(f"   - URL de visualisation: {result['view_url']}")
            
            # Informations supplémentaires si disponibles
            if 'folder_path' in result:
                logger.info(f"   - Chemin Frame.io: {result['folder_path']}")
            if 'ngrok_url' in result:
                logger.info(f"   - URL ngrok utilisée: {result['ngrok_url']}")
            if 'filename' in result:
                logger.info(f"   - Nom du fichier: {result['filename']}")
            
            return True
        else:
            logger.error("❌ Upload échoué")
            logger.error(f"Erreur: {result.get('error', 'Erreur inconnue')}")
            return False
            
    except Exception as e:
        logger.error(f"❌ Erreur dans le test: {e}")
        import traceback
        traceback.print_exc()
        return False

async def main():
    """Fonction principale"""
    
    logger.info("🎬 TEST D'UPLOAD RÉEL - RL POSTFLOW")
    logger.info("=" * 60)
    
    success = await test_real_upload()
    
    if success:
        logger.info("🎉 Test d'upload réel réussi!")
        logger.info("✅ Le pipeline Frame.io + ngrok fonctionne parfaitement")
        logger.info("🎬 Votre fichier est maintenant disponible dans Frame.io")
    else:
        logger.error("❌ Test d'upload réel échoué")
        logger.error("🔍 Vérifiez les logs pour plus de détails")
    
    return success

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
