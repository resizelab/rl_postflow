#!/usr/bin/env python3
"""
Diagnostic des problèmes OAuth Frame.io avec Adobe IMS
Analyse la configuration et identifie les problèmes courants
"""

import json
import requests
import urllib.parse
import base64
import sys
from pathlib import Path

def analyze_current_token():
    """Analyser le token actuel dans la configuration"""
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    
    try:
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        current_token = config.get('frameio', {}).get('api_token')
        if not current_token:
            print("❌ Aucun token trouvé dans la configuration")
            return None
        
        print("🔍 ANALYSE DU TOKEN ACTUEL:")
        print("=" * 35)
        
        # Décoder le JWT pour analyser
        try:
            # Le token JWT a 3 parties séparées par des points
            parts = current_token.split('.')
            if len(parts) != 3:
                print("❌ Format de token invalide (pas un JWT)")
                return None
            
            # Décoder le header (première partie)
            header_data = json.loads(base64.urlsafe_b64decode(parts[0] + '=='))
            print(f"📋 Header JWT: {json.dumps(header_data, indent=2)}")
            
            # Décoder le payload (deuxième partie)
            payload_data = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))
            print(f"📋 Payload JWT: {json.dumps(payload_data, indent=2)}")
            
            # Vérifier l'expiration
            import time
            current_time = int(time.time())
            expires_at = payload_data.get('created_at', 0) + payload_data.get('expires_in', 0)
            
            if expires_at < current_time:
                print("⚠️  TOKEN EXPIRÉ")
            else:
                remaining = expires_at - current_time
                print(f"✅ Token valide pour encore {remaining} secondes")
            
            return payload_data
            
        except Exception as e:
            print(f"❌ Erreur décodage JWT: {e}")
            return None
            
    except Exception as e:
        print(f"❌ Erreur lecture config: {e}")
        return None

def check_oauth_config():
    """Vérifier la configuration OAuth"""
    oauth_file = Path(__file__).parent.parent / "data" / "890CarmineWhitefish-1845895-OAuth Web App.json"
    
    print("\n🔧 VÉRIFICATION CONFIG OAUTH:")
    print("=" * 35)
    
    if not oauth_file.exists():
        print(f"❌ Fichier OAuth non trouvé: {oauth_file}")
        return None
    
    with open(oauth_file, 'r') as f:
        oauth_data = json.load(f)
    
    config = {
        'client_id': oauth_data['API_KEY'],
        'client_secret': oauth_data['CLIENT_SECRET'],
        'redirect_uri': oauth_data['DEF_REDIRECT_URI']
    }
    
    print(f"✅ Client ID: {config['client_id']}")
    print(f"✅ Client Secret: {config['client_secret'][:10]}...")
    print(f"✅ Redirect URI: {config['redirect_uri']}")
    
    # Vérifications importantes
    print("\n🔍 VÉRIFICATIONS:")
    
    # 1. Redirect URI
    if config['redirect_uri'] == "https://localhost:8080/callback":
        print("⚠️  Redirect URI utilise localhost - assurez-vous qu'il correspond EXACTEMENT à celui configuré dans Adobe Developer Console")
    else:
        print(f"✅ Redirect URI: {config['redirect_uri']}")
    
    # 2. Client ID format
    if len(config['client_id']) == 32:
        print("✅ Client ID format correct (32 caractères)")
    else:
        print(f"⚠️  Client ID longueur inhabituelle: {len(config['client_id'])} caractères")
    
    return config

def test_adobe_ims_endpoints():
    """Tester la connectivité aux endpoints Adobe IMS"""
    print("\n🌐 TEST CONNECTIVITÉ ADOBE IMS:")
    print("=" * 35)
    
    endpoints = {
        'authorize': 'https://ims-na1.adobelogin.com/ims/authorize/v2',
        'token': 'https://ims-na1.adobelogin.com/ims/token/v3',
        'profile': 'https://ims-na1.adobelogin.com/ims/profile/v1'
    }
    
    for name, url in endpoints.items():
        try:
            response = requests.get(url, timeout=5)
            print(f"✅ {name}: {response.status_code}")
        except Exception as e:
            print(f"❌ {name}: {e}")

def generate_correct_auth_url(oauth_config):
    """Générer l'URL d'autorisation avec les bonnes pratiques"""
    print("\n🔗 URL D'AUTORISATION CORRIGÉE:")
    print("=" * 35)
    
    # Paramètres selon la documentation Adobe IMS
    base_url = "https://ims-na1.adobelogin.com/ims/authorize/v2"
    
    params = {
        'client_id': oauth_config['client_id'],
        'redirect_uri': oauth_config['redirect_uri'],
        'response_type': 'code',
        'scope': 'openid profile email offline_access',  # Ordre important
        'state': 'oauth_state_' + str(hash(oauth_config['client_id']))[:8]  # Pour sécurité
    }
    
    auth_url = f"{base_url}?" + urllib.parse.urlencode(params)
    
    print(f"URL: {auth_url}")
    print("\n📋 PARAMÈTRES:")
    for key, value in params.items():
        print(f"   {key}: {value}")

