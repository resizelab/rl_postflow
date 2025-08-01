"""
Pipeline Status Tracker
Manages the status of shots through the production pipeline
"""

from enum import Enum
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from datetime import datetime
import json
from pathlib import Path


class ShotStatus(Enum):
    """Status of a shot in the production pipeline."""
    PENDING = "⏳ pending"
    SOURCES_VERIFIED = "✅ sources_verified"
    REVIEW_UPLOADED = "📤 review_uploaded"
    REVIEW_APPROVED = "👍 review_approved"
    FINAL_DELIVERY = "🎉 final_delivery"
    ERROR = "❌ error"


class PipelineStage(Enum):
    """Stages of the production pipeline."""
    SOURCE_VERIFICATION = "🔍 source_verification"
    REVIEW_PROCESS = "📋 review_process"
    FINAL_DELIVERY = "🚀 final_delivery"


@dataclass
class ShotProgress:
    """Progress tracking for a single shot."""
    nomenclature: str
    current_status: ShotStatus
    stage: PipelineStage
    last_updated: datetime = field(default_factory=datetime.now)
    error_message: Optional[str] = None
    notes: str = ""
    
    # File paths
    source_file_path: Optional[str] = None
    ae_project_path: Optional[str] = None
    ebsynth_output_path: Optional[str] = None
    review_url: Optional[str] = None
    
    # Timestamps
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    def update_status(self, new_status: ShotStatus, notes: str = ""):
        """Update the shot status with timestamp."""
        self.current_status = new_status
        self.last_updated = datetime.now()
        if notes:
            self.notes = notes
        
        # Update stage based on status
        if new_status in [ShotStatus.PENDING, ShotStatus.SOURCES_VERIFIED]:
            self.stage = PipelineStage.SOURCE_VERIFICATION
        elif new_status in [ShotStatus.REVIEW_UPLOADED, ShotStatus.REVIEW_APPROVED]:
            self.stage = PipelineStage.REVIEW_PROCESS
        elif new_status == ShotStatus.FINAL_DELIVERY:
            self.stage = PipelineStage.FINAL_DELIVERY
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "nomenclature": self.nomenclature,
            "current_status": self.current_status.value,
            "stage": self.stage.value,
            "last_updated": self.last_updated.isoformat(),
            "error_message": self.error_message,
            "notes": self.notes,
            "source_file_path": self.source_file_path,
            "ae_project_path": self.ae_project_path,
            "ebsynth_output_path": self.ebsynth_output_path,
            "review_url": self.review_url,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ShotProgress':
        """Create from dictionary."""
        instance = cls(
            nomenclature=data["nomenclature"],
            current_status=ShotStatus(data["current_status"]),
            stage=PipelineStage(data["stage"]),
            last_updated=datetime.fromisoformat(data["last_updated"]),
            error_message=data.get("error_message"),
            notes=data.get("notes", ""),
            source_file_path=data.get("source_file_path"),
            ae_project_path=data.get("ae_project_path"),
            ebsynth_output_path=data.get("ebsynth_output_path"),
            review_url=data.get("review_url")
        )
        
        if data.get("started_at"):
            instance.started_at = datetime.fromisoformat(data["started_at"])
        if data.get("completed_at"):
            instance.completed_at = datetime.fromisoformat(data["completed_at"])
            
        return instance


