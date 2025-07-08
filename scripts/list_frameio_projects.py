#!/usr/bin/env python3
"""
Script pour lister tous les projets Frame.io et tester les permissions
"""

import os
import sys
import json
import requests
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

def list_all_frameio_projects():
    """Liste tous les projets Frame.io et teste les permissions"""
    print("📋 " + "=" * 50)
    print("   LISTE DES PROJETS FRAME.IO")
    print("=" * 52)
    
    # Load configuration from integrations.json (modern config)
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    frameio_config_path = Path(__file__).parent.parent / "config" / "frameio_config.json"
    
    # Try modern config first
    if config_path.exists():
        with open(config_path, 'r') as f:
            full_config = json.load(f)
        frameio_config = full_config.get('frameio', {})
        print(f"📁 Utilisation de: {config_path}")
    # Fallback to old config
    elif frameio_config_path.exists():
        with open(frameio_config_path, 'r') as f:
            frameio_config = json.load(f)
        print(f"📁 Utilisation de: {frameio_config_path}")
    else:
        print("❌ Aucun fichier de configuration trouvé")
        return
    
    # Get token from environment or config
    token = os.getenv('FRAMEIO_TOKEN') or frameio_config.get('api_token') or frameio_config.get('token')
    base_url = 'https://api.frame.io/v4'  # Modern API v4
    
    # Check if we have a workspace_id and account_id (for v4 API)
    workspace_id = frameio_config.get('workspace_id')
    account_id = frameio_config.get('account_id')
    
    print(f"🔑 Token type: {'Adobe IMS' if 'adobe' in str(token).lower() else 'Frame.io'}")
    print(f"🌐 Base URL: {base_url}")
    print(f"🏢 Account ID: {account_id}")
    print(f"📁 Workspace ID: {workspace_id}")
    
    if not token:
        print("❌ Aucun token trouvé dans la configuration")
        return
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Get user info
        user_response = requests.get(f"{base_url}/me", headers=headers)
        if user_response.status_code != 200:
            print("❌ Impossible de récupérer les infos utilisateur")
            return
        
        user_info = user_response.json()
        user_id = user_info.get('id')
        
        print(f"👤 Utilisateur: {user_info.get('name')}")
        print(f"📧 Email: {user_info.get('email')}")
        print(f"🆔 User ID: {user_id}")
        print()
        
        # Pour l'API v4, nous utilisons l'endpoint avec account_id et workspace_id
        if account_id and workspace_id:
            print(f"🎯 Utilisation de l'API v4 avec Account/Workspace")
            projects_url = f"{base_url}/accounts/{account_id}/workspaces/{workspace_id}/projects"
            print(f"📡 URL: {projects_url}")
            
            projects_response = requests.get(projects_url, headers=headers)
            print(f"📊 Status: {projects_response.status_code}")
            
            if projects_response.status_code == 200:
                projects = projects_response.json()
                print(f"✅ Projets trouvés: {len(projects)}")
                
                for project in projects:
                    project_id = project.get('id')
                    project_name = project.get('name', 'Unknown')
                    root_asset_id = project.get('root_asset_id')
                    
                    print(f"\n📁 Projet: {project_name}")
                    print(f"   ID: {project_id}")
                    print(f"   Root Asset: {root_asset_id}")
                    
                    # Test création de dossier dans ce projet
                    if root_asset_id:
                        test_data = {
                            "name": "PostFlow_Test_Permissions",
                            "type": "folder"
                        }
                        
                        create_url = f"{base_url}/assets/{root_asset_id}/children"
                        create_response = requests.post(create_url, headers=headers, json=test_data)
                        
                        if create_response.status_code == 201:
                            folder_asset = create_response.json()
                            print(f"   ✅ PERMISSIONS OK - Peut créer des dossiers")
                            
                            # Nettoyer en supprimant le dossier de test
                            delete_url = f"{base_url}/assets/{folder_asset.get('id')}"
                            delete_response = requests.delete(delete_url, headers=headers)
                            if delete_response.status_code in [204, 200]:
                                print(f"   🧹 Dossier de test supprimé")
                        else:
                            print(f"   ❌ PERMISSIONS INSUFFISANTES - {create_response.status_code}")
                            print(f"   💬 Réponse: {create_response.text[:200]}")
            else:
                print(f"❌ Erreur récupération projets: {projects_response.status_code}")
                print(f"💬 Réponse: {projects_response.text[:200]}")
        else:
            print("❌ Account ID ou Workspace ID manquant pour l'API v4")
            # Fallback vers l'ancienne méthode (API v2)
            print("🔄 Tentative avec l'API v2...")
            
            # Get all teams
            teams_response = requests.get(f"{base_url}/teams", headers=headers)
            if teams_response.status_code != 200:
                print("❌ Impossible de récupérer les équipes")
                return
            
            teams = teams_response.json()
            print(f"👥 Équipes trouvées: {len(teams)}")
            
            all_projects = []
            
            for team in teams:
            team_id = team.get('id')
            team_name = team.get('name', 'Unknown')
            print(f"\n🏢 Équipe: {team_name} (ID: {team_id})")
            
            # Get projects for this team
            projects_response = requests.get(f"{base_url}/teams/{team_id}/projects", headers=headers)
            if projects_response.status_code == 200:
                projects = projects_response.json()
                print(f"   📁 Projets: {len(projects)}")
                
                for project in projects:
                    project_id = project.get('id')
                    project_name = project.get('name', 'Unknown')
                    root_asset_id = project.get('root_asset_id')
                    
                    print(f"      • {project_name}")
                    print(f"        ID: {project_id}")
                    print(f"        Root Asset: {root_asset_id}")
                    
                    # Test création de dossier
                    test_data = {
                        "name": "PostFlow_Test_Permissions",
                        "type": "folder",
                        "parent_id": root_asset_id
                    }
                    
                    create_response = requests.post(f"{base_url}/assets", headers=headers, json=test_data)
                    
                    if create_response.status_code == 201:
                        folder_asset = create_response.json()
                        print(f"        ✅ PERMISSIONS OK - Peut créer des dossiers")
                        
                        # Nettoyer en supprimant le dossier de test
                        delete_response = requests.delete(f"{base_url}/assets/{folder_asset.get('id')}", headers=headers)
                        if delete_response.status_code == 204:
                            print(f"        🧹 Dossier de test supprimé")
                        
                        all_projects.append({
                            'team_name': team_name,
                            'project_name': project_name,
                            'project_id': project_id,
                            'root_asset_id': root_asset_id,
                            'can_create': True
                        })
                    else:
                        print(f"        ❌ PERMISSIONS INSUFFISANTES - {create_response.status_code}")
                        all_projects.append({
                            'team_name': team_name,
                            'project_name': project_name,
                            'project_id': project_id,
                            'root_asset_id': root_asset_id,
                            'can_create': False,
                            'error': create_response.text
                        })
            else:
                print(f"   ❌ Erreur récupération projets: {projects_response.status_code}")
        
        # Résumé
        print(f"\n" + "=" * 52)
        print("📊 RÉSUMÉ DES PROJETS")
        print("=" * 52)
        
        can_create_projects = [p for p in all_projects if p.get('can_create')]
        cannot_create_projects = [p for p in all_projects if not p.get('can_create')]
        
        print(f"✅ Projets avec permissions de création: {len(can_create_projects)}")
        for p in can_create_projects:
            print(f"   • {p['team_name']} / {p['project_name']}")
            print(f"     ID: {p['project_id']}")
        
        print(f"\n❌ Projets sans permissions: {len(cannot_create_projects)}")
        for p in cannot_create_projects:
            print(f"   • {p['team_name']} / {p['project_name']}")
        
        # Recommandation de configuration
        if can_create_projects:
            recommended = can_create_projects[0]
            print(f"\n🎯 RECOMMANDATION DE CONFIGURATION:")
            print(f"   Utilisez ce projet pour PostFlow:")
            print(f"   • Nom: {recommended['project_name']}")
            print(f"   • ID: {recommended['project_id']}")
            print(f"   • Root Asset: {recommended['root_asset_id']}")
            
            # Générer la configuration recommandée
            print(f"\n📝 Configuration recommandée pour integrations.json:")
            print(f'   "frameio": {{')
            print(f'     "default_project_id": "{recommended["project_id"]}",')
            print(f'     "default_workspace_id": "{recommended["root_asset_id"]}",')
            print(f'     "upload_timeout": 300,')
            print(f'     "max_retries": 3')
            print(f'   }}')
        else:
            print(f"\n⚠️  AUCUN PROJET DISPONIBLE")
            print(f"   Contactez l'administrateur Frame.io pour obtenir les permissions.")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    list_all_frameio_projects()
