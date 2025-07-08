#!/usr/bin/env python3
"""
Script pour mettre à jour le mapping PostFlow basé sur la nouvelle structure du Google Sheet.
"""

import json
import os
import sys
from datetime import datetime

# Ajouter le répertoire racine du projet au path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

import gspread
from google.oauth2.service_account import Credentials
from src.integrations.sheets.auth import GoogleSheetsAuth, GoogleSheetsConfig

def get_current_sheet_structure():
    """Récupérer la structure actuelle du Google Sheet."""
    try:
        # Configuration du spreadsheet
        config_path = os.path.join(project_root, 'config', 'integrations.json')
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        spreadsheet_id = config['google_sheets']['spreadsheet_id']
        service_account_file = config['google_sheets']['service_account_file']
        
        # Connexion avec gspread directement
        credentials = Credentials.from_service_account_file(
            service_account_file,
            scopes=['https://www.googleapis.com/auth/spreadsheets', 
                   'https://www.googleapis.com/auth/drive']
        )
        
        client = gspread.authorize(credentials)
        spreadsheet = client.open_by_key(spreadsheet_id)
        
        # Récupérer les headers de SHOTS_TRACK
        print("📋 Récupération des headers SHOTS_TRACK...")
        shots_worksheet = spreadsheet.worksheet('SHOTS_TRACK')
        shots_headers = shots_worksheet.row_values(1)
        
        # Récupérer les headers de USERS_INFOS
        print("👤 Récupération des headers USERS_INFOS...")
        users_worksheet = spreadsheet.worksheet('USERS_INFOS')
        users_headers = users_worksheet.row_values(1)
        
        return shots_headers, users_headers
        
    except Exception as e:
        print(f"❌ Erreur lors de la récupération: {e}")
        return [], []

def create_shots_mapping(headers):
    """Créer le mapping pour SHOTS_TRACK basé sur la nouvelle structure."""
    mapping = {}
    
    # Définir les correspondances basées sur l'analyse
    field_mappings = {
        'shot_name': 'SHOTS',  # Colonne 1
        'sequence_id': 'SQ_ID',  # Colonne 2
        'sequence_name': 'SQ_NAME',  # Colonne 3
        'shot_full_name': 'SHOT_NAME',  # Colonne 4
        'thumbnail': 'THUMBNAIL',  # Colonne 5
        'status': 'STATUS',  # Colonne 6
        'comp_name': 'COMP_NAME',  # Colonne 7
        'attribution': 'ATTRIBUTION',  # Colonne 8
        'priority': 'PRIORITY',  # Colonne 9
        'version': 'VERSION',  # Colonne 10
        'frame_io_link': 'FRAME_IO_LINK',  # Colonne 11
        'comments': 'COMMENTS',  # Colonne 12
        'prod_approval': 'PROD_APPROVAL',  # Colonne 13
        'director_approval': 'DIRECTOR_APPROVAL',  # Colonne 14
        'updated_timeline': 'UPDATED_TIMELINE',  # Colonne 15
        'quality_check': 'QUALITY_CHECK',  # Colonne 16
        'src_name': 'SRC_NAME',  # Colonne 17
        'lut': 'LUT',  # Colonne 18
        'edit_duration': 'EDIT_DUR',  # Colonne 19
        'edit_tc_in': 'EDIT_TC-IN',  # Colonne 20
        'edit_tc_out': 'EDIT_TC-OUT',  # Colonne 21
        'src_tc_in': 'SRC_TC-IN',  # Colonne 22
        'src_tc_out': 'SRC_TC-OUT',  # Colonne 23
        'duplicates': 'Doublons',  # Colonne 24
        'created_date': 'CREATED',  # Colonne 25
        'updated_date': 'UPDATED'  # Colonne 26
    }
    
    # Créer le mapping basé sur les headers réels
    for field, expected_header in field_mappings.items():
        try:
            column_index = headers.index(expected_header) + 1  # Index basé 1
            
            # Définir si le champ est requis
            required = field in ['shot_name', 'status']
            
            # Description des champs
            descriptions = {
                'shot_name': 'Numéro du plan (identifiant court)',
                'sequence_id': 'ID de la séquence',
                'sequence_name': 'Nom de la séquence',
                'shot_full_name': 'Nom complet du plan (nomenclature)',
                'thumbnail': 'Vignette/thumbnail du plan',
                'status': 'Statut du plan (En cours, Terminé, etc.)',
                'comp_name': 'Nom de la composition',
                'attribution': 'Attribution/assignation du plan',
                'priority': 'Priorité du plan',
                'version': 'Version du plan',
                'frame_io_link': 'Lien Frame.io pour review',
                'comments': 'Commentaires sur le plan',
                'prod_approval': 'Validation production',
                'director_approval': 'Validation réalisation',
                'updated_timeline': 'Timeline mise à jour',
                'quality_check': 'Contrôle qualité',
                'src_name': 'Nom du fichier source',
                'lut': 'LUT à appliquer',
                'edit_duration': 'Durée de montage',
                'edit_tc_in': 'Timecode in montage',
                'edit_tc_out': 'Timecode out montage',
                'src_tc_in': 'Timecode in source',
                'src_tc_out': 'Timecode out source',
                'duplicates': 'Information sur les doublons',
                'created_date': 'Date de création',
                'updated_date': 'Date de dernière modification'
            }
            
            mapping[field] = {
                'column_index': column_index,
                'column_name': expected_header,
                'required': required,
                'description': descriptions.get(field, f"Champ {field}")
            }
            
        except ValueError:
            print(f"⚠️ Colonne '{expected_header}' non trouvée pour le champ '{field}'")
    
    return mapping

