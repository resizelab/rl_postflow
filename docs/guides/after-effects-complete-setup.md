# 🎬 After Effects Auto-Generator - RL PostFlow

## 📋 Vue d'Ensemble

Système complet de génération automatique de projets After Effects pour le pipeline RL PostFlow, avec support des plans montage (FROM_EDIT) et plans étalonnés (FROM_GRADING).

## 🎯 Fonctionnalités

### ✨ **Génération Automatique**
- **25 séquences** (SQ01-SQ25) avec **520 plans** total
- **Projets AE complets** : compositions, précomps, timeline assemblée
- **Double source** : Plans montage + Plans étalonnés (quand disponibles)
- **Système de switch** intelligent Edit ↔ Graded
- **Format professionnel** : 1440p, 25fps, timecode correct

### 🏗️ **Architecture Générée**

```
📁 SQ01/
├── 📄 SQ01_01.aep                       # Projet After Effects
│   ├── 🎬 SQ01_UNDLM_v001               # Composition séquence (timeline)
│   │   ├── 📽️ Plan_001_UNDLM_00001     # Layer plan 1
│   │   ├── 📽️ Plan_002_UNDLM_00002     # Layer plan 2
│   │   └── 📽️ Plan_XXX_UNDLM_00XXX     # ... autres plans
│   ├── 📂 FROM_EDIT/                    # Dossier sources montage
│   │   ├── 🎥 UNDLM_00001_edit.mov      # Plans depuis BY_SHOTS
│   │   └── 🎥 UNDLM_00XXX_edit.mov
│   ├── 📂 FROM_GRADING/                 # Dossier sources étalonnées
│   │   ├── 🎨 UNDLM_00001_graded.mov    # Plans étalonnés (si disponibles)
│   │   └── 🎨 UNDLM_00XXX_graded.mov
│   └── 📦 Precomps/                     # Précompositions
│       ├── 🎭 SQ01_UNDLM_00001_v001     # Précomp plan 1
│       │   ├── 🎬 EDIT_Source           # Layer montage
│       │   ├── 🎨 GRADED_Source         # Layer étalonné (si disponible)
│       │   └── 🎛️ SWITCH_CONTROL        # Contrôle Edit/Graded
│       └── 🎭 SQ01_UNDLM_00XXX_v001     # ... autres précomps
└── 📁 _EB/                              # Dossiers EbSynth (séparé)
    ├── UNDLM_00001/
    └── UNDLM_00XXX/
```

## 🚀 Utilisation

### **1. Lister les Séquences**
```bash
python scripts/generate_ae_projects.py --list
```

### **2. Générer une Séquence (Test)**
```bash
# Mode dry-run (génère le script seulement)
python scripts/generate_ae_projects.py --sequence SQ01 --dry-run

# Mode production (exécute dans After Effects)
python scripts/generate_ae_projects.py --sequence SQ01
```

### **3. Générer Toutes les Séquences**
```bash
# Test complet
python scripts/generate_ae_projects.py --all --dry-run

# Production complète
python scripts/generate_ae_projects.py --all
```

## 📊 Workflow de Production

### **Phase 1 : Plans Montage** 📝
1. **Import FROM_EDIT** : Tous les plans montage sont importés
2. **Précomps créées** : Une précomp par plan avec contrôles
3. **Assembly timeline** : Séquence assemblée selon les données shots.csv
4. **Switch = Edit** : Mode montage par défaut

### **Phase 2 : Plans Étalonnés** 🎨
1. **Plans étalonnés arrivent** dans `/FROM_GRADING/BY_SHOTS/`
2. **Re-génération** : Le script détecte automatiquement les nouveaux plans
3. **Import FROM_GRADING** : Plans étalonnés ajoutés aux précomps
4. **Switch = Graded** : Basculement automatique vers étalonnés

### **Phase 3 : Contrôle Manual** 🎛️
- **Slider "Edit_Graded_Switch"** sur chaque précomp
- **0 = Mode Edit** (plan montage)
- **1 = Mode Graded** (plan étalonné)
- **Expression automatique** pour switch seamless

## 🔧 Configuration

### **Chemins Sources**
```python
FROM_EDIT_PATH = "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS"
FROM_GRADING_PATH = "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS"
SEQUENCES_PATH = "/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES"
```

### **Format After Effects**
```javascript
// Composition Plan
width: 1440px
height: 1080px  
framerate: 25fps
duration: auto (basé sur données shots.csv)

// Composition Séquence  
width: 1440px
height: 1080px
framerate: 25fps
duration: sum(plans_duration)
```

## 📋 Données Sources

