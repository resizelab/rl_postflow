#!/usr/bin/env python3
"""
Script pour supprimer les uploads problématiques de 1MB du tracking JSON
"""

import json
from pathlib import Path

# IDs des uploads problématiques (fichiers uploadés trop tôt avec 1MB)
uploads_to_remove = [
    "fe69b2f1e0b63541",  # UNDLM_00152 v002
    "cc047eed69808add",  # UNDLM_00146 v002  
    "a3dac3e8cfbd1f4b",  # UNDLM_00148 v002
]

def main():
    tracking_file = Path("data/uploads_tracking.json")
    
    if not tracking_file.exists():
        print(f"❌ Fichier {tracking_file} introuvable")
        return
    
    print(f"📖 Lecture de {tracking_file}...")
    with open(tracking_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    uploads = data.get("uploads", {})
    initial_count = len(uploads)
    
    print(f"📊 {initial_count} uploads trouvés")
    
    # Supprimer les uploads problématiques
    removed_count = 0
    for upload_id in uploads_to_remove:
        if upload_id in uploads:
            upload_info = uploads[upload_id]
            filename = upload_info.get('filename', 'Unknown')
            file_size = upload_info.get('file_size', 0)
            shot_id = upload_info.get('shot_id', 'Unknown')
            
            print(f"🗑️ Suppression: {shot_id} - {filename} ({file_size:,} bytes)")
            del uploads[upload_id]
            removed_count += 1
        else:
            print(f"⚠️ Upload {upload_id} introuvable")
    
    # Mettre à jour le timestamp
    from datetime import datetime
    data["last_updated"] = datetime.now().isoformat()
    
    final_count = len(uploads)
    print(f"✅ {removed_count} uploads supprimés")
    print(f"📊 {final_count} uploads restants")
    
    # Sauvegarder
    print(f"💾 Sauvegarde de {tracking_file}...")
    with open(tracking_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Fichier mis à jour avec succès")

if __name__ == "__main__":
    main()
