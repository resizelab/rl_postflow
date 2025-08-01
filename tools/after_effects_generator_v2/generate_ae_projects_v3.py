#!/usr/bin/env python3
"""
After Effects Auto-Generator v3 pour RL PostFlow
Génère automatiquement les projets AE en respectant la structure du template
Basé sur l'analyse du template AE SQXX_01.aep
Support des configurations JSON spécifiques (P02, P03, etc.)
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple
import subprocess
import tempfile

# Ajouter src au path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'src'))

class AfterEffectsGeneratorV3:
    """Générateur automatique de projets After Effects v3 - Compatible template AE avec support configurations personnalisées."""
    
    def __init__(self, config_path=None):
        self.from_edit_path = Path("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS")
        self.from_grading_path = Path("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS")
        self.sequences_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES")
        self.template_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX")
        
        # Configuration flexible selon le fichier JSON fourni
        if config_path:
            self.config_path = Path(config_path)
        else:
            self.config_path = Path(__file__).parent.parent.parent / "config" / "after_effects_mapping_gsheets.json"
        
    def load_sequence_data(self) -> Dict:
        """Charge les données de mapping des séquences depuis Google Sheets JSON."""
        if not self.config_path.exists():
            raise FileNotFoundError(f"Configuration non trouvée : {self.config_path}")
            
        with open(self.config_path, 'r', encoding='utf-8') as f:
            gsheets_data = json.load(f)
        
        # Adapter le format Google Sheets vers le format attendu par le générateur
        adapted_data = {}
        
        for seq_id, seq_info in gsheets_data['sequences'].items():
            plans = []
            
            # Récupérer les données des plans depuis la section "plans"
            for plan_num in seq_info['plans']:
                # Trouver le plan correspondant dans la section "plans"
                plan_key = f"UNDLM_{plan_num:05d}"
                if plan_key in gsheets_data['plans']:
                    plan_data = gsheets_data['plans'][plan_key]
                    plans.append({
                        'plan_num': plan_num,
                        'name': plan_data['shot_name'],
                        'comp_name': plan_data.get('comp_name', ''),  # Ajouter comp_name du CSV
                        'duration': plan_data['duration_seconds'],
                        'status': plan_data['status'],
                        'timecode_in': plan_data['edit_tc_in'],
                        'timecode_out': plan_data['edit_tc_out']
                    })
            
            adapted_data[seq_id] = {
                'name': seq_info['name'],
                'order': seq_info['order'],
                'plans': plans
            }
        
        return adapted_data
    
    def check_graded_plans_availability(self, plans: List[Dict]) -> List[int]:
        """Vérifie quels plans étalonnés sont disponibles."""
        available_graded = []
        
        if not self.from_grading_path.exists():
            print(f"⚠️  Dossier grading non trouvé : {self.from_grading_path}")
            return available_graded
        
        for plan in plans:
            plan_num = plan['plan_num']
            graded_file = self.from_grading_path / f"UNDLM_{plan_num:05d}.mov"
            
            if graded_file.exists():
                available_graded.append(plan_num)
                print(f"✅ Plan étalonné trouvé : UNDLM_{plan_num:05d}")
            else:
                print(f"📝 Plan montage seulement : UNDLM_{plan_num:05d}")
        
        return available_graded
    
    def generate_folder_structure(self) -> str:
        """Génère la structure de dossiers conforme au template AE."""
        return """
// ==========================================
// 1. CRÉATION DE LA STRUCTURE DE DOSSIERS
// ==========================================

// Dossier principal _MASTER
var masterMainFolder = project.items.addFolder("_MASTER");

// Sous-dossiers de _MASTER
var masterCompSeqFolder = project.items.addFolder("MASTER_COMP_SEQ");
masterCompSeqFolder.parentFolder = masterMainFolder;

var masterCompsShotsFolder = project.items.addFolder("MASTER_COMPS_SHOTS");
masterCompsShotsFolder.parentFolder = masterMainFolder;

// Autres dossiers principaux
var inFolder = project.items.addFolder("_IN");
var workFolder = project.items.addFolder("_WORK");

// Sous-dossiers de _IN
var diversFolder = project.items.addFolder("Divers");
diversFolder.parentFolder = inFolder;

var ebFolder = project.items.addFolder("EB");
ebFolder.parentFolder = inFolder;

var fromEditFolder = project.items.addFolder("FROM_EDIT");
fromEditFolder.parentFolder = inFolder;

var fromGradingFolder = project.items.addFolder("FROM_GRADING");
fromGradingFolder.parentFolder = inFolder;

var psFolder = project.items.addFolder("PS");
psFolder.parentFolder = inFolder;

var refColorsFolder = project.items.addFolder("Ref_Colors");
refColorsFolder.parentFolder = inFolder;

// Sous-dossiers de _WORK
var workCompFolder = project.items.addFolder("WORK_COMP");
workCompFolder.parentFolder = workFolder;

var workLayersFolder = project.items.addFolder("WORK_LAYERS");
workLayersFolder.parentFolder = workFolder;

// Structure de dossiers prête pour l'animation
"""

    def generate_import_footage(self, plans: List[Dict], available_graded: List[int]) -> str:
        """Génère l'import des fichiers sources avec variantes et gestion d'erreurs avancée."""
        imports = []
        
        # Définir les caractères d'échappement
        newline = "\\n"
        
        imports.append("""
// ==========================================
// 2. IMPORT DES FICHIERS SOURCES
// ==========================================

// Arrays pour stocker les footages
var editSources = {};
var gradingSources = {};

// Statistiques d'import détaillées
var editImportCount = 0;
var gradingImportCount = 0;
var missingEditCount = 0;
var missingGradingCount = 0;
var importErrors = [];
var successfulImports = [];

