"""
Integration Hook pour Recovery Manager
====================================

Ce module intègre le Recovery Manager dans le pipeline principal
pour une gestion automatique des uploads incomplets.
"""

import logging
from typing import Dict, Optional
from .recovery_manager import AutoRecoveryService, generate_short_frameio_links

logger = logging.getLogger(__name__)

class RecoveryIntegration:
    """Intégration du Recovery Manager dans le pipeline principal"""
    
    def __init__(self, config_manager, upload_queue=None):
        self.config = config_manager
        self.upload_queue = upload_queue
        self.tracker_file = "data/uploads_tracking.json"
        self.recovery_service = AutoRecoveryService(self.tracker_file, upload_queue)
        
    def startup_recovery_check(self) -> Dict:
        """
        Vérifie et récupère automatiquement les uploads incomplets au démarrage
        
        Returns:
            Rapport de récupération
        """
        try:
            logger.info("🔄 Initialisation du Recovery Manager...")
            
            # Lance la récupération automatique
            recovery_report = self.recovery_service.run_startup_recovery()
            
            # Log les résultats
            if recovery_report['status'] == 'clean':
                logger.info("✅ Aucune récupération nécessaire")
            else:
                logger.info(f"🔧 Récupération effectuée:")
                for action in recovery_report['actions']:
                    logger.info(f"   • {action}")
                    
                if recovery_report['files_recovered']:
                    logger.info("📋 Fichiers ajoutés à la queue pour retraitement:")
                    for filename in recovery_report['files_recovered']:
                        logger.info(f"   📄 {filename}")
            
            return recovery_report
            
        except Exception as e:
            logger.error(f"❌ Erreur Recovery Manager: {e}")
            return {'status': 'error', 'error': str(e)}
    
    def generate_gsheets_friendly_links(self) -> Dict:
        """
        Génère les liens Frame.io courts pour Google Sheets
        
        Returns:
            Rapport avec liens courts et formules HYPERLINK
        """
        try:
            links_report = self.recovery_service.generate_short_links_report()
            
            logger.info(f"🔗 {links_report['total_links']} liens Frame.io convertis en format court")
            
            # Affiche quelques exemples
            for shot_id, link_data in list(links_report['links'].items())[:3]:
                logger.info(f"   📎 {shot_id}: {link_data['short_text']}")
            
            return links_report
            
        except Exception as e:
            logger.error(f"❌ Erreur génération liens courts: {e}")
            return {'status': 'error', 'error': str(e)}
    
    def get_recovery_status(self) -> Dict:
        """
        Obtient le statut actuel du système de récupération
        
        Returns:
            Statut et métriques du recovery system
        """
        try:
            report = self.recovery_service.recovery_manager.get_recovery_report()
            
            status = {
                'recovery_needed': report['recovery_needed'],
                'total_uploads': report['total_uploads'],
                'incomplete_count': report['incomplete_count'],
                'health_score': round((1 - report['incomplete_count'] / max(report['total_uploads'], 1)) * 100, 1),
                'last_check': report['timestamp']
            }
            
            return status
            
        except Exception as e:
            logger.error(f"❌ Erreur statut recovery: {e}")
            return {'error': str(e)}


def integrate_recovery_manager(postflow_runner, upload_queue=None):
    """
    Fonction d'intégration pour ajouter le Recovery Manager au pipeline
    
    Args:
        postflow_runner: Instance du runner principal
        upload_queue: Queue d'upload pour retraitement automatique
    
    Usage dans main.py:
        from src.utils.recovery_integration import integrate_recovery_manager
        
        # Après initialisation du postflow_runner
        recovery_report = integrate_recovery_manager(postflow_runner, upload_queue)
        if recovery_report['status'] == 'recovered':
            logger.info(f"🔧 Récupération: {recovery_report['files_requeued']} fichiers retraités")
    """
    try:
        # Crée l'intégration recovery
        recovery_integration = RecoveryIntegration(
            postflow_runner.config_manager, 
            upload_queue
        )
        
        # Lance la vérification de récupération au démarrage
        recovery_report = recovery_integration.startup_recovery_check()
        
        # Génère les liens courts pour Google Sheets
        links_report = recovery_integration.generate_gsheets_friendly_links()
        
        # Ajoute les méthodes à l'instance principale pour accès ultérieur
        postflow_runner.recovery_integration = recovery_integration
        
        # Retourne le rapport combiné
        return {
            'recovery': recovery_report,
            'links': links_report,
            'integration_status': 'success'
        }
        
    except Exception as e:
        logger.error(f"❌ Erreur intégration Recovery Manager: {e}")
        return {
            'integration_status': 'error',
            'error': str(e)
        }


# Hook pour ajout au processus de démarrage
def add_recovery_to_startup_sequence(bootstrap_sequence):
    """
    Ajoute le Recovery Manager à la séquence de démarrage
    
    Args:
        bootstrap_sequence: Liste des étapes de démarrage
    
    Usage:
        startup_steps = [
            'load_config',
            'init_frameio',
            'start_watcher'
        ]
        
        add_recovery_to_startup_sequence(startup_steps)
        # Ajoute 'recovery_check' à la séquence
    """
    if 'recovery_check' not in bootstrap_sequence:
        # Insère après l'initialisation mais avant le démarrage du watcher
        insert_index = len(bootstrap_sequence) - 1  # Avant la dernière étape
        bootstrap_sequence.insert(insert_index, 'recovery_check')
        logger.info("🔧 Recovery Manager ajouté à la séquence de démarrage")


# Utilitaire pour monitoring continu
class RecoveryMonitor:
    """Moniteur pour surveillance continue du système de récupération"""
    
    def __init__(self, recovery_integration):
        self.recovery = recovery_integration
        self.last_check = None
        
    def periodic_health_check(self) -> Dict:
        """
        Vérifie périodiquement l'état de santé des uploads
        
        Returns:
            Rapport de santé du système
        """
        status = self.recovery.get_recovery_status()
        
        if status.get('health_score', 100) < 95:
            logger.warning(f"⚠️ Santé système: {status['health_score']}% - {status['incomplete_count']} uploads incomplets")
        else:
            logger.info(f"✅ Santé système: {status['health_score']}%")
        
        self.last_check = status.get('last_check')
        return status
    
    def trigger_recovery_if_needed(self) -> bool:
        """
        Déclenche une récupération si nécessaire
        
        Returns:
            True si une récupération a été déclenchée
        """
        status = self.recovery.get_recovery_status()
        
        if status.get('recovery_needed', False):
            logger.warning("🔧 Déclenchement récupération automatique...")
            recovery_report = self.recovery.startup_recovery_check()
            
            if recovery_report['status'] == 'recovered':
                logger.info(f"✅ Récupération réussie: {recovery_report['files_requeued']} fichiers")
                return True
        
        return False
