# Système de Gestion d'Erreurs Renforcé - PostFlow

Le système de gestion d'erreurs renforcé de PostFlow assure une robustesse maximale du pipeline de post-production en gérant automatiquement les échecs, les retries, et le monitoring de santé.

## Architecture du Système

### Composants Principaux

1. **ErrorHandler** : Gestionnaire central d'erreurs
2. **PersistentQueue** : Queue SQLite pour les tâches
3. **RetryStrategy** : Stratégie de retry avec backoff exponentiel
4. **HealthMonitor** : Monitoring de santé du système
5. **WorkflowTrigger** : Déclencheur robuste du workflow

### Fonctionnalités Clés

- ✅ **Queue persistante** : Les tâches survivent aux redémarrages
- ✅ **Retry automatique** : Backoff exponentiel intelligent
- ✅ **Monitoring de santé** : Vérifications automatiques
- ✅ **Alertes** : Notifications email et logs structurés
- ✅ **Dashboard web** : Interface de monitoring en temps réel
- ✅ **Gestion des erreurs** : Logging structuré et traçabilité

## Installation et Configuration

### 1. Installation des dépendances

```bash
# Installer les dépendances Python
pip install -r requirements.txt

# Installer les dépendances pour le dashboard (optionnel)
pip install flask flask-socketio eventlet
```

### 2. Configuration du système

```bash
# Lancer la configuration interactive
python configure_error_handling.py
```

Cette commande vous guidera dans la configuration :
- Chemins de base de données
- Paramètres de retry
- Configuration du watcher
- Monitoring de santé
- Alertes email
- Paramètres des tâches

### 3. Configuration générée

Le script créera les fichiers suivants :

- `config/error_handling.json` : Configuration principale
- `monitor_postflow.py` : Script de monitoring
- `main.py` : Exemple d'utilisation
- `postflow.service` : Service systemd (optionnel)

## Utilisation

### Démarrage du Pipeline

```bash
# Démarrage normal
python main.py

# Vérification du statut
python main.py status

# Mode test
python main.py test
```

### Monitoring

```bash
# Monitoring en ligne de commande
python monitor_postflow.py

# Dashboard web
python dashboard.py
# Puis ouvrir http://localhost:5000
```

### Tests

```bash
# Lancer les tests du système d'erreurs
python test_error_handling.py
```

## Architecture Détaillée

### Gestion des Tâches

Le système utilise une queue persistante SQLite pour gérer les tâches :

```python
# Ajouter une tâche
task_id = error_handler.add_task(
    'upload_frameio',
    {'file_path': '/path/to/video.mov', 'shot': 'UNDLM_12345'},
    priority=0,
    max_attempts=3
)
```

### Cycle de Vie des Tâches

1. **PENDING** : Tâche créée, en attente
2. **PROCESSING** : Tâche en cours d'exécution
3. **COMPLETED** : Tâche terminée avec succès
4. **FAILED** : Tâche échouée (temporairement)
5. **RETRY** : Tâche programmée pour retry
6. **CANCELLED** : Tâche annulée

### Stratégie de Retry

Le système utilise un backoff exponentiel :

```python
# Configuration par défaut
retry_strategy = RetryStrategy(
    base_delay=1.0,      # Délai de base : 1 seconde
    max_delay=300.0,     # Délai maximum : 5 minutes
    backoff_factor=2.0   # Facteur de backoff : x2
)

# Délais : 1s, 2s, 4s, 8s, 16s, 32s, 64s, 128s, 256s, 300s (max)
```

### Monitoring de Santé

Le système surveille automatiquement :

- **Chemins LucidLink** : Disponibilité des dossiers
- **Watcher** : État du surveillance des fichiers
- **Intégrations** : Connectivité Frame.io, Google Sheets, Discord
- **Queue** : Backlog et performances

### Alertes

Le système peut envoyer des alertes :

- **Email** : Pour les erreurs critiques
- **Logs** : Tous les événements
- **Dashboard** : Monitoring en temps réel

## Configuration Avancée

### Exemple de Configuration