// Fonction de logging d'erreur détaillée
function logImportError(planNum, type, filePath, error) {
    var errorMsg = "❌ ERREUR IMPORT " + type + " " + planNum + ": " + error.toString();
    importErrors.push({
        plan: planNum,
        type: type,
        path: filePath,
        error: error.toString(),
        timestamp: new Date().toString()
    });
}

// Fonction de logging de succès
function logImportSuccess(planNum, type, filePath, fileName) {
    var successMsg = "✅ IMPORT RÉUSSI " + type + " " + planNum + ": " + fileName;
    successfulImports.push({
        plan: planNum,
        type: type,
        path: filePath,
        fileName: fileName,
        timestamp: new Date().toString()
    });
}

// Test d'accès aux dossiers principaux
var editFolder = new Folder("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS");
var gradingFolder = new Folder("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS");

// Message de diagnostic initial
alert("🔍 DIAGNOSTIC DOSSIERS:\\n" +
      "EDIT existe: " + editFolder.exists + "\\n" +
      "GRADING existe: " + gradingFolder.exists + "\\n\\n" +
      "Chemins testés:\\n" +
      "EDIT: /Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS\\n" +
      "GRADING: /Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS");

if (!editFolder.exists) {
    alert("❌ ERREUR CRITIQUE: Dossier EDIT non accessible!\\n" +
          "Chemin: /Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS");
}
""")
        
        # Import des plans EDIT avec variantes
        for plan in plans:
            plan_num = plan['plan_num']
            plan_file_base = f"/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_{plan_num:05d}"
            
            import_script = f"""
// Import plan EDIT {plan_num:05d}
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile{plan_num} = new File("{plan_file_base}.mov");
var editFilePoignees{plan_num} = new File("{plan_file_base}_AVEC_POIGNEES.mov");
var editFileBis{plan_num} = new File("{plan_file_base}bis.mov");

var importSuccess{plan_num} = false;
var fileName{plan_num} = "";

// Tenter import standard
if (editFile{plan_num}.exists) {{
    try {{
        var editFootage{plan_num} = project.importFile(new ImportOptions(editFile{plan_num}));
        editFootage{plan_num}.parentFolder = fromEditFolder;
        editFootage{plan_num}.name = "UNDLM_{plan_num:05d}";
        editSources[{plan_num}] = editFootage{plan_num};
        fileName{plan_num} = "UNDLM_{plan_num:05d}.mov";
        importSuccess{plan_num} = true;
        editImportCount++;
        logImportSuccess({plan_num}, "EDIT", editFile{plan_num}.fsName, fileName{plan_num});
    }} catch (e) {{
        logImportError({plan_num}, "EDIT", editFile{plan_num}.fsName, e.toString());
    }}
}}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess{plan_num} && editFilePoignees{plan_num}.exists) {{
    try {{
        var editFootage{plan_num} = project.importFile(new ImportOptions(editFilePoignees{plan_num}));
        editFootage{plan_num}.parentFolder = fromEditFolder;
        editFootage{plan_num}.name = "UNDLM_{plan_num:05d}";
        editSources[{plan_num}] = editFootage{plan_num};
        fileName{plan_num} = "UNDLM_{plan_num:05d}_AVEC_POIGNEES.mov";
        importSuccess{plan_num} = true;
        editImportCount++;
        logImportSuccess({plan_num}, "EDIT", editFilePoignees{plan_num}.fsName, fileName{plan_num});
    }} catch (e) {{
        logImportError({plan_num}, "EDIT", editFilePoignees{plan_num}.fsName, e.toString());
    }}
}}

// Si échec, tenter import bis
if (!importSuccess{plan_num} && editFileBis{plan_num}.exists) {{
    try {{
        var editFootage{plan_num} = project.importFile(new ImportOptions(editFileBis{plan_num}));
        editFootage{plan_num}.parentFolder = fromEditFolder;
        editFootage{plan_num}.name = "UNDLM_{plan_num:05d}";
        editSources[{plan_num}] = editFootage{plan_num};
        fileName{plan_num} = "UNDLM_{plan_num:05d}bis.mov";
        importSuccess{plan_num} = true;
        editImportCount++;
        logImportSuccess({plan_num}, "EDIT", editFileBis{plan_num}.fsName, fileName{plan_num});
    }} catch (e) {{
        logImportError({plan_num}, "EDIT", editFileBis{plan_num}.fsName, e.toString());
    }}
}}

// Si aucune variante n'a fonctionné
if (!importSuccess{plan_num}) {{
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_{plan_num:05d}.mov\\n" +
          "Variantes testées:\\n" +
          "• UNDLM_{plan_num:05d}.mov: " + editFile{plan_num}.exists + "\\n" +
          "• UNDLM_{plan_num:05d}_AVEC_POIGNEES.mov: " + editFilePoignees{plan_num}.exists + "\\n" +
          "• UNDLM_{plan_num:05d}bis.mov: " + editFileBis{plan_num}.exists);
}}"""
            imports.append(import_script)
        
        # Import des plans GRADED avec variantes (si disponibles)
        for plan in plans:
            plan_num = plan['plan_num']
            if plan_num in available_graded:
                plan_file_base = f"/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_{plan_num:05d}"
                
                import_script = f"""
// Import plan GRADED {plan_num:05d}
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile{plan_num} = new File("{plan_file_base}.mov");
var gradedFilePoignees{plan_num} = new File("{plan_file_base}_AVEC_POIGNEES.mov");
var gradedFileBis{plan_num} = new File("{plan_file_base}bis.mov");

