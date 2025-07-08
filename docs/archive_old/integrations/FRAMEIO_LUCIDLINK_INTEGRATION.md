# Integration LucidLink → Frame.io

## 📋 Vue d'ensemble

Cette intégration automatise le workflow de upload des fichiers vidéo depuis LucidLink vers Frame.io, incluant :

1. **Parsing automatique** des noms de fichiers selon la nomenclature du projet
2. **Création automatique** de la structure de dossiers `/SCENE/SHOT/` dans Frame.io
3. **Upload optimisé** avec gestion d'erreurs et retry automatique
4. **Notifications Discord** enrichies avec métadonnées et liens de review
5. **Cache JSON local** pour éviter les doublons de dossiers

## 🏗️ Architecture

```
src/integrations/frameio/
├── parser.py          # Parsing des noms de fichiers
├── structure.py       # Gestion des dossiers Frame.io
├── upload.py          # Upload des fichiers
├── notifier.py        # Notifications Discord
├── integration.py     # Orchestrateur principal
└── oauth_auth.py      # Authentification Frame.io v4
```

## 🎯 Workflow Automatisé

### 1. Detection d'un fichier dans `/BY_SHOT/`
- Le watcher LucidLink détecte un nouveau fichier
- Exemple : `SC01_UNDLM_00412_V002.mov`

### 2. Parsing automatique
```python
# Extraction des métadonnées
metadata = parser.parse_filename("SC01_UNDLM_00412_V002.mov")
# Résultat :
# - scene_name: "SC01"
# - shot_id: "UNDLM_00412" 
# - version: "V002"
# - nomenclature: "SC01_UNDLM_00412_V002"
```

### 3. Création/récupération de la structure
```python
# Vérification dans le cache JSON local
folder_id = await structure_manager.get_or_create_folder_path("SC01", "UNDLM_00412")
# Crée si nécessaire :
# /SCENES/SC01/UNDLM_00412/
```

### 4. Upload du fichier
```python
# Upload avec métadonnées
upload_result = await upload_manager.upload_file_to_folder(
    file_path, folder_id, metadata
)
```

### 5. Notification Discord enrichie
```python
# Notification avec embed riche
await notifier.send_upload_success_notification(upload_result)
```

## 🚀 Utilisation

### Configuration
```python
config = {
    'frameio': {
        'account_id': 'your_account_id',
        'workspace_id': 'your_workspace_id',
        'project_id': 'your_project_id',
        'oauth': {
            'client_id': 'your_client_id',
            'client_secret': 'your_client_secret',
            'jwt_key': 'your_jwt_key'
        }
    },
    'discord': {
        'webhook_url': 'https://discord.com/api/webhooks/...'
    }
}
```

### Upload d'un fichier unique
```python
from src.integrations.frameio import create_frameio_integration

# Créer l'intégration
integration = create_frameio_integration(config)

# Traiter un fichier
result = await integration.process_file("/path/to/SC01_UNDLM_00412_V002.mov")

if result['status'] == 'success':
    print(f"✅ Upload réussi : {result['upload_result']['review_link']}")
else:
    print(f"❌ Erreur : {result['error']}")
```

### Upload en batch
```python
files = [
    "/path/to/SC01_UNDLM_00412_V002.mov",
    "/path/to/SC02_UNDLM_00413_V001.mov",
    "/path/to/SC01_UNDLM_00412_V003.mov"
]

# Traitement parallèle (max 3 simultanés)
results = await integration.process_batch(files, max_concurrent=3)

success_count = sum(1 for r in results if r['status'] == 'success')
print(f"✅ {success_count}/{len(results)} fichiers uploadés")
```

## 📁 Structure Frame.io Générée

```
Projet RL PostFlow
└── SCENES/
    ├── SC01/
    │   ├── UNDLM_00412/
    │   │   ├── SC01_UNDLM_00412_V001.mov
    │   │   ├── SC01_UNDLM_00412_V002.mov
    │   │   └── SC01_UNDLM_00412_V003.mov
    │   └── UNDLM_00413/
    │       └── SC01_UNDLM_00413_V001.mov
    └── SC02/
        └── UNDLM_00414/
            └── SC02_UNDLM_00414_V001.mov
```

