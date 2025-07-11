# 📚 DOCUMENTATION POSTFLOW

## 🎯 Vue d'ensemble

PostFlow est un système d'automatisation pour la post-production qui s'adapte automatiquement à votre Google Sheet existant. Il génère un mapping dynamique des colonnes et fournit des outils d'intégration avec Frame.io, Discord et Google Drive.

## � Structure de la documentation

### 🚀 Guides de démarrage
- [**Guide utilisateur**](user-guides/README.md) - Comment utiliser PostFlow au quotidien
- [**Installation rapide**](setup/QUICK_START.md) - Mise en route en 10 minutes
- [**Configuration**](setup/CONFIGURATION.md) - Configuration détaillée

### 🔧 Guides techniques
- [**Google Sheets & Mapping dynamique**](technical/GOOGLE_SHEETS_MAPPING.md) - Adaptation automatique aux colonnes
- [**Système de vignettes**](technical/THUMBNAILS_SYSTEM.md) - Génération automatique d'images
- [**Intégrations**](integrations/README.md) - Frame.io, Discord, Google Drive

### 📖 Références
- [**API Reference**](reference/API.md) - Documentation des modules
- [**Architecture**](reference/ARCHITECTURE.md) - Structure du projet
- [**Troubleshooting**](reference/TROUBLESHOOTING.md) - Résolution de problèmes

## ✨ Fonctionnalités principales

### 🔄 **Mapping dynamique**
- **Adaptation automatique** à votre structure Google Sheets
- **Détection intelligente** des colonnes (PLAN, STATUS, ATTRIBUTION...)
- **Suggestions automatiques** pour les colonnes manquantes

### 🖼️ **Vignettes automatiques**
- **Extraction automatique** de la première frame des rushs
- **Upload organisé** vers Google Drive (PostFlow_Thumbnails/Projet/Date/)
- **Insertion directe** dans Google Sheets avec formule `=IMAGE()`

### 🔗 **Intégrations natives**
- **Frame.io** - Synchronisation des projets et reviews
- **Discord** - Notifications d'équipe avec filtrage par département
- **Google Drive** - Stockage sécurisé des vignettes

## 🎬 Exemple d'utilisation

```bash
# 1. Analyser votre Google Sheet
python scripts/analyze_spreadsheet_structure.py

# 2. Générer les vignettes
python scripts/generate_drive_thumbnails.py 10

# 3. Tester l'intégration
python scripts/test_google_sheets_real.py
```

## 📊 Compatibilité Google Sheets

PostFlow s'adapte à **n'importe quelle organisation** de colonnes :

| Votre colonne | PostFlow comprend |
|--------------|-------------------|
| `PLAN` | → `shot_name` |
| `STATUS` | → `status` |
| `ATTRIBUTION` | → `attribution` |
| `DEPT` | → `department` |
| `ACTIF` | → `active` |

## 🏗️ Architecture

```
rl_postflow/
├── config/           # Configuration (mapping, credentials)
├── src/              # Code source (modules réutilisables)
├── scripts/          # Scripts d'automation
├── docs/             # Documentation organisée
└── temp/             # Fichiers temporaires (vignettes)
```

## 🚨 Support

Pour toute question ou problème :
1. Consultez [Troubleshooting](reference/TROUBLESHOOTING.md)
2. Vérifiez les [logs](../logs/) pour les erreurs
3. Testez avec les scripts de validation

---

**Version actuelle :** 1.1 (Juillet 2025)  
**Projet :** UNDLM - Post-production automatisée  
**Dernière mise à jour :** Système de vignettes Google Drive opérationnel
- [`ERROR_HANDLING.md`](core/ERROR_HANDLING.md) - Gestion des erreurs

