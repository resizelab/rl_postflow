#!/usr/bin/env python3
"""
📋 Upload Queue Manager
======================

Gestionnaire de queue pour les uploads afin d'éviter les conflits
et mélange entre les traitements simultanés.

Version: 4.1.1
Date: 9 juillet 2025
"""

import asyncio
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, Optional, Callable, List, Tuple
from enum import Enum
from dataclasses import dataclass
import uuid

logger = logging.getLogger(__name__)


class QueueItemStatus(Enum):
    """Statuts possibles pour un élément de la queue"""
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class QueuePriority(Enum):
    """Priorités pour les éléments de la queue"""
    LOW = 3
    NORMAL = 2
    HIGH = 1
    URGENT = 0


@dataclass
class QueueItem:
    """Élément de la queue de traitement"""
    id: str
    file_path: Path
    priority: QueuePriority
    status: QueueItemStatus
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    retry_count: int = 0
    max_retries: int = 3
    error_message: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    force: bool = False


class UploadQueue:
    """
    Gestionnaire de queue pour les uploads avec traitement séquentiel
    """
    
    def __init__(self, max_concurrent: int = 1, max_queue_size: int = 100):
        """
        Initialise la queue d'upload
        
        Args:
            max_concurrent: Nombre maximum de traitements simultanés (1 pour séquentiel)
            max_queue_size: Taille maximum de la queue
        """
        self.max_concurrent = max_concurrent
        self.max_queue_size = max_queue_size
        
        # Queue et états
        self._queue: List[QueueItem] = []
        self._processing: Dict[str, QueueItem] = {}
        self._completed: Dict[str, QueueItem] = {}
        self._failed: Dict[str, QueueItem] = {}
        
        # Synchronisation
        self._queue_lock = asyncio.Lock()
        self._worker_tasks: List[asyncio.Task] = []
        self._shutdown_event = asyncio.Event()
        self._is_running = False
        
        # Callback de traitement
        self._process_callback: Optional[Callable] = None
        
        # Métriques
        self.metrics = {
            'total_queued': 0,
            'total_processed': 0,
            'total_failed': 0,
            'total_cancelled': 0,
            'processing_time_total': 0.0,
            'last_activity': None
        }
    
    def set_process_callback(self, callback: Callable):
        """Définit le callback de traitement des fichiers"""
        self._process_callback = callback
    
    async def start(self):
        """Démarre les workers de traitement"""
        if self._is_running:
            return
        
        logger.info(f"🚀 Démarrage de la queue d'upload (max_concurrent={self.max_concurrent})")
        self._is_running = True
        self._shutdown_event.clear()
        
        # Créer les workers
        for i in range(self.max_concurrent):
            task = asyncio.create_task(self._worker(f"worker-{i}"))
            self._worker_tasks.append(task)
        
        logger.info(f"✅ Queue d'upload démarrée avec {len(self._worker_tasks)} workers")
    
    async def stop(self):
        """Arrête la queue et termine les workers"""
        if not self._is_running:
            return
        
        logger.info("🛑 Arrêt de la queue d'upload...")
        self._is_running = False
        self._shutdown_event.set()
        
        # Attendre que tous les workers se terminent
        if self._worker_tasks:
            await asyncio.gather(*self._worker_tasks, return_exceptions=True)
            self._worker_tasks.clear()
        
        logger.info("✅ Queue d'upload arrêtée")
    
    async def add_file(self, file_path: Path, priority: QueuePriority = QueuePriority.NORMAL, 
                      force: bool = False, metadata: Dict[str, Any] = None) -> str:
        """
        Ajoute un fichier à la queue de traitement
        
        Args:
            file_path: Chemin vers le fichier à traiter
            priority: Priorité du traitement
            force: Forcer le retraitement même si déjà traité
            metadata: Métadonnées additionnelles
        
        Returns:
            str: ID de l'élément dans la queue
        """
        async with self._queue_lock:
            # Vérifier la taille de la queue
            if len(self._queue) >= self.max_queue_size:
                raise Exception(f"Queue pleine (max {self.max_queue_size})")
            
            # Vérifier si le fichier est déjà en cours de traitement
            for item in self._queue + list(self._processing.values()):
                if item.file_path == file_path and not force:
                    logger.warning(f"⚠️ Fichier déjà en queue: {file_path.name}")
                    return item.id
            
            # Créer l'élément de queue
            item_id = str(uuid.uuid4())[:8]
            item = QueueItem(
                id=item_id,
                file_path=file_path,
                priority=priority,
                status=QueueItemStatus.PENDING,
                created_at=datetime.now(),
                metadata=metadata or {},
                force=force
            )
            
            # Insérer dans la queue selon la priorité
            inserted = False
            for i, existing_item in enumerate(self._queue):
                if item.priority.value < existing_item.priority.value:
                    self._queue.insert(i, item)
                    inserted = True
                    break
            
            if not inserted:
                self._queue.append(item)
            
            self.metrics['total_queued'] += 1
            self.metrics['last_activity'] = datetime.now()
            
            logger.info(f"📋 Fichier ajouté à la queue: {file_path.name} (ID: {item_id}, Priorité: {priority.name})")
            logger.info(f"📊 Queue: {len(self._queue)} en attente, {len(self._processing)} en traitement")
            
            return item_id
    
    async def _worker(self, worker_name: str):
        """Worker pour traiter les éléments de la queue"""
        logger.info(f"👷 Worker {worker_name} démarré")
        
        while self._is_running and not self._shutdown_event.is_set():
            try:
                # Récupérer le prochain élément
                item = await self._get_next_item()
                if not item:
                    # Pas d'élément, attendre un peu
                    await asyncio.sleep(0.5)
                    continue
                
                # Traiter l'élément
                await self._process_item(item, worker_name)
                
            except asyncio.CancelledError:
                logger.info(f"👷 Worker {worker_name} annulé")
                break
            except Exception as e:
                logger.error(f"❌ Erreur dans worker {worker_name}: {e}")
                await asyncio.sleep(1)
        
        logger.info(f"👷 Worker {worker_name} terminé")
    
    async def _get_next_item(self) -> Optional[QueueItem]:
        """Récupère le prochain élément à traiter"""
        async with self._queue_lock:
            if not self._queue:
                return None
            
            # Prendre l'élément avec la plus haute priorité (plus petit nombre)
            item = self._queue.pop(0)
            item.status = QueueItemStatus.PROCESSING
            item.started_at = datetime.now()
            
            self._processing[item.id] = item
            return item
    
    async def _process_item(self, item: QueueItem, worker_name: str):
        """Traite un élément de la queue"""
        start_time = datetime.now()
        
        try:
            logger.info(f"🔄 [{worker_name}] Début traitement: {item.file_path.name} (ID: {item.id})")
            
            if not self._process_callback:
                raise Exception("Aucun callback de traitement défini")
            
            # Appeler le callback de traitement
            if asyncio.iscoroutinefunction(self._process_callback):
                await self._process_callback(
                    str(item.file_path), 
                    metadata=item.metadata, 
                    force=item.force
                )
            else:
                self._process_callback(
                    str(item.file_path), 
                    metadata=item.metadata, 
                    force=item.force
                )
            
            # Marquer comme terminé
            item.status = QueueItemStatus.COMPLETED
            item.completed_at = datetime.now()
            
            # Calculer le temps de traitement
            processing_time = (item.completed_at - item.started_at).total_seconds()
            self.metrics['processing_time_total'] += processing_time
            self.metrics['total_processed'] += 1
            
            logger.info(f"✅ [{worker_name}] Traitement terminé: {item.file_path.name} ({processing_time:.1f}s)")
            
            # Déplacer vers les terminés
            async with self._queue_lock:
                if item.id in self._processing:
                    del self._processing[item.id]
                self._completed[item.id] = item
            
        except Exception as e:
            # Marquer comme échoué
            item.status = QueueItemStatus.FAILED
            item.completed_at = datetime.now()
            item.error_message = str(e)
            item.retry_count += 1
            
            logger.error(f"❌ [{worker_name}] Échec traitement: {item.file_path.name} - {e}")
            
            # Retry si possible
            if item.retry_count < item.max_retries:
                logger.info(f"🔄 Retry {item.retry_count}/{item.max_retries} pour: {item.file_path.name}")
                
                # Remettre en queue avec une priorité plus basse
                item.status = QueueItemStatus.PENDING
                item.started_at = None
                item.completed_at = None
                item.priority = QueuePriority.LOW
                
                async with self._queue_lock:
                    if item.id in self._processing:
                        del self._processing[item.id]
                    self._queue.append(item)
            else:
                logger.error(f"💥 Abandon traitement après {item.max_retries} tentatives: {item.file_path.name}")
                self.metrics['total_failed'] += 1
                
                # Déplacer vers les échecs
                async with self._queue_lock:
                    if item.id in self._processing:
                        del self._processing[item.id]
                    self._failed[item.id] = item
        
        finally:
            self.metrics['last_activity'] = datetime.now()
    
    async def cancel_item(self, item_id: str) -> bool:
        """Annule un élément de la queue"""
        async with self._queue_lock:
            # Chercher dans la queue en attente
            for i, item in enumerate(self._queue):
                if item.id == item_id:
                    item.status = QueueItemStatus.CANCELLED
                    self._queue.pop(i)
                    self.metrics['total_cancelled'] += 1
                    logger.info(f"❌ Élément annulé: {item.file_path.name}")
                    return True
            
            # Ne peut pas annuler un élément en cours de traitement
            if item_id in self._processing:
                logger.warning(f"⚠️ Impossible d'annuler un élément en cours de traitement: {item_id}")
                return False
        
        return False
    
    def get_status(self) -> Dict[str, Any]:
        """Retourne le statut de la queue"""
        return {
            'running': self._is_running,
            'queue_size': len(self._queue),
            'processing_count': len(self._processing),
            'completed_count': len(self._completed),
            'failed_count': len(self._failed),
            'metrics': self.metrics.copy(),
            'next_items': [
                {
                    'id': item.id,
                    'file_name': item.file_path.name,
                    'priority': item.priority.name,
                    'created_at': item.created_at.isoformat()
                }
                for item in self._queue[:5]  # Top 5
            ],
            'processing_items': [
                {
                    'id': item.id,
                    'file_name': item.file_path.name,
                    'started_at': item.started_at.isoformat() if item.started_at else None,
                    'duration': (datetime.now() - item.started_at).total_seconds() if item.started_at else 0
                }
                for item in self._processing.values()
            ]
        }
    
    def get_item_status(self, item_id: str) -> Optional[Dict[str, Any]]:
        """Retourne le statut d'un élément spécifique"""
        # Chercher partout
        all_items = {}
        all_items.update({item.id: item for item in self._queue})
        all_items.update(self._processing)
        all_items.update(self._completed)
        all_items.update(self._failed)
        
        item = all_items.get(item_id)
        if not item:
            return None
        
        result = {
            'id': item.id,
            'file_path': str(item.file_path),
            'file_name': item.file_path.name,
            'status': item.status.value,
            'priority': item.priority.name,
            'created_at': item.created_at.isoformat(),
            'retry_count': item.retry_count,
            'max_retries': item.max_retries,
        }
        
        if item.started_at:
            result['started_at'] = item.started_at.isoformat()
        if item.completed_at:
            result['completed_at'] = item.completed_at.isoformat()
            result['processing_time'] = (item.completed_at - (item.started_at or item.created_at)).total_seconds()
        if item.error_message:
            result['error_message'] = item.error_message
        
        return result
    
    async def clear_completed(self, older_than_hours: int = 24):
        """Nettoie les éléments terminés anciens"""
        async with self._queue_lock:
            cutoff_time = datetime.now() - timedelta(hours=older_than_hours)
            
            # Nettoyer les terminés
            to_remove = [
                item_id for item_id, item in self._completed.items()
                if item.completed_at and item.completed_at < cutoff_time
            ]
            for item_id in to_remove:
                del self._completed[item_id]
            
            # Nettoyer les échecs
            to_remove = [
                item_id for item_id, item in self._failed.items()
                if item.completed_at and item.completed_at < cutoff_time
            ]
            for item_id in to_remove:
                del self._failed[item_id]
            
            if to_remove:
                logger.info(f"🧹 Nettoyage: {len(to_remove)} éléments supprimés")