## 📝 Nomenclature Supportée

### Format Principal
- `SCENE_SHOT_VERSION.ext`
- Exemple : `SC01_UNDLM_00412_V002.mov`

### Formats Complexes
- `13H49_-_RECUPERATION_DES_2_SURVIVANTS_S01_V001.mov`
- `2EME_MAYDAY_EXT_-_NUIT_AMERICAINE_S03_V005.mp4`
- `DOUANE_MER_-_JOUR_S02_V001.prores`

### Extensions Supportées
- `.mov`, `.mp4`, `.avi`, `.mkv`, `.mxf`
- `.prores`, `.dnxhd`, `.r3d`, `.braw`

## 🔧 Configuration du Cache

Le fichier `config/frameio_structure.json` stocke les `folder_id` :

```json
{
  "project_id": "proj_12345",
  "project_name": "RL PostFlow",
  "scenes_folder_id": "fldr_scenes_root",
  "structure": {
    "scenes": {
      "SC01": {
        "folder_id": "fldr_sc01_id",
        "created_at": "2024-01-15T10:30:00Z",
        "shots": {
          "UNDLM_00412": {
            "folder_id": "fldr_shot_id",
            "created_at": "2024-01-15T10:31:00Z"
          }
        }
      }
    }
  },
  "last_updated": "2024-01-15T10:31:00Z"
}
```

## 💬 Notifications Discord

### Notification de Succès
```
✅ Upload Frame.io Réussi

📋 Informations du Plan
Scène: SC01
Plan: UNDLM_00412
Version: V002

📁 Fichier
Nom: SC01_UNDLM_00412_V002.mov
Taille: 245.8 MB
Nomenclature: SC01_UNDLM_00412_V002

🔗 Liens
🎥 Voir sur Frame.io (lien cliquable)

📂 Emplacement
Dossier: SCENES/SC01/UNDLM_00412/
Projet: proj_12345

⏰ Informations Upload
Uploadé le: 15/01/2024 10:31:25
Statut: ready

🏷️ Tags
quicktime, exterieur, nuit
```

### Notification d'Erreur
```
❌ Erreur Upload Frame.io

📋 Informations du Plan
Scène: SC01
Plan: UNDLM_00412
Version: V002

🚨 Erreur
Fichier trop volumineux (limite: 500MB)
```

## 🔧 Variables d'Environnement

```bash
# Frame.io OAuth
export FRAMEIO_ACCOUNT_ID="your_account_id"
export FRAMEIO_WORKSPACE_ID="your_workspace_id"
export FRAMEIO_PROJECT_ID="your_project_id"
export FRAMEIO_CLIENT_ID="your_client_id"
export FRAMEIO_CLIENT_SECRET="your_client_secret"
export FRAMEIO_JWT_KEY="your_jwt_key"

# Discord
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."

# Options
export ENABLE_DISCORD_NOTIFICATIONS="true"
export MAX_CONCURRENT_UPLOADS="3"
export FRAMEIO_CHUNK_SIZE="8388608"  # 8MB
export AUTO_CLEANUP_UPLOADS="false"
```

## 📊 Logging et Monitoring

### Logs Structurés
```
2024-01-15 10:30:15 - frameio.parser - INFO - ✅ Fichier parsé: SC01_UNDLM_00412_V002.mov → SC01_UNDLM_00412_V002
2024-01-15 10:30:16 - frameio.structure - INFO - ✅ Structure créée: SC01/UNDLM_00412 → fldr_shot_id
2024-01-15 10:30:45 - frameio.upload - INFO - ✅ Upload réussi: SC01_UNDLM_00412_V002.mov → file_12345
2024-01-15 10:30:46 - frameio.notifier - INFO - ✅ Notification Discord envoyée
```

### Statut de l'Intégration
```python
status = await integration.get_processing_status()
print(f"Scènes: {status['folder_structure']['scenes_count']}")
print(f"Plans: {status['folder_structure']['shots_count']}")
```

## 🧪 Tests et Démo

### Lancer la Démo
```bash
cd /path/to/rl_postflow
python examples/frameio_lucidlink_demo.py
```

