
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ15 avec 19 plans
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


// Import plan EDIT 00268
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile268 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00268.mov");
var editFilePoignees268 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00268_AVEC_POIGNEES.mov");
var editFileBis268 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00268bis.mov");

var importSuccess268 = false;
var fileName268 = "";

// Tenter import standard
if (editFile268.exists) {
    try {
        var editFootage268 = project.importFile(new ImportOptions(editFile268));
        editFootage268.parentFolder = fromEditFolder;
        editFootage268.name = "UNDLM_00268";
        editSources[268] = editFootage268;
        editImportCount++;
        importSuccess268 = true;
        fileName268 = "UNDLM_00268.mov";
        logImportSuccess(268, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00268.mov", fileName268);
    } catch (e) {
        logImportError(268, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00268.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess268 && editFilePoignees268.exists) {
    try {
        var editFootage268 = project.importFile(new ImportOptions(editFilePoignees268));
        editFootage268.parentFolder = fromEditFolder;
        editFootage268.name = "UNDLM_00268_AVEC_POIGNEES";
        editSources[268] = editFootage268;
        editImportCount++;
        importSuccess268 = true;
        fileName268 = "UNDLM_00268_AVEC_POIGNEES.mov";
        logImportSuccess(268, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00268_AVEC_POIGNEES.mov", fileName268);
    } catch (e) {
        logImportError(268, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00268_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess268 && editFileBis268.exists) {
    try {
        var editFootage268 = project.importFile(new ImportOptions(editFileBis268));
        editFootage268.parentFolder = fromEditFolder;
        editFootage268.name = "UNDLM_00268bis";
        editSources[268] = editFootage268;
        editImportCount++;
        importSuccess268 = true;
        fileName268 = "UNDLM_00268bis.mov";
        logImportSuccess(268, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00268bis.mov", fileName268);
    } catch (e) {
        logImportError(268, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00268bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess268) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00268.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00269
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile269 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00269.mov");
var editFilePoignees269 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00269_AVEC_POIGNEES.mov");
var editFileBis269 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00269bis.mov");

var importSuccess269 = false;
var fileName269 = "";

// Tenter import standard
if (editFile269.exists) {
    try {
        var editFootage269 = project.importFile(new ImportOptions(editFile269));
        editFootage269.parentFolder = fromEditFolder;
        editFootage269.name = "UNDLM_00269";
        editSources[269] = editFootage269;
        editImportCount++;
        importSuccess269 = true;
        fileName269 = "UNDLM_00269.mov";
        logImportSuccess(269, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00269.mov", fileName269);
    } catch (e) {
        logImportError(269, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00269.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess269 && editFilePoignees269.exists) {
    try {
        var editFootage269 = project.importFile(new ImportOptions(editFilePoignees269));
        editFootage269.parentFolder = fromEditFolder;
        editFootage269.name = "UNDLM_00269_AVEC_POIGNEES";
        editSources[269] = editFootage269;
        editImportCount++;
        importSuccess269 = true;
        fileName269 = "UNDLM_00269_AVEC_POIGNEES.mov";
        logImportSuccess(269, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00269_AVEC_POIGNEES.mov", fileName269);
    } catch (e) {
        logImportError(269, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00269_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess269 && editFileBis269.exists) {
    try {
        var editFootage269 = project.importFile(new ImportOptions(editFileBis269));
        editFootage269.parentFolder = fromEditFolder;
        editFootage269.name = "UNDLM_00269bis";
        editSources[269] = editFootage269;
        editImportCount++;
        importSuccess269 = true;
        fileName269 = "UNDLM_00269bis.mov";
        logImportSuccess(269, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00269bis.mov", fileName269);
    } catch (e) {
        logImportError(269, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00269bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess269) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00269.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00270
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile270 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00270.mov");
var editFilePoignees270 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00270_AVEC_POIGNEES.mov");
var editFileBis270 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00270bis.mov");

var importSuccess270 = false;
var fileName270 = "";

// Tenter import standard
if (editFile270.exists) {
    try {
        var editFootage270 = project.importFile(new ImportOptions(editFile270));
        editFootage270.parentFolder = fromEditFolder;
        editFootage270.name = "UNDLM_00270";
        editSources[270] = editFootage270;
        editImportCount++;
        importSuccess270 = true;
        fileName270 = "UNDLM_00270.mov";
        logImportSuccess(270, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00270.mov", fileName270);
    } catch (e) {
        logImportError(270, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00270.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess270 && editFilePoignees270.exists) {
    try {
        var editFootage270 = project.importFile(new ImportOptions(editFilePoignees270));
        editFootage270.parentFolder = fromEditFolder;
        editFootage270.name = "UNDLM_00270_AVEC_POIGNEES";
        editSources[270] = editFootage270;
        editImportCount++;
        importSuccess270 = true;
        fileName270 = "UNDLM_00270_AVEC_POIGNEES.mov";
        logImportSuccess(270, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00270_AVEC_POIGNEES.mov", fileName270);
    } catch (e) {
        logImportError(270, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00270_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess270 && editFileBis270.exists) {
    try {
        var editFootage270 = project.importFile(new ImportOptions(editFileBis270));
        editFootage270.parentFolder = fromEditFolder;
        editFootage270.name = "UNDLM_00270bis";
        editSources[270] = editFootage270;
        editImportCount++;
        importSuccess270 = true;
        fileName270 = "UNDLM_00270bis.mov";
        logImportSuccess(270, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00270bis.mov", fileName270);
    } catch (e) {
        logImportError(270, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00270bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess270) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00270.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00271
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile271 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00271.mov");
var editFilePoignees271 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00271_AVEC_POIGNEES.mov");
var editFileBis271 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00271bis.mov");

var importSuccess271 = false;
var fileName271 = "";

// Tenter import standard
if (editFile271.exists) {
    try {
        var editFootage271 = project.importFile(new ImportOptions(editFile271));
        editFootage271.parentFolder = fromEditFolder;
        editFootage271.name = "UNDLM_00271";
        editSources[271] = editFootage271;
        editImportCount++;
        importSuccess271 = true;
        fileName271 = "UNDLM_00271.mov";
        logImportSuccess(271, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00271.mov", fileName271);
    } catch (e) {
        logImportError(271, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00271.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess271 && editFilePoignees271.exists) {
    try {
        var editFootage271 = project.importFile(new ImportOptions(editFilePoignees271));
        editFootage271.parentFolder = fromEditFolder;
        editFootage271.name = "UNDLM_00271_AVEC_POIGNEES";
        editSources[271] = editFootage271;
        editImportCount++;
        importSuccess271 = true;
        fileName271 = "UNDLM_00271_AVEC_POIGNEES.mov";
        logImportSuccess(271, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00271_AVEC_POIGNEES.mov", fileName271);
    } catch (e) {
        logImportError(271, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00271_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess271 && editFileBis271.exists) {
    try {
        var editFootage271 = project.importFile(new ImportOptions(editFileBis271));
        editFootage271.parentFolder = fromEditFolder;
        editFootage271.name = "UNDLM_00271bis";
        editSources[271] = editFootage271;
        editImportCount++;
        importSuccess271 = true;
        fileName271 = "UNDLM_00271bis.mov";
        logImportSuccess(271, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00271bis.mov", fileName271);
    } catch (e) {
        logImportError(271, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00271bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess271) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00271.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00272
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile272 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00272.mov");
var editFilePoignees272 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00272_AVEC_POIGNEES.mov");
var editFileBis272 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00272bis.mov");

var importSuccess272 = false;
var fileName272 = "";

// Tenter import standard
if (editFile272.exists) {
    try {
        var editFootage272 = project.importFile(new ImportOptions(editFile272));
        editFootage272.parentFolder = fromEditFolder;
        editFootage272.name = "UNDLM_00272";
        editSources[272] = editFootage272;
        editImportCount++;
        importSuccess272 = true;
        fileName272 = "UNDLM_00272.mov";
        logImportSuccess(272, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00272.mov", fileName272);
    } catch (e) {
        logImportError(272, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00272.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess272 && editFilePoignees272.exists) {
    try {
        var editFootage272 = project.importFile(new ImportOptions(editFilePoignees272));
        editFootage272.parentFolder = fromEditFolder;
        editFootage272.name = "UNDLM_00272_AVEC_POIGNEES";
        editSources[272] = editFootage272;
        editImportCount++;
        importSuccess272 = true;
        fileName272 = "UNDLM_00272_AVEC_POIGNEES.mov";
        logImportSuccess(272, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00272_AVEC_POIGNEES.mov", fileName272);
    } catch (e) {
        logImportError(272, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00272_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess272 && editFileBis272.exists) {
    try {
        var editFootage272 = project.importFile(new ImportOptions(editFileBis272));
        editFootage272.parentFolder = fromEditFolder;
        editFootage272.name = "UNDLM_00272bis";
        editSources[272] = editFootage272;
        editImportCount++;
        importSuccess272 = true;
        fileName272 = "UNDLM_00272bis.mov";
        logImportSuccess(272, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00272bis.mov", fileName272);
    } catch (e) {
        logImportError(272, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00272bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess272) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00272.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00273
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile273 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00273.mov");
var editFilePoignees273 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00273_AVEC_POIGNEES.mov");
var editFileBis273 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00273bis.mov");

var importSuccess273 = false;
var fileName273 = "";

// Tenter import standard
if (editFile273.exists) {
    try {
        var editFootage273 = project.importFile(new ImportOptions(editFile273));
        editFootage273.parentFolder = fromEditFolder;
        editFootage273.name = "UNDLM_00273";
        editSources[273] = editFootage273;
        editImportCount++;
        importSuccess273 = true;
        fileName273 = "UNDLM_00273.mov";
        logImportSuccess(273, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00273.mov", fileName273);
    } catch (e) {
        logImportError(273, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00273.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess273 && editFilePoignees273.exists) {
    try {
        var editFootage273 = project.importFile(new ImportOptions(editFilePoignees273));
        editFootage273.parentFolder = fromEditFolder;
        editFootage273.name = "UNDLM_00273_AVEC_POIGNEES";
        editSources[273] = editFootage273;
        editImportCount++;
        importSuccess273 = true;
        fileName273 = "UNDLM_00273_AVEC_POIGNEES.mov";
        logImportSuccess(273, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00273_AVEC_POIGNEES.mov", fileName273);
    } catch (e) {
        logImportError(273, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00273_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess273 && editFileBis273.exists) {
    try {
        var editFootage273 = project.importFile(new ImportOptions(editFileBis273));
        editFootage273.parentFolder = fromEditFolder;
        editFootage273.name = "UNDLM_00273bis";
        editSources[273] = editFootage273;
        editImportCount++;
        importSuccess273 = true;
        fileName273 = "UNDLM_00273bis.mov";
        logImportSuccess(273, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00273bis.mov", fileName273);
    } catch (e) {
        logImportError(273, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00273bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess273) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00273.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00274
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile274 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00274.mov");
var editFilePoignees274 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00274_AVEC_POIGNEES.mov");
var editFileBis274 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00274bis.mov");

var importSuccess274 = false;
var fileName274 = "";

// Tenter import standard
if (editFile274.exists) {
    try {
        var editFootage274 = project.importFile(new ImportOptions(editFile274));
        editFootage274.parentFolder = fromEditFolder;
        editFootage274.name = "UNDLM_00274";
        editSources[274] = editFootage274;
        editImportCount++;
        importSuccess274 = true;
        fileName274 = "UNDLM_00274.mov";
        logImportSuccess(274, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00274.mov", fileName274);
    } catch (e) {
        logImportError(274, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00274.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess274 && editFilePoignees274.exists) {
    try {
        var editFootage274 = project.importFile(new ImportOptions(editFilePoignees274));
        editFootage274.parentFolder = fromEditFolder;
        editFootage274.name = "UNDLM_00274_AVEC_POIGNEES";
        editSources[274] = editFootage274;
        editImportCount++;
        importSuccess274 = true;
        fileName274 = "UNDLM_00274_AVEC_POIGNEES.mov";
        logImportSuccess(274, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00274_AVEC_POIGNEES.mov", fileName274);
    } catch (e) {
        logImportError(274, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00274_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess274 && editFileBis274.exists) {
    try {
        var editFootage274 = project.importFile(new ImportOptions(editFileBis274));
        editFootage274.parentFolder = fromEditFolder;
        editFootage274.name = "UNDLM_00274bis";
        editSources[274] = editFootage274;
        editImportCount++;
        importSuccess274 = true;
        fileName274 = "UNDLM_00274bis.mov";
        logImportSuccess(274, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00274bis.mov", fileName274);
    } catch (e) {
        logImportError(274, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00274bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess274) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00274.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00275
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile275 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00275.mov");
var editFilePoignees275 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00275_AVEC_POIGNEES.mov");
var editFileBis275 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00275bis.mov");

var importSuccess275 = false;
var fileName275 = "";

// Tenter import standard
if (editFile275.exists) {
    try {
        var editFootage275 = project.importFile(new ImportOptions(editFile275));
        editFootage275.parentFolder = fromEditFolder;
        editFootage275.name = "UNDLM_00275";
        editSources[275] = editFootage275;
        editImportCount++;
        importSuccess275 = true;
        fileName275 = "UNDLM_00275.mov";
        logImportSuccess(275, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00275.mov", fileName275);
    } catch (e) {
        logImportError(275, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00275.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess275 && editFilePoignees275.exists) {
    try {
        var editFootage275 = project.importFile(new ImportOptions(editFilePoignees275));
        editFootage275.parentFolder = fromEditFolder;
        editFootage275.name = "UNDLM_00275_AVEC_POIGNEES";
        editSources[275] = editFootage275;
        editImportCount++;
        importSuccess275 = true;
        fileName275 = "UNDLM_00275_AVEC_POIGNEES.mov";
        logImportSuccess(275, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00275_AVEC_POIGNEES.mov", fileName275);
    } catch (e) {
        logImportError(275, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00275_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess275 && editFileBis275.exists) {
    try {
        var editFootage275 = project.importFile(new ImportOptions(editFileBis275));
        editFootage275.parentFolder = fromEditFolder;
        editFootage275.name = "UNDLM_00275bis";
        editSources[275] = editFootage275;
        editImportCount++;
        importSuccess275 = true;
        fileName275 = "UNDLM_00275bis.mov";
        logImportSuccess(275, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00275bis.mov", fileName275);
    } catch (e) {
        logImportError(275, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00275bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess275) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00275.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00276
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile276 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00276.mov");
var editFilePoignees276 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00276_AVEC_POIGNEES.mov");
var editFileBis276 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00276bis.mov");

var importSuccess276 = false;
var fileName276 = "";

// Tenter import standard
if (editFile276.exists) {
    try {
        var editFootage276 = project.importFile(new ImportOptions(editFile276));
        editFootage276.parentFolder = fromEditFolder;
        editFootage276.name = "UNDLM_00276";
        editSources[276] = editFootage276;
        editImportCount++;
        importSuccess276 = true;
        fileName276 = "UNDLM_00276.mov";
        logImportSuccess(276, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00276.mov", fileName276);
    } catch (e) {
        logImportError(276, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00276.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess276 && editFilePoignees276.exists) {
    try {
        var editFootage276 = project.importFile(new ImportOptions(editFilePoignees276));
        editFootage276.parentFolder = fromEditFolder;
        editFootage276.name = "UNDLM_00276_AVEC_POIGNEES";
        editSources[276] = editFootage276;
        editImportCount++;
        importSuccess276 = true;
        fileName276 = "UNDLM_00276_AVEC_POIGNEES.mov";
        logImportSuccess(276, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00276_AVEC_POIGNEES.mov", fileName276);
    } catch (e) {
        logImportError(276, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00276_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess276 && editFileBis276.exists) {
    try {
        var editFootage276 = project.importFile(new ImportOptions(editFileBis276));
        editFootage276.parentFolder = fromEditFolder;
        editFootage276.name = "UNDLM_00276bis";
        editSources[276] = editFootage276;
        editImportCount++;
        importSuccess276 = true;
        fileName276 = "UNDLM_00276bis.mov";
        logImportSuccess(276, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00276bis.mov", fileName276);
    } catch (e) {
        logImportError(276, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00276bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess276) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00276.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00277
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile277 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00277.mov");
var editFilePoignees277 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00277_AVEC_POIGNEES.mov");
var editFileBis277 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00277bis.mov");

var importSuccess277 = false;
var fileName277 = "";

// Tenter import standard
if (editFile277.exists) {
    try {
        var editFootage277 = project.importFile(new ImportOptions(editFile277));
        editFootage277.parentFolder = fromEditFolder;
        editFootage277.name = "UNDLM_00277";
        editSources[277] = editFootage277;
        editImportCount++;
        importSuccess277 = true;
        fileName277 = "UNDLM_00277.mov";
        logImportSuccess(277, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00277.mov", fileName277);
    } catch (e) {
        logImportError(277, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00277.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess277 && editFilePoignees277.exists) {
    try {
        var editFootage277 = project.importFile(new ImportOptions(editFilePoignees277));
        editFootage277.parentFolder = fromEditFolder;
        editFootage277.name = "UNDLM_00277_AVEC_POIGNEES";
        editSources[277] = editFootage277;
        editImportCount++;
        importSuccess277 = true;
        fileName277 = "UNDLM_00277_AVEC_POIGNEES.mov";
        logImportSuccess(277, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00277_AVEC_POIGNEES.mov", fileName277);
    } catch (e) {
        logImportError(277, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00277_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess277 && editFileBis277.exists) {
    try {
        var editFootage277 = project.importFile(new ImportOptions(editFileBis277));
        editFootage277.parentFolder = fromEditFolder;
        editFootage277.name = "UNDLM_00277bis";
        editSources[277] = editFootage277;
        editImportCount++;
        importSuccess277 = true;
        fileName277 = "UNDLM_00277bis.mov";
        logImportSuccess(277, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00277bis.mov", fileName277);
    } catch (e) {
        logImportError(277, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00277bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess277) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00277.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00278
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile278 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00278.mov");
var editFilePoignees278 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00278_AVEC_POIGNEES.mov");
var editFileBis278 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00278bis.mov");

var importSuccess278 = false;
var fileName278 = "";

// Tenter import standard
if (editFile278.exists) {
    try {
        var editFootage278 = project.importFile(new ImportOptions(editFile278));
        editFootage278.parentFolder = fromEditFolder;
        editFootage278.name = "UNDLM_00278";
        editSources[278] = editFootage278;
        editImportCount++;
        importSuccess278 = true;
        fileName278 = "UNDLM_00278.mov";
        logImportSuccess(278, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00278.mov", fileName278);
    } catch (e) {
        logImportError(278, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00278.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess278 && editFilePoignees278.exists) {
    try {
        var editFootage278 = project.importFile(new ImportOptions(editFilePoignees278));
        editFootage278.parentFolder = fromEditFolder;
        editFootage278.name = "UNDLM_00278_AVEC_POIGNEES";
        editSources[278] = editFootage278;
        editImportCount++;
        importSuccess278 = true;
        fileName278 = "UNDLM_00278_AVEC_POIGNEES.mov";
        logImportSuccess(278, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00278_AVEC_POIGNEES.mov", fileName278);
    } catch (e) {
        logImportError(278, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00278_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess278 && editFileBis278.exists) {
    try {
        var editFootage278 = project.importFile(new ImportOptions(editFileBis278));
        editFootage278.parentFolder = fromEditFolder;
        editFootage278.name = "UNDLM_00278bis";
        editSources[278] = editFootage278;
        editImportCount++;
        importSuccess278 = true;
        fileName278 = "UNDLM_00278bis.mov";
        logImportSuccess(278, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00278bis.mov", fileName278);
    } catch (e) {
        logImportError(278, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00278bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess278) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00278.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00279
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile279 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00279.mov");
var editFilePoignees279 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00279_AVEC_POIGNEES.mov");
var editFileBis279 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00279bis.mov");

var importSuccess279 = false;
var fileName279 = "";

// Tenter import standard
if (editFile279.exists) {
    try {
        var editFootage279 = project.importFile(new ImportOptions(editFile279));
        editFootage279.parentFolder = fromEditFolder;
        editFootage279.name = "UNDLM_00279";
        editSources[279] = editFootage279;
        editImportCount++;
        importSuccess279 = true;
        fileName279 = "UNDLM_00279.mov";
        logImportSuccess(279, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00279.mov", fileName279);
    } catch (e) {
        logImportError(279, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00279.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess279 && editFilePoignees279.exists) {
    try {
        var editFootage279 = project.importFile(new ImportOptions(editFilePoignees279));
        editFootage279.parentFolder = fromEditFolder;
        editFootage279.name = "UNDLM_00279_AVEC_POIGNEES";
        editSources[279] = editFootage279;
        editImportCount++;
        importSuccess279 = true;
        fileName279 = "UNDLM_00279_AVEC_POIGNEES.mov";
        logImportSuccess(279, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00279_AVEC_POIGNEES.mov", fileName279);
    } catch (e) {
        logImportError(279, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00279_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess279 && editFileBis279.exists) {
    try {
        var editFootage279 = project.importFile(new ImportOptions(editFileBis279));
        editFootage279.parentFolder = fromEditFolder;
        editFootage279.name = "UNDLM_00279bis";
        editSources[279] = editFootage279;
        editImportCount++;
        importSuccess279 = true;
        fileName279 = "UNDLM_00279bis.mov";
        logImportSuccess(279, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00279bis.mov", fileName279);
    } catch (e) {
        logImportError(279, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00279bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess279) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00279.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00280
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile280 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00280.mov");
var editFilePoignees280 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00280_AVEC_POIGNEES.mov");
var editFileBis280 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00280bis.mov");

var importSuccess280 = false;
var fileName280 = "";

// Tenter import standard
if (editFile280.exists) {
    try {
        var editFootage280 = project.importFile(new ImportOptions(editFile280));
        editFootage280.parentFolder = fromEditFolder;
        editFootage280.name = "UNDLM_00280";
        editSources[280] = editFootage280;
        editImportCount++;
        importSuccess280 = true;
        fileName280 = "UNDLM_00280.mov";
        logImportSuccess(280, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00280.mov", fileName280);
    } catch (e) {
        logImportError(280, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00280.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess280 && editFilePoignees280.exists) {
    try {
        var editFootage280 = project.importFile(new ImportOptions(editFilePoignees280));
        editFootage280.parentFolder = fromEditFolder;
        editFootage280.name = "UNDLM_00280_AVEC_POIGNEES";
        editSources[280] = editFootage280;
        editImportCount++;
        importSuccess280 = true;
        fileName280 = "UNDLM_00280_AVEC_POIGNEES.mov";
        logImportSuccess(280, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00280_AVEC_POIGNEES.mov", fileName280);
    } catch (e) {
        logImportError(280, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00280_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess280 && editFileBis280.exists) {
    try {
        var editFootage280 = project.importFile(new ImportOptions(editFileBis280));
        editFootage280.parentFolder = fromEditFolder;
        editFootage280.name = "UNDLM_00280bis";
        editSources[280] = editFootage280;
        editImportCount++;
        importSuccess280 = true;
        fileName280 = "UNDLM_00280bis.mov";
        logImportSuccess(280, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00280bis.mov", fileName280);
    } catch (e) {
        logImportError(280, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00280bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess280) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00280.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00281
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile281 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00281.mov");
var editFilePoignees281 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00281_AVEC_POIGNEES.mov");
var editFileBis281 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00281bis.mov");

var importSuccess281 = false;
var fileName281 = "";

// Tenter import standard
if (editFile281.exists) {
    try {
        var editFootage281 = project.importFile(new ImportOptions(editFile281));
        editFootage281.parentFolder = fromEditFolder;
        editFootage281.name = "UNDLM_00281";
        editSources[281] = editFootage281;
        editImportCount++;
        importSuccess281 = true;
        fileName281 = "UNDLM_00281.mov";
        logImportSuccess(281, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00281.mov", fileName281);
    } catch (e) {
        logImportError(281, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00281.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess281 && editFilePoignees281.exists) {
    try {
        var editFootage281 = project.importFile(new ImportOptions(editFilePoignees281));
        editFootage281.parentFolder = fromEditFolder;
        editFootage281.name = "UNDLM_00281_AVEC_POIGNEES";
        editSources[281] = editFootage281;
        editImportCount++;
        importSuccess281 = true;
        fileName281 = "UNDLM_00281_AVEC_POIGNEES.mov";
        logImportSuccess(281, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00281_AVEC_POIGNEES.mov", fileName281);
    } catch (e) {
        logImportError(281, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00281_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess281 && editFileBis281.exists) {
    try {
        var editFootage281 = project.importFile(new ImportOptions(editFileBis281));
        editFootage281.parentFolder = fromEditFolder;
        editFootage281.name = "UNDLM_00281bis";
        editSources[281] = editFootage281;
        editImportCount++;
        importSuccess281 = true;
        fileName281 = "UNDLM_00281bis.mov";
        logImportSuccess(281, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00281bis.mov", fileName281);
    } catch (e) {
        logImportError(281, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00281bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess281) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00281.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00282
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile282 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00282.mov");
var editFilePoignees282 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00282_AVEC_POIGNEES.mov");
var editFileBis282 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00282bis.mov");

var importSuccess282 = false;
var fileName282 = "";

// Tenter import standard
if (editFile282.exists) {
    try {
        var editFootage282 = project.importFile(new ImportOptions(editFile282));
        editFootage282.parentFolder = fromEditFolder;
        editFootage282.name = "UNDLM_00282";
        editSources[282] = editFootage282;
        editImportCount++;
        importSuccess282 = true;
        fileName282 = "UNDLM_00282.mov";
        logImportSuccess(282, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00282.mov", fileName282);
    } catch (e) {
        logImportError(282, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00282.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess282 && editFilePoignees282.exists) {
    try {
        var editFootage282 = project.importFile(new ImportOptions(editFilePoignees282));
        editFootage282.parentFolder = fromEditFolder;
        editFootage282.name = "UNDLM_00282_AVEC_POIGNEES";
        editSources[282] = editFootage282;
        editImportCount++;
        importSuccess282 = true;
        fileName282 = "UNDLM_00282_AVEC_POIGNEES.mov";
        logImportSuccess(282, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00282_AVEC_POIGNEES.mov", fileName282);
    } catch (e) {
        logImportError(282, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00282_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess282 && editFileBis282.exists) {
    try {
        var editFootage282 = project.importFile(new ImportOptions(editFileBis282));
        editFootage282.parentFolder = fromEditFolder;
        editFootage282.name = "UNDLM_00282bis";
        editSources[282] = editFootage282;
        editImportCount++;
        importSuccess282 = true;
        fileName282 = "UNDLM_00282bis.mov";
        logImportSuccess(282, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00282bis.mov", fileName282);
    } catch (e) {
        logImportError(282, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00282bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess282) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00282.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00283
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile283 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00283.mov");
var editFilePoignees283 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00283_AVEC_POIGNEES.mov");
var editFileBis283 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00283bis.mov");

var importSuccess283 = false;
var fileName283 = "";

// Tenter import standard
if (editFile283.exists) {
    try {
        var editFootage283 = project.importFile(new ImportOptions(editFile283));
        editFootage283.parentFolder = fromEditFolder;
        editFootage283.name = "UNDLM_00283";
        editSources[283] = editFootage283;
        editImportCount++;
        importSuccess283 = true;
        fileName283 = "UNDLM_00283.mov";
        logImportSuccess(283, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00283.mov", fileName283);
    } catch (e) {
        logImportError(283, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00283.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess283 && editFilePoignees283.exists) {
    try {
        var editFootage283 = project.importFile(new ImportOptions(editFilePoignees283));
        editFootage283.parentFolder = fromEditFolder;
        editFootage283.name = "UNDLM_00283_AVEC_POIGNEES";
        editSources[283] = editFootage283;
        editImportCount++;
        importSuccess283 = true;
        fileName283 = "UNDLM_00283_AVEC_POIGNEES.mov";
        logImportSuccess(283, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00283_AVEC_POIGNEES.mov", fileName283);
    } catch (e) {
        logImportError(283, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00283_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess283 && editFileBis283.exists) {
    try {
        var editFootage283 = project.importFile(new ImportOptions(editFileBis283));
        editFootage283.parentFolder = fromEditFolder;
        editFootage283.name = "UNDLM_00283bis";
        editSources[283] = editFootage283;
        editImportCount++;
        importSuccess283 = true;
        fileName283 = "UNDLM_00283bis.mov";
        logImportSuccess(283, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00283bis.mov", fileName283);
    } catch (e) {
        logImportError(283, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00283bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess283) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00283.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00284
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile284 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00284.mov");
var editFilePoignees284 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00284_AVEC_POIGNEES.mov");
var editFileBis284 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00284bis.mov");

var importSuccess284 = false;
var fileName284 = "";

// Tenter import standard
if (editFile284.exists) {
    try {
        var editFootage284 = project.importFile(new ImportOptions(editFile284));
        editFootage284.parentFolder = fromEditFolder;
        editFootage284.name = "UNDLM_00284";
        editSources[284] = editFootage284;
        editImportCount++;
        importSuccess284 = true;
        fileName284 = "UNDLM_00284.mov";
        logImportSuccess(284, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00284.mov", fileName284);
    } catch (e) {
        logImportError(284, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00284.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess284 && editFilePoignees284.exists) {
    try {
        var editFootage284 = project.importFile(new ImportOptions(editFilePoignees284));
        editFootage284.parentFolder = fromEditFolder;
        editFootage284.name = "UNDLM_00284_AVEC_POIGNEES";
        editSources[284] = editFootage284;
        editImportCount++;
        importSuccess284 = true;
        fileName284 = "UNDLM_00284_AVEC_POIGNEES.mov";
        logImportSuccess(284, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00284_AVEC_POIGNEES.mov", fileName284);
    } catch (e) {
        logImportError(284, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00284_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess284 && editFileBis284.exists) {
    try {
        var editFootage284 = project.importFile(new ImportOptions(editFileBis284));
        editFootage284.parentFolder = fromEditFolder;
        editFootage284.name = "UNDLM_00284bis";
        editSources[284] = editFootage284;
        editImportCount++;
        importSuccess284 = true;
        fileName284 = "UNDLM_00284bis.mov";
        logImportSuccess(284, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00284bis.mov", fileName284);
    } catch (e) {
        logImportError(284, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00284bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess284) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00284.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00285
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile285 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00285.mov");
var editFilePoignees285 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00285_AVEC_POIGNEES.mov");
var editFileBis285 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00285bis.mov");

var importSuccess285 = false;
var fileName285 = "";

// Tenter import standard
if (editFile285.exists) {
    try {
        var editFootage285 = project.importFile(new ImportOptions(editFile285));
        editFootage285.parentFolder = fromEditFolder;
        editFootage285.name = "UNDLM_00285";
        editSources[285] = editFootage285;
        editImportCount++;
        importSuccess285 = true;
        fileName285 = "UNDLM_00285.mov";
        logImportSuccess(285, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00285.mov", fileName285);
    } catch (e) {
        logImportError(285, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00285.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess285 && editFilePoignees285.exists) {
    try {
        var editFootage285 = project.importFile(new ImportOptions(editFilePoignees285));
        editFootage285.parentFolder = fromEditFolder;
        editFootage285.name = "UNDLM_00285_AVEC_POIGNEES";
        editSources[285] = editFootage285;
        editImportCount++;
        importSuccess285 = true;
        fileName285 = "UNDLM_00285_AVEC_POIGNEES.mov";
        logImportSuccess(285, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00285_AVEC_POIGNEES.mov", fileName285);
    } catch (e) {
        logImportError(285, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00285_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess285 && editFileBis285.exists) {
    try {
        var editFootage285 = project.importFile(new ImportOptions(editFileBis285));
        editFootage285.parentFolder = fromEditFolder;
        editFootage285.name = "UNDLM_00285bis";
        editSources[285] = editFootage285;
        editImportCount++;
        importSuccess285 = true;
        fileName285 = "UNDLM_00285bis.mov";
        logImportSuccess(285, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00285bis.mov", fileName285);
    } catch (e) {
        logImportError(285, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00285bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess285) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00285.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00286
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile286 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00286.mov");
var editFilePoignees286 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00286_AVEC_POIGNEES.mov");
var editFileBis286 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00286bis.mov");

var importSuccess286 = false;
var fileName286 = "";

// Tenter import standard
if (editFile286.exists) {
    try {
        var editFootage286 = project.importFile(new ImportOptions(editFile286));
        editFootage286.parentFolder = fromEditFolder;
        editFootage286.name = "UNDLM_00286";
        editSources[286] = editFootage286;
        editImportCount++;
        importSuccess286 = true;
        fileName286 = "UNDLM_00286.mov";
        logImportSuccess(286, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00286.mov", fileName286);
    } catch (e) {
        logImportError(286, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00286.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess286 && editFilePoignees286.exists) {
    try {
        var editFootage286 = project.importFile(new ImportOptions(editFilePoignees286));
        editFootage286.parentFolder = fromEditFolder;
        editFootage286.name = "UNDLM_00286_AVEC_POIGNEES";
        editSources[286] = editFootage286;
        editImportCount++;
        importSuccess286 = true;
        fileName286 = "UNDLM_00286_AVEC_POIGNEES.mov";
        logImportSuccess(286, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00286_AVEC_POIGNEES.mov", fileName286);
    } catch (e) {
        logImportError(286, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00286_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess286 && editFileBis286.exists) {
    try {
        var editFootage286 = project.importFile(new ImportOptions(editFileBis286));
        editFootage286.parentFolder = fromEditFolder;
        editFootage286.name = "UNDLM_00286bis";
        editSources[286] = editFootage286;
        editImportCount++;
        importSuccess286 = true;
        fileName286 = "UNDLM_00286bis.mov";
        logImportSuccess(286, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00286bis.mov", fileName286);
    } catch (e) {
        logImportError(286, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00286bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess286) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00286.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00268
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile268 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00268.mov");
var gradedFilePoignees268 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00268_AVEC_POIGNEES.mov");
var gradedFileBis268 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00268bis.mov");

var gradedImportSuccess268 = false;
var gradedFileName268 = "";

// Tenter import standard
if (gradedFile268.exists) {
    try {
        var gradedFootage268 = project.importFile(new ImportOptions(gradedFile268));
        gradedFootage268.parentFolder = fromGradingFolder;
        gradedFootage268.name = "UNDLM_00268";
        gradingSources[268] = gradedFootage268;
        gradingImportCount++;
        gradedImportSuccess268 = true;
        gradedFileName268 = "UNDLM_00268.mov";
        logImportSuccess(268, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00268.mov", gradedFileName268);
    } catch (e) {
        logImportError(268, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00268.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess268 && gradedFilePoignees268.exists) {
    try {
        var gradedFootage268 = project.importFile(new ImportOptions(gradedFilePoignees268));
        gradedFootage268.parentFolder = fromGradingFolder;
        gradedFootage268.name = "UNDLM_00268_AVEC_POIGNEES";
        gradingSources[268] = gradedFootage268;
        gradingImportCount++;
        gradedImportSuccess268 = true;
        gradedFileName268 = "UNDLM_00268_AVEC_POIGNEES.mov";
        logImportSuccess(268, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00268_AVEC_POIGNEES.mov", gradedFileName268);
    } catch (e) {
        logImportError(268, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00268_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess268 && gradedFileBis268.exists) {
    try {
        var gradedFootage268 = project.importFile(new ImportOptions(gradedFileBis268));
        gradedFootage268.parentFolder = fromGradingFolder;
        gradedFootage268.name = "UNDLM_00268bis";
        gradingSources[268] = gradedFootage268;
        gradingImportCount++;
        gradedImportSuccess268 = true;
        gradedFileName268 = "UNDLM_00268bis.mov";
        logImportSuccess(268, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00268bis.mov", gradedFileName268);
    } catch (e) {
        logImportError(268, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00268bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess268) {
    missingGradingCount++;
}

// Import plan GRADED 00269
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile269 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00269.mov");
var gradedFilePoignees269 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00269_AVEC_POIGNEES.mov");
var gradedFileBis269 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00269bis.mov");

var gradedImportSuccess269 = false;
var gradedFileName269 = "";

// Tenter import standard
if (gradedFile269.exists) {
    try {
        var gradedFootage269 = project.importFile(new ImportOptions(gradedFile269));
        gradedFootage269.parentFolder = fromGradingFolder;
        gradedFootage269.name = "UNDLM_00269";
        gradingSources[269] = gradedFootage269;
        gradingImportCount++;
        gradedImportSuccess269 = true;
        gradedFileName269 = "UNDLM_00269.mov";
        logImportSuccess(269, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00269.mov", gradedFileName269);
    } catch (e) {
        logImportError(269, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00269.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess269 && gradedFilePoignees269.exists) {
    try {
        var gradedFootage269 = project.importFile(new ImportOptions(gradedFilePoignees269));
        gradedFootage269.parentFolder = fromGradingFolder;
        gradedFootage269.name = "UNDLM_00269_AVEC_POIGNEES";
        gradingSources[269] = gradedFootage269;
        gradingImportCount++;
        gradedImportSuccess269 = true;
        gradedFileName269 = "UNDLM_00269_AVEC_POIGNEES.mov";
        logImportSuccess(269, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00269_AVEC_POIGNEES.mov", gradedFileName269);
    } catch (e) {
        logImportError(269, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00269_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess269 && gradedFileBis269.exists) {
    try {
        var gradedFootage269 = project.importFile(new ImportOptions(gradedFileBis269));
        gradedFootage269.parentFolder = fromGradingFolder;
        gradedFootage269.name = "UNDLM_00269bis";
        gradingSources[269] = gradedFootage269;
        gradingImportCount++;
        gradedImportSuccess269 = true;
        gradedFileName269 = "UNDLM_00269bis.mov";
        logImportSuccess(269, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00269bis.mov", gradedFileName269);
    } catch (e) {
        logImportError(269, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00269bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess269) {
    missingGradingCount++;
}

// Import plan GRADED 00270
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile270 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00270.mov");
var gradedFilePoignees270 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00270_AVEC_POIGNEES.mov");
var gradedFileBis270 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00270bis.mov");

var gradedImportSuccess270 = false;
var gradedFileName270 = "";

// Tenter import standard
if (gradedFile270.exists) {
    try {
        var gradedFootage270 = project.importFile(new ImportOptions(gradedFile270));
        gradedFootage270.parentFolder = fromGradingFolder;
        gradedFootage270.name = "UNDLM_00270";
        gradingSources[270] = gradedFootage270;
        gradingImportCount++;
        gradedImportSuccess270 = true;
        gradedFileName270 = "UNDLM_00270.mov";
        logImportSuccess(270, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00270.mov", gradedFileName270);
    } catch (e) {
        logImportError(270, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00270.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess270 && gradedFilePoignees270.exists) {
    try {
        var gradedFootage270 = project.importFile(new ImportOptions(gradedFilePoignees270));
        gradedFootage270.parentFolder = fromGradingFolder;
        gradedFootage270.name = "UNDLM_00270_AVEC_POIGNEES";
        gradingSources[270] = gradedFootage270;
        gradingImportCount++;
        gradedImportSuccess270 = true;
        gradedFileName270 = "UNDLM_00270_AVEC_POIGNEES.mov";
        logImportSuccess(270, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00270_AVEC_POIGNEES.mov", gradedFileName270);
    } catch (e) {
        logImportError(270, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00270_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess270 && gradedFileBis270.exists) {
    try {
        var gradedFootage270 = project.importFile(new ImportOptions(gradedFileBis270));
        gradedFootage270.parentFolder = fromGradingFolder;
        gradedFootage270.name = "UNDLM_00270bis";
        gradingSources[270] = gradedFootage270;
        gradingImportCount++;
        gradedImportSuccess270 = true;
        gradedFileName270 = "UNDLM_00270bis.mov";
        logImportSuccess(270, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00270bis.mov", gradedFileName270);
    } catch (e) {
        logImportError(270, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00270bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess270) {
    missingGradingCount++;
}

// Import plan GRADED 00271
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile271 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00271.mov");
var gradedFilePoignees271 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00271_AVEC_POIGNEES.mov");
var gradedFileBis271 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00271bis.mov");

var gradedImportSuccess271 = false;
var gradedFileName271 = "";

// Tenter import standard
if (gradedFile271.exists) {
    try {
        var gradedFootage271 = project.importFile(new ImportOptions(gradedFile271));
        gradedFootage271.parentFolder = fromGradingFolder;
        gradedFootage271.name = "UNDLM_00271";
        gradingSources[271] = gradedFootage271;
        gradingImportCount++;
        gradedImportSuccess271 = true;
        gradedFileName271 = "UNDLM_00271.mov";
        logImportSuccess(271, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00271.mov", gradedFileName271);
    } catch (e) {
        logImportError(271, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00271.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess271 && gradedFilePoignees271.exists) {
    try {
        var gradedFootage271 = project.importFile(new ImportOptions(gradedFilePoignees271));
        gradedFootage271.parentFolder = fromGradingFolder;
        gradedFootage271.name = "UNDLM_00271_AVEC_POIGNEES";
        gradingSources[271] = gradedFootage271;
        gradingImportCount++;
        gradedImportSuccess271 = true;
        gradedFileName271 = "UNDLM_00271_AVEC_POIGNEES.mov";
        logImportSuccess(271, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00271_AVEC_POIGNEES.mov", gradedFileName271);
    } catch (e) {
        logImportError(271, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00271_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess271 && gradedFileBis271.exists) {
    try {
        var gradedFootage271 = project.importFile(new ImportOptions(gradedFileBis271));
        gradedFootage271.parentFolder = fromGradingFolder;
        gradedFootage271.name = "UNDLM_00271bis";
        gradingSources[271] = gradedFootage271;
        gradingImportCount++;
        gradedImportSuccess271 = true;
        gradedFileName271 = "UNDLM_00271bis.mov";
        logImportSuccess(271, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00271bis.mov", gradedFileName271);
    } catch (e) {
        logImportError(271, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00271bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess271) {
    missingGradingCount++;
}

// Import plan GRADED 00272
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile272 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00272.mov");
var gradedFilePoignees272 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00272_AVEC_POIGNEES.mov");
var gradedFileBis272 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00272bis.mov");

var gradedImportSuccess272 = false;
var gradedFileName272 = "";

// Tenter import standard
if (gradedFile272.exists) {
    try {
        var gradedFootage272 = project.importFile(new ImportOptions(gradedFile272));
        gradedFootage272.parentFolder = fromGradingFolder;
        gradedFootage272.name = "UNDLM_00272";
        gradingSources[272] = gradedFootage272;
        gradingImportCount++;
        gradedImportSuccess272 = true;
        gradedFileName272 = "UNDLM_00272.mov";
        logImportSuccess(272, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00272.mov", gradedFileName272);
    } catch (e) {
        logImportError(272, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00272.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess272 && gradedFilePoignees272.exists) {
    try {
        var gradedFootage272 = project.importFile(new ImportOptions(gradedFilePoignees272));
        gradedFootage272.parentFolder = fromGradingFolder;
        gradedFootage272.name = "UNDLM_00272_AVEC_POIGNEES";
        gradingSources[272] = gradedFootage272;
        gradingImportCount++;
        gradedImportSuccess272 = true;
        gradedFileName272 = "UNDLM_00272_AVEC_POIGNEES.mov";
        logImportSuccess(272, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00272_AVEC_POIGNEES.mov", gradedFileName272);
    } catch (e) {
        logImportError(272, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00272_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess272 && gradedFileBis272.exists) {
    try {
        var gradedFootage272 = project.importFile(new ImportOptions(gradedFileBis272));
        gradedFootage272.parentFolder = fromGradingFolder;
        gradedFootage272.name = "UNDLM_00272bis";
        gradingSources[272] = gradedFootage272;
        gradingImportCount++;
        gradedImportSuccess272 = true;
        gradedFileName272 = "UNDLM_00272bis.mov";
        logImportSuccess(272, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00272bis.mov", gradedFileName272);
    } catch (e) {
        logImportError(272, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00272bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess272) {
    missingGradingCount++;
}

// Import plan GRADED 00273
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile273 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00273.mov");
var gradedFilePoignees273 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00273_AVEC_POIGNEES.mov");
var gradedFileBis273 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00273bis.mov");

var gradedImportSuccess273 = false;
var gradedFileName273 = "";

// Tenter import standard
if (gradedFile273.exists) {
    try {
        var gradedFootage273 = project.importFile(new ImportOptions(gradedFile273));
        gradedFootage273.parentFolder = fromGradingFolder;
        gradedFootage273.name = "UNDLM_00273";
        gradingSources[273] = gradedFootage273;
        gradingImportCount++;
        gradedImportSuccess273 = true;
        gradedFileName273 = "UNDLM_00273.mov";
        logImportSuccess(273, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00273.mov", gradedFileName273);
    } catch (e) {
        logImportError(273, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00273.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess273 && gradedFilePoignees273.exists) {
    try {
        var gradedFootage273 = project.importFile(new ImportOptions(gradedFilePoignees273));
        gradedFootage273.parentFolder = fromGradingFolder;
        gradedFootage273.name = "UNDLM_00273_AVEC_POIGNEES";
        gradingSources[273] = gradedFootage273;
        gradingImportCount++;
        gradedImportSuccess273 = true;
        gradedFileName273 = "UNDLM_00273_AVEC_POIGNEES.mov";
        logImportSuccess(273, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00273_AVEC_POIGNEES.mov", gradedFileName273);
    } catch (e) {
        logImportError(273, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00273_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess273 && gradedFileBis273.exists) {
    try {
        var gradedFootage273 = project.importFile(new ImportOptions(gradedFileBis273));
        gradedFootage273.parentFolder = fromGradingFolder;
        gradedFootage273.name = "UNDLM_00273bis";
        gradingSources[273] = gradedFootage273;
        gradingImportCount++;
        gradedImportSuccess273 = true;
        gradedFileName273 = "UNDLM_00273bis.mov";
        logImportSuccess(273, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00273bis.mov", gradedFileName273);
    } catch (e) {
        logImportError(273, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00273bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess273) {
    missingGradingCount++;
}

// Import plan GRADED 00274
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile274 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00274.mov");
var gradedFilePoignees274 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00274_AVEC_POIGNEES.mov");
var gradedFileBis274 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00274bis.mov");

var gradedImportSuccess274 = false;
var gradedFileName274 = "";

// Tenter import standard
if (gradedFile274.exists) {
    try {
        var gradedFootage274 = project.importFile(new ImportOptions(gradedFile274));
        gradedFootage274.parentFolder = fromGradingFolder;
        gradedFootage274.name = "UNDLM_00274";
        gradingSources[274] = gradedFootage274;
        gradingImportCount++;
        gradedImportSuccess274 = true;
        gradedFileName274 = "UNDLM_00274.mov";
        logImportSuccess(274, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00274.mov", gradedFileName274);
    } catch (e) {
        logImportError(274, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00274.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess274 && gradedFilePoignees274.exists) {
    try {
        var gradedFootage274 = project.importFile(new ImportOptions(gradedFilePoignees274));
        gradedFootage274.parentFolder = fromGradingFolder;
        gradedFootage274.name = "UNDLM_00274_AVEC_POIGNEES";
        gradingSources[274] = gradedFootage274;
        gradingImportCount++;
        gradedImportSuccess274 = true;
        gradedFileName274 = "UNDLM_00274_AVEC_POIGNEES.mov";
        logImportSuccess(274, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00274_AVEC_POIGNEES.mov", gradedFileName274);
    } catch (e) {
        logImportError(274, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00274_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess274 && gradedFileBis274.exists) {
    try {
        var gradedFootage274 = project.importFile(new ImportOptions(gradedFileBis274));
        gradedFootage274.parentFolder = fromGradingFolder;
        gradedFootage274.name = "UNDLM_00274bis";
        gradingSources[274] = gradedFootage274;
        gradingImportCount++;
        gradedImportSuccess274 = true;
        gradedFileName274 = "UNDLM_00274bis.mov";
        logImportSuccess(274, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00274bis.mov", gradedFileName274);
    } catch (e) {
        logImportError(274, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00274bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess274) {
    missingGradingCount++;
}

// Import plan GRADED 00275
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile275 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00275.mov");
var gradedFilePoignees275 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00275_AVEC_POIGNEES.mov");
var gradedFileBis275 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00275bis.mov");

var gradedImportSuccess275 = false;
var gradedFileName275 = "";

// Tenter import standard
if (gradedFile275.exists) {
    try {
        var gradedFootage275 = project.importFile(new ImportOptions(gradedFile275));
        gradedFootage275.parentFolder = fromGradingFolder;
        gradedFootage275.name = "UNDLM_00275";
        gradingSources[275] = gradedFootage275;
        gradingImportCount++;
        gradedImportSuccess275 = true;
        gradedFileName275 = "UNDLM_00275.mov";
        logImportSuccess(275, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00275.mov", gradedFileName275);
    } catch (e) {
        logImportError(275, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00275.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess275 && gradedFilePoignees275.exists) {
    try {
        var gradedFootage275 = project.importFile(new ImportOptions(gradedFilePoignees275));
        gradedFootage275.parentFolder = fromGradingFolder;
        gradedFootage275.name = "UNDLM_00275_AVEC_POIGNEES";
        gradingSources[275] = gradedFootage275;
        gradingImportCount++;
        gradedImportSuccess275 = true;
        gradedFileName275 = "UNDLM_00275_AVEC_POIGNEES.mov";
        logImportSuccess(275, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00275_AVEC_POIGNEES.mov", gradedFileName275);
    } catch (e) {
        logImportError(275, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00275_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess275 && gradedFileBis275.exists) {
    try {
        var gradedFootage275 = project.importFile(new ImportOptions(gradedFileBis275));
        gradedFootage275.parentFolder = fromGradingFolder;
        gradedFootage275.name = "UNDLM_00275bis";
        gradingSources[275] = gradedFootage275;
        gradingImportCount++;
        gradedImportSuccess275 = true;
        gradedFileName275 = "UNDLM_00275bis.mov";
        logImportSuccess(275, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00275bis.mov", gradedFileName275);
    } catch (e) {
        logImportError(275, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00275bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess275) {
    missingGradingCount++;
}

// Import plan GRADED 00276
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile276 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00276.mov");
var gradedFilePoignees276 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00276_AVEC_POIGNEES.mov");
var gradedFileBis276 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00276bis.mov");

var gradedImportSuccess276 = false;
var gradedFileName276 = "";

// Tenter import standard
if (gradedFile276.exists) {
    try {
        var gradedFootage276 = project.importFile(new ImportOptions(gradedFile276));
        gradedFootage276.parentFolder = fromGradingFolder;
        gradedFootage276.name = "UNDLM_00276";
        gradingSources[276] = gradedFootage276;
        gradingImportCount++;
        gradedImportSuccess276 = true;
        gradedFileName276 = "UNDLM_00276.mov";
        logImportSuccess(276, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00276.mov", gradedFileName276);
    } catch (e) {
        logImportError(276, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00276.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess276 && gradedFilePoignees276.exists) {
    try {
        var gradedFootage276 = project.importFile(new ImportOptions(gradedFilePoignees276));
        gradedFootage276.parentFolder = fromGradingFolder;
        gradedFootage276.name = "UNDLM_00276_AVEC_POIGNEES";
        gradingSources[276] = gradedFootage276;
        gradingImportCount++;
        gradedImportSuccess276 = true;
        gradedFileName276 = "UNDLM_00276_AVEC_POIGNEES.mov";
        logImportSuccess(276, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00276_AVEC_POIGNEES.mov", gradedFileName276);
    } catch (e) {
        logImportError(276, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00276_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess276 && gradedFileBis276.exists) {
    try {
        var gradedFootage276 = project.importFile(new ImportOptions(gradedFileBis276));
        gradedFootage276.parentFolder = fromGradingFolder;
        gradedFootage276.name = "UNDLM_00276bis";
        gradingSources[276] = gradedFootage276;
        gradingImportCount++;
        gradedImportSuccess276 = true;
        gradedFileName276 = "UNDLM_00276bis.mov";
        logImportSuccess(276, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00276bis.mov", gradedFileName276);
    } catch (e) {
        logImportError(276, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00276bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess276) {
    missingGradingCount++;
}

// Import plan GRADED 00277
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile277 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00277.mov");
var gradedFilePoignees277 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00277_AVEC_POIGNEES.mov");
var gradedFileBis277 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00277bis.mov");

var gradedImportSuccess277 = false;
var gradedFileName277 = "";

// Tenter import standard
if (gradedFile277.exists) {
    try {
        var gradedFootage277 = project.importFile(new ImportOptions(gradedFile277));
        gradedFootage277.parentFolder = fromGradingFolder;
        gradedFootage277.name = "UNDLM_00277";
        gradingSources[277] = gradedFootage277;
        gradingImportCount++;
        gradedImportSuccess277 = true;
        gradedFileName277 = "UNDLM_00277.mov";
        logImportSuccess(277, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00277.mov", gradedFileName277);
    } catch (e) {
        logImportError(277, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00277.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess277 && gradedFilePoignees277.exists) {
    try {
        var gradedFootage277 = project.importFile(new ImportOptions(gradedFilePoignees277));
        gradedFootage277.parentFolder = fromGradingFolder;
        gradedFootage277.name = "UNDLM_00277_AVEC_POIGNEES";
        gradingSources[277] = gradedFootage277;
        gradingImportCount++;
        gradedImportSuccess277 = true;
        gradedFileName277 = "UNDLM_00277_AVEC_POIGNEES.mov";
        logImportSuccess(277, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00277_AVEC_POIGNEES.mov", gradedFileName277);
    } catch (e) {
        logImportError(277, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00277_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess277 && gradedFileBis277.exists) {
    try {
        var gradedFootage277 = project.importFile(new ImportOptions(gradedFileBis277));
        gradedFootage277.parentFolder = fromGradingFolder;
        gradedFootage277.name = "UNDLM_00277bis";
        gradingSources[277] = gradedFootage277;
        gradingImportCount++;
        gradedImportSuccess277 = true;
        gradedFileName277 = "UNDLM_00277bis.mov";
        logImportSuccess(277, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00277bis.mov", gradedFileName277);
    } catch (e) {
        logImportError(277, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00277bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess277) {
    missingGradingCount++;
}

// Import plan GRADED 00278
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile278 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00278.mov");
var gradedFilePoignees278 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00278_AVEC_POIGNEES.mov");
var gradedFileBis278 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00278bis.mov");

var gradedImportSuccess278 = false;
var gradedFileName278 = "";

// Tenter import standard
if (gradedFile278.exists) {
    try {
        var gradedFootage278 = project.importFile(new ImportOptions(gradedFile278));
        gradedFootage278.parentFolder = fromGradingFolder;
        gradedFootage278.name = "UNDLM_00278";
        gradingSources[278] = gradedFootage278;
        gradingImportCount++;
        gradedImportSuccess278 = true;
        gradedFileName278 = "UNDLM_00278.mov";
        logImportSuccess(278, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00278.mov", gradedFileName278);
    } catch (e) {
        logImportError(278, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00278.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess278 && gradedFilePoignees278.exists) {
    try {
        var gradedFootage278 = project.importFile(new ImportOptions(gradedFilePoignees278));
        gradedFootage278.parentFolder = fromGradingFolder;
        gradedFootage278.name = "UNDLM_00278_AVEC_POIGNEES";
        gradingSources[278] = gradedFootage278;
        gradingImportCount++;
        gradedImportSuccess278 = true;
        gradedFileName278 = "UNDLM_00278_AVEC_POIGNEES.mov";
        logImportSuccess(278, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00278_AVEC_POIGNEES.mov", gradedFileName278);
    } catch (e) {
        logImportError(278, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00278_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess278 && gradedFileBis278.exists) {
    try {
        var gradedFootage278 = project.importFile(new ImportOptions(gradedFileBis278));
        gradedFootage278.parentFolder = fromGradingFolder;
        gradedFootage278.name = "UNDLM_00278bis";
        gradingSources[278] = gradedFootage278;
        gradingImportCount++;
        gradedImportSuccess278 = true;
        gradedFileName278 = "UNDLM_00278bis.mov";
        logImportSuccess(278, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00278bis.mov", gradedFileName278);
    } catch (e) {
        logImportError(278, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00278bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess278) {
    missingGradingCount++;
}

// Import plan GRADED 00279
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile279 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00279.mov");
var gradedFilePoignees279 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00279_AVEC_POIGNEES.mov");
var gradedFileBis279 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00279bis.mov");

var gradedImportSuccess279 = false;
var gradedFileName279 = "";

// Tenter import standard
if (gradedFile279.exists) {
    try {
        var gradedFootage279 = project.importFile(new ImportOptions(gradedFile279));
        gradedFootage279.parentFolder = fromGradingFolder;
        gradedFootage279.name = "UNDLM_00279";
        gradingSources[279] = gradedFootage279;
        gradingImportCount++;
        gradedImportSuccess279 = true;
        gradedFileName279 = "UNDLM_00279.mov";
        logImportSuccess(279, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00279.mov", gradedFileName279);
    } catch (e) {
        logImportError(279, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00279.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess279 && gradedFilePoignees279.exists) {
    try {
        var gradedFootage279 = project.importFile(new ImportOptions(gradedFilePoignees279));
        gradedFootage279.parentFolder = fromGradingFolder;
        gradedFootage279.name = "UNDLM_00279_AVEC_POIGNEES";
        gradingSources[279] = gradedFootage279;
        gradingImportCount++;
        gradedImportSuccess279 = true;
        gradedFileName279 = "UNDLM_00279_AVEC_POIGNEES.mov";
        logImportSuccess(279, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00279_AVEC_POIGNEES.mov", gradedFileName279);
    } catch (e) {
        logImportError(279, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00279_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess279 && gradedFileBis279.exists) {
    try {
        var gradedFootage279 = project.importFile(new ImportOptions(gradedFileBis279));
        gradedFootage279.parentFolder = fromGradingFolder;
        gradedFootage279.name = "UNDLM_00279bis";
        gradingSources[279] = gradedFootage279;
        gradingImportCount++;
        gradedImportSuccess279 = true;
        gradedFileName279 = "UNDLM_00279bis.mov";
        logImportSuccess(279, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00279bis.mov", gradedFileName279);
    } catch (e) {
        logImportError(279, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00279bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess279) {
    missingGradingCount++;
}

// Import plan GRADED 00280
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile280 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00280.mov");
var gradedFilePoignees280 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00280_AVEC_POIGNEES.mov");
var gradedFileBis280 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00280bis.mov");

var gradedImportSuccess280 = false;
var gradedFileName280 = "";

// Tenter import standard
if (gradedFile280.exists) {
    try {
        var gradedFootage280 = project.importFile(new ImportOptions(gradedFile280));
        gradedFootage280.parentFolder = fromGradingFolder;
        gradedFootage280.name = "UNDLM_00280";
        gradingSources[280] = gradedFootage280;
        gradingImportCount++;
        gradedImportSuccess280 = true;
        gradedFileName280 = "UNDLM_00280.mov";
        logImportSuccess(280, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00280.mov", gradedFileName280);
    } catch (e) {
        logImportError(280, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00280.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess280 && gradedFilePoignees280.exists) {
    try {
        var gradedFootage280 = project.importFile(new ImportOptions(gradedFilePoignees280));
        gradedFootage280.parentFolder = fromGradingFolder;
        gradedFootage280.name = "UNDLM_00280_AVEC_POIGNEES";
        gradingSources[280] = gradedFootage280;
        gradingImportCount++;
        gradedImportSuccess280 = true;
        gradedFileName280 = "UNDLM_00280_AVEC_POIGNEES.mov";
        logImportSuccess(280, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00280_AVEC_POIGNEES.mov", gradedFileName280);
    } catch (e) {
        logImportError(280, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00280_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess280 && gradedFileBis280.exists) {
    try {
        var gradedFootage280 = project.importFile(new ImportOptions(gradedFileBis280));
        gradedFootage280.parentFolder = fromGradingFolder;
        gradedFootage280.name = "UNDLM_00280bis";
        gradingSources[280] = gradedFootage280;
        gradingImportCount++;
        gradedImportSuccess280 = true;
        gradedFileName280 = "UNDLM_00280bis.mov";
        logImportSuccess(280, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00280bis.mov", gradedFileName280);
    } catch (e) {
        logImportError(280, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00280bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess280) {
    missingGradingCount++;
}

// Import plan GRADED 00281
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile281 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00281.mov");
var gradedFilePoignees281 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00281_AVEC_POIGNEES.mov");
var gradedFileBis281 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00281bis.mov");

var gradedImportSuccess281 = false;
var gradedFileName281 = "";

// Tenter import standard
if (gradedFile281.exists) {
    try {
        var gradedFootage281 = project.importFile(new ImportOptions(gradedFile281));
        gradedFootage281.parentFolder = fromGradingFolder;
        gradedFootage281.name = "UNDLM_00281";
        gradingSources[281] = gradedFootage281;
        gradingImportCount++;
        gradedImportSuccess281 = true;
        gradedFileName281 = "UNDLM_00281.mov";
        logImportSuccess(281, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00281.mov", gradedFileName281);
    } catch (e) {
        logImportError(281, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00281.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess281 && gradedFilePoignees281.exists) {
    try {
        var gradedFootage281 = project.importFile(new ImportOptions(gradedFilePoignees281));
        gradedFootage281.parentFolder = fromGradingFolder;
        gradedFootage281.name = "UNDLM_00281_AVEC_POIGNEES";
        gradingSources[281] = gradedFootage281;
        gradingImportCount++;
        gradedImportSuccess281 = true;
        gradedFileName281 = "UNDLM_00281_AVEC_POIGNEES.mov";
        logImportSuccess(281, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00281_AVEC_POIGNEES.mov", gradedFileName281);
    } catch (e) {
        logImportError(281, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00281_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess281 && gradedFileBis281.exists) {
    try {
        var gradedFootage281 = project.importFile(new ImportOptions(gradedFileBis281));
        gradedFootage281.parentFolder = fromGradingFolder;
        gradedFootage281.name = "UNDLM_00281bis";
        gradingSources[281] = gradedFootage281;
        gradingImportCount++;
        gradedImportSuccess281 = true;
        gradedFileName281 = "UNDLM_00281bis.mov";
        logImportSuccess(281, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00281bis.mov", gradedFileName281);
    } catch (e) {
        logImportError(281, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00281bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess281) {
    missingGradingCount++;
}

// Import plan GRADED 00282
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile282 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00282.mov");
var gradedFilePoignees282 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00282_AVEC_POIGNEES.mov");
var gradedFileBis282 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00282bis.mov");

var gradedImportSuccess282 = false;
var gradedFileName282 = "";

// Tenter import standard
if (gradedFile282.exists) {
    try {
        var gradedFootage282 = project.importFile(new ImportOptions(gradedFile282));
        gradedFootage282.parentFolder = fromGradingFolder;
        gradedFootage282.name = "UNDLM_00282";
        gradingSources[282] = gradedFootage282;
        gradingImportCount++;
        gradedImportSuccess282 = true;
        gradedFileName282 = "UNDLM_00282.mov";
        logImportSuccess(282, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00282.mov", gradedFileName282);
    } catch (e) {
        logImportError(282, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00282.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess282 && gradedFilePoignees282.exists) {
    try {
        var gradedFootage282 = project.importFile(new ImportOptions(gradedFilePoignees282));
        gradedFootage282.parentFolder = fromGradingFolder;
        gradedFootage282.name = "UNDLM_00282_AVEC_POIGNEES";
        gradingSources[282] = gradedFootage282;
        gradingImportCount++;
        gradedImportSuccess282 = true;
        gradedFileName282 = "UNDLM_00282_AVEC_POIGNEES.mov";
        logImportSuccess(282, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00282_AVEC_POIGNEES.mov", gradedFileName282);
    } catch (e) {
        logImportError(282, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00282_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess282 && gradedFileBis282.exists) {
    try {
        var gradedFootage282 = project.importFile(new ImportOptions(gradedFileBis282));
        gradedFootage282.parentFolder = fromGradingFolder;
        gradedFootage282.name = "UNDLM_00282bis";
        gradingSources[282] = gradedFootage282;
        gradingImportCount++;
        gradedImportSuccess282 = true;
        gradedFileName282 = "UNDLM_00282bis.mov";
        logImportSuccess(282, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00282bis.mov", gradedFileName282);
    } catch (e) {
        logImportError(282, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00282bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess282) {
    missingGradingCount++;
}

// Import plan GRADED 00283
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile283 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00283.mov");
var gradedFilePoignees283 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00283_AVEC_POIGNEES.mov");
var gradedFileBis283 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00283bis.mov");

var gradedImportSuccess283 = false;
var gradedFileName283 = "";

// Tenter import standard
if (gradedFile283.exists) {
    try {
        var gradedFootage283 = project.importFile(new ImportOptions(gradedFile283));
        gradedFootage283.parentFolder = fromGradingFolder;
        gradedFootage283.name = "UNDLM_00283";
        gradingSources[283] = gradedFootage283;
        gradingImportCount++;
        gradedImportSuccess283 = true;
        gradedFileName283 = "UNDLM_00283.mov";
        logImportSuccess(283, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00283.mov", gradedFileName283);
    } catch (e) {
        logImportError(283, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00283.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess283 && gradedFilePoignees283.exists) {
    try {
        var gradedFootage283 = project.importFile(new ImportOptions(gradedFilePoignees283));
        gradedFootage283.parentFolder = fromGradingFolder;
        gradedFootage283.name = "UNDLM_00283_AVEC_POIGNEES";
        gradingSources[283] = gradedFootage283;
        gradingImportCount++;
        gradedImportSuccess283 = true;
        gradedFileName283 = "UNDLM_00283_AVEC_POIGNEES.mov";
        logImportSuccess(283, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00283_AVEC_POIGNEES.mov", gradedFileName283);
    } catch (e) {
        logImportError(283, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00283_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess283 && gradedFileBis283.exists) {
    try {
        var gradedFootage283 = project.importFile(new ImportOptions(gradedFileBis283));
        gradedFootage283.parentFolder = fromGradingFolder;
        gradedFootage283.name = "UNDLM_00283bis";
        gradingSources[283] = gradedFootage283;
        gradingImportCount++;
        gradedImportSuccess283 = true;
        gradedFileName283 = "UNDLM_00283bis.mov";
        logImportSuccess(283, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00283bis.mov", gradedFileName283);
    } catch (e) {
        logImportError(283, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00283bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess283) {
    missingGradingCount++;
}

// Import plan GRADED 00284
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile284 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00284.mov");
var gradedFilePoignees284 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00284_AVEC_POIGNEES.mov");
var gradedFileBis284 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00284bis.mov");

var gradedImportSuccess284 = false;
var gradedFileName284 = "";

// Tenter import standard
if (gradedFile284.exists) {
    try {
        var gradedFootage284 = project.importFile(new ImportOptions(gradedFile284));
        gradedFootage284.parentFolder = fromGradingFolder;
        gradedFootage284.name = "UNDLM_00284";
        gradingSources[284] = gradedFootage284;
        gradingImportCount++;
        gradedImportSuccess284 = true;
        gradedFileName284 = "UNDLM_00284.mov";
        logImportSuccess(284, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00284.mov", gradedFileName284);
    } catch (e) {
        logImportError(284, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00284.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess284 && gradedFilePoignees284.exists) {
    try {
        var gradedFootage284 = project.importFile(new ImportOptions(gradedFilePoignees284));
        gradedFootage284.parentFolder = fromGradingFolder;
        gradedFootage284.name = "UNDLM_00284_AVEC_POIGNEES";
        gradingSources[284] = gradedFootage284;
        gradingImportCount++;
        gradedImportSuccess284 = true;
        gradedFileName284 = "UNDLM_00284_AVEC_POIGNEES.mov";
        logImportSuccess(284, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00284_AVEC_POIGNEES.mov", gradedFileName284);
    } catch (e) {
        logImportError(284, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00284_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess284 && gradedFileBis284.exists) {
    try {
        var gradedFootage284 = project.importFile(new ImportOptions(gradedFileBis284));
        gradedFootage284.parentFolder = fromGradingFolder;
        gradedFootage284.name = "UNDLM_00284bis";
        gradingSources[284] = gradedFootage284;
        gradingImportCount++;
        gradedImportSuccess284 = true;
        gradedFileName284 = "UNDLM_00284bis.mov";
        logImportSuccess(284, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00284bis.mov", gradedFileName284);
    } catch (e) {
        logImportError(284, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00284bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess284) {
    missingGradingCount++;
}

// Import plan GRADED 00285
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile285 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00285.mov");
var gradedFilePoignees285 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00285_AVEC_POIGNEES.mov");
var gradedFileBis285 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00285bis.mov");

var gradedImportSuccess285 = false;
var gradedFileName285 = "";

// Tenter import standard
if (gradedFile285.exists) {
    try {
        var gradedFootage285 = project.importFile(new ImportOptions(gradedFile285));
        gradedFootage285.parentFolder = fromGradingFolder;
        gradedFootage285.name = "UNDLM_00285";
        gradingSources[285] = gradedFootage285;
        gradingImportCount++;
        gradedImportSuccess285 = true;
        gradedFileName285 = "UNDLM_00285.mov";
        logImportSuccess(285, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00285.mov", gradedFileName285);
    } catch (e) {
        logImportError(285, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00285.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess285 && gradedFilePoignees285.exists) {
    try {
        var gradedFootage285 = project.importFile(new ImportOptions(gradedFilePoignees285));
        gradedFootage285.parentFolder = fromGradingFolder;
        gradedFootage285.name = "UNDLM_00285_AVEC_POIGNEES";
        gradingSources[285] = gradedFootage285;
        gradingImportCount++;
        gradedImportSuccess285 = true;
        gradedFileName285 = "UNDLM_00285_AVEC_POIGNEES.mov";
        logImportSuccess(285, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00285_AVEC_POIGNEES.mov", gradedFileName285);
    } catch (e) {
        logImportError(285, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00285_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess285 && gradedFileBis285.exists) {
    try {
        var gradedFootage285 = project.importFile(new ImportOptions(gradedFileBis285));
        gradedFootage285.parentFolder = fromGradingFolder;
        gradedFootage285.name = "UNDLM_00285bis";
        gradingSources[285] = gradedFootage285;
        gradingImportCount++;
        gradedImportSuccess285 = true;
        gradedFileName285 = "UNDLM_00285bis.mov";
        logImportSuccess(285, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00285bis.mov", gradedFileName285);
    } catch (e) {
        logImportError(285, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00285bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess285) {
    missingGradingCount++;
}

// Import plan GRADED 00286
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile286 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00286.mov");
var gradedFilePoignees286 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00286_AVEC_POIGNEES.mov");
var gradedFileBis286 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00286bis.mov");

var gradedImportSuccess286 = false;
var gradedFileName286 = "";

// Tenter import standard
if (gradedFile286.exists) {
    try {
        var gradedFootage286 = project.importFile(new ImportOptions(gradedFile286));
        gradedFootage286.parentFolder = fromGradingFolder;
        gradedFootage286.name = "UNDLM_00286";
        gradingSources[286] = gradedFootage286;
        gradingImportCount++;
        gradedImportSuccess286 = true;
        gradedFileName286 = "UNDLM_00286.mov";
        logImportSuccess(286, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00286.mov", gradedFileName286);
    } catch (e) {
        logImportError(286, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00286.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess286 && gradedFilePoignees286.exists) {
    try {
        var gradedFootage286 = project.importFile(new ImportOptions(gradedFilePoignees286));
        gradedFootage286.parentFolder = fromGradingFolder;
        gradedFootage286.name = "UNDLM_00286_AVEC_POIGNEES";
        gradingSources[286] = gradedFootage286;
        gradingImportCount++;
        gradedImportSuccess286 = true;
        gradedFileName286 = "UNDLM_00286_AVEC_POIGNEES.mov";
        logImportSuccess(286, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00286_AVEC_POIGNEES.mov", gradedFileName286);
    } catch (e) {
        logImportError(286, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00286_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess286 && gradedFileBis286.exists) {
    try {
        var gradedFootage286 = project.importFile(new ImportOptions(gradedFileBis286));
        gradedFootage286.parentFolder = fromGradingFolder;
        gradedFootage286.name = "UNDLM_00286bis";
        gradingSources[286] = gradedFootage286;
        gradingImportCount++;
        gradedImportSuccess286 = true;
        gradedFileName286 = "UNDLM_00286bis.mov";
        logImportSuccess(286, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00286bis.mov", gradedFileName286);
    } catch (e) {
        logImportError(286, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00286bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess286) {
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


// Composition pour plan 00268
var planComp268 = project.items.addComp(
    "SQ15_UNDLM_00268_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp268.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer268 = planComp268.layers.add(bgSolidComp);
bgLayer268.name = "BG_SOLID";
bgLayer268.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer268 = false;
if (gradingSources[268]) {
    var gradedLayer268 = planComp268.layers.add(gradingSources[268]);
    gradedLayer268.name = "UNDLM_00268_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer268.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer268.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer268 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer268 = false;
if (editSources[268]) {
    var editLayer268 = planComp268.layers.add(editSources[268]);
    editLayer268.name = "UNDLM_00268_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer268.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer268.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer268 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity268 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer268) {
    // EDIT toujours activé quand disponible
    editLayer268.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer268) {
        gradedLayer268.enabled = false;
    }
} else if (hasGradedLayer268) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer268.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText268 = planComp268.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText268.name = "WARNING_NO_EDIT";
    warningText268.property("Transform").property("Position").setValue([1280, 200]);
    warningText268.guideLayer = true;
    
    var warningTextDoc268 = warningText268.property("Source Text").value;
    warningTextDoc268.fontSize = 32;
    warningTextDoc268.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc268.font = "Arial-BoldMT";
    warningTextDoc268.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText268.property("Source Text").setValue(warningTextDoc268);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText268 = planComp268.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00268");
    errorText268.name = "ERROR_NO_SOURCE";
    errorText268.property("Transform").property("Position").setValue([1280, 720]);
    errorText268.guideLayer = true;
    
    var errorTextDoc268 = errorText268.property("Source Text").value;
    errorTextDoc268.fontSize = 48;
    errorTextDoc268.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc268.font = "Arial-BoldMT";
    errorTextDoc268.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText268.property("Source Text").setValue(errorTextDoc268);
}

planCompositions[268] = planComp268;


// Composition pour plan 00269
var planComp269 = project.items.addComp(
    "SQ15_UNDLM_00269_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp269.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer269 = planComp269.layers.add(bgSolidComp);
bgLayer269.name = "BG_SOLID";
bgLayer269.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer269 = false;
if (gradingSources[269]) {
    var gradedLayer269 = planComp269.layers.add(gradingSources[269]);
    gradedLayer269.name = "UNDLM_00269_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer269.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer269.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer269 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer269 = false;
if (editSources[269]) {
    var editLayer269 = planComp269.layers.add(editSources[269]);
    editLayer269.name = "UNDLM_00269_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer269.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer269.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer269 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity269 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer269) {
    // EDIT toujours activé quand disponible
    editLayer269.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer269) {
        gradedLayer269.enabled = false;
    }
} else if (hasGradedLayer269) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer269.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText269 = planComp269.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText269.name = "WARNING_NO_EDIT";
    warningText269.property("Transform").property("Position").setValue([1280, 200]);
    warningText269.guideLayer = true;
    
    var warningTextDoc269 = warningText269.property("Source Text").value;
    warningTextDoc269.fontSize = 32;
    warningTextDoc269.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc269.font = "Arial-BoldMT";
    warningTextDoc269.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText269.property("Source Text").setValue(warningTextDoc269);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText269 = planComp269.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00269");
    errorText269.name = "ERROR_NO_SOURCE";
    errorText269.property("Transform").property("Position").setValue([1280, 720]);
    errorText269.guideLayer = true;
    
    var errorTextDoc269 = errorText269.property("Source Text").value;
    errorTextDoc269.fontSize = 48;
    errorTextDoc269.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc269.font = "Arial-BoldMT";
    errorTextDoc269.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText269.property("Source Text").setValue(errorTextDoc269);
}

planCompositions[269] = planComp269;


// Composition pour plan 00270
var planComp270 = project.items.addComp(
    "SQ15_UNDLM_00270_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp270.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer270 = planComp270.layers.add(bgSolidComp);
bgLayer270.name = "BG_SOLID";
bgLayer270.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer270 = false;
if (gradingSources[270]) {
    var gradedLayer270 = planComp270.layers.add(gradingSources[270]);
    gradedLayer270.name = "UNDLM_00270_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer270.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer270.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer270 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer270 = false;
if (editSources[270]) {
    var editLayer270 = planComp270.layers.add(editSources[270]);
    editLayer270.name = "UNDLM_00270_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer270.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer270.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer270 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity270 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer270) {
    // EDIT toujours activé quand disponible
    editLayer270.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer270) {
        gradedLayer270.enabled = false;
    }
} else if (hasGradedLayer270) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer270.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText270 = planComp270.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText270.name = "WARNING_NO_EDIT";
    warningText270.property("Transform").property("Position").setValue([1280, 200]);
    warningText270.guideLayer = true;
    
    var warningTextDoc270 = warningText270.property("Source Text").value;
    warningTextDoc270.fontSize = 32;
    warningTextDoc270.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc270.font = "Arial-BoldMT";
    warningTextDoc270.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText270.property("Source Text").setValue(warningTextDoc270);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText270 = planComp270.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00270");
    errorText270.name = "ERROR_NO_SOURCE";
    errorText270.property("Transform").property("Position").setValue([1280, 720]);
    errorText270.guideLayer = true;
    
    var errorTextDoc270 = errorText270.property("Source Text").value;
    errorTextDoc270.fontSize = 48;
    errorTextDoc270.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc270.font = "Arial-BoldMT";
    errorTextDoc270.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText270.property("Source Text").setValue(errorTextDoc270);
}

planCompositions[270] = planComp270;


// Composition pour plan 00271
var planComp271 = project.items.addComp(
    "SQ15_UNDLM_00271_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp271.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer271 = planComp271.layers.add(bgSolidComp);
bgLayer271.name = "BG_SOLID";
bgLayer271.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer271 = false;
if (gradingSources[271]) {
    var gradedLayer271 = planComp271.layers.add(gradingSources[271]);
    gradedLayer271.name = "UNDLM_00271_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer271.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer271.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer271 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer271 = false;
if (editSources[271]) {
    var editLayer271 = planComp271.layers.add(editSources[271]);
    editLayer271.name = "UNDLM_00271_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer271.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer271.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer271 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity271 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer271) {
    // EDIT toujours activé quand disponible
    editLayer271.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer271) {
        gradedLayer271.enabled = false;
    }
} else if (hasGradedLayer271) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer271.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText271 = planComp271.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText271.name = "WARNING_NO_EDIT";
    warningText271.property("Transform").property("Position").setValue([1280, 200]);
    warningText271.guideLayer = true;
    
    var warningTextDoc271 = warningText271.property("Source Text").value;
    warningTextDoc271.fontSize = 32;
    warningTextDoc271.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc271.font = "Arial-BoldMT";
    warningTextDoc271.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText271.property("Source Text").setValue(warningTextDoc271);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText271 = planComp271.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00271");
    errorText271.name = "ERROR_NO_SOURCE";
    errorText271.property("Transform").property("Position").setValue([1280, 720]);
    errorText271.guideLayer = true;
    
    var errorTextDoc271 = errorText271.property("Source Text").value;
    errorTextDoc271.fontSize = 48;
    errorTextDoc271.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc271.font = "Arial-BoldMT";
    errorTextDoc271.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText271.property("Source Text").setValue(errorTextDoc271);
}

planCompositions[271] = planComp271;


// Composition pour plan 00272
var planComp272 = project.items.addComp(
    "SQ15_UNDLM_00272_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp272.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer272 = planComp272.layers.add(bgSolidComp);
bgLayer272.name = "BG_SOLID";
bgLayer272.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer272 = false;
if (gradingSources[272]) {
    var gradedLayer272 = planComp272.layers.add(gradingSources[272]);
    gradedLayer272.name = "UNDLM_00272_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer272.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer272.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer272 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer272 = false;
if (editSources[272]) {
    var editLayer272 = planComp272.layers.add(editSources[272]);
    editLayer272.name = "UNDLM_00272_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer272.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer272.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer272 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity272 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer272) {
    // EDIT toujours activé quand disponible
    editLayer272.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer272) {
        gradedLayer272.enabled = false;
    }
} else if (hasGradedLayer272) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer272.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText272 = planComp272.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText272.name = "WARNING_NO_EDIT";
    warningText272.property("Transform").property("Position").setValue([1280, 200]);
    warningText272.guideLayer = true;
    
    var warningTextDoc272 = warningText272.property("Source Text").value;
    warningTextDoc272.fontSize = 32;
    warningTextDoc272.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc272.font = "Arial-BoldMT";
    warningTextDoc272.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText272.property("Source Text").setValue(warningTextDoc272);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText272 = planComp272.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00272");
    errorText272.name = "ERROR_NO_SOURCE";
    errorText272.property("Transform").property("Position").setValue([1280, 720]);
    errorText272.guideLayer = true;
    
    var errorTextDoc272 = errorText272.property("Source Text").value;
    errorTextDoc272.fontSize = 48;
    errorTextDoc272.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc272.font = "Arial-BoldMT";
    errorTextDoc272.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText272.property("Source Text").setValue(errorTextDoc272);
}

planCompositions[272] = planComp272;


// Composition pour plan 00273
var planComp273 = project.items.addComp(
    "SQ15_UNDLM_00273_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp273.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer273 = planComp273.layers.add(bgSolidComp);
bgLayer273.name = "BG_SOLID";
bgLayer273.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer273 = false;
if (gradingSources[273]) {
    var gradedLayer273 = planComp273.layers.add(gradingSources[273]);
    gradedLayer273.name = "UNDLM_00273_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer273.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer273.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer273 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer273 = false;
if (editSources[273]) {
    var editLayer273 = planComp273.layers.add(editSources[273]);
    editLayer273.name = "UNDLM_00273_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer273.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer273.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer273 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity273 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer273) {
    // EDIT toujours activé quand disponible
    editLayer273.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer273) {
        gradedLayer273.enabled = false;
    }
} else if (hasGradedLayer273) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer273.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText273 = planComp273.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText273.name = "WARNING_NO_EDIT";
    warningText273.property("Transform").property("Position").setValue([1280, 200]);
    warningText273.guideLayer = true;
    
    var warningTextDoc273 = warningText273.property("Source Text").value;
    warningTextDoc273.fontSize = 32;
    warningTextDoc273.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc273.font = "Arial-BoldMT";
    warningTextDoc273.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText273.property("Source Text").setValue(warningTextDoc273);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText273 = planComp273.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00273");
    errorText273.name = "ERROR_NO_SOURCE";
    errorText273.property("Transform").property("Position").setValue([1280, 720]);
    errorText273.guideLayer = true;
    
    var errorTextDoc273 = errorText273.property("Source Text").value;
    errorTextDoc273.fontSize = 48;
    errorTextDoc273.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc273.font = "Arial-BoldMT";
    errorTextDoc273.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText273.property("Source Text").setValue(errorTextDoc273);
}

planCompositions[273] = planComp273;


// Composition pour plan 00274
var planComp274 = project.items.addComp(
    "SQ15_UNDLM_00274_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp274.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer274 = planComp274.layers.add(bgSolidComp);
bgLayer274.name = "BG_SOLID";
bgLayer274.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer274 = false;
if (gradingSources[274]) {
    var gradedLayer274 = planComp274.layers.add(gradingSources[274]);
    gradedLayer274.name = "UNDLM_00274_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer274.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer274.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer274 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer274 = false;
if (editSources[274]) {
    var editLayer274 = planComp274.layers.add(editSources[274]);
    editLayer274.name = "UNDLM_00274_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer274.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer274.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer274 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity274 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer274) {
    // EDIT toujours activé quand disponible
    editLayer274.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer274) {
        gradedLayer274.enabled = false;
    }
} else if (hasGradedLayer274) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer274.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText274 = planComp274.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText274.name = "WARNING_NO_EDIT";
    warningText274.property("Transform").property("Position").setValue([1280, 200]);
    warningText274.guideLayer = true;
    
    var warningTextDoc274 = warningText274.property("Source Text").value;
    warningTextDoc274.fontSize = 32;
    warningTextDoc274.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc274.font = "Arial-BoldMT";
    warningTextDoc274.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText274.property("Source Text").setValue(warningTextDoc274);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText274 = planComp274.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00274");
    errorText274.name = "ERROR_NO_SOURCE";
    errorText274.property("Transform").property("Position").setValue([1280, 720]);
    errorText274.guideLayer = true;
    
    var errorTextDoc274 = errorText274.property("Source Text").value;
    errorTextDoc274.fontSize = 48;
    errorTextDoc274.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc274.font = "Arial-BoldMT";
    errorTextDoc274.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText274.property("Source Text").setValue(errorTextDoc274);
}

planCompositions[274] = planComp274;


// Composition pour plan 00275
var planComp275 = project.items.addComp(
    "SQ15_UNDLM_00275_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp275.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer275 = planComp275.layers.add(bgSolidComp);
bgLayer275.name = "BG_SOLID";
bgLayer275.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer275 = false;
if (gradingSources[275]) {
    var gradedLayer275 = planComp275.layers.add(gradingSources[275]);
    gradedLayer275.name = "UNDLM_00275_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer275.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer275.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer275 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer275 = false;
if (editSources[275]) {
    var editLayer275 = planComp275.layers.add(editSources[275]);
    editLayer275.name = "UNDLM_00275_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer275.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer275.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer275 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity275 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer275) {
    // EDIT toujours activé quand disponible
    editLayer275.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer275) {
        gradedLayer275.enabled = false;
    }
} else if (hasGradedLayer275) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer275.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText275 = planComp275.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText275.name = "WARNING_NO_EDIT";
    warningText275.property("Transform").property("Position").setValue([1280, 200]);
    warningText275.guideLayer = true;
    
    var warningTextDoc275 = warningText275.property("Source Text").value;
    warningTextDoc275.fontSize = 32;
    warningTextDoc275.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc275.font = "Arial-BoldMT";
    warningTextDoc275.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText275.property("Source Text").setValue(warningTextDoc275);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText275 = planComp275.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00275");
    errorText275.name = "ERROR_NO_SOURCE";
    errorText275.property("Transform").property("Position").setValue([1280, 720]);
    errorText275.guideLayer = true;
    
    var errorTextDoc275 = errorText275.property("Source Text").value;
    errorTextDoc275.fontSize = 48;
    errorTextDoc275.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc275.font = "Arial-BoldMT";
    errorTextDoc275.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText275.property("Source Text").setValue(errorTextDoc275);
}

planCompositions[275] = planComp275;


// Composition pour plan 00276
var planComp276 = project.items.addComp(
    "SQ15_UNDLM_00276_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp276.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer276 = planComp276.layers.add(bgSolidComp);
bgLayer276.name = "BG_SOLID";
bgLayer276.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer276 = false;
if (gradingSources[276]) {
    var gradedLayer276 = planComp276.layers.add(gradingSources[276]);
    gradedLayer276.name = "UNDLM_00276_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer276.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer276.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer276 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer276 = false;
if (editSources[276]) {
    var editLayer276 = planComp276.layers.add(editSources[276]);
    editLayer276.name = "UNDLM_00276_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer276.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer276.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer276 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity276 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer276) {
    // EDIT toujours activé quand disponible
    editLayer276.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer276) {
        gradedLayer276.enabled = false;
    }
} else if (hasGradedLayer276) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer276.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText276 = planComp276.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText276.name = "WARNING_NO_EDIT";
    warningText276.property("Transform").property("Position").setValue([1280, 200]);
    warningText276.guideLayer = true;
    
    var warningTextDoc276 = warningText276.property("Source Text").value;
    warningTextDoc276.fontSize = 32;
    warningTextDoc276.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc276.font = "Arial-BoldMT";
    warningTextDoc276.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText276.property("Source Text").setValue(warningTextDoc276);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText276 = planComp276.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00276");
    errorText276.name = "ERROR_NO_SOURCE";
    errorText276.property("Transform").property("Position").setValue([1280, 720]);
    errorText276.guideLayer = true;
    
    var errorTextDoc276 = errorText276.property("Source Text").value;
    errorTextDoc276.fontSize = 48;
    errorTextDoc276.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc276.font = "Arial-BoldMT";
    errorTextDoc276.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText276.property("Source Text").setValue(errorTextDoc276);
}

planCompositions[276] = planComp276;


// Composition pour plan 00277
var planComp277 = project.items.addComp(
    "SQ15_UNDLM_00277_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp277.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer277 = planComp277.layers.add(bgSolidComp);
bgLayer277.name = "BG_SOLID";
bgLayer277.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer277 = false;
if (gradingSources[277]) {
    var gradedLayer277 = planComp277.layers.add(gradingSources[277]);
    gradedLayer277.name = "UNDLM_00277_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer277.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer277.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer277 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer277 = false;
if (editSources[277]) {
    var editLayer277 = planComp277.layers.add(editSources[277]);
    editLayer277.name = "UNDLM_00277_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer277.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer277.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer277 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity277 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer277) {
    // EDIT toujours activé quand disponible
    editLayer277.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer277) {
        gradedLayer277.enabled = false;
    }
} else if (hasGradedLayer277) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer277.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText277 = planComp277.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText277.name = "WARNING_NO_EDIT";
    warningText277.property("Transform").property("Position").setValue([1280, 200]);
    warningText277.guideLayer = true;
    
    var warningTextDoc277 = warningText277.property("Source Text").value;
    warningTextDoc277.fontSize = 32;
    warningTextDoc277.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc277.font = "Arial-BoldMT";
    warningTextDoc277.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText277.property("Source Text").setValue(warningTextDoc277);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText277 = planComp277.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00277");
    errorText277.name = "ERROR_NO_SOURCE";
    errorText277.property("Transform").property("Position").setValue([1280, 720]);
    errorText277.guideLayer = true;
    
    var errorTextDoc277 = errorText277.property("Source Text").value;
    errorTextDoc277.fontSize = 48;
    errorTextDoc277.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc277.font = "Arial-BoldMT";
    errorTextDoc277.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText277.property("Source Text").setValue(errorTextDoc277);
}

planCompositions[277] = planComp277;


// Composition pour plan 00278
var planComp278 = project.items.addComp(
    "SQ15_UNDLM_00278_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp278.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer278 = planComp278.layers.add(bgSolidComp);
bgLayer278.name = "BG_SOLID";
bgLayer278.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer278 = false;
if (gradingSources[278]) {
    var gradedLayer278 = planComp278.layers.add(gradingSources[278]);
    gradedLayer278.name = "UNDLM_00278_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer278.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer278.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer278 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer278 = false;
if (editSources[278]) {
    var editLayer278 = planComp278.layers.add(editSources[278]);
    editLayer278.name = "UNDLM_00278_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer278.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer278.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer278 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity278 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer278) {
    // EDIT toujours activé quand disponible
    editLayer278.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer278) {
        gradedLayer278.enabled = false;
    }
} else if (hasGradedLayer278) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer278.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText278 = planComp278.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText278.name = "WARNING_NO_EDIT";
    warningText278.property("Transform").property("Position").setValue([1280, 200]);
    warningText278.guideLayer = true;
    
    var warningTextDoc278 = warningText278.property("Source Text").value;
    warningTextDoc278.fontSize = 32;
    warningTextDoc278.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc278.font = "Arial-BoldMT";
    warningTextDoc278.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText278.property("Source Text").setValue(warningTextDoc278);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText278 = planComp278.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00278");
    errorText278.name = "ERROR_NO_SOURCE";
    errorText278.property("Transform").property("Position").setValue([1280, 720]);
    errorText278.guideLayer = true;
    
    var errorTextDoc278 = errorText278.property("Source Text").value;
    errorTextDoc278.fontSize = 48;
    errorTextDoc278.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc278.font = "Arial-BoldMT";
    errorTextDoc278.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText278.property("Source Text").setValue(errorTextDoc278);
}

planCompositions[278] = planComp278;


// Composition pour plan 00279
var planComp279 = project.items.addComp(
    "SQ15_UNDLM_00279_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.64,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp279.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer279 = planComp279.layers.add(bgSolidComp);
bgLayer279.name = "BG_SOLID";
bgLayer279.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer279 = false;
if (gradingSources[279]) {
    var gradedLayer279 = planComp279.layers.add(gradingSources[279]);
    gradedLayer279.name = "UNDLM_00279_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer279.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer279.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer279 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer279 = false;
if (editSources[279]) {
    var editLayer279 = planComp279.layers.add(editSources[279]);
    editLayer279.name = "UNDLM_00279_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer279.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer279.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer279 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity279 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer279) {
    // EDIT toujours activé quand disponible
    editLayer279.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer279) {
        gradedLayer279.enabled = false;
    }
} else if (hasGradedLayer279) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer279.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText279 = planComp279.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText279.name = "WARNING_NO_EDIT";
    warningText279.property("Transform").property("Position").setValue([1280, 200]);
    warningText279.guideLayer = true;
    
    var warningTextDoc279 = warningText279.property("Source Text").value;
    warningTextDoc279.fontSize = 32;
    warningTextDoc279.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc279.font = "Arial-BoldMT";
    warningTextDoc279.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText279.property("Source Text").setValue(warningTextDoc279);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText279 = planComp279.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00279");
    errorText279.name = "ERROR_NO_SOURCE";
    errorText279.property("Transform").property("Position").setValue([1280, 720]);
    errorText279.guideLayer = true;
    
    var errorTextDoc279 = errorText279.property("Source Text").value;
    errorTextDoc279.fontSize = 48;
    errorTextDoc279.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc279.font = "Arial-BoldMT";
    errorTextDoc279.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText279.property("Source Text").setValue(errorTextDoc279);
}

planCompositions[279] = planComp279;


// Composition pour plan 00280
var planComp280 = project.items.addComp(
    "SQ15_UNDLM_00280_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp280.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer280 = planComp280.layers.add(bgSolidComp);
bgLayer280.name = "BG_SOLID";
bgLayer280.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer280 = false;
if (gradingSources[280]) {
    var gradedLayer280 = planComp280.layers.add(gradingSources[280]);
    gradedLayer280.name = "UNDLM_00280_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer280.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer280.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer280 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer280 = false;
if (editSources[280]) {
    var editLayer280 = planComp280.layers.add(editSources[280]);
    editLayer280.name = "UNDLM_00280_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer280.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer280.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer280 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity280 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer280) {
    // EDIT toujours activé quand disponible
    editLayer280.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer280) {
        gradedLayer280.enabled = false;
    }
} else if (hasGradedLayer280) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer280.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText280 = planComp280.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText280.name = "WARNING_NO_EDIT";
    warningText280.property("Transform").property("Position").setValue([1280, 200]);
    warningText280.guideLayer = true;
    
    var warningTextDoc280 = warningText280.property("Source Text").value;
    warningTextDoc280.fontSize = 32;
    warningTextDoc280.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc280.font = "Arial-BoldMT";
    warningTextDoc280.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText280.property("Source Text").setValue(warningTextDoc280);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText280 = planComp280.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00280");
    errorText280.name = "ERROR_NO_SOURCE";
    errorText280.property("Transform").property("Position").setValue([1280, 720]);
    errorText280.guideLayer = true;
    
    var errorTextDoc280 = errorText280.property("Source Text").value;
    errorTextDoc280.fontSize = 48;
    errorTextDoc280.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc280.font = "Arial-BoldMT";
    errorTextDoc280.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText280.property("Source Text").setValue(errorTextDoc280);
}

planCompositions[280] = planComp280;


// Composition pour plan 00281
var planComp281 = project.items.addComp(
    "SQ15_UNDLM_00281_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp281.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer281 = planComp281.layers.add(bgSolidComp);
bgLayer281.name = "BG_SOLID";
bgLayer281.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer281 = false;
if (gradingSources[281]) {
    var gradedLayer281 = planComp281.layers.add(gradingSources[281]);
    gradedLayer281.name = "UNDLM_00281_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer281.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer281.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer281 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer281 = false;
if (editSources[281]) {
    var editLayer281 = planComp281.layers.add(editSources[281]);
    editLayer281.name = "UNDLM_00281_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer281.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer281.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer281 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity281 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer281) {
    // EDIT toujours activé quand disponible
    editLayer281.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer281) {
        gradedLayer281.enabled = false;
    }
} else if (hasGradedLayer281) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer281.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText281 = planComp281.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText281.name = "WARNING_NO_EDIT";
    warningText281.property("Transform").property("Position").setValue([1280, 200]);
    warningText281.guideLayer = true;
    
    var warningTextDoc281 = warningText281.property("Source Text").value;
    warningTextDoc281.fontSize = 32;
    warningTextDoc281.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc281.font = "Arial-BoldMT";
    warningTextDoc281.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText281.property("Source Text").setValue(warningTextDoc281);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText281 = planComp281.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00281");
    errorText281.name = "ERROR_NO_SOURCE";
    errorText281.property("Transform").property("Position").setValue([1280, 720]);
    errorText281.guideLayer = true;
    
    var errorTextDoc281 = errorText281.property("Source Text").value;
    errorTextDoc281.fontSize = 48;
    errorTextDoc281.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc281.font = "Arial-BoldMT";
    errorTextDoc281.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText281.property("Source Text").setValue(errorTextDoc281);
}

planCompositions[281] = planComp281;


// Composition pour plan 00282
var planComp282 = project.items.addComp(
    "SQ15_UNDLM_00282_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp282.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer282 = planComp282.layers.add(bgSolidComp);
bgLayer282.name = "BG_SOLID";
bgLayer282.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer282 = false;
if (gradingSources[282]) {
    var gradedLayer282 = planComp282.layers.add(gradingSources[282]);
    gradedLayer282.name = "UNDLM_00282_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer282.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer282.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer282 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer282 = false;
if (editSources[282]) {
    var editLayer282 = planComp282.layers.add(editSources[282]);
    editLayer282.name = "UNDLM_00282_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer282.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer282.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer282 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity282 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer282) {
    // EDIT toujours activé quand disponible
    editLayer282.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer282) {
        gradedLayer282.enabled = false;
    }
} else if (hasGradedLayer282) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer282.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText282 = planComp282.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText282.name = "WARNING_NO_EDIT";
    warningText282.property("Transform").property("Position").setValue([1280, 200]);
    warningText282.guideLayer = true;
    
    var warningTextDoc282 = warningText282.property("Source Text").value;
    warningTextDoc282.fontSize = 32;
    warningTextDoc282.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc282.font = "Arial-BoldMT";
    warningTextDoc282.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText282.property("Source Text").setValue(warningTextDoc282);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText282 = planComp282.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00282");
    errorText282.name = "ERROR_NO_SOURCE";
    errorText282.property("Transform").property("Position").setValue([1280, 720]);
    errorText282.guideLayer = true;
    
    var errorTextDoc282 = errorText282.property("Source Text").value;
    errorTextDoc282.fontSize = 48;
    errorTextDoc282.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc282.font = "Arial-BoldMT";
    errorTextDoc282.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText282.property("Source Text").setValue(errorTextDoc282);
}

planCompositions[282] = planComp282;


// Composition pour plan 00283
var planComp283 = project.items.addComp(
    "SQ15_UNDLM_00283_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp283.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer283 = planComp283.layers.add(bgSolidComp);
bgLayer283.name = "BG_SOLID";
bgLayer283.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer283 = false;
if (gradingSources[283]) {
    var gradedLayer283 = planComp283.layers.add(gradingSources[283]);
    gradedLayer283.name = "UNDLM_00283_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer283.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer283.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer283 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer283 = false;
if (editSources[283]) {
    var editLayer283 = planComp283.layers.add(editSources[283]);
    editLayer283.name = "UNDLM_00283_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer283.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer283.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer283 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity283 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer283) {
    // EDIT toujours activé quand disponible
    editLayer283.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer283) {
        gradedLayer283.enabled = false;
    }
} else if (hasGradedLayer283) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer283.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText283 = planComp283.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText283.name = "WARNING_NO_EDIT";
    warningText283.property("Transform").property("Position").setValue([1280, 200]);
    warningText283.guideLayer = true;
    
    var warningTextDoc283 = warningText283.property("Source Text").value;
    warningTextDoc283.fontSize = 32;
    warningTextDoc283.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc283.font = "Arial-BoldMT";
    warningTextDoc283.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText283.property("Source Text").setValue(warningTextDoc283);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText283 = planComp283.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00283");
    errorText283.name = "ERROR_NO_SOURCE";
    errorText283.property("Transform").property("Position").setValue([1280, 720]);
    errorText283.guideLayer = true;
    
    var errorTextDoc283 = errorText283.property("Source Text").value;
    errorTextDoc283.fontSize = 48;
    errorTextDoc283.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc283.font = "Arial-BoldMT";
    errorTextDoc283.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText283.property("Source Text").setValue(errorTextDoc283);
}

planCompositions[283] = planComp283;


// Composition pour plan 00284
var planComp284 = project.items.addComp(
    "SQ15_UNDLM_00284_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp284.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer284 = planComp284.layers.add(bgSolidComp);
bgLayer284.name = "BG_SOLID";
bgLayer284.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer284 = false;
if (gradingSources[284]) {
    var gradedLayer284 = planComp284.layers.add(gradingSources[284]);
    gradedLayer284.name = "UNDLM_00284_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer284.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer284.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer284 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer284 = false;
if (editSources[284]) {
    var editLayer284 = planComp284.layers.add(editSources[284]);
    editLayer284.name = "UNDLM_00284_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer284.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer284.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer284 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity284 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer284) {
    // EDIT toujours activé quand disponible
    editLayer284.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer284) {
        gradedLayer284.enabled = false;
    }
} else if (hasGradedLayer284) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer284.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText284 = planComp284.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText284.name = "WARNING_NO_EDIT";
    warningText284.property("Transform").property("Position").setValue([1280, 200]);
    warningText284.guideLayer = true;
    
    var warningTextDoc284 = warningText284.property("Source Text").value;
    warningTextDoc284.fontSize = 32;
    warningTextDoc284.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc284.font = "Arial-BoldMT";
    warningTextDoc284.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText284.property("Source Text").setValue(warningTextDoc284);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText284 = planComp284.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00284");
    errorText284.name = "ERROR_NO_SOURCE";
    errorText284.property("Transform").property("Position").setValue([1280, 720]);
    errorText284.guideLayer = true;
    
    var errorTextDoc284 = errorText284.property("Source Text").value;
    errorTextDoc284.fontSize = 48;
    errorTextDoc284.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc284.font = "Arial-BoldMT";
    errorTextDoc284.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText284.property("Source Text").setValue(errorTextDoc284);
}

planCompositions[284] = planComp284;


// Composition pour plan 00285
var planComp285 = project.items.addComp(
    "SQ15_UNDLM_00285_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp285.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer285 = planComp285.layers.add(bgSolidComp);
bgLayer285.name = "BG_SOLID";
bgLayer285.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer285 = false;
if (gradingSources[285]) {
    var gradedLayer285 = planComp285.layers.add(gradingSources[285]);
    gradedLayer285.name = "UNDLM_00285_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer285.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer285.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer285 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer285 = false;
if (editSources[285]) {
    var editLayer285 = planComp285.layers.add(editSources[285]);
    editLayer285.name = "UNDLM_00285_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer285.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer285.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer285 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity285 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer285) {
    // EDIT toujours activé quand disponible
    editLayer285.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer285) {
        gradedLayer285.enabled = false;
    }
} else if (hasGradedLayer285) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer285.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText285 = planComp285.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText285.name = "WARNING_NO_EDIT";
    warningText285.property("Transform").property("Position").setValue([1280, 200]);
    warningText285.guideLayer = true;
    
    var warningTextDoc285 = warningText285.property("Source Text").value;
    warningTextDoc285.fontSize = 32;
    warningTextDoc285.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc285.font = "Arial-BoldMT";
    warningTextDoc285.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText285.property("Source Text").setValue(warningTextDoc285);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText285 = planComp285.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00285");
    errorText285.name = "ERROR_NO_SOURCE";
    errorText285.property("Transform").property("Position").setValue([1280, 720]);
    errorText285.guideLayer = true;
    
    var errorTextDoc285 = errorText285.property("Source Text").value;
    errorTextDoc285.fontSize = 48;
    errorTextDoc285.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc285.font = "Arial-BoldMT";
    errorTextDoc285.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText285.property("Source Text").setValue(errorTextDoc285);
}

planCompositions[285] = planComp285;


// Composition pour plan 00286
var planComp286 = project.items.addComp(
    "SQ15_UNDLM_00286_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp286.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer286 = planComp286.layers.add(bgSolidComp);
bgLayer286.name = "BG_SOLID";
bgLayer286.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer286 = false;
if (gradingSources[286]) {
    var gradedLayer286 = planComp286.layers.add(gradingSources[286]);
    gradedLayer286.name = "UNDLM_00286_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer286.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer286.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer286 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer286 = false;
if (editSources[286]) {
    var editLayer286 = planComp286.layers.add(editSources[286]);
    editLayer286.name = "UNDLM_00286_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer286.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer286.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer286 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity286 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer286) {
    // EDIT toujours activé quand disponible
    editLayer286.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer286) {
        gradedLayer286.enabled = false;
    }
} else if (hasGradedLayer286) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer286.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText286 = planComp286.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText286.name = "WARNING_NO_EDIT";
    warningText286.property("Transform").property("Position").setValue([1280, 200]);
    warningText286.guideLayer = true;
    
    var warningTextDoc286 = warningText286.property("Source Text").value;
    warningTextDoc286.fontSize = 32;
    warningTextDoc286.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc286.font = "Arial-BoldMT";
    warningTextDoc286.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText286.property("Source Text").setValue(warningTextDoc286);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText286 = planComp286.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00286");
    errorText286.name = "ERROR_NO_SOURCE";
    errorText286.property("Transform").property("Position").setValue([1280, 720]);
    errorText286.guideLayer = true;
    
    var errorTextDoc286 = errorText286.property("Source Text").value;
    errorTextDoc286.fontSize = 48;
    errorTextDoc286.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc286.font = "Arial-BoldMT";
    errorTextDoc286.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText286.property("Source Text").setValue(errorTextDoc286);
}

planCompositions[286] = planComp286;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ15_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    102.20000000000002, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00268 à la timeline master
if (planCompositions[268]) {
    var masterLayer268 = masterComp.layers.add(planCompositions[268]);
    masterLayer268.startTime = 0;
    masterLayer268.name = "UNDLM_00268";
    masterLayer268.label = 1; // Couleurs alternées
}

// Ajouter plan 00269 à la timeline master
if (planCompositions[269]) {
    var masterLayer269 = masterComp.layers.add(planCompositions[269]);
    masterLayer269.startTime = 9.92;
    masterLayer269.name = "UNDLM_00269";
    masterLayer269.label = 2; // Couleurs alternées
}

// Ajouter plan 00270 à la timeline master
if (planCompositions[270]) {
    var masterLayer270 = masterComp.layers.add(planCompositions[270]);
    masterLayer270.startTime = 12.52;
    masterLayer270.name = "UNDLM_00270";
    masterLayer270.label = 3; // Couleurs alternées
}

// Ajouter plan 00271 à la timeline master
if (planCompositions[271]) {
    var masterLayer271 = masterComp.layers.add(planCompositions[271]);
    masterLayer271.startTime = 18.28;
    masterLayer271.name = "UNDLM_00271";
    masterLayer271.label = 4; // Couleurs alternées
}

// Ajouter plan 00272 à la timeline master
if (planCompositions[272]) {
    var masterLayer272 = masterComp.layers.add(planCompositions[272]);
    masterLayer272.startTime = 23.44;
    masterLayer272.name = "UNDLM_00272";
    masterLayer272.label = 5; // Couleurs alternées
}

// Ajouter plan 00273 à la timeline master
if (planCompositions[273]) {
    var masterLayer273 = masterComp.layers.add(planCompositions[273]);
    masterLayer273.startTime = 27.840000000000003;
    masterLayer273.name = "UNDLM_00273";
    masterLayer273.label = 6; // Couleurs alternées
}

// Ajouter plan 00274 à la timeline master
if (planCompositions[274]) {
    var masterLayer274 = masterComp.layers.add(planCompositions[274]);
    masterLayer274.startTime = 35.28;
    masterLayer274.name = "UNDLM_00274";
    masterLayer274.label = 7; // Couleurs alternées
}

// Ajouter plan 00275 à la timeline master
if (planCompositions[275]) {
    var masterLayer275 = masterComp.layers.add(planCompositions[275]);
    masterLayer275.startTime = 41.36;
    masterLayer275.name = "UNDLM_00275";
    masterLayer275.label = 8; // Couleurs alternées
}

// Ajouter plan 00276 à la timeline master
if (planCompositions[276]) {
    var masterLayer276 = masterComp.layers.add(planCompositions[276]);
    masterLayer276.startTime = 45.6;
    masterLayer276.name = "UNDLM_00276";
    masterLayer276.label = 9; // Couleurs alternées
}

// Ajouter plan 00277 à la timeline master
if (planCompositions[277]) {
    var masterLayer277 = masterComp.layers.add(planCompositions[277]);
    masterLayer277.startTime = 46.76;
    masterLayer277.name = "UNDLM_00277";
    masterLayer277.label = 10; // Couleurs alternées
}

// Ajouter plan 00278 à la timeline master
if (planCompositions[278]) {
    var masterLayer278 = masterComp.layers.add(planCompositions[278]);
    masterLayer278.startTime = 50.28;
    masterLayer278.name = "UNDLM_00278";
    masterLayer278.label = 11; // Couleurs alternées
}

// Ajouter plan 00279 à la timeline master
if (planCompositions[279]) {
    var masterLayer279 = masterComp.layers.add(planCompositions[279]);
    masterLayer279.startTime = 54.2;
    masterLayer279.name = "UNDLM_00279";
    masterLayer279.label = 12; // Couleurs alternées
}

// Ajouter plan 00280 à la timeline master
if (planCompositions[280]) {
    var masterLayer280 = masterComp.layers.add(planCompositions[280]);
    masterLayer280.startTime = 62.84;
    masterLayer280.name = "UNDLM_00280";
    masterLayer280.label = 13; // Couleurs alternées
}

// Ajouter plan 00281 à la timeline master
if (planCompositions[281]) {
    var masterLayer281 = masterComp.layers.add(planCompositions[281]);
    masterLayer281.startTime = 69.28;
    masterLayer281.name = "UNDLM_00281";
    masterLayer281.label = 14; // Couleurs alternées
}

// Ajouter plan 00282 à la timeline master
if (planCompositions[282]) {
    var masterLayer282 = masterComp.layers.add(planCompositions[282]);
    masterLayer282.startTime = 73.76;
    masterLayer282.name = "UNDLM_00282";
    masterLayer282.label = 15; // Couleurs alternées
}

// Ajouter plan 00283 à la timeline master
if (planCompositions[283]) {
    var masterLayer283 = masterComp.layers.add(planCompositions[283]);
    masterLayer283.startTime = 80.80000000000001;
    masterLayer283.name = "UNDLM_00283";
    masterLayer283.label = 16; // Couleurs alternées
}

// Ajouter plan 00284 à la timeline master
if (planCompositions[284]) {
    var masterLayer284 = masterComp.layers.add(planCompositions[284]);
    masterLayer284.startTime = 85.48000000000002;
    masterLayer284.name = "UNDLM_00284";
    masterLayer284.label = 1; // Couleurs alternées
}

// Ajouter plan 00285 à la timeline master
if (planCompositions[285]) {
    var masterLayer285 = masterComp.layers.add(planCompositions[285]);
    masterLayer285.startTime = 94.00000000000001;
    masterLayer285.name = "UNDLM_00285";
    masterLayer285.label = 2; // Couleurs alternées
}

// Ajouter plan 00286 à la timeline master
if (planCompositions[286]) {
    var masterLayer286 = masterComp.layers.add(planCompositions[286]);
    masterLayer286.startTime = 96.52000000000001;
    masterLayer286.name = "UNDLM_00286";
    masterLayer286.label = 3; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ15";\n' +
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
    {start: 0, end: 9.92, name: "UNDLM_00268"},
    {start: 9.92, end: 12.52, name: "UNDLM_00269"},
    {start: 12.52, end: 18.28, name: "UNDLM_00270"},
    {start: 18.28, end: 23.44, name: "UNDLM_00271"},
    {start: 23.44, end: 27.840000000000003, name: "UNDLM_00272"},
    {start: 27.840000000000003, end: 35.28, name: "UNDLM_00273"},
    {start: 35.28, end: 41.36, name: "UNDLM_00274"},
    {start: 41.36, end: 45.6, name: "UNDLM_00275"},
    {start: 45.6, end: 46.76, name: "UNDLM_00276"},
    {start: 46.76, end: 50.28, name: "UNDLM_00277"},
    {start: 50.28, end: 54.2, name: "UNDLM_00278"},
    {start: 54.2, end: 62.84, name: "UNDLM_00279"},
    {start: 62.84, end: 69.28, name: "UNDLM_00280"},
    {start: 69.28, end: 73.76, name: "UNDLM_00281"},
    {start: 73.76, end: 80.80000000000001, name: "UNDLM_00282"},
    {start: 80.80000000000001, end: 85.48000000000002, name: "UNDLM_00283"},
    {start: 85.48000000000002, end: 94.00000000000001, name: "UNDLM_00284"},
    {start: 94.00000000000001, end: 96.52000000000001, name: "UNDLM_00285"},
    {start: 96.52000000000001, end: 102.20000000000002, name: "UNDLM_00286"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ15/_AE/SQ15_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 19;
var totalCount = 19;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ15 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(102.20000000000002 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ15_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ15:" + totalCount + ":" + gradedCount);
