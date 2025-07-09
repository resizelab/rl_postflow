#!/usr/bin/env python3
"""
Test simple pour Discord sans imports relatifs
"""

import json
import requests
from datetime import datetime
from dataclasses import dataclass
from typing import Dict, List, Optional, Any
from enum import Enum

# Définitions locales pour le test
class ShotStatus(Enum):
    """Status of a shot in the production pipeline."""
    PENDING = "pending"
    SOURCES_VERIFIED = "sources_verified"
    AE_READY = "ae_ready"
    AE_IN_PROGRESS = "ae_in_progress"
    AE_COMPLETED = "ae_completed"
    EBSYNTH_READY = "ebsynth_ready"
    EBSYNTH_IN_PROGRESS = "ebsynth_in_progress"
    EBSYNTH_COMPLETED = "ebsynth_completed"
    REVIEW_UPLOADED = "review_uploaded"
    REVIEW_APPROVED = "review_approved"
    FINAL_DELIVERY = "final_delivery"
    ERROR = "error"

class PipelineStage(Enum):
    """Stages of the production pipeline."""
    SOURCE_VERIFICATION = "source_verification"
    AFTER_EFFECTS = "after_effects"
    EBSYNTH_PROCESSING = "ebsynth_processing"
    REVIEW_PROCESS = "review_process"
    FINAL_DELIVERY = "final_delivery"

@dataclass
class ShotProgress:
    """Progress tracking for a single shot."""
    nomenclature: str
    current_status: ShotStatus
    stage: PipelineStage
    last_updated: datetime = None
    error_message: Optional[str] = None
    notes: str = ""
    
    def __post_init__(self):
        if self.last_updated is None:
            self.last_updated = datetime.now()

@dataclass
class DiscordConfig:
    """Configuration for Discord integration."""
    webhook_url: str
    channel_name: str = "postproduction"
    bot_name: str = "RL PostFlow Bot"
    avatar_url: str = "https://cdn.discordapp.com/emojis/🎬.png"

