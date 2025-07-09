"""
Frame.io API v4 Structure Module
Gestion des workspaces, projets et dossiers selon l'arborescence REST v4
"""

import asyncio
import os
import json
from typing import List, Dict, Optional, Any, Union
from dataclasses import dataclass, asdict
from pathlib import Path
from datetime import datetime, timedelta
import logging
import hashlib
import time

from .auth import FrameIOAuth, FrameIOAuthError

logger = logging.getLogger(__name__)

@dataclass
class FrameIOProject:
    """Représentation d'un projet Frame.io"""
    id: str
    name: str
    workspace_id: str
    account_id: str
    root_folder_id: Optional[str] = None
    description: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

@dataclass
class FrameIOFolder:
    """Représentation d'un dossier Frame.io"""
    id: str
    name: str
    parent_id: Optional[str]
    project_id: str
    workspace_id: str
    account_id: str
    type: str = "folder"
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

@dataclass
class CacheEntry:
    """Entrée de cache avec métadonnées"""
    data: Dict[str, Any]
    timestamp: str
    ttl_seconds: int = 3600  # 1 heure par défaut
    hash_key: str = ""
    
    def is_expired(self) -> bool:
        """Vérifier si l'entrée est expirée"""
        try:
            cache_time = datetime.fromisoformat(self.timestamp)
            return datetime.now() - cache_time > timedelta(seconds=self.ttl_seconds)
        except:
            return True
    
    def to_dict(self) -> Dict[str, Any]:
        """Convertir en dictionnaire pour la sérialisation"""
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'CacheEntry':
        """Créer depuis un dictionnaire"""
        return cls(**data)

