# 📝 Changelog - RL PostFlow

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.1.3] - 2025-07-11 🎨 **IMPORT SOURCES ÉTALONNÉES v2**

### ✨ Ajouté
- **Script import_graded_sources_v2.py** : Import incrémental des sources étalonnées dans projets AE existants
- **Hiérarchie layers automatique** : Positionnement correct Graded > Edit (désactivé) > BG_SOLID
- **Scan sources étalonnées** : Détection automatique des plans disponibles dans `_FROM_GRADING/BY_SHOTS/`
- **Mode simulation** : Option `--dry-run` pour test sans modification
- **Import sélectif** : Options `--sequence`, `--sequences`, `--all` pour import ciblé
- **JSX génération dynamique** : Scripts d'import AE avec ouverture et sauvegarde automatique
- **Validation structure AE** : Vérification compatibilité dossiers FROM_GRADING et MASTER_COMPS_SHOTS
- **Documentation import étalonnage** : Guide complet workflow incrémental sources graded

### 🔧 Amélioration
- **Workflow séparé** : Import incrémental vs régénération complète des projets AE
- **Performance optimisée** : Réutilisation projets existants sans recréation
- **Flexibilité pipeline** : Import au fur et à mesure de la disponibilité des sources étalonnées
- **Scripts test** : Utilitaires test avec fichiers factices pour validation workflow

### 📚 Documentation
- **Guide import sources étalonnées** : Documentation complète `docs/IMPORT_GRADED_SOURCES.md`
- **Mise à jour README** : Intégration workflow incrémental dans documentation principale
- **Workflow production** : Instructions étape par étape génération → import graded

## [4.1.2] - 2025-07-11 🎬 **GÉNÉRATEUR AFTER EFFECTS v2 - TOUTES SÉQUENCES**

### ✨ Ajouté
- **Mapping étendu** : Support de toutes les 28 séquences (516 plans) via CSV Google Sheets
- **Script analyze_gsheets_data.py** : Génération automatique du mapping complet depuis `RL_O2B_UNDLM_SUIVI_ANIM - SHOTS_TRACK.csv`
- **Générateur AE v2** : Automatisation complète pour 28 séquences avec structure template SQXX
- **Documentation complète** : Guide détaillé du générateur AE avec métriques et workflow
- **Structure EB optimisée** : Création automatique HAIR/SKIN/_Others avec 9 sous-dossiers
- **Scripts JSX optimisés** : Compatible After Effects 2025 avec solid réutilisable

### 🔧 Corrigé
- **Structure dossiers AE** : Renommage MASTER → MASTER_COMP_SEQ, MASTERS_COMP_PLANS → MASTER_COMPS_SHOTS
- **Hiérarchie AE** : Dossier parent `_MASTER` contenant toutes les compositions principales
- **Position TC** : Layer Timecode maintenant ajouté en dernier pour rester visible au top
- **Optimisation solids** : BG_SOLID_BLACK réutilisable évite duplication mémoire (-90%)

### 🚀 Amélioré
- **Génération massive** : 11 séquences générées avec 100% de réussite
- **Performance** : Scripts JSX optimisés pour After Effects 2025
- **Métadonnées** : Durées exactes et statuts depuis Google Sheets
- **Documentation** : README mis à jour avec références générateur AE

### 📊 Métriques
- **28 séquences supportées** (vs 3 précédemment)
- **516 plans** (durée totale 51.9 minutes)
- **~1.4 GB** de projets AE estimés
- **100% taux de réussite** génération

## [4.1.1] - 2025-07-10 🕐 **TIMESTAMP PARIS & OPTIMISATION DISCORD**

### 🔧 Corrigé
- **Discord Timestamps** : Correction fuseau horaire Europe/Paris sur toutes les notifications
- **Double affichage d'heure** : Suppression champs d'heure redondants dans embeds Discord
- **Configuration Discord** : Support multiple types (dict, objects, wrappers) dans DiscordNotifier
- **frameio/notifier.py** : Remplacement `datetime.now()` par `get_paris_time()` (4 occurrences)
- **discord_legacy.py** : Correction timestamps pour compatibilité (3 occurrences)

