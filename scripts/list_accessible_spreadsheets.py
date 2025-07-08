#!/usr/bin/env python3
"""
Script pour lister tous les spreadsheets accessibles par le service account.
"""
import gspread
from google.oauth2.service_account import Credentials

def main():
    print("📊 Liste des spreadsheets accessibles")
    print("=" * 50)
    
    credentials_file = "config/google_credentials.json"
    
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
        
        # Lister tous les spreadsheets accessibles
        print("📋 Spreadsheets accessibles par le service account:")
        print()
        
        spreadsheets = gc.openall()
        
        if not spreadsheets:
            print("❌ Aucun spreadsheet accessible")
            print("   Le service account n'a accès à aucun spreadsheet.")
            print("   Assurez-vous de partager votre spreadsheet avec l'email du service account.")
        else:
            for i, spreadsheet in enumerate(spreadsheets, 1):
                print(f"{i}. {spreadsheet.title}")
                print(f"   ID: {spreadsheet.id}")
                print(f"   URL: {spreadsheet.url}")
                
                # Lister les worksheets
                try:
                    worksheets = spreadsheet.worksheets()
                    print(f"   Worksheets: {', '.join([ws.title for ws in worksheets])}")
                except Exception as e:
                    print(f"   Erreur lors de la lecture des worksheets: {e}")
                print()
                
    except Exception as e:
        print(f"❌ ERREUR: {e}")
        print(f"   Type d'erreur: {type(e).__name__}")

if __name__ == '__main__':
    main()
