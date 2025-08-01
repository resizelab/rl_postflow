#!/usr/bin/env python3
"""
Script de validation de la documentation PostFlow v4.3.0
Vérifie que toute la documentation est à jour et cohérente.
"""

import json
from pathlib import Path
import re
from datetime import datetime

def load_version_from_config():
    """Charge la version depuis pipeline_config.json"""
    config_path = Path("pipeline_config.json")
    if config_path.exists():
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
            # La version est dans project_info.version
            return config.get('project_info', {}).get('version', 'unknown')
    return 'unknown'

def check_file_version_references(file_path: Path, expected_version: str):
    """Vérifie les références de version dans un fichier"""
    issues = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Chercher les références de version obsolètes
        obsolete_versions = ['4.1.1', '4.1.9', '4.2.0']
        for old_version in obsolete_versions:
            if old_version in content and old_version != expected_version:
                issues.append(f"Référence obsolète v{old_version} trouvée")
                
        # Vérifier que la version actuelle est présente
        if expected_version not in content:
            issues.append(f"Version actuelle v{expected_version} manquante")
            
    except Exception as e:
        issues.append(f"Erreur de lecture: {e}")
        
    return issues

def validate_documentation():
    """Valide toute la documentation"""
    print("🔍 Validation de la documentation PostFlow v4.3.0")
    print("=" * 60)
    
    # Charger la version depuis la config
    current_version = load_version_from_config()
    print(f"📋 Version actuelle détectée: {current_version}")
    
    # Liste des fichiers critiques à vérifier
    critical_files = [
        "README.md",
        "CHANGELOG.md", 
        "docs/AFTER_EFFECTS_GENERATOR.md",
        "docs/DISCORD_INTEGRATION_REPORT.md",
        "docs/REPOSITORY_STRUCTURE.md",
        "docs/INDEX.md",
        "docs/AUTO_HOOKS_v4.3.0.md"
    ]
    
    all_issues = {}
    
    for file_path_str in critical_files:
        file_path = Path(file_path_str)
        print(f"\n📄 Vérification: {file_path}")
        
        if not file_path.exists():
            print(f"   ❌ Fichier manquant!")
            all_issues[str(file_path)] = ["Fichier manquant"]
            continue
            
        issues = check_file_version_references(file_path, current_version)
        
        if issues:
            print(f"   ⚠️  {len(issues)} problème(s) détecté(s):")
            for issue in issues:
                print(f"      - {issue}")
            all_issues[str(file_path)] = issues
        else:
            print(f"   ✅ OK")
    
    # Vérifier les nouveaux fichiers v4.3.0
    new_files_v430 = [
        "COMMIT_MESSAGE_v4.3.0.md",
        "docs/AUTO_HOOKS_v4.3.0.md",
        "config/after_effects_mapping_P02.json",
        "config/after_effects_mapping_P03.json",
        "tools/after_effects_generator_v2/generate_ae_projects_v3.py"
    ]
    
    print(f"\n🆕 Vérification des nouveaux fichiers v4.3.0:")
    missing_new_files = []
    
    for file_path_str in new_files_v430:
        file_path = Path(file_path_str)
        if file_path.exists():
            print(f"   ✅ {file_path}")
        else:
            print(f"   ❌ {file_path} - MANQUANT")
            missing_new_files.append(str(file_path))
    
    # Résumé final
    print(f"\n📊 RÉSUMÉ DE VALIDATION")
    print("=" * 60)
    
    if all_issues or missing_new_files:
        print(f"❌ Validation ÉCHOUÉE")
        
        if all_issues:
            print(f"\n📋 Problèmes de version détectés:")
            for file_path, issues in all_issues.items():
                print(f"   {file_path}:")
                for issue in issues:
                    print(f"     - {issue}")
        
        if missing_new_files:
            print(f"\n🆕 Fichiers v4.3.0 manquants:")
            for file_path in missing_new_files:
                print(f"   - {file_path}")
                
        return False
    else:
        print(f"✅ Validation RÉUSSIE")
        print(f"   Toute la documentation est à jour pour v{current_version}")
        return True

def generate_documentation_report():
    """Génère un rapport de documentation"""
    current_version = load_version_from_config()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    report = f"""# 📚 Rapport de Documentation PostFlow v{current_version}

**Généré le**: {timestamp}

## ✅ Documentation mise à jour

### 📄 Fichiers principaux
- ✅ README.md - Version {current_version}
- ✅ CHANGELOG.md - Historique complet
- ✅ COMMIT_MESSAGE_v4.3.0.md - Message de commit

### 🔧 Documentation technique
- ✅ docs/AFTER_EFFECTS_GENERATOR.md - Générateur v3.0
- ✅ docs/AUTO_HOOKS_v4.3.0.md - Système d'hooks
- ✅ docs/DISCORD_INTEGRATION_REPORT.md - Intégration Discord
- ✅ docs/REPOSITORY_STRUCTURE.md - Structure repository

### 🆕 Nouveaux fichiers v4.3.0
- ✅ config/after_effects_mapping_P02.json
- ✅ config/after_effects_mapping_P03.json  
- ✅ tools/after_effects_generator_v2/generate_ae_projects_v3.py

## 🚀 Prêt pour commit et publication

La documentation est complète et à jour pour PostFlow v{current_version}.
"""
    
    report_path = Path("docs/DOCUMENTATION_REPORT_v4.3.0.md")
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"\n📄 Rapport généré: {report_path}")

if __name__ == "__main__":
    success = validate_documentation()
    
    if success:
        generate_documentation_report()
        print(f"\n🎉 Documentation PostFlow v4.3.0 validée avec succès!")
    else:
        print(f"\n⚠️  Veuillez corriger les problèmes avant de continuer.")
        exit(1)