var gradedImportSuccess{plan_num} = false;
var gradedFileName{plan_num} = "";

// Tenter import standard
if (gradedFile{plan_num}.exists) {{
    try {{
        var gradedFootage{plan_num} = project.importFile(new ImportOptions(gradedFile{plan_num}));
        gradedFootage{plan_num}.parentFolder = fromGradingFolder;
        gradedFootage{plan_num}.name = "UNDLM_{plan_num:05d}";
        gradingSources[{plan_num}] = gradedFootage{plan_num};
        gradedFileName{plan_num} = "UNDLM_{plan_num:05d}.mov";
        gradedImportSuccess{plan_num} = true;
        gradingImportCount++;
        logImportSuccess({plan_num}, "GRADED", gradedFile{plan_num}.fsName, gradedFileName{plan_num});
    }} catch (e) {{
        logImportError({plan_num}, "GRADED", gradedFile{plan_num}.fsName, e.toString());
    }}
}}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess{plan_num} && gradedFilePoignees{plan_num}.exists) {{
    try {{
        var gradedFootage{plan_num} = project.importFile(new ImportOptions(gradedFilePoignees{plan_num}));
        gradedFootage{plan_num}.parentFolder = fromGradingFolder;
        gradedFootage{plan_num}.name = "UNDLM_{plan_num:05d}";
        gradingSources[{plan_num}] = gradedFootage{plan_num};
        gradedFileName{plan_num} = "UNDLM_{plan_num:05d}_AVEC_POIGNEES.mov";
        gradedImportSuccess{plan_num} = true;
        gradingImportCount++;
        logImportSuccess({plan_num}, "GRADED", gradedFilePoignees{plan_num}.fsName, gradedFileName{plan_num});
    }} catch (e) {{
        logImportError({plan_num}, "GRADED", gradedFilePoignees{plan_num}.fsName, e.toString());
    }}
}}

// Si échec, tenter import bis
if (!gradedImportSuccess{plan_num} && gradedFileBis{plan_num}.exists) {{
    try {{
        var gradedFootage{plan_num} = project.importFile(new ImportOptions(gradedFileBis{plan_num}));
        gradedFootage{plan_num}.parentFolder = fromGradingFolder;
        gradedFootage{plan_num}.name = "UNDLM_{plan_num:05d}";
        gradingSources[{plan_num}] = gradedFootage{plan_num};
        gradedFileName{plan_num} = "UNDLM_{plan_num:05d}bis.mov";
        gradedImportSuccess{plan_num} = true;
        gradingImportCount++;
        logImportSuccess({plan_num}, "GRADED", gradedFileBis{plan_num}.fsName, gradedFileName{plan_num});
    }} catch (e) {{
        logImportError({plan_num}, "GRADED", gradedFileBis{plan_num}.fsName, e.toString());
    }}
}}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess{plan_num}) {{
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_{plan_num:05d} (normal)");
}}"""
                imports.append(import_script)
        
        # Ajouter le rapport final d'import
        imports.append(f"""
// Rapport final d'import
alert("📊 RAPPORT D'IMPORT FINAL:" + "{newline}" +
      "EDIT importés: " + editImportCount + "/{len(plans)}" + "{newline}" +
      "GRADED importés: " + gradingImportCount + "/{len(available_graded)}" + "{newline}" +
      "EDIT manquants: " + missingEditCount + "{newline}" +
      "GRADED manquants: " + missingGradingCount + "{newline}" + "{newline}" +
      "Erreurs d'import: " + importErrors.length + "{newline}" +
      "Imports réussis: " + successfulImports.length);
""")
        
        return "\n".join(imports)
    
    def generate_plan_compositions(self, sequence_id: str, plans: List[Dict], available_graded: List[int]) -> str:
        """Génère les compositions de plans individuels avec sources UHD -> 1440p et gestion avancée EDIT vs GRADED."""
        compositions = []
        
        compositions.append("""
// ==========================================
// 3. CRÉATION DES COMPOSITIONS DE PLANS
// ==========================================

// Array pour stocker les compositions de plans
var planCompositions = {};

// Créer une composition de solid réutilisable dans WORK_LAYERS
var bgSolidComp = project.items.addComp("BG_SOLID_BLACK", 2560, 1440, 1.0, 10.0, 25);
bgSolidComp.parentFolder = workLayersFolder;
var bgSolidLayer = bgSolidComp.layers.addSolid([0.05, 0.05, 0.05], "BG_SOLID", 2560, 1440, 1.0);
""")
        
        for plan in plans:
            plan_num = plan['plan_num']
            duration = plan.get('duration', 5.0)
            has_graded = plan_num in available_graded
            
            # Déterminer le nom de la composition : comp_name du CSV pour P02_ALL, sinon format standard
            if sequence_id == "P02_ALL" and plan.get('comp_name'):
                comp_name = plan['comp_name']
            else:
                comp_name = f"{sequence_id}_UNDLM_{plan_num:05d}_v001"
            
            # Créer la composition du plan avec gestion avancée
            comp_script = f"""
