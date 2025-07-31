# 🎬 PostFlow - Guide d'Utilisation du Tracking Intelligent

## 📖 Vue d'ensemble

Le système de tracking intelligent de PostFlow surveille automatiquement vos uploads Frame.io et analyse les commentaires pour déterminer le statut d'approbation de vos vidéos.

## 🚀 Démarrage Rapide

### 1. Configuration

Assurez-vous que `pipeline_config.json` contient :

```json
{
  "webhook": {
    "enabled": true,
    "port": 8080,
    "auto_start": true,
    "intelligent_tracking": true
  }
}
```

### 2. Démarrage du Service

**Option A: Service complet**
```bash
python tools/start_postflow.py
```

**Option B: Test avec simulation**
```bash
python tools/test_postflow_intelligent.py
```

**Option C: Intégration dans votre code**
```python
from tools.postflow_integration import init_postflow, track_upload

# Initialiser
postflow = init_postflow()
postflow.start_tracking()

# Tracker un upload
track_upload("upload_001", "ma_video.mp4")
```

## 🔧 Intégration dans votre Workflow

### Méthode Simple (Fonctions globales)

```python
from tools.postflow_integration import init_postflow, track_upload, check_upload_ready

# 1. Initialiser une fois au début
postflow = init_postflow()
postflow.start_tracking()

# 2. Après chaque upload Frame.io
def upload_to_frameio(filename, project_id):
    # Votre code d'upload existant...
    file_id = frame_io_upload(filename, project_id)
    
    # Ajouter le tracking
    upload_id = f"upload_{int(time.time())}"
    track_upload(
        upload_id=upload_id,
        filename=filename,
        file_id=file_id,
        project_id=project_id
    )
    
    return upload_id

# 3. Vérifier si un upload est approuvé
def is_video_approved(upload_id):
    return postflow.is_upload_approved(upload_id)

# 4. Attendre qu'un upload soit prêt
def wait_for_processing(upload_id):
    return postflow.wait_for_upload_ready(upload_id, timeout=600)
```

### Méthode Classe (Plus de contrôle)

```python
from tools.postflow_integration import PostFlowIntegration

class MyVideoWorkflow:
    def __init__(self):
        self.postflow = PostFlowIntegration()
        self.postflow.start_tracking()
    
    def process_video(self, video_path):
        # 1. Upload vers Frame.io
        filename = os.path.basename(video_path)
        file_id = self.upload_to_frameio(video_path)
        
        # 2. Enregistrer pour tracking
        upload_id = f"workflow_{int(time.time())}"
        self.postflow.register_upload(
            upload_id=upload_id,
            filename=filename,
            file_id=file_id
        )
        
        # 3. Attendre le traitement
        if self.postflow.wait_for_upload_ready(upload_id):
            print(f"✅ {filename} est prêt")
        
        # 4. Attendre l'approbation
        while not self.postflow.is_upload_approved(upload_id):
            time.sleep(30)  # Vérifier toutes les 30 secondes
            
        print(f"🎉 {filename} approuvé!")
        
        return upload_id
```

## 📊 Monitoring et Statistiques

### Statistiques Globales

```python
stats = postflow.get_tracking_stats()

print(f"Total uploads: {stats['total_tracked']}")
print(f"Uploads actifs: {stats['active_tracks']}")
print(f"Événements traités: {stats['events_processed']}")
print(f"Commentaires analysés: {stats['comments_analyzed']}")

# Distribution des statuts
for status, count in stats['status_distribution'].items():
    print(f"{status}: {count}")
```

### Détails d'un Upload

```python
details = postflow.get_upload_status("upload_001")

print(f"Statut: {details['status']}")
print(f"Review: {details['review_status']}")
print(f"Commentaires: {details['comments_count']}")
print(f"File ID: {details['file_id']}")
print(f"Créé: {details['created_at']}")

# Événements reçus
for event in details['webhook_events_received']:
    print(f"Événement: {event}")
```

## 🔔 Événements Webhook Supportés

Le système traite automatiquement ces événements Frame.io :

- **file.ready** : Fichier prêt pour visionnage
- **file.uploaded** : Upload terminé
- **comment.created** : Nouveau commentaire
- **comment.updated** : Commentaire modifié
- **comment.deleted** : Commentaire supprimé

## 🤖 Analyse Intelligente des Commentaires

Le système analyse automatiquement les commentaires pour déterminer l'approbation :

### Mots-clés d'Approbation
- "approuvé", "approved", "ok", "good"
- "parfait", "excellent", "bravo"
- "valide", "confirmed", "👍", "✅"

### Mots-clés de Rejet
- "non", "no", "refusé", "rejected"
- "problème", "issue", "erreur", "error"
- "à revoir", "needs work", "👎", "❌"

