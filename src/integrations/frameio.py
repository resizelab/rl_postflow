"""
Frame.io Integration for PostFlow Pipeline
Unified client supporting modern Frame.io API with Adobe integration
"""

import json
import requests
import time
import os
from typing import Dict, List, Optional, Any, Union
from datetime import datetime
from pathlib import Path
from dataclasses import dataclass, field
import logging
import base64
import hashlib
import mimetypes

logger = logging.getLogger(__name__)


@dataclass
class FrameIOConfig:
    """Configuration for Frame.io integration."""
    api_token: str = ""
    base_url: str = "https://api.frame.io/v2"
    project_id: str = ""
    team_id: str = ""
    timeout: int = 30
    max_retries: int = 3
    upload_enabled: bool = True
    auto_notify: bool = True
    webhook_url: str = ""
    
    # OAuth settings (for future compatibility)
    client_id: str = ""
    client_secret: str = ""
    access_token: str = ""
    refresh_token: str = ""
    
    # Upload settings
    chunk_size: int = 8388608  # 8MB chunks
    parallel_uploads: int = 2
    
    # Review settings
    review_settings: Dict[str, Any] = field(default_factory=dict)
    
    def __post_init__(self):
        """Handle additional config fields that might be passed."""
        # Remove any unknown fields to avoid initialization errors
        pass


