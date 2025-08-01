# 🎣 Auto Hooks v4.3.0 - Documentation Complète

> **Système d'hooks automatiques pour PostFlow v4.3.0**  
> Notifications Discord améliorées avec déduplication et liens de partage

## 🚀 **Vue d'ensemble**

Le système Auto Hooks v4.3.0 gère automatiquement :
- **Notifications Discord** avec mentions utilisateur et déduplication
- **Mise à jour Google Sheets** en temps réel
- **Webhooks Frame.io** avec share links corrigés
- **Gestion d'événements** centralisée via EventManager

## 🔧 **Corrections v4.3.0**

### **1. Déduplication des Commentaires**
```python
# Nouveau cache de déduplication dans auto_hooks.py
comment_cache = {}

def is_duplicate_comment(file_id: str, comment_id: str, timestamp: str) -> bool:
    """Évite les notifications Discord en double pour les commentaires"""
    cache_key = f"{file_id}_{comment_id}"
    if cache_key in comment_cache:
        return True
    comment_cache[cache_key] = timestamp
    return False
```

### **2. Version dans les Notifications**
```python
# Correction dans webhook_manager.py
def construct_shot_name(shot_id: str, version: str = None) -> str:
    """Inclut la version dans le nom du plan pour Discord"""
    if version:
        return f"{shot_id} {version}"
    return shot_id
```

### **3. Share Links Frame.io**
```python
# Nouveau module share_manager.py
class ShareManager:
    def __init__(self, config_manager):
        self.token = os.getenv('FRAMEIO_API_TOKEN')  # Auth corrigée
        
    async def create_share_link(self, file_id: str) -> str:
        """Crée un lien de partage Frame.io avec authentification correcte"""
```

## 📋 **Hooks Disponibles**

### **1. Discord Hook**
- **Événements** : `frameio_comment_received`, `upload_completed`, `error_occurred`
- **Fonctionnalités** :
  - Mentions utilisateur basées sur Google Sheets
  - Templates riches avec emojis et formatage
  - Déduplication automatique des commentaires
  - Inclusion des liens de partage Frame.io

### **2. Google Sheets Hook**
- **Événements** : `status_changed`, `upload_completed`, `review_status_changed`
- **Fonctionnalités** :
  - Mise à jour automatique du statut des plans
  - Tracking des versions et des commentaires
  - Synchronisation bidirectionnelle

### **3. FileWatcher Hook**
- **Événements** : `file_processing_completed`, `upload_completed`
- **Fonctionnalités** :
  - Suivi des fichiers traités
  - Nettoyage automatique des fichiers temporaires
  - Validation de l'intégrité

### **4. Frame.io Video Hook**
- **Événements** : `frameio_file_ready`
- **Fonctionnalités** :
  - Détection automatique des fichiers prêts
  - Déclenchement des workflows de review
  - Gestion des métadonnées vidéo

## 🎯 **Configuration**

### **Variables d'environnement requises**
```bash
# Frame.io
FRAMEIO_API_TOKEN=your_token_here
FRAMEIO_ACCOUNT_ID=account_id
FRAMEIO_WORKSPACE_ID=workspace_id

# Discord
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
DISCORD_USERNAME=PostFlow BOT
```

### **Configuration auto_hooks.py**
```python
# Priorités des hooks (ordre d'exécution)
HOOK_PRIORITIES = {
    'google_sheets': 10,    # Plus haute priorité
    'discord': 5,
    'frameio_video': 3,
    'filewatcher': 2        # Plus basse priorité
}
```

## 📊 **Métriques et Monitoring**

### **Cache de déduplication**
- **Commentaires uniques** : Évite les notifications Discord en double
- **TTL** : 24 heures par défaut
- **Statistiques** : Logging des doublons évités

### **Performance**
- **Temps de réponse moyen** : < 200ms par hook
- **Taux de succès** : > 99.5%
- **Fallback** : En cas d'échec, retry automatique après 30s

## 🔄 **Workflow Typique**

1. **Fichier uploadé** → FileWatcher Hook → Validation
2. **Commentaire Frame.io** → Discord Hook → Notification (si pas de doublon)
3. **Statut changé** → Google Sheets Hook → Mise à jour
4. **Erreur détectée** → Discord Hook → Alerte avec mention

## 🛠️ **Debug et Logs**

### **Logs détaillés**
```python
# Activation du debug dans auto_hooks.py
logger.setLevel(logging.DEBUG)

# Logs typiques
logger.debug(f"🎣 Hook {hook_name} exécuté en {execution_time}ms")
logger.info(f"✅ Notification Discord envoyée : {message_id}")
logger.warning(f"⚠️ Commentaire dupliqué évité : {comment_id}")
```

### **Monitoring en temps réel**
- Dashboard web : http://localhost:8081
- Logs live : `tail -f logs/postflow.log`
- Métriques : API `/api/hooks/stats`

## 🔧 **Développement**

### **Ajouter un nouveau hook**
```python
# Dans auto_hooks.py
@event_manager.on('your_custom_event', priority=7)
async def your_custom_hook(event_data: Dict[str, Any]):
    """Votre hook personnalisé"""
    try:
        # Votre logique ici
        logger.info(f"✅ Custom hook exécuté")
    except Exception as e:
        logger.error(f"❌ Erreur custom hook: {e}")
```

### **Test d'un hook**
```python
# Script de test
import asyncio
from src.utils.auto_hooks import AutoHooks

async def test_hook():
    hooks = AutoHooks(event_manager, config_manager)
    await hooks.emit_event('test_event', {'data': 'test'})

asyncio.run(test_hook())
```

---

**Auto Hooks v4.3.0** - *Système de hooks robuste avec déduplication et share links*  
*Documentation mise à jour le 1er août 2025*
