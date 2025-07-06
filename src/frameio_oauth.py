#!/usr/bin/env python3
"""
🎬 Frame.io OAuth Authentication Library
========================================

Module principal pour l'authentification OAuth Web App avec Frame.io via Adobe IMS.
Ce module fournit toutes les fonctions nécessaires pour :
- Générer des URLs d'autorisation Adobe IMS
- Échanger des codes d'autorisation contre des tokens
- Rafraîchir automatiquement les tokens
- Tester l'accès à l'API Frame.io V4
- Sauvegarder et charger la configuration

Utilisation:
    from src.frameio_oauth import FrameioOAuth
    
    oauth = FrameioOAuth()
    
    # Générer URL d'autorisation
    auth_url = oauth.generate_auth_url()
    
    # Échanger code contre token
    token_data = oauth.exchange_code(authorization_code)
    
    # Tester l'API
    api_response = oauth.test_api()

Configuration requise:
    - data/890CarmineWhitefish-1845895-OAuth Web App.json (credentials Adobe)
    - config/integrations.json (tokens sauvegardés)

Auteur: RL PostFlow Pipeline
Date: 2025-01-06
Version: 1.0.0 (OAuth Web App Final)
"""

import json
import requests
import base64
import urllib.parse
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, Optional, Tuple, Any
import logging


class FrameioOAuthError(Exception):
    """Exception spécifique pour les erreurs OAuth Frame.io"""
    pass