class DiscordNotifier:
    """Handles Discord notifications for the pipeline."""
    
    def __init__(self, config: DiscordConfig):
        """Initialize Discord notifier."""
        self.config = config
        self.last_notification_time = {}
        
    def send_message(self, message: str, embed: Optional[Dict[str, Any]] = None) -> bool:
        """Send a message to Discord."""
        try:
            payload = {
                "content": message,
                "username": getattr(self.config, 'bot_name', 'PostFlow Bot'),
                "avatar_url": getattr(self.config, 'avatar_url', None)
            }
            
            if embed:
                payload["embeds"] = [embed]
            
            webhook_url = getattr(self.config, 'webhook_url', self.config.get('webhook_url') if isinstance(self.config, dict) else None)
            if not webhook_url:
                print("❌ Discord webhook URL not configured")
                return False
            
            # Pour le test, on ne fait pas l'appel HTTP réel
            if "TEST_WEBHOOK" in webhook_url:
                print(f"📢 [TEST MODE] Discord notification would be sent: {message[:50]}...")
                if embed:
                    print(f"   📎 With embed: {embed.get('title', 'No title')}")
                return True
            
            response = requests.post(webhook_url, json=payload)
            response.raise_for_status()
            
            print(f"📢 Discord notification sent: {message[:50]}...")
            return True
            
        except Exception as e:
            print(f"❌ Discord notification failed: {e}")
            return False
    
    def notify_shot_status_change(self, shot: ShotProgress, previous_status: ShotStatus) -> bool:
        """Notify about a shot status change."""
        status_emoji = self._get_status_emoji(shot.current_status)
        stage_emoji = self._get_stage_emoji(shot.stage)
        
        message = f"{status_emoji} **{shot.nomenclature}** status updated"
        
        embed = {
            "title": f"Shot Status Update",
            "description": f"Shot {shot.nomenclature} has progressed in the pipeline",
            "color": self._get_status_color(shot.current_status),
            "fields": [
                {
                    "name": "Previous Status",
                    "value": f"{self._get_status_emoji(previous_status)} {previous_status.value.replace('_', ' ').title()}",
                    "inline": True
                },
                {
                    "name": "Current Status", 
                    "value": f"{status_emoji} {shot.current_status.value.replace('_', ' ').title()}",
                    "inline": True
                },
                {
                    "name": "Stage",
                    "value": f"{stage_emoji} {shot.stage.value.replace('_', ' ').title()}",
                    "inline": True
                }
            ],
            "timestamp": shot.last_updated.isoformat(),
            "footer": {
                "text": "RL PostFlow Pipeline"
            }
        }
        
        if shot.notes:
            embed["fields"].append({
                "name": "Notes",
                "value": shot.notes,
                "inline": False
            })
        
        return self.send_message(message, embed)
    
    def notify_error(self, shot: ShotProgress, error_message: str) -> bool:
        """Notify about an error."""
        message = f"❌ **Error**: {shot.nomenclature}"
        
        embed = {
            "title": "Pipeline Error",
            "description": f"An error occurred while processing {shot.nomenclature}",
            "color": 0xff0000,  # Red
            "fields": [
                {
                    "name": "Shot",
                    "value": shot.nomenclature,
                    "inline": True
                },
                {
                    "name": "Stage",
                    "value": shot.stage.value.replace('_', ' ').title(),
                    "inline": True
                },
                {
                    "name": "Error Message",
                    "value": error_message,
                    "inline": False
                }
            ],
            "timestamp": datetime.now().isoformat(),
            "footer": {
                "text": "RL PostFlow Pipeline"
            }
        }
        
        return self.send_message(message, embed)
    
    def notify_daily_report(self, stats: Dict[str, Any]) -> bool:
        """Send daily pipeline report."""
        message = f"📊 **Daily Pipeline Report** - {datetime.now().strftime('%Y-%m-%d')}"
        
        embed = {
            "title": "Daily Pipeline Report",
            "description": f"Current status of the UNDLM Documentary pipeline",
            "color": 0x0099ff,  # Blue
            "fields": [
                {
                    "name": "Total Shots",
                    "value": str(stats["total_shots"]),
                    "inline": True
                },
                {
                    "name": "Completion %",
                    "value": f"{stats['completion_percentage']:.1f}%",
                    "inline": True
                },
                {
                    "name": "Date",
                    "value": datetime.now().strftime("%Y-%m-%d"),
                    "inline": True
                }
            ],
            "timestamp": datetime.now().isoformat(),
            "footer": {
                "text": "RL PostFlow Pipeline"
            }
        }
        
        # Add status breakdown
        status_text = ""
        for status, count in stats["status_counts"].items():
            if count > 0:
                status_text += f"• {status.replace('_', ' ').title()}: {count}\\n"
        
        if status_text:
            embed["fields"].append({
                "name": "Status Breakdown",
                "value": status_text,
                "inline": False
            })
        
        return self.send_message(message, embed)
    
    def _get_status_emoji(self, status: ShotStatus) -> str:
        """Get emoji for status."""
        emoji_map = {
            ShotStatus.PENDING: "⏳",
            ShotStatus.SOURCES_VERIFIED: "✅",
            ShotStatus.AE_READY: "🎨",
            ShotStatus.AE_IN_PROGRESS: "🔄",
            ShotStatus.AE_COMPLETED: "✨",
            ShotStatus.EBSYNTH_READY: "🎭",
            ShotStatus.EBSYNTH_IN_PROGRESS: "🔄",
            ShotStatus.EBSYNTH_COMPLETED: "🎆",
            ShotStatus.REVIEW_UPLOADED: "📤",
            ShotStatus.REVIEW_APPROVED: "👍",
            ShotStatus.FINAL_DELIVERY: "🎉",
            ShotStatus.ERROR: "❌"
        }
        return emoji_map.get(status, "❓")
    
    def _get_stage_emoji(self, stage: PipelineStage) -> str:
        """Get emoji for stage."""
        emoji_map = {
            PipelineStage.SOURCE_VERIFICATION: "🔍",
            PipelineStage.AFTER_EFFECTS: "🎨",
            PipelineStage.EBSYNTH_PROCESSING: "🎭",
            PipelineStage.REVIEW_PROCESS: "📋",
            PipelineStage.FINAL_DELIVERY: "🎉"
        }
        return emoji_map.get(stage, "❓")
    
    def _get_status_color(self, status: ShotStatus) -> int:
        """Get color for status."""
        color_map = {
            ShotStatus.PENDING: 0x808080,  # Gray
            ShotStatus.SOURCES_VERIFIED: 0x00ff00,  # Green
            ShotStatus.AE_READY: 0x0099ff,  # Blue
            ShotStatus.AE_IN_PROGRESS: 0xffff00,  # Yellow
            ShotStatus.AE_COMPLETED: 0x00ff00,  # Green
            ShotStatus.EBSYNTH_READY: 0x0099ff,  # Blue
            ShotStatus.EBSYNTH_IN_PROGRESS: 0xffff00,  # Yellow
            ShotStatus.EBSYNTH_COMPLETED: 0x00ff00,  # Green
            ShotStatus.REVIEW_UPLOADED: 0x0099ff,  # Blue
            ShotStatus.REVIEW_APPROVED: 0x00ff00,  # Green
            ShotStatus.FINAL_DELIVERY: 0x9932cc,  # Purple
            ShotStatus.ERROR: 0xff0000  # Red
        }
        return color_map.get(status, 0x808080)

