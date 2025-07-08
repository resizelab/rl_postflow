"""
Frame.io Authentication Module - Version OAuth Autonome
Module d'authentification utilisant le système OAuth Web App autonome
"""

import os
import json
import base64
import asyncio
import urllib.parse
from typing import Dict, Optional, Any
from datetime import datetime, timedelta
from pathlib import Path
import logging
import httpx

logger = logging.getLogger(__name__)


class FrameIOAuthError(Exception):
    """Exception pour les erreurs d'authentification Frame.io"""
    pass


class TokenInfo:
    """Informations sur le token d'accès"""
    
    def __init__(self, access_token: str, expires_in: int = 3600, token_type: str = "Bearer"):
        self.access_token = access_token
        self.expires_in = expires_in
        self.token_type = token_type
        self.created_at = datetime.now()
    
    @property
    def is_expired(self) -> bool:
        """Vérifie si le token a expiré"""
        return datetime.now() > self.created_at + timedelta(seconds=self.expires_in - 300)  # 5 min buffer
    
    @property
    def authorization_header(self) -> str:
        """Retourne l'en-tête d'autorisation"""
        return f"{self.token_type} {self.access_token}"


class FrameIOAuth:
    """
    Gestionnaire d'authentification Frame.io avec OAuth autonome
    Basé sur le système OAuth Web App
    """
    
    def __init__(self, project_root: Optional[Path] = None):
        """
        Initialise le gestionnaire d'authentification autonome.
        
        Args:
            project_root: Chemin racine du projet (détecté automatiquement si None)
        """
        self.project_root = project_root or Path(__file__).parent.parent.parent.parent
        self.oauth_config = self._load_oauth_config()
        
        # Endpoints Adobe IMS
        self.auth_endpoint = "https://ims-na1.adobelogin.com/ims/authorize/v2"
        self.token_endpoint = "https://ims-na1.adobelogin.com/ims/token/v3"
        self.userinfo_endpoint = "https://ims-na1.adobelogin.com/ims/userinfo/v2"
        
        # Endpoints Frame.io
        self.base_url = "https://api.frame.io/v4"
        
        # Scopes requis pour Frame.io
        self.required_scopes = [
            'email',
            'openid', 
            'offline_access',
            'profile',
            'additional_info.roles'
        ]
        
        # Configuration
        self.timeout = 15  # Optimisé: 30s → 15s (authentification rapide)
        self.max_retries = 3
        self._token_info: Optional[TokenInfo] = None
        
        logger.info("✅ FrameIOAuth autonome initialisé")
    
    def _load_oauth_config(self) -> Dict[str, str]:
        """
        Charge la configuration OAuth depuis le fichier Adobe
        
        Returns:
            Dict contenant client_id, client_secret et redirect_uri
        """
        oauth_file = self.project_root / "data" / "890CarmineWhitefish-1845895-OAuth Web App.json"
        
        if not oauth_file.exists():
            raise FrameIOAuthError(f"Fichier de configuration OAuth non trouvé: {oauth_file}")
        
        try:
            with open(oauth_file, 'r') as f:
                oauth_data = json.load(f)
            
            return {
                'client_id': oauth_data['API_KEY'],
                'client_secret': oauth_data['CLIENT_SECRET'],
                'redirect_uri': oauth_data['DEF_REDIRECT_URI']
            }
        except (json.JSONDecodeError, KeyError) as e:
            raise FrameIOAuthError(f"Configuration OAuth invalide: {e}")
    
    def _load_current_tokens(self) -> Dict[str, Any]:
        """
        Charge les tokens actuels depuis integrations.json
        
        Returns:
            Dict avec la configuration Frame.io actuelle
        """
        integrations_file = self.project_root / "config" / "integrations.json"
        
        if not integrations_file.exists():
            return {}
        
        try:
            with open(integrations_file, 'r') as f:
                integrations = json.load(f)
            
            return integrations.get('frameio', {})
            
        except (json.JSONDecodeError, KeyError):
            return {}
    
    def _save_tokens(self, token_data: Dict[str, Any]) -> None:
        """
        Sauvegarde les tokens dans integrations.json
        
        Args:
            token_data: Données du token reçues d'Adobe IMS
        """
        integrations_file = self.project_root / "config" / "integrations.json"
        integrations_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Charger la config existante ou créer une nouvelle
        try:
            with open(integrations_file, 'r') as f:
                integrations = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            integrations = {}
        
        # Mettre à jour la section Frame.io
        if 'frameio' not in integrations:
            integrations['frameio'] = {}
        
        integrations['frameio'].update({
            'client_id': self.oauth_config['client_id'],
            'client_secret': self.oauth_config['client_secret'],
            'redirect_uri': self.oauth_config['redirect_uri'],
            'access_token': token_data['access_token'],
            'refresh_token': token_data.get('refresh_token'),
            'token_type': token_data.get('token_type', 'Bearer'),
            'expires_in': token_data.get('expires_in'),
            'scope': token_data.get('scope'),
            'id_token': token_data.get('id_token'),
            'last_updated': datetime.now().isoformat(),
            'method': 'oauth_web_app'
        })
        
        # Sauvegarder
        with open(integrations_file, 'w') as f:
            json.dump(integrations, f, indent=2)
        
        logger.debug(f"Tokens sauvegardés dans {integrations_file}")
    
    def is_token_valid(self) -> bool:
        """
        Vérifie si le token actuel est valide (non expiré)
        
        Returns:
            True si le token est valide, False sinon
        """
        config = self._load_current_tokens()
        
        if not config.get('access_token') or not config.get('last_updated'):
            return False
        
        try:
            last_updated = datetime.fromisoformat(config['last_updated'])
            expires_in = config.get('expires_in', 86400)  # Défaut 24h
            expiry_time = last_updated + timedelta(seconds=expires_in)
            
            return datetime.now() < expiry_time
            
        except (ValueError, TypeError):
            return False
    
    def generate_auth_url(self, state: Optional[str] = None) -> str:
        """
        Génère l'URL d'autorisation Adobe IMS pour Frame.io
        
        Args:
            state: État optionnel pour la sécurité CSRF
            
        Returns:
            URL d'autorisation complète
        """
        params = {
            'client_id': self.oauth_config['client_id'],
            'redirect_uri': self.oauth_config['redirect_uri'],
            'response_type': 'code',
            'scope': ' '.join(self.required_scopes)
        }
        
        if state:
            params['state'] = state
        
        query_string = urllib.parse.urlencode(params)
        auth_url = f"{self.auth_endpoint}?{query_string}"
        
        logger.info(f"URL d'autorisation générée pour client_id: {self.oauth_config['client_id']}")
        return auth_url
    
    async def exchange_code(self, authorization_code: str) -> Dict[str, Any]:
        """
        Échange un code d'autorisation contre un access token
        
        Args:
            authorization_code: Code d'autorisation reçu d'Adobe IMS
            
        Returns:
            Dict contenant access_token, refresh_token, expires_in, etc.
        """
        # Préparation de l'authentification Basic Auth (OAuth Web App)
        credentials = f"{self.oauth_config['client_id']}:{self.oauth_config['client_secret']}"
        credentials_b64 = base64.b64encode(credentials.encode()).decode()
        
        headers = {
            'Authorization': f'Basic {credentials_b64}',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
        
        data = {
            'grant_type': 'authorization_code',
            'code': authorization_code,
            'redirect_uri': self.oauth_config['redirect_uri']
        }
        
        logger.info("Échange du code d'autorisation en cours...")
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(self.token_endpoint, headers=headers, data=data)
                response.raise_for_status()
                
                token_data = response.json()
                
                # Sauvegarder automatiquement
                self._save_tokens(token_data)
                
                logger.info("Token obtenu et sauvegardé avec succès")
                return token_data
                
            except httpx.RequestError as e:
                error_msg = f"Erreur lors de l'échange du code: {e}"
                logger.error(error_msg)
                raise FrameIOAuthError(error_msg)
    
    async def refresh_token(self) -> Dict[str, Any]:
        """
        Rafraîchit le token d'accès actuel
        
        Returns:
            Dict contenant le nouveau access_token, refresh_token, etc.
        """
        current_config = self._load_current_tokens()
        
        if not current_config.get('refresh_token'):
            raise FrameIOAuthError("Aucun refresh token disponible")
        
        credentials = f"{self.oauth_config['client_id']}:{self.oauth_config['client_secret']}"
        credentials_b64 = base64.b64encode(credentials.encode()).decode()
        
        headers = {
            'Authorization': f'Basic {credentials_b64}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        data = {
            'grant_type': 'refresh_token',
            'refresh_token': current_config['refresh_token']
        }
        
        logger.info("Rafraîchissement du token en cours...")
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(self.token_endpoint, headers=headers, data=data)
                response.raise_for_status()
                
                token_data = response.json()
                
                # Sauvegarder le nouveau token
                self._save_tokens(token_data)
                
                logger.info("Token rafraîchi avec succès")
                return token_data
                
            except httpx.RequestError as e:
                error_msg = f"Erreur lors du rafraîchissement: {e}"
                logger.error(error_msg)
                raise FrameIOAuthError(error_msg)
    
    async def ensure_valid_token(self) -> bool:
        """
        S'assure qu'un token valide est disponible, le rafraîchit si nécessaire
        
        Returns:
            True si un token valide est disponible, False sinon
        """
        if self.is_token_valid():
            return True
        
        config = self._load_current_tokens()
        if config.get('refresh_token'):
            try:
                await self.refresh_token()
                return True
            except FrameIOAuthError:
                logger.warning("Échec du rafraîchissement automatique")
                return False
        
        return False
    
    async def get_access_token(self) -> str:
        """
        Récupère un token d'accès valide
        
        Returns:
            Token d'accès valide
            
        Raises:
            FrameIOAuthError: Si aucun token valide n'est disponible
        """
        if not await self.ensure_valid_token():
            raise FrameIOAuthError("Aucun token d'accès valide disponible")
        
        config = self._load_current_tokens()
        return config['access_token']
    
    async def get_headers(self) -> Dict[str, str]:
        """
        Récupère les en-têtes d'authentification
        
        Returns:
            Dict avec les en-têtes pour les requêtes API
        """
        token = await self.get_access_token()
        return {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    
    async def test_connection(self) -> bool:
        """
        Teste la connexion à l'API Frame.io
        
        Returns:
            True si la connexion fonctionne, False sinon
        """
        try:
            headers = await self.get_headers()
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.base_url}/me", headers=headers)
                
                if response.status_code == 200:
                    logger.info("✅ Connexion Frame.io réussie")
                    return True
                else:
                    logger.warning(f"❌ Connexion Frame.io échouée: {response.status_code}")
                    return False
                    
        except Exception as e:
            logger.error(f"❌ Erreur lors du test de connexion: {e}")
            return False
    
    async def _request_with_retry(self, method: str, url: str, **kwargs) -> httpx.Response:
        """
        Effectue une requête avec retry automatique et gestion des tokens
        
        Args:
            method: Méthode HTTP (GET, POST, etc.)
            url: URL complète
            **kwargs: Arguments pour httpx
            
        Returns:
            Réponse HTTP
        """
        headers = kwargs.get('headers', {})
        
        # Ajouter l'authentification si pas déjà présente
        if 'Authorization' not in headers:
            auth_headers = await self.get_headers()
            headers.update(auth_headers)
            kwargs['headers'] = headers
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            for attempt in range(self.max_retries):
                try:
                    response = await client.request(method, url, **kwargs)
                    
                    # Si token expiré, essayer de le rafraîchir
                    if response.status_code == 401 and attempt < self.max_retries - 1:
                        logger.info("Token expiré, tentative de rafraîchissement...")
                        if await self.ensure_valid_token():
                            # Mettre à jour les en-têtes avec le nouveau token
                            new_headers = await self.get_headers()
                            kwargs['headers'].update(new_headers)
                            continue
                    
                    return response
                    
                except httpx.RequestError as e:
                    if attempt == self.max_retries - 1:
                        raise
                    logger.warning(f"Tentative {attempt + 1} échouée: {e}")
                    await asyncio.sleep(2 ** attempt)  # Backoff exponentiel
        
        raise FrameIOAuthError(f"Échec après {self.max_retries} tentatives")
    
    async def request(self, method: str, url: str, **kwargs) -> httpx.Response:
        """
        Effectue une requête HTTP authentifiée avec gestion automatique des tokens
        
        Args:
            method: Méthode HTTP (GET, POST, PUT, DELETE, etc.)
            url: URL complète ou chemin relatif (sera ajouté à base_url)
            **kwargs: Arguments pour httpx (json, data, params, etc.)
            
        Returns:
            Réponse HTTP
            
        Raises:
            FrameIOAuthError: Si la requête échoue après tous les essais
        """
        # Si l'URL est relative, l'ajouter à base_url
        if not url.startswith('http'):
            url = f"{self.base_url}/{url.lstrip('/')}"
        
        return await self._request_with_retry(method, url, **kwargs)
    
    async def get(self, url: str, **kwargs) -> httpx.Response:
        """Effectue une requête GET authentifiée"""
        return await self.request('GET', url, **kwargs)
    
    async def post(self, url: str, **kwargs) -> httpx.Response:
        """Effectue une requête POST authentifiée"""
        return await self.request('POST', url, **kwargs)
    
    async def put(self, url: str, **kwargs) -> httpx.Response:
        """Effectue une requête PUT authentifiée"""
        return await self.request('PUT', url, **kwargs)
    
    async def delete(self, url: str, **kwargs) -> httpx.Response:
        """Effectue une requête DELETE authentifiée"""
        return await self.request('DELETE', url, **kwargs)


# Fonction utilitaire pour compatibilité
def create_frameio_auth(project_root: Optional[Path] = None) -> FrameIOAuth:
    """
    Fonction utilitaire pour créer une instance d'authentification Frame.io
    
    Args:
        project_root: Chemin racine du projet
        
    Returns:
        Instance de FrameIOAuth configurée
    """
    return FrameIOAuth(project_root=project_root)