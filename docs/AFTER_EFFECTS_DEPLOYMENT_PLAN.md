# 🎬 Plan de Déploiement After Effects Templates

## 📋 Vue d'Ensemble

**Objectif** : Déployer automatiquement la structure de templates After Effects depuis `/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX` vers `/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES` en créant tous les dossiers de séquences et plans nécessaires.

## 🔍 Analyse de la Structure Actuelle

### 📁 Template Source (SQXX)
```
SQXX/
├── _AE/
│   └── SQXX_01.aep                    # Template After Effects
├── _EB/                               # EbSynth
│   └── UNDLM_00XXX/                   # Template plan
│       ├── 1_VIDEO-REF/               # Référence vidéo
│       ├── 2_KEY/                     # Clés EbSynth (INPUT)
│       │   ├── _Others/               # Autres éléments
│       │   │   ├── Cloth_1/
│       │   │   ├── Cloth_2/
│       │   │   ├── Decor_1/
│       │   │   ├── Decor_2/
│       │   │   ├── LifeJacket/
│       │   │   ├── Lips/
│       │   │   ├── Pupil/
│       │   │   ├── Shadow/
│       │   │   └── Silhouettes/
│       │   ├── HAIR/                  # Cheveux
│       │   └── SKIN/                  # Peau
│       ├── 3_OUT/                     # Sortie EbSynth (OUTPUT - même structure que 2_KEY)
│       │   ├── _Others/               # Autres éléments (sortie)
│       │   │   ├── Cloth_1/
│       │   │   ├── Cloth_2/
│       │   │   ├── Decor_1/
│       │   │   ├── Decor_2/
│       │   │   ├── LifeJacket/
│       │   │   ├── Lips/
│       │   │   ├── Pupil/
│       │   │   ├── Shadow/
│       │   │   └── Silhouettes/
│       │   ├── HAIR/                  # Cheveux (sortie)
│       │   └── SKIN/                  # Peau (sortie)
│       └── EB_UNDLM_00XXX.psd         # Template Photoshop
└── _PS/                               # Photoshop (vide)
```

### 🎯 Patterns Identifiés

| Pattern | Description | Remplacement |
|---------|-------------|--------------|
| `SQXX` | Numéro de séquence | `SQ01`, `SQ02`, `SQ03`... |
| `00XXX` | Numéro de plan sur 5 chiffres | `00001`, `00002`, `00003`... |
| `XXX` | Numéro de plan sur 3 chiffres | `001`, `002`, `003`... |

## 📊 Analyse des Données du Projet

