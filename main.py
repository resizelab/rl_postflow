#!/usr/bin/env python3
"""
🎬 RL PostFlow - Main Pipeline Controller
=======================================

Point d'entrée principal du pipeline d'intégration LucidLink → Frame.io
- Orchestration de toutes les intégrations
- Interface avec le dashboard web
- Surveillance en temps réel
- Gestion des erreurs centralisée

Version: 4.1.0 (Modularisé)
Date: 9 juillet 2025
"""

import sys
import os
import signal
import asyncio
import logging
import argparse
from pathlib import Path
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

# Imports des modules bootstrap
try:
    from src.bootstrap import (
        load_config,
        initialize_frameio,
        initialize_watcher,
        start_dashboard,
        initialize_infrastructure,
        PostFlowRunner,
        startup_sync_check
    )
    BOOTSTRAP_AVAILABLE = True
except ImportError as e:
    logger.error(f"Bootstrap modules not available: {e}")
    BOOTSTRAP_AVAILABLE = False

try:
    from src.utils.error_handler import ErrorHandler
    ERROR_HANDLER_AVAILABLE = True
except ImportError as e:
    logger.error(f"Error handler not available: {e}")
    ERROR_HANDLER_AVAILABLE = False


class RLPostFlowPipeline:
    """
    Pipeline principal RL PostFlow avec orchestration complète
    """
    
    def __init__(self, config_path: Optional[Path] = None):
        """Initialise le pipeline principal"""
        self.config_path = config_path
        self.project_root = Path(__file__).parent
        
        # Configurations
        self.config = {}
        self.pipeline_config = {}
        self.config_manager = None
        
        # Composants du pipeline
        self.frameio_auth = None
        self.frameio_manager = None
        self.watcher = None
        self.dashboard_initializer = None
        self.infrastructure_manager = None
        self.error_handler = None
        
        # Runner principal
        self.runner = None
        
        # État du pipeline
        self.is_running = False
        self._shutdown_event = asyncio.Event()
        
        # Initialiser les composants
        self._initialize_components()
    
    def _initialize_components(self):
        """Initialise les composants de base"""
        try:
            logger.info("🔧 Initialisation des composants de base...")
            
            # Charger les configurations
            self._load_configurations()
            
            # Initialiser le gestionnaire d'erreurs
            self._initialize_error_handler()
            
            logger.info("✅ Composants de base initialisés")
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'initialisation des composants: {e}")
            raise
    
    def _load_configurations(self):
        """Charge les configurations via le module bootstrap"""
        try:
            if not BOOTSTRAP_AVAILABLE:
                raise ImportError("Bootstrap modules not available")
            
            # Utiliser le module bootstrap pour charger les configs
            self.config, self.pipeline_config, self.config_manager = load_config(self.config_path)
            
            logger.info("✅ Configurations chargées via bootstrap")
            
        except Exception as e:
            logger.error(f"❌ Erreur lors du chargement des configurations: {e}")
            raise
    
    def _initialize_error_handler(self):
        """Initialise le gestionnaire d'erreurs"""
        if not ERROR_HANDLER_AVAILABLE:
            logger.warning("⚠️ Error handler not available")
            return
        
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
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'initialisation du gestionnaire d'erreurs: {e}")
    
    def print_banner(self):
        """Affiche la bannière de démarrage"""
        print("\n" + "="*80)
        print("🎬 RL POSTFLOW - PIPELINE D'INTÉGRATION v4.1.0 (Modularisé)")
        print("="*80)
        print("Pipeline automatisé LucidLink → Frame.io")
        print("• 🔐 Authentification OAuth Web App autonome")
        print("• 📁 Gestion automatique des structures Frame.io")
        print("• 📤 Upload intelligent avec retry")
        print("• 🎛️ Dashboard web intégré")
        print("• 📢 Notifications Discord")
        print("• 🧩 Architecture modulaire")
        print("="*80)
    
    async def run_pipeline(self):
        """Lance le pipeline principal PostFlow v2.0"""
        if not BOOTSTRAP_AVAILABLE:
            logger.error("❌ Bootstrap modules not available")
            return False
        
        try:
            logger.info("🚀 Démarrage du pipeline PostFlow v2.0...")
            
            # Initialiser l'infrastructure partagée
            infrastructure_ok, self.infrastructure_manager = await initialize_infrastructure(
                self.config, self.pipeline_config, self.config_manager
            )
            
            # Initialiser Frame.io
            frameio_ok, self.frameio_auth, self.frameio_manager = await initialize_frameio(
                self.config, self.config_manager
            )
            
            # Initialiser le dashboard
            dashboard_ok, self.dashboard_initializer = start_dashboard(
                self.config, self.pipeline_config, self.config_manager
            )
            
            # Créer le runner principal
            self.runner = PostFlowRunner(self.config, self.pipeline_config, self.config_manager)
            
            # Initialiser le watcher avec le callback du runner
            watcher_ok, self.watcher = initialize_watcher(
                self.config, self.pipeline_config, self.config_manager, 
                self.runner._handle_new_file, self.runner.sheets_tracker
            )
            
            # Initialiser les composants dans le runner
            self.runner.initialize_components(
                self.frameio_auth, self.frameio_manager, self.watcher, 
                self.dashboard_initializer, self.infrastructure_manager, self.error_handler
            )
            
            # Effectuer la vérification de synchronisation au démarrage
            logger.info("🔄 Vérification de synchronisation au démarrage...")
            try:
                sync_ok = await startup_sync_check(
                    self.config, 
                    self.config_manager,
                    self.runner.upload_tracker if hasattr(self.runner, 'upload_tracker') else None,
                    self.runner.discord_notifier if hasattr(self.runner, 'discord_notifier') else None,
                    self.runner._handle_new_file,  # Callback pour traiter les fichiers manqués
                    max_files_to_process=3
                )
                
                if sync_ok:
                    logger.info("✅ Vérification de synchronisation terminée")
                else:
                    logger.warning("⚠️ Vérification de synchronisation échouée")
                    
            except Exception as e:
                logger.warning(f"⚠️ Erreur lors de la vérification de synchronisation: {e}")
            
            # Afficher le statut des composants
            components_status = {
                'infrastructure': infrastructure_ok,
                'frameio': frameio_ok,
                'watcher': watcher_ok,
                'dashboard': dashboard_ok,
                'error_handler': self.error_handler is not None
            }
            
            self._print_component_status(components_status)
            
            # Vérifier les composants essentiels
            if not frameio_ok:
                logger.error("❌ Frame.io requis pour le fonctionnement")
                return False
            
            if not watcher_ok:
                logger.error("❌ Watcher requis pour le fonctionnement")
                return False
            
            # Lancer le runner principal
            return await self.runner.run_pipeline()
            
        except Exception as e:
            logger.error(f"❌ Erreur lors du lancement du pipeline: {e}")
            return False
    
    def _print_component_status(self, components_status: Dict[str, bool]):
        """Affiche le statut des composants"""
        print("\n📊 STATUT DES COMPOSANTS")
        print("-" * 50)
        
        for component, status in components_status.items():
            dashboard_config = self.pipeline_config.get('dashboard', {})
            
            if component == 'dashboard' and not dashboard_config.get('enabled', True):
                print(f"⚪ {component.capitalize()}: Désactivé")
            else:
                icon = "✅" if status else "❌"
                print(f"{icon} {component.capitalize()}: {'OK' if status else 'Erreur'}")
    
    async def shutdown(self):
        """Arrêt propre du pipeline"""
        logger.info("🛑 Arrêt du pipeline PostFlow v2.0...")
        
        if self.runner:
            await self.runner.shutdown()
        
        self.is_running = False
        self._shutdown_event.set()
        
        logger.info("✅ Pipeline PostFlow v2.0 arrêté")
    
    def force_shutdown(self):
        """Arrêt forcé pour debugging"""
        logger.warning("⚠️ Arrêt forcé demandé (mode debug)")
        self.is_running = False
        self._shutdown_event.set()
        
        if self.runner:
            self.runner.force_shutdown()
        
        # Forcer la sortie du processus principal
        sys.exit(0)
    
    def get_status(self):
        """Retourne le statut du pipeline"""
        if self.runner:
            return self.runner.get_status()
        
        return {
            'running': self.is_running,
            'components': {
                'frameio': self.frameio_manager is not None,
                'watcher': self.watcher is not None,
                'error_handler': self.error_handler is not None,
                'dashboard': self.dashboard_initializer is not None
            },
            'config': {
                'frameio_enabled': self.frameio_manager is not None,
                'watcher_enabled': self.watcher is not None,
                'error_handler_enabled': self.error_handler is not None
            }
        }
    
    async def process_file(self, file_path: Path, force: bool = False) -> bool:
        """Traite un fichier spécifique"""
        if not self.runner:
            logger.error("❌ Runner non initialisé")
            return False
        
        return await self.runner.process_file(file_path, force)


