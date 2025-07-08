#!/usr/bin/env python3
"""
Test remote_upload avec une URL publique pour valider l'endpoint
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from src.integrations.frameio.auth import FrameIOAuth

async def test_remote_upload_public():
    try:
        # Initialiser l'auth
        auth = FrameIOAuth()
        
        # Configuration
        folder_id = '596cc581-b95d-4da3-a9af-514fbe152a29'  # UNDLM_00001
        account_id = '60b535d5-8508-459a-8dd6-98ffb0c3eb78'
        base_url = 'https://api.frame.io/v4'
        
        # Utiliser une URL publique d'exemple (petit fichier vidéo)
        public_video_url = "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
        
        url = f"{base_url}/accounts/{account_id}/folders/{folder_id}/files/remote_upload"
        
        payload = {
            "data": {
                "name": "test_remote_video.mp4",
                "source_url": public_video_url
            }
        }
        
        print(f"📡 Test remote_upload avec URL publique...")
        print(f"🎯 Endpoint: {url}")
        print(f"📤 Source URL: {public_video_url}")
        
        response = await auth.request("POST", url, json=payload)
        
        print(f"📥 Status Code: {response.status_code}")
        
        if response.status_code == 202:  # Accepted
            response_data = response.json()
            file_data = response_data.get("data", {})
            
            print(f"✅ Remote upload accepté!")
            print(f"📁 File ID: {file_data.get('id')}")
            print(f"📊 Status: {file_data.get('status')}")
            print(f"🔗 View URL: {file_data.get('view_url')}")
            
            return True
        else:
            print(f"❌ Erreur: {response.status_code}")
            print(f"📄 Response: {response.text}")
            return False
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    asyncio.run(test_remote_upload_public())
