#!/usr/bin/env python3
"""
Script de génération automatique de l'index de documentation
"""

import os
from pathlib import Path
from datetime import datetime

def generate_docs_index():
    """Génère l'index de documentation automatiquement"""
    
    # Chemin corrigé vers le dossier docs
    docs_path = Path(__file__).parent.parent / "docs"
    
    # Structure de la documentation
    structure = {
        "guides": {
            "title": "📖 Guides d'utilisation",
            "description": "Guides pratiques pour les utilisateurs",
            "files": []
        },
        "integrations": {
            "title": "🔌 Intégrations",
            "description": "Configuration des intégrations externes",
            "files": []
        },
        "api": {
            "title": "📋 Référence API", 
            "description": "Documentation technique des modules",
            "files": []
        },
        "releases": {
            "title": "📦 Releases",
            "description": "Historique des versions et changelog",
            "files": []
        },
        "archive": {
            "title": "📁 Archive",
            "description": "Documents archivés",
            "files": []
        }
    }
    
    # Scanner les fichiers
    for category, info in structure.items():
        category_path = docs_path / category
        if category_path.exists():
            for file_path in category_path.glob("*.md"):
                info["files"].append({
                    "name": file_path.stem,
                    "path": f"{category}/{file_path.name}",
                    "title": extract_title_from_md(file_path)
                })
    
    # Fichiers racine
    root_files = []
    for file_path in docs_path.glob("*.md"):
        if file_path.name != "README.md":
            root_files.append({
                "name": file_path.stem,
                "path": file_path.name,
                "title": extract_title_from_md(file_path)
            })
    
    # Génération du contenu
    content = generate_index_content(structure, root_files)
    
    # Écriture de l'index
    index_path = docs_path / "README.md"
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Index de documentation généré : {index_path}")

def extract_title_from_md(file_path):
    """Extrait le titre principal d'un fichier Markdown"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('# '):
                    return line[2:].strip()
        return file_path.stem.replace('_', ' ').title()
    except:
        return file_path.stem.replace('_', ' ').title()

def generate_index_content(structure, root_files):
    """Génère le contenu de l'index"""
    
    content = """# 📚 Documentation RL PostFlow

## 🏠 Index de la Documentation

### 🚀 Démarrage Rapide
- [🏠 README Principal](../README.md)
"""

    # Ajouter les sections organisées
    for category, info in structure.items():
        if info["files"]:
            content += f"\n### {info['title']}\n"
            for file_info in info["files"]:
                icon = get_file_icon(file_info["name"])
                content += f"- [{icon} {file_info['title']}]({file_info['path']})\n"
    
    # Ajouter les fichiers racine
    if root_files:
        content += "\n### 🛠️ Documentation Technique\n"
        for file_info in root_files:
            icon = get_file_icon(file_info["name"])
            content += f"- [{icon} {file_info['title']}]({file_info['path']})\n"
    
    # Navigation rapide
    content += """
---

## 🎯 Navigation Rapide

### Pour les utilisateurs
- **Premier démarrage** → [Guide de démarrage](guides/QUICK_START.md)
- **Configuration** → [Configuration complète](guides/CONFIGURATION.md)
- **Problèmes** → [Dépannage](guides/TROUBLESHOOTING.md)

### Pour les développeurs
- **Architecture** → [Vue d'ensemble](ARCHITECTURE.md)
- **Développement** → [Setup développement](DEVELOPMENT.md)
- **API** → [Référence API](api/README.md)

### Pour les intégrations
- **Frame.io** → [Configuration OAuth](integrations/FRAMEIO_OAUTH.md)
- **LucidLink** → [Configuration LucidLink](integrations/LUCIDLINK_SETUP.md)
- **Discord** → [Notifications Discord](integrations/DISCORD_SETUP.md)

---

**Documentation mise à jour le : {date}**  
**Version : 4.1.0**
""".format(date=datetime.now().strftime("%d %B %Y"))
    
    return content

def get_file_icon(filename):
    """Retourne l'icône appropriée pour un fichier"""
    icons = {
        "QUICK_START": "🚀",
        "CONFIGURATION": "⚙️",
        "TROUBLESHOOTING": "🔧",
        "FRAMEIO_OAUTH": "🎬",
        "LUCIDLINK_SETUP": "🔗",
        "DISCORD_SETUP": "📢",
        "ARCHITECTURE": "🏗️",
        "DEVELOPMENT": "🔧",
        "CONTRIBUTING": "📝",
        "AUTHENTICATION": "🔐",
        "STRUCTURE": "📁",
        "UPLOAD": "📤",
        "CHANGELOG": "📖",
        "README": "📁"
    }
    return icons.get(filename, "📄")

if __name__ == "__main__":
    generate_docs_index()
