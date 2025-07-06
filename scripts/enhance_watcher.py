#!/usr/bin/env python3
"""
Enhanced LucidLink Watcher with better scene detection
"""

import os
import sys
import json
from pathlib import Path
import pandas as pd

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.discord import DiscordNotifier, DiscordConfig

def enhance_scene_detection():
    """Test enhanced scene detection using CSV mapping"""
    print("🎭 Testing Enhanced Scene Detection")
    print("=" * 40)
    
    # Load CSV data
    csv_path = Path(__file__).parent.parent / "data" / "shots.csv"
    if not csv_path.exists():
        print("❌ CSV file not found")
        return
    
    try:
        df = pd.read_csv(csv_path)
        print(f"📊 Loaded {len(df)} shots from CSV")
        
        # Create nomenclature to scene mapping
        scene_mapping = {}
        for _, row in df.iterrows():
            nomenclature = row.get('NOMENCLATURE PLAN', '')
            scene_name = row.get('SEQUENCE', 'Unknown Scene')
            
            if nomenclature and nomenclature.startswith('UNDLM_'):
                scene_mapping[nomenclature] = scene_name
        
        print(f"🗺️  Created mapping for {len(scene_mapping)} shots")
        
        # Test with some examples
        test_nomenclatures = ['UNDLM_00001', 'UNDLM_00010', 'UNDLM_00020']
        
        for nomenclature in test_nomenclatures:
            scene = scene_mapping.get(nomenclature, 'Scene inconnue')
            print(f"  {nomenclature} → {scene}")
        
        return scene_mapping
        
    except Exception as e:
        print(f"❌ Error loading CSV: {e}")
        return {}

def test_enhanced_notification():
    """Test enhanced Discord notification with scene info"""
    print("🧪 Testing Enhanced Discord Notification")
    print("=" * 30)
    
    # Load configuration
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    if not config_path.exists():
        print("❌ Configuration not found")
        return
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Get scene mapping
    scene_mapping = enhance_scene_detection()
    
    # Initialize Discord
    discord_config = config.get('discord', {})
    if discord_config.get('webhook_url'):
        discord_config_obj = DiscordConfig(
            webhook_url=discord_config['webhook_url'],
            bot_name=discord_config.get('username', 'PostFlow BOT'),
            avatar_url=discord_config.get('avatar_url', '')
        )
        discord = DiscordNotifier(discord_config_obj)
        
        # Test with mock export data
        test_nomenclature = "UNDLM_00001"
        test_scene = scene_mapping.get(test_nomenclature, "Scene inconnue")
        
        # Enhanced notification
        embed = {
            "title": "🎬 NOUVEAU FICHIER PRÊT (Enhanced)",
            "description": f"**{test_nomenclature}** v003 vient d'être exporté",
            "color": 0x00ff00,
            "fields": [
                {"name": "📁 Fichier", "value": f"{test_nomenclature}_v003.mov", "inline": True},
                {"name": "🎭 Scène", "value": test_scene, "inline": True},
                {"name": "🔢 Version", "value": "v003", "inline": True},
                {"name": "📂 Dossier", "value": "BY_SHOT", "inline": True},
                {"name": "🕒 Détecté à", "value": "Maintenant", "inline": True},
                {"name": "🎯 Status", "value": "Prêt pour review", "inline": True},
                {"name": "❓ Action", "value": "Lancez `python main.py --interactive` et tapez **'review'** pour envoyer sur Frame.io", "inline": False}
            ],
            "footer": {"text": "Workflow PostFlow - Détection automatique"}
        }
        
        discord.send_message(
            f"📂 **FICHIER DISPONIBLE** - {test_nomenclature}",
            embed
        )
        
        print("✅ Enhanced notification sent")
    else:
        print("❌ Discord not configured")

def check_watcher_state():
    """Check current watcher state"""
    print("📊 Checking Watcher State")
    print("=" * 25)
    
    state_file = Path(__file__).parent.parent / "data" / "watcher_state.json"
    
    if state_file.exists():
        try:
            with open(state_file, 'r') as f:
                state = json.load(f)
            
            processed_files = state.get('processed_files', [])
            last_scan = state.get('last_scan', 'Never')
            
            print(f"📁 Processed files: {len(processed_files)}")
            print(f"🕒 Last scan: {last_scan}")
            
            if processed_files:
                print("\n📋 Recent files:")
                for i, file_sig in enumerate(processed_files[-5:], 1):
                    file_path = file_sig.split(':')[0]
                    file_name = Path(file_path).name
                    print(f"  {i}. {file_name}")
            
        except Exception as e:
            print(f"❌ Error reading state: {e}")
    else:
        print("📝 No state file found")

def main():
    """Main function"""
    if len(sys.argv) > 1:
        if sys.argv[1] == "--scene":
            enhance_scene_detection()
        elif sys.argv[1] == "--notify":
            test_enhanced_notification()
        elif sys.argv[1] == "--state":
            check_watcher_state()
        else:
            print("Usage: python enhance_watcher.py [--scene|--notify|--state]")
    else:
        print("🚀 LucidLink Watcher Enhancement")
        print("=" * 35)
        enhance_scene_detection()
        print()
        test_enhanced_notification()
        print()
        check_watcher_state()

if __name__ == "__main__":
    main()
