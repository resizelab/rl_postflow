# 🎨 RL PostFlow - Guide Graphiste
## Générateur After Effects Automatisé - "Une Nuit dans la Manche"

> **Pipeline de post-production automatisé pour le documentaire animé O2B UNDLM**  
> 28 séquences • 516 plans • 51.9 minutes • Animation mixte vidéo/aquarelle • 100% automatisé

---

## 🎯 **Pour les Graphistes : Ce que ça fait**

✅ **Génère automatiquement** vos projets After Effects  
✅ **Structure parfaite** selon le template SQXX et workflow animation  
✅ **Toutes les compositions** créées et paramétrées (2560×1440p, 25fps)  
✅ **Sources vidéo importées** et positionnées correctement  
✅ **Scaling automatique** UHD → 1440p  
✅ **Assembly temporel** des séquences  
✅ **Structure EB complète** prête pour animation Photoshop + EBSYNTH  

**➡️ Vous récupérez des projets AE prêts pour le workflow animation mixte !**

---

## 🎬 **Technique Animation - Rappel Workflow**

### **🖌️ Style Artistique**
- **Technique mixte** : Vidéo + Animation aquarelle 2D
- **Rendu artisanal** avec vibration pinceau maîtrisée
- **Rotoscopie** : Tous les visages repeints, reste en vidéo selon besoin
- **Format final** : 2560×1440p • 25fps
- **Animation base** : 12fps (peut varier selon scènes)

### **⚙️ Workflow Technique**
```
1. 🎬 VIDÉO SOURCE (AE)
   Export PNG sequence → EB/UNDLM_XXXXX/1_VIDEO/
   
2. 🎨 ANIMATION (Photoshop)
   Import depuis 1_VIDEO/ → Animation dans 2_KEY/
   Structure : HAIR/, SKIN/, _Others/ (9 catégories)
   Brush UNDM_Brush uniquement → Éléments par dossiers
   
3. 🤖 TRACK INTELLIGENT (EBSYNTH)
   Key frames depuis 2_KEY/ → Track auto → Sortie 3_OUT/
   
4. 🎭 ASSEMBLAGE (After Effects)
   Import PSD depuis 2_KEY/ ou 3_OUT/ → Colorisation → Mix média final
```

---

## 📁 **Structure Générée dans After Effects**

### **Organisation Globale du Projet**
```
SQ01_01.aep (Compatible workflow animation O2B)
├── 📂 FROM_EDIT/                    # Sources Edit (montage vidéo)
│   ├── 🎬 UNDLM_00001.mov          # Vidéo source pour rotoscopie
│   ├── 🎬 UNDLM_00002.mov
│   └── 🎬 ...
├── 📂 FROM_GRADING/                 # Sources Étalonnées (si disponibles)
│   ├── 🎬 UNDLM_00001.mov
│   ├── 🎬 UNDLM_00002.mov
│   └── 🎬 ...
├── 📂 EB/                           # VOTRE ZONE DE TRAVAIL ANIMATION
│   ├── 📂 UNDLM_00001/             # Structure par plan
│   │   ├── 📂 HAIR/                 # Cheveux (barbe incluse)
│   │   │   ├── 📂 BACK/             # Cheveux arrière
│   │   │   ├── 📂 FRONT/            # Cheveux avant  
│   │   │   └── 📂 SIDES/            # Cheveux côtés
│   │   ├── 📂 SKIN/                 # Peau et visages
│   │   │   ├── 📂 BASE/             # Peau de base
│   │   │   ├── 📂 DETAILS/          # Détails peau
│   │   │   └── 📂 HIGHLIGHTS/       # Éclats/lumières peau
│   │   └── 📂 _Others/              # Autres éléments
│   │       ├── 📂 ACCESSORIES/      # Accessoires
│   │       ├── 📂 CLOTHING/         # Vêtements/gilets
│   │       └── 📂 PROPS/            # Props/objets
│   └── 📂 UNDLM_00002/...          # Structure identique par plan
├── 📂 _MASTER/                      # Compositions principales
│   ├── 🎞️ SQ01_MASTER_COMP_SEQ      # Séquence complète assemblée
│   └── 📂 MASTER_COMPS_SHOTS/       # Plans individuels
│       ├── 🎞️ SQ01_UNDLM_00001_v001 # Compo plan prête animation
│       ├── 🎞️ SQ01_UNDLM_00002_v001
│       └── 🎞️ ...
├── 📂 PRECOMPS/                     # Pré-compositions de travail
└── 📂 PHOTOSHOP_SOURCES/            # Import PSD animations (à créer)
```

