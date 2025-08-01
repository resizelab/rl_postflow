#!/usr/bin/env python3
"""
Script de mise à jour automatique de la version dans tous les fichiers de documentation
"""

import json
import re
from pathlib import Path
import sys
import os

# Ajouter src au path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

def load_version_from_config():
    """Charge la version depuis pipeline_config.json"""
    config_path = Path(__file__).parent.parent / "pipeline_config.json"
    
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    return config['project_info']['version'], config['project_info']['version_name']

def update_readme_version(version, version_name):
    """Met à jour la version dans le README.md"""
    readme_path = Path(__file__).parent.parent / "README.md"
    
    with open(readme_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Mettre à jour le badge de version
    content = re.sub(
        r'\[\!\[Version\]\(https://img\.shields\.io/badge/Version-[^-]+-red\.svg\)\]',
        f'[![Version](https://img.shields.io/badge/Version-{version}-red.svg)]',
        content
    )
    
    # Nettoyer les duplications dans les sections de nouveautés
    content = clean_changelog_duplications(content, version, version_name)
    
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ README.md mis à jour avec la version {version}")

def clean_changelog_duplications(content, current_version, version_name):
    """Nettoie les duplications dans le changelog"""
    
    # Template pour la version actuelle
    current_section = f"""## 🆕 Nouveautés v{current_version} - **{version_name.upper()}**

### 🔧 **Corrections Critiques Discord**
- ✅ **Version Display Fix** : Affichage correct des versions dans les notifications (shot_name + version)
- ✅ **Share Link Authentication** : Correction des erreurs 401 avec variables d'environnement
- ✅ **Message Deduplication** : Élimination des notifications en double avec cache intelligent
- ✅ **Enhanced Webhooks** : Traitement amélioré des commentaires Frame.io

### 🎨 **Workflow After Effects**
- 🎯 **After Effects Generator v3** : Support des configurations personnalisées (--config)
- 📊 **Priority-Based Generation** : Génération séparée P02 (71 plans) et P03 (21 plans)
- 🎯 **CSV Analysis Enhanced** : Filtrage par priorité et génération JSON distincte
- ✅ **Production Ready** : Scripts validés en dry-run et prêts pour génération

### 🛠️ **Améliorations Techniques**
- 🔄 **Environment Variable Consistency** : Authentification unifiée Frame.io
- 💬 **Comment Processing** : Déduplication intelligente des notifications
- 📋 **Enhanced CSV Processing** : Support priorités multiples avec export séparé
- ⚙️ **Configuration Management** : JSON configs distincts pour éviter l'écrasement"""

    # Template pour v4.2.0 (MP4 features)
    v420_section = """## 🆕 Nouveautés v4.2.0 - **MP4 DISCORD INTEGRATION & WORKFLOW ENHANCEMENT**

### 🎥 **Intégration MP4 Avancée**
- ✅ **Upload MP4 optimisé** : Support natif des formats de production
- ✅ **Workflow MP4** : Pipeline dédié pour les fichiers de montage
- ✅ **Thumbnails automatiques** : Génération preview pour Discord/Frame.io
- ✅ **Quality Control** : Validation format et résolution

### 🔗 **Améliorations Discord**
- 🎛️ **Rich Embeds** : Messages Discord enrichis avec métadonnées
- 📊 **Progress Tracking** : Notifications de progression temps réel
- 🏷️ **User Mentions** : Intégration Google Sheets pour notifier les bons utilisateurs
- 🖼️ **Visual Previews** : Aperçus automatiques dans les notifications"""

    # Trouver et remplacer la section actuelle
    pattern = rf"## 🆕 Nouveautés v{re.escape(current_version)}.*?(?=## 🆕 Nouveautés v4\.2\.0|## 🆕 Nouveautés v4\.1\.)"
    content = re.sub(pattern, current_section + "\n\n", content, flags=re.DOTALL)
    
    # Nettoyer v4.2.0 si elle existe avec du contenu dupliqué
    pattern_420 = r"## 🆕 Nouveautés v4\.2\.0.*?(?=## 🆕 Nouveautés v4\.1\.)"
    if "Version Display Fix" in content and "v4.2.0" in content:
        # Si v4.2.0 contient les mêmes éléments que la version actuelle, la remplacer
        content = re.sub(pattern_420, v420_section + "\n\n", content, flags=re.DOTALL)
    
    return content

def update_other_files(version):
    """Met à jour la version dans d'autres fichiers si nécessaire"""
    
    # Mettre à jour main.py si il contient une version hardcodée
    main_py_path = Path(__file__).parent.parent / "main.py"
    if main_py_path.exists():
        with open(main_py_path, 'r', encoding='utf-8') as f:
            main_content = f.read()
        
        # Chercher des patterns de version dans main.py
        if 'version=' in main_content or '__version__' in main_content:
            print(f"⚠️  main.py pourrait contenir une version hardcodée - vérification manuelle nécessaire")
    
    print(f"✅ Vérification des autres fichiers terminée")

def create_changelog_entry(version, version_name):
    """Crée une entrée de changelog structurée"""
    changelog_path = Path(__file__).parent.parent / "CHANGELOG.md"
    
    if not changelog_path.exists():
        # Créer un nouveau CHANGELOG
        changelog_content = f"""# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

## [v{version}] - {version_name} - 2025-08-01

### 🔧 Corrections Critiques Discord
- Version Display Fix : Affichage correct des versions dans les notifications
- Share Link Authentication : Correction des erreurs 401 avec variables d'environnement  
- Message Deduplication : Élimination des notifications en double avec cache intelligent
- Enhanced Webhooks : Traitement amélioré des commentaires Frame.io

### 🎨 Workflow After Effects
- After Effects Generator v3 : Support des configurations personnalisées (--config)
- Priority-Based Generation : Génération séparée P02 (71 plans) et P03 (21 plans) 
- CSV Analysis Enhanced : Filtrage par priorité et génération JSON distincte
- Production Ready : Scripts validés en dry-run et prêts pour génération

### 🛠️ Améliorations Techniques
- Environment Variable Consistency : Authentification unifiée Frame.io
- Comment Processing : Déduplication intelligente des notifications
- Enhanced CSV Processing : Support priorités multiples avec export séparé
- Configuration Management : JSON configs distincts pour éviter l'écrasement

## [v4.2.0] - MP4 Discord Integration - 2025-07-XX

### 🎥 Intégration MP4 Avancée
- Upload MP4 optimisé : Support natif des formats de production
- Workflow MP4 : Pipeline dédié pour les fichiers de montage
- Thumbnails automatiques : Génération preview pour Discord/Frame.io
- Quality Control : Validation format et résolution

### 🔗 Améliorations Discord
- Rich Embeds : Messages Discord enrichis avec métadonnées
- Progress Tracking : Notifications de progression temps réel
- User Mentions : Intégration Google Sheets pour notifier les bons utilisateurs
- Visual Previews : Aperçus automatiques dans les notifications
"""
        
        with open(changelog_path, 'w', encoding='utf-8') as f:
            f.write(changelog_content)
        
        print(f"✅ CHANGELOG.md créé avec la version {version}")
    else:
        print(f"✅ CHANGELOG.md existe déjà")

def main():
    """Fonction principale"""
    print("🔄 Mise à jour de la version dans tous les fichiers...")
    
    # Charger la version depuis la config
    version, version_name = load_version_from_config()
    print(f"📋 Version détectée : {version} - {version_name}")
    
    # Mettre à jour les fichiers
    update_readme_version(version, version_name)
    update_other_files(version)
    create_changelog_entry(version, version_name)
    
    print(f"\n✅ Mise à jour terminée !")
    print(f"📊 Version actuelle : {version}")
    print(f"🏷️  Nom de version : {version_name}")
    print(f"📁 Fichiers mis à jour : README.md, CHANGELOG.md")

if __name__ == "__main__":
    main()
