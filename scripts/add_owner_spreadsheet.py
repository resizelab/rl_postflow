#!/usr/bin/env python3
"""
Script pour ajouter post.xavierb@gmail.com en tant que propriétaire du spreadsheet.
"""
import requests
import json
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request

def add_owner_to_spreadsheet():
    print("👑 Ajout d'un propriétaire au spreadsheet")
    print("=" * 50)
    
    try:
        # Charger la configuration
        with open("config/integrations.json", 'r') as f:
            config = json.load(f)
        
        credentials_file = config['google_sheets']['service_account_file']
        spreadsheet_id = config['google_sheets']['spreadsheet_id']
        
        # Email à ajouter en tant que propriétaire
        owner_email = "post.xavierb@gmail.com"
        
        print(f"👑 Email à ajouter comme propriétaire: {owner_email}")
        print(f"📊 Spreadsheet ID: {spreadsheet_id}")
        print()
        
        # Charger les credentials avec scope Drive pour les permissions
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        creds = Credentials.from_service_account_file(credentials_file, scopes=scopes)
        creds.refresh(Request())
        
        # Ajouter le propriétaire via l'API Drive
        print("🔐 Ajout du propriétaire...")
        
        # URL pour les permissions Drive
        permissions_url = f"https://www.googleapis.com/drive/v3/files/{spreadsheet_id}/permissions"
        
        headers = {
            'Authorization': f'Bearer {creds.token}',
            'Content-Type': 'application/json'
        }
        
        # Données de permission pour propriétaire
        permission_data = {
            "role": "owner",  # Propriétaire
            "type": "user",
            "emailAddress": owner_email,
            "transferOwnership": True  # Transférer la propriété
        }
        
        response = requests.post(permissions_url, headers=headers, json=permission_data)
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Propriétaire ajouté avec succès !")
            permission_info = response.json()
            print(f"   👤 Permission ID: {permission_info.get('id')}")
            print(f"   📧 Email: {permission_info.get('emailAddress')}")
            print(f"   👑 Rôle: {permission_info.get('role')}")
            
            print(f"\n🎉 {owner_email} est maintenant propriétaire du spreadsheet !")
            print(f"🔗 Accès: https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit")
            
        elif response.status_code == 403:
            print("   ❌ Erreur 403 - Permissions insuffisantes")
            error_data = response.json()
            print(f"   📝 Erreur: {error_data}")
            
            if "transferOwnership" in str(error_data):
                print("\n🔧 Solution: Le service account ne peut pas transférer la propriété.")
                print("   Alternative: Ajouter comme éditeur d'abord, puis transférer manuellement.")
                
                # Essayer d'ajouter comme éditeur
                print("\n📝 Ajout comme éditeur à la place...")
                permission_data_editor = {
                    "role": "writer",
                    "type": "user",
                    "emailAddress": owner_email
                }
                
                response_editor = requests.post(permissions_url, headers=headers, json=permission_data_editor)
                
                if response_editor.status_code == 200:
                    print("   ✅ Ajouté comme éditeur avec succès !")
                    print("   📝 Pour le rendre propriétaire, transférez manuellement depuis Google Drive")
                else:
                    print(f"   ❌ Échec ajout éditeur: {response_editor.status_code}")
            
        elif response.status_code == 400:
            print("   ❌ Erreur 400 - Requête invalide")
            error_data = response.json()
            print(f"   📝 Détails: {error_data}")
            
        else:
            print(f"   ❌ Erreur {response.status_code}")
            try:
                error_data = response.json()
                print(f"   📝 Détails: {error_data}")
            except:
                print(f"   📝 Réponse: {response.text}")
                
        print(f"\n📌 Instructions manuelles si nécessaire:")
        print(f"   1. Ouvrir: https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit")
        print(f"   2. Cliquer sur 'Partager'")
        print(f"   3. Ajouter: {owner_email}")
        print(f"   4. Sélectionner 'Propriétaire' dans le menu déroulant")
        print(f"   5. Cliquer sur 'Envoyer'")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == '__main__':
    add_owner_to_spreadsheet()
