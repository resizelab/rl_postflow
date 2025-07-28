
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ10 avec 12 plans
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


// Import plan EDIT 00191
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile191 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00191.mov");
var editFilePoignees191 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00191_AVEC_POIGNEES.mov");
var editFileBis191 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00191bis.mov");

var importSuccess191 = false;
var fileName191 = "";

// Tenter import standard
if (editFile191.exists) {
    try {
        var editFootage191 = project.importFile(new ImportOptions(editFile191));
        editFootage191.parentFolder = fromEditFolder;
        editFootage191.name = "UNDLM_00191";
        editSources[191] = editFootage191;
        editImportCount++;
        importSuccess191 = true;
        fileName191 = "UNDLM_00191.mov";
        logImportSuccess(191, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00191.mov", fileName191);
    } catch (e) {
        logImportError(191, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00191.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess191 && editFilePoignees191.exists) {
    try {
        var editFootage191 = project.importFile(new ImportOptions(editFilePoignees191));
        editFootage191.parentFolder = fromEditFolder;
        editFootage191.name = "UNDLM_00191_AVEC_POIGNEES";
        editSources[191] = editFootage191;
        editImportCount++;
        importSuccess191 = true;
        fileName191 = "UNDLM_00191_AVEC_POIGNEES.mov";
        logImportSuccess(191, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00191_AVEC_POIGNEES.mov", fileName191);
    } catch (e) {
        logImportError(191, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00191_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess191 && editFileBis191.exists) {
    try {
        var editFootage191 = project.importFile(new ImportOptions(editFileBis191));
        editFootage191.parentFolder = fromEditFolder;
        editFootage191.name = "UNDLM_00191bis";
        editSources[191] = editFootage191;
        editImportCount++;
        importSuccess191 = true;
        fileName191 = "UNDLM_00191bis.mov";
        logImportSuccess(191, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00191bis.mov", fileName191);
    } catch (e) {
        logImportError(191, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00191bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess191) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00191.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00192
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile192 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00192.mov");
var editFilePoignees192 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00192_AVEC_POIGNEES.mov");
var editFileBis192 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00192bis.mov");

var importSuccess192 = false;
var fileName192 = "";

// Tenter import standard
if (editFile192.exists) {
    try {
        var editFootage192 = project.importFile(new ImportOptions(editFile192));
        editFootage192.parentFolder = fromEditFolder;
        editFootage192.name = "UNDLM_00192";
        editSources[192] = editFootage192;
        editImportCount++;
        importSuccess192 = true;
        fileName192 = "UNDLM_00192.mov";
        logImportSuccess(192, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00192.mov", fileName192);
    } catch (e) {
        logImportError(192, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00192.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess192 && editFilePoignees192.exists) {
    try {
        var editFootage192 = project.importFile(new ImportOptions(editFilePoignees192));
        editFootage192.parentFolder = fromEditFolder;
        editFootage192.name = "UNDLM_00192_AVEC_POIGNEES";
        editSources[192] = editFootage192;
        editImportCount++;
        importSuccess192 = true;
        fileName192 = "UNDLM_00192_AVEC_POIGNEES.mov";
        logImportSuccess(192, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00192_AVEC_POIGNEES.mov", fileName192);
    } catch (e) {
        logImportError(192, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00192_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess192 && editFileBis192.exists) {
    try {
        var editFootage192 = project.importFile(new ImportOptions(editFileBis192));
        editFootage192.parentFolder = fromEditFolder;
        editFootage192.name = "UNDLM_00192bis";
        editSources[192] = editFootage192;
        editImportCount++;
        importSuccess192 = true;
        fileName192 = "UNDLM_00192bis.mov";
        logImportSuccess(192, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00192bis.mov", fileName192);
    } catch (e) {
        logImportError(192, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00192bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess192) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00192.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00193
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile193 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00193.mov");
var editFilePoignees193 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00193_AVEC_POIGNEES.mov");
var editFileBis193 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00193bis.mov");

var importSuccess193 = false;
var fileName193 = "";

// Tenter import standard
if (editFile193.exists) {
    try {
        var editFootage193 = project.importFile(new ImportOptions(editFile193));
        editFootage193.parentFolder = fromEditFolder;
        editFootage193.name = "UNDLM_00193";
        editSources[193] = editFootage193;
        editImportCount++;
        importSuccess193 = true;
        fileName193 = "UNDLM_00193.mov";
        logImportSuccess(193, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00193.mov", fileName193);
    } catch (e) {
        logImportError(193, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00193.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess193 && editFilePoignees193.exists) {
    try {
        var editFootage193 = project.importFile(new ImportOptions(editFilePoignees193));
        editFootage193.parentFolder = fromEditFolder;
        editFootage193.name = "UNDLM_00193_AVEC_POIGNEES";
        editSources[193] = editFootage193;
        editImportCount++;
        importSuccess193 = true;
        fileName193 = "UNDLM_00193_AVEC_POIGNEES.mov";
        logImportSuccess(193, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00193_AVEC_POIGNEES.mov", fileName193);
    } catch (e) {
        logImportError(193, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00193_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess193 && editFileBis193.exists) {
    try {
        var editFootage193 = project.importFile(new ImportOptions(editFileBis193));
        editFootage193.parentFolder = fromEditFolder;
        editFootage193.name = "UNDLM_00193bis";
        editSources[193] = editFootage193;
        editImportCount++;
        importSuccess193 = true;
        fileName193 = "UNDLM_00193bis.mov";
        logImportSuccess(193, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00193bis.mov", fileName193);
    } catch (e) {
        logImportError(193, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00193bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess193) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00193.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00194
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile194 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00194.mov");
var editFilePoignees194 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00194_AVEC_POIGNEES.mov");
var editFileBis194 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00194bis.mov");

var importSuccess194 = false;
var fileName194 = "";

// Tenter import standard
if (editFile194.exists) {
    try {
        var editFootage194 = project.importFile(new ImportOptions(editFile194));
        editFootage194.parentFolder = fromEditFolder;
        editFootage194.name = "UNDLM_00194";
        editSources[194] = editFootage194;
        editImportCount++;
        importSuccess194 = true;
        fileName194 = "UNDLM_00194.mov";
        logImportSuccess(194, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00194.mov", fileName194);
    } catch (e) {
        logImportError(194, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00194.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess194 && editFilePoignees194.exists) {
    try {
        var editFootage194 = project.importFile(new ImportOptions(editFilePoignees194));
        editFootage194.parentFolder = fromEditFolder;
        editFootage194.name = "UNDLM_00194_AVEC_POIGNEES";
        editSources[194] = editFootage194;
        editImportCount++;
        importSuccess194 = true;
        fileName194 = "UNDLM_00194_AVEC_POIGNEES.mov";
        logImportSuccess(194, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00194_AVEC_POIGNEES.mov", fileName194);
    } catch (e) {
        logImportError(194, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00194_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess194 && editFileBis194.exists) {
    try {
        var editFootage194 = project.importFile(new ImportOptions(editFileBis194));
        editFootage194.parentFolder = fromEditFolder;
        editFootage194.name = "UNDLM_00194bis";
        editSources[194] = editFootage194;
        editImportCount++;
        importSuccess194 = true;
        fileName194 = "UNDLM_00194bis.mov";
        logImportSuccess(194, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00194bis.mov", fileName194);
    } catch (e) {
        logImportError(194, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00194bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess194) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00194.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00195
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile195 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00195.mov");
var editFilePoignees195 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00195_AVEC_POIGNEES.mov");
var editFileBis195 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00195bis.mov");

var importSuccess195 = false;
var fileName195 = "";

// Tenter import standard
if (editFile195.exists) {
    try {
        var editFootage195 = project.importFile(new ImportOptions(editFile195));
        editFootage195.parentFolder = fromEditFolder;
        editFootage195.name = "UNDLM_00195";
        editSources[195] = editFootage195;
        editImportCount++;
        importSuccess195 = true;
        fileName195 = "UNDLM_00195.mov";
        logImportSuccess(195, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00195.mov", fileName195);
    } catch (e) {
        logImportError(195, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00195.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess195 && editFilePoignees195.exists) {
    try {
        var editFootage195 = project.importFile(new ImportOptions(editFilePoignees195));
        editFootage195.parentFolder = fromEditFolder;
        editFootage195.name = "UNDLM_00195_AVEC_POIGNEES";
        editSources[195] = editFootage195;
        editImportCount++;
        importSuccess195 = true;
        fileName195 = "UNDLM_00195_AVEC_POIGNEES.mov";
        logImportSuccess(195, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00195_AVEC_POIGNEES.mov", fileName195);
    } catch (e) {
        logImportError(195, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00195_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess195 && editFileBis195.exists) {
    try {
        var editFootage195 = project.importFile(new ImportOptions(editFileBis195));
        editFootage195.parentFolder = fromEditFolder;
        editFootage195.name = "UNDLM_00195bis";
        editSources[195] = editFootage195;
        editImportCount++;
        importSuccess195 = true;
        fileName195 = "UNDLM_00195bis.mov";
        logImportSuccess(195, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00195bis.mov", fileName195);
    } catch (e) {
        logImportError(195, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00195bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess195) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00195.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00196
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile196 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00196.mov");
var editFilePoignees196 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00196_AVEC_POIGNEES.mov");
var editFileBis196 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00196bis.mov");

var importSuccess196 = false;
var fileName196 = "";

// Tenter import standard
if (editFile196.exists) {
    try {
        var editFootage196 = project.importFile(new ImportOptions(editFile196));
        editFootage196.parentFolder = fromEditFolder;
        editFootage196.name = "UNDLM_00196";
        editSources[196] = editFootage196;
        editImportCount++;
        importSuccess196 = true;
        fileName196 = "UNDLM_00196.mov";
        logImportSuccess(196, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00196.mov", fileName196);
    } catch (e) {
        logImportError(196, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00196.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess196 && editFilePoignees196.exists) {
    try {
        var editFootage196 = project.importFile(new ImportOptions(editFilePoignees196));
        editFootage196.parentFolder = fromEditFolder;
        editFootage196.name = "UNDLM_00196_AVEC_POIGNEES";
        editSources[196] = editFootage196;
        editImportCount++;
        importSuccess196 = true;
        fileName196 = "UNDLM_00196_AVEC_POIGNEES.mov";
        logImportSuccess(196, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00196_AVEC_POIGNEES.mov", fileName196);
    } catch (e) {
        logImportError(196, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00196_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess196 && editFileBis196.exists) {
    try {
        var editFootage196 = project.importFile(new ImportOptions(editFileBis196));
        editFootage196.parentFolder = fromEditFolder;
        editFootage196.name = "UNDLM_00196bis";
        editSources[196] = editFootage196;
        editImportCount++;
        importSuccess196 = true;
        fileName196 = "UNDLM_00196bis.mov";
        logImportSuccess(196, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00196bis.mov", fileName196);
    } catch (e) {
        logImportError(196, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00196bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess196) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00196.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00197
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile197 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00197.mov");
var editFilePoignees197 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00197_AVEC_POIGNEES.mov");
var editFileBis197 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00197bis.mov");

var importSuccess197 = false;
var fileName197 = "";

// Tenter import standard
if (editFile197.exists) {
    try {
        var editFootage197 = project.importFile(new ImportOptions(editFile197));
        editFootage197.parentFolder = fromEditFolder;
        editFootage197.name = "UNDLM_00197";
        editSources[197] = editFootage197;
        editImportCount++;
        importSuccess197 = true;
        fileName197 = "UNDLM_00197.mov";
        logImportSuccess(197, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00197.mov", fileName197);
    } catch (e) {
        logImportError(197, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00197.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess197 && editFilePoignees197.exists) {
    try {
        var editFootage197 = project.importFile(new ImportOptions(editFilePoignees197));
        editFootage197.parentFolder = fromEditFolder;
        editFootage197.name = "UNDLM_00197_AVEC_POIGNEES";
        editSources[197] = editFootage197;
        editImportCount++;
        importSuccess197 = true;
        fileName197 = "UNDLM_00197_AVEC_POIGNEES.mov";
        logImportSuccess(197, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00197_AVEC_POIGNEES.mov", fileName197);
    } catch (e) {
        logImportError(197, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00197_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess197 && editFileBis197.exists) {
    try {
        var editFootage197 = project.importFile(new ImportOptions(editFileBis197));
        editFootage197.parentFolder = fromEditFolder;
        editFootage197.name = "UNDLM_00197bis";
        editSources[197] = editFootage197;
        editImportCount++;
        importSuccess197 = true;
        fileName197 = "UNDLM_00197bis.mov";
        logImportSuccess(197, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00197bis.mov", fileName197);
    } catch (e) {
        logImportError(197, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00197bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess197) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00197.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00198
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile198 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00198.mov");
var editFilePoignees198 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00198_AVEC_POIGNEES.mov");
var editFileBis198 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00198bis.mov");

var importSuccess198 = false;
var fileName198 = "";

// Tenter import standard
if (editFile198.exists) {
    try {
        var editFootage198 = project.importFile(new ImportOptions(editFile198));
        editFootage198.parentFolder = fromEditFolder;
        editFootage198.name = "UNDLM_00198";
        editSources[198] = editFootage198;
        editImportCount++;
        importSuccess198 = true;
        fileName198 = "UNDLM_00198.mov";
        logImportSuccess(198, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00198.mov", fileName198);
    } catch (e) {
        logImportError(198, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00198.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess198 && editFilePoignees198.exists) {
    try {
        var editFootage198 = project.importFile(new ImportOptions(editFilePoignees198));
        editFootage198.parentFolder = fromEditFolder;
        editFootage198.name = "UNDLM_00198_AVEC_POIGNEES";
        editSources[198] = editFootage198;
        editImportCount++;
        importSuccess198 = true;
        fileName198 = "UNDLM_00198_AVEC_POIGNEES.mov";
        logImportSuccess(198, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00198_AVEC_POIGNEES.mov", fileName198);
    } catch (e) {
        logImportError(198, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00198_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess198 && editFileBis198.exists) {
    try {
        var editFootage198 = project.importFile(new ImportOptions(editFileBis198));
        editFootage198.parentFolder = fromEditFolder;
        editFootage198.name = "UNDLM_00198bis";
        editSources[198] = editFootage198;
        editImportCount++;
        importSuccess198 = true;
        fileName198 = "UNDLM_00198bis.mov";
        logImportSuccess(198, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00198bis.mov", fileName198);
    } catch (e) {
        logImportError(198, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00198bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess198) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00198.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00199
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile199 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00199.mov");
var editFilePoignees199 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00199_AVEC_POIGNEES.mov");
var editFileBis199 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00199bis.mov");

var importSuccess199 = false;
var fileName199 = "";

// Tenter import standard
if (editFile199.exists) {
    try {
        var editFootage199 = project.importFile(new ImportOptions(editFile199));
        editFootage199.parentFolder = fromEditFolder;
        editFootage199.name = "UNDLM_00199";
        editSources[199] = editFootage199;
        editImportCount++;
        importSuccess199 = true;
        fileName199 = "UNDLM_00199.mov";
        logImportSuccess(199, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00199.mov", fileName199);
    } catch (e) {
        logImportError(199, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00199.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess199 && editFilePoignees199.exists) {
    try {
        var editFootage199 = project.importFile(new ImportOptions(editFilePoignees199));
        editFootage199.parentFolder = fromEditFolder;
        editFootage199.name = "UNDLM_00199_AVEC_POIGNEES";
        editSources[199] = editFootage199;
        editImportCount++;
        importSuccess199 = true;
        fileName199 = "UNDLM_00199_AVEC_POIGNEES.mov";
        logImportSuccess(199, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00199_AVEC_POIGNEES.mov", fileName199);
    } catch (e) {
        logImportError(199, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00199_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess199 && editFileBis199.exists) {
    try {
        var editFootage199 = project.importFile(new ImportOptions(editFileBis199));
        editFootage199.parentFolder = fromEditFolder;
        editFootage199.name = "UNDLM_00199bis";
        editSources[199] = editFootage199;
        editImportCount++;
        importSuccess199 = true;
        fileName199 = "UNDLM_00199bis.mov";
        logImportSuccess(199, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00199bis.mov", fileName199);
    } catch (e) {
        logImportError(199, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00199bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess199) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00199.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00200
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile200 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00200.mov");
var editFilePoignees200 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00200_AVEC_POIGNEES.mov");
var editFileBis200 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00200bis.mov");

var importSuccess200 = false;
var fileName200 = "";

// Tenter import standard
if (editFile200.exists) {
    try {
        var editFootage200 = project.importFile(new ImportOptions(editFile200));
        editFootage200.parentFolder = fromEditFolder;
        editFootage200.name = "UNDLM_00200";
        editSources[200] = editFootage200;
        editImportCount++;
        importSuccess200 = true;
        fileName200 = "UNDLM_00200.mov";
        logImportSuccess(200, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00200.mov", fileName200);
    } catch (e) {
        logImportError(200, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00200.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess200 && editFilePoignees200.exists) {
    try {
        var editFootage200 = project.importFile(new ImportOptions(editFilePoignees200));
        editFootage200.parentFolder = fromEditFolder;
        editFootage200.name = "UNDLM_00200_AVEC_POIGNEES";
        editSources[200] = editFootage200;
        editImportCount++;
        importSuccess200 = true;
        fileName200 = "UNDLM_00200_AVEC_POIGNEES.mov";
        logImportSuccess(200, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00200_AVEC_POIGNEES.mov", fileName200);
    } catch (e) {
        logImportError(200, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00200_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess200 && editFileBis200.exists) {
    try {
        var editFootage200 = project.importFile(new ImportOptions(editFileBis200));
        editFootage200.parentFolder = fromEditFolder;
        editFootage200.name = "UNDLM_00200bis";
        editSources[200] = editFootage200;
        editImportCount++;
        importSuccess200 = true;
        fileName200 = "UNDLM_00200bis.mov";
        logImportSuccess(200, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00200bis.mov", fileName200);
    } catch (e) {
        logImportError(200, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00200bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess200) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00200.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00201
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile201 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00201.mov");
var editFilePoignees201 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00201_AVEC_POIGNEES.mov");
var editFileBis201 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00201bis.mov");

var importSuccess201 = false;
var fileName201 = "";

// Tenter import standard
if (editFile201.exists) {
    try {
        var editFootage201 = project.importFile(new ImportOptions(editFile201));
        editFootage201.parentFolder = fromEditFolder;
        editFootage201.name = "UNDLM_00201";
        editSources[201] = editFootage201;
        editImportCount++;
        importSuccess201 = true;
        fileName201 = "UNDLM_00201.mov";
        logImportSuccess(201, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00201.mov", fileName201);
    } catch (e) {
        logImportError(201, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00201.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess201 && editFilePoignees201.exists) {
    try {
        var editFootage201 = project.importFile(new ImportOptions(editFilePoignees201));
        editFootage201.parentFolder = fromEditFolder;
        editFootage201.name = "UNDLM_00201_AVEC_POIGNEES";
        editSources[201] = editFootage201;
        editImportCount++;
        importSuccess201 = true;
        fileName201 = "UNDLM_00201_AVEC_POIGNEES.mov";
        logImportSuccess(201, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00201_AVEC_POIGNEES.mov", fileName201);
    } catch (e) {
        logImportError(201, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00201_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess201 && editFileBis201.exists) {
    try {
        var editFootage201 = project.importFile(new ImportOptions(editFileBis201));
        editFootage201.parentFolder = fromEditFolder;
        editFootage201.name = "UNDLM_00201bis";
        editSources[201] = editFootage201;
        editImportCount++;
        importSuccess201 = true;
        fileName201 = "UNDLM_00201bis.mov";
        logImportSuccess(201, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00201bis.mov", fileName201);
    } catch (e) {
        logImportError(201, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00201bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess201) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00201.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00202
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile202 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00202.mov");
var editFilePoignees202 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00202_AVEC_POIGNEES.mov");
var editFileBis202 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00202bis.mov");

var importSuccess202 = false;
var fileName202 = "";

// Tenter import standard
if (editFile202.exists) {
    try {
        var editFootage202 = project.importFile(new ImportOptions(editFile202));
        editFootage202.parentFolder = fromEditFolder;
        editFootage202.name = "UNDLM_00202";
        editSources[202] = editFootage202;
        editImportCount++;
        importSuccess202 = true;
        fileName202 = "UNDLM_00202.mov";
        logImportSuccess(202, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00202.mov", fileName202);
    } catch (e) {
        logImportError(202, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00202.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess202 && editFilePoignees202.exists) {
    try {
        var editFootage202 = project.importFile(new ImportOptions(editFilePoignees202));
        editFootage202.parentFolder = fromEditFolder;
        editFootage202.name = "UNDLM_00202_AVEC_POIGNEES";
        editSources[202] = editFootage202;
        editImportCount++;
        importSuccess202 = true;
        fileName202 = "UNDLM_00202_AVEC_POIGNEES.mov";
        logImportSuccess(202, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00202_AVEC_POIGNEES.mov", fileName202);
    } catch (e) {
        logImportError(202, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00202_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess202 && editFileBis202.exists) {
    try {
        var editFootage202 = project.importFile(new ImportOptions(editFileBis202));
        editFootage202.parentFolder = fromEditFolder;
        editFootage202.name = "UNDLM_00202bis";
        editSources[202] = editFootage202;
        editImportCount++;
        importSuccess202 = true;
        fileName202 = "UNDLM_00202bis.mov";
        logImportSuccess(202, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00202bis.mov", fileName202);
    } catch (e) {
        logImportError(202, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00202bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess202) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00202.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00191
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile191 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00191.mov");
var gradedFilePoignees191 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00191_AVEC_POIGNEES.mov");
var gradedFileBis191 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00191bis.mov");

var gradedImportSuccess191 = false;
var gradedFileName191 = "";

// Tenter import standard
if (gradedFile191.exists) {
    try {
        var gradedFootage191 = project.importFile(new ImportOptions(gradedFile191));
        gradedFootage191.parentFolder = fromGradingFolder;
        gradedFootage191.name = "UNDLM_00191";
        gradingSources[191] = gradedFootage191;
        gradingImportCount++;
        gradedImportSuccess191 = true;
        gradedFileName191 = "UNDLM_00191.mov";
        logImportSuccess(191, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00191.mov", gradedFileName191);
    } catch (e) {
        logImportError(191, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00191.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess191 && gradedFilePoignees191.exists) {
    try {
        var gradedFootage191 = project.importFile(new ImportOptions(gradedFilePoignees191));
        gradedFootage191.parentFolder = fromGradingFolder;
        gradedFootage191.name = "UNDLM_00191_AVEC_POIGNEES";
        gradingSources[191] = gradedFootage191;
        gradingImportCount++;
        gradedImportSuccess191 = true;
        gradedFileName191 = "UNDLM_00191_AVEC_POIGNEES.mov";
        logImportSuccess(191, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00191_AVEC_POIGNEES.mov", gradedFileName191);
    } catch (e) {
        logImportError(191, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00191_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess191 && gradedFileBis191.exists) {
    try {
        var gradedFootage191 = project.importFile(new ImportOptions(gradedFileBis191));
        gradedFootage191.parentFolder = fromGradingFolder;
        gradedFootage191.name = "UNDLM_00191bis";
        gradingSources[191] = gradedFootage191;
        gradingImportCount++;
        gradedImportSuccess191 = true;
        gradedFileName191 = "UNDLM_00191bis.mov";
        logImportSuccess(191, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00191bis.mov", gradedFileName191);
    } catch (e) {
        logImportError(191, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00191bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess191) {
    missingGradingCount++;
}

// Import plan GRADED 00192
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile192 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00192.mov");
var gradedFilePoignees192 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00192_AVEC_POIGNEES.mov");
var gradedFileBis192 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00192bis.mov");

var gradedImportSuccess192 = false;
var gradedFileName192 = "";

// Tenter import standard
if (gradedFile192.exists) {
    try {
        var gradedFootage192 = project.importFile(new ImportOptions(gradedFile192));
        gradedFootage192.parentFolder = fromGradingFolder;
        gradedFootage192.name = "UNDLM_00192";
        gradingSources[192] = gradedFootage192;
        gradingImportCount++;
        gradedImportSuccess192 = true;
        gradedFileName192 = "UNDLM_00192.mov";
        logImportSuccess(192, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00192.mov", gradedFileName192);
    } catch (e) {
        logImportError(192, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00192.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess192 && gradedFilePoignees192.exists) {
    try {
        var gradedFootage192 = project.importFile(new ImportOptions(gradedFilePoignees192));
        gradedFootage192.parentFolder = fromGradingFolder;
        gradedFootage192.name = "UNDLM_00192_AVEC_POIGNEES";
        gradingSources[192] = gradedFootage192;
        gradingImportCount++;
        gradedImportSuccess192 = true;
        gradedFileName192 = "UNDLM_00192_AVEC_POIGNEES.mov";
        logImportSuccess(192, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00192_AVEC_POIGNEES.mov", gradedFileName192);
    } catch (e) {
        logImportError(192, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00192_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess192 && gradedFileBis192.exists) {
    try {
        var gradedFootage192 = project.importFile(new ImportOptions(gradedFileBis192));
        gradedFootage192.parentFolder = fromGradingFolder;
        gradedFootage192.name = "UNDLM_00192bis";
        gradingSources[192] = gradedFootage192;
        gradingImportCount++;
        gradedImportSuccess192 = true;
        gradedFileName192 = "UNDLM_00192bis.mov";
        logImportSuccess(192, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00192bis.mov", gradedFileName192);
    } catch (e) {
        logImportError(192, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00192bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess192) {
    missingGradingCount++;
}

// Import plan GRADED 00193
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile193 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00193.mov");
var gradedFilePoignees193 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00193_AVEC_POIGNEES.mov");
var gradedFileBis193 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00193bis.mov");

var gradedImportSuccess193 = false;
var gradedFileName193 = "";

// Tenter import standard
if (gradedFile193.exists) {
    try {
        var gradedFootage193 = project.importFile(new ImportOptions(gradedFile193));
        gradedFootage193.parentFolder = fromGradingFolder;
        gradedFootage193.name = "UNDLM_00193";
        gradingSources[193] = gradedFootage193;
        gradingImportCount++;
        gradedImportSuccess193 = true;
        gradedFileName193 = "UNDLM_00193.mov";
        logImportSuccess(193, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00193.mov", gradedFileName193);
    } catch (e) {
        logImportError(193, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00193.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess193 && gradedFilePoignees193.exists) {
    try {
        var gradedFootage193 = project.importFile(new ImportOptions(gradedFilePoignees193));
        gradedFootage193.parentFolder = fromGradingFolder;
        gradedFootage193.name = "UNDLM_00193_AVEC_POIGNEES";
        gradingSources[193] = gradedFootage193;
        gradingImportCount++;
        gradedImportSuccess193 = true;
        gradedFileName193 = "UNDLM_00193_AVEC_POIGNEES.mov";
        logImportSuccess(193, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00193_AVEC_POIGNEES.mov", gradedFileName193);
    } catch (e) {
        logImportError(193, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00193_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess193 && gradedFileBis193.exists) {
    try {
        var gradedFootage193 = project.importFile(new ImportOptions(gradedFileBis193));
        gradedFootage193.parentFolder = fromGradingFolder;
        gradedFootage193.name = "UNDLM_00193bis";
        gradingSources[193] = gradedFootage193;
        gradingImportCount++;
        gradedImportSuccess193 = true;
        gradedFileName193 = "UNDLM_00193bis.mov";
        logImportSuccess(193, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00193bis.mov", gradedFileName193);
    } catch (e) {
        logImportError(193, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00193bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess193) {
    missingGradingCount++;
}

// Import plan GRADED 00194
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile194 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00194.mov");
var gradedFilePoignees194 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00194_AVEC_POIGNEES.mov");
var gradedFileBis194 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00194bis.mov");

var gradedImportSuccess194 = false;
var gradedFileName194 = "";

// Tenter import standard
if (gradedFile194.exists) {
    try {
        var gradedFootage194 = project.importFile(new ImportOptions(gradedFile194));
        gradedFootage194.parentFolder = fromGradingFolder;
        gradedFootage194.name = "UNDLM_00194";
        gradingSources[194] = gradedFootage194;
        gradingImportCount++;
        gradedImportSuccess194 = true;
        gradedFileName194 = "UNDLM_00194.mov";
        logImportSuccess(194, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00194.mov", gradedFileName194);
    } catch (e) {
        logImportError(194, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00194.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess194 && gradedFilePoignees194.exists) {
    try {
        var gradedFootage194 = project.importFile(new ImportOptions(gradedFilePoignees194));
        gradedFootage194.parentFolder = fromGradingFolder;
        gradedFootage194.name = "UNDLM_00194_AVEC_POIGNEES";
        gradingSources[194] = gradedFootage194;
        gradingImportCount++;
        gradedImportSuccess194 = true;
        gradedFileName194 = "UNDLM_00194_AVEC_POIGNEES.mov";
        logImportSuccess(194, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00194_AVEC_POIGNEES.mov", gradedFileName194);
    } catch (e) {
        logImportError(194, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00194_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess194 && gradedFileBis194.exists) {
    try {
        var gradedFootage194 = project.importFile(new ImportOptions(gradedFileBis194));
        gradedFootage194.parentFolder = fromGradingFolder;
        gradedFootage194.name = "UNDLM_00194bis";
        gradingSources[194] = gradedFootage194;
        gradingImportCount++;
        gradedImportSuccess194 = true;
        gradedFileName194 = "UNDLM_00194bis.mov";
        logImportSuccess(194, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00194bis.mov", gradedFileName194);
    } catch (e) {
        logImportError(194, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00194bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess194) {
    missingGradingCount++;
}

// Import plan GRADED 00195
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile195 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00195.mov");
var gradedFilePoignees195 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00195_AVEC_POIGNEES.mov");
var gradedFileBis195 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00195bis.mov");

var gradedImportSuccess195 = false;
var gradedFileName195 = "";

// Tenter import standard
if (gradedFile195.exists) {
    try {
        var gradedFootage195 = project.importFile(new ImportOptions(gradedFile195));
        gradedFootage195.parentFolder = fromGradingFolder;
        gradedFootage195.name = "UNDLM_00195";
        gradingSources[195] = gradedFootage195;
        gradingImportCount++;
        gradedImportSuccess195 = true;
        gradedFileName195 = "UNDLM_00195.mov";
        logImportSuccess(195, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00195.mov", gradedFileName195);
    } catch (e) {
        logImportError(195, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00195.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess195 && gradedFilePoignees195.exists) {
    try {
        var gradedFootage195 = project.importFile(new ImportOptions(gradedFilePoignees195));
        gradedFootage195.parentFolder = fromGradingFolder;
        gradedFootage195.name = "UNDLM_00195_AVEC_POIGNEES";
        gradingSources[195] = gradedFootage195;
        gradingImportCount++;
        gradedImportSuccess195 = true;
        gradedFileName195 = "UNDLM_00195_AVEC_POIGNEES.mov";
        logImportSuccess(195, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00195_AVEC_POIGNEES.mov", gradedFileName195);
    } catch (e) {
        logImportError(195, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00195_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess195 && gradedFileBis195.exists) {
    try {
        var gradedFootage195 = project.importFile(new ImportOptions(gradedFileBis195));
        gradedFootage195.parentFolder = fromGradingFolder;
        gradedFootage195.name = "UNDLM_00195bis";
        gradingSources[195] = gradedFootage195;
        gradingImportCount++;
        gradedImportSuccess195 = true;
        gradedFileName195 = "UNDLM_00195bis.mov";
        logImportSuccess(195, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00195bis.mov", gradedFileName195);
    } catch (e) {
        logImportError(195, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00195bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess195) {
    missingGradingCount++;
}

// Import plan GRADED 00196
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile196 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00196.mov");
var gradedFilePoignees196 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00196_AVEC_POIGNEES.mov");
var gradedFileBis196 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00196bis.mov");

var gradedImportSuccess196 = false;
var gradedFileName196 = "";

// Tenter import standard
if (gradedFile196.exists) {
    try {
        var gradedFootage196 = project.importFile(new ImportOptions(gradedFile196));
        gradedFootage196.parentFolder = fromGradingFolder;
        gradedFootage196.name = "UNDLM_00196";
        gradingSources[196] = gradedFootage196;
        gradingImportCount++;
        gradedImportSuccess196 = true;
        gradedFileName196 = "UNDLM_00196.mov";
        logImportSuccess(196, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00196.mov", gradedFileName196);
    } catch (e) {
        logImportError(196, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00196.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess196 && gradedFilePoignees196.exists) {
    try {
        var gradedFootage196 = project.importFile(new ImportOptions(gradedFilePoignees196));
        gradedFootage196.parentFolder = fromGradingFolder;
        gradedFootage196.name = "UNDLM_00196_AVEC_POIGNEES";
        gradingSources[196] = gradedFootage196;
        gradingImportCount++;
        gradedImportSuccess196 = true;
        gradedFileName196 = "UNDLM_00196_AVEC_POIGNEES.mov";
        logImportSuccess(196, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00196_AVEC_POIGNEES.mov", gradedFileName196);
    } catch (e) {
        logImportError(196, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00196_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess196 && gradedFileBis196.exists) {
    try {
        var gradedFootage196 = project.importFile(new ImportOptions(gradedFileBis196));
        gradedFootage196.parentFolder = fromGradingFolder;
        gradedFootage196.name = "UNDLM_00196bis";
        gradingSources[196] = gradedFootage196;
        gradingImportCount++;
        gradedImportSuccess196 = true;
        gradedFileName196 = "UNDLM_00196bis.mov";
        logImportSuccess(196, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00196bis.mov", gradedFileName196);
    } catch (e) {
        logImportError(196, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00196bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess196) {
    missingGradingCount++;
}

// Import plan GRADED 00197
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile197 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00197.mov");
var gradedFilePoignees197 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00197_AVEC_POIGNEES.mov");
var gradedFileBis197 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00197bis.mov");

var gradedImportSuccess197 = false;
var gradedFileName197 = "";

// Tenter import standard
if (gradedFile197.exists) {
    try {
        var gradedFootage197 = project.importFile(new ImportOptions(gradedFile197));
        gradedFootage197.parentFolder = fromGradingFolder;
        gradedFootage197.name = "UNDLM_00197";
        gradingSources[197] = gradedFootage197;
        gradingImportCount++;
        gradedImportSuccess197 = true;
        gradedFileName197 = "UNDLM_00197.mov";
        logImportSuccess(197, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00197.mov", gradedFileName197);
    } catch (e) {
        logImportError(197, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00197.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess197 && gradedFilePoignees197.exists) {
    try {
        var gradedFootage197 = project.importFile(new ImportOptions(gradedFilePoignees197));
        gradedFootage197.parentFolder = fromGradingFolder;
        gradedFootage197.name = "UNDLM_00197_AVEC_POIGNEES";
        gradingSources[197] = gradedFootage197;
        gradingImportCount++;
        gradedImportSuccess197 = true;
        gradedFileName197 = "UNDLM_00197_AVEC_POIGNEES.mov";
        logImportSuccess(197, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00197_AVEC_POIGNEES.mov", gradedFileName197);
    } catch (e) {
        logImportError(197, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00197_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess197 && gradedFileBis197.exists) {
    try {
        var gradedFootage197 = project.importFile(new ImportOptions(gradedFileBis197));
        gradedFootage197.parentFolder = fromGradingFolder;
        gradedFootage197.name = "UNDLM_00197bis";
        gradingSources[197] = gradedFootage197;
        gradingImportCount++;
        gradedImportSuccess197 = true;
        gradedFileName197 = "UNDLM_00197bis.mov";
        logImportSuccess(197, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00197bis.mov", gradedFileName197);
    } catch (e) {
        logImportError(197, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00197bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess197) {
    missingGradingCount++;
}

// Import plan GRADED 00198
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile198 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00198.mov");
var gradedFilePoignees198 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00198_AVEC_POIGNEES.mov");
var gradedFileBis198 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00198bis.mov");

var gradedImportSuccess198 = false;
var gradedFileName198 = "";

// Tenter import standard
if (gradedFile198.exists) {
    try {
        var gradedFootage198 = project.importFile(new ImportOptions(gradedFile198));
        gradedFootage198.parentFolder = fromGradingFolder;
        gradedFootage198.name = "UNDLM_00198";
        gradingSources[198] = gradedFootage198;
        gradingImportCount++;
        gradedImportSuccess198 = true;
        gradedFileName198 = "UNDLM_00198.mov";
        logImportSuccess(198, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00198.mov", gradedFileName198);
    } catch (e) {
        logImportError(198, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00198.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess198 && gradedFilePoignees198.exists) {
    try {
        var gradedFootage198 = project.importFile(new ImportOptions(gradedFilePoignees198));
        gradedFootage198.parentFolder = fromGradingFolder;
        gradedFootage198.name = "UNDLM_00198_AVEC_POIGNEES";
        gradingSources[198] = gradedFootage198;
        gradingImportCount++;
        gradedImportSuccess198 = true;
        gradedFileName198 = "UNDLM_00198_AVEC_POIGNEES.mov";
        logImportSuccess(198, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00198_AVEC_POIGNEES.mov", gradedFileName198);
    } catch (e) {
        logImportError(198, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00198_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess198 && gradedFileBis198.exists) {
    try {
        var gradedFootage198 = project.importFile(new ImportOptions(gradedFileBis198));
        gradedFootage198.parentFolder = fromGradingFolder;
        gradedFootage198.name = "UNDLM_00198bis";
        gradingSources[198] = gradedFootage198;
        gradingImportCount++;
        gradedImportSuccess198 = true;
        gradedFileName198 = "UNDLM_00198bis.mov";
        logImportSuccess(198, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00198bis.mov", gradedFileName198);
    } catch (e) {
        logImportError(198, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00198bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess198) {
    missingGradingCount++;
}

// Import plan GRADED 00199
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile199 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00199.mov");
var gradedFilePoignees199 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00199_AVEC_POIGNEES.mov");
var gradedFileBis199 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00199bis.mov");

var gradedImportSuccess199 = false;
var gradedFileName199 = "";

// Tenter import standard
if (gradedFile199.exists) {
    try {
        var gradedFootage199 = project.importFile(new ImportOptions(gradedFile199));
        gradedFootage199.parentFolder = fromGradingFolder;
        gradedFootage199.name = "UNDLM_00199";
        gradingSources[199] = gradedFootage199;
        gradingImportCount++;
        gradedImportSuccess199 = true;
        gradedFileName199 = "UNDLM_00199.mov";
        logImportSuccess(199, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00199.mov", gradedFileName199);
    } catch (e) {
        logImportError(199, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00199.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess199 && gradedFilePoignees199.exists) {
    try {
        var gradedFootage199 = project.importFile(new ImportOptions(gradedFilePoignees199));
        gradedFootage199.parentFolder = fromGradingFolder;
        gradedFootage199.name = "UNDLM_00199_AVEC_POIGNEES";
        gradingSources[199] = gradedFootage199;
        gradingImportCount++;
        gradedImportSuccess199 = true;
        gradedFileName199 = "UNDLM_00199_AVEC_POIGNEES.mov";
        logImportSuccess(199, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00199_AVEC_POIGNEES.mov", gradedFileName199);
    } catch (e) {
        logImportError(199, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00199_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess199 && gradedFileBis199.exists) {
    try {
        var gradedFootage199 = project.importFile(new ImportOptions(gradedFileBis199));
        gradedFootage199.parentFolder = fromGradingFolder;
        gradedFootage199.name = "UNDLM_00199bis";
        gradingSources[199] = gradedFootage199;
        gradingImportCount++;
        gradedImportSuccess199 = true;
        gradedFileName199 = "UNDLM_00199bis.mov";
        logImportSuccess(199, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00199bis.mov", gradedFileName199);
    } catch (e) {
        logImportError(199, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00199bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess199) {
    missingGradingCount++;
}

// Import plan GRADED 00200
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile200 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00200.mov");
var gradedFilePoignees200 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00200_AVEC_POIGNEES.mov");
var gradedFileBis200 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00200bis.mov");

var gradedImportSuccess200 = false;
var gradedFileName200 = "";

// Tenter import standard
if (gradedFile200.exists) {
    try {
        var gradedFootage200 = project.importFile(new ImportOptions(gradedFile200));
        gradedFootage200.parentFolder = fromGradingFolder;
        gradedFootage200.name = "UNDLM_00200";
        gradingSources[200] = gradedFootage200;
        gradingImportCount++;
        gradedImportSuccess200 = true;
        gradedFileName200 = "UNDLM_00200.mov";
        logImportSuccess(200, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00200.mov", gradedFileName200);
    } catch (e) {
        logImportError(200, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00200.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess200 && gradedFilePoignees200.exists) {
    try {
        var gradedFootage200 = project.importFile(new ImportOptions(gradedFilePoignees200));
        gradedFootage200.parentFolder = fromGradingFolder;
        gradedFootage200.name = "UNDLM_00200_AVEC_POIGNEES";
        gradingSources[200] = gradedFootage200;
        gradingImportCount++;
        gradedImportSuccess200 = true;
        gradedFileName200 = "UNDLM_00200_AVEC_POIGNEES.mov";
        logImportSuccess(200, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00200_AVEC_POIGNEES.mov", gradedFileName200);
    } catch (e) {
        logImportError(200, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00200_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess200 && gradedFileBis200.exists) {
    try {
        var gradedFootage200 = project.importFile(new ImportOptions(gradedFileBis200));
        gradedFootage200.parentFolder = fromGradingFolder;
        gradedFootage200.name = "UNDLM_00200bis";
        gradingSources[200] = gradedFootage200;
        gradingImportCount++;
        gradedImportSuccess200 = true;
        gradedFileName200 = "UNDLM_00200bis.mov";
        logImportSuccess(200, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00200bis.mov", gradedFileName200);
    } catch (e) {
        logImportError(200, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00200bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess200) {
    missingGradingCount++;
}

// Import plan GRADED 00201
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile201 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00201.mov");
var gradedFilePoignees201 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00201_AVEC_POIGNEES.mov");
var gradedFileBis201 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00201bis.mov");

var gradedImportSuccess201 = false;
var gradedFileName201 = "";

// Tenter import standard
if (gradedFile201.exists) {
    try {
        var gradedFootage201 = project.importFile(new ImportOptions(gradedFile201));
        gradedFootage201.parentFolder = fromGradingFolder;
        gradedFootage201.name = "UNDLM_00201";
        gradingSources[201] = gradedFootage201;
        gradingImportCount++;
        gradedImportSuccess201 = true;
        gradedFileName201 = "UNDLM_00201.mov";
        logImportSuccess(201, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00201.mov", gradedFileName201);
    } catch (e) {
        logImportError(201, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00201.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess201 && gradedFilePoignees201.exists) {
    try {
        var gradedFootage201 = project.importFile(new ImportOptions(gradedFilePoignees201));
        gradedFootage201.parentFolder = fromGradingFolder;
        gradedFootage201.name = "UNDLM_00201_AVEC_POIGNEES";
        gradingSources[201] = gradedFootage201;
        gradingImportCount++;
        gradedImportSuccess201 = true;
        gradedFileName201 = "UNDLM_00201_AVEC_POIGNEES.mov";
        logImportSuccess(201, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00201_AVEC_POIGNEES.mov", gradedFileName201);
    } catch (e) {
        logImportError(201, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00201_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess201 && gradedFileBis201.exists) {
    try {
        var gradedFootage201 = project.importFile(new ImportOptions(gradedFileBis201));
        gradedFootage201.parentFolder = fromGradingFolder;
        gradedFootage201.name = "UNDLM_00201bis";
        gradingSources[201] = gradedFootage201;
        gradingImportCount++;
        gradedImportSuccess201 = true;
        gradedFileName201 = "UNDLM_00201bis.mov";
        logImportSuccess(201, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00201bis.mov", gradedFileName201);
    } catch (e) {
        logImportError(201, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00201bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess201) {
    missingGradingCount++;
}

// Import plan GRADED 00202
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile202 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00202.mov");
var gradedFilePoignees202 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00202_AVEC_POIGNEES.mov");
var gradedFileBis202 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00202bis.mov");

var gradedImportSuccess202 = false;
var gradedFileName202 = "";

// Tenter import standard
if (gradedFile202.exists) {
    try {
        var gradedFootage202 = project.importFile(new ImportOptions(gradedFile202));
        gradedFootage202.parentFolder = fromGradingFolder;
        gradedFootage202.name = "UNDLM_00202";
        gradingSources[202] = gradedFootage202;
        gradingImportCount++;
        gradedImportSuccess202 = true;
        gradedFileName202 = "UNDLM_00202.mov";
        logImportSuccess(202, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00202.mov", gradedFileName202);
    } catch (e) {
        logImportError(202, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00202.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess202 && gradedFilePoignees202.exists) {
    try {
        var gradedFootage202 = project.importFile(new ImportOptions(gradedFilePoignees202));
        gradedFootage202.parentFolder = fromGradingFolder;
        gradedFootage202.name = "UNDLM_00202_AVEC_POIGNEES";
        gradingSources[202] = gradedFootage202;
        gradingImportCount++;
        gradedImportSuccess202 = true;
        gradedFileName202 = "UNDLM_00202_AVEC_POIGNEES.mov";
        logImportSuccess(202, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00202_AVEC_POIGNEES.mov", gradedFileName202);
    } catch (e) {
        logImportError(202, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00202_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess202 && gradedFileBis202.exists) {
    try {
        var gradedFootage202 = project.importFile(new ImportOptions(gradedFileBis202));
        gradedFootage202.parentFolder = fromGradingFolder;
        gradedFootage202.name = "UNDLM_00202bis";
        gradingSources[202] = gradedFootage202;
        gradingImportCount++;
        gradedImportSuccess202 = true;
        gradedFileName202 = "UNDLM_00202bis.mov";
        logImportSuccess(202, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00202bis.mov", gradedFileName202);
    } catch (e) {
        logImportError(202, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00202bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess202) {
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


// Composition pour plan 00191
var planComp191 = project.items.addComp(
    "SQ10_UNDLM_00191_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp191.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer191 = planComp191.layers.add(bgSolidComp);
bgLayer191.name = "BG_SOLID";
bgLayer191.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer191 = false;
if (gradingSources[191]) {
    var gradedLayer191 = planComp191.layers.add(gradingSources[191]);
    gradedLayer191.name = "UNDLM_00191_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer191.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer191.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer191 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer191 = false;
if (editSources[191]) {
    var editLayer191 = planComp191.layers.add(editSources[191]);
    editLayer191.name = "UNDLM_00191_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer191.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer191.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer191 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity191 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer191) {
    // EDIT toujours activé quand disponible
    editLayer191.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer191) {
        gradedLayer191.enabled = false;
    }
} else if (hasGradedLayer191) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer191.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText191 = planComp191.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText191.name = "WARNING_NO_EDIT";
    warningText191.property("Transform").property("Position").setValue([1280, 200]);
    warningText191.guideLayer = true;
    
    var warningTextDoc191 = warningText191.property("Source Text").value;
    warningTextDoc191.fontSize = 32;
    warningTextDoc191.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc191.font = "Arial-BoldMT";
    warningTextDoc191.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText191.property("Source Text").setValue(warningTextDoc191);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText191 = planComp191.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00191");
    errorText191.name = "ERROR_NO_SOURCE";
    errorText191.property("Transform").property("Position").setValue([1280, 720]);
    errorText191.guideLayer = true;
    
    var errorTextDoc191 = errorText191.property("Source Text").value;
    errorTextDoc191.fontSize = 48;
    errorTextDoc191.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc191.font = "Arial-BoldMT";
    errorTextDoc191.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText191.property("Source Text").setValue(errorTextDoc191);
}

planCompositions[191] = planComp191;


// Composition pour plan 00192
var planComp192 = project.items.addComp(
    "SQ10_UNDLM_00192_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp192.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer192 = planComp192.layers.add(bgSolidComp);
bgLayer192.name = "BG_SOLID";
bgLayer192.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer192 = false;
if (gradingSources[192]) {
    var gradedLayer192 = planComp192.layers.add(gradingSources[192]);
    gradedLayer192.name = "UNDLM_00192_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer192.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer192.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer192 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer192 = false;
if (editSources[192]) {
    var editLayer192 = planComp192.layers.add(editSources[192]);
    editLayer192.name = "UNDLM_00192_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer192.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer192.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer192 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity192 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer192) {
    // EDIT toujours activé quand disponible
    editLayer192.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer192) {
        gradedLayer192.enabled = false;
    }
} else if (hasGradedLayer192) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer192.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText192 = planComp192.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText192.name = "WARNING_NO_EDIT";
    warningText192.property("Transform").property("Position").setValue([1280, 200]);
    warningText192.guideLayer = true;
    
    var warningTextDoc192 = warningText192.property("Source Text").value;
    warningTextDoc192.fontSize = 32;
    warningTextDoc192.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc192.font = "Arial-BoldMT";
    warningTextDoc192.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText192.property("Source Text").setValue(warningTextDoc192);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText192 = planComp192.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00192");
    errorText192.name = "ERROR_NO_SOURCE";
    errorText192.property("Transform").property("Position").setValue([1280, 720]);
    errorText192.guideLayer = true;
    
    var errorTextDoc192 = errorText192.property("Source Text").value;
    errorTextDoc192.fontSize = 48;
    errorTextDoc192.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc192.font = "Arial-BoldMT";
    errorTextDoc192.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText192.property("Source Text").setValue(errorTextDoc192);
}

planCompositions[192] = planComp192;


// Composition pour plan 00193
var planComp193 = project.items.addComp(
    "SQ10_UNDLM_00193_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp193.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer193 = planComp193.layers.add(bgSolidComp);
bgLayer193.name = "BG_SOLID";
bgLayer193.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer193 = false;
if (gradingSources[193]) {
    var gradedLayer193 = planComp193.layers.add(gradingSources[193]);
    gradedLayer193.name = "UNDLM_00193_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer193.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer193.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer193 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer193 = false;
if (editSources[193]) {
    var editLayer193 = planComp193.layers.add(editSources[193]);
    editLayer193.name = "UNDLM_00193_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer193.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer193.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer193 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity193 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer193) {
    // EDIT toujours activé quand disponible
    editLayer193.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer193) {
        gradedLayer193.enabled = false;
    }
} else if (hasGradedLayer193) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer193.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText193 = planComp193.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText193.name = "WARNING_NO_EDIT";
    warningText193.property("Transform").property("Position").setValue([1280, 200]);
    warningText193.guideLayer = true;
    
    var warningTextDoc193 = warningText193.property("Source Text").value;
    warningTextDoc193.fontSize = 32;
    warningTextDoc193.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc193.font = "Arial-BoldMT";
    warningTextDoc193.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText193.property("Source Text").setValue(warningTextDoc193);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText193 = planComp193.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00193");
    errorText193.name = "ERROR_NO_SOURCE";
    errorText193.property("Transform").property("Position").setValue([1280, 720]);
    errorText193.guideLayer = true;
    
    var errorTextDoc193 = errorText193.property("Source Text").value;
    errorTextDoc193.fontSize = 48;
    errorTextDoc193.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc193.font = "Arial-BoldMT";
    errorTextDoc193.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText193.property("Source Text").setValue(errorTextDoc193);
}

planCompositions[193] = planComp193;


// Composition pour plan 00194
var planComp194 = project.items.addComp(
    "SQ10_UNDLM_00194_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp194.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer194 = planComp194.layers.add(bgSolidComp);
bgLayer194.name = "BG_SOLID";
bgLayer194.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer194 = false;
if (gradingSources[194]) {
    var gradedLayer194 = planComp194.layers.add(gradingSources[194]);
    gradedLayer194.name = "UNDLM_00194_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer194.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer194.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer194 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer194 = false;
if (editSources[194]) {
    var editLayer194 = planComp194.layers.add(editSources[194]);
    editLayer194.name = "UNDLM_00194_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer194.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer194.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer194 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity194 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer194) {
    // EDIT toujours activé quand disponible
    editLayer194.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer194) {
        gradedLayer194.enabled = false;
    }
} else if (hasGradedLayer194) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer194.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText194 = planComp194.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText194.name = "WARNING_NO_EDIT";
    warningText194.property("Transform").property("Position").setValue([1280, 200]);
    warningText194.guideLayer = true;
    
    var warningTextDoc194 = warningText194.property("Source Text").value;
    warningTextDoc194.fontSize = 32;
    warningTextDoc194.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc194.font = "Arial-BoldMT";
    warningTextDoc194.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText194.property("Source Text").setValue(warningTextDoc194);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText194 = planComp194.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00194");
    errorText194.name = "ERROR_NO_SOURCE";
    errorText194.property("Transform").property("Position").setValue([1280, 720]);
    errorText194.guideLayer = true;
    
    var errorTextDoc194 = errorText194.property("Source Text").value;
    errorTextDoc194.fontSize = 48;
    errorTextDoc194.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc194.font = "Arial-BoldMT";
    errorTextDoc194.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText194.property("Source Text").setValue(errorTextDoc194);
}

planCompositions[194] = planComp194;


// Composition pour plan 00195
var planComp195 = project.items.addComp(
    "SQ10_UNDLM_00195_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    12.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp195.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer195 = planComp195.layers.add(bgSolidComp);
bgLayer195.name = "BG_SOLID";
bgLayer195.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer195 = false;
if (gradingSources[195]) {
    var gradedLayer195 = planComp195.layers.add(gradingSources[195]);
    gradedLayer195.name = "UNDLM_00195_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer195.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer195.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer195 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer195 = false;
if (editSources[195]) {
    var editLayer195 = planComp195.layers.add(editSources[195]);
    editLayer195.name = "UNDLM_00195_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer195.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer195.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer195 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity195 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer195) {
    // EDIT toujours activé quand disponible
    editLayer195.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer195) {
        gradedLayer195.enabled = false;
    }
} else if (hasGradedLayer195) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer195.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText195 = planComp195.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText195.name = "WARNING_NO_EDIT";
    warningText195.property("Transform").property("Position").setValue([1280, 200]);
    warningText195.guideLayer = true;
    
    var warningTextDoc195 = warningText195.property("Source Text").value;
    warningTextDoc195.fontSize = 32;
    warningTextDoc195.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc195.font = "Arial-BoldMT";
    warningTextDoc195.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText195.property("Source Text").setValue(warningTextDoc195);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText195 = planComp195.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00195");
    errorText195.name = "ERROR_NO_SOURCE";
    errorText195.property("Transform").property("Position").setValue([1280, 720]);
    errorText195.guideLayer = true;
    
    var errorTextDoc195 = errorText195.property("Source Text").value;
    errorTextDoc195.fontSize = 48;
    errorTextDoc195.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc195.font = "Arial-BoldMT";
    errorTextDoc195.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText195.property("Source Text").setValue(errorTextDoc195);
}

planCompositions[195] = planComp195;


// Composition pour plan 00196
var planComp196 = project.items.addComp(
    "SQ10_UNDLM_00196_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp196.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer196 = planComp196.layers.add(bgSolidComp);
bgLayer196.name = "BG_SOLID";
bgLayer196.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer196 = false;
if (gradingSources[196]) {
    var gradedLayer196 = planComp196.layers.add(gradingSources[196]);
    gradedLayer196.name = "UNDLM_00196_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer196.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer196.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer196 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer196 = false;
if (editSources[196]) {
    var editLayer196 = planComp196.layers.add(editSources[196]);
    editLayer196.name = "UNDLM_00196_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer196.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer196.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer196 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity196 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer196) {
    // EDIT toujours activé quand disponible
    editLayer196.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer196) {
        gradedLayer196.enabled = false;
    }
} else if (hasGradedLayer196) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer196.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText196 = planComp196.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText196.name = "WARNING_NO_EDIT";
    warningText196.property("Transform").property("Position").setValue([1280, 200]);
    warningText196.guideLayer = true;
    
    var warningTextDoc196 = warningText196.property("Source Text").value;
    warningTextDoc196.fontSize = 32;
    warningTextDoc196.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc196.font = "Arial-BoldMT";
    warningTextDoc196.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText196.property("Source Text").setValue(warningTextDoc196);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText196 = planComp196.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00196");
    errorText196.name = "ERROR_NO_SOURCE";
    errorText196.property("Transform").property("Position").setValue([1280, 720]);
    errorText196.guideLayer = true;
    
    var errorTextDoc196 = errorText196.property("Source Text").value;
    errorTextDoc196.fontSize = 48;
    errorTextDoc196.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc196.font = "Arial-BoldMT";
    errorTextDoc196.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText196.property("Source Text").setValue(errorTextDoc196);
}

planCompositions[196] = planComp196;


// Composition pour plan 00197
var planComp197 = project.items.addComp(
    "SQ10_UNDLM_00197_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp197.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer197 = planComp197.layers.add(bgSolidComp);
bgLayer197.name = "BG_SOLID";
bgLayer197.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer197 = false;
if (gradingSources[197]) {
    var gradedLayer197 = planComp197.layers.add(gradingSources[197]);
    gradedLayer197.name = "UNDLM_00197_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer197.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer197.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer197 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer197 = false;
if (editSources[197]) {
    var editLayer197 = planComp197.layers.add(editSources[197]);
    editLayer197.name = "UNDLM_00197_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer197.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer197.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer197 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity197 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer197) {
    // EDIT toujours activé quand disponible
    editLayer197.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer197) {
        gradedLayer197.enabled = false;
    }
} else if (hasGradedLayer197) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer197.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText197 = planComp197.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText197.name = "WARNING_NO_EDIT";
    warningText197.property("Transform").property("Position").setValue([1280, 200]);
    warningText197.guideLayer = true;
    
    var warningTextDoc197 = warningText197.property("Source Text").value;
    warningTextDoc197.fontSize = 32;
    warningTextDoc197.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc197.font = "Arial-BoldMT";
    warningTextDoc197.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText197.property("Source Text").setValue(warningTextDoc197);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText197 = planComp197.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00197");
    errorText197.name = "ERROR_NO_SOURCE";
    errorText197.property("Transform").property("Position").setValue([1280, 720]);
    errorText197.guideLayer = true;
    
    var errorTextDoc197 = errorText197.property("Source Text").value;
    errorTextDoc197.fontSize = 48;
    errorTextDoc197.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc197.font = "Arial-BoldMT";
    errorTextDoc197.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText197.property("Source Text").setValue(errorTextDoc197);
}

planCompositions[197] = planComp197;


// Composition pour plan 00198
var planComp198 = project.items.addComp(
    "SQ10_UNDLM_00198_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp198.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer198 = planComp198.layers.add(bgSolidComp);
bgLayer198.name = "BG_SOLID";
bgLayer198.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer198 = false;
if (gradingSources[198]) {
    var gradedLayer198 = planComp198.layers.add(gradingSources[198]);
    gradedLayer198.name = "UNDLM_00198_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer198.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer198.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer198 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer198 = false;
if (editSources[198]) {
    var editLayer198 = planComp198.layers.add(editSources[198]);
    editLayer198.name = "UNDLM_00198_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer198.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer198.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer198 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity198 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer198) {
    // EDIT toujours activé quand disponible
    editLayer198.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer198) {
        gradedLayer198.enabled = false;
    }
} else if (hasGradedLayer198) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer198.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText198 = planComp198.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText198.name = "WARNING_NO_EDIT";
    warningText198.property("Transform").property("Position").setValue([1280, 200]);
    warningText198.guideLayer = true;
    
    var warningTextDoc198 = warningText198.property("Source Text").value;
    warningTextDoc198.fontSize = 32;
    warningTextDoc198.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc198.font = "Arial-BoldMT";
    warningTextDoc198.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText198.property("Source Text").setValue(warningTextDoc198);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText198 = planComp198.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00198");
    errorText198.name = "ERROR_NO_SOURCE";
    errorText198.property("Transform").property("Position").setValue([1280, 720]);
    errorText198.guideLayer = true;
    
    var errorTextDoc198 = errorText198.property("Source Text").value;
    errorTextDoc198.fontSize = 48;
    errorTextDoc198.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc198.font = "Arial-BoldMT";
    errorTextDoc198.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText198.property("Source Text").setValue(errorTextDoc198);
}

planCompositions[198] = planComp198;


// Composition pour plan 00199
var planComp199 = project.items.addComp(
    "SQ10_UNDLM_00199_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp199.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer199 = planComp199.layers.add(bgSolidComp);
bgLayer199.name = "BG_SOLID";
bgLayer199.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer199 = false;
if (gradingSources[199]) {
    var gradedLayer199 = planComp199.layers.add(gradingSources[199]);
    gradedLayer199.name = "UNDLM_00199_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer199.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer199.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer199 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer199 = false;
if (editSources[199]) {
    var editLayer199 = planComp199.layers.add(editSources[199]);
    editLayer199.name = "UNDLM_00199_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer199.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer199.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer199 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity199 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer199) {
    // EDIT toujours activé quand disponible
    editLayer199.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer199) {
        gradedLayer199.enabled = false;
    }
} else if (hasGradedLayer199) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer199.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText199 = planComp199.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText199.name = "WARNING_NO_EDIT";
    warningText199.property("Transform").property("Position").setValue([1280, 200]);
    warningText199.guideLayer = true;
    
    var warningTextDoc199 = warningText199.property("Source Text").value;
    warningTextDoc199.fontSize = 32;
    warningTextDoc199.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc199.font = "Arial-BoldMT";
    warningTextDoc199.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText199.property("Source Text").setValue(warningTextDoc199);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText199 = planComp199.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00199");
    errorText199.name = "ERROR_NO_SOURCE";
    errorText199.property("Transform").property("Position").setValue([1280, 720]);
    errorText199.guideLayer = true;
    
    var errorTextDoc199 = errorText199.property("Source Text").value;
    errorTextDoc199.fontSize = 48;
    errorTextDoc199.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc199.font = "Arial-BoldMT";
    errorTextDoc199.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText199.property("Source Text").setValue(errorTextDoc199);
}

planCompositions[199] = planComp199;


// Composition pour plan 00200
var planComp200 = project.items.addComp(
    "SQ10_UNDLM_00200_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp200.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer200 = planComp200.layers.add(bgSolidComp);
bgLayer200.name = "BG_SOLID";
bgLayer200.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer200 = false;
if (gradingSources[200]) {
    var gradedLayer200 = planComp200.layers.add(gradingSources[200]);
    gradedLayer200.name = "UNDLM_00200_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer200.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer200.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer200 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer200 = false;
if (editSources[200]) {
    var editLayer200 = planComp200.layers.add(editSources[200]);
    editLayer200.name = "UNDLM_00200_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer200.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer200.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer200 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity200 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer200) {
    // EDIT toujours activé quand disponible
    editLayer200.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer200) {
        gradedLayer200.enabled = false;
    }
} else if (hasGradedLayer200) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer200.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText200 = planComp200.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText200.name = "WARNING_NO_EDIT";
    warningText200.property("Transform").property("Position").setValue([1280, 200]);
    warningText200.guideLayer = true;
    
    var warningTextDoc200 = warningText200.property("Source Text").value;
    warningTextDoc200.fontSize = 32;
    warningTextDoc200.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc200.font = "Arial-BoldMT";
    warningTextDoc200.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText200.property("Source Text").setValue(warningTextDoc200);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText200 = planComp200.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00200");
    errorText200.name = "ERROR_NO_SOURCE";
    errorText200.property("Transform").property("Position").setValue([1280, 720]);
    errorText200.guideLayer = true;
    
    var errorTextDoc200 = errorText200.property("Source Text").value;
    errorTextDoc200.fontSize = 48;
    errorTextDoc200.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc200.font = "Arial-BoldMT";
    errorTextDoc200.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText200.property("Source Text").setValue(errorTextDoc200);
}

planCompositions[200] = planComp200;


// Composition pour plan 00201
var planComp201 = project.items.addComp(
    "SQ10_UNDLM_00201_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp201.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer201 = planComp201.layers.add(bgSolidComp);
bgLayer201.name = "BG_SOLID";
bgLayer201.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer201 = false;
if (gradingSources[201]) {
    var gradedLayer201 = planComp201.layers.add(gradingSources[201]);
    gradedLayer201.name = "UNDLM_00201_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer201.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer201.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer201 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer201 = false;
if (editSources[201]) {
    var editLayer201 = planComp201.layers.add(editSources[201]);
    editLayer201.name = "UNDLM_00201_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer201.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer201.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer201 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity201 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer201) {
    // EDIT toujours activé quand disponible
    editLayer201.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer201) {
        gradedLayer201.enabled = false;
    }
} else if (hasGradedLayer201) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer201.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText201 = planComp201.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText201.name = "WARNING_NO_EDIT";
    warningText201.property("Transform").property("Position").setValue([1280, 200]);
    warningText201.guideLayer = true;
    
    var warningTextDoc201 = warningText201.property("Source Text").value;
    warningTextDoc201.fontSize = 32;
    warningTextDoc201.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc201.font = "Arial-BoldMT";
    warningTextDoc201.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText201.property("Source Text").setValue(warningTextDoc201);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText201 = planComp201.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00201");
    errorText201.name = "ERROR_NO_SOURCE";
    errorText201.property("Transform").property("Position").setValue([1280, 720]);
    errorText201.guideLayer = true;
    
    var errorTextDoc201 = errorText201.property("Source Text").value;
    errorTextDoc201.fontSize = 48;
    errorTextDoc201.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc201.font = "Arial-BoldMT";
    errorTextDoc201.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText201.property("Source Text").setValue(errorTextDoc201);
}

planCompositions[201] = planComp201;


// Composition pour plan 00202
var planComp202 = project.items.addComp(
    "SQ10_UNDLM_00202_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    11.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp202.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer202 = planComp202.layers.add(bgSolidComp);
bgLayer202.name = "BG_SOLID";
bgLayer202.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer202 = false;
if (gradingSources[202]) {
    var gradedLayer202 = planComp202.layers.add(gradingSources[202]);
    gradedLayer202.name = "UNDLM_00202_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer202.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer202.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer202 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer202 = false;
if (editSources[202]) {
    var editLayer202 = planComp202.layers.add(editSources[202]);
    editLayer202.name = "UNDLM_00202_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer202.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer202.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer202 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity202 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer202) {
    // EDIT toujours activé quand disponible
    editLayer202.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer202) {
        gradedLayer202.enabled = false;
    }
} else if (hasGradedLayer202) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer202.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText202 = planComp202.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText202.name = "WARNING_NO_EDIT";
    warningText202.property("Transform").property("Position").setValue([1280, 200]);
    warningText202.guideLayer = true;
    
    var warningTextDoc202 = warningText202.property("Source Text").value;
    warningTextDoc202.fontSize = 32;
    warningTextDoc202.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc202.font = "Arial-BoldMT";
    warningTextDoc202.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText202.property("Source Text").setValue(warningTextDoc202);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText202 = planComp202.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00202");
    errorText202.name = "ERROR_NO_SOURCE";
    errorText202.property("Transform").property("Position").setValue([1280, 720]);
    errorText202.guideLayer = true;
    
    var errorTextDoc202 = errorText202.property("Source Text").value;
    errorTextDoc202.fontSize = 48;
    errorTextDoc202.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc202.font = "Arial-BoldMT";
    errorTextDoc202.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText202.property("Source Text").setValue(errorTextDoc202);
}

planCompositions[202] = planComp202;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ10_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    79.6, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00191 à la timeline master
if (planCompositions[191]) {
    var masterLayer191 = masterComp.layers.add(planCompositions[191]);
    masterLayer191.startTime = 0;
    masterLayer191.name = "UNDLM_00191";
    masterLayer191.label = 1; // Couleurs alternées
}

// Ajouter plan 00192 à la timeline master
if (planCompositions[192]) {
    var masterLayer192 = masterComp.layers.add(planCompositions[192]);
    masterLayer192.startTime = 7.4;
    masterLayer192.name = "UNDLM_00192";
    masterLayer192.label = 2; // Couleurs alternées
}

// Ajouter plan 00193 à la timeline master
if (planCompositions[193]) {
    var masterLayer193 = masterComp.layers.add(planCompositions[193]);
    masterLayer193.startTime = 12.8;
    masterLayer193.name = "UNDLM_00193";
    masterLayer193.label = 3; // Couleurs alternées
}

// Ajouter plan 00194 à la timeline master
if (planCompositions[194]) {
    var masterLayer194 = masterComp.layers.add(planCompositions[194]);
    masterLayer194.startTime = 18.200000000000003;
    masterLayer194.name = "UNDLM_00194";
    masterLayer194.label = 4; // Couleurs alternées
}

// Ajouter plan 00195 à la timeline master
if (planCompositions[195]) {
    var masterLayer195 = masterComp.layers.add(planCompositions[195]);
    masterLayer195.startTime = 28.560000000000002;
    masterLayer195.name = "UNDLM_00195";
    masterLayer195.label = 5; // Couleurs alternées
}

// Ajouter plan 00196 à la timeline master
if (planCompositions[196]) {
    var masterLayer196 = masterComp.layers.add(planCompositions[196]);
    masterLayer196.startTime = 41.36;
    masterLayer196.name = "UNDLM_00196";
    masterLayer196.label = 6; // Couleurs alternées
}

// Ajouter plan 00197 à la timeline master
if (planCompositions[197]) {
    var masterLayer197 = masterComp.layers.add(planCompositions[197]);
    masterLayer197.startTime = 45.16;
    masterLayer197.name = "UNDLM_00197";
    masterLayer197.label = 7; // Couleurs alternées
}

// Ajouter plan 00198 à la timeline master
if (planCompositions[198]) {
    var masterLayer198 = masterComp.layers.add(planCompositions[198]);
    masterLayer198.startTime = 51.36;
    masterLayer198.name = "UNDLM_00198";
    masterLayer198.label = 8; // Couleurs alternées
}

// Ajouter plan 00199 à la timeline master
if (planCompositions[199]) {
    var masterLayer199 = masterComp.layers.add(planCompositions[199]);
    masterLayer199.startTime = 57.04;
    masterLayer199.name = "UNDLM_00199";
    masterLayer199.label = 9; // Couleurs alternées
}

// Ajouter plan 00200 à la timeline master
if (planCompositions[200]) {
    var masterLayer200 = masterComp.layers.add(planCompositions[200]);
    masterLayer200.startTime = 61.96;
    masterLayer200.name = "UNDLM_00200";
    masterLayer200.label = 10; // Couleurs alternées
}

// Ajouter plan 00201 à la timeline master
if (planCompositions[201]) {
    var masterLayer201 = masterComp.layers.add(planCompositions[201]);
    masterLayer201.startTime = 64.16;
    masterLayer201.name = "UNDLM_00201";
    masterLayer201.label = 11; // Couleurs alternées
}

// Ajouter plan 00202 à la timeline master
if (planCompositions[202]) {
    var masterLayer202 = masterComp.layers.add(planCompositions[202]);
    masterLayer202.startTime = 68.32;
    masterLayer202.name = "UNDLM_00202";
    masterLayer202.label = 12; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ10";\n' +
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
    {start: 0, end: 7.4, name: "UNDLM_00191"},
    {start: 7.4, end: 12.8, name: "UNDLM_00192"},
    {start: 12.8, end: 18.200000000000003, name: "UNDLM_00193"},
    {start: 18.200000000000003, end: 28.560000000000002, name: "UNDLM_00194"},
    {start: 28.560000000000002, end: 41.36, name: "UNDLM_00195"},
    {start: 41.36, end: 45.16, name: "UNDLM_00196"},
    {start: 45.16, end: 51.36, name: "UNDLM_00197"},
    {start: 51.36, end: 57.04, name: "UNDLM_00198"},
    {start: 57.04, end: 61.96, name: "UNDLM_00199"},
    {start: 61.96, end: 64.16, name: "UNDLM_00200"},
    {start: 64.16, end: 68.32, name: "UNDLM_00201"},
    {start: 68.32, end: 79.6, name: "UNDLM_00202"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ10/_AE/SQ10_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 12;
var totalCount = 12;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ10 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(79.6 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ10_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ10:" + totalCount + ":" + gradedCount);
