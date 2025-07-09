# Tests PostFlow

Ce dossier contient tous les tests pour le système PostFlow. Les tests sont organisés de manière modulaire et utilisent pytest.

## 📁 Structure

```
tests/
├── conftest.py                    # Configuration pytest et fixtures
├── requirements-test.txt          # Dépendances pour les tests
├── unit/                          # Tests unitaires
│   ├── test_error_handler.py      # Tests du gestionnaire d'erreurs
│   ├── test_file_watcher.py       # Tests du watcher de fichiers
│   └── test_integrations.py       # Tests des intégrations
├── integration/                   # Tests d'intégration
│   ├── test_workflow.py           # Tests du workflow complet
│   └── test_server_structure.py   # Tests de structure serveur
└── fixtures/                      # Données de test
    └── test_data.py               # Données communes
```

## 🚀 Exécution des tests

### Installation des dépendances
```bash
pip install -r tests/requirements-test.txt
```

### Exécuter tous les tests
```bash
pytest tests/
```

### Exécuter les tests unitaires uniquement
```bash
pytest tests/unit/
```

### Exécuter les tests d'intégration uniquement
```bash
pytest tests/integration/
```

### Exécuter avec coverage
```bash
pytest tests/ --cov=src --cov-report=html
```

### Exécuter en parallèle
```bash
pytest tests/ -n auto
```

## 📋 Types de tests

### Tests unitaires (`tests/unit/`)
Tests des composants individuels :
- **test_error_handler.py** : Gestionnaire d'erreurs, queue persistante, retries
- **test_file_watcher.py** : Watcher de fichiers, détection d'événements
- **test_integrations.py** : Intégrations Frame.io, Google Sheets, Discord

### Tests d'intégration (`tests/integration/`)
Tests du système complet :
- **test_workflow.py** : Workflow end-to-end avec retries et gestion d'erreurs
- **test_server_structure.py** : Structure et configuration du serveur

## 🔧 Configuration

### Fixtures pytest (conftest.py)
- `temp_dir` : Dossier temporaire pour les tests
- `test_db_path` : Base de données SQLite de test
- `mock_config` : Configuration de test standard
- `sample_file_event` : Événement de fichier de test
- `mock_*_client` : Clients mockés pour les intégrations

### Variables d'environnement
```bash
# Pour les tests d'intégration
export FRAMEIO_API_TOKEN="test_token"
export GOOGLE_SHEETS_CREDENTIALS="test_credentials.json"
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/test"
```

## 📊 Coverage

Objectif de coverage : **>90%**

Zones critiques à tester :
- ✅ Gestionnaire d'erreurs et retries
- ✅ Queue persistante SQLite
- ✅ File watcher et détection d'événements
- ✅ Workflow complet avec intégrations
- ✅ Gestion de pannes et robustesse

## 🐛 Debug des tests

### Logs détaillés
```bash
pytest tests/ -v -s --log-level=DEBUG
```

### Test spécifique
```bash
pytest tests/ -k "test_task_retry" -v
```

### Profiling des tests lents
```bash
pytest tests/ --durations=10
```

## ⚡ Tests rapides

Pour les développements rapides, utilisez les marqueurs pytest :

```bash
# Tests rapides uniquement (< 1s)
pytest tests/ -m "not slow"

# Tests critiques uniquement
pytest tests/ -m "critical"
```

Marqueurs disponibles :
- `@pytest.mark.slow` : Tests lents (>5s)
- `@pytest.mark.critical` : Tests critiques
- `@pytest.mark.integration` : Tests d'intégration
- `@pytest.mark.unit` : Tests unitaires

### 🚀 Exécution des tests

#### Exécuter tous les tests
```bash
# Depuis la racine du projet
python run_tests.py
```

#### Exécuter un test spécifique
```bash
# Validation complète
python tests/setup_validation.py

# Structure serveur
python tests/test_server_structure.py

# Intégrations
python tests/test_integrations_simple.py
```

## Description des tests

### setup_validation.py
Test complet qui vérifie :
- ✅ Accessibilité du volume LucidLink
- ✅ Structure de dossiers complète
- ✅ Données CSV (516 plans)
- ✅ Permissions lecture/écriture
- ⏳ Sources disponibles
- ⏳ Templates After Effects

### test_server_structure.py
Test spécifique de la structure serveur :
- 📁 Vérification de tous les dossiers critiques
- 📄 Présence des fichiers de configuration
- 🎬 Dossiers de scènes exemples
- 🔐 Test des permissions d'écriture
- 🔄 Simulation d'un workflow complet

### test_integrations_simple.py
Test des intégrations et nomenclatures :
- 🔗 Génération des chemins LucidLink
- 🎬 Convention de nommage After Effects
- 📁 Logique de structure des dossiers
- 📊 Intégration avec les données CSV

## Prérequis

- Volume LucidLink `o2b-undllm` monté sur `/Volumes/resizelab/o2b-undllm`
- Fichier `pipeline_config.json` configuré
- Données CSV dans `data/shots.csv`
- Python 3.7+

## Résultats attendus

Tous les tests doivent passer avec succès pour confirmer que :
1. Le volume LucidLink est accessible
2. La structure de dossiers est complète
3. Les données CSV sont correctement parsées
4. Les permissions sont configurées
5. Le pipeline est prêt pour la production

## En cas d'échec

Si un test échoue :
1. Vérifiez la connexion LucidLink
2. Confirmez le montage du volume `o2b-undllm`
3. Vérifiez la configuration dans `pipeline_config.json`
4. Exécutez `create_folder_structure.py` si nécessaire
5. Consultez les logs d'erreur pour plus de détails
