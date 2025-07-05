"""Configuration pytest pour PostFlow."""

import pytest
import sys
import os
import tempfile
import shutil
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))


@pytest.fixture
def temp_dir():
    """Crée un dossier temporaire pour les tests."""
    temp_dir = tempfile.mkdtemp()
    yield temp_dir
    shutil.rmtree(temp_dir)


@pytest.fixture
def test_db_path(temp_dir):
    """Chemin vers une base de données de test."""
    return os.path.join(temp_dir, 'test.db')


@pytest.fixture
def mock_config():
    """Configuration de test standard."""
    return {
        'retry_base_delay': 0.1,
        'retry_max_delay': 1.0,
        'retry_backoff_factor': 2.0,
        'health_monitor': {
            'check_interval': 60,
            'alert_threshold': 3
        },
        'alerts': {
            'email_enabled': False
        }
    }


@pytest.fixture
def sample_file_event():
    """Événement de fichier de test."""
    from src.utils.file_watcher import FileEvent
    from datetime import datetime
    
    return FileEvent(
        file_path="/test/path/UNDLM_12345_v001.mov",
        shot_nomenclature="UNDLM_12345",
        version=1,
        event_type="created",
        timestamp=datetime.now(),
        file_size=1024*1024
    )


@pytest.fixture
def mock_frameio_client():
    """Client Frame.io mocké."""
    class MockFrameioClient:
        def __init__(self):
            self.upload_count = 0
            self.create_folder_count = 0
            
        def create_shot_folder_structure(self, shot_nomenclature):
            self.create_folder_count += 1
            return "mock_folder_id"
            
        def upload_video(self, file_path, folder_id, metadata):
            self.upload_count += 1
            return f"mock_asset_{self.upload_count}"
    
    return MockFrameioClient()


@pytest.fixture
def mock_sheets_client():
    """Client Google Sheets mocké."""
    class MockSheetsClient:
        def __init__(self):
            self.update_count = 0
            
        def update_shot_status(self, shot_nomenclature, status, phase, progress, notes):
            self.update_count += 1
            return True
    
    return MockSheetsClient()


@pytest.fixture
def mock_discord_client():
    """Client Discord mocké."""
    class MockDiscordClient:
        def __init__(self):
            self.message_count = 0
            
        def send_message(self, message, embed=None):
            self.message_count += 1
            return True
    
    return MockDiscordClient()
