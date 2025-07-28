
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ16 avec 17 plans
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


// Import plan EDIT 00287
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile287 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00287.mov");
var editFilePoignees287 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00287_AVEC_POIGNEES.mov");
var editFileBis287 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00287bis.mov");

var importSuccess287 = false;
var fileName287 = "";

// Tenter import standard
if (editFile287.exists) {
    try {
        var editFootage287 = project.importFile(new ImportOptions(editFile287));
        editFootage287.parentFolder = fromEditFolder;
        editFootage287.name = "UNDLM_00287";
        editSources[287] = editFootage287;
        editImportCount++;
        importSuccess287 = true;
        fileName287 = "UNDLM_00287.mov";
        logImportSuccess(287, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00287.mov", fileName287);
    } catch (e) {
        logImportError(287, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00287.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess287 && editFilePoignees287.exists) {
    try {
        var editFootage287 = project.importFile(new ImportOptions(editFilePoignees287));
        editFootage287.parentFolder = fromEditFolder;
        editFootage287.name = "UNDLM_00287_AVEC_POIGNEES";
        editSources[287] = editFootage287;
        editImportCount++;
        importSuccess287 = true;
        fileName287 = "UNDLM_00287_AVEC_POIGNEES.mov";
        logImportSuccess(287, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00287_AVEC_POIGNEES.mov", fileName287);
    } catch (e) {
        logImportError(287, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00287_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess287 && editFileBis287.exists) {
    try {
        var editFootage287 = project.importFile(new ImportOptions(editFileBis287));
        editFootage287.parentFolder = fromEditFolder;
        editFootage287.name = "UNDLM_00287bis";
        editSources[287] = editFootage287;
        editImportCount++;
        importSuccess287 = true;
        fileName287 = "UNDLM_00287bis.mov";
        logImportSuccess(287, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00287bis.mov", fileName287);
    } catch (e) {
        logImportError(287, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00287bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess287) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00287.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00288
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile288 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00288.mov");
var editFilePoignees288 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00288_AVEC_POIGNEES.mov");
var editFileBis288 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00288bis.mov");

var importSuccess288 = false;
var fileName288 = "";

// Tenter import standard
if (editFile288.exists) {
    try {
        var editFootage288 = project.importFile(new ImportOptions(editFile288));
        editFootage288.parentFolder = fromEditFolder;
        editFootage288.name = "UNDLM_00288";
        editSources[288] = editFootage288;
        editImportCount++;
        importSuccess288 = true;
        fileName288 = "UNDLM_00288.mov";
        logImportSuccess(288, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00288.mov", fileName288);
    } catch (e) {
        logImportError(288, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00288.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess288 && editFilePoignees288.exists) {
    try {
        var editFootage288 = project.importFile(new ImportOptions(editFilePoignees288));
        editFootage288.parentFolder = fromEditFolder;
        editFootage288.name = "UNDLM_00288_AVEC_POIGNEES";
        editSources[288] = editFootage288;
        editImportCount++;
        importSuccess288 = true;
        fileName288 = "UNDLM_00288_AVEC_POIGNEES.mov";
        logImportSuccess(288, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00288_AVEC_POIGNEES.mov", fileName288);
    } catch (e) {
        logImportError(288, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00288_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess288 && editFileBis288.exists) {
    try {
        var editFootage288 = project.importFile(new ImportOptions(editFileBis288));
        editFootage288.parentFolder = fromEditFolder;
        editFootage288.name = "UNDLM_00288bis";
        editSources[288] = editFootage288;
        editImportCount++;
        importSuccess288 = true;
        fileName288 = "UNDLM_00288bis.mov";
        logImportSuccess(288, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00288bis.mov", fileName288);
    } catch (e) {
        logImportError(288, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00288bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess288) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00288.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00289
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile289 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00289.mov");
var editFilePoignees289 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00289_AVEC_POIGNEES.mov");
var editFileBis289 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00289bis.mov");

var importSuccess289 = false;
var fileName289 = "";

// Tenter import standard
if (editFile289.exists) {
    try {
        var editFootage289 = project.importFile(new ImportOptions(editFile289));
        editFootage289.parentFolder = fromEditFolder;
        editFootage289.name = "UNDLM_00289";
        editSources[289] = editFootage289;
        editImportCount++;
        importSuccess289 = true;
        fileName289 = "UNDLM_00289.mov";
        logImportSuccess(289, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00289.mov", fileName289);
    } catch (e) {
        logImportError(289, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00289.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess289 && editFilePoignees289.exists) {
    try {
        var editFootage289 = project.importFile(new ImportOptions(editFilePoignees289));
        editFootage289.parentFolder = fromEditFolder;
        editFootage289.name = "UNDLM_00289_AVEC_POIGNEES";
        editSources[289] = editFootage289;
        editImportCount++;
        importSuccess289 = true;
        fileName289 = "UNDLM_00289_AVEC_POIGNEES.mov";
        logImportSuccess(289, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00289_AVEC_POIGNEES.mov", fileName289);
    } catch (e) {
        logImportError(289, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00289_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess289 && editFileBis289.exists) {
    try {
        var editFootage289 = project.importFile(new ImportOptions(editFileBis289));
        editFootage289.parentFolder = fromEditFolder;
        editFootage289.name = "UNDLM_00289bis";
        editSources[289] = editFootage289;
        editImportCount++;
        importSuccess289 = true;
        fileName289 = "UNDLM_00289bis.mov";
        logImportSuccess(289, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00289bis.mov", fileName289);
    } catch (e) {
        logImportError(289, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00289bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess289) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00289.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00290
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile290 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00290.mov");
var editFilePoignees290 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00290_AVEC_POIGNEES.mov");
var editFileBis290 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00290bis.mov");

var importSuccess290 = false;
var fileName290 = "";

// Tenter import standard
if (editFile290.exists) {
    try {
        var editFootage290 = project.importFile(new ImportOptions(editFile290));
        editFootage290.parentFolder = fromEditFolder;
        editFootage290.name = "UNDLM_00290";
        editSources[290] = editFootage290;
        editImportCount++;
        importSuccess290 = true;
        fileName290 = "UNDLM_00290.mov";
        logImportSuccess(290, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00290.mov", fileName290);
    } catch (e) {
        logImportError(290, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00290.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess290 && editFilePoignees290.exists) {
    try {
        var editFootage290 = project.importFile(new ImportOptions(editFilePoignees290));
        editFootage290.parentFolder = fromEditFolder;
        editFootage290.name = "UNDLM_00290_AVEC_POIGNEES";
        editSources[290] = editFootage290;
        editImportCount++;
        importSuccess290 = true;
        fileName290 = "UNDLM_00290_AVEC_POIGNEES.mov";
        logImportSuccess(290, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00290_AVEC_POIGNEES.mov", fileName290);
    } catch (e) {
        logImportError(290, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00290_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess290 && editFileBis290.exists) {
    try {
        var editFootage290 = project.importFile(new ImportOptions(editFileBis290));
        editFootage290.parentFolder = fromEditFolder;
        editFootage290.name = "UNDLM_00290bis";
        editSources[290] = editFootage290;
        editImportCount++;
        importSuccess290 = true;
        fileName290 = "UNDLM_00290bis.mov";
        logImportSuccess(290, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00290bis.mov", fileName290);
    } catch (e) {
        logImportError(290, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00290bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess290) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00290.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00291
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile291 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00291.mov");
var editFilePoignees291 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00291_AVEC_POIGNEES.mov");
var editFileBis291 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00291bis.mov");

var importSuccess291 = false;
var fileName291 = "";

// Tenter import standard
if (editFile291.exists) {
    try {
        var editFootage291 = project.importFile(new ImportOptions(editFile291));
        editFootage291.parentFolder = fromEditFolder;
        editFootage291.name = "UNDLM_00291";
        editSources[291] = editFootage291;
        editImportCount++;
        importSuccess291 = true;
        fileName291 = "UNDLM_00291.mov";
        logImportSuccess(291, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00291.mov", fileName291);
    } catch (e) {
        logImportError(291, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00291.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess291 && editFilePoignees291.exists) {
    try {
        var editFootage291 = project.importFile(new ImportOptions(editFilePoignees291));
        editFootage291.parentFolder = fromEditFolder;
        editFootage291.name = "UNDLM_00291_AVEC_POIGNEES";
        editSources[291] = editFootage291;
        editImportCount++;
        importSuccess291 = true;
        fileName291 = "UNDLM_00291_AVEC_POIGNEES.mov";
        logImportSuccess(291, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00291_AVEC_POIGNEES.mov", fileName291);
    } catch (e) {
        logImportError(291, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00291_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess291 && editFileBis291.exists) {
    try {
        var editFootage291 = project.importFile(new ImportOptions(editFileBis291));
        editFootage291.parentFolder = fromEditFolder;
        editFootage291.name = "UNDLM_00291bis";
        editSources[291] = editFootage291;
        editImportCount++;
        importSuccess291 = true;
        fileName291 = "UNDLM_00291bis.mov";
        logImportSuccess(291, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00291bis.mov", fileName291);
    } catch (e) {
        logImportError(291, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00291bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess291) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00291.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00292
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile292 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00292.mov");
var editFilePoignees292 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00292_AVEC_POIGNEES.mov");
var editFileBis292 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00292bis.mov");

var importSuccess292 = false;
var fileName292 = "";

// Tenter import standard
if (editFile292.exists) {
    try {
        var editFootage292 = project.importFile(new ImportOptions(editFile292));
        editFootage292.parentFolder = fromEditFolder;
        editFootage292.name = "UNDLM_00292";
        editSources[292] = editFootage292;
        editImportCount++;
        importSuccess292 = true;
        fileName292 = "UNDLM_00292.mov";
        logImportSuccess(292, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00292.mov", fileName292);
    } catch (e) {
        logImportError(292, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00292.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess292 && editFilePoignees292.exists) {
    try {
        var editFootage292 = project.importFile(new ImportOptions(editFilePoignees292));
        editFootage292.parentFolder = fromEditFolder;
        editFootage292.name = "UNDLM_00292_AVEC_POIGNEES";
        editSources[292] = editFootage292;
        editImportCount++;
        importSuccess292 = true;
        fileName292 = "UNDLM_00292_AVEC_POIGNEES.mov";
        logImportSuccess(292, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00292_AVEC_POIGNEES.mov", fileName292);
    } catch (e) {
        logImportError(292, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00292_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess292 && editFileBis292.exists) {
    try {
        var editFootage292 = project.importFile(new ImportOptions(editFileBis292));
        editFootage292.parentFolder = fromEditFolder;
        editFootage292.name = "UNDLM_00292bis";
        editSources[292] = editFootage292;
        editImportCount++;
        importSuccess292 = true;
        fileName292 = "UNDLM_00292bis.mov";
        logImportSuccess(292, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00292bis.mov", fileName292);
    } catch (e) {
        logImportError(292, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00292bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess292) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00292.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00293
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile293 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00293.mov");
var editFilePoignees293 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00293_AVEC_POIGNEES.mov");
var editFileBis293 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00293bis.mov");

var importSuccess293 = false;
var fileName293 = "";

// Tenter import standard
if (editFile293.exists) {
    try {
        var editFootage293 = project.importFile(new ImportOptions(editFile293));
        editFootage293.parentFolder = fromEditFolder;
        editFootage293.name = "UNDLM_00293";
        editSources[293] = editFootage293;
        editImportCount++;
        importSuccess293 = true;
        fileName293 = "UNDLM_00293.mov";
        logImportSuccess(293, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00293.mov", fileName293);
    } catch (e) {
        logImportError(293, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00293.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess293 && editFilePoignees293.exists) {
    try {
        var editFootage293 = project.importFile(new ImportOptions(editFilePoignees293));
        editFootage293.parentFolder = fromEditFolder;
        editFootage293.name = "UNDLM_00293_AVEC_POIGNEES";
        editSources[293] = editFootage293;
        editImportCount++;
        importSuccess293 = true;
        fileName293 = "UNDLM_00293_AVEC_POIGNEES.mov";
        logImportSuccess(293, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00293_AVEC_POIGNEES.mov", fileName293);
    } catch (e) {
        logImportError(293, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00293_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess293 && editFileBis293.exists) {
    try {
        var editFootage293 = project.importFile(new ImportOptions(editFileBis293));
        editFootage293.parentFolder = fromEditFolder;
        editFootage293.name = "UNDLM_00293bis";
        editSources[293] = editFootage293;
        editImportCount++;
        importSuccess293 = true;
        fileName293 = "UNDLM_00293bis.mov";
        logImportSuccess(293, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00293bis.mov", fileName293);
    } catch (e) {
        logImportError(293, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00293bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess293) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00293.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00294
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile294 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00294.mov");
var editFilePoignees294 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00294_AVEC_POIGNEES.mov");
var editFileBis294 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00294bis.mov");

var importSuccess294 = false;
var fileName294 = "";

// Tenter import standard
if (editFile294.exists) {
    try {
        var editFootage294 = project.importFile(new ImportOptions(editFile294));
        editFootage294.parentFolder = fromEditFolder;
        editFootage294.name = "UNDLM_00294";
        editSources[294] = editFootage294;
        editImportCount++;
        importSuccess294 = true;
        fileName294 = "UNDLM_00294.mov";
        logImportSuccess(294, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00294.mov", fileName294);
    } catch (e) {
        logImportError(294, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00294.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess294 && editFilePoignees294.exists) {
    try {
        var editFootage294 = project.importFile(new ImportOptions(editFilePoignees294));
        editFootage294.parentFolder = fromEditFolder;
        editFootage294.name = "UNDLM_00294_AVEC_POIGNEES";
        editSources[294] = editFootage294;
        editImportCount++;
        importSuccess294 = true;
        fileName294 = "UNDLM_00294_AVEC_POIGNEES.mov";
        logImportSuccess(294, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00294_AVEC_POIGNEES.mov", fileName294);
    } catch (e) {
        logImportError(294, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00294_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess294 && editFileBis294.exists) {
    try {
        var editFootage294 = project.importFile(new ImportOptions(editFileBis294));
        editFootage294.parentFolder = fromEditFolder;
        editFootage294.name = "UNDLM_00294bis";
        editSources[294] = editFootage294;
        editImportCount++;
        importSuccess294 = true;
        fileName294 = "UNDLM_00294bis.mov";
        logImportSuccess(294, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00294bis.mov", fileName294);
    } catch (e) {
        logImportError(294, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00294bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess294) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00294.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00295
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile295 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00295.mov");
var editFilePoignees295 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00295_AVEC_POIGNEES.mov");
var editFileBis295 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00295bis.mov");

var importSuccess295 = false;
var fileName295 = "";

// Tenter import standard
if (editFile295.exists) {
    try {
        var editFootage295 = project.importFile(new ImportOptions(editFile295));
        editFootage295.parentFolder = fromEditFolder;
        editFootage295.name = "UNDLM_00295";
        editSources[295] = editFootage295;
        editImportCount++;
        importSuccess295 = true;
        fileName295 = "UNDLM_00295.mov";
        logImportSuccess(295, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00295.mov", fileName295);
    } catch (e) {
        logImportError(295, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00295.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess295 && editFilePoignees295.exists) {
    try {
        var editFootage295 = project.importFile(new ImportOptions(editFilePoignees295));
        editFootage295.parentFolder = fromEditFolder;
        editFootage295.name = "UNDLM_00295_AVEC_POIGNEES";
        editSources[295] = editFootage295;
        editImportCount++;
        importSuccess295 = true;
        fileName295 = "UNDLM_00295_AVEC_POIGNEES.mov";
        logImportSuccess(295, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00295_AVEC_POIGNEES.mov", fileName295);
    } catch (e) {
        logImportError(295, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00295_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess295 && editFileBis295.exists) {
    try {
        var editFootage295 = project.importFile(new ImportOptions(editFileBis295));
        editFootage295.parentFolder = fromEditFolder;
        editFootage295.name = "UNDLM_00295bis";
        editSources[295] = editFootage295;
        editImportCount++;
        importSuccess295 = true;
        fileName295 = "UNDLM_00295bis.mov";
        logImportSuccess(295, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00295bis.mov", fileName295);
    } catch (e) {
        logImportError(295, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00295bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess295) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00295.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00296
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile296 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00296.mov");
var editFilePoignees296 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00296_AVEC_POIGNEES.mov");
var editFileBis296 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00296bis.mov");

var importSuccess296 = false;
var fileName296 = "";

// Tenter import standard
if (editFile296.exists) {
    try {
        var editFootage296 = project.importFile(new ImportOptions(editFile296));
        editFootage296.parentFolder = fromEditFolder;
        editFootage296.name = "UNDLM_00296";
        editSources[296] = editFootage296;
        editImportCount++;
        importSuccess296 = true;
        fileName296 = "UNDLM_00296.mov";
        logImportSuccess(296, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00296.mov", fileName296);
    } catch (e) {
        logImportError(296, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00296.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess296 && editFilePoignees296.exists) {
    try {
        var editFootage296 = project.importFile(new ImportOptions(editFilePoignees296));
        editFootage296.parentFolder = fromEditFolder;
        editFootage296.name = "UNDLM_00296_AVEC_POIGNEES";
        editSources[296] = editFootage296;
        editImportCount++;
        importSuccess296 = true;
        fileName296 = "UNDLM_00296_AVEC_POIGNEES.mov";
        logImportSuccess(296, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00296_AVEC_POIGNEES.mov", fileName296);
    } catch (e) {
        logImportError(296, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00296_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess296 && editFileBis296.exists) {
    try {
        var editFootage296 = project.importFile(new ImportOptions(editFileBis296));
        editFootage296.parentFolder = fromEditFolder;
        editFootage296.name = "UNDLM_00296bis";
        editSources[296] = editFootage296;
        editImportCount++;
        importSuccess296 = true;
        fileName296 = "UNDLM_00296bis.mov";
        logImportSuccess(296, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00296bis.mov", fileName296);
    } catch (e) {
        logImportError(296, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00296bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess296) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00296.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00297
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile297 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00297.mov");
var editFilePoignees297 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00297_AVEC_POIGNEES.mov");
var editFileBis297 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00297bis.mov");

var importSuccess297 = false;
var fileName297 = "";

// Tenter import standard
if (editFile297.exists) {
    try {
        var editFootage297 = project.importFile(new ImportOptions(editFile297));
        editFootage297.parentFolder = fromEditFolder;
        editFootage297.name = "UNDLM_00297";
        editSources[297] = editFootage297;
        editImportCount++;
        importSuccess297 = true;
        fileName297 = "UNDLM_00297.mov";
        logImportSuccess(297, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00297.mov", fileName297);
    } catch (e) {
        logImportError(297, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00297.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess297 && editFilePoignees297.exists) {
    try {
        var editFootage297 = project.importFile(new ImportOptions(editFilePoignees297));
        editFootage297.parentFolder = fromEditFolder;
        editFootage297.name = "UNDLM_00297_AVEC_POIGNEES";
        editSources[297] = editFootage297;
        editImportCount++;
        importSuccess297 = true;
        fileName297 = "UNDLM_00297_AVEC_POIGNEES.mov";
        logImportSuccess(297, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00297_AVEC_POIGNEES.mov", fileName297);
    } catch (e) {
        logImportError(297, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00297_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess297 && editFileBis297.exists) {
    try {
        var editFootage297 = project.importFile(new ImportOptions(editFileBis297));
        editFootage297.parentFolder = fromEditFolder;
        editFootage297.name = "UNDLM_00297bis";
        editSources[297] = editFootage297;
        editImportCount++;
        importSuccess297 = true;
        fileName297 = "UNDLM_00297bis.mov";
        logImportSuccess(297, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00297bis.mov", fileName297);
    } catch (e) {
        logImportError(297, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00297bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess297) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00297.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00298
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile298 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00298.mov");
var editFilePoignees298 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00298_AVEC_POIGNEES.mov");
var editFileBis298 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00298bis.mov");

var importSuccess298 = false;
var fileName298 = "";

// Tenter import standard
if (editFile298.exists) {
    try {
        var editFootage298 = project.importFile(new ImportOptions(editFile298));
        editFootage298.parentFolder = fromEditFolder;
        editFootage298.name = "UNDLM_00298";
        editSources[298] = editFootage298;
        editImportCount++;
        importSuccess298 = true;
        fileName298 = "UNDLM_00298.mov";
        logImportSuccess(298, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00298.mov", fileName298);
    } catch (e) {
        logImportError(298, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00298.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess298 && editFilePoignees298.exists) {
    try {
        var editFootage298 = project.importFile(new ImportOptions(editFilePoignees298));
        editFootage298.parentFolder = fromEditFolder;
        editFootage298.name = "UNDLM_00298_AVEC_POIGNEES";
        editSources[298] = editFootage298;
        editImportCount++;
        importSuccess298 = true;
        fileName298 = "UNDLM_00298_AVEC_POIGNEES.mov";
        logImportSuccess(298, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00298_AVEC_POIGNEES.mov", fileName298);
    } catch (e) {
        logImportError(298, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00298_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess298 && editFileBis298.exists) {
    try {
        var editFootage298 = project.importFile(new ImportOptions(editFileBis298));
        editFootage298.parentFolder = fromEditFolder;
        editFootage298.name = "UNDLM_00298bis";
        editSources[298] = editFootage298;
        editImportCount++;
        importSuccess298 = true;
        fileName298 = "UNDLM_00298bis.mov";
        logImportSuccess(298, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00298bis.mov", fileName298);
    } catch (e) {
        logImportError(298, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00298bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess298) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00298.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00299
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile299 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00299.mov");
var editFilePoignees299 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00299_AVEC_POIGNEES.mov");
var editFileBis299 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00299bis.mov");

var importSuccess299 = false;
var fileName299 = "";

// Tenter import standard
if (editFile299.exists) {
    try {
        var editFootage299 = project.importFile(new ImportOptions(editFile299));
        editFootage299.parentFolder = fromEditFolder;
        editFootage299.name = "UNDLM_00299";
        editSources[299] = editFootage299;
        editImportCount++;
        importSuccess299 = true;
        fileName299 = "UNDLM_00299.mov";
        logImportSuccess(299, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00299.mov", fileName299);
    } catch (e) {
        logImportError(299, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00299.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess299 && editFilePoignees299.exists) {
    try {
        var editFootage299 = project.importFile(new ImportOptions(editFilePoignees299));
        editFootage299.parentFolder = fromEditFolder;
        editFootage299.name = "UNDLM_00299_AVEC_POIGNEES";
        editSources[299] = editFootage299;
        editImportCount++;
        importSuccess299 = true;
        fileName299 = "UNDLM_00299_AVEC_POIGNEES.mov";
        logImportSuccess(299, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00299_AVEC_POIGNEES.mov", fileName299);
    } catch (e) {
        logImportError(299, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00299_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess299 && editFileBis299.exists) {
    try {
        var editFootage299 = project.importFile(new ImportOptions(editFileBis299));
        editFootage299.parentFolder = fromEditFolder;
        editFootage299.name = "UNDLM_00299bis";
        editSources[299] = editFootage299;
        editImportCount++;
        importSuccess299 = true;
        fileName299 = "UNDLM_00299bis.mov";
        logImportSuccess(299, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00299bis.mov", fileName299);
    } catch (e) {
        logImportError(299, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00299bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess299) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00299.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00300
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile300 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00300.mov");
var editFilePoignees300 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00300_AVEC_POIGNEES.mov");
var editFileBis300 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00300bis.mov");

var importSuccess300 = false;
var fileName300 = "";

// Tenter import standard
if (editFile300.exists) {
    try {
        var editFootage300 = project.importFile(new ImportOptions(editFile300));
        editFootage300.parentFolder = fromEditFolder;
        editFootage300.name = "UNDLM_00300";
        editSources[300] = editFootage300;
        editImportCount++;
        importSuccess300 = true;
        fileName300 = "UNDLM_00300.mov";
        logImportSuccess(300, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00300.mov", fileName300);
    } catch (e) {
        logImportError(300, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00300.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess300 && editFilePoignees300.exists) {
    try {
        var editFootage300 = project.importFile(new ImportOptions(editFilePoignees300));
        editFootage300.parentFolder = fromEditFolder;
        editFootage300.name = "UNDLM_00300_AVEC_POIGNEES";
        editSources[300] = editFootage300;
        editImportCount++;
        importSuccess300 = true;
        fileName300 = "UNDLM_00300_AVEC_POIGNEES.mov";
        logImportSuccess(300, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00300_AVEC_POIGNEES.mov", fileName300);
    } catch (e) {
        logImportError(300, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00300_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess300 && editFileBis300.exists) {
    try {
        var editFootage300 = project.importFile(new ImportOptions(editFileBis300));
        editFootage300.parentFolder = fromEditFolder;
        editFootage300.name = "UNDLM_00300bis";
        editSources[300] = editFootage300;
        editImportCount++;
        importSuccess300 = true;
        fileName300 = "UNDLM_00300bis.mov";
        logImportSuccess(300, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00300bis.mov", fileName300);
    } catch (e) {
        logImportError(300, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00300bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess300) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00300.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00301
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile301 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00301.mov");
var editFilePoignees301 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00301_AVEC_POIGNEES.mov");
var editFileBis301 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00301bis.mov");

var importSuccess301 = false;
var fileName301 = "";

// Tenter import standard
if (editFile301.exists) {
    try {
        var editFootage301 = project.importFile(new ImportOptions(editFile301));
        editFootage301.parentFolder = fromEditFolder;
        editFootage301.name = "UNDLM_00301";
        editSources[301] = editFootage301;
        editImportCount++;
        importSuccess301 = true;
        fileName301 = "UNDLM_00301.mov";
        logImportSuccess(301, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00301.mov", fileName301);
    } catch (e) {
        logImportError(301, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00301.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess301 && editFilePoignees301.exists) {
    try {
        var editFootage301 = project.importFile(new ImportOptions(editFilePoignees301));
        editFootage301.parentFolder = fromEditFolder;
        editFootage301.name = "UNDLM_00301_AVEC_POIGNEES";
        editSources[301] = editFootage301;
        editImportCount++;
        importSuccess301 = true;
        fileName301 = "UNDLM_00301_AVEC_POIGNEES.mov";
        logImportSuccess(301, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00301_AVEC_POIGNEES.mov", fileName301);
    } catch (e) {
        logImportError(301, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00301_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess301 && editFileBis301.exists) {
    try {
        var editFootage301 = project.importFile(new ImportOptions(editFileBis301));
        editFootage301.parentFolder = fromEditFolder;
        editFootage301.name = "UNDLM_00301bis";
        editSources[301] = editFootage301;
        editImportCount++;
        importSuccess301 = true;
        fileName301 = "UNDLM_00301bis.mov";
        logImportSuccess(301, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00301bis.mov", fileName301);
    } catch (e) {
        logImportError(301, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00301bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess301) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00301.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00302
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile302 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00302.mov");
var editFilePoignees302 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00302_AVEC_POIGNEES.mov");
var editFileBis302 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00302bis.mov");

var importSuccess302 = false;
var fileName302 = "";

// Tenter import standard
if (editFile302.exists) {
    try {
        var editFootage302 = project.importFile(new ImportOptions(editFile302));
        editFootage302.parentFolder = fromEditFolder;
        editFootage302.name = "UNDLM_00302";
        editSources[302] = editFootage302;
        editImportCount++;
        importSuccess302 = true;
        fileName302 = "UNDLM_00302.mov";
        logImportSuccess(302, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00302.mov", fileName302);
    } catch (e) {
        logImportError(302, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00302.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess302 && editFilePoignees302.exists) {
    try {
        var editFootage302 = project.importFile(new ImportOptions(editFilePoignees302));
        editFootage302.parentFolder = fromEditFolder;
        editFootage302.name = "UNDLM_00302_AVEC_POIGNEES";
        editSources[302] = editFootage302;
        editImportCount++;
        importSuccess302 = true;
        fileName302 = "UNDLM_00302_AVEC_POIGNEES.mov";
        logImportSuccess(302, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00302_AVEC_POIGNEES.mov", fileName302);
    } catch (e) {
        logImportError(302, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00302_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess302 && editFileBis302.exists) {
    try {
        var editFootage302 = project.importFile(new ImportOptions(editFileBis302));
        editFootage302.parentFolder = fromEditFolder;
        editFootage302.name = "UNDLM_00302bis";
        editSources[302] = editFootage302;
        editImportCount++;
        importSuccess302 = true;
        fileName302 = "UNDLM_00302bis.mov";
        logImportSuccess(302, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00302bis.mov", fileName302);
    } catch (e) {
        logImportError(302, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00302bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess302) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00302.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00303
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile303 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00303.mov");
var editFilePoignees303 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00303_AVEC_POIGNEES.mov");
var editFileBis303 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00303bis.mov");

var importSuccess303 = false;
var fileName303 = "";

// Tenter import standard
if (editFile303.exists) {
    try {
        var editFootage303 = project.importFile(new ImportOptions(editFile303));
        editFootage303.parentFolder = fromEditFolder;
        editFootage303.name = "UNDLM_00303";
        editSources[303] = editFootage303;
        editImportCount++;
        importSuccess303 = true;
        fileName303 = "UNDLM_00303.mov";
        logImportSuccess(303, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00303.mov", fileName303);
    } catch (e) {
        logImportError(303, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00303.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess303 && editFilePoignees303.exists) {
    try {
        var editFootage303 = project.importFile(new ImportOptions(editFilePoignees303));
        editFootage303.parentFolder = fromEditFolder;
        editFootage303.name = "UNDLM_00303_AVEC_POIGNEES";
        editSources[303] = editFootage303;
        editImportCount++;
        importSuccess303 = true;
        fileName303 = "UNDLM_00303_AVEC_POIGNEES.mov";
        logImportSuccess(303, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00303_AVEC_POIGNEES.mov", fileName303);
    } catch (e) {
        logImportError(303, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00303_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess303 && editFileBis303.exists) {
    try {
        var editFootage303 = project.importFile(new ImportOptions(editFileBis303));
        editFootage303.parentFolder = fromEditFolder;
        editFootage303.name = "UNDLM_00303bis";
        editSources[303] = editFootage303;
        editImportCount++;
        importSuccess303 = true;
        fileName303 = "UNDLM_00303bis.mov";
        logImportSuccess(303, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00303bis.mov", fileName303);
    } catch (e) {
        logImportError(303, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00303bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess303) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00303.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00287
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile287 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00287.mov");
var gradedFilePoignees287 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00287_AVEC_POIGNEES.mov");
var gradedFileBis287 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00287bis.mov");

var gradedImportSuccess287 = false;
var gradedFileName287 = "";

// Tenter import standard
if (gradedFile287.exists) {
    try {
        var gradedFootage287 = project.importFile(new ImportOptions(gradedFile287));
        gradedFootage287.parentFolder = fromGradingFolder;
        gradedFootage287.name = "UNDLM_00287";
        gradingSources[287] = gradedFootage287;
        gradingImportCount++;
        gradedImportSuccess287 = true;
        gradedFileName287 = "UNDLM_00287.mov";
        logImportSuccess(287, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00287.mov", gradedFileName287);
    } catch (e) {
        logImportError(287, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00287.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess287 && gradedFilePoignees287.exists) {
    try {
        var gradedFootage287 = project.importFile(new ImportOptions(gradedFilePoignees287));
        gradedFootage287.parentFolder = fromGradingFolder;
        gradedFootage287.name = "UNDLM_00287_AVEC_POIGNEES";
        gradingSources[287] = gradedFootage287;
        gradingImportCount++;
        gradedImportSuccess287 = true;
        gradedFileName287 = "UNDLM_00287_AVEC_POIGNEES.mov";
        logImportSuccess(287, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00287_AVEC_POIGNEES.mov", gradedFileName287);
    } catch (e) {
        logImportError(287, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00287_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess287 && gradedFileBis287.exists) {
    try {
        var gradedFootage287 = project.importFile(new ImportOptions(gradedFileBis287));
        gradedFootage287.parentFolder = fromGradingFolder;
        gradedFootage287.name = "UNDLM_00287bis";
        gradingSources[287] = gradedFootage287;
        gradingImportCount++;
        gradedImportSuccess287 = true;
        gradedFileName287 = "UNDLM_00287bis.mov";
        logImportSuccess(287, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00287bis.mov", gradedFileName287);
    } catch (e) {
        logImportError(287, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00287bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess287) {
    missingGradingCount++;
}

// Import plan GRADED 00288
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile288 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00288.mov");
var gradedFilePoignees288 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00288_AVEC_POIGNEES.mov");
var gradedFileBis288 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00288bis.mov");

var gradedImportSuccess288 = false;
var gradedFileName288 = "";

// Tenter import standard
if (gradedFile288.exists) {
    try {
        var gradedFootage288 = project.importFile(new ImportOptions(gradedFile288));
        gradedFootage288.parentFolder = fromGradingFolder;
        gradedFootage288.name = "UNDLM_00288";
        gradingSources[288] = gradedFootage288;
        gradingImportCount++;
        gradedImportSuccess288 = true;
        gradedFileName288 = "UNDLM_00288.mov";
        logImportSuccess(288, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00288.mov", gradedFileName288);
    } catch (e) {
        logImportError(288, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00288.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess288 && gradedFilePoignees288.exists) {
    try {
        var gradedFootage288 = project.importFile(new ImportOptions(gradedFilePoignees288));
        gradedFootage288.parentFolder = fromGradingFolder;
        gradedFootage288.name = "UNDLM_00288_AVEC_POIGNEES";
        gradingSources[288] = gradedFootage288;
        gradingImportCount++;
        gradedImportSuccess288 = true;
        gradedFileName288 = "UNDLM_00288_AVEC_POIGNEES.mov";
        logImportSuccess(288, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00288_AVEC_POIGNEES.mov", gradedFileName288);
    } catch (e) {
        logImportError(288, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00288_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess288 && gradedFileBis288.exists) {
    try {
        var gradedFootage288 = project.importFile(new ImportOptions(gradedFileBis288));
        gradedFootage288.parentFolder = fromGradingFolder;
        gradedFootage288.name = "UNDLM_00288bis";
        gradingSources[288] = gradedFootage288;
        gradingImportCount++;
        gradedImportSuccess288 = true;
        gradedFileName288 = "UNDLM_00288bis.mov";
        logImportSuccess(288, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00288bis.mov", gradedFileName288);
    } catch (e) {
        logImportError(288, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00288bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess288) {
    missingGradingCount++;
}

// Import plan GRADED 00289
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile289 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00289.mov");
var gradedFilePoignees289 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00289_AVEC_POIGNEES.mov");
var gradedFileBis289 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00289bis.mov");

var gradedImportSuccess289 = false;
var gradedFileName289 = "";

// Tenter import standard
if (gradedFile289.exists) {
    try {
        var gradedFootage289 = project.importFile(new ImportOptions(gradedFile289));
        gradedFootage289.parentFolder = fromGradingFolder;
        gradedFootage289.name = "UNDLM_00289";
        gradingSources[289] = gradedFootage289;
        gradingImportCount++;
        gradedImportSuccess289 = true;
        gradedFileName289 = "UNDLM_00289.mov";
        logImportSuccess(289, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00289.mov", gradedFileName289);
    } catch (e) {
        logImportError(289, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00289.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess289 && gradedFilePoignees289.exists) {
    try {
        var gradedFootage289 = project.importFile(new ImportOptions(gradedFilePoignees289));
        gradedFootage289.parentFolder = fromGradingFolder;
        gradedFootage289.name = "UNDLM_00289_AVEC_POIGNEES";
        gradingSources[289] = gradedFootage289;
        gradingImportCount++;
        gradedImportSuccess289 = true;
        gradedFileName289 = "UNDLM_00289_AVEC_POIGNEES.mov";
        logImportSuccess(289, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00289_AVEC_POIGNEES.mov", gradedFileName289);
    } catch (e) {
        logImportError(289, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00289_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess289 && gradedFileBis289.exists) {
    try {
        var gradedFootage289 = project.importFile(new ImportOptions(gradedFileBis289));
        gradedFootage289.parentFolder = fromGradingFolder;
        gradedFootage289.name = "UNDLM_00289bis";
        gradingSources[289] = gradedFootage289;
        gradingImportCount++;
        gradedImportSuccess289 = true;
        gradedFileName289 = "UNDLM_00289bis.mov";
        logImportSuccess(289, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00289bis.mov", gradedFileName289);
    } catch (e) {
        logImportError(289, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00289bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess289) {
    missingGradingCount++;
}

// Import plan GRADED 00290
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile290 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00290.mov");
var gradedFilePoignees290 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00290_AVEC_POIGNEES.mov");
var gradedFileBis290 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00290bis.mov");

var gradedImportSuccess290 = false;
var gradedFileName290 = "";

// Tenter import standard
if (gradedFile290.exists) {
    try {
        var gradedFootage290 = project.importFile(new ImportOptions(gradedFile290));
        gradedFootage290.parentFolder = fromGradingFolder;
        gradedFootage290.name = "UNDLM_00290";
        gradingSources[290] = gradedFootage290;
        gradingImportCount++;
        gradedImportSuccess290 = true;
        gradedFileName290 = "UNDLM_00290.mov";
        logImportSuccess(290, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00290.mov", gradedFileName290);
    } catch (e) {
        logImportError(290, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00290.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess290 && gradedFilePoignees290.exists) {
    try {
        var gradedFootage290 = project.importFile(new ImportOptions(gradedFilePoignees290));
        gradedFootage290.parentFolder = fromGradingFolder;
        gradedFootage290.name = "UNDLM_00290_AVEC_POIGNEES";
        gradingSources[290] = gradedFootage290;
        gradingImportCount++;
        gradedImportSuccess290 = true;
        gradedFileName290 = "UNDLM_00290_AVEC_POIGNEES.mov";
        logImportSuccess(290, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00290_AVEC_POIGNEES.mov", gradedFileName290);
    } catch (e) {
        logImportError(290, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00290_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess290 && gradedFileBis290.exists) {
    try {
        var gradedFootage290 = project.importFile(new ImportOptions(gradedFileBis290));
        gradedFootage290.parentFolder = fromGradingFolder;
        gradedFootage290.name = "UNDLM_00290bis";
        gradingSources[290] = gradedFootage290;
        gradingImportCount++;
        gradedImportSuccess290 = true;
        gradedFileName290 = "UNDLM_00290bis.mov";
        logImportSuccess(290, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00290bis.mov", gradedFileName290);
    } catch (e) {
        logImportError(290, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00290bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess290) {
    missingGradingCount++;
}

// Import plan GRADED 00291
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile291 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00291.mov");
var gradedFilePoignees291 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00291_AVEC_POIGNEES.mov");
var gradedFileBis291 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00291bis.mov");

var gradedImportSuccess291 = false;
var gradedFileName291 = "";

// Tenter import standard
if (gradedFile291.exists) {
    try {
        var gradedFootage291 = project.importFile(new ImportOptions(gradedFile291));
        gradedFootage291.parentFolder = fromGradingFolder;
        gradedFootage291.name = "UNDLM_00291";
        gradingSources[291] = gradedFootage291;
        gradingImportCount++;
        gradedImportSuccess291 = true;
        gradedFileName291 = "UNDLM_00291.mov";
        logImportSuccess(291, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00291.mov", gradedFileName291);
    } catch (e) {
        logImportError(291, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00291.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess291 && gradedFilePoignees291.exists) {
    try {
        var gradedFootage291 = project.importFile(new ImportOptions(gradedFilePoignees291));
        gradedFootage291.parentFolder = fromGradingFolder;
        gradedFootage291.name = "UNDLM_00291_AVEC_POIGNEES";
        gradingSources[291] = gradedFootage291;
        gradingImportCount++;
        gradedImportSuccess291 = true;
        gradedFileName291 = "UNDLM_00291_AVEC_POIGNEES.mov";
        logImportSuccess(291, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00291_AVEC_POIGNEES.mov", gradedFileName291);
    } catch (e) {
        logImportError(291, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00291_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess291 && gradedFileBis291.exists) {
    try {
        var gradedFootage291 = project.importFile(new ImportOptions(gradedFileBis291));
        gradedFootage291.parentFolder = fromGradingFolder;
        gradedFootage291.name = "UNDLM_00291bis";
        gradingSources[291] = gradedFootage291;
        gradingImportCount++;
        gradedImportSuccess291 = true;
        gradedFileName291 = "UNDLM_00291bis.mov";
        logImportSuccess(291, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00291bis.mov", gradedFileName291);
    } catch (e) {
        logImportError(291, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00291bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess291) {
    missingGradingCount++;
}

// Import plan GRADED 00292
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile292 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00292.mov");
var gradedFilePoignees292 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00292_AVEC_POIGNEES.mov");
var gradedFileBis292 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00292bis.mov");

var gradedImportSuccess292 = false;
var gradedFileName292 = "";

// Tenter import standard
if (gradedFile292.exists) {
    try {
        var gradedFootage292 = project.importFile(new ImportOptions(gradedFile292));
        gradedFootage292.parentFolder = fromGradingFolder;
        gradedFootage292.name = "UNDLM_00292";
        gradingSources[292] = gradedFootage292;
        gradingImportCount++;
        gradedImportSuccess292 = true;
        gradedFileName292 = "UNDLM_00292.mov";
        logImportSuccess(292, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00292.mov", gradedFileName292);
    } catch (e) {
        logImportError(292, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00292.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess292 && gradedFilePoignees292.exists) {
    try {
        var gradedFootage292 = project.importFile(new ImportOptions(gradedFilePoignees292));
        gradedFootage292.parentFolder = fromGradingFolder;
        gradedFootage292.name = "UNDLM_00292_AVEC_POIGNEES";
        gradingSources[292] = gradedFootage292;
        gradingImportCount++;
        gradedImportSuccess292 = true;
        gradedFileName292 = "UNDLM_00292_AVEC_POIGNEES.mov";
        logImportSuccess(292, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00292_AVEC_POIGNEES.mov", gradedFileName292);
    } catch (e) {
        logImportError(292, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00292_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess292 && gradedFileBis292.exists) {
    try {
        var gradedFootage292 = project.importFile(new ImportOptions(gradedFileBis292));
        gradedFootage292.parentFolder = fromGradingFolder;
        gradedFootage292.name = "UNDLM_00292bis";
        gradingSources[292] = gradedFootage292;
        gradingImportCount++;
        gradedImportSuccess292 = true;
        gradedFileName292 = "UNDLM_00292bis.mov";
        logImportSuccess(292, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00292bis.mov", gradedFileName292);
    } catch (e) {
        logImportError(292, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00292bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess292) {
    missingGradingCount++;
}

// Import plan GRADED 00293
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile293 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00293.mov");
var gradedFilePoignees293 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00293_AVEC_POIGNEES.mov");
var gradedFileBis293 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00293bis.mov");

var gradedImportSuccess293 = false;
var gradedFileName293 = "";

// Tenter import standard
if (gradedFile293.exists) {
    try {
        var gradedFootage293 = project.importFile(new ImportOptions(gradedFile293));
        gradedFootage293.parentFolder = fromGradingFolder;
        gradedFootage293.name = "UNDLM_00293";
        gradingSources[293] = gradedFootage293;
        gradingImportCount++;
        gradedImportSuccess293 = true;
        gradedFileName293 = "UNDLM_00293.mov";
        logImportSuccess(293, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00293.mov", gradedFileName293);
    } catch (e) {
        logImportError(293, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00293.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess293 && gradedFilePoignees293.exists) {
    try {
        var gradedFootage293 = project.importFile(new ImportOptions(gradedFilePoignees293));
        gradedFootage293.parentFolder = fromGradingFolder;
        gradedFootage293.name = "UNDLM_00293_AVEC_POIGNEES";
        gradingSources[293] = gradedFootage293;
        gradingImportCount++;
        gradedImportSuccess293 = true;
        gradedFileName293 = "UNDLM_00293_AVEC_POIGNEES.mov";
        logImportSuccess(293, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00293_AVEC_POIGNEES.mov", gradedFileName293);
    } catch (e) {
        logImportError(293, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00293_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess293 && gradedFileBis293.exists) {
    try {
        var gradedFootage293 = project.importFile(new ImportOptions(gradedFileBis293));
        gradedFootage293.parentFolder = fromGradingFolder;
        gradedFootage293.name = "UNDLM_00293bis";
        gradingSources[293] = gradedFootage293;
        gradingImportCount++;
        gradedImportSuccess293 = true;
        gradedFileName293 = "UNDLM_00293bis.mov";
        logImportSuccess(293, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00293bis.mov", gradedFileName293);
    } catch (e) {
        logImportError(293, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00293bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess293) {
    missingGradingCount++;
}

// Import plan GRADED 00294
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile294 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00294.mov");
var gradedFilePoignees294 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00294_AVEC_POIGNEES.mov");
var gradedFileBis294 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00294bis.mov");

var gradedImportSuccess294 = false;
var gradedFileName294 = "";

// Tenter import standard
if (gradedFile294.exists) {
    try {
        var gradedFootage294 = project.importFile(new ImportOptions(gradedFile294));
        gradedFootage294.parentFolder = fromGradingFolder;
        gradedFootage294.name = "UNDLM_00294";
        gradingSources[294] = gradedFootage294;
        gradingImportCount++;
        gradedImportSuccess294 = true;
        gradedFileName294 = "UNDLM_00294.mov";
        logImportSuccess(294, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00294.mov", gradedFileName294);
    } catch (e) {
        logImportError(294, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00294.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess294 && gradedFilePoignees294.exists) {
    try {
        var gradedFootage294 = project.importFile(new ImportOptions(gradedFilePoignees294));
        gradedFootage294.parentFolder = fromGradingFolder;
        gradedFootage294.name = "UNDLM_00294_AVEC_POIGNEES";
        gradingSources[294] = gradedFootage294;
        gradingImportCount++;
        gradedImportSuccess294 = true;
        gradedFileName294 = "UNDLM_00294_AVEC_POIGNEES.mov";
        logImportSuccess(294, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00294_AVEC_POIGNEES.mov", gradedFileName294);
    } catch (e) {
        logImportError(294, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00294_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess294 && gradedFileBis294.exists) {
    try {
        var gradedFootage294 = project.importFile(new ImportOptions(gradedFileBis294));
        gradedFootage294.parentFolder = fromGradingFolder;
        gradedFootage294.name = "UNDLM_00294bis";
        gradingSources[294] = gradedFootage294;
        gradingImportCount++;
        gradedImportSuccess294 = true;
        gradedFileName294 = "UNDLM_00294bis.mov";
        logImportSuccess(294, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00294bis.mov", gradedFileName294);
    } catch (e) {
        logImportError(294, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00294bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess294) {
    missingGradingCount++;
}

// Import plan GRADED 00295
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile295 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00295.mov");
var gradedFilePoignees295 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00295_AVEC_POIGNEES.mov");
var gradedFileBis295 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00295bis.mov");

var gradedImportSuccess295 = false;
var gradedFileName295 = "";

// Tenter import standard
if (gradedFile295.exists) {
    try {
        var gradedFootage295 = project.importFile(new ImportOptions(gradedFile295));
        gradedFootage295.parentFolder = fromGradingFolder;
        gradedFootage295.name = "UNDLM_00295";
        gradingSources[295] = gradedFootage295;
        gradingImportCount++;
        gradedImportSuccess295 = true;
        gradedFileName295 = "UNDLM_00295.mov";
        logImportSuccess(295, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00295.mov", gradedFileName295);
    } catch (e) {
        logImportError(295, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00295.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess295 && gradedFilePoignees295.exists) {
    try {
        var gradedFootage295 = project.importFile(new ImportOptions(gradedFilePoignees295));
        gradedFootage295.parentFolder = fromGradingFolder;
        gradedFootage295.name = "UNDLM_00295_AVEC_POIGNEES";
        gradingSources[295] = gradedFootage295;
        gradingImportCount++;
        gradedImportSuccess295 = true;
        gradedFileName295 = "UNDLM_00295_AVEC_POIGNEES.mov";
        logImportSuccess(295, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00295_AVEC_POIGNEES.mov", gradedFileName295);
    } catch (e) {
        logImportError(295, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00295_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess295 && gradedFileBis295.exists) {
    try {
        var gradedFootage295 = project.importFile(new ImportOptions(gradedFileBis295));
        gradedFootage295.parentFolder = fromGradingFolder;
        gradedFootage295.name = "UNDLM_00295bis";
        gradingSources[295] = gradedFootage295;
        gradingImportCount++;
        gradedImportSuccess295 = true;
        gradedFileName295 = "UNDLM_00295bis.mov";
        logImportSuccess(295, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00295bis.mov", gradedFileName295);
    } catch (e) {
        logImportError(295, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00295bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess295) {
    missingGradingCount++;
}

// Import plan GRADED 00296
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile296 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00296.mov");
var gradedFilePoignees296 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00296_AVEC_POIGNEES.mov");
var gradedFileBis296 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00296bis.mov");

var gradedImportSuccess296 = false;
var gradedFileName296 = "";

// Tenter import standard
if (gradedFile296.exists) {
    try {
        var gradedFootage296 = project.importFile(new ImportOptions(gradedFile296));
        gradedFootage296.parentFolder = fromGradingFolder;
        gradedFootage296.name = "UNDLM_00296";
        gradingSources[296] = gradedFootage296;
        gradingImportCount++;
        gradedImportSuccess296 = true;
        gradedFileName296 = "UNDLM_00296.mov";
        logImportSuccess(296, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00296.mov", gradedFileName296);
    } catch (e) {
        logImportError(296, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00296.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess296 && gradedFilePoignees296.exists) {
    try {
        var gradedFootage296 = project.importFile(new ImportOptions(gradedFilePoignees296));
        gradedFootage296.parentFolder = fromGradingFolder;
        gradedFootage296.name = "UNDLM_00296_AVEC_POIGNEES";
        gradingSources[296] = gradedFootage296;
        gradingImportCount++;
        gradedImportSuccess296 = true;
        gradedFileName296 = "UNDLM_00296_AVEC_POIGNEES.mov";
        logImportSuccess(296, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00296_AVEC_POIGNEES.mov", gradedFileName296);
    } catch (e) {
        logImportError(296, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00296_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess296 && gradedFileBis296.exists) {
    try {
        var gradedFootage296 = project.importFile(new ImportOptions(gradedFileBis296));
        gradedFootage296.parentFolder = fromGradingFolder;
        gradedFootage296.name = "UNDLM_00296bis";
        gradingSources[296] = gradedFootage296;
        gradingImportCount++;
        gradedImportSuccess296 = true;
        gradedFileName296 = "UNDLM_00296bis.mov";
        logImportSuccess(296, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00296bis.mov", gradedFileName296);
    } catch (e) {
        logImportError(296, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00296bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess296) {
    missingGradingCount++;
}

// Import plan GRADED 00297
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile297 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00297.mov");
var gradedFilePoignees297 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00297_AVEC_POIGNEES.mov");
var gradedFileBis297 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00297bis.mov");

var gradedImportSuccess297 = false;
var gradedFileName297 = "";

// Tenter import standard
if (gradedFile297.exists) {
    try {
        var gradedFootage297 = project.importFile(new ImportOptions(gradedFile297));
        gradedFootage297.parentFolder = fromGradingFolder;
        gradedFootage297.name = "UNDLM_00297";
        gradingSources[297] = gradedFootage297;
        gradingImportCount++;
        gradedImportSuccess297 = true;
        gradedFileName297 = "UNDLM_00297.mov";
        logImportSuccess(297, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00297.mov", gradedFileName297);
    } catch (e) {
        logImportError(297, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00297.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess297 && gradedFilePoignees297.exists) {
    try {
        var gradedFootage297 = project.importFile(new ImportOptions(gradedFilePoignees297));
        gradedFootage297.parentFolder = fromGradingFolder;
        gradedFootage297.name = "UNDLM_00297_AVEC_POIGNEES";
        gradingSources[297] = gradedFootage297;
        gradingImportCount++;
        gradedImportSuccess297 = true;
        gradedFileName297 = "UNDLM_00297_AVEC_POIGNEES.mov";
        logImportSuccess(297, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00297_AVEC_POIGNEES.mov", gradedFileName297);
    } catch (e) {
        logImportError(297, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00297_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess297 && gradedFileBis297.exists) {
    try {
        var gradedFootage297 = project.importFile(new ImportOptions(gradedFileBis297));
        gradedFootage297.parentFolder = fromGradingFolder;
        gradedFootage297.name = "UNDLM_00297bis";
        gradingSources[297] = gradedFootage297;
        gradingImportCount++;
        gradedImportSuccess297 = true;
        gradedFileName297 = "UNDLM_00297bis.mov";
        logImportSuccess(297, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00297bis.mov", gradedFileName297);
    } catch (e) {
        logImportError(297, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00297bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess297) {
    missingGradingCount++;
}

// Import plan GRADED 00298
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile298 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00298.mov");
var gradedFilePoignees298 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00298_AVEC_POIGNEES.mov");
var gradedFileBis298 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00298bis.mov");

var gradedImportSuccess298 = false;
var gradedFileName298 = "";

// Tenter import standard
if (gradedFile298.exists) {
    try {
        var gradedFootage298 = project.importFile(new ImportOptions(gradedFile298));
        gradedFootage298.parentFolder = fromGradingFolder;
        gradedFootage298.name = "UNDLM_00298";
        gradingSources[298] = gradedFootage298;
        gradingImportCount++;
        gradedImportSuccess298 = true;
        gradedFileName298 = "UNDLM_00298.mov";
        logImportSuccess(298, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00298.mov", gradedFileName298);
    } catch (e) {
        logImportError(298, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00298.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess298 && gradedFilePoignees298.exists) {
    try {
        var gradedFootage298 = project.importFile(new ImportOptions(gradedFilePoignees298));
        gradedFootage298.parentFolder = fromGradingFolder;
        gradedFootage298.name = "UNDLM_00298_AVEC_POIGNEES";
        gradingSources[298] = gradedFootage298;
        gradingImportCount++;
        gradedImportSuccess298 = true;
        gradedFileName298 = "UNDLM_00298_AVEC_POIGNEES.mov";
        logImportSuccess(298, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00298_AVEC_POIGNEES.mov", gradedFileName298);
    } catch (e) {
        logImportError(298, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00298_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess298 && gradedFileBis298.exists) {
    try {
        var gradedFootage298 = project.importFile(new ImportOptions(gradedFileBis298));
        gradedFootage298.parentFolder = fromGradingFolder;
        gradedFootage298.name = "UNDLM_00298bis";
        gradingSources[298] = gradedFootage298;
        gradingImportCount++;
        gradedImportSuccess298 = true;
        gradedFileName298 = "UNDLM_00298bis.mov";
        logImportSuccess(298, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00298bis.mov", gradedFileName298);
    } catch (e) {
        logImportError(298, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00298bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess298) {
    missingGradingCount++;
}

// Import plan GRADED 00299
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile299 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00299.mov");
var gradedFilePoignees299 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00299_AVEC_POIGNEES.mov");
var gradedFileBis299 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00299bis.mov");

var gradedImportSuccess299 = false;
var gradedFileName299 = "";

// Tenter import standard
if (gradedFile299.exists) {
    try {
        var gradedFootage299 = project.importFile(new ImportOptions(gradedFile299));
        gradedFootage299.parentFolder = fromGradingFolder;
        gradedFootage299.name = "UNDLM_00299";
        gradingSources[299] = gradedFootage299;
        gradingImportCount++;
        gradedImportSuccess299 = true;
        gradedFileName299 = "UNDLM_00299.mov";
        logImportSuccess(299, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00299.mov", gradedFileName299);
    } catch (e) {
        logImportError(299, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00299.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess299 && gradedFilePoignees299.exists) {
    try {
        var gradedFootage299 = project.importFile(new ImportOptions(gradedFilePoignees299));
        gradedFootage299.parentFolder = fromGradingFolder;
        gradedFootage299.name = "UNDLM_00299_AVEC_POIGNEES";
        gradingSources[299] = gradedFootage299;
        gradingImportCount++;
        gradedImportSuccess299 = true;
        gradedFileName299 = "UNDLM_00299_AVEC_POIGNEES.mov";
        logImportSuccess(299, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00299_AVEC_POIGNEES.mov", gradedFileName299);
    } catch (e) {
        logImportError(299, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00299_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess299 && gradedFileBis299.exists) {
    try {
        var gradedFootage299 = project.importFile(new ImportOptions(gradedFileBis299));
        gradedFootage299.parentFolder = fromGradingFolder;
        gradedFootage299.name = "UNDLM_00299bis";
        gradingSources[299] = gradedFootage299;
        gradingImportCount++;
        gradedImportSuccess299 = true;
        gradedFileName299 = "UNDLM_00299bis.mov";
        logImportSuccess(299, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00299bis.mov", gradedFileName299);
    } catch (e) {
        logImportError(299, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00299bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess299) {
    missingGradingCount++;
}

// Import plan GRADED 00300
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile300 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00300.mov");
var gradedFilePoignees300 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00300_AVEC_POIGNEES.mov");
var gradedFileBis300 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00300bis.mov");

var gradedImportSuccess300 = false;
var gradedFileName300 = "";

// Tenter import standard
if (gradedFile300.exists) {
    try {
        var gradedFootage300 = project.importFile(new ImportOptions(gradedFile300));
        gradedFootage300.parentFolder = fromGradingFolder;
        gradedFootage300.name = "UNDLM_00300";
        gradingSources[300] = gradedFootage300;
        gradingImportCount++;
        gradedImportSuccess300 = true;
        gradedFileName300 = "UNDLM_00300.mov";
        logImportSuccess(300, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00300.mov", gradedFileName300);
    } catch (e) {
        logImportError(300, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00300.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess300 && gradedFilePoignees300.exists) {
    try {
        var gradedFootage300 = project.importFile(new ImportOptions(gradedFilePoignees300));
        gradedFootage300.parentFolder = fromGradingFolder;
        gradedFootage300.name = "UNDLM_00300_AVEC_POIGNEES";
        gradingSources[300] = gradedFootage300;
        gradingImportCount++;
        gradedImportSuccess300 = true;
        gradedFileName300 = "UNDLM_00300_AVEC_POIGNEES.mov";
        logImportSuccess(300, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00300_AVEC_POIGNEES.mov", gradedFileName300);
    } catch (e) {
        logImportError(300, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00300_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess300 && gradedFileBis300.exists) {
    try {
        var gradedFootage300 = project.importFile(new ImportOptions(gradedFileBis300));
        gradedFootage300.parentFolder = fromGradingFolder;
        gradedFootage300.name = "UNDLM_00300bis";
        gradingSources[300] = gradedFootage300;
        gradingImportCount++;
        gradedImportSuccess300 = true;
        gradedFileName300 = "UNDLM_00300bis.mov";
        logImportSuccess(300, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00300bis.mov", gradedFileName300);
    } catch (e) {
        logImportError(300, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00300bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess300) {
    missingGradingCount++;
}

// Import plan GRADED 00301
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile301 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00301.mov");
var gradedFilePoignees301 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00301_AVEC_POIGNEES.mov");
var gradedFileBis301 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00301bis.mov");

var gradedImportSuccess301 = false;
var gradedFileName301 = "";

// Tenter import standard
if (gradedFile301.exists) {
    try {
        var gradedFootage301 = project.importFile(new ImportOptions(gradedFile301));
        gradedFootage301.parentFolder = fromGradingFolder;
        gradedFootage301.name = "UNDLM_00301";
        gradingSources[301] = gradedFootage301;
        gradingImportCount++;
        gradedImportSuccess301 = true;
        gradedFileName301 = "UNDLM_00301.mov";
        logImportSuccess(301, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00301.mov", gradedFileName301);
    } catch (e) {
        logImportError(301, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00301.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess301 && gradedFilePoignees301.exists) {
    try {
        var gradedFootage301 = project.importFile(new ImportOptions(gradedFilePoignees301));
        gradedFootage301.parentFolder = fromGradingFolder;
        gradedFootage301.name = "UNDLM_00301_AVEC_POIGNEES";
        gradingSources[301] = gradedFootage301;
        gradingImportCount++;
        gradedImportSuccess301 = true;
        gradedFileName301 = "UNDLM_00301_AVEC_POIGNEES.mov";
        logImportSuccess(301, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00301_AVEC_POIGNEES.mov", gradedFileName301);
    } catch (e) {
        logImportError(301, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00301_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess301 && gradedFileBis301.exists) {
    try {
        var gradedFootage301 = project.importFile(new ImportOptions(gradedFileBis301));
        gradedFootage301.parentFolder = fromGradingFolder;
        gradedFootage301.name = "UNDLM_00301bis";
        gradingSources[301] = gradedFootage301;
        gradingImportCount++;
        gradedImportSuccess301 = true;
        gradedFileName301 = "UNDLM_00301bis.mov";
        logImportSuccess(301, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00301bis.mov", gradedFileName301);
    } catch (e) {
        logImportError(301, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00301bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess301) {
    missingGradingCount++;
}

// Import plan GRADED 00302
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile302 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00302.mov");
var gradedFilePoignees302 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00302_AVEC_POIGNEES.mov");
var gradedFileBis302 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00302bis.mov");

var gradedImportSuccess302 = false;
var gradedFileName302 = "";

// Tenter import standard
if (gradedFile302.exists) {
    try {
        var gradedFootage302 = project.importFile(new ImportOptions(gradedFile302));
        gradedFootage302.parentFolder = fromGradingFolder;
        gradedFootage302.name = "UNDLM_00302";
        gradingSources[302] = gradedFootage302;
        gradingImportCount++;
        gradedImportSuccess302 = true;
        gradedFileName302 = "UNDLM_00302.mov";
        logImportSuccess(302, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00302.mov", gradedFileName302);
    } catch (e) {
        logImportError(302, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00302.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess302 && gradedFilePoignees302.exists) {
    try {
        var gradedFootage302 = project.importFile(new ImportOptions(gradedFilePoignees302));
        gradedFootage302.parentFolder = fromGradingFolder;
        gradedFootage302.name = "UNDLM_00302_AVEC_POIGNEES";
        gradingSources[302] = gradedFootage302;
        gradingImportCount++;
        gradedImportSuccess302 = true;
        gradedFileName302 = "UNDLM_00302_AVEC_POIGNEES.mov";
        logImportSuccess(302, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00302_AVEC_POIGNEES.mov", gradedFileName302);
    } catch (e) {
        logImportError(302, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00302_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess302 && gradedFileBis302.exists) {
    try {
        var gradedFootage302 = project.importFile(new ImportOptions(gradedFileBis302));
        gradedFootage302.parentFolder = fromGradingFolder;
        gradedFootage302.name = "UNDLM_00302bis";
        gradingSources[302] = gradedFootage302;
        gradingImportCount++;
        gradedImportSuccess302 = true;
        gradedFileName302 = "UNDLM_00302bis.mov";
        logImportSuccess(302, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00302bis.mov", gradedFileName302);
    } catch (e) {
        logImportError(302, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00302bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess302) {
    missingGradingCount++;
}

// Import plan GRADED 00303
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile303 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00303.mov");
var gradedFilePoignees303 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00303_AVEC_POIGNEES.mov");
var gradedFileBis303 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00303bis.mov");

var gradedImportSuccess303 = false;
var gradedFileName303 = "";

// Tenter import standard
if (gradedFile303.exists) {
    try {
        var gradedFootage303 = project.importFile(new ImportOptions(gradedFile303));
        gradedFootage303.parentFolder = fromGradingFolder;
        gradedFootage303.name = "UNDLM_00303";
        gradingSources[303] = gradedFootage303;
        gradingImportCount++;
        gradedImportSuccess303 = true;
        gradedFileName303 = "UNDLM_00303.mov";
        logImportSuccess(303, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00303.mov", gradedFileName303);
    } catch (e) {
        logImportError(303, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00303.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess303 && gradedFilePoignees303.exists) {
    try {
        var gradedFootage303 = project.importFile(new ImportOptions(gradedFilePoignees303));
        gradedFootage303.parentFolder = fromGradingFolder;
        gradedFootage303.name = "UNDLM_00303_AVEC_POIGNEES";
        gradingSources[303] = gradedFootage303;
        gradingImportCount++;
        gradedImportSuccess303 = true;
        gradedFileName303 = "UNDLM_00303_AVEC_POIGNEES.mov";
        logImportSuccess(303, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00303_AVEC_POIGNEES.mov", gradedFileName303);
    } catch (e) {
        logImportError(303, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00303_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess303 && gradedFileBis303.exists) {
    try {
        var gradedFootage303 = project.importFile(new ImportOptions(gradedFileBis303));
        gradedFootage303.parentFolder = fromGradingFolder;
        gradedFootage303.name = "UNDLM_00303bis";
        gradingSources[303] = gradedFootage303;
        gradingImportCount++;
        gradedImportSuccess303 = true;
        gradedFileName303 = "UNDLM_00303bis.mov";
        logImportSuccess(303, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00303bis.mov", gradedFileName303);
    } catch (e) {
        logImportError(303, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00303bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess303) {
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


// Composition pour plan 00287
var planComp287 = project.items.addComp(
    "SQ16_UNDLM_00287_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp287.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer287 = planComp287.layers.add(bgSolidComp);
bgLayer287.name = "BG_SOLID";
bgLayer287.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer287 = false;
if (gradingSources[287]) {
    var gradedLayer287 = planComp287.layers.add(gradingSources[287]);
    gradedLayer287.name = "UNDLM_00287_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer287.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer287.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer287 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer287 = false;
if (editSources[287]) {
    var editLayer287 = planComp287.layers.add(editSources[287]);
    editLayer287.name = "UNDLM_00287_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer287.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer287.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer287 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity287 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer287) {
    // EDIT toujours activé quand disponible
    editLayer287.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer287) {
        gradedLayer287.enabled = false;
    }
} else if (hasGradedLayer287) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer287.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText287 = planComp287.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText287.name = "WARNING_NO_EDIT";
    warningText287.property("Transform").property("Position").setValue([1280, 200]);
    warningText287.guideLayer = true;
    
    var warningTextDoc287 = warningText287.property("Source Text").value;
    warningTextDoc287.fontSize = 32;
    warningTextDoc287.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc287.font = "Arial-BoldMT";
    warningTextDoc287.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText287.property("Source Text").setValue(warningTextDoc287);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText287 = planComp287.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00287");
    errorText287.name = "ERROR_NO_SOURCE";
    errorText287.property("Transform").property("Position").setValue([1280, 720]);
    errorText287.guideLayer = true;
    
    var errorTextDoc287 = errorText287.property("Source Text").value;
    errorTextDoc287.fontSize = 48;
    errorTextDoc287.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc287.font = "Arial-BoldMT";
    errorTextDoc287.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText287.property("Source Text").setValue(errorTextDoc287);
}

planCompositions[287] = planComp287;


// Composition pour plan 00288
var planComp288 = project.items.addComp(
    "SQ16_UNDLM_00288_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp288.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer288 = planComp288.layers.add(bgSolidComp);
bgLayer288.name = "BG_SOLID";
bgLayer288.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer288 = false;
if (gradingSources[288]) {
    var gradedLayer288 = planComp288.layers.add(gradingSources[288]);
    gradedLayer288.name = "UNDLM_00288_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer288.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer288.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer288 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer288 = false;
if (editSources[288]) {
    var editLayer288 = planComp288.layers.add(editSources[288]);
    editLayer288.name = "UNDLM_00288_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer288.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer288.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer288 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity288 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer288) {
    // EDIT toujours activé quand disponible
    editLayer288.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer288) {
        gradedLayer288.enabled = false;
    }
} else if (hasGradedLayer288) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer288.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText288 = planComp288.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText288.name = "WARNING_NO_EDIT";
    warningText288.property("Transform").property("Position").setValue([1280, 200]);
    warningText288.guideLayer = true;
    
    var warningTextDoc288 = warningText288.property("Source Text").value;
    warningTextDoc288.fontSize = 32;
    warningTextDoc288.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc288.font = "Arial-BoldMT";
    warningTextDoc288.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText288.property("Source Text").setValue(warningTextDoc288);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText288 = planComp288.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00288");
    errorText288.name = "ERROR_NO_SOURCE";
    errorText288.property("Transform").property("Position").setValue([1280, 720]);
    errorText288.guideLayer = true;
    
    var errorTextDoc288 = errorText288.property("Source Text").value;
    errorTextDoc288.fontSize = 48;
    errorTextDoc288.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc288.font = "Arial-BoldMT";
    errorTextDoc288.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText288.property("Source Text").setValue(errorTextDoc288);
}

planCompositions[288] = planComp288;


// Composition pour plan 00289
var planComp289 = project.items.addComp(
    "SQ16_UNDLM_00289_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp289.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer289 = planComp289.layers.add(bgSolidComp);
bgLayer289.name = "BG_SOLID";
bgLayer289.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer289 = false;
if (gradingSources[289]) {
    var gradedLayer289 = planComp289.layers.add(gradingSources[289]);
    gradedLayer289.name = "UNDLM_00289_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer289.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer289.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer289 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer289 = false;
if (editSources[289]) {
    var editLayer289 = planComp289.layers.add(editSources[289]);
    editLayer289.name = "UNDLM_00289_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer289.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer289.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer289 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity289 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer289) {
    // EDIT toujours activé quand disponible
    editLayer289.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer289) {
        gradedLayer289.enabled = false;
    }
} else if (hasGradedLayer289) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer289.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText289 = planComp289.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText289.name = "WARNING_NO_EDIT";
    warningText289.property("Transform").property("Position").setValue([1280, 200]);
    warningText289.guideLayer = true;
    
    var warningTextDoc289 = warningText289.property("Source Text").value;
    warningTextDoc289.fontSize = 32;
    warningTextDoc289.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc289.font = "Arial-BoldMT";
    warningTextDoc289.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText289.property("Source Text").setValue(warningTextDoc289);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText289 = planComp289.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00289");
    errorText289.name = "ERROR_NO_SOURCE";
    errorText289.property("Transform").property("Position").setValue([1280, 720]);
    errorText289.guideLayer = true;
    
    var errorTextDoc289 = errorText289.property("Source Text").value;
    errorTextDoc289.fontSize = 48;
    errorTextDoc289.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc289.font = "Arial-BoldMT";
    errorTextDoc289.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText289.property("Source Text").setValue(errorTextDoc289);
}

planCompositions[289] = planComp289;


// Composition pour plan 00290
var planComp290 = project.items.addComp(
    "SQ16_UNDLM_00290_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp290.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer290 = planComp290.layers.add(bgSolidComp);
bgLayer290.name = "BG_SOLID";
bgLayer290.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer290 = false;
if (gradingSources[290]) {
    var gradedLayer290 = planComp290.layers.add(gradingSources[290]);
    gradedLayer290.name = "UNDLM_00290_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer290.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer290.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer290 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer290 = false;
if (editSources[290]) {
    var editLayer290 = planComp290.layers.add(editSources[290]);
    editLayer290.name = "UNDLM_00290_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer290.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer290.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer290 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity290 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer290) {
    // EDIT toujours activé quand disponible
    editLayer290.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer290) {
        gradedLayer290.enabled = false;
    }
} else if (hasGradedLayer290) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer290.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText290 = planComp290.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText290.name = "WARNING_NO_EDIT";
    warningText290.property("Transform").property("Position").setValue([1280, 200]);
    warningText290.guideLayer = true;
    
    var warningTextDoc290 = warningText290.property("Source Text").value;
    warningTextDoc290.fontSize = 32;
    warningTextDoc290.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc290.font = "Arial-BoldMT";
    warningTextDoc290.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText290.property("Source Text").setValue(warningTextDoc290);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText290 = planComp290.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00290");
    errorText290.name = "ERROR_NO_SOURCE";
    errorText290.property("Transform").property("Position").setValue([1280, 720]);
    errorText290.guideLayer = true;
    
    var errorTextDoc290 = errorText290.property("Source Text").value;
    errorTextDoc290.fontSize = 48;
    errorTextDoc290.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc290.font = "Arial-BoldMT";
    errorTextDoc290.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText290.property("Source Text").setValue(errorTextDoc290);
}

planCompositions[290] = planComp290;


// Composition pour plan 00291
var planComp291 = project.items.addComp(
    "SQ16_UNDLM_00291_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp291.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer291 = planComp291.layers.add(bgSolidComp);
bgLayer291.name = "BG_SOLID";
bgLayer291.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer291 = false;
if (gradingSources[291]) {
    var gradedLayer291 = planComp291.layers.add(gradingSources[291]);
    gradedLayer291.name = "UNDLM_00291_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer291.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer291.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer291 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer291 = false;
if (editSources[291]) {
    var editLayer291 = planComp291.layers.add(editSources[291]);
    editLayer291.name = "UNDLM_00291_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer291.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer291.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer291 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity291 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer291) {
    // EDIT toujours activé quand disponible
    editLayer291.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer291) {
        gradedLayer291.enabled = false;
    }
} else if (hasGradedLayer291) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer291.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText291 = planComp291.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText291.name = "WARNING_NO_EDIT";
    warningText291.property("Transform").property("Position").setValue([1280, 200]);
    warningText291.guideLayer = true;
    
    var warningTextDoc291 = warningText291.property("Source Text").value;
    warningTextDoc291.fontSize = 32;
    warningTextDoc291.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc291.font = "Arial-BoldMT";
    warningTextDoc291.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText291.property("Source Text").setValue(warningTextDoc291);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText291 = planComp291.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00291");
    errorText291.name = "ERROR_NO_SOURCE";
    errorText291.property("Transform").property("Position").setValue([1280, 720]);
    errorText291.guideLayer = true;
    
    var errorTextDoc291 = errorText291.property("Source Text").value;
    errorTextDoc291.fontSize = 48;
    errorTextDoc291.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc291.font = "Arial-BoldMT";
    errorTextDoc291.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText291.property("Source Text").setValue(errorTextDoc291);
}

planCompositions[291] = planComp291;


// Composition pour plan 00292
var planComp292 = project.items.addComp(
    "SQ16_UNDLM_00292_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp292.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer292 = planComp292.layers.add(bgSolidComp);
bgLayer292.name = "BG_SOLID";
bgLayer292.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer292 = false;
if (gradingSources[292]) {
    var gradedLayer292 = planComp292.layers.add(gradingSources[292]);
    gradedLayer292.name = "UNDLM_00292_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer292.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer292.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer292 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer292 = false;
if (editSources[292]) {
    var editLayer292 = planComp292.layers.add(editSources[292]);
    editLayer292.name = "UNDLM_00292_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer292.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer292.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer292 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity292 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer292) {
    // EDIT toujours activé quand disponible
    editLayer292.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer292) {
        gradedLayer292.enabled = false;
    }
} else if (hasGradedLayer292) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer292.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText292 = planComp292.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText292.name = "WARNING_NO_EDIT";
    warningText292.property("Transform").property("Position").setValue([1280, 200]);
    warningText292.guideLayer = true;
    
    var warningTextDoc292 = warningText292.property("Source Text").value;
    warningTextDoc292.fontSize = 32;
    warningTextDoc292.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc292.font = "Arial-BoldMT";
    warningTextDoc292.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText292.property("Source Text").setValue(warningTextDoc292);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText292 = planComp292.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00292");
    errorText292.name = "ERROR_NO_SOURCE";
    errorText292.property("Transform").property("Position").setValue([1280, 720]);
    errorText292.guideLayer = true;
    
    var errorTextDoc292 = errorText292.property("Source Text").value;
    errorTextDoc292.fontSize = 48;
    errorTextDoc292.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc292.font = "Arial-BoldMT";
    errorTextDoc292.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText292.property("Source Text").setValue(errorTextDoc292);
}

planCompositions[292] = planComp292;


// Composition pour plan 00293
var planComp293 = project.items.addComp(
    "SQ16_UNDLM_00293_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp293.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer293 = planComp293.layers.add(bgSolidComp);
bgLayer293.name = "BG_SOLID";
bgLayer293.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer293 = false;
if (gradingSources[293]) {
    var gradedLayer293 = planComp293.layers.add(gradingSources[293]);
    gradedLayer293.name = "UNDLM_00293_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer293.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer293.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer293 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer293 = false;
if (editSources[293]) {
    var editLayer293 = planComp293.layers.add(editSources[293]);
    editLayer293.name = "UNDLM_00293_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer293.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer293.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer293 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity293 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer293) {
    // EDIT toujours activé quand disponible
    editLayer293.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer293) {
        gradedLayer293.enabled = false;
    }
} else if (hasGradedLayer293) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer293.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText293 = planComp293.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText293.name = "WARNING_NO_EDIT";
    warningText293.property("Transform").property("Position").setValue([1280, 200]);
    warningText293.guideLayer = true;
    
    var warningTextDoc293 = warningText293.property("Source Text").value;
    warningTextDoc293.fontSize = 32;
    warningTextDoc293.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc293.font = "Arial-BoldMT";
    warningTextDoc293.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText293.property("Source Text").setValue(warningTextDoc293);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText293 = planComp293.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00293");
    errorText293.name = "ERROR_NO_SOURCE";
    errorText293.property("Transform").property("Position").setValue([1280, 720]);
    errorText293.guideLayer = true;
    
    var errorTextDoc293 = errorText293.property("Source Text").value;
    errorTextDoc293.fontSize = 48;
    errorTextDoc293.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc293.font = "Arial-BoldMT";
    errorTextDoc293.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText293.property("Source Text").setValue(errorTextDoc293);
}

planCompositions[293] = planComp293;


// Composition pour plan 00294
var planComp294 = project.items.addComp(
    "SQ16_UNDLM_00294_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.7199999999999998,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp294.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer294 = planComp294.layers.add(bgSolidComp);
bgLayer294.name = "BG_SOLID";
bgLayer294.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer294 = false;
if (gradingSources[294]) {
    var gradedLayer294 = planComp294.layers.add(gradingSources[294]);
    gradedLayer294.name = "UNDLM_00294_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer294.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer294.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer294 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer294 = false;
if (editSources[294]) {
    var editLayer294 = planComp294.layers.add(editSources[294]);
    editLayer294.name = "UNDLM_00294_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer294.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer294.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer294 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity294 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer294) {
    // EDIT toujours activé quand disponible
    editLayer294.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer294) {
        gradedLayer294.enabled = false;
    }
} else if (hasGradedLayer294) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer294.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText294 = planComp294.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText294.name = "WARNING_NO_EDIT";
    warningText294.property("Transform").property("Position").setValue([1280, 200]);
    warningText294.guideLayer = true;
    
    var warningTextDoc294 = warningText294.property("Source Text").value;
    warningTextDoc294.fontSize = 32;
    warningTextDoc294.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc294.font = "Arial-BoldMT";
    warningTextDoc294.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText294.property("Source Text").setValue(warningTextDoc294);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText294 = planComp294.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00294");
    errorText294.name = "ERROR_NO_SOURCE";
    errorText294.property("Transform").property("Position").setValue([1280, 720]);
    errorText294.guideLayer = true;
    
    var errorTextDoc294 = errorText294.property("Source Text").value;
    errorTextDoc294.fontSize = 48;
    errorTextDoc294.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc294.font = "Arial-BoldMT";
    errorTextDoc294.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText294.property("Source Text").setValue(errorTextDoc294);
}

planCompositions[294] = planComp294;


// Composition pour plan 00295
var planComp295 = project.items.addComp(
    "SQ16_UNDLM_00295_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp295.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer295 = planComp295.layers.add(bgSolidComp);
bgLayer295.name = "BG_SOLID";
bgLayer295.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer295 = false;
if (gradingSources[295]) {
    var gradedLayer295 = planComp295.layers.add(gradingSources[295]);
    gradedLayer295.name = "UNDLM_00295_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer295.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer295.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer295 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer295 = false;
if (editSources[295]) {
    var editLayer295 = planComp295.layers.add(editSources[295]);
    editLayer295.name = "UNDLM_00295_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer295.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer295.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer295 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity295 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer295) {
    // EDIT toujours activé quand disponible
    editLayer295.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer295) {
        gradedLayer295.enabled = false;
    }
} else if (hasGradedLayer295) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer295.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText295 = planComp295.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText295.name = "WARNING_NO_EDIT";
    warningText295.property("Transform").property("Position").setValue([1280, 200]);
    warningText295.guideLayer = true;
    
    var warningTextDoc295 = warningText295.property("Source Text").value;
    warningTextDoc295.fontSize = 32;
    warningTextDoc295.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc295.font = "Arial-BoldMT";
    warningTextDoc295.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText295.property("Source Text").setValue(warningTextDoc295);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText295 = planComp295.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00295");
    errorText295.name = "ERROR_NO_SOURCE";
    errorText295.property("Transform").property("Position").setValue([1280, 720]);
    errorText295.guideLayer = true;
    
    var errorTextDoc295 = errorText295.property("Source Text").value;
    errorTextDoc295.fontSize = 48;
    errorTextDoc295.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc295.font = "Arial-BoldMT";
    errorTextDoc295.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText295.property("Source Text").setValue(errorTextDoc295);
}

planCompositions[295] = planComp295;


// Composition pour plan 00296
var planComp296 = project.items.addComp(
    "SQ16_UNDLM_00296_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.32,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp296.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer296 = planComp296.layers.add(bgSolidComp);
bgLayer296.name = "BG_SOLID";
bgLayer296.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer296 = false;
if (gradingSources[296]) {
    var gradedLayer296 = planComp296.layers.add(gradingSources[296]);
    gradedLayer296.name = "UNDLM_00296_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer296.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer296.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer296 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer296 = false;
if (editSources[296]) {
    var editLayer296 = planComp296.layers.add(editSources[296]);
    editLayer296.name = "UNDLM_00296_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer296.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer296.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer296 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity296 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer296) {
    // EDIT toujours activé quand disponible
    editLayer296.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer296) {
        gradedLayer296.enabled = false;
    }
} else if (hasGradedLayer296) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer296.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText296 = planComp296.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText296.name = "WARNING_NO_EDIT";
    warningText296.property("Transform").property("Position").setValue([1280, 200]);
    warningText296.guideLayer = true;
    
    var warningTextDoc296 = warningText296.property("Source Text").value;
    warningTextDoc296.fontSize = 32;
    warningTextDoc296.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc296.font = "Arial-BoldMT";
    warningTextDoc296.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText296.property("Source Text").setValue(warningTextDoc296);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText296 = planComp296.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00296");
    errorText296.name = "ERROR_NO_SOURCE";
    errorText296.property("Transform").property("Position").setValue([1280, 720]);
    errorText296.guideLayer = true;
    
    var errorTextDoc296 = errorText296.property("Source Text").value;
    errorTextDoc296.fontSize = 48;
    errorTextDoc296.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc296.font = "Arial-BoldMT";
    errorTextDoc296.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText296.property("Source Text").setValue(errorTextDoc296);
}

planCompositions[296] = planComp296;


// Composition pour plan 00297
var planComp297 = project.items.addComp(
    "SQ16_UNDLM_00297_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.5600000000000005,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp297.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer297 = planComp297.layers.add(bgSolidComp);
bgLayer297.name = "BG_SOLID";
bgLayer297.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer297 = false;
if (gradingSources[297]) {
    var gradedLayer297 = planComp297.layers.add(gradingSources[297]);
    gradedLayer297.name = "UNDLM_00297_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer297.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer297.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer297 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer297 = false;
if (editSources[297]) {
    var editLayer297 = planComp297.layers.add(editSources[297]);
    editLayer297.name = "UNDLM_00297_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer297.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer297.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer297 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity297 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer297) {
    // EDIT toujours activé quand disponible
    editLayer297.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer297) {
        gradedLayer297.enabled = false;
    }
} else if (hasGradedLayer297) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer297.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText297 = planComp297.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText297.name = "WARNING_NO_EDIT";
    warningText297.property("Transform").property("Position").setValue([1280, 200]);
    warningText297.guideLayer = true;
    
    var warningTextDoc297 = warningText297.property("Source Text").value;
    warningTextDoc297.fontSize = 32;
    warningTextDoc297.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc297.font = "Arial-BoldMT";
    warningTextDoc297.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText297.property("Source Text").setValue(warningTextDoc297);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText297 = planComp297.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00297");
    errorText297.name = "ERROR_NO_SOURCE";
    errorText297.property("Transform").property("Position").setValue([1280, 720]);
    errorText297.guideLayer = true;
    
    var errorTextDoc297 = errorText297.property("Source Text").value;
    errorTextDoc297.fontSize = 48;
    errorTextDoc297.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc297.font = "Arial-BoldMT";
    errorTextDoc297.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText297.property("Source Text").setValue(errorTextDoc297);
}

planCompositions[297] = planComp297;


// Composition pour plan 00298
var planComp298 = project.items.addComp(
    "SQ16_UNDLM_00298_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp298.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer298 = planComp298.layers.add(bgSolidComp);
bgLayer298.name = "BG_SOLID";
bgLayer298.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer298 = false;
if (gradingSources[298]) {
    var gradedLayer298 = planComp298.layers.add(gradingSources[298]);
    gradedLayer298.name = "UNDLM_00298_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer298.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer298.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer298 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer298 = false;
if (editSources[298]) {
    var editLayer298 = planComp298.layers.add(editSources[298]);
    editLayer298.name = "UNDLM_00298_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer298.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer298.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer298 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity298 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer298) {
    // EDIT toujours activé quand disponible
    editLayer298.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer298) {
        gradedLayer298.enabled = false;
    }
} else if (hasGradedLayer298) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer298.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText298 = planComp298.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText298.name = "WARNING_NO_EDIT";
    warningText298.property("Transform").property("Position").setValue([1280, 200]);
    warningText298.guideLayer = true;
    
    var warningTextDoc298 = warningText298.property("Source Text").value;
    warningTextDoc298.fontSize = 32;
    warningTextDoc298.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc298.font = "Arial-BoldMT";
    warningTextDoc298.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText298.property("Source Text").setValue(warningTextDoc298);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText298 = planComp298.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00298");
    errorText298.name = "ERROR_NO_SOURCE";
    errorText298.property("Transform").property("Position").setValue([1280, 720]);
    errorText298.guideLayer = true;
    
    var errorTextDoc298 = errorText298.property("Source Text").value;
    errorTextDoc298.fontSize = 48;
    errorTextDoc298.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc298.font = "Arial-BoldMT";
    errorTextDoc298.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText298.property("Source Text").setValue(errorTextDoc298);
}

planCompositions[298] = planComp298;


// Composition pour plan 00299
var planComp299 = project.items.addComp(
    "SQ16_UNDLM_00299_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp299.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer299 = planComp299.layers.add(bgSolidComp);
bgLayer299.name = "BG_SOLID";
bgLayer299.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer299 = false;
if (gradingSources[299]) {
    var gradedLayer299 = planComp299.layers.add(gradingSources[299]);
    gradedLayer299.name = "UNDLM_00299_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer299.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer299.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer299 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer299 = false;
if (editSources[299]) {
    var editLayer299 = planComp299.layers.add(editSources[299]);
    editLayer299.name = "UNDLM_00299_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer299.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer299.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer299 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity299 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer299) {
    // EDIT toujours activé quand disponible
    editLayer299.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer299) {
        gradedLayer299.enabled = false;
    }
} else if (hasGradedLayer299) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer299.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText299 = planComp299.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText299.name = "WARNING_NO_EDIT";
    warningText299.property("Transform").property("Position").setValue([1280, 200]);
    warningText299.guideLayer = true;
    
    var warningTextDoc299 = warningText299.property("Source Text").value;
    warningTextDoc299.fontSize = 32;
    warningTextDoc299.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc299.font = "Arial-BoldMT";
    warningTextDoc299.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText299.property("Source Text").setValue(warningTextDoc299);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText299 = planComp299.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00299");
    errorText299.name = "ERROR_NO_SOURCE";
    errorText299.property("Transform").property("Position").setValue([1280, 720]);
    errorText299.guideLayer = true;
    
    var errorTextDoc299 = errorText299.property("Source Text").value;
    errorTextDoc299.fontSize = 48;
    errorTextDoc299.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc299.font = "Arial-BoldMT";
    errorTextDoc299.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText299.property("Source Text").setValue(errorTextDoc299);
}

planCompositions[299] = planComp299;


// Composition pour plan 00300
var planComp300 = project.items.addComp(
    "SQ16_UNDLM_00300_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp300.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer300 = planComp300.layers.add(bgSolidComp);
bgLayer300.name = "BG_SOLID";
bgLayer300.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer300 = false;
if (gradingSources[300]) {
    var gradedLayer300 = planComp300.layers.add(gradingSources[300]);
    gradedLayer300.name = "UNDLM_00300_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer300.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer300.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer300 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer300 = false;
if (editSources[300]) {
    var editLayer300 = planComp300.layers.add(editSources[300]);
    editLayer300.name = "UNDLM_00300_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer300.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer300.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer300 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity300 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer300) {
    // EDIT toujours activé quand disponible
    editLayer300.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer300) {
        gradedLayer300.enabled = false;
    }
} else if (hasGradedLayer300) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer300.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText300 = planComp300.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText300.name = "WARNING_NO_EDIT";
    warningText300.property("Transform").property("Position").setValue([1280, 200]);
    warningText300.guideLayer = true;
    
    var warningTextDoc300 = warningText300.property("Source Text").value;
    warningTextDoc300.fontSize = 32;
    warningTextDoc300.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc300.font = "Arial-BoldMT";
    warningTextDoc300.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText300.property("Source Text").setValue(warningTextDoc300);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText300 = planComp300.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00300");
    errorText300.name = "ERROR_NO_SOURCE";
    errorText300.property("Transform").property("Position").setValue([1280, 720]);
    errorText300.guideLayer = true;
    
    var errorTextDoc300 = errorText300.property("Source Text").value;
    errorTextDoc300.fontSize = 48;
    errorTextDoc300.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc300.font = "Arial-BoldMT";
    errorTextDoc300.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText300.property("Source Text").setValue(errorTextDoc300);
}

planCompositions[300] = planComp300;


// Composition pour plan 00301
var planComp301 = project.items.addComp(
    "SQ16_UNDLM_00301_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp301.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer301 = planComp301.layers.add(bgSolidComp);
bgLayer301.name = "BG_SOLID";
bgLayer301.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer301 = false;
if (gradingSources[301]) {
    var gradedLayer301 = planComp301.layers.add(gradingSources[301]);
    gradedLayer301.name = "UNDLM_00301_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer301.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer301.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer301 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer301 = false;
if (editSources[301]) {
    var editLayer301 = planComp301.layers.add(editSources[301]);
    editLayer301.name = "UNDLM_00301_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer301.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer301.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer301 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity301 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer301) {
    // EDIT toujours activé quand disponible
    editLayer301.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer301) {
        gradedLayer301.enabled = false;
    }
} else if (hasGradedLayer301) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer301.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText301 = planComp301.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText301.name = "WARNING_NO_EDIT";
    warningText301.property("Transform").property("Position").setValue([1280, 200]);
    warningText301.guideLayer = true;
    
    var warningTextDoc301 = warningText301.property("Source Text").value;
    warningTextDoc301.fontSize = 32;
    warningTextDoc301.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc301.font = "Arial-BoldMT";
    warningTextDoc301.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText301.property("Source Text").setValue(warningTextDoc301);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText301 = planComp301.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00301");
    errorText301.name = "ERROR_NO_SOURCE";
    errorText301.property("Transform").property("Position").setValue([1280, 720]);
    errorText301.guideLayer = true;
    
    var errorTextDoc301 = errorText301.property("Source Text").value;
    errorTextDoc301.fontSize = 48;
    errorTextDoc301.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc301.font = "Arial-BoldMT";
    errorTextDoc301.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText301.property("Source Text").setValue(errorTextDoc301);
}

planCompositions[301] = planComp301;


// Composition pour plan 00302
var planComp302 = project.items.addComp(
    "SQ16_UNDLM_00302_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp302.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer302 = planComp302.layers.add(bgSolidComp);
bgLayer302.name = "BG_SOLID";
bgLayer302.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer302 = false;
if (gradingSources[302]) {
    var gradedLayer302 = planComp302.layers.add(gradingSources[302]);
    gradedLayer302.name = "UNDLM_00302_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer302.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer302.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer302 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer302 = false;
if (editSources[302]) {
    var editLayer302 = planComp302.layers.add(editSources[302]);
    editLayer302.name = "UNDLM_00302_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer302.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer302.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer302 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity302 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer302) {
    // EDIT toujours activé quand disponible
    editLayer302.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer302) {
        gradedLayer302.enabled = false;
    }
} else if (hasGradedLayer302) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer302.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText302 = planComp302.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText302.name = "WARNING_NO_EDIT";
    warningText302.property("Transform").property("Position").setValue([1280, 200]);
    warningText302.guideLayer = true;
    
    var warningTextDoc302 = warningText302.property("Source Text").value;
    warningTextDoc302.fontSize = 32;
    warningTextDoc302.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc302.font = "Arial-BoldMT";
    warningTextDoc302.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText302.property("Source Text").setValue(warningTextDoc302);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText302 = planComp302.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00302");
    errorText302.name = "ERROR_NO_SOURCE";
    errorText302.property("Transform").property("Position").setValue([1280, 720]);
    errorText302.guideLayer = true;
    
    var errorTextDoc302 = errorText302.property("Source Text").value;
    errorTextDoc302.fontSize = 48;
    errorTextDoc302.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc302.font = "Arial-BoldMT";
    errorTextDoc302.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText302.property("Source Text").setValue(errorTextDoc302);
}

planCompositions[302] = planComp302;


// Composition pour plan 00303
var planComp303 = project.items.addComp(
    "SQ16_UNDLM_00303_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp303.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer303 = planComp303.layers.add(bgSolidComp);
bgLayer303.name = "BG_SOLID";
bgLayer303.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer303 = false;
if (gradingSources[303]) {
    var gradedLayer303 = planComp303.layers.add(gradingSources[303]);
    gradedLayer303.name = "UNDLM_00303_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer303.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer303.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer303 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer303 = false;
if (editSources[303]) {
    var editLayer303 = planComp303.layers.add(editSources[303]);
    editLayer303.name = "UNDLM_00303_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer303.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer303.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer303 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity303 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer303) {
    // EDIT toujours activé quand disponible
    editLayer303.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer303) {
        gradedLayer303.enabled = false;
    }
} else if (hasGradedLayer303) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer303.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText303 = planComp303.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText303.name = "WARNING_NO_EDIT";
    warningText303.property("Transform").property("Position").setValue([1280, 200]);
    warningText303.guideLayer = true;
    
    var warningTextDoc303 = warningText303.property("Source Text").value;
    warningTextDoc303.fontSize = 32;
    warningTextDoc303.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc303.font = "Arial-BoldMT";
    warningTextDoc303.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText303.property("Source Text").setValue(warningTextDoc303);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText303 = planComp303.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00303");
    errorText303.name = "ERROR_NO_SOURCE";
    errorText303.property("Transform").property("Position").setValue([1280, 720]);
    errorText303.guideLayer = true;
    
    var errorTextDoc303 = errorText303.property("Source Text").value;
    errorTextDoc303.fontSize = 48;
    errorTextDoc303.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc303.font = "Arial-BoldMT";
    errorTextDoc303.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText303.property("Source Text").setValue(errorTextDoc303);
}

planCompositions[303] = planComp303;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ16_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    102.72, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00287 à la timeline master
if (planCompositions[287]) {
    var masterLayer287 = masterComp.layers.add(planCompositions[287]);
    masterLayer287.startTime = 0;
    masterLayer287.name = "UNDLM_00287";
    masterLayer287.label = 1; // Couleurs alternées
}

// Ajouter plan 00288 à la timeline master
if (planCompositions[288]) {
    var masterLayer288 = masterComp.layers.add(planCompositions[288]);
    masterLayer288.startTime = 4.72;
    masterLayer288.name = "UNDLM_00288";
    masterLayer288.label = 2; // Couleurs alternées
}

// Ajouter plan 00289 à la timeline master
if (planCompositions[289]) {
    var masterLayer289 = masterComp.layers.add(planCompositions[289]);
    masterLayer289.startTime = 14.68;
    masterLayer289.name = "UNDLM_00289";
    masterLayer289.label = 3; // Couleurs alternées
}

// Ajouter plan 00290 à la timeline master
if (planCompositions[290]) {
    var masterLayer290 = masterComp.layers.add(planCompositions[290]);
    masterLayer290.startTime = 18.52;
    masterLayer290.name = "UNDLM_00290";
    masterLayer290.label = 4; // Couleurs alternées
}

// Ajouter plan 00291 à la timeline master
if (planCompositions[291]) {
    var masterLayer291 = masterComp.layers.add(planCompositions[291]);
    masterLayer291.startTime = 22.04;
    masterLayer291.name = "UNDLM_00291";
    masterLayer291.label = 5; // Couleurs alternées
}

// Ajouter plan 00292 à la timeline master
if (planCompositions[292]) {
    var masterLayer292 = masterComp.layers.add(planCompositions[292]);
    masterLayer292.startTime = 26.439999999999998;
    masterLayer292.name = "UNDLM_00292";
    masterLayer292.label = 6; // Couleurs alternées
}

// Ajouter plan 00293 à la timeline master
if (planCompositions[293]) {
    var masterLayer293 = masterComp.layers.add(planCompositions[293]);
    masterLayer293.startTime = 29.959999999999997;
    masterLayer293.name = "UNDLM_00293";
    masterLayer293.label = 7; // Couleurs alternées
}

// Ajouter plan 00294 à la timeline master
if (planCompositions[294]) {
    var masterLayer294 = masterComp.layers.add(planCompositions[294]);
    masterLayer294.startTime = 36.559999999999995;
    masterLayer294.name = "UNDLM_00294";
    masterLayer294.label = 8; // Couleurs alternées
}

// Ajouter plan 00295 à la timeline master
if (planCompositions[295]) {
    var masterLayer295 = masterComp.layers.add(planCompositions[295]);
    masterLayer295.startTime = 40.279999999999994;
    masterLayer295.name = "UNDLM_00295";
    masterLayer295.label = 9; // Couleurs alternées
}

// Ajouter plan 00296 à la timeline master
if (planCompositions[296]) {
    var masterLayer296 = masterComp.layers.add(planCompositions[296]);
    masterLayer296.startTime = 46.07999999999999;
    masterLayer296.name = "UNDLM_00296";
    masterLayer296.label = 10; // Couleurs alternées
}

// Ajouter plan 00297 à la timeline master
if (planCompositions[297]) {
    var masterLayer297 = masterComp.layers.add(planCompositions[297]);
    masterLayer297.startTime = 54.39999999999999;
    masterLayer297.name = "UNDLM_00297";
    masterLayer297.label = 11; // Couleurs alternées
}

// Ajouter plan 00298 à la timeline master
if (planCompositions[298]) {
    var masterLayer298 = masterComp.layers.add(planCompositions[298]);
    masterLayer298.startTime = 61.959999999999994;
    masterLayer298.name = "UNDLM_00298";
    masterLayer298.label = 12; // Couleurs alternées
}

// Ajouter plan 00299 à la timeline master
if (planCompositions[299]) {
    var masterLayer299 = masterComp.layers.add(planCompositions[299]);
    masterLayer299.startTime = 72.75999999999999;
    masterLayer299.name = "UNDLM_00299";
    masterLayer299.label = 13; // Couleurs alternées
}

// Ajouter plan 00300 à la timeline master
if (planCompositions[300]) {
    var masterLayer300 = masterComp.layers.add(planCompositions[300]);
    masterLayer300.startTime = 82.52;
    masterLayer300.name = "UNDLM_00300";
    masterLayer300.label = 14; // Couleurs alternées
}

// Ajouter plan 00301 à la timeline master
if (planCompositions[301]) {
    var masterLayer301 = masterComp.layers.add(planCompositions[301]);
    masterLayer301.startTime = 89.56;
    masterLayer301.name = "UNDLM_00301";
    masterLayer301.label = 15; // Couleurs alternées
}

// Ajouter plan 00302 à la timeline master
if (planCompositions[302]) {
    var masterLayer302 = masterComp.layers.add(planCompositions[302]);
    masterLayer302.startTime = 94.52;
    masterLayer302.name = "UNDLM_00302";
    masterLayer302.label = 16; // Couleurs alternées
}

// Ajouter plan 00303 à la timeline master
if (planCompositions[303]) {
    var masterLayer303 = masterComp.layers.add(planCompositions[303]);
    masterLayer303.startTime = 99.52;
    masterLayer303.name = "UNDLM_00303";
    masterLayer303.label = 1; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ16";\n' +
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
    {start: 0, end: 4.72, name: "UNDLM_00287"},
    {start: 4.72, end: 14.68, name: "UNDLM_00288"},
    {start: 14.68, end: 18.52, name: "UNDLM_00289"},
    {start: 18.52, end: 22.04, name: "UNDLM_00290"},
    {start: 22.04, end: 26.439999999999998, name: "UNDLM_00291"},
    {start: 26.439999999999998, end: 29.959999999999997, name: "UNDLM_00292"},
    {start: 29.959999999999997, end: 36.559999999999995, name: "UNDLM_00293"},
    {start: 36.559999999999995, end: 40.279999999999994, name: "UNDLM_00294"},
    {start: 40.279999999999994, end: 46.07999999999999, name: "UNDLM_00295"},
    {start: 46.07999999999999, end: 54.39999999999999, name: "UNDLM_00296"},
    {start: 54.39999999999999, end: 61.959999999999994, name: "UNDLM_00297"},
    {start: 61.959999999999994, end: 72.75999999999999, name: "UNDLM_00298"},
    {start: 72.75999999999999, end: 82.52, name: "UNDLM_00299"},
    {start: 82.52, end: 89.56, name: "UNDLM_00300"},
    {start: 89.56, end: 94.52, name: "UNDLM_00301"},
    {start: 94.52, end: 99.52, name: "UNDLM_00302"},
    {start: 99.52, end: 102.72, name: "UNDLM_00303"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ16/_AE/SQ16_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 17;
var totalCount = 17;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ16 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(102.72 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ16_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ16:" + totalCount + ":" + gradedCount);
