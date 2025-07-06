#!/usr/bin/env python3
"""
Script de diagnostic avancé pour Frame.io v4 - Identifie les problèmes d'authentification
"""

import os
import sys
import json
import httpx
from datetime import datetime
from pathlib import Path

# Ajouter src/ au path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from integrations.frameio.auth import FrameIOAuth

def test_adobe_ims_connectivity():
    """Test la connectivité avec Adobe IMS"""
    print("🔍 Test de connectivité Adobe IMS...")
    
    try:
        with httpx.Client(timeout=10) as client:
            # Test du endpoint IMS
            response = client.get("https://ims-na1.adobelogin.com/ims/profile/v1")
            print(f"   ✅ Adobe IMS accessible (Status: {response.status_code})")
            
            # Test du endpoint Frame.io
            response = client.get("https://api.frame.io/v4/health")
            print(f"   ✅ Frame.io API v4 accessible (Status: {response.status_code})")
            
            return True
    except Exception as e:
        print(f"   ❌ Erreur de connectivité: {e}")
        return False

def analyze_credentials():
    """Analyse les credentials actuels"""
    print("\n🔍 Analyse des credentials...")
    
    client_id = os.getenv('FRAMEIO_CLIENT_ID')
    client_secret = os.getenv('FRAMEIO_CLIENT_SECRET')
    org_id = os.getenv('FRAMEIO_ORG_ID')
    
    if not all([client_id, client_secret, org_id]):
        print("   ❌ Credentials manquants")
        return False
    
    # Test du format des credentials
    if '@AdobeOrg' not in org_id:
        print("   ⚠️ Format org_id suspect (doit contenir @AdobeOrg)")
    
    print(f"   ✅ Client ID: {client_id[:16]}...")
    print(f"   ✅ Client Secret: {client_secret[:16]}...")
    print(f"   ✅ Org ID: {org_id}")
    
    return True

def test_oauth_endpoints():
    """Test les différents endpoints OAuth"""
    print("\n🔍 Test des endpoints OAuth...")
    
    client_id = os.getenv('FRAMEIO_CLIENT_ID')
    client_secret = os.getenv('FRAMEIO_CLIENT_SECRET')
    
    endpoints = [
        ("Client Credentials v3", "https://ims-na1.adobelogin.com/ims/token/v3"),
        ("Client Credentials v2", "https://ims-na1.adobelogin.com/ims/token/v2"),
        ("Client Credentials v1", "https://ims-na1.adobelogin.com/ims/token/v1"),
    ]
    
    for name, endpoint in endpoints:
        try:
            with httpx.Client() as client:
                data = {
                    "grant_type": "client_credentials",
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "scope": "frameio_api"
                }
                
                response = client.post(endpoint, data=data)
                
                if response.status_code == 200:
                    print(f"   ✅ {name}: SUCCESS")
                    return True
                else:
                    error_info = response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text
                    print(f"   ❌ {name}: {response.status_code} - {error_info}")
        except Exception as e:
            print(f"   ❌ {name}: Exception - {e}")
    
    return False

def test_jwt_assertion():
    """Test la génération d'assertion JWT"""
    print("\n🔍 Test de génération JWT...")
    
    try:
        auth = FrameIOAuth()
        
        # Test si on peut générer une assertion
        if hasattr(auth, 'get_jwt_assertion'):
            assertion = auth.get_jwt_assertion()
            print(f"   ✅ JWT assertion générée: {assertion[:50]}...")
            return True
        else:
            print("   ❌ Méthode get_jwt_assertion non trouvée")
            return False
            
    except Exception as e:
        print(f"   ❌ Erreur génération JWT: {e}")
        return False

def test_integration_type():
    """Teste le type d'intégration Adobe"""
    print("\n🔍 Test du type d'intégration...")
    
    client_id = os.getenv('FRAMEIO_CLIENT_ID')
    
    try:
        with httpx.Client() as client:
            # Test avec le format Server-to-Server
            response = client.get(f"https://ims-na1.adobelogin.com/ims/profile/v1", 
                                headers={"Authorization": f"Bearer {client_id}"})
            
            if response.status_code == 401:
                print("   ⚠️ L'intégration semble être OAuth Web App (pas Server-to-Server)")
            else:
                print(f"   ✅ Type d'intégration OK (Status: {response.status_code})")
                
    except Exception as e:
        print(f"   ❌ Erreur test intégration: {e}")

def generate_diagnostic_report():
    """Génère un rapport de diagnostic complet"""
    print("\n📋 Génération du rapport de diagnostic...")
    
    report = {
        "timestamp": datetime.now().isoformat(),
        "environment": {
            "python_version": sys.version,
            "working_directory": os.getcwd(),
            "frameio_config": {
                "client_id": os.getenv('FRAMEIO_CLIENT_ID', 'NOT_SET')[:16] + "..." if os.getenv('FRAMEIO_CLIENT_ID') else 'NOT_SET',
                "has_client_secret": bool(os.getenv('FRAMEIO_CLIENT_SECRET')),
                "org_id": os.getenv('FRAMEIO_ORG_ID', 'NOT_SET'),
                "account_id": os.getenv('FRAMEIO_ACCOUNT_ID', 'NOT_SET'),
                "workspace_id": os.getenv('FRAMEIO_WORKSPACE_ID', 'NOT_SET')
            }
        },
        "tests": {
            "connectivity": test_adobe_ims_connectivity(),
            "credentials": analyze_credentials(),
            "oauth_endpoints": test_oauth_endpoints(),
            "jwt_assertion": test_jwt_assertion()
        },
        "recommendations": []
    }
    
    # Générer des recommandations
    if not report["tests"]["oauth_endpoints"]:
        report["recommendations"].append("Créer une intégration Server-to-Server dans Adobe Developer Console")
    
    if not report["tests"]["jwt_assertion"]:
        report["recommendations"].append("Vérifier la configuration de la clé privée et du technical_account_id")
    
    # Sauvegarder le rapport
    output_path = Path("output/frameio_v4_diagnostic.json")
    output_path.parent.mkdir(exist_ok=True)
    
    with open(output_path, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"   ✅ Rapport sauvegardé: {output_path}")
    return report

def main():
    """Fonction principale de diagnostic"""
    print("🔧 DIAGNOSTIC FRAME.IO V4")
    print("=" * 40)
    
    # Charger les variables d'environnement
    from dotenv import load_dotenv
    load_dotenv()
    
    # Exécuter les tests
    test_adobe_ims_connectivity()
    test_integration_type()
    
    # Générer le rapport
    report = generate_diagnostic_report()
    
    # Afficher les recommandations
    print("\n💡 Recommandations:")
    for rec in report["recommendations"]:
        print(f"   • {rec}")
    
    if not report["recommendations"]:
        print("   ✅ Aucune recommandation - Configuration semble correcte")
    
    print("\n🎯 Prochaines étapes:")
    print("   1. Créer une intégration Server-to-Server dans Adobe Developer Console")
    print("   2. Récupérer le Technical Account ID")
    print("   3. Tester l'authentification JWT")
    print("   4. Valider la récupération des projets Frame.io")

if __name__ == "__main__":
    main()

# [ARCHIVÉ] Ce script est obsolète : l'intégration Frame.io utilise uniquement OAuth Web App v4.
# Voir scripts/frameio_oauth_webapp_demo.py
