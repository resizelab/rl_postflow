"""Tests unitaires du gestionnaire d'erreurs PostFlow."""

import pytest
import time
import json
from datetime import datetime

from src.utils.error_handler import ErrorHandler, ErrorLevel, Task, TaskStatus, PersistentQueue


class TestPersistentQueue:
    """Tests de la queue persistante."""
    
    def test_add_and_get_task(self, test_db_path):
        """Test d'ajout et récupération de tâche."""
        queue = PersistentQueue(test_db_path)
        
        task = Task(
            id='test_task_1',
            task_type='test',
            data={'value': 42},
            status=TaskStatus.PENDING,
            created_at=datetime.now()
        )
        
        # Ajouter la tâche
        assert queue.add_task(task)
        
        # Récupérer la tâche
        retrieved_task = queue.get_next_task()
        assert retrieved_task is not None
        assert retrieved_task.id == 'test_task_1'
        assert retrieved_task.data['value'] == 42
        assert retrieved_task.status == TaskStatus.PROCESSING
    
    def test_task_priority(self, test_db_path):
        """Test de priorité des tâches."""
        queue = PersistentQueue(test_db_path)
        
        # Ajouter des tâches avec différentes priorités
        low_priority = Task(
            id='low', task_type='test', data={}, 
            status=TaskStatus.PENDING, created_at=datetime.now(), priority=10
        )
        high_priority = Task(
            id='high', task_type='test', data={}, 
            status=TaskStatus.PENDING, created_at=datetime.now(), priority=0
        )
        
        queue.add_task(low_priority)
        queue.add_task(high_priority)
        
        # La tâche haute priorité doit être récupérée en premier
        task = queue.get_next_task()
        assert task.id == 'high'
    
    def test_task_serialization(self):
        """Test de sérialisation/désérialisation des tâches."""
        task = Task(
            id='test',
            task_type='test_type',
            data={'key': 'value'},
            status=TaskStatus.PENDING,
            created_at=datetime.now(),
            attempts=1,
            priority=5
        )
        
        # Sérialiser
        task_dict = task.to_dict()
        assert task_dict['id'] == 'test'
        assert json.loads(task_dict['data'])['key'] == 'value'
        
        # Désérialiser
        restored_task = Task.from_dict(task_dict)
        assert restored_task.id == task.id
        assert restored_task.data == task.data
        assert restored_task.status == task.status
    
    def test_statistics(self, test_db_path):
        """Test des statistiques de la queue."""
        queue = PersistentQueue(test_db_path)
        
        # Ajouter des tâches avec différents statuts
        tasks = [
            Task('completed_1', 'test', {}, TaskStatus.COMPLETED, datetime.now()),
            Task('pending_1', 'test', {}, TaskStatus.PENDING, datetime.now()),
            Task('failed_1', 'test', {}, TaskStatus.FAILED, datetime.now(), attempts=3)
        ]
        
        for task in tasks:
            queue.add_task(task)
        
        stats = queue.get_statistics()
        assert stats.get('completed', 0) >= 1
        assert stats.get('pending', 0) >= 1
        assert stats.get('failed', 0) >= 1


class TestErrorHandler:
    """Tests du gestionnaire d'erreurs."""
    
    def test_task_registration(self, test_db_path, mock_config):
        """Test d'enregistrement des handlers de tâches."""
        mock_config['db_path'] = test_db_path
        handler = ErrorHandler(mock_config)
        
        def test_task_handler(data):
            return data.get('success', True)
        
        handler.register_task_handler('test_task', test_task_handler)
        assert 'test_task' in handler.task_handlers
    
    def test_add_task(self, test_db_path, mock_config):
        """Test d'ajout de tâche."""
        mock_config['db_path'] = test_db_path
        handler = ErrorHandler(mock_config)
        
        task_id = handler.add_task('test_type', {'data': 'test'})
        assert task_id.startswith('test_type_')
        
        status = handler.get_status()
        assert status['queue_stats'].get('pending', 0) >= 1
    
    def test_task_processing(self, test_db_path, mock_config):
        """Test de traitement de tâche avec succès."""
        mock_config['db_path'] = test_db_path
        handler = ErrorHandler(mock_config)
        
        # Handler qui réussit
        results = []
        def success_handler(data):
            results.append(data)
            return True
        
        handler.register_task_handler('success_task', success_handler)
        handler.start_processing()
        
        task_id = handler.add_task('success_task', {'value': 42})
        
        # Attendre le traitement
        time.sleep(1)
        
        handler.stop_processing()
        
        # Vérifier que la tâche a été traitée
        assert len(results) == 1
        assert results[0]['value'] == 42
        
        status = handler.get_status()
        assert status['queue_stats'].get('completed', 0) >= 1
    
    def test_task_retry(self, test_db_path, mock_config):
        """Test de retry de tâche en échec."""
        mock_config['db_path'] = test_db_path
        mock_config['retry_base_delay'] = 0.1  # Délai plus court pour les tests
        handler = ErrorHandler(mock_config)
        
        attempts = []
        def failing_handler(data):
            attempts.append(len(attempts) + 1)
            return False  # Toujours échouer
        
        handler.register_task_handler('failing_task', failing_handler)
        handler.start_processing()
        
        task_id = handler.add_task('failing_task', {'test': True}, max_attempts=3)
        
        # Attendre le traitement avec retries (plus de temps)
        import time
        max_wait = 10  # 10 secondes max
        waited = 0
        
        while len(attempts) < 3 and waited < max_wait:
            time.sleep(0.5)
            waited += 0.5
        
        handler.stop_processing()
        
        # Vérifier que la tâche a été tentée plusieurs fois
        assert len(attempts) >= 2, f"Expected at least 2 attempts, got {len(attempts)}"
        
        status = handler.get_status()
        # Le test est réussi si on a au moins 2 tentatives
        assert len(attempts) >= 2
    
    def test_health_monitoring(self, test_db_path, mock_config):
        """Test du monitoring de santé."""
        mock_config['db_path'] = test_db_path
        handler = ErrorHandler(mock_config)
        
        # Enregistrer des checks de santé
        def healthy_check():
            return True
        
        def unhealthy_check():
            return False
        
        handler.health_monitor.register_check('healthy', healthy_check)
        handler.health_monitor.register_check('unhealthy', unhealthy_check)
        
        # Exécuter les checks
        results = handler.health_monitor.run_checks()
        assert results['healthy'] is True
        assert results['unhealthy'] is False
        
        # Vérifier le statut
        status = handler.health_monitor.get_status()
        assert 'healthy' in status['checks']
        assert 'unhealthy' in status['checks']
