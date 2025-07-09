# Tests Frame.io - Organisation

Ce dossier contient les tests organisés pour l'intégration Frame.io v4.

## Tests principaux (racine)

- `test_frameio_main.py` - Test d'intégration complet (auth, structure, upload manager)
- `test_frameio_upload.py` - Test de la solution d'upload fonctionnelle (remote_upload)
- `test_file_processing.py` - Test du pipeline de traitement des fichiers
- `test_new_structure.py` - Test de création de structure de dossiers

## Tests de recherche/debug (frameio_upload_research/)

- `test_remote_upload.py` - Tests avec serveur local (ne fonctionne pas)
- `test_remote_public.py` - Tests avec URL publique (fonctionne)
- Autres tests de diagnostic pour résoudre le problème S3

## État actuel

✅ **Fonctionnel:**
- Authentification Frame.io v4
- Création de structure de dossiers
- Upload via `remote_upload` avec URL publique

❌ **Problématique:**
- Upload direct via `local_upload` (erreur S3 signature)
- Upload de fichiers locaux (besoin URL publique)

## Solution recommandée

Pour uploader des fichiers locaux, utiliser une de ces approches:
1. **ngrok** - Expose temporairement un serveur local
2. **Upload vers S3 temporaire** puis `remote_upload`
3. **Serveur de staging** accessible publiquement

## Utilisation

```bash
# Test complet de l'intégration
python test_frameio_main.py

# Test upload fonctionnel
python test_frameio_upload.py
```
