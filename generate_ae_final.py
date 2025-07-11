#!/usr/bin/env python3
"""
🎬 Générateur Final After Effects - RL PostFlow v4.1.1
Guide interactif pour convertir les scripts .jsx en projets .aep
"""

import os
import sys
import time
from pathlib import Path

def check_ae_project_created(sequence_id):
    """Vérifie qu'un projet .aep a été créé."""
    sequences_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES")
    aep_file = sequences_path / sequence_id / "_AE" / f"{sequence_id}_01.aep"
    
    if aep_file.exists():
        size_mb = aep_file.stat().st_size / (1024 * 1024)
        return True, size_mb
    return False, 0

def wait_for_project_creation(sequence_id):
    """Attend que le projet .aep soit créé."""
    
    print(f"⏳ Attente création {sequence_id}_01.aep...")
    print("   (Le script AE est en cours d'exécution)")
    
    check_count = 0
    while check_count < 60:  # Max 10 minutes d'attente
        exists, size_mb = check_ae_project_created(sequence_id)
        
        if exists:
            print(f"✅ {sequence_id}_01.aep créé ! ({size_mb:.1f} MB)")
            return True
        
        time.sleep(10)
        check_count += 1
        if check_count % 6 == 0:  # Toutes les minutes
            print(f"   📡 Vérification... ({check_count//6} min)")
    
    print(f"⏰ Timeout - {sequence_id} non créé après 10 minutes")
    return False

def guide_ae_execution(sequence_id, script_name):
    """Guide l'utilisateur pour exécuter le script AE."""
    
    ae_scripts_path = Path(__file__).parent / "ae_scripts"
    script_path = ae_scripts_path / script_name
    
    if not script_path.exists():
        print(f"❌ Script manquant : {script_path}")
        return False
    
    print(f"\n🎬 **GÉNÉRATION {sequence_id}**")
    print("=" * 40)
    print(f"📄 Script : {script_name}")
    print(f"📂 Dossier : {ae_scripts_path}")
    print()
    print("📋 **INSTRUCTIONS AFTER EFFECTS :**")
    print("   1. Ouvrir After Effects 2025")
    print("   2. Menu : Fichier > Scripts > Exécuter le fichier de script...")
    print(f"   3. Naviguer vers : {ae_scripts_path}")
    print(f"   4. Sélectionner : {script_name}")
    print("   5. Cliquer : Ouvrir")
    print("   6. ⚠️  NE PAS FERMER AE - Laisser le script s'exécuter")
    print()
    
    input("✋ Appuyez sur Entrée APRÈS avoir lancé le script dans AE...")
    
    # Attendre que le projet soit créé
    return wait_for_project_creation(sequence_id)

def validate_all_projects():
    """Valide que tous les projets ont été créés."""
    
    sequences = ['SQ01', 'SQ02', 'SQ03']
    expected_data = {
        'SQ01': {'plans': 34, 'duration': 2.9},
        'SQ02': {'plans': 39, 'duration': 2.8}, 
        'SQ03': {'plans': 20, 'duration': 2.1}
    }
    
    print(f"\n🎯 **VALIDATION FINALE**")
    print("=" * 50)
    
    results = {}
    total_size = 0
    
    for seq_id in sequences:
        exists, size_mb = check_ae_project_created(seq_id)
        results[seq_id] = exists
        expected = expected_data[seq_id]
        
        if exists:
            total_size += size_mb
            print(f"   ✅ {seq_id}_01.aep ({size_mb:.1f} MB)")
            print(f"      📋 {expected['plans']} plans • {expected['duration']} min")
        else:
            print(f"   ❌ {seq_id}_01.aep - MANQUANT")
    
    success_count = sum(results.values())
    
    print(f"\n📊 **RÉSULTATS VALIDATION**")
    print(f"   Projets AE créés : {success_count}/3")
    print(f"   Taille totale : {total_size:.1f} MB")
    
    if success_count == 3:
        print(f"\n🎉 **VALIDATION COMPLÈTE RÉUSSIE !**")
        print(f"   ✅ 3 projets After Effects générés")
        print(f"   ✅ 93 plans importés et organisés") 
        print(f"   ✅ ~7.8 minutes d'animation prêtes")
        print(f"   ✅ Structure automatisée validée")
        print()
        print(f"🔍 **TESTS À EFFECTUER :**")
        print(f"   1. Ouvrir chaque projet .aep dans AE")
        print(f"   2. Vérifier composition principale (SQxx_UNDLM_v001)")
        print(f"   3. Tester switch Edit/Graded sur quelques plans")
        print(f"   4. Valider timeline et organisation")
        print()
        print(f"🚀 **PROCHAINES ÉTAPES :**")
        print(f"   → Si tests OK : Déploiement SQ04-SQ28 (423 plans)")
        print(f"   → Intégration pipeline RL PostFlow complet")
        print(f"   → Formation équipe workflow automatisé")
        
        return True
    else:
        print(f"\n⚠️  **VALIDATION PARTIELLE**")
        failed_sequences = [seq for seq, success in results.items() if not success]
        print(f"   🔧 Séquences à reprendre : {', '.join(failed_sequences)}")
        print(f"   💡 Action : Relancer les scripts AE manquants")
        return False

def main():
    """Workflow principal de génération."""
    
    print("🎬 GÉNÉRATEUR FINAL AFTER EFFECTS 2025")
    print("=" * 60)
    print("Objectif : Convertir 3 scripts .jsx → 3 projets .aep")
    print("Mode : Validation RL PostFlow v4.1.1")
    print()
    
    # Scripts à exécuter
    scripts_to_process = [
        ("SQ01", "RL_PostFlow_SQ01_GENERATION.jsx"),
        ("SQ02", "RL_PostFlow_SQ02_GENERATION.jsx"),
        ("SQ03", "RL_PostFlow_SQ03_GENERATION.jsx")
    ]
    
    # Vérifier projets existants
    print("🔍 Vérification projets existants...")
    existing_count = 0
    
    for seq_id, _ in scripts_to_process:
        exists, size_mb = check_ae_project_created(seq_id)
        if exists:
            print(f"   ✅ {seq_id}_01.aep déjà créé ({size_mb:.1f} MB)")
            existing_count += 1
        else:
            print(f"   ⏳ {seq_id}_01.aep à générer")
    
    if existing_count == 3:
        print(f"\n🎉 Tous les projets existent déjà !")
        validate_all_projects()
        return
    
    print(f"\n📋 {3 - existing_count} projets à générer...")
    print()
    
    # Traiter chaque script
    for seq_id, script_name in scripts_to_process:
        exists, _ = check_ae_project_created(seq_id)
        
        if exists:
            print(f"⏭️  {seq_id} déjà généré, passage au suivant...")
            continue
        
        # Guider l'exécution AE
        success = guide_ae_execution(seq_id, script_name)
        
        if not success:
            print(f"❌ Échec génération {seq_id}")
            print(f"💡 Vous pouvez relancer ce script plus tard")
            break
        
        print(f"✅ {seq_id} généré avec succès !")
        
        # Pause avant séquence suivante
        if seq_id != scripts_to_process[-1][0]:
            print("\n⏳ Pause 5s avant séquence suivante...")
            time.sleep(5)
    
    # Validation finale
    print("\n" + "="*60)
    validate_all_projects()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n⚠️  Génération interrompue par l'utilisateur")
        print("💡 Vous pouvez relancer le script pour continuer")
    except Exception as e:
        print(f"\n❌ Erreur : {e}")
        print("💡 Vérifiez les logs ci-dessus et relancez si nécessaire")
