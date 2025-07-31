# 🧠 Guide d'Intégration - Tracking Intelligent

## 🎯 Objectif
Ajouter le tracking intelligent à votre système webhook Cloudflare existant **sans rien casser**.

## 🔧 Intégration en 3 Étapes

### Étape 1 : Importer le Tracking Intelligent

```python
# Dans votre code principal (main.py ou pipeline)
from src.integrations.frameio.intelligent_tracker import integrate_intelligent_tracking

# Après avoir créé votre webhook_service
webhook_service = WebhookService(upload_tracker, config, auto_start=True)
webhook_service.start_service()

# Ajouter le tracking intelligent
intelligent_tracker = integrate_intelligent_tracking(webhook_service)
```

### Étape 2 : Enregistrer les Uploads pour Tracking

```python
# Quand vous uploadez un fichier vers Frame.io
def upload_to_frameio(upload_id, filename, file_path):
    # Votre code d'upload existant
    frameio_response = upload_file(file_path, filename)
    
    # Enregistrer pour tracking intelligent
    intelligent_tracker.register_upload_for_tracking(
        upload_id=upload_id,
        filename=filename,
        file_id=frameio_response.get('id'),  # Si disponible
        project_id=frameio_response.get('project_id'),
        workspace_id=frameio_response.get('workspace_id')
    )
    
    print(f"✅ Upload {filename} enregistré pour tracking intelligent")
```

### Étape 3 : Consulter les Statistiques

```python
# Obtenir les statistiques
stats = intelligent_tracker.get_tracking_statistics()
print(f"📊 Uploads actifs: {stats['active_tracks']}")
print(f"📊 Événements traités: {stats['events_processed']}")

# Obtenir les détails d'un upload
details = intelligent_tracker.get_upload_details("upload_123")
if details:
    print(f"📁 Statut: {details['status']}")
    print(f"👁️ Review: {details['review_status']}")
    print(f"💬 Commentaires: {details['comments_count']}")
```

## 🎯 Exemple Concret d'Intégration

```python
#!/usr/bin/env python3
"""
Exemple d'intégration du tracking intelligent dans PostFlow
"""

from src.services.webhook_service import WebhookService
from src.utils.upload_tracker import UploadTracker
from src.integrations.frameio.intelligent_tracker import integrate_intelligent_tracking

def setup_postflow_with_intelligent_tracking():
    """Configure PostFlow avec tracking intelligent"""
    
    # Configuration standard
    config = {
        "webhook": {
            "enabled": True,
            "port": 8080,
            "auto_start": True
        }
    }
    
    # Créer les services
    upload_tracker = UploadTracker()
    webhook_service = WebhookService(upload_tracker, config)
    
    # Démarrer le webhook (Cloudflare)
    webhook_service.start_service()
    print(f"✅ Webhook actif: {webhook_service.get_webhook_url()}")
    
    # Ajouter le tracking intelligent
    intelligent_tracker = integrate_intelligent_tracking(webhook_service)
    print("🧠 Tracking intelligent activé")
    
    return webhook_service, intelligent_tracker

def process_upload_with_tracking(intelligent_tracker, upload_data):
    """Traite un upload avec tracking intelligent"""
    
    upload_id = upload_data['id']
    filename = upload_data['filename']
    
    # 1. Upload vers Frame.io (votre code existant)
    frameio_result = upload_to_frameio(upload_data)
    
    # 2. Enregistrer pour tracking intelligent
    intelligent_tracker.register_upload_for_tracking(
        upload_id=upload_id,
        filename=filename,
        file_id=frameio_result.get('file_id'),
        project_id=frameio_result.get('project_id'),
        workspace_id=frameio_result.get('workspace_id')
    )
    
    print(f"📝 Upload {filename} tracké intelligemment")
    
    return frameio_result

def monitor_uploads(intelligent_tracker):
    """Surveille les uploads en cours"""
    
    stats = intelligent_tracker.get_tracking_statistics()
    
    print(f"\n📊 TRACKING INTELLIGENT - ÉTAT ACTUEL")
    print(f"   📈 Uploads actifs: {stats['active_tracks']}")
    print(f"   📈 Événements traités: {stats['events_processed']}")
    print(f"   📈 Commentaires analysés: {stats['comments_analyzed']}")
    
    # Afficher les uploads par statut
    for status, count in stats['status_distribution'].items():
        print(f"   📊 {status}: {count}")
    
    # Afficher les uploads nécessitant attention
    for upload_id in stats['active_uploads']:
        details = intelligent_tracker.get_upload_details(upload_id)
        if details and details['review_status'] in ['NEEDS_CHANGES', 'LEANING_REJECTED']:
            print(f"   ⚠️ ATTENTION: {details['filename']} - {details['review_status']}")

# Utilisation
if __name__ == "__main__":
    webhook_service, intelligent_tracker = setup_postflow_with_intelligent_tracking()
    
    # Exemple d'uploads
    uploads = [
        {"id": "upload_001", "filename": "video_scene_01.mp4", "path": "/path/to/file1.mp4"},
        {"id": "upload_002", "filename": "animation_intro.mov", "path": "/path/to/file2.mov"}
    ]
    
    # Traiter les uploads
    for upload_data in uploads:
        process_upload_with_tracking(intelligent_tracker, upload_data)
    
    # Surveillance
    import time
    while True:
        monitor_uploads(intelligent_tracker)
        time.sleep(60)  # Vérifier toutes les minutes
```

