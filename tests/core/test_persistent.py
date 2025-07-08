#!/usr/bin/env python3
"""
Test avec serveur persistant pour Frame.io
"""

import asyncio
import logging
import sys
import time
from pathlib import Path

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.integrations.frameio.auth import create_frameio_auth
from src.integrations.frameio.upload import FrameIOUploadManager
from src.integrations.frameio.structure import FrameIOStructureManager
from src.integrations.frameio.range_server import RangeFileServer
from src.integrations.frameio.production_upload import NgrokTunnelManager
from src.utils.lucidlink_utils import lucidlink_waiter, lucidlink_detector

class PersistentDiagnosticServer(RangeFileServer):
    """Serveur HTTP avec diagnostic et persistance"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.access_log = []
        self.total_bytes_served = 0
        self.request_count = 0
        self.last_activity = None
    
    def _serve_range(self, file_path: str, start: int, end: int, file_size: int):
        """Servir une plage avec diagnostic"""
        self.request_count += 1
        content_length = end - start + 1
        self.total_bytes_served += content_length
        self.last_activity = time.time()
        
        log_entry = {
            'type': 'range',
            'start': start,
            'end': end,
            'content_length': content_length,
            'file_size': file_size,
            'timestamp': time.time()
        }
        self.access_log.append(log_entry)
        
        logger.info(f"📊 Range request #{self.request_count}: bytes {start}-{end} ({content_length:,} bytes)")
        logger.info(f"📈 Total servi: {self.total_bytes_served:,} / {file_size:,} bytes ({(self.total_bytes_served/file_size)*100:.1f}%)")
        
        super()._serve_range(file_path, start, end, file_size)
    
    def _serve_complete_file(self, file_path: str, file_size: int):
        """Servir le fichier complet avec diagnostic"""
        self.request_count += 1
        self.total_bytes_served += file_size
        self.last_activity = time.time()
        
        log_entry = {
            'type': 'complete',
            'content_length': file_size,
            'file_size': file_size,
            'timestamp': time.time()
        }
        self.access_log.append(log_entry)
        
        logger.info(f"📊 Complete request #{self.request_count}: {file_size:,} bytes")
        
        super()._serve_complete_file(file_path, file_size)
    
    def get_diagnostic_report(self):
        """Générer un rapport de diagnostic"""
        if not self.access_log:
            return "❌ Aucune requête reçue de Frame.io"
        
        file_size = self.access_log[0]['file_size']
        coverage = (self.total_bytes_served / file_size) * 100 if file_size > 0 else 0
        
        report = f"""
📊 RAPPORT DE DIAGNOSTIC
========================
Requêtes reçues: {self.request_count}
Bytes total servis: {self.total_bytes_served:,}
Taille du fichier: {file_size:,}
Couverture: {coverage:.1f}%
Dernière activité: {time.ctime(self.last_activity) if self.last_activity else 'Aucune'}
        """
        
        for i, entry in enumerate(self.access_log, 1):
            if entry['type'] == 'range':
                report += f"\n{i}. Range: {entry['start']}-{entry['end']} ({entry['content_length']:,} bytes)"
            else:
                report += f"\n{i}. Complete: {entry['content_length']:,} bytes"
        
        return report

async def check_upload_status(auth, file_id: str, max_checks: int = 10) -> dict:
    """Vérifier le statut d'upload Frame.io"""
    for i in range(max_checks):
        try:
            # Récupérer les informations du fichier
            response = await auth.request("GET", f"https://api.frame.io/v4/files/{file_id}")
            if response.status_code == 200:
                file_data = response.json()
                logger.info(f"📊 Statut #{i+1}: {file_data.get('processing_status', 'unknown')}")
                logger.info(f"📏 Taille actuelle: {file_data.get('filesize', 0):,} bytes")
                return file_data
            else:
                logger.warning(f"⚠️ Erreur récupération statut: {response.status_code}")
        except Exception as e:
            logger.warning(f"⚠️ Erreur vérification statut: {e}")
        
        await asyncio.sleep(5)  # Attendre 5 secondes entre les vérifications
    
    return {}

