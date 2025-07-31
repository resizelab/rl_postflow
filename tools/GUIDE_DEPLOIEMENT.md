# 🚀 Guide de Déploiement - PostFlow avec Tracking Intelligent

## 📋 Vue d'ensemble

Votre système PostFlow est maintenant équipé d'un **tracking intelligent** qui surveille automatiquement vos uploads Frame.io et détecte les approbations via l'analyse des commentaires.

## 🎯 Fonctionnalités Intégrées

### ✅ **Workflow Automatisé**
- **Upload automatique** : Détection des nouveaux fichiers → Upload Frame.io
- **Tracking intelligent** : Enregistrement automatique pour surveillance
- **Analyse de commentaires** : Détection auto des approbations/rejets
- **Notifications** : Discord + Google Sheets mis à jour

### 🧠 **Intelligence Artificielle**
- **Analyse sémantique** des commentaires Frame.io
- **Score de sentiment** pour déterminer l'approbation
- **Mots-clés intelligents** (français + anglais + emojis)
- **Mapping automatique** filename ↔ file_id

### 🌐 **Infrastructure**
- **Cloudflare Tunnel** : Exposition sécurisée des webhooks
- **Frame.io API V4** : Dernière version avec signature HMAC
- **Architecture hybride** : Webhook global + routage intelligent

## 🔧 Configuration Requise

### 1. **pipeline_config.json**

```json
{
  "webhook": {
    "enabled": true,
    "port": 8080,
    "auto_start": true,
    "intelligent_tracking": true
  },
  "workflow": {
    "enable_frameio_upload": true,
    "enable_thumbnails": true,
    "enable_sheets_updates": true,
    "enable_discord_notifications": true
  },
  "frameio": {
    "account_id": "votre_account_id",
    "workspace_id": "votre_workspace_id",
    "project_id": "votre_project_id"
  }
}
```

### 2. **Dépendances**

Assurez-vous que ces modules sont installés :
```bash
pip install flask requests hmac hashlib threading
```

### 3. **Authentification Frame.io**

Votre authentification OAuth Frame.io existante sera utilisée automatiquement.

## 🚀 Démarrage

### Option 1 : Service Complet (Recommandé)

```bash
# Démarrer le pipeline complet
python main.py
```

**Ce qui se lance automatiquement :**
- ✅ Webhook Cloudflare Tunnel
- ✅ Tracking intelligent intégré
- ✅ Surveillance des dossiers
- ✅ Dashboard web
- ✅ Toutes les intégrations

### Option 2 : Test du Système

```bash
# Tester la configuration
python tools/test_workflow_intelligent.py

# Tester uniquement le tracking intelligent
python tools/test_postflow_intelligent.py
```

### Option 3 : Service Standalone

```bash
# Démarrer seulement le tracking intelligent
python tools/start_postflow.py
```

## 📊 Monitoring en Temps Réel

### Dashboard Web

Une fois démarré, accédez à votre dashboard habituel. Le tracking intelligent y sera intégré.

### Logs en Direct

```bash
# Suivre les logs
tail -f logs/postflow_*.log

# Logs spécifiques au tracking
grep "🧠" logs/postflow_*.log
```

### Statistiques API

```python
# Dans votre code Python
from tools.postflow_integration import init_postflow

postflow = init_postflow()
stats = postflow.get_tracking_stats()

print(f"Uploads trackés: {stats['total_tracked']}")
print(f"Approuvés: {stats['review_status_distribution']['approved']}")
```

## 🎯 Workflow Type

### 1. **Upload Automatique**

Quand vous déposez `MA_VIDEO_v001.mp4` dans votre dossier surveillé :

```
📁 Fichier détecté → MA_VIDEO_v001.mp4
🔍 Vérification doublons → Nouveau fichier
📋 Création tracking → upload_12345
📤 Upload Frame.io → file_abc123
🧠 Enregistrement intelligent → Mapping filename ↔ file_id
✅ Prêt pour surveillance
```

### 2. **Surveillance Intelligente**

Le système surveille automatiquement Frame.io :

```
🔔 Événement Frame.io → file.ready reçu
🎯 Mapping intelligent → MA_VIDEO_v001.mp4 identifiée
📊 Statut mis à jour → READY
👁️ Surveillance commentaires → Activée
```

### 3. **Analyse des Commentaires**

Quand un commentaire arrive sur Frame.io :

```
💬 Nouveau commentaire → "Parfait ! Approuvé ✅"
🧠 Analyse intelligente → Score: +0.8 (Positif)
✅ Détection approbation → APPROVED
📊 Mise à jour statut → Workflow terminé
🔔 Notification équipe → "MA_VIDEO_v001.mp4 approuvée !"
```

## 🔍 Exemples d'Analyse

### Commentaires d'Approbation ✅

- "Parfait !"
- "Approved ✅"
- "Good to go 👍"
- "Excellent travail"
- "OK pour moi"

### Commentaires de Rejet ❌