```json
{
  "db_path": "data/postflow.db",
  "retry_base_delay": 1.0,
  "retry_max_delay": 300.0,
  "retry_backoff_factor": 2.0,
  "watcher": {
    "polling_interval": 5.0,
    "min_file_age": 10.0,
    "max_scan_errors": 5,
    "error_backoff": 30.0,
    "path_check_interval": 300.0,
    "base_path": "/Volumes/resizelab/o2b-undllm",
    "supported_extensions": [".mov", ".mp4", ".avi"]
  },
  "health_monitor": {
    "check_interval": 60.0,
    "alert_threshold": 5
  },
  "alerts": {
    "email_enabled": true,
    "email": {
      "smtp_server": "smtp.gmail.com",
      "smtp_port": 587,
      "smtp_tls": true,
      "smtp_user": "your-email@gmail.com",
      "smtp_password": "your-app-password",
      "from_email": "your-email@gmail.com",
      "to_email": "alerts@yourcompany.com"
    }
  },
  "tasks": {
    "default_max_attempts": 3,
    "default_timeout": 300,
    "cleanup_days": 7
  }
}
```

### Personnalisation des Handlers

```python
# Enregistrer un handler personnalisé
def custom_task_handler(data):
    """Handler personnalisé pour une tâche."""
    try:
        # Logique de traitement
        return True  # Succès
    except Exception as e:
        logger.error(f"Erreur dans le handler personnalisé: {e}")
        return False  # Échec

# Enregistrer le handler
error_handler.register_task_handler('custom_task', custom_task_handler)
```

### Vérifications de Santé Personnalisées

```python
# Ajouter une vérification de santé
def check_disk_space():
    """Vérifie l'espace disque."""
    import shutil
    free_space = shutil.disk_usage('/').free
    return free_space > 10 * 1024 * 1024 * 1024  # 10GB minimum

error_handler.health_monitor.register_check('disk_space', check_disk_space)
```

## Déploiement en Production

### Service Systemd

```bash
# Copier le service
sudo cp postflow.service /etc/systemd/system/

# Activer le service
sudo systemctl daemon-reload
sudo systemctl enable postflow
sudo systemctl start postflow

# Vérifier le statut
sudo systemctl status postflow
```

### Monitoring et Logs

```bash
# Voir les logs
sudo journalctl -u postflow -f

# Monitoring des performances
python monitor_postflow.py

# Dashboard web
python dashboard.py
```

### Rotation des Logs

```bash
# Ajouter à /etc/logrotate.d/postflow
/path/to/postflow.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 user group
    postrotate
        systemctl reload postflow
    endscript
}
```

## Dépannage

### Problèmes Courants

1. **Base de données verrouillée**
   ```bash
   # Vérifier les processus utilisant la DB
   lsof data/postflow.db
   # Arrêter proprement le service
   sudo systemctl stop postflow
   ```

2. **Chemins LucidLink inaccessibles**
   ```bash
   # Vérifier le montage
   ls -la /Volumes/resizelab/
   # Remonter si nécessaire
   ```

3. **Erreurs d'intégration**
   ```bash
   # Vérifier la configuration
   python configure_integrations.py
   # Tester les connexions
   python test_integrations.py
   ```

### Debugging

```python
# Activer le mode debug
import logging
logging.basicConfig(level=logging.DEBUG)

# Vérifier l'état du système
status = error_handler.get_status()
print(json.dumps(status, indent=2))
```

## Sécurité

### Bonnes Pratiques

1. **Permissions des fichiers**
   ```bash
   chmod 600 config/*.json  # Configs sensibles
   chmod 700 data/          # Dossier de données
   ```

2. **Secrets et mots de passe**
   - Utiliser des variables d'environnement
   - Chiffrer les configs sensibles
   - Rotation régulière des clés API

3. **Monitoring**
   - Surveiller les tentatives d'accès
   - Alertes sur les échecs d'authentification
   - Logging des actions sensibles

## Performance

### Optimisations

1. **Base de données**
   - Index sur les colonnes fréquemment utilisées
   - Nettoyage automatique des anciennes données
   - Vacuum périodique

2. **Mémoire**
   - Limitation de la taille des caches
   - Nettoyage des objets temporaires
   - Monitoring de l'utilisation mémoire

3. **Réseau**
   - Timeout appropriés
   - Retry avec backoff
   - Pooling de connexions

### Métriques

Le système expose plusieurs métriques :

- **Débit** : Tâches traitées par minute
- **Latence** : Temps de traitement moyen
- **Erreurs** : Taux d'échec par type
- **Santé** : Disponibilité des services

## Conclusion

Le système de gestion d'erreurs renforcé de PostFlow assure :

- **Robustesse** : Résistance aux pannes
- **Traçabilité** : Logs détaillés et monitoring
- **Scalabilité** : Gestion de charge élevée
- **Maintenabilité** : Configuration centralisée
- **Monitoring** : Visibilité complète du système

Ce système transforme PostFlow en une solution de production robuste, capable de gérer les conditions réelles d'un pipeline de post-production professionnel.
