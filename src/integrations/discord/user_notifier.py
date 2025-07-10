#!/usr/bin/env python3
"""
🔔 Discord Notifications avec Users Google Sheets
=================================================

Système d'intégration pour utiliser les ID Discord des users depuis Google Sheets
dans les notifications Discord avec templates personnalisés.

Version: 4.1.1
Date: 10 juillet 2025
"""

import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from dataclasses import dataclass
import pytz

logger = logging.getLogger(__name__)

# Fuseau horaire Paris
PARIS_TZ = pytz.timezone('Europe/Paris')

def get_paris_time():
    """Retourne l'heure actuelle en fuseau horaire Paris"""
    return datetime.now(PARIS_TZ)


@dataclass
class NotificationTemplate:
    """Template de notification Discord"""
    title: str
    message: str
    color: int
    include_mention: bool = True
    include_thumbnail: bool = False
    fields: Optional[List[Dict[str, Any]]] = None


class DiscordUserNotifier:
    """
    Gestionnaire de notifications Discord avec intégration Google Sheets Users.
    """
    
    def __init__(self, discord_notifier, user_manager=None):
        """
        Initialiser le notifieur avec intégration users.
        
        Args:
            discord_notifier: Instance DiscordNotifier
            user_manager: SheetsUserManager pour récupérer les ID Discord
        """
        self.discord_notifier = discord_notifier
        self.user_manager = user_manager
        
        # Templates de notifications prédéfinis
        self.templates = {
            'upload_complete': NotificationTemplate(
                title="🎬 Upload Terminé",
                message="Le plan **{shot_name}** ({scene}) version {version} est prêt pour review !",
                color=0x00ff00,  # Vert
                include_mention=True,
                include_thumbnail=True,
                fields=[
                    {"name": "Frame.io", "value": "[Voir sur Frame.io]({frameio_link})", "inline": False},
                    {"name": "Statut", "value": "✅ Upload réussi", "inline": True},
                    {"name": "Timestamp", "value": "{timestamp}", "inline": True}
                ]
            ),
            'upload_failed': NotificationTemplate(
                title="❌ Échec Upload",
                message="Erreur lors de l'upload du plan **{shot_name}** ({scene})",
                color=0xff0000,  # Rouge
                include_mention=True,
                fields=[
                    {"name": "Erreur", "value": "{error_message}", "inline": False},
                    {"name": "Timestamp", "value": "{timestamp}", "inline": True}
                ]
            ),
            'shot_assigned': NotificationTemplate(
                title="📋 Plan Assigné",
                message="Le plan **{shot_name}** vous a été assigné !",
                color=0x0099ff,  # Bleu
                include_mention=True,
                fields=[
                    {"name": "Scène", "value": "{scene}", "inline": True},
                    {"name": "Priorité", "value": "{priority}", "inline": True},
                    {"name": "Deadline", "value": "{deadline}", "inline": True}
                ]
            ),
            'review_requested': NotificationTemplate(
                title="👁️ Review Demandée",
                message="Votre review est demandée pour le plan **{shot_name}**",
                color=0xff9900,  # Orange
                include_mention=True,
                include_thumbnail=True,
                fields=[
                    {"name": "Frame.io", "value": "[Voir sur Frame.io]({frameio_link})", "inline": False},
                    {"name": "Demandé par", "value": "{requested_by}", "inline": True}
                ]
            ),
            'scene_complete': NotificationTemplate(
                title="🎉 Scène Terminée",
                message="Félicitations ! La scène **{scene}** est terminée",
                color=0x9900ff,  # Violet
                include_mention=True,
                fields=[
                    {"name": "Plans terminés", "value": "{completed_shots_count}", "inline": True},
                    {"name": "Durée totale", "value": "{total_duration}", "inline": True}
                ]
            ),
            'error_alert': NotificationTemplate(
                title="⚠️ Alerte Système",
                message="Attention ! Erreur détectée dans le pipeline",
                color=0xff6600,  # Orange foncé
                include_mention=True,
                fields=[
                    {"name": "Module", "value": "{module}", "inline": True},
                    {"name": "Erreur", "value": "{error_message}", "inline": False},
                    {"name": "Action requise", "value": "{action_required}", "inline": False}
                ]
            )
        }
    
    def get_user_discord_id(self, user_identifier: str) -> Optional[str]:
        """
        Récupérer l'ID Discord d'un utilisateur.
        
        Args:
            user_identifier: Nom ou email de l'utilisateur
            
        Returns:
            str: ID Discord ou None si non trouvé
        """
        if not self.user_manager:
            logger.warning("⚠️ UserManager non disponible pour récupérer ID Discord")
            return None
        
        try:
            # Essayer par nom d'abord
            user = self.user_manager.get_user_by_name(user_identifier)
            if user and user.discord_id:
                return user.discord_id
            
            # Si pas trouvé, essayer de chercher par email
            all_users = self.user_manager.get_all_users()
            for user in all_users:
                if user.email and user.email.lower() == user_identifier.lower():
                    return user.discord_id
            
            logger.warning(f"⚠️ ID Discord non trouvé pour: {user_identifier}")
            return None
            
        except Exception as e:
            logger.error(f"❌ Erreur récupération ID Discord: {e}")
            return None
    
    def send_templated_notification(self, template_name: str, user_identifier: str = None, 
                                   data: Dict[str, Any] = None) -> bool:
        """
        Envoyer une notification avec template prédéfini.
        
        Args:
            template_name: Nom du template à utiliser
            user_identifier: Nom/email de l'utilisateur à mentionner
            data: Données pour remplir le template
            
        Returns:
            bool: True si envoyé avec succès
        """
        try:
            if template_name not in self.templates:
                logger.error(f"❌ Template '{template_name}' non trouvé")
                return False
            
            template = self.templates[template_name]
            data = data or {}
            
            # Récupérer l'ID Discord si utilisateur spécifié
            discord_id = None
            if user_identifier and template.include_mention:
                discord_id = self.get_user_discord_id(user_identifier)
            
            # Formater le message
            try:
                formatted_message = template.message.format(**data)
            except KeyError as e:
                logger.warning(f"⚠️ Données manquantes pour le template: {e}")
                formatted_message = template.message
            
            # Préparer l'embed
            embed = {
                "title": template.title,
                "description": formatted_message,
                "color": template.color,
                "timestamp": get_paris_time().isoformat(),
                "fields": []
            }
            
            # Ajouter les champs du template
            if template.fields:
                for field in template.fields:
                    try:
                        formatted_field = {
                            "name": field["name"],
                            "value": field["value"].format(**data),
                            "inline": field.get("inline", False)
                        }
                        embed["fields"].append(formatted_field)
                    except KeyError:
                        # Ignorer les champs avec données manquantes
                        continue
            
            # Ajouter thumbnail si demandé
            if template.include_thumbnail and data.get('thumbnail_url'):
                embed["thumbnail"] = {"url": data['thumbnail_url']}
            
            # Construire le message de contenu
            content_parts = []
            if discord_id and template.include_mention:
                content_parts.append(f"<@{discord_id}>")
            
            content = " ".join(content_parts) if content_parts else None
            
            # Envoyer la notification
            return self.discord_notifier.send_message(content, embed)
            
        except Exception as e:
            logger.error(f"❌ Erreur envoi notification template: {e}")
            return False
    
    def notify_upload_complete(self, shot_name: str, scene: str, version: str,
                              frameio_link: str, assigned_user: str = None,
                              thumbnail_url: str = None) -> bool:
        """
        Notifier qu'un upload est terminé.
        """
        data = {
            'shot_name': shot_name,
            'scene': scene,
            'version': version,
            'frameio_link': frameio_link,
            'timestamp': get_paris_time().strftime("%d/%m/%Y %H:%M"),
            'thumbnail_url': thumbnail_url
        }
        
        return self.send_templated_notification('upload_complete', assigned_user, data)
    
    def notify_upload_failed(self, shot_name: str, scene: str, error_message: str,
                            assigned_user: str = None) -> bool:
        """
        Notifier qu'un upload a échoué.
        """
        data = {
            'shot_name': shot_name,
            'scene': scene,
            'error_message': error_message,
            'timestamp': get_paris_time().strftime("%d/%m/%Y %H:%M")
        }
        
        return self.send_templated_notification('upload_failed', assigned_user, data)
    
    def notify_shot_assigned(self, shot_name: str, scene: str, assigned_user: str,
                            priority: str = "Normal", deadline: str = "TBD") -> bool:
        """
        Notifier qu'un plan a été assigné.
        """
        data = {
            'shot_name': shot_name,
            'scene': scene,
            'priority': priority,
            'deadline': deadline
        }
        
        return self.send_templated_notification('shot_assigned', assigned_user, data)
    
    def notify_review_requested(self, shot_name: str, frameio_link: str, 
                               reviewer: str, requested_by: str,
                               thumbnail_url: str = None) -> bool:
        """
        Notifier qu'une review est demandée.
        """
        data = {
            'shot_name': shot_name,
            'frameio_link': frameio_link,
            'requested_by': requested_by,
            'thumbnail_url': thumbnail_url
        }
        
        return self.send_templated_notification('review_requested', reviewer, data)
    
    def notify_scene_complete(self, scene: str, completed_shots_count: int,
                             total_duration: str, team_members: List[str] = None) -> bool:
        """
        Notifier qu'une scène est terminée.
        """
        data = {
            'scene': scene,
            'completed_shots_count': completed_shots_count,
            'total_duration': total_duration
        }
        
        # Notifier tous les membres de l'équipe
        success = True
        if team_members:
            for member in team_members:
                result = self.send_templated_notification('scene_complete', member, data)
                success = success and result
        else:
            # Notification générale sans mention
            result = self.send_templated_notification('scene_complete', None, data)
            success = success and result
        
        return success
    
    def notify_error_alert(self, module: str, error_message: str, 
                          action_required: str, admin_users: List[str] = None) -> bool:
        """
        Notifier une alerte d'erreur système.
        """
        data = {
            'module': module,
            'error_message': error_message,
            'action_required': action_required
        }
        
        # Notifier les administrateurs
        success = True
        if admin_users:
            for admin in admin_users:
                result = self.send_templated_notification('error_alert', admin, data)
                success = success and result
        else:
            # Notification générale
            result = self.send_templated_notification('error_alert', None, data)
            success = success and result
        
        return success
    
    def add_custom_template(self, name: str, template: NotificationTemplate):
        """
        Ajouter un template personnalisé.
        
        Args:
            name: Nom du template
            template: Template à ajouter
        """
        self.templates[name] = template
        logger.info(f"✅ Template '{name}' ajouté")
    
    def list_templates(self) -> List[str]:
        """
        Lister tous les templates disponibles.
        
        Returns:
            List[str]: Noms des templates
        """
        return list(self.templates.keys())

    # Méthodes asynchrones pour l'intégration avec le pipeline
    
    async def notify_file_processed(self, file_path, frameio_link: str = None, 
                                   user_identifier: str = None, thumbnail_url: str = None) -> bool:
        """
        Notification asynchrone de fichier traité.
        
        Args:
            file_path: Chemin du fichier ou objet Path
            frameio_link: Lien Frame.io optionnel
            user_identifier: Identifiant utilisateur pour mention
            thumbnail_url: URL du thumbnail
            
        Returns:
            bool: Succès de l'envoi
        """
        try:
            file_name = file_path.name if hasattr(file_path, 'name') else str(file_path)
            
            template_data = {
                'file_name': file_name,
                'frameio_link': frameio_link,
                'thumbnail_url': thumbnail_url,
                'timestamp': get_paris_time().strftime('%H:%M')
            }
            
            # Template pour fichier traité
            template = NotificationTemplate(
                title="🎬 Fichier traité avec succès !",
                message=f"📁 **Fichier**: {file_name}",
                color=0x00FF00,  # Vert
                fields=[]
            )
            
            if frameio_link:
                template.fields.append({
                    "name": "🔗 Frame.io",
                    "value": f"[Voir sur Frame.io]({frameio_link})",
                    "inline": False
                })
            
            if thumbnail_url:
                template.fields.append({
                    "name": "🖼️ Aperçu",
                    "value": f"[Thumbnail]({thumbnail_url})",
                    "inline": False
                })
            
            # Récupérer l'ID Discord si utilisateur spécifié
            discord_id = self.get_user_discord_id(user_identifier) if user_identifier else None
            
            return await self._send_notification_async(template, discord_id)
            
        except Exception as e:
            logger.error(f"❌ Erreur notification fichier traité: {e}")
            return False
    
    async def send_system_notification(self, title: str, message: str, 
                                     user_identifier: str = None) -> bool:
        """
        Notification système asynchrone.
        
        Args:
            title: Titre de la notification
            message: Message de la notification
            user_identifier: Identifiant utilisateur pour mention
            
        Returns:
            bool: Succès de l'envoi
        """
        try:
            template = NotificationTemplate(
                title=title,
                message=message,
                color=0x0099FF,  # Bleu
                fields=[]
            )
            
            discord_id = self.get_user_discord_id(user_identifier) if user_identifier else None
            
            return await self._send_notification_async(template, discord_id)
            
        except Exception as e:
            logger.error(f"❌ Erreur notification système: {e}")
            return False
    
    async def send_pipeline_report(self, stats: Dict[str, Any]) -> bool:
        """
        Rapport de pipeline asynchrone.
        
        Args:
            stats: Statistiques du pipeline
            
        Returns:
            bool: Succès de l'envoi
        """
        try:
            total = stats.get('total_shots', 0)
            completed = stats.get('completed_shots', 0)
            failed = stats.get('failed_shots', 0)
            pending = stats.get('pending_shots', 0)
            success_rate = stats.get('upload_success_rate', 0)
            
            template = NotificationTemplate(
                title="📊 Rapport de Pipeline RL PostFlow",
                message="📈 **Statistiques**:",
                color=0xFF9900,  # Orange
                fields=[
                    {
                        "name": "📊 Total",
                        "value": f"{total} plans",
                        "inline": True
                    },
                    {
                        "name": "✅ Terminés",
                        "value": f"{completed} plans",
                        "inline": True
                    },
                    {
                        "name": "❌ Échoués",
                        "value": f"{failed} plans",
                        "inline": True
                    },
                    {
                        "name": "⏳ En attente",
                        "value": f"{pending} plans",
                        "inline": True
                    },
                    {
                        "name": "🎯 Taux de succès",
                        "value": f"{success_rate:.1f}%",
                        "inline": True
                    }
                ]
            )
            
            return await self._send_notification_async(template)
            
        except Exception as e:
            logger.error(f"❌ Erreur rapport pipeline: {e}")
            return False
    
    async def notify_upload_complete_async(self, file_name: str, frameio_link: str = None,
                                         user_identifier: str = None, additional_info: str = None) -> bool:
        """
        Notification d'upload terminé (asynchrone).
        
        Args:
            file_name: Nom du fichier
            frameio_link: Lien Frame.io
            user_identifier: Identifiant utilisateur pour mention
            additional_info: Information additionnelle
            
        Returns:
            bool: Succès de l'envoi
        """
        try:
            template = NotificationTemplate(
                title="✅ Upload terminé !",
                message=f"📄 **Fichier**: {file_name}",
                color=0x00FF00,  # Vert
                fields=[]
            )
            
            if additional_info:
                template.fields.append({
                    "name": "🎯 Détails",
                    "value": additional_info,
                    "inline": False
                })
            
            if frameio_link:
                template.fields.append({
                    "name": "🔗 Frame.io",
                    "value": f"[Accéder au fichier]({frameio_link})",
                    "inline": False
                })
            
            discord_id = self.get_user_discord_id(user_identifier) if user_identifier else None
            
            return await self._send_notification_async(template, discord_id)
            
        except Exception as e:
            logger.error(f"❌ Erreur notification upload: {e}")
            return False
    
    async def notify_error(self, error_type: str, file_path = None, 
                          error_message: str = None, user_identifier: str = None) -> bool:
        """
        Notification d'erreur asynchrone.
        
        Args:
            error_type: Type d'erreur
            file_path: Chemin du fichier concerné
            error_message: Message d'erreur détaillé
            user_identifier: Identifiant utilisateur pour mention
            
        Returns:
            bool: Succès de l'envoi
        """
        try:
            template = NotificationTemplate(
                title=f"❌ Erreur: {error_type}",
                message="🚨 **Intervention requise**",
                color=0xFF0000,  # Rouge
                fields=[]
            )
            
            if file_path:
                file_name = file_path.name if hasattr(file_path, 'name') else str(file_path)
                template.fields.append({
                    "name": "📁 Fichier",
                    "value": file_name,
                    "inline": False
                })
            
            if error_message:
                template.fields.append({
                    "name": "🚨 Erreur",
                    "value": error_message[:500],  # Limiter la longueur
                    "inline": False
                })
            
            discord_id = self.get_user_discord_id(user_identifier) if user_identifier else None
            
            return await self._send_notification_async(template, discord_id)
            
        except Exception as e:
            logger.error(f"❌ Erreur notification erreur: {e}")
            return False
    
    async def _send_notification_async(self, template: NotificationTemplate, 
                                     discord_id: str = None) -> bool:
        """
        Envoie une notification de façon asynchrone.
        
        Args:
            template: Template de notification
            discord_id: ID Discord pour mention
            
        Returns:
            bool: Succès de l'envoi
        """
        import asyncio
        
        try:
            # Construire le message
            message_parts = [template.message]
            
            if discord_id:
                message_parts.append(f"Hey <@{discord_id}> 👋")
            
            message = "\n\n".join(message_parts)
            
            # Construire l'embed avec timestamp Paris
            embed = {
                "title": template.title,
                "description": message,
                "color": template.color,
                "timestamp": get_paris_time().isoformat(),
                "fields": template.fields or []
            }
            
            # Exécuter la notification de façon asynchrone
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None, 
                self.discord_notifier.send_message,
                "",  # Message vide car on utilise l'embed
                embed
            )
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Erreur envoi notification async: {e}")
            return False
    
    def get_available_templates(self) -> List[str]:
        """
        Retourne la liste des templates disponibles.
        
        Returns:
            List[str]: Noms des templates
        """
        base_templates = [
            'notify_file_processed',
            'send_system_notification', 
            'send_pipeline_report',
            'notify_upload_complete_async',
            'notify_error'
        ]
        
        custom_templates = list(self.templates.keys())
        
        return base_templates + custom_templates
