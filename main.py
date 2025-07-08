#!/usr/bin/env python3
"""
🎬 RL PostFlow - Main Pipeline Controller
=======================================

Point d'entrée principal du pipeline d'intégration LucidLink → Frame.io
- Orchestration de toutes les intégrations
- Interface avec le dashboard web
- Surveillance en temps réel
- Gestion des erreurs centralisée

Version: 4.0.0
Date: 7 janvier 2025
"""

import os
import sys
import json
import asyncio
import argparse
import signal
import subprocess
import time
from pathlib import Path
from datetime import datetime
import logging
from typing import Dict, Any, Optional

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

# Configuration du logging
log_dir = Path(__file__).parent / "logs"
log_dir.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_dir / 'postflow.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Imports des modules intégrés
try:
    from src.integrations.frameio import (
        FrameIOIntegrationManager,
        create_frameio_auth,
        FrameIOAuthError,
        upload_file_to_frameio
    )
    FRAMEIO_AVAILABLE = True
except ImportError as e:
    logger.error(f"Frame.io integration not available: {e}")
    FRAMEIO_AVAILABLE = False

try:
    from src.utils.file_watcher import LucidLinkWatcher
    WATCHER_AVAILABLE = True
except ImportError as e:
    logger.error(f"File watcher not available: {e}")
    WATCHER_AVAILABLE = False

try:
    from src.utils.error_handler import ErrorHandler
    ERROR_HANDLER_AVAILABLE = True
except ImportError as e:
    logger.error(f"Error handler not available: {e}")
    ERROR_HANDLER_AVAILABLE = False

try:
    from src.utils.lucidlink_utils import lucidlink_waiter, lucidlink_detector
    LUCIDLINK_UTILS_AVAILABLE = True
except ImportError as e:
    logger.error(f"LucidLink utils not available: {e}")
    LUCIDLINK_UTILS_AVAILABLE = False


