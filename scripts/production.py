#!/usr/bin/env python3
"""
Script principal de production PostFlow
Lance le workflow complet de production
"""

import os
import sys
import logging
import asyncio
from pathlib import Path

# Ajouter le répertoire src au PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from src.core.production_workflow import ProductionWorkflow
from src.utils.config import ConfigManager

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/production.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


async def main():
    """Point d'entrée principal."""
    logger.info("🚀 PostFlow Production - Démarrage")
    
    # Vérifier la configuration
    config = ConfigManager()
    if not config.validate_config():
        logger.error("❌ Configuration invalide")
        
        # Créer une configuration par défaut
        logger.info("📝 Création configuration par défaut...")
        config.create_default_config()
        
        logger.info("✅ Configuration par défaut créée")
        logger.info("📝 Veuillez éditer config/integrations.json avec vos paramètres")
        return
    
    # Créer le workflow
    workflow = ProductionWorkflow()
    
    try:
        # Démarrer le workflow
        await workflow.start()
        
        # Boucle principale
        logger.info("🔄 Workflow actif - Surveillance des fichiers LucidLink...")
        logger.info("⏹️  Ctrl+C pour arrêter")
        
        await workflow.wait_for_files()
        
    except KeyboardInterrupt:
        logger.info("🛑 Arrêt demandé par l'utilisateur")
        
    except Exception as e:
        logger.error(f"❌ Erreur fatale: {e}")
        
    finally:
        # Arrêter proprement
        await workflow.stop()
        logger.info("👋 PostFlow Production arrêté")


if __name__ == "__main__":
    # Créer les répertoires nécessaires
    os.makedirs("logs", exist_ok=True)
    os.makedirs("output", exist_ok=True)
    os.makedirs("output/thumbnails", exist_ok=True)
    
    # Lancer le workflow
    asyncio.run(main())