### **📋 Structure EB Réelle Générée** (pour chaque plan)
```
📂 EB/UNDLM_00001/ (Structure automatique générée)
├── 📂 1_VIDEO/            # Vidéo référence (PNG sequence)
├── 📂 2_KEY/              # VOTRE ZONE DE TRAVAIL ANIMATION
│   ├── 📂 HAIR/           # Cheveux et barbe
│   ├── 📂 SKIN/           # Peau et visages
│   └── 📂 _Others/        # Autres éléments
│       ├── 📂 Cloth_1/    # Vêtements principaux
│       ├── 📂 Cloth_2/    # Vêtements secondaires
│       ├── 📂 Decor_1/    # Décor principal
│       ├── 📂 Decor_2/    # Décor secondaire
│       ├── 📂 LifeJacket/ # Gilets de sauvetage
│       ├── 📂 Lips/       # Lèvres
│       ├── 📂 Pupil/      # Pupilles/yeux
│       ├── 📂 Shadow/     # Ombres
│       └── 📂 Silhouettes/ # Silhouettes
└── 📂 3_OUT/              # Sortie EBSYNTH (structure identique à 2_KEY)
    ├── 📂 HAIR/
    ├── 📂 SKIN/
    └── 📂 _Others/ (9 sous-dossiers identiques)
```

---

## 🎬 **Hiérarchie des Compositions**

### **Composition Plan Individuel** `SQ01_UNDLM_00001_v001`
```
🎞️ SQ01_UNDLM_00001_v001 (2560×1440p • 25fps)
├── 🟩 UNDLM_00001_graded     [SOURCE ÉTALONNÉE] (si disponible)
├── 🟨 UNDLM_00001_edit       [SOURCE VIDÉO] (base rotoscopie)
├── 🎨 [VOS ANIMATIONS PSD]   [À IMPORTER] (calques séparés)
└── 🟦 BG_SOLID              [FOND COULEUR] (modifiable)

💡 Workflow: Vidéo → Animation PSD → Colorisation → Mix média final
```

### **Composition Séquence** `SQ01_MASTER_COMP_SEQ`
```
🎞️ SQ01_MASTER_COMP_SEQ (2560×1440p • 25fps • durée séquence)
├── 🎞️ SQ01_UNDLM_00001_v001  [00:00 → 00:03] (plan animé final)
├── 🎞️ SQ01_UNDLM_00002_v001  [00:03 → 00:07] (plan animé final)
├── 🎞️ SQ01_UNDLM_00003_v001  [00:07 → 00:12] (plan animé final)
└── 🎞️ ... (assembly temporel automatique selon montage)
```

---

## 🔄 **Workflow pour Graphistes Animation**

### **Phase 1 : Génération Automatique** ⚙️
```
[DÉVELOPPEUR] Lance le générateur RL PostFlow
           ↓
[SYSTÈME] Lit le CSV des 516 plans
           ↓
[SYSTÈME] Génère les projets AE avec structure EB
           ↓
[SYSTÈME] Place les fichiers sur le serveur LucidLink
```

### **Phase 2 : Récupération des Projets** 📥
```
📍 Serveur: /Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/

Pour SQ01 → SEQUENCES/SQ01/_AE/SQ01_01.aep
Pour SQ05 → SEQUENCES/SQ05/_AE/SQ05_01.aep
Pour SQ11 → SEQUENCES/SQ11/_AE/SQ11_01.aep
...etc (28 séquences disponibles)
```

