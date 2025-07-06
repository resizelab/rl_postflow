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
import httpx

from .oauth_auth import FrameIOOAuthAuth
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
    
    def __init__(self, auth: FrameIOOAuthAuth):
        self.auth = auth
        
        # Récupérer les IDs depuis la config en priorité, puis les variables d'environnement
        config = getattr(auth, 'config', {})
        frameio_config = config.get('frameio', {})
        self.account_id = frameio_config.get('account_id') or os.getenv('FRAMEIO_ACCOUNT_ID')
        self.workspace_id = frameio_config.get('workspace_id') or os.getenv('FRAMEIO_WORKSPACE_ID')
        self.base_url = frameio_config.get('base_url') or os.getenv('FRAMEIO_BASE_URL', 'https://api.frame.io/v4')
        self.chunk_size = int(os.getenv('FRAMEIO_CHUNK_SIZE', '8388608'))
        self.parallel_uploads = int(os.getenv('FRAMEIO_PARALLEL_UPLOADS', '2'))
        
        if not self.account_id:
            raise ValueError("account_id manquant dans la config frameio ou FRAMEIO_ACCOUNT_ID")
        if not self.workspace_id:
            raise ValueError("workspace_id manquant dans la config frameio ou FRAMEIO_WORKSPACE_ID")
        
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
            
            response = await self.auth._request_with_retry("POST", url, json=payload)
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
    
    async def remote_upload_file(self, shot_id: str, file_path: str, scene_name: str,
                                project_id: Optional[str] = None, workspace_id: Optional[str] = None,
                                metadata: Optional[Dict[str, Any]] = None,
                                public_url: Optional[str] = None) -> Optional[FrameIOFile]:
        """
        Upload d'un fichier via remote_upload (URL publique) pour éviter les problèmes S3
        
        Args:
            shot_id: ID du plan (ex: "UNDLM_00412")
            file_path: Chemin vers le fichier à uploader
            scene_name: Nom de la scène (ex: "DOUANE MER - JOUR")
            project_id: ID du projet Frame.io (optionnel)
            workspace_id: ID du workspace (optionnel) 
            metadata: Métadonnées additionnelles (optionnel)
            public_url: URL publique du fichier si déjà disponible (optionnel)
        
        Returns:
            FrameIOFile si succès, None sinon
        """
        try:
            file_path_obj = Path(file_path)
            if not file_path_obj.exists():
                raise FileNotFoundError(f"Fichier non trouvé: {file_path}")
            
            # Extraire version depuis le nom du fichier
            filename = file_path_obj.name
            version = "v001"  # Par défaut
            if "_v" in filename:
                try:
                    version_part = filename.split("_v")[1].split(".")[0]
                    if version_part.isdigit():
                        version = f"v{int(version_part):03d}"
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
            
            logger.info(f"Remote upload de {filename} vers la scène {scene_name}")
            
            # 2. Si pas d'URL publique fournie, en créer une temporaire
            if not public_url:
                public_url = await self._create_temporary_public_url(file_path)
                if not public_url:
                    logger.warning("Impossible de créer une URL publique, fallback vers upload local")
                    return await self.upload_file(shot_id, file_path, scene_name, 
                                                 project_id, workspace_id, metadata)
            
            # 3. Utiliser le remote_upload endpoint
            frameio_file = await self._remote_upload_from_url(
                filename, public_url, scene_folder.id, workspace_id
            )
            
            if not frameio_file:
                raise Exception("Échec du remote upload")
            
            # 4. Attendre le traitement (optionnel, le remote_upload peut prendre du temps)
            logger.info(f"Remote upload initié: {shot_id} - {filename} (statut: {frameio_file.status})")
            
            # Attendre quelques secondes puis vérifier le statut
            await asyncio.sleep(5)
            final_status = await self._check_file_status(frameio_file.id, workspace_id)
            
            if final_status:
                frameio_file.status = final_status
                logger.info(f"Statut final du fichier: {final_status}")
            
            return frameio_file
            
        except Exception as e:
            logger.error(f"Erreur remote upload fichier {shot_id}: {e}")
            return None
    
    async def _create_temporary_public_url(self, file_path: str) -> Optional[str]:
        """
        Crée une URL publique temporaire pour le fichier local
        
        Note: Cette méthode devrait idéalement utiliser un service cloud (S3, etc.)
        Pour l'instant, retourne None pour forcer l'utilisation d'une URL externe
        """
        # TODO: Implémenter un upload temporaire vers un service cloud
        # En attendant, on peut utiliser un serveur local ou un service tiers
        logger.warning("Création d'URL publique temporaire non implémentée")
        return None
    
    async def _remote_upload_from_url(self, filename: str, source_url: str, 
                                     folder_id: str, workspace_id: str) -> Optional[FrameIOFile]:
        """
        Utilise l'endpoint /files/remote_upload pour uploader depuis une URL
        """
        try:
            # Préparer le payload pour remote_upload
            payload = {
                "data": {
                    "name": filename,
                    "source_url": source_url
                }
            }
            
            # Ajouter le folder_id si fourni
            if folder_id:
                payload["data"]["folder_id"] = folder_id
            
            # Faire la requête
            headers = await self.auth.get_headers()
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/files/remote_upload",
                    json=payload,
                    headers=headers,
                    timeout=30.0
                )
                
                if response.status_code == 201:
                    file_data = response.json().get("data", {})
                    
                    # Créer l'objet FrameIOFile
                    frameio_file = FrameIOFile(
                        id=file_data.get("id"),
                        name=file_data.get("attributes", {}).get("name"),
                        size=file_data.get("attributes", {}).get("file_size", 0),
                        status=file_data.get("attributes", {}).get("status", "uploading"),
                        folder_id=folder_id,
                        project_id=file_data.get("attributes", {}).get("project_id"),
                        workspace_id=workspace_id,
                        account_id=file_data.get("attributes", {}).get("account_id"),
                        created_at=file_data.get("attributes", {}).get("created_at"),
                        updated_at=file_data.get("attributes", {}).get("updated_at")
                    )
                    
                    logger.info(f"Remote upload initié avec succès: {filename} (id: {frameio_file.id})")
                    return frameio_file
                else:
                    logger.error(f"Échec remote upload: {response.status_code} - {response.text}")
                    return None
                    
        except Exception as e:
            logger.error(f"Erreur lors du remote upload: {e}")
            return None
    
    async def _check_file_status(self, file_id: str, workspace_id: str) -> Optional[str]:
        """
        Vérifie le statut d'un fichier dans Frame.io
        """
        try:
            headers = await self.auth.get_headers()
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/files/{file_id}",
                    headers=headers,
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    file_data = response.json().get("data", {})
                    status = file_data.get("attributes", {}).get("status")
                    logger.info(f"Statut du fichier {file_id}: {status}")
                    return status
                else:
                    logger.error(f"Erreur vérification statut: {response.status_code}")
                    return None
                    
        except Exception as e:
            logger.error(f"Erreur lors de la vérification du statut: {e}")
            return None
