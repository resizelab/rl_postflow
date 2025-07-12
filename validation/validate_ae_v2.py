#!/usr/bin/env python3
"""
Script de validation finale des projets After Effects v2
Valide les scripts ExtendScript générés avec la nouvelle structure
"""

import os
import sys
import json
from pathlib import Path
from typing import Dict, List

class AEValidationV2:
    """Validation des projets After Effects v2."""
    
    def __init__(self):
        self.workspace_root = Path(__file__).parent
        self.ae_scripts_dir = self.workspace_root / "ae_scripts"
        self.sequences_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES")
        
    def check_scripts_generated(self) -> Dict[str, bool]:
        """Vérifie que tous les scripts v2 ont été générés."""
        validation_sequences = ['SQ01', 'SQ02', 'SQ03']
        results = {}
        
        print("🔍 Vérification des scripts ExtendScript v2...")
        
        for seq_id in validation_sequences:
            # Vérifier script local
            local_script = self.ae_scripts_dir / f"RL_PostFlow_{seq_id}_GENERATION_V2.jsx"
            
            # Vérifier script serveur
            server_script = self.sequences_path / seq_id / "_AE" / f"{seq_id}_generation_script_v2.jsx"
            
            local_ok = local_script.exists()
            server_ok = server_script.exists()
            
            results[seq_id] = {
                'local_script': local_ok,
                'server_script': server_ok,
                'local_path': str(local_script),
                'server_path': str(server_script)
            }
            
            status = "✅" if (local_ok and server_ok) else "❌"
            print(f"   {status} {seq_id}: Local={local_ok}, Serveur={server_ok}")
        
        return results
    
    def analyze_script_content(self, sequence_id: str) -> Dict:
        """Analyse le contenu d'un script ExtendScript v2."""
        script_path = self.ae_scripts_dir / f"RL_PostFlow_{sequence_id}_GENERATION_V2.jsx"
        
        if not script_path.exists():
            return {'error': f'Script non trouvé: {script_path}'}
        
        try:
            with open(script_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            analysis = {
                'file_size': len(content),
                'lines_count': content.count('\n'),
                'has_folder_structure': False,
                'has_import_section': False,
                'has_plan_compositions': False,
                'has_master_composition': False,
                'has_uhd_scaling': False,
                'plan_count': 0,
                'folder_structure_items': []
            }
            
            # Vérifier la structure de dossiers
            folder_markers = [
                'var masterFolder = project.items.addFolder("MASTER")',
                'var mastersCompPlansFolder = project.items.addFolder("MASTERS_COMP_PLANS")',
                'var inFolder = project.items.addFolder("_IN")',
                'var workFolder = project.items.addFolder("_WORK")',
                'var fromEditFolder = project.items.addFolder("FROM_EDIT")',
                'var fromGradingFolder = project.items.addFolder("FROM_GRADING")'
            ]
            
            for marker in folder_markers:
                if marker in content:
                    analysis['folder_structure_items'].append(marker.split('"')[1])
            
            analysis['has_folder_structure'] = len(analysis['folder_structure_items']) >= 6
            
            # Vérifier les sections
            analysis['has_import_section'] = 'IMPORT DES FICHIERS SOURCES' in content
            analysis['has_plan_compositions'] = 'CRÉATION DES COMPOSITIONS DE PLANS' in content
            analysis['has_master_composition'] = 'CRÉATION DE LA COMPOSITION MASTER' in content
            
            # Vérifier la mise à l'échelle UHD
            analysis['has_uhd_scaling'] = 'setValue([66.67, 66.67])' in content
            
            # Compter les plans
            analysis['plan_count'] = content.count('var planComp')
            
            return analysis
            
        except Exception as e:
            return {'error': f'Erreur lors de l\'analyse: {e}'}
    
    def validate_sequence_structure(self, sequence_id: str) -> Dict:
        """Valide la structure d'une séquence."""
        seq_path = self.sequences_path / sequence_id
        
        validation = {
            'sequence_exists': seq_path.exists(),
            'ae_folder_exists': False,
            'eb_folder_exists': False,
            'ps_folder_exists': False,
            'script_v2_exists': False,
            'plans_folders': []
        }
        
        if validation['sequence_exists']:
            ae_path = seq_path / "_AE"
            eb_path = seq_path / "_EB"
            ps_path = seq_path / "_PS"
            
            validation['ae_folder_exists'] = ae_path.exists()
            validation['eb_folder_exists'] = eb_path.exists()
            validation['ps_folder_exists'] = ps_path.exists()
            
            # Vérifier script v2
            script_v2_path = ae_path / f"{sequence_id}_generation_script_v2.jsx"
            validation['script_v2_exists'] = script_v2_path.exists()
            
            # Lister les dossiers de plans
            if eb_path.exists():
                for item in eb_path.iterdir():
                    if item.is_dir() and item.name.startswith('UNDLM_'):
                        validation['plans_folders'].append(item.name)
        
        return validation
    
    def run_validation(self) -> bool:
        """Exécute la validation complète."""
        print("🎬 RL PostFlow v4.1.1 - Validation After Effects v2")
        print("=" * 60)
        
        # 1. Vérifier les scripts générés
        scripts_results = self.check_scripts_generated()
        all_scripts_ok = all(
            result['local_script'] and result['server_script'] 
            for result in scripts_results.values()
        )
        
        if not all_scripts_ok:
            print("❌ Certains scripts ne sont pas générés correctement")
            return False
        
        print("\n✅ Tous les scripts ExtendScript v2 sont présents")
        
        # 2. Analyser le contenu des scripts
        print("\n🔍 Analyse du contenu des scripts...")
        
        for seq_id in ['SQ01', 'SQ02', 'SQ03']:
            analysis = self.analyze_script_content(seq_id)
            
            if 'error' in analysis:
                print(f"❌ {seq_id}: {analysis['error']}")
                continue
            
            print(f"\n📋 Analyse {seq_id}:")
            print(f"   📄 Taille: {analysis['file_size']:,} chars, {analysis['lines_count']:,} lignes")
            print(f"   📁 Structure dossiers: {'✅' if analysis['has_folder_structure'] else '❌'}")
            print(f"   📥 Section import: {'✅' if analysis['has_import_section'] else '❌'}")
            print(f"   🎬 Compositions plans: {'✅' if analysis['has_plan_compositions'] else '❌'}")
            print(f"   🎭 Composition master: {'✅' if analysis['has_master_composition'] else '❌'}")
            print(f"   📐 Mise à l'échelle UHD: {'✅' if analysis['has_uhd_scaling'] else '❌'}")
            print(f"   🎯 Plans détectés: {analysis['plan_count']}")
            
            if analysis['folder_structure_items']:
                print(f"   📂 Dossiers créés: {', '.join(analysis['folder_structure_items'])}")
        
        # 3. Vérifier la structure serveur
        print("\n🗂️  Vérification structure serveur...")
        
        for seq_id in ['SQ01', 'SQ02', 'SQ03']:
            structure = self.validate_sequence_structure(seq_id)
            
            print(f"\n📁 Structure {seq_id}:")
            print(f"   📂 Séquence: {'✅' if structure['sequence_exists'] else '❌'}")
            print(f"   🎬 Dossier _AE: {'✅' if structure['ae_folder_exists'] else '❌'}")
            print(f"   📹 Dossier _EB: {'✅' if structure['eb_folder_exists'] else '❌'}")
            print(f"   🎨 Dossier _PS: {'✅' if structure['ps_folder_exists'] else '❌'}")
            print(f"   📜 Script v2: {'✅' if structure['script_v2_exists'] else '❌'}")
            print(f"   🎯 Plans trouvés: {len(structure['plans_folders'])}")
        
        # 4. Instructions pour la suite
        print("\n" + "=" * 60)
        print("🎯 PROCHAINES ÉTAPES POUR LA VALIDATION:")
        print("=" * 60)
        print("\n1. 🎬 TESTER DANS AFTER EFFECTS:")
        print("   • Ouvrir After Effects")
        print("   • Fichier > Scripts > Exécuter fichier de script...")
        print("   • Sélectionner: RL_PostFlow_SQ01_GENERATION_V2.jsx")
        print("   • Vérifier la création du projet SQ01_01.aep")
        
        print("\n2. ✅ VÉRIFICATIONS À EFFECTUER:")
        print("   • Structure de dossiers conforme au template")
        print("   • Import des sources UHD dans FROM_EDIT")
        print("   • Compositions de plans en 2560x1440")
        print("   • Mise à l'échelle UHD vers 1440p (66.67%)")
        print("   • Composition master SQ01_UNDLM_v001")
        print("   • Assembly chronologique des plans")
        
        print("\n3. 🔄 SI PROBLÈMES DÉTECTÉS:")
        print("   • Modifier le générateur v2")
        print("   • Régénérer les scripts")
        print("   • Retester dans After Effects")
        
        print("\n4. 📋 VALIDATION SUIVANTES:")
        print("   • SQ02 et SQ03 avec les mêmes scripts")
        print("   • Déploiement sur toutes les séquences")
        
        return True

def main():
    """Point d'entrée principal."""
    validator = AEValidationV2()
    success = validator.run_validation()
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