def setup_signal_handlers(pipeline: RLPostFlowPipeline):
    """Configure les gestionnaires de signaux pour arrêt propre"""
    def signal_handler(signum, frame):
        logger.info(f"🛑 Signal {signum} reçu, arrêt en cours...")
        pipeline.is_running = False
        pipeline._shutdown_event.set()
        
        # Forcer l'arrêt si le signal est reçu plusieurs fois
        if hasattr(signal_handler, 'called'):
            logger.warning("🛑 Signal reçu plusieurs fois, arrêt forcé")
            sys.exit(1)
        signal_handler.called = True
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)


async def main():
    """Fonction principale"""
    parser = argparse.ArgumentParser(description='RL PostFlow Pipeline v4.1.0 (Modularisé)')
    parser.add_argument('--config', type=Path, help='Chemin vers le fichier de configuration')
    parser.add_argument('--file', type=Path, help='Traiter un fichier spécifique')
    parser.add_argument('--no-dashboard', action='store_true', help='Désactiver le dashboard')
    parser.add_argument('--watch-only', action='store_true', help='Mode surveillance uniquement')
    parser.add_argument('--upload-only', action='store_true', help='Mode upload uniquement')
    parser.add_argument('--debug', action='store_true', help='Mode debug')
    parser.add_argument('--test', action='store_true', help='Test des composants uniquement')
    parser.add_argument('--force', action='store_true', help='Forcer le re-traitement même si le fichier a déjà été traité')
    
    args = parser.parse_args()
    
    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Variable pour stocker le pipeline
    pipeline = None
    
    try:
        # Initialiser le pipeline
        pipeline = RLPostFlowPipeline(config_path=args.config)
        
        # Configurer l'arrêt propre
        setup_signal_handlers(pipeline)
        
        # Afficher la bannière
        pipeline.print_banner()
        
        # Configurer le dashboard selon les arguments
        if args.no_dashboard:
            if 'dashboard' not in pipeline.pipeline_config:
                pipeline.pipeline_config['dashboard'] = {}
            pipeline.pipeline_config['dashboard']['enabled'] = False
        
        if args.test:
            # Mode test - vérifier les composants
            logger.info("🧪 Mode test - Vérification des composants...")
            
            # Tester les modules bootstrap
            if not BOOTSTRAP_AVAILABLE:
                logger.error("❌ Bootstrap modules not available")
                return 1
            
            # Tester les composants individuellement
            try:
                # Test configuration
                config, pipeline_config, config_manager = load_config(args.config)
                logger.info("✅ Configuration: OK")
                
                # Test Frame.io
                frameio_ok, frameio_auth, frameio_manager = await initialize_frameio(config, config_manager)
                logger.info(f"{'✅' if frameio_ok else '❌'} Frame.io: {'OK' if frameio_ok else 'Erreur'}")
                
                # Test infrastructure
                infrastructure_ok, infrastructure_manager = await initialize_infrastructure(config, pipeline_config, config_manager)
                logger.info(f"{'✅' if infrastructure_ok else '❌'} Infrastructure: {'OK' if infrastructure_ok else 'Erreur'}")
                
                # Test dashboard
                dashboard_ok, dashboard_initializer = start_dashboard(config, pipeline_config, config_manager)
                logger.info(f"{'✅' if dashboard_ok else '❌'} Dashboard: {'OK' if dashboard_ok else 'Erreur'}")
                
                # Test error handler
                error_handler_ok = ERROR_HANDLER_AVAILABLE
                logger.info(f"{'✅' if error_handler_ok else '❌'} Error Handler: {'OK' if error_handler_ok else 'Erreur'}")
                
                # Arrêter les composants de test
                if dashboard_initializer:
                    dashboard_initializer.stop_dashboard()
                if infrastructure_manager:
                    infrastructure_manager.stop_infrastructure()
                
                print(f"\n📊 RÉSULTATS DES TESTS")
                print("-" * 50)
                print(f"{'✅' if frameio_ok else '❌'} Frame.io: {'OK' if frameio_ok else 'Erreur'}")
                print(f"{'✅' if infrastructure_ok else '❌'} Infrastructure: {'OK' if infrastructure_ok else 'Erreur'}")
                print(f"{'✅' if dashboard_ok else '❌'} Dashboard: {'OK' if dashboard_ok else 'Erreur'}")
                print(f"{'✅' if error_handler_ok else '❌'} Error Handler: {'OK' if error_handler_ok else 'Erreur'}")
                
                return 0 if all([frameio_ok, infrastructure_ok, error_handler_ok]) else 1
                
            except Exception as e:
                logger.error(f"❌ Erreur lors des tests: {e}")
                return 1
        
        if args.file:
            # Mode traitement de fichier spécifique
            logger.info(f"📁 Mode fichier spécifique: {args.file}")
            
            # Vérifier que le fichier existe
            if not args.file.exists():
                logger.error(f"❌ Fichier non trouvé: {args.file}")
                return 1
            
            # Vérifier que c'est bien un fichier
            if not args.file.is_file():
                logger.error(f"❌ Le chemin spécifié n'est pas un fichier: {args.file}")
                return 1
            
            # Initialiser les composants nécessaires pour le traitement
            logger.info("🔧 Initialisation des composants pour traitement de fichier...")
            
            # Vérifications supplémentaires
            try:
                from src.integrations.frameio.upload import validate_strict_nomenclature
                nomenclature_info = validate_strict_nomenclature(str(args.file))
                logger.info(f"✅ Nomenclature validée: {nomenclature_info['shot_id']} {nomenclature_info['version']}")
            except Exception as e:
                logger.error(f"❌ Fichier non conforme à la nomenclature: {e}")
                return 1
            
            # Traiter le fichier avec le workflow complet
            logger.info("🚀 Début du traitement...")
            if args.force:
                logger.info("🔄 Mode --force activé : traitement forcé même si le fichier a déjà été traité")
            
            try:
                # Initialiser les composants nécessaires
                infrastructure_ok, infrastructure_manager = await initialize_infrastructure(
                    pipeline.config, pipeline.pipeline_config, pipeline.config_manager
                )
                frameio_ok, frameio_auth, frameio_manager = await initialize_frameio(
                    pipeline.config, pipeline.config_manager
                )
                
                # Créer le runner pour traiter le fichier
                runner = PostFlowRunner(pipeline.config, pipeline.pipeline_config, pipeline.config_manager)
                runner.initialize_components(
                    frameio_auth, frameio_manager, None, None, infrastructure_manager, pipeline.error_handler
                )
                
                # Traiter le fichier
                result = await runner.process_file(args.file, force=args.force)
                
                # Afficher le résumé du tracking
                if runner.upload_tracker:
                    stats = runner.upload_tracker.get_stats()
                    logger.info(f"📊 === RÉSUMÉ FINAL ===")
                    logger.info(f"📊 Total uploads: {stats.get('total_uploads', 0)}")
                    logger.info(f"📊 Uploads terminés: {stats.get('by_status', {}).get('COMPLETED', 0)}")
                    logger.info(f"📊 Uploads Frame.io: {stats.get('frameio_uploads', 0)}")
                    logger.info(f"📊 Notifications Discord: {stats.get('discord_notifications', 0)}")
                    logger.info(f"📊 Mises à jour Sheets: {stats.get('sheets_updates', 0)}")
                
                if result:
                    logger.info(f"✅ Traitement terminé avec succès: {args.file.name}")
                    return 0
                else:
                    logger.error(f"❌ Échec du traitement: {args.file.name}")
                    return 1
                    
            except Exception as e:
                logger.error(f"❌ Erreur lors du traitement: {e}")
                return 1
        
        # Lancer le pipeline normal (mode surveillance)
        result = await pipeline.run_pipeline()
        return 0 if result else 1
        
    except KeyboardInterrupt:
        logger.info("🛑 Interruption clavier détectée")
        return 0
    except Exception as e:
        logger.error(f"❌ Erreur fatale: {e}")
        return 1
    finally:
        # S'assurer que le pipeline est correctement fermé
        if pipeline:
            try:
                await pipeline.shutdown()
            except Exception as e:
                logger.warning(f"⚠️ Erreur lors de l'arrêt: {e}")


if __name__ == "__main__":
    try:
        # Utiliser une approche plus robuste pour l'arrêt
        exit_code = asyncio.run(main())
        sys.exit(exit_code)
    except KeyboardInterrupt:
        logger.info("🛑 Arrêt demandé par l'utilisateur")
        sys.exit(0)
    except Exception as e:
        logger.error(f"💥 Erreur fatale: {e}")
        sys.exit(1)
    finally:
        # S'assurer que tous les processus sont terminés
        try:
            # Nettoyer les processus enfants
            os.killpg(os.getpgrp(), signal.SIGTERM)
        except:
            pass
