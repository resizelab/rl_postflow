#!/usr/bin/env python3
"""
Script pour accéder au spreadsheet original via gspread avec différentes approches.
"""
import gspread
from google.oauth2.service_account import Credentials
import json

def test_gspread_access():
    print("🔍 Test d'accès gspread au spreadsheet original")
    print("=" * 60)
    
    # Charger la configuration
    with open("config/integrations.json", 'r') as f:
        config = json.load(f)
    
    credentials_file = config['google_sheets']['service_account_file']
    spreadsheet_id = config['google_sheets']['spreadsheet_id']
    
    print(f"📊 Spreadsheet ID: {spreadsheet_id}")
    print()
    
    # Test 1: Avec scopes minimum
    print("🧪 Test 1: Scopes minimum")
    try:
        scopes = ['https://www.googleapis.com/auth/spreadsheets']
        creds = Credentials.from_service_account_file(credentials_file, scopes=scopes)
        gc = gspread.authorize(creds)
        
        print("   📡 Client gspread créé")
        
        # Essayer d'ouvrir avec gspread
        spreadsheet = gc.open_by_key(spreadsheet_id)
        
        print(f"   ✅ Succès ! Titre: {spreadsheet.title}")
        print(f"   🔗 URL: {spreadsheet.url}")
        
        # Lister les worksheets
        worksheets = spreadsheet.worksheets()
        print(f"   📑 Worksheets ({len(worksheets)}):")
        
        for i, ws in enumerate(worksheets, 1):
            print(f"      {i}. {ws.title} (ID: {ws.id}, {ws.row_count}x{ws.col_count})")
        
        # Tester l'accès aux données
        if worksheets:
            first_sheet = worksheets[0]
            print(f"\n   📋 Test lecture première sheet '{first_sheet.title}':")
            
            try:
                # Lire les 5 premières lignes
                values = first_sheet.get_all_values()[:5]
                print(f"      ✅ {len(values)} lignes lues")
                
                # Afficher un aperçu
                for i, row in enumerate(values, 1):
                    # Afficher seulement les 3 premières colonnes pour éviter trop de données
                    preview = row[:3] if len(row) > 3 else row
                    print(f"      Ligne {i}: {preview}")
                    
            except Exception as e:
                print(f"      ❌ Erreur lecture: {e}")
        
        return spreadsheet, worksheets
        
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
        print(f"   Type: {type(e).__name__}")
        return None, None

def suggest_worksheet_mapping(worksheets):
    """Suggérer un mapping des worksheets existants vers PostFlow."""
    print("\n🎯 Suggestions de mapping des worksheets:")
    
    if not worksheets:
        print("   ❌ Aucun worksheet disponible")
        return {}
    
    sheet_titles = [ws.title for ws in worksheets]
    mapping = {}
    
    # Chercher des correspondances pour SHOTS_TRACK
    shots_candidates = []
    for title in sheet_titles:
        if any(keyword in title.lower() for keyword in ['shot', 'plan', 'sequence', 'track', 'projet']):
            shots_candidates.append(title)
    
    if shots_candidates:
        print(f"   📋 Pour SHOTS_TRACK, candidats: {shots_candidates}")
        mapping['shots_track'] = shots_candidates[0]  # Prendre le premier
    else:
        print(f"   📋 Pour SHOTS_TRACK, utiliser: {sheet_titles[0]} (première sheet)")
        mapping['shots_track'] = sheet_titles[0]
    
    # Chercher des correspondances pour USERS_INFOS
    users_candidates = []
    for title in sheet_titles:
        if any(keyword in title.lower() for keyword in ['user', 'utilisateur', 'equipe', 'team', 'contact']):
            users_candidates.append(title)
    
    if users_candidates:
        print(f"   👤 Pour USERS_INFOS, candidats: {users_candidates}")
        mapping['users_infos'] = users_candidates[0]
    elif len(sheet_titles) > 1:
        print(f"   👤 Pour USERS_INFOS, utiliser: {sheet_titles[1]} (deuxième sheet)")
        mapping['users_infos'] = sheet_titles[1]
    else:
        print(f"   👤 Pour USERS_INFOS, créer une nouvelle sheet")
        mapping['users_infos'] = 'USERS_INFOS'  # À créer
    
    return mapping

def update_config_with_mapping(mapping):
    """Mettre à jour la configuration avec le mapping."""
    print(f"\n🔧 Mise à jour de la configuration:")
    
    config_updates = []
    
    if 'shots_track' in mapping:
        config_updates.append(f'   "worksheet_shots_tracks": "{mapping["shots_track"]}"')
    
    if 'users_infos' in mapping:
        config_updates.append(f'   "worksheet_users": "{mapping["users_infos"]}"')
    
    if config_updates:
        print("   Mettre à jour config/integrations.json avec:")
        for update in config_updates:
            print(f"   {update}")

def main():
    print("🚀 Analyse du spreadsheet original PostFlow")
    print("=" * 60)
    
    spreadsheet, worksheets = test_gspread_access()
    
    if spreadsheet and worksheets:
        mapping = suggest_worksheet_mapping(worksheets)
        update_config_with_mapping(mapping)
        
        print(f"\n🎉 Accès au spreadsheet réussi !")
        print(f"   Vous pouvez maintenant utiliser ce spreadsheet avec PostFlow")
        
    else:
        print(f"\n❌ Impossible d'accéder au spreadsheet")
        print(f"   Vérifiez que le service account a bien les droits d'accès")

if __name__ == '__main__':
    main()
