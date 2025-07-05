"""
CSV Parser for shots.csv file
Handles parsing and validation of the production tracking CSV file
"""

import csv
import os
from typing import List, Dict, Optional, Any
from pathlib import Path

from ..models.data_models import (
    Shot, TimecodeInfo, ShotMetadata, 
    PostProductionData, ProjectInfo, CSVRow
)


class CSVParser:
    """Parser for shots.csv production tracking file."""
    
    def __init__(self, csv_file_path: str):
        """
        Initialize CSV parser.
        
        Args:
            csv_file_path: Path to the shots.csv file
        """
        self.csv_file_path = Path(csv_file_path)
        self.raw_data: List[CSVRow] = []
        self.parsed_shots: List[Shot] = []
        
        if not self.csv_file_path.exists():
            raise FileNotFoundError(f"CSV file not found: {csv_file_path}")
    
    def parse(self) -> PostProductionData:
        """
        Parse the CSV file and return structured data.
        
        Returns:
            PostProductionData: Structured project data
        """
        print(f"📊 Parsing CSV file: {self.csv_file_path.name}")
        
        self._load_raw_data()
        self._parse_shots()
        
        project_info = ProjectInfo()
        post_production_data = PostProductionData(
            project_info=project_info,
            shots=self.parsed_shots
        )
        
        print(f"✅ Successfully parsed {len(self.parsed_shots)} shots")
        print(f"📈 Project stats: {project_info.unique_scenes} scenes, "
              f"{len(project_info.source_files)} source files")
        
        return post_production_data
    
    def _load_raw_data(self) -> None:
        """Load raw CSV data into memory."""
        try:
            with open(self.csv_file_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                self.raw_data = list(reader)
                print(f"📋 Loaded {len(self.raw_data)} rows from CSV")
        except UnicodeDecodeError:
            # Try with different encoding if UTF-8 fails
            with open(self.csv_file_path, 'r', encoding='latin-1') as file:
                reader = csv.DictReader(file)
                self.raw_data = list(reader)
                print(f"📋 Loaded {len(self.raw_data)} rows from CSV (latin-1 encoding)")
    
    def _parse_shots(self) -> None:
        """Parse raw CSV data into Shot objects."""
        for row_index, row in enumerate(self.raw_data):
            try:
                shot = self._parse_single_shot(row, row_index + 1)
                if shot:
                    self.parsed_shots.append(shot)
            except Exception as e:
                print(f"⚠️  Warning: Error parsing row {row_index + 1}: {e}")
                continue
    
    def _parse_single_shot(self, row: CSVRow, row_number: int) -> Optional[Shot]:
        """
        Parse a single CSV row into a Shot object.
        
        Args:
            row: CSV row data
            row_number: Row number for error reporting
            
        Returns:
            Shot object or None if parsing fails
        """
        try:
            # Extract nomenclature (primary identifier)
            nomenclature = row.get('NOMENCLATURE PLAN', '').strip()
            if not nomenclature:
                print(f"⚠️  Skipping row {row_number}: No nomenclature")
                return None
            
            # Extract shot number
            shot_number = row.get('PLAN', '').strip()
            if not shot_number:
                print(f"⚠️  Warning: Row {row_number} has no shot number")
                shot_number = "UNKNOWN"
            
            # Extract scene name
            scene_name = row.get('SEQUENCE', '').strip()
            if not scene_name:
                print(f"⚠️  Warning: Row {row_number} has no scene name")
                scene_name = "UNKNOWN_SCENE"
            
            # Parse timecode information
            timecode = TimecodeInfo(
                timeline_in=row.get('TC IN', '').strip(),
                timeline_out=row.get('TC OUT', '').strip(),
                source_in=row.get('TC IN SOURCE', '').strip(),
                source_out=row.get('TC OUT SOURCE', '').strip(),
                duration=row.get('DURÉE', '').strip()
            )
            
            # Extract source file
            source_file = row.get('SOURCE NAME', '').strip()
            if not source_file:
                print(f"⚠️  Warning: Row {row_number} has no source file")
                source_file = "UNKNOWN_SOURCE"
            
            # Parse metadata
            metadata = ShotMetadata(
                is_duplicate=row.get('Doublons', '').strip().lower() == 'doublon',
                lut_applied=row.get('LUT', '').strip() or None,
                graphics_artist=row.get('GRAPHISTE', '').strip() or None,
                comments=row.get('COMMENTAIRE', '').strip() or None,
                graphics_validated_prod=self._parse_boolean(row.get('GRAPH VALIDÉ PAR PROD', '')),
                graphics_validated_director=self._parse_boolean(row.get('GRAPH VALIDÉ PAR VINCENT', '')),
                graphics_retrieved=self._parse_boolean(row.get('GRAPH RÉCUPÉRÉ PAR EVA', '')),
                technical_verified=self._parse_boolean(row.get('VERIF TECHNIQUE', '')),
                ready_for_edit=self._parse_boolean(row.get('MISE À DISPO EN MONTAGE', ''))
            )
            
            # Determine sequence position from shot number
            try:
                sequence_position = int(shot_number) if shot_number.isdigit() else row_number
            except ValueError:
                sequence_position = row_number
            
            # Create Shot object
            shot = Shot(
                nomenclature=nomenclature,
                shot_number=shot_number,
                scene_name=scene_name,
                sequence_position=sequence_position,
                timecode=timecode,
                source_file=source_file,
                metadata=metadata
            )
            
            return shot
            
        except Exception as e:
            print(f"❌ Error parsing row {row_number}: {e}")
            return None
    
    def _parse_boolean(self, value: str) -> bool:
        """
        Parse boolean value from CSV string.
        
        Args:
            value: String value from CSV
            
        Returns:
            Boolean value
        """
        if not value:
            return False
        value = value.strip().upper()
        return value in ('TRUE', '1', 'YES', 'OUI', 'VRAI')
    
    def get_parsing_statistics(self) -> Dict[str, Any]:
        """
        Get statistics about the parsing process.
        
        Returns:
            Dictionary with parsing statistics
        """
        if not self.parsed_shots:
            return {"error": "No shots parsed yet"}
        
        total_duration_frames = 0
        duplicate_count = 0
        scenes = set()
        source_files = set()
        
        for shot in self.parsed_shots:
            scenes.add(shot.scene_name)
            source_files.add(shot.source_file)
            if shot.metadata.is_duplicate:
                duplicate_count += 1
            
            # Calculate duration in frames (assuming 25fps)
            try:
                duration_parts = shot.timecode.duration.split(':')
                if len(duration_parts) == 4:
                    h, m, s, f = map(int, duration_parts)
                    total_duration_frames += (h * 3600 + m * 60 + s) * 25 + f
            except ValueError:
                continue
        
        return {
            "total_shots": len(self.parsed_shots),
            "unique_scenes": len(scenes),
            "unique_source_files": len(source_files),
            "duplicate_shots": duplicate_count,
            "estimated_duration_seconds": total_duration_frames / 25,
            "scenes": sorted(list(scenes)),
            "source_files": sorted(list(source_files))
        }


def parse_shots_csv(csv_file_path: str) -> PostProductionData:
    """
    Convenience function to parse shots CSV file.
    
    Args:
        csv_file_path: Path to the shots.csv file
        
    Returns:
        PostProductionData: Structured project data
    """
    parser = CSVParser(csv_file_path)
    return parser.parse()
