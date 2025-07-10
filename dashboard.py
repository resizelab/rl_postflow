#!/usr/bin/env python3
"""
🎛️ RL PostFlow - Dashboard Web
===============================

Dashboard web temps réel pour le monitoring du pipeline RL PostFlow.
Interface Flask avec WebSocket pour les mises à jour temps réel.

Version: 4.1.1
Date: 10 juillet 2025
"""

import os
import json
import logging
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
import sqlite3
import threading
import time

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration par défaut
DEFAULT_HOST = os.getenv('DASHBOARD_HOST', 'localhost')
DEFAULT_PORT = int(os.getenv('DASHBOARD_PORT', '8081'))
DEFAULT_DEBUG = os.getenv('DASHBOARD_DEBUG', 'False').lower() == 'true'

PROJECT_ROOT = Path(__file__).parent
CONFIG_DIR = Path(os.getenv('CONFIG_DIR', PROJECT_ROOT / 'config'))
DATA_DIR = PROJECT_ROOT / 'data'
TEMPLATES_DIR = PROJECT_ROOT / 'templates'

# Initialisation Flask
app = Flask(__name__, template_folder=str(TEMPLATES_DIR))
app.config['SECRET_KEY'] = 'rl_postflow_dashboard_2025'
socketio = SocketIO(app, cors_allowed_origins="*")

# Variables globales pour le cache de données
cache_data = {
    'pipeline_status': {},
    'upload_queue': [],
    'recent_uploads': [],
    'system_health': {},
    'statistics': {},
    'last_update': None
}

def load_pipeline_status() -> Dict[str, Any]:
    """Charge le statut du pipeline depuis les fichiers de données"""
    try:
        # Status global du pipeline
        status_file = DATA_DIR / 'pipeline_status.json'
        if status_file.exists():
            with open(status_file) as f:
                pipeline_status = json.load(f)
        else:
            pipeline_status = {
                'status': 'unknown',
                'components': {},
                'last_update': datetime.now().isoformat()
            }
        
        # Queue d'uploads
        upload_queue_file = DATA_DIR / 'uploads_tracking.json'
        upload_queue = []
        recent_uploads = []
        
        if upload_queue_file.exists():
            with open(upload_queue_file) as f:
                tracking_data = json.load(f)
                
            # Séparer queue active et uploads récents
            for upload in tracking_data.get('uploads', []):
                status = upload.get('status', 'unknown')
                if status in ['pending', 'uploading', 'processing']:
                    upload_queue.append(upload)
                elif status in ['completed', 'failed']:
                    recent_uploads.append(upload)
            
            # Garder seulement les 20 uploads les plus récents
            recent_uploads = sorted(recent_uploads, 
                                  key=lambda x: x.get('timestamp', ''), 
                                  reverse=True)[:20]
        
        # Statistiques de base
        statistics = {
            'total_uploads': len(tracking_data.get('uploads', [])) if upload_queue_file.exists() else 0,
            'completed_uploads': len([u for u in recent_uploads if u.get('status') == 'completed']),
            'failed_uploads': len([u for u in recent_uploads if u.get('status') == 'failed']),
            'pending_uploads': len(upload_queue),
            'uptime': 'N/A'  # TODO: Calculer depuis le démarrage
        }
        
        return {
            'pipeline_status': pipeline_status,
            'upload_queue': upload_queue,
            'recent_uploads': recent_uploads,
            'statistics': statistics
        }
        
    except Exception as e:
        logger.error(f"Erreur lors du chargement du statut: {e}")
        return {
            'pipeline_status': {'status': 'error', 'components': {}},
            'upload_queue': [],
            'recent_uploads': [],
            'statistics': {}
        }

