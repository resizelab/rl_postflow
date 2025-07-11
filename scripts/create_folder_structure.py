#!/usr/bin/env python3
"""
Créateur d'Arborescence SEQUENCES pour RL PostFlow
Crée la structure de dossiers pour les projets After Effects
"""

import json
import os
import sys
from pathlib import Path
import argparse

# Ajouter src au path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

class SequenceFolderCreator:
    """Créateur d'arborescence pour les séquences After Effects."""
    
    def __init__(self):
        self.base_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES")
        self.config_path = Path(__file__).parent.parent / "config" / "after_effects_mapping_gsheets.json"
        
    def load_sequence_data(self):
        """Charge les données de mapping des séquences."""
        if not self.config_path.exists():
            raise FileNotFoundError(f"Configuration non trouvée : {self.config_path}")
            
        with open(self.config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def create_sequence_folders(self, sequence_ids):
        """
        Crée l'arborescence complète pour les séquences.
        
        Structure créée:
        SEQUENCES/
        ├── SQ01/
        │   ├── _AE/           # Projets After Effects
        │   └── _EB/           # Plans individuels
        │       ├── 001/
        │       ├── 002/
        │       └── ...
        ├── SQ02/
        └── SQ03/
        """
        
        data = self.load_sequence_data()
        results = {}
        
        print("📁 CRÉATION ARBORESCENCE SEQUENCES")
        print("=" * 50)
        
        for seq_id in sequence_ids:
            print(f"\n🎬 Traitement de {seq_id}...")
            
            try:
                # Vérifier que la séquence existe
                if seq_id not in data['sequences']:
                    print(f"   ❌ Séquence {seq_id} non trouvée dans les données")
                    results[seq_id] = False
                    continue
                
                seq_info = data['sequences'][seq_id]
                seq_path = self.base_path / seq_id
                
                # Créer dossiers principaux
                ae_path = seq_path / "_AE"
                eb_path = seq_path / "_EB"
                
                ae_path.mkdir(parents=True, exist_ok=True)
                eb_path.mkdir(parents=True, exist_ok=True)
                
                print(f"   ✅ Dossiers principaux : {seq_path}")
                print(f"      📂 _AE/ (projets After Effects)")
                print(f"      📂 _EB/ (plans individuels)")
                
                # Créer dossiers plans individuels
                plan_count = seq_info['plan_count']
                plans = seq_info['plans']
                
                for plan_num in plans:
                    plan_folder = eb_path / f"{plan_num:03d}"
                    plan_folder.mkdir(exist_ok=True)
                
                print(f"      📦 {plan_count} dossiers plans créés ({min(plans):03d}→{max(plans):03d})")
                
                # Créer fichier README pour documentation
                readme_content = f"""# Séquence {seq_id} - {seq_info['name']}

## Informations
- Plans: {plan_count} ({min(plans):03d} → {max(plans):03d})
- Durée: {seq_info['duration_minutes']:.1f} minutes
- Généré le: {data['metadata']['generated_at']}

## Structure
```
{seq_id}/
├── _AE/                    # Projets After Effects
│   ├── {seq_id}_01.aep     # Projet principal
│   └── scripts/            # Scripts ExtendScript
└── _EB/                    # Plans individuels
    ├── {min(plans):03d}/   # Plan {min(plans):03d}
    ├── {min(plans)+1:03d}/   # Plan {min(plans)+1:03d}
    └── {max(plans):03d}/   # Plan {max(plans):03d}
```

## Workflow
1. Les plans sont importés depuis /FROM_EDIT/BY_SHOTS
2. Les plans étalonnés depuis /FROM_GRADING/BY_SHOTS (si disponibles)
3. Assembly automatique dans {seq_id}_UNDLM_v001
"""
                
                readme_path = seq_path / "README.md"
                with open(readme_path, 'w', encoding='utf-8') as f:
                    f.write(readme_content)
                
                print(f"      📄 Documentation : README.md")
                
                results[seq_id] = True
                
            except Exception as e:
                print(f"   ❌ Erreur {seq_id} : {e}")
                results[seq_id] = False
        
        # Rapport final
        success_count = sum(results.values())
        print(f"\n📊 RÉSULTATS CRÉATION ARBORESCENCE")
        print(f"   Réussites : {success_count}/{len(sequence_ids)}")
        
        for seq_id, success in results.items():
            status = "✅" if success else "❌"
            seq_path = self.base_path / seq_id
            print(f"   {status} {seq_id} → {seq_path}")
        
        if success_count == len(sequence_ids):
            print(f"\n🎉 ARBORESCENCE COMPLÈTE !")
            print(f"   📂 Base : {self.base_path}")
            print(f"   🗂️  Séquences : {', '.join(sequence_ids)}")
        else:
            print(f"\n⚠️  CRÉATION PARTIELLE - {len(sequence_ids)-success_count} échecs")
        
        return results
    
    def verify_folder_structure(self, sequence_ids):
        """Vérifie que l'arborescence existe et est complète."""
        
        print("🔍 VÉRIFICATION ARBORESCENCE")
        print("=" * 40)
        
        data = self.load_sequence_data()
        verification_results = {}
        
        for seq_id in sequence_ids:
            seq_path = self.base_path / seq_id
            ae_path = seq_path / "_AE"
            eb_path = seq_path / "_EB"
            readme_path = seq_path / "README.md"
            
            checks = {
                'dossier_sequence': seq_path.exists(),
                'dossier_ae': ae_path.exists(),
                'dossier_eb': eb_path.exists(),
                'readme': readme_path.exists()
            }
            
            # Vérifier dossiers plans
            if seq_id in data['sequences']:
                plans = data['sequences'][seq_id]['plans']
                plan_folders_exist = all(
                    (eb_path / f"{plan_num:03d}").exists() 
                    for plan_num in plans
                )
                checks['dossiers_plans'] = plan_folders_exist
            else:
                checks['dossiers_plans'] = False
            
            all_good = all(checks.values())
            verification_results[seq_id] = all_good
            
            status = "✅" if all_good else "❌"
            print(f"{status} {seq_id}")
            
            for check_name, result in checks.items():
                check_status = "✅" if result else "❌"
                print(f"    {check_status} {check_name}")
        
        success_count = sum(verification_results.values())
        print(f"\n📈 Vérification : {success_count}/{len(sequence_ids)} complètes")
        
        return verification_results

def main():
    """Fonction principale."""
    
    parser = argparse.ArgumentParser(description='Créateur arborescence SEQUENCES pour After Effects')
    parser.add_argument('--validation', '-v', action='store_true', 
                        help='Créer arborescence pour les 3 séquences de validation (SQ01, SQ02, SQ03)')
    parser.add_argument('--sequence', '-s', help='Créer arborescence pour une séquence spécifique')
    parser.add_argument('--all', '-a', action='store_true', help='Créer arborescence pour toutes les séquences')
    parser.add_argument('--verify', action='store_true', help='Vérifier arborescence existante')
    parser.add_argument('--base-path', help='Chemin de base personnalisé (par défaut: /Volumes/resizelab/...)')
    
    args = parser.parse_args()
    
    creator = SequenceFolderCreator()
    
    # Chemin personnalisé si fourni
    if args.base_path:
        creator.base_path = Path(args.base_path)
    
    # Déterminer les séquences à traiter
    if args.validation:
        sequence_ids = ['SQ01', 'SQ02', 'SQ03']
        print("🧪 Mode validation - Traitement des 3 premières séquences")
    elif args.sequence:
        sequence_ids = [args.sequence]
        print(f"🎯 Mode séquence unique - Traitement de {args.sequence}")
    elif args.all:
        try:
            data = creator.load_sequence_data()
            sequence_ids = list(data['sequences'].keys())
            print(f"🌍 Mode complet - Traitement de {len(sequence_ids)} séquences")
        except Exception as e:
            print(f"❌ Erreur chargement données : {e}")
            return
    else:
        print("❓ Spécifiez --validation, --sequence, --all ou --verify")
        return
    
    try:
        if args.verify:
            # Mode vérification
            creator.verify_folder_structure(sequence_ids)
        else:
            # Mode création
            creator.create_sequence_folders(sequence_ids)
            
            # Vérification automatique après création
            print()
            creator.verify_folder_structure(sequence_ids)
        
    except Exception as e:
        print(f"❌ Erreur : {e}")

if __name__ == "__main__":
    main()
