# Tests UNDLM PostFlow

Ce dossier contient tous les tests et scripts de validation pour le pipeline UNDLM PostFlow.

## Structure des tests

### 📋 Tests de validation
- `setup_validation.py` - Validation complète du setup et configuration
- `test_server_structure.py` - Test de la structure serveur LucidLink
- `test_integrations_simple.py` - Test des intégrations et nomenclatures

### 🚀 Exécution des tests

#### Exécuter tous les tests
```bash
# Depuis la racine du projet
python run_tests.py
```

#### Exécuter un test spécifique
```bash
# Validation complète
python tests/setup_validation.py

# Structure serveur
python tests/test_server_structure.py

# Intégrations
python tests/test_integrations_simple.py
```

## Description des tests

### setup_validation.py
Test complet qui vérifie :
- ✅ Accessibilité du volume LucidLink
- ✅ Structure de dossiers complète
- ✅ Données CSV (516 plans)
- ✅ Permissions lecture/écriture
- ⏳ Sources disponibles
- ⏳ Templates After Effects

### test_server_structure.py
Test spécifique de la structure serveur :
- 📁 Vérification de tous les dossiers critiques
- 📄 Présence des fichiers de configuration
- 🎬 Dossiers de scènes exemples
- 🔐 Test des permissions d'écriture
- 🔄 Simulation d'un workflow complet

### test_integrations_simple.py
Test des intégrations et nomenclatures :
- 🔗 Génération des chemins LucidLink
- 🎬 Convention de nommage After Effects
- 📁 Logique de structure des dossiers
- 📊 Intégration avec les données CSV

## Prérequis

- Volume LucidLink `o2b-undllm` monté sur `/Volumes/resizelab/o2b-undllm`
- Fichier `pipeline_config.json` configuré
- Données CSV dans `data/shots.csv`
- Python 3.7+

## Résultats attendus

Tous les tests doivent passer avec succès pour confirmer que :
1. Le volume LucidLink est accessible
2. La structure de dossiers est complète
3. Les données CSV sont correctement parsées
4. Les permissions sont configurées
5. Le pipeline est prêt pour la production

## En cas d'échec

Si un test échoue :
1. Vérifiez la connexion LucidLink
2. Confirmez le montage du volume `o2b-undllm`
3. Vérifiez la configuration dans `pipeline_config.json`
4. Exécutez `create_folder_structure.py` si nécessaire
5. Consultez les logs d'erreur pour plus de détails
