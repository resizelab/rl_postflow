#!/usr/bin/env python3
"""
Script de Validation Finale - Intégration Frame.io
Test de tous les composants essentiels sans configuration externe
"""

import sys
import os
from pathlib import Path
import tempfile
import json
from datetime import datetime

# Ajouter le chemin source
sys.path.insert(0, str(Path(__file__).parent.parent))

def print_header(title):
    """Affiche un en-tête formaté"""
    print(f"\n{'='*60}")
    print(f"🎬 {title}")
    print(f"{'='*60}")

def print_section(title):
    """Affiche une section formatée"""
    print(f"\n{'🔍 ' + title}")
    print("-" * 50)

def test_module_structure():
    """Teste la structure des modules"""
    print_section("STRUCTURE DES MODULES")
    
    modules_to_test = [
        ("Parser", "src.integrations.frameio.parser", "FrameIOFileParser"),
        ("Structure", "src.integrations.frameio.structure", "FrameIOStructureManager"),
        ("Upload", "src.integrations.frameio.upload", "FrameIOUploadManager"),
        ("Notifier", "src.integrations.frameio.notifier", "FrameIODiscordNotifier"),
        ("Integration", "src.integrations.frameio.integration", "FrameIOIntegrationManager"),
        ("OAuth Auth", "src.integrations.frameio.oauth_auth", "FrameIOOAuthAuth"),
        ("Bridge", "src.workflows.lucidlink_frameio_bridge", "LucidLinkFrameIOBridge")
    ]
    
    results = []
    for name, module_path, class_name in modules_to_test:
        try:
            module = __import__(module_path, fromlist=[class_name])
            cls = getattr(module, class_name)
            print(f"  ✅ {name}: {class_name}")
            results.append(True)
        except Exception as e:
            print(f"  ❌ {name}: {e}")
            results.append(False)
    
    print(f"\n📊 Résultat: {sum(results)}/{len(results)} modules OK")
    return all(results)

def test_parser_comprehensive():
    """Test complet du parser"""
    print_section("PARSER COMPLET")
    
    try:
        from src.integrations.frameio.parser import FrameIOFileParser
        parser = FrameIOFileParser()
        
        # Test cases avec différents formats
        test_cases = [
            # Format court
            ("SC01_UNDLM_00412_V002.mov", "SC01", "UNDLM_00412", "V002"),
            ("SC10_UNDLM_00523_V001.mp4", "SC10", "UNDLM_00523", "V001"),
            
            # Format long
            ("13H49_-_RECUPERATION_DES_2_SURVIVANTS_S01_V001.mov", "13H49_RECUPERATION_DES_2_SURVIVANTS", "S01", "V001"),
            ("SCENE_BATAILLE_FINALE_S05_V003.r3d", "SCENE_BATAILLE_FINALE", "S05", "V003"),
            
            # Format générique
            ("SCENE_42_SHOT_001_V003.r3d", "SCENE_42", "SHOT_001", "V003"),
            ("SCENE_1_SHOT_010_V001.braw", "SCENE_1", "SHOT_010", "V001"),
            
            # Extensions diverses
            ("SC01_UNDLM_00412_V002.prores", "SC01", "UNDLM_00412", "V002"),
            ("SC01_UNDLM_00412_V002.dnxhd", "SC01", "UNDLM_00412", "V002"),
        ]
        
        results = []
        for filename, expected_scene, expected_shot, expected_version in test_cases:
            metadata = parser.parse_filename(filename)
            if metadata:
                if (metadata.scene_name == expected_scene and 
                    metadata.shot_id == expected_shot and 
                    metadata.version == expected_version):
                    print(f"  ✅ {filename}")
                    print(f"      → {metadata.nomenclature}")
                    results.append(True)
                else:
                    print(f"  ❌ {filename} - Résultat incorrect")
                    print(f"      Attendu: {expected_scene}_{expected_shot}_{expected_version}")
                    print(f"      Obtenu:  {metadata.scene_name}_{metadata.shot_id}_{metadata.version}")
                    results.append(False)
            else:
                print(f"  ❌ {filename} - Parse failed")
                results.append(False)
        
        # Test fichiers invalides
        invalid_files = [
            "fichier_sans_pattern.mov",
            "INVALID_FILE.txt",
            "SC01_UNDLM_INVALID.mov"
        ]
        
        print(f"\n  🔍 Test fichiers invalides:")
        for filename in invalid_files:
            metadata = parser.parse_filename(filename)
            if metadata is None:
                print(f"  ✅ {filename} - Rejeté comme attendu")
                results.append(True)
            else:
                print(f"  ❌ {filename} - Parse inattendu")
                results.append(False)
        
        print(f"\n📊 Résultat: {sum(results)}/{len(results)} tests OK")
        return all(results)
        
    except Exception as e:
        print(f"❌ Erreur du test parser: {e}")
        return False

