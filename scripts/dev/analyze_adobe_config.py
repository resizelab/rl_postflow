#!/usr/bin/env python3
"""
Analyse de la configuration Adobe/Frame.io
"""

import json
from pathlib import Path

def analyze_adobe_config():
    """Analyser la configuration Adobe"""
    print("🔍 ANALYSE CONFIGURATION ADOBE/FRAME.IO")
    print("=" * 50)
    
    # Charger les fichiers de config
    data_dir = Path(__file__).parent.parent / "data"
    
    oauth_file = data_dir / "890CarmineWhitefish-1845895-OAuth Web App.json"
    prod_file = data_dir / "890CarmineWhitefish-1845895-Production.json"
    
    print("📂 CONFIGURATION OAUTH WEB APP")
    print("-" * 30)
    with open(oauth_file, 'r') as f:
        oauth_config = json.load(f)
    
    print(f"Client ID: {oauth_config['API_KEY']}")
    print(f"Client Secret: {oauth_config['CLIENT_SECRET'][:10]}...")
    print(f"Redirect URI: {oauth_config['DEF_REDIRECT_URI']}")
    print()
    
    print("📂 CONFIGURATION PRODUCTION")
    print("-" * 30)
    with open(prod_file, 'r') as f:
        prod_config = json.load(f)
    
    project = prod_config['project']
    workspace = project['workspace']
    
    print(f"Projet: {project['name']} ({project['title']})")
    print(f"Organisation Adobe: {project['org']['name']}")
    print(f"IMS Org ID: {project['org']['ims_org_id']}")
    print(f"Workspace: {workspace['name']}")
    print()
    
    # Analyser les credentials
    credentials = workspace['details']['credentials'][0]
    oauth2 = credentials['oauth2']
    
    print("🔐 CREDENTIALS DÉTAILS")
    print("-" * 30)
    print(f"Credential ID: {credentials['id']}")
    print(f"Type: {credentials['integration_type']}")
    print(f"Client ID OAuth: {oauth2['client_id']}")
    print(f"Client Secret OAuth: {oauth2['client_secret'][:10]}...")
    print(f"Redirect URIs: {oauth2['redirect_uri']}")
    print(f"Default Redirect: {oauth2['defaultRedirectUri']}")
    print()
    
    # Analyser les services
    services = workspace['details']['services']
    print("🎬 SERVICES ACTIVÉS")
    print("-" * 30)
    for service in services:
        print(f"✅ {service['name']} (code: {service['code']})")
    print()
    
    # Vérifications
    print("🔍 VÉRIFICATIONS")
    print("-" * 30)
    
    # 1. Cohérence des Client ID
    if oauth_config['API_KEY'] == oauth2['client_id']:
        print("✅ Client ID cohérent entre les fichiers")
    else:
        print("❌ Client ID différent entre les fichiers")
        print(f"   OAuth Web App: {oauth_config['API_KEY']}")
        print(f"   Production: {oauth2['client_id']}")
    
    # 2. Cohérence des Client Secret
    if oauth_config['CLIENT_SECRET'] == oauth2['client_secret']:
        print("✅ Client Secret cohérent entre les fichiers")
    else:
        print("❌ Client Secret différent entre les fichiers")
    
    # 3. Cohérence Redirect URI
    if oauth_config['DEF_REDIRECT_URI'] == oauth2['defaultRedirectUri']:
        print("✅ Redirect URI cohérent entre les fichiers")
    else:
        print("❌ Redirect URI différent entre les fichiers")
        print(f"   OAuth Web App: {oauth_config['DEF_REDIRECT_URI']}")
        print(f"   Production: {oauth2['defaultRedirectUri']}")
    
    # 4. Service Frame.io
    frameio_service = any(s['code'] == 'FrameioAPISDK' for s in services)
    if frameio_service:
        print("✅ Service Frame.io API activé")
    else:
        print("❌ Service Frame.io API manquant")
    
    print()
    
    return {
        'oauth_config': oauth_config,
        'prod_config': prod_config,
        'frameio_enabled': frameio_service,
        'credentials_consistent': (
            oauth_config['API_KEY'] == oauth2['client_id'] and
            oauth_config['CLIENT_SECRET'] == oauth2['client_secret'] and
            oauth_config['DEF_REDIRECT_URI'] == oauth2['defaultRedirectUri']
        )
    }

def suggest_improvements(analysis):
    """Suggérer des améliorations"""
    print("💡 RECOMMANDATIONS")
    print("-" * 30)
    
    if analysis['credentials_consistent']:
        print("✅ Configuration OAuth cohérente")
    else:
        print("❌ Incohérences détectées dans la configuration")
        print("   → Vérifiez que les fichiers sont à jour")
    
    if analysis['frameio_enabled']:
        print("✅ Service Frame.io activé dans Adobe")
        print("   → Le problème vient probablement des scopes ou de l'autorisation")
    else:
        print("❌ Service Frame.io manquant")
        print("   → Activez le service Frame.io API dans la console Adobe")
    
    print()
    print("🎯 ACTIONS POSSIBLES:")
    print("1. Vérifier dans la console Adobe Developer que:")
    print("   - Le service Frame.io API est bien activé")
    print("   - Les scopes Frame.io sont inclus")
    print("   - L'application est approuvée par Frame.io")
    print()
    print("2. Essayer des scopes Frame.io spécifiques:")
    print("   - Au lieu de: openid email profile offline_access")
    print("   - Essayer: frameio.read frameio.write ou frameio.admin")
    print()
    print("3. Vérifier que le compte Adobe est lié à Frame.io")
    print("4. Contacter le support Frame.io/Adobe si nécessaire")

def main():
    analysis = analyze_adobe_config()
    suggest_improvements(analysis)

if __name__ == "__main__":
    main()
