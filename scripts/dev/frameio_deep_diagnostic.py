#!/usr/bin/env python3
"""
Diagnostic approfondi Frame.io OAuth - Test de tous les endpoints possibles
"""

import json
import requests
import base64
import jwt
from pathlib import Path
from datetime import datetime

def load_token():
    """Charge le token depuis integrations.json"""
    project_root = Path(__file__).parent.parent
    integrations_file = project_root / "config" / "integrations.json"
    
    with open(integrations_file, 'r') as f:
        integrations = json.load(f)
    
    frameio_config = integrations['frameio']
    
    # Essayer différents noms de clés pour le token
    for key in ['access_token', 'api_token', 'token']:
        if key in frameio_config:
            return frameio_config[key]
    
    raise ValueError("Aucun token trouvé dans la configuration")

def decode_token_details(token):
    """Décode le token JWT pour voir tous les détails"""
    try:
        # Décoder sans vérification de signature (pour debug)
        decoded = jwt.decode(token, options={"verify_signature": False})
        return decoded
    except Exception as e:
        print(f"Erreur décodage token: {e}")
        return None

def test_adobe_endpoints(token):
    """Test des endpoints Adobe IMS"""
    print("\n🔍 TEST ENDPOINTS ADOBE IMS")
    print("=" * 50)
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    # Test OpenID Configuration
    print("📋 Test OpenID Configuration...")
    config_url = "https://ims-na1.adobelogin.com/ims/.well-known/openid-configuration"
    try:
        config_response = requests.get(config_url)
        if config_response.status_code == 200:
            config_data = config_response.json()
            print(f"   ✅ OpenID Config récupérée")
            print(f"   Scopes supportés: {config_data.get('scopes_supported', [])}")
            print(f"   Auth methods: {config_data.get('token_endpoint_auth_methods_supported', [])}")
        else:
            print(f"   ❌ Erreur config: {config_response.status_code}")
    except Exception as e:
        print(f"   💥 Erreur config: {e}")
    
    # Test userinfo avec client_id
    print(f"\n📊 Test Adobe /userinfo...")
    
    # Charger le client_id
    project_root = Path(__file__).parent.parent
    oauth_file = project_root / "data" / "890CarmineWhitefish-1845895-OAuth Web App.json"
    with open(oauth_file, 'r') as f:
        oauth_data = json.load(f)
    client_id = oauth_data['API_KEY']
    
    # Test avec client_id (comme dans la doc)
    userinfo_url = f"https://ims-na1.adobelogin.com/ims/userinfo/v2?client_id={client_id}"
    response = requests.get(userinfo_url, headers=headers)
    print(f"   Statut /userinfo (avec client_id): {response.status_code}")
    
    if response.status_code == 200:
        user_data = response.json()
        print(f"   ✅ Authentification Adobe réussie")
        print(f"   Sub: {user_data.get('sub', 'N/A')}")
        print(f"   Email: {user_data.get('email', 'N/A')}")
        print(f"   Name: {user_data.get('name', 'N/A')}")
        print(f"   Account Type: {user_data.get('account_type', 'N/A')}")
        print(f"   Email Verified: {user_data.get('email_verified', 'N/A')}")
        return user_data
    else:
        try:
            error_data = response.json()
            print(f"   ❌ Erreur: {error_data}")
        except:
            print(f"   ❌ Réponse: {response.text}")
        
        # Test sans client_id
        print(f"\n📊 Test Adobe /userinfo (sans client_id)...")
        userinfo_url_simple = "https://ims-na1.adobelogin.com/ims/userinfo/v2"
        response2 = requests.get(userinfo_url_simple, headers=headers)
        print(f"   Statut /userinfo (sans client_id): {response2.status_code}")
        
        if response2.status_code == 200:
            user_data = response2.json()
            print(f"   ✅ Authentification Adobe réussie (méthode alternative)")
            print(f"   Sub: {user_data.get('sub', 'N/A')}")
            print(f"   Email: {user_data.get('email', 'N/A')}")
            print(f"   Name: {user_data.get('name', 'N/A')}")
            return user_data
        
        return None