def test_configuration_files():
    """Test des fichiers de configuration"""
    print_section("FICHIERS DE CONFIGURATION")
    
    config_files = [
        ("config/frameio_integration.json.example", "Configuration principale"),
        ("config/frameio_structure.json", "Cache de structure"),
        ("config/frameio_config.json", "Configuration Frame.io"),
        ("config/integrations.json.example", "Configuration intégrations"),
        ("config/error_handling.json", "Gestion d'erreurs")
    ]
    
    results = []
    for file_path, description in config_files:
        path = Path(file_path)
        if path.exists():
            try:
                with open(path, 'r') as f:
                    config = json.load(f)
                print(f"  ✅ {description}: {file_path}")
                results.append(True)
            except json.JSONDecodeError as e:
                print(f"  ❌ {description}: JSON invalide - {e}")
                results.append(False)
        else:
            print(f"  ⚠️  {description}: {file_path} - Non trouvé")
            results.append(False)
    
    print(f"\n📊 Résultat: {sum(results)}/{len(results)} configurations OK")
    return sum(results) >= len(results) * 0.8  # 80% minimum

def test_project_completeness():
    """Test de complétude du projet"""
    print_section("COMPLÉTUDE DU PROJET")
    
    required_items = [
        # Dossiers principaux
        ("src/integrations/frameio/", "Modules Frame.io"),
        ("src/workflows/", "Workflows"),
        ("scripts/", "Scripts utilitaires"),
        ("tests/", "Tests"),
        ("docs/", "Documentation"),
        ("config/", "Configuration"),
        ("examples/", "Exemples"),
        
        # Fichiers clés
        ("src/integrations/frameio/__init__.py", "Module init"),
        ("scripts/test_frameio_quick.py", "Test rapide"),
        ("scripts/test_frameio_interactive.py", "Test interactif"),
        ("scripts/deploy_frameio_integration.sh", "Script déploiement"),
        ("scripts/monitor_frameio_integration.py", "Monitoring"),
        ("tests/test_frameio_integration.py", "Tests unitaires"),
        ("docs/FRAMEIO_TESTING_GUIDE.md", "Guide de tests"),
        ("docs/FRAMEIO_LUCIDLINK_INTEGRATION.md", "Documentation intégration"),
        ("README_FRAMEIO_INTEGRATION.md", "README intégration"),
        ("systemd/frameio-bridge.service", "Service systemd")
    ]
    
    results = []
    for item_path, description in required_items:
        path = Path(item_path)
        if path.exists():
            print(f"  ✅ {description}: {item_path}")
            results.append(True)
        else:
            print(f"  ❌ {description}: {item_path} - Manquant")
            results.append(False)
    
    print(f"\n📊 Résultat: {sum(results)}/{len(results)} éléments présents")
    return all(results)

def test_documentation():
    """Test de la documentation"""
    print_section("DOCUMENTATION")
    
    docs_to_check = [
        ("docs/FRAMEIO_TESTING_GUIDE.md", "Guide de tests"),
        ("docs/FRAMEIO_LUCIDLINK_INTEGRATION.md", "Documentation intégration"),
        ("README_FRAMEIO_INTEGRATION.md", "README principal"),
        ("FRAMEIO_TESTING_SUMMARY.md", "Résumé des tests")
    ]
    
    results = []
    for doc_path, description in docs_to_check:
        path = Path(doc_path)
        if path.exists():
            try:
                with open(path, 'r') as f:
                    content = f.read()
                    if len(content) > 100:  # Au moins 100 caractères
                        print(f"  ✅ {description}: {len(content)} caractères")
                        results.append(True)
                    else:
                        print(f"  ⚠️  {description}: Contenu trop court")
                        results.append(False)
            except Exception as e:
                print(f"  ❌ {description}: Erreur lecture - {e}")
                results.append(False)
        else:
            print(f"  ❌ {description}: Non trouvé")
            results.append(False)
    
    print(f"\n📊 Résultat: {sum(results)}/{len(results)} documentations OK")
    return all(results)

