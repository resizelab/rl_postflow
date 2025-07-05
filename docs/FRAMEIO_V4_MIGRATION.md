# Migration Frame.io API v2 → v4

## 🚀 Guide de migration complet

### ⚠️ **Changements critiques**

Frame.io API v4 (Adobe) est **incompatible** avec v2. Migration complète requise.

## 🔄 **Principales différences**

| Aspect | API v2 | API v4 |
|--------|--------|--------|
| **Authentification** | Bearer Token simple | OAuth 2.0 + Adobe IMS |
| **URL de base** | `https://api.frame.io/v2` | `https://api.frame.io/v4` |
| **Hiérarchie** | Project → Assets | Account → Workspace → Project → Folder → File |
| **Upload** | `POST /assets` | `POST /files` + PUT upload_url |
| **Headers** | `x-ratelimit-*` | `X-RateLimit-*` |
| **Pagination** | Page-based | Cursor-based |
| **Scope** | Token global | Scopes granulaires |

## 📋 **Étapes de migration**

### **1. Configuration initiale**

```bash
# Configurer Frame.io v4 avec OAuth
cd scripts
python setup_frameio_v4.py
```

### **2. Obtenir les credentials OAuth**

1. Aller sur [Adobe Developer Console](https://developer.adobe.com/frameio/)
2. Créer une nouvelle application Frame.io
3. Récupérer `Client ID` et `Client Secret`
4. Configurer l'URL de redirection: `http://localhost:8080/oauth/callback`

### **3. Configuration des scopes OAuth**

```json
{
    "scope": [
        "account.read",
        "workspace.read", 
        "project.read",
        "file.read",
        "file.create",
        "comment.create",
        "comment.read"
    ]
}
```

### **4. Test de l'intégration**

```bash
# Valider l'API v4
python validate_frameio_v4.py

# Dashboard avec support v4
python dashboard.py
# Aller sur http://localhost:5000/api/frameio/status
```

## 🔧 **Code de migration**

### **Ancien code (v2)**
```python
from src.integrations.frameio import FrameIOClient

config = {
    "api_token": "fio-u-xxx",
    "project_id": "xxx"
}
client = FrameIOClient(config)
client.upload_video("/path/to/video.mov", folder_id)
```

### **Nouveau code (v4)**
```python
from src.integrations.frameio_v4 import FrameIOv4Client

config = {
    "client_id": "xxx",
    "client_secret": "xxx", 
    "access_token": "xxx",
    "project_id": "xxx"
}
client = FrameIOv4Client(config)
client.upload_file("/path/to/video.mov", folder_id)
```

## 🎯 **Fonctionnalités v4**

### ✅ **Nouvelles capacités**
- OAuth 2.0 sécurisé avec refresh automatique
- Hiérarchie compte/workspace/projet
- Checksums de fichiers automatiques
- Métadonnées personnalisées avancées
- Gestion granulaire des permissions
- Rate limiting amélioré

### ✅ **Compatibilité PostFlow**
- Upload de shots avec structure de dossiers
- Commentaires temporels
- Intégration workflow VFX
- Dashboard de monitoring
- Gestion d'erreurs robuste

## 🔄 **Stratégie de déploiement**

### **Option 1 : Migration complète (Recommandée)**
```bash
# 1. Sauvegarder la config v2
cp config/frameio_config.json config/frameio_v2_backup.json

# 2. Configurer v4
python scripts/setup_frameio_v4.py

# 3. Tester v4
python scripts/validate_frameio_v4.py

# 4. Mettre à jour le code principal
# Remplacer les imports frameio par frameio_v4
```

### **Option 2 : Déploiement parallèle**
```python
# Supporter les deux versions
try:
    from src.integrations.frameio_v4 import FrameIOv4Client as FrameIOClient
    API_VERSION = "v4"
except ImportError:
    from src.integrations.frameio import FrameIOClient
    API_VERSION = "v2"
```

## 🐛 **Dépannage**

### **Erreur OAuth**
```bash
# Regénérer les tokens
python scripts/setup_frameio_v4.py
```

### **Erreur de scopes**
```json
// Vérifier les scopes dans frameio_v4_config.json
"scope": ["account.read", "workspace.read", "project.read", "file.create"]
```

### **Erreur de hiérarchie**
```python
# v4 nécessite account_id et workspace_id
accounts = client.get_accounts()
workspaces = client.get_workspaces(account_id)
projects = client.get_projects(workspace_id)
```

## 📊 **Monitoring de la migration**

Le dashboard PostFlow affiche maintenant :
- ✅ Statut v2 et v4 en parallèle
- ✅ OAuth status v4
- ✅ Projets disponibles dans les deux versions
- ✅ Erreurs de migration

Endpoints dashboard :
- `GET /api/frameio/status` - Statut des deux versions
- `POST /api/frameio/v4/setup` - Initier OAuth v4
- `GET /api/frameio/projects` - Projets v2 et v4

## 🎉 **Avantages de la migration**

### **Sécurité**
- ✅ OAuth 2.0 avec refresh automatique
- ✅ Scopes granulaires
- ✅ Intégration Adobe IMS

### **Performance**
- ✅ Rate limiting optimisé
- ✅ Checksums automatiques
- ✅ Upload en streaming

### **Fonctionnalités**
- ✅ Métadonnées enrichies
- ✅ Hiérarchie flexible
- ✅ Gestion avancée des permissions

## 📚 **Ressources**

- [Adobe Frame.io API v4 Docs](https://developer.adobe.com/frameio/api/current/)
- [Guide OAuth Frame.io](https://developer.adobe.com/frameio/docs/getting-started/authentication/)
- [Scopes disponibles](https://developer.adobe.com/frameio/docs/getting-started/scopes/)
- [Rate Limits v4](https://developer.adobe.com/frameio/docs/getting-started/rate-limits/)

## ⚡ **Migration rapide**

```bash
# Setup complet v4 en 5 minutes
cd scripts

# 1. Configuration OAuth
python setup_frameio_v4.py

# 2. Test complet
python validate_frameio_v4.py

# 3. Dashboard avec v4
cd ..
python dashboard.py
```

🎬 **Frame.io v4 ready!** 🚀
