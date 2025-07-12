#!/usr/bin/env python3
"""
Script de test pour valider l'organisation des dossiers Frame.io
"""

import os
import sys
import asyncio
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.integrations.frameio.structure import FrameIOStructureManager
from src.integrations.frameio.upload import FrameIOUploadManager
from src.utils.config import ConfigManager

async def test_folder_structure():
    """Test de la structure des dossiers Frame.io"""
    
    print("🧪 Test de la structure des dossiers Frame.io")
    print("=" * 50)
    
    # Initialiser le config manager
    config_manager = ConfigManager()
    
    # Créer un manager d'upload
    upload_manager = FrameIOUploadManager(config_manager)
    
    # Vérifier les variables d'environnement
    project_id = config_manager.get('frameio.project_id')
    if not project_id:
        print("❌ FRAMEIO_PROJECT_ID non configuré")
        return
    
    print(f"📁 Projet ID: {project_id}")
    
    # Tester avec des exemples
    test_cases = [
        {
            "scene_name": "13H49_-_RECUPERATION_DES_2_SURVIVANTS",
            "shot_name": "S01"
        },
        {
            "scene_name": "TEST_SCENE",
            "shot_name": "S02"
        }
    ]
    
    for test_case in test_cases:
        scene_name = test_case["scene_name"]
        shot_name = test_case["shot_name"]
        
        print(f"\n🎬 Test: {scene_name} > {shot_name}")
        print("-" * 40)
        
        try:
            # Tester la création de la structure
            target_folder_id = await upload_manager._ensure_folder_structure(
                project_id, scene_name, shot_name, None
            )
            
            if target_folder_id:
                print(f"✅ Structure créée avec succès")
                print(f"📁 Dossier de destination: {target_folder_id}")
                
                # Optionnel: récupérer les détails du dossier
                if upload_manager.structure_manager:
                    try:
                        # Vérifier la structure en cache
                        summary = await upload_manager.structure_manager.get_folder_structure_summary()
                        print(f"📊 Résumé de la structure:")
                        print(f"   - Projet: {summary.get('project_name', 'N/A')}")
                        print(f"   - Scènes: {summary.get('scenes_count', 0)}")
                        print(f"   - Plans: {summary.get('shots_count', 0)}")
                        
                        # Afficher les scènes
                        for scene in summary.get('scenes', []):
                            if scene['name'] == scene_name:
                                print(f"   - Scène '{scene_name}': {len(scene['shots'])} plans")
                                for shot in scene['shots']:
                                    print(f"     • {shot}")
                    except Exception as e:
                        print(f"⚠️ Erreur récupération résumé: {e}")
                
            else:
                print("❌ Échec de la création de la structure")
                
        except Exception as e:
            print(f"❌ Erreur: {e}")
    
    print("\n🎯 Test terminé")

if __name__ == "__main__":
    asyncio.run(test_folder_structure())
