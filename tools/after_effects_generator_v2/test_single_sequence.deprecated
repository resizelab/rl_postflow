#!/usr/bin/env python3
"""
Test d'une Séquence Unique - Génération Réelle pour Tests
Génère réellement les fichiers pour une séquence afin de tester le script AE
"""

import sys
import os
from pathlib import Path
import json
from datetime import datetime

# Ajouter le chemin parent pour les imports
sys.path.append(str(Path(__file__).parent))

from platform_detector import PlatformPathManager
from generate_ae_projects_v2 import AfterEffectsGeneratorV2
from manage_exclusions import SequenceExclusionManager

class SequenceTestManager:
    """Gestionnaire pour tester une séquence spécifique."""
    
    def __init__(self):
        self.platform_manager = PlatformPathManager()
        self.exclusion_manager = SequenceExclusionManager()
        self.generator = None
        
        # Vérifier que les chemins sont OK
        paths_ok, _ = self.platform_manager.validate_paths()
        if not paths_ok:
            raise RuntimeError("Chemins de plateforme invalides")
    
    def list_available_sequences(self):
        """Liste les séquences disponibles pour test."""
        
        try:
            # Charger les données
            config_path = self.platform_manager.paths["config"]
            with open(config_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            sequences = data.get('sequences', {})
            excluded = self.exclusion_manager.load_excluded_sequences()
            
            available = []
            for seq_name, seq_data in sequences.items():
                if seq_name not in excluded:
                    shot_count = len(seq_data.get('shots', []))
                    duration = seq_data.get('duration_total', 0)
                    available.append({
                        'name': seq_name,
                        'title': seq_data.get('nom', 'Sans titre'),
                        'shots': shot_count,
                        'duration': duration
                    })
            
            return available, excluded
            
        except Exception as e:
            print(f"❌ Erreur lors du chargement des séquences : {e}")
            return [], []
    
    def check_sequence_files(self, sequence_name):
        """Vérifie les fichiers disponibles pour une séquence."""
        
        try:
            config_path = self.platform_manager.paths["config"]
            with open(config_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            sequence_data = data.get('sequences', {}).get(sequence_name)
            if not sequence_data:
                return None
            
            shots = sequence_data.get('shots', [])
            edit_path = Path(self.platform_manager.paths["from_edit"])
            grading_path = Path(self.platform_manager.paths["from_grading"])
            
            stats = {
                'total_shots': len(shots),
                'edit_available': 0,
                'graded_available': 0,
                'missing_edit': [],
                'missing_graded': []
            }
            
            for shot in shots:
                shot_name = shot.get('nom')
                if not shot_name:
                    continue
                
                # Vérifier fichier EDIT
                edit_file = edit_path / f"{shot_name}.mov"
                if edit_file.exists():
                    stats['edit_available'] += 1
                else:
                    stats['missing_edit'].append(shot_name)
                
                # Vérifier fichier GRADED
                graded_file = grading_path / f"{shot_name}.mov"
                if graded_file.exists():
                    stats['graded_available'] += 1
                else:
                    stats['missing_graded'].append(shot_name)
            
            return stats
            
        except Exception as e:
            print(f"❌ Erreur lors de la vérification : {e}")
            return None
    
    def test_sequence_generation(self, sequence_name, confirm=True):
        """Génère réellement une séquence pour test."""
        
        print(f"🧪 TEST GÉNÉRATION RÉELLE - {sequence_name}")
        print("=" * 50)
        print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🖥️  Plateforme : {self.platform_manager.platform}")
        print()
        
        # Vérifier que la séquence n'est pas exclue
        excluded = self.exclusion_manager.load_excluded_sequences()
        if sequence_name in excluded:
            print(f"❌ SÉQUENCE EXCLUE : {sequence_name}")
            print(f"   Raison : {excluded[sequence_name]}")
            return False
        
        # Analyser les fichiers disponibles
        stats = self.check_sequence_files(sequence_name)
        if not stats:
            print(f"❌ Séquence {sequence_name} non trouvée")
            return False
        
        print(f"📊 ANALYSE FICHIERS {sequence_name}")
        print("-" * 30)
        print(f"   Plans total : {stats['total_shots']}")
        
        if stats['total_shots'] == 0:
            print("   ❌ Aucun plan trouvé pour cette séquence")
            return False
        
        edit_percent = stats['edit_available'] / stats['total_shots'] * 100
        graded_percent = stats['graded_available'] / stats['total_shots'] * 100
        
        print(f"   EDIT disponibles : {stats['edit_available']}/{stats['total_shots']} ({edit_percent:.1f}%)")
        print(f"   GRADED disponibles : {stats['graded_available']}/{stats['total_shots']} ({graded_percent:.1f}%)")
        
        if stats['missing_edit']:
            print(f"   ⚠️  Fichiers EDIT manquants : {len(stats['missing_edit'])}")
        
        if stats['missing_graded']:
            print(f"   ⚠️  Fichiers GRADED manquants : {len(stats['missing_graded'])}")
        
        print()
        
        # Recommandation
        if stats['total_shots'] == 0:
            print("❌ Séquence sans plans - Impossible de continuer")
            return False
            
        edit_percent = stats['edit_available'] / stats['total_shots'] * 100
        if edit_percent < 70:
            print(f"⚠️  ATTENTION : Seulement {edit_percent:.1f}% des fichiers EDIT disponibles")
            print("   Recommandé de choisir une séquence avec plus de fichiers")
            if confirm and input("   Continuer quand même ? (o/N): ").lower() != 'o':
                return False
        
        print(f"🚀 GÉNÉRATION EN COURS...")
        print("-" * 25)
        
        # Initialiser le générateur
        try:
            self.generator = AfterEffectsGeneratorV2()
            
            # Générer la séquence
            success = self.generator.generate_for_sequence(sequence_name, dry_run=False)
            
            if success:
                print()
                print("✅ GÉNÉRATION RÉUSSIE !")
                print("=" * 25)
                
                # Afficher les chemins générés
                sequences_path = Path(self.platform_manager.paths["sequences"])
                seq_path = sequences_path / sequence_name
                
                ae_file = seq_path / "_AE" / f"{sequence_name}_01.aep"
                script_file = seq_path / "_AE" / f"{sequence_name}_generation_script_v2.jsx"
                
                print(f"📁 Dossier séquence : {seq_path}")
                print(f"🎬 Projet AE : {ae_file}")
                print(f"📝 Script AE : {script_file}")
                
                # Instructions pour le test
                print()
                print("🎯 INSTRUCTIONS DE TEST")
                print("-" * 22)
                print("1️⃣  Ouvrir After Effects 2025")
                print(f"2️⃣  Ouvrir le projet : {ae_file}")
                print("3️⃣  Vérifier que toutes les compositions sont créées")
                print("4️⃣  Vérifier que les sources sont bien liées")
                print("5️⃣  Tester le script pour voir s'il s'exécute sans erreur")
                print()
                print("📋 Si tout fonctionne, vous pourrez lancer le déploiement complet !")
                
                return True
                
            else:
                print("❌ Échec de la génération")
                return False
                
        except Exception as e:
            print(f"❌ Erreur lors de la génération : {e}")
            return False

def main():
    """Fonction principale interactive."""
    
    print("🧪 TEST SÉQUENCE UNIQUE - GÉNÉRATION RÉELLE")
    print("=" * 48)
    print("Ce script génère réellement les fichiers pour une séquence")
    print("afin que vous puissiez tester le script dans After Effects.")
    print()
    
    try:
        tester = SequenceTestManager()
        
        # Lister les séquences disponibles
        available, excluded = tester.list_available_sequences()
        
        if not available:
            print("❌ Aucune séquence disponible pour test")
            return 1
        
        print("📋 SÉQUENCES DISPONIBLES POUR TEST")
        print("-" * 35)
        
        for i, seq in enumerate(available[:10], 1):  # Limiter à 10 pour la lisibilité
            print(f"   {i:2d}. {seq['name']} - {seq['title']}")
            print(f"       📄 {seq['shots']} plans | ⏱️  {seq['duration']:.1f}s")
        
        if len(available) > 10:
            print(f"       ... et {len(available) - 10} autres séquences")
        
        print()
        
        if excluded:
            print("🚫 SÉQUENCES EXCLUES")
            print("-" * 18)
            for seq_name, reason in excluded.items():
                print(f"   • {seq_name}: {reason}")
            print()
        
        # Demander quelle séquence tester
        print("Recommandations :")
        print("• SQ01 : Séquence de départ (peut avoir quelques fichiers manquants)")
        print("• SQ03 : Séquence complète (100% des fichiers)")
        print("• SQ04 : Séquence complète (100% des fichiers)")
        print()
        
        while True:
            choice = input("🎯 Quelle séquence tester ? (nom ou numéro, 'q' pour quitter) : ").strip()
            
            if choice.lower() == 'q':
                print("Test annulé")
                return 0
            
            # Vérifier si c'est un numéro
            try:
                idx = int(choice) - 1
                if 0 <= idx < len(available):
                    sequence_name = available[idx]['name']
                    break
            except ValueError:
                pass
            
            # Vérifier si c'est un nom direct
            sequence_name = choice.upper()
            if any(seq['name'] == sequence_name for seq in available):
                break
            
            print(f"❌ Séquence '{choice}' non trouvée. Essayez à nouveau.")
        
        print()
        
        # Confirmer avant génération
        print(f"⚠️  ATTENTION : Cette opération va RÉELLEMENT générer les fichiers pour {sequence_name}")
        print("   - Création du projet After Effects")
        print("   - Création du script ExtendScript")
        print("   - Création de la structure EbSynth")
        print()
        
        if input("Confirmer la génération réelle ? (o/N): ").lower() != 'o':
            print("Test annulé")
            return 0
        
        # Lancer le test
        success = tester.test_sequence_generation(sequence_name, confirm=False)
        
        return 0 if success else 1
        
    except KeyboardInterrupt:
        print("\n\n❌ Test interrompu par l'utilisateur")
        return 1
    except Exception as e:
        print(f"❌ Erreur inattendue : {e}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
