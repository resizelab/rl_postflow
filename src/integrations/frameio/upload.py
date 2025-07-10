"""
Frame.io API v4 Upload Module
Gestion de l'upload de fichiers avec la séquence v4 recommandée
"""

import os
import re
import asyncio
import hashlib
import time
import requests
from typing import List, Dict, Optional, Any, Union
from dataclasses import dataclass
from pathlib import Path
from datetime import datetime
import logging
import httpx

from .auth import FrameIOAuth, FrameIOAuthError
from .structure import FrameIOStructureManager, FrameIOFolder
from .public_server import PublicFileServer, temporary_file_server
from .cloudflare_manager import CloudflareManager
from .range_server import RangeFileServer

logger = logging.getLogger(__name__)

class NomenclatureValidationError(Exception):
    """Exception levée quand un fichier ne respecte pas la nomenclature stricte"""
    pass

def validate_strict_nomenclature(file_path: str) -> Dict[str, Any]:
    """
    Valide strictement la nomenclature d'un fichier selon le format SQ##_UNDLM_#####_v###.ext
    
    Args:
        file_path: Chemin du fichier à valider
        
    Returns:
        Dict contenant les informations extraites si valide
        
    Raises:
        NomenclatureValidationError: Si le fichier ne respecte pas la nomenclature
    """
    try:
        file_path_obj = Path(file_path)
        filename = file_path_obj.name
        
        # Pattern strict pour la nomenclature (pas de re.IGNORECASE)
        pattern = r'^SQ(\d{2})_UNDLM_(\d{5})_v(\d{3})\.(mov|mp4|avi|mxf)$'
        
        match = re.match(pattern, filename)
        if not match:
            raise NomenclatureValidationError(
                f"Fichier '{filename}' ne respecte pas la nomenclature stricte SQ##_UNDLM_#####_v###.ext (extension minuscule)"
            )
        
        sequence_num, plan_num, version_num, extension = match.groups()
        
        # Validation des composants
        if not (1 <= int(sequence_num) <= 99):
            raise NomenclatureValidationError(
                f"Numéro de séquence '{sequence_num}' invalide (doit être 01-99)"
            )
            
        if not (1 <= int(plan_num) <= 99999):
            raise NomenclatureValidationError(
                f"Numéro de plan '{plan_num}' invalide (doit être 00001-99999)"
            )
            
        if not (1 <= int(version_num) <= 999):
            raise NomenclatureValidationError(
                f"Numéro de version '{version_num}' invalide (doit être 001-999)"
            )
        
        # Validation de l'extension (doit être en minuscules)
        if extension not in ['mov', 'mp4', 'avi', 'mxf']:
            raise NomenclatureValidationError(
                f"Extension '{extension}' invalide (doit être mov, mp4, avi ou mxf en minuscules)"
            )
        
        # Validation du fichier physique
        if not file_path_obj.exists():
            raise NomenclatureValidationError(f"Fichier '{file_path}' n'existe pas")
            
        if not file_path_obj.is_file():
            raise NomenclatureValidationError(f"'{file_path}' n'est pas un fichier")
        
        # Validation de la taille (fichier non vide)
        if file_path_obj.stat().st_size == 0:
            raise NomenclatureValidationError(f"Fichier '{filename}' est vide")
        
        logger.info(f"✅ Nomenclature validée: {filename}")
        
        return {
            'sequence_number': int(sequence_num),
            'plan_number': int(plan_num),
            'version_number': int(version_num),
            'extension': extension,
            'shot_id': f"UNDLM_{plan_num}",
            'sequence_name': f"SQ{sequence_num}",
            'scene_name': f"SQ{sequence_num}",  # Compatibilité avec le code existant
            'version': f"v{version_num}",
            'filename': filename,
            'valid': True
        }
        
    except NomenclatureValidationError:
        raise
    except Exception as e:
        raise NomenclatureValidationError(f"Erreur lors de la validation de '{filename}': {e}")

@dataclass
class FrameIOFile:
    """Représentation d'un fichier Frame.io"""
    id: str
    name: str
    size: int
    status: str
    folder_id: str
    project_id: str
    workspace_id: str
    account_id: str
    upload_urls: Optional[List[str]] = None
    download_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    review_url: Optional[str] = None  # Lien de review pour partage
    share_url: Optional[str] = None   # Lien de partage public
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

@dataclass
class UploadResult:
    """Résultat d'un upload"""
    file_id: str
    status: str
    name: str
    size: int
    url: Optional[str] = None
    error: Optional[str] = None

@dataclass
class UploadMetadata:
    """Métadonnées pour l'upload d'un fichier"""
    shot_id: str
    scene_name: str
    version: str
    file_path: str
    nomenclature: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None

class FrameIOUploadError(Exception):
    """Exception pour les erreurs d'upload Frame.io"""
    pass

