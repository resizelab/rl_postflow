#!/usr/bin/env python3
"""
Test d'upload avec subprocess curl pour reproduire exactement curl
"""

import asyncio
import sys
import tempfile
import subprocess
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from src.integrations.frameio.auth import FrameIOAuth

async def test_subprocess_curl():
    try:
        # Créer un fichier test simple
        temp_file = Path(tempfile.gettempdir()) / 'UNDLM_test_v001.mov'
        temp_file.write_bytes(b"Test content for upload" * 1000)  # ~23KB
        
        print(f"📄 Fichier test: {temp_file} ({temp_file.stat().st_size} bytes)")
        
        # Initialiser l'auth
        auth = FrameIOAuth()
        
        # Utiliser un folder_id existant
        folder_id = '596cc581-b95d-4da3-a9af-514fbe152a29'  # UNDLM_00001
        account_id = '60b535d5-8508-459a-8dd6-98ffb0c3eb78'
        base_url = 'https://api.frame.io/v4'
        
        # 1. Créer le placeholder
        url = f"{base_url}/accounts/{account_id}/folders/{folder_id}/files/local_upload"
        
        payload = {
            "data": {
                "name": temp_file.name,
                "file_size": temp_file.stat().st_size
            }
        }
        
        print(f"📡 Création placeholder...")
        response = await auth.request("POST", url, json=payload)
        response.raise_for_status()
        
        response_data = response.json()
        file_data = response_data.get("data", {})
        upload_urls = file_data.get("upload_urls", [])
        
        if not upload_urls:
            print("❌ Aucune URL d'upload reçue")
            return
        
        upload_url = upload_urls[0]["url"]
        print(f"✅ Placeholder créé: {file_data['id']}")
        print(f"📤 Upload avec curl subprocess...")
        
        # 2. Upload avec curl subprocess (pour reproduire exactement curl)
        curl_cmd = [
            'curl', '-X', 'PUT',
            '-H', 'Content-Type: video/quicktime',
            '-H', 'x-amz-acl;',  # Syntaxe qui fonctionne avec curl
            '--data-binary', f"@{temp_file}",
            upload_url,
            '-s', '-w', '%{http_code}'
        ]
        
        print(f"🔧 Commande curl: {' '.join(curl_cmd[:8])}... [URL tronquée]")
        
        result = subprocess.run(curl_cmd, capture_output=True, text=True, timeout=60)
        
        print(f"📤 Status code: {result.stdout}")
        if result.stderr:
            print(f"📤 Stderr: {result.stderr}")
        
        if result.stdout.strip() in ['200', '201', '204']:
            print("🎉 SUCCESS! Upload réussi avec curl!")
            return True
        else:
            print("❌ Upload échoué avec curl")
            return False
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        # Nettoyer
        if temp_file.exists():
            temp_file.unlink()

if __name__ == "__main__":
    asyncio.run(test_subprocess_curl())
