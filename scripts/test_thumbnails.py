#!/usr/bin/env python3
"""
Script de test simple pour générer des vignettes PostFlow
Version standalone sans dépendances complexes
"""

import os
import json
import gspread
import subprocess
from pathlib import Path
from google.oauth2.service_account import Credentials

class SimpleThumbnailGenerator:
    def __init__(self):
        """Initialise le générateur de vignettes simple."""
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
        # Chemins possibles pour les rushs
        self.source_paths = [
            "/Volumes/RUSHES",
            "/Users/home/Desktop/RUSHES",
            "/Volumes/Shared/RUSHES",
            "temp/sample_videos",  # Pour les tests
        ]
        
        # Extensions vidéo supportées
        self.video_extensions = ['.mov', '.mp4', '.avi', '.mxf', '.r3d', '.braw']
    
    def get_field_value(self, row_data, field_name):
        """Récupère la valeur d'un champ depuis une ligne de données."""
        if field_name in self.column_mapping:
            col_idx = self.column_mapping[field_name]
            if col_idx < len(row_data):
                return row_data[col_idx]
        return ""
    
    def create_sample_video(self, filename):
        """Crée un fichier vidéo de test avec ffmpeg."""
        sample_dir = Path("temp/sample_videos")
        sample_dir.mkdir(parents=True, exist_ok=True)
        
        video_path = sample_dir / filename
        
        if video_path.exists():
            return str(video_path)
        
        # Créer une vidéo de test colorée de 10 secondes
        cmd = [
            'ffmpeg', '-f', 'lavfi',
            '-i', 'testsrc=duration=10:size=1920x1080:rate=25',
            '-c:v', 'libx264', '-y', str(video_path)
        ]
        
        try:
            subprocess.run(cmd, capture_output=True, check=True)
            print(f"   📁 Fichier de test créé: {video_path}")
            return str(video_path)
        except subprocess.CalledProcessError:
            return None
    
    def find_source_file(self, source_name):
        """Trouve le fichier source ou crée un fichier de test."""
        if not source_name:
            return None
        
        # D'abord chercher le vrai fichier
        for base_path in self.source_paths:
            if not os.path.exists(base_path):
                continue
            
            for ext in self.video_extensions:
                file_path = os.path.join(base_path, source_name)
                if os.path.exists(file_path):
                    return file_path
                
                file_path = os.path.join(base_path, f"{source_name}{ext}")
                if os.path.exists(file_path):
                    return file_path
        
        # Si pas trouvé, créer un fichier de test
        print(f"   📁 Fichier '{source_name}' non trouvé, création d'un fichier de test...")
        return self.create_sample_video(f"test_{source_name.replace(' ', '_')}.mp4")
    
    def timecode_to_seconds(self, timecode):
        """Convertit un timecode en secondes."""
        if not timecode:
            return 2.0
        
        try:
            parts = timecode.strip().split(':')
            if len(parts) == 4:  # HH:MM:SS:FF
                hours, minutes, seconds, frames = map(int, parts)
                return hours * 3600 + minutes * 60 + seconds + frames / 25.0
            elif len(parts) == 3:  # HH:MM:SS
                hours, minutes, seconds = map(int, parts)
                return hours * 3600 + minutes * 60 + seconds
        except:
            pass
        
        return 2.0
    
    def extract_thumbnail_url(self, source_file, timecode_seconds):
        """
        Extrait une frame et l'upload vers un service d'image temporaire.
        Pour le test, on simule juste la création.
        """
        try:
            # Créer le répertoire temporaire
            temp_dir = Path("temp/thumbnails")
            temp_dir.mkdir(parents=True, exist_ok=True)
            
            # Nom du fichier temporaire
            temp_image = temp_dir / f"thumb_{os.path.basename(source_file)}_{timecode_seconds:.1f}.jpg"
            
            # Commande ffmpeg pour extraire la frame
            cmd = [
                'ffmpeg',
                '-i', source_file,
                '-ss', str(timecode_seconds),
                '-vframes', '1',
                '-q:v', '2',
                '-vf', 'scale=320:180',
                '-y',
                str(temp_image)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0 and temp_image.exists():
                # Pour ce test, on retourne juste l'URL locale
                # Dans un vrai projet, on uploadrait vers un CDN
                return f"file://{temp_image.absolute()}"
            else:
                print(f"   ❌ Erreur ffmpeg: {result.stderr}")
                return None
                
        except Exception as e:
            print(f"   ❌ Erreur extraction: {e}")
            return None
    
    def test_thumbnail_generation(self, max_shots=3):
        """Teste la génération de vignettes."""
        print("🎬 TEST GÉNÉRATEUR DE VIGNETTES")
        print("=" * 40)
        
        # Vérifier ffmpeg
        try:
            subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
            print("✅ ffmpeg disponible")
        except:
            print("❌ ffmpeg non disponible")
            return
        
        # Lire les données du sheet
        all_data = self.worksheet.get_all_values()
        headers = all_data[0]
        
        print(f"📋 Headers détectés: {headers}")
        print(f"🔧 Mapping colonnes: {self.column_mapping}")
        
        processed = 0
        
        for row_idx, row_data in enumerate(all_data[1:], start=2):
            if processed >= max_shots:
                break
            
            processed += 1
            
            # Extraire les informations
            shot_name = self.get_field_value(row_data, 'shot_name')
            source_name = self.get_field_value(row_data, 'source_name')
            timecode_in = self.get_field_value(row_data, 'timecode_in')
            
            print(f"\n📋 Plan {shot_name}")
            print(f"   Source: '{source_name}'")
            print(f"   TC IN: '{timecode_in}'")
            
            if not source_name:
                print(f"   ⚠️  Pas de nom de fichier source")
                continue
            
            # Trouver ou créer le fichier source
            source_file = self.find_source_file(source_name)
            if not source_file:
                print(f"   ❌ Impossible de créer le fichier de test")
                continue
            
            print(f"   📁 Fichier: {source_file}")
            
            # Convertir timecode
            timecode_seconds = self.timecode_to_seconds(timecode_in)
            print(f"   ⏱️  Position: {timecode_seconds}s")
            
            # Extraire la vignette
            thumbnail_url = self.extract_thumbnail_url(source_file, timecode_seconds)
            if thumbnail_url:
                print(f"   ✅ Vignette générée: {thumbnail_url}")
                
                # Mettre à jour Google Sheets (simulation)
                thumbnail_col = self.column_mapping.get('thumbnail', 12) + 1  # Convert to 1-based
                print(f"   📝 Mise à jour colonne {thumbnail_col} (VIGNETTE)")
                
                try:
                    # Pour le test, on met juste l'URL du fichier local
                    self.worksheet.update_cell(row_idx, thumbnail_col, f"Vignette: {os.path.basename(thumbnail_url)}")
                    print(f"   ✅ Google Sheets mis à jour")
                except Exception as e:
                    print(f"   ❌ Erreur update: {e}")
            else:
                print(f"   ❌ Échec génération vignette")
        
        print(f"\n🎉 Test terminé! {processed} plans traités")

def main():
    generator = SimpleThumbnailGenerator()
    generator.test_thumbnail_generation()

if __name__ == "__main__":
    main()
