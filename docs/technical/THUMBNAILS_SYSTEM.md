# 🖼️ Système de Vignettes Automatiques

## 🎯 Vue d'ensemble

Le système de vignettes PostFlow extrait automatiquement la première frame de chaque rush et l'insère directement dans Google Sheets via Google Drive.

## 🔄 Workflow automatique

```mermaid
graph LR
    A[Rush LucidLink] → B[Extraction Frame]
    B → C[Upload Google Drive]
    C → D[Formule IMAGE()]
    D → E[Vignette dans Sheet]
```

## 🚀 Utilisation

### Générer quelques vignettes (test)
```bash
python scripts/generate_drive_thumbnails.py 5
```

### Générer toutes les vignettes
```bash
python scripts/generate_drive_thumbnails.py all
```

### Forcer la régénération
```bash
python scripts/generate_drive_thumbnails.py 10 force
```

## 📁 Organisation Google Drive

### Structure automatique
```
📁 PostFlow_Thumbnails/
   📁 UNDLM_Project/
      📁 2025-07/
         🖼️ 001_UNDLM_00001.jpg
         🖼️ 002_UNDLM_00002.jpg
         🖼️ 003_UNDLM_00003.jpg
```

### Avantages
- 📅 **Organisation par date** - Archivage automatique
- 🔒 **Permissions publiques** - Visibles dans Google Sheets
- ☁️ **Stockage permanent** - URLs stables
- 🏷️ **Nommage intelligent** - Plan + Nomenclature

## 🔧 Configuration technique

### Chemins des rushs
```python
# Configuration dans le script
rushes_path = "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS"
```

### Extensions supportées
```python
video_extensions = ['.mov', '.mp4', '.avi', '.mxf', '.r3d', '.braw', '.prores']
```

### Paramètres d'extraction
```bash
ffmpeg -i source.mov \
  -vframes 1 \          # Une seule frame
  -q:v 2 \              # Haute qualité
  -vf scale=320:180 \   # Redimensionnement
  -y output.jpg         # Overwrite
```

## 📊 Matching automatique

### Logique de recherche
1. **Match exact** - `UNDLM_00001` = `UNDLM_00001.mov`
2. **Début de fichier** - `UNDLM_00001` trouve `UNDLM_00001_FINAL.mov`
3. **Contenu** - `UNDLM_00001` trouve `EXPORT_UNDLM_00001.mov`
4. **Numéro de plan** - `00001` trouve `SHOT_00001_V2.mov`

### Exemple de matching
```
Google Sheet: "UNDLM_00001"
Fichiers rushs:
  ✅ UNDLM_00001.mov          (match exact)
  ✅ UNDLM_00001_FINAL.mov    (début)
  ✅ EXPORT_UNDLM_00001.mov   (contenu)
  ❌ UNDLM_00002.mov          (pas de match)
```

## 🔗 Intégration Google Sheets

### Formule automatique
```
=IMAGE("https://drive.google.com/uc?export=view&id=FILE_ID")
```

### Résultat dans le sheet
| PLAN | STATUS | VIGNETTE |
|------|---------|----------|
| 001 | En cours | ![img] |
| 002 | Terminé | ![img] |

## ⚡ Performance

### Avec Lucid Link + WiFi
- **Vitesse** : ~2-3 vignettes/minute
- **Fiabilité** : Très bonne (retry automatique)
- **Qualité** : 320x180px (optimisé pour sheets)

### Optimisations
- ✅ **Détection des doublons** - Évite la regénération
- ✅ **Extraction locale** - Cache temporaire
- ✅ **Upload groupé** - Minimise les appels API
- ✅ **Nettoyage automatique** - Supprime les fichiers temporaires

## 🔍 Monitoring

### Progress en temps réel
```
📋 Plan 127 (127/520)
   Nomenclature: 'UNDLM_00127'
   📁 Rush: UNDLM_00127.mov
   ☁️  Uploadé vers Drive: 127_UNDLM_00127.jpg
   ✅ Image insérée dans Google Sheets
```

### Résumé final
```
🎉 TERMINÉ!
   Plans traités: 520
   Images générées: 485
   Ignorés (déjà présents): 25
   Erreurs: 10
```

## 🛠️ Maintenance

### Vérifier les permissions
```python
python scripts/check_drive_permissions.py
```

### Nettoyer les fichiers temporaires
```bash
rm -rf temp/thumbnails/*
```

### Régénérer les URLs cassées
```python
python scripts/fix_broken_thumbnails.py
```

## 🚨 Troubleshooting

### Problèmes fréquents

#### Rush non trouvé
```
❌ Rush non trouvé pour 'UNDLM_00001'
```
**Solution :** Vérifier la nomenclature dans le Google Sheet

#### Erreur ffmpeg
```
❌ Erreur ffmpeg: No such file or directory
```
**Solution :** Vérifier que le volume Lucid Link est monté

#### Permission Drive refusée
```
❌ Erreur upload Drive: Insufficient permissions
```
**Solution :** Vérifier les credentials Google et les scopes

### Debug mode
```python
# Activer les logs détaillés
POSTFLOW_DEBUG=true python scripts/generate_drive_thumbnails.py 1
```

## 🎬 Exemple complet

```bash
# 1. Vérifier l'accès aux rushs
ls /Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/ | head -5

# 2. Tester sur 3 plans
python scripts/generate_drive_thumbnails.py 3

# 3. Vérifier dans Google Sheets
# Les vignettes apparaissent dans la colonne VIGNETTE

# 4. Générer toutes les vignettes
python scripts/generate_drive_thumbnails.py all
```

## ✅ Avantages du système

- 🔄 **Automatique** - Aucune intervention manuelle
- 📱 **Responsive** - S'adapte à la taille des cellules
- 🔒 **Sécurisé** - Permissions Google Drive contrôlées
- 📊 **Intégré** - Directement dans le workflow Google Sheets
- ⚡ **Performant** - Optimisé pour de gros projets
- 🎯 **Intelligent** - Matching avancé des nomenclatures

---

**Prochaine étape :** [Guide utilisateur](../user-guides/README.md)
