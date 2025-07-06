# Guide d'utilisation OAuth Frame.io - Saisie de codes améliorée

## 🎯 Nouvelles fonctionnalités

Le script `frameio_oauth_complete.py` dispose maintenant de **4 méthodes différentes** pour saisir le code d'autorisation OAuth, qui peut être très long (200+ caractères).

## 📋 Méthodes de saisie du code

### Option 1: URL complète (RECOMMANDÉE)
- **Avantage**: Plus facile, copie directe depuis la barre d'adresse
- **Comment**: Copiez toute l'URL `https://localhost:8080/callback?code=...`
- **Le script**: Extrait automatiquement le code de l'URL

### Option 2: Code seul
- **Avantage**: Utile si vous avez déjà extrait le code
- **Comment**: Collez uniquement la partie après `code=`
- **Attention**: Très long, risque d'erreur de copie

### Option 3: Saisie multi-lignes
- **Avantage**: Permet de coller le code même s'il est coupé
- **Comment**: 
  1. Choisissez l'option 3
  2. Collez le code (peut être sur plusieurs lignes)
  3. Appuyez sur `Ctrl+D` (Mac/Linux) ou `Ctrl+Z + Entrée` (Windows)

### Option 4: Fichier texte
- **Avantage**: Idéal pour très longs codes ou copie depuis des documents
- **Comment**:
  1. Créez d'abord un fichier temporaire (option 6 du menu)
  2. Ouvrez le fichier dans un éditeur
  3. Supprimez les commentaires et collez le code
  4. Sauvegardez le fichier
  5. Utilisez l'option 4 pour charger depuis le fichier

## 🚀 Workflow complet

### Étape 1: Générer l'URL d'autorisation
```bash
cd /path/to/rl_postflow
python scripts/frameio_oauth_complete.py
# Choisir option 1
```

### Étape 2: Autoriser dans le navigateur
1. Copiez l'URL générée
2. Ouvrez-la dans votre navigateur
3. Connectez-vous avec votre compte Adobe
4. Autorisez l'application
5. **Copiez TOUTE l'URL de redirection** depuis la barre d'adresse

### Étape 3: Échanger le code
```bash
# Relancez le script
python scripts/frameio_oauth_complete.py
# Choisir option 2, puis option 1 (URL complète)
# Coller l'URL complète
```

### Étape 4: Tester l'API
```bash
# Dans le même menu
# Choisir option 4 pour tester l'API Frame.io
```

## 🔧 Fonctionnalités avancées

### Vérifications automatiques
- **Longueur du code**: Alerte si le code semble trop court
- **Format d'URL**: Extraction automatique depuis une URL
- **Nettoyage**: Suppression automatique des espaces/retours à la ligne

### Diagnostic d'erreurs
- **Affichage complet**: Statut HTTP, headers, réponse complète
- **Conseils**: Messages d'aide pour les erreurs courantes
- **Logging**: Détails techniques pour le débogage

### Gestion des tokens
- **Sauvegarde automatique**: Access token + refresh token
- **Rafraîchissement**: Option 3 du menu principal
- **Horodatage**: Date/heure de dernière mise à jour

## 📁 Structure des fichiers

```
config/
├── integrations.json          # Stockage des tokens
temp/
├── oauth_code.txt            # Fichier temporaire (créé à la demande)
data/
├── 890CarmineWhitefish-1845895-OAuth Web App.json  # Credentials OAuth
scripts/
├── frameio_oauth_complete.py # Script principal
├── oauth_demo.py            # Exemples et démonstration
```

## 🐛 Résolution des problèmes

### Code trop court
```
⚠️ ATTENTION: Le code semble court (50 caractères)
   Les codes OAuth Adobe sont généralement très longs (200+ caractères)
```
**Solution**: Vérifiez que vous avez copié le code complet

### Format non reconnu
```
⚠️ Format non reconnu, utilisation tel quel. Longueur: 45
```
**Solution**: Utilisez l'option 1 (URL complète) ou vérifiez le format

### Erreur 401 (Not Authorized)
```
❌ Erreur API Frame.io: 401
```
**Solutions**:
1. Le token a expiré → Utilisez l'option 3 (refresh)
2. Nouveau code requis → Recommencez avec l'option 1 et 2

### Erreur d'échange de token
```
❌ Erreur échange token: 400
"error": "invalid_grant"
```
**Solutions**:
1. Code expiré → Générez un nouveau code (durée de vie: ~30 minutes)
2. Code mal copié → Recommencez avec l'option URL complète
3. Redirect URI incorrect → Vérifiez la config Adobe

## 💡 Conseils pratiques

1. **Utilisez toujours l'option 1** (URL complète) pour éviter les erreurs
2. **Copiez rapidement** le code (expire en ~30 minutes)
3. **Sauvegardez le refresh_token** pour éviter de refaire l'autorisation
4. **Testez immédiatement** avec l'option 4 après l'échange
5. **Utilisez l'option 6** si vous avez des problèmes de copie/collage

## 🔄 Maintenance

- **Refresh automatique**: Le refresh_token dure ~90 jours
- **Nouvelle autorisation**: Si le refresh_token expire
- **Monitoring**: Vérifiez régulièrement avec l'option 4

## 📞 Support

En cas de problème, le script affiche des détails complets:
- Statut HTTP
- Headers de réponse
- Message d'erreur complet
- Conseils de résolution