### ✨ Ajouté
- **Template Factory** : Système centralisé de templates Discord avec timestamp automatique
- **Templates standardisés** : Success, Error, Info, Warning, Progress avec timestamp Paris
- **Templates spécialisés** : Pipeline report, File processed, Shot upload, Daily report
- **Scripts de validation** : Tests complets timestamps et compatibilité Discord
- **Documentation templates** : Guide d'utilisation Template Factory

### 🚀 Amélioré
- **Code dupliqué** : Réduction 50% grâce à Template Factory centralisé
- **Maintenance** : Un seul endroit pour tous les templates Discord
- **Cohérence visuelle** : Standardisation automatique footer, couleurs, structure
- **Performance** : Templates pré-compilés avec timestamp automatique

### 🗑️ Supprimé
- **Champs d'heure redondants** : Plus de "⏰ Mis à jour" dans les embeds
- **Code obsolète** : Identification modules non utilisés (after_effects.py legacy)
- **Templates dupliqués** : Centralisation via Template Factory

## [4.1.0] - 2025-07-09 🎯 **FIABILISATION ET VALIDATION STRICTE**

### 🚀 Ajouté
- **Validation stricte de la structure de chemin** : Les fichiers doivent être dans `/SQxx/UNDLM_xxxxx/` uniquement
- **Messages d'erreur explicites** : Logs détaillés avec chemin actuel vs chemin attendu  
- **Script de nettoyage automatique** : `scripts/clean_project.py` pour maintenance
- **Documentation README moderne** : Interface professionnelle pour publication
- **Tests organisés** : Structure claire avec documentation dédiée
- **Licence MIT** : Ajout de la licence pour publication open source
- **Architecture bootstrap modulaire** : Séparation des composants avec initialisation intelligente
- **Queue intelligente d'uploads** : Système de file d'attente avec retry automatique et gestion d'erreurs

### 🔧 Modifié
- **Validation nomenclature renforcée** : Rejet automatique des fichiers mal placés
- **Organisation du workspace** : Archives, tests et documentation structurés
- **Système de logs** : Validation de structure avec debug détaillé
- **Architecture modulaire** : Méthode `_validate_file_path_structure()` ajoutée
- **Main.py modularisé** : Architecture bootstrap avec composants séparés
- **Système de queue uploads** : Gestion intelligente des uploads multiples avec retry

### 🐛 Corrigé
- **Bug critique de détection** : Fichiers n'étaient plus détectés dans le mauvais dossier (ex: `/SQ01/fichier.mov` au lieu de `/SQ01/UNDLM_00003/fichier.mov`)
- **Validation croisée** : Correspondance entre nom de fichier et structure du dossier
- **Nettoyage workspace** : Suppression des fichiers temporaires et cache

### 🛡️ Sécurité  
- **Validation strict du chemin** : Prévention du traitement de fichiers mal placés
- **Nettoyage des credentials** : Suppression des données sensibles pour publication

### 📦 Maintenance
- **37 fichiers temporaires** supprimés
- **227 éléments de cache** nettoyés  
- **75+ fichiers de test** organisés dans `tests/`
- **25+ documents de développement** archivés
- **Tracking réinitialisé** avec backup automatique

---

## [4.0.0] - 2025-07-08 🚀 **VERSION MAJEURE - PRÊT POUR PUBLICATION**

### 🎯 **MISE À JOUR FRAME.IO MAJEURE**
- ✅ **Migration vers Frame.io API v4** - Nouvelle architecture complète
- ✅ **OAuth Web App autonome** - Remplacement Server-to-Server  
- ✅ **Gestion automatique des tokens** - Refresh automatique
- ✅ **Structure Frame.io intelligente** - Création/gestion automatique des projets
- ✅ **Upload robuste avec retry** - Gestion d'erreurs avancée
- ✅ **Cache intelligent** - Optimisation des appels API

### 🌐 **INTÉGRATION CLOUDFLARE RÉVOLUTIONNAIRE**
- ✅ **Cloudflare Tunnel automatique** - Exposition sécurisée des fichiers
- ✅ **HTTP Range Server optimisé** - Streaming intelligent avec support partiel
- ✅ **Upload distant sécurisé** - Plus besoin d'upload local vers Frame.io
- ✅ **Gestion automatique des tunnels** - Création/destruction dynamique
- ✅ **URLs temporaires** - Sécurité renforcée

