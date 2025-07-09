#!/usr/bin/env python3
"""
UNDLM PostFlow - Script de setup et validation complète
Ce script vérifie que tout est correctement configuré pour la production
"""

import os
import json
from pathlib import Path
from datetime import datetime


def main():
    """Setup et validation complète du pipeline UNDLM PostFlow"""
    
    print("🚀 UNDLM PostFlow - Setup et Validation Complète")
    print("=" * 70)
    print(f"📅 Date: {datetime.now().strftime('%d/%m/%Y à %H:%M')}")
    print()
    
    # Configuration
    config_path = Path(__file__).parent.parent / "pipeline_config.json"
    
    if not config_path.exists():
        print("❌ ERREUR: Fichier de configuration manquant (pipeline_config.json)")
        return False
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    volume_path = Path(config['lucidlink']['base_path'])
    volume_name = config['lucidlink']['volume_name']
    
    print(f"📍 Volume LucidLink: {volume_name}")
    print(f"📍 Chemin: {volume_path}")
    print()
    
    # 1. Vérification du volume
    print("1️⃣ Vérification du volume LucidLink")
    print("-" * 40)
    
    if not volume_path.exists():
        print(f"❌ Volume non accessible: {volume_path}")
        print("   Vérifiez que LucidLink est connecté et que le volume o2b-undllm est monté")
        return False
    
    print(f"✅ Volume accessible: {volume_path}")
    print()
    
    # 2. Vérification de la structure
    print("2️⃣ Vérification de la structure de dossiers")
    print("-" * 40)
    
    key_folders = [
        "2_IN/_FROM_GRADING/UNDLM_SOURCES",
        "3_PROJECTS/2_VFX/SEQUENCES",
        "3_PROJECTS/2_VFX/_TEMPLATES",
        "4_OUT/2_FROM_VFX/BY_SHOT",
        "5_DELIVERABLES/MASTER"
    ]
    
    for folder in key_folders:
        folder_path = volume_path / folder
        if folder_path.exists():
            print(f"✅ {folder}")
        else:
            print(f"❌ {folder}")
            return False
    
    print()
    
    # 3. Vérification des données
    print("3️⃣ Vérification des données CSV")
    print("-" * 40)
    
    csv_path = Path(__file__).parent.parent / "data" / "shots.csv"
    if csv_path.exists():
        print(f"✅ Fichier CSV trouvé: {csv_path}")
        
        # Import du parser
        try:
            import sys
            sys.path.insert(0, str(Path(__file__).parent.parent))
            from src.parsers.csv_parser import CSVParser
            
            parser = CSVParser(str(csv_path))
            data = parser.parse()
            
            if data and data.shots:
                print(f"✅ {len(data.shots)} plans chargés depuis le CSV")
                
                # Compter les scènes uniques
                unique_scenes = set()
                unique_sources = set()
                
                for shot in data.shots:
                    if shot.scene_name:
                        unique_scenes.add(shot.scene_name)
                    if shot.source_file:
                        unique_sources.add(shot.source_file)
                
                print(f"📊 {len(unique_scenes)} scènes uniques")
                print(f"📁 {len(unique_sources)} fichiers sources")
            else:
                print("❌ Erreur de parsing du CSV")
                return False
                
        except Exception as e:
            print(f"❌ Erreur d'import ou de parsing: {e}")
            return False
    else:
        print(f"❌ Fichier CSV manquant: {csv_path}")
        return False
    
    print()
    
    # 4. Vérification des sources
    print("4️⃣ Vérification des sources")
    print("-" * 40)
    
    sources_path = volume_path / "2_IN/_FROM_GRADING/UNDLM_SOURCES"
    source_files = list(sources_path.glob("*.mov"))
    
    print(f"📥 Sources disponibles: {len(source_files)} fichiers")
    
    if len(source_files) == 0:
        print("⚠️ Aucun fichier source trouvé - normal si pas encore ajoutés")
        print("   Les sources seront ajoutées plus tard dans:")
        print(f"   {sources_path}")
    else:
        print("✅ Fichiers sources détectés")
        for i, source_file in enumerate(source_files[:5]):  # Afficher les 5 premiers
            print(f"   📄 {source_file.name}")
        if len(source_files) > 5:
            print(f"   ... et {len(source_files) - 5} autres fichiers")
    
    print()
    
    # 5. Vérification des templates
    print("5️⃣ Vérification des templates After Effects")
    print("-" * 40)
    
    templates_path = volume_path / "3_PROJECTS/2_VFX/_TEMPLATES"
    template_files = list(templates_path.glob("*.aep"))
    
    print(f"🎨 Templates disponibles: {len(template_files)} fichiers")
    
    if len(template_files) == 0:
        print("⚠️ Aucun template trouvé - à créer")
        print("   Templates recommandés:")
        print("   - UNDLM_SHOT_TEMPLATE.aep (template de base)")
        print("   - UNDLM_CHARACTER_TEMPLATE.aep (template personnages)")
        print("   - UNDLM_ENVIRONMENT_TEMPLATE.aep (template environnements)")
    else:
        print("✅ Templates détectés")
        for template_file in template_files:
            print(f"   🎬 {template_file.name}")
    
    print()
    
    # 6. Test des permissions
    print("6️⃣ Test des permissions")
    print("-" * 40)
    
    test_file = volume_path / "test_permissions.txt"
    try:
        with open(test_file, 'w') as f:
            f.write("Test de permissions")
        test_file.unlink()
        print("✅ Permissions en lecture/écriture OK")
    except Exception as e:
        print(f"❌ Problème de permissions: {e}")
        return False
    
    print()
    
    # 7. Résumé et prochaines étapes
    print("7️⃣ Résumé et prochaines étapes")
    print("-" * 40)
    
    print("🎉 SETUP COMPLET ET VALIDÉ")
    print()
    print("📋 État actuel:")
    print(f"   ✅ Volume LucidLink: {volume_name} accessible")
    print(f"   ✅ Structure de dossiers: complète")
    print(f"   ✅ Données CSV: {len(data.shots)} plans prêts")
    print(f"   ✅ Permissions: lecture/écriture OK")
    print(f"   ⏳ Sources: {len(source_files)} fichiers (à compléter)")
    print(f"   ⏳ Templates AE: {len(template_files)} fichiers (à compléter)")
    print()
    print("🚀 Prochaines étapes:")
    print("   1. Ajout des sources dans 2_IN/_FROM_GRADING/UNDLM_SOURCES/")
    print("   2. Création des templates AE dans 3_PROJECTS/2_VFX/_TEMPLATES/")
    print("   3. Configuration des webhooks Discord/Frame.io")
    print("   4. Test du pipeline complet avec python main.py")
    print("   5. Lancement de la production")
    print()
    print("📚 Documentation disponible:")
    print(f"   - README: {Path(__file__).parent.parent / 'README.md'}")
    print(f"   - Config serveur: {volume_path / '1_REF_FILES/1_BRIEFS_AND_REPORTS/README_STRUCTURE.md'}")
    print(f"   - Tests: python tests/test_server_structure.py")
    print()
    
    return True


if __name__ == "__main__":
    success = main()
    
    if success:
        print("✅ SUCCÈS: Pipeline UNDLM PostFlow prêt pour la production")
        exit(0)
    else:
        print("❌ ÉCHEC: Problèmes détectés dans la configuration")
        exit(1)
