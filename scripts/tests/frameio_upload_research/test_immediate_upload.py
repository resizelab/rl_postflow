#!/usr/bin/env python3
"""
Test d'upload immédiat après création du placeholder
"""

import asyncio
import sys
import tempfile
import mimetypes
from pathlib import Path
import requests

sys.path.insert(0, str(Path(__file__).parent))

from src.integrations.frameio.auth import FrameIOAuth

async def test_immediate_upload():
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
        
        # Détecter le Content-Type
        content_type, _ = mimetypes.guess_type(str(temp_file))
        if not content_type:
            content_type = "application/octet-stream"
        
        print(f"📝 Content-Type détecté: {content_type}")
        
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
        print(f"📤 URL d'upload reçue, upload immédiat...")
        
        # 2. Upload immédiat avec requests synchrone
        with open(temp_file, "rb") as file_obj:
            file_content = file_obj.read()
            
            headers = {
                "Content-Type": content_type,
                "X-Amz-Acl": ""  # Requis vide par la signature
            }
            
            print(f"📤 Headers: {headers}")
            
            response = requests.put(
                upload_url,
                data=file_content,
                headers=headers,
                timeout=60.0
            )
            
            if response.status_code in [200, 201, 204]:
                print(f"✅ Upload réussi! Status: {response.status_code}")
                print(f"📥 Response headers: {dict(response.headers)}")
            else:
                print(f"❌ Erreur upload: {response.status_code}")
                print(f"📥 Response: {response.text}")
        
        # Nettoyer
        temp_file.unlink()
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_immediate_upload())
