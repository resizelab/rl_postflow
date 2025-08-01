#!/usr/bin/env python3
"""
🔗 Auto Hooks - Système de hooks automatiques
=============================================

Hooks automatiques pour Google Sheets, Discord et autres intégrations.
S'abonne aux événements et gère les mises à jour automatiquement.

Version: 4.2.0
Date: 31 juillet 2025
"""

import asyncio
import json
import logging
import os
from typing import Dict, Any, Optional
from datetime import datetime
from pathlib import Path

from src.utils.event_manager import event_manager, EventType, Event

logger = logging.getLogger(__name__)


class GoogleSheetsHook:
    """Hook automatique pour Google Sheets"""
    
    def __init__(self, sheets_tracker=None):
        self.sheets_tracker = sheets_tracker
        self.enabled = sheets_tracker is not None
        
        if self.enabled:
            # S'abonner aux événements pertinents
            event_manager.subscribe(EventType.STATUS_CHANGED, self.on_status_changed, priority=10)
            event_manager.subscribe(EventType.UPLOAD_COMPLETED, self.on_upload_completed, priority=10)
            event_manager.subscribe(EventType.FRAMEIO_COMMENT_RECEIVED, self.on_frameio_comment, priority=10)
            event_manager.subscribe(EventType.REVIEW_STATUS_CHANGED, self.on_review_status_changed, priority=10)
            
            logger.info("✅ Google Sheets Hook activé")
        else:
            logger.warning("⚠️ Google Sheets Hook désactivé (pas de tracker)")
    
    async def on_status_changed(self, event: Event):
        """Réagit aux changements de statut"""
        if not self.enabled:
            return
        
        try:
            data = event.data
            shot_name = data.get('shot_name')
            version = data.get('version', '')
            status = data.get('status')
            frameio_link = data.get('frameio_link')
            comment = data.get('comment')
            
            if shot_name and status:
                shot_info = f"{shot_name} {version}" if version else shot_name
                logger.info(f"📊 [Sheets Hook] Mise à jour statut: {shot_info} -> {status}")
                
                if hasattr(self.sheets_tracker, 'update_shot_status'):
                    await self.sheets_tracker.update_shot_status(
                        nomenclature=shot_name,  # Utiliser nomenclature au lieu de shot_id
                        status=status,
                        additional_data={
                            'frameio_link': frameio_link,
                            'comment': comment
                        }
                    )
                else:
                    logger.warning("⚠️ sheets_tracker.update_shot_status non disponible")
                    
        except Exception as e:
            logger.error(f"❌ [Sheets Hook] Erreur mise à jour statut: {e}")
    
    async def on_upload_completed(self, event: Event):
        """Réagit aux uploads terminés"""
        if not self.enabled:
            return
        
        try:
            data = event.data
            shot_name = data.get('shot_name')
            version = data.get('version', '')
            frameio_link = data.get('frameio_link')
            thumbnail_url = data.get('thumbnail_url')
            
            if shot_name:
                shot_info = f"{shot_name} {version}" if version else shot_name
                logger.info(f"📊 [Sheets Hook] Upload terminé: {shot_info}")
                
                # Mettre à jour avec les liens
                if hasattr(self.sheets_tracker, 'update_shot_status'):
                    await self.sheets_tracker.update_shot_status(
                        nomenclature=shot_name,  # Utiliser nomenclature au lieu de shot_id
                        status="UPLOADED",
                        additional_data={
                            'frameio_link': frameio_link,
                            'thumbnail_url': thumbnail_url
                        }
                    )
                    
        except Exception as e:
            logger.error(f"❌ [Sheets Hook] Erreur upload terminé: {e}")
    
    async def on_frameio_comment(self, event: Event):
        """Réagit aux commentaires Frame.io avec logique intelligente"""
        if not self.enabled:
            return
        
        try:
            data = event.data
            shot_name = data.get('shot_name')
            version = data.get('version', '')
            comment_text = data.get('comment_text')
            review_status = data.get('review_status')
            
            if shot_name and comment_text:
                shot_info = f"{shot_name} {version}" if version else shot_name
                logger.info(f"📊 [Sheets Hook] Commentaire Frame.io: {shot_info}")
                
                # Logique intelligente pour déterminer le statut selon les commentaires
                intelligent_status = self._analyze_comment_status(comment_text, review_status)
                
                # Mettre à jour avec le commentaire et le statut intelligent
                if hasattr(self.sheets_tracker, 'update_shot_status'):
                    await self.sheets_tracker.update_shot_status(
                        nomenclature=shot_name,
                        status=intelligent_status,
                        additional_data={
                            'comment': comment_text,
                            'original_status': review_status
                        }
                    )
                    
        except Exception as e:
            logger.error(f"❌ [Sheets Hook] Erreur commentaire Frame.io: {e}")
    
    def _analyze_comment_status(self, comment_text: str, review_status: str = None) -> str:
        """
        Analyse intelligente du statut basée sur les commentaires
        
        Logique:
        - Pas de commentaire → NEED_REVIEW
        - Premier commentaire simple → APPROVED  
        - Commentaires supplémentaires → NEED_REWORK
        """
        if not comment_text or comment_text.strip() == "":
            return "NEED_REVIEW"
        
        # Mots clés positifs (validation)
        positive_keywords = [
            'ok', 'validé', 'parfait', 'excellent', 'bien', 'good', 'approved', 'approve',
            'valide', 'nickel', 'super', 'bravo', 'top', 'ça marche', 'c\'est bon',
            'validated', 'accepted', 'great', 'perfect'
        ]
        
        # Mots clés négatifs (modifications nécessaires)
        negative_keywords = [
            'modif', 'modification', 'change', 'corriger', 'correction', 'problème', 
            'problem', 'issue', 'fix', 'revoir', 'refaire', 'à retravailler',
            'pas bon', 'incorrect', 'erreur', 'error', 'wrong', 'redo', 'revise'
        ]
        
        comment_lower = comment_text.lower()
        
        # Vérifier les mots clés négatifs en premier (priorité) - recherche par mots entiers
        has_negative = any(f' {keyword} ' in f' {comment_lower} ' or 
                          comment_lower.startswith(f'{keyword} ') or 
                          comment_lower.endswith(f' {keyword}') or 
                          comment_lower == keyword 
                          for keyword in negative_keywords)
        if has_negative:
            logger.info(f"🔄 [Sheets Hook] Commentaire négatif détecté: NEED_REWORK")
            return "NEED_REWORK"
        
        # Vérifier les mots clés positifs - recherche par mots entiers
        has_positive = any(f' {keyword} ' in f' {comment_lower} ' or 
                          comment_lower.startswith(f'{keyword} ') or 
                          comment_lower.endswith(f' {keyword}') or 
                          comment_lower == keyword 
                          for keyword in positive_keywords)
        if has_positive:
            logger.info(f"✅ [Sheets Hook] Commentaire positif détecté: APPROVED")
            return "APPROVED"
        
        # Commentaire neutre/long = besoin de review supplémentaire
        logger.info(f"⏳ [Sheets Hook] Commentaire neutre détecté: NEED_REVIEW")
        return "NEED_REVIEW"
    
    async def on_review_status_changed(self, event: Event):
        """Réagit aux changements de statut de review"""
        if not self.enabled:
            return
        
        try:
            data = event.data
            shot_name = data.get('shot_name')
            review_status = data.get('review_status')
            comment = data.get('comment')
            
            if shot_name and review_status:
                logger.info(f"📊 [Sheets Hook] Statut review: {shot_name} -> {review_status}")
                
                if hasattr(self.sheets_tracker, 'update_shot_status'):
                    await self.sheets_tracker.update_shot_status(
                        nomenclature=shot_name,  # Utiliser nomenclature au lieu de shot_id
                        status=review_status,
                        additional_data={
                            'comment': comment
                        }
                    )
                    
        except Exception as e:
            logger.error(f"❌ [Sheets Hook] Erreur statut review: {e}")


