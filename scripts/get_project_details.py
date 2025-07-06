#!/usr/bin/env python3
"""
Script pour récupérer les détails complets d'un projet Frame.io
et trouver son root_folder_id
"""

import os
import sys
import json
import asyncio
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.frameio.oauth_auth import FrameIOOAuthAuth, FrameIOOAuthError

async def get_project_details():
    """Récupérer les détails complets du projet"""
    
    # Charger la config
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    auth = FrameIOOAuthAuth(config)
    frameio_config = config.get('frameio', {})
    
    account_id = frameio_config.get('account_id')
    workspace_id = frameio_config.get('workspace_id')
    project_id = frameio_config.get('project_id')
    
    print(f"🔍 Récupération détails du projet {project_id}")
    
    try:
        # Méthode 1: Récupérer directement le projet
        response = await auth._request_with_retry(
            "GET", f"{auth.base_url}/projects/{project_id}"
        )
        
        if response.status_code == 200:
            project_data = response.json()
            print("✅ Détails du projet (méthode directe):")
            print(json.dumps(project_data, indent=2))
        else:
            print(f"❌ Erreur accès direct projet: {response.status_code} - {response.text}")
        
        # Méthode 2: Via workspace (comme dans notre script)
        response2 = await auth._request_with_retry(
            "GET", f"{auth.base_url}/accounts/{account_id}/workspaces/{workspace_id}/projects/{project_id}"
        )
        
        if response2.status_code == 200:
            project_data2 = response2.json()
            print("\n✅ Détails du projet (via workspace):")
            print(json.dumps(project_data2, indent=2))
        else:
            print(f"❌ Erreur accès projet via workspace: {response2.status_code} - {response2.text}")
        
        # Méthode 3: Récupérer les dossiers du projet
        response3 = await auth._request_with_retry(
            "GET", f"{auth.base_url}/projects/{project_id}/folders"
        )
        
        if response3.status_code == 200:
            folders_data = response3.json()
            print("\n✅ Dossiers du projet:")
            print(json.dumps(folders_data, indent=2))
            
            # Chercher le dossier racine
            folders = folders_data.get('data', [])
            root_folders = [f for f in folders if f.get('attributes', {}).get('parent_id') is None]
            
            if root_folders:
                root_folder = root_folders[0]
                root_folder_id = root_folder.get('id')
                print(f"\n🎯 Root folder trouvé: {root_folder_id}")
                
                # Mettre à jour la config
                config['frameio']['root_folder_id'] = root_folder_id
                with open(config_path, 'w') as f:
                    json.dump(config, f, indent=4)
                print(f"💾 root_folder_id mis à jour dans la config: {root_folder_id}")
            else:
                print("❌ Aucun dossier racine trouvé")
        else:
            print(f"❌ Erreur récupération dossiers: {response3.status_code} - {response3.text}")
        
    except Exception as e:
        print(f"❌ Exception: {e}")
    finally:
        await auth.close()

if __name__ == "__main__":
    asyncio.run(get_project_details())
