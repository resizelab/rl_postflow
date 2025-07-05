"""
After Effects Integration Module for UNDLM PostFlow
Handles project creation, import, and render queue management
"""

import json
import subprocess
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class AfterEffectsIntegration:
    """
    Manages After Effects project operations for UNDLM PostFlow
    """
    
    def __init__(self, config: Dict):
        self.config = config
        self.ae_path = config.get('ae_executable', '/Applications/Adobe After Effects 2024/Adobe After Effects 2024.app')
        self.scripts_path = Path(__file__).parent.parent.parent / "scripts" / "ae"
        self.templates_path = Path(config.get('templates_path', '/Volumes/UNDLM_POSTFLOW_LUCIDLINK/3_PROJECTS/2_VFX/TEMPLATES'))
        
        # Convention de nommage
        self.naming_convention = {
            'comp_suffix': '_COMP',
            'characters_suffix': '_CHARACTERS',
            'accessories_suffix': '_ACCESSORIES', 
            'environment_suffix': '_ENVIRONMENT',
            'effects_suffix': '_EFFECTS',
            'final_suffix': '_FINAL',
            'version_format': 'v{:03d}',
            'date_format': '%y%m%d'
        }
        
    def create_project_from_template(self, scene_name: str, shots: List[Dict]) -> Dict:
        """
        Create a new AE project from template for a given scene
        """
        current_date = datetime.now().strftime(self.naming_convention['date_format'])
        normalized_scene = self._normalize_scene_name(scene_name)
        project_name = f"{current_date}_{normalized_scene}.aep"
        
        # Generate project data
        project_data = {
            'project_name': project_name,
            'scene_name': scene_name,
            'normalized_scene': normalized_scene,
            'date': current_date,
            'shots': [],
            'comps': []
        }
        
        # Process each shot
        for shot in shots:
            nomenclature = shot.get('nomenclature', '')
            shot_data = self._create_shot_structure(nomenclature, scene_name, shot)
            project_data['shots'].append(shot_data)
            
        return project_data
    
    def _normalize_scene_name(self, scene_name: str) -> str:
        """Normalize scene name for AE project naming"""
        return scene_name.upper().replace(' ', '_').replace('-', '_')
    
    def _create_shot_structure(self, nomenclature: str, scene_name: str, shot_data: Dict) -> Dict:
        """
        Create the composition structure for a single shot
        """
        normalized_scene = self._normalize_scene_name(scene_name)
        
        # Generate composition names based on convention
        comp_names = {
            'main': f"{nomenclature}_{normalized_scene}{self.naming_convention['comp_suffix']}",
            'characters': f"{nomenclature}{self.naming_convention['characters_suffix']}",
            'accessories': f"{nomenclature}{self.naming_convention['accessories_suffix']}",
            'environment': f"{nomenclature}{self.naming_convention['environment_suffix']}",
            'effects': f"{nomenclature}{self.naming_convention['effects_suffix']}",
            'final': f"{nomenclature}{self.naming_convention['final_suffix']}"
        }
        
        shot_structure = {
            'nomenclature': nomenclature,
            'scene': scene_name,
            'source_file': shot_data.get('source_file', ''),
            'timeline_in': shot_data.get('timeline_in', ''),
            'timeline_out': shot_data.get('timeline_out', ''),
            'duration': shot_data.get('duration', ''),
            'comp_names': comp_names,
            'folder_structure': {
                'main_folder': nomenclature,
                'subfolders': ['CHARACTERS', 'ACCESSORIES', 'ENVIRONMENT', 'EFFECTS', 'FINAL']
            }
        }
        
        return shot_structure
    
    def generate_ae_script(self, project_data: Dict, output_path: str) -> str:
        """
        Generate ExtendScript (.jsx) for After Effects automation
        """
        script_content = f'''
// UNDLM PostFlow - After Effects Project Creation Script
// Generated on: {datetime.now().isoformat()}
// Project: {project_data['project_name']}
// Scene: {project_data['scene_name']}

// Project setup
var projectName = "{project_data['project_name']}";
var sceneName = "{project_data['scene_name']}";

// Create new project
app.newProject();
app.project.file = new File("{output_path}/" + projectName);

// Create main folders
var mainFolder = app.project.items.addFolder("SHOTS");
var sequencesFolder = app.project.items.addFolder("SEQUENCES");
var assetsFolder = app.project.items.addFolder("ASSETS");

// Shot creation function
function createShot(nomenclature, sourceFile, timelineIn, timelineOut, compNames) {{
    
    // Create shot folder
    var shotFolder = mainFolder.items.addFolder(nomenclature);
    
    // Create subfolders
    var charactersFolder = shotFolder.items.addFolder("CHARACTERS");
    var accessoriesFolder = shotFolder.items.addFolder("ACCESSORIES");
    var environmentFolder = shotFolder.items.addFolder("ENVIRONMENT");
    var effectsFolder = shotFolder.items.addFolder("EFFECTS");
    var finalFolder = shotFolder.items.addFolder("FINAL");
    
    // Import source file if exists
    if (sourceFile && sourceFile !== "") {{
        var sourceFilePath = "/Volumes/UNDLM_POSTFLOW_LUCIDLINK/2_IN/_FROM_GRADING/UNDLM_SOURCES/" + sourceFile;
        var sourceFile = new File(sourceFilePath);
        
        if (sourceFile.exists) {{
            var importedItem = app.project.importFile(new ImportOptions(sourceFile));
            importedItem.parentFolder = shotFolder;
            importedItem.name = nomenclature + "_SOURCE";
            
            // Create main composition
            var mainComp = app.project.items.addComp(compNames.main, 1920, 1080, 1, 10, 25);
            mainComp.parentFolder = shotFolder;
            
            // Add source to composition
            var sourceLayer = mainComp.layers.add(importedItem);
            sourceLayer.name = nomenclature + "_SOURCE";
            
            // Create sub-compositions
            var charactersComp = app.project.items.addComp(compNames.characters, 1920, 1080, 1, 10, 25);
            charactersComp.parentFolder = charactersFolder;
            
            var accessoriesComp = app.project.items.addComp(compNames.accessories, 1920, 1080, 1, 10, 25);
            accessoriesComp.parentFolder = accessoriesFolder;
            
            var environmentComp = app.project.items.addComp(compNames.environment, 1920, 1080, 1, 10, 25);
            environmentComp.parentFolder = environmentFolder;
            
            var effectsComp = app.project.items.addComp(compNames.effects, 1920, 1080, 1, 10, 25);
            effectsComp.parentFolder = effectsFolder;
            
            var finalComp = app.project.items.addComp(compNames.final, 1920, 1080, 1, 10, 25);
            finalComp.parentFolder = finalFolder;
            
            // Add sub-comps to main comp
            mainComp.layers.add(charactersComp);
            mainComp.layers.add(accessoriesComp);
            mainComp.layers.add(environmentComp);
            mainComp.layers.add(effectsComp);
            
            // Add main comp to final comp
            finalComp.layers.add(mainComp);
            
            return {{
                mainComp: mainComp,
                finalComp: finalComp,
                success: true
            }};
        }} else {{
            return {{
                success: false,
                error: "Source file not found: " + sourceFilePath
            }};
        }}
    }}
    
    return {{
        success: false,
        error: "No source file specified"
    }};
}}

// Create shots
var results = [];
'''
        
        # Add shot creation calls
        for shot in project_data['shots']:
            script_content += f'''
// Create shot: {shot['nomenclature']}
var shot_{shot['nomenclature'].replace('UNDLM_', '')} = createShot(
    "{shot['nomenclature']}", 
    "{shot['source_file']}", 
    "{shot['timeline_in']}", 
    "{shot['timeline_out']}", 
    {{
        main: "{shot['comp_names']['main']}",
        characters: "{shot['comp_names']['characters']}",
        accessories: "{shot['comp_names']['accessories']}",
        environment: "{shot['comp_names']['environment']}",
        effects: "{shot['comp_names']['effects']}",
        final: "{shot['comp_names']['final']}"
    }}
);
results.push(shot_{shot['nomenclature'].replace('UNDLM_', '')});
'''
        
        script_content += '''
// Save project
app.project.save();

// Log results
for (var i = 0; i < results.length; i++) {
    if (results[i].success) {
        alert("Successfully created shot: " + results[i].mainComp.name);
    } else {
        alert("Failed to create shot: " + results[i].error);
    }
}

alert("Project creation completed: " + projectName);
'''
        
        return script_content
    
    def create_ae_project(self, scene_name: str, shots: List[Dict], output_path: str) -> Dict:
        """
        Create complete After Effects project with all shots
        """
        try:
            # Generate project data
            project_data = self.create_project_from_template(scene_name, shots)
            
            # Generate AE script
            ae_script = self.generate_ae_script(project_data, output_path)
            
            # Save script to file
            script_path = self.scripts_path / f"create_{project_data['normalized_scene']}.jsx"
            script_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(script_path, 'w') as f:
                f.write(ae_script)
            
            return {
                'success': True,
                'project_name': project_data['project_name'],
                'script_path': str(script_path),
                'shots_count': len(shots),
                'comp_names': [shot['comp_names'] for shot in project_data['shots']]
            }
            
        except Exception as e:
            logger.error(f"Error creating AE project: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def execute_ae_script(self, script_path: str) -> Dict:
        """
        Execute an After Effects script
        """
        try:
            # Command to run AE script
            cmd = [
                'osascript', '-e',
                f'tell application "Adobe After Effects 2024" to DoScript "{script_path}"'
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                return {
                    'success': True,
                    'output': result.stdout
                }
            else:
                return {
                    'success': False,
                    'error': result.stderr
                }
                
        except Exception as e:
            logger.error(f"Error executing AE script: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def generate_render_queue_script(self, nomenclature: str, output_path: str, version: int = 1) -> str:
        """
        Generate script for adding shot to render queue
        """
        version_str = self.naming_convention['version_format'].format(version)
        output_filename = f"{nomenclature}_{version_str}.mov"
        
        script_content = f'''
// UNDLM PostFlow - Render Queue Script
// Shot: {nomenclature}
// Version: {version_str}

// Find final composition
var finalComp = null;
for (var i = 1; i <= app.project.numItems; i++) {{
    var item = app.project.item(i);
    if (item instanceof CompItem && item.name === "{nomenclature}_FINAL") {{
        finalComp = item;
        break;
    }}
}}

if (finalComp) {{
    // Add to render queue
    var renderQueueItem = app.project.renderQueue.items.add(finalComp);
    
    // Set output module
    var outputModule = renderQueueItem.outputModule(1);
    outputModule.file = new File("{output_path}/{output_filename}");
    
    // Set render settings for HD output
    outputModule.applyTemplate("H.264 - Match Render Settings - 15 Mbps");
    
    alert("Added to render queue: {output_filename}");
}} else {{
    alert("Could not find final composition: {nomenclature}_FINAL");
}}
'''
        
        return script_content
    
    def get_ae_project_info(self, project_path: str) -> Dict:
        """
        Get information about an existing AE project
        """
        try:
            # This would require AE scripting to extract project info
            # For now, return mock data
            return {
                'project_path': project_path,
                'shots': [],
                'compositions': [],
                'assets': []
            }
            
        except Exception as e:
            logger.error(f"Error getting AE project info: {e}")
            return {
                'error': str(e)
            }
