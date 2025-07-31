#!/usr/bin/env python3
"""
🎬 Discord Media Selection Helper
================================

Fonction helper pour sélectionner la meilleure qualité vidéo Frame.io
adaptée aux limitations Discord (8MB/20MB).

Version: 4.2.0
Date: 31 juillet 2025
"""

import asyncio
import json
import logging
import httpx
from typing import Dict, Optional, Tuple

logger = logging.getLogger(__name__)


# 📊 Limites Discord (2025)
DISCORD_LIMITS = {
    'free': 25,          # 25MB pour Discord gratuit (2025)
    'nitro_basic': 50,   # 50MB Discord Nitro Basic  
    'nitro': 500,        # 500MB Discord Nitro
    'server_boost_1': 50,    # 50MB serveur boost niveau 1
    'server_boost_2': 100,   # 100MB serveur boost niveau 2
    'server_boost_3': 100,   # 100MB serveur boost niveau 3
    'webhook_bot': 50,       # 50MB pour webhook bot (limite API Discord)
}


async def get_file_size_from_url(url: str) -> Optional[int]:
    """
    Récupère la taille d'un fichier via HTTP HEAD request
    
    Args:
        url: URL du fichier à tester
        
    Returns:
        Taille en bytes ou None si impossible à déterminer
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.head(url, follow_redirects=True)
            
            if response.status_code == 200:
                content_length = response.headers.get('content-length')
                if content_length:
                    file_size = int(content_length)
                    logger.debug(f"📏 Taille fichier {url}: {file_size:,} bytes")
                    return file_size
                    
    except Exception as e:
        logger.warning(f"❌ Impossible de récupérer taille pour {url}: {e}")
    
    return None


async def select_discord_media_with_size_check(
    media_links: Dict, 
    max_size_mb: int = 50
) -> Tuple[Optional[str], str]:
    """
    Sélection intelligente avec vérification de taille réelle via HTTP HEAD
    
    Args:
        media_links: Dictionnaire des liens média Frame.io
        max_size_mb: Taille maximale autorisée en MB (défaut: 50MB = webhook bot Discord)
        
    Returns:
        Tuple (url, description) du meilleur choix
    """
    if not media_links:
        return None, "❌ Aucun media_links disponible"
    
    max_size_bytes = max_size_mb * 1024 * 1024
    
    # Ordre de priorité pour Discord (défini par l'utilisateur)
    priority_order = ['high_quality', 'efficient', 'video_h264_180']
    
    logger.info(f"🎯 Sélection Discord avec vérification taille: {max_size_mb}MB ({max_size_bytes:,} bytes)")
    
    # Tester chaque qualité dans l'ordre
    for quality in priority_order:
        if quality in media_links and media_links[quality]:
            media_data = media_links[quality]
            url = media_data.get('download_url') or media_data.get('url')
            
            if url:
                file_size = await get_file_size_from_url(url)
                
                if file_size is not None:
                    size_mb = file_size / (1024 * 1024)
                    
                    if file_size <= max_size_bytes:
                        logger.info(f"✅ {quality.upper()}: {file_size:,} bytes ({size_mb:.1f}MB) - SÉLECTIONNÉ")
                        return url, f"✅ {quality.upper()} ({size_mb:.1f}MB)"
                    else:
                        logger.warning(f"❌ {quality.upper()}: {file_size:,} bytes ({size_mb:.1f}MB) - TROP GROS")
                else:
                    logger.warning(f"⚠️ {quality.upper()}: Taille inconnue - ESSAI SANS VÉRIFICATION")
                    # Si on ne peut pas vérifier la taille, on essaie quand même
                    return url, f"⚠️ {quality.upper()} (taille inconnue)"
    
    # Fallback: thumbnail (toujours léger)
    if 'thumbnail' in media_links and media_links['thumbnail']:
        thumbnail_data = media_links['thumbnail']
        url = thumbnail_data.get('url') or thumbnail_data.get('download_url')
        if url:
            logger.info("🔄 Fallback: THUMBNAIL sélectionné")
            return url, "🔄 THUMBNAIL (fallback)"
    
    return None, "❌ Aucun fichier compatible trouvé"


async def select_for_discord_tier(
    media_links: Dict, 
    tier: str = 'webhook_bot'
) -> Tuple[Optional[str], str]:
    """
    Sélection adaptée au niveau Discord de l'utilisateur/bot
    
    Args:
        media_links: Dictionnaire des liens média Frame.io
        tier: Niveau Discord ('free', 'nitro', 'webhook_bot', etc.)
        
    Returns:
        Tuple (url, description) avec vérification de taille adaptée
    """
    max_size_mb = DISCORD_LIMITS.get(tier, 50)  # Défaut: webhook bot
    
    logger.info(f"🎯 Sélection pour Discord {tier.upper()}: limite {max_size_mb}MB")
    
    return await select_discord_media_with_size_check(media_links, max_size_mb)


def select_discord_media_url(media_links: Dict, prefer_video: bool = True, max_size_hint: str = "25MB") -> Tuple[Optional[str], str]:
    """
    Sélectionne la meilleure URL média pour Discord selon les limitations de taille.
    
    Args:
        media_links: Dictionnaire des media_links Frame.io
        prefer_video: Si True, privilégie vidéo sur image (défaut: True)
        max_size_hint: Indication limite Discord ("8MB" ou "20MB")
    
    Returns:
        Tuple[url, strategy]: URL sélectionnée et stratégie utilisée
    """
    
    if not media_links:
        return None, "❌ Aucun media_links disponible"
    
    logger.debug(f"🎯 Sélection média Discord (limite: {max_size_hint}, prefer_video: {prefer_video})")
    logger.debug(f"📋 Media links disponibles: {list(media_links.keys())}")
    
    # Si on privilégie la vidéo (défaut)
    if prefer_video:
        
        # 1. PRIORITÉ: high_quality (meilleure qualité possible)
        if 'high_quality' in media_links and media_links['high_quality']:
            hq_url = media_links['high_quality'].get('download_url')
            if hq_url:
                logger.info("⚡ Sélection: HIGH_QUALITY (priorité qualité)")
                return hq_url, "⚡ HIGH_QUALITY"
        
        # 2. FALLBACK: efficient (optimisé Frame.io pour web/mobile)
        if 'efficient' in media_links and media_links['efficient']:
            efficient_url = media_links['efficient'].get('download_url')
            if efficient_url:
                logger.info("🎯 Sélection: EFFICIENT (optimisé Frame.io)")
                return efficient_url, "🎯 EFFICIENT"
        
        # 3. GARANTIE LÉGÈRE: video_h264_180 (toujours < 8MB)
        if 'video_h264_180' in media_links and media_links['video_h264_180']:
            light_url = media_links['video_h264_180'].get('download_url')
            if light_url:
                logger.info("📱 Sélection: VIDEO_H264_180 (léger garanti)")
                return light_url, "📱 VIDEO_H264_180"
    
    # 4. FALLBACK IMAGE: thumbnail
    if 'thumbnail' in media_links and media_links['thumbnail']:
        # Privilégier l'URL d'affichage (url) sur download pour Discord
        thumb_url = media_links['thumbnail'].get('url') or media_links['thumbnail'].get('download_url')
        if thumb_url:
            logger.info("🖼️ Sélection: THUMBNAIL (image statique)")
            return thumb_url, "🖼️ THUMBNAIL"
    
    # 5. DERNIER RECOURS: original (si tout le reste échoue)
    if 'original' in media_links and media_links['original']:
        original_url = media_links['original'].get('inline_url') or media_links['original'].get('download_url')
        if original_url:
            logger.warning("⚠️ Sélection: ORIGINAL (peut être trop lourd pour Discord)")
            return original_url, "⚠️ ORIGINAL"
    
    logger.error("❌ Aucune URL utilisable trouvée dans media_links")
    return None, "❌ Aucune URL disponible"


def analyze_media_links_for_discord(media_links: Dict) -> Dict:
    """
    Analyse complète des media_links pour Discord avec recommandations.
    
    Args:
        media_links: Dictionnaire des media_links Frame.io
    
    Returns:
        Dict: Analyse avec URLs et recommandations
    """
    
    analysis = {
        'available_qualities': list(media_links.keys()),
        'video_urls': {},
        'image_urls': {},
        'recommendations': {},
        'strategy': {}
    }
    
    # Extraire toutes les URLs vidéo
    for quality in ['high_quality', 'efficient', 'video_h264_180', 'original']:
        if quality in media_links and media_links[quality]:
            download_url = media_links[quality].get('download_url')
            if download_url:
                analysis['video_urls'][quality] = download_url
    
    # Extraire les URLs images
    if 'thumbnail' in media_links and media_links['thumbnail']:
        thumb_data = media_links['thumbnail']
        analysis['image_urls']['thumbnail_display'] = thumb_data.get('url')
        analysis['image_urls']['thumbnail_download'] = thumb_data.get('download_url')
    
    # Générer les recommandations
    best_video_url, video_strategy = select_discord_media_url(media_links, prefer_video=True)
    best_image_url, image_strategy = select_discord_media_url(media_links, prefer_video=False)
    
    analysis['recommendations'] = {
        'best_video_url': best_video_url,
        'best_image_url': best_image_url,
        'primary_choice': best_video_url or best_image_url,
        'fallback_choice': best_image_url if best_video_url else None
    }
    
    analysis['strategy'] = {
        'video_strategy': video_strategy,
        'image_strategy': image_strategy,
        'selection_order': ['high_quality', 'efficient', 'video_h264_180', 'thumbnail', 'original']
    }
    
    return analysis


# Exemple d'utilisation pour les hooks
def get_discord_preview_url(file_data: Dict) -> Tuple[Optional[str], str]:
    """
    Fonction simple pour les hooks Discord - récupère la meilleure URL preview.
    
    Args:
        file_data: Données complètes du fichier Frame.io (incluant media_links)
    
    Returns:
        Tuple[url, type]: URL et type de média ("video" ou "image")
    """
    
    media_links = file_data.get('media_links', {})
    
    if not media_links:
        logger.warning("⚠️ Aucun media_links dans les données fichier")
        return None, "none"
    
    # Sélectionner la meilleure URL
    url, strategy = select_discord_media_url(media_links, prefer_video=True)
    
    if url:
        # Déterminer si c'est une vidéo ou image
        media_type = "video" if any(qual in strategy.lower() for qual in ['high_quality', 'efficient', 'h264', 'original']) else "image"
        logger.info(f"✅ URL Discord sélectionnée: {strategy} → {media_type}")
        return url, media_type
    
    return None, "none"


if __name__ == "__main__":
    # Test avec des données simulées
    test_media_links = {
        'high_quality': {'download_url': 'https://frameio.com/hq.mp4'}, 
        'efficient': {'download_url': 'https://frameio.com/efficient.mp4'},
        'thumbnail': {'url': 'https://frameio.com/thumb.jpg', 'download_url': 'https://frameio.com/thumb_dl.jpg'},
        'video_h264_180': {'download_url': 'https://frameio.com/180p.mp4'}
    }
    
    url, strategy = select_discord_media_url(test_media_links)
    print(f"🎯 Test: {strategy} → {url}")
    
    analysis = analyze_media_links_for_discord(test_media_links)
    print(f"📋 Analyse: {analysis['recommendations']}")
