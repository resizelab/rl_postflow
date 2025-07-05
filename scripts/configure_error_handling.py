#!/usr/bin/env python3
"""
Configuration du système de gestion d'erreurs renforcé PostFlow
"""

import os
import json
import logging
from pathlib import Path
from typing import Dict, Any

logger = logging.getLogger(__name__)


def create_error_handling_config() -> Dict[str, Any]:
    """
    Crée la configuration pour le système de gestion d'erreurs.
    
    Returns:
        Dict: Configuration complète
    """
    print("=== Configuration du système de gestion d'erreurs PostFlow ===\n")
    
    config = {}
    
    # Configuration de base
    print("1. Configuration de base")
    config['db_path'] = input("Chemin de la base de données SQLite (défaut: data/postflow.db): ").strip()
    if not config['db_path']:
        config['db_path'] = 'data/postflow.db'
    
    # Configuration des retries
    print("\n2. Configuration des retries")
    config['retry_base_delay'] = float(input("Délai de base entre les retries en secondes (défaut: 1.0): ") or "1.0")
    config['retry_max_delay'] = float(input("Délai maximum entre les retries en secondes (défaut: 300.0): ") or "300.0")
    config['retry_backoff_factor'] = float(input("Facteur de backoff exponentiel (défaut: 2.0): ") or "2.0")
    
    # Configuration du watcher
    print("\n3. Configuration du watcher")
    watcher_config = {}
    watcher_config['polling_interval'] = float(input("Intervalle de polling en secondes (défaut: 5.0): ") or "5.0")
    watcher_config['min_file_age'] = float(input("Âge minimum des fichiers en secondes (défaut: 10.0): ") or "10.0")
    watcher_config['max_scan_errors'] = int(input("Nombre maximum d'erreurs de scan (défaut: 5): ") or "5")
    watcher_config['error_backoff'] = float(input("Délai de backoff pour les erreurs de scan (défaut: 30.0): ") or "30.0")
    watcher_config['path_check_interval'] = float(input("Intervalle de vérification des chemins (défaut: 300.0): ") or "300.0")
    
    base_path = input("Chemin de base LucidLink (défaut: /Volumes/resizelab/o2b-undllm): ").strip()
    if not base_path:
        base_path = '/Volumes/resizelab/o2b-undllm'
    watcher_config['base_path'] = base_path
    
    extensions = input("Extensions supportées (séparées par des virgules, défaut: .mov,.mp4,.avi): ").strip()
    if not extensions:
        extensions = '.mov,.mp4,.avi'
    watcher_config['supported_extensions'] = [ext.strip() for ext in extensions.split(',')]
    
    config['watcher'] = watcher_config
    
    # Configuration du monitoring de santé
    print("\n4. Configuration du monitoring de santé")
    health_config = {}
    health_config['check_interval'] = float(input("Intervalle des checks de santé (défaut: 60.0): ") or "60.0")
    health_config['alert_threshold'] = int(input("Seuil d'alerte (nombre d'échecs consécutifs, défaut: 5): ") or "5")
    
    config['health_monitor'] = health_config
    
    # Configuration des alertes
    print("\n5. Configuration des alertes")
    alerts_config = {}
    
    # Alertes email
    email_enabled = input("Activer les alertes email? (o/n, défaut: n): ").strip().lower()
    if email_enabled in ['o', 'oui', 'y', 'yes']:
        alerts_config['email_enabled'] = True
        email_config = {}
        email_config['smtp_server'] = input("Serveur SMTP: ").strip()
        email_config['smtp_port'] = int(input("Port SMTP (défaut: 587): ") or "587")
        email_config['smtp_tls'] = input("Utiliser TLS? (o/n, défaut: o): ").strip().lower() in ['o', 'oui', 'y', 'yes', '']
        email_config['smtp_user'] = input("Nom d'utilisateur SMTP: ").strip()
        email_config['smtp_password'] = input("Mot de passe SMTP: ").strip()
        email_config['from_email'] = input("Email expéditeur: ").strip()
        email_config['to_email'] = input("Email destinataire: ").strip()
        
        alerts_config['email'] = email_config
    else:
        alerts_config['email_enabled'] = False
    
    config['alerts'] = alerts_config
    
    # Configuration des tâches
    print("\n6. Configuration des tâches")
    tasks_config = {}
    tasks_config['default_max_attempts'] = int(input("Nombre maximum de tentatives par défaut (défaut: 3): ") or "3")
    tasks_config['default_timeout'] = int(input("Timeout par défaut en secondes (défaut: 300): ") or "300")
    tasks_config['cleanup_days'] = int(input("Nombre de jours à conserver les tâches terminées (défaut: 7): ") or "7")
    
    config['tasks'] = tasks_config
    
    return config


