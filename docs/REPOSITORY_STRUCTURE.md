# 📁 Structure du Repository PostFlow v4.3.0

## 🎯 Fichiers Principaux (Racine)

```
📄 main.py                    # Point d'entrée principal v4.3.0
📄 README.md                  # Documentation principale  
📄 CHANGELOG.md               # Historique des versions
📄 LICENSE                    # Licence du projet
📄 requirements.txt           # Dépendances Python
📄 pipeline_config.json       # Configuration du pipeline v4.3.0
📄 pytest.ini                # Configuration des tests
📄 .gitignore                # Fichiers ignorés par Git
📄 COMMIT_MESSAGE_v4.3.0.md   # Message de commit v4.3.0
```

## 📂 Structure Organisée

### 🧩 **Code Source**
```
src/                          # Code source principal
├── bootstrap/               # Modules d'initialisation
├── integrations/           # Intégrations (Frame.io, Discord, etc.)
├── utils/                  # Utilitaires partagés
└── core/                   # Composants core
```

### 🛠️ **Outils et Scripts**
```
tools/                        # Outils de développement
├── validation/             # Scripts de validation
│   ├── validate_postflow.py
│   ├── validate_no_hardcoded_paths.py
│   └── test_cross_platform.py
├── migration/              # Outils de migration
│   ├── migrate_to_windows.py
│   └── setup_postflow.py
├── demo/                   # Démonstrations
│   ├── demo_cross_platform.py
│   └── demo_stable_configs.py
└── utilities/              # Utilitaires divers
```

### 📜 **Scripts de Déploiement**
```
scripts/                      # Scripts d'automatisation
├── deploy.py               # Déploiement intelligent
├── deploy_windows.bat      # Déploiement Windows
├── pre_deploy_check.sh     # Validation pré-déploiement
└── tests/                  # Tests spécifiques
```

### 📚 **Documentation**
```
docs/                         # Documentation complète
├── WINDOWS_GUIDE.md        # Guide Windows
├── DEPLOYMENT_STRATEGY.md  # Stratégie déploiement
├── reports/                # Rapports techniques
│   ├── WINDOWS_COMPATIBILITY_REPORT.md
│   ├── CORRECTION_CHEMINS_EN_DUR.md
│   └── MISSION_ACCOMPLISHED.md
└── guides/                 # Guides utilisateur
    ├── DEPLOYMENT_QUICK_GUIDE.md
    └── REPOSITORY_STRUCTURE.md
```

### ⚙️ **Configuration v4.3.0**
```
config/                       # Fichiers de configuration
├── integrations.json.example
├── pipeline_config.json      # Config principale v4.3.0
├── nomenclature.json.example
├── error_handling.json.example
├── after_effects_mapping_gsheets.json  # Mapping complet AE
├── after_effects_mapping_P02.json      # Config P02 (71 plans)
└── after_effects_mapping_P03.json      # Config P03 (21 plans)
```

### 📊 **Données et Logs**
```
data/                         # Données de l'application
├── postflow.db             # Base de données SQLite
├── uploads_tracking.json   # Suivi des uploads CRITIQUE
├── pipeline_status.json    # Statut pipeline CRITIQUE
└── validation_reports/     # Rapports de validation
```

### 🎬 **After Effects v3.0**
```
tools/after_effects_generator_v2/  # Générateur AE
├── generate_ae_projects_v2.py     # Version classique
├── generate_ae_projects_v3.py     # v3.0 avec configs custom
└── ae_scripts/                    # Scripts JSX générés
    ├── RL_PostFlow_P02_ALL_GENERATION_V2.jsx  # P02 prioritaire
    └── RL_PostFlow_P03_ALL_GENERATION_V2.jsx  # P03 prioritaire
```
└── validation_reports/     # Rapports de validation

logs/                         # Fichiers de logs
├── postflow.log            # Log principal
└── deploy_*.log            # Logs de déploiement
```

### 🗄️ **Archives et Sauvegardes**
```
archive/                      # Archives et fichiers obsolètes
├── old_scripts/            # Anciens scripts
├── development_docs/       # Ancienne documentation
└── legacy_code/            # Code legacy

backups/                      # Sauvegardes automatiques
└── config_backups/         # Sauvegardes de config
```

### 🎯 **Autres Dossiers**
```
templates/                    # Templates de fichiers
validation/                   # Dossier de validation
releases/                     # Gestion des versions
examples/                     # Exemples d'utilisation
```

## 🚀 Utilisation

### Démarrage Principal
```bash
python main.py
```

### Validation Système
```bash
python tools/validation/validate_postflow.py
```

### Tests Cross-Platform
```bash
python tools/validation/test_cross_platform.py
```

### Migration Windows
```bash
python tools/migration/migrate_to_windows.py
```

### Installation Automatique
```bash
python tools/migration/setup_postflow.py
```

## 📋 Avantages de Cette Structure

✅ **Racine propre** - Seuls les fichiers essentiels  
✅ **Organisation logique** - Chaque type de fichier à sa place  
✅ **Navigation facile** - Structure intuitive  
✅ **Maintenance simplifiée** - Tout est rangé  
✅ **Scripts accessibles** - Outils bien organisés  

---

*PostFlow v4.1.3 - Structure optimisée le 12 juillet 2025*
