
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ22 avec 19 plans
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


// Import plan EDIT 00380
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile380 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00380.mov");
var editFilePoignees380 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00380_AVEC_POIGNEES.mov");
var editFileBis380 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00380bis.mov");

var importSuccess380 = false;
var fileName380 = "";

// Tenter import standard
if (editFile380.exists) {
    try {
        var editFootage380 = project.importFile(new ImportOptions(editFile380));
        editFootage380.parentFolder = fromEditFolder;
        editFootage380.name = "UNDLM_00380";
        editSources[380] = editFootage380;
        editImportCount++;
        importSuccess380 = true;
        fileName380 = "UNDLM_00380.mov";
        logImportSuccess(380, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00380.mov", fileName380);
    } catch (e) {
        logImportError(380, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00380.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess380 && editFilePoignees380.exists) {
    try {
        var editFootage380 = project.importFile(new ImportOptions(editFilePoignees380));
        editFootage380.parentFolder = fromEditFolder;
        editFootage380.name = "UNDLM_00380_AVEC_POIGNEES";
        editSources[380] = editFootage380;
        editImportCount++;
        importSuccess380 = true;
        fileName380 = "UNDLM_00380_AVEC_POIGNEES.mov";
        logImportSuccess(380, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00380_AVEC_POIGNEES.mov", fileName380);
    } catch (e) {
        logImportError(380, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00380_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess380 && editFileBis380.exists) {
    try {
        var editFootage380 = project.importFile(new ImportOptions(editFileBis380));
        editFootage380.parentFolder = fromEditFolder;
        editFootage380.name = "UNDLM_00380bis";
        editSources[380] = editFootage380;
        editImportCount++;
        importSuccess380 = true;
        fileName380 = "UNDLM_00380bis.mov";
        logImportSuccess(380, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00380bis.mov", fileName380);
    } catch (e) {
        logImportError(380, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00380bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess380) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00380.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00381
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile381 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00381.mov");
var editFilePoignees381 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00381_AVEC_POIGNEES.mov");
var editFileBis381 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00381bis.mov");

var importSuccess381 = false;
var fileName381 = "";

// Tenter import standard
if (editFile381.exists) {
    try {
        var editFootage381 = project.importFile(new ImportOptions(editFile381));
        editFootage381.parentFolder = fromEditFolder;
        editFootage381.name = "UNDLM_00381";
        editSources[381] = editFootage381;
        editImportCount++;
        importSuccess381 = true;
        fileName381 = "UNDLM_00381.mov";
        logImportSuccess(381, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00381.mov", fileName381);
    } catch (e) {
        logImportError(381, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00381.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess381 && editFilePoignees381.exists) {
    try {
        var editFootage381 = project.importFile(new ImportOptions(editFilePoignees381));
        editFootage381.parentFolder = fromEditFolder;
        editFootage381.name = "UNDLM_00381_AVEC_POIGNEES";
        editSources[381] = editFootage381;
        editImportCount++;
        importSuccess381 = true;
        fileName381 = "UNDLM_00381_AVEC_POIGNEES.mov";
        logImportSuccess(381, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00381_AVEC_POIGNEES.mov", fileName381);
    } catch (e) {
        logImportError(381, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00381_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess381 && editFileBis381.exists) {
    try {
        var editFootage381 = project.importFile(new ImportOptions(editFileBis381));
        editFootage381.parentFolder = fromEditFolder;
        editFootage381.name = "UNDLM_00381bis";
        editSources[381] = editFootage381;
        editImportCount++;
        importSuccess381 = true;
        fileName381 = "UNDLM_00381bis.mov";
        logImportSuccess(381, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00381bis.mov", fileName381);
    } catch (e) {
        logImportError(381, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00381bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess381) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00381.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00382
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile382 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00382.mov");
var editFilePoignees382 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00382_AVEC_POIGNEES.mov");
var editFileBis382 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00382bis.mov");

var importSuccess382 = false;
var fileName382 = "";

// Tenter import standard
if (editFile382.exists) {
    try {
        var editFootage382 = project.importFile(new ImportOptions(editFile382));
        editFootage382.parentFolder = fromEditFolder;
        editFootage382.name = "UNDLM_00382";
        editSources[382] = editFootage382;
        editImportCount++;
        importSuccess382 = true;
        fileName382 = "UNDLM_00382.mov";
        logImportSuccess(382, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00382.mov", fileName382);
    } catch (e) {
        logImportError(382, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00382.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess382 && editFilePoignees382.exists) {
    try {
        var editFootage382 = project.importFile(new ImportOptions(editFilePoignees382));
        editFootage382.parentFolder = fromEditFolder;
        editFootage382.name = "UNDLM_00382_AVEC_POIGNEES";
        editSources[382] = editFootage382;
        editImportCount++;
        importSuccess382 = true;
        fileName382 = "UNDLM_00382_AVEC_POIGNEES.mov";
        logImportSuccess(382, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00382_AVEC_POIGNEES.mov", fileName382);
    } catch (e) {
        logImportError(382, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00382_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess382 && editFileBis382.exists) {
    try {
        var editFootage382 = project.importFile(new ImportOptions(editFileBis382));
        editFootage382.parentFolder = fromEditFolder;
        editFootage382.name = "UNDLM_00382bis";
        editSources[382] = editFootage382;
        editImportCount++;
        importSuccess382 = true;
        fileName382 = "UNDLM_00382bis.mov";
        logImportSuccess(382, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00382bis.mov", fileName382);
    } catch (e) {
        logImportError(382, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00382bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess382) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00382.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00383
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile383 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00383.mov");
var editFilePoignees383 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00383_AVEC_POIGNEES.mov");
var editFileBis383 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00383bis.mov");

var importSuccess383 = false;
var fileName383 = "";

// Tenter import standard
if (editFile383.exists) {
    try {
        var editFootage383 = project.importFile(new ImportOptions(editFile383));
        editFootage383.parentFolder = fromEditFolder;
        editFootage383.name = "UNDLM_00383";
        editSources[383] = editFootage383;
        editImportCount++;
        importSuccess383 = true;
        fileName383 = "UNDLM_00383.mov";
        logImportSuccess(383, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00383.mov", fileName383);
    } catch (e) {
        logImportError(383, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00383.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess383 && editFilePoignees383.exists) {
    try {
        var editFootage383 = project.importFile(new ImportOptions(editFilePoignees383));
        editFootage383.parentFolder = fromEditFolder;
        editFootage383.name = "UNDLM_00383_AVEC_POIGNEES";
        editSources[383] = editFootage383;
        editImportCount++;
        importSuccess383 = true;
        fileName383 = "UNDLM_00383_AVEC_POIGNEES.mov";
        logImportSuccess(383, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00383_AVEC_POIGNEES.mov", fileName383);
    } catch (e) {
        logImportError(383, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00383_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess383 && editFileBis383.exists) {
    try {
        var editFootage383 = project.importFile(new ImportOptions(editFileBis383));
        editFootage383.parentFolder = fromEditFolder;
        editFootage383.name = "UNDLM_00383bis";
        editSources[383] = editFootage383;
        editImportCount++;
        importSuccess383 = true;
        fileName383 = "UNDLM_00383bis.mov";
        logImportSuccess(383, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00383bis.mov", fileName383);
    } catch (e) {
        logImportError(383, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00383bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess383) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00383.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00384
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile384 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00384.mov");
var editFilePoignees384 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00384_AVEC_POIGNEES.mov");
var editFileBis384 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00384bis.mov");

var importSuccess384 = false;
var fileName384 = "";

// Tenter import standard
if (editFile384.exists) {
    try {
        var editFootage384 = project.importFile(new ImportOptions(editFile384));
        editFootage384.parentFolder = fromEditFolder;
        editFootage384.name = "UNDLM_00384";
        editSources[384] = editFootage384;
        editImportCount++;
        importSuccess384 = true;
        fileName384 = "UNDLM_00384.mov";
        logImportSuccess(384, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00384.mov", fileName384);
    } catch (e) {
        logImportError(384, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00384.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess384 && editFilePoignees384.exists) {
    try {
        var editFootage384 = project.importFile(new ImportOptions(editFilePoignees384));
        editFootage384.parentFolder = fromEditFolder;
        editFootage384.name = "UNDLM_00384_AVEC_POIGNEES";
        editSources[384] = editFootage384;
        editImportCount++;
        importSuccess384 = true;
        fileName384 = "UNDLM_00384_AVEC_POIGNEES.mov";
        logImportSuccess(384, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00384_AVEC_POIGNEES.mov", fileName384);
    } catch (e) {
        logImportError(384, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00384_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess384 && editFileBis384.exists) {
    try {
        var editFootage384 = project.importFile(new ImportOptions(editFileBis384));
        editFootage384.parentFolder = fromEditFolder;
        editFootage384.name = "UNDLM_00384bis";
        editSources[384] = editFootage384;
        editImportCount++;
        importSuccess384 = true;
        fileName384 = "UNDLM_00384bis.mov";
        logImportSuccess(384, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00384bis.mov", fileName384);
    } catch (e) {
        logImportError(384, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00384bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess384) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00384.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00385
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile385 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00385.mov");
var editFilePoignees385 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00385_AVEC_POIGNEES.mov");
var editFileBis385 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00385bis.mov");

var importSuccess385 = false;
var fileName385 = "";

// Tenter import standard
if (editFile385.exists) {
    try {
        var editFootage385 = project.importFile(new ImportOptions(editFile385));
        editFootage385.parentFolder = fromEditFolder;
        editFootage385.name = "UNDLM_00385";
        editSources[385] = editFootage385;
        editImportCount++;
        importSuccess385 = true;
        fileName385 = "UNDLM_00385.mov";
        logImportSuccess(385, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00385.mov", fileName385);
    } catch (e) {
        logImportError(385, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00385.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess385 && editFilePoignees385.exists) {
    try {
        var editFootage385 = project.importFile(new ImportOptions(editFilePoignees385));
        editFootage385.parentFolder = fromEditFolder;
        editFootage385.name = "UNDLM_00385_AVEC_POIGNEES";
        editSources[385] = editFootage385;
        editImportCount++;
        importSuccess385 = true;
        fileName385 = "UNDLM_00385_AVEC_POIGNEES.mov";
        logImportSuccess(385, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00385_AVEC_POIGNEES.mov", fileName385);
    } catch (e) {
        logImportError(385, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00385_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess385 && editFileBis385.exists) {
    try {
        var editFootage385 = project.importFile(new ImportOptions(editFileBis385));
        editFootage385.parentFolder = fromEditFolder;
        editFootage385.name = "UNDLM_00385bis";
        editSources[385] = editFootage385;
        editImportCount++;
        importSuccess385 = true;
        fileName385 = "UNDLM_00385bis.mov";
        logImportSuccess(385, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00385bis.mov", fileName385);
    } catch (e) {
        logImportError(385, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00385bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess385) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00385.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00386
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile386 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00386.mov");
var editFilePoignees386 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00386_AVEC_POIGNEES.mov");
var editFileBis386 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00386bis.mov");

var importSuccess386 = false;
var fileName386 = "";

// Tenter import standard
if (editFile386.exists) {
    try {
        var editFootage386 = project.importFile(new ImportOptions(editFile386));
        editFootage386.parentFolder = fromEditFolder;
        editFootage386.name = "UNDLM_00386";
        editSources[386] = editFootage386;
        editImportCount++;
        importSuccess386 = true;
        fileName386 = "UNDLM_00386.mov";
        logImportSuccess(386, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00386.mov", fileName386);
    } catch (e) {
        logImportError(386, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00386.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess386 && editFilePoignees386.exists) {
    try {
        var editFootage386 = project.importFile(new ImportOptions(editFilePoignees386));
        editFootage386.parentFolder = fromEditFolder;
        editFootage386.name = "UNDLM_00386_AVEC_POIGNEES";
        editSources[386] = editFootage386;
        editImportCount++;
        importSuccess386 = true;
        fileName386 = "UNDLM_00386_AVEC_POIGNEES.mov";
        logImportSuccess(386, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00386_AVEC_POIGNEES.mov", fileName386);
    } catch (e) {
        logImportError(386, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00386_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess386 && editFileBis386.exists) {
    try {
        var editFootage386 = project.importFile(new ImportOptions(editFileBis386));
        editFootage386.parentFolder = fromEditFolder;
        editFootage386.name = "UNDLM_00386bis";
        editSources[386] = editFootage386;
        editImportCount++;
        importSuccess386 = true;
        fileName386 = "UNDLM_00386bis.mov";
        logImportSuccess(386, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00386bis.mov", fileName386);
    } catch (e) {
        logImportError(386, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00386bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess386) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00386.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00387
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile387 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00387.mov");
var editFilePoignees387 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00387_AVEC_POIGNEES.mov");
var editFileBis387 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00387bis.mov");

var importSuccess387 = false;
var fileName387 = "";

// Tenter import standard
if (editFile387.exists) {
    try {
        var editFootage387 = project.importFile(new ImportOptions(editFile387));
        editFootage387.parentFolder = fromEditFolder;
        editFootage387.name = "UNDLM_00387";
        editSources[387] = editFootage387;
        editImportCount++;
        importSuccess387 = true;
        fileName387 = "UNDLM_00387.mov";
        logImportSuccess(387, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00387.mov", fileName387);
    } catch (e) {
        logImportError(387, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00387.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess387 && editFilePoignees387.exists) {
    try {
        var editFootage387 = project.importFile(new ImportOptions(editFilePoignees387));
        editFootage387.parentFolder = fromEditFolder;
        editFootage387.name = "UNDLM_00387_AVEC_POIGNEES";
        editSources[387] = editFootage387;
        editImportCount++;
        importSuccess387 = true;
        fileName387 = "UNDLM_00387_AVEC_POIGNEES.mov";
        logImportSuccess(387, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00387_AVEC_POIGNEES.mov", fileName387);
    } catch (e) {
        logImportError(387, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00387_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess387 && editFileBis387.exists) {
    try {
        var editFootage387 = project.importFile(new ImportOptions(editFileBis387));
        editFootage387.parentFolder = fromEditFolder;
        editFootage387.name = "UNDLM_00387bis";
        editSources[387] = editFootage387;
        editImportCount++;
        importSuccess387 = true;
        fileName387 = "UNDLM_00387bis.mov";
        logImportSuccess(387, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00387bis.mov", fileName387);
    } catch (e) {
        logImportError(387, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00387bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess387) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00387.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00388
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile388 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00388.mov");
var editFilePoignees388 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00388_AVEC_POIGNEES.mov");
var editFileBis388 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00388bis.mov");

var importSuccess388 = false;
var fileName388 = "";

// Tenter import standard
if (editFile388.exists) {
    try {
        var editFootage388 = project.importFile(new ImportOptions(editFile388));
        editFootage388.parentFolder = fromEditFolder;
        editFootage388.name = "UNDLM_00388";
        editSources[388] = editFootage388;
        editImportCount++;
        importSuccess388 = true;
        fileName388 = "UNDLM_00388.mov";
        logImportSuccess(388, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00388.mov", fileName388);
    } catch (e) {
        logImportError(388, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00388.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess388 && editFilePoignees388.exists) {
    try {
        var editFootage388 = project.importFile(new ImportOptions(editFilePoignees388));
        editFootage388.parentFolder = fromEditFolder;
        editFootage388.name = "UNDLM_00388_AVEC_POIGNEES";
        editSources[388] = editFootage388;
        editImportCount++;
        importSuccess388 = true;
        fileName388 = "UNDLM_00388_AVEC_POIGNEES.mov";
        logImportSuccess(388, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00388_AVEC_POIGNEES.mov", fileName388);
    } catch (e) {
        logImportError(388, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00388_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess388 && editFileBis388.exists) {
    try {
        var editFootage388 = project.importFile(new ImportOptions(editFileBis388));
        editFootage388.parentFolder = fromEditFolder;
        editFootage388.name = "UNDLM_00388bis";
        editSources[388] = editFootage388;
        editImportCount++;
        importSuccess388 = true;
        fileName388 = "UNDLM_00388bis.mov";
        logImportSuccess(388, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00388bis.mov", fileName388);
    } catch (e) {
        logImportError(388, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00388bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess388) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00388.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00391
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile391 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00391.mov");
var editFilePoignees391 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00391_AVEC_POIGNEES.mov");
var editFileBis391 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00391bis.mov");

var importSuccess391 = false;
var fileName391 = "";

// Tenter import standard
if (editFile391.exists) {
    try {
        var editFootage391 = project.importFile(new ImportOptions(editFile391));
        editFootage391.parentFolder = fromEditFolder;
        editFootage391.name = "UNDLM_00391";
        editSources[391] = editFootage391;
        editImportCount++;
        importSuccess391 = true;
        fileName391 = "UNDLM_00391.mov";
        logImportSuccess(391, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00391.mov", fileName391);
    } catch (e) {
        logImportError(391, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00391.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess391 && editFilePoignees391.exists) {
    try {
        var editFootage391 = project.importFile(new ImportOptions(editFilePoignees391));
        editFootage391.parentFolder = fromEditFolder;
        editFootage391.name = "UNDLM_00391_AVEC_POIGNEES";
        editSources[391] = editFootage391;
        editImportCount++;
        importSuccess391 = true;
        fileName391 = "UNDLM_00391_AVEC_POIGNEES.mov";
        logImportSuccess(391, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00391_AVEC_POIGNEES.mov", fileName391);
    } catch (e) {
        logImportError(391, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00391_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess391 && editFileBis391.exists) {
    try {
        var editFootage391 = project.importFile(new ImportOptions(editFileBis391));
        editFootage391.parentFolder = fromEditFolder;
        editFootage391.name = "UNDLM_00391bis";
        editSources[391] = editFootage391;
        editImportCount++;
        importSuccess391 = true;
        fileName391 = "UNDLM_00391bis.mov";
        logImportSuccess(391, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00391bis.mov", fileName391);
    } catch (e) {
        logImportError(391, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00391bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess391) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00391.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00392
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile392 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00392.mov");
var editFilePoignees392 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00392_AVEC_POIGNEES.mov");
var editFileBis392 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00392bis.mov");

var importSuccess392 = false;
var fileName392 = "";

// Tenter import standard
if (editFile392.exists) {
    try {
        var editFootage392 = project.importFile(new ImportOptions(editFile392));
        editFootage392.parentFolder = fromEditFolder;
        editFootage392.name = "UNDLM_00392";
        editSources[392] = editFootage392;
        editImportCount++;
        importSuccess392 = true;
        fileName392 = "UNDLM_00392.mov";
        logImportSuccess(392, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00392.mov", fileName392);
    } catch (e) {
        logImportError(392, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00392.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess392 && editFilePoignees392.exists) {
    try {
        var editFootage392 = project.importFile(new ImportOptions(editFilePoignees392));
        editFootage392.parentFolder = fromEditFolder;
        editFootage392.name = "UNDLM_00392_AVEC_POIGNEES";
        editSources[392] = editFootage392;
        editImportCount++;
        importSuccess392 = true;
        fileName392 = "UNDLM_00392_AVEC_POIGNEES.mov";
        logImportSuccess(392, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00392_AVEC_POIGNEES.mov", fileName392);
    } catch (e) {
        logImportError(392, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00392_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess392 && editFileBis392.exists) {
    try {
        var editFootage392 = project.importFile(new ImportOptions(editFileBis392));
        editFootage392.parentFolder = fromEditFolder;
        editFootage392.name = "UNDLM_00392bis";
        editSources[392] = editFootage392;
        editImportCount++;
        importSuccess392 = true;
        fileName392 = "UNDLM_00392bis.mov";
        logImportSuccess(392, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00392bis.mov", fileName392);
    } catch (e) {
        logImportError(392, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00392bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess392) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00392.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00393
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile393 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00393.mov");
var editFilePoignees393 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00393_AVEC_POIGNEES.mov");
var editFileBis393 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00393bis.mov");

var importSuccess393 = false;
var fileName393 = "";

// Tenter import standard
if (editFile393.exists) {
    try {
        var editFootage393 = project.importFile(new ImportOptions(editFile393));
        editFootage393.parentFolder = fromEditFolder;
        editFootage393.name = "UNDLM_00393";
        editSources[393] = editFootage393;
        editImportCount++;
        importSuccess393 = true;
        fileName393 = "UNDLM_00393.mov";
        logImportSuccess(393, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00393.mov", fileName393);
    } catch (e) {
        logImportError(393, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00393.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess393 && editFilePoignees393.exists) {
    try {
        var editFootage393 = project.importFile(new ImportOptions(editFilePoignees393));
        editFootage393.parentFolder = fromEditFolder;
        editFootage393.name = "UNDLM_00393_AVEC_POIGNEES";
        editSources[393] = editFootage393;
        editImportCount++;
        importSuccess393 = true;
        fileName393 = "UNDLM_00393_AVEC_POIGNEES.mov";
        logImportSuccess(393, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00393_AVEC_POIGNEES.mov", fileName393);
    } catch (e) {
        logImportError(393, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00393_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess393 && editFileBis393.exists) {
    try {
        var editFootage393 = project.importFile(new ImportOptions(editFileBis393));
        editFootage393.parentFolder = fromEditFolder;
        editFootage393.name = "UNDLM_00393bis";
        editSources[393] = editFootage393;
        editImportCount++;
        importSuccess393 = true;
        fileName393 = "UNDLM_00393bis.mov";
        logImportSuccess(393, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00393bis.mov", fileName393);
    } catch (e) {
        logImportError(393, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00393bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess393) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00393.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00394
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile394 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00394.mov");
var editFilePoignees394 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00394_AVEC_POIGNEES.mov");
var editFileBis394 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00394bis.mov");

var importSuccess394 = false;
var fileName394 = "";

// Tenter import standard
if (editFile394.exists) {
    try {
        var editFootage394 = project.importFile(new ImportOptions(editFile394));
        editFootage394.parentFolder = fromEditFolder;
        editFootage394.name = "UNDLM_00394";
        editSources[394] = editFootage394;
        editImportCount++;
        importSuccess394 = true;
        fileName394 = "UNDLM_00394.mov";
        logImportSuccess(394, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00394.mov", fileName394);
    } catch (e) {
        logImportError(394, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00394.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess394 && editFilePoignees394.exists) {
    try {
        var editFootage394 = project.importFile(new ImportOptions(editFilePoignees394));
        editFootage394.parentFolder = fromEditFolder;
        editFootage394.name = "UNDLM_00394_AVEC_POIGNEES";
        editSources[394] = editFootage394;
        editImportCount++;
        importSuccess394 = true;
        fileName394 = "UNDLM_00394_AVEC_POIGNEES.mov";
        logImportSuccess(394, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00394_AVEC_POIGNEES.mov", fileName394);
    } catch (e) {
        logImportError(394, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00394_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess394 && editFileBis394.exists) {
    try {
        var editFootage394 = project.importFile(new ImportOptions(editFileBis394));
        editFootage394.parentFolder = fromEditFolder;
        editFootage394.name = "UNDLM_00394bis";
        editSources[394] = editFootage394;
        editImportCount++;
        importSuccess394 = true;
        fileName394 = "UNDLM_00394bis.mov";
        logImportSuccess(394, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00394bis.mov", fileName394);
    } catch (e) {
        logImportError(394, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00394bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess394) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00394.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00395
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile395 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00395.mov");
var editFilePoignees395 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00395_AVEC_POIGNEES.mov");
var editFileBis395 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00395bis.mov");

var importSuccess395 = false;
var fileName395 = "";

// Tenter import standard
if (editFile395.exists) {
    try {
        var editFootage395 = project.importFile(new ImportOptions(editFile395));
        editFootage395.parentFolder = fromEditFolder;
        editFootage395.name = "UNDLM_00395";
        editSources[395] = editFootage395;
        editImportCount++;
        importSuccess395 = true;
        fileName395 = "UNDLM_00395.mov";
        logImportSuccess(395, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00395.mov", fileName395);
    } catch (e) {
        logImportError(395, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00395.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess395 && editFilePoignees395.exists) {
    try {
        var editFootage395 = project.importFile(new ImportOptions(editFilePoignees395));
        editFootage395.parentFolder = fromEditFolder;
        editFootage395.name = "UNDLM_00395_AVEC_POIGNEES";
        editSources[395] = editFootage395;
        editImportCount++;
        importSuccess395 = true;
        fileName395 = "UNDLM_00395_AVEC_POIGNEES.mov";
        logImportSuccess(395, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00395_AVEC_POIGNEES.mov", fileName395);
    } catch (e) {
        logImportError(395, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00395_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess395 && editFileBis395.exists) {
    try {
        var editFootage395 = project.importFile(new ImportOptions(editFileBis395));
        editFootage395.parentFolder = fromEditFolder;
        editFootage395.name = "UNDLM_00395bis";
        editSources[395] = editFootage395;
        editImportCount++;
        importSuccess395 = true;
        fileName395 = "UNDLM_00395bis.mov";
        logImportSuccess(395, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00395bis.mov", fileName395);
    } catch (e) {
        logImportError(395, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00395bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess395) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00395.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00396
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile396 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00396.mov");
var editFilePoignees396 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00396_AVEC_POIGNEES.mov");
var editFileBis396 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00396bis.mov");

var importSuccess396 = false;
var fileName396 = "";

// Tenter import standard
if (editFile396.exists) {
    try {
        var editFootage396 = project.importFile(new ImportOptions(editFile396));
        editFootage396.parentFolder = fromEditFolder;
        editFootage396.name = "UNDLM_00396";
        editSources[396] = editFootage396;
        editImportCount++;
        importSuccess396 = true;
        fileName396 = "UNDLM_00396.mov";
        logImportSuccess(396, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00396.mov", fileName396);
    } catch (e) {
        logImportError(396, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00396.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess396 && editFilePoignees396.exists) {
    try {
        var editFootage396 = project.importFile(new ImportOptions(editFilePoignees396));
        editFootage396.parentFolder = fromEditFolder;
        editFootage396.name = "UNDLM_00396_AVEC_POIGNEES";
        editSources[396] = editFootage396;
        editImportCount++;
        importSuccess396 = true;
        fileName396 = "UNDLM_00396_AVEC_POIGNEES.mov";
        logImportSuccess(396, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00396_AVEC_POIGNEES.mov", fileName396);
    } catch (e) {
        logImportError(396, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00396_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess396 && editFileBis396.exists) {
    try {
        var editFootage396 = project.importFile(new ImportOptions(editFileBis396));
        editFootage396.parentFolder = fromEditFolder;
        editFootage396.name = "UNDLM_00396bis";
        editSources[396] = editFootage396;
        editImportCount++;
        importSuccess396 = true;
        fileName396 = "UNDLM_00396bis.mov";
        logImportSuccess(396, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00396bis.mov", fileName396);
    } catch (e) {
        logImportError(396, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00396bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess396) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00396.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00397
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile397 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00397.mov");
var editFilePoignees397 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00397_AVEC_POIGNEES.mov");
var editFileBis397 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00397bis.mov");

var importSuccess397 = false;
var fileName397 = "";

// Tenter import standard
if (editFile397.exists) {
    try {
        var editFootage397 = project.importFile(new ImportOptions(editFile397));
        editFootage397.parentFolder = fromEditFolder;
        editFootage397.name = "UNDLM_00397";
        editSources[397] = editFootage397;
        editImportCount++;
        importSuccess397 = true;
        fileName397 = "UNDLM_00397.mov";
        logImportSuccess(397, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00397.mov", fileName397);
    } catch (e) {
        logImportError(397, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00397.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess397 && editFilePoignees397.exists) {
    try {
        var editFootage397 = project.importFile(new ImportOptions(editFilePoignees397));
        editFootage397.parentFolder = fromEditFolder;
        editFootage397.name = "UNDLM_00397_AVEC_POIGNEES";
        editSources[397] = editFootage397;
        editImportCount++;
        importSuccess397 = true;
        fileName397 = "UNDLM_00397_AVEC_POIGNEES.mov";
        logImportSuccess(397, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00397_AVEC_POIGNEES.mov", fileName397);
    } catch (e) {
        logImportError(397, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00397_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess397 && editFileBis397.exists) {
    try {
        var editFootage397 = project.importFile(new ImportOptions(editFileBis397));
        editFootage397.parentFolder = fromEditFolder;
        editFootage397.name = "UNDLM_00397bis";
        editSources[397] = editFootage397;
        editImportCount++;
        importSuccess397 = true;
        fileName397 = "UNDLM_00397bis.mov";
        logImportSuccess(397, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00397bis.mov", fileName397);
    } catch (e) {
        logImportError(397, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00397bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess397) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00397.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00398
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile398 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00398.mov");
var editFilePoignees398 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00398_AVEC_POIGNEES.mov");
var editFileBis398 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00398bis.mov");

var importSuccess398 = false;
var fileName398 = "";

// Tenter import standard
if (editFile398.exists) {
    try {
        var editFootage398 = project.importFile(new ImportOptions(editFile398));
        editFootage398.parentFolder = fromEditFolder;
        editFootage398.name = "UNDLM_00398";
        editSources[398] = editFootage398;
        editImportCount++;
        importSuccess398 = true;
        fileName398 = "UNDLM_00398.mov";
        logImportSuccess(398, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00398.mov", fileName398);
    } catch (e) {
        logImportError(398, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00398.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess398 && editFilePoignees398.exists) {
    try {
        var editFootage398 = project.importFile(new ImportOptions(editFilePoignees398));
        editFootage398.parentFolder = fromEditFolder;
        editFootage398.name = "UNDLM_00398_AVEC_POIGNEES";
        editSources[398] = editFootage398;
        editImportCount++;
        importSuccess398 = true;
        fileName398 = "UNDLM_00398_AVEC_POIGNEES.mov";
        logImportSuccess(398, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00398_AVEC_POIGNEES.mov", fileName398);
    } catch (e) {
        logImportError(398, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00398_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess398 && editFileBis398.exists) {
    try {
        var editFootage398 = project.importFile(new ImportOptions(editFileBis398));
        editFootage398.parentFolder = fromEditFolder;
        editFootage398.name = "UNDLM_00398bis";
        editSources[398] = editFootage398;
        editImportCount++;
        importSuccess398 = true;
        fileName398 = "UNDLM_00398bis.mov";
        logImportSuccess(398, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00398bis.mov", fileName398);
    } catch (e) {
        logImportError(398, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00398bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess398) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00398.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00399
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile399 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00399.mov");
var editFilePoignees399 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00399_AVEC_POIGNEES.mov");
var editFileBis399 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00399bis.mov");

var importSuccess399 = false;
var fileName399 = "";

// Tenter import standard
if (editFile399.exists) {
    try {
        var editFootage399 = project.importFile(new ImportOptions(editFile399));
        editFootage399.parentFolder = fromEditFolder;
        editFootage399.name = "UNDLM_00399";
        editSources[399] = editFootage399;
        editImportCount++;
        importSuccess399 = true;
        fileName399 = "UNDLM_00399.mov";
        logImportSuccess(399, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00399.mov", fileName399);
    } catch (e) {
        logImportError(399, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00399.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess399 && editFilePoignees399.exists) {
    try {
        var editFootage399 = project.importFile(new ImportOptions(editFilePoignees399));
        editFootage399.parentFolder = fromEditFolder;
        editFootage399.name = "UNDLM_00399_AVEC_POIGNEES";
        editSources[399] = editFootage399;
        editImportCount++;
        importSuccess399 = true;
        fileName399 = "UNDLM_00399_AVEC_POIGNEES.mov";
        logImportSuccess(399, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00399_AVEC_POIGNEES.mov", fileName399);
    } catch (e) {
        logImportError(399, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00399_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess399 && editFileBis399.exists) {
    try {
        var editFootage399 = project.importFile(new ImportOptions(editFileBis399));
        editFootage399.parentFolder = fromEditFolder;
        editFootage399.name = "UNDLM_00399bis";
        editSources[399] = editFootage399;
        editImportCount++;
        importSuccess399 = true;
        fileName399 = "UNDLM_00399bis.mov";
        logImportSuccess(399, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00399bis.mov", fileName399);
    } catch (e) {
        logImportError(399, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00399bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess399) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00399.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00400
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile400 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00400.mov");
var editFilePoignees400 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00400_AVEC_POIGNEES.mov");
var editFileBis400 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00400bis.mov");

var importSuccess400 = false;
var fileName400 = "";

// Tenter import standard
if (editFile400.exists) {
    try {
        var editFootage400 = project.importFile(new ImportOptions(editFile400));
        editFootage400.parentFolder = fromEditFolder;
        editFootage400.name = "UNDLM_00400";
        editSources[400] = editFootage400;
        editImportCount++;
        importSuccess400 = true;
        fileName400 = "UNDLM_00400.mov";
        logImportSuccess(400, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00400.mov", fileName400);
    } catch (e) {
        logImportError(400, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00400.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess400 && editFilePoignees400.exists) {
    try {
        var editFootage400 = project.importFile(new ImportOptions(editFilePoignees400));
        editFootage400.parentFolder = fromEditFolder;
        editFootage400.name = "UNDLM_00400_AVEC_POIGNEES";
        editSources[400] = editFootage400;
        editImportCount++;
        importSuccess400 = true;
        fileName400 = "UNDLM_00400_AVEC_POIGNEES.mov";
        logImportSuccess(400, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00400_AVEC_POIGNEES.mov", fileName400);
    } catch (e) {
        logImportError(400, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00400_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess400 && editFileBis400.exists) {
    try {
        var editFootage400 = project.importFile(new ImportOptions(editFileBis400));
        editFootage400.parentFolder = fromEditFolder;
        editFootage400.name = "UNDLM_00400bis";
        editSources[400] = editFootage400;
        editImportCount++;
        importSuccess400 = true;
        fileName400 = "UNDLM_00400bis.mov";
        logImportSuccess(400, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00400bis.mov", fileName400);
    } catch (e) {
        logImportError(400, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00400bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess400) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00400.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00380
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile380 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00380.mov");
var gradedFilePoignees380 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00380_AVEC_POIGNEES.mov");
var gradedFileBis380 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00380bis.mov");

var gradedImportSuccess380 = false;
var gradedFileName380 = "";

// Tenter import standard
if (gradedFile380.exists) {
    try {
        var gradedFootage380 = project.importFile(new ImportOptions(gradedFile380));
        gradedFootage380.parentFolder = fromGradingFolder;
        gradedFootage380.name = "UNDLM_00380";
        gradingSources[380] = gradedFootage380;
        gradingImportCount++;
        gradedImportSuccess380 = true;
        gradedFileName380 = "UNDLM_00380.mov";
        logImportSuccess(380, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00380.mov", gradedFileName380);
    } catch (e) {
        logImportError(380, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00380.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess380 && gradedFilePoignees380.exists) {
    try {
        var gradedFootage380 = project.importFile(new ImportOptions(gradedFilePoignees380));
        gradedFootage380.parentFolder = fromGradingFolder;
        gradedFootage380.name = "UNDLM_00380_AVEC_POIGNEES";
        gradingSources[380] = gradedFootage380;
        gradingImportCount++;
        gradedImportSuccess380 = true;
        gradedFileName380 = "UNDLM_00380_AVEC_POIGNEES.mov";
        logImportSuccess(380, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00380_AVEC_POIGNEES.mov", gradedFileName380);
    } catch (e) {
        logImportError(380, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00380_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess380 && gradedFileBis380.exists) {
    try {
        var gradedFootage380 = project.importFile(new ImportOptions(gradedFileBis380));
        gradedFootage380.parentFolder = fromGradingFolder;
        gradedFootage380.name = "UNDLM_00380bis";
        gradingSources[380] = gradedFootage380;
        gradingImportCount++;
        gradedImportSuccess380 = true;
        gradedFileName380 = "UNDLM_00380bis.mov";
        logImportSuccess(380, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00380bis.mov", gradedFileName380);
    } catch (e) {
        logImportError(380, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00380bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess380) {
    missingGradingCount++;
}

// Import plan GRADED 00381
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile381 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00381.mov");
var gradedFilePoignees381 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00381_AVEC_POIGNEES.mov");
var gradedFileBis381 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00381bis.mov");

var gradedImportSuccess381 = false;
var gradedFileName381 = "";

// Tenter import standard
if (gradedFile381.exists) {
    try {
        var gradedFootage381 = project.importFile(new ImportOptions(gradedFile381));
        gradedFootage381.parentFolder = fromGradingFolder;
        gradedFootage381.name = "UNDLM_00381";
        gradingSources[381] = gradedFootage381;
        gradingImportCount++;
        gradedImportSuccess381 = true;
        gradedFileName381 = "UNDLM_00381.mov";
        logImportSuccess(381, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00381.mov", gradedFileName381);
    } catch (e) {
        logImportError(381, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00381.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess381 && gradedFilePoignees381.exists) {
    try {
        var gradedFootage381 = project.importFile(new ImportOptions(gradedFilePoignees381));
        gradedFootage381.parentFolder = fromGradingFolder;
        gradedFootage381.name = "UNDLM_00381_AVEC_POIGNEES";
        gradingSources[381] = gradedFootage381;
        gradingImportCount++;
        gradedImportSuccess381 = true;
        gradedFileName381 = "UNDLM_00381_AVEC_POIGNEES.mov";
        logImportSuccess(381, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00381_AVEC_POIGNEES.mov", gradedFileName381);
    } catch (e) {
        logImportError(381, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00381_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess381 && gradedFileBis381.exists) {
    try {
        var gradedFootage381 = project.importFile(new ImportOptions(gradedFileBis381));
        gradedFootage381.parentFolder = fromGradingFolder;
        gradedFootage381.name = "UNDLM_00381bis";
        gradingSources[381] = gradedFootage381;
        gradingImportCount++;
        gradedImportSuccess381 = true;
        gradedFileName381 = "UNDLM_00381bis.mov";
        logImportSuccess(381, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00381bis.mov", gradedFileName381);
    } catch (e) {
        logImportError(381, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00381bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess381) {
    missingGradingCount++;
}

// Import plan GRADED 00382
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile382 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00382.mov");
var gradedFilePoignees382 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00382_AVEC_POIGNEES.mov");
var gradedFileBis382 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00382bis.mov");

var gradedImportSuccess382 = false;
var gradedFileName382 = "";

// Tenter import standard
if (gradedFile382.exists) {
    try {
        var gradedFootage382 = project.importFile(new ImportOptions(gradedFile382));
        gradedFootage382.parentFolder = fromGradingFolder;
        gradedFootage382.name = "UNDLM_00382";
        gradingSources[382] = gradedFootage382;
        gradingImportCount++;
        gradedImportSuccess382 = true;
        gradedFileName382 = "UNDLM_00382.mov";
        logImportSuccess(382, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00382.mov", gradedFileName382);
    } catch (e) {
        logImportError(382, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00382.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess382 && gradedFilePoignees382.exists) {
    try {
        var gradedFootage382 = project.importFile(new ImportOptions(gradedFilePoignees382));
        gradedFootage382.parentFolder = fromGradingFolder;
        gradedFootage382.name = "UNDLM_00382_AVEC_POIGNEES";
        gradingSources[382] = gradedFootage382;
        gradingImportCount++;
        gradedImportSuccess382 = true;
        gradedFileName382 = "UNDLM_00382_AVEC_POIGNEES.mov";
        logImportSuccess(382, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00382_AVEC_POIGNEES.mov", gradedFileName382);
    } catch (e) {
        logImportError(382, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00382_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess382 && gradedFileBis382.exists) {
    try {
        var gradedFootage382 = project.importFile(new ImportOptions(gradedFileBis382));
        gradedFootage382.parentFolder = fromGradingFolder;
        gradedFootage382.name = "UNDLM_00382bis";
        gradingSources[382] = gradedFootage382;
        gradingImportCount++;
        gradedImportSuccess382 = true;
        gradedFileName382 = "UNDLM_00382bis.mov";
        logImportSuccess(382, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00382bis.mov", gradedFileName382);
    } catch (e) {
        logImportError(382, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00382bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess382) {
    missingGradingCount++;
}

// Import plan GRADED 00383
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile383 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00383.mov");
var gradedFilePoignees383 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00383_AVEC_POIGNEES.mov");
var gradedFileBis383 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00383bis.mov");

var gradedImportSuccess383 = false;
var gradedFileName383 = "";

// Tenter import standard
if (gradedFile383.exists) {
    try {
        var gradedFootage383 = project.importFile(new ImportOptions(gradedFile383));
        gradedFootage383.parentFolder = fromGradingFolder;
        gradedFootage383.name = "UNDLM_00383";
        gradingSources[383] = gradedFootage383;
        gradingImportCount++;
        gradedImportSuccess383 = true;
        gradedFileName383 = "UNDLM_00383.mov";
        logImportSuccess(383, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00383.mov", gradedFileName383);
    } catch (e) {
        logImportError(383, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00383.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess383 && gradedFilePoignees383.exists) {
    try {
        var gradedFootage383 = project.importFile(new ImportOptions(gradedFilePoignees383));
        gradedFootage383.parentFolder = fromGradingFolder;
        gradedFootage383.name = "UNDLM_00383_AVEC_POIGNEES";
        gradingSources[383] = gradedFootage383;
        gradingImportCount++;
        gradedImportSuccess383 = true;
        gradedFileName383 = "UNDLM_00383_AVEC_POIGNEES.mov";
        logImportSuccess(383, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00383_AVEC_POIGNEES.mov", gradedFileName383);
    } catch (e) {
        logImportError(383, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00383_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess383 && gradedFileBis383.exists) {
    try {
        var gradedFootage383 = project.importFile(new ImportOptions(gradedFileBis383));
        gradedFootage383.parentFolder = fromGradingFolder;
        gradedFootage383.name = "UNDLM_00383bis";
        gradingSources[383] = gradedFootage383;
        gradingImportCount++;
        gradedImportSuccess383 = true;
        gradedFileName383 = "UNDLM_00383bis.mov";
        logImportSuccess(383, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00383bis.mov", gradedFileName383);
    } catch (e) {
        logImportError(383, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00383bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess383) {
    missingGradingCount++;
}

// Import plan GRADED 00384
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile384 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00384.mov");
var gradedFilePoignees384 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00384_AVEC_POIGNEES.mov");
var gradedFileBis384 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00384bis.mov");

var gradedImportSuccess384 = false;
var gradedFileName384 = "";

// Tenter import standard
if (gradedFile384.exists) {
    try {
        var gradedFootage384 = project.importFile(new ImportOptions(gradedFile384));
        gradedFootage384.parentFolder = fromGradingFolder;
        gradedFootage384.name = "UNDLM_00384";
        gradingSources[384] = gradedFootage384;
        gradingImportCount++;
        gradedImportSuccess384 = true;
        gradedFileName384 = "UNDLM_00384.mov";
        logImportSuccess(384, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00384.mov", gradedFileName384);
    } catch (e) {
        logImportError(384, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00384.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess384 && gradedFilePoignees384.exists) {
    try {
        var gradedFootage384 = project.importFile(new ImportOptions(gradedFilePoignees384));
        gradedFootage384.parentFolder = fromGradingFolder;
        gradedFootage384.name = "UNDLM_00384_AVEC_POIGNEES";
        gradingSources[384] = gradedFootage384;
        gradingImportCount++;
        gradedImportSuccess384 = true;
        gradedFileName384 = "UNDLM_00384_AVEC_POIGNEES.mov";
        logImportSuccess(384, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00384_AVEC_POIGNEES.mov", gradedFileName384);
    } catch (e) {
        logImportError(384, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00384_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess384 && gradedFileBis384.exists) {
    try {
        var gradedFootage384 = project.importFile(new ImportOptions(gradedFileBis384));
        gradedFootage384.parentFolder = fromGradingFolder;
        gradedFootage384.name = "UNDLM_00384bis";
        gradingSources[384] = gradedFootage384;
        gradingImportCount++;
        gradedImportSuccess384 = true;
        gradedFileName384 = "UNDLM_00384bis.mov";
        logImportSuccess(384, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00384bis.mov", gradedFileName384);
    } catch (e) {
        logImportError(384, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00384bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess384) {
    missingGradingCount++;
}

// Import plan GRADED 00385
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile385 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00385.mov");
var gradedFilePoignees385 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00385_AVEC_POIGNEES.mov");
var gradedFileBis385 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00385bis.mov");

var gradedImportSuccess385 = false;
var gradedFileName385 = "";

// Tenter import standard
if (gradedFile385.exists) {
    try {
        var gradedFootage385 = project.importFile(new ImportOptions(gradedFile385));
        gradedFootage385.parentFolder = fromGradingFolder;
        gradedFootage385.name = "UNDLM_00385";
        gradingSources[385] = gradedFootage385;
        gradingImportCount++;
        gradedImportSuccess385 = true;
        gradedFileName385 = "UNDLM_00385.mov";
        logImportSuccess(385, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00385.mov", gradedFileName385);
    } catch (e) {
        logImportError(385, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00385.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess385 && gradedFilePoignees385.exists) {
    try {
        var gradedFootage385 = project.importFile(new ImportOptions(gradedFilePoignees385));
        gradedFootage385.parentFolder = fromGradingFolder;
        gradedFootage385.name = "UNDLM_00385_AVEC_POIGNEES";
        gradingSources[385] = gradedFootage385;
        gradingImportCount++;
        gradedImportSuccess385 = true;
        gradedFileName385 = "UNDLM_00385_AVEC_POIGNEES.mov";
        logImportSuccess(385, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00385_AVEC_POIGNEES.mov", gradedFileName385);
    } catch (e) {
        logImportError(385, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00385_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess385 && gradedFileBis385.exists) {
    try {
        var gradedFootage385 = project.importFile(new ImportOptions(gradedFileBis385));
        gradedFootage385.parentFolder = fromGradingFolder;
        gradedFootage385.name = "UNDLM_00385bis";
        gradingSources[385] = gradedFootage385;
        gradingImportCount++;
        gradedImportSuccess385 = true;
        gradedFileName385 = "UNDLM_00385bis.mov";
        logImportSuccess(385, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00385bis.mov", gradedFileName385);
    } catch (e) {
        logImportError(385, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00385bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess385) {
    missingGradingCount++;
}

// Import plan GRADED 00386
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile386 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00386.mov");
var gradedFilePoignees386 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00386_AVEC_POIGNEES.mov");
var gradedFileBis386 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00386bis.mov");

var gradedImportSuccess386 = false;
var gradedFileName386 = "";

// Tenter import standard
if (gradedFile386.exists) {
    try {
        var gradedFootage386 = project.importFile(new ImportOptions(gradedFile386));
        gradedFootage386.parentFolder = fromGradingFolder;
        gradedFootage386.name = "UNDLM_00386";
        gradingSources[386] = gradedFootage386;
        gradingImportCount++;
        gradedImportSuccess386 = true;
        gradedFileName386 = "UNDLM_00386.mov";
        logImportSuccess(386, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00386.mov", gradedFileName386);
    } catch (e) {
        logImportError(386, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00386.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess386 && gradedFilePoignees386.exists) {
    try {
        var gradedFootage386 = project.importFile(new ImportOptions(gradedFilePoignees386));
        gradedFootage386.parentFolder = fromGradingFolder;
        gradedFootage386.name = "UNDLM_00386_AVEC_POIGNEES";
        gradingSources[386] = gradedFootage386;
        gradingImportCount++;
        gradedImportSuccess386 = true;
        gradedFileName386 = "UNDLM_00386_AVEC_POIGNEES.mov";
        logImportSuccess(386, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00386_AVEC_POIGNEES.mov", gradedFileName386);
    } catch (e) {
        logImportError(386, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00386_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess386 && gradedFileBis386.exists) {
    try {
        var gradedFootage386 = project.importFile(new ImportOptions(gradedFileBis386));
        gradedFootage386.parentFolder = fromGradingFolder;
        gradedFootage386.name = "UNDLM_00386bis";
        gradingSources[386] = gradedFootage386;
        gradingImportCount++;
        gradedImportSuccess386 = true;
        gradedFileName386 = "UNDLM_00386bis.mov";
        logImportSuccess(386, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00386bis.mov", gradedFileName386);
    } catch (e) {
        logImportError(386, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00386bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess386) {
    missingGradingCount++;
}

// Import plan GRADED 00387
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile387 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00387.mov");
var gradedFilePoignees387 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00387_AVEC_POIGNEES.mov");
var gradedFileBis387 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00387bis.mov");

var gradedImportSuccess387 = false;
var gradedFileName387 = "";

// Tenter import standard
if (gradedFile387.exists) {
    try {
        var gradedFootage387 = project.importFile(new ImportOptions(gradedFile387));
        gradedFootage387.parentFolder = fromGradingFolder;
        gradedFootage387.name = "UNDLM_00387";
        gradingSources[387] = gradedFootage387;
        gradingImportCount++;
        gradedImportSuccess387 = true;
        gradedFileName387 = "UNDLM_00387.mov";
        logImportSuccess(387, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00387.mov", gradedFileName387);
    } catch (e) {
        logImportError(387, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00387.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess387 && gradedFilePoignees387.exists) {
    try {
        var gradedFootage387 = project.importFile(new ImportOptions(gradedFilePoignees387));
        gradedFootage387.parentFolder = fromGradingFolder;
        gradedFootage387.name = "UNDLM_00387_AVEC_POIGNEES";
        gradingSources[387] = gradedFootage387;
        gradingImportCount++;
        gradedImportSuccess387 = true;
        gradedFileName387 = "UNDLM_00387_AVEC_POIGNEES.mov";
        logImportSuccess(387, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00387_AVEC_POIGNEES.mov", gradedFileName387);
    } catch (e) {
        logImportError(387, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00387_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess387 && gradedFileBis387.exists) {
    try {
        var gradedFootage387 = project.importFile(new ImportOptions(gradedFileBis387));
        gradedFootage387.parentFolder = fromGradingFolder;
        gradedFootage387.name = "UNDLM_00387bis";
        gradingSources[387] = gradedFootage387;
        gradingImportCount++;
        gradedImportSuccess387 = true;
        gradedFileName387 = "UNDLM_00387bis.mov";
        logImportSuccess(387, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00387bis.mov", gradedFileName387);
    } catch (e) {
        logImportError(387, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00387bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess387) {
    missingGradingCount++;
}

// Import plan GRADED 00388
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile388 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00388.mov");
var gradedFilePoignees388 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00388_AVEC_POIGNEES.mov");
var gradedFileBis388 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00388bis.mov");

var gradedImportSuccess388 = false;
var gradedFileName388 = "";

// Tenter import standard
if (gradedFile388.exists) {
    try {
        var gradedFootage388 = project.importFile(new ImportOptions(gradedFile388));
        gradedFootage388.parentFolder = fromGradingFolder;
        gradedFootage388.name = "UNDLM_00388";
        gradingSources[388] = gradedFootage388;
        gradingImportCount++;
        gradedImportSuccess388 = true;
        gradedFileName388 = "UNDLM_00388.mov";
        logImportSuccess(388, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00388.mov", gradedFileName388);
    } catch (e) {
        logImportError(388, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00388.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess388 && gradedFilePoignees388.exists) {
    try {
        var gradedFootage388 = project.importFile(new ImportOptions(gradedFilePoignees388));
        gradedFootage388.parentFolder = fromGradingFolder;
        gradedFootage388.name = "UNDLM_00388_AVEC_POIGNEES";
        gradingSources[388] = gradedFootage388;
        gradingImportCount++;
        gradedImportSuccess388 = true;
        gradedFileName388 = "UNDLM_00388_AVEC_POIGNEES.mov";
        logImportSuccess(388, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00388_AVEC_POIGNEES.mov", gradedFileName388);
    } catch (e) {
        logImportError(388, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00388_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess388 && gradedFileBis388.exists) {
    try {
        var gradedFootage388 = project.importFile(new ImportOptions(gradedFileBis388));
        gradedFootage388.parentFolder = fromGradingFolder;
        gradedFootage388.name = "UNDLM_00388bis";
        gradingSources[388] = gradedFootage388;
        gradingImportCount++;
        gradedImportSuccess388 = true;
        gradedFileName388 = "UNDLM_00388bis.mov";
        logImportSuccess(388, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00388bis.mov", gradedFileName388);
    } catch (e) {
        logImportError(388, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00388bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess388) {
    missingGradingCount++;
}

// Import plan GRADED 00391
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile391 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00391.mov");
var gradedFilePoignees391 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00391_AVEC_POIGNEES.mov");
var gradedFileBis391 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00391bis.mov");

var gradedImportSuccess391 = false;
var gradedFileName391 = "";

// Tenter import standard
if (gradedFile391.exists) {
    try {
        var gradedFootage391 = project.importFile(new ImportOptions(gradedFile391));
        gradedFootage391.parentFolder = fromGradingFolder;
        gradedFootage391.name = "UNDLM_00391";
        gradingSources[391] = gradedFootage391;
        gradingImportCount++;
        gradedImportSuccess391 = true;
        gradedFileName391 = "UNDLM_00391.mov";
        logImportSuccess(391, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00391.mov", gradedFileName391);
    } catch (e) {
        logImportError(391, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00391.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess391 && gradedFilePoignees391.exists) {
    try {
        var gradedFootage391 = project.importFile(new ImportOptions(gradedFilePoignees391));
        gradedFootage391.parentFolder = fromGradingFolder;
        gradedFootage391.name = "UNDLM_00391_AVEC_POIGNEES";
        gradingSources[391] = gradedFootage391;
        gradingImportCount++;
        gradedImportSuccess391 = true;
        gradedFileName391 = "UNDLM_00391_AVEC_POIGNEES.mov";
        logImportSuccess(391, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00391_AVEC_POIGNEES.mov", gradedFileName391);
    } catch (e) {
        logImportError(391, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00391_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess391 && gradedFileBis391.exists) {
    try {
        var gradedFootage391 = project.importFile(new ImportOptions(gradedFileBis391));
        gradedFootage391.parentFolder = fromGradingFolder;
        gradedFootage391.name = "UNDLM_00391bis";
        gradingSources[391] = gradedFootage391;
        gradingImportCount++;
        gradedImportSuccess391 = true;
        gradedFileName391 = "UNDLM_00391bis.mov";
        logImportSuccess(391, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00391bis.mov", gradedFileName391);
    } catch (e) {
        logImportError(391, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00391bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess391) {
    missingGradingCount++;
}

// Import plan GRADED 00392
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile392 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00392.mov");
var gradedFilePoignees392 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00392_AVEC_POIGNEES.mov");
var gradedFileBis392 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00392bis.mov");

var gradedImportSuccess392 = false;
var gradedFileName392 = "";

// Tenter import standard
if (gradedFile392.exists) {
    try {
        var gradedFootage392 = project.importFile(new ImportOptions(gradedFile392));
        gradedFootage392.parentFolder = fromGradingFolder;
        gradedFootage392.name = "UNDLM_00392";
        gradingSources[392] = gradedFootage392;
        gradingImportCount++;
        gradedImportSuccess392 = true;
        gradedFileName392 = "UNDLM_00392.mov";
        logImportSuccess(392, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00392.mov", gradedFileName392);
    } catch (e) {
        logImportError(392, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00392.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess392 && gradedFilePoignees392.exists) {
    try {
        var gradedFootage392 = project.importFile(new ImportOptions(gradedFilePoignees392));
        gradedFootage392.parentFolder = fromGradingFolder;
        gradedFootage392.name = "UNDLM_00392_AVEC_POIGNEES";
        gradingSources[392] = gradedFootage392;
        gradingImportCount++;
        gradedImportSuccess392 = true;
        gradedFileName392 = "UNDLM_00392_AVEC_POIGNEES.mov";
        logImportSuccess(392, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00392_AVEC_POIGNEES.mov", gradedFileName392);
    } catch (e) {
        logImportError(392, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00392_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess392 && gradedFileBis392.exists) {
    try {
        var gradedFootage392 = project.importFile(new ImportOptions(gradedFileBis392));
        gradedFootage392.parentFolder = fromGradingFolder;
        gradedFootage392.name = "UNDLM_00392bis";
        gradingSources[392] = gradedFootage392;
        gradingImportCount++;
        gradedImportSuccess392 = true;
        gradedFileName392 = "UNDLM_00392bis.mov";
        logImportSuccess(392, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00392bis.mov", gradedFileName392);
    } catch (e) {
        logImportError(392, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00392bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess392) {
    missingGradingCount++;
}

// Import plan GRADED 00393
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile393 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00393.mov");
var gradedFilePoignees393 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00393_AVEC_POIGNEES.mov");
var gradedFileBis393 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00393bis.mov");

var gradedImportSuccess393 = false;
var gradedFileName393 = "";

// Tenter import standard
if (gradedFile393.exists) {
    try {
        var gradedFootage393 = project.importFile(new ImportOptions(gradedFile393));
        gradedFootage393.parentFolder = fromGradingFolder;
        gradedFootage393.name = "UNDLM_00393";
        gradingSources[393] = gradedFootage393;
        gradingImportCount++;
        gradedImportSuccess393 = true;
        gradedFileName393 = "UNDLM_00393.mov";
        logImportSuccess(393, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00393.mov", gradedFileName393);
    } catch (e) {
        logImportError(393, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00393.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess393 && gradedFilePoignees393.exists) {
    try {
        var gradedFootage393 = project.importFile(new ImportOptions(gradedFilePoignees393));
        gradedFootage393.parentFolder = fromGradingFolder;
        gradedFootage393.name = "UNDLM_00393_AVEC_POIGNEES";
        gradingSources[393] = gradedFootage393;
        gradingImportCount++;
        gradedImportSuccess393 = true;
        gradedFileName393 = "UNDLM_00393_AVEC_POIGNEES.mov";
        logImportSuccess(393, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00393_AVEC_POIGNEES.mov", gradedFileName393);
    } catch (e) {
        logImportError(393, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00393_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess393 && gradedFileBis393.exists) {
    try {
        var gradedFootage393 = project.importFile(new ImportOptions(gradedFileBis393));
        gradedFootage393.parentFolder = fromGradingFolder;
        gradedFootage393.name = "UNDLM_00393bis";
        gradingSources[393] = gradedFootage393;
        gradingImportCount++;
        gradedImportSuccess393 = true;
        gradedFileName393 = "UNDLM_00393bis.mov";
        logImportSuccess(393, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00393bis.mov", gradedFileName393);
    } catch (e) {
        logImportError(393, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00393bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess393) {
    missingGradingCount++;
}

// Import plan GRADED 00394
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile394 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00394.mov");
var gradedFilePoignees394 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00394_AVEC_POIGNEES.mov");
var gradedFileBis394 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00394bis.mov");

var gradedImportSuccess394 = false;
var gradedFileName394 = "";

// Tenter import standard
if (gradedFile394.exists) {
    try {
        var gradedFootage394 = project.importFile(new ImportOptions(gradedFile394));
        gradedFootage394.parentFolder = fromGradingFolder;
        gradedFootage394.name = "UNDLM_00394";
        gradingSources[394] = gradedFootage394;
        gradingImportCount++;
        gradedImportSuccess394 = true;
        gradedFileName394 = "UNDLM_00394.mov";
        logImportSuccess(394, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00394.mov", gradedFileName394);
    } catch (e) {
        logImportError(394, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00394.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess394 && gradedFilePoignees394.exists) {
    try {
        var gradedFootage394 = project.importFile(new ImportOptions(gradedFilePoignees394));
        gradedFootage394.parentFolder = fromGradingFolder;
        gradedFootage394.name = "UNDLM_00394_AVEC_POIGNEES";
        gradingSources[394] = gradedFootage394;
        gradingImportCount++;
        gradedImportSuccess394 = true;
        gradedFileName394 = "UNDLM_00394_AVEC_POIGNEES.mov";
        logImportSuccess(394, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00394_AVEC_POIGNEES.mov", gradedFileName394);
    } catch (e) {
        logImportError(394, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00394_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess394 && gradedFileBis394.exists) {
    try {
        var gradedFootage394 = project.importFile(new ImportOptions(gradedFileBis394));
        gradedFootage394.parentFolder = fromGradingFolder;
        gradedFootage394.name = "UNDLM_00394bis";
        gradingSources[394] = gradedFootage394;
        gradingImportCount++;
        gradedImportSuccess394 = true;
        gradedFileName394 = "UNDLM_00394bis.mov";
        logImportSuccess(394, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00394bis.mov", gradedFileName394);
    } catch (e) {
        logImportError(394, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00394bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess394) {
    missingGradingCount++;
}

// Import plan GRADED 00395
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile395 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00395.mov");
var gradedFilePoignees395 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00395_AVEC_POIGNEES.mov");
var gradedFileBis395 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00395bis.mov");

var gradedImportSuccess395 = false;
var gradedFileName395 = "";

// Tenter import standard
if (gradedFile395.exists) {
    try {
        var gradedFootage395 = project.importFile(new ImportOptions(gradedFile395));
        gradedFootage395.parentFolder = fromGradingFolder;
        gradedFootage395.name = "UNDLM_00395";
        gradingSources[395] = gradedFootage395;
        gradingImportCount++;
        gradedImportSuccess395 = true;
        gradedFileName395 = "UNDLM_00395.mov";
        logImportSuccess(395, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00395.mov", gradedFileName395);
    } catch (e) {
        logImportError(395, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00395.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess395 && gradedFilePoignees395.exists) {
    try {
        var gradedFootage395 = project.importFile(new ImportOptions(gradedFilePoignees395));
        gradedFootage395.parentFolder = fromGradingFolder;
        gradedFootage395.name = "UNDLM_00395_AVEC_POIGNEES";
        gradingSources[395] = gradedFootage395;
        gradingImportCount++;
        gradedImportSuccess395 = true;
        gradedFileName395 = "UNDLM_00395_AVEC_POIGNEES.mov";
        logImportSuccess(395, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00395_AVEC_POIGNEES.mov", gradedFileName395);
    } catch (e) {
        logImportError(395, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00395_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess395 && gradedFileBis395.exists) {
    try {
        var gradedFootage395 = project.importFile(new ImportOptions(gradedFileBis395));
        gradedFootage395.parentFolder = fromGradingFolder;
        gradedFootage395.name = "UNDLM_00395bis";
        gradingSources[395] = gradedFootage395;
        gradingImportCount++;
        gradedImportSuccess395 = true;
        gradedFileName395 = "UNDLM_00395bis.mov";
        logImportSuccess(395, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00395bis.mov", gradedFileName395);
    } catch (e) {
        logImportError(395, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00395bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess395) {
    missingGradingCount++;
}

// Import plan GRADED 00396
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile396 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00396.mov");
var gradedFilePoignees396 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00396_AVEC_POIGNEES.mov");
var gradedFileBis396 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00396bis.mov");

var gradedImportSuccess396 = false;
var gradedFileName396 = "";

// Tenter import standard
if (gradedFile396.exists) {
    try {
        var gradedFootage396 = project.importFile(new ImportOptions(gradedFile396));
        gradedFootage396.parentFolder = fromGradingFolder;
        gradedFootage396.name = "UNDLM_00396";
        gradingSources[396] = gradedFootage396;
        gradingImportCount++;
        gradedImportSuccess396 = true;
        gradedFileName396 = "UNDLM_00396.mov";
        logImportSuccess(396, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00396.mov", gradedFileName396);
    } catch (e) {
        logImportError(396, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00396.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess396 && gradedFilePoignees396.exists) {
    try {
        var gradedFootage396 = project.importFile(new ImportOptions(gradedFilePoignees396));
        gradedFootage396.parentFolder = fromGradingFolder;
        gradedFootage396.name = "UNDLM_00396_AVEC_POIGNEES";
        gradingSources[396] = gradedFootage396;
        gradingImportCount++;
        gradedImportSuccess396 = true;
        gradedFileName396 = "UNDLM_00396_AVEC_POIGNEES.mov";
        logImportSuccess(396, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00396_AVEC_POIGNEES.mov", gradedFileName396);
    } catch (e) {
        logImportError(396, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00396_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess396 && gradedFileBis396.exists) {
    try {
        var gradedFootage396 = project.importFile(new ImportOptions(gradedFileBis396));
        gradedFootage396.parentFolder = fromGradingFolder;
        gradedFootage396.name = "UNDLM_00396bis";
        gradingSources[396] = gradedFootage396;
        gradingImportCount++;
        gradedImportSuccess396 = true;
        gradedFileName396 = "UNDLM_00396bis.mov";
        logImportSuccess(396, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00396bis.mov", gradedFileName396);
    } catch (e) {
        logImportError(396, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00396bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess396) {
    missingGradingCount++;
}

// Import plan GRADED 00397
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile397 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00397.mov");
var gradedFilePoignees397 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00397_AVEC_POIGNEES.mov");
var gradedFileBis397 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00397bis.mov");

var gradedImportSuccess397 = false;
var gradedFileName397 = "";

// Tenter import standard
if (gradedFile397.exists) {
    try {
        var gradedFootage397 = project.importFile(new ImportOptions(gradedFile397));
        gradedFootage397.parentFolder = fromGradingFolder;
        gradedFootage397.name = "UNDLM_00397";
        gradingSources[397] = gradedFootage397;
        gradingImportCount++;
        gradedImportSuccess397 = true;
        gradedFileName397 = "UNDLM_00397.mov";
        logImportSuccess(397, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00397.mov", gradedFileName397);
    } catch (e) {
        logImportError(397, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00397.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess397 && gradedFilePoignees397.exists) {
    try {
        var gradedFootage397 = project.importFile(new ImportOptions(gradedFilePoignees397));
        gradedFootage397.parentFolder = fromGradingFolder;
        gradedFootage397.name = "UNDLM_00397_AVEC_POIGNEES";
        gradingSources[397] = gradedFootage397;
        gradingImportCount++;
        gradedImportSuccess397 = true;
        gradedFileName397 = "UNDLM_00397_AVEC_POIGNEES.mov";
        logImportSuccess(397, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00397_AVEC_POIGNEES.mov", gradedFileName397);
    } catch (e) {
        logImportError(397, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00397_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess397 && gradedFileBis397.exists) {
    try {
        var gradedFootage397 = project.importFile(new ImportOptions(gradedFileBis397));
        gradedFootage397.parentFolder = fromGradingFolder;
        gradedFootage397.name = "UNDLM_00397bis";
        gradingSources[397] = gradedFootage397;
        gradingImportCount++;
        gradedImportSuccess397 = true;
        gradedFileName397 = "UNDLM_00397bis.mov";
        logImportSuccess(397, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00397bis.mov", gradedFileName397);
    } catch (e) {
        logImportError(397, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00397bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess397) {
    missingGradingCount++;
}

// Import plan GRADED 00398
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile398 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00398.mov");
var gradedFilePoignees398 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00398_AVEC_POIGNEES.mov");
var gradedFileBis398 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00398bis.mov");

var gradedImportSuccess398 = false;
var gradedFileName398 = "";

// Tenter import standard
if (gradedFile398.exists) {
    try {
        var gradedFootage398 = project.importFile(new ImportOptions(gradedFile398));
        gradedFootage398.parentFolder = fromGradingFolder;
        gradedFootage398.name = "UNDLM_00398";
        gradingSources[398] = gradedFootage398;
        gradingImportCount++;
        gradedImportSuccess398 = true;
        gradedFileName398 = "UNDLM_00398.mov";
        logImportSuccess(398, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00398.mov", gradedFileName398);
    } catch (e) {
        logImportError(398, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00398.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess398 && gradedFilePoignees398.exists) {
    try {
        var gradedFootage398 = project.importFile(new ImportOptions(gradedFilePoignees398));
        gradedFootage398.parentFolder = fromGradingFolder;
        gradedFootage398.name = "UNDLM_00398_AVEC_POIGNEES";
        gradingSources[398] = gradedFootage398;
        gradingImportCount++;
        gradedImportSuccess398 = true;
        gradedFileName398 = "UNDLM_00398_AVEC_POIGNEES.mov";
        logImportSuccess(398, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00398_AVEC_POIGNEES.mov", gradedFileName398);
    } catch (e) {
        logImportError(398, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00398_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess398 && gradedFileBis398.exists) {
    try {
        var gradedFootage398 = project.importFile(new ImportOptions(gradedFileBis398));
        gradedFootage398.parentFolder = fromGradingFolder;
        gradedFootage398.name = "UNDLM_00398bis";
        gradingSources[398] = gradedFootage398;
        gradingImportCount++;
        gradedImportSuccess398 = true;
        gradedFileName398 = "UNDLM_00398bis.mov";
        logImportSuccess(398, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00398bis.mov", gradedFileName398);
    } catch (e) {
        logImportError(398, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00398bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess398) {
    missingGradingCount++;
}

// Import plan GRADED 00399
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile399 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00399.mov");
var gradedFilePoignees399 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00399_AVEC_POIGNEES.mov");
var gradedFileBis399 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00399bis.mov");

var gradedImportSuccess399 = false;
var gradedFileName399 = "";

// Tenter import standard
if (gradedFile399.exists) {
    try {
        var gradedFootage399 = project.importFile(new ImportOptions(gradedFile399));
        gradedFootage399.parentFolder = fromGradingFolder;
        gradedFootage399.name = "UNDLM_00399";
        gradingSources[399] = gradedFootage399;
        gradingImportCount++;
        gradedImportSuccess399 = true;
        gradedFileName399 = "UNDLM_00399.mov";
        logImportSuccess(399, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00399.mov", gradedFileName399);
    } catch (e) {
        logImportError(399, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00399.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess399 && gradedFilePoignees399.exists) {
    try {
        var gradedFootage399 = project.importFile(new ImportOptions(gradedFilePoignees399));
        gradedFootage399.parentFolder = fromGradingFolder;
        gradedFootage399.name = "UNDLM_00399_AVEC_POIGNEES";
        gradingSources[399] = gradedFootage399;
        gradingImportCount++;
        gradedImportSuccess399 = true;
        gradedFileName399 = "UNDLM_00399_AVEC_POIGNEES.mov";
        logImportSuccess(399, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00399_AVEC_POIGNEES.mov", gradedFileName399);
    } catch (e) {
        logImportError(399, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00399_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess399 && gradedFileBis399.exists) {
    try {
        var gradedFootage399 = project.importFile(new ImportOptions(gradedFileBis399));
        gradedFootage399.parentFolder = fromGradingFolder;
        gradedFootage399.name = "UNDLM_00399bis";
        gradingSources[399] = gradedFootage399;
        gradingImportCount++;
        gradedImportSuccess399 = true;
        gradedFileName399 = "UNDLM_00399bis.mov";
        logImportSuccess(399, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00399bis.mov", gradedFileName399);
    } catch (e) {
        logImportError(399, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00399bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess399) {
    missingGradingCount++;
}

// Import plan GRADED 00400
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile400 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00400.mov");
var gradedFilePoignees400 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00400_AVEC_POIGNEES.mov");
var gradedFileBis400 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00400bis.mov");

var gradedImportSuccess400 = false;
var gradedFileName400 = "";

// Tenter import standard
if (gradedFile400.exists) {
    try {
        var gradedFootage400 = project.importFile(new ImportOptions(gradedFile400));
        gradedFootage400.parentFolder = fromGradingFolder;
        gradedFootage400.name = "UNDLM_00400";
        gradingSources[400] = gradedFootage400;
        gradingImportCount++;
        gradedImportSuccess400 = true;
        gradedFileName400 = "UNDLM_00400.mov";
        logImportSuccess(400, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00400.mov", gradedFileName400);
    } catch (e) {
        logImportError(400, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00400.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess400 && gradedFilePoignees400.exists) {
    try {
        var gradedFootage400 = project.importFile(new ImportOptions(gradedFilePoignees400));
        gradedFootage400.parentFolder = fromGradingFolder;
        gradedFootage400.name = "UNDLM_00400_AVEC_POIGNEES";
        gradingSources[400] = gradedFootage400;
        gradingImportCount++;
        gradedImportSuccess400 = true;
        gradedFileName400 = "UNDLM_00400_AVEC_POIGNEES.mov";
        logImportSuccess(400, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00400_AVEC_POIGNEES.mov", gradedFileName400);
    } catch (e) {
        logImportError(400, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00400_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess400 && gradedFileBis400.exists) {
    try {
        var gradedFootage400 = project.importFile(new ImportOptions(gradedFileBis400));
        gradedFootage400.parentFolder = fromGradingFolder;
        gradedFootage400.name = "UNDLM_00400bis";
        gradingSources[400] = gradedFootage400;
        gradingImportCount++;
        gradedImportSuccess400 = true;
        gradedFileName400 = "UNDLM_00400bis.mov";
        logImportSuccess(400, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00400bis.mov", gradedFileName400);
    } catch (e) {
        logImportError(400, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00400bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess400) {
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


// Composition pour plan 00380
var planComp380 = project.items.addComp(
    "SQ22_UNDLM_00380_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.32,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp380.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer380 = planComp380.layers.add(bgSolidComp);
bgLayer380.name = "BG_SOLID";
bgLayer380.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer380 = false;
if (gradingSources[380]) {
    var gradedLayer380 = planComp380.layers.add(gradingSources[380]);
    gradedLayer380.name = "UNDLM_00380_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer380.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer380.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer380 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer380 = false;
if (editSources[380]) {
    var editLayer380 = planComp380.layers.add(editSources[380]);
    editLayer380.name = "UNDLM_00380_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer380.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer380.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer380 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity380 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer380) {
    // EDIT toujours activé quand disponible
    editLayer380.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer380) {
        gradedLayer380.enabled = false;
    }
} else if (hasGradedLayer380) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer380.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText380 = planComp380.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText380.name = "WARNING_NO_EDIT";
    warningText380.property("Transform").property("Position").setValue([1280, 200]);
    warningText380.guideLayer = true;
    
    var warningTextDoc380 = warningText380.property("Source Text").value;
    warningTextDoc380.fontSize = 32;
    warningTextDoc380.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc380.font = "Arial-BoldMT";
    warningTextDoc380.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText380.property("Source Text").setValue(warningTextDoc380);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText380 = planComp380.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00380");
    errorText380.name = "ERROR_NO_SOURCE";
    errorText380.property("Transform").property("Position").setValue([1280, 720]);
    errorText380.guideLayer = true;
    
    var errorTextDoc380 = errorText380.property("Source Text").value;
    errorTextDoc380.fontSize = 48;
    errorTextDoc380.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc380.font = "Arial-BoldMT";
    errorTextDoc380.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText380.property("Source Text").setValue(errorTextDoc380);
}

planCompositions[380] = planComp380;


// Composition pour plan 00381
var planComp381 = project.items.addComp(
    "SQ22_UNDLM_00381_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp381.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer381 = planComp381.layers.add(bgSolidComp);
bgLayer381.name = "BG_SOLID";
bgLayer381.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer381 = false;
if (gradingSources[381]) {
    var gradedLayer381 = planComp381.layers.add(gradingSources[381]);
    gradedLayer381.name = "UNDLM_00381_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer381.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer381.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer381 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer381 = false;
if (editSources[381]) {
    var editLayer381 = planComp381.layers.add(editSources[381]);
    editLayer381.name = "UNDLM_00381_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer381.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer381.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer381 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity381 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer381) {
    // EDIT toujours activé quand disponible
    editLayer381.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer381) {
        gradedLayer381.enabled = false;
    }
} else if (hasGradedLayer381) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer381.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText381 = planComp381.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText381.name = "WARNING_NO_EDIT";
    warningText381.property("Transform").property("Position").setValue([1280, 200]);
    warningText381.guideLayer = true;
    
    var warningTextDoc381 = warningText381.property("Source Text").value;
    warningTextDoc381.fontSize = 32;
    warningTextDoc381.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc381.font = "Arial-BoldMT";
    warningTextDoc381.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText381.property("Source Text").setValue(warningTextDoc381);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText381 = planComp381.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00381");
    errorText381.name = "ERROR_NO_SOURCE";
    errorText381.property("Transform").property("Position").setValue([1280, 720]);
    errorText381.guideLayer = true;
    
    var errorTextDoc381 = errorText381.property("Source Text").value;
    errorTextDoc381.fontSize = 48;
    errorTextDoc381.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc381.font = "Arial-BoldMT";
    errorTextDoc381.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText381.property("Source Text").setValue(errorTextDoc381);
}

planCompositions[381] = planComp381;


// Composition pour plan 00382
var planComp382 = project.items.addComp(
    "SQ22_UNDLM_00382_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp382.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer382 = planComp382.layers.add(bgSolidComp);
bgLayer382.name = "BG_SOLID";
bgLayer382.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer382 = false;
if (gradingSources[382]) {
    var gradedLayer382 = planComp382.layers.add(gradingSources[382]);
    gradedLayer382.name = "UNDLM_00382_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer382.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer382.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer382 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer382 = false;
if (editSources[382]) {
    var editLayer382 = planComp382.layers.add(editSources[382]);
    editLayer382.name = "UNDLM_00382_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer382.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer382.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer382 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity382 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer382) {
    // EDIT toujours activé quand disponible
    editLayer382.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer382) {
        gradedLayer382.enabled = false;
    }
} else if (hasGradedLayer382) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer382.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText382 = planComp382.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText382.name = "WARNING_NO_EDIT";
    warningText382.property("Transform").property("Position").setValue([1280, 200]);
    warningText382.guideLayer = true;
    
    var warningTextDoc382 = warningText382.property("Source Text").value;
    warningTextDoc382.fontSize = 32;
    warningTextDoc382.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc382.font = "Arial-BoldMT";
    warningTextDoc382.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText382.property("Source Text").setValue(warningTextDoc382);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText382 = planComp382.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00382");
    errorText382.name = "ERROR_NO_SOURCE";
    errorText382.property("Transform").property("Position").setValue([1280, 720]);
    errorText382.guideLayer = true;
    
    var errorTextDoc382 = errorText382.property("Source Text").value;
    errorTextDoc382.fontSize = 48;
    errorTextDoc382.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc382.font = "Arial-BoldMT";
    errorTextDoc382.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText382.property("Source Text").setValue(errorTextDoc382);
}

planCompositions[382] = planComp382;


// Composition pour plan 00383
var planComp383 = project.items.addComp(
    "SQ22_UNDLM_00383_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp383.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer383 = planComp383.layers.add(bgSolidComp);
bgLayer383.name = "BG_SOLID";
bgLayer383.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer383 = false;
if (gradingSources[383]) {
    var gradedLayer383 = planComp383.layers.add(gradingSources[383]);
    gradedLayer383.name = "UNDLM_00383_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer383.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer383.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer383 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer383 = false;
if (editSources[383]) {
    var editLayer383 = planComp383.layers.add(editSources[383]);
    editLayer383.name = "UNDLM_00383_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer383.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer383.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer383 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity383 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer383) {
    // EDIT toujours activé quand disponible
    editLayer383.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer383) {
        gradedLayer383.enabled = false;
    }
} else if (hasGradedLayer383) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer383.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText383 = planComp383.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText383.name = "WARNING_NO_EDIT";
    warningText383.property("Transform").property("Position").setValue([1280, 200]);
    warningText383.guideLayer = true;
    
    var warningTextDoc383 = warningText383.property("Source Text").value;
    warningTextDoc383.fontSize = 32;
    warningTextDoc383.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc383.font = "Arial-BoldMT";
    warningTextDoc383.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText383.property("Source Text").setValue(warningTextDoc383);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText383 = planComp383.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00383");
    errorText383.name = "ERROR_NO_SOURCE";
    errorText383.property("Transform").property("Position").setValue([1280, 720]);
    errorText383.guideLayer = true;
    
    var errorTextDoc383 = errorText383.property("Source Text").value;
    errorTextDoc383.fontSize = 48;
    errorTextDoc383.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc383.font = "Arial-BoldMT";
    errorTextDoc383.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText383.property("Source Text").setValue(errorTextDoc383);
}

planCompositions[383] = planComp383;


// Composition pour plan 00384
var planComp384 = project.items.addComp(
    "SQ22_UNDLM_00384_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp384.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer384 = planComp384.layers.add(bgSolidComp);
bgLayer384.name = "BG_SOLID";
bgLayer384.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer384 = false;
if (gradingSources[384]) {
    var gradedLayer384 = planComp384.layers.add(gradingSources[384]);
    gradedLayer384.name = "UNDLM_00384_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer384.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer384.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer384 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer384 = false;
if (editSources[384]) {
    var editLayer384 = planComp384.layers.add(editSources[384]);
    editLayer384.name = "UNDLM_00384_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer384.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer384.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer384 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity384 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer384) {
    // EDIT toujours activé quand disponible
    editLayer384.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer384) {
        gradedLayer384.enabled = false;
    }
} else if (hasGradedLayer384) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer384.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText384 = planComp384.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText384.name = "WARNING_NO_EDIT";
    warningText384.property("Transform").property("Position").setValue([1280, 200]);
    warningText384.guideLayer = true;
    
    var warningTextDoc384 = warningText384.property("Source Text").value;
    warningTextDoc384.fontSize = 32;
    warningTextDoc384.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc384.font = "Arial-BoldMT";
    warningTextDoc384.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText384.property("Source Text").setValue(warningTextDoc384);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText384 = planComp384.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00384");
    errorText384.name = "ERROR_NO_SOURCE";
    errorText384.property("Transform").property("Position").setValue([1280, 720]);
    errorText384.guideLayer = true;
    
    var errorTextDoc384 = errorText384.property("Source Text").value;
    errorTextDoc384.fontSize = 48;
    errorTextDoc384.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc384.font = "Arial-BoldMT";
    errorTextDoc384.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText384.property("Source Text").setValue(errorTextDoc384);
}

planCompositions[384] = planComp384;


// Composition pour plan 00385
var planComp385 = project.items.addComp(
    "SQ22_UNDLM_00385_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    12.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp385.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer385 = planComp385.layers.add(bgSolidComp);
bgLayer385.name = "BG_SOLID";
bgLayer385.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer385 = false;
if (gradingSources[385]) {
    var gradedLayer385 = planComp385.layers.add(gradingSources[385]);
    gradedLayer385.name = "UNDLM_00385_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer385.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer385.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer385 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer385 = false;
if (editSources[385]) {
    var editLayer385 = planComp385.layers.add(editSources[385]);
    editLayer385.name = "UNDLM_00385_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer385.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer385.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer385 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity385 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer385) {
    // EDIT toujours activé quand disponible
    editLayer385.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer385) {
        gradedLayer385.enabled = false;
    }
} else if (hasGradedLayer385) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer385.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText385 = planComp385.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText385.name = "WARNING_NO_EDIT";
    warningText385.property("Transform").property("Position").setValue([1280, 200]);
    warningText385.guideLayer = true;
    
    var warningTextDoc385 = warningText385.property("Source Text").value;
    warningTextDoc385.fontSize = 32;
    warningTextDoc385.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc385.font = "Arial-BoldMT";
    warningTextDoc385.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText385.property("Source Text").setValue(warningTextDoc385);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText385 = planComp385.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00385");
    errorText385.name = "ERROR_NO_SOURCE";
    errorText385.property("Transform").property("Position").setValue([1280, 720]);
    errorText385.guideLayer = true;
    
    var errorTextDoc385 = errorText385.property("Source Text").value;
    errorTextDoc385.fontSize = 48;
    errorTextDoc385.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc385.font = "Arial-BoldMT";
    errorTextDoc385.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText385.property("Source Text").setValue(errorTextDoc385);
}

planCompositions[385] = planComp385;


// Composition pour plan 00386
var planComp386 = project.items.addComp(
    "SQ22_UNDLM_00386_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    16.56,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp386.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer386 = planComp386.layers.add(bgSolidComp);
bgLayer386.name = "BG_SOLID";
bgLayer386.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer386 = false;
if (gradingSources[386]) {
    var gradedLayer386 = planComp386.layers.add(gradingSources[386]);
    gradedLayer386.name = "UNDLM_00386_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer386.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer386.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer386 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer386 = false;
if (editSources[386]) {
    var editLayer386 = planComp386.layers.add(editSources[386]);
    editLayer386.name = "UNDLM_00386_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer386.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer386.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer386 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity386 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer386) {
    // EDIT toujours activé quand disponible
    editLayer386.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer386) {
        gradedLayer386.enabled = false;
    }
} else if (hasGradedLayer386) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer386.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText386 = planComp386.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText386.name = "WARNING_NO_EDIT";
    warningText386.property("Transform").property("Position").setValue([1280, 200]);
    warningText386.guideLayer = true;
    
    var warningTextDoc386 = warningText386.property("Source Text").value;
    warningTextDoc386.fontSize = 32;
    warningTextDoc386.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc386.font = "Arial-BoldMT";
    warningTextDoc386.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText386.property("Source Text").setValue(warningTextDoc386);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText386 = planComp386.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00386");
    errorText386.name = "ERROR_NO_SOURCE";
    errorText386.property("Transform").property("Position").setValue([1280, 720]);
    errorText386.guideLayer = true;
    
    var errorTextDoc386 = errorText386.property("Source Text").value;
    errorTextDoc386.fontSize = 48;
    errorTextDoc386.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc386.font = "Arial-BoldMT";
    errorTextDoc386.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText386.property("Source Text").setValue(errorTextDoc386);
}

planCompositions[386] = planComp386;


// Composition pour plan 00387
var planComp387 = project.items.addComp(
    "SQ22_UNDLM_00387_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp387.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer387 = planComp387.layers.add(bgSolidComp);
bgLayer387.name = "BG_SOLID";
bgLayer387.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer387 = false;
if (gradingSources[387]) {
    var gradedLayer387 = planComp387.layers.add(gradingSources[387]);
    gradedLayer387.name = "UNDLM_00387_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer387.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer387.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer387 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer387 = false;
if (editSources[387]) {
    var editLayer387 = planComp387.layers.add(editSources[387]);
    editLayer387.name = "UNDLM_00387_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer387.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer387.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer387 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity387 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer387) {
    // EDIT toujours activé quand disponible
    editLayer387.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer387) {
        gradedLayer387.enabled = false;
    }
} else if (hasGradedLayer387) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer387.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText387 = planComp387.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText387.name = "WARNING_NO_EDIT";
    warningText387.property("Transform").property("Position").setValue([1280, 200]);
    warningText387.guideLayer = true;
    
    var warningTextDoc387 = warningText387.property("Source Text").value;
    warningTextDoc387.fontSize = 32;
    warningTextDoc387.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc387.font = "Arial-BoldMT";
    warningTextDoc387.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText387.property("Source Text").setValue(warningTextDoc387);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText387 = planComp387.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00387");
    errorText387.name = "ERROR_NO_SOURCE";
    errorText387.property("Transform").property("Position").setValue([1280, 720]);
    errorText387.guideLayer = true;
    
    var errorTextDoc387 = errorText387.property("Source Text").value;
    errorTextDoc387.fontSize = 48;
    errorTextDoc387.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc387.font = "Arial-BoldMT";
    errorTextDoc387.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText387.property("Source Text").setValue(errorTextDoc387);
}

planCompositions[387] = planComp387;


// Composition pour plan 00388
var planComp388 = project.items.addComp(
    "SQ22_UNDLM_00388_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.7199999999999998,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp388.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer388 = planComp388.layers.add(bgSolidComp);
bgLayer388.name = "BG_SOLID";
bgLayer388.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer388 = false;
if (gradingSources[388]) {
    var gradedLayer388 = planComp388.layers.add(gradingSources[388]);
    gradedLayer388.name = "UNDLM_00388_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer388.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer388.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer388 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer388 = false;
if (editSources[388]) {
    var editLayer388 = planComp388.layers.add(editSources[388]);
    editLayer388.name = "UNDLM_00388_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer388.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer388.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer388 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity388 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer388) {
    // EDIT toujours activé quand disponible
    editLayer388.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer388) {
        gradedLayer388.enabled = false;
    }
} else if (hasGradedLayer388) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer388.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText388 = planComp388.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText388.name = "WARNING_NO_EDIT";
    warningText388.property("Transform").property("Position").setValue([1280, 200]);
    warningText388.guideLayer = true;
    
    var warningTextDoc388 = warningText388.property("Source Text").value;
    warningTextDoc388.fontSize = 32;
    warningTextDoc388.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc388.font = "Arial-BoldMT";
    warningTextDoc388.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText388.property("Source Text").setValue(warningTextDoc388);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText388 = planComp388.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00388");
    errorText388.name = "ERROR_NO_SOURCE";
    errorText388.property("Transform").property("Position").setValue([1280, 720]);
    errorText388.guideLayer = true;
    
    var errorTextDoc388 = errorText388.property("Source Text").value;
    errorTextDoc388.fontSize = 48;
    errorTextDoc388.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc388.font = "Arial-BoldMT";
    errorTextDoc388.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText388.property("Source Text").setValue(errorTextDoc388);
}

planCompositions[388] = planComp388;


// Composition pour plan 00391
var planComp391 = project.items.addComp(
    "SQ22_UNDLM_00391_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp391.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer391 = planComp391.layers.add(bgSolidComp);
bgLayer391.name = "BG_SOLID";
bgLayer391.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer391 = false;
if (gradingSources[391]) {
    var gradedLayer391 = planComp391.layers.add(gradingSources[391]);
    gradedLayer391.name = "UNDLM_00391_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer391.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer391.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer391 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer391 = false;
if (editSources[391]) {
    var editLayer391 = planComp391.layers.add(editSources[391]);
    editLayer391.name = "UNDLM_00391_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer391.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer391.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer391 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity391 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer391) {
    // EDIT toujours activé quand disponible
    editLayer391.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer391) {
        gradedLayer391.enabled = false;
    }
} else if (hasGradedLayer391) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer391.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText391 = planComp391.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText391.name = "WARNING_NO_EDIT";
    warningText391.property("Transform").property("Position").setValue([1280, 200]);
    warningText391.guideLayer = true;
    
    var warningTextDoc391 = warningText391.property("Source Text").value;
    warningTextDoc391.fontSize = 32;
    warningTextDoc391.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc391.font = "Arial-BoldMT";
    warningTextDoc391.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText391.property("Source Text").setValue(warningTextDoc391);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText391 = planComp391.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00391");
    errorText391.name = "ERROR_NO_SOURCE";
    errorText391.property("Transform").property("Position").setValue([1280, 720]);
    errorText391.guideLayer = true;
    
    var errorTextDoc391 = errorText391.property("Source Text").value;
    errorTextDoc391.fontSize = 48;
    errorTextDoc391.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc391.font = "Arial-BoldMT";
    errorTextDoc391.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText391.property("Source Text").setValue(errorTextDoc391);
}

planCompositions[391] = planComp391;


// Composition pour plan 00392
var planComp392 = project.items.addComp(
    "SQ22_UNDLM_00392_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp392.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer392 = planComp392.layers.add(bgSolidComp);
bgLayer392.name = "BG_SOLID";
bgLayer392.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer392 = false;
if (gradingSources[392]) {
    var gradedLayer392 = planComp392.layers.add(gradingSources[392]);
    gradedLayer392.name = "UNDLM_00392_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer392.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer392.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer392 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer392 = false;
if (editSources[392]) {
    var editLayer392 = planComp392.layers.add(editSources[392]);
    editLayer392.name = "UNDLM_00392_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer392.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer392.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer392 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity392 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer392) {
    // EDIT toujours activé quand disponible
    editLayer392.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer392) {
        gradedLayer392.enabled = false;
    }
} else if (hasGradedLayer392) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer392.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText392 = planComp392.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText392.name = "WARNING_NO_EDIT";
    warningText392.property("Transform").property("Position").setValue([1280, 200]);
    warningText392.guideLayer = true;
    
    var warningTextDoc392 = warningText392.property("Source Text").value;
    warningTextDoc392.fontSize = 32;
    warningTextDoc392.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc392.font = "Arial-BoldMT";
    warningTextDoc392.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText392.property("Source Text").setValue(warningTextDoc392);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText392 = planComp392.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00392");
    errorText392.name = "ERROR_NO_SOURCE";
    errorText392.property("Transform").property("Position").setValue([1280, 720]);
    errorText392.guideLayer = true;
    
    var errorTextDoc392 = errorText392.property("Source Text").value;
    errorTextDoc392.fontSize = 48;
    errorTextDoc392.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc392.font = "Arial-BoldMT";
    errorTextDoc392.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText392.property("Source Text").setValue(errorTextDoc392);
}

planCompositions[392] = planComp392;


// Composition pour plan 00393
var planComp393 = project.items.addComp(
    "SQ22_UNDLM_00393_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp393.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer393 = planComp393.layers.add(bgSolidComp);
bgLayer393.name = "BG_SOLID";
bgLayer393.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer393 = false;
if (gradingSources[393]) {
    var gradedLayer393 = planComp393.layers.add(gradingSources[393]);
    gradedLayer393.name = "UNDLM_00393_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer393.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer393.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer393 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer393 = false;
if (editSources[393]) {
    var editLayer393 = planComp393.layers.add(editSources[393]);
    editLayer393.name = "UNDLM_00393_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer393.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer393.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer393 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity393 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer393) {
    // EDIT toujours activé quand disponible
    editLayer393.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer393) {
        gradedLayer393.enabled = false;
    }
} else if (hasGradedLayer393) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer393.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText393 = planComp393.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText393.name = "WARNING_NO_EDIT";
    warningText393.property("Transform").property("Position").setValue([1280, 200]);
    warningText393.guideLayer = true;
    
    var warningTextDoc393 = warningText393.property("Source Text").value;
    warningTextDoc393.fontSize = 32;
    warningTextDoc393.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc393.font = "Arial-BoldMT";
    warningTextDoc393.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText393.property("Source Text").setValue(warningTextDoc393);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText393 = planComp393.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00393");
    errorText393.name = "ERROR_NO_SOURCE";
    errorText393.property("Transform").property("Position").setValue([1280, 720]);
    errorText393.guideLayer = true;
    
    var errorTextDoc393 = errorText393.property("Source Text").value;
    errorTextDoc393.fontSize = 48;
    errorTextDoc393.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc393.font = "Arial-BoldMT";
    errorTextDoc393.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText393.property("Source Text").setValue(errorTextDoc393);
}

planCompositions[393] = planComp393;


// Composition pour plan 00394
var planComp394 = project.items.addComp(
    "SQ22_UNDLM_00394_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp394.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer394 = planComp394.layers.add(bgSolidComp);
bgLayer394.name = "BG_SOLID";
bgLayer394.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer394 = false;
if (gradingSources[394]) {
    var gradedLayer394 = planComp394.layers.add(gradingSources[394]);
    gradedLayer394.name = "UNDLM_00394_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer394.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer394.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer394 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer394 = false;
if (editSources[394]) {
    var editLayer394 = planComp394.layers.add(editSources[394]);
    editLayer394.name = "UNDLM_00394_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer394.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer394.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer394 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity394 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer394) {
    // EDIT toujours activé quand disponible
    editLayer394.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer394) {
        gradedLayer394.enabled = false;
    }
} else if (hasGradedLayer394) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer394.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText394 = planComp394.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText394.name = "WARNING_NO_EDIT";
    warningText394.property("Transform").property("Position").setValue([1280, 200]);
    warningText394.guideLayer = true;
    
    var warningTextDoc394 = warningText394.property("Source Text").value;
    warningTextDoc394.fontSize = 32;
    warningTextDoc394.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc394.font = "Arial-BoldMT";
    warningTextDoc394.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText394.property("Source Text").setValue(warningTextDoc394);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText394 = planComp394.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00394");
    errorText394.name = "ERROR_NO_SOURCE";
    errorText394.property("Transform").property("Position").setValue([1280, 720]);
    errorText394.guideLayer = true;
    
    var errorTextDoc394 = errorText394.property("Source Text").value;
    errorTextDoc394.fontSize = 48;
    errorTextDoc394.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc394.font = "Arial-BoldMT";
    errorTextDoc394.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText394.property("Source Text").setValue(errorTextDoc394);
}

planCompositions[394] = planComp394;


// Composition pour plan 00395
var planComp395 = project.items.addComp(
    "SQ22_UNDLM_00395_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp395.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer395 = planComp395.layers.add(bgSolidComp);
bgLayer395.name = "BG_SOLID";
bgLayer395.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer395 = false;
if (gradingSources[395]) {
    var gradedLayer395 = planComp395.layers.add(gradingSources[395]);
    gradedLayer395.name = "UNDLM_00395_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer395.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer395.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer395 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer395 = false;
if (editSources[395]) {
    var editLayer395 = planComp395.layers.add(editSources[395]);
    editLayer395.name = "UNDLM_00395_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer395.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer395.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer395 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity395 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer395) {
    // EDIT toujours activé quand disponible
    editLayer395.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer395) {
        gradedLayer395.enabled = false;
    }
} else if (hasGradedLayer395) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer395.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText395 = planComp395.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText395.name = "WARNING_NO_EDIT";
    warningText395.property("Transform").property("Position").setValue([1280, 200]);
    warningText395.guideLayer = true;
    
    var warningTextDoc395 = warningText395.property("Source Text").value;
    warningTextDoc395.fontSize = 32;
    warningTextDoc395.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc395.font = "Arial-BoldMT";
    warningTextDoc395.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText395.property("Source Text").setValue(warningTextDoc395);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText395 = planComp395.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00395");
    errorText395.name = "ERROR_NO_SOURCE";
    errorText395.property("Transform").property("Position").setValue([1280, 720]);
    errorText395.guideLayer = true;
    
    var errorTextDoc395 = errorText395.property("Source Text").value;
    errorTextDoc395.fontSize = 48;
    errorTextDoc395.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc395.font = "Arial-BoldMT";
    errorTextDoc395.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText395.property("Source Text").setValue(errorTextDoc395);
}

planCompositions[395] = planComp395;


// Composition pour plan 00396
var planComp396 = project.items.addComp(
    "SQ22_UNDLM_00396_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    11.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp396.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer396 = planComp396.layers.add(bgSolidComp);
bgLayer396.name = "BG_SOLID";
bgLayer396.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer396 = false;
if (gradingSources[396]) {
    var gradedLayer396 = planComp396.layers.add(gradingSources[396]);
    gradedLayer396.name = "UNDLM_00396_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer396.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer396.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer396 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer396 = false;
if (editSources[396]) {
    var editLayer396 = planComp396.layers.add(editSources[396]);
    editLayer396.name = "UNDLM_00396_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer396.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer396.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer396 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity396 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer396) {
    // EDIT toujours activé quand disponible
    editLayer396.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer396) {
        gradedLayer396.enabled = false;
    }
} else if (hasGradedLayer396) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer396.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText396 = planComp396.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText396.name = "WARNING_NO_EDIT";
    warningText396.property("Transform").property("Position").setValue([1280, 200]);
    warningText396.guideLayer = true;
    
    var warningTextDoc396 = warningText396.property("Source Text").value;
    warningTextDoc396.fontSize = 32;
    warningTextDoc396.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc396.font = "Arial-BoldMT";
    warningTextDoc396.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText396.property("Source Text").setValue(warningTextDoc396);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText396 = planComp396.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00396");
    errorText396.name = "ERROR_NO_SOURCE";
    errorText396.property("Transform").property("Position").setValue([1280, 720]);
    errorText396.guideLayer = true;
    
    var errorTextDoc396 = errorText396.property("Source Text").value;
    errorTextDoc396.fontSize = 48;
    errorTextDoc396.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc396.font = "Arial-BoldMT";
    errorTextDoc396.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText396.property("Source Text").setValue(errorTextDoc396);
}

planCompositions[396] = planComp396;


// Composition pour plan 00397
var planComp397 = project.items.addComp(
    "SQ22_UNDLM_00397_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp397.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer397 = planComp397.layers.add(bgSolidComp);
bgLayer397.name = "BG_SOLID";
bgLayer397.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer397 = false;
if (gradingSources[397]) {
    var gradedLayer397 = planComp397.layers.add(gradingSources[397]);
    gradedLayer397.name = "UNDLM_00397_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer397.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer397.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer397 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer397 = false;
if (editSources[397]) {
    var editLayer397 = planComp397.layers.add(editSources[397]);
    editLayer397.name = "UNDLM_00397_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer397.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer397.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer397 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity397 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer397) {
    // EDIT toujours activé quand disponible
    editLayer397.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer397) {
        gradedLayer397.enabled = false;
    }
} else if (hasGradedLayer397) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer397.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText397 = planComp397.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText397.name = "WARNING_NO_EDIT";
    warningText397.property("Transform").property("Position").setValue([1280, 200]);
    warningText397.guideLayer = true;
    
    var warningTextDoc397 = warningText397.property("Source Text").value;
    warningTextDoc397.fontSize = 32;
    warningTextDoc397.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc397.font = "Arial-BoldMT";
    warningTextDoc397.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText397.property("Source Text").setValue(warningTextDoc397);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText397 = planComp397.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00397");
    errorText397.name = "ERROR_NO_SOURCE";
    errorText397.property("Transform").property("Position").setValue([1280, 720]);
    errorText397.guideLayer = true;
    
    var errorTextDoc397 = errorText397.property("Source Text").value;
    errorTextDoc397.fontSize = 48;
    errorTextDoc397.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc397.font = "Arial-BoldMT";
    errorTextDoc397.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText397.property("Source Text").setValue(errorTextDoc397);
}

planCompositions[397] = planComp397;


// Composition pour plan 00398
var planComp398 = project.items.addComp(
    "SQ22_UNDLM_00398_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.64,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp398.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer398 = planComp398.layers.add(bgSolidComp);
bgLayer398.name = "BG_SOLID";
bgLayer398.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer398 = false;
if (gradingSources[398]) {
    var gradedLayer398 = planComp398.layers.add(gradingSources[398]);
    gradedLayer398.name = "UNDLM_00398_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer398.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer398.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer398 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer398 = false;
if (editSources[398]) {
    var editLayer398 = planComp398.layers.add(editSources[398]);
    editLayer398.name = "UNDLM_00398_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer398.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer398.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer398 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity398 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer398) {
    // EDIT toujours activé quand disponible
    editLayer398.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer398) {
        gradedLayer398.enabled = false;
    }
} else if (hasGradedLayer398) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer398.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText398 = planComp398.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText398.name = "WARNING_NO_EDIT";
    warningText398.property("Transform").property("Position").setValue([1280, 200]);
    warningText398.guideLayer = true;
    
    var warningTextDoc398 = warningText398.property("Source Text").value;
    warningTextDoc398.fontSize = 32;
    warningTextDoc398.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc398.font = "Arial-BoldMT";
    warningTextDoc398.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText398.property("Source Text").setValue(warningTextDoc398);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText398 = planComp398.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00398");
    errorText398.name = "ERROR_NO_SOURCE";
    errorText398.property("Transform").property("Position").setValue([1280, 720]);
    errorText398.guideLayer = true;
    
    var errorTextDoc398 = errorText398.property("Source Text").value;
    errorTextDoc398.fontSize = 48;
    errorTextDoc398.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc398.font = "Arial-BoldMT";
    errorTextDoc398.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText398.property("Source Text").setValue(errorTextDoc398);
}

planCompositions[398] = planComp398;


// Composition pour plan 00399
var planComp399 = project.items.addComp(
    "SQ22_UNDLM_00399_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp399.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer399 = planComp399.layers.add(bgSolidComp);
bgLayer399.name = "BG_SOLID";
bgLayer399.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer399 = false;
if (gradingSources[399]) {
    var gradedLayer399 = planComp399.layers.add(gradingSources[399]);
    gradedLayer399.name = "UNDLM_00399_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer399.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer399.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer399 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer399 = false;
if (editSources[399]) {
    var editLayer399 = planComp399.layers.add(editSources[399]);
    editLayer399.name = "UNDLM_00399_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer399.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer399.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer399 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity399 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer399) {
    // EDIT toujours activé quand disponible
    editLayer399.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer399) {
        gradedLayer399.enabled = false;
    }
} else if (hasGradedLayer399) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer399.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText399 = planComp399.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText399.name = "WARNING_NO_EDIT";
    warningText399.property("Transform").property("Position").setValue([1280, 200]);
    warningText399.guideLayer = true;
    
    var warningTextDoc399 = warningText399.property("Source Text").value;
    warningTextDoc399.fontSize = 32;
    warningTextDoc399.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc399.font = "Arial-BoldMT";
    warningTextDoc399.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText399.property("Source Text").setValue(warningTextDoc399);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText399 = planComp399.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00399");
    errorText399.name = "ERROR_NO_SOURCE";
    errorText399.property("Transform").property("Position").setValue([1280, 720]);
    errorText399.guideLayer = true;
    
    var errorTextDoc399 = errorText399.property("Source Text").value;
    errorTextDoc399.fontSize = 48;
    errorTextDoc399.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc399.font = "Arial-BoldMT";
    errorTextDoc399.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText399.property("Source Text").setValue(errorTextDoc399);
}

planCompositions[399] = planComp399;


// Composition pour plan 00400
var planComp400 = project.items.addComp(
    "SQ22_UNDLM_00400_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp400.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer400 = planComp400.layers.add(bgSolidComp);
bgLayer400.name = "BG_SOLID";
bgLayer400.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer400 = false;
if (gradingSources[400]) {
    var gradedLayer400 = planComp400.layers.add(gradingSources[400]);
    gradedLayer400.name = "UNDLM_00400_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer400.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer400.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer400 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer400 = false;
if (editSources[400]) {
    var editLayer400 = planComp400.layers.add(editSources[400]);
    editLayer400.name = "UNDLM_00400_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer400.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer400.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer400 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity400 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer400) {
    // EDIT toujours activé quand disponible
    editLayer400.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer400) {
        gradedLayer400.enabled = false;
    }
} else if (hasGradedLayer400) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer400.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText400 = planComp400.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText400.name = "WARNING_NO_EDIT";
    warningText400.property("Transform").property("Position").setValue([1280, 200]);
    warningText400.guideLayer = true;
    
    var warningTextDoc400 = warningText400.property("Source Text").value;
    warningTextDoc400.fontSize = 32;
    warningTextDoc400.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc400.font = "Arial-BoldMT";
    warningTextDoc400.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText400.property("Source Text").setValue(warningTextDoc400);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText400 = planComp400.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00400");
    errorText400.name = "ERROR_NO_SOURCE";
    errorText400.property("Transform").property("Position").setValue([1280, 720]);
    errorText400.guideLayer = true;
    
    var errorTextDoc400 = errorText400.property("Source Text").value;
    errorTextDoc400.fontSize = 48;
    errorTextDoc400.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc400.font = "Arial-BoldMT";
    errorTextDoc400.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText400.property("Source Text").setValue(errorTextDoc400);
}

planCompositions[400] = planComp400;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ22_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    149.95999999999995, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00380 à la timeline master
if (planCompositions[380]) {
    var masterLayer380 = masterComp.layers.add(planCompositions[380]);
    masterLayer380.startTime = 0;
    masterLayer380.name = "UNDLM_00380";
    masterLayer380.label = 1; // Couleurs alternées
}

// Ajouter plan 00381 à la timeline master
if (planCompositions[381]) {
    var masterLayer381 = masterComp.layers.add(planCompositions[381]);
    masterLayer381.startTime = 5.32;
    masterLayer381.name = "UNDLM_00381";
    masterLayer381.label = 2; // Couleurs alternées
}

// Ajouter plan 00382 à la timeline master
if (planCompositions[382]) {
    var masterLayer382 = masterComp.layers.add(planCompositions[382]);
    masterLayer382.startTime = 16.0;
    masterLayer382.name = "UNDLM_00382";
    masterLayer382.label = 3; // Couleurs alternées
}

// Ajouter plan 00383 à la timeline master
if (planCompositions[383]) {
    var masterLayer383 = masterComp.layers.add(planCompositions[383]);
    masterLayer383.startTime = 25.4;
    masterLayer383.name = "UNDLM_00383";
    masterLayer383.label = 4; // Couleurs alternées
}

// Ajouter plan 00384 à la timeline master
if (planCompositions[384]) {
    var masterLayer384 = masterComp.layers.add(planCompositions[384]);
    masterLayer384.startTime = 35.36;
    masterLayer384.name = "UNDLM_00384";
    masterLayer384.label = 5; // Couleurs alternées
}

// Ajouter plan 00385 à la timeline master
if (planCompositions[385]) {
    var masterLayer385 = masterComp.layers.add(planCompositions[385]);
    masterLayer385.startTime = 44.44;
    masterLayer385.name = "UNDLM_00385";
    masterLayer385.label = 6; // Couleurs alternées
}

// Ajouter plan 00386 à la timeline master
if (planCompositions[386]) {
    var masterLayer386 = masterComp.layers.add(planCompositions[386]);
    masterLayer386.startTime = 57.199999999999996;
    masterLayer386.name = "UNDLM_00386";
    masterLayer386.label = 7; // Couleurs alternées
}

// Ajouter plan 00387 à la timeline master
if (planCompositions[387]) {
    var masterLayer387 = masterComp.layers.add(planCompositions[387]);
    masterLayer387.startTime = 73.75999999999999;
    masterLayer387.name = "UNDLM_00387";
    masterLayer387.label = 8; // Couleurs alternées
}

// Ajouter plan 00388 à la timeline master
if (planCompositions[388]) {
    var masterLayer388 = masterComp.layers.add(planCompositions[388]);
    masterLayer388.startTime = 77.88;
    masterLayer388.name = "UNDLM_00388";
    masterLayer388.label = 9; // Couleurs alternées
}

// Ajouter plan 00391 à la timeline master
if (planCompositions[391]) {
    var masterLayer391 = masterComp.layers.add(planCompositions[391]);
    masterLayer391.startTime = 80.6;
    masterLayer391.name = "UNDLM_00391";
    masterLayer391.label = 10; // Couleurs alternées
}

// Ajouter plan 00392 à la timeline master
if (planCompositions[392]) {
    var masterLayer392 = masterComp.layers.add(planCompositions[392]);
    masterLayer392.startTime = 89.8;
    masterLayer392.name = "UNDLM_00392";
    masterLayer392.label = 11; // Couleurs alternées
}

// Ajouter plan 00393 à la timeline master
if (planCompositions[393]) {
    var masterLayer393 = masterComp.layers.add(planCompositions[393]);
    masterLayer393.startTime = 94.0;
    masterLayer393.name = "UNDLM_00393";
    masterLayer393.label = 12; // Couleurs alternées
}

// Ajouter plan 00394 à la timeline master
if (planCompositions[394]) {
    var masterLayer394 = masterComp.layers.add(planCompositions[394]);
    masterLayer394.startTime = 102.03999999999999;
    masterLayer394.name = "UNDLM_00394";
    masterLayer394.label = 13; // Couleurs alternées
}

// Ajouter plan 00395 à la timeline master
if (planCompositions[395]) {
    var masterLayer395 = masterComp.layers.add(planCompositions[395]);
    masterLayer395.startTime = 104.47999999999999;
    masterLayer395.name = "UNDLM_00395";
    masterLayer395.label = 14; // Couleurs alternées
}

// Ajouter plan 00396 à la timeline master
if (planCompositions[396]) {
    var masterLayer396 = masterComp.layers.add(planCompositions[396]);
    masterLayer396.startTime = 114.27999999999999;
    masterLayer396.name = "UNDLM_00396";
    masterLayer396.label = 15; // Couleurs alternées
}

// Ajouter plan 00397 à la timeline master
if (planCompositions[397]) {
    var masterLayer397 = masterComp.layers.add(planCompositions[397]);
    masterLayer397.startTime = 125.55999999999999;
    masterLayer397.name = "UNDLM_00397";
    masterLayer397.label = 16; // Couleurs alternées
}

// Ajouter plan 00398 à la timeline master
if (planCompositions[398]) {
    var masterLayer398 = masterComp.layers.add(planCompositions[398]);
    masterLayer398.startTime = 136.07999999999998;
    masterLayer398.name = "UNDLM_00398";
    masterLayer398.label = 1; // Couleurs alternées
}

// Ajouter plan 00399 à la timeline master
if (planCompositions[399]) {
    var masterLayer399 = masterComp.layers.add(planCompositions[399]);
    masterLayer399.startTime = 140.71999999999997;
    masterLayer399.name = "UNDLM_00399";
    masterLayer399.label = 2; // Couleurs alternées
}

// Ajouter plan 00400 à la timeline master
if (planCompositions[400]) {
    var masterLayer400 = masterComp.layers.add(planCompositions[400]);
    masterLayer400.startTime = 143.75999999999996;
    masterLayer400.name = "UNDLM_00400";
    masterLayer400.label = 3; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ22";\n' +
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
    {start: 0, end: 5.32, name: "UNDLM_00380"},
    {start: 5.32, end: 16.0, name: "UNDLM_00381"},
    {start: 16.0, end: 25.4, name: "UNDLM_00382"},
    {start: 25.4, end: 35.36, name: "UNDLM_00383"},
    {start: 35.36, end: 44.44, name: "UNDLM_00384"},
    {start: 44.44, end: 57.199999999999996, name: "UNDLM_00385"},
    {start: 57.199999999999996, end: 73.75999999999999, name: "UNDLM_00386"},
    {start: 73.75999999999999, end: 77.88, name: "UNDLM_00387"},
    {start: 77.88, end: 80.6, name: "UNDLM_00388"},
    {start: 80.6, end: 89.8, name: "UNDLM_00391"},
    {start: 89.8, end: 94.0, name: "UNDLM_00392"},
    {start: 94.0, end: 102.03999999999999, name: "UNDLM_00393"},
    {start: 102.03999999999999, end: 104.47999999999999, name: "UNDLM_00394"},
    {start: 104.47999999999999, end: 114.27999999999999, name: "UNDLM_00395"},
    {start: 114.27999999999999, end: 125.55999999999999, name: "UNDLM_00396"},
    {start: 125.55999999999999, end: 136.07999999999998, name: "UNDLM_00397"},
    {start: 136.07999999999998, end: 140.71999999999997, name: "UNDLM_00398"},
    {start: 140.71999999999997, end: 143.75999999999996, name: "UNDLM_00399"},
    {start: 143.75999999999996, end: 149.95999999999995, name: "UNDLM_00400"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ22/_AE/SQ22_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 19;
var totalCount = 19;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ22 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(149.95999999999995 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ22_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ22:" + totalCount + ":" + gradedCount);
