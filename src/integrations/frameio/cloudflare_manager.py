#!/usr/bin/env python3
"""
Gestionnaire de tunnel Cloudflare pour exposer publiquement les fichiers via HTTPS.
Alternative robuste à ngrok et Serveo.
"""

import os
import subprocess
import time
import logging
import json
from typing import Optional, Dict, Any
from pathlib import Path

logger = logging.getLogger(__name__)

class CloudflareManager:
    """Gestionnaire de tunnel Cloudflare pour exposition publique de fichiers."""
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.process = None
        self.tunnel_url = None
        self.local_port = None
        
    def is_cloudflared_installed(self) -> bool:
        """Vérifie si cloudflared est installé."""
        try:
            result = subprocess.run(
                ["cloudflared", "--version"], 
                capture_output=True, 
                text=True, 
                timeout=10
            )
            return result.returncode == 0
        except (subprocess.TimeoutExpired, FileNotFoundError):
            return False
    
    def install_cloudflared(self) -> bool:
        """Installe cloudflared via Homebrew."""
        try:
            logger.info("📦 Installation de cloudflared...")
            result = subprocess.run(
                ["brew", "install", "cloudflared"],
                capture_output=True,
                text=True,
                timeout=300
            )
            
            if result.returncode == 0:
                logger.info("✅ cloudflared installé avec succès")
                return True
            else:
                logger.error(f"❌ Échec installation cloudflared: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            logger.error("❌ Timeout lors de l'installation de cloudflared")
            return False
        except Exception as e:
            logger.error(f"❌ Erreur installation cloudflared: {e}")
            return False
    
    def start_tunnel(self, local_port: int, timeout: int = 30) -> Optional[str]:
        """
        Démarre un tunnel Cloudflare temporaire.
        
        Args:
            local_port: Port local à exposer
            timeout: Timeout pour obtenir l'URL
            
        Returns:
            URL publique HTTPS ou None si échec
        """
        try:
            # Vérifier/installer cloudflared
            if not self.is_cloudflared_installed():
                if not self.install_cloudflared():
                    return None
            
            self.local_port = local_port
            
            # Commande pour tunnel temporaire
            cmd = [
                "cloudflared", 
                "tunnel", 
                "--url", f"http://localhost:{local_port}"
            ]
            
            logger.info(f"🚀 Démarrage tunnel Cloudflare sur port {local_port}")
            
            # Démarrer le processus
            self.process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=1,
                universal_newlines=True
            )
            
            # Attendre l'URL du tunnel
            start_time = time.time()
            while time.time() - start_time < timeout:
                if self.process.poll() is not None:
                    # Processus terminé
                    stdout, stderr = self.process.communicate()
                    logger.error(f"❌ Cloudflare terminé: {stderr}")
                    return None
                
                # Lire la sortie
                try:
                    line = self.process.stderr.readline()
                    if line:
                        logger.debug(f"Cloudflare: {line.strip()}")
                        
                        # Chercher l'URL du tunnel
                        if "https://" in line and "trycloudflare.com" in line:
                            # Extraire l'URL
                            parts = line.split()
                            for part in parts:
                                if part.startswith("https://") and "trycloudflare.com" in part:
                                    self.tunnel_url = part
                                    logger.info(f"✅ Tunnel Cloudflare actif: {self.tunnel_url}")
                                    return self.tunnel_url
                                    
                except Exception as e:
                    logger.debug(f"Erreur lecture stdout: {e}")
                
                time.sleep(0.1)
            
            logger.error(f"❌ Timeout obtention URL Cloudflare ({timeout}s)")
            self.stop_tunnel()
            return None
            
        except Exception as e:
            logger.error(f"❌ Erreur démarrage tunnel Cloudflare: {e}")
            self.stop_tunnel()
            return None
    
    def stop_tunnel(self) -> None:
        """Arrête le tunnel Cloudflare."""
        if self.process:
            try:
                logger.info("🛑 Arrêt tunnel Cloudflare")
                self.process.terminate()
                
                # Attendre terminaison propre
                try:
                    self.process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    logger.warning("⚠️ Timeout terminaison, force l'arrêt")
                    self.process.kill()
                    
            except Exception as e:
                logger.error(f"❌ Erreur arrêt tunnel: {e}")
            finally:
                self.process = None
                self.tunnel_url = None
        else:
            logger.debug("🔍 Aucun tunnel à arrêter")
    
    def is_running(self) -> bool:
        """Vérifie si le tunnel est actif."""
        return self.process is not None and self.process.poll() is None
    
    def get_public_url(self, file_path: str) -> Optional[str]:
        """
        Construit l'URL publique pour un fichier.
        
        Args:
            file_path: Chemin du fichier
            
        Returns:
            URL publique complète
        """
        if not self.tunnel_url:
            return None
        
        # Générer un nom unique pour éviter le cache
        filename = Path(file_path).name
        timestamp = int(time.time())
        unique_filename = f"{timestamp}_{filename}"
        
        return f"{self.tunnel_url}/{unique_filename}"
    
    def __enter__(self):
        """Support du context manager."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Nettoyage automatique."""
        self.stop_tunnel()
