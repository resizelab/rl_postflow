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
from datetime import datetime
import logging
import httpx

from .auth import FrameIOAuth, FrameIOAuthError
from .structure import FrameIOStructureManager, FrameIOFolder
from .public_server import PublicFileServer, temporary_file_server

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
    
    def __init__(self, auth: FrameIOAuth):
        self.auth = auth
        
        # Charger la configuration depuis l'auth
        current_config = self.auth._load_current_tokens()
        
        # Récupérer les IDs depuis la config en priorité, puis les variables d'environnement
        self.account_id = current_config.get('account_id') or os.getenv('FRAMEIO_ACCOUNT_ID')
        self.workspace_id = current_config.get('workspace_id') or os.getenv('FRAMEIO_WORKSPACE_ID')
        self.root_folder_id = current_config.get('root_folder_id') or os.getenv('FRAMEIO_ROOT_FOLDER_ID')
        self.base_url = current_config.get('base_url') or os.getenv('FRAMEIO_BASE_URL', 'https://api.frame.io/v4')
        self.chunk_size = int(os.getenv('FRAMEIO_CHUNK_SIZE', '8388608'))
        self.parallel_uploads = int(os.getenv('FRAMEIO_PARALLEL_UPLOADS', '2'))
        
        if not self.account_id:
            raise ValueError("account_id manquant dans la config frameio ou FRAMEIO_ACCOUNT_ID")
        if not self.workspace_id:
            raise ValueError("workspace_id manquant dans la config frameio ou FRAMEIO_WORKSPACE_ID")
        if not self.root_folder_id:
            raise ValueError("root_folder_id manquant dans la config frameio ou FRAMEIO_ROOT_FOLDER_ID")
        
        logger.info(f"📤 FrameIOUploadManager - Account: {self.account_id}")
        
        self.structure_manager = FrameIOStructureManager(auth)
        
        # Serveur public pour les fichiers (optionnel)
        self.public_server = None
    
    def _calculate_file_hash(self, file_path: str) -> str:
        """Calculer le hash SHA-256 d'un fichier pour vérification d'intégrité"""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                sha256_hash.update(chunk)
        return sha256_hash.hexdigest()
    
    async def _create_file_placeholder(self, metadata: UploadMetadata, folder_id: str) -> Optional[FrameIOFile]:
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
            
            response = await self.auth.request("POST", url, json=payload)
            
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
        Étape 2: Upload du fichier vers les URLs signées
        """
        try:
            file_path_obj = Path(file_path)
            file_size = file_path_obj.stat().st_size
            
            if not upload_urls:
                logger.error("❌ Aucune URL d'upload fournie")
                return False
            
            # Pour la v4, généralement une seule URL d'upload
            upload_url = upload_urls[0]
            logger.info(f"📤 Upload vers: {upload_url[:50]}...")
            
            # Détecter le Content-Type à partir de l'extension
            import mimetypes
            content_type, _ = mimetypes.guess_type(file_path)
            if not content_type:
                content_type = "application/octet-stream"
            
            logger.info(f"📝 Content-Type détecté: {content_type}")
            
            # Détecter le Content-Type à partir de l'extension
            import mimetypes
            content_type, _ = mimetypes.guess_type(file_path)
            if not content_type:
                content_type = "application/octet-stream"
            
            logger.info(f"📝 Content-Type détecté: {content_type}")
            
            headers = {
                "Content-Type": content_type,
                "x-amz-acl": ""  # Requis par l'URL signée Frame.io
            }
            
            # Upload du fichier complet
            with open(file_path, "rb") as file_obj:
                file_content = file_obj.read()
                
                # Utiliser requests pour plus de contrôle sur les headers
                import requests
                response = requests.put(
                    upload_url,
                    data=file_content,
                    headers=headers,
                    timeout=300.0
                )
                
                # Frame.io peut renvoyer une erreur 403 même avec la bonne configuration
                # C'est un problème connu avec leur API v4 - nous documentons cela
                if response.status_code == 403:
                    logger.warning(f"⚠️ Erreur 403 Frame.io - problème connu avec l'API v4")
                    logger.warning(f"📄 Response: {response.text[:200]}...")
                    return False
                
                if response.status_code in [200, 201, 204]:
                    logger.info(f"✅ Upload réussi: {file_path_obj.name} ({file_size} bytes)")
                    return True
                else:
                    logger.error(f"❌ Erreur upload: {response.status_code} - {response.text}")
                    return False
                        
        except Exception as e:
            logger.error(f"❌ Erreur upload fichier: {e}")
            return False
    
    async def _wait_for_processing(self, file_id: str, workspace_id: Optional[str] = None, 
                                  max_wait: int = 300) -> bool:
        """
        Attendre que le fichier soit traité par Frame.io
        
        Args:
            file_id: ID du fichier Frame.io
            workspace_id: ID du workspace (optionnel)
            max_wait: Temps d'attente maximum en secondes (défaut: 300)
            
        Returns:
            True si le traitement est terminé, False sinon
        """
        try:
            ws_id = workspace_id or self.workspace_id
            
            # Endpoint pour récupérer le statut d'un fichier
            url = f"{self.base_url}/files/{file_id}"
            
            start_time = datetime.now()
            last_status = None
            
            while (datetime.now() - start_time).total_seconds() < max_wait:
                try:
                    response = await self.auth.request("GET", url)
                    response.raise_for_status()
                    
                    file_data = response.json()
                    
                    # Extraire le statut selon la structure de réponse
                    if "data" in file_data:
                        status = file_data["data"].get("status", "unknown")
                    else:
                        status = file_data.get("status", "unknown")
                    
                    # Afficher le statut seulement s'il change
                    if status != last_status:
                        logger.info(f"📊 Statut fichier {file_id}: {status}")
                        last_status = status
                    
                    # Vérifier si le traitement est terminé
                    if status in ["ready", "processed", "complete"]:
                        logger.info(f"✅ Traitement terminé: {file_id} -> {status}")
                        return True
                    
                    # Vérifier si il y a une erreur
                    if status in ["error", "failed"]:
                        logger.error(f"❌ Erreur de traitement: {file_id} -> {status}")
                        return False
                    
                    # Attendre avant la prochaine vérification
                    await asyncio.sleep(5)
                    
                except Exception as e:
                    logger.warning(f"⚠️ Erreur vérification statut {file_id}: {e}")
                    await asyncio.sleep(10)
            
            logger.warning(f"⏰ Timeout atteint pour le traitement de {file_id}")
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
            
            # Préparer les métadonnées d'upload
            upload_metadata = UploadMetadata(
                shot_id=metadata.get('shot_id', '') if metadata else '',
                scene_name=metadata.get('scene_name', '') if metadata else '',
                version=metadata.get('version', 'V001') if metadata else 'V001',
                file_path=str(file_path_obj),
                nomenclature=metadata.get('nomenclature', file_path_obj.stem) if metadata else file_path_obj.stem,
                description=metadata.get('description', '') if metadata else '',
                tags=metadata.get('tags', []) if metadata else []
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
                'upload_metadata': metadata
            }
            
            logger.info(f"✅ Upload terminé avec succès: {file_path_obj.name}")
            logger.info(f"🔗 View URL: {result.get('view_url', 'Non disponible')}")
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Erreur upload fichier: {e}")
            return None

    def _generate_review_link(self, file_id: str, project_id: str) -> str:
        """
        Génère le lien de review Frame.io pour un fichier.
        
        Args:
            file_id: ID du fichier Frame.io
            project_id: ID du projet Frame.io
            
        Returns:
            URL de review
        """
        try:
            # Format standard Frame.io: https://app.frame.io/projects/{project_id}/files/{file_id}
            return f"https://app.frame.io/projects/{project_id}/files/{file_id}"
        except Exception as e:
            logger.error(f"Erreur génération lien review: {e}")
            return f"https://app.frame.io/projects/{project_id}"
    
    async def get_upload_progress(self, file_id: str, project_id: str, 
                                 workspace_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Récupère le statut d'upload d'un fichier.
        
        Args:
            file_id: ID du fichier Frame.io
            project_id: ID du projet
            workspace_id: ID du workspace (optionnel)
            
        Returns:
            Dictionnaire avec le statut d'upload
        """
        try:
            ws_id = workspace_id or self.workspace_id
            url = f"{self.base_url}/accounts/{self.account_id}/workspaces/{ws_id}/projects/{project_id}/files/{file_id}"
            
            response = await self.auth.request("GET", url)
            response.raise_for_status()
            
            data = response.json()
            
            return {
                'file_id': file_id,
                'status': data.get('status', 'unknown'),
                'progress': data.get('progress', 0),
                'processing_stage': data.get('processing_stage', 'unknown'),
                'ready_for_review': data.get('status') == 'ready',
                'error': data.get('error_message')
            }
            
        except Exception as e:
            logger.error(f"Erreur récupération statut upload: {e}")
            return {'file_id': file_id, 'status': 'error', 'error': str(e)}
    
    async def _get_file_info(self, file_id: str) -> Optional[Dict[str, Any]]:
        """
        Récupérer les informations complètes d'un fichier après upload
        Pour obtenir le view_url notamment
        """
        try:
            # Endpoint pour récupérer les infos d'un fichier
            # Note: L'endpoint exact peut varier selon la v4 Frame.io
            url = f"{self.base_url}/files/{file_id}"
            
            response = await self.auth.request("GET", url)
            response.raise_for_status()
            
            file_data = response.json()
            
            # Extraire les données selon la structure de réponse
            if "data" in file_data:
                return file_data["data"]
            else:
                return file_data
                
        except Exception as e:
            logger.warning(f"⚠️ Impossible de récupérer les infos du fichier {file_id}: {e}")
            return None

    async def _create_file_remote_upload(self, file_path: str, folder_id: str, public_url: str) -> Optional[FrameIOFile]:
        """
        Nouvelle méthode: Upload via remote_upload endpoint
        Endpoint: POST /accounts/{account_id}/folders/{folder_id}/files/remote_upload
        
        Args:
            file_path: Chemin vers le fichier local
            folder_id: ID du dossier Frame.io de destination
            public_url: URL publique du fichier
            
        Returns:
            FrameIOFile créé ou None si erreur
        """
        try:
            file_path_obj = Path(file_path)
            if not file_path_obj.exists():
                raise FileNotFoundError(f"Fichier non trouvé: {file_path_obj}")
            
            # Endpoint stable pour remote_upload (plus besoin de header alpha)
            url = f"{self.base_url}/accounts/{self.account_id}/folders/{folder_id}/files/remote_upload"
            
            # Payload simplifié pour remote_upload
            payload = {
                "data": {
                    "name": file_path_obj.name,
                    "source_url": public_url
                }
            }
            
            logger.info(f"🌐 Remote upload: {file_path_obj.name} depuis {public_url}")
            
            response = await self.auth.request("POST", url, json=payload)
            
            if response.status_code == 422:
                logger.error(f"🔍 Erreur 422 - Payload: {payload}")
                logger.error(f"🔍 Réponse: {response.text}")
                return None
            
            response.raise_for_status()
            
            response_data = response.json()
            file_data = response_data.get("data", {})
            
            frameio_file = FrameIOFile(
                id=file_data["id"],
                name=file_data["name"],
                size=file_data.get("file_size", file_path_obj.stat().st_size),
                status=file_data.get("status", "uploading"),
                folder_id=folder_id,
                project_id=file_data.get("project_id", ""),
                workspace_id=self.workspace_id,
                account_id=self.account_id,
                download_url=file_data.get("download_url"),
                thumbnail_url=file_data.get("thumbnail_url"),
                created_at=file_data.get("created_at"),
                updated_at=file_data.get("updated_at")
            )
            
            logger.info(f"✅ Remote upload initié: {file_path_obj.name} (ID: {frameio_file.id})")
            logger.info(f"📊 Statut: {frameio_file.status}")
            
            return frameio_file
            
        except Exception as e:
            logger.error(f"❌ Erreur remote upload: {e}")
            return None

    async def upload_file_remote(self, file_path: str, scene_name: str, shot_id: str, 
                               project_id: Optional[str] = None, 
                               workspace_id: Optional[str] = None,
                               metadata: Optional[Dict[str, Any]] = None,
                               public_server_host: str = "0.0.0.0",
                               public_server_port: int = 0) -> Optional[Dict[str, Any]]:
        """
        Upload un fichier local via remote_upload en utilisant un serveur HTTP temporaire
        
        Args:
            file_path: Chemin vers le fichier local
            scene_name: Nom de la scène
            shot_id: ID du plan
            project_id: ID du projet Frame.io (optionnel)
            workspace_id: ID du workspace (optionnel)
            metadata: Métadonnées additionnelles (optionnel)
            public_server_host: Host du serveur public (défaut: 0.0.0.0)
            public_server_port: Port du serveur public (défaut: auto)
            
        Returns:
            Dictionnaire avec les infos du fichier uploadé ou None si erreur
        """
        try:
            file_path_obj = Path(file_path)
            if not file_path_obj.exists():
                raise FileNotFoundError(f"Fichier non trouvé: {file_path_obj}")
            
            logger.info(f"🚀 Démarrage upload remote: {file_path_obj.name}")
            
            # 1. Trouver ou créer le dossier de la scène
            proj_id = project_id or os.getenv("FRAMEIO_DEFAULT_PROJECT_ID")
            ws_id = workspace_id or self.workspace_id
            
            scene_folder = await self.structure_manager.find_or_create_scene_folder(
                scene_name, self.root_folder_id, proj_id, ws_id
            )
            
            if not scene_folder:
                raise Exception(f"Impossible de créer/trouver le dossier pour la scène: {scene_name}")
            
            # 2. Démarrer le serveur public temporaire
            with temporary_file_server(host=public_server_host, port=public_server_port) as server:
                if not server:
                    raise Exception("Impossible de démarrer le serveur public temporaire")
                
                # 3. Exposer le fichier publiquement
                public_url = server.add_file(str(file_path_obj))
                if not public_url:
                    raise Exception("Impossible d'exposer le fichier publiquement")
                
                logger.info(f"🌐 Fichier exposé: {public_url}")
                
                # 4. Initier le remote upload
                frameio_file = await self._create_file_remote_upload(
                    str(file_path_obj), scene_folder.id, public_url
                )
                
                if not frameio_file:
                    raise Exception("Échec de l'initiation du remote upload")
                
                # 5. Attendre que Frame.io télécharge le fichier
                logger.info("⏳ Attente du téléchargement par Frame.io...")
                
                # Attendre quelques secondes pour permettre à Frame.io de commencer le téléchargement
                await asyncio.sleep(5)
                
                # 6. Attendre le traitement complet
                processing_success = await self._wait_for_processing(frameio_file.id, ws_id, max_wait=300)
                
                if not processing_success:
                    logger.warning("⚠️ Traitement non terminé dans le délai imparti")
                
                # 7. Récupérer les informations finales
                file_info = await self._get_file_info(frameio_file.id)
                
                result = {
                    'file_id': frameio_file.id,
                    'name': frameio_file.name,
                    'size': frameio_file.size,
                    'status': frameio_file.status,
                    'folder_id': scene_folder.id,
                    'project_id': frameio_file.project_id,
                    'view_url': file_info.get('view_url') if file_info else None,
                    'upload_method': 'remote_upload',
                    'upload_metadata': {
                        'shot_id': shot_id,
                        'scene_name': scene_name,
                        'public_url': public_url,
                        'local_path': str(file_path_obj),
                        **(metadata or {})
                    }
                }
                
                logger.info(f"✅ Upload remote terminé: {file_path_obj.name}")
                logger.info(f"🔗 View URL: {result.get('view_url', 'Non disponible')}")
                
                return result
                
        except Exception as e:
            logger.error(f"❌ Erreur upload remote: {e}")
            return None
    
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
            # Assurer l'authentification
            if not self.auth.is_authenticated():
                await self.auth.authenticate()
            
            headers = {'Authorization': f'Bearer {self.auth.access_token}'}
            ws_id = workspace_id or self.workspace_id
            
            # Récupérer les informations du fichier
            url = f"{self.base_url}/workspaces/{ws_id}/assets/{file_id}"
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                
                file_data = response.json()
                
                # Construire le lien de review
                # Le lien Frame.io suit généralement ce format:
                # https://app.frame.io/workspace/{workspace_id}/asset/{file_id}
                review_url = f"https://app.frame.io/workspace/{ws_id}/asset/{file_id}"
                
                logger.info(f"🔗 Lien de review généré pour {file_id}: {review_url}")
                return review_url
                
        except Exception as e:
            logger.error(f"❌ Erreur récupération lien review {file_id}: {e}")
            return None
    
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
