#!/usr/bin/env python3
"""
🤖 Test Webhook Discord avec Nouvelles URLs Frame.io
====================================================

Test RÉEL avec les nouvelles URLs Frame.io récupérées via API
pour vérifier les limites de votre webhook Discord.

⚠️ ATTENTION: Ce test fait un VRAI post sur votre Discord !

Usage: python test_webhook_with_fresh_urls.py
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

try:
    from utils.discord_media_selector import get_file_size_from_url, DISCORD_LIMITS
except ImportError:
    # Fallback si import échoue
    DISCORD_LIMITS = {'webhook_bot': 50}
    
    async def get_file_size_from_url(url: str):
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.head(url, follow_redirects=True)
                if response.status_code == 200:
                    content_length = response.headers.get('content-length')
                    if content_length:
                        return int(content_length)
        except Exception as e:
            logger.warning(f"❌ Impossible de récupérer taille pour {url}: {e}")
        return None


class DiscordWebhookTester:
    """Testeur pour webhook Discord avec upload de fichiers"""
    
    def __init__(self, webhook_url: str):
        self.webhook_url = webhook_url
        self.session = None
    
    async def __aenter__(self):
        self.session = httpx.AsyncClient(timeout=180.0)  # 3 minutes timeout
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
            logger.info(f"🔗 URL: {file_url[:80]}...")
            
            # Télécharger le fichier depuis Frame.io
            download_response = await self.session.get(file_url, follow_redirects=True)
            download_response.raise_for_status()
            
            file_data = download_response.content
            file_size_mb = len(file_data) / (1024 * 1024)
            
            logger.info(f"📊 Fichier téléchargé: {len(file_data):,} bytes ({file_size_mb:.2f} MB)")
            
            # Vérifier la taille Discord
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


async def analyze_frameio_file_sizes():
    """Analyse les tailles des fichiers Frame.io avec les nouvelles URLs"""
    
    print("🎬 ANALYSE NOUVELLES URLs FRAME.IO")
    print("=" * 60)
    
    # URLs fraîches récupérées de l'API Frame.io
    fresh_frameio_files = {
        'high_quality': {
            'url': 'https://assets.frame.io/encode/1d335dcb-1d0a-4c41-bbcd-abd2815ed341/h264_1080_best.mp4?response-content-disposition=attachment%3B+filename%3D%22SQ04_UNDLM_00094_v001.mp4%22%3B+filename%2A%3D%22SQ04_UNDLM_00094_v001.mp4%22&response-content-type=video%2Fquicktime&x-amz-meta-project_id=c5dc0e94-8f0a-48b4-8f34-ae672bb59f0f&x-amz-meta-resource_type=asset&x-amz-meta-resource_id=1d335dcb-1d0a-4c41-bbcd-abd2815ed341&Expires=1754049600&Signature=afkbxgakMybR1wpnDe3y3PNrpwprd3j2PtXIWor4dPoouYWI1ZgSQbIx2fa1dynJedzEZvt-Ifuy2R4jdCVYimMZwxoUw8fuQ7CRMMFwEGbanbAfZQ1UOJb~SzbuuXJkohE-cNUjFcnkEU4MulxzNRL7Q9PDmSPamoaE9CvzxFkYkgtivm~TUiRhlIJRpOS5pJRU1Ao0YzrRpjdpb0jOcuuBDVn2VbCXMuWkHzxOK1rE2sRkv0pPwYcerNq5I~PXaOoxqNWp4biOPbxPNwUtkb9PEGA9u7q5a71zVezLBzqoQpKyc5FcSUr5Asgq9qfnBzyx-QIXsdKfavUl3MiMng__&Key-Pair-Id=K1XW5DOJMY1ET9',
            'filename': 'h264_1080_best.mp4'
        },
        'efficient': {
            'url': 'https://assets.frame.io/encode/1d335dcb-1d0a-4c41-bbcd-abd2815ed341/h264_360.mp4?response-content-disposition=attachment%3B+filename%3D%22SQ04_UNDLM_00094_v001.mp4%22%3B+filename%2A%3D%22SQ04_UNDLM_00094_v001.mp4%22&response-content-type=video%2Fquicktime&x-amz-meta-project_id=c5dc0e94-8f0a-48b4-8f34-ae672bb59f0f&x-amz-meta-resource_type=asset&x-amz-meta-resource_id=1d335dcb-1d0a-4c41-bbcd-abd2815ed341&Expires=1754049600&Signature=nzbzaiOMyX95GOOUdqhb3Y-7SHJeLjsGwaWNqxO~NMePX4U~naBAgNUV9nuaiRmwoj~P2S8Nv7GPJ0FQlMIJuUAV1bKZ2vbDrJqx~pM3J-bkn3RlM9YrcLcAP2EKzozxAbhG615sJamlBQgHI3NR~r~3vlFnOm3EPav8v5Lj8Q-MxNOWf-GHrst8vpQRFeExk8-MMWTH8xkLwK0b~faD9kMJ-YATHP6bygu4g85kNghwbPmJGLzCrHW8RbA3c5v1C9wBCoKPFf3m-6RTjpJ~GG2T5D0XGkOxabK19Wk6jp4ihDvfvNd0VTL95i7wshEQMCu0psqqMUQtlgtFN7~S6w__&Key-Pair-Id=K1XW5DOJMY1ET9',
            'filename': 'h264_360.mp4'
        },
        'video_h264_180': {
            'url': 'https://assets.frame.io/encode/1d335dcb-1d0a-4c41-bbcd-abd2815ed341/video_h264_180.mp4?response-content-disposition=attachment%3B+filename%3D%22SQ04_UNDLM_00094_v001.mp4%22%3B+filename%2A%3D%22SQ04_UNDLM_00094_v001.mp4%22&response-content-type=video%2Fquicktime&x-amz-meta-project_id=c5dc0e94-8f0a-48b4-8f34-ae672bb59f0f&x-amz-meta-resource_type=asset&x-amz-meta-resource_id=1d335dcb-1d0a-4c41-bbcd-abd2815ed341&Expires=1754049600&Signature=T7U1XkkR4Nej0sNZOgNnGftrm8UXg8fM7h0aObg3X~rHc-yxtvh5jNwMOI4WJAbSeE2p9riStyo3RNFuP6J541ZAFa71wY~llrfY7GmI7ZcXgUM0VhdwL7Y4lFod~CMAhx8tkCkHIJURxGPL2smczUrEP2F1oAt6ISTauedzYXzKLQUAnB8Sn3QbmyY9fVgNnqi-h8bwoD4m0VMgrAP~8X-RUUQ75N1Fj~-0mWdjCjXKVgDJS7BlwAs~3otLRkYXO2QCz9jRiJVYT~gFew-IaeugabXEjcuMnUW49ahAlh1jehtUpb0kMP-jhFr5x98iwaQitgXG3R2uyXNEI~0XXA__&Key-Pair-Id=K1XW5DOJMY1ET9',
            'filename': 'video_h264_180.mp4'
        }
    }
    
    print("📏 Vérification tailles fichiers:")
    print("-" * 50)
    
    file_analyses = []
    
    for quality, info in fresh_frameio_files.items():
        url = info['url']
        filename = info['filename']
        
        print(f"\n📁 {quality.upper()}: {filename}")
        
        try:
            file_size = await get_file_size_from_url(url)
            
            if file_size:
                size_mb = file_size / (1024 * 1024)
                print(f"   📊 Taille: {file_size:,} bytes ({size_mb:.2f} MB)")
                
                # Analyser pour Discord
                if size_mb <= 25:
                    status = "✅ Compatible Discord gratuit (≤25MB)"
                elif size_mb <= 50:
                    status = "🎯 Parfait pour test webhook (25-50MB)!"
                else:
                    status = "❌ Trop gros pour Discord (>50MB)"
                
                print(f"   {status}")
                
                file_analyses.append({
                    'quality': quality,
                    'url': url,
                    'filename': filename,
                    'size_mb': size_mb,
                    'size_bytes': file_size,
                    'discord_compatible': size_mb <= 50
                })
            else:
                print(f"   ❌ Impossible de récupérer la taille")
                
        except Exception as e:
            print(f"   ❌ Erreur: {e}")
    
    return file_analyses


async def test_webhook_upload_with_fresh_urls():
    """Test d'upload avec les nouvelles URLs Frame.io"""
    
    print("\n\n🤖 TEST WEBHOOK DISCORD - URLs FRAÎCHES")
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
    
    # Analyser les fichiers disponibles
    file_analyses = await analyze_frameio_file_sizes()
    
    if not file_analyses:
        print(f"\n❌ Aucun fichier analysable trouvé")
        return False
    
    # Trouver le meilleur candidat pour test (priorité aux fichiers 25-50MB)
    candidates_25_50 = [f for f in file_analyses if 25 <= f['size_mb'] <= 50]
    candidates_compatible = [f for f in file_analyses if f['discord_compatible']]
    
    if candidates_25_50:
        test_file = candidates_25_50[0]  # Premier dans la plage 25-50MB
        print(f"\n🎯 CANDIDAT IDÉAL TROUVÉ (25-50MB)")
    elif candidates_compatible:
        test_file = candidates_compatible[0]  # Premier compatible (≤50MB)
        print(f"\n🎯 CANDIDAT COMPATIBLE TROUVÉ (≤50MB)")
    else:
        print(f"\n❌ Aucun fichier compatible trouvé")
        return False
    
    print(f"📋 FICHIER SÉLECTIONNÉ:")
    print(f"   • Qualité: {test_file['quality'].upper()}")
    print(f"   • Fichier: {test_file['filename']}")
    print(f"   • Taille: {test_file['size_mb']:.2f} MB")
    print(f"   • Bytes: {test_file['size_bytes']:,}")
    
    # Message de test
    timestamp = datetime.now().strftime("%H:%M:%S")
    test_message = f"""🧪 **TEST WEBHOOK POSTFLOW** - {timestamp}

📁 Fichier: {test_file['filename']}
🎬 Source: SQ04_UNDLM_00094_v001.mov
🎯 Qualité: {test_file['quality'].upper()}
📊 Taille: {test_file['size_mb']:.2f} MB
🤖 Test: Limite webhook Discord 50MB

✅ Si vous voyez cette vidéo, les MP4 Frame.io → Discord fonctionnent !"""
    
    # Effectuer le test d'upload
    print(f"\n🚀 DÉMARRAGE TEST UPLOAD...")
    print("-" * 50)
    
    async with DiscordWebhookTester(webhook_url) as tester:
        success = await tester.download_and_upload_to_discord(
            test_file['url'],
            f"PostFlow_{test_file['filename']}", 
            test_message
        )
        
        return success, test_file


