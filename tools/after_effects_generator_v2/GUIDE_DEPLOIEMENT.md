# 🎬 Guide de Déploiement Progressif After Effects

## 📋 Vue d'Ensemble

Ce guide vous accompagne pour déployer toutes les séquences After Effects de manière progressive et sécurisée. Nous commençons par tester sur une seule séquence pour valider la méthode, puis déployons l'ensemble.

## 🛠️ Scripts Disponibles

### 1. **Validation Pré-Déploiement**
```bash
python validate_pre_deployment.py
```
Vérifie que tout est prêt avant de commencer.

### 2. **Déploiement Progressif** 
```bash
python deploy_progressive.py
```
Déploie par étapes avec validation entre chaque.

### 3. **Générateur Direct**
```bash
python generate_ae_projects_v2.py --sequence SQ02 --dry-run
```
Génère une séquence spécifique.

## 🚀 Procédure Recommandée

### **Étape 0: Validation Environnement**

```bash
cd tools/after_effects_generator_v2/
python validate_pre_deployment.py
```

**Attendu :** Score ≥ 75% pour continuer

### **Étape 1: Test sur SQ01** ⭐

```bash
# Test simulation
python deploy_progressive.py --stage 1 --dry-run

# Test réel
python deploy_progressive.py --stage 1
```

**Objectif :** Valider que la méthode fonctionne parfaitement sur une séquence représentative

**Note :** SQ02 exclue car actuellement en cours de travail par un graphiste

**Vérifications :**
- ✅ Script `.jsx` généré dans `SEQUENCES/SQ01/_AE/`
- ✅ Structure EB créée dans `SEQUENCES/SQ01/_EB/`
- ✅ Pas d'erreurs lors de l'exécution

### **Étape 2: Validation 3 Séquences**

```bash
# Test simulation
python deploy_progressive.py --stage 2 --dry-run

# Test réel
python deploy_progressive.py --stage 2
```

**Objectif :** S'assurer que la méthode fonctionne sur plusieurs séquences

**Séquences testées :** SQ01, SQ03, SQ04 (SQ02 exclue)

### **Étape 3: Déploiement Complet** 🚀

```bash
# Simulation complète (recommandé d'abord)
python deploy_progressive.py --stage 3 --dry-run

# Déploiement production
python deploy_progressive.py --stage 3
```

**Objectif :** Générer toutes les séquences disponibles (27 séquences, SQ02 exclue)

## 🎯 Mode Interactif (Recommandé)

```bash
python deploy_progressive.py
```

Interface guidée qui vous propose :
- Étape 1 : Test SQ01
- Étape 2 : Validation 3 séquences (SQ01, SQ03, SQ04)
- Étape 3 : Déploiement complet (27 séquences, SQ02 exclue)
- Option 0 : Toutes les étapes en séquence

**⚠️ Important :** SQ02 automatiquement exclue car en cours de travail graphiste

## 📊 Commandes Utiles

### **Test Rapide d'une Séquence**
```bash
# Test SQ01 uniquement
python generate_ae_projects_v2.py --sequence SQ01 --dry-run

# Génération SQ05
python generate_ae_projects_v2.py --sequence SQ05

# ⚠️ Éviter SQ02 (en cours de travail)
```

### **Validation Complète**
```bash
# 3 séquences en simulation (SQ01, SQ03, SQ04)
python generate_ae_projects_v2.py --validation --dry-run

# 3 séquences en production
python generate_ae_projects_v2.py --validation
```

### **Déploiement Batch Complet**
```bash
# Toutes les séquences
python generate_ae_projects_v2.py --all --dry-run
python generate_ae_projects_v2.py --all
```

## 🔍 Vérification des Résultats

### **Fichiers Générés par Séquence**

```
SEQUENCES/SQ01/                        # Exemple séquence (SQ02 exclue)
├── _AE/
│   ├── SQ01_01.aep                    # ⚠️ Sera créé par After Effects
│   └── SQ01_generation_script_v2.jsx  # ✅ Généré par le script
├── _EB/
│   ├── UNDLM_00001/                   # ✅ Structure complète
│   │   ├── 1_VIDEO-REF/
│   │   ├── 2_KEY/HAIR/
│   │   ├── 2_KEY/SKIN/
│   │   ├── 2_KEY/_Others/...
│   │   ├── 3_OUT/                     # Structure identique à 2_KEY
│   │   └── EB_UNDLM_00001.psd
│   └── UNDLM_00002/...
└── _PS/                               # Dossier Photoshop
```

### **Validation After Effects**

Pour tester les scripts générés dans After Effects :

1. **Ouvrir After Effects 2025**
2. **File > Scripts > Run Script File...**
3. **Sélectionner :** `SEQUENCES/SQ01/_AE/SQ01_generation_script_v2.jsx`
4. **Vérifier :** Projet `SQ01_01.aep` créé

## 📈 Métriques de Succès

### **Étape 1 - SQ01**
- ✅ 1 script généré
- ✅ ~15 dossiers EB créés
- ✅ Aucune erreur

### **Étape 2 - Validation**  
- ✅ 3 scripts générés (SQ01, SQ03, SQ04)
- ✅ ~45 dossiers EB créés
- ✅ 100% de réussite

### **Étape 3 - Complet**
- ✅ 27 scripts générés (toutes séquences sauf SQ02)
- ✅ ~505 dossiers EB créés (520 - plans SQ02)
- ✅ ≥95% de réussite attendu

## 🚨 Résolution de Problèmes

### **Erreur : Chemins non trouvés**
```bash
# Vérifier montage LucidLink
ls /Volumes/resizelab/o2b-undllm/

# Re-monter si nécessaire
# Voir instructions LucidLink
```

### **Erreur : Permissions insuffisantes**
```bash
# Vérifier droits d'écriture
touch /Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/test.txt
rm /Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/test.txt
```

### **Erreur : Configuration manquante**
```bash
# Vérifier fichier config
ls -la config/after_effects_mapping_gsheets.json
```

### **Script AE ne s'exécute pas**
- Vérifier After Effects 2025 installé
- Essayer script manuellement dans AE
- Vérifier permissions script (.jsx)

## 📄 Rapports Générés

Les scripts génèrent automatiquement des rapports :

### **Rapports de Validation**
```
tools/after_effects_generator_v2/validation_reports/
├── pre_deployment_validation_20250728_143022.json
└── ...
```

### **Rapports de Déploiement**
```
tools/after_effects_generator_v2/deployment_reports/
├── stage_1_test_20250728_143524.json
├── stage_2_validation_20250728_144122.json
└── stage_3_full_20250728_145933.json
```

## 🎉 Résultat Final Attendu

Après déploiement complet :

- ✅ **27 projets After Effects** prêts à utiliser (SQ02 exclue)
- ✅ **~505 structures EB** complètes pour EbSynth
- ✅ **Double source** Edit + Grading intégrée
- ✅ **Format 1440p** optimisé
- ✅ **Pipeline complet** opérationnel
- ⚠️ **SQ02 préservée** pour le graphiste en cours

## 🔗 Étapes Suivantes

1. **Test manuel** de quelques projets .aep dans After Effects
2. **Formation équipe** sur la nouvelle structure
3. **Intégration workflow** EbSynth
4. **Monitoring production** et optimisations

---

*Guide créé le 28 juillet 2025 - RL PostFlow v4.1.9*
