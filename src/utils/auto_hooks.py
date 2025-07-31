#!/usr/bin/env python3
"""
🔗 Auto Hooks - Système de hooks automatiques
=============================================

Hooks automatiques pour Google Sheets, Discord et autres intégrations.
S'abonne aux événements et gère les mises à jour automatiquement.

Version: 4.1.5
Date: 31 juillet 2025
"""

import asyncio
import logging
from typing import Dict, Any, Optional
from datetime import datetime

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
            status = data.get('status')
            frameio_link = data.get('frameio_link')
            comment = data.get('comment')
            
            if shot_name and status:
                logger.info(f"📊 [Sheets Hook] Mise à jour statut: {shot_name} -> {status}")
                
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
            frameio_link = data.get('frameio_link')
            thumbnail_url = data.get('thumbnail_url')
            
            if shot_name:
                logger.info(f"📊 [Sheets Hook] Upload terminé: {shot_name}")
                
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
            comment_text = data.get('comment_text')
            review_status = data.get('review_status')
            
            if shot_name and comment_text:
                logger.info(f"📊 [Sheets Hook] Commentaire Frame.io: {shot_name}")
                
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
    
    def __init__(self, discord_notifier=None, user_notifier=None):
        self.discord_notifier = discord_notifier
        self.user_notifier = user_notifier
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
        """Notifie les commentaires Frame.io avec analyse intelligente"""
        if not self.enabled:
            return
        
        try:
            data = event.data
            shot_name = data.get('shot_name')
            comment_text = data.get('comment_text')
            review_status = data.get('review_status')
            commenter = data.get('commenter', 'Utilisateur')
            
            logger.info(f"💬 [Discord Hook] Commentaire Frame.io: {shot_name}")
            
            # Analyse intelligente du statut
            intelligent_status = self._analyze_comment_for_discord(comment_text, review_status)
            
            notifier = self.user_notifier or self.discord_notifier
            
            # Émoji selon le statut intelligent
            status_emoji = {
                'APPROVED': '✅',
                'NEED_REWORK': '🔄', 
                'NEED_REVIEW': '⏳',
                'REJECTED': '❌'
            }.get(intelligent_status, '💬')
            
            status_text = {
                'APPROVED': 'Validé',
                'NEED_REWORK': 'Modifications requises',
                'NEED_REVIEW': 'En attente de review',
                'REJECTED': 'Rejeté'
            }.get(intelligent_status, 'Review')
            
            message = f"{status_emoji} **{shot_name}** - {status_text}\n"
            message += f"👤 **{commenter}**\n"
            message += f"💬 {comment_text[:200]}{'...' if len(comment_text) > 200 else ''}\n"
            message += f"🤖 Statut auto-détecté: **{intelligent_status}**"
            
            if self.user_notifier and hasattr(self.user_notifier, 'send_system_notification'):
                await self.user_notifier.send_system_notification("Commentaire Frame.io", message)
            elif self.discord_notifier:
                self.discord_notifier.notify_system_status("Commentaire Frame.io", message)
                
        except Exception as e:
            logger.error(f"❌ [Discord Hook] Erreur notification commentaire: {e}")
    
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


class AutoHooksManager:
    """Gestionnaire des hooks automatiques"""
    
    def __init__(self):
        self.hooks = []
        self.initialized = False
    
    def initialize(self, sheets_tracker=None, discord_notifier=None, user_notifier=None):
        """Initialise tous les hooks automatiques"""
        if self.initialized:
            logger.warning("⚠️ Hooks déjà initialisés")
            return
        
        # Hook Google Sheets
        if sheets_tracker:
            sheets_hook = GoogleSheetsHook(sheets_tracker)
            self.hooks.append(sheets_hook)
        
        # Hook Discord
        if discord_notifier or user_notifier:
            discord_hook = DiscordHook(discord_notifier, user_notifier)
            self.hooks.append(discord_hook)
        
        self.initialized = True
        logger.info(f"🔗 Auto Hooks initialisés: {len(self.hooks)} hooks actifs")
    
    def get_stats(self) -> Dict[str, Any]:
        """Retourne les statistiques des hooks"""
        return {
            'hooks_count': len(self.hooks),
            'initialized': self.initialized,
            'event_manager_stats': event_manager.get_stats()
        }


# Instance globale
auto_hooks = AutoHooksManager()
