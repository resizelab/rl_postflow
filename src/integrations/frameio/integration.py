"""
Frame.io Integration Main Module
Module principal pour l'intégration LucidLink → Frame.io
Coordonne le parsing, la création de structure, l'upload et la notification
"""

import asyncio
import os
from typing import Dict, List, Optional, Any
from pathlib import Path
import logging

from .parser import FrameIOFileParser, FileMetadata
from .structure import FrameIOStructureManager
from .upload import FrameIOUploadManager
from .notifier import FrameIODiscordNotifier, FrameIONotificationData
from .auth import FrameIOAuth, FrameIOAuthError

# Import du gestionnaire de nomenclature
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent))
from src.utils.nomenclature import get_nomenclature_manager

logger = logging.getLogger(__name__)

class FrameIOIntegrationManager:
    """
    Gestionnaire principal de l'intégration LucidLink → Frame.io.
    Coordonne toutes les étapes du workflow automatisé.
    """
    
    def __init__(self, auth: FrameIOAuth, discord_webhook_url: Optional[str] = None):
        """
        Initialise le gestionnaire d'intégration.
        
        Args:
            auth: Instance d'authentification Frame.io
            discord_webhook_url: URL du webhook Discord (optionnel)
        """
        self.auth = auth
        self.parser = FrameIOFileParser()
        self.structure_manager = FrameIOStructureManager(auth)
        self.upload_manager = FrameIOUploadManager(auth)
        
        # Configuration Discord
        self.discord_notifier = None
        if discord_webhook_url:
            self.discord_notifier = FrameIODiscordNotifier(discord_webhook_url)
        
        # Configuration depuis les variables d'environnement
        self.enable_notifications = os.getenv('ENABLE_DISCORD_NOTIFICATIONS', 'true').lower() == 'true'
        self.auto_cleanup = os.getenv('AUTO_CLEANUP_UPLOADS', 'false').lower() == 'true'
        self.max_concurrent_uploads = int(os.getenv('MAX_CONCURRENT_UPLOADS', '3'))
        
        logger.info("✅ FrameIOIntegrationManager initialisé")
    
    async def process_file(self, file_path: str, force_upload: bool = False) -> Dict[str, Any]:
        """
        Traite un fichier complet : parsing → structure → upload → notification.
        
        Args:
            file_path: Chemin vers le fichier à traiter
            force_upload: Forcer l'upload même si le fichier existe déjà
            
        Returns:
            Dictionnaire avec le résultat du traitement
        """
        try:
            logger.info(f"🚀 Début traitement fichier: {file_path}")
            
            # Étape 1: Validation et parsing du fichier avec le gestionnaire de nomenclature
            nomenclature_manager = get_nomenclature_manager()
            file_info = nomenclature_manager.parse_filename(str(file_path))
            
            if not file_info.valid:
                pattern_info = nomenclature_manager.get_active_pattern_info()
                examples = nomenclature_manager.get_examples()
                error_msg = f"Fichier ne respecte pas la nomenclature '{pattern_info.get('name', 'Unknown')}'. "
                error_msg += f"Exemples valides: {', '.join(examples[:3])}"
                
                return {
                    'status': 'error',
                    'error': error_msg,
                    'file_path': file_path,
                    'pattern_used': file_info.pattern_used
                }
            
            logger.info(f"✅ Fichier parsé: {file_info.project}_{file_info.shot}_v{file_info.version}")
            
            # Étape 2: Récupération ou création de la structure de dossiers
            sequence_folder_name = nomenclature_manager.get_frameio_folder_name(file_info)
            shot_folder_name = nomenclature_manager.get_frameio_shot_folder_name(file_info)
            
            folder_id = await self.structure_manager.get_or_create_folder_path(
                sequence_folder_name, 
                shot_folder_name
            )
            
            if not folder_id:
                return {
                    'status': 'error',
                    'error': 'Impossible de créer/récupérer la structure de dossiers',
                    'file_path': file_path,
                    'file_info': file_info._asdict()
                }
            
            logger.info(f"✅ Structure créée/récupérée: {sequence_folder_name}/{shot_folder_name} → {folder_id}")
            
            # Étape 3: Upload du fichier
            upload_metadata = {
                'shot_id': file_info.shot,
                'project': file_info.project,
                'version': file_info.version,
                'nomenclature': f"{file_info.project}_{file_info.shot}_v{file_info.version}",
                'description': f"Shot {file_info.shot} version {file_info.version}",
                'tags': [file_info.project, f"shot_{file_info.shot}", f"v{file_info.version}"]
            }
            
            if file_info.sequence:
                upload_metadata['sequence'] = file_info.sequence
                upload_metadata['tags'].append(f"seq_{file_info.sequence}")
            
            upload_result = await self.upload_manager.upload_file_to_folder(
                file_path, folder_id, upload_metadata
            )
            
            if not upload_result:
                result = {
                    'status': 'error',
                    'error': 'Échec de l\'upload du fichier',
                    'file_path': file_path,
                    'file_info': file_info._asdict(),
                    'folder_id': folder_id
                }
                
                # Notification d'erreur
                if self.enable_notifications and self.discord_notifier:
                    await self._send_error_notification(result, file_path)
                
                return result
            
            logger.info(f"✅ Upload réussi: {upload_result['file_id']}")
            
            # Étape 4: Notification Discord
            result = {
                'status': 'success',
                'file_path': file_path,
                'file_info': file_info._asdict(),
                'folder_id': folder_id,
                'upload_result': upload_result
            }
            
            if self.enable_notifications and self.discord_notifier:
                await self._send_success_notification(upload_result, file_path)
            
            logger.info(f"✅ Traitement terminé: {file_info.project}_{file_info.shot}_v{file_info.version}")
            return result
            
        except Exception as e:
            logger.error(f"❌ Erreur traitement fichier {file_path}: {e}")
            
            result = {
                'status': 'error',
                'error': str(e),
                'file_path': file_path
            }
            
            # Notification d'erreur
            if self.enable_notifications and self.discord_notifier:
                await self._send_error_notification(result, file_path)
            
            return result
    
    async def process_batch(self, file_paths: List[str], max_concurrent: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Traite plusieurs fichiers en parallèle.
        
        Args:
            file_paths: Liste des chemins de fichiers à traiter
            max_concurrent: Nombre maximum de traitements simultanés
            
        Returns:
            Liste des résultats de traitement
        """
        try:
            max_concurrent = max_concurrent or self.max_concurrent_uploads
            
            logger.info(f"🚀 Début traitement batch: {len(file_paths)} fichiers (max {max_concurrent} simultanés)")
            
            # Créer un semaphore pour limiter les uploads simultanés
            semaphore = asyncio.Semaphore(max_concurrent)
            
            async def process_with_semaphore(file_path):
                async with semaphore:
                    return await self.process_file(file_path)
            
            # Lancer tous les traitements en parallèle
            tasks = [process_with_semaphore(file_path) for file_path in file_paths]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Traiter les résultats
            final_results = []
            for i, result in enumerate(results):
                if isinstance(result, Exception):
                    logger.error(f"Erreur traitement fichier {i}: {result}")
                    final_results.append({
                        'status': 'error',
                        'error': str(result),
                        'file_path': file_paths[i] if i < len(file_paths) else 'unknown'
                    })
                else:
                    final_results.append(result)
            
            # Statistiques
            success_count = sum(1 for r in final_results if r.get('status') == 'success')
            error_count = len(final_results) - success_count
            
            logger.info(f"✅ Batch terminé: {success_count}/{len(file_paths)} réussis")
            
            # Notification de résumé
            if self.enable_notifications and self.discord_notifier:
                await self._send_batch_summary_notification(final_results)
            
            return final_results
            
        except Exception as e:
            logger.error(f"❌ Erreur traitement batch: {e}")
            return [{
                'status': 'error',
                'error': str(e),
                'file_path': file_path
            } for file_path in file_paths]
    
    async def watch_folder(self, folder_path: str, callback: Optional[callable] = None) -> None:
        """
        Surveille un dossier pour les nouveaux fichiers.
        
        Args:
            folder_path: Chemin du dossier à surveiller
            callback: Fonction callback optionnelle pour les nouveaux fichiers
        """
        try:
            logger.info(f"👀 Surveillance démarrée: {folder_path}")
            
            # Cette fonction nécessiterait l'implémentation d'un watcher
            # Pour l'instant, c'est un placeholder
            # Dans une implémentation complète, on utiliserait watchdog ou inotify
            
            while True:
                await asyncio.sleep(5)  # Polling toutes les 5 secondes
                
                # Logique de surveillance à implémenter
                # 1. Scanner le dossier pour nouveaux fichiers
                # 2. Filtrer les fichiers vidéo
                # 3. Appeler process_file pour chaque nouveau fichier
                # 4. Marquer les fichiers comme traités
                
        except Exception as e:
            logger.error(f"❌ Erreur surveillance dossier: {e}")
    
    async def _send_success_notification(self, upload_result: Dict[str, Any], file_path: str) -> None:
        """Envoie une notification de succès Discord"""
        try:
            if not self.discord_notifier:
                return
            
            notification_data = FrameIODiscordNotifier.create_notification_data(upload_result, file_path)
            await asyncio.to_thread(self.discord_notifier.send_upload_success_notification, notification_data)
            
        except Exception as e:
            logger.error(f"Erreur notification succès: {e}")
    
    async def _send_error_notification(self, result: Dict[str, Any], file_path: str) -> None:
        """Envoie une notification d'erreur Discord"""
        try:
            if not self.discord_notifier:
                return
            
            # Créer des données de notification minimales pour l'erreur
            notification_data = FrameIONotificationData(
                file_name=Path(file_path).name,
                shot_id=result.get('metadata', {}).get('shot_id', 'Unknown'),
                scene_name=result.get('metadata', {}).get('scene_name', 'Unknown'),
                version=result.get('metadata', {}).get('version', 'V001'),
                nomenclature=result.get('metadata', {}).get('nomenclature', Path(file_path).stem),
                file_size=Path(file_path).stat().st_size if Path(file_path).exists() else 0,
                upload_status='error',
                review_link='',
                folder_path=f"SCENES/{result.get('metadata', {}).get('scene_name', 'Unknown')}/{result.get('metadata', {}).get('shot_id', 'Unknown')}",
                upload_timestamp=result.get('timestamp', ''),
                file_id='',
                project_id='',
                error_message=result.get('error', 'Erreur inconnue')
            )
            
            await asyncio.to_thread(self.discord_notifier.send_upload_error_notification, notification_data)
            
        except Exception as e:
            logger.error(f"Erreur notification erreur: {e}")
    
    async def _send_batch_summary_notification(self, results: List[Dict[str, Any]]) -> None:
        """Envoie une notification de résumé Discord"""
        try:
            if not self.discord_notifier:
                return
            
            # Convertir les résultats en format attendu par le notificateur
            formatted_results = []
            for result in results:
                if result.get('status') == 'success':
                    formatted_results.append({
                        'file_name': result.get('upload_result', {}).get('file_name', 'Unknown'),
                        'upload_status': 'success'
                    })
                else:
                    formatted_results.append({
                        'file_name': Path(result.get('file_path', 'Unknown')).name,
                        'upload_status': 'error'
                    })
            
            await asyncio.to_thread(self.discord_notifier.send_batch_summary_notification, formatted_results)
            
        except Exception as e:
            logger.error(f"Erreur notification résumé: {e}")
    
    async def get_processing_status(self) -> Dict[str, Any]:
        """
        Récupère le statut de traitement en cours.
        
        Returns:
            Dictionnaire avec les statistiques de traitement
        """
        try:
            # Récupérer le résumé de la structure
            structure_summary = await self.structure_manager.get_folder_structure_summary()
            
            return {
                'integration_status': 'active',
                'folder_structure': structure_summary,
                'settings': {
                    'notifications_enabled': self.enable_notifications,
                    'auto_cleanup': self.auto_cleanup,
                    'max_concurrent_uploads': self.max_concurrent_uploads
                },
                'last_updated': structure_summary.get('last_updated')
            }
            
        except Exception as e:
            logger.error(f"Erreur récupération statut: {e}")
            return {'integration_status': 'error', 'error': str(e)}
    
    async def cleanup_old_uploads(self, days_old: int = 30) -> Dict[str, Any]:
        """
        Nettoie les anciens uploads (si auto_cleanup activé).
        
        Args:
            days_old: Nombre de jours pour considérer un upload comme ancien
            
        Returns:
            Résultats du nettoyage
        """
        try:
            if not self.auto_cleanup:
                return {'status': 'disabled', 'message': 'Auto cleanup désactivé'}
            
            # Logique de nettoyage à implémenter
            # 1. Identifier les fichiers anciens
            # 2. Vérifier qu'ils ont été traités avec succès
            # 3. Supprimer les fichiers locaux (pas Frame.io)
            
            logger.info("🧹 Nettoyage automatique (à implémenter)")
            
            return {
                'status': 'completed',
                'files_cleaned': 0,
                'space_freed': 0
            }
            
        except Exception as e:
            logger.error(f"Erreur nettoyage: {e}")
            return {'status': 'error', 'error': str(e)}

# Fonction utilitaire pour créer une instance configurée
def create_frameio_integration(config: Dict[str, Any]) -> FrameIOIntegrationManager:
    """
    Crée une instance configurée du gestionnaire d'intégration.
    
    Args:
        config: Configuration contenant les paramètres d'authentification
        
    Returns:
        Instance configurée du gestionnaire
    """
    try:
        # Créer l'instance d'authentification
        auth = FrameIOAuth()
        
        # Récupérer l'URL Discord depuis la config
        discord_webhook_url = config.get('discord', {}).get('webhook_url')
        
        # Créer le gestionnaire
        integration = FrameIOIntegrationManager(auth, discord_webhook_url)
        
        logger.info("✅ Instance d'intégration Frame.io créée")
        return integration
        
    except Exception as e:
        logger.error(f"❌ Erreur création instance d'intégration: {e}")
        raise
