#!/usr/bin/env python3
"""
Configuration OAuth Adobe IMS pour Frame.io v4
Solution avancée pour l'API Frame.io v4 avec Adobe IMS
"""

import json
import requests
import webbrowser
import urllib.parse
import secrets
import base64
import hashlib
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import time

def generate_pkce():
    """Générer les paramètres PKCE pour OAuth."""
    code_verifier = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')
    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode('utf-8')).digest()
    ).decode('utf-8').rstrip('=')
    
    return code_verifier, code_challenge

class OAuthHandler(BaseHTTPRequestHandler):
    """Handler pour recevoir le callback OAuth."""
    
    def do_GET(self):
        """Gérer la requête GET du callback."""
        # Parse URL et récupérer le code
        if '?code=' in self.path:
            # Succès
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            html = """
            <html>
            <head><title>Frame.io OAuth - Succès</title></head>
            <body style="font-family: Arial; text-align: center; padding: 50px;">
                <h1 style="color: green;">✅ Authentification réussie !</h1>
                <p>Vous pouvez fermer cette fenêtre et retourner au terminal.</p>
            </body>
            </html>
            """
            self.wfile.write(html.encode())
            
            # Extraire le code d'autorisation
            query = urllib.parse.urlparse(self.path).query
            params = urllib.parse.parse_qs(query)
            if 'code' in params:
                self.server.auth_code = params['code'][0]
        else:
            # Erreur
            self.send_response(400)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            html = """
            <html>
            <head><title>Frame.io OAuth - Erreur</title></head>
            <body style="font-family: Arial; text-align: center; padding: 50px;">
                <h1 style="color: red;">❌ Erreur d'authentification</h1>
                <p>Une erreur est survenue. Retournez au terminal pour plus d'informations.</p>
            </body>
            </html>
            """
            self.wfile.write(html.encode())
    
    def log_message(self, format, *args):
        """Désactiver les logs du serveur."""
        pass

def get_oauth_config():
    """Récupérer la configuration OAuth de l'utilisateur."""
    print("🔐 CONFIGURATION OAUTH ADOBE IMS")
    print("=" * 60)
    print()
    print("📋 Configuration requise depuis Adobe Developer Console:")
    print("   1. Connectez-vous à https://developer.adobe.com/console/")
    print("   2. Créez ou sélectionnez un projet")
    print("   3. Ajoutez l'API 'Adobe IMS' (et Frame.io si disponible)")
    print("   4. Configurez OAuth Web App avec:")
    print("      • Redirect URI: http://localhost:8080/callback")
    print("      • Scopes: openid, profile, email, offline_access")
    print("   5. Copiez vos identifiants")
    print()
    
    client_id = input("🔑 Client ID: ").strip()
    if not client_id:
        print("❌ Client ID requis")
        return None
    
    client_secret = input("🔐 Client Secret: ").strip()
    if not client_secret:
        print("❌ Client Secret requis")
        return None
    
    # Scopes par défaut pour Frame.io
    default_scopes = "openid,profile,email,offline_access,additional_info.roles"
    scopes = input(f"📋 Scopes [{default_scopes}]: ").strip() or default_scopes
    
    config = {
        "client_id": client_id,
        "client_secret": client_secret,
        "scopes": scopes,
        "redirect_uri": "http://localhost:8080/callback",
        "authorization_endpoint": "https://ims-na1.adobelogin.com/ims/authorize/v2",
        "token_endpoint": "https://ims-na1.adobelogin.com/ims/token/v3",
        "userinfo_endpoint": "https://ims-na1.adobelogin.com/ims/userinfo/v2"
    }
    
    return config

