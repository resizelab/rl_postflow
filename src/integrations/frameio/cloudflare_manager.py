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
        Démarre un tunnel Cloudflare temporaire avec gestion optimisée.
        
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
            
            # Commande pour tunnel temporaire avec options optimisées
            cmd = [
                "cloudflared", 
                "tunnel", 
                "--url", f"http://localhost:{local_port}",
                "--no-autoupdate",  # Éviter les mises à jour automatiques
                "--protocol", "http2"  # Protocole optimisé
            ]
            
            logger.info(f"🚀 Démarrage tunnel Cloudflare sur port {local_port} (timeout: {timeout}s)")
            
            # Démarrer le processus
            self.process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=1,
                universal_newlines=True
            )
            
            # Attendre l'URL du tunnel avec polling optimisé
            start_time = time.time()
            poll_interval = 0.1
            
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
                                    
                                    # Attendre que le tunnel se stabilise
                                    logger.info("⏳ Attente stabilisation tunnel (5s)...")
                                    time.sleep(5)
                                    
                                    # Test de connectivité basique
                                    if self._test_tunnel_connectivity():
                                        logger.info("✅ Tunnel accessible et opérationnel")
                                        return self.tunnel_url
                                    else:
                                        logger.warning("⚠️ Test de connectivité échoué - on continue quand même")
                                        # On retourne quand même l'URL car le tunnel pourrait fonctionner
                                        return self.tunnel_url
                                        
                except Exception as e:
                    logger.debug(f"Erreur lecture stdout: {e}")
                
                time.sleep(poll_interval)
            
            logger.error(f"❌ Timeout obtention URL Cloudflare ({timeout}s)")
            self.stop_tunnel()
            return None
            
        except Exception as e:
            logger.error(f"❌ Erreur démarrage tunnel Cloudflare: {e}")
            self.stop_tunnel()
            return None
    
    def _test_tunnel_connectivity(self, test_file_path: str = None) -> bool:
        """
        Teste la connectivité du tunnel avec une approche plus robuste.
        
        Args:
            test_file_path: Chemin du fichier à tester (optionnel)
        """
        if not self.tunnel_url:
            return False
        
        try:
            import requests
            
            # Test de connectivité basique - juste vérifier que l'URL répond
            test_url = self.tunnel_url
            logger.debug(f"🔍 Test connectivité tunnel: {test_url}")
            
            response = requests.get(test_url, timeout=10)
            
            # Cloudflare retourne souvent 404 ou 403 même si le tunnel fonctionne
            # Ce qui compte c'est qu'on obtient une réponse HTTP
            if response.status_code in [200, 404, 403, 502]:
                logger.debug(f"✅ Tunnel répond (code: {response.status_code})")
                return True
            else:
                logger.debug(f"⚠️ Tunnel répond avec code: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            logger.debug(f"❌ Erreur test connectivité: {e}")
            return False
        except Exception as e:
            logger.debug(f"❌ Erreur test connectivité: {e}")
            return False
    
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
