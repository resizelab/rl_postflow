#!/usr/bin/env python3
"""
🎬 RL PostFlow - Validation Chemins En Dur
==========================================

Vérifie qu'il n'y a pas de chemins hardcodés problématiques
dans les dépendances de main.py

Version: 4.1.1
Date: 12 juillet 2025
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple, Set

def analyze_hardcoded_paths():
    """
    Analyse le code pour détecter les chemins hardcodés problématiques
    """
    
    print("\n" + "="*80)
    print("🔍 ANALYSE DES CHEMINS EN DUR - PostFlow")
    print("="*80)
    
    # Patterns de chemins hardcodés à détecter
    hardcoded_patterns = {
        'windows_paths': [
            r'["\']E:\\\\[^"\']*["\']',
            r'["\']C:\\\\[^"\']*["\']',
            r'["\']D:\\\\[^"\']*["\']',
        ],
        'macos_paths': [
            r'["\'][^"\']*\/Volumes\/[^"\']*["\']',
        ],
        'linux_paths': [
            r'["\'][^"\']*\/mnt\/[^"\']*["\']',
            r'["\'][^"\']*\/home\/[^"\']*["\']',
        ]
    }
    
    # Fichiers à analyser (dépendances de main.py)
    files_to_check = [
        "main.py",
        "src/bootstrap/__init__.py",
        "src/bootstrap/config_loader.py",
        "src/bootstrap/frameio_initializer.py", 
        "src/bootstrap/watcher_initializer.py",
        "src/bootstrap/dashboard_initializer.py",
        "src/bootstrap/infrastructure_initializer.py",
        "src/bootstrap/postflow_runner.py",
        "src/bootstrap/sync_checker.py",
        "src/utils/error_handler.py",
        "src/integrations/review_workflow.py",
        "src/utils/file_watcher.py",
    ]
    
    # Fichiers légitimes (contiennent des chemins pour la conversion)
    legitimate_files = {
        "src/utils/cross_platform_paths.py": "Conversion automatique cross-platform",
        "src/utils/lucidlink_utils.py": "Détection LucidLink multi-plateforme"
    }
    
    print(f"📋 Analyse de {len(files_to_check)} fichiers critiques...")
    print(f"✅ Fichiers légitimes exclus: {len(legitimate_files)}")
    
    issues_found = []
    files_analyzed = 0
    
    for file_path in files_to_check:
        full_path = Path(file_path)
        
        if not full_path.exists():
            print(f"⚠️ Fichier non trouvé: {file_path}")
            continue
            
        files_analyzed += 1
        
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            file_issues = check_file_for_hardcoded_paths(full_path, content, hardcoded_patterns)
            
            if file_issues:
                issues_found.extend(file_issues)
                print(f"❌ {file_path}: {len(file_issues)} problème(s)")
            else:
                print(f"✅ {file_path}: OK")
                
        except Exception as e:
            print(f"❌ Erreur lecture {file_path}: {e}")
    
    # Résumé des résultats
    print(f"\n📊 RÉSULTATS DE L'ANALYSE:")
    print("-" * 40)
    print(f"📁 Fichiers analysés: {files_analyzed}")
    print(f"🚨 Problèmes trouvés: {len(issues_found)}")
    
    if issues_found:
        print(f"\n❌ CHEMINS EN DUR DÉTECTÉS:")
        print("-" * 50)
        
        for issue in issues_found:
            print(f"📄 {issue['file']}")
            print(f"   Ligne {issue['line']}: {issue['pattern']}")
            print(f"   Code: {issue['code'][:80]}...")
            print()
    else:
        print(f"\n🎉 AUCUN CHEMIN EN DUR PROBLÉMATIQUE DÉTECTÉ !")
        print("✅ Le code est correctement cross-platform")
    
    # Vérifier les fichiers légitimes
    print(f"\n🔍 VÉRIFICATION FICHIERS LÉGITIMES:")
    print("-" * 45)
    
    for file_path, description in legitimate_files.items():
        if Path(file_path).exists():
            print(f"✅ {file_path}: {description}")
        else:
            print(f"⚠️ {file_path}: Non trouvé")
    
    return len(issues_found) == 0


def check_file_for_hardcoded_paths(file_path: Path, content: str, patterns: Dict[str, List[str]]) -> List[Dict]:
    """
    Vérifie un fichier pour les chemins hardcodés
    """
    issues = []
    lines = content.split('\n')
    
    for line_num, line in enumerate(lines, 1):
        # Ignorer les commentaires et docstrings
        if line.strip().startswith('#') or '"""' in line or "'''" in line:
            continue
            
        # Ignorer les imports
        if line.strip().startswith('import ') or line.strip().startswith('from '):
            continue
        
        for pattern_type, pattern_list in patterns.items():
            for pattern in pattern_list:
                matches = re.findall(pattern, line)
                
                for match in matches:
                    # Exclure les patterns de détection légitimes
                    if is_legitimate_pattern(match, line):
                        continue
                        
                    issues.append({
                        'file': str(file_path),
                        'line': line_num,
                        'pattern': match,
                        'type': pattern_type,
                        'code': line.strip()
                    })
    
    return issues


