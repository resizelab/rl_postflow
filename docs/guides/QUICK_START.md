# 🚀 Guide de Démarrage Rapide - RL PostFlow

## 📋 Prérequis

- **Python 3.8+** installé
- **LucidLink** configuré et monté
- **Compte Frame.io** avec accès API
- **Webhook Discord** (optionnel)

## ⚡ Installation en 5 minutes

### 1. Cloner le projet

```bash
git clone https://github.com/your-repo/rl_postflow.git
cd rl_postflow
```

### 2. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 3. Configuration Frame.io OAuth

```bash
# Copier votre fichier de configuration OAuth
cp your-oauth-config.json data/890CarmineWhitefish-1845895-OAuth Web App.json
```

### 4. Configuration des intégrations

```bash
# Copier le fichier d'exemple
cp config/integrations.json.example config/integrations.json

# Éditer avec vos paramètres
nano config/integrations.json
```

**Configuration minimale :**
```json
{
  "frameio": {
    "default_project_id": "your-project-id",
    "default_workspace_id": "your-workspace-id"
  },
  "lucidlink": {
    "mount_path": "/path/to/lucidlink",
    "watch_directories": ["Projects", "Renders"]
  }
}
```

### 5. Premier test

```bash
# Tester l'authentification Frame.io
python -c "from src.integrations.frameio import create_frameio_auth; auth = create_frameio_auth(); print('✅ Auth OK' if auth.oauth_config else '❌ Auth Error')"

# Lancer le pipeline
python main.py
```

## 🎯 Utilisation Basique

### Commandes principales

```bash
# Démarrage complet
python main.py

# Mode watcher uniquement
python main.py --watch-only

# Mode upload uniquement
python main.py --upload-only

# Mode debug
python main.py --debug
```

### Dashboard Web

```bash
# Lancer le dashboard
python dashboard.py

# Ouvrir dans le navigateur
open http://localhost:8080
```

## 🔧 Configuration Avancée

### Variables d'environnement

```bash
# Frame.io
export FRAMEIO_DEFAULT_PROJECT_ID=your-project-id
export FRAMEIO_DEFAULT_WORKSPACE_ID=your-workspace-id

# LucidLink
export LUCIDLINK_MOUNT_PATH=/path/to/lucidlink

# Discord
export DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Pipeline
export MAX_CONCURRENT_UPLOADS=3
export ENABLE_DISCORD_NOTIFICATIONS=true
```

### Fichiers de configuration

- `config/integrations.json` : Configuration des intégrations
- `config/frameio_config.json` : Configuration spécifique Frame.io
- `config/error_handling.json` : Gestion des erreurs
- `pipeline_config.json` : Configuration du pipeline

## 📊 Vérification du Setup

### Test de l'authentification

```bash
# Tester Frame.io
python -c "
from src.integrations.frameio import create_frameio_auth
auth = create_frameio_auth()
print('✅ OAuth config loaded' if auth.oauth_config else '❌ OAuth config error')
print('✅ Token valid' if auth.is_token_valid() else '❌ Token invalid')
"
```

### Test des intégrations

```bash
# Tester toutes les intégrations
python tests/test_integrations.py

# Tester un composant spécifique
python tests/test_frameio.py
```

## 🚨 Problèmes Courants

### Token expiré

```bash
# Vérifier le statut du token
python -c "from src.integrations.frameio import create_frameio_auth; auth = create_frameio_auth(); print(auth.is_token_valid())"
```

**Solution :** Le système rafraîchit automatiquement les tokens. Si le problème persiste, refaites l'authentification OAuth.

### Fichiers non trouvés

```bash
# Vérifier LucidLink
ls -la /path/to/lucidlink
```

**Solution :** Vérifiez que LucidLink est monté et accessible.

### Upload échoué

```bash
# Consulter les logs
tail -f logs/frameio.log
```

**Solution :** Vérifiez les permissions et la taille des fichiers.

## 📚 Prochaines Étapes

1. **Configuration complète** → [Configuration Guide](CONFIGURATION.md)
2. **Intégrations** → [Frame.io Setup](../integrations/FRAMEIO_OAUTH.md)
3. **Développement** → [Development Guide](../DEVELOPMENT.md)
4. **Dépannage** → [Troubleshooting](TROUBLESHOOTING.md)

## 🆘 Support

- **GitHub Issues** : [Issues](https://github.com/your-repo/rl_postflow/issues)
- **Discord** : [Serveur PostFlow](https://discord.gg/postflow)
- **Email** : support@rl-postflow.com

---

**Temps estimé : 5-10 minutes**  
**Niveau : Débutant**  
**Prérequis : Python, LucidLink, Frame.io**
