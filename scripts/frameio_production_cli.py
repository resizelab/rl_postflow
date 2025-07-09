#!/usr/bin/env python3
"""
Frame.io Production CLI - Interface en ligne de commande pour l'upload
"""

import asyncio
import sys
import argparse
import logging
from pathlib import Path

# Ajouter le chemin du projet
sys.path.insert(0, str(Path(__file__).parent))

from src.integrations.frameio.production_upload import FrameIOProductionUploader
from src.integrations.frameio.auth import FrameIOAuth
from src.utils.nomenclature import get_nomenclature_manager

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def upload_file_cli(
    file_path: Path,
    project_name: str = "UNDLM_DOCU",
    scene_name: str = None,
    shot_name: str = None,
    discord_webhook: str = None
):
    """Upload un fichier via CLI"""
    
    try:
        logger.info("🎬 Frame.io Production Upload CLI")
        logger.info("=" * 60)
        
        # Vérifier le fichier
        if not file_path.exists():
            logger.error(f"❌ Fichier non trouvé: {file_path}")
            return False
        
        logger.info(f"📁 Fichier: {file_path}")
        logger.info(f"📊 Taille: {file_path.stat().st_size} bytes")
        
        # Auto-détection via nomenclature
        if not scene_name or not shot_name:
            try:
                nomenclature_manager = get_nomenclature_manager()
                file_info = nomenclature_manager.parse_filename(file_path.name)
                
                if file_info.valid:
                    logger.info(f"✅ Nomenclature: {file_info.project}_{file_info.shot}_v{file_info.version}")
                    scene_name = scene_name or nomenclature_manager.get_frameio_folder_name(file_info)
                    shot_name = shot_name or file_info.shot
                else:
                    scene_name = scene_name or "PRODUCTION"
                    shot_name = shot_name or file_path.stem
                    
            except Exception as e:
                logger.warning(f"⚠️ Erreur nomenclature: {e}")
                scene_name = scene_name or "PRODUCTION"
                shot_name = shot_name or file_path.stem
        
        logger.info(f"📂 Structure: {scene_name} > {shot_name}")
        
        # Auth Frame.io
        auth = FrameIOAuth()
        if not await auth.test_connection():
            logger.error("❌ Authentification Frame.io échouée")
            return False
        
        # Upload
        uploader = FrameIOProductionUploader(auth, discord_webhook)
        result = await uploader.upload_file_with_structure(
            file_path=file_path,
            project_name=project_name,
            scene_name=scene_name,
            shot_name=shot_name
        )
        
        # Résultats
        logger.info("=" * 60)
        if result['success']:
            logger.info("🎉 UPLOAD RÉUSSI!")
            logger.info(f"📁 File ID: {result['file_id']}")
            if result['view_url']:
                logger.info(f"🔗 URL: {result['view_url']}")
        else:
            logger.error("❌ UPLOAD ÉCHOUÉ!")
            if result['error']:
                logger.error(f"💥 Erreur: {result['error']}")
        
        return result['success']
        
    except Exception as e:
        logger.error(f"❌ Erreur: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Frame.io Production Upload CLI")
    
    parser.add_argument('file', type=Path, help="Fichier à uploader")
    parser.add_argument('--project', default="UNDLM_DOCU", help="Projet Frame.io")
    parser.add_argument('--scene', help="Nom de la scène")
    parser.add_argument('--shot', help="Nom du shot")
    parser.add_argument('--discord-webhook', help="URL webhook Discord")
    parser.add_argument('--verbose', '-v', action='store_true', help="Mode verbose")
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Vérifier ngrok
    import subprocess
    result = subprocess.run(['which', 'ngrok'], capture_output=True, text=True)
    if result.returncode != 0:
        print("❌ ngrok non installé. Installez: brew install ngrok")
        sys.exit(1)
    
    auth_check = subprocess.run(['ngrok', 'config', 'check'], capture_output=True, text=True)
    if auth_check.returncode != 0:
        print("❌ ngrok non configuré. Visitez: https://ngrok.com")
        sys.exit(1)
    
    success = asyncio.run(upload_file_cli(
        file_path=args.file,
        project_name=args.project,
        scene_name=args.scene,
        shot_name=args.shot,
        discord_webhook=args.discord_webhook
    ))
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
