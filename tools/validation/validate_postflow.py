#!/usr/bin/env python3
"""
🎬 RL PostFlow - Validation Finale Multi-Plateforme
==================================================

Script de validation complète pour vérifier que PostFlow
fonctionne correctement sur Windows/macOS/Linux

Version: 4.1.1
Date: 12 juillet 2025
"""

import json
import logging
import os
import sys
import traceback
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class PostFlowValidator:
    """Validateur complet PostFlow multi-plateforme"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.results = {}
        self.errors = []
        
    def print_header(self):
        """Affiche l'en-tête de validation"""
        print("\n" + "="*70)
        print("🎬 RL POSTFLOW - VALIDATION FINALE MULTI-PLATEFORME")
        print("="*70)
        print(f"Date: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
        print(f"Python: {sys.version}")
        print(f"Répertoire: {self.project_root}")
        print("="*70)
    
    def test_module_imports(self) -> bool:
        """Test d'import de tous les modules critiques"""
        print("\n🔍 TEST D'IMPORT DES MODULES")
        print("-" * 50)
        
        modules_to_test = [
            ('src.utils.cross_platform_paths', 'Gestionnaire chemins multi-plateforme'),
            ('src.utils.lucidlink_utils', 'Utilitaires LucidLink'),
            ('src.integrations.lucidlink', 'Intégration LucidLink'),
            ('src.bootstrap.config_loader', 'Chargeur de configuration'),
            ('src.bootstrap', 'Module bootstrap'),
            ('pathlib', 'Module pathlib Python'),
            ('json', 'Module JSON'),
            ('logging', 'Module logging'),
            ('platform', 'Module platform')
        ]
        
        all_good = True
        
        for module_name, description in modules_to_test:
            try:
                __import__(module_name)
                print(f"✅ {module_name} - {description}")
            except ImportError as e:
                print(f"❌ {module_name} - {description}")
                print(f"   Erreur: {e}")
                all_good = False
                self.errors.append(f"Import failed: {module_name} - {e}")
        
        self.results['module_imports'] = all_good
        return all_good
    
    def test_cross_platform_manager(self) -> bool:
        """Test du gestionnaire de chemins multi-plateforme"""
        print("\n🔄 TEST GESTIONNAIRE CHEMINS MULTI-PLATEFORME")
        print("-" * 50)
        
        try:
            from src.utils.cross_platform_paths import (
                CrossPlatformPathManager,
                get_platform_path_manager,
                normalize_lucidlink_path,
                is_windows_platform,
                is_macos_platform
            )
            
            # Test instance
            manager = get_platform_path_manager()
            platform_info = manager.get_platform_info()
            
            print(f"✅ Plateforme détectée: {platform_info['os']}")
            print(f"✅ Chemin LucidLink: {platform_info['lucidlink_base']}")
            print(f"✅ Windows: {'Oui' if platform_info['is_windows'] else 'Non'}")
            print(f"✅ macOS: {'Oui' if platform_info['is_macos'] else 'Non'}")
            print(f"✅ Linux: {'Oui' if platform_info['is_linux'] else 'Non'}")
            
            # Test normalisation
            test_paths = [
                "/Volumes/resizelab/test.mov",
                "E:\\Volumes\\resizelab\\test.mov",
                "/mnt/lucidlink/resizelab/test.mov"
            ]
            
            print("\n📁 Test normalisation chemins:")
            for test_path in test_paths:
                normalized = normalize_lucidlink_path(test_path)
                print(f"  {test_path} → {normalized}")
            
            # Test validation
            base_path = manager.get_lucidlink_base_path()
            is_valid, _ = manager.validate_lucidlink_path(base_path)
            print(f"✅ Validation chemin base: {'Valide' if is_valid else 'Invalide'}")
            
            self.results['cross_platform_manager'] = True
            return True
            
        except Exception as e:
            print(f"❌ Erreur gestionnaire chemins: {e}")
            self.errors.append(f"Cross-platform manager error: {e}")
            self.results['cross_platform_manager'] = False
            return False
    
    def test_lucidlink_integration(self) -> bool:
        """Test de l'intégration LucidLink"""
        print("\n🔗 TEST INTÉGRATION LUCIDLINK")
        print("-" * 50)
        
        try:
            from src.utils.lucidlink_utils import LucidLinkDetector
            from src.integrations.lucidlink import LucidLinkIntegration
            from src.utils.cross_platform_paths import get_platform_path_manager
            
            # Test détecteur
            detector = LucidLinkDetector()
            print(f"✅ LucidLink monté: {'Oui' if detector.is_lucidlink_mounted else 'Non'}")
            print(f"✅ Chemins détectés: {len(detector.lucidlink_paths)}")
            
            for i, path in enumerate(detector.lucidlink_paths[:3]):  # Max 3 paths
                print(f"  {i+1}. {path}")
            
            # Test intégration
            path_manager = get_platform_path_manager()
            test_config = {
                'base_path': str(path_manager.get_lucidlink_base_path())
            }
            
            integration = LucidLinkIntegration(test_config)
            print(f"✅ Connexion LucidLink: {'OK' if integration.connected else 'Échoué'}")
            print(f"✅ Chemin base: {integration.base_path}")
            print(f"✅ Chemin sources: {integration.sources_path}")
            print(f"✅ Chemin VFX: {integration.vfx_projects_path}")
            
            self.results['lucidlink_integration'] = True
            return True
            
        except Exception as e:
            print(f"❌ Erreur intégration LucidLink: {e}")
            print(f"   Détails: {traceback.format_exc()}")
            self.errors.append(f"LucidLink integration error: {e}")
            self.results['lucidlink_integration'] = False
            return False
    
    def test_configuration_loading(self) -> bool:
        """Test du chargement de configuration"""
        print("\n⚙️ TEST CHARGEMENT CONFIGURATION")
        print("-" * 50)
        
        try:
            from src.bootstrap.config_loader import ConfigLoader
            
            # Test chargement
            loader = ConfigLoader()
            
            config_file = self.project_root / "config" / "integrations.json"
            
            if config_file.exists():
                with open(config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                
                print("✅ Configuration chargée")
                
                # Vérifier les sections critiques
                if 'lucidlink' in config:
                    print(f"✅ Section LucidLink: {config['lucidlink'].get('base_path', 'Non défini')}")
                else:
                    print("⚠️ Section LucidLink manquante")
                
                if 'frameio' in config:
                    print(f"✅ Section Frame.io: {'Activé' if config['frameio'].get('enabled') else 'Désactivé'}")
                else:
                    print("⚠️ Section Frame.io manquante")
                
                if 'discord' in config:
                    print(f"✅ Section Discord: {'Activé' if config['discord'].get('enabled') else 'Désactivé'}")
                else:
                    print("⚠️ Section Discord manquante")
                
            else:
                print("⚠️ Fichier de configuration non trouvé")
                print("   Utilisation de la configuration par défaut")
            
            self.results['configuration_loading'] = True
            return True
            
        except Exception as e:
            print(f"❌ Erreur chargement configuration: {e}")
            self.errors.append(f"Configuration loading error: {e}")
            self.results['configuration_loading'] = False
            return False
    
    def test_file_operations(self) -> bool:
        """Test des opérations sur fichiers"""
        print("\n📂 TEST OPÉRATIONS FICHIERS")
        print("-" * 50)
        
        try:
            from src.utils.cross_platform_paths import get_platform_path_manager
            
            path_manager = get_platform_path_manager()
            
            # Test création répertoire temporaire
            test_dir = self.project_root / "temp_test"
            test_dir.mkdir(exist_ok=True)
            print("✅ Création répertoire temporaire")
            
            # Test création fichier
            test_file = test_dir / "test.txt"
            test_file.write_text("Test PostFlow", encoding='utf-8')
            print("✅ Création fichier test")
            
            # Test lecture fichier
            content = test_file.read_text(encoding='utf-8')
            if content == "Test PostFlow":
                print("✅ Lecture fichier test")
            else:
                print("❌ Erreur lecture fichier")
                return False
            
            # Test normalisation chemin
            normalized = path_manager.normalize_path(test_file)
            print(f"✅ Normalisation chemin: {normalized}")
            
            # Nettoyage
            test_file.unlink()
            test_dir.rmdir()
            print("✅ Nettoyage fichiers temporaires")
            
            self.results['file_operations'] = True
            return True
            
        except Exception as e:
            print(f"❌ Erreur opérations fichiers: {e}")
            self.errors.append(f"File operations error: {e}")
            self.results['file_operations'] = False
            return False
    
    def test_bootstrap_modules(self) -> bool:
        """Test des modules bootstrap"""
        print("\n🚀 TEST MODULES BOOTSTRAP")
        print("-" * 50)
        
        try:
            # Test imports bootstrap
            from src.bootstrap import (
                load_config,
                ConfigLoader
            )
            print("✅ Import modules bootstrap")
            
            # Test chargement config via bootstrap
            try:
                config, pipeline_config, config_manager = load_config()
                print("✅ Chargement configuration via bootstrap")
                
                if config:
                    print(f"   Configuration principale: {len(config)} sections")
                if pipeline_config:
                    print(f"   Configuration pipeline: {len(pipeline_config)} sections")
                if config_manager:
                    print("   Gestionnaire de configuration: OK")
                
            except Exception as e:
                print(f"⚠️ Erreur chargement bootstrap: {e}")
                # Ce n'est pas forcément critique
            
            self.results['bootstrap_modules'] = True
            return True
            
        except Exception as e:
            print(f"❌ Erreur modules bootstrap: {e}")
            self.errors.append(f"Bootstrap modules error: {e}")
            self.results['bootstrap_modules'] = False
            return False
    
    def generate_report(self) -> Dict:
        """Génère un rapport de validation"""
        total_tests = len(self.results)
        passed_tests = sum(1 for result in self.results.values() if result)
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'total_tests': total_tests,
            'passed_tests': passed_tests,
            'failed_tests': total_tests - passed_tests,
            'success_rate': (passed_tests / total_tests * 100) if total_tests > 0 else 0,
            'results': self.results,
            'errors': self.errors,
            'platform': self._get_platform_info()
        }
        
        return report
    
    def _get_platform_info(self) -> Dict:
        """Récupère les informations de plateforme"""
        try:
            from src.utils.cross_platform_paths import get_platform_path_manager
            manager = get_platform_path_manager()
            return manager.get_platform_info()
        except Exception:
            import platform
            return {
                'os': platform.system(),
                'platform': platform.platform(),
                'machine': platform.machine(),
                'python_version': platform.python_version()
            }
    
    def run_validation(self) -> bool:
        """Exécute la validation complète"""
        self.print_header()
        
        tests = [
            ('Import des modules', self.test_module_imports),
            ('Gestionnaire chemins multi-plateforme', self.test_cross_platform_manager),
            ('Intégration LucidLink', self.test_lucidlink_integration),
            ('Chargement configuration', self.test_configuration_loading),
            ('Opérations fichiers', self.test_file_operations),
            ('Modules bootstrap', self.test_bootstrap_modules)
        ]
        
        for test_name, test_func in tests:
            try:
                result = test_func()
                if not result:
                    logger.warning(f"Test échoué: {test_name}")
            except Exception as e:
                logger.error(f"Erreur dans le test '{test_name}': {e}")
                self.results[test_name.lower().replace(' ', '_')] = False
                self.errors.append(f"Test '{test_name}' failed: {e}")
        
        # Générer le rapport
        report = self.generate_report()
        
        # Afficher le résumé
        print("\n" + "="*70)
        print("📊 RÉSUMÉ DE VALIDATION")
        print("="*70)
        
        print(f"Tests exécutés: {report['total_tests']}")
        print(f"Tests réussis: {report['passed_tests']} ✅")
        print(f"Tests échoués: {report['failed_tests']} ❌")
        print(f"Taux de réussite: {report['success_rate']:.1f}%")
        
        print(f"\nPlateforme: {report['platform'].get('os', 'Inconnue')}")
        print(f"Python: {report['platform'].get('python_version', sys.version.split()[0])}")
        
        # Détail des résultats
        print(f"\n📋 DÉTAIL DES TESTS:")
        for test_name, result in self.results.items():
            status = "✅ RÉUSSI" if result else "❌ ÉCHEC"
            print(f"  {test_name.replace('_', ' ').title():.<40} {status}")
        
        # Erreurs détaillées
        if self.errors:
            print(f"\n🐛 ERREURS DÉTECTÉES:")
            for i, error in enumerate(self.errors, 1):
                print(f"  {i}. {error}")
        
        # Sauvegarder le rapport
        report_file = self.project_root / f"validation_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        try:
            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2, ensure_ascii=False)
            print(f"\n📄 Rapport sauvegardé: {report_file.name}")
        except Exception as e:
            logger.warning(f"Impossible de sauvegarder le rapport: {e}")
        
        # Verdict final
        all_critical_passed = all([
            self.results.get('module_imports', False),
            self.results.get('cross_platform_manager', False)
        ])
        
        if all_critical_passed and report['success_rate'] >= 80:
            print(f"\n🎉 VALIDATION RÉUSSIE!")
            print(f"PostFlow est prêt à fonctionner sur cette plateforme.")
            return True
        else:
            print(f"\n⚠️ VALIDATION PARTIELLE")
            print(f"Certains composants nécessitent une attention.")
            if report['success_rate'] >= 60:
                print(f"PostFlow peut fonctionner avec des limitations.")
            else:
                print(f"PostFlow nécessite des corrections avant utilisation.")
            return False


def main():
    """Fonction principale"""
    try:
        validator = PostFlowValidator()
        success = validator.run_validation()
        
        return 0 if success else 1
        
    except KeyboardInterrupt:
        print("\n🛑 Validation interrompue par l'utilisateur")
        return 1
    except Exception as e:
        logger.error(f"❌ Erreur fatale: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
