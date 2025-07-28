# 🍎 Guide d'Installation Mac - RL PostFlow Panel v1.6.3

> **Script After Effects pour le workflow UNDLM - Spécifique macOS**

## 🎯 Vue d'Ensemble

Le **RL PostFlow Panel** est un script After Effects qui permet de copier automatiquement les plans et séquences du documentaire UNDLM avec les bons réglages et dans la bonne arborescence. Il détecte automatiquement les chemins LucidLink et gère le versioning intelligent.

### ✅ **Fonctionnalités**
- 📁 **Détection automatique LucidLink** : Trouve `/Volumes/resizelab` automatiquement
- 🔄 **Auto-versioning intelligent** : Incrémente automatiquement les versions (v001, v002...)
- 🎬 **Exports multiples** : PNG 8-bits, ProRes LT, ProRes HQ
- 📊 **Interface responsive** : Contrôles de rendu actifs
- 🛠️ **Architecture modulaire** : Compatible macOS + After Effects 2025

---

## 🛠️ Prérequis

### **Logiciels Requis**
- **After Effects** : Version 2025
- **LucidLink** : Accès au réseau `resizelab` (détection automatique)

---

## 🚀 Installation

### **Installation After Effects (Méthode Unique)**

1. **Ouvrir After Effects 2025**

2. **Menu : File > Scripts > Run Script File...**

3. **Naviguer et sélectionner :**
   ```
   /Volumes/resizelab/o2b-undllm/2_IN/_ELEMENTS/TOOLS/ae_panel_script/install_rl_postflow_complete.jsx
   ```
   > **Note :** Le script détecte automatiquement LucidLink et installe tout en une fois

4. **Exécuter et suivre les instructions**

5. **Redémarrer After Effects**

---

## 🎯 Localisation des Fichiers Installés

### **Panel After Effects**
```bash
# Installation système (priorité)
/Applications/Adobe After Effects 2025/Scripts/ScriptUI Panels/RL_PostFlow_Panel.jsx

# Fallback User Presets
~/Documents/Adobe/After Effects 2025/User Presets/RL_PostFlow_Panel.jsx
```

### **Templates de Rendu**
```bash
# Output Modules et Render Settings
~/Documents/Adobe/After Effects 2025/User Presets/RL PostFlow.aom
~/Documents/Adobe/After Effects 2025/User Presets/RL PostFlow.ars
```

### **Vérification Installation**
```bash
# Vérifier que le panel est installé
ls "/Applications/Adobe After Effects 2025/Scripts/ScriptUI Panels/" | grep RL_PostFlow

# Vérifier les templates
ls ~/Documents/Adobe/After\ Effects\ 2025/User\ Presets/ | grep "RL PostFlow"
```

---

## 🎬 Usage du Panel

### **Activation du Panel**

1. **Ouvrir After Effects**
2. **Si installé dans ScriptUI Panels** : **Menu : Window > RL_PostFlow_Panel.jsx**
3. **Si installé ailleurs** : **Menu : File > Scripts > Run Script File...** puis sélectionner le fichier
4. **Le panel s'affiche dans l'interface**

### **Interface Utilisateur**

#### **Options de Configuration**
- **🔄 Auto-version (détection serveur)** : 
  - ✅ **Activé** (défaut) : Détecte automatiquement les versions existantes
  - ❌ **Désactivé** : Utilise toujours v001 (plus rapide)

#### **Boutons d'Export**
- **📸 PNG 8-bits (Ebsynth)** : Export séquences PNG pour workflow animation
- **🎥 ProRes LT (WIP)** : Export ProRes LT 1440p work-in-progress
- **🎬 ProRes HQ (DEF)** : Export ProRes HQ 1440p version définitive

#### **Contrôles de Rendu**
- **🚀 Start Render** : Lancer la file de rendu
- **⏸️ Pause Render** : Mettre en pause
- **⏹️ Stop Render** : Arrêter le rendu

---

## 📁 Workflow Complet

### **1. Préparation**
```bash
# Structure de travail attendue
/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/
├── SQ01/
│   ├── _AE/          # Projets After Effects
│   ├── 1_VIDEO/      # Exports finaux
│   ├── 2_KEY/        # Animation workflow
│   └── 3_OUT/        # Sorties traitées
```

### **2. Utilisation du Panel**

