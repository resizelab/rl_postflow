#!/usr/bin/env python3
"""
Script pour diagnostiquer les credentials et APIs Google Cloud.
"""
import json
from google.oauth2.service_account import Credentials
import requests

def main():
    print("🔍 Diagnostic Google Cloud & Service Account")
    print("=" * 60)
    
    # Charger les credentials
    credentials_file = "config/google_credentials.json"
    
    try:
        # Lire le fichier de credentials
        with open(credentials_file, 'r') as f:
            creds_data = json.load(f)
        
        print("📋 Informations du Service Account:")
        print(f"   - Email: {creds_data.get('client_email', 'N/A')}")
        print(f"   - Project ID: {creds_data.get('project_id', 'N/A')}")
        print(f"   - Type: {creds_data.get('type', 'N/A')}")
        print(f"   - Auth URI: {creds_data.get('auth_uri', 'N/A')}")
        print()
        
        # Créer les credentials
        scopes = ['https://www.googleapis.com/auth/spreadsheets']
        creds = Credentials.from_service_account_file(credentials_file, scopes=scopes)
        
        print("✅ Credentials chargées avec succès")
        print(f"   - Service Account Email: {creds.service_account_email}")
        print(f"   - Project ID: {creds.project_id}")
        print()
        
        # Tester l'authentification avec une requête simple
        print("🔐 Test d'authentification...")
        
        # Obtenir un token d'accès
        from google.auth.transport.requests import Request
        creds.refresh(Request())
        
        if creds.token:
            print("✅ Token d'accès obtenu avec succès")
            print(f"   - Token (premiers 50 chars): {creds.token[:50]}...")
        else:
            print("❌ Impossible d'obtenir un token d'accès")
        
        print()
        print("🌐 URLs à vérifier dans Google Cloud Console:")
        project_id = creds_data.get('project_id', 'YOUR_PROJECT')
        print(f"   1. APIs activées: https://console.cloud.google.com/apis/dashboard?project={project_id}")
        print(f"   2. Service Accounts: https://console.cloud.google.com/iam-admin/serviceaccounts?project={project_id}")
        print(f"   3. Google Sheets API: https://console.cloud.google.com/apis/library/sheets.googleapis.com?project={project_id}")
        
        print()
        print("📝 Actions recommandées:")
        print("   1. Vérifiez que l'API Google Sheets est ACTIVÉE")
        print("   2. Vérifiez que l'API Google Drive est ACTIVÉE (optionnel)")
        print("   3. Vérifiez que le service account existe et a les bonnes permissions")
        print("   4. Essayez de créer un nouveau service account si nécessaire")
        
    except FileNotFoundError:
        print(f"❌ Fichier credentials non trouvé: {credentials_file}")
    except json.JSONDecodeError:
        print(f"❌ Fichier credentials invalide (JSON malformé)")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == '__main__':
    main()
