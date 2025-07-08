"""
Google Sheets Users Module with Dynamic Column Mapping
Handles user management and assignment functionality with automatic column mapping
"""

import logging
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import gspread
from datetime import datetime

from .auth import GoogleSheetsAuth
from .mapper import get_sheets_mapper, map_row_to_dict, get_column_index

logger = logging.getLogger(__name__)


@dataclass
class User:
    """Represents a user in the system with dynamic field mapping."""
    first_name: str
    last_name: Optional[str] = None
    email: Optional[str] = None
    discord_id: Optional[str] = None
    role: Optional[str] = None
    phone: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    active: bool = True
    
    @property
    def full_name(self) -> str:
        """Get the full name of the user."""
        if self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.first_name
    
    @property
    def name(self) -> str:
        """Alias for full_name for backward compatibility."""
        return self.full_name


class SheetsUserManager:
    """Manages user data from Google Sheets with dynamic column mapping."""
    
    def __init__(self, auth_client: GoogleSheetsAuth):
        """
        Initialize the user manager with dynamic mapping support.
        
        Args:
            auth_client: Authenticated Google Sheets client
        """
        self.auth_client = auth_client
        self.users_worksheet = None
        self.users_cache = {}
        self.cache_timestamp = None
        self.mapper = get_sheets_mapper()
        
        # Nom de la worksheet depuis la config
        self.worksheet_name = getattr(self.auth_client.config, 'worksheet_users', 'USERS_INFOS')
    
    def _get_users_worksheet(self) -> Optional[gspread.Worksheet]:
        """Get or create the Users worksheet."""
        if not self.users_worksheet:
            self.users_worksheet = self.auth_client.get_worksheet(self.worksheet_name)
            
            if not self.users_worksheet:
                logger.error(f"Worksheet '{self.worksheet_name}' not found")
                return None
                
        return self.users_worksheet
    
    def _refresh_users_cache(self) -> bool:
        """Refresh the users cache from Google Sheets."""
        worksheet = self._get_users_worksheet()
        if not worksheet:
            return False
        
        try:
            # Get all records
            records = worksheet.get_all_records()
            
            # Clear cache
            self.users_cache = {}
            
            # Process each record
            for record in records:
                name = record.get('Name', '').strip()
                if not name:
                    continue
                
                user = User(
                    name=name,
                    discord_id=record.get('Discord ID', '').strip() or None,
                    email=record.get('Email', '').strip() or None,
                    role=record.get('Role', '').strip() or None,
                    department=record.get('Department', '').strip() or None,
                    active=record.get('Active', '').strip().lower() in ['true', '1', 'yes', 'active']
                )
                
                # Cache by name (primary key)
                self.users_cache[name.lower()] = user
                
                # Also cache by Discord ID if available
                if user.discord_id:
                    self.users_cache[f"discord_{user.discord_id}"] = user
            
            self.cache_timestamp = datetime.now()
            logger.info(f"Refreshed users cache with {len(records)} users")
            return True
            
        except Exception as e:
            logger.error(f"Failed to refresh users cache: {e}")
            return False
    
    def get_user_by_name(self, name: str) -> Optional[User]:
        """
        Get a user by their name.
        
        Args:
            name: User's name
            
        Returns:
            User: User object or None if not found
        """
        if not self.users_cache:
            self._refresh_users_cache()
        
        return self.users_cache.get(name.lower())
    
    def get_user_by_discord_id(self, discord_id: str) -> Optional[User]:
        """
        Get a user by their Discord ID.
        
        Args:
            discord_id: Discord user ID
            
        Returns:
            User: User object or None if not found
        """
        if not self.users_cache:
            self._refresh_users_cache()
        
        return self.users_cache.get(f"discord_{discord_id}")
    
    def get_all_users(self) -> List[User]:
        """
        Get all users.
        
        Returns:
            List[User]: List of all users
        """
        if not self.users_cache:
            self._refresh_users_cache()
        
        # Return only users cached by name (avoid duplicates)
        return [user for key, user in self.users_cache.items() if not key.startswith('discord_')]


# Global instance for easy access
_sheets_auth = None
_user_manager = None


def init_sheets_user_manager(auth_client: GoogleSheetsAuth) -> SheetsUserManager:
    """
    Initialize the global sheets user manager.
    
    Args:
        auth_client: Authenticated Google Sheets client
        
    Returns:
        SheetsUserManager: Initialized user manager
    """
    global _user_manager
    _user_manager = SheetsUserManager(auth_client)
    return _user_manager


def get_assigned_user(shot_id: str) -> Optional[Dict[str, Any]]:
    """
    Get the assigned user for a shot from Google Sheets.
    
    Args:
        shot_id: Shot identifier (nomenclature)
        
    Returns:
        Dict: User information with name, discord_id, email, etc. or None if not found
    """
    global _user_manager
    
    if not _user_manager:
        logger.warning("User manager not initialized")
        return None
    
    # For now, we'll implement a simple logic:
    # - Look for a user assigned to this specific shot
    # - If not found, return a default supervisor
    
    # TODO: Implement shot-specific assignment logic
    # This would require extending the Users worksheet with shot assignments
    
    # For now, return the first active user as a supervisor
    users = _user_manager.get_all_users()
    active_users = [user for user in users if user.active]
    
    if active_users:
        user = active_users[0]  # First active user as supervisor
        return {
            'name': user.name,
            'discord_id': user.discord_id,
            'email': user.email,
            'role': user.role,
            'department': user.department
        }
    
    return None


def get_user_by_discord_id(discord_id: str) -> Optional[Dict[str, Any]]:
    """
    Get a user by their Discord ID from Google Sheets.
    
    Args:
        discord_id: Discord user ID
        
    Returns:
        Dict: User information or None if not found
    """
    global _user_manager
    
    if not _user_manager:
        logger.warning("User manager not initialized")
        return None
    
    user = _user_manager.get_user_by_discord_id(discord_id)
    
    if user:
        return {
            'name': user.name,
            'discord_id': user.discord_id,
            'email': user.email,
            'role': user.role,
            'department': user.department
        }
    
    return None
