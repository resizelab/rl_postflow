# 🎬 RL PostFlow - Pipeline d'Intégration LucidLink → Frame.io

[![Version](https://img.shields.io/badge/version-4.2.0-blue.svg)](https://github.com/your-repo/rl_postflow)
[![Python](https://img.shields.io/badge/python-3.8+-green.svg)](https://python.org)
[![Frame.io](https://img.shields.io/badge/Frame.io-v4-orange.svg)](https://frame.io)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Tunnel-blue.svg)](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
[![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen.svg)](https://github.com/your-repo/rl_postflow)

## 📋 Vue d'ensemble

**RL PostFlow** est un pipeline automatisé d'intégration entre **LucidLink** et **Frame.io** pour les workflows de post-production vidéo. Il surveille les fichiers LucidLink, crée automatiquement les structures Frame.io correspondantes, et gère les uploads avec **Cloudflare Tunnel** pour une robustesse maximale.

### 🚀 Fonctionnalités Principales

- **🔄 Surveillance automatique** : Monitoring des fichiers LucidLink en temps réel
- **📁 Création de structure** : Génération automatique des workspaces/projets Frame.io
- **📤 Upload robuste** : Upload via **Cloudflare Tunnel** sans limite de bande passante
- **🔐 Authentification OAuth** : Système OAuth Web App moderne avec Adobe IMS
- **📢 Notifications** : Intégration Discord pour le suivi en temps réel
- **🎛️ Dashboard** : Interface web pour monitoring et contrôle
- **💾 Cache intelligent** : Système de cache avancé avec TTL configurable
- **🚨 Alertes automatiques** : Monitoring et notifications proactives
- **⚡ Optimisation** : Outils d'optimisation de performance intégrés

## 🆕 Nouveautés v4.2.0 - Cloudflare Tunnel Integration

### 🌐 Infrastructure Robuste avec Cloudflare Tunnel

- **✅ Pas de limite de bande passante** (contrairement à ngrok gratuit)
- **✅ Connexion HTTPS stable** et sécurisée 24/7
- **✅ Tunnel robuste** qui reste actif pendant des heures
- **✅ Upload de gros fichiers** (testé avec succès jusqu'à 831MB)
- **✅ Surveillance temps réel** du téléchargement Frame.io

### 📤 Upload Optimisé

- **Détection automatique LucidLink** : Cache forcé avant upload
- **Serveur HTTP avec Range Support** : Streaming optimisé des fichiers
- **Monitoring du téléchargement** : Surveillance Frame.io en temps réel
- **Cleanup automatique** : Arrêt propre des services après upload

### 🛠️ Outils d'Administration Avancés

- **CLI d'administration** (`frameio_admin_cli.py`) : Interface complète en ligne de commande
- **Optimiseur de performance** (`frameio_optimization.py`) : Monitoring et rapports détaillés
- **Système d'alertes** : Notifications proactives sur Discord/Email
- **Cache intelligent** : Gestion automatique avec invalidation et nettoyage

### 📊 Monitoring et Métriques

- **Statistiques en temps réel** : CPU, mémoire, latence API, débit upload
- **Rapports automatiques** : Génération de rapports de performance
- **Tableaux de bord** : Vue d'ensemble des métriques système
- **Historique des alertes** : Suivi des incidents et résolutions

### 🔧 Gestion d'Erreurs Améliorée

- **Retry intelligent** : Back-off exponentiel et circuit breaker
- **Invalidation de cache** : Nettoyage automatique sur erreur
- **Rate limiting** : Respect automatique des limites API
- **Logging structuré** : Logs détaillés pour le débogage

## 🛠️ Outils d'Administration

### CLI d'Administration

Interface complète en ligne de commande pour gérer le système Frame.io :

```bash
# Vérification complète de santé
python scripts/frameio_admin_cli.py health

# Gestion du cache
python scripts/frameio_admin_cli.py cache stats
python scripts/frameio_admin_cli.py cache clear
python scripts/frameio_admin_cli.py cache clear --pattern folder_

# Validation de configuration
python scripts/frameio_admin_cli.py validate

# Test d'upload
python scripts/frameio_admin_cli.py test-upload test.mp4 "SC01" "S01"

# Test de nomenclature
python scripts/frameio_admin_cli.py nomenclature "UNDLM_SEQ01_00042_v002.mp4"
```

### Optimiseur de Performance

Monitoring et optimisation automatique des performances :

```bash
# Lancer l'optimisation complète
python scripts/frameio_optimization.py

# Le rapport est sauvegardé dans logs/frameio_optimization_report_YYYYMMDD_HHMMSS.txt
```

**Métriques surveillées :**
- Durée et taux de succès des appels API
- Vitesse et performance des uploads
- Taux de cache hit/miss
- Utilisation CPU et mémoire
- Fréquence et types d'erreurs

### Système d'Alertes

Configuration des alertes automatiques via `config/alerts.json` :

```json
{
  "enabled": true,
  "channels": {
    "discord": {
      "enabled": true,
      "webhook_url": "https://discord.com/api/webhooks/..."
    }
  },
  "rules": {
    "high_error_rate": {
      "enabled": true,
      "threshold": 0.05,
      "cooldown_minutes": 30
    }
  }
}
```

**Types d'alertes :**
- 🔴 Taux d'erreur élevé (> 5%)
- ⚠️ Latence API élevée (> 5s)
- 💾 Cache hit rate faible (< 70%)
- 🖥️ Utilisation mémoire élevée (> 500MB)
- 📤 Échecs d'upload fréquents (> 10%)

### Cache Intelligent

Système de cache avec TTL configurable et nettoyage automatique :

```bash
# Statistiques du cache
python scripts/frameio_admin_cli.py cache stats

# Nettoyage sélectif
python scripts/frameio_admin_cli.py cache clear --pattern projects_

# Configuration dans config/optimization.json
{
  "cache_ttl": {
    "projects": 1800,    # 30 minutes
    "folders": 900,      # 15 minutes
    "structure": 3600    # 1 heure
  }
}
```

### Validation et Diagnostic

Script de validation complète du système :

```bash
# Validation de toutes les améliorations
python scripts/validate_improvements.py

# Génère un rapport détaillé dans logs/validation_report_YYYYMMDD_HHMMSS.json
```

## 📊 Monitoring et Métriques

### Dashboard de Performance

Surveillance en temps réel avec métriques avancées :

- **API Frame.io** : Latence, taux de succès, rate limiting
- **Uploads** : Vitesse, taille, temps de transfert
- **Cache** : Hit rate, expiration, nettoyage automatique
- **Système** : CPU, mémoire, utilisation réseau
- **Erreurs** : Types, fréquence, récupération automatique

### Rapports Automatiques

Génération automatique de rapports de performance :

```
🔍 RAPPORT D'OPTIMISATION FRAME.IO
==================================================

📊 Session: 1247.3s

🌐 API CALLS:
   Total: 42
   Taux de succès: 97.62%
   Durée moyenne: 1.23s
   Durée médiane: 0.87s

📤 UPLOADS:
   Total: 8
   Vitesse moyenne: 3.45 MB/s
   Vitesse médiane: 3.12 MB/s

💾 CACHE:
   Taux de hit: 78.35%
   Hits: 156
   Misses: 43

💡 RECOMMANDATIONS:
   • Performances optimales! 🎉
```

## 🚀 Installation Rapide

### Prérequis

- Python 3.8+
- LucidLink configuré
- Compte Frame.io avec accès API
- Webhook Discord (optionnel)
- psutil (pour monitoring système)

### Installation

```bash
git clone https://github.com/your-repo/rl_postflow.git
cd rl_postflow
pip install -r requirements.txt

# Installer les dépendances supplémentaires pour les outils avancés
pip install psutil aiohttp
```

### Configuration

1. **Configurer Frame.io OAuth** :
   ```bash
   # Placer le fichier OAuth dans data/
   cp your-oauth-config.json data/890CarmineWhitefish-1845895-OAuth Web App.json
   ```

2. **Configurer les intégrations** :
   ```bash
   cp config/integrations.json.example config/integrations.json
   # Éditer le fichier avec vos paramètres
   ```

3. **Lancer le pipeline** :
   ```bash
   python main.py
   ```

## 📚 Documentation

### 📖 Guides d'utilisation
- [🚀 Guide de démarrage rapide](docs/guides/QUICK_START.md)
- [⚙️ Configuration complète](docs/guides/CONFIGURATION.md)
- [🔧 Dépannage](docs/guides/TROUBLESHOOTING.md)

### 🔌 Intégrations
- [🎬 Frame.io OAuth Setup](docs/integrations/FRAMEIO_OAUTH.md)
- [🔗 LucidLink Configuration](docs/integrations/LUCIDLINK_SETUP.md)
- [📢 Discord Notifications](docs/integrations/DISCORD_SETUP.md)

### 🛠️ Développement
- [🏗️ Architecture](docs/ARCHITECTURE.md)
- [🔧 Development Setup](docs/DEVELOPMENT.md)
- [📝 Contributing](docs/CONTRIBUTING.md)

### 📋 Référence API
- [🔐 Authentication](docs/api/AUTHENTICATION.md)
- [📁 Structure Management](docs/api/STRUCTURE.md)
- [📤 Upload Management](docs/api/UPLOAD.md)

## 🎯 Utilisation

### Démarrage du Pipeline

```bash
# Démarrage complet
python main.py

# Mode watcher uniquement
python main.py --watch-only

# Mode upload uniquement
python main.py --upload-only

# Mode debug
python main.py --debug
```

### Dashboard Web

```bash
# Lancer le dashboard
python dashboard.py

# Accéder à http://localhost:8080
```

### Exemples d'utilisation

```python
# Utilisation programmatique
from src.integrations.frameio import FrameIOIntegrationManager, create_frameio_auth

# Créer une instance d'authentification
auth = create_frameio_auth()

# Créer le gestionnaire d'intégration
integration = FrameIOIntegrationManager(auth)

# Traiter un fichier
await integration.process_file("/path/to/video.mp4")
```

## 🔧 Configuration

### Variables d'environnement

```bash
# Frame.io
FRAMEIO_DEFAULT_PROJECT_ID=your-project-id
FRAMEIO_DEFAULT_WORKSPACE_ID=your-workspace-id

# LucidLink
LUCIDLINK_MOUNT_PATH=/path/to/lucidlink

# Discord
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Pipeline
MAX_CONCURRENT_UPLOADS=3
ENABLE_DISCORD_NOTIFICATIONS=true
AUTO_CLEANUP_UPLOADS=false
```

### Fichiers de configuration

- `config/integrations.json` : Configuration des intégrations
- `config/frameio_config.json` : Configuration spécifique Frame.io
- `config/error_handling.json` : Configuration de gestion d'erreurs
- `pipeline_config.json` : Configuration du pipeline principal

## 🎛️ Fonctionnalités Avancées

### Surveillance LucidLink

- Monitoring en temps réel des modifications
- Filtrage par type de fichier et dossier
- Détection des nouveaux projets automatiquement

### Gestion des Uploads

- Upload parallèle optimisé
- Retry automatique avec backoff exponentiel
- Vérification d'intégrité des fichiers
- Gestion des gros fichiers (>2GB)

### Notifications

- Discord avec embeds riches
- Alertes en temps réel
- Résumés quotidiens/hebdomadaires
- Notifications d'erreurs

## 🚨 Dépannage

### Problèmes courants

1. **Token expiré** : Le système rafraîchit automatiquement les tokens
2. **Fichier non trouvé** : Vérifiez les permissions LucidLink
3. **Upload échoué** : Consultez les logs dans `logs/`

### Logs

```bash
# Consulter les logs
tail -f logs/postflow.log

# Logs spécifiques Frame.io
tail -f logs/frameio.log

# Logs du watcher
tail -f logs/watcher.log
```

## 📊 Monitoring

### Dashboard Web

Le dashboard web fournit :
- État en temps réel du pipeline
- Statistiques d'upload
- Gestion des erreurs
- Configuration à chaud

### Métriques

- Nombre de fichiers traités
- Temps d'upload moyen
- Taux de succès
- Utilisation des ressources

## 🔄 Mises à jour

### Version actuelle : 4.1.1

**Nouveautés :**
- ✅ Outils d'administration avancés
- ✅ Optimiseur de performance et monitoring
- ✅ Système d'alertes proactives
- ✅ Cache intelligent avec TTL configurable
- ✅ Gestion améliorée des erreurs et retry intelligent

### Historique des versions

- **4.1.1** : Ajout des outils d'administration et optimisation
- **4.0.0** : Refactorisation complète avec OAuth Web App
- **3.2.0** : Ajout du dashboard web
- **3.1.0** : Intégration Discord
- **3.0.0** : Migration vers Frame.io API v4

## 🤝 Contribution

### Comment contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

### Standards de code

- Python PEP 8
- Type hints obligatoires
- Documentation docstring
- Tests unitaires

## 📞 Support

### Contact

- **Email** : support@rl-postflow.com
- **Discord** : [Serveur PostFlow](https://discord.gg/postflow)
- **GitHub Issues** : [Issues](https://github.com/your-repo/rl_postflow/issues)

### Documentation complète

- [📚 Documentation complète](docs/README.md)
- [🎓 Tutoriels](docs/tutorials/README.md)
- [🔧 Référence API](docs/api/README.md)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Développé avec ❤️ par l'équipe RL PostFlow**

[🏠 Accueil](https://rl-postflow.com) • [📚 Documentation](docs/README.md) • [🚀 Démarrage](docs/guides/QUICK_START.md) • [🤝 Contribution](docs/CONTRIBUTING.md)

### 🔄 Pipeline de Production
- **12 statuts de plan** : De `pending` à `final_delivery`
- **5 stages de production** : Source → After Effects → EbSynth → Review → Delivery
- **Tracking temps réel** : Suivi automatique des progressions et erreurs
- **Processing par scène** : Traitement batch intelligent

### 🔗 Intégrations (Testées et Validées) ✅
- **Discord** : Notifications automatiques avec embeds riches
- **LucidLink** : Vérification des fichiers sources
- **After Effects** : Pipeline de traitement AE
- **Frame.io v4** : Upload automatique avec Adobe IMS OAuth 2.0
- **Google Sheets** : Synchronisation bidirectionnelle

### 🎥 Frame.io v4 - Intégration Adobe IMS (83.3% Complète)

**Migration vers Frame.io API v4** avec authentification Adobe IMS Server-to-Server :

- **🔐 Authentification JWT** : Server-to-Server avec clé privée RSA + Client Credentials fallback
- **🏗️ Architecture REST v4** : Endpoints stricts avec hiérarchie complète
- **📤 Upload avancé** : Séquence POST → PUT → Polling avec gestion d'erreurs
- **💬 Commentaires timecodés** : Support des annotations et replies
- **⚡ Rate limiting** : Gestion des erreurs 429 avec back-off exponentiel
- **🔄 Retry automatique** : Robustesse maximale avec cache de tokens

**Configuration actuelle** :
```bash
# Variables d'environnement (.env) - Extraites des fichiers JSON Adobe
FRAMEIO_CLIENT_ID=1b9748d7b40a408d97f943a75b6a9f18
FRAMEIO_CLIENT_SECRET=p8e-g7Car3_nUyAiD9bD6AzhL3VoB0l7fvmW
FRAMEIO_ORG_ID=E3761E2A657833C40A495CAC@AdobeOrg
FRAMEIO_ACCOUNT_ID=1845895
FRAMEIO_WORKSPACE_ID=4566206088345487626
FRAMEIO_TECHNICAL_ACCOUNT_ID=your_technical_account_id_here  # ⚠️ À configurer
```

**⚠️ Action requise** : Créer une intégration Server-to-Server dans Adobe Developer Console pour obtenir le Technical Account ID.
FRAMEIO_WORKSPACE_ID=your_workspace_id
```

**Scripts d'intégration** :
```bash
# Configuration interactive
python scripts/configure_frameio.py

# Validation complète
python scripts/validate_frameio.py
```

**Extensions VS Code recommandées** :
- ✅ **REST Client** (`humao.rest-client`) : Tester les endpoints via test_frameio.http
- ✅ **Postman API Client** (officielle) : Tests API directement dans VS Code
- ✅ **Python** : Intellisense et debugging
- ✅ **Pylance** : Type checking Python avancé
- ✅ **dotenv** : Support des fichiers .env

**Installation des extensions** :
```bash
# Via VS Code Command Palette (Ctrl+Shift+P)
ext install humao.rest-client
ext install Postman.postman-for-vscode
ext install ms-python.python
ext install ms-python.vscode-pylance
ext install mikestead.dotenv
```

## � Structure du Projet

```
rl_postflow/
├── main.py                  # Point d'entrée principal
├── dashboard.py             # Dashboard web de monitoring
├── src/                     # Code source modulaire
├── tests/                   # Tests organisés (unitaires/intégration)
├── scripts/                 # Scripts utilitaires
├── examples/                # Exemples et démos
├── docs/                    # Documentation
└── data/                    # Données et configuration
```

📖 **Documentation détaillée** : Voir [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

## �🚀 Installation & Utilisation

### Prérequis
```bash
Python 3.11+
```

### Installation
```bash
# Cloner le projet
git clone <repo-url>
cd rl_postflow

# Créer l'environnement virtuel
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
# ou .venv\Scripts\activate  # Windows

# Installation automatique des dépendances
python scripts/install_dependencies.py

```

### Utilisation Rapide

#### 0. 🎬 Configuration Frame.io (Nouveau)
```bash
# Assistant interactif pour Frame.io
python scripts/configure_frameio.py
# → Choisissez l'option 1 (Developer Token) pour démarrage immédiat
# → Choisissez l'option 2 (OAuth Adobe IMS) pour solution avancée

# Validation de la configuration
python scripts/validate_frameio.py
```
**✅ Débloquez Frame.io en 5 minutes avec Developer Token**

📖 **Guide complet :** [docs/FRAMEIO_QUICKSTART.md](docs/FRAMEIO_QUICKSTART.md) | [docs/FRAMEIO_INTEGRATION.md](docs/FRAMEIO_INTEGRATION.md)

#### 1. Parser CSV et Export de Base
```bash
python main.py
```
**Résultat :** Parse `shots.csv` et génère 4 formats d'export

#### 2. Export par Scène
```bash
python examples/export_by_scene.py
```
**Résultat :** 25 fichiers JSON individuels par scène

#### 3. Pipeline Complet (Démo)
```bash
python examples/pipeline_demo.py
```
**Résultat :** Démontre le workflow complet sur une scène

#### 4. Dashboard de Monitoring
```bash
python dashboard.py
```
**Résultat :** Interface web de monitoring du pipeline

## 🧪 Tests & Qualité

### 📊 **Statut des Tests (v2.1.0)**
- ✅ **88% de tests passants** (23/26 tests)

## 🚀 Migration Frame.io v4 - Adobe IMS

### ⚠️ Changements Importants

**MIGRATION COMPLÈTE** : L'intégration Frame.io a été entièrement migrée vers l'API v4 avec Adobe IMS OAuth 2.0.

**❌ Deprecated** :
- ~~Developer Token~~ (plus supporté)
- ~~Frame.io API v2~~ (déprécié)
- ~~frameioclient~~ (remplacé par httpx)

**✅ Nouveau** :
- Adobe IMS Server-to-Server OAuth 2.0
- Endpoints REST v4 stricts
- Architecture modulaire découplée
- Gestion robuste des erreurs et rate limits

### 🔄 Guide de Migration

#### 1. Mise à jour des dépendances
```bash
pip install httpx python-dotenv
```

#### 2. Configuration Adobe IMS
Créez une application Adobe IMS : https://developer.adobe.com/console/
- Type : **Server-to-Server OAuth**
- Scope : **frame.io**

#### 3. Configuration interactive
```bash
python scripts/configure_frameio.py
```

#### 4. Validation
```bash
python scripts/validate_frameio.py
```

#### 5. Test des endpoints
Ouvrez `test_frameio.http` dans VS Code avec l'extension REST Client

### 📁 Structure Modulaire

```
src/integrations/frameio/
├── __init__.py          # Exports et client unifié
├── auth.py             # Authentification Adobe IMS
├── structure.py        # Gestion projets/dossiers
├── upload.py           # Upload fichiers v4
└── comments.py         # Commentaires timecodés
```

### 🔧 Utilisation

```python
from integrations.frameio import create_frameio_client

# Créer un client complet
client = await create_frameio_client()

# Utiliser les managers
projects = await client["structure"].get_projects()
result = await client["upload"].upload_file(file_path, project_id)
comments = await client["comments"].get_file_comments(file_id)
```
- 🔧 **Architecture robuste** et validée
- 🚀 **Intégrations testées** et fonctionnelles
- 📈 **+34% d'amélioration** depuis la v2.0

### Exécution des Tests
```bash
# Tests rapides
python scripts/quick_test.py

# Tests unitaires
pytest tests/unit/

# Tests d'intégration
pytest tests/integration/

# Tous les tests avec coverage
pytest tests/ --cov=src
```

### Structure des Tests
- **`tests/unit/`** : Tests unitaires pour chaque module
- **`tests/integration/`** : Tests d'intégration du workflow
- **`tests/fixtures/`** : Données de test communes
- **`tests/legacy/`** : Anciens tests (référence)

📖 **Guide détaillé** : Voir [tests/README.md](tests/README.md)
├── pipeline_config.json      # Configuration pipeline
├── pipeline_status.json      # État temps réel des plans
├── data/
│   ├── shots.csv            # Données source (Google Sheets export)
│   └── timeline             # EDL du montage
├── output/                  # Fichiers générés
│   ├── undlm_shots_detailed.json    # Export JSON complet
│   ├── undlm_shots_ae.json          # Format After Effects
│   ├── undlm_shots_production.csv   # CSV équipe de prod
│   ├── undlm_shots_flat.csv         # CSV complet
│   ├── scene_*.json (×25)           # Fichiers par scène
│   └── pipeline_dashboard.json      # Dashboard projet
└── src/                     # Code modulaire
    ├── parsers/             # Parsers CSV/EDL
    ├── models/              # Modèles de données
    ├── exporters/           # Générateurs de sortie
    ├── workflows/           # Orchestration pipeline
    ├── integrations/        # Discord, Frame.io, etc.
    └── utils/               # Status tracker, helpers
```

## 🎯 Workflow Pipeline

### Statuts des Plans
```
⏳ pending → 🔍 sources_verified → 🎨 ae_ready → 🔄 ae_in_progress 
→ ✨ ae_completed → 🎭 ebsynth_ready → 🔄 ebsynth_in_progress 
→ 🎆 ebsynth_completed → 📤 review_uploaded → 👍 review_approved 
→ 🎉 final_delivery
```

### Exemple d'Utilisation Pipeline
```python
from src.workflows.pipeline_manager import PipelineManager

# Initialiser le pipeline
pipeline = PipelineManager()

# Traiter une scène complète
success = pipeline.process_scene(
    "REVEIL HOPITAL - JOUR",
    stages=["source_verification", "after_effects", "ebsynth_processing"]
)

# Obtenir les statistiques
stats = pipeline.get_pipeline_dashboard()
print(f"Progression: {stats['pipeline_stats']['completion_percentage']:.1f}%")
```

## ⚙️ Configuration

### Configuration Principale (`pipeline_config.json`)
```json
{
  "project_name": "UNDLM Documentary",
  "discord": {
    "webhook_url": "https://discord.com/api/webhooks/...",
    "notifications_enabled": true
  },
  "auto_processing": {
    "enabled": false,
    "batch_size": 5,
    "delay_between_batches": 30
  }
}
```

### Configuration Discord
1. Créer un webhook Discord
2. Ajouter l'URL dans `pipeline_config.json`
3. Activer `notifications_enabled: true`

## 📊 Formats d'Export

### JSON After Effects (`undlm_shots_ae.json`)
```json
{
  "project": "UNDLM Documentary",
  "shots": [
    {
      "nomenclature": "UNDLM_00001",
      "scene": "REVEIL HOPITAL - JOUR",
      "source_file": "A_0002C123X250401_112218G6_UNDLM.mov",
      "timeline_in": "00:00:01:03",
      "timeline_out": "00:00:10:06",
      "duration": "00:00:09:03"
    }
  ]
}
```

### CSV Production (`undlm_shots_production.csv`)
```csv
NOMENCLATURE,SHOT_NUMBER,SCENE,TIMELINE_IN,TIMELINE_OUT,DURATION,SOURCE_FILE,IS_DUPLICATE,READY_FOR_EDIT
UNDLM_00001,001,REVEIL HOPITAL - JOUR,00:00:01:03,00:00:10:06,00:00:09:03,A_0002C123X250401_112218G6_UNDLM.mov,YES,NO
```

## 🔧 Développement

### Ajouter une Nouvelle Intégration
```python
# src/integrations/nouvelle_integration.py
class NouvelleIntegration:
    def __init__(self, config):
        self.config = config
    
    def process_shot(self, shot_data):
        # Logique d'intégration
        pass
```

### Ajouter un Nouveau Status
```python
# src/utils/status_tracker.py
class ShotStatus(Enum):
    # ...statuts existants...
    NOUVEAU_STATUS = "nouveau_status"
```

## 📈 Statistiques Actuelles

- **516 plans** parsés avec succès
- **25 scènes** organisées et prêtes
- **299 fichiers sources** uniques identifiés
- **61.8% de doublons** détectés automatiquement
- **4 nomenclatures manquantes** identifiées

## 🚧 Roadmap

### Phase 2 - Interface Web Dashboard
- [ ] Dashboard temps réel
- [ ] Contrôle pipeline via interface
- [ ] Visualisation progression par scène

### Phase 3 - Intégrations Réelles
- [ ] Connexion LucidLink
- [ ] Scripts After Effects
- [ ] API Frame.io
- [ ] Sync Google Sheets

### Phase 4 - Optimisations
- [ ] Processing parallèle
- [ ] Cache intelligent
- [ ] Retry automatique

## 🐛 Dépannage

### Erreurs Communes

**"Invalid timecode format"**
```
Solution: Vérifier le format HH:MM:SS:FF dans shots.csv
```

**"Scene not found"**
```
Solution: Vérifier que les fichiers scene_*.json existent dans output/
```

**"Discord notification failed"**
```
Solution: Vérifier l'URL webhook dans pipeline_config.json
```

## 📞 Support

Pour toute question ou amélioration, consultez :
- **Documentation** : Voir le dossier [`docs/`](docs/) pour la documentation complète
- **Tests** : Exécuter `python run_tests.py` pour valider le setup
- **Logs** : Les messages détaillés apparaissent dans le terminal
- **Dashboard** : `output/pipeline_dashboard.json` pour l'état complet
- **Status** : `data/pipeline_status.json` pour le suivi individuel des plans

## 📚 Documentation

- [`docs/README.md`](docs/README.md) - Documentation complète
- [`docs/SETUP_SUMMARY.md`](docs/SETUP_SUMMARY.md) - Résumé de configuration
- [`docs/arbo_undlm_proposed.txt`](docs/arbo_undlm_proposed.txt) - Arborescence serveur
- [`tests/README.md`](tests/README.md) - Guide des tests

## 📄 License

Projet privé - UNDLM Documentary Production

---

> **Note**: Ce projet est en développement actif. La nomenclature et les chemins de fichiers sont amenés à évoluer lors du lancement réel de la production.

# RL PostFlow – Intégration Frame.io v4 (OAuth Web App)

Ce projet utilise uniquement le flow OAuth Web App v4 pour l’authentification Frame.io (Adobe IMS).

Pour la configuration et l’utilisation, voir :
- `README_FRAMEIO_OAUTH.md`

> **Note** : Toute la documentation et les scripts liés au flow Server-to-Server/JWT ont été archivés (voir `docs/ARCHIVE_FRAMEIO_SERVER_TO_SERVER_DOCS.md`).

## Variables d’environnement principales

- `FRAMEIO_CLIENT_ID`
- `FRAMEIO_CLIENT_SECRET`
- `FRAMEIO_AUTH_CODE`
- `FRAMEIO_ACCOUNT_ID`
- `FRAMEIO_WORKSPACE_ID`

## Démarrage rapide

1. Suivez le guide dans `README_FRAMEIO_OAUTH.md` pour obtenir un code d’autorisation et initialiser le refresh_token.
2. Lancez le script de démo :
   ```bash
   python scripts/frameio_oauth_webapp_demo.py
   ```
3. Le refresh_token sera stocké automatiquement pour les prochaines sessions.

## Documentation

- [README_FRAMEIO_OAUTH.md](README_FRAMEIO_OAUTH.md) – Guide complet OAuth Web App v4
- [docs/ARCHIVE_FRAMEIO_SERVER_TO_SERVER_DOCS.md](docs/ARCHIVE_FRAMEIO_SERVER_TO_SERVER_DOCS.md) – Archives Server-to-Server (obsolète)