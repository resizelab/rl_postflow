#!/usr/bin/env python3
"""
Wrapper optimisé pour le watcher qui évite la double validation
tout en maintenant la sécurité du pipeline
"""

import asyncio
import logging
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime

from src.core.lucidlink_watcher import LucidLinkWatcher
from src.integrations.frameio.upload import FrameIOUploadManager
from src.integrations.frameio.auth import FrameIOAuth
from src.integrations.frameio.structure import FrameIOStructureManager
from src.integrations.discord import DiscordNotifier

logger = logging.getLogger(__name__)


class OptimizedWatcherCallback:
    """
    Callback optimisé pour le watcher qui évite la double validation
    tout en maintenant la sécurité du pipeline
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.upload_manager: Optional[FrameIOUploadManager] = None
        self.auth: Optional[FrameIOAuth] = None
        self.discord: Optional[DiscordNotifier] = None
        
    async def initialize(self) -> bool:
        """Initialiser les composants Frame.io"""
        try:
            # Authentification Frame.io
            self.auth = FrameIOAuth()
            if not await self.auth.test_connection():
                logger.error("❌ Échec authentification Frame.io")
                return False
                
            # Upload manager
            self.upload_manager = FrameIOUploadManager(self.auth)
            
            # Discord (optionnel)
            discord_config = self.config.get('discord', {})
            if discord_config.get('enabled', False):
                webhook_url = discord_config.get('webhook_url')
                if webhook_url:
                    self.discord = DiscordNotifier(webhook_url)
                    
            logger.info("✅ OptimizedWatcherCallback initialisé")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur initialisation callback: {e}")
            return False
    
    async def __call__(self, file_path: str, metadata: Dict[str, Any]) -> None:
        """
        Callback appelé par le watcher pour chaque fichier validé
        
        Args:
            file_path: Chemin du fichier (déjà validé par le watcher)
            metadata: Métadonnées extraites par le watcher
        """
        try:
            logger.info(f"🎬 Traitement fichier validé: {Path(file_path).name}")
            
            # Extraire les informations de nomenclature
            nomenclature = metadata.get('nomenclature', 'UNKNOWN')
            scene_name = metadata.get('scene_name', 'UNKNOWN_SCENE')
            shot_id = metadata.get('shot_id', nomenclature)
            
            logger.info(f"📋 Nomenclature: {nomenclature}")
            logger.info(f"🎭 Scène: {scene_name}")
            logger.info(f"🎯 Shot ID: {shot_id}")
            
            # Upload avec validation ignorée (fichier déjà validé par le watcher)
            result = await self.upload_manager.upload_file_remote(
                file_path=file_path,
                scene_name=scene_name,
                shot_id=shot_id,
                project_id=self.config.get('frameio', {}).get('project_id'),
                workspace_id=self.config.get('frameio', {}).get('workspace_id'),
                metadata={
                    'description': f"Upload automatique - {nomenclature}",
                    'tags': [nomenclature, scene_name, 'watcher_auto'],
                    'watcher_validated': True,
                    'upload_timestamp': datetime.now().isoformat()
                },
                skip_validation=True  # ✅ OPTIMISATION: Ignorer la double validation
            )
            
            if result:
                logger.info(f"✅ Upload réussi: {result['file_id']}")
                
                # Notification Discord
                if self.discord:
                    await self._send_discord_notification(file_path, result, scene_name)
                    
            else:
                logger.error(f"❌ Upload échoué pour {Path(file_path).name}")
                
        except Exception as e:
            logger.error(f"❌ Erreur callback: {e}")
    
    async def _send_discord_notification(self, file_path: str, result: Dict[str, Any], scene_name: str):
        """Envoie une notification Discord"""
        try:
            embed = {
                "title": "🎬 Nouveau fichier uploadé automatiquement",
                "description": f"Le watcher a détecté et uploadé un nouveau fichier",
                "color": 0x00ff00,
                "fields": [
                    {"name": "📁 Fichier", "value": Path(file_path).name, "inline": True},
                    {"name": "🎭 Scène", "value": scene_name, "inline": True},
                    {"name": "🆔 File ID", "value": result['file_id'], "inline": False},
                    {"name": "🔗 Frame.io", "value": f"[Voir le fichier]({result.get('view_url', '#')})", "inline": False},
                    {"name": "🔒 Sécurité", "value": "✅ Validation stricte effectuée", "inline": False}
                ],
                "timestamp": datetime.utcnow().isoformat(),
                "footer": {"text": "RL PostFlow - Watcher Automatique"}
            }
            
            await self.discord.send_embed(embed)
            logger.info(f"📢 Notification Discord envoyée pour {Path(file_path).name}")
            
        except Exception as e:
            logger.error(f"❌ Erreur notification Discord: {e}")


class OptimizedWatcherManager:
    """
    Gestionnaire optimisé du watcher avec callback intelligent
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.watcher: Optional[LucidLinkWatcher] = None
        self.callback: Optional[OptimizedWatcherCallback] = None
        
    async def initialize(self) -> bool:
        """Initialiser le watcher et le callback"""
        try:
            # Initialiser le callback
            self.callback = OptimizedWatcherCallback(self.config)
            if not await self.callback.initialize():
                return False
                
            # Initialiser le watcher
            self.watcher = LucidLinkWatcher(
                watch_path=self.config.get('watcher', {}).get('watch_path'),
                callback=self.callback,
                config=self.config
            )
            
            logger.info("✅ OptimizedWatcherManager initialisé")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur initialisation watcher: {e}")
            return False
    
    def start(self):
        """Démarrer le watcher"""
        if self.watcher:
            self.watcher.start()
            logger.info("🚀 Watcher optimisé démarré")
        else:
            logger.error("❌ Watcher non initialisé")
    
    def stop(self):
        """Arrêter le watcher"""
        if self.watcher:
            self.watcher.stop()
            logger.info("🛑 Watcher optimisé arrêté")


async def main():
    """Test du watcher optimisé"""
    import json
    
    # Configuration
    config_path = Path("config/integrations.json")
    if not config_path.exists():
        logger.error("❌ Configuration non trouvée")
        return
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Créer et démarrer le watcher optimisé
    manager = OptimizedWatcherManager(config)
    if await manager.initialize():
        logger.info("🎬 Watcher optimisé prêt")
        logger.info("🔒 Validation stricte: Watcher uniquement (pas de double validation)")
        logger.info("⚡ Performance: Améliorée grâce à l'optimisation")
        
        # Démarrer le watcher
        manager.start()
        
        try:
            # Maintenir le watcher actif
            while True:
                await asyncio.sleep(60)
                logger.info("📊 Watcher actif - Pipeline sécurisé et optimisé")
                
        except KeyboardInterrupt:
            logger.info("🔚 Arrêt demandé par l'utilisateur")
        finally:
            manager.stop()
    else:
        logger.error("❌ Impossible d'initialiser le watcher optimisé")


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    asyncio.run(main())
