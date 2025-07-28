#!/usr/bin/env python3
"""
Gestionnaire d'Exclusion des Séquences - RL PostFlow
Permet de gérer les séquences à exclure du déploiement (en cours de travail)
"""

import sys
import os
import json
import time
from pathlib import Path
from typing import Dict, List, Set

# Ajouter le générateur au path
sys.path.append(str(Path(__file__).parent))

from generate_ae_projects_v2 import AfterEffectsGeneratorV2

class SequenceExclusionManager:
    """Gestionnaire des séquences à exclure du déploiement."""
    
    def __init__(self):
        self.generator = AfterEffectsGeneratorV2()
        self.exclusion_file = Path(__file__).parent / "excluded_sequences.json"
        self.sequences_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES")
        
        # Séquences actuellement exclues (par défaut)
        self.default_excluded = {
            "SQ02": "En cours de travail graphiste"
        }
    
    def load_excluded_sequences(self) -> Dict[str, str]:
        """Charge la liste des séquences exclues."""
        if self.exclusion_file.exists():
            with open(self.exclusion_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            # Créer le fichier avec les exclusions par défaut
            self.save_excluded_sequences(self.default_excluded)
            return self.default_excluded.copy()
    
    def save_excluded_sequences(self, excluded: Dict[str, str]):
        """Sauvegarde la liste des séquences exclues."""
        with open(self.exclusion_file, 'w', encoding='utf-8') as f:
            json.dump(excluded, f, indent=2, ensure_ascii=False)
    
    def add_excluded_sequence(self, sequence_id: str, reason: str = "En cours de travail"):
        """Ajoute une séquence à la liste d'exclusion."""
        excluded = self.load_excluded_sequences()
        excluded[sequence_id] = reason
        self.save_excluded_sequences(excluded)
        print(f"✅ {sequence_id} ajoutée aux exclusions : {reason}")
    
    def remove_excluded_sequence(self, sequence_id: str):
        """Retire une séquence de la liste d'exclusion."""
        excluded = self.load_excluded_sequences()
        if sequence_id in excluded:
            reason = excluded.pop(sequence_id)
            self.save_excluded_sequences(excluded)
            print(f"✅ {sequence_id} retirée des exclusions (était : {reason})")
        else:
            print(f"⚠️  {sequence_id} n'était pas dans les exclusions")
    
    def list_sequences_status(self) -> Dict[str, str]:
        """Liste toutes les séquences avec leur statut."""
        try:
            # Charger toutes les séquences disponibles
            sequence_data = self.generator.load_sequence_data()
            all_sequences = set(sequence_data.keys())
            
            # Charger les exclusions
            excluded = self.load_excluded_sequences()
            excluded_set = set(excluded.keys())
            
            # Vérifier les séquences déjà déployées
            deployed = self._check_deployed_sequences(all_sequences)
            
            # Calculer les statuts
            status = {}
            
            for seq_id in sorted(all_sequences):
                if seq_id in excluded_set:
                    status[seq_id] = f"🚫 EXCLU - {excluded[seq_id]}"
                elif seq_id in deployed:
                    status[seq_id] = "✅ DÉPLOYÉ"
                else:
                    status[seq_id] = "⏳ À DÉPLOYER"
            
            return status
            
        except Exception as e:
            print(f"❌ Erreur lors de la vérification : {e}")
            return {}
    
    def _check_deployed_sequences(self, sequences: Set[str]) -> Set[str]:
        """Vérifie quelles séquences sont déjà déployées."""
        deployed = set()
        
        for seq_id in sequences:
            seq_dir = self.sequences_path / seq_id
            ae_dir = seq_dir / "_AE"
            eb_dir = seq_dir / "_EB"
            script_file = ae_dir / f"{seq_id}_generation_script_v2.jsx"
            
            # Considérer comme déployé si le script existe ET qu'il y a des dossiers EB
            if (script_file.exists() and 
                eb_dir.exists() and 
                len(list(eb_dir.iterdir())) > 0):
                deployed.add(seq_id)
        
        return deployed
    
    def get_available_sequences(self) -> List[str]:
        """Retourne la liste des séquences disponibles pour déploiement."""
        try:
            sequence_data = self.generator.load_sequence_data()
            all_sequences = set(sequence_data.keys())
            excluded = set(self.load_excluded_sequences().keys())
            
            available = sorted(all_sequences - excluded)
            return available
            
        except Exception as e:
            print(f"❌ Erreur : {e}")
            return []
    
    def interactive_management(self):
        """Interface interactive pour gérer les exclusions."""
        print("🔧 GESTIONNAIRE D'EXCLUSION DES SÉQUENCES")
        print("=" * 50)
        
        while True:
            print("\n📋 Options disponibles :")
            print("   1️⃣  Afficher statut de toutes les séquences")
            print("   2️⃣  Lister séquences disponibles pour déploiement")
            print("   3️⃣  Ajouter une exclusion")
            print("   4️⃣  Retirer une exclusion")
            print("   5️⃣  Exporter liste pour déploiement")
            print("   0️⃣  Quitter")
            print()
            
            choice = input("Votre choix (0-5) : ").strip()
            
            if choice == "0":
                print("👋 Au revoir !")
                break
            elif choice == "1":
                self._show_all_status()
            elif choice == "2":
                self._show_available()
            elif choice == "3":
                self._add_exclusion_interactive()
            elif choice == "4":
                self._remove_exclusion_interactive()
            elif choice == "5":
                self._export_deployment_list()
            else:
                print("❌ Choix invalide")
    
    def _show_all_status(self):
        """Affiche le statut de toutes les séquences."""
        print("\n📊 STATUT DE TOUTES LES SÉQUENCES")
        print("-" * 40)
        
        status = self.list_sequences_status()
        
        if not status:
            print("❌ Impossible de charger les données")
            return
        
        # Compter par statut
        excluded_count = sum(1 for s in status.values() if s.startswith("🚫"))
        deployed_count = sum(1 for s in status.values() if s.startswith("✅"))
        pending_count = sum(1 for s in status.values() if s.startswith("⏳"))
        
        print(f"📈 Résumé : {len(status)} séquences total")
        print(f"   🚫 Exclues : {excluded_count}")
        print(f"   ✅ Déployées : {deployed_count}")
        print(f"   ⏳ À déployer : {pending_count}")
        print()
        
        for seq_id, status_text in status.items():
            print(f"   {seq_id:<6} : {status_text}")
    
    def _show_available(self):
        """Affiche les séquences disponibles pour déploiement."""
        print("\n⏳ SÉQUENCES DISPONIBLES POUR DÉPLOIEMENT")
        print("-" * 40)
        
        available = self.get_available_sequences()
        
        if not available:
            print("ℹ️  Aucune séquence disponible pour déploiement")
        else:
            print(f"📋 {len(available)} séquences prêtes :")
            for seq_id in available:
                print(f"   • {seq_id}")
        
        # Afficher les exclusions actuelles
        excluded = self.load_excluded_sequences()
        if excluded:
            print(f"\n🚫 Séquences exclues ({len(excluded)}) :")
            for seq_id, reason in excluded.items():
                print(f"   • {seq_id} : {reason}")
    
    def _add_exclusion_interactive(self):
        """Ajoute une exclusion de manière interactive."""
        print("\n➕ AJOUTER UNE EXCLUSION")
        print("-" * 25)
        
        # Afficher séquences disponibles
        available = self.get_available_sequences()
        if not available:
            print("ℹ️  Aucune séquence disponible à exclure")
            return
        
        print("Séquences disponibles :")
        for i, seq_id in enumerate(available, 1):
            print(f"   {i:2d}. {seq_id}")
        
        try:
            choice = input(f"\nChoisir une séquence (1-{len(available)}) ou taper l'ID : ").strip()
            
            if choice.isdigit() and 1 <= int(choice) <= len(available):
                seq_id = available[int(choice) - 1]
            elif choice in available:
                seq_id = choice
            else:
                print("❌ Choix invalide")
                return
            
            reason = input(f"Raison de l'exclusion pour {seq_id} : ").strip()
            if not reason:
                reason = "En cours de travail"
            
            self.add_excluded_sequence(seq_id, reason)
            
        except Exception as e:
            print(f"❌ Erreur : {e}")
    
    def _remove_exclusion_interactive(self):
        """Retire une exclusion de manière interactive."""
        print("\n➖ RETIRER UNE EXCLUSION")
        print("-" * 22)
        
        excluded = self.load_excluded_sequences()
        if not excluded:
            print("ℹ️  Aucune exclusion active")
            return
        
        print("Exclusions actuelles :")
        excluded_list = list(excluded.items())
        for i, (seq_id, reason) in enumerate(excluded_list, 1):
            print(f"   {i:2d}. {seq_id} : {reason}")
        
        try:
            choice = input(f"\nChoisir une exclusion à retirer (1-{len(excluded_list)}) : ").strip()
            
            if choice.isdigit() and 1 <= int(choice) <= len(excluded_list):
                seq_id = excluded_list[int(choice) - 1][0]
                self.remove_excluded_sequence(seq_id)
            else:
                print("❌ Choix invalide")
                
        except Exception as e:
            print(f"❌ Erreur : {e}")
    
    def _export_deployment_list(self):
        """Exporte la liste des séquences pour déploiement."""
        print("\n📤 EXPORT LISTE DÉPLOIEMENT")
        print("-" * 28)
        
        available = self.get_available_sequences()
        excluded = self.load_excluded_sequences()
        
        # Créer le rapport
        report = {
            "timestamp": time.strftime('%Y-%m-%d %H:%M:%S'),
            "total_sequences": len(available),
            "available_sequences": available,
            "excluded_sequences": excluded,
            "deployment_ready": len(available) > 0
        }
        
        # Sauvegarder
        export_file = Path(__file__).parent / f"deployment_list_{time.strftime('%Y%m%d_%H%M%S')}.json"
        with open(export_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Liste exportée : {export_file}")
        print(f"📊 Résumé :")
        print(f"   • Séquences à déployer : {len(available)}")
        print(f"   • Séquences exclues : {len(excluded)}")
        
        if available:
            print(f"\n🚀 Commande de déploiement suggérée :")
            print(f"   python deploy_progressive.py --all-stages --dry-run")

def main():
    """Fonction principale."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Gestionnaire d\'exclusion des séquences')
    parser.add_argument('--add', '-a', nargs=2, metavar=('SEQUENCE', 'REASON'),
                       help='Ajouter une exclusion (ex: --add SQ05 "En cours")')
    parser.add_argument('--remove', '-r', metavar='SEQUENCE',
                       help='Retirer une exclusion')
    parser.add_argument('--list', '-l', action='store_true',
                       help='Lister le statut de toutes les séquences')
    parser.add_argument('--available', '-av', action='store_true',
                       help='Lister seulement les séquences disponibles')
    parser.add_argument('--interactive', '-i', action='store_true',
                       help='Mode interactif')
    
    args = parser.parse_args()
    
    manager = SequenceExclusionManager()
    
    if args.add:
        seq_id, reason = args.add
        manager.add_excluded_sequence(seq_id, reason)
    elif args.remove:
        manager.remove_excluded_sequence(args.remove)
    elif args.list:
        manager._show_all_status()
    elif args.available:
        manager._show_available()
    elif args.interactive:
        manager.interactive_management()
    else:
        # Mode par défaut : afficher disponibles
        print("🎬 GESTIONNAIRE D'EXCLUSION DES SÉQUENCES")
        print("=" * 50)
        manager._show_available()
        print(f"\n💡 Utiliser --interactive pour plus d'options")

if __name__ == "__main__":
    main()
