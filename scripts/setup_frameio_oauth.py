#!/usr/bin/env python3
"""
Guide de configuration OAuth Frame.io
"""

def print_oauth_setup_guide():
    print("🔧 CONFIGURATION OAUTH FRAME.IO")
    print("=" * 50)
    print()
    print("📋 ÉTAPES À SUIVRE:")
    print()
    print("1. Allez sur le portail développeur Frame.io :")
    print("   https://developer.frame.io/")
    print()
    print("2. Connectez-vous avec votre compte Frame.io")
    print()
    print("3. Créez une nouvelle application :")
    print("   - Type: Web Application")
    print("   - Nom: RL PostFlow")
    print("   - Description: Pipeline de post-production UNDLM")
    print("   - Redirect URI: http://localhost:8080/auth/callback")
    print()
    print("4. Récupérez les identifiants :")
    print("   - Client ID")
    print("   - Client Secret")
    print()
    print("5. Ajoutez-les dans config/integrations.json :")
    print('   "frameio": {')
    print('     "client_id": "votre_client_id",')
    print('     "client_secret": "votre_client_secret",')
    print('     ...')
    print('   }')
    print()
    print("6. Relancez le script test_frameio_token.py")
    print()
    print("📖 DOCUMENTATION :")
    print("   - Frame.io API v4: https://docs.frame.io/reference/api")
    print("   - OAuth 2.0: https://docs.frame.io/docs/oauth-20")
    print()

def check_current_config():
    """Vérifier la config actuelle"""
    try:
        import json
        from pathlib import Path
        
        config_path = Path(__file__).parent.parent / "config" / "integrations.json"
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        frameio_config = config.get('frameio', {})
        
        print("🔍 CONFIGURATION ACTUELLE:")
        print("-" * 30)
        print(f"✅ api_token: {'✓' if frameio_config.get('api_token') else '✗'}")
        print(f"❓ client_id: {'✓' if frameio_config.get('client_id') else '✗ (manquant)'}")
        print(f"❓ client_secret: {'✓' if frameio_config.get('client_secret') else '✗ (manquant)'}")
        print(f"✅ account_id: {frameio_config.get('account_id', 'N/A')}")
        print(f"✅ workspace_id: {frameio_config.get('workspace_id', 'N/A')}")
        print(f"✅ project_id: {frameio_config.get('project_id', 'N/A')}")
        print(f"✅ base_url: {frameio_config.get('base_url', 'N/A')}")
        print()
        
        if not frameio_config.get('client_id') or not frameio_config.get('client_secret'):
            print("❌ PROBLÈME: client_id et client_secret manquants")
            print("   → Suivez le guide ci-dessus pour les obtenir")
            return False
        else:
            print("✅ Configuration OAuth complète !")
            return True
            
    except Exception as e:
        print(f"❌ Erreur lecture config: {e}")
        return False

def main():
    if not check_current_config():
        print()
        print_oauth_setup_guide()
    else:
        print("🎉 La configuration semble complète !")
        print("   Vous pouvez maintenant tester avec: python scripts/test_frameio_token.py")

if __name__ == "__main__":
    main()
