#!/usr/bin/env python3
"""
Test pour vérifier si les APIs Google sont activées.
"""
import requests
import json
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request

def test_api_access():
    print("🔍 Test d'accès aux APIs Google")
    print("=" * 40)
    
    try:
        # Charger les credentials
        credentials_file = "config/google_credentials.json"
        scopes = ['https://www.googleapis.com/auth/spreadsheets']
        creds = Credentials.from_service_account_file(credentials_file, scopes=scopes)
        
        # Obtenir un token
        creds.refresh(Request())
        
        # Test de l'API Sheets avec une requête simple
        spreadsheet_id = "1cIJN9Ax4p5yjY0oa0LkafBTmj8LGXjup"
        
        print("📊 Test API Google Sheets...")
        url = f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}"
        headers = {
            'Authorization': f'Bearer {creds.token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(url, headers=headers)
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ API Sheets fonctionne !")
            data = response.json()
            print(f"   📋 Spreadsheet: {data.get('properties', {}).get('title', 'N/A')}")
        elif response.status_code == 403:
            error_data = response.json()
            print("   ❌ Erreur 403 - API non activée ou permissions insuffisantes")
            print(f"   📝 Message: {error_data.get('error', {}).get('message', 'N/A')}")
            if 'has not been used' in str(error_data):
                print("   🔧 Solution: Activer l'API Google Sheets dans Google Cloud Console")
        elif response.status_code == 404:
            print("   ❌ Spreadsheet non trouvé ou pas d'accès")
        else:
            print(f"   ❌ Erreur {response.status_code}")
            try:
                error_data = response.json()
                print(f"   📝 Détails: {error_data}")
            except:
                print(f"   📝 Réponse: {response.text}")
                
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == '__main__':
    test_api_access()
