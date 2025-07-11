#!/usr/bin/env python3
"""
Déployeur Complet After Effects 2025 pour RL PostFlow
Combine création d'arborescence + exécution scripts + validation
"""

import json
import os
import sys
import shutil
import time
from pathlib import Path
import argparse

# Ajouter src au path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

class CompleteAEDeployer:
    """Déployeur complet pour After Effects 2025."""
    
    def __init__(self):
        self.sequences_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES")
        self.template_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX/_EB/UNDLM_00XXX")
        self.config_path = Path(__file__).parent.parent / "config" / "after_effects_mapping_gsheets.json"
        self.ae_scripts_path = Path(__file__).parent.parent / "ae_scripts"  # Dossier local
        
    def load_sequence_data(self):
        """Charge les données de mapping des séquences."""
        if not self.config_path.exists():
            raise FileNotFoundError(f"Configuration non trouvée : {self.config_path}")
            
        with open(self.config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def create_sequence_folder(self, sequence_id, seq_info):
        """
        Crée l'arborescence complète pour une séquence avec template.
        
        Structure créée:
        SEQUENCES/SQxx/
        ├── _AE/                    # Projets After Effects
        ├── _PS/                    # Dossier Photoshop (nouveau)
        └── _EB/                    # Plans individuels
            ├── UNDLM_00001/        # Nom complet du plan
            │   └── [arborescence template copiée]
            │   └── EB_UNDLM_00001.psd (renommé)
            ├── UNDLM_00002/
            └── ...
        """
        
        seq_path = self.sequences_path / sequence_id
        
        try:
            # Créer dossiers principaux
            ae_folder = seq_path / "_AE"
            ps_folder = seq_path / "_PS"  # Nouveau dossier _PS
            eb_folder = seq_path / "_EB"
            
            ae_folder.mkdir(parents=True, exist_ok=True)
            ps_folder.mkdir(parents=True, exist_ok=True)  # Créer _PS
            eb_folder.mkdir(parents=True, exist_ok=True)
            
            print(f"   📁 Dossiers principaux créés : _AE, _PS, _EB")
            
            # Vérifier que le template existe
            if not self.template_path.exists():
                print(f"   ❌ Template manquant : {self.template_path}")
                return False
            
            # Créer dossiers plans individuels avec template
            plan_numbers = seq_info['plans']
            created_count = 0
            
            for plan_num in plan_numbers:
                # Nom complet du plan (ex: UNDLM_00001)
                plan_name = f"UNDLM_{plan_num:05d}"
                plan_folder = eb_folder / plan_name
                
                # Copier l'arborescence du template
                if self.copy_template_structure(plan_folder, plan_name):
                    created_count += 1
                else:
                    print(f"   ⚠️  Échec copie template pour {plan_name}")
            
            print(f"   ✅ Plans créés : {created_count}/{len(plan_numbers)} avec template")
            return created_count == len(plan_numbers)
            
        except Exception as e:
            print(f"   ❌ Erreur création arborescence : {e}")
            return False
    
    def copy_template_structure(self, plan_folder, plan_name):
        """
        Copie l'arborescence du template vers le dossier plan et renomme le PSD.
        
        Args:
            plan_folder (Path): Dossier destination (ex: /SEQUENCES/SQ01/_EB/UNDLM_00001)
            plan_name (str): Nom du plan (ex: UNDLM_00001)
        """
        
        try:
            # Copier tout le contenu du template
            if plan_folder.exists():
                shutil.rmtree(plan_folder)  # Nettoyer si existe déjà
            
            shutil.copytree(self.template_path, plan_folder)
            
            # Trouver et renommer le fichier PSD template
            template_psd = plan_folder / "EB_UNDLM_00XXX.psd"
            target_psd = plan_folder / f"EB_{plan_name}.psd"
            
            if template_psd.exists():
                template_psd.rename(target_psd)
                # print(f"      📄 PSD renommé : EB_{plan_name}.psd")
            else:
                print(f"      ⚠️  PSD template manquant dans {plan_name}")
            
            return True
            
        except Exception as e:
            print(f"      ❌ Erreur copie template {plan_name} : {e}")
            return False
    
    def copy_script_to_ae_folder(self, sequence_id):
        """Copie le script ExtendScript dans notre dossier ae_scripts pour accès facile."""
        
        # Script source
        source_script = self.sequences_path / sequence_id / "_AE" / f"{sequence_id}_generation_script.jsx"
        
        if not source_script.exists():
            print(f"   ❌ Script source manquant : {source_script}")
            return False
        
        # Créer dossier ae_scripts si nécessaire
        self.ae_scripts_path.mkdir(exist_ok=True)
        
        # Destination dans notre dossier ae_scripts
        dest_script = self.ae_scripts_path / f"RL_PostFlow_{sequence_id}_GENERATION.jsx"
        
        try:
            shutil.copy2(source_script, dest_script)
            print(f"   📋 Script copié : {dest_script.name}")
            return True
        except Exception as e:
            print(f"   ❌ Erreur copie script : {e}")
            return False
    
    def validate_project_output(self, sequence_id):
        """Valide que le projet .aep a été créé."""
        
        aep_file = self.sequences_path / sequence_id / "_AE" / f"{sequence_id}_01.aep"
        
        if aep_file.exists():
            size_mb = aep_file.stat().st_size / (1024 * 1024)
            print(f"   ✅ Projet validé : {aep_file.name} ({size_mb:.1f} MB)")
            return True
        else:
            print(f"   ⚠️  Projet manquant : {aep_file.name}")
            return False
    
    def deploy_validation_sequences(self):
        """
        Déploie complètement les 3 séquences de validation :
        1. Crée l'arborescence de dossiers
        2. Copie les scripts vers AE Scripts pour exécution manuelle
        3. Fournit instructions pour l'équipe
        """
        
        validation_sequences = ['SQ01', 'SQ02', 'SQ03']
        
        print("🚀 DÉPLOIEMENT COMPLET AFTER EFFECTS 2025 - VALIDATION")
        print("=" * 60)
        
        try:
            data = self.load_sequence_data()
        except Exception as e:
            print(f"❌ Erreur chargement données : {e}")
            return {}
        
        results = {}
        
        for seq_id in validation_sequences:
            if seq_id not in data['sequences']:
                print(f"\n❌ {seq_id} : Séquence inconnue")
                results[seq_id] = False
                continue
                
            seq_info = data['sequences'][seq_id]
            print(f"\n📁 Déploiement de {seq_id} ({seq_info['name']})...")
            print(f"   📋 Plans : {seq_info['plan_count']} ({seq_info['duration_minutes']:.1f}min)")
            
            # 1. Créer arborescence
            if not self.create_sequence_folder(seq_id, seq_info):
                results[seq_id] = False
                continue
            
            # 2. Copier script vers AE Scripts
            if not self.copy_script_to_ae_folder(seq_id):
                results[seq_id] = False
                continue
            
            # 3. Vérifier si projet déjà existant
            project_exists = self.validate_project_output(seq_id)
            
            results[seq_id] = True
            print(f"   ✅ {seq_id} prêt pour génération AE")
        
        # Rapport final
        success_count = sum(results.values())
        print(f"\n📊 RÉSULTATS DÉPLOIEMENT")
        print(f"   Préparation : {success_count}/3 réussies")
        
        for seq_id, success in results.items():
            status = "✅" if success else "❌"
            print(f"   {status} {seq_id}")
        
        if success_count == 3:
            print(f"\n🎉 DÉPLOIEMENT COMPLET - Prêt pour génération AE !")
            print(f"\n📂 STRUCTURE CRÉÉE :")
            print(f"   {self.sequences_path}/")
            print(f"   ├── SQ01/ (_AE, _PS, _EB)")
            print(f"   │   └── _EB/ (34 plans : UNDLM_00001 à UNDLM_00034)")
            print(f"   ├── SQ02/ (_AE, _PS, _EB)")
            print(f"   │   └── _EB/ (39 plans : UNDLM_00035 à UNDLM_00073)")
            print(f"   └── SQ03/ (_AE, _PS, _EB)")
            print(f"       └── _EB/ (20 plans : UNDLM_00074 à UNDLM_00093)")
            
            print(f"\n📋 CHAQUE PLAN CONTIENT :")
            print(f"   • Arborescence template complète copiée")
            print(f"   • Fichier PSD renommé (ex: EB_UNDLM_00001.psd)")
            print(f"   • Structure prête pour workflow animation")
            
            print(f"\n🎬 SCRIPTS AFTER EFFECTS DISPONIBLES :")
            print(f"   {self.ae_scripts_path}/")
            print(f"   ├── RL_PostFlow_SQ01_GENERATION.jsx")
            print(f"   ├── RL_PostFlow_SQ02_GENERATION.jsx")
            print(f"   └── RL_PostFlow_SQ03_GENERATION.jsx")
            
            print(f"\n📋 INSTRUCTIONS POUR L'ÉQUIPE :")
            print(f"   1. Ouvrir After Effects 2025")
            print(f"   2. Menu : Fichier > Scripts > Exécuter le fichier de script...")
            print(f"   3. Naviguer vers : {self.ae_scripts_path}/")
            print(f"   4. Sélectionner : RL_PostFlow_SQ01_GENERATION.jsx")
            print(f"   5. Attendre la génération automatique (~2-3min)")
            print(f"   6. Vérifier le projet SQ01_01.aep créé")
            print(f"   7. Répéter pour SQ02 et SQ03")
            
            print(f"\n🎯 VALIDATION ATTENDUE :")
            print(f"   • 3 projets .aep générés (SQ01_01.aep, SQ02_01.aep, SQ03_01.aep)")
            print(f"   • 93 plans importés au total (montage + étalonnage)")
            print(f"   • Switch Edit/Graded fonctionnel")
            print(f"   • Durée totale : ~7.8 minutes")
            
        else:
            print(f"\n⚠️  DÉPLOIEMENT PARTIEL - {3-success_count} échecs")
            print(f"   Action recommandée : Vérifier les erreurs ci-dessus")
        
        return results
    
    def deploy_single_sequence(self, sequence_id):
        """Déploie une seule séquence."""
        
        print(f"🚀 DÉPLOIEMENT {sequence_id}")
        print("=" * 40)
        
        try:
            data = self.load_sequence_data()
        except Exception as e:
            print(f"❌ Erreur chargement données : {e}")
            return False
        
        if sequence_id not in data['sequences']:
            print(f"❌ Séquence inconnue : {sequence_id}")
            return False
        
        seq_info = data['sequences'][sequence_id]
        print(f"📁 {sequence_id} ({seq_info['name']}) - {seq_info['plan_count']} plans")
        
        # Créer arborescence
        if not self.create_sequence_folder(sequence_id, seq_info):
            return False
        
        # Copier script
        if not self.copy_script_to_ae_folder(sequence_id):
            return False
        
        # Valider
        project_exists = self.validate_project_output(sequence_id)
        
        print(f"\n✅ {sequence_id} prêt pour génération AE")
        print(f"   📄 Script : {self.ae_scripts_path}/RL_PostFlow_{sequence_id}_GENERATION.jsx")
        print(f"   🎯 Action : AE > Fichier > Scripts > Exécuter le fichier de script...")
        
        return True

def main():
    """Fonction principale."""
    
    parser = argparse.ArgumentParser(description="Déployeur complet After Effects 2025 - RL PostFlow")
    parser.add_argument('--validation', action='store_true',
                        help='Déployer les 3 séquences de validation (SQ01, SQ02, SQ03)')
    parser.add_argument('--sequence', '-s',
                        help='Déployer une séquence spécifique (ex: SQ01)')
    parser.add_argument('--all', action='store_true',
                        help='Déployer toutes les séquences disponibles')
    
    args = parser.parse_args()
    
    deployer = CompleteAEDeployer()
    
    try:
        if args.validation:
            # Déployer validation (3 séquences)
            deployer.deploy_validation_sequences()
            
        elif args.sequence:
            # Déployer une séquence
            deployer.deploy_single_sequence(args.sequence)
            
        elif args.all:
            # Déployer toutes les séquences
            data = deployer.load_sequence_data()
            all_sequences = list(data['sequences'].keys())
            
            print(f"🚀 DÉPLOIEMENT COMPLET - {len(all_sequences)} SÉQUENCES")
            print("=" * 60)
            
            success_count = 0
            for seq_id in all_sequences:
                if deployer.deploy_single_sequence(seq_id):
                    success_count += 1
                print()  # Séparateur
            
            print(f"📊 Déploiement global : {success_count}/{len(all_sequences)} réussies")
            
        else:
            print("❓ Spécifiez --validation, --sequence, ou --all")
            print("   Exemples :")
            print("   python scripts/deploy_ae_complete.py --validation")
            print("   python scripts/deploy_ae_complete.py --sequence SQ01")
            print("   python scripts/deploy_ae_complete.py --all")
            
    except Exception as e:
        print(f"❌ Erreur : {e}")

if __name__ == "__main__":
    main()
