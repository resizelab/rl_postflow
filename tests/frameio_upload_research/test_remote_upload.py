#!/usr/bin/env python3
"""
Test d'upload avec remote_upload - SOLUTION DE CONTOURNEMENT
"""

import asyncio
import sys
from pathlib import Path
import threading
import http.server
import socketserver
from urllib.parse import quote
import time

sys.path.insert(0, str(Path(__file__).parent))

from src.integrations.frameio.auth import FrameIOAuth

class FileHandler(http.server.SimpleHTTPRequestHandler):
    """Handler HTTP pour servir un fichier spécifique"""
    def __init__(self, file_path, *args, **kwargs):
        self.file_path = file_path
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        if self.path.endswith(self.file_path.name):
            self.send_response(200)
            self.send_header('Content-Type', 'video/mp4')
            self.send_header('Content-Length', str(self.file_path.stat().st_size))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            with open(self.file_path, 'rb') as f:
                self.wfile.write(f.read())
        else:
            self.send_error(404)

def start_file_server(file_path, port=8000):
    """Démarrer un serveur HTTP temporaire pour servir le fichier"""
    handler = lambda *args, **kwargs: FileHandler(file_path, *args, **kwargs)
    
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"🌐 Serveur HTTP démarré sur port {port}")
        print(f"📁 Servant: {file_path.name}")
        httpd.serve_forever()

async def test_remote_upload():
    try:
        # Utiliser le vrai fichier vidéo
        video_file = Path(__file__).parent / 'data' / 'TEST_DEFAUT_VIDEO.mp4'
        
        if not video_file.exists():
            print(f"❌ Fichier vidéo non trouvé: {video_file}")
            return
        
        file_size = video_file.stat().st_size
        print(f"📄 Fichier vidéo: {video_file.name}")
        print(f"📏 Taille: {file_size:,} bytes ({file_size/1024/1024:.2f} MB)")
        
        # Démarrer un serveur HTTP en arrière-plan
        port = 8000
        server_thread = threading.Thread(
            target=start_file_server, 
            args=(video_file, port),
            daemon=True
        )
        server_thread.start()
        
        # Attendre que le serveur démarre
        time.sleep(2)
        
        # URL du fichier servi localement
        file_url = f"http://localhost:{port}/{quote(video_file.name)}"
        print(f"🌐 URL du fichier: {file_url}")
        
        # Initialiser l'auth
        auth = FrameIOAuth()
        
        # Configuration
        folder_id = '596cc581-b95d-4da3-a9af-514fbe152a29'  # UNDLM_00001
        account_id = '60b535d5-8508-459a-8dd6-98ffb0c3eb78'
        base_url = 'https://api.frame.io/v4'
        
        # Utiliser remote_upload au lieu de local_upload
        url = f"{base_url}/accounts/{account_id}/folders/{folder_id}/files/remote_upload"
        
        payload = {
            "data": {
                "name": video_file.name,
                "source_url": file_url
            }
        }
        
        print(f"📡 Upload via remote_upload...")
        print(f"🎯 URL: {url}")
        print(f"📤 Payload: {payload}")
        
        response = await auth.request("POST", url, json=payload)
        response.raise_for_status()
        
        response_data = response.json()
        file_data = response_data.get("data", {})
        
        print(f"✅ Upload réussi!")
        print(f"📁 File ID: {file_data.get('id')}")
        print(f"📊 Status: {file_data.get('status')}")
        print(f"🔗 View URL: {file_data.get('view_url')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    asyncio.run(test_remote_upload())