def start_oauth_flow(config):
    """Démarrer le flow OAuth."""
    print(f"\n🚀 DÉMARRAGE DU FLOW OAUTH")
    print("=" * 50)
    
    # Générer PKCE
    code_verifier, code_challenge = generate_pkce()
    state = secrets.token_urlsafe(32)
    
    # Construire l'URL d'autorisation
    auth_params = {
        'client_id': config['client_id'],
        'response_type': 'code',
        'scope': config['scopes'],
        'redirect_uri': config['redirect_uri'],
        'state': state,
        'code_challenge': code_challenge,
        'code_challenge_method': 'S256'
    }
    
    auth_url = f"{config['authorization_endpoint']}?" + urllib.parse.urlencode(auth_params)
    
    print("🌐 Ouverture du navigateur pour l'authentification...")
    print(f"   URL: {auth_url}")
    
    # Démarrer le serveur local
    server = HTTPServer(('localhost', 8080), OAuthHandler)
    server.auth_code = None
    server.timeout = 300  # 5 minutes
    
    # Démarrer le serveur dans un thread
    server_thread = threading.Thread(target=server.serve_forever)
    server_thread.daemon = True
    server_thread.start()
    
    # Ouvrir le navigateur
    webbrowser.open(auth_url)
    
    print("\n⏳ En attente de l'autorisation...")
    print("   (Le navigateur va s'ouvrir automatiquement)")
    print("   (Timeout: 5 minutes)")
    
    # Attendre le callback
    start_time = time.time()
    while server.auth_code is None and (time.time() - start_time) < 300:
        time.sleep(1)
    
    server.shutdown()
    
    if server.auth_code:
        print("✅ Code d'autorisation reçu !")
        return server.auth_code, code_verifier, state
    else:
        print("❌ Timeout ou erreur lors de l'autorisation")
        return None, None, None

def exchange_code_for_token(config, auth_code, code_verifier):
    """Échanger le code d'autorisation contre un token."""
    print(f"\n🔄 ÉCHANGE CODE → TOKEN")
    print("=" * 40)
    
    token_data = {
        'grant_type': 'authorization_code',
        'client_id': config['client_id'],
        'client_secret': config['client_secret'],
        'code': auth_code,
        'redirect_uri': config['redirect_uri'],
        'code_verifier': code_verifier
    }
    
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    }
    
    try:
        response = requests.post(
            config['token_endpoint'],
            data=token_data,
            headers=headers,
            timeout=30
        )
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            token_response = response.json()
            print("✅ Token obtenu avec succès !")
            
            # Afficher les informations du token
            access_token = token_response.get('access_token')
            refresh_token = token_response.get('refresh_token')
            expires_in = token_response.get('expires_in')
            
            print(f"   🔑 Access Token: {access_token[:30]}...")
            print(f"   🔄 Refresh Token: {'Oui' if refresh_token else 'Non'}")
            print(f"   ⏰ Expires in: {expires_in} secondes")
            
            return token_response
        else:
            print(f"❌ Erreur lors de l'échange: {response.status_code}")
            try:
                error_detail = response.json()
                print(f"   📄 Détail: {error_detail}")
            except:
                print(f"   📄 Réponse: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Erreur lors de l'échange: {e}")
        return None

def test_userinfo(config, token_response):
    """Tester l'endpoint UserInfo avec le token."""
    print(f"\n🧪 TEST USERINFO ADOBE")
    print("=" * 40)
    
    access_token = token_response.get('access_token')
    client_id = config['client_id']
    
    userinfo_url = f"{config['userinfo_endpoint']}?client_id={client_id}"
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json'
    }
    
    try:
        response = requests.get(userinfo_url, headers=headers, timeout=10)
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            userinfo = response.json()
            print("✅ UserInfo récupéré !")
            print(f"   👤 Nom: {userinfo.get('name', 'N/A')}")
            print(f"   📧 Email: {userinfo.get('email', 'N/A')}")
            print(f"   🆔 Sub: {userinfo.get('sub', 'N/A')}")
            return userinfo
        else:
            print(f"❌ Erreur UserInfo: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Erreur UserInfo: {e}")
        return None

