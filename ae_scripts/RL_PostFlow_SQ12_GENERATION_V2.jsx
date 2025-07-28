
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ12 avec 22 plans
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


// Import plan EDIT 00212
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile212 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00212.mov");
var editFilePoignees212 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00212_AVEC_POIGNEES.mov");
var editFileBis212 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00212bis.mov");

var importSuccess212 = false;
var fileName212 = "";

// Tenter import standard
if (editFile212.exists) {
    try {
        var editFootage212 = project.importFile(new ImportOptions(editFile212));
        editFootage212.parentFolder = fromEditFolder;
        editFootage212.name = "UNDLM_00212";
        editSources[212] = editFootage212;
        editImportCount++;
        importSuccess212 = true;
        fileName212 = "UNDLM_00212.mov";
        logImportSuccess(212, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00212.mov", fileName212);
    } catch (e) {
        logImportError(212, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00212.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess212 && editFilePoignees212.exists) {
    try {
        var editFootage212 = project.importFile(new ImportOptions(editFilePoignees212));
        editFootage212.parentFolder = fromEditFolder;
        editFootage212.name = "UNDLM_00212_AVEC_POIGNEES";
        editSources[212] = editFootage212;
        editImportCount++;
        importSuccess212 = true;
        fileName212 = "UNDLM_00212_AVEC_POIGNEES.mov";
        logImportSuccess(212, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00212_AVEC_POIGNEES.mov", fileName212);
    } catch (e) {
        logImportError(212, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00212_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess212 && editFileBis212.exists) {
    try {
        var editFootage212 = project.importFile(new ImportOptions(editFileBis212));
        editFootage212.parentFolder = fromEditFolder;
        editFootage212.name = "UNDLM_00212bis";
        editSources[212] = editFootage212;
        editImportCount++;
        importSuccess212 = true;
        fileName212 = "UNDLM_00212bis.mov";
        logImportSuccess(212, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00212bis.mov", fileName212);
    } catch (e) {
        logImportError(212, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00212bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess212) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00212.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00213
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile213 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00213.mov");
var editFilePoignees213 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00213_AVEC_POIGNEES.mov");
var editFileBis213 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00213bis.mov");

var importSuccess213 = false;
var fileName213 = "";

// Tenter import standard
if (editFile213.exists) {
    try {
        var editFootage213 = project.importFile(new ImportOptions(editFile213));
        editFootage213.parentFolder = fromEditFolder;
        editFootage213.name = "UNDLM_00213";
        editSources[213] = editFootage213;
        editImportCount++;
        importSuccess213 = true;
        fileName213 = "UNDLM_00213.mov";
        logImportSuccess(213, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00213.mov", fileName213);
    } catch (e) {
        logImportError(213, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00213.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess213 && editFilePoignees213.exists) {
    try {
        var editFootage213 = project.importFile(new ImportOptions(editFilePoignees213));
        editFootage213.parentFolder = fromEditFolder;
        editFootage213.name = "UNDLM_00213_AVEC_POIGNEES";
        editSources[213] = editFootage213;
        editImportCount++;
        importSuccess213 = true;
        fileName213 = "UNDLM_00213_AVEC_POIGNEES.mov";
        logImportSuccess(213, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00213_AVEC_POIGNEES.mov", fileName213);
    } catch (e) {
        logImportError(213, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00213_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess213 && editFileBis213.exists) {
    try {
        var editFootage213 = project.importFile(new ImportOptions(editFileBis213));
        editFootage213.parentFolder = fromEditFolder;
        editFootage213.name = "UNDLM_00213bis";
        editSources[213] = editFootage213;
        editImportCount++;
        importSuccess213 = true;
        fileName213 = "UNDLM_00213bis.mov";
        logImportSuccess(213, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00213bis.mov", fileName213);
    } catch (e) {
        logImportError(213, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00213bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess213) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00213.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00214
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile214 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00214.mov");
var editFilePoignees214 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00214_AVEC_POIGNEES.mov");
var editFileBis214 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00214bis.mov");

var importSuccess214 = false;
var fileName214 = "";

// Tenter import standard
if (editFile214.exists) {
    try {
        var editFootage214 = project.importFile(new ImportOptions(editFile214));
        editFootage214.parentFolder = fromEditFolder;
        editFootage214.name = "UNDLM_00214";
        editSources[214] = editFootage214;
        editImportCount++;
        importSuccess214 = true;
        fileName214 = "UNDLM_00214.mov";
        logImportSuccess(214, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00214.mov", fileName214);
    } catch (e) {
        logImportError(214, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00214.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess214 && editFilePoignees214.exists) {
    try {
        var editFootage214 = project.importFile(new ImportOptions(editFilePoignees214));
        editFootage214.parentFolder = fromEditFolder;
        editFootage214.name = "UNDLM_00214_AVEC_POIGNEES";
        editSources[214] = editFootage214;
        editImportCount++;
        importSuccess214 = true;
        fileName214 = "UNDLM_00214_AVEC_POIGNEES.mov";
        logImportSuccess(214, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00214_AVEC_POIGNEES.mov", fileName214);
    } catch (e) {
        logImportError(214, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00214_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess214 && editFileBis214.exists) {
    try {
        var editFootage214 = project.importFile(new ImportOptions(editFileBis214));
        editFootage214.parentFolder = fromEditFolder;
        editFootage214.name = "UNDLM_00214bis";
        editSources[214] = editFootage214;
        editImportCount++;
        importSuccess214 = true;
        fileName214 = "UNDLM_00214bis.mov";
        logImportSuccess(214, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00214bis.mov", fileName214);
    } catch (e) {
        logImportError(214, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00214bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess214) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00214.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00215
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile215 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00215.mov");
var editFilePoignees215 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00215_AVEC_POIGNEES.mov");
var editFileBis215 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00215bis.mov");

var importSuccess215 = false;
var fileName215 = "";

// Tenter import standard
if (editFile215.exists) {
    try {
        var editFootage215 = project.importFile(new ImportOptions(editFile215));
        editFootage215.parentFolder = fromEditFolder;
        editFootage215.name = "UNDLM_00215";
        editSources[215] = editFootage215;
        editImportCount++;
        importSuccess215 = true;
        fileName215 = "UNDLM_00215.mov";
        logImportSuccess(215, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00215.mov", fileName215);
    } catch (e) {
        logImportError(215, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00215.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess215 && editFilePoignees215.exists) {
    try {
        var editFootage215 = project.importFile(new ImportOptions(editFilePoignees215));
        editFootage215.parentFolder = fromEditFolder;
        editFootage215.name = "UNDLM_00215_AVEC_POIGNEES";
        editSources[215] = editFootage215;
        editImportCount++;
        importSuccess215 = true;
        fileName215 = "UNDLM_00215_AVEC_POIGNEES.mov";
        logImportSuccess(215, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00215_AVEC_POIGNEES.mov", fileName215);
    } catch (e) {
        logImportError(215, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00215_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess215 && editFileBis215.exists) {
    try {
        var editFootage215 = project.importFile(new ImportOptions(editFileBis215));
        editFootage215.parentFolder = fromEditFolder;
        editFootage215.name = "UNDLM_00215bis";
        editSources[215] = editFootage215;
        editImportCount++;
        importSuccess215 = true;
        fileName215 = "UNDLM_00215bis.mov";
        logImportSuccess(215, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00215bis.mov", fileName215);
    } catch (e) {
        logImportError(215, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00215bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess215) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00215.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00216
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile216 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00216.mov");
var editFilePoignees216 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00216_AVEC_POIGNEES.mov");
var editFileBis216 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00216bis.mov");

var importSuccess216 = false;
var fileName216 = "";

// Tenter import standard
if (editFile216.exists) {
    try {
        var editFootage216 = project.importFile(new ImportOptions(editFile216));
        editFootage216.parentFolder = fromEditFolder;
        editFootage216.name = "UNDLM_00216";
        editSources[216] = editFootage216;
        editImportCount++;
        importSuccess216 = true;
        fileName216 = "UNDLM_00216.mov";
        logImportSuccess(216, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00216.mov", fileName216);
    } catch (e) {
        logImportError(216, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00216.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess216 && editFilePoignees216.exists) {
    try {
        var editFootage216 = project.importFile(new ImportOptions(editFilePoignees216));
        editFootage216.parentFolder = fromEditFolder;
        editFootage216.name = "UNDLM_00216_AVEC_POIGNEES";
        editSources[216] = editFootage216;
        editImportCount++;
        importSuccess216 = true;
        fileName216 = "UNDLM_00216_AVEC_POIGNEES.mov";
        logImportSuccess(216, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00216_AVEC_POIGNEES.mov", fileName216);
    } catch (e) {
        logImportError(216, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00216_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess216 && editFileBis216.exists) {
    try {
        var editFootage216 = project.importFile(new ImportOptions(editFileBis216));
        editFootage216.parentFolder = fromEditFolder;
        editFootage216.name = "UNDLM_00216bis";
        editSources[216] = editFootage216;
        editImportCount++;
        importSuccess216 = true;
        fileName216 = "UNDLM_00216bis.mov";
        logImportSuccess(216, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00216bis.mov", fileName216);
    } catch (e) {
        logImportError(216, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00216bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess216) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00216.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00217
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile217 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00217.mov");
var editFilePoignees217 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00217_AVEC_POIGNEES.mov");
var editFileBis217 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00217bis.mov");

var importSuccess217 = false;
var fileName217 = "";

// Tenter import standard
if (editFile217.exists) {
    try {
        var editFootage217 = project.importFile(new ImportOptions(editFile217));
        editFootage217.parentFolder = fromEditFolder;
        editFootage217.name = "UNDLM_00217";
        editSources[217] = editFootage217;
        editImportCount++;
        importSuccess217 = true;
        fileName217 = "UNDLM_00217.mov";
        logImportSuccess(217, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00217.mov", fileName217);
    } catch (e) {
        logImportError(217, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00217.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess217 && editFilePoignees217.exists) {
    try {
        var editFootage217 = project.importFile(new ImportOptions(editFilePoignees217));
        editFootage217.parentFolder = fromEditFolder;
        editFootage217.name = "UNDLM_00217_AVEC_POIGNEES";
        editSources[217] = editFootage217;
        editImportCount++;
        importSuccess217 = true;
        fileName217 = "UNDLM_00217_AVEC_POIGNEES.mov";
        logImportSuccess(217, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00217_AVEC_POIGNEES.mov", fileName217);
    } catch (e) {
        logImportError(217, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00217_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess217 && editFileBis217.exists) {
    try {
        var editFootage217 = project.importFile(new ImportOptions(editFileBis217));
        editFootage217.parentFolder = fromEditFolder;
        editFootage217.name = "UNDLM_00217bis";
        editSources[217] = editFootage217;
        editImportCount++;
        importSuccess217 = true;
        fileName217 = "UNDLM_00217bis.mov";
        logImportSuccess(217, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00217bis.mov", fileName217);
    } catch (e) {
        logImportError(217, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00217bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess217) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00217.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00218
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile218 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00218.mov");
var editFilePoignees218 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00218_AVEC_POIGNEES.mov");
var editFileBis218 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00218bis.mov");

var importSuccess218 = false;
var fileName218 = "";

// Tenter import standard
if (editFile218.exists) {
    try {
        var editFootage218 = project.importFile(new ImportOptions(editFile218));
        editFootage218.parentFolder = fromEditFolder;
        editFootage218.name = "UNDLM_00218";
        editSources[218] = editFootage218;
        editImportCount++;
        importSuccess218 = true;
        fileName218 = "UNDLM_00218.mov";
        logImportSuccess(218, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00218.mov", fileName218);
    } catch (e) {
        logImportError(218, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00218.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess218 && editFilePoignees218.exists) {
    try {
        var editFootage218 = project.importFile(new ImportOptions(editFilePoignees218));
        editFootage218.parentFolder = fromEditFolder;
        editFootage218.name = "UNDLM_00218_AVEC_POIGNEES";
        editSources[218] = editFootage218;
        editImportCount++;
        importSuccess218 = true;
        fileName218 = "UNDLM_00218_AVEC_POIGNEES.mov";
        logImportSuccess(218, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00218_AVEC_POIGNEES.mov", fileName218);
    } catch (e) {
        logImportError(218, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00218_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess218 && editFileBis218.exists) {
    try {
        var editFootage218 = project.importFile(new ImportOptions(editFileBis218));
        editFootage218.parentFolder = fromEditFolder;
        editFootage218.name = "UNDLM_00218bis";
        editSources[218] = editFootage218;
        editImportCount++;
        importSuccess218 = true;
        fileName218 = "UNDLM_00218bis.mov";
        logImportSuccess(218, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00218bis.mov", fileName218);
    } catch (e) {
        logImportError(218, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00218bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess218) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00218.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00219
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile219 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00219.mov");
var editFilePoignees219 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00219_AVEC_POIGNEES.mov");
var editFileBis219 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00219bis.mov");

var importSuccess219 = false;
var fileName219 = "";

// Tenter import standard
if (editFile219.exists) {
    try {
        var editFootage219 = project.importFile(new ImportOptions(editFile219));
        editFootage219.parentFolder = fromEditFolder;
        editFootage219.name = "UNDLM_00219";
        editSources[219] = editFootage219;
        editImportCount++;
        importSuccess219 = true;
        fileName219 = "UNDLM_00219.mov";
        logImportSuccess(219, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00219.mov", fileName219);
    } catch (e) {
        logImportError(219, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00219.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess219 && editFilePoignees219.exists) {
    try {
        var editFootage219 = project.importFile(new ImportOptions(editFilePoignees219));
        editFootage219.parentFolder = fromEditFolder;
        editFootage219.name = "UNDLM_00219_AVEC_POIGNEES";
        editSources[219] = editFootage219;
        editImportCount++;
        importSuccess219 = true;
        fileName219 = "UNDLM_00219_AVEC_POIGNEES.mov";
        logImportSuccess(219, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00219_AVEC_POIGNEES.mov", fileName219);
    } catch (e) {
        logImportError(219, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00219_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess219 && editFileBis219.exists) {
    try {
        var editFootage219 = project.importFile(new ImportOptions(editFileBis219));
        editFootage219.parentFolder = fromEditFolder;
        editFootage219.name = "UNDLM_00219bis";
        editSources[219] = editFootage219;
        editImportCount++;
        importSuccess219 = true;
        fileName219 = "UNDLM_00219bis.mov";
        logImportSuccess(219, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00219bis.mov", fileName219);
    } catch (e) {
        logImportError(219, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00219bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess219) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00219.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00220
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile220 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00220.mov");
var editFilePoignees220 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00220_AVEC_POIGNEES.mov");
var editFileBis220 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00220bis.mov");

var importSuccess220 = false;
var fileName220 = "";

// Tenter import standard
if (editFile220.exists) {
    try {
        var editFootage220 = project.importFile(new ImportOptions(editFile220));
        editFootage220.parentFolder = fromEditFolder;
        editFootage220.name = "UNDLM_00220";
        editSources[220] = editFootage220;
        editImportCount++;
        importSuccess220 = true;
        fileName220 = "UNDLM_00220.mov";
        logImportSuccess(220, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00220.mov", fileName220);
    } catch (e) {
        logImportError(220, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00220.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess220 && editFilePoignees220.exists) {
    try {
        var editFootage220 = project.importFile(new ImportOptions(editFilePoignees220));
        editFootage220.parentFolder = fromEditFolder;
        editFootage220.name = "UNDLM_00220_AVEC_POIGNEES";
        editSources[220] = editFootage220;
        editImportCount++;
        importSuccess220 = true;
        fileName220 = "UNDLM_00220_AVEC_POIGNEES.mov";
        logImportSuccess(220, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00220_AVEC_POIGNEES.mov", fileName220);
    } catch (e) {
        logImportError(220, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00220_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess220 && editFileBis220.exists) {
    try {
        var editFootage220 = project.importFile(new ImportOptions(editFileBis220));
        editFootage220.parentFolder = fromEditFolder;
        editFootage220.name = "UNDLM_00220bis";
        editSources[220] = editFootage220;
        editImportCount++;
        importSuccess220 = true;
        fileName220 = "UNDLM_00220bis.mov";
        logImportSuccess(220, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00220bis.mov", fileName220);
    } catch (e) {
        logImportError(220, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00220bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess220) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00220.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00221
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile221 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00221.mov");
var editFilePoignees221 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00221_AVEC_POIGNEES.mov");
var editFileBis221 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00221bis.mov");

var importSuccess221 = false;
var fileName221 = "";

// Tenter import standard
if (editFile221.exists) {
    try {
        var editFootage221 = project.importFile(new ImportOptions(editFile221));
        editFootage221.parentFolder = fromEditFolder;
        editFootage221.name = "UNDLM_00221";
        editSources[221] = editFootage221;
        editImportCount++;
        importSuccess221 = true;
        fileName221 = "UNDLM_00221.mov";
        logImportSuccess(221, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00221.mov", fileName221);
    } catch (e) {
        logImportError(221, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00221.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess221 && editFilePoignees221.exists) {
    try {
        var editFootage221 = project.importFile(new ImportOptions(editFilePoignees221));
        editFootage221.parentFolder = fromEditFolder;
        editFootage221.name = "UNDLM_00221_AVEC_POIGNEES";
        editSources[221] = editFootage221;
        editImportCount++;
        importSuccess221 = true;
        fileName221 = "UNDLM_00221_AVEC_POIGNEES.mov";
        logImportSuccess(221, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00221_AVEC_POIGNEES.mov", fileName221);
    } catch (e) {
        logImportError(221, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00221_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess221 && editFileBis221.exists) {
    try {
        var editFootage221 = project.importFile(new ImportOptions(editFileBis221));
        editFootage221.parentFolder = fromEditFolder;
        editFootage221.name = "UNDLM_00221bis";
        editSources[221] = editFootage221;
        editImportCount++;
        importSuccess221 = true;
        fileName221 = "UNDLM_00221bis.mov";
        logImportSuccess(221, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00221bis.mov", fileName221);
    } catch (e) {
        logImportError(221, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00221bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess221) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00221.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00222
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile222 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00222.mov");
var editFilePoignees222 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00222_AVEC_POIGNEES.mov");
var editFileBis222 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00222bis.mov");

var importSuccess222 = false;
var fileName222 = "";

// Tenter import standard
if (editFile222.exists) {
    try {
        var editFootage222 = project.importFile(new ImportOptions(editFile222));
        editFootage222.parentFolder = fromEditFolder;
        editFootage222.name = "UNDLM_00222";
        editSources[222] = editFootage222;
        editImportCount++;
        importSuccess222 = true;
        fileName222 = "UNDLM_00222.mov";
        logImportSuccess(222, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00222.mov", fileName222);
    } catch (e) {
        logImportError(222, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00222.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess222 && editFilePoignees222.exists) {
    try {
        var editFootage222 = project.importFile(new ImportOptions(editFilePoignees222));
        editFootage222.parentFolder = fromEditFolder;
        editFootage222.name = "UNDLM_00222_AVEC_POIGNEES";
        editSources[222] = editFootage222;
        editImportCount++;
        importSuccess222 = true;
        fileName222 = "UNDLM_00222_AVEC_POIGNEES.mov";
        logImportSuccess(222, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00222_AVEC_POIGNEES.mov", fileName222);
    } catch (e) {
        logImportError(222, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00222_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess222 && editFileBis222.exists) {
    try {
        var editFootage222 = project.importFile(new ImportOptions(editFileBis222));
        editFootage222.parentFolder = fromEditFolder;
        editFootage222.name = "UNDLM_00222bis";
        editSources[222] = editFootage222;
        editImportCount++;
        importSuccess222 = true;
        fileName222 = "UNDLM_00222bis.mov";
        logImportSuccess(222, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00222bis.mov", fileName222);
    } catch (e) {
        logImportError(222, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00222bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess222) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00222.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00223
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile223 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00223.mov");
var editFilePoignees223 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00223_AVEC_POIGNEES.mov");
var editFileBis223 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00223bis.mov");

var importSuccess223 = false;
var fileName223 = "";

// Tenter import standard
if (editFile223.exists) {
    try {
        var editFootage223 = project.importFile(new ImportOptions(editFile223));
        editFootage223.parentFolder = fromEditFolder;
        editFootage223.name = "UNDLM_00223";
        editSources[223] = editFootage223;
        editImportCount++;
        importSuccess223 = true;
        fileName223 = "UNDLM_00223.mov";
        logImportSuccess(223, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00223.mov", fileName223);
    } catch (e) {
        logImportError(223, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00223.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess223 && editFilePoignees223.exists) {
    try {
        var editFootage223 = project.importFile(new ImportOptions(editFilePoignees223));
        editFootage223.parentFolder = fromEditFolder;
        editFootage223.name = "UNDLM_00223_AVEC_POIGNEES";
        editSources[223] = editFootage223;
        editImportCount++;
        importSuccess223 = true;
        fileName223 = "UNDLM_00223_AVEC_POIGNEES.mov";
        logImportSuccess(223, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00223_AVEC_POIGNEES.mov", fileName223);
    } catch (e) {
        logImportError(223, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00223_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess223 && editFileBis223.exists) {
    try {
        var editFootage223 = project.importFile(new ImportOptions(editFileBis223));
        editFootage223.parentFolder = fromEditFolder;
        editFootage223.name = "UNDLM_00223bis";
        editSources[223] = editFootage223;
        editImportCount++;
        importSuccess223 = true;
        fileName223 = "UNDLM_00223bis.mov";
        logImportSuccess(223, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00223bis.mov", fileName223);
    } catch (e) {
        logImportError(223, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00223bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess223) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00223.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00224
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile224 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00224.mov");
var editFilePoignees224 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00224_AVEC_POIGNEES.mov");
var editFileBis224 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00224bis.mov");

var importSuccess224 = false;
var fileName224 = "";

// Tenter import standard
if (editFile224.exists) {
    try {
        var editFootage224 = project.importFile(new ImportOptions(editFile224));
        editFootage224.parentFolder = fromEditFolder;
        editFootage224.name = "UNDLM_00224";
        editSources[224] = editFootage224;
        editImportCount++;
        importSuccess224 = true;
        fileName224 = "UNDLM_00224.mov";
        logImportSuccess(224, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00224.mov", fileName224);
    } catch (e) {
        logImportError(224, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00224.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess224 && editFilePoignees224.exists) {
    try {
        var editFootage224 = project.importFile(new ImportOptions(editFilePoignees224));
        editFootage224.parentFolder = fromEditFolder;
        editFootage224.name = "UNDLM_00224_AVEC_POIGNEES";
        editSources[224] = editFootage224;
        editImportCount++;
        importSuccess224 = true;
        fileName224 = "UNDLM_00224_AVEC_POIGNEES.mov";
        logImportSuccess(224, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00224_AVEC_POIGNEES.mov", fileName224);
    } catch (e) {
        logImportError(224, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00224_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess224 && editFileBis224.exists) {
    try {
        var editFootage224 = project.importFile(new ImportOptions(editFileBis224));
        editFootage224.parentFolder = fromEditFolder;
        editFootage224.name = "UNDLM_00224bis";
        editSources[224] = editFootage224;
        editImportCount++;
        importSuccess224 = true;
        fileName224 = "UNDLM_00224bis.mov";
        logImportSuccess(224, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00224bis.mov", fileName224);
    } catch (e) {
        logImportError(224, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00224bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess224) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00224.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00225
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile225 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00225.mov");
var editFilePoignees225 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00225_AVEC_POIGNEES.mov");
var editFileBis225 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00225bis.mov");

var importSuccess225 = false;
var fileName225 = "";

// Tenter import standard
if (editFile225.exists) {
    try {
        var editFootage225 = project.importFile(new ImportOptions(editFile225));
        editFootage225.parentFolder = fromEditFolder;
        editFootage225.name = "UNDLM_00225";
        editSources[225] = editFootage225;
        editImportCount++;
        importSuccess225 = true;
        fileName225 = "UNDLM_00225.mov";
        logImportSuccess(225, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00225.mov", fileName225);
    } catch (e) {
        logImportError(225, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00225.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess225 && editFilePoignees225.exists) {
    try {
        var editFootage225 = project.importFile(new ImportOptions(editFilePoignees225));
        editFootage225.parentFolder = fromEditFolder;
        editFootage225.name = "UNDLM_00225_AVEC_POIGNEES";
        editSources[225] = editFootage225;
        editImportCount++;
        importSuccess225 = true;
        fileName225 = "UNDLM_00225_AVEC_POIGNEES.mov";
        logImportSuccess(225, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00225_AVEC_POIGNEES.mov", fileName225);
    } catch (e) {
        logImportError(225, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00225_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess225 && editFileBis225.exists) {
    try {
        var editFootage225 = project.importFile(new ImportOptions(editFileBis225));
        editFootage225.parentFolder = fromEditFolder;
        editFootage225.name = "UNDLM_00225bis";
        editSources[225] = editFootage225;
        editImportCount++;
        importSuccess225 = true;
        fileName225 = "UNDLM_00225bis.mov";
        logImportSuccess(225, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00225bis.mov", fileName225);
    } catch (e) {
        logImportError(225, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00225bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess225) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00225.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00226
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile226 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00226.mov");
var editFilePoignees226 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00226_AVEC_POIGNEES.mov");
var editFileBis226 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00226bis.mov");

var importSuccess226 = false;
var fileName226 = "";

// Tenter import standard
if (editFile226.exists) {
    try {
        var editFootage226 = project.importFile(new ImportOptions(editFile226));
        editFootage226.parentFolder = fromEditFolder;
        editFootage226.name = "UNDLM_00226";
        editSources[226] = editFootage226;
        editImportCount++;
        importSuccess226 = true;
        fileName226 = "UNDLM_00226.mov";
        logImportSuccess(226, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00226.mov", fileName226);
    } catch (e) {
        logImportError(226, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00226.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess226 && editFilePoignees226.exists) {
    try {
        var editFootage226 = project.importFile(new ImportOptions(editFilePoignees226));
        editFootage226.parentFolder = fromEditFolder;
        editFootage226.name = "UNDLM_00226_AVEC_POIGNEES";
        editSources[226] = editFootage226;
        editImportCount++;
        importSuccess226 = true;
        fileName226 = "UNDLM_00226_AVEC_POIGNEES.mov";
        logImportSuccess(226, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00226_AVEC_POIGNEES.mov", fileName226);
    } catch (e) {
        logImportError(226, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00226_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess226 && editFileBis226.exists) {
    try {
        var editFootage226 = project.importFile(new ImportOptions(editFileBis226));
        editFootage226.parentFolder = fromEditFolder;
        editFootage226.name = "UNDLM_00226bis";
        editSources[226] = editFootage226;
        editImportCount++;
        importSuccess226 = true;
        fileName226 = "UNDLM_00226bis.mov";
        logImportSuccess(226, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00226bis.mov", fileName226);
    } catch (e) {
        logImportError(226, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00226bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess226) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00226.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00227
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile227 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00227.mov");
var editFilePoignees227 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00227_AVEC_POIGNEES.mov");
var editFileBis227 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00227bis.mov");

var importSuccess227 = false;
var fileName227 = "";

// Tenter import standard
if (editFile227.exists) {
    try {
        var editFootage227 = project.importFile(new ImportOptions(editFile227));
        editFootage227.parentFolder = fromEditFolder;
        editFootage227.name = "UNDLM_00227";
        editSources[227] = editFootage227;
        editImportCount++;
        importSuccess227 = true;
        fileName227 = "UNDLM_00227.mov";
        logImportSuccess(227, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00227.mov", fileName227);
    } catch (e) {
        logImportError(227, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00227.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess227 && editFilePoignees227.exists) {
    try {
        var editFootage227 = project.importFile(new ImportOptions(editFilePoignees227));
        editFootage227.parentFolder = fromEditFolder;
        editFootage227.name = "UNDLM_00227_AVEC_POIGNEES";
        editSources[227] = editFootage227;
        editImportCount++;
        importSuccess227 = true;
        fileName227 = "UNDLM_00227_AVEC_POIGNEES.mov";
        logImportSuccess(227, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00227_AVEC_POIGNEES.mov", fileName227);
    } catch (e) {
        logImportError(227, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00227_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess227 && editFileBis227.exists) {
    try {
        var editFootage227 = project.importFile(new ImportOptions(editFileBis227));
        editFootage227.parentFolder = fromEditFolder;
        editFootage227.name = "UNDLM_00227bis";
        editSources[227] = editFootage227;
        editImportCount++;
        importSuccess227 = true;
        fileName227 = "UNDLM_00227bis.mov";
        logImportSuccess(227, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00227bis.mov", fileName227);
    } catch (e) {
        logImportError(227, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00227bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess227) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00227.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00228
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile228 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00228.mov");
var editFilePoignees228 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00228_AVEC_POIGNEES.mov");
var editFileBis228 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00228bis.mov");

var importSuccess228 = false;
var fileName228 = "";

// Tenter import standard
if (editFile228.exists) {
    try {
        var editFootage228 = project.importFile(new ImportOptions(editFile228));
        editFootage228.parentFolder = fromEditFolder;
        editFootage228.name = "UNDLM_00228";
        editSources[228] = editFootage228;
        editImportCount++;
        importSuccess228 = true;
        fileName228 = "UNDLM_00228.mov";
        logImportSuccess(228, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00228.mov", fileName228);
    } catch (e) {
        logImportError(228, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00228.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess228 && editFilePoignees228.exists) {
    try {
        var editFootage228 = project.importFile(new ImportOptions(editFilePoignees228));
        editFootage228.parentFolder = fromEditFolder;
        editFootage228.name = "UNDLM_00228_AVEC_POIGNEES";
        editSources[228] = editFootage228;
        editImportCount++;
        importSuccess228 = true;
        fileName228 = "UNDLM_00228_AVEC_POIGNEES.mov";
        logImportSuccess(228, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00228_AVEC_POIGNEES.mov", fileName228);
    } catch (e) {
        logImportError(228, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00228_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess228 && editFileBis228.exists) {
    try {
        var editFootage228 = project.importFile(new ImportOptions(editFileBis228));
        editFootage228.parentFolder = fromEditFolder;
        editFootage228.name = "UNDLM_00228bis";
        editSources[228] = editFootage228;
        editImportCount++;
        importSuccess228 = true;
        fileName228 = "UNDLM_00228bis.mov";
        logImportSuccess(228, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00228bis.mov", fileName228);
    } catch (e) {
        logImportError(228, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00228bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess228) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00228.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00229
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile229 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00229.mov");
var editFilePoignees229 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00229_AVEC_POIGNEES.mov");
var editFileBis229 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00229bis.mov");

var importSuccess229 = false;
var fileName229 = "";

// Tenter import standard
if (editFile229.exists) {
    try {
        var editFootage229 = project.importFile(new ImportOptions(editFile229));
        editFootage229.parentFolder = fromEditFolder;
        editFootage229.name = "UNDLM_00229";
        editSources[229] = editFootage229;
        editImportCount++;
        importSuccess229 = true;
        fileName229 = "UNDLM_00229.mov";
        logImportSuccess(229, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00229.mov", fileName229);
    } catch (e) {
        logImportError(229, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00229.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess229 && editFilePoignees229.exists) {
    try {
        var editFootage229 = project.importFile(new ImportOptions(editFilePoignees229));
        editFootage229.parentFolder = fromEditFolder;
        editFootage229.name = "UNDLM_00229_AVEC_POIGNEES";
        editSources[229] = editFootage229;
        editImportCount++;
        importSuccess229 = true;
        fileName229 = "UNDLM_00229_AVEC_POIGNEES.mov";
        logImportSuccess(229, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00229_AVEC_POIGNEES.mov", fileName229);
    } catch (e) {
        logImportError(229, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00229_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess229 && editFileBis229.exists) {
    try {
        var editFootage229 = project.importFile(new ImportOptions(editFileBis229));
        editFootage229.parentFolder = fromEditFolder;
        editFootage229.name = "UNDLM_00229bis";
        editSources[229] = editFootage229;
        editImportCount++;
        importSuccess229 = true;
        fileName229 = "UNDLM_00229bis.mov";
        logImportSuccess(229, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00229bis.mov", fileName229);
    } catch (e) {
        logImportError(229, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00229bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess229) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00229.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00230
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile230 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00230.mov");
var editFilePoignees230 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00230_AVEC_POIGNEES.mov");
var editFileBis230 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00230bis.mov");

var importSuccess230 = false;
var fileName230 = "";

// Tenter import standard
if (editFile230.exists) {
    try {
        var editFootage230 = project.importFile(new ImportOptions(editFile230));
        editFootage230.parentFolder = fromEditFolder;
        editFootage230.name = "UNDLM_00230";
        editSources[230] = editFootage230;
        editImportCount++;
        importSuccess230 = true;
        fileName230 = "UNDLM_00230.mov";
        logImportSuccess(230, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00230.mov", fileName230);
    } catch (e) {
        logImportError(230, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00230.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess230 && editFilePoignees230.exists) {
    try {
        var editFootage230 = project.importFile(new ImportOptions(editFilePoignees230));
        editFootage230.parentFolder = fromEditFolder;
        editFootage230.name = "UNDLM_00230_AVEC_POIGNEES";
        editSources[230] = editFootage230;
        editImportCount++;
        importSuccess230 = true;
        fileName230 = "UNDLM_00230_AVEC_POIGNEES.mov";
        logImportSuccess(230, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00230_AVEC_POIGNEES.mov", fileName230);
    } catch (e) {
        logImportError(230, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00230_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess230 && editFileBis230.exists) {
    try {
        var editFootage230 = project.importFile(new ImportOptions(editFileBis230));
        editFootage230.parentFolder = fromEditFolder;
        editFootage230.name = "UNDLM_00230bis";
        editSources[230] = editFootage230;
        editImportCount++;
        importSuccess230 = true;
        fileName230 = "UNDLM_00230bis.mov";
        logImportSuccess(230, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00230bis.mov", fileName230);
    } catch (e) {
        logImportError(230, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00230bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess230) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00230.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00231
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile231 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00231.mov");
var editFilePoignees231 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00231_AVEC_POIGNEES.mov");
var editFileBis231 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00231bis.mov");

var importSuccess231 = false;
var fileName231 = "";

// Tenter import standard
if (editFile231.exists) {
    try {
        var editFootage231 = project.importFile(new ImportOptions(editFile231));
        editFootage231.parentFolder = fromEditFolder;
        editFootage231.name = "UNDLM_00231";
        editSources[231] = editFootage231;
        editImportCount++;
        importSuccess231 = true;
        fileName231 = "UNDLM_00231.mov";
        logImportSuccess(231, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00231.mov", fileName231);
    } catch (e) {
        logImportError(231, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00231.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess231 && editFilePoignees231.exists) {
    try {
        var editFootage231 = project.importFile(new ImportOptions(editFilePoignees231));
        editFootage231.parentFolder = fromEditFolder;
        editFootage231.name = "UNDLM_00231_AVEC_POIGNEES";
        editSources[231] = editFootage231;
        editImportCount++;
        importSuccess231 = true;
        fileName231 = "UNDLM_00231_AVEC_POIGNEES.mov";
        logImportSuccess(231, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00231_AVEC_POIGNEES.mov", fileName231);
    } catch (e) {
        logImportError(231, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00231_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess231 && editFileBis231.exists) {
    try {
        var editFootage231 = project.importFile(new ImportOptions(editFileBis231));
        editFootage231.parentFolder = fromEditFolder;
        editFootage231.name = "UNDLM_00231bis";
        editSources[231] = editFootage231;
        editImportCount++;
        importSuccess231 = true;
        fileName231 = "UNDLM_00231bis.mov";
        logImportSuccess(231, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00231bis.mov", fileName231);
    } catch (e) {
        logImportError(231, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00231bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess231) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00231.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00232
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile232 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00232.mov");
var editFilePoignees232 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00232_AVEC_POIGNEES.mov");
var editFileBis232 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00232bis.mov");

var importSuccess232 = false;
var fileName232 = "";

// Tenter import standard
if (editFile232.exists) {
    try {
        var editFootage232 = project.importFile(new ImportOptions(editFile232));
        editFootage232.parentFolder = fromEditFolder;
        editFootage232.name = "UNDLM_00232";
        editSources[232] = editFootage232;
        editImportCount++;
        importSuccess232 = true;
        fileName232 = "UNDLM_00232.mov";
        logImportSuccess(232, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00232.mov", fileName232);
    } catch (e) {
        logImportError(232, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00232.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess232 && editFilePoignees232.exists) {
    try {
        var editFootage232 = project.importFile(new ImportOptions(editFilePoignees232));
        editFootage232.parentFolder = fromEditFolder;
        editFootage232.name = "UNDLM_00232_AVEC_POIGNEES";
        editSources[232] = editFootage232;
        editImportCount++;
        importSuccess232 = true;
        fileName232 = "UNDLM_00232_AVEC_POIGNEES.mov";
        logImportSuccess(232, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00232_AVEC_POIGNEES.mov", fileName232);
    } catch (e) {
        logImportError(232, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00232_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess232 && editFileBis232.exists) {
    try {
        var editFootage232 = project.importFile(new ImportOptions(editFileBis232));
        editFootage232.parentFolder = fromEditFolder;
        editFootage232.name = "UNDLM_00232bis";
        editSources[232] = editFootage232;
        editImportCount++;
        importSuccess232 = true;
        fileName232 = "UNDLM_00232bis.mov";
        logImportSuccess(232, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00232bis.mov", fileName232);
    } catch (e) {
        logImportError(232, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00232bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess232) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00232.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00233
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile233 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00233.mov");
var editFilePoignees233 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00233_AVEC_POIGNEES.mov");
var editFileBis233 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00233bis.mov");

var importSuccess233 = false;
var fileName233 = "";

// Tenter import standard
if (editFile233.exists) {
    try {
        var editFootage233 = project.importFile(new ImportOptions(editFile233));
        editFootage233.parentFolder = fromEditFolder;
        editFootage233.name = "UNDLM_00233";
        editSources[233] = editFootage233;
        editImportCount++;
        importSuccess233 = true;
        fileName233 = "UNDLM_00233.mov";
        logImportSuccess(233, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00233.mov", fileName233);
    } catch (e) {
        logImportError(233, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00233.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess233 && editFilePoignees233.exists) {
    try {
        var editFootage233 = project.importFile(new ImportOptions(editFilePoignees233));
        editFootage233.parentFolder = fromEditFolder;
        editFootage233.name = "UNDLM_00233_AVEC_POIGNEES";
        editSources[233] = editFootage233;
        editImportCount++;
        importSuccess233 = true;
        fileName233 = "UNDLM_00233_AVEC_POIGNEES.mov";
        logImportSuccess(233, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00233_AVEC_POIGNEES.mov", fileName233);
    } catch (e) {
        logImportError(233, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00233_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess233 && editFileBis233.exists) {
    try {
        var editFootage233 = project.importFile(new ImportOptions(editFileBis233));
        editFootage233.parentFolder = fromEditFolder;
        editFootage233.name = "UNDLM_00233bis";
        editSources[233] = editFootage233;
        editImportCount++;
        importSuccess233 = true;
        fileName233 = "UNDLM_00233bis.mov";
        logImportSuccess(233, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00233bis.mov", fileName233);
    } catch (e) {
        logImportError(233, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00233bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess233) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00233.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00212
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile212 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00212.mov");
var gradedFilePoignees212 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00212_AVEC_POIGNEES.mov");
var gradedFileBis212 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00212bis.mov");

var gradedImportSuccess212 = false;
var gradedFileName212 = "";

// Tenter import standard
if (gradedFile212.exists) {
    try {
        var gradedFootage212 = project.importFile(new ImportOptions(gradedFile212));
        gradedFootage212.parentFolder = fromGradingFolder;
        gradedFootage212.name = "UNDLM_00212";
        gradingSources[212] = gradedFootage212;
        gradingImportCount++;
        gradedImportSuccess212 = true;
        gradedFileName212 = "UNDLM_00212.mov";
        logImportSuccess(212, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00212.mov", gradedFileName212);
    } catch (e) {
        logImportError(212, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00212.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess212 && gradedFilePoignees212.exists) {
    try {
        var gradedFootage212 = project.importFile(new ImportOptions(gradedFilePoignees212));
        gradedFootage212.parentFolder = fromGradingFolder;
        gradedFootage212.name = "UNDLM_00212_AVEC_POIGNEES";
        gradingSources[212] = gradedFootage212;
        gradingImportCount++;
        gradedImportSuccess212 = true;
        gradedFileName212 = "UNDLM_00212_AVEC_POIGNEES.mov";
        logImportSuccess(212, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00212_AVEC_POIGNEES.mov", gradedFileName212);
    } catch (e) {
        logImportError(212, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00212_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess212 && gradedFileBis212.exists) {
    try {
        var gradedFootage212 = project.importFile(new ImportOptions(gradedFileBis212));
        gradedFootage212.parentFolder = fromGradingFolder;
        gradedFootage212.name = "UNDLM_00212bis";
        gradingSources[212] = gradedFootage212;
        gradingImportCount++;
        gradedImportSuccess212 = true;
        gradedFileName212 = "UNDLM_00212bis.mov";
        logImportSuccess(212, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00212bis.mov", gradedFileName212);
    } catch (e) {
        logImportError(212, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00212bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess212) {
    missingGradingCount++;
}

// Import plan GRADED 00213
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile213 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00213.mov");
var gradedFilePoignees213 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00213_AVEC_POIGNEES.mov");
var gradedFileBis213 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00213bis.mov");

var gradedImportSuccess213 = false;
var gradedFileName213 = "";

// Tenter import standard
if (gradedFile213.exists) {
    try {
        var gradedFootage213 = project.importFile(new ImportOptions(gradedFile213));
        gradedFootage213.parentFolder = fromGradingFolder;
        gradedFootage213.name = "UNDLM_00213";
        gradingSources[213] = gradedFootage213;
        gradingImportCount++;
        gradedImportSuccess213 = true;
        gradedFileName213 = "UNDLM_00213.mov";
        logImportSuccess(213, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00213.mov", gradedFileName213);
    } catch (e) {
        logImportError(213, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00213.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess213 && gradedFilePoignees213.exists) {
    try {
        var gradedFootage213 = project.importFile(new ImportOptions(gradedFilePoignees213));
        gradedFootage213.parentFolder = fromGradingFolder;
        gradedFootage213.name = "UNDLM_00213_AVEC_POIGNEES";
        gradingSources[213] = gradedFootage213;
        gradingImportCount++;
        gradedImportSuccess213 = true;
        gradedFileName213 = "UNDLM_00213_AVEC_POIGNEES.mov";
        logImportSuccess(213, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00213_AVEC_POIGNEES.mov", gradedFileName213);
    } catch (e) {
        logImportError(213, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00213_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess213 && gradedFileBis213.exists) {
    try {
        var gradedFootage213 = project.importFile(new ImportOptions(gradedFileBis213));
        gradedFootage213.parentFolder = fromGradingFolder;
        gradedFootage213.name = "UNDLM_00213bis";
        gradingSources[213] = gradedFootage213;
        gradingImportCount++;
        gradedImportSuccess213 = true;
        gradedFileName213 = "UNDLM_00213bis.mov";
        logImportSuccess(213, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00213bis.mov", gradedFileName213);
    } catch (e) {
        logImportError(213, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00213bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess213) {
    missingGradingCount++;
}

// Import plan GRADED 00214
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile214 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00214.mov");
var gradedFilePoignees214 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00214_AVEC_POIGNEES.mov");
var gradedFileBis214 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00214bis.mov");

var gradedImportSuccess214 = false;
var gradedFileName214 = "";

// Tenter import standard
if (gradedFile214.exists) {
    try {
        var gradedFootage214 = project.importFile(new ImportOptions(gradedFile214));
        gradedFootage214.parentFolder = fromGradingFolder;
        gradedFootage214.name = "UNDLM_00214";
        gradingSources[214] = gradedFootage214;
        gradingImportCount++;
        gradedImportSuccess214 = true;
        gradedFileName214 = "UNDLM_00214.mov";
        logImportSuccess(214, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00214.mov", gradedFileName214);
    } catch (e) {
        logImportError(214, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00214.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess214 && gradedFilePoignees214.exists) {
    try {
        var gradedFootage214 = project.importFile(new ImportOptions(gradedFilePoignees214));
        gradedFootage214.parentFolder = fromGradingFolder;
        gradedFootage214.name = "UNDLM_00214_AVEC_POIGNEES";
        gradingSources[214] = gradedFootage214;
        gradingImportCount++;
        gradedImportSuccess214 = true;
        gradedFileName214 = "UNDLM_00214_AVEC_POIGNEES.mov";
        logImportSuccess(214, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00214_AVEC_POIGNEES.mov", gradedFileName214);
    } catch (e) {
        logImportError(214, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00214_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess214 && gradedFileBis214.exists) {
    try {
        var gradedFootage214 = project.importFile(new ImportOptions(gradedFileBis214));
        gradedFootage214.parentFolder = fromGradingFolder;
        gradedFootage214.name = "UNDLM_00214bis";
        gradingSources[214] = gradedFootage214;
        gradingImportCount++;
        gradedImportSuccess214 = true;
        gradedFileName214 = "UNDLM_00214bis.mov";
        logImportSuccess(214, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00214bis.mov", gradedFileName214);
    } catch (e) {
        logImportError(214, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00214bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess214) {
    missingGradingCount++;
}

// Import plan GRADED 00215
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile215 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00215.mov");
var gradedFilePoignees215 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00215_AVEC_POIGNEES.mov");
var gradedFileBis215 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00215bis.mov");

var gradedImportSuccess215 = false;
var gradedFileName215 = "";

// Tenter import standard
if (gradedFile215.exists) {
    try {
        var gradedFootage215 = project.importFile(new ImportOptions(gradedFile215));
        gradedFootage215.parentFolder = fromGradingFolder;
        gradedFootage215.name = "UNDLM_00215";
        gradingSources[215] = gradedFootage215;
        gradingImportCount++;
        gradedImportSuccess215 = true;
        gradedFileName215 = "UNDLM_00215.mov";
        logImportSuccess(215, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00215.mov", gradedFileName215);
    } catch (e) {
        logImportError(215, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00215.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess215 && gradedFilePoignees215.exists) {
    try {
        var gradedFootage215 = project.importFile(new ImportOptions(gradedFilePoignees215));
        gradedFootage215.parentFolder = fromGradingFolder;
        gradedFootage215.name = "UNDLM_00215_AVEC_POIGNEES";
        gradingSources[215] = gradedFootage215;
        gradingImportCount++;
        gradedImportSuccess215 = true;
        gradedFileName215 = "UNDLM_00215_AVEC_POIGNEES.mov";
        logImportSuccess(215, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00215_AVEC_POIGNEES.mov", gradedFileName215);
    } catch (e) {
        logImportError(215, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00215_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess215 && gradedFileBis215.exists) {
    try {
        var gradedFootage215 = project.importFile(new ImportOptions(gradedFileBis215));
        gradedFootage215.parentFolder = fromGradingFolder;
        gradedFootage215.name = "UNDLM_00215bis";
        gradingSources[215] = gradedFootage215;
        gradingImportCount++;
        gradedImportSuccess215 = true;
        gradedFileName215 = "UNDLM_00215bis.mov";
        logImportSuccess(215, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00215bis.mov", gradedFileName215);
    } catch (e) {
        logImportError(215, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00215bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess215) {
    missingGradingCount++;
}

// Import plan GRADED 00216
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile216 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00216.mov");
var gradedFilePoignees216 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00216_AVEC_POIGNEES.mov");
var gradedFileBis216 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00216bis.mov");

var gradedImportSuccess216 = false;
var gradedFileName216 = "";

// Tenter import standard
if (gradedFile216.exists) {
    try {
        var gradedFootage216 = project.importFile(new ImportOptions(gradedFile216));
        gradedFootage216.parentFolder = fromGradingFolder;
        gradedFootage216.name = "UNDLM_00216";
        gradingSources[216] = gradedFootage216;
        gradingImportCount++;
        gradedImportSuccess216 = true;
        gradedFileName216 = "UNDLM_00216.mov";
        logImportSuccess(216, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00216.mov", gradedFileName216);
    } catch (e) {
        logImportError(216, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00216.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess216 && gradedFilePoignees216.exists) {
    try {
        var gradedFootage216 = project.importFile(new ImportOptions(gradedFilePoignees216));
        gradedFootage216.parentFolder = fromGradingFolder;
        gradedFootage216.name = "UNDLM_00216_AVEC_POIGNEES";
        gradingSources[216] = gradedFootage216;
        gradingImportCount++;
        gradedImportSuccess216 = true;
        gradedFileName216 = "UNDLM_00216_AVEC_POIGNEES.mov";
        logImportSuccess(216, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00216_AVEC_POIGNEES.mov", gradedFileName216);
    } catch (e) {
        logImportError(216, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00216_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess216 && gradedFileBis216.exists) {
    try {
        var gradedFootage216 = project.importFile(new ImportOptions(gradedFileBis216));
        gradedFootage216.parentFolder = fromGradingFolder;
        gradedFootage216.name = "UNDLM_00216bis";
        gradingSources[216] = gradedFootage216;
        gradingImportCount++;
        gradedImportSuccess216 = true;
        gradedFileName216 = "UNDLM_00216bis.mov";
        logImportSuccess(216, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00216bis.mov", gradedFileName216);
    } catch (e) {
        logImportError(216, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00216bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess216) {
    missingGradingCount++;
}

// Import plan GRADED 00217
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile217 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00217.mov");
var gradedFilePoignees217 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00217_AVEC_POIGNEES.mov");
var gradedFileBis217 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00217bis.mov");

var gradedImportSuccess217 = false;
var gradedFileName217 = "";

// Tenter import standard
if (gradedFile217.exists) {
    try {
        var gradedFootage217 = project.importFile(new ImportOptions(gradedFile217));
        gradedFootage217.parentFolder = fromGradingFolder;
        gradedFootage217.name = "UNDLM_00217";
        gradingSources[217] = gradedFootage217;
        gradingImportCount++;
        gradedImportSuccess217 = true;
        gradedFileName217 = "UNDLM_00217.mov";
        logImportSuccess(217, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00217.mov", gradedFileName217);
    } catch (e) {
        logImportError(217, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00217.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess217 && gradedFilePoignees217.exists) {
    try {
        var gradedFootage217 = project.importFile(new ImportOptions(gradedFilePoignees217));
        gradedFootage217.parentFolder = fromGradingFolder;
        gradedFootage217.name = "UNDLM_00217_AVEC_POIGNEES";
        gradingSources[217] = gradedFootage217;
        gradingImportCount++;
        gradedImportSuccess217 = true;
        gradedFileName217 = "UNDLM_00217_AVEC_POIGNEES.mov";
        logImportSuccess(217, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00217_AVEC_POIGNEES.mov", gradedFileName217);
    } catch (e) {
        logImportError(217, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00217_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess217 && gradedFileBis217.exists) {
    try {
        var gradedFootage217 = project.importFile(new ImportOptions(gradedFileBis217));
        gradedFootage217.parentFolder = fromGradingFolder;
        gradedFootage217.name = "UNDLM_00217bis";
        gradingSources[217] = gradedFootage217;
        gradingImportCount++;
        gradedImportSuccess217 = true;
        gradedFileName217 = "UNDLM_00217bis.mov";
        logImportSuccess(217, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00217bis.mov", gradedFileName217);
    } catch (e) {
        logImportError(217, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00217bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess217) {
    missingGradingCount++;
}

// Import plan GRADED 00218
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile218 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00218.mov");
var gradedFilePoignees218 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00218_AVEC_POIGNEES.mov");
var gradedFileBis218 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00218bis.mov");

var gradedImportSuccess218 = false;
var gradedFileName218 = "";

// Tenter import standard
if (gradedFile218.exists) {
    try {
        var gradedFootage218 = project.importFile(new ImportOptions(gradedFile218));
        gradedFootage218.parentFolder = fromGradingFolder;
        gradedFootage218.name = "UNDLM_00218";
        gradingSources[218] = gradedFootage218;
        gradingImportCount++;
        gradedImportSuccess218 = true;
        gradedFileName218 = "UNDLM_00218.mov";
        logImportSuccess(218, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00218.mov", gradedFileName218);
    } catch (e) {
        logImportError(218, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00218.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess218 && gradedFilePoignees218.exists) {
    try {
        var gradedFootage218 = project.importFile(new ImportOptions(gradedFilePoignees218));
        gradedFootage218.parentFolder = fromGradingFolder;
        gradedFootage218.name = "UNDLM_00218_AVEC_POIGNEES";
        gradingSources[218] = gradedFootage218;
        gradingImportCount++;
        gradedImportSuccess218 = true;
        gradedFileName218 = "UNDLM_00218_AVEC_POIGNEES.mov";
        logImportSuccess(218, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00218_AVEC_POIGNEES.mov", gradedFileName218);
    } catch (e) {
        logImportError(218, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00218_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess218 && gradedFileBis218.exists) {
    try {
        var gradedFootage218 = project.importFile(new ImportOptions(gradedFileBis218));
        gradedFootage218.parentFolder = fromGradingFolder;
        gradedFootage218.name = "UNDLM_00218bis";
        gradingSources[218] = gradedFootage218;
        gradingImportCount++;
        gradedImportSuccess218 = true;
        gradedFileName218 = "UNDLM_00218bis.mov";
        logImportSuccess(218, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00218bis.mov", gradedFileName218);
    } catch (e) {
        logImportError(218, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00218bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess218) {
    missingGradingCount++;
}

// Import plan GRADED 00219
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile219 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00219.mov");
var gradedFilePoignees219 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00219_AVEC_POIGNEES.mov");
var gradedFileBis219 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00219bis.mov");

var gradedImportSuccess219 = false;
var gradedFileName219 = "";

// Tenter import standard
if (gradedFile219.exists) {
    try {
        var gradedFootage219 = project.importFile(new ImportOptions(gradedFile219));
        gradedFootage219.parentFolder = fromGradingFolder;
        gradedFootage219.name = "UNDLM_00219";
        gradingSources[219] = gradedFootage219;
        gradingImportCount++;
        gradedImportSuccess219 = true;
        gradedFileName219 = "UNDLM_00219.mov";
        logImportSuccess(219, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00219.mov", gradedFileName219);
    } catch (e) {
        logImportError(219, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00219.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess219 && gradedFilePoignees219.exists) {
    try {
        var gradedFootage219 = project.importFile(new ImportOptions(gradedFilePoignees219));
        gradedFootage219.parentFolder = fromGradingFolder;
        gradedFootage219.name = "UNDLM_00219_AVEC_POIGNEES";
        gradingSources[219] = gradedFootage219;
        gradingImportCount++;
        gradedImportSuccess219 = true;
        gradedFileName219 = "UNDLM_00219_AVEC_POIGNEES.mov";
        logImportSuccess(219, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00219_AVEC_POIGNEES.mov", gradedFileName219);
    } catch (e) {
        logImportError(219, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00219_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess219 && gradedFileBis219.exists) {
    try {
        var gradedFootage219 = project.importFile(new ImportOptions(gradedFileBis219));
        gradedFootage219.parentFolder = fromGradingFolder;
        gradedFootage219.name = "UNDLM_00219bis";
        gradingSources[219] = gradedFootage219;
        gradingImportCount++;
        gradedImportSuccess219 = true;
        gradedFileName219 = "UNDLM_00219bis.mov";
        logImportSuccess(219, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00219bis.mov", gradedFileName219);
    } catch (e) {
        logImportError(219, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00219bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess219) {
    missingGradingCount++;
}

// Import plan GRADED 00220
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile220 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00220.mov");
var gradedFilePoignees220 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00220_AVEC_POIGNEES.mov");
var gradedFileBis220 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00220bis.mov");

var gradedImportSuccess220 = false;
var gradedFileName220 = "";

// Tenter import standard
if (gradedFile220.exists) {
    try {
        var gradedFootage220 = project.importFile(new ImportOptions(gradedFile220));
        gradedFootage220.parentFolder = fromGradingFolder;
        gradedFootage220.name = "UNDLM_00220";
        gradingSources[220] = gradedFootage220;
        gradingImportCount++;
        gradedImportSuccess220 = true;
        gradedFileName220 = "UNDLM_00220.mov";
        logImportSuccess(220, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00220.mov", gradedFileName220);
    } catch (e) {
        logImportError(220, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00220.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess220 && gradedFilePoignees220.exists) {
    try {
        var gradedFootage220 = project.importFile(new ImportOptions(gradedFilePoignees220));
        gradedFootage220.parentFolder = fromGradingFolder;
        gradedFootage220.name = "UNDLM_00220_AVEC_POIGNEES";
        gradingSources[220] = gradedFootage220;
        gradingImportCount++;
        gradedImportSuccess220 = true;
        gradedFileName220 = "UNDLM_00220_AVEC_POIGNEES.mov";
        logImportSuccess(220, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00220_AVEC_POIGNEES.mov", gradedFileName220);
    } catch (e) {
        logImportError(220, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00220_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess220 && gradedFileBis220.exists) {
    try {
        var gradedFootage220 = project.importFile(new ImportOptions(gradedFileBis220));
        gradedFootage220.parentFolder = fromGradingFolder;
        gradedFootage220.name = "UNDLM_00220bis";
        gradingSources[220] = gradedFootage220;
        gradingImportCount++;
        gradedImportSuccess220 = true;
        gradedFileName220 = "UNDLM_00220bis.mov";
        logImportSuccess(220, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00220bis.mov", gradedFileName220);
    } catch (e) {
        logImportError(220, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00220bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess220) {
    missingGradingCount++;
}

// Import plan GRADED 00221
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile221 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00221.mov");
var gradedFilePoignees221 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00221_AVEC_POIGNEES.mov");
var gradedFileBis221 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00221bis.mov");

var gradedImportSuccess221 = false;
var gradedFileName221 = "";

// Tenter import standard
if (gradedFile221.exists) {
    try {
        var gradedFootage221 = project.importFile(new ImportOptions(gradedFile221));
        gradedFootage221.parentFolder = fromGradingFolder;
        gradedFootage221.name = "UNDLM_00221";
        gradingSources[221] = gradedFootage221;
        gradingImportCount++;
        gradedImportSuccess221 = true;
        gradedFileName221 = "UNDLM_00221.mov";
        logImportSuccess(221, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00221.mov", gradedFileName221);
    } catch (e) {
        logImportError(221, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00221.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess221 && gradedFilePoignees221.exists) {
    try {
        var gradedFootage221 = project.importFile(new ImportOptions(gradedFilePoignees221));
        gradedFootage221.parentFolder = fromGradingFolder;
        gradedFootage221.name = "UNDLM_00221_AVEC_POIGNEES";
        gradingSources[221] = gradedFootage221;
        gradingImportCount++;
        gradedImportSuccess221 = true;
        gradedFileName221 = "UNDLM_00221_AVEC_POIGNEES.mov";
        logImportSuccess(221, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00221_AVEC_POIGNEES.mov", gradedFileName221);
    } catch (e) {
        logImportError(221, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00221_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess221 && gradedFileBis221.exists) {
    try {
        var gradedFootage221 = project.importFile(new ImportOptions(gradedFileBis221));
        gradedFootage221.parentFolder = fromGradingFolder;
        gradedFootage221.name = "UNDLM_00221bis";
        gradingSources[221] = gradedFootage221;
        gradingImportCount++;
        gradedImportSuccess221 = true;
        gradedFileName221 = "UNDLM_00221bis.mov";
        logImportSuccess(221, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00221bis.mov", gradedFileName221);
    } catch (e) {
        logImportError(221, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00221bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess221) {
    missingGradingCount++;
}

// Import plan GRADED 00222
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile222 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00222.mov");
var gradedFilePoignees222 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00222_AVEC_POIGNEES.mov");
var gradedFileBis222 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00222bis.mov");

var gradedImportSuccess222 = false;
var gradedFileName222 = "";

// Tenter import standard
if (gradedFile222.exists) {
    try {
        var gradedFootage222 = project.importFile(new ImportOptions(gradedFile222));
        gradedFootage222.parentFolder = fromGradingFolder;
        gradedFootage222.name = "UNDLM_00222";
        gradingSources[222] = gradedFootage222;
        gradingImportCount++;
        gradedImportSuccess222 = true;
        gradedFileName222 = "UNDLM_00222.mov";
        logImportSuccess(222, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00222.mov", gradedFileName222);
    } catch (e) {
        logImportError(222, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00222.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess222 && gradedFilePoignees222.exists) {
    try {
        var gradedFootage222 = project.importFile(new ImportOptions(gradedFilePoignees222));
        gradedFootage222.parentFolder = fromGradingFolder;
        gradedFootage222.name = "UNDLM_00222_AVEC_POIGNEES";
        gradingSources[222] = gradedFootage222;
        gradingImportCount++;
        gradedImportSuccess222 = true;
        gradedFileName222 = "UNDLM_00222_AVEC_POIGNEES.mov";
        logImportSuccess(222, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00222_AVEC_POIGNEES.mov", gradedFileName222);
    } catch (e) {
        logImportError(222, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00222_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess222 && gradedFileBis222.exists) {
    try {
        var gradedFootage222 = project.importFile(new ImportOptions(gradedFileBis222));
        gradedFootage222.parentFolder = fromGradingFolder;
        gradedFootage222.name = "UNDLM_00222bis";
        gradingSources[222] = gradedFootage222;
        gradingImportCount++;
        gradedImportSuccess222 = true;
        gradedFileName222 = "UNDLM_00222bis.mov";
        logImportSuccess(222, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00222bis.mov", gradedFileName222);
    } catch (e) {
        logImportError(222, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00222bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess222) {
    missingGradingCount++;
}

// Import plan GRADED 00223
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile223 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00223.mov");
var gradedFilePoignees223 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00223_AVEC_POIGNEES.mov");
var gradedFileBis223 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00223bis.mov");

var gradedImportSuccess223 = false;
var gradedFileName223 = "";

// Tenter import standard
if (gradedFile223.exists) {
    try {
        var gradedFootage223 = project.importFile(new ImportOptions(gradedFile223));
        gradedFootage223.parentFolder = fromGradingFolder;
        gradedFootage223.name = "UNDLM_00223";
        gradingSources[223] = gradedFootage223;
        gradingImportCount++;
        gradedImportSuccess223 = true;
        gradedFileName223 = "UNDLM_00223.mov";
        logImportSuccess(223, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00223.mov", gradedFileName223);
    } catch (e) {
        logImportError(223, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00223.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess223 && gradedFilePoignees223.exists) {
    try {
        var gradedFootage223 = project.importFile(new ImportOptions(gradedFilePoignees223));
        gradedFootage223.parentFolder = fromGradingFolder;
        gradedFootage223.name = "UNDLM_00223_AVEC_POIGNEES";
        gradingSources[223] = gradedFootage223;
        gradingImportCount++;
        gradedImportSuccess223 = true;
        gradedFileName223 = "UNDLM_00223_AVEC_POIGNEES.mov";
        logImportSuccess(223, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00223_AVEC_POIGNEES.mov", gradedFileName223);
    } catch (e) {
        logImportError(223, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00223_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess223 && gradedFileBis223.exists) {
    try {
        var gradedFootage223 = project.importFile(new ImportOptions(gradedFileBis223));
        gradedFootage223.parentFolder = fromGradingFolder;
        gradedFootage223.name = "UNDLM_00223bis";
        gradingSources[223] = gradedFootage223;
        gradingImportCount++;
        gradedImportSuccess223 = true;
        gradedFileName223 = "UNDLM_00223bis.mov";
        logImportSuccess(223, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00223bis.mov", gradedFileName223);
    } catch (e) {
        logImportError(223, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00223bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess223) {
    missingGradingCount++;
}

// Import plan GRADED 00224
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile224 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00224.mov");
var gradedFilePoignees224 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00224_AVEC_POIGNEES.mov");
var gradedFileBis224 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00224bis.mov");

var gradedImportSuccess224 = false;
var gradedFileName224 = "";

// Tenter import standard
if (gradedFile224.exists) {
    try {
        var gradedFootage224 = project.importFile(new ImportOptions(gradedFile224));
        gradedFootage224.parentFolder = fromGradingFolder;
        gradedFootage224.name = "UNDLM_00224";
        gradingSources[224] = gradedFootage224;
        gradingImportCount++;
        gradedImportSuccess224 = true;
        gradedFileName224 = "UNDLM_00224.mov";
        logImportSuccess(224, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00224.mov", gradedFileName224);
    } catch (e) {
        logImportError(224, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00224.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess224 && gradedFilePoignees224.exists) {
    try {
        var gradedFootage224 = project.importFile(new ImportOptions(gradedFilePoignees224));
        gradedFootage224.parentFolder = fromGradingFolder;
        gradedFootage224.name = "UNDLM_00224_AVEC_POIGNEES";
        gradingSources[224] = gradedFootage224;
        gradingImportCount++;
        gradedImportSuccess224 = true;
        gradedFileName224 = "UNDLM_00224_AVEC_POIGNEES.mov";
        logImportSuccess(224, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00224_AVEC_POIGNEES.mov", gradedFileName224);
    } catch (e) {
        logImportError(224, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00224_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess224 && gradedFileBis224.exists) {
    try {
        var gradedFootage224 = project.importFile(new ImportOptions(gradedFileBis224));
        gradedFootage224.parentFolder = fromGradingFolder;
        gradedFootage224.name = "UNDLM_00224bis";
        gradingSources[224] = gradedFootage224;
        gradingImportCount++;
        gradedImportSuccess224 = true;
        gradedFileName224 = "UNDLM_00224bis.mov";
        logImportSuccess(224, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00224bis.mov", gradedFileName224);
    } catch (e) {
        logImportError(224, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00224bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess224) {
    missingGradingCount++;
}

// Import plan GRADED 00225
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile225 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00225.mov");
var gradedFilePoignees225 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00225_AVEC_POIGNEES.mov");
var gradedFileBis225 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00225bis.mov");

var gradedImportSuccess225 = false;
var gradedFileName225 = "";

// Tenter import standard
if (gradedFile225.exists) {
    try {
        var gradedFootage225 = project.importFile(new ImportOptions(gradedFile225));
        gradedFootage225.parentFolder = fromGradingFolder;
        gradedFootage225.name = "UNDLM_00225";
        gradingSources[225] = gradedFootage225;
        gradingImportCount++;
        gradedImportSuccess225 = true;
        gradedFileName225 = "UNDLM_00225.mov";
        logImportSuccess(225, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00225.mov", gradedFileName225);
    } catch (e) {
        logImportError(225, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00225.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess225 && gradedFilePoignees225.exists) {
    try {
        var gradedFootage225 = project.importFile(new ImportOptions(gradedFilePoignees225));
        gradedFootage225.parentFolder = fromGradingFolder;
        gradedFootage225.name = "UNDLM_00225_AVEC_POIGNEES";
        gradingSources[225] = gradedFootage225;
        gradingImportCount++;
        gradedImportSuccess225 = true;
        gradedFileName225 = "UNDLM_00225_AVEC_POIGNEES.mov";
        logImportSuccess(225, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00225_AVEC_POIGNEES.mov", gradedFileName225);
    } catch (e) {
        logImportError(225, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00225_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess225 && gradedFileBis225.exists) {
    try {
        var gradedFootage225 = project.importFile(new ImportOptions(gradedFileBis225));
        gradedFootage225.parentFolder = fromGradingFolder;
        gradedFootage225.name = "UNDLM_00225bis";
        gradingSources[225] = gradedFootage225;
        gradingImportCount++;
        gradedImportSuccess225 = true;
        gradedFileName225 = "UNDLM_00225bis.mov";
        logImportSuccess(225, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00225bis.mov", gradedFileName225);
    } catch (e) {
        logImportError(225, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00225bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess225) {
    missingGradingCount++;
}

// Import plan GRADED 00226
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile226 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00226.mov");
var gradedFilePoignees226 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00226_AVEC_POIGNEES.mov");
var gradedFileBis226 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00226bis.mov");

var gradedImportSuccess226 = false;
var gradedFileName226 = "";

// Tenter import standard
if (gradedFile226.exists) {
    try {
        var gradedFootage226 = project.importFile(new ImportOptions(gradedFile226));
        gradedFootage226.parentFolder = fromGradingFolder;
        gradedFootage226.name = "UNDLM_00226";
        gradingSources[226] = gradedFootage226;
        gradingImportCount++;
        gradedImportSuccess226 = true;
        gradedFileName226 = "UNDLM_00226.mov";
        logImportSuccess(226, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00226.mov", gradedFileName226);
    } catch (e) {
        logImportError(226, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00226.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess226 && gradedFilePoignees226.exists) {
    try {
        var gradedFootage226 = project.importFile(new ImportOptions(gradedFilePoignees226));
        gradedFootage226.parentFolder = fromGradingFolder;
        gradedFootage226.name = "UNDLM_00226_AVEC_POIGNEES";
        gradingSources[226] = gradedFootage226;
        gradingImportCount++;
        gradedImportSuccess226 = true;
        gradedFileName226 = "UNDLM_00226_AVEC_POIGNEES.mov";
        logImportSuccess(226, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00226_AVEC_POIGNEES.mov", gradedFileName226);
    } catch (e) {
        logImportError(226, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00226_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess226 && gradedFileBis226.exists) {
    try {
        var gradedFootage226 = project.importFile(new ImportOptions(gradedFileBis226));
        gradedFootage226.parentFolder = fromGradingFolder;
        gradedFootage226.name = "UNDLM_00226bis";
        gradingSources[226] = gradedFootage226;
        gradingImportCount++;
        gradedImportSuccess226 = true;
        gradedFileName226 = "UNDLM_00226bis.mov";
        logImportSuccess(226, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00226bis.mov", gradedFileName226);
    } catch (e) {
        logImportError(226, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00226bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess226) {
    missingGradingCount++;
}

// Import plan GRADED 00227
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile227 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00227.mov");
var gradedFilePoignees227 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00227_AVEC_POIGNEES.mov");
var gradedFileBis227 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00227bis.mov");

var gradedImportSuccess227 = false;
var gradedFileName227 = "";

// Tenter import standard
if (gradedFile227.exists) {
    try {
        var gradedFootage227 = project.importFile(new ImportOptions(gradedFile227));
        gradedFootage227.parentFolder = fromGradingFolder;
        gradedFootage227.name = "UNDLM_00227";
        gradingSources[227] = gradedFootage227;
        gradingImportCount++;
        gradedImportSuccess227 = true;
        gradedFileName227 = "UNDLM_00227.mov";
        logImportSuccess(227, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00227.mov", gradedFileName227);
    } catch (e) {
        logImportError(227, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00227.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess227 && gradedFilePoignees227.exists) {
    try {
        var gradedFootage227 = project.importFile(new ImportOptions(gradedFilePoignees227));
        gradedFootage227.parentFolder = fromGradingFolder;
        gradedFootage227.name = "UNDLM_00227_AVEC_POIGNEES";
        gradingSources[227] = gradedFootage227;
        gradingImportCount++;
        gradedImportSuccess227 = true;
        gradedFileName227 = "UNDLM_00227_AVEC_POIGNEES.mov";
        logImportSuccess(227, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00227_AVEC_POIGNEES.mov", gradedFileName227);
    } catch (e) {
        logImportError(227, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00227_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess227 && gradedFileBis227.exists) {
    try {
        var gradedFootage227 = project.importFile(new ImportOptions(gradedFileBis227));
        gradedFootage227.parentFolder = fromGradingFolder;
        gradedFootage227.name = "UNDLM_00227bis";
        gradingSources[227] = gradedFootage227;
        gradingImportCount++;
        gradedImportSuccess227 = true;
        gradedFileName227 = "UNDLM_00227bis.mov";
        logImportSuccess(227, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00227bis.mov", gradedFileName227);
    } catch (e) {
        logImportError(227, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00227bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess227) {
    missingGradingCount++;
}

// Import plan GRADED 00228
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile228 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00228.mov");
var gradedFilePoignees228 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00228_AVEC_POIGNEES.mov");
var gradedFileBis228 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00228bis.mov");

var gradedImportSuccess228 = false;
var gradedFileName228 = "";

// Tenter import standard
if (gradedFile228.exists) {
    try {
        var gradedFootage228 = project.importFile(new ImportOptions(gradedFile228));
        gradedFootage228.parentFolder = fromGradingFolder;
        gradedFootage228.name = "UNDLM_00228";
        gradingSources[228] = gradedFootage228;
        gradingImportCount++;
        gradedImportSuccess228 = true;
        gradedFileName228 = "UNDLM_00228.mov";
        logImportSuccess(228, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00228.mov", gradedFileName228);
    } catch (e) {
        logImportError(228, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00228.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess228 && gradedFilePoignees228.exists) {
    try {
        var gradedFootage228 = project.importFile(new ImportOptions(gradedFilePoignees228));
        gradedFootage228.parentFolder = fromGradingFolder;
        gradedFootage228.name = "UNDLM_00228_AVEC_POIGNEES";
        gradingSources[228] = gradedFootage228;
        gradingImportCount++;
        gradedImportSuccess228 = true;
        gradedFileName228 = "UNDLM_00228_AVEC_POIGNEES.mov";
        logImportSuccess(228, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00228_AVEC_POIGNEES.mov", gradedFileName228);
    } catch (e) {
        logImportError(228, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00228_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess228 && gradedFileBis228.exists) {
    try {
        var gradedFootage228 = project.importFile(new ImportOptions(gradedFileBis228));
        gradedFootage228.parentFolder = fromGradingFolder;
        gradedFootage228.name = "UNDLM_00228bis";
        gradingSources[228] = gradedFootage228;
        gradingImportCount++;
        gradedImportSuccess228 = true;
        gradedFileName228 = "UNDLM_00228bis.mov";
        logImportSuccess(228, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00228bis.mov", gradedFileName228);
    } catch (e) {
        logImportError(228, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00228bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess228) {
    missingGradingCount++;
}

// Import plan GRADED 00229
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile229 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00229.mov");
var gradedFilePoignees229 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00229_AVEC_POIGNEES.mov");
var gradedFileBis229 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00229bis.mov");

var gradedImportSuccess229 = false;
var gradedFileName229 = "";

// Tenter import standard
if (gradedFile229.exists) {
    try {
        var gradedFootage229 = project.importFile(new ImportOptions(gradedFile229));
        gradedFootage229.parentFolder = fromGradingFolder;
        gradedFootage229.name = "UNDLM_00229";
        gradingSources[229] = gradedFootage229;
        gradingImportCount++;
        gradedImportSuccess229 = true;
        gradedFileName229 = "UNDLM_00229.mov";
        logImportSuccess(229, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00229.mov", gradedFileName229);
    } catch (e) {
        logImportError(229, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00229.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess229 && gradedFilePoignees229.exists) {
    try {
        var gradedFootage229 = project.importFile(new ImportOptions(gradedFilePoignees229));
        gradedFootage229.parentFolder = fromGradingFolder;
        gradedFootage229.name = "UNDLM_00229_AVEC_POIGNEES";
        gradingSources[229] = gradedFootage229;
        gradingImportCount++;
        gradedImportSuccess229 = true;
        gradedFileName229 = "UNDLM_00229_AVEC_POIGNEES.mov";
        logImportSuccess(229, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00229_AVEC_POIGNEES.mov", gradedFileName229);
    } catch (e) {
        logImportError(229, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00229_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess229 && gradedFileBis229.exists) {
    try {
        var gradedFootage229 = project.importFile(new ImportOptions(gradedFileBis229));
        gradedFootage229.parentFolder = fromGradingFolder;
        gradedFootage229.name = "UNDLM_00229bis";
        gradingSources[229] = gradedFootage229;
        gradingImportCount++;
        gradedImportSuccess229 = true;
        gradedFileName229 = "UNDLM_00229bis.mov";
        logImportSuccess(229, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00229bis.mov", gradedFileName229);
    } catch (e) {
        logImportError(229, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00229bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess229) {
    missingGradingCount++;
}

// Import plan GRADED 00230
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile230 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00230.mov");
var gradedFilePoignees230 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00230_AVEC_POIGNEES.mov");
var gradedFileBis230 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00230bis.mov");

var gradedImportSuccess230 = false;
var gradedFileName230 = "";

// Tenter import standard
if (gradedFile230.exists) {
    try {
        var gradedFootage230 = project.importFile(new ImportOptions(gradedFile230));
        gradedFootage230.parentFolder = fromGradingFolder;
        gradedFootage230.name = "UNDLM_00230";
        gradingSources[230] = gradedFootage230;
        gradingImportCount++;
        gradedImportSuccess230 = true;
        gradedFileName230 = "UNDLM_00230.mov";
        logImportSuccess(230, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00230.mov", gradedFileName230);
    } catch (e) {
        logImportError(230, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00230.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess230 && gradedFilePoignees230.exists) {
    try {
        var gradedFootage230 = project.importFile(new ImportOptions(gradedFilePoignees230));
        gradedFootage230.parentFolder = fromGradingFolder;
        gradedFootage230.name = "UNDLM_00230_AVEC_POIGNEES";
        gradingSources[230] = gradedFootage230;
        gradingImportCount++;
        gradedImportSuccess230 = true;
        gradedFileName230 = "UNDLM_00230_AVEC_POIGNEES.mov";
        logImportSuccess(230, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00230_AVEC_POIGNEES.mov", gradedFileName230);
    } catch (e) {
        logImportError(230, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00230_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess230 && gradedFileBis230.exists) {
    try {
        var gradedFootage230 = project.importFile(new ImportOptions(gradedFileBis230));
        gradedFootage230.parentFolder = fromGradingFolder;
        gradedFootage230.name = "UNDLM_00230bis";
        gradingSources[230] = gradedFootage230;
        gradingImportCount++;
        gradedImportSuccess230 = true;
        gradedFileName230 = "UNDLM_00230bis.mov";
        logImportSuccess(230, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00230bis.mov", gradedFileName230);
    } catch (e) {
        logImportError(230, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00230bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess230) {
    missingGradingCount++;
}

// Import plan GRADED 00231
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile231 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00231.mov");
var gradedFilePoignees231 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00231_AVEC_POIGNEES.mov");
var gradedFileBis231 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00231bis.mov");

var gradedImportSuccess231 = false;
var gradedFileName231 = "";

// Tenter import standard
if (gradedFile231.exists) {
    try {
        var gradedFootage231 = project.importFile(new ImportOptions(gradedFile231));
        gradedFootage231.parentFolder = fromGradingFolder;
        gradedFootage231.name = "UNDLM_00231";
        gradingSources[231] = gradedFootage231;
        gradingImportCount++;
        gradedImportSuccess231 = true;
        gradedFileName231 = "UNDLM_00231.mov";
        logImportSuccess(231, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00231.mov", gradedFileName231);
    } catch (e) {
        logImportError(231, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00231.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess231 && gradedFilePoignees231.exists) {
    try {
        var gradedFootage231 = project.importFile(new ImportOptions(gradedFilePoignees231));
        gradedFootage231.parentFolder = fromGradingFolder;
        gradedFootage231.name = "UNDLM_00231_AVEC_POIGNEES";
        gradingSources[231] = gradedFootage231;
        gradingImportCount++;
        gradedImportSuccess231 = true;
        gradedFileName231 = "UNDLM_00231_AVEC_POIGNEES.mov";
        logImportSuccess(231, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00231_AVEC_POIGNEES.mov", gradedFileName231);
    } catch (e) {
        logImportError(231, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00231_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess231 && gradedFileBis231.exists) {
    try {
        var gradedFootage231 = project.importFile(new ImportOptions(gradedFileBis231));
        gradedFootage231.parentFolder = fromGradingFolder;
        gradedFootage231.name = "UNDLM_00231bis";
        gradingSources[231] = gradedFootage231;
        gradingImportCount++;
        gradedImportSuccess231 = true;
        gradedFileName231 = "UNDLM_00231bis.mov";
        logImportSuccess(231, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00231bis.mov", gradedFileName231);
    } catch (e) {
        logImportError(231, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00231bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess231) {
    missingGradingCount++;
}

// Import plan GRADED 00232
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile232 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00232.mov");
var gradedFilePoignees232 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00232_AVEC_POIGNEES.mov");
var gradedFileBis232 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00232bis.mov");

var gradedImportSuccess232 = false;
var gradedFileName232 = "";

// Tenter import standard
if (gradedFile232.exists) {
    try {
        var gradedFootage232 = project.importFile(new ImportOptions(gradedFile232));
        gradedFootage232.parentFolder = fromGradingFolder;
        gradedFootage232.name = "UNDLM_00232";
        gradingSources[232] = gradedFootage232;
        gradingImportCount++;
        gradedImportSuccess232 = true;
        gradedFileName232 = "UNDLM_00232.mov";
        logImportSuccess(232, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00232.mov", gradedFileName232);
    } catch (e) {
        logImportError(232, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00232.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess232 && gradedFilePoignees232.exists) {
    try {
        var gradedFootage232 = project.importFile(new ImportOptions(gradedFilePoignees232));
        gradedFootage232.parentFolder = fromGradingFolder;
        gradedFootage232.name = "UNDLM_00232_AVEC_POIGNEES";
        gradingSources[232] = gradedFootage232;
        gradingImportCount++;
        gradedImportSuccess232 = true;
        gradedFileName232 = "UNDLM_00232_AVEC_POIGNEES.mov";
        logImportSuccess(232, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00232_AVEC_POIGNEES.mov", gradedFileName232);
    } catch (e) {
        logImportError(232, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00232_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess232 && gradedFileBis232.exists) {
    try {
        var gradedFootage232 = project.importFile(new ImportOptions(gradedFileBis232));
        gradedFootage232.parentFolder = fromGradingFolder;
        gradedFootage232.name = "UNDLM_00232bis";
        gradingSources[232] = gradedFootage232;
        gradingImportCount++;
        gradedImportSuccess232 = true;
        gradedFileName232 = "UNDLM_00232bis.mov";
        logImportSuccess(232, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00232bis.mov", gradedFileName232);
    } catch (e) {
        logImportError(232, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00232bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess232) {
    missingGradingCount++;
}

// Import plan GRADED 00233
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile233 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00233.mov");
var gradedFilePoignees233 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00233_AVEC_POIGNEES.mov");
var gradedFileBis233 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00233bis.mov");

var gradedImportSuccess233 = false;
var gradedFileName233 = "";

// Tenter import standard
if (gradedFile233.exists) {
    try {
        var gradedFootage233 = project.importFile(new ImportOptions(gradedFile233));
        gradedFootage233.parentFolder = fromGradingFolder;
        gradedFootage233.name = "UNDLM_00233";
        gradingSources[233] = gradedFootage233;
        gradingImportCount++;
        gradedImportSuccess233 = true;
        gradedFileName233 = "UNDLM_00233.mov";
        logImportSuccess(233, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00233.mov", gradedFileName233);
    } catch (e) {
        logImportError(233, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00233.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess233 && gradedFilePoignees233.exists) {
    try {
        var gradedFootage233 = project.importFile(new ImportOptions(gradedFilePoignees233));
        gradedFootage233.parentFolder = fromGradingFolder;
        gradedFootage233.name = "UNDLM_00233_AVEC_POIGNEES";
        gradingSources[233] = gradedFootage233;
        gradingImportCount++;
        gradedImportSuccess233 = true;
        gradedFileName233 = "UNDLM_00233_AVEC_POIGNEES.mov";
        logImportSuccess(233, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00233_AVEC_POIGNEES.mov", gradedFileName233);
    } catch (e) {
        logImportError(233, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00233_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess233 && gradedFileBis233.exists) {
    try {
        var gradedFootage233 = project.importFile(new ImportOptions(gradedFileBis233));
        gradedFootage233.parentFolder = fromGradingFolder;
        gradedFootage233.name = "UNDLM_00233bis";
        gradingSources[233] = gradedFootage233;
        gradingImportCount++;
        gradedImportSuccess233 = true;
        gradedFileName233 = "UNDLM_00233bis.mov";
        logImportSuccess(233, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00233bis.mov", gradedFileName233);
    } catch (e) {
        logImportError(233, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00233bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess233) {
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


// Composition pour plan 00212
var planComp212 = project.items.addComp(
    "SQ12_UNDLM_00212_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp212.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer212 = planComp212.layers.add(bgSolidComp);
bgLayer212.name = "BG_SOLID";
bgLayer212.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer212 = false;
if (gradingSources[212]) {
    var gradedLayer212 = planComp212.layers.add(gradingSources[212]);
    gradedLayer212.name = "UNDLM_00212_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer212.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer212.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer212 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer212 = false;
if (editSources[212]) {
    var editLayer212 = planComp212.layers.add(editSources[212]);
    editLayer212.name = "UNDLM_00212_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer212.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer212.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer212 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity212 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer212) {
    // EDIT toujours activé quand disponible
    editLayer212.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer212) {
        gradedLayer212.enabled = false;
    }
} else if (hasGradedLayer212) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer212.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText212 = planComp212.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText212.name = "WARNING_NO_EDIT";
    warningText212.property("Transform").property("Position").setValue([1280, 200]);
    warningText212.guideLayer = true;
    
    var warningTextDoc212 = warningText212.property("Source Text").value;
    warningTextDoc212.fontSize = 32;
    warningTextDoc212.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc212.font = "Arial-BoldMT";
    warningTextDoc212.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText212.property("Source Text").setValue(warningTextDoc212);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText212 = planComp212.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00212");
    errorText212.name = "ERROR_NO_SOURCE";
    errorText212.property("Transform").property("Position").setValue([1280, 720]);
    errorText212.guideLayer = true;
    
    var errorTextDoc212 = errorText212.property("Source Text").value;
    errorTextDoc212.fontSize = 48;
    errorTextDoc212.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc212.font = "Arial-BoldMT";
    errorTextDoc212.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText212.property("Source Text").setValue(errorTextDoc212);
}

planCompositions[212] = planComp212;


// Composition pour plan 00213
var planComp213 = project.items.addComp(
    "SQ12_UNDLM_00213_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp213.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer213 = planComp213.layers.add(bgSolidComp);
bgLayer213.name = "BG_SOLID";
bgLayer213.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer213 = false;
if (gradingSources[213]) {
    var gradedLayer213 = planComp213.layers.add(gradingSources[213]);
    gradedLayer213.name = "UNDLM_00213_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer213.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer213.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer213 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer213 = false;
if (editSources[213]) {
    var editLayer213 = planComp213.layers.add(editSources[213]);
    editLayer213.name = "UNDLM_00213_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer213.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer213.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer213 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity213 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer213) {
    // EDIT toujours activé quand disponible
    editLayer213.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer213) {
        gradedLayer213.enabled = false;
    }
} else if (hasGradedLayer213) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer213.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText213 = planComp213.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText213.name = "WARNING_NO_EDIT";
    warningText213.property("Transform").property("Position").setValue([1280, 200]);
    warningText213.guideLayer = true;
    
    var warningTextDoc213 = warningText213.property("Source Text").value;
    warningTextDoc213.fontSize = 32;
    warningTextDoc213.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc213.font = "Arial-BoldMT";
    warningTextDoc213.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText213.property("Source Text").setValue(warningTextDoc213);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText213 = planComp213.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00213");
    errorText213.name = "ERROR_NO_SOURCE";
    errorText213.property("Transform").property("Position").setValue([1280, 720]);
    errorText213.guideLayer = true;
    
    var errorTextDoc213 = errorText213.property("Source Text").value;
    errorTextDoc213.fontSize = 48;
    errorTextDoc213.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc213.font = "Arial-BoldMT";
    errorTextDoc213.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText213.property("Source Text").setValue(errorTextDoc213);
}

planCompositions[213] = planComp213;


// Composition pour plan 00214
var planComp214 = project.items.addComp(
    "SQ12_UNDLM_00214_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp214.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer214 = planComp214.layers.add(bgSolidComp);
bgLayer214.name = "BG_SOLID";
bgLayer214.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer214 = false;
if (gradingSources[214]) {
    var gradedLayer214 = planComp214.layers.add(gradingSources[214]);
    gradedLayer214.name = "UNDLM_00214_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer214.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer214.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer214 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer214 = false;
if (editSources[214]) {
    var editLayer214 = planComp214.layers.add(editSources[214]);
    editLayer214.name = "UNDLM_00214_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer214.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer214.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer214 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity214 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer214) {
    // EDIT toujours activé quand disponible
    editLayer214.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer214) {
        gradedLayer214.enabled = false;
    }
} else if (hasGradedLayer214) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer214.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText214 = planComp214.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText214.name = "WARNING_NO_EDIT";
    warningText214.property("Transform").property("Position").setValue([1280, 200]);
    warningText214.guideLayer = true;
    
    var warningTextDoc214 = warningText214.property("Source Text").value;
    warningTextDoc214.fontSize = 32;
    warningTextDoc214.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc214.font = "Arial-BoldMT";
    warningTextDoc214.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText214.property("Source Text").setValue(warningTextDoc214);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText214 = planComp214.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00214");
    errorText214.name = "ERROR_NO_SOURCE";
    errorText214.property("Transform").property("Position").setValue([1280, 720]);
    errorText214.guideLayer = true;
    
    var errorTextDoc214 = errorText214.property("Source Text").value;
    errorTextDoc214.fontSize = 48;
    errorTextDoc214.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc214.font = "Arial-BoldMT";
    errorTextDoc214.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText214.property("Source Text").setValue(errorTextDoc214);
}

planCompositions[214] = planComp214;


// Composition pour plan 00215
var planComp215 = project.items.addComp(
    "SQ12_UNDLM_00215_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp215.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer215 = planComp215.layers.add(bgSolidComp);
bgLayer215.name = "BG_SOLID";
bgLayer215.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer215 = false;
if (gradingSources[215]) {
    var gradedLayer215 = planComp215.layers.add(gradingSources[215]);
    gradedLayer215.name = "UNDLM_00215_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer215.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer215.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer215 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer215 = false;
if (editSources[215]) {
    var editLayer215 = planComp215.layers.add(editSources[215]);
    editLayer215.name = "UNDLM_00215_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer215.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer215.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer215 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity215 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer215) {
    // EDIT toujours activé quand disponible
    editLayer215.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer215) {
        gradedLayer215.enabled = false;
    }
} else if (hasGradedLayer215) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer215.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText215 = planComp215.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText215.name = "WARNING_NO_EDIT";
    warningText215.property("Transform").property("Position").setValue([1280, 200]);
    warningText215.guideLayer = true;
    
    var warningTextDoc215 = warningText215.property("Source Text").value;
    warningTextDoc215.fontSize = 32;
    warningTextDoc215.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc215.font = "Arial-BoldMT";
    warningTextDoc215.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText215.property("Source Text").setValue(warningTextDoc215);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText215 = planComp215.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00215");
    errorText215.name = "ERROR_NO_SOURCE";
    errorText215.property("Transform").property("Position").setValue([1280, 720]);
    errorText215.guideLayer = true;
    
    var errorTextDoc215 = errorText215.property("Source Text").value;
    errorTextDoc215.fontSize = 48;
    errorTextDoc215.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc215.font = "Arial-BoldMT";
    errorTextDoc215.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText215.property("Source Text").setValue(errorTextDoc215);
}

planCompositions[215] = planComp215;


// Composition pour plan 00216
var planComp216 = project.items.addComp(
    "SQ12_UNDLM_00216_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp216.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer216 = planComp216.layers.add(bgSolidComp);
bgLayer216.name = "BG_SOLID";
bgLayer216.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer216 = false;
if (gradingSources[216]) {
    var gradedLayer216 = planComp216.layers.add(gradingSources[216]);
    gradedLayer216.name = "UNDLM_00216_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer216.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer216.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer216 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer216 = false;
if (editSources[216]) {
    var editLayer216 = planComp216.layers.add(editSources[216]);
    editLayer216.name = "UNDLM_00216_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer216.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer216.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer216 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity216 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer216) {
    // EDIT toujours activé quand disponible
    editLayer216.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer216) {
        gradedLayer216.enabled = false;
    }
} else if (hasGradedLayer216) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer216.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText216 = planComp216.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText216.name = "WARNING_NO_EDIT";
    warningText216.property("Transform").property("Position").setValue([1280, 200]);
    warningText216.guideLayer = true;
    
    var warningTextDoc216 = warningText216.property("Source Text").value;
    warningTextDoc216.fontSize = 32;
    warningTextDoc216.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc216.font = "Arial-BoldMT";
    warningTextDoc216.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText216.property("Source Text").setValue(warningTextDoc216);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText216 = planComp216.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00216");
    errorText216.name = "ERROR_NO_SOURCE";
    errorText216.property("Transform").property("Position").setValue([1280, 720]);
    errorText216.guideLayer = true;
    
    var errorTextDoc216 = errorText216.property("Source Text").value;
    errorTextDoc216.fontSize = 48;
    errorTextDoc216.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc216.font = "Arial-BoldMT";
    errorTextDoc216.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText216.property("Source Text").setValue(errorTextDoc216);
}

planCompositions[216] = planComp216;


// Composition pour plan 00217
var planComp217 = project.items.addComp(
    "SQ12_UNDLM_00217_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp217.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer217 = planComp217.layers.add(bgSolidComp);
bgLayer217.name = "BG_SOLID";
bgLayer217.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer217 = false;
if (gradingSources[217]) {
    var gradedLayer217 = planComp217.layers.add(gradingSources[217]);
    gradedLayer217.name = "UNDLM_00217_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer217.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer217.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer217 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer217 = false;
if (editSources[217]) {
    var editLayer217 = planComp217.layers.add(editSources[217]);
    editLayer217.name = "UNDLM_00217_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer217.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer217.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer217 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity217 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer217) {
    // EDIT toujours activé quand disponible
    editLayer217.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer217) {
        gradedLayer217.enabled = false;
    }
} else if (hasGradedLayer217) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer217.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText217 = planComp217.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText217.name = "WARNING_NO_EDIT";
    warningText217.property("Transform").property("Position").setValue([1280, 200]);
    warningText217.guideLayer = true;
    
    var warningTextDoc217 = warningText217.property("Source Text").value;
    warningTextDoc217.fontSize = 32;
    warningTextDoc217.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc217.font = "Arial-BoldMT";
    warningTextDoc217.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText217.property("Source Text").setValue(warningTextDoc217);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText217 = planComp217.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00217");
    errorText217.name = "ERROR_NO_SOURCE";
    errorText217.property("Transform").property("Position").setValue([1280, 720]);
    errorText217.guideLayer = true;
    
    var errorTextDoc217 = errorText217.property("Source Text").value;
    errorTextDoc217.fontSize = 48;
    errorTextDoc217.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc217.font = "Arial-BoldMT";
    errorTextDoc217.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText217.property("Source Text").setValue(errorTextDoc217);
}

planCompositions[217] = planComp217;


// Composition pour plan 00218
var planComp218 = project.items.addComp(
    "SQ12_UNDLM_00218_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp218.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer218 = planComp218.layers.add(bgSolidComp);
bgLayer218.name = "BG_SOLID";
bgLayer218.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer218 = false;
if (gradingSources[218]) {
    var gradedLayer218 = planComp218.layers.add(gradingSources[218]);
    gradedLayer218.name = "UNDLM_00218_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer218.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer218.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer218 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer218 = false;
if (editSources[218]) {
    var editLayer218 = planComp218.layers.add(editSources[218]);
    editLayer218.name = "UNDLM_00218_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer218.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer218.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer218 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity218 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer218) {
    // EDIT toujours activé quand disponible
    editLayer218.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer218) {
        gradedLayer218.enabled = false;
    }
} else if (hasGradedLayer218) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer218.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText218 = planComp218.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText218.name = "WARNING_NO_EDIT";
    warningText218.property("Transform").property("Position").setValue([1280, 200]);
    warningText218.guideLayer = true;
    
    var warningTextDoc218 = warningText218.property("Source Text").value;
    warningTextDoc218.fontSize = 32;
    warningTextDoc218.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc218.font = "Arial-BoldMT";
    warningTextDoc218.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText218.property("Source Text").setValue(warningTextDoc218);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText218 = planComp218.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00218");
    errorText218.name = "ERROR_NO_SOURCE";
    errorText218.property("Transform").property("Position").setValue([1280, 720]);
    errorText218.guideLayer = true;
    
    var errorTextDoc218 = errorText218.property("Source Text").value;
    errorTextDoc218.fontSize = 48;
    errorTextDoc218.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc218.font = "Arial-BoldMT";
    errorTextDoc218.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText218.property("Source Text").setValue(errorTextDoc218);
}

planCompositions[218] = planComp218;


// Composition pour plan 00219
var planComp219 = project.items.addComp(
    "SQ12_UNDLM_00219_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp219.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer219 = planComp219.layers.add(bgSolidComp);
bgLayer219.name = "BG_SOLID";
bgLayer219.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer219 = false;
if (gradingSources[219]) {
    var gradedLayer219 = planComp219.layers.add(gradingSources[219]);
    gradedLayer219.name = "UNDLM_00219_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer219.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer219.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer219 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer219 = false;
if (editSources[219]) {
    var editLayer219 = planComp219.layers.add(editSources[219]);
    editLayer219.name = "UNDLM_00219_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer219.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer219.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer219 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity219 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer219) {
    // EDIT toujours activé quand disponible
    editLayer219.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer219) {
        gradedLayer219.enabled = false;
    }
} else if (hasGradedLayer219) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer219.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText219 = planComp219.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText219.name = "WARNING_NO_EDIT";
    warningText219.property("Transform").property("Position").setValue([1280, 200]);
    warningText219.guideLayer = true;
    
    var warningTextDoc219 = warningText219.property("Source Text").value;
    warningTextDoc219.fontSize = 32;
    warningTextDoc219.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc219.font = "Arial-BoldMT";
    warningTextDoc219.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText219.property("Source Text").setValue(warningTextDoc219);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText219 = planComp219.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00219");
    errorText219.name = "ERROR_NO_SOURCE";
    errorText219.property("Transform").property("Position").setValue([1280, 720]);
    errorText219.guideLayer = true;
    
    var errorTextDoc219 = errorText219.property("Source Text").value;
    errorTextDoc219.fontSize = 48;
    errorTextDoc219.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc219.font = "Arial-BoldMT";
    errorTextDoc219.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText219.property("Source Text").setValue(errorTextDoc219);
}

planCompositions[219] = planComp219;


// Composition pour plan 00220
var planComp220 = project.items.addComp(
    "SQ12_UNDLM_00220_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp220.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer220 = planComp220.layers.add(bgSolidComp);
bgLayer220.name = "BG_SOLID";
bgLayer220.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer220 = false;
if (gradingSources[220]) {
    var gradedLayer220 = planComp220.layers.add(gradingSources[220]);
    gradedLayer220.name = "UNDLM_00220_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer220.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer220.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer220 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer220 = false;
if (editSources[220]) {
    var editLayer220 = planComp220.layers.add(editSources[220]);
    editLayer220.name = "UNDLM_00220_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer220.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer220.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer220 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity220 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer220) {
    // EDIT toujours activé quand disponible
    editLayer220.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer220) {
        gradedLayer220.enabled = false;
    }
} else if (hasGradedLayer220) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer220.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText220 = planComp220.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText220.name = "WARNING_NO_EDIT";
    warningText220.property("Transform").property("Position").setValue([1280, 200]);
    warningText220.guideLayer = true;
    
    var warningTextDoc220 = warningText220.property("Source Text").value;
    warningTextDoc220.fontSize = 32;
    warningTextDoc220.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc220.font = "Arial-BoldMT";
    warningTextDoc220.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText220.property("Source Text").setValue(warningTextDoc220);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText220 = planComp220.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00220");
    errorText220.name = "ERROR_NO_SOURCE";
    errorText220.property("Transform").property("Position").setValue([1280, 720]);
    errorText220.guideLayer = true;
    
    var errorTextDoc220 = errorText220.property("Source Text").value;
    errorTextDoc220.fontSize = 48;
    errorTextDoc220.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc220.font = "Arial-BoldMT";
    errorTextDoc220.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText220.property("Source Text").setValue(errorTextDoc220);
}

planCompositions[220] = planComp220;


// Composition pour plan 00221
var planComp221 = project.items.addComp(
    "SQ12_UNDLM_00221_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp221.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer221 = planComp221.layers.add(bgSolidComp);
bgLayer221.name = "BG_SOLID";
bgLayer221.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer221 = false;
if (gradingSources[221]) {
    var gradedLayer221 = planComp221.layers.add(gradingSources[221]);
    gradedLayer221.name = "UNDLM_00221_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer221.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer221.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer221 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer221 = false;
if (editSources[221]) {
    var editLayer221 = planComp221.layers.add(editSources[221]);
    editLayer221.name = "UNDLM_00221_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer221.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer221.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer221 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity221 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer221) {
    // EDIT toujours activé quand disponible
    editLayer221.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer221) {
        gradedLayer221.enabled = false;
    }
} else if (hasGradedLayer221) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer221.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText221 = planComp221.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText221.name = "WARNING_NO_EDIT";
    warningText221.property("Transform").property("Position").setValue([1280, 200]);
    warningText221.guideLayer = true;
    
    var warningTextDoc221 = warningText221.property("Source Text").value;
    warningTextDoc221.fontSize = 32;
    warningTextDoc221.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc221.font = "Arial-BoldMT";
    warningTextDoc221.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText221.property("Source Text").setValue(warningTextDoc221);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText221 = planComp221.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00221");
    errorText221.name = "ERROR_NO_SOURCE";
    errorText221.property("Transform").property("Position").setValue([1280, 720]);
    errorText221.guideLayer = true;
    
    var errorTextDoc221 = errorText221.property("Source Text").value;
    errorTextDoc221.fontSize = 48;
    errorTextDoc221.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc221.font = "Arial-BoldMT";
    errorTextDoc221.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText221.property("Source Text").setValue(errorTextDoc221);
}

planCompositions[221] = planComp221;


// Composition pour plan 00222
var planComp222 = project.items.addComp(
    "SQ12_UNDLM_00222_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp222.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer222 = planComp222.layers.add(bgSolidComp);
bgLayer222.name = "BG_SOLID";
bgLayer222.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer222 = false;
if (gradingSources[222]) {
    var gradedLayer222 = planComp222.layers.add(gradingSources[222]);
    gradedLayer222.name = "UNDLM_00222_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer222.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer222.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer222 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer222 = false;
if (editSources[222]) {
    var editLayer222 = planComp222.layers.add(editSources[222]);
    editLayer222.name = "UNDLM_00222_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer222.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer222.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer222 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity222 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer222) {
    // EDIT toujours activé quand disponible
    editLayer222.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer222) {
        gradedLayer222.enabled = false;
    }
} else if (hasGradedLayer222) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer222.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText222 = planComp222.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText222.name = "WARNING_NO_EDIT";
    warningText222.property("Transform").property("Position").setValue([1280, 200]);
    warningText222.guideLayer = true;
    
    var warningTextDoc222 = warningText222.property("Source Text").value;
    warningTextDoc222.fontSize = 32;
    warningTextDoc222.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc222.font = "Arial-BoldMT";
    warningTextDoc222.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText222.property("Source Text").setValue(warningTextDoc222);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText222 = planComp222.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00222");
    errorText222.name = "ERROR_NO_SOURCE";
    errorText222.property("Transform").property("Position").setValue([1280, 720]);
    errorText222.guideLayer = true;
    
    var errorTextDoc222 = errorText222.property("Source Text").value;
    errorTextDoc222.fontSize = 48;
    errorTextDoc222.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc222.font = "Arial-BoldMT";
    errorTextDoc222.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText222.property("Source Text").setValue(errorTextDoc222);
}

planCompositions[222] = planComp222;


// Composition pour plan 00223
var planComp223 = project.items.addComp(
    "SQ12_UNDLM_00223_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp223.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer223 = planComp223.layers.add(bgSolidComp);
bgLayer223.name = "BG_SOLID";
bgLayer223.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer223 = false;
if (gradingSources[223]) {
    var gradedLayer223 = planComp223.layers.add(gradingSources[223]);
    gradedLayer223.name = "UNDLM_00223_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer223.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer223.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer223 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer223 = false;
if (editSources[223]) {
    var editLayer223 = planComp223.layers.add(editSources[223]);
    editLayer223.name = "UNDLM_00223_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer223.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer223.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer223 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity223 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer223) {
    // EDIT toujours activé quand disponible
    editLayer223.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer223) {
        gradedLayer223.enabled = false;
    }
} else if (hasGradedLayer223) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer223.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText223 = planComp223.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText223.name = "WARNING_NO_EDIT";
    warningText223.property("Transform").property("Position").setValue([1280, 200]);
    warningText223.guideLayer = true;
    
    var warningTextDoc223 = warningText223.property("Source Text").value;
    warningTextDoc223.fontSize = 32;
    warningTextDoc223.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc223.font = "Arial-BoldMT";
    warningTextDoc223.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText223.property("Source Text").setValue(warningTextDoc223);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText223 = planComp223.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00223");
    errorText223.name = "ERROR_NO_SOURCE";
    errorText223.property("Transform").property("Position").setValue([1280, 720]);
    errorText223.guideLayer = true;
    
    var errorTextDoc223 = errorText223.property("Source Text").value;
    errorTextDoc223.fontSize = 48;
    errorTextDoc223.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc223.font = "Arial-BoldMT";
    errorTextDoc223.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText223.property("Source Text").setValue(errorTextDoc223);
}

planCompositions[223] = planComp223;


// Composition pour plan 00224
var planComp224 = project.items.addComp(
    "SQ12_UNDLM_00224_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp224.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer224 = planComp224.layers.add(bgSolidComp);
bgLayer224.name = "BG_SOLID";
bgLayer224.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer224 = false;
if (gradingSources[224]) {
    var gradedLayer224 = planComp224.layers.add(gradingSources[224]);
    gradedLayer224.name = "UNDLM_00224_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer224.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer224.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer224 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer224 = false;
if (editSources[224]) {
    var editLayer224 = planComp224.layers.add(editSources[224]);
    editLayer224.name = "UNDLM_00224_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer224.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer224.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer224 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity224 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer224) {
    // EDIT toujours activé quand disponible
    editLayer224.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer224) {
        gradedLayer224.enabled = false;
    }
} else if (hasGradedLayer224) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer224.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText224 = planComp224.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText224.name = "WARNING_NO_EDIT";
    warningText224.property("Transform").property("Position").setValue([1280, 200]);
    warningText224.guideLayer = true;
    
    var warningTextDoc224 = warningText224.property("Source Text").value;
    warningTextDoc224.fontSize = 32;
    warningTextDoc224.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc224.font = "Arial-BoldMT";
    warningTextDoc224.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText224.property("Source Text").setValue(warningTextDoc224);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText224 = planComp224.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00224");
    errorText224.name = "ERROR_NO_SOURCE";
    errorText224.property("Transform").property("Position").setValue([1280, 720]);
    errorText224.guideLayer = true;
    
    var errorTextDoc224 = errorText224.property("Source Text").value;
    errorTextDoc224.fontSize = 48;
    errorTextDoc224.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc224.font = "Arial-BoldMT";
    errorTextDoc224.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText224.property("Source Text").setValue(errorTextDoc224);
}

planCompositions[224] = planComp224;


// Composition pour plan 00225
var planComp225 = project.items.addComp(
    "SQ12_UNDLM_00225_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp225.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer225 = planComp225.layers.add(bgSolidComp);
bgLayer225.name = "BG_SOLID";
bgLayer225.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer225 = false;
if (gradingSources[225]) {
    var gradedLayer225 = planComp225.layers.add(gradingSources[225]);
    gradedLayer225.name = "UNDLM_00225_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer225.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer225.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer225 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer225 = false;
if (editSources[225]) {
    var editLayer225 = planComp225.layers.add(editSources[225]);
    editLayer225.name = "UNDLM_00225_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer225.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer225.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer225 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity225 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer225) {
    // EDIT toujours activé quand disponible
    editLayer225.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer225) {
        gradedLayer225.enabled = false;
    }
} else if (hasGradedLayer225) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer225.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText225 = planComp225.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText225.name = "WARNING_NO_EDIT";
    warningText225.property("Transform").property("Position").setValue([1280, 200]);
    warningText225.guideLayer = true;
    
    var warningTextDoc225 = warningText225.property("Source Text").value;
    warningTextDoc225.fontSize = 32;
    warningTextDoc225.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc225.font = "Arial-BoldMT";
    warningTextDoc225.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText225.property("Source Text").setValue(warningTextDoc225);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText225 = planComp225.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00225");
    errorText225.name = "ERROR_NO_SOURCE";
    errorText225.property("Transform").property("Position").setValue([1280, 720]);
    errorText225.guideLayer = true;
    
    var errorTextDoc225 = errorText225.property("Source Text").value;
    errorTextDoc225.fontSize = 48;
    errorTextDoc225.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc225.font = "Arial-BoldMT";
    errorTextDoc225.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText225.property("Source Text").setValue(errorTextDoc225);
}

planCompositions[225] = planComp225;


// Composition pour plan 00226
var planComp226 = project.items.addComp(
    "SQ12_UNDLM_00226_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp226.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer226 = planComp226.layers.add(bgSolidComp);
bgLayer226.name = "BG_SOLID";
bgLayer226.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer226 = false;
if (gradingSources[226]) {
    var gradedLayer226 = planComp226.layers.add(gradingSources[226]);
    gradedLayer226.name = "UNDLM_00226_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer226.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer226.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer226 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer226 = false;
if (editSources[226]) {
    var editLayer226 = planComp226.layers.add(editSources[226]);
    editLayer226.name = "UNDLM_00226_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer226.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer226.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer226 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity226 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer226) {
    // EDIT toujours activé quand disponible
    editLayer226.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer226) {
        gradedLayer226.enabled = false;
    }
} else if (hasGradedLayer226) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer226.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText226 = planComp226.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText226.name = "WARNING_NO_EDIT";
    warningText226.property("Transform").property("Position").setValue([1280, 200]);
    warningText226.guideLayer = true;
    
    var warningTextDoc226 = warningText226.property("Source Text").value;
    warningTextDoc226.fontSize = 32;
    warningTextDoc226.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc226.font = "Arial-BoldMT";
    warningTextDoc226.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText226.property("Source Text").setValue(warningTextDoc226);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText226 = planComp226.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00226");
    errorText226.name = "ERROR_NO_SOURCE";
    errorText226.property("Transform").property("Position").setValue([1280, 720]);
    errorText226.guideLayer = true;
    
    var errorTextDoc226 = errorText226.property("Source Text").value;
    errorTextDoc226.fontSize = 48;
    errorTextDoc226.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc226.font = "Arial-BoldMT";
    errorTextDoc226.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText226.property("Source Text").setValue(errorTextDoc226);
}

planCompositions[226] = planComp226;


// Composition pour plan 00227
var planComp227 = project.items.addComp(
    "SQ12_UNDLM_00227_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp227.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer227 = planComp227.layers.add(bgSolidComp);
bgLayer227.name = "BG_SOLID";
bgLayer227.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer227 = false;
if (gradingSources[227]) {
    var gradedLayer227 = planComp227.layers.add(gradingSources[227]);
    gradedLayer227.name = "UNDLM_00227_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer227.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer227.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer227 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer227 = false;
if (editSources[227]) {
    var editLayer227 = planComp227.layers.add(editSources[227]);
    editLayer227.name = "UNDLM_00227_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer227.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer227.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer227 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity227 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer227) {
    // EDIT toujours activé quand disponible
    editLayer227.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer227) {
        gradedLayer227.enabled = false;
    }
} else if (hasGradedLayer227) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer227.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText227 = planComp227.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText227.name = "WARNING_NO_EDIT";
    warningText227.property("Transform").property("Position").setValue([1280, 200]);
    warningText227.guideLayer = true;
    
    var warningTextDoc227 = warningText227.property("Source Text").value;
    warningTextDoc227.fontSize = 32;
    warningTextDoc227.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc227.font = "Arial-BoldMT";
    warningTextDoc227.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText227.property("Source Text").setValue(warningTextDoc227);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText227 = planComp227.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00227");
    errorText227.name = "ERROR_NO_SOURCE";
    errorText227.property("Transform").property("Position").setValue([1280, 720]);
    errorText227.guideLayer = true;
    
    var errorTextDoc227 = errorText227.property("Source Text").value;
    errorTextDoc227.fontSize = 48;
    errorTextDoc227.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc227.font = "Arial-BoldMT";
    errorTextDoc227.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText227.property("Source Text").setValue(errorTextDoc227);
}

planCompositions[227] = planComp227;


// Composition pour plan 00228
var planComp228 = project.items.addComp(
    "SQ12_UNDLM_00228_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp228.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer228 = planComp228.layers.add(bgSolidComp);
bgLayer228.name = "BG_SOLID";
bgLayer228.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer228 = false;
if (gradingSources[228]) {
    var gradedLayer228 = planComp228.layers.add(gradingSources[228]);
    gradedLayer228.name = "UNDLM_00228_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer228.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer228.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer228 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer228 = false;
if (editSources[228]) {
    var editLayer228 = planComp228.layers.add(editSources[228]);
    editLayer228.name = "UNDLM_00228_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer228.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer228.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer228 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity228 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer228) {
    // EDIT toujours activé quand disponible
    editLayer228.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer228) {
        gradedLayer228.enabled = false;
    }
} else if (hasGradedLayer228) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer228.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText228 = planComp228.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText228.name = "WARNING_NO_EDIT";
    warningText228.property("Transform").property("Position").setValue([1280, 200]);
    warningText228.guideLayer = true;
    
    var warningTextDoc228 = warningText228.property("Source Text").value;
    warningTextDoc228.fontSize = 32;
    warningTextDoc228.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc228.font = "Arial-BoldMT";
    warningTextDoc228.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText228.property("Source Text").setValue(warningTextDoc228);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText228 = planComp228.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00228");
    errorText228.name = "ERROR_NO_SOURCE";
    errorText228.property("Transform").property("Position").setValue([1280, 720]);
    errorText228.guideLayer = true;
    
    var errorTextDoc228 = errorText228.property("Source Text").value;
    errorTextDoc228.fontSize = 48;
    errorTextDoc228.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc228.font = "Arial-BoldMT";
    errorTextDoc228.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText228.property("Source Text").setValue(errorTextDoc228);
}

planCompositions[228] = planComp228;


// Composition pour plan 00229
var planComp229 = project.items.addComp(
    "SQ12_UNDLM_00229_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp229.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer229 = planComp229.layers.add(bgSolidComp);
bgLayer229.name = "BG_SOLID";
bgLayer229.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer229 = false;
if (gradingSources[229]) {
    var gradedLayer229 = planComp229.layers.add(gradingSources[229]);
    gradedLayer229.name = "UNDLM_00229_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer229.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer229.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer229 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer229 = false;
if (editSources[229]) {
    var editLayer229 = planComp229.layers.add(editSources[229]);
    editLayer229.name = "UNDLM_00229_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer229.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer229.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer229 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity229 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer229) {
    // EDIT toujours activé quand disponible
    editLayer229.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer229) {
        gradedLayer229.enabled = false;
    }
} else if (hasGradedLayer229) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer229.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText229 = planComp229.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText229.name = "WARNING_NO_EDIT";
    warningText229.property("Transform").property("Position").setValue([1280, 200]);
    warningText229.guideLayer = true;
    
    var warningTextDoc229 = warningText229.property("Source Text").value;
    warningTextDoc229.fontSize = 32;
    warningTextDoc229.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc229.font = "Arial-BoldMT";
    warningTextDoc229.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText229.property("Source Text").setValue(warningTextDoc229);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText229 = planComp229.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00229");
    errorText229.name = "ERROR_NO_SOURCE";
    errorText229.property("Transform").property("Position").setValue([1280, 720]);
    errorText229.guideLayer = true;
    
    var errorTextDoc229 = errorText229.property("Source Text").value;
    errorTextDoc229.fontSize = 48;
    errorTextDoc229.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc229.font = "Arial-BoldMT";
    errorTextDoc229.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText229.property("Source Text").setValue(errorTextDoc229);
}

planCompositions[229] = planComp229;


// Composition pour plan 00230
var planComp230 = project.items.addComp(
    "SQ12_UNDLM_00230_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp230.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer230 = planComp230.layers.add(bgSolidComp);
bgLayer230.name = "BG_SOLID";
bgLayer230.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer230 = false;
if (gradingSources[230]) {
    var gradedLayer230 = planComp230.layers.add(gradingSources[230]);
    gradedLayer230.name = "UNDLM_00230_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer230.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer230.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer230 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer230 = false;
if (editSources[230]) {
    var editLayer230 = planComp230.layers.add(editSources[230]);
    editLayer230.name = "UNDLM_00230_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer230.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer230.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer230 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity230 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer230) {
    // EDIT toujours activé quand disponible
    editLayer230.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer230) {
        gradedLayer230.enabled = false;
    }
} else if (hasGradedLayer230) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer230.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText230 = planComp230.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText230.name = "WARNING_NO_EDIT";
    warningText230.property("Transform").property("Position").setValue([1280, 200]);
    warningText230.guideLayer = true;
    
    var warningTextDoc230 = warningText230.property("Source Text").value;
    warningTextDoc230.fontSize = 32;
    warningTextDoc230.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc230.font = "Arial-BoldMT";
    warningTextDoc230.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText230.property("Source Text").setValue(warningTextDoc230);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText230 = planComp230.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00230");
    errorText230.name = "ERROR_NO_SOURCE";
    errorText230.property("Transform").property("Position").setValue([1280, 720]);
    errorText230.guideLayer = true;
    
    var errorTextDoc230 = errorText230.property("Source Text").value;
    errorTextDoc230.fontSize = 48;
    errorTextDoc230.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc230.font = "Arial-BoldMT";
    errorTextDoc230.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText230.property("Source Text").setValue(errorTextDoc230);
}

planCompositions[230] = planComp230;


// Composition pour plan 00231
var planComp231 = project.items.addComp(
    "SQ12_UNDLM_00231_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp231.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer231 = planComp231.layers.add(bgSolidComp);
bgLayer231.name = "BG_SOLID";
bgLayer231.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer231 = false;
if (gradingSources[231]) {
    var gradedLayer231 = planComp231.layers.add(gradingSources[231]);
    gradedLayer231.name = "UNDLM_00231_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer231.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer231.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer231 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer231 = false;
if (editSources[231]) {
    var editLayer231 = planComp231.layers.add(editSources[231]);
    editLayer231.name = "UNDLM_00231_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer231.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer231.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer231 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity231 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer231) {
    // EDIT toujours activé quand disponible
    editLayer231.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer231) {
        gradedLayer231.enabled = false;
    }
} else if (hasGradedLayer231) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer231.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText231 = planComp231.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText231.name = "WARNING_NO_EDIT";
    warningText231.property("Transform").property("Position").setValue([1280, 200]);
    warningText231.guideLayer = true;
    
    var warningTextDoc231 = warningText231.property("Source Text").value;
    warningTextDoc231.fontSize = 32;
    warningTextDoc231.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc231.font = "Arial-BoldMT";
    warningTextDoc231.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText231.property("Source Text").setValue(warningTextDoc231);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText231 = planComp231.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00231");
    errorText231.name = "ERROR_NO_SOURCE";
    errorText231.property("Transform").property("Position").setValue([1280, 720]);
    errorText231.guideLayer = true;
    
    var errorTextDoc231 = errorText231.property("Source Text").value;
    errorTextDoc231.fontSize = 48;
    errorTextDoc231.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc231.font = "Arial-BoldMT";
    errorTextDoc231.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText231.property("Source Text").setValue(errorTextDoc231);
}

planCompositions[231] = planComp231;


// Composition pour plan 00232
var planComp232 = project.items.addComp(
    "SQ12_UNDLM_00232_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.56,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp232.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer232 = planComp232.layers.add(bgSolidComp);
bgLayer232.name = "BG_SOLID";
bgLayer232.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer232 = false;
if (gradingSources[232]) {
    var gradedLayer232 = planComp232.layers.add(gradingSources[232]);
    gradedLayer232.name = "UNDLM_00232_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer232.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer232.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer232 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer232 = false;
if (editSources[232]) {
    var editLayer232 = planComp232.layers.add(editSources[232]);
    editLayer232.name = "UNDLM_00232_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer232.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer232.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer232 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity232 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer232) {
    // EDIT toujours activé quand disponible
    editLayer232.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer232) {
        gradedLayer232.enabled = false;
    }
} else if (hasGradedLayer232) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer232.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText232 = planComp232.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText232.name = "WARNING_NO_EDIT";
    warningText232.property("Transform").property("Position").setValue([1280, 200]);
    warningText232.guideLayer = true;
    
    var warningTextDoc232 = warningText232.property("Source Text").value;
    warningTextDoc232.fontSize = 32;
    warningTextDoc232.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc232.font = "Arial-BoldMT";
    warningTextDoc232.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText232.property("Source Text").setValue(warningTextDoc232);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText232 = planComp232.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00232");
    errorText232.name = "ERROR_NO_SOURCE";
    errorText232.property("Transform").property("Position").setValue([1280, 720]);
    errorText232.guideLayer = true;
    
    var errorTextDoc232 = errorText232.property("Source Text").value;
    errorTextDoc232.fontSize = 48;
    errorTextDoc232.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc232.font = "Arial-BoldMT";
    errorTextDoc232.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText232.property("Source Text").setValue(errorTextDoc232);
}

planCompositions[232] = planComp232;


// Composition pour plan 00233
var planComp233 = project.items.addComp(
    "SQ12_UNDLM_00233_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp233.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer233 = planComp233.layers.add(bgSolidComp);
bgLayer233.name = "BG_SOLID";
bgLayer233.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer233 = false;
if (gradingSources[233]) {
    var gradedLayer233 = planComp233.layers.add(gradingSources[233]);
    gradedLayer233.name = "UNDLM_00233_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer233.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer233.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer233 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer233 = false;
if (editSources[233]) {
    var editLayer233 = planComp233.layers.add(editSources[233]);
    editLayer233.name = "UNDLM_00233_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer233.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer233.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer233 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity233 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer233) {
    // EDIT toujours activé quand disponible
    editLayer233.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer233) {
        gradedLayer233.enabled = false;
    }
} else if (hasGradedLayer233) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer233.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText233 = planComp233.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText233.name = "WARNING_NO_EDIT";
    warningText233.property("Transform").property("Position").setValue([1280, 200]);
    warningText233.guideLayer = true;
    
    var warningTextDoc233 = warningText233.property("Source Text").value;
    warningTextDoc233.fontSize = 32;
    warningTextDoc233.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc233.font = "Arial-BoldMT";
    warningTextDoc233.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText233.property("Source Text").setValue(warningTextDoc233);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText233 = planComp233.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00233");
    errorText233.name = "ERROR_NO_SOURCE";
    errorText233.property("Transform").property("Position").setValue([1280, 720]);
    errorText233.guideLayer = true;
    
    var errorTextDoc233 = errorText233.property("Source Text").value;
    errorTextDoc233.fontSize = 48;
    errorTextDoc233.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc233.font = "Arial-BoldMT";
    errorTextDoc233.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText233.property("Source Text").setValue(errorTextDoc233);
}

planCompositions[233] = planComp233;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ12_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    101.12, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00212 à la timeline master
if (planCompositions[212]) {
    var masterLayer212 = masterComp.layers.add(planCompositions[212]);
    masterLayer212.startTime = 0;
    masterLayer212.name = "UNDLM_00212";
    masterLayer212.label = 1; // Couleurs alternées
}

// Ajouter plan 00213 à la timeline master
if (planCompositions[213]) {
    var masterLayer213 = masterComp.layers.add(planCompositions[213]);
    masterLayer213.startTime = 7.48;
    masterLayer213.name = "UNDLM_00213";
    masterLayer213.label = 2; // Couleurs alternées
}

// Ajouter plan 00214 à la timeline master
if (planCompositions[214]) {
    var masterLayer214 = masterComp.layers.add(planCompositions[214]);
    masterLayer214.startTime = 17.44;
    masterLayer214.name = "UNDLM_00214";
    masterLayer214.label = 3; // Couleurs alternées
}

// Ajouter plan 00215 à la timeline master
if (planCompositions[215]) {
    var masterLayer215 = masterComp.layers.add(planCompositions[215]);
    masterLayer215.startTime = 21.560000000000002;
    masterLayer215.name = "UNDLM_00215";
    masterLayer215.label = 4; // Couleurs alternées
}

// Ajouter plan 00216 à la timeline master
if (planCompositions[216]) {
    var masterLayer216 = masterComp.layers.add(planCompositions[216]);
    masterLayer216.startTime = 29.400000000000002;
    masterLayer216.name = "UNDLM_00216";
    masterLayer216.label = 5; // Couleurs alternées
}

// Ajouter plan 00217 à la timeline master
if (planCompositions[217]) {
    var masterLayer217 = masterComp.layers.add(planCompositions[217]);
    masterLayer217.startTime = 35.92;
    masterLayer217.name = "UNDLM_00217";
    masterLayer217.label = 6; // Couleurs alternées
}

// Ajouter plan 00218 à la timeline master
if (planCompositions[218]) {
    var masterLayer218 = masterComp.layers.add(planCompositions[218]);
    masterLayer218.startTime = 46.68;
    masterLayer218.name = "UNDLM_00218";
    masterLayer218.label = 7; // Couleurs alternées
}

// Ajouter plan 00219 à la timeline master
if (planCompositions[219]) {
    var masterLayer219 = masterComp.layers.add(planCompositions[219]);
    masterLayer219.startTime = 48.72;
    masterLayer219.name = "UNDLM_00219";
    masterLayer219.label = 8; // Couleurs alternées
}

// Ajouter plan 00220 à la timeline master
if (planCompositions[220]) {
    var masterLayer220 = masterComp.layers.add(planCompositions[220]);
    masterLayer220.startTime = 50.879999999999995;
    masterLayer220.name = "UNDLM_00220";
    masterLayer220.label = 9; // Couleurs alternées
}

// Ajouter plan 00221 à la timeline master
if (planCompositions[221]) {
    var masterLayer221 = masterComp.layers.add(planCompositions[221]);
    masterLayer221.startTime = 53.12;
    masterLayer221.name = "UNDLM_00221";
    masterLayer221.label = 10; // Couleurs alternées
}

// Ajouter plan 00222 à la timeline master
if (planCompositions[222]) {
    var masterLayer222 = masterComp.layers.add(planCompositions[222]);
    masterLayer222.startTime = 55.72;
    masterLayer222.name = "UNDLM_00222";
    masterLayer222.label = 11; // Couleurs alternées
}

// Ajouter plan 00223 à la timeline master
if (planCompositions[223]) {
    var masterLayer223 = masterComp.layers.add(planCompositions[223]);
    masterLayer223.startTime = 62.0;
    masterLayer223.name = "UNDLM_00223";
    masterLayer223.label = 12; // Couleurs alternées
}

// Ajouter plan 00224 à la timeline master
if (planCompositions[224]) {
    var masterLayer224 = masterComp.layers.add(planCompositions[224]);
    masterLayer224.startTime = 65.12;
    masterLayer224.name = "UNDLM_00224";
    masterLayer224.label = 13; // Couleurs alternées
}

// Ajouter plan 00225 à la timeline master
if (planCompositions[225]) {
    var masterLayer225 = masterComp.layers.add(planCompositions[225]);
    masterLayer225.startTime = 68.32000000000001;
    masterLayer225.name = "UNDLM_00225";
    masterLayer225.label = 14; // Couleurs alternées
}

// Ajouter plan 00226 à la timeline master
if (planCompositions[226]) {
    var masterLayer226 = masterComp.layers.add(planCompositions[226]);
    masterLayer226.startTime = 73.0;
    masterLayer226.name = "UNDLM_00226";
    masterLayer226.label = 15; // Couleurs alternées
}

// Ajouter plan 00227 à la timeline master
if (planCompositions[227]) {
    var masterLayer227 = masterComp.layers.add(planCompositions[227]);
    masterLayer227.startTime = 74.4;
    masterLayer227.name = "UNDLM_00227";
    masterLayer227.label = 16; // Couleurs alternées
}

// Ajouter plan 00228 à la timeline master
if (planCompositions[228]) {
    var masterLayer228 = masterComp.layers.add(planCompositions[228]);
    masterLayer228.startTime = 81.4;
    masterLayer228.name = "UNDLM_00228";
    masterLayer228.label = 1; // Couleurs alternées
}

// Ajouter plan 00229 à la timeline master
if (planCompositions[229]) {
    var masterLayer229 = masterComp.layers.add(planCompositions[229]);
    masterLayer229.startTime = 87.76;
    masterLayer229.name = "UNDLM_00229";
    masterLayer229.label = 2; // Couleurs alternées
}

// Ajouter plan 00230 à la timeline master
if (planCompositions[230]) {
    var masterLayer230 = masterComp.layers.add(planCompositions[230]);
    masterLayer230.startTime = 89.0;
    masterLayer230.name = "UNDLM_00230";
    masterLayer230.label = 3; // Couleurs alternées
}

// Ajouter plan 00231 à la timeline master
if (planCompositions[231]) {
    var masterLayer231 = masterComp.layers.add(planCompositions[231]);
    masterLayer231.startTime = 90.88;
    masterLayer231.name = "UNDLM_00231";
    masterLayer231.label = 4; // Couleurs alternées
}

// Ajouter plan 00232 à la timeline master
if (planCompositions[232]) {
    var masterLayer232 = masterComp.layers.add(planCompositions[232]);
    masterLayer232.startTime = 94.36;
    masterLayer232.name = "UNDLM_00232";
    masterLayer232.label = 5; // Couleurs alternées
}

// Ajouter plan 00233 à la timeline master
if (planCompositions[233]) {
    var masterLayer233 = masterComp.layers.add(planCompositions[233]);
    masterLayer233.startTime = 97.92;
    masterLayer233.name = "UNDLM_00233";
    masterLayer233.label = 6; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ12";\n' +
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
    {start: 0, end: 7.48, name: "UNDLM_00212"},
    {start: 7.48, end: 17.44, name: "UNDLM_00213"},
    {start: 17.44, end: 21.560000000000002, name: "UNDLM_00214"},
    {start: 21.560000000000002, end: 29.400000000000002, name: "UNDLM_00215"},
    {start: 29.400000000000002, end: 35.92, name: "UNDLM_00216"},
    {start: 35.92, end: 46.68, name: "UNDLM_00217"},
    {start: 46.68, end: 48.72, name: "UNDLM_00218"},
    {start: 48.72, end: 50.879999999999995, name: "UNDLM_00219"},
    {start: 50.879999999999995, end: 53.12, name: "UNDLM_00220"},
    {start: 53.12, end: 55.72, name: "UNDLM_00221"},
    {start: 55.72, end: 62.0, name: "UNDLM_00222"},
    {start: 62.0, end: 65.12, name: "UNDLM_00223"},
    {start: 65.12, end: 68.32000000000001, name: "UNDLM_00224"},
    {start: 68.32000000000001, end: 73.0, name: "UNDLM_00225"},
    {start: 73.0, end: 74.4, name: "UNDLM_00226"},
    {start: 74.4, end: 81.4, name: "UNDLM_00227"},
    {start: 81.4, end: 87.76, name: "UNDLM_00228"},
    {start: 87.76, end: 89.0, name: "UNDLM_00229"},
    {start: 89.0, end: 90.88, name: "UNDLM_00230"},
    {start: 90.88, end: 94.36, name: "UNDLM_00231"},
    {start: 94.36, end: 97.92, name: "UNDLM_00232"},
    {start: 97.92, end: 101.12, name: "UNDLM_00233"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ12/_AE/SQ12_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 22;
var totalCount = 22;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ12 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(101.12 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ12_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ12:" + totalCount + ":" + gradedCount);
