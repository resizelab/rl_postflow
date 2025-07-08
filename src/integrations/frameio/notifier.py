"""
Frame.io Discord Notifier Module
Notification Discord enrichie pour l'intégration LucidLink → Frame.io
"""

import asyncio
import requests
from typing import Dict, List, Optional, Any
from datetime import datetime
from dataclasses import dataclass
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

@dataclass
class FrameIONotificationData:
    """Données de notification pour Frame.io"""
    file_name: str
    shot_id: str
    scene_name: str
    version: str
    nomenclature: str
    file_size: int
    upload_status: str
    review_link: str
    folder_path: str
    upload_timestamp: str
    file_id: str
    project_id: str
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    error_message: Optional[str] = None

class FrameIODiscordNotifier:
    """Notificateur Discord enrichi pour Frame.io"""
    
    def __init__(self, webhook_url: str, bot_name: str = "RL PostFlow Bot"):
        """
        Initialise le notificateur Discord.
        
        Args:
            webhook_url: URL du webhook Discord
            bot_name: Nom du bot Discord
        """
        self.webhook_url = webhook_url
        self.bot_name = bot_name
        self.avatar_url = "https://cdn.discordapp.com/emojis/🎬.png"
    
    def send_upload_success_notification(self, data: FrameIONotificationData) -> bool:
        """
        Envoie une notification de succès d'upload.
        
        Args:
            data: Données de notification
            
        Returns:
            True si la notification a été envoyée avec succès
        """
        try:
            # Créer l'embed enrichi
            embed = self._create_success_embed(data)
            
            # Message principal
            message = f"✅ **Upload réussi** - {data.nomenclature}"
            
            # Envoyer la notification
            return self._send_discord_message(message, embed)
            
        except Exception as e:
            logger.error(f"Erreur notification succès: {e}")
            return False
    
    def send_upload_error_notification(self, data: FrameIONotificationData) -> bool:
        """
        Envoie une notification d'erreur d'upload.
        
        Args:
            data: Données de notification
            
        Returns:
            True si la notification a été envoyée avec succès
        """
        try:
            # Créer l'embed d'erreur
            embed = self._create_error_embed(data)
            
            # Message principal
            message = f"❌ **Erreur d'upload** - {data.file_name}"
            
            # Envoyer la notification
            return self._send_discord_message(message, embed)
            
        except Exception as e:
            logger.error(f"Erreur notification erreur: {e}")
            return False
    
    def send_processing_notification(self, data: FrameIONotificationData) -> bool:
        """
        Envoie une notification de traitement en cours.
        
        Args:
            data: Données de notification
            
        Returns:
            True si la notification a été envoyée avec succès
        """
        try:
            # Créer l'embed de traitement
            embed = self._create_processing_embed(data)
            
            # Message principal
            message = f"⏳ **Traitement en cours** - {data.nomenclature}"
            
            # Envoyer la notification
            return self._send_discord_message(message, embed)
            
        except Exception as e:
            logger.error(f"Erreur notification traitement: {e}")
            return False
    
    def _create_success_embed(self, data: FrameIONotificationData) -> Dict[str, Any]:
        """Crée l'embed Discord pour un succès d'upload"""
        
        # Formatage de la taille du fichier
        file_size_mb = round(data.file_size / (1024 * 1024), 2)
        
        # Formatage du timestamp
        upload_time = datetime.fromisoformat(data.upload_timestamp).strftime("%d/%m/%Y %H:%M:%S")
        
        # Couleur verte pour succès
        embed = {
            "title": "🎬 Upload Frame.io Réussi",
            "description": f"Le fichier **{data.file_name}** a été uploadé avec succès sur Frame.io",
            "color": 0x00FF00,  # Vert
            "fields": [
                {
                    "name": "📋 Informations du Plan",
                    "value": f"**Scène:** {data.scene_name}\n**Plan:** {data.shot_id}\n**Version:** {data.version}",
                    "inline": True
                },
                {
                    "name": "📁 Fichier",
                    "value": f"**Nom:** {data.file_name}\n**Taille:** {file_size_mb} MB\n**Nomenclature:** {data.nomenclature}",
                    "inline": True
                },
                {
                    "name": "🔗 Liens",
                    "value": f"[**🎥 Voir sur Frame.io**]({data.review_link})",
                    "inline": False
                },
                {
                    "name": "📂 Emplacement",
                    "value": f"**Dossier:** {data.folder_path}\n**Projet:** {data.project_id}",
                    "inline": True
                },
                {
                    "name": "⏰ Informations Upload",
                    "value": f"**Uploadé le:** {upload_time}\n**Statut:** {data.upload_status}",
                    "inline": True
                }
            ],
            "footer": {
                "text": "RL PostFlow - Intégration LucidLink → Frame.io",
                "icon_url": "https://cdn.discordapp.com/emojis/🎬.png"
            },
            "timestamp": datetime.now().isoformat()
        }
        
        # Ajouter les tags si présents
        if data.tags:
            embed["fields"].append({
                "name": "🏷️ Tags",
                "value": ", ".join(f"`{tag}`" for tag in data.tags),
                "inline": False
            })
        
        # Ajouter la description si présente
        if data.description:
            embed["fields"].append({
                "name": "📝 Description",
                "value": data.description,
                "inline": False
            })
        
        return embed
    
    def _create_error_embed(self, data: FrameIONotificationData) -> Dict[str, Any]:
        """Crée l'embed Discord pour une erreur d'upload"""
        
        # Formatage de la taille du fichier
        file_size_mb = round(data.file_size / (1024 * 1024), 2) if data.file_size else 0
        
        # Formatage du timestamp
        upload_time = datetime.fromisoformat(data.upload_timestamp).strftime("%d/%m/%Y %H:%M:%S")
        
        # Couleur rouge pour erreur
        embed = {
            "title": "❌ Erreur Upload Frame.io",
            "description": f"Échec de l'upload du fichier **{data.file_name}** sur Frame.io",
            "color": 0xFF0000,  # Rouge
            "fields": [
                {
                    "name": "📋 Informations du Plan",
                    "value": f"**Scène:** {data.scene_name or 'N/A'}\n**Plan:** {data.shot_id or 'N/A'}\n**Version:** {data.version or 'N/A'}",
                    "inline": True
                },
                {
                    "name": "📁 Fichier",
                    "value": f"**Nom:** {data.file_name}\n**Taille:** {file_size_mb} MB",
                    "inline": True
                },
                {
                    "name": "⏰ Informations Tentative",
                    "value": f"**Tenté le:** {upload_time}\n**Statut:** {data.upload_status}",
                    "inline": False
                }
            ],
            "footer": {
                "text": "RL PostFlow - Intégration LucidLink → Frame.io",
                "icon_url": "https://cdn.discordapp.com/emojis/❌.png"
            },
            "timestamp": datetime.now().isoformat()
        }
        
        # Ajouter le message d'erreur si présent
        if data.error_message:
            embed["fields"].append({
                "name": "🚨 Erreur",
                "value": f"```{data.error_message}```",
                "inline": False
            })
        
        return embed
    
    def _create_processing_embed(self, data: FrameIONotificationData) -> Dict[str, Any]:
        """Crée l'embed Discord pour un traitement en cours"""
        
        # Formatage de la taille du fichier
        file_size_mb = round(data.file_size / (1024 * 1024), 2)
        
        # Formatage du timestamp
        upload_time = datetime.fromisoformat(data.upload_timestamp).strftime("%d/%m/%Y %H:%M:%S")
        
        # Couleur orange pour traitement
        embed = {
            "title": "⏳ Traitement Frame.io en Cours",
            "description": f"Le fichier **{data.file_name}** est en cours de traitement sur Frame.io",
            "color": 0xFFA500,  # Orange
            "fields": [
                {
                    "name": "📋 Informations du Plan",
                    "value": f"**Scène:** {data.scene_name}\n**Plan:** {data.shot_id}\n**Version:** {data.version}",
                    "inline": True
                },
                {
                    "name": "📁 Fichier",
                    "value": f"**Nom:** {data.file_name}\n**Taille:** {file_size_mb} MB\n**Nomenclature:** {data.nomenclature}",
                    "inline": True
                },
                {
                    "name": "⏰ Informations Upload",
                    "value": f"**Uploadé le:** {upload_time}\n**Statut:** {data.upload_status}",
                    "inline": False
                }
            ],
            "footer": {
                "text": "RL PostFlow - Le fichier sera disponible sous peu",
                "icon_url": "https://cdn.discordapp.com/emojis/⏳.png"
            },
            "timestamp": datetime.now().isoformat()
        }
        
        return embed
    
    def _send_discord_message(self, message: str, embed: Optional[Dict[str, Any]] = None) -> bool:
        """
        Envoie un message Discord.
        
        Args:
            message: Message principal
            embed: Embed Discord (optionnel)
            
        Returns:
            True si envoyé avec succès
        """
        try:
            payload = {
                "content": message,
                "username": self.bot_name,
                "avatar_url": self.avatar_url
            }
            
            if embed:
                payload["embeds"] = [embed]
            
            response = requests.post(self.webhook_url, json=payload)
            response.raise_for_status()
            
            logger.info(f"✅ Notification Discord envoyée: {message[:50]}...")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur envoi Discord: {e}")
            return False
    
    def send_batch_summary_notification(self, results: List[Dict[str, Any]]) -> bool:
        """
        Envoie un résumé de traitement par lot.
        
        Args:
            results: Liste des résultats d'upload
            
        Returns:
            True si envoyé avec succès
        """
        try:
            success_count = sum(1 for r in results if r and r.get('upload_status') == 'success')
            error_count = len(results) - success_count
            
            # Créer l'embed de résumé
            embed = {
                "title": "📊 Résumé Upload Frame.io",
                "description": f"Traitement par lot terminé",
                "color": 0x0099FF,  # Bleu
                "fields": [
                    {
                        "name": "📈 Statistiques",
                        "value": f"**Réussis:** {success_count}\n**Erreurs:** {error_count}\n**Total:** {len(results)}",
                        "inline": True
                    },
                    {
                        "name": "⏰ Traitement",
                        "value": f"**Terminé le:** {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}",
                        "inline": True
                    }
                ],
                "footer": {
                    "text": "RL PostFlow - Intégration LucidLink → Frame.io",
                    "icon_url": "https://cdn.discordapp.com/emojis/📊.png"
                },
                "timestamp": datetime.now().isoformat()
            }
            
            # Ajouter les détails des erreurs s'il y en a
            if error_count > 0:
                error_files = [r.get('file_name', 'Unknown') for r in results if r and r.get('upload_status') != 'success']
                embed["fields"].append({
                    "name": "❌ Fichiers en erreur",
                    "value": "\n".join(f"• {file}" for file in error_files[:5]),  # Max 5 fichiers
                    "inline": False
                })
            
            message = f"📊 **Résumé upload** - {success_count}/{len(results)} réussis"
            
            return self._send_discord_message(message, embed)
            
        except Exception as e:
            logger.error(f"Erreur notification résumé: {e}")
            return False
    
    @staticmethod
    def create_notification_data(upload_result: Dict[str, Any], file_path: str) -> FrameIONotificationData:
        """
        Crée les données de notification à partir d'un résultat d'upload.
        
        Args:
            upload_result: Résultat de l'upload Frame.io
            file_path: Chemin du fichier original
            
        Returns:
            Données de notification formatées
        """
        metadata = upload_result.get('metadata', {})
        
        return FrameIONotificationData(
            file_name=upload_result.get('file_name', Path(file_path).name),
            shot_id=metadata.get('shot_id', 'Unknown'),
            scene_name=metadata.get('scene_name', 'Unknown'),
            version=metadata.get('version', 'V001'),
            nomenclature=metadata.get('nomenclature', Path(file_path).stem),
            file_size=upload_result.get('file_size', 0),
            upload_status=upload_result.get('status', 'unknown'),
            review_link=upload_result.get('review_link', ''),
            folder_path=f"SCENES/{metadata.get('scene_name', 'Unknown')}/{metadata.get('shot_id', 'Unknown')}",
            upload_timestamp=upload_result.get('upload_timestamp', datetime.now().isoformat()),
            file_id=upload_result.get('file_id', ''),
            project_id=upload_result.get('project_id', ''),
            description=metadata.get('description'),
            tags=metadata.get('tags'),
            error_message=upload_result.get('error')
        )
