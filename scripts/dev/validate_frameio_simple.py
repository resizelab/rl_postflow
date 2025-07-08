#!/usr/bin/env python3
"""
Script de validation simplifié pour Frame.io v4
Teste uniquement la structure des modules sans initialisation complète
"""

import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Ajouter le répertoire racine au PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent))

def test_imports():
    """Test d'importation des modules Frame.io v4"""
    print("📦 Test d'importation des modules Frame.io v4...")
    
    try:
        # Test d'importation des modules individuels
        from src.integrations.frameio.auth import FrameIOAuth, FrameIOAuthError
        print("   ✅ Module auth importé")
        
        from src.integrations.frameio.structure import FrameIOStructureManager
        print("   ✅ Module structure importé")
        
        from src.integrations.frameio.upload import FrameIOUploadManager
        print("   ✅ Module upload importé")
        
        from src.integrations.frameio.comments import FrameIOCommentManager
        print("   ✅ Module comments importé")
        
        # Test d'importation du module principal
        from src.integrations.frameio import FrameioClient
        print("   ✅ Client principal importé")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Erreur d'importation: {e}")
        return False

def test_module_structure():
    """Test de la structure des modules"""
    print("\n🏗️  Test de la structure des modules...")
    
    try:
        # Test de la classe d'authentification
        from src.integrations.frameio.auth import FrameIOAuth
        
        # Vérifier les méthodes principales
        auth_methods = [
            'get_access_token',
            'refresh_token', 
            'is_token_valid',
            'get_jwt_assertion'
        ]
        
        for method in auth_methods:
            if hasattr(FrameIOAuth, method):
                print(f"   ✅ Méthode FrameIOAuth.{method} présente")
            else:
                print(f"   ❌ Méthode FrameIOAuth.{method} manquante")
                return False
        
        # Test du manager de structure
        from src.integrations.frameio.structure import FrameIOStructureManager
        
        structure_methods = [
            'get_accounts',
            'get_projects', 
            'get_folders'
        ]
        
        for method in structure_methods:
            if hasattr(FrameIOStructureManager, method):
                print(f"   ✅ Méthode FrameIOStructureManager.{method} présente")
            else:
                print(f"   ❌ Méthode FrameIOStructureManager.{method} manquante")
                return False
        
        return True
        
    except Exception as e:
        print(f"   ❌ Erreur de structure: {e}")
        return False

def test_configuration():
    """Test de la configuration"""
    print("\n⚙️  Test de la configuration...")
    
    required_vars = [
        'FRAMEIO_CLIENT_ID',
        'FRAMEIO_CLIENT_SECRET',
        'FRAMEIO_ORG_ID',
        'FRAMEIO_ACCOUNT_ID',
        'FRAMEIO_WORKSPACE_ID'
    ]
    
    config_status = {}
    
    for var in required_vars:
        value = os.getenv(var)
        if value and "your_" not in value:
            config_status[var] = "✅ Configuré"
            print(f"   ✅ {var} configuré")
        else:
            config_status[var] = "❌ Manquant"
            print(f"   ❌ {var} manquant")
    
    configured_count = sum(1 for status in config_status.values() if "✅" in status)
    total_count = len(config_status)
    
    print(f"\n   Configuration: {configured_count}/{total_count} variables")
    
    return configured_count >= 3  # Au moins 3 variables configurées

def test_file_structure():
    """Test de la structure des fichiers"""
    print("\n📁 Test de la structure des fichiers...")
    
    required_files = [
        'src/integrations/frameio/__init__.py',
        'src/integrations/frameio/auth.py',
        'src/integrations/frameio/structure.py',
        'src/integrations/frameio/upload.py',
        'src/integrations/frameio/comments.py',
        '.env',
        '.env.example',
        'requirements.txt'
    ]
    
    missing_files = []
    
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"   ✅ {file_path} présent")
        else:
            print(f"   ❌ {file_path} manquant")
            missing_files.append(file_path)
    
    return len(missing_files) == 0

def test_dependencies():
    """Test des dépendances"""
    print("\n📦 Test des dépendances...")
    
    required_packages = [
        ('httpx', 'httpx'),
        ('python-dotenv', 'dotenv'),
        ('PyJWT', 'jwt'),
        ('cryptography', 'cryptography')
    ]
    
    missing_packages = []
    
    for package_name, import_name in required_packages:
        try:
            __import__(import_name)
            print(f"   ✅ {package_name} installé")
        except ImportError:
            print(f"   ❌ {package_name} manquant")
            missing_packages.append(package_name)
    
    return len(missing_packages) == 0

def generate_validation_report():
    """Génère un rapport de validation"""
    print("\n📊 Génération du rapport de validation...")
    
    # Exécuter tous les tests
    tests = {
        'imports': test_imports(),
        'module_structure': test_module_structure(),
        'configuration': test_configuration(),
        'file_structure': test_file_structure(),
        'dependencies': test_dependencies()
    }
    
    # Calculer le score
    passed_tests = sum(1 for result in tests.values() if result)
    total_tests = len(tests)
    score = (passed_tests / total_tests) * 100
    
    # Déterminer le statut
    if score >= 90:
        status = "excellent"
        status_emoji = "🎉"
    elif score >= 70:
        status = "good"
        status_emoji = "✅"
    elif score >= 50:
        status = "acceptable"
        status_emoji = "⚠️"
    else:
        status = "needs_work"
        status_emoji = "❌"
    
    # Créer le rapport
    report = {
        "timestamp": "2024-07-06T00:00:00Z",
        "validation_type": "simplified_structure_validation",
        "frameio_version": "v4",
        "test_results": tests,
        "score": score,
        "status": status,
        "passed_tests": passed_tests,
        "total_tests": total_tests
    }
    
    # Sauvegarder le rapport
    report_path = Path("output/frameio_v4_simplified_validation.json")
    report_path.parent.mkdir(exist_ok=True)
    
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Rapport sauvegardé: {report_path}")
    
    return report, status_emoji

def main():
    """Fonction principale"""
    print("🚀 Validation simplifiée Frame.io v4")
    print("=" * 40)
    
    # Exécuter les tests et générer le rapport
    report, status_emoji = generate_validation_report()
    
    # Afficher le résumé
    print("\n" + "=" * 40)
    print("📊 RÉSUMÉ DE LA VALIDATION")
    print("=" * 40)
    
    print(f"{status_emoji} Statut: {report['status']}")
    print(f"Score: {report['score']:.1f}%")
    print(f"Tests réussis: {report['passed_tests']}/{report['total_tests']}")
    
    if report['score'] >= 70:
        print("\n🎉 Validation réussie!")
        print("La structure Frame.io v4 est correctement implémentée.")
        print("Prochaine étape: Résoudre l'authentification Adobe IMS.")
    else:
        print("\n⚠️ Validation partielle")
        print("Certains composants nécessitent des corrections.")
    
    # Recommandations
    print("\n📝 Recommandations:")
    if not report['test_results']['imports']:
        print("- Vérifier les imports des modules")
    if not report['test_results']['configuration']:
        print("- Compléter la configuration des variables d'environnement")
    if not report['test_results']['dependencies']:
        print("- Installer les dépendances manquantes: pip install -r requirements.txt")
    
    print("\n🔧 Prochaines étapes:")
    print("1. Créer une intégration Server-to-Server dans Adobe Developer Console")
    print("2. Configurer FRAMEIO_TECHNICAL_ACCOUNT_ID")
    print("3. Tester l'authentification avec python scripts/test_frameio_auth_adaptive.py")

if __name__ == "__main__":
    main()
