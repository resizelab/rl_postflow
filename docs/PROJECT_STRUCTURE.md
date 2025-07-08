# 📁 Structure du Projet PostFlow

## 🎯 Vue d'ensemble

Le projet PostFlow a été complètement réorganisé pour suivre les meilleures pratiques Python et faciliter la maintenance, l'extension et la collaboration.

## 📂 Structure Principale

```
rl_postflow/
├── main.py                  # Point d'entrée principal
├── dashboard.py             # Dashboard web de monitoring
├── requirements.txt         # Dépendances Python
├── pytest.ini             # Configuration des tests
├── pipeline_config.json    # Configuration du pipeline
├── README.md               # Documentation principale
├── TESTS_MIGRATION.md      # Guide de migration des tests
├── PROJECT_STRUCTURE.md    # Ce fichier
├── src/                    # Code source
├── tests/                  # Tests organisés
├── scripts/                # Scripts utilitaires
├── examples/               # Exemples et démos
├── docs/                   # Documentation
└── data/                   # Données et configuration
```

## 🔧 Code Source (`src/`)

```
src/
├── __init__.py
├── exporters/              # Générateurs de sortie
│   ├── __init__.py
│   └── output_generator.py
├── integrations/           # Intégrations externes
│   ├── __init__.py
│   ├── after_effects.py
│   ├── discord.py
│   ├── frameio.py
│   ├── google_sheets.py
│   └── lucidlink.py
├── models/                 # Modèles de données
│   ├── __init__.py
│   └── data_models.py
├── parsers/                # Parseurs de données
│   ├── __init__.py
│   └── csv_parser.py
├── utils/                  # Utilitaires
│   ├── __init__.py
│   ├── error_handler.py
│   ├── file_watcher.py
│   ├── review_monitor.py
│   └── status_tracker.py
└── workflows/              # Workflows principaux
    ├── __init__.py
    ├── pipeline_manager.py
    └── scene_processor.py
```

## 🧪 Tests (`tests/`)

**Structure modulaire et professionnelle :**

```
tests/
├── __init__.py
├── conftest.py             # Configuration pytest & fixtures
├── requirements-test.txt   # Dépendances de test
├── README.md              # Documentation des tests
├── setup_validation.py    # Validation de l'environnement
├── unit/                  # Tests unitaires
│   ├── __init__.py
│   ├── test_error_handler.py
│   ├── test_file_watcher.py
│   └── test_integrations.py
├── integration/           # Tests d'intégration
│   ├── __init__.py
│   ├── test_server_structure.py
│   └── test_workflow.py
├── fixtures/              # Données de test
│   ├── __init__.py
│   └── test_data.py
└── legacy/                # Anciens tests (référence)
    ├── README.md
    ├── test_debug.py
    ├── test_error_handling.py
    ├── test_integrations_simple.py
    └── test_simple.py
```

## 🛠️ Scripts Utilitaires (`scripts/`)

**Outils de développement et maintenance :**

```
scripts/
├── README.md                    # Documentation des scripts
├── cleanup_old_structure.py    # Nettoyage de l'ancienne structure
├── cleanup_tests.py            # Nettoyage des tests
├── configure_error_handling.py # Configuration gestion d'erreurs
├── configure_integrations.py   # Configuration intégrations
├── create_folder_structure.py  # Création structure projet
├── install_dependencies.py     # Installation dépendances
└── quick_test.py               # Tests rapides
```

## 🎨 Exemples (`examples/`)

**Démonstrations et cas d'usage :**

```
examples/
├── README.md          # Documentation des exemples
├── export_by_scene.py # Export par scène
└── pipeline_demo.py   # Démonstration du pipeline
```

## 📚 Documentation (`docs/`)

```
docs/
├── README.md              # Index de la documentation
├── ERROR_HANDLING.md      # Gestion d'erreurs
├── INTEGRATIONS_SETUP.md  # Configuration intégrations
├── SETUP_SUMMARY.md       # Résumé de configuration
└── arbo_undlm_proposed.txt # Structure proposée
```

## 💾 Données (`data/`)

```
data/
├── README.md              # Documentation des données
├── pipeline_status.json   # Statut du pipeline
├── shots.csv             # Données des plans
└── timeline              # Timeline du projet
```

## 🚀 Commandes Principales

### Tests
```bash
# Tests unitaires
pytest tests/unit/

# Tests d'intégration
pytest tests/integration/

# Tous les tests avec coverage
pytest tests/ --cov=src

# Tests rapides
python scripts/quick_test.py
```

### Développement
```bash
# Lancer le pipeline principal
python main.py

# Lancer le dashboard
python dashboard.py

# Installer les dépendances
python scripts/install_dependencies.py
```

### Exemples
```bash
# Démonstration du pipeline
python examples/pipeline_demo.py

# Export par scène
python examples/export_by_scene.py
```

## 🎯 Avantages de cette Structure

### ✅ **Maintenabilité**
- Code organisé par responsabilité
- Tests modulaires et isolés
- Documentation à jour

### ✅ **Extensibilité**
- Structure claire pour ajouter de nouvelles fonctionnalités
- Séparation des préoccupations
- Patterns établis

### ✅ **Collaboration**
- Structure standardisée
- Documentation complète
- Tests automatisés

### ✅ **Robustesse**
- Tests unitaires et d'intégration
- Gestion d'erreurs centralisée
- Validation continue

## 📋 Statut Actuel

### ✅ **Terminé**
- [x] Réorganisation complète de la structure
- [x] Migration des tests vers une structure modulaire
- [x] Nettoyage de la racine du projet
- [x] Documentation complète
- [x] Scripts utilitaires
- [x] Exemples et démos
- [x] Validation de la structure

### 🔄 **En cours / À venir**
- [ ] Correction des tests unitaires en échec
- [ ] Finalisation des tests d'intégration
- [ ] Tests de performance
- [ ] Intégration CI/CD
- [ ] Amélioration continue

## 🎉 Conclusion

Le projet PostFlow dispose maintenant d'une structure professionnelle, modulaire et robuste qui facilite :
- La maintenance du code
- L'ajout de nouvelles fonctionnalités
- La collaboration en équipe
- La validation continue par les tests

Cette structure respecte les meilleures pratiques Python et garantit la pérennité du projet.
