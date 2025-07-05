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

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialiser Flask
app = Flask(__name__)
app.config['SECRET_KEY'] = 'postflow-dashboard-secret'
socketio = SocketIO(app, cors_allowed_origins="*")

# Variables globales
error_handler = None
watcher = None
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
    global error_handler, watcher
    
    try:
        error_handler = ErrorHandler(config)
        
        # Créer un watcher pour les stats (ne démarre pas automatiquement)
        watcher_config = config.get('watcher', {})
        watcher = LucidLinkWatcher(watcher_config, error_handler)
        
    except Exception as e:
        logger.error(f"Failed to initialize components: {e}")


@app.route('/')
def dashboard():
    """Page principale du dashboard."""
    return render_template('dashboard.html')


@app.route('/api/status')
def api_status():
    """API pour récupérer le statut."""
    if not error_handler:
        return jsonify({'error': 'Components not initialized'}), 500
    
    try:
        status = error_handler.get_status()
        
        # Ajouter le statut du watcher
        if watcher:
            watcher_status = watcher.get_status()
            status['watcher'] = watcher_status
        
        # Ajouter timestamp
        status['timestamp'] = datetime.now().isoformat()
        
        return jsonify(status)
        
    except Exception as e:
        logger.error(f"Error getting status: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/queue/stats')
def api_queue_stats():
    """API pour les statistiques de la queue."""
    if not error_handler:
        return jsonify({'error': 'Components not initialized'}), 500
    
    try:
        queue_stats = error_handler.queue.get_statistics()
        return jsonify(queue_stats)
        
    except Exception as e:
        logger.error(f"Error getting queue stats: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/health')
def api_health():
    """API pour la santé du système."""
    if not error_handler:
        return jsonify({'error': 'Components not initialized'}), 500
    
    try:
        health_results = error_handler.health_monitor.run_checks()
        health_status = error_handler.health_monitor.get_status()
        
        return jsonify({
            'results': health_results,
            'status': health_status,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error getting health status: {e}")
        return jsonify({'error': str(e)}), 500


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
                Actualisation automatique (5s)
            </label>
            <button class="refresh-btn" onclick="refreshAll()">Actualiser</button>
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
        
        // Fonction pour actualiser les données
        async function refreshAll() {
            try {
                await Promise.all([
                    refreshStatus(),
                    refreshQueueStats(),
                    refreshHealth(),
                    refreshErrors(),
                    refreshTasks()
                ]);
            } catch (error) {
                console.error('Erreur lors de l\'actualisation:', error);
            }
        }
        
        async function refreshStatus() {
            try {
                const response = await fetch('/api/status');
                const data = await response.json();
                
                document.getElementById('processing-status').textContent = 
                    data.processing ? '✅ Actif' : '❌ Arrêté';
                
                document.getElementById('health-status').textContent = 
                    data.health_status.healthy ? '✅ Sain' : '❌ Problème';
                
                if (data.watcher) {
                    document.getElementById('watcher-status').textContent = 
                        data.watcher.running ? '✅ Actif' : '❌ Arrêté';
                    document.getElementById('tracked-files').textContent = 
                        data.watcher.tracked_files;
                    document.getElementById('scan-errors').textContent = 
                        data.watcher.scan_error_count;
                    document.getElementById('callbacks-count').textContent = 
                        data.watcher.callbacks_registered;
                }
                
                document.getElementById('last-update').textContent = 
                    new Date(data.timestamp).toLocaleString();
                
            } catch (error) {
                console.error('Erreur refreshStatus:', error);
            }
        }
        
        async function refreshQueueStats() {
            try {
                const response = await fetch('/api/queue/stats');
                const data = await response.json();
                
                document.getElementById('pending-count').textContent = data.pending || 0;
                document.getElementById('processing-count').textContent = data.processing || 0;
                document.getElementById('completed-count').textContent = data.completed || 0;
                document.getElementById('failed-count').textContent = data.failed || 0;
                
            } catch (error) {
                console.error('Erreur refreshQueueStats:', error);
            }
        }
        
        async function refreshHealth() {
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                
                const healthChecks = document.getElementById('health-checks');
                healthChecks.innerHTML = '';
                
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
                
            } catch (error) {
                console.error('Erreur refreshHealth:', error);
            }
        }
        
        async function refreshErrors() {
            try {
                const response = await fetch('/api/errors');
                const data = await response.json();
                
                const errorLog = document.getElementById('error-log');
                errorLog.innerHTML = '';
                
                data.forEach(error => {
                    const entry = document.createElement('div');
                    entry.className = `error-entry ${error.level}`;
                    entry.innerHTML = `
                        <strong>${new Date(error.timestamp).toLocaleString()}</strong>
                        [${error.level.toUpperCase()}] ${error.component}: ${error.message}
                    `;
                    errorLog.appendChild(entry);
                });
                
            } catch (error) {
                console.error('Erreur refreshErrors:', error);
            }
        }
        
        async function refreshTasks() {
            try {
                const response = await fetch('/api/tasks');
                const data = await response.json();
                
                const tableBody = document.getElementById('tasks-table-body');
                tableBody.innerHTML = '';
                
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
                
            } catch (error) {
                console.error('Erreur refreshTasks:', error);
            }
        }
        
        // Actualisation automatique
        let autoRefreshInterval;
        
        function toggleAutoRefresh() {
            const checkbox = document.getElementById('auto-refresh');
            
            if (checkbox.checked) {
                autoRefreshInterval = setInterval(refreshAll, 5000);
            } else {
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
    
    # Lancer le serveur
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '127.0.0.1')
    
    print(f"Dashboard disponible sur: http://{host}:{port}")
    print("Ctrl+C pour arrêter")
    
    try:
        socketio.run(app, host=host, port=port, debug=False)
    except KeyboardInterrupt:
        print("\nArrêt du dashboard")


if __name__ == "__main__":
    main()
