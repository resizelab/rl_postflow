"""Tests d'intégration du workflow PostFlow."""

import pytest
import tempfile
import os
import time
from datetime import datetime
from pathlib import Path

from src.utils.error_handler import ErrorHandler
from src.utils.file_watcher import LucidLinkWatcher, WorkflowTrigger, FileEvent


class MockFrameioClientWithFailures:
    """Mock Frame.io avec possibilité d'échecs contrôlés."""
    
    def __init__(self, should_fail=False, fail_count=2):
        self.should_fail = should_fail
        self.fail_count = fail_count
        self.upload_count = 0
        self.create_folder_count = 0
    
    def create_shot_folder_structure(self, shot_nomenclature):
        """Mock création de dossier avec échecs contrôlés."""
        self.create_folder_count += 1
        if self.should_fail and self.create_folder_count <= self.fail_count:
            raise Exception("Mock Frame.io API error")
        return "mock_folder_id"
    
    def upload_video(self, file_path, folder_id, metadata):
        """Mock upload vidéo."""
        self.upload_count += 1
        return f"mock_asset_{self.upload_count}"


class MockSheetsClientWithFailures:
    """Mock Google Sheets avec possibilité d'échecs contrôlés."""
    
    def __init__(self, should_fail=False, fail_count=1):
        self.should_fail = should_fail
        self.fail_count = fail_count
        self.update_count = 0
    
    def update_shot_status(self, shot_nomenclature, status, phase, progress, notes):
        """Mock mise à jour avec échecs contrôlés."""
        self.update_count += 1
        if self.should_fail and self.update_count <= self.fail_count:
            raise Exception("Mock Google Sheets API error")
        return True


class MockDiscordClientWithFailures:
    """Mock Discord avec possibilité d'échecs contrôlés."""
    
    def __init__(self, should_fail=False, fail_count=1):
        self.should_fail = should_fail
        self.fail_count = fail_count
        self.message_count = 0
    
    def send_message(self, message, embed=None):
        """Mock envoi message avec échecs contrôlés."""
        self.message_count += 1
        if self.should_fail and self.message_count <= self.fail_count:
            raise Exception("Mock Discord webhook error")
        return True


