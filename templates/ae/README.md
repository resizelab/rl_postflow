# Templates After Effects

Ce dossier contient les templates After Effects utilisés par PostFlow.

## Templates disponibles :

### `postflow_template.aep`
- Template principal pour le workflow PostFlow
- Contient les compositions de base et les paramètres
- À personnaliser selon les besoins du projet

### `ebsynth_prep.aep`
- Template pour la préparation des séquences EbSynth
- Optimisé pour l'export des frames
- Paramètres de rendu préconfigurés

## Configuration :

1. Placer les fichiers `.aep` dans ce dossier
2. Modifier le chemin dans `config/integrations.json`
3. Ajuster les paramètres selon vos besoins

## Usage :

Les templates sont automatiquement utilisés par :
- `src/workflows/after_effects_workflow.py`
- `src/exporters/after_effects_exporter.py`

## Personnalisation :

Vous pouvez créer vos propres templates en :
1. Créant un nouveau fichier `.aep` 
2. L'ajoutant à la configuration
3. Adaptant les scripts d'export si nécessaire
