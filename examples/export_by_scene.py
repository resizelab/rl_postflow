#!/usr/bin/env python3
"""
RL PostFlow - Export by Scene Demo
Demonstrates exporting data by individual scenes
"""

import os
import sys
from pathlib import Path

# Add src directory to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.parsers.csv_parser import parse_shots_csv
from src.exporters.output_generator import DataExporter


def main():
    """Export data by scene example."""
    print("🎬 RL PostFlow - Export by Scene Demo")
    print("=" * 50)
    
    # Define file paths
    project_root = Path(__file__).parent
    csv_file = project_root / "data" / "shots.csv"
    
    if not csv_file.exists():
        print(f"❌ Error: CSV file not found at {csv_file}")
        return
    
    try:
        # Parse CSV file
        print(f"📂 Processing file: {csv_file}")
        post_production_data = parse_shots_csv(str(csv_file))
        
        # Export by scene
        print(f"\n📤 Exporting by scene...")
        output_dir = project_root / "output"
        exporter = DataExporter(str(output_dir))
        
        scene_files = exporter.export_by_scene(post_production_data)
        
        print(f"\n📁 EXPORTED SCENE FILES:")
        for scene_name, file_path in scene_files.items():
            print(f"   • {scene_name}: {Path(file_path).name}")
        
        print(f"\n🎉 Scene export completed!")
        
    except Exception as e:
        print(f"❌ Error during export: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
