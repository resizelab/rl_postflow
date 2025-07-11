# 🎬 Guide de Validation After Effects 2025 - RL PostFlow

## 🎯 État Actuel : ✅ **GÉNÉRATION FONCTIONNELLE**

**Date**: 11 juillet 2025  
**Version**: RL PostFlow v4.1.1  
**Mode**: Validation - **SQ01 VALIDÉE AVEC SUCCÈS**

## ✅ **SUCCÈS VALIDÉ**

### **SQ01 - Génération Réussie** ✅
- ✅ Script `SQ01_generation_script_v2.jsx` exécuté sans erreur
- ✅ Projet `SQ01_01.aep` généré automatiquement
- ✅ 34 plans importés et assemblés
- ✅ Structure conforme au template After Effects
- ✅ Durée 2.9 minutes respectée

### **Arborescence Complète** ✅
```
/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/
├── SQ01/ (REVEIL HOPITAL - JOUR) ✅ **VALIDÉ**
│   ├── _AE/                    # Dossier projets After Effects
│   │   ├── SQ01_generation_script_v2.jsx ✅
│   │   └── SQ01_01.aep ✅ **GÉNÉRÉ**
│   └── _EB/                    # 34 dossiers plans individuels
│       ├── UNDLM_00001/, UNDLM_00002/, ...
│       └── UNDLM_00034/
├── SQ02/ (BUS - FIN DE JOURNEE) ⏳ **PRÊT**
│   ├── _AE/
│   │   └── SQ02_generation_script_v2.jsx ✅
│   └── _EB/                    # 39 dossiers plans individuels
│       ├── UNDLM_00035/, UNDLM_00036/, ...
│       └── UNDLM_00073/
└── SQ03/ (MARCHE - FIN DE JOURNEE) ⏳ **PRÊT**
    ├── _AE/
    │   └── SQ03_generation_script_v2.jsx ✅
    └── _EB/                    # 20 dossiers plans individuels
        ├── UNDLM_00074/, UNDLM_00075/, ...
        └── UNDLM_00093/
        └── 093/
```

### **Scripts ExtendScript Prêts** ✅
```
📂 ae_scripts/ (dans le projet RL PostFlow)
├── RL_PostFlow_SQ01_GENERATION.jsx (56 KB) ✅
├── RL_PostFlow_SQ02_GENERATION.jsx (64 KB) ✅
└── RL_PostFlow_SQ03_GENERATION.jsx (34 KB) ✅
```

## 🚀 Instructions d'Exécution - Équipe

### **Étape 1 : Ouvrir After Effects 2025**
- Lancer After Effects 2025
- S'assurer qu'aucun autre projet n'est ouvert

### **Étape 2 : Exécuter le Script SQ01**
1. **Menu** : `Fichier` > `Scripts` > `Exécuter le fichier de script...`
2. **Naviguer vers** : `/Users/home/Library/CloudStorage/OneDrive-Personnel/WORK/_DEV/rl_postflow/ae_scripts/`
3. **Sélectionner** : `RL_PostFlow_SQ01_GENERATION.jsx`
4. **Cliquer** : `Ouvrir`

### **Étape 3 : Attendre la Génération (2-3 minutes)**
Le script va automatiquement :
- ✅ Créer le projet `SQ01_01.aep`
- ✅ Importer 34 plans depuis `/FROM_EDIT/BY_SHOTS`
- ✅ Détecter plans étalonnés depuis `/FROM_GRADING/BY_SHOTS`
- ✅ Créer précompositions avec switch Edit/Graded
- ✅ Assembler la timeline séquence
- ✅ Sauvegarder le projet

### **Étape 4 : Vérification SQ01**
- **Projet créé** : `/Volumes/resizelab/.../SEQUENCES/SQ01/_AE/SQ01_01.aep`
- **Composition principale** : `SQ01_UNDLM_v001` (durée ~2.9 min)
- **Plans importés** : 34 plans (UNDLM_00001 à UNDLM_00034)
- **Switch fonctionnel** : Tester Edit/Graded sur quelques plans

### **Étape 5 : Répéter pour SQ02**
- Exécuter `RL_PostFlow_SQ02_GENERATION.jsx`
- Vérifier `SQ02_01.aep` (39 plans, ~2.8 min)

### **Étape 6 : Répéter pour SQ03**
- Exécuter `RL_PostFlow_SQ03_GENERATION.jsx`
- Vérifier `SQ03_01.aep` (20 plans, ~2.1 min)

