#!/usr/bin/env python3
"""
Exécuteur After Effects pour RL PostFlow
Exécute les scripts ExtendScript pour générer les projets .aep
"""

import json
import os
import sys
import subprocess
import time
from pathlib import Path
import argparse

# Ajouter src au path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

class AfterEffectsExecutor:
    """Exécuteur de scripts ExtendScript dans After Effects."""
    
    def __init__(self):
        self.base_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES")
        self.config_path = Path(__file__).parent.parent / "config" / "after_effects_mapping_gsheets.json"
        
        # Chemins After Effects possibles (exécutable principal pour scripts)
        self.ae_paths = [
            "/Applications/Adobe After Effects 2025/Adobe After Effects 2025.app/Contents/MacOS/After Effects",
            "/Applications/Adobe After Effects 2024/Adobe After Effects 2024.app/Contents/MacOS/After Effects",
            "/Applications/Adobe After Effects 2023/Adobe After Effects 2023.app/Contents/MacOS/After Effects",
            "/Applications/Adobe After Effects CC 2019/Adobe After Effects CC 2019.app/Contents/MacOS/After Effects",
            "/Applications/Adobe After Effects CC 2018/Adobe After Effects CC 2018.app/Contents/MacOS/After Effects"
        ]
        
        self.ae_executable = self.find_after_effects()
    
    def find_after_effects(self):
        """Trouve l'exécutable After Effects installé."""
        for ae_path in self.ae_paths:
            if Path(ae_path).exists():
                print(f"✅ After Effects trouvé : {ae_path}")
                return ae_path
        
        raise FileNotFoundError("❌ After Effects non trouvé. Chemins testés:\n" + 
                               "\n".join(f"  - {path}" for path in self.ae_paths))
    
    def load_sequence_data(self):
        """Charge les données de mapping des séquences."""
        if not self.config_path.exists():
            raise FileNotFoundError(f"Configuration non trouvée : {self.config_path}")
            
        with open(self.config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def execute_ae_script(self, script_file, sequence_id, timeout=300):
        """
        Exécute un script ExtendScript dans After Effects via ligne de commande.
        
        Args:
            script_file (Path): Chemin vers le script .jsx
            sequence_id (str): ID de la séquence (ex: SQ01)
            timeout (int): Timeout en secondes (default: 5min)
        
        Returns:
            bool: True si succès, False sinon
        """
        
        if not script_file.exists():
            print(f"   ❌ Script manquant : {script_file}")
            return False
        
        # Commande pour exécuter le script
        # Note: Lancer AE avec le script en paramètre
        cmd = [
            self.ae_executable,
            "-r", str(script_file)  # -r pour run script
        ]
        
        try:
            print(f"   🎬 Exécution AE pour {sequence_id}...")
            print(f"      📄 Script : {script_file.name}")
            
            start_time = time.time()
            
            # Exécuter avec timeout
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True, 
                timeout=timeout,
                cwd=script_file.parent  # Exécuter depuis le dossier du script
            )
            
            duration = time.time() - start_time
            
            if result.returncode == 0:
                print(f"   ✅ {sequence_id} : Projet AE créé avec succès ({duration:.1f}s)")
                if result.stdout:
                    print(f"      💬 Sortie AE : {result.stdout.strip()}")
                return True
            else:
                print(f"   ❌ {sequence_id} : Erreur AE (code {result.returncode})")
                if result.stderr:
                    print(f"      ⚠️  Erreur : {result.stderr.strip()}")
                if result.stdout:
                    print(f"      💬 Sortie : {result.stdout.strip()}")
                return False
                
        except subprocess.TimeoutExpired:
            print(f"   ⏰ {sequence_id} : Timeout après {timeout}s")
            return False
        except Exception as e:
            print(f"   ❌ {sequence_id} : Exception - {e}")
            return False
    
    def execute_validation_sequences(self):
        """Exécute la génération AE pour les 3 séquences de validation."""
        
        validation_sequences = ['SQ01', 'SQ02', 'SQ03']
        results = {}
        
        print("🎬 EXÉCUTION AFTER EFFECTS - MODE VALIDATION")
        print("=" * 50)
        print(f"🎯 Séquences : {', '.join(validation_sequences)}")
        print(f"⚙️  AE : {self.ae_executable}")
        print()
        
        for seq_id in validation_sequences:
            print(f"📁 Traitement de {seq_id}...")
            
            # Vérifier arborescence
            seq_path = self.base_path / seq_id
            ae_path = seq_path / "_AE"
            
            if not seq_path.exists():
                print(f"   ❌ Dossier séquence manquant : {seq_path}")
                results[seq_id] = False
                continue
                
            if not ae_path.exists():
                print(f"   ❌ Dossier _AE manquant : {ae_path}")
                results[seq_id] = False
                continue
            
            # Chercher le script ExtendScript
            script_file = ae_path / f"{seq_id}_generation_script.jsx"
            
            if not script_file.exists():
                # Essayer autre nom possible
                alt_script = ae_path / f"{seq_id}_script.jsx"
                if alt_script.exists():
                    script_file = alt_script
                else:
                    print(f"   ❌ Script ExtendScript manquant : {script_file}")
                    results[seq_id] = False
                    continue
            
            # Exécuter le script
            success = self.execute_ae_script(script_file, seq_id)
            results[seq_id] = success
            
            if success:
                # Vérifier que le projet .aep a été créé
                aep_file = ae_path / f"{seq_id}_01.aep"
                if aep_file.exists():
                    file_size = aep_file.stat().st_size / 1024  # KB
                    print(f"   🎉 Projet généré : {aep_file.name} ({file_size:.1f} KB)")
                else:
                    print(f"   ⚠️  Script exécuté mais projet .aep manquant")
            
            print()  # Ligne vide entre séquences
        
        # Rapport final
        success_count = sum(results.values())
        print(f"📊 RÉSULTATS EXÉCUTION AFTER EFFECTS")
        print(f"   Réussites : {success_count}/3")
        
        for seq_id, success in results.items():
            status = "✅" if success else "❌"
            aep_path = self.base_path / seq_id / "_AE" / f"{seq_id}_01.aep"
            size_info = ""
            if success and aep_path.exists():
                file_size = aep_path.stat().st_size / 1024
                size_info = f" ({file_size:.1f} KB)"
            print(f"   {status} {seq_id} → {aep_path.name}{size_info}")
        
        if success_count == 3:
            print(f"\n🎉 VALIDATION COMPLÈTE - Tous les projets AE générés !")
            print(f"   📂 Dossier : {self.base_path}")
            print(f"   🎬 Projets : SQ01_01.aep, SQ02_01.aep, SQ03_01.aep")
            
            # Calculer statistiques
            data = self.load_sequence_data()
            total_plans = sum(data['sequences'][seq]['plan_count'] for seq in validation_sequences if seq in data['sequences'])
            total_duration = sum(data['sequences'][seq]['duration_minutes'] for seq in validation_sequences if seq in data['sequences'])
            
            print(f"   📋 Plans total : {total_plans}")
            print(f"   ⏱️  Durée totale : {total_duration:.1f} minutes")
            
        else:
            print(f"\n⚠️  VALIDATION PARTIELLE - {3-success_count} échecs")
            print(f"   💡 Actions recommandées :")
            print(f"      1. Vérifier installation After Effects")
            print(f"      2. Contrôler permissions dossiers")
            print(f"      3. Examiner logs d'erreur AE")
        
        return results
    
    def execute_single_sequence(self, sequence_id):
        """Exécute la génération AE pour une séquence spécifique."""
        
        print(f"🎬 EXÉCUTION AFTER EFFECTS - SÉQUENCE {sequence_id}")
        print("=" * 50)
        
        seq_path = self.base_path / sequence_id
        ae_path = seq_path / "_AE"
        script_file = ae_path / f"{sequence_id}_generation_script.jsx"
        
        # Vérifications préalables
        if not seq_path.exists():
            print(f"❌ Dossier séquence manquant : {seq_path}")
            return False
            
        if not script_file.exists():
            print(f"❌ Script ExtendScript manquant : {script_file}")
            return False
        
        # Exécution
        success = self.execute_ae_script(script_file, sequence_id)
        
        if success:
            aep_file = ae_path / f"{sequence_id}_01.aep"
            if aep_file.exists():
                file_size = aep_file.stat().st_size / 1024
                print(f"\n🎉 Projet généré avec succès !")
                print(f"   📄 {aep_file} ({file_size:.1f} KB)")
            else:
                print(f"\n⚠️  Script exécuté mais projet .aep manquant")
        else:
            print(f"\n❌ Échec de l'exécution")
        
        return success
    
    def test_after_effects(self):
        """Teste l'installation After Effects avec un script simple."""
        
        print("🧪 TEST INSTALLATION AFTER EFFECTS")
        print("=" * 40)
        
        # Créer script de test simple
        test_script_content = """
// Script de test After Effects
alert("Test RL PostFlow - After Effects fonctionne !");

// Créer projet temporaire
app.newProject();
var project = app.project;

// Créer composition test
var testComp = project.items.addComp("Test_RL_PostFlow", 1920, 1080, 1.0, 10, 25);

// Sauvegarder dans temp
var tempFile = new File("/tmp/ae_test_rl_postflow.aep");
project.save(tempFile);

alert("Test terminé - Projet sauvé : " + tempFile.fsName);
"""
        
        test_script_path = Path("/tmp/ae_test_rl_postflow.jsx")
        
        try:
            # Écrire script de test
            with open(test_script_path, 'w') as f:
                f.write(test_script_content)
            
            print(f"📄 Script de test créé : {test_script_path}")
            
            # Exécuter test
            cmd = [self.ae_executable, "-script", str(test_script_path)]
            
            print("🎬 Exécution du test...")
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print("✅ After Effects fonctionne correctement !")
                if result.stdout:
                    print(f"💬 Sortie : {result.stdout.strip()}")
                
                # Vérifier fichier test
                test_aep = Path("/tmp/ae_test_rl_postflow.aep")
                if test_aep.exists():
                    print(f"✅ Projet test créé : {test_aep}")
                    test_aep.unlink()  # Supprimer
                
                return True
            else:
                print(f"❌ Erreur test AE (code {result.returncode})")
                if result.stderr:
                    print(f"⚠️  Erreur : {result.stderr.strip()}")
                return False
                
        except Exception as e:
            print(f"❌ Exception test : {e}")
            return False
        finally:
            # Nettoyer
            if test_script_path.exists():
                test_script_path.unlink()

def main():
    """Fonction principale."""
    
    parser = argparse.ArgumentParser(description='Exécuteur After Effects pour RL PostFlow')
    parser.add_argument('--validation', '-v', action='store_true', 
                        help='Exécuter génération pour les 3 séquences de validation')
    parser.add_argument('--sequence', '-s', help='Exécuter génération pour une séquence spécifique')
    parser.add_argument('--test', '-t', action='store_true', help='Tester installation After Effects')
    parser.add_argument('--timeout', type=int, default=300, help='Timeout en secondes (default: 300)')
    
    args = parser.parse_args()
    
    try:
        executor = AfterEffectsExecutor()
        
        if args.test:
            # Mode test
            executor.test_after_effects()
            
        elif args.validation:
            # Mode validation (3 séquences)
            executor.execute_validation_sequences()
            
        elif args.sequence:
            # Mode séquence unique
            executor.execute_single_sequence(args.sequence)
            
        else:
            print("❓ Spécifiez --validation, --sequence ou --test")
            
    except Exception as e:
        print(f"❌ Erreur : {e}")

if __name__ == "__main__":
    main()
