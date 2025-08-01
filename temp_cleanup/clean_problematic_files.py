#!/usr/bin/env python3
"""
Script de nettoyage des fichiers JSON problématiques
Supprime les entrées des Plans 304 et 306 pour permettre le retraitement
"""

import json
import shutil
from pathlib import Path
from datetime import datetime

def backup_file(file_path):
    """Créer une sauvegarde du fichier"""
    backup_path = file_path.with_suffix(f'.backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json')
    shutil.copy2(file_path, backup_path)
    print(f"✅ Sauvegarde créée: {backup_path}")
    return backup_path

def clean_uploads_tracking():
    """Nettoyer le fichier uploads_tracking.json"""
    file_path = Path("data/uploads_tracking.json")
    
    if not file_path.exists():
        print(f"❌ Fichier non trouvé: {file_path}")
        return
    
    # Sauvegarde
    backup_path = backup_file(file_path)
    
    # Charger les données
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    original_count = len(data.get('uploads', {}))
    uploads_to_remove = []
    
    # Identifier les uploads à supprimer
    for upload_id, upload_data in data.get('uploads', {}).items():
        shot_id = upload_data.get('shot_id', '')
        
        # Supprimer les Plans 304 et 306
        if shot_id in ['UNDLM_00304', 'UNDLM_00306']:
            uploads_to_remove.append(upload_id)
            print(f"🗑️ Marqué pour suppression: {upload_id} - {shot_id}")
    
    # Supprimer les entrées
    for upload_id in uploads_to_remove:
        del data['uploads'][upload_id]
    
    # Mettre à jour les métadonnées
    data['last_updated'] = datetime.now().isoformat()
    data['cleaned_at'] = datetime.now().isoformat()
    data['cleaned_items'] = len(uploads_to_remove)
    
    # Sauvegarder
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    new_count = len(data.get('uploads', {}))
    
    print(f"✅ Nettoyage terminé:")
    print(f"   📊 Uploads avant: {original_count}")
    print(f"   📊 Uploads après: {new_count}")
    print(f"   🗑️ Supprimés: {len(uploads_to_remove)}")
    print(f"   💾 Sauvegarde: {backup_path}")

def clean_pipeline_status():
    """Nettoyer le fichier pipeline_status.json"""
    file_path = Path("data/pipeline_status.json")
    
    if not file_path.exists():
        print(f"❌ Fichier non trouvé: {file_path}")
        return
    
    # Sauvegarde
    backup_path = backup_file(file_path)
    
    # Charger les données
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    original_count = len(data.get('shots', {}))
    shots_to_remove = []
    
    # Identifier les shots à supprimer
    for shot_key, shot_data in data.get('shots', {}).items():
        shot_id = shot_data.get('shot_id', '')
        
        # Supprimer les Plans 304 et 306
        if shot_id in ['UNDLM_00304', 'UNDLM_00306']:
            shots_to_remove.append(shot_key)
            print(f"🗑️ Marqué pour suppression: {shot_key} - {shot_id}")
    
    # Supprimer les entrées
    for shot_key in shots_to_remove:
        del data['shots'][shot_key]
    
    # Mettre à jour les métadonnées
    data['last_updated'] = datetime.now().isoformat()
    data['cleaned_at'] = datetime.now().isoformat()
    data['cleaned_items'] = len(shots_to_remove)
    
    # Sauvegarder
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    new_count = len(data.get('shots', {}))
    
    print(f"✅ Nettoyage pipeline_status terminé:")
    print(f"   📊 Shots avant: {original_count}")
    print(f"   📊 Shots après: {new_count}")
    print(f"   🗑️ Supprimés: {len(shots_to_remove)}")
    print(f"   💾 Sauvegarde: {backup_path}")

def main():
    """Fonction principale"""
    print("🧹 NETTOYAGE DES FICHIERS JSON PROBLÉMATIQUES")
    print("=" * 60)
    print("Suppression des Plans 304 et 306 pour permettre le retraitement")
    print()
    
    # Nettoyer uploads_tracking.json
    print("📋 Nettoyage uploads_tracking.json...")
    clean_uploads_tracking()
    print()
    
    # Nettoyer pipeline_status.json
    print("📊 Nettoyage pipeline_status.json...")
    clean_pipeline_status()
    print()
    
    print("✅ NETTOYAGE TERMINÉ")
    print("🔄 Les Plans 304 et 306 pourront maintenant être re-détectés et retraités")

if __name__ == "__main__":
    main()
