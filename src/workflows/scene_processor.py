"""
Scene Processor
Handles processing of individual scenes through the pipeline
"""

import json
from typing import Dict, List, Optional, Any
from pathlib import Path
from datetime import datetime

from ..models.data_models import Shot, PostProductionData
from ..utils.status_tracker import PipelineTracker, ShotStatus, PipelineStage
from ..integrations.discord import DiscordNotifier


class SceneProcessor:
    """Processes individual scenes through the production pipeline."""
    
    def __init__(self, 
                 pipeline_tracker: PipelineTracker,
                 discord_notifier: Optional[DiscordNotifier] = None,
                 scene_data_dir: str = "output"):
        """
        Initialize scene processor.
        
        Args:
            pipeline_tracker: Pipeline status tracker
            discord_notifier: Discord notifier (optional)
            scene_data_dir: Directory containing scene JSON files
        """
        self.pipeline_tracker = pipeline_tracker
        self.discord_notifier = discord_notifier
        self.scene_data_dir = Path(scene_data_dir)
        self.scene_data: Dict[str, Dict[str, Any]] = {}
        self.load_scene_data()
    
    def load_scene_data(self) -> None:
        """Load all scene JSON files."""
        scene_files = list(self.scene_data_dir.glob("scene_*.json"))
        
        for scene_file in scene_files:
            try:
                with open(scene_file, 'r', encoding='utf-8') as f:
                    scene_data = json.load(f)
                    scene_name = scene_data["scene_name"]
                    self.scene_data[scene_name] = scene_data
                    
            except Exception as e:
                print(f"⚠️ Error loading scene file {scene_file}: {e}")
        
        print(f"📁 Loaded {len(self.scene_data)} scene files")
    
    def get_scene_names(self) -> List[str]:
        """Get all scene names."""
        return list(self.scene_data.keys())
    
    def get_scene_shots(self, scene_name: str) -> Dict[str, Dict[str, Any]]:
        """Get all shots for a scene."""
        if scene_name not in self.scene_data:
            return {}
        return self.scene_data[scene_name].get("shots", {})
    
    def initialize_scene_tracking(self, scene_name: str) -> None:
        """Initialize pipeline tracking for all shots in a scene."""
        if scene_name not in self.scene_data:
            print(f"⚠️ Scene '{scene_name}' not found")
            return
        
        shots = self.get_scene_shots(scene_name)
        
        for nomenclature, shot_data in shots.items():
            source_file = shot_data.get("source_file", "")
            self.pipeline_tracker.initialize_shot(nomenclature, source_file)
            
            # Send Discord notification if available
            if self.discord_notifier:
                shot_progress = self.pipeline_tracker.get_shot_status(nomenclature)
                if shot_progress:
                    self.discord_notifier.notify_shot_status_change(
                        shot_progress, ShotStatus.PENDING
                    )
        
        print(f"🎬 Initialized tracking for {len(shots)} shots in scene '{scene_name}'")
    
    def process_scene_after_effects(self, scene_name: str) -> bool:
        """
        Process a scene through After Effects stage.
        
        Args:
            scene_name: Name of the scene to process
            
        Returns:
            True if all shots processed successfully
        """
        if scene_name not in self.scene_data:
            print(f"⚠️ Scene '{scene_name}' not found")
            return False
        
        shots = self.get_scene_shots(scene_name)
        success_count = 0
        
        print(f"🎨 Processing scene '{scene_name}' through After Effects...")
        
        for nomenclature, shot_data in shots.items():
            try:
                # Update status to AE Ready
                self.pipeline_tracker.update_shot_status(
                    nomenclature, 
                    ShotStatus.AE_READY,
                    f"Ready for After Effects processing"
                )
                
                # Simulate AE processing (replace with actual AE script integration)
                ae_project_path = f"ae_projects/{nomenclature}.aep"
                
                # Update status to AE In Progress
                self.pipeline_tracker.update_shot_status(
                    nomenclature,
                    ShotStatus.AE_IN_PROGRESS,
                    f"Processing in After Effects",
                    ae_project_path=ae_project_path
                )
                
                # Here you would integrate with actual After Effects processing
                # For now, we'll simulate completion
                self.pipeline_tracker.update_shot_status(
                    nomenclature,
                    ShotStatus.AE_COMPLETED,
                    f"After Effects processing completed",
                    ae_project_path=ae_project_path
                )
                
                success_count += 1
                
            except Exception as e:
                error_msg = f"Error processing {nomenclature} in After Effects: {str(e)}"
                print(f"❌ {error_msg}")
                
                self.pipeline_tracker.update_shot_status(
                    nomenclature,
                    ShotStatus.ERROR,
                    error_msg,
                    error_message=error_msg
                )
                
                # Send error notification
                if self.discord_notifier:
                    shot_progress = self.pipeline_tracker.get_shot_status(nomenclature)
                    if shot_progress:
                        self.discord_notifier.notify_error(shot_progress, error_msg)
        
        print(f"✅ After Effects processing: {success_count}/{len(shots)} shots completed")
        return success_count == len(shots)
    
    def process_scene_ebsynth(self, scene_name: str) -> bool:
        """
        Process a scene through EbSynth stage.
        
        Args:
            scene_name: Name of the scene to process
            
        Returns:
            True if all shots processed successfully
        """
        if scene_name not in self.scene_data:
            print(f"⚠️ Scene '{scene_name}' not found")
            return False
        
        shots = self.get_scene_shots(scene_name)
        success_count = 0
        
        print(f"🎭 Processing scene '{scene_name}' through EbSynth...")
        
        for nomenclature, shot_data in shots.items():
            try:
                # Check if shot is ready for EbSynth (must be AE completed)
                shot_progress = self.pipeline_tracker.get_shot_status(nomenclature)
                if not shot_progress or shot_progress.current_status != ShotStatus.AE_COMPLETED:
                    print(f"⚠️ {nomenclature} not ready for EbSynth (status: {shot_progress.current_status if shot_progress else 'Unknown'})")
                    continue
                
                # Update status to EbSynth Ready
                self.pipeline_tracker.update_shot_status(
                    nomenclature,
                    ShotStatus.EBSYNTH_READY,
                    f"Ready for EbSynth processing"
                )
                
                # Simulate EbSynth processing
                ebsynth_output_path = f"ebsynth_output/{nomenclature}/"
                
                # Update status to EbSynth In Progress
                self.pipeline_tracker.update_shot_status(
                    nomenclature,
                    ShotStatus.EBSYNTH_IN_PROGRESS,
                    f"Processing in EbSynth",
                    ebsynth_output_path=ebsynth_output_path
                )
                
                # Here you would integrate with actual EbSynth processing
                # For now, we'll simulate completion
                self.pipeline_tracker.update_shot_status(
                    nomenclature,
                    ShotStatus.EBSYNTH_COMPLETED,
                    f"EbSynth processing completed",
                    ebsynth_output_path=ebsynth_output_path
                )
                
                success_count += 1
                
            except Exception as e:
                error_msg = f"Error processing {nomenclature} in EbSynth: {str(e)}"
                print(f"❌ {error_msg}")
                
                self.pipeline_tracker.update_shot_status(
                    nomenclature,
                    ShotStatus.ERROR,
                    error_msg,
                    error_message=error_msg
                )
                
                # Send error notification
                if self.discord_notifier:
                    shot_progress = self.pipeline_tracker.get_shot_status(nomenclature)
                    if shot_progress:
                        self.discord_notifier.notify_error(shot_progress, error_msg)
        
        print(f"✅ EbSynth processing: {success_count}/{len(shots)} shots completed")
        return success_count == len(shots)
    
    def check_scene_completion(self, scene_name: str) -> bool:
        """
        Check if all shots in a scene are completed.
        
        Args:
            scene_name: Name of the scene to check
            
        Returns:
            True if all shots are completed
        """
        if scene_name not in self.scene_data:
            return False
        
        shots = self.get_scene_shots(scene_name)
        completed_statuses = [ShotStatus.FINAL_DELIVERY, ShotStatus.REVIEW_APPROVED]
        
        completed_shots = []
        for nomenclature in shots.keys():
            shot_progress = self.pipeline_tracker.get_shot_status(nomenclature)
            if shot_progress and shot_progress.current_status in completed_statuses:
                completed_shots.append(shot_progress)
        
        all_completed = len(completed_shots) == len(shots)
        
        # Send completion notification
        if all_completed and self.discord_notifier:
            self.discord_notifier.notify_scene_completion(scene_name, completed_shots)
        
        return all_completed
    
    def get_scene_progress(self, scene_name: str) -> Dict[str, Any]:
        """
        Get progress statistics for a scene.
        
        Args:
            scene_name: Name of the scene
            
        Returns:
            Dictionary with scene progress statistics
        """
        if scene_name not in self.scene_data:
            return {}
        
        shots = self.get_scene_shots(scene_name)
        total_shots = len(shots)
        
        if total_shots == 0:
            return {"scene_name": scene_name, "total_shots": 0}
        
        # Count shots by status
        status_counts = {}
        for nomenclature in shots.keys():
            shot_progress = self.pipeline_tracker.get_shot_status(nomenclature)
            status = shot_progress.current_status if shot_progress else ShotStatus.PENDING
            status_counts[status.value] = status_counts.get(status.value, 0) + 1
        
        # Calculate completion percentage
        completed_statuses = [ShotStatus.FINAL_DELIVERY, ShotStatus.REVIEW_APPROVED]
        completed_count = sum(status_counts.get(status.value, 0) for status in completed_statuses)
        completion_percentage = (completed_count / total_shots) * 100
        
        return {
            "scene_name": scene_name,
            "total_shots": total_shots,
            "completed_shots": completed_count,
            "completion_percentage": completion_percentage,
            "status_counts": status_counts,
            "is_completed": completed_count == total_shots
        }
    
    def get_all_scenes_progress(self) -> Dict[str, Dict[str, Any]]:
        """Get progress for all scenes."""
        progress = {}
        for scene_name in self.scene_data.keys():
            progress[scene_name] = self.get_scene_progress(scene_name)
        return progress
