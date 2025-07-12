# 📜 Scripts Disponibles - RL PostFlow

> **Guide de référence pour tous les scripts du projet**

## 🎬 **Scripts After Effects**

### **analyze_gsheets_data.py**
**Analyse et génération du mapping des séquences depuis Google Sheets**

```bash
# Génération mapping complet (28 séquences)
python scripts/analyze_gsheets_data.py

# Mode validation (3 premières séquences)
python scripts/analyze_gsheets_data.py --validation
```

**Sortie :**
- Fichier `config/after_effects_mapping_gsheets.json`
- Rapport détaillé des 28 séquences (516 plans)
- Statistiques de production et estimation ressources

### **generate_ae_projects_v2.py**
**Générateur automatique de projets After Effects**

```bash
# Séquence individuelle
python scripts/generate_ae_projects_v2.py --sequence SQ01
python scripts/generate_ae_projects_v2.py --sequence SQ23

# Validation (SQ01, SQ02, SQ03)
python scripts/generate_ae_projects_v2.py --validation

# Toutes les séquences
python scripts/generate_ae_projects_v2.py --all

# Mode simulation
python scripts/generate_ae_projects_v2.py --sequence SQ01 --dry-run
```

**Génère :**
- Structure EB complète (`_EB/`, `_PS/`)
- Projets After Effects (`_AE/SQXX_01.aep`)
- Scripts JSX optimisés
- Import sources Edit/Graded automatique

## 🔧 **Scripts Utilitaires**

### **main.py**
**Pipeline principal de post-production**

```bash
python main.py
```

**Fonctionnalités :**
- Surveillance LucidLink en temps réel
- Upload automatique Frame.io
- Notifications Discord
- Dashboard web intégré

### **stop_postflow.py**
**Arrêt propre du pipeline**

```bash
python stop_postflow.py
```

### **dashboard.py**
**Dashboard web autonome**

```bash
python dashboard.py
```

**Interface :** `http://localhost:8080`

## 📊 **Scripts de Validation**

### **validate_ae_ready.py**
**Validation du générateur After Effects**

```bash
python validate_ae_ready.py
```

**Contrôles :**
- Configuration Google Sheets
- Mapping des séquences
- Disponibilité des sources
- Structure template SQXX

### **validate_ae_v2.py**
**Validation avancée du générateur v2**

```bash
python validate_ae_v2.py
```

### **validate_ae_workflow.py**
**Validation complète du workflow AE**

```bash
python validate_ae_workflow.py
```

## 📈 **Scripts d'Analyse**

### **analyze_shots_data.py**
**Analyse des données de plans (legacy)**

```bash
python scripts/analyze_shots_data.py
```

**Note :** Remplacé par `analyze_gsheets_data.py` pour le support CSV Google Sheets.

## 🧪 **Tests**

### **pytest**
**Suite de tests automatisés**

```bash
# Tous les tests
pytest tests/

# Test spécifique
pytest tests/test_watcher.py

# Avec couverture
pytest --cov=src tests/
```

### **Tests manuels**
```bash
# Test upload Frame.io
python tests/test_frameio_upload.py

# Test notifications Discord
python tests/test_discord_notifications.py

# Test Google Sheets
python tests/test_google_sheets.py
```

## 🔄 **Workflows Recommandés**

### **Setup Initial**
```bash
# 1. Configuration
cp .env.example .env
# Éditer .env avec vos configurations

# 2. Génération mapping AE
python scripts/analyze_gsheets_data.py

# 3. Validation
python scripts/generate_ae_projects_v2.py --validation
```

### **Production After Effects**
```bash
# 1. Test sur séquence prioritaire
python scripts/generate_ae_projects_v2.py --sequence SQ01

# 2. Validation manuelle dans AE
# Importer SQ01_generation_script_v2.jsx

# 3. Génération massive
python scripts/generate_ae_projects_v2.py --all
```

### **Monitoring Production**
```bash
# Terminal 1 : Pipeline principal
python main.py

# Terminal 2 : Dashboard (si séparé)
python dashboard.py

# Terminal 3 : Monitoring logs
tail -f logs/postflow.log
```

## 📁 **Structure des Scripts**

```
scripts/
├── analyze_gsheets_data.py     # Mapping Google Sheets → AE
├── generate_ae_projects_v2.py  # Générateur AE v2
├── analyze_shots_data.py       # Analyse legacy
└── utils/                      # Scripts utilitaires
    ├── test_frameio.py
    ├── test_discord.py
    └── maintenance.py

ae_scripts/                     # Scripts JSX générés
├── RL_PostFlow_SQ01_GENERATION_V2.jsx
├── RL_PostFlow_SQ05_GENERATION_V2.jsx
└── ...

tests/                          # Tests automatisés
├── test_watcher.py
├── test_frameio_integration.py
├── test_discord_notifications.py
└── ...
```

## 🔍 **Debugging et Logs**

### **Logs Principaux**
```bash
# Pipeline principal
tail -f logs/postflow.log

# Générateur AE
tail -f logs/ae_generator.log

# Dashboard
tail -f logs/dashboard.log
```

### **Debug Mode**
```bash
# Mode verbose
python scripts/generate_ae_projects_v2.py --sequence SQ01 --verbose

# Debug Python
python -m pdb scripts/analyze_gsheets_data.py
```

### **Validation Rapide**
```bash
# Test connectivité
python -c "import src.integrations.frameio_uploader; print('Frame.io OK')"
python -c "import src.integrations.google_sheets; print('Google Sheets OK')"
python -c "import src.integrations.discord_notifier; print('Discord OK')"

# Test fichiers critiques
ls -la config/after_effects_mapping_gsheets.json
ls -la data/RL_O2B_UNDLM_SUIVI_ANIM\ -\ SHOTS_TRACK.csv
```

## 📋 **Checklist de Production**

### **Before Production**
- [ ] Mapping Google Sheets à jour (`analyze_gsheets_data.py`)
- [ ] Test validation réussi (`--validation`)
- [ ] Sources Edit/Graded disponibles
- [ ] Template SQXX accessible
- [ ] Espace disque suffisant (~1.4GB)

### **During Production**
- [ ] Pipeline principal actif (`main.py`)
- [ ] Dashboard accessible (`http://localhost:8080`)
- [ ] Logs monitoring (`tail -f logs/postflow.log`)
- [ ] Tests AE réguliers sur échantillons

### **After Production**
- [ ] Validation projets AE générés
- [ ] Test import scripts JSX
- [ ] Backup configurations
- [ ] Documentation mise à jour

## 🆘 **Commandes d'Urgence**

### **Arrêt d'Urgence**
```bash
# Arrêt propre
python stop_postflow.py

# Force kill (si nécessaire)
pkill -f "python main.py"
pkill -f "python dashboard.py"
```

### **Reset Complet**
```bash
# Nettoyage logs
rm -f logs/*.log

# Reset tracking
> data/uploads_tracking.json
echo '{}' > data/uploads_tracking.json

# Régénération mapping
python scripts/analyze_gsheets_data.py
```

### **Récupération d'Erreur**
```bash
# Vérification intégrité
python scripts/validate_ae_workflow.py

# Régénération séquence spécifique
python scripts/generate_ae_projects_v2.py --sequence SQ01 --force

# Test minimal
python scripts/generate_ae_projects_v2.py --sequence SQ01 --dry-run
```

---

**Scripts RL PostFlow** - Guide de référence complet et pratique