### **shots.csv Structure**
```csv
PLAN,SEQUENCE,NOMENCLATURE PLAN,TC IN,TC OUT,DURÉE,...
001,REVEIL HOPITAL - JOUR,UNDLM_00001,00:00:01:03,00:00:10:06,00:00:09:03,...
002,REVEIL HOPITAL - JOUR,UNDLM_00002,00:00:10:06,00:00:15:05,00:00:04:24,...
```

### **Mapping Automatique**
- **SQ01** → "REVEIL HOPITAL - JOUR" (17 plans)
- **SQ02** → "FLASHBACK 1 - NUIT AMERICAINE" (12 plans)
- **SQ03** → "GENERIQUE + CARTONS ENTRE CHIEN ET LOUP" (5 plans)
- **...** → 22 autres séquences
- **SQ25** → "GENERIQUE DE FIN" (10 plans)

## 🛠️ Scripts Techniques

### **generate_ae_projects.py**
```python
# Générateur principal After Effects
AfterEffectsGenerator().generate_sequence("SQ01")

# Fonctions clés :
- check_graded_plans_availability()  # Détecte plans étalonnés
- generate_ae_script()               # Crée ExtendScript
- execute_ae_script()                # Exécute dans AE
```

### **analyze_shots_data.py**
```python
# Analyse des données shots.csv
analyze_shots_data()

# Génère :
- after_effects_mapping.json         # Configuration séquences/plans
- Rapport détaillé                   # Statistiques et validation
```

## 🎛️ Contrôles After Effects

### **Switch Edit/Graded**
```javascript
// Expression automatique sur chaque layer source
var switchValue = thisComp.layer("SWITCH_CONTROL").effect("Edit_Graded_Switch")("Slider");
if (switchValue > 0.5) {
    thisLayer.enabled = (thisLayer.name == "GRADED_Source");
} else {
    thisLayer.enabled = (thisLayer.name == "EDIT_Source");
}
```

### **Organisation Projet**
- **Couleurs de labels** : Plans alternés pour identification rapide
- **Nommage cohérent** : `Plan_XXX_UNDLM_XXXXX`
- **Dossiers organisés** : Sources séparées par type
- **Précomps centralisées** : Toutes dans dossier "Precomps"

## 📈 Métriques

| Statistique | Valeur |
|-------------|--------|
| **Séquences** | 25 |
| **Plans total** | 520 |
| **Projets AE** | 25 (.aep files) |
| **Précomps** | 520 |
| **Sources Edit** | 520 |
| **Sources Graded** | Variable (selon étalonage) |

## ✅ Validation

### **Tests Automatiques**
```bash
# Validation structure générée
python scripts/validate_ae_deployment.py

# Tests de compatibilité
python scripts/test_ae_projects.py --sequence SQ01
```

### **Contrôles Manuels**
- [ ] Projet AE s'ouvre sans erreur
- [ ] Tous les plans sont importés
- [ ] Timeline de séquence correcte
- [ ] Switch Edit/Graded fonctionne
- [ ] Durées des plans conformes aux données

## 🔗 Intégration Pipeline

### **Discord Notifications**
```python
# Intégration avec système notifications
from src.integrations.discord.notifier import DiscordNotifier

notifier.send_message(f"🎬 Séquence {sequence_id} générée avec succès!")
```

### **Frame.io Upload**
```python
# Upload automatique vers Frame.io après rendu
from src.integrations.frameio.uploader import FrameioUploader

uploader.upload_sequence(sequence_id, rendered_files)
```

## 🚨 Dépannage

### **Erreurs Communes**
```bash
# After Effects non trouvé
❌ After Effects non trouvé. Exécutez manuellement le script

# Plans manquants
❌ ERREUR: Plan EDIT manquant - UNDLM_00XXX.mov

# Permissions
❌ Erreur sauvegarde : Permissions insuffisantes
```

### **Solutions**
```bash
# Vérifier installation AE
ls /Applications/Adobe*After*Effects*/aerender

# Vérifier plans sources
ls /Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/

# Vérifier permissions
chmod -R 755 /Volumes/resizelab/o2b-undllm/3_PROJECTS/
```

## 📚 Documentation

- **[Guide After Effects Automation](docs/guides/after-effects-automation.md)** - Guide technique complet
- **[Plan de Déploiement](docs/AFTER_EFFECTS_DEPLOYMENT_PLAN.md)** - Roadmap et stratégie
- **[Scripts Reference](scripts/)** - Documentation des scripts

---

## 🎉 Résultats

**✅ Système Complet et Opérationnel**
- **Génération automatique** de 25 projets After Effects
- **Support double source** Edit + Grading
- **Pipeline intégré** avec RL PostFlow
- **Scripts validés** et prêts pour production
- **Documentation complète** pour maintenance

*🎬 Prêt pour déploiement en production !*
