#!/usr/bin/env python3
"""
Script de préparation pour commit v4.3.0
Nettoie, organise et prépare le repository pour le commit/push
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def run_command(cmd, description):
    """Exécute une commande et affiche le résultat."""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=".")
        if result.returncode == 0:
            print(f"✅ {description} - OK")
            if result.stdout.strip():
                print(f"   {result.stdout.strip()}")
        else:
            print(f"❌ {description} - ERREUR")
            print(f"   {result.stderr.strip()}")
        return result.returncode == 0
    except Exception as e:
        print(f"❌ {description} - EXCEPTION: {e}")
        return False

def check_version_consistency():
    """Vérifie la cohérence des versions dans tous les fichiers."""
    print("🔍 Vérification de la cohérence des versions...")
    
    # Lire la version depuis pipeline_config.json
    with open("pipeline_config.json", "r", encoding="utf-8") as f:
        config = json.load(f)
        version = config["project_info"]["version"]
        version_name = config["project_info"]["version_name"]
    
    print(f"   Version trouvée: {version} - {version_name}")
    
    # Vérifier README.md
    with open("README.md", "r", encoding="utf-8") as f:
        readme_content = f.read()
        if f"Version-{version}" in readme_content:
            print(f"✅ README.md - Version {version} trouvée")
        else:
            print(f"⚠️ README.md - Version {version} NON trouvée")
    
    # Vérifier CHANGELOG.md
    with open("CHANGELOG.md", "r", encoding="utf-8") as f:
        changelog_content = f.read()
        if f"[{version}]" in changelog_content:
            print(f"✅ CHANGELOG.md - Version {version} trouvée")
        else:
            print(f"⚠️ CHANGELOG.md - Version {version} NON trouvée")
    
    return version, version_name

def prepare_commit():
    """Prépare le repository pour le commit."""
    print("=" * 60)
    print("🚀 PRÉPARATION COMMIT v4.3.0")
    print("=" * 60)
    
    # 1. Vérifier la cohérence des versions
    version, version_name = check_version_consistency()
    
    # 2. Vérifier l'état du git
    print("\\n📊 État actuel du repository:")
    run_command("git status --porcelain", "Vérification git status")
    
    # 3. Ajouter les fichiers importants
    important_files = [
        "README.md",
        "CHANGELOG.md", 
        "COMMIT_MESSAGE_v4.3.0.md",
        "pipeline_config.json",
        "src/integrations/frameio/webhook_manager.py",
        "src/integrations/frameio/share_manager.py",
        "src/utils/auto_hooks.py",
        "scripts/analyze_gsheets_data.py",
        "tools/after_effects_generator_v2/generate_ae_projects_v3.py",
        "config/after_effects_mapping_P02.json",
        "config/after_effects_mapping_P03.json"
    ]
    
    print("\\n📁 Ajout des fichiers principaux...")
    for file in important_files:
        if os.path.exists(file):
            run_command(f"git add {file}", f"Ajout {file}")
        else:
            print(f"⚠️ Fichier non trouvé: {file}")
    
    # 4. Afficher les fichiers stagés
    print("\\n📋 Fichiers préparés pour commit:")
    run_command("git diff --cached --name-only", "Liste des fichiers stagés")
    
    # 5. Préparer le message de commit
    commit_message = f"""🎬 PostFlow v{version} - {version_name}

✨ Nouvelles fonctionnalités:
• Discord: Correction affichage versions + déduplication notifications
• After Effects: Générateur v3 avec support configurations P02/P03  
• CSV Analysis: Filtrage par priorité avec export JSON séparé

🔧 Corrections:
• Fix authentification Frame.io share links (variables environnement)
• Élimination doublons notifications Discord (cache intelligent)
• Gestion configurations séparées P02/P03 sans écrasement

📊 Production Ready:
• P02_ALL: 71 plans configurés
• P03_ALL: 21 plans configurés  
• Workflow After Effects complet validé

Version: v{version}
Build: Production Ready
Date: 2025-08-01"""
    
    print("\\n📝 Message de commit préparé:")
    print("-" * 40)
    print(commit_message)
    print("-" * 40)
    
    # 6. Proposer le commit
    print("\\n🎯 PRÊT POUR COMMIT!")
    print("\\nCommandes suggérées:")
    print(f'git commit -m "{commit_message.split()[0]} {commit_message.split()[1]} {commit_message.split()[2]}"')
    print("git push origin main")
    
    return True

if __name__ == "__main__":
    prepare_commit()
