#!/usr/bin/env python3
"""
Frame.io Webhook Manager
Gère les webhooks Frame.io pour le suivi automatique des statuts
Compatible avec Frame.io API V4
"""

import json
import logging
import os
import threading
import time
import hmac
import hashlib
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
                 use_cloudflare_tunnel: bool = True,
                 frameio_auth=None):
        """
        Initialise le gestionnaire de webhooks
        
        Args:
            upload_tracker: Instance du tracker d'uploads
            webhook_port: Port d'écoute du webhook
            webhook_path: Chemin du webhook
            use_cloudflare_tunnel: Utiliser Cloudflare Tunnel pour exposition publique
            frameio_auth: Instance d'authentification Frame.io
        """
        self.upload_tracker = upload_tracker
        self.webhook_port = webhook_port
        self.webhook_path = webhook_path
        self.use_cloudflare_tunnel = use_cloudflare_tunnel
        self.frameio_auth = frameio_auth  # Stocker la référence frameio_auth
        
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
            "tunnel_info": None,
            "signing_secret": None  # Stockera le secret de signature Frame.io
        }
    
    def verify_frameio_signature(self, signature: str, timestamp: str, body: str, secret: str) -> bool:
        """
        Vérifie la signature HMAC du webhook Frame.io selon spécifications V4
        
        Args:
            signature: Signature fournie dans l'header X-FrameIO-Signature
            timestamp: Timestamp fourni dans l'header X-FrameIO-Timestamp
            body: Corps brut de la requête
            secret: Secret de signature du webhook
            
        Returns:
            bool: True si signature valide
        """
        try:
            # Vérifier que le timestamp n'est pas trop ancien (max 5 minutes)
            curr_time = time.time()
            req_time = float(timestamp)
            if curr_time - req_time > 300:  # 5 minutes
                logger.warning("⚠️ Webhook timestamp trop ancien")
                return False
            
            # Créer le message à signer selon format Frame.io: "v0:timestamp:body"
            message = f"v0:{timestamp}:{body}"
            
            # Calculer la signature HMAC SHA256
            calculated_signature = hmac.new(
                bytes(secret, 'latin-1'),
                msg=bytes(message, 'latin-1'),
                digestmod=hashlib.sha256
            ).hexdigest()
            
            # La signature doit être préfixée par "v0="
            expected_signature = f"v0={calculated_signature}"
            
            # Comparaison sécurisée
            return hmac.compare_digest(expected_signature, signature)
            
        except Exception as e:
            logger.error(f"❌ Erreur vérification signature: {e}")
            return False
        
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
            """Endpoint pour recevoir les webhooks Frame.io V4 avec vérification signature"""
            try:
                # Récupérer les headers Frame.io V4
                headers = dict(request.headers)
                content_type = headers.get('Content-Type', 'unknown')
                signature = headers.get('X-FrameIO-Signature')
                timestamp = headers.get('X-FrameIO-Timestamp')
                
                # Récupérer le corps brut pour vérification signature
                raw_body = request.get_data(as_text=True)
                
                # Vérifier la signature si nous avons un secret configuré
                if self.webhook_data.get("signing_secret") and signature and timestamp:
                    if not self.verify_frameio_signature(signature, timestamp, raw_body, 
                                                       self.webhook_data["signing_secret"]):
                        logger.warning("⚠️ Signature webhook Frame.io invalide")
                        return jsonify({
                            "status": "error",
                            "message": "Invalid signature"
                        }), 401
                    logger.debug("✅ Signature webhook vérifiée")
                elif signature or timestamp:
                    logger.warning("⚠️ Headers signature détectés mais pas de secret configuré")
                
                # Parser les données JSON
                webhook_data = request.get_json()
                
                # Vérifier si les données sont valides
                if webhook_data is None:
                    logger.warning("⚠️ Webhook reçu sans données JSON valides")
                    # Essayer de récupérer les données brutes
                    raw_data = request.get_data(as_text=True)
                    logger.debug(f"📋 Content-Type: {content_type}")
                    logger.debug(f"📋 Headers: {headers}")
                    logger.debug(f"📋 Données brutes reçues: {raw_data}")
                    
                    # Essayer de parser manuellement si possible
                    if raw_data:
                        try:
                            webhook_data = json.loads(raw_data)
                            logger.info("✅ Parsing JSON manuel réussi")
                        except json.JSONDecodeError as e:
                            logger.error(f"❌ Échec parsing JSON manuel: {e}")
                            return jsonify({
                                "status": "error", 
                                "message": "Invalid JSON data"
                            }), 400
                    else:
                        return jsonify({
                            "status": "warning", 
                            "message": "No data received"
                        }), 200
                
                # Log pour debug
                logger.debug(f"📨 Webhook Headers: {headers}")
                logger.debug(f"📨 Content-Type: {content_type}")
                
                # Traiter le webhook (version synchrone)
                self.process_webhook_sync(webhook_data)
                
                return jsonify({
                    "status": "success", 
                    "message": "Webhook processed"
                }), 200
                
            except Exception as e:
                logger.error(f"❌ Erreur traitement webhook: {e}")
                # Log des détails pour debug
                try:
                    raw_data = request.get_data(as_text=True)
                    logger.error(f"📋 Données qui ont causé l'erreur: {raw_data}")
                except:
                    pass
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
        Compatible avec Frame.io API V4
        
        Args:
            webhook_data: Données du webhook selon format V4
        """
        try:
            # Frame.io V4 utilise "type" au lieu de "event_type"
            event_type = webhook_data.get("type")
            resource_data = webhook_data.get("resource", {})
            
            # Extraire les informations contextuelles V4
            account_data = webhook_data.get("account", {})
            project_data = webhook_data.get("project", {})
            workspace_data = webhook_data.get("workspace", {})
            user_data = webhook_data.get("user", {})
            
            # Debug complet des données webhook
            logger.info(f"🔔 Webhook Frame.io V4 reçu: {event_type}")
            logger.debug(f"📋 Données webhook complètes: {json.dumps(webhook_data, indent=2, default=str)}")
            
            # Vérifier que nous avons un type d'événement valide
            if not event_type:
                logger.warning(f"⚠️ Aucun type d'événement trouvé dans le webhook V4")
                logger.debug(f"📝 Clés disponibles: {list(webhook_data.keys())}")
                return
            
            # Traiter selon le type d'événement Frame.io V4
            if event_type == "file.upload.completed":
                self._handle_upload_completed_sync(resource_data)
            elif event_type == "file.ready":
                self._handle_file_ready_sync(resource_data)
            elif event_type == "file.created":
                self._handle_file_created_sync(resource_data)
            elif event_type == "file.updated":
                self._handle_file_updated_sync(resource_data)
            elif event_type == "file.status.changed":
                self._handle_status_changed_sync(resource_data)
            elif event_type == "review.status.changed":
                self._handle_review_status_changed_sync(resource_data)
            elif event_type in ["comment.created", "comment.completed"]:
                # Debug: log de la structure complète pour les événements de commentaire
                logger.info(f"🔍 Webhook comment complet: {json.dumps(webhook_data, indent=2)}")
                logger.info(f"🔍 Resource data pour comment: {json.dumps(resource_data, indent=2)}")
                self._handle_comment_event_sync(resource_data, event_type)
            else:
                logger.info(f"📝 Événement non traité: {event_type}")
                # Log des données utiles même pour événements non traités
                if resource_data:
                    logger.debug(f"📁 Ressource associée: {resource_data.get('name', 'N/A')} (ID: {resource_data.get('id', 'N/A')})")
            
            # Enregistrer l'événement (même si non traité) avec contexte V4
            self.webhook_data["events"].append({
                "event_type": event_type or "unknown",
                "timestamp": datetime.now().isoformat(),
                "resource_id": resource_data.get("id"),
                "resource_type": resource_data.get("type"),
                "resource_name": resource_data.get("name"),
                "account_id": account_data.get("id"),
                "project_id": project_data.get("id"),
                "workspace_id": workspace_data.get("id"),
                "user_id": user_data.get("id"),
                "status": resource_data.get("status"),
                "review_status": resource_data.get("review_status"),
                "raw_keys": list(webhook_data.keys()) if not event_type else None
            })
            
        except Exception as e:
            logger.error(f"❌ Erreur traitement webhook {event_type}: {e}")
            logger.error(f"📋 Données problématiques: {webhook_data}")
    
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
    
    def _handle_comment_event_sync(self, webhook_data: Dict[str, Any], event_type: str):
        """Gère les événements de commentaires avec récupération du contenu via API (version synchrone)"""
        try:
            # Debug: log de la structure complète pour diagnostic
            logger.info(f"🔍 DEBUG - Structure complète du webhook {event_type}:")
            logger.info(f"📋 JSON complet: {json.dumps(webhook_data, indent=2)}")
            
            # Extraction de l'ID du commentaire depuis le webhook
            comment_id = webhook_data.get("id")
            logger.info(f"🆔 Comment ID: {comment_id}")
            
            if not comment_id:
                logger.error("❌ Pas d'ID de commentaire trouvé dans le webhook")
                return
            
            # Récupération des détails du commentaire via l'API Frame.io
            comment_details = self._fetch_comment_details(comment_id)
            if not comment_details:
                logger.error(f"❌ Impossible de récupérer les détails du commentaire {comment_id}")
                return
            
            # Extraction des informations du commentaire
            comment_text = comment_details.get('text', '')
            file_id = comment_details.get('file_id')
            owner = comment_details.get('owner', {})
            owner_name = owner.get('name', 'Inconnu')
            
            logger.info(f"💬 Texte du commentaire: '{comment_text}'")
            logger.info(f"📁 File ID associé: {file_id}")
            logger.info(f"� Auteur: {owner_name}")
            
            if not file_id:
                logger.error("❌ Pas de file_id trouvé dans les détails du commentaire")
                return
                
            # Récupérer le nom du fichier depuis le file_id si nécessaire
            # Pour l'instant, on utilise le file_id pour trouver l'upload correspondant
            upload_id = self._find_upload_by_file_id_sync(file_id)
            if not upload_id:
                logger.warning(f"⚠️ Aucun upload trouvé pour file_id: {file_id}")
                return
                
            logger.info(f"✅ Upload trouvé: {upload_id}")
            
            if event_type == "comment.created":
                logger.info(f"💬 Nouveau commentaire créé par {owner_name}: '{comment_text}'")
                
                # Analyser le commentaire et mettre à jour le statut de review
                self._analyze_comment_and_update_status_sync(upload_id, file_id, comment_text, event_type)
                
                # Appel vers le tracking intelligent si disponible
                if hasattr(self, 'intelligent_tracker') and self.intelligent_tracker:
                    # Passer les détails complets du webhook incluant le commentaire
                    try:
                        webhook_data = {
                            'type': event_type,
                            'resource': {
                                'id': comment_details.get('id'),
                                'type': 'comment'
                            },
                            'comment_details': comment_details,
                            'comment_text': comment_text
                        }
                        self.intelligent_tracker.process_webhook_intelligently(webhook_data)
                    except Exception as e:
                        logger.error(f"❌ Erreur tracking intelligent: {e}")
                else:
                    logger.warning("⚠️ Tracking intelligent non disponible")
            
        except Exception as e:
            logger.error(f"❌ Erreur traitement commentaire {event_type}: {e}", exc_info=True)
    
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
    
    def _find_upload_by_file_id_sync(self, file_id: str) -> Optional[str]:
        """
        Trouve un upload par file_id Frame.io (version synchrone)
        
        Args:
            file_id: ID du fichier Frame.io
            
        Returns:
            str: ID de l'upload ou None
        """
        try:
            for upload_id, upload_data in self.upload_tracker.tracking_data.get("uploads", {}).items():
                # Vérifier dans frameio_link si le file_id correspond
                frameio_link = upload_data.get("frameio_link", "")
                if file_id in frameio_link:
                    logger.info(f"✅ Upload trouvé par frameio_link: {upload_id}")
                    return upload_id
                
                # Vérifier aussi dans frameio_data.file_id si disponible
                frameio_data = upload_data.get("frameio_data", {})
                stored_file_id = frameio_data.get("file_id")
                if stored_file_id == file_id:
                    logger.info(f"✅ Upload trouvé par frameio_data.file_id: {upload_id}")
                    return upload_id
                    
            logger.warning(f"⚠️ Aucun upload trouvé pour file_id: {file_id}")
            return None
        except Exception as e:
            logger.error(f"❌ Erreur recherche upload par file_id: {e}")
            return None

    def _analyze_comment_and_update_status_sync(self, upload_id: str, file_id: str, comment_text: str, event_type: str):
        """
        Analyse un commentaire et met à jour le statut de review intelligemment
        """
        try:
            # Récupérer tous les commentaires du fichier
            comments = self._fetch_all_comments_for_file_sync(file_id)
            logger.info(f"🔍 DEBUG: Commentaires récupérés pour file_id {file_id}: {len(comments) if comments else 0} commentaires")
            if comments:
                for i, comment in enumerate(comments[-3:]):  # Afficher les 3 derniers
                    logger.info(f"🔍 DEBUG: Commentaire {i}: {comment.get('text', 'N/A')}")
            
            # Déterminer le statut de review
            review_status = self._determine_review_status_from_comments(comments)
            logger.info(f"🔍 DEBUG: Statut déterminé par _determine_review_status_from_comments: {review_status}")
            
            # Récupérer les données de l'upload pour l'événement
            upload_data = self.upload_tracker.get_upload(upload_id)
            shot_name = upload_data.get('shot_id', '') if upload_data else ''
            old_review_status = upload_data.get('frameio_data', {}).get('review_status') if upload_data else None
            
            # Mettre à jour le statut dans le tracker
            self.upload_tracker.update_upload(upload_id, {
                "frameio_data.review_status": review_status,
                "frameio_data.last_comment": comment_text,
                "frameio_data.last_comment_event": event_type
            })
            
            # Émettre des événements pour les commentaires et changements de statut
            from src.utils.event_manager import event_manager, EventType
            
            # Événement commentaire Frame.io
            comment_event_data = {
                'upload_id': upload_id,
                'shot_name': shot_name,
                'comment_text': comment_text,
                'review_status': review_status,
                'file_id': file_id,
                'commenter': 'Frame.io User'  # Pourrait être amélioré avec l'API
            }
            event_manager.emit_sync(EventType.FRAMEIO_COMMENT_RECEIVED, comment_event_data, source='webhook_manager')
            
            # Événement changement de statut de review si différent
            if review_status != old_review_status:
                status_event_data = {
                    'upload_id': upload_id,
                    'shot_name': shot_name,
                    'review_status': review_status,
                    'old_status': old_review_status,
                    'comment': comment_text
                }
                event_manager.emit_sync(EventType.REVIEW_STATUS_CHANGED, status_event_data, source='webhook_manager')
            
            logger.info(f"🔎 Statut review détecté via commentaires: {review_status} (upload_id: {upload_id})")
            logger.info(f"📤 Événements émis pour commentaire Frame.io: {shot_name}")
            
        except Exception as e:
            logger.error(f"❌ Erreur analyse commentaire: {e}")

    def _fetch_all_comments_for_file_sync(self, file_id: str) -> List[Dict]:
        """
        Récupère tous les commentaires d'un fichier via API Frame.io
        """
        try:
            # Construction de l'URL selon l'endpoint Frame.io V4
            account_id = os.getenv('FRAMEIO_ACCOUNT_ID')
            if not account_id:
                logger.error("❌ FRAMEIO_ACCOUNT_ID non défini")
                return []
                
            url = f"https://api.frame.io/v4/accounts/{account_id}/files/{file_id}/comments"

            # Authentification - utiliser la même logique que _fetch_comment_details
            frameio_auth = None
            
            if hasattr(self.upload_tracker, 'frameio_auth'):
                frameio_auth = self.upload_tracker.frameio_auth
            elif hasattr(self.upload_tracker, 'upload_manager') and hasattr(self.upload_tracker.upload_manager, 'frameio_auth'):
                frameio_auth = self.upload_tracker.upload_manager.frameio_auth
            elif hasattr(self, 'frameio_auth'):
                frameio_auth = self.frameio_auth
            
            if not frameio_auth:
                logger.error("❌ Authentification Frame.io non disponible pour récupération commentaires")
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
                comments_response = response.json()
                # Gérer le wrapper "data" comme pour _fetch_comment_details
                comments_data = comments_response.get("data", comments_response)
                if isinstance(comments_data, list):
                    return comments_data
                else:
                    logger.warning(f"⚠️ Format inattendu des commentaires: {type(comments_data)}")
                    return []
            else:
                logger.error(f"❌ Erreur récupération commentaires: {response.status_code} - {response.text}")
                return []
        except Exception as e:
            logger.error(f"❌ Exception récupération commentaires: {e}")
            return []
    
    def _fetch_comment_details(self, comment_id: str) -> Optional[Dict]:
        """
        Récupère les détails d'un commentaire spécifique via l'API Frame.io V4
        
        Args:
            comment_id: ID du commentaire à récupérer
            
        Returns:
            Dict: Détails du commentaire ou None si erreur
        """
        try:
            # Récupération de l'account_id depuis l'environnement
            import os
            account_id = os.getenv('FRAMEIO_ACCOUNT_ID')
            if not account_id:
                logger.error("❌ FRAMEIO_ACCOUNT_ID non défini")
                return None
                
            # Construction de l'URL selon l'endpoint Frame.io V4
            url = f"https://api.frame.io/v4/accounts/{account_id}/comments/{comment_id}?include=owner"

            # Authentification - essayer plusieurs sources
            frameio_auth = None
            
            # 1. Essayer depuis upload_tracker
            if hasattr(self.upload_tracker, 'frameio_auth'):
                frameio_auth = self.upload_tracker.frameio_auth
                logger.info("🔑 Auth trouvée via upload_tracker.frameio_auth")
            
            # 2. Essayer depuis upload_tracker.upload_manager
            elif hasattr(self.upload_tracker, 'upload_manager') and hasattr(self.upload_tracker.upload_manager, 'frameio_auth'):
                frameio_auth = self.upload_tracker.upload_manager.frameio_auth
                logger.info("🔑 Auth trouvée via upload_tracker.upload_manager.frameio_auth")
            
            # 3. Essayer depuis self directement si on a une référence
            elif hasattr(self, 'frameio_auth'):
                frameio_auth = self.frameio_auth
                logger.info("🔑 Auth trouvée via self.frameio_auth")
            
            if not frameio_auth:
                logger.error("❌ Authentification Frame.io non disponible dans toutes les sources")
                return None
                
            token_config = frameio_auth._load_current_tokens()
            access_token = token_config.get('access_token')
            if not access_token:
                logger.error("❌ Aucun token d'accès disponible pour Frame.io")
                return None
                
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            logger.info(f"🔍 Récupération détails commentaire: {comment_id}")
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                comment_response = response.json()
                comment_data = comment_response.get('data', comment_response)  # Gérer le wrapper "data"
                logger.debug(f"✅ Détails commentaire récupérés pour {comment_id}")
                return comment_data
            else:
                logger.error(f"❌ Erreur API récupération commentaire {comment_id}: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Exception récupération détails commentaire {comment_id}: {e}")
            return None

    def _determine_review_status_from_comments(self, comments: List[Dict]) -> str:
        """
        Détermine le statut de review basé sur l'analyse des commentaires
        Utilise la même logique que auto_hooks pour la cohérence
        """
        try:
            if not comments:
                return "NEED_REVIEW"
            
            # S'assurer qu'on a une liste de dictionnaires
            if not isinstance(comments, list):
                logger.warning(f"⚠️ Commentaires pas en format liste: {type(comments)}")
                return "NEED_REVIEW"
            
            # Utiliser la même logique que auto_hooks.py
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
            
            # Analyser le dernier commentaire (le plus récent)
            if comments:
                latest_comment = comments[-1] if isinstance(comments, list) else comments
                comment_text = latest_comment.get("text", "").lower() if isinstance(latest_comment, dict) else ""
                
                # Vérifier les mots clés négatifs en premier (priorité) - recherche par mots entiers
                has_negative = any(f' {keyword} ' in f' {comment_text} ' or 
                                  comment_text.startswith(f'{keyword} ') or 
                                  comment_text.endswith(f' {keyword}') or 
                                  comment_text == keyword 
                                  for keyword in negative_keywords)
                if has_negative:
                    return "NEED_REWORK"
                
                # Vérifier les mots clés positifs - recherche par mots entiers
                has_positive = any(f' {keyword} ' in f' {comment_text} ' or 
                                  comment_text.startswith(f'{keyword} ') or 
                                  comment_text.endswith(f' {keyword}') or 
                                  comment_text == keyword 
                                  for keyword in positive_keywords)
                if has_positive:
                    return "APPROVED"
            
            # Commentaire neutre/long = besoin de review supplémentaire
            return "NEED_REVIEW"
                
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
                webhook_data_response = webhook_response.get("data", {})
                webhook_id = webhook_data_response.get("id")
                # Frame.io V4 retourne le signing_secret dans la réponse
                signing_secret = webhook_data_response.get("signing_secret")
                
                self.webhook_data.update({
                    "webhook_id": webhook_id,
                    "status": "active",
                    "created_at": datetime.now().isoformat(),
                    "signing_secret": signing_secret  # Stocker le secret pour vérifications
                })
                
                logger.info(f"✅ Webhook Frame.io créé: {webhook_id}")
                if signing_secret:
                    logger.info("🔐 Secret de signature configuré pour sécuriser le webhook")
                else:
                    logger.warning("⚠️ Pas de secret de signature reçu")
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
