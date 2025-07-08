# 🚀 Guide de Création d'Intégration Server-to-Server Adobe

## 📋 Prérequis

- Accès à Adobe Developer Console
- Compte Adobe avec permissions d'administration
- Projet Frame.io existant ou nouveau

## 🔧 Étapes de Configuration

### 1. Accéder à Adobe Developer Console

1. Allez sur [Adobe Developer Console](https://developer.adobe.com/console)
2. Connectez-vous avec votre compte Adobe
3. Sélectionnez ou créez un projet

### 2. Créer une Intégration Server-to-Server

1. Dans votre projet, cliquez sur **"Add to Project"**
2. Sélectionnez **"API"**
3. Recherchez et sélectionnez **"Frame.io API"**
4. Choisissez **"Server-to-Server"** (OAuth 2.0)
5. Cliquez sur **"Next"**

### 3. Configurer l'Intégration

1. **Nom**: `RL PostFlow Frame.io Integration`
2. **Description**: `Server-to-Server integration for RL PostFlow pipeline`
3. **Scopes**: Sélectionnez tous les scopes Frame.io nécessaires :
   - `frameio_api`
   - `frameio:read`
   - `frameio:write`
   - `frameio:admin` (si nécessaire)

### 4. Récupérer les Credentials

Une fois l'intégration créée, vous devriez voir :

```
Client ID: [VOTRE_CLIENT_ID]
Client Secret: [VOTRE_CLIENT_SECRET]
Organization ID: [VOTRE_ORG_ID]
Technical Account ID: [VOTRE_TECHNICAL_ACCOUNT_ID]
```

### 5. Générer une Paire de Clés

1. Dans l'interface Adobe, section **"Service Account (JWT)"**
2. Cliquez sur **"Generate public/private keypair"**
3. Téléchargez le fichier `private.key`
4. Sauvegardez-le dans `config/private.key`

### 6. Mettre à Jour la Configuration

Modifiez votre fichier `.env` :

```bash
# Adobe IMS Server-to-Server Configuration
FRAMEIO_CLIENT_ID=[VOTRE_CLIENT_ID]
FRAMEIO_CLIENT_SECRET=[VOTRE_CLIENT_SECRET]
FRAMEIO_ORG_ID=[VOTRE_ORG_ID]
FRAMEIO_TECHNICAL_ACCOUNT_ID=[VOTRE_TECHNICAL_ACCOUNT_ID]
FRAMEIO_PRIVATE_KEY_PATH=config/private.key

# Frame.io Configuration
FRAMEIO_ACCOUNT_ID=[VOTRE_ACCOUNT_ID]
FRAMEIO_WORKSPACE_ID=[VOTRE_WORKSPACE_ID]
```

## 🧪 Validation

### 1. Tester l'Authentification

```bash
cd /Users/home/Library/CloudStorage/OneDrive-Personnel/WORK/_DEV/rl_postflow
python scripts/frameio_v4_diagnostic_simple.py
```

### 2. Tester la Récupération des Projets

```bash
python scripts/test_frameio_connection.py
```

### 3. Validation Complète

```bash
python scripts/frameio_v4_final_demo.py
```

## 🔧 Dépannage

### Erreur `unauthorized_client`

- Vérifiez que l'intégration est bien de type **Server-to-Server**
- Assurez-vous que les scopes Frame.io sont activés
- Confirmez que le client ID et secret sont corrects

### Erreur `invalid_scope`

- Vérifiez que les scopes Frame.io sont autorisés dans Adobe Console
- Assurez-vous que votre organisation a accès à Frame.io

### Erreur `invalid_token`

- Vérifiez que le Technical Account ID est correct
- Confirmez que la clé privée est au bon format
- Vérifiez que l'Organization ID contient bien `@AdobeOrg`

### Erreur `forbidden`

- Vérifiez les permissions de votre compte Adobe
- Assurez-vous que vous avez accès au workspace Frame.io spécifié

## 📚 Ressources

- [Adobe Developer Console](https://developer.adobe.com/console)
- [Frame.io API Documentation](https://developer.frame.io/docs)
- [Adobe IMS OAuth 2.0 Server-to-Server](https://developer.adobe.com/developer-console/docs/guides/authentication/ServerToServerAuthentication/)

## 🎯 Après Configuration

Une fois l'intégration Server-to-Server créée et configurée :

1. **Tester l'authentification** avec le diagnostic
2. **Valider les uploads** avec les exemples
3. **Intégrer dans le pipeline** principal
4. **Configurer les webhooks** (optionnel)
5. **Mettre en production**

## 🚨 Important

- **Gardez les credentials sécurisés** - Ne les commitez jamais
- **Utilisez des variables d'environnement** pour tous les secrets
- **Testez d'abord en développement** avant la production
- **Documentez les changements** dans votre équipe

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez la [documentation Adobe](https://developer.adobe.com/developer-console/docs/guides/)
2. Consultez les [forums Frame.io](https://community.frame.io/)
3. Contactez le support Adobe Developer si nécessaire
