"""Tests unitaires du file watcher PostFlow."""

import pytest
import tempfile
import os
from datetime import datetime
from pathlib import Path

from src.utils.file_watcher import LucidLinkWatcher, FileEvent, WorkflowTrigger


class TestFileEvent:
    """Tests de la classe FileEvent."""
    
    def test_file_event_creation(self):
        """Test de création d'un événement de fichier."""
        event = FileEvent(
            file_path="/test/UNDLM_12345_v001.mov",
            shot_nomenclature="UNDLM_12345",
            version=1,
            event_type="created",
            timestamp=datetime.now(),
            file_size=1024
        )
        
        assert event.file_path == "/test/UNDLM_12345_v001.mov"
        assert event.shot_nomenclature == "UNDLM_12345"
        assert event.version == 1
        assert event.event_type == "created"
        assert event.file_size == 1024


class TestLucidLinkWatcher:
    """Tests du watcher LucidLink."""
    
    def test_watcher_initialization(self, mock_config):
        """Test d'initialisation du watcher."""
        watcher_config = {
            'base_path': '/test/path',
            'polling_interval': 1.0,
            'max_scan_errors': 3
        }
        
        watcher = LucidLinkWatcher(watcher_config)
        
        assert watcher.config == watcher_config
        assert not watcher.running
        assert len(watcher.callbacks) == 0
    
    def test_callback_registration(self, mock_config):
        """Test d'enregistrement de callback."""
        watcher_config = {'base_path': '/test/path'}
        watcher = LucidLinkWatcher(watcher_config)
        
        def test_callback(event):
            pass
        
        watcher.add_callback(test_callback)
        assert len(watcher.callbacks) == 1
    
    def test_shot_nomenclature_extraction(self, mock_config):
        """Test d'extraction de nomenclature de shot."""
        watcher_config = {'base_path': '/test/path'}
        watcher = LucidLinkWatcher(watcher_config)
        
        # Test avec différents formats de noms
        test_cases = [
            ("UNDLM_12345_v001.mov", "UNDLM_12345"),
            ("UNDLM_67890_v002_final.mov", "UNDLM_67890"),
            ("PROJECT_ABC123_v001.mp4", "PROJECT_ABC123"),
        ]
        
        for filename, expected in test_cases:
            result = watcher._extract_shot_nomenclature(filename)
            assert result == expected, f"Failed for {filename}"
    
    def test_version_extraction(self, mock_config):
        """Test d'extraction de version."""
        watcher_config = {'base_path': '/test/path'}
        watcher = LucidLinkWatcher(watcher_config)
        
        test_cases = [
            ("UNDLM_12345_v001.mov", 1),
            ("UNDLM_12345_v002.mov", 2),
            ("UNDLM_12345_v123.mov", 123),
            ("UNDLM_12345.mov", 1),  # Version par défaut
        ]
        
        for filename, expected in test_cases:
            result = watcher._extract_version(filename)
            assert result == expected, f"Failed for {filename}"
    
    def test_file_filtering(self, mock_config):
        """Test de filtrage des fichiers."""
        watcher_config = {'base_path': '/test/path'}
        watcher = LucidLinkWatcher(watcher_config)
        
        # Fichiers valides
        valid_files = [
            "UNDLM_12345_v001.mov",
            "UNDLM_12345_v001.mp4",
            "UNDLM_12345_v001.avi"
        ]
        
        for filename in valid_files:
            assert watcher._should_process_file(filename), f"Should process {filename}"
        
        # Fichiers invalides
        invalid_files = [
            "temp_file.txt",
            ".hidden_file.mov",
            "UNDLM_12345.txt",
            "random_name.mov"
        ]
        
        for filename in invalid_files:
            assert not watcher._should_process_file(filename), f"Should not process {filename}"
    
    def test_watcher_with_invalid_paths(self, mock_config):
        """Test du watcher avec des chemins invalides."""
        watcher_config = {
            'base_path': '/nonexistent/path',
            'polling_interval': 0.5,
            'max_scan_errors': 2
        }
        
        watcher = LucidLinkWatcher(watcher_config)
        
        # Le watcher ne devrait pas démarrer avec des chemins invalides
        watcher.start()
        
        # Attendre un peu
        import time
        time.sleep(1)
        
        status = watcher.get_status()
        assert not status['running']
        
        watcher.stop()


class TestWorkflowTrigger:
    """Tests du déclencheur de workflow."""
    
    def test_workflow_trigger_initialization(self, mock_frameio_client, mock_sheets_client, mock_discord_client):
        """Test d'initialisation du trigger."""
        trigger = WorkflowTrigger(
            mock_frameio_client,
            mock_sheets_client, 
            mock_discord_client,
            {}
        )
        
        assert trigger.frameio == mock_frameio_client
        assert trigger.google_sheets == mock_sheets_client
        assert trigger.discord == mock_discord_client
    
    def test_event_processing(self, sample_file_event, mock_frameio_client, mock_sheets_client, mock_discord_client):
        """Test de traitement d'événement."""
        trigger = WorkflowTrigger(
            mock_frameio_client,
            mock_sheets_client,
            mock_discord_client, 
            {}
        )
        
        # Créer un fichier temporaire pour le test
        with tempfile.NamedTemporaryFile(suffix='.mov', delete=False) as f:
            f.write(b'test video content')
            temp_path = f.name
        
        try:
            # Modifier l'événement pour utiliser le fichier temporaire
            sample_file_event.file_path = temp_path
            
            # Traiter l'événement
            trigger.handle_new_render(sample_file_event)
            
            # Vérifier que les clients ont été appelés
            assert mock_frameio_client.create_folder_count > 0
            assert mock_frameio_client.upload_count > 0
            
        finally:
            # Nettoyer
            if os.path.exists(temp_path):
                os.unlink(temp_path)