### � Intégrations (`/integrations/`)
Documentation spécifique aux intégrations :
- [`GOOGLE_SHEETS_DYNAMIC_MAPPING.md`](integrations/GOOGLE_SHEETS_DYNAMIC_MAPPING.md) - Mapping dynamique Google Sheets
- [`THUMBNAILS_SYSTEM.md`](integrations/THUMBNAILS_SYSTEM.md) - Système de vignettes automatiques
- [`FRAMEIO_*.md`](integrations/) - Intégration Frame.io

### 👥 Guides Utilisateur (`/user-guides/`)
Guides pratiques pour les utilisateurs :
- [`POSTFLOW_USER_GUIDE.md`](user-guides/POSTFLOW_USER_GUIDE.md) - Guide utilisateur principal
- [`CLOUDFLARE_TUNNEL_GUIDE.md`](user-guides/CLOUDFLARE_TUNNEL_GUIDE.md) - Configuration Cloudflare

### � Archive (`/archive/`)
Ancienne documentation conservée pour référence :
- [`legacy/`](archive/legacy/) - Anciens fichiers Adobe, etc.

### 📁 Archive
- [📄 Test de l'Intégration Frame.io - Résumé des Capacités](archive/FRAMEIO_TESTING_SUMMARY.md)
- [📄 🎬 Frame.io OAuth Authentication - Guide Final](archive/README_FRAMEIO_OAUTH_FINAL.md)
- [📄 🎬 RL PostFlow - Intégration LucidLink → Frame.io](archive/README_FRAMEIO_INTEGRATION.md)
- [📁 📁 Archive de Documentation](archive/README.md)
- [📄 🎉 Migration Frame.io v4 - COMPLÈTE](archive/FRAMEIO_V4_MIGRATION_COMPLETE.md)
- [📄 PostFlow - Checklist Publication Repository](archive/PUBLICATION_CHECKLIST.md)
- [📄 Nettoyage du Repository PostFlow](archive/CLEAN_REPO.md)
- [📄 Frame.io API v4 - Corrections Appliquées](archive/FRAMEIO_V4_CORRECTIONS.md)
- [📄 🎉 MIGRATION FRAME.IO V4 - RAPPORT FINAL](archive/MIGRATION_FINAL_REPORT.md)
- [📄 Comment Tester l'Intégration Frame.io](archive/COMMENT_TESTER_FRAMEIO.md)
- [📄 Frame.io v4 – Intégration OAuth Web App (Authorization Code)](archive/README_FRAMEIO_OAUTH.md)
- [📄 ✅ OAUTH FRAME.IO - IMPLÉMENTATION TERMINÉE](archive/OAUTH_IMPLEMENTATION_COMPLETE.md)
- [📄 🧹 Nettoyage du Projet Frame.io - Rapport Final](archive/CLEAN_FRAMEIO_REPORT.md)

### 🛠️ Documentation Technique
- [📄 Integration LucidLink → Frame.io](FRAMEIO_LUCIDLINK_INTEGRATION.md)
- [🏗️ 🏗️ Architecture RL PostFlow](ARCHITECTURE.md)
- [📄 [ARCHIVÉ] Setup IMS Server-to-Server (obsolète)](ADOBE_IMS_SERVER_TO_SERVER_SETUP.md)
- [📄 Guide de Test de l'Intégration Frame.io](FRAMEIO_TESTING_GUIDE.md)
- [📄 Guide de Configuration Adobe Developer Console pour Frame.io OAuth](ADOBE_OAUTH_TROUBLESHOOTING.md)
- [📄 Système de Gestion d'Erreurs Renforcé - PostFlow](ERROR_HANDLING.md)
- [📄 📋 RAPPORT D'ORGANISATION - FRAME.IO INTEGRATION](FRAMEIO_ORGANIZATION_REPORT.md)
- [📄 Guide d'utilisation OAuth Frame.io - Saisie de codes améliorée](OAUTH_SAISIE_CODE_GUIDE.md)
- [📄 Configuration Frame.io - Guide Final](FRAMEIO_CONFIGURATION_COMPLETE.md)
- [📄 LucidLink Watcher - Résumé des améliorations](WATCHER_IMPROVEMENTS_SUMMARY.md)
- [📄 🚀 FRAME.IO - DÉMARRAGE RAPIDE](FRAMEIO_QUICKSTART.md)
- [📄 [ARCHIVÉ] Création d'intégration Server-to-Server (obsolète)](CREATE_ADOBE_SERVER_TO_SERVER.md)
- [📄 ARCHIVE : Documentation Server-to-Server (obsolète)](ARCHIVE_FRAMEIO_SERVER_TO_SERVER_DOCS.md)
- [📄 [ARCHIVÉ] Migration Frame.io v4 Server-to-Server (obsolète)](FRAMEIO_V4_MIGRATION.md)
- [📄 Configuration des Intégrations UNDLM PostFlow](INTEGRATIONS_SETUP.md)
- [📄 Guide d'utilisation du Watcher LucidLink](LUCIDLINK_WATCHER_GUIDE.md)
- [📄 🚀 Guide de Création d'Intégration Server-to-Server Adobe](ADOBE_SERVER_TO_SERVER_SETUP.md)
- [⚙️ Configuration PostFlow](CONFIGURATION.md)
- [📄 🎬 UNDLM PostFlow - Guide d'Utilisation du Workflow de Review](REVIEW_WORKFLOW_GUIDE.md)
- [📄 🎉 UNDLM PostFlow - Workflow de Review Intégré - RÉSUMÉ FINAL](WORKFLOW_SUMMARY.md)
- [📄 UNDLM PostFlow - Résumé de Configuration](SETUP_SUMMARY.md)
- [📄 Frame.io Integration - Architecture Propre](FRAMEIO_INTEGRATION.md)
- [📄 🎬 UNDLM PostFlow - Architecture du Pipeline](PIPELINE_ARCHITECTURE.md)

---

## 🎯 Navigation Rapide

### Pour les utilisateurs
- **Premier démarrage** → [Guide de démarrage](guides/QUICK_START.md)
- **Configuration** → [Configuration complète](guides/CONFIGURATION.md)
- **Problèmes** → [Dépannage](guides/TROUBLESHOOTING.md)

### Pour les développeurs
- **Architecture** → [Vue d'ensemble](ARCHITECTURE.md)
- **Développement** → [Setup développement](DEVELOPMENT.md)
- **API** → [Référence API](api/README.md)

### Pour les intégrations
- **Frame.io** → [Configuration OAuth](integrations/FRAMEIO_OAUTH.md)
- **LucidLink** → [Configuration LucidLink](integrations/LUCIDLINK_SETUP.md)
- **Discord** → [Notifications Discord](integrations/DISCORD_SETUP.md)

---

## 🚀 Démarrage Rapide

1. **Configuration initiale** : Voir [`CONFIGURATION.md`](core/CONFIGURATION.md)
2. **Mapping Google Sheets** : Voir [`GOOGLE_SHEETS_DYNAMIC_MAPPING.md`](integrations/GOOGLE_SHEETS_DYNAMIC_MAPPING.md)
3. **Guide utilisateur** : Voir [`POSTFLOW_USER_GUIDE.md`](user-guides/POSTFLOW_USER_GUIDE.md)

## 📊 État Actuel

✅ **Google Sheets** - Mapping dynamique opérationnel  
✅ **Vignettes automatiques** - Extraction et upload vers Google Drive  
✅ **Frame.io** - Intégration OAuth complète  
✅ **Discord** - Notifications automatiques  
✅ **Structure adaptive** - S'adapte à n'importe quelle organisation de colonnes  

## 🔄 Dernières Mises à Jour

- **2025-07-08** : Système de vignettes automatiques avec Google Drive
- **2025-07-08** : Mapping dynamique des colonnes Google Sheets
- **2025-07-08** : Réorganisation user-friendly des colonnes
- **2024-12-19** : Migration Frame.io OAuth complète

---

**PostFlow** - Automatisation intelligente pour la post-production vidéo
