#!/usr/bin/env python3
"""
Script pour vérifier et mettre à jour les IDs Frame.io v4
- Vérifie les comptes disponibles
- Liste les workspaces disponibles  
- Liste les projets disponibles
- Met à jour la config avec les bons IDs
"""

import os
import sys
import json
import asyncio
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.frameio.oauth_auth import FrameIOOAuthAuth, FrameIOOAuthError

class FrameIOIdChecker:
    """Vérificateur et mise à jour des IDs Frame.io"""
    
    def __init__(self):
        self.config_path = Path(__file__).parent.parent / "config" / "integrations.json"
        self.config = self._load_config()
        
        try:
            self.auth = FrameIOOAuthAuth(self.config)
        except FrameIOOAuthError as e:
            print(f"❌ Erreur auth: {e}")
            print("💡 Lancez d'abord frameio_oauth_webapp_demo.py pour obtenir un token valide")
            sys.exit(1)
    
    def _load_config(self):
        """Charger la configuration actuelle"""
        try:
            with open(self.config_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"❌ Erreur chargement config: {e}")
            return {}
    
    def _save_config(self):
        """Sauvegarder la configuration mise à jour"""
        try:
            with open(self.config_path, 'w') as f:
                json.dump(self.config, f, indent=4)
            print(f"💾 Configuration sauvegardée dans {self.config_path}")
        except Exception as e:
            print(f"❌ Erreur sauvegarde config: {e}")
    
    async def check_accounts(self):
        """Vérifier les comptes disponibles"""
        print("\n🔍 === VÉRIFICATION DES COMPTES ===")
        
        try:
            response = await self.auth._request_with_retry(
                "GET", f"{self.auth.base_url}/accounts"
            )
            
            if response.status_code == 200:
                accounts_data = response.json()
                accounts = accounts_data.get('data', [])
                
                print(f"✅ {len(accounts)} compte(s) trouvé(s):")
                
                for account in accounts:
                    account_id = account.get('id')
                    attributes = account.get('attributes', {})
                    name = attributes.get('name', 'N/A')
                    print(f"   📋 ID: {account_id}")
                    print(f"   📝 Nom: {name}")
                    print(f"   🏢 Type: {attributes.get('account_type', 'N/A')}")
                    print()
                
                # Mettre à jour la config avec le premier compte trouvé
                if accounts:
                    first_account_id = accounts[0].get('id')
                    current_account_id = self.config.get('frameio', {}).get('account_id')
                    
                    if current_account_id != first_account_id:
                        print(f"🔄 Mise à jour account_id: {current_account_id} → {first_account_id}")
                        if 'frameio' not in self.config:
                            self.config['frameio'] = {}
                        self.config['frameio']['account_id'] = first_account_id
                    else:
                        print(f"✅ account_id déjà à jour: {current_account_id}")
                    
                    return first_account_id
                else:
                    print("❌ Aucun compte trouvé")
                    return None
            else:
                print(f"❌ Erreur API comptes: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Exception vérification comptes: {e}")
            return None
    
    async def check_workspaces(self, account_id: str):
        """Vérifier les workspaces disponibles pour un compte"""
        print(f"\n🔍 === VÉRIFICATION DES WORKSPACES (Compte: {account_id}) ===")
        
        try:
            response = await self.auth._request_with_retry(
                "GET", f"{self.auth.base_url}/accounts/{account_id}/workspaces"
            )
            
            if response.status_code == 200:
                workspaces_data = response.json()
                workspaces = workspaces_data.get('data', [])
                
                print(f"✅ {len(workspaces)} workspace(s) trouvé(s):")
                
                for workspace in workspaces:
                    workspace_id = workspace.get('id')
                    attributes = workspace.get('attributes', {})
                    name = attributes.get('name', 'N/A')
                    print(f"   📋 ID: {workspace_id}")
                    print(f"   📝 Nom: {name}")
                    print(f"   🔒 Statut: {attributes.get('status', 'N/A')}")
                    print()
                
                # Mettre à jour la config avec le premier workspace trouvé
                if workspaces:
                    first_workspace_id = workspaces[0].get('id')
                    current_workspace_id = self.config.get('frameio', {}).get('workspace_id')
                    
                    if current_workspace_id != first_workspace_id:
                        print(f"🔄 Mise à jour workspace_id: {current_workspace_id} → {first_workspace_id}")
                        self.config['frameio']['workspace_id'] = first_workspace_id
                    else:
                        print(f"✅ workspace_id déjà à jour: {current_workspace_id}")
                    
                    return first_workspace_id
                else:
                    print("❌ Aucun workspace trouvé")
                    return None
            else:
                print(f"❌ Erreur API workspaces: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Exception vérification workspaces: {e}")
            return None
    
    async def check_projects(self, workspace_id: str):
        """Vérifier les projets disponibles pour un workspace"""
        print(f"\n🔍 === VÉRIFICATION DES PROJETS (Workspace: {workspace_id}) ===")
        
        try:
            # Récupérer l'account_id depuis la config
            account_id = self.config.get('frameio', {}).get('account_id')
            if not account_id:
                print("❌ account_id manquant dans la config")
                return None
            
            response = await self.auth._request_with_retry(
                "GET", f"{self.auth.base_url}/accounts/{account_id}/workspaces/{workspace_id}/projects"
            )
            
            if response.status_code == 200:
                projects_data = response.json()
                projects = projects_data.get('data', [])
                
                print(f"✅ {len(projects)} projet(s) trouvé(s):")
                
                for project in projects:
                    project_id = project.get('id')
                    attributes = project.get('attributes', {})
                    name = attributes.get('name', 'N/A')
                    print(f"   📋 ID: {project_id}")
                    print(f"   📝 Nom: {name}")
                    print(f"   🔒 Statut: {attributes.get('status', 'N/A')}")
                    print(f"   📁 Folder ID: {attributes.get('root_folder_id', 'N/A')}")
                    print()
                
                # Mettre à jour la config avec le premier projet trouvé
                if projects:
                    first_project = projects[0]
                    first_project_id = first_project.get('id')
                    first_root_folder_id = first_project.get('attributes', {}).get('root_folder_id')
                    
                    current_project_id = self.config.get('frameio', {}).get('project_id')
                    current_folder_id = self.config.get('frameio', {}).get('root_folder_id')
                    
                    if current_project_id != first_project_id:
                        print(f"🔄 Mise à jour project_id: {current_project_id} → {first_project_id}")
                        self.config['frameio']['project_id'] = first_project_id
                    else:
                        print(f"✅ project_id déjà à jour: {current_project_id}")
                    
                    if current_folder_id != first_root_folder_id:
                        print(f"🔄 Mise à jour root_folder_id: {current_folder_id} → {first_root_folder_id}")
                        self.config['frameio']['root_folder_id'] = first_root_folder_id
                    else:
                        print(f"✅ root_folder_id déjà à jour: {current_folder_id}")
                    
                    return first_project_id, first_root_folder_id
                else:
                    print("❌ Aucun projet trouvé")
                    return None, None
            else:
                print(f"❌ Erreur API projets: {response.status_code} - {response.text}")
                return None, None
                
        except Exception as e:
            print(f"❌ Exception vérification projets: {e}")
            return None, None
    
    async def check_all_ids(self):
        """Vérification complète et mise à jour de tous les IDs"""
        print("🚀 === VÉRIFICATION COMPLÈTE DES IDs FRAME.IO ===")
        
        # Test de connexion
        print("\n🔗 Test de connexion...")
        connection_ok = await self.auth.test_connection()
        if not connection_ok:
            print("❌ Connexion échouée, arrêt")
            return False
        
        # 1. Vérifier les comptes
        account_id = await self.check_accounts()
        if not account_id:
            print("❌ Impossible de récupérer l'account_id, arrêt")
            return False
        
        # 2. Vérifier les workspaces
        workspace_id = await self.check_workspaces(account_id)
        if not workspace_id:
            print("❌ Impossible de récupérer le workspace_id, arrêt")
            return False
        
        # 3. Vérifier les projets
        project_id, root_folder_id = await self.check_projects(workspace_id)
        if not project_id:
            print("❌ Impossible de récupérer le project_id, arrêt")
            return False
        
        # 4. Sauvegarder la config mise à jour
        self._save_config()
        
        print("\n🎉 === RÉSUMÉ DES IDs VALIDÉS ===")
        print(f"   🏢 Account ID: {account_id}")
        print(f"   🏠 Workspace ID: {workspace_id}")
        print(f"   📁 Project ID: {project_id}")
        print(f"   📂 Root Folder ID: {root_folder_id}")
        print(f"   🌐 Base URL: {self.auth.base_url}")
        
        return True
    
    async def close(self):
        """Fermer les connexions"""
        await self.auth.close()

async def main():
    """Fonction principale"""
    checker = FrameIOIdChecker()
    
    try:
        success = await checker.check_all_ids()
        if success:
            print("\n✅ Vérification et mise à jour terminées avec succès!")
            print("💡 Vous pouvez maintenant relancer vos scripts avec les bons IDs")
        else:
            print("\n❌ Échec de la vérification")
    finally:
        await checker.close()

if __name__ == "__main__":
    asyncio.run(main())
