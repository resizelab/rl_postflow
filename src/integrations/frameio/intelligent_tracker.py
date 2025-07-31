#!/usr/bin/env python3
"""
Gestionnaire de Tracking Intelligent pour Webhooks Frame.io
Utilise le webhook Cloudflare existant avec routage intelligent
"""

import json
import logging
import threading
import time
from typing import Dict, Any, Optional, List, Set
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from pathlib import Path

logger = logging.getLogger(__name__)


@dataclass
class UploadTrackingInfo:
    """Informations de tracking pour un upload"""
    upload_id: str
    file_id: Optional[str] = None
    filename: str = ""
    frameio_project_id: Optional[str] = None
    frameio_workspace_id: Optional[str] = None
    
    # États de tracking
    status: str = "PENDING"  # PENDING, UPLOADING, PROCESSING, READY, COMPLETED
    review_status: str = "NOT_STARTED"  # NOT_STARTED, PENDING, APPROVED, REJECTED, CHANGES_NEEDED
    
    # Métadonnées temporelles
    created_at: datetime = None
    last_updated: datetime = None
    last_comment_check: Optional[datetime] = None
    
    # Données Frame.io
    comments_count: int = 0
    last_comment_id: Optional[str] = None
    review_link: Optional[str] = None
    share_link: Optional[str] = None
    
    # Flags de tracking
    is_tracking_active: bool = True
    webhook_events_received: List[str] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()
        if self.last_updated is None:
            self.last_updated = datetime.now()
        if self.webhook_events_received is None:
            self.webhook_events_received = []