// Composition pour plan {plan_num:05d}
var planComp{plan_num} = project.items.addComp(
    "{comp_name}",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    {duration},     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp{plan_num}.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer{plan_num} = planComp{plan_num}.layers.add(bgSolidComp);
bgLayer{plan_num}.name = "BG_SOLID";
bgLayer{plan_num}.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer{plan_num} = false;
if (gradingSources[{plan_num}]) {{
    var gradedLayer{plan_num} = planComp{plan_num}.layers.add(gradingSources[{plan_num}]);
    gradedLayer{plan_num}.name = "UNDLM_{plan_num:05d}_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer{plan_num}.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer{plan_num}.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer{plan_num} = true;
}}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer{plan_num} = false;
if (editSources[{plan_num}]) {{
    var editLayer{plan_num} = planComp{plan_num}.layers.add(editSources[{plan_num}]);
    editLayer{plan_num}.name = "UNDLM_{plan_num:05d}_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer{plan_num}.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer{plan_num}.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer{plan_num} = true;
}}

// 4. Gestion de l'activation des layers
if (hasEditLayer{plan_num}) {{
    // EDIT toujours activé quand disponible
    editLayer{plan_num}.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer{plan_num}) {{
        gradedLayer{plan_num}.enabled = false;
    }}
}} else if (hasGradedLayer{plan_num}) {{
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer{plan_num}.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText{plan_num} = planComp{plan_num}.layers.addText("SOURCE EDIT MANQUANTE\\nUtilisation GRADED uniquement");
    warningText{plan_num}.name = "WARNING_NO_EDIT";
    warningText{plan_num}.property("Transform").property("Position").setValue([1280, 200]);
    warningText{plan_num}.guideLayer = true;
    
    var warningTextDoc{plan_num} = warningText{plan_num}.property("Source Text").value;
    warningTextDoc{plan_num}.fontSize = 32;
    warningTextDoc{plan_num}.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc{plan_num}.font = "Arial-BoldMT";
    warningTextDoc{plan_num}.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText{plan_num}.property("Source Text").setValue(warningTextDoc{plan_num});
}} else {{
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText{plan_num} = planComp{plan_num}.layers.addText("AUCUNE SOURCE DISPONIBLE\\nUNDLM_{plan_num:05d}");
    errorText{plan_num}.name = "ERROR_NO_SOURCE";
    errorText{plan_num}.property("Transform").property("Position").setValue([1280, 720]);
    errorText{plan_num}.guideLayer = true;
    
    var errorTextDoc{plan_num} = errorText{plan_num}.property("Source Text").value;
    errorTextDoc{plan_num}.fontSize = 48;
    errorTextDoc{plan_num}.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc{plan_num}.font = "Arial-BoldMT";
    errorTextDoc{plan_num}.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText{plan_num}.property("Source Text").setValue(errorTextDoc{plan_num});
}}

planCompositions[{plan_num}] = planComp{plan_num};
"""
            
            compositions.append(comp_script)
        
        return "\n".join(compositions)
    
    def generate_master_composition(self, sequence_id: str, plans: List[Dict]) -> str:
        """Génère la composition master de la séquence avec burn-ins avancés."""
        total_duration = sum(plan.get('duration', 5.0) for plan in plans)
        
        # Générer les plages temporelles pour l'expression du plan courant
        plan_time_ranges = []
        current_time = 0
        for plan in plans:
            plan_num = plan['plan_num']
            duration = plan.get('duration', 5.0)
            plan_time_ranges.append({
                'start': current_time,
                'end': current_time + duration,
                'name': f"UNDLM_{plan_num:05d}"
            })
            current_time += duration
        
        master_script = f"""
// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "{sequence_id}_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    {total_duration}, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;
"""
        
        current_time = 0
        for i, plan in enumerate(plans):
            plan_num = plan['plan_num']
            duration = plan.get('duration', 5.0)
            
            assembly_script = f"""
// Ajouter plan {plan_num:05d} à la timeline master
if (planCompositions[{plan_num}]) {{
    var masterLayer{plan_num} = masterComp.layers.add(planCompositions[{plan_num}]);
    masterLayer{plan_num}.startTime = {current_time};
    masterLayer{plan_num}.name = "UNDLM_{plan_num:05d}";
    masterLayer{plan_num}.label = {(i % 16) + 1}; // Couleurs alternées
}}
"""
            master_script += assembly_script
            current_time += duration
        
        # Ajouter le TC et les burn-ins avancés
        master_script += f"""
// Ajouter l'adjustment layer TC en top de la composition master
var tcAdjustment = masterComp.layers.addSolid([1.0, 1.0, 1.0], "TC", 2560, 1440, 1.0);
tcAdjustment.adjustmentLayer = true;
tcAdjustment.moveToBeginning();

// Ajouter l'effet Timecode sur l'adjustment layer
try {{
    var timecodeEffect = tcAdjustment.property("Effects").addProperty("ADBE Timecode");
    if (timecodeEffect) {{
        // Configuration du timecode (prend automatiquement le TC de la séquence)
        timecodeEffect.property("Display Format").setValue(0); // 25fps
        timecodeEffect.property("Time Units").setValue(0); // Frames
    }}
}} catch (e) {{
    // Si l'effet Timecode n'est pas disponible, on continue sans erreur
    $.writeln("Effet Timecode non disponible, ajout manuel requis");
}}

