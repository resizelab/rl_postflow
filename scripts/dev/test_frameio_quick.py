#!/usr/bin/env python3
"""
Script de Test Rapide pour l'Intégration Frame.io
Tests de base pour valider le bon fonctionnement des modules
"""

import sys
import os
from pathlib import Path
import asyncio
import tempfile
import time

# Ajouter le chemin source
sys.path.insert(0, str(Path(__file__).parent.parent))

def test_imports():
    """Test d'importation des modules"""
    print("🔍 Test d'importation des modules...")
    
    try:
        from src.integrations.frameio.parser import FrameIOFileParser
        print("  ✅ Parser importé")
        
        from src.integrations.frameio.structure import FrameIOStructureManager
        print("  ✅ Structure Manager importé")
        
        from src.integrations.frameio.upload import FrameIOUploadManager
        print("  ✅ Upload Manager importé")
        
        from src.integrations.frameio.notifier import FrameIODiscordNotifier
        print("  ✅ Notifier importé")
        
        from src.integrations.frameio.integration import FrameIOIntegrationManager
        print("  ✅ Integration Manager importé")
        
        from src.workflows.lucidlink_frameio_bridge import LucidLinkFrameIOBridge
        print("  ✅ Bridge importé")
        
        return True
    except Exception as e:
        print(f"  ❌ Erreur d'importation: {e}")
        return False

def test_parser():
    """Test du parser"""
    print("\n🔍 Test du parser...")
    
    try:
        from src.integrations.frameio.parser import FrameIOFileParser
        parser = FrameIOFileParser()
        
        # Test fichiers valides
        test_files = [
            "SC01_UNDLM_00412_V002.mov",
            "13H49_-_RECUPERATION_DES_2_SURVIVANTS_S01_V001.mov",
            "SCENE_42_SHOT_001_V003.r3d"
        ]
        
        valid_count = 0
        for filename in test_files:
            metadata = parser.parse_filename(filename)
            if metadata:
                valid_count += 1
                print(f"  ✅ {filename} → {metadata.nomenclature}")
            else:
                print(f"  ❌ {filename} → Parse failed")
        
        # Test fichier invalide
        invalid_file = "fichier_invalide.txt"
        metadata = parser.parse_filename(invalid_file)
        if metadata is None:
            print(f"  ✅ {invalid_file} → None (attendu)")
        else:
            print(f"  ❌ {invalid_file} → Parse inattendu")
        
        print(f"  📊 Résultat: {valid_count}/{len(test_files)} fichiers valides parsés")
        return valid_count == len(test_files)
        
    except Exception as e:
        print(f"  ❌ Erreur du parser: {e}")
        return False

def test_config_files():
    """Test des fichiers de configuration"""
    print("\n📋 Test des fichiers de configuration...")
    
    config_files = [
        "config/frameio_integration.json.example",
        "config/frameio_structure.json",
        "config/frameio_config.json"
    ]
    
    config_ok = True
    for config_file in config_files:
        config_path = Path(config_file)
        if config_path.exists():
            try:
                import json
                with open(config_path, 'r') as f:
                    json.load(f)
                print(f"  ✅ {config_file} → OK")
            except json.JSONDecodeError:
                print(f"  ❌ {config_file} → JSON invalide")
                config_ok = False
        else:
            print(f"  ⚠️  {config_file} → Non trouvé")
    
    return config_ok

async def test_basic_functionality():
    """Test de fonctionnalité de base"""
    print("\n🔧 Test de fonctionnalité de base...")
    
    try:
        # Test du parser uniquement (sans dépendances)
        print("  🔍 Test parser...")
        from src.integrations.frameio.parser import FrameIOFileParser
        parser = FrameIOFileParser()
        
        test_filename = "SC01_UNDLM_00412_V002.mov"
        metadata = parser.parse_filename(test_filename)
        
        if metadata:
            print(f"  ✅ Metadata généré: {metadata.nomenclature}")
            print(f"  📂 Scène: {metadata.scene_name}")
            print(f"  🎬 Shot: {metadata.shot_id}")
            print(f"  📊 Version: {metadata.version}")
            return True
        else:
            print("  ❌ Échec génération metadata")
            return False
                
    except Exception as e:
        print(f"  ❌ Erreur de fonctionnalité: {e}")
        return False

def test_project_structure():
    """Test de la structure du projet"""
    print("\n📁 Test de la structure du projet...")
    
    required_dirs = [
        "src/integrations/frameio",
        "src/workflows",
        "config",
        "scripts",
        "tests",
        "docs",
        "examples"
    ]
    
    required_files = [
        "src/integrations/frameio/parser.py",
        "src/integrations/frameio/structure.py",
        "src/integrations/frameio/upload.py",
        "src/integrations/frameio/notifier.py",
        "src/integrations/frameio/integration.py",
        "src/workflows/lucidlink_frameio_bridge.py",
        "scripts/test_frameio_interactive.py",
        "tests/test_frameio_integration.py",
        "docs/FRAMEIO_TESTING_GUIDE.md"
    ]
    
    structure_ok = True
    
    # Vérifier les dossiers
    for dir_path in required_dirs:
        if Path(dir_path).exists():
            print(f"  ✅ {dir_path}/")
        else:
            print(f"  ❌ {dir_path}/ → Manquant")
            structure_ok = False
    
    # Vérifier les fichiers
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"  ✅ {file_path}")
        else:
            print(f"  ❌ {file_path} → Manquant")
            structure_ok = False
    
    return structure_ok

def print_summary(results):
    """Affiche le résumé des tests"""
    print("\n" + "="*50)
    print("📊 RÉSUMÉ DES TESTS")
    print("="*50)
    
    total_tests = len(results)
    passed_tests = sum(1 for result in results.values() if result)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print("-" * 50)
    print(f"📈 Résultat global: {passed_tests}/{total_tests} tests passés")
    
    if passed_tests == total_tests:
        print("🎉 Tous les tests sont passés! L'intégration Frame.io est prête.")
    else:
        print("⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.")
    
    print("="*50)

def main():
    """Fonction principale"""
    print("🚀 FRAME.IO INTEGRATION - TESTS RAPIDES")
    print("="*50)
    
    results = {}
    
    # Exécuter les tests
    results["Imports"] = test_imports()
    results["Parser"] = test_parser()
    results["Configuration"] = test_config_files()
    results["Structure Projet"] = test_project_structure()
    
    # Tests async
    try:
        results["Fonctionnalité Base"] = asyncio.run(test_basic_functionality())
    except Exception as e:
        print(f"❌ Erreur test async: {e}")
        results["Fonctionnalité Base"] = False
    
    # Afficher le résumé
    print_summary(results)
    
    # Instructions pour la suite
    print("\n📋 ÉTAPES SUIVANTES:")
    print("1. Exécuter le testeur interactif:")
    print("   python scripts/test_frameio_interactive.py")
    print("\n2. Lancer les tests complets:")
    print("   python -m pytest tests/test_frameio_integration.py -v")
    print("\n3. Voir le guide de tests:")
    print("   cat docs/FRAMEIO_TESTING_GUIDE.md")

if __name__ == "__main__":
    main()