### Score de Sentiment
- **Score > 0.5** : Positif → Approuvé
- **Score < -0.5** : Négatif → Rejeté
- **Entre -0.5 et 0.5** : Neutre → En attente

## 🔧 Configuration Avancée

### Personnaliser l'Analyse

Modifiez `src/services/intelligent_tracker.py` :

```python
# Ajouter vos propres mots-clés
APPROVAL_KEYWORDS = [
    "votre_mot_cle",
    "custom_approval"
]

REJECTION_KEYWORDS = [
    "votre_rejet",
    "custom_rejection"
]
```

### Webhook Cloudflare

Votre tunnel Cloudflare expose automatiquement le webhook. L'URL est disponible via :

```python
webhook_url = postflow.get_webhook_url()
print(f"Configurez Frame.io avec: {webhook_url}")
```

## 🛠️ Dépannage

### Service ne démarre pas

```python
# Vérifier la configuration
config = postflow.config
print(f"Webhook activé: {config['webhook']['enabled']}")

# Vérifier les logs
tail -f logs/postflow_*.log
```

### Webhooks non reçus

1. Vérifiez que Cloudflare Tunnel est actif
2. Testez l'URL webhook manuellement
3. Vérifiez la configuration Frame.io

### Tracking ne fonctionne pas

```python
# Forcer l'enregistrement
postflow.register_upload(
    upload_id="test",
    filename="test.mp4",
    file_id="frame_io_id"
)

# Vérifier immédiatement
details = postflow.get_upload_status("test")
print(details)
```

## 📁 Structure des Fichiers

```
tools/
├── start_postflow.py           # Service de production
├── test_postflow_intelligent.py # Test complet
├── postflow_integration.py     # Module d'intégration
└── GUIDE_UTILISATION.md       # Ce guide

src/services/
├── webhook_service.py          # Service webhook principal
└── intelligent_tracker.py     # Logique de tracking

config/
└── pipeline_config.json       # Configuration principale

logs/
└── postflow_*.log             # Logs du système
```

## 🎯 Cas d'Usage Typiques

### 1. Workflow de Production

```python
# Traitement d'une série de vidéos
videos = ["intro.mp4", "scene1.mp4", "scene2.mp4"]

for video in videos:
    upload_id = upload_and_track(video)
    
    # Attendre traitement
    wait_upload_ready(upload_id)
    
    # Notifier l'équipe
    send_notification(f"{video} prêt pour review")

# Attendre toutes les approbations
all_approved = False
while not all_approved:
    approved_count = sum(1 for uid in upload_ids 
                        if postflow.is_upload_approved(uid))
    
    if approved_count == len(upload_ids):
        all_approved = True
        print("🎉 Tous les uploads approuvés!")
    else:
        time.sleep(60)
```

### 2. Dashboard de Suivi

```python
def print_dashboard():
    stats = postflow.get_tracking_stats()
    
    print("📊 DASHBOARD POSTFLOW")
    print("=" * 40)
    print(f"📈 Uploads actifs: {stats['active_tracks']}")
    print(f"✅ Approuvés: {stats['review_status_distribution'].get('approved', 0)}")
    print(f"❌ Rejetés: {stats['review_status_distribution'].get('rejected', 0)}")
    print(f"⏳ En attente: {stats['review_status_distribution'].get('pending', 0)}")

# Afficher toutes les 30 secondes
while True:
    print_dashboard()
    time.sleep(30)
```

### 3. Automatisation Complète

```python
def auto_workflow(video_folder):
    """Workflow automatisé complet"""
    
    # 1. Traiter tous les MP4
    for video_file in glob.glob(f"{video_folder}/*.mp4"):
        upload_id = upload_and_track(video_file)
        
        # 2. Attendre processing + approbation
        if wait_upload_ready(upload_id) and wait_approval(upload_id):
            # 3. Déclencher post-traitement
            trigger_post_processing(upload_id)
        else:
            log_error(f"Échec workflow pour {video_file}")

def wait_approval(upload_id, max_wait=3600):
    """Attend l'approbation avec timeout"""
    start_time = time.time()
    
    while time.time() - start_time < max_wait:
        if postflow.is_upload_approved(upload_id):
            return True
        time.sleep(30)
    
    return False
```

## 🎉 C'est Parti !

Votre système de tracking intelligent est maintenant prêt. Il surveille automatiquement vos uploads Frame.io et vous indique quand vos vidéos sont approuvées.

**Commandes essentielles :**

```bash
# Démarrer le service
python tools/start_postflow.py

# Tester le système
python tools/test_postflow_intelligent.py

# Intégrer dans votre code
from tools.postflow_integration import init_postflow, track_upload
```

Bon tracking ! 🚀
