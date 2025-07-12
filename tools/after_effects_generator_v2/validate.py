#!/usr/bin/env python3
"""
Validation After Effects Generator v2
Vérifie que l'outil fonctionne correctement
"""

import sys
import os
from pathlib import Path

# Ajouter le script principal au path
sys.path.append(str(Path(__file__).parent))

from generate_ae_projects_v2 import AfterEffectsGeneratorV2

def validate_generator_v2():
    """Valide le générateur v2."""
    print("🧪 Validation After Effects Generator v2")
    print("=" * 50)
    
    try:
        # Initialiser le générateur
        generator = AfterEffectsGeneratorV2()
        print("✅ Générateur initialisé")
        
        # Vérifier la configuration
        if not generator.config_path.exists():
            print(f"❌ Configuration manquante : {generator.config_path}")
            print("   💡 Lancez : python ../../scripts/analyze_gsheets_data.py")
            return False
        print("✅ Configuration trouvée")
        
        # Charger les données
        sequence_data = generator.load_sequence_data()
        print(f"✅ Données chargées : {len(sequence_data)} séquences")
        
        # Vérifier SQ02 spécifiquement
        if 'SQ02' not in sequence_data:
            print("❌ SQ02 non trouvé dans les données")
            return False
        
        sq02_info = sequence_data['SQ02']
        print(f"✅ SQ02 trouvé : '{sq02_info['name']}' avec {len(sq02_info['plans'])} plans")
        
        # Test dry-run
        print("\n🧪 Test dry-run pour SQ02...")
        success = generator.generate_for_sequence('SQ02', dry_run=True)
        
        if success:
            print("✅ Dry-run SQ02 réussi")
        else:
            print("❌ Dry-run SQ02 échoué")
            return False
        
        # Vérifier chemins critiques
        print("\n🔍 Vérification des chemins...")
        
        paths_to_check = [
            ("FROM_EDIT", generator.from_edit_path),
            ("FROM_GRADING", generator.from_grading_path),
            ("SEQUENCES", generator.sequences_path),
            ("TEMPLATE", generator.template_path)
        ]
        
        for name, path in paths_to_check:
            if path.exists():
                print(f"✅ {name} : {path}")
            else:
                print(f"⚠️  {name} non trouvé : {path}")
        
        print("\n🎉 Validation terminée avec succès !")
        print("\n📋 Utilisation recommandée :")
        print("   python generate_ae_projects_v2.py --sequence SQ02 --dry-run")
        print("   python generate_ae_projects_v2.py --sequence SQ02")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur de validation : {e}")
        return False

if __name__ == "__main__":
    success = validate_generator_v2()
    sys.exit(0 if success else 1)
