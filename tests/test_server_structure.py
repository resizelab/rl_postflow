"""
Test de validation de la structure serveur LucidLink
Vérifie que tous les dossiers nécessaires existent et sont accessibles
"""

import json
from pathlib import Path
from datetime import datetime


def load_config():
    """Load configuration from pipeline_config.json"""
    config_path = Path(__file__).parent.parent / "pipeline_config.json"
    with open(config_path, 'r') as f:
        return json.load(f)


def test_server_structure():
    """Test de la structure serveur LucidLink"""
    print("🔍 Test de la structure serveur LucidLink")
    print("=" * 60)
    
    config = load_config()
    base_path = Path(config['lucidlink']['base_path'])
    
    print(f"📍 Volume testé: {base_path}")
    print(f"📍 Nom du volume: {config['lucidlink']['volume_name']}")
    print()
    
    # Vérifier que le volume est monté
    if not base_path.exists():
        print(f"❌ ERREUR: Le volume n'est pas accessible à {base_path}")
        print("   Vérifiez que LucidLink est connecté et que le volume o2b-undllm est monté")
        return False
    
    print(f"✅ Volume accessible: {base_path}")
    
    # Dossiers critiques à vérifier
    critical_folders = [
        "1_REF_FILES",
        "1_REF_FILES/1_BRIEFS_AND_REPORTS",
        "2_IN/_FROM_GRADING",
        "2_IN/_FROM_GRADING/UNDLM_SOURCES",
        "3_PROJECTS/2_VFX",
        "3_PROJECTS/2_VFX/SEQUENCES",
        "3_PROJECTS/2_VFX/_TEMPLATES",
        "3_PROJECTS/2_VFX/MASTER",
        "4_OUT/2_FROM_VFX",
        "4_OUT/2_FROM_VFX/BY_SHOT",
        "4_OUT/2_FROM_VFX/BY_SCENE",
        "4_OUT/2_FROM_VFX/ALL",
        "5_DELIVERABLES/MASTER",
        "5_DELIVERABLES/MASTER/PAD",
        "5_DELIVERABLES/MASTER/PRORES"
    ]
    
    print("\n📁 Vérification des dossiers critiques:")
    missing_folders = []
    
    for folder in critical_folders:
        folder_path = base_path / folder
        if folder_path.exists():
            print(f"  ✅ {folder}")
        else:
            print(f"  ❌ {folder} - MANQUANT")
            missing_folders.append(folder)
    
    # Vérifier les fichiers de configuration
    print("\n📄 Vérification des fichiers de configuration:")
    config_files = [
        "1_REF_FILES/1_BRIEFS_AND_REPORTS/lucidlink_config.json",
        "1_REF_FILES/1_BRIEFS_AND_REPORTS/README_STRUCTURE.md",
        "1_REF_FILES/1_BRIEFS_AND_REPORTS/folder_creation_log.json"
    ]
    
    missing_files = []
    for file_path in config_files:
        full_path = base_path / file_path
        if full_path.exists():
            print(f"  ✅ {file_path}")
        else:
            print(f"  ❌ {file_path} - MANQUANT")
            missing_files.append(file_path)
    
    # Vérifier les dossiers de scènes exemples
    print("\n🎬 Vérification des dossiers de scènes:")
    scene_folders = [
        "3_PROJECTS/2_VFX/SEQUENCES/SC01_REVEIL_HOPITAL_JOUR",
        "3_PROJECTS/2_VFX/SEQUENCES/SC02_COULOIR_HOPITAL_JOUR",
        "4_OUT/2_FROM_VFX/BY_SCENE/SC01_REVEIL_HOPITAL_JOUR",
        "4_OUT/2_FROM_VFX/BY_SCENE/SC02_COULOIR_HOPITAL_JOUR"
    ]
    
    for scene_folder in scene_folders:
        folder_path = base_path / scene_folder
        if folder_path.exists():
            print(f"  ✅ {scene_folder}")
        else:
            print(f"  ❌ {scene_folder} - MANQUANT")
    
    # Test d'écriture pour vérifier les permissions
    print("\n🔐 Test des permissions d'écriture:")
    test_file = base_path / "1_REF_FILES" / "test_write_permissions.txt"
    
    try:
        with open(test_file, 'w') as f:
            f.write(f"Test d'écriture - {datetime.now().isoformat()}")
        print("  ✅ Écriture autorisée")
        
        # Nettoyage
        test_file.unlink()
        print("  ✅ Suppression autorisée")
        
    except Exception as e:
        print(f"  ❌ Erreur de permissions: {e}")
        return False
    
    # Résumé
    print("\n📊 Résumé du test:")
    print(f"  📁 Dossiers critiques: {len(critical_folders) - len(missing_folders)}/{len(critical_folders)}")
    print(f"  📄 Fichiers config: {len(config_files) - len(missing_files)}/{len(config_files)}")
    print(f"  🔐 Permissions: OK")
    
    if missing_folders or missing_files:
        print("\n⚠️ Éléments manquants détectés:")
        for folder in missing_folders:
            print(f"  - Dossier: {folder}")
        for file in missing_files:
            print(f"  - Fichier: {file}")
        return False
    
    print("\n🎉 Structure serveur validée avec succès !")
    return True


