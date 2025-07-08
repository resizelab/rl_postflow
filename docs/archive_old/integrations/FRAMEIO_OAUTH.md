# 🎬 Frame.io OAuth Configuration

## 📋 Vue d'ensemble

Ce guide explique comment configurer l'authentification OAuth Web App pour Frame.io via Adobe IMS, nécessaire pour l'intégration RL PostFlow.

## 🔐 Configuration OAuth Web App

### 1. Adobe Developer Console

1. **Accéder à Adobe Developer Console**
   - URL : https://developer.adobe.com/console
   - Se connecter avec votre compte Adobe

2. **Créer un projet**
   - Cliquer sur "Create new project"
   - Nommer le projet : "RL PostFlow Frame.io Integration"

3. **Ajouter Frame.io API**
   - Cliquer sur "Add API"
   - Sélectionner "Frame.io API"
   - Choisir "OAuth Web App"

4. **Configurer l'application**
   ```
   Application Name: RL PostFlow
   Default Redirect URI: https://localhost:8080/callback
   Redirect URI pattern: https://localhost:8080/callback
   ```

### 2. Récupérer les Credentials

Une fois l'application créée, récupérez :
- **Client ID** (`API_KEY`)
- **Client Secret** (`CLIENT_SECRET`)
- **Redirect URI** (`DEF_REDIRECT_URI`)

### 3. Configuration du Fichier OAuth

Créez le fichier `data/890CarmineWhitefish-1845895-OAuth Web App.json` :

```json
{
  "API_KEY": "your-client-id-here",
  "CLIENT_SECRET": "your-client-secret-here",
  "DEF_REDIRECT_URI": "https://localhost:8080/callback",
  "SCOPES": [
    "email",
    "openid",
    "offline_access",
    "profile",
    "additional_info.roles"
  ]
}
```

## 🔄 Processus d'Authentification

### 1. Génération de l'URL d'autorisation

```python
from src.integrations.frameio import create_frameio_auth

auth = create_frameio_auth()
auth_url = auth.generate_auth_url()
print(f"URL d'autorisation : {auth_url}")
```

### 2. Échange du code d'autorisation

```python
# Après redirection avec le code d'autorisation
authorization_code = "code-from-redirect"
token_data = await auth.exchange_code(authorization_code)
```

### 3. Utilisation automatique

Une fois configuré, le système gère automatiquement :
- ✅ Rafraîchissement des tokens
- ✅ Gestion des erreurs d'authentification
- ✅ Retry automatique sur expiration
- ✅ Sauvegarde des tokens dans `config/integrations.json`

## 🛠️ Configuration Avancée

### Scopes Requis

```json
{
  "required_scopes": [
    "email",           // Accès à l'email utilisateur
    "openid",          // Authentification OpenID
    "offline_access",  // Refresh tokens
    "profile",         // Profil utilisateur
    "additional_info.roles"  // Informations de rôle
  ]
}
```

### Endpoints Adobe IMS

```python
# Configurés automatiquement dans FrameIOAuth
auth_endpoint = "https://ims-na1.adobelogin.com/ims/authorize/v2"
token_endpoint = "https://ims-na1.adobelogin.com/ims/token/v3"
userinfo_endpoint = "https://ims-na1.adobelogin.com/ims/userinfo/v2"
```

### Variables d'environnement

```bash
# Optionnel : surcharger les paramètres
export FRAMEIO_CLIENT_ID=your-client-id
export FRAMEIO_CLIENT_SECRET=your-client-secret
export FRAMEIO_REDIRECT_URI=https://localhost:8080/callback
```

## 🧪 Test de l'Authentification

### Script de test

```python
#!/usr/bin/env python3
import asyncio
from src.integrations.frameio import create_frameio_auth

async def test_auth():
    auth = create_frameio_auth()
    
    # Test de configuration
    print(f"✅ Config chargée : {bool(auth.oauth_config)}")
    print(f"Client ID : {auth.oauth_config['client_id']}")
    
    # Test de token
    is_valid = auth.is_token_valid()
    print(f"Token valide : {'✅' if is_valid else '❌'}")
    
    if is_valid:
        # Test de l'API
        success = await auth.test_connection()
        print(f"Connexion API : {'✅' if success else '❌'}")
    else:
        # Génération d'URL d'autorisation
        auth_url = auth.generate_auth_url()
        print(f"URL d'autorisation : {auth_url}")

if __name__ == "__main__":
    asyncio.run(test_auth())
```

### Commande de test rapide

```bash
# Test de base
python -c "from src.integrations.frameio import create_frameio_auth; auth = create_frameio_auth(); print('✅ OK' if auth.oauth_config else '❌ Error')"

# Test complet
python scripts/test_frameio_auth.py
```

## 📊 Monitoring et Logs

### Vérification des tokens

```python
from src.integrations.frameio import create_frameio_auth

auth = create_frameio_auth()

# Vérifications
print(f"Token valide : {auth.is_token_valid()}")
print(f"Configuration : {auth.oauth_config}")

# Informations de token
config = auth._load_current_tokens()
print(f"Dernière mise à jour : {config.get('last_updated')}")
print(f"Expire dans : {config.get('expires_in')} secondes")
```

### Logs d'authentification

```bash
# Logs Frame.io
tail -f logs/frameio.log

# Rechercher les erreurs d'auth
grep -i "auth" logs/frameio.log
grep -i "token" logs/frameio.log
```

## 🚨 Dépannage

### Token expiré

**Symptôme :** Erreur 401 lors des appels API

**Solution :**
```python
# Le système rafraîchit automatiquement
auth = create_frameio_auth()
success = await auth.ensure_valid_token()
print(f"Token rafraîchi : {'✅' if success else '❌'}")
```

### Configuration manquante

**Symptôme :** `FrameIOAuthError: Fichier de configuration OAuth non trouvé`

**Solution :**
1. Vérifiez que le fichier existe : `data/890CarmineWhitefish-1845895-OAuth Web App.json`
2. Vérifiez les permissions de lecture
3. Validez le format JSON

### Erreur de redirection

**Symptôme :** Erreur lors de l'échange du code d'autorisation

**Solution :**
1. Vérifiez que `redirect_uri` correspond exactement à la configuration Adobe
2. Assurez-vous que le code d'autorisation est récent (expire rapidement)

## 📚 Ressources

### Documentation officielle

- [Adobe IMS OAuth 2.0](https://developer.adobe.com/developer-console/docs/guides/authentication/OAuth/)
- [Frame.io API Documentation](https://developer.frame.io/docs)

### Exemples de code

- [Authentification complète](../../examples/frameio_oauth_complete.py)
- [Test d'intégration](../../examples/frameio_integration_test.py)

---

**Mis à jour le : 7 juillet 2025**  
**Version : 4.0.0**  
**Niveau : Intermédiaire**
