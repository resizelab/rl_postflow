# Guide d'Intégration Webhook Frame.io avec Cloudflare Tunnel

## Vue d'ensemble

Ce système permet de recevoir automatiquement les notifications de statut de Frame.io via des webhooks exposés publiquement grâce à Cloudflare Tunnel. **Il utilise un port dédié (8080) pour éviter toute interférence avec les uploads existants.**

## Architecture

```
Frame.io → Webhook → Cloudflare Tunnel (port 8080) → Flask Server → Upload Tracker
```

## Composants

### 1. WebhookTunnelManager
- **Port dédié**: 8080 (distinct des uploads)
- **Tunnel Cloudflare**: Exposition publique sécurisée
- **Logs**: `logs/webhook_tunnel.log`

### 2. FrameIOWebhookManager
- **Endpoints**: `/frameio-webhook`, `/health`, `/webhook-status`
- **Events supportés**:
  - `file.upload.completed`
  - `file.ready`
  - `file.status.changed`
  - `review.status.changed`
  - `comment.created`

### 3. Mapping des statuts
```python
Frame.io → PostFlow
"processing" → "PROCESSING ⚙️"
"ready" → "COMPLETED 🎉"
"needs_review" → "WAITING_APPROVAL ⏳"
"approved" → "APPROVED ✅"
"rejected" → "REJECTED 🚫"
```

## Installation et Configuration

### 1. Prérequis

```bash
# Installer cloudflared
# macOS:
brew install cloudflared

# Windows: Télécharger depuis https://github.com/cloudflare/cloudflared/releases
# Linux: 
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb
```

### 2. Configuration Frame.io

Éditer `config/frameio_config.json` :
```json
{
  "client_id": "votre_client_id",
  "client_secret": "votre_client_secret", 
  "redirect_uri": "http://localhost:3000/callback",
  "account_id": "votre_account_id",
  "workspace_id": "votre_workspace_id"
}
```

## Utilisation

### Test Simple du Tunnel

```bash
cd tools
python test_tunnel_simple.py
```

Cela démarre un tunnel Cloudflare sur le port 8080 et affiche l'URL publique.

### Test Complet du Système

```bash
cd tools  
python test_webhook_integration.py
```

Cela:
1. Démarre le tunnel Cloudflare
2. Lance le serveur Flask
3. Surveille les webhooks
4. Affiche les statistiques

### Intégration dans le Code Principal

```python
from src.integrations.frameio.webhook_manager import FrameIOWebhookManager
from src.utils.upload_tracker import UploadTracker

# Initialiser
upload_tracker = UploadTracker()
webhook_manager = FrameIOWebhookManager(
    upload_tracker=upload_tracker,
    webhook_port=8080,
    use_cloudflare_tunnel=True
)

# Démarrer le système
success = webhook_manager.start_webhook_server()
if success:
    public_url = webhook_manager.get_public_webhook_url()
    print(f"Webhook disponible: {public_url}")
```

## Sécurité et Isolation

### Séparation des Ports
- **Uploads**: Port dynamique via `actual_port` 
- **Webhooks**: Port fixe 8080
- **Aucune interférence** entre les deux systèmes

### Cloudflare Tunnel Avantages
- ✅ **Gratuit** (contrairement à ngrok Pro)
- ✅ **Stable** (pas de timeout)
- ✅ **Sécurisé** (HTTPS automatique)
- ✅ **Fiable** (infrastructure Cloudflare)

## Endpoints Webhook

### POST /frameio-webhook
Endpoint principal pour recevoir les webhooks Frame.io.

**Events traités:**
- `file.upload.completed` → Marque comme `PROCESSING`
- `file.ready` → Marque comme `COMPLETED` avec liens
- `file.status.changed` → Met à jour selon le statut
- `review.status.changed` → Met à jour selon review status

### GET /health
Health check du serveur webhook.

### GET /webhook-status  
Statut et statistiques du webhook.

## Logs et Monitoring

### Logs
- **Tunnel**: `logs/webhook_tunnel.log`
- **Application**: Logs standard Python

### Statistiques Disponibles
```python
stats = webhook_manager.get_webhook_stats()
# Retourne:
# - total_events
# - events_by_type  
# - webhook_status
# - tunnel_info
# - last_event
```

## Troubleshooting

### Tunnel ne démarre pas
```bash
# Vérifier cloudflared
cloudflared --version

# Vérifier les ports
netstat -an | grep 8080
```

### Webhook non reçu
1. Vérifier l'URL publique: `webhook_manager.get_public_webhook_url()`
2. Tester l'endpoint: `curl https://xxx.trycloudflare.com/health`
3. Vérifier les logs Frame.io

### Conflit de ports
Le système utilise le port 8080 par défaut. Pour changer:
```python
webhook_manager = FrameIOWebhookManager(
    upload_tracker=upload_tracker,
    webhook_port=8081  # Port alternatif
)
```

## Exemples de Payload Webhook

### file.upload.completed
```json
{
  "event_type": "file.upload.completed",
  "resource": {
    "id": "file_id", 
    "name": "video.mp4",
    "status": "processing"
  }
}
```

### review.status.changed  
```json
{
  "event_type": "review.status.changed",
  "resource": {
    "id": "file_id",
    "name": "video.mp4", 
    "review_status": "approved"
  }
}
```

## Intégration Continue

Pour intégrer dans le workflow PostFlow principal:

1. **Démarrage automatique** lors de l'initialisation du système
2. **Surveillance continue** des statuts Frame.io  
3. **Mise à jour automatique** du tracker d'uploads
4. **Notifications Discord** basées sur les changements de statut

Le système webhook fonctionne de manière **totalement indépendante** des uploads et n'interfère pas avec le système Cloudflare existant.
