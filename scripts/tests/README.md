# 🧪 Tests - RL PostFlow

Ce dossier contient tous les tests automatisés pour le projet RL PostFlow.

## 📋 **Structure des Tests**

```
tests/
├── test_complete_workflow.py    # Test du workflow complet
├── test_corrections.py          # Tests des corrections appliquées
├── test_drive_thumbnail.py      # Tests des thumbnails Google Drive
├── test_folder_structure.py     # Tests de la structure de dossiers
├── test_frameio_*.py           # Tests spécifiques Frame.io
├── test_lucidlink_structure.py # Tests de la structure LucidLink
├── test_main_*.py              # Tests du module principal
├── test_pipeline_*.py          # Tests du pipeline
├── test_thumbnail*.py          # Tests de génération de thumbnails
├── test_tracking.py            # Tests du système de tracking
└── test_upload_*.py            # Tests des uploads
```

## 🚀 **Exécution des Tests**

### **Tous les tests**
```bash
pytest tests/
```

### **Tests avec verbose**
```bash
pytest -v tests/
```

### **Tests avec couverture**
```bash
pytest --cov=src tests/
```

### **Test spécifique**
```bash
pytest tests/test_complete_workflow.py
```

### **Tests par catégorie**
```bash
# Tests Frame.io
pytest tests/test_frameio_*.py

# Tests thumbnails
pytest tests/test_thumbnail*.py

# Tests pipeline
pytest tests/test_pipeline_*.py
```

## 🔧 **Configuration**

Les tests utilisent le fichier `pytest.ini` à la racine du projet pour la configuration.

### **Variables d'environnement pour les tests**
```env
# Fichier .env.test (optionnel)
FRAMEIO_CLIENT_ID=test_client_id
GOOGLE_CREDENTIALS_PATH=config/test_credentials.json
DISCORD_WEBHOOK_URL=test_webhook_url
```

## ⚠️ **Notes Importantes**

- **Tests d'intégration** : Certains tests nécessitent des credentials valides
- **Fichiers temporaires** : Les tests créent des fichiers temporaires dans `temp/`
- **Nettoyage automatique** : Les tests nettoient automatiquement après exécution
- **Mocking** : Les API externes sont mockées pour éviter les appels réels

## 📊 **Coverage**

Pour générer un rapport de couverture détaillé :

```bash
pytest --cov=src --cov-report=html tests/
open htmlcov/index.html
```

## 🐛 **Debugging**

Pour déboguer un test spécifique :

```bash
pytest -s -vv tests/test_specific.py::test_function
```
