#!/usr/bin/env python3
"""
Test simple du système de gestion d'erreurs PostFlow
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

# Configuration du logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def test_import():
    """Test d'importation des modules."""
    logger.info("=== Test Import ===")
    
    try:
        from src.utils.error_handler import ErrorHandler, ErrorLevel, Task, TaskStatus, PersistentQueue
        logger.info("✅ Import error_handler réussi")
        
        from src.utils.file_watcher import LucidLinkWatcher, WorkflowTrigger, FileEvent
        logger.info("✅ Import file_watcher réussi")
        
        return True
    except Exception as e:
        logger.error(f"❌ Erreur d'import: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_sqlite():
    """Test de SQLite."""
    logger.info("=== Test SQLite ===")
    
    try:
        import sqlite3
        
        # Test de base
        conn = sqlite3.connect('test_sqlite.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS test_table (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL
            )
        ''')
        
        cursor.execute("INSERT INTO test_table (name) VALUES (?)", ("test",))
        conn.commit()
        
        cursor.execute("SELECT * FROM test_table")
        rows = cursor.fetchall()
        logger.info(f"SQLite test rows: {rows}")
        
        conn.close()
        
        # Nettoyer
        os.remove('test_sqlite.db')
        
        logger.info("✅ SQLite fonctionne correctement")
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur SQLite: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_queue():
    """Test de la queue persistante."""
    logger.info("=== Test Queue ===")
    
    try:
        from src.utils.error_handler import PersistentQueue, Task, TaskStatus
        
        # Créer une queue
        queue = PersistentQueue('test_queue_simple.db')
        logger.info("✅ Queue créée")
        
        # Créer une tâche
        task = Task(
            id='test_task_1',
            task_type='test',
            data={'value': 1},
            status=TaskStatus.PENDING,
            created_at=datetime.now()
        )
        
        # Ajouter la tâche
        success = queue.add_task(task)
        logger.info(f"Ajout tâche: {success}")
        
        # Récupérer la tâche
        retrieved_task = queue.get_next_task()
        logger.info(f"Tâche récupérée: {retrieved_task}")
        
        # Statistiques
        stats = queue.get_statistics()
        logger.info(f"Statistiques: {stats}")
        
        # Nettoyer
        os.remove('test_queue_simple.db')
        
        logger.info("✅ Queue fonctionne correctement")
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur Queue: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_error_handler():
    """Test du gestionnaire d'erreurs."""
    logger.info("=== Test ErrorHandler ===")
    
    try:
        from src.utils.error_handler import ErrorHandler
        
        config = {
            'db_path': 'test_handler.db',
            'retry_base_delay': 0.1,
            'retry_max_delay': 1.0,
            'retry_backoff_factor': 2.0
        }
        
        error_handler = ErrorHandler(config)
        logger.info("✅ ErrorHandler créé")
        
        # Test handler
        def test_handler(data):
            logger.info(f"Handler appelé avec: {data}")
            return data.get('success', True)
        
        error_handler.register_task_handler('test_task', test_handler)
        logger.info("✅ Handler enregistré")
        
        # Démarrer le traitement
        error_handler.start_processing()
        logger.info("✅ Traitement démarré")
        
        # Attendre un peu
        time.sleep(0.5)
        
        # Ajouter une tâche
        task_id = error_handler.add_task('test_task', {'success': True})
        logger.info(f"✅ Tâche ajoutée: {task_id}")
        
        # Attendre le traitement
        time.sleep(2)
        
        # Vérifier le statut
        status = error_handler.get_status()
        logger.info(f"Statut: {json.dumps(status, indent=2)}")
        
        # Arrêter le traitement
        error_handler.stop_processing()
        logger.info("✅ Traitement arrêté")
        
        # Nettoyer
        os.remove('test_handler.db')
        
        logger.info("✅ ErrorHandler fonctionne correctement")
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur ErrorHandler: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Lance tous les tests simples."""
    logger.info("=== Tests Simples PostFlow ===")
    
    tests = [
        test_import,
        test_sqlite,
        test_queue,
        test_error_handler
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
            logger.info(f"Test {test.__name__}: {'PASS' if result else 'FAIL'}")
        except Exception as e:
            logger.error(f"Test {test.__name__} crashed: {e}")
            results.append(False)
    
    if all(results):
        logger.info("✅ Tous les tests sont passés!")
    else:
        logger.error("❌ Certains tests ont échoué")
        failed_tests = [test.__name__ for test, result in zip(tests, results) if not result]
        logger.error(f"Tests échoués: {failed_tests}")


if __name__ == "__main__":
    main()