class FrameIOClient:
    """
    Unified Frame.io client with modern API support.
    Handles authentication, uploads, project management, and notifications.
    """
    
    def __init__(self, config: Union[FrameIOConfig, Dict[str, Any]]):
        """
        Initialize Frame.io client.
        
        Args:
            config: Frame.io configuration
        """
        if isinstance(config, dict):
            # Filter out unknown fields to avoid dataclass initialization errors
            valid_fields = {f.name for f in FrameIOConfig.__dataclass_fields__.values()}
            filtered_config = {k: v for k, v in config.items() if k in valid_fields}
            self.config = FrameIOConfig(**filtered_config)
        else:
            self.config = config
            
        self.session = requests.Session()
        self.session.timeout = self.config.timeout
        
        # Set up authentication
        if self.config.api_token:
            self.session.headers.update({
                'Authorization': f'Bearer {self.config.api_token}',
                'Content-Type': 'application/json'
            })
        elif self.config.access_token:
            self.session.headers.update({
                'Authorization': f'Bearer {self.config.access_token}',
                'Content-Type': 'application/json'
            })
        
        logger.info("Frame.io client initialized")
    
    def test_connection(self) -> bool:
        """Test connection to Frame.io API."""
        try:
            response = self.session.get(f"{self.config.base_url}/me")
            return response.status_code == 200
        except Exception as e:
            logger.error(f"Connection test failed: {e}")
            return False
    
    def get_user_info(self) -> Optional[Dict[str, Any]]:
        """Get current user information."""
        try:
            response = self.session.get(f"{self.config.base_url}/me")
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            logger.error(f"Error getting user info: {e}")
            return None
    
    def get_teams(self) -> List[Dict[str, Any]]:
        """Get user's teams."""
        try:
            response = self.session.get(f"{self.config.base_url}/teams")
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            logger.error(f"Error getting teams: {e}")
            return []
    
    def get_projects(self, team_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get projects for a team."""
        try:
            team_id = team_id or self.config.team_id
            if not team_id:
                # Try to get from first team
                teams = self.get_teams()
                if teams:
                    team_id = teams[0]['id']
                else:
                    return []
            
            response = self.session.get(f"{self.config.base_url}/teams/{team_id}/projects")
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            logger.error(f"Error getting projects: {e}")
            return []
    
    def get_project_info(self, project_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Get project information."""
        try:
            project_id = project_id or self.config.project_id
            if not project_id:
                return None
            
            response = self.session.get(f"{self.config.base_url}/projects/{project_id}")
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            logger.error(f"Error getting project info: {e}")
            return None
    
    def get_project_assets(self, project_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get assets from a project."""
        try:
            project_id = project_id or self.config.project_id
            if not project_id:
                return []
            
            response = self.session.get(f"{self.config.base_url}/projects/{project_id}/assets")
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            logger.error(f"Error getting project assets: {e}")
            return []
    
    def create_folder(self, name: str, parent_id: str, project_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Create a folder in Frame.io."""
        try:
            project_id = project_id or self.config.project_id
            if not project_id:
                return None
            
            data = {
                "name": name,
                "type": "folder",
                "parent_asset_id": parent_id
            }
            
            response = self.session.post(
                f"{self.config.base_url}/projects/{project_id}/assets",
                json=data
            )
            
            if response.status_code == 201:
                return response.json()
            return None
        except Exception as e:
            logger.error(f"Error creating folder: {e}")
            return None
    
    def upload_file(self, file_path: str, parent_id: Optional[str] = None, 
                   project_id: Optional[str] = None, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Upload a file to Frame.io.
        
        Args:
            file_path: Path to the file to upload
            parent_id: Parent folder ID (optional)
            project_id: Project ID (optional)
            metadata: Additional metadata (optional)
            
        Returns:
            Upload result with file information
        """
        try:
            if not self.config.upload_enabled:
                return {
                    "success": False,
                    "error": "Upload disabled in configuration"
                }
            
            file_path = Path(file_path)
            if not file_path.exists():
                return {
                    "success": False,
                    "error": f"File not found: {file_path}"
                }
            
            project_id = project_id or self.config.project_id
            if not project_id:
                return {
                    "success": False,
                    "error": "No project ID specified"
                }
            
            # Get file information
            file_size = file_path.stat().st_size
            file_name = file_path.name
            mime_type = mimetypes.guess_type(str(file_path))[0] or 'application/octet-stream'
            
            # Create asset
            asset_data = {
                "name": file_name,
                "type": "file",
                "filetype": mime_type,
                "filesize": file_size,
                "parent_asset_id": parent_id
            }
            
            # Add metadata if provided
            if metadata:
                asset_data.update(metadata)
            
            # Create the asset
            create_response = self.session.post(
                f"{self.config.base_url}/projects/{project_id}/assets",
                json=asset_data
            )
            
            if create_response.status_code != 201:
                return {
                    "success": False,
                    "error": f"Failed to create asset: {create_response.text}"
                }
            
            asset = create_response.json()
            
            # Upload file content
            upload_urls = asset.get('upload_urls', [])
            if not upload_urls:
                return {
                    "success": False,
                    "error": "No upload URLs provided"
                }
            
            # Upload file chunks
            with open(file_path, 'rb') as f:
                for i, upload_url in enumerate(upload_urls):
                    chunk_size = self.config.chunk_size
                    chunk_data = f.read(chunk_size)
                    
                    if not chunk_data:
                        break
                    
                    upload_response = requests.put(
                        upload_url,
                        data=chunk_data,
                        headers={'Content-Type': mime_type}
                    )
                    
                    if upload_response.status_code not in [200, 201]:
                        return {
                            "success": False,
                            "error": f"Upload failed for chunk {i}: {upload_response.text}"
                        }
            
            # Mark upload as complete
            complete_response = self.session.put(
                f"{self.config.base_url}/assets/{asset['id']}/upload-complete"
            )
            
            if complete_response.status_code != 200:
                logger.warning(f"Upload complete notification failed: {complete_response.text}")
            
            logger.info(f"Successfully uploaded {file_name} to Frame.io")
            
            return {
                "success": True,
                "asset_id": asset['id'],
                "asset_name": asset['name'],
                "file_size": file_size,
                "upload_time": datetime.now().isoformat(),
                "project_id": project_id
            }
            
        except Exception as e:
            logger.error(f"Error uploading file: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def create_review_link(self, asset_id: str, settings: Optional[Dict[str, Any]] = None) -> Optional[str]:
        """Create a review link for an asset."""
        try:
            review_data = {
                "asset_id": asset_id,
                "enable_downloading": True,
                "enable_comments": True,
                "password": None
            }
            
            if settings:
                review_data.update(settings)
            
            response = self.session.post(
                f"{self.config.base_url}/review-links",
                json=review_data
            )
            
            if response.status_code == 201:
                review_link = response.json()
                return review_link.get('link')
            
            return None
        except Exception as e:
            logger.error(f"Error creating review link: {e}")
            return None
    
    def add_comment(self, asset_id: str, comment: str, timestamp: Optional[float] = None) -> Optional[Dict[str, Any]]:
        """Add a comment to an asset."""
        try:
            comment_data = {
                "text": comment,
                "asset_id": asset_id
            }
            
            if timestamp:
                comment_data["timestamp"] = timestamp
            
            response = self.session.post(
                f"{self.config.base_url}/comments",
                json=comment_data
            )
            
            if response.status_code == 201:
                return response.json()
            return None
        except Exception as e:
            logger.error(f"Error adding comment: {e}")
            return None
    
    def get_asset_comments(self, asset_id: str) -> List[Dict[str, Any]]:
        """Get comments for an asset."""
        try:
            response = self.session.get(f"{self.config.base_url}/assets/{asset_id}/comments")
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            logger.error(f"Error getting comments: {e}")
            return []
    
    def delete_asset(self, asset_id: str) -> bool:
        """Delete an asset."""
        try:
            response = self.session.delete(f"{self.config.base_url}/assets/{asset_id}")
            return response.status_code == 204
        except Exception as e:
            logger.error(f"Error deleting asset: {e}")
            return False
    
    def get_status(self) -> Dict[str, Any]:
        """Get client status."""
        try:
            connected = self.test_connection()
            user_info = self.get_user_info() if connected else None
            
            return {
                "connected": connected,
                "api_version": "v2",
                "base_url": self.config.base_url,
                "project_id": self.config.project_id,
                "team_id": self.config.team_id,
                "upload_enabled": self.config.upload_enabled,
                "user": user_info.get('name') if user_info else None,
                "last_check": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error getting status: {e}")
            return {
                "connected": False,
                "error": str(e),
                "last_check": datetime.now().isoformat()
            }


# Alias for backward compatibility
FrameIOIntegration = FrameIOClient


def create_client_from_config(config_path: str = "config/frameio_config.json") -> Optional[FrameIOClient]:
    """Create a Frame.io client from configuration file."""
    try:
        config_file = Path(config_path)
        if not config_file.exists():
            logger.error(f"Config file not found: {config_path}")
            return None
        
        with open(config_file, 'r') as f:
            config_data = json.load(f)
        
        # Handle nested config structure
        if 'frameio' in config_data:
            config_data = config_data['frameio']
        
        return FrameIOClient(config_data)
        
    except Exception as e:
        logger.error(f"Error creating client from config: {e}")
        return None


def validate_config(config: Dict[str, Any]) -> List[str]:
    """Validate Frame.io configuration."""
    errors = []
    
    if not config.get('api_token') and not config.get('access_token'):
        errors.append("API token or access token required")
    
    if config.get('api_token') and config['api_token'].startswith('fio-u-YOUR'):
        errors.append("API token not configured (still contains placeholder)")
    
    if config.get('upload_enabled', True) and not config.get('project_id'):
        errors.append("Project ID required for uploads")
    
    return errors


# Example usage and testing
if __name__ == "__main__":
    # Example configuration
    config = {
        "api_token": "your_api_token_here",
        "project_id": "your_project_id",
        "team_id": "your_team_id",
        "upload_enabled": True
    }
    
    client = FrameIOClient(config)
    
    # Test connection
    if client.test_connection():
        print("✅ Connected to Frame.io")
        
        # Get user info
        user_info = client.get_user_info()
        if user_info:
            print(f"👤 User: {user_info.get('name')}")
        
        # Get projects
        projects = client.get_projects()
        print(f"📁 Projects: {len(projects)}")
        
    else:
        print("❌ Failed to connect to Frame.io")
