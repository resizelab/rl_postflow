#!/usr/bin/env python3
"""
Script de génération automatique de vignettes pour PostFlow
Extrait des frames depuis les fichiers sources et les insère dans Google Sheets
"""

import os
import sys
import json
import gspread
import subprocess
from pathlib import Path
from PIL import Image
import io
import base64
from google.oauth2.service_account import Credentials

# Ajouter le répertoire src au Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from integrations.sheets.mapper import SheetsMapper

class ThumbnailGenerator:
    def __init__(self):
        """Initialise le générateur de vignettes."""
        self.setup_google_sheets()
        self.setup_mapper()
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
    
    def setup_mapper(self):
        """Configure le mapper de colonnes."""
        self.mapper = SheetsMapper()
    
    def setup_paths(self):
        """Configure les chemins des fichiers sources."""
        # Chemins possibles pour les rushs
        self.source_paths = [
            "/Volumes/RUSHES",  # Disque dur externe
            "/Users/home/Desktop/RUSHES",  # Local
            "/Volumes/Shared/RUSHES",  # Réseau
            ".",  # Répertoire courant
        ]
        
        # Extensions vidéo supportées
        self.video_extensions = ['.mov', '.mp4', '.avi', '.mxf', '.r3d', '.braw']
    
    def find_source_file(self, source_name):
        """
        Trouve le fichier source dans les différents chemins.
        
        Args:
            source_name (str): Nom du fichier source
            
        Returns:
            str: Chemin complet du fichier ou None si non trouvé
        """
        if not source_name:
            return None
        
        # Nettoyer le nom du fichier
        source_name = source_name.strip()
        
        for base_path in self.source_paths:
            if not os.path.exists(base_path):
                continue
            
            # Rechercher le fichier avec différentes extensions
            for ext in self.video_extensions:
                # Essayer avec l'extension originale
                file_path = os.path.join(base_path, source_name)
                if os.path.exists(file_path):
                    return file_path
                
                # Essayer en ajoutant l'extension
                file_path = os.path.join(base_path, f"{source_name}{ext}")
                if os.path.exists(file_path):
                    return file_path
                
                # Recherche récursive dans les sous-dossiers
                for root, dirs, files in os.walk(base_path):
                    for file in files:
                        if file == source_name or file.startswith(source_name.split('.')[0]):
                            return os.path.join(root, file)
        
        return None
    
    def timecode_to_seconds(self, timecode):
        """
        Convertit un timecode en secondes.
        
        Args:
            timecode (str): Timecode au format HH:MM:SS:FF ou HH:MM:SS
            
        Returns:
            float: Temps en secondes
        """
        if not timecode:
            return 5.0  # Par défaut, extraire à 5 secondes
        
        try:
            parts = timecode.strip().split(':')
            if len(parts) == 4:  # HH:MM:SS:FF
                hours, minutes, seconds, frames = map(int, parts)
                return hours * 3600 + minutes * 60 + seconds + frames / 25.0  # 25 fps par défaut
            elif len(parts) == 3:  # HH:MM:SS
                hours, minutes, seconds = map(int, parts)
                return hours * 3600 + minutes * 60 + seconds
            else:
                return 5.0
        except:
            return 5.0
    
    def extract_frame(self, source_file, timecode_seconds):
        """
        Extrait une frame du fichier vidéo à un timecode donné.
        
        Args:
            source_file (str): Chemin vers le fichier source
            timecode_seconds (float): Position en secondes
            
        Returns:
            str: Image encodée en base64 ou None
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
                '-q:v', '2',  # Haute qualité
                '-vf', 'scale=320:180',  # Redimensionner à 320x180
                '-y',  # Overwrite
                str(temp_image)
            ]
            
            # Exécuter ffmpeg
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0 and temp_image.exists():
                # Lire l'image et la convertir en base64
                with open(temp_image, 'rb') as img_file:
                    img_data = img_file.read()
                    img_base64 = base64.b64encode(img_data).decode('utf-8')
                
                # Nettoyer le fichier temporaire
                temp_image.unlink()
                
                return f"data:image/jpeg;base64,{img_base64}"
            else:
                print(f"❌ Erreur ffmpeg: {result.stderr}")
                return None
                
        except Exception as e:
            print(f"❌ Erreur lors de l'extraction: {e}")
            return None
    
    def generate_thumbnails(self, max_shots=None):
        """
        Génère les vignettes pour tous les plans.
        
        Args:
            max_shots (int): Nombre maximum de plans à traiter (None = tous)
        """
        print("🎬 GÉNÉRATEUR DE VIGNETTES POSTFLOW")
        print("=" * 50)
        
        # Lire toutes les données
        all_data = self.worksheet.get_all_values()
        headers = all_data[0]
        
        # Vérifier si ffmpeg est disponible
        try:
            subprocess.run(['ffmpeg', '-version'], capture_output=True)
        except FileNotFoundError:
            print("❌ ffmpeg n'est pas installé. Installez-le avec: brew install ffmpeg")
            return
        
        processed = 0
        updated = 0
        
        for row_idx, row_data in enumerate(all_data[1:], start=2):
            if max_shots and processed >= max_shots:
                break
            
            processed += 1
            
            # Extraire les informations du plan
            shot_name = self.mapper.get_field_value(row_data, 'shot_name')
            source_name = self.mapper.get_field_value(row_data, 'source_name')
            timecode_in = self.mapper.get_field_value(row_data, 'timecode_in')
            
            print(f"\n📋 Plan {shot_name}")
            print(f"   Source: {source_name}")
            print(f"   TC IN: {timecode_in}")
            
            # Vérifier si une vignette existe déjà
            current_thumbnail = self.mapper.get_field_value(row_data, 'thumbnail')
            if current_thumbnail and current_thumbnail.startswith('data:image'):
                print(f"   ✅ Vignette existante")
                continue
            
            # Trouver le fichier source
            source_file = self.find_source_file(source_name)
            if not source_file:
                print(f"   ❌ Fichier source non trouvé")
                continue
            
            print(f"   📁 Trouvé: {source_file}")
            
            # Convertir le timecode en secondes
            timecode_seconds = self.timecode_to_seconds(timecode_in)
            print(f"   ⏱️  Position: {timecode_seconds}s")
            
            # Extraire la frame
            thumbnail_data = self.extract_frame(source_file, timecode_seconds)
            if not thumbnail_data:
                print(f"   ❌ Impossible d'extraire la frame")
                continue
            
            # Mettre à jour la cellule dans Google Sheets
            try:
                thumbnail_col = self.mapper.get_column_index('thumbnail')
                self.worksheet.update_cell(row_idx, thumbnail_col, thumbnail_data)
                print(f"   ✅ Vignette mise à jour dans Google Sheets")
                updated += 1
            except Exception as e:
                print(f"   ❌ Erreur mise à jour: {e}")
        
        print(f"\n🎉 TERMINÉ!")
        print(f"   Plans traités: {processed}")
        print(f"   Vignettes générées: {updated}")

def main():
    """Fonction principale."""
    if len(sys.argv) > 1:
        try:
            max_shots = int(sys.argv[1])
        except ValueError:
            print("Usage: python generate_thumbnails.py [nombre_max_de_plans]")
            return
    else:
        max_shots = None
    
    generator = ThumbnailGenerator()
    generator.generate_thumbnails(max_shots)

if __name__ == "__main__":
    main()
