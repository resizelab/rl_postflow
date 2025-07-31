#!/usr/bin/env python3
"""
🔍 Frame.io Media Links Inspector - Version API directe
======================================================

Script simplifié pour examiner les media_links via l'API Frame.io V4
en utilisant directement l'endpoint show file.

Version: 4.2.0
Date: 31 juillet 2025
"""

import asyncio
import json
import httpx
import os
from pathlib import Path

class FrameIOAPIInspector:
    """Inspecteur direct API Frame.io"""
    
    def __init__(self):
        # Essayer d'abord les variables d'environnement
        self.account_id = os.getenv('FRAMEIO_ACCOUNT_ID')
        self.token = os.getenv('FRAMEIO_TOKEN')
        
        # Si pas de variables d'environnement, utiliser les tokens du système
        if not self.account_id or not self.token:
            try:
                # Utiliser les tokens actuels du système (comme webhook_manager)
                integrations_path = Path("config/integrations.json")
                if integrations_path.exists():
                    with open(integrations_path, 'r', encoding='utf-8') as f:
                        integrations = json.load(f)
                    
                    frameio_config = integrations.get('frameio', {})
                    
                    self.account_id = frameio_config.get('account_id')
                    self.token = frameio_config.get('access_token')  # Token OAuth actuel
                    
                    print(f"✅ Config OAuth chargée depuis: {integrations_path}")
                    print(f"   Account ID: {self.account_id}")
                    print(f"   Token type: OAuth access_token")
                    
                # Fallback frameio_integration.json pour account_id si manquant
                if not self.account_id:
                    integration_path = Path("config/frameio_integration.json")
                    if integration_path.exists():
                        with open(integration_path, 'r', encoding='utf-8') as f:
                            integration = json.load(f)
                        
                        self.account_id = integration.get('frameio', {}).get('account_id')
                        print(f"✅ Account ID fallback depuis: {integration_path}")
                        
            except Exception as e:
                print(f"❌ Erreur lecture config: {e}")
        
        if not self.account_id or not self.token:
            print("❌ Configuration Frame.io manquante:")
            print("   - Variables d'environnement: FRAMEIO_ACCOUNT_ID et FRAMEIO_TOKEN")
            print("   - Ou tokens OAuth dans config/integrations.json")
            exit(1)
        else:
            print(f"✅ Account ID: {self.account_id}")
            print(f"✅ Token: {'*' * 20}...{self.token[-8:] if len(self.token) > 8 else '*' * len(self.token)}")
    
    async def get_file_with_media_links(self, file_id: str):
        """
        Récupère un fichier avec tous ses media_links
        """
        url = f"https://api.frame.io/v4/accounts/{self.account_id}/files/{file_id}"
        
        # Inclure TOUS les media_links disponibles
        params = {
            'include': 'media_links.original,media_links.thumbnail,media_links.high_quality,media_links.video_h264_180,media_links.efficient,creator,project'
        }
        
        headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers, params=params)
                
                print(f"🌐 URL: {response.url}")
                print(f"📡 Status: {response.status_code}")
                
                if response.status_code == 200:
                    response_json = response.json()
                    print(f"📄 Response keys: {list(response_json.keys())}")
                    
                    # Frame.io V4 API encapsule dans 'data'
                    if 'data' in response_json:
                        file_data = response_json['data']
                        print(f"📄 File data keys: {list(file_data.keys())}")
                        return file_data
                    else:
                        print(f"📄 Response preview: {str(response_json)[:200]}...")
                        return response_json
                else:
                    print(f"❌ Erreur API: {response.status_code}")
                    print(f"📄 Response: {response.text}")
                    return None
                    
        except Exception as e:
            print(f"❌ Erreur requête: {e}")
            return None
    
    def analyze_media_links(self, file_data):
        """Analyse et affiche les media_links"""
        if not file_data:
            return
        
        print("=" * 80)
        print("🎬 FRAME.IO FILE MEDIA LINKS ANALYSIS")
        print("=" * 80)
        
        # Infos générales
        print(f"📁 Nom: {file_data.get('name', 'N/A')}")
        print(f"🆔 ID: {file_data.get('id', 'N/A')}")
        print(f"📦 Type: {file_data.get('media_type', 'N/A')}")
        print(f"📏 Taille: {file_data.get('file_size', 0):,} bytes")
        print(f"🔄 Statut: {file_data.get('status', 'N/A')}")
        print(f"📅 Créé: {file_data.get('created_at', 'N/A')}")
        print(f"📅 MAJ: {file_data.get('updated_at', 'N/A')}")
        print()
        
        # Media links
        media_links = file_data.get('media_links', {})
        
        if not media_links:
            print("❌ Aucun media_links trouvé!")
            return
        
        print("🎯 MEDIA LINKS DISPONIBLES:")
        print()
        
        for quality, links in media_links.items():
            if links:  # Ignorer les liens null
                print(f"📂 {quality.upper()}:")
                
                for link_type, url in links.items():
                    if url:
                        print(f"   🔗 {link_type}: {url}")
                    else:
                        print(f"   ❌ {link_type}: null")
                
                print()
            else:
                print(f"❌ {quality.upper()}: null (transcodage non terminé?)")
                print()
        
        # Recommandations Discord
        print("🎮 RECOMMANDATIONS DISCORD (Limite 8MB/20MB):")
        
        # Stratégie optimisée Discord (priorité qualité)
        best_video_url = None
        video_strategy = ""
        
        # 1. PRIORITÉ: high_quality (meilleure qualité possible)
        if 'high_quality' in media_links and media_links['high_quality']:
            hq_download = media_links['high_quality'].get('download_url')
            if hq_download:
                best_video_url = hq_download
                video_strategy = "⚡ HIGH_QUALITY (Priorité qualité)"
                print(f"   {video_strategy}: {hq_download}")
        
        # 2. FALLBACK: efficient (optimisé Frame.io)
        if not best_video_url and 'efficient' in media_links and media_links['efficient']:
            eff_download = media_links['efficient'].get('download_url')
            if eff_download:
                best_video_url = eff_download
                video_strategy = "🎯 EFFICIENT (Optimisé Frame.io)"
                print(f"   {video_strategy}: {eff_download}")
        
        # 3. Garantie légère: 180p
        if not best_video_url and 'video_h264_180' in media_links and media_links['video_h264_180']:
            light_url = media_links['video_h264_180'].get('download_url')
            if light_url:
                best_video_url = light_url
                video_strategy = "📱 VIDEO_H264_180 (Léger garanti)"
                print(f"   {video_strategy}: {light_url}")
        
        # 4. Thumbnail fallback
        if 'thumbnail' in media_links and media_links['thumbnail']:
            thumb_url = media_links['thumbnail'].get('url')
            if thumb_url:
                fallback_strategy = "🖼️ THUMBNAIL (Image statique)"
                print(f"   {fallback_strategy}: {thumb_url}")
        
        if best_video_url:
            print(f"\n   ✅ SÉLECTION FINALE: {video_strategy}")
            print(f"   🔗 URL: {best_video_url}")
        else:
            print(f"\n   ❌ Aucune vidéo disponible, utiliser thumbnail")
        
        print(f"\n   📋 STRATÉGIE MISE À JOUR:")
        print(f"   1. high_quality → 2. efficient → 3. video_h264_180 → 4. thumbnail")
        print(f"   💡 high_quality = meilleure qualité, efficient = optimisé web")
        
        print("=" * 80)
        
        return file_data


async def main():
    print("🔍 Frame.io Media Links Inspector")
    print()
    
    # ID de fichier connu des logs
    default_file_id = "1d335dcb-1d0a-4c41-bbcd-abd2815ed341"
    
    file_id = input(f"📝 ID fichier Frame.io [{default_file_id}]: ").strip()
    if not file_id:
        file_id = default_file_id
    
    inspector = FrameIOAPIInspector()
    
    print(f"🔍 Inspection du fichier: {file_id}")
    print()
    
    file_data = await inspector.get_file_with_media_links(file_id)
    analysis = inspector.analyze_media_links(file_data)
    
    if analysis:
        # Sauvegarder
        output_file = Path("frame_io_media_analysis.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Données complètes sauvées: {output_file}")


if __name__ == "__main__":
    asyncio.run(main())
