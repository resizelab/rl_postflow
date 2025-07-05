#!/usr/bin/env python3
"""
Frame.io Validation Script
Unified script for testing Frame.io integration
"""

import os
import sys
import json
from pathlib import Path

# Add src to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from src.integrations.frameio import FrameIOClient, validate_config


def main():
    """Main validation function."""
    print("🎬 Frame.io Integration Validation")
    print("=" * 50)
    
    # Load configuration
    config_path = "config/frameio_config.json"
    
    try:
        with open(config_path, 'r') as f:
            config_data = json.load(f)
        
        frameio_config = config_data.get('frameio', {})
        
        # Validate configuration
        print("🔍 Validating configuration...")
        errors = validate_config(frameio_config)
        
        if errors:
            print("❌ Configuration errors found:")
            for error in errors:
                print(f"   • {error}")
            print("\nPlease fix the configuration and try again.")
            return False
        
        print("✅ Configuration is valid")
        
        # Test connection
        print("\n🔗 Testing connection...")
        client = FrameIOClient(frameio_config)
        
        if client.test_connection():
            print("✅ Connection successful")
            
            # Get user info
            user_info = client.get_user_info()
            if user_info:
                print(f"👤 User: {user_info.get('name', 'Unknown')}")
                print(f"📧 Email: {user_info.get('email', 'Unknown')}")
            
            # Get teams
            teams = client.get_teams()
            print(f"🏢 Teams: {len(teams)}")
            
            # Get projects
            projects = client.get_projects()
            print(f"📁 Projects: {len(projects)}")
            
            if projects:
                print("\n📋 Available projects:")
                for i, project in enumerate(projects[:5]):  # Show first 5
                    print(f"   {i+1}. {project.get('name', 'Unknown')}")
                    print(f"      ID: {project.get('id', 'Unknown')}")
                if len(projects) > 5:
                    print(f"   ... and {len(projects) - 5} more")
            
            # Test project access
            if frameio_config.get('project_id'):
                print(f"\n🎯 Testing project access...")
                project_info = client.get_project_info()
                if project_info:
                    print(f"✅ Project: {project_info.get('name', 'Unknown')}")
                    print(f"   Status: {project_info.get('status', 'Unknown')}")
                    
                    # Get assets
                    assets = client.get_project_assets()
                    print(f"   Assets: {len(assets)}")
                else:
                    print("❌ Cannot access configured project")
            
            # Get status
            status = client.get_status()
            print(f"\n📊 Client Status:")
            print(f"   • Connected: {status['connected']}")
            print(f"   • API Version: {status['api_version']}")
            print(f"   • Upload Enabled: {status['upload_enabled']}")
            print(f"   • Project ID: {status['project_id']}")
            
            return True
            
        else:
            print("❌ Connection failed")
            return False
            
    except FileNotFoundError:
        print(f"❌ Configuration file not found: {config_path}")
        print("Please create the configuration file first.")
        return False
    except json.JSONDecodeError:
        print(f"❌ Invalid JSON in configuration file: {config_path}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
