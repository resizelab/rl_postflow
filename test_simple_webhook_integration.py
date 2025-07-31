#!/usr/bin/env python3
"""
🧪 Test Simple - Webhook Discord MP4
====================================

Test simple pour vérifier que la logique d'amélioration Discord fonctionne.

Usage: python test_simple_webhook_integration.py
"""

import asyncio
import json
import logging
import httpx
import tempfile
import os
from pathlib import Path
from datetime import datetime

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)


async def test_frameio_to_discord_workflow():
    """Test du workflow complet Frame.io → Discord MP4"""
    
    print("🧪 TEST WORKFLOW FRAME.IO → DISCORD MP4")
    print("=" * 60)
    
    # Étape 1: Simuler récupération media_links Frame.io
    print("🔍 Étape 1: Récupération media_links Frame.io")
    
    # Configuration Frame.io
    try:
        config_path = Path("config/integrations.json")
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
    except Exception as e:
        print(f"❌ Erreur lecture config: {e}")
        return
    
    frameio_config = config.get('frameio', {})
    discord_config = config.get('discord', {})
    
    # Récupérer les media_links via API Frame.io
    file_id = "1d335dcb-1d0a-4c41-bbcd-abd2815ed341"  # Vrai ID
    media_links = await fetch_media_links_api(file_id, frameio_config)
    
    if not media_links:
        print("❌ Échec récupération media_links")
        return
    
    print(f"✅ Media_links récupérés: {list(media_links.keys())}")
    
    # Étape 2: Sélection meilleure qualité Discord
    print("\n🎯 Étape 2: Sélection qualité optimale")
    
    selected_url, strategy = select_best_discord_video(media_links)
    
    if not selected_url:
        print("❌ Aucune vidéo compatible Discord")
        return
    
    print(f"✅ Sélection: {strategy}")
    print(f"🔗 URL: {selected_url[:80]}...")
    
    # Étape 3: Download/Upload Discord
    print("\n📤 Étape 3: Download → Upload Discord")
    
    success = await download_and_post_to_discord(
        video_url=selected_url,
        filename="SQ04_UNDLM_00094_v001.mp4",
        discord_config=discord_config,
        strategy=strategy
    )
    
    if success:
        print("✅ Vidéo postée sur Discord avec succès!")
    else:
        print("❌ Échec post Discord")
    
    print(f"\n🎯 Test workflow terminé: {'✅ SUCCÈS' if success else '❌ ÉCHEC'}")


async def fetch_media_links_api(file_id: str, frameio_config: dict) -> dict:
    """Récupère les media_links via API Frame.io"""
    
    try:
        account_id = frameio_config['account_id']
        access_token = frameio_config['access_token']
        
        include_params = [
            "media_links.original",
            "media_links.thumbnail", 
            "media_links.high_quality",
            "media_links.video_h264_180",
            "media_links.efficient"
        ]
        
        url = f"https://api.frame.io/v4/accounts/{account_id}/files/{file_id}"
        params = {"include": ",".join(include_params)}
        headers = {"Authorization": f"Bearer {access_token}"}
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, params=params, headers=headers)
            response.raise_for_status()
            
            data = response.json()
            
            if 'data' in data and 'media_links' in data['data']:
                return data['data']['media_links']
                
    except Exception as e:
        logger.error(f"❌ Erreur API Frame.io: {e}")
    
    return {}


def select_best_discord_video(media_links: dict) -> tuple:
    """Sélectionne la meilleure vidéo pour Discord (50MB limite)"""
    
    # Ordre de priorité pour webhook bot Discord
    priority_order = ['high_quality', 'efficient', 'video_h264_180']
    
    for quality in priority_order:
        if quality in media_links and media_links[quality]:
            media_data = media_links[quality]
            url = media_data.get('download_url') or media_data.get('url')
            
            if url:
                return url, f"✅ {quality.upper()}"
    
    return None, "❌ Aucune vidéo trouvée"


async def download_and_post_to_discord(video_url: str, filename: str, discord_config: dict, strategy: str) -> bool:
    """Télécharge la vidéo et la poste sur Discord"""
    
    temp_file = None
    try:
        webhook_url = discord_config['webhook_url']
        
        # Créer fichier temporaire
        temp_file = tempfile.NamedTemporaryFile(
            suffix='.mp4', 
            prefix='postflow_test_',
            delete=False
        )
        
        # Télécharger la vidéo
        logger.info(f"📥 Téléchargement: {filename}")
        
        async with httpx.AsyncClient(timeout=180.0) as client:
            # Download
            response = await client.get(video_url, follow_redirects=True)
            response.raise_for_status()
            
            temp_file.write(response.content)
            temp_file.close()
            
            file_size_mb = len(response.content) / (1024 * 1024)
            logger.info(f"📊 Fichier: {file_size_mb:.2f} MB")
            
            # Préparer message Discord
            timestamp = datetime.now().strftime("%H:%M:%S")
            message = f"""🧪 **TEST INTÉGRATION POSTFLOW** - {timestamp}

📁 Fichier: {filename}
🎯 Qualité: {strategy}
📊 Taille: {file_size_mb:.2f} MB
🔗 Source: Frame.io media_links

✅ Test workflow: Frame.io → Discord MP4 automatique"""

            # Upload vers Discord
            with open(temp_file.name, 'rb') as f:
                file_data = f.read()
            
            files = {'file': (f"PostFlow_{filename}", file_data, 'video/mp4')}
            data = {
                'content': message,
                'username': discord_config.get('username', 'PostFlow Test Bot')
            }
            
            upload_response = await client.post(webhook_url, files=files, data=data)
            
            if upload_response.status_code == 200:
                logger.info(f"✅ Discord upload réussi")
                return True
            else:
                logger.error(f"❌ Discord error: {upload_response.status_code}")
                return False
                
    except Exception as e:
        logger.error(f"❌ Erreur download/upload: {e}")
        return False
    finally:
        # Nettoyer
        if temp_file and os.path.exists(temp_file.name):
            try:
                os.unlink(temp_file.name)
                logger.info(f"🧹 Fichier temporaire supprimé")
            except Exception as e:
                logger.warning(f"⚠️ Erreur nettoyage: {e}")


async def main():
    """Test principal"""
    
    print("🚀 TEST INTÉGRATION WEBHOOK DISCORD MP4")
    print("=" * 80)
    print("Test du workflow complet :")
    print("1. Récupération media_links Frame.io via API")
    print("2. Sélection meilleure qualité Discord")
    print("3. Download → Upload Discord avec nettoyage")
    print()
    print("⚠️ ATTENTION: Ce test poste VRAIMENT sur Discord!")
    
    try:
        await test_frameio_to_discord_workflow()
        
        print("\n\n📊 CONCLUSION")
        print("=" * 40)
        print("✅ Si vous voyez une vidéo MP4 sur Discord,")
        print("   l'intégration webhook fonctionne parfaitement!")
        print("💡 Le système peut maintenant remplacer automatiquement")
        print("   les thumbnails par des vidéos lors des webhooks Frame.io")
        
    except Exception as e:
        logger.error(f"❌ Erreur test: {e}")
        print(f"\n❌ Erreur: {e}")


if __name__ == "__main__":
    asyncio.run(main())