def is_legitimate_pattern(match: str, line: str) -> bool:
    """
    Détermine si un pattern est légitime (fait partie du système de conversion)
    """
    legitimate_indicators = [
        'path_str.replace',
        'path_str.startswith',
        'candidates',
        'windows_candidates',
        'macos_candidates', 
        'linux_candidates',
        'for candidate in',
        'CrossPlatformPathManager',
        'path_manager',
        'build_lucidlink_path',
        'get_lucidlink_base_path'
    ]
    
    for indicator in legitimate_indicators:
        if indicator in line:
            return True
    
    return False


def verify_cross_platform_integration():
    """
    Vérifie que l'intégration cross-platform est correctement utilisée
    """
    
    print(f"\n🔧 VÉRIFICATION INTÉGRATION CROSS-PLATFORM:")
    print("-" * 50)
    
    # Vérifier que les modules utilisent CrossPlatformPathManager
    files_with_integration = []
    
    integration_files = [
        "src/bootstrap/watcher_initializer.py",
        "src/bootstrap/postflow_runner.py", 
        "src/bootstrap/sync_checker.py",
        "src/integrations/review_workflow.py",
        "src/utils/file_watcher.py"
    ]
    
    for file_path in integration_files:
        if Path(file_path).exists():
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if 'CrossPlatformPathManager' in content:
                    files_with_integration.append(file_path)
                    print(f"✅ {file_path}: Intégration cross-platform OK")
                else:
                    print(f"⚠️ {file_path}: Intégration cross-platform manquante")
                    
            except Exception as e:
                print(f"❌ Erreur lecture {file_path}: {e}")
        else:
            print(f"⚠️ {file_path}: Non trouvé")
    
    print(f"\n📊 {len(files_with_integration)}/{len(integration_files)} fichiers intégrés")
    
    return len(files_with_integration) == len(integration_files)


def main():
    """Point d'entrée principal"""
    
    print("🎬 Démarrage de l'analyse des chemins en dur...")
    
    try:
        # Analyse des chemins hardcodés
        no_hardcoded_paths = analyze_hardcoded_paths()
        
        # Vérification de l'intégration cross-platform  
        integration_ok = verify_cross_platform_integration()
        
        # Résultat final
        print(f"\n" + "="*80)
        print("📋 RÉSUMÉ FINAL")
        print("="*80)
        
        if no_hardcoded_paths and integration_ok:
            print("🎉 VALIDATION RÉUSSIE !")
            print("✅ Aucun chemin en dur problématique")
            print("✅ Intégration cross-platform complète")
            print("✅ Code prêt pour déploiement multi-plateforme")
            return True
        else:
            print("❌ VALIDATION ÉCHOUÉE !")
            if not no_hardcoded_paths:
                print("❌ Chemins en dur détectés")
            if not integration_ok:
                print("❌ Intégration cross-platform incomplète")
            return False
        
    except Exception as e:
        print(f"\n❌ Erreur lors de la validation: {e}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
