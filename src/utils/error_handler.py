"""
Gestionnaire d'erreurs avancé pour PostFlow
Gère les retries, alertes, queue persistante et monitoring de santé
"""

import json
import logging
import sqlite3
import time
from datetime import datetime, timedelta
from enum import Enum
from pathlib import Path
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass, asdict
from threading import Thread, Lock, Event
import traceback
import smtplib
from email.message import EmailMessage

logger = logging.getLogger(__name__)


class ErrorLevel(Enum):
    """Niveaux d'erreurs."""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class TaskStatus(Enum):
    """Statuts des tâches."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRY = "retry"
    CANCELLED = "cancelled"


@dataclass
class Task:
    """Tâche à exécuter."""
    id: str
    task_type: str
    data: Dict[str, Any]
    status: TaskStatus
    created_at: datetime
    attempts: int = 0
    max_attempts: int = 3
    last_error: Optional[str] = None
    next_retry: Optional[datetime] = None
    priority: int = 0  # 0 = haute, 10 = basse
    timeout: int = 300  # secondes
    
    def to_dict(self) -> Dict[str, Any]:
        """Convertit la tâche en dictionnaire."""
        return {
            'id': self.id,
            'task_type': self.task_type,
            'data': json.dumps(self.data),
            'status': self.status.value,
            'created_at': self.created_at.isoformat(),
            'attempts': self.attempts,
            'max_attempts': self.max_attempts,
            'last_error': self.last_error,
            'next_retry': self.next_retry.isoformat() if self.next_retry else None,
            'priority': self.priority,
            'timeout': self.timeout
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Task':
        """Crée une tâche depuis un dictionnaire."""
        return cls(
            id=data['id'],
            task_type=data['task_type'],
            data=json.loads(data['data']),
            status=TaskStatus(data['status']),
            created_at=datetime.fromisoformat(data['created_at']),
            attempts=data.get('attempts', 0),
            max_attempts=data.get('max_attempts', 3),
            last_error=data.get('last_error'),
            next_retry=datetime.fromisoformat(data['next_retry']) if data.get('next_retry') else None,
            priority=data.get('priority', 0),
            timeout=data.get('timeout', 300)
        )


@dataclass
class ErrorEvent:
    """Événement d'erreur."""
    timestamp: datetime
    level: ErrorLevel
    component: str
    message: str
    details: Optional[Dict[str, Any]] = None
    traceback: Optional[str] = None
    task_id: Optional[str] = None