- "Problème avec les couleurs"
- "Needs work ❌"
- "À revoir 👎"
- "Erreur dans le montage"
- "Non, refusé"

### Commentaires Neutres ⏳

- "Question : qui est le réalisateur ?"
- "FYI: deadline demain"
- "Note pour plus tard"

## 🛠️ Intégration dans Votre Code

### Ajout Simple

```python
# Dans votre script existant
from tools.postflow_integration import init_postflow, track_upload

# Initialiser une fois
postflow = init_postflow()
postflow.start_tracking()

# Après chaque upload Frame.io
def upload_video(filename):
    # Votre upload existant
    result = your_frameio_upload(filename)
    
    # Ajouter le tracking intelligent
    if result.get('file_id'):
        track_upload(
            upload_id=f"upload_{int(time.time())}",
            filename=filename,
            file_id=result['file_id']
        )
    
    return result
```

### Vérification d'Approbation

```python
# Attendre l'approbation
def wait_for_approval(upload_id):
    while True:
        if postflow.is_upload_approved(upload_id):
            print(f"🎉 {upload_id} approuvé !")
            return True
        elif postflow.is_upload_rejected(upload_id):
            print(f"❌ {upload_id} rejeté")
            return False
        
        time.sleep(30)  # Vérifier toutes les 30 secondes
```

## 🔧 Configuration Avancée

### Personnaliser l'Analyse

Modifiez `src/integrations/frameio/intelligent_tracker.py` :

```python
# Ajouter vos mots-clés spécifiques
APPROVAL_KEYWORDS = [
    "validé",           # Votre vocabulaire
    "go live",          # Termes métier
    "broadcast ready"   # Expressions spécifiques
]

REJECTION_KEYWORDS = [
    "color grading",    # Problèmes techniques
    "audio sync",       # Issues récurrentes
    "legal review"      # Processus internes
]
```

### Webhook Frame.io

L'URL de votre webhook est automatiquement configurée :

```
https://votre-tunnel-unique.trycloudflare.com/frameio-webhook
```

Configurez cette URL dans Frame.io → Settings → Webhooks.

## 📈 Métriques et Analytics

### Statistiques Disponibles

```python
stats = postflow.get_tracking_stats()

{
    "total_tracked": 156,
    "active_tracks": 12,
    "events_processed": 1247,
    "comments_analyzed": 89,
    "status_distribution": {
        "READY": 45,
        "PENDING": 12,
        "APPROVED": 78,
        "REJECTED": 21
    },
    "review_status_distribution": {
        "approved": 78,
        "rejected": 21,
        "pending": 57
    }
}
```

### Détails par Upload

```python
details = postflow.get_upload_details("upload_12345")

{
    "filename": "MA_VIDEO_v001.mp4",
    "status": "APPROVED",
    "review_status": "approved", 
    "file_id": "frame_abc123",
    "comments_count": 3,
    "created_at": "2025-07-31T10:30:00",
    "approved_at": "2025-07-31T11:45:00",
    "webhook_events_received": [
        "file.ready:2025-07-31T10:31:00",
        "comment.created:2025-07-31T11:15:00",
        "comment.created:2025-07-31T11:45:00"
    ]
}
```

## 🚨 Dépannage

### Webhook ne fonctionne pas

```bash
# Vérifier le tunnel Cloudflare
python tools/test_postflow_intelligent.py

# Vérifier les logs
grep "webhook" logs/postflow_*.log

# Tester manuellement
curl https://votre-tunnel.trycloudflare.com/frameio-webhook
```

### Tracking ne s'active pas

```bash
# Vérifier la configuration
python -c "
import json
with open('pipeline_config.json') as f:
    config = json.load(f)
    print('Webhook enabled:', config.get('webhook', {}).get('enabled'))
    print('Intelligent tracking:', config.get('webhook', {}).get('intelligent_tracking'))
"
```

### Upload non détecté

```python
# Forcer l'enregistrement
from tools.postflow_integration import init_postflow

postflow = init_postflow()
postflow.register_upload(
    upload_id="debug_test",
    filename="MA_VIDEO_v001.mp4",
    file_id="frame_abc123"
)

# Vérifier immédiatement
details = postflow.get_upload_details("debug_test")
print(details)
```

## 🎉 Félicitations !

Votre système PostFlow est maintenant équipé d'un **tracking intelligent de niveau entreprise** qui :

✅ **Automatise complètement** le suivi des approbations Frame.io  
✅ **Analyse intelligemment** les commentaires en français et anglais  
✅ **S'intègre parfaitement** dans votre workflow existant  
✅ **Fournit des métriques** détaillées en temps réel  
✅ **Utilise Cloudflare** pour une exposition sécurisée  

**Votre équipe peut maintenant se concentrer sur la création, le système gère le tracking !** 🚀

---

## 📞 Support

Pour toute question :
1. Consultez les logs : `logs/postflow_*.log`
2. Testez avec : `python tools/test_postflow_intelligent.py`
3. Vérifiez la config : `pipeline_config.json`

**Le tracking intelligent est opérationnel !** 🧠✨
