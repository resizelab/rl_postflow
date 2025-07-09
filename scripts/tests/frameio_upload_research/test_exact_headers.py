#!/usr/bin/env python3
"""
Test avec les headers exacts requis par l'URL signée
"""

import asyncio
import sys
import tempfile
import subprocess
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from src.integrations.frameio.auth import FrameIOAuth
from src.integrations.frameio.upload import FrameIOUploadManager, UploadMetadata

async def test_exact_headers():
    try:
        # Créer un fichier test simple
        temp_file = Path(tempfile.gettempdir()) / 'test_exact.mov'
        temp_file.write_bytes(b"Test exact headers")
        
        print(f"📄 Fichier test: {temp_file} ({temp_file.stat().st_size} bytes)")
        
        # Initialiser l'upload manager
        auth = FrameIOAuth()
        upload_manager = FrameIOUploadManager(auth)
        
        # Métadonnées
        metadata = UploadMetadata(
            shot_id='test_shot',
            scene_name='test_scene', 
            version='v001',
            file_path=str(temp_file)
        )
        
        folder_id = '596cc581-b95d-4da3-a9af-514fbe152a29'
        
        # Créer le placeholder et récupérer l'URL signée
        file_placeholder = await upload_manager._create_file_placeholder(metadata, folder_id)
        
        if not file_placeholder or not file_placeholder.upload_urls:
            print("❌ Pas d'URL d'upload")
            return
        
        upload_url = file_placeholder.upload_urls[0]
        print(f"🔗 URL d'upload récupérée")
        
        # Test avec les headers exacts selon l'URL signée
        print("\n🧪 Test avec headers exacts")
        cmd = [
            'curl', '-X', 'PUT',
            '-H', 'Content-Type: application/octet-stream',
            '-H', 'x-amz-acl;',  # Header vide mais présent (syntaxe spéciale)
            '--data-binary', f'@{temp_file}',
            '--silent',
            '--show-error',
            '--fail',
            upload_url
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ SUCCESS! Upload réussi avec curl")
            print(f"Stdout: {result.stdout}")
        else:
            print(f"❌ Erreur curl (code {result.returncode})")
            print(f"Stderr: {result.stderr}")
            
            # Retry avec plus de debug
            cmd_debug = [
                'curl', '-X', 'PUT',
                '-H', 'Content-Type: application/octet-stream',
                '-H', 'x-amz-acl;',
                '--data-binary', f'@{temp_file}',
                '-v',
                upload_url
            ]
            
            result_debug = subprocess.run(cmd_debug, capture_output=True, text=True)
            print(f"Debug stderr: {result_debug.stderr}")
        
        # Nettoyer
        temp_file.unlink()
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_exact_headers())
