#!/usr/bin/env python3
"""
Test spécifique pour un fichier LucidLink donné
"""

import asyncio
import logging
import sys
from pathlib import Path

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from main import RLPostFlowPipeline

async def test_lucidlink_file(file_path: str):
    """Test d'upload d'un fichier LucidLink spécifique"""
    try:
        test_file = Path(file_path)
        if not test_file.exists():
            logger.error(f"❌ Fichier non trouvé: {file_path}")
            return False
        
        logger.info(f"🚀 Test d'upload LucidLink spécifique...")
        logger.info(f"📄 Fichier: {test_file}")
        logger.info(f"📏 Taille: {test_file.stat().st_size:,} bytes")
        
        # Créer le pipeline
        pipeline = RLPostFlowPipeline()
        
        # Initialiser les composants
        logger.info("🔄 Initialisation des composants...")
        
        frameio_ok = await pipeline.initialize_frameio()
        if not frameio_ok:
            logger.error("❌ Échec initialisation Frame.io")
            return False
        
        infrastructure_ok = await pipeline.initialize_shared_infrastructure()
        if not infrastructure_ok:
            logger.error("❌ Échec initialisation infrastructure")
            return False
        
        logger.info("✅ Composants initialisés")
        
        # Traiter le fichier
        logger.info("🔄 Traitement du fichier LucidLink...")
        success = await pipeline.process_file(test_file)
        
        if success:
            logger.info("✅ Upload initié avec succès !")
            logger.info(f"🎬 Fichier uploadé: {test_file.name}")
            
            # GARDER LE SERVEUR OUVERT pour que Frame.io puisse télécharger
            logger.info("⏳ Serveur reste ouvert pour téléchargement Frame.io...")
            logger.info("💡 Frame.io télécharge de manière asynchrone, patience requise...")
            
            # Attendre 5 minutes pour que Frame.io télécharge
            wait_time = 300  # 5 minutes
            logger.info(f"⏰ Attente de {wait_time} secondes pour téléchargement complet...")
            
            for i in range(wait_time // 10):
                await asyncio.sleep(10)
                remaining = wait_time - (i + 1) * 10
                logger.info(f"⏳ Encore {remaining} secondes... (serveur actif)")
            
            logger.info("✅ Période d'attente terminée")
        else:
            logger.error("❌ Échec upload")
        
        # Cleanup
        logger.info("🛑 Arrêt du serveur...")
        await pipeline.shutdown()
        
        return success
        
    except Exception as e:
        logger.error(f"❌ Erreur test: {e}")
        return False

async def main():
    """Fonction principale"""
    if len(sys.argv) != 2:
        print("Usage: python test_lucidlink_specific.py <fichier_lucidlink>")
        return 1
    
    file_path = sys.argv[1]
    success = await test_lucidlink_file(file_path)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
