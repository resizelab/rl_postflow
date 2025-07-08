#!/usr/bin/env python3
"""
Exemple d'utilisation de l'intégration LucidLink → Frame.io
Démontre le workflow complet : parsing → structure → upload → notification
"""

import asyncio
import os
import sys
from pathlib import Path
import logging

# Ajouter le chemin source au PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.frameio import create_frameio_integration, FrameIOIntegrationManager
from src.integrations.frameio.oauth_auth import FrameIOOAuthAuth

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def demo_single_file_upload():
    """Démo d'upload d'un seul fichier"""
    try:
        # Configuration (normalement chargée depuis un fichier JSON)
        config = {
            'frameio': {
                'account_id': os.getenv('FRAMEIO_ACCOUNT_ID'),
                'workspace_id': os.getenv('FRAMEIO_WORKSPACE_ID'),
                'project_id': os.getenv('FRAMEIO_PROJECT_ID'),
                'base_url': 'https://api.frame.io/v4',
                'oauth': {
                    'client_id': os.getenv('FRAMEIO_CLIENT_ID'),
                    'client_secret': os.getenv('FRAMEIO_CLIENT_SECRET'),
                    'jwt_key': os.getenv('FRAMEIO_JWT_KEY'),
                    'token_url': 'https://auth.frame.io/oauth2/token'
                }
            },
            'discord': {
                'webhook_url': os.getenv('DISCORD_WEBHOOK_URL')
            }
        }
        
        # Vérifier la configuration
        if not config['frameio']['account_id']:
            logger.error("❌ Configuration Frame.io manquante. Vérifiez les variables d'environnement.")
            return
        
        # Créer l'instance d'intégration
        integration = create_frameio_integration(config)
        
        # Fichier d'exemple (vous devez ajuster le chemin)
        test_file = "/path/to/your/test/file/SC01_UNDLM_00412_V002.mov"
        
        # Vérifier que le fichier existe
        if not Path(test_file).exists():
            logger.error(f"❌ Fichier d'exemple introuvable: {test_file}")
            logger.info("📝 Créez un fichier de test avec le format: SCENE_SHOT_VERSION.mov")
            logger.info("📝 Exemple: SC01_UNDLM_00412_V002.mov")
            return
        
        logger.info(f"🚀 Traitement du fichier: {test_file}")
        
        # Traiter le fichier
        result = await integration.process_file(test_file)
        
        # Afficher le résultat
        if result['status'] == 'success':
            logger.info("✅ Upload réussi !")
            logger.info(f"🎬 Nomenclature: {result['metadata']['nomenclature']}")
            logger.info(f"📁 Dossier ID: {result['folder_id']}")
            logger.info(f"🔗 Lien review: {result['upload_result']['review_link']}")
        else:
            logger.error(f"❌ Échec: {result['error']}")
        
    except Exception as e:
        logger.error(f"❌ Erreur démo: {e}")

async def demo_batch_upload():
    """Démo d'upload en lot"""
    try:
        # Configuration (même que ci-dessus)
        config = {
            'frameio': {
                'account_id': os.getenv('FRAMEIO_ACCOUNT_ID'),
                'workspace_id': os.getenv('FRAMEIO_WORKSPACE_ID'),
                'project_id': os.getenv('FRAMEIO_PROJECT_ID'),
                'base_url': 'https://api.frame.io/v4',
                'oauth': {
                    'client_id': os.getenv('FRAMEIO_CLIENT_ID'),
                    'client_secret': os.getenv('FRAMEIO_CLIENT_SECRET'),
                    'jwt_key': os.getenv('FRAMEIO_JWT_KEY'),
                    'token_url': 'https://auth.frame.io/oauth2/token'
                }
            },
            'discord': {
                'webhook_url': os.getenv('DISCORD_WEBHOOK_URL')
            }
        }
        
        # Créer l'instance d'intégration
        integration = create_frameio_integration(config)
        
        # Fichiers d'exemple
        test_files = [
            "/path/to/your/test/files/SC01_UNDLM_00412_V002.mov",
            "/path/to/your/test/files/SC02_UNDLM_00413_V001.mov",
            "/path/to/your/test/files/SC01_UNDLM_00412_V003.mov"
        ]
        
        # Filtrer les fichiers qui existent vraiment
        existing_files = [f for f in test_files if Path(f).exists()]
        
        if not existing_files:
            logger.error("❌ Aucun fichier d'exemple trouvé")
            return
        
        logger.info(f"🚀 Traitement batch de {len(existing_files)} fichiers")
        
        # Traiter les fichiers
        results = await integration.process_batch(existing_files, max_concurrent=2)
        
        # Afficher les résultats
        success_count = sum(1 for r in results if r['status'] == 'success')
        logger.info(f"✅ Batch terminé: {success_count}/{len(results)} réussis")
        
        for i, result in enumerate(results):
            if result['status'] == 'success':
                logger.info(f"  ✅ {i+1}. {result['metadata']['nomenclature']}")
            else:
                logger.error(f"  ❌ {i+1}. {Path(result['file_path']).name} - {result['error']}")
        
    except Exception as e:
        logger.error(f"❌ Erreur démo batch: {e}")

