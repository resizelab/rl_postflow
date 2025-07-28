
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ04 avec 24 plans
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


// Import plan EDIT 00094
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile94 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00094.mov");
var editFilePoignees94 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00094_AVEC_POIGNEES.mov");
var editFileBis94 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00094bis.mov");

var importSuccess94 = false;
var fileName94 = "";

// Tenter import standard
if (editFile94.exists) {
    try {
        var editFootage94 = project.importFile(new ImportOptions(editFile94));
        editFootage94.parentFolder = fromEditFolder;
        editFootage94.name = "UNDLM_00094";
        editSources[94] = editFootage94;
        editImportCount++;
        importSuccess94 = true;
        fileName94 = "UNDLM_00094.mov";
        logImportSuccess(94, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00094.mov", fileName94);
    } catch (e) {
        logImportError(94, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00094.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess94 && editFilePoignees94.exists) {
    try {
        var editFootage94 = project.importFile(new ImportOptions(editFilePoignees94));
        editFootage94.parentFolder = fromEditFolder;
        editFootage94.name = "UNDLM_00094_AVEC_POIGNEES";
        editSources[94] = editFootage94;
        editImportCount++;
        importSuccess94 = true;
        fileName94 = "UNDLM_00094_AVEC_POIGNEES.mov";
        logImportSuccess(94, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00094_AVEC_POIGNEES.mov", fileName94);
    } catch (e) {
        logImportError(94, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00094_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess94 && editFileBis94.exists) {
    try {
        var editFootage94 = project.importFile(new ImportOptions(editFileBis94));
        editFootage94.parentFolder = fromEditFolder;
        editFootage94.name = "UNDLM_00094bis";
        editSources[94] = editFootage94;
        editImportCount++;
        importSuccess94 = true;
        fileName94 = "UNDLM_00094bis.mov";
        logImportSuccess(94, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00094bis.mov", fileName94);
    } catch (e) {
        logImportError(94, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00094bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess94) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00094.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00095
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile95 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00095.mov");
var editFilePoignees95 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00095_AVEC_POIGNEES.mov");
var editFileBis95 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00095bis.mov");

var importSuccess95 = false;
var fileName95 = "";

// Tenter import standard
if (editFile95.exists) {
    try {
        var editFootage95 = project.importFile(new ImportOptions(editFile95));
        editFootage95.parentFolder = fromEditFolder;
        editFootage95.name = "UNDLM_00095";
        editSources[95] = editFootage95;
        editImportCount++;
        importSuccess95 = true;
        fileName95 = "UNDLM_00095.mov";
        logImportSuccess(95, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00095.mov", fileName95);
    } catch (e) {
        logImportError(95, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00095.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess95 && editFilePoignees95.exists) {
    try {
        var editFootage95 = project.importFile(new ImportOptions(editFilePoignees95));
        editFootage95.parentFolder = fromEditFolder;
        editFootage95.name = "UNDLM_00095_AVEC_POIGNEES";
        editSources[95] = editFootage95;
        editImportCount++;
        importSuccess95 = true;
        fileName95 = "UNDLM_00095_AVEC_POIGNEES.mov";
        logImportSuccess(95, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00095_AVEC_POIGNEES.mov", fileName95);
    } catch (e) {
        logImportError(95, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00095_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess95 && editFileBis95.exists) {
    try {
        var editFootage95 = project.importFile(new ImportOptions(editFileBis95));
        editFootage95.parentFolder = fromEditFolder;
        editFootage95.name = "UNDLM_00095bis";
        editSources[95] = editFootage95;
        editImportCount++;
        importSuccess95 = true;
        fileName95 = "UNDLM_00095bis.mov";
        logImportSuccess(95, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00095bis.mov", fileName95);
    } catch (e) {
        logImportError(95, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00095bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess95) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00095.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00096
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile96 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00096.mov");
var editFilePoignees96 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00096_AVEC_POIGNEES.mov");
var editFileBis96 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00096bis.mov");

var importSuccess96 = false;
var fileName96 = "";

// Tenter import standard
if (editFile96.exists) {
    try {
        var editFootage96 = project.importFile(new ImportOptions(editFile96));
        editFootage96.parentFolder = fromEditFolder;
        editFootage96.name = "UNDLM_00096";
        editSources[96] = editFootage96;
        editImportCount++;
        importSuccess96 = true;
        fileName96 = "UNDLM_00096.mov";
        logImportSuccess(96, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00096.mov", fileName96);
    } catch (e) {
        logImportError(96, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00096.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess96 && editFilePoignees96.exists) {
    try {
        var editFootage96 = project.importFile(new ImportOptions(editFilePoignees96));
        editFootage96.parentFolder = fromEditFolder;
        editFootage96.name = "UNDLM_00096_AVEC_POIGNEES";
        editSources[96] = editFootage96;
        editImportCount++;
        importSuccess96 = true;
        fileName96 = "UNDLM_00096_AVEC_POIGNEES.mov";
        logImportSuccess(96, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00096_AVEC_POIGNEES.mov", fileName96);
    } catch (e) {
        logImportError(96, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00096_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess96 && editFileBis96.exists) {
    try {
        var editFootage96 = project.importFile(new ImportOptions(editFileBis96));
        editFootage96.parentFolder = fromEditFolder;
        editFootage96.name = "UNDLM_00096bis";
        editSources[96] = editFootage96;
        editImportCount++;
        importSuccess96 = true;
        fileName96 = "UNDLM_00096bis.mov";
        logImportSuccess(96, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00096bis.mov", fileName96);
    } catch (e) {
        logImportError(96, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00096bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess96) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00096.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00097
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile97 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00097.mov");
var editFilePoignees97 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00097_AVEC_POIGNEES.mov");
var editFileBis97 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00097bis.mov");

var importSuccess97 = false;
var fileName97 = "";

// Tenter import standard
if (editFile97.exists) {
    try {
        var editFootage97 = project.importFile(new ImportOptions(editFile97));
        editFootage97.parentFolder = fromEditFolder;
        editFootage97.name = "UNDLM_00097";
        editSources[97] = editFootage97;
        editImportCount++;
        importSuccess97 = true;
        fileName97 = "UNDLM_00097.mov";
        logImportSuccess(97, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00097.mov", fileName97);
    } catch (e) {
        logImportError(97, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00097.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess97 && editFilePoignees97.exists) {
    try {
        var editFootage97 = project.importFile(new ImportOptions(editFilePoignees97));
        editFootage97.parentFolder = fromEditFolder;
        editFootage97.name = "UNDLM_00097_AVEC_POIGNEES";
        editSources[97] = editFootage97;
        editImportCount++;
        importSuccess97 = true;
        fileName97 = "UNDLM_00097_AVEC_POIGNEES.mov";
        logImportSuccess(97, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00097_AVEC_POIGNEES.mov", fileName97);
    } catch (e) {
        logImportError(97, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00097_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess97 && editFileBis97.exists) {
    try {
        var editFootage97 = project.importFile(new ImportOptions(editFileBis97));
        editFootage97.parentFolder = fromEditFolder;
        editFootage97.name = "UNDLM_00097bis";
        editSources[97] = editFootage97;
        editImportCount++;
        importSuccess97 = true;
        fileName97 = "UNDLM_00097bis.mov";
        logImportSuccess(97, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00097bis.mov", fileName97);
    } catch (e) {
        logImportError(97, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00097bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess97) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00097.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00098
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile98 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00098.mov");
var editFilePoignees98 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00098_AVEC_POIGNEES.mov");
var editFileBis98 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00098bis.mov");

var importSuccess98 = false;
var fileName98 = "";

// Tenter import standard
if (editFile98.exists) {
    try {
        var editFootage98 = project.importFile(new ImportOptions(editFile98));
        editFootage98.parentFolder = fromEditFolder;
        editFootage98.name = "UNDLM_00098";
        editSources[98] = editFootage98;
        editImportCount++;
        importSuccess98 = true;
        fileName98 = "UNDLM_00098.mov";
        logImportSuccess(98, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00098.mov", fileName98);
    } catch (e) {
        logImportError(98, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00098.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess98 && editFilePoignees98.exists) {
    try {
        var editFootage98 = project.importFile(new ImportOptions(editFilePoignees98));
        editFootage98.parentFolder = fromEditFolder;
        editFootage98.name = "UNDLM_00098_AVEC_POIGNEES";
        editSources[98] = editFootage98;
        editImportCount++;
        importSuccess98 = true;
        fileName98 = "UNDLM_00098_AVEC_POIGNEES.mov";
        logImportSuccess(98, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00098_AVEC_POIGNEES.mov", fileName98);
    } catch (e) {
        logImportError(98, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00098_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess98 && editFileBis98.exists) {
    try {
        var editFootage98 = project.importFile(new ImportOptions(editFileBis98));
        editFootage98.parentFolder = fromEditFolder;
        editFootage98.name = "UNDLM_00098bis";
        editSources[98] = editFootage98;
        editImportCount++;
        importSuccess98 = true;
        fileName98 = "UNDLM_00098bis.mov";
        logImportSuccess(98, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00098bis.mov", fileName98);
    } catch (e) {
        logImportError(98, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00098bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess98) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00098.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00099
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile99 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00099.mov");
var editFilePoignees99 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00099_AVEC_POIGNEES.mov");
var editFileBis99 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00099bis.mov");

var importSuccess99 = false;
var fileName99 = "";

// Tenter import standard
if (editFile99.exists) {
    try {
        var editFootage99 = project.importFile(new ImportOptions(editFile99));
        editFootage99.parentFolder = fromEditFolder;
        editFootage99.name = "UNDLM_00099";
        editSources[99] = editFootage99;
        editImportCount++;
        importSuccess99 = true;
        fileName99 = "UNDLM_00099.mov";
        logImportSuccess(99, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00099.mov", fileName99);
    } catch (e) {
        logImportError(99, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00099.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess99 && editFilePoignees99.exists) {
    try {
        var editFootage99 = project.importFile(new ImportOptions(editFilePoignees99));
        editFootage99.parentFolder = fromEditFolder;
        editFootage99.name = "UNDLM_00099_AVEC_POIGNEES";
        editSources[99] = editFootage99;
        editImportCount++;
        importSuccess99 = true;
        fileName99 = "UNDLM_00099_AVEC_POIGNEES.mov";
        logImportSuccess(99, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00099_AVEC_POIGNEES.mov", fileName99);
    } catch (e) {
        logImportError(99, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00099_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess99 && editFileBis99.exists) {
    try {
        var editFootage99 = project.importFile(new ImportOptions(editFileBis99));
        editFootage99.parentFolder = fromEditFolder;
        editFootage99.name = "UNDLM_00099bis";
        editSources[99] = editFootage99;
        editImportCount++;
        importSuccess99 = true;
        fileName99 = "UNDLM_00099bis.mov";
        logImportSuccess(99, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00099bis.mov", fileName99);
    } catch (e) {
        logImportError(99, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00099bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess99) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00099.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00100
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile100 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00100.mov");
var editFilePoignees100 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00100_AVEC_POIGNEES.mov");
var editFileBis100 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00100bis.mov");

var importSuccess100 = false;
var fileName100 = "";

// Tenter import standard
if (editFile100.exists) {
    try {
        var editFootage100 = project.importFile(new ImportOptions(editFile100));
        editFootage100.parentFolder = fromEditFolder;
        editFootage100.name = "UNDLM_00100";
        editSources[100] = editFootage100;
        editImportCount++;
        importSuccess100 = true;
        fileName100 = "UNDLM_00100.mov";
        logImportSuccess(100, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00100.mov", fileName100);
    } catch (e) {
        logImportError(100, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00100.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess100 && editFilePoignees100.exists) {
    try {
        var editFootage100 = project.importFile(new ImportOptions(editFilePoignees100));
        editFootage100.parentFolder = fromEditFolder;
        editFootage100.name = "UNDLM_00100_AVEC_POIGNEES";
        editSources[100] = editFootage100;
        editImportCount++;
        importSuccess100 = true;
        fileName100 = "UNDLM_00100_AVEC_POIGNEES.mov";
        logImportSuccess(100, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00100_AVEC_POIGNEES.mov", fileName100);
    } catch (e) {
        logImportError(100, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00100_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess100 && editFileBis100.exists) {
    try {
        var editFootage100 = project.importFile(new ImportOptions(editFileBis100));
        editFootage100.parentFolder = fromEditFolder;
        editFootage100.name = "UNDLM_00100bis";
        editSources[100] = editFootage100;
        editImportCount++;
        importSuccess100 = true;
        fileName100 = "UNDLM_00100bis.mov";
        logImportSuccess(100, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00100bis.mov", fileName100);
    } catch (e) {
        logImportError(100, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00100bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess100) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00100.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00101
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile101 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00101.mov");
var editFilePoignees101 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00101_AVEC_POIGNEES.mov");
var editFileBis101 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00101bis.mov");

var importSuccess101 = false;
var fileName101 = "";

// Tenter import standard
if (editFile101.exists) {
    try {
        var editFootage101 = project.importFile(new ImportOptions(editFile101));
        editFootage101.parentFolder = fromEditFolder;
        editFootage101.name = "UNDLM_00101";
        editSources[101] = editFootage101;
        editImportCount++;
        importSuccess101 = true;
        fileName101 = "UNDLM_00101.mov";
        logImportSuccess(101, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00101.mov", fileName101);
    } catch (e) {
        logImportError(101, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00101.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess101 && editFilePoignees101.exists) {
    try {
        var editFootage101 = project.importFile(new ImportOptions(editFilePoignees101));
        editFootage101.parentFolder = fromEditFolder;
        editFootage101.name = "UNDLM_00101_AVEC_POIGNEES";
        editSources[101] = editFootage101;
        editImportCount++;
        importSuccess101 = true;
        fileName101 = "UNDLM_00101_AVEC_POIGNEES.mov";
        logImportSuccess(101, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00101_AVEC_POIGNEES.mov", fileName101);
    } catch (e) {
        logImportError(101, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00101_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess101 && editFileBis101.exists) {
    try {
        var editFootage101 = project.importFile(new ImportOptions(editFileBis101));
        editFootage101.parentFolder = fromEditFolder;
        editFootage101.name = "UNDLM_00101bis";
        editSources[101] = editFootage101;
        editImportCount++;
        importSuccess101 = true;
        fileName101 = "UNDLM_00101bis.mov";
        logImportSuccess(101, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00101bis.mov", fileName101);
    } catch (e) {
        logImportError(101, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00101bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess101) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00101.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00102
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile102 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00102.mov");
var editFilePoignees102 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00102_AVEC_POIGNEES.mov");
var editFileBis102 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00102bis.mov");

var importSuccess102 = false;
var fileName102 = "";

// Tenter import standard
if (editFile102.exists) {
    try {
        var editFootage102 = project.importFile(new ImportOptions(editFile102));
        editFootage102.parentFolder = fromEditFolder;
        editFootage102.name = "UNDLM_00102";
        editSources[102] = editFootage102;
        editImportCount++;
        importSuccess102 = true;
        fileName102 = "UNDLM_00102.mov";
        logImportSuccess(102, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00102.mov", fileName102);
    } catch (e) {
        logImportError(102, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00102.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess102 && editFilePoignees102.exists) {
    try {
        var editFootage102 = project.importFile(new ImportOptions(editFilePoignees102));
        editFootage102.parentFolder = fromEditFolder;
        editFootage102.name = "UNDLM_00102_AVEC_POIGNEES";
        editSources[102] = editFootage102;
        editImportCount++;
        importSuccess102 = true;
        fileName102 = "UNDLM_00102_AVEC_POIGNEES.mov";
        logImportSuccess(102, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00102_AVEC_POIGNEES.mov", fileName102);
    } catch (e) {
        logImportError(102, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00102_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess102 && editFileBis102.exists) {
    try {
        var editFootage102 = project.importFile(new ImportOptions(editFileBis102));
        editFootage102.parentFolder = fromEditFolder;
        editFootage102.name = "UNDLM_00102bis";
        editSources[102] = editFootage102;
        editImportCount++;
        importSuccess102 = true;
        fileName102 = "UNDLM_00102bis.mov";
        logImportSuccess(102, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00102bis.mov", fileName102);
    } catch (e) {
        logImportError(102, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00102bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess102) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00102.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00103
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile103 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00103.mov");
var editFilePoignees103 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00103_AVEC_POIGNEES.mov");
var editFileBis103 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00103bis.mov");

var importSuccess103 = false;
var fileName103 = "";

// Tenter import standard
if (editFile103.exists) {
    try {
        var editFootage103 = project.importFile(new ImportOptions(editFile103));
        editFootage103.parentFolder = fromEditFolder;
        editFootage103.name = "UNDLM_00103";
        editSources[103] = editFootage103;
        editImportCount++;
        importSuccess103 = true;
        fileName103 = "UNDLM_00103.mov";
        logImportSuccess(103, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00103.mov", fileName103);
    } catch (e) {
        logImportError(103, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00103.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess103 && editFilePoignees103.exists) {
    try {
        var editFootage103 = project.importFile(new ImportOptions(editFilePoignees103));
        editFootage103.parentFolder = fromEditFolder;
        editFootage103.name = "UNDLM_00103_AVEC_POIGNEES";
        editSources[103] = editFootage103;
        editImportCount++;
        importSuccess103 = true;
        fileName103 = "UNDLM_00103_AVEC_POIGNEES.mov";
        logImportSuccess(103, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00103_AVEC_POIGNEES.mov", fileName103);
    } catch (e) {
        logImportError(103, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00103_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess103 && editFileBis103.exists) {
    try {
        var editFootage103 = project.importFile(new ImportOptions(editFileBis103));
        editFootage103.parentFolder = fromEditFolder;
        editFootage103.name = "UNDLM_00103bis";
        editSources[103] = editFootage103;
        editImportCount++;
        importSuccess103 = true;
        fileName103 = "UNDLM_00103bis.mov";
        logImportSuccess(103, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00103bis.mov", fileName103);
    } catch (e) {
        logImportError(103, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00103bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess103) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00103.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00104
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile104 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00104.mov");
var editFilePoignees104 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00104_AVEC_POIGNEES.mov");
var editFileBis104 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00104bis.mov");

var importSuccess104 = false;
var fileName104 = "";

// Tenter import standard
if (editFile104.exists) {
    try {
        var editFootage104 = project.importFile(new ImportOptions(editFile104));
        editFootage104.parentFolder = fromEditFolder;
        editFootage104.name = "UNDLM_00104";
        editSources[104] = editFootage104;
        editImportCount++;
        importSuccess104 = true;
        fileName104 = "UNDLM_00104.mov";
        logImportSuccess(104, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00104.mov", fileName104);
    } catch (e) {
        logImportError(104, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00104.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess104 && editFilePoignees104.exists) {
    try {
        var editFootage104 = project.importFile(new ImportOptions(editFilePoignees104));
        editFootage104.parentFolder = fromEditFolder;
        editFootage104.name = "UNDLM_00104_AVEC_POIGNEES";
        editSources[104] = editFootage104;
        editImportCount++;
        importSuccess104 = true;
        fileName104 = "UNDLM_00104_AVEC_POIGNEES.mov";
        logImportSuccess(104, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00104_AVEC_POIGNEES.mov", fileName104);
    } catch (e) {
        logImportError(104, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00104_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess104 && editFileBis104.exists) {
    try {
        var editFootage104 = project.importFile(new ImportOptions(editFileBis104));
        editFootage104.parentFolder = fromEditFolder;
        editFootage104.name = "UNDLM_00104bis";
        editSources[104] = editFootage104;
        editImportCount++;
        importSuccess104 = true;
        fileName104 = "UNDLM_00104bis.mov";
        logImportSuccess(104, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00104bis.mov", fileName104);
    } catch (e) {
        logImportError(104, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00104bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess104) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00104.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00105
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile105 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00105.mov");
var editFilePoignees105 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00105_AVEC_POIGNEES.mov");
var editFileBis105 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00105bis.mov");

var importSuccess105 = false;
var fileName105 = "";

// Tenter import standard
if (editFile105.exists) {
    try {
        var editFootage105 = project.importFile(new ImportOptions(editFile105));
        editFootage105.parentFolder = fromEditFolder;
        editFootage105.name = "UNDLM_00105";
        editSources[105] = editFootage105;
        editImportCount++;
        importSuccess105 = true;
        fileName105 = "UNDLM_00105.mov";
        logImportSuccess(105, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00105.mov", fileName105);
    } catch (e) {
        logImportError(105, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00105.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess105 && editFilePoignees105.exists) {
    try {
        var editFootage105 = project.importFile(new ImportOptions(editFilePoignees105));
        editFootage105.parentFolder = fromEditFolder;
        editFootage105.name = "UNDLM_00105_AVEC_POIGNEES";
        editSources[105] = editFootage105;
        editImportCount++;
        importSuccess105 = true;
        fileName105 = "UNDLM_00105_AVEC_POIGNEES.mov";
        logImportSuccess(105, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00105_AVEC_POIGNEES.mov", fileName105);
    } catch (e) {
        logImportError(105, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00105_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess105 && editFileBis105.exists) {
    try {
        var editFootage105 = project.importFile(new ImportOptions(editFileBis105));
        editFootage105.parentFolder = fromEditFolder;
        editFootage105.name = "UNDLM_00105bis";
        editSources[105] = editFootage105;
        editImportCount++;
        importSuccess105 = true;
        fileName105 = "UNDLM_00105bis.mov";
        logImportSuccess(105, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00105bis.mov", fileName105);
    } catch (e) {
        logImportError(105, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00105bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess105) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00105.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00106
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile106 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00106.mov");
var editFilePoignees106 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00106_AVEC_POIGNEES.mov");
var editFileBis106 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00106bis.mov");

var importSuccess106 = false;
var fileName106 = "";

// Tenter import standard
if (editFile106.exists) {
    try {
        var editFootage106 = project.importFile(new ImportOptions(editFile106));
        editFootage106.parentFolder = fromEditFolder;
        editFootage106.name = "UNDLM_00106";
        editSources[106] = editFootage106;
        editImportCount++;
        importSuccess106 = true;
        fileName106 = "UNDLM_00106.mov";
        logImportSuccess(106, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00106.mov", fileName106);
    } catch (e) {
        logImportError(106, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00106.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess106 && editFilePoignees106.exists) {
    try {
        var editFootage106 = project.importFile(new ImportOptions(editFilePoignees106));
        editFootage106.parentFolder = fromEditFolder;
        editFootage106.name = "UNDLM_00106_AVEC_POIGNEES";
        editSources[106] = editFootage106;
        editImportCount++;
        importSuccess106 = true;
        fileName106 = "UNDLM_00106_AVEC_POIGNEES.mov";
        logImportSuccess(106, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00106_AVEC_POIGNEES.mov", fileName106);
    } catch (e) {
        logImportError(106, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00106_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess106 && editFileBis106.exists) {
    try {
        var editFootage106 = project.importFile(new ImportOptions(editFileBis106));
        editFootage106.parentFolder = fromEditFolder;
        editFootage106.name = "UNDLM_00106bis";
        editSources[106] = editFootage106;
        editImportCount++;
        importSuccess106 = true;
        fileName106 = "UNDLM_00106bis.mov";
        logImportSuccess(106, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00106bis.mov", fileName106);
    } catch (e) {
        logImportError(106, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00106bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess106) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00106.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00107
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile107 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00107.mov");
var editFilePoignees107 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00107_AVEC_POIGNEES.mov");
var editFileBis107 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00107bis.mov");

var importSuccess107 = false;
var fileName107 = "";

// Tenter import standard
if (editFile107.exists) {
    try {
        var editFootage107 = project.importFile(new ImportOptions(editFile107));
        editFootage107.parentFolder = fromEditFolder;
        editFootage107.name = "UNDLM_00107";
        editSources[107] = editFootage107;
        editImportCount++;
        importSuccess107 = true;
        fileName107 = "UNDLM_00107.mov";
        logImportSuccess(107, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00107.mov", fileName107);
    } catch (e) {
        logImportError(107, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00107.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess107 && editFilePoignees107.exists) {
    try {
        var editFootage107 = project.importFile(new ImportOptions(editFilePoignees107));
        editFootage107.parentFolder = fromEditFolder;
        editFootage107.name = "UNDLM_00107_AVEC_POIGNEES";
        editSources[107] = editFootage107;
        editImportCount++;
        importSuccess107 = true;
        fileName107 = "UNDLM_00107_AVEC_POIGNEES.mov";
        logImportSuccess(107, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00107_AVEC_POIGNEES.mov", fileName107);
    } catch (e) {
        logImportError(107, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00107_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess107 && editFileBis107.exists) {
    try {
        var editFootage107 = project.importFile(new ImportOptions(editFileBis107));
        editFootage107.parentFolder = fromEditFolder;
        editFootage107.name = "UNDLM_00107bis";
        editSources[107] = editFootage107;
        editImportCount++;
        importSuccess107 = true;
        fileName107 = "UNDLM_00107bis.mov";
        logImportSuccess(107, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00107bis.mov", fileName107);
    } catch (e) {
        logImportError(107, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00107bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess107) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00107.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00108
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile108 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00108.mov");
var editFilePoignees108 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00108_AVEC_POIGNEES.mov");
var editFileBis108 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00108bis.mov");

var importSuccess108 = false;
var fileName108 = "";

// Tenter import standard
if (editFile108.exists) {
    try {
        var editFootage108 = project.importFile(new ImportOptions(editFile108));
        editFootage108.parentFolder = fromEditFolder;
        editFootage108.name = "UNDLM_00108";
        editSources[108] = editFootage108;
        editImportCount++;
        importSuccess108 = true;
        fileName108 = "UNDLM_00108.mov";
        logImportSuccess(108, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00108.mov", fileName108);
    } catch (e) {
        logImportError(108, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00108.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess108 && editFilePoignees108.exists) {
    try {
        var editFootage108 = project.importFile(new ImportOptions(editFilePoignees108));
        editFootage108.parentFolder = fromEditFolder;
        editFootage108.name = "UNDLM_00108_AVEC_POIGNEES";
        editSources[108] = editFootage108;
        editImportCount++;
        importSuccess108 = true;
        fileName108 = "UNDLM_00108_AVEC_POIGNEES.mov";
        logImportSuccess(108, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00108_AVEC_POIGNEES.mov", fileName108);
    } catch (e) {
        logImportError(108, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00108_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess108 && editFileBis108.exists) {
    try {
        var editFootage108 = project.importFile(new ImportOptions(editFileBis108));
        editFootage108.parentFolder = fromEditFolder;
        editFootage108.name = "UNDLM_00108bis";
        editSources[108] = editFootage108;
        editImportCount++;
        importSuccess108 = true;
        fileName108 = "UNDLM_00108bis.mov";
        logImportSuccess(108, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00108bis.mov", fileName108);
    } catch (e) {
        logImportError(108, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00108bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess108) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00108.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00109
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile109 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00109.mov");
var editFilePoignees109 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00109_AVEC_POIGNEES.mov");
var editFileBis109 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00109bis.mov");

var importSuccess109 = false;
var fileName109 = "";

// Tenter import standard
if (editFile109.exists) {
    try {
        var editFootage109 = project.importFile(new ImportOptions(editFile109));
        editFootage109.parentFolder = fromEditFolder;
        editFootage109.name = "UNDLM_00109";
        editSources[109] = editFootage109;
        editImportCount++;
        importSuccess109 = true;
        fileName109 = "UNDLM_00109.mov";
        logImportSuccess(109, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00109.mov", fileName109);
    } catch (e) {
        logImportError(109, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00109.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess109 && editFilePoignees109.exists) {
    try {
        var editFootage109 = project.importFile(new ImportOptions(editFilePoignees109));
        editFootage109.parentFolder = fromEditFolder;
        editFootage109.name = "UNDLM_00109_AVEC_POIGNEES";
        editSources[109] = editFootage109;
        editImportCount++;
        importSuccess109 = true;
        fileName109 = "UNDLM_00109_AVEC_POIGNEES.mov";
        logImportSuccess(109, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00109_AVEC_POIGNEES.mov", fileName109);
    } catch (e) {
        logImportError(109, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00109_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess109 && editFileBis109.exists) {
    try {
        var editFootage109 = project.importFile(new ImportOptions(editFileBis109));
        editFootage109.parentFolder = fromEditFolder;
        editFootage109.name = "UNDLM_00109bis";
        editSources[109] = editFootage109;
        editImportCount++;
        importSuccess109 = true;
        fileName109 = "UNDLM_00109bis.mov";
        logImportSuccess(109, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00109bis.mov", fileName109);
    } catch (e) {
        logImportError(109, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00109bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess109) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00109.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00110
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile110 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00110.mov");
var editFilePoignees110 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00110_AVEC_POIGNEES.mov");
var editFileBis110 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00110bis.mov");

var importSuccess110 = false;
var fileName110 = "";

// Tenter import standard
if (editFile110.exists) {
    try {
        var editFootage110 = project.importFile(new ImportOptions(editFile110));
        editFootage110.parentFolder = fromEditFolder;
        editFootage110.name = "UNDLM_00110";
        editSources[110] = editFootage110;
        editImportCount++;
        importSuccess110 = true;
        fileName110 = "UNDLM_00110.mov";
        logImportSuccess(110, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00110.mov", fileName110);
    } catch (e) {
        logImportError(110, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00110.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess110 && editFilePoignees110.exists) {
    try {
        var editFootage110 = project.importFile(new ImportOptions(editFilePoignees110));
        editFootage110.parentFolder = fromEditFolder;
        editFootage110.name = "UNDLM_00110_AVEC_POIGNEES";
        editSources[110] = editFootage110;
        editImportCount++;
        importSuccess110 = true;
        fileName110 = "UNDLM_00110_AVEC_POIGNEES.mov";
        logImportSuccess(110, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00110_AVEC_POIGNEES.mov", fileName110);
    } catch (e) {
        logImportError(110, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00110_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess110 && editFileBis110.exists) {
    try {
        var editFootage110 = project.importFile(new ImportOptions(editFileBis110));
        editFootage110.parentFolder = fromEditFolder;
        editFootage110.name = "UNDLM_00110bis";
        editSources[110] = editFootage110;
        editImportCount++;
        importSuccess110 = true;
        fileName110 = "UNDLM_00110bis.mov";
        logImportSuccess(110, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00110bis.mov", fileName110);
    } catch (e) {
        logImportError(110, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00110bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess110) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00110.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00111
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile111 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00111.mov");
var editFilePoignees111 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00111_AVEC_POIGNEES.mov");
var editFileBis111 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00111bis.mov");

var importSuccess111 = false;
var fileName111 = "";

// Tenter import standard
if (editFile111.exists) {
    try {
        var editFootage111 = project.importFile(new ImportOptions(editFile111));
        editFootage111.parentFolder = fromEditFolder;
        editFootage111.name = "UNDLM_00111";
        editSources[111] = editFootage111;
        editImportCount++;
        importSuccess111 = true;
        fileName111 = "UNDLM_00111.mov";
        logImportSuccess(111, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00111.mov", fileName111);
    } catch (e) {
        logImportError(111, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00111.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess111 && editFilePoignees111.exists) {
    try {
        var editFootage111 = project.importFile(new ImportOptions(editFilePoignees111));
        editFootage111.parentFolder = fromEditFolder;
        editFootage111.name = "UNDLM_00111_AVEC_POIGNEES";
        editSources[111] = editFootage111;
        editImportCount++;
        importSuccess111 = true;
        fileName111 = "UNDLM_00111_AVEC_POIGNEES.mov";
        logImportSuccess(111, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00111_AVEC_POIGNEES.mov", fileName111);
    } catch (e) {
        logImportError(111, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00111_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess111 && editFileBis111.exists) {
    try {
        var editFootage111 = project.importFile(new ImportOptions(editFileBis111));
        editFootage111.parentFolder = fromEditFolder;
        editFootage111.name = "UNDLM_00111bis";
        editSources[111] = editFootage111;
        editImportCount++;
        importSuccess111 = true;
        fileName111 = "UNDLM_00111bis.mov";
        logImportSuccess(111, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00111bis.mov", fileName111);
    } catch (e) {
        logImportError(111, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00111bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess111) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00111.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00112
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile112 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00112.mov");
var editFilePoignees112 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00112_AVEC_POIGNEES.mov");
var editFileBis112 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00112bis.mov");

var importSuccess112 = false;
var fileName112 = "";

// Tenter import standard
if (editFile112.exists) {
    try {
        var editFootage112 = project.importFile(new ImportOptions(editFile112));
        editFootage112.parentFolder = fromEditFolder;
        editFootage112.name = "UNDLM_00112";
        editSources[112] = editFootage112;
        editImportCount++;
        importSuccess112 = true;
        fileName112 = "UNDLM_00112.mov";
        logImportSuccess(112, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00112.mov", fileName112);
    } catch (e) {
        logImportError(112, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00112.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess112 && editFilePoignees112.exists) {
    try {
        var editFootage112 = project.importFile(new ImportOptions(editFilePoignees112));
        editFootage112.parentFolder = fromEditFolder;
        editFootage112.name = "UNDLM_00112_AVEC_POIGNEES";
        editSources[112] = editFootage112;
        editImportCount++;
        importSuccess112 = true;
        fileName112 = "UNDLM_00112_AVEC_POIGNEES.mov";
        logImportSuccess(112, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00112_AVEC_POIGNEES.mov", fileName112);
    } catch (e) {
        logImportError(112, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00112_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess112 && editFileBis112.exists) {
    try {
        var editFootage112 = project.importFile(new ImportOptions(editFileBis112));
        editFootage112.parentFolder = fromEditFolder;
        editFootage112.name = "UNDLM_00112bis";
        editSources[112] = editFootage112;
        editImportCount++;
        importSuccess112 = true;
        fileName112 = "UNDLM_00112bis.mov";
        logImportSuccess(112, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00112bis.mov", fileName112);
    } catch (e) {
        logImportError(112, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00112bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess112) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00112.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00113
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile113 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00113.mov");
var editFilePoignees113 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00113_AVEC_POIGNEES.mov");
var editFileBis113 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00113bis.mov");

var importSuccess113 = false;
var fileName113 = "";

// Tenter import standard
if (editFile113.exists) {
    try {
        var editFootage113 = project.importFile(new ImportOptions(editFile113));
        editFootage113.parentFolder = fromEditFolder;
        editFootage113.name = "UNDLM_00113";
        editSources[113] = editFootage113;
        editImportCount++;
        importSuccess113 = true;
        fileName113 = "UNDLM_00113.mov";
        logImportSuccess(113, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00113.mov", fileName113);
    } catch (e) {
        logImportError(113, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00113.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess113 && editFilePoignees113.exists) {
    try {
        var editFootage113 = project.importFile(new ImportOptions(editFilePoignees113));
        editFootage113.parentFolder = fromEditFolder;
        editFootage113.name = "UNDLM_00113_AVEC_POIGNEES";
        editSources[113] = editFootage113;
        editImportCount++;
        importSuccess113 = true;
        fileName113 = "UNDLM_00113_AVEC_POIGNEES.mov";
        logImportSuccess(113, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00113_AVEC_POIGNEES.mov", fileName113);
    } catch (e) {
        logImportError(113, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00113_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess113 && editFileBis113.exists) {
    try {
        var editFootage113 = project.importFile(new ImportOptions(editFileBis113));
        editFootage113.parentFolder = fromEditFolder;
        editFootage113.name = "UNDLM_00113bis";
        editSources[113] = editFootage113;
        editImportCount++;
        importSuccess113 = true;
        fileName113 = "UNDLM_00113bis.mov";
        logImportSuccess(113, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00113bis.mov", fileName113);
    } catch (e) {
        logImportError(113, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00113bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess113) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00113.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00114
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile114 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00114.mov");
var editFilePoignees114 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00114_AVEC_POIGNEES.mov");
var editFileBis114 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00114bis.mov");

var importSuccess114 = false;
var fileName114 = "";

// Tenter import standard
if (editFile114.exists) {
    try {
        var editFootage114 = project.importFile(new ImportOptions(editFile114));
        editFootage114.parentFolder = fromEditFolder;
        editFootage114.name = "UNDLM_00114";
        editSources[114] = editFootage114;
        editImportCount++;
        importSuccess114 = true;
        fileName114 = "UNDLM_00114.mov";
        logImportSuccess(114, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00114.mov", fileName114);
    } catch (e) {
        logImportError(114, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00114.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess114 && editFilePoignees114.exists) {
    try {
        var editFootage114 = project.importFile(new ImportOptions(editFilePoignees114));
        editFootage114.parentFolder = fromEditFolder;
        editFootage114.name = "UNDLM_00114_AVEC_POIGNEES";
        editSources[114] = editFootage114;
        editImportCount++;
        importSuccess114 = true;
        fileName114 = "UNDLM_00114_AVEC_POIGNEES.mov";
        logImportSuccess(114, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00114_AVEC_POIGNEES.mov", fileName114);
    } catch (e) {
        logImportError(114, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00114_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess114 && editFileBis114.exists) {
    try {
        var editFootage114 = project.importFile(new ImportOptions(editFileBis114));
        editFootage114.parentFolder = fromEditFolder;
        editFootage114.name = "UNDLM_00114bis";
        editSources[114] = editFootage114;
        editImportCount++;
        importSuccess114 = true;
        fileName114 = "UNDLM_00114bis.mov";
        logImportSuccess(114, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00114bis.mov", fileName114);
    } catch (e) {
        logImportError(114, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00114bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess114) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00114.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00115
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile115 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00115.mov");
var editFilePoignees115 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00115_AVEC_POIGNEES.mov");
var editFileBis115 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00115bis.mov");

var importSuccess115 = false;
var fileName115 = "";

// Tenter import standard
if (editFile115.exists) {
    try {
        var editFootage115 = project.importFile(new ImportOptions(editFile115));
        editFootage115.parentFolder = fromEditFolder;
        editFootage115.name = "UNDLM_00115";
        editSources[115] = editFootage115;
        editImportCount++;
        importSuccess115 = true;
        fileName115 = "UNDLM_00115.mov";
        logImportSuccess(115, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00115.mov", fileName115);
    } catch (e) {
        logImportError(115, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00115.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess115 && editFilePoignees115.exists) {
    try {
        var editFootage115 = project.importFile(new ImportOptions(editFilePoignees115));
        editFootage115.parentFolder = fromEditFolder;
        editFootage115.name = "UNDLM_00115_AVEC_POIGNEES";
        editSources[115] = editFootage115;
        editImportCount++;
        importSuccess115 = true;
        fileName115 = "UNDLM_00115_AVEC_POIGNEES.mov";
        logImportSuccess(115, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00115_AVEC_POIGNEES.mov", fileName115);
    } catch (e) {
        logImportError(115, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00115_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess115 && editFileBis115.exists) {
    try {
        var editFootage115 = project.importFile(new ImportOptions(editFileBis115));
        editFootage115.parentFolder = fromEditFolder;
        editFootage115.name = "UNDLM_00115bis";
        editSources[115] = editFootage115;
        editImportCount++;
        importSuccess115 = true;
        fileName115 = "UNDLM_00115bis.mov";
        logImportSuccess(115, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00115bis.mov", fileName115);
    } catch (e) {
        logImportError(115, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00115bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess115) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00115.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00116
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile116 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00116.mov");
var editFilePoignees116 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00116_AVEC_POIGNEES.mov");
var editFileBis116 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00116bis.mov");

var importSuccess116 = false;
var fileName116 = "";

// Tenter import standard
if (editFile116.exists) {
    try {
        var editFootage116 = project.importFile(new ImportOptions(editFile116));
        editFootage116.parentFolder = fromEditFolder;
        editFootage116.name = "UNDLM_00116";
        editSources[116] = editFootage116;
        editImportCount++;
        importSuccess116 = true;
        fileName116 = "UNDLM_00116.mov";
        logImportSuccess(116, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00116.mov", fileName116);
    } catch (e) {
        logImportError(116, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00116.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess116 && editFilePoignees116.exists) {
    try {
        var editFootage116 = project.importFile(new ImportOptions(editFilePoignees116));
        editFootage116.parentFolder = fromEditFolder;
        editFootage116.name = "UNDLM_00116_AVEC_POIGNEES";
        editSources[116] = editFootage116;
        editImportCount++;
        importSuccess116 = true;
        fileName116 = "UNDLM_00116_AVEC_POIGNEES.mov";
        logImportSuccess(116, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00116_AVEC_POIGNEES.mov", fileName116);
    } catch (e) {
        logImportError(116, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00116_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess116 && editFileBis116.exists) {
    try {
        var editFootage116 = project.importFile(new ImportOptions(editFileBis116));
        editFootage116.parentFolder = fromEditFolder;
        editFootage116.name = "UNDLM_00116bis";
        editSources[116] = editFootage116;
        editImportCount++;
        importSuccess116 = true;
        fileName116 = "UNDLM_00116bis.mov";
        logImportSuccess(116, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00116bis.mov", fileName116);
    } catch (e) {
        logImportError(116, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00116bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess116) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00116.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00117
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile117 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00117.mov");
var editFilePoignees117 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00117_AVEC_POIGNEES.mov");
var editFileBis117 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00117bis.mov");

var importSuccess117 = false;
var fileName117 = "";

// Tenter import standard
if (editFile117.exists) {
    try {
        var editFootage117 = project.importFile(new ImportOptions(editFile117));
        editFootage117.parentFolder = fromEditFolder;
        editFootage117.name = "UNDLM_00117";
        editSources[117] = editFootage117;
        editImportCount++;
        importSuccess117 = true;
        fileName117 = "UNDLM_00117.mov";
        logImportSuccess(117, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00117.mov", fileName117);
    } catch (e) {
        logImportError(117, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00117.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess117 && editFilePoignees117.exists) {
    try {
        var editFootage117 = project.importFile(new ImportOptions(editFilePoignees117));
        editFootage117.parentFolder = fromEditFolder;
        editFootage117.name = "UNDLM_00117_AVEC_POIGNEES";
        editSources[117] = editFootage117;
        editImportCount++;
        importSuccess117 = true;
        fileName117 = "UNDLM_00117_AVEC_POIGNEES.mov";
        logImportSuccess(117, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00117_AVEC_POIGNEES.mov", fileName117);
    } catch (e) {
        logImportError(117, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00117_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess117 && editFileBis117.exists) {
    try {
        var editFootage117 = project.importFile(new ImportOptions(editFileBis117));
        editFootage117.parentFolder = fromEditFolder;
        editFootage117.name = "UNDLM_00117bis";
        editSources[117] = editFootage117;
        editImportCount++;
        importSuccess117 = true;
        fileName117 = "UNDLM_00117bis.mov";
        logImportSuccess(117, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00117bis.mov", fileName117);
    } catch (e) {
        logImportError(117, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00117bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess117) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00117.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00094
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile94 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00094.mov");
var gradedFilePoignees94 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00094_AVEC_POIGNEES.mov");
var gradedFileBis94 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00094bis.mov");

var gradedImportSuccess94 = false;
var gradedFileName94 = "";

// Tenter import standard
if (gradedFile94.exists) {
    try {
        var gradedFootage94 = project.importFile(new ImportOptions(gradedFile94));
        gradedFootage94.parentFolder = fromGradingFolder;
        gradedFootage94.name = "UNDLM_00094";
        gradingSources[94] = gradedFootage94;
        gradingImportCount++;
        gradedImportSuccess94 = true;
        gradedFileName94 = "UNDLM_00094.mov";
        logImportSuccess(94, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00094.mov", gradedFileName94);
    } catch (e) {
        logImportError(94, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00094.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess94 && gradedFilePoignees94.exists) {
    try {
        var gradedFootage94 = project.importFile(new ImportOptions(gradedFilePoignees94));
        gradedFootage94.parentFolder = fromGradingFolder;
        gradedFootage94.name = "UNDLM_00094_AVEC_POIGNEES";
        gradingSources[94] = gradedFootage94;
        gradingImportCount++;
        gradedImportSuccess94 = true;
        gradedFileName94 = "UNDLM_00094_AVEC_POIGNEES.mov";
        logImportSuccess(94, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00094_AVEC_POIGNEES.mov", gradedFileName94);
    } catch (e) {
        logImportError(94, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00094_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess94 && gradedFileBis94.exists) {
    try {
        var gradedFootage94 = project.importFile(new ImportOptions(gradedFileBis94));
        gradedFootage94.parentFolder = fromGradingFolder;
        gradedFootage94.name = "UNDLM_00094bis";
        gradingSources[94] = gradedFootage94;
        gradingImportCount++;
        gradedImportSuccess94 = true;
        gradedFileName94 = "UNDLM_00094bis.mov";
        logImportSuccess(94, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00094bis.mov", gradedFileName94);
    } catch (e) {
        logImportError(94, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00094bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess94) {
    missingGradingCount++;
}

// Import plan GRADED 00095
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile95 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00095.mov");
var gradedFilePoignees95 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00095_AVEC_POIGNEES.mov");
var gradedFileBis95 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00095bis.mov");

var gradedImportSuccess95 = false;
var gradedFileName95 = "";

// Tenter import standard
if (gradedFile95.exists) {
    try {
        var gradedFootage95 = project.importFile(new ImportOptions(gradedFile95));
        gradedFootage95.parentFolder = fromGradingFolder;
        gradedFootage95.name = "UNDLM_00095";
        gradingSources[95] = gradedFootage95;
        gradingImportCount++;
        gradedImportSuccess95 = true;
        gradedFileName95 = "UNDLM_00095.mov";
        logImportSuccess(95, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00095.mov", gradedFileName95);
    } catch (e) {
        logImportError(95, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00095.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess95 && gradedFilePoignees95.exists) {
    try {
        var gradedFootage95 = project.importFile(new ImportOptions(gradedFilePoignees95));
        gradedFootage95.parentFolder = fromGradingFolder;
        gradedFootage95.name = "UNDLM_00095_AVEC_POIGNEES";
        gradingSources[95] = gradedFootage95;
        gradingImportCount++;
        gradedImportSuccess95 = true;
        gradedFileName95 = "UNDLM_00095_AVEC_POIGNEES.mov";
        logImportSuccess(95, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00095_AVEC_POIGNEES.mov", gradedFileName95);
    } catch (e) {
        logImportError(95, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00095_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess95 && gradedFileBis95.exists) {
    try {
        var gradedFootage95 = project.importFile(new ImportOptions(gradedFileBis95));
        gradedFootage95.parentFolder = fromGradingFolder;
        gradedFootage95.name = "UNDLM_00095bis";
        gradingSources[95] = gradedFootage95;
        gradingImportCount++;
        gradedImportSuccess95 = true;
        gradedFileName95 = "UNDLM_00095bis.mov";
        logImportSuccess(95, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00095bis.mov", gradedFileName95);
    } catch (e) {
        logImportError(95, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00095bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess95) {
    missingGradingCount++;
}

// Import plan GRADED 00096
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile96 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00096.mov");
var gradedFilePoignees96 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00096_AVEC_POIGNEES.mov");
var gradedFileBis96 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00096bis.mov");

var gradedImportSuccess96 = false;
var gradedFileName96 = "";

// Tenter import standard
if (gradedFile96.exists) {
    try {
        var gradedFootage96 = project.importFile(new ImportOptions(gradedFile96));
        gradedFootage96.parentFolder = fromGradingFolder;
        gradedFootage96.name = "UNDLM_00096";
        gradingSources[96] = gradedFootage96;
        gradingImportCount++;
        gradedImportSuccess96 = true;
        gradedFileName96 = "UNDLM_00096.mov";
        logImportSuccess(96, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00096.mov", gradedFileName96);
    } catch (e) {
        logImportError(96, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00096.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess96 && gradedFilePoignees96.exists) {
    try {
        var gradedFootage96 = project.importFile(new ImportOptions(gradedFilePoignees96));
        gradedFootage96.parentFolder = fromGradingFolder;
        gradedFootage96.name = "UNDLM_00096_AVEC_POIGNEES";
        gradingSources[96] = gradedFootage96;
        gradingImportCount++;
        gradedImportSuccess96 = true;
        gradedFileName96 = "UNDLM_00096_AVEC_POIGNEES.mov";
        logImportSuccess(96, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00096_AVEC_POIGNEES.mov", gradedFileName96);
    } catch (e) {
        logImportError(96, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00096_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess96 && gradedFileBis96.exists) {
    try {
        var gradedFootage96 = project.importFile(new ImportOptions(gradedFileBis96));
        gradedFootage96.parentFolder = fromGradingFolder;
        gradedFootage96.name = "UNDLM_00096bis";
        gradingSources[96] = gradedFootage96;
        gradingImportCount++;
        gradedImportSuccess96 = true;
        gradedFileName96 = "UNDLM_00096bis.mov";
        logImportSuccess(96, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00096bis.mov", gradedFileName96);
    } catch (e) {
        logImportError(96, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00096bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess96) {
    missingGradingCount++;
}

// Import plan GRADED 00097
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile97 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00097.mov");
var gradedFilePoignees97 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00097_AVEC_POIGNEES.mov");
var gradedFileBis97 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00097bis.mov");

var gradedImportSuccess97 = false;
var gradedFileName97 = "";

// Tenter import standard
if (gradedFile97.exists) {
    try {
        var gradedFootage97 = project.importFile(new ImportOptions(gradedFile97));
        gradedFootage97.parentFolder = fromGradingFolder;
        gradedFootage97.name = "UNDLM_00097";
        gradingSources[97] = gradedFootage97;
        gradingImportCount++;
        gradedImportSuccess97 = true;
        gradedFileName97 = "UNDLM_00097.mov";
        logImportSuccess(97, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00097.mov", gradedFileName97);
    } catch (e) {
        logImportError(97, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00097.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess97 && gradedFilePoignees97.exists) {
    try {
        var gradedFootage97 = project.importFile(new ImportOptions(gradedFilePoignees97));
        gradedFootage97.parentFolder = fromGradingFolder;
        gradedFootage97.name = "UNDLM_00097_AVEC_POIGNEES";
        gradingSources[97] = gradedFootage97;
        gradingImportCount++;
        gradedImportSuccess97 = true;
        gradedFileName97 = "UNDLM_00097_AVEC_POIGNEES.mov";
        logImportSuccess(97, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00097_AVEC_POIGNEES.mov", gradedFileName97);
    } catch (e) {
        logImportError(97, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00097_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess97 && gradedFileBis97.exists) {
    try {
        var gradedFootage97 = project.importFile(new ImportOptions(gradedFileBis97));
        gradedFootage97.parentFolder = fromGradingFolder;
        gradedFootage97.name = "UNDLM_00097bis";
        gradingSources[97] = gradedFootage97;
        gradingImportCount++;
        gradedImportSuccess97 = true;
        gradedFileName97 = "UNDLM_00097bis.mov";
        logImportSuccess(97, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00097bis.mov", gradedFileName97);
    } catch (e) {
        logImportError(97, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00097bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess97) {
    missingGradingCount++;
}

// Import plan GRADED 00098
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile98 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00098.mov");
var gradedFilePoignees98 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00098_AVEC_POIGNEES.mov");
var gradedFileBis98 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00098bis.mov");

var gradedImportSuccess98 = false;
var gradedFileName98 = "";

// Tenter import standard
if (gradedFile98.exists) {
    try {
        var gradedFootage98 = project.importFile(new ImportOptions(gradedFile98));
        gradedFootage98.parentFolder = fromGradingFolder;
        gradedFootage98.name = "UNDLM_00098";
        gradingSources[98] = gradedFootage98;
        gradingImportCount++;
        gradedImportSuccess98 = true;
        gradedFileName98 = "UNDLM_00098.mov";
        logImportSuccess(98, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00098.mov", gradedFileName98);
    } catch (e) {
        logImportError(98, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00098.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess98 && gradedFilePoignees98.exists) {
    try {
        var gradedFootage98 = project.importFile(new ImportOptions(gradedFilePoignees98));
        gradedFootage98.parentFolder = fromGradingFolder;
        gradedFootage98.name = "UNDLM_00098_AVEC_POIGNEES";
        gradingSources[98] = gradedFootage98;
        gradingImportCount++;
        gradedImportSuccess98 = true;
        gradedFileName98 = "UNDLM_00098_AVEC_POIGNEES.mov";
        logImportSuccess(98, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00098_AVEC_POIGNEES.mov", gradedFileName98);
    } catch (e) {
        logImportError(98, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00098_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess98 && gradedFileBis98.exists) {
    try {
        var gradedFootage98 = project.importFile(new ImportOptions(gradedFileBis98));
        gradedFootage98.parentFolder = fromGradingFolder;
        gradedFootage98.name = "UNDLM_00098bis";
        gradingSources[98] = gradedFootage98;
        gradingImportCount++;
        gradedImportSuccess98 = true;
        gradedFileName98 = "UNDLM_00098bis.mov";
        logImportSuccess(98, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00098bis.mov", gradedFileName98);
    } catch (e) {
        logImportError(98, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00098bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess98) {
    missingGradingCount++;
}

// Import plan GRADED 00099
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile99 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00099.mov");
var gradedFilePoignees99 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00099_AVEC_POIGNEES.mov");
var gradedFileBis99 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00099bis.mov");

var gradedImportSuccess99 = false;
var gradedFileName99 = "";

// Tenter import standard
if (gradedFile99.exists) {
    try {
        var gradedFootage99 = project.importFile(new ImportOptions(gradedFile99));
        gradedFootage99.parentFolder = fromGradingFolder;
        gradedFootage99.name = "UNDLM_00099";
        gradingSources[99] = gradedFootage99;
        gradingImportCount++;
        gradedImportSuccess99 = true;
        gradedFileName99 = "UNDLM_00099.mov";
        logImportSuccess(99, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00099.mov", gradedFileName99);
    } catch (e) {
        logImportError(99, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00099.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess99 && gradedFilePoignees99.exists) {
    try {
        var gradedFootage99 = project.importFile(new ImportOptions(gradedFilePoignees99));
        gradedFootage99.parentFolder = fromGradingFolder;
        gradedFootage99.name = "UNDLM_00099_AVEC_POIGNEES";
        gradingSources[99] = gradedFootage99;
        gradingImportCount++;
        gradedImportSuccess99 = true;
        gradedFileName99 = "UNDLM_00099_AVEC_POIGNEES.mov";
        logImportSuccess(99, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00099_AVEC_POIGNEES.mov", gradedFileName99);
    } catch (e) {
        logImportError(99, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00099_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess99 && gradedFileBis99.exists) {
    try {
        var gradedFootage99 = project.importFile(new ImportOptions(gradedFileBis99));
        gradedFootage99.parentFolder = fromGradingFolder;
        gradedFootage99.name = "UNDLM_00099bis";
        gradingSources[99] = gradedFootage99;
        gradingImportCount++;
        gradedImportSuccess99 = true;
        gradedFileName99 = "UNDLM_00099bis.mov";
        logImportSuccess(99, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00099bis.mov", gradedFileName99);
    } catch (e) {
        logImportError(99, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00099bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess99) {
    missingGradingCount++;
}

// Import plan GRADED 00100
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile100 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00100.mov");
var gradedFilePoignees100 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00100_AVEC_POIGNEES.mov");
var gradedFileBis100 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00100bis.mov");

var gradedImportSuccess100 = false;
var gradedFileName100 = "";

// Tenter import standard
if (gradedFile100.exists) {
    try {
        var gradedFootage100 = project.importFile(new ImportOptions(gradedFile100));
        gradedFootage100.parentFolder = fromGradingFolder;
        gradedFootage100.name = "UNDLM_00100";
        gradingSources[100] = gradedFootage100;
        gradingImportCount++;
        gradedImportSuccess100 = true;
        gradedFileName100 = "UNDLM_00100.mov";
        logImportSuccess(100, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00100.mov", gradedFileName100);
    } catch (e) {
        logImportError(100, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00100.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess100 && gradedFilePoignees100.exists) {
    try {
        var gradedFootage100 = project.importFile(new ImportOptions(gradedFilePoignees100));
        gradedFootage100.parentFolder = fromGradingFolder;
        gradedFootage100.name = "UNDLM_00100_AVEC_POIGNEES";
        gradingSources[100] = gradedFootage100;
        gradingImportCount++;
        gradedImportSuccess100 = true;
        gradedFileName100 = "UNDLM_00100_AVEC_POIGNEES.mov";
        logImportSuccess(100, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00100_AVEC_POIGNEES.mov", gradedFileName100);
    } catch (e) {
        logImportError(100, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00100_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess100 && gradedFileBis100.exists) {
    try {
        var gradedFootage100 = project.importFile(new ImportOptions(gradedFileBis100));
        gradedFootage100.parentFolder = fromGradingFolder;
        gradedFootage100.name = "UNDLM_00100bis";
        gradingSources[100] = gradedFootage100;
        gradingImportCount++;
        gradedImportSuccess100 = true;
        gradedFileName100 = "UNDLM_00100bis.mov";
        logImportSuccess(100, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00100bis.mov", gradedFileName100);
    } catch (e) {
        logImportError(100, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00100bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess100) {
    missingGradingCount++;
}

// Import plan GRADED 00101
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile101 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00101.mov");
var gradedFilePoignees101 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00101_AVEC_POIGNEES.mov");
var gradedFileBis101 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00101bis.mov");

var gradedImportSuccess101 = false;
var gradedFileName101 = "";

// Tenter import standard
if (gradedFile101.exists) {
    try {
        var gradedFootage101 = project.importFile(new ImportOptions(gradedFile101));
        gradedFootage101.parentFolder = fromGradingFolder;
        gradedFootage101.name = "UNDLM_00101";
        gradingSources[101] = gradedFootage101;
        gradingImportCount++;
        gradedImportSuccess101 = true;
        gradedFileName101 = "UNDLM_00101.mov";
        logImportSuccess(101, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00101.mov", gradedFileName101);
    } catch (e) {
        logImportError(101, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00101.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess101 && gradedFilePoignees101.exists) {
    try {
        var gradedFootage101 = project.importFile(new ImportOptions(gradedFilePoignees101));
        gradedFootage101.parentFolder = fromGradingFolder;
        gradedFootage101.name = "UNDLM_00101_AVEC_POIGNEES";
        gradingSources[101] = gradedFootage101;
        gradingImportCount++;
        gradedImportSuccess101 = true;
        gradedFileName101 = "UNDLM_00101_AVEC_POIGNEES.mov";
        logImportSuccess(101, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00101_AVEC_POIGNEES.mov", gradedFileName101);
    } catch (e) {
        logImportError(101, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00101_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess101 && gradedFileBis101.exists) {
    try {
        var gradedFootage101 = project.importFile(new ImportOptions(gradedFileBis101));
        gradedFootage101.parentFolder = fromGradingFolder;
        gradedFootage101.name = "UNDLM_00101bis";
        gradingSources[101] = gradedFootage101;
        gradingImportCount++;
        gradedImportSuccess101 = true;
        gradedFileName101 = "UNDLM_00101bis.mov";
        logImportSuccess(101, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00101bis.mov", gradedFileName101);
    } catch (e) {
        logImportError(101, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00101bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess101) {
    missingGradingCount++;
}

// Import plan GRADED 00102
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile102 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00102.mov");
var gradedFilePoignees102 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00102_AVEC_POIGNEES.mov");
var gradedFileBis102 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00102bis.mov");

var gradedImportSuccess102 = false;
var gradedFileName102 = "";

// Tenter import standard
if (gradedFile102.exists) {
    try {
        var gradedFootage102 = project.importFile(new ImportOptions(gradedFile102));
        gradedFootage102.parentFolder = fromGradingFolder;
        gradedFootage102.name = "UNDLM_00102";
        gradingSources[102] = gradedFootage102;
        gradingImportCount++;
        gradedImportSuccess102 = true;
        gradedFileName102 = "UNDLM_00102.mov";
        logImportSuccess(102, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00102.mov", gradedFileName102);
    } catch (e) {
        logImportError(102, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00102.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess102 && gradedFilePoignees102.exists) {
    try {
        var gradedFootage102 = project.importFile(new ImportOptions(gradedFilePoignees102));
        gradedFootage102.parentFolder = fromGradingFolder;
        gradedFootage102.name = "UNDLM_00102_AVEC_POIGNEES";
        gradingSources[102] = gradedFootage102;
        gradingImportCount++;
        gradedImportSuccess102 = true;
        gradedFileName102 = "UNDLM_00102_AVEC_POIGNEES.mov";
        logImportSuccess(102, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00102_AVEC_POIGNEES.mov", gradedFileName102);
    } catch (e) {
        logImportError(102, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00102_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess102 && gradedFileBis102.exists) {
    try {
        var gradedFootage102 = project.importFile(new ImportOptions(gradedFileBis102));
        gradedFootage102.parentFolder = fromGradingFolder;
        gradedFootage102.name = "UNDLM_00102bis";
        gradingSources[102] = gradedFootage102;
        gradingImportCount++;
        gradedImportSuccess102 = true;
        gradedFileName102 = "UNDLM_00102bis.mov";
        logImportSuccess(102, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00102bis.mov", gradedFileName102);
    } catch (e) {
        logImportError(102, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00102bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess102) {
    missingGradingCount++;
}

// Import plan GRADED 00103
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile103 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00103.mov");
var gradedFilePoignees103 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00103_AVEC_POIGNEES.mov");
var gradedFileBis103 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00103bis.mov");

var gradedImportSuccess103 = false;
var gradedFileName103 = "";

// Tenter import standard
if (gradedFile103.exists) {
    try {
        var gradedFootage103 = project.importFile(new ImportOptions(gradedFile103));
        gradedFootage103.parentFolder = fromGradingFolder;
        gradedFootage103.name = "UNDLM_00103";
        gradingSources[103] = gradedFootage103;
        gradingImportCount++;
        gradedImportSuccess103 = true;
        gradedFileName103 = "UNDLM_00103.mov";
        logImportSuccess(103, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00103.mov", gradedFileName103);
    } catch (e) {
        logImportError(103, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00103.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess103 && gradedFilePoignees103.exists) {
    try {
        var gradedFootage103 = project.importFile(new ImportOptions(gradedFilePoignees103));
        gradedFootage103.parentFolder = fromGradingFolder;
        gradedFootage103.name = "UNDLM_00103_AVEC_POIGNEES";
        gradingSources[103] = gradedFootage103;
        gradingImportCount++;
        gradedImportSuccess103 = true;
        gradedFileName103 = "UNDLM_00103_AVEC_POIGNEES.mov";
        logImportSuccess(103, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00103_AVEC_POIGNEES.mov", gradedFileName103);
    } catch (e) {
        logImportError(103, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00103_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess103 && gradedFileBis103.exists) {
    try {
        var gradedFootage103 = project.importFile(new ImportOptions(gradedFileBis103));
        gradedFootage103.parentFolder = fromGradingFolder;
        gradedFootage103.name = "UNDLM_00103bis";
        gradingSources[103] = gradedFootage103;
        gradingImportCount++;
        gradedImportSuccess103 = true;
        gradedFileName103 = "UNDLM_00103bis.mov";
        logImportSuccess(103, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00103bis.mov", gradedFileName103);
    } catch (e) {
        logImportError(103, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00103bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess103) {
    missingGradingCount++;
}

// Import plan GRADED 00104
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile104 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00104.mov");
var gradedFilePoignees104 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00104_AVEC_POIGNEES.mov");
var gradedFileBis104 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00104bis.mov");

var gradedImportSuccess104 = false;
var gradedFileName104 = "";

// Tenter import standard
if (gradedFile104.exists) {
    try {
        var gradedFootage104 = project.importFile(new ImportOptions(gradedFile104));
        gradedFootage104.parentFolder = fromGradingFolder;
        gradedFootage104.name = "UNDLM_00104";
        gradingSources[104] = gradedFootage104;
        gradingImportCount++;
        gradedImportSuccess104 = true;
        gradedFileName104 = "UNDLM_00104.mov";
        logImportSuccess(104, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00104.mov", gradedFileName104);
    } catch (e) {
        logImportError(104, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00104.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess104 && gradedFilePoignees104.exists) {
    try {
        var gradedFootage104 = project.importFile(new ImportOptions(gradedFilePoignees104));
        gradedFootage104.parentFolder = fromGradingFolder;
        gradedFootage104.name = "UNDLM_00104_AVEC_POIGNEES";
        gradingSources[104] = gradedFootage104;
        gradingImportCount++;
        gradedImportSuccess104 = true;
        gradedFileName104 = "UNDLM_00104_AVEC_POIGNEES.mov";
        logImportSuccess(104, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00104_AVEC_POIGNEES.mov", gradedFileName104);
    } catch (e) {
        logImportError(104, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00104_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess104 && gradedFileBis104.exists) {
    try {
        var gradedFootage104 = project.importFile(new ImportOptions(gradedFileBis104));
        gradedFootage104.parentFolder = fromGradingFolder;
        gradedFootage104.name = "UNDLM_00104bis";
        gradingSources[104] = gradedFootage104;
        gradingImportCount++;
        gradedImportSuccess104 = true;
        gradedFileName104 = "UNDLM_00104bis.mov";
        logImportSuccess(104, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00104bis.mov", gradedFileName104);
    } catch (e) {
        logImportError(104, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00104bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess104) {
    missingGradingCount++;
}

// Import plan GRADED 00105
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile105 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00105.mov");
var gradedFilePoignees105 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00105_AVEC_POIGNEES.mov");
var gradedFileBis105 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00105bis.mov");

var gradedImportSuccess105 = false;
var gradedFileName105 = "";

// Tenter import standard
if (gradedFile105.exists) {
    try {
        var gradedFootage105 = project.importFile(new ImportOptions(gradedFile105));
        gradedFootage105.parentFolder = fromGradingFolder;
        gradedFootage105.name = "UNDLM_00105";
        gradingSources[105] = gradedFootage105;
        gradingImportCount++;
        gradedImportSuccess105 = true;
        gradedFileName105 = "UNDLM_00105.mov";
        logImportSuccess(105, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00105.mov", gradedFileName105);
    } catch (e) {
        logImportError(105, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00105.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess105 && gradedFilePoignees105.exists) {
    try {
        var gradedFootage105 = project.importFile(new ImportOptions(gradedFilePoignees105));
        gradedFootage105.parentFolder = fromGradingFolder;
        gradedFootage105.name = "UNDLM_00105_AVEC_POIGNEES";
        gradingSources[105] = gradedFootage105;
        gradingImportCount++;
        gradedImportSuccess105 = true;
        gradedFileName105 = "UNDLM_00105_AVEC_POIGNEES.mov";
        logImportSuccess(105, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00105_AVEC_POIGNEES.mov", gradedFileName105);
    } catch (e) {
        logImportError(105, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00105_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess105 && gradedFileBis105.exists) {
    try {
        var gradedFootage105 = project.importFile(new ImportOptions(gradedFileBis105));
        gradedFootage105.parentFolder = fromGradingFolder;
        gradedFootage105.name = "UNDLM_00105bis";
        gradingSources[105] = gradedFootage105;
        gradingImportCount++;
        gradedImportSuccess105 = true;
        gradedFileName105 = "UNDLM_00105bis.mov";
        logImportSuccess(105, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00105bis.mov", gradedFileName105);
    } catch (e) {
        logImportError(105, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00105bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess105) {
    missingGradingCount++;
}

// Import plan GRADED 00106
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile106 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00106.mov");
var gradedFilePoignees106 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00106_AVEC_POIGNEES.mov");
var gradedFileBis106 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00106bis.mov");

var gradedImportSuccess106 = false;
var gradedFileName106 = "";

// Tenter import standard
if (gradedFile106.exists) {
    try {
        var gradedFootage106 = project.importFile(new ImportOptions(gradedFile106));
        gradedFootage106.parentFolder = fromGradingFolder;
        gradedFootage106.name = "UNDLM_00106";
        gradingSources[106] = gradedFootage106;
        gradingImportCount++;
        gradedImportSuccess106 = true;
        gradedFileName106 = "UNDLM_00106.mov";
        logImportSuccess(106, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00106.mov", gradedFileName106);
    } catch (e) {
        logImportError(106, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00106.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess106 && gradedFilePoignees106.exists) {
    try {
        var gradedFootage106 = project.importFile(new ImportOptions(gradedFilePoignees106));
        gradedFootage106.parentFolder = fromGradingFolder;
        gradedFootage106.name = "UNDLM_00106_AVEC_POIGNEES";
        gradingSources[106] = gradedFootage106;
        gradingImportCount++;
        gradedImportSuccess106 = true;
        gradedFileName106 = "UNDLM_00106_AVEC_POIGNEES.mov";
        logImportSuccess(106, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00106_AVEC_POIGNEES.mov", gradedFileName106);
    } catch (e) {
        logImportError(106, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00106_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess106 && gradedFileBis106.exists) {
    try {
        var gradedFootage106 = project.importFile(new ImportOptions(gradedFileBis106));
        gradedFootage106.parentFolder = fromGradingFolder;
        gradedFootage106.name = "UNDLM_00106bis";
        gradingSources[106] = gradedFootage106;
        gradingImportCount++;
        gradedImportSuccess106 = true;
        gradedFileName106 = "UNDLM_00106bis.mov";
        logImportSuccess(106, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00106bis.mov", gradedFileName106);
    } catch (e) {
        logImportError(106, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00106bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess106) {
    missingGradingCount++;
}

// Import plan GRADED 00107
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile107 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00107.mov");
var gradedFilePoignees107 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00107_AVEC_POIGNEES.mov");
var gradedFileBis107 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00107bis.mov");

var gradedImportSuccess107 = false;
var gradedFileName107 = "";

// Tenter import standard
if (gradedFile107.exists) {
    try {
        var gradedFootage107 = project.importFile(new ImportOptions(gradedFile107));
        gradedFootage107.parentFolder = fromGradingFolder;
        gradedFootage107.name = "UNDLM_00107";
        gradingSources[107] = gradedFootage107;
        gradingImportCount++;
        gradedImportSuccess107 = true;
        gradedFileName107 = "UNDLM_00107.mov";
        logImportSuccess(107, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00107.mov", gradedFileName107);
    } catch (e) {
        logImportError(107, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00107.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess107 && gradedFilePoignees107.exists) {
    try {
        var gradedFootage107 = project.importFile(new ImportOptions(gradedFilePoignees107));
        gradedFootage107.parentFolder = fromGradingFolder;
        gradedFootage107.name = "UNDLM_00107_AVEC_POIGNEES";
        gradingSources[107] = gradedFootage107;
        gradingImportCount++;
        gradedImportSuccess107 = true;
        gradedFileName107 = "UNDLM_00107_AVEC_POIGNEES.mov";
        logImportSuccess(107, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00107_AVEC_POIGNEES.mov", gradedFileName107);
    } catch (e) {
        logImportError(107, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00107_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess107 && gradedFileBis107.exists) {
    try {
        var gradedFootage107 = project.importFile(new ImportOptions(gradedFileBis107));
        gradedFootage107.parentFolder = fromGradingFolder;
        gradedFootage107.name = "UNDLM_00107bis";
        gradingSources[107] = gradedFootage107;
        gradingImportCount++;
        gradedImportSuccess107 = true;
        gradedFileName107 = "UNDLM_00107bis.mov";
        logImportSuccess(107, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00107bis.mov", gradedFileName107);
    } catch (e) {
        logImportError(107, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00107bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess107) {
    missingGradingCount++;
}

// Import plan GRADED 00108
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile108 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00108.mov");
var gradedFilePoignees108 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00108_AVEC_POIGNEES.mov");
var gradedFileBis108 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00108bis.mov");

var gradedImportSuccess108 = false;
var gradedFileName108 = "";

// Tenter import standard
if (gradedFile108.exists) {
    try {
        var gradedFootage108 = project.importFile(new ImportOptions(gradedFile108));
        gradedFootage108.parentFolder = fromGradingFolder;
        gradedFootage108.name = "UNDLM_00108";
        gradingSources[108] = gradedFootage108;
        gradingImportCount++;
        gradedImportSuccess108 = true;
        gradedFileName108 = "UNDLM_00108.mov";
        logImportSuccess(108, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00108.mov", gradedFileName108);
    } catch (e) {
        logImportError(108, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00108.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess108 && gradedFilePoignees108.exists) {
    try {
        var gradedFootage108 = project.importFile(new ImportOptions(gradedFilePoignees108));
        gradedFootage108.parentFolder = fromGradingFolder;
        gradedFootage108.name = "UNDLM_00108_AVEC_POIGNEES";
        gradingSources[108] = gradedFootage108;
        gradingImportCount++;
        gradedImportSuccess108 = true;
        gradedFileName108 = "UNDLM_00108_AVEC_POIGNEES.mov";
        logImportSuccess(108, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00108_AVEC_POIGNEES.mov", gradedFileName108);
    } catch (e) {
        logImportError(108, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00108_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess108 && gradedFileBis108.exists) {
    try {
        var gradedFootage108 = project.importFile(new ImportOptions(gradedFileBis108));
        gradedFootage108.parentFolder = fromGradingFolder;
        gradedFootage108.name = "UNDLM_00108bis";
        gradingSources[108] = gradedFootage108;
        gradingImportCount++;
        gradedImportSuccess108 = true;
        gradedFileName108 = "UNDLM_00108bis.mov";
        logImportSuccess(108, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00108bis.mov", gradedFileName108);
    } catch (e) {
        logImportError(108, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00108bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess108) {
    missingGradingCount++;
}

// Import plan GRADED 00109
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile109 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00109.mov");
var gradedFilePoignees109 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00109_AVEC_POIGNEES.mov");
var gradedFileBis109 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00109bis.mov");

var gradedImportSuccess109 = false;
var gradedFileName109 = "";

// Tenter import standard
if (gradedFile109.exists) {
    try {
        var gradedFootage109 = project.importFile(new ImportOptions(gradedFile109));
        gradedFootage109.parentFolder = fromGradingFolder;
        gradedFootage109.name = "UNDLM_00109";
        gradingSources[109] = gradedFootage109;
        gradingImportCount++;
        gradedImportSuccess109 = true;
        gradedFileName109 = "UNDLM_00109.mov";
        logImportSuccess(109, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00109.mov", gradedFileName109);
    } catch (e) {
        logImportError(109, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00109.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess109 && gradedFilePoignees109.exists) {
    try {
        var gradedFootage109 = project.importFile(new ImportOptions(gradedFilePoignees109));
        gradedFootage109.parentFolder = fromGradingFolder;
        gradedFootage109.name = "UNDLM_00109_AVEC_POIGNEES";
        gradingSources[109] = gradedFootage109;
        gradingImportCount++;
        gradedImportSuccess109 = true;
        gradedFileName109 = "UNDLM_00109_AVEC_POIGNEES.mov";
        logImportSuccess(109, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00109_AVEC_POIGNEES.mov", gradedFileName109);
    } catch (e) {
        logImportError(109, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00109_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess109 && gradedFileBis109.exists) {
    try {
        var gradedFootage109 = project.importFile(new ImportOptions(gradedFileBis109));
        gradedFootage109.parentFolder = fromGradingFolder;
        gradedFootage109.name = "UNDLM_00109bis";
        gradingSources[109] = gradedFootage109;
        gradingImportCount++;
        gradedImportSuccess109 = true;
        gradedFileName109 = "UNDLM_00109bis.mov";
        logImportSuccess(109, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00109bis.mov", gradedFileName109);
    } catch (e) {
        logImportError(109, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00109bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess109) {
    missingGradingCount++;
}

// Import plan GRADED 00110
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile110 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00110.mov");
var gradedFilePoignees110 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00110_AVEC_POIGNEES.mov");
var gradedFileBis110 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00110bis.mov");

var gradedImportSuccess110 = false;
var gradedFileName110 = "";

// Tenter import standard
if (gradedFile110.exists) {
    try {
        var gradedFootage110 = project.importFile(new ImportOptions(gradedFile110));
        gradedFootage110.parentFolder = fromGradingFolder;
        gradedFootage110.name = "UNDLM_00110";
        gradingSources[110] = gradedFootage110;
        gradingImportCount++;
        gradedImportSuccess110 = true;
        gradedFileName110 = "UNDLM_00110.mov";
        logImportSuccess(110, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00110.mov", gradedFileName110);
    } catch (e) {
        logImportError(110, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00110.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess110 && gradedFilePoignees110.exists) {
    try {
        var gradedFootage110 = project.importFile(new ImportOptions(gradedFilePoignees110));
        gradedFootage110.parentFolder = fromGradingFolder;
        gradedFootage110.name = "UNDLM_00110_AVEC_POIGNEES";
        gradingSources[110] = gradedFootage110;
        gradingImportCount++;
        gradedImportSuccess110 = true;
        gradedFileName110 = "UNDLM_00110_AVEC_POIGNEES.mov";
        logImportSuccess(110, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00110_AVEC_POIGNEES.mov", gradedFileName110);
    } catch (e) {
        logImportError(110, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00110_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess110 && gradedFileBis110.exists) {
    try {
        var gradedFootage110 = project.importFile(new ImportOptions(gradedFileBis110));
        gradedFootage110.parentFolder = fromGradingFolder;
        gradedFootage110.name = "UNDLM_00110bis";
        gradingSources[110] = gradedFootage110;
        gradingImportCount++;
        gradedImportSuccess110 = true;
        gradedFileName110 = "UNDLM_00110bis.mov";
        logImportSuccess(110, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00110bis.mov", gradedFileName110);
    } catch (e) {
        logImportError(110, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00110bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess110) {
    missingGradingCount++;
}

// Import plan GRADED 00111
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile111 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00111.mov");
var gradedFilePoignees111 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00111_AVEC_POIGNEES.mov");
var gradedFileBis111 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00111bis.mov");

var gradedImportSuccess111 = false;
var gradedFileName111 = "";

// Tenter import standard
if (gradedFile111.exists) {
    try {
        var gradedFootage111 = project.importFile(new ImportOptions(gradedFile111));
        gradedFootage111.parentFolder = fromGradingFolder;
        gradedFootage111.name = "UNDLM_00111";
        gradingSources[111] = gradedFootage111;
        gradingImportCount++;
        gradedImportSuccess111 = true;
        gradedFileName111 = "UNDLM_00111.mov";
        logImportSuccess(111, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00111.mov", gradedFileName111);
    } catch (e) {
        logImportError(111, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00111.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess111 && gradedFilePoignees111.exists) {
    try {
        var gradedFootage111 = project.importFile(new ImportOptions(gradedFilePoignees111));
        gradedFootage111.parentFolder = fromGradingFolder;
        gradedFootage111.name = "UNDLM_00111_AVEC_POIGNEES";
        gradingSources[111] = gradedFootage111;
        gradingImportCount++;
        gradedImportSuccess111 = true;
        gradedFileName111 = "UNDLM_00111_AVEC_POIGNEES.mov";
        logImportSuccess(111, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00111_AVEC_POIGNEES.mov", gradedFileName111);
    } catch (e) {
        logImportError(111, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00111_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess111 && gradedFileBis111.exists) {
    try {
        var gradedFootage111 = project.importFile(new ImportOptions(gradedFileBis111));
        gradedFootage111.parentFolder = fromGradingFolder;
        gradedFootage111.name = "UNDLM_00111bis";
        gradingSources[111] = gradedFootage111;
        gradingImportCount++;
        gradedImportSuccess111 = true;
        gradedFileName111 = "UNDLM_00111bis.mov";
        logImportSuccess(111, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00111bis.mov", gradedFileName111);
    } catch (e) {
        logImportError(111, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00111bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess111) {
    missingGradingCount++;
}

// Import plan GRADED 00112
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile112 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00112.mov");
var gradedFilePoignees112 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00112_AVEC_POIGNEES.mov");
var gradedFileBis112 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00112bis.mov");

var gradedImportSuccess112 = false;
var gradedFileName112 = "";

// Tenter import standard
if (gradedFile112.exists) {
    try {
        var gradedFootage112 = project.importFile(new ImportOptions(gradedFile112));
        gradedFootage112.parentFolder = fromGradingFolder;
        gradedFootage112.name = "UNDLM_00112";
        gradingSources[112] = gradedFootage112;
        gradingImportCount++;
        gradedImportSuccess112 = true;
        gradedFileName112 = "UNDLM_00112.mov";
        logImportSuccess(112, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00112.mov", gradedFileName112);
    } catch (e) {
        logImportError(112, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00112.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess112 && gradedFilePoignees112.exists) {
    try {
        var gradedFootage112 = project.importFile(new ImportOptions(gradedFilePoignees112));
        gradedFootage112.parentFolder = fromGradingFolder;
        gradedFootage112.name = "UNDLM_00112_AVEC_POIGNEES";
        gradingSources[112] = gradedFootage112;
        gradingImportCount++;
        gradedImportSuccess112 = true;
        gradedFileName112 = "UNDLM_00112_AVEC_POIGNEES.mov";
        logImportSuccess(112, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00112_AVEC_POIGNEES.mov", gradedFileName112);
    } catch (e) {
        logImportError(112, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00112_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess112 && gradedFileBis112.exists) {
    try {
        var gradedFootage112 = project.importFile(new ImportOptions(gradedFileBis112));
        gradedFootage112.parentFolder = fromGradingFolder;
        gradedFootage112.name = "UNDLM_00112bis";
        gradingSources[112] = gradedFootage112;
        gradingImportCount++;
        gradedImportSuccess112 = true;
        gradedFileName112 = "UNDLM_00112bis.mov";
        logImportSuccess(112, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00112bis.mov", gradedFileName112);
    } catch (e) {
        logImportError(112, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00112bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess112) {
    missingGradingCount++;
}

// Import plan GRADED 00113
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile113 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00113.mov");
var gradedFilePoignees113 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00113_AVEC_POIGNEES.mov");
var gradedFileBis113 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00113bis.mov");

var gradedImportSuccess113 = false;
var gradedFileName113 = "";

// Tenter import standard
if (gradedFile113.exists) {
    try {
        var gradedFootage113 = project.importFile(new ImportOptions(gradedFile113));
        gradedFootage113.parentFolder = fromGradingFolder;
        gradedFootage113.name = "UNDLM_00113";
        gradingSources[113] = gradedFootage113;
        gradingImportCount++;
        gradedImportSuccess113 = true;
        gradedFileName113 = "UNDLM_00113.mov";
        logImportSuccess(113, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00113.mov", gradedFileName113);
    } catch (e) {
        logImportError(113, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00113.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess113 && gradedFilePoignees113.exists) {
    try {
        var gradedFootage113 = project.importFile(new ImportOptions(gradedFilePoignees113));
        gradedFootage113.parentFolder = fromGradingFolder;
        gradedFootage113.name = "UNDLM_00113_AVEC_POIGNEES";
        gradingSources[113] = gradedFootage113;
        gradingImportCount++;
        gradedImportSuccess113 = true;
        gradedFileName113 = "UNDLM_00113_AVEC_POIGNEES.mov";
        logImportSuccess(113, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00113_AVEC_POIGNEES.mov", gradedFileName113);
    } catch (e) {
        logImportError(113, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00113_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess113 && gradedFileBis113.exists) {
    try {
        var gradedFootage113 = project.importFile(new ImportOptions(gradedFileBis113));
        gradedFootage113.parentFolder = fromGradingFolder;
        gradedFootage113.name = "UNDLM_00113bis";
        gradingSources[113] = gradedFootage113;
        gradingImportCount++;
        gradedImportSuccess113 = true;
        gradedFileName113 = "UNDLM_00113bis.mov";
        logImportSuccess(113, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00113bis.mov", gradedFileName113);
    } catch (e) {
        logImportError(113, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00113bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess113) {
    missingGradingCount++;
}

// Import plan GRADED 00114
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile114 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00114.mov");
var gradedFilePoignees114 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00114_AVEC_POIGNEES.mov");
var gradedFileBis114 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00114bis.mov");

var gradedImportSuccess114 = false;
var gradedFileName114 = "";

// Tenter import standard
if (gradedFile114.exists) {
    try {
        var gradedFootage114 = project.importFile(new ImportOptions(gradedFile114));
        gradedFootage114.parentFolder = fromGradingFolder;
        gradedFootage114.name = "UNDLM_00114";
        gradingSources[114] = gradedFootage114;
        gradingImportCount++;
        gradedImportSuccess114 = true;
        gradedFileName114 = "UNDLM_00114.mov";
        logImportSuccess(114, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00114.mov", gradedFileName114);
    } catch (e) {
        logImportError(114, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00114.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess114 && gradedFilePoignees114.exists) {
    try {
        var gradedFootage114 = project.importFile(new ImportOptions(gradedFilePoignees114));
        gradedFootage114.parentFolder = fromGradingFolder;
        gradedFootage114.name = "UNDLM_00114_AVEC_POIGNEES";
        gradingSources[114] = gradedFootage114;
        gradingImportCount++;
        gradedImportSuccess114 = true;
        gradedFileName114 = "UNDLM_00114_AVEC_POIGNEES.mov";
        logImportSuccess(114, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00114_AVEC_POIGNEES.mov", gradedFileName114);
    } catch (e) {
        logImportError(114, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00114_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess114 && gradedFileBis114.exists) {
    try {
        var gradedFootage114 = project.importFile(new ImportOptions(gradedFileBis114));
        gradedFootage114.parentFolder = fromGradingFolder;
        gradedFootage114.name = "UNDLM_00114bis";
        gradingSources[114] = gradedFootage114;
        gradingImportCount++;
        gradedImportSuccess114 = true;
        gradedFileName114 = "UNDLM_00114bis.mov";
        logImportSuccess(114, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00114bis.mov", gradedFileName114);
    } catch (e) {
        logImportError(114, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00114bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess114) {
    missingGradingCount++;
}

// Import plan GRADED 00115
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile115 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00115.mov");
var gradedFilePoignees115 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00115_AVEC_POIGNEES.mov");
var gradedFileBis115 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00115bis.mov");

var gradedImportSuccess115 = false;
var gradedFileName115 = "";

// Tenter import standard
if (gradedFile115.exists) {
    try {
        var gradedFootage115 = project.importFile(new ImportOptions(gradedFile115));
        gradedFootage115.parentFolder = fromGradingFolder;
        gradedFootage115.name = "UNDLM_00115";
        gradingSources[115] = gradedFootage115;
        gradingImportCount++;
        gradedImportSuccess115 = true;
        gradedFileName115 = "UNDLM_00115.mov";
        logImportSuccess(115, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00115.mov", gradedFileName115);
    } catch (e) {
        logImportError(115, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00115.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess115 && gradedFilePoignees115.exists) {
    try {
        var gradedFootage115 = project.importFile(new ImportOptions(gradedFilePoignees115));
        gradedFootage115.parentFolder = fromGradingFolder;
        gradedFootage115.name = "UNDLM_00115_AVEC_POIGNEES";
        gradingSources[115] = gradedFootage115;
        gradingImportCount++;
        gradedImportSuccess115 = true;
        gradedFileName115 = "UNDLM_00115_AVEC_POIGNEES.mov";
        logImportSuccess(115, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00115_AVEC_POIGNEES.mov", gradedFileName115);
    } catch (e) {
        logImportError(115, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00115_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess115 && gradedFileBis115.exists) {
    try {
        var gradedFootage115 = project.importFile(new ImportOptions(gradedFileBis115));
        gradedFootage115.parentFolder = fromGradingFolder;
        gradedFootage115.name = "UNDLM_00115bis";
        gradingSources[115] = gradedFootage115;
        gradingImportCount++;
        gradedImportSuccess115 = true;
        gradedFileName115 = "UNDLM_00115bis.mov";
        logImportSuccess(115, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00115bis.mov", gradedFileName115);
    } catch (e) {
        logImportError(115, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00115bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess115) {
    missingGradingCount++;
}

// Import plan GRADED 00116
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile116 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00116.mov");
var gradedFilePoignees116 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00116_AVEC_POIGNEES.mov");
var gradedFileBis116 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00116bis.mov");

var gradedImportSuccess116 = false;
var gradedFileName116 = "";

// Tenter import standard
if (gradedFile116.exists) {
    try {
        var gradedFootage116 = project.importFile(new ImportOptions(gradedFile116));
        gradedFootage116.parentFolder = fromGradingFolder;
        gradedFootage116.name = "UNDLM_00116";
        gradingSources[116] = gradedFootage116;
        gradingImportCount++;
        gradedImportSuccess116 = true;
        gradedFileName116 = "UNDLM_00116.mov";
        logImportSuccess(116, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00116.mov", gradedFileName116);
    } catch (e) {
        logImportError(116, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00116.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess116 && gradedFilePoignees116.exists) {
    try {
        var gradedFootage116 = project.importFile(new ImportOptions(gradedFilePoignees116));
        gradedFootage116.parentFolder = fromGradingFolder;
        gradedFootage116.name = "UNDLM_00116_AVEC_POIGNEES";
        gradingSources[116] = gradedFootage116;
        gradingImportCount++;
        gradedImportSuccess116 = true;
        gradedFileName116 = "UNDLM_00116_AVEC_POIGNEES.mov";
        logImportSuccess(116, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00116_AVEC_POIGNEES.mov", gradedFileName116);
    } catch (e) {
        logImportError(116, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00116_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess116 && gradedFileBis116.exists) {
    try {
        var gradedFootage116 = project.importFile(new ImportOptions(gradedFileBis116));
        gradedFootage116.parentFolder = fromGradingFolder;
        gradedFootage116.name = "UNDLM_00116bis";
        gradingSources[116] = gradedFootage116;
        gradingImportCount++;
        gradedImportSuccess116 = true;
        gradedFileName116 = "UNDLM_00116bis.mov";
        logImportSuccess(116, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00116bis.mov", gradedFileName116);
    } catch (e) {
        logImportError(116, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00116bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess116) {
    missingGradingCount++;
}

// Import plan GRADED 00117
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile117 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00117.mov");
var gradedFilePoignees117 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00117_AVEC_POIGNEES.mov");
var gradedFileBis117 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00117bis.mov");

var gradedImportSuccess117 = false;
var gradedFileName117 = "";

// Tenter import standard
if (gradedFile117.exists) {
    try {
        var gradedFootage117 = project.importFile(new ImportOptions(gradedFile117));
        gradedFootage117.parentFolder = fromGradingFolder;
        gradedFootage117.name = "UNDLM_00117";
        gradingSources[117] = gradedFootage117;
        gradingImportCount++;
        gradedImportSuccess117 = true;
        gradedFileName117 = "UNDLM_00117.mov";
        logImportSuccess(117, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00117.mov", gradedFileName117);
    } catch (e) {
        logImportError(117, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00117.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess117 && gradedFilePoignees117.exists) {
    try {
        var gradedFootage117 = project.importFile(new ImportOptions(gradedFilePoignees117));
        gradedFootage117.parentFolder = fromGradingFolder;
        gradedFootage117.name = "UNDLM_00117_AVEC_POIGNEES";
        gradingSources[117] = gradedFootage117;
        gradingImportCount++;
        gradedImportSuccess117 = true;
        gradedFileName117 = "UNDLM_00117_AVEC_POIGNEES.mov";
        logImportSuccess(117, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00117_AVEC_POIGNEES.mov", gradedFileName117);
    } catch (e) {
        logImportError(117, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00117_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess117 && gradedFileBis117.exists) {
    try {
        var gradedFootage117 = project.importFile(new ImportOptions(gradedFileBis117));
        gradedFootage117.parentFolder = fromGradingFolder;
        gradedFootage117.name = "UNDLM_00117bis";
        gradingSources[117] = gradedFootage117;
        gradingImportCount++;
        gradedImportSuccess117 = true;
        gradedFileName117 = "UNDLM_00117bis.mov";
        logImportSuccess(117, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00117bis.mov", gradedFileName117);
    } catch (e) {
        logImportError(117, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00117bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess117) {
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


// Composition pour plan 00094
var planComp94 = project.items.addComp(
    "SQ04_UNDLM_00094_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp94.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer94 = planComp94.layers.add(bgSolidComp);
bgLayer94.name = "BG_SOLID";
bgLayer94.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer94 = false;
if (gradingSources[94]) {
    var gradedLayer94 = planComp94.layers.add(gradingSources[94]);
    gradedLayer94.name = "UNDLM_00094_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer94.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer94.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer94 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer94 = false;
if (editSources[94]) {
    var editLayer94 = planComp94.layers.add(editSources[94]);
    editLayer94.name = "UNDLM_00094_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer94.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer94.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer94 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity94 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer94) {
    // EDIT toujours activé quand disponible
    editLayer94.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer94) {
        gradedLayer94.enabled = false;
    }
} else if (hasGradedLayer94) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer94.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText94 = planComp94.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText94.name = "WARNING_NO_EDIT";
    warningText94.property("Transform").property("Position").setValue([1280, 200]);
    warningText94.guideLayer = true;
    
    var warningTextDoc94 = warningText94.property("Source Text").value;
    warningTextDoc94.fontSize = 32;
    warningTextDoc94.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc94.font = "Arial-BoldMT";
    warningTextDoc94.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText94.property("Source Text").setValue(warningTextDoc94);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText94 = planComp94.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00094");
    errorText94.name = "ERROR_NO_SOURCE";
    errorText94.property("Transform").property("Position").setValue([1280, 720]);
    errorText94.guideLayer = true;
    
    var errorTextDoc94 = errorText94.property("Source Text").value;
    errorTextDoc94.fontSize = 48;
    errorTextDoc94.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc94.font = "Arial-BoldMT";
    errorTextDoc94.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText94.property("Source Text").setValue(errorTextDoc94);
}

planCompositions[94] = planComp94;


// Composition pour plan 00095
var planComp95 = project.items.addComp(
    "SQ04_UNDLM_00095_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp95.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer95 = planComp95.layers.add(bgSolidComp);
bgLayer95.name = "BG_SOLID";
bgLayer95.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer95 = false;
if (gradingSources[95]) {
    var gradedLayer95 = planComp95.layers.add(gradingSources[95]);
    gradedLayer95.name = "UNDLM_00095_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer95.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer95.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer95 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer95 = false;
if (editSources[95]) {
    var editLayer95 = planComp95.layers.add(editSources[95]);
    editLayer95.name = "UNDLM_00095_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer95.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer95.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer95 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity95 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer95) {
    // EDIT toujours activé quand disponible
    editLayer95.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer95) {
        gradedLayer95.enabled = false;
    }
} else if (hasGradedLayer95) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer95.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText95 = planComp95.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText95.name = "WARNING_NO_EDIT";
    warningText95.property("Transform").property("Position").setValue([1280, 200]);
    warningText95.guideLayer = true;
    
    var warningTextDoc95 = warningText95.property("Source Text").value;
    warningTextDoc95.fontSize = 32;
    warningTextDoc95.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc95.font = "Arial-BoldMT";
    warningTextDoc95.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText95.property("Source Text").setValue(warningTextDoc95);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText95 = planComp95.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00095");
    errorText95.name = "ERROR_NO_SOURCE";
    errorText95.property("Transform").property("Position").setValue([1280, 720]);
    errorText95.guideLayer = true;
    
    var errorTextDoc95 = errorText95.property("Source Text").value;
    errorTextDoc95.fontSize = 48;
    errorTextDoc95.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc95.font = "Arial-BoldMT";
    errorTextDoc95.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText95.property("Source Text").setValue(errorTextDoc95);
}

planCompositions[95] = planComp95;


// Composition pour plan 00096
var planComp96 = project.items.addComp(
    "SQ04_UNDLM_00096_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp96.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer96 = planComp96.layers.add(bgSolidComp);
bgLayer96.name = "BG_SOLID";
bgLayer96.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer96 = false;
if (gradingSources[96]) {
    var gradedLayer96 = planComp96.layers.add(gradingSources[96]);
    gradedLayer96.name = "UNDLM_00096_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer96.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer96.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer96 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer96 = false;
if (editSources[96]) {
    var editLayer96 = planComp96.layers.add(editSources[96]);
    editLayer96.name = "UNDLM_00096_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer96.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer96.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer96 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity96 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer96) {
    // EDIT toujours activé quand disponible
    editLayer96.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer96) {
        gradedLayer96.enabled = false;
    }
} else if (hasGradedLayer96) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer96.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText96 = planComp96.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText96.name = "WARNING_NO_EDIT";
    warningText96.property("Transform").property("Position").setValue([1280, 200]);
    warningText96.guideLayer = true;
    
    var warningTextDoc96 = warningText96.property("Source Text").value;
    warningTextDoc96.fontSize = 32;
    warningTextDoc96.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc96.font = "Arial-BoldMT";
    warningTextDoc96.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText96.property("Source Text").setValue(warningTextDoc96);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText96 = planComp96.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00096");
    errorText96.name = "ERROR_NO_SOURCE";
    errorText96.property("Transform").property("Position").setValue([1280, 720]);
    errorText96.guideLayer = true;
    
    var errorTextDoc96 = errorText96.property("Source Text").value;
    errorTextDoc96.fontSize = 48;
    errorTextDoc96.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc96.font = "Arial-BoldMT";
    errorTextDoc96.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText96.property("Source Text").setValue(errorTextDoc96);
}

planCompositions[96] = planComp96;


// Composition pour plan 00097
var planComp97 = project.items.addComp(
    "SQ04_UNDLM_00097_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    15.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp97.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer97 = planComp97.layers.add(bgSolidComp);
bgLayer97.name = "BG_SOLID";
bgLayer97.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer97 = false;
if (gradingSources[97]) {
    var gradedLayer97 = planComp97.layers.add(gradingSources[97]);
    gradedLayer97.name = "UNDLM_00097_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer97.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer97.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer97 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer97 = false;
if (editSources[97]) {
    var editLayer97 = planComp97.layers.add(editSources[97]);
    editLayer97.name = "UNDLM_00097_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer97.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer97.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer97 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity97 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer97) {
    // EDIT toujours activé quand disponible
    editLayer97.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer97) {
        gradedLayer97.enabled = false;
    }
} else if (hasGradedLayer97) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer97.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText97 = planComp97.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText97.name = "WARNING_NO_EDIT";
    warningText97.property("Transform").property("Position").setValue([1280, 200]);
    warningText97.guideLayer = true;
    
    var warningTextDoc97 = warningText97.property("Source Text").value;
    warningTextDoc97.fontSize = 32;
    warningTextDoc97.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc97.font = "Arial-BoldMT";
    warningTextDoc97.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText97.property("Source Text").setValue(warningTextDoc97);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText97 = planComp97.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00097");
    errorText97.name = "ERROR_NO_SOURCE";
    errorText97.property("Transform").property("Position").setValue([1280, 720]);
    errorText97.guideLayer = true;
    
    var errorTextDoc97 = errorText97.property("Source Text").value;
    errorTextDoc97.fontSize = 48;
    errorTextDoc97.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc97.font = "Arial-BoldMT";
    errorTextDoc97.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText97.property("Source Text").setValue(errorTextDoc97);
}

planCompositions[97] = planComp97;


// Composition pour plan 00098
var planComp98 = project.items.addComp(
    "SQ04_UNDLM_00098_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp98.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer98 = planComp98.layers.add(bgSolidComp);
bgLayer98.name = "BG_SOLID";
bgLayer98.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer98 = false;
if (gradingSources[98]) {
    var gradedLayer98 = planComp98.layers.add(gradingSources[98]);
    gradedLayer98.name = "UNDLM_00098_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer98.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer98.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer98 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer98 = false;
if (editSources[98]) {
    var editLayer98 = planComp98.layers.add(editSources[98]);
    editLayer98.name = "UNDLM_00098_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer98.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer98.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer98 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity98 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer98) {
    // EDIT toujours activé quand disponible
    editLayer98.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer98) {
        gradedLayer98.enabled = false;
    }
} else if (hasGradedLayer98) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer98.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText98 = planComp98.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText98.name = "WARNING_NO_EDIT";
    warningText98.property("Transform").property("Position").setValue([1280, 200]);
    warningText98.guideLayer = true;
    
    var warningTextDoc98 = warningText98.property("Source Text").value;
    warningTextDoc98.fontSize = 32;
    warningTextDoc98.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc98.font = "Arial-BoldMT";
    warningTextDoc98.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText98.property("Source Text").setValue(warningTextDoc98);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText98 = planComp98.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00098");
    errorText98.name = "ERROR_NO_SOURCE";
    errorText98.property("Transform").property("Position").setValue([1280, 720]);
    errorText98.guideLayer = true;
    
    var errorTextDoc98 = errorText98.property("Source Text").value;
    errorTextDoc98.fontSize = 48;
    errorTextDoc98.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc98.font = "Arial-BoldMT";
    errorTextDoc98.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText98.property("Source Text").setValue(errorTextDoc98);
}

planCompositions[98] = planComp98;


// Composition pour plan 00099
var planComp99 = project.items.addComp(
    "SQ04_UNDLM_00099_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp99.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer99 = planComp99.layers.add(bgSolidComp);
bgLayer99.name = "BG_SOLID";
bgLayer99.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer99 = false;
if (gradingSources[99]) {
    var gradedLayer99 = planComp99.layers.add(gradingSources[99]);
    gradedLayer99.name = "UNDLM_00099_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer99.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer99.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer99 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer99 = false;
if (editSources[99]) {
    var editLayer99 = planComp99.layers.add(editSources[99]);
    editLayer99.name = "UNDLM_00099_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer99.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer99.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer99 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity99 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer99) {
    // EDIT toujours activé quand disponible
    editLayer99.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer99) {
        gradedLayer99.enabled = false;
    }
} else if (hasGradedLayer99) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer99.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText99 = planComp99.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText99.name = "WARNING_NO_EDIT";
    warningText99.property("Transform").property("Position").setValue([1280, 200]);
    warningText99.guideLayer = true;
    
    var warningTextDoc99 = warningText99.property("Source Text").value;
    warningTextDoc99.fontSize = 32;
    warningTextDoc99.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc99.font = "Arial-BoldMT";
    warningTextDoc99.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText99.property("Source Text").setValue(warningTextDoc99);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText99 = planComp99.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00099");
    errorText99.name = "ERROR_NO_SOURCE";
    errorText99.property("Transform").property("Position").setValue([1280, 720]);
    errorText99.guideLayer = true;
    
    var errorTextDoc99 = errorText99.property("Source Text").value;
    errorTextDoc99.fontSize = 48;
    errorTextDoc99.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc99.font = "Arial-BoldMT";
    errorTextDoc99.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText99.property("Source Text").setValue(errorTextDoc99);
}

planCompositions[99] = planComp99;


// Composition pour plan 00100
var planComp100 = project.items.addComp(
    "SQ04_UNDLM_00100_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp100.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer100 = planComp100.layers.add(bgSolidComp);
bgLayer100.name = "BG_SOLID";
bgLayer100.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer100 = false;
if (gradingSources[100]) {
    var gradedLayer100 = planComp100.layers.add(gradingSources[100]);
    gradedLayer100.name = "UNDLM_00100_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer100.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer100.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer100 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer100 = false;
if (editSources[100]) {
    var editLayer100 = planComp100.layers.add(editSources[100]);
    editLayer100.name = "UNDLM_00100_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer100.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer100.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer100 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity100 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer100) {
    // EDIT toujours activé quand disponible
    editLayer100.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer100) {
        gradedLayer100.enabled = false;
    }
} else if (hasGradedLayer100) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer100.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText100 = planComp100.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText100.name = "WARNING_NO_EDIT";
    warningText100.property("Transform").property("Position").setValue([1280, 200]);
    warningText100.guideLayer = true;
    
    var warningTextDoc100 = warningText100.property("Source Text").value;
    warningTextDoc100.fontSize = 32;
    warningTextDoc100.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc100.font = "Arial-BoldMT";
    warningTextDoc100.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText100.property("Source Text").setValue(warningTextDoc100);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText100 = planComp100.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00100");
    errorText100.name = "ERROR_NO_SOURCE";
    errorText100.property("Transform").property("Position").setValue([1280, 720]);
    errorText100.guideLayer = true;
    
    var errorTextDoc100 = errorText100.property("Source Text").value;
    errorTextDoc100.fontSize = 48;
    errorTextDoc100.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc100.font = "Arial-BoldMT";
    errorTextDoc100.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText100.property("Source Text").setValue(errorTextDoc100);
}

planCompositions[100] = planComp100;


// Composition pour plan 00101
var planComp101 = project.items.addComp(
    "SQ04_UNDLM_00101_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp101.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer101 = planComp101.layers.add(bgSolidComp);
bgLayer101.name = "BG_SOLID";
bgLayer101.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer101 = false;
if (gradingSources[101]) {
    var gradedLayer101 = planComp101.layers.add(gradingSources[101]);
    gradedLayer101.name = "UNDLM_00101_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer101.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer101.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer101 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer101 = false;
if (editSources[101]) {
    var editLayer101 = planComp101.layers.add(editSources[101]);
    editLayer101.name = "UNDLM_00101_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer101.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer101.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer101 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity101 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer101) {
    // EDIT toujours activé quand disponible
    editLayer101.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer101) {
        gradedLayer101.enabled = false;
    }
} else if (hasGradedLayer101) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer101.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText101 = planComp101.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText101.name = "WARNING_NO_EDIT";
    warningText101.property("Transform").property("Position").setValue([1280, 200]);
    warningText101.guideLayer = true;
    
    var warningTextDoc101 = warningText101.property("Source Text").value;
    warningTextDoc101.fontSize = 32;
    warningTextDoc101.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc101.font = "Arial-BoldMT";
    warningTextDoc101.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText101.property("Source Text").setValue(warningTextDoc101);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText101 = planComp101.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00101");
    errorText101.name = "ERROR_NO_SOURCE";
    errorText101.property("Transform").property("Position").setValue([1280, 720]);
    errorText101.guideLayer = true;
    
    var errorTextDoc101 = errorText101.property("Source Text").value;
    errorTextDoc101.fontSize = 48;
    errorTextDoc101.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc101.font = "Arial-BoldMT";
    errorTextDoc101.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText101.property("Source Text").setValue(errorTextDoc101);
}

planCompositions[101] = planComp101;


// Composition pour plan 00102
var planComp102 = project.items.addComp(
    "SQ04_UNDLM_00102_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp102.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer102 = planComp102.layers.add(bgSolidComp);
bgLayer102.name = "BG_SOLID";
bgLayer102.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer102 = false;
if (gradingSources[102]) {
    var gradedLayer102 = planComp102.layers.add(gradingSources[102]);
    gradedLayer102.name = "UNDLM_00102_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer102.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer102.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer102 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer102 = false;
if (editSources[102]) {
    var editLayer102 = planComp102.layers.add(editSources[102]);
    editLayer102.name = "UNDLM_00102_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer102.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer102.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer102 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity102 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer102) {
    // EDIT toujours activé quand disponible
    editLayer102.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer102) {
        gradedLayer102.enabled = false;
    }
} else if (hasGradedLayer102) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer102.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText102 = planComp102.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText102.name = "WARNING_NO_EDIT";
    warningText102.property("Transform").property("Position").setValue([1280, 200]);
    warningText102.guideLayer = true;
    
    var warningTextDoc102 = warningText102.property("Source Text").value;
    warningTextDoc102.fontSize = 32;
    warningTextDoc102.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc102.font = "Arial-BoldMT";
    warningTextDoc102.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText102.property("Source Text").setValue(warningTextDoc102);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText102 = planComp102.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00102");
    errorText102.name = "ERROR_NO_SOURCE";
    errorText102.property("Transform").property("Position").setValue([1280, 720]);
    errorText102.guideLayer = true;
    
    var errorTextDoc102 = errorText102.property("Source Text").value;
    errorTextDoc102.fontSize = 48;
    errorTextDoc102.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc102.font = "Arial-BoldMT";
    errorTextDoc102.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText102.property("Source Text").setValue(errorTextDoc102);
}

planCompositions[102] = planComp102;


// Composition pour plan 00103
var planComp103 = project.items.addComp(
    "SQ04_UNDLM_00103_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp103.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer103 = planComp103.layers.add(bgSolidComp);
bgLayer103.name = "BG_SOLID";
bgLayer103.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer103 = false;
if (gradingSources[103]) {
    var gradedLayer103 = planComp103.layers.add(gradingSources[103]);
    gradedLayer103.name = "UNDLM_00103_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer103.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer103.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer103 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer103 = false;
if (editSources[103]) {
    var editLayer103 = planComp103.layers.add(editSources[103]);
    editLayer103.name = "UNDLM_00103_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer103.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer103.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer103 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity103 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer103) {
    // EDIT toujours activé quand disponible
    editLayer103.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer103) {
        gradedLayer103.enabled = false;
    }
} else if (hasGradedLayer103) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer103.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText103 = planComp103.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText103.name = "WARNING_NO_EDIT";
    warningText103.property("Transform").property("Position").setValue([1280, 200]);
    warningText103.guideLayer = true;
    
    var warningTextDoc103 = warningText103.property("Source Text").value;
    warningTextDoc103.fontSize = 32;
    warningTextDoc103.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc103.font = "Arial-BoldMT";
    warningTextDoc103.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText103.property("Source Text").setValue(warningTextDoc103);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText103 = planComp103.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00103");
    errorText103.name = "ERROR_NO_SOURCE";
    errorText103.property("Transform").property("Position").setValue([1280, 720]);
    errorText103.guideLayer = true;
    
    var errorTextDoc103 = errorText103.property("Source Text").value;
    errorTextDoc103.fontSize = 48;
    errorTextDoc103.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc103.font = "Arial-BoldMT";
    errorTextDoc103.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText103.property("Source Text").setValue(errorTextDoc103);
}

planCompositions[103] = planComp103;


// Composition pour plan 00104
var planComp104 = project.items.addComp(
    "SQ04_UNDLM_00104_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp104.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer104 = planComp104.layers.add(bgSolidComp);
bgLayer104.name = "BG_SOLID";
bgLayer104.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer104 = false;
if (gradingSources[104]) {
    var gradedLayer104 = planComp104.layers.add(gradingSources[104]);
    gradedLayer104.name = "UNDLM_00104_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer104.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer104.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer104 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer104 = false;
if (editSources[104]) {
    var editLayer104 = planComp104.layers.add(editSources[104]);
    editLayer104.name = "UNDLM_00104_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer104.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer104.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer104 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity104 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer104) {
    // EDIT toujours activé quand disponible
    editLayer104.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer104) {
        gradedLayer104.enabled = false;
    }
} else if (hasGradedLayer104) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer104.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText104 = planComp104.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText104.name = "WARNING_NO_EDIT";
    warningText104.property("Transform").property("Position").setValue([1280, 200]);
    warningText104.guideLayer = true;
    
    var warningTextDoc104 = warningText104.property("Source Text").value;
    warningTextDoc104.fontSize = 32;
    warningTextDoc104.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc104.font = "Arial-BoldMT";
    warningTextDoc104.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText104.property("Source Text").setValue(warningTextDoc104);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText104 = planComp104.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00104");
    errorText104.name = "ERROR_NO_SOURCE";
    errorText104.property("Transform").property("Position").setValue([1280, 720]);
    errorText104.guideLayer = true;
    
    var errorTextDoc104 = errorText104.property("Source Text").value;
    errorTextDoc104.fontSize = 48;
    errorTextDoc104.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc104.font = "Arial-BoldMT";
    errorTextDoc104.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText104.property("Source Text").setValue(errorTextDoc104);
}

planCompositions[104] = planComp104;


// Composition pour plan 00105
var planComp105 = project.items.addComp(
    "SQ04_UNDLM_00105_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp105.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer105 = planComp105.layers.add(bgSolidComp);
bgLayer105.name = "BG_SOLID";
bgLayer105.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer105 = false;
if (gradingSources[105]) {
    var gradedLayer105 = planComp105.layers.add(gradingSources[105]);
    gradedLayer105.name = "UNDLM_00105_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer105.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer105.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer105 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer105 = false;
if (editSources[105]) {
    var editLayer105 = planComp105.layers.add(editSources[105]);
    editLayer105.name = "UNDLM_00105_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer105.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer105.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer105 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity105 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer105) {
    // EDIT toujours activé quand disponible
    editLayer105.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer105) {
        gradedLayer105.enabled = false;
    }
} else if (hasGradedLayer105) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer105.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText105 = planComp105.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText105.name = "WARNING_NO_EDIT";
    warningText105.property("Transform").property("Position").setValue([1280, 200]);
    warningText105.guideLayer = true;
    
    var warningTextDoc105 = warningText105.property("Source Text").value;
    warningTextDoc105.fontSize = 32;
    warningTextDoc105.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc105.font = "Arial-BoldMT";
    warningTextDoc105.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText105.property("Source Text").setValue(warningTextDoc105);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText105 = planComp105.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00105");
    errorText105.name = "ERROR_NO_SOURCE";
    errorText105.property("Transform").property("Position").setValue([1280, 720]);
    errorText105.guideLayer = true;
    
    var errorTextDoc105 = errorText105.property("Source Text").value;
    errorTextDoc105.fontSize = 48;
    errorTextDoc105.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc105.font = "Arial-BoldMT";
    errorTextDoc105.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText105.property("Source Text").setValue(errorTextDoc105);
}

planCompositions[105] = planComp105;


// Composition pour plan 00106
var planComp106 = project.items.addComp(
    "SQ04_UNDLM_00106_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp106.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer106 = planComp106.layers.add(bgSolidComp);
bgLayer106.name = "BG_SOLID";
bgLayer106.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer106 = false;
if (gradingSources[106]) {
    var gradedLayer106 = planComp106.layers.add(gradingSources[106]);
    gradedLayer106.name = "UNDLM_00106_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer106.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer106.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer106 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer106 = false;
if (editSources[106]) {
    var editLayer106 = planComp106.layers.add(editSources[106]);
    editLayer106.name = "UNDLM_00106_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer106.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer106.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer106 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity106 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer106) {
    // EDIT toujours activé quand disponible
    editLayer106.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer106) {
        gradedLayer106.enabled = false;
    }
} else if (hasGradedLayer106) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer106.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText106 = planComp106.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText106.name = "WARNING_NO_EDIT";
    warningText106.property("Transform").property("Position").setValue([1280, 200]);
    warningText106.guideLayer = true;
    
    var warningTextDoc106 = warningText106.property("Source Text").value;
    warningTextDoc106.fontSize = 32;
    warningTextDoc106.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc106.font = "Arial-BoldMT";
    warningTextDoc106.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText106.property("Source Text").setValue(warningTextDoc106);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText106 = planComp106.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00106");
    errorText106.name = "ERROR_NO_SOURCE";
    errorText106.property("Transform").property("Position").setValue([1280, 720]);
    errorText106.guideLayer = true;
    
    var errorTextDoc106 = errorText106.property("Source Text").value;
    errorTextDoc106.fontSize = 48;
    errorTextDoc106.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc106.font = "Arial-BoldMT";
    errorTextDoc106.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText106.property("Source Text").setValue(errorTextDoc106);
}

planCompositions[106] = planComp106;


// Composition pour plan 00107
var planComp107 = project.items.addComp(
    "SQ04_UNDLM_00107_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp107.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer107 = planComp107.layers.add(bgSolidComp);
bgLayer107.name = "BG_SOLID";
bgLayer107.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer107 = false;
if (gradingSources[107]) {
    var gradedLayer107 = planComp107.layers.add(gradingSources[107]);
    gradedLayer107.name = "UNDLM_00107_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer107.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer107.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer107 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer107 = false;
if (editSources[107]) {
    var editLayer107 = planComp107.layers.add(editSources[107]);
    editLayer107.name = "UNDLM_00107_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer107.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer107.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer107 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity107 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer107) {
    // EDIT toujours activé quand disponible
    editLayer107.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer107) {
        gradedLayer107.enabled = false;
    }
} else if (hasGradedLayer107) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer107.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText107 = planComp107.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText107.name = "WARNING_NO_EDIT";
    warningText107.property("Transform").property("Position").setValue([1280, 200]);
    warningText107.guideLayer = true;
    
    var warningTextDoc107 = warningText107.property("Source Text").value;
    warningTextDoc107.fontSize = 32;
    warningTextDoc107.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc107.font = "Arial-BoldMT";
    warningTextDoc107.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText107.property("Source Text").setValue(warningTextDoc107);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText107 = planComp107.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00107");
    errorText107.name = "ERROR_NO_SOURCE";
    errorText107.property("Transform").property("Position").setValue([1280, 720]);
    errorText107.guideLayer = true;
    
    var errorTextDoc107 = errorText107.property("Source Text").value;
    errorTextDoc107.fontSize = 48;
    errorTextDoc107.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc107.font = "Arial-BoldMT";
    errorTextDoc107.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText107.property("Source Text").setValue(errorTextDoc107);
}

planCompositions[107] = planComp107;


// Composition pour plan 00108
var planComp108 = project.items.addComp(
    "SQ04_UNDLM_00108_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp108.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer108 = planComp108.layers.add(bgSolidComp);
bgLayer108.name = "BG_SOLID";
bgLayer108.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer108 = false;
if (gradingSources[108]) {
    var gradedLayer108 = planComp108.layers.add(gradingSources[108]);
    gradedLayer108.name = "UNDLM_00108_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer108.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer108.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer108 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer108 = false;
if (editSources[108]) {
    var editLayer108 = planComp108.layers.add(editSources[108]);
    editLayer108.name = "UNDLM_00108_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer108.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer108.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer108 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity108 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer108) {
    // EDIT toujours activé quand disponible
    editLayer108.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer108) {
        gradedLayer108.enabled = false;
    }
} else if (hasGradedLayer108) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer108.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText108 = planComp108.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText108.name = "WARNING_NO_EDIT";
    warningText108.property("Transform").property("Position").setValue([1280, 200]);
    warningText108.guideLayer = true;
    
    var warningTextDoc108 = warningText108.property("Source Text").value;
    warningTextDoc108.fontSize = 32;
    warningTextDoc108.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc108.font = "Arial-BoldMT";
    warningTextDoc108.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText108.property("Source Text").setValue(warningTextDoc108);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText108 = planComp108.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00108");
    errorText108.name = "ERROR_NO_SOURCE";
    errorText108.property("Transform").property("Position").setValue([1280, 720]);
    errorText108.guideLayer = true;
    
    var errorTextDoc108 = errorText108.property("Source Text").value;
    errorTextDoc108.fontSize = 48;
    errorTextDoc108.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc108.font = "Arial-BoldMT";
    errorTextDoc108.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText108.property("Source Text").setValue(errorTextDoc108);
}

planCompositions[108] = planComp108;


// Composition pour plan 00109
var planComp109 = project.items.addComp(
    "SQ04_UNDLM_00109_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp109.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer109 = planComp109.layers.add(bgSolidComp);
bgLayer109.name = "BG_SOLID";
bgLayer109.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer109 = false;
if (gradingSources[109]) {
    var gradedLayer109 = planComp109.layers.add(gradingSources[109]);
    gradedLayer109.name = "UNDLM_00109_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer109.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer109.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer109 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer109 = false;
if (editSources[109]) {
    var editLayer109 = planComp109.layers.add(editSources[109]);
    editLayer109.name = "UNDLM_00109_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer109.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer109.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer109 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity109 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer109) {
    // EDIT toujours activé quand disponible
    editLayer109.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer109) {
        gradedLayer109.enabled = false;
    }
} else if (hasGradedLayer109) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer109.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText109 = planComp109.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText109.name = "WARNING_NO_EDIT";
    warningText109.property("Transform").property("Position").setValue([1280, 200]);
    warningText109.guideLayer = true;
    
    var warningTextDoc109 = warningText109.property("Source Text").value;
    warningTextDoc109.fontSize = 32;
    warningTextDoc109.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc109.font = "Arial-BoldMT";
    warningTextDoc109.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText109.property("Source Text").setValue(warningTextDoc109);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText109 = planComp109.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00109");
    errorText109.name = "ERROR_NO_SOURCE";
    errorText109.property("Transform").property("Position").setValue([1280, 720]);
    errorText109.guideLayer = true;
    
    var errorTextDoc109 = errorText109.property("Source Text").value;
    errorTextDoc109.fontSize = 48;
    errorTextDoc109.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc109.font = "Arial-BoldMT";
    errorTextDoc109.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText109.property("Source Text").setValue(errorTextDoc109);
}

planCompositions[109] = planComp109;


// Composition pour plan 00110
var planComp110 = project.items.addComp(
    "SQ04_UNDLM_00110_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp110.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer110 = planComp110.layers.add(bgSolidComp);
bgLayer110.name = "BG_SOLID";
bgLayer110.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer110 = false;
if (gradingSources[110]) {
    var gradedLayer110 = planComp110.layers.add(gradingSources[110]);
    gradedLayer110.name = "UNDLM_00110_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer110.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer110.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer110 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer110 = false;
if (editSources[110]) {
    var editLayer110 = planComp110.layers.add(editSources[110]);
    editLayer110.name = "UNDLM_00110_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer110.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer110.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer110 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity110 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer110) {
    // EDIT toujours activé quand disponible
    editLayer110.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer110) {
        gradedLayer110.enabled = false;
    }
} else if (hasGradedLayer110) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer110.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText110 = planComp110.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText110.name = "WARNING_NO_EDIT";
    warningText110.property("Transform").property("Position").setValue([1280, 200]);
    warningText110.guideLayer = true;
    
    var warningTextDoc110 = warningText110.property("Source Text").value;
    warningTextDoc110.fontSize = 32;
    warningTextDoc110.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc110.font = "Arial-BoldMT";
    warningTextDoc110.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText110.property("Source Text").setValue(warningTextDoc110);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText110 = planComp110.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00110");
    errorText110.name = "ERROR_NO_SOURCE";
    errorText110.property("Transform").property("Position").setValue([1280, 720]);
    errorText110.guideLayer = true;
    
    var errorTextDoc110 = errorText110.property("Source Text").value;
    errorTextDoc110.fontSize = 48;
    errorTextDoc110.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc110.font = "Arial-BoldMT";
    errorTextDoc110.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText110.property("Source Text").setValue(errorTextDoc110);
}

planCompositions[110] = planComp110;


// Composition pour plan 00111
var planComp111 = project.items.addComp(
    "SQ04_UNDLM_00111_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp111.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer111 = planComp111.layers.add(bgSolidComp);
bgLayer111.name = "BG_SOLID";
bgLayer111.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer111 = false;
if (gradingSources[111]) {
    var gradedLayer111 = planComp111.layers.add(gradingSources[111]);
    gradedLayer111.name = "UNDLM_00111_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer111.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer111.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer111 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer111 = false;
if (editSources[111]) {
    var editLayer111 = planComp111.layers.add(editSources[111]);
    editLayer111.name = "UNDLM_00111_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer111.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer111.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer111 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity111 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer111) {
    // EDIT toujours activé quand disponible
    editLayer111.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer111) {
        gradedLayer111.enabled = false;
    }
} else if (hasGradedLayer111) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer111.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText111 = planComp111.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText111.name = "WARNING_NO_EDIT";
    warningText111.property("Transform").property("Position").setValue([1280, 200]);
    warningText111.guideLayer = true;
    
    var warningTextDoc111 = warningText111.property("Source Text").value;
    warningTextDoc111.fontSize = 32;
    warningTextDoc111.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc111.font = "Arial-BoldMT";
    warningTextDoc111.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText111.property("Source Text").setValue(warningTextDoc111);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText111 = planComp111.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00111");
    errorText111.name = "ERROR_NO_SOURCE";
    errorText111.property("Transform").property("Position").setValue([1280, 720]);
    errorText111.guideLayer = true;
    
    var errorTextDoc111 = errorText111.property("Source Text").value;
    errorTextDoc111.fontSize = 48;
    errorTextDoc111.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc111.font = "Arial-BoldMT";
    errorTextDoc111.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText111.property("Source Text").setValue(errorTextDoc111);
}

planCompositions[111] = planComp111;


// Composition pour plan 00112
var planComp112 = project.items.addComp(
    "SQ04_UNDLM_00112_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp112.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer112 = planComp112.layers.add(bgSolidComp);
bgLayer112.name = "BG_SOLID";
bgLayer112.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer112 = false;
if (gradingSources[112]) {
    var gradedLayer112 = planComp112.layers.add(gradingSources[112]);
    gradedLayer112.name = "UNDLM_00112_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer112.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer112.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer112 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer112 = false;
if (editSources[112]) {
    var editLayer112 = planComp112.layers.add(editSources[112]);
    editLayer112.name = "UNDLM_00112_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer112.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer112.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer112 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity112 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer112) {
    // EDIT toujours activé quand disponible
    editLayer112.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer112) {
        gradedLayer112.enabled = false;
    }
} else if (hasGradedLayer112) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer112.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText112 = planComp112.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText112.name = "WARNING_NO_EDIT";
    warningText112.property("Transform").property("Position").setValue([1280, 200]);
    warningText112.guideLayer = true;
    
    var warningTextDoc112 = warningText112.property("Source Text").value;
    warningTextDoc112.fontSize = 32;
    warningTextDoc112.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc112.font = "Arial-BoldMT";
    warningTextDoc112.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText112.property("Source Text").setValue(warningTextDoc112);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText112 = planComp112.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00112");
    errorText112.name = "ERROR_NO_SOURCE";
    errorText112.property("Transform").property("Position").setValue([1280, 720]);
    errorText112.guideLayer = true;
    
    var errorTextDoc112 = errorText112.property("Source Text").value;
    errorTextDoc112.fontSize = 48;
    errorTextDoc112.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc112.font = "Arial-BoldMT";
    errorTextDoc112.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText112.property("Source Text").setValue(errorTextDoc112);
}

planCompositions[112] = planComp112;


// Composition pour plan 00113
var planComp113 = project.items.addComp(
    "SQ04_UNDLM_00113_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp113.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer113 = planComp113.layers.add(bgSolidComp);
bgLayer113.name = "BG_SOLID";
bgLayer113.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer113 = false;
if (gradingSources[113]) {
    var gradedLayer113 = planComp113.layers.add(gradingSources[113]);
    gradedLayer113.name = "UNDLM_00113_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer113.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer113.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer113 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer113 = false;
if (editSources[113]) {
    var editLayer113 = planComp113.layers.add(editSources[113]);
    editLayer113.name = "UNDLM_00113_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer113.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer113.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer113 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity113 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer113) {
    // EDIT toujours activé quand disponible
    editLayer113.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer113) {
        gradedLayer113.enabled = false;
    }
} else if (hasGradedLayer113) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer113.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText113 = planComp113.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText113.name = "WARNING_NO_EDIT";
    warningText113.property("Transform").property("Position").setValue([1280, 200]);
    warningText113.guideLayer = true;
    
    var warningTextDoc113 = warningText113.property("Source Text").value;
    warningTextDoc113.fontSize = 32;
    warningTextDoc113.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc113.font = "Arial-BoldMT";
    warningTextDoc113.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText113.property("Source Text").setValue(warningTextDoc113);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText113 = planComp113.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00113");
    errorText113.name = "ERROR_NO_SOURCE";
    errorText113.property("Transform").property("Position").setValue([1280, 720]);
    errorText113.guideLayer = true;
    
    var errorTextDoc113 = errorText113.property("Source Text").value;
    errorTextDoc113.fontSize = 48;
    errorTextDoc113.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc113.font = "Arial-BoldMT";
    errorTextDoc113.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText113.property("Source Text").setValue(errorTextDoc113);
}

planCompositions[113] = planComp113;


// Composition pour plan 00114
var planComp114 = project.items.addComp(
    "SQ04_UNDLM_00114_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp114.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer114 = planComp114.layers.add(bgSolidComp);
bgLayer114.name = "BG_SOLID";
bgLayer114.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer114 = false;
if (gradingSources[114]) {
    var gradedLayer114 = planComp114.layers.add(gradingSources[114]);
    gradedLayer114.name = "UNDLM_00114_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer114.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer114.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer114 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer114 = false;
if (editSources[114]) {
    var editLayer114 = planComp114.layers.add(editSources[114]);
    editLayer114.name = "UNDLM_00114_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer114.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer114.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer114 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity114 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer114) {
    // EDIT toujours activé quand disponible
    editLayer114.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer114) {
        gradedLayer114.enabled = false;
    }
} else if (hasGradedLayer114) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer114.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText114 = planComp114.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText114.name = "WARNING_NO_EDIT";
    warningText114.property("Transform").property("Position").setValue([1280, 200]);
    warningText114.guideLayer = true;
    
    var warningTextDoc114 = warningText114.property("Source Text").value;
    warningTextDoc114.fontSize = 32;
    warningTextDoc114.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc114.font = "Arial-BoldMT";
    warningTextDoc114.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText114.property("Source Text").setValue(warningTextDoc114);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText114 = planComp114.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00114");
    errorText114.name = "ERROR_NO_SOURCE";
    errorText114.property("Transform").property("Position").setValue([1280, 720]);
    errorText114.guideLayer = true;
    
    var errorTextDoc114 = errorText114.property("Source Text").value;
    errorTextDoc114.fontSize = 48;
    errorTextDoc114.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc114.font = "Arial-BoldMT";
    errorTextDoc114.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText114.property("Source Text").setValue(errorTextDoc114);
}

planCompositions[114] = planComp114;


// Composition pour plan 00115
var planComp115 = project.items.addComp(
    "SQ04_UNDLM_00115_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp115.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer115 = planComp115.layers.add(bgSolidComp);
bgLayer115.name = "BG_SOLID";
bgLayer115.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer115 = false;
if (gradingSources[115]) {
    var gradedLayer115 = planComp115.layers.add(gradingSources[115]);
    gradedLayer115.name = "UNDLM_00115_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer115.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer115.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer115 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer115 = false;
if (editSources[115]) {
    var editLayer115 = planComp115.layers.add(editSources[115]);
    editLayer115.name = "UNDLM_00115_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer115.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer115.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer115 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity115 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer115) {
    // EDIT toujours activé quand disponible
    editLayer115.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer115) {
        gradedLayer115.enabled = false;
    }
} else if (hasGradedLayer115) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer115.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText115 = planComp115.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText115.name = "WARNING_NO_EDIT";
    warningText115.property("Transform").property("Position").setValue([1280, 200]);
    warningText115.guideLayer = true;
    
    var warningTextDoc115 = warningText115.property("Source Text").value;
    warningTextDoc115.fontSize = 32;
    warningTextDoc115.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc115.font = "Arial-BoldMT";
    warningTextDoc115.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText115.property("Source Text").setValue(warningTextDoc115);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText115 = planComp115.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00115");
    errorText115.name = "ERROR_NO_SOURCE";
    errorText115.property("Transform").property("Position").setValue([1280, 720]);
    errorText115.guideLayer = true;
    
    var errorTextDoc115 = errorText115.property("Source Text").value;
    errorTextDoc115.fontSize = 48;
    errorTextDoc115.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc115.font = "Arial-BoldMT";
    errorTextDoc115.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText115.property("Source Text").setValue(errorTextDoc115);
}

planCompositions[115] = planComp115;


// Composition pour plan 00116
var planComp116 = project.items.addComp(
    "SQ04_UNDLM_00116_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp116.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer116 = planComp116.layers.add(bgSolidComp);
bgLayer116.name = "BG_SOLID";
bgLayer116.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer116 = false;
if (gradingSources[116]) {
    var gradedLayer116 = planComp116.layers.add(gradingSources[116]);
    gradedLayer116.name = "UNDLM_00116_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer116.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer116.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer116 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer116 = false;
if (editSources[116]) {
    var editLayer116 = planComp116.layers.add(editSources[116]);
    editLayer116.name = "UNDLM_00116_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer116.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer116.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer116 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity116 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer116) {
    // EDIT toujours activé quand disponible
    editLayer116.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer116) {
        gradedLayer116.enabled = false;
    }
} else if (hasGradedLayer116) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer116.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText116 = planComp116.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText116.name = "WARNING_NO_EDIT";
    warningText116.property("Transform").property("Position").setValue([1280, 200]);
    warningText116.guideLayer = true;
    
    var warningTextDoc116 = warningText116.property("Source Text").value;
    warningTextDoc116.fontSize = 32;
    warningTextDoc116.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc116.font = "Arial-BoldMT";
    warningTextDoc116.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText116.property("Source Text").setValue(warningTextDoc116);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText116 = planComp116.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00116");
    errorText116.name = "ERROR_NO_SOURCE";
    errorText116.property("Transform").property("Position").setValue([1280, 720]);
    errorText116.guideLayer = true;
    
    var errorTextDoc116 = errorText116.property("Source Text").value;
    errorTextDoc116.fontSize = 48;
    errorTextDoc116.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc116.font = "Arial-BoldMT";
    errorTextDoc116.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText116.property("Source Text").setValue(errorTextDoc116);
}

planCompositions[116] = planComp116;


// Composition pour plan 00117
var planComp117 = project.items.addComp(
    "SQ04_UNDLM_00117_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp117.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer117 = planComp117.layers.add(bgSolidComp);
bgLayer117.name = "BG_SOLID";
bgLayer117.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer117 = false;
if (gradingSources[117]) {
    var gradedLayer117 = planComp117.layers.add(gradingSources[117]);
    gradedLayer117.name = "UNDLM_00117_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer117.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer117.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer117 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer117 = false;
if (editSources[117]) {
    var editLayer117 = planComp117.layers.add(editSources[117]);
    editLayer117.name = "UNDLM_00117_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer117.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer117.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer117 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity117 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer117) {
    // EDIT toujours activé quand disponible
    editLayer117.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer117) {
        gradedLayer117.enabled = false;
    }
} else if (hasGradedLayer117) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer117.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText117 = planComp117.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText117.name = "WARNING_NO_EDIT";
    warningText117.property("Transform").property("Position").setValue([1280, 200]);
    warningText117.guideLayer = true;
    
    var warningTextDoc117 = warningText117.property("Source Text").value;
    warningTextDoc117.fontSize = 32;
    warningTextDoc117.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc117.font = "Arial-BoldMT";
    warningTextDoc117.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText117.property("Source Text").setValue(warningTextDoc117);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText117 = planComp117.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00117");
    errorText117.name = "ERROR_NO_SOURCE";
    errorText117.property("Transform").property("Position").setValue([1280, 720]);
    errorText117.guideLayer = true;
    
    var errorTextDoc117 = errorText117.property("Source Text").value;
    errorTextDoc117.fontSize = 48;
    errorTextDoc117.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc117.font = "Arial-BoldMT";
    errorTextDoc117.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText117.property("Source Text").setValue(errorTextDoc117);
}

planCompositions[117] = planComp117;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ04_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    116.11999999999999, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00094 à la timeline master
if (planCompositions[94]) {
    var masterLayer94 = masterComp.layers.add(planCompositions[94]);
    masterLayer94.startTime = 0;
    masterLayer94.name = "UNDLM_00094";
    masterLayer94.label = 1; // Couleurs alternées
}

// Ajouter plan 00095 à la timeline master
if (planCompositions[95]) {
    var masterLayer95 = masterComp.layers.add(planCompositions[95]);
    masterLayer95.startTime = 3.84;
    masterLayer95.name = "UNDLM_00095";
    masterLayer95.label = 2; // Couleurs alternées
}

// Ajouter plan 00096 à la timeline master
if (planCompositions[96]) {
    var masterLayer96 = masterComp.layers.add(planCompositions[96]);
    masterLayer96.startTime = 7.199999999999999;
    masterLayer96.name = "UNDLM_00096";
    masterLayer96.label = 3; // Couleurs alternées
}

// Ajouter plan 00097 à la timeline master
if (planCompositions[97]) {
    var masterLayer97 = masterComp.layers.add(planCompositions[97]);
    masterLayer97.startTime = 10.44;
    masterLayer97.name = "UNDLM_00097";
    masterLayer97.label = 4; // Couleurs alternées
}

// Ajouter plan 00098 à la timeline master
if (planCompositions[98]) {
    var masterLayer98 = masterComp.layers.add(planCompositions[98]);
    masterLayer98.startTime = 25.64;
    masterLayer98.name = "UNDLM_00098";
    masterLayer98.label = 5; // Couleurs alternées
}

// Ajouter plan 00099 à la timeline master
if (planCompositions[99]) {
    var masterLayer99 = masterComp.layers.add(planCompositions[99]);
    masterLayer99.startTime = 30.12;
    masterLayer99.name = "UNDLM_00099";
    masterLayer99.label = 6; // Couleurs alternées
}

// Ajouter plan 00100 à la timeline master
if (planCompositions[100]) {
    var masterLayer100 = masterComp.layers.add(planCompositions[100]);
    masterLayer100.startTime = 34.52;
    masterLayer100.name = "UNDLM_00100";
    masterLayer100.label = 7; // Couleurs alternées
}

// Ajouter plan 00101 à la timeline master
if (planCompositions[101]) {
    var masterLayer101 = masterComp.layers.add(planCompositions[101]);
    masterLayer101.startTime = 37.92;
    masterLayer101.name = "UNDLM_00101";
    masterLayer101.label = 8; // Couleurs alternées
}

// Ajouter plan 00102 à la timeline master
if (planCompositions[102]) {
    var masterLayer102 = masterComp.layers.add(planCompositions[102]);
    masterLayer102.startTime = 45.2;
    masterLayer102.name = "UNDLM_00102";
    masterLayer102.label = 9; // Couleurs alternées
}

// Ajouter plan 00103 à la timeline master
if (planCompositions[103]) {
    var masterLayer103 = masterComp.layers.add(planCompositions[103]);
    masterLayer103.startTime = 49.0;
    masterLayer103.name = "UNDLM_00103";
    masterLayer103.label = 10; // Couleurs alternées
}

// Ajouter plan 00104 à la timeline master
if (planCompositions[104]) {
    var masterLayer104 = masterComp.layers.add(planCompositions[104]);
    masterLayer104.startTime = 55.2;
    masterLayer104.name = "UNDLM_00104";
    masterLayer104.label = 11; // Couleurs alternées
}

// Ajouter plan 00105 à la timeline master
if (planCompositions[105]) {
    var masterLayer105 = masterComp.layers.add(planCompositions[105]);
    masterLayer105.startTime = 61.72;
    masterLayer105.name = "UNDLM_00105";
    masterLayer105.label = 12; // Couleurs alternées
}

// Ajouter plan 00106 à la timeline master
if (planCompositions[106]) {
    var masterLayer106 = masterComp.layers.add(planCompositions[106]);
    masterLayer106.startTime = 66.88;
    masterLayer106.name = "UNDLM_00106";
    masterLayer106.label = 13; // Couleurs alternées
}

// Ajouter plan 00107 à la timeline master
if (planCompositions[107]) {
    var masterLayer107 = masterComp.layers.add(planCompositions[107]);
    masterLayer107.startTime = 74.6;
    masterLayer107.name = "UNDLM_00107";
    masterLayer107.label = 14; // Couleurs alternées
}

// Ajouter plan 00108 à la timeline master
if (planCompositions[108]) {
    var masterLayer108 = masterComp.layers.add(planCompositions[108]);
    masterLayer108.startTime = 78.19999999999999;
    masterLayer108.name = "UNDLM_00108";
    masterLayer108.label = 15; // Couleurs alternées
}

// Ajouter plan 00109 à la timeline master
if (planCompositions[109]) {
    var masterLayer109 = masterComp.layers.add(planCompositions[109]);
    masterLayer109.startTime = 82.27999999999999;
    masterLayer109.name = "UNDLM_00109";
    masterLayer109.label = 16; // Couleurs alternées
}

// Ajouter plan 00110 à la timeline master
if (planCompositions[110]) {
    var masterLayer110 = masterComp.layers.add(planCompositions[110]);
    masterLayer110.startTime = 84.27999999999999;
    masterLayer110.name = "UNDLM_00110";
    masterLayer110.label = 1; // Couleurs alternées
}

// Ajouter plan 00111 à la timeline master
if (planCompositions[111]) {
    var masterLayer111 = masterComp.layers.add(planCompositions[111]);
    masterLayer111.startTime = 86.87999999999998;
    masterLayer111.name = "UNDLM_00111";
    masterLayer111.label = 2; // Couleurs alternées
}

// Ajouter plan 00112 à la timeline master
if (planCompositions[112]) {
    var masterLayer112 = masterComp.layers.add(planCompositions[112]);
    masterLayer112.startTime = 91.23999999999998;
    masterLayer112.name = "UNDLM_00112";
    masterLayer112.label = 3; // Couleurs alternées
}

// Ajouter plan 00113 à la timeline master
if (planCompositions[113]) {
    var masterLayer113 = masterComp.layers.add(planCompositions[113]);
    masterLayer113.startTime = 97.39999999999998;
    masterLayer113.name = "UNDLM_00113";
    masterLayer113.label = 4; // Couleurs alternées
}

// Ajouter plan 00114 à la timeline master
if (planCompositions[114]) {
    var masterLayer114 = masterComp.layers.add(planCompositions[114]);
    masterLayer114.startTime = 101.67999999999998;
    masterLayer114.name = "UNDLM_00114";
    masterLayer114.label = 5; // Couleurs alternées
}

// Ajouter plan 00115 à la timeline master
if (planCompositions[115]) {
    var masterLayer115 = masterComp.layers.add(planCompositions[115]);
    masterLayer115.startTime = 104.51999999999998;
    masterLayer115.name = "UNDLM_00115";
    masterLayer115.label = 6; // Couleurs alternées
}

// Ajouter plan 00116 à la timeline master
if (planCompositions[116]) {
    var masterLayer116 = masterComp.layers.add(planCompositions[116]);
    masterLayer116.startTime = 108.71999999999998;
    masterLayer116.name = "UNDLM_00116";
    masterLayer116.label = 7; // Couleurs alternées
}

// Ajouter plan 00117 à la timeline master
if (planCompositions[117]) {
    var masterLayer117 = masterComp.layers.add(planCompositions[117]);
    masterLayer117.startTime = 112.71999999999998;
    masterLayer117.name = "UNDLM_00117";
    masterLayer117.label = 8; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ04";\n' +
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
    {start: 0, end: 3.84, name: "UNDLM_00094"},
    {start: 3.84, end: 7.199999999999999, name: "UNDLM_00095"},
    {start: 7.199999999999999, end: 10.44, name: "UNDLM_00096"},
    {start: 10.44, end: 25.64, name: "UNDLM_00097"},
    {start: 25.64, end: 30.12, name: "UNDLM_00098"},
    {start: 30.12, end: 34.52, name: "UNDLM_00099"},
    {start: 34.52, end: 37.92, name: "UNDLM_00100"},
    {start: 37.92, end: 45.2, name: "UNDLM_00101"},
    {start: 45.2, end: 49.0, name: "UNDLM_00102"},
    {start: 49.0, end: 55.2, name: "UNDLM_00103"},
    {start: 55.2, end: 61.72, name: "UNDLM_00104"},
    {start: 61.72, end: 66.88, name: "UNDLM_00105"},
    {start: 66.88, end: 74.6, name: "UNDLM_00106"},
    {start: 74.6, end: 78.19999999999999, name: "UNDLM_00107"},
    {start: 78.19999999999999, end: 82.27999999999999, name: "UNDLM_00108"},
    {start: 82.27999999999999, end: 84.27999999999999, name: "UNDLM_00109"},
    {start: 84.27999999999999, end: 86.87999999999998, name: "UNDLM_00110"},
    {start: 86.87999999999998, end: 91.23999999999998, name: "UNDLM_00111"},
    {start: 91.23999999999998, end: 97.39999999999998, name: "UNDLM_00112"},
    {start: 97.39999999999998, end: 101.67999999999998, name: "UNDLM_00113"},
    {start: 101.67999999999998, end: 104.51999999999998, name: "UNDLM_00114"},
    {start: 104.51999999999998, end: 108.71999999999998, name: "UNDLM_00115"},
    {start: 108.71999999999998, end: 112.71999999999998, name: "UNDLM_00116"},
    {start: 112.71999999999998, end: 116.11999999999999, name: "UNDLM_00117"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ04/_AE/SQ04_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 24;
var totalCount = 24;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ04 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(116.11999999999999 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ04_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ04:" + totalCount + ":" + gradedCount);
