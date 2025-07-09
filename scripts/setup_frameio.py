#!/usr/bin/env python3
"""
Configuration et test des Developer Tokens Frame.io
Solution immédiate pour débloquer le pipeline PostFlow
"""

import json
import requests
import sys
import os
from pathlib import Path

# Ajouter le répertoire parent au path pour les imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def get_developer_token():
    """Récupérer le Developer Token de l'utilisateur."""
    print("🔑 CONFIGURATION DEVELOPER TOKEN FRAME.IO")
    print("=" * 60)
    print()
    print("📋 Pour obtenir un Developer Token Frame.io :")
    print("   1. Connectez-vous à https://developer.frame.io/")
    print("   2. Allez dans 'API Tokens' ou 'Personal Access Tokens'")
    print("   3. Cliquez sur 'Create Token' ou 'Generate Token'")
    print("   4. Copiez le token généré")
    print("   5. Le token aura le format: fio-u-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    print()
    
    token = input("🔐 Entrez votre Developer Token Frame.io: ").strip()
    
    if not token:
        print("❌ Token requis")
        return None
    
    if not token.startswith('fio-u-'):
        print("⚠️  Format inhabituel de token (devrait commencer par 'fio-u-')")
        response = input("Continuer quand même ? (o/N): ").strip().lower()
        if response != 'o':
            return None
    
    return token

def test_frameio_token(token):
    """Tester le token Frame.io avec l'API v2."""
    print(f"\n🧪 TEST DU TOKEN FRAME.IO")
    print("=" * 60)
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }
    
    # Test des endpoints essentiels
    endpoints = [
        ("Profil utilisateur", "GET", "https://api.frame.io/v2/me"),
        ("Comptes", "GET", "https://api.frame.io/v2/accounts"),
        ("Équipes", "GET", "https://api.frame.io/v2/teams"),
    ]
    
    results = {}
    
    for name, method, url in endpoints:
        print(f"\n📋 Test {name}")
        print(f"   {method} {url}")
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                results[name] = data
                print("   ✅ Succès !")
                
                # Afficher des informations utiles
                if name == "Profil utilisateur":
                    print(f"   👤 Nom: {data.get('name', 'N/A')}")
                    print(f"   📧 Email: {data.get('email', 'N/A')}")
                    print(f"   🆔 ID: {data.get('id', 'N/A')}")
                    
                elif name == "Comptes":
                    count = len(data) if isinstance(data, list) else "N/A"
                    print(f"   📊 Nombre de comptes: {count}")
                    if isinstance(data, list) and data:
                        for i, account in enumerate(data[:2]):
                            print(f"   📁 {account.get('name', 'N/A')} (ID: {account.get('id', 'N/A')})")
                            
                elif name == "Équipes":
                    count = len(data) if isinstance(data, list) else "N/A"
                    print(f"   👥 Nombre d'équipes: {count}")
                    if isinstance(data, list) and data:
                        for i, team in enumerate(data[:2]):
                            print(f"   👥 {team.get('name', 'N/A')} (ID: {team.get('id', 'N/A')})")
            
            elif response.status_code == 401:
                print("   ❌ 401 Unauthorized - Token invalide ou expiré")
                return None
            elif response.status_code == 403:
                print("   ❌ 403 Forbidden - Permissions insuffisantes")
                return None
            else:
                print(f"   ⚠️  {response.status_code} {response.reason}")
                try:
                    error_detail = response.json()
                    print(f"   📄 Détail: {error_detail}")
                except:
                    print(f"   📄 Réponse: {response.text[:100]}")
                    
        except requests.exceptions.Timeout:
            print("   ⏱️  Timeout - vérifiez votre connexion")
            return None
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Erreur de requête: {e}")
            return None
        except Exception as e:
            print(f"   ❌ Erreur: {e}")
            return None
    
    return results

def select_team_and_project(results, token):
    """Permettre à l'utilisateur de sélectionner une équipe et un projet."""
    teams_data = results.get("Équipes", [])
    
    if not teams_data or not isinstance(teams_data, list) or not teams_data:
        print("\n⚠️  Aucune équipe trouvée, configuration limitée au token")
        return None, None
    
    print(f"\n👥 SÉLECTION DE L'ÉQUIPE")
    print("=" * 40)
    
    print("Équipes disponibles:")
    for i, team in enumerate(teams_data):
        print(f"   {i+1}. {team.get('name', 'N/A')} (ID: {team.get('id', 'N/A')})")
    
    try:
        choice = input(f"\nChoisissez une équipe (1-{len(teams_data)}) ou Entrée pour ignorer: ").strip()
        
        if not choice:
            print("⏩ Équipe ignorée")
            return None, None
            
        team_idx = int(choice) - 1
        if 0 <= team_idx < len(teams_data):
            selected_team = teams_data[team_idx]
            team_id = selected_team.get('id')
            team_name = selected_team.get('name')
            
            print(f"✅ Équipe sélectionnée: {team_name}")
            
            # Récupérer les projets de cette équipe
            project_id = get_team_projects(team_id, token)
            
            return team_id, project_id
        else:
            print("❌ Sélection invalide")
            return None, None
            
    except (ValueError, IndexError):
        print("❌ Sélection invalide")
        return None, None

