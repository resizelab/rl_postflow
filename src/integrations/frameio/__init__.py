"""
Frame.io API v4 Integration Module
Intégration complète avec Adobe IMS OAuth 2.0 pour PostFlow
"""

from .auth import FrameIOAuth, FrameIOAuthError, TokenInfo
from .structure import FrameIOStructureManager, FrameIOProject, FrameIOFolder
from .upload import FrameIOUploadManager, FrameIOUploadError, UploadResult, UploadMetadata
from .comments import FrameIOCommentManager, FrameIOComment, CommentAnnotation
from .parser import FrameIOFileParser, FileMetadata
from .notifier import FrameIODiscordNotifier, FrameIONotificationData
from .integration import FrameIOIntegrationManager, create_frameio_integration
from .production_upload import FrameIOProductionUploader, upload_file_to_frameio

# Fonction utilitaire pour créer l'auth
def create_frameio_auth(project_root=None):
    """
    Crée une instance d'authentification Frame.io
    
    Args:
        project_root (Path, optional): Chemin racine du projet
        
    Returns:
        FrameIOAuth: Instance d'authentification
    """
    from pathlib import Path
    
    return FrameIOAuth(project_root=project_root)

__version__ = "4.1.1"
__author__ = "PostFlow Team"
__description__ = "Frame.io API v4 integration with Adobe IMS OAuth 2.0"

# Classes principales exportées
__all__ = [
    # Authentification
    "FrameIOAuth",
    "FrameIOAuthError", 
    "TokenInfo",
    "create_frameio_auth",
    
    # Structure et navigation
    "FrameIOStructureManager",
    "FrameIOProject",
    "FrameIOFolder",
    
    # Upload de fichiers
    "FrameIOUploadManager",
    "FrameIOUploadError",
    "UploadResult",
    
    # Gestion des commentaires
    "FrameIOCommentManager",
    "FrameIOComment",
    "CommentAnnotation",
]

# Configuration par défaut
DEFAULT_CONFIG = {
    "base_url": "https://api.frame.io/v4",
    "ims_host": "https://ims-na1.adobelogin.com",
    "timeout": 30,
    "max_retries": 3,
    "chunk_size": 8388608,  # 8MB
    "parallel_uploads": 2,
    "rate_limit_retries": 5,
    "backoff_factor": 2,
}


def get_version():
    """Retourne la version de l'intégration"""
    return __version__


def get_client_info():
    """Retourne les informations sur le client"""
    return {
        "name": "PostFlow Frame.io Integration",
        "version": __version__,
        "api_version": "v4",
        "auth_type": "Adobe IMS OAuth 2.0",
        "author": __author__,
        "description": __description__,
    }


# Fonction d'initialisation rapide
async def create_frameio_client(
    client_id: str = None,
    client_secret: str = None,
    account_id: str = None,
    workspace_id: str = None,
    **kwargs
):
    """
    Crée un client Frame.io complet avec tous les managers
    
    Args:
        client_id: Client ID Adobe IMS
        client_secret: Client Secret Adobe IMS
        account_id: Account ID Frame.io
        workspace_id: Workspace ID Frame.io
        **kwargs: Arguments supplémentaires
    
    Returns:
        dict: Dictionnaire contenant tous les managers
    """
    auth = FrameIOAuth(
        client_id=client_id,
        client_secret=client_secret,
        **kwargs
    )
    
    # Initialiser les managers
    structure_manager = FrameIOStructureManager(auth)
    upload_manager = FrameIOUploadManager(auth)
    comment_manager = FrameIOCommentManager(auth)
    
    return {
        "auth": auth,
        "structure": structure_manager,
        "upload": upload_manager,
        "comments": comment_manager,
    }


# Fonction utilitaire pour vérifier la compatibilité
def check_compatibility():
    """
    Vérifie que l'environnement est compatible avec Frame.io v4
    
    Returns:
        dict: Résultat de la vérification de compatibilité
    """
    import sys
    import os
    
    results = {
        "python_version": sys.version,
        "python_compatible": sys.version_info >= (3, 8),
        "env_variables": {},
        "missing_variables": [],
    }
    
    # Vérifier les variables d'environnement
    required_vars = [
        "FRAMEIO_CLIENT_ID",
        "FRAMEIO_CLIENT_SECRET", 
        "FRAMEIO_ACCOUNT_ID",
        "FRAMEIO_WORKSPACE_ID",
    ]
    
    for var in required_vars:
        value = os.getenv(var)
        if value:
            results["env_variables"][var] = f"{value[:10]}..." if len(value) > 10 else value
        else:
            results["missing_variables"].append(var)
    
    results["env_configured"] = len(results["missing_variables"]) == 0
    results["compatible"] = results["python_compatible"] and results["env_configured"]
    
    return results

class FrameioClient:
    """
    Client unifié pour Frame.io API v4
    Combine tous les managers pour une utilisation simplifiée
    """
    
    def __init__(self, config=None):
        """
        Initialise le client Frame.io v4
        
        Args:
            config (dict, optional): Configuration personnalisée
        """
        self.config = {**DEFAULT_CONFIG, **(config or {})}
        
        # Initialiser les managers
        self.auth = create_frameio_auth(self.config)
        self.structure = FrameIOStructureManager(self.auth)
        self.upload = FrameIOUploadManager(self.auth)
        self.comments = FrameIOCommentManager(self.auth)
    
    async def authenticate(self):
        """Authentifie le client"""
        return await self.auth.get_access_token()
    
    async def get_accounts(self):
        """Récupère les comptes disponibles"""
        return await self.structure.get_accounts()
    
    async def get_projects(self, account_id=None):
        """Récupère les projets"""
        return await self.structure.get_projects(account_id)
    
    async def upload_file(self, file_path, folder_id, **kwargs):
        """Upload un fichier"""
        return await self.upload.upload_file(file_path, folder_id, **kwargs)
    
    async def add_comment(self, asset_id, text, **kwargs):
        """Ajoute un commentaire"""
        return await self.comments.add_comment(asset_id, text, **kwargs)
    
    def get_status(self):
        """Retourne le statut du client"""
        return {
            "authenticated": self.auth.is_token_valid(),
            "config": self.config,
            "version": __version__
        }
