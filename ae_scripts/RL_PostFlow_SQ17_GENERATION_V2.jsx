
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ17 avec 6 plans
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


// Import plan EDIT 00304
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile304 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00304.mov");
var editFilePoignees304 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00304_AVEC_POIGNEES.mov");
var editFileBis304 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00304bis.mov");

var importSuccess304 = false;
var fileName304 = "";

// Tenter import standard
if (editFile304.exists) {
    try {
        var editFootage304 = project.importFile(new ImportOptions(editFile304));
        editFootage304.parentFolder = fromEditFolder;
        editFootage304.name = "UNDLM_00304";
        editSources[304] = editFootage304;
        editImportCount++;
        importSuccess304 = true;
        fileName304 = "UNDLM_00304.mov";
        logImportSuccess(304, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00304.mov", fileName304);
    } catch (e) {
        logImportError(304, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00304.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess304 && editFilePoignees304.exists) {
    try {
        var editFootage304 = project.importFile(new ImportOptions(editFilePoignees304));
        editFootage304.parentFolder = fromEditFolder;
        editFootage304.name = "UNDLM_00304_AVEC_POIGNEES";
        editSources[304] = editFootage304;
        editImportCount++;
        importSuccess304 = true;
        fileName304 = "UNDLM_00304_AVEC_POIGNEES.mov";
        logImportSuccess(304, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00304_AVEC_POIGNEES.mov", fileName304);
    } catch (e) {
        logImportError(304, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00304_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess304 && editFileBis304.exists) {
    try {
        var editFootage304 = project.importFile(new ImportOptions(editFileBis304));
        editFootage304.parentFolder = fromEditFolder;
        editFootage304.name = "UNDLM_00304bis";
        editSources[304] = editFootage304;
        editImportCount++;
        importSuccess304 = true;
        fileName304 = "UNDLM_00304bis.mov";
        logImportSuccess(304, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00304bis.mov", fileName304);
    } catch (e) {
        logImportError(304, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00304bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess304) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00304.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00305
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile305 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00305.mov");
var editFilePoignees305 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00305_AVEC_POIGNEES.mov");
var editFileBis305 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00305bis.mov");

var importSuccess305 = false;
var fileName305 = "";

// Tenter import standard
if (editFile305.exists) {
    try {
        var editFootage305 = project.importFile(new ImportOptions(editFile305));
        editFootage305.parentFolder = fromEditFolder;
        editFootage305.name = "UNDLM_00305";
        editSources[305] = editFootage305;
        editImportCount++;
        importSuccess305 = true;
        fileName305 = "UNDLM_00305.mov";
        logImportSuccess(305, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00305.mov", fileName305);
    } catch (e) {
        logImportError(305, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00305.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess305 && editFilePoignees305.exists) {
    try {
        var editFootage305 = project.importFile(new ImportOptions(editFilePoignees305));
        editFootage305.parentFolder = fromEditFolder;
        editFootage305.name = "UNDLM_00305_AVEC_POIGNEES";
        editSources[305] = editFootage305;
        editImportCount++;
        importSuccess305 = true;
        fileName305 = "UNDLM_00305_AVEC_POIGNEES.mov";
        logImportSuccess(305, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00305_AVEC_POIGNEES.mov", fileName305);
    } catch (e) {
        logImportError(305, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00305_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess305 && editFileBis305.exists) {
    try {
        var editFootage305 = project.importFile(new ImportOptions(editFileBis305));
        editFootage305.parentFolder = fromEditFolder;
        editFootage305.name = "UNDLM_00305bis";
        editSources[305] = editFootage305;
        editImportCount++;
        importSuccess305 = true;
        fileName305 = "UNDLM_00305bis.mov";
        logImportSuccess(305, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00305bis.mov", fileName305);
    } catch (e) {
        logImportError(305, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00305bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess305) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00305.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00306
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile306 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00306.mov");
var editFilePoignees306 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00306_AVEC_POIGNEES.mov");
var editFileBis306 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00306bis.mov");

var importSuccess306 = false;
var fileName306 = "";

// Tenter import standard
if (editFile306.exists) {
    try {
        var editFootage306 = project.importFile(new ImportOptions(editFile306));
        editFootage306.parentFolder = fromEditFolder;
        editFootage306.name = "UNDLM_00306";
        editSources[306] = editFootage306;
        editImportCount++;
        importSuccess306 = true;
        fileName306 = "UNDLM_00306.mov";
        logImportSuccess(306, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00306.mov", fileName306);
    } catch (e) {
        logImportError(306, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00306.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess306 && editFilePoignees306.exists) {
    try {
        var editFootage306 = project.importFile(new ImportOptions(editFilePoignees306));
        editFootage306.parentFolder = fromEditFolder;
        editFootage306.name = "UNDLM_00306_AVEC_POIGNEES";
        editSources[306] = editFootage306;
        editImportCount++;
        importSuccess306 = true;
        fileName306 = "UNDLM_00306_AVEC_POIGNEES.mov";
        logImportSuccess(306, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00306_AVEC_POIGNEES.mov", fileName306);
    } catch (e) {
        logImportError(306, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00306_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess306 && editFileBis306.exists) {
    try {
        var editFootage306 = project.importFile(new ImportOptions(editFileBis306));
        editFootage306.parentFolder = fromEditFolder;
        editFootage306.name = "UNDLM_00306bis";
        editSources[306] = editFootage306;
        editImportCount++;
        importSuccess306 = true;
        fileName306 = "UNDLM_00306bis.mov";
        logImportSuccess(306, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00306bis.mov", fileName306);
    } catch (e) {
        logImportError(306, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00306bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess306) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00306.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00307
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile307 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00307.mov");
var editFilePoignees307 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00307_AVEC_POIGNEES.mov");
var editFileBis307 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00307bis.mov");

var importSuccess307 = false;
var fileName307 = "";

// Tenter import standard
if (editFile307.exists) {
    try {
        var editFootage307 = project.importFile(new ImportOptions(editFile307));
        editFootage307.parentFolder = fromEditFolder;
        editFootage307.name = "UNDLM_00307";
        editSources[307] = editFootage307;
        editImportCount++;
        importSuccess307 = true;
        fileName307 = "UNDLM_00307.mov";
        logImportSuccess(307, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00307.mov", fileName307);
    } catch (e) {
        logImportError(307, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00307.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess307 && editFilePoignees307.exists) {
    try {
        var editFootage307 = project.importFile(new ImportOptions(editFilePoignees307));
        editFootage307.parentFolder = fromEditFolder;
        editFootage307.name = "UNDLM_00307_AVEC_POIGNEES";
        editSources[307] = editFootage307;
        editImportCount++;
        importSuccess307 = true;
        fileName307 = "UNDLM_00307_AVEC_POIGNEES.mov";
        logImportSuccess(307, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00307_AVEC_POIGNEES.mov", fileName307);
    } catch (e) {
        logImportError(307, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00307_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess307 && editFileBis307.exists) {
    try {
        var editFootage307 = project.importFile(new ImportOptions(editFileBis307));
        editFootage307.parentFolder = fromEditFolder;
        editFootage307.name = "UNDLM_00307bis";
        editSources[307] = editFootage307;
        editImportCount++;
        importSuccess307 = true;
        fileName307 = "UNDLM_00307bis.mov";
        logImportSuccess(307, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00307bis.mov", fileName307);
    } catch (e) {
        logImportError(307, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00307bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess307) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00307.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00308
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile308 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00308.mov");
var editFilePoignees308 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00308_AVEC_POIGNEES.mov");
var editFileBis308 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00308bis.mov");

var importSuccess308 = false;
var fileName308 = "";

// Tenter import standard
if (editFile308.exists) {
    try {
        var editFootage308 = project.importFile(new ImportOptions(editFile308));
        editFootage308.parentFolder = fromEditFolder;
        editFootage308.name = "UNDLM_00308";
        editSources[308] = editFootage308;
        editImportCount++;
        importSuccess308 = true;
        fileName308 = "UNDLM_00308.mov";
        logImportSuccess(308, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00308.mov", fileName308);
    } catch (e) {
        logImportError(308, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00308.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess308 && editFilePoignees308.exists) {
    try {
        var editFootage308 = project.importFile(new ImportOptions(editFilePoignees308));
        editFootage308.parentFolder = fromEditFolder;
        editFootage308.name = "UNDLM_00308_AVEC_POIGNEES";
        editSources[308] = editFootage308;
        editImportCount++;
        importSuccess308 = true;
        fileName308 = "UNDLM_00308_AVEC_POIGNEES.mov";
        logImportSuccess(308, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00308_AVEC_POIGNEES.mov", fileName308);
    } catch (e) {
        logImportError(308, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00308_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess308 && editFileBis308.exists) {
    try {
        var editFootage308 = project.importFile(new ImportOptions(editFileBis308));
        editFootage308.parentFolder = fromEditFolder;
        editFootage308.name = "UNDLM_00308bis";
        editSources[308] = editFootage308;
        editImportCount++;
        importSuccess308 = true;
        fileName308 = "UNDLM_00308bis.mov";
        logImportSuccess(308, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00308bis.mov", fileName308);
    } catch (e) {
        logImportError(308, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00308bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess308) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00308.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00309
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile309 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00309.mov");
var editFilePoignees309 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00309_AVEC_POIGNEES.mov");
var editFileBis309 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00309bis.mov");

var importSuccess309 = false;
var fileName309 = "";

// Tenter import standard
if (editFile309.exists) {
    try {
        var editFootage309 = project.importFile(new ImportOptions(editFile309));
        editFootage309.parentFolder = fromEditFolder;
        editFootage309.name = "UNDLM_00309";
        editSources[309] = editFootage309;
        editImportCount++;
        importSuccess309 = true;
        fileName309 = "UNDLM_00309.mov";
        logImportSuccess(309, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00309.mov", fileName309);
    } catch (e) {
        logImportError(309, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00309.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess309 && editFilePoignees309.exists) {
    try {
        var editFootage309 = project.importFile(new ImportOptions(editFilePoignees309));
        editFootage309.parentFolder = fromEditFolder;
        editFootage309.name = "UNDLM_00309_AVEC_POIGNEES";
        editSources[309] = editFootage309;
        editImportCount++;
        importSuccess309 = true;
        fileName309 = "UNDLM_00309_AVEC_POIGNEES.mov";
        logImportSuccess(309, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00309_AVEC_POIGNEES.mov", fileName309);
    } catch (e) {
        logImportError(309, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00309_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess309 && editFileBis309.exists) {
    try {
        var editFootage309 = project.importFile(new ImportOptions(editFileBis309));
        editFootage309.parentFolder = fromEditFolder;
        editFootage309.name = "UNDLM_00309bis";
        editSources[309] = editFootage309;
        editImportCount++;
        importSuccess309 = true;
        fileName309 = "UNDLM_00309bis.mov";
        logImportSuccess(309, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00309bis.mov", fileName309);
    } catch (e) {
        logImportError(309, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00309bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess309) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00309.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00304
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile304 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00304.mov");
var gradedFilePoignees304 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00304_AVEC_POIGNEES.mov");
var gradedFileBis304 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00304bis.mov");

var gradedImportSuccess304 = false;
var gradedFileName304 = "";

// Tenter import standard
if (gradedFile304.exists) {
    try {
        var gradedFootage304 = project.importFile(new ImportOptions(gradedFile304));
        gradedFootage304.parentFolder = fromGradingFolder;
        gradedFootage304.name = "UNDLM_00304";
        gradingSources[304] = gradedFootage304;
        gradingImportCount++;
        gradedImportSuccess304 = true;
        gradedFileName304 = "UNDLM_00304.mov";
        logImportSuccess(304, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00304.mov", gradedFileName304);
    } catch (e) {
        logImportError(304, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00304.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess304 && gradedFilePoignees304.exists) {
    try {
        var gradedFootage304 = project.importFile(new ImportOptions(gradedFilePoignees304));
        gradedFootage304.parentFolder = fromGradingFolder;
        gradedFootage304.name = "UNDLM_00304_AVEC_POIGNEES";
        gradingSources[304] = gradedFootage304;
        gradingImportCount++;
        gradedImportSuccess304 = true;
        gradedFileName304 = "UNDLM_00304_AVEC_POIGNEES.mov";
        logImportSuccess(304, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00304_AVEC_POIGNEES.mov", gradedFileName304);
    } catch (e) {
        logImportError(304, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00304_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess304 && gradedFileBis304.exists) {
    try {
        var gradedFootage304 = project.importFile(new ImportOptions(gradedFileBis304));
        gradedFootage304.parentFolder = fromGradingFolder;
        gradedFootage304.name = "UNDLM_00304bis";
        gradingSources[304] = gradedFootage304;
        gradingImportCount++;
        gradedImportSuccess304 = true;
        gradedFileName304 = "UNDLM_00304bis.mov";
        logImportSuccess(304, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00304bis.mov", gradedFileName304);
    } catch (e) {
        logImportError(304, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00304bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess304) {
    missingGradingCount++;
}

// Import plan GRADED 00305
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile305 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00305.mov");
var gradedFilePoignees305 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00305_AVEC_POIGNEES.mov");
var gradedFileBis305 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00305bis.mov");

var gradedImportSuccess305 = false;
var gradedFileName305 = "";

// Tenter import standard
if (gradedFile305.exists) {
    try {
        var gradedFootage305 = project.importFile(new ImportOptions(gradedFile305));
        gradedFootage305.parentFolder = fromGradingFolder;
        gradedFootage305.name = "UNDLM_00305";
        gradingSources[305] = gradedFootage305;
        gradingImportCount++;
        gradedImportSuccess305 = true;
        gradedFileName305 = "UNDLM_00305.mov";
        logImportSuccess(305, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00305.mov", gradedFileName305);
    } catch (e) {
        logImportError(305, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00305.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess305 && gradedFilePoignees305.exists) {
    try {
        var gradedFootage305 = project.importFile(new ImportOptions(gradedFilePoignees305));
        gradedFootage305.parentFolder = fromGradingFolder;
        gradedFootage305.name = "UNDLM_00305_AVEC_POIGNEES";
        gradingSources[305] = gradedFootage305;
        gradingImportCount++;
        gradedImportSuccess305 = true;
        gradedFileName305 = "UNDLM_00305_AVEC_POIGNEES.mov";
        logImportSuccess(305, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00305_AVEC_POIGNEES.mov", gradedFileName305);
    } catch (e) {
        logImportError(305, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00305_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess305 && gradedFileBis305.exists) {
    try {
        var gradedFootage305 = project.importFile(new ImportOptions(gradedFileBis305));
        gradedFootage305.parentFolder = fromGradingFolder;
        gradedFootage305.name = "UNDLM_00305bis";
        gradingSources[305] = gradedFootage305;
        gradingImportCount++;
        gradedImportSuccess305 = true;
        gradedFileName305 = "UNDLM_00305bis.mov";
        logImportSuccess(305, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00305bis.mov", gradedFileName305);
    } catch (e) {
        logImportError(305, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00305bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess305) {
    missingGradingCount++;
}

// Import plan GRADED 00306
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile306 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00306.mov");
var gradedFilePoignees306 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00306_AVEC_POIGNEES.mov");
var gradedFileBis306 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00306bis.mov");

var gradedImportSuccess306 = false;
var gradedFileName306 = "";

// Tenter import standard
if (gradedFile306.exists) {
    try {
        var gradedFootage306 = project.importFile(new ImportOptions(gradedFile306));
        gradedFootage306.parentFolder = fromGradingFolder;
        gradedFootage306.name = "UNDLM_00306";
        gradingSources[306] = gradedFootage306;
        gradingImportCount++;
        gradedImportSuccess306 = true;
        gradedFileName306 = "UNDLM_00306.mov";
        logImportSuccess(306, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00306.mov", gradedFileName306);
    } catch (e) {
        logImportError(306, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00306.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess306 && gradedFilePoignees306.exists) {
    try {
        var gradedFootage306 = project.importFile(new ImportOptions(gradedFilePoignees306));
        gradedFootage306.parentFolder = fromGradingFolder;
        gradedFootage306.name = "UNDLM_00306_AVEC_POIGNEES";
        gradingSources[306] = gradedFootage306;
        gradingImportCount++;
        gradedImportSuccess306 = true;
        gradedFileName306 = "UNDLM_00306_AVEC_POIGNEES.mov";
        logImportSuccess(306, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00306_AVEC_POIGNEES.mov", gradedFileName306);
    } catch (e) {
        logImportError(306, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00306_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess306 && gradedFileBis306.exists) {
    try {
        var gradedFootage306 = project.importFile(new ImportOptions(gradedFileBis306));
        gradedFootage306.parentFolder = fromGradingFolder;
        gradedFootage306.name = "UNDLM_00306bis";
        gradingSources[306] = gradedFootage306;
        gradingImportCount++;
        gradedImportSuccess306 = true;
        gradedFileName306 = "UNDLM_00306bis.mov";
        logImportSuccess(306, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00306bis.mov", gradedFileName306);
    } catch (e) {
        logImportError(306, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00306bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess306) {
    missingGradingCount++;
}

// Import plan GRADED 00307
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile307 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00307.mov");
var gradedFilePoignees307 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00307_AVEC_POIGNEES.mov");
var gradedFileBis307 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00307bis.mov");

var gradedImportSuccess307 = false;
var gradedFileName307 = "";

// Tenter import standard
if (gradedFile307.exists) {
    try {
        var gradedFootage307 = project.importFile(new ImportOptions(gradedFile307));
        gradedFootage307.parentFolder = fromGradingFolder;
        gradedFootage307.name = "UNDLM_00307";
        gradingSources[307] = gradedFootage307;
        gradingImportCount++;
        gradedImportSuccess307 = true;
        gradedFileName307 = "UNDLM_00307.mov";
        logImportSuccess(307, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00307.mov", gradedFileName307);
    } catch (e) {
        logImportError(307, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00307.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess307 && gradedFilePoignees307.exists) {
    try {
        var gradedFootage307 = project.importFile(new ImportOptions(gradedFilePoignees307));
        gradedFootage307.parentFolder = fromGradingFolder;
        gradedFootage307.name = "UNDLM_00307_AVEC_POIGNEES";
        gradingSources[307] = gradedFootage307;
        gradingImportCount++;
        gradedImportSuccess307 = true;
        gradedFileName307 = "UNDLM_00307_AVEC_POIGNEES.mov";
        logImportSuccess(307, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00307_AVEC_POIGNEES.mov", gradedFileName307);
    } catch (e) {
        logImportError(307, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00307_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess307 && gradedFileBis307.exists) {
    try {
        var gradedFootage307 = project.importFile(new ImportOptions(gradedFileBis307));
        gradedFootage307.parentFolder = fromGradingFolder;
        gradedFootage307.name = "UNDLM_00307bis";
        gradingSources[307] = gradedFootage307;
        gradingImportCount++;
        gradedImportSuccess307 = true;
        gradedFileName307 = "UNDLM_00307bis.mov";
        logImportSuccess(307, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00307bis.mov", gradedFileName307);
    } catch (e) {
        logImportError(307, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00307bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess307) {
    missingGradingCount++;
}

// Import plan GRADED 00308
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile308 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00308.mov");
var gradedFilePoignees308 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00308_AVEC_POIGNEES.mov");
var gradedFileBis308 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00308bis.mov");

var gradedImportSuccess308 = false;
var gradedFileName308 = "";

// Tenter import standard
if (gradedFile308.exists) {
    try {
        var gradedFootage308 = project.importFile(new ImportOptions(gradedFile308));
        gradedFootage308.parentFolder = fromGradingFolder;
        gradedFootage308.name = "UNDLM_00308";
        gradingSources[308] = gradedFootage308;
        gradingImportCount++;
        gradedImportSuccess308 = true;
        gradedFileName308 = "UNDLM_00308.mov";
        logImportSuccess(308, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00308.mov", gradedFileName308);
    } catch (e) {
        logImportError(308, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00308.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess308 && gradedFilePoignees308.exists) {
    try {
        var gradedFootage308 = project.importFile(new ImportOptions(gradedFilePoignees308));
        gradedFootage308.parentFolder = fromGradingFolder;
        gradedFootage308.name = "UNDLM_00308_AVEC_POIGNEES";
        gradingSources[308] = gradedFootage308;
        gradingImportCount++;
        gradedImportSuccess308 = true;
        gradedFileName308 = "UNDLM_00308_AVEC_POIGNEES.mov";
        logImportSuccess(308, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00308_AVEC_POIGNEES.mov", gradedFileName308);
    } catch (e) {
        logImportError(308, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00308_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess308 && gradedFileBis308.exists) {
    try {
        var gradedFootage308 = project.importFile(new ImportOptions(gradedFileBis308));
        gradedFootage308.parentFolder = fromGradingFolder;
        gradedFootage308.name = "UNDLM_00308bis";
        gradingSources[308] = gradedFootage308;
        gradingImportCount++;
        gradedImportSuccess308 = true;
        gradedFileName308 = "UNDLM_00308bis.mov";
        logImportSuccess(308, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00308bis.mov", gradedFileName308);
    } catch (e) {
        logImportError(308, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00308bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess308) {
    missingGradingCount++;
}

// Import plan GRADED 00309
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile309 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00309.mov");
var gradedFilePoignees309 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00309_AVEC_POIGNEES.mov");
var gradedFileBis309 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00309bis.mov");

var gradedImportSuccess309 = false;
var gradedFileName309 = "";

// Tenter import standard
if (gradedFile309.exists) {
    try {
        var gradedFootage309 = project.importFile(new ImportOptions(gradedFile309));
        gradedFootage309.parentFolder = fromGradingFolder;
        gradedFootage309.name = "UNDLM_00309";
        gradingSources[309] = gradedFootage309;
        gradingImportCount++;
        gradedImportSuccess309 = true;
        gradedFileName309 = "UNDLM_00309.mov";
        logImportSuccess(309, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00309.mov", gradedFileName309);
    } catch (e) {
        logImportError(309, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00309.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess309 && gradedFilePoignees309.exists) {
    try {
        var gradedFootage309 = project.importFile(new ImportOptions(gradedFilePoignees309));
        gradedFootage309.parentFolder = fromGradingFolder;
        gradedFootage309.name = "UNDLM_00309_AVEC_POIGNEES";
        gradingSources[309] = gradedFootage309;
        gradingImportCount++;
        gradedImportSuccess309 = true;
        gradedFileName309 = "UNDLM_00309_AVEC_POIGNEES.mov";
        logImportSuccess(309, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00309_AVEC_POIGNEES.mov", gradedFileName309);
    } catch (e) {
        logImportError(309, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00309_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess309 && gradedFileBis309.exists) {
    try {
        var gradedFootage309 = project.importFile(new ImportOptions(gradedFileBis309));
        gradedFootage309.parentFolder = fromGradingFolder;
        gradedFootage309.name = "UNDLM_00309bis";
        gradingSources[309] = gradedFootage309;
        gradingImportCount++;
        gradedImportSuccess309 = true;
        gradedFileName309 = "UNDLM_00309bis.mov";
        logImportSuccess(309, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00309bis.mov", gradedFileName309);
    } catch (e) {
        logImportError(309, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00309bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess309) {
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


// Composition pour plan 00304
var planComp304 = project.items.addComp(
    "SQ17_UNDLM_00304_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp304.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer304 = planComp304.layers.add(bgSolidComp);
bgLayer304.name = "BG_SOLID";
bgLayer304.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer304 = false;
if (gradingSources[304]) {
    var gradedLayer304 = planComp304.layers.add(gradingSources[304]);
    gradedLayer304.name = "UNDLM_00304_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer304.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer304.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer304 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer304 = false;
if (editSources[304]) {
    var editLayer304 = planComp304.layers.add(editSources[304]);
    editLayer304.name = "UNDLM_00304_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer304.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer304.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer304 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity304 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer304) {
    // EDIT toujours activé quand disponible
    editLayer304.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer304) {
        gradedLayer304.enabled = false;
    }
} else if (hasGradedLayer304) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer304.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText304 = planComp304.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText304.name = "WARNING_NO_EDIT";
    warningText304.property("Transform").property("Position").setValue([1280, 200]);
    warningText304.guideLayer = true;
    
    var warningTextDoc304 = warningText304.property("Source Text").value;
    warningTextDoc304.fontSize = 32;
    warningTextDoc304.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc304.font = "Arial-BoldMT";
    warningTextDoc304.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText304.property("Source Text").setValue(warningTextDoc304);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText304 = planComp304.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00304");
    errorText304.name = "ERROR_NO_SOURCE";
    errorText304.property("Transform").property("Position").setValue([1280, 720]);
    errorText304.guideLayer = true;
    
    var errorTextDoc304 = errorText304.property("Source Text").value;
    errorTextDoc304.fontSize = 48;
    errorTextDoc304.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc304.font = "Arial-BoldMT";
    errorTextDoc304.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText304.property("Source Text").setValue(errorTextDoc304);
}

planCompositions[304] = planComp304;


// Composition pour plan 00305
var planComp305 = project.items.addComp(
    "SQ17_UNDLM_00305_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp305.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer305 = planComp305.layers.add(bgSolidComp);
bgLayer305.name = "BG_SOLID";
bgLayer305.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer305 = false;
if (gradingSources[305]) {
    var gradedLayer305 = planComp305.layers.add(gradingSources[305]);
    gradedLayer305.name = "UNDLM_00305_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer305.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer305.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer305 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer305 = false;
if (editSources[305]) {
    var editLayer305 = planComp305.layers.add(editSources[305]);
    editLayer305.name = "UNDLM_00305_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer305.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer305.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer305 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity305 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer305) {
    // EDIT toujours activé quand disponible
    editLayer305.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer305) {
        gradedLayer305.enabled = false;
    }
} else if (hasGradedLayer305) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer305.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText305 = planComp305.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText305.name = "WARNING_NO_EDIT";
    warningText305.property("Transform").property("Position").setValue([1280, 200]);
    warningText305.guideLayer = true;
    
    var warningTextDoc305 = warningText305.property("Source Text").value;
    warningTextDoc305.fontSize = 32;
    warningTextDoc305.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc305.font = "Arial-BoldMT";
    warningTextDoc305.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText305.property("Source Text").setValue(warningTextDoc305);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText305 = planComp305.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00305");
    errorText305.name = "ERROR_NO_SOURCE";
    errorText305.property("Transform").property("Position").setValue([1280, 720]);
    errorText305.guideLayer = true;
    
    var errorTextDoc305 = errorText305.property("Source Text").value;
    errorTextDoc305.fontSize = 48;
    errorTextDoc305.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc305.font = "Arial-BoldMT";
    errorTextDoc305.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText305.property("Source Text").setValue(errorTextDoc305);
}

planCompositions[305] = planComp305;


// Composition pour plan 00306
var planComp306 = project.items.addComp(
    "SQ17_UNDLM_00306_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp306.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer306 = planComp306.layers.add(bgSolidComp);
bgLayer306.name = "BG_SOLID";
bgLayer306.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer306 = false;
if (gradingSources[306]) {
    var gradedLayer306 = planComp306.layers.add(gradingSources[306]);
    gradedLayer306.name = "UNDLM_00306_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer306.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer306.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer306 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer306 = false;
if (editSources[306]) {
    var editLayer306 = planComp306.layers.add(editSources[306]);
    editLayer306.name = "UNDLM_00306_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer306.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer306.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer306 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity306 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer306) {
    // EDIT toujours activé quand disponible
    editLayer306.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer306) {
        gradedLayer306.enabled = false;
    }
} else if (hasGradedLayer306) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer306.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText306 = planComp306.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText306.name = "WARNING_NO_EDIT";
    warningText306.property("Transform").property("Position").setValue([1280, 200]);
    warningText306.guideLayer = true;
    
    var warningTextDoc306 = warningText306.property("Source Text").value;
    warningTextDoc306.fontSize = 32;
    warningTextDoc306.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc306.font = "Arial-BoldMT";
    warningTextDoc306.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText306.property("Source Text").setValue(warningTextDoc306);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText306 = planComp306.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00306");
    errorText306.name = "ERROR_NO_SOURCE";
    errorText306.property("Transform").property("Position").setValue([1280, 720]);
    errorText306.guideLayer = true;
    
    var errorTextDoc306 = errorText306.property("Source Text").value;
    errorTextDoc306.fontSize = 48;
    errorTextDoc306.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc306.font = "Arial-BoldMT";
    errorTextDoc306.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText306.property("Source Text").setValue(errorTextDoc306);
}

planCompositions[306] = planComp306;


// Composition pour plan 00307
var planComp307 = project.items.addComp(
    "SQ17_UNDLM_00307_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp307.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer307 = planComp307.layers.add(bgSolidComp);
bgLayer307.name = "BG_SOLID";
bgLayer307.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer307 = false;
if (gradingSources[307]) {
    var gradedLayer307 = planComp307.layers.add(gradingSources[307]);
    gradedLayer307.name = "UNDLM_00307_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer307.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer307.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer307 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer307 = false;
if (editSources[307]) {
    var editLayer307 = planComp307.layers.add(editSources[307]);
    editLayer307.name = "UNDLM_00307_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer307.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer307.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer307 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity307 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer307) {
    // EDIT toujours activé quand disponible
    editLayer307.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer307) {
        gradedLayer307.enabled = false;
    }
} else if (hasGradedLayer307) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer307.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText307 = planComp307.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText307.name = "WARNING_NO_EDIT";
    warningText307.property("Transform").property("Position").setValue([1280, 200]);
    warningText307.guideLayer = true;
    
    var warningTextDoc307 = warningText307.property("Source Text").value;
    warningTextDoc307.fontSize = 32;
    warningTextDoc307.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc307.font = "Arial-BoldMT";
    warningTextDoc307.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText307.property("Source Text").setValue(warningTextDoc307);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText307 = planComp307.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00307");
    errorText307.name = "ERROR_NO_SOURCE";
    errorText307.property("Transform").property("Position").setValue([1280, 720]);
    errorText307.guideLayer = true;
    
    var errorTextDoc307 = errorText307.property("Source Text").value;
    errorTextDoc307.fontSize = 48;
    errorTextDoc307.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc307.font = "Arial-BoldMT";
    errorTextDoc307.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText307.property("Source Text").setValue(errorTextDoc307);
}

planCompositions[307] = planComp307;


// Composition pour plan 00308
var planComp308 = project.items.addComp(
    "SQ17_UNDLM_00308_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp308.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer308 = planComp308.layers.add(bgSolidComp);
bgLayer308.name = "BG_SOLID";
bgLayer308.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer308 = false;
if (gradingSources[308]) {
    var gradedLayer308 = planComp308.layers.add(gradingSources[308]);
    gradedLayer308.name = "UNDLM_00308_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer308.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer308.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer308 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer308 = false;
if (editSources[308]) {
    var editLayer308 = planComp308.layers.add(editSources[308]);
    editLayer308.name = "UNDLM_00308_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer308.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer308.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer308 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity308 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer308) {
    // EDIT toujours activé quand disponible
    editLayer308.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer308) {
        gradedLayer308.enabled = false;
    }
} else if (hasGradedLayer308) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer308.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText308 = planComp308.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText308.name = "WARNING_NO_EDIT";
    warningText308.property("Transform").property("Position").setValue([1280, 200]);
    warningText308.guideLayer = true;
    
    var warningTextDoc308 = warningText308.property("Source Text").value;
    warningTextDoc308.fontSize = 32;
    warningTextDoc308.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc308.font = "Arial-BoldMT";
    warningTextDoc308.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText308.property("Source Text").setValue(warningTextDoc308);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText308 = planComp308.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00308");
    errorText308.name = "ERROR_NO_SOURCE";
    errorText308.property("Transform").property("Position").setValue([1280, 720]);
    errorText308.guideLayer = true;
    
    var errorTextDoc308 = errorText308.property("Source Text").value;
    errorTextDoc308.fontSize = 48;
    errorTextDoc308.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc308.font = "Arial-BoldMT";
    errorTextDoc308.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText308.property("Source Text").setValue(errorTextDoc308);
}

planCompositions[308] = planComp308;


// Composition pour plan 00309
var planComp309 = project.items.addComp(
    "SQ17_UNDLM_00309_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp309.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer309 = planComp309.layers.add(bgSolidComp);
bgLayer309.name = "BG_SOLID";
bgLayer309.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer309 = false;
if (gradingSources[309]) {
    var gradedLayer309 = planComp309.layers.add(gradingSources[309]);
    gradedLayer309.name = "UNDLM_00309_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer309.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer309.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer309 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer309 = false;
if (editSources[309]) {
    var editLayer309 = planComp309.layers.add(editSources[309]);
    editLayer309.name = "UNDLM_00309_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer309.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer309.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer309 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity309 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer309) {
    // EDIT toujours activé quand disponible
    editLayer309.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer309) {
        gradedLayer309.enabled = false;
    }
} else if (hasGradedLayer309) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer309.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText309 = planComp309.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText309.name = "WARNING_NO_EDIT";
    warningText309.property("Transform").property("Position").setValue([1280, 200]);
    warningText309.guideLayer = true;
    
    var warningTextDoc309 = warningText309.property("Source Text").value;
    warningTextDoc309.fontSize = 32;
    warningTextDoc309.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc309.font = "Arial-BoldMT";
    warningTextDoc309.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText309.property("Source Text").setValue(warningTextDoc309);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText309 = planComp309.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00309");
    errorText309.name = "ERROR_NO_SOURCE";
    errorText309.property("Transform").property("Position").setValue([1280, 720]);
    errorText309.guideLayer = true;
    
    var errorTextDoc309 = errorText309.property("Source Text").value;
    errorTextDoc309.fontSize = 48;
    errorTextDoc309.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc309.font = "Arial-BoldMT";
    errorTextDoc309.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText309.property("Source Text").setValue(errorTextDoc309);
}

planCompositions[309] = planComp309;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ17_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    38.00000000000001, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00304 à la timeline master
if (planCompositions[304]) {
    var masterLayer304 = masterComp.layers.add(planCompositions[304]);
    masterLayer304.startTime = 0;
    masterLayer304.name = "UNDLM_00304";
    masterLayer304.label = 1; // Couleurs alternées
}

// Ajouter plan 00305 à la timeline master
if (planCompositions[305]) {
    var masterLayer305 = masterComp.layers.add(planCompositions[305]);
    masterLayer305.startTime = 9.8;
    masterLayer305.name = "UNDLM_00305";
    masterLayer305.label = 2; // Couleurs alternées
}

// Ajouter plan 00306 à la timeline master
if (planCompositions[306]) {
    var masterLayer306 = masterComp.layers.add(planCompositions[306]);
    masterLayer306.startTime = 15.040000000000001;
    masterLayer306.name = "UNDLM_00306";
    masterLayer306.label = 3; // Couleurs alternées
}

// Ajouter plan 00307 à la timeline master
if (planCompositions[307]) {
    var masterLayer307 = masterComp.layers.add(planCompositions[307]);
    masterLayer307.startTime = 19.560000000000002;
    masterLayer307.name = "UNDLM_00307";
    masterLayer307.label = 4; // Couleurs alternées
}

// Ajouter plan 00308 à la timeline master
if (planCompositions[308]) {
    var masterLayer308 = masterComp.layers.add(planCompositions[308]);
    masterLayer308.startTime = 25.520000000000003;
    masterLayer308.name = "UNDLM_00308";
    masterLayer308.label = 5; // Couleurs alternées
}

// Ajouter plan 00309 à la timeline master
if (planCompositions[309]) {
    var masterLayer309 = masterComp.layers.add(planCompositions[309]);
    masterLayer309.startTime = 33.040000000000006;
    masterLayer309.name = "UNDLM_00309";
    masterLayer309.label = 6; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ17";\n' +
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
    {start: 0, end: 9.8, name: "UNDLM_00304"},
    {start: 9.8, end: 15.040000000000001, name: "UNDLM_00305"},
    {start: 15.040000000000001, end: 19.560000000000002, name: "UNDLM_00306"},
    {start: 19.560000000000002, end: 25.520000000000003, name: "UNDLM_00307"},
    {start: 25.520000000000003, end: 33.040000000000006, name: "UNDLM_00308"},
    {start: 33.040000000000006, end: 38.00000000000001, name: "UNDLM_00309"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ17/_AE/SQ17_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 6;
var totalCount = 6;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ17 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(38.00000000000001 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ17_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ17:" + totalCount + ":" + gradedCount);
