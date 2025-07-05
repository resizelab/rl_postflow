"""
Frame.io Integration for UNDLM PostFlow
Handles video upload, review, and approval workflow
"""

import json
import requests
from typing import Dict, List, Optional, Any
from datetime import datetime
from pathlib import Path
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)


@dataclass
class FrameIOConfig:
    """Configuration for Frame.io integration."""
    api_token: str
    project_id: str
    root_folder_id: str = ""
    upload_enabled: bool = True
    auto_notify: bool = True
    review_settings: Dict[str, Any] = None


class FrameIOClient:
    """Handles Frame.io API interactions."""
    
    def __init__(self, config: FrameIOConfig):
        """
        Initialize Frame.io client.
        
        Args:
            config: Frame.io configuration
        """
        self.config = config
        self.base_url = "https://api.frame.io/v2"
        self.headers = {
            "Authorization": f"Bearer {config.api_token}",
            "Content-Type": "application/json"
        }
        self.project_info = None
        
    def test_connection(self) -> bool:
        """Test the Frame.io API connection."""
        try:
            response = requests.get(
                f"{self.base_url}/me",
                headers=self.headers
            )
            response.raise_for_status()
            logger.info("Frame.io connection successful")
            return True
        except requests.exceptions.RequestException as e:
            logger.error(f"Frame.io connection failed: {e}")
            return False
    
    def get_project_info(self) -> Optional[Dict[str, Any]]:
        """Get project information from Frame.io."""
        if self.project_info:
            return self.project_info
            
        try:
            response = requests.get(
                f"{self.base_url}/projects/{self.config.project_id}",
                headers=self.headers
            )
            response.raise_for_status()
            self.project_info = response.json()
            return self.project_info
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get project info: {e}")
            return None
    
    def create_folder(self, name: str, parent_id: str = None) -> Optional[str]:
        """
        Create a folder in Frame.io.
        
        Args:
            name: Folder name
            parent_id: Parent folder ID (uses root if None)
            
        Returns:
            Folder ID if successful
        """
        if not parent_id:
            parent_id = self.config.root_folder_id or self.config.project_id
            
        try:
            payload = {
                "name": name,
                "type": "folder",
                "parent_id": parent_id
            }
            
            response = requests.post(
                f"{self.base_url}/assets",
                headers=self.headers,
                json=payload
            )
            response.raise_for_status()
            
            folder_data = response.json()
            folder_id = folder_data.get("id")
            logger.info(f"Created Frame.io folder: {name} (ID: {folder_id})")
            return folder_id
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to create folder {name}: {e}")
            return None
    
    def upload_video(self, file_path: str, folder_id: str = None, 
                    metadata: Dict[str, Any] = None) -> Optional[str]:
        """
        Upload a video to Frame.io.
        
        Args:
            file_path: Path to video file
            folder_id: Target folder ID
            metadata: Additional metadata
            
        Returns:
            Asset ID if successful
        """
        if not self.config.upload_enabled:
            logger.info("Upload disabled in config")
            return None
            
        file_path = Path(file_path)
        if not file_path.exists():
            logger.error(f"File not found: {file_path}")
            return None
            
        if not folder_id:
            folder_id = self.config.root_folder_id or self.config.project_id
            
        try:
            # Step 1: Create the asset
            file_size = file_path.stat().st_size
            payload = {
                "name": file_path.name,
                "type": "file",
                "parent_id": folder_id,
                "filetype": file_path.suffix.lower(),
                "filesize": file_size
            }
            
            if metadata:
                payload.update(metadata)
            
            response = requests.post(
                f"{self.base_url}/assets",
                headers=self.headers,
                json=payload
            )
            response.raise_for_status()
            
            asset_data = response.json()
            asset_id = asset_data.get("id")
            upload_url = asset_data.get("upload_url")
            
            # Step 2: Upload the file
            if upload_url:
                with open(file_path, 'rb') as f:
                    upload_response = requests.put(upload_url, data=f)
                    upload_response.raise_for_status()
                
                logger.info(f"Uploaded video to Frame.io: {file_path.name} (ID: {asset_id})")
                return asset_id
            else:
                logger.error("No upload URL received from Frame.io")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to upload video {file_path.name}: {e}")
            return None
    
    def add_comment(self, asset_id: str, comment: str, timecode: str = None) -> bool:
        """
        Add a comment to an asset.
        
        Args:
            asset_id: Asset ID
            comment: Comment text
            timecode: Optional timecode
            
        Returns:
            True if successful
        """
        try:
            payload = {
                "text": comment,
                "asset_id": asset_id
            }
            
            if timecode:
                payload["timecode"] = timecode
            
            response = requests.post(
                f"{self.base_url}/comments",
                headers=self.headers,
                json=payload
            )
            response.raise_for_status()
            
            logger.info(f"Added comment to asset {asset_id}")
            return True
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to add comment: {e}")
            return False
    
    def get_asset_status(self, asset_id: str) -> Optional[Dict[str, Any]]:
        """
        Get the status of an asset.
        
        Args:
            asset_id: Asset ID
            
        Returns:
            Asset status information
        """
        try:
            response = requests.get(
                f"{self.base_url}/assets/{asset_id}",
                headers=self.headers
            )
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get asset status: {e}")
            return None
    
    def create_shot_folder_structure(self, shot_nomenclature: str, 
                                   scene_name: str = None) -> Optional[str]:
        """
        Create folder structure for a shot.
        
        Args:
            shot_nomenclature: Shot nomenclature (e.g., UNDLM_00001)
            scene_name: Optional scene name
            
        Returns:
            Shot folder ID if successful
        """
        try:
            # Create scene folder if needed
            scene_folder_id = self.config.root_folder_id or self.config.project_id
            
            if scene_name:
                scene_folder_id = self.create_folder(scene_name)
                if not scene_folder_id:
                    return None
            
            # Create shot folder
            shot_folder_id = self.create_folder(shot_nomenclature, scene_folder_id)
            
            if shot_folder_id:
                # Create subfolders for different versions
                self.create_folder("WIP", shot_folder_id)
                self.create_folder("FINAL", shot_folder_id)
                self.create_folder("REFERENCE", shot_folder_id)
            
            return shot_folder_id
            
        except Exception as e:
            logger.error(f"Failed to create shot folder structure: {e}")
            return None
    
    def setup_project_structure(self, shots_data: List[Dict[str, Any]]) -> Dict[str, str]:
        """
        Set up the complete project structure in Frame.io.
        
        Args:
            shots_data: List of shot data
            
        Returns:
            Dictionary mapping shot nomenclatures to folder IDs
        """
        folder_map = {}
        
        try:
            # Group shots by scene
            scenes = {}
            for shot in shots_data:
                scene_name = shot.get('scene_name', 'Unknown Scene')
                if scene_name not in scenes:
                    scenes[scene_name] = []
                scenes[scene_name].append(shot)
            
            # Create structure for each scene
            for scene_name, scene_shots in scenes.items():
                logger.info(f"Setting up Frame.io structure for scene: {scene_name}")
                
                for shot in scene_shots:
                    nomenclature = shot.get('nomenclature', '')
                    if nomenclature:
                        folder_id = self.create_shot_folder_structure(
                            nomenclature, scene_name
                        )
                        if folder_id:
                            folder_map[nomenclature] = folder_id
            
            logger.info(f"Created Frame.io structure for {len(folder_map)} shots")
            return folder_map
            
        except Exception as e:
            logger.error(f"Failed to setup project structure: {e}")
            return {}