def test_pipeline_integration():
    """Test d'intégration avec le pipeline"""
    print("\n⚙️ Test d'intégration pipeline")
    print("=" * 40)
    
    config = load_config()
    base_path = Path(config['lucidlink']['base_path'])
    
    # Simulation d'un workflow complet
    print("🔄 Simulation d'un workflow complet:")
    
    # 1. Vérifier les sources (vides pour l'instant)
    sources_path = base_path / "2_IN/_FROM_GRADING/UNDLM_SOURCES"
    source_files = list(sources_path.glob("*.mov"))
    print(f"  📥 Sources disponibles: {len(source_files)} fichiers")
    
    # 2. Créer un dossier de plan test
    test_shot = "UNDLM_99999"
    shot_folder = base_path / "4_OUT/2_FROM_VFX/BY_SHOT" / test_shot
    
    try:
        shot_folder.mkdir(parents=True, exist_ok=True)
        print(f"  📁 Dossier de plan créé: {test_shot}")
        
        # 3. Simuler un export
        test_export = shot_folder / f"{test_shot}_v001.mov"
        with open(test_export, 'w') as f:
            f.write("Fichier de test pour simulation export")
        print(f"  🎬 Export simulé: {test_export.name}")
        
        # 4. Nettoyage
        test_export.unlink()
        shot_folder.rmdir()
        print("  🧹 Nettoyage terminé")
        
    except Exception as e:
        print(f"  ❌ Erreur workflow: {e}")
        return False
    
    print("  ✅ Workflow complet validé")
    return True


def main():
    """Test principal"""
    print("🚀 Test de validation serveur UNDLM PostFlow")
    print("=" * 70)
    
    # Test de la structure
    structure_ok = test_server_structure()
    
    # Test d'intégration
    integration_ok = test_pipeline_integration()
    
    print("\n" + "=" * 70)
    if structure_ok and integration_ok:
        print("✅ SUCCÈS: Serveur LucidLink prêt pour la production")
        print("\n📋 Prochaines étapes:")
        print("1. 📥 Ajout des sources dans 2_IN/_FROM_GRADING/UNDLM_SOURCES/")
        print("2. 🎨 Création des templates AE dans 3_PROJECTS/2_VFX/TEMPLATES/")
        print("3. 🔗 Configuration des intégrations (Frame.io, Google Sheets, Discord)")
        print("4. 🚀 Lancement du pipeline de production")
    else:
        print("❌ ÉCHEC: Problèmes détectés dans la structure serveur")
        print("Vérifiez la configuration et réexécutez le script create_folder_structure.py")


if __name__ == "__main__":
    main()
