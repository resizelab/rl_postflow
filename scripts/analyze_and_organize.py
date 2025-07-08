#!/usr/bin/env python3
"""
Script d'analyse complète de la structure du spreadsheet pour adapter PostFlow.
"""
import gspread
from google.oauth2.service_account import Credentials
import json
from pathlib import Path

def analyze_spreadsheet_structure():
    print("🔍 Analyse complète de la structure du spreadsheet")
    print("=" * 60)
    
    # Charger la configuration
    with open("config/integrations.json", 'r') as f:
        config = json.load(f)
    
    credentials_file = config['google_sheets']['service_account_file']
    spreadsheet_id = config['google_sheets']['spreadsheet_id']
    
    print(f"📊 Spreadsheet: {spreadsheet_id}")
    
    try:
        # Connexion
        scopes = ['https://www.googleapis.com/auth/spreadsheets']
        creds = Credentials.from_service_account_file(credentials_file, scopes=scopes)
        gc = gspread.authorize(creds)
        spreadsheet = gc.open_by_key(spreadsheet_id)
        
        print(f"✅ Connexion réussie: {spreadsheet.title}")
        
        # Analyser chaque worksheet
        worksheets = spreadsheet.worksheets()
        analysis = {}
        
        for ws in worksheets:
            print(f"\n📑 Analyse de '{ws.title}':")
            
            # Lire les headers (première ligne)
            headers = ws.row_values(1) if ws.row_count > 0 else []
            
            # Lire quelques lignes de données pour comprendre la structure
            sample_data = []
            for i in range(2, min(6, ws.row_count + 1)):  # Lignes 2-5
                row_data = ws.row_values(i)
                if any(cell.strip() for cell in row_data):  # Si la ligne n'est pas vide
                    sample_data.append(row_data)
            
            analysis[ws.title] = {
                'id': ws.id,
                'size': f"{ws.row_count}x{ws.col_count}",
                'headers': headers,
                'sample_data': sample_data[:3],  # Premières 3 lignes non vides
                'data_rows': len(sample_data)
            }
            
            print(f"   📏 Taille: {ws.row_count} lignes x {ws.col_count} colonnes")
            print(f"   📋 Headers ({len(headers)}): {headers[:5]}..." if len(headers) > 5 else f"   📋 Headers: {headers}")
            print(f"   📊 Données: {len(sample_data)} lignes d'exemple")
        
        return analysis
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None

def map_columns_to_postflow(analysis):
    """Mapper les colonnes existantes vers les champs PostFlow."""
    print(f"\n🎯 Mapping des colonnes vers PostFlow")
    print("=" * 40)
    
    mapping = {}
    
    for sheet_name, data in analysis.items():
        print(f"\n📑 Sheet: {sheet_name}")
        headers = data['headers']
        
        # Colonnes PostFlow recherchées
        postflow_fields = {
            'shot_name': ['shot', 'plan', 'nomenclature', 'name', 'nom'],
            'status': ['status', 'statut', 'état', 'etat', 'state'],
            'frame_io_link': ['frameio', 'frame.io', 'link', 'lien', 'url'],
            'assigned_to': ['assigned', 'assigné', 'responsable', 'user', 'utilisateur'],
            'priority': ['priority', 'priorité', 'priorite', 'urgent'],
            'created': ['created', 'créé', 'cree', 'date', 'création'],
            'updated': ['updated', 'modifié', 'modifie', 'maj', 'last'],
            'notes': ['notes', 'commentaire', 'comment', 'description', 'desc'],
            'type': ['type', 'category', 'catégorie', 'genre'],
            'progress': ['progress', 'progression', 'avancement', '%', 'percent']
        }
        
        sheet_mapping = {}
        
        for postflow_field, keywords in postflow_fields.items():
            found_column = None
            for i, header in enumerate(headers):
                header_lower = header.lower().strip()
                if any(keyword in header_lower for keyword in keywords):
                    found_column = {
                        'column_index': i,
                        'column_name': header,
                        'confidence': 'high' if header_lower in keywords else 'medium'
                    }
                    break
            
            if found_column:
                sheet_mapping[postflow_field] = found_column
                print(f"   ✅ {postflow_field}: colonne '{found_column['column_name']}' (index {found_column['column_index']})")
            else:
                print(f"   ❌ {postflow_field}: non trouvé")
        
        mapping[sheet_name] = sheet_mapping
    
    return mapping

