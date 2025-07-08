#!/usr/bin/env python3
"""
Générateur de vignettes PostFlow avec Google Drive
Upload les images dans un dossier organisé et insère les vraies images dans Google Sheets
"""

import os
import json
import gspread
import subprocess
from pathlib import Path
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

class DriveThumbailGenerator:
    def __init__(self):
        """Initialise le générateur avec Google Drive."""
        self.setup_google_services()
        self.setup_mapping()
        self.setup_paths()
        self.setup_drive_folder()
    
    def setup_google_services(self):
        """Configure les services Google (Sheets + Drive)."""
        with open('config/integrations.json', 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        # Scopes pour Sheets + Drive
        scope = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        creds = Credentials.from_service_account_file('config/google_credentials.json', scopes=scope)
        
        # Google Sheets
        self.gc = gspread.authorize(creds)
        spreadsheet_id = config['google_sheets']['spreadsheet_id']
        self.sh = self.gc.open_by_key(spreadsheet_id)
        self.worksheet = self.sh.worksheet('SHOTS_TRACK')
        
        # Google Drive
        self.drive_service = build('drive', 'v3', credentials=creds)
        
        print("✅ Services Google connectés (Sheets + Drive)")
    
    def setup_mapping(self):
        """Configure le mapping des colonnes."""
        with open('config/sheets_mapping.json', 'r', encoding='utf-8') as f:
            mapping = json.load(f)
        
        self.column_mapping = {}
        shots_mapping = mapping['worksheets']['SHOTS_TRACK']['mapping']
        
        for field, info in shots_mapping.items():
            if 'column_index' in info:
                self.column_mapping[field] = info['column_index'] - 1  # Convert to 0-based
    
    def setup_paths(self):
        """Configure les chemins."""
        self.rushes_path = "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS"
        self.video_extensions = ['.mov', '.mp4', '.avi', '.mxf', '.r3d', '.braw', '.prores']
        
        print(f"📁 Chemin des rushs: {self.rushes_path}")
        print(f"📁 Accessible: {os.path.exists(self.rushes_path)}")
    
    def setup_drive_folder(self):
        """Crée et configure le dossier Google Drive pour les vignettes."""
        # Structure: PostFlow_Thumbnails/UNDLM_Project/2025-07/
        from datetime import datetime
        
        project_name = "UNDLM_Project"
        current_month = datetime.now().strftime("%Y-%m")
        
        # Créer le dossier principal
        main_folder_name = "PostFlow_Thumbnails"
        main_folder_id = self.get_or_create_folder(main_folder_name)
        
        # Créer le dossier projet
        project_folder_id = self.get_or_create_folder(project_name, main_folder_id)
        
        # Créer le dossier du mois
        self.thumbnails_folder_id = self.get_or_create_folder(current_month, project_folder_id)
        
        print(f"📁 Dossier Drive configuré: {main_folder_name}/{project_name}/{current_month}")
        print(f"🔗 Folder ID: {self.thumbnails_folder_id}")
    
    def get_or_create_folder(self, folder_name, parent_id=None):
        """Trouve ou crée un dossier dans Google Drive."""
        # Chercher le dossier existant
        query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder'"
        if parent_id:
            query += f" and '{parent_id}' in parents"
        
        results = self.drive_service.files().list(q=query).execute()
        files = results.get('files', [])
        
        if files:
            folder_id = files[0]['id']
            print(f"📁 Dossier trouvé: {folder_name}")
            return folder_id
        
        # Créer le dossier
        folder_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder'
        }
        if parent_id:
            folder_metadata['parents'] = [parent_id]
        
        folder = self.drive_service.files().create(body=folder_metadata).execute()
        folder_id = folder.get('id')
        
        print(f"📁 Dossier créé: {folder_name}")
        return folder_id
    
    def get_field_value(self, row_data, field_name):
        """Récupère la valeur d'un champ."""
        if field_name in self.column_mapping:
            col_idx = self.column_mapping[field_name]
            if col_idx < len(row_data):
                return row_data[col_idx].strip()
        return ""
    
    def find_rush_file(self, nomenclature):
        """Trouve le fichier rush correspondant à la nomenclature."""
        if not nomenclature or not os.path.exists(self.rushes_path):
            return None
        
        nomenclature = nomenclature.strip()
        
        try:
            for file in os.listdir(self.rushes_path):
                if not any(file.lower().endswith(ext) for ext in self.video_extensions):
                    continue
                
                file_path = os.path.join(self.rushes_path, file)
                file_base = os.path.splitext(file)[0]
                
                # Différents patterns de matching
                if (nomenclature == file_base or 
                    file_base.startswith(nomenclature) or 
                    nomenclature in file_base):
                    return file_path
                
                # Match par numéro de plan
                plan_number = nomenclature.split('_')[-1] if '_' in nomenclature else nomenclature
                if plan_number in file_base:
                    return file_path
            
            return None
            
        except Exception as e:
            print(f"❌ Erreur recherche fichier: {e}")
            return None
    
    def extract_first_frame(self, source_file, output_name):
        """Extrait la première frame du fichier vidéo."""
        try:
            temp_dir = Path("temp/thumbnails")
            temp_dir.mkdir(parents=True, exist_ok=True)
            
            temp_image = temp_dir / f"{output_name}.jpg"
            
            cmd = [
                'ffmpeg',
                '-i', source_file,
                '-vframes', '1',
                '-q:v', '2',
                '-vf', 'scale=320:180',
                '-y',
                str(temp_image)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0 and temp_image.exists():
                return str(temp_image)
            else:
                print(f"   ❌ Erreur ffmpeg: {result.stderr}")
                return None
                
        except Exception as e:
            print(f"   ❌ Erreur extraction: {e}")
            return None
    
    def upload_to_drive(self, image_path, file_name):
        """Upload une image vers Google Drive et retourne l'URL publique."""
        try:
            # Métadonnées du fichier
            file_metadata = {
                'name': file_name,
                'parents': [self.thumbnails_folder_id]
            }
            
            # Upload du fichier
            media = MediaFileUpload(image_path, mimetype='image/jpeg')
            file = self.drive_service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id'
            ).execute()
            
            file_id = file.get('id')
            
            # Rendre le fichier public
            permission = {
                'type': 'anyone',
                'role': 'reader'
            }
            self.drive_service.permissions().create(
                fileId=file_id,
                body=permission
            ).execute()
            
            # Générer l'URL publique pour affichage direct dans Google Sheets
            # Cette URL permet l'affichage direct sans redirection
            public_url = f"https://drive.google.com/thumbnail?id={file_id}&sz=w400"
            
            print(f"   ☁️  Uploadé vers Drive: {file_name}")
            return public_url
            
        except Exception as e:
            print(f"   ❌ Erreur upload Drive: {e}")
            return None
    
    def insert_image_formula(self, row_idx, image_url):
        """Insère la formule IMAGE() dans Google Sheets."""
        try:
            thumbnail_col = self.column_mapping.get('thumbnail', 12) + 1  # Convert to 1-based
            
            # Formule IMAGE() pour afficher l'image
            formula = f'=IMAGE("{image_url}")'
            self.worksheet.update_cell(row_idx, thumbnail_col, formula)
            
            return True
        except Exception as e:
            print(f"   ❌ Erreur insertion image: {e}")
            return False
    
    def generate_thumbnails_with_drive(self, max_shots=None, force_regenerate=False):
        """Génère les vignettes et les upload vers Google Drive."""
        print("🎬 GÉNÉRATEUR DE VIGNETTES POSTFLOW - GOOGLE DRIVE")
        print("=" * 65)
        
        # Vérifications
        if not os.path.exists(self.rushes_path):
            print(f"❌ Dossier des rushs non accessible: {self.rushes_path}")
            return
        
        try:
            subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
            print("✅ ffmpeg disponible")
        except:
            print("❌ ffmpeg non disponible")
            return
        
        # Lecture du Google Sheet
        print("\n📊 Lecture du Google Sheet...")
        all_data = self.worksheet.get_all_values()
        
        processed = 0
        generated = 0
        skipped = 0
        errors = 0
        
        for row_idx, row_data in enumerate(all_data[1:], start=2):
            if max_shots and processed >= max_shots:
                break
            
            processed += 1
            
            shot_name = self.get_field_value(row_data, 'shot_name')
            nomenclature = self.get_field_value(row_data, 'nomenclature')
            current_thumbnail = self.get_field_value(row_data, 'thumbnail')
            
            print(f"\n📋 Plan {shot_name} ({processed}/{min(max_shots or 999, len(all_data)-1)})")
            print(f"   Nomenclature: '{nomenclature}'")
            
            # Vérifier si on doit générer
            if current_thumbnail and "IMAGE(" in current_thumbnail and not force_regenerate:
                print(f"   ⏭️  Image déjà présente")
                skipped += 1
                continue
            
            # Trouver le fichier rush
            search_name = nomenclature if nomenclature else shot_name
            if not search_name:
                print(f"   ❌ Pas de nomenclature")
                errors += 1
                continue
            
            rush_file = self.find_rush_file(search_name)
            if not rush_file:
                print(f"   ❌ Rush non trouvé: '{search_name}'")
                errors += 1
                continue
            
            print(f"   📁 Rush: {os.path.basename(rush_file)}")
            
            # Extraire la frame
            output_name = f"thumb_{shot_name}_{nomenclature}".replace(' ', '_')
            thumbnail_path = self.extract_first_frame(rush_file, output_name)
            if not thumbnail_path:
                print(f"   ❌ Échec extraction")
                errors += 1
                continue
            
            # Upload vers Drive
            drive_filename = f"{shot_name}_{nomenclature}.jpg"
            image_url = self.upload_to_drive(thumbnail_path, drive_filename)
            if not image_url:
                print(f"   ❌ Échec upload Drive")
                errors += 1
                continue
            
            # Insérer dans Google Sheets
            if self.insert_image_formula(row_idx, image_url):
                print(f"   ✅ Image insérée dans Google Sheets")
                generated += 1
                
                # Nettoyer le fichier temporaire
                os.remove(thumbnail_path)
            else:
                errors += 1
        
        # Résumé
        print(f"\n🎉 TERMINÉ!")
        print(f"   Plans traités: {processed}")
        print(f"   Images générées: {generated}")
        print(f"   Ignorés: {skipped}")
        print(f"   Erreurs: {errors}")
        
        if generated > 0:
            print(f"\n☁️  Images stockées dans Google Drive")
            print(f"🔗 Google Sheet: {self.sh.url}")

def main():
    """Fonction principale."""
    import sys
    
    max_shots = 5  # Par défaut
    force_regenerate = False
    
    if len(sys.argv) > 1:
        if sys.argv[1].lower() == 'all':
            max_shots = None
        elif sys.argv[1].lower() == 'force':
            force_regenerate = True
        else:
            try:
                max_shots = int(sys.argv[1])
            except ValueError:
                print("Usage: python generate_drive_thumbnails.py [nombre|all|force]")
                return
    
    if len(sys.argv) > 2 and sys.argv[2].lower() == 'force':
        force_regenerate = True
    
    generator = DriveThumbailGenerator()
    generator.generate_thumbnails_with_drive(max_shots, force_regenerate)

if __name__ == "__main__":
    main()
