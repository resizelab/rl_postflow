# 🎬 Guide: Automatisation After Effects - RL PostFlow v4.1.1

## 🎯 État Actuel du Projet (Juillet 2025)

### ✅ **DÉVELOPPEMENTS TERMINÉS**

1. **Analyse Google Sheets** - `scripts/analyze_gsheets_data.py`
   - Parsing du CSV SHOTS_TRACK.csv depuis Google Sheets
   - Extraction automatique des séquences (SQ01-SQ28) et plans (516 au total)
   - Support mode validation (3 premières séquences : SQ01, SQ02, SQ03)
   - Génération mapping JSON pour After Effects

2. **Générateur ExtendScript** - `scripts/generate_ae_projects.py`
   - Génération dynamique de scripts .jsx pour After Effects
   - Support Edit + Graded avec switch automatique
   - Mode dry-run pour validation des scripts
   - Mode validation pour les 3 premières séquences

3. **Scripts ExtendScript Fonctionnels**
   - Scripts .jsx générés et validés pour SQ01, SQ02, SQ03
   - Import automatique des plans montage/étalonnés
   - Création précompositions avec switch Edit/Graded
   - Assembly timeline automatique
   - Sauvegarde projet AE

### 🔄 **ÉTAPE ACTUELLE** : Création arborescence + Exécution AE

**Objectif** : Passer des scripts .jsx aux vrais projets .aep

1. **Créer l'arborescence de dossiers SEQUENCES/**
2. **Exécuter les scripts ExtendScript dans After Effects**
3. **Générer les projets .aep fonctionnels**

## 🛠️ Architecture du Système Actuel

## 🛠️ Architecture du Système Actuel

### **Pipeline de Données Réel:**

```
📊 Google Sheets (SHOTS_TRACK.csv)
│   ├── 28 séquences (SQ01 → SQ28)
│   ├── 516 plans total
│   └── Statuts: PROCESSED (3 plans), PENDING (513 plans)
│
↓ scripts/analyze_gsheets_data.py --validation
│
📋 Mapping JSON (config/after_effects_mapping_gsheets.json)
│   ├── SQ01: 34 plans (#001→#034) - 2.9min
│   ├── SQ02: 39 plans (#035→#073) - 2.8min
│   └── SQ03: 20 plans (#074→#093) - 2.1min
│
↓ scripts/generate_ae_projects.py --validation --dry-run
│
📄 Scripts ExtendScript Générés
│   ├── SEQUENCES/SQ01/_AE/SQ01_generation_script.jsx ✅
│   ├── SEQUENCES/SQ02/_AE/SQ02_generation_script.jsx ✅
│   └── SEQUENCES/SQ03/_AE/SQ03_generation_script.jsx ✅
│
↓ 🚧 ÉTAPE SUIVANTE: Exécution After Effects
│
🎬 Projets After Effects (.aep)
    ├── SEQUENCES/SQ01/_AE/SQ01_01.aep
    ├── SEQUENCES/SQ02/_AE/SQ02_01.aep
    └── SEQUENCES/SQ03/_AE/SQ03_01.aep
```

### **Structure Générée par les Scripts ExtendScript:**

