#!/usr/bin/env python3
"""
Script d'optimisation des performances et monitoring pour Frame.io
"""

import asyncio
import time
import json
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import statistics
import psutil
import sys

# Configuration des logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PerformanceMonitor:
    """Moniteur de performance pour les opérations Frame.io"""
    
    def __init__(self):
        self.metrics = {
            'api_calls': [],
            'upload_times': [],
            'cache_hits': 0,
            'cache_misses': 0,
            'errors': [],
            'memory_usage': [],
            'cpu_usage': []
        }
        self.start_time = time.time()
    
    def record_api_call(self, operation: str, duration: float, success: bool = True):
        """Enregistrer une opération API"""
        self.metrics['api_calls'].append({
            'operation': operation,
            'duration': duration,
            'success': success,
            'timestamp': datetime.now().isoformat()
        })
        
        if not success:
            self.metrics['errors'].append({
                'operation': operation,
                'duration': duration,
                'timestamp': datetime.now().isoformat()
            })
    
    def record_upload(self, file_size: int, duration: float):
        """Enregistrer un upload"""
        self.metrics['upload_times'].append({
            'file_size': file_size,
            'duration': duration,
            'speed_mbps': (file_size / 1024 / 1024) / duration if duration > 0 else 0,
            'timestamp': datetime.now().isoformat()
        })
    
    def record_cache_hit(self):
        """Enregistrer un cache hit"""
        self.metrics['cache_hits'] += 1
    
    def record_cache_miss(self):
        """Enregistrer un cache miss"""
        self.metrics['cache_misses'] += 1
    
    def record_system_metrics(self):
        """Enregistrer les métriques système"""
        process = psutil.Process()
        self.metrics['memory_usage'].append({
            'rss': process.memory_info().rss / 1024 / 1024,  # MB
            'vms': process.memory_info().vms / 1024 / 1024,  # MB
            'percent': process.memory_percent(),
            'timestamp': datetime.now().isoformat()
        })
        
        self.metrics['cpu_usage'].append({
            'percent': process.cpu_percent(),
            'timestamp': datetime.now().isoformat()
        })
    
    def get_report(self) -> Dict[str, Any]:
        """Générer un rapport de performance"""
        now = time.time()
        total_time = now - self.start_time
        
        # Statistiques API
        api_durations = [call['duration'] for call in self.metrics['api_calls']]
        api_success_rate = sum(1 for call in self.metrics['api_calls'] if call['success']) / len(self.metrics['api_calls']) if self.metrics['api_calls'] else 0
        
        # Statistiques upload
        upload_speeds = [upload['speed_mbps'] for upload in self.metrics['upload_times']]
        
        # Cache
        total_cache_requests = self.metrics['cache_hits'] + self.metrics['cache_misses']
        cache_hit_rate = self.metrics['cache_hits'] / total_cache_requests if total_cache_requests > 0 else 0
        
        # Mémoire
        memory_usage = [m['rss'] for m in self.metrics['memory_usage']]
        cpu_usage = [c['percent'] for c in self.metrics['cpu_usage']]
        
        return {
            'session_duration': total_time,
            'api_calls': {
                'total': len(self.metrics['api_calls']),
                'success_rate': api_success_rate,
                'average_duration': statistics.mean(api_durations) if api_durations else 0,
                'median_duration': statistics.median(api_durations) if api_durations else 0,
                'max_duration': max(api_durations) if api_durations else 0,
                'min_duration': min(api_durations) if api_durations else 0
            },
            'uploads': {
                'total': len(self.metrics['upload_times']),
                'average_speed_mbps': statistics.mean(upload_speeds) if upload_speeds else 0,
                'median_speed_mbps': statistics.median(upload_speeds) if upload_speeds else 0,
                'max_speed_mbps': max(upload_speeds) if upload_speeds else 0,
                'min_speed_mbps': min(upload_speeds) if upload_speeds else 0
            },
            'cache': {
                'hit_rate': cache_hit_rate,
                'hits': self.metrics['cache_hits'],
                'misses': self.metrics['cache_misses'],
                'total_requests': total_cache_requests
            },
            'system': {
                'memory': {
                    'average_mb': statistics.mean(memory_usage) if memory_usage else 0,
                    'peak_mb': max(memory_usage) if memory_usage else 0,
                    'current_mb': memory_usage[-1] if memory_usage else 0
                },
                'cpu': {
                    'average_percent': statistics.mean(cpu_usage) if cpu_usage else 0,
                    'peak_percent': max(cpu_usage) if cpu_usage else 0,
                    'current_percent': cpu_usage[-1] if cpu_usage else 0
                }
            },
            'errors': {
                'total': len(self.metrics['errors']),
                'rate': len(self.metrics['errors']) / len(self.metrics['api_calls']) if self.metrics['api_calls'] else 0
            },
            'timestamp': datetime.now().isoformat()
        }