class PersistentQueue:
    """Queue persistante SQLite pour les tâches."""
    
    def __init__(self, db_path: str):
        """
        Initialise la queue persistante.
        
        Args:
            db_path: Chemin vers la base de données SQLite
        """
        self.db_path = db_path
        self.lock = Lock()
        self._init_db()
    
    def _init_db(self):
        """Initialise la base de données."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS tasks (
                    id TEXT PRIMARY KEY,
                    task_type TEXT NOT NULL,
                    data TEXT NOT NULL,
                    status TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    attempts INTEGER DEFAULT 0,
                    max_attempts INTEGER DEFAULT 3,
                    last_error TEXT,
                    next_retry TEXT,
                    priority INTEGER DEFAULT 0,
                    timeout INTEGER DEFAULT 300
                )
            ''')
            
            conn.execute('''
                CREATE TABLE IF NOT EXISTS error_log (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    level TEXT NOT NULL,
                    component TEXT NOT NULL,
                    message TEXT NOT NULL,
                    details TEXT,
                    traceback TEXT,
                    task_id TEXT
                )
            ''')
            
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)
            ''')
            
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority, created_at)
            ''')
            
            conn.commit()
    
    def add_task(self, task: Task) -> bool:
        """
        Ajoute une tâche à la queue.
        
        Args:
            task: Tâche à ajouter
            
        Returns:
            bool: True si ajouté avec succès
        """
        with self.lock:
            try:
                with sqlite3.connect(self.db_path) as conn:
                    task_dict = task.to_dict()
                    columns = ', '.join(task_dict.keys())
                    placeholders = ', '.join(['?' for _ in task_dict.keys()])
                    
                    conn.execute(
                        f'INSERT OR REPLACE INTO tasks ({columns}) VALUES ({placeholders})',
                        list(task_dict.values())
                    )
                    conn.commit()
                    return True
            except Exception as e:
                logger.error(f"Failed to add task to queue: {e}")
                return False
    
    def get_next_task(self) -> Optional[Task]:
        """
        Récupère la prochaine tâche à traiter.
        
        Returns:
            Task: Prochaine tâche ou None
        """
        with self.lock:
            try:
                with sqlite3.connect(self.db_path) as conn:
                    conn.row_factory = sqlite3.Row
                    cursor = conn.cursor()
                    
                    # Récupérer les tâches en attente ou à retry
                    cursor.execute('''
                        SELECT * FROM tasks 
                        WHERE (status = ? OR (status = ? AND next_retry <= ?))
                        ORDER BY priority ASC, created_at ASC 
                        LIMIT 1
                    ''', (TaskStatus.PENDING.value, TaskStatus.RETRY.value, datetime.now().isoformat()))
                    
                    row = cursor.fetchone()
                    if row:
                        # Convertir row en dict normal
                        row_dict = {key: row[key] for key in row.keys()}
                        logger.debug(f"Retrieved task row: {row_dict}")
                        
                        # Créer la tâche
                        task = Task.from_dict(row_dict)
                        
                        # Marquer comme en cours de traitement
                        task.status = TaskStatus.PROCESSING
                        
                        # Mettre à jour en utilisant une nouvelle connexion pour éviter les deadlocks
                        success = self.update_task(task)
                        if not success:
                            logger.error(f"Failed to update task {task.id} status to PROCESSING")
                            return None
                        
                        return task
                        
            except Exception as e:
                logger.error(f"Failed to get next task: {e}")
                import traceback
                traceback.print_exc()
                
        return None
    
    def update_task(self, task: Task) -> bool:
        """
        Met à jour une tâche.
        
        Args:
            task: Tâche à mettre à jour
            
        Returns:
            bool: True si mise à jour réussie
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                task_dict = task.to_dict()
                set_clause = ', '.join([f'{k} = ?' for k in task_dict.keys() if k != 'id'])
                values = [v for k, v in task_dict.items() if k != 'id']
                values.append(task.id)
                
                conn.execute(
                    f'UPDATE tasks SET {set_clause} WHERE id = ?',
                    values
                )
                conn.commit()
                return True
        except Exception as e:
            logger.error(f"Failed to update task: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def get_statistics(self) -> Dict[str, Any]:
        """
        Récupère les statistiques de la queue.
        
        Returns:
            Dict: Statistiques
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Compter par statut
                cursor.execute('''
                    SELECT status, COUNT(*) as count 
                    FROM tasks 
                    GROUP BY status
                ''')
                
                stats = {row[0]: row[1] for row in cursor.fetchall()}
                
                # Tâches en erreur
                cursor.execute('''
                    SELECT COUNT(*) FROM tasks 
                    WHERE status = ? AND attempts >= max_attempts
                ''', (TaskStatus.FAILED.value,))
                
                stats['failed_final'] = cursor.fetchone()[0]
                
                return stats
                
        except Exception as e:
            logger.error(f"Failed to get queue statistics: {e}")
            return {}
    
    def cleanup_old_tasks(self, days: int = 7) -> int:
        """
        Supprime les anciennes tâches terminées.
        
        Args:
            days: Nombre de jours à conserver
            
        Returns:
            int: Nombre de tâches supprimées
        """
        with self.lock:
            try:
                cutoff_date = datetime.now() - timedelta(days=days)
                
                with sqlite3.connect(self.db_path) as conn:
                    cursor = conn.cursor()
                    cursor.execute('''
                        DELETE FROM tasks 
                        WHERE status IN (?, ?) AND created_at < ?
                    ''', (TaskStatus.COMPLETED.value, TaskStatus.FAILED.value, cutoff_date.isoformat()))
                    
                    deleted = cursor.rowcount
                    conn.commit()
                    return deleted
                    
            except Exception as e:
                logger.error(f"Failed to cleanup old tasks: {e}")
                return 0


class RetryStrategy:
    """Stratégie de retry avec backoff exponentiel."""
    
    def __init__(self, base_delay: float = 1.0, max_delay: float = 300.0, backoff_factor: float = 2.0):
        """
        Initialise la stratégie de retry.
        
        Args:
            base_delay: Délai de base en secondes
            max_delay: Délai maximum en secondes
            backoff_factor: Facteur de backoff
        """
        self.base_delay = base_delay
        self.max_delay = max_delay
        self.backoff_factor = backoff_factor
    
    def get_delay(self, attempt: int) -> float:
        """
        Calcule le délai avant le prochain retry.
        
        Args:
            attempt: Numéro de tentative
            
        Returns:
            float: Délai en secondes
        """
        delay = self.base_delay * (self.backoff_factor ** attempt)
        return min(delay, self.max_delay)
    
    def get_next_retry_time(self, attempt: int) -> datetime:
        """
        Calcule le timestamp du prochain retry.
        
        Args:
            attempt: Numéro de tentative
            
        Returns:
            datetime: Timestamp du prochain retry
        """
        delay = self.get_delay(attempt)
        return datetime.now() + timedelta(seconds=delay)


class HealthMonitor:
    """Monitor de santé du système."""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialise le monitor de santé.
        
        Args:
            config: Configuration du monitoring
        """
        self.config = config
        self.checks: Dict[str, Callable[[], bool]] = {}
        self.last_check: Dict[str, datetime] = {}
        self.check_interval = config.get('check_interval', 60)  # secondes
        self.alert_threshold = config.get('alert_threshold', 5)  # échecs consécutifs
        self.failure_counts: Dict[str, int] = {}
        
    def register_check(self, name: str, check_func: Callable[[], bool]):
        """
        Enregistre une vérification de santé.
        
        Args:
            name: Nom de la vérification
            check_func: Fonction de vérification
        """
        self.checks[name] = check_func
        self.failure_counts[name] = 0
    
    def run_checks(self) -> Dict[str, bool]:
        """
        Exécute toutes les vérifications de santé.
        
        Returns:
            Dict: Résultats des vérifications
        """
        results = {}
        
        for name, check_func in self.checks.items():
            try:
                result = check_func()
                results[name] = result
                
                if result:
                    self.failure_counts[name] = 0
                else:
                    # Seulement incrémenter si on a un service principal actif
                    # Éviter l'accumulation d'échecs quand le service est arrêté
                    if hasattr(self, '_service_active') and not self._service_active:
                        # Service arrêté, ne pas compter comme échec
                        results[name] = None  # Indique que le check n'est pas applicable
                    else:
                        self.failure_counts[name] += 1
                        
                        if self.failure_counts[name] >= self.alert_threshold:
                            logger.critical(f"Health check '{name}' failed {self.failure_counts[name]} times")
                        
            except Exception as e:
                logger.error(f"Health check '{name}' threw exception: {e}")
                results[name] = False
                # Seulement incrémenter si le service devrait être actif
                if not (hasattr(self, '_service_active') and not self._service_active):
                    self.failure_counts[name] += 1
        
        return results
    
    def get_status(self) -> Dict[str, Any]:
        """
        Récupère le statut de santé global.
        
        Returns:
            Dict: Statut de santé
        """
        return {
            'checks': list(self.checks.keys()),
            'failure_counts': self.failure_counts.copy(),
            'last_check': {k: v.isoformat() for k, v in self.last_check.items()},
            'healthy': all(count < self.alert_threshold for count in self.failure_counts.values())
        }


class ErrorHandler:
    """Gestionnaire d'erreurs principal."""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialise le gestionnaire d'erreurs.
        
        Args:
            config: Configuration du gestionnaire
        """
        self.config = config
        self.db_path = config.get('db_path', 'data/postflow.db')
        
        # Créer le dossier si nécessaire
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        
        self.queue = PersistentQueue(self.db_path)
        self.retry_strategy = RetryStrategy(
            base_delay=config.get('retry_base_delay', 1.0),
            max_delay=config.get('retry_max_delay', 300.0),
            backoff_factor=config.get('retry_backoff_factor', 2.0)
        )
        
        self.health_monitor = HealthMonitor(config.get('health_monitor', {}))
        
        # Thread de traitement des tâches
        self.processing = False
        self.process_thread: Optional[Thread] = None
        self.stop_event = Event()
        
        # Handlers de tâches
        self.task_handlers: Dict[str, Callable[[Dict[str, Any]], bool]] = {}
        
        # Configuration des alertes
        self.alert_config = config.get('alerts', {})
    
    def register_task_handler(self, task_type: str, handler: Callable[[Dict[str, Any]], bool]):
        """
        Enregistre un handler pour un type de tâche.
        
        Args:
            task_type: Type de tâche
            handler: Fonction de traitement
        """
        self.task_handlers[task_type] = handler
    
    def add_task(self, task_type: str, data: Dict[str, Any], priority: int = 0, max_attempts: int = 3) -> str:
        """
        Ajoute une tâche à traiter.
        
        Args:
            task_type: Type de tâche
            data: Données de la tâche
            priority: Priorité (0 = haute)
            max_attempts: Nombre max de tentatives
            
        Returns:
            str: ID de la tâche
        """
        task_id = f"{task_type}_{int(time.time() * 1000)}"
        
        task = Task(
            id=task_id,
            task_type=task_type,
            data=data,
            status=TaskStatus.PENDING,
            created_at=datetime.now(),
            priority=priority,
            max_attempts=max_attempts
        )
        
        if self.queue.add_task(task):
            logger.info(f"Added task {task_id} to queue")
            return task_id
        else:
            logger.error(f"Failed to add task {task_id} to queue")
            return ""
    
    def start_processing(self):
        """Démarre le traitement des tâches."""
        if self.processing:
            logger.warning("Task processing already started")
            return
        
        self.processing = True
        self.stop_event.clear()
        self.process_thread = Thread(target=self._process_loop, daemon=True)
        self.process_thread.start()
        
        logger.info("Started task processing")
    
    def stop_processing(self):
        """Arrête le traitement des tâches."""
        if not self.processing:
            return
        
        self.processing = False
        self.stop_event.set()
        
        if self.process_thread:
            self.process_thread.join(timeout=10)
        
        logger.info("Stopped task processing")
    
    def _process_loop(self):
        """Boucle de traitement des tâches."""
        while self.processing and not self.stop_event.is_set():
            try:
                task = self.queue.get_next_task()
                
                if task:
                    self._process_task(task)
                else:
                    # Pas de tâche, attendre
                    time.sleep(1)
                    
            except Exception as e:
                logger.error(f"Error in task processing loop: {e}")
                time.sleep(5)
    
    def _process_task(self, task: Task):
        """
        Traite une tâche.
        
        Args:
            task: Tâche à traiter
        """
        logger.info(f"Processing task {task.id} (attempt {task.attempts + 1}/{task.max_attempts})")
        
        task.attempts += 1
        
        try:
            # Vérifier si on a un handler pour ce type de tâche
            if task.task_type not in self.task_handlers:
                raise ValueError(f"No handler registered for task type: {task.task_type}")
            
            handler = self.task_handlers[task.task_type]
            
            # Traiter la tâche avec timeout
            success = handler(task.data)
            
            if success:
                task.status = TaskStatus.COMPLETED
                logger.info(f"Task {task.id} completed successfully")
            else:
                raise Exception("Task handler returned False")
                
        except Exception as e:
            error_msg = str(e)
            task.last_error = error_msg
            
            logger.error(f"Task {task.id} failed: {error_msg}")
            
            # Décider si on retry
            if task.attempts < task.max_attempts:
                task.status = TaskStatus.RETRY
                task.next_retry = self.retry_strategy.get_next_retry_time(task.attempts)
                
                logger.info(f"Task {task.id} will retry at {task.next_retry}")
            else:
                task.status = TaskStatus.FAILED
                logger.error(f"Task {task.id} failed permanently after {task.attempts} attempts")
                
                # Envoyer alerte pour échec définitif
                self._send_alert(ErrorLevel.CRITICAL, f"Task {task.id} failed permanently", {
                    'task_type': task.task_type,
                    'attempts': task.attempts,
                    'error': error_msg
                })
        
        # Mettre à jour la tâche
        self.queue.update_task(task)
    
    def _send_alert(self, level: ErrorLevel, message: str, details: Dict[str, Any] = None):
        """
        Envoie une alerte.
        
        Args:
            level: Niveau d'alerte
            message: Message d'alerte
            details: Détails supplémentaires
        """
        # Log l'alerte
        logger.log(getattr(logging, level.value.upper()), message)
        
        # Enregistrer dans la base
        self._log_error(ErrorEvent(
            timestamp=datetime.now(),
            level=level,
            component='error_handler',
            message=message,
            details=details
        ))
        
        # Envoyer email si configuré
        if self.alert_config.get('email_enabled') and level in [ErrorLevel.ERROR, ErrorLevel.CRITICAL]:
            self._send_email_alert(level, message, details)
    
    def _send_email_alert(self, level: ErrorLevel, message: str, details: Dict[str, Any] = None):
        """
        Envoie une alerte par email.
        
        Args:
            level: Niveau d'alerte
            message: Message d'alerte
            details: Détails supplémentaires
        """
        try:
            email_config = self.alert_config.get('email', {})
            
            if not email_config.get('smtp_server'):
                return
            
            msg = EmailMessage()
            msg['Subject'] = f"[PostFlow {level.value.upper()}] {message}"
            msg['From'] = email_config.get('from_email')
            msg['To'] = email_config.get('to_email')
            
            body = f"Alerte PostFlow\n\n"
            body += f"Niveau: {level.value.upper()}\n"
            body += f"Message: {message}\n"
            body += f"Timestamp: {datetime.now().isoformat()}\n\n"
            
            if details:
                body += "Détails:\n"
                for key, value in details.items():
                    body += f"  {key}: {value}\n"
            
            msg.set_content(body)
            
            with smtplib.SMTP(email_config.get('smtp_server'), email_config.get('smtp_port', 587)) as server:
                if email_config.get('smtp_tls'):
                    server.starttls()
                if email_config.get('smtp_user'):
                    server.login(email_config.get('smtp_user'), email_config.get('smtp_password'))
                server.send_message(msg)
                
            logger.info(f"Sent email alert for {level.value}")
            
        except Exception as e:
            logger.error(f"Failed to send email alert: {e}")
    
    def _log_error(self, event: ErrorEvent):
        """
        Enregistre un événement d'erreur.
        
        Args:
            event: Événement d'erreur
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.execute('''
                    INSERT INTO error_log (timestamp, level, component, message, details, traceback, task_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    event.timestamp.isoformat(),
                    event.level.value,
                    event.component,
                    event.message,
                    json.dumps(event.details) if event.details else None,
                    event.traceback,
                    event.task_id
                ))
                conn.commit()
        except Exception as e:
            logger.error(f"Failed to log error event: {e}")
    
    def get_status(self) -> Dict[str, Any]:
        """
        Récupère le statut du gestionnaire d'erreurs.
        
        Returns:
            Dict: Statut complet
        """
        return {
            'processing': self.processing,
            'queue_stats': self.queue.get_statistics(),
            'health_status': self.health_monitor.get_status(),
            'registered_handlers': list(self.task_handlers.keys())
        }
    
    def cleanup(self):
        """Nettoie les anciennes données."""
        deleted = self.queue.cleanup_old_tasks()
        logger.info(f"Cleaned up {deleted} old tasks")
        
        # Nettoyer aussi les logs d'erreur
        try:
            cutoff_date = datetime.now() - timedelta(days=30)
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('DELETE FROM error_log WHERE timestamp < ?', (cutoff_date.isoformat(),))
                deleted_logs = cursor.rowcount
                conn.commit()
                
            logger.info(f"Cleaned up {deleted_logs} old error logs")
        except Exception as e:
            logger.error(f"Failed to cleanup error logs: {e}")