class FrameioOAuth:
    """
    Classe principale pour l'authentification OAuth Frame.io via Adobe IMS
    """
    
    def __init__(self, project_root: Optional[Path] = None):
        """
        Initialise le client OAuth Frame.io
        
        Args:
            project_root: Chemin racine du projet (détecté automatiquement si None)
        """
        self.project_root = project_root or Path(__file__).parent.parent
        self.oauth_config = self._load_oauth_config()
        self.logger = self._setup_logger()
        
        # Endpoints Adobe IMS
        self.auth_endpoint = "https://ims-na1.adobelogin.com/ims/authorize/v2"
        self.token_endpoint = "https://ims-na1.adobelogin.com/ims/token/v3"
        self.userinfo_endpoint = "https://ims-na1.adobelogin.com/ims/userinfo/v2"
        
        # Endpoints Frame.io
        self.frameio_base_url = "https://api.frame.io"
        
        # Scopes requis pour Frame.io (déterminés après tests)
        self.required_scopes = [
            'email',
            'openid', 
            'offline_access',
            'profile',
            'additional_info.roles'
        ]
    
    def _setup_logger(self) -> logging.Logger:
        """Configure le logger pour OAuth"""
        logger = logging.getLogger('frameio_oauth')
        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            handler.setFormatter(formatter)
            logger.addHandler(handler)
            logger.setLevel(logging.INFO)
        return logger
    
    def _load_oauth_config(self) -> Dict[str, str]:
        """
        Charge la configuration OAuth depuis le fichier Adobe
        
        Returns:
            Dict contenant client_id, client_secret et redirect_uri
            
        Raises:
            FrameioOAuthError: Si le fichier de config n'existe pas ou est invalide
        """
        oauth_file = self.project_root / "data" / "890CarmineWhitefish-1845895-OAuth Web App.json"
        
        if not oauth_file.exists():
            raise FrameioOAuthError(f"Fichier de configuration OAuth non trouvé: {oauth_file}")
        
        try:
            with open(oauth_file, 'r') as f:
                oauth_data = json.load(f)
            
            return {
                'client_id': oauth_data['API_KEY'],
                'client_secret': oauth_data['CLIENT_SECRET'],
                'redirect_uri': oauth_data['DEF_REDIRECT_URI']
            }
        except (json.JSONDecodeError, KeyError) as e:
            raise FrameioOAuthError(f"Configuration OAuth invalide: {e}")
    
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
        
        self.logger.info(f"URL d'autorisation générée pour client_id: {self.oauth_config['client_id']}")
        return auth_url
    
    def exchange_code(self, authorization_code: str) -> Dict[str, Any]:
        """
        Échange un code d'autorisation contre un access token
        
        Args:
            authorization_code: Code d'autorisation reçu d'Adobe IMS
            
        Returns:
            Dict contenant access_token, refresh_token, expires_in, etc.
            
        Raises:
            FrameioOAuthError: Si l'échange échoue
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
        
        self.logger.info("Échange du code d'autorisation en cours...")
        
        try:
            response = requests.post(self.token_endpoint, headers=headers, data=data)
            response.raise_for_status()
            
            token_data = response.json()
            
            # Sauvegarder automatiquement
            self._save_tokens(token_data)
            
            self.logger.info("Token obtenu et sauvegardé avec succès")
            return token_data
            
        except requests.exceptions.RequestException as e:
            error_msg = f"Erreur lors de l'échange du code: {e}"
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_details = e.response.json()
                    error_msg += f" - Détails: {error_details}"
                except:
                    error_msg += f" - Réponse: {e.response.text}"
            
            self.logger.error(error_msg)
            raise FrameioOAuthError(error_msg)
    
    def refresh_token(self) -> Dict[str, Any]:
        """
        Rafraîchit le token d'accès actuel
        
        Returns:
            Dict contenant le nouveau access_token, refresh_token, etc.
            
        Raises:
            FrameioOAuthError: Si le rafraîchissement échoue
        """
        current_config = self._load_current_tokens()
        
        if not current_config.get('refresh_token'):
            raise FrameioOAuthError("Aucun refresh token disponible")
        
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
        
        self.logger.info("Rafraîchissement du token en cours...")
        
        try:
            response = requests.post(self.token_endpoint, headers=headers, data=data)
            response.raise_for_status()
            
            token_data = response.json()
            
            # Sauvegarder le nouveau token
            self._save_tokens(token_data)
            
            self.logger.info("Token rafraîchi avec succès")
            return token_data
            
        except requests.exceptions.RequestException as e:
            error_msg = f"Erreur lors du rafraîchissement: {e}"
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_details = e.response.json()
                    error_msg += f" - Détails: {error_details}"
                except:
                    error_msg += f" - Réponse: {e.response.text}"
            
            self.logger.error(error_msg)
            raise FrameioOAuthError(error_msg)
    
    def test_api(self) -> Tuple[bool, Dict[str, Any]]:
        """
        Teste l'accès à l'API Frame.io avec le token actuel
        
        Returns:
            Tuple (success: bool, response_data: dict)
        """
        current_config = self._load_current_tokens()
        
        if not current_config.get('access_token'):
            return False, {"error": "Aucun access token disponible"}
        
        headers = {
            'Authorization': f'Bearer {current_config["access_token"]}',
            'Content-Type': 'application/json'
        }
        
        try:
            # Test endpoint /v4/me
            response = requests.get(f"{self.frameio_base_url}/v4/me", headers=headers)
            
            if response.status_code == 200:
                user_data = response.json()
                self.logger.info("Accès API Frame.io réussi")
                return True, user_data
            else:
                error_data = {"status_code": response.status_code}
                try:
                    error_data.update(response.json())
                except:
                    error_data["response_text"] = response.text
                
                self.logger.warning(f"Accès API Frame.io échoué: {response.status_code}")
                return False, error_data
                
        except requests.exceptions.RequestException as e:
            error_data = {"error": str(e)}
            self.logger.error(f"Erreur lors du test API: {e}")
            return False, error_data
    
    def get_user_info(self) -> Optional[Dict[str, Any]]:
        """
        Récupère les informations utilisateur Adobe IMS
        
        Returns:
            Dict avec les infos utilisateur ou None si erreur
        """
        current_config = self._load_current_tokens()
        
        if not current_config.get('access_token'):
            return None
        
        headers = {
            'Authorization': f'Bearer {current_config["access_token"]}',
            'Content-Type': 'application/json'
        }
        
        try:
            url = f"{self.userinfo_endpoint}?client_id={self.oauth_config['client_id']}"
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                return response.json()
            else:
                self.logger.warning(f"Échec récupération userinfo: {response.status_code}")
                return None
                
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Erreur userinfo: {e}")
            return None
    
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
        
        self.logger.debug(f"Tokens sauvegardés dans {integrations_file}")
    
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
    
    def ensure_valid_token(self) -> bool:
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
                self.refresh_token()
                return True
            except FrameioOAuthError:
                self.logger.warning("Échec du rafraîchissement automatique")
                return False
        
        return False


# Fonctions utilitaires pour compatibilité avec les anciens scripts
def get_frameio_oauth_client() -> FrameioOAuth:
    """
    Fonction utilitaire pour obtenir un client OAuth Frame.io configuré
    
    Returns:
        Instance de FrameioOAuth prête à l'emploi
    """
    return FrameioOAuth()


def test_frameio_connection() -> bool:
    """
    Test rapide de connexion Frame.io
    
    Returns:
        True si la connexion fonctionne, False sinon
    """
    oauth = get_frameio_oauth_client()
    
    if not oauth.ensure_valid_token():
        return False
    
    success, _ = oauth.test_api()
    return success


if __name__ == "__main__":
    # Test basique si le script est exécuté directement
    print("🎬 Frame.io OAuth Library - Test de base")
    print("=" * 50)
    
    try:
        oauth = FrameioOAuth()
        print(f"✅ Client OAuth initialisé")
        print(f"Client ID: {oauth.oauth_config['client_id']}")
        
        # Test de la validité du token
        if oauth.is_token_valid():
            print("✅ Token actuel valide")
            
            # Test API
            success, response = oauth.test_api()
            if success:
                print("✅ API Frame.io accessible")
                if 'name' in response:
                    print(f"Utilisateur connecté: {response['name']}")
            else:
                print("❌ API Frame.io non accessible")
                print(f"Erreur: {response}")
        else:
            print("❌ Aucun token valide")
            print("Utilisez frameio_oauth_complete.py pour l'authentification initiale")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
