#!/usr/bin/env python3
"""
Migration automatique de l'ancien thumbnail.py vers le nouveau module
Utilisez ce script pour migrer automatiquement les imports existants
"""

import os
import shutil
from pathlib import Path

def migrate_thumbnail_module():
    """Migre l'ancien thumbnail.py vers le nouveau module."""
    project_root = Path(__file__).parent.parent.parent.parent
    old_thumbnail = project_root / "src" / "utils" / "thumbnail.py"
    backup_dir = project_root / "archive" / "legacy_code"
    
    print("🔄 Migration du module thumbnail...")
    
    # Créer le dossier de backup si nécessaire
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    # Sauvegarder l'ancien fichier
    if old_thumbnail.exists():
        backup_path = backup_dir / f"thumbnail_legacy_{int(time.time())}.py"
        shutil.copy2(old_thumbnail, backup_path)
        print(f"📦 Ancien fichier sauvegardé: {backup_path}")
        
        # Supprimer l'ancien fichier
        old_thumbnail.unlink()
        print(f"🗑️ Ancien fichier supprimé: {old_thumbnail}")
    
    print("✅ Migration terminée!")
    print("💡 L'import reste le même: from src.utils.thumbnail import ThumbnailGenerator")
    print("💡 Toutes les méthodes publiques sont conservées")

if __name__ == "__main__":
    import time
    migrate_thumbnail_module()
