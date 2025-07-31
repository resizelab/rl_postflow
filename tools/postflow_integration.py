#!/usr/bin/env python3
"""
Module d'intégration PostFlow pour tracking intelligent
À utiliser dans vos scripts existants
"""

import sys
import os
import logging
import json
from typing import Optional, Dict, Any

# Ajouter le répertoire parent pour les imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.services.webhook_service import WebhookService
from src.utils.upload_tracker import UploadTracker

class PostFlowIntegration:
    """
    Classe d'intégration pour ajouter le tracking intelligent
    à vos workflows existants
    """
    
    def __init__(self, config_path: Optional[str] = None):
        """
        Initialise l'intégration PostFlow
        
        Args:
            config_path: Chemin vers pipeline_config.json (optionnel)
        """
        self.webhook_service = None
        self.upload_tracker = None
        self.config = None
        self.logger = logging.getLogger('PostFlowIntegration')
        
        # Charger la configuration
        if not self._load_config(config_path):
            raise Exception("Impossible de charger la configuration")
            
        # Initialiser les services
        self._init_services()
    
    def _load_config(self, config_path: Optional[str] = None) -> bool:
        """Charge la configuration"""
        try:
            if config_path is None:
                # Chercher pipeline_config.json dans le répertoire parent
                config_path = os.path.join(
                    os.path.dirname(os.path.dirname(__file__)), 
                    'pipeline_config.json'
                )
            
            with open(config_path, 'r', encoding='utf-8') as f:
                self.config = json.load(f)
            
            return True
        except Exception as e:
            self.logger.error(f"Erreur chargement config: {e}")
            return False
    
    def _init_services(self):
        """Initialise les services"""
        try:
            self.upload_tracker = UploadTracker()
            self.webhook_service = WebhookService(
                upload_tracker=self.upload_tracker,
                config=self.config,
                auto_start=False  # Ne pas démarrer automatiquement
            )
        except Exception as e:
            self.logger.error(f"Erreur initialisation services: {e}")
            raise
    
    def start_tracking(self) -> bool:
        """
        Démarre le service de tracking
        
        Returns:
            bool: True si succès
        """
        try:
            if not self.webhook_service.start_service():
                self.logger.error("Échec démarrage service webhook")
                return False
            
            webhook_url = self.webhook_service.get_webhook_url()
            self.logger.info(f"Service webhook démarré: {webhook_url}")
            
            return True
        except Exception as e:
            self.logger.error(f"Erreur démarrage tracking: {e}")
            return False
    
    def stop_tracking(self):
        """Arrête le service de tracking"""
        if self.webhook_service:
            self.webhook_service.stop_service()
            self.logger.info("Service webhook arrêté")
    
    def register_upload(self, 
                       upload_id: str, 
                       filename: str,
                       file_id: Optional[str] = None,
                       project_id: Optional[str] = None,
                       workspace_id: Optional[str] = None) -> bool:
        """
        Enregistre un upload pour le tracking intelligent
        
        Args:
            upload_id: ID unique de l'upload
            filename: Nom du fichier
            file_id: ID Frame.io du fichier (optionnel)
            project_id: ID du projet Frame.io (optionnel)
            workspace_id: ID du workspace Frame.io (optionnel)
            
        Returns:
            bool: True si succès
        """
        if not self.webhook_service:
            self.logger.error("Service non initialisé")
            return False
        
        return self.webhook_service.register_upload_for_intelligent_tracking(
            upload_id=upload_id,
            filename=filename,
            file_id=file_id,
            project_id=project_id,
            workspace_id=workspace_id
        )
    
    def get_upload_status(self, upload_id: str) -> Optional[Dict[str, Any]]:
        """
        Obtient le statut d'un upload
        
        Args:
            upload_id: ID de l'upload
            
        Returns:
            Dict avec les détails de l'upload ou None
        """
        if not self.webhook_service:
            return None
        
        return self.webhook_service.get_upload_tracking_details(upload_id)
    
    def get_tracking_stats(self) -> Dict[str, Any]:
        """
        Obtient les statistiques de tracking
        
        Returns:
            Dict avec les statistiques
        """
        if not self.webhook_service:
            return {"error": "Service non initialisé"}
        
        return self.webhook_service.get_intelligent_tracking_stats()
    
    def is_upload_ready(self, upload_id: str) -> bool:
        """
        Vérifie si un upload est prêt (status = ready)
        
        Args:
            upload_id: ID de l'upload
            
        Returns:
            bool: True si prêt
        """
        details = self.get_upload_status(upload_id)
        if not details:
            return False
            
        return details.get('status') == 'ready'
    
    def is_upload_approved(self, upload_id: str) -> bool:
        """
        Vérifie si un upload est approuvé
        
        Args:
            upload_id: ID de l'upload
            
        Returns:
            bool: True si approuvé
        """
        details = self.get_upload_status(upload_id)
        if not details:
            return False
            
        return details.get('review_status') == 'approved'
    
    def wait_for_upload_ready(self, upload_id: str, timeout: int = 300) -> bool:
        """
        Attend qu'un upload soit prêt
        
        Args:
            upload_id: ID de l'upload
            timeout: Timeout en secondes
            
        Returns:
            bool: True si prêt dans le délai
        """
        import time
        
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            if self.is_upload_ready(upload_id):
                return True
            
            time.sleep(5)  # Vérifier toutes les 5 secondes
        
        return False
    
    def get_webhook_url(self) -> Optional[str]:
        """
        Obtient l'URL du webhook
        
        Returns:
            str: URL du webhook ou None
        """
        if not self.webhook_service:
            return None
        
        return self.webhook_service.get_webhook_url()

