#!/usr/bin/env python3
"""
🧪 Test des utilitaires LucidLink
==============================

Test de détection et d'attente de synchronisation LucidLink
"""

import asyncio
import logging
import sys
from pathlib import Path

# Ajouter le répertoire parent au path
sys.path.insert(0, str(Path(__file__).parent))

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

from src.utils.lucidlink_utils import lucidlink_detector, lucidlink_waiter

async def test_lucidlink_detection():
    """Test de détection LucidLink"""
    logger.info("🔍 Test de détection LucidLink...")
    
    # Vérifier si LucidLink est monté
    logger.info(f"LucidLink monté: {lucidlink_detector.is_lucidlink_mounted}")
    logger.info(f"Chemins LucidLink: {lucidlink_detector.lucidlink_paths}")
    
    # Tester avec des fichiers existants
    test_files = [
        Path.home() / "Downloads" / "test.txt",
        Path("/tmp/test.txt"),
        Path.cwd() / "README.md"
    ]
    
    for file_path in test_files:
        if file_path.exists():
            is_lucidlink = lucidlink_detector.is_lucidlink_file(file_path)
            status = lucidlink_detector.get_lucidlink_file_status(file_path)
            logger.info(f"📁 {file_path.name}: LucidLink={is_lucidlink}, Status={status}")
            
            # Test d'attente de synchronisation
            logger.info(f"⏳ Test d'attente pour {file_path.name}...")
            result = await lucidlink_waiter.wait_for_complete_sync(file_path, max_wait=30)
            logger.info(f"✅ Résultat attente: {result}")
            break
    else:
        logger.warning("⚠️ Aucun fichier de test trouvé")

async def test_with_sample_file():
    """Test avec un fichier d'exemple"""
    logger.info("📄 Test avec fichier d'exemple...")
    
    # Créer un fichier de test
    test_file = Path("/tmp/lucidlink_test.txt")
    test_file.write_text("Test LucidLink synchronization\n" * 100)
    
    logger.info(f"🔍 Test avec {test_file}")
    
    # Tester la détection
    is_lucidlink = lucidlink_detector.is_lucidlink_file(test_file)
    logger.info(f"Détection LucidLink: {is_lucidlink}")
    
    # Tester l'attente
    result = await lucidlink_waiter.wait_for_complete_sync(test_file, max_wait=30)
    logger.info(f"Attente terminée: {result}")
    
    # Nettoyer
    test_file.unlink()

async def main():
    """Fonction principale du test"""
    logger.info("🚀 Démarrage des tests LucidLink...")
    
    try:
        await test_lucidlink_detection()
        await test_with_sample_file()
        logger.info("✅ Tests terminés avec succès")
        
    except Exception as e:
        logger.error(f"❌ Erreur lors des tests: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
