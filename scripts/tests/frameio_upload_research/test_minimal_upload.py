#!/usr/bin/env python3
"""
Test minimaliste : Upload vers Frame.io SANS AUCUN HEADER
Hypothèses :
1. PUT sans Content-Type, sans x-amz-acl, sans headers supplémentaires
2. Fichier en mode binaire strict (rb)
3. URL exactement comme reçue de Frame.io
"""

import asyncio
import sys
import tempfile
from pathlib import Path
import requests

sys.path.insert(0, str(Path(__file__).parent))

from src.integrations.frameio.auth import FrameIOAuth

async def test_minimal_upload():
    try:
        # 1. Créer un fichier test binaire
        temp_file = Path(tempfile.gettempdir()) / 'UNDLM_minimal_test.mov'
        binary_content = b"MINIMAL_TEST_CONTENT_FOR_FRAMEIO_UPLOAD" * 100  # ~3.9KB
        temp_file.write_bytes(binary_content)
        
        print(f"📄 Fichier créé: {temp_file} ({temp_file.stat().st_size} bytes)")
        print(f"🔢 Contenu: {len(binary_content)} bytes binaires")
        
        # 2. Authentification Frame.io
        auth = FrameIOAuth()
        
        # 3. Créer placeholder
        folder_id = '596cc581-b95d-4da3-a9af-514fbe152a29'  # UNDLM_00001 folder
        account_id = '60b535d5-8508-459a-8dd6-98ffb0c3eb78'
        base_url = 'https://api.frame.io/v4'
        
        url = f"{base_url}/accounts/{account_id}/folders/{folder_id}/files/local_upload"
        
        payload = {
            "data": {
                "name": temp_file.name,
                "file_size": temp_file.stat().st_size
            }
        }
        
        print(f"📡 Création placeholder Frame.io...")
        response = await auth.request("POST", url, json=payload)
        response.raise_for_status()
        
        response_data = response.json()
        file_data = response_data.get("data", {})
        upload_urls = file_data.get("upload_urls", [])
        
        if not upload_urls:
            print("❌ Aucune URL d'upload reçue")
            return False
        
        upload_url = upload_urls[0]["url"]
        file_id = file_data["id"]
        
        print(f"✅ Placeholder créé: {file_id}")
        print(f"📤 URL d'upload reçue (longueur: {len(upload_url)})")
        
        # 4. TEST MINIMAL: PUT sans AUCUN header
        print(f"\n🧪 TEST 1: PUT sans aucun header")
        
        # Lire le fichier en mode binaire strict
        with open(temp_file, 'rb') as f:
            file_binary = f.read()
        
        print(f"📁 Fichier lu: {len(file_binary)} bytes binaires")
        print(f"🔍 Premiers bytes: {file_binary[:50]}")
        
        # PUT SANS HEADERS du tout
        response = requests.put(
            upload_url,  # URL exactement comme reçue
            data=file_binary,  # Data binaire pure
            # PAS DE HEADERS DU TOUT
        )
        
        print(f"📊 Status code: {response.status_code}")
        
        if response.status_code in [200, 201, 204]:
            print("🎉 SUCCESS! Upload réussi sans headers!")
            return True
        elif response.status_code == 403:
            print(f"❌ Toujours 403. Réponse: {response.text[:200]}...")
        else:
            print(f"❌ Erreur {response.status_code}: {response.text[:200]}...")
        
        # 5. TEST 2: Essayer avec seulement Content-Length (auto par requests)
        print(f"\n🧪 TEST 2: Laisser requests gérer automatiquement")
        
        # Créer un nouveau placeholder pour test 2
        response2 = await auth.request("POST", url, json=payload)
        response2.raise_for_status()
        
        file_data2 = response2.json().get("data", {})
        upload_urls2 = file_data2.get("upload_urls", [])
        upload_url2 = upload_urls2[0]["url"]
        
        # PUT avec requests en mode automatique
        response = requests.put(upload_url2, data=file_binary)
        
        print(f"📊 Status code: {response.status_code}")
        
        if response.status_code in [200, 201, 204]:
            print("🎉 SUCCESS! Upload réussi en mode auto!")
            return True
        else:
            print(f"❌ Erreur: {response.text[:200]}...")
            
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
            print(f"🗑️ Fichier temporaire supprimé")

if __name__ == "__main__":
    success = asyncio.run(test_minimal_upload())
    if success:
        print("\n✅ AU MOINS UN TEST A RÉUSSI!")
    else:
        print("\n❌ Tous les tests ont échoué")
