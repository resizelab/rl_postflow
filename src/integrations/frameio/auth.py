"""
Module d'authentification Frame.io API v4 avec Adobe IMS OAuth 2.0 Server-to-Server
"""

import asyncio
import os
import logging
import jwt
import time
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
import httpx
from dataclasses import dataclass
from cryptography.hazmat.primitives import serialization

logger = logging.getLogger(__name__)


@dataclass
class TokenInfo:
    """Informations du token d'accès"""
    access_token: str
    token_type: str
    expires_in: int
    created_at: datetime

    @property
    def is_expired(self) -> bool:
        """Vérifie si le token est expiré"""
        return datetime.now() >= self.created_at + timedelta(seconds=self.expires_in - 300)  # 5 min buffer


class FrameIOAuthError(Exception):
    """Exception pour les erreurs d'authentification Frame.io"""
    pass


class FrameIOAuth:
    """
    Gestionnaire d'authentification Frame.io API v4 avec Adobe IMS OAuth 2.0 Server-to-Server
    
    Utilise l'authentification JWT avec clé privée RSA selon la documentation Adobe IMS.
    """
    
    def __init__(self, 
                 client_id: Optional[str] = None,
                 client_secret: Optional[str] = None,
                 org_id: Optional[str] = None,
                 technical_account_id: Optional[str] = None,
                 private_key_path: Optional[str] = None,
                 base_url: Optional[str] = None,
                 ims_host: Optional[str] = None,
                 timeout: int = 30,
                 max_retries: int = 3):
        """
        Initialise le gestionnaire d'authentification Adobe IMS Server-to-Server
        
        Args:
            client_id: Client ID de l'application Adobe IMS
            client_secret: Client Secret de l'application Adobe IMS
            org_id: Organization ID Adobe IMS
            technical_account_id: Technical Account ID Adobe IMS
            private_key_path: Chemin vers la clé privée RSA
            base_url: URL de base de l'API Frame.io
            ims_host: URL du serveur IMS Adobe
            timeout: Timeout des requêtes en secondes
            max_retries: Nombre maximum de tentatives
        """
        self.client_id = client_id or os.getenv('FRAMEIO_CLIENT_ID')
        self.client_secret = client_secret or os.getenv('FRAMEIO_CLIENT_SECRET')
        self.org_id = org_id or os.getenv('FRAMEIO_ORG_ID')
        self.technical_account_id = technical_account_id or os.getenv('FRAMEIO_TECHNICAL_ACCOUNT_ID')
        self.private_key_path = private_key_path or os.getenv('FRAMEIO_PRIVATE_KEY_PATH')
        self.base_url = base_url or os.getenv('FRAMEIO_BASE_URL', 'https://api.frame.io/v4')
        self.ims_host = ims_host or os.getenv('FRAMEIO_IMS_HOST', 'https://ims-na1.adobelogin.com')
        self.timeout = timeout
        self.max_retries = max_retries
        
        # Validation des paramètres requis
        required_params = [
            ('FRAMEIO_CLIENT_ID', self.client_id),
            ('FRAMEIO_CLIENT_SECRET', self.client_secret),
            ('FRAMEIO_ORG_ID', self.org_id),
            ('FRAMEIO_TECHNICAL_ACCOUNT_ID', self.technical_account_id),
            ('FRAMEIO_PRIVATE_KEY_PATH', self.private_key_path)
        ]
        
        missing_params = [name for name, value in required_params if not value]
        if missing_params:
            raise FrameIOAuthError(f"Paramètres requis manquants: {', '.join(missing_params)}")
        
        # Cache du token
        self._token_info: Optional[TokenInfo] = None
        self._http_client: Optional[httpx.AsyncClient] = None
        self._private_key = None
    
    def _load_private_key(self):
        """Charge la clé privée RSA"""
        if self._private_key is None:
            try:
                with open(self.private_key_path, 'rb') as key_file:
                    self._private_key = serialization.load_pem_private_key(
                        key_file.read(),
                        password=None
                    )
            except Exception as e:
                raise FrameIOAuthError(f"Impossible de charger la clé privée: {e}")
        return self._private_key
    
    def _create_jwt_assertion(self) -> str:
        """Crée une assertion JWT pour l'authentification Adobe IMS"""
        try:
            private_key = self._load_private_key()
            
            # Payload JWT selon la spec Adobe IMS
            payload = {
                'iss': self.org_id,  # Issuer (Organization ID)
                'sub': self.technical_account_id,  # Subject (Technical Account ID)
                'aud': f"{self.ims_host}/c/{self.client_id}",  # Audience
                'exp': int(time.time()) + 86400,  # Expiration (24h)
                'iat': int(time.time()),  # Issued at
                'https://ims-na1.adobelogin.com/s/ent_frame_sdk': True  # Frame.io scope
            }
            
            # Signer le JWT avec la clé privée
            token = jwt.encode(
                payload,
                private_key,
                algorithm='RS256'
            )
            
            return token
            
        except Exception as e:
            raise FrameIOAuthError(f"Erreur lors de la création du JWT: {e}")
    
    async def _request_token(self) -> TokenInfo:
        """
        Demande un nouveau token d'accès via Adobe IMS Server-to-Server JWT
        
        Returns:
            TokenInfo: Informations du token d'accès
            
        Raises:
            FrameIOAuthError: En cas d'erreur d'authentification
        """
        client = await self._get_http_client()
        
        # Créer l'assertion JWT
        jwt_assertion = self._create_jwt_assertion()
        
        # Données pour la requête Adobe IMS Server-to-Server
        data = {
            'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'assertion': jwt_assertion
        }
        
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
        
        url = f"{self.ims_host}/ims/token/v3"
        
        try:
            response = await client.post(url, data=data, headers=headers)
            response.raise_for_status()
            
            token_data = response.json()
            
            # Vérification des champs requis
            required_fields = ['access_token', 'token_type', 'expires_in']
            if not all(field in token_data for field in required_fields):
                raise FrameIOAuthError(f"Réponse de token invalide: {token_data}")
            
            return TokenInfo(
                access_token=token_data['access_token'],
                token_type=token_data['token_type'],
                expires_in=token_data['expires_in'],
                created_at=datetime.now()
            )
            
        except httpx.HTTPStatusError as e:
            error_text = ""
            try:
                error_data = e.response.json()
                error_text = f": {error_data.get('error_description', error_data)}"
            except:
                error_text = f": {e.response.text}"
                
            if e.response.status_code == 400:
                raise FrameIOAuthError(f"Paramètres d'authentification invalides{error_text}")
            elif e.response.status_code == 401:
                raise FrameIOAuthError(f"Authentification échouée: vérifiez vos identifiants{error_text}")
            elif e.response.status_code == 429:
                retry_after = e.response.headers.get('retry-after', '60')
                raise FrameIOAuthError(f"Limite de taux dépassée, réessayez dans {retry_after}s")
            else:
                raise FrameIOAuthError(f"Erreur HTTP {e.response.status_code}{error_text}")
        except Exception as e:
            raise FrameIOAuthError(f"Erreur lors de la demande de token: {str(e)}")
    
    async def get_access_token(self, force_refresh: bool = False) -> str:
        """
        Obtient un token d'accès valide
        
        Args:
            force_refresh: Force le renouvellement du token
            
        Returns:
            str: Token d'accès
            
        Raises:
            FrameIOAuthError: En cas d'erreur d'authentification
        """
        if self._token_info is None or self._token_info.is_expired or force_refresh:
            logger.info("Demande d'un nouveau token d'accès")
            self._token_info = await self._request_token()
            logger.info("Token d'accès obtenu avec succès")
        
        return self._token_info.access_token
    
    async def get_auth_headers(self) -> Dict[str, str]:
        """
        Obtient les headers d'authentification pour les requêtes API
        
        Returns:
            Dict[str, str]: Headers d'authentification
        """
        token = await self.get_access_token()
        return {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    
    async def is_token_valid(self) -> bool:
        """
        Vérifie si le token actuel est valide
        
        Returns:
            bool: True si le token est valide
        """
        if self._token_info is None or self._token_info.is_expired:
            return False
        
        try:
            # Test avec un endpoint simple
            headers = await self.get_auth_headers()
            client = await self._get_http_client()
            
            response = await client.get(
                f"{self.base_url}/accounts",
                headers=headers
            )
            
            return response.status_code == 200
            
        except Exception as e:
            logger.warning(f"Erreur lors de la validation du token: {e}")
            return False
    
    async def validate_credentials(self) -> Dict[str, Any]:
        """
        Valide les identifiants et retourne les informations du compte
        
        Returns:
            Dict[str, Any]: Informations du compte
            
        Raises:
            FrameIOAuthError: En cas d'erreur de validation
        """
        try:
            headers = await self.get_auth_headers()
            client = await self._get_http_client()
            
            response = await client.get(
                f"{self.base_url}/accounts",
                headers=headers
            )
            response.raise_for_status()
            
            data = response.json()
            logger.info("Identifiants validés avec succès")
            
            return data
            
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 401:
                raise FrameIOAuthError("Identifiants invalides")
            elif e.response.status_code == 403:
                raise FrameIOAuthError("Accès refusé - vérifiez les permissions")
            else:
                raise FrameIOAuthError(f"Erreur HTTP {e.response.status_code}: {e.response.text}")
        except Exception as e:
            raise FrameIOAuthError(f"Erreur lors de la validation: {str(e)}")
    
    async def make_authenticated_request(self, 
                                       method: str, 
                                       url: str, 
                                       **kwargs) -> httpx.Response:
        """
        Effectue une requête authentifiée avec gestion des erreurs et retry
        
        Args:
            method: Méthode HTTP
            url: URL de la requête
            **kwargs: Arguments supplémentaires pour la requête
            
        Returns:
            httpx.Response: Réponse de la requête
            
        Raises:
            FrameIOAuthError: En cas d'erreur d'authentification
        """
        headers = await self.get_auth_headers()
        if 'headers' in kwargs:
            headers.update(kwargs.pop('headers'))
        
        client = await self._get_http_client()
        
        for attempt in range(self.max_retries + 1):
            try:
                response = await client.request(
                    method=method,
                    url=url,
                    headers=headers,
                    **kwargs
                )
                
                if response.status_code == 401:
                    # Token expiré, on essaie de le renouveler
                    if attempt < self.max_retries:
                        logger.warning("Token expiré, renouvellement...")
                        await self.get_access_token(force_refresh=True)
                        headers = await self.get_auth_headers()
                        continue
                    else:
                        raise FrameIOAuthError("Token invalide après renouvellement")
                
                elif response.status_code == 429:
                    # Rate limit
                    if attempt < self.max_retries:
                        wait_time = 2 ** attempt
                        logger.warning(f"Rate limit atteint, attente {wait_time}s...")
                        await asyncio.sleep(wait_time)
                        continue
                    else:
                        raise FrameIOAuthError("Limite de taux dépassée")
                
                return response
                
            except httpx.RequestError as e:
                if attempt < self.max_retries:
                    wait_time = 2 ** attempt
                    logger.warning(f"Erreur réseau, retry dans {wait_time}s: {e}")
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    raise FrameIOAuthError(f"Erreur réseau après {self.max_retries} tentatives: {e}")
        
        raise FrameIOAuthError("Nombre maximum de tentatives atteint")
    
    async def refresh_token(self) -> str:
        """
        Rafraîchit le token d'accès
        
        Returns:
            str: Nouveau token d'accès
            
        Raises:
            FrameIOAuthError: En cas d'erreur de rafraîchissement
        """
        logger.info("Rafraîchissement du token d'accès")
        return await self.get_access_token(force_refresh=True)
    
    def get_jwt_assertion(self) -> str:
        """
        Retourne l'assertion JWT pour l'authentification Adobe IMS
        
        Returns:
            str: Assertion JWT signée
            
        Raises:
            FrameIOAuthError: En cas d'erreur de génération JWT
        """
        return self._create_jwt_assertion()
    
    async def _get_http_client(self) -> httpx.AsyncClient:
        """
        Obtient un client HTTP configuré
        
        Returns:
            httpx.AsyncClient: Client HTTP
        """
        if self._http_client is None:
            self._http_client = httpx.AsyncClient(
                timeout=httpx.Timeout(self.timeout),
                limits=httpx.Limits(max_keepalive_connections=5, max_connections=10)
            )
        return self._http_client
    
    async def close(self):
        """Ferme le client HTTP"""
        if self._http_client:
            await self._http_client.aclose()
            self._http_client = None


# Fonction utilitaire pour créer une instance d'authentification
def create_frameio_auth(**kwargs) -> FrameIOAuth:
    """
    Créé une instance d'authentification Frame.io
    
    Args:
        **kwargs: Arguments pour FrameIOAuth
        
    Returns:
        FrameIOAuth: Instance d'authentification
    """
    return FrameIOAuth(**kwargs)
