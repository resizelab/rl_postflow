#!/usr/bin/env python3
"""
Complete LucidLink Watcher Launcher
Starts the enhanced file watcher with all features
"""

import sys
import json
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from scripts.lucidlink_watcher import start_watcher, test_notification

def print_banner():
    """Print startup banner"""
    print("🎬 " + "=" * 50)
    print("   UNDLM PostFlow - Enhanced LucidLink Watcher")
    print("=" * 52)
    print()

def check_configuration():
    """Check if configuration is valid"""
    print("🔧 Checking Configuration...")
    
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    if not config_path.exists():
        print("❌ Configuration file not found")
        return False
    
    try:
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        # Check LucidLink config
        lucidlink_config = config.get('lucidlink', {})
        base_path = lucidlink_config.get('base_path', '')
        
        if not base_path:
            print("❌ LucidLink base_path not configured")
            return False
        
        watch_path = Path(base_path) / "4_OUT" / "2_FROM_VFX" / "BY_SHOT"
        if not watch_path.exists():
            print(f"❌ Watch path does not exist: {watch_path}")
            return False
        
        print(f"✅ LucidLink path: {watch_path}")
        
        # Check Discord config
        discord_config = config.get('discord', {})
        if discord_config.get('webhook_url'):
            print("✅ Discord notifications enabled")
        else:
            print("⚠️  Discord notifications disabled")
        
        # Check CSV file
        csv_path = Path(__file__).parent.parent / "data" / "shots.csv"
        if csv_path.exists():
            print("✅ Scene mapping CSV found")
        else:
            print("⚠️  Scene mapping CSV not found")
        
        return True
        
    except Exception as e:
        print(f"❌ Configuration error: {e}")
        return False

def show_features():
    """Show available features"""
    print("\n🚀 Features Available:")
    print("  • Real-time file monitoring")
    print("  • Historical file scanning")
    print("  • Persistent state management")
    print("  • Scene name mapping from CSV")
    print("  • Discord notifications")
    print("  • Smart nomenclature detection")
    print()

def main():
    """Main launcher function"""
    print_banner()
    
    # Check configuration
    if not check_configuration():
        print("\n❌ Configuration check failed. Please fix the issues above.")
        sys.exit(1)
    
    # Show features
    show_features()
    
    # Check command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == "--test":
            print("🧪 Testing notification system...")
            test_notification()
            return
        elif sys.argv[1] == "--help":
            print("Usage:")
            print("  python start_watcher.py           # Start the watcher")
            print("  python start_watcher.py --test    # Test notifications")
            print("  python start_watcher.py --help    # Show this help")
            return
    
    # Start the watcher
    print(f"🕒 Starting at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("Press Ctrl+C to stop the watcher")
    print()
    
    try:
        start_watcher()
    except KeyboardInterrupt:
        print("\n👋 Watcher stopped by user")
    except Exception as e:
        print(f"\n❌ Watcher error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