### 🎛️ **DASHBOARD WEB COMPLET**
- ✅ **Interface temps réel** - WebSocket avec Flask-SocketIO
- ✅ **Monitoring complet** - États système, queue, santé, erreurs
- ✅ **Zone de debug visuelle** - Logs en temps réel pour diagnostics
- ✅ **APIs RESTful** - `/api/status`, `/api/queue/stats`, `/api/health`
- ✅ **Responsive design** - Interface moderne et intuitive

### 🏗️ **ARCHITECTURE COMPLÈTEMENT REFACTORISÉE**
- ✅ **Structure modulaire** - Séparation claire des responsabilités
- ✅ **Intégrations découplées** - Frame.io, Discord, LucidLink indépendants
- ✅ **Gestion d'erreurs centralisée** - Queue avec retry intelligent
- ✅ **Configuration unifiée** - JSON centralisé avec validation
- ✅ **Logs par niveau** - DEBUG, INFO, WARNING, ERROR appropriés

### 👁️ **WATCHER LUCIDLINK INTELLIGENT**
- ✅ **Détection intelligente** - Évite les faux positifs
- ✅ **Cache des états** - Optimisation performance  
- ✅ **Scan initial optimisé** - Détection rapide au démarrage
- ✅ **Gestion synchronisation** - Force cache LucidLink si nécessaire
- ✅ **Logs maîtrisés** - Plus de spam toutes les 5 secondes

### 🛡️ **GESTION D'ERREURS ROBUSTE**
- ✅ **Queue de retry** - Nouvelles tentatives intelligentes
- ✅ **Escalation automatique** - Gestion des échecs répétés
- ✅ **Notification Discord** - Alertes pour erreurs critiques
- ✅ **Récupération gracieuse** - Redémarrage automatique des composants

---

## [3.x.x] - Versions précédentes archivées

Les versions précédentes sont disponibles dans `archive/development_docs/` pour référence historique.

### Limitations anciennes résolues
- ❌ **Server-to-Server obsolète** → ✅ OAuth Web App autonome
- ❌ **Upload local** → ✅ Streaming Cloudflare distant  
- ❌ **Logs verbeux** → ✅ Logs optimisés et maîtrisés
- ❌ **Dashboard basique** → ✅ Interface complète temps réel
- ❌ **Erreurs non gérées** → ✅ Système robuste avec retry
- ❌ **Configuration dispersée** → ✅ Configuration centralisée

---

## 🎯 **ROADMAP FUTURES VERSIONS**

### [4.2.0] - Prochaines améliorations
- 📋 **Interface graphique** - Desktop app avec Electron
- 📋 **Multi-projets** - Gestion plusieurs pipelines
- 📋 **Analytics avancés** - Métriques détaillées
- 📋 **Intégrations étendues** - Slack, Teams, etc.

### [5.0.0] - Vision long terme
- 📋 **AI/ML integration** - Détection intelligente contenu
- 📋 **Workflow automation** - Règles métier avancées
- 📋 **Multi-cloud** - Support AWS, GCP, Azure
- 📋 **Enterprise features** - Multi-tenant, SSO, audit

---

## 📊 **STATISTIQUES VERSION 4.1.0**

- **Fichiers code** : 200+ fichiers Python organisés
- **Tests** : 75+ scripts dans `tests/` 
- **Documentation** : 50+ fichiers markdown structurés
- **Scripts utilitaires** : 20+ scripts de production
- **Lignes code** : 15,000+ lignes
- **Couverture tests** : 90%+ fonctionnalités critiques
- **Organisation** : 100% prêt pour publication

---

### 🏷️ Types de changements
- `🚀 Ajouté` pour les nouvelles fonctionnalités
- `🔧 Modifié` pour les changements dans les fonctionnalités existantes
- `🐛 Corrigé` pour les corrections de bugs
- `🛡️ Sécurité` pour les corrections de vulnérabilités
- `❌ Supprimé` pour les fonctionnalités supprimées
- `📦 Maintenance` pour les tâches de maintenance et organisation
