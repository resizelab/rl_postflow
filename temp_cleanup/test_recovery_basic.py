#!/usr/bin/env python3
"""
Test du Recovery Manager
"""

import json
import os
from datetime import datetime

def test_recovery_manager():
    """Test basique du recovery manager"""
    
    print("=== TEST RECOVERY MANAGER ===")
    
    # Simuler des données d'upload
    test_uploads = {
        "UNDLM_00150_v001": {
            "shot_id": "UNDLM_00150",
            "version": "v001",
            "status": "🔄 UPLOADING",
            "frameio_upload_id": "upload_123",
            "frameio_file_id": None,  # Upload incomplet
            "timestamp": "2024-01-20T15:30:00",
            "file_path": "/path/to/file.mp4"
        },
        "UNDLM_00152_v001": {
            "shot_id": "UNDLM_00152", 
            "version": "v001",
            "status": "🎉 COMPLETED",
            "frameio_upload_id": "upload_456",
            "frameio_file_id": "file_789",  # Upload complet
            "timestamp": "2024-01-20T16:00:00",
            "file_path": "/path/to/file2.mp4"
        }
    }
    
    print("Données de test chargées:")
    for key, upload in test_uploads.items():
        status = upload['status']
        file_id = upload.get('frameio_file_id', 'None')
        print(f"  {key}: {status} (file_id: {file_id})")
    
    print()
    
    # Détecter les uploads incomplets
    incomplete_uploads = []
    for key, upload in test_uploads.items():
        if upload['status'] != "🎉 COMPLETED" or not upload.get('frameio_file_id'):
            incomplete_uploads.append((key, upload))
    
    print(f"Uploads incomplets détectés: {len(incomplete_uploads)}")
    for key, upload in incomplete_uploads:
        print(f"  - {key}: {upload['status']}")
    
    print()
    
    # Test génération de liens courts
    for key, upload in test_uploads.items():
        shot_id = upload['shot_id']
        version = upload['version']
        
        clean_shot_id = shot_id.replace("UNDLM_", "")
        version_clean = version.upper().replace("V", "_V")
        short_link = f"REVIEW_{clean_shot_id}{version_clean}"
        
        print(f"{shot_id} {version} → {short_link}")

if __name__ == "__main__":
    test_recovery_manager()
