#!/usr/bin/env python3
"""
Script de monitoring pour l'intégration LucidLink → Frame.io
Surveille l'état du service, les statistiques et la santé du système
"""

import asyncio
import json
import os
import sys
import time
import psutil
import subprocess
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional
import logging
import argparse

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class FrameIOIntegrationMonitor:
    """Monitoring de l'intégration LucidLink → Frame.io"""
    
    def __init__(self, config_path: str = None):
        """
        Initialise le monitor
        
        Args:
            config_path: Chemin vers le fichier de configuration
        """
        self.config_path = config_path or os.getenv('CONFIG_FILE', '/opt/rl_postflow/config/frameio_integration.json')
        self.log_file = os.getenv('LOG_FILE', '/opt/rl_postflow/logs/frameio_integration.log')
        self.service_name = 'frameio-bridge.service'
        self.project_dir = Path('/opt/rl_postflow')
        
        # Charger la configuration
        self.config = self._load_config()
        
        # Métriques
        self.metrics = {
            'last_check': None,
            'service_status': 'unknown',
            'files_processed': 0,
            'files_uploaded': 0,
            'files_failed': 0,
            'queue_size': 0,
            'uptime': 0,
            'cpu_usage': 0.0,
            'memory_usage': 0.0,
            'disk_usage': 0.0,
            'errors_last_hour': 0,
            'last_upload': None
        }
        
    def _load_config(self) -> Dict[str, Any]:
        """Charge la configuration"""
        try:
            if Path(self.config_path).exists():
                with open(self.config_path, 'r') as f:
                    return json.load(f)
            return {}
        except Exception as e:
            logger.error(f"Erreur chargement config: {e}")
            return {}
    
    def get_service_status(self) -> Dict[str, Any]:
        """Récupère l'état du service systemd"""
        try:
            result = subprocess.run(
                ['systemctl', 'status', self.service_name],
                capture_output=True,
                text=True
            )
            
            is_active = subprocess.run(
                ['systemctl', 'is-active', self.service_name],
                capture_output=True,
                text=True
            ).stdout.strip() == 'active'
            
            is_enabled = subprocess.run(
                ['systemctl', 'is-enabled', self.service_name],
                capture_output=True,
                text=True
            ).stdout.strip() == 'enabled'
            
            return {
                'active': is_active,
                'enabled': is_enabled,
                'status': 'running' if is_active else 'stopped',
                'exit_code': result.returncode
            }
            
        except Exception as e:
            logger.error(f"Erreur status service: {e}")
            return {'active': False, 'enabled': False, 'status': 'error'}
    
    def get_process_info(self) -> Dict[str, Any]:
        """Récupère les informations du processus"""
        try:
            # Chercher le processus Python du bridge
            for proc in psutil.process_iter(['pid', 'name', 'cmdline', 'cpu_percent', 'memory_percent']):
                try:
                    cmdline = ' '.join(proc.info['cmdline'] or [])
                    if 'lucidlink_frameio_bridge.py' in cmdline:
                        return {
                            'pid': proc.info['pid'],
                            'cpu_percent': proc.info['cpu_percent'],
                            'memory_percent': proc.info['memory_percent'],
                            'memory_mb': proc.memory_info().rss / 1024 / 1024,
                            'create_time': proc.create_time(),
                            'uptime': time.time() - proc.create_time()
                        }
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
            
            return {'pid': None, 'cpu_percent': 0, 'memory_percent': 0}
            
        except Exception as e:
            logger.error(f"Erreur info processus: {e}")
            return {'pid': None, 'cpu_percent': 0, 'memory_percent': 0}
    
    def get_disk_usage(self) -> Dict[str, Any]:
        """Récupère l'utilisation du disque"""
        try:
            usage = psutil.disk_usage(str(self.project_dir))
            
            return {
                'total_gb': usage.total / (1024**3),
                'used_gb': usage.used / (1024**3),
                'free_gb': usage.free / (1024**3),
                'percent': (usage.used / usage.total) * 100
            }
            
        except Exception as e:
            logger.error(f"Erreur usage disque: {e}")
            return {'total_gb': 0, 'used_gb': 0, 'free_gb': 0, 'percent': 0}
    
    def parse_log_file(self, hours: int = 1) -> Dict[str, Any]:
        """Parse le fichier de log pour extraire les statistiques"""
        try:
            if not Path(self.log_file).exists():
                return {'errors': 0, 'uploads': 0, 'processed': 0, 'last_upload': None}
            
            cutoff_time = datetime.now() - timedelta(hours=hours)
            
            errors = 0
            uploads = 0
            processed = 0
            last_upload = None
            
            with open(self.log_file, 'r') as f:
                for line in f:
                    try:
                        # Parser la ligne de log
                        if ' - ' in line:
                            timestamp_str = line.split(' - ')[0]
                            timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S,%f')
                            
                            if timestamp > cutoff_time:
                                if 'ERROR' in line or '❌' in line:
                                    errors += 1
                                elif 'Upload réussi' in line or '✅' in line:
                                    uploads += 1
                                    last_upload = timestamp
                                elif 'Fichier parsé' in line or 'traite:' in line:
                                    processed += 1
                    except:
                        continue
            
            return {
                'errors': errors,
                'uploads': uploads,
                'processed': processed,
                'last_upload': last_upload.isoformat() if last_upload else None
            }
            
        except Exception as e:
            logger.error(f"Erreur parsing log: {e}")
            return {'errors': 0, 'uploads': 0, 'processed': 0, 'last_upload': None}
    
    def get_queue_info(self) -> Dict[str, Any]:
        """Récupère les informations de la queue de traitement"""
        try:
            # Chercher des fichiers en cours de traitement
            by_shot_path = self.config.get('lucidlink', {}).get('by_shot_path', '/path/to/BY_SHOT')
            
            if not Path(by_shot_path).exists():
                return {'pending_files': 0, 'queue_size': 0}
            
            # Compter les fichiers vidéo dans BY_SHOT
            extensions = self.config.get('lucidlink', {}).get('supported_extensions', ['.mov', '.mp4'])
            pending_files = 0
            
            for ext in extensions:
                pending_files += len(list(Path(by_shot_path).rglob(f'*{ext}')))
            
            return {'pending_files': pending_files, 'queue_size': pending_files}
            
        except Exception as e:
            logger.error(f"Erreur info queue: {e}")
            return {'pending_files': 0, 'queue_size': 0}
    
    def get_frameio_structure_info(self) -> Dict[str, Any]:
        """Récupère les informations de la structure Frame.io"""
        try:
            structure_file = self.project_dir / 'config' / 'frameio_structure.json'
            
            if not structure_file.exists():
                return {'scenes': 0, 'shots': 0, 'last_updated': None}
            
            with open(structure_file, 'r') as f:
                structure = json.load(f)
            
            scenes = structure.get('structure', {}).get('scenes', {})
            scenes_count = len(scenes)
            shots_count = sum(len(scene.get('shots', {})) for scene in scenes.values())
            
            return {
                'scenes': scenes_count,
                'shots': shots_count,
                'last_updated': structure.get('last_updated'),
                'project_id': structure.get('project_id'),
                'project_name': structure.get('project_name')
            }
            
        except Exception as e:
            logger.error(f"Erreur info structure: {e}")
            return {'scenes': 0, 'shots': 0, 'last_updated': None}
    
    def collect_metrics(self) -> Dict[str, Any]:
        """Collecte toutes les métriques"""
        try:
            # Collecte des métriques
            service_status = self.get_service_status()
            process_info = self.get_process_info()
            disk_usage = self.get_disk_usage()
            log_stats = self.parse_log_file(1)  # Dernière heure
            queue_info = self.get_queue_info()
            structure_info = self.get_frameio_structure_info()
            
            # Métriques système
            system_metrics = {
                'cpu_percent': psutil.cpu_percent(),
                'memory_percent': psutil.virtual_memory().percent,
                'disk_usage': disk_usage,
                'load_average': os.getloadavg() if hasattr(os, 'getloadavg') else [0, 0, 0]
            }
            
            # Consolider les métriques
            metrics = {
                'timestamp': datetime.now().isoformat(),
                'service': service_status,
                'process': process_info,
                'system': system_metrics,
                'logs': log_stats,
                'queue': queue_info,
                'structure': structure_info,
                'health': self._calculate_health_score(service_status, process_info, log_stats)
            }
            
            return metrics
            
        except Exception as e:
            logger.error(f"Erreur collecte métriques: {e}")
            return {'timestamp': datetime.now().isoformat(), 'error': str(e)}
    
    def _calculate_health_score(self, service_status: Dict, process_info: Dict, log_stats: Dict) -> Dict[str, Any]:
        """Calcule un score de santé global"""
        score = 100
        issues = []
        
        # Service inactif
        if not service_status.get('active', False):
            score -= 50
            issues.append("Service arrêté")
        
        # Processus non trouvé
        if not process_info.get('pid'):
            score -= 30
            issues.append("Processus non trouvé")
        
        # Utilisation CPU élevée
        if process_info.get('cpu_percent', 0) > 80:
            score -= 20
            issues.append("CPU élevé")
        
        # Utilisation mémoire élevée
        if process_info.get('memory_percent', 0) > 90:
            score -= 15
            issues.append("Mémoire élevée")
        
        # Erreurs récentes
        errors = log_stats.get('errors', 0)
        if errors > 10:
            score -= 25
            issues.append(f"{errors} erreurs récentes")
        elif errors > 5:
            score -= 10
            issues.append(f"{errors} erreurs récentes")
        
        # Pas d'upload récent
        if not log_stats.get('last_upload'):
            score -= 10
            issues.append("Pas d'upload récent")
        
        score = max(0, score)
        
        return {
            'score': score,
            'status': 'healthy' if score >= 80 else 'warning' if score >= 60 else 'critical',
            'issues': issues
        }
    
    def save_metrics(self, metrics: Dict[str, Any]):
        """Sauvegarde les métriques dans un fichier"""
        try:
            metrics_file = self.project_dir / 'logs' / 'metrics.json'
            
            # Charger les métriques existantes
            if metrics_file.exists():
                with open(metrics_file, 'r') as f:
                    existing_metrics = json.load(f)
            else:
                existing_metrics = []
            
            # Ajouter les nouvelles métriques
            existing_metrics.append(metrics)
            
            # Garder seulement les 1000 dernières entrées
            if len(existing_metrics) > 1000:
                existing_metrics = existing_metrics[-1000:]
            
            # Sauvegarder
            with open(metrics_file, 'w') as f:
                json.dump(existing_metrics, f, indent=2)
                
        except Exception as e:
            logger.error(f"Erreur sauvegarde métriques: {e}")
    
    def format_metrics_output(self, metrics: Dict[str, Any]) -> str:
        """Formate les métriques pour l'affichage"""
        try:
            output = []
            
            # En-tête
            output.append("🎬 RL PostFlow - Frame.io Integration Status")
            output.append("=" * 60)
            output.append(f"Timestamp: {metrics['timestamp']}")
            output.append("")
            
            # Service
            service = metrics.get('service', {})
            status_icon = "✅" if service.get('active') else "❌"
            output.append(f"🔧 Service: {status_icon} {service.get('status', 'unknown')}")
            output.append(f"   Enabled: {'✅' if service.get('enabled') else '❌'}")
            output.append("")
            
            # Processus
            process = metrics.get('process', {})
            if process.get('pid'):
                uptime_hours = process.get('uptime', 0) / 3600
                output.append(f"⚙️ Processus: PID {process['pid']}")
                output.append(f"   Uptime: {uptime_hours:.1f}h")
                output.append(f"   CPU: {process.get('cpu_percent', 0):.1f}%")
                output.append(f"   Memory: {process.get('memory_mb', 0):.1f} MB ({process.get('memory_percent', 0):.1f}%)")
            else:
                output.append("⚙️ Processus: ❌ Non trouvé")
            output.append("")
            
            # Statistiques
            logs = metrics.get('logs', {})
            output.append(f"📊 Statistiques (dernière heure):")
            output.append(f"   Fichiers traités: {logs.get('processed', 0)}")
            output.append(f"   Uploads réussis: {logs.get('uploads', 0)}")
            output.append(f"   Erreurs: {logs.get('errors', 0)}")
            
            last_upload = logs.get('last_upload')
            if last_upload:
                output.append(f"   Dernier upload: {last_upload}")
            else:
                output.append("   Dernier upload: Aucun")
            output.append("")
            
            # Queue
            queue = metrics.get('queue', {})
            output.append(f"📋 Queue:")
            output.append(f"   Fichiers en attente: {queue.get('pending_files', 0)}")
            output.append("")
            
            # Structure Frame.io
            structure = metrics.get('structure', {})
            output.append(f"🎬 Structure Frame.io:")
            output.append(f"   Projet: {structure.get('project_name', 'N/A')}")
            output.append(f"   Scènes: {structure.get('scenes', 0)}")
            output.append(f"   Plans: {structure.get('shots', 0)}")
            output.append("")
            
            # Santé
            health = metrics.get('health', {})
            score = health.get('score', 0)
            status = health.get('status', 'unknown')
            
            health_icon = "✅" if status == 'healthy' else "⚠️" if status == 'warning' else "❌"
            output.append(f"🏥 Santé: {health_icon} {status.upper()} ({score}/100)")
            
            issues = health.get('issues', [])
            if issues:
                output.append("   Problèmes détectés:")
                for issue in issues:
                    output.append(f"   - {issue}")
            output.append("")
            
            # Système
            system = metrics.get('system', {})
            output.append(f"💻 Système:")
            output.append(f"   CPU: {system.get('cpu_percent', 0):.1f}%")
            output.append(f"   Mémoire: {system.get('memory_percent', 0):.1f}%")
            
            disk = system.get('disk_usage', {})
            output.append(f"   Disque: {disk.get('percent', 0):.1f}% ({disk.get('free_gb', 0):.1f}GB libre)")
            
            return "\n".join(output)
            
        except Exception as e:
            logger.error(f"Erreur formatage output: {e}")
            return f"Erreur formatage: {e}"
    
    def run_monitoring(self, interval: int = 60, save_metrics: bool = True):
        """Lance le monitoring en continu"""
        try:
            logger.info(f"🔍 Démarrage du monitoring (interval: {interval}s)")
            
            while True:
                try:
                    # Collecter les métriques
                    metrics = self.collect_metrics()
                    
                    # Afficher les métriques
                    output = self.format_metrics_output(metrics)
                    print(output)
                    print("\n" + "="*60 + "\n")
                    
                    # Sauvegarder les métriques
                    if save_metrics:
                        self.save_metrics(metrics)
                    
                    # Attendre l'intervalle
                    time.sleep(interval)
                    
                except KeyboardInterrupt:
                    logger.info("🛑 Monitoring arrêté par l'utilisateur")
                    break
                except Exception as e:
                    logger.error(f"❌ Erreur monitoring: {e}")
                    time.sleep(10)
                    
        except Exception as e:
            logger.error(f"❌ Erreur monitoring: {e}")

def main():
    """Fonction principale"""
    parser = argparse.ArgumentParser(description='Monitor RL PostFlow - Frame.io Integration')
    parser.add_argument('--config', '-c', help='Chemin vers le fichier de configuration')
    parser.add_argument('--interval', '-i', type=int, default=60, help='Intervalle de monitoring (secondes)')
    parser.add_argument('--once', action='store_true', help='Exécuter une seule fois')
    parser.add_argument('--save-metrics', action='store_true', default=True, help='Sauvegarder les métriques')
    
    args = parser.parse_args()
    
    # Créer le monitor
    monitor = FrameIOIntegrationMonitor(args.config)
    
    try:
        if args.once:
            # Exécution unique
            metrics = monitor.collect_metrics()
            output = monitor.format_metrics_output(metrics)
            print(output)
            
            if args.save_metrics:
                monitor.save_metrics(metrics)
        else:
            # Monitoring continu
            monitor.run_monitoring(args.interval, args.save_metrics)
            
    except Exception as e:
        logger.error(f"❌ Erreur: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
