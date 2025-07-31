# Tests PostFlow v4.1.5

## 🧪 Scripts de Test

Ce dossier contient les scripts de test pour valider les différentes fonctionnalités du pipeline PostFlow.

### Tests disponibles

- **`test_intelligent_tracking.py`** - Test du système de tracking intelligent
- **`test_postflow_intelligent.py`** - Test complet du pipeline avec analyse intelligente
- **`test_webhook_v4.py`** - Test des webhooks Frame.io API V4
- **`test_workflow_intelligent.py`** - Test du workflow complet avec commentaires intelligents

### Utilisation

```bash
# Depuis la racine du projet
python tests/test_webhook_v4.py
python tests/test_intelligent_tracking.py
```

### Prérequis

- Pipeline PostFlow configuré et fonctionnel
- Credentials Frame.io valides
- Google Sheets configuré
- Discord webhook configuré

### Architecture testée

- ✅ Event-driven architecture avec EventManager
- ✅ Auto-hooks Google Sheets et Discord
- ✅ Analyse intelligente cohérente des commentaires
- ✅ Word-boundary matching pour détection précise
- ✅ Webhooks Frame.io API V4
