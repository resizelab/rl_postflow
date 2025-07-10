#!/usr/bin/env python3
"""
🏗️ Infrastructure Manager - Bootstrap Module
======================            self.shared_http_server = RangeFileServer(host, port)
            
            # Démarrer le serveur
            if self.shared_http_server.start():==================

Gère l'infrastructure partagée (serveur HTTP, tunnel Cloudflare).
Extrait de main.py pour une meilleure organisation.

Version: 4.1.1
Date: 9 juillet 2025
"""

import logging
from typing import Dict, Any, Optional
from src.utils.config import ConfigManager

logger = logging.getLogger(__name__)

try:
    from src.integrations.frameio.range_server import RangeFileServer
    HTTP_SERVER_AVAILABLE = True
except ImportError as e:
    logger.warning(f"HTTP server module not available: {e}")
    RangeFileServer = None
    HTTP_SERVER_AVAILABLE = False

try:
    from src.integrations.frameio.cloudflare_manager import CloudflareManager
    CLOUDFLARE_AVAILABLE = True
except ImportError as e:
    logger.warning(f"Cloudflare tunnel module not available: {e}")
    CloudflareManager = None
    CLOUDFLARE_AVAILABLE = False

INFRASTRUCTURE_AVAILABLE = HTTP_SERVER_AVAILABLE or CLOUDFLARE_AVAILABLE


