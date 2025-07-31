#!/usr/bin/env python3
"""
🧪 Test Intégration Complète Discord MP4
========================================

Test de l'intégration complète :
1. Webhook Frame.io file.ready
2. Récupération media_links
3. Sélection meilleure qualité
4. Download/Upload Discord
5. Nettoyage cache

Usage: python test_complete_integration.py
"""

import asyncio
import json
import logging
import sys
from pathlib import Path

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

# Ajouter le dossier src au PYTHONPATH
sys.path.append(str(Path(__file__).parent / "src"))

try:
    from integrations.frameio.webhook_manager import FrameIOWebhookManager
    from utils.upload_tracker import UploadTracker
    from integrations.frameio.auth import FrameIOAuth
except ImportError as e:
    logger.error(f"❌ Erreur import: {e}")
    print("⚠️ Assurez-vous que le PYTHONPATH est correct")
    sys.exit(1)


async def simulate_file_ready_webhook():
    """Simule un webhook file.ready pour tester l'intégration"""
    
    print("🧪 SIMULATION WEBHOOK FILE.READY")
    print("=" * 60)
    
    # Données simulées du webhook Frame.io file.ready
    mock_webhook_data = {
        "event": "file.ready",
        "resource": {
            "id": "1d335dcb-1d0a-4c41-bbcd-abd2815ed341",  # Vrai ID Frame.io
            "name": "SQ04_UNDLM_00094_v001.mov",
            "status": "ready",
            "type": "file",
            "file_size": 45692436,
            "view_url": "https://next.frame.io/project/c5dc0e94-8f0a-48b4-8f34-ae672bb59f0f/view/1d335dcb-1d0a-4c41-bbcd-abd2815ed341"
        },
        "timestamp": "2025-07-31T14:30:00.000Z"
    }
    
    print("📋 Données webhook simulées:")
    print(f"   • Event: {mock_webhook_data['event']}")
    print(f"   • File ID: {mock_webhook_data['resource']['id']}")
    print(f"   • Filename: {mock_webhook_data['resource']['name']}")
    print(f"   • Status: {mock_webhook_data['resource']['status']}")
    
    try:
        # Initialiser les composants nécessaires
        upload_tracker = UploadTracker()
        
        # Configuration Frame.io auth
        config_path = Path("config/integrations.json")
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        frameio_config = config.get('frameio', {})
        frameio_auth = FrameIOAuth(
            account_id=frameio_config['account_id'],
            access_token=frameio_config['access_token']
        )
        
        # Créer le webhook manager
        webhook_manager = FrameIOWebhookManager(
            upload_tracker=upload_tracker,
            frameio_auth=frameio_auth
        )
        
        print(f"\n🎯 Démarrage test workflow amélioration Discord...")
        print("-" * 50)
        
        # Simuler le workflow d'amélioration Discord
        file_id = mock_webhook_data['resource']['id']
        upload_id = "test_upload_id"  # ID simulé
        
        # Ajouter un upload simulé au tracker
        upload_tracker.add_upload(
            upload_id=upload_id,
            file_path="test_file.mov",
            shot_id="UNDLM_00094",
            version="v001"
        )
        
        # Marquer comme ayant un message Discord (pour simuler)
        upload_tracker.update_discord_data(upload_id, {
            'message_sent': True,
            'message_id': 'fake_message_id'
        })
        
        # Lancer le workflow d'amélioration
        await webhook_manager._enhance_discord_workflow(upload_id, file_id)
        
        print(f"\n✅ Test workflow terminé")
        
    except Exception as e:
        logger.error(f"❌ Erreur test: {e}", exc_info=True)
        print(f"\n❌ Erreur durant le test: {e}")


async def test_media_links_fetching():
    """Test isolé de récupération des media_links"""
    
    print("\n\n🔍 TEST RÉCUPÉRATION MEDIA_LINKS")
    print("=" * 60)
    
    try:
        # Configuration Frame.io auth
        config_path = Path("config/integrations.json")
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        frameio_config = config.get('frameio', {})
        frameio_auth = FrameIOAuth(
            account_id=frameio_config['account_id'],
            access_token=frameio_config['access_token']
        )
        
        # Créer le webhook manager pour tester la méthode
        upload_tracker = UploadTracker()
        webhook_manager = FrameIOWebhookManager(
            upload_tracker=upload_tracker,
            frameio_auth=frameio_auth
        )
        
        # Test avec le vrai ID Frame.io
        file_id = "1d335dcb-1d0a-4c41-bbcd-abd2815ed341"
        
        print(f"📡 Test récupération media_links pour: {file_id}")
        
        media_links = await webhook_manager._fetch_media_links(file_id)
        
        if media_links:
            print(f"✅ Media_links récupérés avec succès")
            print(f"📋 Qualités disponibles: {list(media_links.keys())}")
            
            # Tester la sélection Discord
            from utils.discord_media_selector import select_for_discord_tier
            
            video_url, strategy = await select_for_discord_tier(media_links, tier='webhook_bot')
            
            if video_url:
                print(f"🎯 Sélection Discord: {strategy}")
                print(f"🔗 URL: {video_url[:80]}...")
            else:
                print(f"❌ Aucune vidéo compatible Discord")
        else:
            print(f"❌ Échec récupération media_links")
            
    except Exception as e:
        logger.error(f"❌ Erreur test media_links: {e}", exc_info=True)


async def main():
    """Test principal d'intégration complète"""
    
    print("🚀 TEST INTÉGRATION COMPLÈTE DISCORD MP4")
    print("=" * 80)
    print("Objectif: Valider le workflow complet de remplacement")
    print("thumbnail → vidéo MP4 lors des webhooks Frame.io")
    print()
    print("⚠️ ATTENTION: Ce test peut poster sur votre Discord!")
    
    try:
        # Test 1: Récupération media_links
        await test_media_links_fetching()
        
        # Test 2: Simulation workflow complet
        await simulate_file_ready_webhook()
        
        print("\n\n🎯 RÉSULTATS")
        print("=" * 40)
        print("✅ Test d'intégration terminé")
        print("💡 Vérifiez les logs pour les détails")
        print("🎬 Si un message Discord a été posté, l'intégration fonctionne !")
        
    except Exception as e:
        logger.error(f"❌ Erreur lors des tests: {e}")
        print(f"\n❌ Erreur inattendue: {e}")


if __name__ == "__main__":
    asyncio.run(main())