```
📁 SEQUENCES/SQ01/_AE/SQ01_01.aep
├── 🎬 SQ01_UNDLM_v001                    # Composition séquence (1440x1080, 25fps, 2.9min)
│   ├── 📽️ Plan_001 → UNDLM_00001_v001  # Plan 1 (5.0s)
│   ├── 📽️ Plan_002 → UNDLM_00002_v001  # Plan 2 (5.0s)
│   └── 📽️ Plan_034 → UNDLM_00034_v001  # Plan 34 (5.0s)
├── 📂 FROM_EDIT/                        # Dossier sources montage
│   ├── 🎥 UNDLM_00001.mov               # Import depuis /FROM_EDIT/BY_SHOTS
│   ├── 🎥 UNDLM_00002.mov
│   └── 🎥 UNDLM_00034.mov
├── 📂 FROM_GRADING/                     # Dossier sources étalonnées
│   ├── 🎨 UNDLM_00001_graded.mov        # Import depuis /FROM_GRADING/BY_SHOTS
│   ├── 🎨 UNDLM_00002_graded.mov        # (si disponible)
│   └── 🎨 UNDLM_00034_graded.mov
└── 📦 Precomps/                         # Précompositions avec switch
    ├── 🎭 UNDLM_00001_Edit_Precomp      # Précomp montage
    ├── 🎭 UNDLM_00001_Graded_Precomp    # Précomp étalonnée
    ├── 🎭 UNDLM_00001_Switch_Precomp    # Switch Edit/Graded automatique
    └── ... (répété pour chaque plan)
```

## 🚧 Étapes Suivantes : Création Arborescence + Exécution AE

### **1. Créateur d'Arborescence**

```python
# scripts/create_folder_structure.py
def create_sequence_folders(sequence_ids, base_path="/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES"):
    """
    Crée l'arborescence complète pour les séquences.
    
    Structure créée:
    SEQUENCES/
    ├── SQ01/
    │   ├── _AE/           # Projets After Effects
    │   └── _EB/           # Plans individuels
    │       ├── 001/
    │       ├── 002/
    │       └── ...
    ├── SQ02/
    └── SQ03/
    """
    
    for seq_id in sequence_ids:
        seq_path = Path(base_path) / seq_id
        
        # Créer dossiers principaux
        (seq_path / "_AE").mkdir(parents=True, exist_ok=True)
        (seq_path / "_EB").mkdir(parents=True, exist_ok=True)
        
        # Créer dossiers plans individuels
        plans = get_sequence_plans(seq_id)
        for plan in plans:
            plan_folder = seq_path / "_EB" / f"{plan['shot_num']:03d}"
            plan_folder.mkdir(exist_ok=True)
            
        print(f"✅ Arborescence créée : {seq_path}")
```

### **2. Exécuteur After Effects**

```python
# scripts/execute_ae_projects.py
def execute_ae_script(script_file, sequence_id):
    """
    Exécute un script ExtendScript dans After Effects via ligne de commande.
    """
    
    ae_path = "/Applications/Adobe After Effects 2025/aerender"
    
    # Commande pour exécuter le script
    cmd = [
        ae_path,
        "-script", str(script_file)
    ]
    
    try:
        print(f"🎬 Exécution AE pour {sequence_id}...")
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        
        if result.returncode == 0:
            print(f"✅ {sequence_id} : Projet AE créé avec succès")
            return True
        else:
            print(f"❌ {sequence_id} : Erreur AE")
            print(f"   Erreur: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"⏰ {sequence_id} : Timeout (>5min)")
        return False
    except Exception as e:
        print(f"❌ {sequence_id} : Exception - {e}")
        return False

def execute_validation_sequences():
    """Exécute la génération AE pour les 3 séquences de validation."""
    
    validation_sequences = ['SQ01', 'SQ02', 'SQ03']
    results = {}
    
    for seq_id in validation_sequences:
        script_file = f"SEQUENCES/{seq_id}/_AE/{seq_id}_generation_script.jsx"
        
        if Path(script_file).exists():
            results[seq_id] = execute_ae_script(script_file, seq_id)
        else:
            print(f"❌ {seq_id} : Script manquant - {script_file}")
            results[seq_id] = False
    
    # Rapport final
    success_count = sum(results.values())
    print(f"\n📊 Validation AE terminée : {success_count}/3 réussies")
    
    for seq_id, success in results.items():
        status = "✅" if success else "❌"
        print(f"   {status} {seq_id}")
    
    return results
```

### **3. Script de Déploiement Complet**

