#!/usr/bin/env python3
"""
Upload Tracker Module
Système de tracking JSON pour éviter les doublons Frame.io et centraliser les métadonnées
"""

import json
import hashlib
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
from pathlib import Path
from enum import Enum
import os

from src.utils.event_manager import event_manager, EventType

logger = logging.getLogger(__name__)


class UploadStatus(Enum):
    """Statuts d'upload avec emojis et contexte."""
    WAITING_APPROVAL = "⏳ WAITING_APPROVAL"     # Fichier créé, en attente d'approbation pour upload
    QUEUED = "📋 QUEUED"                        # Fichier en queue d'upload
    APPROVED = "✅ APPROVED"                     # Approuvé pour upload
    UPLOADING = "🔄 UPLOADING"                  # Upload en cours vers Frame.io
    PROCESSING = "⚙️ PROCESSING"                # Traitement Frame.io en cours
    COMPLETED = "🎉 COMPLETED"                  # Upload terminé avec succès
    FAILED = "❌ FAILED"                        # Échec d'upload
    REJECTED = "🚫 REJECTED"                    # Rejeté (ne sera pas uploadé)
    REPROCESSING = "🔄 REPROCESSING"            # Retraitement forcé


class UploadTracker:
    """
    Système de tracking des uploads pour éviter les doublons et centraliser les métadonnées
    """
    
    def __init__(self, tracking_file: str = "data/uploads_tracking.json"):
        """
        Initialise le tracker d'uploads avec système d'événements
        
        Args:
            tracking_file: Chemin vers le fichier de tracking JSON
        """
        self.tracking_file = Path(tracking_file)
        self.tracking_file.parent.mkdir(parents=True, exist_ok=True)
        self.tracking_data = self._load_tracking_data()
        
        logger.info(f"📋 Upload Tracker initialisé: {tracking_file}")
        logger.info(f"📊 {len(self.tracking_data.get('uploads', {}))} uploads chargés")
        
    def _load_tracking_data(self) -> Dict[str, Any]:
        """
        Charge les données de tracking depuis le fichier JSON
        
        Returns:
            Dict: Données de tracking
        """
        try:
            if self.tracking_file.exists():
                with open(self.tracking_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    logger.info(f"📋 Tracking chargé: {len(data.get('uploads', {}))} uploads")
                    return data
            else:
                logger.info("📋 Nouveau fichier de tracking créé")
                return {
                    "version": "1.0",
                    "created_at": datetime.now().isoformat(),
                    "last_updated": datetime.now().isoformat(),
                    "uploads": {}
                }
        except Exception as e:
            logger.error(f"❌ Erreur chargement tracking: {e}")
            return {
                "version": "1.0",
                "created_at": datetime.now().isoformat(),
                "last_updated": datetime.now().isoformat(),
                "uploads": {}
            }
    
    def _save_tracking_data(self) -> bool:
        """
        Sauvegarde les données de tracking
        
        Returns:
            bool: True si sauvegardé avec succès
        """
        try:
            self.tracking_data["last_updated"] = datetime.now().isoformat()
            
            with open(self.tracking_file, 'w', encoding='utf-8') as f:
                json.dump(self.tracking_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"💾 Tracking sauvegardé: {len(self.tracking_data.get('uploads', {}))} uploads")
            return True
        except Exception as e:
            logger.error(f"❌ Erreur sauvegarde tracking: {e}")
            return False
    
    def _calculate_file_hash(self, file_path: str) -> Optional[str]:
        """
        Calcule le hash SHA256 d'un fichier
        
        Args:
            file_path: Chemin vers le fichier
            
        Returns:
            str: Hash SHA256 ou None si erreur
        """
        try:
            file_path_obj = Path(file_path)
            if not file_path_obj.exists():
                return None
                
            hash_sha256 = hashlib.sha256()
            with open(file_path_obj, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_sha256.update(chunk)
            
            return hash_sha256.hexdigest()
        except Exception as e:
            logger.error(f"❌ Erreur calcul hash: {e}")
            return None
    
    def generate_upload_id(self, file_path: str, shot_id: str, version: str) -> str:
        """
        Génère un ID unique pour l'upload
        
        Args:
            file_path: Chemin du fichier
            shot_id: ID du shot
            version: Version
            
        Returns:
            str: ID unique de l'upload
        """
        file_path_obj = Path(file_path)
        base_data = f"{shot_id}_{version}_{file_path_obj.name}"
        return hashlib.md5(base_data.encode()).hexdigest()[:16]
    
    def is_likely_incomplete_file(self, file_path: str) -> bool:
        """
        Détermine si un fichier vidéo semble incomplet basé sur sa taille.
        
        Args:
            file_path: Chemin du fichier
            
        Returns:
            bool: True si le fichier semble incomplet
        """
        try:
            file_path_obj = Path(file_path)
            if not file_path_obj.exists():
                return True
                
            file_size = file_path_obj.stat().st_size
            file_name = file_path_obj.name.lower()
            
            # Tailles minimales attendues pour différents formats (en bytes)
            min_sizes = {
                '.mov': 20 * 1024 * 1024,   # 20MB minimum pour MOV
                '.mp4': 15 * 1024 * 1024,   # 15MB minimum pour MP4
                '.avi': 25 * 1024 * 1024,   # 25MB minimum pour AVI
                '.mxf': 30 * 1024 * 1024,   # 30MB minimum pour MXF
            }
            
            # Détecter l'extension
            extension = file_path_obj.suffix.lower()
            min_expected_size = min_sizes.get(extension, 20 * 1024 * 1024)  # Default 20MB
            
            if file_size < min_expected_size:
                size_mb = file_size / (1024 * 1024)
                expected_mb = min_expected_size / (1024 * 1024)
                logger.warning(f"⚠️ Fichier potentiellement incomplet: {file_path_obj.name}")
                logger.warning(f"   📊 Taille actuelle: {size_mb:.1f} MB")
                logger.warning(f"   📏 Taille minimale attendue: {expected_mb:.1f} MB")
                return True
                
            return False
            
        except Exception as e:
            logger.error(f"❌ Erreur vérification fichier incomplet: {e}")
            return False
    
    def is_duplicate(self, file_path: str, shot_id: str, version: str) -> Optional[Dict[str, Any]]:
        """
        Vérifie si un fichier est un doublon ou un remplacement
        
        Args:
            file_path: Chemin du fichier
            shot_id: ID du shot
            version: Version
            
        Returns:
            Dict ou None: Données de l'upload existant si doublon détecté, None si c'est un remplacement
        """
        try:
            # Vérifier d'abord si le nouveau fichier semble incomplet
            if self.is_likely_incomplete_file(file_path):
                logger.warning(f"⚠️ Fichier potentiellement incomplet détecté: {shot_id} {version}")
                logger.warning(f"   💡 Le fichier pourrait encore être en cours d'écriture")
                logger.warning(f"   🔄 Autorisation conditionnelle de l'upload")
            
            upload_id = self.generate_upload_id(file_path, shot_id, version)
            
            # Vérifier par ID d'upload (shot_id + version)
            if upload_id in self.tracking_data.get("uploads", {}):
                existing_upload = self.tracking_data["uploads"][upload_id]
                
                # Vérifier le statut pour éviter les doublons en cours de traitement
                current_status = existing_upload.get("status", "")
                if current_status in ["� QUEUED", "�🔄 UPLOADING", "⚙️ PROCESSING", "🎉 COMPLETED"]:
                    logger.warning(f"⚠️ Fichier déjà en cours de traitement: {shot_id} {version}")
                    logger.warning(f"   📊 Statut actuel: {current_status}")
                    logger.warning(f"   🚫 Upload bloqué pour éviter le doublon")
                    return existing_upload
                
                # Comparer le contenu pour détecter les remplacements
                file_path_obj = Path(file_path)
                if not file_path_obj.exists():
                    logger.warning(f"⚠️ Fichier non trouvé: {file_path}")
                    return existing_upload
                
                # Calculer le hash du nouveau fichier
                new_hash = self._calculate_file_hash(file_path)
                new_size = file_path_obj.stat().st_size
                
                # Récupérer les données existantes
                existing_hash = existing_upload.get("file_hash")
                existing_size = existing_upload.get("file_size", 0)
                
                # Comparer hash et taille
                if new_hash and existing_hash:
                    if new_hash == existing_hash and new_size == existing_size:
                        logger.warning(f"⚠️ Doublon exact détecté: {shot_id} {version} (même hash)")
                        return existing_upload
                    else:
                        logger.warning(f"🔄 REMPLACEMENT DÉTECTÉ: {shot_id} {version}")
                        logger.warning(f"   📊 Taille: {existing_size} → {new_size} bytes")
                        logger.warning(f"   🔐 Hash: {existing_hash[:16]}... → {new_hash[:16]}...")
                        logger.warning(f"   ✅ Autorisation du re-upload")
                        return None  # Permettre le re-upload
                elif new_size != existing_size:
                    # Différence de taille significative
                    size_diff_percent = abs(new_size - existing_size) / max(existing_size, 1) * 100
                    if size_diff_percent > 5:  # Plus de 5% de différence
                        logger.warning(f"🔄 REMPLACEMENT DÉTECTÉ par taille: {shot_id} {version}")
                        logger.warning(f"   📊 Taille: {existing_size} → {new_size} bytes ({size_diff_percent:.1f}% différence)")
                        logger.warning(f"   ✅ Autorisation du re-upload")
                        return None  # Permettre le re-upload
                    else:
                        logger.warning(f"⚠️ Doublon similaire détecté: {shot_id} {version} (taille proche)")
                        return existing_upload
                else:
                    logger.warning(f"⚠️ Doublon détecté par shot_id: {shot_id} {version}")
                    return existing_upload
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Erreur détection doublon: {e}")
            return None
    
    def add_upload(self, file_path: str, shot_id: str, version: str, 
                   metadata: Dict[str, Any] = None) -> str:
        """
        Ajoute un nouvel upload au tracking
        
        Args:
            file_path: Chemin du fichier
            shot_id: ID du shot
            version: Version
            metadata: Métadonnées supplémentaires
            
        Returns:
            str: ID de l'upload
        """
        try:
            file_path_obj = Path(file_path)
            file_hash = self._calculate_file_hash(file_path)
            upload_id = self.generate_upload_id(file_path, shot_id, version)
            
            upload_data = {
                "upload_id": upload_id,
                "file_path": str(file_path_obj.absolute()),
                "filename": file_path_obj.name,
                "shot_id": shot_id,
                "version": version,
                "file_size": file_path_obj.stat().st_size if file_path_obj.exists() else 0,
                "file_mtime": file_path_obj.stat().st_mtime if file_path_obj.exists() else 0,
                "file_hash": file_hash,
                "created_at": datetime.now().isoformat(),
                "last_updated": datetime.now().isoformat(),
                "status": "📋 QUEUED",  # Marquer directement comme en queue
                "frameio_data": {
                    "file_id": None,
                    "upload_status": "PENDING",
                    "review_link": None,
                    "share_link": None,
                    "processing_status": None
                },
                "google_sheets_data": {
                    "updated": False,
                    "row_number": None,
                    "update_timestamp": None
                },
                "discord_data": {
                    "message_sent": False,
                    "message_id": None,
                    "send_timestamp": None
                },
                "thumbnail_data": {
                    "generated": False,
                    "local_path": None,
                    "drive_url": None,
                    "drive_file_id": None
                }
            }
            
            # Ajouter les métadonnées personnalisées
            if metadata:
                upload_data.update(metadata)
            
            # Sauvegarder dans le tracking
            self.tracking_data["uploads"][upload_id] = upload_data
            self._save_tracking_data()
            
            logger.info(f"📝 Upload ajouté: {upload_id} - {shot_id} {version}")
            return upload_id
            
        except Exception as e:
            logger.error(f"❌ Erreur ajout upload: {e}")
            return None
    
    def update_upload(self, upload_id: str, updates: Dict[str, Any]) -> bool:
        """
        Met à jour un upload existant
        
        Args:
            upload_id: ID de l'upload
            updates: Mises à jour à appliquer
            
        Returns:
            bool: True si mis à jour avec succès
        """
        try:
            if upload_id not in self.tracking_data.get("uploads", {}):
                logger.error(f"❌ Upload non trouvé: {upload_id}")
                return False
            
            upload_data = self.tracking_data["uploads"][upload_id]
            
            # Appliquer les mises à jour
            for key, value in updates.items():
                if "." in key:
                    # Gestion des clés imbriquées (ex: "frameio_data.file_id")
                    parts = key.split(".")
                    current = upload_data
                    for part in parts[:-1]:
                        if part not in current:
                            current[part] = {}
                        current = current[part]
                    current[parts[-1]] = value
                else:
                    upload_data[key] = value
            
            upload_data["last_updated"] = datetime.now().isoformat()
            
            # Sauvegarder
            self._save_tracking_data()
            
            # Note: Les notifications Google Sheets sont maintenant gérées 
            # automatiquement par le système d'événements via auto_hooks
            
            logger.info(f"✅ Upload mis à jour: {upload_id}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur mise à jour upload: {e}")
            return False
    
    def get_upload(self, upload_id: str) -> Optional[Dict[str, Any]]:
        """
        Récupère les données d'un upload
        
        Args:
            upload_id: ID de l'upload
            
        Returns:
            Dict ou None: Données de l'upload
        """
        return self.tracking_data.get("uploads", {}).get(upload_id)
    
    def list_uploads(self, shot_id: str = None, status: str = None) -> List[Dict[str, Any]]:
        """
        Liste les uploads avec filtres optionnels
        
        Args:
            shot_id: Filtrer par shot_id
            status: Filtrer par status
            
        Returns:
            List: Liste des uploads
        """
        try:
            uploads = []
            
            for upload_id, upload_data in self.tracking_data.get("uploads", {}).items():
                # Filtrer par shot_id si spécifié
                if shot_id and upload_data.get("shot_id") != shot_id:
                    continue
                
                # Filtrer par status si spécifié
                if status and upload_data.get("status") != status:
                    continue
                
                uploads.append(upload_data)
            
            return uploads
            
        except Exception as e:
            logger.error(f"❌ Erreur liste uploads: {e}")
            return []
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Retourne des statistiques sur les uploads
        
        Returns:
            Dict: Statistiques
        """
        try:
            uploads = self.tracking_data.get("uploads", {})
            
            stats = {
                "total_uploads": len(uploads),
                "by_status": {},
                "by_shot": {},
                "total_size": 0,
                "frameio_uploads": 0,
                "discord_notifications": 0,
                "sheets_updates": 0
            }
            
            for upload_data in uploads.values():
                # Statistiques par status
                status = upload_data.get("status", "UNKNOWN")
                stats["by_status"][status] = stats["by_status"].get(status, 0) + 1
                
                # Statistiques par shot
                shot_id = upload_data.get("shot_id", "UNKNOWN")
                stats["by_shot"][shot_id] = stats["by_shot"].get(shot_id, 0) + 1
                
                # Taille totale
                stats["total_size"] += upload_data.get("file_size", 0)
                
                # Compteurs spécifiques
                if upload_data.get("frameio_data", {}).get("file_id"):
                    stats["frameio_uploads"] += 1
                
                if upload_data.get("discord_data", {}).get("message_sent"):
                    stats["discord_notifications"] += 1
                
                if upload_data.get("google_sheets_data", {}).get("updated"):
                    stats["sheets_updates"] += 1
            
            return stats
            
        except Exception as e:
            logger.error(f"❌ Erreur calcul stats: {e}")
            return {}
    
    def cleanup_old_uploads(self, days: int = 30) -> int:
        """
        Nettoie les anciens uploads
        
        Args:
            days: Nombre de jours à conserver
            
        Returns:
            int: Nombre d'uploads supprimés
        """
        try:
            from datetime import timedelta
            
            cutoff_date = datetime.now() - timedelta(days=days)
            uploads_to_remove = []
            
            for upload_id, upload_data in self.tracking_data.get("uploads", {}).items():
                created_at = upload_data.get("created_at")
                if created_at:
                    upload_date = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    if upload_date < cutoff_date:
                        uploads_to_remove.append(upload_id)
            
            # Supprimer les anciens uploads
            for upload_id in uploads_to_remove:
                del self.tracking_data["uploads"][upload_id]
            
            if uploads_to_remove:
                self._save_tracking_data()
                logger.info(f"🧹 {len(uploads_to_remove)} anciens uploads supprimés")
            
            return len(uploads_to_remove)
            
        except Exception as e:
            logger.error(f"❌ Erreur nettoyage: {e}")
            return 0
    
    def mark_queued(self, upload_id: str) -> bool:
        """
        Marque un upload comme mis en queue pour éviter les doublons.
        
        Args:
            upload_id: ID de l'upload
            
        Returns:
            bool: True si mis à jour avec succès
        """
        updates = {
            'status': '📋 QUEUED',
            'queued_at': datetime.now().isoformat()
        }
        return self.update_upload(upload_id, updates)
    
    def approve_upload(self, upload_id: str, approved_by: str = None) -> bool:
        """
        Approuve un upload pour le traitement.
        
        Args:
            upload_id: ID de l'upload
            approved_by: Qui a approuvé l'upload
            
        Returns:
            bool: True si approuvé avec succès
        """
        updates = {
            'status': UploadStatus.APPROVED.value,
            'approved_by': approved_by,
            'approved_at': datetime.now().isoformat()
        }
        return self.update_upload(upload_id, updates)
    
    def reject_upload(self, upload_id: str, reason: str = None, rejected_by: str = None) -> bool:
        """
        Rejette un upload.
        
        Args:
            upload_id: ID de l'upload
            reason: Raison du rejet
            rejected_by: Qui a rejeté l'upload
            
        Returns:
            bool: True si rejeté avec succès
        """
        updates = {
            'status': UploadStatus.REJECTED.value,
            'rejection_reason': reason,
            'rejected_by': rejected_by,
            'rejected_at': datetime.now().isoformat()
        }
        return self.update_upload(upload_id, updates)
    
    def start_upload(self, upload_id: str) -> bool:
        """
        Marque un upload comme en cours.
        
        Args:
            upload_id: ID de l'upload
            
        Returns:
            bool: True si mis à jour avec succès
        """
        updates = {
            'status': UploadStatus.UPLOADING.value,
            'upload_started_at': datetime.now().isoformat()
        }
        return self.update_upload(upload_id, updates)
    
    def mark_processing(self, upload_id: str) -> bool:
        """
        Marque un upload comme en traitement Frame.io.
        
        Args:
            upload_id: ID de l'upload
            
        Returns:
            bool: True si mis à jour avec succès
        """
        updates = {
            'status': UploadStatus.PROCESSING.value,
            'processing_started_at': datetime.now().isoformat()
        }
        return self.update_upload(upload_id, updates)
    
    def mark_completed(self, upload_id: str, frameio_data: Dict[str, Any] = None) -> bool:
        """
        Marque un upload comme terminé avec succès.
        
        Args:
            upload_id: ID de l'upload
            frameio_data: Données Frame.io (file_id, review_link, etc.)
            
        Returns:
            bool: True si mis à jour avec succès
        """
        updates = {
            'status': UploadStatus.COMPLETED.value,
            'completed_at': datetime.now().isoformat()
        }
        
        if frameio_data:
            for key, value in frameio_data.items():
                updates[f'frameio_data.{key}'] = value
        
        return self.update_upload(upload_id, updates)
    
    def mark_failed(self, upload_id: str, error_message: str = None) -> bool:
        """
        Marque un upload comme échoué.
        
        Args:
            upload_id: ID de l'upload
            error_message: Message d'erreur
            
        Returns:
            bool: True si mis à jour avec succès
        """
        updates = {
            'status': UploadStatus.FAILED.value,
            'failed_at': datetime.now().isoformat(),
            'error_message': error_message
        }
        return self.update_upload(upload_id, updates)
    
    def update_status(self, upload_id: str, status: str, **kwargs) -> bool:
        """
        Met à jour le statut d'un upload et émet un événement.
        
        Args:
            upload_id: ID de l'upload
            status: Nouveau statut
            **kwargs: Données supplémentaires (frameio_link, comment, etc.)
            
        Returns:
            bool: True si mis à jour avec succès
        """
        # Récupérer l'ancien statut pour comparaison
        upload_data = self.get_upload(upload_id)
        old_status = upload_data.get('status') if upload_data else None
        
        updates = {
            'status': status,
            'status_updated_at': datetime.now().isoformat()
        }
        
        # Ajouter les données supplémentaires
        updates.update(kwargs)
        
        success = self.update_upload(upload_id, updates)
        
        if success and upload_data:
            # Émettre un événement de changement de statut
            event_data = {
                'upload_id': upload_id,
                'shot_name': upload_data.get('shot_id', ''),
                'version': upload_data.get('version', ''),
                'status': status,
                'old_status': old_status,
                'file_name': upload_data.get('file_name', ''),
                'frameio_link': kwargs.get('frameio_link'),
                'comment': kwargs.get('comment'),
                'thumbnail_url': kwargs.get('thumbnail_url')
            }
            
            # Émettre différents types d'événements selon le statut
            if status in ['🎉 COMPLETED', 'COMPLETED']:
                event_manager.emit_sync(EventType.UPLOAD_COMPLETED, event_data, source='upload_tracker')
            elif status in ['❌ FAILED', 'FAILED']:
                event_data['error'] = kwargs.get('error_message', 'Erreur inconnue')
                event_manager.emit_sync(EventType.UPLOAD_FAILED, event_data, source='upload_tracker')
            else:
                event_manager.emit_sync(EventType.STATUS_CHANGED, event_data, source='upload_tracker')
            
            logger.info(f"📤 Événement émis: {upload_id} {old_status} -> {status}")
        
        return success
    
    def get_pending_approvals(self) -> List[Dict[str, Any]]:
        """
        Retourne tous les uploads en attente d'approbation.
        
        Returns:
            List: Liste des uploads en attente
        """
        return self.list_uploads(status=UploadStatus.WAITING_APPROVAL.value)
    
    def get_approved_uploads(self) -> List[Dict[str, Any]]:
        """
        Retourne tous les uploads approuvés mais pas encore uploadés.
        
        Returns:
            List: Liste des uploads approuvés
        """
        return self.list_uploads(status=UploadStatus.APPROVED.value)
    
    def get_status_emoji(self, status: str) -> str:
        """
        Retourne l'emoji correspondant au statut.
        
        Args:
            status: Statut de l'upload
            
        Returns:
            str: Emoji du statut
        """
        status_map = {
            UploadStatus.WAITING_APPROVAL.value: "⏳",
            UploadStatus.QUEUED.value: "📋",
            UploadStatus.APPROVED.value: "✅", 
            UploadStatus.UPLOADING.value: "🔄",
            UploadStatus.PROCESSING.value: "⚙️",
            UploadStatus.COMPLETED.value: "🎉",
            UploadStatus.FAILED.value: "❌",
            UploadStatus.REJECTED.value: "🚫",
            UploadStatus.REPROCESSING.value: "🔄"
        }
        return status_map.get(status, "❓")
