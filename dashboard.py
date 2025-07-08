#!/usr/bin/env python3
"""
Dashboard web pour surveiller le pipeline PostFlow
"""

import sys
import os
import json
import logging
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, Any

# Ajouter le répertoire src au path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

try:
    from flask import Flask, render_template, jsonify, request
    from flask_socketio import SocketIO, emit
except ImportError:
    print("Flask et Flask-SocketIO requis pour le dashboard")
    print("Installation: pip install flask flask-socketio")
    sys.exit(1)

from src.utils.error_handler import ErrorHandler, PersistentQueue
from src.utils.file_watcher import LucidLinkWatcher

# Importer les intégrations Frame.io
try:
    from src.integrations.frameio import FrameIOClient
    FRAMEIO_AVAILABLE = True
except ImportError:
    FRAMEIO_AVAILABLE = False

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if not FRAMEIO_AVAILABLE:
    logger.warning("Frame.io integrations not available")

# Initialiser Flask
app = Flask(__name__)
app.config['SECRET_KEY'] = 'postflow-dashboard-secret'
socketio = SocketIO(app, cors_allowed_origins="*")

# Variables globales
error_handler = None
watcher = None
frameio_integration = None
config = {}


def load_config():
    """Charge la configuration."""
    global config
    config_path = "config/error_handling.json"
    
    if Path(config_path).exists():
        with open(config_path, 'r') as f:
            config = json.load(f)
    else:
        config = {'db_path': 'data/postflow.db'}


def init_components():
    """Initialise les composants."""
    global error_handler, watcher, frameio_integration
    
    try:
        error_handler = ErrorHandler(config)
        
        # Créer un watcher pour les stats (ne démarre pas automatiquement)
        watcher_config = config.get('watcher', {})
        watcher = LucidLinkWatcher(watcher_config, error_handler)
        
        # Initialize Frame.io integration
        if FRAMEIO_AVAILABLE:
            try:
                frameio_config_path = Path("config/frameio_config.json")
                if frameio_config_path.exists():
                    with open(frameio_config_path, 'r') as f:
                        frameio_config = json.load(f)
                    frameio_integration = FrameIOClient(frameio_config)
                    logger.info("Frame.io integration initialized")
                else:
                    logger.warning("Frame.io config not found")
            except Exception as e:
                logger.warning(f"Frame.io integration initialization failed: {e}")
                frameio_integration = None
        
    except Exception as e:
        logger.error(f"Failed to initialize components: {e}")


@app.route('/')
def dashboard():
    """Page principale du dashboard."""
    return render_template('dashboard.html')


@app.route('/api/status')
def api_status():
    """API pour récupérer le statut."""
    try:
        # Données de base
        status = {
            'timestamp': datetime.now().isoformat(),
            'components': {
                'error_handler': error_handler is not None,
                'watcher': watcher is not None,
                'frameio': frameio_integration is not None
            },
            'running': True,
            'processing': False  # Défaut à False
        }
        
        # Ajouter les détails si les composants sont initialisés
        if error_handler:
            try:
                error_status = error_handler.get_status()
                status.update(error_status)
                
                # Déterminer si le pipeline est en cours de traitement
                queue_stats = error_handler.queue.get_statistics()
                active_tasks = queue_stats.get('active_tasks', 0)
                queue_size = queue_stats.get('queue_size', 0)
                
                # Le pipeline est "processing" s'il y a des tâches actives ou en queue
                status['processing'] = active_tasks > 0 or queue_size > 0
                
            except Exception as e:
                logger.warning(f"Error getting error_handler status: {e}")
                status['processing'] = False
        
        # Ajouter le statut du watcher
        if watcher:
            try:
                watcher_status = watcher.get_status()
                status['watcher'] = watcher_status
            except Exception as e:
                logger.warning(f"Error getting watcher status: {e}")
                status['watcher'] = {'error': str(e)}
        
        # Ajouter des données de demo si pas de composants
        if not error_handler:
            status.update({
                'demo_mode': True,
                'queue_size': 0,
                'processed_files': 42,
                'error_count': 0,
                'last_activity': datetime.now().isoformat(),
                'processing': False  # En mode démo, pas de traitement
            })
        
        return jsonify(status)
        
    except Exception as e:
        logger.error(f"Error getting status: {e}")
        return jsonify({
            'error': str(e),
            'demo_mode': True,
            'timestamp': datetime.now().isoformat()
        }), 500


