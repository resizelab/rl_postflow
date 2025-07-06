#!/usr/bin/env python3
"""
Test complet du workflow PostFlow avec upload Frame.io réel
"""

import os
import sys
import json
import time
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.frameio import FrameIOClient
from src.integrations.discord import DiscordNotifier, DiscordConfig

def test_real_frameio_upload():
    """Test avec un vrai upload Frame.io"""
    print("🎬 " + "=" * 50)
    print("   TEST UPLOAD FRAME.IO RÉEL")
    print("=" * 52)
    
    # Load configurations
    frameio_config_path = Path(__file__).parent.parent / "config" / "frameio_config.json"
    discord_config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    
    with open(frameio_config_path, 'r') as f:
        frameio_config = json.load(f)
    
    with open(discord_config_path, 'r') as f:
        discord_config = json.load(f)['discord']
    
    # Create test file
    test_file = Path(__file__).parent.parent / "temp" / "UNDLM_00001_v999_test.mov"
    test_file.parent.mkdir(exist_ok=True)
    
    # Create a test file with some content
    with open(test_file, 'w') as f:
        f.write("# PostFlow Test File - Frame.io Upload Test\n")
        f.write(f"# Created: {datetime.now().isoformat()}\n")
        f.write("# This file tests the complete workflow\n")
        f.write("# " * 100)  # Make it a bit larger
    
    print(f"✅ Fichier de test créé: {test_file.name} ({test_file.stat().st_size} bytes)")
    
    # Initialize Frame.io client
    frameio_client = FrameIOClient(frameio_config)
    project_id = frameio_config.get('project_id')
    
    # Get project info to find root_asset_id
    project = frameio_client.get_project_info(project_id)
    root_asset_id = project.get('root_asset_id') if project else None
    
    if not root_asset_id:
        print("❌ Cannot find root asset ID")
        return
    
    print(f"📤 Upload vers Frame.io...")
    print(f"   • Project: {project.get('name', 'Unknown')}")
    print(f"   • Root Asset ID: {root_asset_id}")
    print(f"   • Fichier: {test_file.name}")
    
    try:
        # Use root_asset_id as parent_id for upload
        upload_result = frameio_client.upload_file(
            str(test_file),
            parent_id=root_asset_id
        )
        
        if upload_result and upload_result.get('success'):
            asset_id = upload_result.get('asset_id')
            print(f"✅ Upload réussi !")
            print(f"   • Asset ID: {asset_id}")
            
            # Send Discord notification
            discord_config_obj = DiscordConfig(
                webhook_url=discord_config['webhook_url'],
                bot_name=discord_config.get('username', 'PostFlow BOT'),
                avatar_url=discord_config.get('avatar_url', '')
            )
            discord = DiscordNotifier(discord_config_obj)
            
            embed = {
                "title": "🎉 UPLOAD FRAME.IO RÉUSSI !",
                "description": f"Le fichier test **UNDLM_00001_v999** a été uploadé avec succès",
                "color": 0x00ff00,
                "fields": [
                    {"name": "📁 Fichier", "value": test_file.name, "inline": True},
                    {"name": "🆔 Asset ID", "value": asset_id, "inline": True},
                    {"name": "📊 Taille", "value": f"{test_file.stat().st_size} bytes", "inline": True},
                    {"name": "🎯 Project", "value": "UNDLM_DOCU", "inline": True},
                    {"name": "🕒 Heure", "value": datetime.now().strftime("%H:%M:%S"), "inline": True},
                    {"name": "✅ Status", "value": "Upload terminé", "inline": True},
                    {"name": "🔗 Frame.io", "value": f"Vérifiez le projet UNDLM_DOCU sur Frame.io", "inline": False}
                ],
                "footer": {"text": "PostFlow - Upload Frame.io Test Réussi"}
            }
            
            discord.send_message("🎉 **UPLOAD RÉUSSI** - Frame.io Test", embed)
            print("📢 Notification Discord envoyée")
            
            print("\n" + "=" * 52)
            print("✅ TEST RÉUSSI !")
            print("🌐 Vérifiez Frame.io pour voir le fichier")
            print("📱 Vérifiez Discord pour la notification")
            print("=" * 52)
            
        else:
            print(f"❌ Upload échoué: {upload_result}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
    
    finally:
        # Clean up test file
        if test_file.exists():
            test_file.unlink()
            print(f"🧹 Fichier de test supprimé")

if __name__ == "__main__":
    test_real_frameio_upload()
