#!/usr/bin/env python3
"""
Script de nettoyage et migration des tests PostFlow
"""

import os
import shutil
from pathlib import Path

def cleanup_tests():
    """Nettoie et organise les tests."""
    print("🧹 Nettoyage des tests PostFlow...")
    
    project_root = Path(__file__).parent
    tests_dir = project_root / "tests"
    legacy_dir = tests_dir / "legacy"
    
    # Créer le README legacy
    legacy_readme = legacy_dir / "README.md"
    with open(legacy_readme, 'w') as f:
        f.write("""# Tests Legacy

Ces fichiers sont les anciens tests avant la restructuration avec pytest.

## Fichiers legacy
- `test_error_handling.py` - Tests originaux du gestionnaire d'erreurs
- `test_simple.py` - Tests simples de debug
- `test_debug.py` - Tests de debug avancés
- `test_integrations_simple.py` - Tests d'intégrations originaux

## Migration
Ces tests ont été migrés vers la nouvelle structure pytest :
- `tests/unit/` - Tests unitaires
- `tests/integration/` - Tests d'intégration

Les nouveaux tests utilisent pytest avec fixtures et mocks appropriés.
""")
    
    # Nettoyer les fichiers de test temporaires
    temp_files = [
        "test_postflow.db",
        "test_workflow.db", 
        "test_watcher.db",
        "test_health.db",
        "test_queue.db",
        "debug_test.db",
        "test.db",
        "test_error_handling.log"
    ]
    
    for temp_file in temp_files:
        temp_path = project_root / temp_file
        if temp_path.exists():
            temp_path.unlink()
            print(f"   ❌ Supprimé {temp_file}")
    
    # Vérifier les doubles dans tests/
    old_integrations = tests_dir / "test_integrations_simple.py"
    if old_integrations.exists():
        shutil.move(str(old_integrations), str(legacy_dir / "test_integrations_simple_old.py"))
        print(f"   📦 Déplacé {old_integrations.name} vers legacy")
    
    print("✅ Nettoyage terminé !")
    print("\n📁 Structure finale des tests :")
    print("tests/")
    print("├── conftest.py")
    print("├── pytest.ini")
    print("├── requirements-test.txt")
    print("├── unit/")
    print("│   ├── test_error_handler.py")
    print("│   ├── test_file_watcher.py")
    print("│   └── test_integrations.py")
    print("├── integration/")
    print("│   ├── test_workflow.py")
    print("│   └── test_server_structure.py")
    print("├── fixtures/")
    print("│   └── test_data.py")
    print("└── legacy/")
    print("    └── (anciens tests)")
    
    print("\n🚀 Pour exécuter les nouveaux tests :")
    print("pip install -r tests/requirements-test.txt")
    print("pytest tests/")

if __name__ == "__main__":
    cleanup_tests()
