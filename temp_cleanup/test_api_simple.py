#!/usr/bin/env python3
import json
import httpx

def test_frameio_api():
    print("🔍 Test direct API Frame.io showfile...")
    
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
            print(f"📄 Name: {data.get('name', 'Unknown')}")
            print(f"🔄 Status: {data.get('status', 'Unknown')}")
            
            # Vérifier media_links
            media_links = data.get('media_links', {})
            print(f"📹 Media links disponibles: {len(media_links)} types")
            
            if media_links:
                for link_type, link_data in media_links.items():
                    if isinstance(link_data, dict) and 'url' in link_data:
                        print(f"  ✅ {link_type}: {link_data['url'][:80]}...")
                    else:
                        print(f"  ❌ {link_type}: pas d'URL disponible")
            else:
                print("  ⚠️ Aucun media_links trouvé")
                
            # Afficher les clés disponibles
            print(f"\n🔍 Clés disponibles dans la réponse:")
            for key in data.keys():
                print(f"  - {key}")
                
        else:
            print(f"❌ Erreur: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    test_frameio_api()