// Ajouter le burn-in scope (centré horizontalement et verticalement) - Import du fichier PNG
var scopeFile = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/ALL/MASK_UHD_Scope239.png");
if (scopeFile.exists) {{
    var scopeFootage = project.importFile(new ImportOptions(scopeFile));
    scopeFootage.parentFolder = refColorsFolder;
    scopeFootage.name = "SCOPE_239";
    
    var scopeLayer = masterComp.layers.add(scopeFootage);
    scopeLayer.name = "SCOPE_BURN";
    // Centrer horizontalement et verticalement
    scopeLayer.property("Transform").property("Position").setValue([1280, 720]); // Centré à 1280x720 (2560/2 x 1440/2)
    
    // Mise à l'échelle du scope pour s'adapter à la résolution 1440p
    scopeLayer.property("Transform").property("Scale").setValue([66.67, 66.67]);
}} else {{
    // Fallback vers texte si le fichier PNG n'existe pas
    var scopeText = masterComp.layers.addText("SCOPE: 2.40:1");
    scopeText.name = "SCOPE_BURN";
    scopeText.property("Transform").property("Position").setValue([1280, 720]); // Centré horizontalement et verticalement
    var scopeTextDocument = scopeText.property("Source Text").value;
    scopeTextDocument.fontSize = 36;
    scopeTextDocument.fillColor = [1.0, 1.0, 1.0];
    scopeTextDocument.font = "Arial-BoldMT";
    scopeTextDocument.justification = ParagraphJustification.CENTER_JUSTIFY;
    scopeText.property("Source Text").setValue(scopeTextDocument);
    
    // Ajouter l'effet Drop Shadow au scope
    try {{
        var scopeShadow = scopeText.property("Effects").addProperty("ADBE Drop Shadow");
        if (scopeShadow) {{
            scopeShadow.property("Opacity").setValue(180);
            scopeShadow.property("Direction").setValue(135);
            scopeShadow.property("Distance").setValue(3);
            scopeShadow.property("Softness").setValue(5);
        }}
    }} catch (e) {{
        // Drop Shadow non disponible pour scope
    }}
}}

// Ajouter le burn-in nom de séquence (haut droite) avec version dynamique
var sequenceText = masterComp.layers.addText();
sequenceText.name = "SEQUENCE_BURN";
sequenceText.property("Transform").property("Position").setValue([2410, 100]);

// Expression pour afficher le nom de la séquence avec version dynamique
var seqExpression = 'var seqName = "{sequence_id}";' + String.fromCharCode(13) +
'var seqVersion = "v001";' + String.fromCharCode(13) +
'// Détecter la version de la comp master courante' + String.fromCharCode(13) +
'var masterComp = thisComp;' + String.fromCharCode(13) +
'if (masterComp) {{' + String.fromCharCode(13) +
'  var compName = masterComp.name;' + String.fromCharCode(13) +
'  var versionMatch = compName.match(/v(\\\\d{{3}})/);' + String.fromCharCode(13) +
'  if (versionMatch) seqVersion = versionMatch[0];' + String.fromCharCode(13) +
'}}' + String.fromCharCode(13) +
'seqName + " " + seqVersion;';

sequenceText.property("Source Text").expression = seqExpression;

var seqTextDocument = sequenceText.property("Source Text").value;
seqTextDocument.fontSize = 36;
seqTextDocument.fillColor = [1.0, 1.0, 1.0];
seqTextDocument.font = "Arial-BoldMT";
seqTextDocument.justification = ParagraphJustification.RIGHT_JUSTIFY;
sequenceText.property("Source Text").setValue(seqTextDocument);

// Ajouter l'effet Drop Shadow à la séquence
try {{
    var seqShadow = sequenceText.property("Effects").addProperty("ADBE Drop Shadow");
    if (seqShadow) {{
        seqShadow.property("Opacity").setValue(180);
        seqShadow.property("Direction").setValue(135);
        seqShadow.property("Distance").setValue(3);
        seqShadow.property("Softness").setValue(5);
    }}
}} catch (e) {{
    // Drop Shadow non disponible pour séquence
}}

// Ajouter le burn-in nom du plan courant (bas gauche) avec version dynamique
var planText = masterComp.layers.addText();
planText.name = "PLAN_BURN";
planText.property("Transform").property("Position").setValue([150, 1340]);

// Expression pour afficher le nom du plan courant avec version dynamique
var planExpression = 'var currentTime = time;' + String.fromCharCode(13) +
'var planName = "PLAN_INDETERMINE";' + String.fromCharCode(13) +
'var planVersion = "v001";' + String.fromCharCode(13) +
'' + String.fromCharCode(13) +
'// Détecter la version du plan actif depuis la source de la composition' + String.fromCharCode(13) +
'var masterComp = thisComp;' + String.fromCharCode(13) +
'for (var i = 1; i <= masterComp.numLayers; i++) {{' + String.fromCharCode(13) +
'  try {{' + String.fromCharCode(13) +
'    var layer = masterComp.layer(i);' + String.fromCharCode(13) +
'    // Vérifier que le layer a une source ET que c\\'est le bon temps' + String.fromCharCode(13) +
'    if (layer.source && layer.startTime <= currentTime && (layer.startTime + layer.outPoint - layer.inPoint) > currentTime) {{' + String.fromCharCode(13) +
'      if (layer.source.name && layer.source.name.indexOf("UNDLM_") !== -1) {{' + String.fromCharCode(13) +
'        var compName = layer.source.name;' + String.fromCharCode(13) +
'        var versionMatch = compName.match(/v(\\\\d{{3}})/);' + String.fromCharCode(13) +
'        if (versionMatch) planVersion = versionMatch[0];' + String.fromCharCode(13) +
'        break;' + String.fromCharCode(13) +
'      }}' + String.fromCharCode(13) +
'    }}' + String.fromCharCode(13) +
'  }} catch (e) {{' + String.fromCharCode(13) +
'    // Ignorer les layers sans source' + String.fromCharCode(13) +
'  }}' + String.fromCharCode(13) +
'}}' + String.fromCharCode(13);

// Ajouter la logique pour chaque plan dans l'expression (simplifié)
var planTimeRanges = ["""
        
        # Ajouter les plages temporelles pour l'expression
        for i, time_range in enumerate(plan_time_ranges):
            master_script += f"""
    {{start: {time_range['start']}, end: {time_range['end']}, name: "{time_range['name']}"}},"""
        
        master_script += f"""
];

