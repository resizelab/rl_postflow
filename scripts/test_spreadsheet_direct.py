#!/usr/bin/env python3
"""
Script pour vérifier l'accès direct au spreadsheet Google.
"""
import gspread
import json
from google.oauth2.service_account import Credentials

def main():
    print("🔗 Test d'accès direct au Google Spreadsheet")
    print("=" * 50)
    
    # Charger la configuration depuis integrations.json
    import json
    with open("config/integrations.json", 'r') as f:
        config = json.load(f)
    
    # Configuration depuis le fichier
    credentials_file = config['google_sheets']['service_account_file']
    spreadsheet_id = config['google_sheets']['spreadsheet_id']
    
    print(f"📋 Spreadsheet ID: {spreadsheet_id}")
    print(f"🔑 Credentials file: {credentials_file}")
    print()
    
    try:
        # Configuration des scopes
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        
        # Charger les credentials
        print("🔐 Chargement des credentials...")
        creds = Credentials.from_service_account_file(credentials_file, scopes=scopes)
        
        # Créer le client gspread
        print("📡 Création du client gspread...")
        gc = gspread.authorize(creds)
        
        # Essayer d'ouvrir le spreadsheet par ID
        print(f"📊 Tentative d'ouverture du spreadsheet...")
        spreadsheet = gc.open_by_key(spreadsheet_id)
        
        print(f"✅ Succès ! Spreadsheet ouvert:")
        print(f"  - Titre: {spreadsheet.title}")
        print(f"  - ID: {spreadsheet.id}")
        print(f"  - URL: {spreadsheet.url}")
        print()
        
        # Lister les worksheets
        print("📑 Worksheets disponibles:")
        worksheets = spreadsheet.worksheets()
        for i, ws in enumerate(worksheets, 1):
            print(f"  {i}. {ws.title} (ID: {ws.id})")
        
        # Essayer d'accéder aux worksheets spécifiques
        print()
        print("🎯 Test des worksheets spécifiques:")
        
        # SHOTS_TRACK
        try:
            shots_ws = spreadsheet.worksheet("SHOTS_TRACK")
            print(f"  ✅ SHOTS_TRACK trouvé (lignes: {shots_ws.row_count}, colonnes: {shots_ws.col_count})")
        except gspread.WorksheetNotFound:
            print(f"  ❌ SHOTS_TRACK non trouvé")
        
        # USERS_INFOS
        try:
            users_ws = spreadsheet.worksheet("USERS_INFOS")
            print(f"  ✅ USERS_INFOS trouvé (lignes: {users_ws.row_count}, colonnes: {users_ws.col_count})")
        except gspread.WorksheetNotFound:
            print(f"  ❌ USERS_INFOS non trouvé")
            
    except gspread.SpreadsheetNotFound:
        print("❌ ERREUR: Spreadsheet non trouvé")
        print("   - Vérifiez l'ID du spreadsheet")
        print("   - Assurez-vous que le service account a accès au spreadsheet")
    except Exception as e:
        print(f"❌ ERREUR: {e}")
        print(f"   Type d'erreur: {type(e).__name__}")

if __name__ == '__main__':
    main()
