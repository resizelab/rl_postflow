"""
File Watcher for UNDLM PostFlow
Détecte les nouveaux rendus dans la structure LucidLink et déclenche le workflow automatique
Version renforcée avec gestion d'erreurs robuste
"""

import os
import time
import logging
from pathlib import Path
from typing import Dict, List, Optional, Callable, Any
from datetime import datetime, timedelta
from threading import Thread, Event
import re
from dataclasses import dataclass
import uuid

from .error_handler import ErrorHandler, ErrorLevel

logger = logging.getLogger(__name__)


@dataclass
class FileEvent:
    """Événement de fichier détecté."""
    file_path: str
    shot_nomenclature: str
    version: int
    event_type: str  # 'created', 'modified'
    timestamp: datetime
    file_size: int


class LucidLinkWatcher:
    """
    Surveillance des fichiers sur LucidLink pour détecter les nouveaux rendus.
    Utilise le polling pour détecter les changements car LucidLink peut ne pas 
    supporter les événements système natifs.
    Version renforcée avec gestion d'erreurs robuste.
    """
    
    def __init__(self, config: Dict[str, Any], error_handler: Optional[ErrorHandler] = None):
        """
        Initialise le watcher.
        
        Args:
            config: Configuration avec chemins à surveiller
            error_handler: Gestionnaire d'erreurs (optionnel)
        """
        self.config = config
        self.error_handler = error_handler
        self.base_path = Path(config.get('base_path', '/Volumes/resizelab/o2b-undllm'))
        self.watch_paths = [
            self.base_path / "4_OUT" / "2_FROM_VFX" / "BY_SHOT",
            self.base_path / "3_PROJECTS" / "2_VFX" / "SEQUENCES"
        ]
        
        # Configuration du polling
        self.polling_interval = config.get('polling_interval', 5)  # secondes
        self.min_file_age = config.get('min_file_age', 10)  # secondes
        self.supported_extensions = config.get('supported_extensions', ['.mov', '.mp4', '.avi'])
        
        # Configuration de robustesse
        self.max_scan_errors = config.get('max_scan_errors', 5)
        self.error_backoff = config.get('error_backoff', 30)  # secondes
        self.path_check_interval = config.get('path_check_interval', 300)  # secondes
        
        # État interne
        self.known_files: Dict[str, Dict[str, Any]] = {}
        self.callbacks: List[Callable[[FileEvent], None]] = []
        self.running = False
        self.stop_event = Event()
        self.watcher_thread: Optional[Thread] = None
        
        # Compteurs d'erreurs
        self.scan_error_count = 0
        self.last_path_check = datetime.now()
        self.path_availability: Dict[str, bool] = {}
        
        # Cache pour éviter les logs répétitifs
        self.last_scan_results: Dict[str, int] = {}  # directory_name -> file_count
        self.initial_scan_done = False
        
        # Pattern pour extraire la nomenclature et version
        self.shot_pattern = re.compile(r'(UNDLM_\d{5}).*[_v](\d{3})\.(\w+)$')
        
        # État pour éviter les logs répétitifs
        self.last_health_state = None
        
        # Enregistrer les health checks
        if self.error_handler:
            self.error_handler.health_monitor.register_check(
                'lucidlink_paths', self._check_paths_health
            )
            self.error_handler.health_monitor.register_check(
                'watcher_running', lambda: self.running
            )
        
    def _check_paths_health(self) -> bool:
        """
        Vérifie la santé des chemins surveillés.
        
        Returns:
            bool: True si au moins un chemin est accessible
        """
        accessible_paths = 0
        current_state = {}
        
        for path in self.watch_paths:
            try:
                is_accessible = path.exists() and path.is_dir()
                current_state[str(path)] = is_accessible
                if is_accessible:
                    accessible_paths += 1
            except Exception as e:
                logger.warning(f"Cannot check path {path}: {e}")
                current_state[str(path)] = False
        
        # Seulement logger/alerter si le state a changé
        if self.last_health_state != current_state:
            self.path_availability = current_state
            self.last_health_state = current_state.copy()
            
            # Logger les changements
            if accessible_paths == 0:
                logger.error("No accessible watch paths found")
            else:
                logger.info(f"Health check: {accessible_paths}/{len(self.watch_paths)} paths accessible")
        
        return accessible_paths > 0
    
    def add_callback(self, callback: Callable[[FileEvent], None]):
        """Ajoute un callback à appeler lors de détection d'un nouveau fichier."""
        self.callbacks.append(callback)
    
    def start(self):
        """Démarre la surveillance."""
        if self.running:
            logger.warning("Watcher already running")
            return
        
        logger.info("Starting LucidLink file watcher")
        self.running = True
        self.stop_event.clear()
        
        # Vérifier les chemins
        if not self._check_paths_health():
            error_msg = "No accessible watch paths found"
            logger.error(error_msg)
            if self.error_handler:
                self.error_handler._send_alert(ErrorLevel.CRITICAL, error_msg, {
                    'watch_paths': [str(p) for p in self.watch_paths],
                    'path_availability': self.path_availability
                })
            # Arrêter le watcher si aucun chemin n'est accessible
            self.running = False
            return
        
        # Scan initial pour établir l'état de base
        try:
            self._initial_scan()
        except Exception as e:
            logger.error(f"Initial scan failed: {e}")
            if self.error_handler:
                self.error_handler._send_alert(ErrorLevel.ERROR, f"Initial scan failed: {e}")
            # Continuer quand même
        
        # Démarrer le thread de surveillance
        self.watcher_thread = Thread(target=self._watch_loop, daemon=True)
        self.watcher_thread.start()
        
        logger.info(f"File watcher started, monitoring {len(self.watch_paths)} paths")
    
    def stop(self):
        """Arrête la surveillance."""
        if not self.running:
            return
        
        logger.info("Stopping file watcher")
        self.running = False
        self.stop_event.set()
        
        if self.watcher_thread:
            self.watcher_thread.join(timeout=10)
        
        logger.info("File watcher stopped")
    
    def _initial_scan(self):
        """Scan initial pour établir l'état de base des fichiers."""
        logger.info("Performing initial file scan")
        
        for watch_path in self.watch_paths:
            if not watch_path.exists():
                logger.warning(f"Watch path does not exist: {watch_path}")
                continue
            
            try:
                for file_path in self._scan_directory(watch_path):
                    file_info = self._get_file_info(file_path)
                    if file_info:
                        self.known_files[str(file_path)] = file_info
            except Exception as e:
                logger.error(f"Failed to scan {watch_path}: {e}")
                if self.error_handler:
                    self.error_handler._send_alert(ErrorLevel.WARNING, f"Failed to scan directory during initial scan: {e}", {
                        'path': str(watch_path)
                    })
        
        logger.info(f"Initial scan complete, tracking {len(self.known_files)} files")
        self.initial_scan_done = True
    
    def _watch_loop(self):
        """Boucle principale de surveillance."""
        while self.running and not self.stop_event.is_set():
            try:
                # Vérifier périodiquement la disponibilité des chemins
                if (datetime.now() - self.last_path_check).total_seconds() > self.path_check_interval:
                    self._check_paths_health()
                    self.last_path_check = datetime.now()
                
                self._check_for_changes()
                self.scan_error_count = 0  # Reset sur succès
                time.sleep(self.polling_interval)
                
            except Exception as e:
                self.scan_error_count += 1
                error_msg = f"Error in watch loop (attempt {self.scan_error_count}): {e}"
                logger.error(error_msg)
                
                if self.error_handler:
                    level = ErrorLevel.WARNING if self.scan_error_count < self.max_scan_errors else ErrorLevel.ERROR
                    self.error_handler._send_alert(level, error_msg, {
                        'scan_error_count': self.scan_error_count,
                        'max_scan_errors': self.max_scan_errors
                    })
                
                # Arrêter si trop d'erreurs
                if self.scan_error_count >= self.max_scan_errors:
                    logger.critical(f"Too many scan errors ({self.scan_error_count}), stopping watcher")
                    self.running = False
                    break
                
                # Backoff exponentiel
                sleep_time = min(self.error_backoff * (2 ** (self.scan_error_count - 1)), 300)
                time.sleep(sleep_time)
    
    def _check_for_changes(self):
        """Vérifie les changements dans les dossiers surveillés."""
        current_files = {}
        
        # Scanner tous les dossiers surveillés
        for watch_path in self.watch_paths:
            if not watch_path.exists():
                continue
            
            try:
                for file_path in self._scan_directory(watch_path):
                    file_info = self._get_file_info(file_path)
                    if file_info:
                        current_files[str(file_path)] = file_info
            except Exception as e:
                logger.error(f"Failed to scan {watch_path}: {e}")
                if self.error_handler:
                    self.error_handler._send_alert(ErrorLevel.WARNING, f"Failed to scan directory: {e}", {
                        'path': str(watch_path)
                    })
                continue
        
        # Détecter les nouveaux fichiers et les modifications
        for file_path, file_info in current_files.items():
            if file_path not in self.known_files:
                # Nouveau fichier
                if self._is_file_ready(file_info):
                    self._handle_new_file(file_path, file_info)
            else:
                # Fichier existant - vérifier les modifications
                old_info = self.known_files[file_path]
                if (file_info['size'] != old_info['size'] or 
                    file_info['modified'] != old_info['modified']):
                    if self._is_file_ready(file_info):
                        self._handle_modified_file(file_path, file_info)
        
        # Mettre à jour l'état connu
        self.known_files = current_files
    
    def _scan_directory(self, directory: Path) -> List[Path]:
        """Scan récursif d'un dossier pour trouver les fichiers vidéo."""
        files = []
        rejected_files = []
        try:
            for item in directory.rglob("*"):
                if item.is_file():
                    filename = item.name
                    
                    # Ignorer les fichiers cachés
                    if filename.startswith('.'):
                        continue
                    
                    # Vérifier l'extension
                    if item.suffix.lower() not in self.supported_extensions:
                        # Log seulement pour les fichiers qui pourraient être des vidéos
                        potential_video_extensions = {'.mp4', '.mov', '.avi', '.mkv', '.mxf', '.wmv', '.flv', '.webm', '.m4v'}
                        if item.suffix.lower() in potential_video_extensions or item.suffix.lower() in ['.tmp', '.part']:
                            rejected_files.append(f"❌ Extension non supportée: {filename} (extension: {item.suffix})")
                        continue
                    
                    # Vérifier la nomenclature
                    if not self._is_valid_shot_file(filename):
                        # Analyser pourquoi le fichier est rejeté
                        shot_info = self._extract_shot_info(filename)
                        if not shot_info:
                            # Essayer d'extraire au moins la nomenclature
                            nomenclature = self._extract_shot_nomenclature(filename)
                            if nomenclature:
                                rejected_files.append(f"⚠️ Nomenclature détectée mais pattern invalide: {filename} (nomenclature: {nomenclature})")
                            else:
                                rejected_files.append(f"❌ Aucune nomenclature détectée: {filename} (attendu: UNDLM_##### ou format similaire)")
                        continue
                    
                    # Fichier valide
                    files.append(item)
                    
        except Exception as e:
            logger.error(f"Error scanning directory {directory}: {e}")
            raise  # Re-lancer pour être gérée par le niveau supérieur
        
        # Logger les fichiers rejetés de manière groupée
        dir_name = directory.name
        current_count = len(files)
        previous_count = self.last_scan_results.get(dir_name, -1)
        
        if rejected_files:
            logger.info(f"📁 Scan terminé dans {dir_name}: {current_count} fichiers valides, {len(rejected_files)} rejetés")
            for rejection in rejected_files[:10]:  # Limiter à 10 pour éviter le spam
                logger.warning(rejection)
            if len(rejected_files) > 10:
                logger.warning(f"... et {len(rejected_files) - 10} autres fichiers rejetés")
        elif not self.initial_scan_done or current_count != previous_count:
            # Logger seulement si c'est le premier scan ou s'il y a un changement dans le nombre de fichiers
            if not self.initial_scan_done:
                logger.info(f"📁 Scan initial dans {dir_name}: {current_count} fichiers valides trouvés")
            elif current_count > previous_count:
                logger.info(f"📁 Nouveaux fichiers dans {dir_name}: {current_count} fichiers (+{current_count - previous_count})")
            elif current_count < previous_count:
                logger.info(f"📁 Fichiers supprimés dans {dir_name}: {current_count} fichiers (-{previous_count - current_count})")
        else:
            # Scan silencieux - pas de changement
            logger.debug(f"📁 Scan silencieux dans {dir_name}: {current_count} fichiers (aucun changement)")
        
        # Mettre à jour le cache
        self.last_scan_results[dir_name] = current_count
        
        return files
    
    def _get_file_info(self, file_path: Path) -> Optional[Dict[str, Any]]:
        """Obtient les informations d'un fichier."""
        try:
            stat = file_path.stat()
            return {
                'size': stat.st_size,
                'modified': stat.st_mtime,
                'created': stat.st_ctime,
                'path': str(file_path)
            }
        except Exception as e:
            logger.error(f"Error getting file info for {file_path}: {e}")
            return None
    
    def _is_file_ready(self, file_info: Dict[str, Any]) -> bool:
        """
        Vérifie si un fichier est prêt à être traité.
        Attend que le fichier soit stable (pas de modification récente).
        """
        current_time = time.time()
        return (current_time - file_info['modified']) > self.min_file_age
    
    def _is_valid_shot_file(self, filename: str) -> bool:
        """Vérifie si le nom de fichier correspond au pattern attendu."""
        # Utiliser la méthode d'extraction améliorée
        shot_info = self._extract_shot_info(filename)
        return shot_info is not None
    
    def _extract_shot_info(self, filename: str) -> Optional[Dict[str, Any]]:
        """Extrait les informations du plan depuis le nom de fichier."""
        import re
        
        # Pattern strict pour UNDLM_#####_v###.ext
        strict_pattern = re.compile(r'^(UNDLM_\d{5})_v(\d{3})\.(\w+)$')
        strict_match = strict_pattern.match(filename)
        if strict_match:
            return {
                'nomenclature': strict_match.group(1),
                'version': int(strict_match.group(2)),
                'extension': strict_match.group(3)
            }
        
        # Pattern pour UNDLM_#####.ext (sans version explicite)
        simple_pattern = re.compile(r'^(UNDLM_\d{5})\.(\w+)$')
        simple_match = simple_pattern.match(filename)
        if simple_match:
            # Extraire le numéro de shot comme version
            shot_number = simple_match.group(1).split('_')[1]  # Récupérer les 5 chiffres
            return {
                'nomenclature': simple_match.group(1),
                'version': int(shot_number),  # Utiliser le numéro de shot comme version
                'extension': simple_match.group(2)
            }
        
        # Pattern pour UNDLM_#####_[texte].ext (comme draft, final, etc.)
        text_version_pattern = re.compile(r'^(UNDLM_\d{5})_([a-zA-Z]+)\.(\w+)$')
        text_match = text_version_pattern.match(filename)
        if text_match:
            version_text = text_match.group(2).lower()
            # Convertir certains mots en versions numériques
            version_map = {
                'draft': 1,
                'final': 999,
                'master': 1000,
                'approved': 500
            }
            version = version_map.get(version_text, 1)
            return {
                'nomenclature': text_match.group(1),
                'version': version,
                'extension': text_match.group(3)
            }
        
        # Tous les autres formats sont rejetés
        return None
    
    def _extract_shot_nomenclature(self, filename: str) -> str:
        """
        Extrait la nomenclature de shot d'un nom de fichier.
        
        Args:
            filename: Nom du fichier
            
        Returns:
            Nomenclature du shot (ex: UNDLM_12345) ou chaîne vide si non trouvée
        """
        import re
        
        # Pattern strict pour UNDLM_##### (5 chiffres exactement)
        strict_pattern = r'(UNDLM_\d{5})'
        strict_match = re.search(strict_pattern, filename)
        if strict_match:
            return strict_match.group(1)
        
        # Pattern pour détecter des tentatives de nomenclature UNDLM mais incorrectes
        partial_pattern = r'(UNDLM_\d{1,4}|UNDLM_\d{6,}|UNDL_\d+|UND_\d+)'
        partial_match = re.search(partial_pattern, filename)
        if partial_match:
            # Retourner la nomenclature partielle pour les logs
            return partial_match.group(1)
        
        # Pattern pour d'autres formats qui pourraient être des tentatives
        other_pattern = r'([A-Z]{3,6}_\d{3,6})'
        other_match = re.search(other_pattern, filename)
        if other_match:
            return other_match.group(1)
            
        return ""
    
    def _extract_version(self, filename: str) -> int:
        """
        Extrait le numéro de version d'un nom de fichier.
        
        Args:
            filename: Nom du fichier
            
        Returns:
            Numéro de version (défaut: 1)
        """
        import re
        
        # Pattern pour extraire la version (ex: v001, v002, v123)
        pattern = r'v(\d+)'
        match = re.search(pattern, filename.lower())
        
        if match:
            return int(match.group(1))
        
        # Version par défaut si pas trouvée
        return 1
    
    def _should_process_file(self, filename: str) -> bool:
        """
        Détermine si un fichier doit être traité.
        
        Args:
            filename: Nom du fichier
            
        Returns:
            True si le fichier doit être traité
        """
        # Extensions vidéo acceptées
        valid_extensions = {'.mov', '.mp4', '.avi', '.mkv', '.mxf', '.prores'}
        
        # Vérifier l'extension
        file_path = Path(filename)
        if file_path.suffix.lower() not in valid_extensions:
            return False
        
        # Vérifier si le fichier contient une nomenclature valide
        nomenclature = self._extract_shot_nomenclature(filename)
        if not nomenclature:
            return False
        
        # Ignorer les fichiers temporaires
        if filename.startswith('.') or filename.startswith('~'):
            return False
        
        # Ignorer les fichiers avec des patterns spécifiques
        ignore_patterns = ['temp', 'tmp', 'backup', 'cache']
        filename_lower = filename.lower()
        
        for pattern in ignore_patterns:
            if pattern in filename_lower:
                return False
        
        return True
    
    def _handle_new_file(self, file_path: str, file_info: Dict[str, Any]):
        """Gère la détection d'un nouveau fichier."""
        filename = Path(file_path).name
        shot_info = self._extract_shot_info(filename)
        
        if not shot_info:
            logger.warning(f"❌ Impossible d'extraire les informations de shot: {filename}")
            logger.warning(f"   Pattern attendu: UNDLM_##### ou UNDLM_#####_v### ou similaire")
            return
        
        logger.info(f"🎬 Nouveau fichier détecté: {filename}")
        logger.info(f"   📝 Shot: {shot_info['nomenclature']}")
        logger.info(f"   🔢 Version: {shot_info['version']}")
        logger.info(f"   📦 Taille: {file_info['size']:,} bytes")
        
        # Créer l'événement
        event = FileEvent(
            file_path=file_path,
            shot_nomenclature=shot_info['nomenclature'],
            version=shot_info['version'],
            event_type='created',
            timestamp=datetime.now(),
            file_size=file_info['size']
        )
        
        # Appeler les callbacks
        self._notify_callbacks(event)
    
    def _handle_modified_file(self, file_path: str, file_info: Dict[str, Any]):
        """Gère la modification d'un fichier existant."""
        filename = Path(file_path).name
        shot_info = self._extract_shot_info(filename)
        
        if not shot_info:
            return
        
        logger.info(f"File modified: {filename} ({shot_info['nomenclature']} v{shot_info['version']:03d})")
        
        # Créer l'événement
        event = FileEvent(
            file_path=file_path,
            shot_nomenclature=shot_info['nomenclature'],
            version=shot_info['version'],
            event_type='modified',
            timestamp=datetime.now(),
            file_size=file_info['size']
        )
        
        # Appeler les callbacks
        self._notify_callbacks(event)
    
    def _notify_callbacks(self, event: FileEvent):
        """Notifie tous les callbacks enregistrés."""
        for callback in self.callbacks:
            try:
                callback(event)
            except Exception as e:
                logger.error(f"Error in callback: {e}")
                if self.error_handler:
                    self.error_handler._send_alert(ErrorLevel.ERROR, f"Callback error: {e}", {
                        'event': {
                            'file_path': event.file_path,
                            'shot_nomenclature': event.shot_nomenclature,
                            'version': event.version,
                            'event_type': event.event_type
                        }
                    })
    
    def get_status(self) -> Dict[str, Any]:
        """Retourne le statut du watcher."""
        return {
            'running': self.running,
            'watched_paths': [str(p) for p in self.watch_paths],
            'path_availability': self.path_availability,
            'tracked_files': len(self.known_files),
            'polling_interval': self.polling_interval,
            'callbacks_registered': len(self.callbacks),
            'scan_error_count': self.scan_error_count,
            'last_path_check': self.last_path_check.isoformat() if self.last_path_check else None
        }


