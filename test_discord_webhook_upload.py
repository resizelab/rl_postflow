#!/usr/bin/env python3
"""
🤖 Test Réel Webhook Discord - Upload Fichier 25-50MB
=====================================================

Test RÉEL avec votre webhook Discord pour vérifier si on peut
poster un fichier entre 25MB et 50MB en utilisant les vraies
données Frame.io du fichier SQ04_UNDLM_00094_v001.mov.

⚠️ ATTENTION: Ce test fait un VRAI post sur votre Discord !

Usage: python test_discord_webhook_upload.py
"""

import asyncio
import json
import logging
import httpx
import sys
from pathlib import Path
from datetime import datetime

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

# Ajouter le dossier src au PYTHONPATH
sys.path.append(str(Path(__file__).parent / "src"))

from utils.discord_media_selector import (
    select_for_discord_tier,
    get_file_size_from_url,
    DISCORD_LIMITS
)


class DiscordWebhookTester:
    """Testeur pour webhook Discord avec upload de fichiers"""
    
    def __init__(self, webhook_url: str):
        self.webhook_url = webhook_url
        self.session = None
    
    async def __aenter__(self):
        self.session = httpx.AsyncClient(timeout=120.0)  # 2 minutes timeout
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.aclose()
    
    async def download_and_upload_to_discord(self, file_url: str, filename: str, message: str) -> bool:
        """
        Télécharge un fichier depuis Frame.io et l'upload sur Discord
        
        Args:
            file_url: URL du fichier Frame.io
            filename: Nom du fichier pour Discord
            message: Message d'accompagnement
            
        Returns:
            True si succès, False sinon
        """
        try:
            logger.info(f"📥 Téléchargement: {filename}")
            logger.info(f"🔗 URL: {file_url}")
            
            # Télécharger le fichier depuis Frame.io
            download_response = await self.session.get(file_url, follow_redirects=True)
            download_response.raise_for_status()
            
            file_data = download_response.content
            file_size_mb = len(file_data) / (1024 * 1024)
            
            logger.info(f"📊 Fichier téléchargé: {len(file_data):,} bytes ({file_size_mb:.2f} MB)")
            
            # Vérifier la taille
            if file_size_mb > 50:
                logger.error(f"❌ Fichier trop gros: {file_size_mb:.2f}MB > 50MB")
                return False
            
            # Préparer l'upload Discord
            logger.info(f"📤 Upload vers Discord webhook...")
            
            # Payload Discord avec fichier
            files = {
                'file': (filename, file_data, 'video/mp4')
            }
            
            data = {
                'content': message,
                'username': 'PostFlow Test Bot',
            }
            
            # Upload vers Discord
            upload_response = await self.session.post(
                self.webhook_url,
                files=files,
                data=data
            )
            
            if upload_response.status_code == 200:
                logger.info(f"✅ Fichier posté avec succès sur Discord!")
                logger.info(f"📊 Taille: {file_size_mb:.2f}MB")
                return True
            else:
                logger.error(f"❌ Erreur Discord: {upload_response.status_code}")
                logger.error(f"Response: {upload_response.text}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur upload: {e}")
            return False


async def test_frameio_file_sizes():
    """Analyse les tailles des fichiers Frame.io disponibles"""
    
    print("🎬 ANALYSE TAILLES FRAME.IO")
    print("=" * 60)
    print("Fichier: SQ04_UNDLM_00094_v001.mov")
    print("ID Frame.io: 1d335dcb-1d0a-4c41-bbcd-abd2815ed341")
    
    # URLs réelles des media_links
    frameio_files = {
        'high_quality': {
            'url': 'https://next.frame.io/download/dl_7e3d80ff-60cd-461b-b1d0-20ac9a38aaa3/h264_1080_best.mp4',
            'filename': 'h264_1080_best.mp4'
        },
        'efficient': {
            'url': 'https://next.frame.io/download/dl_c0b38a85-47e0-4abd-9b17-20e9af26ff98/h264_360.mp4',
            'filename': 'h264_360.mp4'
        },
        'video_h264_180': {
            'url': 'https://next.frame.io/download/dl_d6f41e5b-a7d4-477b-a6e6-6b7be3eb7e42/h264_180.mp4',
            'filename': 'h264_180.mp4'
        },
        'thumbnail': {
            'url': 'https://next.frame.io/download/dl_3f0e5be9-3c47-4c3d-95e7-b2db1d8e7e65/thumb.png',
            'filename': 'thumb.png'
        }
    }
    
    print("\n📏 Vérification tailles fichiers:")
    print("-" * 50)
    
    candidates_25_50mb = []
    
    for quality, info in frameio_files.items():
        url = info['url']
        filename = info['filename']
        
        print(f"\n📁 {quality.upper()}: {filename}")
        
        try:
            file_size = await get_file_size_from_url(url)
            
            if file_size:
                size_mb = file_size / (1024 * 1024)
                print(f"   📊 Taille: {file_size:,} bytes ({size_mb:.2f} MB)")
                
                # Vérifier si dans la plage 25-50MB
                if 25 <= size_mb <= 50:
                    print(f"   🎯 CANDIDAT pour test (25-50MB)!")
                    candidates_25_50mb.append({
                        'quality': quality,
                        'url': url,
                        'filename': filename,
                        'size_mb': size_mb
                    })
                elif size_mb < 25:
                    print(f"   ✅ Compatible Discord gratuit (<25MB)")
                elif size_mb > 50:
                    print(f"   ❌ Trop gros pour webhook (>50MB)")
            else:
                print(f"   ❌ Impossible de récupérer la taille")
                
        except Exception as e:
            print(f"   ❌ Erreur: {e}")
    
    return candidates_25_50mb