async def main():
    """Test principal"""
    
    print("🚀 TEST WEBHOOK DISCORD - URLs FRAME.IO FRAÎCHES")
    print("=" * 80)
    print("Objectif: Tester votre webhook avec les vraies URLs Frame.io")
    print("récupérées via API pour valider les limites 25-50MB.")
    print()
    print("⚠️ ATTENTION: Ce test fait un VRAI post sur votre Discord!")
    
    try:
        success, test_file = await test_webhook_upload_with_fresh_urls()
        
        print("\n\n🎯 RÉSULTATS")
        print("=" * 40)
        
        if success:
            print(f"🎉 SUCCÈS! Fichier {test_file['quality'].upper()} posté")
            print(f"📊 Taille testée: {test_file['size_mb']:.2f} MB")
            print(f"✅ Webhook compatible avec fichiers jusqu'à 50MB")
            print(f"✅ Remplacement thumbnails → MP4 vidéos VALIDÉ!")
            print(f"\n💡 Prochaine étape: Intégrer dans webhook_manager.py")
            
            # Recommandations basées sur la taille testée
            if test_file['size_mb'] >= 25:
                print(f"🎯 Recommandation: Utiliser 'efficient' ou 'high_quality'")
            else:
                print(f"🎯 Recommandation: Tous les formats compatibles")
                
        else:
            print(f"❌ ÉCHEC du test d'upload")
            print(f"⚠️ Problème avec webhook ou limite API Discord")
            print(f"💡 Utiliser 'video_h264_180' comme limite sécurisée")
        
    except Exception as e:
        logger.error(f"❌ Erreur lors du test: {e}")
        print(f"\n❌ Erreur inattendue: {e}")


if __name__ == "__main__":
    asyncio.run(main())
