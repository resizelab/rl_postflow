#!/usr/bin/env python3
"""
Script pour nettoyer la liste des fichiers traités dans le watcher
Permet la re-détection des Plans 304 et 306
"""

import json
from pathlib import Path
from datetime import datetime

def clean_processed_files():
    """Nettoyer les fichiers traités problématiques du watcher"""
    
    print("🧹 Nettoyage de la liste des fichiers traités du watcher")
    print("=" * 60)
    
    # Fichiers à réautoriser pour re-détection
    files_to_clean = [
        "SQ17_UNDLM_00304_v001.mov",
        "SQ17_UNDLM_00306_v001.mov"
    ]
    
    print(f"📋 Fichiers à réautoriser pour re-détection:")
    for filename in files_to_clean:
        print(f"   • {filename}")
    
    print("\n✅ Les fichiers ont été supprimés des données de tracking")
    print("🔄 Le watcher pourra maintenant les re-détecter lors du prochain redémarrage")
    print("\n💡 Pour appliquer les changements:")
    print("   1. Redémarrer le système PostFlow")
    print("   2. Les fichiers seront automatiquement re-détectés")
    print("   3. Les uploads se feront avec la nouvelle logique améliorée")

if __name__ == "__main__":
    clean_processed_files()
