#!/usr/bin/env python3
"""
Script de diagnostic Frame.io
Pour identifier le problème d'upload
"""

import os
import sys
import json
import requests
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

def test_frameio_api():
    """Test complet de l'API Frame.io"""
    print("🔍 " + "=" * 50)
    print("   DIAGNOSTIC FRAME.IO API")
    print("=" * 52)
    
    # Load configuration
    config_path = Path(__file__).parent.parent / "config" / "frameio_config.json"
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    token = config.get('api_token')
    project_id = config.get('project_id')
    base_url = config.get('base_url', 'https://api.frame.io/v2')
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    print(f"🔑 Token: {token[:20]}...")
    print(f"🎯 Project ID: {project_id}")
    print(f"🌐 Base URL: {base_url}")
    print()
    
    # Test 1: Vérifier le token
    print("📋 Test 1: Vérification du token")
    print("-" * 30)
    
    try:
        response = requests.get(f"{base_url}/me", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            user_info = response.json()
            print(f"✅ Token valide")
            print(f"   • Utilisateur: {user_info.get('name', 'Unknown')}")
            print(f"   • Email: {user_info.get('email', 'Unknown')}")
        else:
            print(f"❌ Token invalide: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur API: {e}")
        return False
    
    # Test 2: Vérifier l'accès au projet
    print(f"\n📋 Test 2: Vérification accès projet")
    print("-" * 30)
    
    try:
        response = requests.get(f"{base_url}/projects/{project_id}", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            project_info = response.json()
            print(f"✅ Projet accessible")
            print(f"   • Nom: {project_info.get('name', 'Unknown')}")
            print(f"   • ID: {project_info.get('id')}")
            print(f"   • Root Asset: {project_info.get('root_asset_id')}")
        else:
            print(f"❌ Projet inaccessible: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur projet: {e}")
        return False
    
    # Test 3: Lister les assets du projet
    print(f"\n📋 Test 3: Listing assets projet")
    print("-" * 30)
    
    try:
        # Try to get the root asset
        root_asset_id = project_info.get('root_asset_id')
        if root_asset_id:
            response = requests.get(f"{base_url}/assets/{root_asset_id}", headers=headers)
            print(f"Root Asset Status: {response.status_code}")
            
            if response.status_code == 200:
                root_asset = response.json()
                print(f"✅ Root asset accessible")
                print(f"   • ID: {root_asset.get('id')}")
                print(f"   • Nom: {root_asset.get('name', 'Root')}")
                print(f"   • Type: {root_asset.get('type')}")
                
                # Try to list children
                response = requests.get(f"{base_url}/assets/{root_asset_id}/children", headers=headers)
                print(f"Children Status: {response.status_code}")
                
                if response.status_code == 200:
                    children = response.json()
                    print(f"✅ Assets listés: {len(children)} éléments")
                    for child in children[:5]:  # Show first 5
                        print(f"   • {child.get('name', 'Unknown')} ({child.get('type', 'unknown')})")
                else:
                    print(f"❌ Erreur listing children: {response.text}")
                    
            else:
                print(f"❌ Root asset inaccessible: {response.text}")
                
        else:
            print("❌ Pas de root_asset_id dans le projet")
            
    except Exception as e:
        print(f"❌ Erreur assets: {e}")
    
    # Test 4: Test de création d'asset (sans fichier)
    print(f"\n📋 Test 4: Test création asset")
    print("-" * 30)
    
    try:
        # Try to create a simple folder first
        test_data = {
            "name": "PostFlow_Diagnostic_Test",
            "type": "folder",
            "parent_id": root_asset_id or project_id
        }
        
        response = requests.post(f"{base_url}/assets", headers=headers, json=test_data)
        print(f"Create Folder Status: {response.status_code}")
        
        if response.status_code == 201:
            folder_asset = response.json()
            print(f"✅ Dossier créé avec succès")
            print(f"   • ID: {folder_asset.get('id')}")
            print(f"   • Nom: {folder_asset.get('name')}")
            
            # Try to delete it
            delete_response = requests.delete(f"{base_url}/assets/{folder_asset.get('id')}", headers=headers)
            print(f"Delete Status: {delete_response.status_code}")
            
            if delete_response.status_code == 204:
                print(f"✅ Dossier supprimé")
            else:
                print(f"⚠️  Erreur suppression: {delete_response.text}")
                
        else:
            print(f"❌ Erreur création dossier: {response.text}")
            
            # Try with different parent
            if root_asset_id and root_asset_id != project_id:
                print(f"🔄 Tentative avec project_id comme parent...")
                test_data['parent_id'] = project_id
                response = requests.post(f"{base_url}/assets", headers=headers, json=test_data)
                print(f"Create Folder (project root) Status: {response.status_code}")
                
                if response.status_code == 201:
                    folder_asset = response.json()
                    print(f"✅ Dossier créé à la racine projet")
                    print(f"   • ID: {folder_asset.get('id')}")
                    
                    # Clean up
                    delete_response = requests.delete(f"{base_url}/assets/{folder_asset.get('id')}", headers=headers)
                    print(f"Delete Status: {delete_response.status_code}")
                else:
                    print(f"❌ Erreur création à la racine: {response.text}")
                    
    except Exception as e:
        print(f"❌ Erreur test création: {e}")
    
    # Test 5: Vérifier les permissions
    print(f"\n📋 Test 5: Vérification permissions")
    print("-" * 30)
    
    try:
        # Check team membership
        response = requests.get(f"{base_url}/teams/{config.get('team_id')}/members", headers=headers)
        print(f"Team Members Status: {response.status_code}")
        
        if response.status_code == 200:
            members = response.json()
            user_id = config.get('user_id')
            
            user_member = None
            for member in members:
                if member.get('user_id') == user_id:
                    user_member = member
                    break
            
            if user_member:
                print(f"✅ Utilisateur membre de l'équipe")
                print(f"   • Rôle: {user_member.get('role', 'Unknown')}")
                print(f"   • Permissions: {user_member.get('permissions', [])}")
            else:
                print(f"❌ Utilisateur non trouvé dans l'équipe")
                
        else:
            print(f"❌ Erreur vérification équipe: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur permissions: {e}")
    
    print(f"\n" + "=" * 52)
    print("🏁 DIAGNOSTIC TERMINÉ")
    print("=" * 52)
    
    return True

if __name__ == "__main__":
    test_frameio_api()
