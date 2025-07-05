# 🤝 Guide de Contribution - RL PostFlow

Merci de votre intérêt pour contribuer à **RL PostFlow** ! Ce guide vous aidera à comprendre comment contribuer efficacement au projet.

## 📋 Table des Matières

- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [🔧 Configuration de l'Environnement](#-configuration-de-lenvironnement)
- [📝 Types de Contributions](#-types-de-contributions)
- [🌟 Processus de Contribution](#-processus-de-contribution)
- [🧪 Tests](#-tests)
- [📖 Documentation](#-documentation)
- [🎯 Standards de Code](#-standards-de-code)
- [🐛 Rapport de Bugs](#-rapport-de-bugs)
- [✨ Demandes de Fonctionnalités](#-demandes-de-fonctionnalités)

## 🚀 Démarrage Rapide

1. **Fork** le repository
2. **Clone** votre fork
3. **Créer** une branche pour votre contribution
4. **Développer** et **tester** vos changements
5. **Soumettre** une Pull Request

## 🔧 Configuration de l'Environnement

### Prérequis
- Python 3.11+
- Git
- Un éditeur de code (VS Code recommandé)

### Installation
```bash
# Cloner votre fork
git clone https://github.com/VOTRE-USERNAME/rl_postflow.git
cd rl_postflow

# Créer l'environnement virtuel
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
# ou .venv\Scripts\activate  # Windows

# Installer les dépendances
python scripts/install_dependencies.py

# Installer les dépendances de développement
pip install -r tests/requirements-test.txt
```

### Validation de l'Installation
```bash
# Tests rapides
python scripts/quick_test.py

# Tests complets
pytest tests/ -v
```

## 📝 Types de Contributions

### 🐛 **Corrections de Bugs**
- Correction d'erreurs dans le code
- Amélioration de la gestion d'erreurs
- Optimisation des performances

### ✨ **Nouvelles Fonctionnalités**
- Nouvelles intégrations
- Amélioration du dashboard
- Nouvelles options de configuration

### 📖 **Documentation**
- Amélioration des README
- Ajout d'exemples
- Correction de typos

### 🧪 **Tests**
- Ajout de tests unitaires
- Amélioration de la couverture
- Tests d'intégration

## 🌟 Processus de Contribution

### 1. **Préparation**
```bash
# Créer une nouvelle branche
git checkout -b feature/ma-nouvelle-fonctionnalite

# Ou pour un bugfix
git checkout -b fix/correction-bug-xyz
```

### 2. **Développement**
- Écrire du code propre et documenté
- Suivre les conventions de nommage
- Ajouter des tests pour le nouveau code

### 3. **Tests**
```bash
# Tests unitaires
pytest tests/unit/ -v

# Tests d'intégration
pytest tests/integration/ -v

# Tests avec coverage
pytest tests/ --cov=src --cov-report=html
```

### 4. **Commit**
```bash
# Commits descriptifs
git add .
git commit -m "✨ Ajout de la fonctionnalité X

- Implémentation de Y
- Tests pour Z
- Documentation mise à jour"
```

### 5. **Pull Request**
- Créer une PR vers la branche `main`
- Décrire clairement les changements
- Lier les issues concernées

## 🧪 Tests

### Structure des Tests
```
tests/
├── unit/          # Tests unitaires
├── integration/   # Tests d'intégration
├── fixtures/      # Données de test
└── conftest.py    # Configuration pytest
```

### Écriture des Tests
```python
# tests/unit/test_mon_module.py
import pytest
from src.mon_module import MaClasse

class TestMaClasse:
    def test_ma_fonction(self):
        """Test de ma fonction."""
        instance = MaClasse()
        result = instance.ma_fonction("test")
        assert result == "expected_result"
```

### Exécution des Tests
```bash
# Tests rapides
python scripts/quick_test.py

# Tests par module
pytest tests/unit/test_mon_module.py -v

# Tests avec coverage
pytest tests/ --cov=src --cov-report=html
```

## 📖 Documentation

### Standards de Documentation
- **Docstrings** pour toutes les fonctions publiques
- **README** à jour dans chaque module
- **Commentaires** pour la logique complexe

### Exemple de Docstring
```python
def ma_fonction(param1: str, param2: int) -> bool:
    """
    Description courte de la fonction.
    
    Args:
        param1: Description du paramètre 1
        param2: Description du paramètre 2
    
    Returns:
        Description du retour
    
    Raises:
        ValueError: Si param1 est vide
    """
    pass
```

## 🎯 Standards de Code

### Style de Code
- **PEP 8** pour le style Python
- **Black** pour le formatage automatique
- **isort** pour l'organisation des imports

### Vérification du Code
```bash
# Formatage avec black
black src/ tests/

# Organisation des imports
isort src/ tests/

# Vérification avec flake8
flake8 src/ tests/
```

### Conventions de Nommage
- **snake_case** pour les variables et fonctions
- **PascalCase** pour les classes
- **UPPER_CASE** pour les constantes

## 🐛 Rapport de Bugs

### Avant de Rapporter
1. **Vérifier** les issues existantes
2. **Reproduire** le bug
3. **Tester** avec la dernière version

### Informations à Inclure
- **Description** claire du problème
- **Étapes** pour reproduire
- **Comportement** attendu vs actuel
- **Environnement** (OS, Python, version)
- **Logs** d'erreur

### Template
Utiliser le template `.github/ISSUE_TEMPLATE/bug_report.md`

## ✨ Demandes de Fonctionnalités

### Processus
1. **Vérifier** les issues existantes
2. **Décrire** clairement la fonctionnalité
3. **Expliquer** la motivation
4. **Proposer** une solution

### Template
Utiliser le template `.github/ISSUE_TEMPLATE/feature_request.md`

## 🔍 Révision de Code

### Critères de Révision
- **Fonctionnalité** : Le code fait-il ce qu'il doit faire ?
- **Tests** : Y a-t-il des tests appropriés ?
- **Documentation** : Le code est-il bien documenté ?
- **Style** : Le code respecte-t-il les conventions ?

### Processus
1. **Révision automatique** par CI/CD
2. **Révision manuelle** par les mainteneurs
3. **Feedback** et corrections si nécessaire
4. **Merge** après approbation

## 📞 Communication

### Channels
- **GitHub Issues** : Bugs et fonctionnalités
- **GitHub Discussions** : Questions générales
- **Pull Requests** : Révisions de code

### Étiquette
- Être **respectueux** et **constructif**
- **Expliquer** clairement les problèmes
- **Aider** les autres contributeurs

## 🎉 Reconnaissance

Tous les contributeurs sont reconnus dans :
- **README.md** principal
- **Release notes**
- **Hall of Fame** des contributeurs

## 📋 Checklist de Contribution

- [ ] J'ai lu ce guide de contribution
- [ ] J'ai configuré mon environnement de développement
- [ ] J'ai écrit des tests pour mon code
- [ ] J'ai mis à jour la documentation
- [ ] J'ai vérifié le style de code
- [ ] J'ai testé mes changements
- [ ] J'ai créé une Pull Request descriptive

---

**Merci de contribuer à RL PostFlow ! 🎬**

Pour toute question, n'hésitez pas à ouvrir une issue ou une discussion.
