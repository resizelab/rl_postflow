# 🎬 RL PostFlow

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-pytest-orange.svg)](tests/)
[![Version](https://img.shields.io/badge/Version-4.1.9-red.svg)](https://github.com/resizelab/rl_postflow/releases)
[![Windows](https://img.shields.io/badge/Windows-Compatible-brightgreen.svg)](docs/WINDOWS_GUIDE.md)
[![Multi-Platform](https://img.shields.io/badge/Multi--Platform-macOS%20%7C%20Windows%20%7C%20Linux-blue.svg)](docs/DEPLOYMENT_STRATEGY.md)

> **Pipeline de post-production automatisé pour documentaire animé**  
> Traitement et suivi de 516 plans sur 25 scènes avec intégrations professionnelles

## 🚀 Fonctionnalités Principales

### 📊 **Pipeline de Production**
- **12 statuts de plan** : De `pending` à `final_delivery`
- **5 stages de production** : Source → EbSynth → Review → Delivery (optimisé)
- **Tracking temps réel** : Progression automatique et gestion d'erreurs
- **Processing par scène** : Traitement batch intelligent avec priorité

### 🔗 **Intégrations**
- **Discord** : Notifications automatiques avec mentions utilisateurs et timestamps Paris
- **Frame.io** : Upload et review automatisés avec intégration seamless
- **Google Sheets** : Synchronisation bidirectionnelle et gestion utilisateurs
- **LucidLink** : Vérification des fichiers sources et monitoring
- **Template Factory** : Système centralisé de templates Discord optimisé

### 🎯 **Monitoring**
- **Dashboard web** : Interface de monitoring en temps réel
- **Gestion d'erreurs** : Système de retry et alertes
- **Métriques** : Suivi des performances et statistiques

## 🆕 Nouveautés v4.1.9 - **CORRECTIONS CRITIQUES & OPTIMISATIONS**

### 🔧 **Corrections Majeures**
- ✅ **Google Sheets Tracker** : Fix complet des bugs de compatibilité GoogleConnectionManager
- ✅ **Optimized Sheets Adapter** : Correction du mapping des colonnes de recherche  
- ✅ **Processing illimité** : Suppression de toutes les limitations (3 → 999 fichiers)
- ✅ **Double synchronisation** : Élimination des appels sync en double au démarrage

### 🎨 **Améliorations UX**
- 🖼️ **Discord Thumbnails** : Intégration directe des images dans les embeds (fini les liens)
- 🚀 **Architecture Hostinger** : Upload optimisé FTP pour thumbnails haute performance
- 👥 **User Notifier** : Notifications Discord enrichies avec mentions utilisateurs
- ⚡ **Sync Checker** : Détection intelligente nom + taille + date (±2s tolerance)

### 🛠️ **Corrections Techniques**
- 🔄 **Upload Tracker** : Enregistrement file_mtime pour détection précise des changements
- 🔍 **File Matching** : Critères multiples pour éviter les re-uploads inutiles
- 🚫 **Anti-boucles** : Prévention des traitements en boucle infinie
- 📊 **Queue Processing** : Traitement séquentiel optimal (max_concurrent=1)

## 🆕 Nouveautés v4.1.5 - **SYNC CHECKER & DISCORD THUMBNAILS**

### 🔍 **Système de Synchronisation Avancé**
- ✅ **Sync Checker intelligent** : Détection automatique des fichiers manqués au démarrage
- ✅ **Correspondance stricte** : Validation par nom + taille + date de modification
- ✅ **Récupération automatique** : Traitement des fichiers non-synchronisés
- ✅ **Prévention des boucles** : Système anti-doublon avec critères multiples

### 🖼️ **Amélioration Discord**
- 🔄 **Thumbnails intégrés** : Affichage direct des images dans les embeds Discord
- 🎨 **Notifications visuelles** : Templates enrichis avec preview automatique
- 🚀 **Architecture Hostinger** : Upload optimisé des thumbnails via FTP
- ✅ **User Notifier amélioré** : Intégration Google Sheets pour mentions utilisateurs

### 🛠️ **Corrections Techniques**
- 🔧 **Google Sheets Tracker** : Correction des bugs de compatibilité API
- 📊 **Optimized Sheets Adapter** : Fix du mapping des colonnes de recherche
- 🔄 **Upload Tracker** : Enregistrement de file_mtime pour détection précise
- ⚡ **Suppression limites** : Processing illimité (999 fichiers max)

## 🆕 Nouveautés v4.1.4 - **COMPATIBILITÉ WINDOWS COMPLÈTE**

### 🔧 **Support Multi-Plateforme**
- ✅ **Windows 10/11 natif** : Support complet avec détection automatique OS
- ✅ **CrossPlatformPathManager** : Conversion automatique `/Volumes/` ↔ `E:\Volumes\`
- ✅ **Déploiement automatisé** : Scripts macOS → Windows avec `deploy.py`
- ✅ **Migration transparente** : Outils automatiques pour transition Windows

### 🚀 **Déploiement Production**
- 🔄 **Dev macOS → Prod Windows** : Workflow optimisé avec même repository
- 📦 **Scripts automatisés** : `deploy.py`, `deploy_windows.bat`, validation pré-déploiement
- 🛡️ **Backup/Rollback** : Sécurité complète avec récupération automatique
- ✅ **Tests 100% validés** : Suite cross-platform complète

### 🗂️ **Structure Professionnelle**
- 📁 **Repository organisé** : `tools/`, `scripts/`, `docs/` clairement séparés
- 📚 **Documentation complète** : Guides Windows, stratégie déploiement
- 🧪 **Validation rigoureuse** : Zero chemins hardcodés, tests automatisés

## 📂 Structure du Projet

```
rl_postflow/
├── 🚀 main.py                  # Point d'entrée principal
├── 📊 dashboard.py             # Dashboard web de monitoring
├── 📦 src/                     # Code source modulaire
│   ├── utils/                  # Utilitaires (ErrorHandler, FileWatcher)
│   ├── integrations/           # Intégrations externes
│   ├── workflows/              # Workflows de production
│   └── models/                 # Modèles de données
├── 🧪 tests/                   # Tests organisés
│   ├── unit/                   # Tests unitaires
│   ├── integration/            # Tests d'intégration
│   └── fixtures/               # Données de test
├── 🛠️ scripts/                 # Scripts utilitaires
├── 🎨 examples/                # Exemples et démos
└── 📚 docs/                    # Documentation
```

## ⚡ Installation Rapide

### **Multi-Plateforme (macOS/Windows/Linux)**

```bash
# Cloner le projet
git clone https://github.com/resizelab/rl_postflow.git
cd rl_postflow

# Installation automatique cross-platform
python scripts/setup_postflow.py

# OU installation manuelle
python -m venv .venv
source .venv/bin/activate    # macOS/Linux
# .venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

### **Déploiement Windows (Production)**

```bash
# Migration automatique macOS → Windows
python scripts/deploy.py --target windows

# OU migration manuelle Windows
python tools/migration/migrate_to_windows.py
```

## 🎮 Utilisation

### Pipeline Principal
```bash
python main.py              # Parser CSV + Export
python dashboard.py         # Dashboard web
```

### Exemples
```bash
python examples/pipeline_demo.py     # Démo complète
python examples/export_by_scene.py   # Export par scène
```

### Tests
```bash
python scripts/quick_test.py    # Tests rapides
pytest tests/unit/              # Tests unitaires
pytest tests/ --cov=src         # Tests avec coverage
```

## 🎯 Workflow de Production

```mermaid
graph TD
    A[Source Video] --> B[After Effects]
    B --> C[EbSynth Processing]
    C --> D[Animation Review]
    D --> E[Final Delivery]
    
    F[Discord Notifications] --> B
    F --> C
    F --> D
    F --> E
    
    G[Frame.io Upload] --> D
    H[Google Sheets Update] --> B
    H --> C
    H --> D
    H --> E
```

## 🧪 Tests & Qualité

- **Tests unitaires** : 26 tests couvrant les modules principaux
- **Tests d'intégration** : Validation du workflow complet
- **Coverage** : Couverture de code avec pytest-cov
- **Qualité** : Structure professionnelle et documentation

## 📈 Métriques

| Métrique | Valeur |
|----------|--------|
| **Plans** | 516 |
| **Scènes** | 25 |
| **Statuts** | 12 |
| **Intégrations** | 5 |
| **Tests** | 26+ |

## 🤝 Contribution

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Commit** les changements (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

## 📄 License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🎉 Remerciements

- **Resize Lab** pour le développement
- **Communauté Python** pour les outils
- **Équipe de production** pour les retours

---

<div align="center">
  <b>🎬 Fait avec ❤️ par Resize Lab</b>
</div>
