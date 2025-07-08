#!/usr/bin/env python3
"""
Test de l'intégration Frame.io modulaire OAuth autonome
"""

import asyncio
import logging
import sys
from pathlib import Path

# Ajouter le chemin du projet
sys.path.insert(0, str(Path(__file__).parent))

from src.integrations.frameio.auth import FrameIOAuth, create_frameio_auth

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def test_auth_module():
    """Test du module d'authentification autonome"""
    logger.info("🧪 Test du module d'authentification Frame.io OAuth autonome")
    
    try:
        # Créer une instance d'authentification
        auth = create_frameio_auth()
        logger.info("✅ Instance d'authentification créée")
        
        # Tester la configuration
        logger.info(f"Client ID: {auth.oauth_config['client_id']}")
        logger.info(f"Base URL: {auth.base_url}")
        logger.info(f"Scopes: {auth.required_scopes}")
        
        # Tester la validité du token
        is_valid = auth.is_token_valid()
        logger.info(f"Token valide: {is_valid}")
        
        if is_valid:
            # Tester la connexion à l'API
            logger.info("Test de connexion à l'API Frame.io...")
            success = await auth.test_connection()
            
            if success:
                logger.info("✅ Connexion API réussie")
                
                # Tester une requête GET simple
                logger.info("Test d'une requête GET sur /me...")
                response = await auth.get('/me')
                if response.status_code == 200:
                    user_data = response.json()
                    logger.info(f"✅ Utilisateur connecté: {user_data.get('name', 'Inconnu')}")
                else:
                    logger.warning(f"❌ Requête GET échouée: {response.status_code}")
            else:
                logger.warning("❌ Connexion API échouée")
        else:
            logger.warning("❌ Token invalide - authentification requise")
            
            # Générer une URL d'autorisation
            auth_url = auth.generate_auth_url()
            logger.info(f"URL d'autorisation: {auth_url}")
            
    except Exception as e:
        logger.error(f"❌ Erreur lors du test: {e}")
        raise

async def test_integration_imports():
    """Test des imports de l'intégration"""
    logger.info("🧪 Test des imports de l'intégration Frame.io")
    
    try:
        from src.integrations.frameio import (
            FrameIOAuth, 
            FrameIOStructureManager, 
            FrameIOUploadManager,
            FrameIOIntegrationManager
        )
        logger.info("✅ Tous les imports sont fonctionnels")
        
        # Test création d'une instance auth
        auth = FrameIOAuth()
        logger.info("✅ Instance FrameIOAuth créée")
        
        # Test création des managers
        structure_manager = FrameIOStructureManager(auth)
        logger.info("✅ FrameIOStructureManager créé")
        
        upload_manager = FrameIOUploadManager(auth)
        logger.info("✅ FrameIOUploadManager créé")
        
        integration_manager = FrameIOIntegrationManager(auth)
        logger.info("✅ FrameIOIntegrationManager créé")
        
    except Exception as e:
        logger.error(f"❌ Erreur lors du test d'imports: {e}")
        raise

async def main():
    """Fonction principale de test"""
    logger.info("🚀 Début des tests de l'intégration Frame.io modulaire")
    
    try:
        await test_integration_imports()
        await test_auth_module()
        
        logger.info("🎉 Tous les tests sont passés avec succès!")
        
    except Exception as e:
        logger.error(f"💥 Tests échoués: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
