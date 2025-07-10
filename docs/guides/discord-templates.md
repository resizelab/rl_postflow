# 🔔 Templates de Notifications Discord

Ce document décrit le système de templates de notifications Discord intégré dans RL PostFlow v4.1.1.

## Vue d'ensemble

Le système `DiscordUserNotifier` utilise des templates dynamiques pour créer des notifications Discord riches et cohérentes, avec prise en charge automatique des mentions d'utilisateurs basées sur les données Google Sheets.

## Architecture

### Composants principaux

1. **DiscordNotifier** : Gestionnaire de base pour les notifications Discord
2. **DiscordUserNotifier** : Extension avec intégration Google Sheets et templates
3. **SheetsUserManager** : Récupération des ID Discord depuis Google Sheets
4. **Templates dynamiques** : Système de templates programmés dans le code

## Templates disponibles

### 1. Notification de fichier traité

**Template**: `notify_file_processed`

```python
await user_notifier.notify_file_processed(
    file_path=Path("path/to/video.mp4"),
    frameio_link="https://app.frame.io/...",
    user_identifier="user@example.com",  # Optionnel pour mention
    thumbnail_url="https://drive.google.com/..."  # Optionnel
)
```

**Sortie** :
```
🎬 Fichier traité avec succès !

📁 **Fichier**: video.mp4
🔗 **Frame.io**: [Voir sur Frame.io](https://app.frame.io/...)
🖼️ **Aperçu**: [Thumbnail](https://drive.google.com/...)

Hey <@discord_user_id> 👋
```

### 2. Notification d'upload terminé

**Template**: `notify_upload_complete`

```python
await user_notifier.notify_upload_complete(
    file_name="final_render.mp4",
    frameio_link="https://app.frame.io/...",
    user_identifier="editor@example.com",
    additional_info="Rendu 4K terminé"
)
```

**Sortie** :
```
✅ Upload terminé !

📄 **Fichier**: final_render.mp4
🎯 **Détails**: Rendu 4K terminé
🔗 **Frame.io**: [Accéder au fichier](https://app.frame.io/...)

Hey <@discord_user_id>, votre fichier est prêt ! 🚀
```

### 3. Notification système

**Template**: `send_system_notification`

```python
await user_notifier.send_system_notification(
    title="🚀 Pipeline démarré",
    message="Le système PostFlow est maintenant actif",
    user_identifier="admin@example.com"  # Optionnel
)
```

**Sortie** :
```
🚀 Pipeline démarré

Le système PostFlow est maintenant actif

Hey <@discord_user_id> 📢
```

### 4. Rapport de pipeline

**Template**: `send_pipeline_report`

```python
await user_notifier.send_pipeline_report({
    'total_shots': 42,
    'completed_shots': 35,
    'failed_shots': 2,
    'pending_shots': 5,
    'upload_success_rate': 95.2
})
```

**Sortie** :
```
📊 Rapport de Pipeline RL PostFlow

📈 **Statistiques**:
• Total: 42 plans
• Terminés: 35 plans ✅
• Échoués: 2 plans ❌
• En attente: 5 plans ⏳

🎯 **Taux de succès**: 95.2%

État mis à jour à 10:30
```

### 5. Notification d'erreur

**Template**: `notify_error`

```python
await user_notifier.notify_error(
    error_type="Upload Failed",
    file_path=Path("problematic_file.mp4"),
    error_message="Connexion Frame.io timeout",
    user_identifier="admin@example.com"
)
```

**Sortie** :
```
❌ Erreur: Upload Failed

📁 **Fichier**: problematic_file.mp4
🚨 **Erreur**: Connexion Frame.io timeout

Hey <@discord_user_id>, intervention requise 🔧
```

## Configuration des utilisateurs

### Mapping Google Sheets

Les ID Discord des utilisateurs sont récupérés depuis Google Sheets via la colonne configurée dans `sheets_mapping.json` :