### **Phase 3 : Animation Photoshop** 🎨
```
1. 📂 Ouvrir composition plan (ex: SQ01_UNDLM_00001_v001)
2. 🎬 Exporter vidéo source en PNG sequence → EB/UNDLM_00001/1_VIDEO/
3. 🎨 Dans Photoshop:
   • Import séquence PNG depuis 1_VIDEO/
   • Créer calques vidéo séparés selon structure :
     - 2_KEY/HAIR/ (cheveux, barbe)
     - 2_KEY/SKIN/ (peau, visages)  
     - 2_KEY/_Others/ (vêtements, props selon 9 catégories)
   • Animation avec brush UNDM_Brush uniquement
   • Garder éléments en NOIR sur calques alpha séparés
4. 🤖 Optionnel EBSYNTH pour tracking intelligent :
   • Key frames dans 2_KEY/
   • Sortie automatique dans 3_OUT/
5. 💾 Sauvegarder PSD avec structure calques respectée
```

### **Phase 4 : Import Animation AE** 🎭
```
1. 📂 Import PSD en composition (calques séparés)
2. 🎨 Colorisation selon palette séquence:
   • Effet "Remplir" (Fill) pour coloriser noir
   • Effet "Teinte" si pas de transparence
   • Masques pour séparer éléments même calque
3. 🎬 Mix média avec vidéo source:
   • Masques pour garder/cacher vidéo selon zones
   • Vignettage des zones non essentielles
4. ✨ Effets finaux: textures, lumières smartphones, etc.
```

### **Phase 5 : Import Sources Étalonnées** ✨
```
[ÉTALONNAGE] Plans étalonnés disponibles
           ↓
[DÉVELOPPEUR] Lance l'import automatique
           ↓
[SYSTÈME] Ajoute sources graded aux projets
           ↓
[GRAPHISTE] Sources mises à jour automatiquement!
```

---

## 🎨 **Répartition Équipe Animation**

### **👨‍🎨 Supervision & Direction Artistique**
- **Garant rendu artistique** final
- **Repasse et finalisation** de toutes premières versions
- **Fabrication plans animés** complexes
- **Harmonisation DA** sur l'ensemble du projet

### **👨‍💼 Cycles & Séquences Complexes**
- **Cycles réutilisables** : Canots migrants (tous angles)
- **Séquence naufrage** avec affaissement progressif canot
- **Supervision animation** et accompagnement stagiaires
- **Scènes techniques** en collaboration avec supervision

### **👨‍🎓 Plans Animation & Renfort**
- **Scènes canot et embarquement**
- **Plans animés premières versions**
- **Collaboration supervision** sur scènes complexes
- **Support technique** expérience

### **👩‍🎓 Stagiaires Animation**
- **Scènes spécifiques** selon attribution
- **Premières versions** pour repasse supervision
- **Formation workflow** O2B
- **Support équipe** selon besoins

### **👨‍🎓 Habillage & Intégration**
- **Génériques début/fin**
- **Synthés documentaire** (SMS, cartes, mails)
- **Intégration éléments graphiques**
- **Renfort animation** après habillage

---

> **📋 Attribution détaillée :** Voir document `PRIORITY_001.md` pour l'attribution spécifique des plans et séquences de la première vague de production.

---

## 📊 **Données Projet : Ce qui est Automatisé**

### **📈 Statistiques Complètes**
- **28 séquences** générées automatiquement
- **516 plans** individuels créés  
- **51.9 minutes** de contenu total (35-40min animation)
- **100% scaling automatique** UHD (3840×2160) → 1440p (2560×1440)
- **Assembly temporel** selon timing exact du montage
- **Structure EB** complète pour workflow Photoshop/EBSYNTH

### **🎯 Formats et Paramètres**
| Paramètre | Valeur | Description |
|-----------|--------|-------------|
| **Résolution** | 2560×1440 (1440p) | Format sortie final |
| **Frame Rate** | 25 fps | Cadence standard (AE + PS) |
| **Animation Base** | 12 fps | Base animation (variable selon scènes) |
| **Scaling Sources** | 66.67% | UHD → 1440p automatique |
| **Position** | 1280, 720 | Centrage automatique |
| **Durée Plans** | Variable | Selon montage original |
| **Technique** | Mixte | Vidéo + Animation aquarelle |

---

## 🖌️ **Outils & Techniques Spécifiques**

