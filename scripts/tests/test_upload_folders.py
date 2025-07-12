#!/usr/bin/env python3
"""
Test de l'upload avec structure de dossiers Frame.io
"""

import os
import sys
import asyncio
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.integrations.frameio.upload import FrameIOUploadManager
from src.utils.config import ConfigManager

async def test_upload_with_folders():
    """Test d'upload avec création de structure de dossiers"""
    
    print("🎬 Test d'upload avec structure de dossiers Frame.io")
    print("=" * 60)
    
    # Initialiser le config manager
    config_manager = ConfigManager()
    
    # Créer un manager d'upload
    upload_manager = FrameIOUploadManager(config_manager)
    
    # Trouver un fichier de test
    test_files = [
        "/Volumes/resizelab/o2b-undllm/4_OUT/2_FROM_VFX/SC01/UNDLM_00001/SC01_UNDLM_00001_v001.mov",
        "/Volumes/resizelab/o2b-undllm/4_OUT/2_FROM_VFX/SC02/UNDLM_00002/SC02_UNDLM_00002_v001.mov"
    ]
    
    for test_file in test_files:
        if Path(test_file).exists():
            print(f"\n🎯 Test avec fichier: {test_file}")
            print("-" * 50)
            
            # Extraire les métadonnées
            try:
                from src.integrations.frameio.upload import validate_strict_nomenclature
                metadata = validate_strict_nomenclature(test_file)
                print(f"📊 Métadonnées extraites:")
                print(f"   - Scène: {metadata.get('scene_name')}")
                print(f"   - Plan: {metadata.get('shot_id')}")
                print(f"   - Version: {metadata.get('version')}")
                
                # Tester la structure de dossiers
                target_folder_id = await upload_manager._ensure_folder_structure(
                    config_manager.get('frameio.project_id'),
                    metadata.get('scene_name'),
                    metadata.get('shot_id'),
                    None
                )
                
                if target_folder_id:
                    print(f"✅ Structure créée - Dossier de destination: {target_folder_id}")
                    
                    # Vérifier si le dossier est bien le dossier du shot
                    if upload_manager.structure_manager:
                        summary = await upload_manager.structure_manager.get_folder_structure_summary()
                        
                        # Chercher la scène dans le résumé
                        scene_found = False
                        for scene in summary.get('scenes', []):
                            if scene['name'] == metadata.get('scene_name'):
                                scene_found = True
                                print(f"📁 Scène '{scene['name']}' trouvée avec {len(scene['shots'])} plans:")
                                for shot in scene['shots']:
                                    print(f"   • {shot}")
                                break
                        
                        if not scene_found:
                            print(f"⚠️ Scène '{metadata.get('scene_name')}' non trouvée dans le résumé")
                    
                    # Pour un test complet, on pourrait faire l'upload ici
                    # print(f"🚀 Démarrage de l'upload vers Frame.io...")
                    # result = await upload_manager.upload_file_production(test_file)
                    # print(f"✅ Upload terminé: {result}")
                    
                else:
                    print("❌ Échec de la création de la structure")
                    
            except Exception as e:
                print(f"❌ Erreur: {e}")
                continue
            
            break  # Tester seulement le premier fichier trouvé
    else:
        print("⚠️ Aucun fichier de test trouvé")
    
    print("\n🎯 Test terminé")

if __name__ == "__main__":
    asyncio.run(test_upload_with_folders())
