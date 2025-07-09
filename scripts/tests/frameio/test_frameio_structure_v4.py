#!/usr/bin/env python3
"""
Test complet du FrameIOStructureManager avec les nouveaux endpoints v4
Test de création de structure hiérarchique : SCENES > SCENE > SHOT
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

async def test_structure_manager():
    """Test complet du structure manager avec les nouveaux endpoints v4"""
    
    logger.info("🧪 Début des tests du FrameIOStructureManager v4")
    
    try:
        # 1. Initialisation
        auth = FrameIOAuth()
        structure_manager = FrameIOStructureManager(auth)
        
        logger.info(f"Account ID: {structure_manager.account_id}")
        logger.info(f"Workspace ID: {structure_manager.workspace_id}")
        
        # 2. Lister les projets
        logger.info("📋 Récupération des projets...")
        projects = await structure_manager.get_projects()
        
        if not projects:
            logger.error("❌ Aucun projet trouvé")
            return False
        
        logger.info(f"✅ {len(projects)} projets trouvés:")
        for project in projects:
            logger.info(f"  - {project.name} (ID: {project.id}) - Root folder: {project.root_folder_id}")
        
        # 3. Utiliser le premier projet avec un root_folder_id
        target_project = None
        for project in projects:
            if project.root_folder_id:
                target_project = project
                break
        
        if not target_project:
            logger.error("❌ Aucun projet avec root_folder_id trouvé")
            return False
        
        logger.info(f"🎯 Projet sélectionné: {target_project.name} (Root: {target_project.root_folder_id})")
        
        # 4. Lister les dossiers à la racine du projet
        logger.info("📁 Récupération des dossiers racine...")
        try:
            root_folders = await structure_manager.get_folders(target_project.root_folder_id)
            logger.info(f"✅ {len(root_folders)} dossiers racine trouvés:")
            for folder in root_folders:
                logger.info(f"  - {folder.name} (ID: {folder.id})")
        except Exception as e:
            logger.error(f"❌ Erreur récupération dossiers racine: {e}")
            return False
        
        # 5. Test de création de structure hiérarchique
        logger.info("🏗️ Test de création de structure hiérarchique...")
        
        # Utiliser une nomenclature de test
        test_scene = "TEST_SCENE_01"
        test_shot = "S001"
        
        logger.info(f"Création structure: {test_scene} > {test_shot}")
        
        # Méthode 1: Utiliser get_or_create_folder_path
        try:
            shot_folder_id = await structure_manager.get_or_create_folder_path(
                test_scene, 
                test_shot,
                target_project.id
            )
            
            if shot_folder_id:
                logger.info(f"✅ Structure créée avec succès - Shot folder ID: {shot_folder_id}")
            else:
                logger.error("❌ Impossible de créer la structure")
                return False
        except Exception as e:
            logger.error(f"❌ Erreur création structure: {e}")
            return False
        
        # 6. Vérifier la structure créée
        logger.info("🔍 Vérification de la structure créée...")
        try:
            # Chercher le dossier SCENES
            scenes_folder = None
            for folder in root_folders:
                if folder.name.lower() == 'scenes':
                    scenes_folder = folder
                    break
            
            if not scenes_folder:
                # Rechercher à nouveau car il a pu être créé
                root_folders = await structure_manager.get_folders(target_project.root_folder_id)
                for folder in root_folders:
                    if folder.name.lower() == 'scenes':
                        scenes_folder = folder
                        break
            
            if scenes_folder:
                logger.info(f"✅ Dossier SCENES trouvé: {scenes_folder.id}")
                
                # Lister les scènes
                scene_folders = await structure_manager.get_folders(scenes_folder.id)
                logger.info(f"📁 {len(scene_folders)} scènes trouvées:")
                for scene_folder in scene_folders:
                    logger.info(f"  - {scene_folder.name} (ID: {scene_folder.id})")
                    
                    # Lister les shots de cette scène
                    shot_folders = await structure_manager.get_folders(scene_folder.id)
                    logger.info(f"    📹 {len(shot_folders)} shots:")
                    for shot_folder in shot_folders:
                        logger.info(f"      - {shot_folder.name} (ID: {shot_folder.id})")
            else:
                logger.error("❌ Dossier SCENES non trouvé")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur vérification structure: {e}")
            return False
        
        # 7. Test avec nomenclature réelle
        logger.info("🎬 Test avec nomenclature réelle...")
        
        # Utiliser le gestionnaire de nomenclature
        nomenclature_manager = get_nomenclature_manager()
        test_filename = "UNDLM_00001_v001.mov"
        
        file_info = nomenclature_manager.parse_filename(test_filename)
        if file_info.valid:
            logger.info(f"✅ Fichier parsé: {file_info.project}_{file_info.shot}_v{file_info.version}")
            
            # Récupérer le nom du dossier Frame.io
            folder_name = nomenclature_manager.get_frameio_folder_name(file_info)
            logger.info(f"📁 Nom de dossier Frame.io: {folder_name}")
            
            # Créer la structure
            try:
                shot_folder_id = await structure_manager.get_or_create_folder_path(
                    folder_name, 
                    file_info.shot,
                    target_project.id
                )
                
                if shot_folder_id:
                    logger.info(f"✅ Structure nomenclature créée - Shot folder ID: {shot_folder_id}")
                else:
                    logger.error("❌ Impossible de créer la structure nomenclature")
                    return False
                    
            except Exception as e:
                logger.error(f"❌ Erreur création structure nomenclature: {e}")
                return False
        else:
            logger.error(f"❌ Fichier de test non valide: {test_filename}")
        
        # 8. Résumé de la structure
        logger.info("📊 Résumé de la structure...")
        try:
            summary = await structure_manager.get_folder_structure_summary()
            logger.info(f"✅ Résumé:")
            logger.info(f"  - Projet: {summary.get('project_name')} ({summary.get('project_id')})")
            logger.info(f"  - Scènes: {summary.get('scenes_count')}")
            logger.info(f"  - Shots: {summary.get('shots_count')}")
            logger.info(f"  - Dernière MAJ: {summary.get('last_updated')}")
        except Exception as e:
            logger.error(f"❌ Erreur résumé structure: {e}")
        
        logger.info("🎉 Tests terminés avec succès!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur générale: {e}")
        return False

async def main():
    """Fonction principale"""
    success = await test_structure_manager()
    
    if success:
        logger.info("✅ Tous les tests ont réussi!")
        sys.exit(0)
    else:
        logger.error("❌ Certains tests ont échoué!")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
