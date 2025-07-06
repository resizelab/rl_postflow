"""
Frame.io API v4 OAuth Web App Authentication Module
Gestion de l'authentification OAuth pour les applications Web Frame.io v4
"""

import os
import json
import asyncio
import httpx
from typing import Optional, Dict, Any
from pathlib import Path
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class FrameIOOAuthError(Exception):
    """Exception pour les erreurs d'authentification OAuth Frame.io"""
    pass

class FrameIOOAuthAuth:
    """Gestionnaire d'authentification OAuth Frame.io v4"""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialise l'authentification OAuth
        
        Args:
            config: Configuration contenant les paramètres OAuth
        """
        frameio_config = config.get('frameio', {})
        
        self.client_id = frameio_config.get('client_id') or os.getenv('FRAMEIO_CLIENT_ID')
        self.client_secret = frameio_config.get('client_secret') or os.getenv('FRAMEIO_CLIENT_SECRET')
        # Support pour api_token (legacy) et access_token
        self.access_token = (frameio_config.get('access_token') or 
                           frameio_config.get('api_token') or 
                           os.getenv('FRAMEIO_ACCESS_TOKEN') or
                           os.getenv('FRAMEIO_API_TOKEN'))
        self.refresh_token = frameio_config.get('refresh_token') or os.getenv('FRAMEIO_REFRESH_TOKEN')
        self.base_url = frameio_config.get('base_url', 'https://api.frame.io/v4')
        
        # Validation des paramètres requis
        if not self.access_token:
            raise FrameIOOAuthError("access_token manquant. Lancez d'abord l'authentification OAuth.")
        
        self.config = config
        self.config_path = Path(__file__).parent.parent.parent / "config" / "integrations.json"
        
        # Client HTTP réutilisable
        self._http_client: Optional[httpx.AsyncClient] = None
        self._auth_instance = None
    
    async def get_http_client(self) -> httpx.AsyncClient:
        """Retourne un client HTTP réutilisable"""
        if self._http_client is None:
            self._http_client = httpx.AsyncClient(timeout=30.0)
        return self._http_client
    
    async def close(self):
        """Ferme le client HTTP"""
        if self._http_client:
            await self._http_client.aclose()
            self._http_client = None
    
    async def get_headers(self) -> Dict[str, str]:
        """
        Retourne les headers d'authentification
        
        Returns:
            Dictionnaire des headers avec le token d'accès
        """
        # Vérifier si le token doit être rafraîchi (optionnel)
        # Pour l'instant, on utilise le token actuel
        
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
    
    async def refresh_access_token(self) -> bool:
        """
        Alias pour refresh_token_from_file pour compatibilité
        """
        return await self.refresh_token_from_file()
    
    async def _save_tokens_to_config(self):
        """Sauvegarde les tokens dans le fichier de configuration"""
        try:
            # Charger la config actuelle
            with open(self.config_path, 'r') as f:
                config = json.load(f)
            
            # Mettre à jour les tokens
            if 'frameio' not in config:
                config['frameio'] = {}
            
            config['frameio']['access_token'] = self.access_token
            if self.refresh_token:
                config['frameio']['refresh_token'] = self.refresh_token
            
            # Sauvegarder
            with open(self.config_path, 'w') as f:
                json.dump(config, f, indent=2)
            
            logger.info("Tokens sauvegardés dans la configuration")
            
        except Exception as e:
            logger.error(f"Erreur sauvegarde tokens: {e}")
    
    async def test_connection(self) -> bool:
        """
        Teste la connexion à l'API Frame.io avec refresh automatique
        
        Returns:
            True si la connexion fonctionne, False sinon
        """
        try:
            headers = await self.get_headers()
            client = await self.get_http_client()
            
            response = await client.get(
                f"{self.base_url}/me",
                headers=headers
            )
            
            if response.status_code == 200:
                user_data = response.json()
                user_name = user_data.get('data', {}).get('attributes', {}).get('name', 'N/A')
                logger.info(f"Connexion OK - Utilisateur: {user_name}")
                return True
            elif response.status_code == 401:
                logger.warning("Token expiré, tentative de rafraîchissement automatique...")
                refresh_success = await self.refresh_token_from_file()
                if refresh_success:
                    # Retry avec le nouveau token
                    return await self.test_connection()
                else:
                    logger.error("Impossible de rafraîchir le token. Relancez frameio_oauth_webapp_demo.py")
                    return False
            else:
                logger.error(f"Erreur connexion: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Exception test connexion: {e}")
            return False
    
    async def _request_with_retry(self, method: str, url: str, **kwargs) -> httpx.Response:
        """
        Fait une requête avec retry automatique et refresh token si nécessaire
        
        Args:
            method: Méthode HTTP (GET, POST, etc.)
            url: URL de la requête
            **kwargs: Arguments additionnels pour la requête
        
        Returns:
            Réponse HTTP
        """
        max_retries = 2
        
        for attempt in range(max_retries):
            try:
                headers = await self.get_headers()
                if 'headers' in kwargs:
                    kwargs['headers'].update(headers)
                else:
                    kwargs['headers'] = headers
                
                client = await self.get_http_client()
                response = await client.request(method, url, **kwargs)
                
                # Si le token est expiré, essayer de le rafraîchir
                if response.status_code == 401 and attempt == 0:
                    logger.warning("Token expiré, tentative de rafraîchissement automatique...")
                    refresh_success = await self.refresh_token_from_file()
                    if refresh_success:
                        continue  # Retry avec le nouveau token
                    else:
                        raise FrameIOOAuthError("Impossible de rafraîchir le token d'accès. Relancez frameio_oauth_webapp_demo.py")
                
                return response
                
            except Exception as e:
                if attempt == max_retries - 1:
                    raise
                logger.warning(f"Tentative {attempt + 1} échouée: {e}")
                await asyncio.sleep(1)
        
        raise FrameIOOAuthError("Toutes les tentatives ont échoué")
    
    async def get_auth_instance(self):
        """Retourne une instance d'auth principal pour les opérations avancées"""
        if self._auth_instance is None:
            from .auth import create_frameio_auth
            self._auth_instance = create_frameio_auth()
        return self._auth_instance
    
    async def refresh_token_from_file(self) -> bool:
        """
        Tente de rafraîchir le token en utilisant le refresh_token du fichier
        Inspiré de frameio_oauth_webapp_demo.py
        
        Returns:
            True si le rafraîchissement a réussi, False sinon
        """
        refresh_token_path = Path(__file__).parent.parent.parent / ".frameio_refresh_token"
        
        if not refresh_token_path.exists():
            logger.info("Pas de fichier refresh_token trouvé")
            return False
        
        try:
            refresh_token = refresh_token_path.read_text().strip()
            logger.info("🔄 Refresh token trouvé, tentative de refresh...")
            
            # Utiliser l'instance d'auth principale
            auth = await self.get_auth_instance()
            
            # Créer un TokenInfo factice pour le refresh
            auth._token_info = type('TokenInfo', (), {
                'refresh_token': refresh_token, 
                'is_expired': True
            })()
            
            # Tenter le refresh
            await auth.refresh_token()
            
            if hasattr(auth._token_info, 'access_token'):
                self.access_token = auth._token_info.access_token
                logger.info(f"✅ Token rafraîchi: {self.access_token[:20]}...")
                
                # Mettre à jour la config
                await self._update_config_with_token(self.access_token)
                return True
            else:
                logger.error("❌ Pas d'access_token après refresh")
                return False
                
        except Exception as e:
            logger.error(f"❌ Échec du refresh: {e}")
            return False
    
    async def _update_config_with_token(self, new_token: str):
        """Met à jour le token dans le fichier de configuration"""
        try:
            with open(self.config_path, "r", encoding="utf-8") as f:
                config = json.load(f)
            
            if "frameio" in config:
                config["frameio"]["api_token"] = new_token
                with open(self.config_path, "w", encoding="utf-8") as f:
                    json.dump(config, f, indent=4)
                logger.info(f"🔄 api_token mis à jour dans {self.config_path}")
            else:
                logger.warning(f"[WARN] Section frameio absente dans {self.config_path}")
                
        except Exception as e:
            logger.error(f"Erreur sauvegarde token: {e}")