class WorkflowTrigger:
    """
    Déclenche le workflow automatique lors de la détection de nouveaux fichiers.
    Version renforcée avec retry automatique via le gestionnaire d'erreurs.
    """
    
    def __init__(self, frameio_client, google_sheets_client, discord_notifier, config, error_handler: Optional[ErrorHandler] = None):
        """
        Initialise le trigger de workflow.
        
        Args:
            frameio_client: Client Frame.io
            google_sheets_client: Client Google Sheets
            discord_notifier: Notifieur Discord
            config: Configuration
            error_handler: Gestionnaire d'erreurs (optionnel)
        """
        self.frameio = frameio_client
        self.sheets = google_sheets_client
        self.google_sheets = google_sheets_client  # Alias pour les tests
        self.discord = discord_notifier
        self.config = config
        self.error_handler = error_handler
        
        # Cache pour éviter les doublons
        self.processed_files: Dict[str, datetime] = {}
        self.cache_duration = timedelta(minutes=30)
        
        # Enregistrer les handlers de tâches si error_handler disponible
        if self.error_handler:
            self.error_handler.register_task_handler('upload_frameio', self._handle_upload_task)
            self.error_handler.register_task_handler('update_sheets', self._handle_sheets_task)
            self.error_handler.register_task_handler('send_discord', self._handle_discord_task)
    
    def handle_new_render(self, event: FileEvent):
        """
        Gère un nouveau rendu détecté.
        
        Args:
            event: Événement de fichier
        """
        # Vérifier si déjà traité récemment
        cache_key = f"{event.shot_nomenclature}_v{event.version:03d}"
        if self._is_recently_processed(cache_key):
            logger.info(f"Skipping recently processed file: {cache_key}")
            return
        
        logger.info(f"Processing new render: {event.shot_nomenclature} v{event.version:03d}")
        
        if self.error_handler:
            # Utiliser le système de queue pour robustesse
            self._queue_workflow_tasks(event)
        else:
            # Traitement direct (mode legacy)
            self._process_direct(event)
    
    def _queue_workflow_tasks(self, event: FileEvent):
        """
        Met en queue les tâches du workflow.
        
        Args:
            event: Événement de fichier
        """
        cache_key = f"{event.shot_nomenclature}_v{event.version:03d}"
        
        # Tâche d'upload Frame.io (priorité haute)
        upload_task_id = self.error_handler.add_task(
            'upload_frameio',
            {
                'event': {
                    'file_path': event.file_path,
                    'shot_nomenclature': event.shot_nomenclature,
                    'version': event.version,
                    'timestamp': event.timestamp.isoformat(),
                    'file_size': event.file_size
                },
                'cache_key': cache_key
            },
            priority=0,
            max_attempts=3
        )
        
        # Tâche Google Sheets (dépendante de l'upload)
        sheets_task_id = self.error_handler.add_task(
            'update_sheets',
            {
                'event': {
                    'file_path': event.file_path,
                    'shot_nomenclature': event.shot_nomenclature,
                    'version': event.version,
                    'timestamp': event.timestamp.isoformat(),
                    'file_size': event.file_size
                },
                'cache_key': cache_key,
                'upload_task_id': upload_task_id
            },
            priority=1,
            max_attempts=5
        )
        
        # Tâche Discord (dépendante de l'upload)
        discord_task_id = self.error_handler.add_task(
            'send_discord',
            {
                'event': {
                    'file_path': event.file_path,
                    'shot_nomenclature': event.shot_nomenclature,
                    'version': event.version,
                    'timestamp': event.timestamp.isoformat(),
                    'file_size': event.file_size
                },
                'cache_key': cache_key,
                'upload_task_id': upload_task_id
            },
            priority=2,
            max_attempts=3
        )
        
        logger.info(f"Queued workflow tasks for {cache_key}: upload={upload_task_id}, sheets={sheets_task_id}, discord={discord_task_id}")
    
    def _handle_upload_task(self, data: Dict[str, Any]) -> bool:
        """
        Handler pour la tâche d'upload Frame.io.
        
        Args:
            data: Données de la tâche
            
        Returns:
            bool: True si succès
        """
        try:
            event_data = data['event']
            cache_key = data['cache_key']
            
            # Reconstruire l'événement
            event = FileEvent(
                file_path=event_data['file_path'],
                shot_nomenclature=event_data['shot_nomenclature'],
                version=event_data['version'],
                event_type='created',
                timestamp=datetime.fromisoformat(event_data['timestamp']),
                file_size=event_data['file_size']
            )
            
            # Vérifier si le fichier existe toujours
            if not Path(event.file_path).exists():
                logger.error(f"File no longer exists: {event.file_path}")
                return False
            
            # Upload vers Frame.io
            frameio_asset_id = self._upload_to_frameio(event)
            
            if frameio_asset_id:
                # Stocker l'ID pour les autres tâches
                self._store_upload_result(cache_key, frameio_asset_id)
                
                # Marquer comme traité
                self.processed_files[cache_key] = datetime.now()
                
                logger.info(f"Successfully uploaded {cache_key} to Frame.io (ID: {frameio_asset_id})")
                return True
            else:
                logger.error(f"Failed to upload {cache_key} to Frame.io")
                return False
                
        except Exception as e:
            logger.error(f"Error in upload task: {e}")
            return False
    
    def _handle_sheets_task(self, data: Dict[str, Any]) -> bool:
        """
        Handler pour la tâche Google Sheets.
        
        Args:
            data: Données de la tâche
            
        Returns:
            bool: True si succès
        """
        try:
            event_data = data['event']
            cache_key = data['cache_key']
            
            # Récupérer l'ID Frame.io
            frameio_asset_id = self._get_upload_result(cache_key)
            if not frameio_asset_id:
                logger.error(f"No Frame.io asset ID found for {cache_key}")
                return False
            
            # Reconstruire l'événement
            event = FileEvent(
                file_path=event_data['file_path'],
                shot_nomenclature=event_data['shot_nomenclature'],
                version=event_data['version'],
                event_type='created',
                timestamp=datetime.fromisoformat(event_data['timestamp']),
                file_size=event_data['file_size']
            )
            
            # Mise à jour Google Sheets
            self._update_google_sheets(event, frameio_asset_id)
            
            logger.info(f"Successfully updated Google Sheets for {cache_key}")
            return True
            
        except Exception as e:
            logger.error(f"Error in sheets task: {e}")
            return False
    
    def _handle_discord_task(self, data: Dict[str, Any]) -> bool:
        """
        Handler pour la tâche Discord.
        
        Args:
            data: Données de la tâche
            
        Returns:
            bool: True si succès
        """
        try:
            event_data = data['event']
            cache_key = data['cache_key']
            
            # Récupérer l'ID Frame.io
            frameio_asset_id = self._get_upload_result(cache_key)
            if not frameio_asset_id:
                logger.error(f"No Frame.io asset ID found for {cache_key}")
                return False
            
            # Reconstruire l'événement
            event = FileEvent(
                file_path=event_data['file_path'],
                shot_nomenclature=event_data['shot_nomenclature'],
                version=event_data['version'],
                event_type='created',
                timestamp=datetime.fromisoformat(event_data['timestamp']),
                file_size=event_data['file_size']
            )
            
            # Notification Discord
            self._send_discord_notification(event, frameio_asset_id)
            
            logger.info(f"Successfully sent Discord notification for {cache_key}")
            return True
            
        except Exception as e:
            logger.error(f"Error in discord task: {e}")
            return False
    
    def _store_upload_result(self, cache_key: str, frameio_asset_id: str):
        """
        Stocke le résultat d'upload pour les autres tâches.
        
        Args:
            cache_key: Clé de cache
            frameio_asset_id: ID de l'asset Frame.io
        """
        # Stocker temporairement (pourrait être en base de données)
        if not hasattr(self, '_upload_results'):
            self._upload_results = {}
        self._upload_results[cache_key] = frameio_asset_id
    
    def _get_upload_result(self, cache_key: str) -> Optional[str]:
        """
        Récupère le résultat d'upload.
        
        Args:
            cache_key: Clé de cache
            
        Returns:
            str: ID de l'asset Frame.io ou None
        """
        if not hasattr(self, '_upload_results'):
            return None
        return self._upload_results.get(cache_key)
    
    def _process_direct(self, event: FileEvent):
        """
        Traitement direct (mode legacy sans queue).
        
        Args:
            event: Événement de fichier
        """
        cache_key = f"{event.shot_nomenclature}_v{event.version:03d}"
        
        try:
            # 1. Upload vers Frame.io
            frameio_asset_id = self._upload_to_frameio(event)
            
            if frameio_asset_id:
                # 2. Mise à jour Google Sheets
                self._update_google_sheets(event, frameio_asset_id)
                
                # 3. Notification Discord
                self._send_discord_notification(event, frameio_asset_id)
                
                # Marquer comme traité
                self.processed_files[cache_key] = datetime.now()
                
                logger.info(f"Successfully processed render: {cache_key}")
            else:
                logger.error(f"Failed to upload {cache_key} to Frame.io")
                
        except Exception as e:
            logger.error(f"Error processing render {cache_key}: {e}")
            if self.error_handler:
                self.error_handler._send_alert(ErrorLevel.ERROR, f"Error processing render {cache_key}: {e}", {
                    'cache_key': cache_key,
                    'event': {
                        'file_path': event.file_path,
                        'shot_nomenclature': event.shot_nomenclature,
                        'version': event.version
                    }
                })
    
    def _is_recently_processed(self, cache_key: str) -> bool:
        """Vérifie si un fichier a été traité récemment."""
        if cache_key not in self.processed_files:
            return False
        
        processed_time = self.processed_files[cache_key]
        return datetime.now() - processed_time < self.cache_duration
    
    def _upload_to_frameio(self, event: FileEvent) -> Optional[str]:
        """Upload un fichier vers Frame.io."""
        try:
            # Créer ou obtenir le dossier pour ce plan
            folder_id = self.frameio.create_shot_folder_structure(event.shot_nomenclature)
            
            # Métadonnées pour Frame.io
            metadata = {
                "description": f"Version {event.version} - {event.shot_nomenclature}",
                "custom_metadata": {
                    "shot": event.shot_nomenclature,
                    "version": event.version,
                    "pipeline_status": "review_uploaded",
                    "upload_date": event.timestamp.isoformat()
                }
            }
            
            # Upload
            asset_id = self.frameio.upload_video(event.file_path, folder_id, metadata)
            
            if asset_id:
                logger.info(f"Uploaded {event.shot_nomenclature} to Frame.io (ID: {asset_id})")
                return asset_id
            
        except Exception as e:
            logger.error(f"Frame.io upload failed: {e}")
        
        return None
    
    def _update_google_sheets(self, event: FileEvent, frameio_asset_id: str):
        """Met à jour Google Sheets avec les nouvelles informations."""
        try:
            # Construire l'URL Frame.io
            frameio_url = f"https://app.frame.io/reviews/{frameio_asset_id}"
            
            # Mettre à jour le statut
            success = self.sheets.update_shot_status(
                event.shot_nomenclature,
                "REVIEW_UPLOADED",
                "REVIEW_PROCESS",
                progress=90,
                notes=f"Version {event.version} uploaded for review"
            )
            
            if success:
                logger.info(f"Updated Google Sheets for {event.shot_nomenclature}")
            
        except Exception as e:
            logger.error(f"Google Sheets update failed: {e}")
    
    def _send_discord_notification(self, event: FileEvent, frameio_asset_id: str):
        """Envoie une notification Discord."""
        try:
            frameio_url = f"https://app.frame.io/reviews/{frameio_asset_id}"
            
            message = f"🎬 **Nouveau rendu disponible pour review**"
            
            embed = {
                "title": f"Shot {event.shot_nomenclature} - Version {event.version}",
                "description": "Un nouveau rendu est prêt pour validation",
                "color": 0x00ff00,
                "fields": [
                    {
                        "name": "Plan",
                        "value": event.shot_nomenclature,
                        "inline": True
                    },
                    {
                        "name": "Version",
                        "value": f"v{event.version:03d}",
                        "inline": True
                    },
                    {
                        "name": "Taille",
                        "value": f"{event.file_size / (1024*1024):.1f} MB",
                        "inline": True
                    },
                    {
                        "name": "Frame.io",
                        "value": f"[📺 Voir sur Frame.io]({frameio_url})",
                        "inline": False
                    }
                ],
                "timestamp": event.timestamp.isoformat(),
                "footer": {
                    "text": "UNDLM PostFlow"
                }
            }
            
            success = self.discord.send_message(message, embed)
            
            if success:
                logger.info(f"Sent Discord notification for {event.shot_nomenclature}")
            
        except Exception as e:
            logger.error(f"Discord notification failed: {e}")
    
    def cleanup_cache(self):
        """Nettoie le cache des fichiers traités."""
        current_time = datetime.now()
        expired_keys = [
            key for key, processed_time in self.processed_files.items()
            if current_time - processed_time > self.cache_duration
        ]
        
        for key in expired_keys:
            del self.processed_files[key]
        
        if expired_keys:
            logger.info(f"Cleaned {len(expired_keys)} expired entries from cache")
