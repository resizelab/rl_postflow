# 👤 Guide Utilisateur PostFlow

## 🎯 BIENVENUE

PostFlow est votre assistant intelligent pour la gestion de post-production. Il s'adapte automatiquement à votre Google Spreadsheet existant et automatise les tâches répétitives.

## 🚀 DÉMARRAGE RAPIDE

### 📊 **Votre Google Sheet**

PostFlow fonctionne avec **votre structure existante**. Pas besoin de tout réorganiser !

#### Colonnes Recommandées (SHOTS_TRACK)
- **PLAN** - Numéro du plan (obligatoire)
- **STATUS** - Statut du plan (TODO, EN_COURS, TERMINÉ)
- **VIGNETTE** - Image automatique du plan
- **ATTRIBUTION** - Qui travaille sur le plan
- **PRIORITY** - Priorité (HIGH, MEDIUM, LOW)

#### Colonnes Utilisateurs (USERS_INFOS)
- **PRENOM** - Prénom (obligatoire)
- **NOMS** - Nom de famille (obligatoire)
- **MAIL** - Email (obligatoire)
- **DEPT** - Département (PostProd, Animation, etc.)
- **ACTIF** - OUI/NON si la personne est active

## ✨ FONCTIONNALITÉS

### 🖼️ **Vignettes Automatiques**
- **Génération** automatique depuis vos rushs
- **Affichage** direct dans Google Sheets
- **Mise à jour** en temps réel

### 📊 **Suivi Intelligent**
- **Statuts** colorés et automatiques
- **Notifications** Discord ciblées
- **Rapports** de progression

### 🔄 **Synchronisation**
- **Frame.io** - Upload et review automatiques
- **Discord** - Notifications d'équipe
- **Google Sheets** - Source de vérité centralisée

## 🎬 WORKFLOW QUOTIDIEN

### 1. **Mise à Jour du Statut**
```
Dans Google Sheets, changez le STATUS :
TODO → EN_COURS → TERMINÉ
```

### 2. **Assignation des Tâches**
```
Colonne ATTRIBUTION :
Xavier, David, Eva, etc.
```

### 3. **Priorisation**
```
Colonne PRIORITY :
HIGH, MEDIUM, LOW
```

### 4. **Commentaires**
```
Colonne COMMENTAIRE :
Notes sur le plan, problèmes, etc.
```

## 🖼️ VIGNETTES

### 📸 **Comment ça marche**
1. PostFlow lit votre liste de plans
2. Trouve automatiquement le rush correspondant
3. Extrait la première image
4. L'affiche dans votre Google Sheet

### 🔄 **Mise à Jour**
Les vignettes sont générées automatiquement. Si vous ajoutez de nouveaux plans, relancez la génération :

```bash
# Depuis le terminal (pour les admins)
python scripts/generate_drive_thumbnails.py all
```

## 📱 NOTIFICATIONS DISCORD

### 🔔 **Types de Notifications**
- **Nouveau plan** assigné
- **Changement de statut**
- **Plan terminé**
- **Problème détecté**

### ⚙️ **Configuration**
Ajoutez votre ID Discord dans la colonne **ID DISCORD** de USERS_INFOS pour recevoir les notifications personnalisées.

## 🎯 STATUTS

### 📊 **Statuts Disponibles**
| Statut | Signification | Couleur |
|--------|---------------|---------|
| `TODO` | À faire | 🔴 Rouge |
| `EN_COURS` | En cours | 🟡 Jaune |
| `REVIEW` | En review | 🔵 Bleu |
| `TERMINÉ` | Terminé | 🟢 Vert |
| `BLOQUÉ` | Problème | 🟠 Orange |

### 🔄 **Changement de Statut**
Modifiez simplement la cellule STATUS dans Google Sheets. PostFlow détecte automatiquement les changements.

## 🎨 PRIORITÉS

### ⚡ **Niveaux de Priorité**
- **HIGH** - Urgent, à traiter en premier
- **MEDIUM** - Priorité normale
- **LOW** - Peut attendre

### 📈 **Impact**
- Les plans HIGH remontent automatiquement
- Notifications prioritaires pour l'équipe
- Rapports de suivi adaptés

## 🔍 RECHERCHE & FILTRES

### 🔎 **Dans Google Sheets**
Utilisez les filtres natifs de Google Sheets :
- Filtrer par **STATUS** (afficher seulement TODO)
- Filtrer par **ATTRIBUTION** (vos plans)
- Filtrer par **PRIORITY** (urgences)

## 📊 RAPPORTS

### 📈 **Progression Automatique**
PostFlow génère automatiquement :
- **Pourcentage** de completion
- **Plans par statut**
- **Répartition par personne**
- **Tendances** temporelles

## 🚨 PROBLÈMES COURANTS

### ❌ **Vignette non affichée**
- Vérifiez que le fichier rush existe
- Le nom du plan correspond-il au fichier ?

### 📧 **Pas de notifications Discord**
- ID Discord renseigné dans USERS_INFOS ?
- Statut ACTIF = OUI ?

### 🔄 **Changements non détectés**
- PostFlow vérifie toutes les 5 minutes
- Patientez ou relancez le service

## 💡 ASTUCES

### ⚡ **Raccourcis**
- **Ctrl+Z** pour annuler dans Google Sheets
- **Filtres rapides** avec les boutons de colonnes
- **Commentaires** avec clic droit → "Insérer un commentaire"

### 🎯 **Optimisation**
- Gardez les noms de plans **cohérents**
- Utilisez des **statuts standards**
- **Assignez** clairement les responsabilités

### 📱 **Mobile**
- Google Sheets fonctionne sur mobile
- Notifications Discord disponibles partout
- Modifications synchronisées instantanément

## 🆘 AIDE

### 📞 **Contact**
- **Admin système** : Voir la doc admin
- **Discord** : Canal #postflow-support
- **Google Sheet** : Commentaires directs

### 📚 **Documentation**
- [`INDEX.md`](../INDEX.md) - Index complet
- [`ARCHITECTURE.md`](../ARCHITECTURE.md) - Architecture technique
- [`ERROR_HANDLING.md`](../ERROR_HANDLING.md) - Dépannage

---

## 🎉 ENJOY !

PostFlow est conçu pour vous simplifier la vie. Plus de mise à jour manuelle, plus de notifications oubliées, plus de recherche de fichiers !

*Votre équipe post-production sera plus efficace et mieux coordonnée.* ✨

---

*Guide utilisateur - Version 2.0 - 8 juillet 2025*
