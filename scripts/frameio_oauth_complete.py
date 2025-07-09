#!/usr/bin/env python3
"""
OAuth Web App Frame.io - Processus complet
Génère l'URL d'autorisation et échange le code contre un token
"""

import json
import requests
import urllib.parse
import base64
from pathlib import Path
from datetime import datetime

def load_oauth_config():
    """Charger les informations OAuth depuis les fichiers data/"""
    oauth_file = Path(__file__).parent.parent / "data" / "890CarmineWhitefish-1845895-OAuth Web App.json"
    
    if not oauth_file.exists():
        print(f"❌ Fichier OAuth non trouvé: {oauth_file}")
        return None
    
    with open(oauth_file, 'r') as f:
        oauth_data = json.load(f)
    
    return {
        'client_id': oauth_data['API_KEY'],
        'client_secret': oauth_data['CLIENT_SECRET'],
        'redirect_uri': oauth_data['DEF_REDIRECT_URI']
    }

def generate_auth_url(oauth_config):
    """Générer l'URL d'autorisation OAuth Adobe IMS pour Frame.io"""
    base_url = "https://ims-na1.adobelogin.com/ims/authorize/v2"
    
    params = {
        'client_id': oauth_config['client_id'],
        'redirect_uri': oauth_config['redirect_uri'],
        'response_type': 'code',
        'scope': 'email openid offline_access profile additional_info.roles'
    }
    
    auth_url = f"{base_url}?" + urllib.parse.urlencode(params)
    
    print("🔗 URL D'AUTORISATION ADOBE IMS (FRAME.IO):")
    print("=" * 55)
    print(auth_url)
    print()
    print("📋 INSTRUCTIONS:")
    print("1. Copiez cette URL et ouvrez-la dans votre navigateur")
    print("2. Connectez-vous à Adobe avec votre compte")
    print("3. Autorisez l'accès à Frame.io")
    print("4. Vous serez redirigé vers https://localhost:8080/callback?code=...")
    print("5. Copiez le CODE depuis l'URL (après 'code=')")
    print("6. Relancez ce script avec le code comme argument")
    print()
    
    return auth_url

def exchange_code_for_token(oauth_config, authorization_code):
    """Échanger le code d'autorisation contre un access token Adobe IMS"""
    token_url = "https://ims-na1.adobelogin.com/ims/token/v3"
    
    # Pour OAuth Web App, utiliser Authorization Basic header (selon doc Adobe)
    credentials = f"{oauth_config['client_id']}:{oauth_config['client_secret']}"
    credentials_b64 = base64.b64encode(credentials.encode()).decode()
    
    headers = {
        'Authorization': f'Basic {credentials_b64}',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    }
    
    # Body avec seulement code et grant_type (selon doc Adobe)
    data = {
        'grant_type': 'authorization_code',
        'code': authorization_code
    }
    
    try:
        print(f"🔄 Échange du code contre un token...")
        print(f"🔧 Méthode: OAuth Web App (Basic Auth)")
        
        response = requests.post(token_url, data=data, headers=headers, timeout=30)
        
        print(f"📊 Statut: {response.status_code}")
        print(f"📊 Headers de réponse: {dict(response.headers)}")
        
        if response.status_code == 200:
            token_data = response.json()
            
            print("✅ TOKEN OBTENU !")
            print(f"Access Token: {token_data.get('access_token', 'N/A')[:50]}...")
            print(f"Refresh Token: {token_data.get('refresh_token', 'N/A')[:50]}...")
            print(f"Token Type: {token_data.get('token_type', 'N/A')}")
            print(f"Expires in: {token_data.get('expires_in', 'N/A')} secondes")
            print(f"ID Token présent: {'✅' if token_data.get('id_token') else '❌'}")
            
            # Sauvegarder les tokens dans la config
            save_tokens_to_config(
                token_data.get('access_token'), 
                token_data.get('refresh_token')
            )
            
            return token_data
        else:
            print(f"❌ Erreur échange token: {response.status_code}")
            print(f"Réponse complète: {response.text}")
            
            # Essayer de décoder la réponse JSON pour plus de détails
            try:
                error_data = response.json()
                print(f"Détails erreur: {error_data}")
            except:
                pass
            
            return None
            
    except Exception as e:
        print(f"❌ Exception échange token: {e}")
        return None

