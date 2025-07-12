# 🎨 RL PostFlow - Guide Graphiste Discord (4/6)
## 🖌️ Outils & Techniques Spécifiques

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

## 💡 **Tips Animation Spécifiques**

### **✅ Bonnes Pratiques Workflow O2B**
- **Utiliser la structure EB générée** : 1_VIDEO → 2_KEY → 3_OUT
- **Respecter les 9 catégories _Others** : Cloth_1/2, Decor_1/2, LifeJacket, etc.
- **Séparer HAIR/SKIN** selon fonction (cheveux vs peau)
- **Utiliser vidéo source** : 60% vidéo + 40% animation selon scènes
- **Vignetter zones non essentielles** pour focus narration

**➡️ Suite dans message 5/6**
