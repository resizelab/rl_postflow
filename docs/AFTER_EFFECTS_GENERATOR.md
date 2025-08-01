# 🎬 After Effects Generator v3

> **Générateur automatique de projets After Effects pour RL PostFlow**  
> Compatible avec le template SQXX et toutes les 28 séquences du projet  
> **v3.0** : Support des configurations prioritaires (P02, P03) et configs personnalisées

## 🚀 **Vue d'ensemble**

Le générateur After Effects v2 automatise la création de projets AE en respectant strictement la structure du template SQXX. Il génère automatiquement :

- **Structure de dossiers AE** conforme au template
- **Import des sources** (Edit et Graded selon disponibilité)
- **Compositions de plans** individuels avec scaling UHD → 1440p
- **Composition master** de séquence avec assembly temporel
- **Structure EB** complète pour chaque plan
- **Scripts JSX optimisés** pour After Effects 2025

## 📊 **Séquences Supportées**

### **Mapping Complet (28 séquences - 516 plans)**

| Séquence | Nom | Plans | Durée | Statut |
|----------|-----|-------|-------|--------|
| **SQ01** | REVEIL HOPITAL - JOUR | 34 | 2.9min | ✅ |
| **SQ02** | BUS - FIN DE JOURNEE | 39 | 2.8min | ✅ |
| **SQ03** | MARCHE - FIN DE JOURNEE | 20 | 2.1min | ✅ |
| **SQ04** | ATTENTE PLAGE - ENTRE CHIEN ET LOUP | 24 | 1.9min | ✅ |
| **SQ05** | DEPART EN MER - 20H30-21H30 - NUIT AMERICAINE | 16 | 1.2min | ✅ |
| **SQ06** | DEPART EN MER - 20H30-21H30 - NUIT AMERICAINE | 11 | 1.1min | ✅ |
| **SQ07** | DEPART EN MER - 20H30-21H30 - NUIT AMERICAINE | 19 | 2.1min | ✅ |
| **SQ08** | ARRIVEE CROSS - EXT.NUIT AMERICAINE | 11 | 1.1min | ✅ |
| **SQ09** | CROSS INTERIEUR - NUIT | 15 | 1.3min | ✅ |
| **SQ10** | EXT CROSS - NUIT AMERICAINE | 12 | 1.3min | ✅ |
| **SQ11** | APPEL A MER - 00H51 - NUIT AMERICAINE | 9 | 1.3min | ✅ |
| **SQ12** | CROSS INTERIEUR - NUIT | 22 | 1.7min | ✅ |
| **SQ13** | APPEL 1 MER - 00H51 - NUIT AMERICAINE | 14 | 1.0min | ✅ |
| **SQ14** | EXT CROSS - NUIT AMERICAINE | 19 | 2.4min | ✅ |
| **SQ15** | EN MER (LUMIERE TEL) - NUIT AMERICAINE | 19 | 1.7min | ✅ |
| **SQ16** | EN MER - NUIT AMERICAINE | 17 | 1.7min | ✅ |
| **SQ17** | EN MER - NUIT AMERICAINE | 6 | 0.6min | ✅ |
| **SQ18** | EXT CROSS - NUIT AMERICAINE | 8 | 1.6min | ✅ |
| **SQ19** | EN MER - NUIT AMERICAINE | 16 | 2.2min | ✅ |
| **SQ20** | EN MER - NUIT AMERICAINE | 13 | 1.2min | ✅ |
| **SQ21** | EN MER - NUIT AMERICAINE | 33 | 2.9min | ✅ |
| **SQ22** | EXT CROSS - NUIT AMERICAINE | 19 | 2.5min | ✅ |
| **SQ23** | 2EME MAYDAY EXT - NUIT AMERICAINE | 24 | 3.0min | ✅ |
| **SQ24** | NAUFFRAGE MER EXT NUIT AMERICAINE + BATEAUX SAUVETAGE | 18 | 1.9min | ✅ |
| **SQ25** | NAUFFRAGE MER EXT NUIT AMERICAINE + BATEAUX SAUVETAGE | 21 | 1.5min | ✅ |
| **SQ26** | EXT CROSS - NUIT AMERICAINE 3H16 | 15 | 1.7min | ✅ |
| **SQ27** | LEVER DU SOLEIL 7H23 - EXT MER | 27 | 3.0min | ✅ |
| **SQ28** | REVEIL HOPITAL JOUR | 15 | 2.0min | ✅ |

**Total : 516 plans - 51.9 minutes**

## 🛠️ **Usage**

### **Configuration Initiale**

1. **Générer le mapping complet** (depuis CSV Google Sheets) :
```bash
python scripts/analyze_gsheets_data.py
```