@app.route('/api/queue/stats')
def api_queue_stats():
    """API pour les statistiques de la queue."""
    try:
        if error_handler:
            raw_stats = error_handler.queue.get_statistics()
            # Formater les statistiques pour le dashboard
            queue_stats = {
                'pending': raw_stats.get('queue_size', 0),
                'processing': raw_stats.get('active_tasks', 0),
                'completed': raw_stats.get('completed_tasks', 0),
                'failed': raw_stats.get('failed_final', 0),
                'total_processed': raw_stats.get('total_processed', 0),
                'success_rate': raw_stats.get('success_rate', 0),
                'average_processing_time': raw_stats.get('average_processing_time', 0),
                'last_processed': raw_stats.get('last_processed', datetime.now().isoformat())
            }
        else:
            # Données de demo
            queue_stats = {
                'pending': 0,
                'processing': 0,
                'completed': 42,
                'failed': 1,
                'total_processed': 43,
                'success_rate': 95.5,
                'average_processing_time': 2.3,
                'last_processed': datetime.now().isoformat()
            }
        
        return jsonify(queue_stats)
        
    except Exception as e:
        logger.error(f"Error getting queue stats: {e}")
        return jsonify({
            'error': str(e),
            'demo_mode': True,
            'pending': 0,
            'processing': 0,
            'completed': 0,
            'failed': 0
        }), 500


