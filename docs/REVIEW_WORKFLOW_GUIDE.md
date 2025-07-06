# 🎬 UNDLM PostFlow - Guide d'Utilisation du Workflow de Review

## 🎯 Vue d'Ensemble

Le système PostFlow intègre maintenant un workflow complet de gestion des reviews qui connecte :
- **LucidLink** : Détection des nouveaux exports
- **Frame.io** : Upload et review des plans
- **Discord** : Notifications et communication d'équipe

## 🔄 Workflow Complet

### 1. 📁 **Détection Automatique**
- Le système surveille `/4_OUT/2_FROM_VFX/BY_SHOT/` sur LucidLink
- Détecte automatiquement les nouveaux fichiers `.mov`
- Vérifie la nomenclature `UNDLM_XXXXX`
- Extrait la version du fichier

### 2. 📢 **Notification Discord (Artiste)**
```
🎬 NOUVEAU FICHIER PRÊT
Plan UNDLM_00123 v3 disponible
🎭 Scène: SCENE_NAUFRAGE
📁 Fichier: UNDLM_00123_v003.mov
❓ Action: Tapez 'review' pour envoyer sur Frame.io
```

### 3. 🚀 **Demande de Review**
L'artiste peut demander une review via Discord :
```
review UNDLM_00123
```

### 4. 📤 **Upload Automatique**
- Le système upload automatiquement sur Frame.io
- Crée un lien de review
- Change le statut à "En cours de review"

### 5. 📢 **Notification Discord (Superviseur)**
```
👀 NOUVEAU PLAN À REVIEWER
UNDLM_00123 v3 prêt pour review
👤 Demandé par: Artist_Name
🎭 Scène: SCENE_NAUFRAGE
🔗 Lien Frame.io: [Voir le plan]
❓ Action: Répondez 'approved' ou 'rejected'
```

### 6. ✅ **Review et Approbation**
Le superviseur peut approuver ou rejeter via Discord :
```
approved UNDLM_00123
rejected UNDLM_00123
```

### 7. 📢 **Notification Final (Artiste)**
```
📝 REVIEW TERMINÉE
Le plan UNDLM_00123 a été approuvé
✅ Statut: Approuvé
👨‍💼 Reviewé par: Supervisor_Name
💬 Commentaires: 2 commentaire(s) disponible(s)
🔗 Lien Frame.io: [Voir les commentaires]
```

## 🛠️ Installation et Configuration

### 1. **Configuration des Intégrations**
Modifier `config/integrations.json` :

```json
{
    "lucidlink": {
        "base_path": "/Volumes/resizelab/o2b-undllm",
        "watch_folders": true,
        "notifications_enabled": true
    },
    "frameio": {
        "api_token": "votre_token_frameio",
        "project_id": "votre_project_id",
        "upload_enabled": true
    },
    "discord": {
        "webhook_url": "votre_webhook_discord",
        "username": "PostFlow BOT"
    }
}
```

### 2. **Démarrage du Système**

#### Pipeline Principal (traitement CSV)
```bash
python main.py
```

#### Test du Workflow
```bash
python scripts/test_review_workflow.py
```

#### Mode Interactif
```bash
python scripts/test_review_workflow.py --interactive
```

#### Surveillance Temps Réel
```bash
python scripts/lucidlink_watcher.py
```

## 📋 Commandes Discord

### **Pour les Artistes**
- `review UNDLM_XXXXX` - Demander une review
- `status` - Voir le statut des reviews

### **Pour les Superviseurs**
- `approved UNDLM_XXXXX` - Approuver un plan
- `rejected UNDLM_XXXXX` - Rejeter un plan
- `status` - Voir les statistiques globales

## 🔍 Surveillance et Monitoring

### **Statuts des Plans**
- `exported` - Fichier exporté, prêt pour review
- `review_requested` - Review demandée
- `uploaded` - Upload Frame.io terminé
- `in_review` - En cours de review
- `approved` - Approuvé
- `rejected` - Rejeté, corrections nécessaires

### **Notifications Automatiques**
- Nouveau fichier détecté
- Upload terminé
- Review demandée
- Review terminée
- Erreurs système

## 🎯 Avantages du Système

### **✅ Pour les Artistes**
- Notification immédiate des exports prêts
- Demande de review simplifiée
- Feedback automatique des superviseurs
- Accès direct aux commentaires Frame.io

### **✅ Pour les Superviseurs**
- Notifications avec contexte complet
- Lien direct vers Frame.io
- Workflow guidé et automatisé
- Traçabilité des reviews

### **✅ Pour l'Équipe**
- Communication centralisée
- Pas de versions intermédiaires sur Frame.io
- Historique complet des reviews
- Réduction des erreurs manuelles

## 🚨 Dépannage

### **Problèmes Courants**

#### LucidLink non connecté
```bash
# Vérifier le montage
ls -la /Volumes/resizelab/o2b-undllm
```

#### Discord non configuré
```bash
# Tester le webhook
python scripts/test_discord_integration.py
```

#### Frame.io non accessible
```bash
# Vérifier la configuration
python scripts/test_frameio_connection.py
```

### **Logs et Debugging**
Les logs sont disponibles dans :
- Console Python pour les erreurs
- `data/review_state.json` pour l'état des reviews
- Discord pour les notifications système

## 📊 Statistiques et Reporting

### **Statistiques Disponibles**
- Nombre total de plans en review
- Plans approuvés/rejetés
- Temps moyen de review
- Nombre de commentaires par plan

### **Rapports Automatiques**
- Résumé quotidien des reviews
- Alertes pour les plans en retard
- Notifications d'erreurs système

## 🔧 Maintenance

### **Sauvegarde des Données**
```bash
# Sauvegarder l'état des reviews
cp data/review_state.json backups/review_state_$(date +%Y%m%d).json
```

### **Nettoyage Périodique**
```bash
# Nettoyer les reviews anciennes
python scripts/cleanup_old_reviews.py
```

## 🚀 Déploiement en Production

### **1. Configuration Serveur**
- Installer les dépendances Python
- Configurer les webhooks Discord
- Monter le volume LucidLink
- Configurer Frame.io

### **2. Démarrage Automatique**
```bash
# Créer un service systemd
sudo systemctl enable postflow-watcher
sudo systemctl start postflow-watcher
```

### **3. Monitoring**
- Surveiller les logs système
- Vérifier les connexions LucidLink
- Tester les notifications Discord
- Valider les uploads Frame.io

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs de debug
2. Tester les intégrations individuellement
3. Consulter la documentation Frame.io/Discord
4. Contacter l'équipe technique

---

**🎬 UNDLM PostFlow - Workflow de Review Intégré**  
*Version 2.0 - Système de production prêt*
