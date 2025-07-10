#!/usr/bin/env python3
"""
Analyse du code obsolète dans src/
Identifie les fichiers non utilisés ou obsolètes
"""

import os
import ast
import re
from pathlib import Path
from typing import Dict, List, Set, Tuple

def analyze_imports_in_file(file_path: Path) -> Set[str]:
    """Analyse les imports dans un fichier Python."""
    imports = set()
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Parse AST pour les imports
        try:
            tree = ast.parse(content)
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        imports.add(alias.name)
                elif isinstance(node, ast.ImportFrom):
                    if node.module:
                        imports.add(node.module)
        except:
            pass
        
        # Regex pour capturer d'autres patterns d'import
        import_patterns = [
            r'from\s+([a-zA-Z_][a-zA-Z0-9_.]*)\s+import',
            r'import\s+([a-zA-Z_][a-zA-Z0-9_.]*)',
        ]
        
        for pattern in import_patterns:
            matches = re.findall(pattern, content)
            imports.update(matches)
            
    except Exception as e:
        print(f"Erreur lecture {file_path}: {e}")
    
    return imports

def find_python_files(directory: Path) -> List[Path]:
    """Trouve tous les fichiers Python dans un répertoire."""
    python_files = []
    for root, dirs, files in os.walk(directory):
        # Ignorer les dossiers de cache
        dirs[:] = [d for d in dirs if d not in ['__pycache__', '.git', 'node_modules']]
        
        for file in files:
            if file.endswith('.py'):
                python_files.append(Path(root) / file)
    
    return python_files

def analyze_obsolete_code():
    """Analyse le code obsolète dans src/."""
    
    print("🔍 Analyse du code obsolète dans src/...")
    print("=" * 60)
    
    src_dir = Path(__file__).parent.parent / "src"
    project_root = Path(__file__).parent.parent
    
    # Tous les fichiers Python du projet
    all_python_files = find_python_files(project_root)
    
    # Tous les imports utilisés dans le projet
    all_imports = set()
    for file_path in all_python_files:
        imports = analyze_imports_in_file(file_path)
        all_imports.update(imports)
    
    # Modules à analyser dans src/
    modules_to_check = [
        "src.frameio_oauth",
        "frameio_oauth", 
        "src.integrations.discord_legacy",
        "discord_legacy",
        "src.integrations.lucidlink",
        "lucidlink",
        "src.integrations.after_effects",
        "after_effects",
        "review_workflow"
    ]
    
    # Fichiers suspects dans src/
    suspicious_files = [
        src_dir / "frameio_oauth.py",
        src_dir / "integrations" / "discord_legacy.py",
        src_dir / "integrations" / "lucidlink.py", 
        src_dir / "integrations" / "after_effects.py"
    ]
    
    print("📋 ANALYSE DES MODULES POTENTIELLEMENT OBSOLÈTES:")
    print("-" * 60)
    
    obsolete_modules = []
    used_modules = []
    
    for module in modules_to_check:
        is_used = any(module in imp for imp in all_imports)
        
        if is_used:
            used_modules.append(module)
            print(f"✅ UTILISÉ   - {module}")
        else:
            obsolete_modules.append(module)
            print(f"❌ OBSOLÈTE  - {module}")
    
    print(f"\n📊 ANALYSE DES FICHIERS SUSPECTS:")
    print("-" * 60)
    
    for file_path in suspicious_files:
        if file_path.exists():
            size_kb = file_path.stat().st_size / 1024
            
            # Vérifier si le fichier est importé
            relative_path = file_path.relative_to(project_root)
            module_patterns = [
                str(relative_path).replace('/', '.').replace('.py', ''),
                str(relative_path).replace('/', '.').replace('.py', '').replace('src.', ''),
                file_path.stem
            ]
            
            is_imported = any(any(pattern in imp for imp in all_imports) for pattern in module_patterns)
            
            status = "✅ UTILISÉ" if is_imported else "❌ OBSOLÈTE"
            print(f"{status} - {relative_path} ({size_kb:.1f} KB)")
            
            if not is_imported:
                print(f"   💡 Candidat pour suppression")
        else:
            print(f"❓ ABSENT   - {file_path}")
    
    # Analyse spécifique des dossiers
    print(f"\n📁 ANALYSE DES DOSSIERS:")
    print("-" * 60)
    
    folders_to_check = [
        src_dir / "exporters",
        src_dir / "models", 
        src_dir / "parsers",
        src_dir / "core"
    ]
    
    for folder in folders_to_check:
        if folder.exists():
            py_files = list(folder.glob("*.py"))
            total_size = sum(f.stat().st_size for f in py_files) / 1024
            
            # Vérifier l'utilisation des fichiers dans le dossier
            used_files = 0
            for py_file in py_files:
                if py_file.name == "__init__.py":
                    continue
                    
                module_name = py_file.stem
                is_used = any(module_name in imp for imp in all_imports)
                if is_used:
                    used_files += 1
            
            usage_rate = (used_files / max(len(py_files) - 1, 1)) * 100 if py_files else 0
            
            if usage_rate < 50:
                status = "⚠️  SOUS-UTILISÉ"
            elif usage_rate < 20:
                status = "❌ OBSOLÈTE"
            else:
                status = "✅ UTILISÉ"
                
            print(f"{status} - {folder.name}/ ({len(py_files)} fichiers, {total_size:.1f} KB, {usage_rate:.0f}% utilisé)")
    
    # Recommandations
    print(f"\n🎯 RECOMMANDATIONS:")
    print("=" * 60)
    
    if obsolete_modules:
        print("🗑️  FICHIERS À SUPPRIMER :")
        for module in obsolete_modules:
            if "frameio_oauth" in module:
                print(f"   • src/frameio_oauth.py - Remplacé par src/integrations/frameio/oauth_auth.py")
            elif "discord_legacy" in module:
                print(f"   • src/integrations/discord_legacy.py - Remplacé par src/integrations/discord/")
            elif "after_effects" in module and "after_effects" not in str(used_modules):
                print(f"   • src/integrations/after_effects.py - Non utilisé dans le pipeline actuel")
    
    print("\n📦 ARCHIVAGE RECOMMANDÉ :")
    print("   • Déplacer les fichiers obsolètes vers archive/legacy_code/")
    print("   • Garder la documentation des modules supprimés")
    print("   • Effectuer des tests après suppression")
    
    print(f"\n✨ BÉNÉFICES DU NETTOYAGE :")
    total_obsolete_size = sum(f.stat().st_size for f in suspicious_files if f.exists() and not any(f.stem in imp for imp in all_imports))
    print(f"   • Réduction de la taille du code : {total_obsolete_size / 1024:.1f} KB")
    print(f"   • Simplification de la maintenance")
    print(f"   • Clarification de l'architecture")

if __name__ == "__main__":
    analyze_obsolete_code()
