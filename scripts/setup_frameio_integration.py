#!/usr/bin/env python3
"""
Script d'initialisation pour l'intégration LucidLink → Frame.io
Configure l'environnement et teste la connectivité
"""

import os
import json
import asyncio
from pathlib import Path
import logging
from typing import Dict, Any

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_config() -> Dict[str, Any]:
    """Charge la configuration depuis les variables d'environnement"""
    config = {
        'frameio': {
            'account_id': os.getenv('FRAMEIO_ACCOUNT_ID'),
            'workspace_id': os.getenv('FRAMEIO_WORKSPACE_ID'),
            'project_id': os.getenv('FRAMEIO_PROJECT_ID'),
            'base_url': os.getenv('FRAMEIO_BASE_URL', 'https://api.frame.io/v4'),
            'oauth': {
                'client_id': os.getenv('FRAMEIO_CLIENT_ID'),
                'client_secret': os.getenv('FRAMEIO_CLIENT_SECRET'),
                'jwt_key': os.getenv('FRAMEIO_JWT_KEY'),
                'token_url': os.getenv('FRAMEIO_TOKEN_URL', 'https://auth.frame.io/oauth2/token')
            }
        },
        'discord': {
            'webhook_url': os.getenv('DISCORD_WEBHOOK_URL')
        },
        'settings': {
            'enable_notifications': os.getenv('ENABLE_DISCORD_NOTIFICATIONS', 'true').lower() == 'true',
            'max_concurrent_uploads': int(os.getenv('MAX_CONCURRENT_UPLOADS', '3')),
            'chunk_size': int(os.getenv('FRAMEIO_CHUNK_SIZE', '8388608')),
            'auto_cleanup': os.getenv('AUTO_CLEANUP_UPLOADS', 'false').lower() == 'true'
        }
    }
    
    return config

def validate_config(config: Dict[str, Any]) -> Dict[str, bool]:
    """Valide la configuration"""
    validation = {
        'frameio_account_id': bool(config['frameio']['account_id']),
        'frameio_workspace_id': bool(config['frameio']['workspace_id']),
        'frameio_client_id': bool(config['frameio']['oauth']['client_id']),
        'frameio_client_secret': bool(config['frameio']['oauth']['client_secret']),
        'frameio_jwt_key': bool(config['frameio']['oauth']['jwt_key']),
        'discord_webhook': bool(config['discord']['webhook_url'])
    }
    
    return validation