class IntelligentWebhookTracker:
    """
    Gestionnaire de tracking intelligent qui s'intègre au webhook existant
    """
    
    def __init__(self, webhook_manager, upload_tracker):
        self.webhook_manager = webhook_manager
        self.upload_tracker = upload_tracker
        
        # Stockage du tracking intelligent
        self.active_tracks: Dict[str, UploadTrackingInfo] = {}
        self.file_id_to_upload_map: Dict[str, str] = {}  # file_id -> upload_id
        self.filename_to_upload_map: Dict[str, str] = {}  # filename -> upload_id
        
        # Configuration
        self.tracking_duration_days = 7  # Tracker pendant 7 jours max
        self.comment_check_interval = 300  # 5 minutes
        
        # Threading pour le monitoring
        self.monitoring_thread = None
        self.is_monitoring = False
        
        # Statistiques
        self.stats = {
            "total_tracked": 0,
            "active_tracks": 0,
            "events_processed": 0,
            "comments_analyzed": 0,
            "status_changes": 0
        }
        
        # Intégrer avec le webhook manager existant
        self._integrate_with_webhook_manager()
    
    def _integrate_with_webhook_manager(self):
        """Intègre le tracking intelligent avec le webhook manager existant"""
        
        # Sauvegarder la méthode originale
        original_process = self.webhook_manager.process_webhook_sync
        
        # Créer une version améliorée
        def enhanced_process_webhook(webhook_data):
            # Traitement original
            original_process(webhook_data)
            
            # Traitement intelligent supplémentaire
            self.process_webhook_intelligently(webhook_data)
        
        # Remplacer la méthode
        self.webhook_manager.process_webhook_sync = enhanced_process_webhook
        
        logger.info("🧠 Tracking intelligent intégré au webhook manager")
    
    def register_upload_for_tracking(self, 
                                   upload_id: str, 
                                   filename: str,
                                   file_id: Optional[str] = None,
                                   project_id: Optional[str] = None,
                                   workspace_id: Optional[str] = None) -> UploadTrackingInfo:
        """
        Enregistre un upload pour tracking intelligent
        
        Args:
            upload_id: ID interne de l'upload
            filename: Nom du fichier
            file_id: ID Frame.io du fichier (si connu)
            project_id: ID du projet Frame.io
            workspace_id: ID du workspace Frame.io
            
        Returns:
            UploadTrackingInfo: Informations de tracking créées
        """
        
        track_info = UploadTrackingInfo(
            upload_id=upload_id,
            file_id=file_id,
            filename=filename,
            frameio_project_id=project_id,
            frameio_workspace_id=workspace_id
        )
        
        self.active_tracks[upload_id] = track_info
        
        # Créer les mappings pour le routage
        if file_id:
            self.file_id_to_upload_map[file_id] = upload_id
        self.filename_to_upload_map[filename] = upload_id
        
        # Mettre à jour les stats
        self.stats["total_tracked"] += 1
        self.stats["active_tracks"] = len(self.active_tracks)
        
        logger.info(f"📝 Upload enregistré pour tracking intelligent: {filename} (upload_id: {upload_id})")
        
        # Démarrer le monitoring si pas déjà actif
        if not self.is_monitoring:
            self.start_intelligent_monitoring()
        
        return track_info
    
    def process_webhook_intelligently(self, webhook_data: Dict[str, Any]):
        """
        Traite un webhook avec logique de tracking intelligent
        
        Args:
            webhook_data: Données du webhook Frame.io V4
        """
        try:
            event_type = webhook_data.get("type")
            resource = webhook_data.get("resource", {})
            file_id = resource.get("id")
            filename = resource.get("name", "")
            
            # Trouver l'upload correspondant
            upload_id = self._find_upload_for_resource(file_id, filename)
            
            if not upload_id:
                logger.debug(f"📝 Événement pour ressource non trackée: {filename} (file_id: {file_id})")
                return
            
            track_info = self.active_tracks[upload_id]
            
            # Enregistrer l'événement
            track_info.webhook_events_received.append(f"{event_type}:{datetime.now().isoformat()}")
            track_info.last_updated = datetime.now()
            
            # Mettre à jour le file_id si on ne l'avait pas
            if not track_info.file_id and file_id:
                track_info.file_id = file_id
                self.file_id_to_upload_map[file_id] = upload_id
            
            # Traitement spécialisé par type d'événement
            if event_type == "file.ready":
                self._handle_file_ready_intelligent(track_info, resource)
            elif event_type == "file.created":
                self._handle_file_created_intelligent(track_info, resource)
            elif event_type == "file.status.changed":
                self._handle_status_changed_intelligent(track_info, resource)
            elif event_type == "comment.created":
                self._handle_comment_created_intelligent(track_info, resource)
            elif event_type == "review.completed":
                self._handle_review_completed_intelligent(track_info, resource)
            
            # Mettre à jour les stats
            self.stats["events_processed"] += 1
            
            logger.info(f"🧠 Événement traité intelligemment: {event_type} pour {track_info.filename}")
            
        except Exception as e:
            logger.error(f"❌ Erreur traitement intelligent: {e}")
    
    def _find_upload_for_resource(self, file_id: str, filename: str) -> Optional[str]:
        """
        Trouve l'upload correspondant à une ressource Frame.io
        
        Args:
            file_id: ID Frame.io du fichier
            filename: Nom du fichier
            
        Returns:
            str: upload_id ou None
        """
        
        # Recherche par file_id (plus précis)
        if file_id and file_id in self.file_id_to_upload_map:
            return self.file_id_to_upload_map[file_id]
        
        # Recherche par filename (fallback)
        if filename and filename in self.filename_to_upload_map:
            upload_id = self.filename_to_upload_map[filename]
            
            # Mettre à jour le mapping file_id si on l'a trouvé
            if file_id:
                track_info = self.active_tracks[upload_id]
                if not track_info.file_id:
                    track_info.file_id = file_id
                    self.file_id_to_upload_map[file_id] = upload_id
            
            return upload_id
        
        # Recherche fuzzy par nom de fichier similaire
        for tracked_filename, upload_id in self.filename_to_upload_map.items():
            if self._is_filename_similar(filename, tracked_filename):
                logger.info(f"🔍 Correspondance fuzzy trouvée: '{filename}' ~ '{tracked_filename}'")
                return upload_id
        
        return None
    
    def _is_filename_similar(self, filename1: str, filename2: str, threshold: float = 0.8) -> bool:
        """
        Vérifie si deux noms de fichiers sont similaires
        
        Args:
            filename1: Premier nom de fichier
            filename2: Second nom de fichier
            threshold: Seuil de similarité (0.0 à 1.0)
            
        Returns:
            bool: True si similaires
        """
        try:
            # Normaliser les noms
            name1 = filename1.lower().strip()
            name2 = filename2.lower().strip()
            
            # Comparaison exacte
            if name1 == name2:
                return True
            
            # Comparaison sans extension
            name1_no_ext = Path(name1).stem
            name2_no_ext = Path(name2).stem
            
            if name1_no_ext == name2_no_ext:
                return True
            
            # Similarité basique (contient l'un l'autre)
            if name1_no_ext in name2_no_ext or name2_no_ext in name1_no_ext:
                return len(name1_no_ext) / max(len(name1_no_ext), len(name2_no_ext)) >= threshold
            
            return False
            
        except Exception:
            return False
    
    def _handle_file_ready_intelligent(self, track_info: UploadTrackingInfo, resource: Dict):
        """Gère l'événement file.ready avec logique intelligente"""
        
        track_info.status = "READY"
        track_info.review_status = "PENDING"
        
        # Extraire les liens
        track_info.review_link = self._extract_review_link(resource)
        track_info.share_link = resource.get("share_link")
        
        # Déclencher une vérification immédiate des commentaires
        self._schedule_immediate_comment_check(track_info.upload_id)
        
        # Notifier l'upload tracker
        self.upload_tracker.update_upload(track_info.upload_id, {
            "status": "READY",
            "frameio_data.review_link": track_info.review_link,
            "frameio_data.share_link": track_info.share_link,
            "frameio_data.file_ready_at": datetime.now().isoformat()
        })
        
        self.stats["status_changes"] += 1
        logger.info(f"🎯 Fichier prêt pour review: {track_info.filename}")
    
    def _handle_comment_created_intelligent(self, track_info: UploadTrackingInfo, resource: Dict):
        """Gère l'événement comment.created avec analyse intelligente"""
        
        # Déclencher une analyse immédiate des commentaires
        self._schedule_immediate_comment_check(track_info.upload_id)
        
        logger.info(f"💬 Nouveau commentaire détecté pour: {track_info.filename}")
    
    def _schedule_immediate_comment_check(self, upload_id: str):
        """Planifie une vérification immédiate des commentaires"""
        
        def check_now():
            time.sleep(2)  # Petit délai pour laisser Frame.io traiter
            self._check_comments_for_upload(upload_id)
        
        thread = threading.Thread(target=check_now, daemon=True)
        thread.start()
    
    def _check_comments_for_upload(self, upload_id: str):
        """
        Vérifie et analyse les commentaires pour un upload
        
        Args:
            upload_id: ID de l'upload à vérifier
        """
        try:
            track_info = self.active_tracks.get(upload_id)
            if not track_info or not track_info.file_id:
                return
            
            # Récupérer les commentaires via API
            comments = self._fetch_comments_from_api(track_info.file_id)
            
            if not comments:
                return
            
            # Analyser les commentaires
            analysis = self._analyze_comments_intelligent(comments, track_info)
            
            # Mettre à jour le tracking
            track_info.comments_count = len(comments)
            track_info.last_comment_check = datetime.now()
            track_info.review_status = analysis["review_status"]
            
            if comments:
                track_info.last_comment_id = comments[-1].get("id")
            
            # Notifier l'upload tracker
            self.upload_tracker.update_upload(upload_id, {
                "frameio_data.comments_count": len(comments),
                "frameio_data.review_status": analysis["review_status"],
                "frameio_data.last_comment_check": datetime.now().isoformat(),
                "frameio_data.sentiment_score": analysis.get("sentiment_score", 0),
                "frameio_data.approval_indicators": analysis.get("approval_count", 0),
                "frameio_data.rejection_indicators": analysis.get("rejection_count", 0)
            })
            
            self.stats["comments_analyzed"] += 1
            
            logger.info(f"🔍 Commentaires analysés pour {track_info.filename}: "
                       f"{len(comments)} commentaires, statut: {analysis['review_status']}")
            
        except Exception as e:
            logger.error(f"❌ Erreur vérification commentaires: {e}")
    
    def _analyze_comments_intelligent(self, comments: List[Dict], track_info: UploadTrackingInfo) -> Dict:
        """
        Analyse intelligente des commentaires pour déterminer le statut de review
        
        Args:
            comments: Liste des commentaires
            track_info: Informations de tracking
            
        Returns:
            Dict: Résultats de l'analyse
        """
        
        if not comments:
            return {
                "review_status": "PENDING",
                "sentiment_score": 0,
                "approval_count": 0,
                "rejection_count": 0,
                "confidence": 0.0
            }
        
        # Utiliser la même logique que auto_hooks.py et webhook_manager.py pour la cohérence
        positive_keywords = [
            'ok', 'validé', 'parfait', 'excellent', 'bien', 'good', 'approved', 'approve',
            'valide', 'nickel', 'super', 'bravo', 'top', 'ça marche', 'c\'est bon',
            'validated', 'accepted', 'great', 'perfect'
        ]
        
        negative_keywords = [
            'modif', 'modification', 'change', 'corriger', 'correction', 'problème', 
            'problem', 'issue', 'fix', 'revoir', 'refaire', 'à retravailler',
            'pas bon', 'incorrect', 'erreur', 'error', 'wrong', 'redo', 'revise'
        ]
        
        # Tri des commentaires par date (plus récents en premier)
        sorted_comments = sorted(comments, key=lambda x: x.get("inserted_at", ""), reverse=True)
        
        # Analyser le dernier commentaire (le plus récent) avec la même logique que auto_hooks
        if sorted_comments:
            latest_comment = sorted_comments[0]
            comment_text = latest_comment.get("text", "").lower()
            
            # Vérifier les mots clés négatifs en premier (priorité) - recherche par mots entiers
            has_negative = any(f' {keyword} ' in f' {comment_text} ' or 
                              comment_text.startswith(f'{keyword} ') or 
                              comment_text.endswith(f' {keyword}') or 
                              comment_text == keyword 
                              for keyword in negative_keywords)
            if has_negative:
                review_status = "NEEDS_CHANGES"
            else:
                # Vérifier les mots clés positifs - recherche par mots entiers
                has_positive = any(f' {keyword} ' in f' {comment_text} ' or 
                                  comment_text.startswith(f'{keyword} ') or 
                                  comment_text.endswith(f' {keyword}') or 
                                  comment_text == keyword 
                                  for keyword in positive_keywords)
                if has_positive:
                    review_status = "APPROVED"
                else:
                    # Commentaire neutre/long = besoin de review supplémentaire
                    review_status = "PENDING"
        else:
            review_status = "PENDING"
        
        # Calculer les scores pour la compatibilité avec l'ancien système
        approval_score = 1.0 if review_status == "APPROVED" else 0.0
        rejection_score = 1.0 if review_status == "NEEDS_CHANGES" else 0.0
        neutral_score = 1.0 if review_status == "PENDING" else 0.0
        total_score = 1.0
        confidence = 1.0 if review_status != "PENDING" else 0.5
        sentiment_score = 1.0 if review_status == "APPROVED" else (-1.0 if review_status == "NEEDS_CHANGES" else 0.0)
        
        return {
            "review_status": review_status,
            "sentiment_score": sentiment_score,
            "approval_count": int(approval_score),
            "rejection_count": int(rejection_score),
            "neutral_count": int(neutral_score),
            "confidence": confidence,
            "total_comments": len(comments),
            "recent_comments": len(sorted_comments[:5])
        }
    
    def _fetch_comments_from_api(self, file_id: str) -> List[Dict]:
        """Récupère les commentaires via l'API Frame.io"""
        try:
            # Utiliser la méthode existante du webhook manager
            if hasattr(self.webhook_manager, '_fetch_all_comments_for_file_sync'):
                return self.webhook_manager._fetch_all_comments_for_file_sync(file_id)
            else:
                logger.warning("⚠️ Méthode de récupération des commentaires non disponible")
                return []
        except Exception as e:
            logger.error(f"❌ Erreur récupération commentaires API: {e}")
            return []
    
    def start_intelligent_monitoring(self):
        """Démarre le monitoring intelligent en arrière-plan"""
        
        if self.is_monitoring:
            return
        
        def monitoring_loop():
            while self.is_monitoring:
                try:
                    self._cleanup_old_tracks()
                    self._periodic_comment_checks()
                    self._update_statistics()
                    
                    time.sleep(self.comment_check_interval)
                    
                except Exception as e:
                    logger.error(f"❌ Erreur monitoring intelligent: {e}")
                    time.sleep(60)
        
        self.is_monitoring = True
        self.monitoring_thread = threading.Thread(target=monitoring_loop, daemon=True)
        self.monitoring_thread.start()
        
        logger.info(f"🔄 Monitoring intelligent démarré (intervalle: {self.comment_check_interval}s)")
    
    def stop_intelligent_monitoring(self):
        """Arrête le monitoring intelligent"""
        self.is_monitoring = False
        if self.monitoring_thread:
            self.monitoring_thread.join(timeout=5)
        logger.info("🛑 Monitoring intelligent arrêté")
    
    def _cleanup_old_tracks(self):
        """Nettoie les anciens tracks pour libérer la mémoire"""
        cutoff_date = datetime.now() - timedelta(days=self.tracking_duration_days)
        
        to_remove = []
        for upload_id, track_info in self.active_tracks.items():
            if track_info.created_at < cutoff_date:
                to_remove.append(upload_id)
        
        for upload_id in to_remove:
            track_info = self.active_tracks[upload_id]
            
            # Nettoyer les mappings
            if track_info.file_id in self.file_id_to_upload_map:
                del self.file_id_to_upload_map[track_info.file_id]
            if track_info.filename in self.filename_to_upload_map:
                del self.filename_to_upload_map[track_info.filename]
            
            del self.active_tracks[upload_id]
            
            logger.info(f"🗑️ Track ancien supprimé: {track_info.filename} (age: {self.tracking_duration_days} jours)")
        
        if to_remove:
            self.stats["active_tracks"] = len(self.active_tracks)
    
    def _periodic_comment_checks(self):
        """Vérifications périodiques des commentaires pour les uploads actifs"""
        for upload_id, track_info in self.active_tracks.items():
            # Vérifier seulement si le fichier est prêt et qu'on a un file_id
            if (track_info.status in ["READY", "PROCESSING"] and 
                track_info.file_id and 
                track_info.is_tracking_active):
                
                # Vérifier si ça fait assez longtemps depuis la dernière vérification
                if (not track_info.last_comment_check or 
                    datetime.now() - track_info.last_comment_check > timedelta(minutes=5)):
                    
                    self._check_comments_for_upload(upload_id)
    
    def get_tracking_statistics(self) -> Dict[str, Any]:
        """Retourne les statistiques détaillées du tracking"""
        
        # Statistiques par statut
        status_counts = {}
        review_status_counts = {}
        
        for track_info in self.active_tracks.values():
            status_counts[track_info.status] = status_counts.get(track_info.status, 0) + 1
            review_status_counts[track_info.review_status] = review_status_counts.get(track_info.review_status, 0) + 1
        
        return {
            **self.stats,
            "status_distribution": status_counts,
            "review_status_distribution": review_status_counts,
            "active_uploads": list(self.active_tracks.keys()),
            "monitoring_active": self.is_monitoring,
            "tracking_duration_days": self.tracking_duration_days
        }
    
    def get_upload_details(self, upload_id: str) -> Optional[Dict[str, Any]]:
        """Retourne les détails d'un upload spécifique"""
        track_info = self.active_tracks.get(upload_id)
        if track_info:
            return asdict(track_info)
        return None
    
    def _extract_review_link(self, resource: Dict[str, Any]) -> Optional[str]:
        """Extrait le lien de review depuis la ressource Frame.io"""
        try:
            # Frame.io peut fournir des liens de review dans différents formats
            if 'review_link' in resource:
                return resource['review_link']
            elif 'share_link' in resource:
                return resource['share_link']
            elif 'links' in resource and isinstance(resource['links'], dict):
                return resource['links'].get('review') or resource['links'].get('share')
            return None
        except Exception as e:
            logger.error(f"❌ Erreur extraction review link: {e}")
            return None
    
    def _update_statistics(self):
        """Met à jour les statistiques internes"""
        try:
            self.stats["active_tracks"] = len(self.active_tracks)
            self.stats["last_update"] = datetime.now().isoformat()
            
            # Compter les statuts
            status_counts = {}
            review_counts = {}
            
            for track_info in self.active_tracks.values():
                status = track_info.status
                review = track_info.review_status
                
                status_counts[status] = status_counts.get(status, 0) + 1
                review_counts[review] = review_counts.get(review, 0) + 1
            
            self.stats["status_breakdown"] = status_counts
            self.stats["review_breakdown"] = review_counts
            
        except Exception as e:
            logger.error(f"❌ Erreur mise à jour statistiques: {e}")


