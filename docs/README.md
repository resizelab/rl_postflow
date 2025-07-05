# Documentation UNDLM PostFlow

Ce dossier contient toute la documentation du projet UNDLM PostFlow.

## 📁 Structure de la documentation

### 📋 Documents de configuration
- `SETUP_SUMMARY.md` - Résumé complet de la configuration et du setup
- `arbo_undlm_proposed.txt` - Arborescence proposée pour le serveur LucidLink

### 📊 Données du pipeline
- Les données générées se trouvent dans [`../data/`](../data/)
- `pipeline_status.json` - État du pipeline et statistiques (dans `data/`)

### 🎯 Guides et procédures
- Configuration du volume LucidLink `o2b-undllm`
- Convention de nommage UNDLM_XXXXX
- Workflow de post-production

## 🚀 Quick Start

1. **Vérifier la configuration**
   ```bash
   python tests/setup_validation.py
   ```

2. **Tester la structure serveur**
   ```bash
   python tests/test_server_structure.py
   ```

3. **Exécuter tous les tests**
   ```bash
   python run_tests.py
   ```

## 📊 État actuel du projet

- ✅ Volume LucidLink : `o2b-undllm` accessible
- ✅ Structure de dossiers : complète (75 dossiers créés)
- ✅ Pipeline Python : fonctionnel (516 plans prêts)
- ✅ Tests : 3/3 passent avec succès
- ⏳ Sources : à ajouter dans `2_IN/_FROM_GRADING/UNDLM_SOURCES/`
- ⏳ Templates AE : à créer dans `3_PROJECTS/2_VFX/TEMPLATES/`

## 📍 Chemins importants

- **Volume LucidLink** : `/Volumes/resizelab/o2b-undllm`
- **Configuration** : `pipeline_config.json`
- **Données CSV** : `data/shots.csv`
- **Tests** : `tests/`
- **Documentation** : `docs/`

## 🔗 Liens utiles

- [README principal](../README.md)
- [Tests](../tests/README.md)
- [Configuration serveur](../../Volumes/resizelab/o2b-undllm/1_REF_FILES/1_BRIEFS_AND_REPORTS/README_STRUCTURE.md)

---

*Dernière mise à jour : 05/07/2025*
