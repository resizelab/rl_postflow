# 🎬 After Effects Generator v2 - RL PostFlow

## 📋 Vue d'Ensemble

Générateur automatique de projets After Effects v2 pour le pipeline RL PostFlow. Crée des projets AE complets avec structure de dossiers EB, compositions plans, et timeline assemblée basée sur les données Google Sheets.

## ✨ Fonctionnalités

### **🎯 Génération Automatique Complète**
- **28 séquences** (SQ01-SQ28) avec **520 plans** total
- **Structure EB complète** : Tous les dossiers par plan avec nouvelle organisation 2024
- **Projets AE professionnels** : Compositions, précomps, timeline assemblée
- **Double source** : Plans montage (FROM_EDIT) + Plans étalonnés (FROM_GRADING)
- **Format 1440p** : Sources UHD (3840x2160) mises à l'échelle vers 2560x1440
- **Structure template** : Compatible avec template SQXX_01.aep

### **🗂️ Structure Générée**

```
📁 SQ02/                              # Exemple séquence
├── 📄 _AE/
│   ├── SQ02_01.aep                   # Projet After Effects complet
│   └── SQ02_generation_script_v2.jsx # Script ExtendScript
├── 📁 _EB/                           # Structure EbSynth complète
│   ├── UNDLM_00035/                  # Plan 1
│   │   ├── 1_VIDEO-REF/
│   │   ├── 2_KEY/
│   │   │   ├── HAIR/
│   │   │   ├── SKIN/
│   │   │   └── _Others/
│   │   │       ├── Cloth_1/
│   │   │       ├── Cloth_2/
│   │   │       ├── Decor_1/
│   │   │       ├── Decor_2/
│   │   │       ├── LifeJacket/
│   │   │       ├── Lips/
│   │   │       ├── Pupil/
│   │   │       ├── Shadow/
│   │   │       └── Silhouettes/
│   │   ├── 3_OUT/                    # Structure identique à 2_KEY
│   │   └── EB_UNDLM_00035.psd        # Fichier PSD template
│   ├── UNDLM_00036/                  # Plan 2
│   └── ... (tous les plans)
└── 📁 _PS/                           # Dossier Photoshop
```

### **🎨 Architecture After Effects Générée**

```
📄 SQ02_01.aep
├── 📂 _MASTER/
│   ├── MASTER_COMP_SEQ/
│   │   └── 🎬 SQ02_UNDLM_v001        # Composition séquence principale
│   └── MASTER_COMPS_SHOTS/
│       ├── 🎭 SQ02_UNDLM_00035_v001  # Composition plan 1
│       ├── 🎭 SQ02_UNDLM_00036_v001  # Composition plan 2
│       └── ... (compositions individuelles)
├── 📂 _IN/
│   ├── Divers/
│   ├── EB/
│   ├── FROM_EDIT/                    # Sources montage
│   │   ├── 🎥 UNDLM_00035.mov
│   │   └── ... (tous les plans)
│   ├── FROM_GRADING/                 # Sources étalonnées (si disponibles)
│   ├── PS/
│   └── Ref_Colors/
└── 📂 _WORK/
    ├── WORK_COMP/
    └── WORK_LAYERS/
        └── BG_SOLID_BLACK            # Solid réutilisable
```

## 🚀 Utilisation

### **Installation**
```bash
cd /path/to/rl_postflow/tools/after_effects_generator_v2
```

### **Scripts Disponibles**

#### **1. Script Principal**
```bash
# Génération d'une séquence spécifique
python generate_ae_projects_v2.py --sequence SQ02

# Test avec dry-run (simulation)
python generate_ae_projects_v2.py --sequence SQ02 --dry-run
```

#### **2. Validation**
```bash
# Valider que l'outil fonctionne correctement
python validate.py
```

#### **3. Démonstration**
```bash
# Voir aperçu des données et commandes disponibles
python demo.py
```

### **Commandes Principales**

