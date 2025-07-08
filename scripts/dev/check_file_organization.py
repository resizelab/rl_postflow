#!/usr/bin/env python3
"""
Validation finale de l'organisation des fichiers avant publication
"""

import os
import json
from pathlib import Path
from collections import defaultdict

def check_file_organization():
    """Vérifie l'organisation des fichiers dans le projet"""
    
    print("🔍 Vérification de l'organisation des fichiers...")
    
    # Structure attendue
    expected_structure = {
        "racine": {
            "autorisés": [
                "main.py", "dashboard.py", "README.md", "requirements.txt", 
                "requirements-production.txt", "pipeline_config.json", 
                "pytest.ini", ".gitignore", "validation_report.json"
            ],
            "interdits": [
                "test_*.py", "debug_*.py", "temp_*.py", "*_test.py",
                "*.log", "*.tmp", "*.cache", "backup_*"
            ]
        },
        "config/": {
            "autorisés": ["*.json", "*.json.example", "*.key"],
            "interdits": ["*.backup", "*.old", "*.tmp"]
        },
        "src/": {
            "autorisés": ["**/*.py", "__init__.py"],
            "interdits": ["test_*.py", "debug_*.py", "temp_*.py"]
        },
        "scripts/": {
            "autorisés": ["**/*.py", "**/*.sh"],
            "interdits": []
        },
        "tests/": {
            "autorisés": ["**/*.py", "conftest.py"],
            "interdits": []
        },
        "docs/": {
            "autorisés": ["**/*.md", "**/*.txt"],
            "interdits": []
        }
    }
    
    issues = []
    
    # Vérifier la racine
    root_files = [f for f in os.listdir('.') if os.path.isfile(f)]
    
    print(f"📁 Fichiers à la racine: {len(root_files)}")
    for file in root_files:
        print(f"  - {file}")
        
        # Vérifier les fichiers interdits à la racine
        for pattern in expected_structure["racine"]["interdits"]:
            if pattern.startswith("*"):
                if file.endswith(pattern[1:]):
                    issues.append(f"❌ Fichier mal placé à la racine: {file}")
            elif pattern.endswith("*"):
                if file.startswith(pattern[:-1]):
                    issues.append(f"❌ Fichier mal placé à la racine: {file}")
            elif pattern == file:
                issues.append(f"❌ Fichier mal placé à la racine: {file}")
    
    return issues

def check_directory_structure():
    """Vérifie la structure des répertoires"""
    
    print("\n🏗️ Vérification de la structure des répertoires...")
    
    required_dirs = [
        "src", "config", "scripts", "tests", "docs", "data"
    ]
    
    optional_dirs = [
        "logs", "temp", "output", "examples", "templates"
    ]
    
    issues = []
    
    # Vérifier les répertoires obligatoires
    for dir_name in required_dirs:
        if not os.path.exists(dir_name):
            issues.append(f"❌ Répertoire obligatoire manquant: {dir_name}")
        elif not os.path.isdir(dir_name):
            issues.append(f"❌ {dir_name} n'est pas un répertoire")
        else:
            print(f"  ✅ {dir_name}/")
    
    # Lister les répertoires optionnels présents
    for dir_name in optional_dirs:
        if os.path.exists(dir_name) and os.path.isdir(dir_name):
            print(f"  📁 {dir_name}/ (optionnel)")
    
    return issues

def check_sensitive_files():
    """Vérifie qu'il n'y a pas de fichiers sensibles"""
    
    print("\n🔒 Vérification des fichiers sensibles...")
    
    sensitive_patterns = [
        "*.key", "*.pem", "*.p12", "*.pfx",
        "*secret*", "*password*", "*token*",
        "*.env", ".env*", "credentials*"
    ]
    
    sensitive_files = []
    
    for root, dirs, files in os.walk('.'):
        # Exclure certains répertoires
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['__pycache__', 'node_modules']]
        
        for file in files:
            file_path = os.path.join(root, file)
            
            # Vérifier les patterns sensibles
            for pattern in sensitive_patterns:
                if pattern.startswith("*") and pattern.endswith("*"):
                    if pattern[1:-1].lower() in file.lower():
                        sensitive_files.append(file_path)
                elif pattern.startswith("*"):
                    if file.lower().endswith(pattern[1:].lower()):
                        sensitive_files.append(file_path)
                elif pattern.endswith("*"):
                    if file.lower().startswith(pattern[:-1].lower()):
                        sensitive_files.append(file_path)
    
    # Filtrer les fichiers légitimes
    legitimate_files = [
        "./config/private.key",  # Clé publique/privée pour signature
        "./config/public.key"
    ]
    
    issues = []
    for file in sensitive_files:
        if file not in legitimate_files:
            issues.append(f"⚠️  Fichier potentiellement sensible: {file}")
        else:
            print(f"  ✅ {file} (légitime)")
    
    return issues

