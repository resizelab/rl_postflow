"""
Script pour récupérer l'email du service account Google
"""

import json
from pathlib import Path

def get_service_account_email():
    """Récupère l'email du service account depuis les credentials."""
    
    # Charger la config pour trouver le fichier de credentials
    config_path = Path("config/integrations.json")
    if not config_path.exists():
        print("❌ config/integrations.json non trouvé")
        return None
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    sheets_config = config.get('google_sheets', {})
    credentials_file = sheets_config.get('service_account_file')
    
    if not credentials_file:
        print("❌ service_account_file non configuré")
        return None
    
    credentials_path = Path(credentials_file)
    if not credentials_path.exists():
        print(f"❌ Fichier credentials non trouvé: {credentials_path}")
        return None
    
    # Lire le fichier de credentials
    with open(credentials_path, 'r') as f:
        credentials = json.load(f)
    
    service_account_email = credentials.get('client_email')
    
    print("📧 Email du service account Google:")
    print(f"   {service_account_email}")
    print()
    print("🔗 Actions à effectuer:")
    print("1. Ouvrir votre Google Spreadsheet")
    print("2. Cliquer sur 'Partager' (bouton bleu en haut à droite)")
    print("3. Ajouter cette adresse email avec les droits 'Éditeur':")
    print(f"   {service_account_email}")
    print("4. Cliquer sur 'Envoyer'")
    print()
    print("Puis relancer le test Google Sheets.")
    
    return service_account_email

if __name__ == "__main__":
    get_service_account_email()
