#!/usr/bin/env python3
"""Test manuel de la fonction showfile"""

import sys
import os
import httpx

# Ajouter le répertoire racine au path
sys.path.insert(0, os.path.abspath('.'))

from src.integrations.frameio.auth import FrameIOAuth
from src.utils.config import ConfigManager

def test_showfile():
    print("🔍 Test showfile avec le file_id du tracking...")
    
    # Init auth directement
    config = ConfigManager()
    frameio_auth = FrameIOAuth(config)
    
    # Test avec le file_id du tracking
    file_id = '616e64d7-b6a0-4916-9747-63ba9150dd2b'
    print(f'🎯 File ID: {file_id}')
    
    try:
        # Récupérer le token
        tokens = frameio_auth._load_current_tokens()
        access_token = tokens.get("access_token")
        
        if not access_token:
            print("❌ Pas de token disponible")
            return
            
        # Appel direct de l'API showfile
        account_id = "60b535d5-8508-459a-8dd6-98ffb0c3eb78"
        url = f"https://api.frame.io/v4/accounts/{account_id}/files/{file_id}"
        
        params = {
            'include': 'media_links.original,media_links.thumbnail,media_links.high_quality,media_links.video_h264_180,media_links.efficient'
        }
        
        headers = {"Authorization": f"Bearer {access_token}"}
        
        print(f"🔍 GET {url}")
        print(f"🔍 Params: {params}")
        
        response = httpx.get(url, params=params, headers=headers, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print('✅ Showfile réussi!')
            print(f'📹 File name: {result.get("name", "N/A")}')
            
            media_links = result.get('media_links', {})
            print(f'📹 Media links disponibles: {len(media_links)} types')
            
            for media_type, link_data in media_links.items():
                if link_data and isinstance(link_data, dict):
                    url_media = link_data.get('url', 'N/A')
                    print(f'  - {media_type}: {url_media[:80]}...')
        else:
            print(f'❌ Erreur HTTP {response.status_code}: {response.text}')
            
    except Exception as e:
        print(f'❌ Erreur: {e}')
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_showfile()
