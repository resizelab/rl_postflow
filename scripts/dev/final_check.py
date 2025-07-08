#!/usr/bin/env python3
"""
Check final rapide pour la publication
"""

import os
from pathlib import Path

def final_check():
    """Vérification finale avant publication"""
    
    print("🎯 VÉRIFICATION FINALE POUR PUBLICATION")
    print("=" * 50)
    
    # Vérifier la structure de base
    required_files = [
        "main.py",
        "dashboard.py", 
        "README.md",
        "requirements.txt",
        "pipeline_config.json",
        ".gitignore"
    ]
    
    required_dirs = [
        "src",
        "config", 
        "scripts",
        "tests",
        "docs",
        "data"
    ]
    
    # Vérifier les fichiers obligatoires
    print("📁 Fichiers obligatoires:")
    for file in required_files:
        if os.path.exists(file):
            print(f"  ✅ {file}")
        else:
            print(f"  ❌ {file} MANQUANT")
    
    # Vérifier les répertoires obligatoires
    print("\n📂 Répertoires obligatoires:")
    for dir_name in required_dirs:
        if os.path.exists(dir_name) and os.path.isdir(dir_name):
            print(f"  ✅ {dir_name}/")
        else:
            print(f"  ❌ {dir_name}/ MANQUANT")
    
    # Vérifier qu'il n'y a pas de fichiers de test à la racine
    root_files = [f for f in os.listdir('.') if os.path.isfile(f)]
    test_files_at_root = [f for f in root_files if 'test' in f.lower() or f.startswith('debug_')]
    
    print(f"\n🧪 Fichiers de test à la racine: {len(test_files_at_root)}")
    if test_files_at_root:
        for file in test_files_at_root:
            print(f"  ❌ {file}")
    else:
        print("  ✅ Aucun fichier de test mal placé")
    
    # Compter les fichiers
    total_files = sum(len(files) for _, _, files in os.walk('.'))
    print(f"\n📊 Total des fichiers: {total_files}")
    
    # Statut final
    issues = len(test_files_at_root)
    if issues == 0:
        print(f"\n🎉 PRÊT POUR PUBLICATION !")
        print("✅ Structure propre")
        print("✅ Fichiers bien organisés")
        print("✅ Aucun fichier mal placé")
        return True
    else:
        print(f"\n⚠️  {issues} problèmes à corriger")
        return False

if __name__ == "__main__":
    success = final_check()
    exit(0 if success else 1)
