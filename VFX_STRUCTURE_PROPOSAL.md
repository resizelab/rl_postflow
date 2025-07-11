# 🎭 Structure VFX Blender - O2B UNDLM
## Arborescence Pipeline 3D/VFX Simplifiée

> **Organisation VFX Blender pour "Une Nuit dans la Manche"**  
> Structure essentielle • Workflow optimisé • Production efficace

---

## 📁 **Arborescence VFX Simplifiée**

```
/Volumes/resizelab/o2b-undllm/3_PROJECTS/3_VFX/
├── 📂 PROJECTS/                       # Projets Blender
│   ├── 📂 SQ05_DEPART_MER/
│   │   ├──  SQ05_v001.blend
│   │   ├── � CACHE/
│   │   └── 📂 EXPORTS/
│   ├── 📂 SQ21_EN_MER/
│   └── 📂 ...
├── 📂 ASSETS/                         # Bibliothèque 3D
│   ├── 📂 CANOTS/
│   │   ├── 🔷 canot_migrant.blend
│   │   └── 🔷 canot_rnli.blend
│   ├── 📂 PERSONNAGES/
│   │   ├── 🔷 migrant_homme.blend
│   │   └── 🔷 sauveteur.blend
│   ├── 📂 OCEAN/
│   │   └──  ocean_shader.blend
│   └── � PROPS/
│       ├── 🔷 gilet_sauvetage.blend
│       └── 🔷 equipement_rnli.blend
├── 📂 RENDERS/                        # Rendus finaux
│   ├── 📂 SQ05/
│   │   ├── 📂 FINAL/
│   │   └── 📂 PREVIEW/
│   └── 📂 ...
├── 📂 COMPOSITING/                    # Post-production
│   ├── 📂 BLENDER_COMP/
│   ├── 📂 ELEMENTS/
│   └── 📂 EXPORTS/
└── 📂 REFERENCES/                     # Références visuelles
    ├──  PHOTOS/
    ├── 📂 VIDEOS/
    └── 📂 CONCEPTS/
```

---

## 🎯 **Nomenclature Simple**

### **🔷 Fichiers Blender**
```
nom_element_version.blend
Exemples:
- canot_migrant_v001.blend
- sq05_master_v003.blend
- ocean_calm_v001.blend
```

### **🎬 Rendus**
```
SQ##_shot_####.exr
Exemples:
- SQ05_shot_0001.exr
- SQ21_shot_0142.exr
```

---

## � **Workflow VFX**

### **1. Assets** �
```
Créer → Tester → Bibliothèque
```

### **2. Production** 🎬
```
Layout → Animation → Lighting → Render
```

### **3. Compositing** 🎨
```
Integration → Effects → Export
```

### **4. Livraison** �
```
Preview → Validation → Final
```

---

## � **Éléments VFX O2B**

✅ **Canots migrants** (dégradation, réalisme)  
✅ **Océan dynamique** (vagues, écume)  
✅ **Véhicules RNLI** (bateaux, hélicos)  
✅ **Éclairage nuit** (projecteurs, phares)  
✅ **Atmosphère** (pluie, brouillard)  

---

**🎭 VFX structure minimale et efficace !**
```

---

## 🎯 **Nomenclature VFX**

### **🔷 Fichiers Blender**
```
CATEGORY_ELEMENT_VERSION.blend
Exemples:
- CANOT_MIGRANT_v001.blend
- OCEAN_SHADER_v003.blend
- SQ05_MASTER_v010.blend
```

### **🎬 Rendus**
```
SEQUENCE_SHOT_PASS_FRAME.ext
Exemples:
- SQ05_UNDLM_00100_BEAUTY_0001.exr
- SQ05_UNDLM_00100_DEPTH_0001.exr
- SQ21_UNDLM_00250_ID_0142.exr
```

### **🎨 Assets**
```
TYPE_NAME_VERSION
Exemples:
- CHAR_MIGRANT_HOMME_v001
- PROP_GILET_SAUVETAGE_v002
- ENV_OCEAN_CALM_v001
```

---

## 🚀 **Workflow VFX Intégré**

### **Phase 1 : Previs & Layout**
```
1. 📋 Briefing séquence VFX
2. 🎨 Création assets base (proxy)
3. 🎬 Layout et caméras
4. ⏱️ Timing et animation bloquée
5. 📤 Export previs vers animation
```

### **Phase 2 : Asset Development**
```
1. 🔧 Modeling haute résolution
2. 🎨 Texturing et shading
3. 🏗️ Rigging si nécessaire
4. 🧪 Tests render et intégration
5. 📚 Ajout à la bibliothèque
```

### **Phase 3 : Production**
```
1. 🎭 Animation finale assets
2. 🌊 Simulations (océan, fluides)
3. 💡 Lighting et atmosphère
4. 🎥 Rendering passes multiples
5. 🎬 Export vers compositing
```

### **Phase 4 : Compositing**
```
1. 🔧 Setup projet compositing
2. 🎨 Integration passes 3D
3. 📹 Ajout éléments stock
4. 🎨 Color grading et effets
5. 📤 Export final vers montage
```

---

## 💡 **Spécificités O2B UNDLM**

### **🌊 Éléments VFX Prioritaires**
- **Canots migrants** : Modélisation détaillée, simulation dégradation
- **Océan** : Simulation réaliste selon conditions météo
- **Sauvetage RNLI** : Véhicules et équipements authentiques
- **Atmosphère nuit** : Éclairage réaliste, projecteurs, phares
- **Hélicoptères** : Animation et éclairage dynamique

### **🎨 Style Artistique VFX**
- **Réalisme documentaire** : Précision historique et technique
- **Intégration animation** : Cohérence avec style aquarelle
- **Éclairage dramatique** : Renforcer tension narrative
- **Météo authentique** : Conditions Manche en hiver

---

## 📞 **Pipeline Collaboration**

### **🔄 Intégration avec 2_ANIM**
- Export layouts et previs
- Références 3D pour animation 2D
- Éléments de fond et véhicules

### **🎬 Intégration avec 1_EDIT**
- Previs cuts pour montage
- VFX plates et éléments
- Renders finaux timés

### **🎨 Intégration avec 4_GRADING**
- Exports OpenEXR multi-passes
- Métadonnées couleur
- Éléments séparés pour compositing final

---

**🎭 Structure VFX complète et évolutive pour production documentaire !**