def get_team_projects(team_id, token):
    """Récupérer les projets d'une équipe."""
    print(f"\n📁 RÉCUPÉRATION DES PROJETS")
    print("=" * 40)
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }
    
    try:
        url = f"https://api.frame.io/v2/teams/{team_id}/projects"
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            projects = response.json()
            
            if not projects or not isinstance(projects, list) or not projects:
                print("ℹ️  Aucun projet trouvé dans cette équipe")
                return None
            
            print(f"Projets disponibles ({len(projects)}):")
            for i, project in enumerate(projects[:5]):  # Limiter à 5
                print(f"   {i+1}. {project.get('name', 'N/A')} (ID: {project.get('id', 'N/A')})")
            
            if len(projects) > 5:
                print(f"   ... et {len(projects) - 5} autres")
            
            choice = input(f"\nChoisissez un projet (1-{min(len(projects), 5)}) ou Entrée pour ignorer: ").strip()
            
            if not choice:
                print("⏩ Projet ignoré")
                return None
                
            project_idx = int(choice) - 1
            if 0 <= project_idx < len(projects):
                selected_project = projects[project_idx]
                project_id = selected_project.get('id')
                project_name = selected_project.get('name')
                
                print(f"✅ Projet sélectionné: {project_name}")
                return project_id
            else:
                print("❌ Sélection invalide")
                return None
                
        else:
            print(f"⚠️  Impossible de récupérer les projets: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Erreur lors de la récupération des projets: {e}")
        return None

def save_configuration(token, results, team_id, project_id):
    """Sauvegarder la configuration Frame.io."""
    print(f"\n💾 SAUVEGARDE DE LA CONFIGURATION")
    print("=" * 50)
    
    # Créer la configuration
    me_data = results.get("Profil utilisateur", {})
    
    config = {
        "api_token": token,
        "base_url": "https://api.frame.io/v2",
        "timeout": 30,
        "max_retries": 3,
        "upload_enabled": True,
        "auto_notify": True,
        
        # Informations utilisateur
        "user_id": me_data.get('id'),
        "user_name": me_data.get('name'),
        "user_email": me_data.get('email'),
        
        # Configuration équipe/projet
        "team_id": team_id or "",
        "project_id": project_id or "",
        
        # Paramètres upload
        "chunk_size": 8388608,  # 8MB
        "parallel_uploads": 2,
        
        # Paramètres de review
        "review_settings": {}
    }
    
    try:
        # Créer le répertoire config s'il n'existe pas
        os.makedirs('config', exist_ok=True)
        
        config_path = 'config/frameio_config.json'
        
        # Sauvegarder avec indentation pour la lisibilité
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"✅ Configuration sauvegardée: {config_path}")
        
        # Afficher un résumé
        print(f"\n📋 RÉSUMÉ DE LA CONFIGURATION:")
        print(f"   • Token: {token[:20]}...")
        print(f"   • Utilisateur: {config.get('user_name', 'N/A')}")
        print(f"   • Email: {config.get('user_email', 'N/A')}")
        print(f"   • Équipe ID: {team_id or 'Non configurée'}")
        print(f"   • Projet ID: {project_id or 'Non configuré'}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la sauvegarde: {e}")
        print(f"\n📋 Configuration à sauvegarder manuellement dans config/frameio_config.json:")
        print(json.dumps(config, indent=2))
        return False

def main():
    """Fonction principale de configuration."""
    print("🚀 CONFIGURATION FRAME.IO - DEVELOPER TOKEN")
    print("=" * 80)
    print("Solution immédiate pour débloquer votre pipeline PostFlow")
    print("Compatible avec Frame.io API v2")
    print()
    
    # Étape 1: Récupérer le token
    token = get_developer_token()
    if not token:
        print("❌ Configuration annulée")
        return False
    
    # Étape 2: Tester le token
    results = test_frameio_token(token)
    if not results:
        print("❌ Le token ne fonctionne pas")
        return False
    
    # Étape 3: Sélectionner équipe et projet
    team_id, project_id = select_team_and_project(results, token)
    
    # Étape 4: Sauvegarder la configuration
    success = save_configuration(token, results, team_id, project_id)
    
    if success:
        print(f"\n🎉 CONFIGURATION TERMINÉE AVEC SUCCÈS !")
        print("=" * 60)
        print("🚀 Prochaines étapes:")
        print("   1. Testez votre configuration:")
        print("      python scripts/validate_frameio.py")
        print("   2. Lancez votre pipeline:")
        print("      python main.py")
        print("   3. (Optionnel) Configurez OAuth Adobe pour v4:")
        print("      python scripts/setup_adobe_oauth.py")
        return True
    else:
        print(f"\n💔 Erreur lors de la configuration")
        return False

if __name__ == "__main__":
    main()