def generate_config_updates(analysis, mapping):
    """Générer les mises à jour de configuration nécessaires."""
    print(f"\n🔧 Configuration recommandée")
    print("=" * 30)
    
    # Identifier la sheet principale (SHOTS_TRACK)
    shots_sheet = None
    users_sheet = None
    
    for sheet_name in analysis.keys():
        sheet_lower = sheet_name.lower()
        if 'shot' in sheet_lower or 'track' in sheet_lower:
            shots_sheet = sheet_name
        elif 'user' in sheet_lower or 'info' in sheet_lower:
            users_sheet = sheet_name
    
    # Si pas trouvé par nom, prendre les 2 premières sheets
    sheet_names = list(analysis.keys())
    if not shots_sheet:
        shots_sheet = sheet_names[0] if sheet_names else 'SHOTS_TRACK'
    if not users_sheet and len(sheet_names) > 1:
        users_sheet = sheet_names[1]
    elif not users_sheet:
        users_sheet = 'USERS_INFOS'
    
    print(f"📋 Shots tracking: {shots_sheet}")
    print(f"👤 Users info: {users_sheet}")
    
    # Configuration JSON
    config_update = {
        "google_sheets": {
            "worksheet_shots_tracks": shots_sheet,
            "worksheet_users": users_sheet,
            "column_mapping": {}
        }
    }
    
    if shots_sheet in mapping:
        config_update["google_sheets"]["column_mapping"]["shots"] = mapping[shots_sheet]
    
    if users_sheet in mapping:
        config_update["google_sheets"]["column_mapping"]["users"] = mapping[users_sheet]
    
    return config_update

def organize_project_structure():
    """Réorganiser la structure du projet en parallèle."""
    print(f"\n🗂️ Réorganisation de la structure du projet")
    print("=" * 45)
    
    # Créer le dossier d'archivage pour les anciens tests
    archive_dir = Path("scripts/archive")
    archive_dir.mkdir(exist_ok=True)
    
    # Scripts à archiver (anciens tests)
    scripts_to_archive = [
        "scripts/test_spreadsheet_direct.py",
        "scripts/test_different_scopes.py", 
        "scripts/diagnose_credentials.py",
        "scripts/test_api_access.py",
        "scripts/create_new_test_spreadsheet.py",
        "scripts/create_test_spreadsheet.py",
        "scripts/list_accessible_spreadsheets.py",
        "scripts/debug_config.py"
    ]
    
    archived_count = 0
    for script_path in scripts_to_archive:
        script = Path(script_path)
        if script.exists():
            archive_path = archive_dir / script.name
            script.rename(archive_path)
            archived_count += 1
            print(f"   📦 Archivé: {script.name}")
    
    print(f"✅ {archived_count} scripts archivés dans scripts/archive/")
    
    # Créer un dossier pour les tests d'intégration actifs
    active_tests_dir = Path("scripts/integration")
    active_tests_dir.mkdir(exist_ok=True)
    
    # Scripts à garder actifs
    active_scripts = [
        "scripts/test_google_sheets_real.py",
        "scripts/share_spreadsheet.py",
        "scripts/add_owner_spreadsheet.py",
        "scripts/get_service_account_email.py"
    ]
    
    moved_count = 0
    for script_path in active_scripts:
        script = Path(script_path)
        if script.exists():
            new_path = active_tests_dir / script.name
            if not new_path.exists():  # Éviter d'écraser
                script.rename(new_path)
                moved_count += 1
                print(f"   ✅ Déplacé vers integration/: {script.name}")
    
    print(f"✅ {moved_count} scripts actifs organisés dans scripts/integration/")
    
    return {
        'archived': archived_count,
        'moved': moved_count,
        'archive_dir': str(archive_dir),
        'active_dir': str(active_tests_dir)
    }

