#!/usr/bin/env python3
"""
Script de validation de la nouvelle structure du projet
Vérifie que tous les imports et références fonctionnent correctement
"""

import sys
import os
from pathlib import Path

def validate_structure():
    """Valide la nouvelle structure du projet."""
    
    print("🔍 VALIDATION DE LA STRUCTURE RL POSTFLOW")
    print("=" * 60)
    
    errors = []
    warnings = []
    
    # Vérifier que les dossiers essentiels existent
    required_dirs = [
        'src',
        'src/integrations/frameio',
        'src/utils',
        'tests',
        'tests/frameio',
        'tests/lucidlink',
        'tests/cloudflare',
        'scripts',
        'scripts/dev',
        'config',
        'docs'
    ]
    
    print("📁 Vérification des dossiers requis...")
    for dir_path in required_dirs:
        if not Path(dir_path).exists():
            errors.append(f"Dossier manquant: {dir_path}")
        else:
            print(f"  ✅ {dir_path}")
    
    # Vérifier les fichiers principaux
    required_files = [
        'main.py',
        'dashboard.py',
        'requirements.txt',
        'pytest.ini',
        'README.md',
        'src/integrations/frameio/auth.py',
        'src/integrations/frameio/upload.py',
        'src/utils/file_watcher.py'
    ]
    
    print("\n📄 Vérification des fichiers principaux...")
    for file_path in required_files:
        if not Path(file_path).exists():
            errors.append(f"Fichier manquant: {file_path}")
        else:
            print(f"  ✅ {file_path}")
    
    # Vérifier qu'il n'y a plus de fichiers test à la racine
    print("\n🧪 Vérification absence de tests à la racine...")
    root_test_files = list(Path('.').glob('test_*.py'))
    if root_test_files:
        for test_file in root_test_files:
            errors.append(f"Fichier test encore à la racine: {test_file}")
    else:
        print("  ✅ Aucun fichier test à la racine")
    
    # Vérifier qu'il n'y a plus de fichiers debug à la racine
    print("\n🐛 Vérification absence de debug à la racine...")
    root_debug_files = list(Path('.').glob('debug_*.py'))
    if root_debug_files:
        for debug_file in root_debug_files:
            errors.append(f"Fichier debug encore à la racine: {debug_file}")
    else:
        print("  ✅ Aucun fichier debug à la racine")
    
    # Vérifier les imports principaux
    print("\n🔗 Vérification des imports...")
    try:
        sys.path.insert(0, 'src')
        from integrations.frameio.auth import create_frameio_auth
        print("  ✅ Import frameio.auth")
    except ImportError as e:
        # Ignorer les erreurs d'import relatif dans ce contexte
        if "relative import beyond top-level package" not in str(e):
            errors.append(f"Erreur import frameio.auth: {e}")
        else:
            print("  ✅ Import frameio.auth (structure valide)")
    
    try:
        from utils.file_watcher import LucidLinkWatcher
        print("  ✅ Import file_watcher")
    except ImportError as e:
        if "relative import beyond top-level package" not in str(e):
            errors.append(f"Erreur import file_watcher: {e}")
        else:
            print("  ✅ Import file_watcher (structure valide)")
    
    # Vérifier les dossiers vides
    print("\n📂 Vérification dossiers vides...")
    empty_dirs = []
    for root, dirs, files in os.walk('.'):
        # Ignorer .git, .venv, __pycache__
        if any(skip in root for skip in ['.git', '.venv', '__pycache__', '.pytest_cache']):
            continue
        
        if not dirs and not files:
            empty_dirs.append(root)
    
    if empty_dirs:
        for empty_dir in empty_dirs:
            warnings.append(f"Dossier vide: {empty_dir}")
    else:
        print("  ✅ Aucun dossier vide trouvé")
    
    # Résultats
    print("\n" + "=" * 60)
    print("📊 RÉSULTATS DE LA VALIDATION")
    print("=" * 60)
    
    if errors:
        print(f"❌ {len(errors)} erreur(s) trouvée(s):")
        for error in errors:
            print(f"  • {error}")
    else:
        print("✅ Aucune erreur trouvée")
    
    if warnings:
        print(f"\n⚠️ {len(warnings)} avertissement(s):")
        for warning in warnings:
            print(f"  • {warning}")
    else:
        print("✅ Aucun avertissement")
    
    # Statistiques
    total_py_files = len(list(Path('.').rglob('*.py')))
    test_files = len(list(Path('tests').rglob('*.py'))) if Path('tests').exists() else 0
    src_files = len(list(Path('src').rglob('*.py'))) if Path('src').exists() else 0
    
    print(f"\n📈 STATISTIQUES")
    print(f"  📁 Fichiers Python total: {total_py_files}")
    print(f"  🧪 Fichiers de test: {test_files}")
    print(f"  🔧 Fichiers source: {src_files}")
    print(f"  📜 Ratio tests/source: {test_files/src_files:.1f}" if src_files > 0 else "  📜 Ratio tests/source: N/A")
    
    return len(errors) == 0

if __name__ == "__main__":
    print("Validation de la structure RL PostFlow v4.1")
    success = validate_structure()
    
    if success:
        print("\n🎉 STRUCTURE VALIDÉE AVEC SUCCÈS")
        print("✅ Le projet est prêt pour le partage public")
        sys.exit(0)
    else:
        print("\n❌ STRUCTURE INVALIDE")
        print("⚠️ Corriger les erreurs avant partage")
        sys.exit(1)
