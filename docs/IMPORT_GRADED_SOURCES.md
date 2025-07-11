# 🎨 Import Sources Étalonnées v2

> **Script d'import des plans étalonnés pour projets After Effects existants**  
> Met à jour automatiquement les compositions avec hiérarchie correcte des layers

## 🎯 **Vue d'ensemble**

Le script `import_graded_sources_v2.py` permet d'ajouter les sources étalonnées aux projets After Effects déjà générés. Il :

- **Scanne automatiquement** les plans étalonnés disponibles
- **Met à jour les projets AE existants** sans les recréer
- **Positionne correctement** les layers dans la hiérarchie
- **Désactive automatiquement** les layers Edit au profit des layers Graded

## 🎬 **Hiérarchie des Layers**

### **Avant import (plans Edit seulement) :**
```
SQ11_UNDLM_00203_v001
├── UNDLM_00203_edit ✅ (actif)
└── BG_SOLID (fond)
```

### **Après import (plans Graded ajoutés) :**
```
SQ11_UNDLM_00203_v001
├── UNDLM_00203_graded ✅ (actif, nouveau)
├── UNDLM_00203_edit ❌ (désactivé automatiquement)
└── BG_SOLID (fond)
```

## 🛠️ **Usage**

### **Scan des sources disponibles**
```bash
# Vérifier quels plans étalonnés sont disponibles
python scripts/import_graded_sources_v2.py --scan
```

### **Import pour une séquence**
```bash
# Importer les plans étalonnés pour SQ01
python scripts/import_graded_sources_v2.py --sequence SQ01

# Mode simulation (test sans modification)
python scripts/import_graded_sources_v2.py --sequence SQ01 --dry-run
```

### **Import pour plusieurs séquences**
```bash
# Importer pour plusieurs séquences spécifiques
python scripts/import_graded_sources_v2.py --sequences SQ01 SQ05 SQ11 SQ21

# Mode simulation
python scripts/import_graded_sources_v2.py --sequences SQ01 SQ05 --dry-run
```

### **Import massif**
```bash
# Importer pour toutes les séquences disponibles
python scripts/import_graded_sources_v2.py --all

# Mode simulation
python scripts/import_graded_sources_v2.py --all --dry-run
```

## 📋 **Prérequis**

### **Projets AE existants**
Les projets After Effects doivent avoir été générés au préalable :
```bash
# Générer d'abord les projets AE avec les sources Edit
python scripts/generate_ae_projects_v2.py --sequence SQ01
python scripts/generate_ae_projects_v2.py --all
```

### **Sources étalonnées disponibles**
Les fichiers `.mov` étalonnés doivent être présents dans :
```
/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/
├── UNDLM_00001.mov
├── UNDLM_00002.mov
├── UNDLM_00003.mov
└── ...
```

### **Structure AE compatible**
Le projet AE doit contenir la structure v2 :
- Dossier `FROM_GRADING`
- Dossier `MASTER_COMPS_SHOTS`
- Compositions nommées `SQXX_UNDLM_XXXXX_v001`

## 🔄 **Workflow Complet**

### **Phase 1 : Génération initiale (sources Edit)**
```bash
# 1. Générer le mapping
python scripts/analyze_gsheets_data.py

# 2. Créer les projets AE avec sources Edit
python scripts/generate_ae_projects_v2.py --all

# 3. Valider les projets dans After Effects
# Importer et tester quelques scripts JSX
```

### **Phase 2 : Import sources étalonnées (quand disponibles)**
```bash
# 1. Scanner les sources disponibles
python scripts/import_graded_sources_v2.py --scan

# 2. Test sur une séquence
python scripts/import_graded_sources_v2.py --sequence SQ01 --dry-run

# 3. Import réel
python scripts/import_graded_sources_v2.py --sequence SQ01

# 4. Import massif quand tout est prêt
python scripts/import_graded_sources_v2.py --all
```

## 📁 **Scripts Générés**

### **Scripts JSX d'import**
Pour chaque séquence, le script génère :

**Local :** `/Users/.../ae_scripts/RL_PostFlow_SQ01_IMPORT_GRADED_V2.jsx`  
**Serveur :** `/Volumes/.../SEQUENCES/SQ01/_AE/SQ01_import_graded_v2.jsx`

### **Contenu du script JSX**
- **Ouverture automatique** du projet AE existant
- **Validation de la structure** AE (dossiers requis)
- **Import des sources étalonnées** dans FROM_GRADING
- **Mise à jour des compositions** avec layers graded
- **Positionnement automatique** dans la hiérarchie
- **Désactivation des layers Edit** remplacés
- **Sauvegarde automatique** du projet

## 🎮 **Exécution dans After Effects**

### **Méthode automatique (recommandée)**
Le script JSX ouvre automatiquement le bon projet :
```javascript
// Le script contient le chemin vers le projet
var projectFile = new File("/path/to/SQ01_01.aep");
app.open(projectFile);
```

### **Méthode manuelle**
1. Ouvrir After Effects
2. Ouvrir le projet `SQ01_01.aep`
3. Exécuter le script `SQ01_import_graded_v2.jsx`

### **Validation du résultat**
Après exécution, vérifier :
- ✅ Layers `UNDLM_XXXXX_graded` ajoutés
- ✅ Layers `UNDLM_XXXXX_edit` désactivés
- ✅ Scaling correct (66.67% UHD → 1440p)
- ✅ Position centrée (1280, 720)
- ✅ Hiérarchie : Graded > Edit > BG_SOLID

