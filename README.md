# 🎬 RL PostFlow

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-pytest-orange.svg)](tests/)
[![Version](https://img.shields.io/badge/Version-4.1.1-red.svg)](https://github.com/resizelab/rl_postflow/releases)

> **Pipeline de post-production automatisé pour documentaire animé**  
> Traitement et suivi de 516 plans sur 25 scènes avec intégrations professionnelles

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

## 📋 **Prérequis**

- **Python 3.8+**
- **FFmpeg** (pour génération thumbnails)
- **LucidLink** configuré et monté
- **Comptes configurés** :
  - Frame.io (avec OAuth Web App)
  - Google Drive API
  - Google Sheets API
  - Discord Webhook

## ⚡ **Installation Rapide**

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

## 📊 **Monitoring et Logs**

- **Dashboard web** : `http://localhost:8080`
- **Logs détaillés** : `logs/postflow_YYYYMMDD.log`
- **Tracking uploads** : `data/uploads_tracking.json`

## 🧪 **Tests**

```bash
# Lancer tous les tests
pytest tests/

# Test spécifique
pytest tests/test_watcher.py

# Test avec couverture
pytest --cov=src tests/
```

## 📚 **Documentation**

- **[Guide de Démarrage Rapide](docs/guides/QUICK_START.md)** - Installation et première utilisation
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
