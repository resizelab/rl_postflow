#!/usr/bin/env python3
"""
Script d'analyse des credentials Adobe IMS pour Frame.io v4
Analyse les fichiers JSON fournis et génère les recommandations pour la configuration Server-to-Server
"""

import json
import os
import sys
from pathlib import Path

def load_json_file(file_path):
    """Charge un fichier JSON et retourne son contenu"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Erreur lors du chargement de {file_path}: {e}")
        return None

def analyze_credentials():
    """Analyse les credentials Adobe extraits des fichiers JSON"""
    
    # Chemins des fichiers JSON
    oauth_web_app_path = Path("data/890CarmineWhitefish-1845895-OAuth Web App.json")
    production_path = Path("data/890CarmineWhitefish-1845895-Production.json")
    
    print("🔍 Analyse des credentials Adobe IMS pour Frame.io v4")
    print("=" * 60)
    
    # Chargement des fichiers
    oauth_data = load_json_file(oauth_web_app_path)
    production_data = load_json_file(production_path)
    
    if not oauth_data or not production_data:
        print("❌ Impossible de charger les fichiers JSON")
        return False
    
    # Extraction des informations
    print("\n📊 Informations extraites:")
    print("-" * 30)
    
    # Depuis OAuth Web App
    client_id = oauth_data.get("API_KEY")
    client_secret = oauth_data.get("CLIENT_SECRET")
    redirect_uri = oauth_data.get("DEF_REDIRECT_URI")
    
    print(f"✅ Client ID: {client_id}")
    print(f"✅ Client Secret: {client_secret[:8]}...")
    print(f"✅ Redirect URI: {redirect_uri}")
    
    # Depuis Production
    project_data = production_data.get("project", {})
    org_data = project_data.get("org", {})
    workspace_data = project_data.get("workspace", {})
    
    project_id = project_data.get("id")
    org_id = org_data.get("id")
    ims_org_id = org_data.get("ims_org_id")
    workspace_id = workspace_data.get("id")
    
    print(f"✅ Project ID: {project_id}")
    print(f"✅ Organization ID: {org_id}")
    print(f"✅ IMS Organization ID: {ims_org_id}")
    print(f"✅ Workspace ID: {workspace_id}")
    
    # Analyse du type d'intégration
    print("\n⚠️  Analyse du type d'intégration:")
    print("-" * 40)
    
    credentials = workspace_data.get("details", {}).get("credentials", [])
    if credentials:
        cred = credentials[0]
        integration_type = cred.get("integration_type")
        print(f"Type actuel: {integration_type}")
        
        if integration_type == "oauthwebapp":
            print("🚨 PROBLÈME DÉTECTÉ:")
            print("   L'intégration actuelle est de type 'OAuth Web App'")
            print("   Frame.io v4 nécessite une intégration 'Server-to-Server'")
            print("   Vous devez créer une nouvelle intégration dans Adobe Developer Console")
            
    # Vérification des services
    services = workspace_data.get("details", {}).get("services", [])
    frameio_service = next((s for s in services if s.get("code") == "FrameioAPISDK"), None)
    
    if frameio_service:
        print(f"✅ Service Frame.io trouvé: {frameio_service.get('name')}")
    else:
        print("❌ Service Frame.io non trouvé dans les services")
    
    # Recommandations
    print("\n🛠️  Actions requises:")
    print("-" * 25)
    print("1. Créer une nouvelle intégration Server-to-Server dans Adobe Developer Console")
    print("2. Ajouter le service Frame.io API à cette intégration")
    print("3. Générer un certificat/clé privée pour l'authentification JWT")
    print("4. Récupérer le Technical Account ID de la nouvelle intégration")
    print("5. Mettre à jour les variables d'environnement")
    
    # Génération du .env mis à jour
    print("\n📝 Configuration .env recommandée:")
    print("-" * 35)
    print(f"FRAMEIO_CLIENT_ID={client_id}")
    print(f"FRAMEIO_CLIENT_SECRET={client_secret}")
    print(f"FRAMEIO_ORG_ID={ims_org_id}")
    print("FRAMEIO_TECHNICAL_ACCOUNT_ID=your_new_technical_account_id")
    print("FRAMEIO_PRIVATE_KEY_PATH=config/private.key")
    print(f"FRAMEIO_ACCOUNT_ID={org_id}")
    print(f"FRAMEIO_WORKSPACE_ID={workspace_id}")
    
    # Test des endpoints
    print("\n🧪 Test des endpoints Frame.io v4:")
    print("-" * 35)
    print("Une fois la configuration Server-to-Server terminée, testez avec:")
    print("python scripts/test_frameio_auth.py")
    print("ou utilisez le fichier test_frameio.http dans VS Code")
    
    return True

def check_current_env():
    """Vérifie la configuration actuelle du fichier .env"""
    env_path = Path(".env")
    if not env_path.exists():
        print("❌ Fichier .env non trouvé")
        return False
    
    print("\n🔧 Configuration actuelle dans .env:")
    print("-" * 35)
    
    with open(env_path, 'r') as f:
        lines = f.readlines()
    
    for line in lines:
        if line.startswith("FRAMEIO_"):
            key, value = line.strip().split("=", 1)
            if "your_" in value or "here" in value:
                print(f"⚠️  {key}: {value} (À configurer)")
            else:
                print(f"✅ {key}: {value}")
    
    return True

def main():
    """Fonction principale"""
    print("🚀 Analyse des credentials Adobe IMS pour Frame.io v4")
    print("=" * 60)
    
    if not analyze_credentials():
        sys.exit(1)
    
    print("\n" + "=" * 60)
    check_current_env()
    
    print("\n" + "=" * 60)
    print("📋 Prochaines étapes:")
    print("1. Créer une intégration Server-to-Server dans Adobe Developer Console")
    print("2. Configurer les variables manquantes dans .env")
    print("3. Tester l'authentification JWT avec scripts/test_frameio_auth.py")
    print("4. Valider l'intégration avec scripts/validate_frameio.py")

if __name__ == "__main__":
    main()

# [ARCHIVÉ] Ce script est obsolète : l'intégration Frame.io utilise uniquement OAuth Web App v4.
# Voir scripts/frameio_oauth_webapp_demo.py
