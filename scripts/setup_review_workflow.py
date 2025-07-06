#!/usr/bin/env python3
"""
Setup script for UNDLM PostFlow Review Workflow
Installs required dependencies and configures the system
"""

import subprocess
import sys
import os
from pathlib import Path

def install_requirements():
    """Install required Python packages"""
    print("📦 Installing required packages...")
    
    # Required packages for the review workflow
    packages = [
        "watchdog",  # File system monitoring
        "requests",  # HTTP requests for Discord/Frame.io
        "python-dateutil",  # Date parsing
    ]
    
    for package in packages:
        try:
            print(f"   Installing {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"   ✅ {package} installed")
        except subprocess.CalledProcessError:
            print(f"   ❌ Failed to install {package}")

def create_directories():
    """Create required directories"""
    print("📁 Creating required directories...")
    
    directories = [
        "data",
        "output",
        "logs",
        "backups",
        "temp"
    ]
    
    for directory in directories:
        dir_path = Path(directory)
        if not dir_path.exists():
            dir_path.mkdir(parents=True, exist_ok=True)
            print(f"   ✅ Created {directory}/")
        else:
            print(f"   ℹ️  {directory}/ already exists")

def create_systemd_service():
    """Create systemd service file for the watcher"""
    print("🔧 Creating systemd service file...")
    
    service_content = f"""[Unit]
Description=UNDLM PostFlow Review Workflow Watcher
After=network.target

[Service]
Type=simple
User={os.getenv('USER', 'postflow')}
WorkingDirectory={Path.cwd()}
ExecStart={sys.executable} scripts/lucidlink_watcher.py
Restart=always
RestartSec=10
Environment=PYTHONPATH={Path.cwd()}

[Install]
WantedBy=multi-user.target
"""
    
    service_path = Path("systemd/postflow-watcher.service")
    service_path.parent.mkdir(exist_ok=True)
    
    with open(service_path, 'w') as f:
        f.write(service_content)
    
    print(f"   ✅ Service file created: {service_path}")
    print(f"   ℹ️  To install: sudo cp {service_path} /etc/systemd/system/")
    print(f"   ℹ️  To enable: sudo systemctl enable postflow-watcher")

def check_integrations():
    """Check integration configurations"""
    print("🔍 Checking integration configurations...")
    
    config_path = Path("config/integrations.json")
    if not config_path.exists():
        print("   ❌ Integration config not found")
        return False
    
    import json
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Check LucidLink
    lucidlink_path = Path(config.get('lucidlink', {}).get('base_path', ''))
    if lucidlink_path.exists():
        print("   ✅ LucidLink volume accessible")
    else:
        print(f"   ⚠️  LucidLink volume not found: {lucidlink_path}")
    
    # Check Discord
    discord_webhook = config.get('discord', {}).get('webhook_url', '')
    if discord_webhook and 'discord.com' in discord_webhook:
        print("   ✅ Discord webhook configured")
    else:
        print("   ⚠️  Discord webhook not configured")
    
    # Check Frame.io
    frameio_token = config.get('frameio', {}).get('api_token', '')
    if frameio_token and frameio_token != 'YOUR_FRAMEIO_API_TOKEN':
        print("   ✅ Frame.io API token configured")
    else:
        print("   ⚠️  Frame.io API token not configured")
    
    return True

def run_tests():
    """Run system tests"""
    print("🧪 Running system tests...")
    
    # Test 1: Import all modules
    try:
        sys.path.insert(0, str(Path.cwd()))
        from src.integrations.review_workflow import ReviewWorkflowManager
        from src.integrations.discord import DiscordNotifier
        from src.integrations.lucidlink import LucidLinkIntegration
        print("   ✅ All modules import successfully")
    except Exception as e:
        print(f"   ❌ Module import failed: {e}")
        return False
    
    # Test 2: Configuration loading
    try:
        import json
        with open("config/integrations.json", 'r') as f:
            config = json.load(f)
        print("   ✅ Configuration loads successfully")
    except Exception as e:
        print(f"   ❌ Configuration loading failed: {e}")
        return False
    
    # Test 3: Review workflow initialization
    try:
        workflow = ReviewWorkflowManager(config)
        print("   ✅ Review workflow initializes successfully")
    except Exception as e:
        print(f"   ❌ Review workflow initialization failed: {e}")
        return False
    
    return True

def main():
    """Main setup function"""
    print("🎬 UNDLM PostFlow - Review Workflow Setup")
    print("=" * 50)
    
    # Step 1: Install requirements
    install_requirements()
    
    # Step 2: Create directories
    create_directories()
    
    # Step 3: Create systemd service
    create_systemd_service()
    
    # Step 4: Check integrations
    check_integrations()
    
    # Step 5: Run tests
    if run_tests():
        print("\n🎉 Setup completed successfully!")
        print("\n📋 Next steps:")
        print("1. Configure Frame.io API token in config/integrations.json")
        print("2. Test the system: python scripts/test_review_workflow.py")
        print("3. Start the watcher: python scripts/lucidlink_watcher.py")
        print("4. Monitor Discord notifications")
        print("\n✅ Your review workflow is ready!")
    else:
        print("\n❌ Setup completed with errors")
        print("Please check the configuration and try again")

if __name__ == "__main__":
    main()
