#!/usr/bin/env python3
"""
­ƒÄ¼ RL PostFlow - Validation Chemins En Dur
==========================================

V├®rifie qu'il n'y a pas de chemins hardcod├®s probl├®matiques
dans les d├®pendances de main.py

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
    Analyse le code pour d├®tecter les chemins hardcod├®s probl├®matiques
    """
    
    print("\n" + "="*80)
    print("­ƒöì ANALYSE DES CHEMINS EN DUR - PostFlow")
    print("="*80)
    
    # Patterns de chemins hardcod├®s ├á d├®tecter
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
    
    # Fichiers ├á analyser (d├®pendances de main.py)
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
    
    # Fichiers l├®gitimes (contiennent des chemins pour la conversion)
    legitimate_files = {
        "src/utils/cross_platform_paths.py": "Conversion automatique cross-platform",
        "src/utils/lucidlink_utils.py": "D├®tection LucidLink multi-plateforme"
    }
    
    print(f"­ƒôï Analyse de {len(files_to_check)} fichiers critiques...")
    print(f"Ô£à Fichiers l├®gitimes exclus: {len(legitimate_files)}")
    
    issues_found = []
    files_analyzed = 0
    
    for file_path in files_to_check:
        full_path = Path(file_path)
        
        if not full_path.exists():
            print(f"ÔÜá´©Å Fichier non trouv├®: {file_path}")
            continue
            
        files_analyzed += 1
        
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            file_issues = check_file_for_hardcoded_paths(full_path, content, hardcoded_patterns)
            
            if file_issues:
                issues_found.extend(file_issues)
                print(f"ÔØî {file_path}: {len(file_issues)} probl├¿me(s)")
            else:
                print(f"Ô£à {file_path}: OK")
                
        except Exception as e:
            print(f"ÔØî Erreur lecture {file_path}: {e}")
    
    # R├®sum├® des r├®sultats
    print(f"\n­ƒôè R├ëSULTATS DE L'ANALYSE:")
    print("-" * 40)
    print(f"­ƒôü Fichiers analys├®s: {files_analyzed}")
    print(f"­ƒÜ¿ Probl├¿mes trouv├®s: {len(issues_found)}")
    
    if issues_found:
        print(f"\nÔØî CHEMINS EN DUR D├ëTECT├ëS:")
        print("-" * 50)
        
        for issue in issues_found:
            print(f"­ƒôä {issue['file']}")
            print(f"   Ligne {issue['line']}: {issue['pattern']}")
            print(f"   Code: {issue['code'][:80]}...")
            print()
    else:
        print(f"\n­ƒÄë AUCUN CHEMIN EN DUR PROBL├ëMATIQUE D├ëTECT├ë !")
        print("Ô£à Le code est correctement cross-platform")
    
    # V├®rifier les fichiers l├®gitimes
    print(f"\n­ƒöì V├ëRIFICATION FICHIERS L├ëGITIMES:")
    print("-" * 45)
    
    for file_path, description in legitimate_files.items():
        if Path(file_path).exists():
            print(f"Ô£à {file_path}: {description}")
        else:
            print(f"ÔÜá´©Å {file_path}: Non trouv├®")
    
    return len(issues_found) == 0


def check_file_for_hardcoded_paths(file_path: Path, content: str, patterns: Dict[str, List[str]]) -> List[Dict]:
    """
    V├®rifie un fichier pour les chemins hardcod├®s
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
                    # Exclure les patterns de d├®tection l├®gitimes
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
    D├®termine si un pattern est l├®gitime (fait partie du syst├¿me de conversion)
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
    V├®rifie que l'int├®gration cross-platform est correctement utilis├®e
    """
    
    print(f"\n­ƒöº V├ëRIFICATION INT├ëGRATION CROSS-PLATFORM:")
    print("-" * 50)
    
    # V├®rifier que les modules utilisent CrossPlatformPathManager
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
                    print(f"Ô£à {file_path}: Int├®gration cross-platform OK")
                else:
                    print(f"ÔÜá´©Å {file_path}: Int├®gration cross-platform manquante")
                    
            except Exception as e:
                print(f"ÔØî Erreur lecture {file_path}: {e}")
        else:
            print(f"ÔÜá´©Å {file_path}: Non trouv├®")
    
    print(f"\n­ƒôè {len(files_with_integration)}/{len(integration_files)} fichiers int├®gr├®s")
    
    return len(files_with_integration) == len(integration_files)


def main():
    """Point d'entr├®e principal"""
    
    print("­ƒÄ¼ D├®marrage de l'analyse des chemins en dur...")
    
    try:
        # Analyse des chemins hardcod├®s
        no_hardcoded_paths = analyze_hardcoded_paths()
        
        # V├®rification de l'int├®gration cross-platform  
        integration_ok = verify_cross_platform_integration()
        
        # R├®sultat final
        print(f"\n" + "="*80)
        print("­ƒôï R├ëSUM├ë FINAL")
        print("="*80)
        
        if no_hardcoded_paths and integration_ok:
            print("­ƒÄë VALIDATION R├ëUSSIE !")
            print("Ô£à Aucun chemin en dur probl├®matique")
            print("Ô£à Int├®gration cross-platform compl├¿te")
            print("Ô£à Code pr├¬t pour d├®ploiement multi-plateforme")
            return True
        else:
            print("ÔØî VALIDATION ├ëCHOU├ëE !")
            if not no_hardcoded_paths:
                print("ÔØî Chemins en dur d├®tect├®s")
            if not integration_ok:
                print("ÔØî Int├®gration cross-platform incompl├¿te")
            return False
        
    except Exception as e:
        print(f"\nÔØî Erreur lors de la validation: {e}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
