"""
Frame.io API v4 Comments Module
Gestion des commentaires timecodés et annotations
"""

import asyncio
import os
from typing import List, Dict, Optional, Any, Union
from dataclasses import dataclass
from datetime import datetime
import logging

from .auth import FrameIOAuth

logger = logging.getLogger(__name__)

@dataclass
class FrameIOComment:
    """Représentation d'un commentaire Frame.io"""
    id: str
    text: str
    file_id: str
    author_id: str
    author_name: Optional[str] = None
    timestamp: Optional[float] = None  # En secondes
    frame_number: Optional[int] = None
    annotations: Optional[List[Dict[str, Any]]] = None
    status: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    replies: Optional[List[Dict[str, Any]]] = None

@dataclass
class CommentAnnotation:
    """Annotation visuelle pour un commentaire"""
    type: str  # "point", "rectangle", "arrow", etc.
    x: float
    y: float
    width: Optional[float] = None
    height: Optional[float] = None
    color: Optional[str] = None

class FrameIOCommentManager:
    """Gestionnaire de commentaires Frame.io v4"""
    
    def __init__(self, auth: FrameIOAuth):
        self.auth = auth
        self.account_id = os.getenv('FRAMEIO_ACCOUNT_ID')
        self.workspace_id = os.getenv('FRAMEIO_WORKSPACE_ID')
        self.base_url = os.getenv('FRAMEIO_BASE_URL', 'https://api.frame.io/v4')
        
        if not self.account_id or not self.workspace_id:
            raise ValueError("FRAMEIO_ACCOUNT_ID et FRAMEIO_WORKSPACE_ID sont requis")
    
    async def get_file_comments(self, file_id: str, project_id: str) -> List[FrameIOComment]:
        """
        Récupérer tous les commentaires d'un fichier
        Endpoint: /accounts/{account_id}/workspaces/{workspace_id}/projects/{project_id}/files/{file_id}/comments
        """
        try:
            # Construire l'URL selon l'arborescence v4 stricte
            url = f"{self.base_url}/accounts/{self.account_id}/workspaces/{self.workspace_id}/projects/{project_id}/files/{file_id}/comments"
            
            comments = []
            next_cursor = None
            
            while True:
                params = {}
                if next_cursor:
                    params["cursor"] = next_cursor
                
                response = await self.auth._request_with_retry("GET", url, headers=headers, params=params)
                data = response.json()
                
                # Convertir en objets FrameIOComment
                for comment_data in data.get("data", []):
                    comment = self._parse_comment_data(comment_data, file_id)
                    comments.append(comment)
                
                # Gestion pagination
                pagination = data.get("pagination", {})
                next_cursor = pagination.get("next_cursor")
                if not next_cursor:
                    break
            
            logger.info(f"Récupéré {len(comments)} commentaires pour le fichier {file_id}")
            return comments
            
        except Exception as e:
            logger.error(f"Erreur récupération commentaires: {e}")
            return []
    
    def _parse_comment_data(self, comment_data: Dict[str, Any], file_id: str) -> FrameIOComment:
        """Parser les données d'un commentaire depuis l'API"""
        # Extraire les informations d'annotation
        annotations = []
        if comment_data.get("annotations"):
            for ann_data in comment_data["annotations"]:
                annotation = {
                    "type": ann_data.get("type", "point"),
                    "x": ann_data.get("x", 0),
                    "y": ann_data.get("y", 0),
                    "width": ann_data.get("width"),
                    "height": ann_data.get("height"),
                    "color": ann_data.get("color")
                }
                annotations.append(annotation)
        
        # Extraire l'auteur
        author = comment_data.get("author", {})
        author_name = None
        if author:
            author_name = f"{author.get('first_name', '')} {author.get('last_name', '')}".strip()
        
        return FrameIOComment(
            id=comment_data["id"],
            text=comment_data.get("text", ""),
            file_id=file_id,
            author_id=comment_data.get("author_id", ""),
            author_name=author_name,
            timestamp=comment_data.get("timestamp"),
            frame_number=comment_data.get("frame_number"),
            annotations=annotations if annotations else None,
            status=comment_data.get("status"),
            created_at=comment_data.get("created_at"),
            updated_at=comment_data.get("updated_at"),
            replies=comment_data.get("replies", [])
        )
    
    async def add_comment(self, file_id: str, text: str, timestamp: Optional[float] = None,
                         frame_number: Optional[int] = None, 
                         annotations: Optional[List[CommentAnnotation]] = None) -> Optional[FrameIOComment]:
        """
        Ajouter un commentaire à un fichier
        Endpoint: /files/{file_id}/comments
        
        Args:
            file_id: ID du fichier Frame.io
            text: Texte du commentaire
            timestamp: Position en secondes (optionnel)
            frame_number: Numéro de frame (optionnel)
            annotations: Annotations visuelles (optionnel)
        
        Returns:
            FrameIOComment si succès, None sinon
        """
        try:
            headers = await self.auth.get_auth_headers()
            url = f"{self.config.base_url}/files/{file_id}/comments"
            
            payload = {
                "text": text
            }
            
            # Ajouter timestamp si fourni
            if timestamp is not None:
                payload["timestamp"] = timestamp
            
            # Ajouter frame_number si fourni
            if frame_number is not None:
                payload["frame_number"] = frame_number
            
            # Ajouter annotations si fournies
            if annotations:
                payload["annotations"] = []
                for ann in annotations:
                    ann_data = {
                        "type": ann.type,
                        "x": ann.x,
                        "y": ann.y
                    }
                    if ann.width is not None:
                        ann_data["width"] = ann.width
                    if ann.height is not None:
                        ann_data["height"] = ann.height
                    if ann.color:
                        ann_data["color"] = ann.color
                    
                    payload["annotations"].append(ann_data)
            
            response = await self.auth._request_with_retry("POST", url, headers=headers, json=payload)
            comment_data = response.json()
            
            comment = self._parse_comment_data(comment_data, file_id)
            
            logger.info(f"Commentaire ajouté au fichier {file_id}: {text[:50]}...")
            return comment
            
        except Exception as e:
            logger.error(f"Erreur ajout commentaire: {e}")
            return None
    
    async def add_timecoded_comment(self, file_id: str, text: str, timecode: str,
                                   annotations: Optional[List[CommentAnnotation]] = None) -> Optional[FrameIOComment]:
        """
        Ajouter un commentaire avec timecode (format HH:MM:SS ou HH:MM:SS:FF)
        
        Args:
            file_id: ID du fichier Frame.io
            text: Texte du commentaire
            timecode: Timecode au format "HH:MM:SS" ou "HH:MM:SS:FF"
            annotations: Annotations visuelles (optionnel)
        
        Returns:
            FrameIOComment si succès, None sinon
        """
        try:
            # Convertir timecode en secondes
            timestamp = self._timecode_to_seconds(timecode)
            if timestamp is None:
                logger.error(f"Format timecode invalide: {timecode}")
                return None
            
            return await self.add_comment(file_id, text, timestamp, annotations=annotations)
            
        except Exception as e:
            logger.error(f"Erreur ajout commentaire timecodé: {e}")
            return None
    
    def _timecode_to_seconds(self, timecode: str, fps: float = 25.0) -> Optional[float]:
        """
        Convertir un timecode en secondes
        Supporte les formats: HH:MM:SS et HH:MM:SS:FF
        """
        try:
            parts = timecode.split(":")
            
            if len(parts) == 3:  # HH:MM:SS
                hours, minutes, seconds = map(int, parts)
                return hours * 3600 + minutes * 60 + seconds
            
            elif len(parts) == 4:  # HH:MM:SS:FF
                hours, minutes, seconds, frames = map(int, parts)
                total_seconds = hours * 3600 + minutes * 60 + seconds
                total_seconds += frames / fps
                return total_seconds
            
            else:
                return None
                
        except (ValueError, TypeError):
            return None
    
    def _seconds_to_timecode(self, seconds: float, fps: float = 25.0, include_frames: bool = True) -> str:
        """
        Convertir des secondes en timecode
        """
        try:
            hours = int(seconds // 3600)
            minutes = int((seconds % 3600) // 60)
            secs = int(seconds % 60)
            
            if include_frames:
                frames = int((seconds % 1) * fps)
                return f"{hours:02d}:{minutes:02d}:{secs:02d}:{frames:02d}"
            else:
                return f"{hours:02d}:{minutes:02d}:{secs:02d}"
                
        except (ValueError, TypeError):
            return "00:00:00"
    
    async def reply_to_comment(self, comment_id: str, text: str) -> Optional[Dict[str, Any]]:
        """
        Répondre à un commentaire existant
        Endpoint: /comments/{comment_id}/replies
        """
        try:
            headers = await self.auth.get_auth_headers()
            url = f"{self.config.base_url}/comments/{comment_id}/replies"
            
            payload = {
                "text": text
            }
            
            response = await self.auth._request_with_retry("POST", url, headers=headers, json=payload)
            reply_data = response.json()
            
            logger.info(f"Réponse ajoutée au commentaire {comment_id}")
            return reply_data
            
        except Exception as e:
            logger.error(f"Erreur ajout réponse: {e}")
            return None
    
    async def update_comment_status(self, comment_id: str, status: str) -> bool:
        """
        Mettre à jour le statut d'un commentaire
        Statuts possibles: "open", "resolved", "pending", etc.
        """
        try:
            headers = await self.auth.get_auth_headers()
            url = f"{self.config.base_url}/comments/{comment_id}"
            
            payload = {
                "status": status
            }
            
            response = await self.auth._request_with_retry("PATCH", url, headers=headers, json=payload)
            
            logger.info(f"Statut commentaire {comment_id} mis à jour: {status}")
            return response.status_code in [200, 204]
            
        except Exception as e:
            logger.error(f"Erreur mise à jour statut commentaire: {e}")
            return False
    
    async def get_comments_summary(self, file_id: str) -> Dict[str, Any]:
        """
        Obtenir un résumé des commentaires d'un fichier
        Utile pour les rapports et le monitoring
        """
        try:
            comments = await self.get_file_comments(file_id)
            
            summary = {
                "total_comments": len(comments),
                "status_breakdown": {},
                "authors": set(),
                "timecoded_comments": 0,
                "latest_comment": None,
                "unresolved_count": 0
            }
            
            for comment in comments:
                # Compter par statut
                status = comment.status or "open"
                summary["status_breakdown"][status] = summary["status_breakdown"].get(status, 0) + 1
                
                # Collecter les auteurs
                if comment.author_name:
                    summary["authors"].add(comment.author_name)
                
                # Compter les commentaires timecodés
                if comment.timestamp is not None:
                    summary["timecoded_comments"] += 1
                
                # Compter les non résolus
                if status != "resolved":
                    summary["unresolved_count"] += 1
                
                # Dernier commentaire
                if not summary["latest_comment"] or comment.created_at > summary["latest_comment"]["created_at"]:
                    summary["latest_comment"] = {
                        "id": comment.id,
                        "text": comment.text[:100] + "..." if len(comment.text) > 100 else comment.text,
                        "author": comment.author_name,
                        "created_at": comment.created_at
                    }
            
            summary["authors"] = list(summary["authors"])
            
            return summary
            
        except Exception as e:
            logger.error(f"Erreur génération résumé commentaires: {e}")
            return {}
    
    async def export_comments_to_dict(self, file_id: str) -> List[Dict[str, Any]]:
        """
        Exporter tous les commentaires d'un fichier en format dictionnaire
        Utile pour l'intégration avec d'autres systèmes
        """
        try:
            comments = await self.get_file_comments(file_id)
            
            exported_comments = []
            for comment in comments:
                comment_dict = {
                    "id": comment.id,
                    "text": comment.text,
                    "author": comment.author_name,
                    "timestamp": comment.timestamp,
                    "timecode": self._seconds_to_timecode(comment.timestamp) if comment.timestamp else None,
                    "frame_number": comment.frame_number,
                    "status": comment.status,
                    "created_at": comment.created_at,
                    "annotations": comment.annotations,
                    "replies_count": len(comment.replies) if comment.replies else 0
                }
                exported_comments.append(comment_dict)
            
            return exported_comments
            
        except Exception as e:
            logger.error(f"Erreur export commentaires: {e}")
            return []