@app.route('/api/health')
def api_health():
    """API pour la santé du système."""
    try:
        if error_handler:
            health_results = error_handler.health_monitor.run_checks()
            health_status = error_handler.health_monitor.get_status()
        else:
            # Données de demo
            health_results = {
                'system_health': 'good',
                'checks_passed': 4,
                'checks_total': 4,
                'last_check': datetime.now().isoformat()
            }
            health_status = {
                'overall': 'healthy',
                'components': {
                    'file_system': 'ok',
                    'network': 'ok',
                    'memory': 'ok',
                    'disk': 'ok'
                }
            }
        
        return jsonify({
            'results': health_results,
            'status': health_status,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error getting health status: {e}")
        return jsonify({
            'error': str(e),
            'demo_mode': True
        }), 500


@app.route('/api/errors')
def api_errors():
    """API pour récupérer les erreurs récentes."""
    if not error_handler:
        return jsonify({'error': 'Components not initialized'}), 500
    
    try:
        import sqlite3
        
        # Récupérer les erreurs des dernières 24h
        since = datetime.now() - timedelta(hours=24)
        
        with sqlite3.connect(config['db_path']) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT * FROM error_log 
                WHERE timestamp > ? 
                ORDER BY timestamp DESC 
                LIMIT 100
            ''', (since.isoformat(),))
            
            errors = [dict(row) for row in cursor.fetchall()]
            
        return jsonify(errors)
        
    except Exception as e:
        logger.error(f"Error getting errors: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/tasks')
def api_tasks():
    """API pour récupérer les tâches."""
    if not error_handler:
        return jsonify({'error': 'Components not initialized'}), 500
    
    try:
        import sqlite3
        
        with sqlite3.connect(config['db_path']) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT * FROM tasks 
                ORDER BY created_at DESC 
                LIMIT 100
            ''')
            
            tasks = [dict(row) for row in cursor.fetchall()]
            
        return jsonify(tasks)
        
    except Exception as e:
        logger.error(f"Error getting tasks: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/cleanup', methods=['POST'])
def api_cleanup():
    """API pour nettoyer les anciennes données."""
    if not error_handler:
        return jsonify({'error': 'Components not initialized'}), 500
    
    try:
        deleted = error_handler.cleanup()
        return jsonify({'deleted': deleted})
        
    except Exception as e:
        logger.error(f"Error during cleanup: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/frameio/status')
def api_frameio_status():
    """API pour le statut Frame.io."""
    if not FRAMEIO_AVAILABLE:
        return jsonify({'error': 'Frame.io integration not available'}), 500
    
    try:
        if frameio_integration:
            status = frameio_integration.get_status()
            return jsonify({
                'success': True,
                'status': status
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Frame.io client not initialized'
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/frameio/projects')
def api_frameio_projects():
    """API pour récupérer les projets Frame.io."""
    if not FRAMEIO_AVAILABLE or not frameio_integration:
        return jsonify({'error': 'Frame.io integration not available'}), 500
    
    try:
        projects = frameio_integration.get_projects()
        return jsonify({
            'success': True,
            'projects': projects
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/frameio/upload', methods=['POST'])
def api_frameio_upload():
    """API pour upload de fichiers Frame.io."""
    if not FRAMEIO_AVAILABLE or not frameio_integration:
        return jsonify({'error': 'Frame.io integration not available'}), 500
    
    try:
        data = request.get_json()
        file_path = data.get('file_path')
        
        if not file_path:
            return jsonify({
                'success': False,
                'error': 'File path required'
            }), 400
        
        result = frameio_integration.upload_file(
            file_path,
            parent_id=data.get('parent_id'),
            project_id=data.get('project_id'),
            metadata=data.get('metadata', {})
        )
        
        return jsonify(result)
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@socketio.on('connect')
def handle_connect():
    """Gère la connexion WebSocket."""
    logger.info('Client connected')
    emit('connected', {'data': 'Connected to PostFlow Dashboard'})


@socketio.on('disconnect')
def handle_disconnect():
    """Gère la déconnexion WebSocket."""
    logger.info('Client disconnected')


def create_html_template():
    """Crée le template HTML pour le dashboard."""
    templates_dir = Path("templates")
    templates_dir.mkdir(exist_ok=True)
    
    html_content = '''<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PostFlow Dashboard</title>
    <script src="https://cdn.socket.io/4.0.0/socket.io.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .dashboard {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #333;
            margin: 0;
        }
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-healthy { background-color: #4CAF50; }
        .status-unhealthy { background-color: #f44336; }
        .status-warning { background-color: #ff9800; }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .card h3 {
            margin-top: 0;
            color: #333;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        .metric {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .metric:last-child {
            border-bottom: none;
        }
        .metric-value {
            font-weight: bold;
            color: #666;
        }
        .error-log {
            max-height: 300px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
        }
        .error-entry {
            padding: 5px;
            margin: 5px 0;
            border-left: 3px solid #ddd;
            background: #f9f9f9;
        }
        .error-entry.error {
            border-left-color: #f44336;
        }
        .error-entry.warning {
            border-left-color: #ff9800;
        }
        .error-entry.critical {
            border-left-color: #9c27b0;
        }
        .tasks-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }
        .tasks-table th,
        .tasks-table td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .tasks-table th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        .task-status {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .task-status.pending { background-color: #e3f2fd; color: #1976d2; }
        .task-status.processing { background-color: #fff3e0; color: #f57c00; }
        .task-status.completed { background-color: #e8f5e8; color: #388e3c; }
        .task-status.failed { background-color: #ffebee; color: #d32f2f; }
        .task-status.retry { background-color: #fce4ec; color: #c2185b; }
        .refresh-btn {
            background-color: #2196F3;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin: 10px 0;
        }
        .refresh-btn:hover {
            background-color: #1976D2;
        }
        .auto-refresh {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>🎬 PostFlow Dashboard</h1>
            <div id="connection-status">
                <span class="status-indicator status-warning"></span>
                Connexion...
            </div>
        </div>
        
        <div class="auto-refresh">
            <label>
                <input type="checkbox" id="auto-refresh" checked>
                Actualisation automatique (10s)
            </label>
            <button class="refresh-btn" onclick="refreshAll()">Actualiser</button>
            <button class="refresh-btn" onclick="document.getElementById('debug-log').innerHTML = ''">Vider Debug</button>
        </div>
        
        <!-- Zone de debug -->
        <div class="card" style="margin-bottom: 20px;">
            <h3>🔍 Debug en temps réel</h3>
            <div id="debug-log" style="height: 150px; overflow-y: auto; font-family: monospace; font-size: 12px; background: #f5f5f5; padding: 10px; border-radius: 4px;">
                <div>[Init] Dashboard chargé</div>
            </div>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>État du Système</h3>
                <div id="system-status">
                    <div class="metric">
                        <span>Traitement</span>
                        <span class="metric-value" id="processing-status">-</span>
                    </div>
                    <div class="metric">
                        <span>Santé</span>
                        <span class="metric-value" id="health-status">-</span>
                    </div>
                    <div class="metric">
                        <span>Watcher</span>
                        <span class="metric-value" id="watcher-status">-</span>
                    </div>
                    <div class="metric">
                        <span>Dernière mise à jour</span>
                        <span class="metric-value" id="last-update">-</span>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>Statistiques des Tâches</h3>
                <div id="queue-stats">
                    <div class="metric">
                        <span>En attente</span>
                        <span class="metric-value" id="pending-count">-</span>
                    </div>
                    <div class="metric">
                        <span>En cours</span>
                        <span class="metric-value" id="processing-count">-</span>
                    </div>
                    <div class="metric">
                        <span>Terminées</span>
                        <span class="metric-value" id="completed-count">-</span>
                    </div>
                    <div class="metric">
                        <span>Échecs</span>
                        <span class="metric-value" id="failed-count">-</span>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>Surveillance des Fichiers</h3>
                <div id="watcher-info">
                    <div class="metric">
                        <span>Fichiers suivis</span>
                        <span class="metric-value" id="tracked-files">-</span>
                    </div>
                    <div class="metric">
                        <span>Erreurs de scan</span>
                        <span class="metric-value" id="scan-errors">-</span>
                    </div>
                    <div class="metric">
                        <span>Callbacks</span>
                        <span class="metric-value" id="callbacks-count">-</span>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>Vérifications de Santé</h3>
                <div id="health-checks">
                    <!-- Dynamiquement peuplé -->
                </div>
            </div>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>Journal des Erreurs</h3>
                <div id="error-log" class="error-log">
                    <!-- Dynamiquement peuplé -->
                </div>
            </div>
            
            <div class="card">
                <h3>Tâches Récentes</h3>
                <div style="max-height: 300px; overflow-y: auto;">
                    <table class="tasks-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Statut</th>
                                <th>Tentatives</th>
                                <th>Créé</th>
                            </tr>
                        </thead>
                        <tbody id="tasks-table-body">
                            <!-- Dynamiquement peuplé -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Initialiser Socket.IO
        const socket = io();
        
        socket.on('connect', function() {
            document.getElementById('connection-status').innerHTML = 
                '<span class="status-indicator status-healthy"></span>Connecté';
        });
        
        socket.on('disconnect', function() {
            document.getElementById('connection-status').innerHTML = 
                '<span class="status-indicator status-unhealthy"></span>Déconnecté';
        });
        
        // Variables pour éviter les appels multiples
        let isRefreshing = false;
        let refreshCount = 0;
        let debugMode = true; // Activer le mode debug
        
        // Fonction pour logger dans l'UI
        function logToUI(message) {
            if (debugMode) {
                console.log(`[DEBUG] ${message}`);
                // Ajouter aussi dans l'UI
                const debugDiv = document.getElementById('debug-log');
                if (debugDiv) {
                    debugDiv.innerHTML += `<div>[${new Date().toLocaleTimeString()}] ${message}</div>`;
                    debugDiv.scrollTop = debugDiv.scrollHeight;
                }
            }
        }
        
        // Fonction pour actualiser les données
        async function refreshAll() {
            if (isRefreshing) {
                logToUI('Refresh déjà en cours, ignoré');
                return;
            }
            
            isRefreshing = true;
            refreshCount++;
            
            try {
                logToUI(`Refresh #${refreshCount} démarré`);
                
                // Appels séquentiels plutôt que parallèles pour éviter la surcharge
                await refreshStatus();
                await refreshQueueStats();
                await refreshHealth();
                await refreshErrors();
                await refreshTasks();
                
                logToUI(`Refresh #${refreshCount} terminé`);
                
            } catch (error) {
                logToUI(`Erreur lors du refresh #${refreshCount}: ${error.message}`);
                console.error(`Erreur lors du refresh #${refreshCount}:`, error);
            } finally {
                isRefreshing = false;
            }
        }
        
        async function refreshStatus() {
            try {
                logToUI('Début refreshStatus');
                
                const response = await fetch('/api/status', { 
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    signal: AbortSignal.timeout(5000) // Timeout de 5 secondes
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                logToUI(`Status data reçu: ${JSON.stringify(data).substring(0, 100)}...`);
                
                // Mise à jour des éléments DOM avec vérification
                const processingElement = document.getElementById('processing-status');
                if (processingElement) {
                    processingElement.textContent = data.processing ? '✅ Actif' : '❌ Arrêté';
                    logToUI(`Processing status mis à jour: ${data.processing ? 'Actif' : 'Arrêté'}`);
                } else {
                    logToUI('ERREUR: element processing-status non trouvé');
                }
                
                const healthElement = document.getElementById('health-status');
                if (healthElement) {
                    healthElement.textContent = data.health_status && data.health_status.healthy ? '✅ Sain' : '❌ Problème';
                    logToUI(`Health status mis à jour: ${data.health_status && data.health_status.healthy ? 'Sain' : 'Problème'}`);
                } else {
                    logToUI('ERREUR: element health-status non trouvé');
                }
                
                if (data.watcher) {
                    const watcherElement = document.getElementById('watcher-status');
                    if (watcherElement) {
                        watcherElement.textContent = data.watcher.running ? '✅ Actif' : '❌ Arrêté';
                        logToUI(`Watcher status mis à jour: ${data.watcher.running ? 'Actif' : 'Arrêté'}`);
                    }
                    
                    const trackedElement = document.getElementById('tracked-files');
                    if (trackedElement) {
                        trackedElement.textContent = data.watcher.tracked_files || 0;
                    }
                } else {
                    logToUI('Pas de données watcher');
                }
                
                const updateElement = document.getElementById('last-update');
                if (updateElement) {
                    updateElement.textContent = new Date(data.timestamp).toLocaleString();
                    logToUI('Timestamp mis à jour');
                }
                
                logToUI('refreshStatus terminé avec succès');
                
            } catch (error) {
                logToUI(`Erreur refreshStatus: ${error.message}`);
                console.error('Erreur refreshStatus:', error);
                
                // Afficher des valeurs par défaut en cas d'erreur
                const elements = [
                    { id: 'processing-status', value: '❌ Erreur' },
                    { id: 'health-status', value: '❌ Erreur' },
                    { id: 'watcher-status', value: '❌ Erreur' },
                    { id: 'last-update', value: 'Erreur de connexion' }
                ];
                
                elements.forEach(({ id, value }) => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.textContent = value;
                    }
                });
            }
        }
        
        async function refreshQueueStats() {
            try {
                const response = await fetch('/api/queue/stats');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Queue stats data:', data); // Debug
                
                // Gérer différentes structures de données
                if (data.pending !== undefined) {
                    document.getElementById('pending-count').textContent = data.pending || 0;
                    document.getElementById('processing-count').textContent = data.processing || 0;
                    document.getElementById('completed-count').textContent = data.completed || 0;
                    document.getElementById('failed-count').textContent = data.failed || 0;
                } else {
                    // Structure alternative avec total_processed, etc.
                    document.getElementById('pending-count').textContent = data.current_size || 0;
                    document.getElementById('processing-count').textContent = '0';
                    document.getElementById('completed-count').textContent = data.total_processed || 0;
                    document.getElementById('failed-count').textContent = data.failed_final || 0;
                }
                
            } catch (error) {
                console.error('Erreur refreshQueueStats:', error);
                // Valeurs par défaut
                document.getElementById('pending-count').textContent = '0';
                document.getElementById('processing-count').textContent = '0';
                document.getElementById('completed-count').textContent = '0';
                document.getElementById('failed-count').textContent = '0';
            }
        }
        
        async function refreshHealth() {
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                
                const healthChecks = document.getElementById('health-checks');
                healthChecks.innerHTML = '';
                
                if (data.status && data.status.failure_counts) {
                    for (const [name, failures] of Object.entries(data.status.failure_counts)) {
                        const metric = document.createElement('div');
                        metric.className = 'metric';
                        metric.innerHTML = `
                            <span>${name}</span>
                            <span class="metric-value">
                                ${failures === 0 ? '✅' : '❌'} ${failures} échecs
                            </span>
                        `;
                        healthChecks.appendChild(metric);
                    }
                } else {
                    // Mode démo
                    const metric = document.createElement('div');
                    metric.className = 'metric';
                    metric.innerHTML = `
                        <span>Système</span>
                        <span class="metric-value">✅ Mode démo</span>
                    `;
                    healthChecks.appendChild(metric);
                }
                
            } catch (error) {
                console.error('Erreur refreshHealth:', error);
                const healthChecks = document.getElementById('health-checks');
                healthChecks.innerHTML = '<div class="metric"><span>Erreur</span><span class="metric-value">❌ Indisponible</span></div>';
            }
        }
        
        async function refreshErrors() {
            try {
                const response = await fetch('/api/errors');
                const data = await response.json();
                
                const errorLog = document.getElementById('error-log');
                errorLog.innerHTML = '';
                
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(error => {
                        const entry = document.createElement('div');
                        entry.className = `error-entry ${error.level || 'info'}`;
                        entry.innerHTML = `
                            <strong>${new Date(error.timestamp).toLocaleString()}</strong>
                            [${(error.level || 'INFO').toUpperCase()}] ${error.component || 'System'}: ${error.message}
                        `;
                        errorLog.appendChild(entry);
                    });
                } else {
                    // Aucune erreur ou mode démo
                    const entry = document.createElement('div');
                    entry.className = 'error-entry info';
                    entry.innerHTML = `
                        <strong>${new Date().toLocaleString()}</strong>
                        [INFO] Système: Aucune erreur récente
                    `;
                    errorLog.appendChild(entry);
                }
                
            } catch (error) {
                console.error('Erreur refreshErrors:', error);
                const errorLog = document.getElementById('error-log');
                errorLog.innerHTML = `
                    <div class="error-entry error">
                        <strong>${new Date().toLocaleString()}</strong>
                        [ERROR] Dashboard: Impossible de charger les erreurs
                    </div>
                `;
            }
        }
        
        async function refreshTasks() {
            try {
                const response = await fetch('/api/tasks');
                const data = await response.json();
                
                const tableBody = document.getElementById('tasks-table-body');
                tableBody.innerHTML = '';
                
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(task => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${task.id}</td>
                            <td>${task.task_type}</td>
                            <td><span class="task-status ${task.status}">${task.status}</span></td>
                            <td>${task.attempts}/${task.max_attempts}</td>
                            <td>${new Date(task.created_at).toLocaleString()}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                } else {
                    // Aucune tâche ou mode démo
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td colspan="5" style="text-align: center; color: #666;">
                            Aucune tâche récente
                        </td>
                    `;
                    tableBody.appendChild(row);
                }
                
            } catch (error) {
                console.error('Erreur refreshTasks:', error);
                const tableBody = document.getElementById('tasks-table-body');
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; color: #f44336;">
                            Erreur lors du chargement des tâches
                        </td>
                    </tr>
                `;
            }
        }
        
        // Actualisation automatique avec protection
        let autoRefreshInterval;
        const REFRESH_INTERVAL = 10000; // 10 secondes au lieu de 5
        
        function toggleAutoRefresh() {
            const checkbox = document.getElementById('auto-refresh');
            
            if (checkbox.checked) {
                console.log('Activation du refresh automatique');
                autoRefreshInterval = setInterval(() => {
                    if (!isRefreshing) {
                        refreshAll();
                    } else {
                        console.log('Refresh automatique sauté (refresh en cours)');
                    }
                }, REFRESH_INTERVAL);
            } else {
                console.log('Désactivation du refresh automatique');
                clearInterval(autoRefreshInterval);
            }
        }
        
        // Initialiser
        document.getElementById('auto-refresh').addEventListener('change', toggleAutoRefresh);
        
        // Première actualisation
        refreshAll();
        toggleAutoRefresh();
    </script>
</body>
</html>'''
    
    with open(templates_dir / "dashboard.html", 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    logger.info("HTML template created")


def main():
    """Lance le dashboard."""
    print("PostFlow Dashboard")
    print("==================")
    
    # Charger la configuration
    load_config()
    
    # Initialiser les composants
    init_components()
    
    # Créer le template HTML
    create_html_template()
    
    # Lire la configuration du pipeline pour le port
    pipeline_config_path = Path(__file__).parent / "pipeline_config.json"
    default_port = 5000
    default_host = '127.0.0.1'
    
    if pipeline_config_path.exists():
        try:
            with open(pipeline_config_path, 'r') as f:
                pipeline_config = json.load(f)
            dashboard_config = pipeline_config.get('dashboard', {})
            default_port = dashboard_config.get('port', 8080)
            default_host = dashboard_config.get('host', '0.0.0.0')
        except Exception as e:
            print(f"⚠️ Erreur lecture config pipeline: {e}")
    
    # Lancer le serveur
    port = int(os.getenv('PORT', default_port))
    host = os.getenv('HOST', default_host)
    
    print(f"Dashboard disponible sur: http://{host}:{port}")
    print("Ctrl+C pour arrêter")
    
    try:
        socketio.run(app, host=host, port=port, debug=False)
    except KeyboardInterrupt:
        print("\nArrêt du dashboard")


if __name__ == "__main__":
    main()