```python
# scripts/deploy_ae_validation.py
def deploy_validation_sequences():
    """
    Déploie complètement les 3 séquences de validation :
    1. Crée l'arborescence de dossiers
    2. Exécute les scripts ExtendScript
    3. Valide les projets .aep générés
    """
    
    validation_sequences = ['SQ01', 'SQ02', 'SQ03']
    base_path = "/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES"
    
    print("🚀 DÉPLOIEMENT VALIDATION AFTER EFFECTS")
    print("=" * 50)
    
    results = {}
    
    for seq_id in validation_sequences:
        print(f"\n📁 Traitement de {seq_id}...")
        
        # 1. Créer arborescence
        seq_path = Path(base_path) / seq_id
        try:
            create_sequence_folders([seq_id], base_path)
            print(f"   ✅ Arborescence créée : {seq_path}")
        except Exception as e:
            print(f"   ❌ Erreur arborescence : {e}")
            results[seq_id] = False
            continue
        
        # 2. Vérifier script ExtendScript
        script_file = seq_path / "_AE" / f"{seq_id}_generation_script.jsx"
        if not script_file.exists():
            print(f"   ❌ Script manquant : {script_file}")
            results[seq_id] = False
            continue
        
        # 3. Exécuter script dans After Effects
        try:
            success = execute_ae_script(script_file, seq_id)
            results[seq_id] = success
            
            if success:
                # 4. Vérifier projet .aep généré
                aep_file = seq_path / "_AE" / f"{seq_id}_01.aep"
                if aep_file.exists():
                    print(f"   ✅ Projet généré : {aep_file}")
                else:
                    print(f"   ⚠️  Script exécuté mais projet manquant")
            
        except Exception as e:
            print(f"   ❌ Erreur exécution AE : {e}")
            results[seq_id] = False
    
    # Rapport final
    success_count = sum(results.values())
    print(f"\n📊 RÉSULTATS DÉPLOIEMENT VALIDATION")
    print(f"   Réussites : {success_count}/3")
    
    for seq_id, success in results.items():
        status = "✅" if success else "❌"
        aep_path = f"{base_path}/{seq_id}/_AE/{seq_id}_01.aep"
        print(f"   {status} {seq_id} → {aep_path}")
    
    if success_count == 3:
        print(f"\n🎉 VALIDATION COMPLÈTE - Tous les projets AE générés !")
        print(f"   📂 Dossier : {base_path}")
        print(f"   🎬 Projets : SQ01_01.aep, SQ02_01.aep, SQ03_01.aep")
        print(f"   ⏱️  Durée totale : ~7.8 minutes")
        print(f"   📋 Plans total : 93 (SQ01:34, SQ02:39, SQ03:20)")
    else:
        print(f"\n⚠️  VALIDATION PARTIELLE - {3-success_count} échecs")
        print(f"   Action recommandée : Vérifier les logs d'erreur AE")
    
    return results

if __name__ == "__main__":
    deploy_validation_sequences()
```

## 🎯 Commandes de Validation Actuelle

### **Tests Actuels Disponibles:**

```bash
# 1. Analyser Google Sheets en mode validation
python scripts/analyze_gsheets_data.py --validation

# 2. Générer scripts ExtendScript (dry-run)
python scripts/generate_ae_projects.py --validation --dry-run

# 3. Lister séquences disponibles
python scripts/generate_ae_projects.py --list

# 4. Générer script pour une séquence spécifique
python scripts/generate_ae_projects.py --sequence SQ01 --dry-run
```

### **Prochaines Commandes à Implémenter:**

```bash
# 5. Créer arborescence de dossiers
python scripts/create_folder_structure.py --validation

# 6. Exécuter génération AE complète
python scripts/deploy_ae_validation.py

# 7. Valider projets .aep générés
python scripts/validate_ae_projects.py --validation
```

## 🛠️ Outils After Effects Utilisés

### **1. Adobe ExtendScript (JavaScript)** ⭐⭐⭐⭐⭐
**Approche choisie pour RL PostFlow**

```bash
# Exécution via ligne de commande
"/Applications/Adobe After Effects 2025/aerender" -script script.jsx
```

