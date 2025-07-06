#!/usr/bin/env python3
"""
Test de configuration Frame.io v4 - Vérification des variables
"""

import os
from pathlib import Path

# Charger les variables d'environnement
try:
    from dotenv import load_dotenv
    env_file = Path(__file__).parent.parent / ".env"
    if env_file.exists():
        load_dotenv(env_file)
        print(f"✅ Variables d'environnement chargées depuis {env_file}")
    else:
        print("⚠️  Fichier .env non trouvé")
except ImportError:
    print("⚠️  python-dotenv non installé")

def check_frameio_config():
    """Vérifie la configuration Frame.io"""
    print("\n" + "="*60)
    print("🔍 VÉRIFICATION CONFIGURATION FRAME.IO V4")
    print("="*60)
    
    # Variables Adobe IMS
    print("\n🔐 Adobe IMS Authentication:")
    ims_vars = [
        ('FRAMEIO_CLIENT_ID', 'Client ID'),
        ('FRAMEIO_CLIENT_SECRET', 'Client Secret'),
        ('FRAMEIO_ORG_ID', 'Organization ID'),
        ('FRAMEIO_TECHNICAL_ACCOUNT_ID', 'Technical Account ID'),
        ('FRAMEIO_PRIVATE_KEY_PATH', 'Private Key Path')
    ]
    
    ims_configured = 0
    for var, description in ims_vars:
        value = os.getenv(var)
        if value and not value.startswith('your_'):
            if 'SECRET' in var or 'KEY' in var:
                print(f"   ✅ {description}: {value[:10]}...***")
            else:
                print(f"   ✅ {description}: {value}")
            ims_configured += 1
        else:
            print(f"   ❌ {description}: À configurer")
    
    # Variables Frame.io
    print("\n📂 Frame.io REST Endpoints:")
    frameio_vars = [
        ('FRAMEIO_ACCOUNT_ID', 'Account ID'),
        ('FRAMEIO_WORKSPACE_ID', 'Workspace ID'),
        ('FRAMEIO_DEFAULT_PROJECT_ID', 'Default Project ID')
    ]
    
    frameio_configured = 0
    for var, description in frameio_vars:
        value = os.getenv(var)
        if value and not value.startswith('your_'):
            print(f"   ✅ {description}: {value}")
            frameio_configured += 1
        else:
            print(f"   ❌ {description}: À configurer")
    
    # Configuration optionnelle
    print("\n⚙️  Configuration optionnelle:")
    optional_vars = [
        ('FRAMEIO_BASE_URL', 'Base URL'),
        ('FRAMEIO_IMS_HOST', 'IMS Host'),
        ('FRAMEIO_TIMEOUT', 'Timeout'),
        ('FRAMEIO_MAX_RETRIES', 'Max Retries')
    ]
    
    for var, description in optional_vars:
        value = os.getenv(var)
        if value:
            print(f"   ✅ {description}: {value}")
    
    # Résumé
    print("\n" + "="*60)
    print("📊 RÉSUMÉ:")
    print(f"   Adobe IMS: {ims_configured}/5 variables configurées")
    print(f"   Frame.io: {frameio_configured}/3 variables configurées")
    
    if ims_configured == 5 and frameio_configured == 3:
        print("   🎉 Configuration complète!")
        return True
    else:
        print("   ⚠️  Configuration incomplète")
        
        print("\n💡 PROCHAINES ÉTAPES:")
        if ims_configured < 5:
            print("   1. Configurez Adobe IMS sur https://developer.adobe.com/console/")
            print("   2. Récupérez ORG_ID, TECHNICAL_ACCOUNT_ID et la clé privée")
            print("   3. Mettez à jour le fichier .env")
        
        if frameio_configured < 3:
            print("   4. Vérifiez vos IDs Frame.io dans les URLs")
        
        return False

def check_private_key():
    """Vérifie si la clé privée existe"""
    key_path = os.getenv('FRAMEIO_PRIVATE_KEY_PATH')
    if key_path and not key_path.startswith('path/to/'):
        key_file = Path(key_path)
        if key_file.exists():
            print(f"   ✅ Clé privée trouvée: {key_path}")
            return True
        else:
            print(f"   ❌ Clé privée non trouvée: {key_path}")
            return False
    else:
        print("   ❌ Chemin de clé privée non configuré")
        return False

if __name__ == "__main__":
    config_ok = check_frameio_config()
    
    if config_ok:
        print("\n🔑 Vérification de la clé privée:")
        key_ok = check_private_key()
        
        if key_ok:
            print("\n🚀 Configuration prête pour les tests!")
            print("   Exécutez: python scripts/test_frameio_auth.py")
        else:
            print("\n⚠️  Clé privée manquante")
    
    print("\n" + "="*60)
