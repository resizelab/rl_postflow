#!/usr/bin/env python3
"""
Script de nettoyage automatique du repository PostFlow
Prépare le repo pour publication/commit
"""

import os
import shutil
import subprocess
from pathlib import Path

def clean_python_cache():
    """Supprimer les fichiers de cache Python"""
    print("🧹 Nettoyage des fichiers de cache Python...")
    
    # Supprimer __pycache__
    for root, dirs, files in os.walk('.'):
        for dir_name in dirs:
            if dir_name == '__pycache__':
                cache_path = Path(root) / dir_name
                print(f"  Suppression: {cache_path}")
                shutil.rmtree(cache_path)
    
    # Supprimer les fichiers .pyc
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.pyc'):
                pyc_path = Path(root) / file
                print(f"  Suppression: {pyc_path}")
                pyc_path.unlink()

def clean_system_files():
    """Supprimer les fichiers système"""
    print("🧹 Nettoyage des fichiers système...")
    
    system_files = ['.DS_Store', 'Thumbs.db', '._.DS_Store']
    
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file in system_files:
                sys_path = Path(root) / file
                print(f"  Suppression: {sys_path}")
                sys_path.unlink()

def clean_temp_files():
    """Nettoyer les fichiers temporaires"""
    print("🧹 Nettoyage des fichiers temporaires...")
    
    temp_patterns = ['*.tmp', '*.temp', '*~', '*.bak']
    temp_dirs = ['temp', 'tmp']
    
    for root, dirs, files in os.walk('.'):
        for file in files:
            file_path = Path(root) / file
            if any(file_path.match(pattern) for pattern in temp_patterns):
                # Garder les fichiers importants dans tmp (comme les clés SSL)
                if not (file_path.suffix == '.key' or file_path.suffix == '.pem'):
                    print(f"  Suppression: {file_path}")
                    file_path.unlink()
                else:
                    print(f"  Conservé: {file_path}")

def clean_test_files():
    """Supprimer les fichiers de test"""
    print("🧹 Nettoyage des fichiers de test...")
    
    test_patterns = ['test_*.mov', 'test_*.mp4', 'test_*.avi', '*_test.*']
    
    for root, dirs, files in os.walk('.'):
        for file in files:
            file_path = Path(root) / file
            if any(file_path.match(pattern) for pattern in test_patterns):
                print(f"  Suppression: {file_path}")
                file_path.unlink()

def clean_logs():
    """Nettoyer les logs mais garder la structure"""
    print("🧹 Nettoyage des logs...")
    
    logs_dir = Path('logs')
    if logs_dir.exists():
        for log_file in logs_dir.glob('*.log'):
            print(f"  Suppression: {log_file}")
            log_file.unlink()

def check_sensitive_files():
    """Vérifier qu'aucun fichier sensible n'est présent"""
    print("🔍 Vérification des fichiers sensibles...")
    
    sensitive_files = [
        'config/frameio_config.json',
        'config/integrations.json',
        'data/watcher_state.json',
        '.env',
        'credentials.json'
    ]
    
    found_sensitive = False
    for file_path in sensitive_files:
        if Path(file_path).exists():
            print(f"  ⚠️  SENSIBLE: {file_path}")
            found_sensitive = True
    
    if not found_sensitive:
        print("  ✅ Aucun fichier sensible détecté")
    
    return not found_sensitive

def create_production_requirements():
    """Créer requirements-production.txt sans dépendances de dev"""
    print("📦 Création de requirements-production.txt...")
    
    dev_packages = [
        'pytest',
        'pytest-cov',
        'black',
        'flake8',
        'mypy',
        'ipython',
        'jupyter'
    ]
    
    requirements_path = Path('requirements.txt')
    production_path = Path('requirements-production.txt')
    
    if requirements_path.exists():
        with open(requirements_path, 'r') as f:
            lines = f.readlines()
        
        production_lines = []
        for line in lines:
            line = line.strip()
            if line and not line.startswith('#'):
                package_name = line.split('==')[0].split('>=')[0].split('<=')[0]
                if package_name not in dev_packages:
                    production_lines.append(line)
        
        with open(production_path, 'w') as f:
            f.write("# Production requirements for PostFlow\n")
            f.write("# Generated automatically - do not edit manually\n\n")
            for line in production_lines:
                f.write(line + '\n')
        
        print(f"  ✅ {production_path} créé avec {len(production_lines)} packages")

def validate_structure():
    """Valider la structure du projet"""
    print("🔍 Validation de la structure du projet...")
    
    required_files = [
        'README.md',
        'requirements.txt',
        'main.py',
        'dashboard.py',
        '.gitignore',
        'CLEAN_REPO.md'
    ]
    
    required_dirs = [
        'src',
        'tests',
        'config',
        'data',
        'docs',
        'scripts',
        'examples'
    ]
    
    all_good = True
    
    for file_path in required_files:
        if not Path(file_path).exists():
            print(f"  ❌ MANQUANT: {file_path}")
            all_good = False
        else:
            print(f"  ✅ {file_path}")
    
    for dir_path in required_dirs:
        if not Path(dir_path).exists():
            print(f"  ❌ MANQUANT: {dir_path}/")
            all_good = False
        else:
            print(f"  ✅ {dir_path}/")
    
    return all_good

def run_tests():
    """Exécuter les tests pour validation"""
    print("🧪 Exécution des tests...")
    
    try:
        result = subprocess.run(['python', '-m', 'pytest', 'tests/', '-v'], 
                              capture_output=True, text=True)
        
        if result.returncode == 0:
            print("  ✅ Tous les tests passent")
            return True
        else:
            print(f"  ❌ Tests échoués:\n{result.stdout}\n{result.stderr}")
            return False
    except Exception as e:
        print(f"  ⚠️  Impossible d'exécuter les tests: {e}")
        return False

def main():
    """Nettoyage complet du repository"""
    print("🎬 " + "=" * 50)
    print("   NETTOYAGE REPOSITORY POSTFLOW")
    print("=" * 52)
    
    # Étape 1: Nettoyage des fichiers temporaires
    clean_python_cache()
    clean_system_files()
    clean_temp_files()
    clean_test_files()
    clean_logs()
    
    # Étape 2: Vérification des fichiers sensibles
    if not check_sensitive_files():
        print("\n⚠️  ATTENTION: Fichiers sensibles détectés!")
        print("   Assurez-vous que .gitignore est configuré correctement")
    
    # Étape 3: Création des requirements de production
    create_production_requirements()
    
    # Étape 4: Validation de la structure
    if not validate_structure():
        print("\n❌ Structure du projet incomplète")
        return False
    
    # Étape 5: Tests (optionnel)
    print("\n🧪 Voulez-vous exécuter les tests? (recommandé)")
    response = input("Taper 'y' pour oui, autre chose pour ignorer: ").strip().lower()
    
    if response == 'y':
        if not run_tests():
            print("\n⚠️  Tests échoués - vérifiez le code avant publication")
    
    # Résumé final
    print("\n" + "=" * 52)
    print("🎉 NETTOYAGE TERMINÉ")
    print("=" * 52)
    print("✅ Fichiers temporaires supprimés")
    print("✅ Structure validée")
    print("✅ Requirements de production créés")
    print("✅ Repository prêt pour publication")
    
    print("\n📋 PROCHAINES ÉTAPES:")
    print("1. Vérifier le statut git: git status")
    print("2. Ajouter les fichiers: git add .")
    print("3. Commit: git commit -m 'Clean repo for publication'")
    print("4. Push: git push")
    print("\n🚀 Repository prêt pour publication publique!")

if __name__ == "__main__":
    main()
