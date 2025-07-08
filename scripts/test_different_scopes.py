#!/usr/bin/env python3
"""
Script pour tester différents scopes d'accès Google Sheets.
"""
import gspread
from google.oauth2.service_account import Credentials
import json

def test_with_scopes(scopes, scope_name):
    """Test avec des scopes spécifiques."""
    print(f"\n🔧 Test avec {scope_name}:")
    print(f"   Scopes: {scopes}")
    
    try:
        # Charger la configuration
        with open("config/integrations.json", 'r') as f:
            config = json.load(f)
        
        credentials_file = config['google_sheets']['service_account_file']
        spreadsheet_id = config['google_sheets']['spreadsheet_id']
        
        # Charger les credentials avec les scopes spécifiés
        creds = Credentials.from_service_account_file(credentials_file, scopes=scopes)
        
        # Créer le client gspread
        gc = gspread.authorize(creds)
        
        # Essayer d'ouvrir le spreadsheet
        spreadsheet = gc.open_by_key(spreadsheet_id)
        
        print(f"   ✅ Succès ! Spreadsheet: {spreadsheet.title}")
        
        # Tester l'accès aux worksheets
        worksheets = spreadsheet.worksheets()
        print(f"   📑 Worksheets: {[ws.title for ws in worksheets]}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
        return False

def main():
    print("🧪 Test de différents scopes Google Sheets")
    print("=" * 50)
    
    # Différentes combinaisons de scopes à tester
    scope_tests = [
        # Test 1: Scopes standards
        (
            [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'
            ],
            "Scopes standards (Sheets + Drive)"
        ),
        
        # Test 2: Uniquement Sheets
        (
            [
                'https://www.googleapis.com/auth/spreadsheets'
            ],
            "Sheets uniquement"
        ),
        
        # Test 3: Scopes lecture seule
        (
            [
                'https://www.googleapis.com/auth/spreadsheets.readonly'
            ],
            "Sheets lecture seule"
        ),
        
        # Test 4: Scopes legacy
        (
            [
                'https://spreadsheets.google.com/feeds',
                'https://www.googleapis.com/auth/drive'
            ],
            "Scopes legacy (feeds + Drive)"
        ),
        
        # Test 5: Tous les scopes
        (
            [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.file'
            ],
            "Tous les scopes"
        )
    ]
    
    success_count = 0
    for scopes, name in scope_tests:
        if test_with_scopes(scopes, name):
            success_count += 1
    
    print(f"\n📊 Résumé: {success_count}/{len(scope_tests)} tests réussis")
    
    if success_count == 0:
        print("\n🔍 Diagnostic supplémentaire:")
        print("   - Vérifiez que le service account a bien les droits 'Éditeur'")
        print("   - Vérifiez que l'API Google Sheets est activée dans la console Google Cloud")
        print("   - Essayez de recréer les credentials du service account")

if __name__ == '__main__':
    main()
