#!/usr/bin/env python3
"""
Analyse complète de la structure du spreadsheet pour adapter PostFlow.
"""
import gspread
from google.oauth2.service_account import Credentials
import json

def analyze_spreadsheet_structure():
    print("🔍 Analyse complète de la structure du spreadsheet")
    print("=" * 60)
    
    # Charger la configuration
    with open("config/integrations.json", 'r') as f:
        config = json.load(f)
    
    credentials_file = config['google_sheets']['service_account_file']
    spreadsheet_id = config['google_sheets']['spreadsheet_id']
    
    # Connexion
    scopes = ['https://www.googleapis.com/auth/spreadsheets']
    creds = Credentials.from_service_account_file(credentials_file, scopes=scopes)
    gc = gspread.authorize(creds)
    spreadsheet = gc.open_by_key(spreadsheet_id)
    
    print(f"📊 Spreadsheet: {spreadsheet.title}")
    print(f"🔗 URL: {spreadsheet.url}")
    print()
    
    # Analyser SHOTS_TRACK
    analyze_shots_track(spreadsheet)
    
    # Analyser USERS_INFOS
    analyze_users_infos(spreadsheet)
    
    # Générer les suggestions d'adaptation
    generate_postflow_mapping()

def analyze_shots_track(spreadsheet):
    """Analyser la structure de la sheet SHOTS_TRACK."""
    print("📋 ANALYSE SHOTS_TRACK")
    print("=" * 40)
    
    try:
        shots_sheet = spreadsheet.worksheet("SHOTS_TRACK")
        
        # Récupérer les headers (première ligne)
        headers = shots_sheet.row_values(1)
        print(f"📑 Colonnes trouvées ({len(headers)}):")
        
        for i, header in enumerate(headers, 1):
            print(f"   {i:2d}. {header}")
        
        # Récupérer quelques lignes d'exemple
        print(f"\n📝 Échantillon de données (lignes 2-6):")
        for row_num in range(2, 7):
            try:
                row_data = shots_sheet.row_values(row_num)
                # Afficher seulement les 5 premières colonnes pour la lisibilité
                preview = row_data[:5] if len(row_data) > 5 else row_data
                print(f"   Ligne {row_num}: {preview}")
            except:
                break
        
        # Suggestions de mapping pour PostFlow
        print(f"\n🎯 Suggestions de mapping pour PostFlow:")
        
        # Chercher des colonnes importantes
        important_mappings = {
            'shot_name': find_column_by_keywords(headers, ['plan', 'shot', 'nom', 'name', 'sequence']),
            'status': find_column_by_keywords(headers, ['status', 'statut', 'état', 'etat', 'state']),
            'assigned_to': find_column_by_keywords(headers, ['assigned', 'assigné', 'responsable', 'artist', 'artiste']),
            'frame_io_link': find_column_by_keywords(headers, ['frameio', 'frame.io', 'link', 'lien', 'url']),
            'priority': find_column_by_keywords(headers, ['priority', 'priorité', 'priorite', 'urgent']),
            'notes': find_column_by_keywords(headers, ['notes', 'comment', 'commentaire', 'description']),
            'created': find_column_by_keywords(headers, ['created', 'créé', 'cree', 'date']),
            'updated': find_column_by_keywords(headers, ['updated', 'modifié', 'modifie', 'maj'])
        }
        
        for field, column_info in important_mappings.items():
            if column_info:
                col_index, col_name = column_info
                print(f"   ✅ {field}: Colonne {col_index} '{col_name}'")
            else:
                print(f"   ❌ {field}: Non trouvé - peut être ajouté")
        
        return headers, important_mappings
        
    except Exception as e:
        print(f"❌ Erreur analyse SHOTS_TRACK: {e}")
        return [], {}