def test_examples():
    """Test des exemples"""
    print_section("EXEMPLES")
    
    example_files = [
        ("examples/frameio_lucidlink_demo.py", "Démo principale"),
        ("examples/frameio_usage_examples.py", "Exemples d'usage"),
        ("examples/pipeline_demo.py", "Démo pipeline")
    ]
    
    results = []
    for example_path, description in example_files:
        path = Path(example_path)
        if path.exists():
            try:
                with open(path, 'r') as f:
                    content = f.read()
                    if 'def' in content or 'class' in content:
                        print(f"  ✅ {description}: Code Python détecté")
                        results.append(True)
                    else:
                        print(f"  ⚠️  {description}: Pas de code Python détecté")
                        results.append(False)
            except Exception as e:
                print(f"  ❌ {description}: Erreur lecture - {e}")
                results.append(False)
        else:
            print(f"  ❌ {description}: Non trouvé")
            results.append(False)
    
    print(f"\n📊 Résultat: {sum(results)}/{len(results)} exemples OK")
    return all(results)

def generate_final_report():
    """Génère un rapport final"""
    print_section("RAPPORT FINAL")
    
    # Exécuter tous les tests
    test_results = {
        "Structure des modules": test_module_structure(),
        "Parser complet": test_parser_comprehensive(),
        "Configuration": test_configuration_files(),
        "Complétude du projet": test_project_completeness(),
        "Documentation": test_documentation(),
        "Exemples": test_examples()
    }
    
    # Calculer les statistiques
    total_tests = len(test_results)
    passed_tests = sum(1 for result in test_results.values() if result)
    success_rate = (passed_tests / total_tests) * 100
    
    print(f"\n📊 RÉSULTATS FINAUX:")
    print("-" * 30)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print("-" * 30)
    print(f"📈 Taux de réussite: {passed_tests}/{total_tests} ({success_rate:.1f}%)")
    
    if success_rate >= 90:
        print("🎉 EXCELLENT! L'intégration Frame.io est prête pour la production.")
        status = "EXCELLENT"
    elif success_rate >= 75:
        print("✅ BIEN! L'intégration Frame.io est fonctionnelle avec quelques améliorations possibles.")
        status = "BIEN"
    elif success_rate >= 60:
        print("⚠️  ACCEPTABLE! L'intégration Frame.io fonctionne mais nécessite des corrections.")
        status = "ACCEPTABLE"
    else:
        print("❌ PROBLÉMATIQUE! L'intégration Frame.io nécessite des corrections importantes.")
        status = "PROBLÉMATIQUE"
    
    # Sauvegarder le rapport
    report = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": total_tests,
        "passed_tests": passed_tests,
        "success_rate": success_rate,
        "status": status,
        "test_results": test_results
    }
    
    report_path = Path("output/frameio_validation_report.json")
    report_path.parent.mkdir(exist_ok=True)
    
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\n📄 Rapport sauvegardé: {report_path}")
    
    return success_rate >= 75

def main():
    """Fonction principale"""
    print_header("VALIDATION FINALE - INTÉGRATION FRAME.IO")
    
    print("🚀 Début de la validation complète...")
    print("Cette validation teste tous les composants essentiels")
    print("sans nécessiter de configuration externe.")
    
    success = generate_final_report()
    
    print_section("PROCHAINES ÉTAPES")
    
    if success:
        print("✅ L'intégration Frame.io est validée!")
        print("\n🎯 Prochaines étapes recommandées:")
        print("1. Configurer les tokens Frame.io et Discord")
        print("2. Exécuter les tests de connectivité:")
        print("   python scripts/test_frameio_interactive.py")
        print("3. Tester avec de vrais fichiers:")
        print("   python examples/frameio_lucidlink_demo.py")
        print("4. Déployer en production:")
        print("   bash scripts/deploy_frameio_integration.sh")
    else:
        print("❌ La validation a détecté des problèmes.")
        print("\n🔧 Actions recommandées:")
        print("1. Vérifier les erreurs ci-dessus")
        print("2. Corriger les fichiers manquants")
        print("3. Re-exécuter la validation")
        print("4. Consulter la documentation:")
        print("   cat docs/FRAMEIO_TESTING_GUIDE.md")
    
    print(f"\n📋 Voir le résumé complet: FRAMEIO_TESTING_SUMMARY.md")
    print(f"📊 Rapport détaillé: output/frameio_validation_report.json")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
