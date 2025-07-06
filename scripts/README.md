# Scripts PostFlow

Ce dossier contient les scripts utilitaires pour PostFlow.

## 🎬 Frame.io Integration
- `configure_frameio.py` - Configuration Frame.io générale
- `configure_frameio_project.py` - Configuration et sélection du projet Frame.io
- `setup_frameio.py` - Configuration Developer Token

## 🔧 Scripts de configuration
- `configure_error_handling.py` - Configuration interactive du gestionnaire d'erreurs
- `configure_integrations.py` - Configuration des intégrations (Discord, LucidLink)
- `setup_integrations.py` - Installation des intégrations
- `setup_review_workflow.py` - Configuration du workflow de review
- `install_dependencies.py` - Installation automatique des dépendances

## 📊 Scripts de monitoring
- `daily_report.py` - Génération de rapports quotidiens
- `lucidlink_watcher.py` - Surveillance temps réel des exports LucidLink

## 🎮 Scripts de démonstration
- `demos/demo_review_workflow.py` - Démonstration du workflow de review
- `demos/quick_test.py` - Tests rapides

## 🧪 Scripts de test
Tous les scripts de test sont maintenant dans le dossier `tests/` :
- `tests/integration/` - Tests d'intégration
- `tests/unit/` - Tests unitaires

## 📁 Structure organisée
```
scripts/
├── configure_*.py      # Configuration des composants
├── setup_*.py         # Installation et configuration initiale
├── daily_report.py    # Monitoring et rapports
├── lucidlink_watcher.py # Surveillance
└── demos/            # Démonstrations
```Ce dossier contient les scripts utilitaires pour PostFlow.

## 🎬 Frame.io Integration (Nouveau)
- `configure_frameio.py` - 🎯 Assistant principal Frame.io
- `setup_frameio.py` - � Configuration Developer Token (solution immédiate)
- `setup_adobe_oauth.py` - 🔬 Configuration OAuth Adobe IMS (solution avancée)
- `validate_frameio.py` - 🧪 Validation des configurations Frame.io

## �🔧 Scripts de configuration
- `configure_error_handling.py` - Configuration interactive du gestionnaire d'erreurs
- `configure_integrations.py` - Configuration des intégrations (Google Sheets, Discord)
- `install_dependencies.py` - Installation automatique des dépendances

## 🏗️ Scripts de structure
- `create_folder_structure.py` - Création de la structure de dossiers LucidLink
- `cleanup_old_structure.py` - Nettoyage de l'ancienne structure

## 🧪 Scripts de test
- `quick_test.py` - Tests rapides de validation
- `cleanup_tests.py` - Nettoyage et organisation des tests

## 📝 Utilisation

### 🚀 Démarrage rapide Frame.io
```bash
# Configuration Frame.io (assistant interactif)
python scripts/configure_frameio.py

# Validation de la configuration
python scripts/validate_frameio.py
```

### ⚙️ Configuration complète
```bash
# Configuration complète des intégrations
python scripts/configure_integrations.py
python scripts/configure_error_handling.py

# Structure de dossiers
python scripts/create_folder_structure.py

# Tests rapides
python scripts/quick_test.py
```
