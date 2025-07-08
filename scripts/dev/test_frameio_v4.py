#!/usr/bin/env python3
"""
Test de l'API Frame.io V4 avec la nouvelle configuration
"""

import os
import sys
import json
import requests
from pathlib import Path

def test_frameio_v4():
    """Test de l'API Frame.io V4"""
    print("🔍 " + "=" * 50)
    print("   TEST FRAME.IO API V4")
    print("=" * 52)
    
    # Load nouvelle configuration
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    frameio_config = config.get('frameio', {})
    token = frameio_config.get('api_token')
    account_id = frameio_config.get('account_id')
    workspace_id = frameio_config.get('workspace_id')
    project_id = frameio_config.get('project_id')
    base_url = frameio_config.get('base_url', 'https://api.frame.io/v4')
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    print(f"🔑 Token: {token[:20]}... (v4)")
    print(f"🏢 Account ID: {account_id}")
    print(f"📁 Workspace ID: {workspace_id}")
    print(f"🎯 Project ID: {project_id}")
    print(f"🌐 Base URL: {base_url}")
    print()
    
    # Test 1: Vérifier le token V4
    print("📋 Test 1: Token V4")
    print("-" * 30)
    
    try:
        response = requests.get(f"{base_url}/me", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            user_info = response.json()
            print(f"✅ Token V4 valide")
            print(f"   • Utilisateur: {user_info.get('name', 'Unknown')}")
            print(f"   • Email: {user_info.get('email', 'Unknown')}")
        else:
            print(f"❌ Token V4 invalide: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur API V4: {e}")
        return False
    
    # Test 2: Lister les projets du workspace
    print(f"\n📋 Test 2: Projets workspace V4")
    print("-" * 30)
    
    try:
        url = f"{base_url}/accounts/{account_id}/workspaces/{workspace_id}/projects"
        response = requests.get(url, headers=headers)
        print(f"URL: {url}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            projects = response.json()
            print(f"✅ Projets accessibles: {len(projects)}")
            for project in projects:
                print(f"   • {project.get('name', 'Unknown')} (ID: {project.get('id')})")
                if project.get('id') == project_id:
                    print(f"     ⭐ PROJET CIBLE TROUVÉ")
                    
        elif response.status_code == 422:
            print(f"❌ Erreur 422 (Workspace/Account incorrect): {response.text}")
            
            # Essayons de lister les comptes disponibles
            accounts_response = requests.get(f"{base_url}/accounts", headers=headers)
            if accounts_response.status_code == 200:
                accounts = accounts_response.json()
                print(f"\n🔍 Comptes disponibles: {len(accounts)}")
                for account in accounts:
                    print(f"   • {account.get('name', 'Unknown')} (ID: {account.get('id')})")
                    
                    # Tester les workspaces de chaque compte
                    acc_id = account.get('id')
                    workspaces_response = requests.get(f"{base_url}/accounts/{acc_id}/workspaces", headers=headers)
                    if workspaces_response.status_code == 200:
                        workspaces = workspaces_response.json()
                        print(f"     📁 Workspaces: {len(workspaces)}")
                        for workspace in workspaces:
                            print(f"       • {workspace.get('name', 'Unknown')} (ID: {workspace.get('id')})")
                            
        else:
            print(f"❌ Erreur: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur projets: {e}")
        return False
    
    # Test 3: Accès direct au projet
    print(f"\n📋 Test 3: Accès direct projet")
    print("-" * 30)
    
    try:
        url = f"{base_url}/projects/{project_id}"
        response = requests.get(url, headers=headers)
        print(f"URL: {url}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            project_info = response.json()
            print(f"✅ Projet accessible directement")
            print(f"   • Nom: {project_info.get('name', 'Unknown')}")
            print(f"   • ID: {project_info.get('id')}")
            
            # Test création de dossier
            print(f"\n🧪 Test création dossier...")
            test_data = {
                "name": "PostFlow_Test_V4",
                "type": "folder"
            }
            
            create_url = f"{base_url}/projects/{project_id}/assets"
            create_response = requests.post(create_url, headers=headers, json=test_data)
            print(f"Create URL: {create_url}")
            print(f"Create Status: {create_response.status_code}")
            
            if create_response.status_code == 201:
                folder = create_response.json()
                print(f"✅ SUCCÈS ! Dossier créé")
                print(f"   • ID: {folder.get('id')}")
                print(f"   • Nom: {folder.get('name')}")
                
                # Nettoyer
                delete_response = requests.delete(f"{base_url}/assets/{folder.get('id')}", headers=headers)
                print(f"Delete Status: {delete_response.status_code}")
                
            else:
                print(f"❌ Erreur création: {create_response.text}")
                
        else:
            print(f"❌ Projet inaccessible: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur accès projet: {e}")
    
    print(f"\n" + "=" * 52)
    print("🏁 TEST V4 TERMINÉ")
    print("=" * 52)
    
    return True

if __name__ == "__main__":
    test_frameio_v4()
