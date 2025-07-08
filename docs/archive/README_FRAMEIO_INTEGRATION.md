# 🎬 RL PostFlow - Intégration LucidLink → Frame.io

## 📋 Vue d'ensemble

Cette intégration complète automatise le workflow de transfert des fichiers vidéo depuis LucidLink vers Frame.io, incluant :

- **Détection automatique** des nouveaux fichiers dans `/BY_SHOT/`
- **Parsing intelligent** des noms de fichiers selon votre nomenclature
- **Création automatique** de la structure `/SCENES/SCENE/SHOT/` dans Frame.io
- **Upload optimisé** avec gestion d'erreurs et retry
- **Notifications Discord** enrichies avec métadonnées complètes
- **Monitoring et logging** complets

## 🚀 Installation Rapide

### 1. Déploiement Automatisé
```bash
# Cloner le projet
git clone <your-repo> /tmp/rl_postflow

# Lancer le déploiement automatisé
cd /tmp/rl_postflow
sudo chmod +x scripts/deploy_frameio_integration.sh
sudo ./scripts/deploy_frameio_integration.sh
```

### 2. Configuration
```bash
# Éditer la configuration
sudo nano /opt/rl_postflow/.env

# Configurer les variables essentielles
FRAMEIO_ACCOUNT_ID=your_account_id
FRAMEIO_WORKSPACE_ID=your_workspace_id
FRAMEIO_CLIENT_ID=your_client_id
FRAMEIO_CLIENT_SECRET=your_client_secret
FRAMEIO_JWT_KEY=your_jwt_key
DISCORD_WEBHOOK_URL=your_discord_webhook
LUCIDLINK_BY_SHOT_PATH=/path/to/your/BY_SHOT
```

### 3. Démarrage
```bash
cd /opt/rl_postflow
./start.sh
```

## 🏗️ Architecture

```
📦 RL PostFlow Integration
├── 🔍 Parser          # Extraction métadonnées fichiers
├── 📁 Structure       # Gestion dossiers Frame.io + cache
├── ⬆️ Upload          # Upload optimisé Frame.io v4
├── 💬 Notifier        # Notifications Discord enrichies
├── 🔗 Integration     # Orchestrateur principal
├── 🌉 Bridge          # Pont LucidLink → Frame.io
└── 📊 Monitoring      # Surveillance et métriques
```

## 🎯 Workflow Automatisé

### 1. Détection Fichier
```
/BY_SHOT/SC01_UNDLM_00412_V002.mov
                ↓
         📄 Fichier détecté
```

### 2. Parsing Automatique
```python
# Extraction métadonnées
metadata = {
    'scene_name': 'SC01',
    'shot_id': 'UNDLM_00412', 
    'version': 'V002',
    'nomenclature': 'SC01_UNDLM_00412_V002'
}
```

### 3. Structure Frame.io
```
Frame.io
└── SCENES/
    └── SC01/
        └── UNDLM_00412/
            └── SC01_UNDLM_00412_V002.mov
```

### 4. Notification Discord
```
✅ Upload Frame.io Réussi
🎬 Scène: SC01
🎞️ Plan: UNDLM_00412
🔁 Version: V002
🔗 Voir sur Frame.io
```

## 📝 Nomenclature Supportée

### Formats Principaux
- `SC01_UNDLM_00412_V002.mov` ✅
- `13H49_-_RECUPERATION_DES_2_SURVIVANTS_S01_V001.mov` ✅
- `2EME_MAYDAY_EXT_-_NUIT_AMERICAINE_S03_V005.mp4` ✅

### Extensions Supportées
- `.mov`, `.mp4`, `.avi`, `.mkv`, `.mxf`
- `.prores`, `.dnxhd`, `.r3d`, `.braw`

## 🔧 Commandes Utiles

```bash
# Démarrer le service
./start.sh

# Arrêter le service
./stop.sh

# Redémarrer le service
./restart.sh

# Voir les logs en temps réel
./logs.sh

# Tester la configuration
./test.sh

# Monitoring
python scripts/monitor_frameio_integration.py

# Monitoring continu
python scripts/monitor_frameio_integration.py --interval 30
```

## 📊 Monitoring

### Statut en Temps Réel
```bash
# Monitoring simple
./logs.sh

# Monitoring avancé
python scripts/monitor_frameio_integration.py --once
```

### Métriques Disponibles
- **Service**: Status, uptime, processus
- **Statistiques**: Fichiers traités, uploads, erreurs
- **Queue**: Fichiers en attente
- **Structure**: Scènes et plans créés
- **Système**: CPU, mémoire, disque
- **Santé**: Score global et problèmes

### Exemple de Sortie
```
🎬 RL PostFlow - Frame.io Integration Status
============================================
Timestamp: 2024-01-15T10:30:00

🔧 Service: ✅ running
   Enabled: ✅

⚙️ Processus: PID 12345
   Uptime: 2.5h
   CPU: 15.2%
   Memory: 245.8 MB (12.3%)

📊 Statistiques (dernière heure):
   Fichiers traités: 15
   Uploads réussis: 14
   Erreurs: 1
   Dernier upload: 2024-01-15T10:25:00

🏥 Santé: ✅ HEALTHY (95/100)
```

## 🐛 Dépannage

### Problèmes Courants