class DiscordHook:
    """Hook automatique pour Discord"""
    
    def __init__(self, discord_notifier=None, user_notifier=None, config_manager=None):
        self.discord_notifier = discord_notifier
        self.user_notifier = user_notifier
        self.config_manager = config_manager  # Nouveau: pour accéder à la config Frame.io
        self.enabled = discord_notifier is not None or user_notifier is not None
        
        if self.enabled:
            # S'abonner aux événements pertinents
            event_manager.subscribe(EventType.FILE_PROCESSING_COMPLETED, self.on_file_processed, priority=5)
            event_manager.subscribe(EventType.FILE_PROCESSING_FAILED, self.on_file_failed, priority=5)
            event_manager.subscribe(EventType.FRAMEIO_COMMENT_RECEIVED, self.on_frameio_comment, priority=5)
            event_manager.subscribe(EventType.REVIEW_STATUS_CHANGED, self.on_review_status_changed, priority=5)
            event_manager.subscribe(EventType.PIPELINE_STARTED, self.on_pipeline_started, priority=5)
            event_manager.subscribe(EventType.PIPELINE_STOPPED, self.on_pipeline_stopped, priority=5)
            event_manager.subscribe(EventType.ERROR_OCCURRED, self.on_error, priority=5)
            
            logger.info("✅ Discord Hook activé")
        else:
            logger.warning("⚠️ Discord Hook désactivé (pas de notifier)")
    
    async def on_file_processed(self, event: Event):
        """Notifie quand un fichier est traité"""
        if not self.enabled:
            return
        
        try:
            data = event.data
            file_name = data.get('file_name', 'Fichier inconnu')
            frameio_link = data.get('frameio_link')
            thumbnail_url = data.get('thumbnail_url')
            shot_name = data.get('shot_name')
            
            logger.info(f"🎬 [Discord Hook] Fichier traité: {file_name}")
            
            # Utiliser user_notifier en priorité
            notifier = self.user_notifier or self.discord_notifier
            
            if self.user_notifier and hasattr(self.user_notifier, 'notify_file_processed'):
                # Notification avec mention utilisateur si possible
                from pathlib import Path
                await self.user_notifier.notify_file_processed(
                    file_path=Path(file_name),
                    frameio_link=frameio_link,
                    thumbnail_url=thumbnail_url
                )
            elif self.discord_notifier:
                # Notification standard
                message = f"🎬 Fichier traité: {file_name}"
                if frameio_link:
                    message += f"\n🔗 Frame.io: {frameio_link}"
                
                if hasattr(self.discord_notifier, 'notify_file_processed'):
                    self.discord_notifier.notify_file_processed(
                        file_name, message, frameio_link, thumbnail_url
                    )
                else:
                    self.discord_notifier.notify_system_status("Fichier traité", message)
                    
        except Exception as e:
            logger.error(f"❌ [Discord Hook] Erreur notification fichier traité: {e}")
    
    async def on_file_failed(self, event: Event):
        """Notifie quand un fichier échoue"""
        if not self.enabled:
            return
        
        try:
            data = event.data
            file_name = data.get('file_name', 'Fichier inconnu')
            error = data.get('error', 'Erreur inconnue')
            
            logger.info(f"❌ [Discord Hook] Fichier échoué: {file_name}")
            
            notifier = self.user_notifier or self.discord_notifier
            
            message = f"❌ Échec traitement: {file_name}\n🔍 Erreur: {error}"
            
            if self.user_notifier and hasattr(self.user_notifier, 'send_system_notification'):
                await self.user_notifier.send_system_notification("Erreur de traitement", message)
            elif self.discord_notifier:
                self.discord_notifier.notify_system_status("Erreur de traitement", message)
                
        except Exception as e:
            logger.error(f"❌ [Discord Hook] Erreur notification échec: {e}")
    
    async def on_frameio_comment(self, event: Event):
        """Notifie les commentaires Frame.io avec format moderne et liens de partage"""
        if not self.enabled:
            return
        
        try:
            from src.integrations.discord.comment_notifier_v2 import ModernCommentNotifier
            from src.integrations.frameio.share_manager import create_share_manager_from_config
            
            data = event.data
            upload_id = data.get('upload_id')
            shot_name = data.get('shot_name')
            comment_text = data.get('comment_text')
            review_status = data.get('review_status')
            commenter = data.get('commenter', 'Utilisateur')
            timecode = data.get('timecode')
            file_id = data.get('file_id')  # ID du fichier commenté (utiliser celui-ci directement)
            
            # Analyse intelligente du statut (conserver logique existante)
            intelligent_status = self._analyze_comment_for_discord(comment_text, review_status)
            
            # Vérifier si nous avons déjà notifié récemment pour ce même statut
            # Cache basé sur upload_id + status pour éviter les doublons
            cache_key = f"{upload_id}_{intelligent_status}"
            if not hasattr(self, '_comment_notification_cache'):
                self._comment_notification_cache = {}
            
            from datetime import datetime, timedelta
            now = datetime.now()
            
            # Si une notification avec le même statut a été envoyée dans les 5 dernières minutes, ignorer
            if cache_key in self._comment_notification_cache:
                last_notification = self._comment_notification_cache[cache_key]
                if now - last_notification < timedelta(minutes=5):
                    logger.info(f"⏭️ [Discord Hook] Notification dupliquée ignorée pour {shot_name} ({intelligent_status})")
                    return
            
            logger.info(f"🎯 Utilisation du file_id du fichier commenté: {file_id[:12] if file_id else 'None'}... pour {shot_name}")
            logger.info(f"💬 [Discord Hook] Commentaire Frame.io moderne: {shot_name}")
            
            # Initialiser le gestionnaire de partage Frame.io
            share_manager = None
            try:
                if hasattr(self, 'config_manager'):
                    config = self.config_manager.get_config()
                    share_manager = create_share_manager_from_config(config)
                    if share_manager:
                        logger.info("🔗 Gestionnaire de partage Frame.io initialisé")
            except Exception as e:
                logger.warning(f"⚠️ Impossible d'initialiser le gestionnaire de partage: {e}")
            
            # Initialiser le notificateur moderne avec support shares
            if hasattr(self, 'discord_notifier') and self.discord_notifier:
                webhook_url = getattr(self.discord_notifier, 'webhook_url', None)
                if webhook_url:
                    modern_notifier = ModernCommentNotifier(
                        webhook_url=webhook_url, 
                        bot_name="PostFlow",
                        share_manager=share_manager
                    )
                    
                    # Envoyer notification moderne avec liens de partage
                    success = modern_notifier.send_comment_notification(
                        shot_name=shot_name,
                        commenter=commenter,
                        comment_text=comment_text,
                        review_status=intelligent_status,
                        frameio_link=data.get('frameio_link'),  # Lien de fallback
                        timecode=timecode,
                        file_id=file_id  # Utiliser le file_id du fichier commenté
                    )
                    
                    if success:
                        logger.info(f"✅ [Discord Hook] Notification moderne envoyée: {shot_name}")
                        if share_manager:
                            logger.info(f"� [Discord Hook] Lien de partage utilisé pour {shot_name}")
                    else:
                        logger.error(f"❌ [Discord Hook] Échec notification moderne: {shot_name}")
                        # Fallback vers ancien format si échec
                        await self._fallback_old_notification(data, intelligent_status)
                else:
                    logger.warning("⚠️ [Discord Hook] Webhook URL manquante, fallback ancien format")
                    await self._fallback_old_notification(data, intelligent_status)
            else:
                logger.warning("⚠️ [Discord Hook] Discord notifier manquant, fallback ancien format")
                await self._fallback_old_notification(data, intelligent_status)
                
        except Exception as e:
            logger.error(f"❌ [Discord Hook] Erreur notification moderne avec shares: {e}")
            # En cas d'erreur, fallback vers l'ancien format
            try:
                await self._fallback_old_notification(event.data, 'NEED_REVIEW')
            except:
                pass

    async def _fallback_old_notification(self, data: dict, intelligent_status: str):
        """Fallback vers l'ancien format en cas de problème (version améliorée)"""
        shot_name = data.get('shot_name')
        comment_text = data.get('comment_text', '')
        commenter = data.get('commenter', 'Utilisateur')
        
        # Format simplifié mais moderne
        status_emoji = {
            'APPROVED': '✅',
            'NEED_REWORK': '🔄', 
            'NEED_REVIEW': '⏳',
            'REJECTED': '❌'
        }.get(intelligent_status, '💬')
        
        # Message compact style nouveau format
        message = f"{status_emoji} **{shot_name}** · {commenter}"
        message += f"\n💬 {comment_text[:100]}{'...' if len(comment_text) > 100 else ''}"
        
        if self.user_notifier and hasattr(self.user_notifier, 'send_system_notification'):
            await self.user_notifier.send_system_notification("Commentaire Frame.io", message)
        elif self.discord_notifier:
            self.discord_notifier.notify_system_status("Commentaire Frame.io", message)
    
    def _analyze_comment_for_discord(self, comment_text: str, review_status: str = None) -> str:
        """Analyse rapide pour Discord (même logique que Google Sheets)"""
        if not comment_text or comment_text.strip() == "":
            return "NEED_REVIEW"
        
        positive_keywords = ['ok', 'validé', 'parfait', 'excellent', 'bien', 'good', 'approved', 'approve', 'valide', 'nickel', 'super', 'bravo', 'top']
        negative_keywords = ['modif', 'modification', 'change', 'corriger', 'correction', 'problème', 'problem', 'issue', 'fix', 'revoir', 'refaire']
        
        comment_lower = comment_text.lower()
        
        # Vérifier les mots clés négatifs en premier (priorité) - recherche par mots entiers
        has_negative = any(f' {keyword} ' in f' {comment_lower} ' or 
                          comment_lower.startswith(f'{keyword} ') or 
                          comment_lower.endswith(f' {keyword}') or 
                          comment_lower == keyword 
                          for keyword in negative_keywords)
        if has_negative:
            return "NEED_REWORK"
            
        # Vérifier les mots clés positifs - recherche par mots entiers  
        has_positive = any(f' {keyword} ' in f' {comment_lower} ' or 
                          comment_lower.startswith(f'{keyword} ') or 
                          comment_lower.endswith(f' {keyword}') or 
                          comment_lower == keyword 
                          for keyword in positive_keywords)
        if has_positive:
            return "APPROVED" 
        else:
            return "NEED_REVIEW"
    
    async def on_review_status_changed(self, event: Event):
        """Notifie les changements de statut de review"""
        if not self.enabled:
            return
        
        try:
            data = event.data
            shot_name = data.get('shot_name')
            review_status = data.get('review_status')
            old_status = data.get('old_status')
            
            if review_status == old_status:
                return  # Pas de changement
            
            logger.info(f"🔄 [Discord Hook] Statut review: {shot_name} -> {review_status}")
            
            # Émoji selon le nouveau statut
            status_emoji = {
                'APPROVED': '✅',
                'REJECTED': '❌',
                'NEED_REWORK': '🔄',
                'PENDING': '⏳'
            }.get(review_status, '📝')
            
            status_text = {
                'APPROVED': 'Approuvé',
                'REJECTED': 'Rejeté',
                'NEED_REWORK': 'Retravail demandé',
                'PENDING': 'En attente'
            }.get(review_status, review_status)
            
            message = f"{status_emoji} **{shot_name}** - {status_text}"
            if old_status:
                message += f"\n🔄 Changement: {old_status} → {review_status}"
            
            notifier = self.user_notifier or self.discord_notifier
            
            if self.user_notifier and hasattr(self.user_notifier, 'send_system_notification'):
                await self.user_notifier.send_system_notification("Statut Review", message)
            elif self.discord_notifier:
                self.discord_notifier.notify_system_status("Statut Review", message)
                
        except Exception as e:
            logger.error(f"❌ [Discord Hook] Erreur notification statut review: {e}")
    
    async def on_pipeline_started(self, event: Event):
        """Notifie le démarrage du pipeline"""
        if not self.enabled:
            return
        
        try:
            data = event.data
            version = data.get('version', 'Unknown')
            
            message = f"🚀 PostFlow v{version} démarré\nLe pipeline de traitement est maintenant actif"
            
            notifier = self.user_notifier or self.discord_notifier
            
            if self.user_notifier and hasattr(self.user_notifier, 'send_system_notification'):
                await self.user_notifier.send_system_notification("Pipeline démarré", message)
            elif self.discord_notifier:
                self.discord_notifier.notify_system_status("Pipeline démarré", message)
                
        except Exception as e:
            logger.error(f"❌ [Discord Hook] Erreur notification démarrage: {e}")
    
    async def on_pipeline_stopped(self, event: Event):
        """Notifie l'arrêt du pipeline"""
        if not self.enabled:
            return
        
        try:
            data = event.data
            version = data.get('version', 'Unknown')
            
            message = f"🛑 PostFlow v{version} arrêté\nLe pipeline de traitement a été arrêté"
            
            notifier = self.user_notifier or self.discord_notifier
            
            if self.user_notifier and hasattr(self.user_notifier, 'send_system_notification'):
                await self.user_notifier.send_system_notification("Pipeline arrêté", message)
            elif self.discord_notifier:
                self.discord_notifier.notify_system_status("Pipeline arrêté", message)
                
        except Exception as e:
            logger.error(f"❌ [Discord Hook] Erreur notification arrêt: {e}")
    
    async def on_error(self, event: Event):
        """Notifie les erreurs importantes"""
        if not self.enabled:
            return
        
        try:
            data = event.data
            error_message = data.get('error', 'Erreur inconnue')
            component = data.get('component', 'Système')
            
            message = f"⚠️ Erreur {component}\n🔍 {error_message}"
            
            notifier = self.user_notifier or self.discord_notifier
            
            if self.user_notifier and hasattr(self.user_notifier, 'send_system_notification'):
                await self.user_notifier.send_system_notification("Erreur système", message)
            elif self.discord_notifier:
                self.discord_notifier.notify_system_status("Erreur système", message)
                
        except Exception as e:
            logger.error(f"❌ [Discord Hook] Erreur notification erreur: {e}")


