"""
Frame.io API v4 Upload Module
Gestion de l'upload de fichiers avec la séquence v4 recommandée
"""

import os
import asyncio
import hashlib
from typing import List, Dict, Optional, Any, Union
from dataclasses import dataclass
from pathlib import Path
import logging

from .auth import FrameIOAuth
from .structure import FrameIOStructureManager, FrameIOFolder

logger = logging.getLogger(__name__)

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
    
    def __init__(self, auth: FrameIOAuth):
        self.auth = auth
        self.account_id = os.getenv('FRAMEIO_ACCOUNT_ID')
        self.workspace_id = os.getenv('FRAMEIO_WORKSPACE_ID')
        self.base_url = os.getenv('FRAMEIO_BASE_URL', 'https://api.frame.io/v4')
        self.chunk_size = int(os.getenv('FRAMEIO_CHUNK_SIZE', '8388608'))
        self.parallel_uploads = int(os.getenv('FRAMEIO_PARALLEL_UPLOADS', '2'))
        
        if not self.account_id or not self.workspace_id:
            raise ValueError("FRAMEIO_ACCOUNT_ID et FRAMEIO_WORKSPACE_ID sont requis")
        
        self.structure_manager = FrameIOStructureManager(auth)
    
    def _calculate_file_hash(self, file_path: str) -> str:
        """Calculer le hash SHA-256 d'un fichier pour vérification d'intégrité"""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                sha256_hash.update(chunk)
        return sha256_hash.hexdigest()
    
    async def _create_file_placeholder(self, metadata: UploadMetadata, folder_id: str,
                                     project_id: str, workspace_id: Optional[str] = None) -> Optional[FrameIOFile]:
        """
        Étape 1: Créer un fichier vide pour obtenir les upload_urls
        Endpoint: /accounts/{account_id}/workspaces/{workspace_id}/projects/{project_id}/folders/{folder_id}/files
        """
        try:
            file_path = Path(metadata.file_path)
            if not file_path.exists():
                raise FileNotFoundError(f"Fichier non trouvé: {file_path}")
            
            file_size = file_path.stat().st_size
            file_hash = self._calculate_file_hash(str(file_path))
            
            ws_id = workspace_id or self.workspace_id
            
            # Construire l'URL selon l'arborescence v4 stricte
            url = f"{self.base_url}/accounts/{self.account_id}/workspaces/{ws_id}/projects/{project_id}/folders/{folder_id}/files"
            # Nous devons d'abord obtenir le project_id du folder
            project_id = await self._get_project_id_from_folder(folder_id, ws_id)
            if not project_id:
                raise ValueError(f"Impossible de déterminer project_id pour folder {folder_id}")
            
            url = f"{self.config.base_url}/accounts/{self.config.account_id}/workspaces/{ws_id}/projects/{project_id}/folders/{folder_id}/files"
            
            # Préparer le payload
            payload = {
                "name": file_path.name,
                "size": file_size,
                "type": "file",
                "filehash": file_hash
            }
            
            # Ajouter métadonnées optionnelles
            if metadata.description:
                payload["description"] = metadata.description
            
            if metadata.tags:
                payload["tags"] = metadata.tags
            
            response = await self.auth._request_with_retry("POST", url, headers=headers, json=payload)
            file_data = response.json()
            
            frameio_file = FrameIOFile(
                id=file_data["id"],
                name=file_data["name"],
                size=file_data["size"],
                status=file_data.get("status", "created"),
                folder_id=folder_id,
                project_id=project_id,
                workspace_id=ws_id,
                account_id=self.config.account_id,
                upload_urls=file_data.get("upload_urls", []),
                download_url=file_data.get("download_url"),
                thumbnail_url=file_data.get("thumbnail_url"),
                created_at=file_data.get("created_at"),
                updated_at=file_data.get("updated_at")
            )
            
            logger.info(f"Fichier placeholder créé: {file_path.name} (ID: {frameio_file.id})")
            return frameio_file
            
        except Exception as e:
            logger.error(f"Erreur création placeholder: {e}")
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
        Étape 2: Upload du fichier vers les URLs signées
        """
        try:
            file_path_obj = Path(file_path)
            file_size = file_path_obj.stat().st_size
            chunk_size = int(os.getenv("FRAMEIO_CHUNK_SIZE", "8388608"))  # 8MB par défaut
            
            if not upload_urls:
                logger.error("Aucune URL d'upload fournie")
                return False
            
            # Pour la v4, généralement une seule URL d'upload
            upload_url = upload_urls[0]
            
            headers = {
                "Content-Type": "application/octet-stream",
                "User-Agent": "RL-PostFlow/1.0"
            }
            
            # Upload du fichier complet
            with open(file_path, "rb") as file_obj:
                file_content = file_obj.read()
                
                response = await self.auth._request_with_retry(
                    "PUT", 
                    upload_url, 
                    headers=headers, 
                    content=file_content
                )
                
                if response.status_code in [200, 201, 204]:
                    logger.info(f"Upload réussi pour {file_path_obj.name}")
                    return True
                else:
                    logger.error(f"Erreur upload: {response.status_code} - {response.text}")
                    return False
            
        except Exception as e:
            logger.error(f"Erreur upload chunks: {e}")
            return False
    
    async def _wait_for_processing(self, file_id: str, workspace_id: Optional[str] = None, 
                                  max_wait: int = 300) -> bool:
        """
        Étape 3: Attendre que le statut passe de 'created' à 'uploaded' puis 'processed'
        """
        try:
            ws_id = workspace_id or self.config.workspace_id
            headers = await self.auth.get_auth_headers()
            
            # Note: L'endpoint exact pour récupérer un fichier spécifique dépend de l'implémentation v4
            # Ici on utilise une approche générique
            project_id = os.getenv("FRAMEIO_DEFAULT_PROJECT_ID")
            url = f"{self.config.base_url}/files/{file_id}"  # Endpoint simplifié
            
            waited = 0
            while waited < max_wait:
                response = await self.auth._request_with_retry("GET", url, headers=headers)
                file_data = response.json()
                
                status = file_data.get("status", "unknown")
                logger.debug(f"Statut fichier {file_id}: {status}")
                
                if status in ["uploaded", "processed", "ready"]:
                    logger.info(f"Fichier {file_id} traité avec succès (statut: {status})")
                    return True
                elif status in ["failed", "error"]:
                    logger.error(f"Erreur traitement fichier {file_id}: {status}")
                    return False
                
                # Attendre avant le prochain check
                await asyncio.sleep(5)
                waited += 5
            
            logger.warning(f"Timeout attente traitement fichier {file_id}")
            return False
            
        except Exception as e:
            logger.error(f"Erreur attente traitement: {e}")
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
                description=metadata.get("description") if metadata else f"Plan {shot_id} - {scene_name}",
                tags=metadata.get("tags") if metadata else [shot_id, scene_name, version]
            )
            
            # 1. Trouver ou créer le dossier de la scène
            proj_id = project_id or os.getenv("FRAMEIO_DEFAULT_PROJECT_ID")
            scene_folder = await self.structure_manager.find_or_create_scene_folder(
                scene_name, proj_id, workspace_id
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
                return frameio_file
            else:
                logger.warning(f"Upload terminé mais traitement en cours: {shot_id}")
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
