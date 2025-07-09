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
import os

logger = logging.getLogger(__name__)


class UploadTracker:
    """
    Système de tracking des uploads pour éviter les doublons et centraliser les métadonnées
    """
    
    def __init__(self, tracking_file: str = "data/uploads_tracking.json"):
        """
        Initialise le tracker d'uploads
        
        Args:
            tracking_file: Chemin vers le fichier de tracking JSON
        """
        self.tracking_file = Path(tracking_file)
        self.tracking_file.parent.mkdir(parents=True, exist_ok=True)
        self.tracking_data = self._load_tracking_data()
        
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
    
    def is_duplicate(self, file_path: str, shot_id: str, version: str) -> Optional[Dict[str, Any]]:
        """
        Vérifie si un fichier est un doublon
        
        Args:
            file_path: Chemin du fichier
            shot_id: ID du shot
            version: Version
            
        Returns:
            Dict ou None: Données de l'upload existant si doublon détecté
        """
        try:
            file_hash = self._calculate_file_hash(file_path)
            if not file_hash:
                return None
            
            upload_id = self.generate_upload_id(file_path, shot_id, version)
            
            # Vérifier par ID d'upload
            if upload_id in self.tracking_data.get("uploads", {}):
                existing_upload = self.tracking_data["uploads"][upload_id]
                logger.warning(f"⚠️ Doublon détecté par ID: {upload_id}")
                return existing_upload
            
            # Vérifier par hash de fichier
            for existing_id, existing_data in self.tracking_data.get("uploads", {}).items():
                if existing_data.get("file_hash") == file_hash:
                    logger.warning(f"⚠️ Doublon détecté par hash: {file_hash[:16]}...")
                    return existing_data
            
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
                "file_hash": file_hash,
                "created_at": datetime.now().isoformat(),
                "last_updated": datetime.now().isoformat(),
                "status": "CREATED",
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
