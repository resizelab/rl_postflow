#!/usr/bin/env python3
"""
Test adaptatif d'authentification Frame.io v4
Teste plusieurs méthodes d'authentification selon la configuration disponible
"""

import asyncio
import os
import sys
import json
from pathlib import Path
import httpx

# Charger les variables d'environnement
try:
    from dotenv import load_dotenv
    env_file = Path(__file__).parent.parent / ".env"
    if env_file.exists():
        load_dotenv(env_file)
        print(f"✅ Variables d'environnement chargées")
    else:
        print("⚠️  Fichier .env non trouvé")
except ImportError:
    print("⚠️  python-dotenv non installé")

class FrameIOAuthTester:
    """Testeur d'authentification adaptatif pour Frame.io v4"""
    
    def __init__(self):
        self.client_id = os.getenv('FRAMEIO_CLIENT_ID')
        self.client_secret = os.getenv('FRAMEIO_CLIENT_SECRET')
        self.org_id = os.getenv('FRAMEIO_ORG_ID')
        self.technical_account_id = os.getenv('FRAMEIO_TECHNICAL_ACCOUNT_ID')
        self.ims_host = os.getenv('FRAMEIO_IMS_HOST', 'https://ims-na1.adobelogin.com')
        self.base_url = os.getenv('FRAMEIO_BASE_URL', 'https://api.frame.io/v4')
    
    async def test_client_credentials_oauth(self):
        """Test avec Client Credentials OAuth 2.0 (méthode simple)"""
        print("\n🔐 Test Client Credentials OAuth 2.0")
        print("-" * 40)
        
        if not self.client_id or not self.client_secret:
            print("❌ CLIENT_ID ou CLIENT_SECRET manquant")
            return False
        
        async with httpx.AsyncClient() as client:
            data = {
                'grant_type': 'client_credentials',
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'scope': 'openid'  # Scope minimal
            }
            
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
            
            try:
                response = await client.post(
                    f"{self.ims_host}/ims/token/v3",
                    data=data,
                    headers=headers
                )
                
                print(f"Status: {response.status_code}")
                
                if response.status_code == 200:
                    token_data = response.json()
                    access_token = token_data.get('access_token')
                    if access_token:
                        print(f"✅ Token obtenu: {access_token[:30]}...")
                        
                        # Test d'appel à Frame.io
                        await self.test_frameio_api(access_token)
                        return True
                else:
                    print(f"❌ Erreur {response.status_code}: {response.text}")
                    return False
                    
            except Exception as e:
                print(f"❌ Exception: {e}")
                return False
    
    async def test_frameio_scopes(self):
        """Test avec différents scopes Frame.io"""
        print("\n🎯 Test avec scopes Frame.io spécifiques")
        print("-" * 40)
        
        scopes_to_test = [
            'frame.io',
            'openid,frame.io', 
            'frameio.fullaccess',
            'openid,frameio.fullaccess',
            'ent_frame_sdk'
        ]
        
        for scope in scopes_to_test:
            print(f"\n🔍 Test scope: {scope}")
            
            async with httpx.AsyncClient() as client:
                data = {
                    'grant_type': 'client_credentials',
                    'client_id': self.client_id,
                    'client_secret': self.client_secret,
                    'scope': scope
                }
                
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
                
                try:
                    response = await client.post(
                        f"{self.ims_host}/ims/token/v3",
                        data=data,
                        headers=headers
                    )
                    
                    if response.status_code == 200:
                        token_data = response.json()
                        access_token = token_data.get('access_token')
                        print(f"   ✅ Token obtenu avec scope '{scope}': {access_token[:20]}...")
                        
                        # Test Frame.io
                        if await self.test_frameio_api(access_token, verbose=False):
                            print(f"   🎉 SUCCÈS avec scope '{scope}'!")
                            return True
                    else:
                        print(f"   ❌ Échec {response.status_code}: {response.text[:100]}...")
                        
                except Exception as e:
                    print(f"   ❌ Exception: {e}")
        
        return False
    
    async def test_frameio_api(self, access_token, verbose=True):
        """Test d'appel à l'API Frame.io"""
        if verbose:
            print(f"\n📡 Test de l'API Frame.io")
            print("-" * 30)
        
        endpoints_to_test = [
            ('/me', 'Profil utilisateur'),
            ('/accounts', 'Liste des comptes'),
            (f'/accounts/{os.getenv("FRAMEIO_ACCOUNT_ID", "test")}/workspaces', 'Workspaces')
        ]
        
        async with httpx.AsyncClient() as client:
            for endpoint, description in endpoints_to_test:
                try:
                    headers = {
                        'Authorization': f'Bearer {access_token}',
                        'Accept': 'application/json'
                    }
                    
                    response = await client.get(
                        f"{self.base_url}{endpoint}",
                        headers=headers
                    )
                    
                    if verbose:
                        print(f"   {description}: {response.status_code}")
                    
                    if response.status_code == 200:
                        data = response.json()
                        if verbose:
                            print(f"   ✅ Succès: {len(data.get('data', [data]))} élément(s)")
                        return True
                    elif response.status_code == 401:
                        if verbose:
                            print(f"   ❌ Non autorisé")
                        return False
                    elif response.status_code == 403:
                        if verbose:
                            print(f"   ❌ Accès refusé")
                        return False
                    else:
                        if verbose:
                            print(f"   ⚠️  Statut {response.status_code}")
                        
                except Exception as e:
                    if verbose:
                        print(f"   ❌ Exception: {e}")
        
        return False
    
    async def load_config_from_json(self):
        """Charge la configuration depuis les fichiers JSON disponibles"""
        print("\n📄 Chargement de la configuration depuis JSON")
        print("-" * 45)
        
        json_files = [
            Path(__file__).parent.parent / "data" / "890CarmineWhitefish-1845895-Production.json",
            Path(__file__).parent.parent / "data" / "890CarmineWhitefish-1845895-OAuth Web App.json"
        ]
        
        for json_file in json_files:
            if json_file.exists():
                try:
                    with open(json_file, 'r') as f:
                        config = json.load(f)
                    
                    print(f"✅ Chargé: {json_file.name}")
                    
                    # Extraire les informations utiles
                    if 'CLIENT_SECRET' in config:
                        # Format simple
                        print(f"   Client ID: {config.get('API_KEY', 'N/A')}")
                        print(f"   Client Secret: {config.get('CLIENT_SECRET', 'N/A')[:10]}...")
                    
                    elif 'project' in config:
                        # Format complexe
                        project = config['project']
                        org = project.get('org', {})
                        
                        print(f"   Projet: {project.get('name', 'N/A')}")
                        print(f"   Org ID: {org.get('id', 'N/A')}")
                        print(f"   IMS Org ID: {org.get('ims_org_id', 'N/A')}")
                        
                        # Chercher les credentials
                        workspace = project.get('workspace', {})
                        details = workspace.get('details', {})
                        credentials = details.get('credentials', [])
                        
                        for cred in credentials:
                            if 'oauth2' in cred:
                                oauth = cred['oauth2']
                                print(f"   Client ID: {oauth.get('client_id', 'N/A')}")
                                print(f"   Client Secret: {oauth.get('client_secret', 'N/A')[:10]}...")
                    
                except Exception as e:
                    print(f"❌ Erreur lecture {json_file.name}: {e}")
    
    async def run_all_tests(self):
        """Exécute tous les tests d'authentification"""
        print("🎬 TESTS D'AUTHENTIFICATION FRAME.IO V4")
        print("=" * 50)
        
        # Afficher la configuration
        print(f"Client ID: {self.client_id}")
        print(f"Client Secret: {self.client_secret[:10] if self.client_secret else 'N/A'}...")
        print(f"Org ID: {self.org_id}")
        print(f"Technical Account: {self.technical_account_id}")
        print(f"IMS Host: {self.ims_host}")
        print(f"Frame.io Base URL: {self.base_url}")
        
        # Charger config JSON
        await self.load_config_from_json()
        
        # Test 1: Client Credentials simple
        if await self.test_client_credentials_oauth():
            print("\n🎉 SUCCÈS avec Client Credentials OAuth!")
            return True
        
        # Test 2: Différents scopes
        if await self.test_frameio_scopes():
            print("\n🎉 SUCCÈS avec un scope spécifique!")
            return True
        
        print("\n❌ TOUS LES TESTS ONT ÉCHOUÉ")
        print("\n💡 Solutions possibles:")
        print("   1. Créer une application Server-to-Server sur Adobe Console")
        print("   2. Vérifier que Frame.io API est activé sur votre projet")
        print("   3. Vérifier les permissions de votre compte")
        return False

async def main():
    """Point d'entrée principal"""
    tester = FrameIOAuthTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())