class FrameioVideoHook:
    """Hook automatique pour les vidéos Frame.io → Discord MP4"""
    
    def __init__(self, frameio_api=None, discord_config=None):
        self.frameio_api = frameio_api
        self.discord_config = discord_config
        self.enabled = frameio_api is not None and discord_config is not None
        
        if self.enabled:
            # S'abonner au file.ready Frame.io
            event_manager.subscribe(EventType.FRAMEIO_FILE_READY, self.on_file_ready, priority=3)
            logger.info("✅ Frame.io Video Hook activé")
        else:
            logger.warning("⚠️ Frame.io Video Hook désactivé (API ou config manquante)")
    
    async def on_file_ready(self, event: Event):
        """Quand Frame.io termine l'encoding d'une vidéo, poster MP4 sur Discord"""
        if not self.enabled:
            return
        
        try:
            data = event.data
            file_id = data.get('file_id')
            filename = data.get('filename', 'video.mp4')
            frameio_link = data.get('frameio_link', '')
            
            logger.info(f"🎬 [Video Hook] Frame.io file.ready: {filename}")
            
            # Récupérer les media_links directement depuis le webhook (plus rapide!)
            media_links = data.get('media_links', {})
            
            if not media_links or len(media_links) == 0:
                logger.warning(f"⚠️ Aucun media_links dans le webhook pour {filename}")
                return
            
            logger.info(f"✅ [Video Hook] Media links trouvés dans le webhook pour {filename}")
            
            # Sélectionner la meilleure vidéo Discord (50MB webhook bot)
            from src.utils.discord_media_selector import select_for_discord_tier
            video_url, strategy = await select_for_discord_tier(media_links, tier='webhook_bot')
            
            if not video_url:
                logger.warning(f"⚠️ Aucune vidéo compatible Discord pour {filename}")
                return
            
            # Poster la vidéo sur Discord
            await self._post_video_to_discord(video_url, filename, frameio_link, strategy)
            
        except Exception as e:
            logger.error(f"❌ [Video Hook] Erreur: {e}")
    
    async def _post_video_to_discord(self, video_url: str, filename: str, frameio_link: str, strategy: str):
        """Poste la vidéo sur Discord avec embed élégant"""
        import tempfile
        import httpx
        import os
        import json
        from pathlib import Path
        from datetime import datetime
        
        temp_file = None
        try:
            # Télécharger la vidéo
            async with httpx.AsyncClient(timeout=180.0) as client:
                response = await client.get(video_url, follow_redirects=True)
                response.raise_for_status()
                
                # Sauver temporairement
                base_name = Path(filename).stem
                temp_file = tempfile.NamedTemporaryFile(
                    suffix='.mp4', 
                    prefix=f'postflow_{base_name}_',
                    delete=False
                )
                temp_file.write(response.content)
                temp_file.close()
                
                file_size_mb = len(response.content) / (1024 * 1024)
                logger.info(f"📥 Vidéo téléchargée: {file_size_mb:.2f} MB")
                
                # Embed Discord élégant et compact
                embed = {
                    "title": f"🎬 {filename}",
                    "color": 0x00ff00,  # Vert pour succès
                    "fields": [
                        {
                            "name": "🔗 Frame.io", 
                            "value": f"[Voir le fichier]({frameio_link})",
                            "inline": True
                        },
                        {
                            "name": f"✨ {strategy.upper()}", 
                            "value": f"{file_size_mb:.1f}MB",
                            "inline": True
                        }
                    ],
                    "footer": {
                        "text": "PostFlow Bot",
                        "icon_url": "https://resize-lab.com/postflow-icon.png"
                    },
                    "timestamp": datetime.now().isoformat()
                }

                # Envoyer sur Discord avec embed
                webhook_url = self.discord_config.get('webhook_url')
                with open(temp_file.name, 'rb') as f:
                    video_data = f.read()
                    
                    # Créer le payload multipart correct pour Discord
                    payload = {
                        'username': self.discord_config.get('username', 'PostFlow Bot'),
                        'avatar_url': self.discord_config.get('avatar_url', 'https://resize-lab.com/postflow-icon.png'),
                        'embeds': [embed]
                    }
                    
                    # Utiliser files et data séparément (format Discord multipart)
                    files = {'file': (f"PostFlow_{filename}", video_data, 'video/mp4')}
                    data = {'payload_json': json.dumps(payload)}
                    
                    async with httpx.AsyncClient(timeout=120.0) as client:
                        response = await client.post(webhook_url, files=files, data=data)
                        
                        if response.status_code == 200:
                            logger.info(f"✅ Vidéo postée sur Discord: ✅ {strategy.upper()} ({file_size_mb:.1f}MB)")
                        else:
                            logger.error(f"❌ Erreur Discord: {response.status_code}")
                            logger.error(f"📋 Réponse Discord: {response.text}")
                
        except Exception as e:
            logger.error(f"❌ Erreur post Discord: {e}")
        finally:
            # Nettoyer
            if temp_file and os.path.exists(temp_file.name):
                try:
                    os.unlink(temp_file.name)
                except Exception:
                    pass


