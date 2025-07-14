# Tests Google API Integration

Ce dossier contient les tests pour l'intégration des APIs Google dans PostFlow.

## 🧪 Tests disponibles

### `test_google_connections.py`
- **Description**: Test de base des connexions Google API
- **Usage**: Vérification de l'initialisation du gestionnaire de connexions
- **Prérequis**: `config/google_credentials.json` et `config/integrations.json`

### `test_performance_comparison.py`
- **Description**: Comparaison de performance entre ancienne et nouvelle méthode
- **Résultats**: 57.2% d'amélioration avec les connexions persistantes
- **Métriques**: Temps de connexion, nombre d'opérations par seconde

### `test_full_integration.py`
- **Description**: Test d'intégration complète du système optimisé
- **Fonctionnalités**: GoogleConnectionManager, OptimizedSheetsStatusAdapter, pipeline simulation
- **Validation**: Test end-to-end du nouveau système

## 🚀 Utilisation

```bash
# Test de base
python scripts/tests/google/test_google_connections.py

# Test de performance
python scripts/tests/google/test_performance_comparison.py

# Test d'intégration complète
python scripts/tests/google/test_full_integration.py
```

## 📊 Métriques de performance

- **Ancien système**: 6.13s pour 5 connexions
- **Nouveau système**: 2.63s pour 5 connexions
- **Amélioration**: 57.2% plus rapide
- **Connexions en cache**: 4 services persistants

## ⚙️ Configuration requise

- Python 3.11+
- google-api-python-client>=2.70.0
- gspread>=5.7.0
- Configuration Google API valide

## 🔧 Architecture testée

```
GoogleConnectionManager (singleton)
├── Connexions persistantes
├── Cache automatique
├── Refresh des credentials
└── Gestion d'erreurs robuste

OptimizedSheetsStatusAdapter
├── Batch updates
├── Réutilisation connexions
└── Performance optimisée
```