def create_adaptation_script(config_update):
    """Créer un script d'adaptation pour la nouvelle structure."""
    print(f"\n🛠️ Création du script d'adaptation")
    print("=" * 35)
    
    adaptation_script = """#!/usr/bin/env python3
\"\"\"
Script d'adaptation PostFlow pour la structure de spreadsheet existante.
Généré automatiquement d'après l'analyse de votre spreadsheet.
\"\"\"

import json
from pathlib import Path

# Configuration détectée
DETECTED_CONFIG = """ + json.dumps(config_update, indent=4) + """

def update_integrations_config():
    \"\"\"Mettre à jour la configuration d'intégration.\"\"\"
    config_path = Path("config/integrations.json")
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Mettre à jour la section google_sheets
    config["google_sheets"].update(DETECTED_CONFIG["google_sheets"])
    
    # Sauvegarder
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)
    
    print("✅ Configuration mise à jour")

def show_mapping_info():
    \"\"\"Afficher les informations de mapping.\"\"\"
    print("🎯 Mapping des colonnes détecté:")
    
    if "shots" in DETECTED_CONFIG["google_sheets"]["column_mapping"]:
        shots_mapping = DETECTED_CONFIG["google_sheets"]["column_mapping"]["shots"]
        print("\\n📋 SHOTS_TRACK:")
        for field, info in shots_mapping.items():
            print(f"   {field}: {info['column_name']} (colonne {info['column_index']})")
    
    if "users" in DETECTED_CONFIG["google_sheets"]["column_mapping"]:
        users_mapping = DETECTED_CONFIG["google_sheets"]["column_mapping"]["users"]
        print("\\n👤 USERS_INFOS:")
        for field, info in users_mapping.items():
            print(f"   {field}: {info['column_name']} (colonne {info['column_index']})")

if __name__ == "__main__":
    print("🔧 Adaptation PostFlow - Structure Spreadsheet")
    print("=" * 50)
    
    show_mapping_info()
    
    response = input("\\n❓ Appliquer cette configuration ? (y/N): ")
    if response.lower() == 'y':
        update_integrations_config()
        print("🎉 Configuration appliquée !")
    else:
        print("ℹ️ Configuration non appliquée")
"""
    
    script_path = Path("scripts/adapt_spreadsheet_structure.py")
    with open(script_path, 'w') as f:
        f.write(adaptation_script)
    
    print(f"✅ Script créé: {script_path}")
    return script_path

def main():
    print("🚀 Analyse et adaptation PostFlow v0.1.4b")
    print("=" * 60)
    
    # 1. Analyser la structure
    analysis = analyze_spreadsheet_structure()
    if not analysis:
        print("❌ Impossible d'analyser le spreadsheet")
        return
    
    # 2. Mapper les colonnes
    mapping = map_columns_to_postflow(analysis)
    
    # 3. Générer la configuration
    config_update = generate_config_updates(analysis, mapping)
    
    # 4. Réorganiser le projet
    organization_result = organize_project_structure()
    
    # 5. Créer le script d'adaptation
    adaptation_script = create_adaptation_script(config_update)
    
    print(f"\n🎉 Analyse terminée !")
    print(f"📊 {len(analysis)} worksheets analysés")
    print(f"📦 {organization_result['archived']} scripts archivés")
    print(f"✅ {organization_result['moved']} scripts organisés")
    print(f"🛠️ Script d'adaptation créé: {adaptation_script}")
    
    print(f"\n🎯 Prochaines étapes:")
    print(f"1. Exécuter: python {adaptation_script}")
    print(f"2. Tester: python scripts/integration/test_google_sheets_real.py")
    print(f"3. Valider l'intégration complète")

if __name__ == '__main__':
    main()