**Avantages dans notre contexte:**
- ✅ Scripts .jsx déjà générés et fonctionnels
- ✅ API officielle Adobe - contrôle total
- ✅ Automatisable depuis Python
- ✅ Gestion Edit + Graded intégrée
- ✅ Pas d'outils externes nécessaires

**Structure de nos scripts générés:**
```javascript
// Import automatique des plans montage/étalonnés
// Création des précompositions avec switch Edit/Graded  
// Assembly timeline automatique
// Sauvegarde projet .aep
```

## � Plan d'Implémentation - État Actuel

### ✅ **Phase 1: Scripts ExtendScript** (TERMINÉE)
- [x] Scripts .jsx générés dynamiquement depuis Google Sheets
- [x] Support Edit + Graded avec switch automatique
- [x] Mode validation (SQ01, SQ02, SQ03)
- [x] Mode dry-run pour tests sans exécution AE

### 🔄 **Phase 2: Exécution After Effects** (EN COURS)
- [ ] Création arborescence SEQUENCES/
- [ ] Exécution scripts via `aerender` 
- [ ] Génération projets .aep fonctionnels
- [ ] Validation des 3 premières séquences

### 📋 **Phase 3: Intégration Pipeline** (PROCHAINE)
- [ ] Intégration dashboard RL PostFlow
- [ ] Notifications Discord pour génération AE
- [ ] Monitoring et logs centralisés
- [ ] Déploiement toutes séquences (SQ01→SQ28)

## 📋 Checklist de Validation Actuelle

### ✅ **Tests Réussis:**
- [x] Analyse Google Sheets SHOTS_TRACK.csv
- [x] Génération mapping JSON pour 28 séquences
- [x] Scripts ExtendScript pour SQ01, SQ02, SQ03
- [x] Validation structure et contenu scripts .jsx
- [x] Mode validation fonctionnel

### 🔄 **Tests à Effectuer:**
- [ ] After Effects installé et accessible en ligne de commande
- [ ] Exécution script ExtendScript simple
- [ ] Création arborescence SEQUENCES/
- [ ] Génération projet .aep SQ01
- [ ] Validation import plans montage/étalonnés
- [ ] Tests switch Edit/Graded fonctionnel

### 🎯 **Objectifs Validation:**
- [ ] 3 projets .aep générés (SQ01, SQ02, SQ03)
- [ ] Total 93 plans importés et organisés
- [ ] Durée totale ~7.8 minutes
- [ ] Switch Edit/Graded opérationnel

## 🔗 Ressources et Références

### **Documentation Technique:**
- [Adobe ExtendScript Documentation](https://ae-scripting.docsforadobe.dev/)
- [After Effects Command Line Reference](https://helpx.adobe.com/after-effects/using/automated-rendering-network-rendering.html)
- [ExtendScript Toolkit CC](https://github.com/Adobe-CEP/CEP-Resources)

### **Fichiers Projet RL PostFlow:**
- `scripts/analyze_gsheets_data.py` - Analyse CSV Google Sheets
- `scripts/generate_ae_projects.py` - Générateur ExtendScript
- `config/after_effects_mapping_gsheets.json` - Mapping séquences/plans
- `data/RL_O2B_UNDLM_SUIVI_ANIM - SHOTS_TRACK.csv` - Source données

### **Scripts ExtendScript Générés:**
- `SEQUENCES/SQ01/_AE/SQ01_generation_script.jsx`
- `SEQUENCES/SQ02/_AE/SQ02_generation_script.jsx`  
- `SEQUENCES/SQ03/_AE/SQ03_generation_script.jsx`

### **Commandes Utiles:**
```bash
# Vérifier installation After Effects
ls "/Applications/Adobe After Effects"*

# Test script ExtendScript simple
"/Applications/Adobe After Effects 2025/aerender" -script test.jsx

# Validation mode complet
python scripts/validation_ae_complete.py
```