### Données CSV (shots.csv - 516 plans)
- **Plans totaux** : 001 à 516 (UNDLM_00001 à UNDLM_00516)
- **Séquences identifiées** :
  - REVEIL HOPITAL - JOUR
  - FLASHBACK 1 - NUIT AMERICAINE
  - GENERIQUE + CARTONS ENTRE CHIEN ET LOUP
  - *(Et d'autres à analyser...)*

### 🎬 Mapping Séquences Préliminaire
```python
sequences = {
    "SQ01": "REVEIL HOPITAL - JOUR",
    "SQ02": "FLASHBACK 1 - NUIT AMERICAINE", 
    "SQ03": "GENERIQUE + CARTONS ENTRE CHIEN ET LOUP",
    # ... À compléter après analyse complète
}
```

## 🛠️ Plan de Déploiement

### Phase 1 : Analyse et Préparation 🔍

#### 1.1 Script d'Analyse
```python
# scripts/analyze_sequences_and_shots.py
- Analyser shots.csv pour extraire toutes les séquences uniques
- Compter le nombre de plans par séquence
- Générer le mapping séquences SQ01, SQ02, etc.
- Créer un rapport détaillé
```

#### 1.2 Validation des Données
- ✅ Vérifier la cohérence des données CSV
- ✅ Identifier les doublons et plans spéciaux
- ✅ Valider la nomenclature UNDLM_XXXXX

### Phase 2 : Génération des Scripts 🚀

#### 2.1 Script de Déploiement Principal
```python
# scripts/deploy_after_effects_structure.py
- Copie du template SQXX vers chaque séquence
- Renommage automatique des patterns
- Création des dossiers par plan dans _EB/
- Gestion des erreurs et logs détaillés
```

#### 2.2 Fonctionnalités Clés
- **Renommage intelligent** : SQXX → SQ01, SQ02...
- **Création batch** : Tous les plans d'une séquence
- **Préservation structure** : Dossiers _AE, _EB, _PS
- **Logs complets** : Traçabilité des opérations

### Phase 3 : Déploiement et Validation ✅

#### 3.1 Tests de Validation
```bash
# Validation structure générée
python scripts/validate_deployment.py
- Vérifier toutes les séquences créées
- Contrôler la structure des dossiers plans
- Valider les renommages de fichiers
```

#### 3.2 Rapport Final
- Nombre de séquences créées
- Nombre de plans par séquence
- Espace disque utilisé
- Temps de traitement

## 🗺️ Roadmap Détaillée

### 🎯 Étape 1 : Analyse des Données (30 min)
- [ ] Créer `scripts/analyze_shots_data.py`
- [ ] Extraire toutes les séquences uniques du CSV
- [ ] Mapper SQ01-SQ25 avec les noms de séquences
- [ ] Compter les plans par séquence
- [ ] Générer rapport d'analyse

### 🎯 Étape 2 : Script de Déploiement (45 min)
- [ ] Créer `scripts/deploy_ae_templates.py`
- [ ] Fonction de copie template SQXX
- [ ] Fonction de renommage patterns (SQXX, 00XXX, XXX)
- [ ] Création automatique dossiers plans dans _EB/
- [ ] Gestion erreurs et logging

### 🎯 Étape 3 : Tests et Validation (30 min)
- [ ] Test sur 1 séquence pilote (SQ01)
- [ ] Validation structure générée
- [ ] Correction bugs éventuels
- [ ] Test complet sur toutes séquences

### 🎯 Étape 4 : Déploiement Production (15 min)
- [ ] Exécution script complet
- [ ] Monitoring en temps réel
- [ ] Validation finale
- [ ] Documentation post-déploiement

## 📋 Spécifications Techniques

### Structure Cible par Séquence
```
SEQUENCES/
├── SQ01/                              # REVEIL HOPITAL - JOUR
│   ├── _AE/
│   │   └── SQ01_01.aep
│   ├── _EB/
│   │   ├── UNDLM_00001/              # Plan 001
│   │   ├── UNDLM_00002/              # Plan 002
│   │   ├── UNDLM_00003/              # Plan 003
│   │   └── ...
│   └── _PS/
├── SQ02/                              # FLASHBACK 1 - NUIT AMERICAINE
│   ├── _AE/
│   │   └── SQ02_01.aep
│   ├── _EB/
│   │   ├── UNDLM_00004/              # Premier plan de SQ02
│   │   ├── UNDLM_00005/
│   │   └── ...
│   └── _PS/
└── ...
```

### Règles de Renommage
1. **Dossier séquence** : `SQXX` → `SQ01`, `SQ02`, etc.
2. **Fichier AE** : `SQXX_01.aep` → `SQ01_01.aep`, `SQ02_01.aep`
3. **Dossier plan** : `UNDLM_00XXX` → `UNDLM_00001`, `UNDLM_00002`
4. **Fichier PSD** : `EB_UNDLM_00XXX.psd` → `EB_UNDLM_00001.psd`

## ⚠️ Précautions et Risques

### Risques Identifiés
- **Espace disque** : Duplication massive de templates
- **Performance** : Opérations I/O intensives sur NAS
- **Erreurs réseau** : Connexion intermittente volume réseau
- **Cohérence données** : Plans manquants ou mal référencés

### Mesures de Sécurité
- **Backup préalable** : Sauvegarde template source
- **Mode test** : Déploiement sur 1 séquence d'abord
- **Logs détaillés** : Traçabilité complète des opérations
- **Validation** : Contrôles post-déploiement

## 📈 Métriques Attendues

| Métrique | Estimation |
|----------|------------|
| **Séquences** | ~25 |
| **Plans** | 516 |
| **Dossiers créés** | ~25 séquences + 516 plans = 541 |
| **Fichiers copiés** | ~516 × 5 = 2580 |
| **Espace disque** | ~10-50 GB |
| **Temps traitement** | 15-30 minutes |

## 🚀 Commandes de Lancement

```bash
# 1. Test génération (mode dry-run)
python scripts/generate_ae_projects_v2.py --validation --dry-run

# 2. Génération des 3 premières séquences (FAIT ✅)
python scripts/generate_ae_projects_v2.py --validation

# 3. Génération d'une séquence spécifique
python scripts/generate_ae_projects_v2.py --sequence SQ04

# 4. Déploiement complet des 28 séquences restantes
python scripts/generate_ae_projects_v2.py --all

# 5. Validation de la structure créée
ls -la "/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/"
```

## ✅ Critères de Validation

### Validation Réussie Si :
- [ ] Toutes les séquences identifiées sont créées
- [ ] Chaque séquence contient la bonne structure (_AE, _EB, _PS)
- [ ] Tous les plans de chaque séquence ont leur dossier dans _EB/
- [ ] Les renommages sont corrects (SQXX→SQ01, 00XXX→00001)
- [ ] Aucune erreur dans les logs de déploiement
- [ ] Structure validée par script de contrôle

---

## 🤝 Points de Validation Équipe

### ✅ Analyse Terminée
- [x] **Mapping séquences** : 25 séquences identifiées (SQ01-SQ25)
- [x] **Plans par séquence** : 520 plans répartis automatiquement
- [x] **Nomenclature** : UNDLM_XXXXX validé comme standard
- [x] **Structure template** : SQXX analysé et patterns identifiés (24 dossiers, 2 fichiers)
- [x] **Configuration JSON** : Mapping complet généré

### 📊 Données Validées
- **SQ01** : REVEIL HOPITAL - JOUR (34 plans : #1-34)
- **SQ02** : FLASHBACK 1 - NUIT AMERICAINE (39 plans : #35-73)
- **SQ03** : GENERIQUE + CARTONS ENTRE CHIEN ET LOUP (20 plans : #74-93)
- **...** : 22 autres séquences identifiées
- **Total** : 25 séquences, 520 plans

### 🛠️ Scripts Développés
- [x] **generate_ae_projects_v2.py** : Générateur automatique complet
- [x] **create_eb_structure_for_plans()** : Création structure EB avec nouvelle arborescence
- [x] **copy_ae_template()** : Copie intelligente des templates AE

### 🎯 DÉPLOIEMENT RÉALISÉ (11/07/2025)
- [x] **SQ01** : ✅ COMPLET - 34 plans + structure EB + template AE
- [x] **SQ02** : ✅ COMPLET - 39 plans + structure EB + template AE  
- [x] **SQ03** : ✅ COMPLET - 20 plans + structure EB + template AE
- [x] **Scripts ExtendScript** : Générés avec addSolid compatible AE 2025
- [x] **Adjustment Layer TC** : Intégré dans compositions master

### 🚀 Prochaines Étapes OPÉRATIONNELLES
1. **✅ FAIT** : Tests sur SQ01, SQ02, SQ03 
2. **SUIVANT** : Déploiement 28 séquences restantes : `python scripts/generate_ae_projects_v2.py --all`
3. **SUIVANT** : Validation complète des scripts AE générés
4. **SUIVANT** : Tests finaux sur pipeline production

---

*📝 Document créé le 10/07/2025 - Version 1.0*
*🎬 Projet : RL PostFlow v4.1.1 - After Effects Templates Deployment*
