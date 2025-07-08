#!/usr/bin/env python3
"""
Script pour inspecter la structure du spreadsheet original.
"""
import requests
import json
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request

def inspect_original_spreadsheet():
    print("🔍 Inspection du spreadsheet original")
    print("=" * 50)
    
    try:
        # Charger la configuration
        with open("config/integrations.json", 'r') as f:
            config = json.load(f)
        
        credentials_file = config['google_sheets']['service_account_file']
        spreadsheet_id = config['google_sheets']['spreadsheet_id']
        
        print(f"📊 Spreadsheet ID: {spreadsheet_id}")
        print(f"🔗 URL: https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit")
        print()
        
        # Charger les credentials
        scopes = ['https://www.googleapis.com/auth/spreadsheets']
        creds = Credentials.from_service_account_file(credentials_file, scopes=scopes)
        creds.refresh(Request())
        
        # Récupérer les informations du spreadsheet
        print("📋 Récupération des informations...")
        url = f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}"
        headers = {
            'Authorization': f'Bearer {creds.token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(url, headers=headers)
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            print("✅ Accès au spreadsheet réussi !")
            print(f"   📋 Titre: {data.get('properties', {}).get('title', 'N/A')}")
            
            # Lister les sheets/onglets
            sheets = data.get('sheets', [])
            print(f"\n📑 Onglets disponibles ({len(sheets)}):")
            
            for i, sheet in enumerate(sheets, 1):
                sheet_props = sheet.get('properties', {})
                title = sheet_props.get('title', 'Sans titre')
                sheet_id = sheet_props.get('sheetId', 'N/A')
                grid_props = sheet_props.get('gridProperties', {})
                rows = grid_props.get('rowCount', 'N/A')
                cols = grid_props.get('columnCount', 'N/A')
                
                print(f"   {i}. {title}")
                print(f"      - ID: {sheet_id}")
                print(f"      - Taille: {rows} lignes x {cols} colonnes")
            
            # Vérifier les onglets attendus
            print(f"\n🎯 Vérification des onglets PostFlow:")
            sheet_titles = [sheet.get('properties', {}).get('title', '') for sheet in sheets]
            
            expected_sheets = ['SHOTS_TRACK', 'USERS_INFOS']
            for expected in expected_sheets:
                if expected in sheet_titles:
                    print(f"   ✅ {expected} : Trouvé")
                else:
                    print(f"   ❌ {expected} : Manquant")
                    # Chercher des noms similaires
                    similar = [title for title in sheet_titles if expected.lower() in title.lower() or title.lower() in expected.lower()]
                    if similar:
                        print(f"      Noms similaires: {similar}")
            
            # Suggestions
            print(f"\n💡 Suggestions:")
            if 'SHOTS_TRACK' not in sheet_titles:
                main_sheet = sheet_titles[0] if sheet_titles else None
                if main_sheet:
                    print(f"   - Renommer '{main_sheet}' en 'SHOTS_TRACK'")
                else:
                    print(f"   - Créer un onglet 'SHOTS_TRACK'")
            
            if 'USERS_INFOS' not in sheet_titles:
                print(f"   - Créer un onglet 'USERS_INFOS'")
            
            return True
            
        elif response.status_code == 403:
            print("❌ Erreur 403 - Accès refusé")
            print("   Le service account n'a pas accès au spreadsheet.")
            print("   Assurez-vous de l'avoir partagé avec: rl-postflow@resizelab.iam.gserviceaccount.com")
            
        elif response.status_code == 404:
            print("❌ Erreur 404 - Spreadsheet non trouvé")
            print("   Vérifiez l'ID du spreadsheet")
            
        else:
            print(f"❌ Erreur {response.status_code}")
            try:
                error_data = response.json()
                print(f"   📝 Détails: {error_data}")
            except:
                print(f"   📝 Réponse: {response.text}")
                
        return False
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    inspect_original_spreadsheet()
