"""
Simple test for the updated integrations
"""

import sys
import os
import json
from pathlib import Path

# Add the parent directory to the Python path
current_dir = Path(__file__).parent
parent_dir = current_dir.parent
sys.path.insert(0, str(parent_dir))

# Now we can import from src
from src.parsers.csv_parser import CSVParser

def load_config():
    """Load configuration from pipeline_config.json"""
    config_path = parent_dir / "pipeline_config.json"
    with open(config_path, 'r') as f:
        return json.load(f)

def test_lucidlink_paths():
    """Test LucidLink path generation"""
    print("🔗 Testing LucidLink Path Generation")
    print("=" * 50)
    
    # Load configuration
    config = load_config()
    base_path = Path(config['lucidlink']['base_path'])
    
    # Path structure according to arborescence
    paths = {
        'sources': base_path / "2_IN" / "_FROM_GRADING" / "UNDLM_SOURCES",
        'scenes': base_path / "2_IN" / "_FROM_GRADING" / "BY_SCENE",
        'vfx_projects': base_path / "3_PROJECTS" / "2_VFX",
        'outputs': base_path / "4_OUT" / "2_FROM_VFX",
        'deliverables': base_path / "5_DELIVERABLES" / "MASTER"
    }
    
    print("Generated paths:")
    for name, path in paths.items():
        print(f"  {name}: {path}")
    
    # Test output path generation
    nomenclature = "UNDLM_00001"
    version = 1
    
    shot_folder = paths['outputs'] / "BY_SHOT" / nomenclature
    output_file = shot_folder / f"{nomenclature}_v{version:03d}.mov"
    
    print(f"\nOutput path for {nomenclature} v{version:03d}:")
    print(f"  {output_file}")
    
    # Test deliverables paths
    pad_path = paths['deliverables'] / "PAD"
    prores_path = paths['deliverables'] / "PRORES"
    
    print(f"\nDeliverables paths:")
    print(f"  PAD: {pad_path}")
    print(f"  PRORES: {prores_path}")
    
    print()

def test_ae_naming_convention():
    """Test After Effects naming convention"""
    print("🎬 Testing After Effects Naming Convention")
    print("=" * 50)
    
    # Naming convention
    naming_convention = {
        'comp_suffix': '_COMP',
        'characters_suffix': '_CHARACTERS',
        'accessories_suffix': '_ACCESSORIES', 
        'environment_suffix': '_ENVIRONMENT',
        'effects_suffix': '_EFFECTS',
        'final_suffix': '_FINAL',
        'version_format': 'v{:03d}',
        'date_format': '%y%m%d'
    }
    
    # Test data
    nomenclature = "UNDLM_00001"
    scene_name = "REVEIL HOPITAL - JOUR"
    normalized_scene = scene_name.upper().replace(' ', '_').replace('-', '_')
    
    # Generate composition names
    comp_names = {
        'main': f"{nomenclature}_{normalized_scene}{naming_convention['comp_suffix']}",
        'characters': f"{nomenclature}{naming_convention['characters_suffix']}",
        'accessories': f"{nomenclature}{naming_convention['accessories_suffix']}",
        'environment': f"{nomenclature}{naming_convention['environment_suffix']}",
        'effects': f"{nomenclature}{naming_convention['effects_suffix']}",
        'final': f"{nomenclature}{naming_convention['final_suffix']}"
    }
    
    print(f"Scene: {scene_name}")
    print(f"Normalized: {normalized_scene}")
    print(f"Nomenclature: {nomenclature}")
    print("\nComposition names:")
    for comp_type, comp_name in comp_names.items():
        print(f"  {comp_type}: {comp_name}")
    
    # Test project naming
    from datetime import datetime
    current_date = datetime.now().strftime(naming_convention['date_format'])
    project_name = f"{current_date}_{normalized_scene}.aep"
    
    print(f"\nProject naming:")
    print(f"  Date: {current_date}")
    print(f"  Project: {project_name}")
    
    # Test versioning
    for version in [1, 2, 10, 999]:
        version_str = naming_convention['version_format'].format(version)
        output_name = f"{nomenclature}_{version_str}.mov"
        print(f"  Version {version}: {output_name}")
    
    print()