**❌ Service ne démarre pas**
```bash
# Vérifier les logs
journalctl -u frameio-bridge.service -f

# Vérifier la configuration
cat /opt/rl_postflow/.env

# Redémarrer
sudo systemctl restart frameio-bridge.service
```

**❌ Fichiers non détectés**
```bash
# Vérifier le chemin LucidLink
ls -la /path/to/BY_SHOT/

# Vérifier les permissions
sudo chown -R postflow:postflow /opt/rl_postflow
```

**❌ Erreurs d'upload**
```bash
# Tester l'authentification Frame.io
python examples/frameio_lucidlink_demo.py

# Vérifier les variables d'environnement
env | grep FRAMEIO
```

**❌ Notifications Discord absentes**
```bash
# Tester le webhook
curl -X POST -H "Content-Type: application/json" \
  -d '{"content":"Test"}' \
  $DISCORD_WEBHOOK_URL
```

## 📁 Structure du Projet

```
/opt/rl_postflow/
├── src/
│   ├── integrations/
│   │   └── frameio/
│   │       ├── parser.py          # Parsing fichiers
│   │       ├── structure.py       # Gestion dossiers
│   │       ├── upload.py          # Upload Frame.io
│   │       ├── notifier.py        # Notifications Discord
│   │       └── integration.py     # Orchestrateur
│   └── workflows/
│       └── lucidlink_frameio_bridge.py  # Service principal
├── config/
│   ├── frameio_integration.json   # Configuration
│   └── frameio_structure.json     # Cache structure
├── logs/
│   ├── frameio_integration.log    # Logs applicatifs
│   └── metrics.json               # Métriques
├── scripts/
│   ├── deploy_frameio_integration.sh    # Déploiement
│   ├── monitor_frameio_integration.py   # Monitoring
│   └── setup_frameio_integration.py     # Configuration
├── systemd/
│   └── frameio-bridge.service     # Service systemd
└── examples/
    └── frameio_lucidlink_demo.py  # Démonstration
```

## 🔒 Sécurité

### Variables d'Environnement
- Stockage sécurisé des credentials Frame.io
- Séparation des environnements dev/prod
- Rotation automatique des tokens

### Permissions Système
- Utilisateur dédié `postflow`
- Permissions minimales requises
- Isolation des processus

### Logging
- Pas de credentials dans les logs
- Rotation automatique des fichiers
- Monitoring des erreurs

## 🚀 Optimisations

### Performance
- Upload parallèle (configurable)
- Cache JSON pour éviter les doublons
- Compression des logs
- Monitoring des ressources

### Fiabilité
- Retry automatique en cas d'erreur
- Gestion des timeouts
- Redémarrage automatique du service
- Sauvegarde des configurations

## 📋 Checklist de Production

### ✅ Prérequis
- [ ] Python 3.8+ installé
- [ ] Credentials Frame.io configurés
- [ ] Accès au workspace Frame.io
- [ ] Discord webhook configuré
- [ ] Chemin LucidLink accessible

### ✅ Configuration
- [ ] Variables d'environnement définies
- [ ] Fichier de configuration créé
- [ ] Permissions système configurées
- [ ] Service systemd activé

### ✅ Tests
- [ ] Parser fonctionne avec vos fichiers
- [ ] Structure Frame.io créée
- [ ] Upload test réussi
- [ ] Notifications Discord reçues
- [ ] Monitoring opérationnel

### ✅ Déploiement
- [ ] Service démarré automatiquement
- [ ] Logs supervisés
- [ ] Métriques collectées
- [ ] Alertes configurées

## 🔄 Maintenance

### Tâches Quotidiennes
- Vérifier les logs d'erreur
- Contrôler les métriques
- Valider les uploads récents

### Tâches Hebdomadaires
- Analyser les statistiques
- Nettoyer les logs anciens
- Vérifier l'espace disque

### Tâches Mensuelles
- Sauvegarder les configurations
- Mettre à jour les dépendances
- Réviser les performances

## 🆘 Support

### Logs Utiles
```bash
# Logs du service
journalctl -u frameio-bridge.service -f

# Logs applicatifs
tail -f /opt/rl_postflow/logs/frameio_integration.log

# Statut système
systemctl status frameio-bridge.service
```

### Informations de Debug
```bash
# Configuration
cat /opt/rl_postflow/.env

# Processus
ps aux | grep frameio

# Ressources
top -p $(pgrep -f frameio)
```

## 📚 Documentation Avancée

- [Configuration Détaillée](docs/CONFIGURATION.md)
- [API Frame.io v4](docs/FRAMEIO_API.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Développement](docs/DEVELOPMENT.md)

---

*Cette intégration a été développée pour automatiser le workflow LucidLink → Frame.io du pipeline RL PostFlow. Elle respecte les best practices de l'API Frame.io v4 et inclut une surveillance complète du système.*

## 🎯 Résumé des Fonctionnalités

✅ **Parsing automatique** des noms de fichiers  
✅ **Structure Frame.io** créée automatiquement  
✅ **Upload optimisé** avec retry et gestion d'erreurs  
✅ **Notifications Discord** enrichies  
✅ **Cache JSON** pour éviter les doublons  
✅ **Monitoring complet** avec métriques  
✅ **Service systemd** pour démarrage automatique  
✅ **Scripts de déploiement** automatisés  
✅ **Documentation complète** et exemples  

**🚀 Prêt pour la production !**