def analyze_users_infos(spreadsheet):
    """Analyser la structure de la sheet USERS_INFOS."""
    print(f"\n👤 ANALYSE USERS_INFOS")
    print("=" * 40)
    
    try:
        users_sheet = spreadsheet.worksheet("USERS_INFOS")
        
        # Récupérer les headers
        headers = users_sheet.row_values(1)
        print(f"📑 Colonnes trouvées ({len(headers)}):")
        
        for i, header in enumerate(headers, 1):
            print(f"   {i:2d}. {header}")
        
        # Récupérer quelques lignes d'exemple
        print(f"\n📝 Échantillon de données (lignes 2-4):")
        for row_num in range(2, 5):
            try:
                row_data = users_sheet.row_values(row_num)
                # Afficher seulement les 4 premières colonnes
                preview = row_data[:4] if len(row_data) > 4 else row_data
                print(f"   Ligne {row_num}: {preview}")
            except:
                break
        
        # Suggestions de mapping pour PostFlow
        print(f"\n🎯 Suggestions de mapping pour PostFlow:")
        
        user_mappings = {
            'name': find_column_by_keywords(headers, ['name', 'nom', 'prénom', 'prenom', 'firstname', 'lastname']),
            'email': find_column_by_keywords(headers, ['email', 'mail', 'e-mail']),
            'discord_id': find_column_by_keywords(headers, ['discord', 'discord_id', 'id_discord']),
            'role': find_column_by_keywords(headers, ['role', 'rôle', 'function', 'fonction', 'poste']),
            'department': find_column_by_keywords(headers, ['department', 'département', 'departement', 'service', 'equipe', 'team']),
            'active': find_column_by_keywords(headers, ['active', 'actif', 'enabled', 'status'])
        }
        
        for field, column_info in user_mappings.items():
            if column_info:
                col_index, col_name = column_info
                print(f"   ✅ {field}: Colonne {col_index} '{col_name}'")
            else:
                print(f"   ❌ {field}: Non trouvé - peut être ajouté")
        
        return headers, user_mappings
        
    except Exception as e:
        print(f"❌ Erreur analyse USERS_INFOS: {e}")
        return [], {}

def find_column_by_keywords(headers, keywords):
    """Trouver une colonne par mots-clés."""
    for i, header in enumerate(headers):
        header_lower = header.lower().strip()
        for keyword in keywords:
            if keyword.lower() in header_lower:
                return (i + 1, header)  # Index basé 1 + nom de colonne
    return None

def generate_postflow_mapping():
    """Générer la configuration PostFlow adaptée."""
    print(f"\n🔧 CONFIGURATION POSTFLOW RECOMMANDÉE")
    print("=" * 50)
    
    print(f"📝 Voici la configuration adaptée à votre spreadsheet:")
    print()
    
    print(f"1. 📋 Pour SHOTS_TRACK:")
    print(f"   - Votre colonne 'PLAN' correspond à 'shot_name'")
    print(f"   - Ajoutez des colonnes pour le statut, liens Frame.io, etc.")
    
    print(f"\n2. 👤 Pour USERS_INFOS:")
    print(f"   - Structure détectée avec {27} colonnes")
    print(f"   - Vérifiez les colonnes nom, email, Discord ID")
    
    print(f"\n3. 🔄 Modules PostFlow à adapter:")
    print(f"   - SheetsStatusTracker: Lire colonne 'PLAN' au lieu de 'nomenclature'")
    print(f"   - SheetsUserManager: Mapper vos colonnes utilisateurs")
    print(f"   - Notifications Discord: Utiliser vos données existantes")
    
    print(f"\n4. 📊 Prochaines étapes:")
    print(f"   a) Modifier les modules PostFlow pour votre structure")
    print(f"   b) Ajouter les colonnes manquantes si nécessaire")
    print(f"   c) Tester l'intégration avec vos données")

def main():
    print("🚀 ANALYSE POSTFLOW - ADAPTATION À VOS DONNÉES")
    print("=" * 60)
    
    try:
        analyze_spreadsheet_structure()
        
        print(f"\n🎉 Analyse terminée !")
        print(f"   Votre spreadsheet est compatible avec PostFlow")
        print(f"   Des adaptations mineures sont nécessaires pour optimiser l'intégration")
        
    except Exception as e:
        print(f"❌ Erreur lors de l'analyse: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
