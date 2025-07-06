# 🎬 UNDLM PostFlow - Architecture du Pipeline

## 📊 Vue d'ensemble du Pipeline Actuel

Le pipeline PostFlow fonctionne actuellement comme suit :

```
[CSV Data] → [Parsing] → [Analysis] → [Export] → [Frame.io] → [Discord Notifications]
    ↓            ↓          ↓           ↓          ↓               ↓
[shots.csv] → [Python] → [Stats] → [JSON/CSV] → [Upload] → [Notifications]
```

## 🔄 Flux de Données Actuel

### 1. **Initialisation** (main.py ligne 21-60)
```python
# Ordre d'initialisation :
1. Discord Notifier (config/integrations.json)
2. Frame.io Client (config/frameio_config.json)
3. Notification Discord : "Pipeline Started"
```

### 2. **Parsing CSV** (main.py ligne 78-104)
```python
# Traitement des données :
1. parse_shots_csv(csv_file) → PostProductionData
2. Analyse des shots, scènes, fichiers sources
3. Notification Discord : "CSV Parsing Completed"
```

### 3. **Analyse et Validation** (main.py ligne 105-160)
```python
# Analyses effectuées :
1. Statistiques globales (shots, scènes, fichiers)
2. Détection des doublons
3. Analyse de la nomenclature
4. Détection des gaps (plans manquants)
```

### 4. **Export** (main.py ligne 161-178)
```python
# Formats exportés :
1. JSON détaillé (shots individuels)
2. CSV plat (pour Google Sheets)
3. JSON par scène
4. Notification Discord : "Export Completed"
```

### 5. **Intégration Frame.io** (main.py ligne 179-208)
```python
# Actions Frame.io :
1. Vérification de la connexion
2. Liste des projets disponibles
3. Upload optionnel des fichiers exportés
4. [PAS DE NOTIFICATION DISCORD ACTUELLEMENT]
```

### 6. **Finalisation** (main.py ligne 225-245)
```python
# Notifications finales :
1. Notification Discord : "Pipeline Completed"
2. Résumé des statistiques
3. Gestion des erreurs avec notifications Discord
```

## 🔗 Modules d'Intégration

### **Discord** (`src/integrations/discord.py`)
- **Statut** : ✅ **Intégré et fonctionnel**
- **Utilisation actuelle** : 
  - Notifications de début/fin de pipeline
  - Rapports d'export
  - Notifications d'erreurs
- **Webhook configuré** : ✅ Vrai webhook Discord

### **Frame.io** (`src/integrations/frameio.py`)
- **Statut** : ✅ **Intégré mais notifications limitées**
- **Utilisation actuelle** :
  - Vérification de connexion
  - Liste des projets
  - Upload de fichiers
- **Notifications Discord** : ❌ **MANQUANTES**

### **LucidLink** (`src/integrations/lucidlink.py`)
- **Statut** : ❌ **PAS INTÉGRÉ dans main.py**
- **Fonctionnalités disponibles** :
  - Vérification des fichiers sources
  - Gestion des chemins AE
  - Statistiques de projets
- **Notifications Discord** : ❌ **MANQUANTES**

## 🚨 Points d'Amélioration Identifiés

### **1. LucidLink non intégré dans le pipeline principal**
```python
# MANQUANT dans main.py :
from src.integrations.lucidlink import LucidLinkIntegration

# Devrait être initialisé après Discord et Frame.io
lucidlink_client = LucidLinkIntegration(config)
```

### **2. Notifications Discord manquantes pour les cas d'usage clés**
```python
# MANQUANT : Notifications pour Frame.io
- Nouveaux commentaires sur les plans
- Plans approuvés/rejetés
- Liens de review créés

# MANQUANT : Notifications pour LucidLink
- Fichiers sources disponibles
- Plans prêts pour review
- Changements de statut des fichiers
```

### **3. Pas de surveillance en temps réel**
```python
# MANQUANT : Watcher pour détecter
- Nouveaux fichiers LucidLink
- Nouveaux commentaires Frame.io
- Changements de statut des plans
```

## 🎯 Cas d'Usage Discord Optimaux

### **1. Notifications Frame.io → Discord**
```python
# Quand déclencher :
- Nouveau commentaire sur un plan
- Plan approuvé/rejeté
- Nouveau plan uploadé
- Lien de review créé

# Format notification :
"🎬 **Nouveau commentaire** sur UNDLM_00123
👤 **Réviseur** : John Doe
💬 **Message** : Le plan nécessite une correction couleur
🔗 **Lien** : [Voir sur Frame.io]"
```

### **2. Notifications LucidLink → Discord**
```python
# Quand déclencher :
- Nouveau fichier source disponible
- Plan rendu et prêt pour review
- Fichier AE mis à jour

# Format notification :
"📁 **Nouveau fichier** prêt pour review
🎯 **Plan** : UNDLM_00123 - SCENE_NAUFRAGE
📂 **Chemin** : /4_OUT/2_FROM_VFX/BY_SHOT/UNDLM_00123/
🔗 **LucidLink** : [Ouvrir le dossier]"
```

### **3. Notifications de Pipeline → Discord**
```python
# Quand déclencher :
- Erreur de traitement
- Pipeline terminé avec succès
- Statistiques quotidiennes

# Format notification :
"📊 **Rapport quotidien UNDLM**
✅ **Plans terminés** : 45/516
⏳ **En attente review** : 12
🚨 **Erreurs** : 2
📈 **Progression** : 87%"
```

## 🔧 Workflow Optimal Proposé

```
1. [LucidLink] → Nouveau fichier détecté → [Discord] "Fichier prêt"
2. [Pipeline] → Traitement du fichier → [Frame.io] Upload
3. [Frame.io] → Upload terminé → [Discord] "Plan uploadé, lien review"
4. [Frame.io] → Nouveau commentaire → [Discord] "Commentaire reçu"
5. [Frame.io] → Plan approuvé → [Discord] "Plan approuvé"
6. [Pipeline] → Erreur → [Discord] "Erreur détectée"
```

## 🎯 Actions Recommandées

### **Priorité 1 : Intégrer LucidLink dans main.py**
- Ajouter l'initialisation LucidLink
- Vérifier les fichiers sources pour chaque shot
- Notifier Discord des fichiers disponibles

### **Priorité 2 : Créer le module Frame.io + Discord**
- Détecter les nouveaux commentaires
- Créer des liens de review automatiques
- Notifier Discord des changements de statut

### **Priorité 3 : Créer un watcher temps réel**
- Surveiller les dossiers LucidLink
- Surveiller les changements Frame.io
- Notifications Discord en temps réel

Ce pipeline permettrait une notification proactive des équipes dès qu'un plan est disponible pour review ou qu'un commentaire nécessite une action.
