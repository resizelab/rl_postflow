#!/usr/bin/env python3
"""
Real-time file watcher for UNDLM PostFlow
Monitors LucidLink folders for new exports and triggers review workflow
Features:
- Real-time file monitoring with watchdog
- Historical scan on startup to detect files added while offline
- Persistent state management
- Discord notifications
"""

import os
import sys
import time
import json
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from datetime import datetime
import hashlib
import pandas as pd

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.review_workflow import ReviewWorkflowManager
from src.integrations.discord import DiscordNotifier, DiscordConfig

class LucidLinkWatcher(FileSystemEventHandler):
    """Watches LucidLink folders for new exports with historical state management"""
    
    def __init__(self, config):
        self.config = config
        self.workflow_manager = ReviewWorkflowManager(config)
        
        # Historical state management
        self.state_file = Path(__file__).parent.parent / "data" / "watcher_state.json"
        self.processed_files = set()
        self.base_path = config.get('lucidlink', {}).get('base_path', '/Volumes/resizelab/o2b-undllm')
        self.watch_path = Path(self.base_path) / "4_OUT" / "2_FROM_VFX" / "BY_SHOT"
        
        # Load historical state
        self._load_state()
        
        # Load scene mapping from CSV
        self._load_scene_mapping()
        
        # Initialize Discord for direct notifications
        discord_config = config.get('discord', {})
        if discord_config.get('webhook_url'):
            discord_config_obj = DiscordConfig(
                webhook_url=discord_config['webhook_url'],
                bot_name=discord_config.get('username', 'PostFlow BOT'),
                avatar_url=discord_config.get('avatar_url', '')
            )
            self.discord = DiscordNotifier(discord_config_obj)
        else:
            self.discord = None
    
    def _load_state(self):
        """Load historical state from file"""
        if self.state_file.exists():
            try:
                with open(self.state_file, 'r') as f:
                    state = json.load(f)
                    self.processed_files = set(state.get('processed_files', []))
                    print(f"📂 Loaded {len(self.processed_files)} processed files from state")
            except Exception as e:
                print(f"⚠️  Error loading state: {e}")
                self.processed_files = set()
        else:
            print("📝 No previous state found, starting fresh")
            self.processed_files = set()
    
    def _save_state(self):
        """Save current state to file"""
        try:
            # Ensure data directory exists
            self.state_file.parent.mkdir(parents=True, exist_ok=True)
            
            state = {
                'processed_files': list(self.processed_files),
                'last_scan': datetime.now().isoformat()
            }
            
            with open(self.state_file, 'w') as f:
                json.dump(state, f, indent=2)
                
        except Exception as e:
            print(f"⚠️  Error saving state: {e}")
    
    def _get_file_signature(self, file_path: Path) -> str:
        """Get a unique signature for a file (path + modification time)"""
        try:
            stat = file_path.stat()
            return f"{file_path}:{stat.st_mtime}:{stat.st_size}"
        except:
            return str(file_path)
    
    def scan_historical_files(self):
        """Scan for files that were created while the watcher was offline"""
        print("🔍 Scanning for historical files...")
        
        if not self.watch_path.exists():
            print(f"❌ Watch path does not exist: {self.watch_path}")
            return
        
        new_files_found = 0
        
        # Recursively scan for .mov files
        for mov_file in self.watch_path.rglob("*.mov"):
            file_signature = self._get_file_signature(mov_file)
            
            # Skip if already processed
            if file_signature in self.processed_files:
                continue
            
            # Extract nomenclature
            nomenclature = self._extract_nomenclature_from_file(mov_file)
            
            # Verify nomenclature format
            if not nomenclature or not self._verify_nomenclature(nomenclature):
                # Still mark as processed to avoid repeated warnings
                self.processed_files.add(file_signature)
                continue
            
            print(f"📁 Found historical file: {mov_file.name} ({nomenclature})")
            new_files_found += 1
            
            # Process the file
            self._process_file(mov_file, nomenclature)
            
            # Mark as processed
            self.processed_files.add(file_signature)
        
        if new_files_found == 0:
            print("✅ No new historical files found")
        else:
            print(f"📊 Processed {new_files_found} historical files")
        
        # Save state
        self._save_state()
    
    def _process_file(self, file_path: Path, nomenclature: str):
        """Process a single file (historical or new)"""
        try:
            # Wait a bit to ensure file is fully written (for new files)
            time.sleep(1)
            
            # Scan for new exports
            new_exports = self.workflow_manager.scan_new_exports()
            
            # Find the export that matches our file
            for export in new_exports:
                if export.nomenclature == nomenclature and export.file_path == str(file_path):
                    print(f"✅ Processing export: {export.nomenclature} v{export.version}")
                    
                    # Send notification
                    self.workflow_manager.notify_new_export(export)
                    
                    # Send direct Discord notification
                    if self.discord:
                        self._send_file_ready_notification(export)
                    
                    # Save review state
                    self.workflow_manager.save_review_state()
                    break
            else:
                print(f"⚠️  No matching export found for {nomenclature}")
                
        except Exception as e:
            print(f"❌ Error processing file {file_path}: {e}")
    
    def _verify_nomenclature(self, nomenclature: str) -> bool:
        """Verify UNDLM_XXXXX format"""
        import re
        return bool(re.match(r'^UNDLM_\d{5}$', nomenclature))
    
    def _send_file_ready_notification(self, review_item):
        """Send notification that file is ready for review"""
        try:
            # Format version with padding (v001, v002, etc.)
            version_padded = f"v{review_item.version:03d}"
            
            # Get scene name from mapping
            scene_name = self._get_scene_name(review_item.nomenclature)
            
            embed = {
                "title": "🎬 NOUVEAU FICHIER PRÊT",
                "description": f"**{review_item.nomenclature}** {version_padded} vient d'être exporté",
                "color": 0x00ff00,
                "fields": [
                    {"name": "📁 Fichier", "value": Path(review_item.file_path).name, "inline": True},
                    {"name": "🎭 Scène", "value": scene_name, "inline": True},
                    {"name": "🔢 Version", "value": version_padded, "inline": True},
                    {"name": "📂 Dossier", "value": "BY_SHOT", "inline": True},
                    {"name": "🕒 Détecté à", "value": datetime.now().strftime("%H:%M:%S"), "inline": True},
                    {"name": "🎯 Status", "value": "Prêt pour review", "inline": True},
                    {"name": "❓ Action", "value": "Lancez `python main.py --interactive` et tapez **'review'** pour envoyer sur Frame.io", "inline": False}
                ],
                "footer": {"text": "Workflow PostFlow - Détection automatique"}
            }
            
            self.discord.send_message(
                f"📂 **FICHIER DISPONIBLE** - {review_item.nomenclature}",
                embed
            )
            
        except Exception as e:
            print(f"❌ Error sending notification: {e}")
    
    def _extract_nomenclature_from_file(self, file_path: Path) -> str:
        """Extract nomenclature from file path, checking both filename and folder structure"""
        import re
        
        # Method 1: Extract from filename directly
        filename = file_path.name
        match = re.search(r'(UNDLM_\d{5})', filename)
        if match:
            return match.group(1)
        
        # Method 2: Extract from parent folder name (for files in shot folders)
        parent_name = file_path.parent.name
        if self._verify_nomenclature(parent_name):
            return parent_name
        
        # Method 3: Look up the folder hierarchy for shot folder
        for parent in file_path.parents:
            folder_name = parent.name
            if self._verify_nomenclature(folder_name):
                return folder_name
        
        return ""

    def _load_scene_mapping(self):
        """Load scene mapping from CSV file"""
        self.scene_mapping = {}
        
        csv_path = Path(__file__).parent.parent / "data" / "shots.csv"
        if not csv_path.exists():
            print("⚠️  CSV file not found for scene mapping")
            return
        
        try:
            df = pd.read_csv(csv_path)
            
            for _, row in df.iterrows():
                nomenclature = row.get('NOMENCLATURE PLAN', '')
                scene_name = row.get('SEQUENCE', 'Unknown Scene')
                
                if nomenclature and nomenclature.startswith('UNDLM_'):
                    self.scene_mapping[nomenclature] = scene_name
            
            print(f"🗺️  Loaded scene mapping for {len(self.scene_mapping)} shots")
            
        except Exception as e:
            print(f"⚠️  Error loading scene mapping: {e}")
            self.scene_mapping = {}
    
    def _get_scene_name(self, nomenclature: str) -> str:
        """Get scene name from nomenclature"""
        return self.scene_mapping.get(nomenclature, "Scene inconnue")

