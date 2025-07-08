#!/usr/bin/env python3
"""
Frame.io Production Upload Manager
Gestionnaire d'upload de production intégrant ngrok et création de dossiers
"""

import asyncio
import logging
import subprocess
import time
import requests
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any

from .auth import FrameIOAuth
from .structure import FrameIOStructureManager
from .upload import FrameIOUploadManager
from .public_server import PublicFileServer
from ..discord import DiscordNotifier

logger = logging.getLogger(__name__)


class NgrokTunnelManager:
    """Gestionnaire de tunnel ngrok pour la production"""
    
    def __init__(self, port: int):
        self.port = port
        self.process = None
        self.public_url = None
        
    async def start(self) -> bool:
        """Démarre le tunnel ngrok"""
        try:
            # Vérifier ngrok
            result = subprocess.run(['which', 'ngrok'], capture_output=True, text=True)
            if result.returncode != 0:
                logger.error("❌ ngrok non installé")
                return False
            
            # Vérifier auth ngrok
            auth_check = subprocess.run(['ngrok', 'config', 'check'], capture_output=True, text=True)
            if auth_check.returncode != 0:
                logger.error("❌ ngrok non configuré")
                return False
            
            # Démarrer ngrok
            logger.info(f"🚀 Démarrage tunnel ngrok sur port {self.port}")
            self.process = subprocess.Popen(
                ['ngrok', 'http', str(self.port)],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            # Attendre et récupérer l'URL
            await asyncio.sleep(5)
            
            for attempt in range(10):
                try:
                    response = requests.get('http://localhost:4040/api/tunnels', timeout=10)
                    if response.status_code == 200:
                        tunnels = response.json()
                        for tunnel in tunnels.get('tunnels', []):
                            if tunnel.get('proto') == 'https':
                                self.public_url = tunnel['public_url']
                                logger.info(f"✅ Tunnel ngrok actif: {self.public_url}")
                                return True
                    
                    await asyncio.sleep(2)
                except Exception as e:
                    if attempt == 9:
                        logger.error(f"❌ Erreur ngrok après {attempt + 1} tentatives: {e}")
                        return False
                    await asyncio.sleep(2)
            
            logger.error("❌ Impossible de récupérer l'URL ngrok")
            return False
            
        except Exception as e:
            logger.error(f"❌ Erreur démarrage ngrok: {e}")
            return False
    
    def stop(self):
        """Arrête le tunnel ngrok"""
        if self.process:
            self.process.terminate()
            self.process.wait()
            logger.info("🛑 Tunnel ngrok arrêté")


class FrameIOProductionUploader:
    """Gestionnaire d'upload de production pour Frame.io"""
    
    def __init__(self, auth: FrameIOAuth, discord_webhook_url: Optional[str] = None):
        self.auth = auth
        self.structure_manager = FrameIOStructureManager(auth)
        self.upload_manager = FrameIOUploadManager(auth)
        self.discord_notifier = DiscordNotifier(discord_webhook_url) if discord_webhook_url else None
        
        # Serveur HTTP et ngrok
        self.http_server: Optional[PublicFileServer] = None
        self.ngrok_manager: Optional[NgrokTunnelManager] = None
        
        logger.info("📤 FrameIOProductionUploader initialisé")
    
    async def upload_file_with_structure(
        self, 
        file_path: Path, 
        project_name: str = "UNDLM_DOCU",
        scene_name: Optional[str] = None,
        shot_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Upload un fichier avec création automatique de la structure de dossiers
        
        Args:
            file_path: Chemin vers le fichier à uploader
            project_name: Nom du projet Frame.io
            scene_name: Nom de la scène (optionnel, auto-détecté si None)
            shot_name: Nom du shot (optionnel, auto-détecté si None)
            
        Returns:
            Dict contenant les informations du résultat
        """
        result = {
            'success': False,
            'file_id': None,
            'folder_id': None,
            'project_id': None,
            'view_url': None,
            'error': None
        }
        
        try:
            logger.info(f"📤 Début upload production: {file_path.name}")
            
            # 1. Vérifier le fichier
            if not file_path.exists():
                raise FileNotFoundError(f"Fichier non trouvé: {file_path}")
            
            logger.info(f"📁 Fichier: {file_path} ({file_path.stat().st_size} bytes)")
            
            # 2. Récupérer le projet
            projects = await self.structure_manager.get_projects()
            target_project = None
            
            for project in projects:
                if project.name == project_name:
                    target_project = project
                    break
            
            if not target_project:
                raise ValueError(f"Projet '{project_name}' non trouvé")
            
            logger.info(f"✅ Projet trouvé: {target_project.name}")
            result['project_id'] = target_project.id
            
            # 3. Déterminer la structure de dossiers
            if not scene_name or not shot_name:
                # Auto-détection depuis le nom de fichier (TODO: intégrer nomenclature)
                scene_name = scene_name or "PRODUCTION"
                shot_name = shot_name or file_path.stem
            
            logger.info(f"📂 Structure: {scene_name} > {shot_name}")
            
            # 4. Créer la structure de dossiers
            try:
                folder_id = await self.structure_manager.get_or_create_folder_path(
                    scene_name,
                    shot_name,
                    target_project.id
                )
                
                if not folder_id:
                    # Fallback sur le root folder
                    logger.warning("⚠️ Création dossier échouée, utilisation root folder")
                    folder_id = target_project.root_folder_id
                
                logger.info(f"✅ Dossier de destination: {folder_id}")
                result['folder_id'] = folder_id
                
            except Exception as e:
                logger.warning(f"⚠️ Erreur création structure: {e}")
                logger.info("📂 Utilisation du root folder")
                folder_id = target_project.root_folder_id
                result['folder_id'] = folder_id
            
            # 5. Préparer le serveur HTTP et ngrok
            logger.info("🌐 Préparation serveur HTTP et ngrok...")
            
            # Démarrer serveur HTTP
            self.http_server = PublicFileServer(host="127.0.0.1", port=0)
            if not self.http_server.start():
                raise RuntimeError("Impossible de démarrer le serveur HTTP")
            
            # Exposer le fichier
            local_url = self.http_server.add_file(str(file_path))
            if not local_url:
                raise RuntimeError("Impossible d'exposer le fichier")
            
            logger.info(f"📂 Fichier exposé: {local_url}")
            
            # Démarrer ngrok
            self.ngrok_manager = NgrokTunnelManager(self.http_server.actual_port)
            if not await self.ngrok_manager.start():
                raise RuntimeError("Impossible de démarrer ngrok")
            
            # Construire URL publique
            file_name = local_url.split('/')[-1]
            public_url = f"{self.ngrok_manager.public_url}/{file_name}"
            logger.info(f"🌍 URL publique: {public_url}")
            
            # Vérifier accessibilité
            response = requests.head(public_url, timeout=10)
            if response.status_code != 200:
                raise RuntimeError(f"URL publique non accessible: {response.status_code}")
            
            logger.info("✅ URL publique vérifiée")
            
            # 6. Upload vers Frame.io
            logger.info("📤 Upload vers Frame.io...")
            
            frameio_file = await self.upload_manager._create_file_remote_upload(
                str(file_path),
                folder_id,
                public_url
            )
            
            if not frameio_file:
                raise RuntimeError("Upload Frame.io échoué")
            
            logger.info(f"✅ Upload réussi: {frameio_file.name} (ID: {frameio_file.id})")
            
            result['success'] = True
            result['file_id'] = frameio_file.id
            
            # Construire l'URL de visualisation Frame.io
            result['view_url'] = f"https://app.frame.io/project/{target_project.id}/asset/{frameio_file.id}"
            
            # 7. Notification Discord
            if self.discord_notifier:
                try:
                    await self._send_discord_notification(
                        file_path,
                        frameio_file,
                        target_project,
                        result['view_url']
                    )
                except Exception as e:
                    logger.warning(f"⚠️ Erreur notification Discord: {e}")
            
            # 8. Attendre le traitement Frame.io
            logger.info("⏳ Attente traitement Frame.io...")
            await asyncio.sleep(10)
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Erreur upload production: {e}")
            result['error'] = str(e)
            return result
        
        finally:
            # Nettoyage
            await self._cleanup()
    
    async def _send_discord_notification(
        self, 
        file_path: Path, 
        frameio_file, 
        project, 
        view_url: str
    ):
        """Envoie une notification Discord"""
        embed = {
            "title": "📤 Nouveau fichier uploadé sur Frame.io",
            "color": 0x00ff00,
            "fields": [
                {"name": "📁 Fichier", "value": file_path.name, "inline": True},
                {"name": "🎬 Projet", "value": project.name, "inline": True},
                {"name": "🆔 File ID", "value": frameio_file.id, "inline": False},
                {"name": "🔗 Voir sur Frame.io", "value": f"[Ouvrir]({view_url})", "inline": False}
            ],
            "timestamp": datetime.utcnow().isoformat(),
            "footer": {"text": "RL PostFlow Pipeline"}
        }
        
        await self.discord_notifier.send_embed(embed)
    
    async def _cleanup(self):
        """Nettoyage des ressources"""
        if self.ngrok_manager:
            self.ngrok_manager.stop()
            self.ngrok_manager = None
        
        if self.http_server:
            self.http_server.stop()
            self.http_server = None
        
        logger.info("🧹 Nettoyage terminé")


# Fonction utilitaire pour l'intégration dans le pipeline principal
async def upload_file_to_frameio(
    file_path: Path,
    auth: FrameIOAuth,
    discord_webhook_url: Optional[str] = None,
    project_name: str = "UNDLM_DOCU"
) -> Dict[str, Any]:
    """
    Fonction utilitaire pour upload rapide depuis le pipeline principal
    """
    uploader = FrameIOProductionUploader(auth, discord_webhook_url)
    return await uploader.upload_file_with_structure(file_path, project_name)
