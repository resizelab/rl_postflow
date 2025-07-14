#!/usr/bin/env python3
"""
Script de validation de la documentation du changelog
"""

import os
import json
from datetime import datetime

def validate_changelog_completeness():
    """Valide que le changelog contient toutes les fonctionnalités récentes"""
    
    print("🔍 VALIDATION CHANGELOG v4.1.8")
    print("=" * 50)
    
    # Lire le changelog
    try:
        with open('CHANGELOG.md', 'r', encoding='utf-8') as f:
            changelog_content = f.read()
        print("✅ Changelog lu avec succès")
    except Exception as e:
        print(f"❌ Erreur lecture changelog: {e}")
        return False
    
    # Fonctionnalités à vérifier
    features_to_check = {
        "v4.1.8": [
            "After Effects Panel",
            "Auto-versioning",
            "Template system",
            "Webhook Frame.io",
            "Cross-platform"
        ],
        "v4.1.7": [
            "GoogleConnectionManager",
            "OptimizedSheetsStatusAdapter", 
            "Connexions persistantes",
            "Performance +57.2%",
            "sync_checker fix"
        ],
        "v4.1.6": [
            "Support dossiers _ALL",
            "Nomenclature étendue",
            "Format séquence"
        ],
        "v4.1.5": [
            "Emojis Discord",
            "Détection doublons",
            "Template Factory"
        ]
    }
    
    print("\n📋 Vérification fonctionnalités documentées...")
    
    missing_features = []
    
    for version, features in features_to_check.items():
        print(f"\n🔍 Version {version}:")
        
        if f"[{version}]" in changelog_content:
            print(f"  ✅ Version {version} trouvée")
            
            for feature in features:
                if feature.lower() in changelog_content.lower():
                    print(f"    ✅ {feature}")
                else:
                    print(f"    ❌ {feature} MANQUANT")
                    missing_features.append(f"{version}: {feature}")
        else:
            print(f"  ❌ Version {version} MANQUANTE")
            missing_features.extend([f"{version}: {f}" for f in features])
    
    # Vérifier les fichiers nouveaux
    print(f"\n📁 Vérification nouveaux fichiers...")
    
    new_files_expected = [
        "src/integrations/google/connection_manager.py",
        "src/integrations/google/optimized_sheets_adapter.py", 
        "tools/ae_panel_script/RL_PostFlow_Panel.jsx",
        "src/integrations/frameio/webhook_integration.py",
        "test_performance_comparison.py",
        "deploy_persistent_connections.py"
    ]
    
    for file_path in new_files_expected:
        if os.path.exists(file_path):
            print(f"  ✅ {file_path}")
        else:
            print(f"  ⚠️ {file_path} (manquant mais peut être normal)")
    
    # Résumé final
    print(f"\n" + "=" * 50)
    if not missing_features:
        print("🎉 VALIDATION RÉUSSIE !")
        print("✅ Toutes les fonctionnalités sont documentées")
        print("✅ Changelog complet et à jour")
        print("✅ Versions v4.1.5 → v4.1.8 complètes")
        return True
    else:
        print("⚠️ VALIDATION PARTIELLE")
        print(f"❌ {len(missing_features)} fonctionnalités manquantes:")
        for feature in missing_features:
            print(f"   - {feature}")
        return False

def generate_summary_stats():
    """Génère des statistiques sur le projet"""
    
    print(f"\n📊 STATISTIQUES PROJET (mise à jour {datetime.now().strftime('%Y-%m-%d %H:%M')})")
    print("=" * 60)
    
    # Compter les fichiers par type
    file_counts = {
        'Python (.py)': 0,
        'JavaScript (.jsx)': 0, 
        'JSON (.json)': 0,
        'Markdown (.md)': 0,
        'Total files': 0
    }
    
    for root, dirs, files in os.walk('.'):
        # Ignorer certains dossiers
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['__pycache__', 'node_modules']]
        
        for file in files:
            file_counts['Total files'] += 1
            
            if file.endswith('.py'):
                file_counts['Python (.py)'] += 1
            elif file.endswith('.jsx'):
                file_counts['JavaScript (.jsx)'] += 1
            elif file.endswith('.json'):
                file_counts['JSON (.json)'] += 1
            elif file.endswith('.md'):
                file_counts['Markdown (.md)'] += 1
    
    for file_type, count in file_counts.items():
        print(f"📁 {file_type}: {count}")
    
    # Taille du projet
    try:
        import subprocess
        result = subprocess.run(['git', 'ls-files'], capture_output=True, text=True)
        if result.returncode == 0:
            git_files = len(result.stdout.strip().split('\n'))
            print(f"📦 Fichiers sous Git: {git_files}")
    except:
        pass
    
    print(f"\n🚀 Statut: PostFlow v4.1.8 - Production Ready")
    print(f"📈 Performance: +57.2% amélioration Google API")
    print(f"🎬 Features: After Effects Panel + Connexions persistantes")
    print(f"🔗 Infrastructure: Webhooks Frame.io + Architecture services")

if __name__ == "__main__":
    print("🔍 VALIDATION DOCUMENTATION COMPLETE")
    print("=" * 50)
    
    success = validate_changelog_completeness()
    generate_summary_stats()
    
    if success:
        print(f"\n🎉 DOCUMENTATION VALIDATION: SUCCÈS !")
        exit(0)
    else:
        print(f"\n⚠️ DOCUMENTATION VALIDATION: À COMPLÉTER")
        exit(1)
