"""Données de test communes pour PostFlow."""

from datetime import datetime


# Nomenclatures de test
SAMPLE_SHOTS = [
    "UNDLM_12345",
    "UNDLM_67890", 
    "UNDLM_11111",
    "UNDLM_22222"
]

# Événements de fichier de test
SAMPLE_FILE_EVENTS = [
    {
        "file_path": "/test/UNDLM_12345_v001.mov",
        "shot_nomenclature": "UNDLM_12345",
        "version": 1,
        "event_type": "created",
        "file_size": 1024*1024
    },
    {
        "file_path": "/test/UNDLM_67890_v002.mov", 
        "shot_nomenclature": "UNDLM_67890",
        "version": 2,
        "event_type": "modified",
        "file_size": 2048*1024
    }
]

# Configuration de test
TEST_CONFIG = {
    'db_path': 'test.db',
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

# Métadonnées de test
SAMPLE_METADATA = {
    'project': 'UNDLM',
    'sequence': '123',
    'shot': '45',
    'version': 1,
    'artist': 'test_artist',
    'timestamp': datetime.now().isoformat()
}
