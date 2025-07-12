#!/usr/bin/env python3
"""
🎬 RL PostFlow - Démonstration Multi-Plateforme
==============================================

Script de démonstration des fonctionnalités multi-plateforme
Montre comment PostFlow gère automatiquement les différentes plateformes

Version: 4.1.1
Date: 12 juillet 2025
"""

import sys
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

def demo_cross_platform():
    """Démonstration des fonctionnalités multi-plateforme"""
    
    print("🎬 RL PostFlow - Démonstration Multi-Plateforme")
    print("=" * 60)
    
    # 1. Gestionnaire de chemins
    print("\n🔧 1. GESTIONNAIRE DE CHEMINS MULTI-PLATEFORME")
    print("-" * 50)
    
    from src.utils.cross_platform_paths import get_platform_path_manager
    
    manager = get_platform_path_manager()
    platform_info = manager.get_platform_info()
    
    print(f"Plateforme détectée: {platform_info['os'].upper()}")
    print(f"Chemin LucidLink: {platform_info['lucidlink_base']}")
    print(f"Architecture: {platform_info['machine']}")
    
    # 2. Conversion de chemins
    print("\n🔄 2. CONVERSION AUTOMATIQUE DE CHEMINS")
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
        print(f"  {platform:8} → {normalized}")
    
    # 3. Validation de fichiers
    print("\n✅ 3. VALIDATION DE FICHIERS")
    print("-" * 50)
    
    from src.utils.lucidlink_utils import LucidLinkDetector
    
    detector = LucidLinkDetector()
    
    example_file = manager.get_lucidlink_base_path() / "SQ01" / "UNDLM_00001" / test_file
    
    print(f"Fichier exemple: {example_file}")
    print(f"Est sur LucidLink: {'✅ Oui' if detector.is_lucidlink_file(example_file) else '❌ Non'}")
    
    is_valid, normalized = manager.validate_lucidlink_path(example_file)
    print(f"Chemin valide: {'✅ Oui' if is_valid else '❌ Non'}")
    
    # 4. Configuration automatique
    print("\n⚙️ 4. CONFIGURATION AUTOMATIQUE")
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
    
    print("Configuration adaptée (plateforme actuelle):")
    print(f"  base_path: {adapted_config['lucidlink']['base_path']}")
    
    # 5. Intégration LucidLink
    print("\n🔗 5. INTÉGRATION LUCIDLINK")
    print("-" * 50)
    
    from src.integrations.lucidlink import LucidLinkIntegration
    
    integration = LucidLinkIntegration({'base_path': str(manager.get_lucidlink_base_path())})
    
    print(f"Connexion: {'✅ OK' if integration.connected else '❌ Échec'}")
    print(f"Structure détectée:")
    print(f"  Sources: {integration.sources_path}")
    print(f"  VFX: {integration.vfx_projects_path}")
    print(f"  Outputs: {integration.outputs_path}")
    
    # 6. Tests automatiques
    print("\n🧪 6. TESTS DE COMPATIBILITÉ")
    print("-" * 50)
    
    print("Exécution des tests automatiques...")
    
    tests = [
        ("Détection plateforme", True),  # Toujours OK si on arrive ici
        ("Gestionnaire chemins", True),  # Toujours OK si on arrive ici
        ("LucidLink monté", detector.is_lucidlink_mounted),
        ("Connexion LucidLink", integration.connected),
        ("Validation chemins", is_valid)
    ]
    
    for test_name, result in tests:
        status = "✅ OK" if result else "❌ KO"
        print(f"  {test_name:20} {status}")
    
    # Résumé
    print("\n" + "=" * 60)
    print("📊 RÉSUMÉ")
    print("=" * 60)
    
    all_tests_ok = all(result for _, result in tests)
    
    if all_tests_ok:
        print("🎉 PostFlow est entièrement compatible avec votre plateforme !")
        print("\n🚀 Prochaines étapes:")
        print("  1. Configurer vos credentials (Frame.io, Discord, etc.)")
        print("  2. Lancer PostFlow: python main.py")
        print("  3. Accéder au dashboard: http://localhost:8081")
    else:
        print("⚠️ Certains composants nécessitent une attention.")
        print("\n🔧 Actions recommandées:")
        print("  1. Vérifier l'installation de LucidLink")
        print("  2. Vérifier les chemins de montage")
        print("  3. Exécuter: python validate_postflow.py")
    
    print(f"\n📖 Documentation: {'docs/WINDOWS_GUIDE.md' if manager.is_windows else 'README.md'}")


if __name__ == "__main__":
    try:
        demo_cross_platform()
    except ImportError as e:
        print(f"❌ Erreur: Modules PostFlow non disponibles: {e}")
        print("💡 Assurez-vous d'avoir installé les dépendances: pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Erreur: {e}")
        sys.exit(1)
