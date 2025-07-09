#!/usr/bin/env python3
"""
Script pour lister les fichiers Frame.io récents et vérifier les IDs
"""

import asyncio
import sys
from pathlib import Path
import logging
import httpx
from datetime import datetime, timedelta

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.integrations.frameio.auth import FrameIOAuth
from src.integrations.frameio.upload import FrameIOUploadManager
from src.utils.config import ConfigManager

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def list_recent_files():
    """
    Liste les fichiers Frame.io récents pour vérifier les IDs
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
        
        logger.info(f"📊 Account ID: {account_id}")
        logger.info(f"📊 Workspace ID: {workspace_id}")
        logger.info(f"📊 Project ID: {project_id}")
        
        # Méthode 1: Lister les fichiers du projet
        if project_id:
            logger.info(f"🔍 Méthode 1: Fichiers du projet {project_id}")
            
            url = f"https://api.frame.io/v4/accounts/{account_id}/projects/{project_id}/files"
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    url,
                    headers=upload_manager._get_headers(),
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    files = data.get('files', [])
                    
                    logger.info(f"📁 Trouvé {len(files)} fichiers dans le projet")
                    
                    for file_info in files[-10:]:  # Les 10 derniers
                        file_id = file_info.get('id')
                        name = file_info.get('name')
                        status = file_info.get('status')
                        created_at = file_info.get('created_at')
                        
                        logger.info(f"   📄 {name} (ID: {file_id})")
                        logger.info(f"      Status: {status}, Créé: {created_at}")
                        
                        # Tester l'accessibilité
                        file_accessible = await upload_manager._get_file_info(file_id)
                        if file_accessible:
                            logger.info(f"      ✅ Fichier accessible")
                        else:
                            logger.info(f"      ❌ Fichier non accessible")
                        
                        print()
                else:
                    logger.error(f"❌ Erreur récupération fichiers projet: {response.status_code}")
                    logger.error(f"❌ Réponse: {response.text}")
        
        # Méthode 2: Lister les fichiers du workspace
        logger.info(f"🔍 Méthode 2: Fichiers récents du workspace {workspace_id}")
        
        url = f"https://api.frame.io/v4/accounts/{account_id}/workspaces/{workspace_id}/files"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                headers=upload_manager._get_headers(),
                params={"limit": 20},  # Limiter à 20 fichiers récents
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                files = data.get('files', [])
                
                logger.info(f"📁 Trouvé {len(files)} fichiers dans le workspace")
                
                for file_info in files:
                    file_id = file_info.get('id')
                    name = file_info.get('name')
                    status = file_info.get('status')
                    created_at = file_info.get('created_at')
                    
                    logger.info(f"   📄 {name} (ID: {file_id})")
                    logger.info(f"      Status: {status}, Créé: {created_at}")
                    
                    # Vérifier si c'est l'ID problématique
                    if file_id == "1d5b2082-a4bf-4999-a2ad-86bcbc459947":
                        logger.info(f"      🎯 TROUVÉ L'ID PROBLÉMATIQUE !")
                    
                    print()
            else:
                logger.error(f"❌ Erreur récupération fichiers workspace: {response.status_code}")
                logger.error(f"❌ Réponse: {response.text}")
        
        # Méthode 3: Essayer l'API de recherche
        logger.info(f"🔍 Méthode 3: Recherche directe de l'ID problématique")
        
        problematic_id = "1d5b2082-a4bf-4999-a2ad-86bcbc459947"
        
        # Essayer différents endpoints
        endpoints = [
            f"https://api.frame.io/v4/files/{problematic_id}",
            f"https://api.frame.io/v4/accounts/{account_id}/files/{problematic_id}",
            f"https://api.frame.io/v4/accounts/{account_id}/workspaces/{workspace_id}/files/{problematic_id}",
        ]
        
        for endpoint in endpoints:
            logger.info(f"   🔍 Test endpoint: {endpoint}")
            
            async with httpx.AsyncClient() as client:
                try:
                    response = await client.get(
                        endpoint,
                        headers=upload_manager._get_headers(),
                        timeout=30.0
                    )
                    
                    logger.info(f"      Status: {response.status_code}")
                    
                    if response.status_code == 200:
                        file_data = response.json()
                        logger.info(f"      ✅ Fichier trouvé à cette adresse !")
                        logger.info(f"      Nom: {file_data.get('name')}")
                        logger.info(f"      Status: {file_data.get('status')}")
                        break
                    elif response.status_code == 404:
                        logger.info(f"      ❌ Fichier non trouvé à cette adresse")
                    else:
                        logger.info(f"      ⚠️ Erreur: {response.status_code}")
                        
                except Exception as e:
                    logger.error(f"      ❌ Erreur requête: {e}")
        
    except Exception as e:
        logger.error(f"❌ Erreur générale: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(list_recent_files())
