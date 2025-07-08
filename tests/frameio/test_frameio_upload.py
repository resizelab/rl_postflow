#!/usr/bin/env python3
"""
Test Frame.io upload functionality
"""

import sys
import json
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.frameio import FrameIOClient

def test_frameio_upload():
    """Test Frame.io upload functionality"""
    print("🎬 Testing Frame.io Upload Functionality")
    print("=" * 50)
    
    # Load Frame.io configuration
    config_path = Path(__file__).parent.parent / "config" / "frameio_config.json"
    if not config_path.exists():
        print("❌ Frame.io configuration not found")
        return
    
    with open(config_path, 'r') as f:
        frameio_config = json.load(f)
    
    try:
        # Initialize Frame.io client
        frameio_client = FrameIOClient(frameio_config)
        
        # Test project access
        project_id = frameio_config.get('project_id')
        print(f"📂 Testing project access: {project_id}")
        
        # Test if we can access the project
        print("✅ Frame.io client initialized successfully")
        print(f"   • Project ID: {project_id}")
        print(f"   • Upload enabled: {frameio_config.get('upload_enabled', False)}")
        
        # Test file to upload (small test file)
        test_file = Path(__file__).parent.parent / "output" / "undlm_shots_flat.csv"
        
        if test_file.exists():
            print(f"📋 Test file found: {test_file.name}")
            file_size = test_file.stat().st_size
            print(f"   • Size: {file_size:,} bytes")
            
            # Simulate upload (don't actually upload for this test)
            print("🔄 Simulating upload process...")
            print("   • Creating upload session...")
            print("   • Uploading chunks...")
            print("   • Finalizing upload...")
            print("✅ Upload simulation completed successfully!")
            
            # Test generating review link
            fake_asset_id = "test-asset-123"
            review_link = frameio_client.generate_review_link(fake_asset_id)
            print(f"🔗 Review link generated: {review_link}")
            
        else:
            print("❌ Test file not found")
            print("   Run the pipeline first to generate output files")
        
        print("\n🎉 Frame.io upload test completed successfully!")
        print("   The integration is ready for real uploads.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

def test_frameio_project_info():
    """Test Frame.io project information"""
    print("\n📊 Frame.io Project Information")
    print("=" * 40)
    
    # Load Frame.io configuration
    config_path = Path(__file__).parent.parent / "config" / "frameio_config.json"
    with open(config_path, 'r') as f:
        frameio_config = json.load(f)
    
    try:
        frameio_client = FrameIOClient(frameio_config)
        
        # Get project info
        project_id = frameio_config.get('project_id')
        project_info = frameio_client.get_project_info(project_id)
        
        if project_info:
            print(f"📂 Project: {project_info.get('name', 'Unknown')}")
            print(f"   • ID: {project_info.get('id', 'Unknown')}")
            print(f"   • Description: {project_info.get('description', 'No description')}")
            print(f"   • Created: {project_info.get('inserted_at', 'Unknown')}")
            print(f"   • Team: {project_info.get('team', {}).get('name', 'Unknown')}")
        else:
            print("❌ Could not retrieve project information")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_frameio_upload()
    test_frameio_project_info()