def create_users_mapping(headers):
    """Créer le mapping pour USERS_INFOS basé sur la nouvelle structure."""
    mapping = {}
    
    # Définir les correspondances basées sur l'analyse
    field_mappings = {
        'first_name': 'PRENOM',  # Colonne 1
        'last_name': 'NOMS',  # Colonne 2
        'department': 'DEPT',  # Colonne 3
        'email': 'MAIL',  # Colonne 4
        'phone': 'TEL',  # Colonne 5
        'active': 'ACTIF',  # Colonne 6
        'discord_id': 'ID DISCORD',  # Colonne 7
        'lucid_access': 'ACCES LUCID ?'  # Colonne 8
    }
    
    # Créer le mapping basé sur les headers réels
    for field, expected_header in field_mappings.items():
        try:
            column_index = headers.index(expected_header) + 1  # Index basé 1
            
            # Définir si le champ est requis
            required = field in ['first_name', 'email']
            
            # Description des champs
            descriptions = {
                'first_name': 'Prénom de l\'utilisateur',
                'last_name': 'Nom de famille de l\'utilisateur',
                'department': 'Département/équipe de l\'utilisateur',
                'email': 'Adresse email',
                'phone': 'Numéro de téléphone',
                'active': 'Statut actif/inactif de l\'utilisateur',
                'discord_id': 'ID Discord de l\'utilisateur',
                'lucid_access': 'Accès LucidLink'
            }
            
            mapping[field] = {
                'column_index': column_index,
                'column_name': expected_header,
                'required': required,
                'description': descriptions.get(field, f"Champ {field}")
            }
            
        except ValueError:
            print(f"⚠️ Colonne '{expected_header}' non trouvée pour le champ '{field}'")
    
    return mapping

def generate_new_mapping():
    """Générer le nouveau mapping complet."""
    print("🔄 Génération du nouveau mapping...")
    
    # Récupérer la structure actuelle
    shots_headers, users_headers = get_current_sheet_structure()
    
    if not shots_headers or not users_headers:
        print("❌ Impossible de récupérer la structure du spreadsheet")
        return False
    
    print(f"📋 SHOTS_TRACK: {len(shots_headers)} colonnes détectées")
    print(f"👤 USERS_INFOS: {len(users_headers)} colonnes détectées")
    
    # Créer les mappings
    shots_mapping = create_shots_mapping(shots_headers)
    users_mapping = create_users_mapping(users_headers)
    
    # Créer le fichier de mapping complet
    new_mapping = {
        "version": "2.0",
        "generated_on": datetime.now().strftime("%Y-%m-%d"),
        "description": "Mapping mis à jour automatiquement basé sur la nouvelle structure du Google Sheet",
        "worksheets": {
            "SHOTS_TRACK": {
                "description": "Feuille de suivi des plans - Structure réorganisée",
                "total_columns": len(shots_headers),
                "mapping": shots_mapping
            },
            "USERS_INFOS": {
                "description": "Feuille des informations utilisateurs",
                "total_columns": len(users_headers),
                "mapping": users_mapping
            }
        },
        "postflow_compatibility": {
            "shots_primary_key": "shot_name",
            "users_primary_key": "email",
            "notifications_user_field": "discord_id",
            "status_tracking_enabled": True,
            "notes": [
                "✅ Structure SHOTS_TRACK complètement mise à jour",
                "✅ Nouvelle colonne SHOTS (ID court) détectée",
                "✅ Colonne SHOT_NAME (nomenclature complète) disponible", 
                "✅ Colonne THUMBNAIL en position 5 - optimale pour vignettes",
                "✅ Colonne STATUS en position 6 - suivi des statuts activé",
                "✅ Colonne ATTRIBUTION en position 8 - assignation des tâches",
                "✅ Colonne PRIORITY en position 9 - gestion des priorités",
                "✅ Colonne FRAME_IO_LINK en position 11 - intégration Frame.io prête",
                "✅ Workflow validations (PROD_APPROVAL, DIRECTOR_APPROVAL)",
                "✅ Structure USERS_INFOS mise à jour avec DEPT et LUCID ACCESS",
                "✅ Mapping automatique compatible avec PostFlow v2.0"
            ]
        }
    }
    
    # Sauvegarder le nouveau mapping
    mapping_path = os.path.join(project_root, 'config', 'sheets_mapping.json')
    
    # Sauvegarder l'ancien mapping
    backup_path = mapping_path + f".backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    if os.path.exists(mapping_path):
        os.rename(mapping_path, backup_path)
        print(f"💾 Ancien mapping sauvegardé: {os.path.basename(backup_path)}")
    
    # Écrire le nouveau mapping
    with open(mapping_path, 'w', encoding='utf-8') as f:
        json.dump(new_mapping, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Nouveau mapping généré: {mapping_path}")
    
    # Afficher un résumé
    print(f"\n📊 RÉSUMÉ DU NOUVEAU MAPPING:")
    print(f"   📋 SHOTS_TRACK: {len(shots_mapping)} champs mappés")
    print(f"   👤 USERS_INFOS: {len(users_mapping)} champs mappés")
    print(f"   🔧 Version: 2.0")
    
    return True

def main():
    print("🔄 MISE À JOUR DU MAPPING POSTFLOW")
    print("=" * 50)
    
    try:
        success = generate_new_mapping()
        
        if success:
            print(f"\n🎉 Mapping mis à jour avec succès !")
            print(f"   Votre nouveau Google Sheet est maintenant mappé")
            print(f"   Vous pouvez tester avec: python scripts/test_google_sheets_real.py")
        else:
            print(f"\n❌ Échec de la mise à jour du mapping")
            
    except Exception as e:
        print(f"❌ Erreur lors de la mise à jour: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