def save_config(config: Dict[str, Any], config_path: str = "config/error_handling.json"):
    """
    Sauvegarde la configuration.
    
    Args:
        config: Configuration à sauvegarder
        config_path: Chemin du fichier de configuration
    """
    config_file = Path(config_path)
    config_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print(f"\nConfiguration sauvegardée dans {config_path}")


def load_config(config_path: str = "config/error_handling.json") -> Dict[str, Any]:
    """
    Charge la configuration.
    
    Args:
        config_path: Chemin du fichier de configuration
        
    Returns:
        Dict: Configuration chargée
    """
    config_file = Path(config_path)
    
    if not config_file.exists():
        return {}
    
    with open(config_file, 'r', encoding='utf-8') as f:
        return json.load(f)


def create_systemd_service(config: Dict[str, Any]):
    """
    Crée un service systemd pour le PostFlow.
    
    Args:
        config: Configuration du système
    """
    print("\n=== Création du service systemd ===")
    
    create_service = input("Créer un service systemd? (o/n, défaut: n): ").strip().lower()
    if create_service not in ['o', 'oui', 'y', 'yes']:
        return
    
    service_name = input("Nom du service (défaut: postflow): ").strip() or "postflow"
    user = input("Utilisateur pour le service (défaut: current user): ").strip() or os.getenv('USER', 'postflow')
    work_dir = input("Répertoire de travail (défaut: current dir): ").strip() or os.getcwd()
    python_path = input("Chemin Python (défaut: /usr/bin/python3): ").strip() or "/usr/bin/python3"
    
    service_content = f"""[Unit]
Description=PostFlow - Pipeline de post-production automatisé
After=network.target

[Service]
Type=simple
User={user}
WorkingDirectory={work_dir}
Environment=PATH=/usr/bin:/bin
ExecStart={python_path} main.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
"""
    
    service_file = Path(f"{service_name}.service")
    with open(service_file, 'w') as f:
        f.write(service_content)
    
    print(f"Service systemd créé: {service_file}")
    print(f"Pour installer:")
    print(f"  sudo cp {service_file} /etc/systemd/system/")
    print(f"  sudo systemctl daemon-reload")
    print(f"  sudo systemctl enable {service_name}")
    print(f"  sudo systemctl start {service_name}")


def create_monitoring_script():
    """Crée un script de monitoring."""
    print("\n=== Création du script de monitoring ===")
    
    create_monitor = input("Créer un script de monitoring? (o/n, défaut: o): ").strip().lower()
    if create_monitor not in ['o', 'oui', 'y', 'yes', '']:
        return
    
    monitor_script = '''#!/usr/bin/env python3
"""
Script de monitoring PostFlow
"""

import sys
import os
import json
import logging
from pathlib import Path
from datetime import datetime, timedelta

# Ajouter le répertoire src au path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.utils.error_handler import ErrorHandler, PersistentQueue

def main():
    """Lance le monitoring."""
    # Charger la configuration
    config_path = "config/error_handling.json"
    if not Path(config_path).exists():
        print(f"Configuration not found: {config_path}")
        sys.exit(1)
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Créer l'error handler
    error_handler = ErrorHandler(config)
    
    # Afficher les statistiques
    print("=== PostFlow Status ===")
    print(f"Time: {datetime.now().isoformat()}")
    print()
    
    # Statut général
    status = error_handler.get_status()
    print(f"Processing: {status['processing']}")
    print(f"Registered handlers: {len(status['registered_handlers'])}")
    print()
    
    # Statistiques de la queue
    queue_stats = status['queue_stats']
    print("Queue Statistics:")
    for status_name, count in queue_stats.items():
        print(f"  {status_name}: {count}")
    print()
    
    # Santé du système
    health_status = status['health_status']
    print(f"System Health: {'✅ HEALTHY' if health_status['healthy'] else '❌ UNHEALTHY'}")
    print("Health Checks:")
    for check_name, failure_count in health_status['failure_counts'].items():
        status_icon = '✅' if failure_count == 0 else '❌'
        print(f"  {status_icon} {check_name}: {failure_count} failures")
    print()
    
    # Nettoyer les anciennes tâches
    deleted = error_handler.cleanup()
    if deleted > 0:
        print(f"Cleaned up {deleted} old tasks")

if __name__ == "__main__":
    main()
'''
    
    with open("monitor_postflow.py", 'w') as f:
        f.write(monitor_script)
    
    os.chmod("monitor_postflow.py", 0o755)
    print("Script de monitoring créé: monitor_postflow.py")


