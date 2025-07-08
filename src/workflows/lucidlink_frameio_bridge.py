#!/usr/bin/env python3
"""
Script principal d'intégration LucidLink → Frame.io
Connecte le watcher LucidLink existant avec la nouvelle intégration Frame.io
"""

import asyncio
import os
import sys
from pathlib import Path
from typing import Dict, List, Optional, Any
import logging
import json
from datetime import datetime

# Ajouter le chemin source au PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.frameio.integration import FrameIOIntegrationManager, create_frameio_integration

# Configuration du logging
logger = logging.getLogger(__name__)

class LucidLinkFrameIOBridge:
    """
    Pont entre LucidLink et Frame.io
    Écoute les événements du watcher LucidLink et déclenche les uploads Frame.io
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialise le pont LucidLink → Frame.io
        
        Args:
            config: Configuration complète du pipeline
        """
        self.config = config
        self.running = False
        self.processed_files = set()
        self.stats = {
            'files_detected': 0,
            'files_processed': 0,
            'files_uploaded': 0,
            'files_failed': 0,
            'start_time': None
        }
        
        # Initialiser l'intégration Frame.io
        self.frameio_integration = create_frameio_integration(config)
        
        # Configuration du watcher
        self.watch_path = config.get('lucidlink', {}).get('by_shot_path', '/path/to/BY_SHOT')
        self.file_extensions = config.get('lucidlink', {}).get('supported_extensions', 
                                                            ['.mov', '.mp4', '.avi', '.mkv', '.prores'])
        self.min_file_size = config.get('lucidlink', {}).get('min_file_size', 1024 * 1024)  # 1MB
        self.processing_delay = config.get('lucidlink', {}).get('processing_delay', 10)  # 10 secondes
        
        # État des fichiers en cours de traitement
        self.processing_queue = asyncio.Queue()
        self.processing_tasks = []
        
        logger.info(f"✅ Pont LucidLink → Frame.io initialisé")
        logger.info(f"📁 Surveillance: {self.watch_path}")
        logger.info(f"📝 Extensions: {self.file_extensions}")
    
    async def start_bridge(self):
        """Démarre le pont d'intégration"""
        try:
            self.running = True
            self.stats['start_time'] = datetime.now()
            
            logger.info("🚀 Démarrage du pont LucidLink → Frame.io")
            
            # Démarrer les workers de traitement
            await self._start_processing_workers()
            
            # Démarrer la surveillance des fichiers
            await self._start_file_watcher()
            
        except Exception as e:
            logger.error(f"❌ Erreur démarrage pont: {e}")
            await self.stop_bridge()
    
    async def stop_bridge(self):
        """Arrête le pont d'intégration"""
        try:
            logger.info("🛑 Arrêt du pont LucidLink → Frame.io")
            self.running = False
            
            # Arrêter les workers
            for task in self.processing_tasks:
                task.cancel()
            
            # Attendre la fin des tâches en cours
            if self.processing_tasks:
                await asyncio.gather(*self.processing_tasks, return_exceptions=True)
            
            # Afficher les statistiques finales
            self._log_final_stats()
            
        except Exception as e:
            logger.error(f"❌ Erreur arrêt pont: {e}")
    
    async def _start_processing_workers(self):
        """Démarre les workers de traitement des fichiers"""
        try:
            max_workers = self.config.get('frameio', {}).get('max_concurrent_uploads', 3)
            
            for i in range(max_workers):
                task = asyncio.create_task(self._processing_worker(f"Worker-{i+1}"))
                self.processing_tasks.append(task)
            
            logger.info(f"✅ {max_workers} workers de traitement démarrés")
            
        except Exception as e:
            logger.error(f"❌ Erreur démarrage workers: {e}")
    
    async def _processing_worker(self, worker_name: str):
        """Worker qui traite les fichiers de la queue"""
        try:
            logger.info(f"🔄 {worker_name} démarré")
            
            while self.running:
                try:
                    # Récupérer un fichier de la queue (timeout 1 seconde)
                    file_path = await asyncio.wait_for(
                        self.processing_queue.get(), 
                        timeout=1.0
                    )
                    
                    # Traiter le fichier
                    await self._process_file(file_path, worker_name)
                    
                    # Marquer la tâche comme terminée
                    self.processing_queue.task_done()
                    
                except asyncio.TimeoutError:
                    # Pas de fichier dans la queue, continuer
                    continue
                except Exception as e:
                    logger.error(f"❌ Erreur dans {worker_name}: {e}")
                    
        except asyncio.CancelledError:
            logger.info(f"🛑 {worker_name} arrêté")
        except Exception as e:
            logger.error(f"❌ Erreur worker {worker_name}: {e}")
    
    async def _start_file_watcher(self):
        """Démarre la surveillance des fichiers"""
        try:
            # Implémentation simplifiée du watcher
            # Dans un vrai déploiement, on utiliserait watchdog ou inotify
            
            logger.info(f"👀 Surveillance démarrée: {self.watch_path}")
            
            while self.running:
                try:
                    # Scanner le dossier BY_SHOT
                    await self._scan_for_new_files()
                    
                    # Attendre avant le prochain scan
                    await asyncio.sleep(5)
                    
                except Exception as e:
                    logger.error(f"❌ Erreur surveillance: {e}")
                    await asyncio.sleep(10)
                    
        except asyncio.CancelledError:
            logger.info("🛑 Surveillance arrêtée")
        except Exception as e:
            logger.error(f"❌ Erreur surveillance: {e}")
    
    async def _scan_for_new_files(self):
        """Scanne le dossier BY_SHOT pour de nouveaux fichiers"""
        try:
            watch_path = Path(self.watch_path)
            
            if not watch_path.exists():
                logger.warning(f"⚠️ Dossier BY_SHOT introuvable: {self.watch_path}")
                return
            
            # Chercher les fichiers vidéo
            for file_path in watch_path.rglob('*'):
                if (file_path.is_file() and 
                    file_path.suffix.lower() in self.file_extensions and
                    str(file_path) not in self.processed_files):
                    
                    # Vérifier la taille du fichier
                    if file_path.stat().st_size < self.min_file_size:
                        continue
                    
                    # Attendre que le fichier soit stable (pas en cours d'écriture)
                    if not await self._is_file_stable(file_path):
                        continue
                    
                    # Ajouter à la queue de traitement
                    await self.processing_queue.put(str(file_path))
                    self.processed_files.add(str(file_path))
                    self.stats['files_detected'] += 1
                    
                    logger.info(f"📄 Nouveau fichier détecté: {file_path.name}")
                    
        except Exception as e:
            logger.error(f"❌ Erreur scan fichiers: {e}")
    
    async def _is_file_stable(self, file_path: Path) -> bool:
        """Vérifie qu'un fichier n'est plus en cours d'écriture"""
        try:
            # Prendre la taille du fichier
            size1 = file_path.stat().st_size
            
            # Attendre un peu
            await asyncio.sleep(2)
            
            # Reprendre la taille
            size2 = file_path.stat().st_size
            
            # Si les tailles sont identiques, le fichier est stable
            return size1 == size2
            
        except Exception as e:
            logger.error(f"❌ Erreur vérification stabilité {file_path}: {e}")
            return False
    
    async def _process_file(self, file_path: str, worker_name: str):
        """Traite un fichier spécifique"""
        try:
            logger.info(f"🔄 {worker_name} traite: {Path(file_path).name}")
            self.stats['files_processed'] += 1
            
            # Utiliser l'intégration Frame.io pour traiter le fichier
            result = await self.frameio_integration.process_file(file_path)
            
            if result['status'] == 'success':
                self.stats['files_uploaded'] += 1
                logger.info(f"✅ {worker_name} - Upload réussi: {result['metadata']['nomenclature']}")
                
                # Optionnel : déplacer le fichier vers un dossier "processed"
                await self._move_to_processed(file_path)
                
            else:
                self.stats['files_failed'] += 1
                logger.error(f"❌ {worker_name} - Échec upload: {result['error']}")
                
                # Optionnel : déplacer vers un dossier "failed"
                await self._move_to_failed(file_path, result['error'])
                
        except Exception as e:
            self.stats['files_failed'] += 1
            logger.error(f"❌ {worker_name} - Erreur traitement {file_path}: {e}")
    
    async def _move_to_processed(self, file_path: str):
        """Déplace un fichier vers le dossier processed (optionnel)"""
        try:
            if not self.config.get('lucidlink', {}).get('move_processed_files', False):
                return
            
            source_path = Path(file_path)
            processed_dir = source_path.parent / "processed"
            processed_dir.mkdir(exist_ok=True)
            
            target_path = processed_dir / source_path.name
            source_path.rename(target_path)
            
            logger.info(f"📁 Fichier déplacé vers processed: {source_path.name}")
            
        except Exception as e:
            logger.error(f"❌ Erreur déplacement processed: {e}")
    
    async def _move_to_failed(self, file_path: str, error: str):
        """Déplace un fichier vers le dossier failed (optionnel)"""
        try:
            if not self.config.get('lucidlink', {}).get('move_failed_files', False):
                return
            
            source_path = Path(file_path)
            failed_dir = source_path.parent / "failed"
            failed_dir.mkdir(exist_ok=True)
            
            target_path = failed_dir / source_path.name
            source_path.rename(target_path)
            
            # Créer un fichier d'erreur
            error_file = failed_dir / f"{source_path.stem}.error"
            with open(error_file, 'w') as f:
                f.write(f"Error: {error}\nTimestamp: {datetime.now().isoformat()}")
            
            logger.info(f"📁 Fichier déplacé vers failed: {source_path.name}")
            
        except Exception as e:
            logger.error(f"❌ Erreur déplacement failed: {e}")
    
    def _log_final_stats(self):
        """Affiche les statistiques finales"""
        try:
            if self.stats['start_time']:
                duration = datetime.now() - self.stats['start_time']
                logger.info(f"📊 Statistiques finales (durée: {duration}):")
                logger.info(f"  📄 Fichiers détectés: {self.stats['files_detected']}")
                logger.info(f"  🔄 Fichiers traités: {self.stats['files_processed']}")
                logger.info(f"  ✅ Fichiers uploadés: {self.stats['files_uploaded']}")
                logger.info(f"  ❌ Fichiers échoués: {self.stats['files_failed']}")
                
                if self.stats['files_processed'] > 0:
                    success_rate = (self.stats['files_uploaded'] / self.stats['files_processed']) * 100
                    logger.info(f"  📈 Taux de réussite: {success_rate:.1f}%")
        except Exception as e:
            logger.error(f"❌ Erreur statistiques: {e}")
    
    async def get_status(self) -> Dict[str, Any]:
        """Retourne le statut actuel du pont"""
        return {
            'running': self.running,
            'stats': self.stats,
            'queue_size': self.processing_queue.qsize(),
            'processed_files_count': len(self.processed_files),
            'frameio_integration_status': await self.frameio_integration.get_processing_status()
        }

