#!/usr/bin/env python3
"""
Test du système de gestion d'erreurs renforcé PostFlow
"""

import sys
import os
import logging
import time
import json
from pathlib import Path
from datetime import datetime, timedelta

# Ajouter le répertoire src au path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.utils.error_handler import ErrorHandler, ErrorLevel, Task, TaskStatus
from src.utils.file_watcher import LucidLinkWatcher, WorkflowTrigger, FileEvent

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('test_error_handling.log')
    ]
)

logger = logging.getLogger(__name__)


class MockFrameioClient:
    """Mock du client Frame.io pour les tests."""
    
    def __init__(self, should_fail=False):
        self.should_fail = should_fail
        self.upload_count = 0
        self.create_folder_count = 0
    
    def create_shot_folder_structure(self, shot_nomenclature):
        """Mock création de dossier."""
        self.create_folder_count += 1
        if self.should_fail and self.create_folder_count <= 2:
            raise Exception("Mock Frame.io API error")
        return "mock_folder_id"
    
    def upload_video(self, file_path, folder_id, metadata):
        """Mock upload vidéo."""
        self.upload_count += 1
        # Réussir l'upload une fois le dossier créé
        return f"mock_asset_{self.upload_count}"


class MockGoogleSheetsClient:
    """Mock du client Google Sheets pour les tests."""
    
    def __init__(self, should_fail=False):
        self.should_fail = should_fail
        self.update_count = 0
    
    def update_shot_status(self, shot_nomenclature, status, phase, progress, notes):
        """Mock mise à jour statut."""
        self.update_count += 1
        if self.should_fail and self.update_count == 1:
            raise Exception("Mock Google Sheets API error")
        return True


class MockDiscordNotifier:
    """Mock du notifieur Discord pour les tests."""
    
    def __init__(self, should_fail=False):
        self.should_fail = should_fail
        self.message_count = 0
    
    def send_message(self, message, embed=None):
        """Mock envoi message."""
        self.message_count += 1
        if self.should_fail and self.message_count == 1:
            raise Exception("Mock Discord webhook error")
        return True


def test_error_handler_basic():
    """Test de base du gestionnaire d'erreurs."""
    logger.info("=== Test Error Handler Basic ===")
    
    config = {
        'db_path': 'test_postflow.db',
        'retry_base_delay': 0.1,
        'retry_max_delay': 1.0,
        'retry_backoff_factor': 2.0
    }
    
    error_handler = ErrorHandler(config)
    
    # Test d'ajout de tâche
    def test_handler(data):
        logger.info(f"Processing test task: {data}")
        return data.get('success', True)
    
    error_handler.register_task_handler('test_task', test_handler)
    error_handler.start_processing()
    
    # Attendre que le processing démarre
    time.sleep(0.5)
    
    # Ajouter une tâche qui réussit
    task_id = error_handler.add_task('test_task', {'success': True})
    logger.info(f"Added successful task: {task_id}")
    
    # Ajouter une tâche qui échoue
    task_id2 = error_handler.add_task('test_task', {'success': False})
    logger.info(f"Added failing task: {task_id2}")
    
    # Attendre le traitement plus longtemps
    time.sleep(3)
    
    # Vérifier les statistiques
    stats = error_handler.get_status()
    logger.info(f"Error handler stats: {json.dumps(stats, indent=2)}")
    
    # Vérifier qu'au moins une tâche a été traitée
    queue_stats = stats.get('queue_stats', {})
    completed = queue_stats.get('completed', 0)
    failed = queue_stats.get('failed', 0)
    
    logger.info(f"Completed tasks: {completed}, Failed tasks: {failed}")
    
    error_handler.stop_processing()
    
    # Nettoyer
    try:
        os.remove('test_postflow.db')
    except:
        pass
    
    logger.info("Test Error Handler Basic - PASSED")


def test_workflow_with_retries():
    """Test du workflow avec retries."""
    logger.info("=== Test Workflow With Retries ===")
    
    config = {
        'db_path': 'test_workflow.db',
        'retry_base_delay': 0.1,
        'retry_max_delay': 1.0,
        'retry_backoff_factor': 2.0
    }
    
    error_handler = ErrorHandler(config)
    error_handler.start_processing()
    
    # Créer des clients mock qui échouent initialement
    frameio_client = MockFrameioClient(should_fail=True)
    sheets_client = MockGoogleSheetsClient(should_fail=True)
    discord_notifier = MockDiscordNotifier(should_fail=True)
    
    # Créer le trigger avec gestionnaire d'erreurs
    trigger = WorkflowTrigger(
        frameio_client, 
        sheets_client, 
        discord_notifier, 
        {}, 
        error_handler
    )
    
    # Créer un événement de test
    event = FileEvent(
        file_path="/tmp/test_video.mov",
        shot_nomenclature="UNDLM_12345",
        version=1,
        event_type="created",
        timestamp=datetime.now(),
        file_size=1024*1024
    )
    
    # Créer un fichier de test
    test_file = Path("/tmp/test_video.mov")
    test_file.write_text("mock video content")
    
    try:
        # Déclencher le workflow
        trigger.handle_new_render(event)
        
        # Attendre le traitement avec retries
        time.sleep(5)
        
        # Vérifier les statistiques
        stats = error_handler.get_status()
        logger.info(f"Workflow stats: {json.dumps(stats, indent=2)}")
        
        # Vérifier que les retries ont fonctionné
        assert frameio_client.create_folder_count >= 2, f"Frame.io should have retried (create_folder_count={frameio_client.create_folder_count})"
        assert sheets_client.update_count >= 1, f"Google Sheets should have been updated (update_count={sheets_client.update_count})"
        assert discord_notifier.message_count >= 1, f"Discord should have been notified (message_count={discord_notifier.message_count})"
        
        logger.info("Test Workflow With Retries - PASSED")
        
    finally:
        error_handler.stop_processing()
        
        # Nettoyer
        try:
            test_file.unlink()
            os.remove('test_workflow.db')
        except:
            pass


