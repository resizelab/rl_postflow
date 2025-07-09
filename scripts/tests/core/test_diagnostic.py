#!/usr/bin/env python3
"""
Test de diagnostic pour analyser les requêtes de Frame.io
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

class DiagnosticRangeServer(RangeFileServer):
    """Serveur HTTP avec diagnostic détaillé"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.access_log = []
        self.total_bytes_served = 0
        self.request_count = 0
    
    def _serve_range(self, file_path: str, start: int, end: int, file_size: int):
        """Servir une plage avec diagnostic"""
        self.request_count += 1
        content_length = end - start + 1
        self.total_bytes_served += content_length
        
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
            return "Aucune requête reçue"
        
        file_size = self.access_log[0]['file_size']
        coverage = (self.total_bytes_served / file_size) * 100 if file_size > 0 else 0
        
        report = f"""
📊 RAPPORT DE DIAGNOSTIC
========================
Requêtes reçues: {self.request_count}
Bytes total servis: {self.total_bytes_served:,}
Taille du fichier: {file_size:,}
Couverture: {coverage:.1f}%
        """
        
        for i, entry in enumerate(self.access_log, 1):
            if entry['type'] == 'range':
                report += f"\n{i}. Range: {entry['start']}-{entry['end']} ({entry['content_length']:,} bytes)"
            else:
                report += f"\n{i}. Complete: {entry['content_length']:,} bytes"
        
        return report

async def test_diagnostic_upload(file_path: str):
    """Test avec diagnostic détaillé"""
    try:
        test_file = Path(file_path)
        if not test_file.exists():
            logger.error(f"❌ Fichier non trouvé: {file_path}")
            return False
        
        logger.info(f"🚀 Test diagnostic détaillé...")
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
        
        # Démarrer le serveur HTTP de diagnostic
        diagnostic_server = DiagnosticRangeServer(host="127.0.0.1", port=0)
        if not diagnostic_server.start():
            logger.error("❌ Impossible de démarrer le serveur diagnostic")
            return False
        
        logger.info(f"✅ Serveur diagnostic démarré sur port {diagnostic_server.actual_port}")
        
        # Démarrer ngrok
        ngrok_manager = NgrokTunnelManager(diagnostic_server.actual_port)
        if not await ngrok_manager.start():
            logger.error("❌ Impossible de démarrer ngrok")
            diagnostic_server.stop()
            return False
        
        logger.info(f"✅ Tunnel ngrok actif: {ngrok_manager.public_url}")
        
        # Exposer le fichier
        local_url = diagnostic_server.add_file(str(test_file))
        if not local_url:
            logger.error("❌ Impossible d'exposer le fichier")
            ngrok_manager.stop()
            diagnostic_server.stop()
            return False
        
        # Construire l'URL publique
        file_name = local_url.split('/')[-1]
        public_url = f"{ngrok_manager.public_url}/{file_name}"
        
        logger.info(f"🌐 URL publique: {public_url}")
        
        # Créer les managers Frame.io
        auth = create_frameio_auth()
        structure_manager = FrameIOStructureManager(auth)
        upload_manager = FrameIOUploadManager(auth)
        
        # Récupérer le projet
        projects = await structure_manager.get_projects()
        if not projects:
            logger.error("❌ Aucun projet trouvé")
            ngrok_manager.stop()
            diagnostic_server.stop()
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
            
            # Attendre un peu pour que Frame.io télécharge
            logger.info("⏳ Attente du téléchargement par Frame.io (30 secondes)...")
            await asyncio.sleep(30)
            
            # Afficher le rapport de diagnostic
            logger.info("📊 Génération du rapport de diagnostic...")
            report = diagnostic_server.get_diagnostic_report()
            print("\n" + report)
            
            # Construire l'URL de visualisation
            view_url = f"https://app.frame.io/project/{target_project.id}/asset/{frameio_file.id}"
            logger.info(f"🔗 View URL: {view_url}")
            
            success = True
        else:
            logger.error("❌ Échec upload")
            success = False
        
        # Cleanup
        ngrok_manager.stop()
        diagnostic_server.stop()
        
        return success
        
    except Exception as e:
        logger.error(f"❌ Erreur test diagnostic: {e}")
        return False

async def main():
    """Fonction principale"""
    if len(sys.argv) != 2:
        print("Usage: python test_diagnostic.py <fichier_lucidlink>")
        return 1
    
    file_path = sys.argv[1]
    success = await test_diagnostic_upload(file_path)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
