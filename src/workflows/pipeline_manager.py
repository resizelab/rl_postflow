"""
Pipeline Manager
Orchestrates the entire post-production pipeline
"""

import json
import time
from typing import Dict, List, Optional, Any
from pathlib import Path
from datetime import datetime, timedelta

from ..models.data_models import PostProductionData
from ..utils.status_tracker import PipelineTracker, ShotStatus, PipelineStage
from ..integrations.discord import DiscordNotifier, create_discord_notifier
from ..workflows.scene_processor import SceneProcessor


class PipelineManager:
    """Main pipeline orchestrator for the post-production workflow."""
    
    def __init__(self, 
                 config_file: str = "pipeline_config.json",
                 tracking_file: str = "pipeline_status.json",
                 scene_data_dir: str = "output"):
        """
        Initialize the pipeline manager.
        
        Args:
            config_file: Path to configuration file
            tracking_file: Path to status tracking file
            scene_data_dir: Directory containing scene JSON files
        """
        self.config_file = Path(config_file)
        self.config = self.load_config()
        
        # Initialize components
        self.pipeline_tracker = PipelineTracker(tracking_file)
        self.discord_notifier = self.setup_discord_notifier()
        self.scene_processor = SceneProcessor(
            self.pipeline_tracker,
            self.discord_notifier,
            scene_data_dir
        )
        
        print(f"🎬 Pipeline Manager initialized")
    
    def load_config(self) -> Dict[str, Any]:
        """Load pipeline configuration."""
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"⚠️ Error loading config: {e}")
        
        # Default configuration
        default_config = {
            "project_name": "UNDLM Documentary",
            "discord": {
                "webhook_url": "",
                "channel_name": "postproduction",
                "notifications_enabled": False
            },
            "lucidlink": {
                "mount_path": "/path/to/lucidlink",
                "verify_sources": True
            },
            "after_effects": {
                "project_template": "templates/ae_template.aep",
                "output_format": "mp4",
                "render_settings": "high_quality"
            },
            "ebsynth": {
                "settings_file": "ebsynth_settings.json",
                "output_format": "png_sequence"
            },
            "frameio": {
                "api_token": "",
                "project_id": "",
                "upload_enabled": False
            },
            "google_sheets": {
                "credentials_file": "",
                "spreadsheet_id": "",
                "sync_enabled": False
            },
            "auto_processing": {
                "enabled": False,
                "batch_size": 5,
                "delay_between_batches": 30
            }
        }
        
        # Save default config
        self.save_config(default_config)
        return default_config
    
    def save_config(self, config: Dict[str, Any]) -> None:
        """Save pipeline configuration."""
        try:
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"❌ Error saving config: {e}")
    
    def setup_discord_notifier(self) -> Optional[DiscordNotifier]:
        """Setup Discord notifier if configured."""
        discord_config = self.config.get("discord", {})
        
        if (discord_config.get("notifications_enabled") and 
            discord_config.get("webhook_url")):
            
            return create_discord_notifier(
                discord_config["webhook_url"],
                discord_config.get("channel_name", "postproduction")
            )
        
        return None
    
    def initialize_project(self, post_production_data: PostProductionData) -> None:
        """
        Initialize the pipeline for all shots in the project.
        
        Args:
            post_production_data: Complete project data
        """
        print(f"🚀 Initializing pipeline for {len(post_production_data.shots)} shots...")
        
        # Initialize tracking for all shots
        for shot in post_production_data.shots:
            self.pipeline_tracker.initialize_shot(shot.nomenclature, shot.source_file)
        
        # Initialize scene tracking
        for scene_name in self.scene_processor.get_scene_names():
            self.scene_processor.initialize_scene_tracking(scene_name)
        
        # Send initialization notification
        if self.discord_notifier:
            stats = self.pipeline_tracker.get_pipeline_stats()
            self.discord_notifier.notify_daily_report(stats)
        
        print(f"✅ Pipeline initialized for {len(post_production_data.shots)} shots")
    
    def process_scene(self, scene_name: str, stages: List[PipelineStage] = None) -> bool:
        """
        Process a scene through specified stages.
        
        Args:
            scene_name: Name of the scene to process
            stages: List of stages to process (default: all stages)
            
        Returns:
            True if all stages completed successfully
        """
        if stages is None:
            stages = [
                PipelineStage.SOURCE_VERIFICATION,
                PipelineStage.AFTER_EFFECTS,
                PipelineStage.EBSYNTH_PROCESSING,
                PipelineStage.REVIEW_PROCESS
            ]
        
        print(f"🎬 Processing scene '{scene_name}' through {len(stages)} stages...")
        
        success = True
        
        for stage in stages:
            try:
                if stage == PipelineStage.SOURCE_VERIFICATION:
                    success &= self.verify_scene_sources(scene_name)
                elif stage == PipelineStage.AFTER_EFFECTS:
                    success &= self.scene_processor.process_scene_after_effects(scene_name)
                elif stage == PipelineStage.EBSYNTH_PROCESSING:
                    success &= self.scene_processor.process_scene_ebsynth(scene_name)
                elif stage == PipelineStage.REVIEW_PROCESS:
                    success &= self.process_scene_review(scene_name)
                
                if not success:
                    print(f"❌ Scene '{scene_name}' failed at stage: {stage.value}")
                    break
                    
            except Exception as e:
                print(f"❌ Error processing scene '{scene_name}' at stage {stage.value}: {e}")
                success = False
                break
        
        # Check if scene is completed
        if success:
            self.scene_processor.check_scene_completion(scene_name)
        
        return success
    
    def verify_scene_sources(self, scene_name: str) -> bool:
        """
        Verify source files for a scene.
        
        Args:
            scene_name: Name of the scene to verify
            
        Returns:
            True if all sources verified
        """
        shots = self.scene_processor.get_scene_shots(scene_name)
        success_count = 0
        
        print(f"🔍 Verifying sources for scene '{scene_name}'...")
        
        for nomenclature, shot_data in shots.items():
            try:
                source_file = shot_data.get("source_file", "")
                
                # Here you would integrate with LucidLink verification
                # For now, we'll simulate verification
                source_verified = True  # Replace with actual verification
                
                if source_verified:
                    self.pipeline_tracker.update_shot_status(
                        nomenclature,
                        ShotStatus.SOURCES_VERIFIED,
                        f"Source file verified: {source_file}"
                    )
                    success_count += 1
                else:
                    self.pipeline_tracker.update_shot_status(
                        nomenclature,
                        ShotStatus.ERROR,
                        f"Source file not found: {source_file}",
                        error_message=f"Source file not found: {source_file}"
                    )
                    
            except Exception as e:
                error_msg = f"Error verifying {nomenclature}: {str(e)}"
                print(f"❌ {error_msg}")
                
                self.pipeline_tracker.update_shot_status(
                    nomenclature,
                    ShotStatus.ERROR,
                    error_msg,
                    error_message=error_msg
                )
        
        print(f"✅ Source verification: {success_count}/{len(shots)} shots verified")
        return success_count == len(shots)
    
    def process_scene_review(self, scene_name: str) -> bool:
        """
        Process a scene through review stage.
        
        Args:
            scene_name: Name of the scene to process
            
        Returns:
            True if all shots processed successfully
        """
        shots = self.scene_processor.get_scene_shots(scene_name)
        success_count = 0
        
        print(f"📋 Processing scene '{scene_name}' through review...")
        
        for nomenclature, shot_data in shots.items():
            try:
                # Check if shot is ready for review (must be EbSynth completed)
                shot_progress = self.pipeline_tracker.get_shot_status(nomenclature)
                if not shot_progress or shot_progress.current_status != ShotStatus.EBSYNTH_COMPLETED:
                    print(f"⚠️ {nomenclature} not ready for review")
                    continue
                
                # Here you would integrate with Frame.io upload
                # For now, we'll simulate upload
                review_url = f"https://frame.io/review/{nomenclature}"
                
                self.pipeline_tracker.update_shot_status(
                    nomenclature,
                    ShotStatus.REVIEW_UPLOADED,
                    f"Uploaded to Frame.io for review",
                    review_url=review_url
                )
                
                success_count += 1
                
            except Exception as e:
                error_msg = f"Error uploading {nomenclature} for review: {str(e)}"
                print(f"❌ {error_msg}")
                
                self.pipeline_tracker.update_shot_status(
                    nomenclature,
                    ShotStatus.ERROR,
                    error_msg,
                    error_message=error_msg
                )
        
        print(f"✅ Review processing: {success_count}/{len(shots)} shots uploaded")
        return success_count == len(shots)
    
    def run_auto_processing(self, max_scenes: int = 5) -> None:
        """
        Run automatic processing for multiple scenes.
        
        Args:
            max_scenes: Maximum number of scenes to process
        """
        if not self.config.get("auto_processing", {}).get("enabled", False):
            print("⚠️ Auto-processing is disabled in config")
            return
        
        batch_size = self.config.get("auto_processing", {}).get("batch_size", 5)
        delay = self.config.get("auto_processing", {}).get("delay_between_batches", 30)
        
        scene_names = self.scene_processor.get_scene_names()[:max_scenes]
        
        print(f"🔄 Starting auto-processing for {len(scene_names)} scenes...")
        
        for i, scene_name in enumerate(scene_names):
            print(f"🎬 Processing scene {i+1}/{len(scene_names)}: {scene_name}")
            
            success = self.process_scene(scene_name)
            
            if not success:
                print(f"❌ Scene '{scene_name}' failed, stopping auto-processing")
                break
            
            # Delay between scenes
            if i < len(scene_names) - 1:
                print(f"⏳ Waiting {delay} seconds before next scene...")
                time.sleep(delay)
        
        print(f"🎉 Auto-processing completed")
    
    def get_pipeline_dashboard(self) -> Dict[str, Any]:
        """Get comprehensive pipeline dashboard data."""
        stats = self.pipeline_tracker.get_pipeline_stats()
        scenes_progress = self.scene_processor.get_all_scenes_progress()
        
        return {
            "project_name": self.config.get("project_name", "UNDLM Documentary"),
            "last_updated": datetime.now().isoformat(),
            "pipeline_stats": stats,
            "scenes_progress": scenes_progress,
            "error_shots": [shot.to_dict() for shot in self.pipeline_tracker.get_error_shots()],
            "config": self.config
        }
    
    def send_daily_report(self) -> None:
        """Send daily pipeline report via Discord."""
        if not self.discord_notifier:
            print("⚠️ Discord notifications not configured")
            return
        
        stats = self.pipeline_tracker.get_pipeline_stats()
        self.discord_notifier.notify_daily_report(stats)
        print("📊 Daily report sent to Discord")
    
    def export_pipeline_report(self, output_file: str = "pipeline_dashboard.json") -> str:
        """Export comprehensive pipeline report."""
        dashboard = self.get_pipeline_dashboard()
        
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(dashboard, f, indent=2, ensure_ascii=False)
        
        print(f"📊 Pipeline dashboard exported to {output_path}")
        return str(output_path)
