#!/usr/bin/env python3
"""
Test direct API Frame.io sans dépendances locales
"""

import httpx
import json

def test_frameio_direct():
    print("🔍 Test direct API Frame.io showfile...")
    
    # File ID du tracking
    file_id = '616e64d7-b6a0-4916-9747-63ba9150dd2b'
    account_id = '60b535d5-8508-459a-8dd6-98ffb0c3eb78'
    
    # Lire le token depuis config
    try:
        with open('config/google_credentials.json', 'r') as f:
            config = json.load(f)
        
        frameio_config = config.get('frameio', {})
        access_token = frameio_config.get('access_token')
        
        if not access_token:
            print("❌ Pas de token Frame.io dans la config")
            return
            
        print(f"✅ Token trouvé: {access_token[:20]}...")
        
    except Exception as e:
        print(f"❌ Erreur lecture config: {e}")
        return
    
    # URL showfile
    url = f"https://api.frame.io/v4/accounts/{account_id}/files/{file_id}"
    
    # Paramètres pour récupérer tous les media_links
    params = {
        'include': 'media_links.original,media_links.thumbnail,media_links.high_quality,media_links.video_h264_180,media_links.efficient,media_links.preview'
    }
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    print(f"\n🎯 GET {url}")
    print(f"📋 Params: {params['include']}")
    
    try:
        response = httpx.get(url, params=params, headers=headers, timeout=30)
        
        print(f"\n📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            print(f"✅ Réponse reçue")
            print(f"📁 Nom: {data.get('name', 'N/A')}")
            print(f"📊 Status: {data.get('status', 'N/A')}")
            print(f"🎬 Type: {data.get('type', 'N/A')}")
            print(f"📏 Taille: {data.get('filesize', 'N/A')} bytes")
            
            # Vérifier les media_links
            media_links = data.get('media_links', {})
            print(f"\n📹 Media links disponibles: {len(media_links)} types")
            
            if media_links:
                for link_type, link_data in media_links.items():
                    if link_data and isinstance(link_data, dict):
                        url_media = link_data.get('url', 'N/A')
                        print(f"  ✅ {link_type}: {url_media}")
                    else:
                        print(f"  ⚠️ {link_type}: {link_data}")
            else:
                print("⚠️ Aucun media_links trouvé")
                
                # Afficher la structure pour debug
                print("\n📋 Structure complète (premiers 1000 chars):")
                print(json.dumps(data, indent=2)[:1000])
                
                if len(json.dumps(data)) > 1000:
                    print("... (tronqué)")
                    
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            print(f"📄 Réponse: {response.text[:500]}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_frameio_direct()
