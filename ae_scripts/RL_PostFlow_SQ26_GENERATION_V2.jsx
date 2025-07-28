
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ26 avec 15 plans
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


// Import plan EDIT 00464
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile464 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00464.mov");
var editFilePoignees464 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00464_AVEC_POIGNEES.mov");
var editFileBis464 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00464bis.mov");

var importSuccess464 = false;
var fileName464 = "";

// Tenter import standard
if (editFile464.exists) {
    try {
        var editFootage464 = project.importFile(new ImportOptions(editFile464));
        editFootage464.parentFolder = fromEditFolder;
        editFootage464.name = "UNDLM_00464";
        editSources[464] = editFootage464;
        editImportCount++;
        importSuccess464 = true;
        fileName464 = "UNDLM_00464.mov";
        logImportSuccess(464, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00464.mov", fileName464);
    } catch (e) {
        logImportError(464, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00464.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess464 && editFilePoignees464.exists) {
    try {
        var editFootage464 = project.importFile(new ImportOptions(editFilePoignees464));
        editFootage464.parentFolder = fromEditFolder;
        editFootage464.name = "UNDLM_00464_AVEC_POIGNEES";
        editSources[464] = editFootage464;
        editImportCount++;
        importSuccess464 = true;
        fileName464 = "UNDLM_00464_AVEC_POIGNEES.mov";
        logImportSuccess(464, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00464_AVEC_POIGNEES.mov", fileName464);
    } catch (e) {
        logImportError(464, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00464_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess464 && editFileBis464.exists) {
    try {
        var editFootage464 = project.importFile(new ImportOptions(editFileBis464));
        editFootage464.parentFolder = fromEditFolder;
        editFootage464.name = "UNDLM_00464bis";
        editSources[464] = editFootage464;
        editImportCount++;
        importSuccess464 = true;
        fileName464 = "UNDLM_00464bis.mov";
        logImportSuccess(464, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00464bis.mov", fileName464);
    } catch (e) {
        logImportError(464, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00464bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess464) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00464.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00465
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile465 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00465.mov");
var editFilePoignees465 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00465_AVEC_POIGNEES.mov");
var editFileBis465 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00465bis.mov");

var importSuccess465 = false;
var fileName465 = "";

// Tenter import standard
if (editFile465.exists) {
    try {
        var editFootage465 = project.importFile(new ImportOptions(editFile465));
        editFootage465.parentFolder = fromEditFolder;
        editFootage465.name = "UNDLM_00465";
        editSources[465] = editFootage465;
        editImportCount++;
        importSuccess465 = true;
        fileName465 = "UNDLM_00465.mov";
        logImportSuccess(465, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00465.mov", fileName465);
    } catch (e) {
        logImportError(465, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00465.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess465 && editFilePoignees465.exists) {
    try {
        var editFootage465 = project.importFile(new ImportOptions(editFilePoignees465));
        editFootage465.parentFolder = fromEditFolder;
        editFootage465.name = "UNDLM_00465_AVEC_POIGNEES";
        editSources[465] = editFootage465;
        editImportCount++;
        importSuccess465 = true;
        fileName465 = "UNDLM_00465_AVEC_POIGNEES.mov";
        logImportSuccess(465, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00465_AVEC_POIGNEES.mov", fileName465);
    } catch (e) {
        logImportError(465, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00465_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess465 && editFileBis465.exists) {
    try {
        var editFootage465 = project.importFile(new ImportOptions(editFileBis465));
        editFootage465.parentFolder = fromEditFolder;
        editFootage465.name = "UNDLM_00465bis";
        editSources[465] = editFootage465;
        editImportCount++;
        importSuccess465 = true;
        fileName465 = "UNDLM_00465bis.mov";
        logImportSuccess(465, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00465bis.mov", fileName465);
    } catch (e) {
        logImportError(465, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00465bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess465) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00465.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00466
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile466 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00466.mov");
var editFilePoignees466 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00466_AVEC_POIGNEES.mov");
var editFileBis466 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00466bis.mov");

var importSuccess466 = false;
var fileName466 = "";

// Tenter import standard
if (editFile466.exists) {
    try {
        var editFootage466 = project.importFile(new ImportOptions(editFile466));
        editFootage466.parentFolder = fromEditFolder;
        editFootage466.name = "UNDLM_00466";
        editSources[466] = editFootage466;
        editImportCount++;
        importSuccess466 = true;
        fileName466 = "UNDLM_00466.mov";
        logImportSuccess(466, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00466.mov", fileName466);
    } catch (e) {
        logImportError(466, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00466.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess466 && editFilePoignees466.exists) {
    try {
        var editFootage466 = project.importFile(new ImportOptions(editFilePoignees466));
        editFootage466.parentFolder = fromEditFolder;
        editFootage466.name = "UNDLM_00466_AVEC_POIGNEES";
        editSources[466] = editFootage466;
        editImportCount++;
        importSuccess466 = true;
        fileName466 = "UNDLM_00466_AVEC_POIGNEES.mov";
        logImportSuccess(466, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00466_AVEC_POIGNEES.mov", fileName466);
    } catch (e) {
        logImportError(466, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00466_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess466 && editFileBis466.exists) {
    try {
        var editFootage466 = project.importFile(new ImportOptions(editFileBis466));
        editFootage466.parentFolder = fromEditFolder;
        editFootage466.name = "UNDLM_00466bis";
        editSources[466] = editFootage466;
        editImportCount++;
        importSuccess466 = true;
        fileName466 = "UNDLM_00466bis.mov";
        logImportSuccess(466, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00466bis.mov", fileName466);
    } catch (e) {
        logImportError(466, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00466bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess466) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00466.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00467
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile467 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00467.mov");
var editFilePoignees467 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00467_AVEC_POIGNEES.mov");
var editFileBis467 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00467bis.mov");

var importSuccess467 = false;
var fileName467 = "";

// Tenter import standard
if (editFile467.exists) {
    try {
        var editFootage467 = project.importFile(new ImportOptions(editFile467));
        editFootage467.parentFolder = fromEditFolder;
        editFootage467.name = "UNDLM_00467";
        editSources[467] = editFootage467;
        editImportCount++;
        importSuccess467 = true;
        fileName467 = "UNDLM_00467.mov";
        logImportSuccess(467, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00467.mov", fileName467);
    } catch (e) {
        logImportError(467, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00467.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess467 && editFilePoignees467.exists) {
    try {
        var editFootage467 = project.importFile(new ImportOptions(editFilePoignees467));
        editFootage467.parentFolder = fromEditFolder;
        editFootage467.name = "UNDLM_00467_AVEC_POIGNEES";
        editSources[467] = editFootage467;
        editImportCount++;
        importSuccess467 = true;
        fileName467 = "UNDLM_00467_AVEC_POIGNEES.mov";
        logImportSuccess(467, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00467_AVEC_POIGNEES.mov", fileName467);
    } catch (e) {
        logImportError(467, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00467_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess467 && editFileBis467.exists) {
    try {
        var editFootage467 = project.importFile(new ImportOptions(editFileBis467));
        editFootage467.parentFolder = fromEditFolder;
        editFootage467.name = "UNDLM_00467bis";
        editSources[467] = editFootage467;
        editImportCount++;
        importSuccess467 = true;
        fileName467 = "UNDLM_00467bis.mov";
        logImportSuccess(467, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00467bis.mov", fileName467);
    } catch (e) {
        logImportError(467, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00467bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess467) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00467.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00468
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile468 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00468.mov");
var editFilePoignees468 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00468_AVEC_POIGNEES.mov");
var editFileBis468 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00468bis.mov");

var importSuccess468 = false;
var fileName468 = "";

// Tenter import standard
if (editFile468.exists) {
    try {
        var editFootage468 = project.importFile(new ImportOptions(editFile468));
        editFootage468.parentFolder = fromEditFolder;
        editFootage468.name = "UNDLM_00468";
        editSources[468] = editFootage468;
        editImportCount++;
        importSuccess468 = true;
        fileName468 = "UNDLM_00468.mov";
        logImportSuccess(468, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00468.mov", fileName468);
    } catch (e) {
        logImportError(468, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00468.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess468 && editFilePoignees468.exists) {
    try {
        var editFootage468 = project.importFile(new ImportOptions(editFilePoignees468));
        editFootage468.parentFolder = fromEditFolder;
        editFootage468.name = "UNDLM_00468_AVEC_POIGNEES";
        editSources[468] = editFootage468;
        editImportCount++;
        importSuccess468 = true;
        fileName468 = "UNDLM_00468_AVEC_POIGNEES.mov";
        logImportSuccess(468, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00468_AVEC_POIGNEES.mov", fileName468);
    } catch (e) {
        logImportError(468, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00468_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess468 && editFileBis468.exists) {
    try {
        var editFootage468 = project.importFile(new ImportOptions(editFileBis468));
        editFootage468.parentFolder = fromEditFolder;
        editFootage468.name = "UNDLM_00468bis";
        editSources[468] = editFootage468;
        editImportCount++;
        importSuccess468 = true;
        fileName468 = "UNDLM_00468bis.mov";
        logImportSuccess(468, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00468bis.mov", fileName468);
    } catch (e) {
        logImportError(468, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00468bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess468) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00468.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00469
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile469 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00469.mov");
var editFilePoignees469 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00469_AVEC_POIGNEES.mov");
var editFileBis469 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00469bis.mov");

var importSuccess469 = false;
var fileName469 = "";

// Tenter import standard
if (editFile469.exists) {
    try {
        var editFootage469 = project.importFile(new ImportOptions(editFile469));
        editFootage469.parentFolder = fromEditFolder;
        editFootage469.name = "UNDLM_00469";
        editSources[469] = editFootage469;
        editImportCount++;
        importSuccess469 = true;
        fileName469 = "UNDLM_00469.mov";
        logImportSuccess(469, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00469.mov", fileName469);
    } catch (e) {
        logImportError(469, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00469.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess469 && editFilePoignees469.exists) {
    try {
        var editFootage469 = project.importFile(new ImportOptions(editFilePoignees469));
        editFootage469.parentFolder = fromEditFolder;
        editFootage469.name = "UNDLM_00469_AVEC_POIGNEES";
        editSources[469] = editFootage469;
        editImportCount++;
        importSuccess469 = true;
        fileName469 = "UNDLM_00469_AVEC_POIGNEES.mov";
        logImportSuccess(469, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00469_AVEC_POIGNEES.mov", fileName469);
    } catch (e) {
        logImportError(469, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00469_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess469 && editFileBis469.exists) {
    try {
        var editFootage469 = project.importFile(new ImportOptions(editFileBis469));
        editFootage469.parentFolder = fromEditFolder;
        editFootage469.name = "UNDLM_00469bis";
        editSources[469] = editFootage469;
        editImportCount++;
        importSuccess469 = true;
        fileName469 = "UNDLM_00469bis.mov";
        logImportSuccess(469, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00469bis.mov", fileName469);
    } catch (e) {
        logImportError(469, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00469bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess469) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00469.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00470
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile470 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00470.mov");
var editFilePoignees470 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00470_AVEC_POIGNEES.mov");
var editFileBis470 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00470bis.mov");

var importSuccess470 = false;
var fileName470 = "";

// Tenter import standard
if (editFile470.exists) {
    try {
        var editFootage470 = project.importFile(new ImportOptions(editFile470));
        editFootage470.parentFolder = fromEditFolder;
        editFootage470.name = "UNDLM_00470";
        editSources[470] = editFootage470;
        editImportCount++;
        importSuccess470 = true;
        fileName470 = "UNDLM_00470.mov";
        logImportSuccess(470, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00470.mov", fileName470);
    } catch (e) {
        logImportError(470, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00470.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess470 && editFilePoignees470.exists) {
    try {
        var editFootage470 = project.importFile(new ImportOptions(editFilePoignees470));
        editFootage470.parentFolder = fromEditFolder;
        editFootage470.name = "UNDLM_00470_AVEC_POIGNEES";
        editSources[470] = editFootage470;
        editImportCount++;
        importSuccess470 = true;
        fileName470 = "UNDLM_00470_AVEC_POIGNEES.mov";
        logImportSuccess(470, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00470_AVEC_POIGNEES.mov", fileName470);
    } catch (e) {
        logImportError(470, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00470_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess470 && editFileBis470.exists) {
    try {
        var editFootage470 = project.importFile(new ImportOptions(editFileBis470));
        editFootage470.parentFolder = fromEditFolder;
        editFootage470.name = "UNDLM_00470bis";
        editSources[470] = editFootage470;
        editImportCount++;
        importSuccess470 = true;
        fileName470 = "UNDLM_00470bis.mov";
        logImportSuccess(470, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00470bis.mov", fileName470);
    } catch (e) {
        logImportError(470, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00470bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess470) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00470.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00471
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile471 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00471.mov");
var editFilePoignees471 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00471_AVEC_POIGNEES.mov");
var editFileBis471 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00471bis.mov");

var importSuccess471 = false;
var fileName471 = "";

// Tenter import standard
if (editFile471.exists) {
    try {
        var editFootage471 = project.importFile(new ImportOptions(editFile471));
        editFootage471.parentFolder = fromEditFolder;
        editFootage471.name = "UNDLM_00471";
        editSources[471] = editFootage471;
        editImportCount++;
        importSuccess471 = true;
        fileName471 = "UNDLM_00471.mov";
        logImportSuccess(471, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00471.mov", fileName471);
    } catch (e) {
        logImportError(471, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00471.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess471 && editFilePoignees471.exists) {
    try {
        var editFootage471 = project.importFile(new ImportOptions(editFilePoignees471));
        editFootage471.parentFolder = fromEditFolder;
        editFootage471.name = "UNDLM_00471_AVEC_POIGNEES";
        editSources[471] = editFootage471;
        editImportCount++;
        importSuccess471 = true;
        fileName471 = "UNDLM_00471_AVEC_POIGNEES.mov";
        logImportSuccess(471, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00471_AVEC_POIGNEES.mov", fileName471);
    } catch (e) {
        logImportError(471, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00471_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess471 && editFileBis471.exists) {
    try {
        var editFootage471 = project.importFile(new ImportOptions(editFileBis471));
        editFootage471.parentFolder = fromEditFolder;
        editFootage471.name = "UNDLM_00471bis";
        editSources[471] = editFootage471;
        editImportCount++;
        importSuccess471 = true;
        fileName471 = "UNDLM_00471bis.mov";
        logImportSuccess(471, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00471bis.mov", fileName471);
    } catch (e) {
        logImportError(471, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00471bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess471) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00471.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00472
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile472 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00472.mov");
var editFilePoignees472 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00472_AVEC_POIGNEES.mov");
var editFileBis472 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00472bis.mov");

var importSuccess472 = false;
var fileName472 = "";

// Tenter import standard
if (editFile472.exists) {
    try {
        var editFootage472 = project.importFile(new ImportOptions(editFile472));
        editFootage472.parentFolder = fromEditFolder;
        editFootage472.name = "UNDLM_00472";
        editSources[472] = editFootage472;
        editImportCount++;
        importSuccess472 = true;
        fileName472 = "UNDLM_00472.mov";
        logImportSuccess(472, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00472.mov", fileName472);
    } catch (e) {
        logImportError(472, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00472.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess472 && editFilePoignees472.exists) {
    try {
        var editFootage472 = project.importFile(new ImportOptions(editFilePoignees472));
        editFootage472.parentFolder = fromEditFolder;
        editFootage472.name = "UNDLM_00472_AVEC_POIGNEES";
        editSources[472] = editFootage472;
        editImportCount++;
        importSuccess472 = true;
        fileName472 = "UNDLM_00472_AVEC_POIGNEES.mov";
        logImportSuccess(472, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00472_AVEC_POIGNEES.mov", fileName472);
    } catch (e) {
        logImportError(472, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00472_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess472 && editFileBis472.exists) {
    try {
        var editFootage472 = project.importFile(new ImportOptions(editFileBis472));
        editFootage472.parentFolder = fromEditFolder;
        editFootage472.name = "UNDLM_00472bis";
        editSources[472] = editFootage472;
        editImportCount++;
        importSuccess472 = true;
        fileName472 = "UNDLM_00472bis.mov";
        logImportSuccess(472, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00472bis.mov", fileName472);
    } catch (e) {
        logImportError(472, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00472bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess472) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00472.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00473
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile473 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00473.mov");
var editFilePoignees473 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00473_AVEC_POIGNEES.mov");
var editFileBis473 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00473bis.mov");

var importSuccess473 = false;
var fileName473 = "";

// Tenter import standard
if (editFile473.exists) {
    try {
        var editFootage473 = project.importFile(new ImportOptions(editFile473));
        editFootage473.parentFolder = fromEditFolder;
        editFootage473.name = "UNDLM_00473";
        editSources[473] = editFootage473;
        editImportCount++;
        importSuccess473 = true;
        fileName473 = "UNDLM_00473.mov";
        logImportSuccess(473, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00473.mov", fileName473);
    } catch (e) {
        logImportError(473, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00473.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess473 && editFilePoignees473.exists) {
    try {
        var editFootage473 = project.importFile(new ImportOptions(editFilePoignees473));
        editFootage473.parentFolder = fromEditFolder;
        editFootage473.name = "UNDLM_00473_AVEC_POIGNEES";
        editSources[473] = editFootage473;
        editImportCount++;
        importSuccess473 = true;
        fileName473 = "UNDLM_00473_AVEC_POIGNEES.mov";
        logImportSuccess(473, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00473_AVEC_POIGNEES.mov", fileName473);
    } catch (e) {
        logImportError(473, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00473_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess473 && editFileBis473.exists) {
    try {
        var editFootage473 = project.importFile(new ImportOptions(editFileBis473));
        editFootage473.parentFolder = fromEditFolder;
        editFootage473.name = "UNDLM_00473bis";
        editSources[473] = editFootage473;
        editImportCount++;
        importSuccess473 = true;
        fileName473 = "UNDLM_00473bis.mov";
        logImportSuccess(473, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00473bis.mov", fileName473);
    } catch (e) {
        logImportError(473, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00473bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess473) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00473.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00474
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile474 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00474.mov");
var editFilePoignees474 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00474_AVEC_POIGNEES.mov");
var editFileBis474 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00474bis.mov");

var importSuccess474 = false;
var fileName474 = "";

// Tenter import standard
if (editFile474.exists) {
    try {
        var editFootage474 = project.importFile(new ImportOptions(editFile474));
        editFootage474.parentFolder = fromEditFolder;
        editFootage474.name = "UNDLM_00474";
        editSources[474] = editFootage474;
        editImportCount++;
        importSuccess474 = true;
        fileName474 = "UNDLM_00474.mov";
        logImportSuccess(474, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00474.mov", fileName474);
    } catch (e) {
        logImportError(474, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00474.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess474 && editFilePoignees474.exists) {
    try {
        var editFootage474 = project.importFile(new ImportOptions(editFilePoignees474));
        editFootage474.parentFolder = fromEditFolder;
        editFootage474.name = "UNDLM_00474_AVEC_POIGNEES";
        editSources[474] = editFootage474;
        editImportCount++;
        importSuccess474 = true;
        fileName474 = "UNDLM_00474_AVEC_POIGNEES.mov";
        logImportSuccess(474, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00474_AVEC_POIGNEES.mov", fileName474);
    } catch (e) {
        logImportError(474, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00474_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess474 && editFileBis474.exists) {
    try {
        var editFootage474 = project.importFile(new ImportOptions(editFileBis474));
        editFootage474.parentFolder = fromEditFolder;
        editFootage474.name = "UNDLM_00474bis";
        editSources[474] = editFootage474;
        editImportCount++;
        importSuccess474 = true;
        fileName474 = "UNDLM_00474bis.mov";
        logImportSuccess(474, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00474bis.mov", fileName474);
    } catch (e) {
        logImportError(474, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00474bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess474) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00474.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00475
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile475 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00475.mov");
var editFilePoignees475 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00475_AVEC_POIGNEES.mov");
var editFileBis475 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00475bis.mov");

var importSuccess475 = false;
var fileName475 = "";

// Tenter import standard
if (editFile475.exists) {
    try {
        var editFootage475 = project.importFile(new ImportOptions(editFile475));
        editFootage475.parentFolder = fromEditFolder;
        editFootage475.name = "UNDLM_00475";
        editSources[475] = editFootage475;
        editImportCount++;
        importSuccess475 = true;
        fileName475 = "UNDLM_00475.mov";
        logImportSuccess(475, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00475.mov", fileName475);
    } catch (e) {
        logImportError(475, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00475.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess475 && editFilePoignees475.exists) {
    try {
        var editFootage475 = project.importFile(new ImportOptions(editFilePoignees475));
        editFootage475.parentFolder = fromEditFolder;
        editFootage475.name = "UNDLM_00475_AVEC_POIGNEES";
        editSources[475] = editFootage475;
        editImportCount++;
        importSuccess475 = true;
        fileName475 = "UNDLM_00475_AVEC_POIGNEES.mov";
        logImportSuccess(475, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00475_AVEC_POIGNEES.mov", fileName475);
    } catch (e) {
        logImportError(475, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00475_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess475 && editFileBis475.exists) {
    try {
        var editFootage475 = project.importFile(new ImportOptions(editFileBis475));
        editFootage475.parentFolder = fromEditFolder;
        editFootage475.name = "UNDLM_00475bis";
        editSources[475] = editFootage475;
        editImportCount++;
        importSuccess475 = true;
        fileName475 = "UNDLM_00475bis.mov";
        logImportSuccess(475, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00475bis.mov", fileName475);
    } catch (e) {
        logImportError(475, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00475bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess475) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00475.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00476
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile476 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00476.mov");
var editFilePoignees476 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00476_AVEC_POIGNEES.mov");
var editFileBis476 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00476bis.mov");

var importSuccess476 = false;
var fileName476 = "";

// Tenter import standard
if (editFile476.exists) {
    try {
        var editFootage476 = project.importFile(new ImportOptions(editFile476));
        editFootage476.parentFolder = fromEditFolder;
        editFootage476.name = "UNDLM_00476";
        editSources[476] = editFootage476;
        editImportCount++;
        importSuccess476 = true;
        fileName476 = "UNDLM_00476.mov";
        logImportSuccess(476, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00476.mov", fileName476);
    } catch (e) {
        logImportError(476, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00476.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess476 && editFilePoignees476.exists) {
    try {
        var editFootage476 = project.importFile(new ImportOptions(editFilePoignees476));
        editFootage476.parentFolder = fromEditFolder;
        editFootage476.name = "UNDLM_00476_AVEC_POIGNEES";
        editSources[476] = editFootage476;
        editImportCount++;
        importSuccess476 = true;
        fileName476 = "UNDLM_00476_AVEC_POIGNEES.mov";
        logImportSuccess(476, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00476_AVEC_POIGNEES.mov", fileName476);
    } catch (e) {
        logImportError(476, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00476_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess476 && editFileBis476.exists) {
    try {
        var editFootage476 = project.importFile(new ImportOptions(editFileBis476));
        editFootage476.parentFolder = fromEditFolder;
        editFootage476.name = "UNDLM_00476bis";
        editSources[476] = editFootage476;
        editImportCount++;
        importSuccess476 = true;
        fileName476 = "UNDLM_00476bis.mov";
        logImportSuccess(476, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00476bis.mov", fileName476);
    } catch (e) {
        logImportError(476, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00476bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess476) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00476.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00477
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile477 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00477.mov");
var editFilePoignees477 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00477_AVEC_POIGNEES.mov");
var editFileBis477 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00477bis.mov");

var importSuccess477 = false;
var fileName477 = "";

// Tenter import standard
if (editFile477.exists) {
    try {
        var editFootage477 = project.importFile(new ImportOptions(editFile477));
        editFootage477.parentFolder = fromEditFolder;
        editFootage477.name = "UNDLM_00477";
        editSources[477] = editFootage477;
        editImportCount++;
        importSuccess477 = true;
        fileName477 = "UNDLM_00477.mov";
        logImportSuccess(477, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00477.mov", fileName477);
    } catch (e) {
        logImportError(477, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00477.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess477 && editFilePoignees477.exists) {
    try {
        var editFootage477 = project.importFile(new ImportOptions(editFilePoignees477));
        editFootage477.parentFolder = fromEditFolder;
        editFootage477.name = "UNDLM_00477_AVEC_POIGNEES";
        editSources[477] = editFootage477;
        editImportCount++;
        importSuccess477 = true;
        fileName477 = "UNDLM_00477_AVEC_POIGNEES.mov";
        logImportSuccess(477, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00477_AVEC_POIGNEES.mov", fileName477);
    } catch (e) {
        logImportError(477, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00477_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess477 && editFileBis477.exists) {
    try {
        var editFootage477 = project.importFile(new ImportOptions(editFileBis477));
        editFootage477.parentFolder = fromEditFolder;
        editFootage477.name = "UNDLM_00477bis";
        editSources[477] = editFootage477;
        editImportCount++;
        importSuccess477 = true;
        fileName477 = "UNDLM_00477bis.mov";
        logImportSuccess(477, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00477bis.mov", fileName477);
    } catch (e) {
        logImportError(477, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00477bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess477) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00477.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00478
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile478 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00478.mov");
var editFilePoignees478 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00478_AVEC_POIGNEES.mov");
var editFileBis478 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00478bis.mov");

var importSuccess478 = false;
var fileName478 = "";

// Tenter import standard
if (editFile478.exists) {
    try {
        var editFootage478 = project.importFile(new ImportOptions(editFile478));
        editFootage478.parentFolder = fromEditFolder;
        editFootage478.name = "UNDLM_00478";
        editSources[478] = editFootage478;
        editImportCount++;
        importSuccess478 = true;
        fileName478 = "UNDLM_00478.mov";
        logImportSuccess(478, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00478.mov", fileName478);
    } catch (e) {
        logImportError(478, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00478.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess478 && editFilePoignees478.exists) {
    try {
        var editFootage478 = project.importFile(new ImportOptions(editFilePoignees478));
        editFootage478.parentFolder = fromEditFolder;
        editFootage478.name = "UNDLM_00478_AVEC_POIGNEES";
        editSources[478] = editFootage478;
        editImportCount++;
        importSuccess478 = true;
        fileName478 = "UNDLM_00478_AVEC_POIGNEES.mov";
        logImportSuccess(478, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00478_AVEC_POIGNEES.mov", fileName478);
    } catch (e) {
        logImportError(478, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00478_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess478 && editFileBis478.exists) {
    try {
        var editFootage478 = project.importFile(new ImportOptions(editFileBis478));
        editFootage478.parentFolder = fromEditFolder;
        editFootage478.name = "UNDLM_00478bis";
        editSources[478] = editFootage478;
        editImportCount++;
        importSuccess478 = true;
        fileName478 = "UNDLM_00478bis.mov";
        logImportSuccess(478, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00478bis.mov", fileName478);
    } catch (e) {
        logImportError(478, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00478bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess478) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00478.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00464
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile464 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00464.mov");
var gradedFilePoignees464 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00464_AVEC_POIGNEES.mov");
var gradedFileBis464 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00464bis.mov");

var gradedImportSuccess464 = false;
var gradedFileName464 = "";

// Tenter import standard
if (gradedFile464.exists) {
    try {
        var gradedFootage464 = project.importFile(new ImportOptions(gradedFile464));
        gradedFootage464.parentFolder = fromGradingFolder;
        gradedFootage464.name = "UNDLM_00464";
        gradingSources[464] = gradedFootage464;
        gradingImportCount++;
        gradedImportSuccess464 = true;
        gradedFileName464 = "UNDLM_00464.mov";
        logImportSuccess(464, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00464.mov", gradedFileName464);
    } catch (e) {
        logImportError(464, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00464.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess464 && gradedFilePoignees464.exists) {
    try {
        var gradedFootage464 = project.importFile(new ImportOptions(gradedFilePoignees464));
        gradedFootage464.parentFolder = fromGradingFolder;
        gradedFootage464.name = "UNDLM_00464_AVEC_POIGNEES";
        gradingSources[464] = gradedFootage464;
        gradingImportCount++;
        gradedImportSuccess464 = true;
        gradedFileName464 = "UNDLM_00464_AVEC_POIGNEES.mov";
        logImportSuccess(464, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00464_AVEC_POIGNEES.mov", gradedFileName464);
    } catch (e) {
        logImportError(464, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00464_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess464 && gradedFileBis464.exists) {
    try {
        var gradedFootage464 = project.importFile(new ImportOptions(gradedFileBis464));
        gradedFootage464.parentFolder = fromGradingFolder;
        gradedFootage464.name = "UNDLM_00464bis";
        gradingSources[464] = gradedFootage464;
        gradingImportCount++;
        gradedImportSuccess464 = true;
        gradedFileName464 = "UNDLM_00464bis.mov";
        logImportSuccess(464, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00464bis.mov", gradedFileName464);
    } catch (e) {
        logImportError(464, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00464bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess464) {
    missingGradingCount++;
}

// Import plan GRADED 00465
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile465 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00465.mov");
var gradedFilePoignees465 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00465_AVEC_POIGNEES.mov");
var gradedFileBis465 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00465bis.mov");

var gradedImportSuccess465 = false;
var gradedFileName465 = "";

// Tenter import standard
if (gradedFile465.exists) {
    try {
        var gradedFootage465 = project.importFile(new ImportOptions(gradedFile465));
        gradedFootage465.parentFolder = fromGradingFolder;
        gradedFootage465.name = "UNDLM_00465";
        gradingSources[465] = gradedFootage465;
        gradingImportCount++;
        gradedImportSuccess465 = true;
        gradedFileName465 = "UNDLM_00465.mov";
        logImportSuccess(465, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00465.mov", gradedFileName465);
    } catch (e) {
        logImportError(465, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00465.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess465 && gradedFilePoignees465.exists) {
    try {
        var gradedFootage465 = project.importFile(new ImportOptions(gradedFilePoignees465));
        gradedFootage465.parentFolder = fromGradingFolder;
        gradedFootage465.name = "UNDLM_00465_AVEC_POIGNEES";
        gradingSources[465] = gradedFootage465;
        gradingImportCount++;
        gradedImportSuccess465 = true;
        gradedFileName465 = "UNDLM_00465_AVEC_POIGNEES.mov";
        logImportSuccess(465, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00465_AVEC_POIGNEES.mov", gradedFileName465);
    } catch (e) {
        logImportError(465, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00465_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess465 && gradedFileBis465.exists) {
    try {
        var gradedFootage465 = project.importFile(new ImportOptions(gradedFileBis465));
        gradedFootage465.parentFolder = fromGradingFolder;
        gradedFootage465.name = "UNDLM_00465bis";
        gradingSources[465] = gradedFootage465;
        gradingImportCount++;
        gradedImportSuccess465 = true;
        gradedFileName465 = "UNDLM_00465bis.mov";
        logImportSuccess(465, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00465bis.mov", gradedFileName465);
    } catch (e) {
        logImportError(465, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00465bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess465) {
    missingGradingCount++;
}

// Import plan GRADED 00466
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile466 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00466.mov");
var gradedFilePoignees466 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00466_AVEC_POIGNEES.mov");
var gradedFileBis466 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00466bis.mov");

var gradedImportSuccess466 = false;
var gradedFileName466 = "";

// Tenter import standard
if (gradedFile466.exists) {
    try {
        var gradedFootage466 = project.importFile(new ImportOptions(gradedFile466));
        gradedFootage466.parentFolder = fromGradingFolder;
        gradedFootage466.name = "UNDLM_00466";
        gradingSources[466] = gradedFootage466;
        gradingImportCount++;
        gradedImportSuccess466 = true;
        gradedFileName466 = "UNDLM_00466.mov";
        logImportSuccess(466, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00466.mov", gradedFileName466);
    } catch (e) {
        logImportError(466, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00466.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess466 && gradedFilePoignees466.exists) {
    try {
        var gradedFootage466 = project.importFile(new ImportOptions(gradedFilePoignees466));
        gradedFootage466.parentFolder = fromGradingFolder;
        gradedFootage466.name = "UNDLM_00466_AVEC_POIGNEES";
        gradingSources[466] = gradedFootage466;
        gradingImportCount++;
        gradedImportSuccess466 = true;
        gradedFileName466 = "UNDLM_00466_AVEC_POIGNEES.mov";
        logImportSuccess(466, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00466_AVEC_POIGNEES.mov", gradedFileName466);
    } catch (e) {
        logImportError(466, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00466_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess466 && gradedFileBis466.exists) {
    try {
        var gradedFootage466 = project.importFile(new ImportOptions(gradedFileBis466));
        gradedFootage466.parentFolder = fromGradingFolder;
        gradedFootage466.name = "UNDLM_00466bis";
        gradingSources[466] = gradedFootage466;
        gradingImportCount++;
        gradedImportSuccess466 = true;
        gradedFileName466 = "UNDLM_00466bis.mov";
        logImportSuccess(466, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00466bis.mov", gradedFileName466);
    } catch (e) {
        logImportError(466, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00466bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess466) {
    missingGradingCount++;
}

// Import plan GRADED 00467
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile467 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00467.mov");
var gradedFilePoignees467 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00467_AVEC_POIGNEES.mov");
var gradedFileBis467 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00467bis.mov");

var gradedImportSuccess467 = false;
var gradedFileName467 = "";

// Tenter import standard
if (gradedFile467.exists) {
    try {
        var gradedFootage467 = project.importFile(new ImportOptions(gradedFile467));
        gradedFootage467.parentFolder = fromGradingFolder;
        gradedFootage467.name = "UNDLM_00467";
        gradingSources[467] = gradedFootage467;
        gradingImportCount++;
        gradedImportSuccess467 = true;
        gradedFileName467 = "UNDLM_00467.mov";
        logImportSuccess(467, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00467.mov", gradedFileName467);
    } catch (e) {
        logImportError(467, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00467.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess467 && gradedFilePoignees467.exists) {
    try {
        var gradedFootage467 = project.importFile(new ImportOptions(gradedFilePoignees467));
        gradedFootage467.parentFolder = fromGradingFolder;
        gradedFootage467.name = "UNDLM_00467_AVEC_POIGNEES";
        gradingSources[467] = gradedFootage467;
        gradingImportCount++;
        gradedImportSuccess467 = true;
        gradedFileName467 = "UNDLM_00467_AVEC_POIGNEES.mov";
        logImportSuccess(467, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00467_AVEC_POIGNEES.mov", gradedFileName467);
    } catch (e) {
        logImportError(467, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00467_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess467 && gradedFileBis467.exists) {
    try {
        var gradedFootage467 = project.importFile(new ImportOptions(gradedFileBis467));
        gradedFootage467.parentFolder = fromGradingFolder;
        gradedFootage467.name = "UNDLM_00467bis";
        gradingSources[467] = gradedFootage467;
        gradingImportCount++;
        gradedImportSuccess467 = true;
        gradedFileName467 = "UNDLM_00467bis.mov";
        logImportSuccess(467, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00467bis.mov", gradedFileName467);
    } catch (e) {
        logImportError(467, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00467bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess467) {
    missingGradingCount++;
}

// Import plan GRADED 00468
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile468 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00468.mov");
var gradedFilePoignees468 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00468_AVEC_POIGNEES.mov");
var gradedFileBis468 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00468bis.mov");

var gradedImportSuccess468 = false;
var gradedFileName468 = "";

// Tenter import standard
if (gradedFile468.exists) {
    try {
        var gradedFootage468 = project.importFile(new ImportOptions(gradedFile468));
        gradedFootage468.parentFolder = fromGradingFolder;
        gradedFootage468.name = "UNDLM_00468";
        gradingSources[468] = gradedFootage468;
        gradingImportCount++;
        gradedImportSuccess468 = true;
        gradedFileName468 = "UNDLM_00468.mov";
        logImportSuccess(468, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00468.mov", gradedFileName468);
    } catch (e) {
        logImportError(468, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00468.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess468 && gradedFilePoignees468.exists) {
    try {
        var gradedFootage468 = project.importFile(new ImportOptions(gradedFilePoignees468));
        gradedFootage468.parentFolder = fromGradingFolder;
        gradedFootage468.name = "UNDLM_00468_AVEC_POIGNEES";
        gradingSources[468] = gradedFootage468;
        gradingImportCount++;
        gradedImportSuccess468 = true;
        gradedFileName468 = "UNDLM_00468_AVEC_POIGNEES.mov";
        logImportSuccess(468, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00468_AVEC_POIGNEES.mov", gradedFileName468);
    } catch (e) {
        logImportError(468, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00468_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess468 && gradedFileBis468.exists) {
    try {
        var gradedFootage468 = project.importFile(new ImportOptions(gradedFileBis468));
        gradedFootage468.parentFolder = fromGradingFolder;
        gradedFootage468.name = "UNDLM_00468bis";
        gradingSources[468] = gradedFootage468;
        gradingImportCount++;
        gradedImportSuccess468 = true;
        gradedFileName468 = "UNDLM_00468bis.mov";
        logImportSuccess(468, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00468bis.mov", gradedFileName468);
    } catch (e) {
        logImportError(468, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00468bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess468) {
    missingGradingCount++;
}

// Import plan GRADED 00469
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile469 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00469.mov");
var gradedFilePoignees469 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00469_AVEC_POIGNEES.mov");
var gradedFileBis469 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00469bis.mov");

var gradedImportSuccess469 = false;
var gradedFileName469 = "";

// Tenter import standard
if (gradedFile469.exists) {
    try {
        var gradedFootage469 = project.importFile(new ImportOptions(gradedFile469));
        gradedFootage469.parentFolder = fromGradingFolder;
        gradedFootage469.name = "UNDLM_00469";
        gradingSources[469] = gradedFootage469;
        gradingImportCount++;
        gradedImportSuccess469 = true;
        gradedFileName469 = "UNDLM_00469.mov";
        logImportSuccess(469, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00469.mov", gradedFileName469);
    } catch (e) {
        logImportError(469, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00469.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess469 && gradedFilePoignees469.exists) {
    try {
        var gradedFootage469 = project.importFile(new ImportOptions(gradedFilePoignees469));
        gradedFootage469.parentFolder = fromGradingFolder;
        gradedFootage469.name = "UNDLM_00469_AVEC_POIGNEES";
        gradingSources[469] = gradedFootage469;
        gradingImportCount++;
        gradedImportSuccess469 = true;
        gradedFileName469 = "UNDLM_00469_AVEC_POIGNEES.mov";
        logImportSuccess(469, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00469_AVEC_POIGNEES.mov", gradedFileName469);
    } catch (e) {
        logImportError(469, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00469_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess469 && gradedFileBis469.exists) {
    try {
        var gradedFootage469 = project.importFile(new ImportOptions(gradedFileBis469));
        gradedFootage469.parentFolder = fromGradingFolder;
        gradedFootage469.name = "UNDLM_00469bis";
        gradingSources[469] = gradedFootage469;
        gradingImportCount++;
        gradedImportSuccess469 = true;
        gradedFileName469 = "UNDLM_00469bis.mov";
        logImportSuccess(469, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00469bis.mov", gradedFileName469);
    } catch (e) {
        logImportError(469, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00469bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess469) {
    missingGradingCount++;
}

// Import plan GRADED 00470
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile470 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00470.mov");
var gradedFilePoignees470 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00470_AVEC_POIGNEES.mov");
var gradedFileBis470 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00470bis.mov");

var gradedImportSuccess470 = false;
var gradedFileName470 = "";

// Tenter import standard
if (gradedFile470.exists) {
    try {
        var gradedFootage470 = project.importFile(new ImportOptions(gradedFile470));
        gradedFootage470.parentFolder = fromGradingFolder;
        gradedFootage470.name = "UNDLM_00470";
        gradingSources[470] = gradedFootage470;
        gradingImportCount++;
        gradedImportSuccess470 = true;
        gradedFileName470 = "UNDLM_00470.mov";
        logImportSuccess(470, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00470.mov", gradedFileName470);
    } catch (e) {
        logImportError(470, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00470.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess470 && gradedFilePoignees470.exists) {
    try {
        var gradedFootage470 = project.importFile(new ImportOptions(gradedFilePoignees470));
        gradedFootage470.parentFolder = fromGradingFolder;
        gradedFootage470.name = "UNDLM_00470_AVEC_POIGNEES";
        gradingSources[470] = gradedFootage470;
        gradingImportCount++;
        gradedImportSuccess470 = true;
        gradedFileName470 = "UNDLM_00470_AVEC_POIGNEES.mov";
        logImportSuccess(470, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00470_AVEC_POIGNEES.mov", gradedFileName470);
    } catch (e) {
        logImportError(470, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00470_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess470 && gradedFileBis470.exists) {
    try {
        var gradedFootage470 = project.importFile(new ImportOptions(gradedFileBis470));
        gradedFootage470.parentFolder = fromGradingFolder;
        gradedFootage470.name = "UNDLM_00470bis";
        gradingSources[470] = gradedFootage470;
        gradingImportCount++;
        gradedImportSuccess470 = true;
        gradedFileName470 = "UNDLM_00470bis.mov";
        logImportSuccess(470, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00470bis.mov", gradedFileName470);
    } catch (e) {
        logImportError(470, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00470bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess470) {
    missingGradingCount++;
}

// Import plan GRADED 00471
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile471 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00471.mov");
var gradedFilePoignees471 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00471_AVEC_POIGNEES.mov");
var gradedFileBis471 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00471bis.mov");

var gradedImportSuccess471 = false;
var gradedFileName471 = "";

// Tenter import standard
if (gradedFile471.exists) {
    try {
        var gradedFootage471 = project.importFile(new ImportOptions(gradedFile471));
        gradedFootage471.parentFolder = fromGradingFolder;
        gradedFootage471.name = "UNDLM_00471";
        gradingSources[471] = gradedFootage471;
        gradingImportCount++;
        gradedImportSuccess471 = true;
        gradedFileName471 = "UNDLM_00471.mov";
        logImportSuccess(471, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00471.mov", gradedFileName471);
    } catch (e) {
        logImportError(471, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00471.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess471 && gradedFilePoignees471.exists) {
    try {
        var gradedFootage471 = project.importFile(new ImportOptions(gradedFilePoignees471));
        gradedFootage471.parentFolder = fromGradingFolder;
        gradedFootage471.name = "UNDLM_00471_AVEC_POIGNEES";
        gradingSources[471] = gradedFootage471;
        gradingImportCount++;
        gradedImportSuccess471 = true;
        gradedFileName471 = "UNDLM_00471_AVEC_POIGNEES.mov";
        logImportSuccess(471, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00471_AVEC_POIGNEES.mov", gradedFileName471);
    } catch (e) {
        logImportError(471, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00471_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess471 && gradedFileBis471.exists) {
    try {
        var gradedFootage471 = project.importFile(new ImportOptions(gradedFileBis471));
        gradedFootage471.parentFolder = fromGradingFolder;
        gradedFootage471.name = "UNDLM_00471bis";
        gradingSources[471] = gradedFootage471;
        gradingImportCount++;
        gradedImportSuccess471 = true;
        gradedFileName471 = "UNDLM_00471bis.mov";
        logImportSuccess(471, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00471bis.mov", gradedFileName471);
    } catch (e) {
        logImportError(471, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00471bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess471) {
    missingGradingCount++;
}

// Import plan GRADED 00472
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile472 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00472.mov");
var gradedFilePoignees472 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00472_AVEC_POIGNEES.mov");
var gradedFileBis472 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00472bis.mov");

var gradedImportSuccess472 = false;
var gradedFileName472 = "";

// Tenter import standard
if (gradedFile472.exists) {
    try {
        var gradedFootage472 = project.importFile(new ImportOptions(gradedFile472));
        gradedFootage472.parentFolder = fromGradingFolder;
        gradedFootage472.name = "UNDLM_00472";
        gradingSources[472] = gradedFootage472;
        gradingImportCount++;
        gradedImportSuccess472 = true;
        gradedFileName472 = "UNDLM_00472.mov";
        logImportSuccess(472, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00472.mov", gradedFileName472);
    } catch (e) {
        logImportError(472, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00472.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess472 && gradedFilePoignees472.exists) {
    try {
        var gradedFootage472 = project.importFile(new ImportOptions(gradedFilePoignees472));
        gradedFootage472.parentFolder = fromGradingFolder;
        gradedFootage472.name = "UNDLM_00472_AVEC_POIGNEES";
        gradingSources[472] = gradedFootage472;
        gradingImportCount++;
        gradedImportSuccess472 = true;
        gradedFileName472 = "UNDLM_00472_AVEC_POIGNEES.mov";
        logImportSuccess(472, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00472_AVEC_POIGNEES.mov", gradedFileName472);
    } catch (e) {
        logImportError(472, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00472_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess472 && gradedFileBis472.exists) {
    try {
        var gradedFootage472 = project.importFile(new ImportOptions(gradedFileBis472));
        gradedFootage472.parentFolder = fromGradingFolder;
        gradedFootage472.name = "UNDLM_00472bis";
        gradingSources[472] = gradedFootage472;
        gradingImportCount++;
        gradedImportSuccess472 = true;
        gradedFileName472 = "UNDLM_00472bis.mov";
        logImportSuccess(472, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00472bis.mov", gradedFileName472);
    } catch (e) {
        logImportError(472, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00472bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess472) {
    missingGradingCount++;
}

// Import plan GRADED 00473
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile473 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00473.mov");
var gradedFilePoignees473 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00473_AVEC_POIGNEES.mov");
var gradedFileBis473 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00473bis.mov");

var gradedImportSuccess473 = false;
var gradedFileName473 = "";

// Tenter import standard
if (gradedFile473.exists) {
    try {
        var gradedFootage473 = project.importFile(new ImportOptions(gradedFile473));
        gradedFootage473.parentFolder = fromGradingFolder;
        gradedFootage473.name = "UNDLM_00473";
        gradingSources[473] = gradedFootage473;
        gradingImportCount++;
        gradedImportSuccess473 = true;
        gradedFileName473 = "UNDLM_00473.mov";
        logImportSuccess(473, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00473.mov", gradedFileName473);
    } catch (e) {
        logImportError(473, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00473.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess473 && gradedFilePoignees473.exists) {
    try {
        var gradedFootage473 = project.importFile(new ImportOptions(gradedFilePoignees473));
        gradedFootage473.parentFolder = fromGradingFolder;
        gradedFootage473.name = "UNDLM_00473_AVEC_POIGNEES";
        gradingSources[473] = gradedFootage473;
        gradingImportCount++;
        gradedImportSuccess473 = true;
        gradedFileName473 = "UNDLM_00473_AVEC_POIGNEES.mov";
        logImportSuccess(473, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00473_AVEC_POIGNEES.mov", gradedFileName473);
    } catch (e) {
        logImportError(473, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00473_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess473 && gradedFileBis473.exists) {
    try {
        var gradedFootage473 = project.importFile(new ImportOptions(gradedFileBis473));
        gradedFootage473.parentFolder = fromGradingFolder;
        gradedFootage473.name = "UNDLM_00473bis";
        gradingSources[473] = gradedFootage473;
        gradingImportCount++;
        gradedImportSuccess473 = true;
        gradedFileName473 = "UNDLM_00473bis.mov";
        logImportSuccess(473, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00473bis.mov", gradedFileName473);
    } catch (e) {
        logImportError(473, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00473bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess473) {
    missingGradingCount++;
}

// Import plan GRADED 00474
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile474 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00474.mov");
var gradedFilePoignees474 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00474_AVEC_POIGNEES.mov");
var gradedFileBis474 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00474bis.mov");

var gradedImportSuccess474 = false;
var gradedFileName474 = "";

// Tenter import standard
if (gradedFile474.exists) {
    try {
        var gradedFootage474 = project.importFile(new ImportOptions(gradedFile474));
        gradedFootage474.parentFolder = fromGradingFolder;
        gradedFootage474.name = "UNDLM_00474";
        gradingSources[474] = gradedFootage474;
        gradingImportCount++;
        gradedImportSuccess474 = true;
        gradedFileName474 = "UNDLM_00474.mov";
        logImportSuccess(474, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00474.mov", gradedFileName474);
    } catch (e) {
        logImportError(474, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00474.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess474 && gradedFilePoignees474.exists) {
    try {
        var gradedFootage474 = project.importFile(new ImportOptions(gradedFilePoignees474));
        gradedFootage474.parentFolder = fromGradingFolder;
        gradedFootage474.name = "UNDLM_00474_AVEC_POIGNEES";
        gradingSources[474] = gradedFootage474;
        gradingImportCount++;
        gradedImportSuccess474 = true;
        gradedFileName474 = "UNDLM_00474_AVEC_POIGNEES.mov";
        logImportSuccess(474, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00474_AVEC_POIGNEES.mov", gradedFileName474);
    } catch (e) {
        logImportError(474, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00474_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess474 && gradedFileBis474.exists) {
    try {
        var gradedFootage474 = project.importFile(new ImportOptions(gradedFileBis474));
        gradedFootage474.parentFolder = fromGradingFolder;
        gradedFootage474.name = "UNDLM_00474bis";
        gradingSources[474] = gradedFootage474;
        gradingImportCount++;
        gradedImportSuccess474 = true;
        gradedFileName474 = "UNDLM_00474bis.mov";
        logImportSuccess(474, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00474bis.mov", gradedFileName474);
    } catch (e) {
        logImportError(474, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00474bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess474) {
    missingGradingCount++;
}

// Import plan GRADED 00475
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile475 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00475.mov");
var gradedFilePoignees475 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00475_AVEC_POIGNEES.mov");
var gradedFileBis475 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00475bis.mov");

var gradedImportSuccess475 = false;
var gradedFileName475 = "";

// Tenter import standard
if (gradedFile475.exists) {
    try {
        var gradedFootage475 = project.importFile(new ImportOptions(gradedFile475));
        gradedFootage475.parentFolder = fromGradingFolder;
        gradedFootage475.name = "UNDLM_00475";
        gradingSources[475] = gradedFootage475;
        gradingImportCount++;
        gradedImportSuccess475 = true;
        gradedFileName475 = "UNDLM_00475.mov";
        logImportSuccess(475, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00475.mov", gradedFileName475);
    } catch (e) {
        logImportError(475, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00475.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess475 && gradedFilePoignees475.exists) {
    try {
        var gradedFootage475 = project.importFile(new ImportOptions(gradedFilePoignees475));
        gradedFootage475.parentFolder = fromGradingFolder;
        gradedFootage475.name = "UNDLM_00475_AVEC_POIGNEES";
        gradingSources[475] = gradedFootage475;
        gradingImportCount++;
        gradedImportSuccess475 = true;
        gradedFileName475 = "UNDLM_00475_AVEC_POIGNEES.mov";
        logImportSuccess(475, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00475_AVEC_POIGNEES.mov", gradedFileName475);
    } catch (e) {
        logImportError(475, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00475_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess475 && gradedFileBis475.exists) {
    try {
        var gradedFootage475 = project.importFile(new ImportOptions(gradedFileBis475));
        gradedFootage475.parentFolder = fromGradingFolder;
        gradedFootage475.name = "UNDLM_00475bis";
        gradingSources[475] = gradedFootage475;
        gradingImportCount++;
        gradedImportSuccess475 = true;
        gradedFileName475 = "UNDLM_00475bis.mov";
        logImportSuccess(475, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00475bis.mov", gradedFileName475);
    } catch (e) {
        logImportError(475, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00475bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess475) {
    missingGradingCount++;
}

// Import plan GRADED 00476
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile476 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00476.mov");
var gradedFilePoignees476 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00476_AVEC_POIGNEES.mov");
var gradedFileBis476 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00476bis.mov");

var gradedImportSuccess476 = false;
var gradedFileName476 = "";

// Tenter import standard
if (gradedFile476.exists) {
    try {
        var gradedFootage476 = project.importFile(new ImportOptions(gradedFile476));
        gradedFootage476.parentFolder = fromGradingFolder;
        gradedFootage476.name = "UNDLM_00476";
        gradingSources[476] = gradedFootage476;
        gradingImportCount++;
        gradedImportSuccess476 = true;
        gradedFileName476 = "UNDLM_00476.mov";
        logImportSuccess(476, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00476.mov", gradedFileName476);
    } catch (e) {
        logImportError(476, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00476.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess476 && gradedFilePoignees476.exists) {
    try {
        var gradedFootage476 = project.importFile(new ImportOptions(gradedFilePoignees476));
        gradedFootage476.parentFolder = fromGradingFolder;
        gradedFootage476.name = "UNDLM_00476_AVEC_POIGNEES";
        gradingSources[476] = gradedFootage476;
        gradingImportCount++;
        gradedImportSuccess476 = true;
        gradedFileName476 = "UNDLM_00476_AVEC_POIGNEES.mov";
        logImportSuccess(476, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00476_AVEC_POIGNEES.mov", gradedFileName476);
    } catch (e) {
        logImportError(476, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00476_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess476 && gradedFileBis476.exists) {
    try {
        var gradedFootage476 = project.importFile(new ImportOptions(gradedFileBis476));
        gradedFootage476.parentFolder = fromGradingFolder;
        gradedFootage476.name = "UNDLM_00476bis";
        gradingSources[476] = gradedFootage476;
        gradingImportCount++;
        gradedImportSuccess476 = true;
        gradedFileName476 = "UNDLM_00476bis.mov";
        logImportSuccess(476, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00476bis.mov", gradedFileName476);
    } catch (e) {
        logImportError(476, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00476bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess476) {
    missingGradingCount++;
}

// Import plan GRADED 00477
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile477 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00477.mov");
var gradedFilePoignees477 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00477_AVEC_POIGNEES.mov");
var gradedFileBis477 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00477bis.mov");

var gradedImportSuccess477 = false;
var gradedFileName477 = "";

// Tenter import standard
if (gradedFile477.exists) {
    try {
        var gradedFootage477 = project.importFile(new ImportOptions(gradedFile477));
        gradedFootage477.parentFolder = fromGradingFolder;
        gradedFootage477.name = "UNDLM_00477";
        gradingSources[477] = gradedFootage477;
        gradingImportCount++;
        gradedImportSuccess477 = true;
        gradedFileName477 = "UNDLM_00477.mov";
        logImportSuccess(477, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00477.mov", gradedFileName477);
    } catch (e) {
        logImportError(477, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00477.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess477 && gradedFilePoignees477.exists) {
    try {
        var gradedFootage477 = project.importFile(new ImportOptions(gradedFilePoignees477));
        gradedFootage477.parentFolder = fromGradingFolder;
        gradedFootage477.name = "UNDLM_00477_AVEC_POIGNEES";
        gradingSources[477] = gradedFootage477;
        gradingImportCount++;
        gradedImportSuccess477 = true;
        gradedFileName477 = "UNDLM_00477_AVEC_POIGNEES.mov";
        logImportSuccess(477, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00477_AVEC_POIGNEES.mov", gradedFileName477);
    } catch (e) {
        logImportError(477, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00477_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess477 && gradedFileBis477.exists) {
    try {
        var gradedFootage477 = project.importFile(new ImportOptions(gradedFileBis477));
        gradedFootage477.parentFolder = fromGradingFolder;
        gradedFootage477.name = "UNDLM_00477bis";
        gradingSources[477] = gradedFootage477;
        gradingImportCount++;
        gradedImportSuccess477 = true;
        gradedFileName477 = "UNDLM_00477bis.mov";
        logImportSuccess(477, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00477bis.mov", gradedFileName477);
    } catch (e) {
        logImportError(477, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00477bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess477) {
    missingGradingCount++;
}

// Import plan GRADED 00478
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile478 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00478.mov");
var gradedFilePoignees478 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00478_AVEC_POIGNEES.mov");
var gradedFileBis478 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00478bis.mov");

var gradedImportSuccess478 = false;
var gradedFileName478 = "";

// Tenter import standard
if (gradedFile478.exists) {
    try {
        var gradedFootage478 = project.importFile(new ImportOptions(gradedFile478));
        gradedFootage478.parentFolder = fromGradingFolder;
        gradedFootage478.name = "UNDLM_00478";
        gradingSources[478] = gradedFootage478;
        gradingImportCount++;
        gradedImportSuccess478 = true;
        gradedFileName478 = "UNDLM_00478.mov";
        logImportSuccess(478, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00478.mov", gradedFileName478);
    } catch (e) {
        logImportError(478, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00478.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess478 && gradedFilePoignees478.exists) {
    try {
        var gradedFootage478 = project.importFile(new ImportOptions(gradedFilePoignees478));
        gradedFootage478.parentFolder = fromGradingFolder;
        gradedFootage478.name = "UNDLM_00478_AVEC_POIGNEES";
        gradingSources[478] = gradedFootage478;
        gradingImportCount++;
        gradedImportSuccess478 = true;
        gradedFileName478 = "UNDLM_00478_AVEC_POIGNEES.mov";
        logImportSuccess(478, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00478_AVEC_POIGNEES.mov", gradedFileName478);
    } catch (e) {
        logImportError(478, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00478_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess478 && gradedFileBis478.exists) {
    try {
        var gradedFootage478 = project.importFile(new ImportOptions(gradedFileBis478));
        gradedFootage478.parentFolder = fromGradingFolder;
        gradedFootage478.name = "UNDLM_00478bis";
        gradingSources[478] = gradedFootage478;
        gradingImportCount++;
        gradedImportSuccess478 = true;
        gradedFileName478 = "UNDLM_00478bis.mov";
        logImportSuccess(478, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00478bis.mov", gradedFileName478);
    } catch (e) {
        logImportError(478, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00478bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess478) {
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


// Composition pour plan 00464
var planComp464 = project.items.addComp(
    "SQ26_UNDLM_00464_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp464.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer464 = planComp464.layers.add(bgSolidComp);
bgLayer464.name = "BG_SOLID";
bgLayer464.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer464 = false;
if (gradingSources[464]) {
    var gradedLayer464 = planComp464.layers.add(gradingSources[464]);
    gradedLayer464.name = "UNDLM_00464_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer464.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer464.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer464 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer464 = false;
if (editSources[464]) {
    var editLayer464 = planComp464.layers.add(editSources[464]);
    editLayer464.name = "UNDLM_00464_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer464.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer464.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer464 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity464 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer464) {
    // EDIT toujours activé quand disponible
    editLayer464.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer464) {
        gradedLayer464.enabled = false;
    }
} else if (hasGradedLayer464) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer464.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText464 = planComp464.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText464.name = "WARNING_NO_EDIT";
    warningText464.property("Transform").property("Position").setValue([1280, 200]);
    warningText464.guideLayer = true;
    
    var warningTextDoc464 = warningText464.property("Source Text").value;
    warningTextDoc464.fontSize = 32;
    warningTextDoc464.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc464.font = "Arial-BoldMT";
    warningTextDoc464.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText464.property("Source Text").setValue(warningTextDoc464);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText464 = planComp464.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00464");
    errorText464.name = "ERROR_NO_SOURCE";
    errorText464.property("Transform").property("Position").setValue([1280, 720]);
    errorText464.guideLayer = true;
    
    var errorTextDoc464 = errorText464.property("Source Text").value;
    errorTextDoc464.fontSize = 48;
    errorTextDoc464.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc464.font = "Arial-BoldMT";
    errorTextDoc464.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText464.property("Source Text").setValue(errorTextDoc464);
}

planCompositions[464] = planComp464;


// Composition pour plan 00465
var planComp465 = project.items.addComp(
    "SQ26_UNDLM_00465_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp465.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer465 = planComp465.layers.add(bgSolidComp);
bgLayer465.name = "BG_SOLID";
bgLayer465.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer465 = false;
if (gradingSources[465]) {
    var gradedLayer465 = planComp465.layers.add(gradingSources[465]);
    gradedLayer465.name = "UNDLM_00465_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer465.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer465.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer465 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer465 = false;
if (editSources[465]) {
    var editLayer465 = planComp465.layers.add(editSources[465]);
    editLayer465.name = "UNDLM_00465_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer465.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer465.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer465 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity465 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer465) {
    // EDIT toujours activé quand disponible
    editLayer465.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer465) {
        gradedLayer465.enabled = false;
    }
} else if (hasGradedLayer465) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer465.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText465 = planComp465.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText465.name = "WARNING_NO_EDIT";
    warningText465.property("Transform").property("Position").setValue([1280, 200]);
    warningText465.guideLayer = true;
    
    var warningTextDoc465 = warningText465.property("Source Text").value;
    warningTextDoc465.fontSize = 32;
    warningTextDoc465.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc465.font = "Arial-BoldMT";
    warningTextDoc465.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText465.property("Source Text").setValue(warningTextDoc465);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText465 = planComp465.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00465");
    errorText465.name = "ERROR_NO_SOURCE";
    errorText465.property("Transform").property("Position").setValue([1280, 720]);
    errorText465.guideLayer = true;
    
    var errorTextDoc465 = errorText465.property("Source Text").value;
    errorTextDoc465.fontSize = 48;
    errorTextDoc465.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc465.font = "Arial-BoldMT";
    errorTextDoc465.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText465.property("Source Text").setValue(errorTextDoc465);
}

planCompositions[465] = planComp465;


// Composition pour plan 00466
var planComp466 = project.items.addComp(
    "SQ26_UNDLM_00466_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    37.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp466.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer466 = planComp466.layers.add(bgSolidComp);
bgLayer466.name = "BG_SOLID";
bgLayer466.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer466 = false;
if (gradingSources[466]) {
    var gradedLayer466 = planComp466.layers.add(gradingSources[466]);
    gradedLayer466.name = "UNDLM_00466_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer466.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer466.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer466 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer466 = false;
if (editSources[466]) {
    var editLayer466 = planComp466.layers.add(editSources[466]);
    editLayer466.name = "UNDLM_00466_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer466.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer466.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer466 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity466 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer466) {
    // EDIT toujours activé quand disponible
    editLayer466.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer466) {
        gradedLayer466.enabled = false;
    }
} else if (hasGradedLayer466) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer466.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText466 = planComp466.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText466.name = "WARNING_NO_EDIT";
    warningText466.property("Transform").property("Position").setValue([1280, 200]);
    warningText466.guideLayer = true;
    
    var warningTextDoc466 = warningText466.property("Source Text").value;
    warningTextDoc466.fontSize = 32;
    warningTextDoc466.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc466.font = "Arial-BoldMT";
    warningTextDoc466.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText466.property("Source Text").setValue(warningTextDoc466);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText466 = planComp466.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00466");
    errorText466.name = "ERROR_NO_SOURCE";
    errorText466.property("Transform").property("Position").setValue([1280, 720]);
    errorText466.guideLayer = true;
    
    var errorTextDoc466 = errorText466.property("Source Text").value;
    errorTextDoc466.fontSize = 48;
    errorTextDoc466.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc466.font = "Arial-BoldMT";
    errorTextDoc466.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText466.property("Source Text").setValue(errorTextDoc466);
}

planCompositions[466] = planComp466;


// Composition pour plan 00467
var planComp467 = project.items.addComp(
    "SQ26_UNDLM_00467_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.32,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp467.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer467 = planComp467.layers.add(bgSolidComp);
bgLayer467.name = "BG_SOLID";
bgLayer467.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer467 = false;
if (gradingSources[467]) {
    var gradedLayer467 = planComp467.layers.add(gradingSources[467]);
    gradedLayer467.name = "UNDLM_00467_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer467.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer467.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer467 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer467 = false;
if (editSources[467]) {
    var editLayer467 = planComp467.layers.add(editSources[467]);
    editLayer467.name = "UNDLM_00467_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer467.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer467.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer467 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity467 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer467) {
    // EDIT toujours activé quand disponible
    editLayer467.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer467) {
        gradedLayer467.enabled = false;
    }
} else if (hasGradedLayer467) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer467.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText467 = planComp467.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText467.name = "WARNING_NO_EDIT";
    warningText467.property("Transform").property("Position").setValue([1280, 200]);
    warningText467.guideLayer = true;
    
    var warningTextDoc467 = warningText467.property("Source Text").value;
    warningTextDoc467.fontSize = 32;
    warningTextDoc467.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc467.font = "Arial-BoldMT";
    warningTextDoc467.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText467.property("Source Text").setValue(warningTextDoc467);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText467 = planComp467.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00467");
    errorText467.name = "ERROR_NO_SOURCE";
    errorText467.property("Transform").property("Position").setValue([1280, 720]);
    errorText467.guideLayer = true;
    
    var errorTextDoc467 = errorText467.property("Source Text").value;
    errorTextDoc467.fontSize = 48;
    errorTextDoc467.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc467.font = "Arial-BoldMT";
    errorTextDoc467.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText467.property("Source Text").setValue(errorTextDoc467);
}

planCompositions[467] = planComp467;


// Composition pour plan 00468
var planComp468 = project.items.addComp(
    "SQ26_UNDLM_00468_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp468.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer468 = planComp468.layers.add(bgSolidComp);
bgLayer468.name = "BG_SOLID";
bgLayer468.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer468 = false;
if (gradingSources[468]) {
    var gradedLayer468 = planComp468.layers.add(gradingSources[468]);
    gradedLayer468.name = "UNDLM_00468_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer468.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer468.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer468 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer468 = false;
if (editSources[468]) {
    var editLayer468 = planComp468.layers.add(editSources[468]);
    editLayer468.name = "UNDLM_00468_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer468.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer468.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer468 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity468 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer468) {
    // EDIT toujours activé quand disponible
    editLayer468.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer468) {
        gradedLayer468.enabled = false;
    }
} else if (hasGradedLayer468) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer468.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText468 = planComp468.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText468.name = "WARNING_NO_EDIT";
    warningText468.property("Transform").property("Position").setValue([1280, 200]);
    warningText468.guideLayer = true;
    
    var warningTextDoc468 = warningText468.property("Source Text").value;
    warningTextDoc468.fontSize = 32;
    warningTextDoc468.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc468.font = "Arial-BoldMT";
    warningTextDoc468.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText468.property("Source Text").setValue(warningTextDoc468);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText468 = planComp468.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00468");
    errorText468.name = "ERROR_NO_SOURCE";
    errorText468.property("Transform").property("Position").setValue([1280, 720]);
    errorText468.guideLayer = true;
    
    var errorTextDoc468 = errorText468.property("Source Text").value;
    errorTextDoc468.fontSize = 48;
    errorTextDoc468.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc468.font = "Arial-BoldMT";
    errorTextDoc468.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText468.property("Source Text").setValue(errorTextDoc468);
}

planCompositions[468] = planComp468;


// Composition pour plan 00469
var planComp469 = project.items.addComp(
    "SQ26_UNDLM_00469_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp469.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer469 = planComp469.layers.add(bgSolidComp);
bgLayer469.name = "BG_SOLID";
bgLayer469.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer469 = false;
if (gradingSources[469]) {
    var gradedLayer469 = planComp469.layers.add(gradingSources[469]);
    gradedLayer469.name = "UNDLM_00469_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer469.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer469.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer469 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer469 = false;
if (editSources[469]) {
    var editLayer469 = planComp469.layers.add(editSources[469]);
    editLayer469.name = "UNDLM_00469_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer469.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer469.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer469 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity469 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer469) {
    // EDIT toujours activé quand disponible
    editLayer469.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer469) {
        gradedLayer469.enabled = false;
    }
} else if (hasGradedLayer469) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer469.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText469 = planComp469.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText469.name = "WARNING_NO_EDIT";
    warningText469.property("Transform").property("Position").setValue([1280, 200]);
    warningText469.guideLayer = true;
    
    var warningTextDoc469 = warningText469.property("Source Text").value;
    warningTextDoc469.fontSize = 32;
    warningTextDoc469.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc469.font = "Arial-BoldMT";
    warningTextDoc469.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText469.property("Source Text").setValue(warningTextDoc469);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText469 = planComp469.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00469");
    errorText469.name = "ERROR_NO_SOURCE";
    errorText469.property("Transform").property("Position").setValue([1280, 720]);
    errorText469.guideLayer = true;
    
    var errorTextDoc469 = errorText469.property("Source Text").value;
    errorTextDoc469.fontSize = 48;
    errorTextDoc469.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc469.font = "Arial-BoldMT";
    errorTextDoc469.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText469.property("Source Text").setValue(errorTextDoc469);
}

planCompositions[469] = planComp469;


// Composition pour plan 00470
var planComp470 = project.items.addComp(
    "SQ26_UNDLM_00470_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp470.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer470 = planComp470.layers.add(bgSolidComp);
bgLayer470.name = "BG_SOLID";
bgLayer470.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer470 = false;
if (gradingSources[470]) {
    var gradedLayer470 = planComp470.layers.add(gradingSources[470]);
    gradedLayer470.name = "UNDLM_00470_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer470.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer470.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer470 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer470 = false;
if (editSources[470]) {
    var editLayer470 = planComp470.layers.add(editSources[470]);
    editLayer470.name = "UNDLM_00470_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer470.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer470.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer470 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity470 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer470) {
    // EDIT toujours activé quand disponible
    editLayer470.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer470) {
        gradedLayer470.enabled = false;
    }
} else if (hasGradedLayer470) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer470.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText470 = planComp470.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText470.name = "WARNING_NO_EDIT";
    warningText470.property("Transform").property("Position").setValue([1280, 200]);
    warningText470.guideLayer = true;
    
    var warningTextDoc470 = warningText470.property("Source Text").value;
    warningTextDoc470.fontSize = 32;
    warningTextDoc470.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc470.font = "Arial-BoldMT";
    warningTextDoc470.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText470.property("Source Text").setValue(warningTextDoc470);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText470 = planComp470.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00470");
    errorText470.name = "ERROR_NO_SOURCE";
    errorText470.property("Transform").property("Position").setValue([1280, 720]);
    errorText470.guideLayer = true;
    
    var errorTextDoc470 = errorText470.property("Source Text").value;
    errorTextDoc470.fontSize = 48;
    errorTextDoc470.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc470.font = "Arial-BoldMT";
    errorTextDoc470.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText470.property("Source Text").setValue(errorTextDoc470);
}

planCompositions[470] = planComp470;


// Composition pour plan 00471
var planComp471 = project.items.addComp(
    "SQ26_UNDLM_00471_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp471.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer471 = planComp471.layers.add(bgSolidComp);
bgLayer471.name = "BG_SOLID";
bgLayer471.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer471 = false;
if (gradingSources[471]) {
    var gradedLayer471 = planComp471.layers.add(gradingSources[471]);
    gradedLayer471.name = "UNDLM_00471_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer471.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer471.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer471 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer471 = false;
if (editSources[471]) {
    var editLayer471 = planComp471.layers.add(editSources[471]);
    editLayer471.name = "UNDLM_00471_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer471.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer471.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer471 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity471 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer471) {
    // EDIT toujours activé quand disponible
    editLayer471.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer471) {
        gradedLayer471.enabled = false;
    }
} else if (hasGradedLayer471) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer471.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText471 = planComp471.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText471.name = "WARNING_NO_EDIT";
    warningText471.property("Transform").property("Position").setValue([1280, 200]);
    warningText471.guideLayer = true;
    
    var warningTextDoc471 = warningText471.property("Source Text").value;
    warningTextDoc471.fontSize = 32;
    warningTextDoc471.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc471.font = "Arial-BoldMT";
    warningTextDoc471.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText471.property("Source Text").setValue(warningTextDoc471);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText471 = planComp471.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00471");
    errorText471.name = "ERROR_NO_SOURCE";
    errorText471.property("Transform").property("Position").setValue([1280, 720]);
    errorText471.guideLayer = true;
    
    var errorTextDoc471 = errorText471.property("Source Text").value;
    errorTextDoc471.fontSize = 48;
    errorTextDoc471.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc471.font = "Arial-BoldMT";
    errorTextDoc471.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText471.property("Source Text").setValue(errorTextDoc471);
}

planCompositions[471] = planComp471;


// Composition pour plan 00472
var planComp472 = project.items.addComp(
    "SQ26_UNDLM_00472_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp472.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer472 = planComp472.layers.add(bgSolidComp);
bgLayer472.name = "BG_SOLID";
bgLayer472.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer472 = false;
if (gradingSources[472]) {
    var gradedLayer472 = planComp472.layers.add(gradingSources[472]);
    gradedLayer472.name = "UNDLM_00472_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer472.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer472.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer472 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer472 = false;
if (editSources[472]) {
    var editLayer472 = planComp472.layers.add(editSources[472]);
    editLayer472.name = "UNDLM_00472_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer472.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer472.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer472 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity472 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer472) {
    // EDIT toujours activé quand disponible
    editLayer472.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer472) {
        gradedLayer472.enabled = false;
    }
} else if (hasGradedLayer472) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer472.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText472 = planComp472.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText472.name = "WARNING_NO_EDIT";
    warningText472.property("Transform").property("Position").setValue([1280, 200]);
    warningText472.guideLayer = true;
    
    var warningTextDoc472 = warningText472.property("Source Text").value;
    warningTextDoc472.fontSize = 32;
    warningTextDoc472.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc472.font = "Arial-BoldMT";
    warningTextDoc472.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText472.property("Source Text").setValue(warningTextDoc472);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText472 = planComp472.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00472");
    errorText472.name = "ERROR_NO_SOURCE";
    errorText472.property("Transform").property("Position").setValue([1280, 720]);
    errorText472.guideLayer = true;
    
    var errorTextDoc472 = errorText472.property("Source Text").value;
    errorTextDoc472.fontSize = 48;
    errorTextDoc472.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc472.font = "Arial-BoldMT";
    errorTextDoc472.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText472.property("Source Text").setValue(errorTextDoc472);
}

planCompositions[472] = planComp472;


// Composition pour plan 00473
var planComp473 = project.items.addComp(
    "SQ26_UNDLM_00473_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp473.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer473 = planComp473.layers.add(bgSolidComp);
bgLayer473.name = "BG_SOLID";
bgLayer473.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer473 = false;
if (gradingSources[473]) {
    var gradedLayer473 = planComp473.layers.add(gradingSources[473]);
    gradedLayer473.name = "UNDLM_00473_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer473.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer473.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer473 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer473 = false;
if (editSources[473]) {
    var editLayer473 = planComp473.layers.add(editSources[473]);
    editLayer473.name = "UNDLM_00473_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer473.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer473.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer473 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity473 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer473) {
    // EDIT toujours activé quand disponible
    editLayer473.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer473) {
        gradedLayer473.enabled = false;
    }
} else if (hasGradedLayer473) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer473.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText473 = planComp473.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText473.name = "WARNING_NO_EDIT";
    warningText473.property("Transform").property("Position").setValue([1280, 200]);
    warningText473.guideLayer = true;
    
    var warningTextDoc473 = warningText473.property("Source Text").value;
    warningTextDoc473.fontSize = 32;
    warningTextDoc473.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc473.font = "Arial-BoldMT";
    warningTextDoc473.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText473.property("Source Text").setValue(warningTextDoc473);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText473 = planComp473.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00473");
    errorText473.name = "ERROR_NO_SOURCE";
    errorText473.property("Transform").property("Position").setValue([1280, 720]);
    errorText473.guideLayer = true;
    
    var errorTextDoc473 = errorText473.property("Source Text").value;
    errorTextDoc473.fontSize = 48;
    errorTextDoc473.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc473.font = "Arial-BoldMT";
    errorTextDoc473.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText473.property("Source Text").setValue(errorTextDoc473);
}

planCompositions[473] = planComp473;


// Composition pour plan 00474
var planComp474 = project.items.addComp(
    "SQ26_UNDLM_00474_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp474.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer474 = planComp474.layers.add(bgSolidComp);
bgLayer474.name = "BG_SOLID";
bgLayer474.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer474 = false;
if (gradingSources[474]) {
    var gradedLayer474 = planComp474.layers.add(gradingSources[474]);
    gradedLayer474.name = "UNDLM_00474_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer474.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer474.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer474 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer474 = false;
if (editSources[474]) {
    var editLayer474 = planComp474.layers.add(editSources[474]);
    editLayer474.name = "UNDLM_00474_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer474.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer474.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer474 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity474 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer474) {
    // EDIT toujours activé quand disponible
    editLayer474.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer474) {
        gradedLayer474.enabled = false;
    }
} else if (hasGradedLayer474) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer474.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText474 = planComp474.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText474.name = "WARNING_NO_EDIT";
    warningText474.property("Transform").property("Position").setValue([1280, 200]);
    warningText474.guideLayer = true;
    
    var warningTextDoc474 = warningText474.property("Source Text").value;
    warningTextDoc474.fontSize = 32;
    warningTextDoc474.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc474.font = "Arial-BoldMT";
    warningTextDoc474.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText474.property("Source Text").setValue(warningTextDoc474);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText474 = planComp474.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00474");
    errorText474.name = "ERROR_NO_SOURCE";
    errorText474.property("Transform").property("Position").setValue([1280, 720]);
    errorText474.guideLayer = true;
    
    var errorTextDoc474 = errorText474.property("Source Text").value;
    errorTextDoc474.fontSize = 48;
    errorTextDoc474.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc474.font = "Arial-BoldMT";
    errorTextDoc474.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText474.property("Source Text").setValue(errorTextDoc474);
}

planCompositions[474] = planComp474;


// Composition pour plan 00475
var planComp475 = project.items.addComp(
    "SQ26_UNDLM_00475_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp475.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer475 = planComp475.layers.add(bgSolidComp);
bgLayer475.name = "BG_SOLID";
bgLayer475.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer475 = false;
if (gradingSources[475]) {
    var gradedLayer475 = planComp475.layers.add(gradingSources[475]);
    gradedLayer475.name = "UNDLM_00475_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer475.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer475.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer475 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer475 = false;
if (editSources[475]) {
    var editLayer475 = planComp475.layers.add(editSources[475]);
    editLayer475.name = "UNDLM_00475_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer475.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer475.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer475 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity475 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer475) {
    // EDIT toujours activé quand disponible
    editLayer475.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer475) {
        gradedLayer475.enabled = false;
    }
} else if (hasGradedLayer475) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer475.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText475 = planComp475.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText475.name = "WARNING_NO_EDIT";
    warningText475.property("Transform").property("Position").setValue([1280, 200]);
    warningText475.guideLayer = true;
    
    var warningTextDoc475 = warningText475.property("Source Text").value;
    warningTextDoc475.fontSize = 32;
    warningTextDoc475.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc475.font = "Arial-BoldMT";
    warningTextDoc475.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText475.property("Source Text").setValue(warningTextDoc475);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText475 = planComp475.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00475");
    errorText475.name = "ERROR_NO_SOURCE";
    errorText475.property("Transform").property("Position").setValue([1280, 720]);
    errorText475.guideLayer = true;
    
    var errorTextDoc475 = errorText475.property("Source Text").value;
    errorTextDoc475.fontSize = 48;
    errorTextDoc475.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc475.font = "Arial-BoldMT";
    errorTextDoc475.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText475.property("Source Text").setValue(errorTextDoc475);
}

planCompositions[475] = planComp475;


// Composition pour plan 00476
var planComp476 = project.items.addComp(
    "SQ26_UNDLM_00476_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp476.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer476 = planComp476.layers.add(bgSolidComp);
bgLayer476.name = "BG_SOLID";
bgLayer476.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer476 = false;
if (gradingSources[476]) {
    var gradedLayer476 = planComp476.layers.add(gradingSources[476]);
    gradedLayer476.name = "UNDLM_00476_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer476.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer476.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer476 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer476 = false;
if (editSources[476]) {
    var editLayer476 = planComp476.layers.add(editSources[476]);
    editLayer476.name = "UNDLM_00476_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer476.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer476.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer476 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity476 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer476) {
    // EDIT toujours activé quand disponible
    editLayer476.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer476) {
        gradedLayer476.enabled = false;
    }
} else if (hasGradedLayer476) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer476.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText476 = planComp476.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText476.name = "WARNING_NO_EDIT";
    warningText476.property("Transform").property("Position").setValue([1280, 200]);
    warningText476.guideLayer = true;
    
    var warningTextDoc476 = warningText476.property("Source Text").value;
    warningTextDoc476.fontSize = 32;
    warningTextDoc476.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc476.font = "Arial-BoldMT";
    warningTextDoc476.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText476.property("Source Text").setValue(warningTextDoc476);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText476 = planComp476.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00476");
    errorText476.name = "ERROR_NO_SOURCE";
    errorText476.property("Transform").property("Position").setValue([1280, 720]);
    errorText476.guideLayer = true;
    
    var errorTextDoc476 = errorText476.property("Source Text").value;
    errorTextDoc476.fontSize = 48;
    errorTextDoc476.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc476.font = "Arial-BoldMT";
    errorTextDoc476.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText476.property("Source Text").setValue(errorTextDoc476);
}

planCompositions[476] = planComp476;


// Composition pour plan 00477
var planComp477 = project.items.addComp(
    "SQ26_UNDLM_00477_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp477.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer477 = planComp477.layers.add(bgSolidComp);
bgLayer477.name = "BG_SOLID";
bgLayer477.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer477 = false;
if (gradingSources[477]) {
    var gradedLayer477 = planComp477.layers.add(gradingSources[477]);
    gradedLayer477.name = "UNDLM_00477_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer477.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer477.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer477 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer477 = false;
if (editSources[477]) {
    var editLayer477 = planComp477.layers.add(editSources[477]);
    editLayer477.name = "UNDLM_00477_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer477.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer477.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer477 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity477 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer477) {
    // EDIT toujours activé quand disponible
    editLayer477.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer477) {
        gradedLayer477.enabled = false;
    }
} else if (hasGradedLayer477) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer477.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText477 = planComp477.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText477.name = "WARNING_NO_EDIT";
    warningText477.property("Transform").property("Position").setValue([1280, 200]);
    warningText477.guideLayer = true;
    
    var warningTextDoc477 = warningText477.property("Source Text").value;
    warningTextDoc477.fontSize = 32;
    warningTextDoc477.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc477.font = "Arial-BoldMT";
    warningTextDoc477.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText477.property("Source Text").setValue(warningTextDoc477);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText477 = planComp477.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00477");
    errorText477.name = "ERROR_NO_SOURCE";
    errorText477.property("Transform").property("Position").setValue([1280, 720]);
    errorText477.guideLayer = true;
    
    var errorTextDoc477 = errorText477.property("Source Text").value;
    errorTextDoc477.fontSize = 48;
    errorTextDoc477.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc477.font = "Arial-BoldMT";
    errorTextDoc477.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText477.property("Source Text").setValue(errorTextDoc477);
}

planCompositions[477] = planComp477;


// Composition pour plan 00478
var planComp478 = project.items.addComp(
    "SQ26_UNDLM_00478_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp478.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer478 = planComp478.layers.add(bgSolidComp);
bgLayer478.name = "BG_SOLID";
bgLayer478.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer478 = false;
if (gradingSources[478]) {
    var gradedLayer478 = planComp478.layers.add(gradingSources[478]);
    gradedLayer478.name = "UNDLM_00478_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer478.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer478.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer478 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer478 = false;
if (editSources[478]) {
    var editLayer478 = planComp478.layers.add(editSources[478]);
    editLayer478.name = "UNDLM_00478_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer478.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer478.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer478 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity478 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer478) {
    // EDIT toujours activé quand disponible
    editLayer478.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer478) {
        gradedLayer478.enabled = false;
    }
} else if (hasGradedLayer478) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer478.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText478 = planComp478.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText478.name = "WARNING_NO_EDIT";
    warningText478.property("Transform").property("Position").setValue([1280, 200]);
    warningText478.guideLayer = true;
    
    var warningTextDoc478 = warningText478.property("Source Text").value;
    warningTextDoc478.fontSize = 32;
    warningTextDoc478.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc478.font = "Arial-BoldMT";
    warningTextDoc478.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText478.property("Source Text").setValue(warningTextDoc478);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText478 = planComp478.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00478");
    errorText478.name = "ERROR_NO_SOURCE";
    errorText478.property("Transform").property("Position").setValue([1280, 720]);
    errorText478.guideLayer = true;
    
    var errorTextDoc478 = errorText478.property("Source Text").value;
    errorTextDoc478.fontSize = 48;
    errorTextDoc478.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc478.font = "Arial-BoldMT";
    errorTextDoc478.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText478.property("Source Text").setValue(errorTextDoc478);
}

planCompositions[478] = planComp478;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ26_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    101.47999999999999, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00464 à la timeline master
if (planCompositions[464]) {
    var masterLayer464 = masterComp.layers.add(planCompositions[464]);
    masterLayer464.startTime = 0;
    masterLayer464.name = "UNDLM_00464";
    masterLayer464.label = 1; // Couleurs alternées
}

// Ajouter plan 00465 à la timeline master
if (planCompositions[465]) {
    var masterLayer465 = masterComp.layers.add(planCompositions[465]);
    masterLayer465.startTime = 3.16;
    masterLayer465.name = "UNDLM_00465";
    masterLayer465.label = 2; // Couleurs alternées
}

// Ajouter plan 00466 à la timeline master
if (planCompositions[466]) {
    var masterLayer466 = masterComp.layers.add(planCompositions[466]);
    masterLayer466.startTime = 7.0;
    masterLayer466.name = "UNDLM_00466";
    masterLayer466.label = 3; // Couleurs alternées
}

// Ajouter plan 00467 à la timeline master
if (planCompositions[467]) {
    var masterLayer467 = masterComp.layers.add(planCompositions[467]);
    masterLayer467.startTime = 44.28;
    masterLayer467.name = "UNDLM_00467";
    masterLayer467.label = 4; // Couleurs alternées
}

// Ajouter plan 00468 à la timeline master
if (planCompositions[468]) {
    var masterLayer468 = masterComp.layers.add(planCompositions[468]);
    masterLayer468.startTime = 50.6;
    masterLayer468.name = "UNDLM_00468";
    masterLayer468.label = 5; // Couleurs alternées
}

// Ajouter plan 00469 à la timeline master
if (planCompositions[469]) {
    var masterLayer469 = masterComp.layers.add(planCompositions[469]);
    masterLayer469.startTime = 55.0;
    masterLayer469.name = "UNDLM_00469";
    masterLayer469.label = 6; // Couleurs alternées
}

// Ajouter plan 00470 à la timeline master
if (planCompositions[470]) {
    var masterLayer470 = masterComp.layers.add(planCompositions[470]);
    masterLayer470.startTime = 62.36;
    masterLayer470.name = "UNDLM_00470";
    masterLayer470.label = 7; // Couleurs alternées
}

// Ajouter plan 00471 à la timeline master
if (planCompositions[471]) {
    var masterLayer471 = masterComp.layers.add(planCompositions[471]);
    masterLayer471.startTime = 71.64;
    masterLayer471.name = "UNDLM_00471";
    masterLayer471.label = 8; // Couleurs alternées
}

// Ajouter plan 00472 à la timeline master
if (planCompositions[472]) {
    var masterLayer472 = masterComp.layers.add(planCompositions[472]);
    masterLayer472.startTime = 76.24;
    masterLayer472.name = "UNDLM_00472";
    masterLayer472.label = 9; // Couleurs alternées
}

// Ajouter plan 00473 à la timeline master
if (planCompositions[473]) {
    var masterLayer473 = masterComp.layers.add(planCompositions[473]);
    masterLayer473.startTime = 78.19999999999999;
    masterLayer473.name = "UNDLM_00473";
    masterLayer473.label = 10; // Couleurs alternées
}

// Ajouter plan 00474 à la timeline master
if (planCompositions[474]) {
    var masterLayer474 = masterComp.layers.add(planCompositions[474]);
    masterLayer474.startTime = 80.24;
    masterLayer474.name = "UNDLM_00474";
    masterLayer474.label = 11; // Couleurs alternées
}

// Ajouter plan 00475 à la timeline master
if (planCompositions[475]) {
    var masterLayer475 = masterComp.layers.add(planCompositions[475]);
    masterLayer475.startTime = 82.39999999999999;
    masterLayer475.name = "UNDLM_00475";
    masterLayer475.label = 12; // Couleurs alternées
}

// Ajouter plan 00476 à la timeline master
if (planCompositions[476]) {
    var masterLayer476 = masterComp.layers.add(planCompositions[476]);
    masterLayer476.startTime = 86.24;
    masterLayer476.name = "UNDLM_00476";
    masterLayer476.label = 13; // Couleurs alternées
}

// Ajouter plan 00477 à la timeline master
if (planCompositions[477]) {
    var masterLayer477 = masterComp.layers.add(planCompositions[477]);
    masterLayer477.startTime = 89.83999999999999;
    masterLayer477.name = "UNDLM_00477";
    masterLayer477.label = 14; // Couleurs alternées
}

// Ajouter plan 00478 à la timeline master
if (planCompositions[478]) {
    var masterLayer478 = masterComp.layers.add(planCompositions[478]);
    masterLayer478.startTime = 93.71999999999998;
    masterLayer478.name = "UNDLM_00478";
    masterLayer478.label = 15; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ26";\n' +
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
    {start: 0, end: 3.16, name: "UNDLM_00464"},
    {start: 3.16, end: 7.0, name: "UNDLM_00465"},
    {start: 7.0, end: 44.28, name: "UNDLM_00466"},
    {start: 44.28, end: 50.6, name: "UNDLM_00467"},
    {start: 50.6, end: 55.0, name: "UNDLM_00468"},
    {start: 55.0, end: 62.36, name: "UNDLM_00469"},
    {start: 62.36, end: 71.64, name: "UNDLM_00470"},
    {start: 71.64, end: 76.24, name: "UNDLM_00471"},
    {start: 76.24, end: 78.19999999999999, name: "UNDLM_00472"},
    {start: 78.19999999999999, end: 80.24, name: "UNDLM_00473"},
    {start: 80.24, end: 82.39999999999999, name: "UNDLM_00474"},
    {start: 82.39999999999999, end: 86.24, name: "UNDLM_00475"},
    {start: 86.24, end: 89.83999999999999, name: "UNDLM_00476"},
    {start: 89.83999999999999, end: 93.71999999999998, name: "UNDLM_00477"},
    {start: 93.71999999999998, end: 101.47999999999999, name: "UNDLM_00478"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ26/_AE/SQ26_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 15;
var totalCount = 15;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ26 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(101.47999999999999 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ26_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ26:" + totalCount + ":" + gradedCount);
