#!/usr/bin/env python3
"""
Générateur de vignettes PostFlow - Version Production
Utilise le chemin réel des rushs et extrait la première frame
"""

import os
import json
import gspread
import subprocess
from pathlib import Path
from google.oauth2.service_account import Credentials

class ProductionThumbnailGenerator:
    def __init__(self):
        """Initialise le générateur de vignettes production."""
        self.setup_google_sheets()
        self.setup_mapping()
        self.setup_paths()
    
    def setup_google_sheets(self):
        """Configure la connexion Google Sheets."""
        with open('config/integrations.json', 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        scope = ['https://www.googleapis.com/auth/spreadsheets']
        creds = Credentials.from_service_account_file('config/google_credentials.json', scopes=scope)
        self.gc = gspread.authorize(creds)
        
        spreadsheet_id = config['google_sheets']['spreadsheet_id']
        self.sh = self.gc.open_by_key(spreadsheet_id)
        self.worksheet = self.sh.worksheet('SHOTS_TRACK')
    
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
        """Configure les chemins des fichiers sources."""
        # Chemin principal des rushs
        self.rushes_path = "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS"
        
        # Extensions vidéo supportées
        self.video_extensions = ['.mov', '.mp4', '.avi', '.mxf', '.r3d', '.braw', '.prores']
        
        print(f"📁 Chemin des rushs: {self.rushes_path}")
        print(f"📁 Accessible: {os.path.exists(self.rushes_path)}")
    
    def get_field_value(self, row_data, field_name):
        """Récupère la valeur d'un champ depuis une ligne de données."""
        if field_name in self.column_mapping:
            col_idx = self.column_mapping[field_name]
            if col_idx < len(row_data):
                return row_data[col_idx].strip()
        return ""
    
    def find_rush_file(self, nomenclature):
        """
        Trouve le fichier rush correspondant à la nomenclature.
        
        Args:
            nomenclature (str): Nomenclature du plan (ex: "001_REVEIL_HOPITAL")
            
        Returns:
            str: Chemin complet du fichier ou None
        """
        if not nomenclature or not os.path.exists(self.rushes_path):
            return None
        
        nomenclature = nomenclature.strip()
        
        # Lister tous les fichiers dans le dossier BY_SHOTS
        try:
            for file in os.listdir(self.rushes_path):
                file_path = os.path.join(self.rushes_path, file)
                
                # Vérifier si c'est un fichier vidéo
                if not any(file.lower().endswith(ext) for ext in self.video_extensions):
                    continue
                
                # Vérifier différents patterns de matching
                file_base = os.path.splitext(file)[0]
                
                # Match exact
                if nomenclature == file_base:
                    return file_path
                
                # Match avec nomenclature au début du nom de fichier
                if file_base.startswith(nomenclature):
                    return file_path
                
                # Match avec nomenclature dans le nom de fichier
                if nomenclature in file_base:
                    return file_path
                
                # Match inversé (fichier commence par le numéro de plan)
                plan_number = nomenclature.split('_')[0] if '_' in nomenclature else nomenclature
                if file_base.startswith(plan_number):
                    return file_path
            
            return None
            
        except PermissionError:
            print(f"❌ Pas d'accès au dossier {self.rushes_path}")
            return None
        except Exception as e:
            print(f"❌ Erreur lors de la recherche: {e}")
            return None
    
    def extract_first_frame(self, source_file):
        """
        Extrait la première frame du fichier vidéo.
        
        Args:
            source_file (str): Chemin vers le fichier source
            
        Returns:
            str: Chemin vers l'image générée ou None
        """
        try:
            # Créer le répertoire temporaire
            temp_dir = Path("temp/thumbnails")
            temp_dir.mkdir(parents=True, exist_ok=True)
            
            # Nom du fichier temporaire
            file_base = os.path.splitext(os.path.basename(source_file))[0]
            temp_image = temp_dir / f"thumb_{file_base}.jpg"
            
            # Commande ffmpeg pour extraire la première frame
            cmd = [
                'ffmpeg',
                '-i', source_file,
                '-vframes', '1',  # Une seule frame
                '-q:v', '2',  # Haute qualité
                '-vf', 'scale=320:180',  # Redimensionner à 320x180
                '-y',  # Overwrite
                str(temp_image)
            ]
            
            print(f"   🎬 Extraction: {' '.join(cmd)}")
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0 and temp_image.exists():
                print(f"   ✅ Frame extraite: {temp_image}")
                return str(temp_image)
            else:
                print(f"   ❌ Erreur ffmpeg: {result.stderr}")
                return None
                
        except Exception as e:
            print(f"   ❌ Erreur extraction: {e}")
            return None
    
    def upload_thumbnail_to_sheets(self, image_path, row_idx):
        """
        Upload la vignette vers Google Sheets.
        Pour l'instant, on met juste le nom du fichier.
        """
        try:
            thumbnail_col = self.column_mapping.get('thumbnail', 12) + 1  # Convert to 1-based
            
            # Pour l'instant, on met le nom de fichier
            # Plus tard on pourra uploader l'image vers un CDN
            image_name = os.path.basename(image_path)
            self.worksheet.update_cell(row_idx, thumbnail_col, f"✅ {image_name}")
            
            return True
        except Exception as e:
            print(f"   ❌ Erreur upload: {e}")
            return False
    
    def generate_all_thumbnails(self, max_shots=None, force_regenerate=False):
        """
        Génère les vignettes pour tous les plans.
        
        Args:
            max_shots (int): Nombre maximum de plans à traiter
            force_regenerate (bool): Forcer la régénération même si déjà présent
        """
        print("🎬 GÉNÉRATEUR DE VIGNETTES POSTFLOW - PRODUCTION")
        print("=" * 60)
        
        # Vérifier ffmpeg
        try:
            subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
            print("✅ ffmpeg disponible")
        except:
            print("❌ ffmpeg non disponible - installation: brew install ffmpeg")
            return
        
        # Vérifier l'accès au dossier des rushs
        if not os.path.exists(self.rushes_path):
            print(f"❌ Dossier des rushs non accessible: {self.rushes_path}")
            print("   Vérifiez que le volume est monté")
            return
        
        print(f"✅ Dossier des rushs accessible")
        
        # Lister les fichiers disponibles
        try:
            rush_files = [f for f in os.listdir(self.rushes_path) 
                         if any(f.lower().endswith(ext) for ext in self.video_extensions)]
            print(f"📁 {len(rush_files)} fichiers rushs trouvés")
            if len(rush_files) <= 10:  # Afficher si pas trop nombreux
                for f in rush_files[:10]:
                    print(f"   - {f}")
        except Exception as e:
            print(f"❌ Erreur lecture dossier: {e}")
            return
        
        # Lire les données du Google Sheet
        print("\n📊 Lecture du Google Sheet...")
        all_data = self.worksheet.get_all_values()
        headers = all_data[0]
        
        print(f"📋 {len(all_data)-1} plans trouvés dans le sheet")
        
        processed = 0
        generated = 0
        skipped = 0
        errors = 0
        
        for row_idx, row_data in enumerate(all_data[1:], start=2):
            if max_shots and processed >= max_shots:
                break
            
            processed += 1
            
            # Extraire les informations du plan
            shot_name = self.get_field_value(row_data, 'shot_name')
            nomenclature = self.get_field_value(row_data, 'nomenclature')
            current_thumbnail = self.get_field_value(row_data, 'thumbnail')
            
            print(f"\n📋 Plan {shot_name} ({processed}/{min(max_shots or 999, len(all_data)-1)})")
            print(f"   Nomenclature: '{nomenclature}'")
            
            # Vérifier si on doit générer la vignette
            if current_thumbnail and not force_regenerate and not current_thumbnail.startswith('Vignette:'):
                print(f"   ⏭️  Vignette existante (utiliser force_regenerate=True pour régénérer)")
                skipped += 1
                continue
            
            # Utiliser nomenclature ou shot_name pour trouver le fichier
            search_name = nomenclature if nomenclature else shot_name
            if not search_name:
                print(f"   ❌ Pas de nomenclature ni de nom de plan")
                errors += 1
                continue
            
            # Trouver le fichier rush
            rush_file = self.find_rush_file(search_name)
            if not rush_file:
                print(f"   ❌ Fichier rush non trouvé pour '{search_name}'")
                errors += 1
                continue
            
            print(f"   📁 Rush trouvé: {os.path.basename(rush_file)}")
            
            # Extraire la première frame
            thumbnail_path = self.extract_first_frame(rush_file)
            if not thumbnail_path:
                print(f"   ❌ Échec extraction de la frame")
                errors += 1
                continue
            
            # Uploader vers Google Sheets
            if self.upload_thumbnail_to_sheets(thumbnail_path, row_idx):
                print(f"   ✅ Vignette mise à jour dans Google Sheets")
                generated += 1
            else:
                errors += 1
        
        # Résumé
        print(f"\n🎉 TERMINÉ!")
        print(f"   Plans traités: {processed}")
        print(f"   Vignettes générées: {generated}")
        print(f"   Ignorés (déjà présents): {skipped}")
        print(f"   Erreurs: {errors}")
        
        if generated > 0:
            print(f"\n📁 Vignettes sauvegardées dans: temp/thumbnails/")
            print(f"🔗 Google Sheet mis à jour: {self.sh.url}")

def main():
    """Fonction principale."""
    import sys
    
    max_shots = None
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
                print("Usage: python generate_production_thumbnails.py [nombre|all|force]")
                return
    
    if len(sys.argv) > 2 and sys.argv[2].lower() == 'force':
        force_regenerate = True
    
    if max_shots is None:
        max_shots = 5  # Par défaut, traiter 5 plans
    
    generator = ProductionThumbnailGenerator()
    generator.generate_all_thumbnails(max_shots, force_regenerate)

if __name__ == "__main__":
    main()