class FrameIOWorkflow:
    """Handles Frame.io workflow integration with the pipeline."""
    
    def __init__(self, client: FrameIOClient):
        """
        Initialize Frame.io workflow.
        
        Args:
            client: Frame.io client instance
        """
        self.client = client
        self.shot_folder_map = {}
    
    def upload_shot_version(self, shot_nomenclature: str, file_path: str, 
                           version: int, status: str = "review") -> Optional[str]:
        """
        Upload a shot version for review.
        
        Args:
            shot_nomenclature: Shot nomenclature
            file_path: Path to video file
            version: Version number
            status: Upload status
            
        Returns:
            Asset ID if successful
        """
        # Get or create shot folder
        folder_id = self.shot_folder_map.get(shot_nomenclature)
        if not folder_id:
            folder_id = self.client.create_shot_folder_structure(shot_nomenclature)
            if folder_id:
                self.shot_folder_map[shot_nomenclature] = folder_id
        
        if not folder_id:
            logger.error(f"Could not get folder for shot {shot_nomenclature}")
            return None
        
        # Prepare metadata
        metadata = {
            "description": f"Version {version} - {status}",
            "custom_metadata": {
                "shot": shot_nomenclature,
                "version": version,
                "status": status,
                "upload_date": datetime.now().isoformat()
            }
        }
        
        # Upload to appropriate subfolder
        subfolder = "WIP" if status == "wip" else "FINAL"
        subfolder_id = self.client.create_folder(subfolder, folder_id)
        
        target_folder = subfolder_id if subfolder_id else folder_id
        
        return self.client.upload_video(file_path, target_folder, metadata)
    
    def notify_shot_ready_for_review(self, shot_nomenclature: str, 
                                   asset_id: str, notes: str = "") -> bool:
        """
        Notify that a shot is ready for review.
        
        Args:
            shot_nomenclature: Shot nomenclature
            asset_id: Frame.io asset ID
            notes: Optional notes
            
        Returns:
            True if notification sent
        """
        comment = f"🎬 Shot {shot_nomenclature} is ready for review!"
        if notes:
            comment += f"\n\nNotes: {notes}"
        
        return self.client.add_comment(asset_id, comment)
    
    def get_shot_review_status(self, shot_nomenclature: str) -> Dict[str, Any]:
        """
        Get review status for a shot.
        
        Args:
            shot_nomenclature: Shot nomenclature
            
        Returns:
            Review status information
        """
        # This would typically query Frame.io for review status
        # For now, return a placeholder
        return {
            "shot": shot_nomenclature,
            "review_status": "pending",
            "comments_count": 0,
            "approval_status": "pending"
        }
