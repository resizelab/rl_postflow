
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ27 avec 27 plans
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


// Import plan EDIT 00479
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile479 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00479.mov");
var editFilePoignees479 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00479_AVEC_POIGNEES.mov");
var editFileBis479 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00479bis.mov");

var importSuccess479 = false;
var fileName479 = "";

// Tenter import standard
if (editFile479.exists) {
    try {
        var editFootage479 = project.importFile(new ImportOptions(editFile479));
        editFootage479.parentFolder = fromEditFolder;
        editFootage479.name = "UNDLM_00479";
        editSources[479] = editFootage479;
        editImportCount++;
        importSuccess479 = true;
        fileName479 = "UNDLM_00479.mov";
        logImportSuccess(479, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00479.mov", fileName479);
    } catch (e) {
        logImportError(479, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00479.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess479 && editFilePoignees479.exists) {
    try {
        var editFootage479 = project.importFile(new ImportOptions(editFilePoignees479));
        editFootage479.parentFolder = fromEditFolder;
        editFootage479.name = "UNDLM_00479_AVEC_POIGNEES";
        editSources[479] = editFootage479;
        editImportCount++;
        importSuccess479 = true;
        fileName479 = "UNDLM_00479_AVEC_POIGNEES.mov";
        logImportSuccess(479, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00479_AVEC_POIGNEES.mov", fileName479);
    } catch (e) {
        logImportError(479, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00479_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess479 && editFileBis479.exists) {
    try {
        var editFootage479 = project.importFile(new ImportOptions(editFileBis479));
        editFootage479.parentFolder = fromEditFolder;
        editFootage479.name = "UNDLM_00479bis";
        editSources[479] = editFootage479;
        editImportCount++;
        importSuccess479 = true;
        fileName479 = "UNDLM_00479bis.mov";
        logImportSuccess(479, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00479bis.mov", fileName479);
    } catch (e) {
        logImportError(479, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00479bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess479) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00479.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00480
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile480 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00480.mov");
var editFilePoignees480 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00480_AVEC_POIGNEES.mov");
var editFileBis480 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00480bis.mov");

var importSuccess480 = false;
var fileName480 = "";

// Tenter import standard
if (editFile480.exists) {
    try {
        var editFootage480 = project.importFile(new ImportOptions(editFile480));
        editFootage480.parentFolder = fromEditFolder;
        editFootage480.name = "UNDLM_00480";
        editSources[480] = editFootage480;
        editImportCount++;
        importSuccess480 = true;
        fileName480 = "UNDLM_00480.mov";
        logImportSuccess(480, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00480.mov", fileName480);
    } catch (e) {
        logImportError(480, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00480.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess480 && editFilePoignees480.exists) {
    try {
        var editFootage480 = project.importFile(new ImportOptions(editFilePoignees480));
        editFootage480.parentFolder = fromEditFolder;
        editFootage480.name = "UNDLM_00480_AVEC_POIGNEES";
        editSources[480] = editFootage480;
        editImportCount++;
        importSuccess480 = true;
        fileName480 = "UNDLM_00480_AVEC_POIGNEES.mov";
        logImportSuccess(480, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00480_AVEC_POIGNEES.mov", fileName480);
    } catch (e) {
        logImportError(480, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00480_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess480 && editFileBis480.exists) {
    try {
        var editFootage480 = project.importFile(new ImportOptions(editFileBis480));
        editFootage480.parentFolder = fromEditFolder;
        editFootage480.name = "UNDLM_00480bis";
        editSources[480] = editFootage480;
        editImportCount++;
        importSuccess480 = true;
        fileName480 = "UNDLM_00480bis.mov";
        logImportSuccess(480, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00480bis.mov", fileName480);
    } catch (e) {
        logImportError(480, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00480bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess480) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00480.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00481
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile481 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00481.mov");
var editFilePoignees481 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00481_AVEC_POIGNEES.mov");
var editFileBis481 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00481bis.mov");

var importSuccess481 = false;
var fileName481 = "";

// Tenter import standard
if (editFile481.exists) {
    try {
        var editFootage481 = project.importFile(new ImportOptions(editFile481));
        editFootage481.parentFolder = fromEditFolder;
        editFootage481.name = "UNDLM_00481";
        editSources[481] = editFootage481;
        editImportCount++;
        importSuccess481 = true;
        fileName481 = "UNDLM_00481.mov";
        logImportSuccess(481, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00481.mov", fileName481);
    } catch (e) {
        logImportError(481, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00481.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess481 && editFilePoignees481.exists) {
    try {
        var editFootage481 = project.importFile(new ImportOptions(editFilePoignees481));
        editFootage481.parentFolder = fromEditFolder;
        editFootage481.name = "UNDLM_00481_AVEC_POIGNEES";
        editSources[481] = editFootage481;
        editImportCount++;
        importSuccess481 = true;
        fileName481 = "UNDLM_00481_AVEC_POIGNEES.mov";
        logImportSuccess(481, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00481_AVEC_POIGNEES.mov", fileName481);
    } catch (e) {
        logImportError(481, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00481_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess481 && editFileBis481.exists) {
    try {
        var editFootage481 = project.importFile(new ImportOptions(editFileBis481));
        editFootage481.parentFolder = fromEditFolder;
        editFootage481.name = "UNDLM_00481bis";
        editSources[481] = editFootage481;
        editImportCount++;
        importSuccess481 = true;
        fileName481 = "UNDLM_00481bis.mov";
        logImportSuccess(481, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00481bis.mov", fileName481);
    } catch (e) {
        logImportError(481, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00481bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess481) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00481.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00482
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile482 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00482.mov");
var editFilePoignees482 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00482_AVEC_POIGNEES.mov");
var editFileBis482 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00482bis.mov");

var importSuccess482 = false;
var fileName482 = "";

// Tenter import standard
if (editFile482.exists) {
    try {
        var editFootage482 = project.importFile(new ImportOptions(editFile482));
        editFootage482.parentFolder = fromEditFolder;
        editFootage482.name = "UNDLM_00482";
        editSources[482] = editFootage482;
        editImportCount++;
        importSuccess482 = true;
        fileName482 = "UNDLM_00482.mov";
        logImportSuccess(482, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00482.mov", fileName482);
    } catch (e) {
        logImportError(482, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00482.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess482 && editFilePoignees482.exists) {
    try {
        var editFootage482 = project.importFile(new ImportOptions(editFilePoignees482));
        editFootage482.parentFolder = fromEditFolder;
        editFootage482.name = "UNDLM_00482_AVEC_POIGNEES";
        editSources[482] = editFootage482;
        editImportCount++;
        importSuccess482 = true;
        fileName482 = "UNDLM_00482_AVEC_POIGNEES.mov";
        logImportSuccess(482, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00482_AVEC_POIGNEES.mov", fileName482);
    } catch (e) {
        logImportError(482, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00482_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess482 && editFileBis482.exists) {
    try {
        var editFootage482 = project.importFile(new ImportOptions(editFileBis482));
        editFootage482.parentFolder = fromEditFolder;
        editFootage482.name = "UNDLM_00482bis";
        editSources[482] = editFootage482;
        editImportCount++;
        importSuccess482 = true;
        fileName482 = "UNDLM_00482bis.mov";
        logImportSuccess(482, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00482bis.mov", fileName482);
    } catch (e) {
        logImportError(482, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00482bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess482) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00482.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00483
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile483 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00483.mov");
var editFilePoignees483 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00483_AVEC_POIGNEES.mov");
var editFileBis483 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00483bis.mov");

var importSuccess483 = false;
var fileName483 = "";

// Tenter import standard
if (editFile483.exists) {
    try {
        var editFootage483 = project.importFile(new ImportOptions(editFile483));
        editFootage483.parentFolder = fromEditFolder;
        editFootage483.name = "UNDLM_00483";
        editSources[483] = editFootage483;
        editImportCount++;
        importSuccess483 = true;
        fileName483 = "UNDLM_00483.mov";
        logImportSuccess(483, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00483.mov", fileName483);
    } catch (e) {
        logImportError(483, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00483.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess483 && editFilePoignees483.exists) {
    try {
        var editFootage483 = project.importFile(new ImportOptions(editFilePoignees483));
        editFootage483.parentFolder = fromEditFolder;
        editFootage483.name = "UNDLM_00483_AVEC_POIGNEES";
        editSources[483] = editFootage483;
        editImportCount++;
        importSuccess483 = true;
        fileName483 = "UNDLM_00483_AVEC_POIGNEES.mov";
        logImportSuccess(483, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00483_AVEC_POIGNEES.mov", fileName483);
    } catch (e) {
        logImportError(483, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00483_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess483 && editFileBis483.exists) {
    try {
        var editFootage483 = project.importFile(new ImportOptions(editFileBis483));
        editFootage483.parentFolder = fromEditFolder;
        editFootage483.name = "UNDLM_00483bis";
        editSources[483] = editFootage483;
        editImportCount++;
        importSuccess483 = true;
        fileName483 = "UNDLM_00483bis.mov";
        logImportSuccess(483, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00483bis.mov", fileName483);
    } catch (e) {
        logImportError(483, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00483bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess483) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00483.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00484
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile484 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00484.mov");
var editFilePoignees484 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00484_AVEC_POIGNEES.mov");
var editFileBis484 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00484bis.mov");

var importSuccess484 = false;
var fileName484 = "";

// Tenter import standard
if (editFile484.exists) {
    try {
        var editFootage484 = project.importFile(new ImportOptions(editFile484));
        editFootage484.parentFolder = fromEditFolder;
        editFootage484.name = "UNDLM_00484";
        editSources[484] = editFootage484;
        editImportCount++;
        importSuccess484 = true;
        fileName484 = "UNDLM_00484.mov";
        logImportSuccess(484, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00484.mov", fileName484);
    } catch (e) {
        logImportError(484, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00484.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess484 && editFilePoignees484.exists) {
    try {
        var editFootage484 = project.importFile(new ImportOptions(editFilePoignees484));
        editFootage484.parentFolder = fromEditFolder;
        editFootage484.name = "UNDLM_00484_AVEC_POIGNEES";
        editSources[484] = editFootage484;
        editImportCount++;
        importSuccess484 = true;
        fileName484 = "UNDLM_00484_AVEC_POIGNEES.mov";
        logImportSuccess(484, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00484_AVEC_POIGNEES.mov", fileName484);
    } catch (e) {
        logImportError(484, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00484_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess484 && editFileBis484.exists) {
    try {
        var editFootage484 = project.importFile(new ImportOptions(editFileBis484));
        editFootage484.parentFolder = fromEditFolder;
        editFootage484.name = "UNDLM_00484bis";
        editSources[484] = editFootage484;
        editImportCount++;
        importSuccess484 = true;
        fileName484 = "UNDLM_00484bis.mov";
        logImportSuccess(484, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00484bis.mov", fileName484);
    } catch (e) {
        logImportError(484, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00484bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess484) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00484.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00485
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile485 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00485.mov");
var editFilePoignees485 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00485_AVEC_POIGNEES.mov");
var editFileBis485 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00485bis.mov");

var importSuccess485 = false;
var fileName485 = "";

// Tenter import standard
if (editFile485.exists) {
    try {
        var editFootage485 = project.importFile(new ImportOptions(editFile485));
        editFootage485.parentFolder = fromEditFolder;
        editFootage485.name = "UNDLM_00485";
        editSources[485] = editFootage485;
        editImportCount++;
        importSuccess485 = true;
        fileName485 = "UNDLM_00485.mov";
        logImportSuccess(485, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00485.mov", fileName485);
    } catch (e) {
        logImportError(485, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00485.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess485 && editFilePoignees485.exists) {
    try {
        var editFootage485 = project.importFile(new ImportOptions(editFilePoignees485));
        editFootage485.parentFolder = fromEditFolder;
        editFootage485.name = "UNDLM_00485_AVEC_POIGNEES";
        editSources[485] = editFootage485;
        editImportCount++;
        importSuccess485 = true;
        fileName485 = "UNDLM_00485_AVEC_POIGNEES.mov";
        logImportSuccess(485, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00485_AVEC_POIGNEES.mov", fileName485);
    } catch (e) {
        logImportError(485, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00485_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess485 && editFileBis485.exists) {
    try {
        var editFootage485 = project.importFile(new ImportOptions(editFileBis485));
        editFootage485.parentFolder = fromEditFolder;
        editFootage485.name = "UNDLM_00485bis";
        editSources[485] = editFootage485;
        editImportCount++;
        importSuccess485 = true;
        fileName485 = "UNDLM_00485bis.mov";
        logImportSuccess(485, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00485bis.mov", fileName485);
    } catch (e) {
        logImportError(485, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00485bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess485) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00485.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00486
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile486 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00486.mov");
var editFilePoignees486 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00486_AVEC_POIGNEES.mov");
var editFileBis486 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00486bis.mov");

var importSuccess486 = false;
var fileName486 = "";

// Tenter import standard
if (editFile486.exists) {
    try {
        var editFootage486 = project.importFile(new ImportOptions(editFile486));
        editFootage486.parentFolder = fromEditFolder;
        editFootage486.name = "UNDLM_00486";
        editSources[486] = editFootage486;
        editImportCount++;
        importSuccess486 = true;
        fileName486 = "UNDLM_00486.mov";
        logImportSuccess(486, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00486.mov", fileName486);
    } catch (e) {
        logImportError(486, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00486.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess486 && editFilePoignees486.exists) {
    try {
        var editFootage486 = project.importFile(new ImportOptions(editFilePoignees486));
        editFootage486.parentFolder = fromEditFolder;
        editFootage486.name = "UNDLM_00486_AVEC_POIGNEES";
        editSources[486] = editFootage486;
        editImportCount++;
        importSuccess486 = true;
        fileName486 = "UNDLM_00486_AVEC_POIGNEES.mov";
        logImportSuccess(486, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00486_AVEC_POIGNEES.mov", fileName486);
    } catch (e) {
        logImportError(486, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00486_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess486 && editFileBis486.exists) {
    try {
        var editFootage486 = project.importFile(new ImportOptions(editFileBis486));
        editFootage486.parentFolder = fromEditFolder;
        editFootage486.name = "UNDLM_00486bis";
        editSources[486] = editFootage486;
        editImportCount++;
        importSuccess486 = true;
        fileName486 = "UNDLM_00486bis.mov";
        logImportSuccess(486, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00486bis.mov", fileName486);
    } catch (e) {
        logImportError(486, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00486bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess486) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00486.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00487
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile487 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00487.mov");
var editFilePoignees487 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00487_AVEC_POIGNEES.mov");
var editFileBis487 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00487bis.mov");

var importSuccess487 = false;
var fileName487 = "";

// Tenter import standard
if (editFile487.exists) {
    try {
        var editFootage487 = project.importFile(new ImportOptions(editFile487));
        editFootage487.parentFolder = fromEditFolder;
        editFootage487.name = "UNDLM_00487";
        editSources[487] = editFootage487;
        editImportCount++;
        importSuccess487 = true;
        fileName487 = "UNDLM_00487.mov";
        logImportSuccess(487, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00487.mov", fileName487);
    } catch (e) {
        logImportError(487, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00487.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess487 && editFilePoignees487.exists) {
    try {
        var editFootage487 = project.importFile(new ImportOptions(editFilePoignees487));
        editFootage487.parentFolder = fromEditFolder;
        editFootage487.name = "UNDLM_00487_AVEC_POIGNEES";
        editSources[487] = editFootage487;
        editImportCount++;
        importSuccess487 = true;
        fileName487 = "UNDLM_00487_AVEC_POIGNEES.mov";
        logImportSuccess(487, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00487_AVEC_POIGNEES.mov", fileName487);
    } catch (e) {
        logImportError(487, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00487_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess487 && editFileBis487.exists) {
    try {
        var editFootage487 = project.importFile(new ImportOptions(editFileBis487));
        editFootage487.parentFolder = fromEditFolder;
        editFootage487.name = "UNDLM_00487bis";
        editSources[487] = editFootage487;
        editImportCount++;
        importSuccess487 = true;
        fileName487 = "UNDLM_00487bis.mov";
        logImportSuccess(487, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00487bis.mov", fileName487);
    } catch (e) {
        logImportError(487, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00487bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess487) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00487.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00488
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile488 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00488.mov");
var editFilePoignees488 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00488_AVEC_POIGNEES.mov");
var editFileBis488 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00488bis.mov");

var importSuccess488 = false;
var fileName488 = "";

// Tenter import standard
if (editFile488.exists) {
    try {
        var editFootage488 = project.importFile(new ImportOptions(editFile488));
        editFootage488.parentFolder = fromEditFolder;
        editFootage488.name = "UNDLM_00488";
        editSources[488] = editFootage488;
        editImportCount++;
        importSuccess488 = true;
        fileName488 = "UNDLM_00488.mov";
        logImportSuccess(488, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00488.mov", fileName488);
    } catch (e) {
        logImportError(488, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00488.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess488 && editFilePoignees488.exists) {
    try {
        var editFootage488 = project.importFile(new ImportOptions(editFilePoignees488));
        editFootage488.parentFolder = fromEditFolder;
        editFootage488.name = "UNDLM_00488_AVEC_POIGNEES";
        editSources[488] = editFootage488;
        editImportCount++;
        importSuccess488 = true;
        fileName488 = "UNDLM_00488_AVEC_POIGNEES.mov";
        logImportSuccess(488, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00488_AVEC_POIGNEES.mov", fileName488);
    } catch (e) {
        logImportError(488, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00488_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess488 && editFileBis488.exists) {
    try {
        var editFootage488 = project.importFile(new ImportOptions(editFileBis488));
        editFootage488.parentFolder = fromEditFolder;
        editFootage488.name = "UNDLM_00488bis";
        editSources[488] = editFootage488;
        editImportCount++;
        importSuccess488 = true;
        fileName488 = "UNDLM_00488bis.mov";
        logImportSuccess(488, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00488bis.mov", fileName488);
    } catch (e) {
        logImportError(488, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00488bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess488) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00488.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00489
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile489 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00489.mov");
var editFilePoignees489 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00489_AVEC_POIGNEES.mov");
var editFileBis489 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00489bis.mov");

var importSuccess489 = false;
var fileName489 = "";

// Tenter import standard
if (editFile489.exists) {
    try {
        var editFootage489 = project.importFile(new ImportOptions(editFile489));
        editFootage489.parentFolder = fromEditFolder;
        editFootage489.name = "UNDLM_00489";
        editSources[489] = editFootage489;
        editImportCount++;
        importSuccess489 = true;
        fileName489 = "UNDLM_00489.mov";
        logImportSuccess(489, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00489.mov", fileName489);
    } catch (e) {
        logImportError(489, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00489.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess489 && editFilePoignees489.exists) {
    try {
        var editFootage489 = project.importFile(new ImportOptions(editFilePoignees489));
        editFootage489.parentFolder = fromEditFolder;
        editFootage489.name = "UNDLM_00489_AVEC_POIGNEES";
        editSources[489] = editFootage489;
        editImportCount++;
        importSuccess489 = true;
        fileName489 = "UNDLM_00489_AVEC_POIGNEES.mov";
        logImportSuccess(489, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00489_AVEC_POIGNEES.mov", fileName489);
    } catch (e) {
        logImportError(489, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00489_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess489 && editFileBis489.exists) {
    try {
        var editFootage489 = project.importFile(new ImportOptions(editFileBis489));
        editFootage489.parentFolder = fromEditFolder;
        editFootage489.name = "UNDLM_00489bis";
        editSources[489] = editFootage489;
        editImportCount++;
        importSuccess489 = true;
        fileName489 = "UNDLM_00489bis.mov";
        logImportSuccess(489, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00489bis.mov", fileName489);
    } catch (e) {
        logImportError(489, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00489bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess489) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00489.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00490
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile490 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00490.mov");
var editFilePoignees490 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00490_AVEC_POIGNEES.mov");
var editFileBis490 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00490bis.mov");

var importSuccess490 = false;
var fileName490 = "";

// Tenter import standard
if (editFile490.exists) {
    try {
        var editFootage490 = project.importFile(new ImportOptions(editFile490));
        editFootage490.parentFolder = fromEditFolder;
        editFootage490.name = "UNDLM_00490";
        editSources[490] = editFootage490;
        editImportCount++;
        importSuccess490 = true;
        fileName490 = "UNDLM_00490.mov";
        logImportSuccess(490, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00490.mov", fileName490);
    } catch (e) {
        logImportError(490, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00490.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess490 && editFilePoignees490.exists) {
    try {
        var editFootage490 = project.importFile(new ImportOptions(editFilePoignees490));
        editFootage490.parentFolder = fromEditFolder;
        editFootage490.name = "UNDLM_00490_AVEC_POIGNEES";
        editSources[490] = editFootage490;
        editImportCount++;
        importSuccess490 = true;
        fileName490 = "UNDLM_00490_AVEC_POIGNEES.mov";
        logImportSuccess(490, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00490_AVEC_POIGNEES.mov", fileName490);
    } catch (e) {
        logImportError(490, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00490_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess490 && editFileBis490.exists) {
    try {
        var editFootage490 = project.importFile(new ImportOptions(editFileBis490));
        editFootage490.parentFolder = fromEditFolder;
        editFootage490.name = "UNDLM_00490bis";
        editSources[490] = editFootage490;
        editImportCount++;
        importSuccess490 = true;
        fileName490 = "UNDLM_00490bis.mov";
        logImportSuccess(490, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00490bis.mov", fileName490);
    } catch (e) {
        logImportError(490, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00490bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess490) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00490.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00491
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile491 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00491.mov");
var editFilePoignees491 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00491_AVEC_POIGNEES.mov");
var editFileBis491 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00491bis.mov");

var importSuccess491 = false;
var fileName491 = "";

// Tenter import standard
if (editFile491.exists) {
    try {
        var editFootage491 = project.importFile(new ImportOptions(editFile491));
        editFootage491.parentFolder = fromEditFolder;
        editFootage491.name = "UNDLM_00491";
        editSources[491] = editFootage491;
        editImportCount++;
        importSuccess491 = true;
        fileName491 = "UNDLM_00491.mov";
        logImportSuccess(491, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00491.mov", fileName491);
    } catch (e) {
        logImportError(491, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00491.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess491 && editFilePoignees491.exists) {
    try {
        var editFootage491 = project.importFile(new ImportOptions(editFilePoignees491));
        editFootage491.parentFolder = fromEditFolder;
        editFootage491.name = "UNDLM_00491_AVEC_POIGNEES";
        editSources[491] = editFootage491;
        editImportCount++;
        importSuccess491 = true;
        fileName491 = "UNDLM_00491_AVEC_POIGNEES.mov";
        logImportSuccess(491, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00491_AVEC_POIGNEES.mov", fileName491);
    } catch (e) {
        logImportError(491, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00491_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess491 && editFileBis491.exists) {
    try {
        var editFootage491 = project.importFile(new ImportOptions(editFileBis491));
        editFootage491.parentFolder = fromEditFolder;
        editFootage491.name = "UNDLM_00491bis";
        editSources[491] = editFootage491;
        editImportCount++;
        importSuccess491 = true;
        fileName491 = "UNDLM_00491bis.mov";
        logImportSuccess(491, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00491bis.mov", fileName491);
    } catch (e) {
        logImportError(491, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00491bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess491) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00491.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00492
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile492 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00492.mov");
var editFilePoignees492 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00492_AVEC_POIGNEES.mov");
var editFileBis492 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00492bis.mov");

var importSuccess492 = false;
var fileName492 = "";

// Tenter import standard
if (editFile492.exists) {
    try {
        var editFootage492 = project.importFile(new ImportOptions(editFile492));
        editFootage492.parentFolder = fromEditFolder;
        editFootage492.name = "UNDLM_00492";
        editSources[492] = editFootage492;
        editImportCount++;
        importSuccess492 = true;
        fileName492 = "UNDLM_00492.mov";
        logImportSuccess(492, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00492.mov", fileName492);
    } catch (e) {
        logImportError(492, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00492.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess492 && editFilePoignees492.exists) {
    try {
        var editFootage492 = project.importFile(new ImportOptions(editFilePoignees492));
        editFootage492.parentFolder = fromEditFolder;
        editFootage492.name = "UNDLM_00492_AVEC_POIGNEES";
        editSources[492] = editFootage492;
        editImportCount++;
        importSuccess492 = true;
        fileName492 = "UNDLM_00492_AVEC_POIGNEES.mov";
        logImportSuccess(492, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00492_AVEC_POIGNEES.mov", fileName492);
    } catch (e) {
        logImportError(492, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00492_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess492 && editFileBis492.exists) {
    try {
        var editFootage492 = project.importFile(new ImportOptions(editFileBis492));
        editFootage492.parentFolder = fromEditFolder;
        editFootage492.name = "UNDLM_00492bis";
        editSources[492] = editFootage492;
        editImportCount++;
        importSuccess492 = true;
        fileName492 = "UNDLM_00492bis.mov";
        logImportSuccess(492, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00492bis.mov", fileName492);
    } catch (e) {
        logImportError(492, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00492bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess492) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00492.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00493
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile493 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00493.mov");
var editFilePoignees493 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00493_AVEC_POIGNEES.mov");
var editFileBis493 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00493bis.mov");

var importSuccess493 = false;
var fileName493 = "";

// Tenter import standard
if (editFile493.exists) {
    try {
        var editFootage493 = project.importFile(new ImportOptions(editFile493));
        editFootage493.parentFolder = fromEditFolder;
        editFootage493.name = "UNDLM_00493";
        editSources[493] = editFootage493;
        editImportCount++;
        importSuccess493 = true;
        fileName493 = "UNDLM_00493.mov";
        logImportSuccess(493, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00493.mov", fileName493);
    } catch (e) {
        logImportError(493, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00493.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess493 && editFilePoignees493.exists) {
    try {
        var editFootage493 = project.importFile(new ImportOptions(editFilePoignees493));
        editFootage493.parentFolder = fromEditFolder;
        editFootage493.name = "UNDLM_00493_AVEC_POIGNEES";
        editSources[493] = editFootage493;
        editImportCount++;
        importSuccess493 = true;
        fileName493 = "UNDLM_00493_AVEC_POIGNEES.mov";
        logImportSuccess(493, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00493_AVEC_POIGNEES.mov", fileName493);
    } catch (e) {
        logImportError(493, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00493_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess493 && editFileBis493.exists) {
    try {
        var editFootage493 = project.importFile(new ImportOptions(editFileBis493));
        editFootage493.parentFolder = fromEditFolder;
        editFootage493.name = "UNDLM_00493bis";
        editSources[493] = editFootage493;
        editImportCount++;
        importSuccess493 = true;
        fileName493 = "UNDLM_00493bis.mov";
        logImportSuccess(493, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00493bis.mov", fileName493);
    } catch (e) {
        logImportError(493, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00493bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess493) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00493.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00494
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile494 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00494.mov");
var editFilePoignees494 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00494_AVEC_POIGNEES.mov");
var editFileBis494 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00494bis.mov");

var importSuccess494 = false;
var fileName494 = "";

// Tenter import standard
if (editFile494.exists) {
    try {
        var editFootage494 = project.importFile(new ImportOptions(editFile494));
        editFootage494.parentFolder = fromEditFolder;
        editFootage494.name = "UNDLM_00494";
        editSources[494] = editFootage494;
        editImportCount++;
        importSuccess494 = true;
        fileName494 = "UNDLM_00494.mov";
        logImportSuccess(494, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00494.mov", fileName494);
    } catch (e) {
        logImportError(494, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00494.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess494 && editFilePoignees494.exists) {
    try {
        var editFootage494 = project.importFile(new ImportOptions(editFilePoignees494));
        editFootage494.parentFolder = fromEditFolder;
        editFootage494.name = "UNDLM_00494_AVEC_POIGNEES";
        editSources[494] = editFootage494;
        editImportCount++;
        importSuccess494 = true;
        fileName494 = "UNDLM_00494_AVEC_POIGNEES.mov";
        logImportSuccess(494, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00494_AVEC_POIGNEES.mov", fileName494);
    } catch (e) {
        logImportError(494, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00494_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess494 && editFileBis494.exists) {
    try {
        var editFootage494 = project.importFile(new ImportOptions(editFileBis494));
        editFootage494.parentFolder = fromEditFolder;
        editFootage494.name = "UNDLM_00494bis";
        editSources[494] = editFootage494;
        editImportCount++;
        importSuccess494 = true;
        fileName494 = "UNDLM_00494bis.mov";
        logImportSuccess(494, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00494bis.mov", fileName494);
    } catch (e) {
        logImportError(494, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00494bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess494) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00494.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00495
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile495 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00495.mov");
var editFilePoignees495 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00495_AVEC_POIGNEES.mov");
var editFileBis495 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00495bis.mov");

var importSuccess495 = false;
var fileName495 = "";

// Tenter import standard
if (editFile495.exists) {
    try {
        var editFootage495 = project.importFile(new ImportOptions(editFile495));
        editFootage495.parentFolder = fromEditFolder;
        editFootage495.name = "UNDLM_00495";
        editSources[495] = editFootage495;
        editImportCount++;
        importSuccess495 = true;
        fileName495 = "UNDLM_00495.mov";
        logImportSuccess(495, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00495.mov", fileName495);
    } catch (e) {
        logImportError(495, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00495.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess495 && editFilePoignees495.exists) {
    try {
        var editFootage495 = project.importFile(new ImportOptions(editFilePoignees495));
        editFootage495.parentFolder = fromEditFolder;
        editFootage495.name = "UNDLM_00495_AVEC_POIGNEES";
        editSources[495] = editFootage495;
        editImportCount++;
        importSuccess495 = true;
        fileName495 = "UNDLM_00495_AVEC_POIGNEES.mov";
        logImportSuccess(495, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00495_AVEC_POIGNEES.mov", fileName495);
    } catch (e) {
        logImportError(495, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00495_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess495 && editFileBis495.exists) {
    try {
        var editFootage495 = project.importFile(new ImportOptions(editFileBis495));
        editFootage495.parentFolder = fromEditFolder;
        editFootage495.name = "UNDLM_00495bis";
        editSources[495] = editFootage495;
        editImportCount++;
        importSuccess495 = true;
        fileName495 = "UNDLM_00495bis.mov";
        logImportSuccess(495, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00495bis.mov", fileName495);
    } catch (e) {
        logImportError(495, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00495bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess495) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00495.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00496
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile496 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00496.mov");
var editFilePoignees496 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00496_AVEC_POIGNEES.mov");
var editFileBis496 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00496bis.mov");

var importSuccess496 = false;
var fileName496 = "";

// Tenter import standard
if (editFile496.exists) {
    try {
        var editFootage496 = project.importFile(new ImportOptions(editFile496));
        editFootage496.parentFolder = fromEditFolder;
        editFootage496.name = "UNDLM_00496";
        editSources[496] = editFootage496;
        editImportCount++;
        importSuccess496 = true;
        fileName496 = "UNDLM_00496.mov";
        logImportSuccess(496, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00496.mov", fileName496);
    } catch (e) {
        logImportError(496, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00496.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess496 && editFilePoignees496.exists) {
    try {
        var editFootage496 = project.importFile(new ImportOptions(editFilePoignees496));
        editFootage496.parentFolder = fromEditFolder;
        editFootage496.name = "UNDLM_00496_AVEC_POIGNEES";
        editSources[496] = editFootage496;
        editImportCount++;
        importSuccess496 = true;
        fileName496 = "UNDLM_00496_AVEC_POIGNEES.mov";
        logImportSuccess(496, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00496_AVEC_POIGNEES.mov", fileName496);
    } catch (e) {
        logImportError(496, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00496_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess496 && editFileBis496.exists) {
    try {
        var editFootage496 = project.importFile(new ImportOptions(editFileBis496));
        editFootage496.parentFolder = fromEditFolder;
        editFootage496.name = "UNDLM_00496bis";
        editSources[496] = editFootage496;
        editImportCount++;
        importSuccess496 = true;
        fileName496 = "UNDLM_00496bis.mov";
        logImportSuccess(496, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00496bis.mov", fileName496);
    } catch (e) {
        logImportError(496, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00496bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess496) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00496.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00497
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile497 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00497.mov");
var editFilePoignees497 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00497_AVEC_POIGNEES.mov");
var editFileBis497 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00497bis.mov");

var importSuccess497 = false;
var fileName497 = "";

// Tenter import standard
if (editFile497.exists) {
    try {
        var editFootage497 = project.importFile(new ImportOptions(editFile497));
        editFootage497.parentFolder = fromEditFolder;
        editFootage497.name = "UNDLM_00497";
        editSources[497] = editFootage497;
        editImportCount++;
        importSuccess497 = true;
        fileName497 = "UNDLM_00497.mov";
        logImportSuccess(497, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00497.mov", fileName497);
    } catch (e) {
        logImportError(497, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00497.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess497 && editFilePoignees497.exists) {
    try {
        var editFootage497 = project.importFile(new ImportOptions(editFilePoignees497));
        editFootage497.parentFolder = fromEditFolder;
        editFootage497.name = "UNDLM_00497_AVEC_POIGNEES";
        editSources[497] = editFootage497;
        editImportCount++;
        importSuccess497 = true;
        fileName497 = "UNDLM_00497_AVEC_POIGNEES.mov";
        logImportSuccess(497, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00497_AVEC_POIGNEES.mov", fileName497);
    } catch (e) {
        logImportError(497, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00497_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess497 && editFileBis497.exists) {
    try {
        var editFootage497 = project.importFile(new ImportOptions(editFileBis497));
        editFootage497.parentFolder = fromEditFolder;
        editFootage497.name = "UNDLM_00497bis";
        editSources[497] = editFootage497;
        editImportCount++;
        importSuccess497 = true;
        fileName497 = "UNDLM_00497bis.mov";
        logImportSuccess(497, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00497bis.mov", fileName497);
    } catch (e) {
        logImportError(497, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00497bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess497) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00497.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00498
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile498 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00498.mov");
var editFilePoignees498 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00498_AVEC_POIGNEES.mov");
var editFileBis498 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00498bis.mov");

var importSuccess498 = false;
var fileName498 = "";

// Tenter import standard
if (editFile498.exists) {
    try {
        var editFootage498 = project.importFile(new ImportOptions(editFile498));
        editFootage498.parentFolder = fromEditFolder;
        editFootage498.name = "UNDLM_00498";
        editSources[498] = editFootage498;
        editImportCount++;
        importSuccess498 = true;
        fileName498 = "UNDLM_00498.mov";
        logImportSuccess(498, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00498.mov", fileName498);
    } catch (e) {
        logImportError(498, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00498.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess498 && editFilePoignees498.exists) {
    try {
        var editFootage498 = project.importFile(new ImportOptions(editFilePoignees498));
        editFootage498.parentFolder = fromEditFolder;
        editFootage498.name = "UNDLM_00498_AVEC_POIGNEES";
        editSources[498] = editFootage498;
        editImportCount++;
        importSuccess498 = true;
        fileName498 = "UNDLM_00498_AVEC_POIGNEES.mov";
        logImportSuccess(498, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00498_AVEC_POIGNEES.mov", fileName498);
    } catch (e) {
        logImportError(498, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00498_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess498 && editFileBis498.exists) {
    try {
        var editFootage498 = project.importFile(new ImportOptions(editFileBis498));
        editFootage498.parentFolder = fromEditFolder;
        editFootage498.name = "UNDLM_00498bis";
        editSources[498] = editFootage498;
        editImportCount++;
        importSuccess498 = true;
        fileName498 = "UNDLM_00498bis.mov";
        logImportSuccess(498, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00498bis.mov", fileName498);
    } catch (e) {
        logImportError(498, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00498bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess498) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00498.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00499
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile499 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00499.mov");
var editFilePoignees499 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00499_AVEC_POIGNEES.mov");
var editFileBis499 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00499bis.mov");

var importSuccess499 = false;
var fileName499 = "";

// Tenter import standard
if (editFile499.exists) {
    try {
        var editFootage499 = project.importFile(new ImportOptions(editFile499));
        editFootage499.parentFolder = fromEditFolder;
        editFootage499.name = "UNDLM_00499";
        editSources[499] = editFootage499;
        editImportCount++;
        importSuccess499 = true;
        fileName499 = "UNDLM_00499.mov";
        logImportSuccess(499, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00499.mov", fileName499);
    } catch (e) {
        logImportError(499, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00499.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess499 && editFilePoignees499.exists) {
    try {
        var editFootage499 = project.importFile(new ImportOptions(editFilePoignees499));
        editFootage499.parentFolder = fromEditFolder;
        editFootage499.name = "UNDLM_00499_AVEC_POIGNEES";
        editSources[499] = editFootage499;
        editImportCount++;
        importSuccess499 = true;
        fileName499 = "UNDLM_00499_AVEC_POIGNEES.mov";
        logImportSuccess(499, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00499_AVEC_POIGNEES.mov", fileName499);
    } catch (e) {
        logImportError(499, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00499_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess499 && editFileBis499.exists) {
    try {
        var editFootage499 = project.importFile(new ImportOptions(editFileBis499));
        editFootage499.parentFolder = fromEditFolder;
        editFootage499.name = "UNDLM_00499bis";
        editSources[499] = editFootage499;
        editImportCount++;
        importSuccess499 = true;
        fileName499 = "UNDLM_00499bis.mov";
        logImportSuccess(499, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00499bis.mov", fileName499);
    } catch (e) {
        logImportError(499, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00499bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess499) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00499.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00500
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile500 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00500.mov");
var editFilePoignees500 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00500_AVEC_POIGNEES.mov");
var editFileBis500 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00500bis.mov");

var importSuccess500 = false;
var fileName500 = "";

// Tenter import standard
if (editFile500.exists) {
    try {
        var editFootage500 = project.importFile(new ImportOptions(editFile500));
        editFootage500.parentFolder = fromEditFolder;
        editFootage500.name = "UNDLM_00500";
        editSources[500] = editFootage500;
        editImportCount++;
        importSuccess500 = true;
        fileName500 = "UNDLM_00500.mov";
        logImportSuccess(500, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00500.mov", fileName500);
    } catch (e) {
        logImportError(500, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00500.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess500 && editFilePoignees500.exists) {
    try {
        var editFootage500 = project.importFile(new ImportOptions(editFilePoignees500));
        editFootage500.parentFolder = fromEditFolder;
        editFootage500.name = "UNDLM_00500_AVEC_POIGNEES";
        editSources[500] = editFootage500;
        editImportCount++;
        importSuccess500 = true;
        fileName500 = "UNDLM_00500_AVEC_POIGNEES.mov";
        logImportSuccess(500, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00500_AVEC_POIGNEES.mov", fileName500);
    } catch (e) {
        logImportError(500, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00500_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess500 && editFileBis500.exists) {
    try {
        var editFootage500 = project.importFile(new ImportOptions(editFileBis500));
        editFootage500.parentFolder = fromEditFolder;
        editFootage500.name = "UNDLM_00500bis";
        editSources[500] = editFootage500;
        editImportCount++;
        importSuccess500 = true;
        fileName500 = "UNDLM_00500bis.mov";
        logImportSuccess(500, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00500bis.mov", fileName500);
    } catch (e) {
        logImportError(500, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00500bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess500) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00500.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00501
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile501 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00501.mov");
var editFilePoignees501 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00501_AVEC_POIGNEES.mov");
var editFileBis501 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00501bis.mov");

var importSuccess501 = false;
var fileName501 = "";

// Tenter import standard
if (editFile501.exists) {
    try {
        var editFootage501 = project.importFile(new ImportOptions(editFile501));
        editFootage501.parentFolder = fromEditFolder;
        editFootage501.name = "UNDLM_00501";
        editSources[501] = editFootage501;
        editImportCount++;
        importSuccess501 = true;
        fileName501 = "UNDLM_00501.mov";
        logImportSuccess(501, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00501.mov", fileName501);
    } catch (e) {
        logImportError(501, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00501.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess501 && editFilePoignees501.exists) {
    try {
        var editFootage501 = project.importFile(new ImportOptions(editFilePoignees501));
        editFootage501.parentFolder = fromEditFolder;
        editFootage501.name = "UNDLM_00501_AVEC_POIGNEES";
        editSources[501] = editFootage501;
        editImportCount++;
        importSuccess501 = true;
        fileName501 = "UNDLM_00501_AVEC_POIGNEES.mov";
        logImportSuccess(501, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00501_AVEC_POIGNEES.mov", fileName501);
    } catch (e) {
        logImportError(501, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00501_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess501 && editFileBis501.exists) {
    try {
        var editFootage501 = project.importFile(new ImportOptions(editFileBis501));
        editFootage501.parentFolder = fromEditFolder;
        editFootage501.name = "UNDLM_00501bis";
        editSources[501] = editFootage501;
        editImportCount++;
        importSuccess501 = true;
        fileName501 = "UNDLM_00501bis.mov";
        logImportSuccess(501, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00501bis.mov", fileName501);
    } catch (e) {
        logImportError(501, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00501bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess501) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00501.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00502
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile502 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00502.mov");
var editFilePoignees502 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00502_AVEC_POIGNEES.mov");
var editFileBis502 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00502bis.mov");

var importSuccess502 = false;
var fileName502 = "";

// Tenter import standard
if (editFile502.exists) {
    try {
        var editFootage502 = project.importFile(new ImportOptions(editFile502));
        editFootage502.parentFolder = fromEditFolder;
        editFootage502.name = "UNDLM_00502";
        editSources[502] = editFootage502;
        editImportCount++;
        importSuccess502 = true;
        fileName502 = "UNDLM_00502.mov";
        logImportSuccess(502, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00502.mov", fileName502);
    } catch (e) {
        logImportError(502, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00502.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess502 && editFilePoignees502.exists) {
    try {
        var editFootage502 = project.importFile(new ImportOptions(editFilePoignees502));
        editFootage502.parentFolder = fromEditFolder;
        editFootage502.name = "UNDLM_00502_AVEC_POIGNEES";
        editSources[502] = editFootage502;
        editImportCount++;
        importSuccess502 = true;
        fileName502 = "UNDLM_00502_AVEC_POIGNEES.mov";
        logImportSuccess(502, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00502_AVEC_POIGNEES.mov", fileName502);
    } catch (e) {
        logImportError(502, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00502_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess502 && editFileBis502.exists) {
    try {
        var editFootage502 = project.importFile(new ImportOptions(editFileBis502));
        editFootage502.parentFolder = fromEditFolder;
        editFootage502.name = "UNDLM_00502bis";
        editSources[502] = editFootage502;
        editImportCount++;
        importSuccess502 = true;
        fileName502 = "UNDLM_00502bis.mov";
        logImportSuccess(502, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00502bis.mov", fileName502);
    } catch (e) {
        logImportError(502, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00502bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess502) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00502.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00503
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile503 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00503.mov");
var editFilePoignees503 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00503_AVEC_POIGNEES.mov");
var editFileBis503 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00503bis.mov");

var importSuccess503 = false;
var fileName503 = "";

// Tenter import standard
if (editFile503.exists) {
    try {
        var editFootage503 = project.importFile(new ImportOptions(editFile503));
        editFootage503.parentFolder = fromEditFolder;
        editFootage503.name = "UNDLM_00503";
        editSources[503] = editFootage503;
        editImportCount++;
        importSuccess503 = true;
        fileName503 = "UNDLM_00503.mov";
        logImportSuccess(503, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00503.mov", fileName503);
    } catch (e) {
        logImportError(503, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00503.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess503 && editFilePoignees503.exists) {
    try {
        var editFootage503 = project.importFile(new ImportOptions(editFilePoignees503));
        editFootage503.parentFolder = fromEditFolder;
        editFootage503.name = "UNDLM_00503_AVEC_POIGNEES";
        editSources[503] = editFootage503;
        editImportCount++;
        importSuccess503 = true;
        fileName503 = "UNDLM_00503_AVEC_POIGNEES.mov";
        logImportSuccess(503, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00503_AVEC_POIGNEES.mov", fileName503);
    } catch (e) {
        logImportError(503, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00503_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess503 && editFileBis503.exists) {
    try {
        var editFootage503 = project.importFile(new ImportOptions(editFileBis503));
        editFootage503.parentFolder = fromEditFolder;
        editFootage503.name = "UNDLM_00503bis";
        editSources[503] = editFootage503;
        editImportCount++;
        importSuccess503 = true;
        fileName503 = "UNDLM_00503bis.mov";
        logImportSuccess(503, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00503bis.mov", fileName503);
    } catch (e) {
        logImportError(503, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00503bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess503) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00503.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00504
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile504 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00504.mov");
var editFilePoignees504 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00504_AVEC_POIGNEES.mov");
var editFileBis504 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00504bis.mov");

var importSuccess504 = false;
var fileName504 = "";

// Tenter import standard
if (editFile504.exists) {
    try {
        var editFootage504 = project.importFile(new ImportOptions(editFile504));
        editFootage504.parentFolder = fromEditFolder;
        editFootage504.name = "UNDLM_00504";
        editSources[504] = editFootage504;
        editImportCount++;
        importSuccess504 = true;
        fileName504 = "UNDLM_00504.mov";
        logImportSuccess(504, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00504.mov", fileName504);
    } catch (e) {
        logImportError(504, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00504.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess504 && editFilePoignees504.exists) {
    try {
        var editFootage504 = project.importFile(new ImportOptions(editFilePoignees504));
        editFootage504.parentFolder = fromEditFolder;
        editFootage504.name = "UNDLM_00504_AVEC_POIGNEES";
        editSources[504] = editFootage504;
        editImportCount++;
        importSuccess504 = true;
        fileName504 = "UNDLM_00504_AVEC_POIGNEES.mov";
        logImportSuccess(504, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00504_AVEC_POIGNEES.mov", fileName504);
    } catch (e) {
        logImportError(504, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00504_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess504 && editFileBis504.exists) {
    try {
        var editFootage504 = project.importFile(new ImportOptions(editFileBis504));
        editFootage504.parentFolder = fromEditFolder;
        editFootage504.name = "UNDLM_00504bis";
        editSources[504] = editFootage504;
        editImportCount++;
        importSuccess504 = true;
        fileName504 = "UNDLM_00504bis.mov";
        logImportSuccess(504, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00504bis.mov", fileName504);
    } catch (e) {
        logImportError(504, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00504bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess504) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00504.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00505
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile505 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00505.mov");
var editFilePoignees505 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00505_AVEC_POIGNEES.mov");
var editFileBis505 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00505bis.mov");

var importSuccess505 = false;
var fileName505 = "";

// Tenter import standard
if (editFile505.exists) {
    try {
        var editFootage505 = project.importFile(new ImportOptions(editFile505));
        editFootage505.parentFolder = fromEditFolder;
        editFootage505.name = "UNDLM_00505";
        editSources[505] = editFootage505;
        editImportCount++;
        importSuccess505 = true;
        fileName505 = "UNDLM_00505.mov";
        logImportSuccess(505, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00505.mov", fileName505);
    } catch (e) {
        logImportError(505, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00505.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess505 && editFilePoignees505.exists) {
    try {
        var editFootage505 = project.importFile(new ImportOptions(editFilePoignees505));
        editFootage505.parentFolder = fromEditFolder;
        editFootage505.name = "UNDLM_00505_AVEC_POIGNEES";
        editSources[505] = editFootage505;
        editImportCount++;
        importSuccess505 = true;
        fileName505 = "UNDLM_00505_AVEC_POIGNEES.mov";
        logImportSuccess(505, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00505_AVEC_POIGNEES.mov", fileName505);
    } catch (e) {
        logImportError(505, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00505_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess505 && editFileBis505.exists) {
    try {
        var editFootage505 = project.importFile(new ImportOptions(editFileBis505));
        editFootage505.parentFolder = fromEditFolder;
        editFootage505.name = "UNDLM_00505bis";
        editSources[505] = editFootage505;
        editImportCount++;
        importSuccess505 = true;
        fileName505 = "UNDLM_00505bis.mov";
        logImportSuccess(505, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00505bis.mov", fileName505);
    } catch (e) {
        logImportError(505, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00505bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess505) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00505.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00479
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile479 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00479.mov");
var gradedFilePoignees479 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00479_AVEC_POIGNEES.mov");
var gradedFileBis479 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00479bis.mov");

var gradedImportSuccess479 = false;
var gradedFileName479 = "";

// Tenter import standard
if (gradedFile479.exists) {
    try {
        var gradedFootage479 = project.importFile(new ImportOptions(gradedFile479));
        gradedFootage479.parentFolder = fromGradingFolder;
        gradedFootage479.name = "UNDLM_00479";
        gradingSources[479] = gradedFootage479;
        gradingImportCount++;
        gradedImportSuccess479 = true;
        gradedFileName479 = "UNDLM_00479.mov";
        logImportSuccess(479, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00479.mov", gradedFileName479);
    } catch (e) {
        logImportError(479, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00479.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess479 && gradedFilePoignees479.exists) {
    try {
        var gradedFootage479 = project.importFile(new ImportOptions(gradedFilePoignees479));
        gradedFootage479.parentFolder = fromGradingFolder;
        gradedFootage479.name = "UNDLM_00479_AVEC_POIGNEES";
        gradingSources[479] = gradedFootage479;
        gradingImportCount++;
        gradedImportSuccess479 = true;
        gradedFileName479 = "UNDLM_00479_AVEC_POIGNEES.mov";
        logImportSuccess(479, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00479_AVEC_POIGNEES.mov", gradedFileName479);
    } catch (e) {
        logImportError(479, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00479_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess479 && gradedFileBis479.exists) {
    try {
        var gradedFootage479 = project.importFile(new ImportOptions(gradedFileBis479));
        gradedFootage479.parentFolder = fromGradingFolder;
        gradedFootage479.name = "UNDLM_00479bis";
        gradingSources[479] = gradedFootage479;
        gradingImportCount++;
        gradedImportSuccess479 = true;
        gradedFileName479 = "UNDLM_00479bis.mov";
        logImportSuccess(479, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00479bis.mov", gradedFileName479);
    } catch (e) {
        logImportError(479, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00479bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess479) {
    missingGradingCount++;
}

// Import plan GRADED 00480
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile480 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00480.mov");
var gradedFilePoignees480 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00480_AVEC_POIGNEES.mov");
var gradedFileBis480 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00480bis.mov");

var gradedImportSuccess480 = false;
var gradedFileName480 = "";

// Tenter import standard
if (gradedFile480.exists) {
    try {
        var gradedFootage480 = project.importFile(new ImportOptions(gradedFile480));
        gradedFootage480.parentFolder = fromGradingFolder;
        gradedFootage480.name = "UNDLM_00480";
        gradingSources[480] = gradedFootage480;
        gradingImportCount++;
        gradedImportSuccess480 = true;
        gradedFileName480 = "UNDLM_00480.mov";
        logImportSuccess(480, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00480.mov", gradedFileName480);
    } catch (e) {
        logImportError(480, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00480.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess480 && gradedFilePoignees480.exists) {
    try {
        var gradedFootage480 = project.importFile(new ImportOptions(gradedFilePoignees480));
        gradedFootage480.parentFolder = fromGradingFolder;
        gradedFootage480.name = "UNDLM_00480_AVEC_POIGNEES";
        gradingSources[480] = gradedFootage480;
        gradingImportCount++;
        gradedImportSuccess480 = true;
        gradedFileName480 = "UNDLM_00480_AVEC_POIGNEES.mov";
        logImportSuccess(480, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00480_AVEC_POIGNEES.mov", gradedFileName480);
    } catch (e) {
        logImportError(480, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00480_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess480 && gradedFileBis480.exists) {
    try {
        var gradedFootage480 = project.importFile(new ImportOptions(gradedFileBis480));
        gradedFootage480.parentFolder = fromGradingFolder;
        gradedFootage480.name = "UNDLM_00480bis";
        gradingSources[480] = gradedFootage480;
        gradingImportCount++;
        gradedImportSuccess480 = true;
        gradedFileName480 = "UNDLM_00480bis.mov";
        logImportSuccess(480, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00480bis.mov", gradedFileName480);
    } catch (e) {
        logImportError(480, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00480bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess480) {
    missingGradingCount++;
}

// Import plan GRADED 00481
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile481 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00481.mov");
var gradedFilePoignees481 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00481_AVEC_POIGNEES.mov");
var gradedFileBis481 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00481bis.mov");

var gradedImportSuccess481 = false;
var gradedFileName481 = "";

// Tenter import standard
if (gradedFile481.exists) {
    try {
        var gradedFootage481 = project.importFile(new ImportOptions(gradedFile481));
        gradedFootage481.parentFolder = fromGradingFolder;
        gradedFootage481.name = "UNDLM_00481";
        gradingSources[481] = gradedFootage481;
        gradingImportCount++;
        gradedImportSuccess481 = true;
        gradedFileName481 = "UNDLM_00481.mov";
        logImportSuccess(481, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00481.mov", gradedFileName481);
    } catch (e) {
        logImportError(481, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00481.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess481 && gradedFilePoignees481.exists) {
    try {
        var gradedFootage481 = project.importFile(new ImportOptions(gradedFilePoignees481));
        gradedFootage481.parentFolder = fromGradingFolder;
        gradedFootage481.name = "UNDLM_00481_AVEC_POIGNEES";
        gradingSources[481] = gradedFootage481;
        gradingImportCount++;
        gradedImportSuccess481 = true;
        gradedFileName481 = "UNDLM_00481_AVEC_POIGNEES.mov";
        logImportSuccess(481, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00481_AVEC_POIGNEES.mov", gradedFileName481);
    } catch (e) {
        logImportError(481, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00481_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess481 && gradedFileBis481.exists) {
    try {
        var gradedFootage481 = project.importFile(new ImportOptions(gradedFileBis481));
        gradedFootage481.parentFolder = fromGradingFolder;
        gradedFootage481.name = "UNDLM_00481bis";
        gradingSources[481] = gradedFootage481;
        gradingImportCount++;
        gradedImportSuccess481 = true;
        gradedFileName481 = "UNDLM_00481bis.mov";
        logImportSuccess(481, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00481bis.mov", gradedFileName481);
    } catch (e) {
        logImportError(481, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00481bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess481) {
    missingGradingCount++;
}

// Import plan GRADED 00482
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile482 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00482.mov");
var gradedFilePoignees482 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00482_AVEC_POIGNEES.mov");
var gradedFileBis482 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00482bis.mov");

var gradedImportSuccess482 = false;
var gradedFileName482 = "";

// Tenter import standard
if (gradedFile482.exists) {
    try {
        var gradedFootage482 = project.importFile(new ImportOptions(gradedFile482));
        gradedFootage482.parentFolder = fromGradingFolder;
        gradedFootage482.name = "UNDLM_00482";
        gradingSources[482] = gradedFootage482;
        gradingImportCount++;
        gradedImportSuccess482 = true;
        gradedFileName482 = "UNDLM_00482.mov";
        logImportSuccess(482, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00482.mov", gradedFileName482);
    } catch (e) {
        logImportError(482, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00482.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess482 && gradedFilePoignees482.exists) {
    try {
        var gradedFootage482 = project.importFile(new ImportOptions(gradedFilePoignees482));
        gradedFootage482.parentFolder = fromGradingFolder;
        gradedFootage482.name = "UNDLM_00482_AVEC_POIGNEES";
        gradingSources[482] = gradedFootage482;
        gradingImportCount++;
        gradedImportSuccess482 = true;
        gradedFileName482 = "UNDLM_00482_AVEC_POIGNEES.mov";
        logImportSuccess(482, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00482_AVEC_POIGNEES.mov", gradedFileName482);
    } catch (e) {
        logImportError(482, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00482_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess482 && gradedFileBis482.exists) {
    try {
        var gradedFootage482 = project.importFile(new ImportOptions(gradedFileBis482));
        gradedFootage482.parentFolder = fromGradingFolder;
        gradedFootage482.name = "UNDLM_00482bis";
        gradingSources[482] = gradedFootage482;
        gradingImportCount++;
        gradedImportSuccess482 = true;
        gradedFileName482 = "UNDLM_00482bis.mov";
        logImportSuccess(482, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00482bis.mov", gradedFileName482);
    } catch (e) {
        logImportError(482, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00482bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess482) {
    missingGradingCount++;
}

// Import plan GRADED 00484
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile484 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00484.mov");
var gradedFilePoignees484 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00484_AVEC_POIGNEES.mov");
var gradedFileBis484 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00484bis.mov");

var gradedImportSuccess484 = false;
var gradedFileName484 = "";

// Tenter import standard
if (gradedFile484.exists) {
    try {
        var gradedFootage484 = project.importFile(new ImportOptions(gradedFile484));
        gradedFootage484.parentFolder = fromGradingFolder;
        gradedFootage484.name = "UNDLM_00484";
        gradingSources[484] = gradedFootage484;
        gradingImportCount++;
        gradedImportSuccess484 = true;
        gradedFileName484 = "UNDLM_00484.mov";
        logImportSuccess(484, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00484.mov", gradedFileName484);
    } catch (e) {
        logImportError(484, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00484.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess484 && gradedFilePoignees484.exists) {
    try {
        var gradedFootage484 = project.importFile(new ImportOptions(gradedFilePoignees484));
        gradedFootage484.parentFolder = fromGradingFolder;
        gradedFootage484.name = "UNDLM_00484_AVEC_POIGNEES";
        gradingSources[484] = gradedFootage484;
        gradingImportCount++;
        gradedImportSuccess484 = true;
        gradedFileName484 = "UNDLM_00484_AVEC_POIGNEES.mov";
        logImportSuccess(484, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00484_AVEC_POIGNEES.mov", gradedFileName484);
    } catch (e) {
        logImportError(484, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00484_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess484 && gradedFileBis484.exists) {
    try {
        var gradedFootage484 = project.importFile(new ImportOptions(gradedFileBis484));
        gradedFootage484.parentFolder = fromGradingFolder;
        gradedFootage484.name = "UNDLM_00484bis";
        gradingSources[484] = gradedFootage484;
        gradingImportCount++;
        gradedImportSuccess484 = true;
        gradedFileName484 = "UNDLM_00484bis.mov";
        logImportSuccess(484, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00484bis.mov", gradedFileName484);
    } catch (e) {
        logImportError(484, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00484bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess484) {
    missingGradingCount++;
}

// Import plan GRADED 00485
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile485 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00485.mov");
var gradedFilePoignees485 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00485_AVEC_POIGNEES.mov");
var gradedFileBis485 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00485bis.mov");

var gradedImportSuccess485 = false;
var gradedFileName485 = "";

// Tenter import standard
if (gradedFile485.exists) {
    try {
        var gradedFootage485 = project.importFile(new ImportOptions(gradedFile485));
        gradedFootage485.parentFolder = fromGradingFolder;
        gradedFootage485.name = "UNDLM_00485";
        gradingSources[485] = gradedFootage485;
        gradingImportCount++;
        gradedImportSuccess485 = true;
        gradedFileName485 = "UNDLM_00485.mov";
        logImportSuccess(485, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00485.mov", gradedFileName485);
    } catch (e) {
        logImportError(485, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00485.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess485 && gradedFilePoignees485.exists) {
    try {
        var gradedFootage485 = project.importFile(new ImportOptions(gradedFilePoignees485));
        gradedFootage485.parentFolder = fromGradingFolder;
        gradedFootage485.name = "UNDLM_00485_AVEC_POIGNEES";
        gradingSources[485] = gradedFootage485;
        gradingImportCount++;
        gradedImportSuccess485 = true;
        gradedFileName485 = "UNDLM_00485_AVEC_POIGNEES.mov";
        logImportSuccess(485, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00485_AVEC_POIGNEES.mov", gradedFileName485);
    } catch (e) {
        logImportError(485, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00485_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess485 && gradedFileBis485.exists) {
    try {
        var gradedFootage485 = project.importFile(new ImportOptions(gradedFileBis485));
        gradedFootage485.parentFolder = fromGradingFolder;
        gradedFootage485.name = "UNDLM_00485bis";
        gradingSources[485] = gradedFootage485;
        gradingImportCount++;
        gradedImportSuccess485 = true;
        gradedFileName485 = "UNDLM_00485bis.mov";
        logImportSuccess(485, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00485bis.mov", gradedFileName485);
    } catch (e) {
        logImportError(485, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00485bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess485) {
    missingGradingCount++;
}

// Import plan GRADED 00486
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile486 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00486.mov");
var gradedFilePoignees486 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00486_AVEC_POIGNEES.mov");
var gradedFileBis486 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00486bis.mov");

var gradedImportSuccess486 = false;
var gradedFileName486 = "";

// Tenter import standard
if (gradedFile486.exists) {
    try {
        var gradedFootage486 = project.importFile(new ImportOptions(gradedFile486));
        gradedFootage486.parentFolder = fromGradingFolder;
        gradedFootage486.name = "UNDLM_00486";
        gradingSources[486] = gradedFootage486;
        gradingImportCount++;
        gradedImportSuccess486 = true;
        gradedFileName486 = "UNDLM_00486.mov";
        logImportSuccess(486, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00486.mov", gradedFileName486);
    } catch (e) {
        logImportError(486, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00486.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess486 && gradedFilePoignees486.exists) {
    try {
        var gradedFootage486 = project.importFile(new ImportOptions(gradedFilePoignees486));
        gradedFootage486.parentFolder = fromGradingFolder;
        gradedFootage486.name = "UNDLM_00486_AVEC_POIGNEES";
        gradingSources[486] = gradedFootage486;
        gradingImportCount++;
        gradedImportSuccess486 = true;
        gradedFileName486 = "UNDLM_00486_AVEC_POIGNEES.mov";
        logImportSuccess(486, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00486_AVEC_POIGNEES.mov", gradedFileName486);
    } catch (e) {
        logImportError(486, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00486_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess486 && gradedFileBis486.exists) {
    try {
        var gradedFootage486 = project.importFile(new ImportOptions(gradedFileBis486));
        gradedFootage486.parentFolder = fromGradingFolder;
        gradedFootage486.name = "UNDLM_00486bis";
        gradingSources[486] = gradedFootage486;
        gradingImportCount++;
        gradedImportSuccess486 = true;
        gradedFileName486 = "UNDLM_00486bis.mov";
        logImportSuccess(486, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00486bis.mov", gradedFileName486);
    } catch (e) {
        logImportError(486, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00486bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess486) {
    missingGradingCount++;
}

// Import plan GRADED 00487
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile487 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00487.mov");
var gradedFilePoignees487 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00487_AVEC_POIGNEES.mov");
var gradedFileBis487 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00487bis.mov");

var gradedImportSuccess487 = false;
var gradedFileName487 = "";

// Tenter import standard
if (gradedFile487.exists) {
    try {
        var gradedFootage487 = project.importFile(new ImportOptions(gradedFile487));
        gradedFootage487.parentFolder = fromGradingFolder;
        gradedFootage487.name = "UNDLM_00487";
        gradingSources[487] = gradedFootage487;
        gradingImportCount++;
        gradedImportSuccess487 = true;
        gradedFileName487 = "UNDLM_00487.mov";
        logImportSuccess(487, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00487.mov", gradedFileName487);
    } catch (e) {
        logImportError(487, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00487.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess487 && gradedFilePoignees487.exists) {
    try {
        var gradedFootage487 = project.importFile(new ImportOptions(gradedFilePoignees487));
        gradedFootage487.parentFolder = fromGradingFolder;
        gradedFootage487.name = "UNDLM_00487_AVEC_POIGNEES";
        gradingSources[487] = gradedFootage487;
        gradingImportCount++;
        gradedImportSuccess487 = true;
        gradedFileName487 = "UNDLM_00487_AVEC_POIGNEES.mov";
        logImportSuccess(487, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00487_AVEC_POIGNEES.mov", gradedFileName487);
    } catch (e) {
        logImportError(487, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00487_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess487 && gradedFileBis487.exists) {
    try {
        var gradedFootage487 = project.importFile(new ImportOptions(gradedFileBis487));
        gradedFootage487.parentFolder = fromGradingFolder;
        gradedFootage487.name = "UNDLM_00487bis";
        gradingSources[487] = gradedFootage487;
        gradingImportCount++;
        gradedImportSuccess487 = true;
        gradedFileName487 = "UNDLM_00487bis.mov";
        logImportSuccess(487, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00487bis.mov", gradedFileName487);
    } catch (e) {
        logImportError(487, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00487bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess487) {
    missingGradingCount++;
}

// Import plan GRADED 00491
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile491 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00491.mov");
var gradedFilePoignees491 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00491_AVEC_POIGNEES.mov");
var gradedFileBis491 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00491bis.mov");

var gradedImportSuccess491 = false;
var gradedFileName491 = "";

// Tenter import standard
if (gradedFile491.exists) {
    try {
        var gradedFootage491 = project.importFile(new ImportOptions(gradedFile491));
        gradedFootage491.parentFolder = fromGradingFolder;
        gradedFootage491.name = "UNDLM_00491";
        gradingSources[491] = gradedFootage491;
        gradingImportCount++;
        gradedImportSuccess491 = true;
        gradedFileName491 = "UNDLM_00491.mov";
        logImportSuccess(491, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00491.mov", gradedFileName491);
    } catch (e) {
        logImportError(491, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00491.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess491 && gradedFilePoignees491.exists) {
    try {
        var gradedFootage491 = project.importFile(new ImportOptions(gradedFilePoignees491));
        gradedFootage491.parentFolder = fromGradingFolder;
        gradedFootage491.name = "UNDLM_00491_AVEC_POIGNEES";
        gradingSources[491] = gradedFootage491;
        gradingImportCount++;
        gradedImportSuccess491 = true;
        gradedFileName491 = "UNDLM_00491_AVEC_POIGNEES.mov";
        logImportSuccess(491, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00491_AVEC_POIGNEES.mov", gradedFileName491);
    } catch (e) {
        logImportError(491, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00491_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess491 && gradedFileBis491.exists) {
    try {
        var gradedFootage491 = project.importFile(new ImportOptions(gradedFileBis491));
        gradedFootage491.parentFolder = fromGradingFolder;
        gradedFootage491.name = "UNDLM_00491bis";
        gradingSources[491] = gradedFootage491;
        gradingImportCount++;
        gradedImportSuccess491 = true;
        gradedFileName491 = "UNDLM_00491bis.mov";
        logImportSuccess(491, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00491bis.mov", gradedFileName491);
    } catch (e) {
        logImportError(491, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00491bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess491) {
    missingGradingCount++;
}

// Import plan GRADED 00493
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile493 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00493.mov");
var gradedFilePoignees493 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00493_AVEC_POIGNEES.mov");
var gradedFileBis493 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00493bis.mov");

var gradedImportSuccess493 = false;
var gradedFileName493 = "";

// Tenter import standard
if (gradedFile493.exists) {
    try {
        var gradedFootage493 = project.importFile(new ImportOptions(gradedFile493));
        gradedFootage493.parentFolder = fromGradingFolder;
        gradedFootage493.name = "UNDLM_00493";
        gradingSources[493] = gradedFootage493;
        gradingImportCount++;
        gradedImportSuccess493 = true;
        gradedFileName493 = "UNDLM_00493.mov";
        logImportSuccess(493, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00493.mov", gradedFileName493);
    } catch (e) {
        logImportError(493, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00493.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess493 && gradedFilePoignees493.exists) {
    try {
        var gradedFootage493 = project.importFile(new ImportOptions(gradedFilePoignees493));
        gradedFootage493.parentFolder = fromGradingFolder;
        gradedFootage493.name = "UNDLM_00493_AVEC_POIGNEES";
        gradingSources[493] = gradedFootage493;
        gradingImportCount++;
        gradedImportSuccess493 = true;
        gradedFileName493 = "UNDLM_00493_AVEC_POIGNEES.mov";
        logImportSuccess(493, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00493_AVEC_POIGNEES.mov", gradedFileName493);
    } catch (e) {
        logImportError(493, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00493_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess493 && gradedFileBis493.exists) {
    try {
        var gradedFootage493 = project.importFile(new ImportOptions(gradedFileBis493));
        gradedFootage493.parentFolder = fromGradingFolder;
        gradedFootage493.name = "UNDLM_00493bis";
        gradingSources[493] = gradedFootage493;
        gradingImportCount++;
        gradedImportSuccess493 = true;
        gradedFileName493 = "UNDLM_00493bis.mov";
        logImportSuccess(493, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00493bis.mov", gradedFileName493);
    } catch (e) {
        logImportError(493, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00493bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess493) {
    missingGradingCount++;
}

// Import plan GRADED 00494
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile494 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00494.mov");
var gradedFilePoignees494 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00494_AVEC_POIGNEES.mov");
var gradedFileBis494 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00494bis.mov");

var gradedImportSuccess494 = false;
var gradedFileName494 = "";

// Tenter import standard
if (gradedFile494.exists) {
    try {
        var gradedFootage494 = project.importFile(new ImportOptions(gradedFile494));
        gradedFootage494.parentFolder = fromGradingFolder;
        gradedFootage494.name = "UNDLM_00494";
        gradingSources[494] = gradedFootage494;
        gradingImportCount++;
        gradedImportSuccess494 = true;
        gradedFileName494 = "UNDLM_00494.mov";
        logImportSuccess(494, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00494.mov", gradedFileName494);
    } catch (e) {
        logImportError(494, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00494.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess494 && gradedFilePoignees494.exists) {
    try {
        var gradedFootage494 = project.importFile(new ImportOptions(gradedFilePoignees494));
        gradedFootage494.parentFolder = fromGradingFolder;
        gradedFootage494.name = "UNDLM_00494_AVEC_POIGNEES";
        gradingSources[494] = gradedFootage494;
        gradingImportCount++;
        gradedImportSuccess494 = true;
        gradedFileName494 = "UNDLM_00494_AVEC_POIGNEES.mov";
        logImportSuccess(494, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00494_AVEC_POIGNEES.mov", gradedFileName494);
    } catch (e) {
        logImportError(494, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00494_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess494 && gradedFileBis494.exists) {
    try {
        var gradedFootage494 = project.importFile(new ImportOptions(gradedFileBis494));
        gradedFootage494.parentFolder = fromGradingFolder;
        gradedFootage494.name = "UNDLM_00494bis";
        gradingSources[494] = gradedFootage494;
        gradingImportCount++;
        gradedImportSuccess494 = true;
        gradedFileName494 = "UNDLM_00494bis.mov";
        logImportSuccess(494, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00494bis.mov", gradedFileName494);
    } catch (e) {
        logImportError(494, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00494bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess494) {
    missingGradingCount++;
}

// Import plan GRADED 00495
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile495 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00495.mov");
var gradedFilePoignees495 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00495_AVEC_POIGNEES.mov");
var gradedFileBis495 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00495bis.mov");

var gradedImportSuccess495 = false;
var gradedFileName495 = "";

// Tenter import standard
if (gradedFile495.exists) {
    try {
        var gradedFootage495 = project.importFile(new ImportOptions(gradedFile495));
        gradedFootage495.parentFolder = fromGradingFolder;
        gradedFootage495.name = "UNDLM_00495";
        gradingSources[495] = gradedFootage495;
        gradingImportCount++;
        gradedImportSuccess495 = true;
        gradedFileName495 = "UNDLM_00495.mov";
        logImportSuccess(495, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00495.mov", gradedFileName495);
    } catch (e) {
        logImportError(495, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00495.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess495 && gradedFilePoignees495.exists) {
    try {
        var gradedFootage495 = project.importFile(new ImportOptions(gradedFilePoignees495));
        gradedFootage495.parentFolder = fromGradingFolder;
        gradedFootage495.name = "UNDLM_00495_AVEC_POIGNEES";
        gradingSources[495] = gradedFootage495;
        gradingImportCount++;
        gradedImportSuccess495 = true;
        gradedFileName495 = "UNDLM_00495_AVEC_POIGNEES.mov";
        logImportSuccess(495, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00495_AVEC_POIGNEES.mov", gradedFileName495);
    } catch (e) {
        logImportError(495, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00495_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess495 && gradedFileBis495.exists) {
    try {
        var gradedFootage495 = project.importFile(new ImportOptions(gradedFileBis495));
        gradedFootage495.parentFolder = fromGradingFolder;
        gradedFootage495.name = "UNDLM_00495bis";
        gradingSources[495] = gradedFootage495;
        gradingImportCount++;
        gradedImportSuccess495 = true;
        gradedFileName495 = "UNDLM_00495bis.mov";
        logImportSuccess(495, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00495bis.mov", gradedFileName495);
    } catch (e) {
        logImportError(495, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00495bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess495) {
    missingGradingCount++;
}

// Import plan GRADED 00496
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile496 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00496.mov");
var gradedFilePoignees496 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00496_AVEC_POIGNEES.mov");
var gradedFileBis496 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00496bis.mov");

var gradedImportSuccess496 = false;
var gradedFileName496 = "";

// Tenter import standard
if (gradedFile496.exists) {
    try {
        var gradedFootage496 = project.importFile(new ImportOptions(gradedFile496));
        gradedFootage496.parentFolder = fromGradingFolder;
        gradedFootage496.name = "UNDLM_00496";
        gradingSources[496] = gradedFootage496;
        gradingImportCount++;
        gradedImportSuccess496 = true;
        gradedFileName496 = "UNDLM_00496.mov";
        logImportSuccess(496, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00496.mov", gradedFileName496);
    } catch (e) {
        logImportError(496, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00496.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess496 && gradedFilePoignees496.exists) {
    try {
        var gradedFootage496 = project.importFile(new ImportOptions(gradedFilePoignees496));
        gradedFootage496.parentFolder = fromGradingFolder;
        gradedFootage496.name = "UNDLM_00496_AVEC_POIGNEES";
        gradingSources[496] = gradedFootage496;
        gradingImportCount++;
        gradedImportSuccess496 = true;
        gradedFileName496 = "UNDLM_00496_AVEC_POIGNEES.mov";
        logImportSuccess(496, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00496_AVEC_POIGNEES.mov", gradedFileName496);
    } catch (e) {
        logImportError(496, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00496_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess496 && gradedFileBis496.exists) {
    try {
        var gradedFootage496 = project.importFile(new ImportOptions(gradedFileBis496));
        gradedFootage496.parentFolder = fromGradingFolder;
        gradedFootage496.name = "UNDLM_00496bis";
        gradingSources[496] = gradedFootage496;
        gradingImportCount++;
        gradedImportSuccess496 = true;
        gradedFileName496 = "UNDLM_00496bis.mov";
        logImportSuccess(496, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00496bis.mov", gradedFileName496);
    } catch (e) {
        logImportError(496, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00496bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess496) {
    missingGradingCount++;
}

// Import plan GRADED 00497
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile497 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00497.mov");
var gradedFilePoignees497 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00497_AVEC_POIGNEES.mov");
var gradedFileBis497 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00497bis.mov");

var gradedImportSuccess497 = false;
var gradedFileName497 = "";

// Tenter import standard
if (gradedFile497.exists) {
    try {
        var gradedFootage497 = project.importFile(new ImportOptions(gradedFile497));
        gradedFootage497.parentFolder = fromGradingFolder;
        gradedFootage497.name = "UNDLM_00497";
        gradingSources[497] = gradedFootage497;
        gradingImportCount++;
        gradedImportSuccess497 = true;
        gradedFileName497 = "UNDLM_00497.mov";
        logImportSuccess(497, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00497.mov", gradedFileName497);
    } catch (e) {
        logImportError(497, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00497.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess497 && gradedFilePoignees497.exists) {
    try {
        var gradedFootage497 = project.importFile(new ImportOptions(gradedFilePoignees497));
        gradedFootage497.parentFolder = fromGradingFolder;
        gradedFootage497.name = "UNDLM_00497_AVEC_POIGNEES";
        gradingSources[497] = gradedFootage497;
        gradingImportCount++;
        gradedImportSuccess497 = true;
        gradedFileName497 = "UNDLM_00497_AVEC_POIGNEES.mov";
        logImportSuccess(497, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00497_AVEC_POIGNEES.mov", gradedFileName497);
    } catch (e) {
        logImportError(497, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00497_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess497 && gradedFileBis497.exists) {
    try {
        var gradedFootage497 = project.importFile(new ImportOptions(gradedFileBis497));
        gradedFootage497.parentFolder = fromGradingFolder;
        gradedFootage497.name = "UNDLM_00497bis";
        gradingSources[497] = gradedFootage497;
        gradingImportCount++;
        gradedImportSuccess497 = true;
        gradedFileName497 = "UNDLM_00497bis.mov";
        logImportSuccess(497, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00497bis.mov", gradedFileName497);
    } catch (e) {
        logImportError(497, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00497bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess497) {
    missingGradingCount++;
}

// Import plan GRADED 00498
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile498 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00498.mov");
var gradedFilePoignees498 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00498_AVEC_POIGNEES.mov");
var gradedFileBis498 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00498bis.mov");

var gradedImportSuccess498 = false;
var gradedFileName498 = "";

// Tenter import standard
if (gradedFile498.exists) {
    try {
        var gradedFootage498 = project.importFile(new ImportOptions(gradedFile498));
        gradedFootage498.parentFolder = fromGradingFolder;
        gradedFootage498.name = "UNDLM_00498";
        gradingSources[498] = gradedFootage498;
        gradingImportCount++;
        gradedImportSuccess498 = true;
        gradedFileName498 = "UNDLM_00498.mov";
        logImportSuccess(498, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00498.mov", gradedFileName498);
    } catch (e) {
        logImportError(498, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00498.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess498 && gradedFilePoignees498.exists) {
    try {
        var gradedFootage498 = project.importFile(new ImportOptions(gradedFilePoignees498));
        gradedFootage498.parentFolder = fromGradingFolder;
        gradedFootage498.name = "UNDLM_00498_AVEC_POIGNEES";
        gradingSources[498] = gradedFootage498;
        gradingImportCount++;
        gradedImportSuccess498 = true;
        gradedFileName498 = "UNDLM_00498_AVEC_POIGNEES.mov";
        logImportSuccess(498, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00498_AVEC_POIGNEES.mov", gradedFileName498);
    } catch (e) {
        logImportError(498, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00498_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess498 && gradedFileBis498.exists) {
    try {
        var gradedFootage498 = project.importFile(new ImportOptions(gradedFileBis498));
        gradedFootage498.parentFolder = fromGradingFolder;
        gradedFootage498.name = "UNDLM_00498bis";
        gradingSources[498] = gradedFootage498;
        gradingImportCount++;
        gradedImportSuccess498 = true;
        gradedFileName498 = "UNDLM_00498bis.mov";
        logImportSuccess(498, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00498bis.mov", gradedFileName498);
    } catch (e) {
        logImportError(498, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00498bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess498) {
    missingGradingCount++;
}

// Import plan GRADED 00499
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile499 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00499.mov");
var gradedFilePoignees499 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00499_AVEC_POIGNEES.mov");
var gradedFileBis499 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00499bis.mov");

var gradedImportSuccess499 = false;
var gradedFileName499 = "";

// Tenter import standard
if (gradedFile499.exists) {
    try {
        var gradedFootage499 = project.importFile(new ImportOptions(gradedFile499));
        gradedFootage499.parentFolder = fromGradingFolder;
        gradedFootage499.name = "UNDLM_00499";
        gradingSources[499] = gradedFootage499;
        gradingImportCount++;
        gradedImportSuccess499 = true;
        gradedFileName499 = "UNDLM_00499.mov";
        logImportSuccess(499, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00499.mov", gradedFileName499);
    } catch (e) {
        logImportError(499, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00499.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess499 && gradedFilePoignees499.exists) {
    try {
        var gradedFootage499 = project.importFile(new ImportOptions(gradedFilePoignees499));
        gradedFootage499.parentFolder = fromGradingFolder;
        gradedFootage499.name = "UNDLM_00499_AVEC_POIGNEES";
        gradingSources[499] = gradedFootage499;
        gradingImportCount++;
        gradedImportSuccess499 = true;
        gradedFileName499 = "UNDLM_00499_AVEC_POIGNEES.mov";
        logImportSuccess(499, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00499_AVEC_POIGNEES.mov", gradedFileName499);
    } catch (e) {
        logImportError(499, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00499_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess499 && gradedFileBis499.exists) {
    try {
        var gradedFootage499 = project.importFile(new ImportOptions(gradedFileBis499));
        gradedFootage499.parentFolder = fromGradingFolder;
        gradedFootage499.name = "UNDLM_00499bis";
        gradingSources[499] = gradedFootage499;
        gradingImportCount++;
        gradedImportSuccess499 = true;
        gradedFileName499 = "UNDLM_00499bis.mov";
        logImportSuccess(499, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00499bis.mov", gradedFileName499);
    } catch (e) {
        logImportError(499, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00499bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess499) {
    missingGradingCount++;
}

// Import plan GRADED 00500
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile500 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00500.mov");
var gradedFilePoignees500 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00500_AVEC_POIGNEES.mov");
var gradedFileBis500 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00500bis.mov");

var gradedImportSuccess500 = false;
var gradedFileName500 = "";

// Tenter import standard
if (gradedFile500.exists) {
    try {
        var gradedFootage500 = project.importFile(new ImportOptions(gradedFile500));
        gradedFootage500.parentFolder = fromGradingFolder;
        gradedFootage500.name = "UNDLM_00500";
        gradingSources[500] = gradedFootage500;
        gradingImportCount++;
        gradedImportSuccess500 = true;
        gradedFileName500 = "UNDLM_00500.mov";
        logImportSuccess(500, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00500.mov", gradedFileName500);
    } catch (e) {
        logImportError(500, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00500.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess500 && gradedFilePoignees500.exists) {
    try {
        var gradedFootage500 = project.importFile(new ImportOptions(gradedFilePoignees500));
        gradedFootage500.parentFolder = fromGradingFolder;
        gradedFootage500.name = "UNDLM_00500_AVEC_POIGNEES";
        gradingSources[500] = gradedFootage500;
        gradingImportCount++;
        gradedImportSuccess500 = true;
        gradedFileName500 = "UNDLM_00500_AVEC_POIGNEES.mov";
        logImportSuccess(500, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00500_AVEC_POIGNEES.mov", gradedFileName500);
    } catch (e) {
        logImportError(500, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00500_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess500 && gradedFileBis500.exists) {
    try {
        var gradedFootage500 = project.importFile(new ImportOptions(gradedFileBis500));
        gradedFootage500.parentFolder = fromGradingFolder;
        gradedFootage500.name = "UNDLM_00500bis";
        gradingSources[500] = gradedFootage500;
        gradingImportCount++;
        gradedImportSuccess500 = true;
        gradedFileName500 = "UNDLM_00500bis.mov";
        logImportSuccess(500, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00500bis.mov", gradedFileName500);
    } catch (e) {
        logImportError(500, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00500bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess500) {
    missingGradingCount++;
}

// Import plan GRADED 00501
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile501 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00501.mov");
var gradedFilePoignees501 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00501_AVEC_POIGNEES.mov");
var gradedFileBis501 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00501bis.mov");

var gradedImportSuccess501 = false;
var gradedFileName501 = "";

// Tenter import standard
if (gradedFile501.exists) {
    try {
        var gradedFootage501 = project.importFile(new ImportOptions(gradedFile501));
        gradedFootage501.parentFolder = fromGradingFolder;
        gradedFootage501.name = "UNDLM_00501";
        gradingSources[501] = gradedFootage501;
        gradingImportCount++;
        gradedImportSuccess501 = true;
        gradedFileName501 = "UNDLM_00501.mov";
        logImportSuccess(501, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00501.mov", gradedFileName501);
    } catch (e) {
        logImportError(501, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00501.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess501 && gradedFilePoignees501.exists) {
    try {
        var gradedFootage501 = project.importFile(new ImportOptions(gradedFilePoignees501));
        gradedFootage501.parentFolder = fromGradingFolder;
        gradedFootage501.name = "UNDLM_00501_AVEC_POIGNEES";
        gradingSources[501] = gradedFootage501;
        gradingImportCount++;
        gradedImportSuccess501 = true;
        gradedFileName501 = "UNDLM_00501_AVEC_POIGNEES.mov";
        logImportSuccess(501, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00501_AVEC_POIGNEES.mov", gradedFileName501);
    } catch (e) {
        logImportError(501, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00501_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess501 && gradedFileBis501.exists) {
    try {
        var gradedFootage501 = project.importFile(new ImportOptions(gradedFileBis501));
        gradedFootage501.parentFolder = fromGradingFolder;
        gradedFootage501.name = "UNDLM_00501bis";
        gradingSources[501] = gradedFootage501;
        gradingImportCount++;
        gradedImportSuccess501 = true;
        gradedFileName501 = "UNDLM_00501bis.mov";
        logImportSuccess(501, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00501bis.mov", gradedFileName501);
    } catch (e) {
        logImportError(501, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00501bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess501) {
    missingGradingCount++;
}

// Import plan GRADED 00502
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile502 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00502.mov");
var gradedFilePoignees502 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00502_AVEC_POIGNEES.mov");
var gradedFileBis502 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00502bis.mov");

var gradedImportSuccess502 = false;
var gradedFileName502 = "";

// Tenter import standard
if (gradedFile502.exists) {
    try {
        var gradedFootage502 = project.importFile(new ImportOptions(gradedFile502));
        gradedFootage502.parentFolder = fromGradingFolder;
        gradedFootage502.name = "UNDLM_00502";
        gradingSources[502] = gradedFootage502;
        gradingImportCount++;
        gradedImportSuccess502 = true;
        gradedFileName502 = "UNDLM_00502.mov";
        logImportSuccess(502, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00502.mov", gradedFileName502);
    } catch (e) {
        logImportError(502, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00502.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess502 && gradedFilePoignees502.exists) {
    try {
        var gradedFootage502 = project.importFile(new ImportOptions(gradedFilePoignees502));
        gradedFootage502.parentFolder = fromGradingFolder;
        gradedFootage502.name = "UNDLM_00502_AVEC_POIGNEES";
        gradingSources[502] = gradedFootage502;
        gradingImportCount++;
        gradedImportSuccess502 = true;
        gradedFileName502 = "UNDLM_00502_AVEC_POIGNEES.mov";
        logImportSuccess(502, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00502_AVEC_POIGNEES.mov", gradedFileName502);
    } catch (e) {
        logImportError(502, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00502_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess502 && gradedFileBis502.exists) {
    try {
        var gradedFootage502 = project.importFile(new ImportOptions(gradedFileBis502));
        gradedFootage502.parentFolder = fromGradingFolder;
        gradedFootage502.name = "UNDLM_00502bis";
        gradingSources[502] = gradedFootage502;
        gradingImportCount++;
        gradedImportSuccess502 = true;
        gradedFileName502 = "UNDLM_00502bis.mov";
        logImportSuccess(502, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00502bis.mov", gradedFileName502);
    } catch (e) {
        logImportError(502, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00502bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess502) {
    missingGradingCount++;
}

// Import plan GRADED 00503
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile503 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00503.mov");
var gradedFilePoignees503 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00503_AVEC_POIGNEES.mov");
var gradedFileBis503 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00503bis.mov");

var gradedImportSuccess503 = false;
var gradedFileName503 = "";

// Tenter import standard
if (gradedFile503.exists) {
    try {
        var gradedFootage503 = project.importFile(new ImportOptions(gradedFile503));
        gradedFootage503.parentFolder = fromGradingFolder;
        gradedFootage503.name = "UNDLM_00503";
        gradingSources[503] = gradedFootage503;
        gradingImportCount++;
        gradedImportSuccess503 = true;
        gradedFileName503 = "UNDLM_00503.mov";
        logImportSuccess(503, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00503.mov", gradedFileName503);
    } catch (e) {
        logImportError(503, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00503.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess503 && gradedFilePoignees503.exists) {
    try {
        var gradedFootage503 = project.importFile(new ImportOptions(gradedFilePoignees503));
        gradedFootage503.parentFolder = fromGradingFolder;
        gradedFootage503.name = "UNDLM_00503_AVEC_POIGNEES";
        gradingSources[503] = gradedFootage503;
        gradingImportCount++;
        gradedImportSuccess503 = true;
        gradedFileName503 = "UNDLM_00503_AVEC_POIGNEES.mov";
        logImportSuccess(503, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00503_AVEC_POIGNEES.mov", gradedFileName503);
    } catch (e) {
        logImportError(503, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00503_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess503 && gradedFileBis503.exists) {
    try {
        var gradedFootage503 = project.importFile(new ImportOptions(gradedFileBis503));
        gradedFootage503.parentFolder = fromGradingFolder;
        gradedFootage503.name = "UNDLM_00503bis";
        gradingSources[503] = gradedFootage503;
        gradingImportCount++;
        gradedImportSuccess503 = true;
        gradedFileName503 = "UNDLM_00503bis.mov";
        logImportSuccess(503, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00503bis.mov", gradedFileName503);
    } catch (e) {
        logImportError(503, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00503bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess503) {
    missingGradingCount++;
}

// Import plan GRADED 00504
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile504 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00504.mov");
var gradedFilePoignees504 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00504_AVEC_POIGNEES.mov");
var gradedFileBis504 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00504bis.mov");

var gradedImportSuccess504 = false;
var gradedFileName504 = "";

// Tenter import standard
if (gradedFile504.exists) {
    try {
        var gradedFootage504 = project.importFile(new ImportOptions(gradedFile504));
        gradedFootage504.parentFolder = fromGradingFolder;
        gradedFootage504.name = "UNDLM_00504";
        gradingSources[504] = gradedFootage504;
        gradingImportCount++;
        gradedImportSuccess504 = true;
        gradedFileName504 = "UNDLM_00504.mov";
        logImportSuccess(504, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00504.mov", gradedFileName504);
    } catch (e) {
        logImportError(504, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00504.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess504 && gradedFilePoignees504.exists) {
    try {
        var gradedFootage504 = project.importFile(new ImportOptions(gradedFilePoignees504));
        gradedFootage504.parentFolder = fromGradingFolder;
        gradedFootage504.name = "UNDLM_00504_AVEC_POIGNEES";
        gradingSources[504] = gradedFootage504;
        gradingImportCount++;
        gradedImportSuccess504 = true;
        gradedFileName504 = "UNDLM_00504_AVEC_POIGNEES.mov";
        logImportSuccess(504, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00504_AVEC_POIGNEES.mov", gradedFileName504);
    } catch (e) {
        logImportError(504, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00504_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess504 && gradedFileBis504.exists) {
    try {
        var gradedFootage504 = project.importFile(new ImportOptions(gradedFileBis504));
        gradedFootage504.parentFolder = fromGradingFolder;
        gradedFootage504.name = "UNDLM_00504bis";
        gradingSources[504] = gradedFootage504;
        gradingImportCount++;
        gradedImportSuccess504 = true;
        gradedFileName504 = "UNDLM_00504bis.mov";
        logImportSuccess(504, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00504bis.mov", gradedFileName504);
    } catch (e) {
        logImportError(504, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00504bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess504) {
    missingGradingCount++;
}

// Import plan GRADED 00505
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile505 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00505.mov");
var gradedFilePoignees505 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00505_AVEC_POIGNEES.mov");
var gradedFileBis505 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00505bis.mov");

var gradedImportSuccess505 = false;
var gradedFileName505 = "";

// Tenter import standard
if (gradedFile505.exists) {
    try {
        var gradedFootage505 = project.importFile(new ImportOptions(gradedFile505));
        gradedFootage505.parentFolder = fromGradingFolder;
        gradedFootage505.name = "UNDLM_00505";
        gradingSources[505] = gradedFootage505;
        gradingImportCount++;
        gradedImportSuccess505 = true;
        gradedFileName505 = "UNDLM_00505.mov";
        logImportSuccess(505, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00505.mov", gradedFileName505);
    } catch (e) {
        logImportError(505, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00505.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess505 && gradedFilePoignees505.exists) {
    try {
        var gradedFootage505 = project.importFile(new ImportOptions(gradedFilePoignees505));
        gradedFootage505.parentFolder = fromGradingFolder;
        gradedFootage505.name = "UNDLM_00505_AVEC_POIGNEES";
        gradingSources[505] = gradedFootage505;
        gradingImportCount++;
        gradedImportSuccess505 = true;
        gradedFileName505 = "UNDLM_00505_AVEC_POIGNEES.mov";
        logImportSuccess(505, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00505_AVEC_POIGNEES.mov", gradedFileName505);
    } catch (e) {
        logImportError(505, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00505_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess505 && gradedFileBis505.exists) {
    try {
        var gradedFootage505 = project.importFile(new ImportOptions(gradedFileBis505));
        gradedFootage505.parentFolder = fromGradingFolder;
        gradedFootage505.name = "UNDLM_00505bis";
        gradingSources[505] = gradedFootage505;
        gradingImportCount++;
        gradedImportSuccess505 = true;
        gradedFileName505 = "UNDLM_00505bis.mov";
        logImportSuccess(505, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00505bis.mov", gradedFileName505);
    } catch (e) {
        logImportError(505, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00505bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess505) {
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


// Composition pour plan 00479
var planComp479 = project.items.addComp(
    "SQ27_UNDLM_00479_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp479.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer479 = planComp479.layers.add(bgSolidComp);
bgLayer479.name = "BG_SOLID";
bgLayer479.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer479 = false;
if (gradingSources[479]) {
    var gradedLayer479 = planComp479.layers.add(gradingSources[479]);
    gradedLayer479.name = "UNDLM_00479_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer479.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer479.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer479 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer479 = false;
if (editSources[479]) {
    var editLayer479 = planComp479.layers.add(editSources[479]);
    editLayer479.name = "UNDLM_00479_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer479.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer479.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer479 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity479 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer479) {
    // EDIT toujours activé quand disponible
    editLayer479.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer479) {
        gradedLayer479.enabled = false;
    }
} else if (hasGradedLayer479) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer479.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText479 = planComp479.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText479.name = "WARNING_NO_EDIT";
    warningText479.property("Transform").property("Position").setValue([1280, 200]);
    warningText479.guideLayer = true;
    
    var warningTextDoc479 = warningText479.property("Source Text").value;
    warningTextDoc479.fontSize = 32;
    warningTextDoc479.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc479.font = "Arial-BoldMT";
    warningTextDoc479.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText479.property("Source Text").setValue(warningTextDoc479);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText479 = planComp479.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00479");
    errorText479.name = "ERROR_NO_SOURCE";
    errorText479.property("Transform").property("Position").setValue([1280, 720]);
    errorText479.guideLayer = true;
    
    var errorTextDoc479 = errorText479.property("Source Text").value;
    errorTextDoc479.fontSize = 48;
    errorTextDoc479.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc479.font = "Arial-BoldMT";
    errorTextDoc479.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText479.property("Source Text").setValue(errorTextDoc479);
}

planCompositions[479] = planComp479;


// Composition pour plan 00480
var planComp480 = project.items.addComp(
    "SQ27_UNDLM_00480_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp480.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer480 = planComp480.layers.add(bgSolidComp);
bgLayer480.name = "BG_SOLID";
bgLayer480.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer480 = false;
if (gradingSources[480]) {
    var gradedLayer480 = planComp480.layers.add(gradingSources[480]);
    gradedLayer480.name = "UNDLM_00480_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer480.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer480.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer480 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer480 = false;
if (editSources[480]) {
    var editLayer480 = planComp480.layers.add(editSources[480]);
    editLayer480.name = "UNDLM_00480_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer480.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer480.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer480 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity480 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer480) {
    // EDIT toujours activé quand disponible
    editLayer480.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer480) {
        gradedLayer480.enabled = false;
    }
} else if (hasGradedLayer480) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer480.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText480 = planComp480.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText480.name = "WARNING_NO_EDIT";
    warningText480.property("Transform").property("Position").setValue([1280, 200]);
    warningText480.guideLayer = true;
    
    var warningTextDoc480 = warningText480.property("Source Text").value;
    warningTextDoc480.fontSize = 32;
    warningTextDoc480.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc480.font = "Arial-BoldMT";
    warningTextDoc480.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText480.property("Source Text").setValue(warningTextDoc480);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText480 = planComp480.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00480");
    errorText480.name = "ERROR_NO_SOURCE";
    errorText480.property("Transform").property("Position").setValue([1280, 720]);
    errorText480.guideLayer = true;
    
    var errorTextDoc480 = errorText480.property("Source Text").value;
    errorTextDoc480.fontSize = 48;
    errorTextDoc480.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc480.font = "Arial-BoldMT";
    errorTextDoc480.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText480.property("Source Text").setValue(errorTextDoc480);
}

planCompositions[480] = planComp480;


// Composition pour plan 00481
var planComp481 = project.items.addComp(
    "SQ27_UNDLM_00481_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    13.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp481.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer481 = planComp481.layers.add(bgSolidComp);
bgLayer481.name = "BG_SOLID";
bgLayer481.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer481 = false;
if (gradingSources[481]) {
    var gradedLayer481 = planComp481.layers.add(gradingSources[481]);
    gradedLayer481.name = "UNDLM_00481_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer481.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer481.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer481 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer481 = false;
if (editSources[481]) {
    var editLayer481 = planComp481.layers.add(editSources[481]);
    editLayer481.name = "UNDLM_00481_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer481.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer481.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer481 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity481 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer481) {
    // EDIT toujours activé quand disponible
    editLayer481.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer481) {
        gradedLayer481.enabled = false;
    }
} else if (hasGradedLayer481) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer481.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText481 = planComp481.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText481.name = "WARNING_NO_EDIT";
    warningText481.property("Transform").property("Position").setValue([1280, 200]);
    warningText481.guideLayer = true;
    
    var warningTextDoc481 = warningText481.property("Source Text").value;
    warningTextDoc481.fontSize = 32;
    warningTextDoc481.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc481.font = "Arial-BoldMT";
    warningTextDoc481.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText481.property("Source Text").setValue(warningTextDoc481);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText481 = planComp481.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00481");
    errorText481.name = "ERROR_NO_SOURCE";
    errorText481.property("Transform").property("Position").setValue([1280, 720]);
    errorText481.guideLayer = true;
    
    var errorTextDoc481 = errorText481.property("Source Text").value;
    errorTextDoc481.fontSize = 48;
    errorTextDoc481.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc481.font = "Arial-BoldMT";
    errorTextDoc481.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText481.property("Source Text").setValue(errorTextDoc481);
}

planCompositions[481] = planComp481;


// Composition pour plan 00482
var planComp482 = project.items.addComp(
    "SQ27_UNDLM_00482_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp482.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer482 = planComp482.layers.add(bgSolidComp);
bgLayer482.name = "BG_SOLID";
bgLayer482.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer482 = false;
if (gradingSources[482]) {
    var gradedLayer482 = planComp482.layers.add(gradingSources[482]);
    gradedLayer482.name = "UNDLM_00482_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer482.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer482.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer482 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer482 = false;
if (editSources[482]) {
    var editLayer482 = planComp482.layers.add(editSources[482]);
    editLayer482.name = "UNDLM_00482_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer482.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer482.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer482 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity482 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer482) {
    // EDIT toujours activé quand disponible
    editLayer482.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer482) {
        gradedLayer482.enabled = false;
    }
} else if (hasGradedLayer482) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer482.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText482 = planComp482.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText482.name = "WARNING_NO_EDIT";
    warningText482.property("Transform").property("Position").setValue([1280, 200]);
    warningText482.guideLayer = true;
    
    var warningTextDoc482 = warningText482.property("Source Text").value;
    warningTextDoc482.fontSize = 32;
    warningTextDoc482.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc482.font = "Arial-BoldMT";
    warningTextDoc482.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText482.property("Source Text").setValue(warningTextDoc482);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText482 = planComp482.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00482");
    errorText482.name = "ERROR_NO_SOURCE";
    errorText482.property("Transform").property("Position").setValue([1280, 720]);
    errorText482.guideLayer = true;
    
    var errorTextDoc482 = errorText482.property("Source Text").value;
    errorTextDoc482.fontSize = 48;
    errorTextDoc482.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc482.font = "Arial-BoldMT";
    errorTextDoc482.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText482.property("Source Text").setValue(errorTextDoc482);
}

planCompositions[482] = planComp482;


// Composition pour plan 00483
var planComp483 = project.items.addComp(
    "SQ27_UNDLM_00483_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp483.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer483 = planComp483.layers.add(bgSolidComp);
bgLayer483.name = "BG_SOLID";
bgLayer483.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer483 = false;
if (gradingSources[483]) {
    var gradedLayer483 = planComp483.layers.add(gradingSources[483]);
    gradedLayer483.name = "UNDLM_00483_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer483.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer483.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer483 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer483 = false;
if (editSources[483]) {
    var editLayer483 = planComp483.layers.add(editSources[483]);
    editLayer483.name = "UNDLM_00483_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer483.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer483.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer483 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity483 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer483) {
    // EDIT toujours activé quand disponible
    editLayer483.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer483) {
        gradedLayer483.enabled = false;
    }
} else if (hasGradedLayer483) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer483.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText483 = planComp483.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText483.name = "WARNING_NO_EDIT";
    warningText483.property("Transform").property("Position").setValue([1280, 200]);
    warningText483.guideLayer = true;
    
    var warningTextDoc483 = warningText483.property("Source Text").value;
    warningTextDoc483.fontSize = 32;
    warningTextDoc483.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc483.font = "Arial-BoldMT";
    warningTextDoc483.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText483.property("Source Text").setValue(warningTextDoc483);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText483 = planComp483.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00483");
    errorText483.name = "ERROR_NO_SOURCE";
    errorText483.property("Transform").property("Position").setValue([1280, 720]);
    errorText483.guideLayer = true;
    
    var errorTextDoc483 = errorText483.property("Source Text").value;
    errorTextDoc483.fontSize = 48;
    errorTextDoc483.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc483.font = "Arial-BoldMT";
    errorTextDoc483.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText483.property("Source Text").setValue(errorTextDoc483);
}

planCompositions[483] = planComp483;


// Composition pour plan 00484
var planComp484 = project.items.addComp(
    "SQ27_UNDLM_00484_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp484.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer484 = planComp484.layers.add(bgSolidComp);
bgLayer484.name = "BG_SOLID";
bgLayer484.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer484 = false;
if (gradingSources[484]) {
    var gradedLayer484 = planComp484.layers.add(gradingSources[484]);
    gradedLayer484.name = "UNDLM_00484_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer484.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer484.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer484 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer484 = false;
if (editSources[484]) {
    var editLayer484 = planComp484.layers.add(editSources[484]);
    editLayer484.name = "UNDLM_00484_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer484.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer484.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer484 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity484 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer484) {
    // EDIT toujours activé quand disponible
    editLayer484.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer484) {
        gradedLayer484.enabled = false;
    }
} else if (hasGradedLayer484) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer484.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText484 = planComp484.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText484.name = "WARNING_NO_EDIT";
    warningText484.property("Transform").property("Position").setValue([1280, 200]);
    warningText484.guideLayer = true;
    
    var warningTextDoc484 = warningText484.property("Source Text").value;
    warningTextDoc484.fontSize = 32;
    warningTextDoc484.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc484.font = "Arial-BoldMT";
    warningTextDoc484.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText484.property("Source Text").setValue(warningTextDoc484);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText484 = planComp484.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00484");
    errorText484.name = "ERROR_NO_SOURCE";
    errorText484.property("Transform").property("Position").setValue([1280, 720]);
    errorText484.guideLayer = true;
    
    var errorTextDoc484 = errorText484.property("Source Text").value;
    errorTextDoc484.fontSize = 48;
    errorTextDoc484.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc484.font = "Arial-BoldMT";
    errorTextDoc484.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText484.property("Source Text").setValue(errorTextDoc484);
}

planCompositions[484] = planComp484;


// Composition pour plan 00485
var planComp485 = project.items.addComp(
    "SQ27_UNDLM_00485_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp485.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer485 = planComp485.layers.add(bgSolidComp);
bgLayer485.name = "BG_SOLID";
bgLayer485.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer485 = false;
if (gradingSources[485]) {
    var gradedLayer485 = planComp485.layers.add(gradingSources[485]);
    gradedLayer485.name = "UNDLM_00485_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer485.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer485.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer485 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer485 = false;
if (editSources[485]) {
    var editLayer485 = planComp485.layers.add(editSources[485]);
    editLayer485.name = "UNDLM_00485_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer485.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer485.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer485 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity485 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer485) {
    // EDIT toujours activé quand disponible
    editLayer485.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer485) {
        gradedLayer485.enabled = false;
    }
} else if (hasGradedLayer485) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer485.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText485 = planComp485.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText485.name = "WARNING_NO_EDIT";
    warningText485.property("Transform").property("Position").setValue([1280, 200]);
    warningText485.guideLayer = true;
    
    var warningTextDoc485 = warningText485.property("Source Text").value;
    warningTextDoc485.fontSize = 32;
    warningTextDoc485.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc485.font = "Arial-BoldMT";
    warningTextDoc485.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText485.property("Source Text").setValue(warningTextDoc485);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText485 = planComp485.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00485");
    errorText485.name = "ERROR_NO_SOURCE";
    errorText485.property("Transform").property("Position").setValue([1280, 720]);
    errorText485.guideLayer = true;
    
    var errorTextDoc485 = errorText485.property("Source Text").value;
    errorTextDoc485.fontSize = 48;
    errorTextDoc485.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc485.font = "Arial-BoldMT";
    errorTextDoc485.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText485.property("Source Text").setValue(errorTextDoc485);
}

planCompositions[485] = planComp485;


// Composition pour plan 00486
var planComp486 = project.items.addComp(
    "SQ27_UNDLM_00486_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp486.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer486 = planComp486.layers.add(bgSolidComp);
bgLayer486.name = "BG_SOLID";
bgLayer486.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer486 = false;
if (gradingSources[486]) {
    var gradedLayer486 = planComp486.layers.add(gradingSources[486]);
    gradedLayer486.name = "UNDLM_00486_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer486.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer486.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer486 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer486 = false;
if (editSources[486]) {
    var editLayer486 = planComp486.layers.add(editSources[486]);
    editLayer486.name = "UNDLM_00486_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer486.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer486.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer486 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity486 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer486) {
    // EDIT toujours activé quand disponible
    editLayer486.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer486) {
        gradedLayer486.enabled = false;
    }
} else if (hasGradedLayer486) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer486.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText486 = planComp486.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText486.name = "WARNING_NO_EDIT";
    warningText486.property("Transform").property("Position").setValue([1280, 200]);
    warningText486.guideLayer = true;
    
    var warningTextDoc486 = warningText486.property("Source Text").value;
    warningTextDoc486.fontSize = 32;
    warningTextDoc486.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc486.font = "Arial-BoldMT";
    warningTextDoc486.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText486.property("Source Text").setValue(warningTextDoc486);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText486 = planComp486.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00486");
    errorText486.name = "ERROR_NO_SOURCE";
    errorText486.property("Transform").property("Position").setValue([1280, 720]);
    errorText486.guideLayer = true;
    
    var errorTextDoc486 = errorText486.property("Source Text").value;
    errorTextDoc486.fontSize = 48;
    errorTextDoc486.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc486.font = "Arial-BoldMT";
    errorTextDoc486.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText486.property("Source Text").setValue(errorTextDoc486);
}

planCompositions[486] = planComp486;


// Composition pour plan 00487
var planComp487 = project.items.addComp(
    "SQ27_UNDLM_00487_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp487.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer487 = planComp487.layers.add(bgSolidComp);
bgLayer487.name = "BG_SOLID";
bgLayer487.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer487 = false;
if (gradingSources[487]) {
    var gradedLayer487 = planComp487.layers.add(gradingSources[487]);
    gradedLayer487.name = "UNDLM_00487_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer487.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer487.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer487 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer487 = false;
if (editSources[487]) {
    var editLayer487 = planComp487.layers.add(editSources[487]);
    editLayer487.name = "UNDLM_00487_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer487.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer487.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer487 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity487 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer487) {
    // EDIT toujours activé quand disponible
    editLayer487.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer487) {
        gradedLayer487.enabled = false;
    }
} else if (hasGradedLayer487) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer487.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText487 = planComp487.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText487.name = "WARNING_NO_EDIT";
    warningText487.property("Transform").property("Position").setValue([1280, 200]);
    warningText487.guideLayer = true;
    
    var warningTextDoc487 = warningText487.property("Source Text").value;
    warningTextDoc487.fontSize = 32;
    warningTextDoc487.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc487.font = "Arial-BoldMT";
    warningTextDoc487.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText487.property("Source Text").setValue(warningTextDoc487);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText487 = planComp487.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00487");
    errorText487.name = "ERROR_NO_SOURCE";
    errorText487.property("Transform").property("Position").setValue([1280, 720]);
    errorText487.guideLayer = true;
    
    var errorTextDoc487 = errorText487.property("Source Text").value;
    errorTextDoc487.fontSize = 48;
    errorTextDoc487.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc487.font = "Arial-BoldMT";
    errorTextDoc487.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText487.property("Source Text").setValue(errorTextDoc487);
}

planCompositions[487] = planComp487;


// Composition pour plan 00488
var planComp488 = project.items.addComp(
    "SQ27_UNDLM_00488_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp488.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer488 = planComp488.layers.add(bgSolidComp);
bgLayer488.name = "BG_SOLID";
bgLayer488.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer488 = false;
if (gradingSources[488]) {
    var gradedLayer488 = planComp488.layers.add(gradingSources[488]);
    gradedLayer488.name = "UNDLM_00488_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer488.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer488.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer488 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer488 = false;
if (editSources[488]) {
    var editLayer488 = planComp488.layers.add(editSources[488]);
    editLayer488.name = "UNDLM_00488_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer488.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer488.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer488 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity488 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer488) {
    // EDIT toujours activé quand disponible
    editLayer488.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer488) {
        gradedLayer488.enabled = false;
    }
} else if (hasGradedLayer488) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer488.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText488 = planComp488.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText488.name = "WARNING_NO_EDIT";
    warningText488.property("Transform").property("Position").setValue([1280, 200]);
    warningText488.guideLayer = true;
    
    var warningTextDoc488 = warningText488.property("Source Text").value;
    warningTextDoc488.fontSize = 32;
    warningTextDoc488.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc488.font = "Arial-BoldMT";
    warningTextDoc488.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText488.property("Source Text").setValue(warningTextDoc488);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText488 = planComp488.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00488");
    errorText488.name = "ERROR_NO_SOURCE";
    errorText488.property("Transform").property("Position").setValue([1280, 720]);
    errorText488.guideLayer = true;
    
    var errorTextDoc488 = errorText488.property("Source Text").value;
    errorTextDoc488.fontSize = 48;
    errorTextDoc488.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc488.font = "Arial-BoldMT";
    errorTextDoc488.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText488.property("Source Text").setValue(errorTextDoc488);
}

planCompositions[488] = planComp488;


// Composition pour plan 00489
var planComp489 = project.items.addComp(
    "SQ27_UNDLM_00489_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.32,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp489.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer489 = planComp489.layers.add(bgSolidComp);
bgLayer489.name = "BG_SOLID";
bgLayer489.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer489 = false;
if (gradingSources[489]) {
    var gradedLayer489 = planComp489.layers.add(gradingSources[489]);
    gradedLayer489.name = "UNDLM_00489_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer489.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer489.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer489 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer489 = false;
if (editSources[489]) {
    var editLayer489 = planComp489.layers.add(editSources[489]);
    editLayer489.name = "UNDLM_00489_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer489.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer489.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer489 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity489 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer489) {
    // EDIT toujours activé quand disponible
    editLayer489.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer489) {
        gradedLayer489.enabled = false;
    }
} else if (hasGradedLayer489) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer489.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText489 = planComp489.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText489.name = "WARNING_NO_EDIT";
    warningText489.property("Transform").property("Position").setValue([1280, 200]);
    warningText489.guideLayer = true;
    
    var warningTextDoc489 = warningText489.property("Source Text").value;
    warningTextDoc489.fontSize = 32;
    warningTextDoc489.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc489.font = "Arial-BoldMT";
    warningTextDoc489.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText489.property("Source Text").setValue(warningTextDoc489);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText489 = planComp489.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00489");
    errorText489.name = "ERROR_NO_SOURCE";
    errorText489.property("Transform").property("Position").setValue([1280, 720]);
    errorText489.guideLayer = true;
    
    var errorTextDoc489 = errorText489.property("Source Text").value;
    errorTextDoc489.fontSize = 48;
    errorTextDoc489.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc489.font = "Arial-BoldMT";
    errorTextDoc489.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText489.property("Source Text").setValue(errorTextDoc489);
}

planCompositions[489] = planComp489;


// Composition pour plan 00490
var planComp490 = project.items.addComp(
    "SQ27_UNDLM_00490_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp490.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer490 = planComp490.layers.add(bgSolidComp);
bgLayer490.name = "BG_SOLID";
bgLayer490.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer490 = false;
if (gradingSources[490]) {
    var gradedLayer490 = planComp490.layers.add(gradingSources[490]);
    gradedLayer490.name = "UNDLM_00490_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer490.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer490.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer490 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer490 = false;
if (editSources[490]) {
    var editLayer490 = planComp490.layers.add(editSources[490]);
    editLayer490.name = "UNDLM_00490_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer490.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer490.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer490 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity490 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer490) {
    // EDIT toujours activé quand disponible
    editLayer490.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer490) {
        gradedLayer490.enabled = false;
    }
} else if (hasGradedLayer490) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer490.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText490 = planComp490.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText490.name = "WARNING_NO_EDIT";
    warningText490.property("Transform").property("Position").setValue([1280, 200]);
    warningText490.guideLayer = true;
    
    var warningTextDoc490 = warningText490.property("Source Text").value;
    warningTextDoc490.fontSize = 32;
    warningTextDoc490.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc490.font = "Arial-BoldMT";
    warningTextDoc490.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText490.property("Source Text").setValue(warningTextDoc490);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText490 = planComp490.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00490");
    errorText490.name = "ERROR_NO_SOURCE";
    errorText490.property("Transform").property("Position").setValue([1280, 720]);
    errorText490.guideLayer = true;
    
    var errorTextDoc490 = errorText490.property("Source Text").value;
    errorTextDoc490.fontSize = 48;
    errorTextDoc490.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc490.font = "Arial-BoldMT";
    errorTextDoc490.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText490.property("Source Text").setValue(errorTextDoc490);
}

planCompositions[490] = planComp490;


// Composition pour plan 00491
var planComp491 = project.items.addComp(
    "SQ27_UNDLM_00491_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    13.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp491.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer491 = planComp491.layers.add(bgSolidComp);
bgLayer491.name = "BG_SOLID";
bgLayer491.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer491 = false;
if (gradingSources[491]) {
    var gradedLayer491 = planComp491.layers.add(gradingSources[491]);
    gradedLayer491.name = "UNDLM_00491_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer491.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer491.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer491 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer491 = false;
if (editSources[491]) {
    var editLayer491 = planComp491.layers.add(editSources[491]);
    editLayer491.name = "UNDLM_00491_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer491.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer491.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer491 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity491 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer491) {
    // EDIT toujours activé quand disponible
    editLayer491.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer491) {
        gradedLayer491.enabled = false;
    }
} else if (hasGradedLayer491) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer491.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText491 = planComp491.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText491.name = "WARNING_NO_EDIT";
    warningText491.property("Transform").property("Position").setValue([1280, 200]);
    warningText491.guideLayer = true;
    
    var warningTextDoc491 = warningText491.property("Source Text").value;
    warningTextDoc491.fontSize = 32;
    warningTextDoc491.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc491.font = "Arial-BoldMT";
    warningTextDoc491.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText491.property("Source Text").setValue(warningTextDoc491);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText491 = planComp491.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00491");
    errorText491.name = "ERROR_NO_SOURCE";
    errorText491.property("Transform").property("Position").setValue([1280, 720]);
    errorText491.guideLayer = true;
    
    var errorTextDoc491 = errorText491.property("Source Text").value;
    errorTextDoc491.fontSize = 48;
    errorTextDoc491.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc491.font = "Arial-BoldMT";
    errorTextDoc491.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText491.property("Source Text").setValue(errorTextDoc491);
}

planCompositions[491] = planComp491;


// Composition pour plan 00492
var planComp492 = project.items.addComp(
    "SQ27_UNDLM_00492_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp492.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer492 = planComp492.layers.add(bgSolidComp);
bgLayer492.name = "BG_SOLID";
bgLayer492.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer492 = false;
if (gradingSources[492]) {
    var gradedLayer492 = planComp492.layers.add(gradingSources[492]);
    gradedLayer492.name = "UNDLM_00492_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer492.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer492.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer492 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer492 = false;
if (editSources[492]) {
    var editLayer492 = planComp492.layers.add(editSources[492]);
    editLayer492.name = "UNDLM_00492_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer492.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer492.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer492 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity492 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer492) {
    // EDIT toujours activé quand disponible
    editLayer492.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer492) {
        gradedLayer492.enabled = false;
    }
} else if (hasGradedLayer492) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer492.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText492 = planComp492.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText492.name = "WARNING_NO_EDIT";
    warningText492.property("Transform").property("Position").setValue([1280, 200]);
    warningText492.guideLayer = true;
    
    var warningTextDoc492 = warningText492.property("Source Text").value;
    warningTextDoc492.fontSize = 32;
    warningTextDoc492.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc492.font = "Arial-BoldMT";
    warningTextDoc492.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText492.property("Source Text").setValue(warningTextDoc492);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText492 = planComp492.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00492");
    errorText492.name = "ERROR_NO_SOURCE";
    errorText492.property("Transform").property("Position").setValue([1280, 720]);
    errorText492.guideLayer = true;
    
    var errorTextDoc492 = errorText492.property("Source Text").value;
    errorTextDoc492.fontSize = 48;
    errorTextDoc492.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc492.font = "Arial-BoldMT";
    errorTextDoc492.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText492.property("Source Text").setValue(errorTextDoc492);
}

planCompositions[492] = planComp492;


// Composition pour plan 00493
var planComp493 = project.items.addComp(
    "SQ27_UNDLM_00493_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp493.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer493 = planComp493.layers.add(bgSolidComp);
bgLayer493.name = "BG_SOLID";
bgLayer493.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer493 = false;
if (gradingSources[493]) {
    var gradedLayer493 = planComp493.layers.add(gradingSources[493]);
    gradedLayer493.name = "UNDLM_00493_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer493.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer493.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer493 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer493 = false;
if (editSources[493]) {
    var editLayer493 = planComp493.layers.add(editSources[493]);
    editLayer493.name = "UNDLM_00493_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer493.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer493.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer493 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity493 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer493) {
    // EDIT toujours activé quand disponible
    editLayer493.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer493) {
        gradedLayer493.enabled = false;
    }
} else if (hasGradedLayer493) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer493.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText493 = planComp493.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText493.name = "WARNING_NO_EDIT";
    warningText493.property("Transform").property("Position").setValue([1280, 200]);
    warningText493.guideLayer = true;
    
    var warningTextDoc493 = warningText493.property("Source Text").value;
    warningTextDoc493.fontSize = 32;
    warningTextDoc493.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc493.font = "Arial-BoldMT";
    warningTextDoc493.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText493.property("Source Text").setValue(warningTextDoc493);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText493 = planComp493.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00493");
    errorText493.name = "ERROR_NO_SOURCE";
    errorText493.property("Transform").property("Position").setValue([1280, 720]);
    errorText493.guideLayer = true;
    
    var errorTextDoc493 = errorText493.property("Source Text").value;
    errorTextDoc493.fontSize = 48;
    errorTextDoc493.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc493.font = "Arial-BoldMT";
    errorTextDoc493.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText493.property("Source Text").setValue(errorTextDoc493);
}

planCompositions[493] = planComp493;


// Composition pour plan 00494
var planComp494 = project.items.addComp(
    "SQ27_UNDLM_00494_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp494.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer494 = planComp494.layers.add(bgSolidComp);
bgLayer494.name = "BG_SOLID";
bgLayer494.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer494 = false;
if (gradingSources[494]) {
    var gradedLayer494 = planComp494.layers.add(gradingSources[494]);
    gradedLayer494.name = "UNDLM_00494_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer494.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer494.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer494 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer494 = false;
if (editSources[494]) {
    var editLayer494 = planComp494.layers.add(editSources[494]);
    editLayer494.name = "UNDLM_00494_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer494.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer494.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer494 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity494 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer494) {
    // EDIT toujours activé quand disponible
    editLayer494.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer494) {
        gradedLayer494.enabled = false;
    }
} else if (hasGradedLayer494) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer494.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText494 = planComp494.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText494.name = "WARNING_NO_EDIT";
    warningText494.property("Transform").property("Position").setValue([1280, 200]);
    warningText494.guideLayer = true;
    
    var warningTextDoc494 = warningText494.property("Source Text").value;
    warningTextDoc494.fontSize = 32;
    warningTextDoc494.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc494.font = "Arial-BoldMT";
    warningTextDoc494.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText494.property("Source Text").setValue(warningTextDoc494);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText494 = planComp494.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00494");
    errorText494.name = "ERROR_NO_SOURCE";
    errorText494.property("Transform").property("Position").setValue([1280, 720]);
    errorText494.guideLayer = true;
    
    var errorTextDoc494 = errorText494.property("Source Text").value;
    errorTextDoc494.fontSize = 48;
    errorTextDoc494.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc494.font = "Arial-BoldMT";
    errorTextDoc494.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText494.property("Source Text").setValue(errorTextDoc494);
}

planCompositions[494] = planComp494;


// Composition pour plan 00495
var planComp495 = project.items.addComp(
    "SQ27_UNDLM_00495_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    17.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp495.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer495 = planComp495.layers.add(bgSolidComp);
bgLayer495.name = "BG_SOLID";
bgLayer495.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer495 = false;
if (gradingSources[495]) {
    var gradedLayer495 = planComp495.layers.add(gradingSources[495]);
    gradedLayer495.name = "UNDLM_00495_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer495.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer495.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer495 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer495 = false;
if (editSources[495]) {
    var editLayer495 = planComp495.layers.add(editSources[495]);
    editLayer495.name = "UNDLM_00495_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer495.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer495.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer495 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity495 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer495) {
    // EDIT toujours activé quand disponible
    editLayer495.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer495) {
        gradedLayer495.enabled = false;
    }
} else if (hasGradedLayer495) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer495.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText495 = planComp495.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText495.name = "WARNING_NO_EDIT";
    warningText495.property("Transform").property("Position").setValue([1280, 200]);
    warningText495.guideLayer = true;
    
    var warningTextDoc495 = warningText495.property("Source Text").value;
    warningTextDoc495.fontSize = 32;
    warningTextDoc495.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc495.font = "Arial-BoldMT";
    warningTextDoc495.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText495.property("Source Text").setValue(warningTextDoc495);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText495 = planComp495.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00495");
    errorText495.name = "ERROR_NO_SOURCE";
    errorText495.property("Transform").property("Position").setValue([1280, 720]);
    errorText495.guideLayer = true;
    
    var errorTextDoc495 = errorText495.property("Source Text").value;
    errorTextDoc495.fontSize = 48;
    errorTextDoc495.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc495.font = "Arial-BoldMT";
    errorTextDoc495.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText495.property("Source Text").setValue(errorTextDoc495);
}

planCompositions[495] = planComp495;


// Composition pour plan 00496
var planComp496 = project.items.addComp(
    "SQ27_UNDLM_00496_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp496.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer496 = planComp496.layers.add(bgSolidComp);
bgLayer496.name = "BG_SOLID";
bgLayer496.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer496 = false;
if (gradingSources[496]) {
    var gradedLayer496 = planComp496.layers.add(gradingSources[496]);
    gradedLayer496.name = "UNDLM_00496_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer496.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer496.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer496 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer496 = false;
if (editSources[496]) {
    var editLayer496 = planComp496.layers.add(editSources[496]);
    editLayer496.name = "UNDLM_00496_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer496.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer496.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer496 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity496 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer496) {
    // EDIT toujours activé quand disponible
    editLayer496.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer496) {
        gradedLayer496.enabled = false;
    }
} else if (hasGradedLayer496) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer496.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText496 = planComp496.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText496.name = "WARNING_NO_EDIT";
    warningText496.property("Transform").property("Position").setValue([1280, 200]);
    warningText496.guideLayer = true;
    
    var warningTextDoc496 = warningText496.property("Source Text").value;
    warningTextDoc496.fontSize = 32;
    warningTextDoc496.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc496.font = "Arial-BoldMT";
    warningTextDoc496.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText496.property("Source Text").setValue(warningTextDoc496);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText496 = planComp496.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00496");
    errorText496.name = "ERROR_NO_SOURCE";
    errorText496.property("Transform").property("Position").setValue([1280, 720]);
    errorText496.guideLayer = true;
    
    var errorTextDoc496 = errorText496.property("Source Text").value;
    errorTextDoc496.fontSize = 48;
    errorTextDoc496.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc496.font = "Arial-BoldMT";
    errorTextDoc496.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText496.property("Source Text").setValue(errorTextDoc496);
}

planCompositions[496] = planComp496;


// Composition pour plan 00497
var planComp497 = project.items.addComp(
    "SQ27_UNDLM_00497_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp497.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer497 = planComp497.layers.add(bgSolidComp);
bgLayer497.name = "BG_SOLID";
bgLayer497.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer497 = false;
if (gradingSources[497]) {
    var gradedLayer497 = planComp497.layers.add(gradingSources[497]);
    gradedLayer497.name = "UNDLM_00497_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer497.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer497.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer497 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer497 = false;
if (editSources[497]) {
    var editLayer497 = planComp497.layers.add(editSources[497]);
    editLayer497.name = "UNDLM_00497_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer497.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer497.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer497 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity497 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer497) {
    // EDIT toujours activé quand disponible
    editLayer497.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer497) {
        gradedLayer497.enabled = false;
    }
} else if (hasGradedLayer497) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer497.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText497 = planComp497.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText497.name = "WARNING_NO_EDIT";
    warningText497.property("Transform").property("Position").setValue([1280, 200]);
    warningText497.guideLayer = true;
    
    var warningTextDoc497 = warningText497.property("Source Text").value;
    warningTextDoc497.fontSize = 32;
    warningTextDoc497.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc497.font = "Arial-BoldMT";
    warningTextDoc497.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText497.property("Source Text").setValue(warningTextDoc497);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText497 = planComp497.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00497");
    errorText497.name = "ERROR_NO_SOURCE";
    errorText497.property("Transform").property("Position").setValue([1280, 720]);
    errorText497.guideLayer = true;
    
    var errorTextDoc497 = errorText497.property("Source Text").value;
    errorTextDoc497.fontSize = 48;
    errorTextDoc497.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc497.font = "Arial-BoldMT";
    errorTextDoc497.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText497.property("Source Text").setValue(errorTextDoc497);
}

planCompositions[497] = planComp497;


// Composition pour plan 00498
var planComp498 = project.items.addComp(
    "SQ27_UNDLM_00498_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp498.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer498 = planComp498.layers.add(bgSolidComp);
bgLayer498.name = "BG_SOLID";
bgLayer498.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer498 = false;
if (gradingSources[498]) {
    var gradedLayer498 = planComp498.layers.add(gradingSources[498]);
    gradedLayer498.name = "UNDLM_00498_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer498.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer498.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer498 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer498 = false;
if (editSources[498]) {
    var editLayer498 = planComp498.layers.add(editSources[498]);
    editLayer498.name = "UNDLM_00498_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer498.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer498.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer498 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity498 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer498) {
    // EDIT toujours activé quand disponible
    editLayer498.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer498) {
        gradedLayer498.enabled = false;
    }
} else if (hasGradedLayer498) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer498.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText498 = planComp498.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText498.name = "WARNING_NO_EDIT";
    warningText498.property("Transform").property("Position").setValue([1280, 200]);
    warningText498.guideLayer = true;
    
    var warningTextDoc498 = warningText498.property("Source Text").value;
    warningTextDoc498.fontSize = 32;
    warningTextDoc498.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc498.font = "Arial-BoldMT";
    warningTextDoc498.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText498.property("Source Text").setValue(warningTextDoc498);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText498 = planComp498.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00498");
    errorText498.name = "ERROR_NO_SOURCE";
    errorText498.property("Transform").property("Position").setValue([1280, 720]);
    errorText498.guideLayer = true;
    
    var errorTextDoc498 = errorText498.property("Source Text").value;
    errorTextDoc498.fontSize = 48;
    errorTextDoc498.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc498.font = "Arial-BoldMT";
    errorTextDoc498.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText498.property("Source Text").setValue(errorTextDoc498);
}

planCompositions[498] = planComp498;


// Composition pour plan 00499
var planComp499 = project.items.addComp(
    "SQ27_UNDLM_00499_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp499.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer499 = planComp499.layers.add(bgSolidComp);
bgLayer499.name = "BG_SOLID";
bgLayer499.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer499 = false;
if (gradingSources[499]) {
    var gradedLayer499 = planComp499.layers.add(gradingSources[499]);
    gradedLayer499.name = "UNDLM_00499_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer499.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer499.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer499 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer499 = false;
if (editSources[499]) {
    var editLayer499 = planComp499.layers.add(editSources[499]);
    editLayer499.name = "UNDLM_00499_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer499.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer499.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer499 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity499 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer499) {
    // EDIT toujours activé quand disponible
    editLayer499.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer499) {
        gradedLayer499.enabled = false;
    }
} else if (hasGradedLayer499) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer499.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText499 = planComp499.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText499.name = "WARNING_NO_EDIT";
    warningText499.property("Transform").property("Position").setValue([1280, 200]);
    warningText499.guideLayer = true;
    
    var warningTextDoc499 = warningText499.property("Source Text").value;
    warningTextDoc499.fontSize = 32;
    warningTextDoc499.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc499.font = "Arial-BoldMT";
    warningTextDoc499.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText499.property("Source Text").setValue(warningTextDoc499);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText499 = planComp499.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00499");
    errorText499.name = "ERROR_NO_SOURCE";
    errorText499.property("Transform").property("Position").setValue([1280, 720]);
    errorText499.guideLayer = true;
    
    var errorTextDoc499 = errorText499.property("Source Text").value;
    errorTextDoc499.fontSize = 48;
    errorTextDoc499.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc499.font = "Arial-BoldMT";
    errorTextDoc499.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText499.property("Source Text").setValue(errorTextDoc499);
}

planCompositions[499] = planComp499;


// Composition pour plan 00500
var planComp500 = project.items.addComp(
    "SQ27_UNDLM_00500_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp500.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer500 = planComp500.layers.add(bgSolidComp);
bgLayer500.name = "BG_SOLID";
bgLayer500.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer500 = false;
if (gradingSources[500]) {
    var gradedLayer500 = planComp500.layers.add(gradingSources[500]);
    gradedLayer500.name = "UNDLM_00500_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer500.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer500.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer500 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer500 = false;
if (editSources[500]) {
    var editLayer500 = planComp500.layers.add(editSources[500]);
    editLayer500.name = "UNDLM_00500_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer500.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer500.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer500 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity500 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer500) {
    // EDIT toujours activé quand disponible
    editLayer500.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer500) {
        gradedLayer500.enabled = false;
    }
} else if (hasGradedLayer500) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer500.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText500 = planComp500.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText500.name = "WARNING_NO_EDIT";
    warningText500.property("Transform").property("Position").setValue([1280, 200]);
    warningText500.guideLayer = true;
    
    var warningTextDoc500 = warningText500.property("Source Text").value;
    warningTextDoc500.fontSize = 32;
    warningTextDoc500.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc500.font = "Arial-BoldMT";
    warningTextDoc500.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText500.property("Source Text").setValue(warningTextDoc500);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText500 = planComp500.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00500");
    errorText500.name = "ERROR_NO_SOURCE";
    errorText500.property("Transform").property("Position").setValue([1280, 720]);
    errorText500.guideLayer = true;
    
    var errorTextDoc500 = errorText500.property("Source Text").value;
    errorTextDoc500.fontSize = 48;
    errorTextDoc500.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc500.font = "Arial-BoldMT";
    errorTextDoc500.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText500.property("Source Text").setValue(errorTextDoc500);
}

planCompositions[500] = planComp500;


// Composition pour plan 00501
var planComp501 = project.items.addComp(
    "SQ27_UNDLM_00501_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    11.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp501.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer501 = planComp501.layers.add(bgSolidComp);
bgLayer501.name = "BG_SOLID";
bgLayer501.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer501 = false;
if (gradingSources[501]) {
    var gradedLayer501 = planComp501.layers.add(gradingSources[501]);
    gradedLayer501.name = "UNDLM_00501_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer501.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer501.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer501 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer501 = false;
if (editSources[501]) {
    var editLayer501 = planComp501.layers.add(editSources[501]);
    editLayer501.name = "UNDLM_00501_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer501.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer501.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer501 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity501 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer501) {
    // EDIT toujours activé quand disponible
    editLayer501.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer501) {
        gradedLayer501.enabled = false;
    }
} else if (hasGradedLayer501) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer501.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText501 = planComp501.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText501.name = "WARNING_NO_EDIT";
    warningText501.property("Transform").property("Position").setValue([1280, 200]);
    warningText501.guideLayer = true;
    
    var warningTextDoc501 = warningText501.property("Source Text").value;
    warningTextDoc501.fontSize = 32;
    warningTextDoc501.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc501.font = "Arial-BoldMT";
    warningTextDoc501.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText501.property("Source Text").setValue(warningTextDoc501);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText501 = planComp501.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00501");
    errorText501.name = "ERROR_NO_SOURCE";
    errorText501.property("Transform").property("Position").setValue([1280, 720]);
    errorText501.guideLayer = true;
    
    var errorTextDoc501 = errorText501.property("Source Text").value;
    errorTextDoc501.fontSize = 48;
    errorTextDoc501.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc501.font = "Arial-BoldMT";
    errorTextDoc501.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText501.property("Source Text").setValue(errorTextDoc501);
}

planCompositions[501] = planComp501;


// Composition pour plan 00502
var planComp502 = project.items.addComp(
    "SQ27_UNDLM_00502_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp502.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer502 = planComp502.layers.add(bgSolidComp);
bgLayer502.name = "BG_SOLID";
bgLayer502.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer502 = false;
if (gradingSources[502]) {
    var gradedLayer502 = planComp502.layers.add(gradingSources[502]);
    gradedLayer502.name = "UNDLM_00502_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer502.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer502.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer502 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer502 = false;
if (editSources[502]) {
    var editLayer502 = planComp502.layers.add(editSources[502]);
    editLayer502.name = "UNDLM_00502_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer502.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer502.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer502 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity502 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer502) {
    // EDIT toujours activé quand disponible
    editLayer502.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer502) {
        gradedLayer502.enabled = false;
    }
} else if (hasGradedLayer502) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer502.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText502 = planComp502.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText502.name = "WARNING_NO_EDIT";
    warningText502.property("Transform").property("Position").setValue([1280, 200]);
    warningText502.guideLayer = true;
    
    var warningTextDoc502 = warningText502.property("Source Text").value;
    warningTextDoc502.fontSize = 32;
    warningTextDoc502.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc502.font = "Arial-BoldMT";
    warningTextDoc502.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText502.property("Source Text").setValue(warningTextDoc502);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText502 = planComp502.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00502");
    errorText502.name = "ERROR_NO_SOURCE";
    errorText502.property("Transform").property("Position").setValue([1280, 720]);
    errorText502.guideLayer = true;
    
    var errorTextDoc502 = errorText502.property("Source Text").value;
    errorTextDoc502.fontSize = 48;
    errorTextDoc502.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc502.font = "Arial-BoldMT";
    errorTextDoc502.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText502.property("Source Text").setValue(errorTextDoc502);
}

planCompositions[502] = planComp502;


// Composition pour plan 00503
var planComp503 = project.items.addComp(
    "SQ27_UNDLM_00503_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp503.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer503 = planComp503.layers.add(bgSolidComp);
bgLayer503.name = "BG_SOLID";
bgLayer503.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer503 = false;
if (gradingSources[503]) {
    var gradedLayer503 = planComp503.layers.add(gradingSources[503]);
    gradedLayer503.name = "UNDLM_00503_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer503.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer503.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer503 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer503 = false;
if (editSources[503]) {
    var editLayer503 = planComp503.layers.add(editSources[503]);
    editLayer503.name = "UNDLM_00503_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer503.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer503.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer503 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity503 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer503) {
    // EDIT toujours activé quand disponible
    editLayer503.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer503) {
        gradedLayer503.enabled = false;
    }
} else if (hasGradedLayer503) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer503.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText503 = planComp503.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText503.name = "WARNING_NO_EDIT";
    warningText503.property("Transform").property("Position").setValue([1280, 200]);
    warningText503.guideLayer = true;
    
    var warningTextDoc503 = warningText503.property("Source Text").value;
    warningTextDoc503.fontSize = 32;
    warningTextDoc503.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc503.font = "Arial-BoldMT";
    warningTextDoc503.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText503.property("Source Text").setValue(warningTextDoc503);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText503 = planComp503.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00503");
    errorText503.name = "ERROR_NO_SOURCE";
    errorText503.property("Transform").property("Position").setValue([1280, 720]);
    errorText503.guideLayer = true;
    
    var errorTextDoc503 = errorText503.property("Source Text").value;
    errorTextDoc503.fontSize = 48;
    errorTextDoc503.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc503.font = "Arial-BoldMT";
    errorTextDoc503.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText503.property("Source Text").setValue(errorTextDoc503);
}

planCompositions[503] = planComp503;


// Composition pour plan 00504
var planComp504 = project.items.addComp(
    "SQ27_UNDLM_00504_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp504.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer504 = planComp504.layers.add(bgSolidComp);
bgLayer504.name = "BG_SOLID";
bgLayer504.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer504 = false;
if (gradingSources[504]) {
    var gradedLayer504 = planComp504.layers.add(gradingSources[504]);
    gradedLayer504.name = "UNDLM_00504_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer504.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer504.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer504 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer504 = false;
if (editSources[504]) {
    var editLayer504 = planComp504.layers.add(editSources[504]);
    editLayer504.name = "UNDLM_00504_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer504.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer504.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer504 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity504 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer504) {
    // EDIT toujours activé quand disponible
    editLayer504.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer504) {
        gradedLayer504.enabled = false;
    }
} else if (hasGradedLayer504) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer504.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText504 = planComp504.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText504.name = "WARNING_NO_EDIT";
    warningText504.property("Transform").property("Position").setValue([1280, 200]);
    warningText504.guideLayer = true;
    
    var warningTextDoc504 = warningText504.property("Source Text").value;
    warningTextDoc504.fontSize = 32;
    warningTextDoc504.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc504.font = "Arial-BoldMT";
    warningTextDoc504.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText504.property("Source Text").setValue(warningTextDoc504);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText504 = planComp504.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00504");
    errorText504.name = "ERROR_NO_SOURCE";
    errorText504.property("Transform").property("Position").setValue([1280, 720]);
    errorText504.guideLayer = true;
    
    var errorTextDoc504 = errorText504.property("Source Text").value;
    errorTextDoc504.fontSize = 48;
    errorTextDoc504.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc504.font = "Arial-BoldMT";
    errorTextDoc504.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText504.property("Source Text").setValue(errorTextDoc504);
}

planCompositions[504] = planComp504;


// Composition pour plan 00505
var planComp505 = project.items.addComp(
    "SQ27_UNDLM_00505_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp505.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer505 = planComp505.layers.add(bgSolidComp);
bgLayer505.name = "BG_SOLID";
bgLayer505.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer505 = false;
if (gradingSources[505]) {
    var gradedLayer505 = planComp505.layers.add(gradingSources[505]);
    gradedLayer505.name = "UNDLM_00505_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer505.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer505.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer505 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer505 = false;
if (editSources[505]) {
    var editLayer505 = planComp505.layers.add(editSources[505]);
    editLayer505.name = "UNDLM_00505_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer505.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer505.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer505 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity505 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer505) {
    // EDIT toujours activé quand disponible
    editLayer505.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer505) {
        gradedLayer505.enabled = false;
    }
} else if (hasGradedLayer505) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer505.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText505 = planComp505.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText505.name = "WARNING_NO_EDIT";
    warningText505.property("Transform").property("Position").setValue([1280, 200]);
    warningText505.guideLayer = true;
    
    var warningTextDoc505 = warningText505.property("Source Text").value;
    warningTextDoc505.fontSize = 32;
    warningTextDoc505.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc505.font = "Arial-BoldMT";
    warningTextDoc505.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText505.property("Source Text").setValue(warningTextDoc505);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText505 = planComp505.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00505");
    errorText505.name = "ERROR_NO_SOURCE";
    errorText505.property("Transform").property("Position").setValue([1280, 720]);
    errorText505.guideLayer = true;
    
    var errorTextDoc505 = errorText505.property("Source Text").value;
    errorTextDoc505.fontSize = 48;
    errorTextDoc505.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc505.font = "Arial-BoldMT";
    errorTextDoc505.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText505.property("Source Text").setValue(errorTextDoc505);
}

planCompositions[505] = planComp505;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ27_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    178.95999999999998, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00479 à la timeline master
if (planCompositions[479]) {
    var masterLayer479 = masterComp.layers.add(planCompositions[479]);
    masterLayer479.startTime = 0;
    masterLayer479.name = "UNDLM_00479";
    masterLayer479.label = 1; // Couleurs alternées
}

// Ajouter plan 00480 à la timeline master
if (planCompositions[480]) {
    var masterLayer480 = masterComp.layers.add(planCompositions[480]);
    masterLayer480.startTime = 8.72;
    masterLayer480.name = "UNDLM_00480";
    masterLayer480.label = 2; // Couleurs alternées
}

// Ajouter plan 00481 à la timeline master
if (planCompositions[481]) {
    var masterLayer481 = masterComp.layers.add(planCompositions[481]);
    masterLayer481.startTime = 13.8;
    masterLayer481.name = "UNDLM_00481";
    masterLayer481.label = 3; // Couleurs alternées
}

// Ajouter plan 00482 à la timeline master
if (planCompositions[482]) {
    var masterLayer482 = masterComp.layers.add(planCompositions[482]);
    masterLayer482.startTime = 26.96;
    masterLayer482.name = "UNDLM_00482";
    masterLayer482.label = 4; // Couleurs alternées
}

// Ajouter plan 00483 à la timeline master
if (planCompositions[483]) {
    var masterLayer483 = masterComp.layers.add(planCompositions[483]);
    masterLayer483.startTime = 28.400000000000002;
    masterLayer483.name = "UNDLM_00483";
    masterLayer483.label = 5; // Couleurs alternées
}

// Ajouter plan 00484 à la timeline master
if (planCompositions[484]) {
    var masterLayer484 = masterComp.layers.add(planCompositions[484]);
    masterLayer484.startTime = 32.28;
    masterLayer484.name = "UNDLM_00484";
    masterLayer484.label = 6; // Couleurs alternées
}

// Ajouter plan 00485 à la timeline master
if (planCompositions[485]) {
    var masterLayer485 = masterComp.layers.add(planCompositions[485]);
    masterLayer485.startTime = 34.44;
    masterLayer485.name = "UNDLM_00485";
    masterLayer485.label = 7; // Couleurs alternées
}

// Ajouter plan 00486 à la timeline master
if (planCompositions[486]) {
    var masterLayer486 = masterComp.layers.add(planCompositions[486]);
    masterLayer486.startTime = 40.4;
    masterLayer486.name = "UNDLM_00486";
    masterLayer486.label = 8; // Couleurs alternées
}

// Ajouter plan 00487 à la timeline master
if (planCompositions[487]) {
    var masterLayer487 = masterComp.layers.add(planCompositions[487]);
    masterLayer487.startTime = 41.839999999999996;
    masterLayer487.name = "UNDLM_00487";
    masterLayer487.label = 9; // Couleurs alternées
}

// Ajouter plan 00488 à la timeline master
if (planCompositions[488]) {
    var masterLayer488 = masterComp.layers.add(planCompositions[488]);
    masterLayer488.startTime = 46.199999999999996;
    masterLayer488.name = "UNDLM_00488";
    masterLayer488.label = 10; // Couleurs alternées
}

// Ajouter plan 00489 à la timeline master
if (planCompositions[489]) {
    var masterLayer489 = masterComp.layers.add(planCompositions[489]);
    masterLayer489.startTime = 50.48;
    masterLayer489.name = "UNDLM_00489";
    masterLayer489.label = 11; // Couleurs alternées
}

// Ajouter plan 00490 à la timeline master
if (planCompositions[490]) {
    var masterLayer490 = masterComp.layers.add(planCompositions[490]);
    masterLayer490.startTime = 56.8;
    masterLayer490.name = "UNDLM_00490";
    masterLayer490.label = 12; // Couleurs alternées
}

// Ajouter plan 00491 à la timeline master
if (planCompositions[491]) {
    var masterLayer491 = masterComp.layers.add(planCompositions[491]);
    masterLayer491.startTime = 62.959999999999994;
    masterLayer491.name = "UNDLM_00491";
    masterLayer491.label = 13; // Couleurs alternées
}

// Ajouter plan 00492 à la timeline master
if (planCompositions[492]) {
    var masterLayer492 = masterComp.layers.add(planCompositions[492]);
    masterLayer492.startTime = 76.03999999999999;
    masterLayer492.name = "UNDLM_00492";
    masterLayer492.label = 14; // Couleurs alternées
}

// Ajouter plan 00493 à la timeline master
if (planCompositions[493]) {
    var masterLayer493 = masterComp.layers.add(planCompositions[493]);
    masterLayer493.startTime = 82.44;
    masterLayer493.name = "UNDLM_00493";
    masterLayer493.label = 15; // Couleurs alternées
}

// Ajouter plan 00494 à la timeline master
if (planCompositions[494]) {
    var masterLayer494 = masterComp.layers.add(planCompositions[494]);
    masterLayer494.startTime = 88.52;
    masterLayer494.name = "UNDLM_00494";
    masterLayer494.label = 16; // Couleurs alternées
}

// Ajouter plan 00495 à la timeline master
if (planCompositions[495]) {
    var masterLayer495 = masterComp.layers.add(planCompositions[495]);
    masterLayer495.startTime = 98.19999999999999;
    masterLayer495.name = "UNDLM_00495";
    masterLayer495.label = 1; // Couleurs alternées
}

// Ajouter plan 00496 à la timeline master
if (planCompositions[496]) {
    var masterLayer496 = masterComp.layers.add(planCompositions[496]);
    masterLayer496.startTime = 115.32;
    masterLayer496.name = "UNDLM_00496";
    masterLayer496.label = 2; // Couleurs alternées
}

// Ajouter plan 00497 à la timeline master
if (planCompositions[497]) {
    var masterLayer497 = masterComp.layers.add(planCompositions[497]);
    masterLayer497.startTime = 121.0;
    masterLayer497.name = "UNDLM_00497";
    masterLayer497.label = 3; // Couleurs alternées
}

// Ajouter plan 00498 à la timeline master
if (planCompositions[498]) {
    var masterLayer498 = masterComp.layers.add(planCompositions[498]);
    masterLayer498.startTime = 124.36;
    masterLayer498.name = "UNDLM_00498";
    masterLayer498.label = 4; // Couleurs alternées
}

// Ajouter plan 00499 à la timeline master
if (planCompositions[499]) {
    var masterLayer499 = masterComp.layers.add(planCompositions[499]);
    masterLayer499.startTime = 135.32;
    masterLayer499.name = "UNDLM_00499";
    masterLayer499.label = 5; // Couleurs alternées
}

// Ajouter plan 00500 à la timeline master
if (planCompositions[500]) {
    var masterLayer500 = masterComp.layers.add(planCompositions[500]);
    masterLayer500.startTime = 139.48;
    masterLayer500.name = "UNDLM_00500";
    masterLayer500.label = 6; // Couleurs alternées
}

// Ajouter plan 00501 à la timeline master
if (planCompositions[501]) {
    var masterLayer501 = masterComp.layers.add(planCompositions[501]);
    masterLayer501.startTime = 143.56;
    masterLayer501.name = "UNDLM_00501";
    masterLayer501.label = 7; // Couleurs alternées
}

// Ajouter plan 00502 à la timeline master
if (planCompositions[502]) {
    var masterLayer502 = masterComp.layers.add(planCompositions[502]);
    masterLayer502.startTime = 155.44;
    masterLayer502.name = "UNDLM_00502";
    masterLayer502.label = 8; // Couleurs alternées
}

// Ajouter plan 00503 à la timeline master
if (planCompositions[503]) {
    var masterLayer503 = masterComp.layers.add(planCompositions[503]);
    masterLayer503.startTime = 159.28;
    masterLayer503.name = "UNDLM_00503";
    masterLayer503.label = 9; // Couleurs alternées
}

// Ajouter plan 00504 à la timeline master
if (planCompositions[504]) {
    var masterLayer504 = masterComp.layers.add(planCompositions[504]);
    masterLayer504.startTime = 163.16;
    masterLayer504.name = "UNDLM_00504";
    masterLayer504.label = 10; // Couleurs alternées
}

// Ajouter plan 00505 à la timeline master
if (planCompositions[505]) {
    var masterLayer505 = masterComp.layers.add(planCompositions[505]);
    masterLayer505.startTime = 168.6;
    masterLayer505.name = "UNDLM_00505";
    masterLayer505.label = 11; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ27";\n' +
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
    {start: 0, end: 8.72, name: "UNDLM_00479"},
    {start: 8.72, end: 13.8, name: "UNDLM_00480"},
    {start: 13.8, end: 26.96, name: "UNDLM_00481"},
    {start: 26.96, end: 28.400000000000002, name: "UNDLM_00482"},
    {start: 28.400000000000002, end: 32.28, name: "UNDLM_00483"},
    {start: 32.28, end: 34.44, name: "UNDLM_00484"},
    {start: 34.44, end: 40.4, name: "UNDLM_00485"},
    {start: 40.4, end: 41.839999999999996, name: "UNDLM_00486"},
    {start: 41.839999999999996, end: 46.199999999999996, name: "UNDLM_00487"},
    {start: 46.199999999999996, end: 50.48, name: "UNDLM_00488"},
    {start: 50.48, end: 56.8, name: "UNDLM_00489"},
    {start: 56.8, end: 62.959999999999994, name: "UNDLM_00490"},
    {start: 62.959999999999994, end: 76.03999999999999, name: "UNDLM_00491"},
    {start: 76.03999999999999, end: 82.44, name: "UNDLM_00492"},
    {start: 82.44, end: 88.52, name: "UNDLM_00493"},
    {start: 88.52, end: 98.19999999999999, name: "UNDLM_00494"},
    {start: 98.19999999999999, end: 115.32, name: "UNDLM_00495"},
    {start: 115.32, end: 121.0, name: "UNDLM_00496"},
    {start: 121.0, end: 124.36, name: "UNDLM_00497"},
    {start: 124.36, end: 135.32, name: "UNDLM_00498"},
    {start: 135.32, end: 139.48, name: "UNDLM_00499"},
    {start: 139.48, end: 143.56, name: "UNDLM_00500"},
    {start: 143.56, end: 155.44, name: "UNDLM_00501"},
    {start: 155.44, end: 159.28, name: "UNDLM_00502"},
    {start: 159.28, end: 163.16, name: "UNDLM_00503"},
    {start: 163.16, end: 168.6, name: "UNDLM_00504"},
    {start: 168.6, end: 178.95999999999998, name: "UNDLM_00505"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ27/_AE/SQ27_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 22;
var totalCount = 27;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ27 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(178.95999999999998 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ27_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ27:" + totalCount + ":" + gradedCount);
