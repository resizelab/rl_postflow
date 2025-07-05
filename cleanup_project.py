#!/usr/bin/env python3
"""
Script de nettoyage de la racine du projet PostFlow
Réorganise et supprime les fichiers obsolètes ou temporaires
"""

import os
import shutil
from pathlib import Path
from datetime import datetime

def cleanup_project_root():
    """Nettoie la racine du projet."""
    print("🧹 Nettoyage de la racine du projet PostFlow")
    print("=" * 50)
    
    project_root = Path(__file__).parent
    
    # Créer un dossier scripts/ pour les utilitaires
    scripts_dir = project_root / "scripts"
    scripts_dir.mkdir(exist_ok=True)
    
    # Créer un dossier examples/ pour les démos
    examples_dir = project_root / "examples"
    examples_dir.mkdir(exist_ok=True)
    
    # Fichiers à déplacer vers scripts/
    scripts_to_move = [
        "cleanup_old_structure.py",
        "cleanup_tests.py", 
        "configure_error_handling.py",
        "configure_integrations.py",
        "create_folder_structure.py",
        "install_dependencies.py",
        "quick_test.py"
    ]
    
    # Fichiers à déplacer vers examples/
    examples_to_move = [
        "export_by_scene.py",
        "pipeline_demo.py"
    ]
    
    # Fichiers à supprimer (obsolètes)
    files_to_delete = [
        "run_tests.py",  # Remplacé par pytest
    ]
    
    # Déplacer vers scripts/
    for file_name in scripts_to_move:
        source = project_root / file_name
        if source.exists():
            destination = scripts_dir / file_name
            shutil.move(str(source), str(destination))
            print(f"📦 Déplacé {file_name} → scripts/")
    
    # Déplacer vers examples/
    for file_name in examples_to_move:
        source = project_root / file_name
        if source.exists():
            destination = examples_dir / file_name
            shutil.move(str(source), str(destination))
            print(f"📦 Déplacé {file_name} → examples/")
    
    # Supprimer les fichiers obsolètes
    for file_name in files_to_delete:
        file_path = project_root / file_name
        if file_path.exists():
            file_path.unlink()
            print(f"❌ Supprimé {file_name} (obsolète)")
    
    # Nettoyer les fichiers temporaires
    temp_patterns = [
        "*.log",
        "*.db",
        "*.tmp",
        "test_*.db",
        "debug_*.db"
    ]
    
    for pattern in temp_patterns:
        for temp_file in project_root.glob(pattern):
            if temp_file.is_file():
                temp_file.unlink()
                print(f"🗑️  Supprimé {temp_file.name} (temporaire)")
    
    # Nettoyer le cache pytest
    pytest_cache = project_root / ".pytest_cache"
    if pytest_cache.exists():
        shutil.rmtree(pytest_cache)
        print("🗑️  Supprimé .pytest_cache/")
    
    # Créer des README pour les nouveaux dossiers
    create_scripts_readme(scripts_dir)
    create_examples_readme(examples_dir)
    
    print("\n✅ Nettoyage terminé !")
    print("\n📁 Structure finale de la racine :")
    print("project/")
    print("├── main.py                  # Point d'entrée principal")
    print("├── dashboard.py             # Dashboard web de monitoring")
    print("├── requirements.txt         # Dépendances Python")
    print("├── pytest.ini             # Configuration des tests")
    print("├── src/                    # Code source")
    print("├── tests/                  # Tests organisés")
    print("├── scripts/                # Scripts utilitaires")
    print("├── examples/               # Exemples et démos")
    print("├── docs/                   # Documentation")
    print("└── data/                   # Données et configuration")


def create_scripts_readme(scripts_dir):
    """Crée un README pour le dossier scripts."""
    readme_content = """# Scripts PostFlow

Ce dossier contient les scripts utilitaires pour PostFlow.

## 🔧 Scripts de configuration
- `configure_error_handling.py` - Configuration interactive du gestionnaire d'erreurs
- `configure_integrations.py` - Configuration des intégrations (Frame.io, Google Sheets, Discord)
- `install_dependencies.py` - Installation automatique des dépendances

## 🏗️ Scripts de structure
- `create_folder_structure.py` - Création de la structure de dossiers LucidLink
- `cleanup_old_structure.py` - Nettoyage de l'ancienne structure

## 🧪 Scripts de test
- `quick_test.py` - Tests rapides de validation
- `cleanup_tests.py` - Nettoyage et organisation des tests

## 📝 Utilisation

```bash
# Configuration complète
python scripts/configure_integrations.py
python scripts/configure_error_handling.py

# Structure de dossiers
python scripts/create_folder_structure.py

# Tests rapides
python scripts/quick_test.py
```
"""
    
    readme_path = scripts_dir / "README.md"
    with open(readme_path, 'w') as f:
        f.write(readme_content)
    print("📝 Créé scripts/README.md")


def create_examples_readme(examples_dir):
    """Crée un README pour le dossier examples."""
    readme_content = """# Exemples PostFlow

Ce dossier contient des exemples et démonstrations du système PostFlow.

## 📋 Exemples disponibles

### `pipeline_demo.py`
Démonstration complète du pipeline de post-production :
- Parsing des données de shot
- Workflow de traitement
- Intégrations avec les services externes

### `export_by_scene.py`
Exemple d'export de données par scène :
- Export sélectif par séquence
- Génération de rapports
- Formats de sortie personnalisés

## 🚀 Exécution

```bash
# Démonstration complète
python examples/pipeline_demo.py

# Export par scène
python examples/export_by_scene.py
```

## 📚 Apprentissage

Ces exemples sont parfaits pour :
- Comprendre le fonctionnement du pipeline
- Tester les intégrations
- Développer de nouvelles fonctionnalités
- Formation des utilisateurs
"""
    
    readme_path = examples_dir / "README.md"
    with open(readme_path, 'w') as f:
        f.write(readme_content)
    print("📝 Créé examples/README.md")


if __name__ == "__main__":
    cleanup_project_root()
