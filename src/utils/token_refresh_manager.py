"""
🔄 Token Refresh Manager - Gestionnaire automatique des tokens
=============================================================

Système proactif de renouvellement automatique des tokens API
avant leur expiration pour maintenir le service en continu.

Utilise les outils existants:
- FrameioOAuth pour Frame.io tokens
- GoogleConnectionManager pour Google credentials
- Surveillance et planification automatique
- Notifications en cas d'échec

Version: 4.2.0
Date: Août 2025
"""

import asyncio
import logging
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, Optional, Callable

logger = logging.getLogger(__name__)

class TokenRefreshManager:
    """Gestionnaire automatique de renouvellement des tokens utilisant les outils existants"""
    
    def __init__(self, config_manager=None):
        self.config_manager = config_manager
        self.frameio_oauth = None
        self.google_connection_manager = None
        self.running = False
        self.refresh_task = None
        
        # Configuration des seuils d'expiration (en minutes avant expiration)
        self.refresh_thresholds = {
            'frameio': 60,  # Renouveler 1h avant expiration
            'google': 30,   # Renouveler 30min avant expiration  
        }
        
        # Intervalle de vérification (en secondes)
        self.check_interval = 300  # Vérifier toutes les 5 minutes
        
    def initialize_frameio(self):
        """Initialise le gestionnaire Frame.io OAuth"""
        try:
            from src.frameio_oauth import FrameioOAuth
            self.frameio_oauth = FrameioOAuth()
            logger.info("🎬 FrameioOAuth initialisé")
            return True
        except Exception as e:
            logger.error(f"❌ Erreur initialisation FrameioOAuth: {e}")
            return False
    
    def initialize_google(self):
        """Initialise le gestionnaire Google Connection"""
        try:
            from src.integrations.google.connection_manager import GoogleConnectionManager
            self.google_connection_manager = GoogleConnectionManager()
            
            # Initialiser avec les credentials existants
            if self.config_manager:
                config = self.config_manager.get_config()
                google_config = config.get('google', {})
                credentials_file = google_config.get('credentials_file', 'config/google_credentials.json')
                
                if Path(credentials_file).exists():
                    self.google_connection_manager.initialize(credentials_file)
                    logger.info("🔑 GoogleConnectionManager initialisé")
                    return True
            
            logger.warning("⚠️ Credentials Google non trouvés")
            return False
        except Exception as e:
            logger.error(f"❌ Erreur initialisation GoogleConnectionManager: {e}")
            return False
    
    def start_monitoring(self):
        """Démarre la surveillance automatique des tokens"""
        if self.running:
            logger.warning("⚠️ Token monitoring déjà en cours")
            return
            
        # Initialiser les gestionnaires
        frameio_ok = self.initialize_frameio()
        google_ok = self.initialize_google()
        
        if not frameio_ok and not google_ok:
            logger.error("❌ Aucun gestionnaire de token initialisé")
            return
            
        self.running = True
        self.refresh_task = asyncio.create_task(self._monitor_loop())
        logger.info("🔄 Token monitoring démarré")
    
    def stop_monitoring(self):
        """Arrête la surveillance automatique"""
        self.running = False
        if self.refresh_task:
            self.refresh_task.cancel()
        logger.info("🛑 Token monitoring arrêté")
    
    async def _monitor_loop(self):
        """Boucle principale de surveillance des tokens"""
        while self.running:
            try:
                await self._check_all_tokens()
                await asyncio.sleep(self.check_interval)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"❌ Erreur dans la boucle de monitoring: {e}")
                await asyncio.sleep(60)  # Attendre 1 min avant de réessayer
    
    async def _check_all_tokens(self):
        """Vérifie tous les tokens et les renouvelle si nécessaire"""
        
        # Vérifier Frame.io
        if self.frameio_oauth:
            try:
                if not self.frameio_oauth.ensure_valid_token():
                    logger.info("🔄 Refresh Frame.io requis")
                    refresh_result = self.frameio_oauth.refresh_token()
                    if refresh_result:
                        logger.info("✅ Token Frame.io renouvelé")
                    else:
                        logger.error("❌ Échec refresh Frame.io")
            except Exception as e:
                logger.error(f"❌ Erreur vérification Frame.io: {e}")
        
        # Vérifier Google - Google Connection Manager gère déjà le refresh automatique
        if self.google_connection_manager:
            try:
                # GoogleConnectionManager vérifie et refresh automatiquement
                # Juste s'assurer qu'il est actif
                _ = self.google_connection_manager.get_sheets_service()
                logger.debug("🔍 Google credentials vérifiés")
            except Exception as e:
                logger.error(f"❌ Erreur vérification Google: {e}")
    
    def get_status(self) -> Dict[str, Any]:
        """Récupère le statut de tous les tokens"""
        status = {
            'monitoring_active': self.running,
            'check_interval_seconds': self.check_interval,
            'frameio': self._get_frameio_status(),
            'google': self._get_google_status()
        }
        return status
    
    def _get_frameio_status(self) -> Dict[str, Any]:
        """Récupère le statut Frame.io"""
        if not self.frameio_oauth:
            return {'available': False, 'error': 'FrameioOAuth non initialisé'}
        
        try:
            current_tokens = self.frameio_oauth._load_current_tokens()
            if not current_tokens:
                return {'available': False, 'error': 'Aucun token sauvegardé'}
            
            # Vérifier si le token est valide
            is_valid = self.frameio_oauth.ensure_valid_token()
            
            return {
                'available': True,
                'has_access_token': bool(current_tokens.get('access_token')),
                'has_refresh_token': bool(current_tokens.get('refresh_token')),
                'token_valid': is_valid,
                'expires_at': current_tokens.get('expires_at'),
                'last_refresh': current_tokens.get('last_refresh')
            }
        except Exception as e:
            return {'available': False, 'error': str(e)}
    
    def _get_google_status(self) -> Dict[str, Any]:
        """Récupère le statut Google"""
        if not self.google_connection_manager:
            return {'available': False, 'error': 'GoogleConnectionManager non initialisé'}
        
        try:
            # Tester l'accès
            sheets_service = self.google_connection_manager.get_sheets_service()
            
            return {
                'available': True,
                'credentials_valid': bool(sheets_service),
                'connection_active': bool(self.google_connection_manager._connections),
                'last_refresh': getattr(self.google_connection_manager, '_last_refresh', None)
            }
        except Exception as e:
            return {'available': False, 'error': str(e)}
    
    def force_refresh_frameio(self) -> bool:
        """Force le refresh du token Frame.io"""
        if not self.frameio_oauth:
            logger.error("❌ FrameioOAuth non initialisé")
            return False
        
        try:
            logger.info("🔄 Force refresh Frame.io...")
            result = self.frameio_oauth.refresh_token()
            if result:
                logger.info("✅ Token Frame.io forcé avec succès")
                return True
            else:
                logger.error("❌ Échec force refresh Frame.io")
                return False
        except Exception as e:
            logger.error(f"❌ Exception force refresh Frame.io: {e}")
            return False
    
    def force_refresh_google(self) -> bool:
        """Force le refresh des credentials Google"""
        if not self.google_connection_manager:
            logger.error("❌ GoogleConnectionManager non initialisé")
            return False
        
        try:
            logger.info("🔄 Force refresh Google...")
            self.google_connection_manager._refresh_connections()
            logger.info("✅ Credentials Google forcés avec succès")
            return True
        except Exception as e:
            logger.error(f"❌ Exception force refresh Google: {e}")
            return False


