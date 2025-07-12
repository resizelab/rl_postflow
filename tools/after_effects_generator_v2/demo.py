#!/usr/bin/env python3
"""
Démo After Effects Generator v2
Script de démonstration pour tester rapidement l'outil
"""

import sys
import os
from pathlib import Path

# Ajouter le script principal au path
sys.path.append(str(Path(__file__).parent))

from generate_ae_projects_v2 import AfterEffectsGeneratorV2

def demo_generator_v2():
    """Démonstration du générateur v2."""
    print("🎬 Démo After Effects Generator v2")
    print("=" * 50)
    
    try:
        generator = AfterEffectsGeneratorV2()
        
        # Charger les données
        print("📊 Chargement des données...")
        sequence_data = generator.load_sequence_data()
        
        # Afficher statistiques
        total_sequences = len(sequence_data)
        total_plans = sum(len(seq['plans']) for seq in sequence_data.values())
        
        print(f"✅ {total_sequences} séquences disponibles")
        print(f"✅ {total_plans} plans au total")
        
        # Afficher les 5 premières séquences
        print("\n📋 Aperçu des séquences :")
        for i, (seq_id, seq_info) in enumerate(list(sequence_data.items())[:5]):
            plan_count = len(seq_info['plans'])
            print(f"   {seq_id} : {seq_info['name']} ({plan_count} plans)")
        
        if total_sequences > 5:
            print(f"   ... et {total_sequences - 5} autres séquences")
        
        # Focus sur SQ02
        if 'SQ02' in sequence_data:
            print(f"\n🎯 Focus SQ02 :")
            sq02 = sequence_data['SQ02']
            print(f"   Nom : {sq02['name']}")
            print(f"   Plans : {len(sq02['plans'])}")
            
            # Afficher premiers plans
            print("   Premiers plans :")
            for plan in sq02['plans'][:3]:
                print(f"     • UNDLM_{plan['plan_num']:05d} ({plan['duration']}s)")
            
            if len(sq02['plans']) > 3:
                print(f"     ... et {len(sq02['plans']) - 3} autres")
        
        # Vérifier plans étalonnés disponibles
        print(f"\n🎨 Vérification plans étalonnés pour SQ02...")
        if 'SQ02' in sequence_data:
            plans = sequence_data['SQ02']['plans']
            available_graded = generator.check_graded_plans_availability(plans)
            print(f"   Plans étalonnés disponibles : {len(available_graded)}/{len(plans)}")
        
        print(f"\n🚀 Commandes de test disponibles :")
        print(f"   # Validation (dry-run)")
        print(f"   python validate.py")
        print(f"   ")
        print(f"   # Test SQ02 (simulation)")
        print(f"   python generate_ae_projects_v2.py --sequence SQ02 --dry-run")
        print(f"   ")
        print(f"   # Génération réelle SQ02")
        print(f"   python generate_ae_projects_v2.py --sequence SQ02")
        print(f"   ")
        print(f"   # Validation complète (3 séquences)")
        print(f"   python generate_ae_projects_v2.py --validation --dry-run")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur de démo : {e}")
        return False

if __name__ == "__main__":
    success = demo_generator_v2()
    sys.exit(0 if success else 1)