async def test_persistent_upload(file_path: str):
    """Test avec serveur persistant"""
    try:
        test_file = Path(file_path)
        if not test_file.exists():
            logger.error(f"❌ Fichier non trouvé: {file_path}")
            return False
        
        logger.info(f"🚀 Test avec serveur persistant...")
        logger.info(f"📄 Fichier: {test_file}")
        logger.info(f"📏 Taille: {test_file.stat().st_size:,} bytes")
        
        # Vérifier et mettre en cache le fichier LucidLink
        if lucidlink_detector.is_lucidlink_file(test_file):
            logger.info("🔄 Fichier LucidLink détecté, vérification du cache...")
            cache_ok = await lucidlink_waiter.wait_for_complete_sync(test_file, max_wait=300)
            if not cache_ok:
                logger.error("❌ Échec mise en cache LucidLink")
                return False
            logger.info("✅ Fichier LucidLink en cache")
        
        # Démarrer le serveur HTTP persistant
        persistent_server = PersistentDiagnosticServer(host="127.0.0.1", port=0)
        if not persistent_server.start():
            logger.error("❌ Impossible de démarrer le serveur persistant")
            return False
        
        logger.info(f"✅ Serveur persistant démarré sur port {persistent_server.actual_port}")
        
        # Démarrer ngrok
        ngrok_manager = NgrokTunnelManager(persistent_server.actual_port)
        if not await ngrok_manager.start():
            logger.error("❌ Impossible de démarrer ngrok")
            persistent_server.stop()
            return False
        
        logger.info(f"✅ Tunnel ngrok actif: {ngrok_manager.public_url}")
        
        # Exposer le fichier
        local_url = persistent_server.add_file(str(test_file))
        if not local_url:
            logger.error("❌ Impossible d'exposer le fichier")
            ngrok_manager.stop()
            persistent_server.stop()
            return False
        
        # Construire l'URL publique
        file_name = local_url.split('/')[-1]
        public_url = f"{ngrok_manager.public_url}/{file_name}"
        
        logger.info(f"🌐 URL publique: {public_url}")
        
        # Test manuel de l'URL
        logger.info("🔧 Test de l'URL ngrok...")
        try:
            import subprocess
            result = subprocess.run(['curl', '-I', public_url], capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                logger.info("✅ URL ngrok accessible")
            else:
                logger.warning(f"⚠️ Problème avec URL ngrok: {result.stderr}")
        except Exception as e:
            logger.warning(f"⚠️ Erreur test URL: {e}")
        
        # Créer les managers Frame.io
        auth = create_frameio_auth()
        structure_manager = FrameIOStructureManager(auth)
        upload_manager = FrameIOUploadManager(auth)
        
        # Récupérer le projet
        projects = await structure_manager.get_projects()
        if not projects:
            logger.error("❌ Aucun projet trouvé")
            ngrok_manager.stop()
            persistent_server.stop()
            return False
        
        target_project = projects[0]
        logger.info(f"🎬 Projet cible: {target_project.name}")
        
        # Upload avec remote_upload
        logger.info("📤 Démarrage remote upload...")
        frameio_file = await upload_manager._create_file_remote_upload(
            str(test_file),
            target_project.root_folder_id,
            public_url
        )
        
        if frameio_file:
            logger.info("✅ Upload initié avec succès !")
            logger.info(f"🎬 Frame.io File ID: {frameio_file.id}")
            
            # Surveiller l'activité du serveur et le statut Frame.io
            logger.info("⏳ Surveillance de l'activité (5 minutes max)...")
            
            start_time = time.time()
            max_wait_time = 300  # 5 minutes
            
            while (time.time() - start_time) < max_wait_time:
                # Vérifier le statut Frame.io
                file_status = await check_upload_status(auth, frameio_file.id, max_checks=1)
                
                # Vérifier l'activité du serveur
                if persistent_server.last_activity:
                    time_since_activity = time.time() - persistent_server.last_activity
                    logger.info(f"📡 Dernière activité serveur: {time_since_activity:.1f}s ago")
                else:
                    logger.info("📡 Aucune activité serveur détectée")
                
                await asyncio.sleep(10)  # Vérifier toutes les 10 secondes
            
            # Rapport final
            logger.info("📊 Génération du rapport final...")
            report = persistent_server.get_diagnostic_report()
            print("\n" + report)
            
            # Construire l'URL de visualisation
            view_url = f"https://app.frame.io/project/{target_project.id}/asset/{frameio_file.id}"
            logger.info(f"🔗 View URL: {view_url}")
            
            success = True
        else:
            logger.error("❌ Échec upload")
            success = False
        
        # Cleanup
        logger.info("🛑 Arrêt des services...")
        ngrok_manager.stop()
        persistent_server.stop()
        
        return success
        
    except Exception as e:
        logger.error(f"❌ Erreur test persistant: {e}")
        return False

async def main():
    """Fonction principale"""
    if len(sys.argv) != 2:
        print("Usage: python test_persistent.py <fichier_lucidlink>")
        return 1
    
    file_path = sys.argv[1]
    success = await test_persistent_upload(file_path)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
