"""
Review Workflow Manager for UNDLM PostFlow
Manages the complete review process: LucidLink → Frame.io → Discord notifications
"""

import logging
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum

from .lucidlink import LucidLinkIntegration
from .frameio import FrameIOClient
from .discord import DiscordNotifier

logger = logging.getLogger(__name__)

class ReviewStatus(Enum):
    """Status of a shot in the review process"""
    EXPORTED = "exported"  # Fichier exporté, prêt pour review
    REVIEW_REQUESTED = "review_requested"  # Review demandée par l'utilisateur
    UPLOADED = "uploaded"  # Upload Frame.io terminé
    IN_REVIEW = "in_review"  # En cours de review
    APPROVED = "approved"  # Approuvé par le superviseur
    REJECTED = "rejected"  # Rejeté, corrections nécessaires
    COMMENTS_AVAILABLE = "comments_available"  # Commentaires disponibles

@dataclass
class ReviewItem:
    """Represents a shot in the review process"""
    nomenclature: str
    scene_name: str
    file_path: str
    version: int
    status: ReviewStatus
    frameio_asset_id: Optional[str] = None
    frameio_review_link: Optional[str] = None
    created_at: datetime = None
    updated_at: datetime = None
    comments_count: int = 0
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()
        if self.updated_at is None:
            self.updated_at = datetime.now()

