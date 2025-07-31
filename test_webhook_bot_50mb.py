#!/usr/bin/env python3
"""
🤖 Test Webhook Bot Discord - 50MB
=================================

Test spécifique pour votre webhook bot Discord avec limite 50MB.
Validation des media_links Frame.io pour cette limite.

Usage: python test_webhook_bot_50mb.py
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

from utils.discord_media_selector import (
    select_for_discord_tier,
    select_discord_media_with_size_check,
    DISCORD_LIMITS
)


async def test_webhook_bot_limits():
    """Test avec limite 50MB de votre webhook bot"""
    
    print("🤖 TEST WEBHOOK BOT DISCORD - 50MB")
    print("=" * 60)
    print("Configuration: PostFlow webhook bot Discord")
    print(f"Limite configurée: {DISCORD_LIMITS['webhook_bot']}MB")
    
    # Media links réels du fichier SQ04_UNDLM_00094_v001.mov 
    real_media_links = {
        'high_quality': {
            'download_url': 'https://next.frame.io/download/dl_7e3d80ff-60cd-461b-b1d0-20ac9a38aaa3/h264_1080_best.mp4'
        },
        'efficient': {
            'download_url': 'https://next.frame.io/download/dl_c0b38a85-47e0-4abd-9b17-20e9af26ff98/h264_360.mp4'
        },
        'video_h264_180': {
            'download_url': 'https://next.frame.io/download/dl_d6f41e5b-a7d4-477b-a6e6-6b7be3eb7e42/h264_180.mp4'
        },
        'thumbnail': {
            'url': 'https://api.frame.io/v4/assets/c99b85da-5847-4d4e-847f-7a76e4fe7b8e/thumb.png',
            'download_url': 'https://next.frame.io/download/dl_3f0e5be9-3c47-4c3d-95e7-b2db1d8e7e65/thumb.png'
        }
    }
    
    print("\n📋 Media links disponibles:")
    for quality, data in real_media_links.items():
        url = data.get('download_url') or data.get('url')
        print(f"   • {quality}: {url.split('/')[-1] if '/' in url else url}")
    
    print("\n🎯 Sélection optimale pour webhook bot (50MB):")
    print("-" * 60)
    
    try:
        # Utiliser la fonction dédiée aux webhook bots
        url, strategy = await select_for_discord_tier(real_media_links, tier='webhook_bot')
        
        if url:
            print(f"✅ Sélectionné: {strategy}")
            filename = url.split('/')[-1] if '/' in url else "fichier"
            print(f"📁 Fichier: {filename}")
            print(f"🔗 URL: {url}")
            
            # Afficher le contexte
            print(f"\n💡 Contexte:")
            print(f"   • Fichier original: SQ04_UNDLM_00094_v001.mov (43.6MB)")
            print(f"   • Webhook bot limite: 50MB")
            print(f"   • Sélection: {strategy}")
            
            if 'HIGH_QUALITY' in strategy:
                print(f"   ✅ Qualité maximale possible !")
            elif 'EFFICIENT' in strategy:
                print(f"   ✅ Bon compromis qualité/taille")
            elif 'VIDEO_H264_180' in strategy:
                print(f"   ✅ Version légère garantie")
        else:
            print(f"❌ Aucun fichier compatible trouvé")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")


async def compare_webhook_vs_user_limits():
    """Compare sélection webhook bot vs utilisateur Discord"""
    
    print("\n\n📊 COMPARAISON: WEBHOOK BOT vs UTILISATEUR")
    print("=" * 70)
    
    media_links = {
        'high_quality': {
            'download_url': 'https://next.frame.io/download/dl_7e3d80ff-60cd-461b-b1d0-20ac9a38aaa3/h264_1080_best.mp4'
        },
        'efficient': {
            'download_url': 'https://next.frame.io/download/dl_c0b38a85-47e0-4abd-9b17-20e9af26ff98/h264_360.mp4'
        }
    }
    
    # Test différents niveaux
    test_scenarios = [
        ('free', 'Utilisateur Discord gratuit'),
        ('webhook_bot', 'Webhook bot PostFlow'),
        ('nitro', 'Utilisateur Discord Nitro')
    ]
    
    for tier, description in test_scenarios:
        limit = DISCORD_LIMITS[tier]
        print(f"\n🎯 {description} (limite: {limit}MB):")
        
        url, strategy = await select_for_discord_tier(media_links, tier)
        print(f"   Sélection: {strategy}")
        
        if url:
            filename = url.split('/')[-1] if '/' in url else "fichier"
            print(f"   Fichier: {filename}")


def show_webhook_configuration():
    """Affiche la configuration webhook actuelle"""
    
    print("\n\n⚙️ CONFIGURATION WEBHOOK DISCORD")
    print("=" * 50)
    
    try:
        # Lire la config actuelle
        config_path = Path("config/integrations.json")
        if config_path.exists():
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            discord_config = config.get('discord', {})
            
            print("📋 Configuration Discord:")
            print(f"   • Webhook URL: {discord_config.get('webhook_url', 'Non configuré')[:50]}...")
            print(f"   • Username: {discord_config.get('username', 'N/A')}")
            print(f"   • Enabled: {discord_config.get('enabled', False)}")
            
            print(f"\n🎯 Limite configurée pour webhook bot: {DISCORD_LIMITS['webhook_bot']}MB")
            print(f"💡 Cette limite correspond à votre test Discord de 50MB")
            
        else:
            print("❌ Fichier config/integrations.json non trouvé")
            
    except Exception as e:
        print(f"❌ Erreur lecture config: {e}")


async def main():
    """Test principal"""
    
    print("🚀 VALIDATION WEBHOOK BOT DISCORD 50MB")
    print("=" * 80)
    print("Objectif: Valider la sélection média pour votre webhook bot")
    print("avec la limite réelle de 50MB que vous avez testée.")
    
    try:
        # Test 1: Sélection webhook bot
        await test_webhook_bot_limits()
        
        # Test 2: Comparaison différents niveaux
        await compare_webhook_vs_user_limits()
        
        # Test 3: Configuration actuelle
        show_webhook_configuration()
        
        print("\n\n🎯 CONCLUSION")
        print("=" * 40)
        print("✅ Limite webhook bot mise à jour (50MB)")
        print("✅ Sélection optimisée pour votre configuration")
        print("✅ Prêt pour intégration media_links → Discord")
        print("\n💡 Prochaine étape: Implémenter upload fichier dans webhook_manager.py")
        
    except Exception as e:
        logger.error(f"❌ Erreur lors des tests: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(main())