async def load_configuration() -> Dict[str, Any]:
    """Charge la configuration depuis les fichiers et variables d'environnement"""
    try:
        # Configuration de base
        config = {
            'frameio': {
                'account_id': os.getenv('FRAMEIO_ACCOUNT_ID'),
                'workspace_id': os.getenv('FRAMEIO_WORKSPACE_ID'),
                'project_id': os.getenv('FRAMEIO_PROJECT_ID'),
                'base_url': os.getenv('FRAMEIO_BASE_URL', 'https://api.frame.io/v4'),
                'max_concurrent_uploads': int(os.getenv('MAX_CONCURRENT_UPLOADS', '3')),
                'oauth': {
                    'client_id': os.getenv('FRAMEIO_CLIENT_ID'),
                    'client_secret': os.getenv('FRAMEIO_CLIENT_SECRET'),
                    'jwt_key': os.getenv('FRAMEIO_JWT_KEY'),
                    'token_url': os.getenv('FRAMEIO_TOKEN_URL', 'https://auth.frame.io/oauth2/token')
                }
            },
            'discord': {
                'webhook_url': os.getenv('DISCORD_WEBHOOK_URL')
            },
            'lucidlink': {
                'by_shot_path': os.getenv('LUCIDLINK_BY_SHOT_PATH', '/path/to/BY_SHOT'),
                'supported_extensions': ['.mov', '.mp4', '.avi', '.mkv', '.prores', '.mxf'],
                'min_file_size': int(os.getenv('MIN_FILE_SIZE', '1048576')),  # 1MB
                'processing_delay': int(os.getenv('PROCESSING_DELAY', '10')),
                'move_processed_files': os.getenv('MOVE_PROCESSED_FILES', 'false').lower() == 'true',
                'move_failed_files': os.getenv('MOVE_FAILED_FILES', 'false').lower() == 'true'
            },
            'logging': {
                'level': os.getenv('LOG_LEVEL', 'INFO'),
                'file': os.getenv('LOG_FILE', 'logs/frameio_integration.log'),
                'max_size': int(os.getenv('LOG_MAX_SIZE', '10485760')),  # 10MB
                'backup_count': int(os.getenv('LOG_BACKUP_COUNT', '5'))
            }
        }
        
        # Charger la configuration depuis un fichier JSON si présent
        config_file = os.getenv('CONFIG_FILE', 'config/frameio_integration.json')
        if Path(config_file).exists():
            with open(config_file, 'r') as f:
                file_config = json.load(f)
                # Fusionner les configurations (fichier prioritaire)
                config = {**config, **file_config}
        
        return config
        
    except Exception as e:
        logger.error(f"❌ Erreur chargement configuration: {e}")
        raise