## 📊 **Statistiques et Logs**

### **Sortie console du script Python**
```
🎨 Import sources étalonnées pour SQ01
   📝 34 plans à vérifier
✅ Plan étalonné disponible : UNDLM_00001
✅ Plan étalonné disponible : UNDLM_00003
✅ Plan étalonné disponible : UNDLM_00005
📝 Plan étalonné non disponible : UNDLM_00002
...
✅ 15 plans étalonnés trouvés
✅ Script d'import généré : SQ01_import_graded_v2.jsx
```

### **Popup After Effects**
```
🎨 Sources étalonnées importées avec succès!

📊 Statistiques:
• Plans étalonnés disponibles: 15
• Plans importés: 15
• Compositions mises à jour: 15
• Total plans séquence: 34

✅ Hiérarchie des layers:
   1. UNDLM_XXXXX_graded (actif)
   2. UNDLM_XXXXX_edit (désactivé)
   3. BG_SOLID (fond)

💾 Projet sauvegardé automatiquement
```

### **Logs JSX internes**
```javascript
// Logs visibles dans la console ExtendScript
GRADED_IMPORTED:UNDLM_00001
GRADED_IMPORTED:UNDLM_00003
EDIT_LAYER_DISABLED:UNDLM_00001_edit
GRADED_ADDED_TO_COMP:SQ01_UNDLM_00001_v001
GRADED_IMPORT_SUCCESS:SQ01:15:15
```

## 🔧 **Configuration**

### **Chemins configurables**
```python
# Chemins par défaut dans import_graded_sources_v2.py
from_grading_path = "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS"
sequences_path = "/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES"
config_path = "config/after_effects_mapping_gsheets.json"
```

### **Nomenclature requise**
```
Sources étalonnées : UNDLM_XXXXX.mov
Projet AE : SQXX_01.aep
Compositions : SQXX_UNDLM_XXXXX_v001
```

## 🆘 **Dépannage**

### **Erreurs communes**

#### **"Projet AE non trouvé"**
```bash
❌ Projet AE non trouvé pour SQ01
   Veuillez d'abord générer le projet avec :
   python scripts/generate_ae_projects_v2.py --sequence SQ01
```

#### **"Structure AE incompatible"**
```javascript
❌ Structure AE incompatible
Dossiers manquants : FROM_GRADING ou MASTER_COMPS_SHOTS
```
**Solution :** Régénérer le projet avec `generate_ae_projects_v2.py`

#### **"Aucun plan étalonné disponible"**
```bash
⚠️  Aucun plan étalonné disponible pour SQ01
```
**Solution :** Vérifier que les fichiers `.mov` sont dans `_FROM_GRADING/BY_SHOTS/`

### **Validation manuelle**
```bash
# Vérifier la structure des dossiers
ls -la "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/"

# Vérifier les projets AE existants
ls -la "/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ01/_AE/"

# Tester en mode simulation
python scripts/import_graded_sources_v2.py --sequence SQ01 --dry-run
```

## 🧪 **Tests**

### **Test avec fichiers factices**
```bash
# Créer des fichiers de test
python scripts/test_graded_import.py

# Modifier temporairement le chemin dans import_graded_sources_v2.py
# Pointer vers /tmp/test_grading_by_shots

# Tester l'import
python scripts/import_graded_sources_v2.py --sequence SQ01 --dry-run
```

### **Validation progressive**
```bash
# 1. Scanner d'abord
python scripts/import_graded_sources_v2.py --scan

# 2. Tester une séquence
python scripts/import_graded_sources_v2.py --sequence SQ01 --dry-run

# 3. Import réel sur test
python scripts/import_graded_sources_v2.py --sequence SQ01

# 4. Valider dans AE manuellement

# 5. Import massif
python scripts/import_graded_sources_v2.py --all
```

## 📈 **Avantages**

### **vs Régénération complète**
- ✅ **Préserve les modifications** manuelles des projets AE
- ✅ **Plus rapide** (pas de recréation complète)
- ✅ **Ajout incrémental** au fur et à mesure des étalonnages
- ✅ **Rollback facile** (désactiver layers graded)

### **vs Import manuel**
- ✅ **Automatisation complète** (516 plans max)
- ✅ **Hiérarchie garantie** des layers
- ✅ **Scaling automatique** UHD → 1440p
- ✅ **Pas d'erreur humaine** dans le positionnement

## 🔄 **Intégration Pipeline**

### **Workflow production**
```bash
# Workflow initial (sources Edit)
python scripts/generate_ae_projects_v2.py --all

# Workflow incrémental (au fur et à mesure des étalonnages)
python scripts/import_graded_sources_v2.py --scan
python scripts/import_graded_sources_v2.py --sequence SQ01  # Plans disponibles
python scripts/import_graded_sources_v2.py --sequence SQ05  # Quand prêts
# ...etc
```

### **Monitoring automatique**
Possibilité d'intégrer dans le pipeline principal pour import automatique :
- Surveillance dossier `_FROM_GRADING/BY_SHOTS/`
- Import automatique quand nouveaux plans détectés
- Notifications Discord des imports réussis

---

**Import Sources Étalonnées v2** - Workflow flexible et efficace pour mise à jour incrémentale
