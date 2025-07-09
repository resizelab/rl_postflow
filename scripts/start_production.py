#!/usr/bin/env python3
"""
Script de démarrage PostFlow v2.0 - Production
Ce script lance le watcher LucidLink et traite les fichiers en temps réel
"""
import os
import sys
import asyncio
import signal
import logging
from datetime import datetime
from pathlib import Path

# Ajouter le répertoire parent au chemin Python
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.utils.config import ConfigManager
from src.core.lucidlink_watcher import LucidLinkWatcher
from src.integrations.frameio.upload import FrameIOUploadManager
from src.integrations.discord.notifier import DiscordNotifier
from src.integrations.sheets.tracker import SheetsTracker
from src.utils.thumbnail import ThumbnailGenerator

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('logs/postflow_production.log')
    ]
)
logger = logging.getLogger(__name__)

class PostFlowProduction:
    """Service principal PostFlow pour la production"""
    
    def __init__(self):
        self.config = ConfigManager()
        self.watcher = None
        self.running = False
        self.setup_signal_handlers()
        
        # Initialiser les composants
        self.frameio_manager = FrameIOUploadManager(self.config)
        self.discord_notifier = DiscordNotifier(self.config)
        self.sheets_tracker = SheetsTracker(self.config)
        self.thumbnail_generator = ThumbnailGenerator(self.config)
        
    def setup_signal_handlers(self):
        """Configuration des gestionnaires de signaux"""
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
    
    def signal_handler(self, signum, frame):
        """Gestionnaire de signaux pour arrêt propre"""
        logger.info(f"Signal {signum} reçu, arrêt en cours...")
        self.running = False
    
    async def process_file(self, file_path):
        """Traite un fichier détecté par le watcher"""
        logger.info(f"🎬 Traitement du fichier: {file_path}")
        
        try:
            file_path = Path(file_path)
            
            # 1. Vérifier que le fichier existe et est stable
            if not file_path.exists():
                logger.warning(f"⚠️ Fichier introuvable: {file_path}")
                return
            
            file_size = file_path.stat().st_size
            logger.info(f"📊 Taille du fichier: {file_size / 1024 / 1024:.2f} MB")
            
            # 2. Générer une miniature si activé
            thumbnail_path = None
            if self.config.get('workflow.enable_thumbnails', True):
                try:
                    logger.info("🖼️ Génération de la miniature...")
                    thumbnail_path = await self.thumbnail_generator.generate_thumbnail(file_path)
                    logger.info(f"✅ Miniature générée: {thumbnail_path}")
                except Exception as e:
                    logger.error(f"❌ Erreur génération miniature: {e}")
            
            # 3. Upload vers Frame.io si activé
            frame_io_link = None
            if self.config.get('workflow.enable_frameio_upload', True):
                try:
                    logger.info("📤 Upload vers Frame.io...")
                    frame_io_link = await self.frameio_manager.upload_file_production(
                        file_path,
                        thumbnail_path=thumbnail_path
                    )
                    logger.info(f"✅ Upload Frame.io terminé: {frame_io_link}")
                except Exception as e:
                    logger.error(f"❌ Erreur upload Frame.io: {e}")
            
            # 4. Notification Discord si activée
            if self.config.get('workflow.enable_discord_notifications', True):
                try:
                    logger.info("💬 Envoi notification Discord...")
                    await self.discord_notifier.notify_file_processed(
                        file_path.name,
                        f"Fichier traité avec succès - {datetime.now().strftime('%H:%M:%S')}",
                        frame_io_link or "Pas d'upload Frame.io"
                    )
                    logger.info("✅ Notification Discord envoyée")
                except Exception as e:
                    logger.error(f"❌ Erreur notification Discord: {e}")
            
            # 5. Mise à jour Google Sheets si activée
            if self.config.get('workflow.enable_sheets_updates', True):
                try:
                    logger.info("📊 Mise à jour Google Sheets...")
                    await self.sheets_tracker.update_shot_status(
                        file_path.name,
                        "processed",
                        frame_io_link or "N/A"
                    )
                    logger.info("✅ Google Sheets mis à jour")
                except Exception as e:
                    logger.error(f"❌ Erreur mise à jour Sheets: {e}")
            
            logger.info(f"🎉 Traitement terminé avec succès: {file_path.name}")
            
        except Exception as e:
            logger.error(f"❌ Erreur lors du traitement de {file_path}: {e}")
            
            # Notification d'erreur
            try:
                await self.discord_notifier.notify_error(
                    f"Erreur de traitement",
                    f"Erreur lors du traitement de {file_path}: {str(e)}"
                )
            except:
                pass
    
    async def check_prerequisites(self):
        """Vérifie les prérequis avant démarrage"""
        logger.info("🔍 Vérification des prérequis...")
        
        # Vérifier le volume LucidLink
        lucidlink_path = self.config.get('lucidlink.watch_directory')
        if not os.path.exists(lucidlink_path):
            logger.error(f"❌ Volume LucidLink non monté: {lucidlink_path}")
            return False
        
        # Vérifier les credentials
        sheets_creds = self.config.get('google_sheets.service_account_file')
        if not os.path.exists(sheets_creds):
            logger.error(f"❌ Credentials Google Sheets manquants: {sheets_creds}")
            return False
        
        # Vérifier la configuration Frame.io
        if not self.config.get('frameio.access_token'):
            logger.error("❌ Token Frame.io manquant")
            return False
        
        # Vérifier le webhook Discord
        if not self.config.get('discord.webhook_url'):
            logger.error("❌ Webhook Discord manquant")
            return False
        
        logger.info("✅ Tous les prérequis sont satisfaits")
        return True
    
    async def start_watcher(self):
        """Démarre le watcher LucidLink"""
        logger.info("👁️ Démarrage du watcher LucidLink...")
        
        try:
            self.watcher = LucidLinkWatcher(self.config, self.process_file)
            await self.watcher.start()
            logger.info("✅ Watcher démarré avec succès")
            
            # Notification de démarrage
            await self.discord_notifier.notify_system_status(
                "🚀 PostFlow v2.0 démarré",
                "Le système de surveillance LucidLink est actif"
            )
            
        except Exception as e:
            logger.error(f"❌ Erreur démarrage watcher: {e}")
            raise
    
    async def run(self):
        """Fonction principale du service"""
        logger.info("🚀 Démarrage PostFlow v2.0 - Production")
        logger.info("=" * 50)
        
        # Vérifier les prérequis
        if not await self.check_prerequisites():
            logger.error("❌ Prérequis non satisfaits, arrêt du service")
            return False
        
        # Démarrer le watcher
        await self.start_watcher()
        
        # Boucle principale
        self.running = True
        logger.info("🔄 Service en cours d'exécution...")
        logger.info("Appuyez sur Ctrl+C pour arrêter")
        
        try:
            while self.running:
                await asyncio.sleep(1)
        except KeyboardInterrupt:
            logger.info("⚠️ Interruption clavier détectée")
        
        # Arrêt propre
        logger.info("🛑 Arrêt du service...")
        if self.watcher:
            await self.watcher.stop()
        
        # Notification d'arrêt
        try:
            await self.discord_notifier.notify_system_status(
                "🛑 PostFlow v2.0 arrêté",
                "Le système de surveillance a été arrêté"
            )
        except:
            pass
        
        logger.info("✅ Service arrêté proprement")
        return True

async def main():
    """Fonction principale"""
    # Créer les répertoires nécessaires
    os.makedirs('logs', exist_ok=True)
    os.makedirs('output/thumbnails', exist_ok=True)
    
    # Démarrer le service
    service = PostFlowProduction()
    await service.run()

if __name__ == "__main__":
    asyncio.run(main())
