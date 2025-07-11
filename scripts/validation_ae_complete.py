#!/usr/bin/env python3
"""
Script de Validation Rapide After Effects
Lancement simple pour valider le workflow sur les 3 premières séquences
"""

import sys
import os
from pathlib import Path

# Ajouter src au path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

def main():
    """Lance la validation complète du workflow After Effects."""
    
    print("🎬 VALIDATION WORKFLOW AFTER EFFECTS - RL POSTFLOW")
    print("=" * 55)
    print("🎯 Objectif : Valider la génération automatique de projets AE")
    print("📋 Séquences : SQ01, SQ02, SQ03 (93 plans total)")
    print()
    
    print("📝 Ce script va :")
    print("   1. 📊 Analyser les données Google Sheets")
    print("   2. 📄 Générer les scripts ExtendScript")  
    print("   3. 📁 Créer l'arborescence SEQUENCES/")
    print("   4. 🎬 Exécuter les scripts dans After Effects")
    print("   5. 🔍 Valider les projets .aep générés")
    print()
    
    # Demander confirmation
    response = input("🚀 Démarrer la validation ? (y/N): ")
    if response.lower() not in ['y', 'yes', 'oui']:
        print("❌ Validation annulée")
        return
    
    print("\n" + "=" * 55)
    
    try:
        # ÉTAPE 1: Analyser Google Sheets
        print("📊 ÉTAPE 1/5 : ANALYSE GOOGLE SHEETS")
        os.system("python scripts/analyze_gsheets_data.py --validation")
        
        print("\n" + "-" * 55)
        
        # ÉTAPE 2: Générer scripts ExtendScript
        print("📄 ÉTAPE 2/5 : GÉNÉRATION SCRIPTS EXTENDSCRIPT")
        result = os.system("python scripts/generate_ae_projects.py --validation --dry-run")
        
        if result != 0:
            print("❌ Erreur génération scripts - Arrêt")
            return
        
        print("\n" + "-" * 55)
        
        # ÉTAPE 3-5: Déploiement complet
        print("🚀 ÉTAPES 3-5 : DÉPLOIEMENT COMPLET")
        result = os.system("python scripts/deploy_ae_validation.py")
        
        if result == 0:
            print("\n🎉 VALIDATION RÉUSSIE !")
            print("✅ Les projets After Effects ont été générés avec succès")
            print()
            print("📂 Projets générés :")
            print("   🎬 SEQUENCES/SQ01/_AE/SQ01_01.aep")
            print("   🎬 SEQUENCES/SQ02/_AE/SQ02_01.aep") 
            print("   🎬 SEQUENCES/SQ03/_AE/SQ03_01.aep")
            print()
            print("💡 Prochaines étapes :")
            print("   1. Ouvrir les projets dans After Effects")
            print("   2. Vérifier l'import des plans et le switch Edit/Graded")
            print("   3. Valider avec l'équipe")
            print("   4. Déployer sur toutes les séquences")
        else:
            print("\n⚠️  VALIDATION PARTIELLE")
            print("❌ Certaines étapes ont échoué")
            print("💡 Vérifiez les logs ci-dessus pour identifier les problèmes")
            
    except Exception as e:
        print(f"\n❌ Erreur critique : {e}")
        return

if __name__ == "__main__":
    main()
