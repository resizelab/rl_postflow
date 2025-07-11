#!/usr/bin/env python3
"""
Script de Test pour l'Import de Sources Étalonnées
Crée des fichiers de test pour valider le fonctionnement de l'importateur
"""

import os
import sys
from pathlib import Path
import tempfile

def create_test_graded_files():
    """Crée quelques fichiers de test pour valider l'importateur."""
    
    test_grading_path = Path("/tmp/test_grading_by_shots")
    test_grading_path.mkdir(exist_ok=True)
    
    # Créer quelques fichiers de test pour SQ01
    test_files = [
        "UNDLM_00001.mov",
        "UNDLM_00003.mov", 
        "UNDLM_00005.mov"
    ]
    
    print(f"🧪 Création de fichiers de test dans {test_grading_path}")
    
    for filename in test_files:
        test_file = test_grading_path / filename
        # Créer un fichier vide de test
        test_file.write_text("# Fichier de test - Plan étalonné")
        print(f"✅ Créé : {filename}")
    
    print(f"\n📁 Fichiers de test créés dans : {test_grading_path}")
    print(f"💡 Pour tester l'importateur avec ces fichiers :")
    print(f"   1. Modifier temporairement le chemin from_grading_path dans import_graded_sources_v2.py")
    print(f"   2. Pointer vers : {test_grading_path}")
    print(f"   3. Lancer : python scripts/import_graded_sources_v2.py --sequence SQ01 --dry-run")
    
    return test_grading_path

if __name__ == "__main__":
    create_test_graded_files()
