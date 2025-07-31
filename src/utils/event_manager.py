#!/usr/bin/env python3
"""
🎯 Event Manager - Système d'événements centralisé
=================================================

Gestionnaire d'événements global pour hooks et notifications automatiques.
Permet de découpler les composants et d'avoir une gestion unifiée des événements.

Version: 4.1.5
Date: 31 juillet 2025
"""

import asyncio
import logging
from typing import Dict, List, Callable, Any, Optional
from datetime import datetime
from enum import Enum
import threading
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)

class EventType(Enum):
    """Types d'événements du pipeline"""
    # Événements de fichiers
    FILE_DETECTED = "file_detected"
    FILE_PROCESSING_STARTED = "file_processing_started"
    FILE_PROCESSING_COMPLETED = "file_processing_completed"
    FILE_PROCESSING_FAILED = "file_processing_failed"
    
    # Événements d'upload
    UPLOAD_STARTED = "upload_started"
    UPLOAD_PROGRESS = "upload_progress"
    UPLOAD_COMPLETED = "upload_completed"
    UPLOAD_FAILED = "upload_failed"
    
    # Événements de statut
    STATUS_CHANGED = "status_changed"
    REVIEW_STATUS_CHANGED = "review_status_changed"
    
    # Événements Frame.io
    FRAMEIO_COMMENT_RECEIVED = "frameio_comment_received"
    FRAMEIO_REVIEW_COMPLETED = "frameio_review_completed"
    FRAMEIO_FEEDBACK_RECEIVED = "frameio_feedback_received"
    
    # Événements système
    PIPELINE_STARTED = "pipeline_started"
    PIPELINE_STOPPED = "pipeline_stopped"
    ERROR_OCCURRED = "error_occurred"


class Event:
    """Classe représentant un événement"""
    
    def __init__(self, event_type: EventType, data: Dict[str, Any] = None, source: str = None):
        self.event_type = event_type
        self.data = data or {}
        self.source = source
        self.timestamp = datetime.now()
        self.id = f"{event_type.value}_{self.timestamp.strftime('%H%M%S_%f')}"
    
    def __repr__(self):
        return f"Event({self.event_type.value}, source={self.source}, data_keys={list(self.data.keys())})"


class EventManager:
    """Gestionnaire d'événements centralisé avec support async et sync"""
    
    def __init__(self):
        self.handlers: Dict[EventType, List[Callable]] = {}
        self.event_history: List[Event] = []
        self.max_history = 1000
        self._lock = threading.Lock()
        self._executor = ThreadPoolExecutor(max_workers=5, thread_name_prefix="EventManager")
        self._running = True
        
        logger.info("🎯 Event Manager initialisé")
    
    def subscribe(self, event_type: EventType, handler: Callable, priority: int = 0):
        """
        Abonne un handler à un type d'événement
        
        Args:
            event_type: Type d'événement à écouter
            handler: Fonction à appeler (sync ou async)
            priority: Priorité d'exécution (plus haut = plus tôt)
        """
        with self._lock:
            if event_type not in self.handlers:
                self.handlers[event_type] = []
            
            # Insérer selon la priorité
            inserted = False
            for i, (existing_handler, existing_priority) in enumerate(self.handlers[event_type]):
                if priority > existing_priority:
                    self.handlers[event_type].insert(i, (handler, priority))
                    inserted = True
                    break
            
            if not inserted:
                self.handlers[event_type].append((handler, priority))
        
        logger.debug(f"📡 Handler enregistré pour {event_type.value} (priorité: {priority})")
    
    def unsubscribe(self, event_type: EventType, handler: Callable):
        """Désabonne un handler d'un type d'événement"""
        with self._lock:
            if event_type in self.handlers:
                self.handlers[event_type] = [
                    (h, p) for h, p in self.handlers[event_type] if h != handler
                ]
        
        logger.debug(f"📡 Handler désenregistré pour {event_type.value}")
    
    async def emit(self, event_type: EventType, data: Dict[str, Any] = None, source: str = None):
        """
        Émet un événement de façon asynchrone
        
        Args:
            event_type: Type d'événement
            data: Données associées à l'événement
            source: Source de l'événement (pour debugging)
        """
        if not self._running:
            return
        
        event = Event(event_type, data, source)
        
        # Ajouter à l'historique
        with self._lock:
            self.event_history.append(event)
            if len(self.event_history) > self.max_history:
                self.event_history.pop(0)
        
        logger.debug(f"📤 Événement émis: {event}")
        
        # Exécuter les handlers
        await self._execute_handlers(event)
    
    def emit_sync(self, event_type: EventType, data: Dict[str, Any] = None, source: str = None):
        """
        Émet un événement de façon synchrone (pour code non-async)
        """
        try:
            # Tenter d'utiliser la boucle actuelle
            loop = asyncio.get_running_loop()
            # Créer une tâche sans attendre
            loop.create_task(self.emit(event_type, data, source))
        except RuntimeError:
            # Pas de boucle active, créer une nouvelle
            asyncio.run(self.emit(event_type, data, source))
    
    async def _execute_handlers(self, event: Event):
        """Exécute tous les handlers pour un événement donné"""
        handlers_list = []
        
        with self._lock:
            if event.event_type in self.handlers:
                handlers_list = self.handlers[event.event_type].copy()
        
        if not handlers_list:
            return
        
        # Exécuter les handlers par ordre de priorité
        for handler, priority in handlers_list:
            try:
                if asyncio.iscoroutinefunction(handler):
                    # Handler asynchrone
                    await handler(event)
                else:
                    # Handler synchrone - exécuter dans un thread
                    loop = asyncio.get_event_loop()
                    await loop.run_in_executor(self._executor, handler, event)
                    
            except Exception as e:
                logger.error(f"❌ Erreur handler {handler.__name__} pour {event.event_type.value}: {e}")
    
    def get_event_history(self, event_type: EventType = None, limit: int = 50) -> List[Event]:
        """Récupère l'historique des événements"""
        with self._lock:
            events = self.event_history.copy()
        
        if event_type:
            events = [e for e in events if e.event_type == event_type]
        
        return events[-limit:] if limit else events
    
    def get_stats(self) -> Dict[str, Any]:
        """Retourne les statistiques du gestionnaire d'événements"""
        with self._lock:
            stats = {
                'total_handlers': sum(len(handlers) for handlers in self.handlers.values()),
                'event_types_subscribed': len(self.handlers),
                'total_events_emitted': len(self.event_history),
                'handlers_by_type': {
                    event_type.value: len(handlers) 
                    for event_type, handlers in self.handlers.items()
                }
            }
        
        return stats
    
    def shutdown(self):
        """Arrêt propre du gestionnaire d'événements"""
        logger.info("🛑 Arrêt Event Manager...")
        self._running = False
        self._executor.shutdown(wait=True)
        logger.info("✅ Event Manager arrêté")


# Instance globale du gestionnaire d'événements
event_manager = EventManager()


# Décorateurs utilitaires
def on_event(event_type: EventType, priority: int = 0):
    """Décorateur pour enregistrer automatiquement un handler"""
    def decorator(func):
        event_manager.subscribe(event_type, func, priority)
        return func
    return decorator


def emit_event(event_type: EventType, **kwargs):
    """Helper pour émettre un événement avec des kwargs comme data"""
    event_manager.emit_sync(event_type, kwargs)
