"""
Google Sheets Authentication Module
Handles OAuth and service account authentication for Google Sheets
"""

import json
import logging
from typing import Dict, Optional
from pathlib import Path
from dataclasses import dataclass
import gspread
from google.oauth2.service_account import Credentials

logger = logging.getLogger(__name__)


@dataclass
class GoogleSheetsConfig:
    """Configuration for Google Sheets integration."""
    credentials_file: str
    spreadsheet_id: str
    worksheet_name: str = "Shot Tracking"  # Deprecated, use worksheet_shots_tracks
    worksheet_shots_tracks: str = "SHOTS_TRACK"
    worksheet_users: str = "USERS_INFOS"
    sync_enabled: bool = True
    auto_update: bool = True
    backup_enabled: bool = True


class GoogleSheetsAuth:
    """Handles Google Sheets authentication and connection management."""
    
    def __init__(self, config: GoogleSheetsConfig):
        """
        Initialize Google Sheets authentication.
        
        Args:
            config: Google Sheets configuration
        """
        self.config = config
        self.client = None
        self.spreadsheet = None
        
        # Support both dict and object configuration
        self.spreadsheet_id = getattr(config, 'spreadsheet_id', config.get('spreadsheet_id') if isinstance(config, dict) else None)
        self.service_account_file = getattr(config, 'service_account_file', config.get('service_account_file') if isinstance(config, dict) else None)
        
        if not self.service_account_file:
            self.service_account_file = getattr(config, 'credentials_file', config.get('credentials_file') if isinstance(config, dict) else None)
    
    def connect(self) -> bool:
        """
        Establish connection to Google Sheets.
        
        Returns:
            bool: True if connection successful
        """
        try:
            credentials_path = Path(self.service_account_file)
            if not credentials_path.exists():
                logger.error(f"Credentials file not found: {credentials_path}")
                return False
            
            # Define the scope
            scope = [
                "https://spreadsheets.google.com/feeds",
                "https://www.googleapis.com/auth/drive"
            ]
            
            # Load credentials
            creds = Credentials.from_service_account_file(
                credentials_path, scopes=scope
            )
            
            # Create client
            self.client = gspread.authorize(creds)
            
            # Open spreadsheet
            self.spreadsheet = self.client.open_by_key(self.spreadsheet_id)
            
            logger.info("Google Sheets connection successful")
            return True
            
        except Exception as e:
            logger.error(f"Google Sheets connection failed: {e}")
            import traceback
            logger.debug(f"Full traceback: {traceback.format_exc()}")
            return False
    
    def get_worksheet(self, worksheet_name: str) -> Optional[gspread.Worksheet]:
        """
        Get a worksheet by name.
        
        Args:
            worksheet_name: Name of the worksheet
            
        Returns:
            gspread.Worksheet: The worksheet or None if not found
        """
        if not self.spreadsheet:
            logger.error("No spreadsheet connection")
            return None
        
        try:
            return self.spreadsheet.worksheet(worksheet_name)
        except gspread.WorksheetNotFound:
            logger.warning(f"Worksheet '{worksheet_name}' not found")
            return None
        except Exception as e:
            logger.error(f"Error getting worksheet '{worksheet_name}': {e}")
            return None
    
    def create_worksheet(self, worksheet_name: str, rows: int = 1000, cols: int = 20) -> Optional[gspread.Worksheet]:
        """
        Create a new worksheet.
        
        Args:
            worksheet_name: Name of the new worksheet
            rows: Number of rows
            cols: Number of columns
            
        Returns:
            gspread.Worksheet: The created worksheet or None if failed
        """
        if not self.spreadsheet:
            logger.error("No spreadsheet connection")
            return None
        
        try:
            worksheet = self.spreadsheet.add_worksheet(
                title=worksheet_name,
                rows=rows,
                cols=cols
            )
            
            logger.info(f"Created worksheet: {worksheet_name}")
            return worksheet
            
        except Exception as e:
            logger.error(f"Failed to create worksheet '{worksheet_name}': {e}")
            return None
    
    def is_connected(self) -> bool:
        """
        Check if connection is established.
        
        Returns:
            bool: True if connected
        """
        return self.client is not None and self.spreadsheet is not None
