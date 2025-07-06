#!/usr/bin/env python3
"""
Test de connexion réel à Frame.io v4 pour récupérer les projets
Utilise l'authentification Client Credentials en fallback si JWT Server-to-Server n'est pas disponible
"""

import asyncio
import os
import sys
import json
import httpx
from pathlib import Path
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Ajouter le répertoire racine au PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent))

class FrameioConnectionTest:
    """Test de connexion Frame.io v4 avec authentification adaptative"""
    
    def __init__(self):
        self.client_id = os.getenv('FRAMEIO_CLIENT_ID')
        self.client_secret = os.getenv('FRAMEIO_CLIENT_SECRET')
        self.org_id = os.getenv('FRAMEIO_ORG_ID')
        self.account_id = os.getenv('FRAMEIO_ACCOUNT_ID')
        self.workspace_id = os.getenv('FRAMEIO_WORKSPACE_ID')
        self.base_url = os.getenv('FRAMEIO_BASE_URL', 'https://api.frame.io/v4')
        self.ims_host = os.getenv('FRAMEIO_IMS_HOST', 'https://ims-na1.adobelogin.com')
        
        self.access_token = None
        self.auth_method = None
        
    def check_configuration(self):
        """Vérifie la configuration"""
        print("🔍 Vérification de la configuration...")
        
        required_vars = [
            ('FRAMEIO_CLIENT_ID', self.client_id),
            ('FRAMEIO_CLIENT_SECRET', self.client_secret),
            ('FRAMEIO_ORG_ID', self.org_id),
            ('FRAMEIO_ACCOUNT_ID', self.account_id),
            ('FRAMEIO_WORKSPACE_ID', self.workspace_id)
        ]
        
        missing_vars = []
        
        for var_name, var_value in required_vars:
            if var_value and "your_" not in var_value:
                print(f"   ✅ {var_name}: {var_value[:15]}...")
            else:
                print(f"   ❌ {var_name}: Non configuré")
                missing_vars.append(var_name)
        
        if missing_vars:
            print(f"\n❌ Variables manquantes: {', '.join(missing_vars)}")
            return False
        
        print("✅ Configuration valide")
        return True
    
    async def try_client_credentials_auth(self):
        """Tente l'authentification Client Credentials"""
        print("\n🔐 Test Client Credentials Flow...")
        
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                data = {
                    "grant_type": "client_credentials",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "scope": "frameio_api"
                }
                
                response = await client.post(
                    f"{self.ims_host}/ims/token/v3",
                    data=data,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                if response.status_code == 200:
                    token_data = response.json()
                    self.access_token = token_data.get("access_token")
                    self.auth_method = "Client Credentials"
                    print(f"   ✅ Token obtenu: {self.access_token[:20]}...")
                    return True
                else:
                    print(f"   ❌ Erreur {response.status_code}: {response.text}")
                    return False
                    
        except Exception as e:
            print(f"   ❌ Exception: {e}")
            return False
    
    async def try_authorization_code_auth(self):
        """Guide pour l'authentification Authorization Code (interactif)"""
        print("\n🔐 Option Authorization Code Flow (interactif)...")
        
        # Générer l'URL d'autorisation
        auth_url = (
            f"{self.ims_host}/ims/authorize/v2?"
            f"client_id={self.client_id}&"
            f"response_type=code&"
            f"scope=frameio_api&"
            f"redirect_uri=https://localhost:8080/callback"
        )
        
        print(f"   📋 Pour utiliser cette méthode:")
        print(f"   1. Ouvrez cette URL: {auth_url}")
        print(f"   2. Autorisez l'application")
        print(f"   3. Récupérez le code depuis l'URL de redirection")
        
        use_interactive = input("\n   Voulez-vous essayer maintenant ? (y/N): ")
        
        if use_interactive.lower() == 'y':
            auth_code = input("   Entrez le code d'autorisation: ").strip()
            
            if auth_code:
                try:
                    async with httpx.AsyncClient(timeout=30) as client:
                        data = {
                            "grant_type": "authorization_code",
                            "client_id": self.client_id,
                            "client_secret": self.client_secret,
                            "code": auth_code,
                            "redirect_uri": "https://localhost:8080/callback"
                        }
                        
                        response = await client.post(
                            f"{self.ims_host}/ims/token/v3",
                            data=data,
                            headers={"Content-Type": "application/x-www-form-urlencoded"}
                        )
                        
                        if response.status_code == 200:
                            token_data = response.json()
                            self.access_token = token_data.get("access_token")
                            self.auth_method = "Authorization Code"
                            print(f"   ✅ Token obtenu: {self.access_token[:20]}...")
                            return True
                        else:
                            print(f"   ❌ Erreur {response.status_code}: {response.text}")
                            return False
                            
                except Exception as e:
                    print(f"   ❌ Exception: {e}")
                    return False
        
        return False
    
    async def test_frame_io_connection(self):
        """Test de la connexion à l'API Frame.io"""
        if not self.access_token:
            print("\n❌ Pas de token d'accès disponible")
            return False
        
        print(f"\n🌐 Test de connexion Frame.io avec {self.auth_method}...")
        
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                # Test 1: Endpoint /accounts
                print("   📋 Test endpoint /accounts...")
                response = await client.get(f"{self.base_url}/accounts", headers=headers)
                
                if response.status_code == 200:
                    accounts_data = response.json()
                    accounts = accounts_data.get('accounts', [])
                    print(f"   ✅ Comptes récupérés: {len(accounts)} compte(s)")
                    
                    for account in accounts:
                        print(f"      - {account.get('name', 'N/A')} (ID: {account.get('id', 'N/A')})")
                else:
                    print(f"   ❌ Erreur /accounts: {response.status_code} - {response.text}")
                    return False
                
                # Test 2: Endpoint /projects
                print("\n   📁 Test endpoint /projects...")
                
                # Essayer avec l'account_id spécifique
                projects_url = f"{self.base_url}/accounts/{self.account_id}/projects"
                response = await client.get(projects_url, headers=headers)
                
                if response.status_code == 200:
                    projects_data = response.json()
                    projects = projects_data.get('projects', [])
                    print(f"   ✅ Projets récupérés: {len(projects)} projet(s)")
                    
                    for project in projects:
                        print(f"      - {project.get('name', 'N/A')} (ID: {project.get('id', 'N/A')})")
                        print(f"        Status: {project.get('status', 'N/A')}")
                        print(f"        Workspace: {project.get('workspace_id', 'N/A')}")
                    
                    # Sauvegarder les résultats
                    result_data = {
                        "timestamp": "2024-07-06T00:00:00Z",
                        "auth_method": self.auth_method,
                        "accounts": accounts_data,
                        "projects": projects_data,
                        "test_status": "success"
                    }
                    
                    result_path = Path("output/frameio_connection_test.json")
                    with open(result_path, 'w', encoding='utf-8') as f:
                        json.dump(result_data, f, indent=2, ensure_ascii=False)
                    
                    print(f"\n   📄 Résultats sauvegardés: {result_path}")
                    return True
                    
                else:
                    print(f"   ❌ Erreur /projects: {response.status_code} - {response.text}")
                    
                    # Essayer l'endpoint général des projets
                    print("   🔄 Tentative endpoint /projects général...")
                    response = await client.get(f"{self.base_url}/projects", headers=headers)
                    
                    if response.status_code == 200:
                        projects_data = response.json()
                        projects = projects_data.get('projects', [])
                        print(f"   ✅ Projets récupérés (général): {len(projects)} projet(s)")
                        return True
                    else:
                        print(f"   ❌ Erreur /projects (général): {response.status_code} - {response.text}")
                        return False
                        
        except Exception as e:
            print(f"   ❌ Exception lors du test: {e}")
            return False
    
    async def run_connection_test(self):
        """Exécute le test de connexion complet"""
        print("🚀 TEST DE CONNEXION FRAME.IO V4")
        print("=" * 40)
        
        # Vérifier la configuration
        if not self.check_configuration():
            return False
        
        # Essayer les différentes méthodes d'authentification
        auth_success = False
        
        # 1. Client Credentials (automatique)
        auth_success = await self.try_client_credentials_auth()
        
        # 2. Authorization Code (interactif) si Client Credentials échoue
        if not auth_success:
            auth_success = await self.try_authorization_code_auth()
        
        if not auth_success:
            print("\n❌ Toutes les méthodes d'authentification ont échoué")
            print("\n💡 Solutions possibles:")
            print("1. Créer une intégration Server-to-Server dans Adobe Developer Console")
            print("2. Vérifier que l'intégration actuelle supporte les API Frame.io")
            print("3. Contacter le support Adobe pour assistance")
            return False
        
        # Tester la connexion Frame.io
        connection_success = await self.test_frame_io_connection()
        
        if connection_success:
            print("\n🎉 TEST DE CONNEXION RÉUSSI !")
            print(f"✅ Authentification: {self.auth_method}")
            print("✅ Projets Frame.io récupérés avec succès")
            print("✅ L'intégration Frame.io v4 fonctionne")
        else:
            print("\n⚠️ Authentification réussie mais accès API limité")
            print("🔧 Vérifiez les permissions de l'intégration Adobe")
        
        return connection_success

async def main():
    """Fonction principale"""
    test = FrameioConnectionTest()
    await test.run_connection_test()

if __name__ == "__main__":
    asyncio.run(main())

# [ARCHIVÉ] Ce script est obsolète : l'intégration Frame.io utilise uniquement OAuth Web App v4.
# Voir scripts/frameio_oauth_webapp_demo.py
