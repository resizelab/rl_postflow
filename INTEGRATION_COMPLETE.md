# PostFlow v1.0 - Structure Modulaire

## 🎯 Nouvelles Fonctionnalités Implémentées

### 1. 🔗 Liens de review Frame.io
- **Fonctionnalité** : Récupération automatique des liens de review après upload
- **Emplacement** : `src/integrations/frameio/upload.py`
- **Méthodes** :
  - `get_file_review_link()` : Génère le lien de review
  - `get_file_share_link()` : Crée un lien de partage public
  - `enrich_file_with_links()` : Enrichit l'objet FrameIOFile avec les liens
- **Utilisation** : Les liens sont automatiquement ajoutés lors de l'upload

### 2. 🧑‍💻 Structure modulaire Google Sheets
- **Remplacement** : `google_sheets.py` → Structure modulaire dans `src/integrations/sheets/`
- **Modules** :
  - `auth.py` : Gestion authentification OAuth/Service Account
  - `users.py` : Fonctions utilisateurs et attribution
  - `status.py` : Suivi des statuts de plans
- **Fonctions clés** :
  - `get_assigned_user(shot_id)` : Récupère l'utilisateur assigné
  - `get_user_by_discord_id(discord_id)` : Recherche par Discord ID

### 3. 👥 Mentions automatiques Discord
- **Fonctionnalité** : Mention automatique du superviseur assigné
- **Emplacement** : `src/integrations/discord/notifier.py`
- **Format** : `Hey <@{discord_id}> 🎬 Le plan UNDLM_00412 (SC01) v002 est disponible pour review`
- **Intégration** : Utilise `get_assigned_user()` pour récupérer le Discord ID

### 4. 🤖 Bot Discord modulaire
- **Nouveau module** : `src/integrations/discord/bot.py`
- **Fonctionnalités** :
  - Connexion via `DISCORD_BOT_TOKEN`
  - Commandes : `!ping`, `!status`, `!help`
  - Envoi de messages avec mentions
  - Notifications enrichies avec embeds
- **Coexistence** : Le webhook Discord reste actif

## 📦 Nouvelle Structure

```
src/
├── integrations/
│   ├── frameio/
│   │   ├── upload.py        # ✅ Enrichi avec liens review
│   │   ├── auth.py
│   │   └── structure.py
│   ├── discord/
│   │   ├── __init__.py      # ✅ Nouveau module
│   │   ├── bot.py           # ✅ Bot Discord complet
│   │   └── notifier.py      # ✅ Notificateur avec mentions
│   ├── sheets/
│   │   ├── __init__.py      # ✅ Nouveau module
│   │   ├── auth.py          # ✅ Authentification
│   │   ├── users.py         # ✅ Gestion utilisateurs
│   │   └── status.py        # ✅ Suivi statuts
│   ├── discord_legacy.py    # 📦 Ancien fichier renommé
│   └── ...
├── examples/
│   └── complete_integration.py  # ✅ Exemple d'intégration complète
└── scripts/
    ├── test_new_integration.py  # ✅ Tests nouvelles fonctionnalités
    └── dev/
        └── google_sheets_legacy.py  # 📦 Ancien fichier archivé
```

## 🔧 Nettoyage Effectué

### Fichiers déplacés/archivés :
- ✅ `google_sheets.py` → `scripts/dev/google_sheets_legacy.py`
- ✅ `discord.py` → `discord_legacy.py`
- ✅ `test_dashboard.py` → `tests/test_dashboard.py`

### Fichiers de test réorganisés :
- ✅ Tests dans `/tests/` au lieu de `/scripts/`
- ✅ Scripts de debug dans `/scripts/dev/`

## 🎯 Flux de Travail Type

```python
# 1. Upload vers Frame.io avec liens
frameio_file = await upload_manager.upload_file(shot_id, file_path, scene_name)

# 2. Récupération utilisateur assigné
assigned_user = get_assigned_user(shot_id)
discord_id = assigned_user.get('discord_id')

# 3. Notification Discord avec mention
notifier.notify_shot_upload_complete(
    shot_nomenclature=shot_id,
    scene_name=scene_name,
    version=version,
    frameio_link=frameio_file.review_url,
    mention_user_id=discord_id
)

# 4. Mise à jour Google Sheets
sheets_tracker.update_frameio_link(shot_id, frameio_file.review_url)
```

## 🚀 Utilisation

### Configuration requise :
```bash
# Frame.io (existant)
FRAMEIO_ACCOUNT_ID=your-account-id
FRAMEIO_WORKSPACE_ID=your-workspace-id

# Discord Bot (nouveau)
DISCORD_BOT_TOKEN=your-bot-token
DISCORD_WEBHOOK_URL=your-webhook-url

# Google Sheets (existant)
GOOGLE_SHEETS_CREDENTIALS=config/credentials.json
GOOGLE_SHEETS_ID=your-spreadsheet-id
```

### Test complet :
```bash
python scripts/test_new_integration.py
```

### Exemple d'intégration :
```bash
python examples/complete_integration.py
```

## 📋 Worksheet "Users" Google Sheets

Structure recommandée :
```
| Name          | Discord ID      | Email              | Role       | Department | Active |
|---------------|-----------------|--------------------|-----------|-----------|---------| 
| John Doe      | 123456789012345 | john@example.com   | Supervisor | VFX       | TRUE    |
| Jane Smith    | 987654321098765 | jane@example.com   | Artist     | VFX       | TRUE    |
```

## 🎉 Résultat

Le système PostFlow dispose maintenant d'une architecture modulaire et professionnelle avec :
- ✅ Intégration Frame.io v4 avec liens de review
- ✅ Notifications Discord avec mentions utilisateur
- ✅ Gestion des utilisateurs via Google Sheets
- ✅ Code organisé et maintenable
- ✅ Tests et exemples complets

**Status : Prêt pour la production ! 🚀**