class ReviewWorkflowManager:
    """
    Manages the complete review workflow for UNDLM PostFlow
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.lucidlink = None
        self.frameio = None
        self.discord = None
        
        # Initialize integrations
        self._initialize_integrations()
        
        # Review database (in-memory for now, could be persistent)
        self.review_items: Dict[str, ReviewItem] = {}
        
        # Load existing review state if available
        self._load_review_state()
    
    def _initialize_integrations(self):
        """Initialize all integrations"""
        try:
            # LucidLink
            lucidlink_config = self.config.get('lucidlink', {})
            if not lucidlink_config:
                lucidlink_config = {'base_path': '/Volumes/resizelab/o2b-undllm'}
            self.lucidlink = LucidLinkIntegration(lucidlink_config)
            
            # Frame.io
            frameio_config = self.config.get('frameio', {})
            if frameio_config:
                self.frameio = FrameIOClient(frameio_config)
            
            # Discord
            discord_config = self.config.get('discord', {})
            if discord_config and discord_config.get('webhook_url'):
                from .discord import DiscordConfig
                discord_config_obj = DiscordConfig(
                    webhook_url=discord_config['webhook_url'],
                    bot_name=discord_config.get('username', 'PostFlow BOT'),
                    avatar_url=discord_config.get('avatar_url', '')
                )
                self.discord = DiscordNotifier(discord_config_obj)
                
        except Exception as e:
            logger.error(f"Error initializing integrations: {e}")
    
    def scan_new_exports(self) -> List[ReviewItem]:
        """
        Scan LucidLink for new exported files
        Returns list of newly detected files
        """
        if not self.lucidlink or not self.lucidlink.connected:
            logger.warning("LucidLink not connected, cannot scan for exports")
            return []
        
        new_items = []
        
        try:
            # Scan the outputs folder for new files
            outputs_path = self.lucidlink.outputs_path / "BY_SHOT"
            if not outputs_path.exists():
                return []
            
            for shot_folder in outputs_path.iterdir():
                if not shot_folder.is_dir():
                    continue
                    
                nomenclature = shot_folder.name
                
                # Look for .mov files in the shot folder
                for mov_file in shot_folder.glob("*.mov"):
                    file_key = f"{nomenclature}_{mov_file.name}"
                    
                    # Check if this file is already in our review system
                    if file_key not in self.review_items:
                        # Extract version from filename
                        version = self._extract_version(mov_file.name)
                        
                        # Verify nomenclature
                        if self._verify_nomenclature(nomenclature):
                            # Create new review item
                            review_item = ReviewItem(
                                nomenclature=nomenclature,
                                scene_name=self._get_scene_name(nomenclature),
                                file_path=str(mov_file),
                                version=version,
                                status=ReviewStatus.EXPORTED
                            )
                            
                            self.review_items[file_key] = review_item
                            new_items.append(review_item)
                            
                            logger.info(f"New export detected: {nomenclature} v{version}")
                        else:
                            logger.warning(f"Invalid nomenclature: {nomenclature}")
                            
        except Exception as e:
            logger.error(f"Error scanning for new exports: {e}")
        
        return new_items
    
    def notify_new_export(self, review_item: ReviewItem):
        """
        Notify about new export availability
        """
        if not self.discord:
            logger.warning("Discord not configured, cannot send notifications")
            return
        
        try:
            embed = {
                "title": "🎬 Nouveau fichier exporté",
                "description": f"Plan **{review_item.nomenclature}** v{review_item.version} disponible",
                "color": 0x00ff00,
                "fields": [
                    {"name": "Scène", "value": review_item.scene_name, "inline": True},
                    {"name": "Version", "value": str(review_item.version), "inline": True},
                    {"name": "Statut", "value": "Prêt pour review", "inline": True},
                    {"name": "Fichier", "value": Path(review_item.file_path).name, "inline": False}
                ],
                "footer": {"text": "Répondez 'review' pour envoyer sur Frame.io"}
            }
            
            self.discord.send_message(
                f"📁 **Fichier prêt** - {review_item.nomenclature}",
                embed
            )
            
            logger.info(f"Notification sent for {review_item.nomenclature}")
            
        except Exception as e:
            logger.error(f"Error sending notification: {e}")
    
    def request_review(self, nomenclature: str, user_name: str = "Utilisateur") -> bool:
        """
        Request review for a specific shot (upload to Frame.io)
        """
        # Find the review item
        review_item = None
        for key, item in self.review_items.items():
            if item.nomenclature == nomenclature and item.status == ReviewStatus.EXPORTED:
                review_item = item
                break
        
        if not review_item:
            logger.warning(f"No exportable file found for {nomenclature}")
            return False
        
        try:
            # Update status
            review_item.status = ReviewStatus.REVIEW_REQUESTED
            review_item.updated_at = datetime.now()
            
            # Upload to Frame.io
            if self.frameio:
                result = self.frameio.upload_file(review_item.file_path)
                if result['success']:
                    review_item.frameio_asset_id = result.get('asset_id')
                    review_item.status = ReviewStatus.UPLOADED
                    
                    # Create review link
                    review_link = self.frameio.create_review_link(review_item.frameio_asset_id)
                    if review_link:
                        review_item.frameio_review_link = review_link
                        review_item.status = ReviewStatus.IN_REVIEW
                        
                        # Notify supervisor
                        self._notify_supervisor_review_ready(review_item, user_name)
                        
                        logger.info(f"Review requested for {nomenclature}")
                        return True
                    else:
                        logger.error(f"Failed to create review link for {nomenclature}")
                else:
                    logger.error(f"Failed to upload {nomenclature} to Frame.io")
            
        except Exception as e:
            logger.error(f"Error requesting review for {nomenclature}: {e}")
        
        return False
    
    def _notify_supervisor_review_ready(self, review_item: ReviewItem, user_name: str):
        """
        Notify supervisor that a shot is ready for review
        """
        if not self.discord:
            return
        
        try:
            embed = {
                "title": "👀 Nouveau plan à reviewer",
                "description": f"**{review_item.nomenclature}** v{review_item.version} prêt pour review",
                "color": 0xff9900,
                "fields": [
                    {"name": "Demandé par", "value": user_name, "inline": True},
                    {"name": "Scène", "value": review_item.scene_name, "inline": True},
                    {"name": "Version", "value": str(review_item.version), "inline": True},
                    {"name": "Lien Frame.io", "value": f"[🔗 Voir le plan]({review_item.frameio_review_link})", "inline": False}
                ],
                "footer": {"text": "Répondez 'approved' ou 'rejected' quand terminé"}
            }
            
            self.discord.send_message(
                f"🎯 **Review demandée** - {review_item.nomenclature}",
                embed
            )
            
        except Exception as e:
            logger.error(f"Error notifying supervisor: {e}")
    
    def update_review_status(self, nomenclature: str, status: ReviewStatus, supervisor_name: str = "Superviseur"):
        """
        Update review status (called by supervisor)
        """
        review_item = None
        for key, item in self.review_items.items():
            if item.nomenclature == nomenclature and item.status == ReviewStatus.IN_REVIEW:
                review_item = item
                break
        
        if not review_item:
            logger.warning(f"No review in progress for {nomenclature}")
            return False
        
        try:
            review_item.status = status
            review_item.updated_at = datetime.now()
            
            # Check for comments
            if self.frameio and review_item.frameio_asset_id:
                comments = self.frameio.get_asset_comments(review_item.frameio_asset_id)
                review_item.comments_count = len(comments) if comments else 0
            
            # Notify user
            self._notify_user_review_completed(review_item, supervisor_name)
            
            logger.info(f"Review status updated for {nomenclature}: {status.value}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating review status: {e}")
            return False
    
    def _notify_user_review_completed(self, review_item: ReviewItem, supervisor_name: str):
        """
        Notify user that review is completed
        """
        if not self.discord:
            return
        
        try:
            if review_item.status == ReviewStatus.APPROVED:
                color = 0x00ff00
                status_text = "✅ Approuvé"
                description = f"Le plan **{review_item.nomenclature}** a été approuvé"
            elif review_item.status == ReviewStatus.REJECTED:
                color = 0xff0000
                status_text = "❌ Rejeté"
                description = f"Le plan **{review_item.nomenclature}** nécessite des corrections"
            else:
                color = 0x999999
                status_text = "ℹ️ Statut mis à jour"
                description = f"Le plan **{review_item.nomenclature}** a été reviewé"
            
            fields = [
                {"name": "Statut", "value": status_text, "inline": True},
                {"name": "Reviewé par", "value": supervisor_name, "inline": True},
                {"name": "Version", "value": str(review_item.version), "inline": True}
            ]
            
            if review_item.comments_count > 0:
                fields.append({
                    "name": "Commentaires", 
                    "value": f"{review_item.comments_count} commentaire(s) disponible(s)", 
                    "inline": False
                })
            
            if review_item.frameio_review_link:
                fields.append({
                    "name": "Lien Frame.io",
                    "value": f"[🔗 Voir les commentaires]({review_item.frameio_review_link})",
                    "inline": False
                })
            
            embed = {
                "title": "📝 Review terminée",
                "description": description,
                "color": color,
                "fields": fields
            }
            
            self.discord.send_message(
                f"🎬 **Review terminée** - {review_item.nomenclature}",
                embed
            )
            
        except Exception as e:
            logger.error(f"Error notifying user: {e}")
    
    def _extract_version(self, filename: str) -> int:
        """Extract version number from filename"""
        import re
        match = re.search(r'_v(\d+)', filename)
        return int(match.group(1)) if match else 1
    
    def _verify_nomenclature(self, nomenclature: str) -> bool:
        """Verify that nomenclature follows UNDLM_XXXXX pattern"""
        import re
        pattern = r'^UNDLM_\d{5}$'
        return bool(re.match(pattern, nomenclature))
    
    def _get_scene_name(self, nomenclature: str) -> str:
        """Get scene name for a nomenclature (placeholder)"""
        # This should be implemented based on your scene mapping
        return "Scene_Name_TBD"
    
    def _load_review_state(self):
        """Load existing review state from file"""
        try:
            state_file = Path("data/review_state.json")
            if state_file.exists():
                with open(state_file, 'r') as f:
                    data = json.load(f)
                    # Reconstruct ReviewItem objects
                    for key, item_data in data.items():
                        self.review_items[key] = ReviewItem(
                            nomenclature=item_data['nomenclature'],
                            scene_name=item_data['scene_name'],
                            file_path=item_data['file_path'],
                            version=item_data['version'],
                            status=ReviewStatus(item_data['status']),
                            frameio_asset_id=item_data.get('frameio_asset_id'),
                            frameio_review_link=item_data.get('frameio_review_link'),
                            created_at=datetime.fromisoformat(item_data['created_at']),
                            updated_at=datetime.fromisoformat(item_data['updated_at']),
                            comments_count=item_data.get('comments_count', 0)
                        )
        except Exception as e:
            logger.error(f"Error loading review state: {e}")
    
    def save_review_state(self):
        """Save current review state to file"""
        try:
            state_file = Path("data/review_state.json")
            state_file.parent.mkdir(exist_ok=True)
            
            data = {}
            for key, item in self.review_items.items():
                data[key] = {
                    'nomenclature': item.nomenclature,
                    'scene_name': item.scene_name,
                    'file_path': item.file_path,
                    'version': item.version,
                    'status': item.status.value,
                    'frameio_asset_id': item.frameio_asset_id,
                    'frameio_review_link': item.frameio_review_link,
                    'created_at': item.created_at.isoformat(),
                    'updated_at': item.updated_at.isoformat(),
                    'comments_count': item.comments_count
                }
            
            with open(state_file, 'w') as f:
                json.dump(data, f, indent=2)
                
        except Exception as e:
            logger.error(f"Error saving review state: {e}")
    
    def get_review_stats(self) -> Dict[str, int]:
        """Get review statistics"""
        stats = {
            'total_items': len(self.review_items),
            'exported': 0,
            'in_review': 0,
            'approved': 0,
            'rejected': 0,
            'pending_action': 0
        }
        
        for item in self.review_items.values():
            if item.status == ReviewStatus.EXPORTED:
                stats['exported'] += 1
            elif item.status == ReviewStatus.IN_REVIEW:
                stats['in_review'] += 1
            elif item.status == ReviewStatus.APPROVED:
                stats['approved'] += 1
            elif item.status == ReviewStatus.REJECTED:
                stats['rejected'] += 1
            
            if item.status in [ReviewStatus.EXPORTED, ReviewStatus.REJECTED]:
                stats['pending_action'] += 1
        
        return stats