class InfrastructureManager:
    """Gestionnaire de l'infrastructure partagée"""
    
    def __init__(self, config: Dict[str, Any], pipeline_config: Dict[str, Any], config_manager: ConfigManager):
        self.config = config
        self.pipeline_config = pipeline_config
        self.config_manager = config_manager
        self.shared_http_server = None
        self.shared_cloudflare_manager = None
        self.infrastructure_enabled = False
        
    async def initialize_shared_infrastructure(self) -> bool:
        """Initialise l'infrastructure partagée (serveur HTTP et Cloudflare Tunnel)"""
        if not INFRASTRUCTURE_AVAILABLE:
            logger.error("❌ Infrastructure non disponible - modules manquants")
            return False
        
        try:
            logger.info("🏗️ Initialisation de l'infrastructure partagée...")
            
            infrastructure_config = self.pipeline_config.get('infrastructure', {})
            
            # Initialiser le serveur HTTP partagé
            http_success = await self._initialize_http_server(infrastructure_config.get('http_server', {}))
            
            # Initialiser le tunnel Cloudflare si activé
            cloudflare_success = await self._initialize_cloudflare_tunnel(infrastructure_config.get('cloudflare_tunnel', {}))
            
            # Au moins le serveur HTTP doit fonctionner
            if http_success:
                self.infrastructure_enabled = True
                logger.info("✅ Infrastructure partagée initialisée avec succès")
                return True
            else:
                logger.error("❌ Échec de l'initialisation de l'infrastructure")
                return False
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'initialisation de l'infrastructure: {e}")
            return False
    
    async def _initialize_http_server(self, http_config: Dict[str, Any]) -> bool:
        """Initialise le serveur HTTP partagé"""
        try:
            if not http_config.get('enabled', True):
                logger.info("⚪ Serveur HTTP désactivé dans la configuration")
                return False
            
            if not HTTP_SERVER_AVAILABLE:
                logger.warning("⚠️ Module serveur HTTP non disponible")
                return False
            
            logger.info("🌐 Initialisation du serveur HTTP partagé...")
            
            host = http_config.get('host', 'localhost')
            port = http_config.get('port', 8080)
            
            self.shared_http_server = RangeFileServer(host, port)
            
            # Démarrer le serveur
            if self.shared_http_server.start():
                logger.info(f"✅ Serveur HTTP partagé démarré sur {host}:{self.shared_http_server.actual_port}")
                return True
            else:
                logger.error("❌ Échec du démarrage du serveur HTTP")
                return False
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'initialisation du serveur HTTP: {e}")
            return False
    
    async def _initialize_cloudflare_tunnel(self, cloudflare_config: Dict[str, Any]) -> bool:
        """Initialise le tunnel Cloudflare"""
        try:
            if not cloudflare_config.get('enabled', False):
                logger.info("⚪ Tunnel Cloudflare désactivé dans la configuration")
                return True  # Pas une erreur, juste désactivé
            
            if not CLOUDFLARE_AVAILABLE:
                logger.warning("⚠️ Module tunnel Cloudflare non disponible")
                return True  # Pas une erreur, juste non disponible
            
            logger.info("☁️ Initialisation du tunnel Cloudflare...")
            
            tunnel_name = cloudflare_config.get('tunnel_name', 'postflow-tunnel')
            
            self.shared_cloudflare_manager = CloudflareManager(tunnel_name)
            
            # Démarrer le tunnel
            tunnel_success = await self.shared_cloudflare_manager.start_tunnel()
            
            if tunnel_success:
                logger.info("✅ Tunnel Cloudflare démarré avec succès")
                return True
            else:
                logger.warning("⚠️ Échec du démarrage du tunnel Cloudflare")
                return False
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'initialisation du tunnel Cloudflare: {e}")
            return False
    
    def stop_infrastructure(self) -> bool:
        """Arrête l'infrastructure partagée"""
        success = True
        
        # Arrêter le tunnel Cloudflare
        if self.shared_cloudflare_manager:
            try:
                logger.info("🛑 Arrêt du tunnel Cloudflare...")
                self.shared_cloudflare_manager.stop_tunnel()
                logger.info("✅ Tunnel Cloudflare arrêté")
            except Exception as e:
                logger.error(f"❌ Erreur arrêt tunnel Cloudflare: {e}")
                success = False
        
        # Arrêter le serveur HTTP
        if self.shared_http_server:
            try:
                logger.info("🛑 Arrêt du serveur HTTP...")
                self.shared_http_server.stop()
                logger.info("✅ Serveur HTTP arrêté")
            except Exception as e:
                logger.error(f"❌ Erreur arrêt serveur HTTP: {e}")
                success = False
        
        self.infrastructure_enabled = False
        return success
    
    def get_http_server(self):
        """Retourne l'instance du serveur HTTP"""
        return self.shared_http_server
    
    def get_cloudflare_manager(self):
        """Retourne l'instance du gestionnaire Cloudflare"""
        return self.shared_cloudflare_manager
    
    def is_infrastructure_running(self) -> bool:
        """Vérifie si l'infrastructure est en cours d'exécution"""
        return self.infrastructure_enabled
    
    def get_infrastructure_status(self) -> Dict[str, Any]:
        """Retourne le statut de l'infrastructure"""
        http_running = (self.shared_http_server is not None and 
                       hasattr(self.shared_http_server, 'is_running') and 
                       self.shared_http_server.is_running)
        
        cloudflare_running = (self.shared_cloudflare_manager is not None and 
                             hasattr(self.shared_cloudflare_manager, 'is_running') and 
                             self.shared_cloudflare_manager.is_running)
        
        return {
            'available': INFRASTRUCTURE_AVAILABLE,
            'enabled': self.infrastructure_enabled,
            'http_server': {
                'running': http_running,
                'config': self.pipeline_config.get('infrastructure', {}).get('http_server', {})
            },
            'cloudflare_tunnel': {
                'running': cloudflare_running,
                'config': self.pipeline_config.get('infrastructure', {}).get('cloudflare_tunnel', {})
            }
        }
    
    def get_server_url(self) -> Optional[str]:
        """Retourne l'URL du serveur HTTP"""
        if not self.shared_http_server:
            return None
        
        http_config = self.pipeline_config.get('infrastructure', {}).get('http_server', {})
        host = http_config.get('host', 'localhost')
        port = http_config.get('port', 8080)
        
        return f"http://{host}:{port}"
    
    def get_cloudflare_url(self) -> Optional[str]:
        """Retourne l'URL du tunnel Cloudflare"""
        if not self.shared_cloudflare_manager:
            return None
        
        return self.shared_cloudflare_manager.get_tunnel_url() if hasattr(self.shared_cloudflare_manager, 'get_tunnel_url') else None


async def initialize_infrastructure(config: Dict[str, Any], pipeline_config: Dict[str, Any], 
                                  config_manager: ConfigManager) -> tuple[bool, Optional[InfrastructureManager]]:
    """
    Fonction utilitaire pour initialiser l'infrastructure
    
    Args:
        config: Configuration principale
        pipeline_config: Configuration du pipeline
        config_manager: Gestionnaire de configuration
        
    Returns:
        tuple: (success, infrastructure_manager)
    """
    manager = InfrastructureManager(config, pipeline_config, config_manager)
    success = await manager.initialize_shared_infrastructure()
    return success, manager
