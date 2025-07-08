# 🎬 Frame.io OAuth Authentication - Guide Final

Ce guide décrit l'authentification OAuth Web App pour Frame.io via Adobe IMS dans le pipeline RL PostFlow.

## ✅ Configuration Finale - OAuth Web App

### 📋 Prérequis

1. **Credentials Adobe Developer Console** :
   - Client ID: `1b9748d7b40a408d97f943a75b6a9f18`
   - Client Secret: `p8e-g7Car3_nUyAiD9bD6AzhL3VoB0l7fvmW`
   - Redirect URI: `https://localhost:8080/callback`
   - Platform: OAuth Web App

2. **Scopes requis** (OBLIGATOIRE pour Frame.io) :
   ```
   email, openid, offline_access, profile, additional_info.roles
   ```

3. **Compte Adobe lié à Frame.io** ✅

## 🚀 Workflow d'Authentification

### 1. Authentification Initiale

```bash
# Lancer le script d'authentification interactif
python scripts/frameio_oauth_complete.py

# Choisir l'option 1: Générer URL d'autorisation
# Suivre l'URL générée, se connecter avec Adobe
# Copier le code d'autorisation depuis l'URL de redirection
# Choisir l'option 2: Échanger le code contre un token
```

### 2. Utilisation dans le Code

```python
from src.frameio_oauth import FrameioOAuth, FrameioOAuthError

# Initialiser le client OAuth
oauth = FrameioOAuth()

# S'assurer qu'on a un token valide
if oauth.ensure_valid_token():
    print("✅ Token valide")
    
    # Tester l'API Frame.io
    success, response = oauth.test_api()
    if success:
        print("✅ API Frame.io accessible")
    else:
        print(f"❌ Erreur API: {response}")
else:
    print("❌ Token invalide ou expiré")
```

### 3. Rafraîchissement Automatique

```python
# Le token est rafraîchi automatiquement si nécessaire
oauth = FrameioOAuth()

# Cette méthode gère le refresh automatiquement
if oauth.ensure_valid_token():
    # Utiliser l'API Frame.io...
    pass
```

## 📁 Structure des Fichiers

### Scripts Principaux

- **`scripts/frameio_oauth_complete.py`** : Script interactif principal pour OAuth
- **`scripts/frameio_token_diagnostic.py`** : Diagnostic standard des tokens
- **`scripts/frameio_deep_diagnostic.py`** : Diagnostic approfondi avec tests multiples

### Module de Production

- **`src/frameio_oauth.py`** : Module Python principal pour l'authentification Frame.io
- **`examples/frameio_usage_examples.py`** : Exemples d'utilisation de l'API Frame.io

### Configuration

- **`config/integrations.json`** : Stockage sécurisé des tokens OAuth
- **`data/890CarmineWhitefish-1845895-OAuth Web App.json`** : Credentials Adobe (CLIENT_SECRET, API_KEY, etc.)
- **`code.txt`** : Fichier temporaire pour les codes d'autorisation

## 🔧 API Frame.io - Endpoints Disponibles

### Authentification Réussie ✅

```bash
# Test de l'API
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.frame.io/v4/me
# Status: 200 ✅

# Comptes utilisateur
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.frame.io/v4/accounts
# Status: 200 ✅

# Projets d'un compte
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.frame.io/v4/accounts/{account_id}/projects
# Status: 200 ✅
```

## 🔍 Diagnostic et Dépannage

### Vérification de l'État

```bash
# Diagnostic complet
python scripts/frameio_deep_diagnostic.py

# Test simple du module
python src/frameio_oauth.py
```

### Indicateurs de Succès

- ✅ **Adobe IMS Userinfo** : Status 200
- ✅ **Frame.io /v4/me** : Status 200
- ✅ **Token contient les scopes** : `email,openid,offline_access,profile,additional_info.roles,AdobeID`
- ✅ **Refresh token disponible** pour le renouvellement automatique

### Problèmes Courants

| Problème | Cause | Solution |
|----------|-------|----------|
| Status 401 Frame.io | Scopes incorrects | Vérifier que `additional_info.roles` est présent |
| Token expiré | Durée de vie dépassée | Le refresh est automatique avec `ensure_valid_token()` |
| Erreur `access_denied` | Code utilisé/expiré | Générer une nouvelle URL d'autorisation |

## 📊 Résultats Finaux

### ✅ Tests de Validation Réussis

1. **Génération URL d'autorisation** : ✅ Avec les bons scopes
2. **Échange code → token** : ✅ Status 200, tokens reçus
3. **API Frame.io V4** : ✅ Status 200, accès complet
4. **Refresh automatique** : ✅ Fonctionnel
5. **Diagnostic complet** : ✅ Tous les tests passent

### 🎯 Workflow Final Validé

```
Adobe IMS Authorization URL → 
User Authorization → 
Authorization Code → 
Token Exchange (Status 200) → 
Frame.io API Access (Status 200) ✅
```

## 🚀 Utilisation en Production

Le module `src/frameio_oauth.py` est prêt pour la production avec :

- Gestion automatique des tokens
- Refresh automatique
- Gestion d'erreurs robuste
- Logging intégré
- API simple et propre

**L'authentification OAuth Frame.io est maintenant complètement opérationnelle ! 🎉**

---

*Documentation générée le 06 janvier 2025 - RL PostFlow Pipeline*
