#!/usr/bin/env python3
"""
Script de Validation Pre-Déploiement After Effects
Vérifie que tout est prêt avant le déploiement des séquences
"""

import sys
import os
import json
import time
from pathlib import Path
from typing import Dict, List, Tuple

# Ajouter le générateur au path
sys.path.append(str(Path(__file__).parent))

from generate_ae_projects_v2 import AfterEffectsGeneratorV2

class PreDeploymentValidator:
    """Validateur pré-déploiement pour After Effects."""
    
    def __init__(self):
        self.generator = AfterEffectsGeneratorV2()
        self.test_sequences = ["SQ01", "SQ02", "SQ03"]
        
    def validate_environment(self) -> bool:
        """Valide l'environnement de déploiement."""
        print("🔍 VALIDATION ENVIRONNEMENT")
        print("=" * 40)
        
        checks = []
        
        # 1. Vérifier chemins sources
        sequences_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES")
        edit_path = Path("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS")
        grading_path = Path("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS")
        config_path = Path(__file__).parent.parent.parent / "config" / "after_effects_mapping_gsheets.json"
        
        print("📁 Vérification des chemins...")
        
        if sequences_path.exists():
            print(f"   ✅ Dossier séquences : {sequences_path}")
            checks.append(True)
        else:
            print(f"   ❌ Dossier séquences manquant : {sequences_path}")
            checks.append(False)
        
        if edit_path.exists():
            edit_files = list(edit_path.glob("UNDLM_*.mov"))
            print(f"   ✅ Dossier EDIT : {len(edit_files)} fichiers .mov")
            checks.append(True)
        else:
            print(f"   ❌ Dossier EDIT manquant : {edit_path}")
            checks.append(False)
        
        if grading_path.exists():
            graded_files = list(grading_path.glob("UNDLM_*.mov"))
            print(f"   ✅ Dossier GRADING : {len(graded_files)} fichiers .mov")
            checks.append(True)
        else:
            print(f"   ❌ Dossier GRADING manquant : {grading_path}")
            checks.append(False)
        
        if config_path.exists():
            print(f"   ✅ Configuration : {config_path}")
            checks.append(True)
        else:
            print(f"   ❌ Configuration manquante : {config_path}")
            checks.append(False)
        
        # 2. Vérifier droits d'écriture
        print("\n🔐 Vérification des droits...")
        
        try:
            test_dir = sequences_path / "_TEST_WRITE"
            test_dir.mkdir(exist_ok=True)
            test_file = test_dir / "test.txt"
            test_file.write_text("test")
            test_file.unlink()
            test_dir.rmdir()
            print("   ✅ Droits d'écriture OK")
            checks.append(True)
        except Exception as e:
            print(f"   ❌ Pas de droits d'écriture : {e}")
            checks.append(False)
        
        success_rate = sum(checks) / len(checks) * 100
        print(f"\n📊 Environnement : {success_rate:.1f}% OK ({sum(checks)}/{len(checks)})")
        
        return all(checks)
    
    def validate_data_integrity(self) -> bool:
        """Valide l'intégrité des données."""
        print("\n📊 VALIDATION DONNÉES")
        print("=" * 40)
        
        try:
            # Charger les données
            sequence_data = self.generator.load_sequence_data()
            
            total_sequences = len(sequence_data)
            total_plans = sum(len(seq['plans']) for seq in sequence_data.values())
            
            print(f"📋 Données chargées :")
            print(f"   • Séquences : {total_sequences}")
            print(f"   • Plans total : {total_plans}")
            
            # Vérifier cohérence des données
            print(f"\n🔍 Vérification cohérence...")
            
            issues = []
            
            for seq_id, seq_info in sequence_data.items():
                plans = seq_info['plans']
                
                # Vérifier structure séquence
                if not seq_info.get('name'):
                    issues.append(f"{seq_id}: nom manquant")
                
                if not plans:
                    issues.append(f"{seq_id}: aucun plan")
                
                # Vérifier plans
                for plan in plans:
                    if not plan.get('plan_num'):
                        issues.append(f"{seq_id}: plan sans numéro")
                    
                    if not plan.get('duration') or plan['duration'] <= 0:
                        issues.append(f"{seq_id}: plan {plan.get('plan_num', '?')} durée invalide")
            
            if issues:
                print(f"   ⚠️  {len(issues)} problèmes détectés :")
                for issue in issues[:5]:  # Afficher max 5
                    print(f"      • {issue}")
                if len(issues) > 5:
                    print(f"      ... et {len(issues) - 5} autres")
                return False
            else:
                print(f"   ✅ Données cohérentes")
                return True
                
        except Exception as e:
            print(f"   ❌ Erreur validation données : {e}")
            return False
    
    def validate_source_files(self) -> Tuple[bool, Dict]:
        """Valide la disponibilité des fichiers sources."""
        print(f"\n📹 VALIDATION FICHIERS SOURCES")
        print("=" * 40)
        
        try:
            sequence_data = self.generator.load_sequence_data()
            
            # Analyser quelques séquences test
            test_results = {}
            
            for seq_id in self.test_sequences:
                if seq_id not in sequence_data:
                    continue
                    
                print(f"\n🎬 Analyse {seq_id}...")
                plans = sequence_data[seq_id]['plans']
                
                # Vérifier fichiers EDIT
                edit_available = []
                graded_available = []
                
                for plan in plans:
                    plan_num = plan['plan_num']
                    
                    # Fichier EDIT
                    edit_file = Path(f"/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_{plan_num:05d}.mov")
                    if edit_file.exists():
                        edit_available.append(plan_num)
                    
                    # Fichier GRADED
                    graded_file = Path(f"/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_{plan_num:05d}.mov")
                    if graded_file.exists():
                        graded_available.append(plan_num)
                
                edit_rate = len(edit_available) / len(plans) * 100
                graded_rate = len(graded_available) / len(plans) * 100
                
                print(f"   📄 Plans EDIT : {len(edit_available)}/{len(plans)} ({edit_rate:.1f}%)")
                print(f"   🎨 Plans GRADED : {len(graded_available)}/{len(plans)} ({graded_rate:.1f}%)")
                
                test_results[seq_id] = {
                    'total_plans': len(plans),
                    'edit_available': len(edit_available),
                    'graded_available': len(graded_available),
                    'edit_rate': edit_rate,
                    'graded_rate': graded_rate
                }
            
            # Résultats globaux
            print(f"\n📊 RÉSUMÉ FICHIERS SOURCES :")
            for seq_id, results in test_results.items():
                print(f"   {seq_id}: EDIT {results['edit_rate']:.0f}% | GRADED {results['graded_rate']:.0f}%")
            
            # Considérer comme OK si au moins 80% des fichiers EDIT sont présents
            min_edit_rate = min(r['edit_rate'] for r in test_results.values()) if test_results else 0
            
            if min_edit_rate >= 80:
                print(f"   ✅ Fichiers sources OK (minimum {min_edit_rate:.0f}%)")
                return True, test_results
            else:
                print(f"   ⚠️  Fichiers sources insuffisants (minimum {min_edit_rate:.0f}%)")
                return False, test_results
                
        except Exception as e:
            print(f"   ❌ Erreur validation fichiers : {e}")
            return False, {}
    
    def run_dry_run_test(self) -> bool:
        """Exécute un test dry-run sur SQ02."""
        print(f"\n🧪 TEST DRY-RUN SQ02")
        print("=" * 40)
        
        try:
            print("🚀 Génération test SQ02 (simulation)...")
            success = self.generator.generate_for_sequence("SQ02", dry_run=True)
            
            if success:
                print("   ✅ Test dry-run réussi")
                
                # Vérifier que le script aurait été généré
                script_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ02/_AE/SQ02_generation_script_v2.jsx")
                if script_path.exists():
                    script_size = script_path.stat().st_size
                    print(f"   ✅ Script généré : {script_size} bytes")
                else:
                    print("   ⚠️  Script non trouvé (normal en dry-run)")
                
                return True
            else:
                print("   ❌ Test dry-run échoué")
                return False
                
        except Exception as e:
            print(f"   ❌ Erreur test dry-run : {e}")
            return False
    
    def generate_validation_report(self) -> Dict:
        """Génère un rapport de validation complet."""
        print(f"\n📋 GÉNÉRATION RAPPORT VALIDATION")
        print("=" * 40)
        
        # Exécuter toutes les validations
        env_ok = self.validate_environment()
        data_ok = self.validate_data_integrity()
        sources_ok, sources_details = self.validate_source_files()
        dryrun_ok = self.run_dry_run_test()
        
        # Calculer score global
        checks = [env_ok, data_ok, sources_ok, dryrun_ok]
        global_score = sum(checks) / len(checks) * 100
        
        report = {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'environment': env_ok,
            'data_integrity': data_ok,
            'source_files': sources_ok,
            'dry_run_test': dryrun_ok,
            'global_score': global_score,
            'ready_for_deployment': global_score >= 75,
            'source_files_details': sources_details
        }
        
        # Afficher résultats
        print(f"\n🎯 RAPPORT FINAL :")
        print(f"   🌐 Environnement : {'✅' if env_ok else '❌'}")
        print(f"   📊 Données : {'✅' if data_ok else '❌'}")
        print(f"   📹 Fichiers sources : {'✅' if sources_ok else '❌'}")
        print(f"   🧪 Test dry-run : {'✅' if dryrun_ok else '❌'}")
        print(f"   📈 Score global : {global_score:.1f}%")
        
        if report['ready_for_deployment']:
            print(f"\n🚀 ✅ PRÊT POUR DÉPLOIEMENT !")
        else:
            print(f"\n⚠️  ❌ PAS PRÊT - Corriger les problèmes d'abord")
        
        # Sauvegarder rapport
        reports_dir = Path(__file__).parent / "validation_reports"
        reports_dir.mkdir(exist_ok=True)
        report_file = reports_dir / f"pre_deployment_validation_{time.strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"📄 Rapport sauvegardé : {report_file}")
        
        return report

def main():
    """Fonction principale."""
    import time
    
    print("🔍 VALIDATION PRÉ-DÉPLOIEMENT AFTER EFFECTS")
    print("=" * 60)
    print(f"📅 {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    validator = PreDeploymentValidator()
    report = validator.generate_validation_report()
    
    return 0 if report['ready_for_deployment'] else 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
