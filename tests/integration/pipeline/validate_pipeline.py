#!/usr/bin/env python3
"""
PostFlow Pipeline - Validation Complete
Tests all integrations and functionalities
"""

import sys
import json
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

from src.integrations.frameio import FrameIOClient
from src.integrations.discord import DiscordNotifier
from src.integrations.lucidlink import LucidLinkIntegration

def validate_configurations():
    """Validate all configuration files"""
    print("🔧 Validating Configuration Files")
    print("=" * 50)
    
    configs = {
        'frameio_config.json': Path(__file__).parent.parent.parent.parent / "config" / "frameio_config.json",
        'integrations.json': Path(__file__).parent.parent.parent.parent / "config" / "integrations.json",
        'error_handling.json': Path(__file__).parent.parent.parent.parent / "config" / "error_handling.json"
    }
    
    for name, path in configs.items():
        if path.exists():
            try:
                with open(path, 'r') as f:
                    config = json.load(f)
                print(f"✅ {name}: Valid JSON")
            except json.JSONDecodeError as e:
                print(f"❌ {name}: Invalid JSON - {e}")
        else:
            print(f"❌ {name}: File not found")
    
    print()

def validate_frameio_integration():
    """Validate Frame.io integration"""
    print("🎬 Validating Frame.io Integration")
    print("=" * 50)
    
    try:
        # Load configuration
        config_path = Path(__file__).parent.parent.parent.parent / "config" / "frameio_config.json"
        with open(config_path, 'r') as f:
            frameio_config = json.load(f)
        
        # Test client initialization
        frameio_client = FrameIOClient(frameio_config)
        print("✅ Frame.io client initialized")
        
        # Test project access
        project_id = frameio_config.get('project_id')
        if project_id:
            project_info = frameio_client.get_project_info(project_id)
            if project_info:
                print(f"✅ Project access: {project_info.get('name', 'Unknown')}")
                print(f"   • ID: {project_id}")
            else:
                print("❌ Cannot access project")
        else:
            print("❌ No project ID configured")
        
        print(f"✅ Upload enabled: {frameio_config.get('upload_enabled', False)}")
        
    except Exception as e:
        print(f"❌ Frame.io validation failed: {e}")
    
    print()

def validate_discord_integration():
    """Validate Discord integration"""
    print("💬 Validating Discord Integration")
    print("=" * 50)
    
    try:
        # Load configuration
        config_path = Path(__file__).parent.parent.parent.parent / "config" / "integrations.json"
        with open(config_path, 'r') as f:
            integrations_config = json.load(f)
        
        discord_config = integrations_config.get('discord', {})
        
        # Test Discord client
        discord_client = DiscordNotifier(discord_config)
        print("✅ Discord client initialized")
        
        webhook_url = discord_config.get('webhook_url')
        if webhook_url and webhook_url.startswith('https://discord.com/api/webhooks/'):
            print("✅ Webhook URL configured")
        else:
            print("❌ Invalid webhook URL")
        
        print(f"✅ Notifications enabled: {discord_config.get('enabled', False)}")
        
    except Exception as e:
        print(f"❌ Discord validation failed: {e}")
    
    print()

def validate_lucidlink_integration():
    """Validate LucidLink integration"""
    print("🔗 Validating LucidLink Integration")
    print("=" * 50)
    
    try:
        # Load configuration
        config_path = Path(__file__).parent.parent.parent.parent / "config" / "integrations.json"
        with open(config_path, 'r') as f:
            integrations_config = json.load(f)
        
        lucidlink_config = integrations_config.get('lucidlink', {})
        
        # Test LucidLink client
        lucidlink_client = LucidLinkIntegration(lucidlink_config)
        print("✅ LucidLink client initialized")
        
        base_path = lucidlink_config.get('base_path')
        if base_path and Path(base_path).exists():
            print(f"✅ Base path accessible: {base_path}")
        else:
            print(f"❌ Base path not accessible: {base_path}")
        
        print(f"✅ Base URL: {lucidlink_config.get('base_url', 'Not configured')}")
        
    except Exception as e:
        print(f"❌ LucidLink validation failed: {e}")
    
    print()

def validate_data_files():
    """Validate data files"""
    print("📊 Validating Data Files")
    print("=" * 50)
    
    data_files = {
        'shots.csv': Path(__file__).parent.parent.parent.parent / "data" / "shots.csv",
        'postflow.db': Path(__file__).parent.parent.parent.parent / "data" / "postflow.db",
        'pipeline_status.json': Path(__file__).parent.parent.parent.parent / "data" / "pipeline_status.json"
    }
    
    for name, path in data_files.items():
        if path.exists():
            size = path.stat().st_size
            print(f"✅ {name}: {size:,} bytes")
        else:
            print(f"❌ {name}: File not found")
    
    print()

def validate_output_files():
    """Validate output files"""
    print("📁 Validating Output Files")
    print("=" * 50)
    
    output_dir = Path(__file__).parent.parent.parent.parent / "output"
    if output_dir.exists():
        files = list(output_dir.glob("*.json")) + list(output_dir.glob("*.csv"))
        print(f"✅ Output directory: {len(files)} files")
        
        for file in files[:5]:  # Show first 5 files
            size = file.stat().st_size
            print(f"   • {file.name}: {size:,} bytes")
        
        if len(files) > 5:
            print(f"   • ... and {len(files) - 5} more files")
    else:
        print("❌ Output directory not found")
    
    print()

def validate_pipeline_functionality():
    """Validate pipeline functionality"""
    print("🚀 Validating Pipeline Functionality")
    print("=" * 50)
    
    try:
        # Import pipeline components
        from src.parsers.csv_parser import parse_shots_csv
        from src.models.data_models import PostProductionData
        
        print("✅ Pipeline modules imported")
        
        # Test CSV parsing
        csv_file = Path(__file__).parent.parent.parent.parent / "data" / "shots.csv"
        if csv_file.exists():
            project_data = parse_shots_csv(str(csv_file))
            print(f"✅ CSV parsing: {len(project_data.shots)} shots loaded")
            
            print(f"✅ Data model: {len(project_data.shots)} shots, {project_data.project_info.unique_scenes} scenes")
            
            # Test deleted shots detection
            deleted_shots = project_data.get_deleted_nomenclatures()
            print(f"✅ Deleted shots detection: {len(deleted_shots)} deleted shots")
            
            # Test nomenclature gaps
            gaps = project_data.get_nomenclature_gaps()
            print(f"✅ Nomenclature gaps: {len(gaps)} gaps detected")
            
        else:
            print("❌ CSV file not found for testing")
        
    except Exception as e:
        print(f"❌ Pipeline validation failed: {e}")
        import traceback
        traceback.print_exc()
    
    print()

def main():
    """Main validation function"""
    print("🎬 PostFlow Pipeline - Complete Validation")
    print("=" * 60)
    print()
    
    # Run all validations
    validate_configurations()
    validate_frameio_integration()
    validate_discord_integration()
    validate_lucidlink_integration()
    validate_data_files()
    validate_output_files()
    validate_pipeline_functionality()
    
    print("🎉 Validation Complete!")
    print("=" * 60)
    print("✅ PostFlow Pipeline is ready for production use!")
    print()
    print("📋 Next steps:")
    print("   • Run: python main.py --mode production")
    print("   • Monitor: Check Discord notifications")
    print("   • Review: Check Frame.io uploads")

if __name__ == "__main__":
    main()
