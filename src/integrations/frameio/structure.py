"""
Frame.io API v4 Structure Module
Gestion des workspaces, projets et dossiers selon l'arborescence REST v4
"""

import asyncio
import os
from typing import List, Dict, Optional, Any
from dataclasses import dataclass
import logging

from .oauth_auth import FrameIOOAuthAuth

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

class FrameIOStructureManager:
    """Gestionnaire de structure Frame.io v4 avec endpoints REST stricts"""
    
    def __init__(self, auth: FrameIOOAuthAuth):
        self.auth = auth
        self.config = getattr(auth, 'config', {})
        
        # Récupérer les IDs depuis la config en priorité, puis les variables d'environnement
        frameio_config = self.config.get('frameio', {})
        self.account_id = frameio_config.get('account_id') or os.getenv('FRAMEIO_ACCOUNT_ID')
        self.workspace_id = frameio_config.get('workspace_id') or os.getenv('FRAMEIO_WORKSPACE_ID')
        self.base_url = frameio_config.get('base_url') or os.getenv('FRAMEIO_BASE_URL', 'https://api.frame.io/v4')
        
        if not self.account_id:
            raise ValueError("account_id manquant dans la config frameio ou FRAMEIO_ACCOUNT_ID")
        if not self.workspace_id:
            raise ValueError("workspace_id manquant dans la config frameio ou FRAMEIO_WORKSPACE_ID")
    
    async def get_projects(self, workspace_id: Optional[str] = None) -> List[FrameIOProject]:
        """
        Récupérer la liste des projets avec pagination
        Endpoint: /accounts/{account_id}/workspaces/{workspace_id}/projects
        """
        try:
            ws_id = workspace_id or self.workspace_id
            url = f"{self.base_url}/accounts/{self.account_id}/workspaces/{ws_id}/projects"
            
            projects = []
            next_cursor = None
            
            while True:
                params = {}
                if next_cursor:
                    params["cursor"] = next_cursor
                
                response = await self.auth.make_authenticated_request("GET", url, params=params)
                response.raise_for_status()
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
    
    async def get_folders(self, project_id: str, parent_folder_id: Optional[str] = None, 
                         workspace_id: Optional[str] = None) -> List[FrameIOFolder]:
        """
        Récupérer la liste des dossiers d'un projet
        Endpoint: /accounts/{account_id}/workspaces/{workspace_id}/projects/{project_id}/folders
        """
        try:
            ws_id = workspace_id or self.workspace_id
            headers = await self.auth.get_headers()
            
            # Construire l'URL selon l'arborescence v4
            url = f"{self.base_url}/accounts/{self.account_id}/workspaces/{ws_id}/projects/{project_id}/folders"
            
            params = {}
            if parent_folder_id:
                params["parent_id"] = parent_folder_id
            
            folders = []
            next_cursor = None
            
            while True:
                if next_cursor:
                    params["cursor"] = next_cursor
                
                response = await self.auth._request_with_retry("GET", url, headers=headers, params=params)
                data = response.json()
                
                # Convertir en objets FrameIOFolder
                for folder_data in data.get("data", []):
                    folder = FrameIOFolder(
                        id=folder_data["id"],
                        name=folder_data["name"],
                        parent_id=folder_data.get("parent_id"),
                        project_id=project_id,
                        workspace_id=ws_id,
                        account_id=self.config.account_id,
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
            
            logger.info(f"Récupéré {len(folders)} dossiers pour le projet {project_id}")
            return folders
            
        except Exception as e:
            logger.error(f"Erreur récupération dossiers: {e}")
            raise
    
    async def create_folder(self, name: str, project_id: str, parent_folder_id: Optional[str] = None,
                           workspace_id: Optional[str] = None) -> Optional[FrameIOFolder]:
        """
        Créer un nouveau dossier
        Endpoint: /accounts/{account_id}/workspaces/{workspace_id}/projects/{project_id}/folders
        """
        try:
            ws_id = workspace_id or self.workspace_id
            headers = await self.auth.get_headers()
            url = f"{self.base_url}/accounts/{self.account_id}/workspaces/{ws_id}/projects/{project_id}/folders"
            
            payload = {
                "name": name,
                "type": "folder"
            }
            
            if parent_folder_id:
                payload["parent_id"] = parent_folder_id
            
            response = await self.auth._request_with_retry("POST", url, headers=headers, json=payload)
            folder_data = response.json()
            
            folder = FrameIOFolder(
                id=folder_data["id"],
                name=folder_data["name"],
                parent_id=folder_data.get("parent_id"),
                project_id=project_id,
                workspace_id=ws_id,
                account_id=self.config.account_id,
                type=folder_data.get("type", "folder"),
                created_at=folder_data.get("created_at"),
                updated_at=folder_data.get("updated_at")
            )
            
            logger.info(f"Dossier créé: {name} (ID: {folder.id})")
            return folder
            
        except Exception as e:
            logger.error(f"Erreur création dossier {name}: {e}")
            return None
    
    async def find_or_create_scene_folder(self, scene_name: str, project_id: str, 
                                         workspace_id: Optional[str] = None) -> Optional[FrameIOFolder]:
        """
        Trouver ou créer un dossier pour une scène spécifique
        Structure recommandée: Project > Scenes > {scene_name}
        """
        try:
            # 1. Récupérer le projet pour obtenir root_folder_id
            project = await self.get_project_by_id(project_id, workspace_id)
            if not project or not project.root_folder_id:
                logger.error(f"Projet {project_id} ou root_folder_id non trouvé")
                return None
            
            # 2. Chercher le dossier "Scenes" ou le créer
            scenes_folder = None
            folders = await self.get_folders(project_id, project.root_folder_id, workspace_id)
            
            for folder in folders:
                if folder.name.lower() == "scenes":
                    scenes_folder = folder
                    break
            
            if not scenes_folder:
                scenes_folder = await self.create_folder("Scenes", project_id, project.root_folder_id, workspace_id)
                if not scenes_folder:
                    logger.error("Impossible de créer le dossier Scenes")
                    return None
            
            # 3. Chercher le dossier de la scène ou le créer
            scene_folders = await self.get_folders(project_id, scenes_folder.id, workspace_id)
            
            for folder in scene_folders:
                if folder.name == scene_name:
                    logger.info(f"Dossier scène trouvé: {scene_name}")
                    return folder
            
            # Créer le dossier de la scène
            scene_folder = await self.create_folder(scene_name, project_id, scenes_folder.id, workspace_id)
            if scene_folder:
                logger.info(f"Dossier scène créé: {scene_name}")
            
            return scene_folder
            
        except Exception as e:
            logger.error(f"Erreur gestion dossier scène {scene_name}: {e}")
            return None
    
    async def get_project_structure(self, project_id: str, workspace_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Récupérer la structure complète d'un projet (projet + dossiers)
        Utile pour le debug et la visualisation
        """
        try:
            project = await self.get_project_by_id(project_id, workspace_id)
            if not project:
                return {}
            
            # Récupérer tous les dossiers du projet
            folders = await self.get_folders(project_id, workspace_id=workspace_id)
            
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
