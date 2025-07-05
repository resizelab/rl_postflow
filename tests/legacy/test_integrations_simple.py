"""
Test simple des intégrations UNDLM PostFlow
Version allégée sans dépendances externes
"""

import json
import requests
from pathlib import Path
from datetime import datetime
import sys
import os

# Ajouter le chemin du projet
sys.path.append(str(Path(__file__).parent))


def load_config():
    """Charge la configuration pipeline."""
    config_path = Path("pipeline_config.json")
    if not config_path.exists():
        print("❌ Fichier pipeline_config.json non trouvé")
        return None
    
    with open(config_path, 'r') as f:
        return json.load(f)


def test_discord_webhook(webhook_url: str, channel_name: str = "postproduction") -> bool:
    """Test simple du webhook Discord."""
    if not webhook_url:
        print("❌ URL webhook Discord non configurée")
        return False
    
    try:
        payload = {
            "content": "🎬 Test de configuration UNDLM PostFlow",
            "username": "RL PostFlow Bot",
            "embeds": [{
                "title": "Configuration Test",
                "description": f"Discord webhook configuré avec succès pour #{channel_name}",
                "color": 0x00ff00,
                "fields": [
                    {
                        "name": "Pipeline",
                        "value": "UNDLM PostFlow",
                        "inline": True
                    },
                    {
                        "name": "Status",
                        "value": "✅ Opérationnel",
                        "inline": True
                    }
                ],
                "timestamp": datetime.now().isoformat(),
                "footer": {
                    "text": "Resize Lab PostFlow"
                }
            }]
        }
        
        response = requests.post(webhook_url, json=payload, timeout=10)
        response.raise_for_status()
        
        print("✅ Discord webhook test réussi")
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Discord webhook test échoué : {e}")
        return False


def test_frameio_token(api_token: str) -> bool:
    """Test simple du token Frame.io."""
    if not api_token:
        print("❌ Token Frame.io non configuré")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get("https://api.frame.io/v2/me", headers=headers, timeout=10)
        response.raise_for_status()
        
        user_info = response.json()
        print(f"✅ Frame.io token test réussi - Utilisateur: {user_info.get('name', 'Unknown')}")
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Frame.io token test échoué : {e}")
        return False


def test_google_sheets_file(credentials_file: str) -> bool:
    """Test simple du fichier credentials Google Sheets."""
    if not credentials_file:
        print("❌ Fichier credentials Google Sheets non configuré")
        return False
    
    credentials_path = Path(credentials_file)
    if not credentials_path.exists():
        print(f"❌ Fichier credentials non trouvé : {credentials_path}")
        return False
    
    try:
        with open(credentials_path, 'r') as f:
            credentials = json.load(f)
        
        required_fields = ['type', 'project_id', 'client_email', 'private_key']
        for field in required_fields:
            if field not in credentials:
                print(f"❌ Champ manquant dans credentials : {field}")
                return False
        
        print(f"✅ Fichier credentials Google Sheets valide - Projet: {credentials.get('project_id')}")
        return True
        
    except Exception as e:
        print(f"❌ Test fichier credentials échoué : {e}")
        return False


def check_requirements():
    """Vérifie si les packages requis sont installés."""
    print("📦 Vérification des dépendances...")
    
    required_packages = {
        'requests': 'requests',
        'gspread': 'gspread',
        'google.auth': 'google-auth'
    }
    
    missing_packages = []
    
    for package, pip_name in required_packages.items():
        try:
            __import__(package)
            print(f"   ✅ {package}")
        except ImportError:
            print(f"   ❌ {package} (installer avec: pip install {pip_name})")
            missing_packages.append(pip_name)
    
    if missing_packages:
        print(f"\\n📥 Packages manquants : {', '.join(missing_packages)}")
        print("💡 Installer avec : pip install -r requirements.txt")
        return False
    
    return True


def main():
    """Fonction principale de test."""
    print("🚀 Test des intégrations UNDLM PostFlow")
    print("=" * 60)
    
    # Vérifier les dépendances
    if not check_requirements():
        print("\\n⚠️ Certaines dépendances manquent. Tests limités.")
    
    # Charger la configuration
    config = load_config()
    if not config:
        print("\\n❌ Impossible de charger la configuration")
        return
    
    print(f"\\n📋 Configuration chargée : {config.get('project_name', 'Unknown')}")
    
    # Tests des intégrations
    results = []
    
    print("\\n🎮 Test Discord")
    print("-" * 20)
    discord_config = config.get('discord', {})
    discord_result = test_discord_webhook(
        discord_config.get('webhook_url', ''),
        discord_config.get('channel_name', 'postproduction')
    )
    results.append(('Discord', discord_result))
    
    print("\\n🎬 Test Frame.io")
    print("-" * 20)
    frameio_config = config.get('frameio', {})
    frameio_result = test_frameio_token(frameio_config.get('api_token', ''))
    results.append(('Frame.io', frameio_result))
    
    print("\\n📊 Test Google Sheets")
    print("-" * 20)
    sheets_config = config.get('google_sheets', {})
    sheets_result = test_google_sheets_file(sheets_config.get('credentials_file', ''))
    results.append(('Google Sheets', sheets_result))
    
    # Résumé des tests
    print("\\n" + "=" * 60)
    print("📊 Résumé des tests")
    print("=" * 60)
    
    successful = 0
    for service, result in results:
        status = "✅ Configuré" if result else "❌ Non configuré"
        print(f"{service:<15} : {status}")
        if result:
            successful += 1
    
    print(f"\\n🎯 Résultat : {successful}/{len(results)} intégrations configurées")
    
    if successful == len(results):
        print("\\n🎉 Toutes les intégrations sont configurées !")
        print("\\n📋 Prochaines étapes :")
        print("1. Tester le pipeline complet : python main.py")
        print("2. Valider la structure : python tests/setup_validation.py")
        print("3. Commencer la production")
    elif successful > 0:
        print("\\n⚠️ Certaines intégrations sont configurées")
        print("\\n📋 Pour configurer les intégrations manquantes :")
        print("1. Lancer : python configure_integrations.py")
        print("2. Suivre les instructions pour chaque service")
        print("3. Relancer ce test")
    else:
        print("\\n❌ Aucune intégration configurée")
        print("\\n📋 Pour commencer la configuration :")
        print("1. Lancer : python configure_integrations.py")
        print("2. Ou éditer manuellement pipeline_config.json")
        print("3. Consulter : docs/INTEGRATIONS_SETUP.md")
    
    print("\\n📚 Documentation complète : docs/INTEGRATIONS_SETUP.md")


if __name__ == "__main__":
    main()
