#!/usr/bin/env python3
"""
Script de nettoyage des uploads en double
Supprime les entrées dupliquées dans le tracking des uploads
"""

import json
import os
from datetime import datetime
from pathlib import Path

def clean_duplicate_uploads():
    """
    Nettoie les uploads en double dans le fichier de tracking
    """
    tracking_file = Path("data/uploads_tracking.json")
    
    if not tracking_file.exists():
        print("❌ Fichier de tracking non trouvé")
        return
    
    # Créer une sauvegarde
    backup_file = Path(f"data/uploads_tracking.backup_duplicates_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
    
    try:
        # Charger les données
        with open(tracking_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Sauvegarder l'original
        with open(backup_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✅ Sauvegarde créée: {backup_file}")
        
        uploads = data.get("uploads", {})
        original_count = len(uploads)
        
        # Identifier les doublons par shot_id + version
        seen_combinations = {}
        duplicates_to_remove = []
        
        for upload_id, upload_data in uploads.items():
            shot_id = upload_data.get("shot_id", "")
            version = upload_data.get("version", "")
            status = upload_data.get("status", "")
            created_at = upload_data.get("created_at", "")
            
            combination_key = f"{shot_id}_{version}"
            
            if combination_key in seen_combinations:
                # Doublon détecté
                existing_upload_id = seen_combinations[combination_key]
                existing_upload = uploads[existing_upload_id]
                existing_created_at = existing_upload.get("created_at", "")
                existing_status = existing_upload.get("status", "")
                
                print(f"\n🔍 Doublon détecté pour {shot_id} {version}:")
                print(f"   📝 Upload 1: {existing_upload_id} ({existing_status}) - {existing_created_at}")
                print(f"   📝 Upload 2: {upload_id} ({status}) - {created_at}")
                
                # Garder le plus récent ou celui avec le meilleur statut
                if status == "🎉 COMPLETED" and existing_status != "🎉 COMPLETED":
                    # Garder le nouveau (completed)
                    duplicates_to_remove.append(existing_upload_id)
                    seen_combinations[combination_key] = upload_id
                    print(f"   ✅ Garde le plus récent (completed): {upload_id}")
                elif existing_status == "🎉 COMPLETED" and status != "🎉 COMPLETED":
                    # Garder l'existant (completed)
                    duplicates_to_remove.append(upload_id)
                    print(f"   ✅ Garde l'existant (completed): {existing_upload_id}")
                elif created_at > existing_created_at:
                    # Garder le plus récent
                    duplicates_to_remove.append(existing_upload_id)
                    seen_combinations[combination_key] = upload_id
                    print(f"   ✅ Garde le plus récent: {upload_id}")
                else:
                    # Garder l'existant
                    duplicates_to_remove.append(upload_id)
                    print(f"   ✅ Garde l'existant: {existing_upload_id}")
            else:
                seen_combinations[combination_key] = upload_id
        
        # Supprimer les doublons
        for upload_id in duplicates_to_remove:
            if upload_id in uploads:
                del uploads[upload_id]
                print(f"🗑️ Supprimé: {upload_id}")
        
        # Mettre à jour les données
        data["last_updated"] = datetime.now().isoformat()
        
        # Sauvegarder le fichier nettoyé
        with open(tracking_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        final_count = len(uploads)
        removed_count = original_count - final_count
        
        print(f"\n📊 Résumé du nettoyage:")
        print(f"   📋 Uploads originaux: {original_count}")
        print(f"   🗑️ Doublons supprimés: {removed_count}")
        print(f"   ✅ Uploads restants: {final_count}")
        print(f"   💾 Sauvegarde: {backup_file}")
        
        if removed_count > 0:
            print(f"\n✅ Nettoyage terminé avec succès!")
        else:
            print(f"\n💡 Aucun doublon trouvé")
            
    except Exception as e:
        print(f"❌ Erreur lors du nettoyage: {e}")

if __name__ == "__main__":
    clean_duplicate_uploads()
