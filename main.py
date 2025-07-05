#!/usr/bin/env python3
"""
RL PostFlow - Main entry point
Post-production data processing tool for 52-minute animated documentary
Integrated with Frame.io v4 API and adaptive pipeline
"""

import os
import sys
import json
from pathlib import Path

# Add src directory to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.parsers.csv_parser import parse_shots_csv
from src.exporters.output_generator import export_post_production_data
from src.integrations.frameio import FrameIOClient


def main():
    """Main function to process post-production data with Frame.io integration."""
    print("🎬 RL PostFlow - Post-production Data Processing Tool")
    print("=" * 60)
    
    # Define file paths
    project_root = Path(__file__).parent
    csv_file = project_root / "data" / "shots.csv"
    
    if not csv_file.exists():
        print(f"❌ Error: CSV file not found at {csv_file}")
        return
    
    try:
        # Initialize Frame.io client
        print("🔧 Initializing Frame.io Client...")
        frameio_client = None
        
        # Load Frame.io configuration
        frameio_config_path = project_root / "config" / "frameio_config.json"
        if frameio_config_path.exists():
            with open(frameio_config_path, 'r') as f:
                config_data = json.load(f)
            frameio_config = config_data.get('frameio', {})
            
            try:
                frameio_client = FrameIOClient(frameio_config)
                client_status = frameio_client.get_status()
                
                print(f"📊 Frame.io Status:")
                print(f"   • Connected: {client_status['connected']}")
                print(f"   • API Version: {client_status['api_version']}")
                print(f"   • Upload Enabled: {client_status['upload_enabled']}")
                print(f"   • Project ID: {client_status['project_id']}")
            except Exception as e:
                print(f"   ⚠️  Frame.io initialization failed: {e}")
                frameio_client = None
        else:
            print("   ⚠️  Frame.io configuration not found")
        
        # Parse CSV file
        print(f"\n📂 Processing file: {csv_file}")
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
        
        # Frame.io integration
        if frameio_client and frameio_client.get_status()['connected']:
            print(f"\n🔗 FRAME.IO INTEGRATION:")
            
            # Get Frame.io projects
            try:
                projects = frameio_client.get_projects()
                if projects:
                    print(f"   • Available projects: {len(projects)}")
                    for project in projects[:3]:  # Show first 3
                        print(f"     - {project.get('name', 'Unknown')}")
                else:
                    print("   • No projects found")
            except Exception as e:
                print(f"   • Error accessing Frame.io: {e}")
            
            # Optional: Upload exported files
            upload_choice = input("\n📤 Upload exported files to Frame.io? (y/N): ").lower()
            if upload_choice == 'y':
                print("📤 Uploading files to Frame.io...")
                
                for format_name, file_path in exported_files.items():
                    if format_name in ['JSON', 'CSV']:  # Upload key formats
                        try:
                            print(f"   • Uploading {format_name}...")
                            result = frameio_client.upload_file(file_path)
                            if result['success']:
                                print(f"     ✅ Success")
                            else:
                                print(f"     ❌ Failed: {result['error']}")
                        except Exception as e:
                            print(f"     ❌ Error: {e}")
        else:
            print(f"\n⚠️  Frame.io not configured or not connected. Run validation script to enable integration.")
        
        print(f"\n🎉 All exports completed! Check the 'output' directory.")
        print(f"\n✅ Processing completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during processing: {e}")
        import traceback
        traceback.print_exc()


def interactive_mode():
    """Interactive mode for advanced operations."""
    print("🎮 Interactive Mode")
    print("=" * 30)
    
    while True:
        print("\nAvailable operations:")
        print("1. Process CSV data")
        print("2. Frame.io client status")
        print("3. Upload specific file")
        print("4. List Frame.io projects")
        print("5. Exit")
        
        choice = input("\nSelect operation (1-5): ").strip()
        
        if choice == '1':
            main()
        elif choice == '2':
            try:
                # Load Frame.io configuration
                frameio_config_path = Path("config/frameio_config.json")
                if frameio_config_path.exists():
                    with open(frameio_config_path, 'r') as f:
                        config_data = json.load(f)
                    frameio_config = config_data.get('frameio', {})
                    
                    frameio_client = FrameIOClient(frameio_config)
                    status = frameio_client.get_status()
                    
                    print(f"\n📊 Frame.io Status:")
                    for key, value in status.items():
                        print(f"   • {key}: {value}")
                else:
                    print("❌ Frame.io configuration not found")
            except Exception as e:
                print(f"❌ Error: {e}")
        elif choice == '3':
            file_path = input("Enter file path to upload: ").strip()
            if Path(file_path).exists():
                try:
                    # Load Frame.io configuration
                    frameio_config_path = Path("config/frameio_config.json")
                    if frameio_config_path.exists():
                        with open(frameio_config_path, 'r') as f:
                            config_data = json.load(f)
                        frameio_config = config_data.get('frameio', {})
                        
                        frameio_client = FrameIOClient(frameio_config)
                        result = frameio_client.upload_file(file_path)
                        
                        if result['success']:
                            print(f"✅ Upload successful")
                        else:
                            print(f"❌ Upload failed: {result['error']}")
                    else:
                        print("❌ Frame.io configuration not found")
                except Exception as e:
                    print(f"❌ Error: {e}")
            else:
                print("❌ File not found")
        elif choice == '4':
            try:
                # Load Frame.io configuration
                frameio_config_path = Path("config/frameio_config.json")
                if frameio_config_path.exists():
                    with open(frameio_config_path, 'r') as f:
                        config_data = json.load(f)
                    frameio_config = config_data.get('frameio', {})
                    
                    frameio_client = FrameIOClient(frameio_config)
                    projects = frameio_client.get_projects()
                    
                    if projects:
                        print(f"\n📋 Frame.io Projects ({len(projects)}):")
                        for i, project in enumerate(projects):
                            print(f"   {i+1}. {project.get('name', 'Unknown')}")
                    else:
                        print("No projects found")
                else:
                    print("❌ Frame.io configuration not found")
            except Exception as e:
                print(f"❌ Error: {e}")
        elif choice == '5':
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--interactive":
        interactive_mode()
    else:
        main()
