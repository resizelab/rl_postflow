"""
Module d'authentification Frame.io API v4 avec Adobe IMS OAuth 2.0 Web App (Authorization Code)
"""

import os
import logging
import httpx
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class TokenInfo:
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int
    created_at: datetime

    @property
    def is_expired(self) -> bool:
        return datetime.now() >= self.created_at + timedelta(seconds=self.expires_in - 300)

class FrameIOAuthError(Exception):
    pass

class FrameIOAuth:
    """
    Authentification Frame.io API v4 via OAuth Web App (Authorization Code Flow)
    """
    def __init__(self,
                 client_id: Optional[str] = None,
                 client_secret: Optional[str] = None,
                 redirect_uri: Optional[str] = None,
                 base_url: Optional[str] = None,
                 ims_host: Optional[str] = None,
                 timeout: int = 30,
                 max_retries: int = 3):
        self.client_id = client_id or os.getenv('FRAMEIO_CLIENT_ID')
        self.client_secret = client_secret or os.getenv('FRAMEIO_CLIENT_SECRET')
        self.redirect_uri = redirect_uri or os.getenv('FRAMEIO_REDIRECT_URI', 'https://localhost:8080/callback')
        self.base_url = base_url or os.getenv('FRAMEIO_BASE_URL', 'https://api.frame.io/v4')
        self.ims_host = ims_host or os.getenv('FRAMEIO_IMS_HOST', 'https://ims-na1.adobelogin.com')
        self.timeout = timeout
        self.max_retries = max_retries
        self._token_info: Optional[TokenInfo] = None
        self._http_client: Optional[httpx.AsyncClient] = None

        required_params = [
            ('FRAMEIO_CLIENT_ID', self.client_id),
            ('FRAMEIO_CLIENT_SECRET', self.client_secret),
            ('FRAMEIO_REDIRECT_URI', self.redirect_uri)
        ]
        missing_params = [name for name, value in required_params if not value]
        if missing_params:
            raise FrameIOAuthError(f"Paramètres requis manquants: {', '.join(missing_params)}")

    def get_authorization_url(self, scope: str = None, state: str = 'state123') -> str:
        """
        Génère l'URL d'autorisation à ouvrir dans le navigateur.
        """
        # Scopes par défaut selon la console Adobe
        default_scopes = [
            'email',
            'profile',
            'openid',
            'additional_info.roles',
            'offline_access'
        ]
        scope = scope or ' '.join(default_scopes)
        params = {
            'client_id': self.client_id,
            'response_type': 'code',
            'redirect_uri': self.redirect_uri,
            'scope': scope,
            'state': state
        }
        from urllib.parse import urlencode
        url = f"{self.ims_host}/ims/authorize/v2?{urlencode(params)}"
        return url

    async def exchange_code_for_token(self, code: str) -> TokenInfo:
        """
        Échange le code d'autorisation contre un access_token et refresh_token.
        """
        data = {
            'grant_type': 'authorization_code',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'code': code,
            'redirect_uri': self.redirect_uri
        }
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        url = f"{self.ims_host}/ims/token/v3"
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, data=data, headers=headers)
            try:
                resp.raise_for_status()
            except Exception:
                raise FrameIOAuthError(f"Erreur lors de l'échange du code: {resp.text}")
            token_data = resp.json()
            self._token_info = TokenInfo(
                access_token=token_data['access_token'],
                refresh_token=token_data.get('refresh_token', ''),
                token_type=token_data['token_type'],
                expires_in=token_data['expires_in'],
                created_at=datetime.now()
            )
            return self._token_info

    async def refresh_token(self) -> TokenInfo:
        """
        Rafraîchit le token d'accès à partir du refresh_token.
        """
        if not self._token_info or not self._token_info.refresh_token:
            raise FrameIOAuthError("Aucun refresh_token disponible")
        data = {
            'grant_type': 'refresh_token',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'refresh_token': self._token_info.refresh_token
        }
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        url = f"{self.ims_host}/ims/token/v3"
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, data=data, headers=headers)
            try:
                resp.raise_for_status()
            except Exception:
                raise FrameIOAuthError(f"Erreur lors du refresh: {resp.text}")
            token_data = resp.json()
            self._token_info = TokenInfo(
                access_token=token_data['access_token'],
                refresh_token=token_data.get('refresh_token', ''),
                token_type=token_data['token_type'],
                expires_in=token_data['expires_in'],
                created_at=datetime.now()
            )
            return self._token_info

    async def get_access_token(self, force_refresh: bool = False) -> str:
        """
        Retourne un access_token valide (rafraîchit si besoin).
        """
        if self._token_info is None:
            raise FrameIOAuthError("Aucun token disponible. Utilisez exchange_code_for_token d'abord.")
        if self._token_info.is_expired or force_refresh:
            await self.refresh_token()
        return self._token_info.access_token

    async def get_auth_headers(self) -> Dict[str, str]:
        token = await self.get_access_token()
        return {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

    async def make_authenticated_request(self, method: str, url: str, **kwargs) -> httpx.Response:
        headers = await self.get_auth_headers()
        if 'headers' in kwargs:
            headers.update(kwargs.pop('headers'))
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.request(method=method, url=url, headers=headers, **kwargs)
            return response

    async def close(self):
        pass

# Fonction utilitaire pour créer une instance d'authentification

def create_frameio_auth(**kwargs) -> FrameIOAuth:
    return FrameIOAuth(**kwargs)
