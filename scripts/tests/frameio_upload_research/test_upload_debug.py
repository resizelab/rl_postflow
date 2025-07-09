#!/usr/bin/env python3
"""
Test simple de l'upload pour diagnostiquer l'erreur 422
"""

import asyncio
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from src.integrations.frameio.auth import FrameIOAuth
from src.integrations.frameio.upload import FrameIOUploadManager, UploadMetadata

async def test_upload_debug():
    try:
        # Créer un fichier test simple
        temp_file = Path(tempfile.gettempdir()) / 'UNDLM_test_v001.mov'
        temp_file.write_bytes(b"Test content for upload" * 1000)  # ~23KB
        
        print(f"📄 Fichier test: {temp_file} ({temp_file.stat().st_size} bytes)")
        
        # Initialiser l'upload manager
        auth = FrameIOAuth()
        upload_manager = FrameIOUploadManager(auth)
        
        # Métadonnées
        metadata = UploadMetadata(
            shot_id='test_shot',
            scene_name='test_scene',
            version='v001',
            file_path=str(temp_file),
            description='Test upload file',
            tags=['test', 'debug']
        )
        
        # Utiliser un folder_id existant de nos tests précédents
        folder_id = '596cc581-b95d-4da3-a9af-514fbe152a29'  # UNDLM_00001
        
        print(f"📁 Upload vers folder: {folder_id}")
        
        # Tenter la création du placeholder
        result = await upload_manager._create_file_placeholder(metadata, folder_id)
        
        if result:
            print(f"✅ Placeholder créé: {result.id}")
            print(f"📤 URLs d'upload: {len(result.upload_urls)}")
        else:
            print("❌ Échec création placeholder")
        
        # Nettoyer
        temp_file.unlink()
        
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    asyncio.run(test_upload_debug())
