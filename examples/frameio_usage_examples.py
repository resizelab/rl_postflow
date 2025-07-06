#!/usr/bin/env python3
"""
🎬 Frame.io Usage Examples - OAuth Web App
==========================================

Exemples d'utilisation de l'API Frame.io avec authentification OAuth Web App.
Ces exemples montrent comment utiliser le module frameio_oauth pour
interagir avec l'API Frame.io v4.

Prérequis:
- Authentification OAuth configurée via frameio_oauth_complete.py
- Token valide dans config/integrations.json

Auteur: RL PostFlow Pipeline
Date: 2025-01-06
Version: 2.0.0 (OAuth Web App Only)
"""

import sys
from pathlib import Path

# Ajouter le répertoire src au path pour importer frameio_oauth
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from frameio_oauth import FrameioOAuth, FrameioOAuthError
import requests
import json
from typing import List, Dict, Any, Optional


class FrameioAPI:
    """
    Classe helper pour les opérations courantes de l'API Frame.io
    """
    
    def __init__(self):
        """Initialise le client API Frame.io"""
        self.oauth = FrameioOAuth()
        self.base_url = "https://api.frame.io"
        
        # S'assurer qu'on a un token valide
        if not self.oauth.ensure_valid_token():
            raise FrameioOAuthError("Aucun token valide. Lancez frameio_oauth_complete.py d'abord.")
    
    def _get_headers(self) -> Dict[str, str]:
        """Retourne les headers d'authentification"""
        config = self.oauth._load_current_tokens()
        return {
            'Authorization': f'Bearer {config["access_token"]}',
            'Content-Type': 'application/json'
        }
    
    def _make_request(self, method: str, endpoint: str, **kwargs) -> requests.Response:
        """
        Effectue une requête HTTP vers l'API Frame.io
        
        Args:
            method: Méthode HTTP (GET, POST, etc.)
            endpoint: Endpoint API (ex: '/v4/me')
            **kwargs: Arguments additionnels pour requests
            
        Returns:
            Objet Response
        """
        url = f"{self.base_url}{endpoint}"
        headers = self._get_headers()
        
        if 'headers' in kwargs:
            headers.update(kwargs['headers'])
        kwargs['headers'] = headers
        
        response = requests.request(method, url, **kwargs)
        
        # Auto-refresh du token si nécessaire
        if response.status_code == 401:
            print("Token expiré, tentative de rafraîchissement...")
            try:
                self.oauth.refresh_token()
                # Retry avec le nouveau token
                headers = self._get_headers()
                kwargs['headers'] = headers
                response = requests.request(method, url, **kwargs)
            except FrameioOAuthError:
                pass  # Le refresh a échoué, on retourne la réponse 401 originale
        
        return response
    
    def get_user_info(self) -> Optional[Dict[str, Any]]:
        """
        Récupère les informations de l'utilisateur connecté
        
        Returns:
            Dict avec les infos utilisateur ou None si erreur
        """
        response = self._make_request('GET', '/v4/me')
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Erreur récupération utilisateur: {response.status_code}")
            return None
    
    def get_accounts(self) -> List[Dict[str, Any]]:
        """
        Récupère la liste des comptes Frame.io accessibles
        
        Returns:
            Liste des comptes
        """
        response = self._make_request('GET', '/v4/accounts')
        
        if response.status_code == 200:
            data = response.json()
            return data.get('data', []) if isinstance(data, dict) else data
        else:
            print(f"Erreur récupération comptes: {response.status_code}")
            return []
    
    def get_projects(self, account_id: str) -> List[Dict[str, Any]]:
        """
        Récupère les projets d'un compte
        
        Args:
            account_id: ID du compte Frame.io
            
        Returns:
            Liste des projets
        """
        response = self._make_request('GET', f'/v4/accounts/{account_id}/projects')
        
        if response.status_code == 200:
            data = response.json()
            return data.get('data', []) if isinstance(data, dict) else data
        else:
            print(f"Erreur récupération projets: {response.status_code}")
            return []
    
    def get_project_root_folder(self, account_id: str, project_id: str) -> Optional[Dict[str, Any]]:
        """
        Récupère le dossier racine d'un projet
        
        Args:
            account_id: ID du compte
            project_id: ID du projet
            
        Returns:
            Informations du dossier racine
        """
        response = self._make_request('GET', f'/v4/accounts/{account_id}/projects/{project_id}')
        
        if response.status_code == 200:
            project_data = response.json()
            return project_data.get('root_asset')
        else:
            print(f"Erreur récupération projet: {response.status_code}")
            return None
    
    def get_folder_contents(self, account_id: str, folder_id: str) -> List[Dict[str, Any]]:
        """
        Récupère le contenu d'un dossier
        
        Args:
            account_id: ID du compte
            folder_id: ID du dossier
            
        Returns:
            Liste des éléments (dossiers et fichiers)
        """
        response = self._make_request('GET', f'/v4/accounts/{account_id}/folders/{folder_id}/children')
        
        if response.status_code == 200:
            data = response.json()
            return data.get('data', []) if isinstance(data, dict) else data
        else:
            print(f"Erreur récupération contenu dossier: {response.status_code}")
            return []
    
    def upload_file(self, account_id: str, folder_id: str, file_path: Path, 
                   name: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Upload un fichier vers Frame.io
        
        Args:
            account_id: ID du compte
            folder_id: ID du dossier destination
            file_path: Chemin vers le fichier local
            name: Nom du fichier (par défaut: nom du fichier)
            
        Returns:
            Informations du fichier uploadé ou None si erreur
        """
        if not file_path.exists():
            print(f"Fichier non trouvé: {file_path}")
            return None
        
        file_name = name or file_path.name
        file_size = file_path.stat().st_size
        
        # Étape 1: Créer le fichier sur Frame.io
        create_data = {
            "name": file_name,
            "type": "file",
            "filetype": file_path.suffix.lower(),
            "filesize": file_size
        }
        
        response = self._make_request('POST', f'/v4/accounts/{account_id}/folders/{folder_id}/files/local_upload',
                                    json=create_data)
        
        if response.status_code != 201:
            print(f"Erreur création fichier: {response.status_code}")
            try:
                error_details = response.json()
                print(f"Détails: {error_details}")
            except:
                print(f"Réponse: {response.text}")
            return None
        
        file_info = response.json()
        upload_url = file_info.get('upload_url')
        
        if not upload_url:
            print("URL d'upload non reçue")
            return None
        
        # Étape 2: Upload le fichier
        print(f"Upload en cours: {file_name} ({file_size} bytes)")
        
        with open(file_path, 'rb') as f:
            upload_response = requests.put(upload_url, data=f)
        
        if upload_response.status_code in [200, 201]:
            print(f"✅ Upload réussi: {file_name}")
            return file_info
        else:
            print(f"❌ Erreur upload: {upload_response.status_code}")
            return None


def example_user_info():
    """Exemple: Récupérer les informations utilisateur"""
    print("\n🔍 EXEMPLE: Informations utilisateur")
    print("=" * 40)
    
    try:
        api = FrameioAPI()
        user_info = api.get_user_info()
        
        if user_info:
            print(f"✅ Utilisateur connecté:")
            print(f"   Nom: {user_info.get('name', 'N/A')}")
            print(f"   Email: {user_info.get('email', 'N/A')}")
            print(f"   ID: {user_info.get('id', 'N/A')}")
        else:
            print("❌ Impossible de récupérer les infos utilisateur")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")


def example_list_accounts():
    """Exemple: Lister les comptes Frame.io"""
    print("\n📋 EXEMPLE: Liste des comptes")
    print("=" * 40)
    
    try:
        api = FrameioAPI()
        accounts = api.get_accounts()
        
        if accounts:
            print(f"✅ {len(accounts)} compte(s) trouvé(s):")
            for account in accounts:
                print(f"   - {account.get('name', 'Sans nom')} (ID: {account.get('id')})")
            return accounts
        else:
            print("❌ Aucun compte trouvé")
            return []
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return []


def example_list_projects(account_id: str):
    """
    Exemple: Lister les projets d'un compte
    
    Args:
        account_id: ID du compte Frame.io
    """
    print(f"\n📁 EXEMPLE: Projets du compte {account_id}")
    print("=" * 50)
    
    try:
        api = FrameioAPI()
        projects = api.get_projects(account_id)
        
        if projects:
            print(f"✅ {len(projects)} projet(s) trouvé(s):")
            for project in projects:
                print(f"   - {project.get('name', 'Sans nom')} (ID: {project.get('id')})")
                print(f"     Créé: {project.get('inserted_at', 'N/A')}")
            return projects
        else:
            print("❌ Aucun projet trouvé")
            return []
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return []


def example_browse_project(account_id: str, project_id: str):
    """
    Exemple: Explorer le contenu d'un projet
    
    Args:
        account_id: ID du compte
        project_id: ID du projet
    """
    print(f"\n🗂️ EXEMPLE: Contenu du projet {project_id}")
    print("=" * 50)
    
    try:
        api = FrameioAPI()
        
        # Récupérer le dossier racine
        root_folder = api.get_project_root_folder(account_id, project_id)
        
        if not root_folder:
            print("❌ Impossible de récupérer le dossier racine")
            return
        
        root_folder_id = root_folder.get('id')
        print(f"📁 Dossier racine: {root_folder.get('name')} (ID: {root_folder_id})")
        
        # Lister le contenu
        contents = api.get_folder_contents(account_id, root_folder_id)
        
        if contents:
            print(f"\n📋 Contenu ({len(contents)} éléments):")
            for item in contents:
                item_type = "📁" if item.get('type') == 'folder' else "📄"
                print(f"   {item_type} {item.get('name', 'Sans nom')} (ID: {item.get('id')})")
                if item.get('type') == 'file':
                    print(f"      Taille: {item.get('filesize', 0)} bytes")
        else:
            print("📋 Dossier vide")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")


def example_upload_file(account_id: str, folder_id: str, file_path: str):
    """
    Exemple: Upload d'un fichier
    
    Args:
        account_id: ID du compte
        folder_id: ID du dossier destination
        file_path: Chemin vers le fichier à uploader
    """
    print(f"\n⬆️ EXEMPLE: Upload de fichier")
    print("=" * 40)
    
    try:
        api = FrameioAPI()
        file_path_obj = Path(file_path)
        
        if not file_path_obj.exists():
            print(f"❌ Fichier non trouvé: {file_path}")
            return
        
        result = api.upload_file(account_id, folder_id, file_path_obj)
        
        if result:
            print(f"✅ Upload réussi!")
            print(f"   Fichier: {result.get('name')}")
            print(f"   ID: {result.get('id')}")
        else:
            print("❌ Upload échoué")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")


def main():
    """Fonction principale avec exemples interactifs"""
    print("🎬 FRAME.IO API - EXEMPLES D'UTILISATION")
    print("=" * 60)
    print("Authentification OAuth Web App via Adobe IMS")
    print()
    
    try:
        # Vérifier l'authentification
        oauth = FrameioOAuth()
        if not oauth.ensure_valid_token():
            print("❌ Aucun token valide trouvé.")
            print("Lancez d'abord: python scripts/frameio_oauth_complete.py")
            return
        
        print("✅ Authentification OAuth valide")
        
        # Exemple 1: Infos utilisateur
        example_user_info()
        
        # Exemple 2: Liste des comptes
        accounts = example_list_accounts()
        
        if not accounts:
            print("\n❌ Aucun compte disponible pour les exemples suivants")
            return
        
        # Utiliser le premier compte pour les exemples
        account_id = accounts[0]['id']
        
        # Exemple 3: Liste des projets
        projects = example_list_projects(account_id)
        
        if projects:
            # Utiliser le premier projet pour l'exemple
            project_id = projects[0]['id']
            
            # Exemple 4: Explorer le projet
            example_browse_project(account_id, project_id)
        
        print("\n" + "=" * 60)
        print("✅ Exemples terminés avec succès!")
        print("💡 Consultez le code source pour plus d'exemples")
        
    except FrameioOAuthError as e:
        print(f"❌ Erreur OAuth: {e}")
        print("Relancez l'authentification avec frameio_oauth_complete.py")
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")


if __name__ == "__main__":
    main()