def create_directory_structure():
    """Crée la structure de dossiers nécessaire"""
    try:
        base_path = Path(__file__).parent.parent
        
        # Dossiers à créer
        directories = [
            base_path / 'config',
            base_path / 'logs',
            base_path / 'temp',
            base_path / 'data',
            base_path / 'backups' / 'frameio_structure'
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
            logger.info(f"✅ Dossier créé/vérifié: {directory}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur création structure: {e}")
        return False

def create_config_files():
    """Crée les fichiers de configuration par défaut"""
    try:
        base_path = Path(__file__).parent.parent
        
        # frameio_structure.json
        structure_file = base_path / 'config' / 'frameio_structure.json'
        if not structure_file.exists():
            default_structure = {
                "project_id": None,
                "project_name": "RL PostFlow",
                "scenes_folder_id": None,
                "structure": {
                    "scenes": {}
                },
                "last_updated": None,
                "version": "1.0"
            }
            
            with open(structure_file, 'w', encoding='utf-8') as f:
                json.dump(default_structure, f, indent=2, ensure_ascii=False)
            
            logger.info(f"✅ Fichier créé: {structure_file}")
        
        # .env.example
        env_example = base_path / '.env.example'
        if not env_example.exists():
            env_content = """# Frame.io OAuth Configuration
FRAMEIO_ACCOUNT_ID=your_account_id
FRAMEIO_WORKSPACE_ID=your_workspace_id
FRAMEIO_PROJECT_ID=your_project_id
FRAMEIO_CLIENT_ID=your_client_id
FRAMEIO_CLIENT_SECRET=your_client_secret
FRAMEIO_JWT_KEY=your_jwt_key

# Frame.io API Settings
FRAMEIO_BASE_URL=https://api.frame.io/v4
FRAMEIO_TOKEN_URL=https://auth.frame.io/oauth2/token
FRAMEIO_CHUNK_SIZE=8388608
FRAMEIO_PARALLEL_UPLOADS=2

# Discord Configuration
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your_webhook_url

# Integration Settings
ENABLE_DISCORD_NOTIFICATIONS=true
MAX_CONCURRENT_UPLOADS=3
AUTO_CLEANUP_UPLOADS=false
"""
            
            with open(env_example, 'w', encoding='utf-8') as f:
                f.write(env_content)
            
            logger.info(f"✅ Fichier créé: {env_example}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur création fichiers config: {e}")
        return False

async def test_frameio_connectivity(config: Dict[str, Any]) -> bool:
    """Test la connectivité avec Frame.io"""
    try:
        # Import dynamique pour éviter les erreurs si le module n'est pas encore prêt
        import sys
        sys.path.insert(0, str(Path(__file__).parent.parent))
        
        from src.integrations.frameio.oauth_auth import FrameIOOAuthAuth
        from src.integrations.frameio.structure import FrameIOStructureManager
        
        logger.info("🔄 Test de connectivité Frame.io...")
        
        # Créer l'authentification
        auth = FrameIOOAuthAuth(config)
        
        # Tester l'authentification
        headers = await auth.get_headers()
        if not headers:
            logger.error("❌ Échec authentification Frame.io")
            return False
        
        logger.info("✅ Authentification Frame.io réussie")
        
        # Tester l'accès aux projets
        structure_manager = FrameIOStructureManager(auth)
        projects = await structure_manager.get_projects()
        
        if not projects:
            logger.warning("⚠️ Aucun projet trouvé")
            return False
        
        logger.info(f"✅ {len(projects)} projet(s) trouvé(s)")
        for project in projects[:3]:  # Afficher les 3 premiers
            logger.info(f"  📁 {project.name} ({project.id})")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur test Frame.io: {e}")
        return False

def test_discord_connectivity(webhook_url: str) -> bool:
    """Test la connectivité avec Discord"""
    try:
        if not webhook_url:
            logger.warning("⚠️ Webhook Discord non configuré")
            return False
        
        import requests
        
        logger.info("🔄 Test de connectivité Discord...")
        
        # Test avec un message simple
        test_payload = {
            "content": "🧪 Test de connectivité - RL PostFlow Integration",
            "username": "RL PostFlow Setup",
            "embeds": [{
                "title": "✅ Configuration Test",
                "description": "L'intégration LucidLink → Frame.io est correctement configurée",
                "color": 0x00FF00,
                "fields": [{
                    "name": "Statut",
                    "value": "Prêt pour la production",
                    "inline": True
                }]
            }]
        }
        
        response = requests.post(webhook_url, json=test_payload)
        response.raise_for_status()
        
        logger.info("✅ Notification Discord envoyée avec succès")
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur test Discord: {e}")
        return False

def generate_setup_summary(config: Dict[str, Any], validation: Dict[str, bool]) -> str:
    """Génère un résumé de la configuration"""
    summary = []
    summary.append("🎬 RÉSUMÉ DE LA CONFIGURATION")
    summary.append("=" * 50)
    
    # Frame.io
    summary.append("\n📡 Frame.io:")
    summary.append(f"  Account ID: {'✅' if validation['frameio_account_id'] else '❌'}")
    summary.append(f"  Workspace ID: {'✅' if validation['frameio_workspace_id'] else '❌'}")
    summary.append(f"  OAuth Client: {'✅' if validation['frameio_client_id'] else '❌'}")
    summary.append(f"  JWT Key: {'✅' if validation['frameio_jwt_key'] else '❌'}")
    
    # Discord
    summary.append("\n💬 Discord:")
    summary.append(f"  Webhook: {'✅' if validation['discord_webhook'] else '❌'}")
    summary.append(f"  Notifications: {'✅' if config['settings']['enable_notifications'] else '❌'}")
    
    # Paramètres
    summary.append("\n⚙️ Paramètres:")
    summary.append(f"  Max uploads simultanés: {config['settings']['max_concurrent_uploads']}")
    summary.append(f"  Taille des chunks: {config['settings']['chunk_size'] // 1024 // 1024} MB")
    summary.append(f"  Nettoyage auto: {'✅' if config['settings']['auto_cleanup'] else '❌'}")
    
    # Statut global
    all_required = all([
        validation['frameio_account_id'],
        validation['frameio_workspace_id'],
        validation['frameio_client_id'],
        validation['frameio_client_secret'],
        validation['frameio_jwt_key']
    ])
    
    summary.append(f"\n🎯 Statut Global: {'✅ PRÊT' if all_required else '❌ CONFIGURATION INCOMPLÈTE'}")
    
    return "\n".join(summary)

async def main():
    """Fonction principale d'initialisation"""
    try:
        print("🚀 Initialisation de l'intégration LucidLink → Frame.io")
        print("=" * 60)
        
        # Étape 1: Créer la structure de dossiers
        logger.info("📁 Création de la structure de dossiers...")
        if not create_directory_structure():
            logger.error("❌ Échec création structure")
            return False
        
        # Étape 2: Créer les fichiers de configuration
        logger.info("📄 Création des fichiers de configuration...")
        if not create_config_files():
            logger.error("❌ Échec création fichiers config")
            return False
        
        # Étape 3: Charger et valider la configuration
        logger.info("🔧 Chargement de la configuration...")
        config = load_config()
        validation = validate_config(config)
        
        # Étape 4: Tests de connectivité
        frameio_ok = False
        discord_ok = False
        
        if validation['frameio_account_id'] and validation['frameio_client_id']:
            frameio_ok = await test_frameio_connectivity(config)
        else:
            logger.warning("⚠️ Configuration Frame.io incomplète, test ignoré")
        
        if validation['discord_webhook']:
            discord_ok = test_discord_connectivity(config['discord']['webhook_url'])
        else:
            logger.warning("⚠️ Discord webhook non configuré, test ignoré")
        
        # Étape 5: Résumé
        print("\n" + generate_setup_summary(config, validation))
        
        # Recommandations
        print("\n📋 PROCHAINES ÉTAPES:")
        
        if not all([validation['frameio_account_id'], validation['frameio_workspace_id']]):
            print("  1. ⚠️ Configurez les variables d'environnement Frame.io")
            print("     export FRAMEIO_ACCOUNT_ID=your_account_id")
            print("     export FRAMEIO_WORKSPACE_ID=your_workspace_id")
            print("     export FRAMEIO_CLIENT_ID=your_client_id")
            print("     export FRAMEIO_CLIENT_SECRET=your_client_secret")
            print("     export FRAMEIO_JWT_KEY=your_jwt_key")
        
        if not validation['discord_webhook']:
            print("  2. ⚠️ Configurez le webhook Discord (optionnel)")
            print("     export DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...")
        
        if frameio_ok:
            print("  3. ✅ Testez l'intégration avec:")
            print("     python examples/frameio_lucidlink_demo.py")
        
        print("  4. 📚 Consultez la documentation:")
        print("     docs/FRAMEIO_LUCIDLINK_INTEGRATION.md")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur initialisation: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    exit(0 if success else 1)
