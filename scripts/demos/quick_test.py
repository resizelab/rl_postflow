#!/usr/bin/env python3
"""
Script de test rapide pour valider la structure PostFlow
"""

import pytest
import sys
from pathlib import Path

def run_quick_tests():
    """Exécute les tests essentiels rapidement."""
    print("🚀 Tests rapides PostFlow")
    print("=" * 50)
    
    # Tests critiques qui doivent passer
    critical_tests = [
        "tests/unit/test_error_handler.py::TestPersistentQueue",
        "tests/unit/test_file_watcher.py::TestFileEvent",
    ]
    
    for test in critical_tests:
        print(f"\n🔍 Test: {test}")
        result = pytest.main(["-v", test])
        if result != 0:
            print(f"❌ ÉCHEC: {test}")
            return False
        else:
            print(f"✅ SUCCÈS: {test}")
    
    print("\n🎉 Tests critiques validés !")
    print("\n📋 Résumé de la structure:")
    print("tests/")
    print("├── 📁 unit/ (tests unitaires)")
    print("├── 📁 integration/ (tests d'intégration)")
    print("├── 📁 fixtures/ (données de test)")
    print("├── 📁 legacy/ (anciens tests)")
    print("├── conftest.py (configuration pytest)")
    print("└── requirements-test.txt (dépendances)")
    
    print("\n⚡ Commandes utiles:")
    print("pytest tests/unit/          # Tests unitaires")
    print("pytest tests/integration/   # Tests d'intégration")
    print("pytest tests/ --cov=src     # Tests avec coverage")
    print("pytest tests/ -k error      # Tests contenant 'error'")
    
    return True

if __name__ == "__main__":
    success = run_quick_tests()
    sys.exit(0 if success else 1)
