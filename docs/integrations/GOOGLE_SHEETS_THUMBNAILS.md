# 🎬 Système de Vignettes Automatiques PostFlow

## 🎯 APERÇU

Le système de vignettes PostFlow génère automatiquement des images représentatives de chaque plan et les intègre directement dans Google Sheets pour une identification visuelle rapide.

## ✨ FONCTIONNALITÉS

### 🖼️ **Génération Automatique**
- **Extraction** de la première frame de chaque rush
- **Redimensionnement** optimisé (320x180px)
- **Upload** vers Google Drive avec organisation automatique
- **Intégration** dans Google Sheets via formule `=IMAGE()`

### 📁 **Organisation Intelligente**
- Structure hiérarchique : `PostFlow_Thumbnails/Projet/Date/`
- Nomenclature claire : `001_UNDLM_00001.jpg`
- Permissions publiques automatiques
- Gestion des doublons

## 🛠️ CONFIGURATION

### 📂 **Chemin des Rushs**
```bash
# Configuration par défaut
RUSHES_PATH="/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS"
```

### 🔧 **Prérequis**
- **ffmpeg** installé (`brew install ffmpeg`)
- **Accès Google Drive** via service account
- **Google Sheets API** activée
- **Rushes accessibles** via LucidLink ou stockage local

### 🎬 **Formats Supportés**
- `.mov`, `.mp4`, `.avi`, `.mxf`
- `.r3d`, `.braw`, `.prores`

## 🚀 UTILISATION

### ⚡ **Commandes Rapides**

```bash
# Test avec 3 plans
python scripts/generate_drive_thumbnails.py 3

# Générer 10 vignettes
python scripts/generate_drive_thumbnails.py 10

# Générer toutes les vignettes
python scripts/generate_drive_thumbnails.py all

# Forcer la régénération (remplace les existantes)
python scripts/generate_drive_thumbnails.py 5 force
```

### 📊 **Processus de Génération**

1. **Lecture** du Google Sheet SHOTS_TRACK
2. **Mapping** des colonnes (nomenclature, plan, etc.)
3. **Recherche** du fichier rush correspondant
4. **Extraction** de la première frame avec ffmpeg
5. **Upload** vers Google Drive
6. **Insertion** de la formule IMAGE() dans Google Sheets

## 🏗️ ARCHITECTURE

### 📁 **Structure Google Drive**
```
📁 PostFlow_Thumbnails/
   📁 UNDLM_Project/
      📁 2025-07/
         🖼️ 001_UNDLM_00001.jpg      # Plan 001
         🖼️ 002_UNDLM_00002.jpg      # Plan 002
         🖼️ 003_UNDLM_00003.jpg      # Plan 003
         ...
```

### 🔗 **URLs Générées**
```
Format: https://drive.google.com/uc?export=view&id={FILE_ID}
Exemple: https://drive.google.com/uc?export=view&id=1abc123def456...
```

### 📋 **Formule Google Sheets**
```
=IMAGE("https://drive.google.com/uc?export=view&id=1abc123def456")
```

## 🔧 CONFIGURATION AVANCÉE

### 🎛️ **Paramètres d'Extraction**

```python
# Dans le script generate_drive_thumbnails.py
FFMPEG_PARAMS = [
    '-vframes', '1',        # Une seule frame
    '-q:v', '2',           # Haute qualité
    '-vf', 'scale=320:180' # Redimensionnement
]
```

### 📂 **Correspondance Fichiers**

Le système utilise plusieurs méthodes pour trouver le rush :

1. **Match exact** : `UNDLM_00001` → `UNDLM_00001.mov`
2. **Préfixe** : `UNDLM_00001` → `UNDLM_00001_V01.mov`
3. **Contenu** : `UNDLM_00001` dans le nom du fichier
4. **Numéro** : `00001` → tout fichier contenant `00001`

### 🔐 **Permissions Google Drive**

```python
# Permissions automatiques pour chaque image
permission = {
    'type': 'anyone',
    'role': 'reader'
}
```

## 📊 MONITORING

### 📈 **Rapport de Génération**
```
🎉 TERMINÉ!
   Plans traités: 520
   Images générées: 487
   Ignorés (déjà présents): 28
   Erreurs: 5
```

### ❌ **Gestion d'Erreurs**
- **Rush non trouvé** : Continue avec le plan suivant
- **Erreur ffmpeg** : Log détaillé de l'erreur
- **Échec upload** : Retry automatique
- **Permissions** : Vérification et correction automatique

## 🔍 DÉPANNAGE

### 🚨 **Problèmes Courants**

#### 1. **ffmpeg non trouvé**
```bash
# Installation macOS
brew install ffmpeg

# Vérification
ffmpeg -version
```

#### 2. **Rush non accessible**
```bash
# Vérifier le montage LucidLink
ls /Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS

# Permissions d'accès
sudo chown -R $(whoami) /path/to/rushes
```

#### 3. **Images non affichées dans Sheets**
```bash
# Vérifier les permissions Drive
python scripts/check_drive_permissions.py

# Tester l'URL directement
curl -I "https://drive.google.com/uc?export=view&id=FILE_ID"
```

#### 4. **Erreur mapping colonnes**
```bash
# Régénérer le mapping
python scripts/analyze_spreadsheet_structure.py
```

### 🔧 **Scripts de Diagnostic**

```bash
# Test complet du système
python scripts/test_thumbnail_system.py

# Vérification des rushs
python scripts/check_rushes_access.py

# Nettoyage cache temporaire
rm -rf temp/thumbnails/*
```

## 📏 PERFORMANCE

### ⏱️ **Temps de Traitement**
- **Par plan** : ~2-5 secondes (extraction + upload)
- **520 plans** : ~20-40 minutes (selon réseau)
- **Optimisations** : Traitement en lot, cache intelligent

### 💾 **Utilisation Stockage**
- **Taille vignette** : ~15-30 KB (320x180 JPEG)
- **520 plans** : ~10-15 MB total
- **Google Drive** : Illimité avec workspace

### 🌐 **Réseau**
- **Upload** : Dépend de la connexion internet
- **LucidLink** : Optimisé pour accès réseau
- **Cache local** : Fichiers temporaires nettoyés automatiquement

## 🎯 BONNES PRATIQUES

### ✅ **Recommandations**

1. **Test d'abord** : Commencer avec `python script.py 5`
2. **Horaires** : Lancer pendant les heures creuses
3. **Monitoring** : Surveiller les logs en temps réel
4. **Backup** : Sauvegarder le spreadsheet avant traitement
5. **Réseau** : Connexion stable pour upload Google Drive

### 🔄 **Maintenance**

```bash
# Nettoyage hebdomadaire
python scripts/cleanup_temp_files.py

# Vérification intégrité
python scripts/verify_thumbnails.py

# Mise à jour mapping
python scripts/update_mapping.py
```

## 🚀 ÉVOLUTIONS FUTURES

### 🎯 **Roadmap**
- [ ] **Batch processing** optimisé
- [ ] **Preview timeline** intégré
- [ ] **Annotations** sur les vignettes
- [ ] **Compression** intelligente
- [ ] **CDN** pour performances globales

---

*Documentation technique - 8 juillet 2025*
