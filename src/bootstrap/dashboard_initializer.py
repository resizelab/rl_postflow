#!/usr/bin/env python3
"""
📊 Dashboard Initializer - Bootstrap Module
==========================================

Initialise et lance le dashboard web PostFlow.
Extrait de main.py pour une meilleure organisation.

Version: 4.1.1
Date: 9 juillet 2025
"""

import sys
import time
import logging
import subprocess
from pathlib import Path
from typing import Dict, Any, Optional
from src.utils.config import ConfigManager

logger = logging.getLogger(__name__)


class DashboardInitializer:
    """Gestionnaire d'initialisation du dashboard web"""
    
    def __init__(self, config: Dict[str, Any], pipeline_config: Dict[str, Any], config_manager: ConfigManager):
        self.config = config
        self.pipeline_config = pipeline_config
        self.config_manager = config_manager
        self.dashboard_process = None
        self.dashboard_enabled = False
        self.project_root = Path(__file__).parent.parent.parent
        
    def start_dashboard(self) -> bool:
        """Lance le dashboard web en arrière-plan"""
        dashboard_config = self.pipeline_config.get('dashboard', {})
        
        if not dashboard_config.get('enabled', True):
            logger.info("📊 Dashboard désactivé dans la configuration")
            return False
        
        try:
            logger.info("🎛️ Initialisation du dashboard web...")
            
            # Vérifier que le script dashboard existe
            dashboard_script = self.project_root / "dashboard.py"
            if not dashboard_script.exists():
                logger.warning("⚠️ Script dashboard non trouvé")
                return False
            
            # Préparer les variables d'environnement
            env = self._prepare_dashboard_environment()
            
            # Lancer le dashboard en subprocess
            logger.info("🚀 Démarrage du dashboard web...")
            
            self.dashboard_process = subprocess.Popen(
                [sys.executable, str(dashboard_script)],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                env=env
            )
            
            # Attendre un peu pour vérifier que le dashboard démarre
            time.sleep(2)
            
            if self.dashboard_process.poll() is None:
                self.dashboard_enabled = True
                port = dashboard_config.get('port', 8080)
                host = dashboard_config.get('host', 'localhost')
                logger.info(f"✅ Dashboard démarré sur http://{host}:{port}")
                return True
            else:
                # Récupérer les logs d'erreur du subprocess
                stdout, stderr = self.dashboard_process.communicate()
                logger.error("❌ Échec du démarrage du dashboard")
                if stderr:
                    logger.error(f"   STDERR: {stderr.decode('utf-8', errors='ignore')}")
                if stdout:
                    logger.error(f"   STDOUT: {stdout.decode('utf-8', errors='ignore')}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur lors du démarrage du dashboard: {e}")
            return False
    
    def _prepare_dashboard_environment(self) -> Dict[str, str]:
        """Prépare les variables d'environnement pour le dashboard"""
        import os
        
        env = os.environ.copy()
        
        # Ajouter les configurations du dashboard
        dashboard_config = self.pipeline_config.get('dashboard', {})
        
        env['DASHBOARD_HOST'] = dashboard_config.get('host', 'localhost')
        env['DASHBOARD_PORT'] = str(dashboard_config.get('port', 8080))
        env['DASHBOARD_DEBUG'] = str(dashboard_config.get('debug', False))
        
        # Ajouter les configurations générales
        env['PIPELINE_VERSION'] = self.pipeline_config.get('version', '4.1.1')
        env['PIPELINE_NAME'] = self.pipeline_config.get('name', 'RL PostFlow Pipeline')
        
        # Ajouter les chemins de configuration
        env['CONFIG_DIR'] = str(self.project_root / 'config')
        env['LOGS_DIR'] = str(self.project_root / 'logs')
        env['OUTPUT_DIR'] = str(self.project_root / 'output')
        
        return env
    
    def stop_dashboard(self) -> bool:
        """Arrête le dashboard"""
        if not self.dashboard_process:
            logger.info("📊 Aucun dashboard à arrêter")
            return True
        
        try:
            logger.info("🛑 Arrêt du dashboard...")
            
            self.dashboard_process.terminate()
            
            # Attendre maximum 5 secondes
            try:
                self.dashboard_process.wait(timeout=5)
                logger.info("✅ Dashboard arrêté")
            except subprocess.TimeoutExpired:
                logger.warning("⚠️ Timeout dashboard, arrêt forcé")
                self.dashboard_process.kill()
                self.dashboard_process.wait()
                logger.info("✅ Dashboard arrêté (forcé)")
            
            self.dashboard_enabled = False
            self.dashboard_process = None
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'arrêt du dashboard: {e}")
            return False
    
    def is_dashboard_running(self) -> bool:
        """Vérifie si le dashboard est en cours d'exécution"""
        if not self.dashboard_process:
            return False
        
        return self.dashboard_process.poll() is None
    
    def get_dashboard_status(self) -> Dict[str, Any]:
        """Retourne le statut du dashboard"""
        dashboard_config = self.pipeline_config.get('dashboard', {})
        
        return {
            'enabled': self.dashboard_enabled,
            'configured': dashboard_config.get('enabled', True),
            'running': self.is_dashboard_running(),
            'host': dashboard_config.get('host', 'localhost'),
            'port': dashboard_config.get('port', 8080),
            'debug': dashboard_config.get('debug', False),
            'process_id': self.dashboard_process.pid if self.dashboard_process else None
        }
    
    def get_dashboard_url(self) -> Optional[str]:
        """Retourne l'URL du dashboard"""
        if not self.dashboard_enabled:
            return None
        
        dashboard_config = self.pipeline_config.get('dashboard', {})
        host = dashboard_config.get('host', 'localhost')
        port = dashboard_config.get('port', 8080)
        
        return f"http://{host}:{port}"
    
    def restart_dashboard(self) -> bool:
        """Redémarre le dashboard"""
        try:
            logger.info("🔄 Redémarrage du dashboard...")
            
            # Arrêter le dashboard actuel
            if not self.stop_dashboard():
                logger.error("❌ Échec de l'arrêt du dashboard")
                return False
            
            # Attendre un peu
            time.sleep(1)
            
            # Redémarrer le dashboard
            if self.start_dashboard():
                logger.info("✅ Dashboard redémarré avec succès")
                return True
            else:
                logger.error("❌ Échec du redémarrage du dashboard")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur lors du redémarrage du dashboard: {e}")
            return False


def start_dashboard(config: Dict[str, Any], pipeline_config: Dict[str, Any], 
                   config_manager: ConfigManager) -> tuple[bool, Optional[DashboardInitializer]]:
    """
    Fonction utilitaire pour démarrer le dashboard
    
    Args:
        config: Configuration principale
        pipeline_config: Configuration du pipeline
        config_manager: Gestionnaire de configuration
        
    Returns:
        tuple: (success, dashboard_initializer)
    """
    initializer = DashboardInitializer(config, pipeline_config, config_manager)
    success = initializer.start_dashboard()
    return success, initializer