// Finaliser l'expression simplifiée avec version
for (var i = 0; i < planTimeRanges.length; i++) {{
    planExpression += 'if (currentTime >= ' + planTimeRanges[i].start + ' && currentTime < ' + planTimeRanges[i].end + ') {{' + String.fromCharCode(13);
    planExpression += '  planName = "' + planTimeRanges[i].name + '";' + String.fromCharCode(13);
    planExpression += '}}' + String.fromCharCode(13);
}}

planExpression += String.fromCharCode(13) +
'planName + " " + planVersion;';
planText.property("Source Text").expression = planExpression;

var planTextDocument = planText.property("Source Text").value;
planTextDocument.fontSize = 36;
planTextDocument.fillColor = [1.0, 1.0, 1.0];
planTextDocument.font = "Arial-BoldMT";
planText.property("Source Text").setValue(planTextDocument);

// Ajouter l'effet Drop Shadow au plan
try {{
    var planShadow = planText.property("Effects").addProperty("ADBE Drop Shadow");
    if (planShadow) {{
        planShadow.property("Opacity").setValue(180);
        planShadow.property("Direction").setValue(135);
        planShadow.property("Distance").setValue(3);
        planShadow.property("Softness").setValue(5);
    }}
}} catch (e) {{
    // Drop Shadow non disponible pour plan
}}
"""
        
        return master_script
    
    def generate_ae_script_v2(self, sequence_id: str, plans: List[Dict], available_graded: List[int]) -> str:
        """Génère le script ExtendScript complet v2 compatible template."""
        
        output_path = self.sequences_path / sequence_id / "_AE"
        
        # Préparer les caractères d'échappement
        newline = "\\n"
        total_duration = sum(plan.get('duration', 5.0) for plan in plans)
        
        # Créer le script en utilisant la concaténation de chaînes plutôt que des f-strings
        script_parts = []
        
        script_parts.append("// ==========================================")
        script_parts.append("// RL PostFlow v4.1.1 - Générateur After Effects v2")
        script_parts.append("// Séquence " + sequence_id + " avec " + str(len(plans)) + " plans")
        script_parts.append("// Compatible avec template AE SQXX_01.aep")
        script_parts.append("// Sources UHD (3840x2160) -> Comps 1440p (2560x1440)")
        script_parts.append("// ==========================================")
        script_parts.append("")
        script_parts.append("// Créer nouveau projet")
        script_parts.append("app.newProject();")
        script_parts.append("var project = app.project;")
        script_parts.append("")
        script_parts.append("// Paramètres du projet")
        script_parts.append("project.workAreaStart = 0;")
        script_parts.append("project.feetFramesFilmType = FeetFramesFilmType.MM16;")
        script_parts.append("")
        
        # Ajouter les sections
        script_parts.append(self.generate_folder_structure())
        script_parts.append("")
        script_parts.append(self.generate_import_footage(plans, available_graded))
        script_parts.append("")
        script_parts.append(self.generate_plan_compositions(sequence_id, plans, available_graded))
        script_parts.append("")
        script_parts.append(self.generate_master_composition(sequence_id, plans))
        script_parts.append("")
        
        # Section finale
        script_parts.append("// ==========================================")
        script_parts.append("// 5. SAUVEGARDE ET FINALISATION")
        script_parts.append("// ==========================================")
        script_parts.append("")
        script_parts.append("// Sauvegarder le projet")
        output_path_str = str(output_path).replace('\\', '/')
        script_parts.append("var saveFile = new File(\"" + output_path_str + "/" + sequence_id + "_01.aep\");")
        script_parts.append("project.save(saveFile);")
        script_parts.append("")
        
        # Statistiques finales
        script_parts.append("// Statistiques finales détaillées")
        script_parts.append("var gradedCount = " + str(len(available_graded)) + ";")
        script_parts.append("var totalCount = " + str(len(plans)) + ";")
        script_parts.append("var editOnlyCount = totalCount - gradedCount;")
        script_parts.append("")
        script_parts.append("// Calcul des statistiques réelles d'import")
        script_parts.append("var actualEditImported = editImportCount;")
        script_parts.append("var actualGradedImported = gradingImportCount;")
        script_parts.append("var editSuccessRate = Math.round((actualEditImported / totalCount) * 100);")
        script_parts.append("var gradedSuccessRate = gradedCount > 0 ? Math.round((actualGradedImported / gradedCount) * 100) : 0;")
        script_parts.append("")
        
        # Message d'alerte final
        alert_parts = []
        alert_parts.append("\"🎬 Séquence " + sequence_id + " créée avec succès!\" + \"" + newline + "\" + \"" + newline + "\" +")
        alert_parts.append("\"📊 Statistiques Détaillées:\" + \"" + newline + "\" +")
        alert_parts.append("\"• Plans total: \" + totalCount + \"" + newline + "\" +")
        alert_parts.append("\"• Plans EDIT importés: \" + actualEditImported + \"/\" + totalCount + \" (\" + editSuccessRate + \"%)\" + \"" + newline + "\" +")
        alert_parts.append("\"• Plans GRADED importés: \" + actualGradedImported + \"/\" + gradedCount + \" (\" + gradedSuccessRate + \"%)\" + \"" + newline + "\" +")
        alert_parts.append("\"• Plans EDIT manquants: \" + missingEditCount + \"" + newline + "\" +")
        alert_parts.append("\"• Plans GRADED manquants: \" + missingGradingCount + \"" + newline + "\" +")
        alert_parts.append("\"• Durée séquence: \" + Math.round(" + str(total_duration) + " * 100) / 100 + \"s\" + \"" + newline + "\" + \"" + newline + "\" +")
        alert_parts.append("\"💾 Sauvegardé: " + sequence_id + "_01.aep\" + \"" + newline + "\" + \"" + newline + "\" +")
        alert_parts.append("\"✅ Structure conforme au template AE\" + \"" + newline + "\" +")
        alert_parts.append("\"✅ Sources UHD mises à l'échelle en 1440p\" + \"" + newline + "\" +")
        alert_parts.append("\"✅ Import Edit + Graded avec variantes\" + \"" + newline + "\" +")
        alert_parts.append("\"✅ Burn-ins avancés avec expressions dynamiques\" + \"" + newline + "\" +")
        alert_parts.append("\"✅ Gestion intelligente EDIT vs GRADED\" + \"" + newline + "\" +")
        alert_parts.append("\"✅ Messages d'avertissement et d'erreur\" + \"" + newline + "\" + \"" + newline + "\" +")
        alert_parts.append("\"🔥 FONCTIONNALITÉS AVANCÉES:\" + \"" + newline + "\" +")
        alert_parts.append("\"• Burn-in séquence (haut droite): " + sequence_id + " v001\" + \"" + newline + "\" +")
        alert_parts.append("\"• Burn-in plan courant (bas gauche): dynamique\" + \"" + newline + "\" +")
        alert_parts.append("\"• Scope burn-in (centré): PNG ou texte fallback\" + \"" + newline + "\" +")
        alert_parts.append("\"• Expressions avec détection de version\" + \"" + newline + "\" +")
        alert_parts.append("\"• Drop shadows sur tous les burn-ins\" + \"" + newline + "\" +")
        alert_parts.append("\"• Timecode automatique sur adjustment layer\");")
        
        script_parts.append("alert(" + " ".join(alert_parts))
        script_parts.append("")
        
        # Logs finaux
        script_parts.append("// Log détaillé pour Python avec toutes les métriques")
        script_parts.append("$.writeln(\"AE_GENERATION_V2_SUCCESS:" + sequence_id + ":\" + totalCount + \":\" + gradedCount + \":\" +")
        script_parts.append("          actualEditImported + \":\" + actualGradedImported + \":\" + missingEditCount + \":\" + missingGradingCount);")
        script_parts.append("")
        script_parts.append("// Log des erreurs pour debugging")
        script_parts.append("if (importErrors.length > 0) {")
        script_parts.append("    $.writeln(\"IMPORT_ERRORS:\" + importErrors.join(\"|\"));")
        script_parts.append("}")
        script_parts.append("")
        script_parts.append("// Log des succès pour validation")
        script_parts.append("$.writeln(\"IMPORT_SUCCESS_COUNT:\" + successfulImports.length);")
        
        script = "\n".join(script_parts)
        
        return script
    
    def generate_for_sequence(self, sequence_id: str, dry_run: bool = False) -> bool:
        """Génère le projet AE pour une séquence donnée avec la nouvelle structure."""
        try:
            sequence_data = self.load_sequence_data()
            
            if sequence_id not in sequence_data:
                print(f"❌ Séquence {sequence_id} non trouvée dans le mapping")
                return False
            
            seq_info = sequence_data[sequence_id]
            plans = seq_info['plans']
            
            print(f"\n🎬 Génération AE v2 pour {sequence_id} (Nouveau Template)")
            print(f"   📝 {len(plans)} plans à traiter")
            
            if not dry_run:
                # 1. Créer la structure EB complète
                print("📁 Création de la structure EB...")
                if not self.create_eb_structure_for_plans(sequence_id, plans):
                    print("❌ Échec création structure EB")
                    return False
                
                # 2. Créer le dossier _PS
                ps_dir = self.sequences_path / sequence_id / "_PS"
                ps_dir.mkdir(parents=True, exist_ok=True)
                print("📁 Dossier _PS créé")
            
            # 3. Vérifier disponibilité des plans étalonnés
            available_graded = self.check_graded_plans_availability(plans)
            
            # 4. Générer le script ExtendScript
            ae_script = self.generate_ae_script_v2(sequence_id, plans, available_graded)
            
            # 5. Créer le dossier de sortie AE
            output_dir = self.sequences_path / sequence_id / "_AE"
            if not dry_run:
                output_dir.mkdir(parents=True, exist_ok=True)
            
            # 6. Sauvegarder le script
            script_file = output_dir / f"{sequence_id}_generation_script_v2.jsx"
            
            if not dry_run:
                with open(script_file, 'w', encoding='utf-8') as f:
                    f.write(ae_script)
                print(f"✅ Script généré : {script_file}")
            else:
                print(f"📝 [DRY-RUN] Script serait généré : {script_file}")
            
            # 7. Copier également dans le dossier ae_scripts local
            local_script_dir = Path(__file__).parent.parent.parent / "ae_scripts"
            local_script_file = local_script_dir / f"RL_PostFlow_{sequence_id}_GENERATION_V2.jsx"
            
            if not dry_run:
                local_script_dir.mkdir(exist_ok=True)
                with open(local_script_file, 'w', encoding='utf-8') as f:
                    f.write(ae_script)
                print(f"✅ Script copié localement : {local_script_file}")
            else:
                print(f"📝 [DRY-RUN] Script serait copié : {local_script_file}")
            
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors de la génération : {e}")
            return False
    
    def generate_validation_sequences(self, dry_run: bool = False) -> bool:
        """Génère les projets AE pour les 3 premières séquences (validation)."""
        validation_sequences = ['SQ01', 'SQ02', 'SQ03']
        success_count = 0
        
        for seq_id in validation_sequences:
            if self.generate_for_sequence(seq_id, dry_run):
                success_count += 1
        
        print(f"\n📊 Génération terminée : {success_count}/{len(validation_sequences)} séquences")
        return success_count == len(validation_sequences)
    
    def create_eb_structure_for_plans(self, sequence_id: str, plans: List[Dict]) -> bool:
        """Crée la structure EB pour tous les plans d'une séquence basée sur le template."""
        try:
            sequence_dir = self.sequences_path / sequence_id
            eb_dir = sequence_dir / "_EB"
            
            # Créer le dossier _EB principal
            eb_dir.mkdir(parents=True, exist_ok=True)
            
            for plan in plans:
                plan_num = plan['plan_num']
                plan_dir = eb_dir / f"UNDLM_{plan_num:05d}"
                
                # Créer la structure pour chaque plan
                (plan_dir / "1_VIDEO-REF").mkdir(parents=True, exist_ok=True)
                
                # Créer la structure 2_KEY avec la nouvelle arborescence
                key_dir = plan_dir / "2_KEY"
                key_dir.mkdir(exist_ok=True)
                
                # Créer les dossiers de la nouvelle structure 2_KEY
                (key_dir / "HAIR").mkdir(exist_ok=True)
                (key_dir / "SKIN").mkdir(exist_ok=True)
                
                # Créer la structure _Others avec tous ses sous-dossiers
                others_dir = key_dir / "_Others"
                others_dir.mkdir(exist_ok=True)
                
                others_subdirs = [
                    "Cloth_1", "Cloth_2", "Decor_1", "Decor_2", 
                    "LifeJacket", "Lips", "Pupil", "Shadow", "Silhouettes"
                ]
                
                for subdir in others_subdirs:
                    (others_dir / subdir).mkdir(exist_ok=True)
                
                # Créer la structure 3_OUT (identique à 2_KEY)
                out_dir = plan_dir / "3_OUT"
                out_dir.mkdir(exist_ok=True)
                
                # 3_OUT a la même structure que 2_KEY
                (out_dir / "HAIR").mkdir(exist_ok=True)
                (out_dir / "SKIN").mkdir(exist_ok=True)
                
                # Créer la structure _Others dans 3_OUT aussi
                out_others_dir = out_dir / "_Others"
                out_others_dir.mkdir(exist_ok=True)
                
                for subdir in others_subdirs:
                    (out_others_dir / subdir).mkdir(exist_ok=True)
                
                # Copier le fichier PSD template s'il existe
                template_psd = self.template_path / "_EB" / "UNDLM_00XXX" / "EB_UNDLM_00XXX.psd"
                target_psd = plan_dir / f"EB_UNDLM_{plan_num:05d}.psd"
                
                if template_psd.exists():
                    import shutil
                    try:
                        shutil.copy2(template_psd, target_psd)
                    except Exception as e:
                        print(f"⚠️  Impossible de copier le PSD pour {plan_num:05d}: {e}")
                
                print(f"✅ Structure EB créée pour UNDLM_{plan_num:05d}")
            
            print(f"🎬 Structure EB complète créée pour {sequence_id} ({len(plans)} plans)")
            return True
            
        except Exception as e:
            print(f"❌ Erreur création structure EB : {e}")
            return False

    def generate_all_sequences(self, dry_run: bool = False) -> bool:
        """Génère toutes les séquences disponibles."""
        try:
            sequence_data = self.load_sequence_data()
            sequences = list(sequence_data.keys())
            sequences.sort()  # Trier par ordre alphabétique
            
            success_count = 0
            total_sequences = len(sequences)
            
            print(f"🎬 Génération de toutes les séquences ({total_sequences} au total)")
            
            for i, seq_id in enumerate(sequences, 1):
                print(f"\n📍 [{i}/{total_sequences}] Traitement de {seq_id}")
                if self.generate_for_sequence(seq_id, dry_run):
                    success_count += 1
                else:
                    print(f"❌ Échec pour {seq_id}")
            
            print(f"\n📊 Génération terminée : {success_count}/{total_sequences} séquences réussies")
            return success_count == total_sequences
            
        except Exception as e:
            print(f"❌ Erreur génération massive : {e}")
            return False