class FrameIOOptimizer:
    """Optimiseur de performance pour Frame.io"""
    
    def __init__(self):
        self.monitor = PerformanceMonitor()
        self.config = self._load_optimization_config()
    
    def _load_optimization_config(self) -> Dict[str, Any]:
        """Charger la configuration d'optimisation"""
        config_path = Path(__file__).parent.parent / "config" / "optimization.json"
        
        default_config = {
            'cache_ttl': {
                'projects': 1800,  # 30 minutes
                'folders': 900,    # 15 minutes
                'structure': 3600  # 1 heure
            },
            'rate_limiting': {
                'requests_per_second': 10,
                'burst_size': 20,
                'backoff_factor': 2.0
            },
            'upload_optimization': {
                'chunk_size': 5 * 1024 * 1024,  # 5MB
                'max_concurrent_uploads': 3,
                'timeout_seconds': 300
            },
            'monitoring': {
                'system_metrics_interval': 30,  # secondes
                'report_interval': 300,         # 5 minutes
                'log_slow_operations': True,
                'slow_operation_threshold': 5.0  # secondes
            }
        }
        
        try:
            if config_path.exists():
                with open(config_path, 'r') as f:
                    user_config = json.load(f)
                    # Fusionner avec la config par défaut
                    default_config.update(user_config)
            else:
                # Créer la config par défaut
                config_path.parent.mkdir(parents=True, exist_ok=True)
                with open(config_path, 'w') as f:
                    json.dump(default_config, f, indent=2)
                print(f"📄 Configuration d'optimisation créée: {config_path}")
                
        except Exception as e:
            print(f"⚠️  Erreur chargement config optimisation: {e}")
            print("💡 Utilisation de la configuration par défaut")
        
        return default_config
    
    async def start_monitoring(self):
        """Démarrer le monitoring en arrière-plan"""
        interval = self.config['monitoring']['system_metrics_interval']
        
        while True:
            try:
                self.monitor.record_system_metrics()
                await asyncio.sleep(interval)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Erreur monitoring: {e}")
                await asyncio.sleep(interval)
    
    async def optimize_cache_usage(self, structure_manager) -> Dict[str, Any]:
        """Optimiser l'utilisation du cache"""
        print("🔧 Optimisation du cache en cours...")
        
        # Analyser le cache actuel
        stats = structure_manager.cache.get_stats()
        print(f"📊 Cache actuel: {stats['total_entries']} entrées, {stats['expired_entries']} expirées")
        
        # Nettoyer les entrées expirées
        cleaned_count = 0
        for key in list(structure_manager.cache.cache_data.keys()):
            entry = structure_manager.cache.cache_data[key]
            if entry.is_expired():
                del structure_manager.cache.cache_data[key]
                cleaned_count += 1
        
        if cleaned_count > 0:
            structure_manager.cache.save_cache()
            print(f"🗑️  {cleaned_count} entrées expirées nettoyées")
        
        # Suggestions d'optimisation
        suggestions = []
        
        if stats['expired_entries'] > stats['total_entries'] * 0.3:
            suggestions.append("TTL du cache trop court, considérez l'augmenter")
        
        if stats['cache_size_bytes'] > 10 * 1024 * 1024:  # 10MB
            suggestions.append("Cache volumineux, considérez un nettoyage périodique")
        
        return {
            'cleaned_entries': cleaned_count,
            'cache_stats': stats,
            'suggestions': suggestions
        }
    
    async def benchmark_api_performance(self, structure_manager) -> Dict[str, Any]:
        """Benchmarker les performances API"""
        print("🚀 Benchmark des performances API...")
        
        operations = [
            ('get_projects', lambda: structure_manager.get_projects()),
            ('get_folders', lambda: structure_manager.get_folders(
                structure_manager.workspace_id
            ) if hasattr(structure_manager, 'workspace_id') else None)
        ]
        
        results = {}
        
        for op_name, op_func in operations:
            if op_func() is None:
                continue
                
            print(f"📊 Test {op_name}...")
            
            # Mesurer plusieurs appels
            durations = []
            for i in range(3):
                start_time = time.time()
                try:
                    if asyncio.iscoroutinefunction(op_func):
                        await op_func()
                    else:
                        op_func()
                    duration = time.time() - start_time
                    durations.append(duration)
                    self.monitor.record_api_call(op_name, duration, True)
                except Exception as e:
                    duration = time.time() - start_time
                    self.monitor.record_api_call(op_name, duration, False)
                    logger.error(f"Erreur {op_name}: {e}")
                
                # Attendre un peu entre les appels
                await asyncio.sleep(1)
            
            if durations:
                results[op_name] = {
                    'average': statistics.mean(durations),
                    'median': statistics.median(durations),
                    'min': min(durations),
                    'max': max(durations),
                    'calls': len(durations)
                }
                
                print(f"   ⏱️  Moyenne: {results[op_name]['average']:.2f}s")
                print(f"   📈 Min/Max: {results[op_name]['min']:.2f}s / {results[op_name]['max']:.2f}s")
        
        return results
    
    def generate_optimization_report(self) -> str:
        """Générer un rapport d'optimisation"""
        report = self.monitor.get_report()
        
        lines = [
            "🔍 RAPPORT D'OPTIMISATION FRAME.IO",
            "=" * 50,
            "",
            f"📊 Session: {report['session_duration']:.1f}s",
            "",
            "🌐 API CALLS:",
            f"   Total: {report['api_calls']['total']}",
            f"   Taux de succès: {report['api_calls']['success_rate']:.2%}",
            f"   Durée moyenne: {report['api_calls']['average_duration']:.2f}s",
            f"   Durée médiane: {report['api_calls']['median_duration']:.2f}s",
            "",
            "📤 UPLOADS:",
            f"   Total: {report['uploads']['total']}",
            f"   Vitesse moyenne: {report['uploads']['average_speed_mbps']:.2f} MB/s",
            f"   Vitesse médiane: {report['uploads']['median_speed_mbps']:.2f} MB/s",
            "",
            "💾 CACHE:",
            f"   Taux de hit: {report['cache']['hit_rate']:.2%}",
            f"   Hits: {report['cache']['hits']}",
            f"   Misses: {report['cache']['misses']}",
            "",
            "🖥️  SYSTÈME:",
            f"   Mémoire moyenne: {report['system']['memory']['average_mb']:.1f} MB",
            f"   Mémoire pic: {report['system']['memory']['peak_mb']:.1f} MB",
            f"   CPU moyen: {report['system']['cpu']['average_percent']:.1f}%",
            f"   CPU pic: {report['system']['cpu']['peak_percent']:.1f}%",
            "",
            "❌ ERREURS:",
            f"   Total: {report['errors']['total']}",
            f"   Taux: {report['errors']['rate']:.2%}",
            "",
            "💡 RECOMMANDATIONS:",
        ]
        
        # Recommandations basées sur les métriques
        recommendations = []
        
        if report['api_calls']['success_rate'] < 0.95:
            recommendations.append("   • Améliorer la gestion des erreurs API")
        
        if report['cache']['hit_rate'] < 0.7:
            recommendations.append("   • Optimiser la stratégie de cache")
        
        if report['api_calls']['average_duration'] > 2.0:
            recommendations.append("   • Optimiser les appels API (possibles timeouts)")
        
        if report['system']['memory']['peak_mb'] > 500:
            recommendations.append("   • Surveiller l'utilisation mémoire")
        
        if report['uploads']['average_speed_mbps'] < 1.0:
            recommendations.append("   • Optimiser la vitesse d'upload")
        
        if not recommendations:
            recommendations.append("   • Performances optimales! 🎉")
        
        lines.extend(recommendations)
        lines.extend(["", f"📅 Généré le: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"])
        
        return "\n".join(lines)
    
    def save_report(self, report: str, filename: Optional[str] = None):
        """Sauvegarder le rapport"""
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"frameio_optimization_report_{timestamp}.txt"
        
        reports_dir = Path(__file__).parent.parent / "logs"
        reports_dir.mkdir(exist_ok=True)
        
        report_path = reports_dir / filename
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"📄 Rapport sauvegardé: {report_path}")
        return report_path

async def main():
    """Point d'entrée principal"""
    print("🚀 Lancement de l'optimisation Frame.io...")
    
    optimizer = FrameIOOptimizer()
    
    # Exemple d'utilisation avec monitoring
    print("📊 Démarrage du monitoring...")
    
    # Simulation d'opérations
    await asyncio.sleep(2)
    
    # Générer et afficher le rapport
    report = optimizer.generate_optimization_report()
    print("\n" + report)
    
    # Sauvegarder le rapport
    optimizer.save_report(report)

if __name__ == "__main__":
    asyncio.run(main())
