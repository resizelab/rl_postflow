#!/usr/bin/env python3
"""
UNDLM PostFlow - Script pour exécuter tous les tests
"""

import sys
import subprocess
from pathlib import Path


def run_command(command, description):
    """Exécuter une commande et afficher le résultat"""
    print(f"\n{'='*60}")
    print(f"🔧 {description}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print(f"⚠️ Warnings/Errors:\n{result.stderr}")
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Erreur lors de l'exécution: {e}")
        return False


def main():
    """Script principal pour exécuter tous les tests"""
    
    print("🚀 UNDLM PostFlow - Exécution de tous les tests")
    print("=" * 70)
    
    # Changer vers le répertoire racine du projet
    project_root = Path(__file__).parent
    
    # Liste des tests à exécuter
    tests = [
        {
            "command": f"cd {project_root} && python tests/setup_validation.py",
            "description": "Validation complète du setup"
        },
        {
            "command": f"cd {project_root} && python tests/test_server_structure.py",
            "description": "Test de la structure serveur LucidLink"
        },
        {
            "command": f"cd {project_root} && python tests/test_integrations_simple.py",
            "description": "Test des intégrations et nomenclatures"
        }
    ]
    
    # Exécuter tous les tests
    success_count = 0
    
    for test in tests:
        success = run_command(test["command"], test["description"])
        if success:
            success_count += 1
    
    # Résumé final
    print(f"\n{'='*70}")
    print(f"📊 RÉSUMÉ DES TESTS")
    print(f"{'='*70}")
    print(f"✅ Tests réussis: {success_count}/{len(tests)}")
    
    if success_count == len(tests):
        print("🎉 Tous les tests sont passés avec succès!")
        print("\n🚀 Le pipeline UNDLM PostFlow est prêt pour la production!")
        return True
    else:
        print(f"❌ {len(tests) - success_count} tests ont échoué")
        print("🔧 Veuillez vérifier les erreurs ci-dessus")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
