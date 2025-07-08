#!/usr/bin/env python3
"""
Script pour créer un nouveau spreadsheet de test PostFlow.
"""
import gspread
from google.oauth2.service_account import Credentials

def main():
    print("🆕 Création d'un nouveau spreadsheet PostFlow")
    print("=" * 50)
    
    credentials_file = "config/google_credentials.json"
    
    try:
        # Configuration des scopes (uniquement Sheets, pas Drive)
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets'
        ]
        
        # Charger les credentials
        print("🔐 Chargement des credentials...")
        creds = Credentials.from_service_account_file(credentials_file, scopes=scopes)
        
        # Créer le client gspread
        print("📡 Création du client gspread...")
        gc = gspread.authorize(creds)
        
        # Créer un nouveau spreadsheet
        print("📊 Création du spreadsheet 'PostFlow - Test'...")
        spreadsheet = gc.create("PostFlow - Test")
        
        print(f"✅ Spreadsheet créé avec succès!")
        print(f"   Titre: {spreadsheet.title}")
        print(f"   ID: {spreadsheet.id}")
        print(f"   URL: {spreadsheet.url}")
        print()
        
        # Créer les worksheets nécessaires
        print("📑 Création des worksheets...")
        
        # Renommer le premier worksheet
        default_ws = spreadsheet.sheet1
        default_ws.update_title("SHOTS_TRACK")
        print("   ✅ SHOTS_TRACK créé (renommé depuis Sheet1)")
        
        # Créer le second worksheet
        users_ws = spreadsheet.add_worksheet(title="USERS_INFOS", rows=100, cols=10)
        print("   ✅ USERS_INFOS créé")
        
        # Ajouter des en-têtes de base
        print("📝 Ajout des en-têtes...")
        
        # En-têtes pour SHOTS_TRACK
        shots_headers = [
            "Shot Name", "Status", "Frame.io Link", "Priority", 
            "Assigned To", "Created", "Updated", "Notes"
        ]
        default_ws.append_row(shots_headers)
        print("   ✅ En-têtes SHOTS_TRACK ajoutés")
        
        # En-têtes pour USERS_INFOS
        users_headers = [
            "Name", "Email", "Discord ID", "Role", "Department", "Active"
        ]
        users_ws.append_row(users_headers)
        print("   ✅ En-têtes USERS_INFOS ajoutés")
        
        print()
        print("🎯 IMPORTANT: Mettre à jour la configuration!")
        print(f"   Copiez cet ID dans config/integrations.json:")
        print(f"   \"spreadsheet_id\": \"{spreadsheet.id}\"")
        print()
        print("🔗 Pour partager avec votre compte personnel:")
        print(f"   Ouvrez: {spreadsheet.url}")
        print("   Cliquez sur 'Partager' et ajoutez votre email personnel")
        
    except Exception as e:
        print(f"❌ ERREUR: {e}")
        print(f"   Type d'erreur: {type(e).__name__}")

if __name__ == '__main__':
    main()
