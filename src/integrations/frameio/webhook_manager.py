#!/usr/bin/env python3
"""
Frame.io Webhook Manager
Gère les webhooks Frame.io pour le suivi automatique des statuts
"""

import json
import logging
import threading
from typing import Dict, Any, Optional, List
from datetime import datetime
from pathlib import Path
from flask import Flask, request, jsonify
import requests

from .webhook_tunnel import WebhookTunnelManager
from ...utils.upload_tracker import UploadTracker, UploadStatus
from .webhook_tunnel import WebhookTunnelManager

logger = logging.getLogger(__name__)


class FrameIOWebhookManager:
    """
    Gestionnaire des webhooks Frame.io pour le suivi automatique des statuts
    """
    
    # Mapping des statuts Frame.io vers nos statuts internes
    FRAMEIO_STATUS_MAPPING = {
        "in_progress": "🔄 UPLOADING",
        "needs_review": "⏳ WAITING_APPROVAL", 
        "approved": "✅ APPROVED",
        "rejected": "🚫 REJECTED",
        "ready": "🎉 COMPLETED",
        "processing": "⚙️ PROCESSING"
    }
    
    def __init__(self, 
                 upload_tracker: UploadTracker,
                 webhook_port: int = 5000,
                 webhook_path: str = "/frameio-webhook",
                 use_cloudflare_tunnel: bool = True):
        """
        Initialise le gestionnaire de webhooks
        
        Args:
            upload_tracker: Instance du tracker d'uploads
            webhook_port: Port d'écoute du webhook
            webhook_path: Chemin du webhook
            use_cloudflare_tunnel: Utiliser Cloudflare Tunnel pour exposition publique
        """
        self.upload_tracker = upload_tracker
        self.webhook_port = webhook_port
        self.webhook_path = webhook_path
        self.use_cloudflare_tunnel = use_cloudflare_tunnel
        
        # Gestionnaire de tunnel Cloudflare
        self.tunnel_manager = WebhookTunnelManager(webhook_port) if use_cloudflare_tunnel else None
        self.webhook_url = None  # Sera défini après démarrage du tunnel
        
        # Flask app pour recevoir les webhooks
        self.app = Flask(__name__)
        self.setup_routes()
        
        # Threading pour le serveur
        self.server_thread = None
        self.is_running = False
        
        # Tracking des webhooks
        self.webhook_data = {
            "webhook_id": None,
            "events": [],
            "status": "inactive",
            "tunnel_info": None
        }
        
    def setup_routes(self):
        """Configure les routes Flask pour les webhooks"""
        
        @self.app.route(self.webhook_path, methods=['GET'])
        def webhook_info():
            """Endpoint GET pour vérifier que le webhook fonctionne"""
            return jsonify({
                "status": "active",
                "message": "PostFlow Frame.io Webhook Server",
                "endpoint": self.webhook_path,
                "methods": ["POST"],
                "timestamp": datetime.now().isoformat(),
                "webhook_stats": self.get_webhook_stats()
            }), 200
        
        @self.app.route(self.webhook_path, methods=['POST'])
        def receive_webhook():
            """Endpoint pour recevoir les webhooks Frame.io"""
            try:
                # Récupérer les données du webhook
                webhook_data = request.get_json()
                
                # Vérifier si les données sont valides
                if webhook_data is None:
                    logger.warning("⚠️ Webhook reçu sans données JSON valides")
                    # Essayer de récupérer les données brutes
                    raw_data = request.get_data(as_text=True)
                    logger.debug(f"📋 Données brutes reçues: {raw_data}")
                    
                    return jsonify({
                        "status": "warning", 
                        "message": "No valid JSON data received"
                    }), 200
                
                # Traiter le webhook (version synchrone)
                self.process_webhook_sync(webhook_data)
                
                return jsonify({
                    "status": "success", 
                    "message": "Webhook processed"
                }), 200
                
            except Exception as e:
                logger.error(f"❌ Erreur traitement webhook: {e}")
                return jsonify({"error": str(e)}), 500
        
        @self.app.route("/health", methods=['GET'])
        def health_check():
            """Health check endpoint"""
            return jsonify({
                "status": "healthy", 
                "timestamp": datetime.now().isoformat()
            })
        
        @self.app.route("/webhook-status", methods=['GET'])
        def webhook_status():
            """Statut du webhook"""
            return jsonify(self.webhook_data)
    
    def process_webhook_sync(self, webhook_data: Dict[str, Any]):
        """
        Traite un webhook reçu de Frame.io (version synchrone)
        
        Args:
            webhook_data: Données du webhook
        """
        try:
            event_type = webhook_data.get("event_type")
            file_data = webhook_data.get("resource", {})
            
            logger.info(f"🔔 Webhook reçu: {event_type}")
            
            # Traiter selon le type d'événement
            if event_type == "file.upload.completed":
                self._handle_upload_completed_sync(file_data)
            elif event_type == "file.ready":
                self._handle_file_ready_sync(file_data)
            elif event_type == "file.created":
                self._handle_file_created_sync(file_data)
            elif event_type == "file.updated":
                self._handle_file_updated_sync(file_data)
            elif event_type == "file.status.changed":
                self._handle_status_changed_sync(file_data)
            elif event_type == "review.status.changed":
                self._handle_review_status_changed_sync(file_data)
            elif event_type in ["comment.created", "comment.completed"]:
                self._handle_comment_event_sync(file_data, event_type)
            else:
                logger.info(f"📝 Événement non traité: {event_type}")
            
            # Enregistrer l'événement
            self.webhook_data["events"].append({
                "event_type": event_type,
                "timestamp": datetime.now().isoformat(),
                "file_id": file_data.get("id"),
                "file_name": file_data.get("name"),
                "status": file_data.get("status"),
                "review_status": file_data.get("review_status")
            })
            
        except Exception as e:
            logger.error(f"❌ Erreur traitement webhook {event_type}: {e}")
    
    def _handle_upload_completed_sync(self, file_data: Dict[str, Any]):
        """Gère l'événement file.upload.completed (version synchrone)"""
        file_id = file_data.get("id")
        file_name = file_data.get("name")
        
        # Trouver l'upload correspondant
        upload_id = self._find_upload_by_filename_sync(file_name)
        if upload_id:
            frameio_data = {
                "file_id": file_id,
                "upload_status": "COMPLETED",
                "processing_status": "PROCESSING"
            }
            
            # Marquer comme en traitement
            self.upload_tracker.mark_processing(upload_id)
            self.upload_tracker.update_upload(upload_id, {
                "frameio_data.file_id": file_id,
                "frameio_data.upload_status": "COMPLETED"
            })
            
            logger.info(f"📤 Upload Frame.io terminé: {file_name} (ID: {file_id})")
    
    def _handle_file_ready_sync(self, file_data: Dict[str, Any]):
        """Gère l'événement file.ready (traitement terminé) (version synchrone)"""
        file_id = file_data.get("id")
        file_name = file_data.get("name")
        
        # Trouver l'upload correspondant
        upload_id = self._find_upload_by_filename_sync(file_name)
        if upload_id:
            frameio_data = {
                "file_id": file_id,
                "processing_status": "READY",
                "review_link": self._generate_review_link(file_data),
                "share_link": file_data.get("share_link")
            }
            
            # Marquer comme terminé
            self.upload_tracker.mark_completed(upload_id, frameio_data)
            
            logger.info(f"🎉 Fichier Frame.io prêt: {file_name} (ID: {file_id})")
    
    def _handle_file_created_sync(self, file_data: Dict[str, Any]):
        """Gère l'événement file.created (version synchrone)"""
        logger.info(f"📁 Nouveau fichier créé: {file_data.get('name')}")
    
    def _handle_file_updated_sync(self, file_data: Dict[str, Any]):
        """Gère l'événement file.updated (version synchrone)"""
        logger.info(f"📝 Fichier mis à jour: {file_data.get('name')}")
    
    def _handle_status_changed_sync(self, file_data: Dict[str, Any]):
        """Gère l'événement file.status.changed (statut général du fichier) (version synchrone)"""
        file_id = file_data.get("id")
        file_name = file_data.get("name")
        file_status = file_data.get("status")
        
        # Trouver l'upload correspondant
        upload_id = self._find_upload_by_filename_sync(file_name)
        if upload_id:
            # Mapper le statut Frame.io vers notre statut interne
            internal_status = self._map_frameio_status_to_internal(file_status)
            
            frameio_data = {
                "file_id": file_id,
                "status": file_status,
                "processing_status": file_status
            }
            
            # Mettre à jour le statut selon la logique Frame.io
            if file_status == "processing":
                self.upload_tracker.mark_processing(upload_id)
            elif file_status == "ready":
                frameio_data.update({
                    "review_link": self._generate_review_link(file_data),
                    "share_link": file_data.get("share_link")
                })
                self.upload_tracker.mark_completed(upload_id, frameio_data)
            elif file_status == "failed":
                self.upload_tracker.mark_failed(upload_id, f"Frame.io processing failed")
            
            # Mise à jour des données Frame.io
            self.upload_tracker.update_upload(upload_id, {
                "frameio_data.status": file_status,
                "frameio_data.processing_status": file_status
            })
            
            logger.info(f"📝 Statut Frame.io changé: {file_name} -> {file_status} ({internal_status})")
    
    def _handle_review_status_changed_sync(self, file_data: Dict[str, Any]):
        """Gère l'événement review.status.changed (statut de review) (version synchrone)"""
        file_id = file_data.get("id")
        file_name = file_data.get("name")
        review_status = file_data.get("review_status")
        
        # Trouver l'upload correspondant
        upload_id = self._find_upload_by_filename_sync(file_name)
        if upload_id:
            # Mapper le statut de review Frame.io vers notre statut interne
            internal_status = self._map_frameio_review_status_to_internal(review_status)
            
            frameio_data = {
                "file_id": file_id,
                "review_status": review_status,
                "review_link": self._generate_review_link(file_data),
                "share_link": file_data.get("share_link")
            }
            
            # Mettre à jour le statut selon le statut de review
            if review_status == "needs_review":
                # Le fichier est prêt mais attend une review
                self.upload_tracker.update_status(upload_id, "WAITING_APPROVAL")
                frameio_data["processing_status"] = "READY"
            elif review_status == "approved":
                # Review approuvée, fichier finalisé
                self.upload_tracker.update_status(upload_id, "APPROVED")
                frameio_data["processing_status"] = "APPROVED"
            elif review_status == "rejected":
                # Review rejetée
                self.upload_tracker.update_status(upload_id, "REJECTED")
                frameio_data["processing_status"] = "REJECTED"
            elif review_status == "in_progress":
                # Review en cours
                frameio_data["processing_status"] = "REVIEWING"
            
            # Mise à jour des données Frame.io
            self.upload_tracker.update_upload(upload_id, {
                "frameio_data.review_status": review_status,
                "frameio_data.review_link": frameio_data.get("review_link"),
                "frameio_data.share_link": frameio_data.get("share_link")
            })
            
            logger.info(f"👁️ Statut review Frame.io changé: {file_name} -> {review_status} ({internal_status})")
    
    def _handle_comment_event_sync(self, file_data: Dict[str, Any], event_type: str):
        """Gère les événements de commentaires avec détection intelligente du statut (version synchrone)"""
        file_id = file_data.get("id")
        file_name = file_data.get("name")
        comment_text = file_data.get("text", "")
        
        logger.info(f"💬 Commentaire {event_type.split('.')[-1]}: {file_name}")
        
        # Trouver l'upload correspondant
        upload_id = self._find_upload_by_filename_sync(file_name)
        if upload_id:
            # Analyser le commentaire et mettre à jour le statut de review
            self._analyze_comment_and_update_status_sync(upload_id, file_id, comment_text, event_type)
    
    def _find_upload_by_filename_sync(self, filename: str) -> Optional[str]:
        """
        Trouve un upload par nom de fichier (version synchrone)
        
        Args:
            filename: Nom du fichier
            
        Returns:
            str: ID de l'upload ou None
        """
        try:
            for upload_id, upload_data in self.upload_tracker.tracking_data.get("uploads", {}).items():
                if upload_data.get("filename") == filename:
                    return upload_id
            return None
        except Exception as e:
            logger.error(f"❌ Erreur recherche upload: {e}")
            return None

    def _analyze_comment_and_update_status_sync(self, upload_id: str, file_id: str, comment_text: str, event_type: str):
        """
        Analyse un commentaire et met à jour le statut de review intelligemment
        """
        try:
            # Récupérer tous les commentaires du fichier
            comments = self._fetch_all_comments_for_file_sync(file_id)
            # Déterminer le statut de review
            review_status = self._determine_review_status_from_comments(comments)
            # Mettre à jour le statut dans le tracker
            self.upload_tracker.update_upload(upload_id, {
                "frameio_data.review_status": review_status,
                "frameio_data.last_comment": comment_text,
                "frameio_data.last_comment_event": event_type
            })
            logger.info(f"🔎 Statut review détecté via commentaires: {review_status} (upload_id: {upload_id})")
        except Exception as e:
            logger.error(f"❌ Erreur analyse commentaire: {e}")

    def _fetch_all_comments_for_file_sync(self, file_id: str) -> List[Dict]:
        """
        Récupère tous les commentaires d'un fichier via API Frame.io
        """
        try:
            # Charger les endpoints depuis le fichier de config
            endpoints_path = Path("data/frameio_endpoints.json")
            if not endpoints_path.exists():
                logger.error("❌ Fichier endpoints Frame.io manquant")
                return []
            with open(endpoints_path, "r", encoding="utf-8") as f:
                endpoints = json.load(f)
            comments_endpoint = endpoints.get("comments", "https://api.frame.io/v4/files/{file_id}/comments")
            url = comments_endpoint.replace("{file_id}", file_id)

            # Authentification (à adapter selon votre système)
            # Ici on suppose que self.upload_tracker possède frameio_auth
            frameio_auth = getattr(self.upload_tracker, "frameio_auth", None)
            if not frameio_auth:
                logger.error("❌ Authentification Frame.io non disponible")
                return []
            token_config = frameio_auth._load_current_tokens()
            access_token = token_config.get('access_token')
            if not access_token:
                logger.error("❌ Aucun token d'accès disponible pour Frame.io")
                return []
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                return response.json().get("data", [])
            else:
                logger.error(f"❌ Erreur récupération commentaires: {response.status_code} - {response.text}")
                return []
        except Exception as e:
            logger.error(f"❌ Exception récupération commentaires: {e}")
            return []

    def _determine_review_status_from_comments(self, comments: List[Dict]) -> str:
        """
        Détermine le statut de review basé sur l'analyse des commentaires
        """
        try:
            if not comments:
                return "NEED_REVIEW"
            has_ok = any("ok" in (c.get("text", "").lower()) for c in comments)
            if has_ok:
                return "APPROVED"
            else:
                return "NEED_REWORK"
        except Exception as e:
            logger.error(f"❌ Exception analyse statut review: {e}")
            return "NEED_REVIEW"
    
    def _generate_review_link(self, file_data: Dict[str, Any]) -> str:
        """
        Génère le lien de review Frame.io
        
        Args:
            file_data: Données du fichier
            
        Returns:
            str: Lien de review
        """
        try:
            project_id = file_data.get("project_id")
            file_id = file_data.get("id")
            return f"https://next.frame.io/project/{project_id}/view/{file_id}"
        except:
            return None
    
    def _map_frameio_status_to_internal(self, frameio_status: str) -> str:
        """
        Mappe un statut Frame.io vers notre statut interne
        
        Args:
            frameio_status: Statut Frame.io
            
        Returns:
            str: Statut interne correspondant
        """
        mapping = {
            "processing": "PROCESSING",
            "ready": "COMPLETED", 
            "failed": "FAILED",
            "uploading": "UPLOADING",
            "queued": "UPLOADING"
        }
        return mapping.get(frameio_status, "PROCESSING")
    
    def _map_frameio_review_status_to_internal(self, review_status: str) -> str:
        """
        Mappe un statut de review Frame.io vers notre statut interne
        
        Args:
            review_status: Statut de review Frame.io
            
        Returns:
            str: Statut interne correspondant
        """
        mapping = {
            "needs_review": "WAITING_APPROVAL",
            "approved": "APPROVED", 
            "rejected": "REJECTED",
            "in_progress": "PROCESSING"
        }
        return mapping.get(review_status, "WAITING_APPROVAL")
    
    def create_webhook_sync(self, 
                          frameio_auth,
                          account_id: str, 
                          workspace_id: str,
                          webhook_name: str = "PostFlow Webhook") -> bool:
        """
        Crée un webhook Frame.io (version synchrone)
        
        Args:
            frameio_auth: Authentification Frame.io
            account_id: ID du compte Frame.io
            workspace_id: ID du workspace Frame.io
            webhook_name: Nom du webhook
            
        Returns:
            bool: True si créé avec succès
        """
        try:
            # Vérifier que l'URL publique est disponible
            public_url = self.get_public_webhook_url()
            if not public_url:
                logger.error("❌ URL publique du webhook non disponible")
                return False
            
            webhook_payload = {
                "data": {
                    "events": [
                        "file.created",
                        "file.ready",
                        "file.updated", 
                        "file.upload.completed",
                        "file.versioned",
                        "comment.created",
                        "comment.completed",
                        "comment.updated"
                    ],
                    "name": webhook_name,
                    "url": public_url
                }
            }
            
            # Créer le webhook via l'API Frame.io
            url = f"https://api.frame.io/v4/accounts/{account_id}/workspaces/{workspace_id}/webhooks"
            
            # Utiliser le token directement depuis la configuration
            token_config = frameio_auth._load_current_tokens()
            access_token = token_config.get('access_token')
            if not access_token:
                logger.error("❌ Aucun token d'accès disponible")
                return False
            
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(url, json=webhook_payload, headers=headers)
            
            if response.status_code == 201:
                webhook_response = response.json()
                webhook_id = webhook_response.get("data", {}).get("id")
                
                self.webhook_data.update({
                    "webhook_id": webhook_id,
                    "status": "active",
                    "created_at": datetime.now().isoformat()
                })
                
                logger.info(f"✅ Webhook Frame.io créé: {webhook_id}")
                return True
            else:
                logger.error(f"❌ Erreur création webhook: {response.status_code} - {response.text}")
                return False
                    
        except Exception as e:
            logger.error(f"❌ Erreur création webhook: {e}")
            return False
    
    def delete_webhook_sync(self,
                           frameio_auth, 
                           account_id: str,
                           workspace_id: str) -> bool:
        """
        Supprime le webhook Frame.io (version synchrone)
        
        Args:
            frameio_auth: Authentification Frame.io
            account_id: ID du compte Frame.io
            workspace_id: ID du workspace Frame.io
            
        Returns:
            bool: True si supprimé avec succès
        """
        try:
            if not self.webhook_data.get("webhook_id"):
                logger.warning("⚠️ Aucun webhook à supprimer")
                return True
            
            webhook_id = self.webhook_data["webhook_id"]
            url = f"https://api.frame.io/v4/accounts/{account_id}/workspaces/{workspace_id}/webhooks/{webhook_id}"
            
            # Utiliser le token directement depuis la configuration
            token_config = frameio_auth._load_current_tokens()
            access_token = token_config.get('access_token')
            if not access_token:
                logger.error("❌ Aucun token d'accès disponible")
                return False
            
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            response = requests.delete(url, headers=headers)
            
            if response.status_code == 204:
                self.webhook_data.update({
                    "webhook_id": None,
                    "status": "deleted",
                    "deleted_at": datetime.now().isoformat()
                })
                
                logger.info(f"✅ Webhook Frame.io supprimé: {webhook_id}")
                return True
            else:
                logger.error(f"❌ Erreur suppression webhook: {response.status_code} - {response.text}")
                return False
                        
        except Exception as e:
            logger.error(f"❌ Erreur suppression webhook: {e}")
            return False
    
    def start_webhook_server(self):
        """Démarre le serveur webhook Flask et le tunnel Cloudflare"""
        try:
            # Démarrer le tunnel Cloudflare si configuré
            if self.use_cloudflare_tunnel and self.tunnel_manager:
                logger.info("🌐 Démarrage du tunnel Cloudflare...")
                tunnel_url = self.tunnel_manager.start_webhook_tunnel(timeout=60)
                
                if tunnel_url:
                    self.webhook_url = tunnel_url
                    self.webhook_data["tunnel_info"] = self.tunnel_manager.get_tunnel_info()
                    logger.info(f"✅ Tunnel Cloudflare actif: {tunnel_url}")
                else:
                    logger.error("❌ Échec démarrage tunnel Cloudflare")
                    return False
            
            # Démarrer le serveur Flask
            def run_server():
                self.app.run(
                    host="0.0.0.0",
                    port=self.webhook_port,
                    debug=False,
                    use_reloader=False
                )
            
            self.server_thread = threading.Thread(target=run_server, daemon=True)
            self.server_thread.start()
            self.is_running = True
            
            logger.info(f"🚀 Serveur webhook démarré sur port {self.webhook_port}")
            if self.webhook_url:
                logger.info(f"🔗 Endpoint webhook public: {self.webhook_url}{self.webhook_path}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur serveur webhook: {e}")
            return False
    
    def stop_webhook_server(self):
        """Arrête le serveur webhook et le tunnel Cloudflare"""
        try:
            self.is_running = False
            
            # Arrêter le tunnel Cloudflare
            if self.tunnel_manager:
                self.tunnel_manager.stop_webhook_tunnel()
                logger.info("🛑 Tunnel Cloudflare arrêté")
            
            # Arrêter le serveur Flask
            if self.server_thread and self.server_thread.is_alive():
                logger.info("🛑 Arrêt du serveur webhook...")
            
            self.webhook_url = None
            self.webhook_data["tunnel_info"] = None
            
        except Exception as e:
            logger.error(f"❌ Erreur arrêt webhook: {e}")
    
    def get_public_webhook_url(self) -> Optional[str]:
        """
        Retourne l'URL publique du webhook
        
        Returns:
            str: URL publique complète ou None
        """
        if self.webhook_url:
            return f"{self.webhook_url}{self.webhook_path}"
        return None
    
    def get_webhook_stats(self) -> Dict[str, Any]:
        """
        Retourne les statistiques des webhooks
        
        Returns:
            Dict: Statistiques
        """
        events = self.webhook_data.get("events", [])
        
        # Compter par type d'événement
        event_counts = {}
        for event in events:
            event_type = event.get("event_type")
            event_counts[event_type] = event_counts.get(event_type, 0) + 1
        
        stats = {
            "webhook_status": self.webhook_data.get("status"),
            "webhook_id": self.webhook_data.get("webhook_id"),
            "webhook_url": self.get_public_webhook_url(),
            "total_events": len(events),
            "events_by_type": event_counts,
            "last_event": events[-1] if events else None
        }
        
        # Ajouter les infos du tunnel si disponibles
        if self.tunnel_manager:
            stats["tunnel_info"] = self.tunnel_manager.get_tunnel_info()
        
        return stats