class FileWatcherHook:
    """Hook automatique pour FileWatcher → Discord notifications"""
    
    def __init__(self, discord_notifier=None):
        self.discord_notifier = discord_notifier
        self.enabled = discord_notifier is not None
        
        if self.enabled:
            # S'abonner aux événements de file processing
            event_manager.subscribe(EventType.FILE_PROCESSING_COMPLETED, self.on_file_processed, priority=2)
            event_manager.subscribe(EventType.UPLOAD_COMPLETED, self.on_upload_completed, priority=2)
            logger.info("✅ FileWatcher Hook activé")
        else:
            logger.warning("⚠️ FileWatcher Hook désactivé (pas de discord_notifier)")
    
    async def on_file_processed(self, event: Event):
        """Réagit quand un fichier est traité par FileWatcher"""
        if not self.enabled:
            return
        
        try:
            data = event.data
            shot_nomenclature = data.get('shot_nomenclature')
            version = data.get('version')
            file_size = data.get('file_size', 0)
            frameio_asset_id = data.get('frameio_asset_id')
            frameio_url = data.get('frameio_url')
            
            if not frameio_asset_id:
                logger.warning(f"⚠️ [FileWatcher Hook] Pas de frameio_asset_id pour {shot_nomenclature}")
                return
            
            logger.info(f"🎬 [FileWatcher Hook] Fichier traité: {shot_nomenclature} v{version:03d}")
            
            # Créer notification Discord avec format FileWatcher
            await self._send_filewatcher_notification(
                shot_nomenclature=shot_nomenclature,
                version=version,
                file_size=file_size,
                frameio_asset_id=frameio_asset_id,
                frameio_url=frameio_url
            )
            
        except Exception as e:
            logger.error(f"❌ [FileWatcher Hook] Erreur: {e}")
    
    async def on_upload_completed(self, event: Event):
        """Réagit aux uploads terminés (si différent de file_processed)"""
        # Pour l'instant, traité par on_file_processed
        pass
    
    async def _send_filewatcher_notification(self, shot_nomenclature: str, version: int, 
                                           file_size: int, frameio_asset_id: str, frameio_url: str = None):
        """Envoie notification Discord format FileWatcher"""
        try:
            if not frameio_url:
                frameio_url = f"https://app.frame.io/reviews/{frameio_asset_id}"
            
            message = f"🎬 **Nouveau rendu disponible pour review**"
            
            embed = {
                "title": f"Shot {shot_nomenclature} - Version v{version:03d}",
                "description": "Un nouveau rendu est prêt pour validation",
                "color": 0x00ff00,
                "fields": [
                    {
                        "name": "Plan",
                        "value": shot_nomenclature,
                        "inline": True
                    },
                    {
                        "name": "Version", 
                        "value": f"v{version:03d}",
                        "inline": True
                    },
                    {
                        "name": "Taille",
                        "value": f"{file_size / (1024*1024):.1f} MB",
                        "inline": True
                    },
                    {
                        "name": "Frame.io",
                        "value": f"[📺 Voir sur Frame.io]({frameio_url})",
                        "inline": False
                    }
                ],
                "footer": {
                    "text": "UNDLM PostFlow"
                }
            }
            
            # Utiliser discord_notifier existant
            if hasattr(self.discord_notifier, 'send_message'):
                success = self.discord_notifier.send_message(message, embed)
                if success:
                    logger.info(f"✅ Discord notification envoyée: {shot_nomenclature}")
                else:
                    logger.warning(f"⚠️ Échec notification Discord: {shot_nomenclature}")
            else:
                logger.warning(f"⚠️ Discord notifier sans méthode send_message")
                
        except Exception as e:
            logger.error(f"❌ Erreur notification FileWatcher: {e}")


