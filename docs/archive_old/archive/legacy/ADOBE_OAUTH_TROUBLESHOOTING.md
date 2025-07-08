# Guide de Configuration Adobe Developer Console pour Frame.io OAuth

## Problème Identifié

Le diagnostic révèle que nous avons tous les éléments OAuth corrects (client_id, client_secret, redirect_uri) mais nous recevons une erreur `access_denied` lors de l'échange du code d'autorisation. Cela indique généralement que **Frame.io API n'est pas correctement ajoutée au projet Adobe**.

## Étapes de Configuration Adobe Developer Console

### 1. Accéder à Adobe Developer Console
- Aller sur : https://developer.adobe.com/console/
- Se connecter avec le compte Adobe associé à Frame.io

### 2. Vérifier le Projet Existant
- Rechercher le projet : **890CarmineWhitefish-1845895**
- Ou créer un nouveau projet si nécessaire

### 3. Ajouter Frame.io API au Projet

**CRITIQUE :** Cette étape est probablement manquante et cause l'erreur `access_denied`

1. Dans votre projet, cliquer sur **"Add API"**
2. Rechercher **"Frame.io"** dans la liste des APIs
3. Sélectionner **"Frame.io API"**
4. Choisir **"OAuth Web"** (pas JWT)
5. Configurer les scopes :
   - `openid`
   - `profile`
   - `email`
   - `offline_access`

### 4. Configurer OAuth Web App

1. **Redirect URIs** : Ajouter EXACTEMENT :
   ```
   https://localhost:8080/callback
   ```

2. **Scopes** : Vérifier que tous les scopes Frame.io sont cochés :
   - Account Information
   - Asset Management
   - Project Management
   - etc.

### 5. Vérifier les Credentials

Dans la section **Credentials**, vous devriez voir :
- **Client ID** : `1b9748d7b40a408d97f943a75b6a9f18`
- **Client Secret** : `p8e-g7Car3_nUyAiD9bD6AzhL3VoB0l7fvmW`

### 6. Tester la Configuration

Utiliser notre script de diagnostic :
```bash
python scripts/diagnose_oauth_issues.py
```

## URLs Importantes

- **Autorisation** : `https://ims-na1.adobelogin.com/ims/authorize/v2`
- **Token Exchange** : `https://ims-na1.adobelogin.com/ims/token/v3`
- **Console Adobe** : `https://developer.adobe.com/console/`

## Scopes Corrects pour Frame.io

```
openid profile email offline_access
```

## Workflow OAuth Complet

1. **Générer URL d'autorisation** avec nos scripts
2. **Autoriser dans le navigateur** (connecté avec le bon compte Adobe)
3. **Copier le code** depuis l'URL de callback
4. **Échanger le code** contre un access_token
5. **Sauvegarder le token** dans la configuration
6. **Tester avec Frame.io API**

## Script à Utiliser

```bash
# Générer l'URL d'autorisation
python scripts/frameio_oauth_complete.py

# Puis échanger le code (remplacer YOUR_CODE par le code reçu)
python scripts/frameio_oauth_complete.py YOUR_CODE
```

## Causes Probables de l'Erreur access_denied

1. **Frame.io API manquante** dans le projet Adobe (PLUS PROBABLE)
2. **Redirect URI** différent entre console et requête
3. **Scopes** non autorisés pour l'application
4. **Mauvais environnement Adobe** (production vs staging)
5. **Compte Adobe** différent de celui utilisé pour créer l'app

## Prochaines Actions

1. ✅ Vérifier que Frame.io API est bien ajoutée au projet Adobe
2. ✅ Vérifier que les scopes Frame.io sont autorisés
3. ✅ Tester avec un nouveau code d'autorisation
4. ✅ Si échec, créer une nouvelle application OAuth dans Adobe Console
