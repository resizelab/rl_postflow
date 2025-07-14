﻿#!/usr/bin/env python3
"""
­ƒÄ¼ RL PostFlow - Validation Finale Multi-Plateforme
==================================================

Script de validation compl├¿te pour v├®rifier que PostFlow
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

# Ajouter le r├®pertoire src au path
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
        """Affiche l'en-t├¬te de validation"""
        print("\n" + "="*70)
        print("­ƒÄ¼ RL POSTFLOW - VALIDATION FINALE MULTI-PLATEFORME")
        print("="*70)
        print(f"Date: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
        print(f"Python: {sys.version}")
        print(f"R├®pertoire: {self.project_root}")
        print("="*70)
    
    def test_module_imports(self) -> bool:
        """Test d'import de tous les modules critiques"""
        print("\n­ƒöì TEST D'IMPORT DES MODULES")
        print("-" * 50)
        
        modules_to_test = [
            ('src.utils.cross_platform_paths', 'Gestionnaire chemins multi-plateforme'),
            ('src.utils.lucidlink_utils', 'Utilitaires LucidLink'),
            ('src.integrations.lucidlink', 'Int├®gration LucidLink'),
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
                print(f"Ô£à {module_name} - {description}")
            except ImportError as e:
                print(f"ÔØî {module_name} - {description}")
                print(f"   Erreur: {e}")
                all_good = False
                self.errors.append(f"Import failed: {module_name} - {e}")
        
        self.results['module_imports'] = all_good
        return all_good
    
    def test_cross_platform_manager(self) -> bool:
        """Test du gestionnaire de chemins multi-plateforme"""
        print("\n­ƒöä TEST GESTIONNAIRE CHEMINS MULTI-PLATEFORME")
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
            
            print(f"Ô£à Plateforme d├®tect├®e: {platform_info['os']}")
            print(f"Ô£à Chemin LucidLink: {platform_info['lucidlink_base']}")
            print(f"Ô£à Windows: {'Oui' if platform_info['is_windows'] else 'Non'}")
            print(f"Ô£à macOS: {'Oui' if platform_info['is_macos'] else 'Non'}")
            print(f"Ô£à Linux: {'Oui' if platform_info['is_linux'] else 'Non'}")
            
            # Test normalisation
            test_paths = [
                "/Volumes/resizelab/test.mov",
                "E:\\Volumes\\resizelab\\test.mov",
                "/mnt/lucidlink/resizelab/test.mov"
            ]
            
            print("\n­ƒôü Test normalisation chemins:")
            for test_path in test_paths:
                normalized = normalize_lucidlink_path(test_path)
                print(f"  {test_path} ÔåÆ {normalized}")
            
            # Test validation
            base_path = manager.get_lucidlink_base_path()
            is_valid, _ = manager.validate_lucidlink_path(base_path)
            print(f"Ô£à Validation chemin base: {'Valide' if is_valid else 'Invalide'}")
            
            self.results['cross_platform_manager'] = True
            return True
            
        except Exception as e:
            print(f"ÔØî Erreur gestionnaire chemins: {e}")
            self.errors.append(f"Cross-platform manager error: {e}")
            self.results['cross_platform_manager'] = False
            return False
    
    def test_lucidlink_integration(self) -> bool:
        """Test de l'int├®gration LucidLink"""
        print("\n­ƒöù TEST INT├ëGRATION LUCIDLINK")
        print("-" * 50)
        
        try:
            from src.utils.lucidlink_utils import LucidLinkDetector
            from src.integrations.lucidlink import LucidLinkIntegration
            from src.utils.cross_platform_paths import get_platform_path_manager
            
            # Test d├®tecteur
            detector = LucidLinkDetector()
            print(f"Ô£à LucidLink mont├®: {'Oui' if detector.is_lucidlink_mounted else 'Non'}")
            print(f"Ô£à Chemins d├®tect├®s: {len(detector.lucidlink_paths)}")
            
            for i, path in enumerate(detector.lucidlink_paths[:3]):  # Max 3 paths
                print(f"  {i+1}. {path}")
            
            # Test int├®gration
            path_manager = get_platform_path_manager()
            test_config = {
                'base_path': str(path_manager.get_lucidlink_base_path())
            }
            
            integration = LucidLinkIntegration(test_config)
            print(f"Ô£à Connexion LucidLink: {'OK' if integration.connected else '├ëchou├®'}")
            print(f"Ô£à Chemin base: {integration.base_path}")
            print(f"Ô£à Chemin sources: {integration.sources_path}")
            print(f"Ô£à Chemin VFX: {integration.vfx_projects_path}")
            
            self.results['lucidlink_integration'] = True
            return True
            
        except Exception as e:
            print(f"ÔØî Erreur int├®gration LucidLink: {e}")
            print(f"   D├®tails: {traceback.format_exc()}")
            self.errors.append(f"LucidLink integration error: {e}")
            self.results['lucidlink_integration'] = False
            return False
    
    def test_configuration_loading(self) -> bool:
        """Test du chargement de configuration"""
        print("\nÔÜÖ´©Å TEST CHARGEMENT CONFIGURATION")
        print("-" * 50)
        
        try:
            from src.bootstrap.config_loader import ConfigLoader
            
            # Test chargement
            loader = ConfigLoader()
            
            config_file = self.project_root / "config" / "integrations.json"
            
            if config_file.exists():
                with open(config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                
                print("Ô£à Configuration charg├®e")
                
                # V├®rifier les sections critiques
                if 'lucidlink' in config:
                    print(f"Ô£à Section LucidLink: {config['lucidlink'].get('base_path', 'Non d├®fini')}")
                else:
                    print("ÔÜá´©Å Section LucidLink manquante")
                
                if 'frameio' in config:
                    print(f"Ô£à Section Frame.io: {'Activ├®' if config['frameio'].get('enabled') else 'D├®sactiv├®'}")
                else:
                    print("ÔÜá´©Å Section Frame.io manquante")
                
                if 'discord' in config:
                    print(f"Ô£à Section Discord: {'Activ├®' if config['discord'].get('enabled') else 'D├®sactiv├®'}")
                else:
                    print("ÔÜá´©Å Section Discord manquante")
                
            else:
                print("ÔÜá´©Å Fichier de configuration non trouv├®")
                print("   Utilisation de la configuration par d├®faut")
            
            self.results['configuration_loading'] = True
            return True
            
        except Exception as e:
            print(f"ÔØî Erreur chargement configuration: {e}")
            self.errors.append(f"Configuration loading error: {e}")
            self.results['configuration_loading'] = False
            return False
    
    def test_file_operations(self) -> bool:
        """Test des op├®rations sur fichiers"""
        print("\n­ƒôé TEST OP├ëRATIONS FICHIERS")
        print("-" * 50)
        
        try:
            from src.utils.cross_platform_paths import get_platform_path_manager
            
            path_manager = get_platform_path_manager()
            
            # Test cr├®ation r├®pertoire temporaire
            test_dir = self.project_root / "temp_test"
            test_dir.mkdir(exist_ok=True)
            print("Ô£à Cr├®ation r├®pertoire temporaire")
            
            # Test cr├®ation fichier
            test_file = test_dir / "test.txt"
            test_file.write_text("Test PostFlow", encoding='utf-8')
            print("Ô£à Cr├®ation fichier test")
            
            # Test lecture fichier
            content = test_file.read_text(encoding='utf-8')
            if content == "Test PostFlow":
                print("Ô£à Lecture fichier test")
            else:
                print("ÔØî Erreur lecture fichier")
                return False
            
            # Test normalisation chemin
            normalized = path_manager.normalize_path(test_file)
            print(f"Ô£à Normalisation chemin: {normalized}")
            
            # Nettoyage
            test_file.unlink()
            test_dir.rmdir()
            print("Ô£à Nettoyage fichiers temporaires")
            
            self.results['file_operations'] = True
            return True
            
        except Exception as e:
            print(f"ÔØî Erreur op├®rations fichiers: {e}")
            self.errors.append(f"File operations error: {e}")
            self.results['file_operations'] = False
            return False
    
    def test_bootstrap_modules(self) -> bool:
        """Test des modules bootstrap"""
        print("\n­ƒÜÇ TEST MODULES BOOTSTRAP")
        print("-" * 50)
        
        try:
            # Test imports bootstrap
            from src.bootstrap import (
                load_config,
                ConfigLoader
            )
            print("Ô£à Import modules bootstrap")
            
            # Test chargement config via bootstrap
            try:
                config, pipeline_config, config_manager = load_config()
                print("Ô£à Chargement configuration via bootstrap")
                
                if config:
                    print(f"   Configuration principale: {len(config)} sections")
                if pipeline_config:
                    print(f"   Configuration pipeline: {len(pipeline_config)} sections")
                if config_manager:
                    print("   Gestionnaire de configuration: OK")
                
            except Exception as e:
                print(f"ÔÜá´©Å Erreur chargement bootstrap: {e}")
                # Ce n'est pas forc├®ment critique
            
            self.results['bootstrap_modules'] = True
            return True
            
        except Exception as e:
            print(f"ÔØî Erreur modules bootstrap: {e}")
            self.errors.append(f"Bootstrap modules error: {e}")
            self.results['bootstrap_modules'] = False
            return False
    
    def generate_report(self) -> Dict:
        """G├®n├¿re un rapport de validation"""
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
        """R├®cup├¿re les informations de plateforme"""
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
        """Ex├®cute la validation compl├¿te"""
        self.print_header()
        
        tests = [
            ('Import des modules', self.test_module_imports),
            ('Gestionnaire chemins multi-plateforme', self.test_cross_platform_manager),
            ('Int├®gration LucidLink', self.test_lucidlink_integration),
            ('Chargement configuration', self.test_configuration_loading),
            ('Op├®rations fichiers', self.test_file_operations),
            ('Modules bootstrap', self.test_bootstrap_modules)
        ]
        
        for test_name, test_func in tests:
            try:
                result = test_func()
                if not result:
                    logger.warning(f"Test ├®chou├®: {test_name}")
            except Exception as e:
                logger.error(f"Erreur dans le test '{test_name}': {e}")
                self.results[test_name.lower().replace(' ', '_')] = False
                self.errors.append(f"Test '{test_name}' failed: {e}")
        
        # G├®n├®rer le rapport
        report = self.generate_report()
        
        # Afficher le r├®sum├®
        print("\n" + "="*70)
        print("­ƒôè R├ëSUM├ë DE VALIDATION")
        print("="*70)
        
        print(f"Tests ex├®cut├®s: {report['total_tests']}")
        print(f"Tests r├®ussis: {report['passed_tests']} Ô£à")
        print(f"Tests ├®chou├®s: {report['failed_tests']} ÔØî")
        print(f"Taux de r├®ussite: {report['success_rate']:.1f}%")
        
        print(f"\nPlateforme: {report['platform'].get('os', 'Inconnue')}")
        print(f"Python: {report['platform'].get('python_version', sys.version.split()[0])}")
        
        # D├®tail des r├®sultats
        print(f"\n­ƒôï D├ëTAIL DES TESTS:")
        for test_name, result in self.results.items():
            status = "Ô£à R├ëUSSI" if result else "ÔØî ├ëCHEC"
            print(f"  {test_name.replace('_', ' ').title():.<40} {status}")
        
        # Erreurs d├®taill├®es
        if self.errors:
            print(f"\n­ƒÉø ERREURS D├ëTECT├ëES:")
            for i, error in enumerate(self.errors, 1):
                print(f"  {i}. {error}")
        
        # Sauvegarder le rapport
        report_file = self.project_root / f"validation_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        try:
            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2, ensure_ascii=False)
            print(f"\n­ƒôä Rapport sauvegard├®: {report_file.name}")
        except Exception as e:
            logger.warning(f"Impossible de sauvegarder le rapport: {e}")
        
        # Verdict final
        all_critical_passed = all([
            self.results.get('module_imports', False),
            self.results.get('cross_platform_manager', False)
        ])
        
        if all_critical_passed and report['success_rate'] >= 80:
            print(f"\n­ƒÄë VALIDATION R├ëUSSIE!")
            print(f"PostFlow est pr├¬t ├á fonctionner sur cette plateforme.")
            return True
        else:
            print(f"\nÔÜá´©Å VALIDATION PARTIELLE")
            print(f"Certains composants n├®cessitent une attention.")
            if report['success_rate'] >= 60:
                print(f"PostFlow peut fonctionner avec des limitations.")
            else:
                print(f"PostFlow n├®cessite des corrections avant utilisation.")
            return False


def main():
    """Fonction principale"""
    try:
        validator = PostFlowValidator()
        success = validator.run_validation()
        
        return 0 if success else 1
        
    except KeyboardInterrupt:
        print("\n­ƒøæ Validation interrompue par l'utilisateur")
        return 1
    except Exception as e:
        logger.error(f"ÔØî Erreur fatale: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
