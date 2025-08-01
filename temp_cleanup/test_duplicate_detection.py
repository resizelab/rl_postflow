#!/usr/bin/env python3
"""
Test de détection des doublons et remplacements Frame.io
"""

import asyncio
import sys
import os
from pathlib import Path

# Ajouter le répertoire src au PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent / 'src'))

from integrations.frameio.upload import FrameIOUploadManager, check_frameio_filename_duplicate, calculate_file_hash
from core.config_manager import ConfigManager
import logging

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def test_duplicate_detection():
    """Test de la détection de doublons"""
    
    try:
        # Charger la configuration
        config = ConfigManager()
        
        # Créer le gestionnaire d'upload
        upload_manager = FrameIOUploadManager(config)
        
        # Fichier de test (utiliser un fichier existant)
        test_files = [
            r"data\SQ17_UNDLM_00306_v001.mov",
            r"data\SQ17_UNDLM_00308_v001.mov",
        ]
        
        for test_file in test_files:
            test_file_path = Path(test_file)
            
            if not test_file_path.exists():
                logger.warning(f"⚠️ Fichier de test non trouvé: {test_file}")
                continue
                
            logger.info(f"\n{'='*60}")
            logger.info(f"🧪 TEST DE DÉTECTION DE DOUBLONS")
            logger.info(f"📁 Fichier: {test_file_path.name}")
            logger.info(f"{'='*60}")
            
            # Calculer le hash du fichier local
            local_hash = calculate_file_hash(test_file_path)
            logger.info(f"📊 Hash local: {local_hash}")
            
            # ID du dossier de test (remplacer par un vrai folder_id)
            # On utilisera le root folder pour ce test
            folder_id = config.get('frameio.root_folder_id')
            
            if not folder_id:
                logger.error("❌ Impossible d'obtenir le folder_id pour le test")
                continue
            
            # Tester la détection de doublons
            duplicate_check = await check_frameio_filename_duplicate(
                upload_manager, folder_id, test_file_path.name, test_file_path
            )
            
            logger.info(f"\n📋 RÉSULTATS DE LA VÉRIFICATION:")
            logger.info(f"   - Fichier existe: {duplicate_check['exists']}")
            logger.info(f"   - Est un remplacement: {duplicate_check['is_replacement']}")
            logger.info(f"   - Hash local: {duplicate_check['local_hash'][:16] if duplicate_check['local_hash'] else 'N/A'}...")
            logger.info(f"   - Hash distant: {duplicate_check['remote_hash'][:16] if duplicate_check['remote_hash'] else 'N/A'}...")
            
            if duplicate_check['exists']:
                file_info = duplicate_check['file_info']
                logger.info(f"\n📁 INFORMATIONS DU FICHIER EXISTANT:")
                logger.info(f"   - ID: {file_info.get('id')}")
                logger.info(f"   - Nom: {file_info.get('name')}")
                logger.info(f"   - Taille: {file_info.get('filesize')} bytes")
                logger.info(f"   - Créé le: {file_info.get('inserted_at')}")
                logger.info(f"   - Modifié le: {file_info.get('updated_at')}")
                
                if duplicate_check['is_replacement']:
                    logger.warning(f"🔄 REMPLACEMENT RECOMMANDÉ")
                else:
                    logger.info(f"✅ FICHIER IDENTIQUE - Pas d'upload nécessaire")
            else:
                logger.info(f"🆕 NOUVEAU FICHIER - Upload autorisé")
    
    except Exception as e:
        logger.error(f"❌ Erreur durante el test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_duplicate_detection())