## 🎯 Résultats Attendus

### **3 Projets After Effects Générés**
- ✅ `SQ01_01.aep` - 34 plans - 2.9 minutes
- ✅ `SQ02_01.aep` - 39 plans - 2.8 minutes  
- ✅ `SQ03_01.aep` - 20 plans - 2.1 minutes

### **Total Validation**
- **93 plans importés** (sur 516 total du projet)
- **7.8 minutes** de séquences prêtes
- **Switch Edit/Graded** fonctionnel
- **Structure automatisée** validée

## 🛠️ Structure des Projets Générés

### **Composition Séquence** (ex: SQ01_UNDLM_v001)
```
Timeline SQ01_UNDLM_v001 (1440x1080, 25fps, 2.9min)
├── 📽️ Plan_001 → UNDLM_00001_v001 (5.0s)
├── 📽️ Plan_002 → UNDLM_00002_v001 (5.0s)
├── 📽️ Plan_003 → UNDLM_00003_v001 (5.0s)
└── ... (31 autres plans)
```

### **Dossiers Organisés**
```
📁 SQ01_01.aep
├── 📂 FROM_EDIT/          # Sources montage
│   ├── 🎥 UNDLM_00001.mov
│   ├── 🎥 UNDLM_00002.mov
│   └── ...
├── 📂 FROM_GRADING/       # Sources étalonnées (si disponibles)
│   ├── 🎨 UNDLM_00001_graded.mov
│   └── ...
└── 📦 Precomps/           # Précompositions avec switch
    ├── 🎭 UNDLM_00001_Edit_Precomp
    ├── 🎭 UNDLM_00001_Graded_Precomp
    ├── 🎭 UNDLM_00001_Switch_Precomp
    └── ... (répété pour chaque plan)
```

## 🔧 Fonctionnalités Testées

### **Switch Edit/Graded Automatique**
Chaque plan a 3 précompositions :
1. **Edit_Precomp** : Version montage (toujours disponible)
2. **Graded_Precomp** : Version étalonnée (si fichier trouvé)
3. **Switch_Precomp** : Bascule automatique Edit ↔ Graded

### **Import Intelligent**
- ✅ Détection automatique fichiers montage
- ✅ Détection automatique fichiers étalonnés
- ✅ Fallback sur montage si étalonnage manquant
- ✅ Durées exactes depuis Google Sheets

### **Organisation Automatique**
- ✅ Dossiers structurés par type de source
- ✅ Nomenclature cohérente
- ✅ Timeline assemblée dans l'ordre
- ✅ Sauvegarde automatique

## 📊 Points de Contrôle Validation

### **✅ Vérifications Techniques**
- [ ] Les 3 projets .aep s'ouvrent sans erreur
- [ ] Tous les plans sont importés correctement
- [ ] Les timelines s'assemblent aux bonnes durées
- [ ] Le switch Edit/Graded fonctionne
- [ ] Pas de fichiers manquants signalés

### **✅ Vérifications Métier**
- [ ] La nomenclature respecte les standards RL
- [ ] Les séquences correspondent au montage
- [ ] Les durées sont exactes
- [ ] L'organisation facilite le travail équipe

### **✅ Performance**
- [ ] Génération sous 3 minutes par séquence
- [ ] Projets AE fluides (pas de lags)
- [ ] Fichiers .aep de taille raisonnable (~50MB)

## 🚨 Dépannage

### **Erreur "Fichier non trouvé"**
- Vérifier que le volume `/Volumes/resizelab/` est monté
- Vérifier les chemins sources dans le script

### **After Effects plante**
- Fermer AE complètement avant relance
- Vérifier mémoire disponible (>8GB recommandé)
- Relancer le script individuellement

### **Import échoue**
- Vérifier permissions lecture sur les sources
- Tester import manuel d'un fichier

## 📞 Support

**Contact** : Équipe RL PostFlow  
**Documentation** : `/docs/guides/after-effects-automation.md`  
**Scripts** : `/ae_scripts/` (local) ou `/SEQUENCES/SQxx/_AE/` (réseau)

---

## 🎉 Après Validation Réussie

Une fois les 3 séquences validées :
1. **Déploiement complet** sur les 28 séquences
2. **Intégration pipeline** RL PostFlow
3. **Automatisation notifications** Discord
4. **Formation équipe** sur workflow AE automatisé

**Prochaine étape** : Extension à toutes les séquences (SQ04 → SQ28) avec 423 plans supplémentaires.
