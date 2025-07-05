# Données UNDLM PostFlow

Ce dossier contient toutes les données sources et générées pour le pipeline UNDLM PostFlow.

## 📁 Structure des données

### 📥 Données sources
- `shots.csv` - Fichier CSV principal avec 520 lignes (516 plans valides)
- `timeline` - Fichier de timeline (format à définir)

### 📊 Données générées
- `pipeline_status.json` - État détaillé du pipeline et statistiques des plans
- Fichiers générés par les exports et traitements

## 📋 Description des fichiers

### shots.csv
Fichier CSV principal contenant :
- **516 plans valides** avec nomenclature UNDLM_XXXXX
- **25 scènes uniques** 
- **299 fichiers sources** référencés
- Colonnes : nomenclature, scene, source_file, timecode_in, timecode_out, etc.

### pipeline_status.json
Fichier JSON généré automatiquement contenant :
- État de chaque plan (pending, in_progress, completed, etc.)
- Statistiques globales du pipeline
- Timestamps des dernières modifications
- Erreurs et warnings éventuels

## 🔄 Mise à jour automatique

Ces fichiers sont mis à jour automatiquement lors de l'exécution du pipeline :
- `pipeline_status.json` → Mis à jour à chaque traitement
- Nouveaux fichiers CSV peuvent être générés dans `output/`

## 📊 Format des données

### Structure CSV attendue
```csv
nomenclature,scene,source_file,timecode_in,timecode_out,description
UNDLM_00001,REVEIL HOPITAL - JOUR,A_0002C123X250401_112218G6_UNDLM.mov,01:00:15:12,01:00:18:03,Plan d'ouverture
```

### Structure JSON de statut
```json
{
  "nomenclature": "UNDLM_00001",
  "status": "pending",
  "stage": "source_verification",
  "last_updated": "2025-07-05T18:30:00",
  "errors": []
}
```

## ⚠️ Notes importantes

- Ne pas modifier manuellement `pipeline_status.json`
- Sauvegarder `shots.csv` avant toute modification
- Les fichiers volumineux sont ignorés par git (voir `.gitignore`)

---

*Dernière mise à jour : 05/07/2025*
