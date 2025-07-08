"""
Google Sheets Status Tracking Module
Handles shot status tracking and pipeline stage management with dynamic mapping
"""

import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
import gspread

from .auth import GoogleSheetsAuth
from .mapper import get_sheets_mapper, map_row_to_dict, get_column_index
from ...utils.status_tracker import ShotProgress, ShotStatus, PipelineStage

logger = logging.getLogger(__name__)


class SheetsStatusTracker:
    """Manages shot status tracking in Google Sheets with dynamic mapping."""
    
    def __init__(self, auth_client: GoogleSheetsAuth, worksheet_name: Optional[str] = None):
        """
        Initialize the status tracker.
        
        Args:
            auth_client: Authenticated Google Sheets client
            worksheet_name: Name of the worksheet for shot tracking (uses config if None)
        """
        self.auth_client = auth_client
        # Utiliser le nom configuré dans integrations.json ou par défaut
        if worksheet_name:
            self.worksheet_name = worksheet_name
        else:
            self.worksheet_name = getattr(auth_client.config, 'worksheet_shots_tracks', 'SHOTS_TRACK')
        self.worksheet = None
        
        # Initialize dynamic mapping
        self.mapper = get_sheets_mapper()
        
        # Legacy column mapping for backward compatibility
        self.columns = {
            'nomenclature': 'A',
            'scene_name': 'B',
            'description': 'C',
            'source_file': 'D',
            'timecode_in': 'E',
            'timecode_out': 'F',
            'duration': 'G',
            'status': 'H',
            'stage': 'I',
            'progress': 'J',
            'assigned_to': 'K',
            'priority': 'L',
            'notes': 'M',
            'ae_project': 'N',
            'last_updated': 'O',
            'frameio_link': 'P',
            'review_status': 'Q',
            'approval_date': 'R'
        }
    
    def _get_shot_tracking_worksheet(self) -> Optional[gspread.Worksheet]:
        """Get or create the shot tracking worksheet."""
        if not self.worksheet:
            self.worksheet = self.auth_client.get_worksheet(self.worksheet_name)
            
            if not self.worksheet:
                # Create the shot tracking worksheet if it doesn't exist
                self.worksheet = self.auth_client.create_worksheet(self.worksheet_name, rows=1000, cols=20)
                
                if self.worksheet:
                    # Set headers
                    headers = [
                        "Shot ID", "Scene", "Description", "Source File", 
                        "Timecode In", "Timecode Out", "Duration", "Status",
                        "Stage", "Progress %", "Assigned To", "Priority",
                        "Notes", "AE Project", "Last Updated", "Frame.io Link",
                        "Review Status", "Approval Date"
                    ]
                    self.worksheet.update('A1:R1', [headers])
                    
                    # Format headers
                    self.worksheet.format('A1:R1', {
                        "backgroundColor": {"red": 0.2, "green": 0.6, "blue": 0.9},
                        "textFormat": {"bold": True, "foregroundColor": {"red": 1, "green": 1, "blue": 1}}
                    })
                    
                    logger.info(f"Created shot tracking worksheet: {self.worksheet_name}")
        
        return self.worksheet
    
    def get_all_shots(self) -> List[Dict[str, Any]]:
        """
        Get all shots from the spreadsheet using dynamic mapping.
        
        Returns:
            List[Dict]: List of shot data
        """
        worksheet = self._get_shot_tracking_worksheet()
        if not worksheet:
            logger.error("No worksheet connection")
            return []
        
        try:
            # Get all data from the worksheet
            all_values = worksheet.get_all_values()
            
            if not all_values:
                logger.warning("No data found in worksheet")
                return []
            
            headers = all_values[0]
            data_rows = all_values[1:]
            
            # Convert to standardized format using dynamic mapping
            shots = []
            for row in data_rows:
                # Skip empty rows
                if not any(row):
                    continue
                
                # Map row to dictionary using dynamic mapping
                shot_data = map_row_to_dict('SHOTS_TRACK', row)
                
                # Only include rows with a shot name/ID
                if shot_data.get('shot_name') or shot_data.get('shot_full_name'):
                    shots.append(shot_data)
            
            logger.info(f"Retrieved {len(shots)} shots from Google Sheets")
            return shots
            
        except Exception as e:
            logger.error(f"Failed to get shots: {e}")
            return []
    
    def update_shot_status(self, shot_nomenclature: str, 
                          status: ShotStatus, stage: PipelineStage, 
                          progress: int = 0, notes: str = "") -> bool:
        """
        Update shot status in the spreadsheet.
        
        Args:
            shot_nomenclature: Shot nomenclature
            status: New status
            stage: Pipeline stage
            progress: Progress percentage
            notes: Optional notes
            
        Returns:
            bool: True if successful
        """
        worksheet = self._get_shot_tracking_worksheet()
        if not worksheet:
            return False
        
        try:
            # Find the row with this shot
            shot_row = self._find_shot_row(shot_nomenclature)
            
            if not shot_row:
                logger.warning(f"Shot {shot_nomenclature} not found in spreadsheet")
                return False
            
            # Update the row
            updates = [
                (f"H{shot_row}", status.value),  # Status
                (f"I{shot_row}", stage.value),   # Stage
                (f"J{shot_row}", progress),      # Progress %
                (f"O{shot_row}", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))  # Last Updated
            ]
            
            if notes:
                updates.append((f"M{shot_row}", notes))  # Notes
            
            # Batch update
            for cell, value in updates:
                worksheet.update(cell, value)
            
            logger.info(f"Updated shot {shot_nomenclature}: {status.value} - {stage.value}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update shot status: {e}")
            return False
    
    def update_frameio_link(self, shot_nomenclature: str, frameio_link: str) -> bool:
        """
        Update Frame.io link for a shot.
        
        Args:
            shot_nomenclature: Shot nomenclature
            frameio_link: Frame.io review link
            
        Returns:
            bool: True if successful
        """
        worksheet = self._get_shot_tracking_worksheet()
        if not worksheet:
            return False
        
        try:
            # Find the row with this shot
            shot_row = self._find_shot_row(shot_nomenclature)
            
            if not shot_row:
                logger.warning(f"Shot {shot_nomenclature} not found in spreadsheet")
                return False
            
            # Update Frame.io link
            worksheet.update(f"P{shot_row}", frameio_link)
            
            logger.info(f"Updated Frame.io link for shot {shot_nomenclature}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update Frame.io link: {e}")
            return False
    
    def _find_shot_row(self, shot_nomenclature: str) -> Optional[int]:
        """
        Find the row number for a given shot.
        
        Args:
            shot_nomenclature: Shot nomenclature to find
            
        Returns:
            int: Row number (1-based) or None if not found
        """
        worksheet = self._get_shot_tracking_worksheet()
        if not worksheet:
            return None
        
        try:
            # Get all values in column A (Shot ID)
            shot_ids = worksheet.col_values(1)
            
            # Find the row (1-based indexing)
            for i, shot_id in enumerate(shot_ids):
                if shot_id == shot_nomenclature:
                    return i + 1
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to find shot row: {e}")
            return None
    
    def get_shot_by_nomenclature(self, shot_nomenclature: str) -> Optional[Dict[str, Any]]:
        """
        Get a specific shot by nomenclature.
        
        Args:
            shot_nomenclature: Shot nomenclature
            
        Returns:
            Dict: Shot data or None if not found
        """
        shots = self.get_all_shots()
        
        for shot in shots:
            if shot.get('nomenclature') == shot_nomenclature:
                return shot
        
        return None
    
    def get_shots_by_scene(self, scene_name: str) -> List[Dict[str, Any]]:
        """
        Get all shots for a specific scene.
        
        Args:
            scene_name: Scene name
            
        Returns:
            List[Dict]: List of shot data for the scene
        """
        shots = self.get_all_shots()
        
        return [shot for shot in shots if shot.get('scene_name') == scene_name]
    
    def get_shots_by_status(self, status: ShotStatus) -> List[Dict[str, Any]]:
        """
        Get all shots with a specific status.
        
        Args:
            status: Shot status
            
        Returns:
            List[Dict]: List of shot data with the specified status
        """
        shots = self.get_all_shots()
        
        return [shot for shot in shots if shot.get('status') == status.value]