2. **Valider le mapping** (3 premières séquences seulement) :
```bash
python scripts/analyze_gsheets_data.py --validation
```

3. **Générer configs prioritaires** (v3.0) :
```bash
# Générer config P02 (71 plans prioritaires)
python scripts/analyze_gsheets_data.py --priority P02

# Générer config P03 (21 plans prioritaires) 
python scripts/analyze_gsheets_data.py --priority P03
```

### **Génération de Projets AE**

#### **v3.0 - Priorités et Configs Personnalisées**
```bash
# Projets prioritaires P02/P03
python tools/after_effects_generator_v2/generate_ae_projects_v3.py --sequence P02_ALL --config ../../config/after_effects_mapping_P02.json
python tools/after_effects_generator_v2/generate_ae_projects_v3.py --sequence P03_ALL --config ../../config/after_effects_mapping_P03.json

# Avec simulation
python tools/after_effects_generator_v2/generate_ae_projects_v3.py --sequence P02_ALL --config ../../config/after_effects_mapping_P02.json --dry-run
```

#### **Séquence individuelle**
```bash
# Générer une séquence spécifique
python scripts/generate_ae_projects_v2.py --sequence SQ01
python scripts/generate_ae_projects_v2.py --sequence SQ23
```

#### **Validation (3 premières séquences)**
```bash
# Générer SQ01, SQ02, SQ03 pour tests
python scripts/generate_ae_projects_v2.py --validation
```

#### **Génération complète**
```bash
# Générer toutes les 28 séquences
python scripts/generate_ae_projects_v2.py --all
```

## 📁 **Structure Générée**

### **Structure de Séquence**
```
SEQUENCES/
└── SQ01/
    ├── _AE/                          # Projets After Effects
    │   ├── SQ01_01.aep              # Projet principal
    │   └── SQ01_generation_script_v2.jsx  # Script de génération
    ├── _EB/                          # Structure EB pour animation
    │   └── UNDLM_00001/
    │       ├── 1_VIDEO-REF/
    │       ├── 2_KEY/
    │       │   ├── HAIR/
    │       │   ├── SKIN/
    │       │   └── _Others/
    │       │       ├── Cloth_1/
    │       │       ├── Cloth_2/
    │       │       ├── Decor_1/
    │       │       ├── Decor_2/
    │       │       ├── LifeJacket/
    │       │       ├── Lips/
    │       │       ├── Pupil/
    │       │       ├── Shadow/
    │       │       └── Silhouettes/
    │       ├── 3_OUT/               # Structure identique à 2_KEY
    │       └── EB_UNDLM_00001.psd   # Template PSD (si disponible)
    └── _PS/                          # Dossier Photoshop
```

### **Structure After Effects**
```
Projet AE:
├── _MASTER/                          # Dossier principal master
│   ├── MASTER_COMP_SEQ/             # Compositions de séquences
│   │   └── SQ01_UNDLM_v001          # Composition master
│   └── MASTER_COMPS_SHOTS/          # Compositions de plans
│       ├── SQ01_UNDLM_00001_v001
│       ├── SQ01_UNDLM_00002_v001
│       └── ...
├── _IN/                              # Sources importées
│   ├── Divers/
│   ├── EB/
│   ├── FROM_EDIT/                   # Sources montage (UHD)
│   ├── FROM_GRADING/                # Sources étalonnées (UHD)
│   ├── PS/
│   └── Ref_Colors/
└── _WORK/                           # Dossiers de travail
    ├── WORK_COMP/
    └── WORK_LAYERS/
        └── BG_SOLID_BLACK           # Solid réutilisable
```

## 🎯 **Fonctionnalités Avancées**

### **Import Intelligent des Sources**
- **Détection automatique** des plans étalonnés
- **Fallback vers Edit** si Graded non disponible
- **Validation d'existence** avant import
- **Organisation dans dossiers** FROM_EDIT / FROM_GRADING

### **Compositions Optimisées**
- **Scaling automatique** UHD (3840x2160) → 1440p (2560x1440)
- **Centrage automatique** des sources
- **Solid de fond réutilisable** (BG_SOLID_BLACK)
- **Durées exactes** depuis CSV Google Sheets
- **Labels colorés** alternés pour identification

### **Composition Master**
- **Assembly temporel** automatique des plans
- **Timecode overlay** avec effet ADBE Timecode
- **Durée calculée** automatiquement
- **Navigation simplifiée** avec noms explicites

### **Scripts JSX Optimisés**
- **Compatible After Effects 2025** (layers.addSolid)
- **Gestion d'erreurs** robuste
- **Statistiques finales** dans popup
- **Log pour intégration** Python
- **Code réutilisable** et maintenable

