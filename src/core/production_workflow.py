#!/usr/bin/env python3
"""
Production Workflow pour PostFlow
Intègre tous les modules réels : LucidLink, Frame.io, Discord, Google Sheets
"""

import os
import json
import logging
import asyncio
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime

# Imports des modules PostFlow
from .lucidlink_watcher import create_lucidlink_watcher
from ..integrations.frameio.upload import FrameIOUploader
from ..integrations.discord.notifier import DiscordNotifier
from ..integrations.sheets.tracker import SheetsTracker
from ..integrations.sheets.auth import init_sheets_user_manager
from ..utils.config import ConfigManager
from ..utils.thumbnail import ThumbnailGenerator

logger = logging.getLogger(__name__)


class ProductionWorkflow:
    """Workflow de production PostFlow complet."""
    
    def __init__(self, config_path: str = None):
        """
        Initialiser le workflow.
        
        Args:
            config_path: Chemin vers le fichier de configuration
        """
        self.config_path = config_path or "config/integrations.json"
        self.config = ConfigManager(self.config_path)
        
        # Composants principaux
        self.frameio_uploader = None
        self.discord_notifier = None
        self.sheets_tracker = None
        self.thumbnail_generator = None
        self.lucidlink_watcher = None
        
        # État du workflow
        self.is_running = False
        self.processing_files = set()
        
    async def initialize(self):
        """Initialiser tous les composants."""
        logger.info("🚀 Initialisation du workflow de production PostFlow...")
        
        try:
            # Initialiser Frame.io
            await self._init_frameio()
            
            # Initialiser Discord
            await self._init_discord()
            
            # Initialiser Google Sheets
            await self._init_sheets()
            
            # Initialiser le générateur de thumbnails
            self._init_thumbnail_generator()
            
            # Initialiser le watcher LucidLink
            self._init_lucidlink_watcher()
            
            logger.info("✅ Workflow initialisé avec succès")
            
        except Exception as e:
            logger.error(f"❌ Erreur initialisation workflow: {e}")
            raise
    
    async def _init_frameio(self):
        """Initialiser Frame.io."""
        try:
            frameio_config = self.config.get_config("frameio")
            if not frameio_config:
                raise ValueError("Configuration Frame.io manquante")
            
            self.frameio_uploader = FrameIOUploader(
                token=frameio_config.get("token"),
                project_id=frameio_config.get("project_id"),
                config_path=self.config_path
            )
            
            # Vérifier la connexion
            await self.frameio_uploader.verify_connection()
            logger.info("✅ Frame.io initialisé")
            
        except Exception as e:
            logger.error(f"❌ Erreur Frame.io: {e}")
            raise
    
    async def _init_discord(self):
        """Initialiser Discord."""
        try:
            discord_config = self.config.get_config("discord")
            if not discord_config:
                raise ValueError("Configuration Discord manquante")
            
            self.discord_notifier = DiscordNotifier(
                webhook_url=discord_config.get("webhook_url"),
                config_path=self.config_path
            )
            
            # Test de connexion
            await self.discord_notifier.send_notification(
                "🚀 PostFlow Production démarré",
                "Le workflow de production est maintenant actif"
            )
            logger.info("✅ Discord initialisé")
            
        except Exception as e:
            logger.error(f"❌ Erreur Discord: {e}")
            raise
    
    async def _init_sheets(self):
        """Initialiser Google Sheets."""
        try:
            sheets_config = self.config.get_config("sheets")
            if not sheets_config:
                raise ValueError("Configuration Google Sheets manquante")
            
            # Initialiser le user manager
            user_manager = init_sheets_user_manager()
            
            self.sheets_tracker = SheetsTracker(
                spreadsheet_id=sheets_config.get("spreadsheet_id"),
                user_manager=user_manager,
                config_path=self.config_path
            )
            
            # Vérifier la connexion
            await self.sheets_tracker.verify_connection()
            logger.info("✅ Google Sheets initialisé")
            
        except Exception as e:
            logger.error(f"❌ Erreur Google Sheets: {e}")
            raise
    
    def _init_thumbnail_generator(self):
        """Initialiser le générateur de thumbnails."""
        try:
            self.thumbnail_generator = ThumbnailGenerator()
            logger.info("✅ Générateur de thumbnails initialisé")
            
        except Exception as e:
            logger.error(f"❌ Erreur thumbnail generator: {e}")
            raise
    
    def _init_lucidlink_watcher(self):
        """Initialiser le watcher LucidLink."""
        try:
            lucidlink_config = self.config.get_config("lucidlink")
            if not lucidlink_config:
                raise ValueError("Configuration LucidLink manquante")
            
            watch_directory = lucidlink_config.get("watch_directory", "/Volumes/LucidLink/UNDLM_EXPORTS")
            
            self.lucidlink_watcher = create_lucidlink_watcher(watch_directory)
            
            # Remplacer le callback par défaut par notre workflow
            self.lucidlink_watcher.handler.callback = self.process_new_export
            
            logger.info(f"✅ Watcher LucidLink initialisé ({watch_directory})")
            
        except Exception as e:
            logger.error(f"❌ Erreur watcher LucidLink: {e}")
            raise
    
    async def process_new_export(self, file_path: str, metadata: Dict[str, Any]):
        """
        Traiter un nouveau fichier d'export.
        
        Args:
            file_path: Chemin du fichier
            metadata: Métadonnées extraites
        """
        file_name = metadata.get('file_name', os.path.basename(file_path))
        
        # Éviter les doublons
        if file_path in self.processing_files:
            logger.info(f"⏭️ Fichier déjà en cours de traitement: {file_name}")
            return
        
        self.processing_files.add(file_path)
        
        try:
            logger.info(f"🎬 NOUVEAU EXPORT DÉTECTÉ: {file_name}")
            
            # Étape 1: Générer le thumbnail
            await self._generate_thumbnail(file_path, metadata)
            
            # Étape 2: Upload Frame.io
            frameio_info = await self._upload_to_frameio(file_path, metadata)
            
            # Étape 3: Notification Discord
            await self._send_discord_notification(file_path, metadata, frameio_info)
            
            # Étape 4: Mise à jour Google Sheets
            await self._update_sheets(file_path, metadata, frameio_info)
            
            logger.info(f"✅ Workflow terminé pour: {file_name}")
            
        except Exception as e:
            logger.error(f"❌ Erreur workflow pour {file_name}: {e}")
            
            # Notification d'erreur
            await self._send_error_notification(file_path, metadata, str(e))
            
        finally:
            self.processing_files.discard(file_path)
    
    async def _generate_thumbnail(self, file_path: str, metadata: Dict[str, Any]):
        """Générer le thumbnail du fichier."""
        try:
            logger.info(f"🖼️ Génération thumbnail...")
            
            thumbnail_path = await self.thumbnail_generator.generate(
                file_path, 
                output_dir="output/thumbnails"
            )
            
            metadata['thumbnail_path'] = thumbnail_path
            logger.info(f"✅ Thumbnail généré: {thumbnail_path}")
            
        except Exception as e:
            logger.warning(f"⚠️ Erreur génération thumbnail: {e}")
            metadata['thumbnail_path'] = None
    
    async def _upload_to_frameio(self, file_path: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Upload vers Frame.io."""
        try:
            logger.info(f"📤 Upload Frame.io...")
            
            # Déterminer le dossier de destination
            folder_path = self._determine_frameio_folder(metadata)
            
            # Upload du fichier
            upload_result = await self.frameio_uploader.upload_file(
                file_path=file_path,
                folder_path=folder_path,
                metadata=metadata
            )
            
            logger.info(f"✅ Upload Frame.io terminé")
            logger.info(f"🔗 Review Link: {upload_result.get('review_link', 'N/A')}")
            
            return upload_result
            
        except Exception as e:
            logger.error(f"❌ Erreur upload Frame.io: {e}")
            return {}
    
    def _determine_frameio_folder(self, metadata: Dict[str, Any]) -> str:
        """Déterminer le dossier Frame.io de destination."""
        nomenclature = metadata.get('nomenclature', 'UNKNOWN')
        
        # Structure: UNDLM_EXPORTS/SHOT_XXX/
        folder_path = f"UNDLM_EXPORTS/{nomenclature}"
        
        return folder_path
    
    async def _send_discord_notification(self, file_path: str, metadata: Dict[str, Any], frameio_info: Dict[str, Any]):
        """Envoyer notification Discord."""
        try:
            logger.info(f"📢 Envoi notification Discord...")
            
            # Construire le message
            file_name = metadata.get('file_name', os.path.basename(file_path))
            nomenclature = metadata.get('nomenclature', 'N/A')
            version = metadata.get('version', 'N/A')
            file_size = metadata.get('file_size', 0)
            
            title = f"🎬 Nouveau plan exporté: {nomenclature}"
            
            message = f"""
**Fichier:** {file_name}
**Plan:** {nomenclature}
**Version:** {version}
**Taille:** {file_size / (1024*1024):.1f} MB
**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            """
            
            # Ajouter les liens Frame.io
            review_link = frameio_info.get('review_link')
            if review_link:
                message += f"\n🔗 **Review:** {review_link}"
            
            share_link = frameio_info.get('share_link')
            if share_link:
                message += f"\n📤 **Share:** {share_link}"
            
            await self.discord_notifier.send_notification(title, message)
            
            logger.info("✅ Notification Discord envoyée")
            
        except Exception as e:
            logger.error(f"❌ Erreur notification Discord: {e}")
    
    async def _update_sheets(self, file_path: str, metadata: Dict[str, Any], frameio_info: Dict[str, Any]):
        """Mettre à jour Google Sheets."""
        try:
            logger.info(f"📊 Mise à jour Google Sheets...")
            
            # Préparer les données
            update_data = {
                'nomenclature': metadata.get('nomenclature', ''),
                'version': metadata.get('version', ''),
                'file_name': metadata.get('file_name', ''),
                'file_size': metadata.get('file_size', 0),
                'status': 'Exporté',
                'export_date': datetime.now().isoformat(),
                'review_link': frameio_info.get('review_link', ''),
                'share_link': frameio_info.get('share_link', ''),
                'thumbnail_path': metadata.get('thumbnail_path', '')
            }
            
            # Mettre à jour la ligne correspondante
            result = await self.sheets_tracker.update_shot_status(
                nomenclature=metadata.get('nomenclature', ''),
                status='Exporté',
                additional_data=update_data
            )
            
            logger.info("✅ Google Sheets mis à jour")
            
        except Exception as e:
            logger.error(f"❌ Erreur mise à jour Sheets: {e}")
    
    async def _send_error_notification(self, file_path: str, metadata: Dict[str, Any], error_message: str):
        """Envoyer une notification d'erreur."""
        try:
            file_name = metadata.get('file_name', os.path.basename(file_path))
            
            title = f"❌ Erreur workflow: {file_name}"
            message = f"""
**Fichier:** {file_name}
**Erreur:** {error_message}
**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            """
            
            await self.discord_notifier.send_notification(title, message)
            
        except Exception as e:
            logger.error(f"❌ Erreur envoi notification d'erreur: {e}")
    
    async def start(self):
        """Démarrer le workflow."""
        if self.is_running:
            logger.warning("⚠️ Workflow déjà démarré")
            return
        
        logger.info("🚀 Démarrage du workflow de production...")
        
        try:
            # Initialiser tous les composants
            await self.initialize()
            
            # Démarrer le watcher
            self.lucidlink_watcher.start()
            
            self.is_running = True
            logger.info("✅ Workflow de production démarré")
            
            # Notification de démarrage
            await self.discord_notifier.send_notification(
                "🚀 PostFlow Production démarré",
                f"Le workflow surveille maintenant: {self.lucidlink_watcher.watch_directory}"
            )
            
        except Exception as e:
            logger.error(f"❌ Erreur démarrage workflow: {e}")
            raise
    
    async def stop(self):
        """Arrêter le workflow."""
        logger.info("🛑 Arrêt du workflow de production...")
        
        self.is_running = False
        
        if self.lucidlink_watcher:
            self.lucidlink_watcher.stop()
        
        # Attendre la fin du traitement des fichiers en cours
        while self.processing_files:
            logger.info(f"⏳ Attente fin traitement ({len(self.processing_files)} fichiers)...")
            await asyncio.sleep(1)
        
        logger.info("✅ Workflow arrêté")
        
        # Notification d'arrêt
        if self.discord_notifier:
            await self.discord_notifier.send_notification(
                "🛑 PostFlow Production arrêté",
                "Le workflow de production a été arrêté"
            )
    
    async def wait_for_files(self):
        """Attendre les fichiers (boucle principale)."""
        try:
            while self.is_running:
                await asyncio.sleep(1)
        except KeyboardInterrupt:
            logger.info("Arrêt demandé par l'utilisateur")
            await self.stop()


async def main():
    """Point d'entrée principal."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    workflow = ProductionWorkflow()
    
    try:
        await workflow.start()
        await workflow.wait_for_files()
    except KeyboardInterrupt:
        await workflow.stop()
    except Exception as e:
        logger.error(f"❌ Erreur fatale: {e}")
        await workflow.stop()


if __name__ == "__main__":
    asyncio.run(main())
