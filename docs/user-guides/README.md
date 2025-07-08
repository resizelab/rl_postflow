# 👤 Guide Utilisateur PostFlow

## 🎯 Qu'est-ce que PostFlow ?

PostFlow automatise votre workflow de post-production en s'adaptant automatiquement à votre Google Sheet existant. Plus besoin de changer vos habitudes !

## 🚀 Démarrage rapide (5 minutes)

### 1. **Votre Google Sheet reste intact**
- ✅ Gardez votre organisation de colonnes
- ✅ Gardez vos noms de colonnes (PLAN, STATUS, etc.)
- ✅ PostFlow s'adapte automatiquement

### 2. **Lancement de l'analyse**
```bash
python scripts/analyze_spreadsheet_structure.py
```
👉 **Résultat :** PostFlow comprend votre structure et génère le mapping

### 3. **Génération des vignettes**
```bash
python scripts/generate_drive_thumbnails.py 10
```
👉 **Résultat :** Les 10 premières vignettes apparaissent dans votre Google Sheet

## 📋 Fonctionnalités principales

### 🖼️ **Vignettes automatiques**
- **Ce que vous faites :** Rien !
- **Ce que PostFlow fait :** Extrait la première frame de chaque rush et l'insère dans votre Google Sheet
- **Résultat :** Images automatiquement visibles dans la colonne VIGNETTE

### 🔄 **Adaptation automatique**
- **Ce que vous faites :** Organisez vos colonnes comme vous voulez
- **Ce que PostFlow fait :** Détecte automatiquement PLAN, STATUS, ATTRIBUTION, etc.
- **Résultat :** Fonctionne avec votre structure existante

### 📊 **Suivi intelligent**
- **Ce que vous faites :** Modifiez le STATUS, l'ATTRIBUTION dans votre Google Sheet
- **Ce que PostFlow fait :** Suit automatiquement les changements
- **Résultat :** Notifications Discord, sync Frame.io, etc.

## 🎬 Workflow quotidien

### **Matin - Vérification des plans**
1. Ouvrez votre Google Sheet habituel
2. Les vignettes sont automatiquement visibles
3. Vérifiez les STATUS et ATTRIBUTION

### **En cours de journée - Mise à jour**
1. Modifiez directement dans Google Sheets :
   - STATUS : "En cours" → "Terminé"
   - ATTRIBUTION : "David" → "Eva"
   - PRIORITY : "Moyenne" → "Haute"
2. PostFlow détecte automatiquement les changements

### **Génération de nouvelles vignettes**
```bash
# Nouveaux plans ajoutés ? Générez leurs vignettes
python scripts/generate_drive_thumbnails.py new
```

## 📊 Organisation recommandée

### **Colonnes essentielles** (positions 1-6)
Les plus importantes apparaissent en premier :

| Position | Colonne | Utilité |
|----------|---------|---------|
| 1 | **PLAN** | Identifiant du plan |
| 2 | **STATUS** | Suivi de l'avancement |
| 3 | **VIGNETTE** | Image du plan |
| 4 | **ATTRIBUTION** | Qui travaille dessus |
| 5 | **PRIORITY** | Urgence du plan |
| 6 | **NAME_SEQ** | Nom de la séquence |

### **Optimisation user-friendly**
PostFlow peut réorganiser automatiquement vos colonnes pour un workflow optimal.

## 🔧 Commandes utiles

### **Analyser votre structure**
```bash
python scripts/analyze_spreadsheet_structure.py
```
👉 Comprend votre Google Sheet et génère le mapping

### **Générer des vignettes**
```bash
# Tester sur 5 plans
python scripts/generate_drive_thumbnails.py 5

# Générer toutes les vignettes
python scripts/generate_drive_thumbnails.py all

# Forcer la régénération
python scripts/generate_drive_thumbnails.py 10 force
```

### **Tester l'intégration**
```bash
python scripts/test_google_sheets_real.py
```
👉 Vérifie que tout fonctionne correctement

## 📱 Utilisation avancée

### **Filtrage par département**
Si vous avez une colonne `DEPT` :
- **PostProd** → Notifications pour l'équipe post-production
- **Animation** → Notifications pour l'équipe animation
- **Supervision** → Notifications pour les superviseurs

### **Gestion des priorités**
Utilisez la colonne `PRIORITY` :
- **Haute** → Plans urgents (notifications immédiates)
- **Moyenne** → Plans standard
- **Basse** → Plans moins prioritaires

### **Suivi des statuts**
Colonne `STATUS` reconnue automatiquement :
- **En cours** → Plan en production
- **Terminé** → Plan finalisé
- **En attente** → Plan en pause
- **Review** → Plan en validation

## 🎯 Avantages pour vous

### **Simplicité**
- ✅ Gardez vos habitudes
- ✅ Votre Google Sheet reste identique
- ✅ Pas de formation nécessaire

### **Automatisation**
- ✅ Vignettes générées automatiquement
- ✅ Notifications Discord ciblées
- ✅ Sync Frame.io transparent

### **Flexibilité**
- ✅ Ajoutez/supprimez des colonnes librement
- ✅ Réorganisez comme vous voulez
- ✅ PostFlow s'adapte automatiquement

## 🆘 Support rapide

### **Problème avec les vignettes ?**
```bash
python scripts/generate_drive_thumbnails.py 1
```
👉 Teste sur 1 plan pour diagnostiquer

### **Google Sheet non reconnu ?**
```bash
python scripts/analyze_spreadsheet_structure.py --force
```
👉 Force la regénération du mapping

### **Besoin d'aide ?**
1. Consultez les [logs](../logs/) pour les erreurs
2. Testez avec un petit nombre de plans d'abord
3. Vérifiez que le volume Lucid Link est bien monté

## 🎉 Exemple concret

**Avant PostFlow :**
- Google Sheet avec vos colonnes habituelles
- Pas de vignettes
- Gestion manuelle

**Après PostFlow :**
- Google Sheet identique + vignettes automatiques
- Notifications Discord intelligent
- Sync Frame.io transparent
- Workflow optimisé

---

**C'est tout !** PostFlow travaille en arrière-plan pendant que vous continuez à utiliser votre Google Sheet comme d'habitude. 🚀
