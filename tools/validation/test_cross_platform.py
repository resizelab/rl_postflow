#!/usr/bin/env python3
"""
­ƒÄ¼ RL PostFlow - Test de Compatibilit├® Multi-Plateforme
======================================================

Script de test pour v├®rifier la compatibilit├® Windows/macOS/Linux
- Test de d├®tection de plateforme
- Test de conversion de chemins
- Test de validation des configurations

Version: 4.1.1
Date: 12 juillet 2025
"""

import json
import logging
import sys
from pathlib import Path
from typing import Dict, List

# Ajouter le r├®pertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.utils.cross_platform_paths import (
    CrossPlatformPathManager,
    get_platform_path_manager,
    normalize_lucidlink_path,
    is_windows_platform,
    is_macos_platform
)

from src.utils.lucidlink_utils import LucidLinkDetector
from src.integrations.lucidlink import LucidLinkIntegration

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class CrossPlatformTester:
    """Testeur de compatibilit├® multi-plateforme"""
    
    def __init__(self):
        self.path_manager = get_platform_path_manager()
        self.test_results = {}
    
    def test_platform_detection(self) -> bool:
        """Test de d├®tection de plateforme"""
        try:
            logger.info("­ƒöì Test de d├®tection de plateforme...")
            
            platform_info = self.path_manager.get_platform_info()
            
            print(f"  Syst├¿me: {platform_info['os']}")
            print(f"  Plateforme: {platform_info['platform']}")
            print(f"  Architecture: {platform_info['machine']}")
            print(f"  Windows: {'Ô£à' if platform_info['is_windows'] else 'ÔØî'}")
            print(f"  macOS: {'Ô£à' if platform_info['is_macos'] else 'ÔØî'}")
            print(f"  Linux: {'Ô£à' if platform_info['is_linux'] else 'ÔØî'}")
            
            # V├®rifier que la d├®tection est coh├®rente
            os_count = sum([
                platform_info['is_windows'],
                platform_info['is_macos'], 
                platform_info['is_linux']
            ])
            
            if os_count == 1:
                logger.info("Ô£à D├®tection de plateforme: OK")
                return True
            else:
                logger.error(f"ÔØî D├®tection de plateforme incoh├®rente: {os_count} OS d├®tect├®s")
                return False
            
        except Exception as e:
            logger.error(f"ÔØî Erreur d├®tection plateforme: {e}")
            return False
    
    def test_path_normalization(self) -> bool:
        """Test de normalisation de chemins"""
        try:
            logger.info("­ƒöä Test de normalisation de chemins...")
            
            # Chemins de test pour chaque plateforme
            test_paths = [
                "/Volumes/resizelab/o2b-undllm/test.mov",
                "E:\\Volumes\\resizelab\\o2b-undllm\\test.mov",
                "/mnt/lucidlink/resizelab/o2b-undllm/test.mov",
                "E:/Volumes/resizelab/o2b-undllm/test.mov",  # Windows avec forward slashes
                "/Volumes/resizelab/o2b-undllm/SQ01/UNDLM_00001/SQ01_UNDLM_00001_v001.mov"
            ]
            
            all_valid = True
            
            for test_path in test_paths:
                try:
                    normalized = normalize_lucidlink_path(test_path)
                    print(f"  {test_path}")
                    print(f"    ÔåÆ {normalized}")
                    
                    # V├®rifier que le chemin normalis├® est valide
                    if normalized.is_absolute():
                        logger.debug(f"Ô£à Chemin valide: {normalized}")
                    else:
                        logger.warning(f"ÔÜá´©Å Chemin non absolu: {normalized}")
                        all_valid = False
                        
                except Exception as e:
                    logger.error(f"ÔØî Erreur normalisation {test_path}: {e}")
                    all_valid = False
            
            if all_valid:
                logger.info("Ô£à Normalisation de chemins: OK")
            else:
                logger.error("ÔØî Erreurs de normalisation d├®tect├®es")
            
            return all_valid
            
        except Exception as e:
            logger.error(f"ÔØî Erreur test normalisation: {e}")
            return False
    
    def test_path_conversion(self) -> bool:
        """Test de conversion entre plateformes"""
        try:
            logger.info("­ƒöä Test de conversion entre plateformes...")
            
            base_path = "/Volumes/resizelab/o2b-undllm/test.mov"
            
            # Convertir vers chaque plateforme
            windows_path = self.path_manager.convert_path_for_os(base_path, 'windows')
            macos_path = self.path_manager.convert_path_for_os(base_path, 'macos')
            linux_path = self.path_manager.convert_path_for_os(base_path, 'linux')
            
            print(f"  Chemin original: {base_path}")
            print(f"  ÔåÆ Windows: {windows_path}")
            print(f"  ÔåÆ macOS: {macos_path}")
            print(f"  ÔåÆ Linux: {linux_path}")
            
            # V├®rifications
            expected_results = {
                'windows': windows_path.startswith('E:\\'),
                'macos': macos_path.startswith('/Volumes/'),
                'linux': linux_path.startswith('/mnt/')
            }
            
            all_valid = all(expected_results.values())
            
            if all_valid:
                logger.info("Ô£à Conversion entre plateformes: OK")
            else:
                logger.error(f"ÔØî Erreurs de conversion: {expected_results}")
            
            return all_valid
            
        except Exception as e:
            logger.error(f"ÔØî Erreur test conversion: {e}")
            return False
    
    def test_lucidlink_detection(self) -> bool:
        """Test de d├®tection LucidLink"""
        try:
            logger.info("­ƒöì Test de d├®tection LucidLink...")
            
            detector = LucidLinkDetector()
            
            print(f"  LucidLink mont├®: {'Ô£à' if detector.is_lucidlink_mounted else 'ÔØî'}")
            print(f"  Chemins d├®tect├®s: {len(detector.lucidlink_paths)}")
            
            for i, path in enumerate(detector.lucidlink_paths):
                print(f"    {i+1}. {path}")
            
            # Test avec un fichier fictif
            base_path = self.path_manager.get_lucidlink_base_path()
            test_file = base_path / "test.mov"
            
            is_lucidlink_file = detector.is_lucidlink_file(test_file)
            print(f"  Test fichier LucidLink: {'Ô£à' if is_lucidlink_file else 'ÔØî'}")
            
            logger.info("Ô£à D├®tection LucidLink: OK")
            return True
            
        except Exception as e:
            logger.error(f"ÔØî Erreur d├®tection LucidLink: {e}")
            return False
    
    def test_lucidlink_integration(self) -> bool:
        """Test d'int├®gration LucidLink"""
        try:
            logger.info("­ƒöù Test d'int├®gration LucidLink...")
            
            # Configuration de test
            test_config = {
                'base_path': str(self.path_manager.get_lucidlink_base_path())
            }
            
            integration = LucidLinkIntegration(test_config)
            
            print(f"  Connexion: {'Ô£à' if integration.connected else 'ÔØî'}")
            print(f"  Chemin de base: {integration.base_path}")
            print(f"  Sources: {integration.sources_path}")
            print(f"  VFX: {integration.vfx_projects_path}")
            print(f"  Outputs: {integration.outputs_path}")
            
            # V├®rifier que tous les chemins sont absolus et normalis├®s
            paths_to_check = [
                integration.base_path,
                integration.sources_path,
                integration.vfx_projects_path,
                integration.outputs_path
            ]
            
            all_valid = all(path.is_absolute() for path in paths_to_check)
            
            if all_valid:
                logger.info("Ô£à Int├®gration LucidLink: OK")
            else:
                logger.error("ÔØî Chemins non valides d├®tect├®s")
            
            return all_valid
            
        except Exception as e:
            logger.error(f"ÔØî Erreur int├®gration LucidLink: {e}")
            return False
    
    def test_config_migration(self) -> bool:
        """Test de migration de configuration"""
        try:
            logger.info("­ƒöä Test de migration de configuration...")
            
            # Configuration de test avec chemins macOS
            test_config = {
                'lucidlink': {
                    'base_path': '/Volumes/resizelab/o2b-undllm',
                    'watch_directory': '/Volumes/resizelab/o2b-undllm'
                },
                'other_settings': {
                    'some_path': '/Volumes/resizelab/o2b-undllm/subfolder',
                    'normal_setting': 'value'
                }
            }
            
            # Migrer la configuration
            migrated_config = self.path_manager.update_config_paths(test_config)
            
            print(f"  Configuration originale:")
            print(f"    base_path: {test_config['lucidlink']['base_path']}")
            print(f"  Configuration migr├®e:")
            print(f"    base_path: {migrated_config['lucidlink']['base_path']}")
            
            # V├®rifier que la migration a fonctionn├®
            expected_base = str(self.path_manager.get_lucidlink_base_path())
            actual_base = migrated_config['lucidlink']['base_path']
            
            if actual_base == expected_base:
                logger.info("Ô£à Migration de configuration: OK")
                return True
            else:
                logger.error(f"ÔØî Migration ├®chou├®e: {actual_base} != {expected_base}")
                return False
            
        except Exception as e:
            logger.error(f"ÔØî Erreur test migration: {e}")
            return False
    
    def run_all_tests(self) -> bool:
        """Ex├®cuter tous les tests"""
        print("­ƒº¬ RL PostFlow - Tests de Compatibilit├® Multi-Plateforme")
        print("=" * 60)
        
        tests = [
            ('D├®tection plateforme', self.test_platform_detection),
            ('Normalisation chemins', self.test_path_normalization),
            ('Conversion plateformes', self.test_path_conversion),
            ('D├®tection LucidLink', self.test_lucidlink_detection),
            ('Int├®gration LucidLink', self.test_lucidlink_integration),
            ('Migration configuration', self.test_config_migration)
        ]
        
        results = {}
        all_passed = True
        
        for test_name, test_func in tests:
            print(f"\n­ƒö╣ {test_name}")
            print("-" * 40)
            
            try:
                result = test_func()
                results[test_name] = result
                if not result:
                    all_passed = False
            except Exception as e:
                logger.error(f"ÔØî Erreur dans {test_name}: {e}")
                results[test_name] = False
                all_passed = False
        
        # R├®sum├®
        print("\n" + "=" * 60)
        print("­ƒôè R├ëSUM├ë DES TESTS")
        print("=" * 60)
        
        for test_name, result in results.items():
            status = "Ô£à R├ëUSSI" if result else "ÔØî ├ëCHEC"
            print(f"{test_name:.<40} {status}")
        
        overall_status = "Ô£à TOUS LES TESTS R├ëUSSIS" if all_passed else "ÔØî CERTAINS TESTS ONT ├ëCHOU├ë"
        print(f"\nStatut global: {overall_status}")
        
        return all_passed


def main():
    """Fonction principale"""
    try:
        tester = CrossPlatformTester()
        success = tester.run_all_tests()
        
        if success:
            print("\n­ƒÄë PostFlow est compatible avec cette plateforme!")
            return 0
        else:
            print("\nÔÜá´©Å Des probl├¿mes de compatibilit├® ont ├®t├® d├®tect├®s")
            return 1
            
    except Exception as e:
        logger.error(f"ÔØî Erreur fatale: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
