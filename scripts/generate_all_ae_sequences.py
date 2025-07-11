#!/usr/bin/env python3
"""
Générateur Batch pour Toutes les Séquences After Effects
Utilise le mapping Google Sheets pour générer automatiquement tous les projets AE
"""

import json
import sys
import os
from pathlib import Path
from generate_ae_projects import AfterEffectsGenerator

def main():
    """Génère toutes les séquences After Effects."""
    
    print("🎬 GÉNÉRATION BATCH - TOUTES LES SÉQUENCES AFTER EFFECTS")
    print("=" * 70)
    
    # Initialiser le générateur
    generator = AfterEffectsGenerator()
    
    try:
        # Charger le mapping des séquences
        data = generator.load_sequence_data()
        sequences = list(data.keys())
        
        print(f"📋 Séquences trouvées : {len(sequences)}")
        print(f"📂 Séquences : {', '.join(sequences)}")
        
        # Confirmer avec l'utilisateur
        confirmation = input(f"\n🔥 Générer toutes les {len(sequences)} séquences ? (o/N): ")
        if confirmation.lower() not in ['o', 'oui', 'yes', 'y']:
            print("❌ Génération annulée")
            return
        
        # Demander mode dry-run ou production
        mode = input("🎯 Mode de génération (d=dry-run, p=production): ")
        dry_run = mode.lower() in ['d', 'dry', 'dry-run']
        
        print(f"\n🚀 Démarrage génération en mode {'DRY-RUN' if dry_run else 'PRODUCTION'}")
        print("=" * 70)
        
        # Statistiques
        successful = []
        failed = []
        total_plans = 0
        total_graded = 0
        
        # Générer chaque séquence
        for i, seq_id in enumerate(sequences, 1):
            print(f"\n[{i}/{len(sequences)}] Traitement {seq_id}...")
            
            try:
                success = generator.generate_sequence(seq_id, dry_run=dry_run)
                
                if success:
                    successful.append(seq_id)
                    seq_info = data[seq_id]
                    seq_plans = len(seq_info['plans'])
                    total_plans += seq_plans
                    print(f"✅ {seq_id} OK ({seq_plans} plans)")
                else:
                    failed.append(seq_id)
                    print(f"❌ {seq_id} ÉCHEC")
                    
            except Exception as e:
                failed.append(seq_id)
                print(f"❌ {seq_id} ERREUR : {e}")
        
        # Rapport final
        print("\n" + "=" * 70)
        print("📊 RAPPORT FINAL DE GÉNÉRATION")
        print("=" * 70)
        
        print(f"✅ Séquences générées avec succès : {len(successful)}/{len(sequences)}")
        print(f"❌ Séquences en échec : {len(failed)}")
        print(f"📦 Total plans traités : {total_plans}")
        
        if successful:
            print(f"\n🎉 SÉQUENCES RÉUSSIES :")
            for seq in successful:
                seq_info = data[seq]
                print(f"   • {seq} - {seq_info['name']} ({len(seq_info['plans'])} plans)")
        
        if failed:
            print(f"\n⚠️  SÉQUENCES EN ÉCHEC :")
            for seq in failed:
                print(f"   • {seq}")
        
        # Estimation ressources
        if successful:
            estimated_size_gb = len(successful) * 0.05  # 50MB par projet
            print(f"\n💾 Estimation stockage : ~{estimated_size_gb:.1f} GB")
            
            if not dry_run:
                print(f"📁 Projets AE générés dans : {generator.sequences_path}")
                print(f"🎯 Prêt pour ouverture dans After Effects")
        
        print(f"\n🎬 GÉNÉRATION {'DRY-RUN' if dry_run else 'PRODUCTION'} TERMINÉE")
        
    except Exception as e:
        print(f"❌ Erreur lors de la génération batch : {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
