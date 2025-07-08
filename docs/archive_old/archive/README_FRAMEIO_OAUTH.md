# Frame.io v4 – Intégration OAuth Web App (Authorization Code)

## Fonctionnement

- Génère l’URL d’autorisation à ouvrir dans le navigateur
- Échange le code d’autorisation contre un access_token
- Rafraîchit le token automatiquement si besoin
- Stocke le refresh_token pour les sessions suivantes
- Teste l’accès à l’API Frame.io

## Utilisation

1. Lancez le script :
   ```bash
   python scripts/frameio_oauth_webapp_demo.py
   ```
2. Si aucun refresh_token n’est trouvé, ouvrez l’URL affichée dans votre navigateur, autorisez l’application, puis copiez le code d’autorisation de l’URL de redirection.
3. Collez ce code dans le terminal.
4. Le script stocke le refresh_token dans `.frameio_refresh_token` pour les prochaines sessions.

## Variables d’environnement nécessaires

- `FRAMEIO_CLIENT_ID`
- `FRAMEIO_CLIENT_SECRET`
- `FRAMEIO_REDIRECT_URI` (ex: https://localhost:8080/callback)
- `FRAMEIO_BASE_URL` (optionnel)
- `FRAMEIO_IMS_HOST` (optionnel)

## Bonnes pratiques

- Ne partagez jamais le refresh_token.
- Ne commitez pas `.frameio_refresh_token` dans votre dépôt.
- Pour réinitialiser l’authentification, supprimez `.frameio_refresh_token`.

## Référence
- [Documentation officielle Frame.io API](https://github.com/AdobeDocs/frameio-api)
