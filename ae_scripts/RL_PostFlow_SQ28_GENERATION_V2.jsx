
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ28 avec 15 plans
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


// Import plan EDIT 00506
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile506 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00506.mov");
var editFilePoignees506 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00506_AVEC_POIGNEES.mov");
var editFileBis506 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00506bis.mov");

var importSuccess506 = false;
var fileName506 = "";

// Tenter import standard
if (editFile506.exists) {
    try {
        var editFootage506 = project.importFile(new ImportOptions(editFile506));
        editFootage506.parentFolder = fromEditFolder;
        editFootage506.name = "UNDLM_00506";
        editSources[506] = editFootage506;
        editImportCount++;
        importSuccess506 = true;
        fileName506 = "UNDLM_00506.mov";
        logImportSuccess(506, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00506.mov", fileName506);
    } catch (e) {
        logImportError(506, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00506.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess506 && editFilePoignees506.exists) {
    try {
        var editFootage506 = project.importFile(new ImportOptions(editFilePoignees506));
        editFootage506.parentFolder = fromEditFolder;
        editFootage506.name = "UNDLM_00506_AVEC_POIGNEES";
        editSources[506] = editFootage506;
        editImportCount++;
        importSuccess506 = true;
        fileName506 = "UNDLM_00506_AVEC_POIGNEES.mov";
        logImportSuccess(506, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00506_AVEC_POIGNEES.mov", fileName506);
    } catch (e) {
        logImportError(506, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00506_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess506 && editFileBis506.exists) {
    try {
        var editFootage506 = project.importFile(new ImportOptions(editFileBis506));
        editFootage506.parentFolder = fromEditFolder;
        editFootage506.name = "UNDLM_00506bis";
        editSources[506] = editFootage506;
        editImportCount++;
        importSuccess506 = true;
        fileName506 = "UNDLM_00506bis.mov";
        logImportSuccess(506, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00506bis.mov", fileName506);
    } catch (e) {
        logImportError(506, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00506bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess506) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00506.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00507
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile507 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00507.mov");
var editFilePoignees507 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00507_AVEC_POIGNEES.mov");
var editFileBis507 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00507bis.mov");

var importSuccess507 = false;
var fileName507 = "";

// Tenter import standard
if (editFile507.exists) {
    try {
        var editFootage507 = project.importFile(new ImportOptions(editFile507));
        editFootage507.parentFolder = fromEditFolder;
        editFootage507.name = "UNDLM_00507";
        editSources[507] = editFootage507;
        editImportCount++;
        importSuccess507 = true;
        fileName507 = "UNDLM_00507.mov";
        logImportSuccess(507, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00507.mov", fileName507);
    } catch (e) {
        logImportError(507, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00507.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess507 && editFilePoignees507.exists) {
    try {
        var editFootage507 = project.importFile(new ImportOptions(editFilePoignees507));
        editFootage507.parentFolder = fromEditFolder;
        editFootage507.name = "UNDLM_00507_AVEC_POIGNEES";
        editSources[507] = editFootage507;
        editImportCount++;
        importSuccess507 = true;
        fileName507 = "UNDLM_00507_AVEC_POIGNEES.mov";
        logImportSuccess(507, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00507_AVEC_POIGNEES.mov", fileName507);
    } catch (e) {
        logImportError(507, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00507_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess507 && editFileBis507.exists) {
    try {
        var editFootage507 = project.importFile(new ImportOptions(editFileBis507));
        editFootage507.parentFolder = fromEditFolder;
        editFootage507.name = "UNDLM_00507bis";
        editSources[507] = editFootage507;
        editImportCount++;
        importSuccess507 = true;
        fileName507 = "UNDLM_00507bis.mov";
        logImportSuccess(507, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00507bis.mov", fileName507);
    } catch (e) {
        logImportError(507, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00507bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess507) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00507.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00508
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile508 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00508.mov");
var editFilePoignees508 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00508_AVEC_POIGNEES.mov");
var editFileBis508 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00508bis.mov");

var importSuccess508 = false;
var fileName508 = "";

// Tenter import standard
if (editFile508.exists) {
    try {
        var editFootage508 = project.importFile(new ImportOptions(editFile508));
        editFootage508.parentFolder = fromEditFolder;
        editFootage508.name = "UNDLM_00508";
        editSources[508] = editFootage508;
        editImportCount++;
        importSuccess508 = true;
        fileName508 = "UNDLM_00508.mov";
        logImportSuccess(508, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00508.mov", fileName508);
    } catch (e) {
        logImportError(508, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00508.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess508 && editFilePoignees508.exists) {
    try {
        var editFootage508 = project.importFile(new ImportOptions(editFilePoignees508));
        editFootage508.parentFolder = fromEditFolder;
        editFootage508.name = "UNDLM_00508_AVEC_POIGNEES";
        editSources[508] = editFootage508;
        editImportCount++;
        importSuccess508 = true;
        fileName508 = "UNDLM_00508_AVEC_POIGNEES.mov";
        logImportSuccess(508, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00508_AVEC_POIGNEES.mov", fileName508);
    } catch (e) {
        logImportError(508, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00508_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess508 && editFileBis508.exists) {
    try {
        var editFootage508 = project.importFile(new ImportOptions(editFileBis508));
        editFootage508.parentFolder = fromEditFolder;
        editFootage508.name = "UNDLM_00508bis";
        editSources[508] = editFootage508;
        editImportCount++;
        importSuccess508 = true;
        fileName508 = "UNDLM_00508bis.mov";
        logImportSuccess(508, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00508bis.mov", fileName508);
    } catch (e) {
        logImportError(508, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00508bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess508) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00508.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00509
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile509 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00509.mov");
var editFilePoignees509 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00509_AVEC_POIGNEES.mov");
var editFileBis509 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00509bis.mov");

var importSuccess509 = false;
var fileName509 = "";

// Tenter import standard
if (editFile509.exists) {
    try {
        var editFootage509 = project.importFile(new ImportOptions(editFile509));
        editFootage509.parentFolder = fromEditFolder;
        editFootage509.name = "UNDLM_00509";
        editSources[509] = editFootage509;
        editImportCount++;
        importSuccess509 = true;
        fileName509 = "UNDLM_00509.mov";
        logImportSuccess(509, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00509.mov", fileName509);
    } catch (e) {
        logImportError(509, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00509.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess509 && editFilePoignees509.exists) {
    try {
        var editFootage509 = project.importFile(new ImportOptions(editFilePoignees509));
        editFootage509.parentFolder = fromEditFolder;
        editFootage509.name = "UNDLM_00509_AVEC_POIGNEES";
        editSources[509] = editFootage509;
        editImportCount++;
        importSuccess509 = true;
        fileName509 = "UNDLM_00509_AVEC_POIGNEES.mov";
        logImportSuccess(509, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00509_AVEC_POIGNEES.mov", fileName509);
    } catch (e) {
        logImportError(509, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00509_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess509 && editFileBis509.exists) {
    try {
        var editFootage509 = project.importFile(new ImportOptions(editFileBis509));
        editFootage509.parentFolder = fromEditFolder;
        editFootage509.name = "UNDLM_00509bis";
        editSources[509] = editFootage509;
        editImportCount++;
        importSuccess509 = true;
        fileName509 = "UNDLM_00509bis.mov";
        logImportSuccess(509, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00509bis.mov", fileName509);
    } catch (e) {
        logImportError(509, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00509bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess509) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00509.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00510
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile510 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00510.mov");
var editFilePoignees510 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00510_AVEC_POIGNEES.mov");
var editFileBis510 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00510bis.mov");

var importSuccess510 = false;
var fileName510 = "";

// Tenter import standard
if (editFile510.exists) {
    try {
        var editFootage510 = project.importFile(new ImportOptions(editFile510));
        editFootage510.parentFolder = fromEditFolder;
        editFootage510.name = "UNDLM_00510";
        editSources[510] = editFootage510;
        editImportCount++;
        importSuccess510 = true;
        fileName510 = "UNDLM_00510.mov";
        logImportSuccess(510, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00510.mov", fileName510);
    } catch (e) {
        logImportError(510, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00510.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess510 && editFilePoignees510.exists) {
    try {
        var editFootage510 = project.importFile(new ImportOptions(editFilePoignees510));
        editFootage510.parentFolder = fromEditFolder;
        editFootage510.name = "UNDLM_00510_AVEC_POIGNEES";
        editSources[510] = editFootage510;
        editImportCount++;
        importSuccess510 = true;
        fileName510 = "UNDLM_00510_AVEC_POIGNEES.mov";
        logImportSuccess(510, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00510_AVEC_POIGNEES.mov", fileName510);
    } catch (e) {
        logImportError(510, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00510_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess510 && editFileBis510.exists) {
    try {
        var editFootage510 = project.importFile(new ImportOptions(editFileBis510));
        editFootage510.parentFolder = fromEditFolder;
        editFootage510.name = "UNDLM_00510bis";
        editSources[510] = editFootage510;
        editImportCount++;
        importSuccess510 = true;
        fileName510 = "UNDLM_00510bis.mov";
        logImportSuccess(510, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00510bis.mov", fileName510);
    } catch (e) {
        logImportError(510, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00510bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess510) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00510.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00511
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile511 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00511.mov");
var editFilePoignees511 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00511_AVEC_POIGNEES.mov");
var editFileBis511 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00511bis.mov");

var importSuccess511 = false;
var fileName511 = "";

// Tenter import standard
if (editFile511.exists) {
    try {
        var editFootage511 = project.importFile(new ImportOptions(editFile511));
        editFootage511.parentFolder = fromEditFolder;
        editFootage511.name = "UNDLM_00511";
        editSources[511] = editFootage511;
        editImportCount++;
        importSuccess511 = true;
        fileName511 = "UNDLM_00511.mov";
        logImportSuccess(511, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00511.mov", fileName511);
    } catch (e) {
        logImportError(511, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00511.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess511 && editFilePoignees511.exists) {
    try {
        var editFootage511 = project.importFile(new ImportOptions(editFilePoignees511));
        editFootage511.parentFolder = fromEditFolder;
        editFootage511.name = "UNDLM_00511_AVEC_POIGNEES";
        editSources[511] = editFootage511;
        editImportCount++;
        importSuccess511 = true;
        fileName511 = "UNDLM_00511_AVEC_POIGNEES.mov";
        logImportSuccess(511, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00511_AVEC_POIGNEES.mov", fileName511);
    } catch (e) {
        logImportError(511, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00511_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess511 && editFileBis511.exists) {
    try {
        var editFootage511 = project.importFile(new ImportOptions(editFileBis511));
        editFootage511.parentFolder = fromEditFolder;
        editFootage511.name = "UNDLM_00511bis";
        editSources[511] = editFootage511;
        editImportCount++;
        importSuccess511 = true;
        fileName511 = "UNDLM_00511bis.mov";
        logImportSuccess(511, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00511bis.mov", fileName511);
    } catch (e) {
        logImportError(511, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00511bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess511) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00511.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00512
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile512 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00512.mov");
var editFilePoignees512 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00512_AVEC_POIGNEES.mov");
var editFileBis512 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00512bis.mov");

var importSuccess512 = false;
var fileName512 = "";

// Tenter import standard
if (editFile512.exists) {
    try {
        var editFootage512 = project.importFile(new ImportOptions(editFile512));
        editFootage512.parentFolder = fromEditFolder;
        editFootage512.name = "UNDLM_00512";
        editSources[512] = editFootage512;
        editImportCount++;
        importSuccess512 = true;
        fileName512 = "UNDLM_00512.mov";
        logImportSuccess(512, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00512.mov", fileName512);
    } catch (e) {
        logImportError(512, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00512.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess512 && editFilePoignees512.exists) {
    try {
        var editFootage512 = project.importFile(new ImportOptions(editFilePoignees512));
        editFootage512.parentFolder = fromEditFolder;
        editFootage512.name = "UNDLM_00512_AVEC_POIGNEES";
        editSources[512] = editFootage512;
        editImportCount++;
        importSuccess512 = true;
        fileName512 = "UNDLM_00512_AVEC_POIGNEES.mov";
        logImportSuccess(512, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00512_AVEC_POIGNEES.mov", fileName512);
    } catch (e) {
        logImportError(512, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00512_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess512 && editFileBis512.exists) {
    try {
        var editFootage512 = project.importFile(new ImportOptions(editFileBis512));
        editFootage512.parentFolder = fromEditFolder;
        editFootage512.name = "UNDLM_00512bis";
        editSources[512] = editFootage512;
        editImportCount++;
        importSuccess512 = true;
        fileName512 = "UNDLM_00512bis.mov";
        logImportSuccess(512, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00512bis.mov", fileName512);
    } catch (e) {
        logImportError(512, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00512bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess512) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00512.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00513
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile513 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00513.mov");
var editFilePoignees513 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00513_AVEC_POIGNEES.mov");
var editFileBis513 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00513bis.mov");

var importSuccess513 = false;
var fileName513 = "";

// Tenter import standard
if (editFile513.exists) {
    try {
        var editFootage513 = project.importFile(new ImportOptions(editFile513));
        editFootage513.parentFolder = fromEditFolder;
        editFootage513.name = "UNDLM_00513";
        editSources[513] = editFootage513;
        editImportCount++;
        importSuccess513 = true;
        fileName513 = "UNDLM_00513.mov";
        logImportSuccess(513, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00513.mov", fileName513);
    } catch (e) {
        logImportError(513, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00513.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess513 && editFilePoignees513.exists) {
    try {
        var editFootage513 = project.importFile(new ImportOptions(editFilePoignees513));
        editFootage513.parentFolder = fromEditFolder;
        editFootage513.name = "UNDLM_00513_AVEC_POIGNEES";
        editSources[513] = editFootage513;
        editImportCount++;
        importSuccess513 = true;
        fileName513 = "UNDLM_00513_AVEC_POIGNEES.mov";
        logImportSuccess(513, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00513_AVEC_POIGNEES.mov", fileName513);
    } catch (e) {
        logImportError(513, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00513_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess513 && editFileBis513.exists) {
    try {
        var editFootage513 = project.importFile(new ImportOptions(editFileBis513));
        editFootage513.parentFolder = fromEditFolder;
        editFootage513.name = "UNDLM_00513bis";
        editSources[513] = editFootage513;
        editImportCount++;
        importSuccess513 = true;
        fileName513 = "UNDLM_00513bis.mov";
        logImportSuccess(513, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00513bis.mov", fileName513);
    } catch (e) {
        logImportError(513, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00513bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess513) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00513.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00514
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile514 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00514.mov");
var editFilePoignees514 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00514_AVEC_POIGNEES.mov");
var editFileBis514 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00514bis.mov");

var importSuccess514 = false;
var fileName514 = "";

// Tenter import standard
if (editFile514.exists) {
    try {
        var editFootage514 = project.importFile(new ImportOptions(editFile514));
        editFootage514.parentFolder = fromEditFolder;
        editFootage514.name = "UNDLM_00514";
        editSources[514] = editFootage514;
        editImportCount++;
        importSuccess514 = true;
        fileName514 = "UNDLM_00514.mov";
        logImportSuccess(514, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00514.mov", fileName514);
    } catch (e) {
        logImportError(514, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00514.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess514 && editFilePoignees514.exists) {
    try {
        var editFootage514 = project.importFile(new ImportOptions(editFilePoignees514));
        editFootage514.parentFolder = fromEditFolder;
        editFootage514.name = "UNDLM_00514_AVEC_POIGNEES";
        editSources[514] = editFootage514;
        editImportCount++;
        importSuccess514 = true;
        fileName514 = "UNDLM_00514_AVEC_POIGNEES.mov";
        logImportSuccess(514, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00514_AVEC_POIGNEES.mov", fileName514);
    } catch (e) {
        logImportError(514, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00514_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess514 && editFileBis514.exists) {
    try {
        var editFootage514 = project.importFile(new ImportOptions(editFileBis514));
        editFootage514.parentFolder = fromEditFolder;
        editFootage514.name = "UNDLM_00514bis";
        editSources[514] = editFootage514;
        editImportCount++;
        importSuccess514 = true;
        fileName514 = "UNDLM_00514bis.mov";
        logImportSuccess(514, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00514bis.mov", fileName514);
    } catch (e) {
        logImportError(514, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00514bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess514) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00514.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00515
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile515 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00515.mov");
var editFilePoignees515 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00515_AVEC_POIGNEES.mov");
var editFileBis515 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00515bis.mov");

var importSuccess515 = false;
var fileName515 = "";

// Tenter import standard
if (editFile515.exists) {
    try {
        var editFootage515 = project.importFile(new ImportOptions(editFile515));
        editFootage515.parentFolder = fromEditFolder;
        editFootage515.name = "UNDLM_00515";
        editSources[515] = editFootage515;
        editImportCount++;
        importSuccess515 = true;
        fileName515 = "UNDLM_00515.mov";
        logImportSuccess(515, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00515.mov", fileName515);
    } catch (e) {
        logImportError(515, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00515.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess515 && editFilePoignees515.exists) {
    try {
        var editFootage515 = project.importFile(new ImportOptions(editFilePoignees515));
        editFootage515.parentFolder = fromEditFolder;
        editFootage515.name = "UNDLM_00515_AVEC_POIGNEES";
        editSources[515] = editFootage515;
        editImportCount++;
        importSuccess515 = true;
        fileName515 = "UNDLM_00515_AVEC_POIGNEES.mov";
        logImportSuccess(515, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00515_AVEC_POIGNEES.mov", fileName515);
    } catch (e) {
        logImportError(515, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00515_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess515 && editFileBis515.exists) {
    try {
        var editFootage515 = project.importFile(new ImportOptions(editFileBis515));
        editFootage515.parentFolder = fromEditFolder;
        editFootage515.name = "UNDLM_00515bis";
        editSources[515] = editFootage515;
        editImportCount++;
        importSuccess515 = true;
        fileName515 = "UNDLM_00515bis.mov";
        logImportSuccess(515, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00515bis.mov", fileName515);
    } catch (e) {
        logImportError(515, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00515bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess515) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00515.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00516
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile516 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00516.mov");
var editFilePoignees516 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00516_AVEC_POIGNEES.mov");
var editFileBis516 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00516bis.mov");

var importSuccess516 = false;
var fileName516 = "";

// Tenter import standard
if (editFile516.exists) {
    try {
        var editFootage516 = project.importFile(new ImportOptions(editFile516));
        editFootage516.parentFolder = fromEditFolder;
        editFootage516.name = "UNDLM_00516";
        editSources[516] = editFootage516;
        editImportCount++;
        importSuccess516 = true;
        fileName516 = "UNDLM_00516.mov";
        logImportSuccess(516, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00516.mov", fileName516);
    } catch (e) {
        logImportError(516, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00516.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess516 && editFilePoignees516.exists) {
    try {
        var editFootage516 = project.importFile(new ImportOptions(editFilePoignees516));
        editFootage516.parentFolder = fromEditFolder;
        editFootage516.name = "UNDLM_00516_AVEC_POIGNEES";
        editSources[516] = editFootage516;
        editImportCount++;
        importSuccess516 = true;
        fileName516 = "UNDLM_00516_AVEC_POIGNEES.mov";
        logImportSuccess(516, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00516_AVEC_POIGNEES.mov", fileName516);
    } catch (e) {
        logImportError(516, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00516_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess516 && editFileBis516.exists) {
    try {
        var editFootage516 = project.importFile(new ImportOptions(editFileBis516));
        editFootage516.parentFolder = fromEditFolder;
        editFootage516.name = "UNDLM_00516bis";
        editSources[516] = editFootage516;
        editImportCount++;
        importSuccess516 = true;
        fileName516 = "UNDLM_00516bis.mov";
        logImportSuccess(516, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00516bis.mov", fileName516);
    } catch (e) {
        logImportError(516, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00516bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess516) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00516.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00517
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile517 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00517.mov");
var editFilePoignees517 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00517_AVEC_POIGNEES.mov");
var editFileBis517 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00517bis.mov");

var importSuccess517 = false;
var fileName517 = "";

// Tenter import standard
if (editFile517.exists) {
    try {
        var editFootage517 = project.importFile(new ImportOptions(editFile517));
        editFootage517.parentFolder = fromEditFolder;
        editFootage517.name = "UNDLM_00517";
        editSources[517] = editFootage517;
        editImportCount++;
        importSuccess517 = true;
        fileName517 = "UNDLM_00517.mov";
        logImportSuccess(517, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00517.mov", fileName517);
    } catch (e) {
        logImportError(517, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00517.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess517 && editFilePoignees517.exists) {
    try {
        var editFootage517 = project.importFile(new ImportOptions(editFilePoignees517));
        editFootage517.parentFolder = fromEditFolder;
        editFootage517.name = "UNDLM_00517_AVEC_POIGNEES";
        editSources[517] = editFootage517;
        editImportCount++;
        importSuccess517 = true;
        fileName517 = "UNDLM_00517_AVEC_POIGNEES.mov";
        logImportSuccess(517, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00517_AVEC_POIGNEES.mov", fileName517);
    } catch (e) {
        logImportError(517, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00517_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess517 && editFileBis517.exists) {
    try {
        var editFootage517 = project.importFile(new ImportOptions(editFileBis517));
        editFootage517.parentFolder = fromEditFolder;
        editFootage517.name = "UNDLM_00517bis";
        editSources[517] = editFootage517;
        editImportCount++;
        importSuccess517 = true;
        fileName517 = "UNDLM_00517bis.mov";
        logImportSuccess(517, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00517bis.mov", fileName517);
    } catch (e) {
        logImportError(517, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00517bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess517) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00517.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00518
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile518 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00518.mov");
var editFilePoignees518 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00518_AVEC_POIGNEES.mov");
var editFileBis518 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00518bis.mov");

var importSuccess518 = false;
var fileName518 = "";

// Tenter import standard
if (editFile518.exists) {
    try {
        var editFootage518 = project.importFile(new ImportOptions(editFile518));
        editFootage518.parentFolder = fromEditFolder;
        editFootage518.name = "UNDLM_00518";
        editSources[518] = editFootage518;
        editImportCount++;
        importSuccess518 = true;
        fileName518 = "UNDLM_00518.mov";
        logImportSuccess(518, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00518.mov", fileName518);
    } catch (e) {
        logImportError(518, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00518.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess518 && editFilePoignees518.exists) {
    try {
        var editFootage518 = project.importFile(new ImportOptions(editFilePoignees518));
        editFootage518.parentFolder = fromEditFolder;
        editFootage518.name = "UNDLM_00518_AVEC_POIGNEES";
        editSources[518] = editFootage518;
        editImportCount++;
        importSuccess518 = true;
        fileName518 = "UNDLM_00518_AVEC_POIGNEES.mov";
        logImportSuccess(518, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00518_AVEC_POIGNEES.mov", fileName518);
    } catch (e) {
        logImportError(518, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00518_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess518 && editFileBis518.exists) {
    try {
        var editFootage518 = project.importFile(new ImportOptions(editFileBis518));
        editFootage518.parentFolder = fromEditFolder;
        editFootage518.name = "UNDLM_00518bis";
        editSources[518] = editFootage518;
        editImportCount++;
        importSuccess518 = true;
        fileName518 = "UNDLM_00518bis.mov";
        logImportSuccess(518, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00518bis.mov", fileName518);
    } catch (e) {
        logImportError(518, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00518bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess518) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00518.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00519
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile519 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00519.mov");
var editFilePoignees519 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00519_AVEC_POIGNEES.mov");
var editFileBis519 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00519bis.mov");

var importSuccess519 = false;
var fileName519 = "";

// Tenter import standard
if (editFile519.exists) {
    try {
        var editFootage519 = project.importFile(new ImportOptions(editFile519));
        editFootage519.parentFolder = fromEditFolder;
        editFootage519.name = "UNDLM_00519";
        editSources[519] = editFootage519;
        editImportCount++;
        importSuccess519 = true;
        fileName519 = "UNDLM_00519.mov";
        logImportSuccess(519, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00519.mov", fileName519);
    } catch (e) {
        logImportError(519, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00519.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess519 && editFilePoignees519.exists) {
    try {
        var editFootage519 = project.importFile(new ImportOptions(editFilePoignees519));
        editFootage519.parentFolder = fromEditFolder;
        editFootage519.name = "UNDLM_00519_AVEC_POIGNEES";
        editSources[519] = editFootage519;
        editImportCount++;
        importSuccess519 = true;
        fileName519 = "UNDLM_00519_AVEC_POIGNEES.mov";
        logImportSuccess(519, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00519_AVEC_POIGNEES.mov", fileName519);
    } catch (e) {
        logImportError(519, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00519_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess519 && editFileBis519.exists) {
    try {
        var editFootage519 = project.importFile(new ImportOptions(editFileBis519));
        editFootage519.parentFolder = fromEditFolder;
        editFootage519.name = "UNDLM_00519bis";
        editSources[519] = editFootage519;
        editImportCount++;
        importSuccess519 = true;
        fileName519 = "UNDLM_00519bis.mov";
        logImportSuccess(519, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00519bis.mov", fileName519);
    } catch (e) {
        logImportError(519, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00519bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess519) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00519.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00520
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile520 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00520.mov");
var editFilePoignees520 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00520_AVEC_POIGNEES.mov");
var editFileBis520 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00520bis.mov");

var importSuccess520 = false;
var fileName520 = "";

// Tenter import standard
if (editFile520.exists) {
    try {
        var editFootage520 = project.importFile(new ImportOptions(editFile520));
        editFootage520.parentFolder = fromEditFolder;
        editFootage520.name = "UNDLM_00520";
        editSources[520] = editFootage520;
        editImportCount++;
        importSuccess520 = true;
        fileName520 = "UNDLM_00520.mov";
        logImportSuccess(520, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00520.mov", fileName520);
    } catch (e) {
        logImportError(520, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00520.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess520 && editFilePoignees520.exists) {
    try {
        var editFootage520 = project.importFile(new ImportOptions(editFilePoignees520));
        editFootage520.parentFolder = fromEditFolder;
        editFootage520.name = "UNDLM_00520_AVEC_POIGNEES";
        editSources[520] = editFootage520;
        editImportCount++;
        importSuccess520 = true;
        fileName520 = "UNDLM_00520_AVEC_POIGNEES.mov";
        logImportSuccess(520, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00520_AVEC_POIGNEES.mov", fileName520);
    } catch (e) {
        logImportError(520, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00520_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess520 && editFileBis520.exists) {
    try {
        var editFootage520 = project.importFile(new ImportOptions(editFileBis520));
        editFootage520.parentFolder = fromEditFolder;
        editFootage520.name = "UNDLM_00520bis";
        editSources[520] = editFootage520;
        editImportCount++;
        importSuccess520 = true;
        fileName520 = "UNDLM_00520bis.mov";
        logImportSuccess(520, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00520bis.mov", fileName520);
    } catch (e) {
        logImportError(520, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00520bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess520) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00520.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00506
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile506 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00506.mov");
var gradedFilePoignees506 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00506_AVEC_POIGNEES.mov");
var gradedFileBis506 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00506bis.mov");

var gradedImportSuccess506 = false;
var gradedFileName506 = "";

// Tenter import standard
if (gradedFile506.exists) {
    try {
        var gradedFootage506 = project.importFile(new ImportOptions(gradedFile506));
        gradedFootage506.parentFolder = fromGradingFolder;
        gradedFootage506.name = "UNDLM_00506";
        gradingSources[506] = gradedFootage506;
        gradingImportCount++;
        gradedImportSuccess506 = true;
        gradedFileName506 = "UNDLM_00506.mov";
        logImportSuccess(506, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00506.mov", gradedFileName506);
    } catch (e) {
        logImportError(506, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00506.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess506 && gradedFilePoignees506.exists) {
    try {
        var gradedFootage506 = project.importFile(new ImportOptions(gradedFilePoignees506));
        gradedFootage506.parentFolder = fromGradingFolder;
        gradedFootage506.name = "UNDLM_00506_AVEC_POIGNEES";
        gradingSources[506] = gradedFootage506;
        gradingImportCount++;
        gradedImportSuccess506 = true;
        gradedFileName506 = "UNDLM_00506_AVEC_POIGNEES.mov";
        logImportSuccess(506, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00506_AVEC_POIGNEES.mov", gradedFileName506);
    } catch (e) {
        logImportError(506, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00506_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess506 && gradedFileBis506.exists) {
    try {
        var gradedFootage506 = project.importFile(new ImportOptions(gradedFileBis506));
        gradedFootage506.parentFolder = fromGradingFolder;
        gradedFootage506.name = "UNDLM_00506bis";
        gradingSources[506] = gradedFootage506;
        gradingImportCount++;
        gradedImportSuccess506 = true;
        gradedFileName506 = "UNDLM_00506bis.mov";
        logImportSuccess(506, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00506bis.mov", gradedFileName506);
    } catch (e) {
        logImportError(506, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00506bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess506) {
    missingGradingCount++;
}

// Import plan GRADED 00507
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile507 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00507.mov");
var gradedFilePoignees507 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00507_AVEC_POIGNEES.mov");
var gradedFileBis507 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00507bis.mov");

var gradedImportSuccess507 = false;
var gradedFileName507 = "";

// Tenter import standard
if (gradedFile507.exists) {
    try {
        var gradedFootage507 = project.importFile(new ImportOptions(gradedFile507));
        gradedFootage507.parentFolder = fromGradingFolder;
        gradedFootage507.name = "UNDLM_00507";
        gradingSources[507] = gradedFootage507;
        gradingImportCount++;
        gradedImportSuccess507 = true;
        gradedFileName507 = "UNDLM_00507.mov";
        logImportSuccess(507, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00507.mov", gradedFileName507);
    } catch (e) {
        logImportError(507, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00507.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess507 && gradedFilePoignees507.exists) {
    try {
        var gradedFootage507 = project.importFile(new ImportOptions(gradedFilePoignees507));
        gradedFootage507.parentFolder = fromGradingFolder;
        gradedFootage507.name = "UNDLM_00507_AVEC_POIGNEES";
        gradingSources[507] = gradedFootage507;
        gradingImportCount++;
        gradedImportSuccess507 = true;
        gradedFileName507 = "UNDLM_00507_AVEC_POIGNEES.mov";
        logImportSuccess(507, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00507_AVEC_POIGNEES.mov", gradedFileName507);
    } catch (e) {
        logImportError(507, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00507_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess507 && gradedFileBis507.exists) {
    try {
        var gradedFootage507 = project.importFile(new ImportOptions(gradedFileBis507));
        gradedFootage507.parentFolder = fromGradingFolder;
        gradedFootage507.name = "UNDLM_00507bis";
        gradingSources[507] = gradedFootage507;
        gradingImportCount++;
        gradedImportSuccess507 = true;
        gradedFileName507 = "UNDLM_00507bis.mov";
        logImportSuccess(507, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00507bis.mov", gradedFileName507);
    } catch (e) {
        logImportError(507, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00507bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess507) {
    missingGradingCount++;
}

// Import plan GRADED 00508
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile508 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00508.mov");
var gradedFilePoignees508 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00508_AVEC_POIGNEES.mov");
var gradedFileBis508 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00508bis.mov");

var gradedImportSuccess508 = false;
var gradedFileName508 = "";

// Tenter import standard
if (gradedFile508.exists) {
    try {
        var gradedFootage508 = project.importFile(new ImportOptions(gradedFile508));
        gradedFootage508.parentFolder = fromGradingFolder;
        gradedFootage508.name = "UNDLM_00508";
        gradingSources[508] = gradedFootage508;
        gradingImportCount++;
        gradedImportSuccess508 = true;
        gradedFileName508 = "UNDLM_00508.mov";
        logImportSuccess(508, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00508.mov", gradedFileName508);
    } catch (e) {
        logImportError(508, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00508.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess508 && gradedFilePoignees508.exists) {
    try {
        var gradedFootage508 = project.importFile(new ImportOptions(gradedFilePoignees508));
        gradedFootage508.parentFolder = fromGradingFolder;
        gradedFootage508.name = "UNDLM_00508_AVEC_POIGNEES";
        gradingSources[508] = gradedFootage508;
        gradingImportCount++;
        gradedImportSuccess508 = true;
        gradedFileName508 = "UNDLM_00508_AVEC_POIGNEES.mov";
        logImportSuccess(508, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00508_AVEC_POIGNEES.mov", gradedFileName508);
    } catch (e) {
        logImportError(508, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00508_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess508 && gradedFileBis508.exists) {
    try {
        var gradedFootage508 = project.importFile(new ImportOptions(gradedFileBis508));
        gradedFootage508.parentFolder = fromGradingFolder;
        gradedFootage508.name = "UNDLM_00508bis";
        gradingSources[508] = gradedFootage508;
        gradingImportCount++;
        gradedImportSuccess508 = true;
        gradedFileName508 = "UNDLM_00508bis.mov";
        logImportSuccess(508, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00508bis.mov", gradedFileName508);
    } catch (e) {
        logImportError(508, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00508bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess508) {
    missingGradingCount++;
}

// Import plan GRADED 00509
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile509 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00509.mov");
var gradedFilePoignees509 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00509_AVEC_POIGNEES.mov");
var gradedFileBis509 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00509bis.mov");

var gradedImportSuccess509 = false;
var gradedFileName509 = "";

// Tenter import standard
if (gradedFile509.exists) {
    try {
        var gradedFootage509 = project.importFile(new ImportOptions(gradedFile509));
        gradedFootage509.parentFolder = fromGradingFolder;
        gradedFootage509.name = "UNDLM_00509";
        gradingSources[509] = gradedFootage509;
        gradingImportCount++;
        gradedImportSuccess509 = true;
        gradedFileName509 = "UNDLM_00509.mov";
        logImportSuccess(509, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00509.mov", gradedFileName509);
    } catch (e) {
        logImportError(509, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00509.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess509 && gradedFilePoignees509.exists) {
    try {
        var gradedFootage509 = project.importFile(new ImportOptions(gradedFilePoignees509));
        gradedFootage509.parentFolder = fromGradingFolder;
        gradedFootage509.name = "UNDLM_00509_AVEC_POIGNEES";
        gradingSources[509] = gradedFootage509;
        gradingImportCount++;
        gradedImportSuccess509 = true;
        gradedFileName509 = "UNDLM_00509_AVEC_POIGNEES.mov";
        logImportSuccess(509, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00509_AVEC_POIGNEES.mov", gradedFileName509);
    } catch (e) {
        logImportError(509, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00509_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess509 && gradedFileBis509.exists) {
    try {
        var gradedFootage509 = project.importFile(new ImportOptions(gradedFileBis509));
        gradedFootage509.parentFolder = fromGradingFolder;
        gradedFootage509.name = "UNDLM_00509bis";
        gradingSources[509] = gradedFootage509;
        gradingImportCount++;
        gradedImportSuccess509 = true;
        gradedFileName509 = "UNDLM_00509bis.mov";
        logImportSuccess(509, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00509bis.mov", gradedFileName509);
    } catch (e) {
        logImportError(509, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00509bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess509) {
    missingGradingCount++;
}

// Import plan GRADED 00510
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile510 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00510.mov");
var gradedFilePoignees510 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00510_AVEC_POIGNEES.mov");
var gradedFileBis510 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00510bis.mov");

var gradedImportSuccess510 = false;
var gradedFileName510 = "";

// Tenter import standard
if (gradedFile510.exists) {
    try {
        var gradedFootage510 = project.importFile(new ImportOptions(gradedFile510));
        gradedFootage510.parentFolder = fromGradingFolder;
        gradedFootage510.name = "UNDLM_00510";
        gradingSources[510] = gradedFootage510;
        gradingImportCount++;
        gradedImportSuccess510 = true;
        gradedFileName510 = "UNDLM_00510.mov";
        logImportSuccess(510, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00510.mov", gradedFileName510);
    } catch (e) {
        logImportError(510, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00510.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess510 && gradedFilePoignees510.exists) {
    try {
        var gradedFootage510 = project.importFile(new ImportOptions(gradedFilePoignees510));
        gradedFootage510.parentFolder = fromGradingFolder;
        gradedFootage510.name = "UNDLM_00510_AVEC_POIGNEES";
        gradingSources[510] = gradedFootage510;
        gradingImportCount++;
        gradedImportSuccess510 = true;
        gradedFileName510 = "UNDLM_00510_AVEC_POIGNEES.mov";
        logImportSuccess(510, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00510_AVEC_POIGNEES.mov", gradedFileName510);
    } catch (e) {
        logImportError(510, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00510_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess510 && gradedFileBis510.exists) {
    try {
        var gradedFootage510 = project.importFile(new ImportOptions(gradedFileBis510));
        gradedFootage510.parentFolder = fromGradingFolder;
        gradedFootage510.name = "UNDLM_00510bis";
        gradingSources[510] = gradedFootage510;
        gradingImportCount++;
        gradedImportSuccess510 = true;
        gradedFileName510 = "UNDLM_00510bis.mov";
        logImportSuccess(510, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00510bis.mov", gradedFileName510);
    } catch (e) {
        logImportError(510, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00510bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess510) {
    missingGradingCount++;
}

// Import plan GRADED 00511
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile511 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00511.mov");
var gradedFilePoignees511 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00511_AVEC_POIGNEES.mov");
var gradedFileBis511 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00511bis.mov");

var gradedImportSuccess511 = false;
var gradedFileName511 = "";

// Tenter import standard
if (gradedFile511.exists) {
    try {
        var gradedFootage511 = project.importFile(new ImportOptions(gradedFile511));
        gradedFootage511.parentFolder = fromGradingFolder;
        gradedFootage511.name = "UNDLM_00511";
        gradingSources[511] = gradedFootage511;
        gradingImportCount++;
        gradedImportSuccess511 = true;
        gradedFileName511 = "UNDLM_00511.mov";
        logImportSuccess(511, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00511.mov", gradedFileName511);
    } catch (e) {
        logImportError(511, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00511.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess511 && gradedFilePoignees511.exists) {
    try {
        var gradedFootage511 = project.importFile(new ImportOptions(gradedFilePoignees511));
        gradedFootage511.parentFolder = fromGradingFolder;
        gradedFootage511.name = "UNDLM_00511_AVEC_POIGNEES";
        gradingSources[511] = gradedFootage511;
        gradingImportCount++;
        gradedImportSuccess511 = true;
        gradedFileName511 = "UNDLM_00511_AVEC_POIGNEES.mov";
        logImportSuccess(511, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00511_AVEC_POIGNEES.mov", gradedFileName511);
    } catch (e) {
        logImportError(511, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00511_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess511 && gradedFileBis511.exists) {
    try {
        var gradedFootage511 = project.importFile(new ImportOptions(gradedFileBis511));
        gradedFootage511.parentFolder = fromGradingFolder;
        gradedFootage511.name = "UNDLM_00511bis";
        gradingSources[511] = gradedFootage511;
        gradingImportCount++;
        gradedImportSuccess511 = true;
        gradedFileName511 = "UNDLM_00511bis.mov";
        logImportSuccess(511, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00511bis.mov", gradedFileName511);
    } catch (e) {
        logImportError(511, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00511bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess511) {
    missingGradingCount++;
}

// Import plan GRADED 00512
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile512 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00512.mov");
var gradedFilePoignees512 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00512_AVEC_POIGNEES.mov");
var gradedFileBis512 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00512bis.mov");

var gradedImportSuccess512 = false;
var gradedFileName512 = "";

// Tenter import standard
if (gradedFile512.exists) {
    try {
        var gradedFootage512 = project.importFile(new ImportOptions(gradedFile512));
        gradedFootage512.parentFolder = fromGradingFolder;
        gradedFootage512.name = "UNDLM_00512";
        gradingSources[512] = gradedFootage512;
        gradingImportCount++;
        gradedImportSuccess512 = true;
        gradedFileName512 = "UNDLM_00512.mov";
        logImportSuccess(512, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00512.mov", gradedFileName512);
    } catch (e) {
        logImportError(512, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00512.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess512 && gradedFilePoignees512.exists) {
    try {
        var gradedFootage512 = project.importFile(new ImportOptions(gradedFilePoignees512));
        gradedFootage512.parentFolder = fromGradingFolder;
        gradedFootage512.name = "UNDLM_00512_AVEC_POIGNEES";
        gradingSources[512] = gradedFootage512;
        gradingImportCount++;
        gradedImportSuccess512 = true;
        gradedFileName512 = "UNDLM_00512_AVEC_POIGNEES.mov";
        logImportSuccess(512, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00512_AVEC_POIGNEES.mov", gradedFileName512);
    } catch (e) {
        logImportError(512, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00512_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess512 && gradedFileBis512.exists) {
    try {
        var gradedFootage512 = project.importFile(new ImportOptions(gradedFileBis512));
        gradedFootage512.parentFolder = fromGradingFolder;
        gradedFootage512.name = "UNDLM_00512bis";
        gradingSources[512] = gradedFootage512;
        gradingImportCount++;
        gradedImportSuccess512 = true;
        gradedFileName512 = "UNDLM_00512bis.mov";
        logImportSuccess(512, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00512bis.mov", gradedFileName512);
    } catch (e) {
        logImportError(512, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00512bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess512) {
    missingGradingCount++;
}

// Import plan GRADED 00513
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile513 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00513.mov");
var gradedFilePoignees513 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00513_AVEC_POIGNEES.mov");
var gradedFileBis513 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00513bis.mov");

var gradedImportSuccess513 = false;
var gradedFileName513 = "";

// Tenter import standard
if (gradedFile513.exists) {
    try {
        var gradedFootage513 = project.importFile(new ImportOptions(gradedFile513));
        gradedFootage513.parentFolder = fromGradingFolder;
        gradedFootage513.name = "UNDLM_00513";
        gradingSources[513] = gradedFootage513;
        gradingImportCount++;
        gradedImportSuccess513 = true;
        gradedFileName513 = "UNDLM_00513.mov";
        logImportSuccess(513, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00513.mov", gradedFileName513);
    } catch (e) {
        logImportError(513, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00513.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess513 && gradedFilePoignees513.exists) {
    try {
        var gradedFootage513 = project.importFile(new ImportOptions(gradedFilePoignees513));
        gradedFootage513.parentFolder = fromGradingFolder;
        gradedFootage513.name = "UNDLM_00513_AVEC_POIGNEES";
        gradingSources[513] = gradedFootage513;
        gradingImportCount++;
        gradedImportSuccess513 = true;
        gradedFileName513 = "UNDLM_00513_AVEC_POIGNEES.mov";
        logImportSuccess(513, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00513_AVEC_POIGNEES.mov", gradedFileName513);
    } catch (e) {
        logImportError(513, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00513_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess513 && gradedFileBis513.exists) {
    try {
        var gradedFootage513 = project.importFile(new ImportOptions(gradedFileBis513));
        gradedFootage513.parentFolder = fromGradingFolder;
        gradedFootage513.name = "UNDLM_00513bis";
        gradingSources[513] = gradedFootage513;
        gradingImportCount++;
        gradedImportSuccess513 = true;
        gradedFileName513 = "UNDLM_00513bis.mov";
        logImportSuccess(513, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00513bis.mov", gradedFileName513);
    } catch (e) {
        logImportError(513, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00513bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess513) {
    missingGradingCount++;
}

// Import plan GRADED 00514
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile514 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00514.mov");
var gradedFilePoignees514 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00514_AVEC_POIGNEES.mov");
var gradedFileBis514 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00514bis.mov");

var gradedImportSuccess514 = false;
var gradedFileName514 = "";

// Tenter import standard
if (gradedFile514.exists) {
    try {
        var gradedFootage514 = project.importFile(new ImportOptions(gradedFile514));
        gradedFootage514.parentFolder = fromGradingFolder;
        gradedFootage514.name = "UNDLM_00514";
        gradingSources[514] = gradedFootage514;
        gradingImportCount++;
        gradedImportSuccess514 = true;
        gradedFileName514 = "UNDLM_00514.mov";
        logImportSuccess(514, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00514.mov", gradedFileName514);
    } catch (e) {
        logImportError(514, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00514.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess514 && gradedFilePoignees514.exists) {
    try {
        var gradedFootage514 = project.importFile(new ImportOptions(gradedFilePoignees514));
        gradedFootage514.parentFolder = fromGradingFolder;
        gradedFootage514.name = "UNDLM_00514_AVEC_POIGNEES";
        gradingSources[514] = gradedFootage514;
        gradingImportCount++;
        gradedImportSuccess514 = true;
        gradedFileName514 = "UNDLM_00514_AVEC_POIGNEES.mov";
        logImportSuccess(514, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00514_AVEC_POIGNEES.mov", gradedFileName514);
    } catch (e) {
        logImportError(514, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00514_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess514 && gradedFileBis514.exists) {
    try {
        var gradedFootage514 = project.importFile(new ImportOptions(gradedFileBis514));
        gradedFootage514.parentFolder = fromGradingFolder;
        gradedFootage514.name = "UNDLM_00514bis";
        gradingSources[514] = gradedFootage514;
        gradingImportCount++;
        gradedImportSuccess514 = true;
        gradedFileName514 = "UNDLM_00514bis.mov";
        logImportSuccess(514, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00514bis.mov", gradedFileName514);
    } catch (e) {
        logImportError(514, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00514bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess514) {
    missingGradingCount++;
}

// Import plan GRADED 00515
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile515 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00515.mov");
var gradedFilePoignees515 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00515_AVEC_POIGNEES.mov");
var gradedFileBis515 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00515bis.mov");

var gradedImportSuccess515 = false;
var gradedFileName515 = "";

// Tenter import standard
if (gradedFile515.exists) {
    try {
        var gradedFootage515 = project.importFile(new ImportOptions(gradedFile515));
        gradedFootage515.parentFolder = fromGradingFolder;
        gradedFootage515.name = "UNDLM_00515";
        gradingSources[515] = gradedFootage515;
        gradingImportCount++;
        gradedImportSuccess515 = true;
        gradedFileName515 = "UNDLM_00515.mov";
        logImportSuccess(515, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00515.mov", gradedFileName515);
    } catch (e) {
        logImportError(515, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00515.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess515 && gradedFilePoignees515.exists) {
    try {
        var gradedFootage515 = project.importFile(new ImportOptions(gradedFilePoignees515));
        gradedFootage515.parentFolder = fromGradingFolder;
        gradedFootage515.name = "UNDLM_00515_AVEC_POIGNEES";
        gradingSources[515] = gradedFootage515;
        gradingImportCount++;
        gradedImportSuccess515 = true;
        gradedFileName515 = "UNDLM_00515_AVEC_POIGNEES.mov";
        logImportSuccess(515, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00515_AVEC_POIGNEES.mov", gradedFileName515);
    } catch (e) {
        logImportError(515, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00515_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess515 && gradedFileBis515.exists) {
    try {
        var gradedFootage515 = project.importFile(new ImportOptions(gradedFileBis515));
        gradedFootage515.parentFolder = fromGradingFolder;
        gradedFootage515.name = "UNDLM_00515bis";
        gradingSources[515] = gradedFootage515;
        gradingImportCount++;
        gradedImportSuccess515 = true;
        gradedFileName515 = "UNDLM_00515bis.mov";
        logImportSuccess(515, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00515bis.mov", gradedFileName515);
    } catch (e) {
        logImportError(515, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00515bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess515) {
    missingGradingCount++;
}

// Import plan GRADED 00516
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile516 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00516.mov");
var gradedFilePoignees516 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00516_AVEC_POIGNEES.mov");
var gradedFileBis516 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00516bis.mov");

var gradedImportSuccess516 = false;
var gradedFileName516 = "";

// Tenter import standard
if (gradedFile516.exists) {
    try {
        var gradedFootage516 = project.importFile(new ImportOptions(gradedFile516));
        gradedFootage516.parentFolder = fromGradingFolder;
        gradedFootage516.name = "UNDLM_00516";
        gradingSources[516] = gradedFootage516;
        gradingImportCount++;
        gradedImportSuccess516 = true;
        gradedFileName516 = "UNDLM_00516.mov";
        logImportSuccess(516, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00516.mov", gradedFileName516);
    } catch (e) {
        logImportError(516, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00516.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess516 && gradedFilePoignees516.exists) {
    try {
        var gradedFootage516 = project.importFile(new ImportOptions(gradedFilePoignees516));
        gradedFootage516.parentFolder = fromGradingFolder;
        gradedFootage516.name = "UNDLM_00516_AVEC_POIGNEES";
        gradingSources[516] = gradedFootage516;
        gradingImportCount++;
        gradedImportSuccess516 = true;
        gradedFileName516 = "UNDLM_00516_AVEC_POIGNEES.mov";
        logImportSuccess(516, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00516_AVEC_POIGNEES.mov", gradedFileName516);
    } catch (e) {
        logImportError(516, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00516_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess516 && gradedFileBis516.exists) {
    try {
        var gradedFootage516 = project.importFile(new ImportOptions(gradedFileBis516));
        gradedFootage516.parentFolder = fromGradingFolder;
        gradedFootage516.name = "UNDLM_00516bis";
        gradingSources[516] = gradedFootage516;
        gradingImportCount++;
        gradedImportSuccess516 = true;
        gradedFileName516 = "UNDLM_00516bis.mov";
        logImportSuccess(516, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00516bis.mov", gradedFileName516);
    } catch (e) {
        logImportError(516, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00516bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess516) {
    missingGradingCount++;
}

// Import plan GRADED 00517
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile517 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00517.mov");
var gradedFilePoignees517 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00517_AVEC_POIGNEES.mov");
var gradedFileBis517 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00517bis.mov");

var gradedImportSuccess517 = false;
var gradedFileName517 = "";

// Tenter import standard
if (gradedFile517.exists) {
    try {
        var gradedFootage517 = project.importFile(new ImportOptions(gradedFile517));
        gradedFootage517.parentFolder = fromGradingFolder;
        gradedFootage517.name = "UNDLM_00517";
        gradingSources[517] = gradedFootage517;
        gradingImportCount++;
        gradedImportSuccess517 = true;
        gradedFileName517 = "UNDLM_00517.mov";
        logImportSuccess(517, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00517.mov", gradedFileName517);
    } catch (e) {
        logImportError(517, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00517.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess517 && gradedFilePoignees517.exists) {
    try {
        var gradedFootage517 = project.importFile(new ImportOptions(gradedFilePoignees517));
        gradedFootage517.parentFolder = fromGradingFolder;
        gradedFootage517.name = "UNDLM_00517_AVEC_POIGNEES";
        gradingSources[517] = gradedFootage517;
        gradingImportCount++;
        gradedImportSuccess517 = true;
        gradedFileName517 = "UNDLM_00517_AVEC_POIGNEES.mov";
        logImportSuccess(517, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00517_AVEC_POIGNEES.mov", gradedFileName517);
    } catch (e) {
        logImportError(517, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00517_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess517 && gradedFileBis517.exists) {
    try {
        var gradedFootage517 = project.importFile(new ImportOptions(gradedFileBis517));
        gradedFootage517.parentFolder = fromGradingFolder;
        gradedFootage517.name = "UNDLM_00517bis";
        gradingSources[517] = gradedFootage517;
        gradingImportCount++;
        gradedImportSuccess517 = true;
        gradedFileName517 = "UNDLM_00517bis.mov";
        logImportSuccess(517, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00517bis.mov", gradedFileName517);
    } catch (e) {
        logImportError(517, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00517bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess517) {
    missingGradingCount++;
}

// Import plan GRADED 00518
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile518 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00518.mov");
var gradedFilePoignees518 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00518_AVEC_POIGNEES.mov");
var gradedFileBis518 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00518bis.mov");

var gradedImportSuccess518 = false;
var gradedFileName518 = "";

// Tenter import standard
if (gradedFile518.exists) {
    try {
        var gradedFootage518 = project.importFile(new ImportOptions(gradedFile518));
        gradedFootage518.parentFolder = fromGradingFolder;
        gradedFootage518.name = "UNDLM_00518";
        gradingSources[518] = gradedFootage518;
        gradingImportCount++;
        gradedImportSuccess518 = true;
        gradedFileName518 = "UNDLM_00518.mov";
        logImportSuccess(518, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00518.mov", gradedFileName518);
    } catch (e) {
        logImportError(518, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00518.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess518 && gradedFilePoignees518.exists) {
    try {
        var gradedFootage518 = project.importFile(new ImportOptions(gradedFilePoignees518));
        gradedFootage518.parentFolder = fromGradingFolder;
        gradedFootage518.name = "UNDLM_00518_AVEC_POIGNEES";
        gradingSources[518] = gradedFootage518;
        gradingImportCount++;
        gradedImportSuccess518 = true;
        gradedFileName518 = "UNDLM_00518_AVEC_POIGNEES.mov";
        logImportSuccess(518, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00518_AVEC_POIGNEES.mov", gradedFileName518);
    } catch (e) {
        logImportError(518, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00518_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess518 && gradedFileBis518.exists) {
    try {
        var gradedFootage518 = project.importFile(new ImportOptions(gradedFileBis518));
        gradedFootage518.parentFolder = fromGradingFolder;
        gradedFootage518.name = "UNDLM_00518bis";
        gradingSources[518] = gradedFootage518;
        gradingImportCount++;
        gradedImportSuccess518 = true;
        gradedFileName518 = "UNDLM_00518bis.mov";
        logImportSuccess(518, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00518bis.mov", gradedFileName518);
    } catch (e) {
        logImportError(518, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00518bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess518) {
    missingGradingCount++;
}

// Import plan GRADED 00520
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile520 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00520.mov");
var gradedFilePoignees520 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00520_AVEC_POIGNEES.mov");
var gradedFileBis520 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00520bis.mov");

var gradedImportSuccess520 = false;
var gradedFileName520 = "";

// Tenter import standard
if (gradedFile520.exists) {
    try {
        var gradedFootage520 = project.importFile(new ImportOptions(gradedFile520));
        gradedFootage520.parentFolder = fromGradingFolder;
        gradedFootage520.name = "UNDLM_00520";
        gradingSources[520] = gradedFootage520;
        gradingImportCount++;
        gradedImportSuccess520 = true;
        gradedFileName520 = "UNDLM_00520.mov";
        logImportSuccess(520, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00520.mov", gradedFileName520);
    } catch (e) {
        logImportError(520, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00520.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess520 && gradedFilePoignees520.exists) {
    try {
        var gradedFootage520 = project.importFile(new ImportOptions(gradedFilePoignees520));
        gradedFootage520.parentFolder = fromGradingFolder;
        gradedFootage520.name = "UNDLM_00520_AVEC_POIGNEES";
        gradingSources[520] = gradedFootage520;
        gradingImportCount++;
        gradedImportSuccess520 = true;
        gradedFileName520 = "UNDLM_00520_AVEC_POIGNEES.mov";
        logImportSuccess(520, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00520_AVEC_POIGNEES.mov", gradedFileName520);
    } catch (e) {
        logImportError(520, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00520_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess520 && gradedFileBis520.exists) {
    try {
        var gradedFootage520 = project.importFile(new ImportOptions(gradedFileBis520));
        gradedFootage520.parentFolder = fromGradingFolder;
        gradedFootage520.name = "UNDLM_00520bis";
        gradingSources[520] = gradedFootage520;
        gradingImportCount++;
        gradedImportSuccess520 = true;
        gradedFileName520 = "UNDLM_00520bis.mov";
        logImportSuccess(520, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00520bis.mov", gradedFileName520);
    } catch (e) {
        logImportError(520, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00520bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess520) {
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


// Composition pour plan 00506
var planComp506 = project.items.addComp(
    "SQ28_UNDLM_00506_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp506.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer506 = planComp506.layers.add(bgSolidComp);
bgLayer506.name = "BG_SOLID";
bgLayer506.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer506 = false;
if (gradingSources[506]) {
    var gradedLayer506 = planComp506.layers.add(gradingSources[506]);
    gradedLayer506.name = "UNDLM_00506_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer506.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer506.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer506 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer506 = false;
if (editSources[506]) {
    var editLayer506 = planComp506.layers.add(editSources[506]);
    editLayer506.name = "UNDLM_00506_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer506.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer506.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer506 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity506 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer506) {
    // EDIT toujours activé quand disponible
    editLayer506.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer506) {
        gradedLayer506.enabled = false;
    }
} else if (hasGradedLayer506) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer506.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText506 = planComp506.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText506.name = "WARNING_NO_EDIT";
    warningText506.property("Transform").property("Position").setValue([1280, 200]);
    warningText506.guideLayer = true;
    
    var warningTextDoc506 = warningText506.property("Source Text").value;
    warningTextDoc506.fontSize = 32;
    warningTextDoc506.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc506.font = "Arial-BoldMT";
    warningTextDoc506.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText506.property("Source Text").setValue(warningTextDoc506);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText506 = planComp506.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00506");
    errorText506.name = "ERROR_NO_SOURCE";
    errorText506.property("Transform").property("Position").setValue([1280, 720]);
    errorText506.guideLayer = true;
    
    var errorTextDoc506 = errorText506.property("Source Text").value;
    errorTextDoc506.fontSize = 48;
    errorTextDoc506.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc506.font = "Arial-BoldMT";
    errorTextDoc506.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText506.property("Source Text").setValue(errorTextDoc506);
}

planCompositions[506] = planComp506;


// Composition pour plan 00507
var planComp507 = project.items.addComp(
    "SQ28_UNDLM_00507_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp507.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer507 = planComp507.layers.add(bgSolidComp);
bgLayer507.name = "BG_SOLID";
bgLayer507.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer507 = false;
if (gradingSources[507]) {
    var gradedLayer507 = planComp507.layers.add(gradingSources[507]);
    gradedLayer507.name = "UNDLM_00507_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer507.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer507.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer507 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer507 = false;
if (editSources[507]) {
    var editLayer507 = planComp507.layers.add(editSources[507]);
    editLayer507.name = "UNDLM_00507_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer507.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer507.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer507 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity507 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer507) {
    // EDIT toujours activé quand disponible
    editLayer507.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer507) {
        gradedLayer507.enabled = false;
    }
} else if (hasGradedLayer507) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer507.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText507 = planComp507.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText507.name = "WARNING_NO_EDIT";
    warningText507.property("Transform").property("Position").setValue([1280, 200]);
    warningText507.guideLayer = true;
    
    var warningTextDoc507 = warningText507.property("Source Text").value;
    warningTextDoc507.fontSize = 32;
    warningTextDoc507.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc507.font = "Arial-BoldMT";
    warningTextDoc507.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText507.property("Source Text").setValue(warningTextDoc507);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText507 = planComp507.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00507");
    errorText507.name = "ERROR_NO_SOURCE";
    errorText507.property("Transform").property("Position").setValue([1280, 720]);
    errorText507.guideLayer = true;
    
    var errorTextDoc507 = errorText507.property("Source Text").value;
    errorTextDoc507.fontSize = 48;
    errorTextDoc507.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc507.font = "Arial-BoldMT";
    errorTextDoc507.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText507.property("Source Text").setValue(errorTextDoc507);
}

planCompositions[507] = planComp507;


// Composition pour plan 00508
var planComp508 = project.items.addComp(
    "SQ28_UNDLM_00508_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp508.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer508 = planComp508.layers.add(bgSolidComp);
bgLayer508.name = "BG_SOLID";
bgLayer508.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer508 = false;
if (gradingSources[508]) {
    var gradedLayer508 = planComp508.layers.add(gradingSources[508]);
    gradedLayer508.name = "UNDLM_00508_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer508.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer508.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer508 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer508 = false;
if (editSources[508]) {
    var editLayer508 = planComp508.layers.add(editSources[508]);
    editLayer508.name = "UNDLM_00508_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer508.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer508.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer508 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity508 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer508) {
    // EDIT toujours activé quand disponible
    editLayer508.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer508) {
        gradedLayer508.enabled = false;
    }
} else if (hasGradedLayer508) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer508.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText508 = planComp508.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText508.name = "WARNING_NO_EDIT";
    warningText508.property("Transform").property("Position").setValue([1280, 200]);
    warningText508.guideLayer = true;
    
    var warningTextDoc508 = warningText508.property("Source Text").value;
    warningTextDoc508.fontSize = 32;
    warningTextDoc508.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc508.font = "Arial-BoldMT";
    warningTextDoc508.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText508.property("Source Text").setValue(warningTextDoc508);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText508 = planComp508.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00508");
    errorText508.name = "ERROR_NO_SOURCE";
    errorText508.property("Transform").property("Position").setValue([1280, 720]);
    errorText508.guideLayer = true;
    
    var errorTextDoc508 = errorText508.property("Source Text").value;
    errorTextDoc508.fontSize = 48;
    errorTextDoc508.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc508.font = "Arial-BoldMT";
    errorTextDoc508.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText508.property("Source Text").setValue(errorTextDoc508);
}

planCompositions[508] = planComp508;


// Composition pour plan 00509
var planComp509 = project.items.addComp(
    "SQ28_UNDLM_00509_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.5600000000000005,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp509.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer509 = planComp509.layers.add(bgSolidComp);
bgLayer509.name = "BG_SOLID";
bgLayer509.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer509 = false;
if (gradingSources[509]) {
    var gradedLayer509 = planComp509.layers.add(gradingSources[509]);
    gradedLayer509.name = "UNDLM_00509_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer509.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer509.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer509 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer509 = false;
if (editSources[509]) {
    var editLayer509 = planComp509.layers.add(editSources[509]);
    editLayer509.name = "UNDLM_00509_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer509.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer509.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer509 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity509 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer509) {
    // EDIT toujours activé quand disponible
    editLayer509.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer509) {
        gradedLayer509.enabled = false;
    }
} else if (hasGradedLayer509) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer509.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText509 = planComp509.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText509.name = "WARNING_NO_EDIT";
    warningText509.property("Transform").property("Position").setValue([1280, 200]);
    warningText509.guideLayer = true;
    
    var warningTextDoc509 = warningText509.property("Source Text").value;
    warningTextDoc509.fontSize = 32;
    warningTextDoc509.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc509.font = "Arial-BoldMT";
    warningTextDoc509.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText509.property("Source Text").setValue(warningTextDoc509);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText509 = planComp509.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00509");
    errorText509.name = "ERROR_NO_SOURCE";
    errorText509.property("Transform").property("Position").setValue([1280, 720]);
    errorText509.guideLayer = true;
    
    var errorTextDoc509 = errorText509.property("Source Text").value;
    errorTextDoc509.fontSize = 48;
    errorTextDoc509.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc509.font = "Arial-BoldMT";
    errorTextDoc509.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText509.property("Source Text").setValue(errorTextDoc509);
}

planCompositions[509] = planComp509;


// Composition pour plan 00510
var planComp510 = project.items.addComp(
    "SQ28_UNDLM_00510_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp510.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer510 = planComp510.layers.add(bgSolidComp);
bgLayer510.name = "BG_SOLID";
bgLayer510.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer510 = false;
if (gradingSources[510]) {
    var gradedLayer510 = planComp510.layers.add(gradingSources[510]);
    gradedLayer510.name = "UNDLM_00510_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer510.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer510.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer510 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer510 = false;
if (editSources[510]) {
    var editLayer510 = planComp510.layers.add(editSources[510]);
    editLayer510.name = "UNDLM_00510_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer510.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer510.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer510 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity510 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer510) {
    // EDIT toujours activé quand disponible
    editLayer510.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer510) {
        gradedLayer510.enabled = false;
    }
} else if (hasGradedLayer510) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer510.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText510 = planComp510.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText510.name = "WARNING_NO_EDIT";
    warningText510.property("Transform").property("Position").setValue([1280, 200]);
    warningText510.guideLayer = true;
    
    var warningTextDoc510 = warningText510.property("Source Text").value;
    warningTextDoc510.fontSize = 32;
    warningTextDoc510.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc510.font = "Arial-BoldMT";
    warningTextDoc510.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText510.property("Source Text").setValue(warningTextDoc510);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText510 = planComp510.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00510");
    errorText510.name = "ERROR_NO_SOURCE";
    errorText510.property("Transform").property("Position").setValue([1280, 720]);
    errorText510.guideLayer = true;
    
    var errorTextDoc510 = errorText510.property("Source Text").value;
    errorTextDoc510.fontSize = 48;
    errorTextDoc510.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc510.font = "Arial-BoldMT";
    errorTextDoc510.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText510.property("Source Text").setValue(errorTextDoc510);
}

planCompositions[510] = planComp510;


// Composition pour plan 00511
var planComp511 = project.items.addComp(
    "SQ28_UNDLM_00511_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp511.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer511 = planComp511.layers.add(bgSolidComp);
bgLayer511.name = "BG_SOLID";
bgLayer511.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer511 = false;
if (gradingSources[511]) {
    var gradedLayer511 = planComp511.layers.add(gradingSources[511]);
    gradedLayer511.name = "UNDLM_00511_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer511.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer511.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer511 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer511 = false;
if (editSources[511]) {
    var editLayer511 = planComp511.layers.add(editSources[511]);
    editLayer511.name = "UNDLM_00511_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer511.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer511.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer511 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity511 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer511) {
    // EDIT toujours activé quand disponible
    editLayer511.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer511) {
        gradedLayer511.enabled = false;
    }
} else if (hasGradedLayer511) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer511.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText511 = planComp511.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText511.name = "WARNING_NO_EDIT";
    warningText511.property("Transform").property("Position").setValue([1280, 200]);
    warningText511.guideLayer = true;
    
    var warningTextDoc511 = warningText511.property("Source Text").value;
    warningTextDoc511.fontSize = 32;
    warningTextDoc511.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc511.font = "Arial-BoldMT";
    warningTextDoc511.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText511.property("Source Text").setValue(warningTextDoc511);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText511 = planComp511.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00511");
    errorText511.name = "ERROR_NO_SOURCE";
    errorText511.property("Transform").property("Position").setValue([1280, 720]);
    errorText511.guideLayer = true;
    
    var errorTextDoc511 = errorText511.property("Source Text").value;
    errorTextDoc511.fontSize = 48;
    errorTextDoc511.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc511.font = "Arial-BoldMT";
    errorTextDoc511.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText511.property("Source Text").setValue(errorTextDoc511);
}

planCompositions[511] = planComp511;


// Composition pour plan 00512
var planComp512 = project.items.addComp(
    "SQ28_UNDLM_00512_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    13.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp512.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer512 = planComp512.layers.add(bgSolidComp);
bgLayer512.name = "BG_SOLID";
bgLayer512.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer512 = false;
if (gradingSources[512]) {
    var gradedLayer512 = planComp512.layers.add(gradingSources[512]);
    gradedLayer512.name = "UNDLM_00512_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer512.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer512.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer512 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer512 = false;
if (editSources[512]) {
    var editLayer512 = planComp512.layers.add(editSources[512]);
    editLayer512.name = "UNDLM_00512_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer512.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer512.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer512 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity512 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer512) {
    // EDIT toujours activé quand disponible
    editLayer512.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer512) {
        gradedLayer512.enabled = false;
    }
} else if (hasGradedLayer512) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer512.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText512 = planComp512.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText512.name = "WARNING_NO_EDIT";
    warningText512.property("Transform").property("Position").setValue([1280, 200]);
    warningText512.guideLayer = true;
    
    var warningTextDoc512 = warningText512.property("Source Text").value;
    warningTextDoc512.fontSize = 32;
    warningTextDoc512.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc512.font = "Arial-BoldMT";
    warningTextDoc512.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText512.property("Source Text").setValue(warningTextDoc512);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText512 = planComp512.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00512");
    errorText512.name = "ERROR_NO_SOURCE";
    errorText512.property("Transform").property("Position").setValue([1280, 720]);
    errorText512.guideLayer = true;
    
    var errorTextDoc512 = errorText512.property("Source Text").value;
    errorTextDoc512.fontSize = 48;
    errorTextDoc512.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc512.font = "Arial-BoldMT";
    errorTextDoc512.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText512.property("Source Text").setValue(errorTextDoc512);
}

planCompositions[512] = planComp512;


// Composition pour plan 00513
var planComp513 = project.items.addComp(
    "SQ28_UNDLM_00513_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp513.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer513 = planComp513.layers.add(bgSolidComp);
bgLayer513.name = "BG_SOLID";
bgLayer513.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer513 = false;
if (gradingSources[513]) {
    var gradedLayer513 = planComp513.layers.add(gradingSources[513]);
    gradedLayer513.name = "UNDLM_00513_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer513.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer513.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer513 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer513 = false;
if (editSources[513]) {
    var editLayer513 = planComp513.layers.add(editSources[513]);
    editLayer513.name = "UNDLM_00513_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer513.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer513.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer513 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity513 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer513) {
    // EDIT toujours activé quand disponible
    editLayer513.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer513) {
        gradedLayer513.enabled = false;
    }
} else if (hasGradedLayer513) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer513.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText513 = planComp513.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText513.name = "WARNING_NO_EDIT";
    warningText513.property("Transform").property("Position").setValue([1280, 200]);
    warningText513.guideLayer = true;
    
    var warningTextDoc513 = warningText513.property("Source Text").value;
    warningTextDoc513.fontSize = 32;
    warningTextDoc513.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc513.font = "Arial-BoldMT";
    warningTextDoc513.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText513.property("Source Text").setValue(warningTextDoc513);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText513 = planComp513.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00513");
    errorText513.name = "ERROR_NO_SOURCE";
    errorText513.property("Transform").property("Position").setValue([1280, 720]);
    errorText513.guideLayer = true;
    
    var errorTextDoc513 = errorText513.property("Source Text").value;
    errorTextDoc513.fontSize = 48;
    errorTextDoc513.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc513.font = "Arial-BoldMT";
    errorTextDoc513.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText513.property("Source Text").setValue(errorTextDoc513);
}

planCompositions[513] = planComp513;


// Composition pour plan 00514
var planComp514 = project.items.addComp(
    "SQ28_UNDLM_00514_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp514.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer514 = planComp514.layers.add(bgSolidComp);
bgLayer514.name = "BG_SOLID";
bgLayer514.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer514 = false;
if (gradingSources[514]) {
    var gradedLayer514 = planComp514.layers.add(gradingSources[514]);
    gradedLayer514.name = "UNDLM_00514_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer514.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer514.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer514 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer514 = false;
if (editSources[514]) {
    var editLayer514 = planComp514.layers.add(editSources[514]);
    editLayer514.name = "UNDLM_00514_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer514.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer514.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer514 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity514 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer514) {
    // EDIT toujours activé quand disponible
    editLayer514.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer514) {
        gradedLayer514.enabled = false;
    }
} else if (hasGradedLayer514) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer514.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText514 = planComp514.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText514.name = "WARNING_NO_EDIT";
    warningText514.property("Transform").property("Position").setValue([1280, 200]);
    warningText514.guideLayer = true;
    
    var warningTextDoc514 = warningText514.property("Source Text").value;
    warningTextDoc514.fontSize = 32;
    warningTextDoc514.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc514.font = "Arial-BoldMT";
    warningTextDoc514.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText514.property("Source Text").setValue(warningTextDoc514);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText514 = planComp514.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00514");
    errorText514.name = "ERROR_NO_SOURCE";
    errorText514.property("Transform").property("Position").setValue([1280, 720]);
    errorText514.guideLayer = true;
    
    var errorTextDoc514 = errorText514.property("Source Text").value;
    errorTextDoc514.fontSize = 48;
    errorTextDoc514.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc514.font = "Arial-BoldMT";
    errorTextDoc514.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText514.property("Source Text").setValue(errorTextDoc514);
}

planCompositions[514] = planComp514;


// Composition pour plan 00515
var planComp515 = project.items.addComp(
    "SQ28_UNDLM_00515_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp515.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer515 = planComp515.layers.add(bgSolidComp);
bgLayer515.name = "BG_SOLID";
bgLayer515.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer515 = false;
if (gradingSources[515]) {
    var gradedLayer515 = planComp515.layers.add(gradingSources[515]);
    gradedLayer515.name = "UNDLM_00515_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer515.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer515.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer515 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer515 = false;
if (editSources[515]) {
    var editLayer515 = planComp515.layers.add(editSources[515]);
    editLayer515.name = "UNDLM_00515_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer515.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer515.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer515 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity515 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer515) {
    // EDIT toujours activé quand disponible
    editLayer515.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer515) {
        gradedLayer515.enabled = false;
    }
} else if (hasGradedLayer515) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer515.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText515 = planComp515.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText515.name = "WARNING_NO_EDIT";
    warningText515.property("Transform").property("Position").setValue([1280, 200]);
    warningText515.guideLayer = true;
    
    var warningTextDoc515 = warningText515.property("Source Text").value;
    warningTextDoc515.fontSize = 32;
    warningTextDoc515.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc515.font = "Arial-BoldMT";
    warningTextDoc515.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText515.property("Source Text").setValue(warningTextDoc515);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText515 = planComp515.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00515");
    errorText515.name = "ERROR_NO_SOURCE";
    errorText515.property("Transform").property("Position").setValue([1280, 720]);
    errorText515.guideLayer = true;
    
    var errorTextDoc515 = errorText515.property("Source Text").value;
    errorTextDoc515.fontSize = 48;
    errorTextDoc515.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc515.font = "Arial-BoldMT";
    errorTextDoc515.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText515.property("Source Text").setValue(errorTextDoc515);
}

planCompositions[515] = planComp515;


// Composition pour plan 00516
var planComp516 = project.items.addComp(
    "SQ28_UNDLM_00516_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp516.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer516 = planComp516.layers.add(bgSolidComp);
bgLayer516.name = "BG_SOLID";
bgLayer516.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer516 = false;
if (gradingSources[516]) {
    var gradedLayer516 = planComp516.layers.add(gradingSources[516]);
    gradedLayer516.name = "UNDLM_00516_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer516.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer516.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer516 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer516 = false;
if (editSources[516]) {
    var editLayer516 = planComp516.layers.add(editSources[516]);
    editLayer516.name = "UNDLM_00516_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer516.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer516.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer516 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity516 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer516) {
    // EDIT toujours activé quand disponible
    editLayer516.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer516) {
        gradedLayer516.enabled = false;
    }
} else if (hasGradedLayer516) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer516.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText516 = planComp516.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText516.name = "WARNING_NO_EDIT";
    warningText516.property("Transform").property("Position").setValue([1280, 200]);
    warningText516.guideLayer = true;
    
    var warningTextDoc516 = warningText516.property("Source Text").value;
    warningTextDoc516.fontSize = 32;
    warningTextDoc516.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc516.font = "Arial-BoldMT";
    warningTextDoc516.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText516.property("Source Text").setValue(warningTextDoc516);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText516 = planComp516.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00516");
    errorText516.name = "ERROR_NO_SOURCE";
    errorText516.property("Transform").property("Position").setValue([1280, 720]);
    errorText516.guideLayer = true;
    
    var errorTextDoc516 = errorText516.property("Source Text").value;
    errorTextDoc516.fontSize = 48;
    errorTextDoc516.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc516.font = "Arial-BoldMT";
    errorTextDoc516.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText516.property("Source Text").setValue(errorTextDoc516);
}

planCompositions[516] = planComp516;


// Composition pour plan 00517
var planComp517 = project.items.addComp(
    "SQ28_UNDLM_00517_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp517.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer517 = planComp517.layers.add(bgSolidComp);
bgLayer517.name = "BG_SOLID";
bgLayer517.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer517 = false;
if (gradingSources[517]) {
    var gradedLayer517 = planComp517.layers.add(gradingSources[517]);
    gradedLayer517.name = "UNDLM_00517_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer517.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer517.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer517 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer517 = false;
if (editSources[517]) {
    var editLayer517 = planComp517.layers.add(editSources[517]);
    editLayer517.name = "UNDLM_00517_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer517.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer517.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer517 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity517 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer517) {
    // EDIT toujours activé quand disponible
    editLayer517.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer517) {
        gradedLayer517.enabled = false;
    }
} else if (hasGradedLayer517) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer517.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText517 = planComp517.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText517.name = "WARNING_NO_EDIT";
    warningText517.property("Transform").property("Position").setValue([1280, 200]);
    warningText517.guideLayer = true;
    
    var warningTextDoc517 = warningText517.property("Source Text").value;
    warningTextDoc517.fontSize = 32;
    warningTextDoc517.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc517.font = "Arial-BoldMT";
    warningTextDoc517.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText517.property("Source Text").setValue(warningTextDoc517);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText517 = planComp517.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00517");
    errorText517.name = "ERROR_NO_SOURCE";
    errorText517.property("Transform").property("Position").setValue([1280, 720]);
    errorText517.guideLayer = true;
    
    var errorTextDoc517 = errorText517.property("Source Text").value;
    errorTextDoc517.fontSize = 48;
    errorTextDoc517.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc517.font = "Arial-BoldMT";
    errorTextDoc517.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText517.property("Source Text").setValue(errorTextDoc517);
}

planCompositions[517] = planComp517;


// Composition pour plan 00518
var planComp518 = project.items.addComp(
    "SQ28_UNDLM_00518_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp518.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer518 = planComp518.layers.add(bgSolidComp);
bgLayer518.name = "BG_SOLID";
bgLayer518.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer518 = false;
if (gradingSources[518]) {
    var gradedLayer518 = planComp518.layers.add(gradingSources[518]);
    gradedLayer518.name = "UNDLM_00518_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer518.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer518.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer518 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer518 = false;
if (editSources[518]) {
    var editLayer518 = planComp518.layers.add(editSources[518]);
    editLayer518.name = "UNDLM_00518_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer518.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer518.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer518 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity518 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer518) {
    // EDIT toujours activé quand disponible
    editLayer518.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer518) {
        gradedLayer518.enabled = false;
    }
} else if (hasGradedLayer518) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer518.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText518 = planComp518.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText518.name = "WARNING_NO_EDIT";
    warningText518.property("Transform").property("Position").setValue([1280, 200]);
    warningText518.guideLayer = true;
    
    var warningTextDoc518 = warningText518.property("Source Text").value;
    warningTextDoc518.fontSize = 32;
    warningTextDoc518.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc518.font = "Arial-BoldMT";
    warningTextDoc518.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText518.property("Source Text").setValue(warningTextDoc518);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText518 = planComp518.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00518");
    errorText518.name = "ERROR_NO_SOURCE";
    errorText518.property("Transform").property("Position").setValue([1280, 720]);
    errorText518.guideLayer = true;
    
    var errorTextDoc518 = errorText518.property("Source Text").value;
    errorTextDoc518.fontSize = 48;
    errorTextDoc518.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc518.font = "Arial-BoldMT";
    errorTextDoc518.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText518.property("Source Text").setValue(errorTextDoc518);
}

planCompositions[518] = planComp518;


// Composition pour plan 00519
var planComp519 = project.items.addComp(
    "SQ28_UNDLM_00519_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp519.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer519 = planComp519.layers.add(bgSolidComp);
bgLayer519.name = "BG_SOLID";
bgLayer519.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer519 = false;
if (gradingSources[519]) {
    var gradedLayer519 = planComp519.layers.add(gradingSources[519]);
    gradedLayer519.name = "UNDLM_00519_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer519.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer519.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer519 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer519 = false;
if (editSources[519]) {
    var editLayer519 = planComp519.layers.add(editSources[519]);
    editLayer519.name = "UNDLM_00519_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer519.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer519.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer519 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity519 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer519) {
    // EDIT toujours activé quand disponible
    editLayer519.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer519) {
        gradedLayer519.enabled = false;
    }
} else if (hasGradedLayer519) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer519.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText519 = planComp519.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText519.name = "WARNING_NO_EDIT";
    warningText519.property("Transform").property("Position").setValue([1280, 200]);
    warningText519.guideLayer = true;
    
    var warningTextDoc519 = warningText519.property("Source Text").value;
    warningTextDoc519.fontSize = 32;
    warningTextDoc519.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc519.font = "Arial-BoldMT";
    warningTextDoc519.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText519.property("Source Text").setValue(warningTextDoc519);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText519 = planComp519.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00519");
    errorText519.name = "ERROR_NO_SOURCE";
    errorText519.property("Transform").property("Position").setValue([1280, 720]);
    errorText519.guideLayer = true;
    
    var errorTextDoc519 = errorText519.property("Source Text").value;
    errorTextDoc519.fontSize = 48;
    errorTextDoc519.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc519.font = "Arial-BoldMT";
    errorTextDoc519.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText519.property("Source Text").setValue(errorTextDoc519);
}

planCompositions[519] = planComp519;


// Composition pour plan 00520
var planComp520 = project.items.addComp(
    "SQ28_UNDLM_00520_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp520.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer520 = planComp520.layers.add(bgSolidComp);
bgLayer520.name = "BG_SOLID";
bgLayer520.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer520 = false;
if (gradingSources[520]) {
    var gradedLayer520 = planComp520.layers.add(gradingSources[520]);
    gradedLayer520.name = "UNDLM_00520_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer520.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer520.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer520 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer520 = false;
if (editSources[520]) {
    var editLayer520 = planComp520.layers.add(editSources[520]);
    editLayer520.name = "UNDLM_00520_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer520.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer520.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer520 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity520 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer520) {
    // EDIT toujours activé quand disponible
    editLayer520.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer520) {
        gradedLayer520.enabled = false;
    }
} else if (hasGradedLayer520) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer520.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText520 = planComp520.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText520.name = "WARNING_NO_EDIT";
    warningText520.property("Transform").property("Position").setValue([1280, 200]);
    warningText520.guideLayer = true;
    
    var warningTextDoc520 = warningText520.property("Source Text").value;
    warningTextDoc520.fontSize = 32;
    warningTextDoc520.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc520.font = "Arial-BoldMT";
    warningTextDoc520.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText520.property("Source Text").setValue(warningTextDoc520);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText520 = planComp520.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00520");
    errorText520.name = "ERROR_NO_SOURCE";
    errorText520.property("Transform").property("Position").setValue([1280, 720]);
    errorText520.guideLayer = true;
    
    var errorTextDoc520 = errorText520.property("Source Text").value;
    errorTextDoc520.fontSize = 48;
    errorTextDoc520.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc520.font = "Arial-BoldMT";
    errorTextDoc520.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText520.property("Source Text").setValue(errorTextDoc520);
}

planCompositions[520] = planComp520;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ28_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    118.2, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00506 à la timeline master
if (planCompositions[506]) {
    var masterLayer506 = masterComp.layers.add(planCompositions[506]);
    masterLayer506.startTime = 0;
    masterLayer506.name = "UNDLM_00506";
    masterLayer506.label = 1; // Couleurs alternées
}

// Ajouter plan 00507 à la timeline master
if (planCompositions[507]) {
    var masterLayer507 = masterComp.layers.add(planCompositions[507]);
    masterLayer507.startTime = 10.92;
    masterLayer507.name = "UNDLM_00507";
    masterLayer507.label = 2; // Couleurs alternées
}

// Ajouter plan 00508 à la timeline master
if (planCompositions[508]) {
    var masterLayer508 = masterComp.layers.add(planCompositions[508]);
    masterLayer508.startTime = 18.32;
    masterLayer508.name = "UNDLM_00508";
    masterLayer508.label = 3; // Couleurs alternées
}

// Ajouter plan 00509 à la timeline master
if (planCompositions[509]) {
    var masterLayer509 = masterComp.layers.add(planCompositions[509]);
    masterLayer509.startTime = 23.92;
    masterLayer509.name = "UNDLM_00509";
    masterLayer509.label = 4; // Couleurs alternées
}

// Ajouter plan 00510 à la timeline master
if (planCompositions[510]) {
    var masterLayer510 = masterComp.layers.add(planCompositions[510]);
    masterLayer510.startTime = 31.480000000000004;
    masterLayer510.name = "UNDLM_00510";
    masterLayer510.label = 5; // Couleurs alternées
}

// Ajouter plan 00511 à la timeline master
if (planCompositions[511]) {
    var masterLayer511 = masterComp.layers.add(planCompositions[511]);
    masterLayer511.startTime = 42.36000000000001;
    masterLayer511.name = "UNDLM_00511";
    masterLayer511.label = 6; // Couleurs alternées
}

// Ajouter plan 00512 à la timeline master
if (planCompositions[512]) {
    var masterLayer512 = masterComp.layers.add(planCompositions[512]);
    masterLayer512.startTime = 49.84;
    masterLayer512.name = "UNDLM_00512";
    masterLayer512.label = 7; // Couleurs alternées
}

// Ajouter plan 00513 à la timeline master
if (planCompositions[513]) {
    var masterLayer513 = masterComp.layers.add(planCompositions[513]);
    masterLayer513.startTime = 63.440000000000005;
    masterLayer513.name = "UNDLM_00513";
    masterLayer513.label = 8; // Couleurs alternées
}

// Ajouter plan 00514 à la timeline master
if (planCompositions[514]) {
    var masterLayer514 = masterComp.layers.add(planCompositions[514]);
    masterLayer514.startTime = 73.44;
    masterLayer514.name = "UNDLM_00514";
    masterLayer514.label = 9; // Couleurs alternées
}

// Ajouter plan 00515 à la timeline master
if (planCompositions[515]) {
    var masterLayer515 = masterComp.layers.add(planCompositions[515]);
    masterLayer515.startTime = 81.32;
    masterLayer515.name = "UNDLM_00515";
    masterLayer515.label = 10; // Couleurs alternées
}

// Ajouter plan 00516 à la timeline master
if (planCompositions[516]) {
    var masterLayer516 = masterComp.layers.add(planCompositions[516]);
    masterLayer516.startTime = 89.11999999999999;
    masterLayer516.name = "UNDLM_00516";
    masterLayer516.label = 11; // Couleurs alternées
}

// Ajouter plan 00517 à la timeline master
if (planCompositions[517]) {
    var masterLayer517 = masterComp.layers.add(planCompositions[517]);
    masterLayer517.startTime = 93.6;
    masterLayer517.name = "UNDLM_00517";
    masterLayer517.label = 12; // Couleurs alternées
}

// Ajouter plan 00518 à la timeline master
if (planCompositions[518]) {
    var masterLayer518 = masterComp.layers.add(planCompositions[518]);
    masterLayer518.startTime = 97.6;
    masterLayer518.name = "UNDLM_00518";
    masterLayer518.label = 13; // Couleurs alternées
}

// Ajouter plan 00519 à la timeline master
if (planCompositions[519]) {
    var masterLayer519 = masterComp.layers.add(planCompositions[519]);
    masterLayer519.startTime = 106.56;
    masterLayer519.name = "UNDLM_00519";
    masterLayer519.label = 14; // Couleurs alternées
}

// Ajouter plan 00520 à la timeline master
if (planCompositions[520]) {
    var masterLayer520 = masterComp.layers.add(planCompositions[520]);
    masterLayer520.startTime = 114.36;
    masterLayer520.name = "UNDLM_00520";
    masterLayer520.label = 15; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ28";\n' +
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
    {start: 0, end: 10.92, name: "UNDLM_00506"},
    {start: 10.92, end: 18.32, name: "UNDLM_00507"},
    {start: 18.32, end: 23.92, name: "UNDLM_00508"},
    {start: 23.92, end: 31.480000000000004, name: "UNDLM_00509"},
    {start: 31.480000000000004, end: 42.36000000000001, name: "UNDLM_00510"},
    {start: 42.36000000000001, end: 49.84, name: "UNDLM_00511"},
    {start: 49.84, end: 63.440000000000005, name: "UNDLM_00512"},
    {start: 63.440000000000005, end: 73.44, name: "UNDLM_00513"},
    {start: 73.44, end: 81.32, name: "UNDLM_00514"},
    {start: 81.32, end: 89.11999999999999, name: "UNDLM_00515"},
    {start: 89.11999999999999, end: 93.6, name: "UNDLM_00516"},
    {start: 93.6, end: 97.6, name: "UNDLM_00517"},
    {start: 97.6, end: 106.56, name: "UNDLM_00518"},
    {start: 106.56, end: 114.36, name: "UNDLM_00519"},
    {start: 114.36, end: 118.2, name: "UNDLM_00520"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ28/_AE/SQ28_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 14;
var totalCount = 15;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ28 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(118.2 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ28_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ28:" + totalCount + ":" + gradedCount);
