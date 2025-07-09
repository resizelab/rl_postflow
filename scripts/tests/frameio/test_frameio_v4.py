#!/usr/bin/env python3
"""
Test simple de l'API Frame.io v4
"""

import json
import requests
from pathlib import Path

def test_frameio_v4():
    """Test rapide de l'API Frame.io v4"""
    
    # Load configuration
    config_path = Path(__file__).parent / "config" / "integrations.json"
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    frameio_config = config.get('frameio', {})
    token = frameio_config.get('api_token')
    account_id = frameio_config.get('account_id')
    workspace_id = frameio_config.get('workspace_id')
    base_url = 'https://api.frame.io/v4'
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    print("🔍 Test Frame.io API v4")
    print("=" * 40)
    print(f"Account ID: {account_id}")
    print(f"Workspace ID: {workspace_id}")
    print()
    
    # Test 1: User info
    print("📋 Test 1: User info")
    response = requests.get(f"{base_url}/me", headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        user = response.json()
        print(f"✅ User: {user.get('name', 'N/A')} ({user.get('email', 'N/A')})")
    else:
        print(f"❌ Error: {response.text[:100]}")
    
    # Test 2: Projects in workspace
    print(f"\n📋 Test 2: Projects")
    projects_url = f"{base_url}/accounts/{account_id}/workspaces/{workspace_id}/projects"
    response = requests.get(projects_url, headers=headers)
    print(f"URL: {projects_url}")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        projects = response.json()
        print(f"✅ Found {len(projects)} projects:")
        print(f"Projects data: {projects}")  # Debug
        
        if isinstance(projects, list):
            for project in projects:
                if isinstance(project, dict):
                    print(f"  • {project.get('name')} (ID: {project.get('id')})")
                    print(f"    Root: {project.get('root_asset_id')}")
                else:
                    print(f"  • {project}")
        else:
            print(f"Projects is not a list: {type(projects)}")
    else:
        print(f"❌ Error: {response.text[:200]}")
    
    # Test 3: Test asset creation in first project
    if response.status_code == 200 and projects and isinstance(projects, list) and len(projects) > 0:
        project = projects[0]
        if isinstance(project, dict):
            root_asset_id = project.get('root_asset_id')
        
        if root_asset_id:
            print(f"\n📋 Test 3: Asset creation in {project.get('name')}")
            
            test_data = {
                "name": "PostFlow_Test",
                "type": "folder"
            }
            
            create_url = f"{base_url}/assets/{root_asset_id}/children"
            response = requests.post(create_url, headers=headers, json=test_data)
            print(f"URL: {create_url}")
            print(f"Status: {response.status_code}")
            
            if response.status_code == 201:
                asset = response.json()
                print(f"✅ Created folder: {asset.get('id')}")
                
                # Clean up
                delete_url = f"{base_url}/assets/{asset.get('id')}"
                del_response = requests.delete(delete_url, headers=headers)
                print(f"🧹 Cleanup: {del_response.status_code}")
            else:
                print(f"❌ Creation failed: {response.text[:200]}")

if __name__ == "__main__":
    test_frameio_v4()
