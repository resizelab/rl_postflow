#!/usr/bin/env python3
"""
Guide pour renouveler le token Adobe IMS pour Frame.io
"""

def main():
    print("🔐 RENOUVELLEMENT TOKEN ADOBE IMS POUR FRAME.IO")
    print("=" * 55)
    print()
    print("📋 VOTRE CLIENT ID ADOBE:")
    print("   1b9748d7b40a408d97f943a75b6a9f18")
    print()
    print("🔗 ÉTAPES À SUIVRE:")
    print()
    print("1. Allez sur Adobe Developer Console:")
    print("   https://developer.adobe.com/console/")
    print()
    print("2. Connectez-vous avec votre compte Adobe")
    print()
    print("3. Trouvez votre projet Frame.io avec le Client ID:")
    print("   1b9748d7b40a408d97f943a75b6a9f18")
    print()
    print("4. Dans la section 'Service Account (JWT)':")
    print("   - Générez un nouveau JWT")
    print("   - OU générez un nouvel Access Token")
    print()
    print("5. Copiez le nouveau token")
    print()
    print("6. Remplacez 'api_token' dans config/integrations.json")
    print()
    print("7. Testez avec: python scripts/test_frameio_token.py")
    print()
    print("📝 NOTES:")
    print("   - Le token Adobe IMS expire après 24h")
    print("   - Frame.io utilise l'authentification Adobe depuis le rachat")
    print("   - Vous avez tous les IDs nécessaires dans la config")
    print()

if __name__ == "__main__":
    main()