class AutoHooksManager:
    """Gestionnaire des hooks automatiques"""
    
    def __init__(self):
        self.hooks = []
        self.initialized = False
    
    def initialize(self, sheets_tracker=None, discord_notifier=None, user_notifier=None, frameio_api=None, config_manager=None, upload_tracker=None):
        """Initialise tous les hooks automatiques"""
        if self.initialized:
            logger.warning("⚠️ Hooks déjà initialisés")
            return
        
        # Stocker l'upload_tracker pour la recherche de versions
        self.upload_tracker = upload_tracker
        
        # Hook Google Sheets
        if sheets_tracker:
            sheets_hook = GoogleSheetsHook(sheets_tracker)
            self.hooks.append(sheets_hook)
        
        # Hook Discord
        if discord_notifier or user_notifier:
            discord_hook = DiscordHook(discord_notifier, user_notifier, config_manager)
            self.hooks.append(discord_hook)
        
        # Hook Frame.io Video → Discord MP4
        if frameio_api:
            # Récupérer config Discord
            discord_config = self._get_discord_config()
            logger.info(f"🔍 Debug: discord_config = {discord_config}")
            if discord_config and discord_config.get('webhook_url'):
                logger.info(f"✅ Config Discord trouvée: webhook_url présent")
                video_hook = FrameioVideoHook(frameio_api, discord_config)
                self.hooks.append(video_hook)
                logger.info("✅ Frame.io Video Hook ajouté")
            else:
                logger.warning(f"⚠️ Config Discord manquante pour Video Hook: {discord_config}")
        
        # Hook FileWatcher → Discord notifications
        if discord_notifier:
            filewatcher_hook = FileWatcherHook(discord_notifier)
            self.hooks.append(filewatcher_hook)
            logger.info("✅ FileWatcher Hook ajouté")
        
        self.initialized = True
        logger.info(f"🔗 Auto Hooks initialisés: {len(self.hooks)} hooks actifs")
    
    def _get_latest_version_file_id(self, shot_name: str) -> Optional[str]:
        """
        Récupère le file_id de la dernière version d'un shot donné
        
        Args:
            shot_name: Nom du shot (ex: "UNDLM_00152")
            
        Returns:
            str: file_id de la dernière version ou None
        """
        try:
            if not hasattr(self, 'upload_tracker') or not self.upload_tracker:
                return None
            
            # Parcourir tous les uploads pour trouver les versions de ce shot
            uploads = self.upload_tracker.tracking_data.get("uploads", {})
            shot_versions = {}
            
            for upload_id, upload_data in uploads.items():
                upload_shot_name = upload_data.get('shot_id') or upload_data.get('shot_name')
                if upload_shot_name == shot_name:
                    version = upload_data.get('version', 'v001')
                    # Extraire le numéro de version (v001 → 1)
                    try:
                        version_num = int(version.replace('v', '').lstrip('0') or '0')
                        shot_versions[version_num] = upload_data
                    except:
                        shot_versions[0] = upload_data  # Version par défaut
            
            if shot_versions:
                # Récupérer la version la plus récente
                latest_version_num = max(shot_versions.keys())
                latest_upload = shot_versions[latest_version_num]
                
                # Récupérer le file_id de Frame.io
                frameio_data = latest_upload.get('frameio_data', {})
                file_id = frameio_data.get('file_id')
                
                if file_id:
                    logger.info(f"🎯 Dernière version trouvée pour {shot_name}: v{latest_version_num:03d} (file_id: {file_id[:12]}...)")
                    return file_id
                else:
                    logger.warning(f"⚠️ Pas de file_id pour la dernière version de {shot_name}")
            else:
                logger.warning(f"⚠️ Aucune version trouvée pour {shot_name}")
                
        except Exception as e:
            logger.error(f"❌ Erreur récupération dernière version de {shot_name}: {e}")
            
        return None
    
    def _get_discord_config(self) -> Optional[Dict]:
        """Récupère la configuration Discord"""
        try:
            config_path = Path("config/integrations.json")
            if config_path.exists():
                with open(config_path, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                return config.get('discord', {})
        except Exception as e:
            logger.error(f"❌ Erreur lecture config Discord: {e}")
        return None
    
    def get_stats(self) -> Dict[str, Any]:
        """Retourne les statistiques des hooks"""
        return {
            'hooks_count': len(self.hooks),
            'initialized': self.initialized,
            'event_manager_stats': event_manager.get_stats()
        }


# Instance globale
auto_hooks = AutoHooksManager()