### **🎨 Photoshop - Animation Rotoscopie**
- **Brush unique** : `UNDLM_Brush` (style encre, pas feutre)
- **Technique** : Ne pas lâcher le pinceau (uniformité texture)
- **Calques séparés** : Peau, cheveux, vêtements, props
- **Export** : PNG alpha pour import AE
- **Cadence** : Toujours 25fps (vérifier paramètres PS)

### **🤖 EBSYNTH - Track Intelligent**
- **Usage** : Barbes, cheveux (évite tremblements excessifs)
- **Process** : Key frame → Track auto → Correction manuelle
- **Arborescence** : /1_VIDEO /2_KEY /3_OUT (générée automatiquement)
- **Export** : PNG alpha automatique si source alpha
- **Corrections** : Masques AE ou retouche PS des frames bugguées

**📚 Documentation & Tutoriels :**
- **Site officiel** : https://ebsynth.com/
- **FAQ complète** : https://ebsynth.com/faq
- **Tutoriel officiel** : https://www.youtube.com/watch?v=0RLtHuu5jV4
- **Exemples silhouettes** : https://www.youtube.com/watch?v=ERp5tMqQkwU

### **🎭 After Effects - Assemblage/Compo**
- **Import PSD** : En composition (calques séparés)
- **Colorisation** : Effet "Remplir" pour zones noires
- **Mix média** : Masques pour vidéo/animation selon zones
- **Effets** : Ray-Fill, niveaux alpha, teinte, textures

---

## 🚀 **Séquences Disponibles**

### **🎬 Séquences Disponibles** (projets générés)
| Seq | Titre | Plans | Durée | Statut |
|-----|-------|-------|-------|--------|
| **SQ01** | Réveil Hôpital - Jour | 34 | 2.9min | ✅ **PRÊT** |
| **SQ02** | Bus - Fin de Journée | 39 | 2.8min | ✅ **PRÊT** |
| **SQ03** | Marche - Fin de Journée | 20 | 2.1min | ✅ **PRÊT** |
| **SQ05** | Départ en Mer - Nuit | 16 | 1.2min | ✅ **PRÊT** |
| **SQ06** | Départ en Mer - Nuit | 11 | 1.1min | ✅ **PRÊT** |
| **SQ07** | Départ en Mer - Nuit | 19 | 2.1min | ✅ **PRÊT** |
| **SQ09** | Cross Intérieur - Nuit | 15 | 1.3min | ✅ **PRÊT** |
| **SQ11** | Appel à Mer - Nuit | 9 | 1.3min | ✅ **PRÊT** |
| **SQ12** | Cross Intérieur - Nuit | 22 | 1.7min | ✅ **PRÊT** |
| **SQ16** | En Mer - Nuit | 17 | 1.7min | ✅ **PRÊT** |
| **SQ21** | En Mer - Nuit | 33 | 2.9min | ✅ **PRÊT** |
| **SQ23** | 2ème Mayday - Nuit | 24 | 3.0min | ✅ **PRÊT** |
| **SQ28** | Réveil Hôpital - Jour | 15 | 2.0min | ✅ **PRÊT** |

### **🌊 Autres Séquences**
Les 15 séquences restantes peuvent être générées sur demande (SQ04, SQ08, SQ10, SQ13-SQ15, SQ17-SQ20, SQ22, SQ24-SQ27).

