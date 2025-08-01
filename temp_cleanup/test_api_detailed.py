#!/usr/bin/env python3
import json
import httpx

def test_frameio_api_detailed():
    print("🔍 Test détaillé API Frame.io showfile...")
    
    # Charger la config
    with open('config/integrations.json', 'r') as f:
        config = json.load(f)
    
    token = config['frameio']['access_token']
    account_id = config['frameio']['account_id']
    file_id = '616e64d7-b6a0-4916-9747-63ba9150dd2b'
    
    print(f"✅ Token: {token[:50]}...")
    print(f"✅ Account ID: {account_id}")
    print(f"✅ File ID: {file_id}")
    print()
    
    # Test API Frame.io
    url = f'https://api.frame.io/v4/accounts/{account_id}/files/{file_id}'
    params = {
        'include': 'media_links.original,media_links.thumbnail,media_links.high_quality,media_links.video_h264_180,media_links.efficient'
    }
    headers = {'Authorization': f'Bearer {token}'}
    
    print(f"📡 URL: {url}")
    print(f"📋 Params: {params}")
    print()
    
    try:
        response = httpx.get(url, headers=headers, params=params)
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"🎯 Réponse complète:")
            print(json.dumps(data, indent=2))
            print()
            
            # Explorer la structure data
            if 'data' in data:
                file_data = data['data']
                print(f"📁 Structure dans 'data':")
                print(f"  - name: {file_data.get('name', 'N/A')}")
                print(f"  - state: {file_data.get('state', 'N/A')}")
                print(f"  - status: {file_data.get('status', 'N/A')}")
                print(f"  - type: {file_data.get('type', 'N/A')}")
                
                # Vérifier media_links dans data
                media_links = file_data.get('media_links', {})
                print(f"📹 Media links dans data: {len(media_links)} types")
                
                if media_links:
                    for link_type, link_data in media_links.items():
                        print(f"  🎬 {link_type}:")
                        if isinstance(link_data, dict):
                            for key, value in link_data.items():
                                if key == 'url':
                                    print(f"    ✅ {key}: {value[:80]}...")
                                else:
                                    print(f"    - {key}: {value}")
                        else:
                            print(f"    - {link_data}")
                else:
                    print("  ⚠️ Aucun media_links trouvé dans data")
                    
        else:
            print(f"❌ Erreur: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    test_frameio_api_detailed()
