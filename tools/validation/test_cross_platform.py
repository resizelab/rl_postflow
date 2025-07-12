#!/usr/bin/env python3
"""
🎬 RL PostFlow - Test de Compatibilité Multi-Plateforme
======================================================

Script de test pour vérifier la compatibilité Windows/macOS/Linux
- Test de détection de plateforme
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

# Ajouter le répertoire src au path
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
    """Testeur de compatibilité multi-plateforme"""
    
    def __init__(self):
        self.path_manager = get_platform_path_manager()
        self.test_results = {}
    
    def test_platform_detection(self) -> bool:
        """Test de détection de plateforme"""
        try:
            logger.info("🔍 Test de détection de plateforme...")
            
            platform_info = self.path_manager.get_platform_info()
            
            print(f"  Système: {platform_info['os']}")
            print(f"  Plateforme: {platform_info['platform']}")
            print(f"  Architecture: {platform_info['machine']}")
            print(f"  Windows: {'✅' if platform_info['is_windows'] else '❌'}")
            print(f"  macOS: {'✅' if platform_info['is_macos'] else '❌'}")
            print(f"  Linux: {'✅' if platform_info['is_linux'] else '❌'}")
            
            # Vérifier que la détection est cohérente
            os_count = sum([
                platform_info['is_windows'],
                platform_info['is_macos'], 
                platform_info['is_linux']
            ])
            
            if os_count == 1:
                logger.info("✅ Détection de plateforme: OK")
                return True
            else:
                logger.error(f"❌ Détection de plateforme incohérente: {os_count} OS détectés")
                return False
            
        except Exception as e:
            logger.error(f"❌ Erreur détection plateforme: {e}")
            return False
    
    def test_path_normalization(self) -> bool:
        """Test de normalisation de chemins"""
        try:
            logger.info("🔄 Test de normalisation de chemins...")
            
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
                    print(f"    → {normalized}")
                    
                    # Vérifier que le chemin normalisé est valide
                    if normalized.is_absolute():
                        logger.debug(f"✅ Chemin valide: {normalized}")
                    else:
                        logger.warning(f"⚠️ Chemin non absolu: {normalized}")
                        all_valid = False
                        
                except Exception as e:
                    logger.error(f"❌ Erreur normalisation {test_path}: {e}")
                    all_valid = False
            
            if all_valid:
                logger.info("✅ Normalisation de chemins: OK")
            else:
                logger.error("❌ Erreurs de normalisation détectées")
            
            return all_valid
            
        except Exception as e:
            logger.error(f"❌ Erreur test normalisation: {e}")
            return False
    
    def test_path_conversion(self) -> bool:
        """Test de conversion entre plateformes"""
        try:
            logger.info("🔄 Test de conversion entre plateformes...")
            
            base_path = "/Volumes/resizelab/o2b-undllm/test.mov"
            
            # Convertir vers chaque plateforme
            windows_path = self.path_manager.convert_path_for_os(base_path, 'windows')
            macos_path = self.path_manager.convert_path_for_os(base_path, 'macos')
            linux_path = self.path_manager.convert_path_for_os(base_path, 'linux')
            
            print(f"  Chemin original: {base_path}")
            print(f"  → Windows: {windows_path}")
            print(f"  → macOS: {macos_path}")
            print(f"  → Linux: {linux_path}")
            
            # Vérifications
            expected_results = {
                'windows': windows_path.startswith('E:\\'),
                'macos': macos_path.startswith('/Volumes/'),
                'linux': linux_path.startswith('/mnt/')
            }
            
            all_valid = all(expected_results.values())
            
            if all_valid:
                logger.info("✅ Conversion entre plateformes: OK")
            else:
                logger.error(f"❌ Erreurs de conversion: {expected_results}")
            
            return all_valid
            
        except Exception as e:
            logger.error(f"❌ Erreur test conversion: {e}")
            return False
    
    def test_lucidlink_detection(self) -> bool:
        """Test de détection LucidLink"""
        try:
            logger.info("🔍 Test de détection LucidLink...")
            
            detector = LucidLinkDetector()
            
            print(f"  LucidLink monté: {'✅' if detector.is_lucidlink_mounted else '❌'}")
            print(f"  Chemins détectés: {len(detector.lucidlink_paths)}")
            
            for i, path in enumerate(detector.lucidlink_paths):
                print(f"    {i+1}. {path}")
            
            # Test avec un fichier fictif
            base_path = self.path_manager.get_lucidlink_base_path()
            test_file = base_path / "test.mov"
            
            is_lucidlink_file = detector.is_lucidlink_file(test_file)
            print(f"  Test fichier LucidLink: {'✅' if is_lucidlink_file else '❌'}")
            
            logger.info("✅ Détection LucidLink: OK")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur détection LucidLink: {e}")
            return False
    
    def test_lucidlink_integration(self) -> bool:
        """Test d'intégration LucidLink"""
        try:
            logger.info("🔗 Test d'intégration LucidLink...")
            
            # Configuration de test
            test_config = {
                'base_path': str(self.path_manager.get_lucidlink_base_path())
            }
            
            integration = LucidLinkIntegration(test_config)
            
            print(f"  Connexion: {'✅' if integration.connected else '❌'}")
            print(f"  Chemin de base: {integration.base_path}")
            print(f"  Sources: {integration.sources_path}")
            print(f"  VFX: {integration.vfx_projects_path}")
            print(f"  Outputs: {integration.outputs_path}")
            
            # Vérifier que tous les chemins sont absolus et normalisés
            paths_to_check = [
                integration.base_path,
                integration.sources_path,
                integration.vfx_projects_path,
                integration.outputs_path
            ]
            
            all_valid = all(path.is_absolute() for path in paths_to_check)
            
            if all_valid:
                logger.info("✅ Intégration LucidLink: OK")
            else:
                logger.error("❌ Chemins non valides détectés")
            
            return all_valid
            
        except Exception as e:
            logger.error(f"❌ Erreur intégration LucidLink: {e}")
            return False
    
    def test_config_migration(self) -> bool:
        """Test de migration de configuration"""
        try:
            logger.info("🔄 Test de migration de configuration...")
            
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
            print(f"  Configuration migrée:")
            print(f"    base_path: {migrated_config['lucidlink']['base_path']}")
            
            # Vérifier que la migration a fonctionné
            expected_base = str(self.path_manager.get_lucidlink_base_path())
            actual_base = migrated_config['lucidlink']['base_path']
            
            if actual_base == expected_base:
                logger.info("✅ Migration de configuration: OK")
                return True
            else:
                logger.error(f"❌ Migration échouée: {actual_base} != {expected_base}")
                return False
            
        except Exception as e:
            logger.error(f"❌ Erreur test migration: {e}")
            return False
    
    def run_all_tests(self) -> bool:
        """Exécuter tous les tests"""
        print("🧪 RL PostFlow - Tests de Compatibilité Multi-Plateforme")
        print("=" * 60)
        
        tests = [
            ('Détection plateforme', self.test_platform_detection),
            ('Normalisation chemins', self.test_path_normalization),
            ('Conversion plateformes', self.test_path_conversion),
            ('Détection LucidLink', self.test_lucidlink_detection),
            ('Intégration LucidLink', self.test_lucidlink_integration),
            ('Migration configuration', self.test_config_migration)
        ]
        
        results = {}
        all_passed = True
        
        for test_name, test_func in tests:
            print(f"\n🔹 {test_name}")
            print("-" * 40)
            
            try:
                result = test_func()
                results[test_name] = result
                if not result:
                    all_passed = False
            except Exception as e:
                logger.error(f"❌ Erreur dans {test_name}: {e}")
                results[test_name] = False
                all_passed = False
        
        # Résumé
        print("\n" + "=" * 60)
        print("📊 RÉSUMÉ DES TESTS")
        print("=" * 60)
        
        for test_name, result in results.items():
            status = "✅ RÉUSSI" if result else "❌ ÉCHEC"
            print(f"{test_name:.<40} {status}")
        
        overall_status = "✅ TOUS LES TESTS RÉUSSIS" if all_passed else "❌ CERTAINS TESTS ONT ÉCHOUÉ"
        print(f"\nStatut global: {overall_status}")
        
        return all_passed


def main():
    """Fonction principale"""
    try:
        tester = CrossPlatformTester()
        success = tester.run_all_tests()
        
        if success:
            print("\n🎉 PostFlow est compatible avec cette plateforme!")
            return 0
        else:
            print("\n⚠️ Des problèmes de compatibilité ont été détectés")
            return 1
            
    except Exception as e:
        logger.error(f"❌ Erreur fatale: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