def save_token_to_config(access_token):
    """Sauvegarder le token dans la config"""
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    
    try:
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        if 'frameio' not in config:
            config['frameio'] = {}
        
        config['frameio']['api_token'] = access_token
        
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=4)
        
        print(f"💾 Token sauvegardé dans {config_path}")
        
    except Exception as e:
        print(f"❌ Erreur sauvegarde: {e}")

def save_tokens_to_config(access_token, refresh_token):
    """Sauvegarder les tokens dans le fichier de configuration"""
    config_file = Path(__file__).parent.parent / "config" / "integrations.json"
    
    try:
        # Lire la config existante
        if config_file.exists():
            with open(config_file, 'r') as f:
                config = json.load(f)
        else:
            config = {}
        
        # Mettre à jour les tokens Frame.io
        if 'frameio' not in config:
            config['frameio'] = {}
        
        config['frameio']['api_token'] = access_token
        config['frameio']['refresh_token'] = refresh_token
        config['frameio']['token_type'] = 'OAuth'
        config['frameio']['updated_at'] = datetime.now().isoformat()
        
        # Sauvegarder
        with open(config_file, 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"✅ Tokens sauvegardés dans {config_file}")
        
    except Exception as e:
        print(f"❌ Erreur sauvegarde tokens: {e}")

def load_current_tokens():
    """Charger les tokens actuels depuis la configuration"""
    config_file = Path(__file__).parent.parent / "config" / "integrations.json"
    
    try:
        if config_file.exists():
            with open(config_file, 'r') as f:
                config = json.load(f)
            
            frameio_config = config.get('frameio', {})
            return {
                'access_token': frameio_config.get('api_token'),
                'refresh_token': frameio_config.get('refresh_token'),
                'token_type': frameio_config.get('token_type'),
                'updated_at': frameio_config.get('updated_at')
            }
    except Exception as e:
        print(f"❌ Erreur lecture tokens: {e}")
    
    return {}

def test_token(access_token):
    """Tester le nouveau token"""
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get("https://api.frame.io/v2/me", headers=headers, timeout=10)
        
        if response.status_code == 200:
            user_data = response.json()
            print(f"✅ Token valide ! Utilisateur: {user_data.get('name', 'N/A')}")
            return True
        else:
            print(f"❌ Token invalide: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur test token: {e}")
        return False

