"""
LucidLink Integration Module for UNDLM PostFlow
Handles file verification and path mapping according to the UNDLM folder structure
"""

import os
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class LucidLinkIntegration:
    """
    Manages LucidLink file operations and path mapping for UNDLM PostFlow
    """
    
    def __init__(self, config: Dict):
        self.config = config
        self.base_path = Path(config.get('base_path', '/Volumes/UNDLM_POSTFLOW_LUCIDLINK'))
        self.sources_path = self.base_path / "2_IN" / "_FROM_GRADING" / "UNDLM_SOURCES"
        self.vfx_projects_path = self.base_path / "3_PROJECTS" / "2_VFX"
        self.vfx_sequences_path = self.base_path / "3_PROJECTS" / "2_VFX" / "SEQUENCES"
        self.vfx_templates_path = self.base_path / "3_PROJECTS" / "2_VFX" / "_TEMPLATES"
        self.vfx_master_path = self.base_path / "3_PROJECTS" / "2_VFX" / "MASTER"
        self.outputs_path = self.base_path / "4_OUT" / "2_FROM_VFX"
        self.deliverables_path = self.base_path / "5_DELIVERABLES" / "MASTER"
        
        # Ensure base paths exist (for development/testing)
        self.connected = self._check_connection()
        
    def _check_connection(self) -> bool:
        """Check if LucidLink volume is mounted and accessible"""
        try:
            return self.base_path.exists()
        except Exception as e:
            logger.warning(f"LucidLink connection check failed: {e}")
            return False
    
    def verify_source_file(self, shot_data: Dict) -> Tuple[bool, Optional[str]]:
        """
        Verify if source file exists for a given shot
        Returns (exists, full_path)
        """
        if not self.connected:
            return False, None
            
        nomenclature = shot_data.get('nomenclature', '')
        source_file = shot_data.get('source_file', '')
        
        if not nomenclature or not source_file:
            return False, None
            
        # Check in main sources folder (clips individuels par plan)
        source_path = self.sources_path / source_file
        if source_path.exists():
            return True, str(source_path)
            
        return False, None
    
    def _normalize_scene_name(self, scene_name: str) -> str:
        """Normalize scene name to match folder structure"""
        # Remove special characters and normalize
        normalized = scene_name.upper().replace(' ', '_').replace('-', '_')
        # Add scene prefix if not present
        if not normalized.startswith('SC'):
            # Extract scene number if present in the name
            words = normalized.split('_')
            if len(words) > 0:
                normalized = f"SC01_{normalized}"  # Default to SC01 if no number found
        return normalized
    
    def get_ae_project_path(self, scene_name: str, create_if_missing: bool = False) -> Optional[str]:
        """
        Get After Effects project path for a given scene
        """
        if not self.connected:
            return None
            
        normalized_scene = self._normalize_scene_name(scene_name)
        current_date = datetime.now().strftime("%y%m%d")
        project_name = f"{current_date}_{normalized_scene}.aep"
        
        # Projets organisés par dossier de séquence
        ae_project_path = self.vfx_sequences_path / normalized_scene / project_name
        
        if ae_project_path.exists():
            return str(ae_project_path)
        elif create_if_missing:
            # Create from template
            template_path = self.vfx_templates_path / "UNDLM_SHOT_TEMPLATE.aep"
            if template_path.exists():
                try:
                    ae_project_path.parent.mkdir(parents=True, exist_ok=True)
                    # In real implementation, this would copy and configure the template
                    logger.info(f"Would create AE project: {ae_project_path}")
                    return str(ae_project_path)
                except Exception as e:
                    logger.error(f"Failed to create AE project: {e}")
                    return None
        
        return None
    
    def get_output_path(self, nomenclature: str, version: int = 1, output_type: str = "shot") -> str:
        """
        Generate output path for rendered files
        output_type: 'shot', 'scene', or 'all'
        """
        if output_type == "shot":
            shot_folder = self.outputs_path / "BY_SHOT" / nomenclature
            shot_folder.mkdir(parents=True, exist_ok=True)
            return str(shot_folder / f"{nomenclature}_v{version:03d}.mov")
        elif output_type == "scene":
            # Scene outputs handled differently
            return str(self.outputs_path / "BY_SCENE")
        elif output_type == "all":
            return str(self.outputs_path / "ALL" / f"UNDLM_ALL_v{version:03d}.mov")
        else:
            raise ValueError(f"Unknown output_type: {output_type}")
    
    def get_deliverables_path(self, format_type: str = "PAD") -> str:
        """
        Get path for final deliverables
        format_type: 'PAD' or 'PRORES'
        """
        if format_type not in ["PAD", "PRORES"]:
            raise ValueError(f"Unknown format_type: {format_type}")
            
        return str(self.deliverables_path / format_type)
    
    def scan_sources_folder(self) -> List[Dict]:
        """
        Scan the sources folder and return list of available files
        """
        if not self.connected:
            return []
            
        sources = []
        try:
            for file_path in self.sources_path.glob("*.mov"):
                file_info = {
                    'filename': file_path.name,
                    'full_path': str(file_path),
                    'size': file_path.stat().st_size,
                    'modified': datetime.fromtimestamp(file_path.stat().st_mtime),
                    'nomenclature': self._extract_nomenclature(file_path.name)
                }
                sources.append(file_info)
        except Exception as e:
            logger.error(f"Error scanning sources folder: {e}")
            
        return sources
    
    def _extract_nomenclature(self, filename: str) -> Optional[str]:
        """Extract UNDLM nomenclature from filename"""
        import re
        match = re.search(r'(UNDLM_\d{5})', filename)
        return match.group(1) if match else None
    
    def verify_shot_pipeline(self, shot_data: Dict) -> Dict:
        """
        Comprehensive verification of shot pipeline status
        Returns status dictionary with file locations and availability
        """
        nomenclature = shot_data.get('nomenclature', '')
        scene_name = shot_data.get('scene', '')
        
        status = {
            'nomenclature': nomenclature,
            'scene': scene_name,
            'source_file': {
                'exists': False,
                'path': None
            },
            'ae_project': {
                'exists': False,
                'path': None
            },
            'outputs': {
                'exists': False,
                'versions': []
            },
            'ready_for_processing': False
        }
        
        # Check source file
        source_exists, source_path = self.verify_source_file(shot_data)
        status['source_file']['exists'] = source_exists
        status['source_file']['path'] = source_path
        
        # Check AE project
        ae_project_path = self.get_ae_project_path(scene_name)
        if ae_project_path:
            status['ae_project']['exists'] = True
            status['ae_project']['path'] = ae_project_path
            
        # Check outputs
        output_folder = self.outputs_path / "BY_SHOT" / nomenclature
        if output_folder.exists():
            versions = list(output_folder.glob(f"{nomenclature}_v*.mov"))
            status['outputs']['exists'] = len(versions) > 0
            status['outputs']['versions'] = [v.name for v in versions]
            
        # Determine if ready for processing
        status['ready_for_processing'] = status['source_file']['exists']
        
        return status
    
    def get_project_stats(self) -> Dict:
        """
        Get overall project statistics from LucidLink
        """
        if not self.connected:
            return {'error': 'LucidLink not connected'}
            
        stats = {
            'connection_status': 'connected',
            'total_sources': 0,
            'ae_projects': 0,
            'completed_shots': 0,
            'disk_usage': {}
        }
        
        try:
            # Count sources
            if self.sources_path.exists():
                stats['total_sources'] = len(list(self.sources_path.glob("*.mov")))
            
            # Count AE projects (dans les dossiers de séquences)
            if self.vfx_sequences_path.exists():
                ae_count = 0
                for scene_folder in self.vfx_sequences_path.iterdir():
                    if scene_folder.is_dir():
                        ae_count += len(list(scene_folder.glob("*.aep")))
                stats['ae_projects'] = ae_count
                
            # Count completed shots
            by_shot_path = self.outputs_path / "BY_SHOT"
            if by_shot_path.exists():
                stats['completed_shots'] = len([d for d in by_shot_path.iterdir() if d.is_dir()])
                
            # Get disk usage for key folders
            for folder_name, folder_path in [
                ('sources', self.sources_path),
                ('projects', self.vfx_projects_path),
                ('outputs', self.outputs_path),
                ('deliverables', self.deliverables_path)
            ]:
                if folder_path.exists():
                    stats['disk_usage'][folder_name] = self._get_folder_size(folder_path)
                    
        except Exception as e:
            logger.error(f"Error getting project stats: {e}")
            stats['error'] = str(e)
            
        return stats
    
    def _get_folder_size(self, folder_path: Path) -> int:
        """Get total size of folder in bytes"""
        total_size = 0
        try:
            for file_path in folder_path.rglob("*"):
                if file_path.is_file():
                    total_size += file_path.stat().st_size
        except Exception as e:
            logger.error(f"Error calculating folder size for {folder_path}: {e}")
        return total_size
    
    def create_folder_structure(self, scene_name: str) -> bool:
        """
        Create necessary folder structure for a new scene (PROVISOIRE)
        """
        if not self.connected:
            return False
            
        normalized_scene = self._normalize_scene_name(scene_name)
        
        try:
            # Create scene folder in SEQUENCES (organisé par dossier de scène)
            scene_sequence_folder = self.vfx_sequences_path / normalized_scene
            scene_sequence_folder.mkdir(parents=True, exist_ok=True)
            
            # Create output folders
            output_scene_folder = self.outputs_path / "BY_SCENE" / normalized_scene
            output_scene_folder.mkdir(parents=True, exist_ok=True)
            
            logger.info(f"Created folder structure for scene: {normalized_scene} (PROVISOIRE)")
            return True
            
        except Exception as e:
            logger.error(f"Error creating folder structure for {scene_name}: {e}")
            return False
