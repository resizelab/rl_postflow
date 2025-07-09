#!/usr/bin/env python3
"""
Script de nettoyage automatique pour RL PostFlow
Nettoie les fichiers temporaires, logs anciens et cache.
"""

import os
import sys
import shutil
import glob
from datetime import datetime, timedelta
from pathlib import Path

def clean_logs(logs_dir="logs", days_to_keep=7):
    """Nettoie les logs anciens."""
    print(f"🗂️ Nettoyage des logs anciens (>{days_to_keep} jours)...")
    
    if not os.path.exists(logs_dir):
        print(f"   ⚠️ Dossier {logs_dir} non trouvé")
        return
    
    cutoff_date = datetime.now() - timedelta(days=days_to_keep)
    cleaned_count = 0
    
    for log_file in Path(logs_dir).glob("*.log*"):
        if log_file.stat().st_mtime < cutoff_date.timestamp():
            log_file.unlink()
            cleaned_count += 1
    
    print(f"   ✅ {cleaned_count} fichiers de logs supprimés")

def clean_temp_files(temp_dirs=["temp", "output"]):
    """Nettoie les fichiers temporaires."""
    print("🗑️ Nettoyage des fichiers temporaires...")
    
    cleaned_count = 0
    for temp_dir in temp_dirs:
        if os.path.exists(temp_dir):
            for file_path in Path(temp_dir).glob("*"):
                if file_path.is_file():
                    file_path.unlink()
                    cleaned_count += 1
    
    print(f"   ✅ {cleaned_count} fichiers temporaires supprimés")

def clean_cache():
    """Nettoie les caches Python."""
    print("🧹 Nettoyage des caches Python...")
    
    cleaned_count = 0
    for cache_dir in Path(".").rglob("__pycache__"):
        if cache_dir.is_dir():
            shutil.rmtree(cache_dir)
            cleaned_count += 1
    
    for pyc_file in Path(".").rglob("*.pyc"):
        pyc_file.unlink()
        cleaned_count += 1
    
    print(f"   ✅ {cleaned_count} éléments de cache supprimés")

def clean_backups(backup_dirs=["backups"], days_to_keep=30):
    """Nettoie les anciens backups."""
    print(f"💾 Nettoyage des anciens backups (>{days_to_keep} jours)...")
    
    cutoff_date = datetime.now() - timedelta(days=days_to_keep)
    cleaned_count = 0
    
    for backup_dir in backup_dirs:
        if os.path.exists(backup_dir):
            for backup_file in Path(backup_dir).glob("*"):
                if backup_file.stat().st_mtime < cutoff_date.timestamp():
                    if backup_file.is_file():
                        backup_file.unlink()
                        cleaned_count += 1
                    elif backup_file.is_dir():
                        shutil.rmtree(backup_file)
                        cleaned_count += 1
    
    print(f"   ✅ {cleaned_count} backups anciens supprimés")

def reset_tracking_data():
    """Remet à zéro les données de tracking (optionnel)."""
    response = input("🔄 Voulez-vous réinitialiser les données de tracking? [y/N]: ")
    
    if response.lower() == 'y':
        tracking_file = "data/uploads_tracking.json"
        if os.path.exists(tracking_file):
            # Créer un backup avant reset
            backup_name = f"data/uploads_tracking_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            shutil.copy2(tracking_file, backup_name)
            
            # Reset du fichier
            with open(tracking_file, 'w') as f:
                f.write('''{
  "version": "1.0",
  "created_at": "''' + datetime.now().isoformat() + '''",
  "last_updated": "''' + datetime.now().isoformat() + '''",
  "uploads": {}
}''')
            
            print(f"   ✅ Tracking réinitialisé (backup: {backup_name})")
        else:
            print("   ⚠️ Fichier de tracking non trouvé")

def main():
    """Fonction principale de nettoyage."""
    print("🧽 RL PostFlow - Script de Nettoyage")
    print("=" * 40)
    
    # Vérifier qu'on est dans le bon répertoire
    if not os.path.exists("main.py") or not os.path.exists("src"):
        print("❌ Erreur: Exécutez ce script depuis la racine du projet RL PostFlow")
        sys.exit(1)
    
    try:
        clean_logs()
        clean_temp_files()
        clean_cache()
        clean_backups()
        reset_tracking_data()
        
        print("\n✅ Nettoyage terminé avec succès!")
        print("💡 Le projet est maintenant prêt pour la publication.")
        
    except Exception as e:
        print(f"❌ Erreur lors du nettoyage: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