def test_frameio_special_auth(token):
    """Test des méthodes d'authentification spéciales pour Frame.io"""
    print("\n🎬 TEST AUTHENTIFICATION SPÉCIALE FRAME.IO")
    print("=" * 60)
    
    # Décoder le token pour extraire des infos
    token_details = decode_token_details(token)
    
    if token_details:
        user_id = token_details.get('user_id')
        client_id = token_details.get('client_id')
        sub = token_details.get('sub')
        
        print(f"📋 Infos token:")
        print(f"   User ID: {user_id}")
        print(f"   Client ID: {client_id}")
        print(f"   Sub: {sub}")
    
    # Test 1: Header X-Adobe-Token
    print(f"\n🔍 Test 1: Header X-Adobe-Token")
    headers_adobe = {
        'X-Adobe-Token': token,
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get("https://api.frame.io/v4/me", headers=headers_adobe)
        print(f"   X-Adobe-Token: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ SUCCÈS avec X-Adobe-Token!")
            return True
        else:
            try:
                error = response.json()
                print(f"   ❌ {error}")
            except:
                print(f"   ❌ {response.text[:100]}")
    except Exception as e:
        print(f"   💥 Erreur: {e}")
    
    # Test 2: Header X-Frame-Token
    print(f"\n🔍 Test 2: Header X-Frame-Token")
    headers_frame = {
        'X-Frame-Token': token,
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get("https://api.frame.io/v4/me", headers=headers_frame)
        print(f"   X-Frame-Token: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ SUCCÈS avec X-Frame-Token!")
            return True
        else:
            try:
                error = response.json()
                print(f"   ❌ {error}")
            except:
                print(f"   ❌ {response.text[:100]}")
    except Exception as e:
        print(f"   💥 Erreur: {e}")
    
    # Test 3: Bearer token avec User-Agent spécial
    print(f"\n🔍 Test 3: Bearer + User-Agent Adobe")
    headers_ua = {
        'Authorization': f'Bearer {token}',
        'User-Agent': 'Adobe-IMS-OAuth/1.0',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get("https://api.frame.io/v4/me", headers=headers_ua)
        print(f"   Bearer + UA Adobe: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ SUCCÈS avec User-Agent Adobe!")
            return True
        else:
            try:
                error = response.json()
                print(f"   ❌ {error}")
            except:
                print(f"   ❌ {response.text[:100]}")
    except Exception as e:
        print(f"   💥 Erreur: {e}")
    
    # Test 4: Authorization avec sub (user ID)
    if token_details and token_details.get('sub'):
        print(f"\n🔍 Test 4: Auth avec Sub ID")
        headers_sub = {
            'Authorization': f'Bearer {token}',
            'X-Adobe-User-ID': token_details.get('sub'),
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.get("https://api.frame.io/v4/me", headers=headers_sub)
            print(f"   Bearer + X-Adobe-User-ID: {response.status_code}")
            if response.status_code == 200:
                print("   ✅ SUCCÈS avec X-Adobe-User-ID!")
                return True
            else:
                try:
                    error = response.json()
                    print(f"   ❌ {error}")
                except:
                    print(f"   ❌ {response.text[:100]}")
        except Exception as e:
            print(f"   💥 Erreur: {e}")
    
    # Test 5: Endpoint Frame.io avec Adobe IMS
    print(f"\n🔍 Test 5: Endpoint Frame.io Adobe IMS")
    frameio_adobe_endpoints = [
        "https://api.frame.io/v4/adobe/me",
        "https://api.frame.io/v4/ims/me",
        "https://api.frame.io/v4/auth/adobe/me",
        "https://api.frame.io/adobe/v4/me",
    ]
    
    for endpoint in frameio_adobe_endpoints:
        try:
            headers_standard = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = requests.get(endpoint, headers=headers_standard)
            print(f"   {endpoint}: {response.status_code}")
            if response.status_code == 200:
                print(f"   ✅ SUCCÈS avec {endpoint}!")
                return True
            elif response.status_code != 404:
                try:
                    error = response.json()
                    print(f"      {error}")
                except:
                    print(f"      {response.text[:100]}")
        except Exception as e:
            print(f"   💥 Erreur {endpoint}: {e}")
    
    return False

def test_frameio_v4_endpoints(token):
    """Test exhaustif des endpoints Frame.io V4"""
    print("\n🎬 TEST ENDPOINTS FRAME.IO V4")
    print("=" * 50)
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    endpoints_to_test = [
        ("GET", "/v4/me", "Informations utilisateur"),
        ("GET", "/v4/accounts", "Liste des comptes"),
        ("GET", "/v4/teams", "Liste des équipes"),
        ("GET", "/v4/users/me", "Profil utilisateur alternatif"),
        ("GET", "/v4/auth/me", "Auth check"),
        ("GET", "/v4/user", "User endpoint alternatif"),
    ]
    
    base_url = "https://api.frame.io"
    
    for method, endpoint, description in endpoints_to_test:
        url = f"{base_url}{endpoint}"
        
        try:
            if method == "GET":
                response = requests.get(url, headers=headers)
            else:
                response = requests.request(method, url, headers=headers)
            
            print(f"📊 {method} {endpoint}: {response.status_code} - {description}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    if isinstance(data, dict):
                        # Afficher quelques clés importantes
                        keys = list(data.keys())[:5]
                        print(f"   ✅ Clés: {keys}")
                        if 'id' in data:
                            print(f"   ID: {data['id']}")
                        if 'name' in data:
                            print(f"   Nom: {data['name']}")
                        if 'email' in data:
                            print(f"   Email: {data['email']}")
                    elif isinstance(data, list):
                        print(f"   ✅ Liste de {len(data)} éléments")
                except:
                    print(f"   ✅ Réponse non-JSON")
            
            elif response.status_code == 401:
                try:
                    error_data = response.json()
                    print(f"   ❌ {error_data}")
                except:
                    print(f"   ❌ {response.text[:100]}")
            
            elif response.status_code == 403:
                print(f"   🚫 Accès interdit")
            
            elif response.status_code == 404:
                print(f"   🔍 Endpoint non trouvé")
            
            else:
                try:
                    error_data = response.json()
                    print(f"   ⚠️ {error_data}")
                except:
                    print(f"   ⚠️ {response.text[:100]}")
                    
        except Exception as e:
            print(f"   💥 Erreur: {e}")

def test_frameio_v2_endpoints(token):
    """Test des endpoints Frame.io V2 (legacy)"""
    print("\n🎬 TEST ENDPOINTS FRAME.IO V2 (LEGACY)")
    print("=" * 50)
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    endpoints_to_test = [
        ("GET", "/v2/me", "Informations utilisateur V2"),
        ("GET", "/v2/accounts", "Liste des comptes V2"),
        ("GET", "/v2/teams", "Liste des équipes V2"),
    ]
    
    base_url = "https://api.frame.io"
    
    for method, endpoint, description in endpoints_to_test:
        url = f"{base_url}{endpoint}"
        
        try:
            response = requests.get(url, headers=headers)
            print(f"📊 {method} {endpoint}: {response.status_code} - {description}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    print(f"   ✅ Succès V2!")
                    if isinstance(data, dict) and 'id' in data:
                        print(f"   ID: {data['id']}")
                except:
                    print(f"   ✅ Réponse non-JSON")
            else:
                try:
                    error_data = response.json()
                    print(f"   ❌ {error_data}")
                except:
                    print(f"   ❌ {response.text[:100]}")
                    
        except Exception as e:
            print(f"   💥 Erreur: {e}")

def test_token_validation(token):
    """Test de validation du token avec différents headers"""
    print("\n🔐 TEST VALIDATION TOKEN")
    print("=" * 50)
    
    # Test avec différents formats d'authorization
    auth_formats = [
        ("Bearer", f"Bearer {token}"),
        ("bearer", f"bearer {token}"),
        ("Token", f"Token {token}"),
        ("JWT", f"JWT {token}"),
    ]
    
    endpoint = "https://api.frame.io/v4/me"
    
    for format_name, auth_header in auth_formats:
        headers = {
            'Authorization': auth_header,
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.get(endpoint, headers=headers)
            print(f"📊 Format {format_name}: {response.status_code}")
            
            if response.status_code == 200:
                print(f"   ✅ SUCCÈS avec format {format_name}!")
                return True
                
        except Exception as e:
            print(f"   💥 Erreur {format_name}: {e}")
    
    return False

def check_token_expiry(token_details):
    """Vérifie si le token a expiré"""
    if not token_details:
        return None
    
    exp = token_details.get('exp')
    if exp:
        exp_time = datetime.fromtimestamp(exp)
        current_time = datetime.now()
        
        print(f"\n⏰ VÉRIFICATION EXPIRATION")
        print("=" * 50)
        print(f"Token expire le: {exp_time}")
        print(f"Heure actuelle: {current_time}")
        
        if current_time > exp_time:
            print("❌ TOKEN EXPIRÉ!")
            return False
        else:
            remaining = exp_time - current_time
            print(f"✅ Token valide encore {remaining}")
            return True
    
    return None

def main():
    """Fonction principale"""
    print("🔬 DIAGNOSTIC APPROFONDI FRAME.IO OAUTH")
    print("=" * 60)
    
    # Charger le token
    try:
        token = load_token()
        print(f"✅ Token chargé: {token[:30]}...{token[-20:]}")
    except Exception as e:
        print(f"❌ Impossible de charger le token: {e}")
        return
    
    # Décoder le token
    print(f"\n🔍 ANALYSE DÉTAILLÉE DU TOKEN")
    print("=" * 50)
    token_details = decode_token_details(token)
    
    if token_details:
        print("📋 Contenu du token:")
        for key, value in token_details.items():
            if key in ['exp', 'iat', 'created_at']:
                # Convertir les timestamps
                try:
                    time_val = datetime.fromtimestamp(int(str(value)[:10]))
                    print(f"   {key}: {value} ({time_val})")
                except:
                    print(f"   {key}: {value}")
            else:
                print(f"   {key}: {value}")
        
        # Vérifier expiration
        check_token_expiry(token_details)
    
    # Test Adobe
    adobe_user = test_adobe_endpoints(token)
    
    # Test authentification spéciale Frame.io
    special_auth_success = test_frameio_special_auth(token)
    
    # Test validation token avec différents formats
    token_valid = test_token_validation(token)
    
    # Test Frame.io V4 seulement si l'auth spéciale a échoué
    if not special_auth_success:
        test_frameio_v4_endpoints(token)
    
    # Test Frame.io V2
    test_frameio_v2_endpoints(token)
    
    # Conclusion
    print(f"\n🎯 CONCLUSION")
    print("=" * 50)
    
    if adobe_user:
        print("✅ Authentification Adobe IMS: OK")
        print(f"   Adobe User ID: {adobe_user.get('user_id', 'N/A')}")
    else:
        print("❌ Authentification Adobe IMS: ÉCHEC")
    
    if token_valid:
        print("✅ Format du token: OK")
    else:
        print("❌ Problème avec le format du token ou l'accès Frame.io")
    
    print("\n💡 RECOMMANDATIONS:")
    print("1. Vérifiez que votre compte Adobe est bien lié à Frame.io")
    print("2. Vérifiez dans la console Adobe Developer que l'app a accès à Frame.io")
    print("3. Contactez le support Frame.io si le problème persiste")

if __name__ == "__main__":
    main()
