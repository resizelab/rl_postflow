"""
Discord Notifier Module
Enhanced Discord notification system with user mentions and Frame.io integration
"""

import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone, timedelta
import requests
from dataclasses import dataclass
import pytz

logger = logging.getLogger(__name__)

# Fuseau horaire Paris
PARIS_TZ = pytz.timezone('Europe/Paris')

def get_paris_time():
    """Retourne l'heure actuelle en fuseau horaire Paris"""
    return datetime.now(PARIS_TZ)


@dataclass
class DiscordNotifierConfig:
    """Configuration for Discord notifier."""
    webhook_url: str
    channel_name: str = "postproduction"
    bot_name: str = "RL PostFlow Bot"
    avatar_url: str = "https://cdn.discordapp.com/emojis/🎬.png"


class DiscordNotifier:
    """Enhanced Discord notifier with user mentions and Frame.io integration."""
    
    def __init__(self, config):
        """
        Initialize Discord notifier.
        
        Args:
            config: Configuration manager or DiscordNotifierConfig
        """
        if isinstance(config, dict):
            # Dictionnaire simple
            self.webhook_url = config.get('webhook_url')
            self.bot_name = config.get('username', 'RL PostFlow Bot')
            self.avatar_url = config.get('avatar_url', 'https://cdn.discordapp.com/emojis/🎬.png')
        elif hasattr(config, 'get'):
            # Configuration manager
            self.webhook_url = config.get('discord.webhook_url')
            self.bot_name = config.get('discord.username', 'RL PostFlow Bot')
            self.avatar_url = config.get('discord.avatar_url', 'https://cdn.discordapp.com/emojis/🎬.png')
        else:
            # DiscordNotifierConfig
            self.webhook_url = config.webhook_url
            self.bot_name = config.bot_name
            self.avatar_url = config.avatar_url
        
        self.last_notification_time = {}
    
    def send_message(self, message: str, embed: Optional[Dict[str, Any]] = None) -> bool:
        """
        Send a message to Discord.
        
        Args:
            message: Message content
            embed: Optional embed content
            
        Returns:
            bool: True if sent successfully
        """
        try:
            payload = {
                "content": message,
                "username": self.bot_name,
                "avatar_url": self.avatar_url
            }
            
            if embed:
                payload["embeds"] = [embed]
            
            if not self.webhook_url:
                logger.error("Discord webhook URL not configured")
                return False
            
            response = requests.post(self.webhook_url, json=payload)
            response.raise_for_status()
            
            logger.info(f"Discord notification sent: {message[:50]}...")
            return True
            
        except Exception as e:
            logger.error(f"Discord notification failed: {e}")
            return False
    
    def notify_shot_upload_complete(self, shot_nomenclature: str, scene_name: str, 
                                   version: str, frameio_link: str,
                                   mention_user_id: Optional[str] = None) -> bool:
        """
        Notify about a completed shot upload with Frame.io review link.
        
        Args:
            shot_nomenclature: Shot nomenclature
            scene_name: Scene name
            version: Version number
            frameio_link: Frame.io review link
            mention_user_id: Discord user ID to mention
            
        Returns:
            bool: True if notification sent
        """
        # Build message with user mention
        message_parts = []
        
        if mention_user_id:
            message_parts.append(f"Hey <@{mention_user_id}>")
        
        message_parts.append(f"🎬 Le plan **{shot_nomenclature}** ({scene_name}) {version} est disponible pour review")
        
        content = " ".join(message_parts)
        
        # Create embed
        embed = {
            "title": "Shot Upload Complete",
            "description": f"Le plan {shot_nomenclature} est prêt pour review",
            "color": 0x00ff00,  # Green
            "fields": [
                {
                    "name": "Plan",
                    "value": shot_nomenclature,
                    "inline": True
                },
                {
                    "name": "Séquence",
                    "value": scene_name,
                    "inline": True
                },
                {
                    "name": "Version",
                    "value": version,
                    "inline": True
                },
                {
                    "name": "Review Link",
                    "value": f"[Voir sur Frame.io]({frameio_link})",
                    "inline": False
                }
            ],
            "timestamp": get_paris_time().isoformat(),
            "footer": {
                "text": "RL PostFlow Pipeline"
            }
        }
        
        return self.send_message(content, embed)
    
    def notify_shot_status_change(self, shot_nomenclature: str, previous_status: str, 
                                 current_status: str, stage: str,
                                 frameio_link: Optional[str] = None,
                                 mention_user_id: Optional[str] = None,
                                 notes: Optional[str] = None) -> bool:
        """
        Notify about a shot status change.
        
        Args:
            shot_nomenclature: Shot nomenclature
            previous_status: Previous status
            current_status: Current status
            stage: Pipeline stage
            frameio_link: Frame.io review link
            mention_user_id: Discord user ID to mention
            notes: Optional notes
            
        Returns:
            bool: True if notification sent
        """
        # Build message with user mention
        message_parts = []
        
        if mention_user_id:
            message_parts.append(f"Hey <@{mention_user_id}>")
        
        message_parts.append(f"🎬 **{shot_nomenclature}** status updated")
        
        content = " ".join(message_parts)
        
        # Create embed
        embed = {
            "title": "Shot Status Update",
            "description": f"Shot {shot_nomenclature} has progressed in the pipeline",
            "color": self._get_status_color(current_status),
            "fields": [
                {
                    "name": "Previous Status",
                    "value": f"{self._get_status_emoji(previous_status)} {previous_status.replace('_', ' ').title()}",
                    "inline": True
                },
                {
                    "name": "Current Status", 
                    "value": f"{self._get_status_emoji(current_status)} {current_status.replace('_', ' ').title()}",
                    "inline": True
                },
                {
                    "name": "Stage",
                    "value": f"{self._get_stage_emoji(stage)} {stage.replace('_', ' ').title()}",
                    "inline": True
                }
            ],
            "timestamp": get_paris_time().isoformat(),
            "footer": {
                "text": "RL PostFlow Pipeline"
            }
        }
        
        # Add Frame.io link if available
        if frameio_link:
            embed["fields"].append({
                "name": "Review Link",
                "value": f"[Voir sur Frame.io]({frameio_link})",
                "inline": False
            })
        
        # Add notes if available
        if notes:
            embed["fields"].append({
                "name": "Notes",
                "value": notes,
                "inline": False
            })
        
        return self.send_message(content, embed)
    
    def notify_scene_completion(self, scene_name: str, completed_shots: List[str],
                               mention_user_id: Optional[str] = None) -> bool:
        """
        Notify about scene completion.
        
        Args:
            scene_name: Name of the completed scene
            completed_shots: List of completed shot nomenclatures
            mention_user_id: Discord user ID to mention
            
        Returns:
            bool: True if notification sent
        """
        # Build message with user mention
        message_parts = []
        
        if mention_user_id:
            message_parts.append(f"Hey <@{mention_user_id}>")
        
        message_parts.append(f"🎉 **Scene Completed**: {scene_name}")
        
        content = " ".join(message_parts)
        
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
        shot_list = "\n".join([f"• {shot}" for shot in completed_shots])
        if len(shot_list) > 1000:  # Discord field limit
            shot_list = shot_list[:1000] + "..."
        
        embed["fields"].append({
            "name": "Completed Shots",
            "value": shot_list,
            "inline": False
        })
        
        return self.send_message(content, embed)
    
    def notify_file_processed(self, filename: str, message: str, frameio_link: str = None, 
                             thumbnail_url: str = None) -> bool:
        """
        Notify about a processed file.
        
        Args:
            filename: Name of the processed file
            message: Description message
            frameio_link: Optional Frame.io link
            thumbnail_url: Optional thumbnail URL for embed
            
        Returns:
            bool: True if notification sent
        """
        embed = {
            "title": "🎬 Fichier traité",
            "description": f"**{filename}**",
            "color": 0x00ff00,
            "fields": [
                {"name": "Fichier", "value": filename, "inline": True}
            ],
            "timestamp": get_paris_time().isoformat()
        }
        
        if frameio_link:
            embed["fields"].append({"name": "Frame.io", "value": f"[Voir sur Frame.io]({frameio_link})", "inline": True})
        
        if thumbnail_url:
            # Utiliser image au lieu de thumbnail pour un preview complet
            embed["image"] = {"url": thumbnail_url}
            embed["fields"].append({"name": "Aperçu", "value": f"[Voir le thumbnail]({thumbnail_url})", "inline": True})
        
        # Message simple sans lien Frame.io en doublon
        return self.send_message("", embed)
    
    def notify_error(self, title: str, error_message: str) -> bool:
        """
        Notify about an error.
        
        Args:
            title: Error title
            error_message: Error description
            
        Returns:
            bool: True if notification sent
        """
        embed = {
            "title": f"❌ {title}",
            "description": error_message,
            "color": 0xff0000,
            "timestamp": get_paris_time().isoformat()
        }
        
        return self.send_message(f"❌ {title}", embed)
    
    def notify_system_status(self, title: str, message: str) -> bool:
        """
        Notify about system status.
        
        Args:
            title: Status title
            message: Status message
            
        Returns:
            bool: True if notification sent
        """
        embed = {
            "title": title,
            "description": message,
            "color": 0x0099ff,
            "timestamp": get_paris_time().isoformat()
        }
        
        return self.send_message(title, embed)
    
    def _get_status_emoji(self, status: str) -> str:
        """Get emoji for status."""
        emoji_map = {
            "pending": "⏳",
            "sources_verified": "✅",
            "ae_ready": "🎨",
            "ae_in_progress": "🔄",
            "ae_completed": "✨",
            "ebsynth_ready": "🎭",
            "ebsynth_in_progress": "🔄",
            "ebsynth_completed": "🎆",
            "review_uploaded": "📤",
            "review_approved": "👍",
            "final_delivery": "🎉",
            "error": "❌"
        }
        return emoji_map.get(status.lower(), "❓")
    
    def _get_stage_emoji(self, stage: str) -> str:
        """Get emoji for stage."""
        emoji_map = {
            "source_verification": "🔍",
            "after_effects": "🎨",
            "ebsynth_processing": "🎭",
            "review_process": "📋",
            "final_delivery": "🎉"
        }
        return emoji_map.get(stage.lower(), "❓")
    
    def _get_status_color(self, status: str) -> int:
        """Get color for status."""
        color_map = {
            "pending": 0x808080,  # Gray
            "sources_verified": 0x00ff00,  # Green
            "ae_ready": 0x0099ff,  # Blue
            "ae_in_progress": 0xffff00,  # Yellow
            "ae_completed": 0x00ff00,  # Green
            "ebsynth_ready": 0x0099ff,  # Blue
            "ebsynth_in_progress": 0xffff00,  # Yellow
            "ebsynth_completed": 0x00ff00,  # Green
            "review_uploaded": 0x0099ff,  # Blue
            "review_approved": 0x00ff00,  # Green
            "final_delivery": 0x9932cc,  # Purple
            "error": 0xff0000  # Red
        }
        return color_map.get(status.lower(), 0x808080)


def create_discord_notifier(webhook_url: str, channel_name: str = "postproduction") -> DiscordNotifier:
    """
    Create a Discord notifier instance.
    
    Args:
        webhook_url: Discord webhook URL
        channel_name: Channel name for notifications
        
    Returns:
        DiscordNotifier: Configured Discord notifier
    """
    config = DiscordNotifierConfig(
        webhook_url=webhook_url,
        channel_name=channel_name
    )
    return DiscordNotifier(config)
