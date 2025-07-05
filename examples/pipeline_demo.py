#!/usr/bin/env python3
"""
RL PostFlow - Pipeline Demo
Demonstrates the complete post-production pipeline
"""

import sys
import json
from pathlib import Path

# Add src directory to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.parsers.csv_parser import parse_shots_csv
from src.exporters.output_generator import export_post_production_data
from src.workflows.pipeline_manager import PipelineManager
from src.utils.status_tracker import PipelineStage


def main():
    """Demonstrate the complete pipeline workflow."""
    print("🎬 RL PostFlow - Complete Pipeline Demo")
    print("=" * 60)
    
    # Define file paths
    project_root = Path(__file__).parent
    csv_file = project_root / "data" / "shots.csv"
    
    if not csv_file.exists():
        print(f"❌ Error: CSV file not found at {csv_file}")
        return
    
    try:
        # Step 1: Parse CSV and export scene data
        print("📊 STEP 1: Parsing CSV and exporting scene data...")
        post_production_data = parse_shots_csv(str(csv_file))
        
        output_dir = project_root / "output"
        exported_files = export_post_production_data(post_production_data, str(output_dir))
        
        print(f"✅ Data exported to {len(exported_files)} files")
        
        # Step 2: Initialize Pipeline Manager
        print("\n🔧 STEP 2: Initializing Pipeline Manager...")
        pipeline_manager = PipelineManager(
            config_file=str(project_root / "pipeline_config.json"),
            tracking_file=str(project_root / "pipeline_status.json"),
            scene_data_dir=str(output_dir)
        )
        
        # Step 3: Initialize project tracking
        print("\n🚀 STEP 3: Initializing project tracking...")
        pipeline_manager.initialize_project(post_production_data)
        
        # Step 4: Process first scene as demo
        print("\n🎬 STEP 4: Processing first scene through pipeline...")
        scene_names = pipeline_manager.scene_processor.get_scene_names()
        
        if scene_names:
            first_scene = scene_names[0]
            print(f"   Processing scene: {first_scene}")
            
            # Process through all stages
            success = pipeline_manager.process_scene(
                first_scene,
                stages=[
                    PipelineStage.SOURCE_VERIFICATION,
                    PipelineStage.AFTER_EFFECTS,
                    PipelineStage.EBSYNTH_PROCESSING
                ]
            )
            
            if success:
                print(f"✅ Scene '{first_scene}' processed successfully!")
            else:
                print(f"❌ Scene '{first_scene}' processing failed")
        
        # Step 5: Generate pipeline dashboard
        print("\n📊 STEP 5: Generating pipeline dashboard...")
        dashboard_file = pipeline_manager.export_pipeline_report(
            str(project_root / "output" / "pipeline_dashboard.json")
        )
        
        # Step 6: Show pipeline statistics
        print("\n📈 STEP 6: Pipeline Statistics")
        dashboard = pipeline_manager.get_pipeline_dashboard()
        
        pipeline_stats = dashboard["pipeline_stats"]
        print(f"   • Total shots: {pipeline_stats['total_shots']}")
        print(f"   • Completion: {pipeline_stats['completion_percentage']:.1f}%")
        
        print("\n   Status breakdown:")
        for status, count in pipeline_stats["status_counts"].items():
            if count > 0:
                print(f"     • {status.replace('_', ' ').title()}: {count}")
        
        # Step 7: Show scene progress
        print("\n🎭 STEP 7: Scene Progress")
        scenes_progress = dashboard["scenes_progress"]
        
        for scene_name, progress in list(scenes_progress.items())[:5]:  # Show first 5 scenes
            print(f"   • {scene_name}: {progress['completion_percentage']:.1f}% "
                  f"({progress['completed_shots']}/{progress['total_shots']} shots)")
        
        if len(scenes_progress) > 5:
            print(f"   ... and {len(scenes_progress) - 5} more scenes")
        
        # Step 8: Configuration info
        print("\n⚙️  STEP 8: Configuration Status")
        config = dashboard["config"]
        
        print(f"   • Project: {config.get('project_name', 'UNDLM Documentary')}")
        print(f"   • Discord notifications: {'Enabled' if config.get('discord', {}).get('notifications_enabled') else 'Disabled'}")
        print(f"   • Auto-processing: {'Enabled' if config.get('auto_processing', {}).get('enabled') else 'Disabled'}")
        print(f"   • LucidLink verification: {'Enabled' if config.get('lucidlink', {}).get('verify_sources') else 'Disabled'}")
        
        print(f"\n🎉 Pipeline demo completed successfully!")
        print(f"📁 Check the 'output' directory for exported files and reports")
        print(f"📊 Dashboard: {Path(dashboard_file).name}")
        
    except Exception as e:
        print(f"❌ Error during pipeline demo: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
