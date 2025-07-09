#!/usr/bin/env python3
"""
Amélioration de la détection de la scène réelle dans les notifications Discord
"""

import json
import re
from pathlib import Path
from typing import Dict, Optional, List
from dataclasses import dataclass

@dataclass
class SceneInfo:
    """Information about a scene"""
    scene_name: str
    description: str
    cleaned_name: str

class SceneMapper:
    """Maps file paths and nomenclatures to actual scene names"""
    
    def __init__(self, data_path: Path):
        self.data_path = data_path
        self.scene_mapping = {}
        self._load_scene_mapping()
    
    def _load_scene_mapping(self):
        """Load scene mapping from shots.csv"""
        shots_csv = self.data_path / "shots.csv"
        if not shots_csv.exists():
            print(f"⚠️  Warning: {shots_csv} not found")
            return
        
        try:
            import pandas as pd
            df = pd.read_csv(shots_csv)
            
            # Create mapping from nomenclature to scene
            for _, row in df.iterrows():
                nomenclature = row.get('nomenclature', '')
                scene_name = row.get('scene_name', '')
                
                if nomenclature and scene_name:
                    self.scene_mapping[nomenclature] = self._clean_scene_name(scene_name)
                    
        except Exception as e:
            print(f"❌ Error loading scene mapping: {e}")
    
    def _clean_scene_name(self, scene_name: str) -> str:
        """Clean scene name for better display"""
        if not scene_name:
            return "Scène inconnue"
        
        # Replace underscores with spaces
        cleaned = scene_name.replace('_', ' ')
        
        # Capitalize first letter of each word
        cleaned = ' '.join(word.capitalize() for word in cleaned.split())
        
        # Special replacements
        replacements = {
            'Ext': 'Extérieur',
            'Int': 'Intérieur', 
            'Nuit': 'Nuit',
            'Jour': 'Jour',
            'Americaine': 'Américaine',
            'Cross': 'CROSS',
            'Mer': 'Mer',
            'Hopital': 'Hôpital',
            'Generique': 'Générique'
        }
        
        for old, new in replacements.items():
            cleaned = cleaned.replace(old, new)
        
        return cleaned
    
    def get_scene_info(self, nomenclature: str) -> SceneInfo:
        """Get scene information for a nomenclature"""
        if nomenclature in self.scene_mapping:
            raw_name = self.scene_mapping[nomenclature]
            cleaned_name = self._clean_scene_name(raw_name)
            return SceneInfo(
                scene_name=raw_name,
                description=cleaned_name,
                cleaned_name=cleaned_name
            )
        
        return SceneInfo(
            scene_name="Scene_Name_TBD",
            description="Scène à identifier",
            cleaned_name="Scène à identifier"
        )
    
    def get_all_scenes(self) -> Dict[str, str]:
        """Get all scene mappings"""
        return {k: self._clean_scene_name(v) for k, v in self.scene_mapping.items()}

def test_scene_detection():
    """Test scene detection"""
    print("🧪 Testing scene detection")
    print("=" * 30)
    
    # Initialize mapper
    data_path = Path(__file__).parent.parent / "data"
    mapper = SceneMapper(data_path)
    
    # Test with some sample nomenclatures
    test_nomenclatures = [
        "UNDLM_00001",
        "UNDLM_00010", 
        "UNDLM_00020",
        "UNDLM_00050",
        "UNDLM_00100"
    ]
    
    print(f"📊 Loaded {len(mapper.scene_mapping)} scene mappings")
    
    for nomenclature in test_nomenclatures:
        scene_info = mapper.get_scene_info(nomenclature)
        print(f"  {nomenclature} → {scene_info.cleaned_name}")
    
    # Show all mappings
    print("\n📝 All scene mappings:")
    all_scenes = mapper.get_all_scenes()
    for nomenclature, scene_name in sorted(all_scenes.items()):
        print(f"  {nomenclature}: {scene_name}")

def improve_discord_message():
    """Improve Discord message formatting"""
    print("🎨 Improving Discord message formatting")
    print("=" * 35)
    
    # Sample data
    sample_data = {
        "nomenclature": "UNDLM_00050",
        "version": 1,
        "file_path": "/Volumes/resizelab/o2b-undllm/4_OUT/2_FROM_VFX/BY_SHOT/UNDLM_00050/UNDLM_00050_v001.mov",
        "scene_name": "CROSS_INTERIEUR_-_JOUR"
    }
    
    # Initialize mapper
    data_path = Path(__file__).parent.parent / "data"
    mapper = SceneMapper(data_path)
    
    # Get scene info
    scene_info = mapper.get_scene_info(sample_data["nomenclature"])
    
    # Create improved message
    version_padded = f"v{sample_data['version']:03d}"
    file_name = Path(sample_data['file_path']).name
    
    embed = {
        "title": "🎬 NOUVEAU PLAN EXPORTÉ",
        "description": f"**{sample_data['nomenclature']}** {version_padded} est disponible pour review",
        "color": 0x00ff00,
        "fields": [
            {"name": "📁 Fichier", "value": file_name, "inline": True},
            {"name": "🎭 Scène", "value": scene_info.cleaned_name, "inline": True},
            {"name": "🔢 Version", "value": version_padded, "inline": True},
            {"name": "📍 Nomenclature", "value": sample_data['nomenclature'], "inline": True},
            {"name": "⏱️ Statut", "value": "Prêt pour review", "inline": True},
            {"name": "🎯 Action", "value": "Lancez `python main.py --interactive` → tapez `review`", "inline": False}
        ],
        "footer": {"text": "PostFlow Pipeline - Notification automatique"}
    }
    
    print("📨 Improved Discord message:")
    print(json.dumps(embed, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    test_scene_detection()
    print()
    improve_discord_message()