class RLPostFlowPipeline:
    """
    Pipeline principal RL PostFlow avec orchestration complète
    """
    
    def __init__(self, config_path: Optional[Path] = None):
        """
        Initialise le pipeline principal
        
        Args:
            config_path: Chemin vers le fichier de configuration
        """
        self.project_root = Path(__file__).parent
        self.config_path = config_path or self.project_root / "config" / "integrations.json"
        self.pipeline_config_path = self.project_root / "pipeline_config.json"
        
        # État du pipeline
        self.config = {}
        self.pipeline_config = {}
        self.services = {}
        self.is_running = False
        self.dashboard_enabled = False
        
        # Composants
        self.frameio_integration: Optional[FrameIOIntegrationManager] = None
        self.watcher: Optional[LucidLinkWatcher] = None
        self.error_handler: Optional[ErrorHandler] = None
        self.dashboard_process = None
        
        # Serveur HTTP et Cloudflare Tunnel partagés
        self.shared_http_server = None
        self.shared_cloudflare_manager = None
        
        # Métriques
        self.metrics = {
            'start_time': datetime.now(),
            'files_processed': 0,
            'uploads_success': 0,
            'uploads_failed': 0,
            'last_activity': None,
            'token_refreshes': 0,
            'last_token_refresh': None
        }
        
        # Gestion du token
        self.token_check_interval = 300  # 5 minutes
        self.last_token_check = None
        
        # Initialisation
        self._setup_directories()
        self._load_configurations()
        self._update_environment_variables()
        
        logger.info("✅ RLPostFlowPipeline initialisé")
    
    def _setup_directories(self):
        """Crée les répertoires nécessaires"""
        directories = ['logs', 'data', 'config', 'temp']
        for dir_name in directories:
            dir_path = self.project_root / dir_name
            dir_path.mkdir(exist_ok=True)
    
    def _load_configurations(self):
        """Charge les configurations"""
        try:
            # Configuration des intégrations
            if self.config_path.exists():
                with open(self.config_path, 'r') as f:
                    self.config = json.load(f)
                logger.info(f"✅ Configuration chargée: {self.config_path}")
            else:
                logger.warning(f"⚠️ Fichier de configuration non trouvé: {self.config_path}")
                self.config = self._create_default_config()
            
            # Configuration du pipeline
            if self.pipeline_config_path.exists():
                with open(self.pipeline_config_path, 'r') as f:
                    self.pipeline_config = json.load(f)
            else:
                self.pipeline_config = self._create_default_pipeline_config()
                
        except Exception as e:
            logger.error(f"❌ Erreur lors du chargement de la configuration: {e}")
            self.config = self._create_default_config()
            self.pipeline_config = self._create_default_pipeline_config()
    
    def _create_default_config(self) -> Dict[str, Any]:
        """Crée une configuration par défaut"""
        return {
            "frameio": {
                "default_project_id": os.getenv("FRAMEIO_DEFAULT_PROJECT_ID", "c5dc0e94-8f0a-48b4-8f34-ae672bb59f0f"),
                "default_workspace_id": os.getenv("FRAMEIO_DEFAULT_WORKSPACE_ID", "a4374a0f-1a78-4d37-aa83-ccb07189796d"),
                "account_id": os.getenv("FRAMEIO_ACCOUNT_ID", "60b535d5-8508-459a-8dd6-98ffb0c3eb78"),
                "upload_timeout": 300,
                "max_retries": 3
            },
            "lucidlink": {
                "mount_path": os.getenv("LUCIDLINK_MOUNT_PATH", "/Volumes/LucidLink"),
                "base_path": os.getenv("LUCIDLINK_BASE_PATH", "/Volumes/resizelab/o2b-undllm"),
                "watch_directories": ["Projects", "Renders", "4_OUT"],
                "file_extensions": [".mp4", ".mov", ".avi", ".mkv"],
                "ignore_patterns": ["*.tmp", ".*"]
            },
            "discord": {
                "webhook_url": os.getenv("DISCORD_WEBHOOK_URL"),
                "enabled": True
            }
        }
    
    def _create_default_pipeline_config(self) -> Dict[str, Any]:
        """Crée une configuration de pipeline par défaut"""
        return {
            "dashboard": {
                "enabled": True,
                "host": "0.0.0.0",
                "port": 8080,
                "auto_start": True
            },
            "watcher": {
                "enabled": True,
                "scan_interval": 30,
                "max_concurrent_uploads": 3
            },
            "logging": {
                "level": "INFO",
                "file_rotation": True,
                "max_file_size": "10MB"
            }
        }
    
    def print_banner(self):
        """Affiche la bannière de démarrage"""
        print("\n" + "="*80)
        print("🎬 RL POSTFLOW - PIPELINE D'INTÉGRATION v4.0.0")
        print("="*80)
        print("Pipeline automatisé LucidLink → Frame.io")
        print("• 🔐 Authentification OAuth Web App autonome")
        print("• 📁 Gestion automatique des structures Frame.io")
        print("• 📤 Upload intelligent avec retry")
        print("• 🎛️ Dashboard web intégré")
        print("• 📢 Notifications Discord")
        print("="*80)
    
    async def initialize_shared_infrastructure(self) -> bool:
        """Initialise l'infrastructure partagée (serveur HTTP et Cloudflare Tunnel)"""
        try:
            logger.info("🌐 Initialisation infrastructure partagée...")
            
            # Importer les modules nécessaires
            from src.integrations.frameio.range_server import RangeFileServer
            from src.integrations.frameio.cloudflare_manager import CloudflareManager
            
            # Démarrer le serveur HTTP amélioré partagé
            self.shared_http_server = RangeFileServer(host="127.0.0.1", port=0)
            if not self.shared_http_server.start():
                logger.error("❌ Impossible de démarrer le serveur HTTP partagé")
                return False
                
            logger.info(f"✅ Serveur HTTP partagé démarré sur port {self.shared_http_server.actual_port}")
            
            # Démarrer le tunnel Cloudflare partagé
            self.shared_cloudflare_manager = CloudflareManager()
            tunnel_url = self.shared_cloudflare_manager.start_tunnel(self.shared_http_server.actual_port, timeout=30)  # Optimisé: 60s → 30s
            if not tunnel_url:
                logger.error("❌ Impossible de démarrer le tunnel Cloudflare partagé")
                return False
            
            logger.info(f"✅ Tunnel Cloudflare partagé actif: {tunnel_url}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur initialisation infrastructure: {e}")
            return False
    
    async def initialize_frameio(self) -> bool:
        """Initialise l'intégration Frame.io"""
        if not FRAMEIO_AVAILABLE:
            logger.error("❌ Frame.io integration not available")
            return False
        
        try:
            logger.info("🎬 Initialisation de l'intégration Frame.io...")
            
            # Créer l'authentification
            auth = create_frameio_auth()
            
            # Vérifier le token
            if not auth.is_token_valid():
                logger.warning("⚠️ Token Frame.io invalide ou expiré")
                if not await auth.ensure_valid_token():
                    logger.error("❌ Impossible d'obtenir un token valide")
                    auth_url = auth.generate_auth_url()
                    logger.info(f"🔗 URL d'autorisation: {auth_url}")
                    return False
            
            # Tester la connexion
            if not await auth.test_connection():
                logger.error("❌ Test de connexion Frame.io échoué")
                return False
            
            # Créer le gestionnaire d'intégration
            discord_webhook = self.config.get('discord', {}).get('webhook_url')
            self.frameio_integration = FrameIOIntegrationManager(
                auth=auth,
                discord_webhook_url=discord_webhook
            )
            
            logger.info("✅ Intégration Frame.io initialisée")
            return True
            
        except FrameIOAuthError as e:
            logger.error(f"❌ Erreur d'authentification Frame.io: {e}")
            return False
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'initialisation Frame.io: {e}")
            return False
    
    def initialize_watcher(self) -> bool:
        """Initialise le watcher LucidLink"""
        if not WATCHER_AVAILABLE:
            logger.error("❌ File watcher not available")
            return False
        
        try:
            logger.info("👁️ Initialisation du watcher LucidLink...")
            
            lucidlink_config = self.config.get('lucidlink', {})
            # Essayer mount_path d'abord, puis base_path
            mount_path = lucidlink_config.get('mount_path') or lucidlink_config.get('base_path')
            
            if not mount_path:
                logger.error("❌ LucidLink path not configured (mount_path or base_path)")
                return False
                
            if not Path(mount_path).exists():
                logger.error(f"❌ LucidLink path not found: {mount_path}")
                return False
            
            # Préparer la configuration pour le watcher
            watcher_config = {
                'base_path': mount_path,
                'polling_interval': lucidlink_config.get('polling_interval', 5),
                'min_file_age': lucidlink_config.get('min_file_age', 10),  # Optimisé: 30s → 10s (cache fiable)
                'supported_extensions': lucidlink_config.get('file_extensions', ['.mov', '.mp4', '.avi']),
                'max_scan_errors': 5,
                'error_backoff': 30,
                'path_check_interval': 300
            }
            
            self.watcher = LucidLinkWatcher(
                config=watcher_config,
                error_handler=self.error_handler
            )
            
            # Ajouter le callback pour traiter les fichiers détectés
            self.watcher.add_callback(self._handle_file_event)
            
            logger.info("✅ Watcher LucidLink initialisé")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'initialisation du watcher: {e}")
            return False
    
    def initialize_error_handler(self) -> bool:
        """Initialise le gestionnaire d'erreurs"""
        if not ERROR_HANDLER_AVAILABLE:
            logger.warning("⚠️ Error handler not available")
            return False
        
        try:
            # Créer une configuration par défaut pour l'error handler
            error_config = {
                "max_retries": 3,
                "retry_delay": 5,
                "log_level": "ERROR",
                "discord_webhook": self.config.get('discord', {}).get('webhook_url')
            }
            
            self.error_handler = ErrorHandler(error_config)
            logger.info("✅ Gestionnaire d'erreurs initialisé")
            return True
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'initialisation du gestionnaire d'erreurs: {e}")
            return False
    
    def start_dashboard(self) -> bool:
        """Lance le dashboard web en arrière-plan"""
        if not self.pipeline_config.get('dashboard', {}).get('enabled', True):
            logger.info("📊 Dashboard désactivé dans la configuration")
            return False
        
        try:
            import subprocess
            
            # Lancer le dashboard en subprocess
            dashboard_script = self.project_root / "dashboard.py"
            if not dashboard_script.exists():
                logger.warning("⚠️ Dashboard script not found")
                return False
            
            logger.info("🎛️ Démarrage du dashboard web...")
            
            self.dashboard_process = subprocess.Popen(
                [sys.executable, str(dashboard_script)],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            # Attendre un peu pour vérifier que le dashboard démarre
            time.sleep(2)
            
            if self.dashboard_process.poll() is None:
                self.dashboard_enabled = True
                port = self.pipeline_config.get('dashboard', {}).get('port', 8080)
                logger.info(f"✅ Dashboard démarré sur http://localhost:{port}")
                return True
            else:
                logger.error("❌ Échec du démarrage du dashboard")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur lors du démarrage du dashboard: {e}")
            return False
    
    async def process_file(self, file_path: Path) -> bool:
        """Traite un fichier détecté par le watcher avec upload ngrok partagé"""
        try:
            if not self.frameio_integration:
                logger.error("❌ Intégration Frame.io non disponible")
                return False
            
            if not self.shared_http_server or not self.shared_cloudflare_manager:
                logger.error("❌ Infrastructure partagée non disponible")
                return False
            
            logger.info(f"📤 Traitement du fichier: {file_path}")
            self.metrics['last_activity'] = datetime.now()
            
            # Vérifier la stabilité du fichier avant traitement
            if not await self._wait_for_file_stability(file_path):
                logger.error(f"❌ Fichier instable ou inaccessible: {file_path}")
                return False
            
            # Utiliser l'infrastructure partagée pour l'upload
            auth = create_frameio_auth()
            
            # Exposer le fichier sur le serveur HTTP partagé
            local_url = self.shared_http_server.add_file(str(file_path))
            if not local_url:
                logger.error("❌ Impossible d'exposer le fichier sur le serveur HTTP")
                return False
            
            # Construire l'URL publique avec Cloudflare Tunnel
            file_name = local_url.split('/')[-1]
            public_url = f"{self.shared_cloudflare_manager.tunnel_url}/{file_name}"
            
            # Importer les modules nécessaires
            from src.integrations.frameio.upload import FrameIOUploadManager
            from src.integrations.frameio.structure import FrameIOStructureManager
            
            # Créer les managers
            structure_manager = FrameIOStructureManager(auth)
            upload_manager = FrameIOUploadManager(auth)
            
            # Récupérer le projet
            projects = await structure_manager.get_projects()
            if not projects:
                logger.error("❌ Aucun projet trouvé")
                return False
            
            target_project = projects[0]  # Utiliser le premier projet
            
            # Upload avec remote_upload
            frameio_file = await upload_manager._create_file_remote_upload(
                str(file_path),
                target_project.root_folder_id,
                public_url
            )
            
            if frameio_file:
                self.metrics['files_processed'] += 1
                self.metrics['uploads_success'] += 1
                
                # Construire l'URL de visualisation
                view_url = f"https://app.frame.io/project/{target_project.id}/asset/{frameio_file.id}"
                
                logger.info(f"✅ Fichier uploadé avec succès: {file_path}")
                logger.info(f"🎬 Frame.io File ID: {frameio_file.id}")
                logger.info(f"🔗 View URL: {view_url}")
                
                # Nettoyer le fichier du serveur HTTP après un délai
                import asyncio
                asyncio.create_task(self._cleanup_file_after_delay(file_name, 300))  # 5 minutes
                
                return True
            else:
                self.metrics['uploads_failed'] += 1
                logger.error(f"❌ Échec upload: {file_path}")
                
                # Nettoyer le fichier immédiatement en cas d'échec
                self.shared_http_server.remove_file(file_name)
                
                return False
            
        except Exception as e:
            logger.error(f"❌ Erreur lors du traitement de {file_path}: {e}")
            self.metrics['uploads_failed'] += 1
            return False
    
    async def _cleanup_file_after_delay(self, file_name: str, delay: int):
        """Nettoie un fichier du serveur HTTP après un délai"""
        await asyncio.sleep(delay)
        if self.shared_http_server:
            self.shared_http_server.remove_file(file_name)
            logger.info(f"🧹 Fichier nettoyé du serveur HTTP: {file_name}")
    
    async def _wait_for_file_stability(self, file_path: Path, max_wait: int = 60, check_interval: int = 2) -> bool:
        """
        Attend que le fichier soit stable avec support LucidLink amélioré
        
        Args:
            file_path: Chemin vers le fichier
            max_wait: Temps d'attente maximum en secondes
            check_interval: Intervalle entre les vérifications en secondes
            
        Returns:
            bool: True si le fichier est stable, False sinon
        """
        try:
            if not file_path.exists():
                logger.warning(f"⚠️ Fichier non trouvé: {file_path}")
                return False
            
            # Utiliser les utilitaires LucidLink si disponibles
            if LUCIDLINK_UTILS_AVAILABLE:
                logger.info(f"🔍 Vérification LucidLink pour: {file_path.name}")
                
                # Vérifier si c'est un fichier LucidLink
                if lucidlink_detector.is_lucidlink_file(file_path):
                    logger.info(f"🔄 Fichier LucidLink détecté: {file_path.name}")
                    
                    # Utiliser l'attente spécialisée pour LucidLink (max 5 minutes)
                    return await lucidlink_waiter.wait_for_complete_sync(
                        file_path, 
                        max_wait=max(max_wait, 300),  # Au moins 5 minutes pour LucidLink
                        check_interval=check_interval
                    )
                else:
                    logger.debug(f"📁 Fichier local standard: {file_path.name}")
                    return await lucidlink_waiter._standard_stability_check(
                        file_path, max_wait, check_interval
                    )
            else:
                logger.warning("⚠️ Utilitaires LucidLink non disponibles, utilisation méthode standard")
                return await self._standard_stability_check(file_path, max_wait, check_interval)
                
        except Exception as e:
            logger.error(f"❌ Erreur vérification stabilité: {file_path} - {e}")
            return False
    
    async def _standard_stability_check(self, file_path: Path, max_wait: int = 60, check_interval: int = 2) -> bool:
        """
        Vérification de stabilité standard (fallback)
        
        Args:
            file_path: Chemin vers le fichier
            max_wait: Temps d'attente maximum en secondes
            check_interval: Intervalle entre les vérifications en secondes
            
        Returns:
            bool: True si le fichier est stable, False sinon
        """
        try:
            if not file_path.exists():
                logger.warning(f"⚠️ Fichier non trouvé: {file_path}")
                return False
            
            logger.info(f"⏳ Vérification stabilité standard: {file_path.name}")
            
            prev_size = None
            prev_mtime = None
            stable_checks = 0
            required_stable_checks = 3
            
            start_time = asyncio.get_event_loop().time()
            
            while (asyncio.get_event_loop().time() - start_time) < max_wait:
                try:
                    stat = file_path.stat()
                    current_size = stat.st_size
                    current_mtime = stat.st_mtime
                    
                    if prev_size is not None and prev_mtime is not None:
                        if current_size == prev_size and current_mtime == prev_mtime:
                            stable_checks += 1
                            logger.debug(f"📊 Fichier stable (check {stable_checks}/{required_stable_checks}): {file_path.name} ({current_size} bytes)")
                            
                            if stable_checks >= required_stable_checks:
                                logger.info(f"✅ Fichier stable et prêt: {file_path.name} ({current_size:,} bytes)")
                                
                                # Vérification finale
                                if current_size == 0:
                                    logger.warning(f"⚠️ Fichier vide: {file_path}")
                                    return False
                                
                                try:
                                    with open(file_path, 'rb') as f:
                                        f.read(1024)
                                    logger.info(f"✅ Fichier accessible: {file_path.name}")
                                    return True
                                except Exception as e:
                                    logger.warning(f"⚠️ Fichier non accessible: {file_path} - {e}")
                                    return False
                        else:
                            stable_checks = 0
                            if current_size != prev_size:
                                logger.info(f"📈 Taille changée: {prev_size:,} → {current_size:,} bytes")
                    
                    prev_size = current_size
                    prev_mtime = current_mtime
                    
                    await asyncio.sleep(check_interval)
                    
                except (OSError, PermissionError) as e:
                    logger.warning(f"⚠️ Erreur accès fichier: {file_path} - {e}")
                    await asyncio.sleep(check_interval)
                    continue
            
            logger.warning(f"⏰ Timeout stabilité standard: {file_path}")
            return False
            
        except Exception as e:
            logger.error(f"❌ Erreur vérification stabilité standard: {file_path} - {e}")
            return False
    
    async def run_pipeline(self):
        """Lance le pipeline principal"""
        logger.info("🚀 Démarrage du pipeline RL PostFlow...")
        
        # Stocker la boucle d'événements pour les callbacks
        self._event_loop = asyncio.get_running_loop()
        
        # Initialiser les composants
        frameio_ok = await self.initialize_frameio()
        infrastructure_ok = await self.initialize_shared_infrastructure()
        watcher_ok = self.initialize_watcher()
        error_handler_ok = self.initialize_error_handler()
        
        # Démarrer le dashboard seulement si activé
        dashboard_enabled = self.pipeline_config.get('dashboard', {}).get('enabled', True)
        dashboard_ok = False
        if dashboard_enabled:
            dashboard_ok = self.start_dashboard()
        else:
            logger.info("📊 Dashboard désactivé")
        
        components_status = {
            'frameio': frameio_ok,
            'infrastructure': infrastructure_ok,
            'watcher': watcher_ok,
            'error_handler': error_handler_ok,
            'dashboard': dashboard_ok
        }
        
        # Afficher le statut
        print("\n📊 STATUT DES COMPOSANTS")
        print("-" * 50)
        for component, status in components_status.items():
            if component == 'dashboard' and not dashboard_enabled:
                print(f"⚪ {component.capitalize()}: Désactivé")
            else:
                icon = "✅" if status else "❌"
                print(f"{icon} {component.capitalize()}: {'OK' if status else 'Erreur'}")
        
        if not components_status['frameio'] or not components_status['infrastructure']:
            logger.error("❌ Frame.io et infrastructure requis pour le fonctionnement")
            return False
        
        self.is_running = True
        
        # Boucle principale
        try:
            logger.info("🔄 Pipeline en cours d'exécution...")
            
            # Démarrer le watcher si disponible
            if self.watcher and components_status['watcher']:
                logger.info("👁️ Démarrage de la surveillance des fichiers...")
                self.watcher.start()
            
            while self.is_running:
                # Vérifier et rafraîchir le token si nécessaire
                if not await self.check_and_refresh_token():
                    logger.error("❌ Problème avec le token Frame.io")
                    # Continuer à fonctionner mais signaler le problème
                
                await asyncio.sleep(1)
                
        except KeyboardInterrupt:
            logger.info("🛑 Arrêt demandé par l'utilisateur")
        except Exception as e:
            logger.error(f"❌ Erreur dans la boucle principale: {e}")
        finally:
            await self.shutdown()
        
        return True
    
    async def shutdown(self):
        """Arrêt propre du pipeline"""
        logger.info("🛑 Arrêt du pipeline...")
        
        self.is_running = False
        
        # Arrêter le watcher
        if self.watcher:
            logger.info("🛑 Arrêt du watcher...")
            self.watcher.stop()
        
        # Arrêter le dashboard
        if self.dashboard_process:
            logger.info("🛑 Arrêt du dashboard...")
            self.dashboard_process.terminate()
            self.dashboard_process.wait()
            logger.info("✅ Dashboard arrêté")
        
        # Arrêter l'infrastructure partagée
        if self.shared_cloudflare_manager:
            logger.info("🛑 Arrêt du tunnel Cloudflare...")
            self.shared_cloudflare_manager.stop_tunnel()
            
        if self.shared_http_server:
            logger.info("🛑 Arrêt du serveur HTTP...")
            self.shared_http_server.stop()
        
        # Fermer les connexions
        if self.frameio_integration:
            # Cleanup si nécessaire
            pass
        
        # Afficher les métriques finales
        duration = datetime.now() - self.metrics['start_time']
        print("\n📊 MÉTRIQUES FINALES")
        print("-" * 50)
        print(f"Durée d'exécution: {duration}")
        print(f"Fichiers traités: {self.metrics['files_processed']}")
        print(f"Uploads réussis: {self.metrics['uploads_success']}")
        print(f"Uploads échoués: {self.metrics['uploads_failed']}")
        print(f"Rafraîchissements de token: {self.metrics['token_refreshes']}")
        if self.metrics['last_token_refresh']:
            print(f"Dernier rafraîchissement: {self.metrics['last_token_refresh']}")
        
        logger.info("✅ Pipeline arrêté proprement")
    
    def get_status(self) -> Dict[str, Any]:
        """Retourne le statut du pipeline pour le dashboard"""
        return {
            'running': self.is_running,
            'components': {
                'frameio': self.frameio_integration is not None,
                'watcher': self.watcher is not None,
                'error_handler': self.error_handler is not None,
                'dashboard': self.dashboard_enabled
            },
            'metrics': self.metrics,
            'config': {
                'frameio_enabled': FRAMEIO_AVAILABLE,
                'watcher_enabled': WATCHER_AVAILABLE,
                'error_handler_enabled': ERROR_HANDLER_AVAILABLE
            }
        }
    
    def _handle_file_event(self, file_event):
        """Traite un événement de fichier détecté par le watcher"""
        try:
            logger.info(f"📁 Événement de fichier détecté: {file_event.file_path}")
            
            # Créer une tâche asyncio pour traiter le fichier
            if self.is_running and hasattr(self, '_event_loop') and self._event_loop:
                file_path = Path(file_event.file_path)
                # Planifier le traitement du fichier dans la boucle d'événements
                asyncio.run_coroutine_threadsafe(
                    self.process_file(file_path), 
                    self._event_loop
                )
            
        except Exception as e:
            logger.error(f"❌ Erreur lors du traitement de l'événement: {e}")
    
    async def check_and_refresh_token(self) -> bool:
        """Vérifie et rafraîchit le token Frame.io si nécessaire"""
        try:
            # Vérifier si c'est le moment de vérifier le token
            now = datetime.now()
            if (self.last_token_check and 
                (now - self.last_token_check).total_seconds() < self.token_check_interval):
                return True
            
            self.last_token_check = now
            
            if not self.frameio_integration:
                return False
            
            # Créer une nouvelle instance d'authentification pour vérifier
            auth = create_frameio_auth()
            
            # Vérifier si le token est valide
            if not auth.is_token_valid():
                logger.warning("⚠️ Token Frame.io expiré, rafraîchissement en cours...")
                
                # Tenter de rafraîchir le token
                if await auth.ensure_valid_token():
                    logger.info("✅ Token Frame.io rafraîchi avec succès")
                    self.metrics['token_refreshes'] += 1
                    self.metrics['last_token_refresh'] = now
                    
                    # Mettre à jour l'intégration avec le nouveau token
                    discord_webhook = self.config.get('discord', {}).get('webhook_url')
                    self.frameio_integration = FrameIOIntegrationManager(
                        auth=auth,
                        discord_webhook_url=discord_webhook
                    )
                    return True
                else:
                    logger.error("❌ Échec du rafraîchissement du token Frame.io")
                    return False
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de la vérification du token: {e}")
            return False
    
    def _update_environment_variables(self):
        """Met à jour les variables d'environnement avec les IDs de la configuration"""
        try:
            frameio_config = self.config.get('frameio', {})
            
            # Mettre à jour les variables d'environnement avec les valeurs de la configuration
            if 'account_id' in frameio_config:
                os.environ['FRAMEIO_ACCOUNT_ID'] = frameio_config['account_id']
                logger.info(f"✅ Variable d'environnement FRAMEIO_ACCOUNT_ID mise à jour: {frameio_config['account_id']}")
            
            if 'workspace_id' in frameio_config:
                os.environ['FRAMEIO_WORKSPACE_ID'] = frameio_config['workspace_id']
                logger.info(f"✅ Variable d'environnement FRAMEIO_WORKSPACE_ID mise à jour: {frameio_config['workspace_id']}")
            
            if 'default_workspace_id' in frameio_config:
                os.environ['FRAMEIO_DEFAULT_WORKSPACE_ID'] = frameio_config['default_workspace_id']
                logger.info(f"✅ Variable d'environnement FRAMEIO_DEFAULT_WORKSPACE_ID mise à jour: {frameio_config['default_workspace_id']}")
            
            if 'default_project_id' in frameio_config:
                os.environ['FRAMEIO_DEFAULT_PROJECT_ID'] = frameio_config['default_project_id']
                logger.info(f"✅ Variable d'environnement FRAMEIO_DEFAULT_PROJECT_ID mise à jour: {frameio_config['default_project_id']}")
            
            # Mettre à jour les autres variables si nécessaires
            if 'project_id' in frameio_config:
                os.environ['FRAMEIO_PROJECT_ID'] = frameio_config['project_id']
                
        except Exception as e:
            logger.warning(f"⚠️ Erreur lors de la mise à jour des variables d'environnement: {e}")


def setup_signal_handlers(pipeline: RLPostFlowPipeline):
    """Configure les gestionnaires de signaux pour arrêt propre"""
    def signal_handler(signum, frame):
        logger.info(f"🛑 Signal {signum} reçu, arrêt en cours...")
        asyncio.create_task(pipeline.shutdown())
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)


