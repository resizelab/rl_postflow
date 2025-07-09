"""
Guide de configuration Google Sheets pour PostFlow
"""

import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


def show_configuration_guide():
    """Affiche le guide de configuration Google Sheets."""
    
    print("📋 GUIDE DE CONFIGURATION GOOGLE SHEETS")
    print("="*50)
    
    print("\n1️⃣ RÉCUPÉRER L'ID DU SPREADSHEET")
    print("   • Ouvrez votre Google Sheets dans le navigateur")
    print("   • L'URL ressemble à: https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit")
    print("   • Copiez la partie [SPREADSHEET_ID] (entre /d/ et /edit)")
    print("   • Exemple: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms")
    
    print("\n2️⃣ PARTAGER LE SPREADSHEET")
    print("   • Dans Google Sheets, cliquez sur 'Partager'")
    print("   • Ajoutez l'email du service account (dans google_credentials.json)")
    print("   • Donnez les permissions 'Éditeur'")
    
    print("\n3️⃣ CRÉER LES WORKSHEETS")
    print("   • Worksheet 1: 'SHOTS_TRACK' (pour le suivi des plans)")
    print("   • Worksheet 2: 'USERS_INFOS' (pour les informations utilisateurs)")
    
    print("\n4️⃣ STRUCTURE SHOTS_TRACK")
    print("   Colonnes recommandées (ligne 1):")
    print("   A: Shot ID, B: Scene, C: Description, D: Source File")
    print("   E: Timecode In, F: Timecode Out, G: Duration, H: Status")
    print("   I: Stage, J: Progress %, K: Assigned To, L: Priority")
    print("   M: Notes, N: AE Project, O: Last Updated, P: Frame.io Link")
    
    print("\n5️⃣ STRUCTURE USERS_INFOS")
    print("   Colonnes recommandées (ligne 1):")
    print("   A: Name, B: Discord ID, C: Email, D: Role")
    print("   E: Department, F: Active, G: Shot Assignment, H: Notes")
    
    print("\n6️⃣ METTRE À JOUR LA CONFIGURATION")
    print("   Remplacez 'YOUR_SPREADSHEET_ID' dans config/integrations.json")
    print("   par votre vrai ID de spreadsheet")


def get_service_account_email():
    """Récupère l'email du service account depuis les credentials."""
    try:
        credentials_path = Path("config/google_credentials.json")
        if not credentials_path.exists():
            print("❌ Fichier config/google_credentials.json non trouvé")
            return None
        
        with open(credentials_path, 'r') as f:
            credentials = json.load(f)
        
        email = credentials.get('client_email')
        if email:
            print(f"📧 Email du service account: {email}")
            print("   👆 Utilisez cet email pour partager votre Google Sheets")
            return email
        else:
            print("❌ Email du service account non trouvé dans les credentials")
            return None
            
    except Exception as e:
        print(f"❌ Erreur lecture credentials: {e}")
        return None


def update_spreadsheet_id():
    """Interface pour mettre à jour l'ID du spreadsheet."""
    print("\n🔧 MISE À JOUR DE LA CONFIGURATION")
    print("-" * 40)
    
    config_path = Path("config/integrations.json")
    if not config_path.exists():
        print("❌ Fichier config/integrations.json non trouvé")
        return False
    
    print("Entrez l'ID de votre Google Spreadsheet:")
    print("(Exemple: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms)")
    
    spreadsheet_id = input("Spreadsheet ID: ").strip()
    
    if not spreadsheet_id or spreadsheet_id == "YOUR_SPREADSHEET_ID":
        print("❌ ID invalide")
        return False
    
    try:
        # Charger la configuration
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        # Mettre à jour l'ID
        if 'google_sheets' not in config:
            config['google_sheets'] = {}
        
        config['google_sheets']['spreadsheet_id'] = spreadsheet_id
        
        # Ajouter les noms des worksheets
        config['google_sheets']['worksheet_shots_tracks'] = 'SHOTS_TRACK'
        config['google_sheets']['worksheet_users'] = 'USERS_INFOS'
        
        # Sauvegarder
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"✅ Configuration mise à jour avec l'ID: {spreadsheet_id}")
        print("✅ Worksheets configurés: SHOTS_TRACK, USERS_INFOS")
        return True
        
    except Exception as e:
        print(f"❌ Erreur mise à jour: {e}")
        return False


def main():
    """Fonction principale."""
    print("🚀 CONFIGURATION GOOGLE SHEETS - PostFlow v0.1.4b")
    print("=" * 55)
    
    # Afficher le guide
    show_configuration_guide()
    
    print("\n" + "="*50)
    
    # Récupérer l'email du service account
    service_email = get_service_account_email()
    
    print("\n" + "="*50)
    
    # Proposer de mettre à jour la configuration
    response = input("\nVoulez-vous mettre à jour l'ID du spreadsheet maintenant? (y/n): ").lower().strip()
    
    if response == 'y':
        if update_spreadsheet_id():
            print("\n🎉 Configuration terminée!")
            print("🧪 Vous pouvez maintenant tester avec: python scripts/test_google_sheets_config.py")
        else:
            print("\n❌ Configuration échouée")
    else:
        print("\n💡 N'oubliez pas de mettre à jour manuellement config/integrations.json")
    
    print("\n📚 Documentation complète: INTEGRATION_COMPLETE.md")


if __name__ == "__main__":
    main()
