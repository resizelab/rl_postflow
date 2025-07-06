#!/usr/bin/env python3
"""
Frame.io Project Configuration Helper
Gets project details and updates configuration
"""

import sys
import json
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.frameio import FrameIOClient

def list_frameio_projects_detailed():
    """List Frame.io projects with detailed information"""
    print("📋 Frame.io Project Configuration Helper")
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
        
        # Get projects
        projects = frameio_client.get_projects()
        
        if not projects:
            print("❌ No projects found")
            return
        
        print(f"✅ Found {len(projects)} project(s):")
        print()
        
        for i, project in enumerate(projects):
            print(f"🎬 Project {i+1}:")
            print(f"   • Name: {project.get('name', 'Unknown')}")
            print(f"   • ID: {project.get('id', 'Unknown')}")
            print(f"   • Description: {project.get('description', 'No description')}")
            print(f"   • Created: {project.get('inserted_at', 'Unknown')}")
            print(f"   • Team: {project.get('team', {}).get('name', 'Unknown')}")
            print()
        
        # Update configuration if user wants
        if len(projects) == 1:
            project = projects[0]
            project_id = project.get('id')
            project_name = project.get('name')
            
            print(f"🔧 Would you like to configure '{project_name}' as the default project?")
            choice = input("Update config? (y/N): ").lower().strip()
            
            if choice == 'y':
                # Update frameio_config.json
                frameio_config['project_id'] = project_id
                
                with open(config_path, 'w') as f:
                    json.dump(frameio_config, f, indent=2)
                
                print(f"✅ Updated frameio_config.json with project ID: {project_id}")
                
                # Also update integrations.json
                integrations_path = Path(__file__).parent.parent / "config" / "integrations.json"
                if integrations_path.exists():
                    with open(integrations_path, 'r') as f:
                        integrations_config = json.load(f)
                    
                    if 'frameio' not in integrations_config:
                        integrations_config['frameio'] = {}
                    
                    integrations_config['frameio']['project_id'] = project_id
                    
                    with open(integrations_path, 'w') as f:
                        json.dump(integrations_config, f, indent=4)
                    
                    print(f"✅ Updated integrations.json with project ID: {project_id}")
                
                print(f"\n🎉 Configuration completed! Your workflow is now ready.")
                print(f"   Project: {project_name}")
                print(f"   ID: {project_id}")
        
        elif len(projects) > 1:
            print("🔧 Multiple projects found. Which one would you like to use?")
            for i, project in enumerate(projects):
                print(f"   {i+1}. {project.get('name', 'Unknown')}")
            
            try:
                choice = int(input("\nSelect project (number): ")) - 1
                if 0 <= choice < len(projects):
                    project = projects[choice]
                    project_id = project.get('id')
                    project_name = project.get('name')
                    
                    # Update configuration
                    frameio_config['project_id'] = project_id
                    
                    with open(config_path, 'w') as f:
                        json.dump(frameio_config, f, indent=2)
                    
                    print(f"✅ Updated configuration with project: {project_name}")
                    print(f"   ID: {project_id}")
                else:
                    print("❌ Invalid selection")
            except ValueError:
                print("❌ Invalid input")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

def get_project_folders():
    """Get folders in the configured project"""
    print("\n📁 Project Folders")
    print("=" * 30)
    
    # Load Frame.io configuration
    config_path = Path(__file__).parent.parent / "config" / "frameio_config.json"
    with open(config_path, 'r') as f:
        frameio_config = json.load(f)
    
    project_id = frameio_config.get('project_id')
    if not project_id:
        print("❌ No project ID configured")
        return
    
    try:
        frameio_client = FrameIOClient(frameio_config)
        
        # This would need to be implemented in the Frame.io client
        print(f"📂 Project ID: {project_id}")
        print("   (Folder listing would be implemented here)")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    list_frameio_projects_detailed()
    
    # Optionally show project folders
    config_path = Path(__file__).parent.parent / "config" / "frameio_config.json"
    if config_path.exists():
        with open(config_path, 'r') as f:
            frameio_config = json.load(f)
        
        if frameio_config.get('project_id'):
            get_project_folders()