async def main():
    """Fonction principale du pont d'intégration"""
    try:
        print("🎬 Démarrage du pont LucidLink → Frame.io")
        print("=" * 50)
        
        # Charger la configuration
        config = await load_configuration()
        
        # Configurer le logging basique
        logging_config = config.get('logging', {})
        log_level = getattr(logging, logging_config.get('level', 'INFO').upper())
        logging.basicConfig(
            level=log_level,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(logging_config.get('file', 'logs/frameio_integration.log')),
                logging.StreamHandler()
            ]
        )
        
        # Vérifier la configuration
        required_vars = ['FRAMEIO_ACCOUNT_ID', 'FRAMEIO_WORKSPACE_ID', 'FRAMEIO_CLIENT_ID']
        missing_vars = [var for var in required_vars if not os.getenv(var)]
        
        if missing_vars:
            logger.error("❌ Variables d'environnement manquantes:")
            for var in missing_vars:
                logger.error(f"  - {var}")
            return False
        
        # Créer et démarrer le pont
        bridge = LucidLinkFrameIOBridge(config)
        
        # Gestion des signaux pour arrêt propre
        import signal
        
        def signal_handler(signum, frame):
            logger.info(f"🛑 Signal {signum} reçu, arrêt du pont...")
            asyncio.create_task(bridge.stop_bridge())
        
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
        
        # Démarrer le pont
        await bridge.start_bridge()
        
        # Boucle principale avec monitoring
        while bridge.running:
            try:
                await asyncio.sleep(60)  # Vérifier toutes les minutes
                
                # Afficher les statistiques
                status = await bridge.get_status()
                logger.info(f"📊 Statut: {status['stats']['files_uploaded']} uploadés, "
                           f"{status['queue_size']} en attente")
                
            except KeyboardInterrupt:
                logger.info("🛑 Interruption clavier détectée")
                break
            except Exception as e:
                logger.error(f"❌ Erreur boucle principale: {e}")
                await asyncio.sleep(10)
        
        # Arrêt propre
        await bridge.stop_bridge()
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur fatale: {e}")
        return False

if __name__ == "__main__":
    # Vérifier Python 3.8+
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ requis")
        sys.exit(1)
    
    # Lancer le pont
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