# Exemple d'intégration
def integrate_intelligent_tracking(webhook_service):
    """
    Intègre le tracking intelligent dans le service webhook existant
    
    Args:
        webhook_service: Instance du WebhookService existant
    """
    
    # Créer le tracker intelligent
    intelligent_tracker = IntelligentWebhookTracker(
        webhook_manager=webhook_service.webhook_manager,
        upload_tracker=webhook_service.upload_tracker
    )
    
    # Ajouter au service webhook
    webhook_service.intelligent_tracker = intelligent_tracker
    
    logger.info("🧠 Tracking intelligent intégré au service webhook")
    
    return intelligent_tracker


if __name__ == "__main__":
    # Configuration du logging
    logging.basicConfig(level=logging.INFO)
    
    print("🧠 Gestionnaire de Tracking Intelligent")
    print("="*50)
    print()
    print("🔹 Fonctionnalités :")
    print("  ✅ Intégration avec webhook Cloudflare existant")
    print("  ✅ Tracking granulaire par upload")
    print("  ✅ Analyse intelligente des commentaires")
    print("  ✅ Routage par file_id et filename")
    print("  ✅ Monitoring périodique automatique")
    print("  ✅ Nettoyage automatique des anciens tracks")
    print("  ✅ Statistiques détaillées")
