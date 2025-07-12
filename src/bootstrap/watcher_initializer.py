#!/usr/bin/env python3
"""
🔍 Watcher Initializer - Bootstrap Module
=========================================

Initialise le watcher LucidLink pour la surveillance des fichiers.
Extrait de main.py pour une meilleure organisation.

Version: 4.1.1
Date: 9 juillet 2025
"""

import logging
from pathlib import Path
from typing import Dict, Any, Optional, Callable
from src.utils.config import ConfigManager

logger = logging.getLogger(__name__)

try:
    from src.core.lucidlink_watcher import LucidLinkWatcher
    WATCHER_AVAILABLE = True
except ImportError as e:
    logger.error(f"Watcher module not available: {e}")
    WATCHER_AVAILABLE = False


class WatcherInitializer:
    """Gestionnaire d'initialisation du watcher LucidLink"""
    
    def __init__(self, config: Dict[str, Any], pipeline_config: Dict[str, Any], config_manager: ConfigManager):
        self.config = config
        self.pipeline_config = pipeline_config
        self.config_manager = config_manager
        self.watcher = None
        
    def initialize_watcher(self, file_callback: Callable, sheets_tracker=None) -> bool:
        """Initialise le watcher LucidLink v2.0"""
        if not WATCHER_AVAILABLE:
            logger.error("❌ Watcher non disponible - modules manquants")
            return False
        
        try:
            logger.info("🔍 Initialisation du watcher LucidLink...")
            
            # Vérifier si le watcher est activé
            watcher_config = self.pipeline_config.get('watcher', {})
            if not watcher_config.get('enabled', True):
                logger.info("⚪ Watcher désactivé dans la configuration")
                return False
            
            # Obtenir le chemin de surveillance (avec détection automatique)
            from src.utils.cross_platform_paths import CrossPlatformPathManager
            path_manager = CrossPlatformPathManager()
            
            # Chemin par défaut cross-platform
            default_watch_path = path_manager.build_lucidlink_path('o2b-undllm', '4_OUT', '2_FROM_ANIM')
            watch_path = self.config.get('lucidlink', {}).get('watch_path', str(default_watch_path))
            
            logger.info(f"📁 Chemin de surveillance: {watch_path}")
            
            # Vérifier que le chemin existe
            if not Path(watch_path).exists():
                logger.error(f"❌ Chemin de surveillance non trouvé: {watch_path}")
                return False
            
            # Créer le watcher avec notre callback et le tracker Sheets
            logger.info("🔧 Création du watcher...")
            self.watcher = LucidLinkWatcher(watch_path, file_callback, sheets_tracker)
            
            # Configurer le watcher avec les paramètres du pipeline
            self._configure_watcher(watcher_config)
            
            logger.info(f"✅ Watcher LucidLink v2.0 initialisé pour: {watch_path}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'initialisation du watcher: {e}")
            return False
    
    def _configure_watcher(self, watcher_config: Dict[str, Any]):
        """Configure le watcher avec les paramètres du pipeline"""
        try:
            if not self.watcher:
                return
            
            # Configuration de l'intervalle de polling
            polling_interval = watcher_config.get('polling_interval', 2.0)
            if hasattr(self.watcher, 'set_polling_interval'):
                self.watcher.set_polling_interval(polling_interval)
                logger.info(f"⏱️ Intervalle de polling: {polling_interval}s")
            
            # Configuration des patterns à ignorer
            ignore_patterns = watcher_config.get('ignore_patterns', [])
            if ignore_patterns and hasattr(self.watcher, 'set_ignore_patterns'):
                self.watcher.set_ignore_patterns(ignore_patterns)
                logger.info(f"🚫 Patterns ignorés: {ignore_patterns}")
            
            # Configuration des extensions de fichiers
            file_extensions = watcher_config.get('file_extensions', ['.mov', '.mp4', '.avi', '.mkv'])
            if file_extensions and hasattr(self.watcher, 'set_file_extensions'):
                self.watcher.set_file_extensions(file_extensions)
                logger.info(f"📁 Extensions surveillées: {file_extensions}")
            
            # Configuration du check de stabilité
            stability_config = watcher_config.get('stability_check', {})
            if stability_config.get('enabled', True) and hasattr(self.watcher, 'set_stability_check'):
                self.watcher.set_stability_check(
                    max_wait=stability_config.get('max_wait', 60),
                    check_interval=stability_config.get('check_interval', 2),
                    required_stable_checks=stability_config.get('required_stable_checks', 3)
                )
                logger.info(f"⚖️ Vérification de stabilité configurée")
            
            logger.info("✅ Watcher configuré avec succès")
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de la configuration du watcher: {e}")
    
    def start_watcher(self) -> bool:
        """Démarre le watcher"""
        try:
            if not self.watcher:
                logger.error("❌ Watcher non initialisé")
                return False
            
            logger.info("🚀 Démarrage du watcher...")
            self.watcher.start()
            logger.info("✅ Watcher démarré avec succès")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur lors du démarrage du watcher: {e}")
            return False
    
    def stop_watcher(self) -> bool:
        """Arrête le watcher"""
        try:
            if not self.watcher:
                logger.warning("⚠️ Aucun watcher à arrêter")
                return True
            
            logger.info("🛑 Arrêt du watcher...")
            self.watcher.stop()
            logger.info("✅ Watcher arrêté avec succès")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'arrêt du watcher: {e}")
            return False
    
    def get_watcher(self) -> Optional[LucidLinkWatcher]:
        """Retourne l'instance du watcher"""
        return self.watcher
    
    def is_watcher_running(self) -> bool:
        """Vérifie si le watcher est en cours d'exécution"""
        if not self.watcher:
            return False
        
        return hasattr(self.watcher, 'is_running') and self.watcher.is_running
    
    def get_watcher_status(self) -> Dict[str, Any]:
        """Retourne le statut du watcher"""
        if not self.watcher:
            return {
                'available': False,
                'initialized': False,
                'running': False,
                'watch_path': None
            }
        
        watch_path = self.config.get('lucidlink', {}).get('watch_path', '')
        
        return {
            'available': WATCHER_AVAILABLE,
            'initialized': True,
            'running': self.is_watcher_running(),
            'watch_path': watch_path,
            'config': self.pipeline_config.get('watcher', {})
        }


def initialize_watcher(config: Dict[str, Any], pipeline_config: Dict[str, Any], 
                      config_manager: ConfigManager, file_callback: Callable, 
                      sheets_tracker=None) -> tuple[bool, Optional[LucidLinkWatcher]]:
    """
    Fonction utilitaire pour initialiser le watcher
    
    Args:
        config: Configuration principale
        pipeline_config: Configuration du pipeline
        config_manager: Gestionnaire de configuration
        file_callback: Callback pour les nouveaux fichiers
        sheets_tracker: Tracker Google Sheets optionnel
        
    Returns:
        tuple: (success, watcher_instance)
    """
    initializer = WatcherInitializer(config, pipeline_config, config_manager)
    success = initializer.initialize_watcher(file_callback, sheets_tracker)
    return success, initializer.get_watcher()
