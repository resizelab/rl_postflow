#!/usr/bin/env python3
"""
Test simple de l'authentification Frame.io v4
"""

import asyncio
import os
import sys
from pathlib import Path

# Charger les variables d'environnement
try:
    from dotenv import load_dotenv
    env_file = Path(__file__).parent.parent / ".env"
    if env_file.exists():
        load_dotenv(env_file)
        print(f"✅ Variables d'environnement chargées depuis {env_file}")
    else:
        print("⚠️  Fichier .env non trouvé, utilisation des variables système")
except ImportError:
    print("⚠️  python-dotenv non installé, utilisation des variables système")

# Import direct du module auth
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

try:
    import httpx
    print("✅ httpx disponible")
except ImportError:
    print("❌ httpx non disponible - pip install httpx")
    sys.exit(1)

# Import du module auth
try:
    from integrations.frameio.auth import FrameIOAuth, FrameIOAuthError
    print("✅ Module auth importé avec succès")
except Exception as e:
    print(f"❌ Erreur d'import du module auth: {e}")
    sys.exit(1)

async def test_auth():
    """Test de l'authentification"""
    print("\n" + "="*50)
    print("🔐 TEST D'AUTHENTIFICATION FRAME.IO V4")
    print("="*50)
    
    # Vérifier les variables d'environnement
    required_vars = [
        'FRAMEIO_CLIENT_ID',
        'FRAMEIO_CLIENT_SECRET',
        'FRAMEIO_ACCOUNT_ID',
        'FRAMEIO_WORKSPACE_ID'
    ]
    
    missing_vars = []
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            missing_vars.append(var)
        else:
            print(f"✅ {var}: {value[:10]}...")
    
    if missing_vars:
        print(f"\n❌ Variables manquantes: {', '.join(missing_vars)}")
        print("💡 Exécutez: python scripts/configure_frameio.py")
        return False
    
    # Test de l'authentification
    try:
        print("\n🔑 Création de l'instance d'authentification...")
        auth = FrameIOAuth()
        
        print("🔐 Demande d'un token d'accès...")
        token = await auth.get_access_token()
        print(f"✅ Token obtenu: {token[:30]}...")
        
        print("🔍 Validation du token...")
        is_valid = await auth.is_token_valid()
        if is_valid:
            print("✅ Token valide")
        else:
            print("❌ Token invalide")
            await auth.close()
            return False
        
        print("📊 Récupération des informations du compte...")
        account_info = await auth.validate_credentials()
        
        accounts = account_info.get('data', [])
        if accounts:
            account = accounts[0]
            print(f"✅ Compte: {account.get('name', 'N/A')}")
            print(f"   ID: {account.get('id', 'N/A')}")
            print(f"   Type: {account.get('type', 'N/A')}")
        else:
            print("❌ Aucun compte trouvé")
        
        await auth.close()
        
        print("\n🎉 TEST RÉUSSI!")
        print("L'authentification Frame.io v4 fonctionne correctement.")
        return True
        
    except FrameIOAuthError as e:
        print(f"❌ Erreur d'authentification: {e}")
        return False
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_auth())
    sys.exit(0 if success else 1)