# Fonctions utilitaires pour usage simple
_postflow_instance = None

def init_postflow(config_path: Optional[str] = None) -> PostFlowIntegration:
    """
    Initialise PostFlow (usage global)
    
    Args:
        config_path: Chemin vers la config (optionnel)
        
    Returns:
        PostFlowIntegration: Instance initialisée
    """
    global _postflow_instance
    _postflow_instance = PostFlowIntegration(config_path)
    return _postflow_instance

def get_postflow() -> Optional[PostFlowIntegration]:
    """Obtient l'instance PostFlow globale"""
    return _postflow_instance

def track_upload(upload_id: str, 
                filename: str,
                file_id: Optional[str] = None,
                project_id: Optional[str] = None,
                workspace_id: Optional[str] = None) -> bool:
    """
    Fonction simple pour tracker un upload
    
    Args:
        upload_id: ID unique de l'upload
        filename: Nom du fichier
        file_id: ID Frame.io (optionnel)
        project_id: ID projet (optionnel)
        workspace_id: ID workspace (optionnel)
        
    Returns:
        bool: True si succès
    """
    if not _postflow_instance:
        raise Exception("PostFlow non initialisé. Appelez init_postflow() d'abord.")
    
    return _postflow_instance.register_upload(
        upload_id=upload_id,
        filename=filename,
        file_id=file_id,
        project_id=project_id,
        workspace_id=workspace_id
    )

def check_upload_ready(upload_id: str) -> bool:
    """
    Vérifie si un upload est prêt
    
    Args:
        upload_id: ID de l'upload
        
    Returns:
        bool: True si prêt
    """
    if not _postflow_instance:
        return False
    
    return _postflow_instance.is_upload_ready(upload_id)

def wait_upload_ready(upload_id: str, timeout: int = 300) -> bool:
    """
    Attend qu'un upload soit prêt
    
    Args:
        upload_id: ID de l'upload
        timeout: Timeout en secondes
        
    Returns:
        bool: True si prêt
    """
    if not _postflow_instance:
        return False
    
    return _postflow_instance.wait_for_upload_ready(upload_id, timeout)

# Exemple d'usage
if __name__ == "__main__":
    # Démonstration d'usage
    
    print("🎬 PostFlow Integration - Exemple d'usage")
    print("=" * 50)
    
    try:
        # 1. Initialiser PostFlow
        postflow = init_postflow()
        
        # 2. Démarrer le tracking
        if postflow.start_tracking():
            print("✅ Tracking démarré")
            webhook_url = postflow.get_webhook_url()
            print(f"🌐 Webhook URL: {webhook_url}")
        else:
            print("❌ Échec démarrage tracking")
            exit(1)
        
        # 3. Exemple d'utilisation dans votre workflow
        print("\n📝 Exemple d'intégration dans votre workflow:")
        
        # Enregistrer un upload
        upload_id = "example_upload_001"
        filename = "my_video.mp4"
        
        if track_upload(upload_id, filename):
            print(f"✅ Upload enregistré: {filename}")
        
        # Vérifier le statut
        status = postflow.get_upload_status(upload_id)
        if status:
            print(f"📊 Statut: {status.get('status', 'N/A')}")
        
        # Obtenir les stats globales
        stats = postflow.get_tracking_stats()
        print(f"📈 Uploads trackés: {stats.get('total_tracked', 0)}")
        
        print("\n💡 Dans votre code, utilisez:")
        print("   from tools.postflow_integration import init_postflow, track_upload")
        print("   postflow = init_postflow()")
        print("   postflow.start_tracking()")
        print("   track_upload('my_upload_id', 'my_file.mp4')")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        if _postflow_instance:
            _postflow_instance.stop_tracking()
        print("✅ Nettoyage terminé")
