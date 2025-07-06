#!/usr/bin/env python3
"""
Test direct du module auth Frame.io v4
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
        print(f"✅ Variables d'environnement chargées")
    else:
        print("⚠️  Fichier .env non trouvé")
except ImportError:
    print("⚠️  python-dotenv non installé")

# Import direct du module auth avec importlib
import importlib.util

def load_auth_module():
    """Charge le module auth directement"""
    auth_path = Path(__file__).parent.parent / "src/integrations/frameio/auth.py"
    
    if not auth_path.exists():
        raise FileNotFoundError(f"Module auth non trouvé: {auth_path}")
    
    spec = importlib.util.spec_from_file_location("frameio_auth", auth_path)
    auth_module = importlib.util.module_from_spec(spec)
    
    # Exécuter le module
    spec.loader.exec_module(auth_module)
    
    return auth_module

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
        elif value.startswith('your_'):
            print(f"⚠️  {var}: {value} (à configurer)")
            missing_vars.append(var)
        else:
            print(f"✅ {var}: {value[:10]}...")
    
    if missing_vars:
        print(f"\n❌ Variables à configurer: {', '.join(missing_vars)}")
        print("💡 Modifiez le fichier .env avec vos vraies valeurs")
        print("   Ou exécutez: python scripts/configure_frameio.py")
        return False
    
    # Charger le module auth
    try:
        print("\n📦 Chargement du module auth...")
        auth_module = load_auth_module()
        FrameIOAuth = auth_module.FrameIOAuth
        FrameIOAuthError = auth_module.FrameIOAuthError
        print("✅ Module auth chargé avec succès")
    except Exception as e:
        print(f"❌ Erreur lors du chargement: {e}")
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
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_auth())
    sys.exit(0 if success else 1)
