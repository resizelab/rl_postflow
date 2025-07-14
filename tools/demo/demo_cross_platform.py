#!/usr/bin/env python3
"""
­ƒÄ¼ RL PostFlow - D├®monstration Multi-Plateforme
==============================================

Script de d├®monstration des fonctionnalit├®s multi-plateforme
Montre comment PostFlow g├¿re automatiquement les diff├®rentes plateformes

Version: 4.1.1
Date: 12 juillet 2025
"""

import sys
from pathlib import Path

# Ajouter le r├®pertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

def demo_cross_platform():
    """D├®monstration des fonctionnalit├®s multi-plateforme"""
    
    print("­ƒÄ¼ RL PostFlow - D├®monstration Multi-Plateforme")
    print("=" * 60)
    
    # 1. Gestionnaire de chemins
    print("\n­ƒöº 1. GESTIONNAIRE DE CHEMINS MULTI-PLATEFORME")
    print("-" * 50)
    
    from src.utils.cross_platform_paths import get_platform_path_manager
    
    manager = get_platform_path_manager()
    platform_info = manager.get_platform_info()
    
    print(f"Plateforme d├®tect├®e: {platform_info['os'].upper()}")
    print(f"Chemin LucidLink: {platform_info['lucidlink_base']}")
    print(f"Architecture: {platform_info['machine']}")
    
    # 2. Conversion de chemins
    print("\n­ƒöä 2. CONVERSION AUTOMATIQUE DE CHEMINS")
    print("-" * 50)
    
    test_file = "SQ01_UNDLM_00001_v001.mov"
    
    # Chemins exemple pour chaque plateforme
    paths = {
        'macOS': f"/Volumes/resizelab/o2b-undllm/SQ01/UNDLM_00001/{test_file}",
        'Windows': f"E:\\Volumes\\resizelab\\o2b-undllm\\SQ01\\UNDLM_00001\\{test_file}",
        'Linux': f"/mnt/lucidlink/resizelab/o2b-undllm/SQ01/UNDLM_00001/{test_file}"
    }
    
    print("Conversion automatique vers votre plateforme:")
    for platform, path in paths.items():
        normalized = manager.normalize_path(path)
        print(f"  {platform:8} ÔåÆ {normalized}")
    
    # 3. Validation de fichiers
    print("\nÔ£à 3. VALIDATION DE FICHIERS")
    print("-" * 50)
    
    from src.utils.lucidlink_utils import LucidLinkDetector
    
    detector = LucidLinkDetector()
    
    example_file = manager.get_lucidlink_base_path() / "SQ01" / "UNDLM_00001" / test_file
    
    print(f"Fichier exemple: {example_file}")
    print(f"Est sur LucidLink: {'Ô£à Oui' if detector.is_lucidlink_file(example_file) else 'ÔØî Non'}")
    
    is_valid, normalized = manager.validate_lucidlink_path(example_file)
    print(f"Chemin valide: {'Ô£à Oui' if is_valid else 'ÔØî Non'}")
    
    # 4. Configuration automatique
    print("\nÔÜÖ´©Å 4. CONFIGURATION AUTOMATIQUE")
    print("-" * 50)
    
    example_config = {
        'lucidlink': {
            'base_path': '/Volumes/resizelab/o2b-undllm',  # Chemin macOS
            'watch_directory': '/Volumes/resizelab/o2b-undllm'
        },
        'other_path': '/Volumes/resizelab/o2b-undllm/subfolder'
    }
    
    print("Configuration originale (macOS):")
    print(f"  base_path: {example_config['lucidlink']['base_path']}")
    
    # Adapter pour la plateforme actuelle
    adapted_config = manager.update_config_paths(example_config)
    
    print("Configuration adapt├®e (plateforme actuelle):")
    print(f"  base_path: {adapted_config['lucidlink']['base_path']}")
    
    # 5. Int├®gration LucidLink
    print("\n­ƒöù 5. INT├ëGRATION LUCIDLINK")
    print("-" * 50)
    
    from src.integrations.lucidlink import LucidLinkIntegration
    
    integration = LucidLinkIntegration({'base_path': str(manager.get_lucidlink_base_path())})
    
    print(f"Connexion: {'Ô£à OK' if integration.connected else 'ÔØî ├ëchec'}")
    print(f"Structure d├®tect├®e:")
    print(f"  Sources: {integration.sources_path}")
    print(f"  VFX: {integration.vfx_projects_path}")
    print(f"  Outputs: {integration.outputs_path}")
    
    # 6. Tests automatiques
    print("\n­ƒº¬ 6. TESTS DE COMPATIBILIT├ë")
    print("-" * 50)
    
    print("Ex├®cution des tests automatiques...")
    
    tests = [
        ("D├®tection plateforme", True),  # Toujours OK si on arrive ici
        ("Gestionnaire chemins", True),  # Toujours OK si on arrive ici
        ("LucidLink mont├®", detector.is_lucidlink_mounted),
        ("Connexion LucidLink", integration.connected),
        ("Validation chemins", is_valid)
    ]
    
    for test_name, result in tests:
        status = "Ô£à OK" if result else "ÔØî KO"
        print(f"  {test_name:20} {status}")
    
    # R├®sum├®
    print("\n" + "=" * 60)
    print("­ƒôè R├ëSUM├ë")
    print("=" * 60)
    
    all_tests_ok = all(result for _, result in tests)
    
    if all_tests_ok:
        print("­ƒÄë PostFlow est enti├¿rement compatible avec votre plateforme !")
        print("\n­ƒÜÇ Prochaines ├®tapes:")
        print("  1. Configurer vos credentials (Frame.io, Discord, etc.)")
        print("  2. Lancer PostFlow: python main.py")
        print("  3. Acc├®der au dashboard: http://localhost:8081")
    else:
        print("ÔÜá´©Å Certains composants n├®cessitent une attention.")
        print("\n­ƒöº Actions recommand├®es:")
        print("  1. V├®rifier l'installation de LucidLink")
        print("  2. V├®rifier les chemins de montage")
        print("  3. Ex├®cuter: python validate_postflow.py")
    
    print(f"\n­ƒôû Documentation: {'docs/WINDOWS_GUIDE.md' if manager.is_windows else 'README.md'}")


if __name__ == "__main__":
    try:
        demo_cross_platform()
    except ImportError as e:
        print(f"ÔØî Erreur: Modules PostFlow non disponibles: {e}")
        print("­ƒÆí Assurez-vous d'avoir install├® les d├®pendances: pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"ÔØî Erreur: {e}")
        sys.exit(1)
