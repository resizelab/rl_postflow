# Frame.io Integration - API v2

## 🎬 Version de l'API

PostFlow utilise **Frame.io API v2**, qui est la version actuelle et stable de l'API Frame.io.

### Compatibilité
- ✅ **API v2** (version actuelle)
- ✅ Rate limiting automatique 
- ✅ Retry avec backoff exponentiel
- ✅ Gestion des erreurs 429
- ✅ Headers de rate limit supportés

## 🔧 Configuration

### 1. Obtenir un token d'API

1. Connectez-vous au [Developer Portal Frame.io](https://developer.frame.io/)
2. Créez un Developer Token
3. Le token commence par `fio-u-` pour les tokens utilisateur

### 2. Configuration du projet

```json
{
    "frameio": {
        "api_token": "fio-u-YOUR_DEVELOPER_TOKEN_HERE",
        "project_id": "12345678-1234-1234-1234-123456789abc",
        "root_folder_id": "87654321-4321-4321-4321-cba987654321",
        "upload_enabled": true
    }
}
```

### 3. Test de connexion

```bash
cd scripts
python validate_frameio.py
```

## ⚡ Rate Limits

Frame.io API v2 applique les limites suivantes :

| Endpoint | Limite |
|----------|--------|
| Assets - Create | 5 req/sec, 1000/min |
| Assets - Update | 10 req/sec, 1000/min |
| Comments - Create | 100/min |
| General - Read | 200/min |

### Gestion automatique

PostFlow gère automatiquement :
- ✅ Délai minimum entre requêtes (100ms)
- ✅ Monitoring des headers `x-ratelimit-*`
- ✅ Retry automatique avec backoff exponentiel
- ✅ Logs des problèmes de rate limiting

## 🚀 Fonctionnalités

### Upload de fichiers
```python
client = FrameIOClient(config)
asset_id = client.upload_video("/path/to/video.mov", folder_id)
```

### Création de structure de dossiers
```python
folder_id = client.create_shot_folder_structure("UNDLM_12345")
```

### Ajout de commentaires
```python
client.add_comment(asset_id, "Feedback from PostFlow", timecode="00:01:30:15")
```

## 🔍 Endpoints utilisés

- `GET /v2/me` - Authentification
- `GET /v2/projects/{id}` - Informations projet  
- `POST /v2/assets` - Upload de fichiers
- `POST /v2/comments` - Ajout de commentaires
- `PUT /v2/assets/{id}` - Mise à jour d'assets

## 📊 Monitoring

Le dashboard PostFlow affiche :
- ✅ Statut de connexion Frame.io
- ✅ Nombre d'uploads réussis/échoués
- ✅ Rate limiting en cours
- ✅ Erreurs d'API

## 🔧 Dépannage

### Erreur 401 - Unauthorized
- Vérifiez que le token API est correct
- Assurez-vous que le token commence par `fio-u-`

### Erreur 403 - Forbidden  
- Vérifiez les permissions sur le projet
- Confirmez que l'utilisateur a accès au projet

### Erreur 429 - Rate Limited
- PostFlow gère automatiquement ces erreurs
- Les requêtes sont automatiquement relancées

### Erreur 404 - Not Found
- Vérifiez que `project_id` et `root_folder_id` existent
- Confirmez que les assets n'ont pas été supprimés

## 📚 Ressources

- [Documentation Frame.io API v2](https://developer.frame.io/api/reference/)
- [SDK Python officiel](https://github.com/Frameio/python-frameio-client)
- [Guide de démarrage rapide](https://developer.frame.io/api/reference/getting-started/)
- [Postman Collection](https://www.getpostman.com/collections/c2dfffb88990a9dc34c2)
