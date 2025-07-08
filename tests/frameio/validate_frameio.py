#!/usr/bin/env python3
"""
Frame.io Validation Script
Test et validation de la configuration Frame.io
"""

import os
import sys
import json
import requests
from pathlib import Path

def load_frameio_config():
    """Charger la configuration Frame.io."""
    config_path = "config/frameio_config.json"
    
    if not os.path.exists(config_path):
        print(f"❌ Fichier de configuration non trouvé: {config_path}")
        print("💡 Exécutez d'abord: python scripts/setup_frameio.py")
        return None
    
    try:
        with open(config_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Erreur lors du chargement de la configuration: {e}")
        return None

def validate_config_format(config):
    """Valider le format de la configuration."""
    print("🔍 Validation du format de configuration...")
    
    required_fields = ['api_token', 'base_url']
    errors = []
    
    for field in required_fields:
        if not config.get(field):
            errors.append(f"Champ requis manquant: {field}")
    
    # Vérifier le format du token
    token = config.get('api_token', '')
    if token and not token.startswith('fio-u-'):
        errors.append("Format de token invalide (devrait commencer par 'fio-u-')")
    
    # Vérifier l'URL de base
    base_url = config.get('base_url', '')
    if base_url and not base_url.startswith('https://api.frame.io'):
        errors.append("URL de base invalide")
    
    if errors:
        print("❌ Erreurs de configuration trouvées:")
        for error in errors:
            print(f"   • {error}")
        return False
    
    print("✅ Format de configuration valide")
    return True

def test_frameio_connection(config):
    """Tester la connexion à Frame.io."""
    print("\n🔗 Test de connexion à Frame.io...")
    
    token = config.get('api_token')
    base_url = config.get('base_url', 'https://api.frame.io/v2')
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }
    
    try:
        # Test avec l'endpoint /me
        response = requests.get(f"{base_url}/me", headers=headers, timeout=10)
        
        if response.status_code == 200:
            user_data = response.json()
            print("✅ Connexion réussie !")
            print(f"   👤 Utilisateur: {user_data.get('name', 'N/A')}")
            print(f"   📧 Email: {user_data.get('email', 'N/A')}")
            print(f"   🆔 ID: {user_data.get('id', 'N/A')}")
            return True
        elif response.status_code == 401:
            print("❌ Token invalide ou expiré")
            return False
        else:
            print(f"❌ Erreur de connexion: {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Timeout de connexion")
        return False
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        return False

def test_team_access(config):
    """Tester l'accès aux équipes configurées."""
    team_id = config.get('team_id')
    if not team_id:
        print("\n⏩ Aucune équipe configurée")
        return True
    
    print(f"\n👥 Test d'accès à l'équipe: {team_id}")
    
    token = config.get('api_token')
    base_url = config.get('base_url', 'https://api.frame.io/v2')
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }
    
    try:
        response = requests.get(f"{base_url}/teams/{team_id}", headers=headers, timeout=10)
        
        if response.status_code == 200:
            team_data = response.json()
            print(f"✅ Accès à l'équipe réussi: {team_data.get('name', 'N/A')}")
            return True
        elif response.status_code == 404:
            print("❌ Équipe non trouvée")
            return False
        elif response.status_code == 403:
            print("❌ Accès refusé à l'équipe")
            return False
        else:
            print(f"❌ Erreur d'accès à l'équipe: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors du test d'équipe: {e}")
        return False

def test_project_access(config):
    """Tester l'accès au projet configuré."""
    project_id = config.get('project_id')
    if not project_id:
        print("\n⏩ Aucun projet configuré")
        return True
    
    print(f"\n📁 Test d'accès au projet: {project_id}")
    
    token = config.get('api_token')
    base_url = config.get('base_url', 'https://api.frame.io/v2')
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }
    
    try:
        response = requests.get(f"{base_url}/projects/{project_id}", headers=headers, timeout=10)
        
        if response.status_code == 200:
            project_data = response.json()
            print(f"✅ Accès au projet réussi: {project_data.get('name', 'N/A')}")
            return True
        elif response.status_code == 404:
            print("❌ Projet non trouvé")
            return False
        elif response.status_code == 403:
            print("❌ Accès refusé au projet")
            return False
        else:
            print(f"❌ Erreur d'accès au projet: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors du test de projet: {e}")
        return False

def main():
    """Fonction principale de validation."""
    print("🎬 VALIDATION CONFIGURATION FRAME.IO")
    print("=" * 60)
    
    # Charger la configuration
    config = load_frameio_config()
    if not config:
        return False
    
    # Validation du format
    if not validate_config_format(config):
        return False
    
    # Test de connexion
    if not test_frameio_connection(config):
        print("\n💡 Vérifiez votre token et votre connexion internet")
        return False
    
    # Test d'accès équipe
    team_ok = test_team_access(config)
    
    # Test d'accès projet  
    project_ok = test_project_access(config)
    
    # Résumé final
    print(f"\n📊 RÉSUMÉ DE LA VALIDATION")
    print("=" * 40)
    print(f"   • Configuration: ✅ Valide")
    print(f"   • Connexion Frame.io: ✅ OK")
    print(f"   • Accès équipe: {'✅ OK' if team_ok else '❌ Échec'}")
    print(f"   • Accès projet: {'✅ OK' if project_ok else '❌ Échec'}")
    
    if team_ok and project_ok:
        print(f"\n🎉 CONFIGURATION ENTIÈREMENT FONCTIONNELLE !")
        print("🚀 Votre pipeline PostFlow est prêt à utiliser Frame.io")
    else:
        print(f"\n⚠️  Configuration partiellement fonctionnelle")
        print("💡 Vous pouvez utiliser Frame.io mais sans équipe/projet spécifique")
    
    return True

if __name__ == "__main__":
    main()