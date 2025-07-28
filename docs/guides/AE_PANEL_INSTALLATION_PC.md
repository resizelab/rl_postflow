# 🖥️ Guide d'Installation PC - RL PostFlow Panel v1.6.3

> **Script After Effects pour le workflow UNDLM - Spécifique Windows**

## 🎯 Vue d'Ensemble

Le **RL P#### **❌ "Panel non visible dans After Ef### **Spécifiques Windows**

#### **🔒 Problèmes de Permissions**hell
# Vérifier l'installation
dir "C:\Program Files\Adobe\Adobe After Effects 2025\Scripts\ScriptUI Panels\" | findstr RL_PostFlow

# Réinstaller si nécessaire : relancer install_rl_postflow_complete.jsx dans After Effects
```anel** est un script After Effects qui permet de copier automatiquement les plans et séquences du documentaire UNDLM avec les bons réglages et dans la bonne arborescence. Il détecte automatiquement les lettres de lecteur LucidLink sur Windows et gère le versioning intelligent.

### ✅ **Fonctionnalités**
- 📁 **Détection automatique LucidLink** : Trouve `E:\`, `F:\`, `G:\Volumes\resizelab` automatiquement
- 🔄 **Auto-versioning intelligent** : Incrémente automatiquement les versions (v001, v002...)
- 🎬 **Exports multiples** : PNG 8-bits, ProRes LT, ProRes HQ
- 📊 **Interface responsive** : Contrôles de rendu actifs
- 🛠️ **Architecture modulaire** : Compatible Windows + After Effects 2025

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
   E:\Volumes\resizelab\o2b-undllm\2_IN\_ELEMENTS\TOOLS\ae_panel_script\install_rl_postflow_complete.jsx
   ```
   > **Note :** Le script détecte automatiquement LucidLink (E:\, F:\, G:\) et installe tout en une fois

4. **Exécuter et suivre les instructions**

5. **Redémarrer After Effects**

---

## 🎯 Localisation des Fichiers Installés

### **Panel After Effects**
```powershell
# Installation système (priorité)
C:\Program Files\Adobe\Adobe After Effects 2025\Scripts\ScriptUI Panels\RL_PostFlow_Panel.jsx

# ou version 32-bit
C:\Program Files (x86)\Adobe\Adobe After Effects 2025\Scripts\ScriptUI Panels\RL_PostFlow_Panel.jsx

# Fallback User Presets
%USERPROFILE%\Documents\Adobe\After Effects 2025\User Presets\RL_PostFlow_Panel.jsx
```

### **Templates de Rendu**
```powershell
# Output Modules et Render Settings
%USERPROFILE%\Documents\Adobe\After Effects 2025\User Presets\RL PostFlow.aom
%USERPROFILE%\Documents\Adobe\After Effects 2025\User Presets\RL PostFlow.ars
```

### **Vérification Installation**
```powershell
# Vérifier que le panel est installé
dir "C:\Program Files\Adobe\Adobe After Effects 2025\Scripts\ScriptUI Panels\" | findstr RL_PostFlow

# Vérifier les templates
dir "%USERPROFILE%\Documents\Adobe\After Effects 2025\User Presets\" | findstr "RL PostFlow"
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
```powershell
# Structure de travail attendue (adapter la lettre de lecteur)
E:\Volumes\resizelab\o2b-undllm\3_PROJECTS\2_ANIM\SEQUENCES\
├── SQ01\
│   ├── _AE\          # Projets After Effects
│   ├── 1_VIDEO\      # Exports finaux
│   ├── 2_KEY\        # Animation workflow
│   └── 3_OUT\        # Sorties traitées
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
- **Destination** : `2_KEY\SQXX_UNDLM_v001\`
- **Usage** : Animation workflow, rotoscopie, EbSynth

#### **🎥 ProRes LT (WIP)**
- **Résolution** : 2560x1440
- **Codec** : Apple ProRes 422 LT
- **Destination** : `1_VIDEO\SQXX_UNDLM_v001.mov`
- **Usage** : Versions de travail, review client

#### **🎬 ProRes HQ (DEF)**
- **Résolution** : 2560x1440
- **Codec** : Apple ProRes 422 HQ
- **Destination** : `1_VIDEO\SQXX_UNDLM_vDEF.mov`
- **Usage** : Version définitive finale (avec confirmation)

---

## 🔧 Dépannage

### **Erreurs Courantes**

#### **❌ "LucidLink non détecté"**
> **Le script gère automatiquement la détection LucidLink (E:\, F:\, G:\)**
```powershell
# Si problème persistant, vérifier manuellement
dir E:\Volumes\resizelab
dir F:\Volumes\resizelab
dir G:\Volumes\resizelab

# Redémarrer LucidLink si nécessaire via l'application LucidLink Desktop
```

#### **❌ "Panel non visible dans After Effects"**
```powershell
# Vérifier l'installation
dir "C:\Program Files\Adobe\Adobe After Effects 2025\Scripts\ScriptUI Panels\" | findstr RL_PostFlow

# Réinstaller si nécessaire : relancer install_rl_postflow_complete.jsx dans After Effects
```

#### **❌ "Templates de rendu non trouvés"**
```powershell
# Vérifier les templates
dir "%USERPROFILE%\Documents\Adobe\After Effects 2025\User Presets\" | findstr "RL PostFlow"

# Si les templates ne sont pas installés automatiquement :
# Relancer install_rl_postflow_complete.jsx dans After Effects
```

#### **❌ "Erreur de permissions sur exports"**
```powershell
# Vérifier les permissions sur LucidLink
dir E:\Volumes\resizelab\o2b-undllm\3_PROJECTS\2_ANIM\SEQUENCES\

