#!/usr/bin/env python3
"""
Diagnostic Frame.io v4 - Version autonome
"""

import os
import sys
import json
import httpx
from datetime import datetime
from pathlib import Path

# [ARCHIVÉ] Ce script est obsolète : l'intégration Frame.io utilise uniquement OAuth Web App v4.
# Voir scripts/frameio_oauth_webapp_demo.py

def load_env_file():
    """Charge les variables d'environnement depuis le fichier .env"""
    env_path = Path(__file__).parent.parent / ".env"
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                if line.strip() and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value

def test_connectivity():
    """Test la connectivité avec les services"""
    print("🔍 Test de connectivité...")
    
    tests = []
    
    # Test Adobe IMS
    try:
        with httpx.Client(timeout=10) as client:
            response = client.get("https://ims-na1.adobelogin.com/ims/profile/v1")
            tests.append(("Adobe IMS", response.status_code, "✅"))
    except Exception as e:
        tests.append(("Adobe IMS", str(e), "❌"))
    
    # Test Frame.io API
    try:
        with httpx.Client(timeout=10) as client:
            response = client.get("https://api.frame.io/v4/health")
            tests.append(("Frame.io API v4", response.status_code, "✅"))
    except Exception as e:
        tests.append(("Frame.io API v4", str(e), "❌"))
    
    for name, result, status in tests:
        print(f"   {status} {name}: {result}")
    
    return all(status == "✅" for _, _, status in tests)

def analyze_credentials():
    """Analyse les credentials"""
    print("\n🔍 Analyse des credentials...")
    
    required_vars = [
        'FRAMEIO_CLIENT_ID',
        'FRAMEIO_CLIENT_SECRET', 
        'FRAMEIO_ORG_ID',
        'FRAMEIO_ACCOUNT_ID',
        'FRAMEIO_WORKSPACE_ID'
    ]
    
    missing = []
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            missing.append(var)
            print(f"   ❌ {var}: Non défini")
        else:
            if var in ['FRAMEIO_CLIENT_SECRET']:
                print(f"   ✅ {var}: {value[:8]}...")
            else:
                print(f"   ✅ {var}: {value}")
    
    return len(missing) == 0

