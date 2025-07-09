#!/usr/bin/env python3
"""
Script pour partager le nouveau spreadsheet avec votre email personnel.
"""
import requests
import json
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request

def share_spreadsheet_with_user():
    print("🔗 Partage du spreadsheet avec votre email")
    print("=" * 50)
    
    try:
        # Charger la configuration
        with open("config/integrations.json", 'r') as f:
            config = json.load(f)
        
        credentials_file = config['google_sheets']['service_account_file']
        spreadsheet_id = config['google_sheets']['spreadsheet_id']
        
        # Email à ajouter (remplacez par votre email)
        user_email = "xavier@resize-lab.com"  # Votre email
        
        print(f"📧 Email à ajouter: {user_email}")
        print(f"📊 Spreadsheet ID: {spreadsheet_id}")
        print()
        
        # Charger les credentials avec scope Drive pour les permissions
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        creds = Credentials.from_service_account_file(credentials_file, scopes=scopes)
        creds.refresh(Request())
        
        # Partager le spreadsheet via l'API Drive
        print("🔐 Partage du spreadsheet...")
        
        # URL pour les permissions Drive
        permissions_url = f"https://www.googleapis.com/drive/v3/files/{spreadsheet_id}/permissions"
        
        headers = {
            'Authorization': f'Bearer {creds.token}',
            'Content-Type': 'application/json'
        }
        
        # Données de permission
        permission_data = {
            "role": "writer",  # Éditeur
            "type": "user",
            "emailAddress": user_email
        }
        
        response = requests.post(permissions_url, headers=headers, json=permission_data)
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Spreadsheet partagé avec succès !")
            permission_info = response.json()
            print(f"   👤 Permission ID: {permission_info.get('id')}")
            print(f"   📧 Email: {permission_info.get('emailAddress')}")
            print(f"   🔑 Rôle: {permission_info.get('role')}")
            
            print(f"\n🔗 Vous pouvez maintenant accéder au spreadsheet:")
            print(f"   https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit")
            
        elif response.status_code == 403:
            print("   ❌ Erreur 403 - Permissions insuffisantes ou API Drive non activée")
            error_data = response.json()
            print(f"   📝 Erreur: {error_data}")
            print("\n🔧 Solutions possibles:")
            print("   1. Activer l'API Google Drive dans Google Cloud Console")
            print("   2. Vérifier que le service account a les droits de partage")
            
        else:
            print(f"   ❌ Erreur {response.status_code}")
            try:
                error_data = response.json()
                print(f"   📝 Détails: {error_data}")
            except:
                print(f"   📝 Réponse: {response.text}")
                
        print(f"\n📌 Alternative manuelle:")
        print(f"   1. Ouvrir: https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit")
        print(f"   2. Cliquer sur 'Partager' (si vous avez accès)")
        print(f"   3. Ajouter votre email: {user_email}")
        print(f"   4. Définir le rôle: Éditeur")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == '__main__':
    share_spreadsheet_with_user()
