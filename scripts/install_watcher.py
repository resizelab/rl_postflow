#!/usr/bin/env python3
"""
Installation script for LucidLink Watcher
Sets up the complete watcher system with all dependencies
"""

import sys
import json
import subprocess
from pathlib import Path

def install_dependencies():
    """Install required Python packages"""
    print("📦 Installing dependencies...")
    
    packages = [
        'watchdog',
        'pandas',
        'requests'
    ]
    
    for package in packages:
        try:
            print(f"  Installing {package}...")
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
            print(f"  ✅ {package} installed")
        except subprocess.CalledProcessError as e:
            print(f"  ❌ Failed to install {package}: {e}")
            return False
    
    return True

def check_configuration():
    """Check if configuration is complete"""
    print("\n🔧 Checking configuration...")
    
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    
    if not config_path.exists():
        print("❌ Configuration file not found")
        return False
    
    try:
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        # Check required sections
        if 'lucidlink' not in config:
            print("❌ LucidLink configuration missing")
            return False
        
        if 'discord' not in config:
            print("❌ Discord configuration missing")
            return False
        
        # Check LucidLink path
        lucidlink_config = config.get('lucidlink', {})
        base_path = lucidlink_config.get('base_path', '')
        
        if not base_path:
            print("❌ LucidLink base_path not set")
            return False
        
        print(f"✅ LucidLink path: {base_path}")
        
        # Check Discord webhook
        discord_config = config.get('discord', {})
        webhook_url = discord_config.get('webhook_url', '')
        
        if not webhook_url:
            print("❌ Discord webhook URL not set")
            return False
        
        print("✅ Discord webhook configured")
        
        return True
        
    except Exception as e:
        print(f"❌ Configuration error: {e}")
        return False

def setup_directories():
    """Create required directories"""
    print("\n📁 Setting up directories...")
    
    directories = [
        Path(__file__).parent.parent / "data",
        Path(__file__).parent.parent / "logs",
        Path(__file__).parent.parent / "temp"
    ]
    
    for directory in directories:
        try:
            directory.mkdir(parents=True, exist_ok=True)
            print(f"✅ {directory.name}/ directory ready")
        except Exception as e:
            print(f"❌ Failed to create {directory}: {e}")
            return False
    
    return True

def check_csv_file():
    """Check if CSV file exists"""
    print("\n📊 Checking CSV file...")
    
    csv_path = Path(__file__).parent.parent / "data" / "shots.csv"
    
    if csv_path.exists():
        try:
            import pandas as pd
            df = pd.read_csv(csv_path)
            print(f"✅ CSV file loaded: {len(df)} shots")
            
            # Check required columns
            required_columns = ['NOMENCLATURE PLAN', 'SEQUENCE']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                print(f"⚠️  Missing columns: {missing_columns}")
                return False
            
            # Count valid nomenclatures
            valid_nomenclatures = df['NOMENCLATURE PLAN'].str.contains(r'^UNDLM_\d{5}$', na=False).sum()
            print(f"✅ Valid nomenclatures: {valid_nomenclatures}")
            
            return True
            
        except Exception as e:
            print(f"❌ CSV file error: {e}")
            return False
    else:
        print("❌ CSV file not found")
        print("  Please place shots.csv in the data/ directory")
        return False

def test_watcher():
    """Test the watcher system"""
    print("\n🧪 Testing watcher system...")
    
    try:
        # Test core dependencies
        import watchdog
        import pandas as pd
        print("✅ Core dependencies available")
        
        # Test configuration loading
        config_path = Path(__file__).parent.parent / "config" / "integrations.json"
        with open(config_path, 'r') as f:
            config = json.load(f)
        print("✅ Configuration loaded")
        
        # Test Discord configuration
        discord_config = config.get('discord', {})
        if discord_config.get('webhook_url'):
            print("✅ Discord webhook configured")
        else:
            print("⚠️  Discord not configured")
        
        # Test LucidLink configuration
        lucidlink_config = config.get('lucidlink', {})
        if lucidlink_config.get('base_path'):
            print("✅ LucidLink path configured")
        else:
            print("⚠️  LucidLink path not configured")
        
        return True
        
    except Exception as e:
        print(f"❌ Watcher test failed: {e}")
        return False

def print_next_steps():
    """Print next steps for the user"""
    print("\n🚀 Next Steps:")
    print("1. Start the watcher:")
    print("   python scripts/start_watcher.py")
    print()
    print("2. Test notifications:")
    print("   python scripts/start_watcher.py --test")
    print()
    print("3. Run demo:")
    print("   python scripts/demo_watcher.py")
    print()
    print("4. Check status:")
    print("   python scripts/enhance_watcher.py --state")
    print()
    print("📚 Documentation: docs/LUCIDLINK_WATCHER_GUIDE.md")

def main():
    """Main installation function"""
    print("🎬 LucidLink Watcher Installation")
    print("=" * 35)
    
    steps = [
        ("Installing dependencies", install_dependencies),
        ("Checking configuration", check_configuration),
        ("Setting up directories", setup_directories),
        ("Checking CSV file", check_csv_file),
        ("Testing watcher", test_watcher)
    ]
    
    for step_name, step_func in steps:
        print(f"\n🔧 {step_name}...")
        if not step_func():
            print(f"\n❌ Installation failed at: {step_name}")
            print("Please fix the issues above and try again.")
            sys.exit(1)
    
    print("\n" + "=" * 50)
    print("✅ LucidLink Watcher Installation Complete!")
    print("=" * 50)
    
    print_next_steps()

if __name__ == "__main__":
    main()
