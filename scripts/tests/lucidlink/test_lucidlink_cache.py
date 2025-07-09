#!/usr/bin/env python3
"""
🧪 Test de mise en cache LucidLink
===============================

Test de la nouvelle fonctionnalité de mise en cache LucidLink
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

async def test_lucidlink_cache():
    """Test de mise en cache LucidLink"""
    logger.info("🧪 Test de mise en cache LucidLink...")
    
    # Trouver un fichier LucidLink de test
    test_files = [
        Path("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00402.mov"),
        Path("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00338.mov"),
        Path("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00339.mov")
    ]
    
    test_file = None
    for file_path in test_files:
        if file_path.exists():
            test_file = file_path
            break
    
    if not test_file:
        logger.error("❌ Aucun fichier de test LucidLink trouvé")
        return False
    
    logger.info(f"📄 Fichier de test: {test_file}")
    logger.info(f"📏 Taille: {test_file.stat().st_size:,} bytes")
    
    # Test 1: Vérifier la détection LucidLink
    is_lucidlink = lucidlink_detector.is_lucidlink_file(test_file)
    logger.info(f"🔍 Détection LucidLink: {is_lucidlink}")
    
    if not is_lucidlink:
        logger.error("❌ Le fichier n'est pas détecté comme LucidLink")
        return False
    
    # Test 2: Vérifier le statut initial du cache
    initial_status = lucidlink_detector.get_lucidlink_file_status(test_file)
    logger.info(f"📊 Statut initial: {initial_status}")
    
    # Test 3: Forcer la mise en cache
    logger.info("🔄 Test de mise en cache forcée...")
    cache_success = lucidlink_detector.force_cache_file(test_file)
    logger.info(f"✅ Mise en cache: {'Réussie' if cache_success else 'Échouée'}")
    
    # Test 4: Vérifier le statut après mise en cache
    cached_status = lucidlink_detector.get_lucidlink_file_status(test_file)
    logger.info(f"📊 Statut après cache: {cached_status}")
    
    # Test 5: Test d'attente de synchronisation complète
    logger.info("⏳ Test d'attente de synchronisation complète...")
    sync_success = await lucidlink_waiter.wait_for_complete_sync(test_file, max_wait=120)
    logger.info(f"✅ Synchronisation: {'Réussie' if sync_success else 'Échouée'}")
    
    return sync_success

async def test_file_integrity():
    """Test d'intégrité des fichiers"""
    logger.info("🔍 Test d'intégrité des fichiers...")
    
    # Tester avec le fichier de test par défaut
    test_file = Path("data/TEST_DEFAUT_VIDEO.mp4")
    if test_file.exists():
        logger.info(f"📄 Test avec fichier local: {test_file}")
        
        # Vérifier si c'est LucidLink (ne devrait pas l'être)
        is_lucidlink = lucidlink_detector.is_lucidlink_file(test_file)
        logger.info(f"🔍 Détection LucidLink: {is_lucidlink}")
        
        # Test d'attente pour fichier local
        sync_success = await lucidlink_waiter.wait_for_complete_sync(test_file, max_wait=30)
        logger.info(f"✅ Synchronisation fichier local: {'Réussie' if sync_success else 'Échouée'}")
        
        return sync_success
    
    return False

async def main():
    """Fonction principale"""
    logger.info("🚀 Test complet de mise en cache LucidLink...")
    
    try:
        # Test 1: Fichiers LucidLink
        lucidlink_success = await test_lucidlink_cache()
        
        # Test 2: Fichiers locaux
        local_success = await test_file_integrity()
        
        logger.info("📊 RÉSULTATS FINAUX:")
        logger.info(f"  - Test LucidLink: {'✅ Réussi' if lucidlink_success else '❌ Échoué'}")
        logger.info(f"  - Test fichier local: {'✅ Réussi' if local_success else '❌ Échoué'}")
        
        return 0 if (lucidlink_success or local_success) else 1
        
    except Exception as e:
        logger.error(f"❌ Erreur lors des tests: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