def main():
    """Point d'entrée principal."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Générateur After Effects v3 pour RL PostFlow')
    parser.add_argument('--sequence', '-s', help='Séquence à générer (ex: SQ01, P02_ALL, P03_ALL)')
    parser.add_argument('--validation', '-v', action='store_true', help='Générer les 3 premières séquences pour validation')
    parser.add_argument('--all', '-a', action='store_true', help='Générer toutes les séquences disponibles')
    parser.add_argument('--dry-run', '-d', action='store_true', help='Mode simulation (pas de génération réelle)')
    parser.add_argument('--config', '-c', help='Fichier JSON de configuration spécifique (ex: after_effects_mapping_P02.json)')
    
    args = parser.parse_args()
    
    # Initialiser le générateur avec le fichier de config spécifique si fourni
    generator = AfterEffectsGeneratorV3(config_path=args.config)
    
    if args.validation:
        print("🎯 Mode validation : génération des 3 premières séquences")
        success = generator.generate_validation_sequences(args.dry_run)
        sys.exit(0 if success else 1)
    elif args.all:
        print("🚀 Mode complet : génération de toutes les séquences")
        success = generator.generate_all_sequences(args.dry_run)
        sys.exit(0 if success else 1)
    elif args.sequence:
        success = generator.generate_for_sequence(args.sequence, args.dry_run)
        sys.exit(0 if success else 1)
    else:
        print("❌ Spécifiez --sequence, --validation ou --all")
        print("   --validation : génère SQ01, SQ02, SQ03")
        print("   --all : génère toutes les séquences")
        print("   --sequence SQ01 : génère une séquence spécifique")
        sys.exit(1)

if __name__ == "__main__":
    main()
