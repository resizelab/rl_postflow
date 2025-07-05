# Configuration des Intégrations UNDLM PostFlow

## 🎯 Vue d'ensemble

Ce guide vous accompagne dans la configuration des intégrations Discord, Frame.io et Google Sheets pour le pipeline UNDLM PostFlow.

## 📦 Installation des Dépendances

### 1. Installation automatique

```bash
# Installer toutes les dépendances
pip install -r requirements.txt

# Ou utiliser le script de configuration
python configure_integrations.py
```

### 2. Installation manuelle

```bash
# Intégrations principales
pip install requests gspread google-auth google-auth-oauthlib discord-webhook

# Optionnel pour le développement
pip install pytest pytest-cov colorama pandas numpy
```

## 🎮 Configuration Discord

### Étapes de configuration

1. **Créer un serveur Discord** (ou utiliser un existant)
2. **Créer un webhook** :
   - Aller dans Paramètres du serveur > Intégrations > Webhooks
   - Cliquer sur "Nouveau webhook"
   - Choisir le channel (ex: #postproduction)
   - Copier l'URL du webhook

3. **Configurer le pipeline** :
   ```json
   {
     "discord": {
       "webhook_url": "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL",
       "channel_name": "postproduction",
       "notifications_enabled": true,
       "bot_name": "RL PostFlow Bot"
     }
   }
   ```

### Types de notifications

- **Début de traitement d'un plan**
- **Changement de statut** (en cours, terminé, erreur)
- **Fin de rendu** d'une séquence
- **Rapports quotidiens** de progression
- **Alertes d'erreur** du pipeline

### Test de la configuration

```bash
python configure_integrations.py
# Choisir Discord et suivre les instructions
```

## 🎬 Configuration Frame.io

### Étapes de configuration

1. **Créer un compte Frame.io** (ou utiliser un existant)
2. **Créer un token API** :
   - Aller dans Account Settings > API Tokens
   - Cliquer sur "Create New Token"
   - Nommer le token (ex: "UNDLM PostFlow")
   - Copier le token

3. **Créer un projet** :
   - Créer un nouveau projet Frame.io pour UNDLM
   - Copier l'ID du projet depuis l'URL

4. **Configurer le pipeline** :
   ```json
   {
     "frameio": {
       "api_token": "YOUR_API_TOKEN",
       "project_id": "YOUR_PROJECT_ID",
       "root_folder_id": "",
       "upload_enabled": true,
       "auto_notify": true
     }
   }
   ```

### Structure automatique

Le pipeline créera automatiquement :
```
UNDLM Project/
├── SC01_REVEIL_HOPITAL_JOUR/
│   ├── UNDLM_00001/
│   │   ├── WIP/
│   │   ├── FINAL/
│   │   └── REFERENCE/
│   └── UNDLM_00002/
└── SC02_COULOIR_HOPITAL_JOUR/
```

### Workflow de révision

1. **Upload automatique** des rendus
2. **Notifications** aux reviewers
3. **Collecte des commentaires** avec timecode
4. **Mise à jour du statut** selon les approbations

## 📊 Configuration Google Sheets

### Étapes de configuration

1. **Créer un projet Google Cloud** :
   - Aller sur [Google Cloud Console](https://console.cloud.google.com/)
   - Créer un nouveau projet ou utiliser un existant
   - Nommer le projet (ex: "UNDLM PostFlow")

2. **Activer les APIs** :
   - Aller dans APIs & Services > Library
   - Activer "Google Sheets API"
   - Activer "Google Drive API"

3. **Créer un compte de service** :
   - Aller dans IAM & Admin > Service Accounts
   - Créer un nouveau compte de service
   - Nommer le compte (ex: "undlm-postflow-bot")
   - Télécharger le fichier JSON des credentials

4. **Créer le Google Sheets** :
   - Créer un nouveau Google Sheets
   - Nommer le sheet (ex: "UNDLM Shot Tracking")
   - Partager le sheet avec l'email du compte de service (accès éditeur)
   - Copier l'ID du sheet depuis l'URL

5. **Configurer le pipeline** :
   ```json
   {
     "google_sheets": {
       "credentials_file": "path/to/credentials.json",
       "spreadsheet_id": "YOUR_SPREADSHEET_ID",
       "worksheet_name": "Shot Tracking",
       "sync_enabled": true,
       "auto_update": true,
       "backup_enabled": true
     }
   }
   ```

### Structure du sheet

| Colonne | Contenu | Exemple |
|---------|---------|---------|
| A | Shot ID | UNDLM_00001 |
| B | Scene | SC01_REVEIL_HOPITAL_JOUR |
| C | Description | Plan d'ouverture |
| D | Source File | A_0002C123X250401_112218G6_UNDLM.mov |
| E | Timecode In | 00:00:00:00 |
| F | Timecode Out | 00:00:05:12 |
| G | Duration | 00:00:05:12 |
| H | Status | IN_PROGRESS |
| I | Stage | VFX_PROCESSING |
| J | Progress % | 75 |
| K | Assigned To | Marie Dubois |
| L | Priority | HIGH |
| M | Notes | Ajout personnages |
| N | AE Project | 250705_SC01_REVEIL_HOPITAL_JOUR.aep |
| O | Last Updated | 2025-07-05 14:30 |
| P | Frame.io Link | https://app.frame.io/... |
| Q | Review Status | PENDING |
| R | Approval Date | 2025-07-05 |

### Synchronisation automatique

- **Mise à jour en temps réel** des statuts
- **Rapports quotidiens** de progression
- **Alertes** pour les retards
- **Backup automatique** des données

## 🔧 Configuration Complète

### Script de configuration automatique

```bash
# Lancer la configuration interactive
python configure_integrations.py

# Suivre les instructions pour chaque intégration
# Le script testera automatiquement chaque connexion
```

### Configuration manuelle

1. **Éditer `pipeline_config.json`** avec vos credentials
2. **Tester chaque intégration** :
   ```bash
   python test_integrations.py
   ```

### Vérification de la configuration

```bash
# Test complet du pipeline
python tests/setup_validation.py

# Test des intégrations uniquement
python test_integrations.py
```

## 🚀 Utilisation

### Dans le pipeline principal

```python
# Exemple d'utilisation dans main.py
from src.integrations.discord import DiscordNotifier
from src.integrations.frameio import FrameIOClient
from src.integrations.google_sheets import GoogleSheetsClient

# Initialisation
discord = DiscordNotifier(discord_config)
frameio = FrameIOClient(frameio_config)
sheets = GoogleSheetsClient(sheets_config)

# Notification Discord
discord.notify_shot_status_change(shot, previous_status)

# Upload vers Frame.io
frameio.upload_shot_version(shot_id, video_path, version)

# Mise à jour Google Sheets
sheets.update_shot_status(shot_id, new_status, stage, progress)
```

### Workflow automatique

1. **Début du traitement** → Notification Discord
2. **Progression** → Mise à jour Google Sheets
3. **Rendu terminé** → Upload Frame.io + Notification
4. **Révision** → Collecte des commentaires Frame.io
5. **Approbation** → Mise à jour finale Google Sheets

## 📋 Checklist de Configuration

### Discord
- [ ] Serveur Discord créé ou accessible
- [ ] Webhook configuré sur le bon channel
- [ ] URL du webhook ajoutée à la configuration
- [ ] Test de notification réussi

### Frame.io
- [ ] Compte Frame.io créé ou accessible
- [ ] Token API généré
- [ ] Projet Frame.io créé
- [ ] Configuration testée avec succès

### Google Sheets
- [ ] Projet Google Cloud créé
- [ ] APIs activées (Sheets + Drive)
- [ ] Compte de service créé
- [ ] Fichier JSON des credentials téléchargé
- [ ] Google Sheets créé et partagé
- [ ] Configuration testée avec succès

### Pipeline
- [ ] `requirements.txt` installé
- [ ] `pipeline_config.json` configuré
- [ ] Tests d'intégration réussis
- [ ] Pipeline principal testé

## 🆘 Dépannage

### Erreurs communes

**Discord : "Webhook not found"**
- Vérifier l'URL du webhook
- S'assurer que le webhook n'a pas été supprimé

**Frame.io : "Invalid token"**
- Vérifier que le token API est correct
- S'assurer que le token n'a pas expiré

**Google Sheets : "Permission denied"**
- Vérifier que le sheet est partagé avec le compte de service
- S'assurer que les APIs sont activées

### Logs de débogage

```bash
# Activer les logs détaillés
export PYTHONPATH=/path/to/rl_postflow
python -m logging.basicConfig level=DEBUG main.py
```

## 📚 Ressources

- [Documentation Discord Webhooks](https://discord.com/developers/docs/resources/webhook)
- [Documentation Frame.io API](https://docs.frame.io/)
- [Documentation Google Sheets API](https://developers.google.com/sheets/api)
- [Repository GitHub du projet](https://github.com/resizelab/rl_postflow)

---

**Support** : Pour toute question, consulter les logs du pipeline ou contacter l'équipe technique.
