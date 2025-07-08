#!/usr/bin/env python3
"""
Diagnostic avancé du token Adobe IMS pour Frame.io
"""

import json
import requests
from pathlib import Path

def load_current_token():
    """Charger le token actuel"""
    config_file = Path(__file__).parent.parent / "config" / "integrations.json"
    
    with open(config_file, 'r') as f:
        config = json.load(f)
    
    return config['frameio']['api_token']

def test_adobe_token_info(access_token):
    """Tester les informations du token Adobe IMS"""
    print("🔍 DIAGNOSTIC TOKEN ADOBE IMS")
    print("=" * 40)
    
    # Test 1: Informations utilisateur Adobe
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    # Endpoint Adobe IMS pour les infos utilisateur
    adobe_url = "https://ims-na1.adobelogin.com/ims/userinfo/v2"
    
    try:
        print("📊 Test Adobe IMS /userinfo...")
        response = requests.get(adobe_url, headers=headers, timeout=10)
        print(f"   Statut: {response.status_code}")
        
        if response.status_code == 200:
            user_info = response.json()
            print("   ✅ Token Adobe valide")
            print(f"   Utilisateur: {user_info.get('name', 'N/A')}")
            print(f"   Email: {user_info.get('email', 'N/A')}")
        else:
            print(f"   ❌ Erreur Adobe: {response.text}")
    except Exception as e:
        print(f"   ❌ Exception Adobe: {e}")
    
    print()

def test_frameio_endpoints(access_token):
    """Tester différents endpoints Frame.io"""
    print("🎬 DIAGNOSTIC FRAME.IO API")
    print("=" * 40)
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    # Focus sur Frame.io V4 API (selon documentation officielle)
    endpoints = [
        ("Frame.io V4 /me", "https://api.frame.io/v4/me"),
        ("Frame.io V4 /accounts", "https://api.frame.io/v4/accounts"),
        ("Frame.io V4 /teams", "https://api.frame.io/v4/teams"),
        # Tests v2 pour comparaison (devraient échouer)
        ("Frame.io V2 /me (legacy)", "https://api.frame.io/v2/me"),
    ]
    
    for name, url in endpoints:
        try:
            print(f"📊 Test {name}...")
            response = requests.get(url, headers=headers, timeout=10)
            print(f"   Statut: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Succès")
                if 'name' in data:
                    print(f"   Utilisateur: {data.get('name', 'N/A')}")
                    print(f"   Email: {data.get('email', 'N/A')}")
                elif isinstance(data, list) and len(data) > 0:
                    print(f"   Éléments trouvés: {len(data)}")
                    if data[0].get('name'):
                        print(f"   Premier élément: {data[0].get('name', 'N/A')}")
                else:
                    print(f"   Réponse: {str(data)[:100]}...")
            elif response.status_code == 401:
                print(f"   ❌ Non autorisé (token sans scopes Frame.io)")
            elif response.status_code == 403:
                print(f"   ❌ Interdit (permissions insuffisantes)")
            elif response.status_code == 404:
                print(f"   ❌ Endpoint non trouvé")
            else:
                print(f"   ❌ Erreur {response.status_code}: {response.text[:100]}...")
        except Exception as e:
            print(f"   ❌ Exception: {e}")
        
        print()

def analyze_token_scopes(access_token):
    """Analyser les scopes du token (décodage basique du JWT)"""
    print("🔐 ANALYSE DU TOKEN")
    print("=" * 40)
    
    try:
        # Le token est un JWT, on peut décoder la partie payload (base64)
        import base64
        
        parts = access_token.split('.')
        if len(parts) >= 2:
            # Ajouter le padding nécessaire
            payload = parts[1]
            payload += '=' * (4 - len(payload) % 4)
            
            decoded = base64.b64decode(payload)
            token_data = json.loads(decoded)
            
            print(f"Client ID: {token_data.get('client_id', 'N/A')}")
            print(f"User ID: {token_data.get('user_id', 'N/A')}")
            print(f"Scopes: {token_data.get('scope', 'N/A')}")
            print(f"Expires: {token_data.get('expires_in', 'N/A')} secondes")
            print(f"Créé: {token_data.get('created_at', 'N/A')}")
            print(f"Type: {token_data.get('type', 'N/A')}")
            
            # Vérifier les scopes Adobe (qui donnent accès à Frame.io)
            scopes = token_data.get('scope', '')
            if 'AdobeID' in scopes:
                print("✅ Scope AdobeID détecté (accès aux services Adobe)")
                if 'offline_access' in scopes:
                    print("✅ Scope offline_access détecté (refresh token)")
            else:
                print("❌ Scope AdobeID manquant")
                print("   Ce scope est requis pour accéder aux services Adobe/Frame.io")
            
    except Exception as e:
        print(f"❌ Impossible de décoder le token: {e}")
    
    print()

def check_token_permissions(access_token):
    """Vérifier les permissions spécifiques du token"""
    print("🔒 VÉRIFICATION PERMISSIONS")
    print("=" * 40)
    
    try:
        import base64
        parts = access_token.split('.')
        if len(parts) >= 2:
            payload = parts[1]
            payload += '=' * (4 - len(payload) % 4)
            decoded = base64.b64decode(payload)
            token_data = json.loads(decoded)
            
            scopes = token_data.get('scope', '').split(',')
            
            print("📋 Scopes présents:")
            for scope in scopes:
                scope = scope.strip()
                if scope:
                    if scope == 'AdobeID':
                        print(f"   ✅ {scope} (Accès services Adobe/Frame.io)")
                    elif scope in ['openid', 'email', 'profile', 'offline_access']:
                        print(f"   ✅ {scope} (Standard)")
                    else:
                        print(f"   ℹ️ {scope}")
            
            # Vérification des scopes Adobe requis
            required_adobe_scopes = ['AdobeID', 'openid']
            missing_scopes = [s for s in required_adobe_scopes if s not in scopes]
            
            if missing_scopes:
                print(f"\n⚠️ Scopes Adobe manquants: {missing_scopes}")
                print("   → AdobeID est requis pour accéder à Frame.io")
            else:
                print("\n✅ Tous les scopes Adobe requis sont présents")
                print("   Le token devrait avoir accès à Frame.io")
                
    except Exception as e:
        print(f"❌ Erreur analyse permissions: {e}")
    
    print()

def main():
    print("🧪 DIAGNOSTIC COMPLET ADOBE IMS + FRAME.IO")
    print("=" * 50)
    print()
    
    # Charger le token
    try:
        access_token = load_current_token()
        print(f"Token chargé: {access_token[:30]}...{access_token[-20:]}")
        print()
    except Exception as e:
        print(f"❌ Erreur chargement token: {e}")
        return
    
    # Tests
    analyze_token_scopes(access_token)
    check_token_permissions(access_token)
    test_adobe_token_info(access_token)
    test_frameio_endpoints(access_token)
    
    print("🎯 CONCLUSION")
    print("=" * 40)
    print("Si Adobe IMS fonctionne mais pas Frame.io, cela peut indiquer:")
    print("1. Le token Adobe n'a pas accès à Frame.io")
    print("2. L'intégration Frame.io n'est pas correctement configurée")
    print("3. Le compte Adobe n'est pas lié à Frame.io")
    print("4. Les scopes demandés ne sont pas suffisants")

if __name__ == "__main__":
    main()
