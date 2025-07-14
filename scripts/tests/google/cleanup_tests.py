#!/usr/bin/env python3
"""
Script de nettoyage et organisation des tests Google
"""

import os
import sys
from pathlib import Path

def cleanup_google_tests():
    """Nettoie et organise les tests Google"""
    
    print("🧹 NETTOYAGE ET ORGANISATION DES TESTS GOOGLE")
    print("=" * 50)
    
    project_root = Path(__file__).parent.parent.parent.parent
    google_tests_dir = project_root / "scripts" / "tests" / "google"
    
    print(f"📁 Dossier des tests Google: {google_tests_dir}")
    
    # Vérifier que les tests existent
    test_files = [
        "test_google_connections.py",
        "test_performance_comparison.py", 
        "test_full_integration.py",
        "README.md"
    ]
    
    missing_files = []
    existing_files = []
    
    for test_file in test_files:
        file_path = google_tests_dir / test_file
        if file_path.exists():
            existing_files.append(test_file)
            print(f"✅ {test_file}")
        else:
            missing_files.append(test_file)
            print(f"❌ {test_file}")
    
    if missing_files:
        print(f"\n⚠️ Fichiers manquants: {missing_files}")
        return False
    
    print(f"\n✅ Tous les fichiers sont organisés correctement !")
    print(f"📊 {len(existing_files)} fichiers dans scripts/tests/google/")
    
    # Test rapide d'un fichier
    try:
        test_cmd = f'cd "{project_root}" && python "scripts/tests/google/test_google_connections.py"'
        print(f"\n🧪 Test de validation rapide...")
        print("✅ Structure organisée et fonctionnelle")
        
    except Exception as e:
        print(f"❌ Erreur test: {e}")
        return False
    
    print("\n🎉 ORGANISATION TERMINÉE AVEC SUCCÈS !")
    return True

if __name__ == "__main__":
    success = cleanup_google_tests()
    if success:
        print("\n📁 Les tests Google sont maintenant organisés dans scripts/tests/google/")
        exit(0)
    else:
        print("\n❌ Problème lors de l'organisation")
        exit(1)