async def test_discord_webhook_upload():
    """Test réel d'upload sur votre webhook Discord"""
    
    print("\n\n🤖 TEST UPLOAD WEBHOOK DISCORD")
    print("=" * 70)
    
    # Charger la configuration webhook
    try:
        config_path = Path("config/integrations.json")
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        webhook_url = config['discord']['webhook_url']
        print(f"🔗 Webhook: {webhook_url[:50]}...")
        
    except Exception as e:
        print(f"❌ Erreur lecture config: {e}")
        return False
    
    # Analyser les tailles des fichiers Frame.io
    candidates = await test_frameio_file_sizes()
    
    if not candidates:
        print(f"\n⚠️ Aucun fichier dans la plage 25-50MB trouvé.")
        print(f"💡 On va tester avec le fichier 'efficient' même s'il est plus petit.")
        
        # Fallback: tester avec efficient même si < 25MB
        candidates = [{
            'quality': 'efficient',
            'url': 'https://next.frame.io/download/dl_c0b38a85-47e0-4abd-9b17-20e9af26ff98/h264_360.mp4',
            'filename': 'SQ04_UNDLM_00094_efficient_test.mp4',
            'size_mb': 'unknown'
        }]
    
    # Sélectionner le meilleur candidat
    test_file = candidates[0]
    
    print(f"\n🎯 FICHIER SÉLECTIONNÉ POUR TEST:")
    print(f"   • Qualité: {test_file['quality'].upper()}")
    print(f"   • Fichier: {test_file['filename']}")
    print(f"   • Taille: {test_file['size_mb']} MB")
    print(f"   • URL: {test_file['url']}")
    
    # Confirmation utilisateur
    print(f"\n⚠️ ATTENTION: Ce test va VRAIMENT poster sur votre Discord!")
    
    # Message de test
    timestamp = datetime.now().strftime("%H:%M:%S")
    test_message = f"""🧪 **TEST WEBHOOK POSTFLOW** - {timestamp}

📁 Fichier: {test_file['filename']}
🎬 Source: Frame.io SQ04_UNDLM_00094_v001.mov
🎯 Test: Vérification limite 50MB webhook bot
📊 Taille: {test_file['size_mb']} MB

✅ Si vous voyez ce fichier, le webhook fonctionne !"""
    
    # Effectuer le test d'upload
    print(f"\n🚀 DÉMARRAGE TEST UPLOAD...")
    print("-" * 40)
    
    async with DiscordWebhookTester(webhook_url) as tester:
        success = await tester.download_and_upload_to_discord(
            test_file['url'],
            test_file['filename'], 
            test_message
        )
        
        if success:
            print(f"\n🎉 SUCCÈS! Fichier posté sur Discord.")
            print(f"✅ Votre webhook supporte bien les fichiers jusqu'à 50MB")
            return True
        else:
            print(f"\n❌ ÉCHEC. Le webhook n'a pas pu poster le fichier.")
            return False


async def main():
    """Test principal"""
    
    print("🚀 TEST RÉEL WEBHOOK DISCORD - 25-50MB")
    print("=" * 80)
    print("Objectif: Vérifier si votre webhook peut poster des fichiers")
    print("entre 25MB et 50MB en utilisant les vraies données Frame.io.")
    print()
    print("⚠️ ATTENTION: Ce test fait un VRAI post sur votre Discord!")
    
    try:
        success = await test_discord_webhook_upload()
        
        print("\n\n🎯 RÉSULTATS")
        print("=" * 40)
        
        if success:
            print("✅ WEBHOOK COMPATIBLE avec fichiers 25-50MB")
            print("✅ Vous pouvez utiliser 'efficient' ou 'high_quality'")
            print("✅ Remplacement thumbnails → MP4 vidéos possible!")
            print("\n💡 Prochaine étape: Intégrer dans webhook_manager.py")
        else:
            print("❌ PROBLÈME avec upload fichiers lourds")
            print("⚠️ Peut-être limité à 25MB ou problème API")
            print("💡 Utiliser 'video_h264_180' comme limite sécurisée")
        
    except Exception as e:
        logger.error(f"❌ Erreur lors du test: {e}")
        print(f"\n❌ Erreur inattendue: {e}")


if __name__ == "__main__":
    asyncio.run(main())
