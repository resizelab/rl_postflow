
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ19 avec 16 plans
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


// Import plan EDIT 00318
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile318 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00318.mov");
var editFilePoignees318 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00318_AVEC_POIGNEES.mov");
var editFileBis318 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00318bis.mov");

var importSuccess318 = false;
var fileName318 = "";

// Tenter import standard
if (editFile318.exists) {
    try {
        var editFootage318 = project.importFile(new ImportOptions(editFile318));
        editFootage318.parentFolder = fromEditFolder;
        editFootage318.name = "UNDLM_00318";
        editSources[318] = editFootage318;
        editImportCount++;
        importSuccess318 = true;
        fileName318 = "UNDLM_00318.mov";
        logImportSuccess(318, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00318.mov", fileName318);
    } catch (e) {
        logImportError(318, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00318.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess318 && editFilePoignees318.exists) {
    try {
        var editFootage318 = project.importFile(new ImportOptions(editFilePoignees318));
        editFootage318.parentFolder = fromEditFolder;
        editFootage318.name = "UNDLM_00318_AVEC_POIGNEES";
        editSources[318] = editFootage318;
        editImportCount++;
        importSuccess318 = true;
        fileName318 = "UNDLM_00318_AVEC_POIGNEES.mov";
        logImportSuccess(318, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00318_AVEC_POIGNEES.mov", fileName318);
    } catch (e) {
        logImportError(318, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00318_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess318 && editFileBis318.exists) {
    try {
        var editFootage318 = project.importFile(new ImportOptions(editFileBis318));
        editFootage318.parentFolder = fromEditFolder;
        editFootage318.name = "UNDLM_00318bis";
        editSources[318] = editFootage318;
        editImportCount++;
        importSuccess318 = true;
        fileName318 = "UNDLM_00318bis.mov";
        logImportSuccess(318, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00318bis.mov", fileName318);
    } catch (e) {
        logImportError(318, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00318bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess318) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00318.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00319
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile319 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00319.mov");
var editFilePoignees319 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00319_AVEC_POIGNEES.mov");
var editFileBis319 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00319bis.mov");

var importSuccess319 = false;
var fileName319 = "";

// Tenter import standard
if (editFile319.exists) {
    try {
        var editFootage319 = project.importFile(new ImportOptions(editFile319));
        editFootage319.parentFolder = fromEditFolder;
        editFootage319.name = "UNDLM_00319";
        editSources[319] = editFootage319;
        editImportCount++;
        importSuccess319 = true;
        fileName319 = "UNDLM_00319.mov";
        logImportSuccess(319, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00319.mov", fileName319);
    } catch (e) {
        logImportError(319, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00319.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess319 && editFilePoignees319.exists) {
    try {
        var editFootage319 = project.importFile(new ImportOptions(editFilePoignees319));
        editFootage319.parentFolder = fromEditFolder;
        editFootage319.name = "UNDLM_00319_AVEC_POIGNEES";
        editSources[319] = editFootage319;
        editImportCount++;
        importSuccess319 = true;
        fileName319 = "UNDLM_00319_AVEC_POIGNEES.mov";
        logImportSuccess(319, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00319_AVEC_POIGNEES.mov", fileName319);
    } catch (e) {
        logImportError(319, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00319_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess319 && editFileBis319.exists) {
    try {
        var editFootage319 = project.importFile(new ImportOptions(editFileBis319));
        editFootage319.parentFolder = fromEditFolder;
        editFootage319.name = "UNDLM_00319bis";
        editSources[319] = editFootage319;
        editImportCount++;
        importSuccess319 = true;
        fileName319 = "UNDLM_00319bis.mov";
        logImportSuccess(319, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00319bis.mov", fileName319);
    } catch (e) {
        logImportError(319, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00319bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess319) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00319.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00320
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile320 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00320.mov");
var editFilePoignees320 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00320_AVEC_POIGNEES.mov");
var editFileBis320 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00320bis.mov");

var importSuccess320 = false;
var fileName320 = "";

// Tenter import standard
if (editFile320.exists) {
    try {
        var editFootage320 = project.importFile(new ImportOptions(editFile320));
        editFootage320.parentFolder = fromEditFolder;
        editFootage320.name = "UNDLM_00320";
        editSources[320] = editFootage320;
        editImportCount++;
        importSuccess320 = true;
        fileName320 = "UNDLM_00320.mov";
        logImportSuccess(320, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00320.mov", fileName320);
    } catch (e) {
        logImportError(320, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00320.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess320 && editFilePoignees320.exists) {
    try {
        var editFootage320 = project.importFile(new ImportOptions(editFilePoignees320));
        editFootage320.parentFolder = fromEditFolder;
        editFootage320.name = "UNDLM_00320_AVEC_POIGNEES";
        editSources[320] = editFootage320;
        editImportCount++;
        importSuccess320 = true;
        fileName320 = "UNDLM_00320_AVEC_POIGNEES.mov";
        logImportSuccess(320, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00320_AVEC_POIGNEES.mov", fileName320);
    } catch (e) {
        logImportError(320, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00320_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess320 && editFileBis320.exists) {
    try {
        var editFootage320 = project.importFile(new ImportOptions(editFileBis320));
        editFootage320.parentFolder = fromEditFolder;
        editFootage320.name = "UNDLM_00320bis";
        editSources[320] = editFootage320;
        editImportCount++;
        importSuccess320 = true;
        fileName320 = "UNDLM_00320bis.mov";
        logImportSuccess(320, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00320bis.mov", fileName320);
    } catch (e) {
        logImportError(320, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00320bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess320) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00320.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00321
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile321 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00321.mov");
var editFilePoignees321 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00321_AVEC_POIGNEES.mov");
var editFileBis321 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00321bis.mov");

var importSuccess321 = false;
var fileName321 = "";

// Tenter import standard
if (editFile321.exists) {
    try {
        var editFootage321 = project.importFile(new ImportOptions(editFile321));
        editFootage321.parentFolder = fromEditFolder;
        editFootage321.name = "UNDLM_00321";
        editSources[321] = editFootage321;
        editImportCount++;
        importSuccess321 = true;
        fileName321 = "UNDLM_00321.mov";
        logImportSuccess(321, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00321.mov", fileName321);
    } catch (e) {
        logImportError(321, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00321.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess321 && editFilePoignees321.exists) {
    try {
        var editFootage321 = project.importFile(new ImportOptions(editFilePoignees321));
        editFootage321.parentFolder = fromEditFolder;
        editFootage321.name = "UNDLM_00321_AVEC_POIGNEES";
        editSources[321] = editFootage321;
        editImportCount++;
        importSuccess321 = true;
        fileName321 = "UNDLM_00321_AVEC_POIGNEES.mov";
        logImportSuccess(321, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00321_AVEC_POIGNEES.mov", fileName321);
    } catch (e) {
        logImportError(321, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00321_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess321 && editFileBis321.exists) {
    try {
        var editFootage321 = project.importFile(new ImportOptions(editFileBis321));
        editFootage321.parentFolder = fromEditFolder;
        editFootage321.name = "UNDLM_00321bis";
        editSources[321] = editFootage321;
        editImportCount++;
        importSuccess321 = true;
        fileName321 = "UNDLM_00321bis.mov";
        logImportSuccess(321, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00321bis.mov", fileName321);
    } catch (e) {
        logImportError(321, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00321bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess321) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00321.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00322
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile322 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00322.mov");
var editFilePoignees322 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00322_AVEC_POIGNEES.mov");
var editFileBis322 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00322bis.mov");

var importSuccess322 = false;
var fileName322 = "";

// Tenter import standard
if (editFile322.exists) {
    try {
        var editFootage322 = project.importFile(new ImportOptions(editFile322));
        editFootage322.parentFolder = fromEditFolder;
        editFootage322.name = "UNDLM_00322";
        editSources[322] = editFootage322;
        editImportCount++;
        importSuccess322 = true;
        fileName322 = "UNDLM_00322.mov";
        logImportSuccess(322, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00322.mov", fileName322);
    } catch (e) {
        logImportError(322, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00322.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess322 && editFilePoignees322.exists) {
    try {
        var editFootage322 = project.importFile(new ImportOptions(editFilePoignees322));
        editFootage322.parentFolder = fromEditFolder;
        editFootage322.name = "UNDLM_00322_AVEC_POIGNEES";
        editSources[322] = editFootage322;
        editImportCount++;
        importSuccess322 = true;
        fileName322 = "UNDLM_00322_AVEC_POIGNEES.mov";
        logImportSuccess(322, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00322_AVEC_POIGNEES.mov", fileName322);
    } catch (e) {
        logImportError(322, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00322_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess322 && editFileBis322.exists) {
    try {
        var editFootage322 = project.importFile(new ImportOptions(editFileBis322));
        editFootage322.parentFolder = fromEditFolder;
        editFootage322.name = "UNDLM_00322bis";
        editSources[322] = editFootage322;
        editImportCount++;
        importSuccess322 = true;
        fileName322 = "UNDLM_00322bis.mov";
        logImportSuccess(322, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00322bis.mov", fileName322);
    } catch (e) {
        logImportError(322, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00322bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess322) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00322.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00323
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile323 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00323.mov");
var editFilePoignees323 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00323_AVEC_POIGNEES.mov");
var editFileBis323 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00323bis.mov");

var importSuccess323 = false;
var fileName323 = "";

// Tenter import standard
if (editFile323.exists) {
    try {
        var editFootage323 = project.importFile(new ImportOptions(editFile323));
        editFootage323.parentFolder = fromEditFolder;
        editFootage323.name = "UNDLM_00323";
        editSources[323] = editFootage323;
        editImportCount++;
        importSuccess323 = true;
        fileName323 = "UNDLM_00323.mov";
        logImportSuccess(323, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00323.mov", fileName323);
    } catch (e) {
        logImportError(323, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00323.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess323 && editFilePoignees323.exists) {
    try {
        var editFootage323 = project.importFile(new ImportOptions(editFilePoignees323));
        editFootage323.parentFolder = fromEditFolder;
        editFootage323.name = "UNDLM_00323_AVEC_POIGNEES";
        editSources[323] = editFootage323;
        editImportCount++;
        importSuccess323 = true;
        fileName323 = "UNDLM_00323_AVEC_POIGNEES.mov";
        logImportSuccess(323, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00323_AVEC_POIGNEES.mov", fileName323);
    } catch (e) {
        logImportError(323, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00323_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess323 && editFileBis323.exists) {
    try {
        var editFootage323 = project.importFile(new ImportOptions(editFileBis323));
        editFootage323.parentFolder = fromEditFolder;
        editFootage323.name = "UNDLM_00323bis";
        editSources[323] = editFootage323;
        editImportCount++;
        importSuccess323 = true;
        fileName323 = "UNDLM_00323bis.mov";
        logImportSuccess(323, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00323bis.mov", fileName323);
    } catch (e) {
        logImportError(323, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00323bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess323) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00323.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00324
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile324 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00324.mov");
var editFilePoignees324 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00324_AVEC_POIGNEES.mov");
var editFileBis324 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00324bis.mov");

var importSuccess324 = false;
var fileName324 = "";

// Tenter import standard
if (editFile324.exists) {
    try {
        var editFootage324 = project.importFile(new ImportOptions(editFile324));
        editFootage324.parentFolder = fromEditFolder;
        editFootage324.name = "UNDLM_00324";
        editSources[324] = editFootage324;
        editImportCount++;
        importSuccess324 = true;
        fileName324 = "UNDLM_00324.mov";
        logImportSuccess(324, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00324.mov", fileName324);
    } catch (e) {
        logImportError(324, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00324.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess324 && editFilePoignees324.exists) {
    try {
        var editFootage324 = project.importFile(new ImportOptions(editFilePoignees324));
        editFootage324.parentFolder = fromEditFolder;
        editFootage324.name = "UNDLM_00324_AVEC_POIGNEES";
        editSources[324] = editFootage324;
        editImportCount++;
        importSuccess324 = true;
        fileName324 = "UNDLM_00324_AVEC_POIGNEES.mov";
        logImportSuccess(324, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00324_AVEC_POIGNEES.mov", fileName324);
    } catch (e) {
        logImportError(324, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00324_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess324 && editFileBis324.exists) {
    try {
        var editFootage324 = project.importFile(new ImportOptions(editFileBis324));
        editFootage324.parentFolder = fromEditFolder;
        editFootage324.name = "UNDLM_00324bis";
        editSources[324] = editFootage324;
        editImportCount++;
        importSuccess324 = true;
        fileName324 = "UNDLM_00324bis.mov";
        logImportSuccess(324, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00324bis.mov", fileName324);
    } catch (e) {
        logImportError(324, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00324bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess324) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00324.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00325
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile325 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00325.mov");
var editFilePoignees325 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00325_AVEC_POIGNEES.mov");
var editFileBis325 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00325bis.mov");

var importSuccess325 = false;
var fileName325 = "";

// Tenter import standard
if (editFile325.exists) {
    try {
        var editFootage325 = project.importFile(new ImportOptions(editFile325));
        editFootage325.parentFolder = fromEditFolder;
        editFootage325.name = "UNDLM_00325";
        editSources[325] = editFootage325;
        editImportCount++;
        importSuccess325 = true;
        fileName325 = "UNDLM_00325.mov";
        logImportSuccess(325, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00325.mov", fileName325);
    } catch (e) {
        logImportError(325, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00325.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess325 && editFilePoignees325.exists) {
    try {
        var editFootage325 = project.importFile(new ImportOptions(editFilePoignees325));
        editFootage325.parentFolder = fromEditFolder;
        editFootage325.name = "UNDLM_00325_AVEC_POIGNEES";
        editSources[325] = editFootage325;
        editImportCount++;
        importSuccess325 = true;
        fileName325 = "UNDLM_00325_AVEC_POIGNEES.mov";
        logImportSuccess(325, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00325_AVEC_POIGNEES.mov", fileName325);
    } catch (e) {
        logImportError(325, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00325_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess325 && editFileBis325.exists) {
    try {
        var editFootage325 = project.importFile(new ImportOptions(editFileBis325));
        editFootage325.parentFolder = fromEditFolder;
        editFootage325.name = "UNDLM_00325bis";
        editSources[325] = editFootage325;
        editImportCount++;
        importSuccess325 = true;
        fileName325 = "UNDLM_00325bis.mov";
        logImportSuccess(325, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00325bis.mov", fileName325);
    } catch (e) {
        logImportError(325, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00325bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess325) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00325.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00326
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile326 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00326.mov");
var editFilePoignees326 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00326_AVEC_POIGNEES.mov");
var editFileBis326 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00326bis.mov");

var importSuccess326 = false;
var fileName326 = "";

// Tenter import standard
if (editFile326.exists) {
    try {
        var editFootage326 = project.importFile(new ImportOptions(editFile326));
        editFootage326.parentFolder = fromEditFolder;
        editFootage326.name = "UNDLM_00326";
        editSources[326] = editFootage326;
        editImportCount++;
        importSuccess326 = true;
        fileName326 = "UNDLM_00326.mov";
        logImportSuccess(326, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00326.mov", fileName326);
    } catch (e) {
        logImportError(326, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00326.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess326 && editFilePoignees326.exists) {
    try {
        var editFootage326 = project.importFile(new ImportOptions(editFilePoignees326));
        editFootage326.parentFolder = fromEditFolder;
        editFootage326.name = "UNDLM_00326_AVEC_POIGNEES";
        editSources[326] = editFootage326;
        editImportCount++;
        importSuccess326 = true;
        fileName326 = "UNDLM_00326_AVEC_POIGNEES.mov";
        logImportSuccess(326, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00326_AVEC_POIGNEES.mov", fileName326);
    } catch (e) {
        logImportError(326, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00326_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess326 && editFileBis326.exists) {
    try {
        var editFootage326 = project.importFile(new ImportOptions(editFileBis326));
        editFootage326.parentFolder = fromEditFolder;
        editFootage326.name = "UNDLM_00326bis";
        editSources[326] = editFootage326;
        editImportCount++;
        importSuccess326 = true;
        fileName326 = "UNDLM_00326bis.mov";
        logImportSuccess(326, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00326bis.mov", fileName326);
    } catch (e) {
        logImportError(326, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00326bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess326) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00326.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00327
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile327 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00327.mov");
var editFilePoignees327 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00327_AVEC_POIGNEES.mov");
var editFileBis327 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00327bis.mov");

var importSuccess327 = false;
var fileName327 = "";

// Tenter import standard
if (editFile327.exists) {
    try {
        var editFootage327 = project.importFile(new ImportOptions(editFile327));
        editFootage327.parentFolder = fromEditFolder;
        editFootage327.name = "UNDLM_00327";
        editSources[327] = editFootage327;
        editImportCount++;
        importSuccess327 = true;
        fileName327 = "UNDLM_00327.mov";
        logImportSuccess(327, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00327.mov", fileName327);
    } catch (e) {
        logImportError(327, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00327.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess327 && editFilePoignees327.exists) {
    try {
        var editFootage327 = project.importFile(new ImportOptions(editFilePoignees327));
        editFootage327.parentFolder = fromEditFolder;
        editFootage327.name = "UNDLM_00327_AVEC_POIGNEES";
        editSources[327] = editFootage327;
        editImportCount++;
        importSuccess327 = true;
        fileName327 = "UNDLM_00327_AVEC_POIGNEES.mov";
        logImportSuccess(327, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00327_AVEC_POIGNEES.mov", fileName327);
    } catch (e) {
        logImportError(327, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00327_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess327 && editFileBis327.exists) {
    try {
        var editFootage327 = project.importFile(new ImportOptions(editFileBis327));
        editFootage327.parentFolder = fromEditFolder;
        editFootage327.name = "UNDLM_00327bis";
        editSources[327] = editFootage327;
        editImportCount++;
        importSuccess327 = true;
        fileName327 = "UNDLM_00327bis.mov";
        logImportSuccess(327, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00327bis.mov", fileName327);
    } catch (e) {
        logImportError(327, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00327bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess327) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00327.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00328
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile328 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00328.mov");
var editFilePoignees328 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00328_AVEC_POIGNEES.mov");
var editFileBis328 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00328bis.mov");

var importSuccess328 = false;
var fileName328 = "";

// Tenter import standard
if (editFile328.exists) {
    try {
        var editFootage328 = project.importFile(new ImportOptions(editFile328));
        editFootage328.parentFolder = fromEditFolder;
        editFootage328.name = "UNDLM_00328";
        editSources[328] = editFootage328;
        editImportCount++;
        importSuccess328 = true;
        fileName328 = "UNDLM_00328.mov";
        logImportSuccess(328, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00328.mov", fileName328);
    } catch (e) {
        logImportError(328, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00328.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess328 && editFilePoignees328.exists) {
    try {
        var editFootage328 = project.importFile(new ImportOptions(editFilePoignees328));
        editFootage328.parentFolder = fromEditFolder;
        editFootage328.name = "UNDLM_00328_AVEC_POIGNEES";
        editSources[328] = editFootage328;
        editImportCount++;
        importSuccess328 = true;
        fileName328 = "UNDLM_00328_AVEC_POIGNEES.mov";
        logImportSuccess(328, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00328_AVEC_POIGNEES.mov", fileName328);
    } catch (e) {
        logImportError(328, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00328_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess328 && editFileBis328.exists) {
    try {
        var editFootage328 = project.importFile(new ImportOptions(editFileBis328));
        editFootage328.parentFolder = fromEditFolder;
        editFootage328.name = "UNDLM_00328bis";
        editSources[328] = editFootage328;
        editImportCount++;
        importSuccess328 = true;
        fileName328 = "UNDLM_00328bis.mov";
        logImportSuccess(328, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00328bis.mov", fileName328);
    } catch (e) {
        logImportError(328, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00328bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess328) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00328.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00329
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile329 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00329.mov");
var editFilePoignees329 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00329_AVEC_POIGNEES.mov");
var editFileBis329 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00329bis.mov");

var importSuccess329 = false;
var fileName329 = "";

// Tenter import standard
if (editFile329.exists) {
    try {
        var editFootage329 = project.importFile(new ImportOptions(editFile329));
        editFootage329.parentFolder = fromEditFolder;
        editFootage329.name = "UNDLM_00329";
        editSources[329] = editFootage329;
        editImportCount++;
        importSuccess329 = true;
        fileName329 = "UNDLM_00329.mov";
        logImportSuccess(329, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00329.mov", fileName329);
    } catch (e) {
        logImportError(329, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00329.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess329 && editFilePoignees329.exists) {
    try {
        var editFootage329 = project.importFile(new ImportOptions(editFilePoignees329));
        editFootage329.parentFolder = fromEditFolder;
        editFootage329.name = "UNDLM_00329_AVEC_POIGNEES";
        editSources[329] = editFootage329;
        editImportCount++;
        importSuccess329 = true;
        fileName329 = "UNDLM_00329_AVEC_POIGNEES.mov";
        logImportSuccess(329, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00329_AVEC_POIGNEES.mov", fileName329);
    } catch (e) {
        logImportError(329, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00329_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess329 && editFileBis329.exists) {
    try {
        var editFootage329 = project.importFile(new ImportOptions(editFileBis329));
        editFootage329.parentFolder = fromEditFolder;
        editFootage329.name = "UNDLM_00329bis";
        editSources[329] = editFootage329;
        editImportCount++;
        importSuccess329 = true;
        fileName329 = "UNDLM_00329bis.mov";
        logImportSuccess(329, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00329bis.mov", fileName329);
    } catch (e) {
        logImportError(329, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00329bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess329) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00329.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00330
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile330 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00330.mov");
var editFilePoignees330 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00330_AVEC_POIGNEES.mov");
var editFileBis330 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00330bis.mov");

var importSuccess330 = false;
var fileName330 = "";

// Tenter import standard
if (editFile330.exists) {
    try {
        var editFootage330 = project.importFile(new ImportOptions(editFile330));
        editFootage330.parentFolder = fromEditFolder;
        editFootage330.name = "UNDLM_00330";
        editSources[330] = editFootage330;
        editImportCount++;
        importSuccess330 = true;
        fileName330 = "UNDLM_00330.mov";
        logImportSuccess(330, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00330.mov", fileName330);
    } catch (e) {
        logImportError(330, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00330.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess330 && editFilePoignees330.exists) {
    try {
        var editFootage330 = project.importFile(new ImportOptions(editFilePoignees330));
        editFootage330.parentFolder = fromEditFolder;
        editFootage330.name = "UNDLM_00330_AVEC_POIGNEES";
        editSources[330] = editFootage330;
        editImportCount++;
        importSuccess330 = true;
        fileName330 = "UNDLM_00330_AVEC_POIGNEES.mov";
        logImportSuccess(330, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00330_AVEC_POIGNEES.mov", fileName330);
    } catch (e) {
        logImportError(330, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00330_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess330 && editFileBis330.exists) {
    try {
        var editFootage330 = project.importFile(new ImportOptions(editFileBis330));
        editFootage330.parentFolder = fromEditFolder;
        editFootage330.name = "UNDLM_00330bis";
        editSources[330] = editFootage330;
        editImportCount++;
        importSuccess330 = true;
        fileName330 = "UNDLM_00330bis.mov";
        logImportSuccess(330, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00330bis.mov", fileName330);
    } catch (e) {
        logImportError(330, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00330bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess330) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00330.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00331
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile331 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00331.mov");
var editFilePoignees331 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00331_AVEC_POIGNEES.mov");
var editFileBis331 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00331bis.mov");

var importSuccess331 = false;
var fileName331 = "";

// Tenter import standard
if (editFile331.exists) {
    try {
        var editFootage331 = project.importFile(new ImportOptions(editFile331));
        editFootage331.parentFolder = fromEditFolder;
        editFootage331.name = "UNDLM_00331";
        editSources[331] = editFootage331;
        editImportCount++;
        importSuccess331 = true;
        fileName331 = "UNDLM_00331.mov";
        logImportSuccess(331, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00331.mov", fileName331);
    } catch (e) {
        logImportError(331, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00331.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess331 && editFilePoignees331.exists) {
    try {
        var editFootage331 = project.importFile(new ImportOptions(editFilePoignees331));
        editFootage331.parentFolder = fromEditFolder;
        editFootage331.name = "UNDLM_00331_AVEC_POIGNEES";
        editSources[331] = editFootage331;
        editImportCount++;
        importSuccess331 = true;
        fileName331 = "UNDLM_00331_AVEC_POIGNEES.mov";
        logImportSuccess(331, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00331_AVEC_POIGNEES.mov", fileName331);
    } catch (e) {
        logImportError(331, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00331_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess331 && editFileBis331.exists) {
    try {
        var editFootage331 = project.importFile(new ImportOptions(editFileBis331));
        editFootage331.parentFolder = fromEditFolder;
        editFootage331.name = "UNDLM_00331bis";
        editSources[331] = editFootage331;
        editImportCount++;
        importSuccess331 = true;
        fileName331 = "UNDLM_00331bis.mov";
        logImportSuccess(331, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00331bis.mov", fileName331);
    } catch (e) {
        logImportError(331, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00331bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess331) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00331.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00332
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile332 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00332.mov");
var editFilePoignees332 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00332_AVEC_POIGNEES.mov");
var editFileBis332 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00332bis.mov");

var importSuccess332 = false;
var fileName332 = "";

// Tenter import standard
if (editFile332.exists) {
    try {
        var editFootage332 = project.importFile(new ImportOptions(editFile332));
        editFootage332.parentFolder = fromEditFolder;
        editFootage332.name = "UNDLM_00332";
        editSources[332] = editFootage332;
        editImportCount++;
        importSuccess332 = true;
        fileName332 = "UNDLM_00332.mov";
        logImportSuccess(332, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00332.mov", fileName332);
    } catch (e) {
        logImportError(332, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00332.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess332 && editFilePoignees332.exists) {
    try {
        var editFootage332 = project.importFile(new ImportOptions(editFilePoignees332));
        editFootage332.parentFolder = fromEditFolder;
        editFootage332.name = "UNDLM_00332_AVEC_POIGNEES";
        editSources[332] = editFootage332;
        editImportCount++;
        importSuccess332 = true;
        fileName332 = "UNDLM_00332_AVEC_POIGNEES.mov";
        logImportSuccess(332, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00332_AVEC_POIGNEES.mov", fileName332);
    } catch (e) {
        logImportError(332, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00332_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess332 && editFileBis332.exists) {
    try {
        var editFootage332 = project.importFile(new ImportOptions(editFileBis332));
        editFootage332.parentFolder = fromEditFolder;
        editFootage332.name = "UNDLM_00332bis";
        editSources[332] = editFootage332;
        editImportCount++;
        importSuccess332 = true;
        fileName332 = "UNDLM_00332bis.mov";
        logImportSuccess(332, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00332bis.mov", fileName332);
    } catch (e) {
        logImportError(332, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00332bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess332) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00332.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00333
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile333 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00333.mov");
var editFilePoignees333 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00333_AVEC_POIGNEES.mov");
var editFileBis333 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00333bis.mov");

var importSuccess333 = false;
var fileName333 = "";

// Tenter import standard
if (editFile333.exists) {
    try {
        var editFootage333 = project.importFile(new ImportOptions(editFile333));
        editFootage333.parentFolder = fromEditFolder;
        editFootage333.name = "UNDLM_00333";
        editSources[333] = editFootage333;
        editImportCount++;
        importSuccess333 = true;
        fileName333 = "UNDLM_00333.mov";
        logImportSuccess(333, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00333.mov", fileName333);
    } catch (e) {
        logImportError(333, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00333.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess333 && editFilePoignees333.exists) {
    try {
        var editFootage333 = project.importFile(new ImportOptions(editFilePoignees333));
        editFootage333.parentFolder = fromEditFolder;
        editFootage333.name = "UNDLM_00333_AVEC_POIGNEES";
        editSources[333] = editFootage333;
        editImportCount++;
        importSuccess333 = true;
        fileName333 = "UNDLM_00333_AVEC_POIGNEES.mov";
        logImportSuccess(333, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00333_AVEC_POIGNEES.mov", fileName333);
    } catch (e) {
        logImportError(333, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00333_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess333 && editFileBis333.exists) {
    try {
        var editFootage333 = project.importFile(new ImportOptions(editFileBis333));
        editFootage333.parentFolder = fromEditFolder;
        editFootage333.name = "UNDLM_00333bis";
        editSources[333] = editFootage333;
        editImportCount++;
        importSuccess333 = true;
        fileName333 = "UNDLM_00333bis.mov";
        logImportSuccess(333, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00333bis.mov", fileName333);
    } catch (e) {
        logImportError(333, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00333bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess333) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00333.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00318
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile318 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00318.mov");
var gradedFilePoignees318 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00318_AVEC_POIGNEES.mov");
var gradedFileBis318 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00318bis.mov");

var gradedImportSuccess318 = false;
var gradedFileName318 = "";

// Tenter import standard
if (gradedFile318.exists) {
    try {
        var gradedFootage318 = project.importFile(new ImportOptions(gradedFile318));
        gradedFootage318.parentFolder = fromGradingFolder;
        gradedFootage318.name = "UNDLM_00318";
        gradingSources[318] = gradedFootage318;
        gradingImportCount++;
        gradedImportSuccess318 = true;
        gradedFileName318 = "UNDLM_00318.mov";
        logImportSuccess(318, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00318.mov", gradedFileName318);
    } catch (e) {
        logImportError(318, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00318.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess318 && gradedFilePoignees318.exists) {
    try {
        var gradedFootage318 = project.importFile(new ImportOptions(gradedFilePoignees318));
        gradedFootage318.parentFolder = fromGradingFolder;
        gradedFootage318.name = "UNDLM_00318_AVEC_POIGNEES";
        gradingSources[318] = gradedFootage318;
        gradingImportCount++;
        gradedImportSuccess318 = true;
        gradedFileName318 = "UNDLM_00318_AVEC_POIGNEES.mov";
        logImportSuccess(318, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00318_AVEC_POIGNEES.mov", gradedFileName318);
    } catch (e) {
        logImportError(318, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00318_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess318 && gradedFileBis318.exists) {
    try {
        var gradedFootage318 = project.importFile(new ImportOptions(gradedFileBis318));
        gradedFootage318.parentFolder = fromGradingFolder;
        gradedFootage318.name = "UNDLM_00318bis";
        gradingSources[318] = gradedFootage318;
        gradingImportCount++;
        gradedImportSuccess318 = true;
        gradedFileName318 = "UNDLM_00318bis.mov";
        logImportSuccess(318, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00318bis.mov", gradedFileName318);
    } catch (e) {
        logImportError(318, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00318bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess318) {
    missingGradingCount++;
}

// Import plan GRADED 00319
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile319 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00319.mov");
var gradedFilePoignees319 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00319_AVEC_POIGNEES.mov");
var gradedFileBis319 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00319bis.mov");

var gradedImportSuccess319 = false;
var gradedFileName319 = "";

// Tenter import standard
if (gradedFile319.exists) {
    try {
        var gradedFootage319 = project.importFile(new ImportOptions(gradedFile319));
        gradedFootage319.parentFolder = fromGradingFolder;
        gradedFootage319.name = "UNDLM_00319";
        gradingSources[319] = gradedFootage319;
        gradingImportCount++;
        gradedImportSuccess319 = true;
        gradedFileName319 = "UNDLM_00319.mov";
        logImportSuccess(319, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00319.mov", gradedFileName319);
    } catch (e) {
        logImportError(319, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00319.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess319 && gradedFilePoignees319.exists) {
    try {
        var gradedFootage319 = project.importFile(new ImportOptions(gradedFilePoignees319));
        gradedFootage319.parentFolder = fromGradingFolder;
        gradedFootage319.name = "UNDLM_00319_AVEC_POIGNEES";
        gradingSources[319] = gradedFootage319;
        gradingImportCount++;
        gradedImportSuccess319 = true;
        gradedFileName319 = "UNDLM_00319_AVEC_POIGNEES.mov";
        logImportSuccess(319, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00319_AVEC_POIGNEES.mov", gradedFileName319);
    } catch (e) {
        logImportError(319, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00319_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess319 && gradedFileBis319.exists) {
    try {
        var gradedFootage319 = project.importFile(new ImportOptions(gradedFileBis319));
        gradedFootage319.parentFolder = fromGradingFolder;
        gradedFootage319.name = "UNDLM_00319bis";
        gradingSources[319] = gradedFootage319;
        gradingImportCount++;
        gradedImportSuccess319 = true;
        gradedFileName319 = "UNDLM_00319bis.mov";
        logImportSuccess(319, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00319bis.mov", gradedFileName319);
    } catch (e) {
        logImportError(319, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00319bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess319) {
    missingGradingCount++;
}

// Import plan GRADED 00320
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile320 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00320.mov");
var gradedFilePoignees320 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00320_AVEC_POIGNEES.mov");
var gradedFileBis320 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00320bis.mov");

var gradedImportSuccess320 = false;
var gradedFileName320 = "";

// Tenter import standard
if (gradedFile320.exists) {
    try {
        var gradedFootage320 = project.importFile(new ImportOptions(gradedFile320));
        gradedFootage320.parentFolder = fromGradingFolder;
        gradedFootage320.name = "UNDLM_00320";
        gradingSources[320] = gradedFootage320;
        gradingImportCount++;
        gradedImportSuccess320 = true;
        gradedFileName320 = "UNDLM_00320.mov";
        logImportSuccess(320, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00320.mov", gradedFileName320);
    } catch (e) {
        logImportError(320, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00320.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess320 && gradedFilePoignees320.exists) {
    try {
        var gradedFootage320 = project.importFile(new ImportOptions(gradedFilePoignees320));
        gradedFootage320.parentFolder = fromGradingFolder;
        gradedFootage320.name = "UNDLM_00320_AVEC_POIGNEES";
        gradingSources[320] = gradedFootage320;
        gradingImportCount++;
        gradedImportSuccess320 = true;
        gradedFileName320 = "UNDLM_00320_AVEC_POIGNEES.mov";
        logImportSuccess(320, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00320_AVEC_POIGNEES.mov", gradedFileName320);
    } catch (e) {
        logImportError(320, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00320_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess320 && gradedFileBis320.exists) {
    try {
        var gradedFootage320 = project.importFile(new ImportOptions(gradedFileBis320));
        gradedFootage320.parentFolder = fromGradingFolder;
        gradedFootage320.name = "UNDLM_00320bis";
        gradingSources[320] = gradedFootage320;
        gradingImportCount++;
        gradedImportSuccess320 = true;
        gradedFileName320 = "UNDLM_00320bis.mov";
        logImportSuccess(320, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00320bis.mov", gradedFileName320);
    } catch (e) {
        logImportError(320, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00320bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess320) {
    missingGradingCount++;
}

// Import plan GRADED 00321
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile321 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00321.mov");
var gradedFilePoignees321 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00321_AVEC_POIGNEES.mov");
var gradedFileBis321 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00321bis.mov");

var gradedImportSuccess321 = false;
var gradedFileName321 = "";

// Tenter import standard
if (gradedFile321.exists) {
    try {
        var gradedFootage321 = project.importFile(new ImportOptions(gradedFile321));
        gradedFootage321.parentFolder = fromGradingFolder;
        gradedFootage321.name = "UNDLM_00321";
        gradingSources[321] = gradedFootage321;
        gradingImportCount++;
        gradedImportSuccess321 = true;
        gradedFileName321 = "UNDLM_00321.mov";
        logImportSuccess(321, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00321.mov", gradedFileName321);
    } catch (e) {
        logImportError(321, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00321.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess321 && gradedFilePoignees321.exists) {
    try {
        var gradedFootage321 = project.importFile(new ImportOptions(gradedFilePoignees321));
        gradedFootage321.parentFolder = fromGradingFolder;
        gradedFootage321.name = "UNDLM_00321_AVEC_POIGNEES";
        gradingSources[321] = gradedFootage321;
        gradingImportCount++;
        gradedImportSuccess321 = true;
        gradedFileName321 = "UNDLM_00321_AVEC_POIGNEES.mov";
        logImportSuccess(321, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00321_AVEC_POIGNEES.mov", gradedFileName321);
    } catch (e) {
        logImportError(321, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00321_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess321 && gradedFileBis321.exists) {
    try {
        var gradedFootage321 = project.importFile(new ImportOptions(gradedFileBis321));
        gradedFootage321.parentFolder = fromGradingFolder;
        gradedFootage321.name = "UNDLM_00321bis";
        gradingSources[321] = gradedFootage321;
        gradingImportCount++;
        gradedImportSuccess321 = true;
        gradedFileName321 = "UNDLM_00321bis.mov";
        logImportSuccess(321, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00321bis.mov", gradedFileName321);
    } catch (e) {
        logImportError(321, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00321bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess321) {
    missingGradingCount++;
}

// Import plan GRADED 00322
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile322 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00322.mov");
var gradedFilePoignees322 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00322_AVEC_POIGNEES.mov");
var gradedFileBis322 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00322bis.mov");

var gradedImportSuccess322 = false;
var gradedFileName322 = "";

// Tenter import standard
if (gradedFile322.exists) {
    try {
        var gradedFootage322 = project.importFile(new ImportOptions(gradedFile322));
        gradedFootage322.parentFolder = fromGradingFolder;
        gradedFootage322.name = "UNDLM_00322";
        gradingSources[322] = gradedFootage322;
        gradingImportCount++;
        gradedImportSuccess322 = true;
        gradedFileName322 = "UNDLM_00322.mov";
        logImportSuccess(322, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00322.mov", gradedFileName322);
    } catch (e) {
        logImportError(322, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00322.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess322 && gradedFilePoignees322.exists) {
    try {
        var gradedFootage322 = project.importFile(new ImportOptions(gradedFilePoignees322));
        gradedFootage322.parentFolder = fromGradingFolder;
        gradedFootage322.name = "UNDLM_00322_AVEC_POIGNEES";
        gradingSources[322] = gradedFootage322;
        gradingImportCount++;
        gradedImportSuccess322 = true;
        gradedFileName322 = "UNDLM_00322_AVEC_POIGNEES.mov";
        logImportSuccess(322, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00322_AVEC_POIGNEES.mov", gradedFileName322);
    } catch (e) {
        logImportError(322, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00322_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess322 && gradedFileBis322.exists) {
    try {
        var gradedFootage322 = project.importFile(new ImportOptions(gradedFileBis322));
        gradedFootage322.parentFolder = fromGradingFolder;
        gradedFootage322.name = "UNDLM_00322bis";
        gradingSources[322] = gradedFootage322;
        gradingImportCount++;
        gradedImportSuccess322 = true;
        gradedFileName322 = "UNDLM_00322bis.mov";
        logImportSuccess(322, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00322bis.mov", gradedFileName322);
    } catch (e) {
        logImportError(322, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00322bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess322) {
    missingGradingCount++;
}

// Import plan GRADED 00323
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile323 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00323.mov");
var gradedFilePoignees323 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00323_AVEC_POIGNEES.mov");
var gradedFileBis323 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00323bis.mov");

var gradedImportSuccess323 = false;
var gradedFileName323 = "";

// Tenter import standard
if (gradedFile323.exists) {
    try {
        var gradedFootage323 = project.importFile(new ImportOptions(gradedFile323));
        gradedFootage323.parentFolder = fromGradingFolder;
        gradedFootage323.name = "UNDLM_00323";
        gradingSources[323] = gradedFootage323;
        gradingImportCount++;
        gradedImportSuccess323 = true;
        gradedFileName323 = "UNDLM_00323.mov";
        logImportSuccess(323, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00323.mov", gradedFileName323);
    } catch (e) {
        logImportError(323, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00323.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess323 && gradedFilePoignees323.exists) {
    try {
        var gradedFootage323 = project.importFile(new ImportOptions(gradedFilePoignees323));
        gradedFootage323.parentFolder = fromGradingFolder;
        gradedFootage323.name = "UNDLM_00323_AVEC_POIGNEES";
        gradingSources[323] = gradedFootage323;
        gradingImportCount++;
        gradedImportSuccess323 = true;
        gradedFileName323 = "UNDLM_00323_AVEC_POIGNEES.mov";
        logImportSuccess(323, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00323_AVEC_POIGNEES.mov", gradedFileName323);
    } catch (e) {
        logImportError(323, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00323_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess323 && gradedFileBis323.exists) {
    try {
        var gradedFootage323 = project.importFile(new ImportOptions(gradedFileBis323));
        gradedFootage323.parentFolder = fromGradingFolder;
        gradedFootage323.name = "UNDLM_00323bis";
        gradingSources[323] = gradedFootage323;
        gradingImportCount++;
        gradedImportSuccess323 = true;
        gradedFileName323 = "UNDLM_00323bis.mov";
        logImportSuccess(323, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00323bis.mov", gradedFileName323);
    } catch (e) {
        logImportError(323, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00323bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess323) {
    missingGradingCount++;
}

// Import plan GRADED 00324
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile324 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00324.mov");
var gradedFilePoignees324 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00324_AVEC_POIGNEES.mov");
var gradedFileBis324 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00324bis.mov");

var gradedImportSuccess324 = false;
var gradedFileName324 = "";

// Tenter import standard
if (gradedFile324.exists) {
    try {
        var gradedFootage324 = project.importFile(new ImportOptions(gradedFile324));
        gradedFootage324.parentFolder = fromGradingFolder;
        gradedFootage324.name = "UNDLM_00324";
        gradingSources[324] = gradedFootage324;
        gradingImportCount++;
        gradedImportSuccess324 = true;
        gradedFileName324 = "UNDLM_00324.mov";
        logImportSuccess(324, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00324.mov", gradedFileName324);
    } catch (e) {
        logImportError(324, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00324.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess324 && gradedFilePoignees324.exists) {
    try {
        var gradedFootage324 = project.importFile(new ImportOptions(gradedFilePoignees324));
        gradedFootage324.parentFolder = fromGradingFolder;
        gradedFootage324.name = "UNDLM_00324_AVEC_POIGNEES";
        gradingSources[324] = gradedFootage324;
        gradingImportCount++;
        gradedImportSuccess324 = true;
        gradedFileName324 = "UNDLM_00324_AVEC_POIGNEES.mov";
        logImportSuccess(324, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00324_AVEC_POIGNEES.mov", gradedFileName324);
    } catch (e) {
        logImportError(324, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00324_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess324 && gradedFileBis324.exists) {
    try {
        var gradedFootage324 = project.importFile(new ImportOptions(gradedFileBis324));
        gradedFootage324.parentFolder = fromGradingFolder;
        gradedFootage324.name = "UNDLM_00324bis";
        gradingSources[324] = gradedFootage324;
        gradingImportCount++;
        gradedImportSuccess324 = true;
        gradedFileName324 = "UNDLM_00324bis.mov";
        logImportSuccess(324, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00324bis.mov", gradedFileName324);
    } catch (e) {
        logImportError(324, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00324bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess324) {
    missingGradingCount++;
}

// Import plan GRADED 00325
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile325 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00325.mov");
var gradedFilePoignees325 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00325_AVEC_POIGNEES.mov");
var gradedFileBis325 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00325bis.mov");

var gradedImportSuccess325 = false;
var gradedFileName325 = "";

// Tenter import standard
if (gradedFile325.exists) {
    try {
        var gradedFootage325 = project.importFile(new ImportOptions(gradedFile325));
        gradedFootage325.parentFolder = fromGradingFolder;
        gradedFootage325.name = "UNDLM_00325";
        gradingSources[325] = gradedFootage325;
        gradingImportCount++;
        gradedImportSuccess325 = true;
        gradedFileName325 = "UNDLM_00325.mov";
        logImportSuccess(325, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00325.mov", gradedFileName325);
    } catch (e) {
        logImportError(325, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00325.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess325 && gradedFilePoignees325.exists) {
    try {
        var gradedFootage325 = project.importFile(new ImportOptions(gradedFilePoignees325));
        gradedFootage325.parentFolder = fromGradingFolder;
        gradedFootage325.name = "UNDLM_00325_AVEC_POIGNEES";
        gradingSources[325] = gradedFootage325;
        gradingImportCount++;
        gradedImportSuccess325 = true;
        gradedFileName325 = "UNDLM_00325_AVEC_POIGNEES.mov";
        logImportSuccess(325, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00325_AVEC_POIGNEES.mov", gradedFileName325);
    } catch (e) {
        logImportError(325, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00325_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess325 && gradedFileBis325.exists) {
    try {
        var gradedFootage325 = project.importFile(new ImportOptions(gradedFileBis325));
        gradedFootage325.parentFolder = fromGradingFolder;
        gradedFootage325.name = "UNDLM_00325bis";
        gradingSources[325] = gradedFootage325;
        gradingImportCount++;
        gradedImportSuccess325 = true;
        gradedFileName325 = "UNDLM_00325bis.mov";
        logImportSuccess(325, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00325bis.mov", gradedFileName325);
    } catch (e) {
        logImportError(325, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00325bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess325) {
    missingGradingCount++;
}

// Import plan GRADED 00326
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile326 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00326.mov");
var gradedFilePoignees326 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00326_AVEC_POIGNEES.mov");
var gradedFileBis326 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00326bis.mov");

var gradedImportSuccess326 = false;
var gradedFileName326 = "";

// Tenter import standard
if (gradedFile326.exists) {
    try {
        var gradedFootage326 = project.importFile(new ImportOptions(gradedFile326));
        gradedFootage326.parentFolder = fromGradingFolder;
        gradedFootage326.name = "UNDLM_00326";
        gradingSources[326] = gradedFootage326;
        gradingImportCount++;
        gradedImportSuccess326 = true;
        gradedFileName326 = "UNDLM_00326.mov";
        logImportSuccess(326, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00326.mov", gradedFileName326);
    } catch (e) {
        logImportError(326, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00326.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess326 && gradedFilePoignees326.exists) {
    try {
        var gradedFootage326 = project.importFile(new ImportOptions(gradedFilePoignees326));
        gradedFootage326.parentFolder = fromGradingFolder;
        gradedFootage326.name = "UNDLM_00326_AVEC_POIGNEES";
        gradingSources[326] = gradedFootage326;
        gradingImportCount++;
        gradedImportSuccess326 = true;
        gradedFileName326 = "UNDLM_00326_AVEC_POIGNEES.mov";
        logImportSuccess(326, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00326_AVEC_POIGNEES.mov", gradedFileName326);
    } catch (e) {
        logImportError(326, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00326_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess326 && gradedFileBis326.exists) {
    try {
        var gradedFootage326 = project.importFile(new ImportOptions(gradedFileBis326));
        gradedFootage326.parentFolder = fromGradingFolder;
        gradedFootage326.name = "UNDLM_00326bis";
        gradingSources[326] = gradedFootage326;
        gradingImportCount++;
        gradedImportSuccess326 = true;
        gradedFileName326 = "UNDLM_00326bis.mov";
        logImportSuccess(326, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00326bis.mov", gradedFileName326);
    } catch (e) {
        logImportError(326, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00326bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess326) {
    missingGradingCount++;
}

// Import plan GRADED 00327
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile327 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00327.mov");
var gradedFilePoignees327 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00327_AVEC_POIGNEES.mov");
var gradedFileBis327 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00327bis.mov");

var gradedImportSuccess327 = false;
var gradedFileName327 = "";

// Tenter import standard
if (gradedFile327.exists) {
    try {
        var gradedFootage327 = project.importFile(new ImportOptions(gradedFile327));
        gradedFootage327.parentFolder = fromGradingFolder;
        gradedFootage327.name = "UNDLM_00327";
        gradingSources[327] = gradedFootage327;
        gradingImportCount++;
        gradedImportSuccess327 = true;
        gradedFileName327 = "UNDLM_00327.mov";
        logImportSuccess(327, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00327.mov", gradedFileName327);
    } catch (e) {
        logImportError(327, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00327.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess327 && gradedFilePoignees327.exists) {
    try {
        var gradedFootage327 = project.importFile(new ImportOptions(gradedFilePoignees327));
        gradedFootage327.parentFolder = fromGradingFolder;
        gradedFootage327.name = "UNDLM_00327_AVEC_POIGNEES";
        gradingSources[327] = gradedFootage327;
        gradingImportCount++;
        gradedImportSuccess327 = true;
        gradedFileName327 = "UNDLM_00327_AVEC_POIGNEES.mov";
        logImportSuccess(327, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00327_AVEC_POIGNEES.mov", gradedFileName327);
    } catch (e) {
        logImportError(327, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00327_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess327 && gradedFileBis327.exists) {
    try {
        var gradedFootage327 = project.importFile(new ImportOptions(gradedFileBis327));
        gradedFootage327.parentFolder = fromGradingFolder;
        gradedFootage327.name = "UNDLM_00327bis";
        gradingSources[327] = gradedFootage327;
        gradingImportCount++;
        gradedImportSuccess327 = true;
        gradedFileName327 = "UNDLM_00327bis.mov";
        logImportSuccess(327, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00327bis.mov", gradedFileName327);
    } catch (e) {
        logImportError(327, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00327bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess327) {
    missingGradingCount++;
}

// Import plan GRADED 00328
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile328 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00328.mov");
var gradedFilePoignees328 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00328_AVEC_POIGNEES.mov");
var gradedFileBis328 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00328bis.mov");

var gradedImportSuccess328 = false;
var gradedFileName328 = "";

// Tenter import standard
if (gradedFile328.exists) {
    try {
        var gradedFootage328 = project.importFile(new ImportOptions(gradedFile328));
        gradedFootage328.parentFolder = fromGradingFolder;
        gradedFootage328.name = "UNDLM_00328";
        gradingSources[328] = gradedFootage328;
        gradingImportCount++;
        gradedImportSuccess328 = true;
        gradedFileName328 = "UNDLM_00328.mov";
        logImportSuccess(328, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00328.mov", gradedFileName328);
    } catch (e) {
        logImportError(328, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00328.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess328 && gradedFilePoignees328.exists) {
    try {
        var gradedFootage328 = project.importFile(new ImportOptions(gradedFilePoignees328));
        gradedFootage328.parentFolder = fromGradingFolder;
        gradedFootage328.name = "UNDLM_00328_AVEC_POIGNEES";
        gradingSources[328] = gradedFootage328;
        gradingImportCount++;
        gradedImportSuccess328 = true;
        gradedFileName328 = "UNDLM_00328_AVEC_POIGNEES.mov";
        logImportSuccess(328, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00328_AVEC_POIGNEES.mov", gradedFileName328);
    } catch (e) {
        logImportError(328, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00328_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess328 && gradedFileBis328.exists) {
    try {
        var gradedFootage328 = project.importFile(new ImportOptions(gradedFileBis328));
        gradedFootage328.parentFolder = fromGradingFolder;
        gradedFootage328.name = "UNDLM_00328bis";
        gradingSources[328] = gradedFootage328;
        gradingImportCount++;
        gradedImportSuccess328 = true;
        gradedFileName328 = "UNDLM_00328bis.mov";
        logImportSuccess(328, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00328bis.mov", gradedFileName328);
    } catch (e) {
        logImportError(328, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00328bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess328) {
    missingGradingCount++;
}

// Import plan GRADED 00329
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile329 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00329.mov");
var gradedFilePoignees329 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00329_AVEC_POIGNEES.mov");
var gradedFileBis329 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00329bis.mov");

var gradedImportSuccess329 = false;
var gradedFileName329 = "";

// Tenter import standard
if (gradedFile329.exists) {
    try {
        var gradedFootage329 = project.importFile(new ImportOptions(gradedFile329));
        gradedFootage329.parentFolder = fromGradingFolder;
        gradedFootage329.name = "UNDLM_00329";
        gradingSources[329] = gradedFootage329;
        gradingImportCount++;
        gradedImportSuccess329 = true;
        gradedFileName329 = "UNDLM_00329.mov";
        logImportSuccess(329, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00329.mov", gradedFileName329);
    } catch (e) {
        logImportError(329, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00329.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess329 && gradedFilePoignees329.exists) {
    try {
        var gradedFootage329 = project.importFile(new ImportOptions(gradedFilePoignees329));
        gradedFootage329.parentFolder = fromGradingFolder;
        gradedFootage329.name = "UNDLM_00329_AVEC_POIGNEES";
        gradingSources[329] = gradedFootage329;
        gradingImportCount++;
        gradedImportSuccess329 = true;
        gradedFileName329 = "UNDLM_00329_AVEC_POIGNEES.mov";
        logImportSuccess(329, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00329_AVEC_POIGNEES.mov", gradedFileName329);
    } catch (e) {
        logImportError(329, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00329_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess329 && gradedFileBis329.exists) {
    try {
        var gradedFootage329 = project.importFile(new ImportOptions(gradedFileBis329));
        gradedFootage329.parentFolder = fromGradingFolder;
        gradedFootage329.name = "UNDLM_00329bis";
        gradingSources[329] = gradedFootage329;
        gradingImportCount++;
        gradedImportSuccess329 = true;
        gradedFileName329 = "UNDLM_00329bis.mov";
        logImportSuccess(329, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00329bis.mov", gradedFileName329);
    } catch (e) {
        logImportError(329, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00329bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess329) {
    missingGradingCount++;
}

// Import plan GRADED 00330
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile330 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00330.mov");
var gradedFilePoignees330 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00330_AVEC_POIGNEES.mov");
var gradedFileBis330 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00330bis.mov");

var gradedImportSuccess330 = false;
var gradedFileName330 = "";

// Tenter import standard
if (gradedFile330.exists) {
    try {
        var gradedFootage330 = project.importFile(new ImportOptions(gradedFile330));
        gradedFootage330.parentFolder = fromGradingFolder;
        gradedFootage330.name = "UNDLM_00330";
        gradingSources[330] = gradedFootage330;
        gradingImportCount++;
        gradedImportSuccess330 = true;
        gradedFileName330 = "UNDLM_00330.mov";
        logImportSuccess(330, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00330.mov", gradedFileName330);
    } catch (e) {
        logImportError(330, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00330.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess330 && gradedFilePoignees330.exists) {
    try {
        var gradedFootage330 = project.importFile(new ImportOptions(gradedFilePoignees330));
        gradedFootage330.parentFolder = fromGradingFolder;
        gradedFootage330.name = "UNDLM_00330_AVEC_POIGNEES";
        gradingSources[330] = gradedFootage330;
        gradingImportCount++;
        gradedImportSuccess330 = true;
        gradedFileName330 = "UNDLM_00330_AVEC_POIGNEES.mov";
        logImportSuccess(330, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00330_AVEC_POIGNEES.mov", gradedFileName330);
    } catch (e) {
        logImportError(330, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00330_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess330 && gradedFileBis330.exists) {
    try {
        var gradedFootage330 = project.importFile(new ImportOptions(gradedFileBis330));
        gradedFootage330.parentFolder = fromGradingFolder;
        gradedFootage330.name = "UNDLM_00330bis";
        gradingSources[330] = gradedFootage330;
        gradingImportCount++;
        gradedImportSuccess330 = true;
        gradedFileName330 = "UNDLM_00330bis.mov";
        logImportSuccess(330, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00330bis.mov", gradedFileName330);
    } catch (e) {
        logImportError(330, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00330bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess330) {
    missingGradingCount++;
}

// Import plan GRADED 00331
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile331 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00331.mov");
var gradedFilePoignees331 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00331_AVEC_POIGNEES.mov");
var gradedFileBis331 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00331bis.mov");

var gradedImportSuccess331 = false;
var gradedFileName331 = "";

// Tenter import standard
if (gradedFile331.exists) {
    try {
        var gradedFootage331 = project.importFile(new ImportOptions(gradedFile331));
        gradedFootage331.parentFolder = fromGradingFolder;
        gradedFootage331.name = "UNDLM_00331";
        gradingSources[331] = gradedFootage331;
        gradingImportCount++;
        gradedImportSuccess331 = true;
        gradedFileName331 = "UNDLM_00331.mov";
        logImportSuccess(331, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00331.mov", gradedFileName331);
    } catch (e) {
        logImportError(331, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00331.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess331 && gradedFilePoignees331.exists) {
    try {
        var gradedFootage331 = project.importFile(new ImportOptions(gradedFilePoignees331));
        gradedFootage331.parentFolder = fromGradingFolder;
        gradedFootage331.name = "UNDLM_00331_AVEC_POIGNEES";
        gradingSources[331] = gradedFootage331;
        gradingImportCount++;
        gradedImportSuccess331 = true;
        gradedFileName331 = "UNDLM_00331_AVEC_POIGNEES.mov";
        logImportSuccess(331, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00331_AVEC_POIGNEES.mov", gradedFileName331);
    } catch (e) {
        logImportError(331, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00331_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess331 && gradedFileBis331.exists) {
    try {
        var gradedFootage331 = project.importFile(new ImportOptions(gradedFileBis331));
        gradedFootage331.parentFolder = fromGradingFolder;
        gradedFootage331.name = "UNDLM_00331bis";
        gradingSources[331] = gradedFootage331;
        gradingImportCount++;
        gradedImportSuccess331 = true;
        gradedFileName331 = "UNDLM_00331bis.mov";
        logImportSuccess(331, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00331bis.mov", gradedFileName331);
    } catch (e) {
        logImportError(331, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00331bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess331) {
    missingGradingCount++;
}

// Import plan GRADED 00332
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile332 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00332.mov");
var gradedFilePoignees332 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00332_AVEC_POIGNEES.mov");
var gradedFileBis332 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00332bis.mov");

var gradedImportSuccess332 = false;
var gradedFileName332 = "";

// Tenter import standard
if (gradedFile332.exists) {
    try {
        var gradedFootage332 = project.importFile(new ImportOptions(gradedFile332));
        gradedFootage332.parentFolder = fromGradingFolder;
        gradedFootage332.name = "UNDLM_00332";
        gradingSources[332] = gradedFootage332;
        gradingImportCount++;
        gradedImportSuccess332 = true;
        gradedFileName332 = "UNDLM_00332.mov";
        logImportSuccess(332, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00332.mov", gradedFileName332);
    } catch (e) {
        logImportError(332, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00332.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess332 && gradedFilePoignees332.exists) {
    try {
        var gradedFootage332 = project.importFile(new ImportOptions(gradedFilePoignees332));
        gradedFootage332.parentFolder = fromGradingFolder;
        gradedFootage332.name = "UNDLM_00332_AVEC_POIGNEES";
        gradingSources[332] = gradedFootage332;
        gradingImportCount++;
        gradedImportSuccess332 = true;
        gradedFileName332 = "UNDLM_00332_AVEC_POIGNEES.mov";
        logImportSuccess(332, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00332_AVEC_POIGNEES.mov", gradedFileName332);
    } catch (e) {
        logImportError(332, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00332_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess332 && gradedFileBis332.exists) {
    try {
        var gradedFootage332 = project.importFile(new ImportOptions(gradedFileBis332));
        gradedFootage332.parentFolder = fromGradingFolder;
        gradedFootage332.name = "UNDLM_00332bis";
        gradingSources[332] = gradedFootage332;
        gradingImportCount++;
        gradedImportSuccess332 = true;
        gradedFileName332 = "UNDLM_00332bis.mov";
        logImportSuccess(332, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00332bis.mov", gradedFileName332);
    } catch (e) {
        logImportError(332, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00332bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess332) {
    missingGradingCount++;
}

// Import plan GRADED 00333
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile333 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00333.mov");
var gradedFilePoignees333 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00333_AVEC_POIGNEES.mov");
var gradedFileBis333 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00333bis.mov");

var gradedImportSuccess333 = false;
var gradedFileName333 = "";

// Tenter import standard
if (gradedFile333.exists) {
    try {
        var gradedFootage333 = project.importFile(new ImportOptions(gradedFile333));
        gradedFootage333.parentFolder = fromGradingFolder;
        gradedFootage333.name = "UNDLM_00333";
        gradingSources[333] = gradedFootage333;
        gradingImportCount++;
        gradedImportSuccess333 = true;
        gradedFileName333 = "UNDLM_00333.mov";
        logImportSuccess(333, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00333.mov", gradedFileName333);
    } catch (e) {
        logImportError(333, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00333.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess333 && gradedFilePoignees333.exists) {
    try {
        var gradedFootage333 = project.importFile(new ImportOptions(gradedFilePoignees333));
        gradedFootage333.parentFolder = fromGradingFolder;
        gradedFootage333.name = "UNDLM_00333_AVEC_POIGNEES";
        gradingSources[333] = gradedFootage333;
        gradingImportCount++;
        gradedImportSuccess333 = true;
        gradedFileName333 = "UNDLM_00333_AVEC_POIGNEES.mov";
        logImportSuccess(333, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00333_AVEC_POIGNEES.mov", gradedFileName333);
    } catch (e) {
        logImportError(333, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00333_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess333 && gradedFileBis333.exists) {
    try {
        var gradedFootage333 = project.importFile(new ImportOptions(gradedFileBis333));
        gradedFootage333.parentFolder = fromGradingFolder;
        gradedFootage333.name = "UNDLM_00333bis";
        gradingSources[333] = gradedFootage333;
        gradingImportCount++;
        gradedImportSuccess333 = true;
        gradedFileName333 = "UNDLM_00333bis.mov";
        logImportSuccess(333, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00333bis.mov", gradedFileName333);
    } catch (e) {
        logImportError(333, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00333bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess333) {
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


// Composition pour plan 00318
var planComp318 = project.items.addComp(
    "SQ19_UNDLM_00318_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp318.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer318 = planComp318.layers.add(bgSolidComp);
bgLayer318.name = "BG_SOLID";
bgLayer318.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer318 = false;
if (gradingSources[318]) {
    var gradedLayer318 = planComp318.layers.add(gradingSources[318]);
    gradedLayer318.name = "UNDLM_00318_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer318.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer318.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer318 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer318 = false;
if (editSources[318]) {
    var editLayer318 = planComp318.layers.add(editSources[318]);
    editLayer318.name = "UNDLM_00318_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer318.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer318.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer318 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity318 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer318) {
    // EDIT toujours activé quand disponible
    editLayer318.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer318) {
        gradedLayer318.enabled = false;
    }
} else if (hasGradedLayer318) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer318.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText318 = planComp318.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText318.name = "WARNING_NO_EDIT";
    warningText318.property("Transform").property("Position").setValue([1280, 200]);
    warningText318.guideLayer = true;
    
    var warningTextDoc318 = warningText318.property("Source Text").value;
    warningTextDoc318.fontSize = 32;
    warningTextDoc318.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc318.font = "Arial-BoldMT";
    warningTextDoc318.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText318.property("Source Text").setValue(warningTextDoc318);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText318 = planComp318.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00318");
    errorText318.name = "ERROR_NO_SOURCE";
    errorText318.property("Transform").property("Position").setValue([1280, 720]);
    errorText318.guideLayer = true;
    
    var errorTextDoc318 = errorText318.property("Source Text").value;
    errorTextDoc318.fontSize = 48;
    errorTextDoc318.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc318.font = "Arial-BoldMT";
    errorTextDoc318.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText318.property("Source Text").setValue(errorTextDoc318);
}

planCompositions[318] = planComp318;


// Composition pour plan 00319
var planComp319 = project.items.addComp(
    "SQ19_UNDLM_00319_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp319.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer319 = planComp319.layers.add(bgSolidComp);
bgLayer319.name = "BG_SOLID";
bgLayer319.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer319 = false;
if (gradingSources[319]) {
    var gradedLayer319 = planComp319.layers.add(gradingSources[319]);
    gradedLayer319.name = "UNDLM_00319_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer319.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer319.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer319 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer319 = false;
if (editSources[319]) {
    var editLayer319 = planComp319.layers.add(editSources[319]);
    editLayer319.name = "UNDLM_00319_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer319.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer319.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer319 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity319 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer319) {
    // EDIT toujours activé quand disponible
    editLayer319.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer319) {
        gradedLayer319.enabled = false;
    }
} else if (hasGradedLayer319) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer319.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText319 = planComp319.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText319.name = "WARNING_NO_EDIT";
    warningText319.property("Transform").property("Position").setValue([1280, 200]);
    warningText319.guideLayer = true;
    
    var warningTextDoc319 = warningText319.property("Source Text").value;
    warningTextDoc319.fontSize = 32;
    warningTextDoc319.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc319.font = "Arial-BoldMT";
    warningTextDoc319.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText319.property("Source Text").setValue(warningTextDoc319);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText319 = planComp319.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00319");
    errorText319.name = "ERROR_NO_SOURCE";
    errorText319.property("Transform").property("Position").setValue([1280, 720]);
    errorText319.guideLayer = true;
    
    var errorTextDoc319 = errorText319.property("Source Text").value;
    errorTextDoc319.fontSize = 48;
    errorTextDoc319.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc319.font = "Arial-BoldMT";
    errorTextDoc319.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText319.property("Source Text").setValue(errorTextDoc319);
}

planCompositions[319] = planComp319;


// Composition pour plan 00320
var planComp320 = project.items.addComp(
    "SQ19_UNDLM_00320_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp320.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer320 = planComp320.layers.add(bgSolidComp);
bgLayer320.name = "BG_SOLID";
bgLayer320.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer320 = false;
if (gradingSources[320]) {
    var gradedLayer320 = planComp320.layers.add(gradingSources[320]);
    gradedLayer320.name = "UNDLM_00320_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer320.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer320.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer320 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer320 = false;
if (editSources[320]) {
    var editLayer320 = planComp320.layers.add(editSources[320]);
    editLayer320.name = "UNDLM_00320_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer320.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer320.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer320 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity320 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer320) {
    // EDIT toujours activé quand disponible
    editLayer320.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer320) {
        gradedLayer320.enabled = false;
    }
} else if (hasGradedLayer320) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer320.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText320 = planComp320.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText320.name = "WARNING_NO_EDIT";
    warningText320.property("Transform").property("Position").setValue([1280, 200]);
    warningText320.guideLayer = true;
    
    var warningTextDoc320 = warningText320.property("Source Text").value;
    warningTextDoc320.fontSize = 32;
    warningTextDoc320.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc320.font = "Arial-BoldMT";
    warningTextDoc320.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText320.property("Source Text").setValue(warningTextDoc320);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText320 = planComp320.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00320");
    errorText320.name = "ERROR_NO_SOURCE";
    errorText320.property("Transform").property("Position").setValue([1280, 720]);
    errorText320.guideLayer = true;
    
    var errorTextDoc320 = errorText320.property("Source Text").value;
    errorTextDoc320.fontSize = 48;
    errorTextDoc320.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc320.font = "Arial-BoldMT";
    errorTextDoc320.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText320.property("Source Text").setValue(errorTextDoc320);
}

planCompositions[320] = planComp320;


// Composition pour plan 00321
var planComp321 = project.items.addComp(
    "SQ19_UNDLM_00321_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp321.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer321 = planComp321.layers.add(bgSolidComp);
bgLayer321.name = "BG_SOLID";
bgLayer321.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer321 = false;
if (gradingSources[321]) {
    var gradedLayer321 = planComp321.layers.add(gradingSources[321]);
    gradedLayer321.name = "UNDLM_00321_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer321.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer321.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer321 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer321 = false;
if (editSources[321]) {
    var editLayer321 = planComp321.layers.add(editSources[321]);
    editLayer321.name = "UNDLM_00321_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer321.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer321.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer321 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity321 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer321) {
    // EDIT toujours activé quand disponible
    editLayer321.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer321) {
        gradedLayer321.enabled = false;
    }
} else if (hasGradedLayer321) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer321.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText321 = planComp321.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText321.name = "WARNING_NO_EDIT";
    warningText321.property("Transform").property("Position").setValue([1280, 200]);
    warningText321.guideLayer = true;
    
    var warningTextDoc321 = warningText321.property("Source Text").value;
    warningTextDoc321.fontSize = 32;
    warningTextDoc321.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc321.font = "Arial-BoldMT";
    warningTextDoc321.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText321.property("Source Text").setValue(warningTextDoc321);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText321 = planComp321.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00321");
    errorText321.name = "ERROR_NO_SOURCE";
    errorText321.property("Transform").property("Position").setValue([1280, 720]);
    errorText321.guideLayer = true;
    
    var errorTextDoc321 = errorText321.property("Source Text").value;
    errorTextDoc321.fontSize = 48;
    errorTextDoc321.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc321.font = "Arial-BoldMT";
    errorTextDoc321.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText321.property("Source Text").setValue(errorTextDoc321);
}

planCompositions[321] = planComp321;


// Composition pour plan 00322
var planComp322 = project.items.addComp(
    "SQ19_UNDLM_00322_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp322.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer322 = planComp322.layers.add(bgSolidComp);
bgLayer322.name = "BG_SOLID";
bgLayer322.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer322 = false;
if (gradingSources[322]) {
    var gradedLayer322 = planComp322.layers.add(gradingSources[322]);
    gradedLayer322.name = "UNDLM_00322_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer322.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer322.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer322 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer322 = false;
if (editSources[322]) {
    var editLayer322 = planComp322.layers.add(editSources[322]);
    editLayer322.name = "UNDLM_00322_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer322.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer322.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer322 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity322 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer322) {
    // EDIT toujours activé quand disponible
    editLayer322.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer322) {
        gradedLayer322.enabled = false;
    }
} else if (hasGradedLayer322) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer322.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText322 = planComp322.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText322.name = "WARNING_NO_EDIT";
    warningText322.property("Transform").property("Position").setValue([1280, 200]);
    warningText322.guideLayer = true;
    
    var warningTextDoc322 = warningText322.property("Source Text").value;
    warningTextDoc322.fontSize = 32;
    warningTextDoc322.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc322.font = "Arial-BoldMT";
    warningTextDoc322.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText322.property("Source Text").setValue(warningTextDoc322);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText322 = planComp322.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00322");
    errorText322.name = "ERROR_NO_SOURCE";
    errorText322.property("Transform").property("Position").setValue([1280, 720]);
    errorText322.guideLayer = true;
    
    var errorTextDoc322 = errorText322.property("Source Text").value;
    errorTextDoc322.fontSize = 48;
    errorTextDoc322.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc322.font = "Arial-BoldMT";
    errorTextDoc322.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText322.property("Source Text").setValue(errorTextDoc322);
}

planCompositions[322] = planComp322;


// Composition pour plan 00323
var planComp323 = project.items.addComp(
    "SQ19_UNDLM_00323_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp323.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer323 = planComp323.layers.add(bgSolidComp);
bgLayer323.name = "BG_SOLID";
bgLayer323.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer323 = false;
if (gradingSources[323]) {
    var gradedLayer323 = planComp323.layers.add(gradingSources[323]);
    gradedLayer323.name = "UNDLM_00323_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer323.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer323.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer323 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer323 = false;
if (editSources[323]) {
    var editLayer323 = planComp323.layers.add(editSources[323]);
    editLayer323.name = "UNDLM_00323_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer323.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer323.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer323 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity323 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer323) {
    // EDIT toujours activé quand disponible
    editLayer323.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer323) {
        gradedLayer323.enabled = false;
    }
} else if (hasGradedLayer323) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer323.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText323 = planComp323.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText323.name = "WARNING_NO_EDIT";
    warningText323.property("Transform").property("Position").setValue([1280, 200]);
    warningText323.guideLayer = true;
    
    var warningTextDoc323 = warningText323.property("Source Text").value;
    warningTextDoc323.fontSize = 32;
    warningTextDoc323.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc323.font = "Arial-BoldMT";
    warningTextDoc323.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText323.property("Source Text").setValue(warningTextDoc323);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText323 = planComp323.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00323");
    errorText323.name = "ERROR_NO_SOURCE";
    errorText323.property("Transform").property("Position").setValue([1280, 720]);
    errorText323.guideLayer = true;
    
    var errorTextDoc323 = errorText323.property("Source Text").value;
    errorTextDoc323.fontSize = 48;
    errorTextDoc323.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc323.font = "Arial-BoldMT";
    errorTextDoc323.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText323.property("Source Text").setValue(errorTextDoc323);
}

planCompositions[323] = planComp323;


// Composition pour plan 00324
var planComp324 = project.items.addComp(
    "SQ19_UNDLM_00324_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp324.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer324 = planComp324.layers.add(bgSolidComp);
bgLayer324.name = "BG_SOLID";
bgLayer324.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer324 = false;
if (gradingSources[324]) {
    var gradedLayer324 = planComp324.layers.add(gradingSources[324]);
    gradedLayer324.name = "UNDLM_00324_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer324.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer324.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer324 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer324 = false;
if (editSources[324]) {
    var editLayer324 = planComp324.layers.add(editSources[324]);
    editLayer324.name = "UNDLM_00324_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer324.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer324.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer324 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity324 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer324) {
    // EDIT toujours activé quand disponible
    editLayer324.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer324) {
        gradedLayer324.enabled = false;
    }
} else if (hasGradedLayer324) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer324.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText324 = planComp324.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText324.name = "WARNING_NO_EDIT";
    warningText324.property("Transform").property("Position").setValue([1280, 200]);
    warningText324.guideLayer = true;
    
    var warningTextDoc324 = warningText324.property("Source Text").value;
    warningTextDoc324.fontSize = 32;
    warningTextDoc324.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc324.font = "Arial-BoldMT";
    warningTextDoc324.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText324.property("Source Text").setValue(warningTextDoc324);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText324 = planComp324.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00324");
    errorText324.name = "ERROR_NO_SOURCE";
    errorText324.property("Transform").property("Position").setValue([1280, 720]);
    errorText324.guideLayer = true;
    
    var errorTextDoc324 = errorText324.property("Source Text").value;
    errorTextDoc324.fontSize = 48;
    errorTextDoc324.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc324.font = "Arial-BoldMT";
    errorTextDoc324.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText324.property("Source Text").setValue(errorTextDoc324);
}

planCompositions[324] = planComp324;


// Composition pour plan 00325
var planComp325 = project.items.addComp(
    "SQ19_UNDLM_00325_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp325.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer325 = planComp325.layers.add(bgSolidComp);
bgLayer325.name = "BG_SOLID";
bgLayer325.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer325 = false;
if (gradingSources[325]) {
    var gradedLayer325 = planComp325.layers.add(gradingSources[325]);
    gradedLayer325.name = "UNDLM_00325_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer325.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer325.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer325 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer325 = false;
if (editSources[325]) {
    var editLayer325 = planComp325.layers.add(editSources[325]);
    editLayer325.name = "UNDLM_00325_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer325.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer325.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer325 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity325 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer325) {
    // EDIT toujours activé quand disponible
    editLayer325.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer325) {
        gradedLayer325.enabled = false;
    }
} else if (hasGradedLayer325) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer325.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText325 = planComp325.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText325.name = "WARNING_NO_EDIT";
    warningText325.property("Transform").property("Position").setValue([1280, 200]);
    warningText325.guideLayer = true;
    
    var warningTextDoc325 = warningText325.property("Source Text").value;
    warningTextDoc325.fontSize = 32;
    warningTextDoc325.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc325.font = "Arial-BoldMT";
    warningTextDoc325.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText325.property("Source Text").setValue(warningTextDoc325);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText325 = planComp325.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00325");
    errorText325.name = "ERROR_NO_SOURCE";
    errorText325.property("Transform").property("Position").setValue([1280, 720]);
    errorText325.guideLayer = true;
    
    var errorTextDoc325 = errorText325.property("Source Text").value;
    errorTextDoc325.fontSize = 48;
    errorTextDoc325.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc325.font = "Arial-BoldMT";
    errorTextDoc325.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText325.property("Source Text").setValue(errorTextDoc325);
}

planCompositions[325] = planComp325;


// Composition pour plan 00326
var planComp326 = project.items.addComp(
    "SQ19_UNDLM_00326_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp326.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer326 = planComp326.layers.add(bgSolidComp);
bgLayer326.name = "BG_SOLID";
bgLayer326.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer326 = false;
if (gradingSources[326]) {
    var gradedLayer326 = planComp326.layers.add(gradingSources[326]);
    gradedLayer326.name = "UNDLM_00326_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer326.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer326.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer326 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer326 = false;
if (editSources[326]) {
    var editLayer326 = planComp326.layers.add(editSources[326]);
    editLayer326.name = "UNDLM_00326_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer326.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer326.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer326 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity326 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer326) {
    // EDIT toujours activé quand disponible
    editLayer326.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer326) {
        gradedLayer326.enabled = false;
    }
} else if (hasGradedLayer326) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer326.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText326 = planComp326.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText326.name = "WARNING_NO_EDIT";
    warningText326.property("Transform").property("Position").setValue([1280, 200]);
    warningText326.guideLayer = true;
    
    var warningTextDoc326 = warningText326.property("Source Text").value;
    warningTextDoc326.fontSize = 32;
    warningTextDoc326.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc326.font = "Arial-BoldMT";
    warningTextDoc326.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText326.property("Source Text").setValue(warningTextDoc326);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText326 = planComp326.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00326");
    errorText326.name = "ERROR_NO_SOURCE";
    errorText326.property("Transform").property("Position").setValue([1280, 720]);
    errorText326.guideLayer = true;
    
    var errorTextDoc326 = errorText326.property("Source Text").value;
    errorTextDoc326.fontSize = 48;
    errorTextDoc326.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc326.font = "Arial-BoldMT";
    errorTextDoc326.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText326.property("Source Text").setValue(errorTextDoc326);
}

planCompositions[326] = planComp326;


// Composition pour plan 00327
var planComp327 = project.items.addComp(
    "SQ19_UNDLM_00327_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp327.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer327 = planComp327.layers.add(bgSolidComp);
bgLayer327.name = "BG_SOLID";
bgLayer327.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer327 = false;
if (gradingSources[327]) {
    var gradedLayer327 = planComp327.layers.add(gradingSources[327]);
    gradedLayer327.name = "UNDLM_00327_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer327.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer327.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer327 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer327 = false;
if (editSources[327]) {
    var editLayer327 = planComp327.layers.add(editSources[327]);
    editLayer327.name = "UNDLM_00327_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer327.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer327.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer327 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity327 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer327) {
    // EDIT toujours activé quand disponible
    editLayer327.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer327) {
        gradedLayer327.enabled = false;
    }
} else if (hasGradedLayer327) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer327.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText327 = planComp327.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText327.name = "WARNING_NO_EDIT";
    warningText327.property("Transform").property("Position").setValue([1280, 200]);
    warningText327.guideLayer = true;
    
    var warningTextDoc327 = warningText327.property("Source Text").value;
    warningTextDoc327.fontSize = 32;
    warningTextDoc327.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc327.font = "Arial-BoldMT";
    warningTextDoc327.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText327.property("Source Text").setValue(warningTextDoc327);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText327 = planComp327.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00327");
    errorText327.name = "ERROR_NO_SOURCE";
    errorText327.property("Transform").property("Position").setValue([1280, 720]);
    errorText327.guideLayer = true;
    
    var errorTextDoc327 = errorText327.property("Source Text").value;
    errorTextDoc327.fontSize = 48;
    errorTextDoc327.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc327.font = "Arial-BoldMT";
    errorTextDoc327.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText327.property("Source Text").setValue(errorTextDoc327);
}

planCompositions[327] = planComp327;


// Composition pour plan 00328
var planComp328 = project.items.addComp(
    "SQ19_UNDLM_00328_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.32,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp328.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer328 = planComp328.layers.add(bgSolidComp);
bgLayer328.name = "BG_SOLID";
bgLayer328.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer328 = false;
if (gradingSources[328]) {
    var gradedLayer328 = planComp328.layers.add(gradingSources[328]);
    gradedLayer328.name = "UNDLM_00328_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer328.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer328.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer328 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer328 = false;
if (editSources[328]) {
    var editLayer328 = planComp328.layers.add(editSources[328]);
    editLayer328.name = "UNDLM_00328_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer328.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer328.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer328 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity328 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer328) {
    // EDIT toujours activé quand disponible
    editLayer328.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer328) {
        gradedLayer328.enabled = false;
    }
} else if (hasGradedLayer328) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer328.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText328 = planComp328.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText328.name = "WARNING_NO_EDIT";
    warningText328.property("Transform").property("Position").setValue([1280, 200]);
    warningText328.guideLayer = true;
    
    var warningTextDoc328 = warningText328.property("Source Text").value;
    warningTextDoc328.fontSize = 32;
    warningTextDoc328.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc328.font = "Arial-BoldMT";
    warningTextDoc328.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText328.property("Source Text").setValue(warningTextDoc328);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText328 = planComp328.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00328");
    errorText328.name = "ERROR_NO_SOURCE";
    errorText328.property("Transform").property("Position").setValue([1280, 720]);
    errorText328.guideLayer = true;
    
    var errorTextDoc328 = errorText328.property("Source Text").value;
    errorTextDoc328.fontSize = 48;
    errorTextDoc328.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc328.font = "Arial-BoldMT";
    errorTextDoc328.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText328.property("Source Text").setValue(errorTextDoc328);
}

planCompositions[328] = planComp328;


// Composition pour plan 00329
var planComp329 = project.items.addComp(
    "SQ19_UNDLM_00329_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    11.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp329.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer329 = planComp329.layers.add(bgSolidComp);
bgLayer329.name = "BG_SOLID";
bgLayer329.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer329 = false;
if (gradingSources[329]) {
    var gradedLayer329 = planComp329.layers.add(gradingSources[329]);
    gradedLayer329.name = "UNDLM_00329_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer329.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer329.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer329 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer329 = false;
if (editSources[329]) {
    var editLayer329 = planComp329.layers.add(editSources[329]);
    editLayer329.name = "UNDLM_00329_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer329.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer329.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer329 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity329 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer329) {
    // EDIT toujours activé quand disponible
    editLayer329.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer329) {
        gradedLayer329.enabled = false;
    }
} else if (hasGradedLayer329) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer329.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText329 = planComp329.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText329.name = "WARNING_NO_EDIT";
    warningText329.property("Transform").property("Position").setValue([1280, 200]);
    warningText329.guideLayer = true;
    
    var warningTextDoc329 = warningText329.property("Source Text").value;
    warningTextDoc329.fontSize = 32;
    warningTextDoc329.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc329.font = "Arial-BoldMT";
    warningTextDoc329.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText329.property("Source Text").setValue(warningTextDoc329);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText329 = planComp329.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00329");
    errorText329.name = "ERROR_NO_SOURCE";
    errorText329.property("Transform").property("Position").setValue([1280, 720]);
    errorText329.guideLayer = true;
    
    var errorTextDoc329 = errorText329.property("Source Text").value;
    errorTextDoc329.fontSize = 48;
    errorTextDoc329.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc329.font = "Arial-BoldMT";
    errorTextDoc329.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText329.property("Source Text").setValue(errorTextDoc329);
}

planCompositions[329] = planComp329;


// Composition pour plan 00330
var planComp330 = project.items.addComp(
    "SQ19_UNDLM_00330_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    17.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp330.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer330 = planComp330.layers.add(bgSolidComp);
bgLayer330.name = "BG_SOLID";
bgLayer330.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer330 = false;
if (gradingSources[330]) {
    var gradedLayer330 = planComp330.layers.add(gradingSources[330]);
    gradedLayer330.name = "UNDLM_00330_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer330.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer330.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer330 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer330 = false;
if (editSources[330]) {
    var editLayer330 = planComp330.layers.add(editSources[330]);
    editLayer330.name = "UNDLM_00330_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer330.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer330.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer330 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity330 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer330) {
    // EDIT toujours activé quand disponible
    editLayer330.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer330) {
        gradedLayer330.enabled = false;
    }
} else if (hasGradedLayer330) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer330.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText330 = planComp330.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText330.name = "WARNING_NO_EDIT";
    warningText330.property("Transform").property("Position").setValue([1280, 200]);
    warningText330.guideLayer = true;
    
    var warningTextDoc330 = warningText330.property("Source Text").value;
    warningTextDoc330.fontSize = 32;
    warningTextDoc330.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc330.font = "Arial-BoldMT";
    warningTextDoc330.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText330.property("Source Text").setValue(warningTextDoc330);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText330 = planComp330.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00330");
    errorText330.name = "ERROR_NO_SOURCE";
    errorText330.property("Transform").property("Position").setValue([1280, 720]);
    errorText330.guideLayer = true;
    
    var errorTextDoc330 = errorText330.property("Source Text").value;
    errorTextDoc330.fontSize = 48;
    errorTextDoc330.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc330.font = "Arial-BoldMT";
    errorTextDoc330.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText330.property("Source Text").setValue(errorTextDoc330);
}

planCompositions[330] = planComp330;


// Composition pour plan 00331
var planComp331 = project.items.addComp(
    "SQ19_UNDLM_00331_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    26.64,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp331.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer331 = planComp331.layers.add(bgSolidComp);
bgLayer331.name = "BG_SOLID";
bgLayer331.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer331 = false;
if (gradingSources[331]) {
    var gradedLayer331 = planComp331.layers.add(gradingSources[331]);
    gradedLayer331.name = "UNDLM_00331_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer331.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer331.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer331 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer331 = false;
if (editSources[331]) {
    var editLayer331 = planComp331.layers.add(editSources[331]);
    editLayer331.name = "UNDLM_00331_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer331.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer331.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer331 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity331 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer331) {
    // EDIT toujours activé quand disponible
    editLayer331.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer331) {
        gradedLayer331.enabled = false;
    }
} else if (hasGradedLayer331) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer331.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText331 = planComp331.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText331.name = "WARNING_NO_EDIT";
    warningText331.property("Transform").property("Position").setValue([1280, 200]);
    warningText331.guideLayer = true;
    
    var warningTextDoc331 = warningText331.property("Source Text").value;
    warningTextDoc331.fontSize = 32;
    warningTextDoc331.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc331.font = "Arial-BoldMT";
    warningTextDoc331.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText331.property("Source Text").setValue(warningTextDoc331);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText331 = planComp331.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00331");
    errorText331.name = "ERROR_NO_SOURCE";
    errorText331.property("Transform").property("Position").setValue([1280, 720]);
    errorText331.guideLayer = true;
    
    var errorTextDoc331 = errorText331.property("Source Text").value;
    errorTextDoc331.fontSize = 48;
    errorTextDoc331.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc331.font = "Arial-BoldMT";
    errorTextDoc331.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText331.property("Source Text").setValue(errorTextDoc331);
}

planCompositions[331] = planComp331;


// Composition pour plan 00332
var planComp332 = project.items.addComp(
    "SQ19_UNDLM_00332_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.2800000000000002,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp332.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer332 = planComp332.layers.add(bgSolidComp);
bgLayer332.name = "BG_SOLID";
bgLayer332.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer332 = false;
if (gradingSources[332]) {
    var gradedLayer332 = planComp332.layers.add(gradingSources[332]);
    gradedLayer332.name = "UNDLM_00332_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer332.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer332.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer332 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer332 = false;
if (editSources[332]) {
    var editLayer332 = planComp332.layers.add(editSources[332]);
    editLayer332.name = "UNDLM_00332_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer332.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer332.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer332 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity332 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer332) {
    // EDIT toujours activé quand disponible
    editLayer332.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer332) {
        gradedLayer332.enabled = false;
    }
} else if (hasGradedLayer332) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer332.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText332 = planComp332.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText332.name = "WARNING_NO_EDIT";
    warningText332.property("Transform").property("Position").setValue([1280, 200]);
    warningText332.guideLayer = true;
    
    var warningTextDoc332 = warningText332.property("Source Text").value;
    warningTextDoc332.fontSize = 32;
    warningTextDoc332.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc332.font = "Arial-BoldMT";
    warningTextDoc332.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText332.property("Source Text").setValue(warningTextDoc332);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText332 = planComp332.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00332");
    errorText332.name = "ERROR_NO_SOURCE";
    errorText332.property("Transform").property("Position").setValue([1280, 720]);
    errorText332.guideLayer = true;
    
    var errorTextDoc332 = errorText332.property("Source Text").value;
    errorTextDoc332.fontSize = 48;
    errorTextDoc332.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc332.font = "Arial-BoldMT";
    errorTextDoc332.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText332.property("Source Text").setValue(errorTextDoc332);
}

planCompositions[332] = planComp332;


// Composition pour plan 00333
var planComp333 = project.items.addComp(
    "SQ19_UNDLM_00333_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp333.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer333 = planComp333.layers.add(bgSolidComp);
bgLayer333.name = "BG_SOLID";
bgLayer333.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer333 = false;
if (gradingSources[333]) {
    var gradedLayer333 = planComp333.layers.add(gradingSources[333]);
    gradedLayer333.name = "UNDLM_00333_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer333.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer333.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer333 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer333 = false;
if (editSources[333]) {
    var editLayer333 = planComp333.layers.add(editSources[333]);
    editLayer333.name = "UNDLM_00333_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer333.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer333.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer333 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity333 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer333) {
    // EDIT toujours activé quand disponible
    editLayer333.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer333) {
        gradedLayer333.enabled = false;
    }
} else if (hasGradedLayer333) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer333.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText333 = planComp333.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText333.name = "WARNING_NO_EDIT";
    warningText333.property("Transform").property("Position").setValue([1280, 200]);
    warningText333.guideLayer = true;
    
    var warningTextDoc333 = warningText333.property("Source Text").value;
    warningTextDoc333.fontSize = 32;
    warningTextDoc333.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc333.font = "Arial-BoldMT";
    warningTextDoc333.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText333.property("Source Text").setValue(warningTextDoc333);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText333 = planComp333.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00333");
    errorText333.name = "ERROR_NO_SOURCE";
    errorText333.property("Transform").property("Position").setValue([1280, 720]);
    errorText333.guideLayer = true;
    
    var errorTextDoc333 = errorText333.property("Source Text").value;
    errorTextDoc333.fontSize = 48;
    errorTextDoc333.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc333.font = "Arial-BoldMT";
    errorTextDoc333.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText333.property("Source Text").setValue(errorTextDoc333);
}

planCompositions[333] = planComp333;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ19_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    129.2, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00318 à la timeline master
if (planCompositions[318]) {
    var masterLayer318 = masterComp.layers.add(planCompositions[318]);
    masterLayer318.startTime = 0;
    masterLayer318.name = "UNDLM_00318";
    masterLayer318.label = 1; // Couleurs alternées
}

// Ajouter plan 00319 à la timeline master
if (planCompositions[319]) {
    var masterLayer319 = masterComp.layers.add(planCompositions[319]);
    masterLayer319.startTime = 8.48;
    masterLayer319.name = "UNDLM_00319";
    masterLayer319.label = 2; // Couleurs alternées
}

// Ajouter plan 00320 à la timeline master
if (planCompositions[320]) {
    var masterLayer320 = masterComp.layers.add(planCompositions[320]);
    masterLayer320.startTime = 12.84;
    masterLayer320.name = "UNDLM_00320";
    masterLayer320.label = 3; // Couleurs alternées
}

// Ajouter plan 00321 à la timeline master
if (planCompositions[321]) {
    var masterLayer321 = masterComp.layers.add(planCompositions[321]);
    masterLayer321.startTime = 18.2;
    masterLayer321.name = "UNDLM_00321";
    masterLayer321.label = 4; // Couleurs alternées
}

// Ajouter plan 00322 à la timeline master
if (planCompositions[322]) {
    var masterLayer322 = masterComp.layers.add(planCompositions[322]);
    masterLayer322.startTime = 24.96;
    masterLayer322.name = "UNDLM_00322";
    masterLayer322.label = 5; // Couleurs alternées
}

// Ajouter plan 00323 à la timeline master
if (planCompositions[323]) {
    var masterLayer323 = masterComp.layers.add(planCompositions[323]);
    masterLayer323.startTime = 30.04;
    masterLayer323.name = "UNDLM_00323";
    masterLayer323.label = 6; // Couleurs alternées
}

// Ajouter plan 00324 à la timeline master
if (planCompositions[324]) {
    var masterLayer324 = masterComp.layers.add(planCompositions[324]);
    masterLayer324.startTime = 39.8;
    masterLayer324.name = "UNDLM_00324";
    masterLayer324.label = 7; // Couleurs alternées
}

// Ajouter plan 00325 à la timeline master
if (planCompositions[325]) {
    var masterLayer325 = masterComp.layers.add(planCompositions[325]);
    masterLayer325.startTime = 44.16;
    masterLayer325.name = "UNDLM_00325";
    masterLayer325.label = 8; // Couleurs alternées
}

// Ajouter plan 00326 à la timeline master
if (planCompositions[326]) {
    var masterLayer326 = masterComp.layers.add(planCompositions[326]);
    masterLayer326.startTime = 48.0;
    masterLayer326.name = "UNDLM_00326";
    masterLayer326.label = 9; // Couleurs alternées
}

// Ajouter plan 00327 à la timeline master
if (planCompositions[327]) {
    var masterLayer327 = masterComp.layers.add(planCompositions[327]);
    masterLayer327.startTime = 54.08;
    masterLayer327.name = "UNDLM_00327";
    masterLayer327.label = 10; // Couleurs alternées
}

// Ajouter plan 00328 à la timeline master
if (planCompositions[328]) {
    var masterLayer328 = masterComp.layers.add(planCompositions[328]);
    masterLayer328.startTime = 58.8;
    masterLayer328.name = "UNDLM_00328";
    masterLayer328.label = 11; // Couleurs alternées
}

// Ajouter plan 00329 à la timeline master
if (planCompositions[329]) {
    var masterLayer329 = masterComp.layers.add(planCompositions[329]);
    masterLayer329.startTime = 67.12;
    masterLayer329.name = "UNDLM_00329";
    masterLayer329.label = 12; // Couleurs alternées
}

// Ajouter plan 00330 à la timeline master
if (planCompositions[330]) {
    var masterLayer330 = masterComp.layers.add(planCompositions[330]);
    masterLayer330.startTime = 78.36;
    masterLayer330.name = "UNDLM_00330";
    masterLayer330.label = 13; // Couleurs alternées
}

// Ajouter plan 00331 à la timeline master
if (planCompositions[331]) {
    var masterLayer331 = masterComp.layers.add(planCompositions[331]);
    masterLayer331.startTime = 96.03999999999999;
    masterLayer331.name = "UNDLM_00331";
    masterLayer331.label = 14; // Couleurs alternées
}

// Ajouter plan 00332 à la timeline master
if (planCompositions[332]) {
    var masterLayer332 = masterComp.layers.add(planCompositions[332]);
    masterLayer332.startTime = 122.67999999999999;
    masterLayer332.name = "UNDLM_00332";
    masterLayer332.label = 15; // Couleurs alternées
}

// Ajouter plan 00333 à la timeline master
if (planCompositions[333]) {
    var masterLayer333 = masterComp.layers.add(planCompositions[333]);
    masterLayer333.startTime = 125.96;
    masterLayer333.name = "UNDLM_00333";
    masterLayer333.label = 16; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ19";\n' +
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
    {start: 0, end: 8.48, name: "UNDLM_00318"},
    {start: 8.48, end: 12.84, name: "UNDLM_00319"},
    {start: 12.84, end: 18.2, name: "UNDLM_00320"},
    {start: 18.2, end: 24.96, name: "UNDLM_00321"},
    {start: 24.96, end: 30.04, name: "UNDLM_00322"},
    {start: 30.04, end: 39.8, name: "UNDLM_00323"},
    {start: 39.8, end: 44.16, name: "UNDLM_00324"},
    {start: 44.16, end: 48.0, name: "UNDLM_00325"},
    {start: 48.0, end: 54.08, name: "UNDLM_00326"},
    {start: 54.08, end: 58.8, name: "UNDLM_00327"},
    {start: 58.8, end: 67.12, name: "UNDLM_00328"},
    {start: 67.12, end: 78.36, name: "UNDLM_00329"},
    {start: 78.36, end: 96.03999999999999, name: "UNDLM_00330"},
    {start: 96.03999999999999, end: 122.67999999999999, name: "UNDLM_00331"},
    {start: 122.67999999999999, end: 125.96, name: "UNDLM_00332"},
    {start: 125.96, end: 129.2, name: "UNDLM_00333"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ19/_AE/SQ19_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 16;
var totalCount = 16;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ19 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(129.2 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ19_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ19:" + totalCount + ":" + gradedCount);
