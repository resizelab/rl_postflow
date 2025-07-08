# 📊 Google Sheets - Mapping Dynamique PostFlow

## 🎯 APERÇU

PostFlow utilise un système de **mapping dynamique** qui s'adapte automatiquement à la structure de votre Google Spreadsheet. Plus besoin de réorganiser vos colonnes ou de suivre un format strict !

## ✨ FONCTIONNALITÉS

### 🔄 **Adaptation Automatique**
- **Détection automatique** des headers (première ligne)
- **Mapping intelligent** des colonnes vers les champs PostFlow
- **Suggestions automatiques** pour les colonnes manquantes
- **Support de n'importe quel ordre** de colonnes

### 📋 **Worksheets Supportées**
- **SHOTS_TRACK** - Suivi des plans
- **USERS_INFOS** - Informations utilisateurs

## 🛠️ CONFIGURATION

### 1. Structure du Spreadsheet

#### SHOTS_TRACK (Recommandé)
```
PLAN | STATUS | VIGNETTE | NAME_SEQ | ATTRIBUTION | PRIORITY | ...
001  | TODO   | [IMAGE]  | REVEIL   | Xavier      | HIGH     | ...
002  | DONE   | [IMAGE]  | REVEIL   | David       | MEDIUM   | ...
```

#### USERS_INFOS (Recommandé)
```
PRENOM | NOMS   | DEPT     | MAIL              | ACTIF | ID DISCORD
Xavier | Boutin | PostProd | xavier@email.com  | OUI   | 123456789
David  | Delsau | Superv   | david@email.com   | OUI   | 987654321
```

### 2. Génération du Mapping

```bash
# Analyser la structure existante
python scripts/analyze_spreadsheet_structure.py

# Générer le mapping automatiquement
python scripts/generate_dynamic_mapping.py
```

### 3. Fichier de Mapping

Le mapping est sauvegardé dans `config/sheets_mapping.json` :

```json
{
  "worksheets": {
    "SHOTS_TRACK": {
      "mapping": {
        "shot_name": {
          "column_index": 1,
          "column_name": "PLAN",
          "required": true
        },
        "status": {
          "column_index": 2,
          "column_name": "STATUS",
          "required": true
        }
      }
    }
  }
}
```

## 🎬 SYSTÈME DE VIGNETTES

### 🖼️ **Génération Automatique**
- **Extraction** de la première frame des rushs
- **Upload** vers Google Drive (organisé par projet/date)
- **Insertion** via formule `=IMAGE(url)` dans Google Sheets
- **Permissions publiques** automatiques

### 📁 **Organisation Google Drive**
```
📁 PostFlow_Thumbnails/
   📁 UNDLM_Project/
      📁 2025-07/
         🖼️ 001_UNDLM_00001.jpg
         🖼️ 002_UNDLM_00002.jpg
```

### ⚡ **Commandes Vignettes**

```bash
# Générer 5 vignettes (test)
python scripts/generate_drive_thumbnails.py 5

# Générer toutes les vignettes
python scripts/generate_drive_thumbnails.py all

# Forcer la régénération
python scripts/generate_drive_thumbnails.py all force
```

## 🔧 UTILISATION

### 📖 **Accès aux Données**

```python
from src.integrations.sheets.mapper import SheetsMapper

# Initialiser le mapper
mapper = SheetsMapper()

# Accéder aux données par nom logique
row_data = worksheet.row_values(2)
shot_name = mapper.get_field_value(row_data, 'shot_name')
status = mapper.get_field_value(row_data, 'status')
```

### 🔄 **Mise à Jour du Mapping**

```python
# Régénérer le mapping après modification du spreadsheet
python scripts/analyze_spreadsheet_structure.py
```

## 🎯 MAPPING DES CHAMPS

### SHOTS_TRACK
| Champ PostFlow | Colonne Recommandée | Obligatoire | Description |
|----------------|--------------------|-----------|-----------| 
| `shot_name` | PLAN | ✅ | Nom/numéro du plan |
| `status` | STATUS | ✅ | Statut du plan |
| `thumbnail` | VIGNETTE | ❌ | Image du plan |
| `attribution` | ATTRIBUTION | ❌ | Assignation |
| `priority` | PRIORITY | ❌ | Priorité |
| `nomenclature` | NOMENCLATURE PLAN | ❌ | Nom technique |
| `frame_io_link` | FRAME_IO_LINK | ❌ | Lien Frame.io |

### USERS_INFOS
| Champ PostFlow | Colonne Recommandée | Obligatoire | Description |
|----------------|--------------------|-----------|-----------| 
| `first_name` | PRENOM | ✅ | Prénom |
| `last_name` | NOMS | ✅ | Nom de famille |
| `email` | MAIL | ✅ | Email |
| `department` | DEPT | ❌ | Département |
| `active` | ACTIF | ❌ | Statut actif |
| `discord_id` | ID DISCORD | ❌ | ID Discord |

## 🚨 DÉPANNAGE

### ❌ **Problèmes Courants**

1. **Mapping non détecté**
   ```bash
   # Régénérer le mapping
   python scripts/analyze_spreadsheet_structure.py
   ```

2. **Vignettes non affichées**
   ```bash
   # Vérifier les permissions Drive
   python scripts/check_drive_permissions.py
   ```

3. **Colonnes manquantes**
   - Consulter `sheets_mapping.json` section `additional_columns_needed`
   - Ajouter les colonnes suggérées au spreadsheet

### 📊 **Vérification**

```bash
# Tester la connexion et le mapping
python scripts/test_google_sheets_real.py

# Inspecter la structure détaillée
python scripts/inspect_original_spreadsheet.py
```

## 📈 AVANTAGES

✅ **Flexibilité** - Adaptable à n'importe quelle structure  
✅ **Simplicité** - Pas de réorganisation nécessaire  
✅ **Automatisation** - Génération et mapping automatiques  
✅ **Évolutif** - Facile d'ajouter de nouvelles colonnes  
✅ **Visuel** - Vignettes automatiques intégrées  

---

*Documentation générée automatiquement - 8 juillet 2025*