## 🔍 Fonctionnalités Automatiques

Une fois intégré, le système fait automatiquement :

### ✅ Routage Intelligent
- Associe automatiquement les événements webhook aux uploads
- Utilise file_id, filename, ou similarité de nom
- Met à jour les mappings dynamiquement

### ✅ Analyse de Commentaires
- Détecte les approbations/rejets dans les commentaires
- Calcule un score de sentiment
- Détermine automatiquement le statut de review

### ✅ Monitoring Continu
- Vérifie périodiquement les nouveaux commentaires
- Nettoie les anciens tracks automatiquement
- Maintient les statistiques à jour

## 📊 Données Disponibles

### Pour chaque upload trackés :
```json
{
  "upload_id": "upload_123",
  "filename": "video.mp4",
  "file_id": "frame_abc123",
  "status": "READY",
  "review_status": "APPROVED",
  "comments_count": 3,
  "review_link": "https://frame.io/...",
  "created_at": "2025-01-31T10:00:00",
  "webhook_events_received": ["file.ready:2025-01-31T10:05:00", "comment.created:2025-01-31T10:10:00"]
}
```

### Statistiques globales :
```json
{
  "total_tracked": 15,
  "active_tracks": 8,
  "events_processed": 42,
  "comments_analyzed": 18,
  "status_distribution": {
    "READY": 5,
    "PROCESSING": 2,
    "COMPLETED": 1
  },
  "review_status_distribution": {
    "PENDING": 3,
    "APPROVED": 4,
    "NEEDS_CHANGES": 1
  }
}
```

## 🚨 Points d'Attention

### ✅ Ce qui ne change PAS :
- Votre webhook Cloudflare continue de fonctionner
- Votre UploadTracker existant n'est pas modifié
- Vos processus d'upload restent identiques

### ⚠️ Ce qui est ajouté :
- Appel à `register_upload_for_tracking()` après chaque upload
- Monitoring automatique en arrière-plan
- Nouvelles données disponibles via les APIs

## 🎯 Mise en Production

### Phase 1 : Test en parallèle
```python
# Activer uniquement en mode debug
if DEBUG_MODE:
    intelligent_tracker = integrate_intelligent_tracking(webhook_service)
```

### Phase 2 : Intégration progressive
```python
# Enregistrer seulement certains uploads
if upload_data.get('enable_intelligent_tracking', False):
    intelligent_tracker.register_upload_for_tracking(...)
```

### Phase 3 : Activation complète
```python
# Enregistrer tous les uploads
intelligent_tracker.register_upload_for_tracking(...)
```

---

**✨ Résultat :** Votre système webhook Cloudflare reste inchangé mais devient **beaucoup plus intelligent** dans le suivi des uploads et l'analyse des reviews !
