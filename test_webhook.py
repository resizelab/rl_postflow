#!/usr/bin/env python3
import json
import requests
import httpx

def test_webhook_frameio():
    """Tester le webhook Frame.io file.ready avec le fichier existant"""
    
    # Données du webhook file.ready (simulé)
    webhook_data = {
        "id": "616e64d7-b6a0-4916-9747-63ba9150dd2b",
        "name": "SQ04_UNDLM_00094_v001.mov",
        "status": "transcoded",
        "type": "file"
    }
    
    # URL du webhook local
    webhook_url = "http://localhost:8080/frameio-webhook"
    
    # Payload du webhook Frame.io
    payload = {
        "type": "file.ready",
        "data": webhook_data,
        "resource": {
            "type": "file",
            "id": webhook_data["id"]
        }
    }
    
    print("🔍 Test webhook Frame.io file.ready...")
    print(f"📡 URL: {webhook_url}")
    print(f"📋 Payload: {json.dumps(payload, indent=2)}")
    print()
    
    try:
        response = requests.post(
            webhook_url,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"📊 Status: {response.status_code}")
        print(f"📄 Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Webhook traité avec succès!")
        else:
            print(f"❌ Erreur webhook: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_webhook_frameio()
