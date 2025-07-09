#!/usr/bin/env python3
"""
Script pour explorer la structure Frame.io et trouver les fichiers récents
"""

import asyncio
import sys
from pathlib import Path
import logging
import httpx
from datetime import datetime

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.integrations.frameio.auth import FrameIOAuth
from src.integrations.frameio.upload import FrameIOUploadManager
from src.utils.config import ConfigManager

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def explore_frameio_structure():
    """
    Explorer la structure Frame.io pour trouver les fichiers récents
    """
    try:
        # Charger la configuration
        config = ConfigManager()
        
        # Authentification Frame.io
        project_root = Path(__file__).parent
        auth = FrameIOAuth(project_root)
        await auth.ensure_valid_token()
        
        # Gestionnaire d'upload
        upload_manager = FrameIOUploadManager(config)
        
        # Obtenir les informations de base
        account_id = upload_manager.account_id
        workspace_id = upload_manager.workspace_id
        project_id = config.get('frameio.project_id')
        root_folder_id = config.get('frameio.root_folder_id')
        
        logger.info(f"📊 Account ID: {account_id}")
        logger.info(f"📊 Workspace ID: {workspace_id}")
        logger.info(f"📊 Project ID: {project_id}")
        logger.info(f"📊 Root Folder ID: {root_folder_id}")
        
        # Explorer le root folder
        if root_folder_id:
            await explore_folder(upload_manager, root_folder_id, "ROOT", depth=0)
        
        # Explorer le projet
        if project_id:
            logger.info(f"\n🔍 Exploration du projet {project_id}")
            
            # Obtenir les informations du projet
            url = f"https://api.frame.io/v4/accounts/{account_id}/projects/{project_id}"
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    url,
                    headers=upload_manager._get_headers(),
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    project_data = response.json()
                    data = project_data.get('data', project_data)
                    
                    logger.info(f"✅ Projet trouvé: {data.get('name')}")
                    
                    # Obtenir le root folder du projet
                    project_root_folder = data.get('root_folder_id')
                    if project_root_folder:
                        logger.info(f"📁 Root folder du projet: {project_root_folder}")
                        await explore_folder(upload_manager, project_root_folder, "PROJECT_ROOT", depth=0)
                else:
                    logger.error(f"❌ Erreur récupération projet: {response.status_code}")
                    logger.error(f"❌ Réponse: {response.text}")
        
        # Vérifier si l'ID problématique pourrait être un placeholder ou temporaire
        logger.info(f"\n🔍 Analyse de l'ID problématique: 1d5b2082-a4bf-4999-a2ad-86bcbc459947")
        
        # Voir si c'est dans les logs ou cache
        await check_logs_for_id("1d5b2082-a4bf-4999-a2ad-86bcbc459947")
        
    except Exception as e:
        logger.error(f"❌ Erreur générale: {e}")
        import traceback
        traceback.print_exc()

async def explore_folder(upload_manager, folder_id, folder_name, depth=0):
    """
    Explorer un dossier Frame.io
    """
    try:
        indent = "  " * depth
        logger.info(f"{indent}📁 Exploration du dossier: {folder_name} (ID: {folder_id})")
        
        # Obtenir le contenu du dossier
        url = f"https://api.frame.io/v4/folders/{folder_id}/children"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                headers=upload_manager._get_headers(),
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                items = data.get('data', [])
                
                logger.info(f"{indent}   📊 Trouvé {len(items)} éléments")
                
                files_found = []
                folders_found = []
                
                for item in items:
                    item_type = item.get('type')
                    item_id = item.get('id')
                    item_name = item.get('name')
                    
                    if item_type == 'file':
                        files_found.append(item)
                        logger.info(f"{indent}   📄 Fichier: {item_name} (ID: {item_id})")
                        
                        # Vérifier si c'est l'ID problématique
                        if item_id == "1d5b2082-a4bf-4999-a2ad-86bcbc459947":
                            logger.info(f"{indent}      🎯 TROUVÉ L'ID PROBLÉMATIQUE DANS CE DOSSIER !")
                        
                        # Afficher les détails du fichier
                        status = item.get('status')
                        created_at = item.get('created_at')
                        updated_at = item.get('updated_at')
                        
                        logger.info(f"{indent}      Status: {status}")
                        logger.info(f"{indent}      Créé: {created_at}")
                        logger.info(f"{indent}      Modifié: {updated_at}")
                        
                    elif item_type == 'folder':
                        folders_found.append(item)
                        logger.info(f"{indent}   📁 Dossier: {item_name} (ID: {item_id})")
                
                # Explorer les sous-dossiers (limité à 2 niveaux)
                if depth < 2:
                    for folder in folders_found:
                        await explore_folder(upload_manager, folder['id'], folder['name'], depth + 1)
                
            else:
                logger.error(f"{indent}❌ Erreur exploration dossier: {response.status_code}")
                logger.error(f"{indent}❌ Réponse: {response.text}")
        
    except Exception as e:
        logger.error(f"❌ Erreur exploration dossier {folder_id}: {e}")

async def check_logs_for_id(file_id):
    """
    Vérifier les logs pour des traces de cet ID
    """
    try:
        logger.info(f"🔍 Recherche dans les logs pour l'ID: {file_id}")
        
        # Chercher dans les logs
        logs_dir = Path(__file__).parent / "logs"
        if logs_dir.exists():
            for log_file in logs_dir.glob("*.log"):
                logger.info(f"   📋 Vérification: {log_file.name}")
                
                try:
                    with open(log_file, 'r') as f:
                        content = f.read()
                        if file_id in content:
                            logger.info(f"      ✅ ID trouvé dans {log_file.name}")
                            
                            # Extraire les lignes contenant l'ID
                            lines = content.split('\n')
                            for i, line in enumerate(lines):
                                if file_id in line:
                                    logger.info(f"      📝 Ligne {i+1}: {line.strip()}")
                        else:
                            logger.info(f"      ❌ ID non trouvé dans {log_file.name}")
                except Exception as e:
                    logger.warning(f"      ⚠️ Erreur lecture {log_file.name}: {e}")
        
        # Vérifier les fichiers de cache
        cache_files = [
            "config/frameio_structure_cache.json",
            "config/frameio_structure.json"
        ]
        
        for cache_file in cache_files:
            cache_path = Path(__file__).parent / cache_file
            if cache_path.exists():
                logger.info(f"   📋 Vérification cache: {cache_file}")
                
                try:
                    with open(cache_path, 'r') as f:
                        content = f.read()
                        if file_id in content:
                            logger.info(f"      ✅ ID trouvé dans le cache {cache_file}")
                        else:
                            logger.info(f"      ❌ ID non trouvé dans le cache {cache_file}")
                except Exception as e:
                    logger.warning(f"      ⚠️ Erreur lecture cache {cache_file}: {e}")
    
    except Exception as e:
        logger.error(f"❌ Erreur vérification logs: {e}")

if __name__ == "__main__":
    asyncio.run(explore_frameio_structure())
