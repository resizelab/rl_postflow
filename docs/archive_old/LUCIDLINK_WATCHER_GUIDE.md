# Guide d'utilisation du Watcher LucidLink

## Vue d'ensemble

Le watcher LucidLink est un système avancé de surveillance des fichiers qui :
- Surveille en temps réel les exports sur LucidLink
- Détecte les nouveaux fichiers même quand le script n'était pas lancé (historique)
- Envoie des notifications Discord enrichies
- Maintient un état persistant entre les redémarrages

## Fonctionnalités

### 🔍 Surveillance en temps réel
- Détection automatique des nouveaux fichiers `.mov`
- Extraction intelligente de la nomenclature (UNDLM_XXXXX)
- Vérification du format et validation

### 📊 Scan historique
- Détection des fichiers ajoutés pendant que le watcher était arrêté
- Système de signatures pour éviter les doublons
- Persistance de l'état entre les sessions

### 🎭 Mapping des scènes
- Liaison automatique nomenclature ↔ nom de scène
- Chargement depuis le CSV principal du projet
- Affichage des vrais noms de scène dans les notifications

### 📢 Notifications Discord
- Messages enrichis avec embed
- Informations complètes : fichier, scène, version, heure
- Instructions d'action pour le workflow review

## Installation et Configuration

### Prérequis
```bash
pip install watchdog pandas
```

### Configuration
Le watcher utilise la configuration dans `config/integrations.json` :
```json
{
  "lucidlink": {
    "base_path": "/Volumes/resizelab/o2b-undllm"
  },
  "discord": {
    "webhook_url": "https://discord.com/api/webhooks/...",
    "username": "PostFlow BOT"
  }
}
```

## Utilisation

### 1. Démarrage simple
```bash
python scripts/start_watcher.py
```

### 2. Test des notifications
```bash
python scripts/start_watcher.py --test
```

### 3. Mode démonstration
```bash
python scripts/demo_watcher.py
```

### 4. Vérification de l'état
```bash
python scripts/enhance_watcher.py --state
```

## Structure des fichiers

### Scripts principaux
- `lucidlink_watcher.py` - Classe principale du watcher
- `start_watcher.py` - Lanceur avec vérifications
- `demo_watcher.py` - Mode démonstration
- `enhance_watcher.py` - Outils d'amélioration
- `test_watcher_complete.py` - Suite de tests

### Fichiers de données
- `data/watcher_state.json` - État persistant
- `data/shots.csv` - Mapping des scènes
- `data/review_state.json` - État du workflow review

## Workflow type

### 1. Démarrage du watcher
```bash
🎬 UNDLM PostFlow - Enhanced LucidLink Watcher
🔧 Checking Configuration...
✅ LucidLink path: /Volumes/resizelab/o2b-undllm/4_OUT/2_FROM_VFX/BY_SHOT
✅ Discord notifications enabled
✅ Scene mapping CSV found
🔍 Scanning for historical files...
✅ File watcher started
```

### 2. Détection d'un nouveau fichier
```
🔍 New file detected: UNDLM_00001_v003.mov
🔍 Nomenclature: UNDLM_00001
🎭 Scene: REVEIL HOPITAL - JOUR
📢 Discord notification sent
💾 State saved
```

### 3. Notification Discord
```
🎬 NOUVEAU FICHIER PRÊT
UNDLM_00001 v003 vient d'être exporté

📁 Fichier: UNDLM_00001_v003.mov
🎭 Scène: REVEIL HOPITAL - JOUR
🔢 Version: v003
📂 Dossier: BY_SHOT
🕒 Détecté à: 10:35:42
🎯 Status: Prêt pour review

❓ Action: Lancez python main.py --interactive et tapez 'review'
```

## Gestion des erreurs

### Fichiers non reconnus
- Les fichiers sans nomenclature UNDLM_XXXXX sont ignorés
- Un message d'avertissement est affiché
- Le fichier est marqué comme traité pour éviter les répétitions

### Problèmes de configuration
- Vérification automatique au démarrage
- Messages d'erreur explicites
- Arrêt propre si configuration invalide

### Persistence des données
- Sauvegarde automatique après chaque traitement
- Récupération en cas d'arrêt inattendu
- Signatures uniques pour éviter les doublons

## Monitoring et maintenance

### Vérifier l'état
```bash
python scripts/enhance_watcher.py --state
```

### Nettoyer l'historique
```bash
rm data/watcher_state.json
```

### Tester les notifications
```bash
python scripts/start_watcher.py --test
```

### Logs et débogage
Le watcher affiche des messages détaillés :
- 🔍 Détection
- ✅ Succès
- ⚠️ Avertissements
- ❌ Erreurs
- 📊 Statistiques

## Intégration avec le pipeline

Le watcher s'intègre parfaitement avec le pipeline principal :
1. **Détection automatique** → Nouveau fichier détecté
2. **Notification Discord** → Équipe informée
3. **Workflow review** → `python main.py --interactive` → `review`
4. **Upload Frame.io** → Fichier disponible pour review
5. **Notification finale** → Workflow terminé

## Dépannage

### Le watcher ne démarre pas
- Vérifier que le chemin LucidLink existe
- Vérifier la configuration Discord
- Vérifier les permissions de fichier

### Pas de notifications
- Tester avec `--test`
- Vérifier l'URL du webhook Discord
- Vérifier la connexion internet

### Fichiers non détectés
- Vérifier la nomenclature UNDLM_XXXXX
- Vérifier que le fichier est dans BY_SHOT
- Vérifier l'extension .mov

### État corrompu
- Supprimer `data/watcher_state.json`
- Redémarrer le watcher
- Il reconstruira l'état automatiquement

## Développement

### Ajouter de nouvelles fonctionnalités
1. Modifier `lucidlink_watcher.py`
2. Ajouter des tests dans `test_watcher_complete.py`
3. Mettre à jour la documentation

### Tests
```bash
python scripts/test_watcher_complete.py
python scripts/demo_watcher.py --scene
```

### Structure du code
- `LucidLinkWatcher` - Classe principale
- `_load_state()` / `_save_state()` - Persistence
- `_load_scene_mapping()` - CSV processing
- `scan_historical_files()` - Scan à froid
- `on_created()` - Événements temps réel
