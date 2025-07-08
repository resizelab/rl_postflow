#!/usr/bin/env python3
"""
Créer un nouveau spreadsheet de test simple.
"""
import requests
import json
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request

def create_test_spreadsheet():
    print("🆕 Création d'un nouveau spreadsheet de test")
    print("=" * 50)
    
    try:
        # Charger les credentials
        credentials_file = "config/google_credentials.json"
        scopes = ['https://www.googleapis.com/auth/spreadsheets']
        creds = Credentials.from_service_account_file(credentials_file, scopes=scopes)
        
        # Obtenir un token
        creds.refresh(Request())
        
        print("🔐 Token obtenu, création du spreadsheet...")
        
        # Créer un nouveau spreadsheet via l'API REST
        url = "https://sheets.googleapis.com/v4/spreadsheets"
        headers = {
            'Authorization': f'Bearer {creds.token}',
            'Content-Type': 'application/json'
        }
        
        # Configuration du nouveau spreadsheet
        spreadsheet_data = {
            "properties": {
                "title": "PostFlow Test - Nouveau"
            },
            "sheets": [
                {
                    "properties": {
                        "title": "SHOTS_TRACK",
                        "gridProperties": {
                            "rowCount": 100,
                            "columnCount": 10
                        }
                    }
                },
                {
                    "properties": {
                        "title": "USERS_INFOS",
                        "gridProperties": {
                            "rowCount": 100,
                            "columnCount": 8
                        }
                    }
                }
            ]
        }
        
        response = requests.post(url, headers=headers, json=spreadsheet_data)
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            new_id = data.get('spreadsheetId')
            title = data.get('properties', {}).get('title')
            
            print(f"   ✅ Spreadsheet créé avec succès !")
            print(f"   📋 Titre: {title}")
            print(f"   🆔 ID: {new_id}")
            print(f"   🔗 URL: https://docs.google.com/spreadsheets/d/{new_id}/edit")
            
            # Tester l'accès au nouveau spreadsheet
            print("\n🧪 Test d'accès au nouveau spreadsheet...")
            test_url = f"https://sheets.googleapis.com/v4/spreadsheets/{new_id}"
            test_response = requests.get(test_url, headers=headers)
            
            if test_response.status_code == 200:
                print("   ✅ Accès au nouveau spreadsheet réussi !")
                
                # Mettre à jour la configuration
                print(f"\n📝 Pour utiliser ce nouveau spreadsheet, mettez à jour config/integrations.json:")
                print(f'   "spreadsheet_id": "{new_id}"')
                
                return new_id
            else:
                print(f"   ❌ Échec d'accès au nouveau spreadsheet: {test_response.status_code}")
                
        else:
            print(f"   ❌ Échec de création: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   📝 Erreur: {error_data}")
            except:
                print(f"   📝 Réponse: {response.text}")
                
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None

if __name__ == '__main__':
    create_test_spreadsheet()