def check_test_files():
    """Vérifie que les fichiers de test sont bien organisés"""
    
    print("\n🧪 Vérification des fichiers de test...")
    
    test_files = []
    misplaced_tests = []
    
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['__pycache__']]
        
        for file in files:
            if file.startswith('test_') or file.endswith('_test.py') or 'test' in file.lower():
                file_path = os.path.join(root, file)
                test_files.append(file_path)
                
                # Vérifier s'il est bien placé
                if not (file_path.startswith('./tests/') or file_path.startswith('./scripts/')):
                    misplaced_tests.append(file_path)
    
    print(f"  📊 {len(test_files)} fichiers de test trouvés")
    
    for test_file in test_files:
        if test_file in misplaced_tests:
            print(f"  ❌ {test_file} (mal placé)")
        else:
            print(f"  ✅ {test_file}")
    
    return [f"❌ Fichier de test mal placé: {f}" for f in misplaced_tests]

def check_empty_directories():
    """Vérifie les répertoires vides"""
    
    print("\n📂 Vérification des répertoires vides...")
    
    empty_dirs = []
    
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['__pycache__']]
        
        # Vérifier si le répertoire est vide (pas de fichiers ni de sous-répertoires)
        if not dirs and not files:
            empty_dirs.append(root)
    
    for empty_dir in empty_dirs:
        print(f"  📁 {empty_dir} (vide)")
    
    # Les répertoires vides ne sont pas forcément problématiques
    return []

def check_gitignore():
    """Vérifie le fichier .gitignore"""
    
    print("\n🙈 Vérification du .gitignore...")
    
    gitignore_path = Path('.gitignore')
    if not gitignore_path.exists():
        return ["❌ Fichier .gitignore manquant"]
    
    with open(gitignore_path, 'r') as f:
        gitignore_content = f.read()
    
    required_patterns = [
        '__pycache__',
        '*.pyc',
        '*.log',
        '.env',
        'temp/',
        'data/private',
        'config/private'
    ]
    
    issues = []
    for pattern in required_patterns:
        if pattern not in gitignore_content:
            issues.append(f"⚠️  Pattern manquant dans .gitignore: {pattern}")
        else:
            print(f"  ✅ {pattern}")
    
    return issues

def generate_file_inventory():
    """Génère un inventaire des fichiers"""
    
    print("\n📋 Génération de l'inventaire des fichiers...")
    
    inventory = defaultdict(list)
    
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['__pycache__']]
        
        for file in files:
            if not file.startswith('.') and not file.endswith('.pyc'):
                file_path = os.path.join(root, file)
                category = root.split('/')[1] if '/' in root else 'racine'
                inventory[category].append(file_path)
    
    print(f"  📊 Inventaire généré: {sum(len(files) for files in inventory.values())} fichiers")
    
    return dict(inventory)

def main():
    """Fonction principale de validation"""
    
    print("🚀 VALIDATION FINALE - ORGANISATION DES FICHIERS")
    print("=" * 60)
    
    all_issues = []
    
    # Vérifications
    checks = [
        check_file_organization,
        check_directory_structure,
        check_sensitive_files,
        check_test_files,
        check_empty_directories,
        check_gitignore
    ]
    
    for check in checks:
        try:
            issues = check()
            all_issues.extend(issues)
        except Exception as e:
            print(f"❌ Erreur durant vérification: {e}")
            all_issues.append(f"❌ Erreur: {e}")
    
    # Générer l'inventaire
    inventory = generate_file_inventory()
    
    # Résumé final
    print("\n" + "=" * 60)
    print("📊 RÉSUMÉ DE LA VALIDATION")
    print("=" * 60)
    
    if not all_issues:
        print("🎉 ORGANISATION PARFAITE !")
        print("✅ Tous les fichiers sont bien organisés")
        print("✅ Prêt pour la publication")
        
        # Sauvegarder l'inventaire
        with open('file_inventory.json', 'w') as f:
            json.dump(inventory, f, indent=2)
        print("✅ Inventaire sauvegardé: file_inventory.json")
        
        return True
    else:
        print(f"⚠️  {len(all_issues)} problèmes détectés:")
        for issue in all_issues:
            print(f"  {issue}")
        
        print("\n🔧 Actions recommandées:")
        print("  1. Déplacer les fichiers mal placés")
        print("  2. Supprimer les fichiers temporaires")
        print("  3. Vérifier les fichiers sensibles")
        print("  4. Mettre à jour .gitignore si nécessaire")
        
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