def check_common_oauth_issues():
    """Vérifier les problèmes courants OAuth"""
    print("\n🩺 DIAGNOSTIC PROBLÈMES COURANTS:")
    print("=" * 40)
    
    issues = [
        {
            'issue': 'Redirect URI mismatch',
            'description': 'Le redirect_uri doit être EXACTEMENT le même dans la console Adobe et dans la requête',
            'solution': 'Vérifiez que https://localhost:8080/callback est bien configuré dans Adobe Developer Console'
        },
        {
            'issue': 'Scopes non autorisés',
            'description': 'Les scopes demandés doivent être autorisés pour votre application',
            'solution': 'Dans Adobe Developer Console, vérifiez que les APIs Frame.io sont bien ajoutées à votre projet'
        },
        {
            'issue': 'Code d\'autorisation expiré',
            'description': 'Le code d\'autorisation expire rapidement (10 minutes)',
            'solution': 'Utilisez le code immédiatement après l\'avoir reçu'
        },
        {
            'issue': 'Code utilisé plusieurs fois',
            'description': 'Un code d\'autorisation ne peut être utilisé qu\'une seule fois',
            'solution': 'Obtenez un nouveau code si vous avez des erreurs'
        },
        {
            'issue': 'Client credentials incorrects',
            'description': 'Client ID ou Client Secret incorrect',
            'solution': 'Vérifiez les credentials dans Adobe Developer Console'
        }
    ]
    
    for i, issue in enumerate(issues, 1):
        print(f"{i}. 🔸 {issue['issue']}")
        print(f"   📝 {issue['description']}")
        print(f"   💡 {issue['solution']}")
        print()

def test_token_exchange_debug(oauth_config, test_code=None):
    """Tester l'échange de token avec debug détaillé"""
    print("\n🔄 TEST ÉCHANGE TOKEN (MODE DEBUG):")
    print("=" * 40)
    
    if not test_code:
        print("⚠️  Pas de code test fourni - simulation avec code factice")
        test_code = "test_code_123"
    
    token_url = "https://ims-na1.adobelogin.com/ims/token/v3"
    
    data = {
        'grant_type': 'authorization_code',
        'client_id': oauth_config['client_id'],
        'client_secret': oauth_config['client_secret'],
        'code': test_code,
        'redirect_uri': oauth_config['redirect_uri']
    }
    
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'PostFlow-OAuth/1.0'
    }
    
    print(f"📤 URL: {token_url}")
    print(f"📤 Headers: {headers}")
    print(f"📤 Data: {data}")
    
    try:
        response = requests.post(token_url, data=data, headers=headers, timeout=30)
        
        print(f"\n📥 Status: {response.status_code}")
        print(f"📥 Headers: {dict(response.headers)}")
        print(f"📥 Response: {response.text}")
        
        if response.status_code != 200:
            try:
                error_data = response.json()
                print(f"\n❌ Erreur détaillée: {json.dumps(error_data, indent=2)}")
                
                # Diagnostics spécifiques selon l'erreur
                error_code = error_data.get('error', '')
                if error_code == 'invalid_client':
                    print("\n💡 SOLUTION 'invalid_client':")
                    print("   - Vérifiez le client_id dans Adobe Developer Console")
                    print("   - Vérifiez le client_secret")
                    print("   - Assurez-vous que l'application est bien configurée pour OAuth")
                elif error_code == 'invalid_grant':
                    print("\n💡 SOLUTION 'invalid_grant':")
                    print("   - Le code d'autorisation est expiré ou invalide")
                    print("   - Obtenez un nouveau code d'autorisation")
                elif error_code == 'access_denied':
                    print("\n💡 SOLUTION 'access_denied':")
                    print("   - Vérifiez le redirect_uri exact")
                    print("   - Vérifiez les scopes autorisés")
                    print("   - Vérifiez que Frame.io API est bien ajoutée au projet Adobe")
                    
            except:
                print("❌ Impossible de décoder la réponse d'erreur")
        
    except Exception as e:
        print(f"❌ Exception: {e}")

def main():
    print("🔐 DIAGNOSTIC OAUTH FRAME.IO / ADOBE IMS")
    print("=" * 45)
    
    # 1. Analyser le token actuel
    current_token_data = analyze_current_token()
    
    # 2. Vérifier la config OAuth
    oauth_config = check_oauth_config()
    
    if oauth_config:
        # 3. Tester les endpoints
        test_adobe_ims_endpoints()
        
        # 4. Générer URL corrigée
        generate_correct_auth_url(oauth_config)
        
        # 5. Test d'échange avec code factice
        test_code = sys.argv[1] if len(sys.argv) > 1 else None
        test_token_exchange_debug(oauth_config, test_code)
    
    # 6. Problèmes courants
    check_common_oauth_issues()
    
    print("\n📋 PROCHAINES ÉTAPES RECOMMANDÉES:")
    print("=" * 35)
    print("1. Vérifiez dans Adobe Developer Console que :")
    print("   - Le redirect_uri est exactement : https://localhost:8080/callback")
    print("   - Les APIs Frame.io sont bien ajoutées au projet")
    print("   - L'application est configurée pour 'Web' (pas 'Single Page App')")
    print("2. Obtenez un nouveau code d'autorisation avec l'URL générée")
    print("3. Utilisez le code immédiatement après l'avoir reçu")
    print("4. Si problème persiste, créez une nouvelle application OAuth dans Adobe Console")

if __name__ == "__main__":
    main()
