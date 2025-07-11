#!/usr/bin/env python3
"""
After Effects Template Deployment - Version Simple
Déploie le template SQXX vers les séquences avec renommage automatique
"""

import os
import shutil
import csv
import re
from pathlib import Path
from typing import Dict, List, Tuple
import json

class SimpleAEDeployer:
    """Déployeur simple de templates After Effects"""
    
    def __init__(self, template_path: str, output_path: str, shots_csv: str):
        self.template_path = Path(template_path)
        self.output_path = Path(output_path)
        self.shots_csv = Path(shots_csv)
        
        # Vérifications
        if not self.template_path.exists():
            raise FileNotFoundError(f"Template non trouvé: {template_path}")
        if not self.shots_csv.exists():
            raise FileNotFoundError(f"CSV non trouvé: {shots_csv}")
    
    def analyze_shots_data(self) -> Dict[str, List[str]]:
        """Analyse le CSV pour extraire séquences et plans"""
        print("📊 Analyse des données shots.csv...")
        
        sequences = {}
        
        with open(self.shots_csv, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                shot_id = row.get('shot_id', '').strip()
                if not shot_id:
                    continue
                
                # Extraire séquence et plan du shot_id (ex: SQ01_001)
                match = re.match(r'(SQ\d+)_(\d+)', shot_id)
                if match:
                    sequence = match.group(1)
                    plan = match.group(2)
                    
                    if sequence not in sequences:
                        sequences[sequence] = []
                    
                    if plan not in sequences[sequence]:
                        sequences[sequence].append(plan)
        
        # Trier les plans
        for seq in sequences:
            sequences[seq].sort()
        
        print(f"   ✅ {len(sequences)} séquences trouvées")
        for seq, plans in sequences.items():
            print(f"      - {seq}: {len(plans)} plans ({min(plans)}-{max(plans)})")
        
        return sequences
    
    def analyze_template_structure(self) -> Dict[str, List[Path]]:
        """Analyse la structure du template pour identifier les patterns"""
        print("📁 Analyse du template SQXX...")
        
        patterns = {
            'SQXX': [],
            'XXX': [],
            'files_to_rename': [],
            'folders_to_rename': [],
            'aep_files': []
        }
        
        for item in self.template_path.rglob('*'):
            item_name = item.name
            
            # Fichiers .aep
            if item.suffix.lower() == '.aep':
                patterns['aep_files'].append(item)
            
            # Fichiers et dossiers avec SQXX
            if 'SQXX' in item_name:
                patterns['SQXX'].append(item)
                if item.is_file():
                    patterns['files_to_rename'].append(item)
                else:
                    patterns['folders_to_rename'].append(item)
            
            # Fichiers et dossiers avec XXX
            if 'XXX' in item_name:
                patterns['XXX'].append(item)
                if item.is_file():
                    patterns['files_to_rename'].append(item)
                else:
                    patterns['folders_to_rename'].append(item)
        
        print(f"   📄 Fichiers .aep: {len(patterns['aep_files'])}")
        for aep in patterns['aep_files']:
            rel_path = aep.relative_to(self.template_path)
            print(f"      - {rel_path}")
        
        print(f"   📄 Fichiers avec SQXX: {len([p for p in patterns['SQXX'] if p.is_file()])}")
        print(f"   📁 Dossiers avec SQXX: {len([p for p in patterns['SQXX'] if p.is_dir()])}")
        print(f"   📄 Fichiers avec XXX: {len([p for p in patterns['XXX'] if p.is_file()])}")
        print(f"   📁 Dossiers avec XXX: {len([p for p in patterns['XXX'] if p.is_dir()])}")
        
        return patterns
    
    def deploy_sequence(self, sequence_id: str, plans: List[str], dry_run: bool = True) -> bool:
        """Déploie une séquence avec ses plans"""
        print(f"\n🚀 Déploiement {sequence_id} ({len(plans)} plans)...")
        
        # Créer le dossier de séquence
        seq_output = self.output_path / sequence_id
        
        if dry_run:
            print(f"   [DRY RUN] Créerait: {seq_output}")
        else:
            # Backup si le dossier existe déjà
            if seq_output.exists():
                backup_path = seq_output.with_suffix('.backup')
                if backup_path.exists():
                    shutil.rmtree(backup_path)
                seq_output.rename(backup_path)
                print(f"   📦 Backup créé: {backup_path}")
            
            seq_output.mkdir(parents=True, exist_ok=True)
            print(f"   ✅ Créé: {seq_output}")
        
        # Copier le template
        if not dry_run:
            shutil.copytree(self.template_path, seq_output, dirs_exist_ok=True)
            print(f"   ✅ Template copié vers {seq_output}")
        
        # Renommer les fichiers et dossiers SQXX
        self._rename_sqxx_items(seq_output, sequence_id, dry_run)
        
        # Créer les dossiers EB par plan
        self._create_eb_structure(seq_output, sequence_id, plans, dry_run)
        
        return True
    
    def _rename_sqxx_items(self, seq_path: Path, sequence_id: str, dry_run: bool):
        """Renomme tous les éléments contenant SQXX"""
        print(f"   🔄 Renommage SQXX -> {sequence_id}...")
        
        if dry_run:
            # Simulation
            for item in seq_path.rglob('*'):
                if 'SQXX' in item.name:
                    old_name = item.name
                    new_name = old_name.replace('SQXX', sequence_id)
                    print(f"      [DRY RUN] {old_name} -> {new_name}")
            return
        
        # Collecter tous les items à renommer (dossiers d'abord, puis fichiers)
        items_to_rename = []
        
        for item in seq_path.rglob('*'):
            if 'SQXX' in item.name:
                items_to_rename.append(item)
        
        # Trier: dossiers en premier (plus profonds d'abord), puis fichiers
        items_to_rename.sort(key=lambda x: (-len(x.parts), x.is_file()))
        
        for item in items_to_rename:
            old_name = item.name
            new_name = old_name.replace('SQXX', sequence_id)
            new_path = item.parent / new_name
            
            try:
                item.rename(new_path)
                print(f"      ✅ {old_name} -> {new_name}")
            except Exception as e:
                print(f"      ❌ Erreur renommage {old_name}: {e}")
    
    def _create_eb_structure(self, seq_path: Path, sequence_id: str, plans: List[str], dry_run: bool):
        """Crée la structure EB avec un dossier par plan"""
        print(f"   📁 Création structure EB ({len(plans)} plans)...")
        
        # Chercher le dossier EB existant
        eb_path = None
        
        if not dry_run:
            for item in seq_path.rglob('*'):
                if item.is_dir() and 'EB' in item.name.upper():
                    eb_path = item
                    break
        
        if not eb_path:
            eb_path = seq_path / 'EB'
            
        if dry_run:
            print(f"      [DRY RUN] Dossier EB: {eb_path}")
        else:
            eb_path.mkdir(exist_ok=True)
            print(f"      ✅ Dossier EB: {eb_path}")
        
        # Créer un dossier par plan
        for plan in plans:
            plan_folder = eb_path / f"{sequence_id}_{plan}"
            
            if dry_run:
                print(f"      [DRY RUN] Plan: {plan_folder.name}")
            else:
                plan_folder.mkdir(exist_ok=True)
                print(f"      ✅ Plan: {plan_folder.name}")
                
                # Créer les sous-dossiers standard pour EbSynth
                for subfolder in ['source', 'output', 'frames', 'assets']:
                    sub_path = plan_folder / subfolder
                    sub_path.mkdir(exist_ok=True)
    
    def deploy_all_sequences(self, dry_run: bool = True) -> bool:
        """Déploie toutes les séquences"""
        print("🚀 DÉPLOIEMENT COMPLET DES TEMPLATES AFTER EFFECTS")
        print("=" * 60)
        
        # Analyser les données
        sequences = self.analyze_shots_data()
        template_info = self.analyze_template_structure()
        
        print(f"\n📋 Plan de déploiement:")
        total_plans = sum(len(plans) for plans in sequences.values())
        print(f"   - {len(sequences)} séquences")
        print(f"   - {total_plans} plans au total")
        print(f"   - Template: {self.template_path}")
        print(f"   - Destination: {self.output_path}")
        
        if dry_run:
            print("   ⚠️  MODE DRY RUN - Aucune modification réelle")
        else:
            print("   🔥 MODE RÉEL - Modifications appliquées")
        
        # Confirmation en mode réel
        if not dry_run:
            print(f"\n⚠️  ATTENTION: Ceci va créer/modifier {len(sequences)} dossiers de séquences")
            response = input("❓ Confirmer le déploiement ? (y/N): ")
            if response.lower() != 'y':
                print("❌ Déploiement annulé")
                return False
        
        # Déployer chaque séquence
        print(f"\n🚀 Déploiement des séquences...")
        
        success_count = 0
        for sequence_id, plans in sequences.items():
            try:
                self.deploy_sequence(sequence_id, plans, dry_run)
                success_count += 1
                print(f"   ✅ {sequence_id}: OK")
            except Exception as e:
                print(f"   ❌ {sequence_id}: ERREUR - {e}")
        
        print(f"\n🎉 DÉPLOIEMENT TERMINÉ !")
        print(f"   ✅ Réussi: {success_count}/{len(sequences)} séquences")
        
        if dry_run:
            print("💡 Pour appliquer les changements: relancez avec --real")
        else:
            print(f"✅ {success_count} séquences déployées vers {self.output_path}")
        
        return success_count == len(sequences)

def main():
    """Fonction principale"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Déploiement templates After Effects')
    parser.add_argument('--real', action='store_true', help='Mode réel (par défaut: dry run)')
    parser.add_argument('--template', default="/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX", 
                       help='Chemin du template')
    parser.add_argument('--output', default="/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES",
                       help='Dossier de destination')
    parser.add_argument('--csv', default="/Users/home/Library/CloudStorage/OneDrive-Personnel/WORK/_DEV/rl_postflow/data/shots.csv",
                       help='Fichier CSV des plans')
    
    args = parser.parse_args()
    
    try:
        # Créer le déployeur
        deployer = SimpleAEDeployer(args.template, args.output, args.csv)
        
        # Mode de déploiement
        dry_run = not args.real
        
        if dry_run:
            print("🧪 TEST EN MODE DRY RUN")
            print("=" * 40)
        else:
            print("🔥 DÉPLOIEMENT RÉEL")
            print("=" * 40)
        
        # Déploiement
        success = deployer.deploy_all_sequences(dry_run=dry_run)
        
        if dry_run:
            print("\n" + "=" * 60)
            print("💡 Pour déployer réellement: python script.py --real")
        
        return success
        
    except Exception as e:
        print(f"❌ ERREUR: {e}")
        return False

if __name__ == "__main__":
    main()
