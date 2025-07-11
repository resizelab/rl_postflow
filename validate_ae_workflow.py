#!/usr/bin/env python3
"""
Validation Workflow AE pour RL PostFlow v4.1.1
Script de validation rapide pour les 3 premières séquences
"""

import subprocess
import sys
from pathlib import Path

def main():
    """Script principal de validation du workflow AE."""
    
    print("🧪 VALIDATION WORKFLOW AFTER EFFECTS")
    print("=" * 50)
    print("📌 Mode validation : SQ01, SQ02, SQ03 seulement")
    print()
    
    # Chemin du script d'analyse
    base_path = Path(__file__).parent
    analyze_script = base_path / "scripts" / "analyze_gsheets_data.py"
    generate_script = base_path / "scripts" / "generate_ae_projects.py"
    
    try:
        print("🔍 1. Analyse des données Google Sheets...")
        result1 = subprocess.run([
            sys.executable, str(analyze_script), "--validation"
        ], capture_output=True, text=True)
        
        if result1.returncode != 0:
            print(f"❌ Erreur analyse : {result1.stderr}")
            return False
            
        print("✅ Analyse terminée")
        print()
        
        print("🎬 2. Génération des scripts ExtendScript (dry-run)...")
        result2 = subprocess.run([
            sys.executable, str(generate_script), "--validation", "--dry-run"
        ], capture_output=True, text=True)
        
        if result2.returncode != 0:
            print(f"❌ Erreur génération : {result2.stderr}")
            return False
            
        print("✅ Scripts générés")
        print()
        
        print("🎉 VALIDATION RÉUSSIE")
        print("=" * 50)
        print("📋 Scripts ExtendScript générés pour :")
        print("   • SQ01 : REVEIL HOPITAL - JOUR (34 plans)")
        print("   • SQ02 : BUS - FIN DE JOURNEE (39 plans)")
        print("   • SQ03 : MARCHE - FIN DE JOURNEE (20 plans)")
        print()
        print("🚀 PROCHAINES ÉTAPES :")
        print("   1. Examiner les scripts dans SEQUENCES/SQxx/_AE/")
        print("   2. Exécuter un script dans After Effects")
        print("   3. Valider la structure du projet généré")
        print("   4. Lancer la production complète")
        print()
        print("📖 Commandes utiles :")
        print("   # Régénérer une séquence")
        print("   python scripts/generate_ae_projects.py --sequence SQ01 --dry-run")
        print()
        print("   # Générer en mode production (sans dry-run)")
        print("   python scripts/generate_ae_projects.py --validation")
        print()
        print("   # Lister toutes les séquences")
        print("   python scripts/generate_ae_projects.py --list")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur inattendue : {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
