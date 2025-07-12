# 🎬 RL PostFlow

[![Python](https://img.shields.io/badge/Python## ⚡ **Installation Rapide**

### **Installation Automatique (Recommandée)**

```bash
# Cloner le repository
git clone https://github.com/your-org/rl-postflow.git
cd rl-postflow

# Installer les dépendances
pip install -r requirements.txt

# Lancer l'installation interactive (détecte automatiquement Windows/macOS/Linux)
python setup_postflow.py
```

### **Installation Manuelle**

```bash
# Cloner le repository
git clone https://github.com/your-org/rl-postflow.git
cd rl-postflow

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos configurations

# Lancer le pipeline
python main.py
```

### **🪟 Installation Windows**

PostFlow est maintenant **entièrement compatible Windows** ! 

```cmd
# Installation Windows avec détection automatique des chemins
python setup_postflow.py

# Ou migration depuis macOS
python migrate_to_windows.py
```

**Chemin LucidLink Windows :** `E:\Volumes\resizelab\o2b-undllm`

📖 **[Guide Windows complet →](docs/WINDOWS_GUIDE.md)**(https://python.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-pytest-orange.svg)](tests/)
[![Version](https://img.shields.io/badge/Version-4.1.1-red.svg)](https://github.com/resizelab/rl_postflow/releases)

> **Pipeline de post-production automatisé pour documentaire animé**  
> Traitement et suivi de 516 plans sur 28 séquences avec intégrations professionnelles

## 🚀 **Fonctionnalités**

- **🔍 Surveillance en temps réel** : Détection automatique des nouveaux exports via LucidLink
- **📁 Validation stricte** : Nomenclature `SQ##_UNDLM_#####_v###` et structure de dossiers
- **🎬 Upload Frame.io** : Upload automatique avec gestion de structure et liens de review
- **🖼️ Thumbnails intelligents** : Génération et upload sur Google Drive
- **📊 Google Sheets** : Mise à jour automatique avec formules `=IMAGE()` et `=LIEN_HYPERTEXTE()`
- **📢 Notifications Discord** : Alertes avec preview et mentions automatiques des utilisateurs
- **🤖 Templates intelligents** : Notifications Discord avec templates et intégration Google Sheets
- **👥 Gestion utilisateurs** : Récupération automatique des ID Discord depuis Google Sheets
- **🎛️ Dashboard web** : Interface de monitoring en temps réel
- **🔄 Queue intelligente** : Gestion des uploads multiples avec retry
- **🔐 OAuth sécurisé** : Authentification Frame.io Web App autonome
- **🎬 Générateur After Effects** : Automatisation complète de 28 séquences (516 plans)
- **🪟 Compatible Windows** : Support natif Windows/macOS/Linux avec conversion automatique des chemins

## 📋 **Prérequis**

- **Python 3.8+**
- **FFmpeg** (pour génération thumbnails)
- **LucidLink** configuré et monté
- **Comptes configurés** :
  - Frame.io (avec OAuth Web App)
  - Google Drive API
  - Google Sheets API
  - Discord Webhook

### **🖥️ Plateformes Supportées**

| Plateforme | Statut | Chemin LucidLink | Installation |
|------------|--------|------------------|--------------|
| **🪟 Windows** | ✅ Compatible | `E:\Volumes\resizelab\o2b-undllm` | `python setup_postflow.py` |
| **🍎 macOS** | ✅ Compatible | `/Volumes/resizelab/o2b-undllm` | `python setup_postflow.py` |
| **🐧 Linux** | ✅ Compatible | `/mnt/lucidlink/resizelab/o2b-undllm` | `python setup_postflow.py` |

**Conversion automatique des chemins** : PostFlow détecte automatiquement votre plateforme et adapte tous les chemins en conséquence.

### **🖥️ Compatibilité Multi-Plateforme**

PostFlow supporte nativement :
- **Windows** (E:\Volumes\resizelab\o2b-undllm)
- **macOS** (/Volumes/resizelab/o2b-undllm) 
- **Linux** (/mnt/lucidlink/resizelab/o2b-undllm)

La détection de plateforme et conversion des chemins sont automatiques.

## ⚡ **Installation Rapide**

### **🚀 Installation Automatique (Recommandé)**

```bash
# Cloner le repository
git clone https://github.com/your-org/rl-postflow.git
cd rl-postflow

# Installer les dépendances
pip install -r requirements.txt

# Lancer l'installation interactive
python setup_postflow.py

# Suivre le guide d'installation
# (détection automatique Windows/macOS/Linux)
```

### **⚙️ Installation Manuelle**

```bash
# Cloner le repository
git clone https://github.com/your-org/rl-postflow.git
cd rl-postflow

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos configurations

# Lancer le pipeline
python main.py
```

### **🔄 Migration Windows**

Si vous migrez depuis macOS vers Windows :

```bash
# Script de migration automatique
python migrate_to_windows.py

# Test de compatibilité
python test_cross_platform.py
```

## 🗂️ **Structure du Projet**

```
rl-postflow/
├── src/                    # Code source principal
│   ├── core/              # Composants centraux (watcher, pipeline)
│   ├── integrations/      # Intégrations (Frame.io, Google, Discord)
│   ├── utils/             # Utilitaires (thumbnails, upload, tracking)
│   └── bootstrap/         # Initialisation et configuration
├── config/                # Fichiers de configuration
├── data/                  # Données et tracking
├── docs/                  # Documentation détaillée
├── tests/                 # Tests automatisés
└── scripts/               # Scripts utilitaires
```

## 🎯 **Usage**

### **Démarrage du Pipeline**
```bash
python main.py
```

### **Arrêt du Pipeline**
```bash
python stop_postflow.py
```

### **Dashboard Web**
Le dashboard web est automatiquement démarré avec le pipeline principal.
Accédez au dashboard sur `http://localhost:8080` pour :
- Monitoring en temps réel du pipeline
- Statut des uploads et de la queue
- Gestion des erreurs et alertes
- Métriques de performance et statistiques
- Interface WebSocket pour les mises à jour temps réel

```bash
# Dashboard autonome (si nécessaire)
python dashboard.py
```

### **Générateur After Effects v2**

Le générateur AE v2 automatise la création de projets After Effects pour toutes les 28 séquences du projet :

#### **Génération avec nouvel outil (tools/)**
```bash
# Aller dans le dossier tools
cd tools/after_effects_generator_v2

# Générer une séquence spécifique
python generate_ae_projects_v2.py --sequence SQ02

# Validation (3 premières séquences)
python generate_ae_projects_v2.py --validation

# Production complète (28 séquences)
python generate_ae_projects_v2.py --all
```

#### **Génération avec scripts legacy**
```bash
# Générer le mapping complet des 28 séquences
python scripts/analyze_gsheets_data.py

# Créer les projets AE avec sources Edit uniquement
python scripts/generate_ae_projects_v2.py --all

# Ou générer des séquences spécifiques
python scripts/generate_ae_projects_v2.py --sequence SQ01
python scripts/generate_ae_projects_v2.py --sequences SQ01 SQ05 SQ11
```

#### **Import sources étalonnées (workflow incrémental)**
```bash
# Scanner les sources étalonnées disponibles
python scripts/import_graded_sources_v2.py --scan

# Importer pour une séquence spécifique
python scripts/import_graded_sources_v2.py --sequence SQ01

# Import pour plusieurs séquences
python scripts/import_graded_sources_v2.py --sequences SQ01 SQ05 SQ11

# Import massif (toutes séquences)
python scripts/import_graded_sources_v2.py --all

# Mode test/simulation
python scripts/import_graded_sources_v2.py --sequence SQ01 --dry-run
```

> **Workflow recommandé :** Générer d'abord tous les projets avec les sources Edit, puis utiliser l'import incrémental au fur et à mesure que les sources étalonnées deviennent disponibles.

**Documentation :**
- 📖 [Guide complet générateur AE](docs/AFTER_EFFECTS_GENERATOR.md)
- 🎨 [Guide import sources étalonnées](docs/IMPORT_GRADED_SOURCES.md)

## 📐 **Nomenclature Supportée**

Le pipeline accepte uniquement les fichiers avec la nomenclature stricte :

```
SQ##_UNDLM_#####_v###.(mov|mp4|avi|mxf)
```

**Structure de dossier requise :**
```
.../SQxx/UNDLM_xxxxx/SQxx_UNDLM_xxxxx_vyyy.mov
```

**Exemples valides :**
- `SQ01/UNDLM_00003/SQ01_UNDLM_00003_v001.mov` ✅
- `SQ02/UNDLM_00015/SQ02_UNDLM_00015_v003.mp4` ✅

**Exemples rejetés :**
- `SQ01/SQ01_UNDLM_00003_v001.mov` ❌ (mauvais dossier)
- `SC01_UNDLM_00001_v001.mov` ❌ (mauvaise nomenclature)

## 🔧 **Configuration**

### **Variables d'environnement (.env)**
```env
# Frame.io OAuth
FRAMEIO_CLIENT_ID=your_client_id
FRAMEIO_CLIENT_SECRET=your_client_secret

# Google APIs
GOOGLE_CREDENTIALS_PATH=config/google_credentials.json

# Discord
DISCORD_WEBHOOK_URL=your_webhook_url

# LucidLink
LUCIDLINK_MOUNT_PATH=/Volumes/your-mount
```

### **Configuration des intégrations**
```json
// config/integrations.json
{
  "google_drive": {
    "enabled": true,
    "folder_structure": "PostFlow_Thumbnails/PostFlow_Project/{year}-{month:02d}"
  },
  "discord": {
    "enabled": true,
    "embed_thumbnails": true
  }
}
```

## �️ **Tools**

Le dossier `tools/` contient des outils spécialisés pour le pipeline :

### **After Effects Generator v2**
```bash
cd tools/after_effects_generator_v2
python generate_ae_projects_v2.py --sequence SQ02
```
- ✅ **28 séquences** (520 plans) - Structure EB complète
- ✅ **Nouvelle organisation 2024** - HAIR/SKIN/_Others
- ✅ **Sources UHD optimisées** - 3840x2160 → 2560x1440
- **[📚 Documentation complète →](tools/after_effects_generator_v2/README.md)**

### **Organisation Tools**
```
tools/
├── after_effects_generator_v2/    # Générateur AE v2 production
└── README.md                      # Index des outils
```

**[🛠️ Voir tous les outils →](tools/README.md)**

## �📊 **Monitoring et Logs**

- **Dashboard web** : `http://localhost:8080`
- **Logs détaillés** : `logs/postflow_YYYYMMDD.log`
- **Tracking uploads** : `data/uploads_tracking.json`

## 🧪 **Tests**

```bash
# Test de compatibilité multi-plateforme
python test_cross_platform.py

# Lancer tous les tests
pytest tests/

# Test spécifique
pytest tests/test_watcher.py

# Test avec couverture
pytest --cov=src tests/
```

### **🔧 Tests Spécifiques Windows**

```cmd
# Tester la compatibilité Windows
python test_cross_platform.py

# Tester la migration macOS → Windows
python migrate_to_windows.py --test

# Vérifier les composants
python main.py --test
```

## 📚 **Documentation**

- **[Guide de Démarrage Rapide](docs/guides/QUICK_START.md)** - Installation et première utilisation
- **[Générateur After Effects](docs/AFTER_EFFECTS_GENERATOR.md)** - Automatisation complète AE (28 séquences)
- **[Configuration Frame.io OAuth](docs/integrations/FRAMEIO_OAUTH.md)** - Setup authentification
- **[Architecture](docs/ARCHITECTURE.md)** - Vue d'ensemble technique
- **[Changelog](CHANGELOG.md)** - Historique des versions

## 🤝 **Contributing**

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 **License**

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 **Support**

- **Issues** : [GitHub Issues](https://github.com/your-org/rl-postflow/issues)
- **Documentation** : [docs/](docs/)
- **Email** : support@yourorg.com

---

**RL PostFlow v4.1.1** - Pipeline de post-production intelligent et fiable