class FrameIOUploadManager:
    """Gestionnaire d'upload Frame.io v4 avec séquence recommandée"""
    
    def __init__(self, config_or_auth):
        """
        Initialiser le gestionnaire d'upload.
        
        Args:
            config_or_auth: ConfigManager ou FrameIOAuth
        """
        # Événement pour arrêter les opérations en cours
        self._shutdown_event = asyncio.Event()
        
        if hasattr(config_or_auth, 'get') and callable(getattr(config_or_auth, 'get')):
            # Vérifier si c'est un ConfigManager avec une méthode get compatible
            try:
                # Test si get accepte une valeur par défaut (ConfigManager)
                test_get = config_or_auth.get('test', None)
                # C'est un ConfigManager
                self.config = config_or_auth
                self.auth = None
                self.account_id = config_or_auth.get('frameio.account_id')
                self.workspace_id = config_or_auth.get('frameio.workspace_id')
                self.root_folder_id = config_or_auth.get('frameio.root_folder_id')
                self.base_url = config_or_auth.get('frameio.base_url', 'https://api.frame.io/v4')
                self.access_token = config_or_auth.get('frameio.access_token')
            except TypeError:
                # C'est probablement un FrameIOAuth avec get() qui ne prend pas de défaut
                self.auth = config_or_auth
                self.config = None
                
                # Charger la configuration depuis l'auth
                current_config = self.auth._load_current_tokens()
                
                # Récupérer les IDs depuis la config en priorité, puis les variables d'environnement
                self.account_id = current_config.get('account_id') or os.getenv('FRAMEIO_ACCOUNT_ID')
                self.workspace_id = current_config.get('workspace_id') or os.getenv('FRAMEIO_WORKSPACE_ID')
                self.root_folder_id = current_config.get('root_folder_id') or os.getenv('FRAMEIO_ROOT_FOLDER_ID')
                self.base_url = current_config.get('base_url', 'https://api.frame.io/v4')
                self.access_token = None
        else:
            # C'est un FrameIOAuth
            self.auth = config_or_auth
            self.config = None
            
            # Charger la configuration depuis l'auth
            current_config = self.auth._load_current_tokens()
            
            # Récupérer les IDs depuis la config en priorité, puis les variables d'environnement
            self.account_id = current_config.get('account_id') or os.getenv('FRAMEIO_ACCOUNT_ID')
            self.workspace_id = current_config.get('workspace_id') or os.getenv('FRAMEIO_WORKSPACE_ID')
            self.root_folder_id = current_config.get('root_folder_id') or os.getenv('FRAMEIO_ROOT_FOLDER_ID')
            self.base_url = current_config.get('base_url', 'https://api.frame.io/v4')
            self.access_token = None
        
        self.chunk_size = int(os.getenv('FRAMEIO_CHUNK_SIZE', '8388608'))
        self.parallel_uploads = int(os.getenv('FRAMEIO_PARALLEL_UPLOADS', '2'))
        
        if not self.account_id:
            raise ValueError("account_id manquant dans la config frameio ou FRAMEIO_ACCOUNT_ID")
        if not self.workspace_id:
            raise ValueError("workspace_id manquant dans la config frameio ou FRAMEIO_WORKSPACE_ID")
        if not self.root_folder_id:
            raise ValueError("root_folder_id manquant dans la config frameio ou FRAMEIO_ROOT_FOLDER_ID")
        
        logger.info(f"📤 FrameIOUploadManager - Account: {self.account_id}")
        
        # Initialiser le structure_manager dans tous les cas
        if self.auth:
            self.structure_manager = FrameIOStructureManager(self.auth)
        else:
            # Créer un objet FrameIOAuth à partir du ConfigManager
            try:
                from .auth import FrameIOAuth
                temp_auth = FrameIOAuth()
                # Définir le token d'accès si disponible
                if self.config.get('frameio.access_token'):
                    from .auth import TokenInfo
                    temp_auth._token_info = TokenInfo(
                        access_token=self.config.get('frameio.access_token'),
                        expires_in=self.config.get('frameio.expires_in', 3600)
                    )
                self.structure_manager = FrameIOStructureManager(temp_auth)
            except Exception as e:
                logger.error(f"❌ Impossible d'initialiser FrameIOStructureManager: {e}")
                self.structure_manager = None
        
        # Serveur public pour les fichiers (optionnel)
        self.public_server = None
    
    def _calculate_file_hash(self, file_path: str) -> str:
        """Calculer le hash SHA-256 d'un fichier pour vérification d'intégrité"""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                sha256_hash.update(chunk)
        return sha256_hash.hexdigest()
    
    async def _make_authenticated_request(self, method: str, url: str, timeout: float = 30.0, **kwargs) -> httpx.Response:
        """
        Effectue une requête HTTP authentifiée, gère les cas où self.auth est None
        
        Args:
            method: Méthode HTTP (GET, POST, etc.)
            url: URL complète
            timeout: Timeout en secondes (défaut: 30.0)
            **kwargs: Arguments pour httpx
            
        Returns:
            Réponse HTTP
        """
        if self.auth is not None:
            # Utiliser l'auth existant avec timeout personnalisé
            original_timeout = getattr(self.auth, 'timeout', 30.0)
            if hasattr(self.auth, 'timeout'):
                self.auth.timeout = timeout
            try:
                return await self.auth.request(method, url, **kwargs)
            finally:
                if hasattr(self.auth, 'timeout'):
                    self.auth.timeout = original_timeout
        else:
            # Créer une requête directe avec le token d'accès
            if not self.access_token:
                raise FrameIOUploadError("Aucun token d'accès disponible")
            
            # Ajouter les headers d'authentification
            headers = kwargs.get('headers', {})
            headers['Authorization'] = f'Bearer {self.access_token}'
            headers['Content-Type'] = 'application/json'
            kwargs['headers'] = headers
            
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.request(method, url, **kwargs)
                return response
    
    async def _create_file_placeholder(self, metadata: UploadMetadata, folder_id: str, 
                                      workspace_id: Optional[str] = None) -> Optional[FrameIOFile]:
        """
        Étape 1: Créer un fichier vide pour obtenir les upload_urls
        Endpoint: /accounts/{account_id}/folders/{folder_id}/files/local_upload
        """
        try:
            file_path = Path(metadata.file_path)
            if not file_path.exists():
                raise FileNotFoundError(f"Fichier non trouvé: {file_path}")

            file_size = file_path.stat().st_size

            # Nouveau endpoint v4 pour l'upload local
            url = f"{self.base_url}/accounts/{self.account_id}/folders/{folder_id}/files/local_upload"

            # Préparer le payload selon la documentation v4 (seulement name et file_size)
            payload = {
                "data": {
                    "name": file_path.name,
                    "file_size": file_size
                }
            }

            # Note: L'API v4 ne supporte pas description et tags lors de la création
            # Ces métadonnées peuvent être ajoutées après upload via une requête PATCH

            response = await self._make_authenticated_request("POST", url, json=payload)
            
            # Debug en cas d'erreur 422
            if response.status_code == 422:
                logger.error(f"🔍 Erreur 422 - Payload envoyé: {payload}")
                logger.error(f"🔍 Réponse serveur: {response.text}")
            
            response.raise_for_status()
            
            # La réponse contient les données dans un objet "data"
            response_data = response.json()
            file_data = response_data.get("data", {})
            
            frameio_file = FrameIOFile(
                id=file_data["id"],
                name=file_data["name"],
                size=file_data.get("file_size", file_size),
                status=file_data.get("status", "created"),
                folder_id=folder_id,
                project_id=file_data.get("project_id", ""),
                workspace_id=self.workspace_id,
                account_id=self.account_id,
                upload_urls=[url_info["url"] for url_info in file_data.get("upload_urls", [])],
                download_url=file_data.get("download_url"),
                thumbnail_url=file_data.get("thumbnail_url"),
                review_url=file_data.get("review_url"),
                share_url=file_data.get("share_url"),
                created_at=file_data.get("created_at"),
                updated_at=file_data.get("updated_at")
            )
            
            logger.info(f"✅ Fichier placeholder créé: {file_path.name} (ID: {frameio_file.id})")
            logger.info(f"📤 {len(frameio_file.upload_urls)} URL(s) d'upload reçues")
            
            return frameio_file
            
        except Exception as e:
            logger.error(f"❌ Erreur création placeholder: {e}")
            return None
    
    async def _get_project_id_from_folder(self, folder_id: str, workspace_id: str) -> Optional[str]:
        """Récupérer le project_id d'un dossier (helper method)"""
        try:
            # Pour l'instant, on utilise le project_id par défaut de la config
            # Dans une implémentation complète, on ferait un GET sur le folder
            return os.getenv("FRAMEIO_DEFAULT_PROJECT_ID")
        except Exception as e:
            logger.error(f"Erreur récupération project_id: {e}")
            return None
    
    async def _upload_file_chunks(self, file_path: str, upload_urls: List[str]) -> bool:
        """
        Étape 2: Upload du fichier vers les URLs signées (multipart, S3 Frame.io v4)
        """
        try:
            file_path_obj = Path(file_path)
            file_size = file_path_obj.stat().st_size
            chunk_size = self.chunk_size
            num_chunks = len(upload_urls)
            if not upload_urls:
                logger.error("❌ Aucune URL d'upload fournie")
                return False
            # Préparer les headers S3 requis
            from urllib.parse import urlparse, parse_qs
            def build_headers(upload_url):
                headers = {"Content-Type": "application/octet-stream"}
                from urllib.parse import urlparse, parse_qs
                parsed = urlparse(upload_url)
                query = parse_qs(parsed.query)
                x_amz_acl = query.get("x-amz-acl")
                signed_headers = query.get("X-Amz-SignedHeaders")
                # 1. Si x-amz-acl est dans la query string ET non vide, l'utiliser
                if x_amz_acl and x_amz_acl[0]:
                    headers["x-amz-acl"] = x_amz_acl[0]
                # 2. Sinon, si x-amz-acl est exigé par la signature mais absent de la query, fallback: private
                elif signed_headers and any("x-amz-acl" in h for h in signed_headers):
                    headers["x-amz-acl"] = "private"
                # 3. Sinon, ne pas envoyer ce header
                return headers
            if num_chunks == 1:
                # Cas simple : un seul chunk (petit fichier)
                upload_url = upload_urls[0]
                logger.info(f"📤 Upload (mono-chunk) vers: {upload_url[:50]}...")
                headers = build_headers(upload_url)
                with open(file_path, "rb") as file_obj:
                    file_content = file_obj.read()
                    async with httpx.AsyncClient(timeout=300.0) as client:
                        response = await client.put(
                            upload_url,
                            content=file_content,
                            headers=headers
                        )
                if response.status_code in [200, 201, 204]:
                    logger.info(f"✅ Upload réussi: {file_path_obj.name} ({file_size} bytes)")
                    return True
                else:
                    logger.error(f"❌ Erreur upload: {response.status_code} - {response.text}")
                    return False
            # Multipart : plusieurs chunks
            logger.info(f"📤 Upload multipart: {num_chunks} chunks de {chunk_size} bytes (Content-Type: application/octet-stream, x-amz-acl si présent)")
            with open(file_path, "rb") as file_obj:
                for idx, upload_url in enumerate(upload_urls):
                    chunk = file_obj.read(chunk_size)
                    if not chunk:
                        logger.warning(f"Chunk {idx+1}/{num_chunks} vide, arrêt upload.")
                        break
                    logger.info(f"📤 Chunk {idx+1}/{num_chunks} → {upload_url[:50]}...")
                    headers = build_headers(upload_url)
                    try:
                        async with httpx.AsyncClient(timeout=300.0) as client:
                            response = await client.put(
                                upload_url,
                                content=chunk,
                                headers=headers
                            )
                        if response.status_code in [200, 201, 204]:
                            logger.info(f"✅ Chunk {idx+1}/{num_chunks} uploadé ({len(chunk)} bytes)")
                        else:
                            logger.error(f"❌ Erreur upload chunk {idx+1}: {response.status_code} - {response.text}")
                            return False
                    except Exception as e:
                        import traceback
                        logger.error(f"❌ Erreur upload chunk {idx+1}: {e}\nType: {type(e)}\nTraceback:\n{traceback.format_exc()}")
                        logger.error(f"Détails chunk: fichier={file_path}, chunk={idx+1}, taille={len(chunk)}, url={upload_url}")
                        if hasattr(e, 'errno'):
                            logger.error(f"Errno: {e.errno}")
                        if hasattr(e, 'strerror'):
                            logger.error(f"StrError: {e.strerror}")
                        if hasattr(e, 'response') and e.response is not None:
                            logger.error(f"Headers réponse: {e.response.headers}")
                            logger.error(f"Contenu réponse: {e.response.text[:500]}")
                        if 'BrokenResourceError' in str(type(e)):
                            logger.error("💥 Problème réseau bas niveau (BrokenResourceError) : voir https://github.com/aws/aws-sdk-js/issues/86 et vérifier la stabilité réseau/S3.")
                        return False
            logger.info(f"✅ Upload multipart terminé: {file_path_obj.name}")
            return True
        except Exception as e:
            import traceback
            logger.error(f"❌ Erreur upload fichier: {e}\nType: {type(e)}\nTraceback:\n{traceback.format_exc()}")
            logger.error(f"Détails upload: fichier={file_path}, taille={file_size}")
            if hasattr(e, 'errno'):
                logger.error(f"Errno: {e.errno}")
            if hasattr(e, 'strerror'):
                logger.error(f"StrError: {e.strerror}")
            if hasattr(e, 'response') and e.response is not None:
                logger.error(f"Headers réponse: {e.response.headers}")
                logger.error(f"Contenu réponse: {e.response.text[:500]}")
            if 'BrokenResourceError' in str(type(e)):
                logger.error("💥 Problème réseau bas niveau (BrokenResourceError) : voir https://github.com/aws-sdk-js/issues/86 et vérifier la stabilité réseau/S3.")
            return False
    
    async def _wait_for_processing(self, file_id: str, workspace_id: Optional[str] = None, 
                                  max_wait: int = 600) -> bool:  # Augmenter à 10 minutes
        """
        Attendre que le fichier soit traité par Frame.io avec backoff exponentiel et arrêt gracieux
        
        Args:
            file_id: ID du fichier Frame.io
            workspace_id: ID du workspace (optionnel)
            max_wait: Temps d'attente maximum en secondes (défaut: 600)
            
        Returns:
            True si le traitement est terminé, False sinon
        """
        try:
            ws_id = workspace_id or self.workspace_id
            
            # Endpoint pour récupérer le statut d'un fichier (API v4 nécessite account_id)
            url = f"{self.base_url}/accounts/{self.account_id}/files/{file_id}"
            
            start_time = datetime.now()
            last_status = None
            check_count = 0
            stable_status_count = 0  # Compteur pour les statuts stables consécutifs
            
            # Backoff exponentiel : démarrer à 15s, puis 30s, 60s, max 120s
            base_interval = 15
            max_interval = 120
            
            # Statuts considérés comme stables (ne changent plus)
            stable_statuses = ["ready", "processed", "complete", "transcoded", "uploaded", "created", "error", "failed"]
            
            logger.info(f"🔄 Début surveillance fichier {file_id} (max {max_wait}s)")
            
            while (datetime.now() - start_time).total_seconds() < max_wait:
                # Vérifier si un arrêt a été demandé
                if self._shutdown_event.is_set():
                    logger.info(f"🛑 Arrêt demandé pour la surveillance du fichier {file_id}")
                    return False
                
                try:
                    response = await self._make_authenticated_request("GET", url)
                    
                    if response.status_code == 404:
                        logger.warning(f"⚠️ Fichier {file_id} non trouvé (404) - attente que le remote_upload soit traité...")
                        # Pour les 404, utiliser un intervalle plus court au début
                        current_interval = min(base_interval, 15)
                        stable_status_count = 0  # Reset compteur
                    else:
                        response.raise_for_status()
                        
                        file_data = response.json()
                        
                        # Extraire le statut selon la structure de réponse
                        if "data" in file_data:
                            status = file_data["data"].get("status", "unknown")
                            file_info = file_data["data"]
                        else:
                            status = file_data.get("status", "unknown")
                            file_info = file_data
                        
                        # Afficher le statut seulement s'il change
                        if status != last_status:
                            logger.info(f"📊 Statut fichier {file_id}: {status}")
                            last_status = status
                            stable_status_count = 0  # Reset compteur si le statut change
                        else:
                            # Statut identique, incrémenter le compteur
                            stable_status_count += 1
                        
                        # Vérifier les statuts définitifs - arrêter immédiatement
                        if status in ["ready", "processed", "complete", "transcoded", "uploaded"]:
                            logger.info(f"✅ Traitement terminé: {file_id} -> {status}")
                            return True
                        
                        # Vérifier si il y a une erreur
                        elif status in ["error", "failed"]:
                            logger.error(f"❌ Erreur de traitement: {file_id} -> {status}")
                            return False
                        
                        # Pour les statuts transitoires, continuer le polling avec backoff
                        elif status in ["uploading", "processing", "pending", "transcoding", "created"]:
                            logger.info(f"⏳ Statut transitoire: {file_id} -> {status}, continue polling...")
                        
                        # Arrêter les vérifications si le statut est stable depuis trop longtemps
                        elif status in stable_statuses and stable_status_count >= 3:
                            logger.info(f"🛑 Statut stable '{status}' depuis {stable_status_count} vérifications, arrêt de la surveillance")
                            # Si c'est un statut de succès stable, retourner True
                            if status in ["ready", "processed", "complete", "transcoded", "uploaded"]:
                                return True
                            else:
                                return False
                        
                        # Statut inconnu, continuer le polling mais avec un avertissement
                        else:
                            logger.warning(f"⚠️ Statut inconnu pour {file_id}: {status}, continue polling...")
                        
                        # Calculer l'intervalle avec backoff exponentiel
                        current_interval = min(base_interval * (2 ** (check_count // 3)), max_interval)
                    
                    # Attendre avant la prochaine vérification avec possibilité d'arrêt
                    logger.debug(f"⏳ Attente {current_interval}s avant prochaine vérification ({check_count + 1})")
                    
                    # Attendre avec possibilité d'interruption
                    try:
                        await asyncio.wait_for(self._shutdown_event.wait(), timeout=current_interval)
                        # Si on arrive ici, l'arrêt a été demandé
                        logger.info(f"🛑 Arrêt demandé pendant l'attente pour {file_id}")
                        return False
                    except asyncio.TimeoutError:
                        # Timeout normal, continuer
                        pass
                    
                    check_count += 1
                    
                except Exception as e:
                    logger.warning(f"⚠️ Erreur vérification statut {file_id}: {e}")
                    
                    # Si c'est une erreur 404, le fichier n'existe pas encore
                    if "404" in str(e):
                        logger.info(f"⏳ Fichier {file_id} pas encore créé - attente du remote_upload...")
                    
                    # Attendre avec backoff en cas d'erreur
                    error_interval = min(base_interval * (2 ** (check_count // 2)), max_interval)
                    
                    # Attendre avec possibilité d'interruption
                    try:
                        await asyncio.wait_for(self._shutdown_event.wait(), timeout=error_interval)
                        logger.info(f"🛑 Arrêt demandé pendant l'attente d'erreur pour {file_id}")
                        return False
                    except asyncio.TimeoutError:
                        pass
                    
                    check_count += 1
            
            logger.warning(f"⏰ Timeout atteint pour le traitement de {file_id} ({max_wait}s, {check_count} vérifications)")
            return False
            
        except Exception as e:
            logger.error(f"❌ Erreur attente traitement {file_id}: {e}")
            return False
    
    async def upload_file(self, shot_id: str, file_path: str, scene_name: str,
                         project_id: Optional[str] = None, workspace_id: Optional[str] = None,
                         metadata: Optional[Dict[str, Any]] = None) -> Optional[FrameIOFile]:
        """
        Upload complet d'un fichier selon la nomenclature UNDLM_XXXXX
        
        Args:
            shot_id: ID du plan (ex: "UNDLM_00412")
            file_path: Chemin vers le fichier à uploader
            scene_name: Nom de la scène (ex: "DOUANE MER - JOUR")
            project_id: ID du projet Frame.io (optionnel)
            workspace_id: ID du workspace (optionnel)
            metadata: Métadonnées additionnelles (optionnel)
        
        Returns:
            FrameIOFile si succès, None sinon
        """
        try:
            file_path_obj = Path(file_path)
            if not file_path_obj.exists():
                raise FileNotFoundError(f"Fichier non trouvé: {file_path}")
            
            # Validation stricte de la nomenclature
            nomenclature_info = validate_strict_nomenclature(file_path)
            if not nomenclature_info.get('valid'):
                raise Exception(f"Nomenclature invalide pour le fichier: {file_path_obj.name}")
            
            # Extraire version depuis le nom du fichier
            filename = file_path_obj.name
            version = "v1"  # Par défaut
            if "_v" in filename:
                try:
                    version_part = filename.split("_v")[1].split(".")[0]
                    version = f"v{version_part}"
                except:
                    pass
            
            # Préparer les métadonnées
            upload_metadata = UploadMetadata(
                shot_id=shot_id,
                scene_name=scene_name,
                version=version,
                file_path=str(file_path),
                nomenclature=shot_id,
                description=(metadata["description"] if metadata and "description" in metadata else f"Plan {shot_id} - {scene_name}"),
                tags=(metadata["tags"] if metadata and "tags" in metadata else [shot_id, scene_name, version])
            )
            
            # 1. Trouver ou créer le dossier de la scène
            proj_id = project_id or os.getenv("FRAMEIO_DEFAULT_PROJECT_ID")
            scene_folder = await self.structure_manager.find_or_create_scene_folder(
                scene_name, self.root_folder_id, proj_id, workspace_id
            )
            
            if not scene_folder:
                raise Exception(f"Impossible de créer/trouver le dossier pour la scène: {scene_name}")
            
            logger.info(f"Upload de {filename} vers la scène {scene_name}")
            
            # 2. Créer le fichier placeholder
            frameio_file = await self._create_file_placeholder(
                upload_metadata, scene_folder.id, workspace_id
            )
            
            if not frameio_file or not frameio_file.upload_urls:
                raise Exception("Impossible de créer le fichier placeholder ou d'obtenir les URLs d'upload")
            
            # 3. Upload du fichier
            upload_success = await self._upload_file_chunks(file_path, frameio_file.upload_urls)
            
            if not upload_success:
                raise Exception("Échec de l'upload du fichier")
            
            # 4. Attendre le traitement
            processing_success = await self._wait_for_processing(frameio_file.id, workspace_id)
            
            if processing_success:
                logger.info(f"Upload complet réussi: {shot_id} - {filename}")
                # 5. Enrichir avec les liens de review
                frameio_file = await self.enrich_file_with_links(frameio_file)
                return frameio_file
            else:
                logger.warning(f"Upload terminé mais traitement en cours: {shot_id}")
                # Même en cas de traitement en cours, on peut récupérer les liens
                frameio_file = await self.enrich_file_with_links(frameio_file)
                return frameio_file
            
        except Exception as e:
            logger.error(f"Erreur upload fichier {shot_id}: {e}")
            return None
    
    async def batch_upload(self, files_metadata: List[Dict[str, Any]], 
                          max_concurrent: int = 2) -> List[Optional[FrameIOFile]]:
        """
        Upload de plusieurs fichiers en parallèle (limité pour respecter les rate limits)
        
        Args:
            files_metadata: Liste des métadonnées des fichiers à uploader
                Chaque élément doit contenir: shot_id, file_path, scene_name
            max_concurrent: Nombre maximum d'uploads simultanés
        
        Returns:
            Liste des FrameIOFile (None en cas d'échec pour un fichier)
        """
        try:
            # Utiliser un semaphore pour limiter la concurrence
            semaphore = asyncio.Semaphore(max_concurrent)
            
            async def upload_with_semaphore(file_metadata):
                async with semaphore:
                    return await self.upload_file(**file_metadata)
            
            # Lancer tous les uploads en parallèle (avec limitation)
            tasks = [upload_with_semaphore(metadata) for metadata in files_metadata]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Traiter les résultats
            final_results = []
            for i, result in enumerate(results):
                if isinstance(result, Exception):
                    logger.error(f"Erreur upload fichier {i}: {result}")
                    final_results.append(None)
                else:
                    final_results.append(result)
            
            success_count = sum(1 for r in final_results if r is not None)
            logger.info(f"Batch upload terminé: {success_count}/{len(files_metadata)} réussis")
            
            return final_results
            
        except Exception as e:
            logger.error(f"Erreur batch upload: {e}")
            return [None] * len(files_metadata)

    async def upload_file_to_folder(self, file_path: str, folder_id: str, 
                                   metadata: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        """
        Upload un fichier vers un dossier Frame.io spécifique.
        Fonction principale pour l'intégration LucidLink → Frame.io.
        
        Args:
            file_path: Chemin complet vers le fichier à uploader
            folder_id: ID du dossier Frame.io de destination
            metadata: Métadonnées additionnelles (shot_id, scene_name, version, etc.)
            
        Returns:
            Dictionnaire avec les informations du fichier uploadé et le view_url,
            ou None en cas d'erreur
        """
        try:
            file_path_obj = Path(file_path)
            if not file_path_obj.exists():
                logger.error(f"❌ Fichier introuvable: {file_path}")
                return None
            
            # VALIDATION STRICTE DE LA NOMENCLATURE - SÉCURITÉ CRITIQUE
            try:
                nomenclature_info = validate_strict_nomenclature(str(file_path_obj))
                logger.info(f"🔒 Validation nomenclature réussie: {nomenclature_info['filename']}")
            except NomenclatureValidationError as e:
                logger.error(f"🚫 UPLOAD REFUSÉ - Nomenclature invalide: {e}")
                return None
            
            # Préparer les métadonnées d'upload avec les informations validées
            upload_metadata = UploadMetadata(
                shot_id=nomenclature_info['shot_id'],
                scene_name=nomenclature_info['scene_name'],
                version=nomenclature_info['version'],
                file_path=str(file_path_obj),
                nomenclature=nomenclature_info['filename'],
                description=metadata.get('description', f"Plan {nomenclature_info['shot_id']} - {nomenclature_info['scene_name']}") if metadata else f"Plan {nomenclature_info['shot_id']} - {nomenclature_info['scene_name']}",
                tags=metadata.get('tags', [nomenclature_info['shot_id'], nomenclature_info['scene_name'], nomenclature_info['version']]) if metadata else [nomenclature_info['shot_id'], nomenclature_info['scene_name'], nomenclature_info['version']]
            )
            
            logger.info(f"🚀 Début upload: {file_path_obj.name} → Folder {folder_id}")
            
            # 1. Créer le fichier placeholder et obtenir les URLs d'upload
            frameio_file = await self._create_file_placeholder(upload_metadata, folder_id)
            
            if not frameio_file or not frameio_file.upload_urls:
                logger.error("❌ Impossible de créer le fichier placeholder ou d'obtenir les URLs d'upload")
                return None
            
            # 2. Upload du fichier vers les URLs signées
            upload_success = await self._upload_file_chunks(str(file_path_obj), frameio_file.upload_urls)
            
            if not upload_success:
                logger.error("❌ Échec de l'upload du fichier")
                return None
            
            # 3. Récupérer les informations finales du fichier (incluant view_url)
            file_info = await self._get_file_info(frameio_file.id)
            
            result = {
                'file_id': frameio_file.id,
                'name': frameio_file.name,
                'size': frameio_file.size,
                'status': 'uploaded',
                'folder_id': folder_id,
                'view_url': file_info.get('view_url') if file_info else None,
                'project_id': frameio_file.project_id,
                'upload_metadata': metadata,
                'nomenclature_info': nomenclature_info
            }
            
            logger.info(f"✅ Upload terminé avec succès: {file_path_obj.name}")
            logger.info(f"🔗 View URL: {result.get('view_url', 'Non disponible')}")
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Erreur upload fichier: {e}")
            return None

    async def _create_file_remote_upload(self, file_path: str, folder_id: str, source_url: str) -> Optional[FrameIOFile]:
        """
        Créer un fichier Frame.io via remote_upload
        
        Args:
            file_path: Chemin du fichier local (pour les métadonnées)
            folder_id: ID du dossier de destination
            source_url: URL publique du fichier
            
        Returns:
            FrameIOFile si succès, None sinon
        """
        try:
            file_path_obj = Path(file_path)
            
            # Endpoint pour remote_upload
            url = f"{self.base_url}/accounts/{self.account_id}/folders/{folder_id}/files/remote_upload"
            
            # Payload pour remote_upload
            payload = {
                "data": {
                    "name": file_path_obj.name,
                    "source_url": source_url
                }
            }
            
            logger.info(f"🚀 Initiation remote_upload: {file_path_obj.name}")
            logger.info(f"🌐 Source URL: {source_url}")
            
            # Augmenter le timeout pour les gros fichiers
            response = await self._make_authenticated_request("POST", url, json=payload, timeout=120.0)
            
            # Status 201 (Created) ou 202 (Accepted) sont tous les deux des succès
            if response.status_code not in [201, 202]:
                logger.error(f"❌ Remote upload failed with status {response.status_code}")
                logger.error(f"❌ Response: {response.text}")
                return None
            
            response.raise_for_status()
            
            # La réponse contient les données dans un objet "data"
            response_data = response.json()
            file_data = response_data.get("data", {})
            
            frameio_file = FrameIOFile(
                id=file_data["id"],
                name=file_data["name"],
                size=file_data.get("file_size", 0),
                status=file_data.get("status", "uploading"),
                folder_id=folder_id,
                project_id=file_data.get("project_id", ""),
                workspace_id=self.workspace_id,
                account_id=self.account_id,
                upload_urls=None,  # Pas utilisé pour remote_upload
                download_url=file_data.get("download_url"),
                thumbnail_url=file_data.get("thumbnail_url"),
                review_url=file_data.get("view_url"),  # Utiliser view_url de l'API
                share_url=file_data.get("share_url"),
                created_at=file_data.get("created_at"),
                updated_at=file_data.get("updated_at")
            )
            
            # Log du view_url si disponible
            view_url = file_data.get("view_url")
            if view_url:
                logger.info(f"🔗 View URL reçu de l'API: {view_url}")
            else:
                logger.warning(f"⚠️ Aucun view_url dans la réponse de remote_upload")
            
            logger.info(f"✅ Remote upload initié: {file_path_obj.name} (ID: {frameio_file.id})")
            return frameio_file
            
        except Exception as e:
            logger.error(f"❌ Erreur remote_upload: {e}")
            logger.error(f"❌ Type d'erreur: {type(e)}")
            if hasattr(e, 'response') and e.response is not None:
                logger.error(f"❌ Status code: {e.response.status_code}")
                logger.error(f"❌ Response text: {e.response.text}")
            return None

    async def _get_file_info(self, file_id: str) -> Optional[Dict[str, Any]]:
        """
        Récupère les informations d'un fichier Frame.io.
        
        Args:
            file_id: ID du fichier
            
        Returns:
            Dict: Informations du fichier ou None
        """
        try:
            url = f"https://api.frame.io/v4/accounts/{self.account_id}/files/{file_id}"
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    url,
                    headers=self._get_headers(),
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.warning(f"⚠️ Fichier {file_id} non accessible: {response.status_code}")
                    return None
                    
        except Exception as e:
            logger.error(f"❌ Erreur récupération info fichier {file_id}: {e}")
            return None
    
    async def _create_file_share(self, file_id: str, project_id: str) -> Optional[str]:
        """
        Crée un partage pour un fichier Frame.io.
        
        Args:
            file_id: ID du fichier
            project_id: ID du projet
            
        Returns:
            str: Lien de partage ou None
        """
        try:
            # 1. Créer un partage pour le projet
            share_data = {
                "name": f"Share for {file_id}",
                "allow_approvals": True,
                "allow_comments": True,
                "allow_download": False,
                "password": None
            }
            
            url = f"https://api.frame.io/v4/accounts/{self.account_id}/projects/{project_id}/shares"
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url,
                    headers=self._get_headers(),
                    json=share_data,
                    timeout=30.0
                )
                
                if response.status_code == 201:
                    share_info = response.json()
                    share_id = share_info.get('id')
                    
                    # 2. Ajouter l'asset au partage
                    asset_data = {
                        "asset_id": file_id
                    }
                    
                    asset_url = f"https://api.frame.io/v4/accounts/{self.account_id}/shares/{share_id}/assets"
                    
                    asset_response = await client.post(
                        asset_url,
                        headers=self._get_headers(),
                        json=asset_data,
                        timeout=30.0
                    )
                    
                    if asset_response.status_code in [200, 201]:
                        # 3. Retourner le lien de partage
                        share_url = share_info.get('url')
                        if share_url:
                            return share_url
                        else:
                            # Construire le lien manuellement
                            return f"https://app.frame.io/share/{share_id}"
                    else:
                        logger.warning(f"⚠️ Impossible d'ajouter l'asset au partage: {asset_response.status_code}")
                        return None
                else:
                    logger.warning(f"⚠️ Impossible de créer le partage: {response.status_code}")
                    return None
                    
        except Exception as e:
            logger.error(f"❌ Erreur création partage: {e}")
            return None

    async def cleanup_all_resources(self):
        """Nettoie toutes les ressources d'exposition (Cloudflare et serveur local)."""
        await self._cleanup_cloudflare_resources()
        await self._cleanup_local_server_resources()
    
    async def _cleanup_cloudflare_resources(self):
        """Nettoie les ressources Cloudflare."""
        try:
            if hasattr(self, '_cloudflare_manager') and self._cloudflare_manager:
                self._cloudflare_manager.stop_tunnel()
                logger.info("🧹 Tunnel Cloudflare arrêté")
            
            if hasattr(self, '_local_server_for_cloudflare') and self._local_server_for_cloudflare:
                self._local_server_for_cloudflare.__exit__(None, None, None)
                logger.info("🧹 Serveur local Cloudflare arrêté")
                
        except Exception as e:
            logger.warning(f"⚠️ Erreur nettoyage Cloudflare: {e}")
    
    async def _cleanup_local_server_resources(self):
        """Nettoie les ressources du serveur local."""
        try:
            if hasattr(self, '_local_server') and self._local_server:
                self._local_server.__exit__(None, None, None)
                logger.info("🧹 Serveur local arrêté")
        except Exception as e:
            logger.warning(f"⚠️ Erreur nettoyage serveur local: {e}")
    
    async def get_file_review_link(self, file_id: str, workspace_id: Optional[str] = None) -> Optional[str]:
        """
        Récupérer le lien de review pour un fichier Frame.io
        
        Args:
            file_id: ID du fichier Frame.io
            workspace_id: ID du workspace (optionnel)
        
        Returns:
            str: Lien de review ou None si non trouvé
        """
        try:
            ws_id = workspace_id or self.workspace_id
            
            # D'abord vérifier que le fichier existe et est accessible
            file_info = await self._get_file_info(file_id)
            if not file_info:
                logger.warning(f"⚠️ Fichier {file_id} non trouvé")
                
                # Attendre un peu et réessayer
                logger.info(f"⏳ Attente 30s avant nouvelle tentative...")
                await asyncio.sleep(30)
                
                file_info = await self._get_file_info(file_id)
                if not file_info:
                    logger.error(f"❌ Fichier {file_id} définitivement non trouvé")
                    # Générer le lien de base même si le fichier n'est pas encore disponible
                    # Utiliser le workspace_id comme project_id par défaut
                    return f"https://next.frame.io/project/{ws_id}/view/{file_id}"
            
            # Extraire les données du fichier (encapsulées dans "data")
            file_data = file_info.get("data", file_info)
            
            # Priorité 1: Utiliser le view_url fourni par l'API s'il existe
            view_url = file_data.get("view_url")
            if view_url:
                logger.info(f"✅ View URL trouvé dans l'API: {view_url}")
                return view_url
            
            # Priorité 2: Vérifier si le fichier est dans un projet pour construire l'URL
            project_id = file_data.get("project_id")
            if not project_id:
                logger.warning(f"⚠️ Pas de project_id pour {file_id}, utilisation du lien direct")
                return f"https://next.frame.io/project/{ws_id}/view/{file_id}"
            
            # Priorité 3: Essayer de créer un partage pour le fichier
            try:
                share_link = await self._create_file_share(file_id, project_id)
                if share_link:
                    logger.info(f"✅ Lien de partage créé pour {file_id}: {share_link}")
                    
                    # Tester l'accessibilité du lien
                    if await self._test_link_accessibility(share_link):
                        return share_link
                    else:
                        logger.warning(f"⚠️ Lien de partage non accessible, utilisation du lien direct")
                        
            except Exception as e:
                logger.warning(f"⚠️ Impossible de créer un partage pour {file_id}: {e}")
            
            # Fallback: construire le lien direct vers l'asset
            review_url = f"https://next.frame.io/project/{project_id}/view/{file_id}"
            logger.info(f"🔗 Lien de review construit pour {file_id}: {review_url}")
            return review_url
                
        except Exception as e:
            logger.error(f"❌ Erreur récupération lien review {file_id}: {e}")
            return None
    
    async def _test_link_accessibility(self, link: str) -> bool:
        """
        Tester l'accessibilité d'un lien Frame.io
        
        Args:
            link: Lien à tester
            
        Returns:
            bool: True si accessible
        """
        try:
            async with httpx.AsyncClient(follow_redirects=True) as client:
                response = await client.get(link, timeout=15.0)
                if response.status_code == 200:
                    logger.info(f"✅ Lien accessible: {link}")
                    return True
                else:
                    logger.warning(f"⚠️ Lien non accessible ({response.status_code}): {link}")
                    return False
        except Exception as e:
            logger.warning(f"⚠️ Erreur test accessibilité: {e}")
            return False
    
    async def get_file_share_link(self, file_id: str, workspace_id: Optional[str] = None) -> Optional[str]:
        """
        Récupérer le lien de partage public pour un fichier Frame.io
        
        Args:
            file_id: ID du fichier Frame.io
            workspace_id: ID du workspace (optionnel)
        
        Returns:
            str: Lien de partage ou None si non trouvé
        """
        try:
            # Assurer l'authentification
            if not self.auth.is_authenticated():
                await self.auth.authenticate()
            
            headers = {'Authorization': f'Bearer {self.auth.access_token}'}
            ws_id = workspace_id or self.workspace_id
            
            # Créer un lien de partage
            url = f"{self.base_url}/workspaces/{ws_id}/assets/{file_id}/share"
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, headers=headers, json={
                    "public": True,
                    "expires_at": None  # Pas d'expiration
                })
                
                if response.status_code == 201:
                    share_data = response.json()
                    share_url = share_data.get('url')
                    
                    logger.info(f"🔗 Lien de partage créé pour {file_id}: {share_url}")
                    return share_url
                else:
                    logger.warning(f"⚠️ Impossible de créer le lien de partage: {response.status_code}")
                    return None
                
        except Exception as e:
            logger.error(f"❌ Erreur création lien partage {file_id}: {e}")
            return None
    
    async def enrich_file_with_links(self, frameio_file: FrameIOFile) -> FrameIOFile:
        """
        Enrichir un objet FrameIOFile avec ses liens de review et partage
        
        Args:
            frameio_file: Objet FrameIOFile à enrichir
        
        Returns:
            FrameIOFile: Objet enrichi avec les liens
        """
        try:
            # Récupérer le lien de review
            review_url = await self.get_file_review_link(frameio_file.id, frameio_file.workspace_id)
            if review_url:
                frameio_file.review_url = review_url
            
            # Récupérer le lien de partage (optionnel)
            share_url = await self.get_file_share_link(frameio_file.id, frameio_file.workspace_id)
            if share_url:
                frameio_file.share_url = share_url
            
            return frameio_file
            
        except Exception as e:
            logger.error(f"❌ Erreur enrichissement fichier {frameio_file.id}: {e}")
            return frameio_file

    async def upload_file_production(self, file_path: str, shot_name: str = None, 
                                    scene_name: str = None, thumbnail_path: str = None) -> Optional[str]:
        """
        Upload de production d'un fichier vers Frame.io (version Cloudflare remote_upload).
        
        Args:
            file_path: Chemin du fichier à uploader
            shot_name: Nom du plan
            scene_name: Nom de la scène
            thumbnail_path: Chemin de la miniature (optionnel)
            
        Returns:
            str: URL de review Frame.io ou None si échec
        """
        try:
            file_path = Path(file_path)
            if not file_path.exists():
                logger.error(f"❌ Fichier non trouvé: {file_path}")
                return None
            
            # VALIDATION STRICTE DE LA NOMENCLATURE - SÉCURITÉ CRITIQUE
            try:
                nomenclature_info = validate_strict_nomenclature(str(file_path))
                logger.info(f"🔒 Validation nomenclature réussie: {nomenclature_info['filename']}")
            except NomenclatureValidationError as e:
                logger.error(f"🚫 UPLOAD PRODUCTION REFUSÉ - Nomenclature invalide: {e}")
                return None
            
            # Utiliser les informations validées
            if not shot_name:
                shot_name = nomenclature_info['shot_id']
            if not scene_name:
                scene_name = nomenclature_info['scene_name']

            file_size = file_path.stat().st_size
            logger.info(f"🎬 Upload Frame.io PRODUCTION (remote_upload): {file_path.name}")
            logger.info(f"   📊 Taille: {file_size / (1024*1024):.1f} MB")
            logger.info(f"   🎯 Plan: {shot_name} - Scène: {scene_name}")
            
            # Vérifier l'auth
            if not self.access_token and not self.auth:
                logger.error("❌ Pas d'authentification Frame.io disponible")
                return None
            
            # Obtenir le token d'accès
            access_token = self.access_token
            if self.auth and not access_token:
                access_token = await self.auth.get_valid_token()
                if not access_token:
                    logger.error("❌ Impossible d'obtenir un token Frame.io valide")
                    return None
            
            # Déterminer les dossiers de destination
            if self.config:
                project_id = self.config.get('frameio.project_id')
            else:
                project_id = os.getenv('FRAMEIO_PROJECT_ID')
            
            if not project_id:
                logger.error("❌ Project ID Frame.io manquant")
                return None
            
            # Créer les dossiers si nécessaire
            target_folder_id = await self._ensure_folder_structure(
                project_id, scene_name, shot_name, access_token
            )
            
            if not target_folder_id:
                logger.error("❌ Impossible de créer la structure de dossiers")
                return None
            
            # 1. S'assurer que Cloudflare ou le serveur public est prêt
            self._ensure_cloudflare_or_public_server()
            public_url = None
            try:
                if self.public_server:
                    # Ajouter le fichier au serveur public
                    local_url = self.public_server.add_file(str(file_path))
                    if local_url:
                        # Si on a un tunnel Cloudflare, construire l'URL publique
                        if hasattr(self, '_cloudflare_manager') and self._cloudflare_manager and self._cloudflare_manager.tunnel_url:
                            # Extraire le nom du fichier de l'URL locale
                            local_filename = local_url.split('/')[-1]
                            public_url = f"{self._cloudflare_manager.tunnel_url}/{local_filename}"
                            logger.info(f"🌐 Fichier exposé via Cloudflare: {public_url}")
                        else:
                            # Sinon, utiliser l'URL locale (pour tests)
                            public_url = local_url
                            logger.info(f"🌐 Fichier exposé via serveur public local: {public_url}")
                    else:
                        logger.error("❌ Impossible d'ajouter le fichier au serveur public")
                        return None
                else:
                    logger.error("❌ Aucun serveur public disponible pour exposer le fichier.")
                    return None
            except Exception as e:
                logger.error(f"❌ Erreur exposition fichier: {e}")
                return None
            if not public_url:
                logger.error("❌ Impossible d'obtenir une URL publique pour le fichier.")
                return None
            
            # 2. Créer le fichier Frame.io via remote_upload
            frameio_file = await self._create_file_remote_upload(str(file_path), target_folder_id, public_url)
            if not frameio_file:
                logger.error("❌ remote_upload Frame.io échoué")
                return None
            
            # 3. Attendre le traitement
            logger.info(f"⏳ Attente du traitement du fichier {frameio_file.id}...")
            processing_success = await self._wait_for_processing(frameio_file.id)
            
            if not processing_success:
                logger.error(f"❌ Traitement échoué pour {frameio_file.id} - Arrêt de l'upload")
                return None
            
            # 4. Récupérer le lien de review
            review_url = None
            
            # Priorité 1: Utiliser le view_url déjà disponible depuis remote_upload
            if frameio_file.review_url:
                review_url = frameio_file.review_url
                logger.info(f"✅ View URL récupéré depuis remote_upload: {review_url}")
            else:
                # Priorité 2: Récupérer via l'API
                review_url = await self.get_file_review_link(frameio_file.id, frameio_file.workspace_id)
                if review_url:
                    logger.info(f"✅ View URL récupéré via API: {review_url}")
            
            if review_url:
                logger.info(f"✅ Upload Frame.io réussi (remote_upload): {review_url}")
                return review_url
            else:
                logger.error(f"❌ Impossible de générer le lien de review pour {frameio_file.id}")
                return None
        except Exception as e:
            logger.error(f"❌ Erreur upload Frame.io (remote_upload): {e}")
            return None
    
    async def _ensure_folder_structure(self, project_id: str, scene_name: str, 
                                     shot_name: str, access_token: str) -> Optional[str]:
        """
        Assure que la structure de dossiers existe sur Frame.io.
        Crée la structure complète : Project Root > Scenes > {scene_name} > {shot_name}
        
        Returns:
            str: ID du dossier de destination (shot folder) ou None
        """
        try:
            # Récupérer le root_folder_id du projet
            project_response = await self._make_authenticated_request(
                "GET", f"{self.base_url}/accounts/{self.account_id}/projects/{project_id}"
            )
            if project_response.status_code != 200:
                logger.error(f"❌ Impossible d'accéder au projet {project_id}: {project_response.status_code}")
                return None
            project_data = project_response.json()
            root_folder_id = project_data.get('data', {}).get('root_folder_id')
            
            if not root_folder_id:
                logger.error(f"❌ Aucun root_folder_id trouvé pour le projet {project_id}")
                return None
            
            logger.info(f"📁 Dossier racine Frame.io: {root_folder_id}")
            
            # Utiliser le structure_manager pour créer la structure complète
            if self.structure_manager:
                try:
                    # Créer ou trouver le dossier de la scène
                    scene_folder = await self.structure_manager.find_or_create_scene_folder(
                        scene_name, root_folder_id, project_id, self.workspace_id
                    )
                    
                    if not scene_folder:
                        logger.error(f"❌ Impossible de créer/trouver le dossier pour la scène: {scene_name}")
                        return root_folder_id  # Fallback vers le dossier racine
                    
                    logger.info(f"📁 Dossier scène: {scene_folder.name} ({scene_folder.id})")
                    
                    # Créer ou trouver le dossier du shot dans la scène
                    shot_folders = await self.structure_manager.get_folders(
                        scene_folder.id, project_id, self.workspace_id
                    )
                    
                    # Chercher le dossier du shot existant
                    shot_folder = None
                    for folder in shot_folders:
                        if folder.name == shot_name:
                            shot_folder = folder
                            break
                    
                    # Créer le dossier du shot s'il n'existe pas
                    if not shot_folder:
                        shot_folder = await self.structure_manager.create_folder(
                            shot_name, scene_folder.id, project_id, self.workspace_id
                        )
                        if shot_folder:
                            logger.info(f"📁 Dossier shot créé: {shot_name} ({shot_folder.id})")
                        else:
                            logger.warning(f"⚠️ Impossible de créer le dossier shot: {shot_name}")
                            return scene_folder.id  # Fallback vers le dossier de la scène
                    else:
                        logger.info(f"📁 Dossier shot existant: {shot_name} ({shot_folder.id})")
                    
                    return shot_folder.id
                    
                except Exception as e:
                    logger.error(f"❌ Erreur avec structure_manager: {e}")
                    logger.info(f"📁 Fallback vers le dossier racine: {root_folder_id}")
                    return root_folder_id
            else:
                logger.warning("⚠️ Structure manager non disponible, utilisation du dossier racine")
                return root_folder_id
            
        except Exception as e:
            logger.error(f"❌ Erreur création structure dossiers: {e}")
            return None
    
    def _test_local_server_connectivity(self, local_url: str) -> bool:
        """
        Teste la connectivité du serveur local.
        
        Args:
            local_url: URL locale à tester
            
        Returns:
            True si le serveur répond correctement
        """
        try:
            logger.debug(f"Test connectivité serveur local: {local_url}")
            
            response = requests.get(local_url, timeout=5)
            success = response.status_code == 200
            
            logger.debug(f"Test connectivité serveur local: {response.status_code} - {'✅ OK' if success else '❌ KO'}")
            
            if success:
                # Vérifier que le contenu est bien servi
                content_length = len(response.content)
                logger.debug(f"Contenu servi: {content_length} bytes")
                return content_length > 0
            
            return False
            
        except Exception as e:
            logger.debug(f"Test connectivité serveur local échoué: {e}")
            return False
    
    def _test_public_url_connectivity(self, public_url: str) -> bool:
        """
        Teste la connectivité avec l'URL publique du fichier.
        
        Args:
            public_url: URL publique à tester
            
        Returns:
            True si l'URL répond correctement
        """
        try:
            import requests
            
            logger.debug(f"Test connectivité URL publique: {public_url}")
            
            response = requests.get(public_url, timeout=10)
            success = response.status_code == 200
            
            logger.debug(f"Test connectivité URL publique: {response.status_code} - {'✅ OK' if success else '❌ KO'}")
            
            if success:
                # Vérifier que le contenu est bien servi
                content_length = len(response.content)
                logger.debug(f"Contenu servi via URL publique: {content_length} bytes")
                return content_length > 0
            
            return False
            
        except Exception as e:
            logger.debug(f"Test connectivité URL publique échoué: {e}")
            return False
    
    def _ensure_cloudflare_or_public_server(self):
        """
        Initialise et démarre Cloudflare ou le serveur public si nécessaire.
        """
        # D'abord, s'assurer qu'on a un serveur public pour servir les fichiers
        if self.public_server is None:
            try:
                self.public_server = RangeFileServer()
                self.public_server.start()
                logger.info("🚀 Serveur public (Range) démarré automatiquement.")
            except Exception as e:
                logger.warning(f"⚠️ Impossible de démarrer le serveur public automatiquement: {e}")
                self.public_server = None
                return
        
        # Si on a un serveur public, essayer de démarrer le tunnel Cloudflare
        if self.public_server and self.public_server.actual_port:
            if not hasattr(self, '_cloudflare_manager') or self._cloudflare_manager is None:
                try:
                    self._cloudflare_manager = CloudflareManager()
                    tunnel_url = self._cloudflare_manager.start_tunnel(self.public_server.actual_port)
                    if tunnel_url:
                        logger.info(f"🚀 Tunnel Cloudflare démarré automatiquement: {tunnel_url}")
                    else:
                        logger.warning("⚠️ Impossible de démarrer le tunnel Cloudflare, utilisation du serveur public local")
                        self._cloudflare_manager = None
                except Exception as e:
                    logger.warning(f"⚠️ Impossible de démarrer Cloudflare automatiquement: {e}")
                    self._cloudflare_manager = None

    def _get_headers(self) -> Dict[str, str]:
        """
        Récupère les headers d'authentification pour les requêtes Frame.io.
        
        Returns:
            Dict: Headers avec token d'authentification
        """
        headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'RL-PostFlow/4.1.1'
        }
        
        # Ajouter le token d'authentification
        if self.access_token:
            headers['Authorization'] = f'Bearer {self.access_token}'
        elif self.auth and hasattr(self.auth, 'access_token') and self.auth.access_token:
            headers['Authorization'] = f'Bearer {self.auth.access_token}'
        else:
            logger.warning("⚠️ Pas de token d'authentification disponible")
        
        return headers
    
    def request_shutdown(self):
        """
        Demande l'arrêt gracieux de toutes les opérations en cours (polling, upload, etc.)
        """
        logger.info("🛑 Demande d'arrêt gracieux des opérations Frame.io en cours...")
        self._shutdown_event.set()
    
    def reset_shutdown(self):
        """
        Réinitialise l'événement d'arrêt pour permettre de nouvelles opérations
        """
        self._shutdown_event.clear()
        logger.info("🔄 Événement d'arrêt réinitialisé")
    
    @property
    def is_shutdown_requested(self) -> bool:
        """
        Vérifie si un arrêt a été demandé
        """
        return self._shutdown_event.is_set()