### **🎯 Attribution & Planning**
- **Priority 001** : Plans prioritaires définis pour démarrage production
- **Attribution détaillée** : Voir `PRIORITY_001.md` pour assignation équipe
- **Dashboard général** : [Google Sheets - Suivi Animation](https://docs.google.com/spreadsheets/d/1mVni49q63ItOvChyUmh7AD_BXN-MsMhz4krzGzMOUKI/edit?usp=sharing)
- **Planning global** : Génération progressive selon besoins production

---

## 💡 **Tips Animation Spécifiques**

### **✅ Bonnes Pratiques Workflow O2B**
- **Utiliser la structure EB générée** : 1_VIDEO → 2_KEY → 3_OUT
- **Respecter les 9 catégories _Others** : Cloth_1/2, Decor_1/2, LifeJacket, etc.
- **Séparer HAIR/SKIN** selon fonction (cheveux vs peau)
- **Grouper par type** : LifeJacket séparé de Cloth_1/2
- **Utiliser vidéo source** : 60% vidéo + 40% animation selon scènes
- **Vignetter zones non essentielles** pour focus narration
- **Structure EBSYNTH** : Key frames dans 2_KEY/, sortie dans 3_OUT/

### **🖌️ Technique Brush UNDM**
- **Option 1** : Ne pas lâcher le pinceau (uniformité, recommandé)
- **Option 2** : Superposition transparence (effet joue, occasionnel)
- **Option 3** : Pression → opacité (variations, modéré)
- **Rendu** : Style encre plutôt que feutre

### **🤖 EBSYNTH Optimisations**
- **Choisir meilleure key frame** (éléments maximum visibles)
- **Corriger aberrations** : Masques AE ou retouche PS
- **Bonne pour** : Barbes, cheveux, silhouettes
- **Attention** : Mains, yeux (souvent correction manuelle)

### **⚠️ À Éviter**
- ❌ Modifier structure dossiers EB générée
- ❌ Supprimer compositions MASTER
- ❌ Changer cadence (toujours 25fps)
- ❌ Utiliser autres brush que UNDM_Brush
- ❌ Lâcher le pinceau inutilement (vibrations)

---

## 🆘 **Support & Questions**

### **📞 Contacts Techniques**
- **Pipeline Développeur** : Xavier (post.xavierb@gmail.com)
- **Supervision Animation** : David (devaux7@hotmail.com)
- **Production Artistique** : Caroline (bruncaroline@hotmail.com)
- **Documentation Complète** : `/docs/AFTER_EFFECTS_GENERATOR.md`

### **🐛 Problèmes Courants Animation**
| Problème | Solution |
|----------|----------|
| **Projet ne s'ouvre pas** | Vérifier After Effects 2024+ |
| **Cadence incorrecte** | Vérifier 25fps dans AE et PS |
| **Brush manquant** | Installer UNDM_Brush |
| **EBSYNTH bugs** | Masques AE ou retouche PS |
| **Import PSD échoue** | Vérifier structure calques |
| **Colorisation échoue** | Utiliser Fill/Remplir pour noir |

### **🔄 Mises à Jour**
Le système met automatiquement à jour vos projets avec les nouvelles sources étalonnées. **Pas d'action requise !**

---

## 🎉 **Résumé : Votre Nouveau Workflow Animation**

### **Avant (Manuel)**
```
😫 Créer projet AE manuellement
😫 Importer toutes sources une par une  
😫 Créer structure EB pour chaque plan
😫 Paramétrer scaling/cadence manuellement
😫 Créer compositions individuelles
😫 Assembler séquence temporellement
😫 Recommencer pour 28 séquences...
```

### **Maintenant (Automatisé RL PostFlow)**
```
🚀 Récupérer projet AE avec structure EB complète
🎯 Navigation directe dans MASTER_COMPS_SHOTS
🎨 Commencer animation Photoshop immédiatement
🤖 Utiliser EBSYNTH sur structure prête
🎭 Import PSD et colorisation dans AE optimisé
✨ Sources étalonnées arrivent automatiquement
💾 Workflow animation mixte parfaitement intégré
🎉 516 plans prêts pour animation !
```

---

## 📍 **Accès Serveur LucidLink**

**Chemin principal :** `/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/`

**Structure d'accès :**
```
SEQUENCES/
├── SQ01/ (Réveil Hôpital - Claire)
│   └── _AE/
│       └── SQ01_01.aep    ← PROJET PRÊT ANIMATION
├── SQ05/ (Départ Mer - Matthieu)  
│   └── _AE/
│       └── SQ05_01.aep    ← PROJET PRÊT ANIMATION
├── SQ21/ (En Mer - Matthieu)
│   └── _AE/
│       └── SQ21_01.aep    ← PROJET PRÊT ANIMATION
└── ... (28 séquences total)
```

---

**🎬 Ready for animation mixte O2B ! 🎨**  
*Workflow Photoshop → EBSYNTH → After Effects optimisé*
