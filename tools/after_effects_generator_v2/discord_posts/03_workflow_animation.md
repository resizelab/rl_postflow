# 🎨 RL PostFlow - Guide Graphiste Discord (3/6)
## 🔄 Workflow pour Graphistes Animation

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
   • Masques pour séparer éléments même calque
3. 🎬 Mix média avec vidéo source:
   • Masques pour garder/cacher vidéo selon zones
4. ✨ Effets finaux: textures, lumières smartphones, etc.
```

**➡️ Suite dans message 4/6**
