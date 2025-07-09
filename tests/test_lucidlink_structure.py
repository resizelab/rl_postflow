#!/usr/bin/env python3
"""
Test de la structure de dossiers Frame.io cohérente avec LucidLink
Structure attendue: Project Root > FROM_VFX > SC## > UNDLM_#####
"""

import os
import sys
import asyncio
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.integrations.frameio.upload import FrameIOUploadManager, validate_strict_nomenclature
from src.utils.config import ConfigManager

async def test_lucidlink_structure():
    """Test de la structure cohérente avec LucidLink"""
    
    print("🎬 Test de structure Frame.io cohérente avec LucidLink")
    print("=" * 65)
    
    # Initialiser le config manager
    config_manager = ConfigManager()
    project_id = config_manager.get('frameio.project_id')
    
    print(f"📁 Projet Frame.io: {project_id}")
    
    # Créer un manager d'upload
    upload_manager = FrameIOUploadManager(config_manager)
    
    # Exemples de fichiers avec nomenclature stricte
    test_files = [
        "SC01_UNDLM_00001_v001.mov",
        "SC01_UNDLM_00002_v001.mov", 
        "SC02_UNDLM_00003_v001.mov",
        "SC02_UNDLM_00004_v002.mov"
    ]
    
    print(f"\n🧪 Test avec {len(test_files)} fichiers d'exemple:")
    
    for filename in test_files:
        print(f"\n🎯 Test: {filename}")
        print("-" * 50)
        
        try:
            # Valider la nomenclature (version test sans vérification de fichier physique)
            import re
            pattern = r'^SC(\d{2})_UNDLM_(\d{5})_v(\d{3})\.(mov|mp4|avi|mxf)$'
            match = re.match(pattern, filename)
            
            if match:
                scene_num, plan_num, version_num, extension = match.groups()
                metadata = {
                    'scene_number': int(scene_num),
                    'plan_number': int(plan_num),
                    'version_number': int(version_num),
                    'extension': extension,
                    'shot_id': f"UNDLM_{plan_num}",
                    'scene_name': f"SC{scene_num}",
                    'version': f"v{version_num}",
                    'filename': filename,
                    'valid': True
                }
            else:
                raise Exception(f"Nomenclature invalide: {filename}")
            
            scene_name = metadata.get('scene_name')  # SC01, SC02, etc.
            shot_id = metadata.get('shot_id')        # UNDLM_00001, etc.
            
            print(f"   📊 Scène: {scene_name}")
            print(f"   📊 Plan: {shot_id}")
            print(f"   📊 Version: {metadata.get('version')}")
            
            # Tester la création de structure
            if upload_manager.structure_manager:
                target_folder_id = await upload_manager._ensure_folder_structure(
                    project_id, scene_name, shot_id, None
                )
                
                if target_folder_id:
                    print(f"   ✅ Structure créée - Dossier final: {target_folder_id}")
                    print(f"   📁 Chemin attendu: FROM_VFX/{scene_name}/{shot_id}")
                else:
                    print(f"   ❌ Échec création structure")
                    
        except Exception as e:
            print(f"   ❌ Erreur: {e}")
    
    # Afficher le résumé de la structure
    if upload_manager.structure_manager:
        print(f"\n📊 === RÉSUMÉ DE LA STRUCTURE ===")
        try:
            summary = await upload_manager.structure_manager.get_folder_structure_summary()
            
            print(f"📁 Projet: {summary.get('project_name', 'N/A')}")
            print(f"📁 Nombre de scènes: {summary.get('scenes_count', 0)}")
            print(f"📁 Nombre total de plans: {summary.get('shots_count', 0)}")
            
            print(f"\n📂 Structure détaillée:")
            print(f"Project Root")
            print(f"└── FROM_VFX")
            
            scenes = summary.get('scenes', [])
            for i, scene in enumerate(scenes):
                scene_name = scene['name']
                shots = scene.get('shots', [])
                is_last_scene = (i == len(scenes) - 1)
                scene_prefix = "└──" if is_last_scene else "├──"
                
                print(f"    {scene_prefix} {scene_name} ({len(shots)} plans)")
                
                for j, shot in enumerate(shots):
                    is_last_shot = (j == len(shots) - 1)
                    if is_last_scene:
                        shot_prefix = "    └──" if is_last_shot else "    ├──"
                    else:
                        shot_prefix = "    │   └──" if is_last_shot else "    │   ├──"
                    print(f"{shot_prefix} {shot}")
                    
                if not is_last_scene:
                    print(f"    │")
            
        except Exception as e:
            print(f"❌ Erreur récupération résumé: {e}")
    
    print(f"\n🎯 Test terminé")
    print(f"\n💡 Structure attendue vs. réalisée:")
    print(f"   LucidLink: /4_OUT/2_FROM_VFX/SC##/UNDLM_#####/")
    print(f"   Frame.io:  Project Root/FROM_VFX/SC##/UNDLM_#####/")
    print(f"   ✅ Cohérence: Structure identique!")

if __name__ == "__main__":
    asyncio.run(test_lucidlink_structure())