async def demo_parser_only():
    """Démo du parser seul"""
    try:
        from src.integrations.frameio.parser import FrameIOFileParser
        
        parser = FrameIOFileParser()
        
        # Exemples de noms de fichiers à tester
        test_files = [
            "SC01_UNDLM_00412_V002.mov",
            "13H49_-_RECUPERATION_DES_2_SURVIVANTS_S01_V001.mov",
            "2EME_MAYDAY_EXT_-_NUIT_AMERICAINE_S03_V005.mp4",
            "DOUANE_MER_-_JOUR_S02_V001.prores",
            "fichier_invalide.mov"  # Ce fichier ne devrait pas être parsé
        ]
        
        logger.info("🔍 Test du parser de fichiers")
        
        for filename in test_files:
            logger.info(f"\n📄 Test: {filename}")
            
            metadata = parser.parse_filename(filename)
            if metadata:
                logger.info(f"  ✅ Parsé avec succès:")
                logger.info(f"    🎬 Scène: {metadata.scene_name}")
                logger.info(f"    🎞️ Plan: {metadata.shot_id}")
                logger.info(f"    🔁 Version: {metadata.version}")
                logger.info(f"    📝 Nomenclature: {metadata.nomenclature}")
                logger.info(f"    🏷️ Tags: {metadata.tags}")
                logger.info(f"    📖 Description: {metadata.description}")
            else:
                logger.warning(f"  ❌ Échec du parsing")
        
    except Exception as e:
        logger.error(f"❌ Erreur démo parser: {e}")

async def demo_structure_manager():
    """Démo du gestionnaire de structure"""
    try:
        # Configuration minimale
        config = {
            'frameio': {
                'account_id': os.getenv('FRAMEIO_ACCOUNT_ID'),
                'workspace_id': os.getenv('FRAMEIO_WORKSPACE_ID'),
                'project_id': os.getenv('FRAMEIO_PROJECT_ID'),
                'base_url': 'https://api.frame.io/v4',
                'oauth': {
                    'client_id': os.getenv('FRAMEIO_CLIENT_ID'),
                    'client_secret': os.getenv('FRAMEIO_CLIENT_SECRET'),
                    'jwt_key': os.getenv('FRAMEIO_JWT_KEY'),
                    'token_url': 'https://auth.frame.io/oauth2/token'
                }
            }
        }
        
        if not config['frameio']['account_id']:
            logger.error("❌ Configuration Frame.io manquante")
            return
        
        # Créer l'auth et le gestionnaire de structure
        auth = FrameIOOAuthAuth(config)
        from src.integrations.frameio.structure import FrameIOStructureManager
        structure_manager = FrameIOStructureManager(auth)
        
        # Test de création de structure
        logger.info("🏗️ Test de création de structure")
        
        # Exemples de scènes et plans
        test_structures = [
            ("13H49_-_RECUPERATION_DES_2_SURVIVANTS", "S01"),
            ("2EME_MAYDAY_EXT_-_NUIT_AMERICAINE", "S03"),
            ("DOUANE_MER_-_JOUR", "S02")
        ]
        
        for scene_name, shot_id in test_structures:
            logger.info(f"\n📁 Création/récupération: {scene_name}/{shot_id}")
            
            folder_id = await structure_manager.get_or_create_folder_path(scene_name, shot_id)
            if folder_id:
                logger.info(f"  ✅ Folder ID: {folder_id}")
            else:
                logger.error(f"  ❌ Échec création structure")
        
        # Afficher le résumé de la structure
        logger.info("\n📊 Résumé de la structure:")
        summary = await structure_manager.get_folder_structure_summary()
        logger.info(f"  🎬 Projet: {summary.get('project_name', 'N/A')}")
        logger.info(f"  📁 Scènes: {summary.get('scenes_count', 0)}")
        logger.info(f"  🎞️ Plans: {summary.get('shots_count', 0)}")
        
    except Exception as e:
        logger.error(f"❌ Erreur démo structure: {e}")

async def main():
    """Fonction principale avec menu de démo"""
    try:
        print("🎬 Frame.io Integration Demo")
        print("=" * 50)
        print("1. Test du parser seul")
        print("2. Test du gestionnaire de structure")
        print("3. Upload d'un fichier unique")
        print("4. Upload en batch")
        print("5. Tout tester")
        print("=" * 50)
        
        choice = input("Choisissez une option (1-5): ").strip()
        
        if choice == "1":
            await demo_parser_only()
        elif choice == "2":
            await demo_structure_manager()
        elif choice == "3":
            await demo_single_file_upload()
        elif choice == "4":
            await demo_batch_upload()
        elif choice == "5":
            await demo_parser_only()
            await demo_structure_manager()
            await demo_single_file_upload()
            await demo_batch_upload()
        else:
            logger.info("Option invalide")
        
    except KeyboardInterrupt:
        logger.info("🛑 Démo interrompue par l'utilisateur")
    except Exception as e:
        logger.error(f"❌ Erreur démo: {e}")

if __name__ == "__main__":
    # Vérifier les variables d'environnement essentielles
    required_vars = [
        'FRAMEIO_ACCOUNT_ID',
        'FRAMEIO_WORKSPACE_ID',
        'FRAMEIO_CLIENT_ID',
        'FRAMEIO_CLIENT_SECRET',
        'FRAMEIO_JWT_KEY'
    ]
    
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        logger.error("❌ Variables d'environnement manquantes:")
        for var in missing_vars:
            logger.error(f"  - {var}")
        logger.info("📝 Configurez ces variables avant d'exécuter le script")
        sys.exit(1)
    
    # Lancer la démo
    asyncio.run(main())
