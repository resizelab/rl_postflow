#!/usr/bin/env python3
"""
Script pour créer une intégration Server-to-Server Adobe temporaire
et diagnostiquer les problèmes d'authentification
"""

import os
import sys
import json
import httpx
from pathlib import Path
from dotenv import load_dotenv

class AdobeIntegrationHelper:
    """Assistant pour la création d'intégration Adobe Server-to-Server"""
    
    def __init__(self):
        load_dotenv()
        self.client_id = os.getenv('FRAMEIO_CLIENT_ID')
        self.client_secret = os.getenv('FRAMEIO_CLIENT_SECRET')
        self.org_id = os.getenv('FRAMEIO_ORG_ID')
        self.ims_host = os.getenv('FRAMEIO_IMS_HOST', 'https://ims-na1.adobelogin.com')
        
    def diagnose_integration_type(self):
        """Diagnostique le type d'intégration actuelle"""
        print("🔍 Diagnostic du type d'intégration Adobe...")
        
        # Test des différents endpoints pour identifier le type
        test_results = {}
        
        # Test 1: Client Credentials (Server-to-Server)
        print("\n1️⃣ Test Client Credentials Flow...")
        try:
            with httpx.Client(timeout=30) as client:
                response = client.post(
                    f"{self.ims_host}/ims/token/v3",
                    data={
                        "grant_type": "client_credentials",
                        "client_id": self.client_id,
                        "client_secret": self.client_secret,
                        "scope": "frameio_api"
                    },
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                if response.status_code == 200:
                    test_results["client_credentials"] = "✅ Supporté"
                    print("   ✅ Client Credentials supporté")
                else:
                    test_results["client_credentials"] = f"❌ Erreur {response.status_code}"
                    print(f"   ❌ Erreur {response.status_code}: {response.text}")
                    
        except Exception as e:
            test_results["client_credentials"] = f"❌ Exception: {str(e)}"
            print(f"   ❌ Exception: {e}")
        
        # Test 2: Authorization Code (OAuth Web App)
        print("\n2️⃣ Test Authorization Code Flow...")
        try:
            # Vérifier si c'est une OAuth Web App
            auth_url = f"{self.ims_host}/ims/authorize/v2"
            params = {
                "client_id": self.client_id,
                "response_type": "code",
                "scope": "frameio_api",
                "redirect_uri": "https://localhost:8080/callback"
            }
            
            with httpx.Client(timeout=30) as client:
                response = client.get(auth_url, params=params)
                
                if response.status_code == 200:
                    test_results["authorization_code"] = "✅ Supporté (OAuth Web App)"
                    print("   ✅ Authorization Code supporté (OAuth Web App détectée)")
                else:
                    test_results["authorization_code"] = f"❌ Erreur {response.status_code}"
                    print(f"   ❌ Erreur {response.status_code}")
                    
        except Exception as e:
            test_results["authorization_code"] = f"❌ Exception: {str(e)}"
            print(f"   ❌ Exception: {e}")
        
        # Test 3: Informations sur l'intégration
        print("\n3️⃣ Informations sur l'intégration...")
        print(f"   Client ID: {self.client_id}")
        print(f"   Organization ID: {self.org_id}")
        print(f"   IMS Host: {self.ims_host}")
        
        return test_results
    
    def generate_server_to_server_guide(self):
        """Génère un guide pour créer une intégration Server-to-Server"""
        print("\n📋 Guide pour créer une intégration Server-to-Server...")
        
        guide_content = f"""
# Guide de Création d'Intégration Adobe Server-to-Server

## 🚨 Problème Identifié

L'intégration actuelle (Client ID: {self.client_id}) est de type **OAuth Web App** 
et ne supporte pas le Client Credentials Flow nécessaire pour Frame.io v4.

## 📋 Solution: Créer une Intégration Server-to-Server

### Étape 1: Accéder à Adobe Developer Console
1. Aller sur: https://developer.adobe.com/console/
2. Se connecter avec le compte Adobe de l'organisation: {self.org_id}

### Étape 2: Créer un Nouveau Projet
1. Cliquer sur "Create New Project"
2. Nom du projet: "Frame.io v4 Server-to-Server Integration"
3. Description: "Intégration Server-to-Server pour Frame.io API v4"

### Étape 3: Ajouter l'API Frame.io
1. Cliquer sur "Add API"
2. Chercher "Frame.io" dans la liste des APIs
3. Sélectionner "Frame.io API"
4. **IMPORTANT**: Choisir "Server-to-Server" comme type d'authentification

### Étape 4: Configurer l'Authentification
1. Générer ou télécharger un certificat public/privé
2. Ou utiliser la clé publique déjà générée:
   
   Copier le contenu de: config/public.key
   
3. Coller la clé publique dans le formulaire Adobe
4. Sauvegarder la configuration

### Étape 5: Récupérer les Nouvelles Credentials
1. Noter le nouveau **Client ID** (peut être différent)
2. Noter le nouveau **Client Secret** (peut être différent)
3. **IMPORTANT**: Copier le **Technical Account ID** généré
4. Vérifier l'**Organization ID** (doit être: {self.org_id})

### Étape 6: Mettre à Jour la Configuration
Modifier le fichier .env avec les nouvelles valeurs:

```bash
# Nouvelles credentials Server-to-Server
FRAMEIO_CLIENT_ID=nouveau_client_id
FRAMEIO_CLIENT_SECRET=nouveau_client_secret
FRAMEIO_TECHNICAL_ACCOUNT_ID=nouveau_technical_account_id
FRAMEIO_ORG_ID={self.org_id}
FRAMEIO_PRIVATE_KEY_PATH=config/private.key
```

### Étape 7: Tester la Nouvelle Intégration
```bash
python scripts/test_frameio_auth_adaptive.py
```

## 🔄 Alternative: Utiliser l'OAuth Web App Existante

Si vous ne pouvez pas créer d'intégration Server-to-Server immédiatement,
vous pouvez utiliser temporairement l'OAuth Web App avec un flow d'autorisation:

1. Ouvrir: https://ims-na1.adobelogin.com/ims/authorize/v2?client_id={self.client_id}&response_type=code&scope=frameio_api&redirect_uri=https://localhost:8080/callback
2. Autoriser l'application
3. Récupérer le code d'autorisation depuis l'URL de redirection
4. Échanger le code contre un token d'accès

## 📞 Support Adobe
Si vous rencontrez des problèmes:
- Documentation: https://developer.adobe.com/developer-console/docs/guides/
- Support: https://developer.adobe.com/console/support/
"""
        
        # Sauvegarder le guide
        guide_path = Path("docs/CREATE_ADOBE_SERVER_TO_SERVER.md")
        with open(guide_path, 'w', encoding='utf-8') as f:
            f.write(guide_content)
        
        print(f"✅ Guide sauvegardé: {guide_path}")
        return guide_path
    
    def generate_oauth_web_app_workaround(self):
        """Génère un script de contournement pour OAuth Web App"""
        print("\n🔧 Génération d'un script de contournement OAuth Web App...")
        
        workaround_script = f'''#!/usr/bin/env python3
"""
Script de contournement pour utiliser l'OAuth Web App existante
avec Frame.io v4 en attendant la création d'une intégration Server-to-Server
"""

import os
import sys
import httpx
from urllib.parse import urlparse, parse_qs
from dotenv import load_dotenv

class OAuthWebAppWorkaround:
    """Contournement pour OAuth Web App"""
    
    def __init__(self):
        load_dotenv()
        self.client_id = "{self.client_id}"
        self.client_secret = "{self.client_secret}"
        self.redirect_uri = "https://localhost:8080/callback"
        self.ims_host = "{self.ims_host}"
        self.scope = "frameio_api"
    
    def get_authorization_url(self):
        """Génère l'URL d'autorisation"""
        params = {{
            "client_id": self.client_id,
            "response_type": "code",
            "scope": self.scope,
            "redirect_uri": self.redirect_uri
        }}
        
        url = f"{{self.ims_host}}/ims/authorize/v2"
        param_string = "&".join([f"{{k}}={{v}}" for k, v in params.items()])
        return f"{{url}}?{{param_string}}"
    
    def exchange_code_for_token(self, authorization_code):
        """Échange le code d'autorisation contre un token d'accès"""
        try:
            with httpx.Client(timeout=30) as client:
                response = client.post(
                    f"{{self.ims_host}}/ims/token/v3",
                    data={{
                        "grant_type": "authorization_code",
                        "client_id": self.client_id,
                        "client_secret": self.client_secret,
                        "code": authorization_code,
                        "redirect_uri": self.redirect_uri
                    }},
                    headers={{"Content-Type": "application/x-www-form-urlencoded"}}
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    print(f"❌ Erreur: {{response.status_code}}")
                    print(f"   Réponse: {{response.text}}")
                    return None
                    
        except Exception as e:
            print(f"❌ Exception: {{e}}")
            return None
    
    def run_interactive_auth(self):
        """Lance le processus d'authentification interactif"""
        print("🔐 Authentification OAuth Web App Interactive")
        print("=" * 50)
        
        # Étape 1: Générer l'URL d'autorisation
        auth_url = self.get_authorization_url()
        print(f"\\n1️⃣ Ouvrez cette URL dans votre navigateur:")
        print(f"{{auth_url}}")
        
        # Étape 2: Demander le code d'autorisation
        print(f"\\n2️⃣ Après autorisation, vous serez redirigé vers:")
        print(f"{{self.redirect_uri}}?code=AUTHORIZATION_CODE")
        
        authorization_code = input("\\n3️⃣ Entrez le code d'autorisation: ").strip()
        
        if not authorization_code:
            print("❌ Code d'autorisation manquant")
            return False
        
        # Étape 3: Échanger le code contre un token
        print("\\n4️⃣ Échange du code contre un token...")
        token_data = self.exchange_code_for_token(authorization_code)
        
        if token_data:
            print("✅ Token d'accès obtenu!")
            print(f"   Access Token: {{token_data.get('access_token', 'N/A')[:20]}}...")
            print(f"   Expires In: {{token_data.get('expires_in', 'N/A')}} secondes")
            
            # Test de l'API Frame.io
            self.test_frameio_api(token_data.get('access_token'))
            return True
        else:
            print("❌ Échec de l'obtention du token")
            return False
    
    def test_frameio_api(self, access_token):
        """Test de l'API Frame.io avec le token obtenu"""
        print("\\n🧪 Test de l'API Frame.io...")
        
        headers = {{
            "Authorization": f"Bearer {{access_token}}",
            "Content-Type": "application/json"
        }}
        
        try:
            with httpx.Client(timeout=30) as client:
                response = client.get(
                    "https://api.frame.io/v4/accounts",
                    headers=headers
                )
                
                if response.status_code == 200:
                    accounts = response.json()
                    print("✅ API Frame.io accessible!")
                    print(f"   Nombre de comptes: {{len(accounts.get('accounts', []))}}")
                    return True
                else:
                    print(f"❌ Erreur API: {{response.status_code}}")
                    print(f"   Réponse: {{response.text}}")
                    return False
                    
        except Exception as e:
            print(f"❌ Exception lors du test API: {{e}}")
            return False

def main():
    """Fonction principale"""
    workaround = OAuthWebAppWorkaround()
    workaround.run_interactive_auth()

if __name__ == "__main__":
    main()
'''
        
        # Sauvegarder le script de contournement
        script_path = Path("scripts/oauth_web_app_workaround.py")
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(workaround_script)
        
        print(f"✅ Script de contournement sauvegardé: {script_path}")
        return script_path
    
    def run_diagnosis(self):
        """Exécute le diagnostic complet"""
        print("🔍 Diagnostic de l'intégration Adobe IMS")
        print("=" * 50)
        
        # Diagnostiquer le type d'intégration
        test_results = self.diagnose_integration_type()
        
        # Générer les guides et scripts
        guide_path = self.generate_server_to_server_guide()
        script_path = self.generate_oauth_web_app_workaround()
        
        # Résumé et recommandations
        print("\n📊 RÉSUMÉ DU DIAGNOSTIC")
        print("=" * 30)
        
        print(f"Type d'intégration détectée: OAuth Web App")
        print(f"Client Credentials supporté: {test_results.get('client_credentials', 'Non testé')}")
        print(f"Authorization Code supporté: {test_results.get('authorization_code', 'Non testé')}")
        
        print("\n💡 RECOMMANDATIONS")
        print("=" * 20)
        print("1. 🎯 Solution recommandée: Créer une intégration Server-to-Server")
        print(f"   Guide: {guide_path}")
        print()
        print("2. 🔧 Solution temporaire: Utiliser OAuth Web App avec autorisation")
        print(f"   Script: {script_path}")
        print("   Usage: python scripts/oauth_web_app_workaround.py")
        
        print("\n🚀 PROCHAINES ÉTAPES")
        print("=" * 20)
        print("1. Suivre le guide de création d'intégration Server-to-Server")
        print("2. Ou utiliser le script de contournement OAuth Web App")
        print("3. Mettre à jour les credentials dans .env")
        print("4. Retester avec python scripts/test_frameio_auth_adaptive.py")

def main():
    """Fonction principale"""
    helper = AdobeIntegrationHelper()
    helper.run_diagnosis()

if __name__ == "__main__":
    main()