def test_oauth_client_credentials():
    """Test OAuth Client Credentials"""
    print("\n🔍 Test OAuth Client Credentials...")
    
    client_id = os.getenv('FRAMEIO_CLIENT_ID')
    client_secret = os.getenv('FRAMEIO_CLIENT_SECRET')
    
    if not all([client_id, client_secret]):
        print("   ❌ Credentials manquants")
        return False
    
    endpoints = [
        ("IMS Token v3", "https://ims-na1.adobelogin.com/ims/token/v3"),
        ("IMS Token v2", "https://ims-na1.adobelogin.com/ims/token/v2"),
    ]
    
    for name, endpoint in endpoints:
        try:
            with httpx.Client(timeout=10) as client:
                data = {
                    "grant_type": "client_credentials",
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "scope": "frameio_api"
                }
                
                response = client.post(endpoint, data=data, headers={
                    "Content-Type": "application/x-www-form-urlencoded"
                })
                
                if response.status_code == 200:
                    print(f"   ✅ {name}: SUCCESS")
                    token_data = response.json()
                    print(f"      Token type: {token_data.get('token_type')}")
                    print(f"      Expires in: {token_data.get('expires_in')} seconds")
                    return True
                else:
                    try:
                        error_info = response.json()
                        print(f"   ❌ {name}: {response.status_code} - {error_info}")
                    except:
                        print(f"   ❌ {name}: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"   ❌ {name}: Exception - {e}")
    
    return False

def test_frameio_projects():
    """Test de récupération des projets Frame.io"""
    print("\n🔍 Test récupération projets Frame.io...")
    
    client_id = os.getenv('FRAMEIO_CLIENT_ID')
    client_secret = os.getenv('FRAMEIO_CLIENT_SECRET')
    account_id = os.getenv('FRAMEIO_ACCOUNT_ID')
    
    if not all([client_id, client_secret, account_id]):
        print("   ❌ Configuration incomplète")
        return False
    
    try:
        # 1. Obtenir un token
        with httpx.Client(timeout=30) as client:
            token_data = {
                "grant_type": "client_credentials",
                "client_id": client_id,
                "client_secret": client_secret,
                "scope": "frameio_api"
            }
            
            token_response = client.post(
                "https://ims-na1.adobelogin.com/ims/token/v3",
                data=token_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if token_response.status_code != 200:
                print(f"   ❌ Impossible d'obtenir le token: {token_response.status_code}")
                return False
            
            token = token_response.json()["access_token"]
            print("   ✅ Token obtenu")
            
            # 2. Récupérer les projets
            projects_response = client.get(
                f"https://api.frame.io/v4/accounts/{account_id}/projects",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                }
            )
            
            if projects_response.status_code == 200:
                projects = projects_response.json()
                print(f"   ✅ Projets récupérés: {len(projects.get('data', []))} projets")
                return True
            else:
                print(f"   ❌ Erreur récupération projets: {projects_response.status_code}")
                try:
                    error_info = projects_response.json()
                    print(f"      Détails: {error_info}")
                except:
                    print(f"      Détails: {projects_response.text}")
                return False
                
    except Exception as e:
        print(f"   ❌ Exception: {e}")
        return False

def check_integration_type():
    """Vérifier le type d'intégration Adobe"""
    print("\n🔍 Vérification du type d'intégration...")
    
    # Vérifier si on a les éléments Server-to-Server
    technical_account_id = os.getenv('FRAMEIO_TECHNICAL_ACCOUNT_ID')
    private_key_path = os.getenv('FRAMEIO_PRIVATE_KEY_PATH')
    
    if technical_account_id and technical_account_id != 'your_technical_account_id_here':
        print("   ✅ Technical Account ID configuré")
    else:
        print("   ❌ Technical Account ID manquant")
    
    if private_key_path and Path(private_key_path).exists():
        print("   ✅ Clé privée trouvée")
    else:
        print("   ❌ Clé privée manquante")
    
    # Analyser les credentials JSON
    json_files = list(Path("data").glob("*.json"))
    for json_file in json_files:
        if "OAuth" in json_file.name or "Production" in json_file.name:
            try:
                with open(json_file, 'r') as f:
                    data = json.load(f)
                    
                integration_type = data.get('type', 'unknown')
                print(f"   📄 {json_file.name}: {integration_type}")
                
                if integration_type == "oauth_server_to_server":
                    print("   ✅ Intégration Server-to-Server trouvée")
                else:
                    print("   ⚠️ Type d'intégration non Server-to-Server")
                    
            except Exception as e:
                print(f"   ❌ Erreur lecture {json_file.name}: {e}")

def generate_report():
    """Génère un rapport complet"""
    print("\n📋 Génération du rapport...")
    
    report = {
        "timestamp": datetime.now().isoformat(),
        "tests": {
            "connectivity": test_connectivity(),
            "credentials": analyze_credentials(),
            "oauth": test_oauth_client_credentials(),
            "frameio_projects": test_frameio_projects()
        },
        "configuration": {
            "client_id": os.getenv('FRAMEIO_CLIENT_ID', 'NOT_SET')[:16] + "..." if os.getenv('FRAMEIO_CLIENT_ID') else 'NOT_SET',
            "has_client_secret": bool(os.getenv('FRAMEIO_CLIENT_SECRET')),
            "org_id": os.getenv('FRAMEIO_ORG_ID', 'NOT_SET'),
            "account_id": os.getenv('FRAMEIO_ACCOUNT_ID', 'NOT_SET'),
            "workspace_id": os.getenv('FRAMEIO_WORKSPACE_ID', 'NOT_SET'),
            "technical_account_id": os.getenv('FRAMEIO_TECHNICAL_ACCOUNT_ID', 'NOT_SET')
        }
    }
    
    # Recommandations
    recommendations = []
    if not report["tests"]["oauth"]:
        recommendations.append("Créer une intégration Server-to-Server dans Adobe Developer Console")
    if not report["tests"]["frameio_projects"]:
        recommendations.append("Vérifier les permissions de l'API Frame.io")
    
    report["recommendations"] = recommendations
    
    # Sauvegarder
    output_path = Path("output/frameio_v4_diagnostic.json")
    output_path.parent.mkdir(exist_ok=True)
    
    with open(output_path, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"   ✅ Rapport sauvegardé: {output_path}")
    
    return report

def main():
    """Fonction principale"""
    print("🔧 DIAGNOSTIC FRAME.IO V4")
    print("=" * 40)
    
    # Charger l'environnement
    load_env_file()
    
    # Vérifier le type d'intégration
    check_integration_type()
    
    # Générer le rapport
    report = generate_report()
    
    # Afficher les recommandations
    print("\n💡 Recommandations:")
    for rec in report["recommendations"]:
        print(f"   • {rec}")
    
    if not report["recommendations"]:
        print("   ✅ Configuration semble correcte")
    
    # Résumé
    passed_tests = sum(1 for test in report["tests"].values() if test)
    total_tests = len(report["tests"])
    
    print(f"\n📊 Résumé: {passed_tests}/{total_tests} tests réussis")
    
    if passed_tests == total_tests:
        print("🎉 Tous les tests sont réussis ! Frame.io v4 est prêt.")
    else:
        print("⚠️ Certains tests ont échoué. Voir les recommandations ci-dessus.")

if __name__ == "__main__":
    main()
