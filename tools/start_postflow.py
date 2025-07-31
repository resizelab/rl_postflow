#!/usr/bin/env python3
"""
Script de démarrage pour PostFlow avec Tracking Intelligent
Production ready avec Cloudflare Tunnel
"""

import sys
import os
import time
import logging
import json
import signal
import threading
from datetime import datetime

# Ajouter le répertoire parent pour les imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.services.webhook_service import WebhookService
from src.utils.upload_tracker import UploadTracker

class PostFlowService:
    """Service principal PostFlow avec tracking intelligent"""
    
    def __init__(self):
        self.webhook_service = None
        self.upload_tracker = None
        self.config = None
        self.running = False
        
        # Configuration logging
        self._setup_logging()
        
        # Gestionnaire d'arrêt propre
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
        
    def _setup_logging(self):
        """Configure le logging pour la production"""
        log_dir = os.path.join(os.path.dirname(__file__), '..', 'logs')
        os.makedirs(log_dir, exist_ok=True)
        
        log_file = os.path.join(log_dir, f'postflow_{datetime.now().strftime("%Y%m%d")}.log')
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler(sys.stdout)
            ]
        )
        
        self.logger = logging.getLogger('PostFlowService')
        
    def _signal_handler(self, signum, frame):
        """Gestionnaire pour arrêt propre"""
        self.logger.info(f"Signal {signum} reçu, arrêt en cours...")
        self.stop()
        
    def load_config(self):
        """Charge la configuration du projet"""
        try:
            config_path = os.path.join(os.path.dirname(__file__), '..', 'pipeline_config.json')
            with open(config_path, 'r', encoding='utf-8') as f:
                self.config = json.load(f)
                
            self.logger.info("Configuration chargée avec succès")
            return True
            
        except Exception as e:
            self.logger.error(f"Erreur chargement configuration: {e}")
            return False
    
    def start(self):
        """Démarre le service PostFlow"""
        self.logger.info("🚀 Démarrage PostFlow avec Tracking Intelligent")
        
        # Charger la configuration
        if not self.load_config():
            return False
        
        # Vérifier que les services sont activés
        webhook_config = self.config.get('webhook', {})
        if not webhook_config.get('enabled', False):
            self.logger.error("Service webhook désactivé dans la configuration")
            return False
        
        # Créer les services
        try:
            self.upload_tracker = UploadTracker()
            self.webhook_service = WebhookService(
                upload_tracker=self.upload_tracker,
                config=self.config,
                auto_start=True
            )
            
            # Démarrer le service webhook
            if not self.webhook_service.start_service():
                self.logger.error("Échec démarrage service webhook")
                return False
                
            webhook_url = self.webhook_service.get_webhook_url()
            self.logger.info(f"✅ Service webhook actif: {webhook_url}")
            
            # Vérifier le tracking intelligent
            if self.webhook_service.intelligent_tracker:
                self.logger.info("🧠 Tracking intelligent activé")
            else:
                self.logger.warning("⚠️ Tracking intelligent non disponible")
            
            self.running = True
            
            # Démarrer le monitoring en arrière-plan
            self._start_monitoring()
            
            self.logger.info("🌟 PostFlow démarré avec succès!")
            self.logger.info(f"   🌐 Webhook URL: {webhook_url}")
            self.logger.info(f"   🧠 Tracking intelligent: {'Actif' if self.webhook_service.intelligent_tracker else 'Inactif'}")
            self.logger.info(f"   📁 Logs: logs/postflow_{datetime.now().strftime('%Y%m%d')}.log")
            
            return True
            
        except Exception as e:
            self.logger.error(f"Erreur démarrage service: {e}")
            import traceback
            self.logger.error(traceback.format_exc())
            return False
    
    def _start_monitoring(self):
        """Démarre le monitoring en arrière-plan"""
        def monitor():
            last_stats = {}
            
            while self.running:
                try:
                    time.sleep(60)  # Monitoring chaque minute
                    
                    if not self.running:
                        break
                    
                    # Obtenir les stats
                    stats = self.webhook_service.get_intelligent_tracking_stats()
                    
                    if "error" not in stats:
                        events_processed = stats.get('events_processed', 0)
                        last_events = last_stats.get('events_processed', 0)
                        
                        if events_processed != last_events:
                            self.logger.info(f"📊 Événements traités: {events_processed} (+{events_processed - last_events})")
                            
                        # Log des stats importantes
                        active_tracks = stats.get('active_tracks', 0)
                        if active_tracks > 0:
                            self.logger.info(f"📈 Uploads actifs: {active_tracks}")
                            
                        last_stats = stats
                    
                    # Vérifier l'état du service
                    service_status = self.webhook_service.get_service_status()
                    if service_status.get('status') != 'running':
                        self.logger.warning(f"⚠️ Statut service: {service_status.get('status')}")
                        
                except Exception as e:
                    self.logger.error(f"Erreur monitoring: {e}")
                    
        monitor_thread = threading.Thread(target=monitor, daemon=True)
        monitor_thread.start()
        
    def stop(self):
        """Arrête le service PostFlow"""
        self.logger.info("🛑 Arrêt PostFlow...")
        
        self.running = False
        
        if self.webhook_service:
            self.webhook_service.stop_service()
            
        self.logger.info("✅ PostFlow arrêté")
        
    def get_status(self):
        """Retourne le statut du service"""
        if not self.webhook_service:
            return {"status": "stopped"}
            
        service_status = self.webhook_service.get_service_status()
        stats = self.webhook_service.get_intelligent_tracking_stats()
        
        return {
            "status": "running" if self.running else "stopped",
            "webhook": service_status,
            "intelligent_tracking": stats
        }
        
    def register_upload(self, upload_id, filename, file_id=None, project_id=None, workspace_id=None):
        """Interface pour enregistrer un upload pour tracking"""
        if not self.webhook_service:
            self.logger.error("Service non démarré")
            return False
            
        success = self.webhook_service.register_upload_for_intelligent_tracking(
            upload_id=upload_id,
            filename=filename, 
            file_id=file_id,
            project_id=project_id,
            workspace_id=workspace_id
        )
        
        if success:
            self.logger.info(f"✅ Upload enregistré pour tracking: {filename}")
        else:
            self.logger.error(f"❌ Échec enregistrement upload: {filename}")
            
        return success
        
    def get_upload_details(self, upload_id):
        """Obtient les détails d'un upload"""
        if not self.webhook_service:
            return None
            
        return self.webhook_service.get_upload_tracking_details(upload_id)

def main():
    """Point d'entrée principal"""
    
    print("🎬 PostFlow - Système de Tracking Intelligent")
    print("=" * 50)
    
    # Créer et démarrer le service
    postflow = PostFlowService()
    
    if not postflow.start():
        print("❌ Échec démarrage PostFlow")
        sys.exit(1)
    
    try:
        # Boucle principale
        while postflow.running:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n🛑 Arrêt demandé...")
        
    finally:
        postflow.stop()

if __name__ == "__main__":
    main()
