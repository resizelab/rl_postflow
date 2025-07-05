#!/usr/bin/env python3
"""
RL PostFlow - Main entry point
Post-production data processing tool for 52-minute animated documentary
"""

import os
import sys
import json
from pathlib import Path

# Add src directory to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.parsers.csv_parser import parse_shots_csv
from src.exporters.output_generator import export_post_production_data


def main():
    """Main function to test CSV parsing."""
    print("🎬 RL PostFlow - Post-production Data Processing Tool")
    print("=" * 60)
    
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
        
        # Display results
        print("\n📊 PARSING RESULTS:")
        print(f"   • Total shots: {post_production_data.project_info.total_shots}")
        print(f"   • Unique scenes: {post_production_data.project_info.unique_scenes}")
        print(f"   • Source files: {len(post_production_data.project_info.source_files)}")
        
        # Show first few shots as example
        print("\n🎯 FIRST 3 SHOTS PREVIEW:")
        for i, shot in enumerate(post_production_data.shots[:3]):
            print(f"   {shot.nomenclature} (Plan {shot.shot_number}): {shot.scene_name}")
            print(f"     Timeline: {shot.timecode.timeline_in} → {shot.timecode.timeline_out}")
            print(f"     Source: {shot.source_file}")
            print(f"     Duplicate: {'Yes' if shot.metadata.is_duplicate else 'No'}")
            print(f"     Project: {shot.project_code}")
            print()
        
        # Show scene breakdown
        print("🎭 SCENE BREAKDOWN:")
        scene_counts = {}
        for shot in post_production_data.shots:
            scene_counts[shot.scene_name] = scene_counts.get(shot.scene_name, 0) + 1
        
        for scene, count in sorted(scene_counts.items()):
            print(f"   • {scene}: {count} shots")
        
        # Show duplicate analysis
        duplicates = post_production_data.get_duplicate_shots()
        print(f"\n📋 DUPLICATE ANALYSIS:")
        print(f"   • Total duplicates: {len(duplicates)}")
        print(f"   • Percentage: {len(duplicates) / len(post_production_data.shots) * 100:.1f}%")
        
        # Show nomenclature analysis
        print(f"\n🔢 NOMENCLATURE ANALYSIS:")
        project_codes = {}
        for shot in post_production_data.shots:
            code = shot.project_code
            project_codes[code] = project_codes.get(code, 0) + 1
        
        for code, count in sorted(project_codes.items()):
            print(f"   • {code}: {count} shots")
        
        # Check for nomenclature gaps
        gaps = post_production_data.get_nomenclature_gaps()
        if gaps:
            print(f"\n⚠️  NOMENCLATURE GAPS DETECTED:")
            print(f"   • Missing plans: {len(gaps)}")
            if len(gaps) <= 10:
                print(f"   • Gap list: {', '.join(gaps)}")
            else:
                print(f"   • First 10 gaps: {', '.join(gaps[:10])}")
        else:
            print(f"\n✅ NO NOMENCLATURE GAPS DETECTED")
        
        # Export data to all formats
        print(f"\n📤 EXPORTING DATA...")
        output_dir = project_root / "output"
        exported_files = export_post_production_data(post_production_data, str(output_dir))
        
        print(f"\n📁 EXPORTED FILES:")
        for format_name, file_path in exported_files.items():
            print(f"   • {format_name}: {Path(file_path).name}")
        
        print(f"\n🎉 All exports completed! Check the 'output' directory.")
        
        print(f"\n✅ Processing completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during parsing: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()