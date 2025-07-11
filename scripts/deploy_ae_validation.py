#!/usr/bin/env python3
"""
Déployeur Complet After Effects pour RL PostFlow
Orchestre la création d'arborescence + exécution AE + validation
"""

import json
import os
import sys
import time
from pathlib import Path
import argparse

# Ajouter src au path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

# Importer nos modules
from create_folder_structure import SequenceFolderCreator
from execute_ae_projects import AfterEffectsExecutor

class AEValidationDeployer:
    """Déployeur complet pour validation After Effects."""
    
    def __init__(self):
        self.folder_creator = SequenceFolderCreator()
        self.ae_executor = AfterEffectsExecutor()
        self.validation_sequences = ['SQ01', 'SQ02', 'SQ03']
        
    def deploy_validation_sequences(self):
        """
        Déploie complètement les 3 séquences de validation :
        1. Crée l'arborescence de dossiers
        2. Exécute les scripts ExtendScript
        3. Valide les projets .aep générés
        """
        
        print("🚀 DÉPLOIEMENT VALIDATION AFTER EFFECTS")
        print("=" * 50)
        print(f"🎯 Séquences : {', '.join(self.validation_sequences)}")
        print(f"📅 {time.strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        results = {
            'arborescence': {},
            'execution_ae': {},
            'validation': {}
        }
        
        # ÉTAPE 1: Créer l'arborescence de dossiers
        print("📁 ÉTAPE 1/3 : CRÉATION ARBORESCENCE")
        print("-" * 30)
        
        try:
            arbo_results = self.folder_creator.create_sequence_folders(self.validation_sequences)
            results['arborescence'] = arbo_results
            
            success_arbo = sum(arbo_results.values())
            if success_arbo == 3:
                print("✅ Arborescence complète - Passage à l'étape 2")
            else:
                print(f"⚠️  Arborescence partielle ({success_arbo}/3) - Poursuite quand même")
            
        except Exception as e:
            print(f"❌ Erreur arborescence : {e}")
            return results
        
        print()
        
        # ÉTAPE 2: Tester After Effects
        print("🧪 ÉTAPE 2a/3 : TEST AFTER EFFECTS")
        print("-" * 30)
        
        try:
            ae_test_ok = self.ae_executor.test_after_effects()
            if not ae_test_ok:
                print("❌ Test After Effects échoué - Arrêt du déploiement")
                return results
            print("✅ After Effects opérationnel - Passage à l'exécution")
            
        except Exception as e:
            print(f"❌ Erreur test AE : {e}")
            return results
        
        print()
        
        # ÉTAPE 2b: Exécuter scripts ExtendScript
        print("🎬 ÉTAPE 2b/3 : EXÉCUTION AFTER EFFECTS")
        print("-" * 30)
        
        try:
            ae_results = self.ae_executor.execute_validation_sequences()
            results['execution_ae'] = ae_results
            
            success_ae = sum(ae_results.values())
            if success_ae == 3:
                print("✅ Génération AE complète - Passage à la validation")
            else:
                print(f"⚠️  Génération AE partielle ({success_ae}/3)")
            
        except Exception as e:
            print(f"❌ Erreur exécution AE : {e}")
            return results
        
        print()
        
        # ÉTAPE 3: Validation finale
        print("🔍 ÉTAPE 3/3 : VALIDATION FINALE")
        print("-" * 30)
        
        try:
            validation_results = self.validate_generated_projects()
            results['validation'] = validation_results
            
        except Exception as e:
            print(f"❌ Erreur validation : {e}")
            return results
        
        # RAPPORT FINAL
        self.generate_final_report(results)
        
        return results
    
    def validate_generated_projects(self):
        """Valide que les projets .aep ont été correctement générés."""
        
        validation_results = {}
        
        for seq_id in self.validation_sequences:
            seq_path = self.folder_creator.base_path / seq_id
            ae_path = seq_path / "_AE"
            aep_file = ae_path / f"{seq_id}_01.aep"
            
            checks = {
                'dossier_existe': seq_path.exists(),
                'dossier_ae_existe': ae_path.exists(),
                'projet_aep_existe': aep_file.exists(),
                'taille_valide': False,
                'recent': False
            }
            
            if aep_file.exists():
                # Vérifier taille (doit être > 1KB)
                file_size = aep_file.stat().st_size
                checks['taille_valide'] = file_size > 1024
                
                # Vérifier que c'est récent (< 1h)
                file_age = time.time() - aep_file.stat().st_mtime
                checks['recent'] = file_age < 3600
            
            all_valid = all(checks.values())
            validation_results[seq_id] = {
                'valid': all_valid,
                'checks': checks,
                'file_size': aep_file.stat().st_size if aep_file.exists() else 0
            }
            
            # Affichage
            status = "✅" if all_valid else "❌"
            print(f"{status} {seq_id}")
            
            for check_name, result in checks.items():
                check_status = "✅" if result else "❌"
                print(f"    {check_status} {check_name}")
            
            if aep_file.exists():
                size_kb = aep_file.stat().st_size / 1024
                print(f"    📄 {aep_file.name} ({size_kb:.1f} KB)")
        
        return validation_results
    
    def generate_final_report(self, results):
        """Génère le rapport final de déploiement."""
        
        print("\n" + "=" * 60)
        print("📊 RAPPORT FINAL - DÉPLOIEMENT VALIDATION AE")
        print("=" * 60)
        
        # Statistiques par étape
        arbo_success = sum(results['arborescence'].values()) if results['arborescence'] else 0
        ae_success = sum(results['execution_ae'].values()) if results['execution_ae'] else 0
        val_success = sum(r['valid'] for r in results['validation'].values()) if results['validation'] else 0
        
        print(f"📁 Arborescence : {arbo_success}/3")
        print(f"🎬 Exécution AE : {ae_success}/3")
        print(f"🔍 Validation : {val_success}/3")
        
        # Résultat global
        if arbo_success == 3 and ae_success == 3 and val_success == 3:
            print("\n🎉 DÉPLOIEMENT VALIDATION RÉUSSI !")
            print("✅ Tous les projets After Effects ont été générés avec succès")
            
            # Informations des projets
            base_path = self.folder_creator.base_path
            print(f"\n📂 Projets générés :")
            for seq_id in self.validation_sequences:
                aep_file = base_path / seq_id / "_AE" / f"{seq_id}_01.aep"
                if aep_file.exists():
                    size_kb = aep_file.stat().st_size / 1024
                    print(f"   🎬 {aep_file} ({size_kb:.1f} KB)")
            
            # Calculer statistiques totales
            try:
                data = self.folder_creator.load_sequence_data()
                total_plans = sum(data['sequences'][seq]['plan_count'] for seq in self.validation_sequences if seq in data['sequences'])
                total_duration = sum(data['sequences'][seq]['duration_minutes'] for seq in self.validation_sequences if seq in data['sequences'])
                
                print(f"\n📋 Statistiques validation :")
                print(f"   • Plans total : {total_plans}")
                print(f"   • Durée totale : {total_duration:.1f} minutes")
                print(f"   • Séquences : {', '.join(self.validation_sequences)}")
                
            except Exception as e:
                print(f"⚠️  Impossible de calculer les statistiques : {e}")
            
            print(f"\n💡 Prochaines étapes :")
            print(f"   1. Ouvrir les projets .aep dans After Effects")
            print(f"   2. Vérifier import des plans et switch Edit/Graded")
            print(f"   3. Valider le workflow avec l'équipe")
            print(f"   4. Déployer sur toutes les séquences (SQ01→SQ28)")
            
        else:
            print("\n⚠️  DÉPLOIEMENT PARTIEL")
            print("❌ Certaines étapes ont échoué")
            
            # Détail des échecs
            failed_sequences = []
            for seq_id in self.validation_sequences:
                arbo_ok = results['arborescence'].get(seq_id, False)
                ae_ok = results['execution_ae'].get(seq_id, False)
                val_ok = results['validation'].get(seq_id, {}).get('valid', False)
                
                if not (arbo_ok and ae_ok and val_ok):
                    failed_sequences.append({
                        'seq_id': seq_id,
                        'arbo': arbo_ok,
                        'ae': ae_ok,
                        'val': val_ok
                    })
            
            print(f"\n🔧 Séquences à corriger :")
            for failure in failed_sequences:
                seq_id = failure['seq_id']
                print(f"   ❌ {seq_id}:")
                if not failure['arbo']:
                    print(f"      📁 Arborescence manquante")
                if not failure['ae']:
                    print(f"      🎬 Exécution AE échouée")
                if not failure['val']:
                    print(f"      🔍 Validation échouée")
            
            print(f"\n💡 Actions recommandées :")
            print(f"   1. Vérifier les logs d'erreur ci-dessus")
            print(f"   2. Corriger les problèmes identifiés")
            print(f"   3. Relancer le déploiement")
        
        # Sauvegarder rapport
        self.save_deployment_report(results)
    
    def save_deployment_report(self, results):
        """Sauvegarde le rapport de déploiement en JSON."""
        
        report = {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'sequences': self.validation_sequences,
            'results': results,
            'summary': {
                'arborescence_success': sum(results['arborescence'].values()) if results['arborescence'] else 0,
                'execution_success': sum(results['execution_ae'].values()) if results['execution_ae'] else 0,
                'validation_success': sum(r['valid'] for r in results['validation'].values()) if results['validation'] else 0,
                'overall_success': all([
                    sum(results['arborescence'].values()) == 3 if results['arborescence'] else False,
                    sum(results['execution_ae'].values()) == 3 if results['execution_ae'] else False,
                    sum(r['valid'] for r in results['validation'].values()) == 3 if results['validation'] else False
                ])
            }
        }
        
        report_path = Path(__file__).parent.parent / "logs" / f"ae_validation_deployment_{time.strftime('%Y%m%d_%H%M%S')}.json"
        report_path.parent.mkdir(exist_ok=True)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Rapport sauvegardé : {report_path}")

def main():
    """Fonction principale."""
    
    parser = argparse.ArgumentParser(description='Déployeur complet After Effects - Mode Validation')
    parser.add_argument('--dry-run', action='store_true', help='Simulation sans exécution réelle')
    
    args = parser.parse_args()
    
    if args.dry_run:
        print("🧪 MODE SIMULATION - Aucune action réelle")
        print("(Utilisez sans --dry-run pour exécution réelle)")
        return
    
    try:
        deployer = AEValidationDeployer()
        results = deployer.deploy_validation_sequences()
        
        # Code de sortie basé sur le succès
        overall_success = results.get('summary', {}).get('overall_success', False) if 'summary' in str(results) else False
        exit_code = 0 if overall_success else 1
        sys.exit(exit_code)
        
    except Exception as e:
        print(f"❌ Erreur critique : {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