# Exécuter PowerShell en Administrateur si nécessaire
```

#### **❌ "After Effects ne trouve pas les codecs ProRes"**
```powershell
# Installer QuickTime ou les codecs ProRes pour Windows
# Télécharger depuis le site Apple :
# https://support.apple.com/downloads/quicktime

# Alternative : Utiliser un codec pack compatible
```

### **Spécifiques Windows**

#### **� Presets non copiés automatiquement**
```powershell
# Problème fréquent sur Windows : les templates ne se copient pas toujours
# Solution : Copie manuelle des templates

# 1. Créer le dossier s'il n'existe pas
mkdir "%USERPROFILE%\Documents\Adobe\After Effects 2025\User Presets\" -Force

# 2. Copier manuellement les templates depuis LucidLink
copy "E:\Volumes\resizelab\o2b-undllm\2_IN\_ELEMENTS\TOOLS\ae_panel_script\templates\RL PostFlow.aom" "%USERPROFILE%\Documents\Adobe\After Effects 2025\User Presets\"
copy "E:\Volumes\resizelab\o2b-undllm\2_IN\_ELEMENTS\TOOLS\ae_panel_script\templates\RL PostFlow.ars" "%USERPROFILE%\Documents\Adobe\After Effects 2025\User Presets\"

# 3. Vérifier que les fichiers sont bien copiés
dir "%USERPROFILE%\Documents\Adobe\After Effects 2025\User Presets\" | findstr "RL PostFlow"
```

#### **�🔒 Problèmes de Permissions**
```powershell
# Exécuter en tant qu'Administrateur
# Clic droit sur PowerShell > "Exécuter en tant qu'administrateur"

# Vérifier les permissions des dossiers
icacls "C:\Program Files\Adobe\Adobe After Effects 2025\Scripts\ScriptUI Panels\"
```

#### **🚫 Antivirus/Windows Defender**
```powershell
# Ajouter une exception pour le dossier LucidLink
# Windows Security > Virus & threat protection > 
# Manage settings > Add or remove exclusions
# Ajouter : E:\Volumes\resizelab
```

#### **🔄 Variables d'Environnement**
```powershell
# Vérifier les variables PATH pour Python
echo $env:PATH | Select-String python

# Ajouter Python au PATH si nécessaire
```

### **Diagnostic Avancé**

#### **Test de LucidLink**
```powershell
# Test complet de connectivité
cd E:\Volumes\resizelab\o2b-undllm\2_IN\_FROM_EDIT\BY_SHOTS\
dir UNDLM_* | Select-Object -First 10

# Doit afficher les fichiers sources montage
```

#### **Test After Effects**
```powershell
# Vérifier l'installation AE
dir "C:\Program Files\Adobe\Adobe After Effects*"

# Test via ligne de commande (si nécessaire)
& "C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\aerender.exe" -version
```

---

## 📊 Métriques et Performance

### **Temps d'Export Typiques (Windows)**
- **PNG 8-bits** : ~30-60 sec pour 100 frames
- **ProRes LT** : ~45-90 sec pour 1 min de séquence  
- **ProRes HQ** : ~60-120 sec pour 1 min de séquence

### **Optimisations Recommandées**
- **SSD NVMe** : Accélère les exports PNG
- **RAM 32GB+** : Pour les séquences longues
- **GPU RTX/Quadro** : Améliore le rendu AE avec CUDA
- **Ethernet Gigabit** : Optimise les transferts LucidLink
- **Windows 11** : Meilleures performances réseau

---

## 🆘 Support

### **Logs et Diagnostics**
```powershell
# Logs After Effects
dir "%USERPROFILE%\Documents\Adobe\After Effects 2025\Logs\"

# Event Viewer pour diagnostics système
eventvwr.msc
# Chercher dans "Applications and Services Logs"
```

### **Outils de Diagnostic Windows**
```powershell
# Informations système
systeminfo | findstr /B /C:"OS Name" /C:"Total Physical Memory"

# Test de performance disque
winsat disk -drive E:

# Test réseau LucidLink
ping resizelab.com
tracert resizelab.com
```

### **Ressources**
- **Documentation projet** : `E:\Volumes\resizelab\o2b-undllm\2_IN\_ELEMENTS\TOOLS\ae_panel_script\README.md`
- **Configuration** : `config.json` dans le dossier ae_panel_script
- **Templates** : Dossier `templates\` pour Output Modules et Render Settings

---

## 🔧 Configuration Avancée

### **Personnalisation des Chemins**
```json
// Éditer config.json pour adapter à votre configuration
{
  "lucidlink_paths": [
    "E:\\Volumes\\resizelab",
    "F:\\Volumes\\resizelab", 
    "G:\\Volumes\\resizelab"
  ],
  "ae_install_paths": [
    "C:\\Program Files\\Adobe\\Adobe After Effects 2025\\",
    "C:\\Program Files (x86)\\Adobe\\Adobe After Effects 2025\\"
  ]
}
```

### **Optimisation Réseau LucidLink**
```powershell
# Augmenter la taille du cache LucidLink
# Via l'application LucidLink Desktop > Settings > Cache Size
# Recommandé : 50-100 GB pour les projets lourds
```

---

**✅ Version testée et validée :** v1.6.3  
**🖥️ Compatibilité :** Windows / After Effects 2025  
**🔗 Workflow :** RL PostFlow - "Une Nuit dans la Manche"