#### **1. Générer une Séquence**
```bash
# Test avec dry-run (simulation)
python generate_ae_projects_v2.py --sequence SQ02 --dry-run

# Génération réelle
python generate_ae_projects_v2.py --sequence SQ02
```

#### **2. Validation (3 premières séquences)**
```bash
# Test validation
python generate_ae_projects_v2.py --validation --dry-run

# Génération validation
python generate_ae_projects_v2.py --validation
```

#### **3. Génération Complète (28 séquences)**
```bash
# Test complet
python generate_ae_projects_v2.py --all --dry-run

# Production complète
python generate_ae_projects_v2.py --all
```

### **Options Disponibles**
- `--sequence SQ01` : Génère une séquence spécifique
- `--validation` : Génère SQ01, SQ02, SQ03 pour validation
- `--all` : Génère toutes les 28 séquences
- `--dry-run` : Mode simulation (pas de génération réelle)

## 📊 Workflow de Production

### **Phase 1 : Préparation**
1. **Données sources** : CSV Google Sheets analysé automatiquement
2. **Configuration** : Mapping JSON généré pour toutes les séquences
3. **Validation chemins** : Vérification des dossiers sources

### **Phase 2 : Génération Structure**
1. **Arborescence EB** : Création de tous les dossiers par plan
2. **Structure nouvelle 2024** : HAIR, SKIN, _Others avec 9 catégories
3. **Fichiers PSD** : Copie du template vers chaque plan

### **Phase 3 : Génération After Effects**
1. **Script ExtendScript** : Génération automatique du code AE
2. **Import sources** : Plans montage + étalonnés (selon disponibilité)
3. **Compositions** : Une par plan + composition master
4. **Timeline assemblée** : Séquence montée selon données CSV
5. **Projet sauvegardé** : Fichier .aep prêt à utiliser

## 🔧 Configuration

### **Chemins Sources**
```python
FROM_EDIT_PATH = "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS"
FROM_GRADING_PATH = "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS"
SEQUENCES_PATH = "/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES"
TEMPLATE_PATH = "/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX"
```

### **Configuration JSON**
- **Source** : `config/after_effects_mapping_gsheets.json`
- **Générée par** : `scripts/analyze_gsheets_data.py`
- **Contient** : Mapping de toutes les séquences et plans

### **Format After Effects**
```javascript
// Compositions Plans
width: 2560px (1440p)
height: 1440px
framerate: 25fps
duration: auto (basé sur CSV)

// Sources UHD mise à l'échelle
scale: 66.67% (3840→2560)
position: centré [1280, 720]
```

## 📈 Séquences Supportées

| Séquence | Nom | Plans | Statut |
|----------|-----|-------|--------|
| **SQ01** | REVEIL HOPITAL - JOUR | 34 | ✅ Validé |
| **SQ02** | BUS - FIN DE JOURNEE | 39 | ✅ Validé |
| **SQ03** | FLASHBACK 1 - NUIT AMERICAINE | 20 | ✅ Validé |
| **SQ04** | ... | ... | 🔄 Disponible |
| **...** | ... | ... | 🔄 Disponible |
| **SQ28** | GENERIQUE DE FIN | 10 | 🔄 Disponible |

**Total : 28 séquences, 520 plans**

## 🎛️ Fonctionnalités Avancées

### **Détection Plans Étalonnés**
- **Vérification automatique** des plans dans FROM_GRADING
- **Import conditionnel** : Seuls les plans disponibles
- **Priorité étalonnés** : Plans graded désactivent plans edit automatiquement

### **Structure EB Nouvelle 2024**
- **HAIR** : Cheveux (séparé pour optimisation)
- **SKIN** : Peau (traitement spécialisé)
- **_Others** : 9 catégories détaillées
  - Cloth_1, Cloth_2 : Vêtements principaux/secondaires
  - Decor_1, Decor_2 : Éléments de décor
  - LifeJacket : Gilets de sauvetage spécifiques
  - Lips, Pupil : Détails visage
  - Shadow, Silhouettes : Éléments graphiques