1. **Ouvrir votre projet AE** avec les compositions UNDLM
2. **Sélectionner** les compositions à exporter dans le Project Panel
3. **Configurer** l'auto-version selon vos besoins :
   - ✅ **Activé** : Pour éviter d'écraser les versions existantes
   - ❌ **Désactivé** : Pour des exports rapides en dev
4. **Choisir le format d'export** selon l'étape :
   - **PNG 8-bits** : Pour animation/rotoscopie (workflow EbSynth)
   - **ProRes LT** : Pour versions WIP et review
   - **ProRes HQ** : Pour version définitive finale

### **3. Formats d'Export Détaillés**

#### **📸 PNG 8-bits (Ebsynth)**
- **Résolution** : 2560x1440
- **Frame Rate** : 12.5 fps (optimisé pour animation)
- **Destination** : `2_KEY/SQXX_UNDLM_v001/`
- **Usage** : Animation workflow, rotoscopie, EbSynth

#### **🎥 ProRes LT (WIP)**
- **Résolution** : 2560x1440
- **Codec** : Apple ProRes 422 LT
- **Destination** : `1_VIDEO/SQXX_UNDLM_v001.mov`
- **Usage** : Versions de travail, review client

#### **🎬 ProRes HQ (DEF)**
- **Résolution** : 2560x1440
- **Codec** : Apple ProRes 422 HQ
- **Destination** : `1_VIDEO/SQXX_UNDLM_vDEF.mov`
- **Usage** : Version définitive finale (avec confirmation)

---

## 🔧 Dépannage

### **Erreurs Courantes**

#### **❌ "LucidLink non détecté"**
> **Le script gère automatiquement la détection LucidLink**
```bash
# Si problème persistant, redémarrer LucidLink
lucid restart
# ou vérifier manuellement
ls /Volumes/resizelab
```

#### **❌ "Panel non visible dans After Effects"**
```bash
# Vérifier l'installation
ls "/Applications/Adobe After Effects 2025/Scripts/ScriptUI Panels/RL_PostFlow_Panel.jsx"

# Réinstaller si nécessaire : relancer install_rl_postflow_complete.jsx dans After Effects
```

#### **❌ "Templates de rendu non trouvés"**
```bash
# Vérifier les templates
ls ~/Documents/Adobe/After\ Effects\ 2025/User\ Presets/ | grep "RL PostFlow"

# Réinstaller les templates
# Relancer install_rl_postflow_complete.jsx dans After Effects
```

#### **❌ "Erreur de permissions sur exports"**
```bash
# Vérifier les permissions sur LucidLink
ls -la /Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/

# Corriger les permissions si nécessaire
chmod -R 755 /Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/
```

### **Diagnostic Avancé**

#### **Test de LucidLink**
```bash
# Test complet de connectivité
cd /Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/
ls UNDLM_* | head -10

# Doit afficher les fichiers sources montage
```

#### **Test After Effects**
```bash
# Vérifier l'installation AE
ls /Applications/Adobe*After*Effects*/Adobe*After*Effects*.app

# Test via ligne de commande (si nécessaire)
"/Applications/Adobe After Effects 2025/aerender" -version
```

---

## 📊 Métriques et Performance

### **Temps d'Export Typiques (macOS)**
- **PNG 8-bits** : ~30-60 sec pour 100 frames
- **ProRes LT** : ~45-90 sec pour 1 min de séquence  
- **ProRes HQ** : ~60-120 sec pour 1 min de séquence

### **Optimisations Recommandées**
- **SSD rapide** : Accélère les exports PNG
- **RAM 32GB+** : Pour les séquences longues
- **GPU récent** : Améliore le rendu AE
- **Ethernet Gigabit** : Optimise les transferts LucidLink

---

## 🆘 Support

### **Logs et Diagnostics**
```bash
# Logs After Effects
~/Documents/Adobe/After Effects 2025/Logs/

# Vérifier la console système pour LucidLink
Console.app > Rechercher "lucid"
```

### **Ressources**
- **Documentation projet** : `/Volumes/resizelab/o2b-undllm/2_IN/_ELEMENTS/TOOLS/ae_panel_script/README.md`
- **Configuration** : `config.json` dans le dossier ae_panel_script
- **Templates** : Dossier `templates/` pour Output Modules et Render Settings

---

**✅ Version testée et validée :** v1.6.3  
**🖥️ Compatibilité :** macOS / After Effects 2025  
**🔗 Workflow :** RL PostFlow - "Une Nuit dans la Manche"