# Fonction utilitaire pour créer le manager depuis la config
def create_token_manager_from_config(config_manager) -> TokenRefreshManager:
    """Crée et configure le gestionnaire de tokens depuis la configuration"""
    
    manager = TokenRefreshManager(config_manager)
    logger.info("🔄 Gestionnaire de tokens créé avec outils existants")
    return manager


# Instance globale
token_manager: Optional[TokenRefreshManager] = None

def get_token_manager() -> Optional[TokenRefreshManager]:
    """Récupère l'instance globale du gestionnaire de tokens"""
    return token_manager

def initialize_token_manager(config_manager) -> TokenRefreshManager:
    """Initialise l'instance globale du gestionnaire de tokens"""
    global token_manager
    
    if token_manager:
        logger.warning("⚠️ Token manager déjà initialisé")
        return token_manager
    
    token_manager = create_token_manager_from_config(config_manager)
    token_manager.start_monitoring()
    
    logger.info("🔄 Token manager global initialisé et démarré")
    return token_manager

def shutdown_token_manager():
    """Arrête l'instance globale du gestionnaire de tokens"""
    global token_manager
    
    if token_manager:
        token_manager.stop_monitoring()
        token_manager = None
        logger.info("🛑 Token manager global arrêté")


# =============================================================================
# EXEMPLES D'UTILISATION
# =============================================================================

async def demo_token_management():
    """Démonstration du gestionnaire de tokens avec outils existants"""
    
    print("🔄 DEMO: GESTIONNAIRE AUTOMATIQUE DE TOKENS")
    print("=" * 50)
    
    # Simuler un config manager
    class MockConfigManager:
        def get_config(self):
            return {
                'frameio': {'api_token': 'demo_token'},
                'google': {'credentials_file': 'config/google_credentials.json'}
            }
    
    # Créer le gestionnaire
    config_manager = MockConfigManager()
    manager = create_token_manager_from_config(config_manager)
    
    print("✅ Gestionnaire créé avec outils existants")
    
    # Afficher le statut
    status = manager.get_status()
    print(f"\n📊 Statut:")
    print(f"   Monitoring actif: {status['monitoring_active']}")
    print(f"   Frame.io disponible: {status['frameio']['available']}")
    print(f"   Google disponible: {status['google']['available']}")
    
    print("\n🔄 Le monitoring utilise:")
    print("📅 FrameioOAuth.refresh_token() pour Frame.io")
    print("📅 GoogleConnectionManager._refresh_connections() pour Google")
    print("📅 Vérification automatique toutes les 5 minutes")

if __name__ == "__main__":
    asyncio.run(demo_token_management())
