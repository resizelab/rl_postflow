#!/usr/bin/env python3
"""
Déployeur Progressif After Effects - RL PostFlow
Script de déploiement par étapes pour s'assurer que tout fonctionne parfaitement
"""

import sys
import os
import json
import time
import argparse
from pathlib import Path
from typing import Dict, List, Optional

# Ajouter le générateur au path
sys.path.append(str(Path(__file__).parent))
sys.path.append(str(Path(__file__).parent.parent.parent / "src"))

from generate_ae_projects_v2 import AfterEffectsGeneratorV2
from manage_exclusions import SequenceExclusionManager

class ProgressiveAEDeployer:
    """Déployeur progressif pour After Effects avec validation par étapes."""
    
    def __init__(self):
        self.generator = AfterEffectsGeneratorV2()
        self.exclusion_manager = SequenceExclusionManager()
        
        # Charger les exclusions dynamiquement
        excluded_sequences = self.exclusion_manager.load_excluded_sequences()
        available_sequences = self.exclusion_manager.get_available_sequences()
        
        # Définir séquences de test et validation
        self.test_sequence = "SQ01" if "SQ01" in available_sequences else (available_sequences[0] if available_sequences else "SQ01")
        self.validation_sequences = available_sequences[:3] if len(available_sequences) >= 3 else available_sequences
        self.excluded_sequences = list(excluded_sequences.keys())
        
        self.reports_dir = Path(__file__).parent / "deployment_reports"
        self.reports_dir.mkdir(exist_ok=True)
        
        # Afficher info sur les exclusions
        if self.excluded_sequences:
            print(f"⚠️  Séquences automatiquement exclues : {', '.join(self.excluded_sequences)}")
            for seq_id in self.excluded_sequences:
                reason = excluded_sequences.get(seq_id, "Raison inconnue")
                print(f"    • {seq_id}: {reason}")
            print()
        
    def stage_1_test_single_sequence(self, dry_run: bool = False) -> bool:
        """
        ÉTAPE 1: Test sur une seule séquence
        Valide que la méthode fonctionne parfaitement sur un cas concret
        Note: Utilise automatiquement une séquence disponible (non exclue)
        """
        print("🧪 ÉTAPE 1: TEST SUR SÉQUENCE UNIQUE")
        print("=" * 50)
        print(f"🎯 Séquence test : {self.test_sequence}")
        if self.excluded_sequences:
            print(f"⚠️  Séquences exclues : {', '.join(self.excluded_sequences)}")
        print(f"📋 Mode : {'DRY-RUN (simulation)' if dry_run else 'PRODUCTION (génération réelle)'}")
        print()
        
        try:
            # Charger les données pour vérifier la séquence
            sequence_data = self.generator.load_sequence_data()
            
            if self.test_sequence not in sequence_data:
                print(f"❌ Séquence {self.test_sequence} non trouvée dans les données")
                return False
            
            seq_info = sequence_data[self.test_sequence]
            plans = seq_info['plans']
            
            print(f"📊 Informations {self.test_sequence} :")
            print(f"   • Nom : {seq_info['name']}")
            print(f"   • Plans : {len(plans)}")
            print(f"   • Durée totale : {sum(plan['duration'] for plan in plans):.1f}s")
            
            # Vérifier plans étalonnés disponibles
            available_graded = self.generator.check_graded_plans_availability(plans)
            print(f"   • Plans étalonnés : {len(available_graded)}/{len(plans)} disponibles")
            
            print()
            
            # Exécuter la génération
            print(f"🚀 Génération {self.test_sequence}...")
            success = self.generator.generate_for_sequence(self.test_sequence, dry_run=dry_run)
            
            if success:
                print(f"✅ {self.test_sequence} généré avec succès !")
                
                if not dry_run:
                    # Valider les fichiers générés
                    self._validate_sequence_output(self.test_sequence)
                
                # Sauvegarder rapport
                self._save_stage_report("stage_1_test", {
                    'sequence': self.test_sequence,
                    'success': True,
                    'plans_count': len(plans),
                    'graded_count': len(available_graded),
                    'dry_run': dry_run,
                    'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
                })
                
                return True
            else:
                print(f"❌ Échec génération {self.test_sequence}")
                return False
                
        except Exception as e:
            print(f"❌ Erreur étape 1 : {e}")
            return False
    
    def stage_2_validation_sequences(self, dry_run: bool = False) -> bool:
        """
        ÉTAPE 2: Validation sur plusieurs séquences
        S'assure que la méthode fonctionne sur plusieurs séquences
        Note: Utilise automatiquement les séquences disponibles (non exclues)
        """
        print("\n🔍 ÉTAPE 2: VALIDATION SUR MULTIPLE SÉQUENCES")
        print("=" * 50)
        print(f"🎯 Séquences : {', '.join(self.validation_sequences)}")
        if self.excluded_sequences:
            print(f"⚠️  Séquences exclues : {', '.join(self.excluded_sequences)}")
        print(f"📋 Mode : {'DRY-RUN (simulation)' if dry_run else 'PRODUCTION (génération réelle)'}")
        print()
        
        results = {}
        
        try:
            sequence_data = self.generator.load_sequence_data()
            
            for i, seq_id in enumerate(self.validation_sequences, 1):
                print(f"📁 [{i}/3] Traitement {seq_id}...")
                
                if seq_id not in sequence_data:
                    print(f"   ❌ Séquence {seq_id} non trouvée")
                    results[seq_id] = False
                    continue
                
                seq_info = sequence_data[seq_id]
                plans = seq_info['plans']
                available_graded = self.generator.check_graded_plans_availability(plans)
                
                print(f"   📊 {len(plans)} plans, {len(available_graded)} étalonnés")
                
                # Générer la séquence
                success = self.generator.generate_for_sequence(seq_id, dry_run=dry_run)
                results[seq_id] = success
                
                if success:
                    print(f"   ✅ {seq_id} généré avec succès")
                    
                    if not dry_run:
                        self._validate_sequence_output(seq_id)
                else:
                    print(f"   ❌ Échec {seq_id}")
                
                print()
            
            # Résultats globaux
            success_count = sum(results.values())
            print(f"📊 RÉSULTATS ÉTAPE 2:")
            print(f"   Réussites : {success_count}/{len(self.validation_sequences)}")
            
            # Sauvegarder rapport
            self._save_stage_report("stage_2_validation", {
                'sequences': self.validation_sequences,
                'results': results,
                'success_count': success_count,
                'total_count': len(self.validation_sequences),
                'dry_run': dry_run,
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
            })
            
            return success_count == len(self.validation_sequences)
            
        except Exception as e:
            print(f"❌ Erreur étape 2 : {e}")
            return False
    
    def stage_3_full_deployment(self, dry_run: bool = False) -> bool:
        """
        ÉTAPE 3: Déploiement complet de toutes les séquences
        Génère tous les projets After Effects pour production
        """
        print("\n🚀 ÉTAPE 3: DÉPLOIEMENT COMPLET")
        print("=" * 50)
        print(f"📋 Mode : {'DRY-RUN (simulation)' if dry_run else 'PRODUCTION (génération réelle)'}")
        print()
        
        try:
            sequence_data = self.generator.load_sequence_data()
            all_sequences = list(sequence_data.keys())
            
            # Utiliser le gestionnaire d'exclusions pour obtenir les séquences disponibles
            available_sequences = self.exclusion_manager.get_available_sequences()
            
            print(f"🎬 Séquences à traiter : {len(available_sequences)}")
            print(f"📋 Liste : {', '.join(available_sequences[:10])}{'...' if len(available_sequences) > 10 else ''}")
            if self.excluded_sequences:
                excluded_info = self.exclusion_manager.load_excluded_sequences()
                print(f"🚫 Séquences exclues ({len(self.excluded_sequences)}) :")
                for seq_id in self.excluded_sequences:
                    reason = excluded_info.get(seq_id, "Raison inconnue")
                    print(f"    • {seq_id}: {reason}")
            
            if not dry_run:
                # Confirmer avec l'utilisateur
                confirmation = input(f"\n🔥 Générer les {len(available_sequences)} séquences disponibles ? (o/N): ")
                if confirmation.lower() not in ['o', 'oui', 'yes', 'y']:
                    print("❌ Déploiement annulé par l'utilisateur")
                    return False
            
            print(f"\n🚀 Démarrage génération batch...")
            
            results = {}
            start_time = time.time()
            
            for i, seq_id in enumerate(available_sequences, 1):
                elapsed = time.time() - start_time
                print(f"📁 [{i:02d}/{len(available_sequences)}] {seq_id} (temps écoulé: {elapsed:.1f}s)...")
                
                try:
                    success = self.generator.generate_for_sequence(seq_id, dry_run=dry_run)
                    results[seq_id] = success
                    
                    if success:
                        print(f"   ✅ {seq_id} généré")
                        if not dry_run:
                            self._validate_sequence_output(seq_id, verbose=False)
                    else:
                        print(f"   ❌ Échec {seq_id}")
                        
                except Exception as e:
                    print(f"   ❌ Erreur {seq_id} : {e}")
                    results[seq_id] = False
                
                # Progress bar simple
                progress = (i / len(available_sequences)) * 100
                print(f"   📊 Progression: {progress:.1f}% ({i}/{len(available_sequences)})")
                print()
            
            # Résultats finaux
            success_count = sum(results.values())
            total_time = time.time() - start_time
            
            print(f"🎉 DÉPLOIEMENT COMPLET TERMINÉ !")
            print(f"📊 Statistiques finales :")
            print(f"   • Réussites : {success_count}/{len(available_sequences)}")
            print(f"   • Taux de succès : {(success_count/len(available_sequences)*100):.1f}%")
            print(f"   • Temps total : {total_time:.1f}s")
            print(f"   • Moyenne par séquence : {total_time/len(available_sequences):.1f}s")
            print(f"   • Séquences exclues : {len(self.excluded_sequences)} (en cours de travail)")
            
            # Sauvegarder rapport détaillé
            self._save_stage_report("stage_3_full", {
                'total_sequences': len(available_sequences),
                'excluded_sequences': self.excluded_sequences,
                'results': results,
                'success_count': success_count,
                'total_time': total_time,
                'dry_run': dry_run,
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
            })
            
            # Afficher séquences échouées si applicable
            failed_sequences = [seq for seq, success in results.items() if not success]
            if failed_sequences:
                print(f"\n⚠️  Séquences échouées ({len(failed_sequences)}) :")
                for seq in failed_sequences:
                    print(f"   • {seq}")
            
            return success_count == len(available_sequences)
            
        except Exception as e:
            print(f"❌ Erreur étape 3 : {e}")
            return False
    
    def _validate_sequence_output(self, sequence_id: str, verbose: bool = True) -> bool:
        """Valide que les fichiers ont été générés correctement."""
        sequences_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES")
        
        # Vérifier dossier AE
        ae_dir = sequences_path / sequence_id / "_AE"
        if not ae_dir.exists():
            if verbose:
                print(f"   ⚠️  Dossier _AE manquant : {ae_dir}")
            return False
        
        # Vérifier script
        script_file = ae_dir / f"{sequence_id}_generation_script_v2.jsx"
        if not script_file.exists():
            if verbose:
                print(f"   ⚠️  Script manquant : {script_file}")
            return False
        
        # Vérifier taille script
        script_size = script_file.stat().st_size
        if script_size < 1000:  # Script trop petit
            if verbose:
                print(f"   ⚠️  Script trop petit : {script_size} bytes")
            return False
        
        if verbose:
            print(f"   ✅ Validation OK : script généré ({script_size} bytes)")
        
        return True
    
    def _save_stage_report(self, stage_name: str, data: dict):
        """Sauvegarde un rapport d'étape."""
        report_file = self.reports_dir / f"{stage_name}_{time.strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"📄 Rapport sauvegardé : {report_file}")