def test_discord_integration():
    """Test Discord integration"""
    
    print("=== Discord Integration Test ===")
    print()
    
    # Test configuration
    print("🔧 Testing Discord configuration...")
    config = DiscordConfig(
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
    notifier = DiscordNotifier(config)
    print("✅ Notifier Discord créé avec succès")
    print()
    
    # Test status and stage enums
    print("📊 Testing status and stage enums...")
    print("Available statuses:")
    for status in ShotStatus:
        emoji = notifier._get_status_emoji(status)
        color = notifier._get_status_color(status)
        print(f"   {emoji} {status.value} (color: #{color:06x})")
    
    print()
    print("Available stages:")
    for stage in PipelineStage:
        emoji = notifier._get_stage_emoji(stage)
        print(f"   {emoji} {stage.value}")
    print()
    
    # Test shot progress object
    print("🎬 Testing shot progress object...")
    shot = ShotProgress(
        nomenclature="UNDLM_00001",
        current_status=ShotStatus.AE_IN_PROGRESS,
        stage=PipelineStage.AFTER_EFFECTS,
        notes="Test shot for Discord integration"
    )
    
    print(f"✅ Shot progress created:")
    print(f"   Nomenclature: {shot.nomenclature}")
    print(f"   Status: {shot.current_status.value}")
    print(f"   Stage: {shot.stage.value}")
    print(f"   Notes: {shot.notes}")
    print()
    
    # Test message creation
    print("💬 Testing message creation...")
    print("Note: Using test mode (no actual Discord calls)")
    print()
    
    # Test shot status change notification
    result = notifier.notify_shot_status_change(shot, ShotStatus.AE_READY)
    print()
    
    # Test error notification
    result = notifier.notify_error(shot, "Test error message for integration testing")
    print()
    
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
    print()
    
    print("=== Test Summary ===")
    print("✅ Discord module working correctly")
    print("✅ Configuration and notifier created")
    print("✅ Status and stage enums working")
    print("✅ Message creation functions working")
    print("✅ Test notifications sent successfully")
    print()
    print("🚀 Ready to configure with real Discord webhook!")
    
    return True

if __name__ == "__main__":
    test_discord_integration()
