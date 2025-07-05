# RL PostFlow - Pipeline de Post-Production

> Outil de traitement et suivi des données de post-production pour documentaire animé de 52 minutes

## 🎬 Vue d'ensemble

RL PostFlow est un pipeline modulaire de post-production conçu pour gérer le workflow complexe d'un documentaire animé utilisant :
- **Live-action** → **After Effects** → **EbSynth** → **Animation finale**
- Suivi de **516 plans** répartis sur **25 scènes**
- Intégration avec **LucidLink**, **Frame.io**, **Discord**, et **Google Sheets**

## ✨ Fonctionnalités

### 📊 Parser & Export
- **Parser CSV robuste** : Analyse automatique des données de production
- **Export multi-format** : JSON détaillé, After Effects, CSV production
- **Export par scène** : 25 fichiers JSON individuels pour traitement séparé
- **Nomenclature centrée** : Gestion via identifiants UNDLM_XXXXX

### 🔄 Pipeline de Production
- **12 statuts de plan** : De `pending` à `final_delivery`
- **5 stages de production** : Source → After Effects → EbSynth → Review → Delivery
- **Tracking temps réel** : Suivi automatique des progressions et erreurs
- **Processing par scène** : Traitement batch intelligent

### 🔗 Intégrations (Architecture prête)
- **Discord** : Notifications automatiques avec embeds riches
- **LucidLink** : Vérification des fichiers sources
- **After Effects** : Pipeline de traitement AE
- **Frame.io** : Upload automatique pour review
- **Google Sheets** : Synchronisation bidirectionnelle

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

## 🧪 Tests

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