### Menu de Démo
```
🎬 Frame.io Integration Demo
==================================================
1. Test du parser seul
2. Test du gestionnaire de structure
3. Upload d'un fichier unique
4. Upload en batch
5. Tout tester
==================================================
```

## 🚨 Gestion d'Erreurs

### Erreurs de Parsing
- Nom de fichier non conforme → Skip avec log
- Extension non supportée → Skip avec log

### Erreurs d'Upload
- Fichier trop volumineux → Erreur avec notification
- Réseau indisponible → Retry automatique (3 tentatives)
- Authentification expirée → Refresh token automatique

### Erreurs de Structure
- Dossier inaccessible → Tentative de recréation
- Quota dépassé → Notification et pause

## 🔄 Intégration avec le Watcher LucidLink

### Point d'Entrée
```python
# Dans le watcher LucidLink existant
from src.integrations.frameio.integration import create_frameio_integration

# Callback pour nouveaux fichiers
async def on_new_file(file_path: str):
    """Appelé quand un nouveau fichier est détecté"""
    if file_path.endswith(('.mov', '.mp4', '.avi')):
        result = await frameio_integration.process_file(file_path)
        if result['status'] == 'success':
            logger.info(f"✅ Fichier uploadé: {file_path}")
        else:
            logger.error(f"❌ Échec upload: {result['error']}")
```

### Configuration du Watcher
```python
# Configuration du watcher pour BY_SHOT
watch_paths = [
    "/path/to/lucidlink/BY_SHOT/"
]

# Filtres
file_patterns = ["*.mov", "*.mp4", "*.avi", "*.mkv", "*.prores"]
```

## 📋 Checklist de Déploiement

### ✅ Prérequis
- [ ] Frame.io OAuth configuré (client_id, client_secret, jwt_key)
- [ ] Variables d'environnement configurées
- [ ] Discord webhook configuré
- [ ] Accès au workspace Frame.io

### ✅ Tests
- [ ] Parser fonctionne avec vos noms de fichiers
- [ ] Structure de dossiers se crée correctement
- [ ] Upload réussi avec un petit fichier test
- [ ] Notifications Discord reçues
- [ ] Cache JSON se met à jour

### ✅ Production
- [ ] Monitoring des logs activé
- [ ] Backup du cache JSON configuré
- [ ] Limite de concurrence ajustée
- [ ] Nettoyage automatique configuré (optionnel)

## 🐛 Dépannage

### Problèmes Courants

**Erreur: "account_id manquant"**
```bash
export FRAMEIO_ACCOUNT_ID="your_account_id"
```

**Erreur: "Impossible de parser le nom du fichier"**
- Vérifiez que le nom respecte le format `SCENE_SHOT_VERSION.ext`
- Consultez les logs pour voir les patterns testés

**Erreur: "Échec création placeholder"**
- Vérifiez les permissions Frame.io
- Contrôlez les quotas du workspace

**Pas de notification Discord**
- Vérifiez l'URL du webhook
- Contrôlez les permissions du bot Discord

## 📚 Documentation Avancée

### Personnalisation du Parser
```python
# Ajouter de nouveaux patterns
parser.custom_patterns = [
    re.compile(r'^CUSTOM_(?P<scene_name>.*?)_(?P<shot_number>\d+)_(?P<version>\d+)\.(?P<extension>\w+)$')
]
```

### Hooks Personnalisés
```python
# Hook avant upload
async def before_upload(file_path: str, metadata: FileMetadata):
    """Appelé avant chaque upload"""
    # Validation personnalisée
    pass

# Hook après upload
async def after_upload(upload_result: dict):
    """Appelé après chaque upload réussi"""
    # Post-processing personnalisé
    pass
```

## 🔗 Liens Utiles

- [Frame.io API v4 Documentation](https://docs.frame.io/reference/api-v4)
- [Adobe IMS OAuth 2.0](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/OAuth/OAuth.md)
- [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)

---

*Cette intégration a été développée pour automatiser le workflow LucidLink → Frame.io du pipeline RL PostFlow. Elle respecte les best practices de l'API Frame.io v4 et inclut une gestion robuste des erreurs.*
