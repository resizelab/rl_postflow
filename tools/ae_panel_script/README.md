# 🎬 RL PostFlow Panel - After Effects 2025

Panel d'export automatique pour le workflow RL PostFlow avec détection intelligente des chemins LucidLink et gestion automatique du versioning.

**✅ Version 1.6.0** - Auto-versioning avec renommage de composition et application correcte des templates

## 🚀 Installation

### 🐍 **Déploiement automatique (Recommandé)**
```bash
python deploy_rl_postflow.py
```
Installe automatiquement le panel et les templates sur toutes les plateformes.

### 🎯 **Installation manuelle After Effects**
1. Ouvrir After Effects
2. `File > Scripts > Run Script File...`
3. Sélectionner `install_rl_postflow_complete.jsx`
4. Redémarrer After Effects

## 📂 Fichiers Principaux

| Fichier | Description |
|---------|-------------|
| `RL_PostFlow_Panel.jsx` | **Panel principal** - Interface utilisateur avec auto-versioning |
| `deploy_rl_postflow.py` | **Déploiement automatique** - Installation complète multi-plateformes |
| `install_rl_postflow_complete.jsx` | **Installation After Effects** - Installer complet avec templates |
| `config.json` | **Configuration** - Formats d'export et chemins |
| `templates/RL PostFlow.aom` | **Output Modules** - Templates PNG 8-bits et ProRes LT/HQ |
| `templates/RL PostFlow.ars` | **Render Settings** - Templates PNG 12.5 fps et ProRes |

## 🎯 Interface Utilisateur

