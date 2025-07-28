
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ25 avec 21 plans
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


// Import plan EDIT 00443
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile443 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00443.mov");
var editFilePoignees443 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00443_AVEC_POIGNEES.mov");
var editFileBis443 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00443bis.mov");

var importSuccess443 = false;
var fileName443 = "";

// Tenter import standard
if (editFile443.exists) {
    try {
        var editFootage443 = project.importFile(new ImportOptions(editFile443));
        editFootage443.parentFolder = fromEditFolder;
        editFootage443.name = "UNDLM_00443";
        editSources[443] = editFootage443;
        editImportCount++;
        importSuccess443 = true;
        fileName443 = "UNDLM_00443.mov";
        logImportSuccess(443, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00443.mov", fileName443);
    } catch (e) {
        logImportError(443, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00443.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess443 && editFilePoignees443.exists) {
    try {
        var editFootage443 = project.importFile(new ImportOptions(editFilePoignees443));
        editFootage443.parentFolder = fromEditFolder;
        editFootage443.name = "UNDLM_00443_AVEC_POIGNEES";
        editSources[443] = editFootage443;
        editImportCount++;
        importSuccess443 = true;
        fileName443 = "UNDLM_00443_AVEC_POIGNEES.mov";
        logImportSuccess(443, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00443_AVEC_POIGNEES.mov", fileName443);
    } catch (e) {
        logImportError(443, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00443_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess443 && editFileBis443.exists) {
    try {
        var editFootage443 = project.importFile(new ImportOptions(editFileBis443));
        editFootage443.parentFolder = fromEditFolder;
        editFootage443.name = "UNDLM_00443bis";
        editSources[443] = editFootage443;
        editImportCount++;
        importSuccess443 = true;
        fileName443 = "UNDLM_00443bis.mov";
        logImportSuccess(443, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00443bis.mov", fileName443);
    } catch (e) {
        logImportError(443, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00443bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess443) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00443.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00444
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile444 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00444.mov");
var editFilePoignees444 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00444_AVEC_POIGNEES.mov");
var editFileBis444 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00444bis.mov");

var importSuccess444 = false;
var fileName444 = "";

// Tenter import standard
if (editFile444.exists) {
    try {
        var editFootage444 = project.importFile(new ImportOptions(editFile444));
        editFootage444.parentFolder = fromEditFolder;
        editFootage444.name = "UNDLM_00444";
        editSources[444] = editFootage444;
        editImportCount++;
        importSuccess444 = true;
        fileName444 = "UNDLM_00444.mov";
        logImportSuccess(444, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00444.mov", fileName444);
    } catch (e) {
        logImportError(444, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00444.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess444 && editFilePoignees444.exists) {
    try {
        var editFootage444 = project.importFile(new ImportOptions(editFilePoignees444));
        editFootage444.parentFolder = fromEditFolder;
        editFootage444.name = "UNDLM_00444_AVEC_POIGNEES";
        editSources[444] = editFootage444;
        editImportCount++;
        importSuccess444 = true;
        fileName444 = "UNDLM_00444_AVEC_POIGNEES.mov";
        logImportSuccess(444, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00444_AVEC_POIGNEES.mov", fileName444);
    } catch (e) {
        logImportError(444, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00444_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess444 && editFileBis444.exists) {
    try {
        var editFootage444 = project.importFile(new ImportOptions(editFileBis444));
        editFootage444.parentFolder = fromEditFolder;
        editFootage444.name = "UNDLM_00444bis";
        editSources[444] = editFootage444;
        editImportCount++;
        importSuccess444 = true;
        fileName444 = "UNDLM_00444bis.mov";
        logImportSuccess(444, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00444bis.mov", fileName444);
    } catch (e) {
        logImportError(444, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00444bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess444) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00444.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00445
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile445 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00445.mov");
var editFilePoignees445 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00445_AVEC_POIGNEES.mov");
var editFileBis445 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00445bis.mov");

var importSuccess445 = false;
var fileName445 = "";

// Tenter import standard
if (editFile445.exists) {
    try {
        var editFootage445 = project.importFile(new ImportOptions(editFile445));
        editFootage445.parentFolder = fromEditFolder;
        editFootage445.name = "UNDLM_00445";
        editSources[445] = editFootage445;
        editImportCount++;
        importSuccess445 = true;
        fileName445 = "UNDLM_00445.mov";
        logImportSuccess(445, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00445.mov", fileName445);
    } catch (e) {
        logImportError(445, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00445.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess445 && editFilePoignees445.exists) {
    try {
        var editFootage445 = project.importFile(new ImportOptions(editFilePoignees445));
        editFootage445.parentFolder = fromEditFolder;
        editFootage445.name = "UNDLM_00445_AVEC_POIGNEES";
        editSources[445] = editFootage445;
        editImportCount++;
        importSuccess445 = true;
        fileName445 = "UNDLM_00445_AVEC_POIGNEES.mov";
        logImportSuccess(445, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00445_AVEC_POIGNEES.mov", fileName445);
    } catch (e) {
        logImportError(445, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00445_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess445 && editFileBis445.exists) {
    try {
        var editFootage445 = project.importFile(new ImportOptions(editFileBis445));
        editFootage445.parentFolder = fromEditFolder;
        editFootage445.name = "UNDLM_00445bis";
        editSources[445] = editFootage445;
        editImportCount++;
        importSuccess445 = true;
        fileName445 = "UNDLM_00445bis.mov";
        logImportSuccess(445, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00445bis.mov", fileName445);
    } catch (e) {
        logImportError(445, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00445bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess445) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00445.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00446
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile446 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00446.mov");
var editFilePoignees446 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00446_AVEC_POIGNEES.mov");
var editFileBis446 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00446bis.mov");

var importSuccess446 = false;
var fileName446 = "";

// Tenter import standard
if (editFile446.exists) {
    try {
        var editFootage446 = project.importFile(new ImportOptions(editFile446));
        editFootage446.parentFolder = fromEditFolder;
        editFootage446.name = "UNDLM_00446";
        editSources[446] = editFootage446;
        editImportCount++;
        importSuccess446 = true;
        fileName446 = "UNDLM_00446.mov";
        logImportSuccess(446, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00446.mov", fileName446);
    } catch (e) {
        logImportError(446, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00446.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess446 && editFilePoignees446.exists) {
    try {
        var editFootage446 = project.importFile(new ImportOptions(editFilePoignees446));
        editFootage446.parentFolder = fromEditFolder;
        editFootage446.name = "UNDLM_00446_AVEC_POIGNEES";
        editSources[446] = editFootage446;
        editImportCount++;
        importSuccess446 = true;
        fileName446 = "UNDLM_00446_AVEC_POIGNEES.mov";
        logImportSuccess(446, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00446_AVEC_POIGNEES.mov", fileName446);
    } catch (e) {
        logImportError(446, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00446_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess446 && editFileBis446.exists) {
    try {
        var editFootage446 = project.importFile(new ImportOptions(editFileBis446));
        editFootage446.parentFolder = fromEditFolder;
        editFootage446.name = "UNDLM_00446bis";
        editSources[446] = editFootage446;
        editImportCount++;
        importSuccess446 = true;
        fileName446 = "UNDLM_00446bis.mov";
        logImportSuccess(446, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00446bis.mov", fileName446);
    } catch (e) {
        logImportError(446, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00446bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess446) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00446.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00447
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile447 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00447.mov");
var editFilePoignees447 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00447_AVEC_POIGNEES.mov");
var editFileBis447 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00447bis.mov");

var importSuccess447 = false;
var fileName447 = "";

// Tenter import standard
if (editFile447.exists) {
    try {
        var editFootage447 = project.importFile(new ImportOptions(editFile447));
        editFootage447.parentFolder = fromEditFolder;
        editFootage447.name = "UNDLM_00447";
        editSources[447] = editFootage447;
        editImportCount++;
        importSuccess447 = true;
        fileName447 = "UNDLM_00447.mov";
        logImportSuccess(447, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00447.mov", fileName447);
    } catch (e) {
        logImportError(447, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00447.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess447 && editFilePoignees447.exists) {
    try {
        var editFootage447 = project.importFile(new ImportOptions(editFilePoignees447));
        editFootage447.parentFolder = fromEditFolder;
        editFootage447.name = "UNDLM_00447_AVEC_POIGNEES";
        editSources[447] = editFootage447;
        editImportCount++;
        importSuccess447 = true;
        fileName447 = "UNDLM_00447_AVEC_POIGNEES.mov";
        logImportSuccess(447, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00447_AVEC_POIGNEES.mov", fileName447);
    } catch (e) {
        logImportError(447, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00447_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess447 && editFileBis447.exists) {
    try {
        var editFootage447 = project.importFile(new ImportOptions(editFileBis447));
        editFootage447.parentFolder = fromEditFolder;
        editFootage447.name = "UNDLM_00447bis";
        editSources[447] = editFootage447;
        editImportCount++;
        importSuccess447 = true;
        fileName447 = "UNDLM_00447bis.mov";
        logImportSuccess(447, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00447bis.mov", fileName447);
    } catch (e) {
        logImportError(447, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00447bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess447) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00447.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00448
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile448 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00448.mov");
var editFilePoignees448 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00448_AVEC_POIGNEES.mov");
var editFileBis448 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00448bis.mov");

var importSuccess448 = false;
var fileName448 = "";

// Tenter import standard
if (editFile448.exists) {
    try {
        var editFootage448 = project.importFile(new ImportOptions(editFile448));
        editFootage448.parentFolder = fromEditFolder;
        editFootage448.name = "UNDLM_00448";
        editSources[448] = editFootage448;
        editImportCount++;
        importSuccess448 = true;
        fileName448 = "UNDLM_00448.mov";
        logImportSuccess(448, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00448.mov", fileName448);
    } catch (e) {
        logImportError(448, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00448.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess448 && editFilePoignees448.exists) {
    try {
        var editFootage448 = project.importFile(new ImportOptions(editFilePoignees448));
        editFootage448.parentFolder = fromEditFolder;
        editFootage448.name = "UNDLM_00448_AVEC_POIGNEES";
        editSources[448] = editFootage448;
        editImportCount++;
        importSuccess448 = true;
        fileName448 = "UNDLM_00448_AVEC_POIGNEES.mov";
        logImportSuccess(448, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00448_AVEC_POIGNEES.mov", fileName448);
    } catch (e) {
        logImportError(448, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00448_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess448 && editFileBis448.exists) {
    try {
        var editFootage448 = project.importFile(new ImportOptions(editFileBis448));
        editFootage448.parentFolder = fromEditFolder;
        editFootage448.name = "UNDLM_00448bis";
        editSources[448] = editFootage448;
        editImportCount++;
        importSuccess448 = true;
        fileName448 = "UNDLM_00448bis.mov";
        logImportSuccess(448, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00448bis.mov", fileName448);
    } catch (e) {
        logImportError(448, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00448bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess448) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00448.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00449
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile449 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00449.mov");
var editFilePoignees449 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00449_AVEC_POIGNEES.mov");
var editFileBis449 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00449bis.mov");

var importSuccess449 = false;
var fileName449 = "";

// Tenter import standard
if (editFile449.exists) {
    try {
        var editFootage449 = project.importFile(new ImportOptions(editFile449));
        editFootage449.parentFolder = fromEditFolder;
        editFootage449.name = "UNDLM_00449";
        editSources[449] = editFootage449;
        editImportCount++;
        importSuccess449 = true;
        fileName449 = "UNDLM_00449.mov";
        logImportSuccess(449, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00449.mov", fileName449);
    } catch (e) {
        logImportError(449, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00449.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess449 && editFilePoignees449.exists) {
    try {
        var editFootage449 = project.importFile(new ImportOptions(editFilePoignees449));
        editFootage449.parentFolder = fromEditFolder;
        editFootage449.name = "UNDLM_00449_AVEC_POIGNEES";
        editSources[449] = editFootage449;
        editImportCount++;
        importSuccess449 = true;
        fileName449 = "UNDLM_00449_AVEC_POIGNEES.mov";
        logImportSuccess(449, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00449_AVEC_POIGNEES.mov", fileName449);
    } catch (e) {
        logImportError(449, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00449_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess449 && editFileBis449.exists) {
    try {
        var editFootage449 = project.importFile(new ImportOptions(editFileBis449));
        editFootage449.parentFolder = fromEditFolder;
        editFootage449.name = "UNDLM_00449bis";
        editSources[449] = editFootage449;
        editImportCount++;
        importSuccess449 = true;
        fileName449 = "UNDLM_00449bis.mov";
        logImportSuccess(449, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00449bis.mov", fileName449);
    } catch (e) {
        logImportError(449, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00449bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess449) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00449.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00450
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile450 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00450.mov");
var editFilePoignees450 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00450_AVEC_POIGNEES.mov");
var editFileBis450 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00450bis.mov");

var importSuccess450 = false;
var fileName450 = "";

// Tenter import standard
if (editFile450.exists) {
    try {
        var editFootage450 = project.importFile(new ImportOptions(editFile450));
        editFootage450.parentFolder = fromEditFolder;
        editFootage450.name = "UNDLM_00450";
        editSources[450] = editFootage450;
        editImportCount++;
        importSuccess450 = true;
        fileName450 = "UNDLM_00450.mov";
        logImportSuccess(450, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00450.mov", fileName450);
    } catch (e) {
        logImportError(450, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00450.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess450 && editFilePoignees450.exists) {
    try {
        var editFootage450 = project.importFile(new ImportOptions(editFilePoignees450));
        editFootage450.parentFolder = fromEditFolder;
        editFootage450.name = "UNDLM_00450_AVEC_POIGNEES";
        editSources[450] = editFootage450;
        editImportCount++;
        importSuccess450 = true;
        fileName450 = "UNDLM_00450_AVEC_POIGNEES.mov";
        logImportSuccess(450, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00450_AVEC_POIGNEES.mov", fileName450);
    } catch (e) {
        logImportError(450, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00450_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess450 && editFileBis450.exists) {
    try {
        var editFootage450 = project.importFile(new ImportOptions(editFileBis450));
        editFootage450.parentFolder = fromEditFolder;
        editFootage450.name = "UNDLM_00450bis";
        editSources[450] = editFootage450;
        editImportCount++;
        importSuccess450 = true;
        fileName450 = "UNDLM_00450bis.mov";
        logImportSuccess(450, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00450bis.mov", fileName450);
    } catch (e) {
        logImportError(450, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00450bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess450) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00450.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00451
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile451 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00451.mov");
var editFilePoignees451 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00451_AVEC_POIGNEES.mov");
var editFileBis451 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00451bis.mov");

var importSuccess451 = false;
var fileName451 = "";

// Tenter import standard
if (editFile451.exists) {
    try {
        var editFootage451 = project.importFile(new ImportOptions(editFile451));
        editFootage451.parentFolder = fromEditFolder;
        editFootage451.name = "UNDLM_00451";
        editSources[451] = editFootage451;
        editImportCount++;
        importSuccess451 = true;
        fileName451 = "UNDLM_00451.mov";
        logImportSuccess(451, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00451.mov", fileName451);
    } catch (e) {
        logImportError(451, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00451.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess451 && editFilePoignees451.exists) {
    try {
        var editFootage451 = project.importFile(new ImportOptions(editFilePoignees451));
        editFootage451.parentFolder = fromEditFolder;
        editFootage451.name = "UNDLM_00451_AVEC_POIGNEES";
        editSources[451] = editFootage451;
        editImportCount++;
        importSuccess451 = true;
        fileName451 = "UNDLM_00451_AVEC_POIGNEES.mov";
        logImportSuccess(451, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00451_AVEC_POIGNEES.mov", fileName451);
    } catch (e) {
        logImportError(451, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00451_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess451 && editFileBis451.exists) {
    try {
        var editFootage451 = project.importFile(new ImportOptions(editFileBis451));
        editFootage451.parentFolder = fromEditFolder;
        editFootage451.name = "UNDLM_00451bis";
        editSources[451] = editFootage451;
        editImportCount++;
        importSuccess451 = true;
        fileName451 = "UNDLM_00451bis.mov";
        logImportSuccess(451, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00451bis.mov", fileName451);
    } catch (e) {
        logImportError(451, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00451bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess451) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00451.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00452
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile452 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00452.mov");
var editFilePoignees452 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00452_AVEC_POIGNEES.mov");
var editFileBis452 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00452bis.mov");

var importSuccess452 = false;
var fileName452 = "";

// Tenter import standard
if (editFile452.exists) {
    try {
        var editFootage452 = project.importFile(new ImportOptions(editFile452));
        editFootage452.parentFolder = fromEditFolder;
        editFootage452.name = "UNDLM_00452";
        editSources[452] = editFootage452;
        editImportCount++;
        importSuccess452 = true;
        fileName452 = "UNDLM_00452.mov";
        logImportSuccess(452, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00452.mov", fileName452);
    } catch (e) {
        logImportError(452, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00452.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess452 && editFilePoignees452.exists) {
    try {
        var editFootage452 = project.importFile(new ImportOptions(editFilePoignees452));
        editFootage452.parentFolder = fromEditFolder;
        editFootage452.name = "UNDLM_00452_AVEC_POIGNEES";
        editSources[452] = editFootage452;
        editImportCount++;
        importSuccess452 = true;
        fileName452 = "UNDLM_00452_AVEC_POIGNEES.mov";
        logImportSuccess(452, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00452_AVEC_POIGNEES.mov", fileName452);
    } catch (e) {
        logImportError(452, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00452_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess452 && editFileBis452.exists) {
    try {
        var editFootage452 = project.importFile(new ImportOptions(editFileBis452));
        editFootage452.parentFolder = fromEditFolder;
        editFootage452.name = "UNDLM_00452bis";
        editSources[452] = editFootage452;
        editImportCount++;
        importSuccess452 = true;
        fileName452 = "UNDLM_00452bis.mov";
        logImportSuccess(452, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00452bis.mov", fileName452);
    } catch (e) {
        logImportError(452, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00452bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess452) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00452.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00453
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile453 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00453.mov");
var editFilePoignees453 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00453_AVEC_POIGNEES.mov");
var editFileBis453 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00453bis.mov");

var importSuccess453 = false;
var fileName453 = "";

// Tenter import standard
if (editFile453.exists) {
    try {
        var editFootage453 = project.importFile(new ImportOptions(editFile453));
        editFootage453.parentFolder = fromEditFolder;
        editFootage453.name = "UNDLM_00453";
        editSources[453] = editFootage453;
        editImportCount++;
        importSuccess453 = true;
        fileName453 = "UNDLM_00453.mov";
        logImportSuccess(453, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00453.mov", fileName453);
    } catch (e) {
        logImportError(453, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00453.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess453 && editFilePoignees453.exists) {
    try {
        var editFootage453 = project.importFile(new ImportOptions(editFilePoignees453));
        editFootage453.parentFolder = fromEditFolder;
        editFootage453.name = "UNDLM_00453_AVEC_POIGNEES";
        editSources[453] = editFootage453;
        editImportCount++;
        importSuccess453 = true;
        fileName453 = "UNDLM_00453_AVEC_POIGNEES.mov";
        logImportSuccess(453, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00453_AVEC_POIGNEES.mov", fileName453);
    } catch (e) {
        logImportError(453, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00453_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess453 && editFileBis453.exists) {
    try {
        var editFootage453 = project.importFile(new ImportOptions(editFileBis453));
        editFootage453.parentFolder = fromEditFolder;
        editFootage453.name = "UNDLM_00453bis";
        editSources[453] = editFootage453;
        editImportCount++;
        importSuccess453 = true;
        fileName453 = "UNDLM_00453bis.mov";
        logImportSuccess(453, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00453bis.mov", fileName453);
    } catch (e) {
        logImportError(453, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00453bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess453) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00453.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00454
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile454 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00454.mov");
var editFilePoignees454 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00454_AVEC_POIGNEES.mov");
var editFileBis454 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00454bis.mov");

var importSuccess454 = false;
var fileName454 = "";

// Tenter import standard
if (editFile454.exists) {
    try {
        var editFootage454 = project.importFile(new ImportOptions(editFile454));
        editFootage454.parentFolder = fromEditFolder;
        editFootage454.name = "UNDLM_00454";
        editSources[454] = editFootage454;
        editImportCount++;
        importSuccess454 = true;
        fileName454 = "UNDLM_00454.mov";
        logImportSuccess(454, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00454.mov", fileName454);
    } catch (e) {
        logImportError(454, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00454.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess454 && editFilePoignees454.exists) {
    try {
        var editFootage454 = project.importFile(new ImportOptions(editFilePoignees454));
        editFootage454.parentFolder = fromEditFolder;
        editFootage454.name = "UNDLM_00454_AVEC_POIGNEES";
        editSources[454] = editFootage454;
        editImportCount++;
        importSuccess454 = true;
        fileName454 = "UNDLM_00454_AVEC_POIGNEES.mov";
        logImportSuccess(454, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00454_AVEC_POIGNEES.mov", fileName454);
    } catch (e) {
        logImportError(454, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00454_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess454 && editFileBis454.exists) {
    try {
        var editFootage454 = project.importFile(new ImportOptions(editFileBis454));
        editFootage454.parentFolder = fromEditFolder;
        editFootage454.name = "UNDLM_00454bis";
        editSources[454] = editFootage454;
        editImportCount++;
        importSuccess454 = true;
        fileName454 = "UNDLM_00454bis.mov";
        logImportSuccess(454, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00454bis.mov", fileName454);
    } catch (e) {
        logImportError(454, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00454bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess454) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00454.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00455
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile455 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00455.mov");
var editFilePoignees455 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00455_AVEC_POIGNEES.mov");
var editFileBis455 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00455bis.mov");

var importSuccess455 = false;
var fileName455 = "";

// Tenter import standard
if (editFile455.exists) {
    try {
        var editFootage455 = project.importFile(new ImportOptions(editFile455));
        editFootage455.parentFolder = fromEditFolder;
        editFootage455.name = "UNDLM_00455";
        editSources[455] = editFootage455;
        editImportCount++;
        importSuccess455 = true;
        fileName455 = "UNDLM_00455.mov";
        logImportSuccess(455, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00455.mov", fileName455);
    } catch (e) {
        logImportError(455, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00455.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess455 && editFilePoignees455.exists) {
    try {
        var editFootage455 = project.importFile(new ImportOptions(editFilePoignees455));
        editFootage455.parentFolder = fromEditFolder;
        editFootage455.name = "UNDLM_00455_AVEC_POIGNEES";
        editSources[455] = editFootage455;
        editImportCount++;
        importSuccess455 = true;
        fileName455 = "UNDLM_00455_AVEC_POIGNEES.mov";
        logImportSuccess(455, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00455_AVEC_POIGNEES.mov", fileName455);
    } catch (e) {
        logImportError(455, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00455_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess455 && editFileBis455.exists) {
    try {
        var editFootage455 = project.importFile(new ImportOptions(editFileBis455));
        editFootage455.parentFolder = fromEditFolder;
        editFootage455.name = "UNDLM_00455bis";
        editSources[455] = editFootage455;
        editImportCount++;
        importSuccess455 = true;
        fileName455 = "UNDLM_00455bis.mov";
        logImportSuccess(455, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00455bis.mov", fileName455);
    } catch (e) {
        logImportError(455, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00455bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess455) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00455.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00456
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile456 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00456.mov");
var editFilePoignees456 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00456_AVEC_POIGNEES.mov");
var editFileBis456 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00456bis.mov");

var importSuccess456 = false;
var fileName456 = "";

// Tenter import standard
if (editFile456.exists) {
    try {
        var editFootage456 = project.importFile(new ImportOptions(editFile456));
        editFootage456.parentFolder = fromEditFolder;
        editFootage456.name = "UNDLM_00456";
        editSources[456] = editFootage456;
        editImportCount++;
        importSuccess456 = true;
        fileName456 = "UNDLM_00456.mov";
        logImportSuccess(456, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00456.mov", fileName456);
    } catch (e) {
        logImportError(456, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00456.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess456 && editFilePoignees456.exists) {
    try {
        var editFootage456 = project.importFile(new ImportOptions(editFilePoignees456));
        editFootage456.parentFolder = fromEditFolder;
        editFootage456.name = "UNDLM_00456_AVEC_POIGNEES";
        editSources[456] = editFootage456;
        editImportCount++;
        importSuccess456 = true;
        fileName456 = "UNDLM_00456_AVEC_POIGNEES.mov";
        logImportSuccess(456, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00456_AVEC_POIGNEES.mov", fileName456);
    } catch (e) {
        logImportError(456, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00456_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess456 && editFileBis456.exists) {
    try {
        var editFootage456 = project.importFile(new ImportOptions(editFileBis456));
        editFootage456.parentFolder = fromEditFolder;
        editFootage456.name = "UNDLM_00456bis";
        editSources[456] = editFootage456;
        editImportCount++;
        importSuccess456 = true;
        fileName456 = "UNDLM_00456bis.mov";
        logImportSuccess(456, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00456bis.mov", fileName456);
    } catch (e) {
        logImportError(456, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00456bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess456) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00456.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00457
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile457 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00457.mov");
var editFilePoignees457 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00457_AVEC_POIGNEES.mov");
var editFileBis457 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00457bis.mov");

var importSuccess457 = false;
var fileName457 = "";

// Tenter import standard
if (editFile457.exists) {
    try {
        var editFootage457 = project.importFile(new ImportOptions(editFile457));
        editFootage457.parentFolder = fromEditFolder;
        editFootage457.name = "UNDLM_00457";
        editSources[457] = editFootage457;
        editImportCount++;
        importSuccess457 = true;
        fileName457 = "UNDLM_00457.mov";
        logImportSuccess(457, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00457.mov", fileName457);
    } catch (e) {
        logImportError(457, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00457.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess457 && editFilePoignees457.exists) {
    try {
        var editFootage457 = project.importFile(new ImportOptions(editFilePoignees457));
        editFootage457.parentFolder = fromEditFolder;
        editFootage457.name = "UNDLM_00457_AVEC_POIGNEES";
        editSources[457] = editFootage457;
        editImportCount++;
        importSuccess457 = true;
        fileName457 = "UNDLM_00457_AVEC_POIGNEES.mov";
        logImportSuccess(457, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00457_AVEC_POIGNEES.mov", fileName457);
    } catch (e) {
        logImportError(457, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00457_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess457 && editFileBis457.exists) {
    try {
        var editFootage457 = project.importFile(new ImportOptions(editFileBis457));
        editFootage457.parentFolder = fromEditFolder;
        editFootage457.name = "UNDLM_00457bis";
        editSources[457] = editFootage457;
        editImportCount++;
        importSuccess457 = true;
        fileName457 = "UNDLM_00457bis.mov";
        logImportSuccess(457, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00457bis.mov", fileName457);
    } catch (e) {
        logImportError(457, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00457bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess457) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00457.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00458
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile458 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00458.mov");
var editFilePoignees458 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00458_AVEC_POIGNEES.mov");
var editFileBis458 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00458bis.mov");

var importSuccess458 = false;
var fileName458 = "";

// Tenter import standard
if (editFile458.exists) {
    try {
        var editFootage458 = project.importFile(new ImportOptions(editFile458));
        editFootage458.parentFolder = fromEditFolder;
        editFootage458.name = "UNDLM_00458";
        editSources[458] = editFootage458;
        editImportCount++;
        importSuccess458 = true;
        fileName458 = "UNDLM_00458.mov";
        logImportSuccess(458, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00458.mov", fileName458);
    } catch (e) {
        logImportError(458, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00458.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess458 && editFilePoignees458.exists) {
    try {
        var editFootage458 = project.importFile(new ImportOptions(editFilePoignees458));
        editFootage458.parentFolder = fromEditFolder;
        editFootage458.name = "UNDLM_00458_AVEC_POIGNEES";
        editSources[458] = editFootage458;
        editImportCount++;
        importSuccess458 = true;
        fileName458 = "UNDLM_00458_AVEC_POIGNEES.mov";
        logImportSuccess(458, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00458_AVEC_POIGNEES.mov", fileName458);
    } catch (e) {
        logImportError(458, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00458_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess458 && editFileBis458.exists) {
    try {
        var editFootage458 = project.importFile(new ImportOptions(editFileBis458));
        editFootage458.parentFolder = fromEditFolder;
        editFootage458.name = "UNDLM_00458bis";
        editSources[458] = editFootage458;
        editImportCount++;
        importSuccess458 = true;
        fileName458 = "UNDLM_00458bis.mov";
        logImportSuccess(458, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00458bis.mov", fileName458);
    } catch (e) {
        logImportError(458, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00458bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess458) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00458.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00459
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile459 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00459.mov");
var editFilePoignees459 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00459_AVEC_POIGNEES.mov");
var editFileBis459 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00459bis.mov");

var importSuccess459 = false;
var fileName459 = "";

// Tenter import standard
if (editFile459.exists) {
    try {
        var editFootage459 = project.importFile(new ImportOptions(editFile459));
        editFootage459.parentFolder = fromEditFolder;
        editFootage459.name = "UNDLM_00459";
        editSources[459] = editFootage459;
        editImportCount++;
        importSuccess459 = true;
        fileName459 = "UNDLM_00459.mov";
        logImportSuccess(459, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00459.mov", fileName459);
    } catch (e) {
        logImportError(459, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00459.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess459 && editFilePoignees459.exists) {
    try {
        var editFootage459 = project.importFile(new ImportOptions(editFilePoignees459));
        editFootage459.parentFolder = fromEditFolder;
        editFootage459.name = "UNDLM_00459_AVEC_POIGNEES";
        editSources[459] = editFootage459;
        editImportCount++;
        importSuccess459 = true;
        fileName459 = "UNDLM_00459_AVEC_POIGNEES.mov";
        logImportSuccess(459, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00459_AVEC_POIGNEES.mov", fileName459);
    } catch (e) {
        logImportError(459, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00459_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess459 && editFileBis459.exists) {
    try {
        var editFootage459 = project.importFile(new ImportOptions(editFileBis459));
        editFootage459.parentFolder = fromEditFolder;
        editFootage459.name = "UNDLM_00459bis";
        editSources[459] = editFootage459;
        editImportCount++;
        importSuccess459 = true;
        fileName459 = "UNDLM_00459bis.mov";
        logImportSuccess(459, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00459bis.mov", fileName459);
    } catch (e) {
        logImportError(459, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00459bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess459) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00459.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00460
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile460 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00460.mov");
var editFilePoignees460 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00460_AVEC_POIGNEES.mov");
var editFileBis460 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00460bis.mov");

var importSuccess460 = false;
var fileName460 = "";

// Tenter import standard
if (editFile460.exists) {
    try {
        var editFootage460 = project.importFile(new ImportOptions(editFile460));
        editFootage460.parentFolder = fromEditFolder;
        editFootage460.name = "UNDLM_00460";
        editSources[460] = editFootage460;
        editImportCount++;
        importSuccess460 = true;
        fileName460 = "UNDLM_00460.mov";
        logImportSuccess(460, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00460.mov", fileName460);
    } catch (e) {
        logImportError(460, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00460.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess460 && editFilePoignees460.exists) {
    try {
        var editFootage460 = project.importFile(new ImportOptions(editFilePoignees460));
        editFootage460.parentFolder = fromEditFolder;
        editFootage460.name = "UNDLM_00460_AVEC_POIGNEES";
        editSources[460] = editFootage460;
        editImportCount++;
        importSuccess460 = true;
        fileName460 = "UNDLM_00460_AVEC_POIGNEES.mov";
        logImportSuccess(460, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00460_AVEC_POIGNEES.mov", fileName460);
    } catch (e) {
        logImportError(460, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00460_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess460 && editFileBis460.exists) {
    try {
        var editFootage460 = project.importFile(new ImportOptions(editFileBis460));
        editFootage460.parentFolder = fromEditFolder;
        editFootage460.name = "UNDLM_00460bis";
        editSources[460] = editFootage460;
        editImportCount++;
        importSuccess460 = true;
        fileName460 = "UNDLM_00460bis.mov";
        logImportSuccess(460, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00460bis.mov", fileName460);
    } catch (e) {
        logImportError(460, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00460bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess460) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00460.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00461
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile461 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00461.mov");
var editFilePoignees461 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00461_AVEC_POIGNEES.mov");
var editFileBis461 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00461bis.mov");

var importSuccess461 = false;
var fileName461 = "";

// Tenter import standard
if (editFile461.exists) {
    try {
        var editFootage461 = project.importFile(new ImportOptions(editFile461));
        editFootage461.parentFolder = fromEditFolder;
        editFootage461.name = "UNDLM_00461";
        editSources[461] = editFootage461;
        editImportCount++;
        importSuccess461 = true;
        fileName461 = "UNDLM_00461.mov";
        logImportSuccess(461, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00461.mov", fileName461);
    } catch (e) {
        logImportError(461, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00461.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess461 && editFilePoignees461.exists) {
    try {
        var editFootage461 = project.importFile(new ImportOptions(editFilePoignees461));
        editFootage461.parentFolder = fromEditFolder;
        editFootage461.name = "UNDLM_00461_AVEC_POIGNEES";
        editSources[461] = editFootage461;
        editImportCount++;
        importSuccess461 = true;
        fileName461 = "UNDLM_00461_AVEC_POIGNEES.mov";
        logImportSuccess(461, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00461_AVEC_POIGNEES.mov", fileName461);
    } catch (e) {
        logImportError(461, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00461_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess461 && editFileBis461.exists) {
    try {
        var editFootage461 = project.importFile(new ImportOptions(editFileBis461));
        editFootage461.parentFolder = fromEditFolder;
        editFootage461.name = "UNDLM_00461bis";
        editSources[461] = editFootage461;
        editImportCount++;
        importSuccess461 = true;
        fileName461 = "UNDLM_00461bis.mov";
        logImportSuccess(461, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00461bis.mov", fileName461);
    } catch (e) {
        logImportError(461, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00461bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess461) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00461.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00462
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile462 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00462.mov");
var editFilePoignees462 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00462_AVEC_POIGNEES.mov");
var editFileBis462 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00462bis.mov");

var importSuccess462 = false;
var fileName462 = "";

// Tenter import standard
if (editFile462.exists) {
    try {
        var editFootage462 = project.importFile(new ImportOptions(editFile462));
        editFootage462.parentFolder = fromEditFolder;
        editFootage462.name = "UNDLM_00462";
        editSources[462] = editFootage462;
        editImportCount++;
        importSuccess462 = true;
        fileName462 = "UNDLM_00462.mov";
        logImportSuccess(462, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00462.mov", fileName462);
    } catch (e) {
        logImportError(462, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00462.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess462 && editFilePoignees462.exists) {
    try {
        var editFootage462 = project.importFile(new ImportOptions(editFilePoignees462));
        editFootage462.parentFolder = fromEditFolder;
        editFootage462.name = "UNDLM_00462_AVEC_POIGNEES";
        editSources[462] = editFootage462;
        editImportCount++;
        importSuccess462 = true;
        fileName462 = "UNDLM_00462_AVEC_POIGNEES.mov";
        logImportSuccess(462, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00462_AVEC_POIGNEES.mov", fileName462);
    } catch (e) {
        logImportError(462, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00462_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess462 && editFileBis462.exists) {
    try {
        var editFootage462 = project.importFile(new ImportOptions(editFileBis462));
        editFootage462.parentFolder = fromEditFolder;
        editFootage462.name = "UNDLM_00462bis";
        editSources[462] = editFootage462;
        editImportCount++;
        importSuccess462 = true;
        fileName462 = "UNDLM_00462bis.mov";
        logImportSuccess(462, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00462bis.mov", fileName462);
    } catch (e) {
        logImportError(462, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00462bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess462) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00462.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00463
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile463 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00463.mov");
var editFilePoignees463 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00463_AVEC_POIGNEES.mov");
var editFileBis463 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00463bis.mov");

var importSuccess463 = false;
var fileName463 = "";

// Tenter import standard
if (editFile463.exists) {
    try {
        var editFootage463 = project.importFile(new ImportOptions(editFile463));
        editFootage463.parentFolder = fromEditFolder;
        editFootage463.name = "UNDLM_00463";
        editSources[463] = editFootage463;
        editImportCount++;
        importSuccess463 = true;
        fileName463 = "UNDLM_00463.mov";
        logImportSuccess(463, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00463.mov", fileName463);
    } catch (e) {
        logImportError(463, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00463.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess463 && editFilePoignees463.exists) {
    try {
        var editFootage463 = project.importFile(new ImportOptions(editFilePoignees463));
        editFootage463.parentFolder = fromEditFolder;
        editFootage463.name = "UNDLM_00463_AVEC_POIGNEES";
        editSources[463] = editFootage463;
        editImportCount++;
        importSuccess463 = true;
        fileName463 = "UNDLM_00463_AVEC_POIGNEES.mov";
        logImportSuccess(463, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00463_AVEC_POIGNEES.mov", fileName463);
    } catch (e) {
        logImportError(463, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00463_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess463 && editFileBis463.exists) {
    try {
        var editFootage463 = project.importFile(new ImportOptions(editFileBis463));
        editFootage463.parentFolder = fromEditFolder;
        editFootage463.name = "UNDLM_00463bis";
        editSources[463] = editFootage463;
        editImportCount++;
        importSuccess463 = true;
        fileName463 = "UNDLM_00463bis.mov";
        logImportSuccess(463, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00463bis.mov", fileName463);
    } catch (e) {
        logImportError(463, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00463bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess463) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00463.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00443
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile443 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00443.mov");
var gradedFilePoignees443 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00443_AVEC_POIGNEES.mov");
var gradedFileBis443 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00443bis.mov");

var gradedImportSuccess443 = false;
var gradedFileName443 = "";

// Tenter import standard
if (gradedFile443.exists) {
    try {
        var gradedFootage443 = project.importFile(new ImportOptions(gradedFile443));
        gradedFootage443.parentFolder = fromGradingFolder;
        gradedFootage443.name = "UNDLM_00443";
        gradingSources[443] = gradedFootage443;
        gradingImportCount++;
        gradedImportSuccess443 = true;
        gradedFileName443 = "UNDLM_00443.mov";
        logImportSuccess(443, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00443.mov", gradedFileName443);
    } catch (e) {
        logImportError(443, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00443.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess443 && gradedFilePoignees443.exists) {
    try {
        var gradedFootage443 = project.importFile(new ImportOptions(gradedFilePoignees443));
        gradedFootage443.parentFolder = fromGradingFolder;
        gradedFootage443.name = "UNDLM_00443_AVEC_POIGNEES";
        gradingSources[443] = gradedFootage443;
        gradingImportCount++;
        gradedImportSuccess443 = true;
        gradedFileName443 = "UNDLM_00443_AVEC_POIGNEES.mov";
        logImportSuccess(443, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00443_AVEC_POIGNEES.mov", gradedFileName443);
    } catch (e) {
        logImportError(443, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00443_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess443 && gradedFileBis443.exists) {
    try {
        var gradedFootage443 = project.importFile(new ImportOptions(gradedFileBis443));
        gradedFootage443.parentFolder = fromGradingFolder;
        gradedFootage443.name = "UNDLM_00443bis";
        gradingSources[443] = gradedFootage443;
        gradingImportCount++;
        gradedImportSuccess443 = true;
        gradedFileName443 = "UNDLM_00443bis.mov";
        logImportSuccess(443, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00443bis.mov", gradedFileName443);
    } catch (e) {
        logImportError(443, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00443bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess443) {
    missingGradingCount++;
}

// Import plan GRADED 00444
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile444 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00444.mov");
var gradedFilePoignees444 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00444_AVEC_POIGNEES.mov");
var gradedFileBis444 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00444bis.mov");

var gradedImportSuccess444 = false;
var gradedFileName444 = "";

// Tenter import standard
if (gradedFile444.exists) {
    try {
        var gradedFootage444 = project.importFile(new ImportOptions(gradedFile444));
        gradedFootage444.parentFolder = fromGradingFolder;
        gradedFootage444.name = "UNDLM_00444";
        gradingSources[444] = gradedFootage444;
        gradingImportCount++;
        gradedImportSuccess444 = true;
        gradedFileName444 = "UNDLM_00444.mov";
        logImportSuccess(444, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00444.mov", gradedFileName444);
    } catch (e) {
        logImportError(444, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00444.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess444 && gradedFilePoignees444.exists) {
    try {
        var gradedFootage444 = project.importFile(new ImportOptions(gradedFilePoignees444));
        gradedFootage444.parentFolder = fromGradingFolder;
        gradedFootage444.name = "UNDLM_00444_AVEC_POIGNEES";
        gradingSources[444] = gradedFootage444;
        gradingImportCount++;
        gradedImportSuccess444 = true;
        gradedFileName444 = "UNDLM_00444_AVEC_POIGNEES.mov";
        logImportSuccess(444, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00444_AVEC_POIGNEES.mov", gradedFileName444);
    } catch (e) {
        logImportError(444, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00444_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess444 && gradedFileBis444.exists) {
    try {
        var gradedFootage444 = project.importFile(new ImportOptions(gradedFileBis444));
        gradedFootage444.parentFolder = fromGradingFolder;
        gradedFootage444.name = "UNDLM_00444bis";
        gradingSources[444] = gradedFootage444;
        gradingImportCount++;
        gradedImportSuccess444 = true;
        gradedFileName444 = "UNDLM_00444bis.mov";
        logImportSuccess(444, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00444bis.mov", gradedFileName444);
    } catch (e) {
        logImportError(444, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00444bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess444) {
    missingGradingCount++;
}

// Import plan GRADED 00445
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile445 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00445.mov");
var gradedFilePoignees445 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00445_AVEC_POIGNEES.mov");
var gradedFileBis445 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00445bis.mov");

var gradedImportSuccess445 = false;
var gradedFileName445 = "";

// Tenter import standard
if (gradedFile445.exists) {
    try {
        var gradedFootage445 = project.importFile(new ImportOptions(gradedFile445));
        gradedFootage445.parentFolder = fromGradingFolder;
        gradedFootage445.name = "UNDLM_00445";
        gradingSources[445] = gradedFootage445;
        gradingImportCount++;
        gradedImportSuccess445 = true;
        gradedFileName445 = "UNDLM_00445.mov";
        logImportSuccess(445, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00445.mov", gradedFileName445);
    } catch (e) {
        logImportError(445, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00445.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess445 && gradedFilePoignees445.exists) {
    try {
        var gradedFootage445 = project.importFile(new ImportOptions(gradedFilePoignees445));
        gradedFootage445.parentFolder = fromGradingFolder;
        gradedFootage445.name = "UNDLM_00445_AVEC_POIGNEES";
        gradingSources[445] = gradedFootage445;
        gradingImportCount++;
        gradedImportSuccess445 = true;
        gradedFileName445 = "UNDLM_00445_AVEC_POIGNEES.mov";
        logImportSuccess(445, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00445_AVEC_POIGNEES.mov", gradedFileName445);
    } catch (e) {
        logImportError(445, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00445_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess445 && gradedFileBis445.exists) {
    try {
        var gradedFootage445 = project.importFile(new ImportOptions(gradedFileBis445));
        gradedFootage445.parentFolder = fromGradingFolder;
        gradedFootage445.name = "UNDLM_00445bis";
        gradingSources[445] = gradedFootage445;
        gradingImportCount++;
        gradedImportSuccess445 = true;
        gradedFileName445 = "UNDLM_00445bis.mov";
        logImportSuccess(445, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00445bis.mov", gradedFileName445);
    } catch (e) {
        logImportError(445, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00445bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess445) {
    missingGradingCount++;
}

// Import plan GRADED 00446
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile446 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00446.mov");
var gradedFilePoignees446 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00446_AVEC_POIGNEES.mov");
var gradedFileBis446 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00446bis.mov");

var gradedImportSuccess446 = false;
var gradedFileName446 = "";

// Tenter import standard
if (gradedFile446.exists) {
    try {
        var gradedFootage446 = project.importFile(new ImportOptions(gradedFile446));
        gradedFootage446.parentFolder = fromGradingFolder;
        gradedFootage446.name = "UNDLM_00446";
        gradingSources[446] = gradedFootage446;
        gradingImportCount++;
        gradedImportSuccess446 = true;
        gradedFileName446 = "UNDLM_00446.mov";
        logImportSuccess(446, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00446.mov", gradedFileName446);
    } catch (e) {
        logImportError(446, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00446.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess446 && gradedFilePoignees446.exists) {
    try {
        var gradedFootage446 = project.importFile(new ImportOptions(gradedFilePoignees446));
        gradedFootage446.parentFolder = fromGradingFolder;
        gradedFootage446.name = "UNDLM_00446_AVEC_POIGNEES";
        gradingSources[446] = gradedFootage446;
        gradingImportCount++;
        gradedImportSuccess446 = true;
        gradedFileName446 = "UNDLM_00446_AVEC_POIGNEES.mov";
        logImportSuccess(446, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00446_AVEC_POIGNEES.mov", gradedFileName446);
    } catch (e) {
        logImportError(446, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00446_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess446 && gradedFileBis446.exists) {
    try {
        var gradedFootage446 = project.importFile(new ImportOptions(gradedFileBis446));
        gradedFootage446.parentFolder = fromGradingFolder;
        gradedFootage446.name = "UNDLM_00446bis";
        gradingSources[446] = gradedFootage446;
        gradingImportCount++;
        gradedImportSuccess446 = true;
        gradedFileName446 = "UNDLM_00446bis.mov";
        logImportSuccess(446, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00446bis.mov", gradedFileName446);
    } catch (e) {
        logImportError(446, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00446bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess446) {
    missingGradingCount++;
}

// Import plan GRADED 00447
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile447 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00447.mov");
var gradedFilePoignees447 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00447_AVEC_POIGNEES.mov");
var gradedFileBis447 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00447bis.mov");

var gradedImportSuccess447 = false;
var gradedFileName447 = "";

// Tenter import standard
if (gradedFile447.exists) {
    try {
        var gradedFootage447 = project.importFile(new ImportOptions(gradedFile447));
        gradedFootage447.parentFolder = fromGradingFolder;
        gradedFootage447.name = "UNDLM_00447";
        gradingSources[447] = gradedFootage447;
        gradingImportCount++;
        gradedImportSuccess447 = true;
        gradedFileName447 = "UNDLM_00447.mov";
        logImportSuccess(447, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00447.mov", gradedFileName447);
    } catch (e) {
        logImportError(447, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00447.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess447 && gradedFilePoignees447.exists) {
    try {
        var gradedFootage447 = project.importFile(new ImportOptions(gradedFilePoignees447));
        gradedFootage447.parentFolder = fromGradingFolder;
        gradedFootage447.name = "UNDLM_00447_AVEC_POIGNEES";
        gradingSources[447] = gradedFootage447;
        gradingImportCount++;
        gradedImportSuccess447 = true;
        gradedFileName447 = "UNDLM_00447_AVEC_POIGNEES.mov";
        logImportSuccess(447, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00447_AVEC_POIGNEES.mov", gradedFileName447);
    } catch (e) {
        logImportError(447, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00447_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess447 && gradedFileBis447.exists) {
    try {
        var gradedFootage447 = project.importFile(new ImportOptions(gradedFileBis447));
        gradedFootage447.parentFolder = fromGradingFolder;
        gradedFootage447.name = "UNDLM_00447bis";
        gradingSources[447] = gradedFootage447;
        gradingImportCount++;
        gradedImportSuccess447 = true;
        gradedFileName447 = "UNDLM_00447bis.mov";
        logImportSuccess(447, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00447bis.mov", gradedFileName447);
    } catch (e) {
        logImportError(447, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00447bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess447) {
    missingGradingCount++;
}

// Import plan GRADED 00449
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile449 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00449.mov");
var gradedFilePoignees449 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00449_AVEC_POIGNEES.mov");
var gradedFileBis449 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00449bis.mov");

var gradedImportSuccess449 = false;
var gradedFileName449 = "";

// Tenter import standard
if (gradedFile449.exists) {
    try {
        var gradedFootage449 = project.importFile(new ImportOptions(gradedFile449));
        gradedFootage449.parentFolder = fromGradingFolder;
        gradedFootage449.name = "UNDLM_00449";
        gradingSources[449] = gradedFootage449;
        gradingImportCount++;
        gradedImportSuccess449 = true;
        gradedFileName449 = "UNDLM_00449.mov";
        logImportSuccess(449, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00449.mov", gradedFileName449);
    } catch (e) {
        logImportError(449, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00449.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess449 && gradedFilePoignees449.exists) {
    try {
        var gradedFootage449 = project.importFile(new ImportOptions(gradedFilePoignees449));
        gradedFootage449.parentFolder = fromGradingFolder;
        gradedFootage449.name = "UNDLM_00449_AVEC_POIGNEES";
        gradingSources[449] = gradedFootage449;
        gradingImportCount++;
        gradedImportSuccess449 = true;
        gradedFileName449 = "UNDLM_00449_AVEC_POIGNEES.mov";
        logImportSuccess(449, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00449_AVEC_POIGNEES.mov", gradedFileName449);
    } catch (e) {
        logImportError(449, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00449_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess449 && gradedFileBis449.exists) {
    try {
        var gradedFootage449 = project.importFile(new ImportOptions(gradedFileBis449));
        gradedFootage449.parentFolder = fromGradingFolder;
        gradedFootage449.name = "UNDLM_00449bis";
        gradingSources[449] = gradedFootage449;
        gradingImportCount++;
        gradedImportSuccess449 = true;
        gradedFileName449 = "UNDLM_00449bis.mov";
        logImportSuccess(449, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00449bis.mov", gradedFileName449);
    } catch (e) {
        logImportError(449, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00449bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess449) {
    missingGradingCount++;
}

// Import plan GRADED 00450
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile450 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00450.mov");
var gradedFilePoignees450 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00450_AVEC_POIGNEES.mov");
var gradedFileBis450 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00450bis.mov");

var gradedImportSuccess450 = false;
var gradedFileName450 = "";

// Tenter import standard
if (gradedFile450.exists) {
    try {
        var gradedFootage450 = project.importFile(new ImportOptions(gradedFile450));
        gradedFootage450.parentFolder = fromGradingFolder;
        gradedFootage450.name = "UNDLM_00450";
        gradingSources[450] = gradedFootage450;
        gradingImportCount++;
        gradedImportSuccess450 = true;
        gradedFileName450 = "UNDLM_00450.mov";
        logImportSuccess(450, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00450.mov", gradedFileName450);
    } catch (e) {
        logImportError(450, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00450.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess450 && gradedFilePoignees450.exists) {
    try {
        var gradedFootage450 = project.importFile(new ImportOptions(gradedFilePoignees450));
        gradedFootage450.parentFolder = fromGradingFolder;
        gradedFootage450.name = "UNDLM_00450_AVEC_POIGNEES";
        gradingSources[450] = gradedFootage450;
        gradingImportCount++;
        gradedImportSuccess450 = true;
        gradedFileName450 = "UNDLM_00450_AVEC_POIGNEES.mov";
        logImportSuccess(450, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00450_AVEC_POIGNEES.mov", gradedFileName450);
    } catch (e) {
        logImportError(450, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00450_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess450 && gradedFileBis450.exists) {
    try {
        var gradedFootage450 = project.importFile(new ImportOptions(gradedFileBis450));
        gradedFootage450.parentFolder = fromGradingFolder;
        gradedFootage450.name = "UNDLM_00450bis";
        gradingSources[450] = gradedFootage450;
        gradingImportCount++;
        gradedImportSuccess450 = true;
        gradedFileName450 = "UNDLM_00450bis.mov";
        logImportSuccess(450, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00450bis.mov", gradedFileName450);
    } catch (e) {
        logImportError(450, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00450bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess450) {
    missingGradingCount++;
}

// Import plan GRADED 00452
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile452 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00452.mov");
var gradedFilePoignees452 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00452_AVEC_POIGNEES.mov");
var gradedFileBis452 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00452bis.mov");

var gradedImportSuccess452 = false;
var gradedFileName452 = "";

// Tenter import standard
if (gradedFile452.exists) {
    try {
        var gradedFootage452 = project.importFile(new ImportOptions(gradedFile452));
        gradedFootage452.parentFolder = fromGradingFolder;
        gradedFootage452.name = "UNDLM_00452";
        gradingSources[452] = gradedFootage452;
        gradingImportCount++;
        gradedImportSuccess452 = true;
        gradedFileName452 = "UNDLM_00452.mov";
        logImportSuccess(452, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00452.mov", gradedFileName452);
    } catch (e) {
        logImportError(452, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00452.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess452 && gradedFilePoignees452.exists) {
    try {
        var gradedFootage452 = project.importFile(new ImportOptions(gradedFilePoignees452));
        gradedFootage452.parentFolder = fromGradingFolder;
        gradedFootage452.name = "UNDLM_00452_AVEC_POIGNEES";
        gradingSources[452] = gradedFootage452;
        gradingImportCount++;
        gradedImportSuccess452 = true;
        gradedFileName452 = "UNDLM_00452_AVEC_POIGNEES.mov";
        logImportSuccess(452, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00452_AVEC_POIGNEES.mov", gradedFileName452);
    } catch (e) {
        logImportError(452, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00452_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess452 && gradedFileBis452.exists) {
    try {
        var gradedFootage452 = project.importFile(new ImportOptions(gradedFileBis452));
        gradedFootage452.parentFolder = fromGradingFolder;
        gradedFootage452.name = "UNDLM_00452bis";
        gradingSources[452] = gradedFootage452;
        gradingImportCount++;
        gradedImportSuccess452 = true;
        gradedFileName452 = "UNDLM_00452bis.mov";
        logImportSuccess(452, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00452bis.mov", gradedFileName452);
    } catch (e) {
        logImportError(452, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00452bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess452) {
    missingGradingCount++;
}

// Import plan GRADED 00454
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile454 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00454.mov");
var gradedFilePoignees454 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00454_AVEC_POIGNEES.mov");
var gradedFileBis454 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00454bis.mov");

var gradedImportSuccess454 = false;
var gradedFileName454 = "";

// Tenter import standard
if (gradedFile454.exists) {
    try {
        var gradedFootage454 = project.importFile(new ImportOptions(gradedFile454));
        gradedFootage454.parentFolder = fromGradingFolder;
        gradedFootage454.name = "UNDLM_00454";
        gradingSources[454] = gradedFootage454;
        gradingImportCount++;
        gradedImportSuccess454 = true;
        gradedFileName454 = "UNDLM_00454.mov";
        logImportSuccess(454, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00454.mov", gradedFileName454);
    } catch (e) {
        logImportError(454, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00454.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess454 && gradedFilePoignees454.exists) {
    try {
        var gradedFootage454 = project.importFile(new ImportOptions(gradedFilePoignees454));
        gradedFootage454.parentFolder = fromGradingFolder;
        gradedFootage454.name = "UNDLM_00454_AVEC_POIGNEES";
        gradingSources[454] = gradedFootage454;
        gradingImportCount++;
        gradedImportSuccess454 = true;
        gradedFileName454 = "UNDLM_00454_AVEC_POIGNEES.mov";
        logImportSuccess(454, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00454_AVEC_POIGNEES.mov", gradedFileName454);
    } catch (e) {
        logImportError(454, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00454_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess454 && gradedFileBis454.exists) {
    try {
        var gradedFootage454 = project.importFile(new ImportOptions(gradedFileBis454));
        gradedFootage454.parentFolder = fromGradingFolder;
        gradedFootage454.name = "UNDLM_00454bis";
        gradingSources[454] = gradedFootage454;
        gradingImportCount++;
        gradedImportSuccess454 = true;
        gradedFileName454 = "UNDLM_00454bis.mov";
        logImportSuccess(454, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00454bis.mov", gradedFileName454);
    } catch (e) {
        logImportError(454, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00454bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess454) {
    missingGradingCount++;
}

// Import plan GRADED 00455
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile455 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00455.mov");
var gradedFilePoignees455 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00455_AVEC_POIGNEES.mov");
var gradedFileBis455 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00455bis.mov");

var gradedImportSuccess455 = false;
var gradedFileName455 = "";

// Tenter import standard
if (gradedFile455.exists) {
    try {
        var gradedFootage455 = project.importFile(new ImportOptions(gradedFile455));
        gradedFootage455.parentFolder = fromGradingFolder;
        gradedFootage455.name = "UNDLM_00455";
        gradingSources[455] = gradedFootage455;
        gradingImportCount++;
        gradedImportSuccess455 = true;
        gradedFileName455 = "UNDLM_00455.mov";
        logImportSuccess(455, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00455.mov", gradedFileName455);
    } catch (e) {
        logImportError(455, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00455.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess455 && gradedFilePoignees455.exists) {
    try {
        var gradedFootage455 = project.importFile(new ImportOptions(gradedFilePoignees455));
        gradedFootage455.parentFolder = fromGradingFolder;
        gradedFootage455.name = "UNDLM_00455_AVEC_POIGNEES";
        gradingSources[455] = gradedFootage455;
        gradingImportCount++;
        gradedImportSuccess455 = true;
        gradedFileName455 = "UNDLM_00455_AVEC_POIGNEES.mov";
        logImportSuccess(455, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00455_AVEC_POIGNEES.mov", gradedFileName455);
    } catch (e) {
        logImportError(455, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00455_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess455 && gradedFileBis455.exists) {
    try {
        var gradedFootage455 = project.importFile(new ImportOptions(gradedFileBis455));
        gradedFootage455.parentFolder = fromGradingFolder;
        gradedFootage455.name = "UNDLM_00455bis";
        gradingSources[455] = gradedFootage455;
        gradingImportCount++;
        gradedImportSuccess455 = true;
        gradedFileName455 = "UNDLM_00455bis.mov";
        logImportSuccess(455, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00455bis.mov", gradedFileName455);
    } catch (e) {
        logImportError(455, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00455bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess455) {
    missingGradingCount++;
}

// Import plan GRADED 00456
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile456 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00456.mov");
var gradedFilePoignees456 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00456_AVEC_POIGNEES.mov");
var gradedFileBis456 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00456bis.mov");

var gradedImportSuccess456 = false;
var gradedFileName456 = "";

// Tenter import standard
if (gradedFile456.exists) {
    try {
        var gradedFootage456 = project.importFile(new ImportOptions(gradedFile456));
        gradedFootage456.parentFolder = fromGradingFolder;
        gradedFootage456.name = "UNDLM_00456";
        gradingSources[456] = gradedFootage456;
        gradingImportCount++;
        gradedImportSuccess456 = true;
        gradedFileName456 = "UNDLM_00456.mov";
        logImportSuccess(456, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00456.mov", gradedFileName456);
    } catch (e) {
        logImportError(456, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00456.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess456 && gradedFilePoignees456.exists) {
    try {
        var gradedFootage456 = project.importFile(new ImportOptions(gradedFilePoignees456));
        gradedFootage456.parentFolder = fromGradingFolder;
        gradedFootage456.name = "UNDLM_00456_AVEC_POIGNEES";
        gradingSources[456] = gradedFootage456;
        gradingImportCount++;
        gradedImportSuccess456 = true;
        gradedFileName456 = "UNDLM_00456_AVEC_POIGNEES.mov";
        logImportSuccess(456, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00456_AVEC_POIGNEES.mov", gradedFileName456);
    } catch (e) {
        logImportError(456, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00456_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess456 && gradedFileBis456.exists) {
    try {
        var gradedFootage456 = project.importFile(new ImportOptions(gradedFileBis456));
        gradedFootage456.parentFolder = fromGradingFolder;
        gradedFootage456.name = "UNDLM_00456bis";
        gradingSources[456] = gradedFootage456;
        gradingImportCount++;
        gradedImportSuccess456 = true;
        gradedFileName456 = "UNDLM_00456bis.mov";
        logImportSuccess(456, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00456bis.mov", gradedFileName456);
    } catch (e) {
        logImportError(456, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00456bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess456) {
    missingGradingCount++;
}

// Import plan GRADED 00457
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile457 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00457.mov");
var gradedFilePoignees457 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00457_AVEC_POIGNEES.mov");
var gradedFileBis457 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00457bis.mov");

var gradedImportSuccess457 = false;
var gradedFileName457 = "";

// Tenter import standard
if (gradedFile457.exists) {
    try {
        var gradedFootage457 = project.importFile(new ImportOptions(gradedFile457));
        gradedFootage457.parentFolder = fromGradingFolder;
        gradedFootage457.name = "UNDLM_00457";
        gradingSources[457] = gradedFootage457;
        gradingImportCount++;
        gradedImportSuccess457 = true;
        gradedFileName457 = "UNDLM_00457.mov";
        logImportSuccess(457, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00457.mov", gradedFileName457);
    } catch (e) {
        logImportError(457, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00457.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess457 && gradedFilePoignees457.exists) {
    try {
        var gradedFootage457 = project.importFile(new ImportOptions(gradedFilePoignees457));
        gradedFootage457.parentFolder = fromGradingFolder;
        gradedFootage457.name = "UNDLM_00457_AVEC_POIGNEES";
        gradingSources[457] = gradedFootage457;
        gradingImportCount++;
        gradedImportSuccess457 = true;
        gradedFileName457 = "UNDLM_00457_AVEC_POIGNEES.mov";
        logImportSuccess(457, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00457_AVEC_POIGNEES.mov", gradedFileName457);
    } catch (e) {
        logImportError(457, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00457_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess457 && gradedFileBis457.exists) {
    try {
        var gradedFootage457 = project.importFile(new ImportOptions(gradedFileBis457));
        gradedFootage457.parentFolder = fromGradingFolder;
        gradedFootage457.name = "UNDLM_00457bis";
        gradingSources[457] = gradedFootage457;
        gradingImportCount++;
        gradedImportSuccess457 = true;
        gradedFileName457 = "UNDLM_00457bis.mov";
        logImportSuccess(457, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00457bis.mov", gradedFileName457);
    } catch (e) {
        logImportError(457, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00457bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess457) {
    missingGradingCount++;
}

// Import plan GRADED 00458
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile458 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00458.mov");
var gradedFilePoignees458 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00458_AVEC_POIGNEES.mov");
var gradedFileBis458 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00458bis.mov");

var gradedImportSuccess458 = false;
var gradedFileName458 = "";

// Tenter import standard
if (gradedFile458.exists) {
    try {
        var gradedFootage458 = project.importFile(new ImportOptions(gradedFile458));
        gradedFootage458.parentFolder = fromGradingFolder;
        gradedFootage458.name = "UNDLM_00458";
        gradingSources[458] = gradedFootage458;
        gradingImportCount++;
        gradedImportSuccess458 = true;
        gradedFileName458 = "UNDLM_00458.mov";
        logImportSuccess(458, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00458.mov", gradedFileName458);
    } catch (e) {
        logImportError(458, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00458.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess458 && gradedFilePoignees458.exists) {
    try {
        var gradedFootage458 = project.importFile(new ImportOptions(gradedFilePoignees458));
        gradedFootage458.parentFolder = fromGradingFolder;
        gradedFootage458.name = "UNDLM_00458_AVEC_POIGNEES";
        gradingSources[458] = gradedFootage458;
        gradingImportCount++;
        gradedImportSuccess458 = true;
        gradedFileName458 = "UNDLM_00458_AVEC_POIGNEES.mov";
        logImportSuccess(458, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00458_AVEC_POIGNEES.mov", gradedFileName458);
    } catch (e) {
        logImportError(458, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00458_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess458 && gradedFileBis458.exists) {
    try {
        var gradedFootage458 = project.importFile(new ImportOptions(gradedFileBis458));
        gradedFootage458.parentFolder = fromGradingFolder;
        gradedFootage458.name = "UNDLM_00458bis";
        gradingSources[458] = gradedFootage458;
        gradingImportCount++;
        gradedImportSuccess458 = true;
        gradedFileName458 = "UNDLM_00458bis.mov";
        logImportSuccess(458, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00458bis.mov", gradedFileName458);
    } catch (e) {
        logImportError(458, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00458bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess458) {
    missingGradingCount++;
}

// Import plan GRADED 00459
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile459 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00459.mov");
var gradedFilePoignees459 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00459_AVEC_POIGNEES.mov");
var gradedFileBis459 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00459bis.mov");

var gradedImportSuccess459 = false;
var gradedFileName459 = "";

// Tenter import standard
if (gradedFile459.exists) {
    try {
        var gradedFootage459 = project.importFile(new ImportOptions(gradedFile459));
        gradedFootage459.parentFolder = fromGradingFolder;
        gradedFootage459.name = "UNDLM_00459";
        gradingSources[459] = gradedFootage459;
        gradingImportCount++;
        gradedImportSuccess459 = true;
        gradedFileName459 = "UNDLM_00459.mov";
        logImportSuccess(459, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00459.mov", gradedFileName459);
    } catch (e) {
        logImportError(459, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00459.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess459 && gradedFilePoignees459.exists) {
    try {
        var gradedFootage459 = project.importFile(new ImportOptions(gradedFilePoignees459));
        gradedFootage459.parentFolder = fromGradingFolder;
        gradedFootage459.name = "UNDLM_00459_AVEC_POIGNEES";
        gradingSources[459] = gradedFootage459;
        gradingImportCount++;
        gradedImportSuccess459 = true;
        gradedFileName459 = "UNDLM_00459_AVEC_POIGNEES.mov";
        logImportSuccess(459, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00459_AVEC_POIGNEES.mov", gradedFileName459);
    } catch (e) {
        logImportError(459, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00459_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess459 && gradedFileBis459.exists) {
    try {
        var gradedFootage459 = project.importFile(new ImportOptions(gradedFileBis459));
        gradedFootage459.parentFolder = fromGradingFolder;
        gradedFootage459.name = "UNDLM_00459bis";
        gradingSources[459] = gradedFootage459;
        gradingImportCount++;
        gradedImportSuccess459 = true;
        gradedFileName459 = "UNDLM_00459bis.mov";
        logImportSuccess(459, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00459bis.mov", gradedFileName459);
    } catch (e) {
        logImportError(459, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00459bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess459) {
    missingGradingCount++;
}

// Import plan GRADED 00460
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile460 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00460.mov");
var gradedFilePoignees460 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00460_AVEC_POIGNEES.mov");
var gradedFileBis460 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00460bis.mov");

var gradedImportSuccess460 = false;
var gradedFileName460 = "";

// Tenter import standard
if (gradedFile460.exists) {
    try {
        var gradedFootage460 = project.importFile(new ImportOptions(gradedFile460));
        gradedFootage460.parentFolder = fromGradingFolder;
        gradedFootage460.name = "UNDLM_00460";
        gradingSources[460] = gradedFootage460;
        gradingImportCount++;
        gradedImportSuccess460 = true;
        gradedFileName460 = "UNDLM_00460.mov";
        logImportSuccess(460, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00460.mov", gradedFileName460);
    } catch (e) {
        logImportError(460, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00460.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess460 && gradedFilePoignees460.exists) {
    try {
        var gradedFootage460 = project.importFile(new ImportOptions(gradedFilePoignees460));
        gradedFootage460.parentFolder = fromGradingFolder;
        gradedFootage460.name = "UNDLM_00460_AVEC_POIGNEES";
        gradingSources[460] = gradedFootage460;
        gradingImportCount++;
        gradedImportSuccess460 = true;
        gradedFileName460 = "UNDLM_00460_AVEC_POIGNEES.mov";
        logImportSuccess(460, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00460_AVEC_POIGNEES.mov", gradedFileName460);
    } catch (e) {
        logImportError(460, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00460_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess460 && gradedFileBis460.exists) {
    try {
        var gradedFootage460 = project.importFile(new ImportOptions(gradedFileBis460));
        gradedFootage460.parentFolder = fromGradingFolder;
        gradedFootage460.name = "UNDLM_00460bis";
        gradingSources[460] = gradedFootage460;
        gradingImportCount++;
        gradedImportSuccess460 = true;
        gradedFileName460 = "UNDLM_00460bis.mov";
        logImportSuccess(460, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00460bis.mov", gradedFileName460);
    } catch (e) {
        logImportError(460, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00460bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess460) {
    missingGradingCount++;
}

// Import plan GRADED 00461
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile461 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00461.mov");
var gradedFilePoignees461 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00461_AVEC_POIGNEES.mov");
var gradedFileBis461 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00461bis.mov");

var gradedImportSuccess461 = false;
var gradedFileName461 = "";

// Tenter import standard
if (gradedFile461.exists) {
    try {
        var gradedFootage461 = project.importFile(new ImportOptions(gradedFile461));
        gradedFootage461.parentFolder = fromGradingFolder;
        gradedFootage461.name = "UNDLM_00461";
        gradingSources[461] = gradedFootage461;
        gradingImportCount++;
        gradedImportSuccess461 = true;
        gradedFileName461 = "UNDLM_00461.mov";
        logImportSuccess(461, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00461.mov", gradedFileName461);
    } catch (e) {
        logImportError(461, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00461.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess461 && gradedFilePoignees461.exists) {
    try {
        var gradedFootage461 = project.importFile(new ImportOptions(gradedFilePoignees461));
        gradedFootage461.parentFolder = fromGradingFolder;
        gradedFootage461.name = "UNDLM_00461_AVEC_POIGNEES";
        gradingSources[461] = gradedFootage461;
        gradingImportCount++;
        gradedImportSuccess461 = true;
        gradedFileName461 = "UNDLM_00461_AVEC_POIGNEES.mov";
        logImportSuccess(461, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00461_AVEC_POIGNEES.mov", gradedFileName461);
    } catch (e) {
        logImportError(461, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00461_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess461 && gradedFileBis461.exists) {
    try {
        var gradedFootage461 = project.importFile(new ImportOptions(gradedFileBis461));
        gradedFootage461.parentFolder = fromGradingFolder;
        gradedFootage461.name = "UNDLM_00461bis";
        gradingSources[461] = gradedFootage461;
        gradingImportCount++;
        gradedImportSuccess461 = true;
        gradedFileName461 = "UNDLM_00461bis.mov";
        logImportSuccess(461, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00461bis.mov", gradedFileName461);
    } catch (e) {
        logImportError(461, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00461bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess461) {
    missingGradingCount++;
}

// Import plan GRADED 00462
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile462 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00462.mov");
var gradedFilePoignees462 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00462_AVEC_POIGNEES.mov");
var gradedFileBis462 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00462bis.mov");

var gradedImportSuccess462 = false;
var gradedFileName462 = "";

// Tenter import standard
if (gradedFile462.exists) {
    try {
        var gradedFootage462 = project.importFile(new ImportOptions(gradedFile462));
        gradedFootage462.parentFolder = fromGradingFolder;
        gradedFootage462.name = "UNDLM_00462";
        gradingSources[462] = gradedFootage462;
        gradingImportCount++;
        gradedImportSuccess462 = true;
        gradedFileName462 = "UNDLM_00462.mov";
        logImportSuccess(462, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00462.mov", gradedFileName462);
    } catch (e) {
        logImportError(462, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00462.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess462 && gradedFilePoignees462.exists) {
    try {
        var gradedFootage462 = project.importFile(new ImportOptions(gradedFilePoignees462));
        gradedFootage462.parentFolder = fromGradingFolder;
        gradedFootage462.name = "UNDLM_00462_AVEC_POIGNEES";
        gradingSources[462] = gradedFootage462;
        gradingImportCount++;
        gradedImportSuccess462 = true;
        gradedFileName462 = "UNDLM_00462_AVEC_POIGNEES.mov";
        logImportSuccess(462, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00462_AVEC_POIGNEES.mov", gradedFileName462);
    } catch (e) {
        logImportError(462, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00462_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess462 && gradedFileBis462.exists) {
    try {
        var gradedFootage462 = project.importFile(new ImportOptions(gradedFileBis462));
        gradedFootage462.parentFolder = fromGradingFolder;
        gradedFootage462.name = "UNDLM_00462bis";
        gradingSources[462] = gradedFootage462;
        gradingImportCount++;
        gradedImportSuccess462 = true;
        gradedFileName462 = "UNDLM_00462bis.mov";
        logImportSuccess(462, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00462bis.mov", gradedFileName462);
    } catch (e) {
        logImportError(462, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00462bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess462) {
    missingGradingCount++;
}

// Import plan GRADED 00463
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile463 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00463.mov");
var gradedFilePoignees463 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00463_AVEC_POIGNEES.mov");
var gradedFileBis463 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00463bis.mov");

var gradedImportSuccess463 = false;
var gradedFileName463 = "";

// Tenter import standard
if (gradedFile463.exists) {
    try {
        var gradedFootage463 = project.importFile(new ImportOptions(gradedFile463));
        gradedFootage463.parentFolder = fromGradingFolder;
        gradedFootage463.name = "UNDLM_00463";
        gradingSources[463] = gradedFootage463;
        gradingImportCount++;
        gradedImportSuccess463 = true;
        gradedFileName463 = "UNDLM_00463.mov";
        logImportSuccess(463, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00463.mov", gradedFileName463);
    } catch (e) {
        logImportError(463, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00463.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess463 && gradedFilePoignees463.exists) {
    try {
        var gradedFootage463 = project.importFile(new ImportOptions(gradedFilePoignees463));
        gradedFootage463.parentFolder = fromGradingFolder;
        gradedFootage463.name = "UNDLM_00463_AVEC_POIGNEES";
        gradingSources[463] = gradedFootage463;
        gradingImportCount++;
        gradedImportSuccess463 = true;
        gradedFileName463 = "UNDLM_00463_AVEC_POIGNEES.mov";
        logImportSuccess(463, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00463_AVEC_POIGNEES.mov", gradedFileName463);
    } catch (e) {
        logImportError(463, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00463_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess463 && gradedFileBis463.exists) {
    try {
        var gradedFootage463 = project.importFile(new ImportOptions(gradedFileBis463));
        gradedFootage463.parentFolder = fromGradingFolder;
        gradedFootage463.name = "UNDLM_00463bis";
        gradingSources[463] = gradedFootage463;
        gradingImportCount++;
        gradedImportSuccess463 = true;
        gradedFileName463 = "UNDLM_00463bis.mov";
        logImportSuccess(463, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00463bis.mov", gradedFileName463);
    } catch (e) {
        logImportError(463, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00463bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess463) {
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


// Composition pour plan 00443
var planComp443 = project.items.addComp(
    "SQ25_UNDLM_00443_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp443.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer443 = planComp443.layers.add(bgSolidComp);
bgLayer443.name = "BG_SOLID";
bgLayer443.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer443 = false;
if (gradingSources[443]) {
    var gradedLayer443 = planComp443.layers.add(gradingSources[443]);
    gradedLayer443.name = "UNDLM_00443_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer443.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer443.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer443 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer443 = false;
if (editSources[443]) {
    var editLayer443 = planComp443.layers.add(editSources[443]);
    editLayer443.name = "UNDLM_00443_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer443.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer443.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer443 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity443 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer443) {
    // EDIT toujours activé quand disponible
    editLayer443.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer443) {
        gradedLayer443.enabled = false;
    }
} else if (hasGradedLayer443) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer443.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText443 = planComp443.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText443.name = "WARNING_NO_EDIT";
    warningText443.property("Transform").property("Position").setValue([1280, 200]);
    warningText443.guideLayer = true;
    
    var warningTextDoc443 = warningText443.property("Source Text").value;
    warningTextDoc443.fontSize = 32;
    warningTextDoc443.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc443.font = "Arial-BoldMT";
    warningTextDoc443.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText443.property("Source Text").setValue(warningTextDoc443);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText443 = planComp443.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00443");
    errorText443.name = "ERROR_NO_SOURCE";
    errorText443.property("Transform").property("Position").setValue([1280, 720]);
    errorText443.guideLayer = true;
    
    var errorTextDoc443 = errorText443.property("Source Text").value;
    errorTextDoc443.fontSize = 48;
    errorTextDoc443.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc443.font = "Arial-BoldMT";
    errorTextDoc443.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText443.property("Source Text").setValue(errorTextDoc443);
}

planCompositions[443] = planComp443;


// Composition pour plan 00444
var planComp444 = project.items.addComp(
    "SQ25_UNDLM_00444_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp444.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer444 = planComp444.layers.add(bgSolidComp);
bgLayer444.name = "BG_SOLID";
bgLayer444.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer444 = false;
if (gradingSources[444]) {
    var gradedLayer444 = planComp444.layers.add(gradingSources[444]);
    gradedLayer444.name = "UNDLM_00444_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer444.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer444.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer444 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer444 = false;
if (editSources[444]) {
    var editLayer444 = planComp444.layers.add(editSources[444]);
    editLayer444.name = "UNDLM_00444_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer444.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer444.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer444 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity444 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer444) {
    // EDIT toujours activé quand disponible
    editLayer444.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer444) {
        gradedLayer444.enabled = false;
    }
} else if (hasGradedLayer444) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer444.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText444 = planComp444.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText444.name = "WARNING_NO_EDIT";
    warningText444.property("Transform").property("Position").setValue([1280, 200]);
    warningText444.guideLayer = true;
    
    var warningTextDoc444 = warningText444.property("Source Text").value;
    warningTextDoc444.fontSize = 32;
    warningTextDoc444.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc444.font = "Arial-BoldMT";
    warningTextDoc444.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText444.property("Source Text").setValue(warningTextDoc444);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText444 = planComp444.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00444");
    errorText444.name = "ERROR_NO_SOURCE";
    errorText444.property("Transform").property("Position").setValue([1280, 720]);
    errorText444.guideLayer = true;
    
    var errorTextDoc444 = errorText444.property("Source Text").value;
    errorTextDoc444.fontSize = 48;
    errorTextDoc444.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc444.font = "Arial-BoldMT";
    errorTextDoc444.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText444.property("Source Text").setValue(errorTextDoc444);
}

planCompositions[444] = planComp444;


// Composition pour plan 00445
var planComp445 = project.items.addComp(
    "SQ25_UNDLM_00445_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp445.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer445 = planComp445.layers.add(bgSolidComp);
bgLayer445.name = "BG_SOLID";
bgLayer445.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer445 = false;
if (gradingSources[445]) {
    var gradedLayer445 = planComp445.layers.add(gradingSources[445]);
    gradedLayer445.name = "UNDLM_00445_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer445.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer445.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer445 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer445 = false;
if (editSources[445]) {
    var editLayer445 = planComp445.layers.add(editSources[445]);
    editLayer445.name = "UNDLM_00445_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer445.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer445.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer445 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity445 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer445) {
    // EDIT toujours activé quand disponible
    editLayer445.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer445) {
        gradedLayer445.enabled = false;
    }
} else if (hasGradedLayer445) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer445.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText445 = planComp445.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText445.name = "WARNING_NO_EDIT";
    warningText445.property("Transform").property("Position").setValue([1280, 200]);
    warningText445.guideLayer = true;
    
    var warningTextDoc445 = warningText445.property("Source Text").value;
    warningTextDoc445.fontSize = 32;
    warningTextDoc445.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc445.font = "Arial-BoldMT";
    warningTextDoc445.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText445.property("Source Text").setValue(warningTextDoc445);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText445 = planComp445.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00445");
    errorText445.name = "ERROR_NO_SOURCE";
    errorText445.property("Transform").property("Position").setValue([1280, 720]);
    errorText445.guideLayer = true;
    
    var errorTextDoc445 = errorText445.property("Source Text").value;
    errorTextDoc445.fontSize = 48;
    errorTextDoc445.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc445.font = "Arial-BoldMT";
    errorTextDoc445.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText445.property("Source Text").setValue(errorTextDoc445);
}

planCompositions[445] = planComp445;


// Composition pour plan 00446
var planComp446 = project.items.addComp(
    "SQ25_UNDLM_00446_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.32,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp446.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer446 = planComp446.layers.add(bgSolidComp);
bgLayer446.name = "BG_SOLID";
bgLayer446.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer446 = false;
if (gradingSources[446]) {
    var gradedLayer446 = planComp446.layers.add(gradingSources[446]);
    gradedLayer446.name = "UNDLM_00446_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer446.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer446.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer446 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer446 = false;
if (editSources[446]) {
    var editLayer446 = planComp446.layers.add(editSources[446]);
    editLayer446.name = "UNDLM_00446_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer446.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer446.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer446 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity446 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer446) {
    // EDIT toujours activé quand disponible
    editLayer446.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer446) {
        gradedLayer446.enabled = false;
    }
} else if (hasGradedLayer446) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer446.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText446 = planComp446.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText446.name = "WARNING_NO_EDIT";
    warningText446.property("Transform").property("Position").setValue([1280, 200]);
    warningText446.guideLayer = true;
    
    var warningTextDoc446 = warningText446.property("Source Text").value;
    warningTextDoc446.fontSize = 32;
    warningTextDoc446.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc446.font = "Arial-BoldMT";
    warningTextDoc446.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText446.property("Source Text").setValue(warningTextDoc446);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText446 = planComp446.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00446");
    errorText446.name = "ERROR_NO_SOURCE";
    errorText446.property("Transform").property("Position").setValue([1280, 720]);
    errorText446.guideLayer = true;
    
    var errorTextDoc446 = errorText446.property("Source Text").value;
    errorTextDoc446.fontSize = 48;
    errorTextDoc446.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc446.font = "Arial-BoldMT";
    errorTextDoc446.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText446.property("Source Text").setValue(errorTextDoc446);
}

planCompositions[446] = planComp446;


// Composition pour plan 00447
var planComp447 = project.items.addComp(
    "SQ25_UNDLM_00447_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.32,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp447.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer447 = planComp447.layers.add(bgSolidComp);
bgLayer447.name = "BG_SOLID";
bgLayer447.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer447 = false;
if (gradingSources[447]) {
    var gradedLayer447 = planComp447.layers.add(gradingSources[447]);
    gradedLayer447.name = "UNDLM_00447_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer447.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer447.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer447 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer447 = false;
if (editSources[447]) {
    var editLayer447 = planComp447.layers.add(editSources[447]);
    editLayer447.name = "UNDLM_00447_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer447.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer447.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer447 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity447 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer447) {
    // EDIT toujours activé quand disponible
    editLayer447.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer447) {
        gradedLayer447.enabled = false;
    }
} else if (hasGradedLayer447) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer447.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText447 = planComp447.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText447.name = "WARNING_NO_EDIT";
    warningText447.property("Transform").property("Position").setValue([1280, 200]);
    warningText447.guideLayer = true;
    
    var warningTextDoc447 = warningText447.property("Source Text").value;
    warningTextDoc447.fontSize = 32;
    warningTextDoc447.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc447.font = "Arial-BoldMT";
    warningTextDoc447.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText447.property("Source Text").setValue(warningTextDoc447);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText447 = planComp447.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00447");
    errorText447.name = "ERROR_NO_SOURCE";
    errorText447.property("Transform").property("Position").setValue([1280, 720]);
    errorText447.guideLayer = true;
    
    var errorTextDoc447 = errorText447.property("Source Text").value;
    errorTextDoc447.fontSize = 48;
    errorTextDoc447.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc447.font = "Arial-BoldMT";
    errorTextDoc447.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText447.property("Source Text").setValue(errorTextDoc447);
}

planCompositions[447] = planComp447;


// Composition pour plan 00448
var planComp448 = project.items.addComp(
    "SQ25_UNDLM_00448_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.7199999999999998,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp448.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer448 = planComp448.layers.add(bgSolidComp);
bgLayer448.name = "BG_SOLID";
bgLayer448.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer448 = false;
if (gradingSources[448]) {
    var gradedLayer448 = planComp448.layers.add(gradingSources[448]);
    gradedLayer448.name = "UNDLM_00448_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer448.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer448.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer448 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer448 = false;
if (editSources[448]) {
    var editLayer448 = planComp448.layers.add(editSources[448]);
    editLayer448.name = "UNDLM_00448_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer448.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer448.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer448 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity448 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer448) {
    // EDIT toujours activé quand disponible
    editLayer448.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer448) {
        gradedLayer448.enabled = false;
    }
} else if (hasGradedLayer448) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer448.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText448 = planComp448.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText448.name = "WARNING_NO_EDIT";
    warningText448.property("Transform").property("Position").setValue([1280, 200]);
    warningText448.guideLayer = true;
    
    var warningTextDoc448 = warningText448.property("Source Text").value;
    warningTextDoc448.fontSize = 32;
    warningTextDoc448.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc448.font = "Arial-BoldMT";
    warningTextDoc448.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText448.property("Source Text").setValue(warningTextDoc448);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText448 = planComp448.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00448");
    errorText448.name = "ERROR_NO_SOURCE";
    errorText448.property("Transform").property("Position").setValue([1280, 720]);
    errorText448.guideLayer = true;
    
    var errorTextDoc448 = errorText448.property("Source Text").value;
    errorTextDoc448.fontSize = 48;
    errorTextDoc448.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc448.font = "Arial-BoldMT";
    errorTextDoc448.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText448.property("Source Text").setValue(errorTextDoc448);
}

planCompositions[448] = planComp448;


// Composition pour plan 00449
var planComp449 = project.items.addComp(
    "SQ25_UNDLM_00449_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp449.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer449 = planComp449.layers.add(bgSolidComp);
bgLayer449.name = "BG_SOLID";
bgLayer449.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer449 = false;
if (gradingSources[449]) {
    var gradedLayer449 = planComp449.layers.add(gradingSources[449]);
    gradedLayer449.name = "UNDLM_00449_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer449.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer449.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer449 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer449 = false;
if (editSources[449]) {
    var editLayer449 = planComp449.layers.add(editSources[449]);
    editLayer449.name = "UNDLM_00449_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer449.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer449.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer449 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity449 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer449) {
    // EDIT toujours activé quand disponible
    editLayer449.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer449) {
        gradedLayer449.enabled = false;
    }
} else if (hasGradedLayer449) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer449.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText449 = planComp449.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText449.name = "WARNING_NO_EDIT";
    warningText449.property("Transform").property("Position").setValue([1280, 200]);
    warningText449.guideLayer = true;
    
    var warningTextDoc449 = warningText449.property("Source Text").value;
    warningTextDoc449.fontSize = 32;
    warningTextDoc449.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc449.font = "Arial-BoldMT";
    warningTextDoc449.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText449.property("Source Text").setValue(warningTextDoc449);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText449 = planComp449.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00449");
    errorText449.name = "ERROR_NO_SOURCE";
    errorText449.property("Transform").property("Position").setValue([1280, 720]);
    errorText449.guideLayer = true;
    
    var errorTextDoc449 = errorText449.property("Source Text").value;
    errorTextDoc449.fontSize = 48;
    errorTextDoc449.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc449.font = "Arial-BoldMT";
    errorTextDoc449.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText449.property("Source Text").setValue(errorTextDoc449);
}

planCompositions[449] = planComp449;


// Composition pour plan 00450
var planComp450 = project.items.addComp(
    "SQ25_UNDLM_00450_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp450.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer450 = planComp450.layers.add(bgSolidComp);
bgLayer450.name = "BG_SOLID";
bgLayer450.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer450 = false;
if (gradingSources[450]) {
    var gradedLayer450 = planComp450.layers.add(gradingSources[450]);
    gradedLayer450.name = "UNDLM_00450_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer450.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer450.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer450 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer450 = false;
if (editSources[450]) {
    var editLayer450 = planComp450.layers.add(editSources[450]);
    editLayer450.name = "UNDLM_00450_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer450.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer450.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer450 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity450 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer450) {
    // EDIT toujours activé quand disponible
    editLayer450.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer450) {
        gradedLayer450.enabled = false;
    }
} else if (hasGradedLayer450) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer450.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText450 = planComp450.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText450.name = "WARNING_NO_EDIT";
    warningText450.property("Transform").property("Position").setValue([1280, 200]);
    warningText450.guideLayer = true;
    
    var warningTextDoc450 = warningText450.property("Source Text").value;
    warningTextDoc450.fontSize = 32;
    warningTextDoc450.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc450.font = "Arial-BoldMT";
    warningTextDoc450.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText450.property("Source Text").setValue(warningTextDoc450);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText450 = planComp450.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00450");
    errorText450.name = "ERROR_NO_SOURCE";
    errorText450.property("Transform").property("Position").setValue([1280, 720]);
    errorText450.guideLayer = true;
    
    var errorTextDoc450 = errorText450.property("Source Text").value;
    errorTextDoc450.fontSize = 48;
    errorTextDoc450.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc450.font = "Arial-BoldMT";
    errorTextDoc450.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText450.property("Source Text").setValue(errorTextDoc450);
}

planCompositions[450] = planComp450;


// Composition pour plan 00451
var planComp451 = project.items.addComp(
    "SQ25_UNDLM_00451_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp451.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer451 = planComp451.layers.add(bgSolidComp);
bgLayer451.name = "BG_SOLID";
bgLayer451.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer451 = false;
if (gradingSources[451]) {
    var gradedLayer451 = planComp451.layers.add(gradingSources[451]);
    gradedLayer451.name = "UNDLM_00451_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer451.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer451.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer451 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer451 = false;
if (editSources[451]) {
    var editLayer451 = planComp451.layers.add(editSources[451]);
    editLayer451.name = "UNDLM_00451_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer451.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer451.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer451 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity451 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer451) {
    // EDIT toujours activé quand disponible
    editLayer451.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer451) {
        gradedLayer451.enabled = false;
    }
} else if (hasGradedLayer451) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer451.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText451 = planComp451.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText451.name = "WARNING_NO_EDIT";
    warningText451.property("Transform").property("Position").setValue([1280, 200]);
    warningText451.guideLayer = true;
    
    var warningTextDoc451 = warningText451.property("Source Text").value;
    warningTextDoc451.fontSize = 32;
    warningTextDoc451.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc451.font = "Arial-BoldMT";
    warningTextDoc451.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText451.property("Source Text").setValue(warningTextDoc451);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText451 = planComp451.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00451");
    errorText451.name = "ERROR_NO_SOURCE";
    errorText451.property("Transform").property("Position").setValue([1280, 720]);
    errorText451.guideLayer = true;
    
    var errorTextDoc451 = errorText451.property("Source Text").value;
    errorTextDoc451.fontSize = 48;
    errorTextDoc451.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc451.font = "Arial-BoldMT";
    errorTextDoc451.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText451.property("Source Text").setValue(errorTextDoc451);
}

planCompositions[451] = planComp451;


// Composition pour plan 00452
var planComp452 = project.items.addComp(
    "SQ25_UNDLM_00452_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    0.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp452.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer452 = planComp452.layers.add(bgSolidComp);
bgLayer452.name = "BG_SOLID";
bgLayer452.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer452 = false;
if (gradingSources[452]) {
    var gradedLayer452 = planComp452.layers.add(gradingSources[452]);
    gradedLayer452.name = "UNDLM_00452_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer452.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer452.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer452 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer452 = false;
if (editSources[452]) {
    var editLayer452 = planComp452.layers.add(editSources[452]);
    editLayer452.name = "UNDLM_00452_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer452.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer452.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer452 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity452 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer452) {
    // EDIT toujours activé quand disponible
    editLayer452.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer452) {
        gradedLayer452.enabled = false;
    }
} else if (hasGradedLayer452) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer452.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText452 = planComp452.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText452.name = "WARNING_NO_EDIT";
    warningText452.property("Transform").property("Position").setValue([1280, 200]);
    warningText452.guideLayer = true;
    
    var warningTextDoc452 = warningText452.property("Source Text").value;
    warningTextDoc452.fontSize = 32;
    warningTextDoc452.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc452.font = "Arial-BoldMT";
    warningTextDoc452.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText452.property("Source Text").setValue(warningTextDoc452);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText452 = planComp452.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00452");
    errorText452.name = "ERROR_NO_SOURCE";
    errorText452.property("Transform").property("Position").setValue([1280, 720]);
    errorText452.guideLayer = true;
    
    var errorTextDoc452 = errorText452.property("Source Text").value;
    errorTextDoc452.fontSize = 48;
    errorTextDoc452.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc452.font = "Arial-BoldMT";
    errorTextDoc452.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText452.property("Source Text").setValue(errorTextDoc452);
}

planCompositions[452] = planComp452;


// Composition pour plan 00453
var planComp453 = project.items.addComp(
    "SQ25_UNDLM_00453_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp453.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer453 = planComp453.layers.add(bgSolidComp);
bgLayer453.name = "BG_SOLID";
bgLayer453.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer453 = false;
if (gradingSources[453]) {
    var gradedLayer453 = planComp453.layers.add(gradingSources[453]);
    gradedLayer453.name = "UNDLM_00453_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer453.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer453.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer453 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer453 = false;
if (editSources[453]) {
    var editLayer453 = planComp453.layers.add(editSources[453]);
    editLayer453.name = "UNDLM_00453_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer453.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer453.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer453 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity453 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer453) {
    // EDIT toujours activé quand disponible
    editLayer453.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer453) {
        gradedLayer453.enabled = false;
    }
} else if (hasGradedLayer453) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer453.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText453 = planComp453.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText453.name = "WARNING_NO_EDIT";
    warningText453.property("Transform").property("Position").setValue([1280, 200]);
    warningText453.guideLayer = true;
    
    var warningTextDoc453 = warningText453.property("Source Text").value;
    warningTextDoc453.fontSize = 32;
    warningTextDoc453.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc453.font = "Arial-BoldMT";
    warningTextDoc453.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText453.property("Source Text").setValue(warningTextDoc453);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText453 = planComp453.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00453");
    errorText453.name = "ERROR_NO_SOURCE";
    errorText453.property("Transform").property("Position").setValue([1280, 720]);
    errorText453.guideLayer = true;
    
    var errorTextDoc453 = errorText453.property("Source Text").value;
    errorTextDoc453.fontSize = 48;
    errorTextDoc453.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc453.font = "Arial-BoldMT";
    errorTextDoc453.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText453.property("Source Text").setValue(errorTextDoc453);
}

planCompositions[453] = planComp453;


// Composition pour plan 00454
var planComp454 = project.items.addComp(
    "SQ25_UNDLM_00454_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.7199999999999998,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp454.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer454 = planComp454.layers.add(bgSolidComp);
bgLayer454.name = "BG_SOLID";
bgLayer454.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer454 = false;
if (gradingSources[454]) {
    var gradedLayer454 = planComp454.layers.add(gradingSources[454]);
    gradedLayer454.name = "UNDLM_00454_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer454.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer454.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer454 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer454 = false;
if (editSources[454]) {
    var editLayer454 = planComp454.layers.add(editSources[454]);
    editLayer454.name = "UNDLM_00454_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer454.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer454.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer454 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity454 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer454) {
    // EDIT toujours activé quand disponible
    editLayer454.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer454) {
        gradedLayer454.enabled = false;
    }
} else if (hasGradedLayer454) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer454.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText454 = planComp454.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText454.name = "WARNING_NO_EDIT";
    warningText454.property("Transform").property("Position").setValue([1280, 200]);
    warningText454.guideLayer = true;
    
    var warningTextDoc454 = warningText454.property("Source Text").value;
    warningTextDoc454.fontSize = 32;
    warningTextDoc454.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc454.font = "Arial-BoldMT";
    warningTextDoc454.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText454.property("Source Text").setValue(warningTextDoc454);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText454 = planComp454.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00454");
    errorText454.name = "ERROR_NO_SOURCE";
    errorText454.property("Transform").property("Position").setValue([1280, 720]);
    errorText454.guideLayer = true;
    
    var errorTextDoc454 = errorText454.property("Source Text").value;
    errorTextDoc454.fontSize = 48;
    errorTextDoc454.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc454.font = "Arial-BoldMT";
    errorTextDoc454.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText454.property("Source Text").setValue(errorTextDoc454);
}

planCompositions[454] = planComp454;


// Composition pour plan 00455
var planComp455 = project.items.addComp(
    "SQ25_UNDLM_00455_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp455.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer455 = planComp455.layers.add(bgSolidComp);
bgLayer455.name = "BG_SOLID";
bgLayer455.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer455 = false;
if (gradingSources[455]) {
    var gradedLayer455 = planComp455.layers.add(gradingSources[455]);
    gradedLayer455.name = "UNDLM_00455_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer455.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer455.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer455 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer455 = false;
if (editSources[455]) {
    var editLayer455 = planComp455.layers.add(editSources[455]);
    editLayer455.name = "UNDLM_00455_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer455.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer455.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer455 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity455 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer455) {
    // EDIT toujours activé quand disponible
    editLayer455.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer455) {
        gradedLayer455.enabled = false;
    }
} else if (hasGradedLayer455) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer455.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText455 = planComp455.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText455.name = "WARNING_NO_EDIT";
    warningText455.property("Transform").property("Position").setValue([1280, 200]);
    warningText455.guideLayer = true;
    
    var warningTextDoc455 = warningText455.property("Source Text").value;
    warningTextDoc455.fontSize = 32;
    warningTextDoc455.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc455.font = "Arial-BoldMT";
    warningTextDoc455.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText455.property("Source Text").setValue(warningTextDoc455);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText455 = planComp455.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00455");
    errorText455.name = "ERROR_NO_SOURCE";
    errorText455.property("Transform").property("Position").setValue([1280, 720]);
    errorText455.guideLayer = true;
    
    var errorTextDoc455 = errorText455.property("Source Text").value;
    errorTextDoc455.fontSize = 48;
    errorTextDoc455.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc455.font = "Arial-BoldMT";
    errorTextDoc455.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText455.property("Source Text").setValue(errorTextDoc455);
}

planCompositions[455] = planComp455;


// Composition pour plan 00456
var planComp456 = project.items.addComp(
    "SQ25_UNDLM_00456_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp456.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer456 = planComp456.layers.add(bgSolidComp);
bgLayer456.name = "BG_SOLID";
bgLayer456.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer456 = false;
if (gradingSources[456]) {
    var gradedLayer456 = planComp456.layers.add(gradingSources[456]);
    gradedLayer456.name = "UNDLM_00456_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer456.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer456.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer456 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer456 = false;
if (editSources[456]) {
    var editLayer456 = planComp456.layers.add(editSources[456]);
    editLayer456.name = "UNDLM_00456_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer456.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer456.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer456 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity456 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer456) {
    // EDIT toujours activé quand disponible
    editLayer456.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer456) {
        gradedLayer456.enabled = false;
    }
} else if (hasGradedLayer456) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer456.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText456 = planComp456.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText456.name = "WARNING_NO_EDIT";
    warningText456.property("Transform").property("Position").setValue([1280, 200]);
    warningText456.guideLayer = true;
    
    var warningTextDoc456 = warningText456.property("Source Text").value;
    warningTextDoc456.fontSize = 32;
    warningTextDoc456.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc456.font = "Arial-BoldMT";
    warningTextDoc456.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText456.property("Source Text").setValue(warningTextDoc456);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText456 = planComp456.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00456");
    errorText456.name = "ERROR_NO_SOURCE";
    errorText456.property("Transform").property("Position").setValue([1280, 720]);
    errorText456.guideLayer = true;
    
    var errorTextDoc456 = errorText456.property("Source Text").value;
    errorTextDoc456.fontSize = 48;
    errorTextDoc456.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc456.font = "Arial-BoldMT";
    errorTextDoc456.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText456.property("Source Text").setValue(errorTextDoc456);
}

planCompositions[456] = planComp456;


// Composition pour plan 00457
var planComp457 = project.items.addComp(
    "SQ25_UNDLM_00457_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp457.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer457 = planComp457.layers.add(bgSolidComp);
bgLayer457.name = "BG_SOLID";
bgLayer457.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer457 = false;
if (gradingSources[457]) {
    var gradedLayer457 = planComp457.layers.add(gradingSources[457]);
    gradedLayer457.name = "UNDLM_00457_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer457.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer457.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer457 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer457 = false;
if (editSources[457]) {
    var editLayer457 = planComp457.layers.add(editSources[457]);
    editLayer457.name = "UNDLM_00457_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer457.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer457.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer457 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity457 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer457) {
    // EDIT toujours activé quand disponible
    editLayer457.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer457) {
        gradedLayer457.enabled = false;
    }
} else if (hasGradedLayer457) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer457.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText457 = planComp457.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText457.name = "WARNING_NO_EDIT";
    warningText457.property("Transform").property("Position").setValue([1280, 200]);
    warningText457.guideLayer = true;
    
    var warningTextDoc457 = warningText457.property("Source Text").value;
    warningTextDoc457.fontSize = 32;
    warningTextDoc457.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc457.font = "Arial-BoldMT";
    warningTextDoc457.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText457.property("Source Text").setValue(warningTextDoc457);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText457 = planComp457.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00457");
    errorText457.name = "ERROR_NO_SOURCE";
    errorText457.property("Transform").property("Position").setValue([1280, 720]);
    errorText457.guideLayer = true;
    
    var errorTextDoc457 = errorText457.property("Source Text").value;
    errorTextDoc457.fontSize = 48;
    errorTextDoc457.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc457.font = "Arial-BoldMT";
    errorTextDoc457.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText457.property("Source Text").setValue(errorTextDoc457);
}

planCompositions[457] = planComp457;


// Composition pour plan 00458
var planComp458 = project.items.addComp(
    "SQ25_UNDLM_00458_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.2800000000000002,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp458.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer458 = planComp458.layers.add(bgSolidComp);
bgLayer458.name = "BG_SOLID";
bgLayer458.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer458 = false;
if (gradingSources[458]) {
    var gradedLayer458 = planComp458.layers.add(gradingSources[458]);
    gradedLayer458.name = "UNDLM_00458_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer458.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer458.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer458 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer458 = false;
if (editSources[458]) {
    var editLayer458 = planComp458.layers.add(editSources[458]);
    editLayer458.name = "UNDLM_00458_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer458.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer458.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer458 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity458 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer458) {
    // EDIT toujours activé quand disponible
    editLayer458.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer458) {
        gradedLayer458.enabled = false;
    }
} else if (hasGradedLayer458) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer458.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText458 = planComp458.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText458.name = "WARNING_NO_EDIT";
    warningText458.property("Transform").property("Position").setValue([1280, 200]);
    warningText458.guideLayer = true;
    
    var warningTextDoc458 = warningText458.property("Source Text").value;
    warningTextDoc458.fontSize = 32;
    warningTextDoc458.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc458.font = "Arial-BoldMT";
    warningTextDoc458.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText458.property("Source Text").setValue(warningTextDoc458);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText458 = planComp458.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00458");
    errorText458.name = "ERROR_NO_SOURCE";
    errorText458.property("Transform").property("Position").setValue([1280, 720]);
    errorText458.guideLayer = true;
    
    var errorTextDoc458 = errorText458.property("Source Text").value;
    errorTextDoc458.fontSize = 48;
    errorTextDoc458.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc458.font = "Arial-BoldMT";
    errorTextDoc458.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText458.property("Source Text").setValue(errorTextDoc458);
}

planCompositions[458] = planComp458;


// Composition pour plan 00459
var planComp459 = project.items.addComp(
    "SQ25_UNDLM_00459_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.32,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp459.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer459 = planComp459.layers.add(bgSolidComp);
bgLayer459.name = "BG_SOLID";
bgLayer459.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer459 = false;
if (gradingSources[459]) {
    var gradedLayer459 = planComp459.layers.add(gradingSources[459]);
    gradedLayer459.name = "UNDLM_00459_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer459.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer459.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer459 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer459 = false;
if (editSources[459]) {
    var editLayer459 = planComp459.layers.add(editSources[459]);
    editLayer459.name = "UNDLM_00459_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer459.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer459.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer459 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity459 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer459) {
    // EDIT toujours activé quand disponible
    editLayer459.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer459) {
        gradedLayer459.enabled = false;
    }
} else if (hasGradedLayer459) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer459.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText459 = planComp459.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText459.name = "WARNING_NO_EDIT";
    warningText459.property("Transform").property("Position").setValue([1280, 200]);
    warningText459.guideLayer = true;
    
    var warningTextDoc459 = warningText459.property("Source Text").value;
    warningTextDoc459.fontSize = 32;
    warningTextDoc459.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc459.font = "Arial-BoldMT";
    warningTextDoc459.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText459.property("Source Text").setValue(warningTextDoc459);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText459 = planComp459.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00459");
    errorText459.name = "ERROR_NO_SOURCE";
    errorText459.property("Transform").property("Position").setValue([1280, 720]);
    errorText459.guideLayer = true;
    
    var errorTextDoc459 = errorText459.property("Source Text").value;
    errorTextDoc459.fontSize = 48;
    errorTextDoc459.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc459.font = "Arial-BoldMT";
    errorTextDoc459.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText459.property("Source Text").setValue(errorTextDoc459);
}

planCompositions[459] = planComp459;


// Composition pour plan 00460
var planComp460 = project.items.addComp(
    "SQ25_UNDLM_00460_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp460.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer460 = planComp460.layers.add(bgSolidComp);
bgLayer460.name = "BG_SOLID";
bgLayer460.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer460 = false;
if (gradingSources[460]) {
    var gradedLayer460 = planComp460.layers.add(gradingSources[460]);
    gradedLayer460.name = "UNDLM_00460_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer460.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer460.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer460 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer460 = false;
if (editSources[460]) {
    var editLayer460 = planComp460.layers.add(editSources[460]);
    editLayer460.name = "UNDLM_00460_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer460.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer460.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer460 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity460 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer460) {
    // EDIT toujours activé quand disponible
    editLayer460.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer460) {
        gradedLayer460.enabled = false;
    }
} else if (hasGradedLayer460) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer460.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText460 = planComp460.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText460.name = "WARNING_NO_EDIT";
    warningText460.property("Transform").property("Position").setValue([1280, 200]);
    warningText460.guideLayer = true;
    
    var warningTextDoc460 = warningText460.property("Source Text").value;
    warningTextDoc460.fontSize = 32;
    warningTextDoc460.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc460.font = "Arial-BoldMT";
    warningTextDoc460.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText460.property("Source Text").setValue(warningTextDoc460);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText460 = planComp460.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00460");
    errorText460.name = "ERROR_NO_SOURCE";
    errorText460.property("Transform").property("Position").setValue([1280, 720]);
    errorText460.guideLayer = true;
    
    var errorTextDoc460 = errorText460.property("Source Text").value;
    errorTextDoc460.fontSize = 48;
    errorTextDoc460.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc460.font = "Arial-BoldMT";
    errorTextDoc460.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText460.property("Source Text").setValue(errorTextDoc460);
}

planCompositions[460] = planComp460;


// Composition pour plan 00461
var planComp461 = project.items.addComp(
    "SQ25_UNDLM_00461_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp461.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer461 = planComp461.layers.add(bgSolidComp);
bgLayer461.name = "BG_SOLID";
bgLayer461.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer461 = false;
if (gradingSources[461]) {
    var gradedLayer461 = planComp461.layers.add(gradingSources[461]);
    gradedLayer461.name = "UNDLM_00461_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer461.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer461.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer461 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer461 = false;
if (editSources[461]) {
    var editLayer461 = planComp461.layers.add(editSources[461]);
    editLayer461.name = "UNDLM_00461_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer461.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer461.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer461 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity461 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer461) {
    // EDIT toujours activé quand disponible
    editLayer461.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer461) {
        gradedLayer461.enabled = false;
    }
} else if (hasGradedLayer461) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer461.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText461 = planComp461.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText461.name = "WARNING_NO_EDIT";
    warningText461.property("Transform").property("Position").setValue([1280, 200]);
    warningText461.guideLayer = true;
    
    var warningTextDoc461 = warningText461.property("Source Text").value;
    warningTextDoc461.fontSize = 32;
    warningTextDoc461.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc461.font = "Arial-BoldMT";
    warningTextDoc461.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText461.property("Source Text").setValue(warningTextDoc461);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText461 = planComp461.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00461");
    errorText461.name = "ERROR_NO_SOURCE";
    errorText461.property("Transform").property("Position").setValue([1280, 720]);
    errorText461.guideLayer = true;
    
    var errorTextDoc461 = errorText461.property("Source Text").value;
    errorTextDoc461.fontSize = 48;
    errorTextDoc461.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc461.font = "Arial-BoldMT";
    errorTextDoc461.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText461.property("Source Text").setValue(errorTextDoc461);
}

planCompositions[461] = planComp461;


// Composition pour plan 00462
var planComp462 = project.items.addComp(
    "SQ25_UNDLM_00462_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp462.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer462 = planComp462.layers.add(bgSolidComp);
bgLayer462.name = "BG_SOLID";
bgLayer462.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer462 = false;
if (gradingSources[462]) {
    var gradedLayer462 = planComp462.layers.add(gradingSources[462]);
    gradedLayer462.name = "UNDLM_00462_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer462.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer462.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer462 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer462 = false;
if (editSources[462]) {
    var editLayer462 = planComp462.layers.add(editSources[462]);
    editLayer462.name = "UNDLM_00462_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer462.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer462.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer462 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity462 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer462) {
    // EDIT toujours activé quand disponible
    editLayer462.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer462) {
        gradedLayer462.enabled = false;
    }
} else if (hasGradedLayer462) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer462.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText462 = planComp462.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText462.name = "WARNING_NO_EDIT";
    warningText462.property("Transform").property("Position").setValue([1280, 200]);
    warningText462.guideLayer = true;
    
    var warningTextDoc462 = warningText462.property("Source Text").value;
    warningTextDoc462.fontSize = 32;
    warningTextDoc462.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc462.font = "Arial-BoldMT";
    warningTextDoc462.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText462.property("Source Text").setValue(warningTextDoc462);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText462 = planComp462.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00462");
    errorText462.name = "ERROR_NO_SOURCE";
    errorText462.property("Transform").property("Position").setValue([1280, 720]);
    errorText462.guideLayer = true;
    
    var errorTextDoc462 = errorText462.property("Source Text").value;
    errorTextDoc462.fontSize = 48;
    errorTextDoc462.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc462.font = "Arial-BoldMT";
    errorTextDoc462.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText462.property("Source Text").setValue(errorTextDoc462);
}

planCompositions[462] = planComp462;


// Composition pour plan 00463
var planComp463 = project.items.addComp(
    "SQ25_UNDLM_00463_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp463.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer463 = planComp463.layers.add(bgSolidComp);
bgLayer463.name = "BG_SOLID";
bgLayer463.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer463 = false;
if (gradingSources[463]) {
    var gradedLayer463 = planComp463.layers.add(gradingSources[463]);
    gradedLayer463.name = "UNDLM_00463_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer463.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer463.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer463 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer463 = false;
if (editSources[463]) {
    var editLayer463 = planComp463.layers.add(editSources[463]);
    editLayer463.name = "UNDLM_00463_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer463.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer463.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer463 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity463 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer463) {
    // EDIT toujours activé quand disponible
    editLayer463.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer463) {
        gradedLayer463.enabled = false;
    }
} else if (hasGradedLayer463) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer463.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText463 = planComp463.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText463.name = "WARNING_NO_EDIT";
    warningText463.property("Transform").property("Position").setValue([1280, 200]);
    warningText463.guideLayer = true;
    
    var warningTextDoc463 = warningText463.property("Source Text").value;
    warningTextDoc463.fontSize = 32;
    warningTextDoc463.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc463.font = "Arial-BoldMT";
    warningTextDoc463.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText463.property("Source Text").setValue(warningTextDoc463);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText463 = planComp463.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00463");
    errorText463.name = "ERROR_NO_SOURCE";
    errorText463.property("Transform").property("Position").setValue([1280, 720]);
    errorText463.guideLayer = true;
    
    var errorTextDoc463 = errorText463.property("Source Text").value;
    errorTextDoc463.fontSize = 48;
    errorTextDoc463.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc463.font = "Arial-BoldMT";
    errorTextDoc463.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText463.property("Source Text").setValue(errorTextDoc463);
}

planCompositions[463] = planComp463;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ25_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    89.08000000000001, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00443 à la timeline master
if (planCompositions[443]) {
    var masterLayer443 = masterComp.layers.add(planCompositions[443]);
    masterLayer443.startTime = 0;
    masterLayer443.name = "UNDLM_00443";
    masterLayer443.label = 1; // Couleurs alternées
}

// Ajouter plan 00444 à la timeline master
if (planCompositions[444]) {
    var masterLayer444 = masterComp.layers.add(planCompositions[444]);
    masterLayer444.startTime = 8.72;
    masterLayer444.name = "UNDLM_00444";
    masterLayer444.label = 2; // Couleurs alternées
}

// Ajouter plan 00445 à la timeline master
if (planCompositions[445]) {
    var masterLayer445 = masterComp.layers.add(planCompositions[445]);
    masterLayer445.startTime = 12.24;
    masterLayer445.name = "UNDLM_00445";
    masterLayer445.label = 3; // Couleurs alternées
}

// Ajouter plan 00446 à la timeline master
if (planCompositions[446]) {
    var masterLayer446 = masterComp.layers.add(planCompositions[446]);
    masterLayer446.startTime = 16.4;
    masterLayer446.name = "UNDLM_00446";
    masterLayer446.label = 4; // Couleurs alternées
}

// Ajouter plan 00447 à la timeline master
if (planCompositions[447]) {
    var masterLayer447 = masterComp.layers.add(planCompositions[447]);
    masterLayer447.startTime = 17.72;
    masterLayer447.name = "UNDLM_00447";
    masterLayer447.label = 5; // Couleurs alternées
}

// Ajouter plan 00448 à la timeline master
if (planCompositions[448]) {
    var masterLayer448 = masterComp.layers.add(planCompositions[448]);
    masterLayer448.startTime = 24.04;
    masterLayer448.name = "UNDLM_00448";
    masterLayer448.label = 6; // Couleurs alternées
}

// Ajouter plan 00449 à la timeline master
if (planCompositions[449]) {
    var masterLayer449 = masterComp.layers.add(planCompositions[449]);
    masterLayer449.startTime = 27.759999999999998;
    masterLayer449.name = "UNDLM_00449";
    masterLayer449.label = 7; // Couleurs alternées
}

// Ajouter plan 00450 à la timeline master
if (planCompositions[450]) {
    var masterLayer450 = masterComp.layers.add(planCompositions[450]);
    masterLayer450.startTime = 30.0;
    masterLayer450.name = "UNDLM_00450";
    masterLayer450.label = 8; // Couleurs alternées
}

// Ajouter plan 00451 à la timeline master
if (planCompositions[451]) {
    var masterLayer451 = masterComp.layers.add(planCompositions[451]);
    masterLayer451.startTime = 32.36;
    masterLayer451.name = "UNDLM_00451";
    masterLayer451.label = 9; // Couleurs alternées
}

// Ajouter plan 00452 à la timeline master
if (planCompositions[452]) {
    var masterLayer452 = masterComp.layers.add(planCompositions[452]);
    masterLayer452.startTime = 33.96;
    masterLayer452.name = "UNDLM_00452";
    masterLayer452.label = 10; // Couleurs alternées
}

// Ajouter plan 00453 à la timeline master
if (planCompositions[453]) {
    var masterLayer453 = masterComp.layers.add(planCompositions[453]);
    masterLayer453.startTime = 34.64;
    masterLayer453.name = "UNDLM_00453";
    masterLayer453.label = 11; // Couleurs alternées
}

// Ajouter plan 00454 à la timeline master
if (planCompositions[454]) {
    var masterLayer454 = masterComp.layers.add(planCompositions[454]);
    masterLayer454.startTime = 39.68;
    masterLayer454.name = "UNDLM_00454";
    masterLayer454.label = 12; // Couleurs alternées
}

// Ajouter plan 00455 à la timeline master
if (planCompositions[455]) {
    var masterLayer455 = masterComp.layers.add(planCompositions[455]);
    masterLayer455.startTime = 43.4;
    masterLayer455.name = "UNDLM_00455";
    masterLayer455.label = 13; // Couleurs alternées
}

// Ajouter plan 00456 à la timeline master
if (planCompositions[456]) {
    var masterLayer456 = masterComp.layers.add(planCompositions[456]);
    masterLayer456.startTime = 48.839999999999996;
    masterLayer456.name = "UNDLM_00456";
    masterLayer456.label = 14; // Couleurs alternées
}

// Ajouter plan 00457 à la timeline master
if (planCompositions[457]) {
    var masterLayer457 = masterComp.layers.add(planCompositions[457]);
    masterLayer457.startTime = 54.76;
    masterLayer457.name = "UNDLM_00457";
    masterLayer457.label = 15; // Couleurs alternées
}

// Ajouter plan 00458 à la timeline master
if (planCompositions[458]) {
    var masterLayer458 = masterComp.layers.add(planCompositions[458]);
    masterLayer458.startTime = 57.64;
    masterLayer458.name = "UNDLM_00458";
    masterLayer458.label = 16; // Couleurs alternées
}

// Ajouter plan 00459 à la timeline master
if (planCompositions[459]) {
    var masterLayer459 = masterComp.layers.add(planCompositions[459]);
    masterLayer459.startTime = 59.92;
    masterLayer459.name = "UNDLM_00459";
    masterLayer459.label = 1; // Couleurs alternées
}

// Ajouter plan 00460 à la timeline master
if (planCompositions[460]) {
    var masterLayer460 = masterComp.layers.add(planCompositions[460]);
    masterLayer460.startTime = 64.24000000000001;
    masterLayer460.name = "UNDLM_00460";
    masterLayer460.label = 2; // Couleurs alternées
}

// Ajouter plan 00461 à la timeline master
if (planCompositions[461]) {
    var masterLayer461 = masterComp.layers.add(planCompositions[461]);
    masterLayer461.startTime = 68.4;
    masterLayer461.name = "UNDLM_00461";
    masterLayer461.label = 3; // Couleurs alternées
}

// Ajouter plan 00462 à la timeline master
if (planCompositions[462]) {
    var masterLayer462 = masterComp.layers.add(planCompositions[462]);
    masterLayer462.startTime = 75.16000000000001;
    masterLayer462.name = "UNDLM_00462";
    masterLayer462.label = 4; // Couleurs alternées
}

// Ajouter plan 00463 à la timeline master
if (planCompositions[463]) {
    var masterLayer463 = masterComp.layers.add(planCompositions[463]);
    masterLayer463.startTime = 83.16000000000001;
    masterLayer463.name = "UNDLM_00463";
    masterLayer463.label = 5; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ25";\n' +
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
    {start: 0, end: 8.72, name: "UNDLM_00443"},
    {start: 8.72, end: 12.24, name: "UNDLM_00444"},
    {start: 12.24, end: 16.4, name: "UNDLM_00445"},
    {start: 16.4, end: 17.72, name: "UNDLM_00446"},
    {start: 17.72, end: 24.04, name: "UNDLM_00447"},
    {start: 24.04, end: 27.759999999999998, name: "UNDLM_00448"},
    {start: 27.759999999999998, end: 30.0, name: "UNDLM_00449"},
    {start: 30.0, end: 32.36, name: "UNDLM_00450"},
    {start: 32.36, end: 33.96, name: "UNDLM_00451"},
    {start: 33.96, end: 34.64, name: "UNDLM_00452"},
    {start: 34.64, end: 39.68, name: "UNDLM_00453"},
    {start: 39.68, end: 43.4, name: "UNDLM_00454"},
    {start: 43.4, end: 48.839999999999996, name: "UNDLM_00455"},
    {start: 48.839999999999996, end: 54.76, name: "UNDLM_00456"},
    {start: 54.76, end: 57.64, name: "UNDLM_00457"},
    {start: 57.64, end: 59.92, name: "UNDLM_00458"},
    {start: 59.92, end: 64.24000000000001, name: "UNDLM_00459"},
    {start: 64.24000000000001, end: 68.4, name: "UNDLM_00460"},
    {start: 68.4, end: 75.16000000000001, name: "UNDLM_00461"},
    {start: 75.16000000000001, end: 83.16000000000001, name: "UNDLM_00462"},
    {start: 83.16000000000001, end: 89.08000000000001, name: "UNDLM_00463"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ25/_AE/SQ25_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 18;
var totalCount = 21;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ25 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(89.08000000000001 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ25_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ25:" + totalCount + ":" + gradedCount);
