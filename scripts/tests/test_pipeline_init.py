#!/usr/bin/env python3
"""
Test simple pour isoler le problème de main.py
"""

import sys
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

print("🧪 Test d'initialisation du pipeline...")

try:
    print("1. Import des modules...")
    from main import RLPostFlowPipeline
    print("✅ Import RLPostFlowPipeline OK")
    
    print("2. Création de l'instance...")
    pipeline = RLPostFlowPipeline()
    print("✅ Création pipeline OK")
    
    print("3. Test du statut...")
    status = pipeline.get_status()
    print(f"✅ Statut: {status['running']}")
    
    print("🎉 Test réussi !")

except Exception as e:
    print(f"❌ Erreur: {e}")
    import traceback
    traceback.print_exc()