class TestWorkflowIntegration:
    """Tests d'intégration du workflow complet."""
    
    def test_successful_workflow(self, test_db_path, mock_config):
        """Test d'un workflow complet réussi."""
        mock_config['db_path'] = test_db_path
        error_handler = ErrorHandler(mock_config)
        
        # Clients mock qui réussissent
        frameio_client = MockFrameioClientWithFailures(should_fail=False)
        sheets_client = MockSheetsClientWithFailures(should_fail=False)
        discord_client = MockDiscordClientWithFailures(should_fail=False)
        
        # Créer le trigger
        trigger = WorkflowTrigger(
            frameio_client,
            sheets_client,
            discord_client,
            {},
            error_handler
        )
        
        error_handler.start_processing()
        
        try:
            # Créer un fichier de test
            with tempfile.NamedTemporaryFile(suffix='.mov', delete=False) as f:
                f.write(b'test video content')
                temp_path = f.name
            
            # Créer un événement
            event = FileEvent(
                file_path=temp_path,
                shot_nomenclature="UNDLM_12345",
                version=1,
                event_type="created",
                timestamp=datetime.now(),
                file_size=1024
            )
            
            # Déclencher le workflow
            trigger.handle_new_render(event)
            
            # Attendre le traitement
            time.sleep(3)
            
            # Vérifier les résultats
            assert frameio_client.create_folder_count >= 1
            assert frameio_client.upload_count >= 1
            assert sheets_client.update_count >= 1
            assert discord_client.message_count >= 1
            
            # Vérifier le statut du gestionnaire d'erreurs
            status = error_handler.get_status()
            assert status['queue_stats'].get('completed', 0) >= 3  # 3 tâches
            
        finally:
            error_handler.stop_processing()
            if os.path.exists(temp_path):
                os.unlink(temp_path)
    
    def test_workflow_with_retries(self, test_db_path, mock_config):
        """Test d'un workflow avec retries."""
        mock_config['db_path'] = test_db_path
        error_handler = ErrorHandler(mock_config)
        
        # Clients mock qui échouent puis réussissent
        frameio_client = MockFrameioClientWithFailures(should_fail=True, fail_count=2)
        sheets_client = MockSheetsClientWithFailures(should_fail=True, fail_count=1) 
        discord_client = MockDiscordClientWithFailures(should_fail=True, fail_count=1)
        
        # Créer le trigger
        trigger = WorkflowTrigger(
            frameio_client,
            sheets_client,
            discord_client,
            {},
            error_handler
        )
        
        error_handler.start_processing()
        
        try:
            # Créer un fichier de test
            with tempfile.NamedTemporaryFile(suffix='.mov', delete=False) as f:
                f.write(b'test video content')
                temp_path = f.name
            
            # Créer un événement
            event = FileEvent(
                file_path=temp_path,
                shot_nomenclature="UNDLM_12345",
                version=1,
                event_type="created",
                timestamp=datetime.now(),
                file_size=1024
            )
            
            # Déclencher le workflow
            trigger.handle_new_render(event)
            
            # Attendre le traitement avec retries
            time.sleep(5)
            
            # Vérifier que les retries ont fonctionné
            assert frameio_client.create_folder_count >= 3  # 2 échecs + 1 succès
            assert sheets_client.update_count >= 1
            assert discord_client.message_count >= 1
            
            # Vérifier le statut
            status = error_handler.get_status()
            completed = status['queue_stats'].get('completed', 0)
            assert completed >= 3, f"Expected at least 3 completed tasks, got {completed}"
            
        finally:
            error_handler.stop_processing()
            if os.path.exists(temp_path):
                os.unlink(temp_path)
    
    def test_watcher_robustness(self, test_db_path, mock_config):
        """Test de robustesse du watcher."""
        mock_config['db_path'] = test_db_path
        error_handler = ErrorHandler(mock_config)
        error_handler.start_processing()
        
        # Configuration avec chemins inexistants
        watcher_config = {
            'base_path': '/nonexistent/path',
            'polling_interval': 0.5,
            'max_scan_errors': 2,
            'error_backoff': 0.5
        }
        
        watcher = LucidLinkWatcher(watcher_config, error_handler)
        
        def test_callback(event):
            pass
        
        watcher.add_callback(test_callback)
        
        try:
            # Démarrer le watcher
            watcher.start()
            
            # Attendre
            time.sleep(2)
            
            # Vérifier le statut
            status = watcher.get_status()
            assert not status['running'], "Watcher should stop with invalid paths"
            
            # Vérifier la disponibilité des chemins
            path_availability = status.get('path_availability', {})
            for path, available in path_availability.items():
                assert not available, f"Path {path} should be unavailable"
                
        finally:
            watcher.stop()
            error_handler.stop_processing()
    
    def test_health_monitoring_integration(self, test_db_path, mock_config):
        """Test d'intégration du monitoring de santé."""
        mock_config['db_path'] = test_db_path
        mock_config['health_monitor'] = {
            'check_interval': 60,
            'alert_threshold': 3
        }
        
        error_handler = ErrorHandler(mock_config)
        
        # Enregistrer des checks de santé
        def healthy_service():
            return True
        
        def unhealthy_service():
            return False
        
        error_handler.health_monitor.register_check('healthy_service', healthy_service)
        error_handler.health_monitor.register_check('unhealthy_service', unhealthy_service)
        
        # Exécuter plusieurs checks
        for i in range(5):
            results = error_handler.health_monitor.run_checks()
            time.sleep(0.1)
        
        # Vérifier le statut
        status = error_handler.health_monitor.get_status()
        assert 'healthy_service' in status['checks']
        assert 'unhealthy_service' in status['checks']
        assert status['failure_counts']['healthy_service'] == 0
        assert status['failure_counts']['unhealthy_service'] == 5
        assert not status['healthy']  # Le système est considéré comme non-sain
