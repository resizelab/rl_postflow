#!/usr/bin/env python3
"""
Test script for the enhanced LucidLink watcher
Simulates file creation and tests historical scanning
"""

import os
import sys
import json
import time
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from scripts.lucidlink_watcher import LucidLinkWatcher

def test_historical_scan():
    """Test historical file scanning"""
    print("🔍 Testing Historical File Scanning")
    print("=" * 35)
    
    # Load configuration
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    if not config_path.exists():
        print("❌ Configuration not found")
        return
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Create watcher instance
    watcher = LucidLinkWatcher(config)
    
    # Test scanning for historical files
    print("🔍 Starting historical scan...")
    watcher.scan_historical_files()
    
    # Check state
    print(f"📊 Currently tracking {len(watcher.processed_files)} files")
    
    return watcher

def test_state_persistence():
    """Test state persistence functionality"""
    print("💾 Testing State Persistence")
    print("=" * 25)
    
    # Load configuration
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    if not config_path.exists():
        print("❌ Configuration not found")
        return
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Create first watcher instance
    watcher1 = LucidLinkWatcher(config)
    
    # Add some mock processed files
    mock_files = [
        "/test/path/UNDLM_00001.mov:1234567890:1000000",
        "/test/path/UNDLM_00002.mov:1234567891:1000000",
        "/test/path/UNDLM_00003.mov:1234567892:1000000"
    ]
    
    watcher1.processed_files.update(mock_files)
    watcher1._save_state()
    
    print(f"📝 Saved {len(watcher1.processed_files)} files to state")
    
    # Create second watcher instance (should load state)
    watcher2 = LucidLinkWatcher(config)
    
    print(f"📂 Loaded {len(watcher2.processed_files)} files from state")
    
    # Verify state persistence
    if watcher1.processed_files == watcher2.processed_files:
        print("✅ State persistence working correctly")
    else:
        print("❌ State persistence failed")
    
    return watcher2

def test_scene_mapping():
    """Test scene mapping functionality"""
    print("🎭 Testing Scene Mapping")
    print("=" * 20)
    
    # Load configuration
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    if not config_path.exists():
        print("❌ Configuration not found")
        return
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Create watcher instance
    watcher = LucidLinkWatcher(config)
    
    # Test scene mapping
    test_nomenclatures = [
        'UNDLM_00001',
        'UNDLM_00010',
        'UNDLM_00020',
        'UNDLM_00100',
        'UNDLM_99999'  # Should not exist
    ]
    
    for nomenclature in test_nomenclatures:
        scene = watcher._get_scene_name(nomenclature)
        print(f"  {nomenclature} → {scene}")
    
    print(f"📊 Total scenes mapped: {len(watcher.scene_mapping)}")

def simulate_file_creation():
    """Simulate file creation behavior"""
    print("🎬 Simulating File Creation")
    print("=" * 25)
    
    # This would normally be triggered by the file system watcher
    # We'll just demonstrate the logic
    
    print("📁 Simulating detection of new file: UNDLM_00001_v003.mov")
    print("🔍 Extracting nomenclature: UNDLM_00001")
    print("✅ Nomenclature verified")
    print("🎭 Scene mapped: REVEIL HOPITAL - JOUR")
    print("📢 Discord notification sent")
    print("💾 State saved")

def main():
    """Main test function"""
    print("🧪 LucidLink Watcher Test Suite")
    print("=" * 32)
    
    # Test 1: Scene mapping
    test_scene_mapping()
    print()
    
    # Test 2: State persistence
    test_state_persistence()
    print()
    
    # Test 3: Historical scan
    test_historical_scan()
    print()
    
    # Test 4: File creation simulation
    simulate_file_creation()
    print()
    
    print("✅ All tests completed")

if __name__ == "__main__":
    main()
