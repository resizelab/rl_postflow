#!/usr/bin/env python3
"""
Script de test adaptatif pour l'authentification Frame.io v4
Teste l'authentification JWT Server-to-Server et Client Credentials en fallback
"""

import os
import sys
import json
import time
import uuid
from pathlib import Path
from dotenv import load_dotenv
import httpx

# Charger les variables d'environnement
load_dotenv()

class FrameioAuthTester:
    """Testeur d'authentification Frame.io v4"""
    
    def __init__(self):
        self.client_id = os.getenv('FRAMEIO_CLIENT_ID')
        self.client_secret = os.getenv('FRAMEIO_CLIENT_SECRET')
        self.org_id = os.getenv('FRAMEIO_ORG_ID')
        self.technical_account_id = os.getenv('FRAMEIO_TECHNICAL_ACCOUNT_ID')
        self.private_key_path = os.getenv('FRAMEIO_PRIVATE_KEY_PATH')
        self.base_url = os.getenv('FRAMEIO_BASE_URL', 'https://api.frame.io/v4')
        self.ims_host = os.getenv('FRAMEIO_IMS_HOST', 'https://ims-na1.adobelogin.com')
        
        self.access_token = None
        
    def check_configuration(self):
        """Vérifie la configuration et détermine le mode d'authentification"""
        print("🔍 Vérification de la configuration...")
        
        missing_vars = []
        
        if not self.client_id:
            missing_vars.append("FRAMEIO_CLIENT_ID")
        if not self.client_secret:
            missing_vars.append("FRAMEIO_CLIENT_SECRET")
        if not self.org_id:
            missing_vars.append("FRAMEIO_ORG_ID")
            
        if missing_vars:
            print(f"❌ Variables manquantes : {', '.join(missing_vars)}")
            return False
            
        print(f"✅ Client ID : {self.client_id}")
        print(f"✅ Client Secret : {self.client_secret[:8]}...")
        print(f"✅ Organization ID : {self.org_id}")
        
        # Vérifier la configuration Server-to-Server
        s2s_available = True
        
        if not self.technical_account_id or "your_" in self.technical_account_id:
            print("⚠️  Technical Account ID manquant")
            s2s_available = False
            
        if not self.private_key_path or not Path(self.private_key_path).exists():
            print("⚠️  Clé privée manquante")
            s2s_available = False
            
        if s2s_available:
            print("✅ Configuration Server-to-Server disponible")
            return "server_to_server"
        else:
            print("⚠️  Configuration Server-to-Server incomplète")
            print("🔄 Tentative avec Client Credentials Flow...")
            return "client_credentials"
    
    def test_jwt_server_to_server(self):
        """Test de l'authentification JWT Server-to-Server"""
        print("\n🔐 Test JWT Server-to-Server...")
        
        try:
            import jwt
            from cryptography.hazmat.primitives import serialization
            
            # Charger la clé privée
            with open(self.private_key_path, 'rb') as f:
                private_key_data = f.read()
            
            # Décrypter la clé privée avec passphrase si nécessaire
            try:
                private_key = serialization.load_pem_private_key(
                    private_key_data,
                    password=None,
                    backend=None
                )
            except Exception:
                # Essayer avec passphrase
                passphrase = input("🔐 Entrez la passphrase de la clé privée : ")
                private_key = serialization.load_pem_private_key(
                    private_key_data,
                    password=passphrase.encode(),
                    backend=None
                )
            
            # Créer la JWT assertion
            payload = {
                "iss": self.org_id,
                "sub": self.technical_account_id,
                "aud": f"{self.ims_host}/c/{self.client_id}",
                "exp": int(time.time()) + 3600,  # 1 heure
                "jti": str(uuid.uuid4())
            }
            
            assertion = jwt.encode(payload, private_key, algorithm="RS256")
            
            # Demander le token d'accès
            token_data = {
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "jwt_token": assertion
            }
            
            with httpx.Client() as client:
                response = client.post(
                    f"{self.ims_host}/ims/token/v3",
                    data=token_data,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                if response.status_code == 200:
                    token_info = response.json()
                    self.access_token = token_info.get("access_token")
                    print(f"✅ Token JWT obtenu : {self.access_token[:20]}...")
                    return True
                else:
                    print(f"❌ Erreur JWT : {response.status_code}")
                    print(f"   Réponse : {response.text}")
                    return False
                    
        except Exception as e:
            print(f"❌ Erreur lors du test JWT : {e}")
            return False
    
    def test_client_credentials(self):
        """Test du Client Credentials Flow"""
        print("\n🔐 Test Client Credentials Flow...")
        
        try:
            token_data = {
                "grant_type": "client_credentials",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "scope": "frameio_api"
            }
            
            with httpx.Client() as client:
                response = client.post(
                    f"{self.ims_host}/ims/token/v3",
                    data=token_data,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                if response.status_code == 200:
                    token_info = response.json()
                    self.access_token = token_info.get("access_token")
                    print(f"✅ Token Client Credentials obtenu : {self.access_token[:20]}...")
                    return True
                else:
                    print(f"❌ Erreur Client Credentials : {response.status_code}")
                    print(f"   Réponse : {response.text}")
                    return False
                    
        except Exception as e:
            print(f"❌ Erreur lors du test Client Credentials : {e}")
            return False
    
    def test_frameio_api(self):
        """Test des endpoints Frame.io v4"""
        if not self.access_token:
            print("❌ Pas de token d'accès disponible")
            return False
            
        print("\n🧪 Test des endpoints Frame.io v4...")
        
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        # Test de l'endpoint /accounts
        try:
            with httpx.Client() as client:
                response = client.get(
                    f"{self.base_url}/accounts",
                    headers=headers
                )
                
                if response.status_code == 200:
                    accounts = response.json()
                    print(f"✅ Endpoint /accounts accessible")
                    print(f"   Nombre de comptes : {len(accounts.get('accounts', []))}")
                    return True
                else:
                    print(f"❌ Erreur API : {response.status_code}")
                    print(f"   Réponse : {response.text}")
                    return False
                    
        except Exception as e:
            print(f"❌ Erreur lors du test API : {e}")
            return False
    
    def run_tests(self):
        """Exécute tous les tests"""
        print("🚀 Test d'authentification Frame.io v4")
        print("=" * 50)
        
        # Vérifier la configuration
        auth_mode = self.check_configuration()
        if not auth_mode:
            sys.exit(1)
        
        # Tester l'authentification
        auth_success = False
        
        if auth_mode == "server_to_server":
            auth_success = self.test_jwt_server_to_server()
        
        if not auth_success and auth_mode == "client_credentials":
            auth_success = self.test_client_credentials()
        
        if not auth_success:
            print("\n❌ Tous les tests d'authentification ont échoué")
            sys.exit(1)
        
        # Tester l'API Frame.io
        if self.test_frameio_api():
            print("\n✅ Tous les tests ont réussi !")
            print("🎉 L'intégration Frame.io v4 est fonctionnelle")
        else:
            print("\n⚠️  Authentification réussie mais API inaccessible")
            print("   Vérifiez les permissions et la configuration")

def main():
    """Fonction principale"""
    tester = FrameioAuthTester()
    tester.run_tests()

if __name__ == "__main__":
    main()