### Options
- **🔄 Auto-version (détection serveur)** : Case à cocher pour contrôler le versioning
  - ✅ **Activé** (défaut) : Détecte les versions existantes et incrémente automatiquement
  - ❌ **Désactivé** : Utilise toujours v001 (plus rapide, risque d'écrasement)

### Boutons d'Export
- **📸 PNG 8-bits (Ebsynth)** : Export séquences PNG pour Ebsynth
- **🎥 ProRes LT (WIP)** : Export ProRes LT 1440p work-in-progress 
- **🎬 ProRes HQ (DEF)** : Export ProRes HQ 1440p version définitive (avec confirmation)

### Workflow
1. **Sélectionner** compositions dans le Project Panel
2. **Configurer** auto-version selon besoin
3. **Choisir** le format d'export
4. **Confirmer** l'export DEF si nécessaire  
5. **Lancer** la file de rendu avec 🚀

## 🛠️ **Nouveautés v1.6.0**

### ✅ **Auto-Versioning Intelligent**
- **Scan serveur** : Détecte automatiquement les versions existantes
- **Incrémentation** : Calcule la prochaine version (v001 → v002 → v003...)
- **Renommage composition** : Met à jour automatiquement le nom de la composition
- **Mode manuel** : Option pour désactiver l'auto-versioning

### ✅ **Templates RL PostFlow**
- **Render Settings** : "PNG 12.5 fps RL PostFlow" appliqué en premier
- **Output Modules** : "PNG 8-bits RL PostFlow" et "ProRes LT/HQ RL PostFlow"
- **Ordre correct** : Templates appliqués dans le bon ordre pour éviter les conflits

### ✅ **Déploiement Automatisé**
- **Installation complète** : Panel + templates en une commande Python
- **Cross-platform** : Détection automatique Windows/macOS
- **Validation** : Vérification de l'installation et des fichiers

### ✅ **Gestion des Chemins**
- **PNG** : Export vers 3_PROJECTS/2_ANIM/SEQUENCES/_EB structure
- **ProRes** : Export vers 4_OUT/2_FROM_ANIM avec routing _ALL pour séquences
- **Détection intelligente** : Distinction séquence vs plan automatique

### ✅ **Formats**
- **Tout en 1440p** : ProRes LT et HQ en 2560x1440 (plus de 1080p)
- **Configuration manuelle** : Plus de dépendance aux templates After Effects
- **Support templates séquence** : `SQ02_UNDLM_v001` automatiquement reconnu
- **Auto-versioning** : Case à cocher pour contrôler l'incrémentation des versions

### 🔄 **Auto-Versioning**
- **Mode activé** (défaut) : Scan du serveur, détection versions existantes, incrémentation automatique
- **Mode désactivé** : Toujours v001, plus rapide, risque d'écrasement
- **Versions DEF** : Toujours vDEF, non affectées par l'auto-version
- **Logs détaillés** : Affichage des versions détectées et de la prochaine version

### 🏗️ **Architecture Modulaire**
- **Utils** : Utilitaires de base (logs, parsing, padZeros compatible AE)
- **VersionManager** : Gestion automatique des versions
- **LucidLinkDetector** : Détection multi-plateforme des chemins
- **PathManager** : Construction et validation des chemins d'export
- **CompositionManager** : Gestion des sélections de compositions
- **ExportManager** : Configuration manuelle PNG/ProRes (exportProResDEF)
- **UIManager** : Interface utilisateur et événements
- **App** : Application principale et initialisation

## 📁 **Structure Exports**

Le panel gère deux types d'exports avec chemins automatiques :

### **🎨 Export Animation (PNG 8-bits)**
```
PROJECT/SEQUENCES/SQ01/_EB/UNDLM_00001/
└── 1_VIDEO/                    ← PNG 8-bits (padding checker)
    ├── UNDLM_00001_v001_%04d.png
    └── UNDLM_00001_v002_%04d.png
```

### **🎬 Export Final (ProRes)**
```
E:\Volumes\resizelab\o2b-undllm\4_OUT\2_FROM_ANIM\
├── SQ01\
│   ├── UNDLM_00001\            ← Plans individuels
│   │   ├── UNDLM_00001_v001.mov    (ProRes LT - WIP)
│   │   ├── UNDLM_00001_v002.mov    (ProRes LT - WIP)
│   │   └── UNDLM_00001_vDEF.mov    (ProRes HQ - Final validé)
│   └── _ALL\                   ← Séquences complètes
│       ├── SQ01_v001.mov       (ProRes LT - WIP)
│       └── SQ01_vDEF.mov       (ProRes HQ - Final validé)
```

## ⚙️ **Configuration**

Le panel s'adapte automatiquement au projet ouvert et :
- **Détecte la séquence** en cours (SQ01, SQ02...)
- **Identifie les plans** UNDLM_XXXXX
- **Configure les chemins d'export** selon la structure EB

## 🎬 **Workflow Animation Complet**

Pipeline intégré avec assembly et compositing :

1. **🎬 After Effects** → Export PNG 1440p (panel) → `1_VIDEO/`
2. **🎨 Photoshop/AE** → Animation dans `2_KEY/` (workflow mixte)
3. **🤖 EbSynth** → Track intelligent → `3_OUT/`
4. **🎭 After Effects** → Assembly + Comp (textures, fx) → Export ProRes wip pour review et final si validé

### **📊 Formats d'Export**
- **PNG 1440p** : Animation workflow (padding checker)
- **ProRes LT 1080p** : Versions WIP (v001, v002...)
- **ProRes HQ 1440p** : Version définitive (vDEF)

## 🔧 **Compatibilité**

### ✅ **Testé et Validé**
- **macOS** : Sonoma 14+ / After Effects 2025
- **Windows** : Windows 10/11 / After Effects 2025
- **LucidLink** : Détection automatique des lettres de lecteur (Windows)

### 🛠️ **Prérequis**
- After Effects 2025+
- Accès au réseau LucidLink resizelab
- Structure projet conforme RL PostFlow

---

**Version :** 0.1.1  
**Compatibilité :** After Effects 2025+  
**Workflow :** RL PostFlow - "Une Nuit dans la Manche"
