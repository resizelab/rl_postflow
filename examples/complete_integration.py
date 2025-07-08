"""
Exemple d'intégration complète Frame.io + Discord + Google Sheets
Démontre l'utilisation des nouveaux modules pour un workflow complet
"""

import asyncio
import logging
from pathlib import Path
from typing import Dict, Any, Optional

from src.integrations.frameio.upload import FrameIOUploadManager
from src.integrations.frameio.auth import FrameIOAuth
from src.integrations.discord.notifier import DiscordNotifier, create_discord_notifier
from src.integrations.sheets.auth import GoogleSheetsAuth, GoogleSheetsConfig
from src.integrations.sheets.users import init_sheets_user_manager, get_assigned_user
from src.integrations.sheets.status import SheetsStatusTracker

logger = logging.getLogger(__name__)


class PostFlowIntegration:
    """Intégration complète du pipeline PostFlow."""
    
    def __init__(self, frameio_auth: FrameIOAuth, discord_webhook: str, sheets_config: GoogleSheetsConfig):
        """
        Initialise l'intégration complète.
        
        Args:
            frameio_auth: Authentification Frame.io
            discord_webhook: URL du webhook Discord
            sheets_config: Configuration Google Sheets
        """
        self.frameio_upload = FrameIOUploadManager(frameio_auth)
        self.discord_notifier = create_discord_notifier(discord_webhook)
        
        # Initialiser Google Sheets
        self.sheets_auth = GoogleSheetsAuth(sheets_config)
        self.sheets_status = None
        self.user_manager = None
        
    async def initialize(self) -> bool:
        """
        Initialise toutes les connexions.
        
        Returns:
            bool: True si l'initialisation est réussie
        """
        try:
            # Connecter Google Sheets
            if not self.sheets_auth.connect():
                logger.error("Impossible de se connecter à Google Sheets")
                return False
            
            # Initialiser les modules Sheets
            self.sheets_status = SheetsStatusTracker(self.sheets_auth)
            self.user_manager = init_sheets_user_manager(self.sheets_auth)
            
            logger.info("Intégration PostFlow initialisée avec succès")
            return True
            
        except Exception as e:
            logger.error(f"Erreur initialisation intégration: {e}")
            return False
    
    async def process_shot_upload(self, shot_id: str, file_path: str, scene_name: str) -> bool:
        """
        Traite l'upload complet d'un plan avec notifications.
        
        Args:
            shot_id: ID du plan (ex: "UNDLM_00412")
            file_path: Chemin vers le fichier
            scene_name: Nom de la scène
            
        Returns:
            bool: True si le traitement est réussi
        """
        try:
            logger.info(f"🎬 Traitement upload: {shot_id} - {scene_name}")
            
            # 1. Upload vers Frame.io
            frameio_file = await self.frameio_upload.upload_file(
                shot_id=shot_id,
                file_path=file_path,
                scene_name=scene_name
            )
            
            if not frameio_file:
                logger.error(f"❌ Échec upload Frame.io pour {shot_id}")
                return False
            
            # 2. Récupérer l'utilisateur assigné
            assigned_user = get_assigned_user(shot_id)
            mention_user_id = assigned_user.get('discord_id') if assigned_user else None
            
            # 3. Extraire version du fichier
            file_path_obj = Path(file_path)
            filename = file_path_obj.name
            version = "v1"
            if "_v" in filename:
                try:
                    version_part = filename.split("_v")[1].split(".")[0]
                    version = f"v{version_part}"
                except:
                    pass
            
            # 4. Notifier sur Discord
            notification_sent = self.discord_notifier.notify_shot_upload_complete(
                shot_nomenclature=shot_id,
                scene_name=scene_name,
                version=version,
                frameio_link=frameio_file.review_url or f"https://app.frame.io/workspace/{frameio_file.workspace_id}/asset/{frameio_file.id}",
                mention_user_id=mention_user_id
            )
            
            if not notification_sent:
                logger.warning(f"⚠️ Notification Discord non envoyée pour {shot_id}")
            
            # 5. Mettre à jour Google Sheets
            if self.sheets_status:
                sheets_updated = self.sheets_status.update_frameio_link(
                    shot_id, 
                    frameio_file.review_url or f"https://app.frame.io/workspace/{frameio_file.workspace_id}/asset/{frameio_file.id}"
                )
                
                if not sheets_updated:
                    logger.warning(f"⚠️ Mise à jour Google Sheets non effectuée pour {shot_id}")
            
            logger.info(f"✅ Traitement complet réussi pour {shot_id}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur traitement upload {shot_id}: {e}")
            
            # Notifier l'erreur sur Discord
            if assigned_user:
                self.discord_notifier.notify_error(
                    shot_nomenclature=shot_id,
                    stage="upload",
                    error_message=str(e),
                    mention_user_id=assigned_user.get('discord_id')
                )
            
            return False
    
    async def process_batch_upload(self, files_data: list) -> Dict[str, Any]:
        """
        Traite l'upload de plusieurs fichiers.
        
        Args:
            files_data: Liste des données de fichiers
                Format: [{"shot_id": "UNDLM_00412", "file_path": "/path/to/file", "scene_name": "Scene"}]
        
        Returns:
            Dict: Statistiques du traitement
        """
        stats = {
            "total": len(files_data),
            "success": 0,
            "failed": 0,
            "errors": []
        }
        
        try:
            # Traiter chaque fichier
            for file_data in files_data:
                success = await self.process_shot_upload(
                    shot_id=file_data["shot_id"],
                    file_path=file_data["file_path"],
                    scene_name=file_data["scene_name"]
                )
                
                if success:
                    stats["success"] += 1
                else:
                    stats["failed"] += 1
                    stats["errors"].append(file_data["shot_id"])
            
            # Notifier le résumé
            if stats["success"] > 0:
                self.discord_notifier.send_message(
                    f"📊 Batch upload terminé: {stats['success']}/{stats['total']} fichiers traités avec succès"
                )
            
            return stats
            
        except Exception as e:
            logger.error(f"❌ Erreur batch upload: {e}")
            stats["errors"].append(str(e))
            return stats
    
    def get_shot_status(self, shot_id: str) -> Optional[Dict[str, Any]]:
        """
        Récupère le statut d'un plan depuis Google Sheets.
        
        Args:
            shot_id: ID du plan
            
        Returns:
            Dict: Données du plan ou None
        """
        if not self.sheets_status:
            return None
        
        return self.sheets_status.get_shot_by_nomenclature(shot_id)
    
    def get_assigned_user_info(self, shot_id: str) -> Optional[Dict[str, Any]]:
        """
        Récupère les informations de l'utilisateur assigné.
        
        Args:
            shot_id: ID du plan
            
        Returns:
            Dict: Informations utilisateur ou None
        """
        return get_assigned_user(shot_id)


async def example_usage():
    """Exemple d'utilisation de l'intégration complète."""
    
    # Configuration Frame.io
    frameio_auth = FrameIOAuth()
    
    # Configuration Discord
    discord_webhook = "https://discord.com/api/webhooks/your-webhook-url"
    
    # Configuration Google Sheets
    sheets_config = GoogleSheetsConfig(
        credentials_file="path/to/credentials.json",
        spreadsheet_id="your-spreadsheet-id",
        worksheet_name="Shot Tracking"
    )
    
    # Créer l'intégration
    integration = PostFlowIntegration(frameio_auth, discord_webhook, sheets_config)
    
    # Initialiser
    if not await integration.initialize():
        logger.error("Impossible d'initialiser l'intégration")
        return
    
    # Traiter un upload
    success = await integration.process_shot_upload(
        shot_id="UNDLM_00412",
        file_path="/path/to/UNDLM_00412_v002.mp4",
        scene_name="DOUANE MER - JOUR"
    )
    
    if success:
        logger.info("Upload traité avec succès!")
    else:
        logger.error("Échec du traitement")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(example_usage())
