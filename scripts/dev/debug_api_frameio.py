#!/usr/bin/env python3
"""
Script de diagnostic pour l'API Frame.io
Trouve les bons workspace_id et project_id
"""

import sys
import asyncio
import json
from pathlib import Path
from datetime import datetime

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.integrations.frameio.auth import create_frameio_auth

async def debug_frameio_api():
    """Diagnostique l'API Frame.io pour trouver les bons IDs"""
    
    print("🔍 DIAGNOSTIC API FRAME.IO")
    print("="*50)
    
    try:
        # Créer l'authentification
        auth = create_frameio_auth()
        
        # Vérifier le token
        if not auth.is_token_valid():
            print("❌ Token invalide, tentative de rafraîchissement...")
            if not await auth.ensure_valid_token():
                print("❌ Impossible de rafraîchir le token")
                return
        
        # Récupérer les informations utilisateur
        print("1. Informations utilisateur:")
        me_response = await auth.request('GET', '/me')
        print(f"   Status: {me_response.status_code}")
        me_data = me_response.json()
        user_info = me_data.get('data', {})
        
        print(f"   User Name: {user_info.get('name')}")
        print(f"   Email: {user_info.get('email')}")
        print(f"   Avatar URL: {user_info.get('avatar_url')}")
        
        # Récupérer les comptes
        print("\n2. Comptes disponibles:")
        accounts_response = await auth.request('GET', '/accounts')
        print(f"   Status: {accounts_response.status_code}")
        accounts_data = accounts_response.json()
        
        accounts = accounts_data.get('data', [])
        print(f"   Nombre de comptes: {len(accounts)}")
        
        for account in accounts:
            account_id = account.get('id')
            account_name = account.get('display_name')
            print(f"   Account: {account_name} (ID: {account_id})")
            
            # Pour chaque compte, récupérer les workspaces
            print(f"\n3. Workspaces pour account {account_id}:")
            
            try:
                # Essayer l'endpoint principal
                workspaces_response = await auth.request('GET', f'/accounts/{account_id}/workspaces')
                workspaces_data = workspaces_response.json()
                print(f"   ✅ Endpoint /accounts/{account_id}/workspaces fonctionne (Status: {workspaces_response.status_code})")
                
                workspaces = workspaces_data.get('data', [])
                print(f"   Nombre de workspaces: {len(workspaces)}")
                
                for workspace in workspaces:
                    workspace_id = workspace.get('id')
                    workspace_name = workspace.get('name')
                    print(f"   Workspace: {workspace_name} (ID: {workspace_id})")
                    
                    # Essayer de récupérer les projets pour ce workspace
                    try:
                        projects_response = await auth.request('GET', f'/accounts/{account_id}/workspaces/{workspace_id}/projects')
                        projects_data = projects_response.json()
                        print(f"      ✅ Projets (Status: {projects_response.status_code}): {len(projects_data.get('data', []))} trouvés")
                        
                        for project in projects_data.get('data', []):
                            project_id = project.get('id')
                            project_name = project.get('name')
                            print(f"         Project: {project_name} (ID: {project_id})")
                    except Exception as e:
                        print(f"      ❌ Erreur projets pour workspace {workspace_id}: {e}")
                
            except Exception as e:
                print(f"   ❌ Erreur workspaces: {e}")
        
        # Sauvegarder les bons IDs
        print("\n4. Sauvegarde des IDs fonctionnels:")
        working_config = {
            'accounts': accounts,
            'user_info': user_info,
            'timestamp': datetime.now().isoformat()
        }
        
        # Sauvegarder dans un fichier de debug
        debug_file = Path(__file__).parent / "debug_frameio_ids.json"
        with open(debug_file, 'w') as f:
            json.dump(working_config, f, indent=2)
        
        print(f"   ✅ IDs sauvegardés dans {debug_file}")
        
    except Exception as e:
        print(f"❌ Erreur générale: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_frameio_api())
