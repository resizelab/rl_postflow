#!/usr/bin/env python3
"""
Test rapide pour valider le traitement d'un fichier spécifique
"""
import asyncio
import sys
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from main import RLPostFlowPipeline

async def test_file_processing():
    """Test direct du traitement de fichier"""
    print("🧪 Test direct du traitement de fichier...")
    
    # Initialiser le pipeline
    pipeline = RLPostFlowPipeline()
    
    # Initialiser les composants
    frameio_ok = await pipeline.initialize_frameio()
    if not frameio_ok:
        print("❌ Échec initialisation Frame.io")
        return False
    
    # Tester le traitement du fichier
    test_file = Path("/Volumes/resizelab/o2b-undllm/4_OUT/2_FROM_VFX/BY_SHOT/UNDLM_00001/UNDLM_00001_v001.mov")
    
    if not test_file.exists():
        print(f"❌ Fichier non trouvé: {test_file}")
        return False
    
    print(f"📁 Fichier trouvé: {test_file}")
    print(f"📊 Taille: {test_file.stat().st_size / (1024*1024):.1f} MB")
    
    # Traiter le fichier
    result = await pipeline.process_file(test_file)
    
    if result:
        print("✅ Traitement réussi !")
    else:
        print("❌ Traitement échoué")
    
    return result

if __name__ == "__main__":
    try:
        result = asyncio.run(test_file_processing())
        sys.exit(0 if result else 1)
    except Exception as e:
        print(f"💥 Erreur: {e}")
        sys.exit(1)
