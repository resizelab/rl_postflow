#!/usr/bin/env python3
"""
Script d'installation des dépendances de production PostFlow
"""

import subprocess
import sys
import os
from pathlib import Path

def install_python_dependencies():
    """Installer les dépendances Python."""
    print("📦 Installation des dépendances Python...")
    
    # Installer depuis requirements.txt
    requirements_file = Path("requirements.txt")
    if requirements_file.exists():
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", str(requirements_file)])
    
    # Dépendances spécifiques à la production
    production_deps = [
        "watchdog>=3.0.0",  # File watcher
        "aiofiles>=23.0.0",  # Async file operations
        "pillow>=10.0.0",    # Image processing
    ]
    
    for dep in production_deps:
        subprocess.run([sys.executable, "-m", "pip", "install", dep])
    
    print("✅ Dépendances Python installées")


def check_ffmpeg():
    """Vérifier la présence de FFmpeg."""
    print("🎬 Vérification de FFmpeg...")
    
    try:
        result = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ FFmpeg disponible")
            return True
        else:
            print("❌ FFmpeg non trouvé")
            return False
    except FileNotFoundError:
        print("❌ FFmpeg non installé")
        return False


def setup_directories():
    """Créer les répertoires nécessaires."""
    print("📁 Création des répertoires...")
    
    directories = [
        "logs",
        "output",
        "output/thumbnails",
        "temp",
        "backups"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ {directory}/")
    
    print("✅ Répertoires créés")


def setup_config():
    """Créer la configuration par défaut."""
    print("⚙️ Configuration par défaut...")
    
    config_dir = Path("config")
    config_dir.mkdir(exist_ok=True)
    
    # Créer le fichier de configuration par défaut
    try:
        # Importer et créer la configuration
        sys.path.insert(0, str(Path(__file__).parent.parent / "src"))
        from src.utils.config import ConfigManager
        
        config = ConfigManager()
        config.create_default_config()
        
        print("✅ Configuration par défaut créée")
        print("📝 Éditez config/integrations.json avec vos paramètres")
        
    except Exception as e:
        print(f"❌ Erreur création configuration: {e}")


def main():
    """Point d'entrée principal."""
    print("🚀 Installation PostFlow Production")
    print("="*50)
    
    # Installation des dépendances
    install_python_dependencies()
    
    # Vérification de FFmpeg
    ffmpeg_ok = check_ffmpeg()
    if not ffmpeg_ok:
        print("\n⚠️ FFmpeg requis pour les thumbnails")
        print("🍎 macOS: brew install ffmpeg")
        print("🐧 Linux: sudo apt-get install ffmpeg")
    
    # Création des répertoires
    setup_directories()
    
    # Configuration par défaut
    setup_config()
    
    print("\n" + "="*50)
    print("✅ Installation terminée")
    print("="*50)
    
    print("\n📋 PROCHAINES ÉTAPES:")
    print("1. Éditez config/integrations.json avec vos paramètres")
    print("2. Testez avec: python scripts/test_production_workflow.py")
    print("3. Lancez en production: python scripts/production.py")
    
    if not ffmpeg_ok:
        print("\n⚠️ N'oubliez pas d'installer FFmpeg pour les thumbnails")


if __name__ == "__main__":
    main()
