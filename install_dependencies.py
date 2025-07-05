#!/usr/bin/env python3
"""
Installation des dépendances pour UNDLM PostFlow
"""

import subprocess
import sys
import os
from pathlib import Path


def install_requirements():
    """Installe les dépendances depuis requirements.txt."""
    print("📦 Installation des dépendances UNDLM PostFlow")
    print("=" * 60)
    
    requirements_path = Path("requirements.txt")
    if not requirements_path.exists():
        print("❌ Fichier requirements.txt non trouvé")
        return False
    
    try:
        print("🔄 Installation en cours...")
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ])
        print("✅ Installation réussie")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur lors de l'installation : {e}")
        return False


def verify_installation():
    """Vérifie que les packages sont installés."""
    print("\n🔍 Vérification de l'installation...")
    
    packages = [
        'requests',
        'gspread', 
        'google.auth',
        'google.oauth2',
        'pathlib'
    ]
    
    success = True
    for package in packages:
        try:
            __import__(package)
            print(f"   ✅ {package}")
        except ImportError:
            print(f"   ❌ {package}")
            success = False
    
    return success


def main():
    """Fonction principale."""
    print("🚀 UNDLM PostFlow - Installation des dépendances")
    print("=" * 60)
    
    # Installation
    if install_requirements():
        print("\n✅ Installation terminée")
        
        # Vérification
        if verify_installation():
            print("\n🎉 Toutes les dépendances sont installées")
            print("\n📋 Prochaines étapes :")
            print("1. Configurer les intégrations : python configure_integrations.py")
            print("2. Tester les intégrations : python test_integrations_simple.py")
            print("3. Valider le setup : python tests/setup_validation.py")
        else:
            print("\n⚠️ Certaines dépendances manquent encore")
            print("Vérifiez les erreurs ci-dessus")
    else:
        print("\n❌ Échec de l'installation")
        print("Vérifiez votre connexion internet et les permissions")


if __name__ == "__main__":
    main()