def get_system_health() -> Dict[str, Any]:
    """Vérifie la santé du système"""
    try:
        import psutil
        
        # Informations système
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Vérifier les processus PostFlow actifs
        postflow_processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
            try:
                if any('postflow' in arg.lower() for arg in proc.info['cmdline'] or []):
                    postflow_processes.append({
                        'pid': proc.info['pid'],
                        'name': proc.info['name']
                    })
            except:
                continue
        
        return {
            'cpu_percent': cpu_percent,
            'memory_percent': memory.percent,
            'memory_available_gb': round(memory.available / (1024**3), 2),
            'disk_percent': disk.percent,
            'disk_free_gb': round(disk.free / (1024**3), 2),
            'processes': postflow_processes,
            'timestamp': datetime.now().isoformat()
        }
        
    except ImportError:
        # psutil non disponible, informations basiques
        return {
            'cpu_percent': 0,
            'memory_percent': 0,
            'memory_available_gb': 0,
            'disk_percent': 0,
            'disk_free_gb': 0,
            'processes': [],
            'timestamp': datetime.now().isoformat(),
            'warning': 'psutil not available - limited system info'
        }
    except Exception as e:
        logger.error(f"Erreur lors de la vérification système: {e}")
        return {
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }

def update_cache():
    """Met à jour le cache de données"""
    global cache_data
    try:
        data = load_pipeline_status()
        health = get_system_health()
        
        cache_data.update(data)
        cache_data['system_health'] = health
        cache_data['last_update'] = datetime.now().isoformat()
        
        logger.debug("Cache mis à jour")
        
    except Exception as e:
        logger.error(f"Erreur lors de la mise à jour du cache: {e}")

def background_updater():
    """Thread en arrière-plan pour mettre à jour les données"""
    while True:
        try:
            update_cache()
            
            # Émettre les mises à jour via WebSocket
            socketio.emit('dashboard_update', cache_data, namespace='/')
            
            time.sleep(5)  # Mise à jour toutes les 5 secondes
            
        except Exception as e:
            logger.error(f"Erreur dans le thread de mise à jour: {e}")
            time.sleep(10)

# Routes Flask

@app.route('/')
def dashboard():
    """Page principale du dashboard"""
    return render_template('dashboard.html')

@app.route('/api/status')
def api_status():
    """API: Statut complet du pipeline"""
    update_cache()
    return jsonify(cache_data)

@app.route('/api/health')
def api_health():
    """API: Santé du système"""
    health = get_system_health()
    return jsonify(health)

@app.route('/api/uploads')
def api_uploads():
    """API: Liste des uploads"""
    return jsonify({
        'queue': cache_data.get('upload_queue', []),
        'recent': cache_data.get('recent_uploads', [])
    })

@app.route('/api/statistics')
def api_statistics():
    """API: Statistiques"""
    return jsonify(cache_data.get('statistics', {}))

# Routes WebSocket

@socketio.on('connect')
def handle_connect():
    """Client connecté au WebSocket"""
    logger.info(f"Client connecté: {request.sid}")
    emit('dashboard_update', cache_data)

@socketio.on('disconnect')
def handle_disconnect():
    """Client déconnecté du WebSocket"""
    logger.info(f"Client déconnecté: {request.sid}")

@socketio.on('request_update')
def handle_request_update():
    """Client demande une mise à jour"""
    update_cache()
    emit('dashboard_update', cache_data)

def main():
    """Point d'entrée principal du dashboard"""
    logger.info("🎛️ Démarrage du Dashboard RL PostFlow")
    
    # Vérifier que le dossier templates existe
    if not TEMPLATES_DIR.exists():
        logger.error(f"❌ Dossier templates non trouvé: {TEMPLATES_DIR}")
        return
    
    # Vérifier que le template dashboard.html existe
    dashboard_template = TEMPLATES_DIR / 'dashboard.html'
    if not dashboard_template.exists():
        logger.error(f"❌ Template dashboard.html non trouvé: {dashboard_template}")
        return
    
    # Initialiser le cache
    update_cache()
    
    # Démarrer le thread de mise à jour en arrière-plan
    updater_thread = threading.Thread(target=background_updater, daemon=True)
    updater_thread.start()
    
    logger.info(f"✅ Dashboard démarré sur http://{DEFAULT_HOST}:{DEFAULT_PORT}")
    logger.info("🔄 Mise à jour automatique toutes les 5 secondes")
    logger.info("🌐 WebSocket activé pour les mises à jour temps réel")
    
    # Démarrer le serveur Flask-SocketIO
    try:
        socketio.run(
            app,
            host=DEFAULT_HOST,
            port=DEFAULT_PORT,
            debug=DEFAULT_DEBUG,
            allow_unsafe_werkzeug=True
        )
    except Exception as e:
        logger.error(f"❌ Erreur lors du démarrage du serveur: {e}")

if __name__ == '__main__':
    main()
