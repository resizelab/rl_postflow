"""
Frame.io Public Server Module
Expose temporairement des fichiers locaux via HTTP pour remote_upload
"""

import os
import asyncio
import threading
import socket
import logging
from typing import Optional, Dict, Any
from pathlib import Path
from datetime import datetime, timedelta
from urllib.parse import quote
from http.server import HTTPServer, SimpleHTTPRequestHandler
from contextlib import contextmanager

logger = logging.getLogger(__name__)

class SecureFileHandler(SimpleHTTPRequestHandler):
    """Handler HTTP sécurisé pour servir des fichiers temporaires"""
    
    def __init__(self, *args, allowed_files: Dict[str, str] = None, **kwargs):
        self.allowed_files = allowed_files or {}
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        """Gérer les requêtes GET avec vérification de sécurité"""
        requested_path = self.path.lstrip('/')
        
        # Vérifier si le fichier est autorisé
        if requested_path not in self.allowed_files:
            self.send_error(404, "File not found or not authorized")
            return
        
        # Servir le fichier réel
        real_path = self.allowed_files[requested_path]
        if not Path(real_path).exists():
            self.send_error(404, "File not found")
            return
        
        try:
            with open(real_path, 'rb') as f:
                self.send_response(200)
                
                # Déterminer le Content-Type
                import mimetypes
                content_type, _ = mimetypes.guess_type(real_path)
                if content_type:
                    self.send_header('Content-Type', content_type)
                
                # Ajouter la taille du fichier
                file_size = Path(real_path).stat().st_size
                self.send_header('Content-Length', str(file_size))
                
                # Headers CORS pour Frame.io
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                
                self.end_headers()
                
                # Streamer le fichier
                while True:
                    chunk = f.read(8192)
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    
        except Exception as e:
            logger.error(f"Erreur serveur fichier {requested_path}: {e}")
            self.send_error(500, "Internal server error")
    
    def do_HEAD(self):
        """Gérer les requêtes HEAD (Frame.io peut vérifier l'existence)"""
        requested_path = self.path.lstrip('/')
        
        if requested_path not in self.allowed_files:
            self.send_error(404, "File not found or not authorized")
            return
        
        real_path = self.allowed_files[requested_path]
        if not Path(real_path).exists():
            self.send_error(404, "File not found")
            return
        
        try:
            self.send_response(200)
            
            # Déterminer le Content-Type
            import mimetypes
            content_type, _ = mimetypes.guess_type(real_path)
            if content_type:
                self.send_header('Content-Type', content_type)
            
            # Ajouter la taille du fichier
            file_size = Path(real_path).stat().st_size
            self.send_header('Content-Length', str(file_size))
            
            # Headers CORS
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            
            self.end_headers()
            
        except Exception as e:
            logger.error(f"Erreur HEAD fichier {requested_path}: {e}")
            self.send_error(500, "Internal server error")
    
    def do_OPTIONS(self):
        """Gérer les requêtes OPTIONS (CORS preflight)"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Rediriger les logs vers notre logger"""
        logger.info(f"HTTP Server: {format % args}")

class PublicFileServer:
    """Serveur HTTP temporaire pour exposer des fichiers locaux"""
    
    def __init__(self, host: str = "0.0.0.0", port: int = 0):
        self.host = host
        self.port = port
        self.server = None
        self.server_thread = None
        self.allowed_files: Dict[str, str] = {}
        self.is_running = False
        self.actual_port = None
        
    def _find_free_port(self) -> int:
        """Trouver un port libre"""
        if self.port != 0:
            return self.port
        
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind(('', 0))
            s.listen(1)
            port = s.getsockname()[1]
        return port
    
    def start(self) -> bool:
        """Démarrer le serveur HTTP"""
        try:
            self.actual_port = self._find_free_port()
            
            # Créer le handler avec les fichiers autorisés
            def handler(*args, **kwargs):
                return SecureFileHandler(*args, allowed_files=self.allowed_files, **kwargs)
            
            self.server = HTTPServer((self.host, self.actual_port), handler)
            
            # Démarrer dans un thread séparé
            self.server_thread = threading.Thread(target=self.server.serve_forever)
            self.server_thread.daemon = True
            self.server_thread.start()
            
            self.is_running = True
            logger.info(f"🌐 Serveur HTTP démarré sur {self.host}:{self.actual_port}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur démarrage serveur: {e}")
            return False
    
    def stop(self):
        """Arrêter le serveur HTTP"""
        if self.server:
            self.server.shutdown()
            self.server.server_close()
            self.is_running = False
            logger.info("🛑 Serveur HTTP arrêté")
    
    def add_file(self, file_path: str, url_path: Optional[str] = None) -> Optional[str]:
        """
        Ajouter un fichier à servir et retourner son URL publique
        
        Args:
            file_path: Chemin vers le fichier local
            url_path: Chemin URL personnalisé (optionnel)
        
        Returns:
            URL publique du fichier ou None si erreur
        """
        try:
            file_path_obj = Path(file_path)
            if not file_path_obj.exists():
                logger.error(f"❌ Fichier inexistant: {file_path}")
                return None
            
            # Générer un nom URL sécurisé
            if not url_path:
                # Utiliser un nom basé sur le hash du chemin + timestamp
                import hashlib
                hash_str = hashlib.md5(f"{file_path}{datetime.now().isoformat()}".encode()).hexdigest()[:8]
                url_path = f"{hash_str}_{quote(file_path_obj.name)}"
            
            # Ajouter à la liste des fichiers autorisés
            self.allowed_files[url_path] = str(file_path_obj.resolve())
            
            # Construire l'URL publique
            public_url = f"http://{self.host}:{self.actual_port}/{url_path}"
            
            logger.info(f"📁 Fichier ajouté: {file_path_obj.name} -> {public_url}")
            return public_url
            
        except Exception as e:
            logger.error(f"❌ Erreur ajout fichier: {e}")
            return None
    
    def remove_file(self, url_path: str):
        """Retirer un fichier de la liste des fichiers autorisés"""
        if url_path in self.allowed_files:
            del self.allowed_files[url_path]
            logger.info(f"🗑️  Fichier retiré: {url_path}")
    
    def get_public_url(self, file_path: str) -> Optional[str]:
        """Obtenir l'URL publique d'un fichier déjà ajouté"""
        file_path_resolved = str(Path(file_path).resolve())
        for url_path, real_path in self.allowed_files.items():
            if real_path == file_path_resolved:
                return f"http://{self.host}:{self.actual_port}/{url_path}"
        return None

@contextmanager
def temporary_file_server(host: str = "0.0.0.0", port: int = 0):
    """Context manager pour un serveur de fichiers temporaire"""
    server = PublicFileServer(host, port)
    try:
        if server.start():
            yield server
        else:
            yield None
    finally:
        server.stop()

# Exemple d'utilisation
if __name__ == "__main__":
    import time
    
    # Test du serveur
    with temporary_file_server() as server:
        if server:
            # Ajouter un fichier de test
            test_file = "/Users/home/Library/CloudStorage/OneDrive-Personnel/WORK/_DEV/rl_postflow/data/TEST_DEFAUT_VIDEO.mp4"
            if Path(test_file).exists():
                url = server.add_file(test_file)
                print(f"URL publique: {url}")
                
                # Garder le serveur actif pour test
                print("Serveur actif - Ctrl+C pour arrêter")
                try:
                    while True:
                        time.sleep(1)
                except KeyboardInterrupt:
                    print("\nArrêt du serveur...")
            else:
                print("Fichier de test non trouvé")
        else:
            print("Erreur démarrage serveur")