### **Optimisations AE 2025**
- **Solid réutilisable** : BG_SOLID_BLACK dans WORK_LAYERS
- **Labels couleurs** : Plans alternés pour identification
- **Timecode automatique** : Adjustment layer avec effet TC

## 🚨 Dépannage

### **Erreurs Communes**

#### **Configuration manquante**
```bash
❌ Configuration non trouvée : config/after_effects_mapping_gsheets.json
```
**Solution** : Lancer `python scripts/analyze_gsheets_data.py` d'abord

#### **Plans sources manquants**
```bash
❌ ERREUR: Plan EDIT manquant - UNDLM_00XXX.mov
```
**Solution** : Vérifier `/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/`

#### **Permissions serveur**
```bash
❌ Erreur création structure EB
```
**Solution** : Vérifier permissions `/Volumes/resizelab/o2b-undllm/3_PROJECTS/`

### **Vérifications Préalables**
```bash
# 1. Validation complète de l'outil
python validate.py

# 2. Configuration mapping
ls ../../config/after_effects_mapping_gsheets.json

# 3. Plans sources
ls /Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_*.mov

# 4. Template disponible
ls /Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX/

# 5. Permissions écriture
touch /Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/test
```

### **Workflow de Diagnostic**
```bash
# 1. Démo pour voir les données disponibles
python demo.py

# 2. Validation de l'outil
python validate.py

# 3. Test dry-run d'une séquence
python generate_ae_projects_v2.py --sequence SQ02 --dry-run

# 4. Génération réelle si tous les tests passent
python generate_ae_projects_v2.py --sequence SQ02
```

## 📚 Ressources

### **Scripts Connexes**
- **`scripts/analyze_gsheets_data.py`** : Génère la configuration mapping
- **`scripts/generate_ae_projects.py`** : Version 1 (legacy)
- **`validate_ae_ready.py`** : Validation des projets générés

### **Documentation**
- **`docs/AFTER_EFFECTS_GENERATOR.md`** : Documentation complète v1
- **`docs/guides/after-effects-automation.md`** : Guide technique
- **`TECHNICAL_LOG_AE_SUCCESS.md`** : Journal des validations

### **Configuration**
- **`config/after_effects_mapping_gsheets.json`** : Mapping séquences/plans
- **`data/RL_O2B_UNDLM_SUIVI_ANIM - SHOTS_TRACK.csv`** : Source CSV

## ✅ Tests et Validation

### **Tests Automatiques**
```bash
# Test dry-run d'une séquence
python generate_ae_projects_v2.py --sequence SQ01 --dry-run

# Test validation complète
python generate_ae_projects_v2.py --validation --dry-run
```

### **Validation Manuelle**
- [ ] Projet AE s'ouvre sans erreur
- [ ] Structure de dossiers conforme au template
- [ ] Tous les plans importés correctement
- [ ] Timeline assemblée selon CSV
- [ ] Sources UHD correctement mises à l'échelle
- [ ] Timecode fonctionnel

### **Métriques de Succès**
- **Structures EB** : 100% des plans avec arborescence complète
- **Projets AE** : Compatibles template SQXX_01.aep
- **Import sources** : Plans edit toujours, graded selon disponibilité
- **Performance** : <2min par séquence en moyenne

## 🎉 Avantages v2

### **Par rapport à la v1 :**
- ✅ **Structure EB complète** (v1 ne créait que _AE)
- ✅ **Nouvelle organisation 2024** HAIR/SKIN/_Others
- ✅ **Compatible template** SQXX_01.aep
- ✅ **Sources UHD optimisées** mise à l'échelle automatique
- ✅ **Solid réutilisable** optimisation AE 2025
- ✅ **Timecode automatique** dans compositions master

### **Production Ready :**
- 🎬 **28 séquences** prêtes à générer
- 📊 **520 plans** supportés
- 🏗️ **Structure complète** EB + AE + PS
- ⚡ **Performance optimisée** pour pipeline 2024
- 🔧 **Maintenance simplifiée** code documenté et modulaire

---

*🎬 After Effects Generator v2 - Prêt pour production RL PostFlow !*
