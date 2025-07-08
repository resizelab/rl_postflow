#!/usr/bin/env python3
"""
Frame.io Project Configuration Helper
Gets project details and updates configuration
"""

import sys
import json
import asyncio
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.frameio import create_frameio_auth

async def list_frameio_projects_detailed():
    """List Frame.io projects with detailed information"""
    print("📋 Frame.io Project Configuration Helper")
    print("=" * 50)
    
    try:
        # Initialize Frame.io authentication
        auth = create_frameio_auth()
        
        # Test connection
        if not await auth.test_connection():
            print("❌ Frame.io connection failed")
            return
        
        print("✅ Frame.io connection successful")
        
        # Get user info
        user_info = await auth.get_user_info()
        print(f"👤 Connected as: {user_info.get('name', 'Unknown')}")
        
        # Get accounts
        accounts = await auth.get_accounts()
        if not accounts:
            print("❌ No accounts found")
            return
        
        print(f"\n🏢 Found {len(accounts)} account(s):")
        for account in accounts:
            account_id = account.get('id')
            account_name = account.get('name', 'Unknown')
            print(f"   • {account_name} (ID: {account_id})")
            
            # Get workspaces for this account
            try:
                workspaces = await auth.get_workspaces(account_id)
                print(f"     📁 Workspaces ({len(workspaces)}):")
                
                for workspace in workspaces:
                    workspace_id = workspace.get('id')
                    workspace_name = workspace.get('name', 'Unknown')
                    print(f"       • {workspace_name} (ID: {workspace_id})")
                    
                    # Get projects for this workspace
                    try:
                        projects = await auth.get_projects(account_id, workspace_id)
                        if projects:
                            print(f"         🎬 Projects ({len(projects)}):")
                            for project in projects:
                                project_id = project.get('id')
                                project_name = project.get('name', 'Unknown')
                                print(f"           • {project_name} (ID: {project_id})")
                        else:
                            print(f"         🎬 No projects in this workspace")
                    except Exception as e:
                        print(f"         ❌ Error getting projects: {e}")
                        
            except Exception as e:
                print(f"     ❌ Error getting workspaces: {e}")
        
        # Get current configuration
        config_path = Path(__file__).parent.parent / "config" / "integrations.json"
        current_config = {}
        if config_path.exists():
            with open(config_path, 'r') as f:
                current_config = json.load(f)
        
        current_workspace = current_config.get('frameio', {}).get('default_workspace_id')
        current_project = current_config.get('frameio', {}).get('default_project_id')
        
        print(f"\n🔧 Current configuration:")
        print(f"   Workspace ID: {current_workspace or 'Not set'}")
        print(f"   Project ID: {current_project or 'Not set'}")
        
        # Prompt for update
        print(f"\n💡 Would you like to update the configuration?")
        update = input("Update config? (y/N): ").lower().strip()
        
        if update == 'y':
            # Get new workspace ID
            new_workspace = input(f"Enter workspace ID (current: {current_workspace}): ").strip()
            if not new_workspace:
                new_workspace = current_workspace
            
            # Get new project ID
            new_project = input(f"Enter project ID (current: {current_project}): ").strip()
            if not new_project:
                new_project = current_project
            
            # Update configuration
            if 'frameio' not in current_config:
                current_config['frameio'] = {}
            
            current_config['frameio']['default_workspace_id'] = new_workspace
            current_config['frameio']['default_project_id'] = new_project
            
            with open(config_path, 'w') as f:
                json.dump(current_config, f, indent=4)
            
            print(f"✅ Configuration updated!")
            print(f"   Workspace ID: {new_workspace}")
            print(f"   Project ID: {new_project}")
            
            # Test the new configuration
            print(f"\n🧪 Testing new configuration...")
            try:
                # Get the first account ID
                account_id = accounts[0].get('id')
                test_projects = await auth.get_projects(account_id, new_workspace)
                
                # Find the project
                target_project = None
                for project in test_projects:
                    if project.get('id') == new_project:
                        target_project = project
                        break
                
                if target_project:
                    print(f"✅ Project found: {target_project.get('name')}")
                else:
                    print(f"⚠️ Project ID {new_project} not found in workspace {new_workspace}")
                    
            except Exception as e:
                print(f"⚠️ Error testing configuration: {e}")
    
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

async def get_project_folders():
    """Get folders in the configured project"""
    print("\n📁 Project Folders")
    print("=" * 30)
    
    # Load configuration
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    if not config_path.exists():
        print("❌ Configuration not found")
        return
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    workspace_id = config.get('frameio', {}).get('default_workspace_id')
    project_id = config.get('frameio', {}).get('default_project_id')
    
    if not workspace_id or not project_id:
        print("❌ Workspace or project ID not configured")
        return
    
    try:
        auth = create_frameio_auth()
        
        print(f"📂 Workspace ID: {workspace_id}")
        print(f"📂 Project ID: {project_id}")
        print("   (Folder listing would need API implementation)")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(list_frameio_projects_detailed())
