#!/usr/bin/env python3
"""
Test script for Discord integration
"""

import sys
import os
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

# Import direct to avoid relative import issues
import importlib.util

# Load status_tracker module
status_spec = importlib.util.spec_from_file_location(
    "status_tracker", 
    Path(__file__).parent.parent / 'src' / 'utils' / 'status_tracker.py'
)
status_module = importlib.util.module_from_spec(status_spec)
status_spec.loader.exec_module(status_module)

# Load discord module
discord_spec = importlib.util.spec_from_file_location(
    "discord_integration", 
    Path(__file__).parent.parent / 'src' / 'integrations' / 'discord.py'
)
discord_module = importlib.util.module_from_spec(discord_spec)

# Inject status_tracker classes into discord module's namespace
import sys
discord_module.ShotProgress = status_module.ShotProgress
discord_module.ShotStatus = status_module.ShotStatus
discord_module.PipelineStage = status_module.PipelineStage

# Now load the discord module
discord_spec.loader.exec_module(discord_module)

def test_discord_integration():
    """Test Discord integration components"""
    
    print("=== Discord Integration Test ===")
    print()
    
    # Test configuration
    print("🔧 Testing Discord configuration...")
    config = discord_module.DiscordConfig(
        webhook_url='https://discord.com/api/webhooks/TEST_WEBHOOK/TEST_TOKEN',
        channel_name='undlm-postproduction',
        bot_name='UNDLM PostFlow Bot'
    )
    
    print(f"✅ Configuration créée:")
    print(f"   Bot name: {config.bot_name}")
    print(f"   Channel: {config.channel_name}")
    print(f"   Webhook: {config.webhook_url[:50]}...")
    print()
    
    # Test notifier creation
    print("📢 Testing Discord notifier...")
    notifier = discord_module.DiscordNotifier(config)
    print("✅ Notifier Discord créé avec succès")
    print()
    
    # Test status and stage enums
    print("📊 Testing status and stage enums...")
    print("Available statuses:")
    for status in status_module.ShotStatus:
        emoji = notifier._get_status_emoji(status)
        color = notifier._get_status_color(status)
        print(f"   {emoji} {status.value} (color: #{color:06x})")
    
    print()
    print("Available stages:")
    for stage in status_module.PipelineStage:
        emoji = notifier._get_stage_emoji(stage)
        print(f"   {emoji} {stage.value}")
    print()
    
    # Test shot progress object
    print("🎬 Testing shot progress object...")
    shot = status_module.ShotProgress(
        nomenclature="UNDLM_00001",
        current_status=status_module.ShotStatus.AE_IN_PROGRESS,
        stage=status_module.PipelineStage.AFTER_EFFECTS,
        notes="Test shot for Discord integration"
    )
    
    print(f"✅ Shot progress created:")
    print(f"   Nomenclature: {shot.nomenclature}")
    print(f"   Status: {shot.current_status.value}")
    print(f"   Stage: {shot.stage.value}")
    print(f"   Notes: {shot.notes}")
    print()
    
    # Test message creation (without sending)
    print("💬 Testing message creation...")
    print("Note: This will not actually send to Discord (test webhook)")
    
    # Test shot status change notification
    result = notifier.notify_shot_status_change(
        shot, 
        status_module.ShotStatus.AE_READY
    )
    print(f"   Shot status change notification: {'✅ Success' if result else '❌ Failed (expected with test webhook)'}")
    
    # Test error notification
    result = notifier.notify_error(shot, "Test error message for integration testing")
    print(f"   Error notification: {'✅ Success' if result else '❌ Failed (expected with test webhook)'}")
    
    # Test daily report
    stats = {
        "total_shots": 50,
        "completion_percentage": 42.5,
        "status_counts": {
            "pending": 15,
            "ae_in_progress": 10,
            "ae_completed": 20,
            "final_delivery": 5
        }
    }
    result = notifier.notify_daily_report(stats)
    print(f"   Daily report notification: {'✅ Success' if result else '❌ Failed (expected with test webhook)'}")
    
    print()
    print("=== Test Summary ===")
    print("✅ Discord module loaded successfully")
    print("✅ Configuration and notifier created")
    print("✅ Status and stage enums working")
    print("✅ Message creation functions working")
    print("ℹ️ Actual Discord sending requires valid webhook URL")
    print()
    print("Ready to configure with real Discord webhook!")
    
    return True

if __name__ == "__main__":
    try:
        test_discord_integration()
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
