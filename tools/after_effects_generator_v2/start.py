#!/usr/bin/env python3
"""
Démarrage Rapide - Déploiement After Effects
Script d'entrée principale pour le déploiement des séquences AE
"""

import sys
import os
from pathlib import Path

# Ajouter le répertoire au path
sys.path.append(str(Path(__file__).parent))

from manage_exclusions import SequenceExclusionManager
from deploy_progressive import ProgressiveAEDeployer

def main():
    """Point d'entrée principal avec aperçu de la situation."""
    
    print("🎬 DÉPLOIEMENT AFTER EFFECTS - DÉMARRAGE RAPIDE")
    print("=" * 60)
    print("🗓️  " + time.strftime('%Y-%m-%d %H:%M:%S'))
    print()
    
    # Initialiser le gestionnaire d'exclusions
    exclusion_manager = SequenceExclusionManager()
    
    # Afficher l'état actuel
    print("📊 ÉTAT ACTUEL DES SÉQUENCES")
    print("-" * 30)
    
    try:
        # Obtenir les informations
        available_sequences = exclusion_manager.get_available_sequences()
        excluded_sequences = exclusion_manager.load_excluded_sequences()
        
        print(f"✅ Séquences disponibles : {len(available_sequences)}")
        print(f"🚫 Séquences exclues : {len(excluded_sequences)}")
        
        if excluded_sequences:
            print(f"\n🚫 Séquences exclues actuellement :")
            for seq_id, reason in excluded_sequences.items():
                print(f"   • {seq_id}: {reason}")
        
        if available_sequences:
            print(f"\n✅ Quelques séquences prêtes pour déploiement :")
            for seq_id in available_sequences[:5]:
                print(f"   • {seq_id}")
            if len(available_sequences) > 5:
                print(f"   ... et {len(available_sequences) - 5} autres")
        
        print()
        
        # Proposer les actions
        print("🚀 ACTIONS DISPONIBLES")
        print("-" * 20)
        print()
        print("   1️⃣  Déploiement progressif (recommandé)")
        print("       🧪 Test → 🔍 Validation → 🚀 Déploiement complet")
        print()
        print("   2️⃣  Test rapide sur une séquence")
        print("       🧪 Valider la méthode rapidement")
        print()
        print("   3️⃣  Gérer les exclusions")
        print("       ➕➖ Ajouter/Retirer des séquences de la liste d'exclusion")
        print()
        print("   4️⃣  Déploiement complet direct")
        print("       🚀 Générer toutes les séquences disponibles")
        print()
        print("   5️⃣  Voir statut détaillé")
        print("       📊 État complet de toutes les séquences")
        print()
        print("   0️⃣  Quitter")
        print()
        
        choice = input("Votre choix (0-5) : ").strip()
        
        if choice == "0":
            print("👋 Au revoir !")
            return 0
        elif choice == "1":
            return run_progressive_deployment()
        elif choice == "2":
            return run_quick_test()
        elif choice == "3":
            return run_exclusion_management()
        elif choice == "4":
            return run_full_deployment()
        elif choice == "5":
            return show_detailed_status()
        else:
            print("❌ Choix invalide")
            return 1
            
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation : {e}")
        print("💡 Vérifiez que les chemins et configurations sont corrects")
        return 1

def run_progressive_deployment():
    """Lance le déploiement progressif."""
    print("\n🚀 LANCEMENT DU DÉPLOIEMENT PROGRESSIF")
    print("=" * 45)
    
    deployer = ProgressiveAEDeployer()
    
    print("Ce processus va :")
    print("   1️⃣  Tester sur une séquence")
    print("   2️⃣  Valider sur plusieurs séquences")
    print("   3️⃣  Déployer complètement (avec confirmation)")
    print()
    
    confirm = input("Commencer le déploiement progressif ? (o/N): ")
    if confirm.lower() in ['o', 'oui', 'yes', 'y']:
        # Étape 1
        success_1 = deployer.stage_1_test_single_sequence(dry_run=True)
        if not success_1:
            print("❌ Étape 1 échouée - Arrêt")
            return 1
        
        # Étape 2
        success_2 = deployer.stage_2_validation_sequences(dry_run=True)
        if not success_2:
            print("❌ Étape 2 échouée - Arrêt")
            return 1
        
        # Étape 3 avec confirmation
        confirm_3 = input("\n✅ Étapes 1-2 OK. Passer au déploiement complet ? (o/N): ")
        if confirm_3.lower() in ['o', 'oui', 'yes', 'y']:
            success_3 = deployer.stage_3_full_deployment(dry_run=False)
            return 0 if success_3 else 1
        else:
            print("✅ Déploiement validé - Prêt pour production quand vous voulez")
            return 0
    else:
        print("❌ Déploiement annulé")
        return 1

def run_quick_test():
    """Lance un test rapide."""
    print("\n🧪 TEST RAPIDE")
    print("=" * 15)
    
    deployer = ProgressiveAEDeployer()
    
    print(f"Test sur la séquence : {deployer.test_sequence}")
    print("Mode : Simulation (dry-run)")
    print()
    
    confirm = input("Lancer le test rapide ? (o/N): ")
    if confirm.lower() in ['o', 'oui', 'yes', 'y']:
        success = deployer.stage_1_test_single_sequence(dry_run=True)
        return 0 if success else 1
    else:
        print("❌ Test annulé")
        return 1

def run_exclusion_management():
    """Lance la gestion des exclusions."""
    print("\n🔧 GESTION DES EXCLUSIONS")
    print("=" * 25)
    
    exclusion_manager = SequenceExclusionManager()
    exclusion_manager.interactive_management()
    return 0

def run_full_deployment():
    """Lance le déploiement complet direct."""
    print("\n🚀 DÉPLOIEMENT COMPLET DIRECT")
    print("=" * 30)
    
    deployer = ProgressiveAEDeployer()
    
    print("⚠️  ATTENTION : Ceci va déployer toutes les séquences disponibles")
    print("Il est recommandé de faire un test d'abord")
    print()
    
    # Double confirmation
    confirm1 = input("Êtes-vous sûr de vouloir continuer ? (o/N): ")
    if confirm1.lower() not in ['o', 'oui', 'yes', 'y']:
        print("❌ Déploiement annulé")
        return 1
    
    # Proposer dry-run d'abord
    dry_run_first = input("Faire une simulation d'abord (recommandé) ? (O/n): ")
    
    if dry_run_first.lower() not in ['n', 'non', 'no']:
        print("\n🧪 Simulation du déploiement complet...")
        success_dry = deployer.stage_3_full_deployment(dry_run=True)
        
        if not success_dry:
            print("❌ Simulation échouée - Arrêt")
            return 1
        
        # Confirmer pour production
        confirm2 = input("\n✅ Simulation OK. Passer en mode production ? (o/N): ")
        if confirm2.lower() not in ['o', 'oui', 'yes', 'y']:
            print("✅ Simulation terminée - Prêt pour production")
            return 0
    
    # Déploiement production
    success = deployer.stage_3_full_deployment(dry_run=False)
    return 0 if success else 1

def show_detailed_status():
    """Affiche le statut détaillé."""
    print("\n📊 STATUT DÉTAILLÉ")
    print("=" * 18)
    
    exclusion_manager = SequenceExclusionManager()
    exclusion_manager._show_all_status()
    
    input("\nAppuyer sur Entrée pour continuer...")
    return 0

if __name__ == "__main__":
    import time
    exit_code = main()
    sys.exit(exit_code)