def test_frameio_v4(token_response):
    """Tester l'accès à Frame.io v4 avec le token Adobe."""
    print(f"\n🎯 TEST FRAME.IO V4")
    print("=" * 40)
    
    access_token = token_response.get('access_token')
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json'
    }
    
    frameio_endpoints = [
        "https://api.frame.io/v4/me",
        "https://api.frame.io/v4/accounts"
    ]
    
    for endpoint in frameio_endpoints:
        print(f"\n📋 Test: {endpoint}")
        
        try:
            response = requests.get(endpoint, headers=headers, timeout=10)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                print("   ✅ Succès !")
                try:
                    data = response.json()
                    print(f"   📄 Données reçues: {len(json.dumps(data))} caractères")
                except:
                    print(f"   📄 Réponse: {response.text[:100]}...")
                return True
            elif response.status_code == 401:
                print("   ❌ 401 Unauthorized")
            elif response.status_code == 403:
                print("   ❌ 403 Forbidden")
            else:
                print(f"   ⚠️  {response.status_code} {response.reason}")
                
        except Exception as e:
            print(f"   ❌ Erreur: {e}")
    
    print("\n❌ Aucun endpoint Frame.io v4 ne fonctionne")
    print("💡 Cela confirme que Frame.io n'est pas configuré dans votre projet Adobe")
    return False

def save_oauth_config(config, token_response, userinfo):
    """Sauvegarder la configuration OAuth."""
    print(f"\n💾 SAUVEGARDE CONFIGURATION OAUTH")
    print("=" * 50)
    
    oauth_config = {
        **config,
        **token_response,
        "user_info": userinfo,
        "created_at": int(time.time())
    }
    
    try:
        os.makedirs('config', exist_ok=True)
        
        config_path = 'config/frameio_oauth_config.json'
        with open(config_path, 'w') as f:
            json.dump(oauth_config, f, indent=2)
        
        print(f"✅ Configuration OAuth sauvegardée: {config_path}")
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la sauvegarde: {e}")
        return False

def main():
    """Fonction principale."""
    print("🚀 CONFIGURATION OAUTH ADOBE IMS - FRAME.IO V4")
    print("=" * 80)
    print("Solution avancée pour l'API Frame.io v4 avec Adobe IMS")
    print("(Nécessite que Frame.io soit configuré dans Adobe Developer Console)")
    print()
    
    # Étape 1: Configuration
    config = get_oauth_config()
    if not config:
        return False
    
    # Étape 2: Flow OAuth
    auth_code, code_verifier, state = start_oauth_flow(config)
    if not auth_code:
        return False
    
    # Étape 3: Échange code → token
    token_response = exchange_code_for_token(config, auth_code, code_verifier)
    if not token_response:
        return False
    
    # Étape 4: Test UserInfo
    userinfo = test_userinfo(config, token_response)
    
    # Étape 5: Test Frame.io v4
    frameio_works = test_frameio_v4(token_response)
    
    # Étape 6: Sauvegarde
    save_oauth_config(config, token_response, userinfo)
    
    # Résumé final
    print(f"\n📊 RÉSUMÉ CONFIGURATION OAUTH")
    print("=" * 50)
    print(f"   • Token Adobe IMS: ✅ Obtenu")
    print(f"   • UserInfo Adobe: {'✅ OK' if userinfo else '❌ Échec'}")
    print(f"   • Frame.io v4: {'✅ Fonctionnel' if frameio_works else '❌ Non configuré'}")
    
    if frameio_works:
        print(f"\n🎉 SUCCÈS ! Frame.io v4 est fonctionnel !")
        print("🚀 Vous pouvez utiliser l'API Frame.io v4 avec Adobe IMS")
    else:
        print(f"\n⚠️  Frame.io v4 non accessible")
        print("💡 Vérifiez que Frame.io est ajouté à votre projet Adobe")
        print("🔄 En attendant, utilisez: python scripts/setup_frameio.py")
    
    return frameio_works

if __name__ == "__main__":
    main()
