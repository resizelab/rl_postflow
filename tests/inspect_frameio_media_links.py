#!/usr/bin/env python3
"""
🔍 Frame.io File Inspector - Inspection des media_links
=======================================================

Script pour examiner tous les media_links disponibles sur un fichier Frame.io existant.
Utile pour comprendre quelles URLs sont disponibles pour Discord preview.

Version: 4.2.0
Date: 31 juillet 2025
"""

import asyncio
import json
import logging
import os
from pathlib import Path
import sys
from typing import Dict, Optional

# Ajouter le répertoire racine au path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.frameio.upload import FrameIOUploadManager
from src.utils.cross_platform_paths import get_config_path

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class FrameIOFileInspector:
    """Inspecteur pour analyser les media_links Frame.io"""
    
    def __init__(self):
        self.uploader = None
        
    async def initialize(self):
        """Initialiser le client Frame.io"""
        try:
            # Charger la config Frame.io
            config_path = get_config_path("frameio_config.json")
            if not config_path.exists():
                logger.error(f"❌ Config Frame.io non trouvée: {config_path}")
                return False
                
            with open(config_path, 'r', encoding='utf-8') as f:
                frameio_config = json.load(f)
            
            self.uploader = FrameIOUploadManager(frameio_config)
            await self.uploader.initialize()
            
            logger.info("✅ Client Frame.io initialisé")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur initialisation: {e}")
            return False
    
    async def inspect_file(self, file_id: str) -> Dict:
        """
        Inspecte un fichier Frame.io et retourne tous ses media_links
        
        Args:
            file_id: ID du fichier Frame.io
            
        Returns:
            Dict: Informations complètes du fichier
        """
        try:
            logger.info(f"🔍 Inspection fichier Frame.io: {file_id}")
            
            # Utiliser la méthode existante pour récupérer les infos
            file_info = await self.uploader._get_file_info(file_id)
            
            if not file_info:
                logger.error(f"❌ Impossible de récupérer les infos du fichier: {file_id}")
                return {}
            
            return file_info
            
        except Exception as e:
            logger.error(f"❌ Erreur inspection fichier {file_id}: {e}")
            return {}
    
    def analyze_media_links(self, file_info: Dict) -> Dict:
        """
        Analyse les media_links et retourne une structure organisée
        
        Args:
            file_info: Informations complètes du fichier
            
        Returns:
            Dict: Analyse structurée des media_links
        """
        media_links = file_info.get('media_links', {})
        
        analysis = {
            'file_name': file_info.get('name', 'Inconnu'),
            'file_id': file_info.get('id', 'Inconnu'),
            'media_type': file_info.get('media_type', 'Inconnu'),
            'file_size': file_info.get('file_size', 0),
            'status': file_info.get('status', 'Inconnu'),
            'available_qualities': list(media_links.keys()),
            'discord_recommendations': {},
            'all_urls': {}
        }
        
        # Analyser chaque qualité disponible
        for quality, links in media_links.items():
            analysis['all_urls'][quality] = links
            
            # Recommandations pour Discord
            if quality == 'thumbnail':
                analysis['discord_recommendations']['thumbnail_image'] = links.get('url')
                analysis['discord_recommendations']['thumbnail_download'] = links.get('download_url')
            elif quality == 'high_quality':
                analysis['discord_recommendations']['preview_video'] = links.get('download_url')
            elif quality == 'original':
                analysis['discord_recommendations']['full_quality'] = links.get('download_url')
                analysis['discord_recommendations']['inline_view'] = links.get('inline_url')
        
        return analysis
    
    def print_analysis(self, analysis: Dict):
        """Affiche l'analyse de manière lisible"""
        print("=" * 80)
        print("🎬 FRAME.IO FILE ANALYSIS")
        print("=" * 80)
        print(f"📁 Fichier: {analysis['file_name']}")
        print(f"🆔 ID: {analysis['file_id']}")
        print(f"📦 Type: {analysis['media_type']}")
        print(f"📏 Taille: {analysis['file_size']:,} bytes")
        print(f"🔄 Statut: {analysis['status']}")
        print()
        
        print("🎯 QUALITÉS DISPONIBLES:")
        for quality in analysis['available_qualities']:
            print(f"  ✅ {quality}")
        print()
        
        print("🎮 RECOMMANDATIONS DISCORD:")
        for usage, url in analysis['discord_recommendations'].items():
            if url:
                print(f"  🔗 {usage}: {url[:80]}...")
        print()
        
        print("📋 TOUS LES LIENS DISPONIBLES:")
        for quality, links in analysis['all_urls'].items():
            print(f"\n  📂 {quality.upper()}:")
            for link_type, url in links.items():
                print(f"    {link_type}: {url}")
        
        print("=" * 80)


async def main():
    """Fonction principale"""
    print("🔍 Frame.io File Inspector - Media Links Analysis")
    print()
    
    # Demander l'ID du fichier
    file_id = input("📝 Entrez l'ID du fichier Frame.io à inspecter: ").strip()
    
    if not file_id:
        print("❌ ID de fichier requis")
        return
    
    # Initialiser l'inspecteur
    inspector = FrameIOFileInspector()
    
    if not await inspector.initialize():
        print("❌ Impossible d'initialiser le client Frame.io")
        return
    
    # Inspecter le fichier
    file_info = await inspector.inspect_file(file_id)
    
    if not file_info:
        print(f"❌ Fichier {file_id} non trouvé ou inaccessible")
        return
    
    # Analyser et afficher
    analysis = inspector.analyze_media_links(file_info)
    inspector.print_analysis(analysis)
    
    # Sauvegarder l'analyse complète
    output_file = Path("frame_io_file_analysis.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'raw_file_info': file_info,
            'analysis': analysis
        }, f, indent=2, ensure_ascii=False)
    
    print(f"💾 Analyse complète sauvegardée: {output_file}")


if __name__ == "__main__":
    asyncio.run(main())