```json
{
  "USERS_INFOS": {
    "range": "USERS!A2:E",
    "columns": {
      "name": "A",
      "email": "B", 
      "role": "C",
      "discord_id": "D",
      "active": "E"
    }
  }
}
```

### Format des ID Discord

Les ID Discord doivent être au format numérique complet :
- ✅ Correct : `123456789012345678`
- ❌ Incorrect : `@username` ou `username#1234`

## Intégration dans le pipeline

### Pipeline Manager

```python
# Initialisation automatique
user_notifier = self.setup_user_notifier()

# Utilisation dans les notifications
if self.user_notifier:
    await self.user_notifier.notify_file_processed(file_path, frameio_link)
else:
    # Fallback vers discord_notifier classique
    self.discord_notifier.notify_file_processed(file_name, message)
```

### PostFlow Runner

```python
# Notification avec mention automatique
await self._send_file_notification(file_path, frameio_link, thumbnail_url)

# Le runner utilise automatiquement user_notifier si disponible
```

## Personnalisation des templates

### Ajout d'un nouveau template

1. **Créer la méthode dans DiscordUserNotifier** :

```python
async def notify_custom_event(self, event_data: Dict[str, Any], 
                             user_identifier: Optional[str] = None) -> bool:
    """Template personnalisé pour événement spécifique"""
    
    template = NotificationTemplate(
        title="🎯 Événement Personnalisé",
        message=f"Données: {event_data}",
        color=0x00FF00,  # Vert
        fields=[
            {"name": "Type", "value": event_data.get('type', 'N/A'), "inline": True},
            {"name": "Statut", "value": event_data.get('status', 'N/A'), "inline": True}
        ]
    )
    
    discord_id = self.get_user_discord_id(user_identifier) if user_identifier else None
    return await self._send_notification(template, discord_id)
```

2. **Utiliser le template** :

```python
await user_notifier.notify_custom_event(
    event_data={'type': 'render', 'status': 'complete'},
    user_identifier="artist@example.com"
)
```

## Bonnes pratiques

### 1. Gestion des erreurs

```python
try:
    success = await user_notifier.notify_file_processed(file_path)
    if not success:
        logger.warning("Notification Discord échouée")
except Exception as e:
    logger.error(f"Erreur notification: {e}")
```

### 2. Fallback vers notifier classique

```python
notifier = self.user_notifier or self.discord_notifier
if notifier:
    if hasattr(notifier, 'notify_file_processed'):
        # DiscordUserNotifier (avec templates)
        await notifier.notify_file_processed(file_path)
    else:
        # DiscordNotifier classique
        notifier.notify_file_processed(file_name, message)
```

### 3. Vérification de disponibilité

```python
if user_notifier.user_manager:
    # Intégration Google Sheets disponible
    discord_id = user_notifier.get_user_discord_id("user@example.com")
else:
    # Mode notifications génériques uniquement
    discord_id = None
```

## Dépannage

### Problèmes courants

1. **Mentions ne fonctionnent pas** :
   - Vérifier le format des ID Discord (numérique uniquement)
   - S'assurer que l'utilisateur est dans le serveur Discord
   - Vérifier les permissions du bot

2. **Google Sheets non accessible** :
   - Vérifier `google_credentials.json`
   - Contrôler les permissions du compte de service
   - Valider la configuration `sheets_mapping.json`

3. **Templates non appliqués** :
   - Utiliser `DiscordUserNotifier` au lieu de `DiscordNotifier`
   - Vérifier l'initialisation du `user_manager`

### Logs de débogage

```python
# Activer les logs détaillés
logging.getLogger('src.integrations.discord.user_notifier').setLevel(logging.DEBUG)
```

## Évolutions futures

- Templates configurables via fichiers JSON
- Interface web pour gérer les templates
- Support des réactions Discord automatiques
- Intégration avec d'autres plateformes (Slack, Teams)
