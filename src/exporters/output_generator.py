"""
Output generators for post-production data
Exports structured data to JSON and CSV formats for use in After Effects, EbSynth, etc.
"""

import json
import csv
import os
from typing import Dict, List, Any, Optional
from pathlib import Path
from datetime import datetime

from ..models.data_models import PostProductionData, Shot, TimecodeInfo, ShotMetadata


class DataExporter:
    """Main exporter class for post-production data."""
    
    def __init__(self, output_dir: str = "output"):
        """
        Initialize the data exporter.
        
        Args:
            output_dir: Directory where exported files will be saved
        """
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
    def export_all_formats(self, data: PostProductionData, base_filename: str = "undlm_shots") -> Dict[str, str]:
        """
        Export data to all supported formats.
        
        Args:
            data: Post-production data to export
            base_filename: Base filename for exported files
            
        Returns:
            Dictionary with format names and file paths
        """
        exported_files = {}
        
        # Export JSON (detailed format)
        json_file = self.export_json(data, f"{base_filename}_detailed.json")
        exported_files["json_detailed"] = json_file
        
        # Export JSON (After Effects format)
        ae_json_file = self.export_after_effects_json(data, f"{base_filename}_ae.json")
        exported_files["json_after_effects"] = ae_json_file
        
        # Export CSV (production format)
        csv_file = self.export_production_csv(data, f"{base_filename}_production.csv")
        exported_files["csv_production"] = csv_file
        
        # Export CSV (flat format)
        flat_csv_file = self.export_flat_csv(data, f"{base_filename}_flat.csv")
        exported_files["csv_flat"] = flat_csv_file
        
        return exported_files
    
    def export_json(self, data: PostProductionData, filename: str) -> str:
        """
        Export complete data structure to JSON.
        
        Args:
            data: Post-production data
            filename: Output filename
            
        Returns:
            Path to exported file
        """
        output_path = self.output_dir / filename
        
        # Convert to dictionary
        export_data = {
            "project_info": {
                "name": data.project_info.name,
                "duration": data.project_info.duration,
                "export_date": data.project_info.export_date,
                "total_shots": data.project_info.total_shots,
                "unique_scenes": data.project_info.unique_scenes,
                "source_files_count": len(data.project_info.source_files)
            },
            "shots": {}
        }
        
        # Add shots with nomenclature as key
        for shot in data.shots:
            export_data["shots"][shot.nomenclature] = {
                "shot_number": shot.shot_number,
                "scene_name": shot.scene_name,
                "sequence_position": shot.sequence_position,
                "timecode": {
                    "timeline_in": shot.timecode.timeline_in,
                    "timeline_out": shot.timecode.timeline_out,
                    "source_in": shot.timecode.source_in,
                    "source_out": shot.timecode.source_out,
                    "duration": shot.timecode.duration
                },
                "source_file": shot.source_file,
                "metadata": {
                    "is_duplicate": shot.metadata.is_duplicate,
                    "lut_applied": shot.metadata.lut_applied,
                    "graphics_artist": shot.metadata.graphics_artist,
                    "comments": shot.metadata.comments,
                    "graphics_validated_prod": shot.metadata.graphics_validated_prod,
                    "graphics_validated_director": shot.metadata.graphics_validated_director,
                    "graphics_retrieved": shot.metadata.graphics_retrieved,
                    "technical_verified": shot.metadata.technical_verified,
                    "ready_for_edit": shot.metadata.ready_for_edit
                },
                "project_code": shot.project_code,
                "plan_id": shot.plan_id
            }
        
        # Write to file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Exported detailed JSON: {output_path}")
        return str(output_path)
    
    def export_after_effects_json(self, data: PostProductionData, filename: str) -> str:
        """
        Export simplified JSON optimized for After Effects workflows.
        
        Args:
            data: Post-production data
            filename: Output filename
            
        Returns:
            Path to exported file
        """
        output_path = self.output_dir / filename
        
        # Simplified structure for After Effects
        ae_data = {
            "project": data.project_info.name,
            "export_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "shots": []
        }
        
        for shot in data.shots:
            ae_shot = {
                "nomenclature": shot.nomenclature,
                "scene": shot.scene_name,
                "source_file": shot.source_file,
                "timeline_in": shot.timecode.timeline_in,
                "timeline_out": shot.timecode.timeline_out,
                "duration": shot.timecode.duration,
                "is_duplicate": shot.metadata.is_duplicate,
                "ready_for_edit": shot.metadata.ready_for_edit,
                "comments": shot.metadata.comments or ""
            }
            ae_data["shots"].append(ae_shot)
        
        # Write to file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(ae_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Exported After Effects JSON: {output_path}")
        return str(output_path)
    
    def export_production_csv(self, data: PostProductionData, filename: str) -> str:
        """
        Export production-friendly CSV with key information.
        
        Args:
            data: Post-production data
            filename: Output filename
            
        Returns:
            Path to exported file
        """
        output_path = self.output_dir / filename
        
        # Define CSV headers
        headers = [
            "NOMENCLATURE",
            "SHOT_NUMBER", 
            "SCENE",
            "TIMELINE_IN",
            "TIMELINE_OUT",
            "DURATION",
            "SOURCE_FILE",
            "IS_DUPLICATE",
            "GRAPHICS_ARTIST",
            "COMMENTS",
            "READY_FOR_EDIT"
        ]
        
        # Write CSV
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            
            for shot in data.shots:
                row = [
                    shot.nomenclature,
                    shot.shot_number,
                    shot.scene_name,
                    shot.timecode.timeline_in,
                    shot.timecode.timeline_out,
                    shot.timecode.duration,
                    shot.source_file,
                    "YES" if shot.metadata.is_duplicate else "NO",
                    shot.metadata.graphics_artist or "",
                    shot.metadata.comments or "",
                    "YES" if shot.metadata.ready_for_edit else "NO"
                ]
                writer.writerow(row)
        
        print(f"✅ Exported production CSV: {output_path}")
        return str(output_path)
    
    def export_flat_csv(self, data: PostProductionData, filename: str) -> str:
        """
        Export flat CSV with all data columns.
        
        Args:
            data: Post-production data
            filename: Output filename
            
        Returns:
            Path to exported file
        """
        output_path = self.output_dir / filename
        
        # Define all CSV headers
        headers = [
            "NOMENCLATURE",
            "SHOT_NUMBER",
            "SCENE",
            "SEQUENCE_POSITION",
            "TIMELINE_IN",
            "TIMELINE_OUT",
            "SOURCE_IN",
            "SOURCE_OUT", 
            "DURATION",
            "SOURCE_FILE",
            "IS_DUPLICATE",
            "LUT_APPLIED",
            "GRAPHICS_ARTIST",
            "COMMENTS",
            "GRAPHICS_VALIDATED_PROD",
            "GRAPHICS_VALIDATED_DIRECTOR",
            "GRAPHICS_RETRIEVED",
            "TECHNICAL_VERIFIED",
            "READY_FOR_EDIT",
            "PROJECT_CODE",
            "PLAN_ID"
        ]
        
        # Write CSV
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            
            for shot in data.shots:
                row = [
                    shot.nomenclature,
                    shot.shot_number,
                    shot.scene_name,
                    shot.sequence_position,
                    shot.timecode.timeline_in,
                    shot.timecode.timeline_out,
                    shot.timecode.source_in,
                    shot.timecode.source_out,
                    shot.timecode.duration,
                    shot.source_file,
                    shot.metadata.is_duplicate,
                    shot.metadata.lut_applied or "",
                    shot.metadata.graphics_artist or "",
                    shot.metadata.comments or "",
                    shot.metadata.graphics_validated_prod,
                    shot.metadata.graphics_validated_director,
                    shot.metadata.graphics_retrieved,
                    shot.metadata.technical_verified,
                    shot.metadata.ready_for_edit,
                    shot.project_code,
                    shot.plan_id
                ]
                writer.writerow(row)
        
        print(f"✅ Exported flat CSV: {output_path}")
        return str(output_path)
    
    def export_by_scene(self, data: PostProductionData, base_filename: str = "scene") -> Dict[str, str]:
        """
        Export separate JSON files for each scene.
        
        Args:
            data: Post-production data
            base_filename: Base filename for scene files
            
        Returns:
            Dictionary with scene names and file paths
        """
        scene_files = {}
        
        # Group shots by scene
        scenes = {}
        for shot in data.shots:
            if shot.scene_name not in scenes:
                scenes[shot.scene_name] = []
            scenes[shot.scene_name].append(shot)
        
        # Export each scene
        for scene_name, shots in scenes.items():
            # Clean scene name for filename
            clean_scene_name = "".join(c for c in scene_name if c.isalnum() or c in (' ', '-', '_')).rstrip()
            clean_scene_name = clean_scene_name.replace(' ', '_')
            filename = f"{base_filename}_{clean_scene_name}.json"
            
            scene_data = {
                "scene_name": scene_name,
                "shot_count": len(shots),
                "export_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "shots": {}
            }
            
            for shot in shots:
                scene_data["shots"][shot.nomenclature] = {
                    "shot_number": shot.shot_number,
                    "source_file": shot.source_file,
                    "timeline_in": shot.timecode.timeline_in,
                    "timeline_out": shot.timecode.timeline_out,
                    "duration": shot.timecode.duration,
                    "is_duplicate": shot.metadata.is_duplicate,
                    "ready_for_edit": shot.metadata.ready_for_edit,
                    "comments": shot.metadata.comments or ""
                }
            
            output_path = self.output_dir / filename
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(scene_data, f, indent=2, ensure_ascii=False)
            
            scene_files[scene_name] = str(output_path)
        
        print(f"✅ Exported {len(scene_files)} scene files")
        return scene_files


def export_post_production_data(data: PostProductionData, output_dir: str = "output") -> Dict[str, str]:
    """
    Convenience function to export post-production data to all formats.
    
    Args:
        data: Post-production data to export
        output_dir: Output directory
        
    Returns:
        Dictionary with format names and file paths
    """
    exporter = DataExporter(output_dir)
    return exporter.export_all_formats(data)