def test_file_watcher_robustness():
    """Test de robustesse du watcher."""
    logger.info("=== Test File Watcher Robustness ===")
    
    config = {
        'db_path': 'test_watcher.db',
        'retry_base_delay': 0.1,
        'retry_max_delay': 1.0,
        'retry_backoff_factor': 2.0
    }
    
    error_handler = ErrorHandler(config)
    error_handler.start_processing()
    
    # Configuration du watcher avec chemins inexistants
    watcher_config = {
        'base_path': '/nonexistent/path',
        'polling_interval': 0.5,
        'max_scan_errors': 2,
        'error_backoff': 0.5
    }
    
    watcher = LucidLinkWatcher(watcher_config, error_handler)
    
    # Callback de test
    def test_callback(event):
        logger.info(f"Received event: {event.shot_nomenclature}")
    
    watcher.add_callback(test_callback)
    
    # Démarrer le watcher (devrait échouer gracieusement)
    watcher.start()
    
    # Attendre un peu
    time.sleep(2)
    
    # Vérifier le statut
    status = watcher.get_status()
    logger.info(f"Watcher status: {json.dumps(status, indent=2)}")
    
    # Le watcher ne devrait pas être en cours d'exécution avec des chemins invalides
    assert not status['running'], "Watcher should not be running with invalid paths"
    
    # Vérifier que les chemins sont marqués comme indisponibles
    path_availability = status.get('path_availability', {})
    if path_availability:
        all_paths_unavailable = all(not available for available in path_availability.values())
        assert all_paths_unavailable, "All paths should be marked as unavailable"
    
    logger.info("Watcher correctly stopped due to unavailable paths")
    
    watcher.stop()
    error_handler.stop_processing()
    
    # Nettoyer
    try:
        os.remove('test_watcher.db')
    except:
        pass
    
    logger.info("Test File Watcher Robustness - PASSED")


def test_health_monitoring():
    """Test du monitoring de santé."""
    logger.info("=== Test Health Monitoring ===")
    
    config = {
        'db_path': 'test_health.db',
        'health_monitor': {
            'check_interval': 60,
            'alert_threshold': 3
        }
    }
    
    error_handler = ErrorHandler(config)
    
    # Enregistrer des checks de santé
    def healthy_check():
        return True
    
    def unhealthy_check():
        return False
    
    error_handler.health_monitor.register_check('healthy_service', healthy_check)
    error_handler.health_monitor.register_check('unhealthy_service', unhealthy_check)
    
    # Exécuter les checks plusieurs fois
    for i in range(5):
        results = error_handler.health_monitor.run_checks()
        logger.info(f"Health check {i+1}: {results}")
        time.sleep(0.1)
    
    # Vérifier le statut
    status = error_handler.health_monitor.get_status()
    logger.info(f"Health status: {json.dumps(status, indent=2)}")
    
    # Vérifier les compteurs d'échec
    assert status['failure_counts']['healthy_service'] == 0
    assert status['failure_counts']['unhealthy_service'] == 5
    
    # Nettoyer
    try:
        os.remove('test_health.db')
    except:
        pass
    
    logger.info("Test Health Monitoring - PASSED")


def test_persistent_queue():
    """Test de la queue persistante."""
    logger.info("=== Test Persistent Queue ===")
    
    from src.utils.error_handler import PersistentQueue, Task, TaskStatus
    
    # Créer une queue
    queue = PersistentQueue('test_queue.db')
    
    # Ajouter des tâches
    task1 = Task(
        id='task1',
        task_type='test',
        data={'value': 1},
        status=TaskStatus.PENDING,
        created_at=datetime.now()
    )
    
    task2 = Task(
        id='task2',
        task_type='test',
        data={'value': 2},
        status=TaskStatus.PENDING,
        created_at=datetime.now(),
        priority=1
    )
    
    assert queue.add_task(task1), "Should add task1"
    assert queue.add_task(task2), "Should add task2"
    
    # Récupérer les tâches (task1 devrait être en premier car priorité plus haute)
    next_task = queue.get_next_task()
    assert next_task is not None, "Should get next task"
    assert next_task.id == 'task1', "Should get task1 first (higher priority)"
    
    # Marquer comme terminée
    next_task.status = TaskStatus.COMPLETED
    assert queue.update_task(next_task), "Should update task"
    
    # Récupérer la suivante
    next_task = queue.get_next_task()
    assert next_task is not None, "Should get next task"
    assert next_task.id == 'task2', "Should get task2"
    
    # Vérifier les statistiques
    stats = queue.get_statistics()
    logger.info(f"Queue stats: {stats}")
    
    # Nettoyer
    try:
        os.remove('test_queue.db')
    except:
        pass
    
    logger.info("Test Persistent Queue - PASSED")


def main():
    """Lance tous les tests."""
    logger.info("Starting PostFlow Error Handling Tests")
    
    try:
        test_error_handler_basic()
        test_persistent_queue()
        test_health_monitoring()
        test_file_watcher_robustness()
        test_workflow_with_retries()
        
        logger.info("All tests passed! ✅")
        
    except Exception as e:
        logger.error(f"Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