def main():
    """Fonction principale avec interface en ligne de commande."""
    parser = argparse.ArgumentParser(description='Déployeur progressif After Effects')
    parser.add_argument('--stage', '-s', type=int, choices=[1, 2, 3], 
                       help='Étape à exécuter (1=test, 2=validation, 3=complet)')
    parser.add_argument('--dry-run', '-d', action='store_true', 
                       help='Mode simulation (pas de génération réelle)')
    parser.add_argument('--all-stages', '-a', action='store_true',
                       help='Exécuter toutes les étapes en séquence')
    
    args = parser.parse_args()
    
    deployer = ProgressiveAEDeployer()
    
    print("🎬 DÉPLOYEUR PROGRESSIF AFTER EFFECTS")
    print("=" * 60)
    print(f"📅 {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    if args.all_stages:
        # Exécuter toutes les étapes
        print("🚀 Exécution de toutes les étapes en séquence")
        print()
        
        # Étape 1
        success_1 = deployer.stage_1_test_single_sequence(dry_run=args.dry_run)
        if not success_1:
            print("❌ Étape 1 échouée - Arrêt")
            return 1
        
        # Étape 2
        success_2 = deployer.stage_2_validation_sequences(dry_run=args.dry_run)
        if not success_2:
            print("❌ Étape 2 échouée - Arrêt")
            return 1
        
        # Étape 3
        success_3 = deployer.stage_3_full_deployment(dry_run=args.dry_run)
        if not success_3:
            print("❌ Étape 3 échouée")
            return 1
        
        print("\n🎉 TOUTES LES ÉTAPES TERMINÉES AVEC SUCCÈS !")
        return 0
    
    elif args.stage == 1:
        success = deployer.stage_1_test_single_sequence(dry_run=args.dry_run)
    elif args.stage == 2:
        success = deployer.stage_2_validation_sequences(dry_run=args.dry_run)
    elif args.stage == 3:
        success = deployer.stage_3_full_deployment(dry_run=args.dry_run)
    else:
        # Mode interactif
        print("🔧 Mode interactif - Choisissez votre étape :")
        print()
        print("   1️⃣  Étape 1 : Test sur SQ01 (recommandé pour commencer)")
        print("   2️⃣  Étape 2 : Validation sur SQ01, SQ03, SQ04")
        print("   3️⃣  Étape 3 : Déploiement complet (toutes séquences sauf SQ02)")
        print("   🔄  0 : Toutes les étapes en séquence")
        print()
        print("   ⚠️  Note : SQ02 exclue car en cours de travail graphiste")
        print()
        
        choice = input("Votre choix (0-3) : ")
        
        if choice == "0":
            # Toutes les étapes
            success_1 = deployer.stage_1_test_single_sequence(dry_run=True)  # Dry-run par défaut
            if success_1:
                success_2 = deployer.stage_2_validation_sequences(dry_run=True)
                if success_2:
                    # Demander confirmation pour étape 3
                    confirm = input("\n✅ Étapes 1-2 OK. Exécuter étape 3 en mode production ? (o/N): ")
                    if confirm.lower() in ['o', 'oui', 'yes', 'y']:
                        success_3 = deployer.stage_3_full_deployment(dry_run=False)
                        success = success_3
                    else:
                        print("✅ Arrêt après validation - Tout est prêt pour production")
                        success = True
                else:
                    success = False
            else:
                success = False
        elif choice == "1":
            success = deployer.stage_1_test_single_sequence(dry_run=True)
        elif choice == "2":
            success = deployer.stage_2_validation_sequences(dry_run=True)
        elif choice == "3":
            success = deployer.stage_3_full_deployment(dry_run=False)
        else:
            print("❌ Choix invalide")
            return 1
    
    return 0 if success else 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
