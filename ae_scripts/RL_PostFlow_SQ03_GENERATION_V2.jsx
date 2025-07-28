
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ03 avec 20 plans
// Compatible avec template AE SQXX_01.aep
// Sources UHD (3840x2160) -> Comps 1440p (2560x1440)
// ==========================================

// Créer nouveau projet
app.newProject();
var project = app.project;

// Paramètres du projet
project.workAreaStart = 0;
project.feetFramesFilmType = FeetFramesFilmType.MM16;


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
alert("� DIAGNOSTIC DOSSIERS:\n" +
      "EDIT existe: " + editFolder.exists + "\n" +
      "GRADING existe: " + gradingFolder.exists + "\n\n" +
      "Chemins testés:\n" +
      "EDIT: /Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS\n" +
      "GRADING: /Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS");

if (!editFolder.exists) {
    alert("❌ ERREUR CRITIQUE: Dossier EDIT non accessible!\n" +
          "Chemin: /Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS");
}


// Import plan EDIT 00074
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile74 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00074.mov");
var editFilePoignees74 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00074_AVEC_POIGNEES.mov");
var editFileBis74 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00074bis.mov");

var importSuccess74 = false;
var fileName74 = "";

// Tenter import standard
if (editFile74.exists) {
    try {
        var editFootage74 = project.importFile(new ImportOptions(editFile74));
        editFootage74.parentFolder = fromEditFolder;
        editFootage74.name = "UNDLM_00074";
        editSources[74] = editFootage74;
        editImportCount++;
        importSuccess74 = true;
        fileName74 = "UNDLM_00074.mov";
        logImportSuccess(74, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00074.mov", fileName74);
    } catch (e) {
        logImportError(74, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00074.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess74 && editFilePoignees74.exists) {
    try {
        var editFootage74 = project.importFile(new ImportOptions(editFilePoignees74));
        editFootage74.parentFolder = fromEditFolder;
        editFootage74.name = "UNDLM_00074_AVEC_POIGNEES";
        editSources[74] = editFootage74;
        editImportCount++;
        importSuccess74 = true;
        fileName74 = "UNDLM_00074_AVEC_POIGNEES.mov";
        logImportSuccess(74, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00074_AVEC_POIGNEES.mov", fileName74);
    } catch (e) {
        logImportError(74, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00074_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess74 && editFileBis74.exists) {
    try {
        var editFootage74 = project.importFile(new ImportOptions(editFileBis74));
        editFootage74.parentFolder = fromEditFolder;
        editFootage74.name = "UNDLM_00074bis";
        editSources[74] = editFootage74;
        editImportCount++;
        importSuccess74 = true;
        fileName74 = "UNDLM_00074bis.mov";
        logImportSuccess(74, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00074bis.mov", fileName74);
    } catch (e) {
        logImportError(74, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00074bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess74) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00074.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00075
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile75 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00075.mov");
var editFilePoignees75 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00075_AVEC_POIGNEES.mov");
var editFileBis75 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00075bis.mov");

var importSuccess75 = false;
var fileName75 = "";

// Tenter import standard
if (editFile75.exists) {
    try {
        var editFootage75 = project.importFile(new ImportOptions(editFile75));
        editFootage75.parentFolder = fromEditFolder;
        editFootage75.name = "UNDLM_00075";
        editSources[75] = editFootage75;
        editImportCount++;
        importSuccess75 = true;
        fileName75 = "UNDLM_00075.mov";
        logImportSuccess(75, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00075.mov", fileName75);
    } catch (e) {
        logImportError(75, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00075.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess75 && editFilePoignees75.exists) {
    try {
        var editFootage75 = project.importFile(new ImportOptions(editFilePoignees75));
        editFootage75.parentFolder = fromEditFolder;
        editFootage75.name = "UNDLM_00075_AVEC_POIGNEES";
        editSources[75] = editFootage75;
        editImportCount++;
        importSuccess75 = true;
        fileName75 = "UNDLM_00075_AVEC_POIGNEES.mov";
        logImportSuccess(75, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00075_AVEC_POIGNEES.mov", fileName75);
    } catch (e) {
        logImportError(75, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00075_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess75 && editFileBis75.exists) {
    try {
        var editFootage75 = project.importFile(new ImportOptions(editFileBis75));
        editFootage75.parentFolder = fromEditFolder;
        editFootage75.name = "UNDLM_00075bis";
        editSources[75] = editFootage75;
        editImportCount++;
        importSuccess75 = true;
        fileName75 = "UNDLM_00075bis.mov";
        logImportSuccess(75, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00075bis.mov", fileName75);
    } catch (e) {
        logImportError(75, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00075bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess75) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00075.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00076
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile76 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00076.mov");
var editFilePoignees76 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00076_AVEC_POIGNEES.mov");
var editFileBis76 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00076bis.mov");

var importSuccess76 = false;
var fileName76 = "";

// Tenter import standard
if (editFile76.exists) {
    try {
        var editFootage76 = project.importFile(new ImportOptions(editFile76));
        editFootage76.parentFolder = fromEditFolder;
        editFootage76.name = "UNDLM_00076";
        editSources[76] = editFootage76;
        editImportCount++;
        importSuccess76 = true;
        fileName76 = "UNDLM_00076.mov";
        logImportSuccess(76, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00076.mov", fileName76);
    } catch (e) {
        logImportError(76, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00076.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess76 && editFilePoignees76.exists) {
    try {
        var editFootage76 = project.importFile(new ImportOptions(editFilePoignees76));
        editFootage76.parentFolder = fromEditFolder;
        editFootage76.name = "UNDLM_00076_AVEC_POIGNEES";
        editSources[76] = editFootage76;
        editImportCount++;
        importSuccess76 = true;
        fileName76 = "UNDLM_00076_AVEC_POIGNEES.mov";
        logImportSuccess(76, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00076_AVEC_POIGNEES.mov", fileName76);
    } catch (e) {
        logImportError(76, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00076_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess76 && editFileBis76.exists) {
    try {
        var editFootage76 = project.importFile(new ImportOptions(editFileBis76));
        editFootage76.parentFolder = fromEditFolder;
        editFootage76.name = "UNDLM_00076bis";
        editSources[76] = editFootage76;
        editImportCount++;
        importSuccess76 = true;
        fileName76 = "UNDLM_00076bis.mov";
        logImportSuccess(76, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00076bis.mov", fileName76);
    } catch (e) {
        logImportError(76, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00076bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess76) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00076.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00077
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile77 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00077.mov");
var editFilePoignees77 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00077_AVEC_POIGNEES.mov");
var editFileBis77 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00077bis.mov");

var importSuccess77 = false;
var fileName77 = "";

// Tenter import standard
if (editFile77.exists) {
    try {
        var editFootage77 = project.importFile(new ImportOptions(editFile77));
        editFootage77.parentFolder = fromEditFolder;
        editFootage77.name = "UNDLM_00077";
        editSources[77] = editFootage77;
        editImportCount++;
        importSuccess77 = true;
        fileName77 = "UNDLM_00077.mov";
        logImportSuccess(77, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00077.mov", fileName77);
    } catch (e) {
        logImportError(77, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00077.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess77 && editFilePoignees77.exists) {
    try {
        var editFootage77 = project.importFile(new ImportOptions(editFilePoignees77));
        editFootage77.parentFolder = fromEditFolder;
        editFootage77.name = "UNDLM_00077_AVEC_POIGNEES";
        editSources[77] = editFootage77;
        editImportCount++;
        importSuccess77 = true;
        fileName77 = "UNDLM_00077_AVEC_POIGNEES.mov";
        logImportSuccess(77, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00077_AVEC_POIGNEES.mov", fileName77);
    } catch (e) {
        logImportError(77, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00077_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess77 && editFileBis77.exists) {
    try {
        var editFootage77 = project.importFile(new ImportOptions(editFileBis77));
        editFootage77.parentFolder = fromEditFolder;
        editFootage77.name = "UNDLM_00077bis";
        editSources[77] = editFootage77;
        editImportCount++;
        importSuccess77 = true;
        fileName77 = "UNDLM_00077bis.mov";
        logImportSuccess(77, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00077bis.mov", fileName77);
    } catch (e) {
        logImportError(77, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00077bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess77) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00077.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00078
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile78 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00078.mov");
var editFilePoignees78 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00078_AVEC_POIGNEES.mov");
var editFileBis78 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00078bis.mov");

var importSuccess78 = false;
var fileName78 = "";

// Tenter import standard
if (editFile78.exists) {
    try {
        var editFootage78 = project.importFile(new ImportOptions(editFile78));
        editFootage78.parentFolder = fromEditFolder;
        editFootage78.name = "UNDLM_00078";
        editSources[78] = editFootage78;
        editImportCount++;
        importSuccess78 = true;
        fileName78 = "UNDLM_00078.mov";
        logImportSuccess(78, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00078.mov", fileName78);
    } catch (e) {
        logImportError(78, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00078.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess78 && editFilePoignees78.exists) {
    try {
        var editFootage78 = project.importFile(new ImportOptions(editFilePoignees78));
        editFootage78.parentFolder = fromEditFolder;
        editFootage78.name = "UNDLM_00078_AVEC_POIGNEES";
        editSources[78] = editFootage78;
        editImportCount++;
        importSuccess78 = true;
        fileName78 = "UNDLM_00078_AVEC_POIGNEES.mov";
        logImportSuccess(78, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00078_AVEC_POIGNEES.mov", fileName78);
    } catch (e) {
        logImportError(78, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00078_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess78 && editFileBis78.exists) {
    try {
        var editFootage78 = project.importFile(new ImportOptions(editFileBis78));
        editFootage78.parentFolder = fromEditFolder;
        editFootage78.name = "UNDLM_00078bis";
        editSources[78] = editFootage78;
        editImportCount++;
        importSuccess78 = true;
        fileName78 = "UNDLM_00078bis.mov";
        logImportSuccess(78, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00078bis.mov", fileName78);
    } catch (e) {
        logImportError(78, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00078bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess78) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00078.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00079
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile79 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00079.mov");
var editFilePoignees79 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00079_AVEC_POIGNEES.mov");
var editFileBis79 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00079bis.mov");

var importSuccess79 = false;
var fileName79 = "";

// Tenter import standard
if (editFile79.exists) {
    try {
        var editFootage79 = project.importFile(new ImportOptions(editFile79));
        editFootage79.parentFolder = fromEditFolder;
        editFootage79.name = "UNDLM_00079";
        editSources[79] = editFootage79;
        editImportCount++;
        importSuccess79 = true;
        fileName79 = "UNDLM_00079.mov";
        logImportSuccess(79, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00079.mov", fileName79);
    } catch (e) {
        logImportError(79, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00079.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess79 && editFilePoignees79.exists) {
    try {
        var editFootage79 = project.importFile(new ImportOptions(editFilePoignees79));
        editFootage79.parentFolder = fromEditFolder;
        editFootage79.name = "UNDLM_00079_AVEC_POIGNEES";
        editSources[79] = editFootage79;
        editImportCount++;
        importSuccess79 = true;
        fileName79 = "UNDLM_00079_AVEC_POIGNEES.mov";
        logImportSuccess(79, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00079_AVEC_POIGNEES.mov", fileName79);
    } catch (e) {
        logImportError(79, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00079_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess79 && editFileBis79.exists) {
    try {
        var editFootage79 = project.importFile(new ImportOptions(editFileBis79));
        editFootage79.parentFolder = fromEditFolder;
        editFootage79.name = "UNDLM_00079bis";
        editSources[79] = editFootage79;
        editImportCount++;
        importSuccess79 = true;
        fileName79 = "UNDLM_00079bis.mov";
        logImportSuccess(79, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00079bis.mov", fileName79);
    } catch (e) {
        logImportError(79, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00079bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess79) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00079.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00080
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile80 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00080.mov");
var editFilePoignees80 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00080_AVEC_POIGNEES.mov");
var editFileBis80 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00080bis.mov");

var importSuccess80 = false;
var fileName80 = "";

// Tenter import standard
if (editFile80.exists) {
    try {
        var editFootage80 = project.importFile(new ImportOptions(editFile80));
        editFootage80.parentFolder = fromEditFolder;
        editFootage80.name = "UNDLM_00080";
        editSources[80] = editFootage80;
        editImportCount++;
        importSuccess80 = true;
        fileName80 = "UNDLM_00080.mov";
        logImportSuccess(80, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00080.mov", fileName80);
    } catch (e) {
        logImportError(80, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00080.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess80 && editFilePoignees80.exists) {
    try {
        var editFootage80 = project.importFile(new ImportOptions(editFilePoignees80));
        editFootage80.parentFolder = fromEditFolder;
        editFootage80.name = "UNDLM_00080_AVEC_POIGNEES";
        editSources[80] = editFootage80;
        editImportCount++;
        importSuccess80 = true;
        fileName80 = "UNDLM_00080_AVEC_POIGNEES.mov";
        logImportSuccess(80, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00080_AVEC_POIGNEES.mov", fileName80);
    } catch (e) {
        logImportError(80, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00080_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess80 && editFileBis80.exists) {
    try {
        var editFootage80 = project.importFile(new ImportOptions(editFileBis80));
        editFootage80.parentFolder = fromEditFolder;
        editFootage80.name = "UNDLM_00080bis";
        editSources[80] = editFootage80;
        editImportCount++;
        importSuccess80 = true;
        fileName80 = "UNDLM_00080bis.mov";
        logImportSuccess(80, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00080bis.mov", fileName80);
    } catch (e) {
        logImportError(80, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00080bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess80) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00080.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00081
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile81 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00081.mov");
var editFilePoignees81 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00081_AVEC_POIGNEES.mov");
var editFileBis81 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00081bis.mov");

var importSuccess81 = false;
var fileName81 = "";

// Tenter import standard
if (editFile81.exists) {
    try {
        var editFootage81 = project.importFile(new ImportOptions(editFile81));
        editFootage81.parentFolder = fromEditFolder;
        editFootage81.name = "UNDLM_00081";
        editSources[81] = editFootage81;
        editImportCount++;
        importSuccess81 = true;
        fileName81 = "UNDLM_00081.mov";
        logImportSuccess(81, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00081.mov", fileName81);
    } catch (e) {
        logImportError(81, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00081.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess81 && editFilePoignees81.exists) {
    try {
        var editFootage81 = project.importFile(new ImportOptions(editFilePoignees81));
        editFootage81.parentFolder = fromEditFolder;
        editFootage81.name = "UNDLM_00081_AVEC_POIGNEES";
        editSources[81] = editFootage81;
        editImportCount++;
        importSuccess81 = true;
        fileName81 = "UNDLM_00081_AVEC_POIGNEES.mov";
        logImportSuccess(81, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00081_AVEC_POIGNEES.mov", fileName81);
    } catch (e) {
        logImportError(81, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00081_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess81 && editFileBis81.exists) {
    try {
        var editFootage81 = project.importFile(new ImportOptions(editFileBis81));
        editFootage81.parentFolder = fromEditFolder;
        editFootage81.name = "UNDLM_00081bis";
        editSources[81] = editFootage81;
        editImportCount++;
        importSuccess81 = true;
        fileName81 = "UNDLM_00081bis.mov";
        logImportSuccess(81, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00081bis.mov", fileName81);
    } catch (e) {
        logImportError(81, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00081bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess81) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00081.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00082
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile82 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00082.mov");
var editFilePoignees82 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00082_AVEC_POIGNEES.mov");
var editFileBis82 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00082bis.mov");

var importSuccess82 = false;
var fileName82 = "";

// Tenter import standard
if (editFile82.exists) {
    try {
        var editFootage82 = project.importFile(new ImportOptions(editFile82));
        editFootage82.parentFolder = fromEditFolder;
        editFootage82.name = "UNDLM_00082";
        editSources[82] = editFootage82;
        editImportCount++;
        importSuccess82 = true;
        fileName82 = "UNDLM_00082.mov";
        logImportSuccess(82, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00082.mov", fileName82);
    } catch (e) {
        logImportError(82, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00082.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess82 && editFilePoignees82.exists) {
    try {
        var editFootage82 = project.importFile(new ImportOptions(editFilePoignees82));
        editFootage82.parentFolder = fromEditFolder;
        editFootage82.name = "UNDLM_00082_AVEC_POIGNEES";
        editSources[82] = editFootage82;
        editImportCount++;
        importSuccess82 = true;
        fileName82 = "UNDLM_00082_AVEC_POIGNEES.mov";
        logImportSuccess(82, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00082_AVEC_POIGNEES.mov", fileName82);
    } catch (e) {
        logImportError(82, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00082_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess82 && editFileBis82.exists) {
    try {
        var editFootage82 = project.importFile(new ImportOptions(editFileBis82));
        editFootage82.parentFolder = fromEditFolder;
        editFootage82.name = "UNDLM_00082bis";
        editSources[82] = editFootage82;
        editImportCount++;
        importSuccess82 = true;
        fileName82 = "UNDLM_00082bis.mov";
        logImportSuccess(82, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00082bis.mov", fileName82);
    } catch (e) {
        logImportError(82, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00082bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess82) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00082.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00083
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile83 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00083.mov");
var editFilePoignees83 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00083_AVEC_POIGNEES.mov");
var editFileBis83 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00083bis.mov");

var importSuccess83 = false;
var fileName83 = "";

// Tenter import standard
if (editFile83.exists) {
    try {
        var editFootage83 = project.importFile(new ImportOptions(editFile83));
        editFootage83.parentFolder = fromEditFolder;
        editFootage83.name = "UNDLM_00083";
        editSources[83] = editFootage83;
        editImportCount++;
        importSuccess83 = true;
        fileName83 = "UNDLM_00083.mov";
        logImportSuccess(83, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00083.mov", fileName83);
    } catch (e) {
        logImportError(83, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00083.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess83 && editFilePoignees83.exists) {
    try {
        var editFootage83 = project.importFile(new ImportOptions(editFilePoignees83));
        editFootage83.parentFolder = fromEditFolder;
        editFootage83.name = "UNDLM_00083_AVEC_POIGNEES";
        editSources[83] = editFootage83;
        editImportCount++;
        importSuccess83 = true;
        fileName83 = "UNDLM_00083_AVEC_POIGNEES.mov";
        logImportSuccess(83, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00083_AVEC_POIGNEES.mov", fileName83);
    } catch (e) {
        logImportError(83, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00083_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess83 && editFileBis83.exists) {
    try {
        var editFootage83 = project.importFile(new ImportOptions(editFileBis83));
        editFootage83.parentFolder = fromEditFolder;
        editFootage83.name = "UNDLM_00083bis";
        editSources[83] = editFootage83;
        editImportCount++;
        importSuccess83 = true;
        fileName83 = "UNDLM_00083bis.mov";
        logImportSuccess(83, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00083bis.mov", fileName83);
    } catch (e) {
        logImportError(83, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00083bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess83) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00083.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00084
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile84 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00084.mov");
var editFilePoignees84 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00084_AVEC_POIGNEES.mov");
var editFileBis84 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00084bis.mov");

var importSuccess84 = false;
var fileName84 = "";

// Tenter import standard
if (editFile84.exists) {
    try {
        var editFootage84 = project.importFile(new ImportOptions(editFile84));
        editFootage84.parentFolder = fromEditFolder;
        editFootage84.name = "UNDLM_00084";
        editSources[84] = editFootage84;
        editImportCount++;
        importSuccess84 = true;
        fileName84 = "UNDLM_00084.mov";
        logImportSuccess(84, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00084.mov", fileName84);
    } catch (e) {
        logImportError(84, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00084.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess84 && editFilePoignees84.exists) {
    try {
        var editFootage84 = project.importFile(new ImportOptions(editFilePoignees84));
        editFootage84.parentFolder = fromEditFolder;
        editFootage84.name = "UNDLM_00084_AVEC_POIGNEES";
        editSources[84] = editFootage84;
        editImportCount++;
        importSuccess84 = true;
        fileName84 = "UNDLM_00084_AVEC_POIGNEES.mov";
        logImportSuccess(84, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00084_AVEC_POIGNEES.mov", fileName84);
    } catch (e) {
        logImportError(84, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00084_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess84 && editFileBis84.exists) {
    try {
        var editFootage84 = project.importFile(new ImportOptions(editFileBis84));
        editFootage84.parentFolder = fromEditFolder;
        editFootage84.name = "UNDLM_00084bis";
        editSources[84] = editFootage84;
        editImportCount++;
        importSuccess84 = true;
        fileName84 = "UNDLM_00084bis.mov";
        logImportSuccess(84, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00084bis.mov", fileName84);
    } catch (e) {
        logImportError(84, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00084bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess84) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00084.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00085
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile85 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00085.mov");
var editFilePoignees85 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00085_AVEC_POIGNEES.mov");
var editFileBis85 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00085bis.mov");

var importSuccess85 = false;
var fileName85 = "";

// Tenter import standard
if (editFile85.exists) {
    try {
        var editFootage85 = project.importFile(new ImportOptions(editFile85));
        editFootage85.parentFolder = fromEditFolder;
        editFootage85.name = "UNDLM_00085";
        editSources[85] = editFootage85;
        editImportCount++;
        importSuccess85 = true;
        fileName85 = "UNDLM_00085.mov";
        logImportSuccess(85, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00085.mov", fileName85);
    } catch (e) {
        logImportError(85, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00085.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess85 && editFilePoignees85.exists) {
    try {
        var editFootage85 = project.importFile(new ImportOptions(editFilePoignees85));
        editFootage85.parentFolder = fromEditFolder;
        editFootage85.name = "UNDLM_00085_AVEC_POIGNEES";
        editSources[85] = editFootage85;
        editImportCount++;
        importSuccess85 = true;
        fileName85 = "UNDLM_00085_AVEC_POIGNEES.mov";
        logImportSuccess(85, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00085_AVEC_POIGNEES.mov", fileName85);
    } catch (e) {
        logImportError(85, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00085_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess85 && editFileBis85.exists) {
    try {
        var editFootage85 = project.importFile(new ImportOptions(editFileBis85));
        editFootage85.parentFolder = fromEditFolder;
        editFootage85.name = "UNDLM_00085bis";
        editSources[85] = editFootage85;
        editImportCount++;
        importSuccess85 = true;
        fileName85 = "UNDLM_00085bis.mov";
        logImportSuccess(85, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00085bis.mov", fileName85);
    } catch (e) {
        logImportError(85, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00085bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess85) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00085.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00086
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile86 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00086.mov");
var editFilePoignees86 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00086_AVEC_POIGNEES.mov");
var editFileBis86 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00086bis.mov");

var importSuccess86 = false;
var fileName86 = "";

// Tenter import standard
if (editFile86.exists) {
    try {
        var editFootage86 = project.importFile(new ImportOptions(editFile86));
        editFootage86.parentFolder = fromEditFolder;
        editFootage86.name = "UNDLM_00086";
        editSources[86] = editFootage86;
        editImportCount++;
        importSuccess86 = true;
        fileName86 = "UNDLM_00086.mov";
        logImportSuccess(86, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00086.mov", fileName86);
    } catch (e) {
        logImportError(86, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00086.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess86 && editFilePoignees86.exists) {
    try {
        var editFootage86 = project.importFile(new ImportOptions(editFilePoignees86));
        editFootage86.parentFolder = fromEditFolder;
        editFootage86.name = "UNDLM_00086_AVEC_POIGNEES";
        editSources[86] = editFootage86;
        editImportCount++;
        importSuccess86 = true;
        fileName86 = "UNDLM_00086_AVEC_POIGNEES.mov";
        logImportSuccess(86, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00086_AVEC_POIGNEES.mov", fileName86);
    } catch (e) {
        logImportError(86, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00086_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess86 && editFileBis86.exists) {
    try {
        var editFootage86 = project.importFile(new ImportOptions(editFileBis86));
        editFootage86.parentFolder = fromEditFolder;
        editFootage86.name = "UNDLM_00086bis";
        editSources[86] = editFootage86;
        editImportCount++;
        importSuccess86 = true;
        fileName86 = "UNDLM_00086bis.mov";
        logImportSuccess(86, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00086bis.mov", fileName86);
    } catch (e) {
        logImportError(86, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00086bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess86) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00086.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00087
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile87 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00087.mov");
var editFilePoignees87 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00087_AVEC_POIGNEES.mov");
var editFileBis87 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00087bis.mov");

var importSuccess87 = false;
var fileName87 = "";

// Tenter import standard
if (editFile87.exists) {
    try {
        var editFootage87 = project.importFile(new ImportOptions(editFile87));
        editFootage87.parentFolder = fromEditFolder;
        editFootage87.name = "UNDLM_00087";
        editSources[87] = editFootage87;
        editImportCount++;
        importSuccess87 = true;
        fileName87 = "UNDLM_00087.mov";
        logImportSuccess(87, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00087.mov", fileName87);
    } catch (e) {
        logImportError(87, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00087.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess87 && editFilePoignees87.exists) {
    try {
        var editFootage87 = project.importFile(new ImportOptions(editFilePoignees87));
        editFootage87.parentFolder = fromEditFolder;
        editFootage87.name = "UNDLM_00087_AVEC_POIGNEES";
        editSources[87] = editFootage87;
        editImportCount++;
        importSuccess87 = true;
        fileName87 = "UNDLM_00087_AVEC_POIGNEES.mov";
        logImportSuccess(87, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00087_AVEC_POIGNEES.mov", fileName87);
    } catch (e) {
        logImportError(87, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00087_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess87 && editFileBis87.exists) {
    try {
        var editFootage87 = project.importFile(new ImportOptions(editFileBis87));
        editFootage87.parentFolder = fromEditFolder;
        editFootage87.name = "UNDLM_00087bis";
        editSources[87] = editFootage87;
        editImportCount++;
        importSuccess87 = true;
        fileName87 = "UNDLM_00087bis.mov";
        logImportSuccess(87, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00087bis.mov", fileName87);
    } catch (e) {
        logImportError(87, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00087bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess87) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00087.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00088
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile88 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00088.mov");
var editFilePoignees88 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00088_AVEC_POIGNEES.mov");
var editFileBis88 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00088bis.mov");

var importSuccess88 = false;
var fileName88 = "";

// Tenter import standard
if (editFile88.exists) {
    try {
        var editFootage88 = project.importFile(new ImportOptions(editFile88));
        editFootage88.parentFolder = fromEditFolder;
        editFootage88.name = "UNDLM_00088";
        editSources[88] = editFootage88;
        editImportCount++;
        importSuccess88 = true;
        fileName88 = "UNDLM_00088.mov";
        logImportSuccess(88, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00088.mov", fileName88);
    } catch (e) {
        logImportError(88, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00088.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess88 && editFilePoignees88.exists) {
    try {
        var editFootage88 = project.importFile(new ImportOptions(editFilePoignees88));
        editFootage88.parentFolder = fromEditFolder;
        editFootage88.name = "UNDLM_00088_AVEC_POIGNEES";
        editSources[88] = editFootage88;
        editImportCount++;
        importSuccess88 = true;
        fileName88 = "UNDLM_00088_AVEC_POIGNEES.mov";
        logImportSuccess(88, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00088_AVEC_POIGNEES.mov", fileName88);
    } catch (e) {
        logImportError(88, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00088_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess88 && editFileBis88.exists) {
    try {
        var editFootage88 = project.importFile(new ImportOptions(editFileBis88));
        editFootage88.parentFolder = fromEditFolder;
        editFootage88.name = "UNDLM_00088bis";
        editSources[88] = editFootage88;
        editImportCount++;
        importSuccess88 = true;
        fileName88 = "UNDLM_00088bis.mov";
        logImportSuccess(88, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00088bis.mov", fileName88);
    } catch (e) {
        logImportError(88, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00088bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess88) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00088.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00089
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile89 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00089.mov");
var editFilePoignees89 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00089_AVEC_POIGNEES.mov");
var editFileBis89 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00089bis.mov");

var importSuccess89 = false;
var fileName89 = "";

// Tenter import standard
if (editFile89.exists) {
    try {
        var editFootage89 = project.importFile(new ImportOptions(editFile89));
        editFootage89.parentFolder = fromEditFolder;
        editFootage89.name = "UNDLM_00089";
        editSources[89] = editFootage89;
        editImportCount++;
        importSuccess89 = true;
        fileName89 = "UNDLM_00089.mov";
        logImportSuccess(89, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00089.mov", fileName89);
    } catch (e) {
        logImportError(89, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00089.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess89 && editFilePoignees89.exists) {
    try {
        var editFootage89 = project.importFile(new ImportOptions(editFilePoignees89));
        editFootage89.parentFolder = fromEditFolder;
        editFootage89.name = "UNDLM_00089_AVEC_POIGNEES";
        editSources[89] = editFootage89;
        editImportCount++;
        importSuccess89 = true;
        fileName89 = "UNDLM_00089_AVEC_POIGNEES.mov";
        logImportSuccess(89, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00089_AVEC_POIGNEES.mov", fileName89);
    } catch (e) {
        logImportError(89, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00089_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess89 && editFileBis89.exists) {
    try {
        var editFootage89 = project.importFile(new ImportOptions(editFileBis89));
        editFootage89.parentFolder = fromEditFolder;
        editFootage89.name = "UNDLM_00089bis";
        editSources[89] = editFootage89;
        editImportCount++;
        importSuccess89 = true;
        fileName89 = "UNDLM_00089bis.mov";
        logImportSuccess(89, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00089bis.mov", fileName89);
    } catch (e) {
        logImportError(89, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00089bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess89) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00089.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00090
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile90 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00090.mov");
var editFilePoignees90 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00090_AVEC_POIGNEES.mov");
var editFileBis90 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00090bis.mov");

var importSuccess90 = false;
var fileName90 = "";

// Tenter import standard
if (editFile90.exists) {
    try {
        var editFootage90 = project.importFile(new ImportOptions(editFile90));
        editFootage90.parentFolder = fromEditFolder;
        editFootage90.name = "UNDLM_00090";
        editSources[90] = editFootage90;
        editImportCount++;
        importSuccess90 = true;
        fileName90 = "UNDLM_00090.mov";
        logImportSuccess(90, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00090.mov", fileName90);
    } catch (e) {
        logImportError(90, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00090.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess90 && editFilePoignees90.exists) {
    try {
        var editFootage90 = project.importFile(new ImportOptions(editFilePoignees90));
        editFootage90.parentFolder = fromEditFolder;
        editFootage90.name = "UNDLM_00090_AVEC_POIGNEES";
        editSources[90] = editFootage90;
        editImportCount++;
        importSuccess90 = true;
        fileName90 = "UNDLM_00090_AVEC_POIGNEES.mov";
        logImportSuccess(90, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00090_AVEC_POIGNEES.mov", fileName90);
    } catch (e) {
        logImportError(90, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00090_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess90 && editFileBis90.exists) {
    try {
        var editFootage90 = project.importFile(new ImportOptions(editFileBis90));
        editFootage90.parentFolder = fromEditFolder;
        editFootage90.name = "UNDLM_00090bis";
        editSources[90] = editFootage90;
        editImportCount++;
        importSuccess90 = true;
        fileName90 = "UNDLM_00090bis.mov";
        logImportSuccess(90, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00090bis.mov", fileName90);
    } catch (e) {
        logImportError(90, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00090bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess90) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00090.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00091
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile91 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00091.mov");
var editFilePoignees91 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00091_AVEC_POIGNEES.mov");
var editFileBis91 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00091bis.mov");

var importSuccess91 = false;
var fileName91 = "";

// Tenter import standard
if (editFile91.exists) {
    try {
        var editFootage91 = project.importFile(new ImportOptions(editFile91));
        editFootage91.parentFolder = fromEditFolder;
        editFootage91.name = "UNDLM_00091";
        editSources[91] = editFootage91;
        editImportCount++;
        importSuccess91 = true;
        fileName91 = "UNDLM_00091.mov";
        logImportSuccess(91, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00091.mov", fileName91);
    } catch (e) {
        logImportError(91, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00091.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess91 && editFilePoignees91.exists) {
    try {
        var editFootage91 = project.importFile(new ImportOptions(editFilePoignees91));
        editFootage91.parentFolder = fromEditFolder;
        editFootage91.name = "UNDLM_00091_AVEC_POIGNEES";
        editSources[91] = editFootage91;
        editImportCount++;
        importSuccess91 = true;
        fileName91 = "UNDLM_00091_AVEC_POIGNEES.mov";
        logImportSuccess(91, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00091_AVEC_POIGNEES.mov", fileName91);
    } catch (e) {
        logImportError(91, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00091_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess91 && editFileBis91.exists) {
    try {
        var editFootage91 = project.importFile(new ImportOptions(editFileBis91));
        editFootage91.parentFolder = fromEditFolder;
        editFootage91.name = "UNDLM_00091bis";
        editSources[91] = editFootage91;
        editImportCount++;
        importSuccess91 = true;
        fileName91 = "UNDLM_00091bis.mov";
        logImportSuccess(91, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00091bis.mov", fileName91);
    } catch (e) {
        logImportError(91, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00091bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess91) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00091.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00092
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile92 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00092.mov");
var editFilePoignees92 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00092_AVEC_POIGNEES.mov");
var editFileBis92 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00092bis.mov");

var importSuccess92 = false;
var fileName92 = "";

// Tenter import standard
if (editFile92.exists) {
    try {
        var editFootage92 = project.importFile(new ImportOptions(editFile92));
        editFootage92.parentFolder = fromEditFolder;
        editFootage92.name = "UNDLM_00092";
        editSources[92] = editFootage92;
        editImportCount++;
        importSuccess92 = true;
        fileName92 = "UNDLM_00092.mov";
        logImportSuccess(92, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00092.mov", fileName92);
    } catch (e) {
        logImportError(92, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00092.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess92 && editFilePoignees92.exists) {
    try {
        var editFootage92 = project.importFile(new ImportOptions(editFilePoignees92));
        editFootage92.parentFolder = fromEditFolder;
        editFootage92.name = "UNDLM_00092_AVEC_POIGNEES";
        editSources[92] = editFootage92;
        editImportCount++;
        importSuccess92 = true;
        fileName92 = "UNDLM_00092_AVEC_POIGNEES.mov";
        logImportSuccess(92, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00092_AVEC_POIGNEES.mov", fileName92);
    } catch (e) {
        logImportError(92, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00092_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess92 && editFileBis92.exists) {
    try {
        var editFootage92 = project.importFile(new ImportOptions(editFileBis92));
        editFootage92.parentFolder = fromEditFolder;
        editFootage92.name = "UNDLM_00092bis";
        editSources[92] = editFootage92;
        editImportCount++;
        importSuccess92 = true;
        fileName92 = "UNDLM_00092bis.mov";
        logImportSuccess(92, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00092bis.mov", fileName92);
    } catch (e) {
        logImportError(92, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00092bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess92) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00092.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00093
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile93 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00093.mov");
var editFilePoignees93 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00093_AVEC_POIGNEES.mov");
var editFileBis93 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00093bis.mov");

var importSuccess93 = false;
var fileName93 = "";

// Tenter import standard
if (editFile93.exists) {
    try {
        var editFootage93 = project.importFile(new ImportOptions(editFile93));
        editFootage93.parentFolder = fromEditFolder;
        editFootage93.name = "UNDLM_00093";
        editSources[93] = editFootage93;
        editImportCount++;
        importSuccess93 = true;
        fileName93 = "UNDLM_00093.mov";
        logImportSuccess(93, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00093.mov", fileName93);
    } catch (e) {
        logImportError(93, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00093.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess93 && editFilePoignees93.exists) {
    try {
        var editFootage93 = project.importFile(new ImportOptions(editFilePoignees93));
        editFootage93.parentFolder = fromEditFolder;
        editFootage93.name = "UNDLM_00093_AVEC_POIGNEES";
        editSources[93] = editFootage93;
        editImportCount++;
        importSuccess93 = true;
        fileName93 = "UNDLM_00093_AVEC_POIGNEES.mov";
        logImportSuccess(93, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00093_AVEC_POIGNEES.mov", fileName93);
    } catch (e) {
        logImportError(93, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00093_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess93 && editFileBis93.exists) {
    try {
        var editFootage93 = project.importFile(new ImportOptions(editFileBis93));
        editFootage93.parentFolder = fromEditFolder;
        editFootage93.name = "UNDLM_00093bis";
        editSources[93] = editFootage93;
        editImportCount++;
        importSuccess93 = true;
        fileName93 = "UNDLM_00093bis.mov";
        logImportSuccess(93, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00093bis.mov", fileName93);
    } catch (e) {
        logImportError(93, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00093bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess93) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00093.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00074
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile74 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00074.mov");
var gradedFilePoignees74 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00074_AVEC_POIGNEES.mov");
var gradedFileBis74 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00074bis.mov");

var gradedImportSuccess74 = false;
var gradedFileName74 = "";

// Tenter import standard
if (gradedFile74.exists) {
    try {
        var gradedFootage74 = project.importFile(new ImportOptions(gradedFile74));
        gradedFootage74.parentFolder = fromGradingFolder;
        gradedFootage74.name = "UNDLM_00074";
        gradingSources[74] = gradedFootage74;
        gradingImportCount++;
        gradedImportSuccess74 = true;
        gradedFileName74 = "UNDLM_00074.mov";
        logImportSuccess(74, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00074.mov", gradedFileName74);
    } catch (e) {
        logImportError(74, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00074.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess74 && gradedFilePoignees74.exists) {
    try {
        var gradedFootage74 = project.importFile(new ImportOptions(gradedFilePoignees74));
        gradedFootage74.parentFolder = fromGradingFolder;
        gradedFootage74.name = "UNDLM_00074_AVEC_POIGNEES";
        gradingSources[74] = gradedFootage74;
        gradingImportCount++;
        gradedImportSuccess74 = true;
        gradedFileName74 = "UNDLM_00074_AVEC_POIGNEES.mov";
        logImportSuccess(74, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00074_AVEC_POIGNEES.mov", gradedFileName74);
    } catch (e) {
        logImportError(74, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00074_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess74 && gradedFileBis74.exists) {
    try {
        var gradedFootage74 = project.importFile(new ImportOptions(gradedFileBis74));
        gradedFootage74.parentFolder = fromGradingFolder;
        gradedFootage74.name = "UNDLM_00074bis";
        gradingSources[74] = gradedFootage74;
        gradingImportCount++;
        gradedImportSuccess74 = true;
        gradedFileName74 = "UNDLM_00074bis.mov";
        logImportSuccess(74, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00074bis.mov", gradedFileName74);
    } catch (e) {
        logImportError(74, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00074bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess74) {
    missingGradingCount++;
}

// Import plan GRADED 00075
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile75 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00075.mov");
var gradedFilePoignees75 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00075_AVEC_POIGNEES.mov");
var gradedFileBis75 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00075bis.mov");

var gradedImportSuccess75 = false;
var gradedFileName75 = "";

// Tenter import standard
if (gradedFile75.exists) {
    try {
        var gradedFootage75 = project.importFile(new ImportOptions(gradedFile75));
        gradedFootage75.parentFolder = fromGradingFolder;
        gradedFootage75.name = "UNDLM_00075";
        gradingSources[75] = gradedFootage75;
        gradingImportCount++;
        gradedImportSuccess75 = true;
        gradedFileName75 = "UNDLM_00075.mov";
        logImportSuccess(75, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00075.mov", gradedFileName75);
    } catch (e) {
        logImportError(75, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00075.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess75 && gradedFilePoignees75.exists) {
    try {
        var gradedFootage75 = project.importFile(new ImportOptions(gradedFilePoignees75));
        gradedFootage75.parentFolder = fromGradingFolder;
        gradedFootage75.name = "UNDLM_00075_AVEC_POIGNEES";
        gradingSources[75] = gradedFootage75;
        gradingImportCount++;
        gradedImportSuccess75 = true;
        gradedFileName75 = "UNDLM_00075_AVEC_POIGNEES.mov";
        logImportSuccess(75, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00075_AVEC_POIGNEES.mov", gradedFileName75);
    } catch (e) {
        logImportError(75, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00075_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess75 && gradedFileBis75.exists) {
    try {
        var gradedFootage75 = project.importFile(new ImportOptions(gradedFileBis75));
        gradedFootage75.parentFolder = fromGradingFolder;
        gradedFootage75.name = "UNDLM_00075bis";
        gradingSources[75] = gradedFootage75;
        gradingImportCount++;
        gradedImportSuccess75 = true;
        gradedFileName75 = "UNDLM_00075bis.mov";
        logImportSuccess(75, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00075bis.mov", gradedFileName75);
    } catch (e) {
        logImportError(75, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00075bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess75) {
    missingGradingCount++;
}

// Import plan GRADED 00076
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile76 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00076.mov");
var gradedFilePoignees76 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00076_AVEC_POIGNEES.mov");
var gradedFileBis76 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00076bis.mov");

var gradedImportSuccess76 = false;
var gradedFileName76 = "";

// Tenter import standard
if (gradedFile76.exists) {
    try {
        var gradedFootage76 = project.importFile(new ImportOptions(gradedFile76));
        gradedFootage76.parentFolder = fromGradingFolder;
        gradedFootage76.name = "UNDLM_00076";
        gradingSources[76] = gradedFootage76;
        gradingImportCount++;
        gradedImportSuccess76 = true;
        gradedFileName76 = "UNDLM_00076.mov";
        logImportSuccess(76, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00076.mov", gradedFileName76);
    } catch (e) {
        logImportError(76, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00076.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess76 && gradedFilePoignees76.exists) {
    try {
        var gradedFootage76 = project.importFile(new ImportOptions(gradedFilePoignees76));
        gradedFootage76.parentFolder = fromGradingFolder;
        gradedFootage76.name = "UNDLM_00076_AVEC_POIGNEES";
        gradingSources[76] = gradedFootage76;
        gradingImportCount++;
        gradedImportSuccess76 = true;
        gradedFileName76 = "UNDLM_00076_AVEC_POIGNEES.mov";
        logImportSuccess(76, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00076_AVEC_POIGNEES.mov", gradedFileName76);
    } catch (e) {
        logImportError(76, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00076_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess76 && gradedFileBis76.exists) {
    try {
        var gradedFootage76 = project.importFile(new ImportOptions(gradedFileBis76));
        gradedFootage76.parentFolder = fromGradingFolder;
        gradedFootage76.name = "UNDLM_00076bis";
        gradingSources[76] = gradedFootage76;
        gradingImportCount++;
        gradedImportSuccess76 = true;
        gradedFileName76 = "UNDLM_00076bis.mov";
        logImportSuccess(76, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00076bis.mov", gradedFileName76);
    } catch (e) {
        logImportError(76, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00076bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess76) {
    missingGradingCount++;
}

// Import plan GRADED 00077
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile77 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00077.mov");
var gradedFilePoignees77 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00077_AVEC_POIGNEES.mov");
var gradedFileBis77 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00077bis.mov");

var gradedImportSuccess77 = false;
var gradedFileName77 = "";

// Tenter import standard
if (gradedFile77.exists) {
    try {
        var gradedFootage77 = project.importFile(new ImportOptions(gradedFile77));
        gradedFootage77.parentFolder = fromGradingFolder;
        gradedFootage77.name = "UNDLM_00077";
        gradingSources[77] = gradedFootage77;
        gradingImportCount++;
        gradedImportSuccess77 = true;
        gradedFileName77 = "UNDLM_00077.mov";
        logImportSuccess(77, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00077.mov", gradedFileName77);
    } catch (e) {
        logImportError(77, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00077.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess77 && gradedFilePoignees77.exists) {
    try {
        var gradedFootage77 = project.importFile(new ImportOptions(gradedFilePoignees77));
        gradedFootage77.parentFolder = fromGradingFolder;
        gradedFootage77.name = "UNDLM_00077_AVEC_POIGNEES";
        gradingSources[77] = gradedFootage77;
        gradingImportCount++;
        gradedImportSuccess77 = true;
        gradedFileName77 = "UNDLM_00077_AVEC_POIGNEES.mov";
        logImportSuccess(77, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00077_AVEC_POIGNEES.mov", gradedFileName77);
    } catch (e) {
        logImportError(77, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00077_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess77 && gradedFileBis77.exists) {
    try {
        var gradedFootage77 = project.importFile(new ImportOptions(gradedFileBis77));
        gradedFootage77.parentFolder = fromGradingFolder;
        gradedFootage77.name = "UNDLM_00077bis";
        gradingSources[77] = gradedFootage77;
        gradingImportCount++;
        gradedImportSuccess77 = true;
        gradedFileName77 = "UNDLM_00077bis.mov";
        logImportSuccess(77, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00077bis.mov", gradedFileName77);
    } catch (e) {
        logImportError(77, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00077bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess77) {
    missingGradingCount++;
}

// Import plan GRADED 00078
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile78 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00078.mov");
var gradedFilePoignees78 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00078_AVEC_POIGNEES.mov");
var gradedFileBis78 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00078bis.mov");

var gradedImportSuccess78 = false;
var gradedFileName78 = "";

// Tenter import standard
if (gradedFile78.exists) {
    try {
        var gradedFootage78 = project.importFile(new ImportOptions(gradedFile78));
        gradedFootage78.parentFolder = fromGradingFolder;
        gradedFootage78.name = "UNDLM_00078";
        gradingSources[78] = gradedFootage78;
        gradingImportCount++;
        gradedImportSuccess78 = true;
        gradedFileName78 = "UNDLM_00078.mov";
        logImportSuccess(78, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00078.mov", gradedFileName78);
    } catch (e) {
        logImportError(78, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00078.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess78 && gradedFilePoignees78.exists) {
    try {
        var gradedFootage78 = project.importFile(new ImportOptions(gradedFilePoignees78));
        gradedFootage78.parentFolder = fromGradingFolder;
        gradedFootage78.name = "UNDLM_00078_AVEC_POIGNEES";
        gradingSources[78] = gradedFootage78;
        gradingImportCount++;
        gradedImportSuccess78 = true;
        gradedFileName78 = "UNDLM_00078_AVEC_POIGNEES.mov";
        logImportSuccess(78, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00078_AVEC_POIGNEES.mov", gradedFileName78);
    } catch (e) {
        logImportError(78, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00078_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess78 && gradedFileBis78.exists) {
    try {
        var gradedFootage78 = project.importFile(new ImportOptions(gradedFileBis78));
        gradedFootage78.parentFolder = fromGradingFolder;
        gradedFootage78.name = "UNDLM_00078bis";
        gradingSources[78] = gradedFootage78;
        gradingImportCount++;
        gradedImportSuccess78 = true;
        gradedFileName78 = "UNDLM_00078bis.mov";
        logImportSuccess(78, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00078bis.mov", gradedFileName78);
    } catch (e) {
        logImportError(78, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00078bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess78) {
    missingGradingCount++;
}

// Import plan GRADED 00079
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile79 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00079.mov");
var gradedFilePoignees79 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00079_AVEC_POIGNEES.mov");
var gradedFileBis79 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00079bis.mov");

var gradedImportSuccess79 = false;
var gradedFileName79 = "";

// Tenter import standard
if (gradedFile79.exists) {
    try {
        var gradedFootage79 = project.importFile(new ImportOptions(gradedFile79));
        gradedFootage79.parentFolder = fromGradingFolder;
        gradedFootage79.name = "UNDLM_00079";
        gradingSources[79] = gradedFootage79;
        gradingImportCount++;
        gradedImportSuccess79 = true;
        gradedFileName79 = "UNDLM_00079.mov";
        logImportSuccess(79, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00079.mov", gradedFileName79);
    } catch (e) {
        logImportError(79, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00079.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess79 && gradedFilePoignees79.exists) {
    try {
        var gradedFootage79 = project.importFile(new ImportOptions(gradedFilePoignees79));
        gradedFootage79.parentFolder = fromGradingFolder;
        gradedFootage79.name = "UNDLM_00079_AVEC_POIGNEES";
        gradingSources[79] = gradedFootage79;
        gradingImportCount++;
        gradedImportSuccess79 = true;
        gradedFileName79 = "UNDLM_00079_AVEC_POIGNEES.mov";
        logImportSuccess(79, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00079_AVEC_POIGNEES.mov", gradedFileName79);
    } catch (e) {
        logImportError(79, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00079_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess79 && gradedFileBis79.exists) {
    try {
        var gradedFootage79 = project.importFile(new ImportOptions(gradedFileBis79));
        gradedFootage79.parentFolder = fromGradingFolder;
        gradedFootage79.name = "UNDLM_00079bis";
        gradingSources[79] = gradedFootage79;
        gradingImportCount++;
        gradedImportSuccess79 = true;
        gradedFileName79 = "UNDLM_00079bis.mov";
        logImportSuccess(79, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00079bis.mov", gradedFileName79);
    } catch (e) {
        logImportError(79, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00079bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess79) {
    missingGradingCount++;
}

// Import plan GRADED 00080
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile80 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00080.mov");
var gradedFilePoignees80 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00080_AVEC_POIGNEES.mov");
var gradedFileBis80 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00080bis.mov");

var gradedImportSuccess80 = false;
var gradedFileName80 = "";

// Tenter import standard
if (gradedFile80.exists) {
    try {
        var gradedFootage80 = project.importFile(new ImportOptions(gradedFile80));
        gradedFootage80.parentFolder = fromGradingFolder;
        gradedFootage80.name = "UNDLM_00080";
        gradingSources[80] = gradedFootage80;
        gradingImportCount++;
        gradedImportSuccess80 = true;
        gradedFileName80 = "UNDLM_00080.mov";
        logImportSuccess(80, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00080.mov", gradedFileName80);
    } catch (e) {
        logImportError(80, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00080.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess80 && gradedFilePoignees80.exists) {
    try {
        var gradedFootage80 = project.importFile(new ImportOptions(gradedFilePoignees80));
        gradedFootage80.parentFolder = fromGradingFolder;
        gradedFootage80.name = "UNDLM_00080_AVEC_POIGNEES";
        gradingSources[80] = gradedFootage80;
        gradingImportCount++;
        gradedImportSuccess80 = true;
        gradedFileName80 = "UNDLM_00080_AVEC_POIGNEES.mov";
        logImportSuccess(80, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00080_AVEC_POIGNEES.mov", gradedFileName80);
    } catch (e) {
        logImportError(80, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00080_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess80 && gradedFileBis80.exists) {
    try {
        var gradedFootage80 = project.importFile(new ImportOptions(gradedFileBis80));
        gradedFootage80.parentFolder = fromGradingFolder;
        gradedFootage80.name = "UNDLM_00080bis";
        gradingSources[80] = gradedFootage80;
        gradingImportCount++;
        gradedImportSuccess80 = true;
        gradedFileName80 = "UNDLM_00080bis.mov";
        logImportSuccess(80, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00080bis.mov", gradedFileName80);
    } catch (e) {
        logImportError(80, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00080bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess80) {
    missingGradingCount++;
}

// Import plan GRADED 00081
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile81 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00081.mov");
var gradedFilePoignees81 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00081_AVEC_POIGNEES.mov");
var gradedFileBis81 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00081bis.mov");

var gradedImportSuccess81 = false;
var gradedFileName81 = "";

// Tenter import standard
if (gradedFile81.exists) {
    try {
        var gradedFootage81 = project.importFile(new ImportOptions(gradedFile81));
        gradedFootage81.parentFolder = fromGradingFolder;
        gradedFootage81.name = "UNDLM_00081";
        gradingSources[81] = gradedFootage81;
        gradingImportCount++;
        gradedImportSuccess81 = true;
        gradedFileName81 = "UNDLM_00081.mov";
        logImportSuccess(81, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00081.mov", gradedFileName81);
    } catch (e) {
        logImportError(81, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00081.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess81 && gradedFilePoignees81.exists) {
    try {
        var gradedFootage81 = project.importFile(new ImportOptions(gradedFilePoignees81));
        gradedFootage81.parentFolder = fromGradingFolder;
        gradedFootage81.name = "UNDLM_00081_AVEC_POIGNEES";
        gradingSources[81] = gradedFootage81;
        gradingImportCount++;
        gradedImportSuccess81 = true;
        gradedFileName81 = "UNDLM_00081_AVEC_POIGNEES.mov";
        logImportSuccess(81, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00081_AVEC_POIGNEES.mov", gradedFileName81);
    } catch (e) {
        logImportError(81, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00081_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess81 && gradedFileBis81.exists) {
    try {
        var gradedFootage81 = project.importFile(new ImportOptions(gradedFileBis81));
        gradedFootage81.parentFolder = fromGradingFolder;
        gradedFootage81.name = "UNDLM_00081bis";
        gradingSources[81] = gradedFootage81;
        gradingImportCount++;
        gradedImportSuccess81 = true;
        gradedFileName81 = "UNDLM_00081bis.mov";
        logImportSuccess(81, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00081bis.mov", gradedFileName81);
    } catch (e) {
        logImportError(81, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00081bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess81) {
    missingGradingCount++;
}

// Import plan GRADED 00082
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile82 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00082.mov");
var gradedFilePoignees82 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00082_AVEC_POIGNEES.mov");
var gradedFileBis82 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00082bis.mov");

var gradedImportSuccess82 = false;
var gradedFileName82 = "";

// Tenter import standard
if (gradedFile82.exists) {
    try {
        var gradedFootage82 = project.importFile(new ImportOptions(gradedFile82));
        gradedFootage82.parentFolder = fromGradingFolder;
        gradedFootage82.name = "UNDLM_00082";
        gradingSources[82] = gradedFootage82;
        gradingImportCount++;
        gradedImportSuccess82 = true;
        gradedFileName82 = "UNDLM_00082.mov";
        logImportSuccess(82, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00082.mov", gradedFileName82);
    } catch (e) {
        logImportError(82, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00082.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess82 && gradedFilePoignees82.exists) {
    try {
        var gradedFootage82 = project.importFile(new ImportOptions(gradedFilePoignees82));
        gradedFootage82.parentFolder = fromGradingFolder;
        gradedFootage82.name = "UNDLM_00082_AVEC_POIGNEES";
        gradingSources[82] = gradedFootage82;
        gradingImportCount++;
        gradedImportSuccess82 = true;
        gradedFileName82 = "UNDLM_00082_AVEC_POIGNEES.mov";
        logImportSuccess(82, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00082_AVEC_POIGNEES.mov", gradedFileName82);
    } catch (e) {
        logImportError(82, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00082_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess82 && gradedFileBis82.exists) {
    try {
        var gradedFootage82 = project.importFile(new ImportOptions(gradedFileBis82));
        gradedFootage82.parentFolder = fromGradingFolder;
        gradedFootage82.name = "UNDLM_00082bis";
        gradingSources[82] = gradedFootage82;
        gradingImportCount++;
        gradedImportSuccess82 = true;
        gradedFileName82 = "UNDLM_00082bis.mov";
        logImportSuccess(82, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00082bis.mov", gradedFileName82);
    } catch (e) {
        logImportError(82, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00082bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess82) {
    missingGradingCount++;
}

// Import plan GRADED 00083
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile83 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00083.mov");
var gradedFilePoignees83 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00083_AVEC_POIGNEES.mov");
var gradedFileBis83 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00083bis.mov");

var gradedImportSuccess83 = false;
var gradedFileName83 = "";

// Tenter import standard
if (gradedFile83.exists) {
    try {
        var gradedFootage83 = project.importFile(new ImportOptions(gradedFile83));
        gradedFootage83.parentFolder = fromGradingFolder;
        gradedFootage83.name = "UNDLM_00083";
        gradingSources[83] = gradedFootage83;
        gradingImportCount++;
        gradedImportSuccess83 = true;
        gradedFileName83 = "UNDLM_00083.mov";
        logImportSuccess(83, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00083.mov", gradedFileName83);
    } catch (e) {
        logImportError(83, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00083.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess83 && gradedFilePoignees83.exists) {
    try {
        var gradedFootage83 = project.importFile(new ImportOptions(gradedFilePoignees83));
        gradedFootage83.parentFolder = fromGradingFolder;
        gradedFootage83.name = "UNDLM_00083_AVEC_POIGNEES";
        gradingSources[83] = gradedFootage83;
        gradingImportCount++;
        gradedImportSuccess83 = true;
        gradedFileName83 = "UNDLM_00083_AVEC_POIGNEES.mov";
        logImportSuccess(83, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00083_AVEC_POIGNEES.mov", gradedFileName83);
    } catch (e) {
        logImportError(83, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00083_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess83 && gradedFileBis83.exists) {
    try {
        var gradedFootage83 = project.importFile(new ImportOptions(gradedFileBis83));
        gradedFootage83.parentFolder = fromGradingFolder;
        gradedFootage83.name = "UNDLM_00083bis";
        gradingSources[83] = gradedFootage83;
        gradingImportCount++;
        gradedImportSuccess83 = true;
        gradedFileName83 = "UNDLM_00083bis.mov";
        logImportSuccess(83, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00083bis.mov", gradedFileName83);
    } catch (e) {
        logImportError(83, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00083bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess83) {
    missingGradingCount++;
}

// Import plan GRADED 00084
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile84 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00084.mov");
var gradedFilePoignees84 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00084_AVEC_POIGNEES.mov");
var gradedFileBis84 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00084bis.mov");

var gradedImportSuccess84 = false;
var gradedFileName84 = "";

// Tenter import standard
if (gradedFile84.exists) {
    try {
        var gradedFootage84 = project.importFile(new ImportOptions(gradedFile84));
        gradedFootage84.parentFolder = fromGradingFolder;
        gradedFootage84.name = "UNDLM_00084";
        gradingSources[84] = gradedFootage84;
        gradingImportCount++;
        gradedImportSuccess84 = true;
        gradedFileName84 = "UNDLM_00084.mov";
        logImportSuccess(84, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00084.mov", gradedFileName84);
    } catch (e) {
        logImportError(84, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00084.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess84 && gradedFilePoignees84.exists) {
    try {
        var gradedFootage84 = project.importFile(new ImportOptions(gradedFilePoignees84));
        gradedFootage84.parentFolder = fromGradingFolder;
        gradedFootage84.name = "UNDLM_00084_AVEC_POIGNEES";
        gradingSources[84] = gradedFootage84;
        gradingImportCount++;
        gradedImportSuccess84 = true;
        gradedFileName84 = "UNDLM_00084_AVEC_POIGNEES.mov";
        logImportSuccess(84, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00084_AVEC_POIGNEES.mov", gradedFileName84);
    } catch (e) {
        logImportError(84, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00084_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess84 && gradedFileBis84.exists) {
    try {
        var gradedFootage84 = project.importFile(new ImportOptions(gradedFileBis84));
        gradedFootage84.parentFolder = fromGradingFolder;
        gradedFootage84.name = "UNDLM_00084bis";
        gradingSources[84] = gradedFootage84;
        gradingImportCount++;
        gradedImportSuccess84 = true;
        gradedFileName84 = "UNDLM_00084bis.mov";
        logImportSuccess(84, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00084bis.mov", gradedFileName84);
    } catch (e) {
        logImportError(84, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00084bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess84) {
    missingGradingCount++;
}

// Import plan GRADED 00085
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile85 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00085.mov");
var gradedFilePoignees85 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00085_AVEC_POIGNEES.mov");
var gradedFileBis85 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00085bis.mov");

var gradedImportSuccess85 = false;
var gradedFileName85 = "";

// Tenter import standard
if (gradedFile85.exists) {
    try {
        var gradedFootage85 = project.importFile(new ImportOptions(gradedFile85));
        gradedFootage85.parentFolder = fromGradingFolder;
        gradedFootage85.name = "UNDLM_00085";
        gradingSources[85] = gradedFootage85;
        gradingImportCount++;
        gradedImportSuccess85 = true;
        gradedFileName85 = "UNDLM_00085.mov";
        logImportSuccess(85, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00085.mov", gradedFileName85);
    } catch (e) {
        logImportError(85, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00085.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess85 && gradedFilePoignees85.exists) {
    try {
        var gradedFootage85 = project.importFile(new ImportOptions(gradedFilePoignees85));
        gradedFootage85.parentFolder = fromGradingFolder;
        gradedFootage85.name = "UNDLM_00085_AVEC_POIGNEES";
        gradingSources[85] = gradedFootage85;
        gradingImportCount++;
        gradedImportSuccess85 = true;
        gradedFileName85 = "UNDLM_00085_AVEC_POIGNEES.mov";
        logImportSuccess(85, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00085_AVEC_POIGNEES.mov", gradedFileName85);
    } catch (e) {
        logImportError(85, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00085_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess85 && gradedFileBis85.exists) {
    try {
        var gradedFootage85 = project.importFile(new ImportOptions(gradedFileBis85));
        gradedFootage85.parentFolder = fromGradingFolder;
        gradedFootage85.name = "UNDLM_00085bis";
        gradingSources[85] = gradedFootage85;
        gradingImportCount++;
        gradedImportSuccess85 = true;
        gradedFileName85 = "UNDLM_00085bis.mov";
        logImportSuccess(85, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00085bis.mov", gradedFileName85);
    } catch (e) {
        logImportError(85, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00085bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess85) {
    missingGradingCount++;
}

// Import plan GRADED 00086
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile86 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00086.mov");
var gradedFilePoignees86 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00086_AVEC_POIGNEES.mov");
var gradedFileBis86 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00086bis.mov");

var gradedImportSuccess86 = false;
var gradedFileName86 = "";

// Tenter import standard
if (gradedFile86.exists) {
    try {
        var gradedFootage86 = project.importFile(new ImportOptions(gradedFile86));
        gradedFootage86.parentFolder = fromGradingFolder;
        gradedFootage86.name = "UNDLM_00086";
        gradingSources[86] = gradedFootage86;
        gradingImportCount++;
        gradedImportSuccess86 = true;
        gradedFileName86 = "UNDLM_00086.mov";
        logImportSuccess(86, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00086.mov", gradedFileName86);
    } catch (e) {
        logImportError(86, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00086.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess86 && gradedFilePoignees86.exists) {
    try {
        var gradedFootage86 = project.importFile(new ImportOptions(gradedFilePoignees86));
        gradedFootage86.parentFolder = fromGradingFolder;
        gradedFootage86.name = "UNDLM_00086_AVEC_POIGNEES";
        gradingSources[86] = gradedFootage86;
        gradingImportCount++;
        gradedImportSuccess86 = true;
        gradedFileName86 = "UNDLM_00086_AVEC_POIGNEES.mov";
        logImportSuccess(86, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00086_AVEC_POIGNEES.mov", gradedFileName86);
    } catch (e) {
        logImportError(86, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00086_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess86 && gradedFileBis86.exists) {
    try {
        var gradedFootage86 = project.importFile(new ImportOptions(gradedFileBis86));
        gradedFootage86.parentFolder = fromGradingFolder;
        gradedFootage86.name = "UNDLM_00086bis";
        gradingSources[86] = gradedFootage86;
        gradingImportCount++;
        gradedImportSuccess86 = true;
        gradedFileName86 = "UNDLM_00086bis.mov";
        logImportSuccess(86, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00086bis.mov", gradedFileName86);
    } catch (e) {
        logImportError(86, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00086bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess86) {
    missingGradingCount++;
}

// Import plan GRADED 00087
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile87 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00087.mov");
var gradedFilePoignees87 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00087_AVEC_POIGNEES.mov");
var gradedFileBis87 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00087bis.mov");

var gradedImportSuccess87 = false;
var gradedFileName87 = "";

// Tenter import standard
if (gradedFile87.exists) {
    try {
        var gradedFootage87 = project.importFile(new ImportOptions(gradedFile87));
        gradedFootage87.parentFolder = fromGradingFolder;
        gradedFootage87.name = "UNDLM_00087";
        gradingSources[87] = gradedFootage87;
        gradingImportCount++;
        gradedImportSuccess87 = true;
        gradedFileName87 = "UNDLM_00087.mov";
        logImportSuccess(87, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00087.mov", gradedFileName87);
    } catch (e) {
        logImportError(87, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00087.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess87 && gradedFilePoignees87.exists) {
    try {
        var gradedFootage87 = project.importFile(new ImportOptions(gradedFilePoignees87));
        gradedFootage87.parentFolder = fromGradingFolder;
        gradedFootage87.name = "UNDLM_00087_AVEC_POIGNEES";
        gradingSources[87] = gradedFootage87;
        gradingImportCount++;
        gradedImportSuccess87 = true;
        gradedFileName87 = "UNDLM_00087_AVEC_POIGNEES.mov";
        logImportSuccess(87, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00087_AVEC_POIGNEES.mov", gradedFileName87);
    } catch (e) {
        logImportError(87, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00087_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess87 && gradedFileBis87.exists) {
    try {
        var gradedFootage87 = project.importFile(new ImportOptions(gradedFileBis87));
        gradedFootage87.parentFolder = fromGradingFolder;
        gradedFootage87.name = "UNDLM_00087bis";
        gradingSources[87] = gradedFootage87;
        gradingImportCount++;
        gradedImportSuccess87 = true;
        gradedFileName87 = "UNDLM_00087bis.mov";
        logImportSuccess(87, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00087bis.mov", gradedFileName87);
    } catch (e) {
        logImportError(87, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00087bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess87) {
    missingGradingCount++;
}

// Import plan GRADED 00088
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile88 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00088.mov");
var gradedFilePoignees88 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00088_AVEC_POIGNEES.mov");
var gradedFileBis88 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00088bis.mov");

var gradedImportSuccess88 = false;
var gradedFileName88 = "";

// Tenter import standard
if (gradedFile88.exists) {
    try {
        var gradedFootage88 = project.importFile(new ImportOptions(gradedFile88));
        gradedFootage88.parentFolder = fromGradingFolder;
        gradedFootage88.name = "UNDLM_00088";
        gradingSources[88] = gradedFootage88;
        gradingImportCount++;
        gradedImportSuccess88 = true;
        gradedFileName88 = "UNDLM_00088.mov";
        logImportSuccess(88, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00088.mov", gradedFileName88);
    } catch (e) {
        logImportError(88, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00088.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess88 && gradedFilePoignees88.exists) {
    try {
        var gradedFootage88 = project.importFile(new ImportOptions(gradedFilePoignees88));
        gradedFootage88.parentFolder = fromGradingFolder;
        gradedFootage88.name = "UNDLM_00088_AVEC_POIGNEES";
        gradingSources[88] = gradedFootage88;
        gradingImportCount++;
        gradedImportSuccess88 = true;
        gradedFileName88 = "UNDLM_00088_AVEC_POIGNEES.mov";
        logImportSuccess(88, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00088_AVEC_POIGNEES.mov", gradedFileName88);
    } catch (e) {
        logImportError(88, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00088_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess88 && gradedFileBis88.exists) {
    try {
        var gradedFootage88 = project.importFile(new ImportOptions(gradedFileBis88));
        gradedFootage88.parentFolder = fromGradingFolder;
        gradedFootage88.name = "UNDLM_00088bis";
        gradingSources[88] = gradedFootage88;
        gradingImportCount++;
        gradedImportSuccess88 = true;
        gradedFileName88 = "UNDLM_00088bis.mov";
        logImportSuccess(88, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00088bis.mov", gradedFileName88);
    } catch (e) {
        logImportError(88, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00088bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess88) {
    missingGradingCount++;
}

// Import plan GRADED 00089
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile89 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00089.mov");
var gradedFilePoignees89 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00089_AVEC_POIGNEES.mov");
var gradedFileBis89 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00089bis.mov");

var gradedImportSuccess89 = false;
var gradedFileName89 = "";

// Tenter import standard
if (gradedFile89.exists) {
    try {
        var gradedFootage89 = project.importFile(new ImportOptions(gradedFile89));
        gradedFootage89.parentFolder = fromGradingFolder;
        gradedFootage89.name = "UNDLM_00089";
        gradingSources[89] = gradedFootage89;
        gradingImportCount++;
        gradedImportSuccess89 = true;
        gradedFileName89 = "UNDLM_00089.mov";
        logImportSuccess(89, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00089.mov", gradedFileName89);
    } catch (e) {
        logImportError(89, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00089.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess89 && gradedFilePoignees89.exists) {
    try {
        var gradedFootage89 = project.importFile(new ImportOptions(gradedFilePoignees89));
        gradedFootage89.parentFolder = fromGradingFolder;
        gradedFootage89.name = "UNDLM_00089_AVEC_POIGNEES";
        gradingSources[89] = gradedFootage89;
        gradingImportCount++;
        gradedImportSuccess89 = true;
        gradedFileName89 = "UNDLM_00089_AVEC_POIGNEES.mov";
        logImportSuccess(89, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00089_AVEC_POIGNEES.mov", gradedFileName89);
    } catch (e) {
        logImportError(89, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00089_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess89 && gradedFileBis89.exists) {
    try {
        var gradedFootage89 = project.importFile(new ImportOptions(gradedFileBis89));
        gradedFootage89.parentFolder = fromGradingFolder;
        gradedFootage89.name = "UNDLM_00089bis";
        gradingSources[89] = gradedFootage89;
        gradingImportCount++;
        gradedImportSuccess89 = true;
        gradedFileName89 = "UNDLM_00089bis.mov";
        logImportSuccess(89, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00089bis.mov", gradedFileName89);
    } catch (e) {
        logImportError(89, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00089bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess89) {
    missingGradingCount++;
}

// Import plan GRADED 00090
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile90 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00090.mov");
var gradedFilePoignees90 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00090_AVEC_POIGNEES.mov");
var gradedFileBis90 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00090bis.mov");

var gradedImportSuccess90 = false;
var gradedFileName90 = "";

// Tenter import standard
if (gradedFile90.exists) {
    try {
        var gradedFootage90 = project.importFile(new ImportOptions(gradedFile90));
        gradedFootage90.parentFolder = fromGradingFolder;
        gradedFootage90.name = "UNDLM_00090";
        gradingSources[90] = gradedFootage90;
        gradingImportCount++;
        gradedImportSuccess90 = true;
        gradedFileName90 = "UNDLM_00090.mov";
        logImportSuccess(90, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00090.mov", gradedFileName90);
    } catch (e) {
        logImportError(90, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00090.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess90 && gradedFilePoignees90.exists) {
    try {
        var gradedFootage90 = project.importFile(new ImportOptions(gradedFilePoignees90));
        gradedFootage90.parentFolder = fromGradingFolder;
        gradedFootage90.name = "UNDLM_00090_AVEC_POIGNEES";
        gradingSources[90] = gradedFootage90;
        gradingImportCount++;
        gradedImportSuccess90 = true;
        gradedFileName90 = "UNDLM_00090_AVEC_POIGNEES.mov";
        logImportSuccess(90, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00090_AVEC_POIGNEES.mov", gradedFileName90);
    } catch (e) {
        logImportError(90, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00090_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess90 && gradedFileBis90.exists) {
    try {
        var gradedFootage90 = project.importFile(new ImportOptions(gradedFileBis90));
        gradedFootage90.parentFolder = fromGradingFolder;
        gradedFootage90.name = "UNDLM_00090bis";
        gradingSources[90] = gradedFootage90;
        gradingImportCount++;
        gradedImportSuccess90 = true;
        gradedFileName90 = "UNDLM_00090bis.mov";
        logImportSuccess(90, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00090bis.mov", gradedFileName90);
    } catch (e) {
        logImportError(90, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00090bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess90) {
    missingGradingCount++;
}

// Import plan GRADED 00091
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile91 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00091.mov");
var gradedFilePoignees91 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00091_AVEC_POIGNEES.mov");
var gradedFileBis91 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00091bis.mov");

var gradedImportSuccess91 = false;
var gradedFileName91 = "";

// Tenter import standard
if (gradedFile91.exists) {
    try {
        var gradedFootage91 = project.importFile(new ImportOptions(gradedFile91));
        gradedFootage91.parentFolder = fromGradingFolder;
        gradedFootage91.name = "UNDLM_00091";
        gradingSources[91] = gradedFootage91;
        gradingImportCount++;
        gradedImportSuccess91 = true;
        gradedFileName91 = "UNDLM_00091.mov";
        logImportSuccess(91, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00091.mov", gradedFileName91);
    } catch (e) {
        logImportError(91, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00091.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess91 && gradedFilePoignees91.exists) {
    try {
        var gradedFootage91 = project.importFile(new ImportOptions(gradedFilePoignees91));
        gradedFootage91.parentFolder = fromGradingFolder;
        gradedFootage91.name = "UNDLM_00091_AVEC_POIGNEES";
        gradingSources[91] = gradedFootage91;
        gradingImportCount++;
        gradedImportSuccess91 = true;
        gradedFileName91 = "UNDLM_00091_AVEC_POIGNEES.mov";
        logImportSuccess(91, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00091_AVEC_POIGNEES.mov", gradedFileName91);
    } catch (e) {
        logImportError(91, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00091_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess91 && gradedFileBis91.exists) {
    try {
        var gradedFootage91 = project.importFile(new ImportOptions(gradedFileBis91));
        gradedFootage91.parentFolder = fromGradingFolder;
        gradedFootage91.name = "UNDLM_00091bis";
        gradingSources[91] = gradedFootage91;
        gradingImportCount++;
        gradedImportSuccess91 = true;
        gradedFileName91 = "UNDLM_00091bis.mov";
        logImportSuccess(91, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00091bis.mov", gradedFileName91);
    } catch (e) {
        logImportError(91, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00091bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess91) {
    missingGradingCount++;
}

// Import plan GRADED 00092
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile92 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00092.mov");
var gradedFilePoignees92 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00092_AVEC_POIGNEES.mov");
var gradedFileBis92 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00092bis.mov");

var gradedImportSuccess92 = false;
var gradedFileName92 = "";

// Tenter import standard
if (gradedFile92.exists) {
    try {
        var gradedFootage92 = project.importFile(new ImportOptions(gradedFile92));
        gradedFootage92.parentFolder = fromGradingFolder;
        gradedFootage92.name = "UNDLM_00092";
        gradingSources[92] = gradedFootage92;
        gradingImportCount++;
        gradedImportSuccess92 = true;
        gradedFileName92 = "UNDLM_00092.mov";
        logImportSuccess(92, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00092.mov", gradedFileName92);
    } catch (e) {
        logImportError(92, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00092.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess92 && gradedFilePoignees92.exists) {
    try {
        var gradedFootage92 = project.importFile(new ImportOptions(gradedFilePoignees92));
        gradedFootage92.parentFolder = fromGradingFolder;
        gradedFootage92.name = "UNDLM_00092_AVEC_POIGNEES";
        gradingSources[92] = gradedFootage92;
        gradingImportCount++;
        gradedImportSuccess92 = true;
        gradedFileName92 = "UNDLM_00092_AVEC_POIGNEES.mov";
        logImportSuccess(92, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00092_AVEC_POIGNEES.mov", gradedFileName92);
    } catch (e) {
        logImportError(92, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00092_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess92 && gradedFileBis92.exists) {
    try {
        var gradedFootage92 = project.importFile(new ImportOptions(gradedFileBis92));
        gradedFootage92.parentFolder = fromGradingFolder;
        gradedFootage92.name = "UNDLM_00092bis";
        gradingSources[92] = gradedFootage92;
        gradingImportCount++;
        gradedImportSuccess92 = true;
        gradedFileName92 = "UNDLM_00092bis.mov";
        logImportSuccess(92, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00092bis.mov", gradedFileName92);
    } catch (e) {
        logImportError(92, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00092bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess92) {
    missingGradingCount++;
}

// Import plan GRADED 00093
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile93 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00093.mov");
var gradedFilePoignees93 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00093_AVEC_POIGNEES.mov");
var gradedFileBis93 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00093bis.mov");

var gradedImportSuccess93 = false;
var gradedFileName93 = "";

// Tenter import standard
if (gradedFile93.exists) {
    try {
        var gradedFootage93 = project.importFile(new ImportOptions(gradedFile93));
        gradedFootage93.parentFolder = fromGradingFolder;
        gradedFootage93.name = "UNDLM_00093";
        gradingSources[93] = gradedFootage93;
        gradingImportCount++;
        gradedImportSuccess93 = true;
        gradedFileName93 = "UNDLM_00093.mov";
        logImportSuccess(93, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00093.mov", gradedFileName93);
    } catch (e) {
        logImportError(93, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00093.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess93 && gradedFilePoignees93.exists) {
    try {
        var gradedFootage93 = project.importFile(new ImportOptions(gradedFilePoignees93));
        gradedFootage93.parentFolder = fromGradingFolder;
        gradedFootage93.name = "UNDLM_00093_AVEC_POIGNEES";
        gradingSources[93] = gradedFootage93;
        gradingImportCount++;
        gradedImportSuccess93 = true;
        gradedFileName93 = "UNDLM_00093_AVEC_POIGNEES.mov";
        logImportSuccess(93, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00093_AVEC_POIGNEES.mov", gradedFileName93);
    } catch (e) {
        logImportError(93, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00093_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess93 && gradedFileBis93.exists) {
    try {
        var gradedFootage93 = project.importFile(new ImportOptions(gradedFileBis93));
        gradedFootage93.parentFolder = fromGradingFolder;
        gradedFootage93.name = "UNDLM_00093bis";
        gradingSources[93] = gradedFootage93;
        gradingImportCount++;
        gradedImportSuccess93 = true;
        gradedFileName93 = "UNDLM_00093bis.mov";
        logImportSuccess(93, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00093bis.mov", gradedFileName93);
    } catch (e) {
        logImportError(93, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00093bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess93) {
    missingGradingCount++;
}

// ==========================================
// RAPPORT FINAL CONCIS
// ==========================================

// Créer le rapport final simplifié
var finalReport = "📊 IMPORT TERMINÉ:\n\n";
finalReport += "✅ Plans EDIT: " + editImportCount + "\n";
finalReport += "✅ Plans GRADING: " + gradingImportCount + "\n";

// Afficher les erreurs seulement s'il y en a
if (missingEditCount > 0) {
    finalReport += "❌ Plans EDIT manqués: " + missingEditCount + "\n";
}

if (importErrors.length > 0) {
    finalReport += "\n❌ ERREURS CRITIQUES:\n";
    for (var i = 0; i < Math.min(importErrors.length, 3); i++) {
        var err = importErrors[i];
        finalReport += "• Plan " + err.plan + " (" + err.type + ")\n";
    }
    if (importErrors.length > 3) {
        finalReport += "... et " + (importErrors.length - 3) + " autres\n";
    }
}

// Afficher le rapport final seulement si nécessaire
if (missingEditCount > 0 || importErrors.length > 0) {
    alert(finalReport);
}



// ==========================================
// 3. CRÉATION DES COMPOSITIONS DE PLANS
// ==========================================

// Array pour stocker les compositions de plans
var planCompositions = {};

// Créer une composition de solid réutilisable dans WORK_LAYERS
var bgSolidComp = project.items.addComp("BG_SOLID_BLACK", 2560, 1440, 1.0, 10.0, 25);
bgSolidComp.parentFolder = workLayersFolder;
var bgSolidLayer = bgSolidComp.layers.addSolid([0.05, 0.05, 0.05], "BG_SOLID", 2560, 1440, 1.0);


// Composition pour plan 00074
var planComp74 = project.items.addComp(
    "SQ03_UNDLM_00074_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp74.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer74 = planComp74.layers.add(bgSolidComp);
bgLayer74.name = "BG_SOLID";
bgLayer74.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer74 = false;
if (gradingSources[74]) {
    var gradedLayer74 = planComp74.layers.add(gradingSources[74]);
    gradedLayer74.name = "UNDLM_00074_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer74.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer74.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer74 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer74 = false;
if (editSources[74]) {
    var editLayer74 = planComp74.layers.add(editSources[74]);
    editLayer74.name = "UNDLM_00074_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer74.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer74.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer74 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity74 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer74) {
    // EDIT toujours activé quand disponible
    editLayer74.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer74) {
        gradedLayer74.enabled = false;
    }
} else if (hasGradedLayer74) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer74.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText74 = planComp74.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText74.name = "WARNING_NO_EDIT";
    warningText74.property("Transform").property("Position").setValue([1280, 200]);
    warningText74.guideLayer = true;
    
    var warningTextDoc74 = warningText74.property("Source Text").value;
    warningTextDoc74.fontSize = 32;
    warningTextDoc74.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc74.font = "Arial-BoldMT";
    warningTextDoc74.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText74.property("Source Text").setValue(warningTextDoc74);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText74 = planComp74.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00074");
    errorText74.name = "ERROR_NO_SOURCE";
    errorText74.property("Transform").property("Position").setValue([1280, 720]);
    errorText74.guideLayer = true;
    
    var errorTextDoc74 = errorText74.property("Source Text").value;
    errorTextDoc74.fontSize = 48;
    errorTextDoc74.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc74.font = "Arial-BoldMT";
    errorTextDoc74.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText74.property("Source Text").setValue(errorTextDoc74);
}

planCompositions[74] = planComp74;


// Composition pour plan 00075
var planComp75 = project.items.addComp(
    "SQ03_UNDLM_00075_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp75.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer75 = planComp75.layers.add(bgSolidComp);
bgLayer75.name = "BG_SOLID";
bgLayer75.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer75 = false;
if (gradingSources[75]) {
    var gradedLayer75 = planComp75.layers.add(gradingSources[75]);
    gradedLayer75.name = "UNDLM_00075_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer75.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer75.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer75 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer75 = false;
if (editSources[75]) {
    var editLayer75 = planComp75.layers.add(editSources[75]);
    editLayer75.name = "UNDLM_00075_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer75.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer75.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer75 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity75 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer75) {
    // EDIT toujours activé quand disponible
    editLayer75.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer75) {
        gradedLayer75.enabled = false;
    }
} else if (hasGradedLayer75) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer75.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText75 = planComp75.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText75.name = "WARNING_NO_EDIT";
    warningText75.property("Transform").property("Position").setValue([1280, 200]);
    warningText75.guideLayer = true;
    
    var warningTextDoc75 = warningText75.property("Source Text").value;
    warningTextDoc75.fontSize = 32;
    warningTextDoc75.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc75.font = "Arial-BoldMT";
    warningTextDoc75.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText75.property("Source Text").setValue(warningTextDoc75);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText75 = planComp75.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00075");
    errorText75.name = "ERROR_NO_SOURCE";
    errorText75.property("Transform").property("Position").setValue([1280, 720]);
    errorText75.guideLayer = true;
    
    var errorTextDoc75 = errorText75.property("Source Text").value;
    errorTextDoc75.fontSize = 48;
    errorTextDoc75.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc75.font = "Arial-BoldMT";
    errorTextDoc75.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText75.property("Source Text").setValue(errorTextDoc75);
}

planCompositions[75] = planComp75;


// Composition pour plan 00076
var planComp76 = project.items.addComp(
    "SQ03_UNDLM_00076_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp76.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer76 = planComp76.layers.add(bgSolidComp);
bgLayer76.name = "BG_SOLID";
bgLayer76.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer76 = false;
if (gradingSources[76]) {
    var gradedLayer76 = planComp76.layers.add(gradingSources[76]);
    gradedLayer76.name = "UNDLM_00076_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer76.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer76.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer76 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer76 = false;
if (editSources[76]) {
    var editLayer76 = planComp76.layers.add(editSources[76]);
    editLayer76.name = "UNDLM_00076_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer76.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer76.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer76 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity76 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer76) {
    // EDIT toujours activé quand disponible
    editLayer76.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer76) {
        gradedLayer76.enabled = false;
    }
} else if (hasGradedLayer76) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer76.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText76 = planComp76.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText76.name = "WARNING_NO_EDIT";
    warningText76.property("Transform").property("Position").setValue([1280, 200]);
    warningText76.guideLayer = true;
    
    var warningTextDoc76 = warningText76.property("Source Text").value;
    warningTextDoc76.fontSize = 32;
    warningTextDoc76.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc76.font = "Arial-BoldMT";
    warningTextDoc76.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText76.property("Source Text").setValue(warningTextDoc76);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText76 = planComp76.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00076");
    errorText76.name = "ERROR_NO_SOURCE";
    errorText76.property("Transform").property("Position").setValue([1280, 720]);
    errorText76.guideLayer = true;
    
    var errorTextDoc76 = errorText76.property("Source Text").value;
    errorTextDoc76.fontSize = 48;
    errorTextDoc76.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc76.font = "Arial-BoldMT";
    errorTextDoc76.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText76.property("Source Text").setValue(errorTextDoc76);
}

planCompositions[76] = planComp76;


// Composition pour plan 00077
var planComp77 = project.items.addComp(
    "SQ03_UNDLM_00077_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp77.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer77 = planComp77.layers.add(bgSolidComp);
bgLayer77.name = "BG_SOLID";
bgLayer77.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer77 = false;
if (gradingSources[77]) {
    var gradedLayer77 = planComp77.layers.add(gradingSources[77]);
    gradedLayer77.name = "UNDLM_00077_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer77.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer77.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer77 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer77 = false;
if (editSources[77]) {
    var editLayer77 = planComp77.layers.add(editSources[77]);
    editLayer77.name = "UNDLM_00077_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer77.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer77.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer77 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity77 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer77) {
    // EDIT toujours activé quand disponible
    editLayer77.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer77) {
        gradedLayer77.enabled = false;
    }
} else if (hasGradedLayer77) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer77.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText77 = planComp77.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText77.name = "WARNING_NO_EDIT";
    warningText77.property("Transform").property("Position").setValue([1280, 200]);
    warningText77.guideLayer = true;
    
    var warningTextDoc77 = warningText77.property("Source Text").value;
    warningTextDoc77.fontSize = 32;
    warningTextDoc77.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc77.font = "Arial-BoldMT";
    warningTextDoc77.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText77.property("Source Text").setValue(warningTextDoc77);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText77 = planComp77.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00077");
    errorText77.name = "ERROR_NO_SOURCE";
    errorText77.property("Transform").property("Position").setValue([1280, 720]);
    errorText77.guideLayer = true;
    
    var errorTextDoc77 = errorText77.property("Source Text").value;
    errorTextDoc77.fontSize = 48;
    errorTextDoc77.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc77.font = "Arial-BoldMT";
    errorTextDoc77.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText77.property("Source Text").setValue(errorTextDoc77);
}

planCompositions[77] = planComp77;


// Composition pour plan 00078
var planComp78 = project.items.addComp(
    "SQ03_UNDLM_00078_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp78.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer78 = planComp78.layers.add(bgSolidComp);
bgLayer78.name = "BG_SOLID";
bgLayer78.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer78 = false;
if (gradingSources[78]) {
    var gradedLayer78 = planComp78.layers.add(gradingSources[78]);
    gradedLayer78.name = "UNDLM_00078_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer78.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer78.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer78 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer78 = false;
if (editSources[78]) {
    var editLayer78 = planComp78.layers.add(editSources[78]);
    editLayer78.name = "UNDLM_00078_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer78.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer78.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer78 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity78 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer78) {
    // EDIT toujours activé quand disponible
    editLayer78.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer78) {
        gradedLayer78.enabled = false;
    }
} else if (hasGradedLayer78) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer78.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText78 = planComp78.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText78.name = "WARNING_NO_EDIT";
    warningText78.property("Transform").property("Position").setValue([1280, 200]);
    warningText78.guideLayer = true;
    
    var warningTextDoc78 = warningText78.property("Source Text").value;
    warningTextDoc78.fontSize = 32;
    warningTextDoc78.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc78.font = "Arial-BoldMT";
    warningTextDoc78.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText78.property("Source Text").setValue(warningTextDoc78);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText78 = planComp78.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00078");
    errorText78.name = "ERROR_NO_SOURCE";
    errorText78.property("Transform").property("Position").setValue([1280, 720]);
    errorText78.guideLayer = true;
    
    var errorTextDoc78 = errorText78.property("Source Text").value;
    errorTextDoc78.fontSize = 48;
    errorTextDoc78.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc78.font = "Arial-BoldMT";
    errorTextDoc78.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText78.property("Source Text").setValue(errorTextDoc78);
}

planCompositions[78] = planComp78;


// Composition pour plan 00079
var planComp79 = project.items.addComp(
    "SQ03_UNDLM_00079_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp79.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer79 = planComp79.layers.add(bgSolidComp);
bgLayer79.name = "BG_SOLID";
bgLayer79.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer79 = false;
if (gradingSources[79]) {
    var gradedLayer79 = planComp79.layers.add(gradingSources[79]);
    gradedLayer79.name = "UNDLM_00079_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer79.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer79.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer79 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer79 = false;
if (editSources[79]) {
    var editLayer79 = planComp79.layers.add(editSources[79]);
    editLayer79.name = "UNDLM_00079_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer79.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer79.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer79 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity79 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer79) {
    // EDIT toujours activé quand disponible
    editLayer79.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer79) {
        gradedLayer79.enabled = false;
    }
} else if (hasGradedLayer79) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer79.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText79 = planComp79.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText79.name = "WARNING_NO_EDIT";
    warningText79.property("Transform").property("Position").setValue([1280, 200]);
    warningText79.guideLayer = true;
    
    var warningTextDoc79 = warningText79.property("Source Text").value;
    warningTextDoc79.fontSize = 32;
    warningTextDoc79.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc79.font = "Arial-BoldMT";
    warningTextDoc79.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText79.property("Source Text").setValue(warningTextDoc79);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText79 = planComp79.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00079");
    errorText79.name = "ERROR_NO_SOURCE";
    errorText79.property("Transform").property("Position").setValue([1280, 720]);
    errorText79.guideLayer = true;
    
    var errorTextDoc79 = errorText79.property("Source Text").value;
    errorTextDoc79.fontSize = 48;
    errorTextDoc79.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc79.font = "Arial-BoldMT";
    errorTextDoc79.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText79.property("Source Text").setValue(errorTextDoc79);
}

planCompositions[79] = planComp79;


// Composition pour plan 00080
var planComp80 = project.items.addComp(
    "SQ03_UNDLM_00080_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp80.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer80 = planComp80.layers.add(bgSolidComp);
bgLayer80.name = "BG_SOLID";
bgLayer80.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer80 = false;
if (gradingSources[80]) {
    var gradedLayer80 = planComp80.layers.add(gradingSources[80]);
    gradedLayer80.name = "UNDLM_00080_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer80.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer80.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer80 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer80 = false;
if (editSources[80]) {
    var editLayer80 = planComp80.layers.add(editSources[80]);
    editLayer80.name = "UNDLM_00080_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer80.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer80.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer80 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity80 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer80) {
    // EDIT toujours activé quand disponible
    editLayer80.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer80) {
        gradedLayer80.enabled = false;
    }
} else if (hasGradedLayer80) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer80.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText80 = planComp80.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText80.name = "WARNING_NO_EDIT";
    warningText80.property("Transform").property("Position").setValue([1280, 200]);
    warningText80.guideLayer = true;
    
    var warningTextDoc80 = warningText80.property("Source Text").value;
    warningTextDoc80.fontSize = 32;
    warningTextDoc80.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc80.font = "Arial-BoldMT";
    warningTextDoc80.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText80.property("Source Text").setValue(warningTextDoc80);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText80 = planComp80.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00080");
    errorText80.name = "ERROR_NO_SOURCE";
    errorText80.property("Transform").property("Position").setValue([1280, 720]);
    errorText80.guideLayer = true;
    
    var errorTextDoc80 = errorText80.property("Source Text").value;
    errorTextDoc80.fontSize = 48;
    errorTextDoc80.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc80.font = "Arial-BoldMT";
    errorTextDoc80.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText80.property("Source Text").setValue(errorTextDoc80);
}

planCompositions[80] = planComp80;


// Composition pour plan 00081
var planComp81 = project.items.addComp(
    "SQ03_UNDLM_00081_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp81.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer81 = planComp81.layers.add(bgSolidComp);
bgLayer81.name = "BG_SOLID";
bgLayer81.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer81 = false;
if (gradingSources[81]) {
    var gradedLayer81 = planComp81.layers.add(gradingSources[81]);
    gradedLayer81.name = "UNDLM_00081_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer81.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer81.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer81 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer81 = false;
if (editSources[81]) {
    var editLayer81 = planComp81.layers.add(editSources[81]);
    editLayer81.name = "UNDLM_00081_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer81.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer81.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer81 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity81 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer81) {
    // EDIT toujours activé quand disponible
    editLayer81.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer81) {
        gradedLayer81.enabled = false;
    }
} else if (hasGradedLayer81) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer81.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText81 = planComp81.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText81.name = "WARNING_NO_EDIT";
    warningText81.property("Transform").property("Position").setValue([1280, 200]);
    warningText81.guideLayer = true;
    
    var warningTextDoc81 = warningText81.property("Source Text").value;
    warningTextDoc81.fontSize = 32;
    warningTextDoc81.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc81.font = "Arial-BoldMT";
    warningTextDoc81.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText81.property("Source Text").setValue(warningTextDoc81);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText81 = planComp81.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00081");
    errorText81.name = "ERROR_NO_SOURCE";
    errorText81.property("Transform").property("Position").setValue([1280, 720]);
    errorText81.guideLayer = true;
    
    var errorTextDoc81 = errorText81.property("Source Text").value;
    errorTextDoc81.fontSize = 48;
    errorTextDoc81.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc81.font = "Arial-BoldMT";
    errorTextDoc81.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText81.property("Source Text").setValue(errorTextDoc81);
}

planCompositions[81] = planComp81;


// Composition pour plan 00082
var planComp82 = project.items.addComp(
    "SQ03_UNDLM_00082_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp82.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer82 = planComp82.layers.add(bgSolidComp);
bgLayer82.name = "BG_SOLID";
bgLayer82.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer82 = false;
if (gradingSources[82]) {
    var gradedLayer82 = planComp82.layers.add(gradingSources[82]);
    gradedLayer82.name = "UNDLM_00082_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer82.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer82.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer82 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer82 = false;
if (editSources[82]) {
    var editLayer82 = planComp82.layers.add(editSources[82]);
    editLayer82.name = "UNDLM_00082_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer82.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer82.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer82 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity82 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer82) {
    // EDIT toujours activé quand disponible
    editLayer82.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer82) {
        gradedLayer82.enabled = false;
    }
} else if (hasGradedLayer82) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer82.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText82 = planComp82.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText82.name = "WARNING_NO_EDIT";
    warningText82.property("Transform").property("Position").setValue([1280, 200]);
    warningText82.guideLayer = true;
    
    var warningTextDoc82 = warningText82.property("Source Text").value;
    warningTextDoc82.fontSize = 32;
    warningTextDoc82.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc82.font = "Arial-BoldMT";
    warningTextDoc82.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText82.property("Source Text").setValue(warningTextDoc82);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText82 = planComp82.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00082");
    errorText82.name = "ERROR_NO_SOURCE";
    errorText82.property("Transform").property("Position").setValue([1280, 720]);
    errorText82.guideLayer = true;
    
    var errorTextDoc82 = errorText82.property("Source Text").value;
    errorTextDoc82.fontSize = 48;
    errorTextDoc82.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc82.font = "Arial-BoldMT";
    errorTextDoc82.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText82.property("Source Text").setValue(errorTextDoc82);
}

planCompositions[82] = planComp82;


// Composition pour plan 00083
var planComp83 = project.items.addComp(
    "SQ03_UNDLM_00083_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp83.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer83 = planComp83.layers.add(bgSolidComp);
bgLayer83.name = "BG_SOLID";
bgLayer83.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer83 = false;
if (gradingSources[83]) {
    var gradedLayer83 = planComp83.layers.add(gradingSources[83]);
    gradedLayer83.name = "UNDLM_00083_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer83.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer83.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer83 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer83 = false;
if (editSources[83]) {
    var editLayer83 = planComp83.layers.add(editSources[83]);
    editLayer83.name = "UNDLM_00083_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer83.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer83.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer83 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity83 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer83) {
    // EDIT toujours activé quand disponible
    editLayer83.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer83) {
        gradedLayer83.enabled = false;
    }
} else if (hasGradedLayer83) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer83.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText83 = planComp83.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText83.name = "WARNING_NO_EDIT";
    warningText83.property("Transform").property("Position").setValue([1280, 200]);
    warningText83.guideLayer = true;
    
    var warningTextDoc83 = warningText83.property("Source Text").value;
    warningTextDoc83.fontSize = 32;
    warningTextDoc83.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc83.font = "Arial-BoldMT";
    warningTextDoc83.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText83.property("Source Text").setValue(warningTextDoc83);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText83 = planComp83.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00083");
    errorText83.name = "ERROR_NO_SOURCE";
    errorText83.property("Transform").property("Position").setValue([1280, 720]);
    errorText83.guideLayer = true;
    
    var errorTextDoc83 = errorText83.property("Source Text").value;
    errorTextDoc83.fontSize = 48;
    errorTextDoc83.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc83.font = "Arial-BoldMT";
    errorTextDoc83.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText83.property("Source Text").setValue(errorTextDoc83);
}

planCompositions[83] = planComp83;


// Composition pour plan 00084
var planComp84 = project.items.addComp(
    "SQ03_UNDLM_00084_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp84.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer84 = planComp84.layers.add(bgSolidComp);
bgLayer84.name = "BG_SOLID";
bgLayer84.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer84 = false;
if (gradingSources[84]) {
    var gradedLayer84 = planComp84.layers.add(gradingSources[84]);
    gradedLayer84.name = "UNDLM_00084_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer84.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer84.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer84 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer84 = false;
if (editSources[84]) {
    var editLayer84 = planComp84.layers.add(editSources[84]);
    editLayer84.name = "UNDLM_00084_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer84.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer84.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer84 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity84 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer84) {
    // EDIT toujours activé quand disponible
    editLayer84.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer84) {
        gradedLayer84.enabled = false;
    }
} else if (hasGradedLayer84) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer84.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText84 = planComp84.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText84.name = "WARNING_NO_EDIT";
    warningText84.property("Transform").property("Position").setValue([1280, 200]);
    warningText84.guideLayer = true;
    
    var warningTextDoc84 = warningText84.property("Source Text").value;
    warningTextDoc84.fontSize = 32;
    warningTextDoc84.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc84.font = "Arial-BoldMT";
    warningTextDoc84.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText84.property("Source Text").setValue(warningTextDoc84);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText84 = planComp84.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00084");
    errorText84.name = "ERROR_NO_SOURCE";
    errorText84.property("Transform").property("Position").setValue([1280, 720]);
    errorText84.guideLayer = true;
    
    var errorTextDoc84 = errorText84.property("Source Text").value;
    errorTextDoc84.fontSize = 48;
    errorTextDoc84.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc84.font = "Arial-BoldMT";
    errorTextDoc84.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText84.property("Source Text").setValue(errorTextDoc84);
}

planCompositions[84] = planComp84;


// Composition pour plan 00085
var planComp85 = project.items.addComp(
    "SQ03_UNDLM_00085_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    11.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp85.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer85 = planComp85.layers.add(bgSolidComp);
bgLayer85.name = "BG_SOLID";
bgLayer85.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer85 = false;
if (gradingSources[85]) {
    var gradedLayer85 = planComp85.layers.add(gradingSources[85]);
    gradedLayer85.name = "UNDLM_00085_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer85.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer85.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer85 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer85 = false;
if (editSources[85]) {
    var editLayer85 = planComp85.layers.add(editSources[85]);
    editLayer85.name = "UNDLM_00085_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer85.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer85.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer85 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity85 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer85) {
    // EDIT toujours activé quand disponible
    editLayer85.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer85) {
        gradedLayer85.enabled = false;
    }
} else if (hasGradedLayer85) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer85.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText85 = planComp85.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText85.name = "WARNING_NO_EDIT";
    warningText85.property("Transform").property("Position").setValue([1280, 200]);
    warningText85.guideLayer = true;
    
    var warningTextDoc85 = warningText85.property("Source Text").value;
    warningTextDoc85.fontSize = 32;
    warningTextDoc85.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc85.font = "Arial-BoldMT";
    warningTextDoc85.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText85.property("Source Text").setValue(warningTextDoc85);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText85 = planComp85.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00085");
    errorText85.name = "ERROR_NO_SOURCE";
    errorText85.property("Transform").property("Position").setValue([1280, 720]);
    errorText85.guideLayer = true;
    
    var errorTextDoc85 = errorText85.property("Source Text").value;
    errorTextDoc85.fontSize = 48;
    errorTextDoc85.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc85.font = "Arial-BoldMT";
    errorTextDoc85.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText85.property("Source Text").setValue(errorTextDoc85);
}

planCompositions[85] = planComp85;


// Composition pour plan 00086
var planComp86 = project.items.addComp(
    "SQ03_UNDLM_00086_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.5600000000000005,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp86.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer86 = planComp86.layers.add(bgSolidComp);
bgLayer86.name = "BG_SOLID";
bgLayer86.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer86 = false;
if (gradingSources[86]) {
    var gradedLayer86 = planComp86.layers.add(gradingSources[86]);
    gradedLayer86.name = "UNDLM_00086_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer86.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer86.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer86 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer86 = false;
if (editSources[86]) {
    var editLayer86 = planComp86.layers.add(editSources[86]);
    editLayer86.name = "UNDLM_00086_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer86.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer86.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer86 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity86 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer86) {
    // EDIT toujours activé quand disponible
    editLayer86.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer86) {
        gradedLayer86.enabled = false;
    }
} else if (hasGradedLayer86) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer86.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText86 = planComp86.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText86.name = "WARNING_NO_EDIT";
    warningText86.property("Transform").property("Position").setValue([1280, 200]);
    warningText86.guideLayer = true;
    
    var warningTextDoc86 = warningText86.property("Source Text").value;
    warningTextDoc86.fontSize = 32;
    warningTextDoc86.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc86.font = "Arial-BoldMT";
    warningTextDoc86.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText86.property("Source Text").setValue(warningTextDoc86);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText86 = planComp86.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00086");
    errorText86.name = "ERROR_NO_SOURCE";
    errorText86.property("Transform").property("Position").setValue([1280, 720]);
    errorText86.guideLayer = true;
    
    var errorTextDoc86 = errorText86.property("Source Text").value;
    errorTextDoc86.fontSize = 48;
    errorTextDoc86.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc86.font = "Arial-BoldMT";
    errorTextDoc86.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText86.property("Source Text").setValue(errorTextDoc86);
}

planCompositions[86] = planComp86;


// Composition pour plan 00087
var planComp87 = project.items.addComp(
    "SQ03_UNDLM_00087_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp87.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer87 = planComp87.layers.add(bgSolidComp);
bgLayer87.name = "BG_SOLID";
bgLayer87.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer87 = false;
if (gradingSources[87]) {
    var gradedLayer87 = planComp87.layers.add(gradingSources[87]);
    gradedLayer87.name = "UNDLM_00087_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer87.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer87.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer87 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer87 = false;
if (editSources[87]) {
    var editLayer87 = planComp87.layers.add(editSources[87]);
    editLayer87.name = "UNDLM_00087_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer87.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer87.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer87 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity87 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer87) {
    // EDIT toujours activé quand disponible
    editLayer87.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer87) {
        gradedLayer87.enabled = false;
    }
} else if (hasGradedLayer87) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer87.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText87 = planComp87.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText87.name = "WARNING_NO_EDIT";
    warningText87.property("Transform").property("Position").setValue([1280, 200]);
    warningText87.guideLayer = true;
    
    var warningTextDoc87 = warningText87.property("Source Text").value;
    warningTextDoc87.fontSize = 32;
    warningTextDoc87.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc87.font = "Arial-BoldMT";
    warningTextDoc87.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText87.property("Source Text").setValue(warningTextDoc87);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText87 = planComp87.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00087");
    errorText87.name = "ERROR_NO_SOURCE";
    errorText87.property("Transform").property("Position").setValue([1280, 720]);
    errorText87.guideLayer = true;
    
    var errorTextDoc87 = errorText87.property("Source Text").value;
    errorTextDoc87.fontSize = 48;
    errorTextDoc87.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc87.font = "Arial-BoldMT";
    errorTextDoc87.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText87.property("Source Text").setValue(errorTextDoc87);
}

planCompositions[87] = planComp87;


// Composition pour plan 00088
var planComp88 = project.items.addComp(
    "SQ03_UNDLM_00088_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.5600000000000005,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp88.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer88 = planComp88.layers.add(bgSolidComp);
bgLayer88.name = "BG_SOLID";
bgLayer88.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer88 = false;
if (gradingSources[88]) {
    var gradedLayer88 = planComp88.layers.add(gradingSources[88]);
    gradedLayer88.name = "UNDLM_00088_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer88.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer88.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer88 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer88 = false;
if (editSources[88]) {
    var editLayer88 = planComp88.layers.add(editSources[88]);
    editLayer88.name = "UNDLM_00088_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer88.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer88.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer88 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity88 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer88) {
    // EDIT toujours activé quand disponible
    editLayer88.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer88) {
        gradedLayer88.enabled = false;
    }
} else if (hasGradedLayer88) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer88.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText88 = planComp88.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText88.name = "WARNING_NO_EDIT";
    warningText88.property("Transform").property("Position").setValue([1280, 200]);
    warningText88.guideLayer = true;
    
    var warningTextDoc88 = warningText88.property("Source Text").value;
    warningTextDoc88.fontSize = 32;
    warningTextDoc88.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc88.font = "Arial-BoldMT";
    warningTextDoc88.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText88.property("Source Text").setValue(warningTextDoc88);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText88 = planComp88.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00088");
    errorText88.name = "ERROR_NO_SOURCE";
    errorText88.property("Transform").property("Position").setValue([1280, 720]);
    errorText88.guideLayer = true;
    
    var errorTextDoc88 = errorText88.property("Source Text").value;
    errorTextDoc88.fontSize = 48;
    errorTextDoc88.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc88.font = "Arial-BoldMT";
    errorTextDoc88.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText88.property("Source Text").setValue(errorTextDoc88);
}

planCompositions[88] = planComp88;


// Composition pour plan 00089
var planComp89 = project.items.addComp(
    "SQ03_UNDLM_00089_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp89.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer89 = planComp89.layers.add(bgSolidComp);
bgLayer89.name = "BG_SOLID";
bgLayer89.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer89 = false;
if (gradingSources[89]) {
    var gradedLayer89 = planComp89.layers.add(gradingSources[89]);
    gradedLayer89.name = "UNDLM_00089_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer89.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer89.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer89 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer89 = false;
if (editSources[89]) {
    var editLayer89 = planComp89.layers.add(editSources[89]);
    editLayer89.name = "UNDLM_00089_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer89.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer89.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer89 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity89 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer89) {
    // EDIT toujours activé quand disponible
    editLayer89.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer89) {
        gradedLayer89.enabled = false;
    }
} else if (hasGradedLayer89) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer89.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText89 = planComp89.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText89.name = "WARNING_NO_EDIT";
    warningText89.property("Transform").property("Position").setValue([1280, 200]);
    warningText89.guideLayer = true;
    
    var warningTextDoc89 = warningText89.property("Source Text").value;
    warningTextDoc89.fontSize = 32;
    warningTextDoc89.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc89.font = "Arial-BoldMT";
    warningTextDoc89.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText89.property("Source Text").setValue(warningTextDoc89);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText89 = planComp89.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00089");
    errorText89.name = "ERROR_NO_SOURCE";
    errorText89.property("Transform").property("Position").setValue([1280, 720]);
    errorText89.guideLayer = true;
    
    var errorTextDoc89 = errorText89.property("Source Text").value;
    errorTextDoc89.fontSize = 48;
    errorTextDoc89.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc89.font = "Arial-BoldMT";
    errorTextDoc89.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText89.property("Source Text").setValue(errorTextDoc89);
}

planCompositions[89] = planComp89;


// Composition pour plan 00090
var planComp90 = project.items.addComp(
    "SQ03_UNDLM_00090_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp90.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer90 = planComp90.layers.add(bgSolidComp);
bgLayer90.name = "BG_SOLID";
bgLayer90.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer90 = false;
if (gradingSources[90]) {
    var gradedLayer90 = planComp90.layers.add(gradingSources[90]);
    gradedLayer90.name = "UNDLM_00090_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer90.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer90.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer90 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer90 = false;
if (editSources[90]) {
    var editLayer90 = planComp90.layers.add(editSources[90]);
    editLayer90.name = "UNDLM_00090_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer90.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer90.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer90 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity90 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer90) {
    // EDIT toujours activé quand disponible
    editLayer90.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer90) {
        gradedLayer90.enabled = false;
    }
} else if (hasGradedLayer90) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer90.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText90 = planComp90.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText90.name = "WARNING_NO_EDIT";
    warningText90.property("Transform").property("Position").setValue([1280, 200]);
    warningText90.guideLayer = true;
    
    var warningTextDoc90 = warningText90.property("Source Text").value;
    warningTextDoc90.fontSize = 32;
    warningTextDoc90.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc90.font = "Arial-BoldMT";
    warningTextDoc90.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText90.property("Source Text").setValue(warningTextDoc90);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText90 = planComp90.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00090");
    errorText90.name = "ERROR_NO_SOURCE";
    errorText90.property("Transform").property("Position").setValue([1280, 720]);
    errorText90.guideLayer = true;
    
    var errorTextDoc90 = errorText90.property("Source Text").value;
    errorTextDoc90.fontSize = 48;
    errorTextDoc90.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc90.font = "Arial-BoldMT";
    errorTextDoc90.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText90.property("Source Text").setValue(errorTextDoc90);
}

planCompositions[90] = planComp90;


// Composition pour plan 00091
var planComp91 = project.items.addComp(
    "SQ03_UNDLM_00091_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    13.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp91.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer91 = planComp91.layers.add(bgSolidComp);
bgLayer91.name = "BG_SOLID";
bgLayer91.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer91 = false;
if (gradingSources[91]) {
    var gradedLayer91 = planComp91.layers.add(gradingSources[91]);
    gradedLayer91.name = "UNDLM_00091_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer91.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer91.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer91 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer91 = false;
if (editSources[91]) {
    var editLayer91 = planComp91.layers.add(editSources[91]);
    editLayer91.name = "UNDLM_00091_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer91.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer91.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer91 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity91 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer91) {
    // EDIT toujours activé quand disponible
    editLayer91.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer91) {
        gradedLayer91.enabled = false;
    }
} else if (hasGradedLayer91) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer91.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText91 = planComp91.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText91.name = "WARNING_NO_EDIT";
    warningText91.property("Transform").property("Position").setValue([1280, 200]);
    warningText91.guideLayer = true;
    
    var warningTextDoc91 = warningText91.property("Source Text").value;
    warningTextDoc91.fontSize = 32;
    warningTextDoc91.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc91.font = "Arial-BoldMT";
    warningTextDoc91.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText91.property("Source Text").setValue(warningTextDoc91);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText91 = planComp91.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00091");
    errorText91.name = "ERROR_NO_SOURCE";
    errorText91.property("Transform").property("Position").setValue([1280, 720]);
    errorText91.guideLayer = true;
    
    var errorTextDoc91 = errorText91.property("Source Text").value;
    errorTextDoc91.fontSize = 48;
    errorTextDoc91.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc91.font = "Arial-BoldMT";
    errorTextDoc91.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText91.property("Source Text").setValue(errorTextDoc91);
}

planCompositions[91] = planComp91;


// Composition pour plan 00092
var planComp92 = project.items.addComp(
    "SQ03_UNDLM_00092_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    11.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp92.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer92 = planComp92.layers.add(bgSolidComp);
bgLayer92.name = "BG_SOLID";
bgLayer92.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer92 = false;
if (gradingSources[92]) {
    var gradedLayer92 = planComp92.layers.add(gradingSources[92]);
    gradedLayer92.name = "UNDLM_00092_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer92.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer92.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer92 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer92 = false;
if (editSources[92]) {
    var editLayer92 = planComp92.layers.add(editSources[92]);
    editLayer92.name = "UNDLM_00092_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer92.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer92.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer92 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity92 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer92) {
    // EDIT toujours activé quand disponible
    editLayer92.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer92) {
        gradedLayer92.enabled = false;
    }
} else if (hasGradedLayer92) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer92.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText92 = planComp92.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText92.name = "WARNING_NO_EDIT";
    warningText92.property("Transform").property("Position").setValue([1280, 200]);
    warningText92.guideLayer = true;
    
    var warningTextDoc92 = warningText92.property("Source Text").value;
    warningTextDoc92.fontSize = 32;
    warningTextDoc92.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc92.font = "Arial-BoldMT";
    warningTextDoc92.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText92.property("Source Text").setValue(warningTextDoc92);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText92 = planComp92.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00092");
    errorText92.name = "ERROR_NO_SOURCE";
    errorText92.property("Transform").property("Position").setValue([1280, 720]);
    errorText92.guideLayer = true;
    
    var errorTextDoc92 = errorText92.property("Source Text").value;
    errorTextDoc92.fontSize = 48;
    errorTextDoc92.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc92.font = "Arial-BoldMT";
    errorTextDoc92.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText92.property("Source Text").setValue(errorTextDoc92);
}

planCompositions[92] = planComp92;


// Composition pour plan 00093
var planComp93 = project.items.addComp(
    "SQ03_UNDLM_00093_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp93.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer93 = planComp93.layers.add(bgSolidComp);
bgLayer93.name = "BG_SOLID";
bgLayer93.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer93 = false;
if (gradingSources[93]) {
    var gradedLayer93 = planComp93.layers.add(gradingSources[93]);
    gradedLayer93.name = "UNDLM_00093_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer93.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer93.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer93 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer93 = false;
if (editSources[93]) {
    var editLayer93 = planComp93.layers.add(editSources[93]);
    editLayer93.name = "UNDLM_00093_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer93.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer93.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer93 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity93 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer93) {
    // EDIT toujours activé quand disponible
    editLayer93.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer93) {
        gradedLayer93.enabled = false;
    }
} else if (hasGradedLayer93) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer93.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText93 = planComp93.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText93.name = "WARNING_NO_EDIT";
    warningText93.property("Transform").property("Position").setValue([1280, 200]);
    warningText93.guideLayer = true;
    
    var warningTextDoc93 = warningText93.property("Source Text").value;
    warningTextDoc93.fontSize = 32;
    warningTextDoc93.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc93.font = "Arial-BoldMT";
    warningTextDoc93.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText93.property("Source Text").setValue(warningTextDoc93);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText93 = planComp93.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00093");
    errorText93.name = "ERROR_NO_SOURCE";
    errorText93.property("Transform").property("Position").setValue([1280, 720]);
    errorText93.guideLayer = true;
    
    var errorTextDoc93 = errorText93.property("Source Text").value;
    errorTextDoc93.fontSize = 48;
    errorTextDoc93.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc93.font = "Arial-BoldMT";
    errorTextDoc93.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText93.property("Source Text").setValue(errorTextDoc93);
}

planCompositions[93] = planComp93;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ03_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    123.28, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00074 à la timeline master
if (planCompositions[74]) {
    var masterLayer74 = masterComp.layers.add(planCompositions[74]);
    masterLayer74.startTime = 0;
    masterLayer74.name = "UNDLM_00074";
    masterLayer74.label = 1; // Couleurs alternées
}

// Ajouter plan 00075 à la timeline master
if (planCompositions[75]) {
    var masterLayer75 = masterComp.layers.add(planCompositions[75]);
    masterLayer75.startTime = 7.04;
    masterLayer75.name = "UNDLM_00075";
    masterLayer75.label = 2; // Couleurs alternées
}

// Ajouter plan 00076 à la timeline master
if (planCompositions[76]) {
    var masterLayer76 = masterComp.layers.add(planCompositions[76]);
    masterLayer76.startTime = 12.32;
    masterLayer76.name = "UNDLM_00076";
    masterLayer76.label = 3; // Couleurs alternées
}

// Ajouter plan 00077 à la timeline master
if (planCompositions[77]) {
    var masterLayer77 = masterComp.layers.add(planCompositions[77]);
    masterLayer77.startTime = 15.72;
    masterLayer77.name = "UNDLM_00077";
    masterLayer77.label = 4; // Couleurs alternées
}

// Ajouter plan 00078 à la timeline master
if (planCompositions[78]) {
    var masterLayer78 = masterComp.layers.add(planCompositions[78]);
    masterLayer78.startTime = 18.96;
    masterLayer78.name = "UNDLM_00078";
    masterLayer78.label = 5; // Couleurs alternées
}

// Ajouter plan 00079 à la timeline master
if (planCompositions[79]) {
    var masterLayer79 = masterComp.layers.add(planCompositions[79]);
    masterLayer79.startTime = 23.96;
    masterLayer79.name = "UNDLM_00079";
    masterLayer79.label = 6; // Couleurs alternées
}

// Ajouter plan 00080 à la timeline master
if (planCompositions[80]) {
    var masterLayer80 = masterComp.layers.add(planCompositions[80]);
    masterLayer80.startTime = 28.32;
    masterLayer80.name = "UNDLM_00080";
    masterLayer80.label = 7; // Couleurs alternées
}

// Ajouter plan 00081 à la timeline master
if (planCompositions[81]) {
    var masterLayer81 = masterComp.layers.add(planCompositions[81]);
    masterLayer81.startTime = 33.16;
    masterLayer81.name = "UNDLM_00081";
    masterLayer81.label = 8; // Couleurs alternées
}

// Ajouter plan 00082 à la timeline master
if (planCompositions[82]) {
    var masterLayer82 = masterComp.layers.add(planCompositions[82]);
    masterLayer82.startTime = 37.279999999999994;
    masterLayer82.name = "UNDLM_00082";
    masterLayer82.label = 9; // Couleurs alternées
}

// Ajouter plan 00083 à la timeline master
if (planCompositions[83]) {
    var masterLayer83 = masterComp.layers.add(planCompositions[83]);
    masterLayer83.startTime = 43.279999999999994;
    masterLayer83.name = "UNDLM_00083";
    masterLayer83.label = 10; // Couleurs alternées
}

// Ajouter plan 00084 à la timeline master
if (planCompositions[84]) {
    var masterLayer84 = masterComp.layers.add(planCompositions[84]);
    masterLayer84.startTime = 46.199999999999996;
    masterLayer84.name = "UNDLM_00084";
    masterLayer84.label = 11; // Couleurs alternées
}

// Ajouter plan 00085 à la timeline master
if (planCompositions[85]) {
    var masterLayer85 = masterComp.layers.add(planCompositions[85]);
    masterLayer85.startTime = 50.879999999999995;
    masterLayer85.name = "UNDLM_00085";
    masterLayer85.label = 12; // Couleurs alternées
}

// Ajouter plan 00086 à la timeline master
if (planCompositions[86]) {
    var masterLayer86 = masterComp.layers.add(planCompositions[86]);
    masterLayer86.startTime = 62.8;
    masterLayer86.name = "UNDLM_00086";
    masterLayer86.label = 13; // Couleurs alternées
}

// Ajouter plan 00087 à la timeline master
if (planCompositions[87]) {
    var masterLayer87 = masterComp.layers.add(planCompositions[87]);
    masterLayer87.startTime = 68.36;
    masterLayer87.name = "UNDLM_00087";
    masterLayer87.label = 14; // Couleurs alternées
}

// Ajouter plan 00088 à la timeline master
if (planCompositions[88]) {
    var masterLayer88 = masterComp.layers.add(planCompositions[88]);
    masterLayer88.startTime = 74.03999999999999;
    masterLayer88.name = "UNDLM_00088";
    masterLayer88.label = 15; // Couleurs alternées
}

// Ajouter plan 00089 à la timeline master
if (planCompositions[89]) {
    var masterLayer89 = masterComp.layers.add(planCompositions[89]);
    masterLayer89.startTime = 79.6;
    masterLayer89.name = "UNDLM_00089";
    masterLayer89.label = 16; // Couleurs alternées
}

// Ajouter plan 00090 à la timeline master
if (planCompositions[90]) {
    var masterLayer90 = masterComp.layers.add(planCompositions[90]);
    masterLayer90.startTime = 83.96;
    masterLayer90.name = "UNDLM_00090";
    masterLayer90.label = 1; // Couleurs alternées
}

// Ajouter plan 00091 à la timeline master
if (planCompositions[91]) {
    var masterLayer91 = masterComp.layers.add(planCompositions[91]);
    masterLayer91.startTime = 89.8;
    masterLayer91.name = "UNDLM_00091";
    masterLayer91.label = 2; // Couleurs alternées
}

// Ajouter plan 00092 à la timeline master
if (planCompositions[92]) {
    var masterLayer92 = masterComp.layers.add(planCompositions[92]);
    masterLayer92.startTime = 103.28;
    masterLayer92.name = "UNDLM_00092";
    masterLayer92.label = 3; // Couleurs alternées
}

// Ajouter plan 00093 à la timeline master
if (planCompositions[93]) {
    var masterLayer93 = masterComp.layers.add(planCompositions[93]);
    masterLayer93.startTime = 115.0;
    masterLayer93.name = "UNDLM_00093";
    masterLayer93.label = 4; // Couleurs alternées
}

// Ajouter l'adjustment layer TC en top de la composition master
var tcAdjustment = masterComp.layers.addSolid([1.0, 1.0, 1.0], "TC", 2560, 1440, 1.0);
tcAdjustment.adjustmentLayer = true;
tcAdjustment.moveToBeginning();

// Ajouter l'effet Timecode sur l'adjustment layer
try {
    var timecodeEffect = tcAdjustment.property("Effects").addProperty("ADBE Timecode");
    if (timecodeEffect) {
        // Configuration du timecode (prend automatiquement le TC de la séquence)
        timecodeEffect.property("Display Format").setValue(0); // 25fps
        timecodeEffect.property("Time Units").setValue(0); // Frames
    }
} catch (e) {
    // Si l'effet Timecode n'est pas disponible, on continue sans erreur
}

// Ajouter le burn-in scope (centré horizontalement et verticalement) - Import du fichier PNG
var scopeFile = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/ALL/MASK_UHD_Scope239.png");
if (scopeFile.exists) {
    var scopeFootage = project.importFile(new ImportOptions(scopeFile));
    scopeFootage.parentFolder = refColorsFolder;
    scopeFootage.name = "SCOPE_239";
    
    var scopeLayer = masterComp.layers.add(scopeFootage);
    scopeLayer.name = "SCOPE_BURN";
    // Centrer horizontalement et verticalement
    scopeLayer.property("Transform").property("Position").setValue([1280, 720]); // Centré à 1280x720 (2560/2 x 1440/2)
    
    // Mise à l'échelle du scope pour s'adapter à la résolution 1440p
    scopeLayer.property("Transform").property("Scale").setValue([66.67, 66.67]);
} else {
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
    try {
        var scopeShadow = scopeText.property("Effects").addProperty("ADBE Drop Shadow");
        if (scopeShadow) {
            scopeShadow.property("Opacity").setValue(180);
            scopeShadow.property("Direction").setValue(135);
            scopeShadow.property("Distance").setValue(3);
            scopeShadow.property("Softness").setValue(5);
        }
    } catch (e) {
        // Drop Shadow non disponible pour scope
    }
}

// Ajouter le burn-in nom de séquence (haut droite) avec version dynamique
var sequenceText = masterComp.layers.addText();
sequenceText.name = "SEQUENCE_BURN";
sequenceText.property("Transform").property("Position").setValue([2410, 100]);

// Expression pour afficher le nom de la séquence avec version dynamique
var seqExpression = 'var seqName = "SQ03";\n' +
'var seqVersion = "v001";\n' +
'// Détecter la version de la comp master courante\n' +
'var masterComp = thisComp;\n' +
'if (masterComp) {\n' +
'  var compName = masterComp.name;\n' +
'  var versionMatch = compName.match(/v(\\d{3})/);\n' +
'  if (versionMatch) seqVersion = versionMatch[0];\n' +
'}\n' +
'seqName + " " + seqVersion;';

sequenceText.property("Source Text").expression = seqExpression;

var seqTextDocument = sequenceText.property("Source Text").value;
seqTextDocument.fontSize = 36;
seqTextDocument.fillColor = [1.0, 1.0, 1.0];
seqTextDocument.font = "Arial-BoldMT";
seqTextDocument.justification = ParagraphJustification.RIGHT_JUSTIFY;
sequenceText.property("Source Text").setValue(seqTextDocument);

// Ajouter l'effet Drop Shadow à la séquence
try {
    var seqShadow = sequenceText.property("Effects").addProperty("ADBE Drop Shadow");
    if (seqShadow) {
        seqShadow.property("Opacity").setValue(180);
        seqShadow.property("Direction").setValue(135);
        seqShadow.property("Distance").setValue(3);
        seqShadow.property("Softness").setValue(5);
    }
} catch (e) {
    // Drop Shadow non disponible pour séquence
}

// Ajouter le burn-in nom du plan courant (bas gauche) avec version dynamique
var planText = masterComp.layers.addText();
planText.name = "PLAN_BURN";
planText.property("Transform").property("Position").setValue([150, 1340]);

// Expression pour afficher le nom du plan courant avec version dynamique
var planExpression = 'var currentTime = time;\n' +
'var planName = "PLAN_INDETERMINE";\n' +
'var planVersion = "v001";\n' +
'\n' +
'// Détecter la version du plan actif depuis la source de la composition\n' +
'var masterComp = thisComp;\n' +
'for (var i = 1; i <= masterComp.numLayers; i++) {\n' +
'  try {\n' +
'    var layer = masterComp.layer(i);\n' +
'    // Vérifier que le layer a une source ET que c\'est le bon temps\n' +
'    if (layer.source && layer.startTime <= currentTime && (layer.startTime + layer.outPoint - layer.inPoint) > currentTime) {\n' +
'      if (layer.source.name && layer.source.name.indexOf("UNDLM_") !== -1) {\n' +
'        var compName = layer.source.name;\n' +
'        var versionMatch = compName.match(/v(\\d{3})/);\n' +
'        if (versionMatch) planVersion = versionMatch[0];\n' +
'        break;\n' +
'      }\n' +
'    }\n' +
'  } catch (e) {\n' +
'    // Ignorer les layers sans source\n' +
'  }\n' +
'}\n';

// Ajouter la logique pour chaque plan dans l'expression (simplifié)
var planTimeRanges = [
    {start: 0, end: 7.04, name: "UNDLM_00074"},
    {start: 7.04, end: 12.32, name: "UNDLM_00075"},
    {start: 12.32, end: 15.72, name: "UNDLM_00076"},
    {start: 15.72, end: 18.96, name: "UNDLM_00077"},
    {start: 18.96, end: 23.96, name: "UNDLM_00078"},
    {start: 23.96, end: 28.32, name: "UNDLM_00079"},
    {start: 28.32, end: 33.16, name: "UNDLM_00080"},
    {start: 33.16, end: 37.279999999999994, name: "UNDLM_00081"},
    {start: 37.279999999999994, end: 43.279999999999994, name: "UNDLM_00082"},
    {start: 43.279999999999994, end: 46.199999999999996, name: "UNDLM_00083"},
    {start: 46.199999999999996, end: 50.879999999999995, name: "UNDLM_00084"},
    {start: 50.879999999999995, end: 62.8, name: "UNDLM_00085"},
    {start: 62.8, end: 68.36, name: "UNDLM_00086"},
    {start: 68.36, end: 74.03999999999999, name: "UNDLM_00087"},
    {start: 74.03999999999999, end: 79.6, name: "UNDLM_00088"},
    {start: 79.6, end: 83.96, name: "UNDLM_00089"},
    {start: 83.96, end: 89.8, name: "UNDLM_00090"},
    {start: 89.8, end: 103.28, name: "UNDLM_00091"},
    {start: 103.28, end: 115.0, name: "UNDLM_00092"},
    {start: 115.0, end: 123.28, name: "UNDLM_00093"},
];

// Finaliser l'expression simplifiée avec version
for (var i = 0; i < planTimeRanges.length; i++) {
    planExpression += 'if (currentTime >= ' + planTimeRanges[i].start + ' && currentTime < ' + planTimeRanges[i].end + ') {\n';
    planExpression += '  planName = "' + planTimeRanges[i].name + '";\n';
    planExpression += '}\n';
}

planExpression += '\n' +
'planName + " " + planVersion;';
planText.property("Source Text").expression = planExpression;

var planTextDocument = planText.property("Source Text").value;
planTextDocument.fontSize = 36;
planTextDocument.fillColor = [1.0, 1.0, 1.0];
planTextDocument.font = "Arial-BoldMT";
planText.property("Source Text").setValue(planTextDocument);

// Ajouter l'effet Drop Shadow au plan
try {
    var planShadow = planText.property("Effects").addProperty("ADBE Drop Shadow");
    if (planShadow) {
        planShadow.property("Opacity").setValue(180);
        planShadow.property("Direction").setValue(135);
        planShadow.property("Distance").setValue(3);
        planShadow.property("Softness").setValue(5);
    }
} catch (e) {
    // Drop Shadow non disponible pour plan
}


// ==========================================
// 5. SAUVEGARDE ET FINALISATION
// ==========================================

// Sauvegarder le projet
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ03/_AE/SQ03_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 20;
var totalCount = 20;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ03 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(123.28 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ03_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ03:" + totalCount + ":" + gradedCount);
