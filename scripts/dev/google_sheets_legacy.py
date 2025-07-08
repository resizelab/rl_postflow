"""
Google Sheets Integration for UNDLM PostFlow
Handles shot tracking, status updates, and production data synchronization
"""

import json
import logging
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime
from pathlib import Path
from dataclasses import dataclass
import gspread
from google.oauth2.service_account import Credentials
from ..utils.status_tracker import ShotProgress, ShotStatus, PipelineStage

logger = logging.getLogger(__name__)


@dataclass
class GoogleSheetsConfig:
    """Configuration for Google Sheets integration."""
    credentials_file: str
    spreadsheet_id: str
    worksheet_name: str = "Shot Tracking"
    sync_enabled: bool = True
    auto_update: bool = True
    backup_enabled: bool = True


class GoogleSheetsClient:
    """Handles Google Sheets API interactions."""
    
    def __init__(self, config: GoogleSheetsConfig):
        """
        Initialize Google Sheets client.
        
        Args:
            config: Google Sheets configuration
        """
        self.config = config
        self.client = None
        self.spreadsheet = None
        self.worksheet = None
        self.last_sync_time = None
        
        # Support both dict and object configuration
        self.spreadsheet_id = getattr(config, 'spreadsheet_id', config.get('spreadsheet_id') if isinstance(config, dict) else None)
        self.service_account_file = getattr(config, 'service_account_file', config.get('service_account_file') if isinstance(config, dict) else None)
        self.worksheet_name = getattr(config, 'worksheet_name', config.get('worksheet_name', 'Shot Tracking') if isinstance(config, dict) else 'Shot Tracking')
        
        # Column mapping for shot tracking
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
    
    def connect(self) -> bool:
        """Establish connection to Google Sheets."""
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
            
            # Get or create worksheet
            try:
                self.worksheet = self.spreadsheet.worksheet(self.worksheet_name)
            except gspread.WorksheetNotFound:
                self.worksheet = self.create_shot_tracking_worksheet()
            
            logger.info("Google Sheets connection successful")
            return True
            
        except Exception as e:
            logger.error(f"Google Sheets connection failed: {e}")
            return False
    
    def create_shot_tracking_worksheet(self) -> gspread.Worksheet:
        """Create the shot tracking worksheet with headers."""
        try:
            worksheet = self.spreadsheet.add_worksheet(
                title=self.config.worksheet_name,
                rows=1000,
                cols=20
            )
            
            # Set headers
            headers = [
                "Shot ID", "Scene", "Description", "Source File", 
                "Timecode In", "Timecode Out", "Duration", "Status",
                "Stage", "Progress %", "Assigned To", "Priority",
                "Notes", "AE Project", "Last Updated", "Frame.io Link",
                "Review Status", "Approval Date"
            ]
            
            worksheet.update('A1:R1', [headers])
            
            # Format headers
            worksheet.format('A1:R1', {
                "backgroundColor": {"red": 0.2, "green": 0.6, "blue": 0.9},
                "textFormat": {"bold": True, "foregroundColor": {"red": 1, "green": 1, "blue": 1}}
            })
            
            logger.info(f"Created shot tracking worksheet: {self.config.worksheet_name}")
            return worksheet
            
        except Exception as e:
            logger.error(f"Failed to create worksheet: {e}")
            raise
    
    def get_all_shots(self) -> List[Dict[str, Any]]:
        """Get all shots from the spreadsheet."""
        if not self.worksheet:
            logger.error("No worksheet connection")
            return []
        
        try:
            # Get all records
            records = self.worksheet.get_all_records()
            
            # Convert to standardized format
            shots = []
            for record in records:
                if record.get('Shot ID'):  # Skip empty rows
                    shots.append({
                        'nomenclature': record.get('Shot ID', ''),
                        'scene_name': record.get('Scene', ''),
                        'description': record.get('Description', ''),
                        'source_file': record.get('Source File', ''),
                        'timecode_in': record.get('Timecode In', ''),
                        'timecode_out': record.get('Timecode Out', ''),
                        'duration': record.get('Duration', ''),
                        'status': record.get('Status', ''),
                        'stage': record.get('Stage', ''),
                        'progress': record.get('Progress %', 0),
                        'assigned_to': record.get('Assigned To', ''),
                        'priority': record.get('Priority', ''),
                        'notes': record.get('Notes', ''),
                        'ae_project': record.get('AE Project', ''),
                        'last_updated': record.get('Last Updated', ''),
                        'frameio_link': record.get('Frame.io Link', ''),
                        'review_status': record.get('Review Status', ''),
                        'approval_date': record.get('Approval Date', '')
                    })
            
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
            True if successful
        """
        if not self.worksheet:
            logger.error("No worksheet connection")
            return False
        
        try:
            # Find the row for this shot
            row_number = self.find_shot_row(shot_nomenclature)
            
            if row_number is None:
                # Shot not found, add new row
                row_number = self.add_new_shot_row(shot_nomenclature)
            
            if row_number is None:
                logger.error(f"Could not find or create row for shot {shot_nomenclature}")
                return False
            
            # Update the row
            updates = [
                [status.value.replace('_', ' ').title()],  # Status
                [stage.value.replace('_', ' ').title()],   # Stage
                [progress],                                # Progress
                [notes],                                   # Notes
                [datetime.now().strftime("%Y-%m-%d %H:%M")] # Last Updated
            ]
            
            # Update status, stage, progress, notes, and last updated
            range_name = f"H{row_number}:L{row_number}"
            self.worksheet.update(range_name, updates, value_input_option='USER_ENTERED')
            
            logger.info(f"Updated shot {shot_nomenclature} status to {status.value}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update shot status: {e}")
            return False
    
    def find_shot_row(self, shot_nomenclature: str) -> Optional[int]:
        """Find the row number for a given shot."""
        try:
            # Get all values in column A (Shot ID)
            shot_ids = self.worksheet.col_values(1)
            
            # Find the row (add 1 because sheets are 1-indexed)
            for i, shot_id in enumerate(shot_ids, 1):
                if shot_id == shot_nomenclature:
                    return i
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to find shot row: {e}")
            return None
    
    def add_new_shot_row(self, shot_nomenclature: str) -> Optional[int]:
        """Add a new row for a shot."""
        try:
            # Find the next empty row
            shot_ids = self.worksheet.col_values(1)
            next_row = len(shot_ids) + 1
            
            # Add basic shot info
            row_data = [
                shot_nomenclature,  # Shot ID
                "",                 # Scene
                "",                 # Description
                "",                 # Source File
                "",                 # Timecode In
                "",                 # Timecode Out
                "",                 # Duration
                "NOT_STARTED",      # Status
                "PIPELINE_PENDING", # Stage
                0,                  # Progress
                "",                 # Assigned To
                "NORMAL",           # Priority
                "",                 # Notes
                "",                 # AE Project
                datetime.now().strftime("%Y-%m-%d %H:%M"),  # Last Updated
                "",                 # Frame.io Link
                "PENDING",          # Review Status
                ""                  # Approval Date
            ]
            
            range_name = f"A{next_row}:R{next_row}"
            self.worksheet.update(range_name, [row_data])
            
            logger.info(f"Added new row for shot {shot_nomenclature}")
            return next_row
            
        except Exception as e:
            logger.error(f"Failed to add new shot row: {e}")
            return None
    
    def bulk_update_shots(self, shots_data: List[Dict[str, Any]]) -> bool:
        """
        Bulk update shot data in the spreadsheet.
        
        Args:
            shots_data: List of shot data dictionaries
            
        Returns:
            True if successful
        """
        if not self.worksheet:
            logger.error("No worksheet connection")
            return False
        
        try:
            # Clear existing data (except headers)
            self.worksheet.clear("A2:R")
            
            # Prepare data for batch update
            rows_data = []
            for shot in shots_data:
                row_data = [
                    shot.get('nomenclature', ''),
                    shot.get('scene_name', ''),
                    shot.get('description', ''),
                    shot.get('source_file', ''),
                    shot.get('timecode_in', ''),
                    shot.get('timecode_out', ''),
                    shot.get('duration', ''),
                    shot.get('status', 'NOT_STARTED'),
                    shot.get('stage', 'PIPELINE_PENDING'),
                    shot.get('progress', 0),
                    shot.get('assigned_to', ''),
                    shot.get('priority', 'NORMAL'),
                    shot.get('notes', ''),
                    shot.get('ae_project', ''),
                    datetime.now().strftime("%Y-%m-%d %H:%M"),
                    shot.get('frameio_link', ''),
                    shot.get('review_status', 'PENDING'),
                    shot.get('approval_date', '')
                ]
                rows_data.append(row_data)
            
            # Batch update
            if rows_data:
                range_name = f"A2:R{len(rows_data) + 1}"
                self.worksheet.update(range_name, rows_data)
                
                logger.info(f"Bulk updated {len(rows_data)} shots in Google Sheets")
                return True
            else:
                logger.warning("No shots data to update")
                return False
                
        except Exception as e:
            logger.error(f"Failed to bulk update shots: {e}")
            return False
    
    def sync_with_pipeline_status(self, pipeline_status: Dict[str, Any]) -> bool:
        """
        Sync spreadsheet with pipeline status.
        
        Args:
            pipeline_status: Pipeline status data
            
        Returns:
            True if successful
        """
        if not self.config.sync_enabled:
            return True
        
        try:
            shots_status = pipeline_status.get('shots', {})
            
            for shot_nomenclature, shot_data in shots_status.items():
                status = ShotStatus(shot_data.get('status', 'NOT_STARTED'))
                stage = PipelineStage(shot_data.get('stage', 'PIPELINE_PENDING'))
                progress = shot_data.get('progress', 0)
                
                self.update_shot_status(
                    shot_nomenclature, status, stage, progress
                )
            
            self.last_sync_time = datetime.now()
            logger.info("Synced pipeline status with Google Sheets")
            return True
            
        except Exception as e:
            logger.error(f"Failed to sync with pipeline status: {e}")
            return False
    
    def get_production_statistics(self) -> Dict[str, Any]:
        """Get production statistics from the spreadsheet."""
        try:
            shots = self.get_all_shots()
            
            if not shots:
                return {}
            
            # Calculate statistics
            total_shots = len(shots)
            status_counts = {}
            stage_counts = {}
            
            for shot in shots:
                status = shot.get('status', 'NOT_STARTED')
                stage = shot.get('stage', 'PIPELINE_PENDING')
                
                status_counts[status] = status_counts.get(status, 0) + 1
                stage_counts[stage] = stage_counts.get(stage, 0) + 1
            
            return {
                'total_shots': total_shots,
                'status_distribution': status_counts,
                'stage_distribution': stage_counts,
                'last_sync': self.last_sync_time.isoformat() if self.last_sync_time else None
            }
            
        except Exception as e:
            logger.error(f"Failed to get production statistics: {e}")
            return {}
    
    def backup_spreadsheet(self, backup_path: str) -> bool:
        """
        Create a backup of the spreadsheet.
        
        Args:
            backup_path: Path to save the backup
            
        Returns:
            True if successful
        """
        if not self.config.backup_enabled:
            return True
        
        try:
            # Get all data
            shots = self.get_all_shots()
            
            backup_data = {
                'timestamp': datetime.now().isoformat(),
                'spreadsheet_id': self.config.spreadsheet_id,
                'worksheet_name': self.config.worksheet_name,
                'shots': shots
            }
            
            # Save to file
            backup_file = Path(backup_path) / f"shots_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(backup_file, 'w', encoding='utf-8') as f:
                json.dump(backup_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Created Google Sheets backup: {backup_file}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to create backup: {e}")
            return False


class GoogleSheetsWorkflow:
    """Handles Google Sheets workflow integration with the pipeline."""
    
    def __init__(self, client: GoogleSheetsClient):
        """
        Initialize Google Sheets workflow.
        
        Args:
            client: Google Sheets client instance
        """
        self.client = client
        self.auto_sync_enabled = True
    
    def initialize_project_tracking(self, shots_data: List[Dict[str, Any]]) -> bool:
        """
        Initialize project tracking with shot data.
        
        Args:
            shots_data: List of shot data from CSV
            
        Returns:
            True if successful
        """
        try:
            # Bulk update with initial data
            success = self.client.bulk_update_shots(shots_data)
            
            if success:
                logger.info("Initialized project tracking in Google Sheets")
                return True
            else:
                logger.error("Failed to initialize project tracking")
                return False
                
        except Exception as e:
            logger.error(f"Failed to initialize project tracking: {e}")
            return False
    
    def update_shot_progress(self, shot_progress: ShotProgress) -> bool:
        """
        Update shot progress in the spreadsheet.
        
        Args:
            shot_progress: Shot progress object
            
        Returns:
            True if successful
        """
        return self.client.update_shot_status(
            shot_progress.nomenclature,
            shot_progress.current_status,
            shot_progress.stage,
            shot_progress.progress_percentage,
            shot_progress.notes
        )
    
    def get_team_assignments(self) -> Dict[str, List[str]]:
        """
        Get team assignments from the spreadsheet.
        
        Returns:
            Dictionary mapping team members to assigned shots
        """
        try:
            shots = self.client.get_all_shots()
            assignments = {}
            
            for shot in shots:
                assigned_to = shot.get('assigned_to', '')
                if assigned_to:
                    if assigned_to not in assignments:
                        assignments[assigned_to] = []
                    assignments[assigned_to].append(shot.get('nomenclature', ''))
            
            return assignments
            
        except Exception as e:
            logger.error(f"Failed to get team assignments: {e}")
            return {}
    
    def generate_daily_report(self) -> Dict[str, Any]:
        """
        Generate daily progress report.
        
        Returns:
            Daily report data
        """
        try:
            stats = self.client.get_production_statistics()
            assignments = self.get_team_assignments()
            
            return {
                'date': datetime.now().strftime('%Y-%m-%d'),
                'statistics': stats,
                'team_assignments': assignments,
                'generated_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to generate daily report: {e}")
            return {}
