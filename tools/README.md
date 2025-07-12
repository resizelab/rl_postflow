# 🛠️ RL PostFlow Tools

> **Outils spécialisés pour le pipeline de production RL PostFlow v4.1.2**

## 📁 **Contenu du Dossier**

### **🎬 After Effects Generator v2**
- **Dossier** : [`after_effects_generator_v2/`](after_effects_generator_v2/)
- **Script Principal** : [`after_effects_generator_v2/generate_ae_projects_v2.py`](after_effects_generator_v2/generate_ae_projects_v2.py)
- **Documentation** : [`after_effects_generator_v2/AFTER_EFFECTS_GENERATOR.md`](after_effects_generator_v2/AFTER_EFFECTS_GENERATOR.md)
- **Référence** : [`after_effects_generator_v2/SCRIPTS_REFERENCE.md`](after_effects_generator_v2/SCRIPTS_REFERENCE.md)

**Générateur automatique de projets After Effects** compatible avec le template SQXX et toutes les 28 séquences du projet.

#### **Usage Rapide :**
```bash
# Générer une séquence spécifique
python tools/after_effects_generator_v2/generate_ae_projects_v2.py --sequence SQ02

# Générer les 3 premières pour validation
python tools/after_effects_generator_v2/generate_ae_projects_v2.py --validation

# Générer toutes les séquences
python tools/after_effects_generator_v2/generate_ae_projects_v2.py --all
│   └── README.md                   # Documentation complète
└── README.md                       # Ce fichier
```

## 🎬 After Effects Generator v2

**Générateur automatique de projets After Effects v2** - Version production-ready

### **Fonctionnalités :**
- ✅ **28 séquences** (SQ01-SQ28) avec **516 plans** total
- ✅ **Structure EB complète** avec nouvelle hiérarchie KEY/OUT
- ✅ **Projets AE** avec compositions master et plans individuels
- ✅ **Import intelligent** sources Edit + Graded (selon disponibilité)
- ✅ **Scaling automatique** UHD (3840x2160) → 1440p (2560x1440)
- ✅ **Compatible template** SQXX_01.aep

#### **Dernière utilisation :**
- **SQ02 "BUS - FIN DE JOURNEE"** créé avec succès ✅
- **39 plans** (UNDLM_00035 → UNDLM_00073) ✅
- **Structure complète** _AE, _EB, _PS ✅

### **Usage Rapide :**
```bash
cd tools/after_effects_generator_v2

# Générer une séquence
python generate_ae_projects_v2.py --sequence SQ02

# Test validation (SQ01, SQ02, SQ03)
python generate_ae_projects_v2.py --validation --dry-run

# Production complète (28 séquences)
python generate_ae_projects_v2.py --all
```

### **Résultats :**
- **Structure EB** : 39 dossiers plans pour SQ02 avec arborescence complète
- **Projet AE** : `SQ02_01.aep` avec compositions et timeline assemblée
- **Prêt production** : Compatible workflow animation 2024

**[📚 Documentation complète →](after_effects_generator_v2/README.md)**

---

## 🚀 Ajout de Nouveaux Outils

### **Structure Recommandée :**
```
tools/
└── nouveau_tool/
    ├── script_principal.py
    ├── README.md           # Documentation complète
    ├── config/             # Configuration (optionnel)
    └── examples/           # Exemples (optionnel)
```

### **Standards Documentation :**
- **README.md** : Vue d'ensemble, usage, exemples
- **Fonctionnalités** : Liste des capacités principales
- **Installation** : Dépendances et setup
- **Configuration** : Chemins et paramètres
- **Dépannage** : Erreurs communes et solutions
- **Tests** : Validation et métriques

### **Intégration Pipeline :**
- **Compatibilité** : Scripts existants et structure projet
- **Chemins relatifs** : Utiliser la racine rl_postflow comme référence
- **Configuration** : Centraliser dans `config/` si partagée
- **Logs** : Utiliser format cohérent avec autres outils

---

## 🗂️ **Organisation du Repository**

### **Structure Actuelle :**
```
rl_postflow/
├── tools/                                    # Outils spécialisés ✅
│   └── after_effects_generator_v2/          # Générateur AE v2
│       ├── generate_ae_projects_v2.py       # Script principal
│       ├── AFTER_EFFECTS_GENERATOR.md       # Documentation complète
│       ├── SCRIPTS_REFERENCE.md             # Référence commandes
│       └── README.md                        # Guide outil
├── scripts/                                 # Scripts de production
├── docs/                                   # Documentation générale
├── src/                                    # Code source principal
└── config/                                 # Configurations
```

## 📊 **Statistiques Production**

### **After Effects Generator v2 :**
- **Séquences supportées** : 28/28 ✅
- **Plans total** : 516 ✅
- **Durée totale** : 51.9 minutes ✅
- **Structure EB** : Complète avec nouvelle hiérarchie ✅
- **Templates AE** : Conformes SQXX_01.aep ✅

### **Projets Créés Récemment :**
- **SQ02** : 39 plans, structure complète ✅
- **Validation** : Prêt pour déploiement production ✅

## 🚀 **Évolution des Tools**

### **v4.1.2 (Juillet 2025) :**
- ✅ **After Effects Generator v2** organisé et documenté
- ✅ **Structure tools/** avec sous-dossiers spécialisés
- ✅ **Documentation consolidée** par outil
- ✅ **Tests SQ02** validés en production

### **Prochaines Étapes :**
1. **Migration complète** des outils vers `tools/`
2. **Scripts de déploiement** automatisés
3. **Tests d'intégration** complets
4. **Nouveaux outils** selon besoins production

## 📚 **Documentation Détaillée**

- **[After Effects Generator v2](after_effects_generator_v2/AFTER_EFFECTS_GENERATOR.md)** - Guide complet du générateur
- **[Scripts Reference](after_effects_generator_v2/SCRIPTS_REFERENCE.md)** - Référence des commandes

## 🏷️ **Version**

**RL PostFlow v4.1.2** - Juillet 2025  
*Pipeline VFX + Animation + Discord Documentation + Tools Organization*