class PipelineTracker:
    """Tracks the progress of all shots through the production pipeline."""
    
    def __init__(self, tracking_file: str = "pipeline_status.json"):
        """
        Initialize the pipeline tracker.
        
        Args:
            tracking_file: Path to the JSON file for persisting status
        """
        self.tracking_file = Path(tracking_file)
        self.shots: Dict[str, ShotProgress] = {}
        self.load_status()
    
    def load_status(self) -> None:
        """Load status from JSON file."""
        if self.tracking_file.exists():
            try:
                with open(self.tracking_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                for nomenclature, shot_data in data.items():
                    self.shots[nomenclature] = ShotProgress.from_dict(shot_data)
                    
                print(f"📊 Loaded status for {len(self.shots)} shots")
            except Exception as e:
                print(f"⚠️ Error loading status file: {e}")
    
    def save_status(self) -> None:
        """Save status to JSON file."""
        try:
            # Create directory if it doesn't exist
            self.tracking_file.parent.mkdir(parents=True, exist_ok=True)
            
            data = {nomenclature: shot.to_dict() for nomenclature, shot in self.shots.items()}
            
            with open(self.tracking_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
                
            print(f"💾 Saved status for {len(self.shots)} shots")
        except Exception as e:
            print(f"❌ Error saving status file: {e}")
    
    def initialize_shot(self, nomenclature: str, source_file: str = "", version: str = "v001") -> ShotProgress:
        """Initialize tracking for a new shot with version support."""
        # Créer la clé unique avec shot_id + version
        shot_key = f"{nomenclature}_{version}" if version and not nomenclature.endswith(f"_{version}") else nomenclature
        
        if shot_key not in self.shots:
            self.shots[shot_key] = ShotProgress(
                nomenclature=shot_key,
                current_status=ShotStatus.PENDING,
                stage=PipelineStage.SOURCE_VERIFICATION,
                source_file_path=source_file,
                started_at=datetime.now()
            )
            self.save_status()
        
        return self.shots[shot_key]
    
    def update_shot_status(self, nomenclature: str, status: ShotStatus, notes: str = "", version: str = "v001", **kwargs) -> None:
        """Update the status of a shot with version support."""
        # Créer la clé unique avec shot_id + version  
        shot_key = f"{nomenclature}_{version}" if version and not nomenclature.endswith(f"_{version}") else nomenclature
        
        if shot_key not in self.shots:
            self.initialize_shot(nomenclature, version=version)
        
        self.shots[shot_key].update_status(status, notes)
        
        # Update additional fields
        for key, value in kwargs.items():
            if hasattr(self.shots[shot_key], key):
                setattr(self.shots[shot_key], key, value)
        
        self.save_status()
        print(f"📈 Updated {shot_key}: {status.value}")
    
    def get_shots_by_status(self, status: ShotStatus) -> List[ShotProgress]:
        """Get all shots with a specific status."""
        return [shot for shot in self.shots.values() if shot.current_status == status]
    
    def get_shots_by_stage(self, stage: PipelineStage) -> List[ShotProgress]:
        """Get all shots in a specific stage."""
        return [shot for shot in self.shots.values() if shot.stage == stage]
    
    def get_shot_versions(self, shot_id: str) -> List[ShotProgress]:
        """Get all versions of a specific shot."""
        return [shot for shot_key, shot in self.shots.items() 
                if shot_key.startswith(f"{shot_id}_v") or shot_key == shot_id]
    
    def get_latest_version(self, shot_id: str) -> Optional[ShotProgress]:
        """Get the latest version of a specific shot."""
        versions = self.get_shot_versions(shot_id)
        if not versions:
            return None
        
        # Trier par clé pour obtenir la version la plus récente
        sorted_versions = sorted(versions, key=lambda x: x.nomenclature, reverse=True)
        return sorted_versions[0]
    
    def get_pipeline_stats(self) -> Dict[str, Any]:
        """Get pipeline statistics."""
        total_shots = len(self.shots)
        if total_shots == 0:
            return {"total_shots": 0}
        
        # Count by status
        status_counts = {}
        for status in ShotStatus:
            status_counts[status.value] = len(self.get_shots_by_status(status))
        
        # Count by stage
        stage_counts = {}
        for stage in PipelineStage:
            stage_counts[stage.value] = len(self.get_shots_by_stage(stage))
        
        # Calculate completion percentage
        completed_statuses = [ShotStatus.FINAL_DELIVERY, ShotStatus.REVIEW_APPROVED]
        completed_count = sum(len(self.get_shots_by_status(status)) for status in completed_statuses)
        completion_percentage = (completed_count / total_shots) * 100
        
        return {
            "total_shots": total_shots,
            "completion_percentage": completion_percentage,
            "status_counts": status_counts,
            "stage_counts": stage_counts,
            "last_updated": datetime.now().isoformat()
        }
    
    def get_shot_status(self, nomenclature: str) -> Optional[ShotProgress]:
        """Get the status of a specific shot."""
        return self.shots.get(nomenclature)
    
    def get_error_shots(self) -> List[ShotProgress]:
        """Get all shots with errors."""
        return self.get_shots_by_status(ShotStatus.ERROR)
    
    def reset_shot_status(self, nomenclature: str) -> None:
        """Reset a shot to pending status."""
        if nomenclature in self.shots:
            self.shots[nomenclature].update_status(ShotStatus.PENDING, "Status reset")
            self.save_status()
    
    def export_report(self, output_file: str = "pipeline_report.json") -> str:
        """Export a comprehensive pipeline report."""
        report = {
            "export_date": datetime.now().isoformat(),
            "pipeline_stats": self.get_pipeline_stats(),
            "shots": {nomenclature: shot.to_dict() for nomenclature, shot in self.shots.items()}
        }
        
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"📊 Pipeline report exported to {output_path}")
        return str(output_path)
