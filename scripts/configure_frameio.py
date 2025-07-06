#!/usr/bin/env python3
"""
Configuration principale Frame.io pour PostFlow
Guide l'utilisateur vers la meilleure solution selon ses besoins
"""

import os
import sys
import json

def check_existing_config():
    """Vérifier s'il existe déjà une configuration."""
    config_files = [
        ('config/frameio_config.json', 'Developer Token'),
        ('config/frameio_oauth_config.json', 'OAuth Adobe IMS')
    ]
    
    existing = []
    for file_path, config_type in config_files:
        if os.path.exists(file_path):
            existing.append((file_path, config_type))
    
    return existing

def show_existing_config(existing):
    """Afficher les configurations existantes."""
    print("📋 CONFIGURATIONS EXISTANTES TROUVÉES:")
    print("=" * 50)
    
    for file_path, config_type in existing:
        print(f"   • {config_type}: {file_path}")
    
    print(f"\n🔄 Options:")
    print(f"   1. Garder la configuration existante")
    print(f"   2. Reconfigurer (écrasera la config actuelle)")
    print(f"   3. Valider la configuration existante")
    
    while True:
        choice = input(f"\nVotre choix (1-3): ").strip()
        
        if choice == '1':
            print("✅ Conservation de la configuration existante")
            return 'keep'
        elif choice == '2':
            print("🔄 Reconfiguration...")
            return 'reconfigure'
        elif choice == '3':
            print("🧪 Validation...")
            return 'validate'
        else:
            print("❌ Choix invalide, essayez encore")

def show_setup_options():
    """Afficher les options de configuration."""
    print("🎯 CHOIX DE LA MÉTHODE D'INTÉGRATION")
    print("=" * 60)
    print()
    print("📋 Deux solutions disponibles:")
    print()
    print("1. 🚀 DEVELOPER TOKEN (Recommandé - Solution immédiate)")
    print("   • ✅ Configuration rapide (5 minutes)")
    print("   • ✅ Fonctionne immédiatement")
    print("   • ✅ API Frame.io v2 stable")
    print("   • ✅ Idéal pour débloquer votre pipeline")
    print("   • ℹ️  Nécessite un token depuis developer.frame.io")
    print()
    print("2. 🔬 OAUTH ADOBE IMS (Avancé - Solution future)")
    print("   • 🎯 API Frame.io v4 moderne")
    print("   • 🔒 Authentification OAuth sécurisée")
    print("   • ⚠️  Nécessite configuration Adobe Developer Console")
    print("   • ⚠️  Frame.io doit être activé dans votre projet Adobe")
    print("   • ⚠️  Plus complexe à configurer")
    print()
    print("💡 RECOMMANDATION:")
    print("   Commencez par l'option 1 pour débloquer immédiatement votre pipeline,")
    print("   puis explorez l'option 2 si vous avez besoin des fonctionnalités v4.")
    print()
    
    while True:
        choice = input("Votre choix (1 ou 2): ").strip()
        
        if choice == '1':
            return 'developer_token'
        elif choice == '2':
            return 'oauth_adobe'
        else:
            print("❌ Choix invalide, entrez 1 ou 2")

def run_developer_token_setup():
    """Exécuter la configuration Developer Token."""
    print("\n🚀 LANCEMENT DE LA CONFIGURATION DEVELOPER TOKEN")
    print("=" * 70)
    
    os.system("python scripts/setup_frameio.py")

def run_oauth_setup():
    """Exécuter la configuration OAuth Adobe."""
    print("\n🔬 LANCEMENT DE LA CONFIGURATION OAUTH ADOBE IMS")
    print("=" * 70)
    
    os.system("python scripts/setup_adobe_oauth.py")

def run_validation():
    """Exécuter la validation de configuration."""
    print("\n🧪 LANCEMENT DE LA VALIDATION")
    print("=" * 50)
    
    os.system("python scripts/validate_frameio.py")

def show_next_steps():
    """Afficher les prochaines étapes."""
    print("\n🚀 PROCHAINES ÉTAPES")
    print("=" * 40)
    print()
    print("📋 Maintenant que Frame.io est configuré:")
    print()
    print("1. 🧪 Tester votre configuration:")
    print("   python scripts/validate_frameio.py")
    print()
    print("2. 🎬 Lancer votre pipeline PostFlow:")
    print("   python main.py")
    print()
    print("3. 📊 Utiliser le dashboard (optionnel):")
    print("   python dashboard.py")
    print()
    print("4. 📖 Consulter la documentation:")
    print("   • README.md")
    print("   • docs/")
    print()
    print("💡 En cas de problème:")
    print("   • Relancez la validation: python scripts/validate_frameio.py")
    print("   • Reconfigurez: python scripts/configure_frameio.py")

def main():
    """Fonction principale de configuration."""
    print("🎬 CONFIGURATION FRAME.IO - POSTFLOW PIPELINE")
    print("=" * 80)
    print("Assistant de configuration pour l'intégration Frame.io")
    print()
    
    # Vérifier les configurations existantes
    existing = check_existing_config()
    
    if existing:
        action = show_existing_config(existing)
        
        if action == 'keep':
            print("\n✅ Configuration conservée")
            show_next_steps()
            return True
        elif action == 'validate':
            run_validation()
            return True
        # Sinon, continuer avec la reconfiguration
    
    # Choix de la méthode
    method = show_setup_options()
    
    # Exécution de la configuration choisie
    if method == 'developer_token':
        run_developer_token_setup()
    elif method == 'oauth_adobe':
        run_oauth_setup()
    
    # Prochaines étapes
    show_next_steps()
    
    return True

if __name__ == "__main__":
    main()
