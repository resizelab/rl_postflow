#!/usr/bin/env python3
"""
Test Simple d'une Séquence - Génération Réelle
Utilise directement le générateur existant pour tester une séquence
"""

import sys
import os
from pathlib import Path
from datetime import datetime

# Ajouter le chemin parent pour les imports
sys.path.append(str(Path(__file__).parent))

from generate_ae_projects_v2 import AfterEffectsGeneratorV2
from manage_exclusions import SequenceExclusionManager

def main():
    """Fonction principale pour test simple."""
    
    print("🧪 TEST SIMPLE - GÉNÉRATION RÉELLE D'UNE SÉQUENCE")
    print("=" * 55)
    print("Ce script génère réellement les fichiers pour tester")
    print("le script After Effects avant le déploiement complet.")
    print()
    
    try:
        # Initialiser le générateur
        print("🔧 Initialisation...")
        generator = AfterEffectsGeneratorV2()
        exclusion_manager = SequenceExclusionManager()
        
        # Vérifier les exclusions
        excluded = exclusion_manager.load_excluded_sequences()
        if excluded:
            print("🚫 SÉQUENCES ACTUELLEMENT EXCLUES :")
            for seq_name, reason in excluded.items():
                print(f"   • {seq_name}: {reason}")
            print()
        
        # Séquences recommandées pour test
        recommended = ['SQ01', 'SQ03', 'SQ04', 'SQ05']
        available_recommended = [seq for seq in recommended if seq not in excluded]
        
        print("🎯 SÉQUENCES RECOMMANDÉES POUR TEST :")
        for seq in available_recommended:
            print(f"   • {seq}")
        print()
        
        # Demander quelle séquence tester
        while True:
            sequence_name = input("🎬 Quelle séquence tester ? (ex: SQ01, ou 'q' pour quitter) : ").strip().upper()
            
            if sequence_name == 'Q':
                print("Test annulé")
                return 0
            
            if sequence_name in excluded:
                print(f"❌ {sequence_name} est exclue : {excluded[sequence_name]}")
                continue
            
            if sequence_name.startswith('SQ') and len(sequence_name) >= 3:
                break
            
            print("❌ Format invalide. Utilisez SQxx (ex: SQ01)")
        
        print()
        print(f"⚠️  ATTENTION : Génération RÉELLE de {sequence_name}")
        print("   ✅ Création du projet After Effects")
        print("   ✅ Création du script ExtendScript")
        print("   ✅ Création de la structure EbSynth")
        print()
        
        if input("Confirmer la génération ? (o/N): ").lower() != 'o':
            print("Test annulé")
            return 0
        
        print()
        print(f"🚀 GÉNÉRATION EN COURS - {sequence_name}")
        print("=" * 40)
        print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        # Générer la séquence (MODE RÉEL)
        success = generator.generate_for_sequence(sequence_name, dry_run=False)
        
        print()
        if success:
            print("✅ GÉNÉRATION RÉUSSIE !")
            print("=" * 25)
            
            # Afficher les chemins générés
            sequences_path = generator.sequences_path
            seq_path = sequences_path / sequence_name
            
            ae_project = seq_path / "_AE" / f"{sequence_name}_01.aep"
            ae_script = seq_path / "_AE" / f"{sequence_name}_generation_script_v2.jsx"
            
            print(f"📁 Dossier : {seq_path}")
            print(f"🎬 Projet AE : {ae_project}")
            print(f"📝 Script AE : {ae_script}")
            print()
            
            print("🎯 PROCHAINES ÉTAPES :")
            print("=" * 18)
            print("1️⃣  Ouvrir After Effects 2025")
            print(f"2️⃣  Ouvrir le projet : {ae_project}")
            print("3️⃣  Vérifier que toutes les compositions sont créées")
            print("4️⃣  Vérifier que les sources vidéo sont bien liées")
            print("5️⃣  Vérifier la structure des dossiers")
            print()
            print("📋 Si tout fonctionne parfaitement :")
            print("   → Vous pouvez lancer le déploiement complet")
            print("   → Utilisez 'python start.py' pour déployer toutes les séquences")
            print()
            print("❌ Si il y a des problèmes :")
            print("   → Vérifiez les chemins de fichiers dans AE")
            print("   → Vérifiez la console d'AE pour les erreurs de script")
            print("   → Reportez les problèmes pour correction")
            
            return 0
            
        else:
            print("❌ ÉCHEC DE LA GÉNÉRATION")
            print("Vérifiez les logs ci-dessus pour identifier le problème")
            return 1
            
    except KeyboardInterrupt:
        print("\n\n❌ Test interrompu par l'utilisateur")
        return 1
    except Exception as e:
        print(f"❌ Erreur inattendue : {e}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
