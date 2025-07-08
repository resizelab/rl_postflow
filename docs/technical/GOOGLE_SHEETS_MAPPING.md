# 🔄 Google Sheets & Mapping Dynamique

## 🎯 Vue d'ensemble

PostFlow s'adapte automatiquement à **n'importe quelle structure** de Google Sheet. Il analyse la première ligne (headers) et génère un mapping intelligent vers les champs PostFlow.

## 🔧 Fonctionnement du mapping

### 1. **Analyse automatique**
```bash
python scripts/analyze_spreadsheet_structure.py
```

Le script :
- 📋 Lit la première ligne de chaque worksheet
- 🔍 Détecte les colonnes importantes (PLAN, STATUS, etc.)
- 💾 Génère `config/sheets_mapping.json`

### 2. **Mapping intelligent**

| Votre colonne | PostFlow détecte | Utilisation |
|--------------|-----------------|-------------|
| `PLAN` | `shot_name` | Identifiant unique du plan |
| `STATUS` | `status` | Suivi de l'avancement |
| `ATTRIBUTION` | `attribution` | Assignation des tâches |
| `PRIORITY` | `priority` | Gestion des priorités |
| `DEPT` | `department` | Filtrage par équipe |
| `ACTIF` | `active` | Utilisateurs actifs |

### 3. **Suggestions automatiques**

Si des colonnes importantes manquent, PostFlow suggère :
```json
"additional_columns_needed": {
  "status": {
    "suggested_column": "STATUS",
    "description": "Statut du plan (En cours, Terminé, etc.)",
    "required": true
  }
}
```

## 📊 Structure du mapping

### Fichier `config/sheets_mapping.json`
```json
{
  "version": "1.1",
  "worksheets": {
    "SHOTS_TRACK": {
      "mapping": {
        "shot_name": {
          "column_index": 1,
          "column_name": "PLAN",
          "required": true
        }
      }
    }
  }
}
```

### Helper Python `src/integrations/sheets/mapper.py`
```python
from integrations.sheets.mapper import SheetsMapper

mapper = SheetsMapper()
shot_name = mapper.get_field_value(row_data, 'shot_name')
status = mapper.get_field_value(row_data, 'status')
```

## 🔄 Adaptation automatique

### Votre Google Sheet
```
| PLAN | STATUS | NAME_SEQ | ATTRIBUTION | PRIORITY |
|------|---------|----------|-------------|----------|
| 001  | En cours| HOPITAL  | David       | Haute    |
```

### PostFlow comprend automatiquement
```python
# Accès par nom logique
shot = mapper.get_field_value(row, 'shot_name')      # → "001"
status = mapper.get_field_value(row, 'status')       # → "En cours"
assigned = mapper.get_field_value(row, 'attribution') # → "David"
```

## 🏗️ Ordre des colonnes optimisé

PostFlow propose un ordre **user-friendly** :

### **Colonnes essentielles** (1-6)
1. **PLAN** - Identifiant
2. **STATUS** - Statut actuel  
3. **NAME_SEQ** - Contexte
4. **NUM_SEQ** - Numéro
5. **ATTRIBUTION** - Qui travaille
6. **PRIORITY** - Urgence

### **Détails techniques** (7-13)
7. **NOMENCLATURE** - Nom technique
8. **SOURCE NAME** - Fichier source
9. **DURÉE** - Timing
10. **LUT** - Paramètres
11. **FRAME_IO_LINK** - Review
12. **COMMENTAIRE** - Notes
13. **VIGNETTE** - Image

### **Timecodes** (14-17)
14-17. **TC IN/OUT** - Timecodes détaillés

### **Workflow** (18-23)
18-23. **Validations** - Étapes de production

### **Métadonnées** (24-25)
24. **CREATED** - Date création
25. **UPDATED** - Dernière MAJ

## ⚙️ Configuration avancée

### Réorganiser les colonnes
```python
python scripts/reorganize_columns.py
```

### Regénérer le mapping
```python
python scripts/analyze_spreadsheet_structure.py --force
```

### Tester l'intégration
```python
python scripts/test_google_sheets_real.py
```

## 🔍 Debugging

### Vérifier le mapping
```python
# Afficher le mapping actuel
with open('config/sheets_mapping.json') as f:
    mapping = json.load(f)
    print(json.dumps(mapping, indent=2))
```

### Tester un champ
```python
mapper = SheetsMapper()
print(mapper.get_column_index('shot_name'))  # → 1
print(mapper.get_column_name('shot_name'))   # → "PLAN"
```

## ✅ Avantages

- 🔄 **Adaptation automatique** - Fonctionne avec votre structure existante
- 🎯 **Mapping intelligent** - Reconnaissance automatique des colonnes
- 📋 **Suggestions** - Propose les colonnes manquantes
- 🔧 **Flexibilité** - S'adapte aux changements de structure
- 🚀 **Performance** - Accès direct aux colonnes par index

---

**Prochaine étape :** [Système de vignettes](THUMBNAILS_SYSTEM.md)
