#!/usr/bin/env python3
"""
Cloudflare Tunnel Manager pour les webhooks Frame.io
Gestionnaire dédié pour exposer les webhooks via Cloudflare Tunnel
"""

import logging
import subprocess
import time
import json
from typing import Optional, Dict, Any
from pathlib import Path

logger = logging.getLogger(__name__)


class WebhookTunnelManager:
    """
    Gestionnaire de tunnel Cloudflare spécialement pour les webhooks
    Utilise un port dédié pour éviter les interférences avec les uploads
    """
    
    def __init__(self, webhook_port: int = 8080):
        """
        Initialise le gestionnaire de tunnel webhook
        
        Args:
            webhook_port: Port dédié aux webhooks (défaut: 8080)
        """
        self.webhook_port = webhook_port
        self.tunnel_process = None
        self.tunnel_url = None
        self.is_running = False
        
        # Configuration dédiée aux webhooks
        self.tunnel_config = {
            "name": "postflow-webhooks",
            "protocol": "http2",
            "no_autoupdate": True,
            "log_level": "info"
        }
    
    def is_cloudflared_available(self) -> bool:
        """Vérifie si cloudflared est disponible"""
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
    
    def start_webhook_tunnel(self, timeout: int = 60) -> Optional[str]:
        """
        Démarre un tunnel Cloudflare dédié aux webhooks
        
        Args:
            timeout: Timeout pour obtenir l'URL du tunnel
            
        Returns:
            str: URL publique HTTPS du tunnel ou None si échec
        """
        try:
            if not self.is_cloudflared_available():
                logger.error("❌ cloudflared n'est pas installé ou disponible")
                return None
            
            if self.is_running:
                logger.warning("⚠️ Tunnel webhook déjà en cours")
                return self.tunnel_url
            
            # Commande pour tunnel webhook dédié
            cmd = [
                "cloudflared", 
                "tunnel", 
                "--url", f"http://localhost:{self.webhook_port}",
                "--no-autoupdate",
                "--protocol", "http2",
                "--logfile", "logs/webhook_tunnel.log"
            ]
            
            logger.info(f"🚀 Démarrage tunnel webhook Cloudflare sur port {self.webhook_port}")
            
            # Démarrer le processus tunnel
            self.tunnel_process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=1
            )
            
            # Attendre l'URL du tunnel
            start_time = time.time()
            while time.time() - start_time < timeout:
                if self.tunnel_process.poll() is not None:
                    stdout, stderr = self.tunnel_process.communicate()
                    logger.error(f"❌ Tunnel webhook terminé: {stderr}")
                    return None
                
                try:
                    line = self.tunnel_process.stderr.readline()
                    if line:
                        logger.debug(f"Cloudflare webhook: {line.strip()}")
                        
                        # Chercher l'URL du tunnel
                        if "https://" in line and "trycloudflare.com" in line:
                            # Extraire l'URL
                            import re
                            url_match = re.search(r'https://[a-zA-Z0-9\-]+\.trycloudflare\.com', line)
                            if url_match:
                                self.tunnel_url = url_match.group()
                                self.is_running = True
                                logger.info(f"✅ Tunnel webhook actif: {self.tunnel_url}")
                                return self.tunnel_url
                                
                except Exception as e:
                    logger.debug(f"Erreur lecture ligne tunnel: {e}")
                
                time.sleep(0.2)
            
            logger.error(f"❌ Timeout tunnel webhook ({timeout}s)")
            self.stop_webhook_tunnel()
            return None
            
        except Exception as e:
            logger.error(f"❌ Erreur tunnel webhook: {e}")
            self.stop_webhook_tunnel()
            return None
    
    def stop_webhook_tunnel(self):
        """Arrête le tunnel webhook"""
        try:
            if self.tunnel_process:
                self.tunnel_process.terminate()
                try:
                    self.tunnel_process.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    self.tunnel_process.kill()
                
                self.tunnel_process = None
            
            self.tunnel_url = None
            self.is_running = False
            logger.info("🛑 Tunnel webhook arrêté")
            
        except Exception as e:
            logger.error(f"❌ Erreur arrêt tunnel webhook: {e}")
    
    def get_webhook_url(self, path: str = "/frameio-webhook") -> Optional[str]:
        """
        Retourne l'URL complète du webhook
        
        Args:
            path: Chemin du webhook
            
        Returns:
            str: URL complète du webhook ou None
        """
        if self.tunnel_url:
            return f"{self.tunnel_url}{path}"
        return None
    
    def is_tunnel_healthy(self) -> bool:
        """Vérifie si le tunnel est en bon état"""
        return (
            self.is_running and 
            self.tunnel_process and 
            self.tunnel_process.poll() is None and
            self.tunnel_url is not None
        )
    
    def get_tunnel_info(self) -> Dict[str, Any]:
        """
        Retourne les informations du tunnel
        
        Returns:
            Dict: Informations du tunnel
        """
        return {
            "webhook_port": self.webhook_port,
            "tunnel_url": self.tunnel_url,
            "is_running": self.is_running,
            "is_healthy": self.is_tunnel_healthy(),
            "process_pid": self.tunnel_process.pid if self.tunnel_process else None
        }