## 🔧 **Configuration**

### **Chemins de Sources**
```python
# Chemins configurables dans generate_ae_projects_v2.py
from_edit_path = "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS"
from_grading_path = "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS"
sequences_path = "/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES"
template_path = "/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX"
```

### **Mapping des Données**
```json
// config/after_effects_mapping_gsheets.json
{
  "metadata": {
    "source": "RL_O2B_UNDLM_SUIVI_ANIM - SHOTS_TRACK.csv",
    "total_sequences": 28,
    "total_plans": 516,
    "validation_mode": false
  },
  "sequences": {
    "SQ01": {
      "name": "REVEIL HOPITAL - JOUR",
      "plans": [1, 2, 3, ...]
    }
  },
  "plans": {
    "UNDLM_00001": {
      "shot_num": 1,
      "duration_seconds": 5.2,
      "sq_id": "SQ01"
    }
  }
}
```

## 📊 **Métriques de Production**

### **Statistiques Globales**
- **28 projets AE** à créer
- **516 précompositions** individuelles
- **51.9 minutes** de contenu total
- **~1.4 GB** de stockage estimé
- **~56 minutes** de génération estimée

### **Optimisations Implémentées**
- **Solid réutilisable** : -90% de mémoire
- **Import conditionnel** : Graded prioritaire sur Edit
- **Structure template** : Conformité 100% template SQXX
- **Scripts optimisés** : Compatible AE 2025

## 🧪 **Tests et Validation**

### **Tests Unitaires**
```bash
# Tester l'analyse des données
python scripts/analyze_gsheets_data.py --validation

# Tester une séquence
python scripts/generate_ae_projects_v2.py --sequence SQ01 --dry-run

# Validation complète (3 séquences)
python scripts/generate_ae_projects_v2.py --validation
```

### **Validation Manuelle**
1. **Vérifier la structure** EB générée
2. **Importer le script JSX** dans After Effects
3. **Valider les compositions** et sources
4. **Tester le rendu** d'une séquence courte

## 🔄 **Workflow Recommandé**

### **Phase 1 : Validation**
```bash
# 1. Générer le mapping complet
python scripts/analyze_gsheets_data.py

# 2. Tester sur les 3 premières séquences
python scripts/generate_ae_projects_v2.py --validation

# 3. Valider dans After Effects
# Importer et tester SQ01_generation_script_v2.jsx
```

### **Phase 2 : Production Partielle**
```bash
# Générer les séquences prioritaires
python scripts/generate_ae_projects_v2.py --sequence SQ01
python scripts/generate_ae_projects_v2.py --sequence SQ05
python scripts/generate_ae_projects_v2.py --sequence SQ21
# ... autres séquences critiques
```

### **Phase 3 : Production Complète**
```bash
# Générer toutes les séquences restantes
python scripts/generate_ae_projects_v2.py --all
```

## 🆘 **Dépannage**

### **Erreurs Communes**

#### **"Séquence non trouvée dans le mapping"**
```bash
# Régénérer le mapping
python scripts/analyze_gsheets_data.py
```

#### **"Fichier CSV non trouvé"**
- Vérifier que `data/RL_O2B_UNDLM_SUIVI_ANIM - SHOTS_TRACK.csv` existe
- Télécharger depuis Google Sheets si nécessaire

#### **"Impossible de créer la structure EB"**
- Vérifier les permissions sur `/Volumes/resizelab/`
- Contrôler l'espace disque disponible

### **Logs et Debugging**
```bash
# Activer le mode verbose
python scripts/generate_ae_projects_v2.py --sequence SQ01 --verbose

# Vérifier les logs
tail -f logs/ae_generator.log
```

## 📈 **Prochaines Améliorations**

- [ ] **Rendu automatique** des compositions
- [ ] **Export vers Frame.io** intégré
- [ ] **Validation automatique** des projets générés
- [ ] **Templates personnalisables** par séquence
- [ ] **Intégration avec pipeline** principal
- [ ] **Génération batch** optimisée
- [ ] **Support multi-templates** (variantes de SQXX)

## 📄 **Références**

- **[Template SQXX](../templates/SQXX/)** - Structure de référence
- **[Google Sheets Mapping](../config/after_effects_mapping_gsheets.json)** - Configuration des séquences
- **[Scripts JSX](../ae_scripts/)** - Scripts générés pour After Effects
- **[Architecture Pipeline](ARCHITECTURE.md)** - Vue d'ensemble technique

---

**After Effects Generator v2** - Automatisation complète et fiable pour 28 séquences
