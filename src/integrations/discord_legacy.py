"""
Discord Integration for Pipeline Notifications
Sends status updates and notifications to Discord channels
"""

import json
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime
from dataclasses import dataclass
import pytz

# Fuseau horaire Paris
PARIS_TZ = pytz.timezone('Europe/Paris')

def get_paris_time():
    """Retourne l'heure actuelle en fuseau horaire Paris"""
    return datetime.now(PARIS_TZ)
import requests
from pathlib import Path

from ..utils.status_tracker import ShotProgress, ShotStatus, PipelineStage


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
        """
        Initialize Discord notifier.
        
        Args:
            config: Discord configuration
        """
        self.config = config
        self.last_notification_time = {}
        
    def send_message(self, message: str, embed: Optional[Dict[str, Any]] = None) -> bool:
        """
        Send a message to Discord.
        
        Args:
            message: Message content
            embed: Optional embed content
            
        Returns:
            True if sent successfully
        """
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
            
            response = requests.post(webhook_url, json=payload)
            response.raise_for_status()
            
            print(f"📢 Discord notification sent: {message[:50]}...")
            return True
            
        except Exception as e:
            print(f"❌ Discord notification failed: {e}")
            return False
    
    def notify_shot_status_change(self, shot: ShotProgress, previous_status: ShotStatus) -> bool:
        """
        Notify about a shot status change.
        
        Args:
            shot: Shot progress object
            previous_status: Previous status
            
        Returns:
            True if notification sent
        """
        # Create status message
        status_emoji = self._get_status_emoji(shot.current_status)
        stage_emoji = self._get_stage_emoji(shot.stage)
        
        message = f"{status_emoji} **{shot.nomenclature}** status updated"
        
        # Create embed
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
        
        # Add notes if available
        if shot.notes:
            embed["fields"].append({
                "name": "Notes",
                "value": shot.notes,
                "inline": False
            })
        
        # Add error message if in error state
        if shot.current_status == ShotStatus.ERROR and shot.error_message:
            embed["fields"].append({
                "name": "Error",
                "value": shot.error_message,
                "inline": False
            })
        
        return self.send_message(message, embed)
    
    def notify_scene_completion(self, scene_name: str, completed_shots: List[ShotProgress]) -> bool:
        """
        Notify about scene completion.
        
        Args:
            scene_name: Name of the completed scene
            completed_shots: List of completed shots
            
        Returns:
            True if notification sent
        """
        message = f"🎉 **Scene Completed**: {scene_name}"
        
        embed = {
            "title": "Scene Completion",
            "description": f"All shots in scene '{scene_name}' have been completed!",
            "color": 0x00ff00,  # Green
            "fields": [
                {
                    "name": "Shots Completed",
                    "value": str(len(completed_shots)),
                    "inline": True
                },
                {
                    "name": "Scene Name",
                    "value": scene_name,
                    "inline": True
                }
            ],
            "timestamp": get_paris_time().isoformat(),
            "footer": {
                "text": "RL PostFlow Pipeline"
            }
        }
        
        # List completed shots
        shot_list = "\n".join([f"• {shot.nomenclature}" for shot in completed_shots])
        if len(shot_list) > 1000:  # Discord field limit
            shot_list = shot_list[:1000] + "..."
        
        embed["fields"].append({
            "name": "Completed Shots",
            "value": shot_list,
            "inline": False
        })
        
        return self.send_message(message, embed)
    
    def notify_daily_report(self, stats: Dict[str, Any]) -> bool:
        """
        Send daily pipeline report.
        
        Args:
            stats: Pipeline statistics
            
        Returns:
            True if notification sent
        """
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
            "timestamp": get_paris_time().isoformat(),
            "footer": {
                "text": "RL PostFlow Pipeline"
            }
        }
        
        # Add status breakdown
        status_text = ""
        for status, count in stats["status_counts"].items():
            if count > 0:
                emoji = self._get_status_emoji(ShotStatus(status))
                status_text += f"{emoji} {status.replace('_', ' ').title()}: {count}\n"
        
        if status_text:
            embed["fields"].append({
                "name": "Status Breakdown",
                "value": status_text,
                "inline": False
            })
        
        return self.send_message(message, embed)
    
    def notify_error(self, shot: ShotProgress, error_message: str) -> bool:
        """
        Notify about an error.
        
        Args:
            shot: Shot with error
            error_message: Error description
            
        Returns:
            True if notification sent
        """
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
            "timestamp": get_paris_time().isoformat(),
            "footer": {
                "text": "RL PostFlow Pipeline"
            }
        }
        
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


def create_discord_notifier(webhook_url: str, channel_name: str = "postproduction") -> DiscordNotifier:
    """
    Create a Discord notifier instance.
    
    Args:
        webhook_url: Discord webhook URL
        channel_name: Channel name for notifications
        
    Returns:
        Configured Discord notifier
    """
    config = DiscordConfig(
        webhook_url=webhook_url,
        channel_name=channel_name
    )
    return DiscordNotifier(config)
