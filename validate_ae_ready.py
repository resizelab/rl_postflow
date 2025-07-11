#!/usr/bin/env python3
"""
🎬 Validation After Effects - RL PostFlow v4.1.1
Script de validation rapide pour les 3 premières séquences
"""

import os
import sys
from pathlib import Path

def main():
    """Script de validation interactif."""
    
    print("🎬 VALIDATION AFTER EFFECTS 2025 - RL POSTFLOW")
    print("=" * 50)
    print("Mode : Validation (SQ01, SQ02, SQ03)")
    print()
    
    # Vérifications préliminaires
    ae_scripts_path = Path(__file__).parent / "ae_scripts"
    sequences_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES")
    
    print("🔍 Vérifications préliminaires...")
    
    # Vérifier scripts
    scripts = [
        "RL_PostFlow_SQ01_GENERATION.jsx",
        "RL_PostFlow_SQ02_GENERATION.jsx", 
        "RL_PostFlow_SQ03_GENERATION.jsx"
    ]
    
    scripts_ok = True
    for script in scripts:
        script_path = ae_scripts_path / script
        if script_path.exists():
            size_kb = script_path.stat().st_size / 1024
            print(f"   ✅ {script} ({size_kb:.0f} KB)")
        else:
            print(f"   ❌ {script} - MANQUANT")
            scripts_ok = False
    
    # Vérifier arborescence
    sequences = ['SQ01', 'SQ02', 'SQ03']
    arbo_ok = True
    
    print()
    print("📁 Vérification arborescence...")
    
    for seq_id in sequences:
        seq_path = sequences_path / seq_id
        ae_folder = seq_path / "_AE"
        eb_folder = seq_path / "_EB"
        
        if seq_path.exists() and ae_folder.exists() and eb_folder.exists():
            plan_count = len([d for d in eb_folder.iterdir() if d.is_dir()])
            print(f"   ✅ {seq_id} - {plan_count} dossiers plans")
        else:
            print(f"   ❌ {seq_id} - Arborescence incomplète")
            arbo_ok = False
    
    # Volume réseau
    volume_ok = sequences_path.exists()
    print()
    print("💾 Vérification volume réseau...")
    if volume_ok:
        print(f"   ✅ Volume monté : {sequences_path}")
    else:
        print(f"   ❌ Volume non monté : {sequences_path}")
    
    # After Effects
    ae_path = Path("/Applications/Adobe After Effects 2025/Adobe After Effects 2025.app")
    ae_ok = ae_path.exists()
    print()
    print("🎬 Vérification After Effects 2025...")
    if ae_ok:
        print(f"   ✅ After Effects 2025 installé")
    else:
        print(f"   ❌ After Effects 2025 non trouvé")
    
    print()
    print("=" * 50)
    
    # Résultats
    all_ok = scripts_ok and arbo_ok and volume_ok and ae_ok
    
    if all_ok:
        print("🎉 VALIDATION PRÊTE !")
        print()
        print("📋 INSTRUCTIONS :")
        print("   1. Ouvrir After Effects 2025")
        print("   2. Fichier > Scripts > Exécuter le fichier de script...")
        print(f"   3. Naviguer vers : {ae_scripts_path}")
        print("   4. Exécuter dans l'ordre :")
        print("      • RL_PostFlow_SQ01_GENERATION.jsx")
        print("      • RL_PostFlow_SQ02_GENERATION.jsx") 
        print("      • RL_PostFlow_SQ03_GENERATION.jsx")
        print()
        print("⏱️  Temps estimé : 6-9 minutes total")
        print("🎯 Objectif : 3 projets .aep générés")
        print()
        print("📖 Guide détaillé : ae_scripts/README_VALIDATION_AE.md")
        
    else:
        print("❌ VALIDATION NON PRÊTE")
        print()
        print("🔧 Actions requises :")
        if not scripts_ok:
            print("   • Regénérer les scripts ExtendScript")
        if not arbo_ok:
            print("   • Recréer l'arborescence SEQUENCES")
        if not volume_ok:
            print("   • Monter le volume réseau resizelab")
        if not ae_ok:
            print("   • Installer After Effects 2025")
        print()
        print("💡 Commande : python scripts/deploy_ae_complete.py --validation")

if __name__ == "__main__":
    main()
