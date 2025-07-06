# Frame.io Integration - Architecture Propre

## 🎯 Vue d'ensemble

Le pipeline PostFlow propose maintenant **deux solutions distinctes** pour l'intégration Frame.io :

### 1. 🚀 Developer Token (Recommandé - Solution immédiate)
- **API**: Frame.io v2
- **Authentification**: Developer Token (fio-u-xxx...)
- **Avantages**: Configuration rapide, stable, fonctionne immédiatement
- **Usage**: Production, déblocage immédiat du pipeline

### 2. 🔬 OAuth Adobe IMS (Avancé - Solution future)
- **API**: Frame.io v4
- **Authentification**: OAuth Adobe IMS
- **Avantages**: API moderne, authentification sécurisée
- **Prérequis**: Configuration Adobe Developer Console avec Frame.io activé

## 🚀 Démarrage rapide

### Configuration automatique (recommandé)
```bash
python scripts/configure_frameio.py
```

### Configuration manuelle

#### Option 1: Developer Token
```bash
python scripts/setup_frameio.py
```

#### Option 2: OAuth Adobe IMS
```bash
python scripts/setup_adobe_oauth.py
```

### Validation
```bash
python scripts/validate_frameio.py
```

## 📁 Structure des fichiers

```
scripts/
├── configure_frameio.py     # 🎯 Assistant principal de configuration
├── setup_frameio.py         # 🚀 Configuration Developer Token
├── setup_adobe_oauth.py     # 🔬 Configuration OAuth Adobe IMS
└── validate_frameio.py      # 🧪 Validation de configuration

config/
├── frameio_config.json      # Configuration Developer Token
└── frameio_oauth_config.json # Configuration OAuth Adobe IMS

src/integrations/
└── frameio.py               # Client unifié (supporte les 2 modes)
```

## ⚙️ Configuration

### Developer Token

1. **Obtenir un token**:
   - Connectez-vous à https://developer.frame.io/
   - Allez dans "API Tokens" ou "Personal Access Tokens"
   - Créez un nouveau token
   - Format: `fio-u-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

2. **Configurer**:
   ```bash
   python scripts/setup_frameio.py
   ```

3. **Fichier de configuration** (`config/frameio_config.json`):
   ```json
   {
     "api_token": "fio-u-xxxxx",
     "base_url": "https://api.frame.io/v2",
     "team_id": "optional-team-id",
     "project_id": "optional-project-id",
     "user_name": "Votre Nom",
     "user_email": "votre@email.com"
   }
   ```

### OAuth Adobe IMS

1. **Prérequis Adobe Developer Console**:
   - Compte Adobe Developer
   - Projet avec API Frame.io activée
   - OAuth Web App configuré

2. **Configurer**:
   ```bash
   python scripts/setup_adobe_oauth.py
   ```

3. **Fichier de configuration** (`config/frameio_oauth_config.json`):
   ```json
   {
     "client_id": "your-client-id",
     "client_secret": "your-client-secret",
     "access_token": "oauth-access-token",
     "refresh_token": "oauth-refresh-token",
     "scopes": "openid,profile,email,offline_access"
   }
   ```

## 🧪 Tests et validation

### Validation complète
```bash
python scripts/validate_frameio.py
```

### Tests spécifiques
```bash
# Test de connexion uniquement
python -c "
from src.integrations.frameio import FrameIOClient
import json
with open('config/frameio_config.json') as f:
    config = json.load(f)
client = FrameIOClient(config)
print('✅ Connexion OK' if client.test_connection() else '❌ Échec')
"
```

## 🔧 Utilisation dans le code

### Client unifié
```python
from src.integrations.frameio import FrameIOClient
import json

# Charger la configuration (Developer Token ou OAuth)
with open('config/frameio_config.json') as f:
    config = json.load(f)

# Initialiser le client (détecte automatiquement le mode)
client = FrameIOClient(config)

# Utiliser le client
if client.test_connection():
    user_info = client.get_user_info()
    teams = client.get_teams()
    # ...
```

### Méthodes disponibles
```python
# Informations utilisateur
user_info = client.get_user_info()
teams = client.get_teams()
accounts = client.get_accounts()

# Projets
projects = client.get_projects()
project_info = client.get_project_info(project_id)

# Assets
assets = client.get_project_assets(project_id)
asset_info = client.get_asset_info(asset_id)

# Upload
upload_result = client.upload_asset(file_path, parent_id)

# Status
status = client.get_status()
```

## ❌ Résolution de problèmes

### Erreurs communes

#### "❌ Token invalide ou expiré"
- **Developer Token**: Vérifiez que le token est correct et actif
- **OAuth**: Rafraîchissez le token ou reconfigurez

#### "❌ 401 Unauthorized sur Frame.io v4"
- Vérifiez que Frame.io est activé dans Adobe Developer Console
- Vérifiez les scopes configurés
- Utilisez Developer Token en attendant

#### "❌ Équipe/Projet non trouvé"
- Vérifiez les IDs dans la configuration
- Vérifiez les permissions de votre token

### Commandes de diagnostic
```bash
# Validation complète
python scripts/validate_frameio.py

# Reconfiguration
python scripts/configure_frameio.py

# Test de connexion simple
python -c "
import requests
token = input('Token: ')
r = requests.get('https://api.frame.io/v2/me', 
                headers={'Authorization': f'Bearer {token}'})
print(f'Status: {r.status_code}')
print(r.json() if r.ok else r.text)
"
```

## 🎯 Recommandations

### Pour débloquer immédiatement votre pipeline
1. ✅ Utilisez **Developer Token** (setup_frameio.py)
2. ✅ Testez avec validate_frameio.py
3. ✅ Lancez votre pipeline avec python main.py

### Pour explorer les fonctionnalités avancées
1. 🔬 Configurez **OAuth Adobe IMS** (setup_adobe_oauth.py)
2. 🔍 Vérifiez que Frame.io est activé dans Adobe Console
3. 🧪 Testez avec validate_frameio.py

### Maintenance
- 📅 **Developer Token**: Pas d'expiration, mais peut être révoqué
- 🔄 **OAuth Token**: Expiration automatique, rafraîchi automatiquement
- 🧪 **Tests réguliers**: Exécutez validate_frameio.py périodiquement

## 🆘 Support

En cas de problème :

1. **Validation**: `python scripts/validate_frameio.py`
2. **Reconfiguration**: `python scripts/configure_frameio.py`
3. **Documentation**: Consultez les commentaires dans le code
4. **Issues**: Créez une issue dans le repository

---

*Cette architecture a été nettoyée et unifiée pour proposer une solution robuste et flexible pour l'intégration Frame.io dans le pipeline PostFlow.*
