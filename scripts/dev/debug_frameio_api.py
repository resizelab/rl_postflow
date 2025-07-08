#!/usr/bin/env python3
"""
Script de diagnostic pour l'API Frame.io
"""

import asyncio
import json
import httpx
from pathlib import Path
import sys

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.integrations.frameio.auth import create_frameio_auth

async def test_frameio_api():
    """Test des différents endpoints Frame.io"""
    
    # Créer l'authentification
    auth = create_frameio_auth()
    
    # Vérifier le token
    if not auth.is_token_valid():
        print("❌ Token invalide")
        return
    
    # Obtenir les informations utilisateur
    print("🔍 Test des endpoints Frame.io...\n")
    
    # Obtenir le token d'accès
    access_token = await auth.get_access_token()
    
    async with httpx.AsyncClient() as client:
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        # Test 1: Me
        print("1. GET /v4/me")
        try:
            response = await client.get("https://api.frame.io/v4/me", headers=headers)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   Réponse complète: {json.dumps(data, indent=2)}")
                print(f"   User ID: {data.get('id')}")
                print(f"   Account ID: {data.get('account_id')}")
                print(f"   Email: {data.get('email')}")
                account_id = data.get('account_id')
            else:
                print(f"   Error: {response.text}")
                return
        except Exception as e:
            print(f"   Exception: {e}")
            return
        
        # Test 2: Accounts
        print(f"\n2. GET /v4/accounts/{account_id}")
        try:
            response = await client.get(f"https://api.frame.io/v4/accounts/{account_id}", headers=headers)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   Account Name: {data.get('name')}")
                print(f"   Account ID: {data.get('id')}")
            else:
                print(f"   Error: {response.text}")
        except Exception as e:
            print(f"   Exception: {e}")
        
        # Test 3: Workspaces
        print(f"\n3. GET /v4/accounts/{account_id}/workspaces")
        try:
            response = await client.get(f"https://api.frame.io/v4/accounts/{account_id}/workspaces", headers=headers)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                workspaces = data.get('items', [])
                print(f"   Workspaces trouvés: {len(workspaces)}")
                for ws in workspaces:
                    print(f"     - {ws.get('name')} (ID: {ws.get('id')})")
                    workspace_id = ws.get('id')
                    
                    # Test 4: Projects pour chaque workspace
                    print(f"\n4. GET /v4/accounts/{account_id}/workspaces/{workspace_id}/projects")
                    try:
                        response = await client.get(f"https://api.frame.io/v4/accounts/{account_id}/workspaces/{workspace_id}/projects", headers=headers)
                        print(f"   Status: {response.status_code}")
                        if response.status_code == 200:
                            projects_data = response.json()
                            projects = projects_data.get('items', [])
                            print(f"   Projects trouvés: {len(projects)}")
                            for proj in projects:
                                print(f"     - {proj.get('name')} (ID: {proj.get('id')})")
                        else:
                            print(f"   Error: {response.text}")
                    except Exception as e:
                        print(f"   Exception: {e}")
            else:
                print(f"   Error: {response.text}")
        except Exception as e:
            print(f"   Exception: {e}")

if __name__ == "__main__":
    asyncio.run(test_frameio_api())
