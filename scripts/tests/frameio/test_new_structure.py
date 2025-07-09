#!/usr/bin/env python3
"""
Test de la nouvelle structure Frame.io :
WIP_BYSHOT/SC01_SEQ_INTRO/UNDLM_00001/
"""

import asyncio
import sys
import os
import logging
from pathlib import Path

# Ajouter le chemin du projet
sys.path.insert(0, str(Path(__file__).parent))

from src.integrations.frameio.auth import FrameIOAuth
from src.integrations.frameio.structure import FrameIOStructureManager
from src.utils.nomenclature import get_nomenclature_manager

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def test_new_structure():
    """Test de la nouvelle structure hiérarchique"""
    
    logger.info("🧪 Test de la nouvelle structure WIP_BYSHOT/SC01_SEQ_INTRO/UNDLM_00001/")
    
    try:
        # 1. Initialisation
        auth = FrameIOAuth()
        structure_manager = FrameIOStructureManager(auth)
        nomenclature_manager = get_nomenclature_manager()
        
        # 2. Test avec un fichier exemple
        test_filename = "UNDLM_INTRO_00001_v001.mov"
        logger.info(f"📁 Test avec fichier: {test_filename}")
        
        # Parser le fichier
        file_info = nomenclature_manager.parse_filename(test_filename)
        logger.info(f"✅ Fichier parsé: {file_info}")
        
        if not file_info.valid:
            logger.error("❌ Fichier non valide")
            return False
        
        # 3. Générer les noms de dossiers
        sequence_folder_name = nomenclature_manager.get_frameio_folder_name(file_info)
        shot_folder_name = nomenclature_manager.get_frameio_shot_folder_name(file_info)
        
        logger.info(f"📂 Dossier séquence: {sequence_folder_name}")
        logger.info(f"📂 Dossier shot: {shot_folder_name}")
        
        # 4. Créer la structure
        logger.info("🏗️ Création de la structure...")
        shot_folder_id = await structure_manager.get_or_create_folder_path(
            sequence_folder_name,
            shot_folder_name
        )
        
        if shot_folder_id:
            logger.info(f"✅ Structure créée avec succès!")
            logger.info(f"📍 Shot folder ID: {shot_folder_id}")
            
            # Structure attendue :
            # WIP_BYSHOT/
            #   └── SC01_SEQ_INTRO/
            #       └── UNDLM_00001/
            #           ├── UNDLM_INTRO_00001_v001.mov
            #           ├── UNDLM_INTRO_00001_v002.mov
            #           └── etc...
            
            return True
        else:
            logger.error("❌ Échec de création de la structure")
            return False
            
    except Exception as e:
        logger.error(f"❌ Erreur: {e}")
        return False

async def test_multiple_files():
    """Test avec plusieurs fichiers de différentes séquences"""
    
    logger.info("🎬 Test avec plusieurs fichiers...")
    
    test_files = [
        "UNDLM_INTRO_00001_v001.mov",
        "UNDLM_INTRO_00001_v002.mov",
        "UNDLM_INTRO_00002_v001.mov",
        "UNDLM_ACTION_00010_v001.mov",
        "UNDLM_ACTION_00011_v001.mov",
        "UNDLM_OUTRO_00050_v001.mov",
    ]
    
    try:
        auth = FrameIOAuth()
        structure_manager = FrameIOStructureManager(auth)
        nomenclature_manager = get_nomenclature_manager()
        
        for filename in test_files:
            logger.info(f"📁 Traitement: {filename}")
            
            # Parser le fichier
            file_info = nomenclature_manager.parse_filename(filename)
            
            if not file_info.valid:
                logger.error(f"❌ Fichier non valide: {filename}")
                continue
            
            # Générer les noms de dossiers
            sequence_folder_name = nomenclature_manager.get_frameio_folder_name(file_info)
            shot_folder_name = nomenclature_manager.get_frameio_shot_folder_name(file_info)
            
            logger.info(f"  📂 {sequence_folder_name}/{shot_folder_name}")
            
            # Créer la structure
            shot_folder_id = await structure_manager.get_or_create_folder_path(
                sequence_folder_name,
                shot_folder_name
            )
            
            if shot_folder_id:
                logger.info(f"  ✅ Créé: {shot_folder_id}")
            else:
                logger.error(f"  ❌ Échec création pour {filename}")
        
        # Afficher le résumé
        logger.info("📊 Résumé de la structure...")
        summary = await structure_manager.get_folder_structure_summary()
        logger.info(f"✅ Résumé:")
        logger.info(f"  - Projet: {summary.get('project_name')}")
        logger.info(f"  - Séquences: {summary.get('scenes_count')}")
        logger.info(f"  - Shots: {summary.get('shots_count')}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur test multiple: {e}")
        return False

async def main():
    """Fonction principale"""
    
    logger.info("🚀 Début des tests de la nouvelle structure Frame.io")
    
    # Test 1: Structure de base
    success1 = await test_new_structure()
    
    # Test 2: Fichiers multiples
    success2 = await test_multiple_files()
    
    if success1 and success2:
        logger.info("🎉 Tous les tests ont réussi!")
        logger.info("📁 Structure créée: WIP_BYSHOT/SC01_SEQ_INTRO/UNDLM_00001/")
        sys.exit(0)
    else:
        logger.error("❌ Certains tests ont échoué!")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
