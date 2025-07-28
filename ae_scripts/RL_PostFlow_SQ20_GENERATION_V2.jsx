
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ20 avec 13 plans
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


// Import plan EDIT 00334
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile334 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00334.mov");
var editFilePoignees334 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00334_AVEC_POIGNEES.mov");
var editFileBis334 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00334bis.mov");

var importSuccess334 = false;
var fileName334 = "";

// Tenter import standard
if (editFile334.exists) {
    try {
        var editFootage334 = project.importFile(new ImportOptions(editFile334));
        editFootage334.parentFolder = fromEditFolder;
        editFootage334.name = "UNDLM_00334";
        editSources[334] = editFootage334;
        editImportCount++;
        importSuccess334 = true;
        fileName334 = "UNDLM_00334.mov";
        logImportSuccess(334, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00334.mov", fileName334);
    } catch (e) {
        logImportError(334, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00334.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess334 && editFilePoignees334.exists) {
    try {
        var editFootage334 = project.importFile(new ImportOptions(editFilePoignees334));
        editFootage334.parentFolder = fromEditFolder;
        editFootage334.name = "UNDLM_00334_AVEC_POIGNEES";
        editSources[334] = editFootage334;
        editImportCount++;
        importSuccess334 = true;
        fileName334 = "UNDLM_00334_AVEC_POIGNEES.mov";
        logImportSuccess(334, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00334_AVEC_POIGNEES.mov", fileName334);
    } catch (e) {
        logImportError(334, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00334_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess334 && editFileBis334.exists) {
    try {
        var editFootage334 = project.importFile(new ImportOptions(editFileBis334));
        editFootage334.parentFolder = fromEditFolder;
        editFootage334.name = "UNDLM_00334bis";
        editSources[334] = editFootage334;
        editImportCount++;
        importSuccess334 = true;
        fileName334 = "UNDLM_00334bis.mov";
        logImportSuccess(334, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00334bis.mov", fileName334);
    } catch (e) {
        logImportError(334, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00334bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess334) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00334.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00335
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile335 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00335.mov");
var editFilePoignees335 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00335_AVEC_POIGNEES.mov");
var editFileBis335 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00335bis.mov");

var importSuccess335 = false;
var fileName335 = "";

// Tenter import standard
if (editFile335.exists) {
    try {
        var editFootage335 = project.importFile(new ImportOptions(editFile335));
        editFootage335.parentFolder = fromEditFolder;
        editFootage335.name = "UNDLM_00335";
        editSources[335] = editFootage335;
        editImportCount++;
        importSuccess335 = true;
        fileName335 = "UNDLM_00335.mov";
        logImportSuccess(335, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00335.mov", fileName335);
    } catch (e) {
        logImportError(335, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00335.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess335 && editFilePoignees335.exists) {
    try {
        var editFootage335 = project.importFile(new ImportOptions(editFilePoignees335));
        editFootage335.parentFolder = fromEditFolder;
        editFootage335.name = "UNDLM_00335_AVEC_POIGNEES";
        editSources[335] = editFootage335;
        editImportCount++;
        importSuccess335 = true;
        fileName335 = "UNDLM_00335_AVEC_POIGNEES.mov";
        logImportSuccess(335, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00335_AVEC_POIGNEES.mov", fileName335);
    } catch (e) {
        logImportError(335, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00335_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess335 && editFileBis335.exists) {
    try {
        var editFootage335 = project.importFile(new ImportOptions(editFileBis335));
        editFootage335.parentFolder = fromEditFolder;
        editFootage335.name = "UNDLM_00335bis";
        editSources[335] = editFootage335;
        editImportCount++;
        importSuccess335 = true;
        fileName335 = "UNDLM_00335bis.mov";
        logImportSuccess(335, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00335bis.mov", fileName335);
    } catch (e) {
        logImportError(335, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00335bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess335) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00335.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00336
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile336 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00336.mov");
var editFilePoignees336 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00336_AVEC_POIGNEES.mov");
var editFileBis336 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00336bis.mov");

var importSuccess336 = false;
var fileName336 = "";

// Tenter import standard
if (editFile336.exists) {
    try {
        var editFootage336 = project.importFile(new ImportOptions(editFile336));
        editFootage336.parentFolder = fromEditFolder;
        editFootage336.name = "UNDLM_00336";
        editSources[336] = editFootage336;
        editImportCount++;
        importSuccess336 = true;
        fileName336 = "UNDLM_00336.mov";
        logImportSuccess(336, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00336.mov", fileName336);
    } catch (e) {
        logImportError(336, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00336.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess336 && editFilePoignees336.exists) {
    try {
        var editFootage336 = project.importFile(new ImportOptions(editFilePoignees336));
        editFootage336.parentFolder = fromEditFolder;
        editFootage336.name = "UNDLM_00336_AVEC_POIGNEES";
        editSources[336] = editFootage336;
        editImportCount++;
        importSuccess336 = true;
        fileName336 = "UNDLM_00336_AVEC_POIGNEES.mov";
        logImportSuccess(336, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00336_AVEC_POIGNEES.mov", fileName336);
    } catch (e) {
        logImportError(336, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00336_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess336 && editFileBis336.exists) {
    try {
        var editFootage336 = project.importFile(new ImportOptions(editFileBis336));
        editFootage336.parentFolder = fromEditFolder;
        editFootage336.name = "UNDLM_00336bis";
        editSources[336] = editFootage336;
        editImportCount++;
        importSuccess336 = true;
        fileName336 = "UNDLM_00336bis.mov";
        logImportSuccess(336, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00336bis.mov", fileName336);
    } catch (e) {
        logImportError(336, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00336bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess336) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00336.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00337
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile337 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00337.mov");
var editFilePoignees337 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00337_AVEC_POIGNEES.mov");
var editFileBis337 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00337bis.mov");

var importSuccess337 = false;
var fileName337 = "";

// Tenter import standard
if (editFile337.exists) {
    try {
        var editFootage337 = project.importFile(new ImportOptions(editFile337));
        editFootage337.parentFolder = fromEditFolder;
        editFootage337.name = "UNDLM_00337";
        editSources[337] = editFootage337;
        editImportCount++;
        importSuccess337 = true;
        fileName337 = "UNDLM_00337.mov";
        logImportSuccess(337, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00337.mov", fileName337);
    } catch (e) {
        logImportError(337, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00337.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess337 && editFilePoignees337.exists) {
    try {
        var editFootage337 = project.importFile(new ImportOptions(editFilePoignees337));
        editFootage337.parentFolder = fromEditFolder;
        editFootage337.name = "UNDLM_00337_AVEC_POIGNEES";
        editSources[337] = editFootage337;
        editImportCount++;
        importSuccess337 = true;
        fileName337 = "UNDLM_00337_AVEC_POIGNEES.mov";
        logImportSuccess(337, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00337_AVEC_POIGNEES.mov", fileName337);
    } catch (e) {
        logImportError(337, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00337_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess337 && editFileBis337.exists) {
    try {
        var editFootage337 = project.importFile(new ImportOptions(editFileBis337));
        editFootage337.parentFolder = fromEditFolder;
        editFootage337.name = "UNDLM_00337bis";
        editSources[337] = editFootage337;
        editImportCount++;
        importSuccess337 = true;
        fileName337 = "UNDLM_00337bis.mov";
        logImportSuccess(337, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00337bis.mov", fileName337);
    } catch (e) {
        logImportError(337, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00337bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess337) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00337.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00338
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile338 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00338.mov");
var editFilePoignees338 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00338_AVEC_POIGNEES.mov");
var editFileBis338 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00338bis.mov");

var importSuccess338 = false;
var fileName338 = "";

// Tenter import standard
if (editFile338.exists) {
    try {
        var editFootage338 = project.importFile(new ImportOptions(editFile338));
        editFootage338.parentFolder = fromEditFolder;
        editFootage338.name = "UNDLM_00338";
        editSources[338] = editFootage338;
        editImportCount++;
        importSuccess338 = true;
        fileName338 = "UNDLM_00338.mov";
        logImportSuccess(338, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00338.mov", fileName338);
    } catch (e) {
        logImportError(338, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00338.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess338 && editFilePoignees338.exists) {
    try {
        var editFootage338 = project.importFile(new ImportOptions(editFilePoignees338));
        editFootage338.parentFolder = fromEditFolder;
        editFootage338.name = "UNDLM_00338_AVEC_POIGNEES";
        editSources[338] = editFootage338;
        editImportCount++;
        importSuccess338 = true;
        fileName338 = "UNDLM_00338_AVEC_POIGNEES.mov";
        logImportSuccess(338, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00338_AVEC_POIGNEES.mov", fileName338);
    } catch (e) {
        logImportError(338, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00338_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess338 && editFileBis338.exists) {
    try {
        var editFootage338 = project.importFile(new ImportOptions(editFileBis338));
        editFootage338.parentFolder = fromEditFolder;
        editFootage338.name = "UNDLM_00338bis";
        editSources[338] = editFootage338;
        editImportCount++;
        importSuccess338 = true;
        fileName338 = "UNDLM_00338bis.mov";
        logImportSuccess(338, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00338bis.mov", fileName338);
    } catch (e) {
        logImportError(338, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00338bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess338) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00338.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00339
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile339 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00339.mov");
var editFilePoignees339 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00339_AVEC_POIGNEES.mov");
var editFileBis339 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00339bis.mov");

var importSuccess339 = false;
var fileName339 = "";

// Tenter import standard
if (editFile339.exists) {
    try {
        var editFootage339 = project.importFile(new ImportOptions(editFile339));
        editFootage339.parentFolder = fromEditFolder;
        editFootage339.name = "UNDLM_00339";
        editSources[339] = editFootage339;
        editImportCount++;
        importSuccess339 = true;
        fileName339 = "UNDLM_00339.mov";
        logImportSuccess(339, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00339.mov", fileName339);
    } catch (e) {
        logImportError(339, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00339.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess339 && editFilePoignees339.exists) {
    try {
        var editFootage339 = project.importFile(new ImportOptions(editFilePoignees339));
        editFootage339.parentFolder = fromEditFolder;
        editFootage339.name = "UNDLM_00339_AVEC_POIGNEES";
        editSources[339] = editFootage339;
        editImportCount++;
        importSuccess339 = true;
        fileName339 = "UNDLM_00339_AVEC_POIGNEES.mov";
        logImportSuccess(339, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00339_AVEC_POIGNEES.mov", fileName339);
    } catch (e) {
        logImportError(339, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00339_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess339 && editFileBis339.exists) {
    try {
        var editFootage339 = project.importFile(new ImportOptions(editFileBis339));
        editFootage339.parentFolder = fromEditFolder;
        editFootage339.name = "UNDLM_00339bis";
        editSources[339] = editFootage339;
        editImportCount++;
        importSuccess339 = true;
        fileName339 = "UNDLM_00339bis.mov";
        logImportSuccess(339, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00339bis.mov", fileName339);
    } catch (e) {
        logImportError(339, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00339bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess339) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00339.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00340
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile340 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00340.mov");
var editFilePoignees340 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00340_AVEC_POIGNEES.mov");
var editFileBis340 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00340bis.mov");

var importSuccess340 = false;
var fileName340 = "";

// Tenter import standard
if (editFile340.exists) {
    try {
        var editFootage340 = project.importFile(new ImportOptions(editFile340));
        editFootage340.parentFolder = fromEditFolder;
        editFootage340.name = "UNDLM_00340";
        editSources[340] = editFootage340;
        editImportCount++;
        importSuccess340 = true;
        fileName340 = "UNDLM_00340.mov";
        logImportSuccess(340, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00340.mov", fileName340);
    } catch (e) {
        logImportError(340, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00340.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess340 && editFilePoignees340.exists) {
    try {
        var editFootage340 = project.importFile(new ImportOptions(editFilePoignees340));
        editFootage340.parentFolder = fromEditFolder;
        editFootage340.name = "UNDLM_00340_AVEC_POIGNEES";
        editSources[340] = editFootage340;
        editImportCount++;
        importSuccess340 = true;
        fileName340 = "UNDLM_00340_AVEC_POIGNEES.mov";
        logImportSuccess(340, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00340_AVEC_POIGNEES.mov", fileName340);
    } catch (e) {
        logImportError(340, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00340_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess340 && editFileBis340.exists) {
    try {
        var editFootage340 = project.importFile(new ImportOptions(editFileBis340));
        editFootage340.parentFolder = fromEditFolder;
        editFootage340.name = "UNDLM_00340bis";
        editSources[340] = editFootage340;
        editImportCount++;
        importSuccess340 = true;
        fileName340 = "UNDLM_00340bis.mov";
        logImportSuccess(340, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00340bis.mov", fileName340);
    } catch (e) {
        logImportError(340, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00340bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess340) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00340.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00341
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile341 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00341.mov");
var editFilePoignees341 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00341_AVEC_POIGNEES.mov");
var editFileBis341 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00341bis.mov");

var importSuccess341 = false;
var fileName341 = "";

// Tenter import standard
if (editFile341.exists) {
    try {
        var editFootage341 = project.importFile(new ImportOptions(editFile341));
        editFootage341.parentFolder = fromEditFolder;
        editFootage341.name = "UNDLM_00341";
        editSources[341] = editFootage341;
        editImportCount++;
        importSuccess341 = true;
        fileName341 = "UNDLM_00341.mov";
        logImportSuccess(341, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00341.mov", fileName341);
    } catch (e) {
        logImportError(341, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00341.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess341 && editFilePoignees341.exists) {
    try {
        var editFootage341 = project.importFile(new ImportOptions(editFilePoignees341));
        editFootage341.parentFolder = fromEditFolder;
        editFootage341.name = "UNDLM_00341_AVEC_POIGNEES";
        editSources[341] = editFootage341;
        editImportCount++;
        importSuccess341 = true;
        fileName341 = "UNDLM_00341_AVEC_POIGNEES.mov";
        logImportSuccess(341, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00341_AVEC_POIGNEES.mov", fileName341);
    } catch (e) {
        logImportError(341, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00341_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess341 && editFileBis341.exists) {
    try {
        var editFootage341 = project.importFile(new ImportOptions(editFileBis341));
        editFootage341.parentFolder = fromEditFolder;
        editFootage341.name = "UNDLM_00341bis";
        editSources[341] = editFootage341;
        editImportCount++;
        importSuccess341 = true;
        fileName341 = "UNDLM_00341bis.mov";
        logImportSuccess(341, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00341bis.mov", fileName341);
    } catch (e) {
        logImportError(341, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00341bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess341) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00341.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00342
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile342 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00342.mov");
var editFilePoignees342 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00342_AVEC_POIGNEES.mov");
var editFileBis342 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00342bis.mov");

var importSuccess342 = false;
var fileName342 = "";

// Tenter import standard
if (editFile342.exists) {
    try {
        var editFootage342 = project.importFile(new ImportOptions(editFile342));
        editFootage342.parentFolder = fromEditFolder;
        editFootage342.name = "UNDLM_00342";
        editSources[342] = editFootage342;
        editImportCount++;
        importSuccess342 = true;
        fileName342 = "UNDLM_00342.mov";
        logImportSuccess(342, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00342.mov", fileName342);
    } catch (e) {
        logImportError(342, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00342.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess342 && editFilePoignees342.exists) {
    try {
        var editFootage342 = project.importFile(new ImportOptions(editFilePoignees342));
        editFootage342.parentFolder = fromEditFolder;
        editFootage342.name = "UNDLM_00342_AVEC_POIGNEES";
        editSources[342] = editFootage342;
        editImportCount++;
        importSuccess342 = true;
        fileName342 = "UNDLM_00342_AVEC_POIGNEES.mov";
        logImportSuccess(342, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00342_AVEC_POIGNEES.mov", fileName342);
    } catch (e) {
        logImportError(342, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00342_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess342 && editFileBis342.exists) {
    try {
        var editFootage342 = project.importFile(new ImportOptions(editFileBis342));
        editFootage342.parentFolder = fromEditFolder;
        editFootage342.name = "UNDLM_00342bis";
        editSources[342] = editFootage342;
        editImportCount++;
        importSuccess342 = true;
        fileName342 = "UNDLM_00342bis.mov";
        logImportSuccess(342, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00342bis.mov", fileName342);
    } catch (e) {
        logImportError(342, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00342bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess342) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00342.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00343
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile343 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00343.mov");
var editFilePoignees343 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00343_AVEC_POIGNEES.mov");
var editFileBis343 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00343bis.mov");

var importSuccess343 = false;
var fileName343 = "";

// Tenter import standard
if (editFile343.exists) {
    try {
        var editFootage343 = project.importFile(new ImportOptions(editFile343));
        editFootage343.parentFolder = fromEditFolder;
        editFootage343.name = "UNDLM_00343";
        editSources[343] = editFootage343;
        editImportCount++;
        importSuccess343 = true;
        fileName343 = "UNDLM_00343.mov";
        logImportSuccess(343, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00343.mov", fileName343);
    } catch (e) {
        logImportError(343, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00343.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess343 && editFilePoignees343.exists) {
    try {
        var editFootage343 = project.importFile(new ImportOptions(editFilePoignees343));
        editFootage343.parentFolder = fromEditFolder;
        editFootage343.name = "UNDLM_00343_AVEC_POIGNEES";
        editSources[343] = editFootage343;
        editImportCount++;
        importSuccess343 = true;
        fileName343 = "UNDLM_00343_AVEC_POIGNEES.mov";
        logImportSuccess(343, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00343_AVEC_POIGNEES.mov", fileName343);
    } catch (e) {
        logImportError(343, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00343_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess343 && editFileBis343.exists) {
    try {
        var editFootage343 = project.importFile(new ImportOptions(editFileBis343));
        editFootage343.parentFolder = fromEditFolder;
        editFootage343.name = "UNDLM_00343bis";
        editSources[343] = editFootage343;
        editImportCount++;
        importSuccess343 = true;
        fileName343 = "UNDLM_00343bis.mov";
        logImportSuccess(343, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00343bis.mov", fileName343);
    } catch (e) {
        logImportError(343, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00343bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess343) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00343.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00344
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile344 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00344.mov");
var editFilePoignees344 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00344_AVEC_POIGNEES.mov");
var editFileBis344 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00344bis.mov");

var importSuccess344 = false;
var fileName344 = "";

// Tenter import standard
if (editFile344.exists) {
    try {
        var editFootage344 = project.importFile(new ImportOptions(editFile344));
        editFootage344.parentFolder = fromEditFolder;
        editFootage344.name = "UNDLM_00344";
        editSources[344] = editFootage344;
        editImportCount++;
        importSuccess344 = true;
        fileName344 = "UNDLM_00344.mov";
        logImportSuccess(344, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00344.mov", fileName344);
    } catch (e) {
        logImportError(344, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00344.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess344 && editFilePoignees344.exists) {
    try {
        var editFootage344 = project.importFile(new ImportOptions(editFilePoignees344));
        editFootage344.parentFolder = fromEditFolder;
        editFootage344.name = "UNDLM_00344_AVEC_POIGNEES";
        editSources[344] = editFootage344;
        editImportCount++;
        importSuccess344 = true;
        fileName344 = "UNDLM_00344_AVEC_POIGNEES.mov";
        logImportSuccess(344, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00344_AVEC_POIGNEES.mov", fileName344);
    } catch (e) {
        logImportError(344, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00344_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess344 && editFileBis344.exists) {
    try {
        var editFootage344 = project.importFile(new ImportOptions(editFileBis344));
        editFootage344.parentFolder = fromEditFolder;
        editFootage344.name = "UNDLM_00344bis";
        editSources[344] = editFootage344;
        editImportCount++;
        importSuccess344 = true;
        fileName344 = "UNDLM_00344bis.mov";
        logImportSuccess(344, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00344bis.mov", fileName344);
    } catch (e) {
        logImportError(344, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00344bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess344) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00344.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00345
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile345 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00345.mov");
var editFilePoignees345 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00345_AVEC_POIGNEES.mov");
var editFileBis345 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00345bis.mov");

var importSuccess345 = false;
var fileName345 = "";

// Tenter import standard
if (editFile345.exists) {
    try {
        var editFootage345 = project.importFile(new ImportOptions(editFile345));
        editFootage345.parentFolder = fromEditFolder;
        editFootage345.name = "UNDLM_00345";
        editSources[345] = editFootage345;
        editImportCount++;
        importSuccess345 = true;
        fileName345 = "UNDLM_00345.mov";
        logImportSuccess(345, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00345.mov", fileName345);
    } catch (e) {
        logImportError(345, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00345.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess345 && editFilePoignees345.exists) {
    try {
        var editFootage345 = project.importFile(new ImportOptions(editFilePoignees345));
        editFootage345.parentFolder = fromEditFolder;
        editFootage345.name = "UNDLM_00345_AVEC_POIGNEES";
        editSources[345] = editFootage345;
        editImportCount++;
        importSuccess345 = true;
        fileName345 = "UNDLM_00345_AVEC_POIGNEES.mov";
        logImportSuccess(345, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00345_AVEC_POIGNEES.mov", fileName345);
    } catch (e) {
        logImportError(345, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00345_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess345 && editFileBis345.exists) {
    try {
        var editFootage345 = project.importFile(new ImportOptions(editFileBis345));
        editFootage345.parentFolder = fromEditFolder;
        editFootage345.name = "UNDLM_00345bis";
        editSources[345] = editFootage345;
        editImportCount++;
        importSuccess345 = true;
        fileName345 = "UNDLM_00345bis.mov";
        logImportSuccess(345, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00345bis.mov", fileName345);
    } catch (e) {
        logImportError(345, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00345bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess345) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00345.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00346
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile346 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00346.mov");
var editFilePoignees346 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00346_AVEC_POIGNEES.mov");
var editFileBis346 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00346bis.mov");

var importSuccess346 = false;
var fileName346 = "";

// Tenter import standard
if (editFile346.exists) {
    try {
        var editFootage346 = project.importFile(new ImportOptions(editFile346));
        editFootage346.parentFolder = fromEditFolder;
        editFootage346.name = "UNDLM_00346";
        editSources[346] = editFootage346;
        editImportCount++;
        importSuccess346 = true;
        fileName346 = "UNDLM_00346.mov";
        logImportSuccess(346, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00346.mov", fileName346);
    } catch (e) {
        logImportError(346, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00346.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess346 && editFilePoignees346.exists) {
    try {
        var editFootage346 = project.importFile(new ImportOptions(editFilePoignees346));
        editFootage346.parentFolder = fromEditFolder;
        editFootage346.name = "UNDLM_00346_AVEC_POIGNEES";
        editSources[346] = editFootage346;
        editImportCount++;
        importSuccess346 = true;
        fileName346 = "UNDLM_00346_AVEC_POIGNEES.mov";
        logImportSuccess(346, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00346_AVEC_POIGNEES.mov", fileName346);
    } catch (e) {
        logImportError(346, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00346_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess346 && editFileBis346.exists) {
    try {
        var editFootage346 = project.importFile(new ImportOptions(editFileBis346));
        editFootage346.parentFolder = fromEditFolder;
        editFootage346.name = "UNDLM_00346bis";
        editSources[346] = editFootage346;
        editImportCount++;
        importSuccess346 = true;
        fileName346 = "UNDLM_00346bis.mov";
        logImportSuccess(346, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00346bis.mov", fileName346);
    } catch (e) {
        logImportError(346, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00346bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess346) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00346.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00334
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile334 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00334.mov");
var gradedFilePoignees334 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00334_AVEC_POIGNEES.mov");
var gradedFileBis334 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00334bis.mov");

var gradedImportSuccess334 = false;
var gradedFileName334 = "";

// Tenter import standard
if (gradedFile334.exists) {
    try {
        var gradedFootage334 = project.importFile(new ImportOptions(gradedFile334));
        gradedFootage334.parentFolder = fromGradingFolder;
        gradedFootage334.name = "UNDLM_00334";
        gradingSources[334] = gradedFootage334;
        gradingImportCount++;
        gradedImportSuccess334 = true;
        gradedFileName334 = "UNDLM_00334.mov";
        logImportSuccess(334, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00334.mov", gradedFileName334);
    } catch (e) {
        logImportError(334, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00334.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess334 && gradedFilePoignees334.exists) {
    try {
        var gradedFootage334 = project.importFile(new ImportOptions(gradedFilePoignees334));
        gradedFootage334.parentFolder = fromGradingFolder;
        gradedFootage334.name = "UNDLM_00334_AVEC_POIGNEES";
        gradingSources[334] = gradedFootage334;
        gradingImportCount++;
        gradedImportSuccess334 = true;
        gradedFileName334 = "UNDLM_00334_AVEC_POIGNEES.mov";
        logImportSuccess(334, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00334_AVEC_POIGNEES.mov", gradedFileName334);
    } catch (e) {
        logImportError(334, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00334_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess334 && gradedFileBis334.exists) {
    try {
        var gradedFootage334 = project.importFile(new ImportOptions(gradedFileBis334));
        gradedFootage334.parentFolder = fromGradingFolder;
        gradedFootage334.name = "UNDLM_00334bis";
        gradingSources[334] = gradedFootage334;
        gradingImportCount++;
        gradedImportSuccess334 = true;
        gradedFileName334 = "UNDLM_00334bis.mov";
        logImportSuccess(334, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00334bis.mov", gradedFileName334);
    } catch (e) {
        logImportError(334, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00334bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess334) {
    missingGradingCount++;
}

// Import plan GRADED 00335
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile335 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00335.mov");
var gradedFilePoignees335 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00335_AVEC_POIGNEES.mov");
var gradedFileBis335 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00335bis.mov");

var gradedImportSuccess335 = false;
var gradedFileName335 = "";

// Tenter import standard
if (gradedFile335.exists) {
    try {
        var gradedFootage335 = project.importFile(new ImportOptions(gradedFile335));
        gradedFootage335.parentFolder = fromGradingFolder;
        gradedFootage335.name = "UNDLM_00335";
        gradingSources[335] = gradedFootage335;
        gradingImportCount++;
        gradedImportSuccess335 = true;
        gradedFileName335 = "UNDLM_00335.mov";
        logImportSuccess(335, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00335.mov", gradedFileName335);
    } catch (e) {
        logImportError(335, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00335.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess335 && gradedFilePoignees335.exists) {
    try {
        var gradedFootage335 = project.importFile(new ImportOptions(gradedFilePoignees335));
        gradedFootage335.parentFolder = fromGradingFolder;
        gradedFootage335.name = "UNDLM_00335_AVEC_POIGNEES";
        gradingSources[335] = gradedFootage335;
        gradingImportCount++;
        gradedImportSuccess335 = true;
        gradedFileName335 = "UNDLM_00335_AVEC_POIGNEES.mov";
        logImportSuccess(335, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00335_AVEC_POIGNEES.mov", gradedFileName335);
    } catch (e) {
        logImportError(335, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00335_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess335 && gradedFileBis335.exists) {
    try {
        var gradedFootage335 = project.importFile(new ImportOptions(gradedFileBis335));
        gradedFootage335.parentFolder = fromGradingFolder;
        gradedFootage335.name = "UNDLM_00335bis";
        gradingSources[335] = gradedFootage335;
        gradingImportCount++;
        gradedImportSuccess335 = true;
        gradedFileName335 = "UNDLM_00335bis.mov";
        logImportSuccess(335, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00335bis.mov", gradedFileName335);
    } catch (e) {
        logImportError(335, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00335bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess335) {
    missingGradingCount++;
}

// Import plan GRADED 00336
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile336 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00336.mov");
var gradedFilePoignees336 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00336_AVEC_POIGNEES.mov");
var gradedFileBis336 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00336bis.mov");

var gradedImportSuccess336 = false;
var gradedFileName336 = "";

// Tenter import standard
if (gradedFile336.exists) {
    try {
        var gradedFootage336 = project.importFile(new ImportOptions(gradedFile336));
        gradedFootage336.parentFolder = fromGradingFolder;
        gradedFootage336.name = "UNDLM_00336";
        gradingSources[336] = gradedFootage336;
        gradingImportCount++;
        gradedImportSuccess336 = true;
        gradedFileName336 = "UNDLM_00336.mov";
        logImportSuccess(336, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00336.mov", gradedFileName336);
    } catch (e) {
        logImportError(336, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00336.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess336 && gradedFilePoignees336.exists) {
    try {
        var gradedFootage336 = project.importFile(new ImportOptions(gradedFilePoignees336));
        gradedFootage336.parentFolder = fromGradingFolder;
        gradedFootage336.name = "UNDLM_00336_AVEC_POIGNEES";
        gradingSources[336] = gradedFootage336;
        gradingImportCount++;
        gradedImportSuccess336 = true;
        gradedFileName336 = "UNDLM_00336_AVEC_POIGNEES.mov";
        logImportSuccess(336, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00336_AVEC_POIGNEES.mov", gradedFileName336);
    } catch (e) {
        logImportError(336, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00336_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess336 && gradedFileBis336.exists) {
    try {
        var gradedFootage336 = project.importFile(new ImportOptions(gradedFileBis336));
        gradedFootage336.parentFolder = fromGradingFolder;
        gradedFootage336.name = "UNDLM_00336bis";
        gradingSources[336] = gradedFootage336;
        gradingImportCount++;
        gradedImportSuccess336 = true;
        gradedFileName336 = "UNDLM_00336bis.mov";
        logImportSuccess(336, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00336bis.mov", gradedFileName336);
    } catch (e) {
        logImportError(336, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00336bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess336) {
    missingGradingCount++;
}

// Import plan GRADED 00337
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile337 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00337.mov");
var gradedFilePoignees337 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00337_AVEC_POIGNEES.mov");
var gradedFileBis337 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00337bis.mov");

var gradedImportSuccess337 = false;
var gradedFileName337 = "";

// Tenter import standard
if (gradedFile337.exists) {
    try {
        var gradedFootage337 = project.importFile(new ImportOptions(gradedFile337));
        gradedFootage337.parentFolder = fromGradingFolder;
        gradedFootage337.name = "UNDLM_00337";
        gradingSources[337] = gradedFootage337;
        gradingImportCount++;
        gradedImportSuccess337 = true;
        gradedFileName337 = "UNDLM_00337.mov";
        logImportSuccess(337, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00337.mov", gradedFileName337);
    } catch (e) {
        logImportError(337, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00337.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess337 && gradedFilePoignees337.exists) {
    try {
        var gradedFootage337 = project.importFile(new ImportOptions(gradedFilePoignees337));
        gradedFootage337.parentFolder = fromGradingFolder;
        gradedFootage337.name = "UNDLM_00337_AVEC_POIGNEES";
        gradingSources[337] = gradedFootage337;
        gradingImportCount++;
        gradedImportSuccess337 = true;
        gradedFileName337 = "UNDLM_00337_AVEC_POIGNEES.mov";
        logImportSuccess(337, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00337_AVEC_POIGNEES.mov", gradedFileName337);
    } catch (e) {
        logImportError(337, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00337_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess337 && gradedFileBis337.exists) {
    try {
        var gradedFootage337 = project.importFile(new ImportOptions(gradedFileBis337));
        gradedFootage337.parentFolder = fromGradingFolder;
        gradedFootage337.name = "UNDLM_00337bis";
        gradingSources[337] = gradedFootage337;
        gradingImportCount++;
        gradedImportSuccess337 = true;
        gradedFileName337 = "UNDLM_00337bis.mov";
        logImportSuccess(337, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00337bis.mov", gradedFileName337);
    } catch (e) {
        logImportError(337, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00337bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess337) {
    missingGradingCount++;
}

// Import plan GRADED 00338
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile338 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00338.mov");
var gradedFilePoignees338 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00338_AVEC_POIGNEES.mov");
var gradedFileBis338 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00338bis.mov");

var gradedImportSuccess338 = false;
var gradedFileName338 = "";

// Tenter import standard
if (gradedFile338.exists) {
    try {
        var gradedFootage338 = project.importFile(new ImportOptions(gradedFile338));
        gradedFootage338.parentFolder = fromGradingFolder;
        gradedFootage338.name = "UNDLM_00338";
        gradingSources[338] = gradedFootage338;
        gradingImportCount++;
        gradedImportSuccess338 = true;
        gradedFileName338 = "UNDLM_00338.mov";
        logImportSuccess(338, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00338.mov", gradedFileName338);
    } catch (e) {
        logImportError(338, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00338.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess338 && gradedFilePoignees338.exists) {
    try {
        var gradedFootage338 = project.importFile(new ImportOptions(gradedFilePoignees338));
        gradedFootage338.parentFolder = fromGradingFolder;
        gradedFootage338.name = "UNDLM_00338_AVEC_POIGNEES";
        gradingSources[338] = gradedFootage338;
        gradingImportCount++;
        gradedImportSuccess338 = true;
        gradedFileName338 = "UNDLM_00338_AVEC_POIGNEES.mov";
        logImportSuccess(338, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00338_AVEC_POIGNEES.mov", gradedFileName338);
    } catch (e) {
        logImportError(338, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00338_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess338 && gradedFileBis338.exists) {
    try {
        var gradedFootage338 = project.importFile(new ImportOptions(gradedFileBis338));
        gradedFootage338.parentFolder = fromGradingFolder;
        gradedFootage338.name = "UNDLM_00338bis";
        gradingSources[338] = gradedFootage338;
        gradingImportCount++;
        gradedImportSuccess338 = true;
        gradedFileName338 = "UNDLM_00338bis.mov";
        logImportSuccess(338, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00338bis.mov", gradedFileName338);
    } catch (e) {
        logImportError(338, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00338bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess338) {
    missingGradingCount++;
}

// Import plan GRADED 00339
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile339 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00339.mov");
var gradedFilePoignees339 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00339_AVEC_POIGNEES.mov");
var gradedFileBis339 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00339bis.mov");

var gradedImportSuccess339 = false;
var gradedFileName339 = "";

// Tenter import standard
if (gradedFile339.exists) {
    try {
        var gradedFootage339 = project.importFile(new ImportOptions(gradedFile339));
        gradedFootage339.parentFolder = fromGradingFolder;
        gradedFootage339.name = "UNDLM_00339";
        gradingSources[339] = gradedFootage339;
        gradingImportCount++;
        gradedImportSuccess339 = true;
        gradedFileName339 = "UNDLM_00339.mov";
        logImportSuccess(339, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00339.mov", gradedFileName339);
    } catch (e) {
        logImportError(339, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00339.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess339 && gradedFilePoignees339.exists) {
    try {
        var gradedFootage339 = project.importFile(new ImportOptions(gradedFilePoignees339));
        gradedFootage339.parentFolder = fromGradingFolder;
        gradedFootage339.name = "UNDLM_00339_AVEC_POIGNEES";
        gradingSources[339] = gradedFootage339;
        gradingImportCount++;
        gradedImportSuccess339 = true;
        gradedFileName339 = "UNDLM_00339_AVEC_POIGNEES.mov";
        logImportSuccess(339, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00339_AVEC_POIGNEES.mov", gradedFileName339);
    } catch (e) {
        logImportError(339, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00339_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess339 && gradedFileBis339.exists) {
    try {
        var gradedFootage339 = project.importFile(new ImportOptions(gradedFileBis339));
        gradedFootage339.parentFolder = fromGradingFolder;
        gradedFootage339.name = "UNDLM_00339bis";
        gradingSources[339] = gradedFootage339;
        gradingImportCount++;
        gradedImportSuccess339 = true;
        gradedFileName339 = "UNDLM_00339bis.mov";
        logImportSuccess(339, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00339bis.mov", gradedFileName339);
    } catch (e) {
        logImportError(339, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00339bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess339) {
    missingGradingCount++;
}

// Import plan GRADED 00340
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile340 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00340.mov");
var gradedFilePoignees340 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00340_AVEC_POIGNEES.mov");
var gradedFileBis340 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00340bis.mov");

var gradedImportSuccess340 = false;
var gradedFileName340 = "";

// Tenter import standard
if (gradedFile340.exists) {
    try {
        var gradedFootage340 = project.importFile(new ImportOptions(gradedFile340));
        gradedFootage340.parentFolder = fromGradingFolder;
        gradedFootage340.name = "UNDLM_00340";
        gradingSources[340] = gradedFootage340;
        gradingImportCount++;
        gradedImportSuccess340 = true;
        gradedFileName340 = "UNDLM_00340.mov";
        logImportSuccess(340, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00340.mov", gradedFileName340);
    } catch (e) {
        logImportError(340, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00340.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess340 && gradedFilePoignees340.exists) {
    try {
        var gradedFootage340 = project.importFile(new ImportOptions(gradedFilePoignees340));
        gradedFootage340.parentFolder = fromGradingFolder;
        gradedFootage340.name = "UNDLM_00340_AVEC_POIGNEES";
        gradingSources[340] = gradedFootage340;
        gradingImportCount++;
        gradedImportSuccess340 = true;
        gradedFileName340 = "UNDLM_00340_AVEC_POIGNEES.mov";
        logImportSuccess(340, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00340_AVEC_POIGNEES.mov", gradedFileName340);
    } catch (e) {
        logImportError(340, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00340_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess340 && gradedFileBis340.exists) {
    try {
        var gradedFootage340 = project.importFile(new ImportOptions(gradedFileBis340));
        gradedFootage340.parentFolder = fromGradingFolder;
        gradedFootage340.name = "UNDLM_00340bis";
        gradingSources[340] = gradedFootage340;
        gradingImportCount++;
        gradedImportSuccess340 = true;
        gradedFileName340 = "UNDLM_00340bis.mov";
        logImportSuccess(340, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00340bis.mov", gradedFileName340);
    } catch (e) {
        logImportError(340, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00340bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess340) {
    missingGradingCount++;
}

// Import plan GRADED 00341
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile341 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00341.mov");
var gradedFilePoignees341 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00341_AVEC_POIGNEES.mov");
var gradedFileBis341 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00341bis.mov");

var gradedImportSuccess341 = false;
var gradedFileName341 = "";

// Tenter import standard
if (gradedFile341.exists) {
    try {
        var gradedFootage341 = project.importFile(new ImportOptions(gradedFile341));
        gradedFootage341.parentFolder = fromGradingFolder;
        gradedFootage341.name = "UNDLM_00341";
        gradingSources[341] = gradedFootage341;
        gradingImportCount++;
        gradedImportSuccess341 = true;
        gradedFileName341 = "UNDLM_00341.mov";
        logImportSuccess(341, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00341.mov", gradedFileName341);
    } catch (e) {
        logImportError(341, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00341.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess341 && gradedFilePoignees341.exists) {
    try {
        var gradedFootage341 = project.importFile(new ImportOptions(gradedFilePoignees341));
        gradedFootage341.parentFolder = fromGradingFolder;
        gradedFootage341.name = "UNDLM_00341_AVEC_POIGNEES";
        gradingSources[341] = gradedFootage341;
        gradingImportCount++;
        gradedImportSuccess341 = true;
        gradedFileName341 = "UNDLM_00341_AVEC_POIGNEES.mov";
        logImportSuccess(341, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00341_AVEC_POIGNEES.mov", gradedFileName341);
    } catch (e) {
        logImportError(341, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00341_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess341 && gradedFileBis341.exists) {
    try {
        var gradedFootage341 = project.importFile(new ImportOptions(gradedFileBis341));
        gradedFootage341.parentFolder = fromGradingFolder;
        gradedFootage341.name = "UNDLM_00341bis";
        gradingSources[341] = gradedFootage341;
        gradingImportCount++;
        gradedImportSuccess341 = true;
        gradedFileName341 = "UNDLM_00341bis.mov";
        logImportSuccess(341, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00341bis.mov", gradedFileName341);
    } catch (e) {
        logImportError(341, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00341bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess341) {
    missingGradingCount++;
}

// Import plan GRADED 00342
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile342 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00342.mov");
var gradedFilePoignees342 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00342_AVEC_POIGNEES.mov");
var gradedFileBis342 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00342bis.mov");

var gradedImportSuccess342 = false;
var gradedFileName342 = "";

// Tenter import standard
if (gradedFile342.exists) {
    try {
        var gradedFootage342 = project.importFile(new ImportOptions(gradedFile342));
        gradedFootage342.parentFolder = fromGradingFolder;
        gradedFootage342.name = "UNDLM_00342";
        gradingSources[342] = gradedFootage342;
        gradingImportCount++;
        gradedImportSuccess342 = true;
        gradedFileName342 = "UNDLM_00342.mov";
        logImportSuccess(342, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00342.mov", gradedFileName342);
    } catch (e) {
        logImportError(342, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00342.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess342 && gradedFilePoignees342.exists) {
    try {
        var gradedFootage342 = project.importFile(new ImportOptions(gradedFilePoignees342));
        gradedFootage342.parentFolder = fromGradingFolder;
        gradedFootage342.name = "UNDLM_00342_AVEC_POIGNEES";
        gradingSources[342] = gradedFootage342;
        gradingImportCount++;
        gradedImportSuccess342 = true;
        gradedFileName342 = "UNDLM_00342_AVEC_POIGNEES.mov";
        logImportSuccess(342, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00342_AVEC_POIGNEES.mov", gradedFileName342);
    } catch (e) {
        logImportError(342, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00342_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess342 && gradedFileBis342.exists) {
    try {
        var gradedFootage342 = project.importFile(new ImportOptions(gradedFileBis342));
        gradedFootage342.parentFolder = fromGradingFolder;
        gradedFootage342.name = "UNDLM_00342bis";
        gradingSources[342] = gradedFootage342;
        gradingImportCount++;
        gradedImportSuccess342 = true;
        gradedFileName342 = "UNDLM_00342bis.mov";
        logImportSuccess(342, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00342bis.mov", gradedFileName342);
    } catch (e) {
        logImportError(342, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00342bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess342) {
    missingGradingCount++;
}

// Import plan GRADED 00343
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile343 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00343.mov");
var gradedFilePoignees343 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00343_AVEC_POIGNEES.mov");
var gradedFileBis343 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00343bis.mov");

var gradedImportSuccess343 = false;
var gradedFileName343 = "";

// Tenter import standard
if (gradedFile343.exists) {
    try {
        var gradedFootage343 = project.importFile(new ImportOptions(gradedFile343));
        gradedFootage343.parentFolder = fromGradingFolder;
        gradedFootage343.name = "UNDLM_00343";
        gradingSources[343] = gradedFootage343;
        gradingImportCount++;
        gradedImportSuccess343 = true;
        gradedFileName343 = "UNDLM_00343.mov";
        logImportSuccess(343, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00343.mov", gradedFileName343);
    } catch (e) {
        logImportError(343, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00343.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess343 && gradedFilePoignees343.exists) {
    try {
        var gradedFootage343 = project.importFile(new ImportOptions(gradedFilePoignees343));
        gradedFootage343.parentFolder = fromGradingFolder;
        gradedFootage343.name = "UNDLM_00343_AVEC_POIGNEES";
        gradingSources[343] = gradedFootage343;
        gradingImportCount++;
        gradedImportSuccess343 = true;
        gradedFileName343 = "UNDLM_00343_AVEC_POIGNEES.mov";
        logImportSuccess(343, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00343_AVEC_POIGNEES.mov", gradedFileName343);
    } catch (e) {
        logImportError(343, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00343_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess343 && gradedFileBis343.exists) {
    try {
        var gradedFootage343 = project.importFile(new ImportOptions(gradedFileBis343));
        gradedFootage343.parentFolder = fromGradingFolder;
        gradedFootage343.name = "UNDLM_00343bis";
        gradingSources[343] = gradedFootage343;
        gradingImportCount++;
        gradedImportSuccess343 = true;
        gradedFileName343 = "UNDLM_00343bis.mov";
        logImportSuccess(343, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00343bis.mov", gradedFileName343);
    } catch (e) {
        logImportError(343, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00343bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess343) {
    missingGradingCount++;
}

// Import plan GRADED 00344
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile344 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00344.mov");
var gradedFilePoignees344 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00344_AVEC_POIGNEES.mov");
var gradedFileBis344 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00344bis.mov");

var gradedImportSuccess344 = false;
var gradedFileName344 = "";

// Tenter import standard
if (gradedFile344.exists) {
    try {
        var gradedFootage344 = project.importFile(new ImportOptions(gradedFile344));
        gradedFootage344.parentFolder = fromGradingFolder;
        gradedFootage344.name = "UNDLM_00344";
        gradingSources[344] = gradedFootage344;
        gradingImportCount++;
        gradedImportSuccess344 = true;
        gradedFileName344 = "UNDLM_00344.mov";
        logImportSuccess(344, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00344.mov", gradedFileName344);
    } catch (e) {
        logImportError(344, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00344.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess344 && gradedFilePoignees344.exists) {
    try {
        var gradedFootage344 = project.importFile(new ImportOptions(gradedFilePoignees344));
        gradedFootage344.parentFolder = fromGradingFolder;
        gradedFootage344.name = "UNDLM_00344_AVEC_POIGNEES";
        gradingSources[344] = gradedFootage344;
        gradingImportCount++;
        gradedImportSuccess344 = true;
        gradedFileName344 = "UNDLM_00344_AVEC_POIGNEES.mov";
        logImportSuccess(344, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00344_AVEC_POIGNEES.mov", gradedFileName344);
    } catch (e) {
        logImportError(344, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00344_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess344 && gradedFileBis344.exists) {
    try {
        var gradedFootage344 = project.importFile(new ImportOptions(gradedFileBis344));
        gradedFootage344.parentFolder = fromGradingFolder;
        gradedFootage344.name = "UNDLM_00344bis";
        gradingSources[344] = gradedFootage344;
        gradingImportCount++;
        gradedImportSuccess344 = true;
        gradedFileName344 = "UNDLM_00344bis.mov";
        logImportSuccess(344, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00344bis.mov", gradedFileName344);
    } catch (e) {
        logImportError(344, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00344bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess344) {
    missingGradingCount++;
}

// Import plan GRADED 00345
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile345 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00345.mov");
var gradedFilePoignees345 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00345_AVEC_POIGNEES.mov");
var gradedFileBis345 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00345bis.mov");

var gradedImportSuccess345 = false;
var gradedFileName345 = "";

// Tenter import standard
if (gradedFile345.exists) {
    try {
        var gradedFootage345 = project.importFile(new ImportOptions(gradedFile345));
        gradedFootage345.parentFolder = fromGradingFolder;
        gradedFootage345.name = "UNDLM_00345";
        gradingSources[345] = gradedFootage345;
        gradingImportCount++;
        gradedImportSuccess345 = true;
        gradedFileName345 = "UNDLM_00345.mov";
        logImportSuccess(345, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00345.mov", gradedFileName345);
    } catch (e) {
        logImportError(345, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00345.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess345 && gradedFilePoignees345.exists) {
    try {
        var gradedFootage345 = project.importFile(new ImportOptions(gradedFilePoignees345));
        gradedFootage345.parentFolder = fromGradingFolder;
        gradedFootage345.name = "UNDLM_00345_AVEC_POIGNEES";
        gradingSources[345] = gradedFootage345;
        gradingImportCount++;
        gradedImportSuccess345 = true;
        gradedFileName345 = "UNDLM_00345_AVEC_POIGNEES.mov";
        logImportSuccess(345, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00345_AVEC_POIGNEES.mov", gradedFileName345);
    } catch (e) {
        logImportError(345, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00345_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess345 && gradedFileBis345.exists) {
    try {
        var gradedFootage345 = project.importFile(new ImportOptions(gradedFileBis345));
        gradedFootage345.parentFolder = fromGradingFolder;
        gradedFootage345.name = "UNDLM_00345bis";
        gradingSources[345] = gradedFootage345;
        gradingImportCount++;
        gradedImportSuccess345 = true;
        gradedFileName345 = "UNDLM_00345bis.mov";
        logImportSuccess(345, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00345bis.mov", gradedFileName345);
    } catch (e) {
        logImportError(345, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00345bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess345) {
    missingGradingCount++;
}

// Import plan GRADED 00346
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile346 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00346.mov");
var gradedFilePoignees346 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00346_AVEC_POIGNEES.mov");
var gradedFileBis346 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00346bis.mov");

var gradedImportSuccess346 = false;
var gradedFileName346 = "";

// Tenter import standard
if (gradedFile346.exists) {
    try {
        var gradedFootage346 = project.importFile(new ImportOptions(gradedFile346));
        gradedFootage346.parentFolder = fromGradingFolder;
        gradedFootage346.name = "UNDLM_00346";
        gradingSources[346] = gradedFootage346;
        gradingImportCount++;
        gradedImportSuccess346 = true;
        gradedFileName346 = "UNDLM_00346.mov";
        logImportSuccess(346, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00346.mov", gradedFileName346);
    } catch (e) {
        logImportError(346, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00346.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess346 && gradedFilePoignees346.exists) {
    try {
        var gradedFootage346 = project.importFile(new ImportOptions(gradedFilePoignees346));
        gradedFootage346.parentFolder = fromGradingFolder;
        gradedFootage346.name = "UNDLM_00346_AVEC_POIGNEES";
        gradingSources[346] = gradedFootage346;
        gradingImportCount++;
        gradedImportSuccess346 = true;
        gradedFileName346 = "UNDLM_00346_AVEC_POIGNEES.mov";
        logImportSuccess(346, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00346_AVEC_POIGNEES.mov", gradedFileName346);
    } catch (e) {
        logImportError(346, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00346_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess346 && gradedFileBis346.exists) {
    try {
        var gradedFootage346 = project.importFile(new ImportOptions(gradedFileBis346));
        gradedFootage346.parentFolder = fromGradingFolder;
        gradedFootage346.name = "UNDLM_00346bis";
        gradingSources[346] = gradedFootage346;
        gradingImportCount++;
        gradedImportSuccess346 = true;
        gradedFileName346 = "UNDLM_00346bis.mov";
        logImportSuccess(346, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00346bis.mov", gradedFileName346);
    } catch (e) {
        logImportError(346, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00346bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess346) {
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


// Composition pour plan 00334
var planComp334 = project.items.addComp(
    "SQ20_UNDLM_00334_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.32,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp334.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer334 = planComp334.layers.add(bgSolidComp);
bgLayer334.name = "BG_SOLID";
bgLayer334.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer334 = false;
if (gradingSources[334]) {
    var gradedLayer334 = planComp334.layers.add(gradingSources[334]);
    gradedLayer334.name = "UNDLM_00334_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer334.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer334.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer334 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer334 = false;
if (editSources[334]) {
    var editLayer334 = planComp334.layers.add(editSources[334]);
    editLayer334.name = "UNDLM_00334_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer334.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer334.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer334 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity334 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer334) {
    // EDIT toujours activé quand disponible
    editLayer334.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer334) {
        gradedLayer334.enabled = false;
    }
} else if (hasGradedLayer334) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer334.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText334 = planComp334.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText334.name = "WARNING_NO_EDIT";
    warningText334.property("Transform").property("Position").setValue([1280, 200]);
    warningText334.guideLayer = true;
    
    var warningTextDoc334 = warningText334.property("Source Text").value;
    warningTextDoc334.fontSize = 32;
    warningTextDoc334.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc334.font = "Arial-BoldMT";
    warningTextDoc334.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText334.property("Source Text").setValue(warningTextDoc334);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText334 = planComp334.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00334");
    errorText334.name = "ERROR_NO_SOURCE";
    errorText334.property("Transform").property("Position").setValue([1280, 720]);
    errorText334.guideLayer = true;
    
    var errorTextDoc334 = errorText334.property("Source Text").value;
    errorTextDoc334.fontSize = 48;
    errorTextDoc334.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc334.font = "Arial-BoldMT";
    errorTextDoc334.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText334.property("Source Text").setValue(errorTextDoc334);
}

planCompositions[334] = planComp334;


// Composition pour plan 00335
var planComp335 = project.items.addComp(
    "SQ20_UNDLM_00335_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    11.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp335.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer335 = planComp335.layers.add(bgSolidComp);
bgLayer335.name = "BG_SOLID";
bgLayer335.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer335 = false;
if (gradingSources[335]) {
    var gradedLayer335 = planComp335.layers.add(gradingSources[335]);
    gradedLayer335.name = "UNDLM_00335_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer335.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer335.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer335 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer335 = false;
if (editSources[335]) {
    var editLayer335 = planComp335.layers.add(editSources[335]);
    editLayer335.name = "UNDLM_00335_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer335.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer335.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer335 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity335 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer335) {
    // EDIT toujours activé quand disponible
    editLayer335.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer335) {
        gradedLayer335.enabled = false;
    }
} else if (hasGradedLayer335) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer335.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText335 = planComp335.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText335.name = "WARNING_NO_EDIT";
    warningText335.property("Transform").property("Position").setValue([1280, 200]);
    warningText335.guideLayer = true;
    
    var warningTextDoc335 = warningText335.property("Source Text").value;
    warningTextDoc335.fontSize = 32;
    warningTextDoc335.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc335.font = "Arial-BoldMT";
    warningTextDoc335.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText335.property("Source Text").setValue(warningTextDoc335);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText335 = planComp335.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00335");
    errorText335.name = "ERROR_NO_SOURCE";
    errorText335.property("Transform").property("Position").setValue([1280, 720]);
    errorText335.guideLayer = true;
    
    var errorTextDoc335 = errorText335.property("Source Text").value;
    errorTextDoc335.fontSize = 48;
    errorTextDoc335.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc335.font = "Arial-BoldMT";
    errorTextDoc335.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText335.property("Source Text").setValue(errorTextDoc335);
}

planCompositions[335] = planComp335;


// Composition pour plan 00336
var planComp336 = project.items.addComp(
    "SQ20_UNDLM_00336_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp336.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer336 = planComp336.layers.add(bgSolidComp);
bgLayer336.name = "BG_SOLID";
bgLayer336.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer336 = false;
if (gradingSources[336]) {
    var gradedLayer336 = planComp336.layers.add(gradingSources[336]);
    gradedLayer336.name = "UNDLM_00336_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer336.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer336.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer336 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer336 = false;
if (editSources[336]) {
    var editLayer336 = planComp336.layers.add(editSources[336]);
    editLayer336.name = "UNDLM_00336_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer336.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer336.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer336 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity336 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer336) {
    // EDIT toujours activé quand disponible
    editLayer336.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer336) {
        gradedLayer336.enabled = false;
    }
} else if (hasGradedLayer336) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer336.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText336 = planComp336.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText336.name = "WARNING_NO_EDIT";
    warningText336.property("Transform").property("Position").setValue([1280, 200]);
    warningText336.guideLayer = true;
    
    var warningTextDoc336 = warningText336.property("Source Text").value;
    warningTextDoc336.fontSize = 32;
    warningTextDoc336.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc336.font = "Arial-BoldMT";
    warningTextDoc336.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText336.property("Source Text").setValue(warningTextDoc336);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText336 = planComp336.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00336");
    errorText336.name = "ERROR_NO_SOURCE";
    errorText336.property("Transform").property("Position").setValue([1280, 720]);
    errorText336.guideLayer = true;
    
    var errorTextDoc336 = errorText336.property("Source Text").value;
    errorTextDoc336.fontSize = 48;
    errorTextDoc336.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc336.font = "Arial-BoldMT";
    errorTextDoc336.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText336.property("Source Text").setValue(errorTextDoc336);
}

planCompositions[336] = planComp336;


// Composition pour plan 00337
var planComp337 = project.items.addComp(
    "SQ20_UNDLM_00337_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp337.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer337 = planComp337.layers.add(bgSolidComp);
bgLayer337.name = "BG_SOLID";
bgLayer337.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer337 = false;
if (gradingSources[337]) {
    var gradedLayer337 = planComp337.layers.add(gradingSources[337]);
    gradedLayer337.name = "UNDLM_00337_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer337.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer337.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer337 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer337 = false;
if (editSources[337]) {
    var editLayer337 = planComp337.layers.add(editSources[337]);
    editLayer337.name = "UNDLM_00337_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer337.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer337.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer337 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity337 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer337) {
    // EDIT toujours activé quand disponible
    editLayer337.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer337) {
        gradedLayer337.enabled = false;
    }
} else if (hasGradedLayer337) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer337.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText337 = planComp337.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText337.name = "WARNING_NO_EDIT";
    warningText337.property("Transform").property("Position").setValue([1280, 200]);
    warningText337.guideLayer = true;
    
    var warningTextDoc337 = warningText337.property("Source Text").value;
    warningTextDoc337.fontSize = 32;
    warningTextDoc337.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc337.font = "Arial-BoldMT";
    warningTextDoc337.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText337.property("Source Text").setValue(warningTextDoc337);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText337 = planComp337.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00337");
    errorText337.name = "ERROR_NO_SOURCE";
    errorText337.property("Transform").property("Position").setValue([1280, 720]);
    errorText337.guideLayer = true;
    
    var errorTextDoc337 = errorText337.property("Source Text").value;
    errorTextDoc337.fontSize = 48;
    errorTextDoc337.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc337.font = "Arial-BoldMT";
    errorTextDoc337.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText337.property("Source Text").setValue(errorTextDoc337);
}

planCompositions[337] = planComp337;


// Composition pour plan 00338
var planComp338 = project.items.addComp(
    "SQ20_UNDLM_00338_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp338.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer338 = planComp338.layers.add(bgSolidComp);
bgLayer338.name = "BG_SOLID";
bgLayer338.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer338 = false;
if (gradingSources[338]) {
    var gradedLayer338 = planComp338.layers.add(gradingSources[338]);
    gradedLayer338.name = "UNDLM_00338_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer338.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer338.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer338 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer338 = false;
if (editSources[338]) {
    var editLayer338 = planComp338.layers.add(editSources[338]);
    editLayer338.name = "UNDLM_00338_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer338.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer338.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer338 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity338 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer338) {
    // EDIT toujours activé quand disponible
    editLayer338.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer338) {
        gradedLayer338.enabled = false;
    }
} else if (hasGradedLayer338) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer338.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText338 = planComp338.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText338.name = "WARNING_NO_EDIT";
    warningText338.property("Transform").property("Position").setValue([1280, 200]);
    warningText338.guideLayer = true;
    
    var warningTextDoc338 = warningText338.property("Source Text").value;
    warningTextDoc338.fontSize = 32;
    warningTextDoc338.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc338.font = "Arial-BoldMT";
    warningTextDoc338.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText338.property("Source Text").setValue(warningTextDoc338);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText338 = planComp338.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00338");
    errorText338.name = "ERROR_NO_SOURCE";
    errorText338.property("Transform").property("Position").setValue([1280, 720]);
    errorText338.guideLayer = true;
    
    var errorTextDoc338 = errorText338.property("Source Text").value;
    errorTextDoc338.fontSize = 48;
    errorTextDoc338.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc338.font = "Arial-BoldMT";
    errorTextDoc338.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText338.property("Source Text").setValue(errorTextDoc338);
}

planCompositions[338] = planComp338;


// Composition pour plan 00339
var planComp339 = project.items.addComp(
    "SQ20_UNDLM_00339_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp339.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer339 = planComp339.layers.add(bgSolidComp);
bgLayer339.name = "BG_SOLID";
bgLayer339.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer339 = false;
if (gradingSources[339]) {
    var gradedLayer339 = planComp339.layers.add(gradingSources[339]);
    gradedLayer339.name = "UNDLM_00339_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer339.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer339.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer339 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer339 = false;
if (editSources[339]) {
    var editLayer339 = planComp339.layers.add(editSources[339]);
    editLayer339.name = "UNDLM_00339_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer339.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer339.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer339 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity339 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer339) {
    // EDIT toujours activé quand disponible
    editLayer339.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer339) {
        gradedLayer339.enabled = false;
    }
} else if (hasGradedLayer339) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer339.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText339 = planComp339.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText339.name = "WARNING_NO_EDIT";
    warningText339.property("Transform").property("Position").setValue([1280, 200]);
    warningText339.guideLayer = true;
    
    var warningTextDoc339 = warningText339.property("Source Text").value;
    warningTextDoc339.fontSize = 32;
    warningTextDoc339.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc339.font = "Arial-BoldMT";
    warningTextDoc339.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText339.property("Source Text").setValue(warningTextDoc339);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText339 = planComp339.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00339");
    errorText339.name = "ERROR_NO_SOURCE";
    errorText339.property("Transform").property("Position").setValue([1280, 720]);
    errorText339.guideLayer = true;
    
    var errorTextDoc339 = errorText339.property("Source Text").value;
    errorTextDoc339.fontSize = 48;
    errorTextDoc339.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc339.font = "Arial-BoldMT";
    errorTextDoc339.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText339.property("Source Text").setValue(errorTextDoc339);
}

planCompositions[339] = planComp339;


// Composition pour plan 00340
var planComp340 = project.items.addComp(
    "SQ20_UNDLM_00340_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp340.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer340 = planComp340.layers.add(bgSolidComp);
bgLayer340.name = "BG_SOLID";
bgLayer340.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer340 = false;
if (gradingSources[340]) {
    var gradedLayer340 = planComp340.layers.add(gradingSources[340]);
    gradedLayer340.name = "UNDLM_00340_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer340.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer340.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer340 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer340 = false;
if (editSources[340]) {
    var editLayer340 = planComp340.layers.add(editSources[340]);
    editLayer340.name = "UNDLM_00340_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer340.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer340.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer340 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity340 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer340) {
    // EDIT toujours activé quand disponible
    editLayer340.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer340) {
        gradedLayer340.enabled = false;
    }
} else if (hasGradedLayer340) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer340.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText340 = planComp340.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText340.name = "WARNING_NO_EDIT";
    warningText340.property("Transform").property("Position").setValue([1280, 200]);
    warningText340.guideLayer = true;
    
    var warningTextDoc340 = warningText340.property("Source Text").value;
    warningTextDoc340.fontSize = 32;
    warningTextDoc340.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc340.font = "Arial-BoldMT";
    warningTextDoc340.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText340.property("Source Text").setValue(warningTextDoc340);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText340 = planComp340.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00340");
    errorText340.name = "ERROR_NO_SOURCE";
    errorText340.property("Transform").property("Position").setValue([1280, 720]);
    errorText340.guideLayer = true;
    
    var errorTextDoc340 = errorText340.property("Source Text").value;
    errorTextDoc340.fontSize = 48;
    errorTextDoc340.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc340.font = "Arial-BoldMT";
    errorTextDoc340.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText340.property("Source Text").setValue(errorTextDoc340);
}

planCompositions[340] = planComp340;


// Composition pour plan 00341
var planComp341 = project.items.addComp(
    "SQ20_UNDLM_00341_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp341.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer341 = planComp341.layers.add(bgSolidComp);
bgLayer341.name = "BG_SOLID";
bgLayer341.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer341 = false;
if (gradingSources[341]) {
    var gradedLayer341 = planComp341.layers.add(gradingSources[341]);
    gradedLayer341.name = "UNDLM_00341_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer341.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer341.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer341 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer341 = false;
if (editSources[341]) {
    var editLayer341 = planComp341.layers.add(editSources[341]);
    editLayer341.name = "UNDLM_00341_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer341.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer341.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer341 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity341 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer341) {
    // EDIT toujours activé quand disponible
    editLayer341.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer341) {
        gradedLayer341.enabled = false;
    }
} else if (hasGradedLayer341) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer341.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText341 = planComp341.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText341.name = "WARNING_NO_EDIT";
    warningText341.property("Transform").property("Position").setValue([1280, 200]);
    warningText341.guideLayer = true;
    
    var warningTextDoc341 = warningText341.property("Source Text").value;
    warningTextDoc341.fontSize = 32;
    warningTextDoc341.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc341.font = "Arial-BoldMT";
    warningTextDoc341.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText341.property("Source Text").setValue(warningTextDoc341);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText341 = planComp341.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00341");
    errorText341.name = "ERROR_NO_SOURCE";
    errorText341.property("Transform").property("Position").setValue([1280, 720]);
    errorText341.guideLayer = true;
    
    var errorTextDoc341 = errorText341.property("Source Text").value;
    errorTextDoc341.fontSize = 48;
    errorTextDoc341.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc341.font = "Arial-BoldMT";
    errorTextDoc341.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText341.property("Source Text").setValue(errorTextDoc341);
}

planCompositions[341] = planComp341;


// Composition pour plan 00342
var planComp342 = project.items.addComp(
    "SQ20_UNDLM_00342_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.7199999999999998,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp342.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer342 = planComp342.layers.add(bgSolidComp);
bgLayer342.name = "BG_SOLID";
bgLayer342.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer342 = false;
if (gradingSources[342]) {
    var gradedLayer342 = planComp342.layers.add(gradingSources[342]);
    gradedLayer342.name = "UNDLM_00342_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer342.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer342.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer342 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer342 = false;
if (editSources[342]) {
    var editLayer342 = planComp342.layers.add(editSources[342]);
    editLayer342.name = "UNDLM_00342_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer342.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer342.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer342 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity342 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer342) {
    // EDIT toujours activé quand disponible
    editLayer342.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer342) {
        gradedLayer342.enabled = false;
    }
} else if (hasGradedLayer342) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer342.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText342 = planComp342.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText342.name = "WARNING_NO_EDIT";
    warningText342.property("Transform").property("Position").setValue([1280, 200]);
    warningText342.guideLayer = true;
    
    var warningTextDoc342 = warningText342.property("Source Text").value;
    warningTextDoc342.fontSize = 32;
    warningTextDoc342.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc342.font = "Arial-BoldMT";
    warningTextDoc342.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText342.property("Source Text").setValue(warningTextDoc342);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText342 = planComp342.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00342");
    errorText342.name = "ERROR_NO_SOURCE";
    errorText342.property("Transform").property("Position").setValue([1280, 720]);
    errorText342.guideLayer = true;
    
    var errorTextDoc342 = errorText342.property("Source Text").value;
    errorTextDoc342.fontSize = 48;
    errorTextDoc342.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc342.font = "Arial-BoldMT";
    errorTextDoc342.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText342.property("Source Text").setValue(errorTextDoc342);
}

planCompositions[342] = planComp342;


// Composition pour plan 00343
var planComp343 = project.items.addComp(
    "SQ20_UNDLM_00343_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp343.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer343 = planComp343.layers.add(bgSolidComp);
bgLayer343.name = "BG_SOLID";
bgLayer343.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer343 = false;
if (gradingSources[343]) {
    var gradedLayer343 = planComp343.layers.add(gradingSources[343]);
    gradedLayer343.name = "UNDLM_00343_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer343.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer343.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer343 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer343 = false;
if (editSources[343]) {
    var editLayer343 = planComp343.layers.add(editSources[343]);
    editLayer343.name = "UNDLM_00343_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer343.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer343.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer343 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity343 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer343) {
    // EDIT toujours activé quand disponible
    editLayer343.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer343) {
        gradedLayer343.enabled = false;
    }
} else if (hasGradedLayer343) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer343.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText343 = planComp343.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText343.name = "WARNING_NO_EDIT";
    warningText343.property("Transform").property("Position").setValue([1280, 200]);
    warningText343.guideLayer = true;
    
    var warningTextDoc343 = warningText343.property("Source Text").value;
    warningTextDoc343.fontSize = 32;
    warningTextDoc343.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc343.font = "Arial-BoldMT";
    warningTextDoc343.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText343.property("Source Text").setValue(warningTextDoc343);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText343 = planComp343.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00343");
    errorText343.name = "ERROR_NO_SOURCE";
    errorText343.property("Transform").property("Position").setValue([1280, 720]);
    errorText343.guideLayer = true;
    
    var errorTextDoc343 = errorText343.property("Source Text").value;
    errorTextDoc343.fontSize = 48;
    errorTextDoc343.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc343.font = "Arial-BoldMT";
    errorTextDoc343.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText343.property("Source Text").setValue(errorTextDoc343);
}

planCompositions[343] = planComp343;


// Composition pour plan 00344
var planComp344 = project.items.addComp(
    "SQ20_UNDLM_00344_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp344.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer344 = planComp344.layers.add(bgSolidComp);
bgLayer344.name = "BG_SOLID";
bgLayer344.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer344 = false;
if (gradingSources[344]) {
    var gradedLayer344 = planComp344.layers.add(gradingSources[344]);
    gradedLayer344.name = "UNDLM_00344_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer344.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer344.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer344 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer344 = false;
if (editSources[344]) {
    var editLayer344 = planComp344.layers.add(editSources[344]);
    editLayer344.name = "UNDLM_00344_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer344.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer344.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer344 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity344 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer344) {
    // EDIT toujours activé quand disponible
    editLayer344.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer344) {
        gradedLayer344.enabled = false;
    }
} else if (hasGradedLayer344) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer344.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText344 = planComp344.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText344.name = "WARNING_NO_EDIT";
    warningText344.property("Transform").property("Position").setValue([1280, 200]);
    warningText344.guideLayer = true;
    
    var warningTextDoc344 = warningText344.property("Source Text").value;
    warningTextDoc344.fontSize = 32;
    warningTextDoc344.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc344.font = "Arial-BoldMT";
    warningTextDoc344.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText344.property("Source Text").setValue(warningTextDoc344);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText344 = planComp344.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00344");
    errorText344.name = "ERROR_NO_SOURCE";
    errorText344.property("Transform").property("Position").setValue([1280, 720]);
    errorText344.guideLayer = true;
    
    var errorTextDoc344 = errorText344.property("Source Text").value;
    errorTextDoc344.fontSize = 48;
    errorTextDoc344.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc344.font = "Arial-BoldMT";
    errorTextDoc344.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText344.property("Source Text").setValue(errorTextDoc344);
}

planCompositions[344] = planComp344;


// Composition pour plan 00345
var planComp345 = project.items.addComp(
    "SQ20_UNDLM_00345_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp345.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer345 = planComp345.layers.add(bgSolidComp);
bgLayer345.name = "BG_SOLID";
bgLayer345.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer345 = false;
if (gradingSources[345]) {
    var gradedLayer345 = planComp345.layers.add(gradingSources[345]);
    gradedLayer345.name = "UNDLM_00345_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer345.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer345.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer345 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer345 = false;
if (editSources[345]) {
    var editLayer345 = planComp345.layers.add(editSources[345]);
    editLayer345.name = "UNDLM_00345_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer345.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer345.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer345 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity345 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer345) {
    // EDIT toujours activé quand disponible
    editLayer345.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer345) {
        gradedLayer345.enabled = false;
    }
} else if (hasGradedLayer345) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer345.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText345 = planComp345.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText345.name = "WARNING_NO_EDIT";
    warningText345.property("Transform").property("Position").setValue([1280, 200]);
    warningText345.guideLayer = true;
    
    var warningTextDoc345 = warningText345.property("Source Text").value;
    warningTextDoc345.fontSize = 32;
    warningTextDoc345.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc345.font = "Arial-BoldMT";
    warningTextDoc345.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText345.property("Source Text").setValue(warningTextDoc345);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText345 = planComp345.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00345");
    errorText345.name = "ERROR_NO_SOURCE";
    errorText345.property("Transform").property("Position").setValue([1280, 720]);
    errorText345.guideLayer = true;
    
    var errorTextDoc345 = errorText345.property("Source Text").value;
    errorTextDoc345.fontSize = 48;
    errorTextDoc345.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc345.font = "Arial-BoldMT";
    errorTextDoc345.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText345.property("Source Text").setValue(errorTextDoc345);
}

planCompositions[345] = planComp345;


// Composition pour plan 00346
var planComp346 = project.items.addComp(
    "SQ20_UNDLM_00346_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp346.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer346 = planComp346.layers.add(bgSolidComp);
bgLayer346.name = "BG_SOLID";
bgLayer346.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer346 = false;
if (gradingSources[346]) {
    var gradedLayer346 = planComp346.layers.add(gradingSources[346]);
    gradedLayer346.name = "UNDLM_00346_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer346.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer346.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer346 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer346 = false;
if (editSources[346]) {
    var editLayer346 = planComp346.layers.add(editSources[346]);
    editLayer346.name = "UNDLM_00346_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer346.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer346.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer346 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity346 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer346) {
    // EDIT toujours activé quand disponible
    editLayer346.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer346) {
        gradedLayer346.enabled = false;
    }
} else if (hasGradedLayer346) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer346.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText346 = planComp346.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText346.name = "WARNING_NO_EDIT";
    warningText346.property("Transform").property("Position").setValue([1280, 200]);
    warningText346.guideLayer = true;
    
    var warningTextDoc346 = warningText346.property("Source Text").value;
    warningTextDoc346.fontSize = 32;
    warningTextDoc346.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc346.font = "Arial-BoldMT";
    warningTextDoc346.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText346.property("Source Text").setValue(warningTextDoc346);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText346 = planComp346.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00346");
    errorText346.name = "ERROR_NO_SOURCE";
    errorText346.property("Transform").property("Position").setValue([1280, 720]);
    errorText346.guideLayer = true;
    
    var errorTextDoc346 = errorText346.property("Source Text").value;
    errorTextDoc346.fontSize = 48;
    errorTextDoc346.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc346.font = "Arial-BoldMT";
    errorTextDoc346.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText346.property("Source Text").setValue(errorTextDoc346);
}

planCompositions[346] = planComp346;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ20_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    74.92, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00334 à la timeline master
if (planCompositions[334]) {
    var masterLayer334 = masterComp.layers.add(planCompositions[334]);
    masterLayer334.startTime = 0;
    masterLayer334.name = "UNDLM_00334";
    masterLayer334.label = 1; // Couleurs alternées
}

// Ajouter plan 00335 à la timeline master
if (planCompositions[335]) {
    var masterLayer335 = masterComp.layers.add(planCompositions[335]);
    masterLayer335.startTime = 7.32;
    masterLayer335.name = "UNDLM_00335";
    masterLayer335.label = 2; // Couleurs alternées
}

// Ajouter plan 00336 à la timeline master
if (planCompositions[336]) {
    var masterLayer336 = masterComp.layers.add(planCompositions[336]);
    masterLayer336.startTime = 18.32;
    masterLayer336.name = "UNDLM_00336";
    masterLayer336.label = 3; // Couleurs alternées
}

// Ajouter plan 00337 à la timeline master
if (planCompositions[337]) {
    var masterLayer337 = masterComp.layers.add(planCompositions[337]);
    masterLayer337.startTime = 23.52;
    masterLayer337.name = "UNDLM_00337";
    masterLayer337.label = 4; // Couleurs alternées
}

// Ajouter plan 00338 à la timeline master
if (planCompositions[338]) {
    var masterLayer338 = masterComp.layers.add(planCompositions[338]);
    masterLayer338.startTime = 30.68;
    masterLayer338.name = "UNDLM_00338";
    masterLayer338.label = 5; // Couleurs alternées
}

// Ajouter plan 00339 à la timeline master
if (planCompositions[339]) {
    var masterLayer339 = masterComp.layers.add(planCompositions[339]);
    masterLayer339.startTime = 34.12;
    masterLayer339.name = "UNDLM_00339";
    masterLayer339.label = 6; // Couleurs alternées
}

// Ajouter plan 00340 à la timeline master
if (planCompositions[340]) {
    var masterLayer340 = masterComp.layers.add(planCompositions[340]);
    masterLayer340.startTime = 43.959999999999994;
    masterLayer340.name = "UNDLM_00340";
    masterLayer340.label = 7; // Couleurs alternées
}

// Ajouter plan 00341 à la timeline master
if (planCompositions[341]) {
    var masterLayer341 = masterComp.layers.add(planCompositions[341]);
    masterLayer341.startTime = 53.11999999999999;
    masterLayer341.name = "UNDLM_00341";
    masterLayer341.label = 8; // Couleurs alternées
}

// Ajouter plan 00342 à la timeline master
if (planCompositions[342]) {
    var masterLayer342 = masterComp.layers.add(planCompositions[342]);
    masterLayer342.startTime = 58.31999999999999;
    masterLayer342.name = "UNDLM_00342";
    masterLayer342.label = 9; // Couleurs alternées
}

// Ajouter plan 00343 à la timeline master
if (planCompositions[343]) {
    var masterLayer343 = masterComp.layers.add(planCompositions[343]);
    masterLayer343.startTime = 62.03999999999999;
    masterLayer343.name = "UNDLM_00343";
    masterLayer343.label = 10; // Couleurs alternées
}

// Ajouter plan 00344 à la timeline master
if (planCompositions[344]) {
    var masterLayer344 = masterComp.layers.add(planCompositions[344]);
    masterLayer344.startTime = 64.72;
    masterLayer344.name = "UNDLM_00344";
    masterLayer344.label = 11; // Couleurs alternées
}

// Ajouter plan 00345 à la timeline master
if (planCompositions[345]) {
    var masterLayer345 = masterComp.layers.add(planCompositions[345]);
    masterLayer345.startTime = 67.67999999999999;
    masterLayer345.name = "UNDLM_00345";
    masterLayer345.label = 12; // Couleurs alternées
}

// Ajouter plan 00346 à la timeline master
if (planCompositions[346]) {
    var masterLayer346 = masterComp.layers.add(planCompositions[346]);
    masterLayer346.startTime = 70.8;
    masterLayer346.name = "UNDLM_00346";
    masterLayer346.label = 13; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ20";\n' +
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
    {start: 0, end: 7.32, name: "UNDLM_00334"},
    {start: 7.32, end: 18.32, name: "UNDLM_00335"},
    {start: 18.32, end: 23.52, name: "UNDLM_00336"},
    {start: 23.52, end: 30.68, name: "UNDLM_00337"},
    {start: 30.68, end: 34.12, name: "UNDLM_00338"},
    {start: 34.12, end: 43.959999999999994, name: "UNDLM_00339"},
    {start: 43.959999999999994, end: 53.11999999999999, name: "UNDLM_00340"},
    {start: 53.11999999999999, end: 58.31999999999999, name: "UNDLM_00341"},
    {start: 58.31999999999999, end: 62.03999999999999, name: "UNDLM_00342"},
    {start: 62.03999999999999, end: 64.72, name: "UNDLM_00343"},
    {start: 64.72, end: 67.67999999999999, name: "UNDLM_00344"},
    {start: 67.67999999999999, end: 70.8, name: "UNDLM_00345"},
    {start: 70.8, end: 74.92, name: "UNDLM_00346"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ20/_AE/SQ20_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 13;
var totalCount = 13;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ20 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(74.92 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ20_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ20:" + totalCount + ":" + gradedCount);
