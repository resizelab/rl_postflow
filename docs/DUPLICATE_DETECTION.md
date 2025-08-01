# Détection de Doublons et Remplacements Frame.io

## Vue d'ensemble

Cette fonctionnalité permet de détecter automatiquement :
- **Doublons exacts** : Fichiers avec le même nom et le même contenu
- **Remplacements** : Fichiers avec le même nom mais un contenu différent 
- **Nouveaux fichiers** : Fichiers qui n'existent pas encore sur Frame.io

## Fonctionnement

### 1. Vérification lors de l'upload

Avant chaque upload vers Frame.io, le système :

1. **Calcule le hash SHA256** du fichier local
2. **Interroge l'API Frame.io** pour chercher des fichiers avec le même nom 
3. **Compare les métadonnées** (taille, date de modification)
4. **Compare les hashs** si disponibles
5. **Prend une décision** d'upload basée sur les politiques

### 2. Politiques de gestion

#### Nouveau fichier
```
✅ UPLOAD AUTORISÉ - Aucun doublon détecté
```

#### Doublon exact (même hash)
```
🚫 UPLOAD REFUSÉ - Fichier identique déjà présent
💡 Suggestion: Vérifiez si c'est une nouvelle version (v002, v003, etc.)
```

#### Remplacement détecté
```
⚠️ UPLOAD AUTORISÉ - Remplacement de fichier détecté
🎯 L'ancien fichier sera écrasé sur Frame.io
```

## Exemple de logs

### Nouveau fichier
```
🔍 Vérification doublons pour: SQ17_UNDLM_00306_v002.mov
📊 Hash local: a1b2c3d4e5f6g7h8...
📂 15 fichiers trouvés dans le dossier
✅ Aucun doublon - Upload autorisé pour: SQ17_UNDLM_00306_v002.mov
```

### Remplacement détecté
```
🔍 Vérification doublons pour: SQ17_UNDLM_00306_v001.mov
📊 Hash local: x9y8z7w6v5u4t3s2...
📂 15 fichiers trouvés dans le dossier
⚠️ Fichier existant trouvé: SQ17_UNDLM_00306_v001.mov
🔄 Détection remplacement potentiel:
   - Taille locale: 52428800 vs distante: 45678900
   - Hash local: x9y8z7w6v5u4t3s2...
📊 Hash distant trouvé: a1b2c3d4e5f6g7h8...
🚨 Hashs différents - Contenu modifié détecté!
⚠️ UPLOAD AUTORISÉ - Remplacement de fichier détecté
```

### Doublon exact
```
🔍 Vérification doublons pour: SQ17_UNDLM_00306_v001.mov
📊 Hash local: a1b2c3d4e5f6g7h8...
📂 15 fichiers trouvés dans le dossier
⚠️ Fichier existant trouvé: SQ17_UNDLM_00306_v001.mov
📊 Hash distant trouvé: a1b2c3d4e5f6g7h8...
✅ Hashs identiques - Même contenu
🚫 UPLOAD REFUSÉ - Fichier identique déjà présent: SQ17_UNDLM_00306_v001.mov
```

## Critères de détection

### Remplacement détecté si :

1. **Taille différente** : `taille_locale != taille_distante`
2. **Date plus récente** : `fichier_local` plus récent que `fichier_distant`
3. **Hash différent** : `hash_local != hash_distant` (si disponible)

### Avantages

- **Évite les doublons** inutiles sur Frame.io
- **Détecte les remplacements** de contenu
- **Optimise l'espace** de stockage
- **Améliore les performances** en évitant les uploads redondants
- **Traçabilité complète** avec logs détaillés

### Sécurité

- **Hash SHA256** pour garantir l'intégrité du contenu
- **Validation de nomenclature** toujours appliquée
- **Logs détaillés** pour audit et debugging
- **Gestion d'erreurs** robuste avec fallback

## Configuration

Aucune configuration supplémentaire requise. La fonctionnalité est activée automatiquement pour tous les uploads Frame.io.

## Test

Utiliser le script `test_duplicate_detection.py` pour tester la fonctionnalité :

```bash
python test_duplicate_detection.py
```

## Intégration

La détection est intégrée dans :
- `upload_file_production()` - Upload principal
- `upload_file_to_folder()` - Upload vers dossier spécifique

## Performance

- **Calcul de hash** : ~1-2 secondes pour un fichier de 50MB
- **Requête API** : ~200-500ms selon la latence
- **Impact minimal** sur les performances d'upload
