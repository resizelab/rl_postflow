"""
Frame.io Review Monitor for UNDLM PostFlow
Surveille les commentaires et validations sur Frame.io et envoie les retours aux graphistes
"""

import logging
import time
from typing import Dict, List, Optional, Any, Callable
from datetime import datetime, timedelta
from threading import Thread, Event
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class ReviewEvent:
    """Événement de review détecté sur Frame.io."""
    asset_id: str
    shot_nomenclature: str
    version: int
    event_type: str  # 'comment_added', 'status_changed', 'approval'
    reviewer_name: str
    content: str
    timestamp: datetime
    timecode: Optional[str] = None
    status: Optional[str] = None


class FrameIOReviewMonitor:
    """
    Monitore les reviews sur Frame.io et déclenche les notifications appropriées.
    """
    
    def __init__(self, frameio_client, discord_notifier, google_sheets_client, config):
        """
        Initialise le moniteur de reviews.
        
        Args:
            frameio_client: Client Frame.io
            discord_notifier: Notifieur Discord
            google_sheets_client: Client Google Sheets
            config: Configuration
        """
        self.frameio = frameio_client
        self.discord = discord_notifier
        self.sheets = google_sheets_client
        self.config = config
        
        # Configuration du monitoring
        self.polling_interval = config.get('review_polling_interval', 30)  # secondes
        self.lookback_duration = timedelta(hours=1)  # Chercher les événements de la dernière heure
        
        # État interne
        self.monitored_assets: Dict[str, Dict[str, Any]] = {}
        self.last_check_time = datetime.now()
        self.callbacks: List[Callable[[ReviewEvent], None]] = []
        self.running = False
        self.stop_event = Event()
        self.monitor_thread: Optional[Thread] = None
        
        # Cache pour éviter les doublons
        self.processed_events: Dict[str, datetime] = {}
        self.cache_duration = timedelta(hours=2)
    
    def add_callback(self, callback: Callable[[ReviewEvent], None]):
        """Ajoute un callback à appeler lors de détection d'un événement de review."""
        self.callbacks.append(callback)
    
    def register_asset_for_monitoring(self, asset_id: str, shot_nomenclature: str, version: int):
        """
        Enregistre un asset pour monitoring des reviews.
        
        Args:
            asset_id: ID de l'asset Frame.io
            shot_nomenclature: Nomenclature du plan
            version: Version du plan
        """
        self.monitored_assets[asset_id] = {
            'shot_nomenclature': shot_nomenclature,
            'version': version,
            'registered_at': datetime.now(),
            'last_comment_count': 0,
            'last_status': None
        }
        
        logger.info(f"Registered asset {asset_id} for monitoring ({shot_nomenclature} v{version})")
    
    def start(self):
        """Démarre le monitoring des reviews."""
        if self.running:
            logger.warning("Review monitor already running")
            return
        
        logger.info("Starting Frame.io review monitor")
        self.running = True
        self.stop_event.clear()
        
        # Démarrer le thread de monitoring
        self.monitor_thread = Thread(target=self._monitor_loop, daemon=True)
        self.monitor_thread.start()
        
        logger.info("Review monitor started")
    
    def stop(self):
        """Arrête le monitoring des reviews."""
        if not self.running:
            return
        
        logger.info("Stopping review monitor")
        self.running = False
        self.stop_event.set()
        
        if self.monitor_thread:
            self.monitor_thread.join(timeout=10)
        
        logger.info("Review monitor stopped")
    
    def _monitor_loop(self):
        """Boucle principale de monitoring."""
        while self.running and not self.stop_event.is_set():
            try:
                self._check_for_review_updates()
                self._cleanup_old_assets()
                self._cleanup_cache()
                time.sleep(self.polling_interval)
            except Exception as e:
                logger.error(f"Error in review monitor loop: {e}")
                time.sleep(self.polling_interval * 2)
    
    def _check_for_review_updates(self):
        """Vérifie les mises à jour des reviews pour tous les assets surveillés."""
        if not self.monitored_assets:
            return
        
        logger.debug(f"Checking {len(self.monitored_assets)} assets for review updates")
        
        for asset_id, asset_info in list(self.monitored_assets.items()):
            try:
                self._check_asset_updates(asset_id, asset_info)
            except Exception as e:
                logger.error(f"Error checking asset {asset_id}: {e}")
    
    def _check_asset_updates(self, asset_id: str, asset_info: Dict[str, Any]):
        """Vérifie les mises à jour pour un asset spécifique."""
        # Obtenir les informations actuelles de l'asset
        current_status = self.frameio.get_asset_status(asset_id)
        if not current_status:
            logger.warning(f"Could not get status for asset {asset_id}")
            return
        
        shot_nomenclature = asset_info['shot_nomenclature']
        version = asset_info['version']
        
        # Vérifier les changements de statut
        old_status = asset_info.get('last_status')
        new_status = current_status.get('status')
        
        if new_status and new_status != old_status:
            self._handle_status_change(asset_id, shot_nomenclature, version, old_status, new_status)
            asset_info['last_status'] = new_status
        
        # Vérifier les nouveaux commentaires
        comments = self._get_recent_comments(asset_id)
        old_comment_count = asset_info.get('last_comment_count', 0)
        
        if len(comments) > old_comment_count:
            new_comments = comments[old_comment_count:]
            for comment in new_comments:
                self._handle_new_comment(asset_id, shot_nomenclature, version, comment)
            
            asset_info['last_comment_count'] = len(comments)
    
    def _get_recent_comments(self, asset_id: str) -> List[Dict[str, Any]]:
        """
        Récupère les commentaires récents pour un asset.
        
        Args:
            asset_id: ID de l'asset
            
        Returns:
            Liste des commentaires
        """
        try:
            # Note: Cette méthode devrait être implémentée dans frameio.py
            # Pour l'instant, on simule avec une structure basique
            response = self.frameio.get_asset_status(asset_id)
            if response:
                # Simulation - dans la vraie implémentation, il faudrait 
                # un endpoint spécifique pour les commentaires
                return response.get('comments', [])
            return []
            
        except Exception as e:
            logger.error(f"Error getting comments for asset {asset_id}: {e}")
            return []
    
    def _handle_status_change(self, asset_id: str, shot_nomenclature: str, version: int, 
                            old_status: Optional[str], new_status: str):
        """Gère un changement de statut d'asset."""
        # Éviter les doublons
        event_key = f"{asset_id}_status_{new_status}"
        if self._is_recently_processed(event_key):
            return
        
        logger.info(f"Status change for {shot_nomenclature} v{version}: {old_status} -> {new_status}")
        
        # Créer l'événement
        event = ReviewEvent(
            asset_id=asset_id,
            shot_nomenclature=shot_nomenclature,
            version=version,
            event_type='status_changed',
            reviewer_name='System',
            content=f"Status changed from {old_status or 'None'} to {new_status}",
            timestamp=datetime.now(),
            status=new_status
        )
        
        # Traiter selon le nouveau statut
        if new_status.lower() in ['approved', 'final']:
            self._handle_approval(event)
        elif new_status.lower() in ['needs_changes', 'rejected']:
            self._handle_rejection(event)
        
        # Marquer comme traité
        self.processed_events[event_key] = datetime.now()
        
        # Notifier les callbacks
        self._notify_callbacks(event)
    
    def _handle_new_comment(self, asset_id: str, shot_nomenclature: str, version: int, 
                           comment: Dict[str, Any]):
        """Gère un nouveau commentaire."""
        # Éviter les doublons
        comment_id = comment.get('id', str(datetime.now().timestamp()))
        event_key = f"{asset_id}_comment_{comment_id}"
        if self._is_recently_processed(event_key):
            return
        
        reviewer_name = comment.get('author', {}).get('name', 'Unknown Reviewer')
        comment_text = comment.get('text', '')
        timecode = comment.get('timecode')
        
        logger.info(f"New comment for {shot_nomenclature} v{version} from {reviewer_name}")
        
        # Créer l'événement
        event = ReviewEvent(
            asset_id=asset_id,
            shot_nomenclature=shot_nomenclature,
            version=version,
            event_type='comment_added',
            reviewer_name=reviewer_name,
            content=comment_text,
            timestamp=datetime.now(),
            timecode=timecode
        )
        
        # Marquer comme traité
        self.processed_events[event_key] = datetime.now()
        
        # Notifier les callbacks et envoyer notification
        self._notify_callbacks(event)
        self._send_comment_notification(event)
    
    def _handle_approval(self, event: ReviewEvent):
        """Gère l'approbation d'un plan."""
        logger.info(f"Plan {event.shot_nomenclature} v{event.version} approved")
        
        # Mettre à jour Google Sheets
        try:
            self.sheets.update_shot_status(
                event.shot_nomenclature,
                "REVIEW_APPROVED",
                "FINAL_DELIVERY",
                progress=100,
                notes=f"Version {event.version} approved"
            )
        except Exception as e:
            logger.error(f"Failed to update Google Sheets: {e}")
        
        # Notification Discord
        self._send_approval_notification(event)
    
    def _handle_rejection(self, event: ReviewEvent):
        """Gère le rejet d'un plan."""
        logger.info(f"Plan {event.shot_nomenclature} v{event.version} needs changes")
        
        # Mettre à jour Google Sheets
        try:
            self.sheets.update_shot_status(
                event.shot_nomenclature,
                "AE_IN_PROGRESS",  # Retour en production
                "AFTER_EFFECTS",
                progress=60,
                notes=f"Version {event.version} needs changes"
            )
        except Exception as e:
            logger.error(f"Failed to update Google Sheets: {e}")
        
        # Notification Discord pour retour au graphiste
        self._send_revision_notification(event)
    
    def _send_comment_notification(self, event: ReviewEvent):
        """Envoie une notification Discord pour un nouveau commentaire."""
        try:
            frameio_url = f"https://app.frame.io/reviews/{event.asset_id}"
            
            message = f"💬 **Nouveau commentaire de review**"
            
            embed = {
                "title": f"Shot {event.shot_nomenclature} - Version {event.version}",
                "description": f"Commentaire de {event.reviewer_name}",
                "color": 0x3498db,
                "fields": [
                    {
                        "name": "Commentaire",
                        "value": event.content[:1000] + ("..." if len(event.content) > 1000 else ""),
                        "inline": False
                    }
                ],
                "timestamp": event.timestamp.isoformat(),
                "footer": {
                    "text": f"Frame.io Review • {event.reviewer_name}"
                }
            }
            
            if event.timecode:
                embed["fields"].insert(0, {
                    "name": "Timecode",
                    "value": event.timecode,
                    "inline": True
                })
            
            embed["fields"].append({
                "name": "Frame.io",
                "value": f"[📺 Voir sur Frame.io]({frameio_url})",
                "inline": False
            })
            
            self.discord.send_message(message, embed)
            
        except Exception as e:
            logger.error(f"Failed to send comment notification: {e}")
    
    def _send_approval_notification(self, event: ReviewEvent):
        """Envoie une notification Discord pour une approbation."""
        try:
            message = f"✅ **Plan approuvé !**"
            
            embed = {
                "title": f"Shot {event.shot_nomenclature} - Version {event.version}",
                "description": "Le plan a été approuvé et peut passer à la livraison finale",
                "color": 0x00ff00,
                "fields": [
                    {
                        "name": "Statut",
                        "value": "✅ Approuvé",
                        "inline": True
                    },
                    {
                        "name": "Prochaine étape",
                        "value": "Livraison finale",
                        "inline": True
                    }
                ],
                "timestamp": event.timestamp.isoformat(),
                "footer": {
                    "text": "UNDLM PostFlow"
                }
            }
            
            self.discord.send_message(message, embed)
            
        except Exception as e:
            logger.error(f"Failed to send approval notification: {e}")
    
    def _send_revision_notification(self, event: ReviewEvent):
        """Envoie une notification Discord pour demande de révision."""
        try:
            frameio_url = f"https://app.frame.io/reviews/{event.asset_id}"
            
            message = f"🔄 **Révision demandée**"
            
            embed = {
                "title": f"Shot {event.shot_nomenclature} - Version {event.version}",
                "description": "Des modifications sont demandées sur ce plan",
                "color": 0xff9500,
                "fields": [
                    {
                        "name": "Statut",
                        "value": "🔄 Révision nécessaire",
                        "inline": True
                    },
                    {
                        "name": "Action requise",
                        "value": "Consulter les commentaires et apporter les modifications",
                        "inline": False
                    },
                    {
                        "name": "Frame.io",
                        "value": f"[📺 Voir les commentaires]({frameio_url})",
                        "inline": False
                    }
                ],
                "timestamp": event.timestamp.isoformat(),
                "footer": {
                    "text": "UNDLM PostFlow"
                }
            }
            
            self.discord.send_message(message, embed)
            
        except Exception as e:
            logger.error(f"Failed to send revision notification: {e}")
    
    def _is_recently_processed(self, event_key: str) -> bool:
        """Vérifie si un événement a été traité récemment."""
        if event_key not in self.processed_events:
            return False
        
        processed_time = self.processed_events[event_key]
        return datetime.now() - processed_time < self.cache_duration
    
    def _cleanup_old_assets(self):
        """Supprime les assets anciens du monitoring."""
        max_age = timedelta(days=7)  # Arrêter de surveiller après 7 jours
        current_time = datetime.now()
        
        old_assets = [
            asset_id for asset_id, info in self.monitored_assets.items()
            if current_time - info['registered_at'] > max_age
        ]
        
        for asset_id in old_assets:
            del self.monitored_assets[asset_id]
            logger.info(f"Removed old asset {asset_id} from monitoring")
    
    def _cleanup_cache(self):
        """Nettoie le cache des événements traités."""
        current_time = datetime.now()
        expired_keys = [
            key for key, processed_time in self.processed_events.items()
            if current_time - processed_time > self.cache_duration
        ]
        
        for key in expired_keys:
            del self.processed_events[key]
        
        if expired_keys:
            logger.debug(f"Cleaned {len(expired_keys)} expired events from cache")
    
    def _notify_callbacks(self, event: ReviewEvent):
        """Notifie tous les callbacks enregistrés."""
        for callback in self.callbacks:
            try:
                callback(event)
            except Exception as e:
                logger.error(f"Error in review callback: {e}")
    
    def get_status(self) -> Dict[str, Any]:
        """Retourne le statut du moniteur."""
        return {
            'running': self.running,
            'monitored_assets': len(self.monitored_assets),
            'polling_interval': self.polling_interval,
            'callbacks_registered': len(self.callbacks),
            'processed_events_cache': len(self.processed_events)
        }
