#!/usr/bin/env python3
"""
Test de debug spécifique pour la queue
"""

import sys
import os
import logging
import json
from datetime import datetime

# Ajouter le répertoire src au path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Configuration du logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def test_task_serialization():
    """Test de sérialisation/désérialisation des tâches."""
    logger.info("=== Test Task Serialization ===")
    
    try:
        from src.utils.error_handler import Task, TaskStatus
        
        # Créer une tâche
        task = Task(
            id='test_task_1',
            task_type='test',
            data={'value': 1},
            status=TaskStatus.PENDING,
            created_at=datetime.now()
        )
        
        logger.info(f"Tâche créée: {task}")
        
        # Convertir en dict
        task_dict = task.to_dict()
        logger.info(f"Task dict: {json.dumps(task_dict, indent=2)}")
        
        # Reconvertir en tâche
        task_restored = Task.from_dict(task_dict)
        logger.info(f"Tâche restaurée: {task_restored}")
        
        logger.info("✅ Sérialisation OK")
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur sérialisation: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_queue_operations():
    """Test des opérations de base de la queue."""
    logger.info("=== Test Queue Operations ===")
    
    try:
        from src.utils.error_handler import PersistentQueue, Task, TaskStatus
        
        # Créer une queue
        queue = PersistentQueue('test_debug.db')
        logger.info("Queue créée")
        
        # Créer une tâche simple
        task = Task(
            id='debug_task',
            task_type='debug',
            data={'test': 'value'},
            status=TaskStatus.PENDING,
            created_at=datetime.now()
        )
        
        logger.info(f"Ajout de la tâche: {task.id}")
        
        # Ajouter la tâche
        success = queue.add_task(task)
        logger.info(f"Ajout réussi: {success}")
        
        if not success:
            logger.error("Échec de l'ajout")
            return False
        
        # Essayer de récupérer la tâche
        logger.info("Récupération de la tâche...")
        retrieved_task = queue.get_next_task()
        
        if retrieved_task:
            logger.info(f"Tâche récupérée: {retrieved_task.id}")
            logger.info(f"Statut: {retrieved_task.status}")
        else:
            logger.warning("Aucune tâche récupérée")
        
        # Statistiques
        stats = queue.get_statistics()
        logger.info(f"Statistiques: {stats}")
        
        # Nettoyer
        os.remove('test_debug.db')
        
        logger.info("✅ Queue operations OK")
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur queue operations: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_database_direct():
    """Test direct de la base de données."""
    logger.info("=== Test Database Direct ===")
    
    try:
        import sqlite3
        from src.utils.error_handler import Task, TaskStatus
        
        # Créer et initialiser la DB
        conn = sqlite3.connect('test_direct.db')
        cursor = conn.cursor()
        
        # Créer la table
        cursor.execute('''
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
        
        # Créer une tâche
        task = Task(
            id='direct_task',
            task_type='direct',
            data={'direct': 'test'},
            status=TaskStatus.PENDING,
            created_at=datetime.now()
        )
        
        # Insérer directement
        task_dict = task.to_dict()
        columns = ', '.join(task_dict.keys())
        placeholders = ', '.join(['?' for _ in task_dict.keys()])
        
        cursor.execute(
            f'INSERT INTO tasks ({columns}) VALUES ({placeholders})',
            list(task_dict.values())
        )
        conn.commit()
        
        logger.info("Tâche insérée directement")
        
        # Récupérer directement
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM tasks WHERE id = ?', ('direct_task',))
        row = cursor.fetchone()
        
        if row:
            logger.info(f"Tâche trouvée: {dict(row)}")
            
            # Essayer de reconstruire la tâche
            task_restored = Task.from_dict(dict(row))
            logger.info(f"Tâche restaurée: {task_restored}")
        else:
            logger.warning("Tâche non trouvée")
        
        conn.close()
        os.remove('test_direct.db')
        
        logger.info("✅ Database direct OK")
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur database direct: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Lance tous les tests de debug."""
    logger.info("=== Debug Tests ===")
    
    tests = [
        test_task_serialization,
        test_database_direct,
        test_queue_operations
    ]
    
    for test in tests:
        logger.info(f"\n--- {test.__name__} ---")
        try:
            result = test()
            logger.info(f"Test {test.__name__}: {'PASS' if result else 'FAIL'}")
        except Exception as e:
            logger.error(f"Test {test.__name__} crashed: {e}")


if __name__ == "__main__":
    main()
