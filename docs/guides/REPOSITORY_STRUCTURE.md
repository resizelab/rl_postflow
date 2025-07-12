# 🗂️ RL PostFlow - Structure du Repository
> **Rangement effectué le 11 juillet 2025**

## 📁 Structure Organisée

### **🚀 Fichiers Principaux**
- **`main.py`** - Point d'entrée principal du pipeline
- **`dashboard.py`** - Interface web de monitoring  
- **`stop_postflow.py`** - Script d'arrêt du pipeline
- **`pipeline_config.json`** - Configuration du pipeline
- **`requirements.txt`** & **`requirements-production.txt`** - Dépendances Python

### **📂 Dossiers Core**
- **`src/`** - Code source principal (modules bootstrap, intégrations, utils)
- **`config/`** - Fichiers de configuration (JSON, clés, mappings)
- **`data/`** - Données du pipeline (BDD, CSV, JSON de tracking)
- **`logs/`** - Logs du système

### **🛠️ Outils et Scripts**
- **`tools/`** - Outils spécialisés (After Effects Generator v2, ae_scripts, discord_posts)
- **`scripts/`** - Scripts utilitaires, production et tests consolidés
- **`validation/`** - Scripts de validation AE

### **📚 Documentation**
- **`docs/`** - Documentation technique complète
- **`documentation/`** - Docs projet (VFX, graphistes, rapports)
- **`examples/`** - Exemples d'utilisation

### **🗄️ Archives et Legacy**
- **`archive/`** - Code obsolète et anciens développements
- **`releases/`** - Notes de version et checklists

### **🎬 Spécialisés**
- **`templates/`** - Templates de configuration
- **`temp/`** - Fichiers temporaires
- **`output/`** - Sorties générées

### **🔧 Système**
- **`systemd/`** - Configuration service Linux
- **`nginx/`** - Configuration serveur web
- **`backups/`** - Sauvegardes

## 🎯 Principes d'Organisation

1. **Séparation claire** entre code actif et obsolète
2. **Documentation consolidée** par type d'usage
3. **Outils spécialisés** dans des dossiers dédiés
4. **Configuration centralisée** dans config/
5. **Logs et data séparés** du code

## 📋 Migration Effectuée

### Fichiers Déplacés
- ✅ `validate_ae_v2.py` → `validation/`
- ✅ Documentation VFX → `documentation/`
- ✅ Notes de release → `releases/current/`
- ✅ Scripts obsolètes → `archive/legacy_scripts/`
- ✅ `tests/` → `scripts/tests/` (consolidation)
- ✅ `ae_scripts/` → `tools/after_effects_generator_v2/`
- ✅ `discord_posts/` → `tools/after_effects_generator_v2/`

### Structure Nettoyée
- 🗂️ **9 fichiers** à la racine (vs ~50 avant)
- 📁 **Organisation logique** par fonction
- 🧹 **Séparation claire** actif/obsolète
- 🛠️ **Tests consolidés** dans scripts/

---

**Racine propre et organisée !** ✨