async def main():
    """Fonction principale"""
    parser = argparse.ArgumentParser(description='RL PostFlow Pipeline v4.0.0')
    parser.add_argument('--config', type=Path, help='Chemin vers le fichier de configuration')
    parser.add_argument('--no-dashboard', action='store_true', help='Désactiver le dashboard')
    parser.add_argument('--watch-only', action='store_true', help='Mode surveillance uniquement')
    parser.add_argument('--upload-only', action='store_true', help='Mode upload uniquement')
    parser.add_argument('--debug', action='store_true', help='Mode debug')
    parser.add_argument('--test', action='store_true', help='Test des composants uniquement')
    
    args = parser.parse_args()
    
    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Initialiser le pipeline
    pipeline = RLPostFlowPipeline(config_path=args.config)
    
    # Configurer l'arrêt propre
    setup_signal_handlers(pipeline)
    
    # Afficher la bannière
    pipeline.print_banner()
    
    if args.no_dashboard:
        # S'assurer que la configuration dashboard existe
        if 'dashboard' not in pipeline.pipeline_config:
            pipeline.pipeline_config['dashboard'] = {}
        pipeline.pipeline_config['dashboard']['enabled'] = False
    
    if args.test:
        # Mode test - vérifier les composants
        logger.info("🧪 Mode test - Vérification des composants...")
        
        frameio_ok = await pipeline.initialize_frameio()
        infrastructure_ok = await pipeline.initialize_shared_infrastructure()
        watcher_ok = pipeline.initialize_watcher()
        error_handler_ok = pipeline.initialize_error_handler()
        
        print(f"\n📊 RÉSULTATS DES TESTS")
        print("-" * 50)
        print(f"{'✅' if frameio_ok else '❌'} Frame.io: {'OK' if frameio_ok else 'Erreur'}")
        print(f"{'✅' if infrastructure_ok else '❌'} Infrastructure: {'OK' if infrastructure_ok else 'Erreur'}")
        print(f"{'✅' if watcher_ok else '❌'} Watcher: {'OK' if watcher_ok else 'Erreur'}")
        print(f"{'✅' if error_handler_ok else '❌'} Error Handler: {'OK' if error_handler_ok else 'Erreur'}")
        
        return 0 if all([frameio_ok, infrastructure_ok, watcher_ok, error_handler_ok]) else 1
    
    # Lancer le pipeline
    try:
        await pipeline.run_pipeline()
        return 0
    except Exception as e:
        logger.error(f"❌ Erreur fatale: {e}")
        return 1


if __name__ == "__main__":
    try:
        exit_code = asyncio.run(main())
        sys.exit(exit_code)
    except KeyboardInterrupt:
        logger.info("🛑 Arrêt demandé")
        sys.exit(0)
    except Exception as e:
        logger.error(f"💥 Erreur fatale: {e}")
        sys.exit(1)