def start_watcher():
    """Start the file watcher"""
    print("👁️  Starting LucidLink File Watcher")
    print("=" * 40)
    
    # Load configuration
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    if not config_path.exists():
        print("❌ Configuration not found")
        return
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Get LucidLink base path
    lucidlink_config = config.get('lucidlink', {})
    base_path = lucidlink_config.get('base_path', '/Volumes/resizelab/o2b-undllm')
    
    # Watch folder
    watch_path = Path(base_path) / "4_OUT" / "2_FROM_VFX" / "BY_SHOT"
    
    if not watch_path.exists():
        print(f"❌ Watch path does not exist: {watch_path}")
        return
    
    print(f"👀 Watching folder: {watch_path}")
    
    # Create watcher
    event_handler = LucidLinkWatcher(config)
    
    # First, scan for historical files
    print("🔍 Scanning for historical files...")
    event_handler.scan_historical_files()
    
    # Then start real-time monitoring
    observer = Observer()
    observer.schedule(event_handler, str(watch_path), recursive=True)
    
    # Start watching
    observer.start()
    print("✅ File watcher started")
    print("🔍 Monitoring for new .mov files...")
    print("Press Ctrl+C to stop")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("\n👋 Stopping file watcher...")
    
    observer.join()

def test_notification():
    """Test notification system"""
    print("🧪 Testing notification system")
    print("=" * 30)
    
    # Load configuration
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    if not config_path.exists():
        print("❌ Configuration not found")
        return
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Initialize Discord
    discord_config = config.get('discord', {})
    if discord_config.get('webhook_url'):
        discord_config_obj = DiscordConfig(
            webhook_url=discord_config['webhook_url'],
            bot_name=discord_config.get('username', 'PostFlow BOT'),
            avatar_url=discord_config.get('avatar_url', '')
        )
        discord = DiscordNotifier(discord_config_obj)
        
        # Send test notification
        embed = {
            "title": "🧪 Test de notification",
            "description": "Le système de surveillance LucidLink est opérationnel",
            "color": 0x00ff00,
            "fields": [
                {"name": "Status", "value": "Watcher actif", "inline": True},
                {"name": "Dossier surveillé", "value": "BY_SHOT", "inline": True}
            ]
        }
        
        discord.send_message("🔍 **Watcher LucidLink** - Test", embed)
        print("✅ Test notification sent")
    else:
        print("❌ Discord not configured")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        test_notification()
    else:
        start_watcher()
