"""
Serveur HTTP amélioré avec support des Range requests pour Frame.io
"""

import logging
import socket
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from typing import Dict, Optional
import mimetypes

logger = logging.getLogger(__name__)

class RangeHTTPRequestHandler(BaseHTTPRequestHandler):
    """Handler HTTP avec support des Range requests"""
    
    def __init__(self, *args, allowed_files: Dict[str, str], **kwargs):
        self.allowed_files = allowed_files
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        """Gérer les requêtes GET avec support des Range requests"""
        requested_path = self.path.lstrip('/')
        client_ip = self.client_address[0]
        user_agent = self.headers.get('User-Agent', 'Unknown')
        
        logger.info(f"🌐 Requête GET: {requested_path} de {client_ip}")
        logger.info(f"🤖 User-Agent: {user_agent}")
        
        # Gérer les requêtes de test de connectivité (racine)
        if requested_path == "" or requested_path == "/":
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = b'{"status": "ok", "service": "PostFlow Range Server"}'
            self.wfile.write(response)
            logger.info("✅ Requête de test de connectivité répondue")
            return
        
        # Vérifier si le fichier est autorisé
        if requested_path not in self.allowed_files:
            logger.warning(f"❌ Fichier non autorisé: {requested_path}")
            self.send_error(404, "File not found or not authorized")
            return
        
        # Servir le fichier réel
        real_path = self.allowed_files[requested_path]
        if not Path(real_path).exists():
            logger.error(f"❌ Fichier physique non trouvé: {real_path}")
            self.send_error(404, "File not found")
            return
        
        try:
            # Obtenir la taille du fichier
            file_size = Path(real_path).stat().st_size
            
            # Vérifier si c'est une requête Range
            range_header = self.headers.get('Range')
            if range_header:
                logger.info(f"📊 Range request: {range_header}")
                # Parse Range header (format: bytes=start-end)
                try:
                    range_match = range_header.replace('bytes=', '')
                    if '-' in range_match:
                        start, end = range_match.split('-', 1)
                        start = int(start) if start else 0
                        end = int(end) if end else file_size - 1
                        
                        # Valider la plage
                        if start >= file_size or end >= file_size or start > end:
                            self.send_error(416, "Requested Range Not Satisfiable")
                            return
                        
                        # Servir la plage
                        self._serve_range(real_path, start, end, file_size)
                        return
                except ValueError:
                    # Range header invalide, servir tout le fichier
                    pass
            
            # Servir le fichier complet
            self._serve_complete_file(real_path, file_size)
                    
        except Exception as e:
            logger.error(f"Erreur serveur fichier {requested_path}: {e}")
            self.send_error(500, "Internal server error")
    
    def _serve_range(self, file_path: str, start: int, end: int, file_size: int):
        """Servir une plage de bytes du fichier"""
        try:
            with open(file_path, 'rb') as f:
                content_length = end - start + 1
                
                self.send_response(206)  # Partial Content
                
                # Déterminer le Content-Type
                content_type, _ = mimetypes.guess_type(file_path)
                if content_type:
                    self.send_header('Content-Type', content_type)
                
                self.send_header('Content-Length', str(content_length))
                self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
                self.send_header('Accept-Ranges', 'bytes')
                
                # Headers CORS
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type, Range')
                
                self.end_headers()
                
                # Aller au début de la plage
                f.seek(start)
                
                # Streamer la plage
                bytes_to_read = content_length
                while bytes_to_read > 0:
                    chunk_size = min(8192, bytes_to_read)
                    chunk = f.read(chunk_size)
                    if not chunk:
                        break
                    try:
                        self.wfile.write(chunk)
                        bytes_to_read -= len(chunk)
                    except (ConnectionResetError, BrokenPipeError, OSError):
                        # Client a fermé la connexion - normal pour Frame.io
                        logger.info(f"🔌 Connexion fermée pendant range request: {Path(file_path).name}")
                        return
                    
        except (ConnectionResetError, BrokenPipeError, OSError) as e:
            # Connexion fermée par le client - c'est normal pour Frame.io
            logger.info(f"🔌 Connexion fermée pendant range request: {Path(file_path).name}")
        except Exception as e:
            logger.error(f"Erreur serveur range {file_path}: {e}")
            try:
                self.send_error(500, "Internal server error")
            except:
                pass
    
    def _serve_complete_file(self, file_path: str, file_size: int):
        """Servir le fichier complet avec gestion robuste des erreurs"""
        try:
            with open(file_path, 'rb') as f:
                self.send_response(200)
                
                # Déterminer le Content-Type
                content_type, _ = mimetypes.guess_type(file_path)
                if content_type:
                    self.send_header('Content-Type', content_type)
                
                self.send_header('Content-Length', str(file_size))
                self.send_header('Accept-Ranges', 'bytes')
                
                # Headers CORS pour Frame.io
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type, Range')
                
                self.end_headers()
                
                # Streamer le fichier avec gestion des erreurs de connexion
                bytes_sent = 0
                chunk_size = 8192
                
                while bytes_sent < file_size:
                    try:
                        chunk = f.read(chunk_size)
                        if not chunk:
                            break
                        
                        self.wfile.write(chunk)
                        bytes_sent += len(chunk)
                        
                        # Log du progrès tous les 100MB ou 25% pour éviter le spam
                        if bytes_sent % (100 * 1024 * 1024) == 0 or bytes_sent % (file_size // 4) == 0:
                            progress = (bytes_sent / file_size) * 100
                            logger.info(f"📤 Streaming: {progress:.1f}% ({bytes_sent:,}/{file_size:,} bytes)")
                            
                    except (ConnectionResetError, BrokenPipeError, OSError) as e:
                        # Client a fermé la connexion - c'est normal pour Frame.io
                        logger.info(f"🔌 Connexion fermée par client: {bytes_sent:,}/{file_size:,} bytes envoyés ({(bytes_sent/file_size)*100:.1f}%)")
                        return
                    except Exception as e:
                        logger.error(f"❌ Erreur streaming: {e}")
                        return
                
                logger.info(f"✅ Fichier complet envoyé: {bytes_sent:,} bytes")
                    
        except (ConnectionResetError, BrokenPipeError, OSError) as e:
            # Connexion fermée par le client - c'est normal pour Frame.io
            logger.info(f"🔌 Connexion fermée pendant l'envoi: {e}")
            logger.info(f"   Fichier: {Path(file_path).name}")
        except Exception as e:
            logger.error(f"❌ Erreur serveur fichier complet {file_path}: {e}")
            try:
                self.send_error(500, "Internal server error")
            except:
                pass  # Ignorer si on ne peut pas envoyer l'erreur
    
    def do_HEAD(self):
        """Gérer les requêtes HEAD"""
        requested_path = self.path.lstrip('/')
        
        # Gérer les requêtes de test de connectivité (racine)
        if requested_path == "" or requested_path == "/":
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', '52')
            self.end_headers()
            return
        
        if requested_path not in self.allowed_files:
            self.send_error(404, "File not found or not authorized")
            return
        
        real_path = self.allowed_files[requested_path]
        if not Path(real_path).exists():
            self.send_error(404, "File not found")
            return
        
        try:
            file_size = Path(real_path).stat().st_size
            
            self.send_response(200)
            
            # Déterminer le Content-Type
            content_type, _ = mimetypes.guess_type(real_path)
            if content_type:
                self.send_header('Content-Type', content_type)
            
            self.send_header('Content-Length', str(file_size))
            self.send_header('Accept-Ranges', 'bytes')
            
            # Headers CORS
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Range')
            
            self.end_headers()
            
        except Exception as e:
            logger.error(f"Erreur HEAD fichier {requested_path}: {e}")
            self.send_error(500, "Internal server error")
    
    def do_OPTIONS(self):
        """Gérer les requêtes OPTIONS (CORS preflight)"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Range')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Rediriger les logs vers notre logger"""
        logger.info(f"HTTP Server: {format % args}")


class RangeFileServer:
    """Serveur HTTP temporaire avec support des Range requests"""
    
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
                return RangeHTTPRequestHandler(*args, allowed_files=self.allowed_files, **kwargs)
            
            self.server = HTTPServer((self.host, self.actual_port), handler)
            
            # Démarrer dans un thread séparé
            self.server_thread = threading.Thread(target=self.server.serve_forever, daemon=True)
            self.server_thread.start()
            
            self.is_running = True
            logger.info(f"🌐 Serveur HTTP démarré sur {self.host}:{self.actual_port}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur démarrage serveur: {e}")
            return False
    
    def stop(self):
        """Arrêter le serveur"""
        if self.server:
            self.server.shutdown()
            self.server.server_close()
            self.is_running = False
            logger.info("🛑 Serveur HTTP arrêté")
    
    def add_file(self, file_path: str) -> Optional[str]:
        """Ajouter un fichier à servir"""
        try:
            if not Path(file_path).exists():
                logger.error(f"❌ Fichier non trouvé: {file_path}")
                return None
            
            # Générer un nom VRAIMENT unique pour l'URL (avec timestamp)
            import hashlib
            import os
            import time
            
            timestamp = str(int(time.time() * 1000))  # timestamp en millisecondes
            file_hash = hashlib.md5(f"{file_path}{timestamp}".encode()).hexdigest()[:8]
            file_name = Path(file_path).name
            url_name = f"{timestamp}_{file_hash}_{file_name}"
            
            # Ajouter à la liste des fichiers autorisés
            self.allowed_files[url_name] = file_path
            
            # Retourner l'URL locale
            local_url = f"http://{self.host}:{self.actual_port}/{url_name}"
            
            logger.info(f"📁 Fichier ajouté: {file_name} -> {local_url}")
            return local_url
            
        except Exception as e:
            logger.error(f"❌ Erreur ajout fichier: {e}")
            return None
    
    def serve_file(self, file_path: str) -> Optional[str]:
        """Servir un fichier et retourner son URL"""
        return self.add_file(file_path)
    
    def remove_file(self, url_name: str):
        """Supprimer un fichier de la liste"""
        if url_name in self.allowed_files:
            del self.allowed_files[url_name]
            logger.info(f"🗑️ Fichier supprimé: {url_name}")
