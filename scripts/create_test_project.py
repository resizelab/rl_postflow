#!/usr/bin/env python3
"""
Script de test Frame.io avec création de projet de test
"""

import os
import sys
import json
import requests
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

def create_test_project():
    """Créer un projet de test Frame.io"""
    print("🎬 " + "=" * 50)
    print("   CRÉATION PROJET TEST FRAME.IO")
    print("=" * 52)
    
    # Load configuration
    config_path = Path(__file__).parent.parent / "config" / "frameio_config.json"
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    token = config.get('api_token')
    team_id = config.get('team_id')
    base_url = config.get('base_url', 'https://api.frame.io/v2')
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    print(f"🔑 Token: {token[:20]}...")
    print(f"👥 Team ID: {team_id}")
    print()
    
    # Créer un projet de test
    print("📋 Création d'un projet de test")
    print("-" * 30)
    
    try:
        project_data = {
            "name": "PostFlow_Test_Project",
            "description": "Projet de test pour les uploads PostFlow",
            "team_id": team_id,
            "private": False
        }
        
        response = requests.post(f"{base_url}/projects", headers=headers, json=project_data)
        print(f"Create Project Status: {response.status_code}")
        
        if response.status_code == 201:
            project = response.json()
            print(f"✅ Projet créé avec succès")
            print(f"   • ID: {project.get('id')}")
            print(f"   • Nom: {project.get('name')}")
            print(f"   • Root Asset: {project.get('root_asset_id')}")
            
            # Sauvegarder la nouvelle configuration
            config['test_project_id'] = project.get('id')
            config['test_root_asset_id'] = project.get('root_asset_id')
            
            with open(config_path, 'w') as f:
                json.dump(config, f, indent=2)
            
            print(f"✅ Configuration mise à jour")
            
            # Tester l'upload dans ce nouveau projet
            test_upload_in_project(project.get('id'), project.get('root_asset_id'), headers, base_url)
            
            # Demander si on veut supprimer le projet
            print(f"\n🗑️  Supprimer le projet de test ?")
            print(f"   • Nom: {project.get('name')}")
            print(f"   • ID: {project.get('id')}")
            
            # Pour l'instant, on le garde pour les tests
            print(f"✅ Projet conservé pour les tests futurs")
            
            return project.get('id')
            
        else:
            print(f"❌ Erreur création projet: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None

def test_upload_in_project(project_id, root_asset_id, headers, base_url):
    """Tester l'upload dans le projet de test"""
    print(f"\n📤 Test upload dans le projet de test")
    print("-" * 30)
    
    try:
        # Créer un dossier de test
        folder_data = {
            "name": "PostFlow_Uploads",
            "type": "folder",
            "parent_id": root_asset_id
        }
        
        response = requests.post(f"{base_url}/assets", headers=headers, json=folder_data)
        print(f"Create Folder Status: {response.status_code}")
        
        if response.status_code == 201:
            folder = response.json()
            print(f"✅ Dossier créé avec succès")
            print(f"   • ID: {folder.get('id')}")
            print(f"   • Nom: {folder.get('name')}")
            
            # Créer un fichier de test
            temp_dir = Path(__file__).parent.parent / "temp"
            temp_dir.mkdir(exist_ok=True)
            
            test_file = temp_dir / "frameio_test.txt"
            with open(test_file, 'w') as f:
                f.write("Test PostFlow Frame.io Upload\n")
                f.write("Created for testing purposes\n")
                f.write("This file should appear in Frame.io\n")
            
            # Tester l'upload d'un fichier simple
            print(f"🚀 Upload fichier de test...")
            
            # Utiliser notre client Frame.io
            sys.path.insert(0, str(Path(__file__).parent.parent))
            from src.integrations.frameio import FrameIOClient
            
            # Créer une config temporaire pour le projet de test
            test_config = {
                "api_token": headers['Authorization'].replace('Bearer ', ''),
                "base_url": base_url,
                "project_id": project_id,
                "root_asset_id": root_asset_id
            }
            
            frameio_client = FrameIOClient(test_config)
            
            # Tenter l'upload
            result = frameio_client.upload_file(
                str(test_file),
                project_id=project_id,
                parent_id=folder.get('id'),
                metadata={"test": True, "tool": "PostFlow"}
            )
            
            if result and result.get('success'):
                print(f"✅ Upload réussi !")
                print(f"   • Asset ID: {result.get('asset_id')}")
                print(f"   • URL: https://frame.io/presentations/{project_id}")
                
                # Nettoyer le fichier de test
                test_file.unlink()
                
                return True
            else:
                print(f"❌ Upload échoué: {result}")
                return False
                
        else:
            print(f"❌ Erreur création dossier: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur upload: {e}")
        return False

def list_all_projects():
    """Lister tous les projets disponibles"""
    print(f"\n📋 Projets disponibles")
    print("-" * 30)
    
    # Load configuration
    config_path = Path(__file__).parent.parent / "config" / "frameio_config.json"
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    token = config.get('api_token')
    team_id = config.get('team_id')
    base_url = config.get('base_url', 'https://api.frame.io/v2')
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Lister les projets de l'équipe
        response = requests.get(f"{base_url}/teams/{team_id}/projects", headers=headers)
        print(f"List Projects Status: {response.status_code}")
        
        if response.status_code == 200:
            projects = response.json()
            print(f"✅ {len(projects)} projets trouvés:")
            
            for project in projects:
                print(f"   • {project.get('name')} (ID: {project.get('id')})")
                print(f"     - Créé le: {project.get('created_at', 'Unknown')}")
                print(f"     - Statut: {project.get('status', 'Unknown')}")
                print()
                
        else:
            print(f"❌ Erreur listing projets: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

def main():
    """Script principal"""
    print("🔧 SOLUTION POUR FRAME.IO")
    print("=" * 30)
    print("Le problème identifié est un manque de permissions sur le projet actuel.")
    print("Voici les solutions possibles:")
    print()
    print("1. 🆕 Créer un projet de test avec permissions complètes")
    print("2. 📋 Lister tous les projets disponibles")
    print("3. 🔧 Vérifier les permissions du projet actuel")
    print()
    
    # Lister les projets existants
    list_all_projects()
    
    # Créer un projet de test
    test_project_id = create_test_project()
    
    if test_project_id:
        print(f"\n🎉 SUCCÈS ! Projet de test créé : {test_project_id}")
        print(f"🔧 Vous pouvez maintenant utiliser ce projet pour les tests d'upload")
        print(f"📝 Configuration mise à jour dans frameio_config.json")
    else:
        print(f"\n❌ Impossible de créer le projet de test")
        print(f"🔧 Vérifiez les permissions de votre token API")

if __name__ == "__main__":
    main()
