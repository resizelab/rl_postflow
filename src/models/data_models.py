"""
Data models for post-production workflow
"""

from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any
from datetime import datetime


@dataclass
class TimecodeInfo:
    """Represents timecode information for a shot."""
    timeline_in: str
    timeline_out: str
    source_in: str
    source_out: str
    duration: str
    
    def __post_init__(self):
        """Validate timecode format, allowing empty timecodes for deleted shots."""
        timecodes = [self.timeline_in, self.timeline_out, 
                    self.source_in, self.source_out, self.duration]
        for tc in timecodes:
            if tc and not self._is_valid_timecode(tc):  # Allow empty timecodes
                raise ValueError(f"Invalid timecode format: {tc}")
    
    @staticmethod
    def _is_valid_timecode(timecode: str) -> bool:
        """Check if timecode follows HH:MM:SS:FF format."""
        if not timecode:  # Empty timecode is valid
            return True
        if timecode.count(':') != 3:
            return False
        try:
            parts = timecode.split(':')
            hours, minutes, seconds, frames = map(int, parts)
            # More flexible frame validation (supports different frame rates)
            return (0 <= hours <= 23 and 0 <= minutes <= 59 and 
                   0 <= seconds <= 59 and 0 <= frames <= 59)
        except ValueError:
            return False


@dataclass
class ShotMetadata:
    """Metadata for production tracking."""
    is_duplicate: bool = False
    lut_applied: Optional[str] = None
    graphics_artist: Optional[str] = None
    comments: Optional[str] = None
    graphics_validated_prod: bool = False
    graphics_validated_director: bool = False
    graphics_retrieved: bool = False
    technical_verified: bool = False
    ready_for_edit: bool = False


@dataclass
class Shot:
    """Represents a single shot in the production."""
    nomenclature: str  # Primary identifier (e.g., UNDLM_00001)
    shot_number: str   # Original shot number from CSV
    scene_name: str
    sequence_position: int
    timecode: TimecodeInfo
    source_file: str
    metadata: ShotMetadata
    thumbnail_path: Optional[str] = None
    
    def __post_init__(self):
        """Validate shot data."""
        if not self.nomenclature:
            raise ValueError("Nomenclature cannot be empty - it's the primary identifier")
        if not self.shot_number:
            raise ValueError("Shot number cannot be empty")
        if not self.scene_name:
            raise ValueError("Scene name cannot be empty")
    
    @property
    def plan_id(self) -> str:
        """Get the plan ID from nomenclature (e.g., UNDLM_00001 -> 00001)."""
        if '_' in self.nomenclature:
            return self.nomenclature.split('_')[-1]
        return self.nomenclature
    
    @property
    def project_code(self) -> str:
        """Get the project code from nomenclature (e.g., UNDLM_00001 -> UNDLM)."""
        if '_' in self.nomenclature:
            return self.nomenclature.split('_')[0]
        return "UNKNOWN"


@dataclass
class ProjectInfo:
    """Project-level information."""
    name: str = "UNDLM Documentary"
    duration: str = "52 minutes"
    export_date: str = field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d"))
    total_shots: int = 0
    unique_scenes: int = 0
    source_files: List[str] = field(default_factory=list)


@dataclass
class PostProductionData:
    """Main data structure containing all project information."""
    project_info: ProjectInfo
    shots: List[Shot]
    
    def __post_init__(self):
        """Calculate project statistics."""
        self.project_info.total_shots = len(self.shots)
        unique_scenes = set(shot.scene_name for shot in self.shots)
        self.project_info.unique_scenes = len(unique_scenes)
        self.project_info.source_files = list(set(shot.source_file for shot in self.shots))
    
    def get_shot_by_nomenclature(self, nomenclature: str) -> Optional[Shot]:
        """Get a shot by its nomenclature identifier."""
        for shot in self.shots:
            if shot.nomenclature == nomenclature:
                return
        return None
    
    def get_shots_by_project_code(self, project_code: str) -> List[Shot]:
        """Get all shots for a specific project code."""
        return [shot for shot in self.shots if shot.project_code == project_code]
    
    def get_shots_by_scene(self, scene_name: str) -> List[Shot]:
        """Get all shots for a specific scene."""
        return [shot for shot in self.shots if shot.scene_name == scene_name]
    
    def get_duplicate_shots(self) -> List[Shot]:
        """Get all shots marked as duplicates."""
        return [shot for shot in self.shots if shot.metadata.is_duplicate]
    
    def get_shots_ready_for_edit(self) -> List[Shot]:
        """Get all shots ready for editing."""
        return [shot for shot in self.shots if shot.metadata.ready_for_edit]
    
    def get_nomenclature_gaps(self) -> List[str]:
        """Find missing nomenclature numbers in the sequence, excluding deleted shots."""
        if not self.shots:
            return []
        
        # Extract numeric parts from nomenclatures
        plan_numbers = []
        deleted_plans = set()  # Track deleted plan numbers
        
        for shot in self.shots:
            try:
                plan_id = shot.plan_id
                if plan_id.isdigit():
                    plan_numbers.append(int(plan_id))
                
                # Check if this shot is deleted during editing
                if (shot.metadata.comments and 
                    "PLAN SUPPRIMÉ AU MONTAGE" in shot.metadata.comments.upper()):
                    deleted_plans.add(int(plan_id))
                    
            except (ValueError, AttributeError):
                continue
        
        if not plan_numbers:
            return []
        
        # Find gaps, excluding deleted plans
        plan_numbers.sort()
        gaps = []
        for i in range(min(plan_numbers), max(plan_numbers) + 1):
            if i not in plan_numbers and i not in deleted_plans:
                project_code = self.shots[0].project_code if self.shots else "UNDLM"
                gaps.append(f"{project_code}_{i:05d}")
        
        return gaps
    
    def get_deleted_shots(self) -> List[Shot]:
        """Get all shots marked as deleted during editing."""
        deleted_shots = []
        for shot in self.shots:
            if (shot.metadata.comments and 
                "PLAN SUPPRIMÉ AU MONTAGE" in shot.metadata.comments.upper()):
                deleted_shots.append(shot)
        return deleted_shots
    
    def get_deleted_nomenclatures(self) -> List[str]:
        """Get nomenclatures of shots deleted during editing."""
        deleted_shots = self.get_deleted_shots()
        return [shot.nomenclature for shot in deleted_shots]


# Type aliases for clarity
CSVRow = Dict[str, Any]
EDLEntry = Dict[str, Any]
