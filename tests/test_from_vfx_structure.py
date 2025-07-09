#!/usr/bin/env python3
"""
Test de la structure FROM_VFX avec affichage détaillé
"""

import os
import sys
import asyncio
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.integrations.frameio.upload import FrameIOUploadManager
from src.utils.config import ConfigManager

async def test_from_vfx_structure():
    """Test de la structure FROM_VFX avec affichage détaillé"""
    
    print("🎬 Test de la structure FROM_VFX cohérente avec LucidLink")
    print("=" * 70)
    
    # Initialiser le config manager
    config_manager = ConfigManager()
    
    # Créer un manager d'upload
    upload_manager = FrameIOUploadManager(config_manager)
    
    # Test avec différentes scènes
    test_cases = [
        {"scene": "SC01", "shot": "UNDLM_00001"},
        {"scene": "SC02", "shot": "UNDLM_00002"},
        {"scene": "SC01", "shot": "UNDLM_00003"},  # Même scène, shot différent
    ]
    
    for i, case in enumerate(test_cases):
        scene_name = case["scene"]
        shot_name = case["shot"]
        
        print(f"\n🎯 Test {i+1}: {scene_name} > {shot_name}")
        print("-" * 50)
        
        try:
            # Tester la structure de dossiers
            target_folder_id = await upload_manager._ensure_folder_structure(
                config_manager.get('frameio.project_id'),
                scene_name,
                shot_name,
                None
            )
            
            if target_folder_id:
                print(f"✅ Structure créée - Dossier final: {target_folder_id}")
                print(f"📁 Chemin attendu: Project Root > FROM_VFX > {scene_name} > {shot_name}")
                
            else:
                print("❌ Échec de la création de la structure")
                
        except Exception as e:
            print(f"❌ Erreur: {e}")
    
    # Afficher un résumé de la structure complète
    if upload_manager.structure_manager:
        try:
            print(f"\n📊 === RÉSUMÉ DE LA STRUCTURE COMPLÈTE ===")
            summary = await upload_manager.structure_manager.get_folder_structure_summary()
            
            print(f"🏗️ Projet: {summary.get('project_name', 'N/A')}")
            print(f"📁 Total scènes: {summary.get('scenes_count', 0)}")
            print(f"🎬 Total plans: {summary.get('shots_count', 0)}")
            
            if summary.get('scenes'):
                print(f"\n📂 Structure détaillée:")
                print(f"Project Root")
                print(f"├── FROM_VFX")
                for scene in summary.get('scenes', []):
                    scene_name = scene['name']
                    shots = scene.get('shots', [])
                    print(f"│   ├── {scene_name}")
                    for j, shot in enumerate(shots):
                        connector = "└──" if j == len(shots) - 1 else "├──"
                        print(f"│   │   {connector} {shot}")
                        
        except Exception as e:
            print(f"❌ Erreur résumé: {e}")
    
    print("\n🎯 Test terminé")

if __name__ == "__main__":
    asyncio.run(test_from_vfx_structure())