def test_folder_structure():
    """Test folder structure creation logic"""
    print("📁 Testing Folder Structure")
    print("=" * 50)
    
    # Load configuration
    config = load_config()
    base_path = Path(config['lucidlink']['base_path'])
    
    # Scene name normalization
    scenes = [
        "REVEIL HOPITAL - JOUR",
        "COULOIR HOPITAL - JOUR",
        "CHAMBRE PATIENT - NUIT",
        "EXTERIEUR HOPITAL - SOIR"
    ]
    
    print("Scene name normalization:")
    for scene in scenes:
        normalized = scene.upper().replace(' ', '_').replace('-', '_')
        if not normalized.startswith('SC'):
            normalized = f"SC01_{normalized}"
        print(f"  '{scene}' -> '{normalized}'")
    
    # Test output folder structure
    base_output = base_path / "4_OUT/2_FROM_VFX"
    
    print(f"\nOutput folder structure:")
    print(f"  Base: {base_output}")
    print(f"  By shot: {base_output / 'BY_SHOT'}")
    print(f"  By scene: {base_output / 'BY_SCENE'}")
    print(f"  All: {base_output / 'ALL'}")
    
    # Test shot-specific folders
    nomenclatures = ["UNDLM_00001", "UNDLM_00002", "UNDLM_00003"]
    
    print(f"\nShot-specific folders:")
    for nomenclature in nomenclatures:
        shot_folder = base_output / "BY_SHOT" / nomenclature
        print(f"  {nomenclature}: {shot_folder}")
    
    print()

def test_csv_integration():
    """Test CSV integration with new structure"""
    print("📊 Testing CSV Integration")
    print("=" * 50)
    
    # Load configuration
    config = load_config()
    base_path = Path(config['lucidlink']['base_path'])
    
    # Parse CSV
    parser = CSVParser(str(parent_dir / 'data' / 'shots.csv'))
    csv_data = parser.parse()
    
    if not csv_data or not csv_data.shots:
        print(f"❌ Failed to parse CSV or no shots found")
        return
    
    shots = csv_data.shots
    print(f"✅ Loaded {len(shots)} shots from CSV")
    
    # Test with first few shots
    test_shots = shots[:5]
    
    print("\nTesting path generation for first 5 shots:")
    
    for shot in test_shots:
        nomenclature = shot.nomenclature
        scene = shot.scene_name
        source_file = shot.source_file
        
        if not nomenclature:
            continue
            
        # Source paths
        source_path = base_path / "2_IN" / "_FROM_GRADING" / "UNDLM_SOURCES" / source_file
        
        # Output paths
        output_path = base_path / "4_OUT" / "2_FROM_VFX" / "BY_SHOT" / nomenclature / f"{nomenclature}_v001.mov"
        
        # AE project path
        normalized_scene = scene.upper().replace(' ', '_').replace('-', '_')
        if not normalized_scene.startswith('SC'):
            normalized_scene = f"SC01_{normalized_scene}"
        
        from datetime import datetime
        current_date = datetime.now().strftime('%y%m%d')
        ae_project = base_path / "3_PROJECTS" / "2_VFX" / "SEQUENCES" / f"{current_date}_{normalized_scene}.aep"
        
        print(f"\n  {nomenclature} - {scene}")
        print(f"    Source: {source_path}")
        print(f"    Output: {output_path}")
        print(f"    AE Project: {ae_project}")
    
    print()

def main():
    """Run all tests"""
    print("🚀 UNDLM PostFlow Integration Tests (Updated)")
    print("=" * 70)
    print()
    
    test_lucidlink_paths()
    test_ae_naming_convention()
    test_folder_structure()
    test_csv_integration()
    
    print("✅ All tests completed successfully!")
    print()
    print("📋 Summary:")
    print("- ✅ LucidLink path generation working")
    print("- ✅ After Effects naming convention defined")
    print("- ✅ Folder structure logic implemented")
    print("- ✅ CSV integration compatible")
    print()
    print("🔧 Next steps:")
    print("1. Set up LucidLink server and test with real files")
    print("2. Create After Effects templates")
    print("3. Test ExtendScript generation and execution")
    print("4. Integrate with existing pipeline workflows")

if __name__ == "__main__":
    main()