def refresh_access_token(oauth_config, refresh_token):
    """Rafraîchir l'access token avec le refresh token (OAuth Web App)"""
    token_url = "https://ims-na1.adobelogin.com/ims/token/v3"
    
    # Pour OAuth Web App, utiliser Authorization Basic header
    credentials = f"{oauth_config['client_id']}:{oauth_config['client_secret']}"
    credentials_b64 = base64.b64encode(credentials.encode()).decode()
    
    headers = {
        'Authorization': f'Basic {credentials_b64}',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    }
    
    data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }
    
    try:
        print(f"🔄 Rafraîchissement du token...")
        
        response = requests.post(token_url, data=data, headers=headers, timeout=30)
        
        print(f"📊 Statut: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            
            print("✅ TOKEN RAFRAÎCHI !")
            print(f"Access Token: {token_data.get('access_token', 'N/A')[:50]}...")
            print(f"Refresh Token: {token_data.get('refresh_token', 'N/A')[:50]}...")
            print(f"Expires in: {token_data.get('expires_in', 'N/A')} secondes")
            
            # Sauvegarder les nouveaux tokens
            save_tokens_to_config(token_data.get('access_token'), token_data.get('refresh_token'))
            
            return token_data
        else:
            print(f"❌ Erreur rafraîchissement: {response.status_code}")
            print(f"Réponse complète: {response.text}")
            
            try:
                error_data = response.json()
                print(f"Détails erreur: {error_data}")
            except:
                pass
            
            return None
            
    except Exception as e:
        print(f"❌ Exception rafraîchissement: {e}")
        return None

def test_frameio_api(access_token):
    """Tester l'accès à l'API Frame.io avec le token"""
    # Utiliser Frame.io V4 API (selon documentation officielle)
    api_url = "https://api.frame.io/v4/me"
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        print(f"🧪 Test Frame.io V4 API...")
        
        response = requests.get(api_url, headers=headers, timeout=30)
        
        print(f"📊 Statut: {response.status_code}")
        
        if response.status_code == 200:
            user_data = response.json()
            print("✅ API FRAME.IO V4 ACCESSIBLE !")
            print(f"Utilisateur: {user_data.get('name', 'N/A')} ({user_data.get('email', 'N/A')})")
            print(f"ID: {user_data.get('id', 'N/A')}")
            
            # Informations supplémentaires Frame.io v4
            if 'account' in user_data:
                print(f"Compte: {user_data['account'].get('name', 'N/A')}")
            if 'teams' in user_data:
                print(f"Équipes: {len(user_data.get('teams', []))}")
                
            return True
        elif response.status_code == 401:
            print(f"❌ Non autorisé - Compte Adobe pas lié à Frame.io")
            print("💡 Connectez-vous d'abord à Frame.io avec votre compte Adobe")
            print("💡 Puis générez un nouveau token")
        else:
            print(f"❌ Erreur API Frame.io V4: {response.status_code}")
            print(f"Réponse: {response.text}")
        
        return False
            
    except Exception as e:
        print(f"❌ Exception test API: {e}")
        return False

def main_menu():
    """Menu principal pour gérer l'authentification Frame.io"""
    oauth_config = load_oauth_config()
    if not oauth_config:
        print("❌ Configuration OAuth manquante")
        return
    
    while True:
        print("\n" + "="*50)
        print("🎬 AUTHENTIFICATION FRAME.IO - MENU PRINCIPAL")
        print("="*50)
        
        current_tokens = load_current_tokens()
        if current_tokens.get('access_token'):
            print(f"✅ Token actuel: ...{current_tokens['access_token'][-10:]}")
            print(f"📅 Mis à jour: {current_tokens.get('updated_at', 'N/A')}")
        else:
            print("❌ Aucun token configuré")
        
        print("\nOptions:")
        print("1. 🔗 Générer une nouvelle URL d'autorisation")
        print("2. 🔑 Échanger un code d'autorisation contre un token")
        print("3. 🔄 Rafraîchir le token actuel")
        print("4. 🧪 Tester l'API Frame.io")
        print("5. 📋 Afficher la configuration actuelle")
        print("6. 📁 Créer un fichier temporaire pour le code")
        print("7. ❌ Quitter")
        
        choice = input("\nVotre choix (1-7): ").strip()
        
        if choice == "1":
            generate_auth_url_interactive(oauth_config)
        elif choice == "2":
            exchange_code_interactive(oauth_config)
        elif choice == "3":
            refresh_token_interactive(oauth_config)
        elif choice == "4":
            test_api_interactive()
        elif choice == "5":
            display_current_config()
        elif choice == "6":
            create_temp_code_file()
        elif choice == "7":
            print("👋 Au revoir !")
            break
        else:
            print("❌ Choix invalide")

def generate_auth_url_interactive(oauth_config):
    """Interface interactive pour générer l'URL d'autorisation"""
    print("\n📋 GÉNÉRATION URL D'AUTORISATION")
    print("-" * 40)
    
    auth_url = generate_auth_url(oauth_config)
    print(f"\n🔗 URL d'autorisation générée:")
    print(f"{auth_url}")
    
    print(f"\n📋 ÉTAPES À SUIVRE:")
    print(f"1. Copiez l'URL ci-dessus")
    print(f"2. Ouvrez-la dans votre navigateur")
    print(f"3. Connectez-vous avec votre compte Adobe")
    print(f"4. Autorisez l'application")
    print(f"5. Copiez le code depuis l'URL de redirection")
    print(f"6. Utilisez l'option 2 du menu pour échanger le code")

def extract_code_from_input(user_input):
    """Extraire le code d'autorisation depuis une URL ou une saisie brute"""
    user_input = user_input.strip()
    
    # Si c'est une URL complète avec code=
    if 'code=' in user_input:
        try:
            # Extraire le code depuis l'URL
            parsed = urllib.parse.urlparse(user_input)
            query_params = urllib.parse.parse_qs(parsed.query)
            code = query_params.get('code', [None])[0]
            if code:
                print(f"✅ Code extrait depuis l'URL: {code[:20]}...")
                return code
        except Exception as e:
            print(f"⚠️ Erreur extraction URL: {e}")
    
    # Si c'est juste le code (commence généralement par des caractères alphanumériques)
    if len(user_input) > 50 and not user_input.startswith('http'):
        print(f"✅ Code détecté: {user_input[:20]}...")
        return user_input
    
    # Si rien ne correspond, retourner tel quel
    print(f"⚠️ Format non reconnu, utilisation tel quel. Longueur: {len(user_input)}")
    return user_input

def exchange_code_interactive(oauth_config):
    """Interface interactive pour échanger le code"""
    print("\n🔑 ÉCHANGE CODE D'AUTORISATION")
    print("-" * 40)
    
    print("📋 MÉTHODES DE SAISIE:")
    print("1. � Coller l'URL complète de redirection")
    print("2. 📝 Coller uniquement le code d'autorisation")
    print("3. 📄 Saisie multi-lignes (pour très longs codes)")
    print("4. 📁 Charger depuis un fichier texte")
    print()
    
    method = input("Choisissez la méthode (1-4): ").strip()
    
    if method == "1":
        print("\n📋 Collez l'URL complète de redirection:")
        print("Exemple: https://localhost:8080/callback?code=eyJhbGc...")
        user_input = input("> ").strip()
        code = extract_code_from_input(user_input)
    
    elif method == "2":
        print("\n📝 Collez le code d'autorisation:")
        print("(Le code peut être très long, plusieurs centaines de caractères)")
        code = input("> ").strip()
    
    elif method == "3":
        print("\n📄 SAISIE MULTI-LIGNES:")
        print("Collez le code (peut être sur plusieurs lignes)")
        print("Appuyez sur Ctrl+D (Mac/Linux) ou Ctrl+Z puis Entrée (Windows) pour terminer:")
        print()
        
        lines = []
        try:
            while True:
                line = input()
                lines.append(line)
        except EOFError:
            pass
        
        code = ''.join(lines).strip()
        print(f"✅ Code reçu: {len(code)} caractères")
    
    elif method == "4":
        print("\n📁 Chargement depuis un fichier:")
        filepath = input("Chemin du fichier contenant le code: ").strip()
        try:
            with open(filepath, 'r') as f:
                code = f.read().strip()
            print(f"✅ Code chargé depuis {filepath}: {len(code)} caractères")
        except Exception as e:
            print(f"❌ Erreur lecture fichier: {e}")
            return
    
    else:
        print("❌ Méthode invalide")
        return
    
    if not code:
        print("❌ Aucun code fourni")
        return
    
    # Nettoyer le code (supprimer espaces, retours à la ligne superflus)
    # Mais garder la structure si c'est une URL
    if not code.startswith('http'):
        code = ''.join(code.split())
    
    print(f"\n🔍 VÉRIFICATION DU CODE:")
    print(f"Longueur: {len(code)} caractères")
    print(f"Début: {code[:30]}...")
    print(f"Fin: ...{code[-20:]}")
    
    # Demander confirmation si le code semble anormalement court
    if len(code) < 100:
        print(f"⚠️ ATTENTION: Le code semble court ({len(code)} caractères)")
        print("   Les codes OAuth Adobe sont généralement très longs (200+ caractères)")
        confirm = input("Continuer malgré tout ? (o/N): ").strip().lower()
        if confirm != 'o':
            print("❌ Opération annulée")
            return
    
    # Extraire le code final si c'était une URL
    final_code = extract_code_from_input(code)
    
    print(f"\n🔄 Échange en cours...")
    token_data = exchange_code_for_token(oauth_config, final_code)
    if token_data:
        print("✅ Token obtenu avec succès !")

def refresh_token_interactive(oauth_config):
    """Interface interactive pour rafraîchir le token"""
    print("\n🔄 RAFRAÎCHISSEMENT TOKEN")
    print("-" * 40)
    
    current_tokens = load_current_tokens()
    refresh_token = current_tokens.get('refresh_token')
    
    if not refresh_token:
        print("❌ Aucun refresh token disponible")
        print("💡 Vous devez d'abord obtenir un token via l'option 1 et 2")
        return
    
    token_data = refresh_access_token(oauth_config, refresh_token)
    if token_data:
        print("✅ Token rafraîchi avec succès !")

def test_api_interactive():
    """Interface interactive pour tester l'API"""
    print("\n🧪 TEST API FRAME.IO")
    print("-" * 40)
    
    current_tokens = load_current_tokens()
    access_token = current_tokens.get('access_token')
    
    if not access_token:
        print("❌ Aucun access token disponible")
        print("💡 Vous devez d'abord obtenir un token via l'option 1 et 2")
        return
    
    test_frameio_api(access_token)

def display_current_config():
    """Afficher la configuration actuelle"""
    print("\n📋 CONFIGURATION ACTUELLE")
    print("-" * 40)
    
    oauth_config = load_oauth_config()
    current_tokens = load_current_tokens()
    
    print(f"Client ID: {oauth_config['client_id']}")
    print(f"Redirect URI: {oauth_config['redirect_uri']}")
    
    if current_tokens.get('access_token'):
        print(f"Access Token: ...{current_tokens['access_token'][-20:]}")
        print(f"Refresh Token: {'✅ Présent' if current_tokens.get('refresh_token') else '❌ Absent'}")
        print(f"Type: {current_tokens.get('token_type', 'N/A')}")
        print(f"Mis à jour: {current_tokens.get('updated_at', 'N/A')}")
    else:
        print("❌ Aucun token configuré")

def main():
    import sys
    
    print("🎬 OAUTH WEB APP FRAME.IO")
    print("=" * 30)
    print()
    
    # Charger la config OAuth
    oauth_config = load_oauth_config()
    if not oauth_config:
        return
    
    # Vérifier si un code a été fourni en argument (mode legacy)
    if len(sys.argv) > 1:
        authorization_code = sys.argv[1]
        print(f"📝 Code d'autorisation reçu: {authorization_code[:20]}...")
        
        # Échanger le code contre un token
        token_data = exchange_code_for_token(oauth_config, authorization_code)
        
        if token_data and token_data.get('access_token'):
            # Tester le token
            test_frameio_api(token_data.get('access_token'))
        
    else:
        # Mode interactif avec menu
        main_menu()

def create_temp_code_file():
    """Créer un fichier temporaire pour faciliter la saisie du code"""
    temp_dir = Path(__file__).parent.parent / "temp"
    temp_dir.mkdir(exist_ok=True)
    
    temp_file = temp_dir / "oauth_code.txt"
    
    # Créer le fichier avec des instructions
    instructions = """# INSTRUCTIONS:
# 1. Supprimez ces lignes de commentaire
# 2. Collez votre code d'autorisation sur la ligne suivante
# 3. Sauvegardez le fichier
# 4. Retournez au script et choisissez l'option 4 (fichier)

"""
    
    with open(temp_file, 'w') as f:
        f.write(instructions)
    
    print(f"✅ Fichier temporaire créé: {temp_file}")
    print("💡 Vous pouvez ouvrir ce fichier dans un éditeur pour coller le code")
    
    return str(temp_file)

if __name__ == "__main__":
    main()
