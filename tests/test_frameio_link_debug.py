#!/usr/bin/env python3
"""
Script de test pour vérifier l'accessibilité d'un lien Frame.io
"""

import asyncio
import sys
from pathlib import Path
import logging
import httpx

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.integrations.frameio.auth import FrameIOAuth
from src.integrations.frameio.upload import FrameIOUploadManager
from src.utils.config import ConfigManager

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def test_frameio_link(file_id: str):
    """
    Test l'accessibilité d'un lien Frame.io
    
    Args:
        file_id: ID du fichier Frame.io
    """
    try:
        # Charger la configuration
        config = ConfigManager()
        
        # Authentification Frame.io (utiliser le Path au lieu du ConfigManager)
        project_root = Path(__file__).parent
        auth = FrameIOAuth(project_root)
        await auth.ensure_valid_token()
        
        # Gestionnaire d'upload (utiliser le config au lieu de auth)
        upload_manager = FrameIOUploadManager(config)
        
        # Test 1: Vérifier l'accès direct au fichier
        logger.info(f"🔍 Test 1: Accès direct au fichier {file_id}")
        file_info = await upload_manager._get_file_info(file_id)
        
        if file_info:
            logger.info(f"✅ Fichier trouvé: {file_info.get('name', 'N/A')}")
            logger.info(f"   Status: {file_info.get('status', 'N/A')}")
            logger.info(f"   Project ID: {file_info.get('project_id', 'N/A')}")
        else:
            logger.error(f"❌ Fichier {file_id} non trouvé ou non accessible")
            return
        
        # Test 2: Générer un lien de review
        logger.info(f"🔍 Test 2: Génération du lien de review")
        review_link = await upload_manager.get_file_review_link(file_id)
        
        if review_link:
            logger.info(f"✅ Lien de review généré: {review_link}")
        else:
            logger.error(f"❌ Impossible de générer le lien de review")
            return
        
        # Test 3: Vérifier l'accessibilité publique du lien
        logger.info(f"🔍 Test 3: Vérification accessibilité publique")
        
        async with httpx.AsyncClient(follow_redirects=True) as client:
            try:
                response = await client.get(review_link, timeout=30.0)
                logger.info(f"   Status HTTP: {response.status_code}")
                
                if response.status_code == 200:
                    logger.info(f"✅ Lien accessible publiquement")
                    
                    # Vérifier le contenu
                    content = response.text
                    if "Frame.io" in content or "frameio" in content:
                        logger.info(f"✅ Contenu Frame.io détecté")
                    else:
                        logger.warning(f"⚠️ Contenu suspect (pas de Frame.io détecté)")
                
                elif response.status_code == 404:
                    logger.error(f"❌ Lien non trouvé (404) - Le fichier n'est pas accessible")
                
                elif response.status_code == 403:
                    logger.error(f"❌ Accès interdit (403) - Problème d'authentification")
                
                else:
                    logger.warning(f"⚠️ Status inattendu: {response.status_code}")
                    
            except Exception as e:
                logger.error(f"❌ Erreur lors du test HTTP: {e}")
        
        # Test 4: Essayer de créer un nouveau partage
        logger.info(f"🔍 Test 4: Création d'un nouveau partage")
        
        project_id = file_info.get('project_id')
        if project_id:
            try:
                share_link = await upload_manager._create_file_share(file_id, project_id)
                if share_link:
                    logger.info(f"✅ Nouveau partage créé: {share_link}")
                else:
                    logger.error(f"❌ Impossible de créer un nouveau partage")
            except Exception as e:
                logger.error(f"❌ Erreur création partage: {e}")
        else:
            logger.error(f"❌ Pas de project_id disponible pour créer un partage")
        
    except Exception as e:
        logger.error(f"❌ Erreur générale: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python test_frameio_link_debug.py <file_id>")
        print("Exemple: python test_frameio_link_debug.py 1d5b2082-a4bf-4999-a2ad-86bcbc459947")
        sys.exit(1)
    
    file_id = sys.argv[1]
    asyncio.run(test_frameio_link(file_id))