def create_example_main():
    """Crée un exemple de fichier main.py."""
    print("\n=== Création d'un exemple main.py ===")
    
    create_main = input("Créer un exemple main.py? (o/n, défaut: o): ").strip().lower()
    if create_main not in ['o', 'oui', 'y', 'yes', '']:
        return
    
    main_script = '''#!/usr/bin/env python3
"""
PostFlow - Pipeline de post-production automatisé
Version renforcée avec gestion d'erreurs robuste
"""

import sys
import os
import json
import logging
import signal
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.utils.error_handler import ErrorHandler
from src.utils.file_watcher import LucidLinkWatcher, WorkflowTrigger
from src.integrations.frameio import FrameIOClient
from src.integrations.google_sheets import GoogleSheetsClient
from src.integrations.discord import DiscordNotifier

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('postflow.log')
    ]
)

logger = logging.getLogger(__name__)


class PostFlowPipeline:
    """Pipeline principal PostFlow."""
    
    def __init__(self, config_path: str = "config/error_handling.json"):
        """
        Initialise le pipeline.
        
        Args:
            config_path: Chemin du fichier de configuration
        """
        self.config_path = config_path
        self.config = self.load_config()
        
        # Initialiser les composants
        self.error_handler = ErrorHandler(self.config)
        self.frameio_client = None
        self.sheets_client = None
        self.discord_notifier = None
        self.watcher = None
        self.workflow_trigger = None
        
        # Gestionnaire de signal pour arrêt propre
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
    
    def load_config(self) -> dict:
        """Charge la configuration."""
        if not Path(self.config_path).exists():
            logger.error(f"Configuration file not found: {self.config_path}")
            logger.info("Run 'python configure_error_handling.py' to create configuration")
            sys.exit(1)
        
        with open(self.config_path, 'r') as f:
            return json.load(f)
    
    def initialize_clients(self):
        """Initialise les clients d'intégration."""
        try:
            # Charger les configurations d'intégration
            frameio_config = self.load_integration_config('frameio')
            sheets_config = self.load_integration_config('google_sheets')
            discord_config = self.load_integration_config('discord')
            
            # Initialiser les clients
            self.frameio_client = FrameIOClient(frameio_config)
            self.sheets_client = GoogleSheetsClient(sheets_config)
            self.discord_notifier = DiscordNotifier(discord_config)
            
            logger.info("Integration clients initialized")
            
        except Exception as e:
            logger.error(f"Failed to initialize clients: {e}")
            sys.exit(1)
    
    def load_integration_config(self, integration_name: str) -> dict:
        """Charge la configuration d'une intégration."""
        config_file = Path(f"config/{integration_name}_config.json")
        
        if not config_file.exists():
            logger.error(f"Integration config not found: {config_file}")
            logger.info("Run 'python configure_integrations.py' to create integration configs")
            sys.exit(1)
        
        with open(config_file, 'r') as f:
            return json.load(f)
    
    def setup_workflow(self):
        """Configure le workflow."""
        try:
            # Créer le trigger de workflow
            self.workflow_trigger = WorkflowTrigger(
                self.frameio_client,
                self.sheets_client,
                self.discord_notifier,
                self.config,
                self.error_handler
            )
            
            # Créer et configurer le watcher
            self.watcher = LucidLinkWatcher(
                self.config.get('watcher', {}),
                self.error_handler
            )
            
            # Enregistrer le callback
            self.watcher.add_callback(self.workflow_trigger.handle_new_render)
            
            logger.info("Workflow configured")
            
        except Exception as e:
            logger.error(f"Failed to setup workflow: {e}")
            sys.exit(1)
    
    def start(self):
        """Démarre le pipeline."""
        logger.info("Starting PostFlow pipeline")
        
        try:
            # Démarrer le gestionnaire d'erreurs
            self.error_handler.start_processing()
            
            # Démarrer le watcher
            self.watcher.start()
            
            logger.info("PostFlow pipeline started successfully")
            
            # Boucle principale
            import time
            while True:
                time.sleep(10)
                
                # Vérifier la santé du système
                health_status = self.error_handler.health_monitor.run_checks()
                
                # Nettoyer périodiquement
                self.error_handler.cleanup()
                
        except KeyboardInterrupt:
            logger.info("Received interrupt signal")
        except Exception as e:
            logger.error(f"Pipeline error: {e}")
        finally:
            self.stop()
    
    def stop(self):
        """Arrête le pipeline."""
        logger.info("Stopping PostFlow pipeline")
        
        if self.watcher:
            self.watcher.stop()
        
        if self.error_handler:
            self.error_handler.stop_processing()
        
        logger.info("PostFlow pipeline stopped")
    
    def signal_handler(self, signum, frame):
        """Gestionnaire de signaux."""
        logger.info(f"Received signal {signum}")
        self.stop()
        sys.exit(0)
    
    def status(self):
        """Affiche le statut du pipeline."""
        if not self.error_handler:
            print("Pipeline not initialized")
            return
        
        status = self.error_handler.get_status()
        
        print("=== PostFlow Status ===")
        print(f"Processing: {status['processing']}")
        print(f"Queue stats: {status['queue_stats']}")
        print(f"Health: {'✅ HEALTHY' if status['health_status']['healthy'] else '❌ UNHEALTHY'}")
        
        if self.watcher:
            watcher_status = self.watcher.get_status()
            print(f"Watcher: {'✅ RUNNING' if watcher_status['running'] else '❌ STOPPED'}")
            print(f"Tracked files: {watcher_status['tracked_files']}")


def main():
    """Point d'entrée principal."""
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == 'status':
            pipeline = PostFlowPipeline()
            pipeline.initialize_clients()
            pipeline.setup_workflow()
            pipeline.status()
            return
        elif command == 'test':
            # Mode test avec configuration minimale
            logger.info("Running in test mode")
            # Implémenter des tests ici
            return
    
    # Mode normal
    pipeline = PostFlowPipeline()
    pipeline.initialize_clients()
    pipeline.setup_workflow()
    pipeline.start()


if __name__ == "__main__":
    main()
'''
    
    with open("main.py", 'w') as f:
        f.write(main_script)
    
    os.chmod("main.py", 0o755)
    print("Exemple main.py créé")


def main():
    """Point d'entrée principal."""
    try:
        # Créer la configuration
        config = create_error_handling_config()
        
        # Sauvegarder la configuration
        save_config(config)
        
        # Créer les scripts supplémentaires
        create_systemd_service(config)
        create_monitoring_script()
        create_example_main()
        
        print("\n=== Configuration terminée ===")
        print("Fichiers créés:")
        print("  - config/error_handling.json")
        print("  - monitor_postflow.py")
        print("  - main.py (exemple)")
        
        print("\nPour démarrer PostFlow:")
        print("  python main.py")
        
        print("\nPour surveiller PostFlow:")
        print("  python monitor_postflow.py")
        
    except KeyboardInterrupt:
        print("\nConfiguration annulée")
    except Exception as e:
        print(f"Erreur lors de la configuration: {e}")


if __name__ == "__main__":
    main()
