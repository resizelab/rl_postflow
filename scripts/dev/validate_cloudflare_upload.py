#!/usr/bin/env python3
"""
Validation de l'upload Cloudflare sur Frame.io
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

async def validate_upload(file_id: str, expected_size: int):
    """Valider l'upload d'un fichier sur Frame.io"""
    try:
        # Créer les managers Frame.io
        auth = create_frameio_auth()
        upload_manager = FrameIOUploadManager(auth)
        
        logger.info(f"🔍 Validation du fichier Frame.io: {file_id}")
        logger.info(f"📏 Taille attendue: {expected_size:,} bytes")
        
        # Récupérer les informations du fichier
        try:
            # Utiliser directement l'API Frame.io v4
            import httpx
            
            headers = {
                "Authorization": f"Bearer {await auth.get_access_token()}",
                "Content-Type": "application/json"
            }
            
            async with httpx.AsyncClient() as client:
                # Récupérer les détails du fichier
                response = await client.get(
                    f"https://api.frame.io/v4/files/{file_id}",
                    headers=headers
                )
                
                if response.status_code != 200:
                    logger.error(f"❌ Erreur API Frame.io: {response.status_code}")
                    return False
                
                file_info = response.json()
                
                # Extraire les informations importantes
                name = file_info.get('name', 'unknown')
                file_size = file_info.get('file_size', 0)
                status = file_info.get('status', 'unknown')
                
                logger.info(f"📄 Nom: {name}")
                logger.info(f"📊 Taille Frame.io: {file_size:,} bytes")
                logger.info(f"🏷️ Statut: {status}")
                
                # Vérifier la taille
                if file_size == expected_size:
                    logger.info("✅ Fichier complet ! Taille correcte.")
                    return True
                elif file_size > 0:
                    percentage = (file_size / expected_size) * 100
                    logger.warning(f"⚠️ Fichier partiel: {percentage:.1f}% ({file_size:,}/{expected_size:,} bytes)")
                    return False
                else:
                    logger.warning("⚠️ Fichier vide ou en cours de traitement")
                    return False
                
        except Exception as e:
            logger.error(f"❌ Erreur validation: {e}")
            return False
        
    except Exception as e:
        logger.error(f"❌ Erreur générale: {e}")
        return False

async def main():
    """Fonction principale"""
    # Validation du fichier uploadé précédemment
    file_id = "ddf1af80-5225-49a1-9633-e7bc5ae59904"
    expected_size = 1057911  # Taille du fichier test
    
    logger.info("🚀 Validation de l'upload Cloudflare...")
    
    success = await validate_upload(file_id, expected_size)
    
    if success:
        logger.info("✅ SUCCÈS : Upload Cloudflare validé !")
        logger.info("🎯 Le fichier est complet sur Frame.io")
    else:
        logger.error("❌ ÉCHEC : Problème avec l'upload")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
