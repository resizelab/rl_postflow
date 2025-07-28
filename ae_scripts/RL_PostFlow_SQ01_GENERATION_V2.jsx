
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ01 avec 34 plans
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


// Import plan EDIT 00001
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile1 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00001.mov");
var editFilePoignees1 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00001_AVEC_POIGNEES.mov");
var editFileBis1 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00001bis.mov");

var importSuccess1 = false;
var fileName1 = "";

// Tenter import standard
if (editFile1.exists) {
    try {
        var editFootage1 = project.importFile(new ImportOptions(editFile1));
        editFootage1.parentFolder = fromEditFolder;
        editFootage1.name = "UNDLM_00001";
        editSources[1] = editFootage1;
        editImportCount++;
        importSuccess1 = true;
        fileName1 = "UNDLM_00001.mov";
        logImportSuccess(1, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00001.mov", fileName1);
    } catch (e) {
        logImportError(1, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00001.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess1 && editFilePoignees1.exists) {
    try {
        var editFootage1 = project.importFile(new ImportOptions(editFilePoignees1));
        editFootage1.parentFolder = fromEditFolder;
        editFootage1.name = "UNDLM_00001_AVEC_POIGNEES";
        editSources[1] = editFootage1;
        editImportCount++;
        importSuccess1 = true;
        fileName1 = "UNDLM_00001_AVEC_POIGNEES.mov";
        logImportSuccess(1, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00001_AVEC_POIGNEES.mov", fileName1);
    } catch (e) {
        logImportError(1, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00001_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess1 && editFileBis1.exists) {
    try {
        var editFootage1 = project.importFile(new ImportOptions(editFileBis1));
        editFootage1.parentFolder = fromEditFolder;
        editFootage1.name = "UNDLM_00001bis";
        editSources[1] = editFootage1;
        editImportCount++;
        importSuccess1 = true;
        fileName1 = "UNDLM_00001bis.mov";
        logImportSuccess(1, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00001bis.mov", fileName1);
    } catch (e) {
        logImportError(1, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00001bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess1) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00001.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00002
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile2 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00002.mov");
var editFilePoignees2 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00002_AVEC_POIGNEES.mov");
var editFileBis2 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00002bis.mov");

var importSuccess2 = false;
var fileName2 = "";

// Tenter import standard
if (editFile2.exists) {
    try {
        var editFootage2 = project.importFile(new ImportOptions(editFile2));
        editFootage2.parentFolder = fromEditFolder;
        editFootage2.name = "UNDLM_00002";
        editSources[2] = editFootage2;
        editImportCount++;
        importSuccess2 = true;
        fileName2 = "UNDLM_00002.mov";
        logImportSuccess(2, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00002.mov", fileName2);
    } catch (e) {
        logImportError(2, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00002.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess2 && editFilePoignees2.exists) {
    try {
        var editFootage2 = project.importFile(new ImportOptions(editFilePoignees2));
        editFootage2.parentFolder = fromEditFolder;
        editFootage2.name = "UNDLM_00002_AVEC_POIGNEES";
        editSources[2] = editFootage2;
        editImportCount++;
        importSuccess2 = true;
        fileName2 = "UNDLM_00002_AVEC_POIGNEES.mov";
        logImportSuccess(2, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00002_AVEC_POIGNEES.mov", fileName2);
    } catch (e) {
        logImportError(2, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00002_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess2 && editFileBis2.exists) {
    try {
        var editFootage2 = project.importFile(new ImportOptions(editFileBis2));
        editFootage2.parentFolder = fromEditFolder;
        editFootage2.name = "UNDLM_00002bis";
        editSources[2] = editFootage2;
        editImportCount++;
        importSuccess2 = true;
        fileName2 = "UNDLM_00002bis.mov";
        logImportSuccess(2, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00002bis.mov", fileName2);
    } catch (e) {
        logImportError(2, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00002bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess2) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00002.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00003
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile3 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00003.mov");
var editFilePoignees3 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00003_AVEC_POIGNEES.mov");
var editFileBis3 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00003bis.mov");

var importSuccess3 = false;
var fileName3 = "";

// Tenter import standard
if (editFile3.exists) {
    try {
        var editFootage3 = project.importFile(new ImportOptions(editFile3));
        editFootage3.parentFolder = fromEditFolder;
        editFootage3.name = "UNDLM_00003";
        editSources[3] = editFootage3;
        editImportCount++;
        importSuccess3 = true;
        fileName3 = "UNDLM_00003.mov";
        logImportSuccess(3, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00003.mov", fileName3);
    } catch (e) {
        logImportError(3, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00003.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess3 && editFilePoignees3.exists) {
    try {
        var editFootage3 = project.importFile(new ImportOptions(editFilePoignees3));
        editFootage3.parentFolder = fromEditFolder;
        editFootage3.name = "UNDLM_00003_AVEC_POIGNEES";
        editSources[3] = editFootage3;
        editImportCount++;
        importSuccess3 = true;
        fileName3 = "UNDLM_00003_AVEC_POIGNEES.mov";
        logImportSuccess(3, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00003_AVEC_POIGNEES.mov", fileName3);
    } catch (e) {
        logImportError(3, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00003_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess3 && editFileBis3.exists) {
    try {
        var editFootage3 = project.importFile(new ImportOptions(editFileBis3));
        editFootage3.parentFolder = fromEditFolder;
        editFootage3.name = "UNDLM_00003bis";
        editSources[3] = editFootage3;
        editImportCount++;
        importSuccess3 = true;
        fileName3 = "UNDLM_00003bis.mov";
        logImportSuccess(3, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00003bis.mov", fileName3);
    } catch (e) {
        logImportError(3, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00003bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess3) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00003.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00004
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile4 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00004.mov");
var editFilePoignees4 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00004_AVEC_POIGNEES.mov");
var editFileBis4 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00004bis.mov");

var importSuccess4 = false;
var fileName4 = "";

// Tenter import standard
if (editFile4.exists) {
    try {
        var editFootage4 = project.importFile(new ImportOptions(editFile4));
        editFootage4.parentFolder = fromEditFolder;
        editFootage4.name = "UNDLM_00004";
        editSources[4] = editFootage4;
        editImportCount++;
        importSuccess4 = true;
        fileName4 = "UNDLM_00004.mov";
        logImportSuccess(4, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00004.mov", fileName4);
    } catch (e) {
        logImportError(4, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00004.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess4 && editFilePoignees4.exists) {
    try {
        var editFootage4 = project.importFile(new ImportOptions(editFilePoignees4));
        editFootage4.parentFolder = fromEditFolder;
        editFootage4.name = "UNDLM_00004_AVEC_POIGNEES";
        editSources[4] = editFootage4;
        editImportCount++;
        importSuccess4 = true;
        fileName4 = "UNDLM_00004_AVEC_POIGNEES.mov";
        logImportSuccess(4, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00004_AVEC_POIGNEES.mov", fileName4);
    } catch (e) {
        logImportError(4, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00004_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess4 && editFileBis4.exists) {
    try {
        var editFootage4 = project.importFile(new ImportOptions(editFileBis4));
        editFootage4.parentFolder = fromEditFolder;
        editFootage4.name = "UNDLM_00004bis";
        editSources[4] = editFootage4;
        editImportCount++;
        importSuccess4 = true;
        fileName4 = "UNDLM_00004bis.mov";
        logImportSuccess(4, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00004bis.mov", fileName4);
    } catch (e) {
        logImportError(4, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00004bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess4) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00004.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00005
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile5 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00005.mov");
var editFilePoignees5 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00005_AVEC_POIGNEES.mov");
var editFileBis5 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00005bis.mov");

var importSuccess5 = false;
var fileName5 = "";

// Tenter import standard
if (editFile5.exists) {
    try {
        var editFootage5 = project.importFile(new ImportOptions(editFile5));
        editFootage5.parentFolder = fromEditFolder;
        editFootage5.name = "UNDLM_00005";
        editSources[5] = editFootage5;
        editImportCount++;
        importSuccess5 = true;
        fileName5 = "UNDLM_00005.mov";
        logImportSuccess(5, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00005.mov", fileName5);
    } catch (e) {
        logImportError(5, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00005.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess5 && editFilePoignees5.exists) {
    try {
        var editFootage5 = project.importFile(new ImportOptions(editFilePoignees5));
        editFootage5.parentFolder = fromEditFolder;
        editFootage5.name = "UNDLM_00005_AVEC_POIGNEES";
        editSources[5] = editFootage5;
        editImportCount++;
        importSuccess5 = true;
        fileName5 = "UNDLM_00005_AVEC_POIGNEES.mov";
        logImportSuccess(5, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00005_AVEC_POIGNEES.mov", fileName5);
    } catch (e) {
        logImportError(5, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00005_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess5 && editFileBis5.exists) {
    try {
        var editFootage5 = project.importFile(new ImportOptions(editFileBis5));
        editFootage5.parentFolder = fromEditFolder;
        editFootage5.name = "UNDLM_00005bis";
        editSources[5] = editFootage5;
        editImportCount++;
        importSuccess5 = true;
        fileName5 = "UNDLM_00005bis.mov";
        logImportSuccess(5, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00005bis.mov", fileName5);
    } catch (e) {
        logImportError(5, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00005bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess5) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00005.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00006
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile6 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00006.mov");
var editFilePoignees6 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00006_AVEC_POIGNEES.mov");
var editFileBis6 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00006bis.mov");

var importSuccess6 = false;
var fileName6 = "";

// Tenter import standard
if (editFile6.exists) {
    try {
        var editFootage6 = project.importFile(new ImportOptions(editFile6));
        editFootage6.parentFolder = fromEditFolder;
        editFootage6.name = "UNDLM_00006";
        editSources[6] = editFootage6;
        editImportCount++;
        importSuccess6 = true;
        fileName6 = "UNDLM_00006.mov";
        logImportSuccess(6, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00006.mov", fileName6);
    } catch (e) {
        logImportError(6, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00006.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess6 && editFilePoignees6.exists) {
    try {
        var editFootage6 = project.importFile(new ImportOptions(editFilePoignees6));
        editFootage6.parentFolder = fromEditFolder;
        editFootage6.name = "UNDLM_00006_AVEC_POIGNEES";
        editSources[6] = editFootage6;
        editImportCount++;
        importSuccess6 = true;
        fileName6 = "UNDLM_00006_AVEC_POIGNEES.mov";
        logImportSuccess(6, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00006_AVEC_POIGNEES.mov", fileName6);
    } catch (e) {
        logImportError(6, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00006_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess6 && editFileBis6.exists) {
    try {
        var editFootage6 = project.importFile(new ImportOptions(editFileBis6));
        editFootage6.parentFolder = fromEditFolder;
        editFootage6.name = "UNDLM_00006bis";
        editSources[6] = editFootage6;
        editImportCount++;
        importSuccess6 = true;
        fileName6 = "UNDLM_00006bis.mov";
        logImportSuccess(6, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00006bis.mov", fileName6);
    } catch (e) {
        logImportError(6, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00006bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess6) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00006.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00007
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile7 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00007.mov");
var editFilePoignees7 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00007_AVEC_POIGNEES.mov");
var editFileBis7 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00007bis.mov");

var importSuccess7 = false;
var fileName7 = "";

// Tenter import standard
if (editFile7.exists) {
    try {
        var editFootage7 = project.importFile(new ImportOptions(editFile7));
        editFootage7.parentFolder = fromEditFolder;
        editFootage7.name = "UNDLM_00007";
        editSources[7] = editFootage7;
        editImportCount++;
        importSuccess7 = true;
        fileName7 = "UNDLM_00007.mov";
        logImportSuccess(7, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00007.mov", fileName7);
    } catch (e) {
        logImportError(7, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00007.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess7 && editFilePoignees7.exists) {
    try {
        var editFootage7 = project.importFile(new ImportOptions(editFilePoignees7));
        editFootage7.parentFolder = fromEditFolder;
        editFootage7.name = "UNDLM_00007_AVEC_POIGNEES";
        editSources[7] = editFootage7;
        editImportCount++;
        importSuccess7 = true;
        fileName7 = "UNDLM_00007_AVEC_POIGNEES.mov";
        logImportSuccess(7, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00007_AVEC_POIGNEES.mov", fileName7);
    } catch (e) {
        logImportError(7, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00007_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess7 && editFileBis7.exists) {
    try {
        var editFootage7 = project.importFile(new ImportOptions(editFileBis7));
        editFootage7.parentFolder = fromEditFolder;
        editFootage7.name = "UNDLM_00007bis";
        editSources[7] = editFootage7;
        editImportCount++;
        importSuccess7 = true;
        fileName7 = "UNDLM_00007bis.mov";
        logImportSuccess(7, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00007bis.mov", fileName7);
    } catch (e) {
        logImportError(7, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00007bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess7) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00007.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00008
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile8 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00008.mov");
var editFilePoignees8 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00008_AVEC_POIGNEES.mov");
var editFileBis8 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00008bis.mov");

var importSuccess8 = false;
var fileName8 = "";

// Tenter import standard
if (editFile8.exists) {
    try {
        var editFootage8 = project.importFile(new ImportOptions(editFile8));
        editFootage8.parentFolder = fromEditFolder;
        editFootage8.name = "UNDLM_00008";
        editSources[8] = editFootage8;
        editImportCount++;
        importSuccess8 = true;
        fileName8 = "UNDLM_00008.mov";
        logImportSuccess(8, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00008.mov", fileName8);
    } catch (e) {
        logImportError(8, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00008.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess8 && editFilePoignees8.exists) {
    try {
        var editFootage8 = project.importFile(new ImportOptions(editFilePoignees8));
        editFootage8.parentFolder = fromEditFolder;
        editFootage8.name = "UNDLM_00008_AVEC_POIGNEES";
        editSources[8] = editFootage8;
        editImportCount++;
        importSuccess8 = true;
        fileName8 = "UNDLM_00008_AVEC_POIGNEES.mov";
        logImportSuccess(8, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00008_AVEC_POIGNEES.mov", fileName8);
    } catch (e) {
        logImportError(8, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00008_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess8 && editFileBis8.exists) {
    try {
        var editFootage8 = project.importFile(new ImportOptions(editFileBis8));
        editFootage8.parentFolder = fromEditFolder;
        editFootage8.name = "UNDLM_00008bis";
        editSources[8] = editFootage8;
        editImportCount++;
        importSuccess8 = true;
        fileName8 = "UNDLM_00008bis.mov";
        logImportSuccess(8, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00008bis.mov", fileName8);
    } catch (e) {
        logImportError(8, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00008bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess8) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00008.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00009
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile9 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00009.mov");
var editFilePoignees9 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00009_AVEC_POIGNEES.mov");
var editFileBis9 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00009bis.mov");

var importSuccess9 = false;
var fileName9 = "";

// Tenter import standard
if (editFile9.exists) {
    try {
        var editFootage9 = project.importFile(new ImportOptions(editFile9));
        editFootage9.parentFolder = fromEditFolder;
        editFootage9.name = "UNDLM_00009";
        editSources[9] = editFootage9;
        editImportCount++;
        importSuccess9 = true;
        fileName9 = "UNDLM_00009.mov";
        logImportSuccess(9, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00009.mov", fileName9);
    } catch (e) {
        logImportError(9, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00009.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess9 && editFilePoignees9.exists) {
    try {
        var editFootage9 = project.importFile(new ImportOptions(editFilePoignees9));
        editFootage9.parentFolder = fromEditFolder;
        editFootage9.name = "UNDLM_00009_AVEC_POIGNEES";
        editSources[9] = editFootage9;
        editImportCount++;
        importSuccess9 = true;
        fileName9 = "UNDLM_00009_AVEC_POIGNEES.mov";
        logImportSuccess(9, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00009_AVEC_POIGNEES.mov", fileName9);
    } catch (e) {
        logImportError(9, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00009_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess9 && editFileBis9.exists) {
    try {
        var editFootage9 = project.importFile(new ImportOptions(editFileBis9));
        editFootage9.parentFolder = fromEditFolder;
        editFootage9.name = "UNDLM_00009bis";
        editSources[9] = editFootage9;
        editImportCount++;
        importSuccess9 = true;
        fileName9 = "UNDLM_00009bis.mov";
        logImportSuccess(9, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00009bis.mov", fileName9);
    } catch (e) {
        logImportError(9, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00009bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess9) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00009.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00010
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile10 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00010.mov");
var editFilePoignees10 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00010_AVEC_POIGNEES.mov");
var editFileBis10 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00010bis.mov");

var importSuccess10 = false;
var fileName10 = "";

// Tenter import standard
if (editFile10.exists) {
    try {
        var editFootage10 = project.importFile(new ImportOptions(editFile10));
        editFootage10.parentFolder = fromEditFolder;
        editFootage10.name = "UNDLM_00010";
        editSources[10] = editFootage10;
        editImportCount++;
        importSuccess10 = true;
        fileName10 = "UNDLM_00010.mov";
        logImportSuccess(10, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00010.mov", fileName10);
    } catch (e) {
        logImportError(10, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00010.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess10 && editFilePoignees10.exists) {
    try {
        var editFootage10 = project.importFile(new ImportOptions(editFilePoignees10));
        editFootage10.parentFolder = fromEditFolder;
        editFootage10.name = "UNDLM_00010_AVEC_POIGNEES";
        editSources[10] = editFootage10;
        editImportCount++;
        importSuccess10 = true;
        fileName10 = "UNDLM_00010_AVEC_POIGNEES.mov";
        logImportSuccess(10, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00010_AVEC_POIGNEES.mov", fileName10);
    } catch (e) {
        logImportError(10, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00010_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess10 && editFileBis10.exists) {
    try {
        var editFootage10 = project.importFile(new ImportOptions(editFileBis10));
        editFootage10.parentFolder = fromEditFolder;
        editFootage10.name = "UNDLM_00010bis";
        editSources[10] = editFootage10;
        editImportCount++;
        importSuccess10 = true;
        fileName10 = "UNDLM_00010bis.mov";
        logImportSuccess(10, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00010bis.mov", fileName10);
    } catch (e) {
        logImportError(10, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00010bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess10) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00010.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00011
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile11 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00011.mov");
var editFilePoignees11 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00011_AVEC_POIGNEES.mov");
var editFileBis11 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00011bis.mov");

var importSuccess11 = false;
var fileName11 = "";

// Tenter import standard
if (editFile11.exists) {
    try {
        var editFootage11 = project.importFile(new ImportOptions(editFile11));
        editFootage11.parentFolder = fromEditFolder;
        editFootage11.name = "UNDLM_00011";
        editSources[11] = editFootage11;
        editImportCount++;
        importSuccess11 = true;
        fileName11 = "UNDLM_00011.mov";
        logImportSuccess(11, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00011.mov", fileName11);
    } catch (e) {
        logImportError(11, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00011.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess11 && editFilePoignees11.exists) {
    try {
        var editFootage11 = project.importFile(new ImportOptions(editFilePoignees11));
        editFootage11.parentFolder = fromEditFolder;
        editFootage11.name = "UNDLM_00011_AVEC_POIGNEES";
        editSources[11] = editFootage11;
        editImportCount++;
        importSuccess11 = true;
        fileName11 = "UNDLM_00011_AVEC_POIGNEES.mov";
        logImportSuccess(11, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00011_AVEC_POIGNEES.mov", fileName11);
    } catch (e) {
        logImportError(11, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00011_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess11 && editFileBis11.exists) {
    try {
        var editFootage11 = project.importFile(new ImportOptions(editFileBis11));
        editFootage11.parentFolder = fromEditFolder;
        editFootage11.name = "UNDLM_00011bis";
        editSources[11] = editFootage11;
        editImportCount++;
        importSuccess11 = true;
        fileName11 = "UNDLM_00011bis.mov";
        logImportSuccess(11, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00011bis.mov", fileName11);
    } catch (e) {
        logImportError(11, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00011bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess11) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00011.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00012
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile12 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00012.mov");
var editFilePoignees12 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00012_AVEC_POIGNEES.mov");
var editFileBis12 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00012bis.mov");

var importSuccess12 = false;
var fileName12 = "";

// Tenter import standard
if (editFile12.exists) {
    try {
        var editFootage12 = project.importFile(new ImportOptions(editFile12));
        editFootage12.parentFolder = fromEditFolder;
        editFootage12.name = "UNDLM_00012";
        editSources[12] = editFootage12;
        editImportCount++;
        importSuccess12 = true;
        fileName12 = "UNDLM_00012.mov";
        logImportSuccess(12, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00012.mov", fileName12);
    } catch (e) {
        logImportError(12, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00012.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess12 && editFilePoignees12.exists) {
    try {
        var editFootage12 = project.importFile(new ImportOptions(editFilePoignees12));
        editFootage12.parentFolder = fromEditFolder;
        editFootage12.name = "UNDLM_00012_AVEC_POIGNEES";
        editSources[12] = editFootage12;
        editImportCount++;
        importSuccess12 = true;
        fileName12 = "UNDLM_00012_AVEC_POIGNEES.mov";
        logImportSuccess(12, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00012_AVEC_POIGNEES.mov", fileName12);
    } catch (e) {
        logImportError(12, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00012_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess12 && editFileBis12.exists) {
    try {
        var editFootage12 = project.importFile(new ImportOptions(editFileBis12));
        editFootage12.parentFolder = fromEditFolder;
        editFootage12.name = "UNDLM_00012bis";
        editSources[12] = editFootage12;
        editImportCount++;
        importSuccess12 = true;
        fileName12 = "UNDLM_00012bis.mov";
        logImportSuccess(12, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00012bis.mov", fileName12);
    } catch (e) {
        logImportError(12, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00012bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess12) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00012.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00013
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile13 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00013.mov");
var editFilePoignees13 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00013_AVEC_POIGNEES.mov");
var editFileBis13 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00013bis.mov");

var importSuccess13 = false;
var fileName13 = "";

// Tenter import standard
if (editFile13.exists) {
    try {
        var editFootage13 = project.importFile(new ImportOptions(editFile13));
        editFootage13.parentFolder = fromEditFolder;
        editFootage13.name = "UNDLM_00013";
        editSources[13] = editFootage13;
        editImportCount++;
        importSuccess13 = true;
        fileName13 = "UNDLM_00013.mov";
        logImportSuccess(13, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00013.mov", fileName13);
    } catch (e) {
        logImportError(13, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00013.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess13 && editFilePoignees13.exists) {
    try {
        var editFootage13 = project.importFile(new ImportOptions(editFilePoignees13));
        editFootage13.parentFolder = fromEditFolder;
        editFootage13.name = "UNDLM_00013_AVEC_POIGNEES";
        editSources[13] = editFootage13;
        editImportCount++;
        importSuccess13 = true;
        fileName13 = "UNDLM_00013_AVEC_POIGNEES.mov";
        logImportSuccess(13, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00013_AVEC_POIGNEES.mov", fileName13);
    } catch (e) {
        logImportError(13, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00013_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess13 && editFileBis13.exists) {
    try {
        var editFootage13 = project.importFile(new ImportOptions(editFileBis13));
        editFootage13.parentFolder = fromEditFolder;
        editFootage13.name = "UNDLM_00013bis";
        editSources[13] = editFootage13;
        editImportCount++;
        importSuccess13 = true;
        fileName13 = "UNDLM_00013bis.mov";
        logImportSuccess(13, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00013bis.mov", fileName13);
    } catch (e) {
        logImportError(13, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00013bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess13) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00013.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00014
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile14 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00014.mov");
var editFilePoignees14 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00014_AVEC_POIGNEES.mov");
var editFileBis14 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00014bis.mov");

var importSuccess14 = false;
var fileName14 = "";

// Tenter import standard
if (editFile14.exists) {
    try {
        var editFootage14 = project.importFile(new ImportOptions(editFile14));
        editFootage14.parentFolder = fromEditFolder;
        editFootage14.name = "UNDLM_00014";
        editSources[14] = editFootage14;
        editImportCount++;
        importSuccess14 = true;
        fileName14 = "UNDLM_00014.mov";
        logImportSuccess(14, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00014.mov", fileName14);
    } catch (e) {
        logImportError(14, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00014.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess14 && editFilePoignees14.exists) {
    try {
        var editFootage14 = project.importFile(new ImportOptions(editFilePoignees14));
        editFootage14.parentFolder = fromEditFolder;
        editFootage14.name = "UNDLM_00014_AVEC_POIGNEES";
        editSources[14] = editFootage14;
        editImportCount++;
        importSuccess14 = true;
        fileName14 = "UNDLM_00014_AVEC_POIGNEES.mov";
        logImportSuccess(14, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00014_AVEC_POIGNEES.mov", fileName14);
    } catch (e) {
        logImportError(14, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00014_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess14 && editFileBis14.exists) {
    try {
        var editFootage14 = project.importFile(new ImportOptions(editFileBis14));
        editFootage14.parentFolder = fromEditFolder;
        editFootage14.name = "UNDLM_00014bis";
        editSources[14] = editFootage14;
        editImportCount++;
        importSuccess14 = true;
        fileName14 = "UNDLM_00014bis.mov";
        logImportSuccess(14, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00014bis.mov", fileName14);
    } catch (e) {
        logImportError(14, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00014bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess14) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00014.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00015
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile15 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00015.mov");
var editFilePoignees15 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00015_AVEC_POIGNEES.mov");
var editFileBis15 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00015bis.mov");

var importSuccess15 = false;
var fileName15 = "";

// Tenter import standard
if (editFile15.exists) {
    try {
        var editFootage15 = project.importFile(new ImportOptions(editFile15));
        editFootage15.parentFolder = fromEditFolder;
        editFootage15.name = "UNDLM_00015";
        editSources[15] = editFootage15;
        editImportCount++;
        importSuccess15 = true;
        fileName15 = "UNDLM_00015.mov";
        logImportSuccess(15, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00015.mov", fileName15);
    } catch (e) {
        logImportError(15, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00015.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess15 && editFilePoignees15.exists) {
    try {
        var editFootage15 = project.importFile(new ImportOptions(editFilePoignees15));
        editFootage15.parentFolder = fromEditFolder;
        editFootage15.name = "UNDLM_00015_AVEC_POIGNEES";
        editSources[15] = editFootage15;
        editImportCount++;
        importSuccess15 = true;
        fileName15 = "UNDLM_00015_AVEC_POIGNEES.mov";
        logImportSuccess(15, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00015_AVEC_POIGNEES.mov", fileName15);
    } catch (e) {
        logImportError(15, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00015_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess15 && editFileBis15.exists) {
    try {
        var editFootage15 = project.importFile(new ImportOptions(editFileBis15));
        editFootage15.parentFolder = fromEditFolder;
        editFootage15.name = "UNDLM_00015bis";
        editSources[15] = editFootage15;
        editImportCount++;
        importSuccess15 = true;
        fileName15 = "UNDLM_00015bis.mov";
        logImportSuccess(15, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00015bis.mov", fileName15);
    } catch (e) {
        logImportError(15, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00015bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess15) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00015.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00016
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile16 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00016.mov");
var editFilePoignees16 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00016_AVEC_POIGNEES.mov");
var editFileBis16 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00016bis.mov");

var importSuccess16 = false;
var fileName16 = "";

// Tenter import standard
if (editFile16.exists) {
    try {
        var editFootage16 = project.importFile(new ImportOptions(editFile16));
        editFootage16.parentFolder = fromEditFolder;
        editFootage16.name = "UNDLM_00016";
        editSources[16] = editFootage16;
        editImportCount++;
        importSuccess16 = true;
        fileName16 = "UNDLM_00016.mov";
        logImportSuccess(16, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00016.mov", fileName16);
    } catch (e) {
        logImportError(16, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00016.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess16 && editFilePoignees16.exists) {
    try {
        var editFootage16 = project.importFile(new ImportOptions(editFilePoignees16));
        editFootage16.parentFolder = fromEditFolder;
        editFootage16.name = "UNDLM_00016_AVEC_POIGNEES";
        editSources[16] = editFootage16;
        editImportCount++;
        importSuccess16 = true;
        fileName16 = "UNDLM_00016_AVEC_POIGNEES.mov";
        logImportSuccess(16, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00016_AVEC_POIGNEES.mov", fileName16);
    } catch (e) {
        logImportError(16, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00016_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess16 && editFileBis16.exists) {
    try {
        var editFootage16 = project.importFile(new ImportOptions(editFileBis16));
        editFootage16.parentFolder = fromEditFolder;
        editFootage16.name = "UNDLM_00016bis";
        editSources[16] = editFootage16;
        editImportCount++;
        importSuccess16 = true;
        fileName16 = "UNDLM_00016bis.mov";
        logImportSuccess(16, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00016bis.mov", fileName16);
    } catch (e) {
        logImportError(16, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00016bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess16) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00016.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00017
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile17 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00017.mov");
var editFilePoignees17 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00017_AVEC_POIGNEES.mov");
var editFileBis17 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00017bis.mov");

var importSuccess17 = false;
var fileName17 = "";

// Tenter import standard
if (editFile17.exists) {
    try {
        var editFootage17 = project.importFile(new ImportOptions(editFile17));
        editFootage17.parentFolder = fromEditFolder;
        editFootage17.name = "UNDLM_00017";
        editSources[17] = editFootage17;
        editImportCount++;
        importSuccess17 = true;
        fileName17 = "UNDLM_00017.mov";
        logImportSuccess(17, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00017.mov", fileName17);
    } catch (e) {
        logImportError(17, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00017.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess17 && editFilePoignees17.exists) {
    try {
        var editFootage17 = project.importFile(new ImportOptions(editFilePoignees17));
        editFootage17.parentFolder = fromEditFolder;
        editFootage17.name = "UNDLM_00017_AVEC_POIGNEES";
        editSources[17] = editFootage17;
        editImportCount++;
        importSuccess17 = true;
        fileName17 = "UNDLM_00017_AVEC_POIGNEES.mov";
        logImportSuccess(17, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00017_AVEC_POIGNEES.mov", fileName17);
    } catch (e) {
        logImportError(17, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00017_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess17 && editFileBis17.exists) {
    try {
        var editFootage17 = project.importFile(new ImportOptions(editFileBis17));
        editFootage17.parentFolder = fromEditFolder;
        editFootage17.name = "UNDLM_00017bis";
        editSources[17] = editFootage17;
        editImportCount++;
        importSuccess17 = true;
        fileName17 = "UNDLM_00017bis.mov";
        logImportSuccess(17, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00017bis.mov", fileName17);
    } catch (e) {
        logImportError(17, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00017bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess17) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00017.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00018
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile18 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00018.mov");
var editFilePoignees18 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00018_AVEC_POIGNEES.mov");
var editFileBis18 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00018bis.mov");

var importSuccess18 = false;
var fileName18 = "";

// Tenter import standard
if (editFile18.exists) {
    try {
        var editFootage18 = project.importFile(new ImportOptions(editFile18));
        editFootage18.parentFolder = fromEditFolder;
        editFootage18.name = "UNDLM_00018";
        editSources[18] = editFootage18;
        editImportCount++;
        importSuccess18 = true;
        fileName18 = "UNDLM_00018.mov";
        logImportSuccess(18, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00018.mov", fileName18);
    } catch (e) {
        logImportError(18, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00018.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess18 && editFilePoignees18.exists) {
    try {
        var editFootage18 = project.importFile(new ImportOptions(editFilePoignees18));
        editFootage18.parentFolder = fromEditFolder;
        editFootage18.name = "UNDLM_00018_AVEC_POIGNEES";
        editSources[18] = editFootage18;
        editImportCount++;
        importSuccess18 = true;
        fileName18 = "UNDLM_00018_AVEC_POIGNEES.mov";
        logImportSuccess(18, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00018_AVEC_POIGNEES.mov", fileName18);
    } catch (e) {
        logImportError(18, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00018_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess18 && editFileBis18.exists) {
    try {
        var editFootage18 = project.importFile(new ImportOptions(editFileBis18));
        editFootage18.parentFolder = fromEditFolder;
        editFootage18.name = "UNDLM_00018bis";
        editSources[18] = editFootage18;
        editImportCount++;
        importSuccess18 = true;
        fileName18 = "UNDLM_00018bis.mov";
        logImportSuccess(18, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00018bis.mov", fileName18);
    } catch (e) {
        logImportError(18, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00018bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess18) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00018.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00019
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile19 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00019.mov");
var editFilePoignees19 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00019_AVEC_POIGNEES.mov");
var editFileBis19 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00019bis.mov");

var importSuccess19 = false;
var fileName19 = "";

// Tenter import standard
if (editFile19.exists) {
    try {
        var editFootage19 = project.importFile(new ImportOptions(editFile19));
        editFootage19.parentFolder = fromEditFolder;
        editFootage19.name = "UNDLM_00019";
        editSources[19] = editFootage19;
        editImportCount++;
        importSuccess19 = true;
        fileName19 = "UNDLM_00019.mov";
        logImportSuccess(19, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00019.mov", fileName19);
    } catch (e) {
        logImportError(19, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00019.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess19 && editFilePoignees19.exists) {
    try {
        var editFootage19 = project.importFile(new ImportOptions(editFilePoignees19));
        editFootage19.parentFolder = fromEditFolder;
        editFootage19.name = "UNDLM_00019_AVEC_POIGNEES";
        editSources[19] = editFootage19;
        editImportCount++;
        importSuccess19 = true;
        fileName19 = "UNDLM_00019_AVEC_POIGNEES.mov";
        logImportSuccess(19, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00019_AVEC_POIGNEES.mov", fileName19);
    } catch (e) {
        logImportError(19, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00019_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess19 && editFileBis19.exists) {
    try {
        var editFootage19 = project.importFile(new ImportOptions(editFileBis19));
        editFootage19.parentFolder = fromEditFolder;
        editFootage19.name = "UNDLM_00019bis";
        editSources[19] = editFootage19;
        editImportCount++;
        importSuccess19 = true;
        fileName19 = "UNDLM_00019bis.mov";
        logImportSuccess(19, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00019bis.mov", fileName19);
    } catch (e) {
        logImportError(19, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00019bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess19) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00019.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00020
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile20 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00020.mov");
var editFilePoignees20 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00020_AVEC_POIGNEES.mov");
var editFileBis20 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00020bis.mov");

var importSuccess20 = false;
var fileName20 = "";

// Tenter import standard
if (editFile20.exists) {
    try {
        var editFootage20 = project.importFile(new ImportOptions(editFile20));
        editFootage20.parentFolder = fromEditFolder;
        editFootage20.name = "UNDLM_00020";
        editSources[20] = editFootage20;
        editImportCount++;
        importSuccess20 = true;
        fileName20 = "UNDLM_00020.mov";
        logImportSuccess(20, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00020.mov", fileName20);
    } catch (e) {
        logImportError(20, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00020.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess20 && editFilePoignees20.exists) {
    try {
        var editFootage20 = project.importFile(new ImportOptions(editFilePoignees20));
        editFootage20.parentFolder = fromEditFolder;
        editFootage20.name = "UNDLM_00020_AVEC_POIGNEES";
        editSources[20] = editFootage20;
        editImportCount++;
        importSuccess20 = true;
        fileName20 = "UNDLM_00020_AVEC_POIGNEES.mov";
        logImportSuccess(20, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00020_AVEC_POIGNEES.mov", fileName20);
    } catch (e) {
        logImportError(20, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00020_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess20 && editFileBis20.exists) {
    try {
        var editFootage20 = project.importFile(new ImportOptions(editFileBis20));
        editFootage20.parentFolder = fromEditFolder;
        editFootage20.name = "UNDLM_00020bis";
        editSources[20] = editFootage20;
        editImportCount++;
        importSuccess20 = true;
        fileName20 = "UNDLM_00020bis.mov";
        logImportSuccess(20, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00020bis.mov", fileName20);
    } catch (e) {
        logImportError(20, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00020bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess20) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00020.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00021
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile21 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00021.mov");
var editFilePoignees21 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00021_AVEC_POIGNEES.mov");
var editFileBis21 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00021bis.mov");

var importSuccess21 = false;
var fileName21 = "";

// Tenter import standard
if (editFile21.exists) {
    try {
        var editFootage21 = project.importFile(new ImportOptions(editFile21));
        editFootage21.parentFolder = fromEditFolder;
        editFootage21.name = "UNDLM_00021";
        editSources[21] = editFootage21;
        editImportCount++;
        importSuccess21 = true;
        fileName21 = "UNDLM_00021.mov";
        logImportSuccess(21, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00021.mov", fileName21);
    } catch (e) {
        logImportError(21, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00021.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess21 && editFilePoignees21.exists) {
    try {
        var editFootage21 = project.importFile(new ImportOptions(editFilePoignees21));
        editFootage21.parentFolder = fromEditFolder;
        editFootage21.name = "UNDLM_00021_AVEC_POIGNEES";
        editSources[21] = editFootage21;
        editImportCount++;
        importSuccess21 = true;
        fileName21 = "UNDLM_00021_AVEC_POIGNEES.mov";
        logImportSuccess(21, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00021_AVEC_POIGNEES.mov", fileName21);
    } catch (e) {
        logImportError(21, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00021_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess21 && editFileBis21.exists) {
    try {
        var editFootage21 = project.importFile(new ImportOptions(editFileBis21));
        editFootage21.parentFolder = fromEditFolder;
        editFootage21.name = "UNDLM_00021bis";
        editSources[21] = editFootage21;
        editImportCount++;
        importSuccess21 = true;
        fileName21 = "UNDLM_00021bis.mov";
        logImportSuccess(21, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00021bis.mov", fileName21);
    } catch (e) {
        logImportError(21, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00021bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess21) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00021.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00022
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile22 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00022.mov");
var editFilePoignees22 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00022_AVEC_POIGNEES.mov");
var editFileBis22 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00022bis.mov");

var importSuccess22 = false;
var fileName22 = "";

// Tenter import standard
if (editFile22.exists) {
    try {
        var editFootage22 = project.importFile(new ImportOptions(editFile22));
        editFootage22.parentFolder = fromEditFolder;
        editFootage22.name = "UNDLM_00022";
        editSources[22] = editFootage22;
        editImportCount++;
        importSuccess22 = true;
        fileName22 = "UNDLM_00022.mov";
        logImportSuccess(22, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00022.mov", fileName22);
    } catch (e) {
        logImportError(22, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00022.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess22 && editFilePoignees22.exists) {
    try {
        var editFootage22 = project.importFile(new ImportOptions(editFilePoignees22));
        editFootage22.parentFolder = fromEditFolder;
        editFootage22.name = "UNDLM_00022_AVEC_POIGNEES";
        editSources[22] = editFootage22;
        editImportCount++;
        importSuccess22 = true;
        fileName22 = "UNDLM_00022_AVEC_POIGNEES.mov";
        logImportSuccess(22, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00022_AVEC_POIGNEES.mov", fileName22);
    } catch (e) {
        logImportError(22, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00022_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess22 && editFileBis22.exists) {
    try {
        var editFootage22 = project.importFile(new ImportOptions(editFileBis22));
        editFootage22.parentFolder = fromEditFolder;
        editFootage22.name = "UNDLM_00022bis";
        editSources[22] = editFootage22;
        editImportCount++;
        importSuccess22 = true;
        fileName22 = "UNDLM_00022bis.mov";
        logImportSuccess(22, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00022bis.mov", fileName22);
    } catch (e) {
        logImportError(22, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00022bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess22) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00022.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00023
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile23 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00023.mov");
var editFilePoignees23 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00023_AVEC_POIGNEES.mov");
var editFileBis23 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00023bis.mov");

var importSuccess23 = false;
var fileName23 = "";

// Tenter import standard
if (editFile23.exists) {
    try {
        var editFootage23 = project.importFile(new ImportOptions(editFile23));
        editFootage23.parentFolder = fromEditFolder;
        editFootage23.name = "UNDLM_00023";
        editSources[23] = editFootage23;
        editImportCount++;
        importSuccess23 = true;
        fileName23 = "UNDLM_00023.mov";
        logImportSuccess(23, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00023.mov", fileName23);
    } catch (e) {
        logImportError(23, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00023.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess23 && editFilePoignees23.exists) {
    try {
        var editFootage23 = project.importFile(new ImportOptions(editFilePoignees23));
        editFootage23.parentFolder = fromEditFolder;
        editFootage23.name = "UNDLM_00023_AVEC_POIGNEES";
        editSources[23] = editFootage23;
        editImportCount++;
        importSuccess23 = true;
        fileName23 = "UNDLM_00023_AVEC_POIGNEES.mov";
        logImportSuccess(23, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00023_AVEC_POIGNEES.mov", fileName23);
    } catch (e) {
        logImportError(23, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00023_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess23 && editFileBis23.exists) {
    try {
        var editFootage23 = project.importFile(new ImportOptions(editFileBis23));
        editFootage23.parentFolder = fromEditFolder;
        editFootage23.name = "UNDLM_00023bis";
        editSources[23] = editFootage23;
        editImportCount++;
        importSuccess23 = true;
        fileName23 = "UNDLM_00023bis.mov";
        logImportSuccess(23, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00023bis.mov", fileName23);
    } catch (e) {
        logImportError(23, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00023bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess23) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00023.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00024
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile24 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00024.mov");
var editFilePoignees24 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00024_AVEC_POIGNEES.mov");
var editFileBis24 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00024bis.mov");

var importSuccess24 = false;
var fileName24 = "";

// Tenter import standard
if (editFile24.exists) {
    try {
        var editFootage24 = project.importFile(new ImportOptions(editFile24));
        editFootage24.parentFolder = fromEditFolder;
        editFootage24.name = "UNDLM_00024";
        editSources[24] = editFootage24;
        editImportCount++;
        importSuccess24 = true;
        fileName24 = "UNDLM_00024.mov";
        logImportSuccess(24, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00024.mov", fileName24);
    } catch (e) {
        logImportError(24, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00024.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess24 && editFilePoignees24.exists) {
    try {
        var editFootage24 = project.importFile(new ImportOptions(editFilePoignees24));
        editFootage24.parentFolder = fromEditFolder;
        editFootage24.name = "UNDLM_00024_AVEC_POIGNEES";
        editSources[24] = editFootage24;
        editImportCount++;
        importSuccess24 = true;
        fileName24 = "UNDLM_00024_AVEC_POIGNEES.mov";
        logImportSuccess(24, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00024_AVEC_POIGNEES.mov", fileName24);
    } catch (e) {
        logImportError(24, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00024_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess24 && editFileBis24.exists) {
    try {
        var editFootage24 = project.importFile(new ImportOptions(editFileBis24));
        editFootage24.parentFolder = fromEditFolder;
        editFootage24.name = "UNDLM_00024bis";
        editSources[24] = editFootage24;
        editImportCount++;
        importSuccess24 = true;
        fileName24 = "UNDLM_00024bis.mov";
        logImportSuccess(24, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00024bis.mov", fileName24);
    } catch (e) {
        logImportError(24, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00024bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess24) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00024.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00025
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile25 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00025.mov");
var editFilePoignees25 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00025_AVEC_POIGNEES.mov");
var editFileBis25 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00025bis.mov");

var importSuccess25 = false;
var fileName25 = "";

// Tenter import standard
if (editFile25.exists) {
    try {
        var editFootage25 = project.importFile(new ImportOptions(editFile25));
        editFootage25.parentFolder = fromEditFolder;
        editFootage25.name = "UNDLM_00025";
        editSources[25] = editFootage25;
        editImportCount++;
        importSuccess25 = true;
        fileName25 = "UNDLM_00025.mov";
        logImportSuccess(25, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00025.mov", fileName25);
    } catch (e) {
        logImportError(25, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00025.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess25 && editFilePoignees25.exists) {
    try {
        var editFootage25 = project.importFile(new ImportOptions(editFilePoignees25));
        editFootage25.parentFolder = fromEditFolder;
        editFootage25.name = "UNDLM_00025_AVEC_POIGNEES";
        editSources[25] = editFootage25;
        editImportCount++;
        importSuccess25 = true;
        fileName25 = "UNDLM_00025_AVEC_POIGNEES.mov";
        logImportSuccess(25, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00025_AVEC_POIGNEES.mov", fileName25);
    } catch (e) {
        logImportError(25, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00025_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess25 && editFileBis25.exists) {
    try {
        var editFootage25 = project.importFile(new ImportOptions(editFileBis25));
        editFootage25.parentFolder = fromEditFolder;
        editFootage25.name = "UNDLM_00025bis";
        editSources[25] = editFootage25;
        editImportCount++;
        importSuccess25 = true;
        fileName25 = "UNDLM_00025bis.mov";
        logImportSuccess(25, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00025bis.mov", fileName25);
    } catch (e) {
        logImportError(25, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00025bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess25) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00025.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00026
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile26 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00026.mov");
var editFilePoignees26 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00026_AVEC_POIGNEES.mov");
var editFileBis26 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00026bis.mov");

var importSuccess26 = false;
var fileName26 = "";

// Tenter import standard
if (editFile26.exists) {
    try {
        var editFootage26 = project.importFile(new ImportOptions(editFile26));
        editFootage26.parentFolder = fromEditFolder;
        editFootage26.name = "UNDLM_00026";
        editSources[26] = editFootage26;
        editImportCount++;
        importSuccess26 = true;
        fileName26 = "UNDLM_00026.mov";
        logImportSuccess(26, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00026.mov", fileName26);
    } catch (e) {
        logImportError(26, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00026.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess26 && editFilePoignees26.exists) {
    try {
        var editFootage26 = project.importFile(new ImportOptions(editFilePoignees26));
        editFootage26.parentFolder = fromEditFolder;
        editFootage26.name = "UNDLM_00026_AVEC_POIGNEES";
        editSources[26] = editFootage26;
        editImportCount++;
        importSuccess26 = true;
        fileName26 = "UNDLM_00026_AVEC_POIGNEES.mov";
        logImportSuccess(26, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00026_AVEC_POIGNEES.mov", fileName26);
    } catch (e) {
        logImportError(26, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00026_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess26 && editFileBis26.exists) {
    try {
        var editFootage26 = project.importFile(new ImportOptions(editFileBis26));
        editFootage26.parentFolder = fromEditFolder;
        editFootage26.name = "UNDLM_00026bis";
        editSources[26] = editFootage26;
        editImportCount++;
        importSuccess26 = true;
        fileName26 = "UNDLM_00026bis.mov";
        logImportSuccess(26, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00026bis.mov", fileName26);
    } catch (e) {
        logImportError(26, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00026bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess26) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00026.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00027
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile27 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00027.mov");
var editFilePoignees27 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00027_AVEC_POIGNEES.mov");
var editFileBis27 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00027bis.mov");

var importSuccess27 = false;
var fileName27 = "";

// Tenter import standard
if (editFile27.exists) {
    try {
        var editFootage27 = project.importFile(new ImportOptions(editFile27));
        editFootage27.parentFolder = fromEditFolder;
        editFootage27.name = "UNDLM_00027";
        editSources[27] = editFootage27;
        editImportCount++;
        importSuccess27 = true;
        fileName27 = "UNDLM_00027.mov";
        logImportSuccess(27, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00027.mov", fileName27);
    } catch (e) {
        logImportError(27, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00027.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess27 && editFilePoignees27.exists) {
    try {
        var editFootage27 = project.importFile(new ImportOptions(editFilePoignees27));
        editFootage27.parentFolder = fromEditFolder;
        editFootage27.name = "UNDLM_00027_AVEC_POIGNEES";
        editSources[27] = editFootage27;
        editImportCount++;
        importSuccess27 = true;
        fileName27 = "UNDLM_00027_AVEC_POIGNEES.mov";
        logImportSuccess(27, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00027_AVEC_POIGNEES.mov", fileName27);
    } catch (e) {
        logImportError(27, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00027_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess27 && editFileBis27.exists) {
    try {
        var editFootage27 = project.importFile(new ImportOptions(editFileBis27));
        editFootage27.parentFolder = fromEditFolder;
        editFootage27.name = "UNDLM_00027bis";
        editSources[27] = editFootage27;
        editImportCount++;
        importSuccess27 = true;
        fileName27 = "UNDLM_00027bis.mov";
        logImportSuccess(27, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00027bis.mov", fileName27);
    } catch (e) {
        logImportError(27, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00027bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess27) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00027.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00028
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile28 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00028.mov");
var editFilePoignees28 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00028_AVEC_POIGNEES.mov");
var editFileBis28 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00028bis.mov");

var importSuccess28 = false;
var fileName28 = "";

// Tenter import standard
if (editFile28.exists) {
    try {
        var editFootage28 = project.importFile(new ImportOptions(editFile28));
        editFootage28.parentFolder = fromEditFolder;
        editFootage28.name = "UNDLM_00028";
        editSources[28] = editFootage28;
        editImportCount++;
        importSuccess28 = true;
        fileName28 = "UNDLM_00028.mov";
        logImportSuccess(28, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00028.mov", fileName28);
    } catch (e) {
        logImportError(28, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00028.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess28 && editFilePoignees28.exists) {
    try {
        var editFootage28 = project.importFile(new ImportOptions(editFilePoignees28));
        editFootage28.parentFolder = fromEditFolder;
        editFootage28.name = "UNDLM_00028_AVEC_POIGNEES";
        editSources[28] = editFootage28;
        editImportCount++;
        importSuccess28 = true;
        fileName28 = "UNDLM_00028_AVEC_POIGNEES.mov";
        logImportSuccess(28, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00028_AVEC_POIGNEES.mov", fileName28);
    } catch (e) {
        logImportError(28, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00028_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess28 && editFileBis28.exists) {
    try {
        var editFootage28 = project.importFile(new ImportOptions(editFileBis28));
        editFootage28.parentFolder = fromEditFolder;
        editFootage28.name = "UNDLM_00028bis";
        editSources[28] = editFootage28;
        editImportCount++;
        importSuccess28 = true;
        fileName28 = "UNDLM_00028bis.mov";
        logImportSuccess(28, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00028bis.mov", fileName28);
    } catch (e) {
        logImportError(28, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00028bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess28) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00028.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00029
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile29 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00029.mov");
var editFilePoignees29 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00029_AVEC_POIGNEES.mov");
var editFileBis29 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00029bis.mov");

var importSuccess29 = false;
var fileName29 = "";

// Tenter import standard
if (editFile29.exists) {
    try {
        var editFootage29 = project.importFile(new ImportOptions(editFile29));
        editFootage29.parentFolder = fromEditFolder;
        editFootage29.name = "UNDLM_00029";
        editSources[29] = editFootage29;
        editImportCount++;
        importSuccess29 = true;
        fileName29 = "UNDLM_00029.mov";
        logImportSuccess(29, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00029.mov", fileName29);
    } catch (e) {
        logImportError(29, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00029.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess29 && editFilePoignees29.exists) {
    try {
        var editFootage29 = project.importFile(new ImportOptions(editFilePoignees29));
        editFootage29.parentFolder = fromEditFolder;
        editFootage29.name = "UNDLM_00029_AVEC_POIGNEES";
        editSources[29] = editFootage29;
        editImportCount++;
        importSuccess29 = true;
        fileName29 = "UNDLM_00029_AVEC_POIGNEES.mov";
        logImportSuccess(29, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00029_AVEC_POIGNEES.mov", fileName29);
    } catch (e) {
        logImportError(29, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00029_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess29 && editFileBis29.exists) {
    try {
        var editFootage29 = project.importFile(new ImportOptions(editFileBis29));
        editFootage29.parentFolder = fromEditFolder;
        editFootage29.name = "UNDLM_00029bis";
        editSources[29] = editFootage29;
        editImportCount++;
        importSuccess29 = true;
        fileName29 = "UNDLM_00029bis.mov";
        logImportSuccess(29, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00029bis.mov", fileName29);
    } catch (e) {
        logImportError(29, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00029bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess29) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00029.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00030
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile30 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00030.mov");
var editFilePoignees30 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00030_AVEC_POIGNEES.mov");
var editFileBis30 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00030bis.mov");

var importSuccess30 = false;
var fileName30 = "";

// Tenter import standard
if (editFile30.exists) {
    try {
        var editFootage30 = project.importFile(new ImportOptions(editFile30));
        editFootage30.parentFolder = fromEditFolder;
        editFootage30.name = "UNDLM_00030";
        editSources[30] = editFootage30;
        editImportCount++;
        importSuccess30 = true;
        fileName30 = "UNDLM_00030.mov";
        logImportSuccess(30, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00030.mov", fileName30);
    } catch (e) {
        logImportError(30, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00030.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess30 && editFilePoignees30.exists) {
    try {
        var editFootage30 = project.importFile(new ImportOptions(editFilePoignees30));
        editFootage30.parentFolder = fromEditFolder;
        editFootage30.name = "UNDLM_00030_AVEC_POIGNEES";
        editSources[30] = editFootage30;
        editImportCount++;
        importSuccess30 = true;
        fileName30 = "UNDLM_00030_AVEC_POIGNEES.mov";
        logImportSuccess(30, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00030_AVEC_POIGNEES.mov", fileName30);
    } catch (e) {
        logImportError(30, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00030_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess30 && editFileBis30.exists) {
    try {
        var editFootage30 = project.importFile(new ImportOptions(editFileBis30));
        editFootage30.parentFolder = fromEditFolder;
        editFootage30.name = "UNDLM_00030bis";
        editSources[30] = editFootage30;
        editImportCount++;
        importSuccess30 = true;
        fileName30 = "UNDLM_00030bis.mov";
        logImportSuccess(30, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00030bis.mov", fileName30);
    } catch (e) {
        logImportError(30, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00030bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess30) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00030.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00031
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile31 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00031.mov");
var editFilePoignees31 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00031_AVEC_POIGNEES.mov");
var editFileBis31 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00031bis.mov");

var importSuccess31 = false;
var fileName31 = "";

// Tenter import standard
if (editFile31.exists) {
    try {
        var editFootage31 = project.importFile(new ImportOptions(editFile31));
        editFootage31.parentFolder = fromEditFolder;
        editFootage31.name = "UNDLM_00031";
        editSources[31] = editFootage31;
        editImportCount++;
        importSuccess31 = true;
        fileName31 = "UNDLM_00031.mov";
        logImportSuccess(31, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00031.mov", fileName31);
    } catch (e) {
        logImportError(31, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00031.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess31 && editFilePoignees31.exists) {
    try {
        var editFootage31 = project.importFile(new ImportOptions(editFilePoignees31));
        editFootage31.parentFolder = fromEditFolder;
        editFootage31.name = "UNDLM_00031_AVEC_POIGNEES";
        editSources[31] = editFootage31;
        editImportCount++;
        importSuccess31 = true;
        fileName31 = "UNDLM_00031_AVEC_POIGNEES.mov";
        logImportSuccess(31, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00031_AVEC_POIGNEES.mov", fileName31);
    } catch (e) {
        logImportError(31, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00031_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess31 && editFileBis31.exists) {
    try {
        var editFootage31 = project.importFile(new ImportOptions(editFileBis31));
        editFootage31.parentFolder = fromEditFolder;
        editFootage31.name = "UNDLM_00031bis";
        editSources[31] = editFootage31;
        editImportCount++;
        importSuccess31 = true;
        fileName31 = "UNDLM_00031bis.mov";
        logImportSuccess(31, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00031bis.mov", fileName31);
    } catch (e) {
        logImportError(31, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00031bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess31) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00031.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00032
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile32 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00032.mov");
var editFilePoignees32 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00032_AVEC_POIGNEES.mov");
var editFileBis32 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00032bis.mov");

var importSuccess32 = false;
var fileName32 = "";

// Tenter import standard
if (editFile32.exists) {
    try {
        var editFootage32 = project.importFile(new ImportOptions(editFile32));
        editFootage32.parentFolder = fromEditFolder;
        editFootage32.name = "UNDLM_00032";
        editSources[32] = editFootage32;
        editImportCount++;
        importSuccess32 = true;
        fileName32 = "UNDLM_00032.mov";
        logImportSuccess(32, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00032.mov", fileName32);
    } catch (e) {
        logImportError(32, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00032.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess32 && editFilePoignees32.exists) {
    try {
        var editFootage32 = project.importFile(new ImportOptions(editFilePoignees32));
        editFootage32.parentFolder = fromEditFolder;
        editFootage32.name = "UNDLM_00032_AVEC_POIGNEES";
        editSources[32] = editFootage32;
        editImportCount++;
        importSuccess32 = true;
        fileName32 = "UNDLM_00032_AVEC_POIGNEES.mov";
        logImportSuccess(32, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00032_AVEC_POIGNEES.mov", fileName32);
    } catch (e) {
        logImportError(32, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00032_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess32 && editFileBis32.exists) {
    try {
        var editFootage32 = project.importFile(new ImportOptions(editFileBis32));
        editFootage32.parentFolder = fromEditFolder;
        editFootage32.name = "UNDLM_00032bis";
        editSources[32] = editFootage32;
        editImportCount++;
        importSuccess32 = true;
        fileName32 = "UNDLM_00032bis.mov";
        logImportSuccess(32, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00032bis.mov", fileName32);
    } catch (e) {
        logImportError(32, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00032bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess32) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00032.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00033
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile33 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00033.mov");
var editFilePoignees33 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00033_AVEC_POIGNEES.mov");
var editFileBis33 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00033bis.mov");

var importSuccess33 = false;
var fileName33 = "";

// Tenter import standard
if (editFile33.exists) {
    try {
        var editFootage33 = project.importFile(new ImportOptions(editFile33));
        editFootage33.parentFolder = fromEditFolder;
        editFootage33.name = "UNDLM_00033";
        editSources[33] = editFootage33;
        editImportCount++;
        importSuccess33 = true;
        fileName33 = "UNDLM_00033.mov";
        logImportSuccess(33, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00033.mov", fileName33);
    } catch (e) {
        logImportError(33, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00033.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess33 && editFilePoignees33.exists) {
    try {
        var editFootage33 = project.importFile(new ImportOptions(editFilePoignees33));
        editFootage33.parentFolder = fromEditFolder;
        editFootage33.name = "UNDLM_00033_AVEC_POIGNEES";
        editSources[33] = editFootage33;
        editImportCount++;
        importSuccess33 = true;
        fileName33 = "UNDLM_00033_AVEC_POIGNEES.mov";
        logImportSuccess(33, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00033_AVEC_POIGNEES.mov", fileName33);
    } catch (e) {
        logImportError(33, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00033_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess33 && editFileBis33.exists) {
    try {
        var editFootage33 = project.importFile(new ImportOptions(editFileBis33));
        editFootage33.parentFolder = fromEditFolder;
        editFootage33.name = "UNDLM_00033bis";
        editSources[33] = editFootage33;
        editImportCount++;
        importSuccess33 = true;
        fileName33 = "UNDLM_00033bis.mov";
        logImportSuccess(33, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00033bis.mov", fileName33);
    } catch (e) {
        logImportError(33, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00033bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess33) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00033.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00034
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile34 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00034.mov");
var editFilePoignees34 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00034_AVEC_POIGNEES.mov");
var editFileBis34 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00034bis.mov");

var importSuccess34 = false;
var fileName34 = "";

// Tenter import standard
if (editFile34.exists) {
    try {
        var editFootage34 = project.importFile(new ImportOptions(editFile34));
        editFootage34.parentFolder = fromEditFolder;
        editFootage34.name = "UNDLM_00034";
        editSources[34] = editFootage34;
        editImportCount++;
        importSuccess34 = true;
        fileName34 = "UNDLM_00034.mov";
        logImportSuccess(34, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00034.mov", fileName34);
    } catch (e) {
        logImportError(34, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00034.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess34 && editFilePoignees34.exists) {
    try {
        var editFootage34 = project.importFile(new ImportOptions(editFilePoignees34));
        editFootage34.parentFolder = fromEditFolder;
        editFootage34.name = "UNDLM_00034_AVEC_POIGNEES";
        editSources[34] = editFootage34;
        editImportCount++;
        importSuccess34 = true;
        fileName34 = "UNDLM_00034_AVEC_POIGNEES.mov";
        logImportSuccess(34, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00034_AVEC_POIGNEES.mov", fileName34);
    } catch (e) {
        logImportError(34, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00034_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess34 && editFileBis34.exists) {
    try {
        var editFootage34 = project.importFile(new ImportOptions(editFileBis34));
        editFootage34.parentFolder = fromEditFolder;
        editFootage34.name = "UNDLM_00034bis";
        editSources[34] = editFootage34;
        editImportCount++;
        importSuccess34 = true;
        fileName34 = "UNDLM_00034bis.mov";
        logImportSuccess(34, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00034bis.mov", fileName34);
    } catch (e) {
        logImportError(34, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00034bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess34) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00034.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00001
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile1 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00001.mov");
var gradedFilePoignees1 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00001_AVEC_POIGNEES.mov");
var gradedFileBis1 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00001bis.mov");

var gradedImportSuccess1 = false;
var gradedFileName1 = "";

// Tenter import standard
if (gradedFile1.exists) {
    try {
        var gradedFootage1 = project.importFile(new ImportOptions(gradedFile1));
        gradedFootage1.parentFolder = fromGradingFolder;
        gradedFootage1.name = "UNDLM_00001";
        gradingSources[1] = gradedFootage1;
        gradingImportCount++;
        gradedImportSuccess1 = true;
        gradedFileName1 = "UNDLM_00001.mov";
        logImportSuccess(1, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00001.mov", gradedFileName1);
    } catch (e) {
        logImportError(1, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00001.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess1 && gradedFilePoignees1.exists) {
    try {
        var gradedFootage1 = project.importFile(new ImportOptions(gradedFilePoignees1));
        gradedFootage1.parentFolder = fromGradingFolder;
        gradedFootage1.name = "UNDLM_00001_AVEC_POIGNEES";
        gradingSources[1] = gradedFootage1;
        gradingImportCount++;
        gradedImportSuccess1 = true;
        gradedFileName1 = "UNDLM_00001_AVEC_POIGNEES.mov";
        logImportSuccess(1, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00001_AVEC_POIGNEES.mov", gradedFileName1);
    } catch (e) {
        logImportError(1, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00001_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess1 && gradedFileBis1.exists) {
    try {
        var gradedFootage1 = project.importFile(new ImportOptions(gradedFileBis1));
        gradedFootage1.parentFolder = fromGradingFolder;
        gradedFootage1.name = "UNDLM_00001bis";
        gradingSources[1] = gradedFootage1;
        gradingImportCount++;
        gradedImportSuccess1 = true;
        gradedFileName1 = "UNDLM_00001bis.mov";
        logImportSuccess(1, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00001bis.mov", gradedFileName1);
    } catch (e) {
        logImportError(1, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00001bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess1) {
    missingGradingCount++;
}

// Import plan GRADED 00002
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile2 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00002.mov");
var gradedFilePoignees2 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00002_AVEC_POIGNEES.mov");
var gradedFileBis2 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00002bis.mov");

var gradedImportSuccess2 = false;
var gradedFileName2 = "";

// Tenter import standard
if (gradedFile2.exists) {
    try {
        var gradedFootage2 = project.importFile(new ImportOptions(gradedFile2));
        gradedFootage2.parentFolder = fromGradingFolder;
        gradedFootage2.name = "UNDLM_00002";
        gradingSources[2] = gradedFootage2;
        gradingImportCount++;
        gradedImportSuccess2 = true;
        gradedFileName2 = "UNDLM_00002.mov";
        logImportSuccess(2, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00002.mov", gradedFileName2);
    } catch (e) {
        logImportError(2, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00002.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess2 && gradedFilePoignees2.exists) {
    try {
        var gradedFootage2 = project.importFile(new ImportOptions(gradedFilePoignees2));
        gradedFootage2.parentFolder = fromGradingFolder;
        gradedFootage2.name = "UNDLM_00002_AVEC_POIGNEES";
        gradingSources[2] = gradedFootage2;
        gradingImportCount++;
        gradedImportSuccess2 = true;
        gradedFileName2 = "UNDLM_00002_AVEC_POIGNEES.mov";
        logImportSuccess(2, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00002_AVEC_POIGNEES.mov", gradedFileName2);
    } catch (e) {
        logImportError(2, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00002_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess2 && gradedFileBis2.exists) {
    try {
        var gradedFootage2 = project.importFile(new ImportOptions(gradedFileBis2));
        gradedFootage2.parentFolder = fromGradingFolder;
        gradedFootage2.name = "UNDLM_00002bis";
        gradingSources[2] = gradedFootage2;
        gradingImportCount++;
        gradedImportSuccess2 = true;
        gradedFileName2 = "UNDLM_00002bis.mov";
        logImportSuccess(2, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00002bis.mov", gradedFileName2);
    } catch (e) {
        logImportError(2, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00002bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess2) {
    missingGradingCount++;
}

// Import plan GRADED 00003
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile3 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00003.mov");
var gradedFilePoignees3 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00003_AVEC_POIGNEES.mov");
var gradedFileBis3 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00003bis.mov");

var gradedImportSuccess3 = false;
var gradedFileName3 = "";

// Tenter import standard
if (gradedFile3.exists) {
    try {
        var gradedFootage3 = project.importFile(new ImportOptions(gradedFile3));
        gradedFootage3.parentFolder = fromGradingFolder;
        gradedFootage3.name = "UNDLM_00003";
        gradingSources[3] = gradedFootage3;
        gradingImportCount++;
        gradedImportSuccess3 = true;
        gradedFileName3 = "UNDLM_00003.mov";
        logImportSuccess(3, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00003.mov", gradedFileName3);
    } catch (e) {
        logImportError(3, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00003.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess3 && gradedFilePoignees3.exists) {
    try {
        var gradedFootage3 = project.importFile(new ImportOptions(gradedFilePoignees3));
        gradedFootage3.parentFolder = fromGradingFolder;
        gradedFootage3.name = "UNDLM_00003_AVEC_POIGNEES";
        gradingSources[3] = gradedFootage3;
        gradingImportCount++;
        gradedImportSuccess3 = true;
        gradedFileName3 = "UNDLM_00003_AVEC_POIGNEES.mov";
        logImportSuccess(3, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00003_AVEC_POIGNEES.mov", gradedFileName3);
    } catch (e) {
        logImportError(3, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00003_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess3 && gradedFileBis3.exists) {
    try {
        var gradedFootage3 = project.importFile(new ImportOptions(gradedFileBis3));
        gradedFootage3.parentFolder = fromGradingFolder;
        gradedFootage3.name = "UNDLM_00003bis";
        gradingSources[3] = gradedFootage3;
        gradingImportCount++;
        gradedImportSuccess3 = true;
        gradedFileName3 = "UNDLM_00003bis.mov";
        logImportSuccess(3, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00003bis.mov", gradedFileName3);
    } catch (e) {
        logImportError(3, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00003bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess3) {
    missingGradingCount++;
}

// Import plan GRADED 00004
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile4 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00004.mov");
var gradedFilePoignees4 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00004_AVEC_POIGNEES.mov");
var gradedFileBis4 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00004bis.mov");

var gradedImportSuccess4 = false;
var gradedFileName4 = "";

// Tenter import standard
if (gradedFile4.exists) {
    try {
        var gradedFootage4 = project.importFile(new ImportOptions(gradedFile4));
        gradedFootage4.parentFolder = fromGradingFolder;
        gradedFootage4.name = "UNDLM_00004";
        gradingSources[4] = gradedFootage4;
        gradingImportCount++;
        gradedImportSuccess4 = true;
        gradedFileName4 = "UNDLM_00004.mov";
        logImportSuccess(4, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00004.mov", gradedFileName4);
    } catch (e) {
        logImportError(4, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00004.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess4 && gradedFilePoignees4.exists) {
    try {
        var gradedFootage4 = project.importFile(new ImportOptions(gradedFilePoignees4));
        gradedFootage4.parentFolder = fromGradingFolder;
        gradedFootage4.name = "UNDLM_00004_AVEC_POIGNEES";
        gradingSources[4] = gradedFootage4;
        gradingImportCount++;
        gradedImportSuccess4 = true;
        gradedFileName4 = "UNDLM_00004_AVEC_POIGNEES.mov";
        logImportSuccess(4, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00004_AVEC_POIGNEES.mov", gradedFileName4);
    } catch (e) {
        logImportError(4, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00004_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess4 && gradedFileBis4.exists) {
    try {
        var gradedFootage4 = project.importFile(new ImportOptions(gradedFileBis4));
        gradedFootage4.parentFolder = fromGradingFolder;
        gradedFootage4.name = "UNDLM_00004bis";
        gradingSources[4] = gradedFootage4;
        gradingImportCount++;
        gradedImportSuccess4 = true;
        gradedFileName4 = "UNDLM_00004bis.mov";
        logImportSuccess(4, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00004bis.mov", gradedFileName4);
    } catch (e) {
        logImportError(4, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00004bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess4) {
    missingGradingCount++;
}

// Import plan GRADED 00005
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile5 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00005.mov");
var gradedFilePoignees5 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00005_AVEC_POIGNEES.mov");
var gradedFileBis5 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00005bis.mov");

var gradedImportSuccess5 = false;
var gradedFileName5 = "";

// Tenter import standard
if (gradedFile5.exists) {
    try {
        var gradedFootage5 = project.importFile(new ImportOptions(gradedFile5));
        gradedFootage5.parentFolder = fromGradingFolder;
        gradedFootage5.name = "UNDLM_00005";
        gradingSources[5] = gradedFootage5;
        gradingImportCount++;
        gradedImportSuccess5 = true;
        gradedFileName5 = "UNDLM_00005.mov";
        logImportSuccess(5, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00005.mov", gradedFileName5);
    } catch (e) {
        logImportError(5, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00005.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess5 && gradedFilePoignees5.exists) {
    try {
        var gradedFootage5 = project.importFile(new ImportOptions(gradedFilePoignees5));
        gradedFootage5.parentFolder = fromGradingFolder;
        gradedFootage5.name = "UNDLM_00005_AVEC_POIGNEES";
        gradingSources[5] = gradedFootage5;
        gradingImportCount++;
        gradedImportSuccess5 = true;
        gradedFileName5 = "UNDLM_00005_AVEC_POIGNEES.mov";
        logImportSuccess(5, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00005_AVEC_POIGNEES.mov", gradedFileName5);
    } catch (e) {
        logImportError(5, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00005_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess5 && gradedFileBis5.exists) {
    try {
        var gradedFootage5 = project.importFile(new ImportOptions(gradedFileBis5));
        gradedFootage5.parentFolder = fromGradingFolder;
        gradedFootage5.name = "UNDLM_00005bis";
        gradingSources[5] = gradedFootage5;
        gradingImportCount++;
        gradedImportSuccess5 = true;
        gradedFileName5 = "UNDLM_00005bis.mov";
        logImportSuccess(5, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00005bis.mov", gradedFileName5);
    } catch (e) {
        logImportError(5, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00005bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess5) {
    missingGradingCount++;
}

// Import plan GRADED 00006
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile6 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00006.mov");
var gradedFilePoignees6 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00006_AVEC_POIGNEES.mov");
var gradedFileBis6 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00006bis.mov");

var gradedImportSuccess6 = false;
var gradedFileName6 = "";

// Tenter import standard
if (gradedFile6.exists) {
    try {
        var gradedFootage6 = project.importFile(new ImportOptions(gradedFile6));
        gradedFootage6.parentFolder = fromGradingFolder;
        gradedFootage6.name = "UNDLM_00006";
        gradingSources[6] = gradedFootage6;
        gradingImportCount++;
        gradedImportSuccess6 = true;
        gradedFileName6 = "UNDLM_00006.mov";
        logImportSuccess(6, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00006.mov", gradedFileName6);
    } catch (e) {
        logImportError(6, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00006.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess6 && gradedFilePoignees6.exists) {
    try {
        var gradedFootage6 = project.importFile(new ImportOptions(gradedFilePoignees6));
        gradedFootage6.parentFolder = fromGradingFolder;
        gradedFootage6.name = "UNDLM_00006_AVEC_POIGNEES";
        gradingSources[6] = gradedFootage6;
        gradingImportCount++;
        gradedImportSuccess6 = true;
        gradedFileName6 = "UNDLM_00006_AVEC_POIGNEES.mov";
        logImportSuccess(6, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00006_AVEC_POIGNEES.mov", gradedFileName6);
    } catch (e) {
        logImportError(6, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00006_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess6 && gradedFileBis6.exists) {
    try {
        var gradedFootage6 = project.importFile(new ImportOptions(gradedFileBis6));
        gradedFootage6.parentFolder = fromGradingFolder;
        gradedFootage6.name = "UNDLM_00006bis";
        gradingSources[6] = gradedFootage6;
        gradingImportCount++;
        gradedImportSuccess6 = true;
        gradedFileName6 = "UNDLM_00006bis.mov";
        logImportSuccess(6, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00006bis.mov", gradedFileName6);
    } catch (e) {
        logImportError(6, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00006bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess6) {
    missingGradingCount++;
}

// Import plan GRADED 00007
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile7 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00007.mov");
var gradedFilePoignees7 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00007_AVEC_POIGNEES.mov");
var gradedFileBis7 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00007bis.mov");

var gradedImportSuccess7 = false;
var gradedFileName7 = "";

// Tenter import standard
if (gradedFile7.exists) {
    try {
        var gradedFootage7 = project.importFile(new ImportOptions(gradedFile7));
        gradedFootage7.parentFolder = fromGradingFolder;
        gradedFootage7.name = "UNDLM_00007";
        gradingSources[7] = gradedFootage7;
        gradingImportCount++;
        gradedImportSuccess7 = true;
        gradedFileName7 = "UNDLM_00007.mov";
        logImportSuccess(7, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00007.mov", gradedFileName7);
    } catch (e) {
        logImportError(7, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00007.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess7 && gradedFilePoignees7.exists) {
    try {
        var gradedFootage7 = project.importFile(new ImportOptions(gradedFilePoignees7));
        gradedFootage7.parentFolder = fromGradingFolder;
        gradedFootage7.name = "UNDLM_00007_AVEC_POIGNEES";
        gradingSources[7] = gradedFootage7;
        gradingImportCount++;
        gradedImportSuccess7 = true;
        gradedFileName7 = "UNDLM_00007_AVEC_POIGNEES.mov";
        logImportSuccess(7, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00007_AVEC_POIGNEES.mov", gradedFileName7);
    } catch (e) {
        logImportError(7, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00007_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess7 && gradedFileBis7.exists) {
    try {
        var gradedFootage7 = project.importFile(new ImportOptions(gradedFileBis7));
        gradedFootage7.parentFolder = fromGradingFolder;
        gradedFootage7.name = "UNDLM_00007bis";
        gradingSources[7] = gradedFootage7;
        gradingImportCount++;
        gradedImportSuccess7 = true;
        gradedFileName7 = "UNDLM_00007bis.mov";
        logImportSuccess(7, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00007bis.mov", gradedFileName7);
    } catch (e) {
        logImportError(7, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00007bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess7) {
    missingGradingCount++;
}

// Import plan GRADED 00008
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile8 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00008.mov");
var gradedFilePoignees8 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00008_AVEC_POIGNEES.mov");
var gradedFileBis8 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00008bis.mov");

var gradedImportSuccess8 = false;
var gradedFileName8 = "";

// Tenter import standard
if (gradedFile8.exists) {
    try {
        var gradedFootage8 = project.importFile(new ImportOptions(gradedFile8));
        gradedFootage8.parentFolder = fromGradingFolder;
        gradedFootage8.name = "UNDLM_00008";
        gradingSources[8] = gradedFootage8;
        gradingImportCount++;
        gradedImportSuccess8 = true;
        gradedFileName8 = "UNDLM_00008.mov";
        logImportSuccess(8, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00008.mov", gradedFileName8);
    } catch (e) {
        logImportError(8, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00008.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess8 && gradedFilePoignees8.exists) {
    try {
        var gradedFootage8 = project.importFile(new ImportOptions(gradedFilePoignees8));
        gradedFootage8.parentFolder = fromGradingFolder;
        gradedFootage8.name = "UNDLM_00008_AVEC_POIGNEES";
        gradingSources[8] = gradedFootage8;
        gradingImportCount++;
        gradedImportSuccess8 = true;
        gradedFileName8 = "UNDLM_00008_AVEC_POIGNEES.mov";
        logImportSuccess(8, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00008_AVEC_POIGNEES.mov", gradedFileName8);
    } catch (e) {
        logImportError(8, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00008_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess8 && gradedFileBis8.exists) {
    try {
        var gradedFootage8 = project.importFile(new ImportOptions(gradedFileBis8));
        gradedFootage8.parentFolder = fromGradingFolder;
        gradedFootage8.name = "UNDLM_00008bis";
        gradingSources[8] = gradedFootage8;
        gradingImportCount++;
        gradedImportSuccess8 = true;
        gradedFileName8 = "UNDLM_00008bis.mov";
        logImportSuccess(8, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00008bis.mov", gradedFileName8);
    } catch (e) {
        logImportError(8, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00008bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess8) {
    missingGradingCount++;
}

// Import plan GRADED 00009
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile9 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00009.mov");
var gradedFilePoignees9 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00009_AVEC_POIGNEES.mov");
var gradedFileBis9 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00009bis.mov");

var gradedImportSuccess9 = false;
var gradedFileName9 = "";

// Tenter import standard
if (gradedFile9.exists) {
    try {
        var gradedFootage9 = project.importFile(new ImportOptions(gradedFile9));
        gradedFootage9.parentFolder = fromGradingFolder;
        gradedFootage9.name = "UNDLM_00009";
        gradingSources[9] = gradedFootage9;
        gradingImportCount++;
        gradedImportSuccess9 = true;
        gradedFileName9 = "UNDLM_00009.mov";
        logImportSuccess(9, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00009.mov", gradedFileName9);
    } catch (e) {
        logImportError(9, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00009.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess9 && gradedFilePoignees9.exists) {
    try {
        var gradedFootage9 = project.importFile(new ImportOptions(gradedFilePoignees9));
        gradedFootage9.parentFolder = fromGradingFolder;
        gradedFootage9.name = "UNDLM_00009_AVEC_POIGNEES";
        gradingSources[9] = gradedFootage9;
        gradingImportCount++;
        gradedImportSuccess9 = true;
        gradedFileName9 = "UNDLM_00009_AVEC_POIGNEES.mov";
        logImportSuccess(9, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00009_AVEC_POIGNEES.mov", gradedFileName9);
    } catch (e) {
        logImportError(9, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00009_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess9 && gradedFileBis9.exists) {
    try {
        var gradedFootage9 = project.importFile(new ImportOptions(gradedFileBis9));
        gradedFootage9.parentFolder = fromGradingFolder;
        gradedFootage9.name = "UNDLM_00009bis";
        gradingSources[9] = gradedFootage9;
        gradingImportCount++;
        gradedImportSuccess9 = true;
        gradedFileName9 = "UNDLM_00009bis.mov";
        logImportSuccess(9, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00009bis.mov", gradedFileName9);
    } catch (e) {
        logImportError(9, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00009bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess9) {
    missingGradingCount++;
}

// Import plan GRADED 00010
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile10 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00010.mov");
var gradedFilePoignees10 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00010_AVEC_POIGNEES.mov");
var gradedFileBis10 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00010bis.mov");

var gradedImportSuccess10 = false;
var gradedFileName10 = "";

// Tenter import standard
if (gradedFile10.exists) {
    try {
        var gradedFootage10 = project.importFile(new ImportOptions(gradedFile10));
        gradedFootage10.parentFolder = fromGradingFolder;
        gradedFootage10.name = "UNDLM_00010";
        gradingSources[10] = gradedFootage10;
        gradingImportCount++;
        gradedImportSuccess10 = true;
        gradedFileName10 = "UNDLM_00010.mov";
        logImportSuccess(10, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00010.mov", gradedFileName10);
    } catch (e) {
        logImportError(10, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00010.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess10 && gradedFilePoignees10.exists) {
    try {
        var gradedFootage10 = project.importFile(new ImportOptions(gradedFilePoignees10));
        gradedFootage10.parentFolder = fromGradingFolder;
        gradedFootage10.name = "UNDLM_00010_AVEC_POIGNEES";
        gradingSources[10] = gradedFootage10;
        gradingImportCount++;
        gradedImportSuccess10 = true;
        gradedFileName10 = "UNDLM_00010_AVEC_POIGNEES.mov";
        logImportSuccess(10, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00010_AVEC_POIGNEES.mov", gradedFileName10);
    } catch (e) {
        logImportError(10, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00010_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess10 && gradedFileBis10.exists) {
    try {
        var gradedFootage10 = project.importFile(new ImportOptions(gradedFileBis10));
        gradedFootage10.parentFolder = fromGradingFolder;
        gradedFootage10.name = "UNDLM_00010bis";
        gradingSources[10] = gradedFootage10;
        gradingImportCount++;
        gradedImportSuccess10 = true;
        gradedFileName10 = "UNDLM_00010bis.mov";
        logImportSuccess(10, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00010bis.mov", gradedFileName10);
    } catch (e) {
        logImportError(10, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00010bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess10) {
    missingGradingCount++;
}

// Import plan GRADED 00011
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile11 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00011.mov");
var gradedFilePoignees11 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00011_AVEC_POIGNEES.mov");
var gradedFileBis11 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00011bis.mov");

var gradedImportSuccess11 = false;
var gradedFileName11 = "";

// Tenter import standard
if (gradedFile11.exists) {
    try {
        var gradedFootage11 = project.importFile(new ImportOptions(gradedFile11));
        gradedFootage11.parentFolder = fromGradingFolder;
        gradedFootage11.name = "UNDLM_00011";
        gradingSources[11] = gradedFootage11;
        gradingImportCount++;
        gradedImportSuccess11 = true;
        gradedFileName11 = "UNDLM_00011.mov";
        logImportSuccess(11, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00011.mov", gradedFileName11);
    } catch (e) {
        logImportError(11, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00011.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess11 && gradedFilePoignees11.exists) {
    try {
        var gradedFootage11 = project.importFile(new ImportOptions(gradedFilePoignees11));
        gradedFootage11.parentFolder = fromGradingFolder;
        gradedFootage11.name = "UNDLM_00011_AVEC_POIGNEES";
        gradingSources[11] = gradedFootage11;
        gradingImportCount++;
        gradedImportSuccess11 = true;
        gradedFileName11 = "UNDLM_00011_AVEC_POIGNEES.mov";
        logImportSuccess(11, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00011_AVEC_POIGNEES.mov", gradedFileName11);
    } catch (e) {
        logImportError(11, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00011_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess11 && gradedFileBis11.exists) {
    try {
        var gradedFootage11 = project.importFile(new ImportOptions(gradedFileBis11));
        gradedFootage11.parentFolder = fromGradingFolder;
        gradedFootage11.name = "UNDLM_00011bis";
        gradingSources[11] = gradedFootage11;
        gradingImportCount++;
        gradedImportSuccess11 = true;
        gradedFileName11 = "UNDLM_00011bis.mov";
        logImportSuccess(11, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00011bis.mov", gradedFileName11);
    } catch (e) {
        logImportError(11, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00011bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess11) {
    missingGradingCount++;
}

// Import plan GRADED 00012
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile12 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00012.mov");
var gradedFilePoignees12 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00012_AVEC_POIGNEES.mov");
var gradedFileBis12 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00012bis.mov");

var gradedImportSuccess12 = false;
var gradedFileName12 = "";

// Tenter import standard
if (gradedFile12.exists) {
    try {
        var gradedFootage12 = project.importFile(new ImportOptions(gradedFile12));
        gradedFootage12.parentFolder = fromGradingFolder;
        gradedFootage12.name = "UNDLM_00012";
        gradingSources[12] = gradedFootage12;
        gradingImportCount++;
        gradedImportSuccess12 = true;
        gradedFileName12 = "UNDLM_00012.mov";
        logImportSuccess(12, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00012.mov", gradedFileName12);
    } catch (e) {
        logImportError(12, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00012.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess12 && gradedFilePoignees12.exists) {
    try {
        var gradedFootage12 = project.importFile(new ImportOptions(gradedFilePoignees12));
        gradedFootage12.parentFolder = fromGradingFolder;
        gradedFootage12.name = "UNDLM_00012_AVEC_POIGNEES";
        gradingSources[12] = gradedFootage12;
        gradingImportCount++;
        gradedImportSuccess12 = true;
        gradedFileName12 = "UNDLM_00012_AVEC_POIGNEES.mov";
        logImportSuccess(12, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00012_AVEC_POIGNEES.mov", gradedFileName12);
    } catch (e) {
        logImportError(12, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00012_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess12 && gradedFileBis12.exists) {
    try {
        var gradedFootage12 = project.importFile(new ImportOptions(gradedFileBis12));
        gradedFootage12.parentFolder = fromGradingFolder;
        gradedFootage12.name = "UNDLM_00012bis";
        gradingSources[12] = gradedFootage12;
        gradingImportCount++;
        gradedImportSuccess12 = true;
        gradedFileName12 = "UNDLM_00012bis.mov";
        logImportSuccess(12, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00012bis.mov", gradedFileName12);
    } catch (e) {
        logImportError(12, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00012bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess12) {
    missingGradingCount++;
}

// Import plan GRADED 00013
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile13 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00013.mov");
var gradedFilePoignees13 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00013_AVEC_POIGNEES.mov");
var gradedFileBis13 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00013bis.mov");

var gradedImportSuccess13 = false;
var gradedFileName13 = "";

// Tenter import standard
if (gradedFile13.exists) {
    try {
        var gradedFootage13 = project.importFile(new ImportOptions(gradedFile13));
        gradedFootage13.parentFolder = fromGradingFolder;
        gradedFootage13.name = "UNDLM_00013";
        gradingSources[13] = gradedFootage13;
        gradingImportCount++;
        gradedImportSuccess13 = true;
        gradedFileName13 = "UNDLM_00013.mov";
        logImportSuccess(13, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00013.mov", gradedFileName13);
    } catch (e) {
        logImportError(13, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00013.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess13 && gradedFilePoignees13.exists) {
    try {
        var gradedFootage13 = project.importFile(new ImportOptions(gradedFilePoignees13));
        gradedFootage13.parentFolder = fromGradingFolder;
        gradedFootage13.name = "UNDLM_00013_AVEC_POIGNEES";
        gradingSources[13] = gradedFootage13;
        gradingImportCount++;
        gradedImportSuccess13 = true;
        gradedFileName13 = "UNDLM_00013_AVEC_POIGNEES.mov";
        logImportSuccess(13, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00013_AVEC_POIGNEES.mov", gradedFileName13);
    } catch (e) {
        logImportError(13, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00013_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess13 && gradedFileBis13.exists) {
    try {
        var gradedFootage13 = project.importFile(new ImportOptions(gradedFileBis13));
        gradedFootage13.parentFolder = fromGradingFolder;
        gradedFootage13.name = "UNDLM_00013bis";
        gradingSources[13] = gradedFootage13;
        gradingImportCount++;
        gradedImportSuccess13 = true;
        gradedFileName13 = "UNDLM_00013bis.mov";
        logImportSuccess(13, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00013bis.mov", gradedFileName13);
    } catch (e) {
        logImportError(13, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00013bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess13) {
    missingGradingCount++;
}

// Import plan GRADED 00014
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile14 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00014.mov");
var gradedFilePoignees14 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00014_AVEC_POIGNEES.mov");
var gradedFileBis14 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00014bis.mov");

var gradedImportSuccess14 = false;
var gradedFileName14 = "";

// Tenter import standard
if (gradedFile14.exists) {
    try {
        var gradedFootage14 = project.importFile(new ImportOptions(gradedFile14));
        gradedFootage14.parentFolder = fromGradingFolder;
        gradedFootage14.name = "UNDLM_00014";
        gradingSources[14] = gradedFootage14;
        gradingImportCount++;
        gradedImportSuccess14 = true;
        gradedFileName14 = "UNDLM_00014.mov";
        logImportSuccess(14, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00014.mov", gradedFileName14);
    } catch (e) {
        logImportError(14, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00014.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess14 && gradedFilePoignees14.exists) {
    try {
        var gradedFootage14 = project.importFile(new ImportOptions(gradedFilePoignees14));
        gradedFootage14.parentFolder = fromGradingFolder;
        gradedFootage14.name = "UNDLM_00014_AVEC_POIGNEES";
        gradingSources[14] = gradedFootage14;
        gradingImportCount++;
        gradedImportSuccess14 = true;
        gradedFileName14 = "UNDLM_00014_AVEC_POIGNEES.mov";
        logImportSuccess(14, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00014_AVEC_POIGNEES.mov", gradedFileName14);
    } catch (e) {
        logImportError(14, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00014_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess14 && gradedFileBis14.exists) {
    try {
        var gradedFootage14 = project.importFile(new ImportOptions(gradedFileBis14));
        gradedFootage14.parentFolder = fromGradingFolder;
        gradedFootage14.name = "UNDLM_00014bis";
        gradingSources[14] = gradedFootage14;
        gradingImportCount++;
        gradedImportSuccess14 = true;
        gradedFileName14 = "UNDLM_00014bis.mov";
        logImportSuccess(14, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00014bis.mov", gradedFileName14);
    } catch (e) {
        logImportError(14, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00014bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess14) {
    missingGradingCount++;
}

// Import plan GRADED 00015
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile15 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00015.mov");
var gradedFilePoignees15 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00015_AVEC_POIGNEES.mov");
var gradedFileBis15 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00015bis.mov");

var gradedImportSuccess15 = false;
var gradedFileName15 = "";

// Tenter import standard
if (gradedFile15.exists) {
    try {
        var gradedFootage15 = project.importFile(new ImportOptions(gradedFile15));
        gradedFootage15.parentFolder = fromGradingFolder;
        gradedFootage15.name = "UNDLM_00015";
        gradingSources[15] = gradedFootage15;
        gradingImportCount++;
        gradedImportSuccess15 = true;
        gradedFileName15 = "UNDLM_00015.mov";
        logImportSuccess(15, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00015.mov", gradedFileName15);
    } catch (e) {
        logImportError(15, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00015.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess15 && gradedFilePoignees15.exists) {
    try {
        var gradedFootage15 = project.importFile(new ImportOptions(gradedFilePoignees15));
        gradedFootage15.parentFolder = fromGradingFolder;
        gradedFootage15.name = "UNDLM_00015_AVEC_POIGNEES";
        gradingSources[15] = gradedFootage15;
        gradingImportCount++;
        gradedImportSuccess15 = true;
        gradedFileName15 = "UNDLM_00015_AVEC_POIGNEES.mov";
        logImportSuccess(15, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00015_AVEC_POIGNEES.mov", gradedFileName15);
    } catch (e) {
        logImportError(15, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00015_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess15 && gradedFileBis15.exists) {
    try {
        var gradedFootage15 = project.importFile(new ImportOptions(gradedFileBis15));
        gradedFootage15.parentFolder = fromGradingFolder;
        gradedFootage15.name = "UNDLM_00015bis";
        gradingSources[15] = gradedFootage15;
        gradingImportCount++;
        gradedImportSuccess15 = true;
        gradedFileName15 = "UNDLM_00015bis.mov";
        logImportSuccess(15, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00015bis.mov", gradedFileName15);
    } catch (e) {
        logImportError(15, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00015bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess15) {
    missingGradingCount++;
}

// Import plan GRADED 00016
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile16 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00016.mov");
var gradedFilePoignees16 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00016_AVEC_POIGNEES.mov");
var gradedFileBis16 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00016bis.mov");

var gradedImportSuccess16 = false;
var gradedFileName16 = "";

// Tenter import standard
if (gradedFile16.exists) {
    try {
        var gradedFootage16 = project.importFile(new ImportOptions(gradedFile16));
        gradedFootage16.parentFolder = fromGradingFolder;
        gradedFootage16.name = "UNDLM_00016";
        gradingSources[16] = gradedFootage16;
        gradingImportCount++;
        gradedImportSuccess16 = true;
        gradedFileName16 = "UNDLM_00016.mov";
        logImportSuccess(16, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00016.mov", gradedFileName16);
    } catch (e) {
        logImportError(16, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00016.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess16 && gradedFilePoignees16.exists) {
    try {
        var gradedFootage16 = project.importFile(new ImportOptions(gradedFilePoignees16));
        gradedFootage16.parentFolder = fromGradingFolder;
        gradedFootage16.name = "UNDLM_00016_AVEC_POIGNEES";
        gradingSources[16] = gradedFootage16;
        gradingImportCount++;
        gradedImportSuccess16 = true;
        gradedFileName16 = "UNDLM_00016_AVEC_POIGNEES.mov";
        logImportSuccess(16, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00016_AVEC_POIGNEES.mov", gradedFileName16);
    } catch (e) {
        logImportError(16, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00016_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess16 && gradedFileBis16.exists) {
    try {
        var gradedFootage16 = project.importFile(new ImportOptions(gradedFileBis16));
        gradedFootage16.parentFolder = fromGradingFolder;
        gradedFootage16.name = "UNDLM_00016bis";
        gradingSources[16] = gradedFootage16;
        gradingImportCount++;
        gradedImportSuccess16 = true;
        gradedFileName16 = "UNDLM_00016bis.mov";
        logImportSuccess(16, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00016bis.mov", gradedFileName16);
    } catch (e) {
        logImportError(16, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00016bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess16) {
    missingGradingCount++;
}

// Import plan GRADED 00017
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile17 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00017.mov");
var gradedFilePoignees17 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00017_AVEC_POIGNEES.mov");
var gradedFileBis17 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00017bis.mov");

var gradedImportSuccess17 = false;
var gradedFileName17 = "";

// Tenter import standard
if (gradedFile17.exists) {
    try {
        var gradedFootage17 = project.importFile(new ImportOptions(gradedFile17));
        gradedFootage17.parentFolder = fromGradingFolder;
        gradedFootage17.name = "UNDLM_00017";
        gradingSources[17] = gradedFootage17;
        gradingImportCount++;
        gradedImportSuccess17 = true;
        gradedFileName17 = "UNDLM_00017.mov";
        logImportSuccess(17, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00017.mov", gradedFileName17);
    } catch (e) {
        logImportError(17, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00017.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess17 && gradedFilePoignees17.exists) {
    try {
        var gradedFootage17 = project.importFile(new ImportOptions(gradedFilePoignees17));
        gradedFootage17.parentFolder = fromGradingFolder;
        gradedFootage17.name = "UNDLM_00017_AVEC_POIGNEES";
        gradingSources[17] = gradedFootage17;
        gradingImportCount++;
        gradedImportSuccess17 = true;
        gradedFileName17 = "UNDLM_00017_AVEC_POIGNEES.mov";
        logImportSuccess(17, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00017_AVEC_POIGNEES.mov", gradedFileName17);
    } catch (e) {
        logImportError(17, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00017_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess17 && gradedFileBis17.exists) {
    try {
        var gradedFootage17 = project.importFile(new ImportOptions(gradedFileBis17));
        gradedFootage17.parentFolder = fromGradingFolder;
        gradedFootage17.name = "UNDLM_00017bis";
        gradingSources[17] = gradedFootage17;
        gradingImportCount++;
        gradedImportSuccess17 = true;
        gradedFileName17 = "UNDLM_00017bis.mov";
        logImportSuccess(17, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00017bis.mov", gradedFileName17);
    } catch (e) {
        logImportError(17, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00017bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess17) {
    missingGradingCount++;
}

// Import plan GRADED 00018
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile18 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00018.mov");
var gradedFilePoignees18 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00018_AVEC_POIGNEES.mov");
var gradedFileBis18 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00018bis.mov");

var gradedImportSuccess18 = false;
var gradedFileName18 = "";

// Tenter import standard
if (gradedFile18.exists) {
    try {
        var gradedFootage18 = project.importFile(new ImportOptions(gradedFile18));
        gradedFootage18.parentFolder = fromGradingFolder;
        gradedFootage18.name = "UNDLM_00018";
        gradingSources[18] = gradedFootage18;
        gradingImportCount++;
        gradedImportSuccess18 = true;
        gradedFileName18 = "UNDLM_00018.mov";
        logImportSuccess(18, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00018.mov", gradedFileName18);
    } catch (e) {
        logImportError(18, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00018.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess18 && gradedFilePoignees18.exists) {
    try {
        var gradedFootage18 = project.importFile(new ImportOptions(gradedFilePoignees18));
        gradedFootage18.parentFolder = fromGradingFolder;
        gradedFootage18.name = "UNDLM_00018_AVEC_POIGNEES";
        gradingSources[18] = gradedFootage18;
        gradingImportCount++;
        gradedImportSuccess18 = true;
        gradedFileName18 = "UNDLM_00018_AVEC_POIGNEES.mov";
        logImportSuccess(18, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00018_AVEC_POIGNEES.mov", gradedFileName18);
    } catch (e) {
        logImportError(18, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00018_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess18 && gradedFileBis18.exists) {
    try {
        var gradedFootage18 = project.importFile(new ImportOptions(gradedFileBis18));
        gradedFootage18.parentFolder = fromGradingFolder;
        gradedFootage18.name = "UNDLM_00018bis";
        gradingSources[18] = gradedFootage18;
        gradingImportCount++;
        gradedImportSuccess18 = true;
        gradedFileName18 = "UNDLM_00018bis.mov";
        logImportSuccess(18, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00018bis.mov", gradedFileName18);
    } catch (e) {
        logImportError(18, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00018bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess18) {
    missingGradingCount++;
}

// Import plan GRADED 00019
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile19 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00019.mov");
var gradedFilePoignees19 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00019_AVEC_POIGNEES.mov");
var gradedFileBis19 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00019bis.mov");

var gradedImportSuccess19 = false;
var gradedFileName19 = "";

// Tenter import standard
if (gradedFile19.exists) {
    try {
        var gradedFootage19 = project.importFile(new ImportOptions(gradedFile19));
        gradedFootage19.parentFolder = fromGradingFolder;
        gradedFootage19.name = "UNDLM_00019";
        gradingSources[19] = gradedFootage19;
        gradingImportCount++;
        gradedImportSuccess19 = true;
        gradedFileName19 = "UNDLM_00019.mov";
        logImportSuccess(19, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00019.mov", gradedFileName19);
    } catch (e) {
        logImportError(19, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00019.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess19 && gradedFilePoignees19.exists) {
    try {
        var gradedFootage19 = project.importFile(new ImportOptions(gradedFilePoignees19));
        gradedFootage19.parentFolder = fromGradingFolder;
        gradedFootage19.name = "UNDLM_00019_AVEC_POIGNEES";
        gradingSources[19] = gradedFootage19;
        gradingImportCount++;
        gradedImportSuccess19 = true;
        gradedFileName19 = "UNDLM_00019_AVEC_POIGNEES.mov";
        logImportSuccess(19, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00019_AVEC_POIGNEES.mov", gradedFileName19);
    } catch (e) {
        logImportError(19, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00019_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess19 && gradedFileBis19.exists) {
    try {
        var gradedFootage19 = project.importFile(new ImportOptions(gradedFileBis19));
        gradedFootage19.parentFolder = fromGradingFolder;
        gradedFootage19.name = "UNDLM_00019bis";
        gradingSources[19] = gradedFootage19;
        gradingImportCount++;
        gradedImportSuccess19 = true;
        gradedFileName19 = "UNDLM_00019bis.mov";
        logImportSuccess(19, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00019bis.mov", gradedFileName19);
    } catch (e) {
        logImportError(19, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00019bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess19) {
    missingGradingCount++;
}

// Import plan GRADED 00020
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile20 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00020.mov");
var gradedFilePoignees20 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00020_AVEC_POIGNEES.mov");
var gradedFileBis20 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00020bis.mov");

var gradedImportSuccess20 = false;
var gradedFileName20 = "";

// Tenter import standard
if (gradedFile20.exists) {
    try {
        var gradedFootage20 = project.importFile(new ImportOptions(gradedFile20));
        gradedFootage20.parentFolder = fromGradingFolder;
        gradedFootage20.name = "UNDLM_00020";
        gradingSources[20] = gradedFootage20;
        gradingImportCount++;
        gradedImportSuccess20 = true;
        gradedFileName20 = "UNDLM_00020.mov";
        logImportSuccess(20, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00020.mov", gradedFileName20);
    } catch (e) {
        logImportError(20, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00020.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess20 && gradedFilePoignees20.exists) {
    try {
        var gradedFootage20 = project.importFile(new ImportOptions(gradedFilePoignees20));
        gradedFootage20.parentFolder = fromGradingFolder;
        gradedFootage20.name = "UNDLM_00020_AVEC_POIGNEES";
        gradingSources[20] = gradedFootage20;
        gradingImportCount++;
        gradedImportSuccess20 = true;
        gradedFileName20 = "UNDLM_00020_AVEC_POIGNEES.mov";
        logImportSuccess(20, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00020_AVEC_POIGNEES.mov", gradedFileName20);
    } catch (e) {
        logImportError(20, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00020_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess20 && gradedFileBis20.exists) {
    try {
        var gradedFootage20 = project.importFile(new ImportOptions(gradedFileBis20));
        gradedFootage20.parentFolder = fromGradingFolder;
        gradedFootage20.name = "UNDLM_00020bis";
        gradingSources[20] = gradedFootage20;
        gradingImportCount++;
        gradedImportSuccess20 = true;
        gradedFileName20 = "UNDLM_00020bis.mov";
        logImportSuccess(20, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00020bis.mov", gradedFileName20);
    } catch (e) {
        logImportError(20, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00020bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess20) {
    missingGradingCount++;
}

// Import plan GRADED 00021
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile21 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00021.mov");
var gradedFilePoignees21 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00021_AVEC_POIGNEES.mov");
var gradedFileBis21 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00021bis.mov");

var gradedImportSuccess21 = false;
var gradedFileName21 = "";

// Tenter import standard
if (gradedFile21.exists) {
    try {
        var gradedFootage21 = project.importFile(new ImportOptions(gradedFile21));
        gradedFootage21.parentFolder = fromGradingFolder;
        gradedFootage21.name = "UNDLM_00021";
        gradingSources[21] = gradedFootage21;
        gradingImportCount++;
        gradedImportSuccess21 = true;
        gradedFileName21 = "UNDLM_00021.mov";
        logImportSuccess(21, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00021.mov", gradedFileName21);
    } catch (e) {
        logImportError(21, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00021.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess21 && gradedFilePoignees21.exists) {
    try {
        var gradedFootage21 = project.importFile(new ImportOptions(gradedFilePoignees21));
        gradedFootage21.parentFolder = fromGradingFolder;
        gradedFootage21.name = "UNDLM_00021_AVEC_POIGNEES";
        gradingSources[21] = gradedFootage21;
        gradingImportCount++;
        gradedImportSuccess21 = true;
        gradedFileName21 = "UNDLM_00021_AVEC_POIGNEES.mov";
        logImportSuccess(21, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00021_AVEC_POIGNEES.mov", gradedFileName21);
    } catch (e) {
        logImportError(21, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00021_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess21 && gradedFileBis21.exists) {
    try {
        var gradedFootage21 = project.importFile(new ImportOptions(gradedFileBis21));
        gradedFootage21.parentFolder = fromGradingFolder;
        gradedFootage21.name = "UNDLM_00021bis";
        gradingSources[21] = gradedFootage21;
        gradingImportCount++;
        gradedImportSuccess21 = true;
        gradedFileName21 = "UNDLM_00021bis.mov";
        logImportSuccess(21, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00021bis.mov", gradedFileName21);
    } catch (e) {
        logImportError(21, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00021bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess21) {
    missingGradingCount++;
}

// Import plan GRADED 00022
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile22 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00022.mov");
var gradedFilePoignees22 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00022_AVEC_POIGNEES.mov");
var gradedFileBis22 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00022bis.mov");

var gradedImportSuccess22 = false;
var gradedFileName22 = "";

// Tenter import standard
if (gradedFile22.exists) {
    try {
        var gradedFootage22 = project.importFile(new ImportOptions(gradedFile22));
        gradedFootage22.parentFolder = fromGradingFolder;
        gradedFootage22.name = "UNDLM_00022";
        gradingSources[22] = gradedFootage22;
        gradingImportCount++;
        gradedImportSuccess22 = true;
        gradedFileName22 = "UNDLM_00022.mov";
        logImportSuccess(22, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00022.mov", gradedFileName22);
    } catch (e) {
        logImportError(22, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00022.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess22 && gradedFilePoignees22.exists) {
    try {
        var gradedFootage22 = project.importFile(new ImportOptions(gradedFilePoignees22));
        gradedFootage22.parentFolder = fromGradingFolder;
        gradedFootage22.name = "UNDLM_00022_AVEC_POIGNEES";
        gradingSources[22] = gradedFootage22;
        gradingImportCount++;
        gradedImportSuccess22 = true;
        gradedFileName22 = "UNDLM_00022_AVEC_POIGNEES.mov";
        logImportSuccess(22, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00022_AVEC_POIGNEES.mov", gradedFileName22);
    } catch (e) {
        logImportError(22, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00022_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess22 && gradedFileBis22.exists) {
    try {
        var gradedFootage22 = project.importFile(new ImportOptions(gradedFileBis22));
        gradedFootage22.parentFolder = fromGradingFolder;
        gradedFootage22.name = "UNDLM_00022bis";
        gradingSources[22] = gradedFootage22;
        gradingImportCount++;
        gradedImportSuccess22 = true;
        gradedFileName22 = "UNDLM_00022bis.mov";
        logImportSuccess(22, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00022bis.mov", gradedFileName22);
    } catch (e) {
        logImportError(22, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00022bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess22) {
    missingGradingCount++;
}

// Import plan GRADED 00023
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile23 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00023.mov");
var gradedFilePoignees23 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00023_AVEC_POIGNEES.mov");
var gradedFileBis23 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00023bis.mov");

var gradedImportSuccess23 = false;
var gradedFileName23 = "";

// Tenter import standard
if (gradedFile23.exists) {
    try {
        var gradedFootage23 = project.importFile(new ImportOptions(gradedFile23));
        gradedFootage23.parentFolder = fromGradingFolder;
        gradedFootage23.name = "UNDLM_00023";
        gradingSources[23] = gradedFootage23;
        gradingImportCount++;
        gradedImportSuccess23 = true;
        gradedFileName23 = "UNDLM_00023.mov";
        logImportSuccess(23, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00023.mov", gradedFileName23);
    } catch (e) {
        logImportError(23, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00023.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess23 && gradedFilePoignees23.exists) {
    try {
        var gradedFootage23 = project.importFile(new ImportOptions(gradedFilePoignees23));
        gradedFootage23.parentFolder = fromGradingFolder;
        gradedFootage23.name = "UNDLM_00023_AVEC_POIGNEES";
        gradingSources[23] = gradedFootage23;
        gradingImportCount++;
        gradedImportSuccess23 = true;
        gradedFileName23 = "UNDLM_00023_AVEC_POIGNEES.mov";
        logImportSuccess(23, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00023_AVEC_POIGNEES.mov", gradedFileName23);
    } catch (e) {
        logImportError(23, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00023_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess23 && gradedFileBis23.exists) {
    try {
        var gradedFootage23 = project.importFile(new ImportOptions(gradedFileBis23));
        gradedFootage23.parentFolder = fromGradingFolder;
        gradedFootage23.name = "UNDLM_00023bis";
        gradingSources[23] = gradedFootage23;
        gradingImportCount++;
        gradedImportSuccess23 = true;
        gradedFileName23 = "UNDLM_00023bis.mov";
        logImportSuccess(23, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00023bis.mov", gradedFileName23);
    } catch (e) {
        logImportError(23, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00023bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess23) {
    missingGradingCount++;
}

// Import plan GRADED 00024
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile24 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00024.mov");
var gradedFilePoignees24 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00024_AVEC_POIGNEES.mov");
var gradedFileBis24 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00024bis.mov");

var gradedImportSuccess24 = false;
var gradedFileName24 = "";

// Tenter import standard
if (gradedFile24.exists) {
    try {
        var gradedFootage24 = project.importFile(new ImportOptions(gradedFile24));
        gradedFootage24.parentFolder = fromGradingFolder;
        gradedFootage24.name = "UNDLM_00024";
        gradingSources[24] = gradedFootage24;
        gradingImportCount++;
        gradedImportSuccess24 = true;
        gradedFileName24 = "UNDLM_00024.mov";
        logImportSuccess(24, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00024.mov", gradedFileName24);
    } catch (e) {
        logImportError(24, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00024.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess24 && gradedFilePoignees24.exists) {
    try {
        var gradedFootage24 = project.importFile(new ImportOptions(gradedFilePoignees24));
        gradedFootage24.parentFolder = fromGradingFolder;
        gradedFootage24.name = "UNDLM_00024_AVEC_POIGNEES";
        gradingSources[24] = gradedFootage24;
        gradingImportCount++;
        gradedImportSuccess24 = true;
        gradedFileName24 = "UNDLM_00024_AVEC_POIGNEES.mov";
        logImportSuccess(24, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00024_AVEC_POIGNEES.mov", gradedFileName24);
    } catch (e) {
        logImportError(24, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00024_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess24 && gradedFileBis24.exists) {
    try {
        var gradedFootage24 = project.importFile(new ImportOptions(gradedFileBis24));
        gradedFootage24.parentFolder = fromGradingFolder;
        gradedFootage24.name = "UNDLM_00024bis";
        gradingSources[24] = gradedFootage24;
        gradingImportCount++;
        gradedImportSuccess24 = true;
        gradedFileName24 = "UNDLM_00024bis.mov";
        logImportSuccess(24, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00024bis.mov", gradedFileName24);
    } catch (e) {
        logImportError(24, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00024bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess24) {
    missingGradingCount++;
}

// Import plan GRADED 00025
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile25 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00025.mov");
var gradedFilePoignees25 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00025_AVEC_POIGNEES.mov");
var gradedFileBis25 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00025bis.mov");

var gradedImportSuccess25 = false;
var gradedFileName25 = "";

// Tenter import standard
if (gradedFile25.exists) {
    try {
        var gradedFootage25 = project.importFile(new ImportOptions(gradedFile25));
        gradedFootage25.parentFolder = fromGradingFolder;
        gradedFootage25.name = "UNDLM_00025";
        gradingSources[25] = gradedFootage25;
        gradingImportCount++;
        gradedImportSuccess25 = true;
        gradedFileName25 = "UNDLM_00025.mov";
        logImportSuccess(25, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00025.mov", gradedFileName25);
    } catch (e) {
        logImportError(25, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00025.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess25 && gradedFilePoignees25.exists) {
    try {
        var gradedFootage25 = project.importFile(new ImportOptions(gradedFilePoignees25));
        gradedFootage25.parentFolder = fromGradingFolder;
        gradedFootage25.name = "UNDLM_00025_AVEC_POIGNEES";
        gradingSources[25] = gradedFootage25;
        gradingImportCount++;
        gradedImportSuccess25 = true;
        gradedFileName25 = "UNDLM_00025_AVEC_POIGNEES.mov";
        logImportSuccess(25, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00025_AVEC_POIGNEES.mov", gradedFileName25);
    } catch (e) {
        logImportError(25, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00025_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess25 && gradedFileBis25.exists) {
    try {
        var gradedFootage25 = project.importFile(new ImportOptions(gradedFileBis25));
        gradedFootage25.parentFolder = fromGradingFolder;
        gradedFootage25.name = "UNDLM_00025bis";
        gradingSources[25] = gradedFootage25;
        gradingImportCount++;
        gradedImportSuccess25 = true;
        gradedFileName25 = "UNDLM_00025bis.mov";
        logImportSuccess(25, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00025bis.mov", gradedFileName25);
    } catch (e) {
        logImportError(25, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00025bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess25) {
    missingGradingCount++;
}

// Import plan GRADED 00026
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile26 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00026.mov");
var gradedFilePoignees26 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00026_AVEC_POIGNEES.mov");
var gradedFileBis26 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00026bis.mov");

var gradedImportSuccess26 = false;
var gradedFileName26 = "";

// Tenter import standard
if (gradedFile26.exists) {
    try {
        var gradedFootage26 = project.importFile(new ImportOptions(gradedFile26));
        gradedFootage26.parentFolder = fromGradingFolder;
        gradedFootage26.name = "UNDLM_00026";
        gradingSources[26] = gradedFootage26;
        gradingImportCount++;
        gradedImportSuccess26 = true;
        gradedFileName26 = "UNDLM_00026.mov";
        logImportSuccess(26, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00026.mov", gradedFileName26);
    } catch (e) {
        logImportError(26, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00026.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess26 && gradedFilePoignees26.exists) {
    try {
        var gradedFootage26 = project.importFile(new ImportOptions(gradedFilePoignees26));
        gradedFootage26.parentFolder = fromGradingFolder;
        gradedFootage26.name = "UNDLM_00026_AVEC_POIGNEES";
        gradingSources[26] = gradedFootage26;
        gradingImportCount++;
        gradedImportSuccess26 = true;
        gradedFileName26 = "UNDLM_00026_AVEC_POIGNEES.mov";
        logImportSuccess(26, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00026_AVEC_POIGNEES.mov", gradedFileName26);
    } catch (e) {
        logImportError(26, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00026_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess26 && gradedFileBis26.exists) {
    try {
        var gradedFootage26 = project.importFile(new ImportOptions(gradedFileBis26));
        gradedFootage26.parentFolder = fromGradingFolder;
        gradedFootage26.name = "UNDLM_00026bis";
        gradingSources[26] = gradedFootage26;
        gradingImportCount++;
        gradedImportSuccess26 = true;
        gradedFileName26 = "UNDLM_00026bis.mov";
        logImportSuccess(26, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00026bis.mov", gradedFileName26);
    } catch (e) {
        logImportError(26, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00026bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess26) {
    missingGradingCount++;
}

// Import plan GRADED 00027
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile27 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00027.mov");
var gradedFilePoignees27 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00027_AVEC_POIGNEES.mov");
var gradedFileBis27 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00027bis.mov");

var gradedImportSuccess27 = false;
var gradedFileName27 = "";

// Tenter import standard
if (gradedFile27.exists) {
    try {
        var gradedFootage27 = project.importFile(new ImportOptions(gradedFile27));
        gradedFootage27.parentFolder = fromGradingFolder;
        gradedFootage27.name = "UNDLM_00027";
        gradingSources[27] = gradedFootage27;
        gradingImportCount++;
        gradedImportSuccess27 = true;
        gradedFileName27 = "UNDLM_00027.mov";
        logImportSuccess(27, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00027.mov", gradedFileName27);
    } catch (e) {
        logImportError(27, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00027.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess27 && gradedFilePoignees27.exists) {
    try {
        var gradedFootage27 = project.importFile(new ImportOptions(gradedFilePoignees27));
        gradedFootage27.parentFolder = fromGradingFolder;
        gradedFootage27.name = "UNDLM_00027_AVEC_POIGNEES";
        gradingSources[27] = gradedFootage27;
        gradingImportCount++;
        gradedImportSuccess27 = true;
        gradedFileName27 = "UNDLM_00027_AVEC_POIGNEES.mov";
        logImportSuccess(27, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00027_AVEC_POIGNEES.mov", gradedFileName27);
    } catch (e) {
        logImportError(27, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00027_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess27 && gradedFileBis27.exists) {
    try {
        var gradedFootage27 = project.importFile(new ImportOptions(gradedFileBis27));
        gradedFootage27.parentFolder = fromGradingFolder;
        gradedFootage27.name = "UNDLM_00027bis";
        gradingSources[27] = gradedFootage27;
        gradingImportCount++;
        gradedImportSuccess27 = true;
        gradedFileName27 = "UNDLM_00027bis.mov";
        logImportSuccess(27, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00027bis.mov", gradedFileName27);
    } catch (e) {
        logImportError(27, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00027bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess27) {
    missingGradingCount++;
}

// Import plan GRADED 00028
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile28 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00028.mov");
var gradedFilePoignees28 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00028_AVEC_POIGNEES.mov");
var gradedFileBis28 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00028bis.mov");

var gradedImportSuccess28 = false;
var gradedFileName28 = "";

// Tenter import standard
if (gradedFile28.exists) {
    try {
        var gradedFootage28 = project.importFile(new ImportOptions(gradedFile28));
        gradedFootage28.parentFolder = fromGradingFolder;
        gradedFootage28.name = "UNDLM_00028";
        gradingSources[28] = gradedFootage28;
        gradingImportCount++;
        gradedImportSuccess28 = true;
        gradedFileName28 = "UNDLM_00028.mov";
        logImportSuccess(28, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00028.mov", gradedFileName28);
    } catch (e) {
        logImportError(28, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00028.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess28 && gradedFilePoignees28.exists) {
    try {
        var gradedFootage28 = project.importFile(new ImportOptions(gradedFilePoignees28));
        gradedFootage28.parentFolder = fromGradingFolder;
        gradedFootage28.name = "UNDLM_00028_AVEC_POIGNEES";
        gradingSources[28] = gradedFootage28;
        gradingImportCount++;
        gradedImportSuccess28 = true;
        gradedFileName28 = "UNDLM_00028_AVEC_POIGNEES.mov";
        logImportSuccess(28, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00028_AVEC_POIGNEES.mov", gradedFileName28);
    } catch (e) {
        logImportError(28, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00028_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess28 && gradedFileBis28.exists) {
    try {
        var gradedFootage28 = project.importFile(new ImportOptions(gradedFileBis28));
        gradedFootage28.parentFolder = fromGradingFolder;
        gradedFootage28.name = "UNDLM_00028bis";
        gradingSources[28] = gradedFootage28;
        gradingImportCount++;
        gradedImportSuccess28 = true;
        gradedFileName28 = "UNDLM_00028bis.mov";
        logImportSuccess(28, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00028bis.mov", gradedFileName28);
    } catch (e) {
        logImportError(28, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00028bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess28) {
    missingGradingCount++;
}

// Import plan GRADED 00029
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile29 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00029.mov");
var gradedFilePoignees29 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00029_AVEC_POIGNEES.mov");
var gradedFileBis29 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00029bis.mov");

var gradedImportSuccess29 = false;
var gradedFileName29 = "";

// Tenter import standard
if (gradedFile29.exists) {
    try {
        var gradedFootage29 = project.importFile(new ImportOptions(gradedFile29));
        gradedFootage29.parentFolder = fromGradingFolder;
        gradedFootage29.name = "UNDLM_00029";
        gradingSources[29] = gradedFootage29;
        gradingImportCount++;
        gradedImportSuccess29 = true;
        gradedFileName29 = "UNDLM_00029.mov";
        logImportSuccess(29, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00029.mov", gradedFileName29);
    } catch (e) {
        logImportError(29, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00029.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess29 && gradedFilePoignees29.exists) {
    try {
        var gradedFootage29 = project.importFile(new ImportOptions(gradedFilePoignees29));
        gradedFootage29.parentFolder = fromGradingFolder;
        gradedFootage29.name = "UNDLM_00029_AVEC_POIGNEES";
        gradingSources[29] = gradedFootage29;
        gradingImportCount++;
        gradedImportSuccess29 = true;
        gradedFileName29 = "UNDLM_00029_AVEC_POIGNEES.mov";
        logImportSuccess(29, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00029_AVEC_POIGNEES.mov", gradedFileName29);
    } catch (e) {
        logImportError(29, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00029_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess29 && gradedFileBis29.exists) {
    try {
        var gradedFootage29 = project.importFile(new ImportOptions(gradedFileBis29));
        gradedFootage29.parentFolder = fromGradingFolder;
        gradedFootage29.name = "UNDLM_00029bis";
        gradingSources[29] = gradedFootage29;
        gradingImportCount++;
        gradedImportSuccess29 = true;
        gradedFileName29 = "UNDLM_00029bis.mov";
        logImportSuccess(29, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00029bis.mov", gradedFileName29);
    } catch (e) {
        logImportError(29, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00029bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess29) {
    missingGradingCount++;
}

// Import plan GRADED 00030
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile30 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00030.mov");
var gradedFilePoignees30 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00030_AVEC_POIGNEES.mov");
var gradedFileBis30 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00030bis.mov");

var gradedImportSuccess30 = false;
var gradedFileName30 = "";

// Tenter import standard
if (gradedFile30.exists) {
    try {
        var gradedFootage30 = project.importFile(new ImportOptions(gradedFile30));
        gradedFootage30.parentFolder = fromGradingFolder;
        gradedFootage30.name = "UNDLM_00030";
        gradingSources[30] = gradedFootage30;
        gradingImportCount++;
        gradedImportSuccess30 = true;
        gradedFileName30 = "UNDLM_00030.mov";
        logImportSuccess(30, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00030.mov", gradedFileName30);
    } catch (e) {
        logImportError(30, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00030.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess30 && gradedFilePoignees30.exists) {
    try {
        var gradedFootage30 = project.importFile(new ImportOptions(gradedFilePoignees30));
        gradedFootage30.parentFolder = fromGradingFolder;
        gradedFootage30.name = "UNDLM_00030_AVEC_POIGNEES";
        gradingSources[30] = gradedFootage30;
        gradingImportCount++;
        gradedImportSuccess30 = true;
        gradedFileName30 = "UNDLM_00030_AVEC_POIGNEES.mov";
        logImportSuccess(30, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00030_AVEC_POIGNEES.mov", gradedFileName30);
    } catch (e) {
        logImportError(30, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00030_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess30 && gradedFileBis30.exists) {
    try {
        var gradedFootage30 = project.importFile(new ImportOptions(gradedFileBis30));
        gradedFootage30.parentFolder = fromGradingFolder;
        gradedFootage30.name = "UNDLM_00030bis";
        gradingSources[30] = gradedFootage30;
        gradingImportCount++;
        gradedImportSuccess30 = true;
        gradedFileName30 = "UNDLM_00030bis.mov";
        logImportSuccess(30, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00030bis.mov", gradedFileName30);
    } catch (e) {
        logImportError(30, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00030bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess30) {
    missingGradingCount++;
}

// Import plan GRADED 00031
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile31 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00031.mov");
var gradedFilePoignees31 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00031_AVEC_POIGNEES.mov");
var gradedFileBis31 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00031bis.mov");

var gradedImportSuccess31 = false;
var gradedFileName31 = "";

// Tenter import standard
if (gradedFile31.exists) {
    try {
        var gradedFootage31 = project.importFile(new ImportOptions(gradedFile31));
        gradedFootage31.parentFolder = fromGradingFolder;
        gradedFootage31.name = "UNDLM_00031";
        gradingSources[31] = gradedFootage31;
        gradingImportCount++;
        gradedImportSuccess31 = true;
        gradedFileName31 = "UNDLM_00031.mov";
        logImportSuccess(31, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00031.mov", gradedFileName31);
    } catch (e) {
        logImportError(31, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00031.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess31 && gradedFilePoignees31.exists) {
    try {
        var gradedFootage31 = project.importFile(new ImportOptions(gradedFilePoignees31));
        gradedFootage31.parentFolder = fromGradingFolder;
        gradedFootage31.name = "UNDLM_00031_AVEC_POIGNEES";
        gradingSources[31] = gradedFootage31;
        gradingImportCount++;
        gradedImportSuccess31 = true;
        gradedFileName31 = "UNDLM_00031_AVEC_POIGNEES.mov";
        logImportSuccess(31, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00031_AVEC_POIGNEES.mov", gradedFileName31);
    } catch (e) {
        logImportError(31, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00031_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess31 && gradedFileBis31.exists) {
    try {
        var gradedFootage31 = project.importFile(new ImportOptions(gradedFileBis31));
        gradedFootage31.parentFolder = fromGradingFolder;
        gradedFootage31.name = "UNDLM_00031bis";
        gradingSources[31] = gradedFootage31;
        gradingImportCount++;
        gradedImportSuccess31 = true;
        gradedFileName31 = "UNDLM_00031bis.mov";
        logImportSuccess(31, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00031bis.mov", gradedFileName31);
    } catch (e) {
        logImportError(31, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00031bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess31) {
    missingGradingCount++;
}

// Import plan GRADED 00032
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile32 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00032.mov");
var gradedFilePoignees32 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00032_AVEC_POIGNEES.mov");
var gradedFileBis32 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00032bis.mov");

var gradedImportSuccess32 = false;
var gradedFileName32 = "";

// Tenter import standard
if (gradedFile32.exists) {
    try {
        var gradedFootage32 = project.importFile(new ImportOptions(gradedFile32));
        gradedFootage32.parentFolder = fromGradingFolder;
        gradedFootage32.name = "UNDLM_00032";
        gradingSources[32] = gradedFootage32;
        gradingImportCount++;
        gradedImportSuccess32 = true;
        gradedFileName32 = "UNDLM_00032.mov";
        logImportSuccess(32, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00032.mov", gradedFileName32);
    } catch (e) {
        logImportError(32, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00032.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess32 && gradedFilePoignees32.exists) {
    try {
        var gradedFootage32 = project.importFile(new ImportOptions(gradedFilePoignees32));
        gradedFootage32.parentFolder = fromGradingFolder;
        gradedFootage32.name = "UNDLM_00032_AVEC_POIGNEES";
        gradingSources[32] = gradedFootage32;
        gradingImportCount++;
        gradedImportSuccess32 = true;
        gradedFileName32 = "UNDLM_00032_AVEC_POIGNEES.mov";
        logImportSuccess(32, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00032_AVEC_POIGNEES.mov", gradedFileName32);
    } catch (e) {
        logImportError(32, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00032_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess32 && gradedFileBis32.exists) {
    try {
        var gradedFootage32 = project.importFile(new ImportOptions(gradedFileBis32));
        gradedFootage32.parentFolder = fromGradingFolder;
        gradedFootage32.name = "UNDLM_00032bis";
        gradingSources[32] = gradedFootage32;
        gradingImportCount++;
        gradedImportSuccess32 = true;
        gradedFileName32 = "UNDLM_00032bis.mov";
        logImportSuccess(32, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00032bis.mov", gradedFileName32);
    } catch (e) {
        logImportError(32, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00032bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess32) {
    missingGradingCount++;
}

// Import plan GRADED 00033
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile33 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00033.mov");
var gradedFilePoignees33 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00033_AVEC_POIGNEES.mov");
var gradedFileBis33 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00033bis.mov");

var gradedImportSuccess33 = false;
var gradedFileName33 = "";

// Tenter import standard
if (gradedFile33.exists) {
    try {
        var gradedFootage33 = project.importFile(new ImportOptions(gradedFile33));
        gradedFootage33.parentFolder = fromGradingFolder;
        gradedFootage33.name = "UNDLM_00033";
        gradingSources[33] = gradedFootage33;
        gradingImportCount++;
        gradedImportSuccess33 = true;
        gradedFileName33 = "UNDLM_00033.mov";
        logImportSuccess(33, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00033.mov", gradedFileName33);
    } catch (e) {
        logImportError(33, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00033.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess33 && gradedFilePoignees33.exists) {
    try {
        var gradedFootage33 = project.importFile(new ImportOptions(gradedFilePoignees33));
        gradedFootage33.parentFolder = fromGradingFolder;
        gradedFootage33.name = "UNDLM_00033_AVEC_POIGNEES";
        gradingSources[33] = gradedFootage33;
        gradingImportCount++;
        gradedImportSuccess33 = true;
        gradedFileName33 = "UNDLM_00033_AVEC_POIGNEES.mov";
        logImportSuccess(33, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00033_AVEC_POIGNEES.mov", gradedFileName33);
    } catch (e) {
        logImportError(33, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00033_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess33 && gradedFileBis33.exists) {
    try {
        var gradedFootage33 = project.importFile(new ImportOptions(gradedFileBis33));
        gradedFootage33.parentFolder = fromGradingFolder;
        gradedFootage33.name = "UNDLM_00033bis";
        gradingSources[33] = gradedFootage33;
        gradingImportCount++;
        gradedImportSuccess33 = true;
        gradedFileName33 = "UNDLM_00033bis.mov";
        logImportSuccess(33, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00033bis.mov", gradedFileName33);
    } catch (e) {
        logImportError(33, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00033bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess33) {
    missingGradingCount++;
}

// Import plan GRADED 00034
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile34 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00034.mov");
var gradedFilePoignees34 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00034_AVEC_POIGNEES.mov");
var gradedFileBis34 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00034bis.mov");

var gradedImportSuccess34 = false;
var gradedFileName34 = "";

// Tenter import standard
if (gradedFile34.exists) {
    try {
        var gradedFootage34 = project.importFile(new ImportOptions(gradedFile34));
        gradedFootage34.parentFolder = fromGradingFolder;
        gradedFootage34.name = "UNDLM_00034";
        gradingSources[34] = gradedFootage34;
        gradingImportCount++;
        gradedImportSuccess34 = true;
        gradedFileName34 = "UNDLM_00034.mov";
        logImportSuccess(34, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00034.mov", gradedFileName34);
    } catch (e) {
        logImportError(34, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00034.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess34 && gradedFilePoignees34.exists) {
    try {
        var gradedFootage34 = project.importFile(new ImportOptions(gradedFilePoignees34));
        gradedFootage34.parentFolder = fromGradingFolder;
        gradedFootage34.name = "UNDLM_00034_AVEC_POIGNEES";
        gradingSources[34] = gradedFootage34;
        gradingImportCount++;
        gradedImportSuccess34 = true;
        gradedFileName34 = "UNDLM_00034_AVEC_POIGNEES.mov";
        logImportSuccess(34, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00034_AVEC_POIGNEES.mov", gradedFileName34);
    } catch (e) {
        logImportError(34, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00034_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess34 && gradedFileBis34.exists) {
    try {
        var gradedFootage34 = project.importFile(new ImportOptions(gradedFileBis34));
        gradedFootage34.parentFolder = fromGradingFolder;
        gradedFootage34.name = "UNDLM_00034bis";
        gradingSources[34] = gradedFootage34;
        gradingImportCount++;
        gradedImportSuccess34 = true;
        gradedFileName34 = "UNDLM_00034bis.mov";
        logImportSuccess(34, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00034bis.mov", gradedFileName34);
    } catch (e) {
        logImportError(34, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00034bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess34) {
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


// Composition pour plan 00001
var planComp1 = project.items.addComp(
    "SQ01_UNDLM_00001_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp1.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer1 = planComp1.layers.add(bgSolidComp);
bgLayer1.name = "BG_SOLID";
bgLayer1.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer1 = false;
if (gradingSources[1]) {
    var gradedLayer1 = planComp1.layers.add(gradingSources[1]);
    gradedLayer1.name = "UNDLM_00001_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer1.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer1.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer1 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer1 = false;
if (editSources[1]) {
    var editLayer1 = planComp1.layers.add(editSources[1]);
    editLayer1.name = "UNDLM_00001_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer1.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer1.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer1 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity1 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer1) {
    // EDIT toujours activé quand disponible
    editLayer1.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer1) {
        gradedLayer1.enabled = false;
    }
} else if (hasGradedLayer1) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer1.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText1 = planComp1.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText1.name = "WARNING_NO_EDIT";
    warningText1.property("Transform").property("Position").setValue([1280, 200]);
    warningText1.guideLayer = true;
    
    var warningTextDoc1 = warningText1.property("Source Text").value;
    warningTextDoc1.fontSize = 32;
    warningTextDoc1.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc1.font = "Arial-BoldMT";
    warningTextDoc1.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText1.property("Source Text").setValue(warningTextDoc1);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText1 = planComp1.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00001");
    errorText1.name = "ERROR_NO_SOURCE";
    errorText1.property("Transform").property("Position").setValue([1280, 720]);
    errorText1.guideLayer = true;
    
    var errorTextDoc1 = errorText1.property("Source Text").value;
    errorTextDoc1.fontSize = 48;
    errorTextDoc1.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc1.font = "Arial-BoldMT";
    errorTextDoc1.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText1.property("Source Text").setValue(errorTextDoc1);
}

planCompositions[1] = planComp1;


// Composition pour plan 00002
var planComp2 = project.items.addComp(
    "SQ01_UNDLM_00002_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp2.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer2 = planComp2.layers.add(bgSolidComp);
bgLayer2.name = "BG_SOLID";
bgLayer2.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer2 = false;
if (gradingSources[2]) {
    var gradedLayer2 = planComp2.layers.add(gradingSources[2]);
    gradedLayer2.name = "UNDLM_00002_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer2.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer2.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer2 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer2 = false;
if (editSources[2]) {
    var editLayer2 = planComp2.layers.add(editSources[2]);
    editLayer2.name = "UNDLM_00002_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer2.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer2.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer2 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity2 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer2) {
    // EDIT toujours activé quand disponible
    editLayer2.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer2) {
        gradedLayer2.enabled = false;
    }
} else if (hasGradedLayer2) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer2.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText2 = planComp2.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText2.name = "WARNING_NO_EDIT";
    warningText2.property("Transform").property("Position").setValue([1280, 200]);
    warningText2.guideLayer = true;
    
    var warningTextDoc2 = warningText2.property("Source Text").value;
    warningTextDoc2.fontSize = 32;
    warningTextDoc2.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc2.font = "Arial-BoldMT";
    warningTextDoc2.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText2.property("Source Text").setValue(warningTextDoc2);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText2 = planComp2.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00002");
    errorText2.name = "ERROR_NO_SOURCE";
    errorText2.property("Transform").property("Position").setValue([1280, 720]);
    errorText2.guideLayer = true;
    
    var errorTextDoc2 = errorText2.property("Source Text").value;
    errorTextDoc2.fontSize = 48;
    errorTextDoc2.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc2.font = "Arial-BoldMT";
    errorTextDoc2.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText2.property("Source Text").setValue(errorTextDoc2);
}

planCompositions[2] = planComp2;


// Composition pour plan 00003
var planComp3 = project.items.addComp(
    "SQ01_UNDLM_00003_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp3.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer3 = planComp3.layers.add(bgSolidComp);
bgLayer3.name = "BG_SOLID";
bgLayer3.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer3 = false;
if (gradingSources[3]) {
    var gradedLayer3 = planComp3.layers.add(gradingSources[3]);
    gradedLayer3.name = "UNDLM_00003_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer3.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer3.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer3 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer3 = false;
if (editSources[3]) {
    var editLayer3 = planComp3.layers.add(editSources[3]);
    editLayer3.name = "UNDLM_00003_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer3.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer3.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer3 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity3 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer3) {
    // EDIT toujours activé quand disponible
    editLayer3.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer3) {
        gradedLayer3.enabled = false;
    }
} else if (hasGradedLayer3) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer3.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText3 = planComp3.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText3.name = "WARNING_NO_EDIT";
    warningText3.property("Transform").property("Position").setValue([1280, 200]);
    warningText3.guideLayer = true;
    
    var warningTextDoc3 = warningText3.property("Source Text").value;
    warningTextDoc3.fontSize = 32;
    warningTextDoc3.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc3.font = "Arial-BoldMT";
    warningTextDoc3.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText3.property("Source Text").setValue(warningTextDoc3);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText3 = planComp3.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00003");
    errorText3.name = "ERROR_NO_SOURCE";
    errorText3.property("Transform").property("Position").setValue([1280, 720]);
    errorText3.guideLayer = true;
    
    var errorTextDoc3 = errorText3.property("Source Text").value;
    errorTextDoc3.fontSize = 48;
    errorTextDoc3.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc3.font = "Arial-BoldMT";
    errorTextDoc3.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText3.property("Source Text").setValue(errorTextDoc3);
}

planCompositions[3] = planComp3;


// Composition pour plan 00004
var planComp4 = project.items.addComp(
    "SQ01_UNDLM_00004_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp4.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer4 = planComp4.layers.add(bgSolidComp);
bgLayer4.name = "BG_SOLID";
bgLayer4.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer4 = false;
if (gradingSources[4]) {
    var gradedLayer4 = planComp4.layers.add(gradingSources[4]);
    gradedLayer4.name = "UNDLM_00004_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer4.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer4.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer4 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer4 = false;
if (editSources[4]) {
    var editLayer4 = planComp4.layers.add(editSources[4]);
    editLayer4.name = "UNDLM_00004_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer4.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer4.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer4 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity4 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer4) {
    // EDIT toujours activé quand disponible
    editLayer4.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer4) {
        gradedLayer4.enabled = false;
    }
} else if (hasGradedLayer4) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer4.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText4 = planComp4.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText4.name = "WARNING_NO_EDIT";
    warningText4.property("Transform").property("Position").setValue([1280, 200]);
    warningText4.guideLayer = true;
    
    var warningTextDoc4 = warningText4.property("Source Text").value;
    warningTextDoc4.fontSize = 32;
    warningTextDoc4.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc4.font = "Arial-BoldMT";
    warningTextDoc4.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText4.property("Source Text").setValue(warningTextDoc4);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText4 = planComp4.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00004");
    errorText4.name = "ERROR_NO_SOURCE";
    errorText4.property("Transform").property("Position").setValue([1280, 720]);
    errorText4.guideLayer = true;
    
    var errorTextDoc4 = errorText4.property("Source Text").value;
    errorTextDoc4.fontSize = 48;
    errorTextDoc4.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc4.font = "Arial-BoldMT";
    errorTextDoc4.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText4.property("Source Text").setValue(errorTextDoc4);
}

planCompositions[4] = planComp4;


// Composition pour plan 00005
var planComp5 = project.items.addComp(
    "SQ01_UNDLM_00005_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp5.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer5 = planComp5.layers.add(bgSolidComp);
bgLayer5.name = "BG_SOLID";
bgLayer5.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer5 = false;
if (gradingSources[5]) {
    var gradedLayer5 = planComp5.layers.add(gradingSources[5]);
    gradedLayer5.name = "UNDLM_00005_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer5.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer5.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer5 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer5 = false;
if (editSources[5]) {
    var editLayer5 = planComp5.layers.add(editSources[5]);
    editLayer5.name = "UNDLM_00005_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer5.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer5.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer5 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity5 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer5) {
    // EDIT toujours activé quand disponible
    editLayer5.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer5) {
        gradedLayer5.enabled = false;
    }
} else if (hasGradedLayer5) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer5.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText5 = planComp5.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText5.name = "WARNING_NO_EDIT";
    warningText5.property("Transform").property("Position").setValue([1280, 200]);
    warningText5.guideLayer = true;
    
    var warningTextDoc5 = warningText5.property("Source Text").value;
    warningTextDoc5.fontSize = 32;
    warningTextDoc5.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc5.font = "Arial-BoldMT";
    warningTextDoc5.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText5.property("Source Text").setValue(warningTextDoc5);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText5 = planComp5.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00005");
    errorText5.name = "ERROR_NO_SOURCE";
    errorText5.property("Transform").property("Position").setValue([1280, 720]);
    errorText5.guideLayer = true;
    
    var errorTextDoc5 = errorText5.property("Source Text").value;
    errorTextDoc5.fontSize = 48;
    errorTextDoc5.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc5.font = "Arial-BoldMT";
    errorTextDoc5.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText5.property("Source Text").setValue(errorTextDoc5);
}

planCompositions[5] = planComp5;


// Composition pour plan 00006
var planComp6 = project.items.addComp(
    "SQ01_UNDLM_00006_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp6.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer6 = planComp6.layers.add(bgSolidComp);
bgLayer6.name = "BG_SOLID";
bgLayer6.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer6 = false;
if (gradingSources[6]) {
    var gradedLayer6 = planComp6.layers.add(gradingSources[6]);
    gradedLayer6.name = "UNDLM_00006_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer6.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer6.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer6 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer6 = false;
if (editSources[6]) {
    var editLayer6 = planComp6.layers.add(editSources[6]);
    editLayer6.name = "UNDLM_00006_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer6.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer6.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer6 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity6 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer6) {
    // EDIT toujours activé quand disponible
    editLayer6.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer6) {
        gradedLayer6.enabled = false;
    }
} else if (hasGradedLayer6) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer6.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText6 = planComp6.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText6.name = "WARNING_NO_EDIT";
    warningText6.property("Transform").property("Position").setValue([1280, 200]);
    warningText6.guideLayer = true;
    
    var warningTextDoc6 = warningText6.property("Source Text").value;
    warningTextDoc6.fontSize = 32;
    warningTextDoc6.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc6.font = "Arial-BoldMT";
    warningTextDoc6.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText6.property("Source Text").setValue(warningTextDoc6);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText6 = planComp6.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00006");
    errorText6.name = "ERROR_NO_SOURCE";
    errorText6.property("Transform").property("Position").setValue([1280, 720]);
    errorText6.guideLayer = true;
    
    var errorTextDoc6 = errorText6.property("Source Text").value;
    errorTextDoc6.fontSize = 48;
    errorTextDoc6.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc6.font = "Arial-BoldMT";
    errorTextDoc6.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText6.property("Source Text").setValue(errorTextDoc6);
}

planCompositions[6] = planComp6;


// Composition pour plan 00007
var planComp7 = project.items.addComp(
    "SQ01_UNDLM_00007_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp7.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer7 = planComp7.layers.add(bgSolidComp);
bgLayer7.name = "BG_SOLID";
bgLayer7.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer7 = false;
if (gradingSources[7]) {
    var gradedLayer7 = planComp7.layers.add(gradingSources[7]);
    gradedLayer7.name = "UNDLM_00007_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer7.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer7.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer7 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer7 = false;
if (editSources[7]) {
    var editLayer7 = planComp7.layers.add(editSources[7]);
    editLayer7.name = "UNDLM_00007_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer7.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer7.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer7 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity7 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer7) {
    // EDIT toujours activé quand disponible
    editLayer7.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer7) {
        gradedLayer7.enabled = false;
    }
} else if (hasGradedLayer7) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer7.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText7 = planComp7.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText7.name = "WARNING_NO_EDIT";
    warningText7.property("Transform").property("Position").setValue([1280, 200]);
    warningText7.guideLayer = true;
    
    var warningTextDoc7 = warningText7.property("Source Text").value;
    warningTextDoc7.fontSize = 32;
    warningTextDoc7.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc7.font = "Arial-BoldMT";
    warningTextDoc7.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText7.property("Source Text").setValue(warningTextDoc7);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText7 = planComp7.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00007");
    errorText7.name = "ERROR_NO_SOURCE";
    errorText7.property("Transform").property("Position").setValue([1280, 720]);
    errorText7.guideLayer = true;
    
    var errorTextDoc7 = errorText7.property("Source Text").value;
    errorTextDoc7.fontSize = 48;
    errorTextDoc7.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc7.font = "Arial-BoldMT";
    errorTextDoc7.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText7.property("Source Text").setValue(errorTextDoc7);
}

planCompositions[7] = planComp7;


// Composition pour plan 00008
var planComp8 = project.items.addComp(
    "SQ01_UNDLM_00008_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    0.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp8.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer8 = planComp8.layers.add(bgSolidComp);
bgLayer8.name = "BG_SOLID";
bgLayer8.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer8 = false;
if (gradingSources[8]) {
    var gradedLayer8 = planComp8.layers.add(gradingSources[8]);
    gradedLayer8.name = "UNDLM_00008_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer8.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer8.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer8 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer8 = false;
if (editSources[8]) {
    var editLayer8 = planComp8.layers.add(editSources[8]);
    editLayer8.name = "UNDLM_00008_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer8.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer8.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer8 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity8 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer8) {
    // EDIT toujours activé quand disponible
    editLayer8.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer8) {
        gradedLayer8.enabled = false;
    }
} else if (hasGradedLayer8) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer8.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText8 = planComp8.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText8.name = "WARNING_NO_EDIT";
    warningText8.property("Transform").property("Position").setValue([1280, 200]);
    warningText8.guideLayer = true;
    
    var warningTextDoc8 = warningText8.property("Source Text").value;
    warningTextDoc8.fontSize = 32;
    warningTextDoc8.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc8.font = "Arial-BoldMT";
    warningTextDoc8.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText8.property("Source Text").setValue(warningTextDoc8);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText8 = planComp8.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00008");
    errorText8.name = "ERROR_NO_SOURCE";
    errorText8.property("Transform").property("Position").setValue([1280, 720]);
    errorText8.guideLayer = true;
    
    var errorTextDoc8 = errorText8.property("Source Text").value;
    errorTextDoc8.fontSize = 48;
    errorTextDoc8.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc8.font = "Arial-BoldMT";
    errorTextDoc8.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText8.property("Source Text").setValue(errorTextDoc8);
}

planCompositions[8] = planComp8;


// Composition pour plan 00009
var planComp9 = project.items.addComp(
    "SQ01_UNDLM_00009_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.5600000000000005,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp9.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer9 = planComp9.layers.add(bgSolidComp);
bgLayer9.name = "BG_SOLID";
bgLayer9.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer9 = false;
if (gradingSources[9]) {
    var gradedLayer9 = planComp9.layers.add(gradingSources[9]);
    gradedLayer9.name = "UNDLM_00009_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer9.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer9.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer9 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer9 = false;
if (editSources[9]) {
    var editLayer9 = planComp9.layers.add(editSources[9]);
    editLayer9.name = "UNDLM_00009_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer9.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer9.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer9 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity9 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer9) {
    // EDIT toujours activé quand disponible
    editLayer9.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer9) {
        gradedLayer9.enabled = false;
    }
} else if (hasGradedLayer9) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer9.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText9 = planComp9.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText9.name = "WARNING_NO_EDIT";
    warningText9.property("Transform").property("Position").setValue([1280, 200]);
    warningText9.guideLayer = true;
    
    var warningTextDoc9 = warningText9.property("Source Text").value;
    warningTextDoc9.fontSize = 32;
    warningTextDoc9.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc9.font = "Arial-BoldMT";
    warningTextDoc9.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText9.property("Source Text").setValue(warningTextDoc9);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText9 = planComp9.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00009");
    errorText9.name = "ERROR_NO_SOURCE";
    errorText9.property("Transform").property("Position").setValue([1280, 720]);
    errorText9.guideLayer = true;
    
    var errorTextDoc9 = errorText9.property("Source Text").value;
    errorTextDoc9.fontSize = 48;
    errorTextDoc9.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc9.font = "Arial-BoldMT";
    errorTextDoc9.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText9.property("Source Text").setValue(errorTextDoc9);
}

planCompositions[9] = planComp9;


// Composition pour plan 00010
var planComp10 = project.items.addComp(
    "SQ01_UNDLM_00010_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp10.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer10 = planComp10.layers.add(bgSolidComp);
bgLayer10.name = "BG_SOLID";
bgLayer10.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer10 = false;
if (gradingSources[10]) {
    var gradedLayer10 = planComp10.layers.add(gradingSources[10]);
    gradedLayer10.name = "UNDLM_00010_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer10.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer10.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer10 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer10 = false;
if (editSources[10]) {
    var editLayer10 = planComp10.layers.add(editSources[10]);
    editLayer10.name = "UNDLM_00010_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer10.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer10.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer10 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity10 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer10) {
    // EDIT toujours activé quand disponible
    editLayer10.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer10) {
        gradedLayer10.enabled = false;
    }
} else if (hasGradedLayer10) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer10.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText10 = planComp10.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText10.name = "WARNING_NO_EDIT";
    warningText10.property("Transform").property("Position").setValue([1280, 200]);
    warningText10.guideLayer = true;
    
    var warningTextDoc10 = warningText10.property("Source Text").value;
    warningTextDoc10.fontSize = 32;
    warningTextDoc10.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc10.font = "Arial-BoldMT";
    warningTextDoc10.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText10.property("Source Text").setValue(warningTextDoc10);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText10 = planComp10.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00010");
    errorText10.name = "ERROR_NO_SOURCE";
    errorText10.property("Transform").property("Position").setValue([1280, 720]);
    errorText10.guideLayer = true;
    
    var errorTextDoc10 = errorText10.property("Source Text").value;
    errorTextDoc10.fontSize = 48;
    errorTextDoc10.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc10.font = "Arial-BoldMT";
    errorTextDoc10.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText10.property("Source Text").setValue(errorTextDoc10);
}

planCompositions[10] = planComp10;


// Composition pour plan 00011
var planComp11 = project.items.addComp(
    "SQ01_UNDLM_00011_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp11.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer11 = planComp11.layers.add(bgSolidComp);
bgLayer11.name = "BG_SOLID";
bgLayer11.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer11 = false;
if (gradingSources[11]) {
    var gradedLayer11 = planComp11.layers.add(gradingSources[11]);
    gradedLayer11.name = "UNDLM_00011_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer11.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer11.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer11 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer11 = false;
if (editSources[11]) {
    var editLayer11 = planComp11.layers.add(editSources[11]);
    editLayer11.name = "UNDLM_00011_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer11.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer11.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer11 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity11 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer11) {
    // EDIT toujours activé quand disponible
    editLayer11.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer11) {
        gradedLayer11.enabled = false;
    }
} else if (hasGradedLayer11) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer11.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText11 = planComp11.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText11.name = "WARNING_NO_EDIT";
    warningText11.property("Transform").property("Position").setValue([1280, 200]);
    warningText11.guideLayer = true;
    
    var warningTextDoc11 = warningText11.property("Source Text").value;
    warningTextDoc11.fontSize = 32;
    warningTextDoc11.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc11.font = "Arial-BoldMT";
    warningTextDoc11.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText11.property("Source Text").setValue(warningTextDoc11);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText11 = planComp11.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00011");
    errorText11.name = "ERROR_NO_SOURCE";
    errorText11.property("Transform").property("Position").setValue([1280, 720]);
    errorText11.guideLayer = true;
    
    var errorTextDoc11 = errorText11.property("Source Text").value;
    errorTextDoc11.fontSize = 48;
    errorTextDoc11.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc11.font = "Arial-BoldMT";
    errorTextDoc11.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText11.property("Source Text").setValue(errorTextDoc11);
}

planCompositions[11] = planComp11;


// Composition pour plan 00012
var planComp12 = project.items.addComp(
    "SQ01_UNDLM_00012_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.7199999999999998,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp12.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer12 = planComp12.layers.add(bgSolidComp);
bgLayer12.name = "BG_SOLID";
bgLayer12.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer12 = false;
if (gradingSources[12]) {
    var gradedLayer12 = planComp12.layers.add(gradingSources[12]);
    gradedLayer12.name = "UNDLM_00012_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer12.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer12.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer12 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer12 = false;
if (editSources[12]) {
    var editLayer12 = planComp12.layers.add(editSources[12]);
    editLayer12.name = "UNDLM_00012_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer12.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer12.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer12 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity12 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer12) {
    // EDIT toujours activé quand disponible
    editLayer12.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer12) {
        gradedLayer12.enabled = false;
    }
} else if (hasGradedLayer12) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer12.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText12 = planComp12.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText12.name = "WARNING_NO_EDIT";
    warningText12.property("Transform").property("Position").setValue([1280, 200]);
    warningText12.guideLayer = true;
    
    var warningTextDoc12 = warningText12.property("Source Text").value;
    warningTextDoc12.fontSize = 32;
    warningTextDoc12.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc12.font = "Arial-BoldMT";
    warningTextDoc12.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText12.property("Source Text").setValue(warningTextDoc12);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText12 = planComp12.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00012");
    errorText12.name = "ERROR_NO_SOURCE";
    errorText12.property("Transform").property("Position").setValue([1280, 720]);
    errorText12.guideLayer = true;
    
    var errorTextDoc12 = errorText12.property("Source Text").value;
    errorTextDoc12.fontSize = 48;
    errorTextDoc12.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc12.font = "Arial-BoldMT";
    errorTextDoc12.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText12.property("Source Text").setValue(errorTextDoc12);
}

planCompositions[12] = planComp12;


// Composition pour plan 00013
var planComp13 = project.items.addComp(
    "SQ01_UNDLM_00013_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp13.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer13 = planComp13.layers.add(bgSolidComp);
bgLayer13.name = "BG_SOLID";
bgLayer13.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer13 = false;
if (gradingSources[13]) {
    var gradedLayer13 = planComp13.layers.add(gradingSources[13]);
    gradedLayer13.name = "UNDLM_00013_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer13.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer13.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer13 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer13 = false;
if (editSources[13]) {
    var editLayer13 = planComp13.layers.add(editSources[13]);
    editLayer13.name = "UNDLM_00013_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer13.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer13.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer13 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity13 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer13) {
    // EDIT toujours activé quand disponible
    editLayer13.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer13) {
        gradedLayer13.enabled = false;
    }
} else if (hasGradedLayer13) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer13.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText13 = planComp13.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText13.name = "WARNING_NO_EDIT";
    warningText13.property("Transform").property("Position").setValue([1280, 200]);
    warningText13.guideLayer = true;
    
    var warningTextDoc13 = warningText13.property("Source Text").value;
    warningTextDoc13.fontSize = 32;
    warningTextDoc13.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc13.font = "Arial-BoldMT";
    warningTextDoc13.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText13.property("Source Text").setValue(warningTextDoc13);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText13 = planComp13.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00013");
    errorText13.name = "ERROR_NO_SOURCE";
    errorText13.property("Transform").property("Position").setValue([1280, 720]);
    errorText13.guideLayer = true;
    
    var errorTextDoc13 = errorText13.property("Source Text").value;
    errorTextDoc13.fontSize = 48;
    errorTextDoc13.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc13.font = "Arial-BoldMT";
    errorTextDoc13.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText13.property("Source Text").setValue(errorTextDoc13);
}

planCompositions[13] = planComp13;


// Composition pour plan 00014
var planComp14 = project.items.addComp(
    "SQ01_UNDLM_00014_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp14.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer14 = planComp14.layers.add(bgSolidComp);
bgLayer14.name = "BG_SOLID";
bgLayer14.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer14 = false;
if (gradingSources[14]) {
    var gradedLayer14 = planComp14.layers.add(gradingSources[14]);
    gradedLayer14.name = "UNDLM_00014_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer14.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer14.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer14 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer14 = false;
if (editSources[14]) {
    var editLayer14 = planComp14.layers.add(editSources[14]);
    editLayer14.name = "UNDLM_00014_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer14.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer14.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer14 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity14 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer14) {
    // EDIT toujours activé quand disponible
    editLayer14.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer14) {
        gradedLayer14.enabled = false;
    }
} else if (hasGradedLayer14) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer14.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText14 = planComp14.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText14.name = "WARNING_NO_EDIT";
    warningText14.property("Transform").property("Position").setValue([1280, 200]);
    warningText14.guideLayer = true;
    
    var warningTextDoc14 = warningText14.property("Source Text").value;
    warningTextDoc14.fontSize = 32;
    warningTextDoc14.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc14.font = "Arial-BoldMT";
    warningTextDoc14.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText14.property("Source Text").setValue(warningTextDoc14);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText14 = planComp14.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00014");
    errorText14.name = "ERROR_NO_SOURCE";
    errorText14.property("Transform").property("Position").setValue([1280, 720]);
    errorText14.guideLayer = true;
    
    var errorTextDoc14 = errorText14.property("Source Text").value;
    errorTextDoc14.fontSize = 48;
    errorTextDoc14.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc14.font = "Arial-BoldMT";
    errorTextDoc14.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText14.property("Source Text").setValue(errorTextDoc14);
}

planCompositions[14] = planComp14;


// Composition pour plan 00015
var planComp15 = project.items.addComp(
    "SQ01_UNDLM_00015_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp15.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer15 = planComp15.layers.add(bgSolidComp);
bgLayer15.name = "BG_SOLID";
bgLayer15.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer15 = false;
if (gradingSources[15]) {
    var gradedLayer15 = planComp15.layers.add(gradingSources[15]);
    gradedLayer15.name = "UNDLM_00015_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer15.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer15.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer15 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer15 = false;
if (editSources[15]) {
    var editLayer15 = planComp15.layers.add(editSources[15]);
    editLayer15.name = "UNDLM_00015_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer15.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer15.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer15 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity15 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer15) {
    // EDIT toujours activé quand disponible
    editLayer15.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer15) {
        gradedLayer15.enabled = false;
    }
} else if (hasGradedLayer15) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer15.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText15 = planComp15.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText15.name = "WARNING_NO_EDIT";
    warningText15.property("Transform").property("Position").setValue([1280, 200]);
    warningText15.guideLayer = true;
    
    var warningTextDoc15 = warningText15.property("Source Text").value;
    warningTextDoc15.fontSize = 32;
    warningTextDoc15.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc15.font = "Arial-BoldMT";
    warningTextDoc15.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText15.property("Source Text").setValue(warningTextDoc15);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText15 = planComp15.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00015");
    errorText15.name = "ERROR_NO_SOURCE";
    errorText15.property("Transform").property("Position").setValue([1280, 720]);
    errorText15.guideLayer = true;
    
    var errorTextDoc15 = errorText15.property("Source Text").value;
    errorTextDoc15.fontSize = 48;
    errorTextDoc15.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc15.font = "Arial-BoldMT";
    errorTextDoc15.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText15.property("Source Text").setValue(errorTextDoc15);
}

planCompositions[15] = planComp15;


// Composition pour plan 00016
var planComp16 = project.items.addComp(
    "SQ01_UNDLM_00016_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp16.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer16 = planComp16.layers.add(bgSolidComp);
bgLayer16.name = "BG_SOLID";
bgLayer16.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer16 = false;
if (gradingSources[16]) {
    var gradedLayer16 = planComp16.layers.add(gradingSources[16]);
    gradedLayer16.name = "UNDLM_00016_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer16.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer16.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer16 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer16 = false;
if (editSources[16]) {
    var editLayer16 = planComp16.layers.add(editSources[16]);
    editLayer16.name = "UNDLM_00016_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer16.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer16.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer16 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity16 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer16) {
    // EDIT toujours activé quand disponible
    editLayer16.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer16) {
        gradedLayer16.enabled = false;
    }
} else if (hasGradedLayer16) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer16.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText16 = planComp16.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText16.name = "WARNING_NO_EDIT";
    warningText16.property("Transform").property("Position").setValue([1280, 200]);
    warningText16.guideLayer = true;
    
    var warningTextDoc16 = warningText16.property("Source Text").value;
    warningTextDoc16.fontSize = 32;
    warningTextDoc16.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc16.font = "Arial-BoldMT";
    warningTextDoc16.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText16.property("Source Text").setValue(warningTextDoc16);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText16 = planComp16.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00016");
    errorText16.name = "ERROR_NO_SOURCE";
    errorText16.property("Transform").property("Position").setValue([1280, 720]);
    errorText16.guideLayer = true;
    
    var errorTextDoc16 = errorText16.property("Source Text").value;
    errorTextDoc16.fontSize = 48;
    errorTextDoc16.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc16.font = "Arial-BoldMT";
    errorTextDoc16.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText16.property("Source Text").setValue(errorTextDoc16);
}

planCompositions[16] = planComp16;


// Composition pour plan 00017
var planComp17 = project.items.addComp(
    "SQ01_UNDLM_00017_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp17.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer17 = planComp17.layers.add(bgSolidComp);
bgLayer17.name = "BG_SOLID";
bgLayer17.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer17 = false;
if (gradingSources[17]) {
    var gradedLayer17 = planComp17.layers.add(gradingSources[17]);
    gradedLayer17.name = "UNDLM_00017_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer17.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer17.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer17 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer17 = false;
if (editSources[17]) {
    var editLayer17 = planComp17.layers.add(editSources[17]);
    editLayer17.name = "UNDLM_00017_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer17.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer17.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer17 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity17 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer17) {
    // EDIT toujours activé quand disponible
    editLayer17.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer17) {
        gradedLayer17.enabled = false;
    }
} else if (hasGradedLayer17) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer17.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText17 = planComp17.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText17.name = "WARNING_NO_EDIT";
    warningText17.property("Transform").property("Position").setValue([1280, 200]);
    warningText17.guideLayer = true;
    
    var warningTextDoc17 = warningText17.property("Source Text").value;
    warningTextDoc17.fontSize = 32;
    warningTextDoc17.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc17.font = "Arial-BoldMT";
    warningTextDoc17.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText17.property("Source Text").setValue(warningTextDoc17);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText17 = planComp17.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00017");
    errorText17.name = "ERROR_NO_SOURCE";
    errorText17.property("Transform").property("Position").setValue([1280, 720]);
    errorText17.guideLayer = true;
    
    var errorTextDoc17 = errorText17.property("Source Text").value;
    errorTextDoc17.fontSize = 48;
    errorTextDoc17.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc17.font = "Arial-BoldMT";
    errorTextDoc17.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText17.property("Source Text").setValue(errorTextDoc17);
}

planCompositions[17] = planComp17;


// Composition pour plan 00018
var planComp18 = project.items.addComp(
    "SQ01_UNDLM_00018_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp18.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer18 = planComp18.layers.add(bgSolidComp);
bgLayer18.name = "BG_SOLID";
bgLayer18.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer18 = false;
if (gradingSources[18]) {
    var gradedLayer18 = planComp18.layers.add(gradingSources[18]);
    gradedLayer18.name = "UNDLM_00018_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer18.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer18.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer18 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer18 = false;
if (editSources[18]) {
    var editLayer18 = planComp18.layers.add(editSources[18]);
    editLayer18.name = "UNDLM_00018_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer18.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer18.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer18 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity18 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer18) {
    // EDIT toujours activé quand disponible
    editLayer18.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer18) {
        gradedLayer18.enabled = false;
    }
} else if (hasGradedLayer18) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer18.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText18 = planComp18.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText18.name = "WARNING_NO_EDIT";
    warningText18.property("Transform").property("Position").setValue([1280, 200]);
    warningText18.guideLayer = true;
    
    var warningTextDoc18 = warningText18.property("Source Text").value;
    warningTextDoc18.fontSize = 32;
    warningTextDoc18.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc18.font = "Arial-BoldMT";
    warningTextDoc18.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText18.property("Source Text").setValue(warningTextDoc18);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText18 = planComp18.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00018");
    errorText18.name = "ERROR_NO_SOURCE";
    errorText18.property("Transform").property("Position").setValue([1280, 720]);
    errorText18.guideLayer = true;
    
    var errorTextDoc18 = errorText18.property("Source Text").value;
    errorTextDoc18.fontSize = 48;
    errorTextDoc18.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc18.font = "Arial-BoldMT";
    errorTextDoc18.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText18.property("Source Text").setValue(errorTextDoc18);
}

planCompositions[18] = planComp18;


// Composition pour plan 00019
var planComp19 = project.items.addComp(
    "SQ01_UNDLM_00019_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp19.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer19 = planComp19.layers.add(bgSolidComp);
bgLayer19.name = "BG_SOLID";
bgLayer19.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer19 = false;
if (gradingSources[19]) {
    var gradedLayer19 = planComp19.layers.add(gradingSources[19]);
    gradedLayer19.name = "UNDLM_00019_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer19.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer19.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer19 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer19 = false;
if (editSources[19]) {
    var editLayer19 = planComp19.layers.add(editSources[19]);
    editLayer19.name = "UNDLM_00019_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer19.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer19.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer19 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity19 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer19) {
    // EDIT toujours activé quand disponible
    editLayer19.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer19) {
        gradedLayer19.enabled = false;
    }
} else if (hasGradedLayer19) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer19.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText19 = planComp19.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText19.name = "WARNING_NO_EDIT";
    warningText19.property("Transform").property("Position").setValue([1280, 200]);
    warningText19.guideLayer = true;
    
    var warningTextDoc19 = warningText19.property("Source Text").value;
    warningTextDoc19.fontSize = 32;
    warningTextDoc19.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc19.font = "Arial-BoldMT";
    warningTextDoc19.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText19.property("Source Text").setValue(warningTextDoc19);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText19 = planComp19.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00019");
    errorText19.name = "ERROR_NO_SOURCE";
    errorText19.property("Transform").property("Position").setValue([1280, 720]);
    errorText19.guideLayer = true;
    
    var errorTextDoc19 = errorText19.property("Source Text").value;
    errorTextDoc19.fontSize = 48;
    errorTextDoc19.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc19.font = "Arial-BoldMT";
    errorTextDoc19.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText19.property("Source Text").setValue(errorTextDoc19);
}

planCompositions[19] = planComp19;


// Composition pour plan 00020
var planComp20 = project.items.addComp(
    "SQ01_UNDLM_00020_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.5600000000000005,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp20.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer20 = planComp20.layers.add(bgSolidComp);
bgLayer20.name = "BG_SOLID";
bgLayer20.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer20 = false;
if (gradingSources[20]) {
    var gradedLayer20 = planComp20.layers.add(gradingSources[20]);
    gradedLayer20.name = "UNDLM_00020_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer20.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer20.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer20 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer20 = false;
if (editSources[20]) {
    var editLayer20 = planComp20.layers.add(editSources[20]);
    editLayer20.name = "UNDLM_00020_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer20.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer20.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer20 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity20 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer20) {
    // EDIT toujours activé quand disponible
    editLayer20.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer20) {
        gradedLayer20.enabled = false;
    }
} else if (hasGradedLayer20) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer20.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText20 = planComp20.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText20.name = "WARNING_NO_EDIT";
    warningText20.property("Transform").property("Position").setValue([1280, 200]);
    warningText20.guideLayer = true;
    
    var warningTextDoc20 = warningText20.property("Source Text").value;
    warningTextDoc20.fontSize = 32;
    warningTextDoc20.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc20.font = "Arial-BoldMT";
    warningTextDoc20.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText20.property("Source Text").setValue(warningTextDoc20);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText20 = planComp20.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00020");
    errorText20.name = "ERROR_NO_SOURCE";
    errorText20.property("Transform").property("Position").setValue([1280, 720]);
    errorText20.guideLayer = true;
    
    var errorTextDoc20 = errorText20.property("Source Text").value;
    errorTextDoc20.fontSize = 48;
    errorTextDoc20.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc20.font = "Arial-BoldMT";
    errorTextDoc20.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText20.property("Source Text").setValue(errorTextDoc20);
}

planCompositions[20] = planComp20;


// Composition pour plan 00021
var planComp21 = project.items.addComp(
    "SQ01_UNDLM_00021_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.64,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp21.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer21 = planComp21.layers.add(bgSolidComp);
bgLayer21.name = "BG_SOLID";
bgLayer21.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer21 = false;
if (gradingSources[21]) {
    var gradedLayer21 = planComp21.layers.add(gradingSources[21]);
    gradedLayer21.name = "UNDLM_00021_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer21.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer21.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer21 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer21 = false;
if (editSources[21]) {
    var editLayer21 = planComp21.layers.add(editSources[21]);
    editLayer21.name = "UNDLM_00021_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer21.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer21.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer21 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity21 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer21) {
    // EDIT toujours activé quand disponible
    editLayer21.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer21) {
        gradedLayer21.enabled = false;
    }
} else if (hasGradedLayer21) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer21.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText21 = planComp21.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText21.name = "WARNING_NO_EDIT";
    warningText21.property("Transform").property("Position").setValue([1280, 200]);
    warningText21.guideLayer = true;
    
    var warningTextDoc21 = warningText21.property("Source Text").value;
    warningTextDoc21.fontSize = 32;
    warningTextDoc21.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc21.font = "Arial-BoldMT";
    warningTextDoc21.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText21.property("Source Text").setValue(warningTextDoc21);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText21 = planComp21.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00021");
    errorText21.name = "ERROR_NO_SOURCE";
    errorText21.property("Transform").property("Position").setValue([1280, 720]);
    errorText21.guideLayer = true;
    
    var errorTextDoc21 = errorText21.property("Source Text").value;
    errorTextDoc21.fontSize = 48;
    errorTextDoc21.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc21.font = "Arial-BoldMT";
    errorTextDoc21.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText21.property("Source Text").setValue(errorTextDoc21);
}

planCompositions[21] = planComp21;


// Composition pour plan 00022
var planComp22 = project.items.addComp(
    "SQ01_UNDLM_00022_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp22.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer22 = planComp22.layers.add(bgSolidComp);
bgLayer22.name = "BG_SOLID";
bgLayer22.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer22 = false;
if (gradingSources[22]) {
    var gradedLayer22 = planComp22.layers.add(gradingSources[22]);
    gradedLayer22.name = "UNDLM_00022_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer22.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer22.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer22 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer22 = false;
if (editSources[22]) {
    var editLayer22 = planComp22.layers.add(editSources[22]);
    editLayer22.name = "UNDLM_00022_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer22.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer22.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer22 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity22 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer22) {
    // EDIT toujours activé quand disponible
    editLayer22.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer22) {
        gradedLayer22.enabled = false;
    }
} else if (hasGradedLayer22) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer22.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText22 = planComp22.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText22.name = "WARNING_NO_EDIT";
    warningText22.property("Transform").property("Position").setValue([1280, 200]);
    warningText22.guideLayer = true;
    
    var warningTextDoc22 = warningText22.property("Source Text").value;
    warningTextDoc22.fontSize = 32;
    warningTextDoc22.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc22.font = "Arial-BoldMT";
    warningTextDoc22.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText22.property("Source Text").setValue(warningTextDoc22);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText22 = planComp22.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00022");
    errorText22.name = "ERROR_NO_SOURCE";
    errorText22.property("Transform").property("Position").setValue([1280, 720]);
    errorText22.guideLayer = true;
    
    var errorTextDoc22 = errorText22.property("Source Text").value;
    errorTextDoc22.fontSize = 48;
    errorTextDoc22.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc22.font = "Arial-BoldMT";
    errorTextDoc22.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText22.property("Source Text").setValue(errorTextDoc22);
}

planCompositions[22] = planComp22;


// Composition pour plan 00023
var planComp23 = project.items.addComp(
    "SQ01_UNDLM_00023_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp23.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer23 = planComp23.layers.add(bgSolidComp);
bgLayer23.name = "BG_SOLID";
bgLayer23.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer23 = false;
if (gradingSources[23]) {
    var gradedLayer23 = planComp23.layers.add(gradingSources[23]);
    gradedLayer23.name = "UNDLM_00023_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer23.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer23.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer23 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer23 = false;
if (editSources[23]) {
    var editLayer23 = planComp23.layers.add(editSources[23]);
    editLayer23.name = "UNDLM_00023_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer23.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer23.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer23 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity23 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer23) {
    // EDIT toujours activé quand disponible
    editLayer23.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer23) {
        gradedLayer23.enabled = false;
    }
} else if (hasGradedLayer23) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer23.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText23 = planComp23.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText23.name = "WARNING_NO_EDIT";
    warningText23.property("Transform").property("Position").setValue([1280, 200]);
    warningText23.guideLayer = true;
    
    var warningTextDoc23 = warningText23.property("Source Text").value;
    warningTextDoc23.fontSize = 32;
    warningTextDoc23.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc23.font = "Arial-BoldMT";
    warningTextDoc23.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText23.property("Source Text").setValue(warningTextDoc23);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText23 = planComp23.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00023");
    errorText23.name = "ERROR_NO_SOURCE";
    errorText23.property("Transform").property("Position").setValue([1280, 720]);
    errorText23.guideLayer = true;
    
    var errorTextDoc23 = errorText23.property("Source Text").value;
    errorTextDoc23.fontSize = 48;
    errorTextDoc23.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc23.font = "Arial-BoldMT";
    errorTextDoc23.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText23.property("Source Text").setValue(errorTextDoc23);
}

planCompositions[23] = planComp23;


// Composition pour plan 00024
var planComp24 = project.items.addComp(
    "SQ01_UNDLM_00024_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp24.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer24 = planComp24.layers.add(bgSolidComp);
bgLayer24.name = "BG_SOLID";
bgLayer24.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer24 = false;
if (gradingSources[24]) {
    var gradedLayer24 = planComp24.layers.add(gradingSources[24]);
    gradedLayer24.name = "UNDLM_00024_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer24.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer24.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer24 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer24 = false;
if (editSources[24]) {
    var editLayer24 = planComp24.layers.add(editSources[24]);
    editLayer24.name = "UNDLM_00024_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer24.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer24.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer24 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity24 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer24) {
    // EDIT toujours activé quand disponible
    editLayer24.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer24) {
        gradedLayer24.enabled = false;
    }
} else if (hasGradedLayer24) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer24.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText24 = planComp24.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText24.name = "WARNING_NO_EDIT";
    warningText24.property("Transform").property("Position").setValue([1280, 200]);
    warningText24.guideLayer = true;
    
    var warningTextDoc24 = warningText24.property("Source Text").value;
    warningTextDoc24.fontSize = 32;
    warningTextDoc24.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc24.font = "Arial-BoldMT";
    warningTextDoc24.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText24.property("Source Text").setValue(warningTextDoc24);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText24 = planComp24.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00024");
    errorText24.name = "ERROR_NO_SOURCE";
    errorText24.property("Transform").property("Position").setValue([1280, 720]);
    errorText24.guideLayer = true;
    
    var errorTextDoc24 = errorText24.property("Source Text").value;
    errorTextDoc24.fontSize = 48;
    errorTextDoc24.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc24.font = "Arial-BoldMT";
    errorTextDoc24.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText24.property("Source Text").setValue(errorTextDoc24);
}

planCompositions[24] = planComp24;


// Composition pour plan 00025
var planComp25 = project.items.addComp(
    "SQ01_UNDLM_00025_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp25.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer25 = planComp25.layers.add(bgSolidComp);
bgLayer25.name = "BG_SOLID";
bgLayer25.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer25 = false;
if (gradingSources[25]) {
    var gradedLayer25 = planComp25.layers.add(gradingSources[25]);
    gradedLayer25.name = "UNDLM_00025_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer25.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer25.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer25 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer25 = false;
if (editSources[25]) {
    var editLayer25 = planComp25.layers.add(editSources[25]);
    editLayer25.name = "UNDLM_00025_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer25.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer25.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer25 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity25 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer25) {
    // EDIT toujours activé quand disponible
    editLayer25.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer25) {
        gradedLayer25.enabled = false;
    }
} else if (hasGradedLayer25) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer25.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText25 = planComp25.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText25.name = "WARNING_NO_EDIT";
    warningText25.property("Transform").property("Position").setValue([1280, 200]);
    warningText25.guideLayer = true;
    
    var warningTextDoc25 = warningText25.property("Source Text").value;
    warningTextDoc25.fontSize = 32;
    warningTextDoc25.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc25.font = "Arial-BoldMT";
    warningTextDoc25.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText25.property("Source Text").setValue(warningTextDoc25);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText25 = planComp25.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00025");
    errorText25.name = "ERROR_NO_SOURCE";
    errorText25.property("Transform").property("Position").setValue([1280, 720]);
    errorText25.guideLayer = true;
    
    var errorTextDoc25 = errorText25.property("Source Text").value;
    errorTextDoc25.fontSize = 48;
    errorTextDoc25.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc25.font = "Arial-BoldMT";
    errorTextDoc25.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText25.property("Source Text").setValue(errorTextDoc25);
}

planCompositions[25] = planComp25;


// Composition pour plan 00026
var planComp26 = project.items.addComp(
    "SQ01_UNDLM_00026_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp26.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer26 = planComp26.layers.add(bgSolidComp);
bgLayer26.name = "BG_SOLID";
bgLayer26.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer26 = false;
if (gradingSources[26]) {
    var gradedLayer26 = planComp26.layers.add(gradingSources[26]);
    gradedLayer26.name = "UNDLM_00026_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer26.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer26.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer26 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer26 = false;
if (editSources[26]) {
    var editLayer26 = planComp26.layers.add(editSources[26]);
    editLayer26.name = "UNDLM_00026_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer26.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer26.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer26 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity26 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer26) {
    // EDIT toujours activé quand disponible
    editLayer26.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer26) {
        gradedLayer26.enabled = false;
    }
} else if (hasGradedLayer26) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer26.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText26 = planComp26.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText26.name = "WARNING_NO_EDIT";
    warningText26.property("Transform").property("Position").setValue([1280, 200]);
    warningText26.guideLayer = true;
    
    var warningTextDoc26 = warningText26.property("Source Text").value;
    warningTextDoc26.fontSize = 32;
    warningTextDoc26.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc26.font = "Arial-BoldMT";
    warningTextDoc26.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText26.property("Source Text").setValue(warningTextDoc26);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText26 = planComp26.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00026");
    errorText26.name = "ERROR_NO_SOURCE";
    errorText26.property("Transform").property("Position").setValue([1280, 720]);
    errorText26.guideLayer = true;
    
    var errorTextDoc26 = errorText26.property("Source Text").value;
    errorTextDoc26.fontSize = 48;
    errorTextDoc26.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc26.font = "Arial-BoldMT";
    errorTextDoc26.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText26.property("Source Text").setValue(errorTextDoc26);
}

planCompositions[26] = planComp26;


// Composition pour plan 00027
var planComp27 = project.items.addComp(
    "SQ01_UNDLM_00027_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp27.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer27 = planComp27.layers.add(bgSolidComp);
bgLayer27.name = "BG_SOLID";
bgLayer27.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer27 = false;
if (gradingSources[27]) {
    var gradedLayer27 = planComp27.layers.add(gradingSources[27]);
    gradedLayer27.name = "UNDLM_00027_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer27.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer27.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer27 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer27 = false;
if (editSources[27]) {
    var editLayer27 = planComp27.layers.add(editSources[27]);
    editLayer27.name = "UNDLM_00027_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer27.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer27.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer27 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity27 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer27) {
    // EDIT toujours activé quand disponible
    editLayer27.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer27) {
        gradedLayer27.enabled = false;
    }
} else if (hasGradedLayer27) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer27.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText27 = planComp27.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText27.name = "WARNING_NO_EDIT";
    warningText27.property("Transform").property("Position").setValue([1280, 200]);
    warningText27.guideLayer = true;
    
    var warningTextDoc27 = warningText27.property("Source Text").value;
    warningTextDoc27.fontSize = 32;
    warningTextDoc27.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc27.font = "Arial-BoldMT";
    warningTextDoc27.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText27.property("Source Text").setValue(warningTextDoc27);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText27 = planComp27.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00027");
    errorText27.name = "ERROR_NO_SOURCE";
    errorText27.property("Transform").property("Position").setValue([1280, 720]);
    errorText27.guideLayer = true;
    
    var errorTextDoc27 = errorText27.property("Source Text").value;
    errorTextDoc27.fontSize = 48;
    errorTextDoc27.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc27.font = "Arial-BoldMT";
    errorTextDoc27.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText27.property("Source Text").setValue(errorTextDoc27);
}

planCompositions[27] = planComp27;


// Composition pour plan 00028
var planComp28 = project.items.addComp(
    "SQ01_UNDLM_00028_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp28.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer28 = planComp28.layers.add(bgSolidComp);
bgLayer28.name = "BG_SOLID";
bgLayer28.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer28 = false;
if (gradingSources[28]) {
    var gradedLayer28 = planComp28.layers.add(gradingSources[28]);
    gradedLayer28.name = "UNDLM_00028_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer28.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer28.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer28 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer28 = false;
if (editSources[28]) {
    var editLayer28 = planComp28.layers.add(editSources[28]);
    editLayer28.name = "UNDLM_00028_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer28.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer28.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer28 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity28 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer28) {
    // EDIT toujours activé quand disponible
    editLayer28.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer28) {
        gradedLayer28.enabled = false;
    }
} else if (hasGradedLayer28) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer28.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText28 = planComp28.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText28.name = "WARNING_NO_EDIT";
    warningText28.property("Transform").property("Position").setValue([1280, 200]);
    warningText28.guideLayer = true;
    
    var warningTextDoc28 = warningText28.property("Source Text").value;
    warningTextDoc28.fontSize = 32;
    warningTextDoc28.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc28.font = "Arial-BoldMT";
    warningTextDoc28.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText28.property("Source Text").setValue(warningTextDoc28);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText28 = planComp28.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00028");
    errorText28.name = "ERROR_NO_SOURCE";
    errorText28.property("Transform").property("Position").setValue([1280, 720]);
    errorText28.guideLayer = true;
    
    var errorTextDoc28 = errorText28.property("Source Text").value;
    errorTextDoc28.fontSize = 48;
    errorTextDoc28.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc28.font = "Arial-BoldMT";
    errorTextDoc28.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText28.property("Source Text").setValue(errorTextDoc28);
}

planCompositions[28] = planComp28;


// Composition pour plan 00029
var planComp29 = project.items.addComp(
    "SQ01_UNDLM_00029_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp29.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer29 = planComp29.layers.add(bgSolidComp);
bgLayer29.name = "BG_SOLID";
bgLayer29.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer29 = false;
if (gradingSources[29]) {
    var gradedLayer29 = planComp29.layers.add(gradingSources[29]);
    gradedLayer29.name = "UNDLM_00029_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer29.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer29.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer29 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer29 = false;
if (editSources[29]) {
    var editLayer29 = planComp29.layers.add(editSources[29]);
    editLayer29.name = "UNDLM_00029_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer29.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer29.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer29 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity29 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer29) {
    // EDIT toujours activé quand disponible
    editLayer29.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer29) {
        gradedLayer29.enabled = false;
    }
} else if (hasGradedLayer29) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer29.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText29 = planComp29.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText29.name = "WARNING_NO_EDIT";
    warningText29.property("Transform").property("Position").setValue([1280, 200]);
    warningText29.guideLayer = true;
    
    var warningTextDoc29 = warningText29.property("Source Text").value;
    warningTextDoc29.fontSize = 32;
    warningTextDoc29.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc29.font = "Arial-BoldMT";
    warningTextDoc29.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText29.property("Source Text").setValue(warningTextDoc29);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText29 = planComp29.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00029");
    errorText29.name = "ERROR_NO_SOURCE";
    errorText29.property("Transform").property("Position").setValue([1280, 720]);
    errorText29.guideLayer = true;
    
    var errorTextDoc29 = errorText29.property("Source Text").value;
    errorTextDoc29.fontSize = 48;
    errorTextDoc29.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc29.font = "Arial-BoldMT";
    errorTextDoc29.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText29.property("Source Text").setValue(errorTextDoc29);
}

planCompositions[29] = planComp29;


// Composition pour plan 00030
var planComp30 = project.items.addComp(
    "SQ01_UNDLM_00030_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp30.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer30 = planComp30.layers.add(bgSolidComp);
bgLayer30.name = "BG_SOLID";
bgLayer30.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer30 = false;
if (gradingSources[30]) {
    var gradedLayer30 = planComp30.layers.add(gradingSources[30]);
    gradedLayer30.name = "UNDLM_00030_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer30.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer30.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer30 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer30 = false;
if (editSources[30]) {
    var editLayer30 = planComp30.layers.add(editSources[30]);
    editLayer30.name = "UNDLM_00030_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer30.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer30.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer30 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity30 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer30) {
    // EDIT toujours activé quand disponible
    editLayer30.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer30) {
        gradedLayer30.enabled = false;
    }
} else if (hasGradedLayer30) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer30.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText30 = planComp30.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText30.name = "WARNING_NO_EDIT";
    warningText30.property("Transform").property("Position").setValue([1280, 200]);
    warningText30.guideLayer = true;
    
    var warningTextDoc30 = warningText30.property("Source Text").value;
    warningTextDoc30.fontSize = 32;
    warningTextDoc30.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc30.font = "Arial-BoldMT";
    warningTextDoc30.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText30.property("Source Text").setValue(warningTextDoc30);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText30 = planComp30.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00030");
    errorText30.name = "ERROR_NO_SOURCE";
    errorText30.property("Transform").property("Position").setValue([1280, 720]);
    errorText30.guideLayer = true;
    
    var errorTextDoc30 = errorText30.property("Source Text").value;
    errorTextDoc30.fontSize = 48;
    errorTextDoc30.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc30.font = "Arial-BoldMT";
    errorTextDoc30.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText30.property("Source Text").setValue(errorTextDoc30);
}

planCompositions[30] = planComp30;


// Composition pour plan 00031
var planComp31 = project.items.addComp(
    "SQ01_UNDLM_00031_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp31.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer31 = planComp31.layers.add(bgSolidComp);
bgLayer31.name = "BG_SOLID";
bgLayer31.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer31 = false;
if (gradingSources[31]) {
    var gradedLayer31 = planComp31.layers.add(gradingSources[31]);
    gradedLayer31.name = "UNDLM_00031_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer31.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer31.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer31 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer31 = false;
if (editSources[31]) {
    var editLayer31 = planComp31.layers.add(editSources[31]);
    editLayer31.name = "UNDLM_00031_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer31.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer31.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer31 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity31 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer31) {
    // EDIT toujours activé quand disponible
    editLayer31.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer31) {
        gradedLayer31.enabled = false;
    }
} else if (hasGradedLayer31) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer31.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText31 = planComp31.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText31.name = "WARNING_NO_EDIT";
    warningText31.property("Transform").property("Position").setValue([1280, 200]);
    warningText31.guideLayer = true;
    
    var warningTextDoc31 = warningText31.property("Source Text").value;
    warningTextDoc31.fontSize = 32;
    warningTextDoc31.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc31.font = "Arial-BoldMT";
    warningTextDoc31.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText31.property("Source Text").setValue(warningTextDoc31);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText31 = planComp31.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00031");
    errorText31.name = "ERROR_NO_SOURCE";
    errorText31.property("Transform").property("Position").setValue([1280, 720]);
    errorText31.guideLayer = true;
    
    var errorTextDoc31 = errorText31.property("Source Text").value;
    errorTextDoc31.fontSize = 48;
    errorTextDoc31.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc31.font = "Arial-BoldMT";
    errorTextDoc31.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText31.property("Source Text").setValue(errorTextDoc31);
}

planCompositions[31] = planComp31;


// Composition pour plan 00032
var planComp32 = project.items.addComp(
    "SQ01_UNDLM_00032_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp32.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer32 = planComp32.layers.add(bgSolidComp);
bgLayer32.name = "BG_SOLID";
bgLayer32.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer32 = false;
if (gradingSources[32]) {
    var gradedLayer32 = planComp32.layers.add(gradingSources[32]);
    gradedLayer32.name = "UNDLM_00032_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer32.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer32.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer32 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer32 = false;
if (editSources[32]) {
    var editLayer32 = planComp32.layers.add(editSources[32]);
    editLayer32.name = "UNDLM_00032_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer32.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer32.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer32 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity32 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer32) {
    // EDIT toujours activé quand disponible
    editLayer32.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer32) {
        gradedLayer32.enabled = false;
    }
} else if (hasGradedLayer32) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer32.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText32 = planComp32.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText32.name = "WARNING_NO_EDIT";
    warningText32.property("Transform").property("Position").setValue([1280, 200]);
    warningText32.guideLayer = true;
    
    var warningTextDoc32 = warningText32.property("Source Text").value;
    warningTextDoc32.fontSize = 32;
    warningTextDoc32.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc32.font = "Arial-BoldMT";
    warningTextDoc32.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText32.property("Source Text").setValue(warningTextDoc32);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText32 = planComp32.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00032");
    errorText32.name = "ERROR_NO_SOURCE";
    errorText32.property("Transform").property("Position").setValue([1280, 720]);
    errorText32.guideLayer = true;
    
    var errorTextDoc32 = errorText32.property("Source Text").value;
    errorTextDoc32.fontSize = 48;
    errorTextDoc32.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc32.font = "Arial-BoldMT";
    errorTextDoc32.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText32.property("Source Text").setValue(errorTextDoc32);
}

planCompositions[32] = planComp32;


// Composition pour plan 00033
var planComp33 = project.items.addComp(
    "SQ01_UNDLM_00033_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp33.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer33 = planComp33.layers.add(bgSolidComp);
bgLayer33.name = "BG_SOLID";
bgLayer33.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer33 = false;
if (gradingSources[33]) {
    var gradedLayer33 = planComp33.layers.add(gradingSources[33]);
    gradedLayer33.name = "UNDLM_00033_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer33.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer33.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer33 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer33 = false;
if (editSources[33]) {
    var editLayer33 = planComp33.layers.add(editSources[33]);
    editLayer33.name = "UNDLM_00033_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer33.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer33.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer33 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity33 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer33) {
    // EDIT toujours activé quand disponible
    editLayer33.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer33) {
        gradedLayer33.enabled = false;
    }
} else if (hasGradedLayer33) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer33.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText33 = planComp33.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText33.name = "WARNING_NO_EDIT";
    warningText33.property("Transform").property("Position").setValue([1280, 200]);
    warningText33.guideLayer = true;
    
    var warningTextDoc33 = warningText33.property("Source Text").value;
    warningTextDoc33.fontSize = 32;
    warningTextDoc33.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc33.font = "Arial-BoldMT";
    warningTextDoc33.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText33.property("Source Text").setValue(warningTextDoc33);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText33 = planComp33.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00033");
    errorText33.name = "ERROR_NO_SOURCE";
    errorText33.property("Transform").property("Position").setValue([1280, 720]);
    errorText33.guideLayer = true;
    
    var errorTextDoc33 = errorText33.property("Source Text").value;
    errorTextDoc33.fontSize = 48;
    errorTextDoc33.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc33.font = "Arial-BoldMT";
    errorTextDoc33.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText33.property("Source Text").setValue(errorTextDoc33);
}

planCompositions[33] = planComp33;


// Composition pour plan 00034
var planComp34 = project.items.addComp(
    "SQ01_UNDLM_00034_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp34.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer34 = planComp34.layers.add(bgSolidComp);
bgLayer34.name = "BG_SOLID";
bgLayer34.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer34 = false;
if (gradingSources[34]) {
    var gradedLayer34 = planComp34.layers.add(gradingSources[34]);
    gradedLayer34.name = "UNDLM_00034_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer34.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer34.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer34 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer34 = false;
if (editSources[34]) {
    var editLayer34 = planComp34.layers.add(editSources[34]);
    editLayer34.name = "UNDLM_00034_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer34.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer34.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer34 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity34 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer34) {
    // EDIT toujours activé quand disponible
    editLayer34.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer34) {
        gradedLayer34.enabled = false;
    }
} else if (hasGradedLayer34) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer34.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText34 = planComp34.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText34.name = "WARNING_NO_EDIT";
    warningText34.property("Transform").property("Position").setValue([1280, 200]);
    warningText34.guideLayer = true;
    
    var warningTextDoc34 = warningText34.property("Source Text").value;
    warningTextDoc34.fontSize = 32;
    warningTextDoc34.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc34.font = "Arial-BoldMT";
    warningTextDoc34.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText34.property("Source Text").setValue(warningTextDoc34);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText34 = planComp34.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00034");
    errorText34.name = "ERROR_NO_SOURCE";
    errorText34.property("Transform").property("Position").setValue([1280, 720]);
    errorText34.guideLayer = true;
    
    var errorTextDoc34 = errorText34.property("Source Text").value;
    errorTextDoc34.fontSize = 48;
    errorTextDoc34.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc34.font = "Arial-BoldMT";
    errorTextDoc34.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText34.property("Source Text").setValue(errorTextDoc34);
}

planCompositions[34] = planComp34;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ01_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    176.19999999999996, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00001 à la timeline master
if (planCompositions[1]) {
    var masterLayer1 = masterComp.layers.add(planCompositions[1]);
    masterLayer1.startTime = 0;
    masterLayer1.name = "UNDLM_00001";
    masterLayer1.label = 1; // Couleurs alternées
}

// Ajouter plan 00002 à la timeline master
if (planCompositions[2]) {
    var masterLayer2 = masterComp.layers.add(planCompositions[2]);
    masterLayer2.startTime = 9.12;
    masterLayer2.name = "UNDLM_00002";
    masterLayer2.label = 2; // Couleurs alternées
}

// Ajouter plan 00003 à la timeline master
if (planCompositions[3]) {
    var masterLayer3 = masterComp.layers.add(planCompositions[3]);
    masterLayer3.startTime = 14.079999999999998;
    masterLayer3.name = "UNDLM_00003";
    masterLayer3.label = 3; // Couleurs alternées
}

// Ajouter plan 00004 à la timeline master
if (planCompositions[4]) {
    var masterLayer4 = masterComp.layers.add(planCompositions[4]);
    masterLayer4.startTime = 18.0;
    masterLayer4.name = "UNDLM_00004";
    masterLayer4.label = 4; // Couleurs alternées
}

// Ajouter plan 00005 à la timeline master
if (planCompositions[5]) {
    var masterLayer5 = masterComp.layers.add(planCompositions[5]);
    masterLayer5.startTime = 19.08;
    masterLayer5.name = "UNDLM_00005";
    masterLayer5.label = 5; // Couleurs alternées
}

// Ajouter plan 00006 à la timeline master
if (planCompositions[6]) {
    var masterLayer6 = masterComp.layers.add(planCompositions[6]);
    masterLayer6.startTime = 20.479999999999997;
    masterLayer6.name = "UNDLM_00006";
    masterLayer6.label = 6; // Couleurs alternées
}

// Ajouter plan 00007 à la timeline master
if (planCompositions[7]) {
    var masterLayer7 = masterComp.layers.add(planCompositions[7]);
    masterLayer7.startTime = 22.279999999999998;
    masterLayer7.name = "UNDLM_00007";
    masterLayer7.label = 7; // Couleurs alternées
}

// Ajouter plan 00008 à la timeline master
if (planCompositions[8]) {
    var masterLayer8 = masterComp.layers.add(planCompositions[8]);
    masterLayer8.startTime = 23.88;
    masterLayer8.name = "UNDLM_00008";
    masterLayer8.label = 8; // Couleurs alternées
}

// Ajouter plan 00009 à la timeline master
if (planCompositions[9]) {
    var masterLayer9 = masterComp.layers.add(planCompositions[9]);
    masterLayer9.startTime = 24.56;
    masterLayer9.name = "UNDLM_00009";
    masterLayer9.label = 9; // Couleurs alternées
}

// Ajouter plan 00010 à la timeline master
if (planCompositions[10]) {
    var masterLayer10 = masterComp.layers.add(planCompositions[10]);
    masterLayer10.startTime = 29.119999999999997;
    masterLayer10.name = "UNDLM_00010";
    masterLayer10.label = 10; // Couleurs alternées
}

// Ajouter plan 00011 à la timeline master
if (planCompositions[11]) {
    var masterLayer11 = masterComp.layers.add(planCompositions[11]);
    masterLayer11.startTime = 31.72;
    masterLayer11.name = "UNDLM_00011";
    masterLayer11.label = 11; // Couleurs alternées
}

// Ajouter plan 00012 à la timeline master
if (planCompositions[12]) {
    var masterLayer12 = masterComp.layers.add(planCompositions[12]);
    masterLayer12.startTime = 35.48;
    masterLayer12.name = "UNDLM_00012";
    masterLayer12.label = 12; // Couleurs alternées
}

// Ajouter plan 00013 à la timeline master
if (planCompositions[13]) {
    var masterLayer13 = masterComp.layers.add(planCompositions[13]);
    masterLayer13.startTime = 39.199999999999996;
    masterLayer13.name = "UNDLM_00013";
    masterLayer13.label = 13; // Couleurs alternées
}

// Ajouter plan 00014 à la timeline master
if (planCompositions[14]) {
    var masterLayer14 = masterComp.layers.add(planCompositions[14]);
    masterLayer14.startTime = 44.99999999999999;
    masterLayer14.name = "UNDLM_00014";
    masterLayer14.label = 14; // Couleurs alternées
}

// Ajouter plan 00015 à la timeline master
if (planCompositions[15]) {
    var masterLayer15 = masterComp.layers.add(planCompositions[15]);
    masterLayer15.startTime = 47.43999999999999;
    masterLayer15.name = "UNDLM_00015";
    masterLayer15.label = 15; // Couleurs alternées
}

// Ajouter plan 00016 à la timeline master
if (planCompositions[16]) {
    var masterLayer16 = masterComp.layers.add(planCompositions[16]);
    masterLayer16.startTime = 49.87999999999999;
    masterLayer16.name = "UNDLM_00016";
    masterLayer16.label = 16; // Couleurs alternées
}

// Ajouter plan 00017 à la timeline master
if (planCompositions[17]) {
    var masterLayer17 = masterComp.layers.add(planCompositions[17]);
    masterLayer17.startTime = 53.83999999999999;
    masterLayer17.name = "UNDLM_00017";
    masterLayer17.label = 1; // Couleurs alternées
}

// Ajouter plan 00018 à la timeline master
if (planCompositions[18]) {
    var masterLayer18 = masterComp.layers.add(planCompositions[18]);
    masterLayer18.startTime = 57.27999999999999;
    masterLayer18.name = "UNDLM_00018";
    masterLayer18.label = 2; // Couleurs alternées
}

// Ajouter plan 00019 à la timeline master
if (planCompositions[19]) {
    var masterLayer19 = masterComp.layers.add(planCompositions[19]);
    masterLayer19.startTime = 66.23999999999998;
    masterLayer19.name = "UNDLM_00019";
    masterLayer19.label = 3; // Couleurs alternées
}

// Ajouter plan 00020 à la timeline master
if (planCompositions[20]) {
    var masterLayer20 = masterComp.layers.add(planCompositions[20]);
    masterLayer20.startTime = 74.51999999999998;
    masterLayer20.name = "UNDLM_00020";
    masterLayer20.label = 4; // Couleurs alternées
}

// Ajouter plan 00021 à la timeline master
if (planCompositions[21]) {
    var masterLayer21 = masterComp.layers.add(planCompositions[21]);
    masterLayer21.startTime = 81.07999999999998;
    masterLayer21.name = "UNDLM_00021";
    masterLayer21.label = 5; // Couleurs alternées
}

// Ajouter plan 00022 à la timeline master
if (planCompositions[22]) {
    var masterLayer22 = masterComp.layers.add(planCompositions[22]);
    masterLayer22.startTime = 87.71999999999998;
    masterLayer22.name = "UNDLM_00022";
    masterLayer22.label = 6; // Couleurs alternées
}

// Ajouter plan 00023 à la timeline master
if (planCompositions[23]) {
    var masterLayer23 = masterComp.layers.add(planCompositions[23]);
    masterLayer23.startTime = 96.59999999999998;
    masterLayer23.name = "UNDLM_00023";
    masterLayer23.label = 7; // Couleurs alternées
}

// Ajouter plan 00024 à la timeline master
if (planCompositions[24]) {
    var masterLayer24 = masterComp.layers.add(planCompositions[24]);
    masterLayer24.startTime = 107.47999999999998;
    masterLayer24.name = "UNDLM_00024";
    masterLayer24.label = 8; // Couleurs alternées
}

// Ajouter plan 00025 à la timeline master
if (planCompositions[25]) {
    var masterLayer25 = masterComp.layers.add(planCompositions[25]);
    masterLayer25.startTime = 113.83999999999997;
    masterLayer25.name = "UNDLM_00025";
    masterLayer25.label = 9; // Couleurs alternées
}

// Ajouter plan 00026 à la timeline master
if (planCompositions[26]) {
    var masterLayer26 = masterComp.layers.add(planCompositions[26]);
    masterLayer26.startTime = 123.79999999999998;
    masterLayer26.name = "UNDLM_00026";
    masterLayer26.label = 10; // Couleurs alternées
}

// Ajouter plan 00027 à la timeline master
if (planCompositions[27]) {
    var masterLayer27 = masterComp.layers.add(planCompositions[27]);
    masterLayer27.startTime = 128.92;
    masterLayer27.name = "UNDLM_00027";
    masterLayer27.label = 11; // Couleurs alternées
}

// Ajouter plan 00028 à la timeline master
if (planCompositions[28]) {
    var masterLayer28 = masterComp.layers.add(planCompositions[28]);
    masterLayer28.startTime = 133.39999999999998;
    masterLayer28.name = "UNDLM_00028";
    masterLayer28.label = 12; // Couleurs alternées
}

// Ajouter plan 00029 à la timeline master
if (planCompositions[29]) {
    var masterLayer29 = masterComp.layers.add(planCompositions[29]);
    masterLayer29.startTime = 137.2;
    masterLayer29.name = "UNDLM_00029";
    masterLayer29.label = 13; // Couleurs alternées
}

// Ajouter plan 00030 à la timeline master
if (planCompositions[30]) {
    var masterLayer30 = masterComp.layers.add(planCompositions[30]);
    masterLayer30.startTime = 144.48;
    masterLayer30.name = "UNDLM_00030";
    masterLayer30.label = 14; // Couleurs alternées
}

// Ajouter plan 00031 à la timeline master
if (planCompositions[31]) {
    var masterLayer31 = masterComp.layers.add(planCompositions[31]);
    masterLayer31.startTime = 148.88;
    masterLayer31.name = "UNDLM_00031";
    masterLayer31.label = 15; // Couleurs alternées
}

// Ajouter plan 00032 à la timeline master
if (planCompositions[32]) {
    var masterLayer32 = masterComp.layers.add(planCompositions[32]);
    masterLayer32.startTime = 155.07999999999998;
    masterLayer32.name = "UNDLM_00032";
    masterLayer32.label = 16; // Couleurs alternées
}

// Ajouter plan 00033 à la timeline master
if (planCompositions[33]) {
    var masterLayer33 = masterComp.layers.add(planCompositions[33]);
    masterLayer33.startTime = 160.99999999999997;
    masterLayer33.name = "UNDLM_00033";
    masterLayer33.label = 1; // Couleurs alternées
}

// Ajouter plan 00034 à la timeline master
if (planCompositions[34]) {
    var masterLayer34 = masterComp.layers.add(planCompositions[34]);
    masterLayer34.startTime = 165.59999999999997;
    masterLayer34.name = "UNDLM_00034";
    masterLayer34.label = 2; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ01";\n' +
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
    {start: 0, end: 9.12, name: "UNDLM_00001"},
    {start: 9.12, end: 14.079999999999998, name: "UNDLM_00002"},
    {start: 14.079999999999998, end: 18.0, name: "UNDLM_00003"},
    {start: 18.0, end: 19.08, name: "UNDLM_00004"},
    {start: 19.08, end: 20.479999999999997, name: "UNDLM_00005"},
    {start: 20.479999999999997, end: 22.279999999999998, name: "UNDLM_00006"},
    {start: 22.279999999999998, end: 23.88, name: "UNDLM_00007"},
    {start: 23.88, end: 24.56, name: "UNDLM_00008"},
    {start: 24.56, end: 29.119999999999997, name: "UNDLM_00009"},
    {start: 29.119999999999997, end: 31.72, name: "UNDLM_00010"},
    {start: 31.72, end: 35.48, name: "UNDLM_00011"},
    {start: 35.48, end: 39.199999999999996, name: "UNDLM_00012"},
    {start: 39.199999999999996, end: 44.99999999999999, name: "UNDLM_00013"},
    {start: 44.99999999999999, end: 47.43999999999999, name: "UNDLM_00014"},
    {start: 47.43999999999999, end: 49.87999999999999, name: "UNDLM_00015"},
    {start: 49.87999999999999, end: 53.83999999999999, name: "UNDLM_00016"},
    {start: 53.83999999999999, end: 57.27999999999999, name: "UNDLM_00017"},
    {start: 57.27999999999999, end: 66.23999999999998, name: "UNDLM_00018"},
    {start: 66.23999999999998, end: 74.51999999999998, name: "UNDLM_00019"},
    {start: 74.51999999999998, end: 81.07999999999998, name: "UNDLM_00020"},
    {start: 81.07999999999998, end: 87.71999999999998, name: "UNDLM_00021"},
    {start: 87.71999999999998, end: 96.59999999999998, name: "UNDLM_00022"},
    {start: 96.59999999999998, end: 107.47999999999998, name: "UNDLM_00023"},
    {start: 107.47999999999998, end: 113.83999999999997, name: "UNDLM_00024"},
    {start: 113.83999999999997, end: 123.79999999999998, name: "UNDLM_00025"},
    {start: 123.79999999999998, end: 128.92, name: "UNDLM_00026"},
    {start: 128.92, end: 133.39999999999998, name: "UNDLM_00027"},
    {start: 133.39999999999998, end: 137.2, name: "UNDLM_00028"},
    {start: 137.2, end: 144.48, name: "UNDLM_00029"},
    {start: 144.48, end: 148.88, name: "UNDLM_00030"},
    {start: 148.88, end: 155.07999999999998, name: "UNDLM_00031"},
    {start: 155.07999999999998, end: 160.99999999999997, name: "UNDLM_00032"},
    {start: 160.99999999999997, end: 165.59999999999997, name: "UNDLM_00033"},
    {start: 165.59999999999997, end: 176.19999999999996, name: "UNDLM_00034"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ01/_AE/SQ01_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 34;
var totalCount = 34;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ01 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(176.19999999999996 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ01_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ01:" + totalCount + ":" + gradedCount);