class FrameIOStructureCache:
    """Gestionnaire de cache avancé pour la structure Frame.io"""
    
    def __init__(self, cache_file_path: Path):
        self.cache_file_path = cache_file_path
        self.cache_data = {}
        self.load_cache()
    
    def load_cache(self) -> bool:
        """Charger le cache depuis le fichier"""
        try:
            if self.cache_file_path.exists():
                with open(self.cache_file_path, 'r', encoding='utf-8') as f:
                    cache_raw = json.load(f)
                    
                # Convertir en objets CacheEntry
                self.cache_data = {}
                for key, value in cache_raw.items():
                    if isinstance(value, dict) and 'data' in value:
                        self.cache_data[key] = CacheEntry.from_dict(value)
                    else:
                        # Ancien format de cache, convertir
                        self.cache_data[key] = CacheEntry(
                            data=value,
                            timestamp=datetime.now().isoformat()
                        )
                
                logger.info(f"Cache chargé: {len(self.cache_data)} entrées")
                return True
            else:
                logger.info("Aucun fichier de cache trouvé")
                return False
                
        except Exception as e:
            logger.error(f"Erreur chargement cache: {e}")
            self.cache_data = {}
            return False
    
    def save_cache(self) -> bool:
        """Sauvegarder le cache dans le fichier"""
        try:
            # Créer le dossier parent si nécessaire
            self.cache_file_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Convertir en dictionnaire pour la sérialisation
            cache_dict = {}
            for key, entry in self.cache_data.items():
                cache_dict[key] = entry.to_dict()
            
            with open(self.cache_file_path, 'w', encoding='utf-8') as f:
                json.dump(cache_dict, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Cache sauvegardé: {len(self.cache_data)} entrées")
            return True
            
        except Exception as e:
            logger.error(f"Erreur sauvegarde cache: {e}")
            return False
    
    def get(self, key: str, default: Any = None) -> Any:
        """Récupérer une entrée du cache"""
        if key in self.cache_data:
            entry = self.cache_data[key]
            if not entry.is_expired():
                logger.debug(f"Cache hit: {key}")
                return entry.data
            else:
                logger.debug(f"Cache expiré: {key}")
                del self.cache_data[key]
        
        logger.debug(f"Cache miss: {key}")
        return default
    
    def set(self, key: str, data: Any, ttl_seconds: int = 3600) -> bool:
        """Définir une entrée dans le cache"""
        try:
            # Générer un hash pour détecter les changements
            data_str = json.dumps(data, sort_keys=True)
            hash_key = hashlib.md5(data_str.encode()).hexdigest()
            
            self.cache_data[key] = CacheEntry(
                data=data,
                timestamp=datetime.now().isoformat(),
                ttl_seconds=ttl_seconds,
                hash_key=hash_key
            )
            
            logger.debug(f"Cache set: {key} (TTL: {ttl_seconds}s)")
            return True
            
        except Exception as e:
            logger.error(f"Erreur cache set {key}: {e}")
            return False
    
    def invalidate(self, key: str) -> bool:
        """Invalider une entrée du cache"""
        if key in self.cache_data:
            del self.cache_data[key]
            logger.info(f"Cache invalidé: {key}")
            return True
        return False
    
    def invalidate_pattern(self, pattern: str) -> int:
        """Invalider toutes les entrées correspondant à un pattern"""
        count = 0
        keys_to_remove = []
        
        for key in self.cache_data.keys():
            if pattern in key:
                keys_to_remove.append(key)
        
        for key in keys_to_remove:
            del self.cache_data[key]
            count += 1
        
        if count > 0:
            logger.info(f"Cache invalidé: {count} entrées correspondant à '{pattern}'")
        
        return count
    
    def clear(self) -> bool:
        """Vider complètement le cache"""
        self.cache_data = {}
        logger.info("Cache vidé complètement")
        return True
    
    def get_stats(self) -> Dict[str, Any]:
        """Obtenir les statistiques du cache"""
        total_entries = len(self.cache_data)
        expired_entries = sum(1 for entry in self.cache_data.values() if entry.is_expired())
        
        return {
            'total_entries': total_entries,
            'expired_entries': expired_entries,
            'valid_entries': total_entries - expired_entries,
            'cache_file_path': str(self.cache_file_path),
            'cache_size_bytes': self.cache_file_path.stat().st_size if self.cache_file_path.exists() else 0
        }

class FrameIOStructureManager:
    """Gestionnaire de structure Frame.io v4 avec cache avancé et gestion d'erreurs"""
    
    def __init__(self, auth: FrameIOAuth):
        self.auth = auth
        self.base_url = "https://api.frame.io/v4"
        
        # Configuration forcée depuis la configuration Frame.io 
        # (prioriser la config sur les variables d'environnement)
        config_file = Path(__file__).parent.parent.parent.parent / "config" / "integrations.json"
        frameio_config = {}
        
        if config_file.exists():
            try:
                with open(config_file, 'r') as f:
                    config_data = json.load(f)
                frameio_config = config_data.get('frameio', {})
            except Exception as e:
                logger.warning(f"Impossible de charger la config: {e}")
        
        # Utiliser les IDs de la configuration en priorité
        self.account_id = (
            frameio_config.get('account_id') or 
            os.getenv("FRAMEIO_ACCOUNT_ID") or 
            getattr(auth, 'account_id', None)
        )
        self.workspace_id = (
            frameio_config.get('workspace_id') or 
            os.getenv("FRAMEIO_WORKSPACE_ID") or 
            getattr(auth, 'workspace_id', None)
        )
        
        if not self.account_id:
            raise ValueError("account_id manquant dans la config frameio ou FRAMEIO_ACCOUNT_ID")
        if not self.workspace_id:
            raise ValueError("workspace_id manquant dans la config frameio ou FRAMEIO_WORKSPACE_ID")
        
        # Cache avancé
        cache_dir = Path(__file__).parent.parent.parent.parent / "config"
        self.cache = FrameIOStructureCache(cache_dir / "frameio_structure_cache.json")
        
        # Ancienne structure de cache pour compatibilité
        self.structure_file_path = cache_dir / "frameio_structure.json"
        
        # Paramètres de retry et rate limiting
        self.max_retries = 3
        self.retry_delay = 1.0  # secondes
        self.rate_limit_delay = 2.0  # secondes entre appels API
        
        logger.info(f"📁 FrameIOStructureManager - Account: {self.account_id}, Workspace: {self.workspace_id}")
    
    async def _make_authenticated_request(self, method: str, url: str, **kwargs):
        """
        Effectue une requête HTTP authentifiée robuste
        
        Args:
            method: Méthode HTTP (GET, POST, etc.)
            url: URL complète
            **kwargs: Arguments pour httpx
            
        Returns:
            Réponse HTTP
        """
        if self.auth is not None:
            # Utiliser l'auth existant
            return await self.auth.request(method, url, **kwargs)
        else:
            # Fallback - ne devrait pas arriver dans FrameIOStructureManager
            # car il reçoit toujours un FrameIOAuth
            raise ValueError("FrameIOStructureManager: auth est None")

    async def _api_request_with_retry(self, method: str, url: str, **kwargs) -> Any:
        """Effectuer une requête API avec retry automatique et gestion d'erreurs"""
        last_exception = None
        
        for attempt in range(self.max_retries):
            try:
                # Rate limiting
                if attempt > 0:
                    await asyncio.sleep(self.retry_delay * (2 ** attempt))  # Back-off exponentiel
                
                # Utiliser la méthode d'authentification robuste
                response = await self._make_authenticated_request(method, url, **kwargs)
                
                # Gestion des erreurs spécifiques
                if response.status_code == 429:
                    retry_after = int(response.headers.get('Retry-After', self.rate_limit_delay))
                    logger.warning(f"Rate limit atteint, attente {retry_after}s (tentative {attempt + 1})")
                    await asyncio.sleep(retry_after)
                    continue
                
                if response.status_code == 404:
                    logger.warning(f"Ressource non trouvée: {url}")
                    return None
                
                if response.status_code == 403:
                    logger.error(f"Accès interdit: {url}")
                    raise PermissionError(f"Accès interdit à {url}")
                
                response.raise_for_status()
                return response
                
            except Exception as e:
                last_exception = e
                logger.warning(f"Tentative {attempt + 1} échouée pour {url}: {e}")
                
                if attempt == self.max_retries - 1:
                    logger.error(f"Échec définitif après {self.max_retries} tentatives")
                    break
        
        # Toutes les tentatives ont échoué
        raise last_exception or Exception("Échec API après plusieurs tentatives")
    
    async def get_projects(self, workspace_id: Optional[str] = None) -> List[FrameIOProject]:
        """
        Récupérer la liste des projets avec pagination et cache
        Endpoint: /accounts/{account_id}/workspaces/{workspace_id}/projects
        """
        try:
            ws_id = workspace_id or self.workspace_id
            cache_key = f"projects_{ws_id}"
            
            # Vérifier le cache d'abord
            cached_projects = self.cache.get(cache_key)
            if cached_projects is not None:
                logger.debug(f"Projets récupérés du cache: {len(cached_projects)}")
                return [FrameIOProject(**project) for project in cached_projects]
            
            url = f"{self.base_url}/accounts/{self.account_id}/workspaces/{ws_id}/projects"
            
            projects = []
            next_cursor = None
            
            while True:
                params = {}
                if next_cursor:
                    params["cursor"] = next_cursor
                
                response = await self._api_request_with_retry("GET", url, params=params)
                if response is None:
                    break
                
                data = response.json()
                
                # Convertir en objets FrameIOProject
                for project_data in data.get("data", []):
                    project = FrameIOProject(
                        id=project_data["id"],
                        name=project_data["name"],
                        workspace_id=ws_id,
                        account_id=self.account_id,
                        root_folder_id=project_data.get("root_folder_id"),
                        description=project_data.get("description"),
                        created_at=project_data.get("created_at"),
                        updated_at=project_data.get("updated_at")
                    )
                    projects.append(project)
                
                # Gestion pagination
                pagination = data.get("pagination", {})
                next_cursor = pagination.get("next_cursor")
                if not next_cursor:
                    break
            
            # Sauvegarder dans le cache
            projects_data = [project.__dict__ for project in projects]
            self.cache.set(cache_key, projects_data, ttl_seconds=1800)  # 30 minutes
            self.cache.save_cache()
            
            logger.info(f"Récupéré {len(projects)} projets")
            return projects
            
        except Exception as e:
            logger.error(f"Erreur récupération projets: {e}")
            raise
    
    async def get_project_by_id(self, project_id: str, workspace_id: Optional[str] = None) -> Optional[FrameIOProject]:
        """
        Récupérer un projet par son ID en listant tous les projets du workspace
        L'API v4 ne permet pas l'accès direct à un projet via son ID
        """
        try:
            ws_id = workspace_id or self.workspace_id
            
            # Lister tous les projets du workspace
            projects = await self.get_projects(ws_id)
            
            # Chercher le projet avec l'ID correspondant
            for project in projects:
                if project.id == project_id:
                    logger.info(f"Projet trouvé: {project.name} (ID: {project.id})")
                    return project
            
            logger.warning(f"Projet avec ID {project_id} non trouvé dans le workspace {ws_id}")
            return None
            
        except Exception as e:
            logger.error(f"Erreur récupération projet {project_id}: {e}")
            return None
    
    async def get_folders(self, folder_id: str, project_id: Optional[str] = None, 
                         workspace_id: Optional[str] = None) -> List[FrameIOFolder]:
        """
        Récupérer la liste des dossiers enfants d'un dossier parent
        Endpoint: /accounts/{account_id}/folders/{folder_id}/children
        """
        try:
            # Utiliser l'endpoint correct pour les enfants d'un dossier
            url = f"{self.base_url}/accounts/{self.account_id}/folders/{folder_id}/children"
            
            folders = []
            next_cursor = None
            
            while True:
                params = {}
                if next_cursor:
                    params["after"] = next_cursor
                
                response = await self._make_authenticated_request("GET", url, params=params)
                response.raise_for_status()
                data = response.json()
                
                # Convertir en objets FrameIOFolder
                for folder_data in data.get("data", []):
                    # Filtrer seulement les dossiers (pas les fichiers)
                    if folder_data.get("type") == "folder":
                        folder = FrameIOFolder(
                            id=folder_data["id"],
                            name=folder_data["name"],
                            parent_id=folder_data.get("parent_id"),
                            project_id=project_id or folder_data.get("project_id"),
                            workspace_id=workspace_id or self.workspace_id,
                            account_id=self.account_id,
                            type=folder_data.get("type", "folder"),
                            created_at=folder_data.get("created_at"),
                            updated_at=folder_data.get("updated_at")
                        )
                        folders.append(folder)
                
                # Gestion pagination
                pagination = data.get("pagination", {})
                next_cursor = pagination.get("next_cursor")
                if not next_cursor:
                    break
            
            logger.info(f"Récupéré {len(folders)} dossiers enfants pour le dossier {folder_id}")
            return folders
            
        except Exception as e:
            logger.error(f"Erreur récupération dossiers enfants: {e}")
            raise
    
    async def create_folder(self, name: str, parent_folder_id: str, 
                           project_id: Optional[str] = None, workspace_id: Optional[str] = None) -> Optional[FrameIOFolder]:
        """
        Créer un nouveau dossier dans un dossier parent
        Endpoint: /accounts/{account_id}/folders/{folder_id}/folders
        """
        try:
            # Utiliser le nouveau endpoint pour créer un dossier
            url = f"{self.base_url}/accounts/{self.account_id}/folders/{parent_folder_id}/folders"
            
            # Payload selon la documentation officielle Adobe Frame.io
            payload = {
                "data": {
                    "name": name
                }
            }
            
            response = await self._make_authenticated_request("POST", url, json=payload)
            response.raise_for_status()
            response_data = response.json()
            
            # Les données sont dans la clé "data" de la réponse
            folder_data = response_data.get("data", response_data)
            
            folder = FrameIOFolder(
                id=folder_data["id"],
                name=folder_data["name"],
                parent_id=folder_data.get("parent_id"),
                project_id=project_id or folder_data.get("project_id"),
                workspace_id=workspace_id or self.workspace_id,
                account_id=self.account_id,
                type=folder_data.get("type", "folder"),
                created_at=folder_data.get("created_at"),
                updated_at=folder_data.get("updated_at")
            )
            
            logger.info(f"Dossier créé: {name} (ID: {folder.id}) dans parent {parent_folder_id}")
            return folder
            
        except Exception as e:
            logger.error(f"Erreur création dossier {name}: {e}")
            # Afficher plus de détails sur l'erreur 422
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_details = e.response.json()
                    logger.error(f"Détails erreur 422: {error_details}")
                except:
                    logger.error(f"Détails erreur brute: {e.response.text}")
            return None
    
    async def find_or_create_scene_folder(self, scene_name: str, root_folder_id: str, 
                                         project_id: Optional[str] = None, workspace_id: Optional[str] = None) -> Optional[FrameIOFolder]:
        """
        Trouver ou créer un dossier pour une scène spécifique
        Structure cohérente avec LucidLink: Project Root > 2_FROM_ANIM > {sequence_name}
        """
        try:
            # 1. Chercher le dossier "2_FROM_ANIM" dans le dossier racine
            from_anim_folder = None
            root_folders = await self.get_folders(root_folder_id, project_id, workspace_id)
            
            for folder in root_folders:
                if folder.name == "2_FROM_ANIM":
                    from_anim_folder = folder
                    break
            
            if not from_anim_folder:
                from_anim_folder = await self.create_folder("2_FROM_ANIM", root_folder_id, project_id, workspace_id)
                if not from_anim_folder:
                    logger.error("Impossible de créer le dossier 2_FROM_ANIM")
                    return None
                logger.info("📁 Dossier 2_FROM_ANIM créé")
            
            # 2. Chercher le dossier de la séquence ou le créer
            sequence_folders = await self.get_folders(from_anim_folder.id, project_id, workspace_id)
            
            for folder in sequence_folders:
                if folder.name == scene_name:
                    logger.info(f"Dossier séquence trouvé: 2_FROM_ANIM/{scene_name}")
                    return folder
            
            # Créer le dossier de la séquence
            sequence_folder = await self.create_folder(scene_name, from_anim_folder.id, project_id, workspace_id)
            if sequence_folder:
                logger.info(f"Dossier séquence créé: 2_FROM_ANIM/{scene_name}")
            
            return sequence_folder
            
        except Exception as e:
            logger.error(f"Erreur gestion dossier scène {scene_name}: {e}")
            return None
    
    async def get_project_structure(self, project_id: str, root_folder_id: str, workspace_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Récupérer la structure complète d'un projet (projet + dossiers)
        Utile pour le debug et la visualisation
        """
        try:
            project = await self.get_project_by_id(project_id, workspace_id)
            if not project:
                return {}
            
            # Récupérer tous les dossiers du projet à partir du root folder
            folders = await self.get_folders(root_folder_id, project_id, workspace_id)
            
            structure = {
                "project": {
                    "id": project.id,
                    "name": project.name,
                    "workspace_id": project.workspace_id,
                    "root_folder_id": project.root_folder_id
                },
                "folders": []
            }
            
            for folder in folders:
                structure["folders"].append({
                    "id": folder.id,
                    "name": folder.name,
                    "parent_id": folder.parent_id,
                    "type": folder.type
                })
            
            return structure
            
        except Exception as e:
            logger.error(f"Erreur récupération structure projet: {e}")
            return {}

    def _load_structure_cache(self) -> Dict[str, Any]:
        """
        Charge la structure depuis le fichier JSON local.
        
        Returns:
            Dictionnaire avec la structure en cache
        """
        try:
            if self.structure_file_path.exists():
                with open(self.structure_file_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                logger.info("Fichier de structure introuvable, création d'une nouvelle structure")
                return {
                    "project_id": None,
                    "project_name": "RL PostFlow",
                    "scenes_folder_id": None,
                    "structure": {"scenes": {}},
                    "last_updated": None,
                    "version": "1.0"
                }
        except Exception as e:
            logger.error(f"Erreur chargement structure cache: {e}")
            return {"project_id": None, "scenes_folder_id": None, "structure": {"scenes": {}}}

    def _save_structure_cache(self, structure: Dict[str, Any]) -> bool:
        """
        Sauvegarde la structure dans le fichier JSON local.
        
        Args:
            structure: Structure à sauvegarder
            
        Returns:
            True si sauvegarde réussie
        """
        try:
            # Créer le dossier config s'il n'existe pas
            self.structure_file_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Ajouter timestamp
            structure['last_updated'] = datetime.now().isoformat()
            
            with open(self.structure_file_path, 'w', encoding='utf-8') as f:
                json.dump(structure, f, indent=2, ensure_ascii=False)
            
            logger.info("Structure sauvegardée dans le cache")
            return True
            
        except Exception as e:
            logger.error(f"Erreur sauvegarde structure cache: {e}")
            return False

    async def get_or_create_folder_path(self, scene_name: str, shot_id: str, 
                                       project_id: Optional[str] = None) -> Optional[str]:
        """
        Récupère ou crée le chemin de dossier complet /SCENE/SHOT/ et retourne le folder_id final.
        Utilise un cache JSON local pour éviter les doublons et optimiser les appels API.
        
        Args:
            scene_name: Nom de la scène (ex: "13H49_-_RECUPERATION_DES_2_SURVIVANTS")
            shot_id: ID du plan (ex: "S01")
            project_id: ID du projet (optionnel, utilise le projet par défaut)
            
        Returns:
            folder_id du dossier SHOT, ou None en cas d'erreur
        """
        try:
            # Charger la structure depuis le cache
            structure = self._load_structure_cache()
            
            # Si pas de project_id fourni, utiliser celui du cache ou le chercher
            if not project_id:
                project_id = structure.get('project_id')
                if not project_id:
                    # Chercher le projet par défaut
                    projects = await self.get_projects()
                    if not projects:
                        logger.error("Aucun projet trouvé")
                        return None
                    
                    # Prendre le premier projet ou chercher "RL PostFlow"
                    target_project = None
                    for project in projects:
                        if "RL PostFlow" in project.name or "PostFlow" in project.name:
                            target_project = project
                            break
                    
                    if not target_project:
                        target_project = projects[0]
                    
                    project_id = target_project.id
                    structure['project_id'] = project_id
                    structure['project_name'] = target_project.name
                    logger.info(f"Projet sélectionné: {target_project.name} ({project_id})")
            
            # Vérifier si le chemin existe déjà dans le cache
            scenes_structure = structure.get('structure', {}).get('scenes', {})
            if scene_name in scenes_structure:
                scene_folder_id = scenes_structure[scene_name].get('folder_id')
                shots_structure = scenes_structure[scene_name].get('shots', {})
                
                if shot_id in shots_structure:
                    shot_folder_id = shots_structure[shot_id].get('folder_id')
                    logger.info(f"Dossier trouvé en cache: {scene_name}/{shot_id} → {shot_folder_id}")
                    return shot_folder_id
                else:
                    # Créer seulement le dossier SHOT, la scène existe déjà
                    logger.info(f"Création du dossier SHOT: {shot_id} dans {scene_name}")
                    shot_folder = await self.create_folder(shot_id, scene_folder_id)
                    if shot_folder:
                        # Mettre à jour le cache
                        if 'shots' not in scenes_structure[scene_name]:
                            scenes_structure[scene_name]['shots'] = {}
                        scenes_structure[scene_name]['shots'][shot_id] = {
                            'folder_id': shot_folder.id,
                            'created_at': datetime.now().isoformat()
                        }
                        structure['structure']['scenes'] = scenes_structure
                        self._save_structure_cache(structure)
                        return shot_folder.id
                    else:
                        logger.error(f"Impossible de créer le dossier SHOT: {shot_id}")
                        return None
            
            # Le dossier SCENE n'existe pas, créer toute la structure
            logger.info(f"Création de la structure complète: {scene_name}/{shot_id}")
            
            # 1. Vérifier/créer le dossier WIP_BYSHOT racine
            wip_folder_id = structure.get('wip_folder_id')
            if not wip_folder_id:
                # Récupérer le projet pour avoir le root_folder_id
                project = await self.get_project_by_id(project_id)
                if not project:
                    logger.error(f"Projet introuvable: {project_id}")
                    return None
                
                # Chercher le dossier WIP_BYSHOT ou le créer
                root_folders = await self.get_folders(project.root_folder_id)
                wip_folder = None
                
                for folder in root_folders:
                    if folder.name == 'WIP_BYSHOT':
                        wip_folder = folder
                        break
                
                if not wip_folder:
                    wip_folder = await self.create_folder("WIP_BYSHOT", project.root_folder_id)
                    if not wip_folder:
                        logger.error("Impossible de créer le dossier WIP_BYSHOT")
                        return None
                
                wip_folder_id = wip_folder.id
                structure['wip_folder_id'] = wip_folder_id
                logger.info(f"Dossier WIP_BYSHOT: {wip_folder_id}")
            
            # 2. Créer le dossier SEQUENCE
            sequence_folder = await self.create_folder(scene_name, wip_folder_id)
            if not sequence_folder:
                logger.error(f"Impossible de créer le dossier SEQUENCE: {scene_name}")
                return None
            
            logger.info(f"Dossier SEQUENCE créé: {scene_name} → {sequence_folder.id}")
            
            # 3. Créer le dossier SHOT
            shot_folder = await self.create_folder(shot_id, sequence_folder.id)
            if not shot_folder:
                logger.error(f"Impossible de créer le dossier SHOT: {shot_id}")
                return None
            
            logger.info(f"Dossier SHOT créé: {shot_id} → {shot_folder.id}")
            
            # 4. Mettre à jour le cache
            if 'structure' not in structure:
                structure['structure'] = {}
            if 'scenes' not in structure['structure']:
                structure['structure']['scenes'] = {}
            
            structure['structure']['scenes'][scene_name] = {
                'folder_id': sequence_folder.id,
                'created_at': datetime.now().isoformat(),
                'shots': {
                    shot_id: {
                        'folder_id': shot_folder.id,
                        'created_at': datetime.now().isoformat()
                    }
                }
            }
            
            # Sauvegarder le cache
            self._save_structure_cache(structure)
            
            logger.info(f"✅ Structure créée et mise en cache: {scene_name}/{shot_id} → {shot_folder.id}")
            return shot_folder.id
            
        except Exception as e:
            logger.error(f"❌ Erreur création structure {scene_name}/{shot_id}: {e}")
            return None

    async def get_folder_structure_summary(self) -> Dict[str, Any]:
        """
        Retourne un résumé de la structure des dossiers en cache.
        
        Returns:
            Dictionnaire avec le résumé de la structure
        """
        try:
            structure = self._load_structure_cache()
            
            summary = {
                'project_id': structure.get('project_id'),
                'project_name': structure.get('project_name'),
                'scenes_folder_id': structure.get('scenes_folder_id'),
                'last_updated': structure.get('last_updated'),
                'scenes_count': 0,
                'shots_count': 0,
                'scenes': []
            }
            
            scenes_structure = structure.get('structure', {}).get('scenes', {})
            
            for scene_name, scene_data in scenes_structure.items():
                shots = scene_data.get('shots', {})
                scene_info = {
                    'name': scene_name,
                    'folder_id': scene_data.get('folder_id'),
                    'shots_count': len(shots),
                    'shots': list(shots.keys())
                }
                summary['scenes'].append(scene_info)
                summary['shots_count'] += len(shots)
            
            summary['scenes_count'] = len(scenes_structure)
            
            return summary
            
        except Exception as e:
            logger.error(f"Erreur résumé structure: {e}")
            return {}
