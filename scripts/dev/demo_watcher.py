#!/usr/bin/env python3
"""
Demo mode for LucidLink Watcher
Simulates the complete workflow without requiring actual LucidLink files
"""

import sys
import json
import time
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from scripts.lucidlink_watcher import LucidLinkWatcher
from src.integrations.discord import DiscordNotifier, DiscordConfig

def demo_watcher():
    """Demonstrate the complete watcher functionality"""
    print("🎬 " + "=" * 50)
    print("   UNDLM PostFlow - LucidLink Watcher Demo")
    print("=" * 52)
    print()
    
    # Load configuration
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    if not config_path.exists():
        print("❌ Configuration not found")
        return
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Create watcher instance
    print("🔧 Initializing watcher...")
    watcher = LucidLinkWatcher(config)
    
    # Show current state
    print(f"📊 Currently tracking {len(watcher.processed_files)} files")
    print(f"🗺️  Scene mapping loaded for {len(watcher.scene_mapping)} shots")
    
    # Demo: Simulate file processing
    print("\n🎬 Demo: Simulating file detection...")
    
    # Mock file data
    mock_files = [
        ("UNDLM_00001", "UNDLM_00001_v003.mov"),
        ("UNDLM_00020", "UNDLM_00020_v001.mov"),
        ("UNDLM_00100", "UNDLM_00100_v002.mov")
    ]
    
    for nomenclature, filename in mock_files:
        print(f"\n📁 Processing: {filename}")
        print(f"  🔍 Nomenclature: {nomenclature}")
        
        # Get scene name
        scene = watcher._get_scene_name(nomenclature)
        print(f"  🎭 Scene: {scene}")
        
        # Simulate notification
        if watcher.discord:
            print(f"  📢 Sending Discord notification...")
            
            # Mock review item
            class MockReviewItem:
                def __init__(self, nomenclature, version, file_path):
                    self.nomenclature = nomenclature
                    self.version = version
                    self.file_path = file_path
                    self.scene_name = scene
            
            mock_item = MockReviewItem(nomenclature, int(filename.split('_v')[1].split('.')[0]), f"/mock/path/{filename}")
            watcher._send_file_ready_notification(mock_item)
            
            # Small delay to avoid rate limiting
            time.sleep(1)
        
        # Simulate state update
        file_signature = f"/mock/path/{filename}:123456789:1000000"
        watcher.processed_files.add(file_signature)
        print(f"  💾 Added to processed files")
    
    # Save final state
    watcher._save_state()
    print(f"\n📊 Final state: {len(watcher.processed_files)} files tracked")
    
    print("\n✅ Demo completed successfully!")
    print("🔍 Check Discord for notifications")
    print("📁 Check data/watcher_state.json for persistence")

def test_scene_detection():
    """Test scene detection with various nomenclatures"""
    print("🎭 Testing Scene Detection")
    print("=" * 25)
    
    # Load configuration
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    if not config_path.exists():
        print("❌ Configuration not found")
        return
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Create watcher instance
    watcher = LucidLinkWatcher(config)
    
    # Test various nomenclatures
    test_cases = [
        "UNDLM_00001",  # Should exist
        "UNDLM_00010",  # Should exist
        "UNDLM_00020",  # Should exist
        "UNDLM_00100",  # Should exist
        "UNDLM_00200",  # Should exist
        "UNDLM_00520",  # Last one?
        "UNDLM_99999",  # Should not exist
    ]
    
    for nomenclature in test_cases:
        scene = watcher._get_scene_name(nomenclature)
        status = "✅" if scene != "Scene inconnue" else "❌"
        print(f"  {status} {nomenclature} → {scene}")
    
    print(f"\n📊 Total scenes in mapping: {len(watcher.scene_mapping)}")

def check_state_file():
    """Check the current state file"""
    print("📁 Checking State File")
    print("=" * 20)
    
    state_file = Path(__file__).parent.parent / "data" / "watcher_state.json"
    
    if state_file.exists():
        try:
            with open(state_file, 'r') as f:
                state = json.load(f)
            
            processed_files = state.get('processed_files', [])
            last_scan = state.get('last_scan', 'Never')
            
            print(f"📊 Status: {len(processed_files)} files processed")
            print(f"🕒 Last scan: {last_scan}")
            
            if processed_files:
                print("\n📋 Recent files:")
                for i, file_sig in enumerate(processed_files[-10:], 1):
                    # Extract filename from signature
                    file_path = file_sig.split(':')[0]
                    filename = Path(file_path).name
                    print(f"  {i:2d}. {filename}")
            
        except Exception as e:
            print(f"❌ Error reading state: {e}")
    else:
        print("📝 No state file found")

def main():
    """Main demo function"""
    if len(sys.argv) > 1:
        if sys.argv[1] == "--scene":
            test_scene_detection()
        elif sys.argv[1] == "--state":
            check_state_file()
        elif sys.argv[1] == "--help":
            print("Usage:")
            print("  python demo_watcher.py           # Run full demo")
            print("  python demo_watcher.py --scene   # Test scene detection")
            print("  python demo_watcher.py --state   # Check state file")
            print("  python demo_watcher.py --help    # Show this help")
        else:
            print("Unknown option. Use --help for usage information.")
    else:
        demo_watcher()

if __name__ == "__main__":
    main()
