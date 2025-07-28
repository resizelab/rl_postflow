
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ23 avec 24 plans
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


// Import plan EDIT 00401
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile401 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00401.mov");
var editFilePoignees401 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00401_AVEC_POIGNEES.mov");
var editFileBis401 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00401bis.mov");

var importSuccess401 = false;
var fileName401 = "";

// Tenter import standard
if (editFile401.exists) {
    try {
        var editFootage401 = project.importFile(new ImportOptions(editFile401));
        editFootage401.parentFolder = fromEditFolder;
        editFootage401.name = "UNDLM_00401";
        editSources[401] = editFootage401;
        editImportCount++;
        importSuccess401 = true;
        fileName401 = "UNDLM_00401.mov";
        logImportSuccess(401, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00401.mov", fileName401);
    } catch (e) {
        logImportError(401, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00401.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess401 && editFilePoignees401.exists) {
    try {
        var editFootage401 = project.importFile(new ImportOptions(editFilePoignees401));
        editFootage401.parentFolder = fromEditFolder;
        editFootage401.name = "UNDLM_00401_AVEC_POIGNEES";
        editSources[401] = editFootage401;
        editImportCount++;
        importSuccess401 = true;
        fileName401 = "UNDLM_00401_AVEC_POIGNEES.mov";
        logImportSuccess(401, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00401_AVEC_POIGNEES.mov", fileName401);
    } catch (e) {
        logImportError(401, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00401_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess401 && editFileBis401.exists) {
    try {
        var editFootage401 = project.importFile(new ImportOptions(editFileBis401));
        editFootage401.parentFolder = fromEditFolder;
        editFootage401.name = "UNDLM_00401bis";
        editSources[401] = editFootage401;
        editImportCount++;
        importSuccess401 = true;
        fileName401 = "UNDLM_00401bis.mov";
        logImportSuccess(401, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00401bis.mov", fileName401);
    } catch (e) {
        logImportError(401, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00401bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess401) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00401.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00402
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile402 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00402.mov");
var editFilePoignees402 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00402_AVEC_POIGNEES.mov");
var editFileBis402 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00402bis.mov");

var importSuccess402 = false;
var fileName402 = "";

// Tenter import standard
if (editFile402.exists) {
    try {
        var editFootage402 = project.importFile(new ImportOptions(editFile402));
        editFootage402.parentFolder = fromEditFolder;
        editFootage402.name = "UNDLM_00402";
        editSources[402] = editFootage402;
        editImportCount++;
        importSuccess402 = true;
        fileName402 = "UNDLM_00402.mov";
        logImportSuccess(402, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00402.mov", fileName402);
    } catch (e) {
        logImportError(402, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00402.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess402 && editFilePoignees402.exists) {
    try {
        var editFootage402 = project.importFile(new ImportOptions(editFilePoignees402));
        editFootage402.parentFolder = fromEditFolder;
        editFootage402.name = "UNDLM_00402_AVEC_POIGNEES";
        editSources[402] = editFootage402;
        editImportCount++;
        importSuccess402 = true;
        fileName402 = "UNDLM_00402_AVEC_POIGNEES.mov";
        logImportSuccess(402, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00402_AVEC_POIGNEES.mov", fileName402);
    } catch (e) {
        logImportError(402, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00402_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess402 && editFileBis402.exists) {
    try {
        var editFootage402 = project.importFile(new ImportOptions(editFileBis402));
        editFootage402.parentFolder = fromEditFolder;
        editFootage402.name = "UNDLM_00402bis";
        editSources[402] = editFootage402;
        editImportCount++;
        importSuccess402 = true;
        fileName402 = "UNDLM_00402bis.mov";
        logImportSuccess(402, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00402bis.mov", fileName402);
    } catch (e) {
        logImportError(402, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00402bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess402) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00402.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00403
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile403 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00403.mov");
var editFilePoignees403 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00403_AVEC_POIGNEES.mov");
var editFileBis403 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00403bis.mov");

var importSuccess403 = false;
var fileName403 = "";

// Tenter import standard
if (editFile403.exists) {
    try {
        var editFootage403 = project.importFile(new ImportOptions(editFile403));
        editFootage403.parentFolder = fromEditFolder;
        editFootage403.name = "UNDLM_00403";
        editSources[403] = editFootage403;
        editImportCount++;
        importSuccess403 = true;
        fileName403 = "UNDLM_00403.mov";
        logImportSuccess(403, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00403.mov", fileName403);
    } catch (e) {
        logImportError(403, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00403.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess403 && editFilePoignees403.exists) {
    try {
        var editFootage403 = project.importFile(new ImportOptions(editFilePoignees403));
        editFootage403.parentFolder = fromEditFolder;
        editFootage403.name = "UNDLM_00403_AVEC_POIGNEES";
        editSources[403] = editFootage403;
        editImportCount++;
        importSuccess403 = true;
        fileName403 = "UNDLM_00403_AVEC_POIGNEES.mov";
        logImportSuccess(403, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00403_AVEC_POIGNEES.mov", fileName403);
    } catch (e) {
        logImportError(403, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00403_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess403 && editFileBis403.exists) {
    try {
        var editFootage403 = project.importFile(new ImportOptions(editFileBis403));
        editFootage403.parentFolder = fromEditFolder;
        editFootage403.name = "UNDLM_00403bis";
        editSources[403] = editFootage403;
        editImportCount++;
        importSuccess403 = true;
        fileName403 = "UNDLM_00403bis.mov";
        logImportSuccess(403, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00403bis.mov", fileName403);
    } catch (e) {
        logImportError(403, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00403bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess403) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00403.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00404
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile404 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00404.mov");
var editFilePoignees404 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00404_AVEC_POIGNEES.mov");
var editFileBis404 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00404bis.mov");

var importSuccess404 = false;
var fileName404 = "";

// Tenter import standard
if (editFile404.exists) {
    try {
        var editFootage404 = project.importFile(new ImportOptions(editFile404));
        editFootage404.parentFolder = fromEditFolder;
        editFootage404.name = "UNDLM_00404";
        editSources[404] = editFootage404;
        editImportCount++;
        importSuccess404 = true;
        fileName404 = "UNDLM_00404.mov";
        logImportSuccess(404, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00404.mov", fileName404);
    } catch (e) {
        logImportError(404, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00404.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess404 && editFilePoignees404.exists) {
    try {
        var editFootage404 = project.importFile(new ImportOptions(editFilePoignees404));
        editFootage404.parentFolder = fromEditFolder;
        editFootage404.name = "UNDLM_00404_AVEC_POIGNEES";
        editSources[404] = editFootage404;
        editImportCount++;
        importSuccess404 = true;
        fileName404 = "UNDLM_00404_AVEC_POIGNEES.mov";
        logImportSuccess(404, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00404_AVEC_POIGNEES.mov", fileName404);
    } catch (e) {
        logImportError(404, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00404_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess404 && editFileBis404.exists) {
    try {
        var editFootage404 = project.importFile(new ImportOptions(editFileBis404));
        editFootage404.parentFolder = fromEditFolder;
        editFootage404.name = "UNDLM_00404bis";
        editSources[404] = editFootage404;
        editImportCount++;
        importSuccess404 = true;
        fileName404 = "UNDLM_00404bis.mov";
        logImportSuccess(404, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00404bis.mov", fileName404);
    } catch (e) {
        logImportError(404, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00404bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess404) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00404.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00405
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile405 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00405.mov");
var editFilePoignees405 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00405_AVEC_POIGNEES.mov");
var editFileBis405 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00405bis.mov");

var importSuccess405 = false;
var fileName405 = "";

// Tenter import standard
if (editFile405.exists) {
    try {
        var editFootage405 = project.importFile(new ImportOptions(editFile405));
        editFootage405.parentFolder = fromEditFolder;
        editFootage405.name = "UNDLM_00405";
        editSources[405] = editFootage405;
        editImportCount++;
        importSuccess405 = true;
        fileName405 = "UNDLM_00405.mov";
        logImportSuccess(405, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00405.mov", fileName405);
    } catch (e) {
        logImportError(405, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00405.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess405 && editFilePoignees405.exists) {
    try {
        var editFootage405 = project.importFile(new ImportOptions(editFilePoignees405));
        editFootage405.parentFolder = fromEditFolder;
        editFootage405.name = "UNDLM_00405_AVEC_POIGNEES";
        editSources[405] = editFootage405;
        editImportCount++;
        importSuccess405 = true;
        fileName405 = "UNDLM_00405_AVEC_POIGNEES.mov";
        logImportSuccess(405, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00405_AVEC_POIGNEES.mov", fileName405);
    } catch (e) {
        logImportError(405, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00405_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess405 && editFileBis405.exists) {
    try {
        var editFootage405 = project.importFile(new ImportOptions(editFileBis405));
        editFootage405.parentFolder = fromEditFolder;
        editFootage405.name = "UNDLM_00405bis";
        editSources[405] = editFootage405;
        editImportCount++;
        importSuccess405 = true;
        fileName405 = "UNDLM_00405bis.mov";
        logImportSuccess(405, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00405bis.mov", fileName405);
    } catch (e) {
        logImportError(405, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00405bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess405) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00405.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00406
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile406 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00406.mov");
var editFilePoignees406 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00406_AVEC_POIGNEES.mov");
var editFileBis406 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00406bis.mov");

var importSuccess406 = false;
var fileName406 = "";

// Tenter import standard
if (editFile406.exists) {
    try {
        var editFootage406 = project.importFile(new ImportOptions(editFile406));
        editFootage406.parentFolder = fromEditFolder;
        editFootage406.name = "UNDLM_00406";
        editSources[406] = editFootage406;
        editImportCount++;
        importSuccess406 = true;
        fileName406 = "UNDLM_00406.mov";
        logImportSuccess(406, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00406.mov", fileName406);
    } catch (e) {
        logImportError(406, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00406.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess406 && editFilePoignees406.exists) {
    try {
        var editFootage406 = project.importFile(new ImportOptions(editFilePoignees406));
        editFootage406.parentFolder = fromEditFolder;
        editFootage406.name = "UNDLM_00406_AVEC_POIGNEES";
        editSources[406] = editFootage406;
        editImportCount++;
        importSuccess406 = true;
        fileName406 = "UNDLM_00406_AVEC_POIGNEES.mov";
        logImportSuccess(406, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00406_AVEC_POIGNEES.mov", fileName406);
    } catch (e) {
        logImportError(406, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00406_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess406 && editFileBis406.exists) {
    try {
        var editFootage406 = project.importFile(new ImportOptions(editFileBis406));
        editFootage406.parentFolder = fromEditFolder;
        editFootage406.name = "UNDLM_00406bis";
        editSources[406] = editFootage406;
        editImportCount++;
        importSuccess406 = true;
        fileName406 = "UNDLM_00406bis.mov";
        logImportSuccess(406, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00406bis.mov", fileName406);
    } catch (e) {
        logImportError(406, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00406bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess406) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00406.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00407
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile407 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00407.mov");
var editFilePoignees407 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00407_AVEC_POIGNEES.mov");
var editFileBis407 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00407bis.mov");

var importSuccess407 = false;
var fileName407 = "";

// Tenter import standard
if (editFile407.exists) {
    try {
        var editFootage407 = project.importFile(new ImportOptions(editFile407));
        editFootage407.parentFolder = fromEditFolder;
        editFootage407.name = "UNDLM_00407";
        editSources[407] = editFootage407;
        editImportCount++;
        importSuccess407 = true;
        fileName407 = "UNDLM_00407.mov";
        logImportSuccess(407, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00407.mov", fileName407);
    } catch (e) {
        logImportError(407, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00407.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess407 && editFilePoignees407.exists) {
    try {
        var editFootage407 = project.importFile(new ImportOptions(editFilePoignees407));
        editFootage407.parentFolder = fromEditFolder;
        editFootage407.name = "UNDLM_00407_AVEC_POIGNEES";
        editSources[407] = editFootage407;
        editImportCount++;
        importSuccess407 = true;
        fileName407 = "UNDLM_00407_AVEC_POIGNEES.mov";
        logImportSuccess(407, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00407_AVEC_POIGNEES.mov", fileName407);
    } catch (e) {
        logImportError(407, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00407_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess407 && editFileBis407.exists) {
    try {
        var editFootage407 = project.importFile(new ImportOptions(editFileBis407));
        editFootage407.parentFolder = fromEditFolder;
        editFootage407.name = "UNDLM_00407bis";
        editSources[407] = editFootage407;
        editImportCount++;
        importSuccess407 = true;
        fileName407 = "UNDLM_00407bis.mov";
        logImportSuccess(407, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00407bis.mov", fileName407);
    } catch (e) {
        logImportError(407, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00407bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess407) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00407.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00408
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile408 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00408.mov");
var editFilePoignees408 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00408_AVEC_POIGNEES.mov");
var editFileBis408 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00408bis.mov");

var importSuccess408 = false;
var fileName408 = "";

// Tenter import standard
if (editFile408.exists) {
    try {
        var editFootage408 = project.importFile(new ImportOptions(editFile408));
        editFootage408.parentFolder = fromEditFolder;
        editFootage408.name = "UNDLM_00408";
        editSources[408] = editFootage408;
        editImportCount++;
        importSuccess408 = true;
        fileName408 = "UNDLM_00408.mov";
        logImportSuccess(408, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00408.mov", fileName408);
    } catch (e) {
        logImportError(408, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00408.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess408 && editFilePoignees408.exists) {
    try {
        var editFootage408 = project.importFile(new ImportOptions(editFilePoignees408));
        editFootage408.parentFolder = fromEditFolder;
        editFootage408.name = "UNDLM_00408_AVEC_POIGNEES";
        editSources[408] = editFootage408;
        editImportCount++;
        importSuccess408 = true;
        fileName408 = "UNDLM_00408_AVEC_POIGNEES.mov";
        logImportSuccess(408, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00408_AVEC_POIGNEES.mov", fileName408);
    } catch (e) {
        logImportError(408, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00408_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess408 && editFileBis408.exists) {
    try {
        var editFootage408 = project.importFile(new ImportOptions(editFileBis408));
        editFootage408.parentFolder = fromEditFolder;
        editFootage408.name = "UNDLM_00408bis";
        editSources[408] = editFootage408;
        editImportCount++;
        importSuccess408 = true;
        fileName408 = "UNDLM_00408bis.mov";
        logImportSuccess(408, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00408bis.mov", fileName408);
    } catch (e) {
        logImportError(408, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00408bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess408) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00408.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00409
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile409 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00409.mov");
var editFilePoignees409 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00409_AVEC_POIGNEES.mov");
var editFileBis409 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00409bis.mov");

var importSuccess409 = false;
var fileName409 = "";

// Tenter import standard
if (editFile409.exists) {
    try {
        var editFootage409 = project.importFile(new ImportOptions(editFile409));
        editFootage409.parentFolder = fromEditFolder;
        editFootage409.name = "UNDLM_00409";
        editSources[409] = editFootage409;
        editImportCount++;
        importSuccess409 = true;
        fileName409 = "UNDLM_00409.mov";
        logImportSuccess(409, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00409.mov", fileName409);
    } catch (e) {
        logImportError(409, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00409.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess409 && editFilePoignees409.exists) {
    try {
        var editFootage409 = project.importFile(new ImportOptions(editFilePoignees409));
        editFootage409.parentFolder = fromEditFolder;
        editFootage409.name = "UNDLM_00409_AVEC_POIGNEES";
        editSources[409] = editFootage409;
        editImportCount++;
        importSuccess409 = true;
        fileName409 = "UNDLM_00409_AVEC_POIGNEES.mov";
        logImportSuccess(409, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00409_AVEC_POIGNEES.mov", fileName409);
    } catch (e) {
        logImportError(409, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00409_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess409 && editFileBis409.exists) {
    try {
        var editFootage409 = project.importFile(new ImportOptions(editFileBis409));
        editFootage409.parentFolder = fromEditFolder;
        editFootage409.name = "UNDLM_00409bis";
        editSources[409] = editFootage409;
        editImportCount++;
        importSuccess409 = true;
        fileName409 = "UNDLM_00409bis.mov";
        logImportSuccess(409, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00409bis.mov", fileName409);
    } catch (e) {
        logImportError(409, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00409bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess409) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00409.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00410
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile410 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00410.mov");
var editFilePoignees410 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00410_AVEC_POIGNEES.mov");
var editFileBis410 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00410bis.mov");

var importSuccess410 = false;
var fileName410 = "";

// Tenter import standard
if (editFile410.exists) {
    try {
        var editFootage410 = project.importFile(new ImportOptions(editFile410));
        editFootage410.parentFolder = fromEditFolder;
        editFootage410.name = "UNDLM_00410";
        editSources[410] = editFootage410;
        editImportCount++;
        importSuccess410 = true;
        fileName410 = "UNDLM_00410.mov";
        logImportSuccess(410, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00410.mov", fileName410);
    } catch (e) {
        logImportError(410, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00410.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess410 && editFilePoignees410.exists) {
    try {
        var editFootage410 = project.importFile(new ImportOptions(editFilePoignees410));
        editFootage410.parentFolder = fromEditFolder;
        editFootage410.name = "UNDLM_00410_AVEC_POIGNEES";
        editSources[410] = editFootage410;
        editImportCount++;
        importSuccess410 = true;
        fileName410 = "UNDLM_00410_AVEC_POIGNEES.mov";
        logImportSuccess(410, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00410_AVEC_POIGNEES.mov", fileName410);
    } catch (e) {
        logImportError(410, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00410_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess410 && editFileBis410.exists) {
    try {
        var editFootage410 = project.importFile(new ImportOptions(editFileBis410));
        editFootage410.parentFolder = fromEditFolder;
        editFootage410.name = "UNDLM_00410bis";
        editSources[410] = editFootage410;
        editImportCount++;
        importSuccess410 = true;
        fileName410 = "UNDLM_00410bis.mov";
        logImportSuccess(410, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00410bis.mov", fileName410);
    } catch (e) {
        logImportError(410, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00410bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess410) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00410.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00411
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile411 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00411.mov");
var editFilePoignees411 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00411_AVEC_POIGNEES.mov");
var editFileBis411 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00411bis.mov");

var importSuccess411 = false;
var fileName411 = "";

// Tenter import standard
if (editFile411.exists) {
    try {
        var editFootage411 = project.importFile(new ImportOptions(editFile411));
        editFootage411.parentFolder = fromEditFolder;
        editFootage411.name = "UNDLM_00411";
        editSources[411] = editFootage411;
        editImportCount++;
        importSuccess411 = true;
        fileName411 = "UNDLM_00411.mov";
        logImportSuccess(411, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00411.mov", fileName411);
    } catch (e) {
        logImportError(411, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00411.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess411 && editFilePoignees411.exists) {
    try {
        var editFootage411 = project.importFile(new ImportOptions(editFilePoignees411));
        editFootage411.parentFolder = fromEditFolder;
        editFootage411.name = "UNDLM_00411_AVEC_POIGNEES";
        editSources[411] = editFootage411;
        editImportCount++;
        importSuccess411 = true;
        fileName411 = "UNDLM_00411_AVEC_POIGNEES.mov";
        logImportSuccess(411, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00411_AVEC_POIGNEES.mov", fileName411);
    } catch (e) {
        logImportError(411, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00411_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess411 && editFileBis411.exists) {
    try {
        var editFootage411 = project.importFile(new ImportOptions(editFileBis411));
        editFootage411.parentFolder = fromEditFolder;
        editFootage411.name = "UNDLM_00411bis";
        editSources[411] = editFootage411;
        editImportCount++;
        importSuccess411 = true;
        fileName411 = "UNDLM_00411bis.mov";
        logImportSuccess(411, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00411bis.mov", fileName411);
    } catch (e) {
        logImportError(411, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00411bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess411) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00411.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00412
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile412 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00412.mov");
var editFilePoignees412 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00412_AVEC_POIGNEES.mov");
var editFileBis412 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00412bis.mov");

var importSuccess412 = false;
var fileName412 = "";

// Tenter import standard
if (editFile412.exists) {
    try {
        var editFootage412 = project.importFile(new ImportOptions(editFile412));
        editFootage412.parentFolder = fromEditFolder;
        editFootage412.name = "UNDLM_00412";
        editSources[412] = editFootage412;
        editImportCount++;
        importSuccess412 = true;
        fileName412 = "UNDLM_00412.mov";
        logImportSuccess(412, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00412.mov", fileName412);
    } catch (e) {
        logImportError(412, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00412.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess412 && editFilePoignees412.exists) {
    try {
        var editFootage412 = project.importFile(new ImportOptions(editFilePoignees412));
        editFootage412.parentFolder = fromEditFolder;
        editFootage412.name = "UNDLM_00412_AVEC_POIGNEES";
        editSources[412] = editFootage412;
        editImportCount++;
        importSuccess412 = true;
        fileName412 = "UNDLM_00412_AVEC_POIGNEES.mov";
        logImportSuccess(412, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00412_AVEC_POIGNEES.mov", fileName412);
    } catch (e) {
        logImportError(412, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00412_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess412 && editFileBis412.exists) {
    try {
        var editFootage412 = project.importFile(new ImportOptions(editFileBis412));
        editFootage412.parentFolder = fromEditFolder;
        editFootage412.name = "UNDLM_00412bis";
        editSources[412] = editFootage412;
        editImportCount++;
        importSuccess412 = true;
        fileName412 = "UNDLM_00412bis.mov";
        logImportSuccess(412, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00412bis.mov", fileName412);
    } catch (e) {
        logImportError(412, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00412bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess412) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00412.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00413
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile413 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00413.mov");
var editFilePoignees413 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00413_AVEC_POIGNEES.mov");
var editFileBis413 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00413bis.mov");

var importSuccess413 = false;
var fileName413 = "";

// Tenter import standard
if (editFile413.exists) {
    try {
        var editFootage413 = project.importFile(new ImportOptions(editFile413));
        editFootage413.parentFolder = fromEditFolder;
        editFootage413.name = "UNDLM_00413";
        editSources[413] = editFootage413;
        editImportCount++;
        importSuccess413 = true;
        fileName413 = "UNDLM_00413.mov";
        logImportSuccess(413, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00413.mov", fileName413);
    } catch (e) {
        logImportError(413, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00413.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess413 && editFilePoignees413.exists) {
    try {
        var editFootage413 = project.importFile(new ImportOptions(editFilePoignees413));
        editFootage413.parentFolder = fromEditFolder;
        editFootage413.name = "UNDLM_00413_AVEC_POIGNEES";
        editSources[413] = editFootage413;
        editImportCount++;
        importSuccess413 = true;
        fileName413 = "UNDLM_00413_AVEC_POIGNEES.mov";
        logImportSuccess(413, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00413_AVEC_POIGNEES.mov", fileName413);
    } catch (e) {
        logImportError(413, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00413_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess413 && editFileBis413.exists) {
    try {
        var editFootage413 = project.importFile(new ImportOptions(editFileBis413));
        editFootage413.parentFolder = fromEditFolder;
        editFootage413.name = "UNDLM_00413bis";
        editSources[413] = editFootage413;
        editImportCount++;
        importSuccess413 = true;
        fileName413 = "UNDLM_00413bis.mov";
        logImportSuccess(413, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00413bis.mov", fileName413);
    } catch (e) {
        logImportError(413, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00413bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess413) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00413.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00414
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile414 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00414.mov");
var editFilePoignees414 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00414_AVEC_POIGNEES.mov");
var editFileBis414 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00414bis.mov");

var importSuccess414 = false;
var fileName414 = "";

// Tenter import standard
if (editFile414.exists) {
    try {
        var editFootage414 = project.importFile(new ImportOptions(editFile414));
        editFootage414.parentFolder = fromEditFolder;
        editFootage414.name = "UNDLM_00414";
        editSources[414] = editFootage414;
        editImportCount++;
        importSuccess414 = true;
        fileName414 = "UNDLM_00414.mov";
        logImportSuccess(414, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00414.mov", fileName414);
    } catch (e) {
        logImportError(414, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00414.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess414 && editFilePoignees414.exists) {
    try {
        var editFootage414 = project.importFile(new ImportOptions(editFilePoignees414));
        editFootage414.parentFolder = fromEditFolder;
        editFootage414.name = "UNDLM_00414_AVEC_POIGNEES";
        editSources[414] = editFootage414;
        editImportCount++;
        importSuccess414 = true;
        fileName414 = "UNDLM_00414_AVEC_POIGNEES.mov";
        logImportSuccess(414, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00414_AVEC_POIGNEES.mov", fileName414);
    } catch (e) {
        logImportError(414, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00414_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess414 && editFileBis414.exists) {
    try {
        var editFootage414 = project.importFile(new ImportOptions(editFileBis414));
        editFootage414.parentFolder = fromEditFolder;
        editFootage414.name = "UNDLM_00414bis";
        editSources[414] = editFootage414;
        editImportCount++;
        importSuccess414 = true;
        fileName414 = "UNDLM_00414bis.mov";
        logImportSuccess(414, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00414bis.mov", fileName414);
    } catch (e) {
        logImportError(414, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00414bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess414) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00414.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00415
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile415 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00415.mov");
var editFilePoignees415 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00415_AVEC_POIGNEES.mov");
var editFileBis415 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00415bis.mov");

var importSuccess415 = false;
var fileName415 = "";

// Tenter import standard
if (editFile415.exists) {
    try {
        var editFootage415 = project.importFile(new ImportOptions(editFile415));
        editFootage415.parentFolder = fromEditFolder;
        editFootage415.name = "UNDLM_00415";
        editSources[415] = editFootage415;
        editImportCount++;
        importSuccess415 = true;
        fileName415 = "UNDLM_00415.mov";
        logImportSuccess(415, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00415.mov", fileName415);
    } catch (e) {
        logImportError(415, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00415.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess415 && editFilePoignees415.exists) {
    try {
        var editFootage415 = project.importFile(new ImportOptions(editFilePoignees415));
        editFootage415.parentFolder = fromEditFolder;
        editFootage415.name = "UNDLM_00415_AVEC_POIGNEES";
        editSources[415] = editFootage415;
        editImportCount++;
        importSuccess415 = true;
        fileName415 = "UNDLM_00415_AVEC_POIGNEES.mov";
        logImportSuccess(415, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00415_AVEC_POIGNEES.mov", fileName415);
    } catch (e) {
        logImportError(415, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00415_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess415 && editFileBis415.exists) {
    try {
        var editFootage415 = project.importFile(new ImportOptions(editFileBis415));
        editFootage415.parentFolder = fromEditFolder;
        editFootage415.name = "UNDLM_00415bis";
        editSources[415] = editFootage415;
        editImportCount++;
        importSuccess415 = true;
        fileName415 = "UNDLM_00415bis.mov";
        logImportSuccess(415, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00415bis.mov", fileName415);
    } catch (e) {
        logImportError(415, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00415bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess415) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00415.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00416
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile416 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00416.mov");
var editFilePoignees416 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00416_AVEC_POIGNEES.mov");
var editFileBis416 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00416bis.mov");

var importSuccess416 = false;
var fileName416 = "";

// Tenter import standard
if (editFile416.exists) {
    try {
        var editFootage416 = project.importFile(new ImportOptions(editFile416));
        editFootage416.parentFolder = fromEditFolder;
        editFootage416.name = "UNDLM_00416";
        editSources[416] = editFootage416;
        editImportCount++;
        importSuccess416 = true;
        fileName416 = "UNDLM_00416.mov";
        logImportSuccess(416, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00416.mov", fileName416);
    } catch (e) {
        logImportError(416, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00416.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess416 && editFilePoignees416.exists) {
    try {
        var editFootage416 = project.importFile(new ImportOptions(editFilePoignees416));
        editFootage416.parentFolder = fromEditFolder;
        editFootage416.name = "UNDLM_00416_AVEC_POIGNEES";
        editSources[416] = editFootage416;
        editImportCount++;
        importSuccess416 = true;
        fileName416 = "UNDLM_00416_AVEC_POIGNEES.mov";
        logImportSuccess(416, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00416_AVEC_POIGNEES.mov", fileName416);
    } catch (e) {
        logImportError(416, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00416_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess416 && editFileBis416.exists) {
    try {
        var editFootage416 = project.importFile(new ImportOptions(editFileBis416));
        editFootage416.parentFolder = fromEditFolder;
        editFootage416.name = "UNDLM_00416bis";
        editSources[416] = editFootage416;
        editImportCount++;
        importSuccess416 = true;
        fileName416 = "UNDLM_00416bis.mov";
        logImportSuccess(416, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00416bis.mov", fileName416);
    } catch (e) {
        logImportError(416, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00416bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess416) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00416.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00417
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile417 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00417.mov");
var editFilePoignees417 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00417_AVEC_POIGNEES.mov");
var editFileBis417 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00417bis.mov");

var importSuccess417 = false;
var fileName417 = "";

// Tenter import standard
if (editFile417.exists) {
    try {
        var editFootage417 = project.importFile(new ImportOptions(editFile417));
        editFootage417.parentFolder = fromEditFolder;
        editFootage417.name = "UNDLM_00417";
        editSources[417] = editFootage417;
        editImportCount++;
        importSuccess417 = true;
        fileName417 = "UNDLM_00417.mov";
        logImportSuccess(417, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00417.mov", fileName417);
    } catch (e) {
        logImportError(417, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00417.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess417 && editFilePoignees417.exists) {
    try {
        var editFootage417 = project.importFile(new ImportOptions(editFilePoignees417));
        editFootage417.parentFolder = fromEditFolder;
        editFootage417.name = "UNDLM_00417_AVEC_POIGNEES";
        editSources[417] = editFootage417;
        editImportCount++;
        importSuccess417 = true;
        fileName417 = "UNDLM_00417_AVEC_POIGNEES.mov";
        logImportSuccess(417, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00417_AVEC_POIGNEES.mov", fileName417);
    } catch (e) {
        logImportError(417, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00417_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess417 && editFileBis417.exists) {
    try {
        var editFootage417 = project.importFile(new ImportOptions(editFileBis417));
        editFootage417.parentFolder = fromEditFolder;
        editFootage417.name = "UNDLM_00417bis";
        editSources[417] = editFootage417;
        editImportCount++;
        importSuccess417 = true;
        fileName417 = "UNDLM_00417bis.mov";
        logImportSuccess(417, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00417bis.mov", fileName417);
    } catch (e) {
        logImportError(417, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00417bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess417) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00417.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00418
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile418 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00418.mov");
var editFilePoignees418 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00418_AVEC_POIGNEES.mov");
var editFileBis418 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00418bis.mov");

var importSuccess418 = false;
var fileName418 = "";

// Tenter import standard
if (editFile418.exists) {
    try {
        var editFootage418 = project.importFile(new ImportOptions(editFile418));
        editFootage418.parentFolder = fromEditFolder;
        editFootage418.name = "UNDLM_00418";
        editSources[418] = editFootage418;
        editImportCount++;
        importSuccess418 = true;
        fileName418 = "UNDLM_00418.mov";
        logImportSuccess(418, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00418.mov", fileName418);
    } catch (e) {
        logImportError(418, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00418.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess418 && editFilePoignees418.exists) {
    try {
        var editFootage418 = project.importFile(new ImportOptions(editFilePoignees418));
        editFootage418.parentFolder = fromEditFolder;
        editFootage418.name = "UNDLM_00418_AVEC_POIGNEES";
        editSources[418] = editFootage418;
        editImportCount++;
        importSuccess418 = true;
        fileName418 = "UNDLM_00418_AVEC_POIGNEES.mov";
        logImportSuccess(418, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00418_AVEC_POIGNEES.mov", fileName418);
    } catch (e) {
        logImportError(418, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00418_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess418 && editFileBis418.exists) {
    try {
        var editFootage418 = project.importFile(new ImportOptions(editFileBis418));
        editFootage418.parentFolder = fromEditFolder;
        editFootage418.name = "UNDLM_00418bis";
        editSources[418] = editFootage418;
        editImportCount++;
        importSuccess418 = true;
        fileName418 = "UNDLM_00418bis.mov";
        logImportSuccess(418, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00418bis.mov", fileName418);
    } catch (e) {
        logImportError(418, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00418bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess418) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00418.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00419
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile419 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00419.mov");
var editFilePoignees419 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00419_AVEC_POIGNEES.mov");
var editFileBis419 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00419bis.mov");

var importSuccess419 = false;
var fileName419 = "";

// Tenter import standard
if (editFile419.exists) {
    try {
        var editFootage419 = project.importFile(new ImportOptions(editFile419));
        editFootage419.parentFolder = fromEditFolder;
        editFootage419.name = "UNDLM_00419";
        editSources[419] = editFootage419;
        editImportCount++;
        importSuccess419 = true;
        fileName419 = "UNDLM_00419.mov";
        logImportSuccess(419, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00419.mov", fileName419);
    } catch (e) {
        logImportError(419, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00419.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess419 && editFilePoignees419.exists) {
    try {
        var editFootage419 = project.importFile(new ImportOptions(editFilePoignees419));
        editFootage419.parentFolder = fromEditFolder;
        editFootage419.name = "UNDLM_00419_AVEC_POIGNEES";
        editSources[419] = editFootage419;
        editImportCount++;
        importSuccess419 = true;
        fileName419 = "UNDLM_00419_AVEC_POIGNEES.mov";
        logImportSuccess(419, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00419_AVEC_POIGNEES.mov", fileName419);
    } catch (e) {
        logImportError(419, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00419_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess419 && editFileBis419.exists) {
    try {
        var editFootage419 = project.importFile(new ImportOptions(editFileBis419));
        editFootage419.parentFolder = fromEditFolder;
        editFootage419.name = "UNDLM_00419bis";
        editSources[419] = editFootage419;
        editImportCount++;
        importSuccess419 = true;
        fileName419 = "UNDLM_00419bis.mov";
        logImportSuccess(419, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00419bis.mov", fileName419);
    } catch (e) {
        logImportError(419, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00419bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess419) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00419.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00420
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile420 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00420.mov");
var editFilePoignees420 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00420_AVEC_POIGNEES.mov");
var editFileBis420 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00420bis.mov");

var importSuccess420 = false;
var fileName420 = "";

// Tenter import standard
if (editFile420.exists) {
    try {
        var editFootage420 = project.importFile(new ImportOptions(editFile420));
        editFootage420.parentFolder = fromEditFolder;
        editFootage420.name = "UNDLM_00420";
        editSources[420] = editFootage420;
        editImportCount++;
        importSuccess420 = true;
        fileName420 = "UNDLM_00420.mov";
        logImportSuccess(420, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00420.mov", fileName420);
    } catch (e) {
        logImportError(420, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00420.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess420 && editFilePoignees420.exists) {
    try {
        var editFootage420 = project.importFile(new ImportOptions(editFilePoignees420));
        editFootage420.parentFolder = fromEditFolder;
        editFootage420.name = "UNDLM_00420_AVEC_POIGNEES";
        editSources[420] = editFootage420;
        editImportCount++;
        importSuccess420 = true;
        fileName420 = "UNDLM_00420_AVEC_POIGNEES.mov";
        logImportSuccess(420, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00420_AVEC_POIGNEES.mov", fileName420);
    } catch (e) {
        logImportError(420, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00420_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess420 && editFileBis420.exists) {
    try {
        var editFootage420 = project.importFile(new ImportOptions(editFileBis420));
        editFootage420.parentFolder = fromEditFolder;
        editFootage420.name = "UNDLM_00420bis";
        editSources[420] = editFootage420;
        editImportCount++;
        importSuccess420 = true;
        fileName420 = "UNDLM_00420bis.mov";
        logImportSuccess(420, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00420bis.mov", fileName420);
    } catch (e) {
        logImportError(420, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00420bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess420) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00420.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00421
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile421 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00421.mov");
var editFilePoignees421 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00421_AVEC_POIGNEES.mov");
var editFileBis421 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00421bis.mov");

var importSuccess421 = false;
var fileName421 = "";

// Tenter import standard
if (editFile421.exists) {
    try {
        var editFootage421 = project.importFile(new ImportOptions(editFile421));
        editFootage421.parentFolder = fromEditFolder;
        editFootage421.name = "UNDLM_00421";
        editSources[421] = editFootage421;
        editImportCount++;
        importSuccess421 = true;
        fileName421 = "UNDLM_00421.mov";
        logImportSuccess(421, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00421.mov", fileName421);
    } catch (e) {
        logImportError(421, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00421.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess421 && editFilePoignees421.exists) {
    try {
        var editFootage421 = project.importFile(new ImportOptions(editFilePoignees421));
        editFootage421.parentFolder = fromEditFolder;
        editFootage421.name = "UNDLM_00421_AVEC_POIGNEES";
        editSources[421] = editFootage421;
        editImportCount++;
        importSuccess421 = true;
        fileName421 = "UNDLM_00421_AVEC_POIGNEES.mov";
        logImportSuccess(421, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00421_AVEC_POIGNEES.mov", fileName421);
    } catch (e) {
        logImportError(421, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00421_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess421 && editFileBis421.exists) {
    try {
        var editFootage421 = project.importFile(new ImportOptions(editFileBis421));
        editFootage421.parentFolder = fromEditFolder;
        editFootage421.name = "UNDLM_00421bis";
        editSources[421] = editFootage421;
        editImportCount++;
        importSuccess421 = true;
        fileName421 = "UNDLM_00421bis.mov";
        logImportSuccess(421, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00421bis.mov", fileName421);
    } catch (e) {
        logImportError(421, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00421bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess421) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00421.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00422
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile422 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00422.mov");
var editFilePoignees422 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00422_AVEC_POIGNEES.mov");
var editFileBis422 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00422bis.mov");

var importSuccess422 = false;
var fileName422 = "";

// Tenter import standard
if (editFile422.exists) {
    try {
        var editFootage422 = project.importFile(new ImportOptions(editFile422));
        editFootage422.parentFolder = fromEditFolder;
        editFootage422.name = "UNDLM_00422";
        editSources[422] = editFootage422;
        editImportCount++;
        importSuccess422 = true;
        fileName422 = "UNDLM_00422.mov";
        logImportSuccess(422, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00422.mov", fileName422);
    } catch (e) {
        logImportError(422, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00422.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess422 && editFilePoignees422.exists) {
    try {
        var editFootage422 = project.importFile(new ImportOptions(editFilePoignees422));
        editFootage422.parentFolder = fromEditFolder;
        editFootage422.name = "UNDLM_00422_AVEC_POIGNEES";
        editSources[422] = editFootage422;
        editImportCount++;
        importSuccess422 = true;
        fileName422 = "UNDLM_00422_AVEC_POIGNEES.mov";
        logImportSuccess(422, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00422_AVEC_POIGNEES.mov", fileName422);
    } catch (e) {
        logImportError(422, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00422_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess422 && editFileBis422.exists) {
    try {
        var editFootage422 = project.importFile(new ImportOptions(editFileBis422));
        editFootage422.parentFolder = fromEditFolder;
        editFootage422.name = "UNDLM_00422bis";
        editSources[422] = editFootage422;
        editImportCount++;
        importSuccess422 = true;
        fileName422 = "UNDLM_00422bis.mov";
        logImportSuccess(422, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00422bis.mov", fileName422);
    } catch (e) {
        logImportError(422, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00422bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess422) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00422.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00423
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile423 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00423.mov");
var editFilePoignees423 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00423_AVEC_POIGNEES.mov");
var editFileBis423 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00423bis.mov");

var importSuccess423 = false;
var fileName423 = "";

// Tenter import standard
if (editFile423.exists) {
    try {
        var editFootage423 = project.importFile(new ImportOptions(editFile423));
        editFootage423.parentFolder = fromEditFolder;
        editFootage423.name = "UNDLM_00423";
        editSources[423] = editFootage423;
        editImportCount++;
        importSuccess423 = true;
        fileName423 = "UNDLM_00423.mov";
        logImportSuccess(423, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00423.mov", fileName423);
    } catch (e) {
        logImportError(423, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00423.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess423 && editFilePoignees423.exists) {
    try {
        var editFootage423 = project.importFile(new ImportOptions(editFilePoignees423));
        editFootage423.parentFolder = fromEditFolder;
        editFootage423.name = "UNDLM_00423_AVEC_POIGNEES";
        editSources[423] = editFootage423;
        editImportCount++;
        importSuccess423 = true;
        fileName423 = "UNDLM_00423_AVEC_POIGNEES.mov";
        logImportSuccess(423, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00423_AVEC_POIGNEES.mov", fileName423);
    } catch (e) {
        logImportError(423, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00423_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess423 && editFileBis423.exists) {
    try {
        var editFootage423 = project.importFile(new ImportOptions(editFileBis423));
        editFootage423.parentFolder = fromEditFolder;
        editFootage423.name = "UNDLM_00423bis";
        editSources[423] = editFootage423;
        editImportCount++;
        importSuccess423 = true;
        fileName423 = "UNDLM_00423bis.mov";
        logImportSuccess(423, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00423bis.mov", fileName423);
    } catch (e) {
        logImportError(423, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00423bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess423) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00423.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00424
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile424 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00424.mov");
var editFilePoignees424 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00424_AVEC_POIGNEES.mov");
var editFileBis424 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00424bis.mov");

var importSuccess424 = false;
var fileName424 = "";

// Tenter import standard
if (editFile424.exists) {
    try {
        var editFootage424 = project.importFile(new ImportOptions(editFile424));
        editFootage424.parentFolder = fromEditFolder;
        editFootage424.name = "UNDLM_00424";
        editSources[424] = editFootage424;
        editImportCount++;
        importSuccess424 = true;
        fileName424 = "UNDLM_00424.mov";
        logImportSuccess(424, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00424.mov", fileName424);
    } catch (e) {
        logImportError(424, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00424.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess424 && editFilePoignees424.exists) {
    try {
        var editFootage424 = project.importFile(new ImportOptions(editFilePoignees424));
        editFootage424.parentFolder = fromEditFolder;
        editFootage424.name = "UNDLM_00424_AVEC_POIGNEES";
        editSources[424] = editFootage424;
        editImportCount++;
        importSuccess424 = true;
        fileName424 = "UNDLM_00424_AVEC_POIGNEES.mov";
        logImportSuccess(424, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00424_AVEC_POIGNEES.mov", fileName424);
    } catch (e) {
        logImportError(424, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00424_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess424 && editFileBis424.exists) {
    try {
        var editFootage424 = project.importFile(new ImportOptions(editFileBis424));
        editFootage424.parentFolder = fromEditFolder;
        editFootage424.name = "UNDLM_00424bis";
        editSources[424] = editFootage424;
        editImportCount++;
        importSuccess424 = true;
        fileName424 = "UNDLM_00424bis.mov";
        logImportSuccess(424, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00424bis.mov", fileName424);
    } catch (e) {
        logImportError(424, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00424bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess424) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00424.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00401
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile401 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00401.mov");
var gradedFilePoignees401 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00401_AVEC_POIGNEES.mov");
var gradedFileBis401 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00401bis.mov");

var gradedImportSuccess401 = false;
var gradedFileName401 = "";

// Tenter import standard
if (gradedFile401.exists) {
    try {
        var gradedFootage401 = project.importFile(new ImportOptions(gradedFile401));
        gradedFootage401.parentFolder = fromGradingFolder;
        gradedFootage401.name = "UNDLM_00401";
        gradingSources[401] = gradedFootage401;
        gradingImportCount++;
        gradedImportSuccess401 = true;
        gradedFileName401 = "UNDLM_00401.mov";
        logImportSuccess(401, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00401.mov", gradedFileName401);
    } catch (e) {
        logImportError(401, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00401.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess401 && gradedFilePoignees401.exists) {
    try {
        var gradedFootage401 = project.importFile(new ImportOptions(gradedFilePoignees401));
        gradedFootage401.parentFolder = fromGradingFolder;
        gradedFootage401.name = "UNDLM_00401_AVEC_POIGNEES";
        gradingSources[401] = gradedFootage401;
        gradingImportCount++;
        gradedImportSuccess401 = true;
        gradedFileName401 = "UNDLM_00401_AVEC_POIGNEES.mov";
        logImportSuccess(401, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00401_AVEC_POIGNEES.mov", gradedFileName401);
    } catch (e) {
        logImportError(401, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00401_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess401 && gradedFileBis401.exists) {
    try {
        var gradedFootage401 = project.importFile(new ImportOptions(gradedFileBis401));
        gradedFootage401.parentFolder = fromGradingFolder;
        gradedFootage401.name = "UNDLM_00401bis";
        gradingSources[401] = gradedFootage401;
        gradingImportCount++;
        gradedImportSuccess401 = true;
        gradedFileName401 = "UNDLM_00401bis.mov";
        logImportSuccess(401, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00401bis.mov", gradedFileName401);
    } catch (e) {
        logImportError(401, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00401bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess401) {
    missingGradingCount++;
}

// Import plan GRADED 00402
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile402 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00402.mov");
var gradedFilePoignees402 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00402_AVEC_POIGNEES.mov");
var gradedFileBis402 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00402bis.mov");

var gradedImportSuccess402 = false;
var gradedFileName402 = "";

// Tenter import standard
if (gradedFile402.exists) {
    try {
        var gradedFootage402 = project.importFile(new ImportOptions(gradedFile402));
        gradedFootage402.parentFolder = fromGradingFolder;
        gradedFootage402.name = "UNDLM_00402";
        gradingSources[402] = gradedFootage402;
        gradingImportCount++;
        gradedImportSuccess402 = true;
        gradedFileName402 = "UNDLM_00402.mov";
        logImportSuccess(402, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00402.mov", gradedFileName402);
    } catch (e) {
        logImportError(402, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00402.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess402 && gradedFilePoignees402.exists) {
    try {
        var gradedFootage402 = project.importFile(new ImportOptions(gradedFilePoignees402));
        gradedFootage402.parentFolder = fromGradingFolder;
        gradedFootage402.name = "UNDLM_00402_AVEC_POIGNEES";
        gradingSources[402] = gradedFootage402;
        gradingImportCount++;
        gradedImportSuccess402 = true;
        gradedFileName402 = "UNDLM_00402_AVEC_POIGNEES.mov";
        logImportSuccess(402, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00402_AVEC_POIGNEES.mov", gradedFileName402);
    } catch (e) {
        logImportError(402, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00402_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess402 && gradedFileBis402.exists) {
    try {
        var gradedFootage402 = project.importFile(new ImportOptions(gradedFileBis402));
        gradedFootage402.parentFolder = fromGradingFolder;
        gradedFootage402.name = "UNDLM_00402bis";
        gradingSources[402] = gradedFootage402;
        gradingImportCount++;
        gradedImportSuccess402 = true;
        gradedFileName402 = "UNDLM_00402bis.mov";
        logImportSuccess(402, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00402bis.mov", gradedFileName402);
    } catch (e) {
        logImportError(402, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00402bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess402) {
    missingGradingCount++;
}

// Import plan GRADED 00403
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile403 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00403.mov");
var gradedFilePoignees403 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00403_AVEC_POIGNEES.mov");
var gradedFileBis403 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00403bis.mov");

var gradedImportSuccess403 = false;
var gradedFileName403 = "";

// Tenter import standard
if (gradedFile403.exists) {
    try {
        var gradedFootage403 = project.importFile(new ImportOptions(gradedFile403));
        gradedFootage403.parentFolder = fromGradingFolder;
        gradedFootage403.name = "UNDLM_00403";
        gradingSources[403] = gradedFootage403;
        gradingImportCount++;
        gradedImportSuccess403 = true;
        gradedFileName403 = "UNDLM_00403.mov";
        logImportSuccess(403, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00403.mov", gradedFileName403);
    } catch (e) {
        logImportError(403, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00403.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess403 && gradedFilePoignees403.exists) {
    try {
        var gradedFootage403 = project.importFile(new ImportOptions(gradedFilePoignees403));
        gradedFootage403.parentFolder = fromGradingFolder;
        gradedFootage403.name = "UNDLM_00403_AVEC_POIGNEES";
        gradingSources[403] = gradedFootage403;
        gradingImportCount++;
        gradedImportSuccess403 = true;
        gradedFileName403 = "UNDLM_00403_AVEC_POIGNEES.mov";
        logImportSuccess(403, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00403_AVEC_POIGNEES.mov", gradedFileName403);
    } catch (e) {
        logImportError(403, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00403_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess403 && gradedFileBis403.exists) {
    try {
        var gradedFootage403 = project.importFile(new ImportOptions(gradedFileBis403));
        gradedFootage403.parentFolder = fromGradingFolder;
        gradedFootage403.name = "UNDLM_00403bis";
        gradingSources[403] = gradedFootage403;
        gradingImportCount++;
        gradedImportSuccess403 = true;
        gradedFileName403 = "UNDLM_00403bis.mov";
        logImportSuccess(403, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00403bis.mov", gradedFileName403);
    } catch (e) {
        logImportError(403, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00403bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess403) {
    missingGradingCount++;
}

// Import plan GRADED 00404
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile404 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00404.mov");
var gradedFilePoignees404 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00404_AVEC_POIGNEES.mov");
var gradedFileBis404 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00404bis.mov");

var gradedImportSuccess404 = false;
var gradedFileName404 = "";

// Tenter import standard
if (gradedFile404.exists) {
    try {
        var gradedFootage404 = project.importFile(new ImportOptions(gradedFile404));
        gradedFootage404.parentFolder = fromGradingFolder;
        gradedFootage404.name = "UNDLM_00404";
        gradingSources[404] = gradedFootage404;
        gradingImportCount++;
        gradedImportSuccess404 = true;
        gradedFileName404 = "UNDLM_00404.mov";
        logImportSuccess(404, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00404.mov", gradedFileName404);
    } catch (e) {
        logImportError(404, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00404.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess404 && gradedFilePoignees404.exists) {
    try {
        var gradedFootage404 = project.importFile(new ImportOptions(gradedFilePoignees404));
        gradedFootage404.parentFolder = fromGradingFolder;
        gradedFootage404.name = "UNDLM_00404_AVEC_POIGNEES";
        gradingSources[404] = gradedFootage404;
        gradingImportCount++;
        gradedImportSuccess404 = true;
        gradedFileName404 = "UNDLM_00404_AVEC_POIGNEES.mov";
        logImportSuccess(404, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00404_AVEC_POIGNEES.mov", gradedFileName404);
    } catch (e) {
        logImportError(404, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00404_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess404 && gradedFileBis404.exists) {
    try {
        var gradedFootage404 = project.importFile(new ImportOptions(gradedFileBis404));
        gradedFootage404.parentFolder = fromGradingFolder;
        gradedFootage404.name = "UNDLM_00404bis";
        gradingSources[404] = gradedFootage404;
        gradingImportCount++;
        gradedImportSuccess404 = true;
        gradedFileName404 = "UNDLM_00404bis.mov";
        logImportSuccess(404, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00404bis.mov", gradedFileName404);
    } catch (e) {
        logImportError(404, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00404bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess404) {
    missingGradingCount++;
}

// Import plan GRADED 00405
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile405 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00405.mov");
var gradedFilePoignees405 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00405_AVEC_POIGNEES.mov");
var gradedFileBis405 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00405bis.mov");

var gradedImportSuccess405 = false;
var gradedFileName405 = "";

// Tenter import standard
if (gradedFile405.exists) {
    try {
        var gradedFootage405 = project.importFile(new ImportOptions(gradedFile405));
        gradedFootage405.parentFolder = fromGradingFolder;
        gradedFootage405.name = "UNDLM_00405";
        gradingSources[405] = gradedFootage405;
        gradingImportCount++;
        gradedImportSuccess405 = true;
        gradedFileName405 = "UNDLM_00405.mov";
        logImportSuccess(405, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00405.mov", gradedFileName405);
    } catch (e) {
        logImportError(405, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00405.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess405 && gradedFilePoignees405.exists) {
    try {
        var gradedFootage405 = project.importFile(new ImportOptions(gradedFilePoignees405));
        gradedFootage405.parentFolder = fromGradingFolder;
        gradedFootage405.name = "UNDLM_00405_AVEC_POIGNEES";
        gradingSources[405] = gradedFootage405;
        gradingImportCount++;
        gradedImportSuccess405 = true;
        gradedFileName405 = "UNDLM_00405_AVEC_POIGNEES.mov";
        logImportSuccess(405, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00405_AVEC_POIGNEES.mov", gradedFileName405);
    } catch (e) {
        logImportError(405, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00405_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess405 && gradedFileBis405.exists) {
    try {
        var gradedFootage405 = project.importFile(new ImportOptions(gradedFileBis405));
        gradedFootage405.parentFolder = fromGradingFolder;
        gradedFootage405.name = "UNDLM_00405bis";
        gradingSources[405] = gradedFootage405;
        gradingImportCount++;
        gradedImportSuccess405 = true;
        gradedFileName405 = "UNDLM_00405bis.mov";
        logImportSuccess(405, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00405bis.mov", gradedFileName405);
    } catch (e) {
        logImportError(405, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00405bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess405) {
    missingGradingCount++;
}

// Import plan GRADED 00406
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile406 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00406.mov");
var gradedFilePoignees406 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00406_AVEC_POIGNEES.mov");
var gradedFileBis406 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00406bis.mov");

var gradedImportSuccess406 = false;
var gradedFileName406 = "";

// Tenter import standard
if (gradedFile406.exists) {
    try {
        var gradedFootage406 = project.importFile(new ImportOptions(gradedFile406));
        gradedFootage406.parentFolder = fromGradingFolder;
        gradedFootage406.name = "UNDLM_00406";
        gradingSources[406] = gradedFootage406;
        gradingImportCount++;
        gradedImportSuccess406 = true;
        gradedFileName406 = "UNDLM_00406.mov";
        logImportSuccess(406, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00406.mov", gradedFileName406);
    } catch (e) {
        logImportError(406, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00406.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess406 && gradedFilePoignees406.exists) {
    try {
        var gradedFootage406 = project.importFile(new ImportOptions(gradedFilePoignees406));
        gradedFootage406.parentFolder = fromGradingFolder;
        gradedFootage406.name = "UNDLM_00406_AVEC_POIGNEES";
        gradingSources[406] = gradedFootage406;
        gradingImportCount++;
        gradedImportSuccess406 = true;
        gradedFileName406 = "UNDLM_00406_AVEC_POIGNEES.mov";
        logImportSuccess(406, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00406_AVEC_POIGNEES.mov", gradedFileName406);
    } catch (e) {
        logImportError(406, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00406_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess406 && gradedFileBis406.exists) {
    try {
        var gradedFootage406 = project.importFile(new ImportOptions(gradedFileBis406));
        gradedFootage406.parentFolder = fromGradingFolder;
        gradedFootage406.name = "UNDLM_00406bis";
        gradingSources[406] = gradedFootage406;
        gradingImportCount++;
        gradedImportSuccess406 = true;
        gradedFileName406 = "UNDLM_00406bis.mov";
        logImportSuccess(406, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00406bis.mov", gradedFileName406);
    } catch (e) {
        logImportError(406, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00406bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess406) {
    missingGradingCount++;
}

// Import plan GRADED 00407
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile407 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00407.mov");
var gradedFilePoignees407 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00407_AVEC_POIGNEES.mov");
var gradedFileBis407 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00407bis.mov");

var gradedImportSuccess407 = false;
var gradedFileName407 = "";

// Tenter import standard
if (gradedFile407.exists) {
    try {
        var gradedFootage407 = project.importFile(new ImportOptions(gradedFile407));
        gradedFootage407.parentFolder = fromGradingFolder;
        gradedFootage407.name = "UNDLM_00407";
        gradingSources[407] = gradedFootage407;
        gradingImportCount++;
        gradedImportSuccess407 = true;
        gradedFileName407 = "UNDLM_00407.mov";
        logImportSuccess(407, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00407.mov", gradedFileName407);
    } catch (e) {
        logImportError(407, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00407.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess407 && gradedFilePoignees407.exists) {
    try {
        var gradedFootage407 = project.importFile(new ImportOptions(gradedFilePoignees407));
        gradedFootage407.parentFolder = fromGradingFolder;
        gradedFootage407.name = "UNDLM_00407_AVEC_POIGNEES";
        gradingSources[407] = gradedFootage407;
        gradingImportCount++;
        gradedImportSuccess407 = true;
        gradedFileName407 = "UNDLM_00407_AVEC_POIGNEES.mov";
        logImportSuccess(407, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00407_AVEC_POIGNEES.mov", gradedFileName407);
    } catch (e) {
        logImportError(407, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00407_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess407 && gradedFileBis407.exists) {
    try {
        var gradedFootage407 = project.importFile(new ImportOptions(gradedFileBis407));
        gradedFootage407.parentFolder = fromGradingFolder;
        gradedFootage407.name = "UNDLM_00407bis";
        gradingSources[407] = gradedFootage407;
        gradingImportCount++;
        gradedImportSuccess407 = true;
        gradedFileName407 = "UNDLM_00407bis.mov";
        logImportSuccess(407, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00407bis.mov", gradedFileName407);
    } catch (e) {
        logImportError(407, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00407bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess407) {
    missingGradingCount++;
}

// Import plan GRADED 00408
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile408 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00408.mov");
var gradedFilePoignees408 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00408_AVEC_POIGNEES.mov");
var gradedFileBis408 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00408bis.mov");

var gradedImportSuccess408 = false;
var gradedFileName408 = "";

// Tenter import standard
if (gradedFile408.exists) {
    try {
        var gradedFootage408 = project.importFile(new ImportOptions(gradedFile408));
        gradedFootage408.parentFolder = fromGradingFolder;
        gradedFootage408.name = "UNDLM_00408";
        gradingSources[408] = gradedFootage408;
        gradingImportCount++;
        gradedImportSuccess408 = true;
        gradedFileName408 = "UNDLM_00408.mov";
        logImportSuccess(408, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00408.mov", gradedFileName408);
    } catch (e) {
        logImportError(408, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00408.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess408 && gradedFilePoignees408.exists) {
    try {
        var gradedFootage408 = project.importFile(new ImportOptions(gradedFilePoignees408));
        gradedFootage408.parentFolder = fromGradingFolder;
        gradedFootage408.name = "UNDLM_00408_AVEC_POIGNEES";
        gradingSources[408] = gradedFootage408;
        gradingImportCount++;
        gradedImportSuccess408 = true;
        gradedFileName408 = "UNDLM_00408_AVEC_POIGNEES.mov";
        logImportSuccess(408, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00408_AVEC_POIGNEES.mov", gradedFileName408);
    } catch (e) {
        logImportError(408, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00408_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess408 && gradedFileBis408.exists) {
    try {
        var gradedFootage408 = project.importFile(new ImportOptions(gradedFileBis408));
        gradedFootage408.parentFolder = fromGradingFolder;
        gradedFootage408.name = "UNDLM_00408bis";
        gradingSources[408] = gradedFootage408;
        gradingImportCount++;
        gradedImportSuccess408 = true;
        gradedFileName408 = "UNDLM_00408bis.mov";
        logImportSuccess(408, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00408bis.mov", gradedFileName408);
    } catch (e) {
        logImportError(408, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00408bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess408) {
    missingGradingCount++;
}

// Import plan GRADED 00409
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile409 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00409.mov");
var gradedFilePoignees409 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00409_AVEC_POIGNEES.mov");
var gradedFileBis409 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00409bis.mov");

var gradedImportSuccess409 = false;
var gradedFileName409 = "";

// Tenter import standard
if (gradedFile409.exists) {
    try {
        var gradedFootage409 = project.importFile(new ImportOptions(gradedFile409));
        gradedFootage409.parentFolder = fromGradingFolder;
        gradedFootage409.name = "UNDLM_00409";
        gradingSources[409] = gradedFootage409;
        gradingImportCount++;
        gradedImportSuccess409 = true;
        gradedFileName409 = "UNDLM_00409.mov";
        logImportSuccess(409, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00409.mov", gradedFileName409);
    } catch (e) {
        logImportError(409, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00409.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess409 && gradedFilePoignees409.exists) {
    try {
        var gradedFootage409 = project.importFile(new ImportOptions(gradedFilePoignees409));
        gradedFootage409.parentFolder = fromGradingFolder;
        gradedFootage409.name = "UNDLM_00409_AVEC_POIGNEES";
        gradingSources[409] = gradedFootage409;
        gradingImportCount++;
        gradedImportSuccess409 = true;
        gradedFileName409 = "UNDLM_00409_AVEC_POIGNEES.mov";
        logImportSuccess(409, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00409_AVEC_POIGNEES.mov", gradedFileName409);
    } catch (e) {
        logImportError(409, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00409_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess409 && gradedFileBis409.exists) {
    try {
        var gradedFootage409 = project.importFile(new ImportOptions(gradedFileBis409));
        gradedFootage409.parentFolder = fromGradingFolder;
        gradedFootage409.name = "UNDLM_00409bis";
        gradingSources[409] = gradedFootage409;
        gradingImportCount++;
        gradedImportSuccess409 = true;
        gradedFileName409 = "UNDLM_00409bis.mov";
        logImportSuccess(409, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00409bis.mov", gradedFileName409);
    } catch (e) {
        logImportError(409, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00409bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess409) {
    missingGradingCount++;
}

// Import plan GRADED 00410
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile410 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00410.mov");
var gradedFilePoignees410 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00410_AVEC_POIGNEES.mov");
var gradedFileBis410 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00410bis.mov");

var gradedImportSuccess410 = false;
var gradedFileName410 = "";

// Tenter import standard
if (gradedFile410.exists) {
    try {
        var gradedFootage410 = project.importFile(new ImportOptions(gradedFile410));
        gradedFootage410.parentFolder = fromGradingFolder;
        gradedFootage410.name = "UNDLM_00410";
        gradingSources[410] = gradedFootage410;
        gradingImportCount++;
        gradedImportSuccess410 = true;
        gradedFileName410 = "UNDLM_00410.mov";
        logImportSuccess(410, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00410.mov", gradedFileName410);
    } catch (e) {
        logImportError(410, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00410.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess410 && gradedFilePoignees410.exists) {
    try {
        var gradedFootage410 = project.importFile(new ImportOptions(gradedFilePoignees410));
        gradedFootage410.parentFolder = fromGradingFolder;
        gradedFootage410.name = "UNDLM_00410_AVEC_POIGNEES";
        gradingSources[410] = gradedFootage410;
        gradingImportCount++;
        gradedImportSuccess410 = true;
        gradedFileName410 = "UNDLM_00410_AVEC_POIGNEES.mov";
        logImportSuccess(410, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00410_AVEC_POIGNEES.mov", gradedFileName410);
    } catch (e) {
        logImportError(410, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00410_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess410 && gradedFileBis410.exists) {
    try {
        var gradedFootage410 = project.importFile(new ImportOptions(gradedFileBis410));
        gradedFootage410.parentFolder = fromGradingFolder;
        gradedFootage410.name = "UNDLM_00410bis";
        gradingSources[410] = gradedFootage410;
        gradingImportCount++;
        gradedImportSuccess410 = true;
        gradedFileName410 = "UNDLM_00410bis.mov";
        logImportSuccess(410, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00410bis.mov", gradedFileName410);
    } catch (e) {
        logImportError(410, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00410bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess410) {
    missingGradingCount++;
}

// Import plan GRADED 00411
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile411 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00411.mov");
var gradedFilePoignees411 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00411_AVEC_POIGNEES.mov");
var gradedFileBis411 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00411bis.mov");

var gradedImportSuccess411 = false;
var gradedFileName411 = "";

// Tenter import standard
if (gradedFile411.exists) {
    try {
        var gradedFootage411 = project.importFile(new ImportOptions(gradedFile411));
        gradedFootage411.parentFolder = fromGradingFolder;
        gradedFootage411.name = "UNDLM_00411";
        gradingSources[411] = gradedFootage411;
        gradingImportCount++;
        gradedImportSuccess411 = true;
        gradedFileName411 = "UNDLM_00411.mov";
        logImportSuccess(411, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00411.mov", gradedFileName411);
    } catch (e) {
        logImportError(411, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00411.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess411 && gradedFilePoignees411.exists) {
    try {
        var gradedFootage411 = project.importFile(new ImportOptions(gradedFilePoignees411));
        gradedFootage411.parentFolder = fromGradingFolder;
        gradedFootage411.name = "UNDLM_00411_AVEC_POIGNEES";
        gradingSources[411] = gradedFootage411;
        gradingImportCount++;
        gradedImportSuccess411 = true;
        gradedFileName411 = "UNDLM_00411_AVEC_POIGNEES.mov";
        logImportSuccess(411, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00411_AVEC_POIGNEES.mov", gradedFileName411);
    } catch (e) {
        logImportError(411, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00411_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess411 && gradedFileBis411.exists) {
    try {
        var gradedFootage411 = project.importFile(new ImportOptions(gradedFileBis411));
        gradedFootage411.parentFolder = fromGradingFolder;
        gradedFootage411.name = "UNDLM_00411bis";
        gradingSources[411] = gradedFootage411;
        gradingImportCount++;
        gradedImportSuccess411 = true;
        gradedFileName411 = "UNDLM_00411bis.mov";
        logImportSuccess(411, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00411bis.mov", gradedFileName411);
    } catch (e) {
        logImportError(411, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00411bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess411) {
    missingGradingCount++;
}

// Import plan GRADED 00412
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile412 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00412.mov");
var gradedFilePoignees412 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00412_AVEC_POIGNEES.mov");
var gradedFileBis412 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00412bis.mov");

var gradedImportSuccess412 = false;
var gradedFileName412 = "";

// Tenter import standard
if (gradedFile412.exists) {
    try {
        var gradedFootage412 = project.importFile(new ImportOptions(gradedFile412));
        gradedFootage412.parentFolder = fromGradingFolder;
        gradedFootage412.name = "UNDLM_00412";
        gradingSources[412] = gradedFootage412;
        gradingImportCount++;
        gradedImportSuccess412 = true;
        gradedFileName412 = "UNDLM_00412.mov";
        logImportSuccess(412, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00412.mov", gradedFileName412);
    } catch (e) {
        logImportError(412, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00412.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess412 && gradedFilePoignees412.exists) {
    try {
        var gradedFootage412 = project.importFile(new ImportOptions(gradedFilePoignees412));
        gradedFootage412.parentFolder = fromGradingFolder;
        gradedFootage412.name = "UNDLM_00412_AVEC_POIGNEES";
        gradingSources[412] = gradedFootage412;
        gradingImportCount++;
        gradedImportSuccess412 = true;
        gradedFileName412 = "UNDLM_00412_AVEC_POIGNEES.mov";
        logImportSuccess(412, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00412_AVEC_POIGNEES.mov", gradedFileName412);
    } catch (e) {
        logImportError(412, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00412_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess412 && gradedFileBis412.exists) {
    try {
        var gradedFootage412 = project.importFile(new ImportOptions(gradedFileBis412));
        gradedFootage412.parentFolder = fromGradingFolder;
        gradedFootage412.name = "UNDLM_00412bis";
        gradingSources[412] = gradedFootage412;
        gradingImportCount++;
        gradedImportSuccess412 = true;
        gradedFileName412 = "UNDLM_00412bis.mov";
        logImportSuccess(412, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00412bis.mov", gradedFileName412);
    } catch (e) {
        logImportError(412, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00412bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess412) {
    missingGradingCount++;
}

// Import plan GRADED 00413
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile413 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00413.mov");
var gradedFilePoignees413 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00413_AVEC_POIGNEES.mov");
var gradedFileBis413 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00413bis.mov");

var gradedImportSuccess413 = false;
var gradedFileName413 = "";

// Tenter import standard
if (gradedFile413.exists) {
    try {
        var gradedFootage413 = project.importFile(new ImportOptions(gradedFile413));
        gradedFootage413.parentFolder = fromGradingFolder;
        gradedFootage413.name = "UNDLM_00413";
        gradingSources[413] = gradedFootage413;
        gradingImportCount++;
        gradedImportSuccess413 = true;
        gradedFileName413 = "UNDLM_00413.mov";
        logImportSuccess(413, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00413.mov", gradedFileName413);
    } catch (e) {
        logImportError(413, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00413.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess413 && gradedFilePoignees413.exists) {
    try {
        var gradedFootage413 = project.importFile(new ImportOptions(gradedFilePoignees413));
        gradedFootage413.parentFolder = fromGradingFolder;
        gradedFootage413.name = "UNDLM_00413_AVEC_POIGNEES";
        gradingSources[413] = gradedFootage413;
        gradingImportCount++;
        gradedImportSuccess413 = true;
        gradedFileName413 = "UNDLM_00413_AVEC_POIGNEES.mov";
        logImportSuccess(413, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00413_AVEC_POIGNEES.mov", gradedFileName413);
    } catch (e) {
        logImportError(413, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00413_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess413 && gradedFileBis413.exists) {
    try {
        var gradedFootage413 = project.importFile(new ImportOptions(gradedFileBis413));
        gradedFootage413.parentFolder = fromGradingFolder;
        gradedFootage413.name = "UNDLM_00413bis";
        gradingSources[413] = gradedFootage413;
        gradingImportCount++;
        gradedImportSuccess413 = true;
        gradedFileName413 = "UNDLM_00413bis.mov";
        logImportSuccess(413, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00413bis.mov", gradedFileName413);
    } catch (e) {
        logImportError(413, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00413bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess413) {
    missingGradingCount++;
}

// Import plan GRADED 00414
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile414 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00414.mov");
var gradedFilePoignees414 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00414_AVEC_POIGNEES.mov");
var gradedFileBis414 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00414bis.mov");

var gradedImportSuccess414 = false;
var gradedFileName414 = "";

// Tenter import standard
if (gradedFile414.exists) {
    try {
        var gradedFootage414 = project.importFile(new ImportOptions(gradedFile414));
        gradedFootage414.parentFolder = fromGradingFolder;
        gradedFootage414.name = "UNDLM_00414";
        gradingSources[414] = gradedFootage414;
        gradingImportCount++;
        gradedImportSuccess414 = true;
        gradedFileName414 = "UNDLM_00414.mov";
        logImportSuccess(414, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00414.mov", gradedFileName414);
    } catch (e) {
        logImportError(414, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00414.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess414 && gradedFilePoignees414.exists) {
    try {
        var gradedFootage414 = project.importFile(new ImportOptions(gradedFilePoignees414));
        gradedFootage414.parentFolder = fromGradingFolder;
        gradedFootage414.name = "UNDLM_00414_AVEC_POIGNEES";
        gradingSources[414] = gradedFootage414;
        gradingImportCount++;
        gradedImportSuccess414 = true;
        gradedFileName414 = "UNDLM_00414_AVEC_POIGNEES.mov";
        logImportSuccess(414, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00414_AVEC_POIGNEES.mov", gradedFileName414);
    } catch (e) {
        logImportError(414, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00414_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess414 && gradedFileBis414.exists) {
    try {
        var gradedFootage414 = project.importFile(new ImportOptions(gradedFileBis414));
        gradedFootage414.parentFolder = fromGradingFolder;
        gradedFootage414.name = "UNDLM_00414bis";
        gradingSources[414] = gradedFootage414;
        gradingImportCount++;
        gradedImportSuccess414 = true;
        gradedFileName414 = "UNDLM_00414bis.mov";
        logImportSuccess(414, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00414bis.mov", gradedFileName414);
    } catch (e) {
        logImportError(414, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00414bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess414) {
    missingGradingCount++;
}

// Import plan GRADED 00415
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile415 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00415.mov");
var gradedFilePoignees415 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00415_AVEC_POIGNEES.mov");
var gradedFileBis415 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00415bis.mov");

var gradedImportSuccess415 = false;
var gradedFileName415 = "";

// Tenter import standard
if (gradedFile415.exists) {
    try {
        var gradedFootage415 = project.importFile(new ImportOptions(gradedFile415));
        gradedFootage415.parentFolder = fromGradingFolder;
        gradedFootage415.name = "UNDLM_00415";
        gradingSources[415] = gradedFootage415;
        gradingImportCount++;
        gradedImportSuccess415 = true;
        gradedFileName415 = "UNDLM_00415.mov";
        logImportSuccess(415, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00415.mov", gradedFileName415);
    } catch (e) {
        logImportError(415, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00415.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess415 && gradedFilePoignees415.exists) {
    try {
        var gradedFootage415 = project.importFile(new ImportOptions(gradedFilePoignees415));
        gradedFootage415.parentFolder = fromGradingFolder;
        gradedFootage415.name = "UNDLM_00415_AVEC_POIGNEES";
        gradingSources[415] = gradedFootage415;
        gradingImportCount++;
        gradedImportSuccess415 = true;
        gradedFileName415 = "UNDLM_00415_AVEC_POIGNEES.mov";
        logImportSuccess(415, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00415_AVEC_POIGNEES.mov", gradedFileName415);
    } catch (e) {
        logImportError(415, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00415_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess415 && gradedFileBis415.exists) {
    try {
        var gradedFootage415 = project.importFile(new ImportOptions(gradedFileBis415));
        gradedFootage415.parentFolder = fromGradingFolder;
        gradedFootage415.name = "UNDLM_00415bis";
        gradingSources[415] = gradedFootage415;
        gradingImportCount++;
        gradedImportSuccess415 = true;
        gradedFileName415 = "UNDLM_00415bis.mov";
        logImportSuccess(415, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00415bis.mov", gradedFileName415);
    } catch (e) {
        logImportError(415, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00415bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess415) {
    missingGradingCount++;
}

// Import plan GRADED 00416
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile416 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00416.mov");
var gradedFilePoignees416 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00416_AVEC_POIGNEES.mov");
var gradedFileBis416 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00416bis.mov");

var gradedImportSuccess416 = false;
var gradedFileName416 = "";

// Tenter import standard
if (gradedFile416.exists) {
    try {
        var gradedFootage416 = project.importFile(new ImportOptions(gradedFile416));
        gradedFootage416.parentFolder = fromGradingFolder;
        gradedFootage416.name = "UNDLM_00416";
        gradingSources[416] = gradedFootage416;
        gradingImportCount++;
        gradedImportSuccess416 = true;
        gradedFileName416 = "UNDLM_00416.mov";
        logImportSuccess(416, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00416.mov", gradedFileName416);
    } catch (e) {
        logImportError(416, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00416.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess416 && gradedFilePoignees416.exists) {
    try {
        var gradedFootage416 = project.importFile(new ImportOptions(gradedFilePoignees416));
        gradedFootage416.parentFolder = fromGradingFolder;
        gradedFootage416.name = "UNDLM_00416_AVEC_POIGNEES";
        gradingSources[416] = gradedFootage416;
        gradingImportCount++;
        gradedImportSuccess416 = true;
        gradedFileName416 = "UNDLM_00416_AVEC_POIGNEES.mov";
        logImportSuccess(416, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00416_AVEC_POIGNEES.mov", gradedFileName416);
    } catch (e) {
        logImportError(416, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00416_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess416 && gradedFileBis416.exists) {
    try {
        var gradedFootage416 = project.importFile(new ImportOptions(gradedFileBis416));
        gradedFootage416.parentFolder = fromGradingFolder;
        gradedFootage416.name = "UNDLM_00416bis";
        gradingSources[416] = gradedFootage416;
        gradingImportCount++;
        gradedImportSuccess416 = true;
        gradedFileName416 = "UNDLM_00416bis.mov";
        logImportSuccess(416, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00416bis.mov", gradedFileName416);
    } catch (e) {
        logImportError(416, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00416bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess416) {
    missingGradingCount++;
}

// Import plan GRADED 00417
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile417 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00417.mov");
var gradedFilePoignees417 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00417_AVEC_POIGNEES.mov");
var gradedFileBis417 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00417bis.mov");

var gradedImportSuccess417 = false;
var gradedFileName417 = "";

// Tenter import standard
if (gradedFile417.exists) {
    try {
        var gradedFootage417 = project.importFile(new ImportOptions(gradedFile417));
        gradedFootage417.parentFolder = fromGradingFolder;
        gradedFootage417.name = "UNDLM_00417";
        gradingSources[417] = gradedFootage417;
        gradingImportCount++;
        gradedImportSuccess417 = true;
        gradedFileName417 = "UNDLM_00417.mov";
        logImportSuccess(417, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00417.mov", gradedFileName417);
    } catch (e) {
        logImportError(417, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00417.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess417 && gradedFilePoignees417.exists) {
    try {
        var gradedFootage417 = project.importFile(new ImportOptions(gradedFilePoignees417));
        gradedFootage417.parentFolder = fromGradingFolder;
        gradedFootage417.name = "UNDLM_00417_AVEC_POIGNEES";
        gradingSources[417] = gradedFootage417;
        gradingImportCount++;
        gradedImportSuccess417 = true;
        gradedFileName417 = "UNDLM_00417_AVEC_POIGNEES.mov";
        logImportSuccess(417, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00417_AVEC_POIGNEES.mov", gradedFileName417);
    } catch (e) {
        logImportError(417, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00417_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess417 && gradedFileBis417.exists) {
    try {
        var gradedFootage417 = project.importFile(new ImportOptions(gradedFileBis417));
        gradedFootage417.parentFolder = fromGradingFolder;
        gradedFootage417.name = "UNDLM_00417bis";
        gradingSources[417] = gradedFootage417;
        gradingImportCount++;
        gradedImportSuccess417 = true;
        gradedFileName417 = "UNDLM_00417bis.mov";
        logImportSuccess(417, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00417bis.mov", gradedFileName417);
    } catch (e) {
        logImportError(417, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00417bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess417) {
    missingGradingCount++;
}

// Import plan GRADED 00418
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile418 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00418.mov");
var gradedFilePoignees418 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00418_AVEC_POIGNEES.mov");
var gradedFileBis418 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00418bis.mov");

var gradedImportSuccess418 = false;
var gradedFileName418 = "";

// Tenter import standard
if (gradedFile418.exists) {
    try {
        var gradedFootage418 = project.importFile(new ImportOptions(gradedFile418));
        gradedFootage418.parentFolder = fromGradingFolder;
        gradedFootage418.name = "UNDLM_00418";
        gradingSources[418] = gradedFootage418;
        gradingImportCount++;
        gradedImportSuccess418 = true;
        gradedFileName418 = "UNDLM_00418.mov";
        logImportSuccess(418, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00418.mov", gradedFileName418);
    } catch (e) {
        logImportError(418, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00418.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess418 && gradedFilePoignees418.exists) {
    try {
        var gradedFootage418 = project.importFile(new ImportOptions(gradedFilePoignees418));
        gradedFootage418.parentFolder = fromGradingFolder;
        gradedFootage418.name = "UNDLM_00418_AVEC_POIGNEES";
        gradingSources[418] = gradedFootage418;
        gradingImportCount++;
        gradedImportSuccess418 = true;
        gradedFileName418 = "UNDLM_00418_AVEC_POIGNEES.mov";
        logImportSuccess(418, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00418_AVEC_POIGNEES.mov", gradedFileName418);
    } catch (e) {
        logImportError(418, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00418_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess418 && gradedFileBis418.exists) {
    try {
        var gradedFootage418 = project.importFile(new ImportOptions(gradedFileBis418));
        gradedFootage418.parentFolder = fromGradingFolder;
        gradedFootage418.name = "UNDLM_00418bis";
        gradingSources[418] = gradedFootage418;
        gradingImportCount++;
        gradedImportSuccess418 = true;
        gradedFileName418 = "UNDLM_00418bis.mov";
        logImportSuccess(418, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00418bis.mov", gradedFileName418);
    } catch (e) {
        logImportError(418, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00418bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess418) {
    missingGradingCount++;
}

// Import plan GRADED 00419
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile419 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00419.mov");
var gradedFilePoignees419 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00419_AVEC_POIGNEES.mov");
var gradedFileBis419 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00419bis.mov");

var gradedImportSuccess419 = false;
var gradedFileName419 = "";

// Tenter import standard
if (gradedFile419.exists) {
    try {
        var gradedFootage419 = project.importFile(new ImportOptions(gradedFile419));
        gradedFootage419.parentFolder = fromGradingFolder;
        gradedFootage419.name = "UNDLM_00419";
        gradingSources[419] = gradedFootage419;
        gradingImportCount++;
        gradedImportSuccess419 = true;
        gradedFileName419 = "UNDLM_00419.mov";
        logImportSuccess(419, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00419.mov", gradedFileName419);
    } catch (e) {
        logImportError(419, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00419.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess419 && gradedFilePoignees419.exists) {
    try {
        var gradedFootage419 = project.importFile(new ImportOptions(gradedFilePoignees419));
        gradedFootage419.parentFolder = fromGradingFolder;
        gradedFootage419.name = "UNDLM_00419_AVEC_POIGNEES";
        gradingSources[419] = gradedFootage419;
        gradingImportCount++;
        gradedImportSuccess419 = true;
        gradedFileName419 = "UNDLM_00419_AVEC_POIGNEES.mov";
        logImportSuccess(419, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00419_AVEC_POIGNEES.mov", gradedFileName419);
    } catch (e) {
        logImportError(419, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00419_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess419 && gradedFileBis419.exists) {
    try {
        var gradedFootage419 = project.importFile(new ImportOptions(gradedFileBis419));
        gradedFootage419.parentFolder = fromGradingFolder;
        gradedFootage419.name = "UNDLM_00419bis";
        gradingSources[419] = gradedFootage419;
        gradingImportCount++;
        gradedImportSuccess419 = true;
        gradedFileName419 = "UNDLM_00419bis.mov";
        logImportSuccess(419, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00419bis.mov", gradedFileName419);
    } catch (e) {
        logImportError(419, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00419bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess419) {
    missingGradingCount++;
}

// Import plan GRADED 00420
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile420 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00420.mov");
var gradedFilePoignees420 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00420_AVEC_POIGNEES.mov");
var gradedFileBis420 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00420bis.mov");

var gradedImportSuccess420 = false;
var gradedFileName420 = "";

// Tenter import standard
if (gradedFile420.exists) {
    try {
        var gradedFootage420 = project.importFile(new ImportOptions(gradedFile420));
        gradedFootage420.parentFolder = fromGradingFolder;
        gradedFootage420.name = "UNDLM_00420";
        gradingSources[420] = gradedFootage420;
        gradingImportCount++;
        gradedImportSuccess420 = true;
        gradedFileName420 = "UNDLM_00420.mov";
        logImportSuccess(420, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00420.mov", gradedFileName420);
    } catch (e) {
        logImportError(420, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00420.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess420 && gradedFilePoignees420.exists) {
    try {
        var gradedFootage420 = project.importFile(new ImportOptions(gradedFilePoignees420));
        gradedFootage420.parentFolder = fromGradingFolder;
        gradedFootage420.name = "UNDLM_00420_AVEC_POIGNEES";
        gradingSources[420] = gradedFootage420;
        gradingImportCount++;
        gradedImportSuccess420 = true;
        gradedFileName420 = "UNDLM_00420_AVEC_POIGNEES.mov";
        logImportSuccess(420, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00420_AVEC_POIGNEES.mov", gradedFileName420);
    } catch (e) {
        logImportError(420, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00420_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess420 && gradedFileBis420.exists) {
    try {
        var gradedFootage420 = project.importFile(new ImportOptions(gradedFileBis420));
        gradedFootage420.parentFolder = fromGradingFolder;
        gradedFootage420.name = "UNDLM_00420bis";
        gradingSources[420] = gradedFootage420;
        gradingImportCount++;
        gradedImportSuccess420 = true;
        gradedFileName420 = "UNDLM_00420bis.mov";
        logImportSuccess(420, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00420bis.mov", gradedFileName420);
    } catch (e) {
        logImportError(420, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00420bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess420) {
    missingGradingCount++;
}

// Import plan GRADED 00421
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile421 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00421.mov");
var gradedFilePoignees421 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00421_AVEC_POIGNEES.mov");
var gradedFileBis421 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00421bis.mov");

var gradedImportSuccess421 = false;
var gradedFileName421 = "";

// Tenter import standard
if (gradedFile421.exists) {
    try {
        var gradedFootage421 = project.importFile(new ImportOptions(gradedFile421));
        gradedFootage421.parentFolder = fromGradingFolder;
        gradedFootage421.name = "UNDLM_00421";
        gradingSources[421] = gradedFootage421;
        gradingImportCount++;
        gradedImportSuccess421 = true;
        gradedFileName421 = "UNDLM_00421.mov";
        logImportSuccess(421, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00421.mov", gradedFileName421);
    } catch (e) {
        logImportError(421, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00421.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess421 && gradedFilePoignees421.exists) {
    try {
        var gradedFootage421 = project.importFile(new ImportOptions(gradedFilePoignees421));
        gradedFootage421.parentFolder = fromGradingFolder;
        gradedFootage421.name = "UNDLM_00421_AVEC_POIGNEES";
        gradingSources[421] = gradedFootage421;
        gradingImportCount++;
        gradedImportSuccess421 = true;
        gradedFileName421 = "UNDLM_00421_AVEC_POIGNEES.mov";
        logImportSuccess(421, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00421_AVEC_POIGNEES.mov", gradedFileName421);
    } catch (e) {
        logImportError(421, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00421_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess421 && gradedFileBis421.exists) {
    try {
        var gradedFootage421 = project.importFile(new ImportOptions(gradedFileBis421));
        gradedFootage421.parentFolder = fromGradingFolder;
        gradedFootage421.name = "UNDLM_00421bis";
        gradingSources[421] = gradedFootage421;
        gradingImportCount++;
        gradedImportSuccess421 = true;
        gradedFileName421 = "UNDLM_00421bis.mov";
        logImportSuccess(421, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00421bis.mov", gradedFileName421);
    } catch (e) {
        logImportError(421, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00421bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess421) {
    missingGradingCount++;
}

// Import plan GRADED 00422
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile422 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00422.mov");
var gradedFilePoignees422 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00422_AVEC_POIGNEES.mov");
var gradedFileBis422 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00422bis.mov");

var gradedImportSuccess422 = false;
var gradedFileName422 = "";

// Tenter import standard
if (gradedFile422.exists) {
    try {
        var gradedFootage422 = project.importFile(new ImportOptions(gradedFile422));
        gradedFootage422.parentFolder = fromGradingFolder;
        gradedFootage422.name = "UNDLM_00422";
        gradingSources[422] = gradedFootage422;
        gradingImportCount++;
        gradedImportSuccess422 = true;
        gradedFileName422 = "UNDLM_00422.mov";
        logImportSuccess(422, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00422.mov", gradedFileName422);
    } catch (e) {
        logImportError(422, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00422.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess422 && gradedFilePoignees422.exists) {
    try {
        var gradedFootage422 = project.importFile(new ImportOptions(gradedFilePoignees422));
        gradedFootage422.parentFolder = fromGradingFolder;
        gradedFootage422.name = "UNDLM_00422_AVEC_POIGNEES";
        gradingSources[422] = gradedFootage422;
        gradingImportCount++;
        gradedImportSuccess422 = true;
        gradedFileName422 = "UNDLM_00422_AVEC_POIGNEES.mov";
        logImportSuccess(422, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00422_AVEC_POIGNEES.mov", gradedFileName422);
    } catch (e) {
        logImportError(422, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00422_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess422 && gradedFileBis422.exists) {
    try {
        var gradedFootage422 = project.importFile(new ImportOptions(gradedFileBis422));
        gradedFootage422.parentFolder = fromGradingFolder;
        gradedFootage422.name = "UNDLM_00422bis";
        gradingSources[422] = gradedFootage422;
        gradingImportCount++;
        gradedImportSuccess422 = true;
        gradedFileName422 = "UNDLM_00422bis.mov";
        logImportSuccess(422, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00422bis.mov", gradedFileName422);
    } catch (e) {
        logImportError(422, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00422bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess422) {
    missingGradingCount++;
}

// Import plan GRADED 00423
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile423 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00423.mov");
var gradedFilePoignees423 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00423_AVEC_POIGNEES.mov");
var gradedFileBis423 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00423bis.mov");

var gradedImportSuccess423 = false;
var gradedFileName423 = "";

// Tenter import standard
if (gradedFile423.exists) {
    try {
        var gradedFootage423 = project.importFile(new ImportOptions(gradedFile423));
        gradedFootage423.parentFolder = fromGradingFolder;
        gradedFootage423.name = "UNDLM_00423";
        gradingSources[423] = gradedFootage423;
        gradingImportCount++;
        gradedImportSuccess423 = true;
        gradedFileName423 = "UNDLM_00423.mov";
        logImportSuccess(423, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00423.mov", gradedFileName423);
    } catch (e) {
        logImportError(423, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00423.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess423 && gradedFilePoignees423.exists) {
    try {
        var gradedFootage423 = project.importFile(new ImportOptions(gradedFilePoignees423));
        gradedFootage423.parentFolder = fromGradingFolder;
        gradedFootage423.name = "UNDLM_00423_AVEC_POIGNEES";
        gradingSources[423] = gradedFootage423;
        gradingImportCount++;
        gradedImportSuccess423 = true;
        gradedFileName423 = "UNDLM_00423_AVEC_POIGNEES.mov";
        logImportSuccess(423, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00423_AVEC_POIGNEES.mov", gradedFileName423);
    } catch (e) {
        logImportError(423, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00423_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess423 && gradedFileBis423.exists) {
    try {
        var gradedFootage423 = project.importFile(new ImportOptions(gradedFileBis423));
        gradedFootage423.parentFolder = fromGradingFolder;
        gradedFootage423.name = "UNDLM_00423bis";
        gradingSources[423] = gradedFootage423;
        gradingImportCount++;
        gradedImportSuccess423 = true;
        gradedFileName423 = "UNDLM_00423bis.mov";
        logImportSuccess(423, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00423bis.mov", gradedFileName423);
    } catch (e) {
        logImportError(423, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00423bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess423) {
    missingGradingCount++;
}

// Import plan GRADED 00424
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile424 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00424.mov");
var gradedFilePoignees424 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00424_AVEC_POIGNEES.mov");
var gradedFileBis424 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00424bis.mov");

var gradedImportSuccess424 = false;
var gradedFileName424 = "";

// Tenter import standard
if (gradedFile424.exists) {
    try {
        var gradedFootage424 = project.importFile(new ImportOptions(gradedFile424));
        gradedFootage424.parentFolder = fromGradingFolder;
        gradedFootage424.name = "UNDLM_00424";
        gradingSources[424] = gradedFootage424;
        gradingImportCount++;
        gradedImportSuccess424 = true;
        gradedFileName424 = "UNDLM_00424.mov";
        logImportSuccess(424, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00424.mov", gradedFileName424);
    } catch (e) {
        logImportError(424, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00424.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess424 && gradedFilePoignees424.exists) {
    try {
        var gradedFootage424 = project.importFile(new ImportOptions(gradedFilePoignees424));
        gradedFootage424.parentFolder = fromGradingFolder;
        gradedFootage424.name = "UNDLM_00424_AVEC_POIGNEES";
        gradingSources[424] = gradedFootage424;
        gradingImportCount++;
        gradedImportSuccess424 = true;
        gradedFileName424 = "UNDLM_00424_AVEC_POIGNEES.mov";
        logImportSuccess(424, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00424_AVEC_POIGNEES.mov", gradedFileName424);
    } catch (e) {
        logImportError(424, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00424_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess424 && gradedFileBis424.exists) {
    try {
        var gradedFootage424 = project.importFile(new ImportOptions(gradedFileBis424));
        gradedFootage424.parentFolder = fromGradingFolder;
        gradedFootage424.name = "UNDLM_00424bis";
        gradingSources[424] = gradedFootage424;
        gradingImportCount++;
        gradedImportSuccess424 = true;
        gradedFileName424 = "UNDLM_00424bis.mov";
        logImportSuccess(424, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00424bis.mov", gradedFileName424);
    } catch (e) {
        logImportError(424, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00424bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess424) {
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


// Composition pour plan 00401
var planComp401 = project.items.addComp(
    "SQ23_UNDLM_00401_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp401.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer401 = planComp401.layers.add(bgSolidComp);
bgLayer401.name = "BG_SOLID";
bgLayer401.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer401 = false;
if (gradingSources[401]) {
    var gradedLayer401 = planComp401.layers.add(gradingSources[401]);
    gradedLayer401.name = "UNDLM_00401_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer401.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer401.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer401 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer401 = false;
if (editSources[401]) {
    var editLayer401 = planComp401.layers.add(editSources[401]);
    editLayer401.name = "UNDLM_00401_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer401.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer401.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer401 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity401 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer401) {
    // EDIT toujours activé quand disponible
    editLayer401.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer401) {
        gradedLayer401.enabled = false;
    }
} else if (hasGradedLayer401) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer401.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText401 = planComp401.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText401.name = "WARNING_NO_EDIT";
    warningText401.property("Transform").property("Position").setValue([1280, 200]);
    warningText401.guideLayer = true;
    
    var warningTextDoc401 = warningText401.property("Source Text").value;
    warningTextDoc401.fontSize = 32;
    warningTextDoc401.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc401.font = "Arial-BoldMT";
    warningTextDoc401.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText401.property("Source Text").setValue(warningTextDoc401);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText401 = planComp401.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00401");
    errorText401.name = "ERROR_NO_SOURCE";
    errorText401.property("Transform").property("Position").setValue([1280, 720]);
    errorText401.guideLayer = true;
    
    var errorTextDoc401 = errorText401.property("Source Text").value;
    errorTextDoc401.fontSize = 48;
    errorTextDoc401.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc401.font = "Arial-BoldMT";
    errorTextDoc401.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText401.property("Source Text").setValue(errorTextDoc401);
}

planCompositions[401] = planComp401;


// Composition pour plan 00402
var planComp402 = project.items.addComp(
    "SQ23_UNDLM_00402_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp402.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer402 = planComp402.layers.add(bgSolidComp);
bgLayer402.name = "BG_SOLID";
bgLayer402.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer402 = false;
if (gradingSources[402]) {
    var gradedLayer402 = planComp402.layers.add(gradingSources[402]);
    gradedLayer402.name = "UNDLM_00402_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer402.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer402.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer402 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer402 = false;
if (editSources[402]) {
    var editLayer402 = planComp402.layers.add(editSources[402]);
    editLayer402.name = "UNDLM_00402_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer402.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer402.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer402 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity402 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer402) {
    // EDIT toujours activé quand disponible
    editLayer402.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer402) {
        gradedLayer402.enabled = false;
    }
} else if (hasGradedLayer402) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer402.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText402 = planComp402.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText402.name = "WARNING_NO_EDIT";
    warningText402.property("Transform").property("Position").setValue([1280, 200]);
    warningText402.guideLayer = true;
    
    var warningTextDoc402 = warningText402.property("Source Text").value;
    warningTextDoc402.fontSize = 32;
    warningTextDoc402.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc402.font = "Arial-BoldMT";
    warningTextDoc402.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText402.property("Source Text").setValue(warningTextDoc402);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText402 = planComp402.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00402");
    errorText402.name = "ERROR_NO_SOURCE";
    errorText402.property("Transform").property("Position").setValue([1280, 720]);
    errorText402.guideLayer = true;
    
    var errorTextDoc402 = errorText402.property("Source Text").value;
    errorTextDoc402.fontSize = 48;
    errorTextDoc402.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc402.font = "Arial-BoldMT";
    errorTextDoc402.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText402.property("Source Text").setValue(errorTextDoc402);
}

planCompositions[402] = planComp402;


// Composition pour plan 00403
var planComp403 = project.items.addComp(
    "SQ23_UNDLM_00403_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp403.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer403 = planComp403.layers.add(bgSolidComp);
bgLayer403.name = "BG_SOLID";
bgLayer403.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer403 = false;
if (gradingSources[403]) {
    var gradedLayer403 = planComp403.layers.add(gradingSources[403]);
    gradedLayer403.name = "UNDLM_00403_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer403.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer403.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer403 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer403 = false;
if (editSources[403]) {
    var editLayer403 = planComp403.layers.add(editSources[403]);
    editLayer403.name = "UNDLM_00403_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer403.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer403.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer403 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity403 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer403) {
    // EDIT toujours activé quand disponible
    editLayer403.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer403) {
        gradedLayer403.enabled = false;
    }
} else if (hasGradedLayer403) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer403.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText403 = planComp403.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText403.name = "WARNING_NO_EDIT";
    warningText403.property("Transform").property("Position").setValue([1280, 200]);
    warningText403.guideLayer = true;
    
    var warningTextDoc403 = warningText403.property("Source Text").value;
    warningTextDoc403.fontSize = 32;
    warningTextDoc403.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc403.font = "Arial-BoldMT";
    warningTextDoc403.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText403.property("Source Text").setValue(warningTextDoc403);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText403 = planComp403.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00403");
    errorText403.name = "ERROR_NO_SOURCE";
    errorText403.property("Transform").property("Position").setValue([1280, 720]);
    errorText403.guideLayer = true;
    
    var errorTextDoc403 = errorText403.property("Source Text").value;
    errorTextDoc403.fontSize = 48;
    errorTextDoc403.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc403.font = "Arial-BoldMT";
    errorTextDoc403.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText403.property("Source Text").setValue(errorTextDoc403);
}

planCompositions[403] = planComp403;


// Composition pour plan 00404
var planComp404 = project.items.addComp(
    "SQ23_UNDLM_00404_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp404.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer404 = planComp404.layers.add(bgSolidComp);
bgLayer404.name = "BG_SOLID";
bgLayer404.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer404 = false;
if (gradingSources[404]) {
    var gradedLayer404 = planComp404.layers.add(gradingSources[404]);
    gradedLayer404.name = "UNDLM_00404_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer404.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer404.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer404 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer404 = false;
if (editSources[404]) {
    var editLayer404 = planComp404.layers.add(editSources[404]);
    editLayer404.name = "UNDLM_00404_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer404.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer404.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer404 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity404 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer404) {
    // EDIT toujours activé quand disponible
    editLayer404.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer404) {
        gradedLayer404.enabled = false;
    }
} else if (hasGradedLayer404) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer404.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText404 = planComp404.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText404.name = "WARNING_NO_EDIT";
    warningText404.property("Transform").property("Position").setValue([1280, 200]);
    warningText404.guideLayer = true;
    
    var warningTextDoc404 = warningText404.property("Source Text").value;
    warningTextDoc404.fontSize = 32;
    warningTextDoc404.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc404.font = "Arial-BoldMT";
    warningTextDoc404.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText404.property("Source Text").setValue(warningTextDoc404);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText404 = planComp404.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00404");
    errorText404.name = "ERROR_NO_SOURCE";
    errorText404.property("Transform").property("Position").setValue([1280, 720]);
    errorText404.guideLayer = true;
    
    var errorTextDoc404 = errorText404.property("Source Text").value;
    errorTextDoc404.fontSize = 48;
    errorTextDoc404.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc404.font = "Arial-BoldMT";
    errorTextDoc404.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText404.property("Source Text").setValue(errorTextDoc404);
}

planCompositions[404] = planComp404;


// Composition pour plan 00405
var planComp405 = project.items.addComp(
    "SQ23_UNDLM_00405_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp405.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer405 = planComp405.layers.add(bgSolidComp);
bgLayer405.name = "BG_SOLID";
bgLayer405.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer405 = false;
if (gradingSources[405]) {
    var gradedLayer405 = planComp405.layers.add(gradingSources[405]);
    gradedLayer405.name = "UNDLM_00405_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer405.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer405.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer405 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer405 = false;
if (editSources[405]) {
    var editLayer405 = planComp405.layers.add(editSources[405]);
    editLayer405.name = "UNDLM_00405_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer405.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer405.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer405 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity405 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer405) {
    // EDIT toujours activé quand disponible
    editLayer405.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer405) {
        gradedLayer405.enabled = false;
    }
} else if (hasGradedLayer405) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer405.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText405 = planComp405.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText405.name = "WARNING_NO_EDIT";
    warningText405.property("Transform").property("Position").setValue([1280, 200]);
    warningText405.guideLayer = true;
    
    var warningTextDoc405 = warningText405.property("Source Text").value;
    warningTextDoc405.fontSize = 32;
    warningTextDoc405.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc405.font = "Arial-BoldMT";
    warningTextDoc405.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText405.property("Source Text").setValue(warningTextDoc405);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText405 = planComp405.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00405");
    errorText405.name = "ERROR_NO_SOURCE";
    errorText405.property("Transform").property("Position").setValue([1280, 720]);
    errorText405.guideLayer = true;
    
    var errorTextDoc405 = errorText405.property("Source Text").value;
    errorTextDoc405.fontSize = 48;
    errorTextDoc405.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc405.font = "Arial-BoldMT";
    errorTextDoc405.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText405.property("Source Text").setValue(errorTextDoc405);
}

planCompositions[405] = planComp405;


// Composition pour plan 00406
var planComp406 = project.items.addComp(
    "SQ23_UNDLM_00406_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    11.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp406.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer406 = planComp406.layers.add(bgSolidComp);
bgLayer406.name = "BG_SOLID";
bgLayer406.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer406 = false;
if (gradingSources[406]) {
    var gradedLayer406 = planComp406.layers.add(gradingSources[406]);
    gradedLayer406.name = "UNDLM_00406_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer406.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer406.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer406 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer406 = false;
if (editSources[406]) {
    var editLayer406 = planComp406.layers.add(editSources[406]);
    editLayer406.name = "UNDLM_00406_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer406.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer406.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer406 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity406 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer406) {
    // EDIT toujours activé quand disponible
    editLayer406.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer406) {
        gradedLayer406.enabled = false;
    }
} else if (hasGradedLayer406) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer406.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText406 = planComp406.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText406.name = "WARNING_NO_EDIT";
    warningText406.property("Transform").property("Position").setValue([1280, 200]);
    warningText406.guideLayer = true;
    
    var warningTextDoc406 = warningText406.property("Source Text").value;
    warningTextDoc406.fontSize = 32;
    warningTextDoc406.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc406.font = "Arial-BoldMT";
    warningTextDoc406.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText406.property("Source Text").setValue(warningTextDoc406);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText406 = planComp406.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00406");
    errorText406.name = "ERROR_NO_SOURCE";
    errorText406.property("Transform").property("Position").setValue([1280, 720]);
    errorText406.guideLayer = true;
    
    var errorTextDoc406 = errorText406.property("Source Text").value;
    errorTextDoc406.fontSize = 48;
    errorTextDoc406.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc406.font = "Arial-BoldMT";
    errorTextDoc406.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText406.property("Source Text").setValue(errorTextDoc406);
}

planCompositions[406] = planComp406;


// Composition pour plan 00407
var planComp407 = project.items.addComp(
    "SQ23_UNDLM_00407_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.64,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp407.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer407 = planComp407.layers.add(bgSolidComp);
bgLayer407.name = "BG_SOLID";
bgLayer407.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer407 = false;
if (gradingSources[407]) {
    var gradedLayer407 = planComp407.layers.add(gradingSources[407]);
    gradedLayer407.name = "UNDLM_00407_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer407.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer407.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer407 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer407 = false;
if (editSources[407]) {
    var editLayer407 = planComp407.layers.add(editSources[407]);
    editLayer407.name = "UNDLM_00407_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer407.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer407.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer407 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity407 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer407) {
    // EDIT toujours activé quand disponible
    editLayer407.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer407) {
        gradedLayer407.enabled = false;
    }
} else if (hasGradedLayer407) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer407.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText407 = planComp407.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText407.name = "WARNING_NO_EDIT";
    warningText407.property("Transform").property("Position").setValue([1280, 200]);
    warningText407.guideLayer = true;
    
    var warningTextDoc407 = warningText407.property("Source Text").value;
    warningTextDoc407.fontSize = 32;
    warningTextDoc407.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc407.font = "Arial-BoldMT";
    warningTextDoc407.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText407.property("Source Text").setValue(warningTextDoc407);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText407 = planComp407.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00407");
    errorText407.name = "ERROR_NO_SOURCE";
    errorText407.property("Transform").property("Position").setValue([1280, 720]);
    errorText407.guideLayer = true;
    
    var errorTextDoc407 = errorText407.property("Source Text").value;
    errorTextDoc407.fontSize = 48;
    errorTextDoc407.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc407.font = "Arial-BoldMT";
    errorTextDoc407.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText407.property("Source Text").setValue(errorTextDoc407);
}

planCompositions[407] = planComp407;


// Composition pour plan 00408
var planComp408 = project.items.addComp(
    "SQ23_UNDLM_00408_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.5600000000000005,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp408.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer408 = planComp408.layers.add(bgSolidComp);
bgLayer408.name = "BG_SOLID";
bgLayer408.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer408 = false;
if (gradingSources[408]) {
    var gradedLayer408 = planComp408.layers.add(gradingSources[408]);
    gradedLayer408.name = "UNDLM_00408_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer408.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer408.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer408 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer408 = false;
if (editSources[408]) {
    var editLayer408 = planComp408.layers.add(editSources[408]);
    editLayer408.name = "UNDLM_00408_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer408.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer408.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer408 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity408 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer408) {
    // EDIT toujours activé quand disponible
    editLayer408.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer408) {
        gradedLayer408.enabled = false;
    }
} else if (hasGradedLayer408) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer408.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText408 = planComp408.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText408.name = "WARNING_NO_EDIT";
    warningText408.property("Transform").property("Position").setValue([1280, 200]);
    warningText408.guideLayer = true;
    
    var warningTextDoc408 = warningText408.property("Source Text").value;
    warningTextDoc408.fontSize = 32;
    warningTextDoc408.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc408.font = "Arial-BoldMT";
    warningTextDoc408.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText408.property("Source Text").setValue(warningTextDoc408);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText408 = planComp408.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00408");
    errorText408.name = "ERROR_NO_SOURCE";
    errorText408.property("Transform").property("Position").setValue([1280, 720]);
    errorText408.guideLayer = true;
    
    var errorTextDoc408 = errorText408.property("Source Text").value;
    errorTextDoc408.fontSize = 48;
    errorTextDoc408.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc408.font = "Arial-BoldMT";
    errorTextDoc408.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText408.property("Source Text").setValue(errorTextDoc408);
}

planCompositions[408] = planComp408;


// Composition pour plan 00409
var planComp409 = project.items.addComp(
    "SQ23_UNDLM_00409_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp409.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer409 = planComp409.layers.add(bgSolidComp);
bgLayer409.name = "BG_SOLID";
bgLayer409.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer409 = false;
if (gradingSources[409]) {
    var gradedLayer409 = planComp409.layers.add(gradingSources[409]);
    gradedLayer409.name = "UNDLM_00409_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer409.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer409.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer409 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer409 = false;
if (editSources[409]) {
    var editLayer409 = planComp409.layers.add(editSources[409]);
    editLayer409.name = "UNDLM_00409_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer409.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer409.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer409 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity409 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer409) {
    // EDIT toujours activé quand disponible
    editLayer409.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer409) {
        gradedLayer409.enabled = false;
    }
} else if (hasGradedLayer409) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer409.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText409 = planComp409.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText409.name = "WARNING_NO_EDIT";
    warningText409.property("Transform").property("Position").setValue([1280, 200]);
    warningText409.guideLayer = true;
    
    var warningTextDoc409 = warningText409.property("Source Text").value;
    warningTextDoc409.fontSize = 32;
    warningTextDoc409.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc409.font = "Arial-BoldMT";
    warningTextDoc409.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText409.property("Source Text").setValue(warningTextDoc409);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText409 = planComp409.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00409");
    errorText409.name = "ERROR_NO_SOURCE";
    errorText409.property("Transform").property("Position").setValue([1280, 720]);
    errorText409.guideLayer = true;
    
    var errorTextDoc409 = errorText409.property("Source Text").value;
    errorTextDoc409.fontSize = 48;
    errorTextDoc409.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc409.font = "Arial-BoldMT";
    errorTextDoc409.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText409.property("Source Text").setValue(errorTextDoc409);
}

planCompositions[409] = planComp409;


// Composition pour plan 00410
var planComp410 = project.items.addComp(
    "SQ23_UNDLM_00410_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp410.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer410 = planComp410.layers.add(bgSolidComp);
bgLayer410.name = "BG_SOLID";
bgLayer410.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer410 = false;
if (gradingSources[410]) {
    var gradedLayer410 = planComp410.layers.add(gradingSources[410]);
    gradedLayer410.name = "UNDLM_00410_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer410.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer410.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer410 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer410 = false;
if (editSources[410]) {
    var editLayer410 = planComp410.layers.add(editSources[410]);
    editLayer410.name = "UNDLM_00410_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer410.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer410.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer410 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity410 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer410) {
    // EDIT toujours activé quand disponible
    editLayer410.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer410) {
        gradedLayer410.enabled = false;
    }
} else if (hasGradedLayer410) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer410.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText410 = planComp410.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText410.name = "WARNING_NO_EDIT";
    warningText410.property("Transform").property("Position").setValue([1280, 200]);
    warningText410.guideLayer = true;
    
    var warningTextDoc410 = warningText410.property("Source Text").value;
    warningTextDoc410.fontSize = 32;
    warningTextDoc410.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc410.font = "Arial-BoldMT";
    warningTextDoc410.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText410.property("Source Text").setValue(warningTextDoc410);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText410 = planComp410.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00410");
    errorText410.name = "ERROR_NO_SOURCE";
    errorText410.property("Transform").property("Position").setValue([1280, 720]);
    errorText410.guideLayer = true;
    
    var errorTextDoc410 = errorText410.property("Source Text").value;
    errorTextDoc410.fontSize = 48;
    errorTextDoc410.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc410.font = "Arial-BoldMT";
    errorTextDoc410.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText410.property("Source Text").setValue(errorTextDoc410);
}

planCompositions[410] = planComp410;


// Composition pour plan 00411
var planComp411 = project.items.addComp(
    "SQ23_UNDLM_00411_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp411.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer411 = planComp411.layers.add(bgSolidComp);
bgLayer411.name = "BG_SOLID";
bgLayer411.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer411 = false;
if (gradingSources[411]) {
    var gradedLayer411 = planComp411.layers.add(gradingSources[411]);
    gradedLayer411.name = "UNDLM_00411_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer411.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer411.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer411 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer411 = false;
if (editSources[411]) {
    var editLayer411 = planComp411.layers.add(editSources[411]);
    editLayer411.name = "UNDLM_00411_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer411.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer411.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer411 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity411 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer411) {
    // EDIT toujours activé quand disponible
    editLayer411.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer411) {
        gradedLayer411.enabled = false;
    }
} else if (hasGradedLayer411) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer411.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText411 = planComp411.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText411.name = "WARNING_NO_EDIT";
    warningText411.property("Transform").property("Position").setValue([1280, 200]);
    warningText411.guideLayer = true;
    
    var warningTextDoc411 = warningText411.property("Source Text").value;
    warningTextDoc411.fontSize = 32;
    warningTextDoc411.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc411.font = "Arial-BoldMT";
    warningTextDoc411.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText411.property("Source Text").setValue(warningTextDoc411);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText411 = planComp411.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00411");
    errorText411.name = "ERROR_NO_SOURCE";
    errorText411.property("Transform").property("Position").setValue([1280, 720]);
    errorText411.guideLayer = true;
    
    var errorTextDoc411 = errorText411.property("Source Text").value;
    errorTextDoc411.fontSize = 48;
    errorTextDoc411.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc411.font = "Arial-BoldMT";
    errorTextDoc411.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText411.property("Source Text").setValue(errorTextDoc411);
}

planCompositions[411] = planComp411;


// Composition pour plan 00412
var planComp412 = project.items.addComp(
    "SQ23_UNDLM_00412_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp412.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer412 = planComp412.layers.add(bgSolidComp);
bgLayer412.name = "BG_SOLID";
bgLayer412.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer412 = false;
if (gradingSources[412]) {
    var gradedLayer412 = planComp412.layers.add(gradingSources[412]);
    gradedLayer412.name = "UNDLM_00412_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer412.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer412.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer412 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer412 = false;
if (editSources[412]) {
    var editLayer412 = planComp412.layers.add(editSources[412]);
    editLayer412.name = "UNDLM_00412_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer412.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer412.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer412 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity412 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer412) {
    // EDIT toujours activé quand disponible
    editLayer412.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer412) {
        gradedLayer412.enabled = false;
    }
} else if (hasGradedLayer412) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer412.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText412 = planComp412.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText412.name = "WARNING_NO_EDIT";
    warningText412.property("Transform").property("Position").setValue([1280, 200]);
    warningText412.guideLayer = true;
    
    var warningTextDoc412 = warningText412.property("Source Text").value;
    warningTextDoc412.fontSize = 32;
    warningTextDoc412.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc412.font = "Arial-BoldMT";
    warningTextDoc412.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText412.property("Source Text").setValue(warningTextDoc412);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText412 = planComp412.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00412");
    errorText412.name = "ERROR_NO_SOURCE";
    errorText412.property("Transform").property("Position").setValue([1280, 720]);
    errorText412.guideLayer = true;
    
    var errorTextDoc412 = errorText412.property("Source Text").value;
    errorTextDoc412.fontSize = 48;
    errorTextDoc412.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc412.font = "Arial-BoldMT";
    errorTextDoc412.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText412.property("Source Text").setValue(errorTextDoc412);
}

planCompositions[412] = planComp412;


// Composition pour plan 00413
var planComp413 = project.items.addComp(
    "SQ23_UNDLM_00413_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp413.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer413 = planComp413.layers.add(bgSolidComp);
bgLayer413.name = "BG_SOLID";
bgLayer413.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer413 = false;
if (gradingSources[413]) {
    var gradedLayer413 = planComp413.layers.add(gradingSources[413]);
    gradedLayer413.name = "UNDLM_00413_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer413.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer413.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer413 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer413 = false;
if (editSources[413]) {
    var editLayer413 = planComp413.layers.add(editSources[413]);
    editLayer413.name = "UNDLM_00413_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer413.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer413.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer413 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity413 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer413) {
    // EDIT toujours activé quand disponible
    editLayer413.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer413) {
        gradedLayer413.enabled = false;
    }
} else if (hasGradedLayer413) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer413.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText413 = planComp413.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText413.name = "WARNING_NO_EDIT";
    warningText413.property("Transform").property("Position").setValue([1280, 200]);
    warningText413.guideLayer = true;
    
    var warningTextDoc413 = warningText413.property("Source Text").value;
    warningTextDoc413.fontSize = 32;
    warningTextDoc413.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc413.font = "Arial-BoldMT";
    warningTextDoc413.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText413.property("Source Text").setValue(warningTextDoc413);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText413 = planComp413.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00413");
    errorText413.name = "ERROR_NO_SOURCE";
    errorText413.property("Transform").property("Position").setValue([1280, 720]);
    errorText413.guideLayer = true;
    
    var errorTextDoc413 = errorText413.property("Source Text").value;
    errorTextDoc413.fontSize = 48;
    errorTextDoc413.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc413.font = "Arial-BoldMT";
    errorTextDoc413.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText413.property("Source Text").setValue(errorTextDoc413);
}

planCompositions[413] = planComp413;


// Composition pour plan 00414
var planComp414 = project.items.addComp(
    "SQ23_UNDLM_00414_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp414.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer414 = planComp414.layers.add(bgSolidComp);
bgLayer414.name = "BG_SOLID";
bgLayer414.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer414 = false;
if (gradingSources[414]) {
    var gradedLayer414 = planComp414.layers.add(gradingSources[414]);
    gradedLayer414.name = "UNDLM_00414_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer414.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer414.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer414 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer414 = false;
if (editSources[414]) {
    var editLayer414 = planComp414.layers.add(editSources[414]);
    editLayer414.name = "UNDLM_00414_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer414.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer414.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer414 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity414 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer414) {
    // EDIT toujours activé quand disponible
    editLayer414.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer414) {
        gradedLayer414.enabled = false;
    }
} else if (hasGradedLayer414) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer414.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText414 = planComp414.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText414.name = "WARNING_NO_EDIT";
    warningText414.property("Transform").property("Position").setValue([1280, 200]);
    warningText414.guideLayer = true;
    
    var warningTextDoc414 = warningText414.property("Source Text").value;
    warningTextDoc414.fontSize = 32;
    warningTextDoc414.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc414.font = "Arial-BoldMT";
    warningTextDoc414.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText414.property("Source Text").setValue(warningTextDoc414);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText414 = planComp414.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00414");
    errorText414.name = "ERROR_NO_SOURCE";
    errorText414.property("Transform").property("Position").setValue([1280, 720]);
    errorText414.guideLayer = true;
    
    var errorTextDoc414 = errorText414.property("Source Text").value;
    errorTextDoc414.fontSize = 48;
    errorTextDoc414.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc414.font = "Arial-BoldMT";
    errorTextDoc414.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText414.property("Source Text").setValue(errorTextDoc414);
}

planCompositions[414] = planComp414;


// Composition pour plan 00415
var planComp415 = project.items.addComp(
    "SQ23_UNDLM_00415_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp415.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer415 = planComp415.layers.add(bgSolidComp);
bgLayer415.name = "BG_SOLID";
bgLayer415.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer415 = false;
if (gradingSources[415]) {
    var gradedLayer415 = planComp415.layers.add(gradingSources[415]);
    gradedLayer415.name = "UNDLM_00415_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer415.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer415.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer415 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer415 = false;
if (editSources[415]) {
    var editLayer415 = planComp415.layers.add(editSources[415]);
    editLayer415.name = "UNDLM_00415_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer415.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer415.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer415 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity415 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer415) {
    // EDIT toujours activé quand disponible
    editLayer415.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer415) {
        gradedLayer415.enabled = false;
    }
} else if (hasGradedLayer415) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer415.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText415 = planComp415.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText415.name = "WARNING_NO_EDIT";
    warningText415.property("Transform").property("Position").setValue([1280, 200]);
    warningText415.guideLayer = true;
    
    var warningTextDoc415 = warningText415.property("Source Text").value;
    warningTextDoc415.fontSize = 32;
    warningTextDoc415.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc415.font = "Arial-BoldMT";
    warningTextDoc415.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText415.property("Source Text").setValue(warningTextDoc415);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText415 = planComp415.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00415");
    errorText415.name = "ERROR_NO_SOURCE";
    errorText415.property("Transform").property("Position").setValue([1280, 720]);
    errorText415.guideLayer = true;
    
    var errorTextDoc415 = errorText415.property("Source Text").value;
    errorTextDoc415.fontSize = 48;
    errorTextDoc415.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc415.font = "Arial-BoldMT";
    errorTextDoc415.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText415.property("Source Text").setValue(errorTextDoc415);
}

planCompositions[415] = planComp415;


// Composition pour plan 00416
var planComp416 = project.items.addComp(
    "SQ23_UNDLM_00416_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp416.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer416 = planComp416.layers.add(bgSolidComp);
bgLayer416.name = "BG_SOLID";
bgLayer416.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer416 = false;
if (gradingSources[416]) {
    var gradedLayer416 = planComp416.layers.add(gradingSources[416]);
    gradedLayer416.name = "UNDLM_00416_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer416.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer416.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer416 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer416 = false;
if (editSources[416]) {
    var editLayer416 = planComp416.layers.add(editSources[416]);
    editLayer416.name = "UNDLM_00416_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer416.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer416.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer416 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity416 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer416) {
    // EDIT toujours activé quand disponible
    editLayer416.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer416) {
        gradedLayer416.enabled = false;
    }
} else if (hasGradedLayer416) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer416.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText416 = planComp416.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText416.name = "WARNING_NO_EDIT";
    warningText416.property("Transform").property("Position").setValue([1280, 200]);
    warningText416.guideLayer = true;
    
    var warningTextDoc416 = warningText416.property("Source Text").value;
    warningTextDoc416.fontSize = 32;
    warningTextDoc416.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc416.font = "Arial-BoldMT";
    warningTextDoc416.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText416.property("Source Text").setValue(warningTextDoc416);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText416 = planComp416.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00416");
    errorText416.name = "ERROR_NO_SOURCE";
    errorText416.property("Transform").property("Position").setValue([1280, 720]);
    errorText416.guideLayer = true;
    
    var errorTextDoc416 = errorText416.property("Source Text").value;
    errorTextDoc416.fontSize = 48;
    errorTextDoc416.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc416.font = "Arial-BoldMT";
    errorTextDoc416.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText416.property("Source Text").setValue(errorTextDoc416);
}

planCompositions[416] = planComp416;


// Composition pour plan 00417
var planComp417 = project.items.addComp(
    "SQ23_UNDLM_00417_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp417.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer417 = planComp417.layers.add(bgSolidComp);
bgLayer417.name = "BG_SOLID";
bgLayer417.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer417 = false;
if (gradingSources[417]) {
    var gradedLayer417 = planComp417.layers.add(gradingSources[417]);
    gradedLayer417.name = "UNDLM_00417_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer417.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer417.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer417 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer417 = false;
if (editSources[417]) {
    var editLayer417 = planComp417.layers.add(editSources[417]);
    editLayer417.name = "UNDLM_00417_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer417.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer417.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer417 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity417 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer417) {
    // EDIT toujours activé quand disponible
    editLayer417.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer417) {
        gradedLayer417.enabled = false;
    }
} else if (hasGradedLayer417) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer417.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText417 = planComp417.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText417.name = "WARNING_NO_EDIT";
    warningText417.property("Transform").property("Position").setValue([1280, 200]);
    warningText417.guideLayer = true;
    
    var warningTextDoc417 = warningText417.property("Source Text").value;
    warningTextDoc417.fontSize = 32;
    warningTextDoc417.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc417.font = "Arial-BoldMT";
    warningTextDoc417.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText417.property("Source Text").setValue(warningTextDoc417);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText417 = planComp417.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00417");
    errorText417.name = "ERROR_NO_SOURCE";
    errorText417.property("Transform").property("Position").setValue([1280, 720]);
    errorText417.guideLayer = true;
    
    var errorTextDoc417 = errorText417.property("Source Text").value;
    errorTextDoc417.fontSize = 48;
    errorTextDoc417.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc417.font = "Arial-BoldMT";
    errorTextDoc417.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText417.property("Source Text").setValue(errorTextDoc417);
}

planCompositions[417] = planComp417;


// Composition pour plan 00418
var planComp418 = project.items.addComp(
    "SQ23_UNDLM_00418_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp418.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer418 = planComp418.layers.add(bgSolidComp);
bgLayer418.name = "BG_SOLID";
bgLayer418.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer418 = false;
if (gradingSources[418]) {
    var gradedLayer418 = planComp418.layers.add(gradingSources[418]);
    gradedLayer418.name = "UNDLM_00418_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer418.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer418.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer418 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer418 = false;
if (editSources[418]) {
    var editLayer418 = planComp418.layers.add(editSources[418]);
    editLayer418.name = "UNDLM_00418_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer418.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer418.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer418 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity418 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer418) {
    // EDIT toujours activé quand disponible
    editLayer418.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer418) {
        gradedLayer418.enabled = false;
    }
} else if (hasGradedLayer418) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer418.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText418 = planComp418.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText418.name = "WARNING_NO_EDIT";
    warningText418.property("Transform").property("Position").setValue([1280, 200]);
    warningText418.guideLayer = true;
    
    var warningTextDoc418 = warningText418.property("Source Text").value;
    warningTextDoc418.fontSize = 32;
    warningTextDoc418.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc418.font = "Arial-BoldMT";
    warningTextDoc418.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText418.property("Source Text").setValue(warningTextDoc418);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText418 = planComp418.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00418");
    errorText418.name = "ERROR_NO_SOURCE";
    errorText418.property("Transform").property("Position").setValue([1280, 720]);
    errorText418.guideLayer = true;
    
    var errorTextDoc418 = errorText418.property("Source Text").value;
    errorTextDoc418.fontSize = 48;
    errorTextDoc418.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc418.font = "Arial-BoldMT";
    errorTextDoc418.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText418.property("Source Text").setValue(errorTextDoc418);
}

planCompositions[418] = planComp418;


// Composition pour plan 00419
var planComp419 = project.items.addComp(
    "SQ23_UNDLM_00419_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.6400000000000001,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp419.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer419 = planComp419.layers.add(bgSolidComp);
bgLayer419.name = "BG_SOLID";
bgLayer419.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer419 = false;
if (gradingSources[419]) {
    var gradedLayer419 = planComp419.layers.add(gradingSources[419]);
    gradedLayer419.name = "UNDLM_00419_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer419.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer419.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer419 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer419 = false;
if (editSources[419]) {
    var editLayer419 = planComp419.layers.add(editSources[419]);
    editLayer419.name = "UNDLM_00419_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer419.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer419.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer419 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity419 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer419) {
    // EDIT toujours activé quand disponible
    editLayer419.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer419) {
        gradedLayer419.enabled = false;
    }
} else if (hasGradedLayer419) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer419.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText419 = planComp419.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText419.name = "WARNING_NO_EDIT";
    warningText419.property("Transform").property("Position").setValue([1280, 200]);
    warningText419.guideLayer = true;
    
    var warningTextDoc419 = warningText419.property("Source Text").value;
    warningTextDoc419.fontSize = 32;
    warningTextDoc419.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc419.font = "Arial-BoldMT";
    warningTextDoc419.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText419.property("Source Text").setValue(warningTextDoc419);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText419 = planComp419.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00419");
    errorText419.name = "ERROR_NO_SOURCE";
    errorText419.property("Transform").property("Position").setValue([1280, 720]);
    errorText419.guideLayer = true;
    
    var errorTextDoc419 = errorText419.property("Source Text").value;
    errorTextDoc419.fontSize = 48;
    errorTextDoc419.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc419.font = "Arial-BoldMT";
    errorTextDoc419.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText419.property("Source Text").setValue(errorTextDoc419);
}

planCompositions[419] = planComp419;


// Composition pour plan 00420
var planComp420 = project.items.addComp(
    "SQ23_UNDLM_00420_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp420.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer420 = planComp420.layers.add(bgSolidComp);
bgLayer420.name = "BG_SOLID";
bgLayer420.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer420 = false;
if (gradingSources[420]) {
    var gradedLayer420 = planComp420.layers.add(gradingSources[420]);
    gradedLayer420.name = "UNDLM_00420_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer420.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer420.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer420 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer420 = false;
if (editSources[420]) {
    var editLayer420 = planComp420.layers.add(editSources[420]);
    editLayer420.name = "UNDLM_00420_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer420.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer420.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer420 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity420 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer420) {
    // EDIT toujours activé quand disponible
    editLayer420.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer420) {
        gradedLayer420.enabled = false;
    }
} else if (hasGradedLayer420) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer420.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText420 = planComp420.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText420.name = "WARNING_NO_EDIT";
    warningText420.property("Transform").property("Position").setValue([1280, 200]);
    warningText420.guideLayer = true;
    
    var warningTextDoc420 = warningText420.property("Source Text").value;
    warningTextDoc420.fontSize = 32;
    warningTextDoc420.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc420.font = "Arial-BoldMT";
    warningTextDoc420.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText420.property("Source Text").setValue(warningTextDoc420);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText420 = planComp420.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00420");
    errorText420.name = "ERROR_NO_SOURCE";
    errorText420.property("Transform").property("Position").setValue([1280, 720]);
    errorText420.guideLayer = true;
    
    var errorTextDoc420 = errorText420.property("Source Text").value;
    errorTextDoc420.fontSize = 48;
    errorTextDoc420.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc420.font = "Arial-BoldMT";
    errorTextDoc420.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText420.property("Source Text").setValue(errorTextDoc420);
}

planCompositions[420] = planComp420;


// Composition pour plan 00421
var planComp421 = project.items.addComp(
    "SQ23_UNDLM_00421_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp421.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer421 = planComp421.layers.add(bgSolidComp);
bgLayer421.name = "BG_SOLID";
bgLayer421.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer421 = false;
if (gradingSources[421]) {
    var gradedLayer421 = planComp421.layers.add(gradingSources[421]);
    gradedLayer421.name = "UNDLM_00421_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer421.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer421.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer421 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer421 = false;
if (editSources[421]) {
    var editLayer421 = planComp421.layers.add(editSources[421]);
    editLayer421.name = "UNDLM_00421_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer421.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer421.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer421 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity421 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer421) {
    // EDIT toujours activé quand disponible
    editLayer421.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer421) {
        gradedLayer421.enabled = false;
    }
} else if (hasGradedLayer421) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer421.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText421 = planComp421.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText421.name = "WARNING_NO_EDIT";
    warningText421.property("Transform").property("Position").setValue([1280, 200]);
    warningText421.guideLayer = true;
    
    var warningTextDoc421 = warningText421.property("Source Text").value;
    warningTextDoc421.fontSize = 32;
    warningTextDoc421.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc421.font = "Arial-BoldMT";
    warningTextDoc421.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText421.property("Source Text").setValue(warningTextDoc421);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText421 = planComp421.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00421");
    errorText421.name = "ERROR_NO_SOURCE";
    errorText421.property("Transform").property("Position").setValue([1280, 720]);
    errorText421.guideLayer = true;
    
    var errorTextDoc421 = errorText421.property("Source Text").value;
    errorTextDoc421.fontSize = 48;
    errorTextDoc421.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc421.font = "Arial-BoldMT";
    errorTextDoc421.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText421.property("Source Text").setValue(errorTextDoc421);
}

planCompositions[421] = planComp421;


// Composition pour plan 00422
var planComp422 = project.items.addComp(
    "SQ23_UNDLM_00422_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp422.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer422 = planComp422.layers.add(bgSolidComp);
bgLayer422.name = "BG_SOLID";
bgLayer422.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer422 = false;
if (gradingSources[422]) {
    var gradedLayer422 = planComp422.layers.add(gradingSources[422]);
    gradedLayer422.name = "UNDLM_00422_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer422.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer422.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer422 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer422 = false;
if (editSources[422]) {
    var editLayer422 = planComp422.layers.add(editSources[422]);
    editLayer422.name = "UNDLM_00422_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer422.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer422.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer422 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity422 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer422) {
    // EDIT toujours activé quand disponible
    editLayer422.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer422) {
        gradedLayer422.enabled = false;
    }
} else if (hasGradedLayer422) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer422.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText422 = planComp422.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText422.name = "WARNING_NO_EDIT";
    warningText422.property("Transform").property("Position").setValue([1280, 200]);
    warningText422.guideLayer = true;
    
    var warningTextDoc422 = warningText422.property("Source Text").value;
    warningTextDoc422.fontSize = 32;
    warningTextDoc422.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc422.font = "Arial-BoldMT";
    warningTextDoc422.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText422.property("Source Text").setValue(warningTextDoc422);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText422 = planComp422.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00422");
    errorText422.name = "ERROR_NO_SOURCE";
    errorText422.property("Transform").property("Position").setValue([1280, 720]);
    errorText422.guideLayer = true;
    
    var errorTextDoc422 = errorText422.property("Source Text").value;
    errorTextDoc422.fontSize = 48;
    errorTextDoc422.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc422.font = "Arial-BoldMT";
    errorTextDoc422.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText422.property("Source Text").setValue(errorTextDoc422);
}

planCompositions[422] = planComp422;


// Composition pour plan 00423
var planComp423 = project.items.addComp(
    "SQ23_UNDLM_00423_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    24.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp423.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer423 = planComp423.layers.add(bgSolidComp);
bgLayer423.name = "BG_SOLID";
bgLayer423.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer423 = false;
if (gradingSources[423]) {
    var gradedLayer423 = planComp423.layers.add(gradingSources[423]);
    gradedLayer423.name = "UNDLM_00423_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer423.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer423.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer423 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer423 = false;
if (editSources[423]) {
    var editLayer423 = planComp423.layers.add(editSources[423]);
    editLayer423.name = "UNDLM_00423_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer423.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer423.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer423 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity423 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer423) {
    // EDIT toujours activé quand disponible
    editLayer423.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer423) {
        gradedLayer423.enabled = false;
    }
} else if (hasGradedLayer423) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer423.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText423 = planComp423.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText423.name = "WARNING_NO_EDIT";
    warningText423.property("Transform").property("Position").setValue([1280, 200]);
    warningText423.guideLayer = true;
    
    var warningTextDoc423 = warningText423.property("Source Text").value;
    warningTextDoc423.fontSize = 32;
    warningTextDoc423.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc423.font = "Arial-BoldMT";
    warningTextDoc423.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText423.property("Source Text").setValue(warningTextDoc423);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText423 = planComp423.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00423");
    errorText423.name = "ERROR_NO_SOURCE";
    errorText423.property("Transform").property("Position").setValue([1280, 720]);
    errorText423.guideLayer = true;
    
    var errorTextDoc423 = errorText423.property("Source Text").value;
    errorTextDoc423.fontSize = 48;
    errorTextDoc423.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc423.font = "Arial-BoldMT";
    errorTextDoc423.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText423.property("Source Text").setValue(errorTextDoc423);
}

planCompositions[423] = planComp423;


// Composition pour plan 00424
var planComp424 = project.items.addComp(
    "SQ23_UNDLM_00424_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    13.56,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp424.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer424 = planComp424.layers.add(bgSolidComp);
bgLayer424.name = "BG_SOLID";
bgLayer424.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer424 = false;
if (gradingSources[424]) {
    var gradedLayer424 = planComp424.layers.add(gradingSources[424]);
    gradedLayer424.name = "UNDLM_00424_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer424.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer424.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer424 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer424 = false;
if (editSources[424]) {
    var editLayer424 = planComp424.layers.add(editSources[424]);
    editLayer424.name = "UNDLM_00424_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer424.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer424.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer424 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity424 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer424) {
    // EDIT toujours activé quand disponible
    editLayer424.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer424) {
        gradedLayer424.enabled = false;
    }
} else if (hasGradedLayer424) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer424.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText424 = planComp424.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText424.name = "WARNING_NO_EDIT";
    warningText424.property("Transform").property("Position").setValue([1280, 200]);
    warningText424.guideLayer = true;
    
    var warningTextDoc424 = warningText424.property("Source Text").value;
    warningTextDoc424.fontSize = 32;
    warningTextDoc424.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc424.font = "Arial-BoldMT";
    warningTextDoc424.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText424.property("Source Text").setValue(warningTextDoc424);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText424 = planComp424.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00424");
    errorText424.name = "ERROR_NO_SOURCE";
    errorText424.property("Transform").property("Position").setValue([1280, 720]);
    errorText424.guideLayer = true;
    
    var errorTextDoc424 = errorText424.property("Source Text").value;
    errorTextDoc424.fontSize = 48;
    errorTextDoc424.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc424.font = "Arial-BoldMT";
    errorTextDoc424.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText424.property("Source Text").setValue(errorTextDoc424);
}

planCompositions[424] = planComp424;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ23_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    178.35999999999999, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00401 à la timeline master
if (planCompositions[401]) {
    var masterLayer401 = masterComp.layers.add(planCompositions[401]);
    masterLayer401.startTime = 0;
    masterLayer401.name = "UNDLM_00401";
    masterLayer401.label = 1; // Couleurs alternées
}

// Ajouter plan 00402 à la timeline master
if (planCompositions[402]) {
    var masterLayer402 = masterComp.layers.add(planCompositions[402]);
    masterLayer402.startTime = 8.52;
    masterLayer402.name = "UNDLM_00402";
    masterLayer402.label = 2; // Couleurs alternées
}

// Ajouter plan 00403 à la timeline master
if (planCompositions[403]) {
    var masterLayer403 = masterComp.layers.add(planCompositions[403]);
    masterLayer403.startTime = 18.2;
    masterLayer403.name = "UNDLM_00403";
    masterLayer403.label = 3; // Couleurs alternées
}

// Ajouter plan 00404 à la timeline master
if (planCompositions[404]) {
    var masterLayer404 = masterComp.layers.add(planCompositions[404]);
    masterLayer404.startTime = 26.88;
    masterLayer404.name = "UNDLM_00404";
    masterLayer404.label = 4; // Couleurs alternées
}

// Ajouter plan 00405 à la timeline master
if (planCompositions[405]) {
    var masterLayer405 = masterComp.layers.add(planCompositions[405]);
    masterLayer405.startTime = 35.48;
    masterLayer405.name = "UNDLM_00405";
    masterLayer405.label = 5; // Couleurs alternées
}

// Ajouter plan 00406 à la timeline master
if (planCompositions[406]) {
    var masterLayer406 = masterComp.layers.add(planCompositions[406]);
    masterLayer406.startTime = 43.48;
    masterLayer406.name = "UNDLM_00406";
    masterLayer406.label = 6; // Couleurs alternées
}

// Ajouter plan 00407 à la timeline master
if (planCompositions[407]) {
    var masterLayer407 = masterComp.layers.add(planCompositions[407]);
    masterLayer407.startTime = 55.199999999999996;
    masterLayer407.name = "UNDLM_00407";
    masterLayer407.label = 7; // Couleurs alternées
}

// Ajouter plan 00408 à la timeline master
if (planCompositions[408]) {
    var masterLayer408 = masterComp.layers.add(planCompositions[408]);
    masterLayer408.startTime = 58.839999999999996;
    masterLayer408.name = "UNDLM_00408";
    masterLayer408.label = 8; // Couleurs alternées
}

// Ajouter plan 00409 à la timeline master
if (planCompositions[409]) {
    var masterLayer409 = masterComp.layers.add(planCompositions[409]);
    masterLayer409.startTime = 66.39999999999999;
    masterLayer409.name = "UNDLM_00409";
    masterLayer409.label = 9; // Couleurs alternées
}

// Ajouter plan 00410 à la timeline master
if (planCompositions[410]) {
    var masterLayer410 = masterComp.layers.add(planCompositions[410]);
    masterLayer410.startTime = 71.83999999999999;
    masterLayer410.name = "UNDLM_00410";
    masterLayer410.label = 10; // Couleurs alternées
}

// Ajouter plan 00411 à la timeline master
if (planCompositions[411]) {
    var masterLayer411 = masterComp.layers.add(planCompositions[411]);
    masterLayer411.startTime = 77.07999999999998;
    masterLayer411.name = "UNDLM_00411";
    masterLayer411.label = 11; // Couleurs alternées
}

// Ajouter plan 00412 à la timeline master
if (planCompositions[412]) {
    var masterLayer412 = masterComp.layers.add(planCompositions[412]);
    masterLayer412.startTime = 84.87999999999998;
    masterLayer412.name = "UNDLM_00412";
    masterLayer412.label = 12; // Couleurs alternées
}

// Ajouter plan 00413 à la timeline master
if (planCompositions[413]) {
    var masterLayer413 = masterComp.layers.add(planCompositions[413]);
    masterLayer413.startTime = 88.67999999999998;
    masterLayer413.name = "UNDLM_00413";
    masterLayer413.label = 13; // Couleurs alternées
}

// Ajouter plan 00414 à la timeline master
if (planCompositions[414]) {
    var masterLayer414 = masterComp.layers.add(planCompositions[414]);
    masterLayer414.startTime = 96.55999999999997;
    masterLayer414.name = "UNDLM_00414";
    masterLayer414.label = 14; // Couleurs alternées
}

// Ajouter plan 00415 à la timeline master
if (planCompositions[415]) {
    var masterLayer415 = masterComp.layers.add(planCompositions[415]);
    masterLayer415.startTime = 103.35999999999997;
    masterLayer415.name = "UNDLM_00415";
    masterLayer415.label = 15; // Couleurs alternées
}

// Ajouter plan 00416 à la timeline master
if (planCompositions[416]) {
    var masterLayer416 = masterComp.layers.add(planCompositions[416]);
    masterLayer416.startTime = 107.27999999999997;
    masterLayer416.name = "UNDLM_00416";
    masterLayer416.label = 16; // Couleurs alternées
}

// Ajouter plan 00417 à la timeline master
if (planCompositions[417]) {
    var masterLayer417 = masterComp.layers.add(planCompositions[417]);
    masterLayer417.startTime = 112.75999999999998;
    masterLayer417.name = "UNDLM_00417";
    masterLayer417.label = 1; // Couleurs alternées
}

// Ajouter plan 00418 à la timeline master
if (planCompositions[418]) {
    var masterLayer418 = masterComp.layers.add(planCompositions[418]);
    masterLayer418.startTime = 115.67999999999998;
    masterLayer418.name = "UNDLM_00418";
    masterLayer418.label = 2; // Couleurs alternées
}

// Ajouter plan 00419 à la timeline master
if (planCompositions[419]) {
    var masterLayer419 = masterComp.layers.add(planCompositions[419]);
    masterLayer419.startTime = 121.87999999999998;
    masterLayer419.name = "UNDLM_00419";
    masterLayer419.label = 3; // Couleurs alternées
}

// Ajouter plan 00420 à la timeline master
if (planCompositions[420]) {
    var masterLayer420 = masterComp.layers.add(planCompositions[420]);
    masterLayer420.startTime = 123.51999999999998;
    masterLayer420.name = "UNDLM_00420";
    masterLayer420.label = 4; // Couleurs alternées
}

// Ajouter plan 00421 à la timeline master
if (planCompositions[421]) {
    var masterLayer421 = masterComp.layers.add(planCompositions[421]);
    masterLayer421.startTime = 131.39999999999998;
    masterLayer421.name = "UNDLM_00421";
    masterLayer421.label = 5; // Couleurs alternées
}

// Ajouter plan 00422 à la timeline master
if (planCompositions[422]) {
    var masterLayer422 = masterComp.layers.add(planCompositions[422]);
    masterLayer422.startTime = 136.11999999999998;
    masterLayer422.name = "UNDLM_00422";
    masterLayer422.label = 6; // Couleurs alternées
}

// Ajouter plan 00423 à la timeline master
if (planCompositions[423]) {
    var masterLayer423 = masterComp.layers.add(planCompositions[423]);
    masterLayer423.startTime = 140.55999999999997;
    masterLayer423.name = "UNDLM_00423";
    masterLayer423.label = 7; // Couleurs alternées
}

// Ajouter plan 00424 à la timeline master
if (planCompositions[424]) {
    var masterLayer424 = masterComp.layers.add(planCompositions[424]);
    masterLayer424.startTime = 164.79999999999998;
    masterLayer424.name = "UNDLM_00424";
    masterLayer424.label = 8; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ23";\n' +
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
    {start: 0, end: 8.52, name: "UNDLM_00401"},
    {start: 8.52, end: 18.2, name: "UNDLM_00402"},
    {start: 18.2, end: 26.88, name: "UNDLM_00403"},
    {start: 26.88, end: 35.48, name: "UNDLM_00404"},
    {start: 35.48, end: 43.48, name: "UNDLM_00405"},
    {start: 43.48, end: 55.199999999999996, name: "UNDLM_00406"},
    {start: 55.199999999999996, end: 58.839999999999996, name: "UNDLM_00407"},
    {start: 58.839999999999996, end: 66.39999999999999, name: "UNDLM_00408"},
    {start: 66.39999999999999, end: 71.83999999999999, name: "UNDLM_00409"},
    {start: 71.83999999999999, end: 77.07999999999998, name: "UNDLM_00410"},
    {start: 77.07999999999998, end: 84.87999999999998, name: "UNDLM_00411"},
    {start: 84.87999999999998, end: 88.67999999999998, name: "UNDLM_00412"},
    {start: 88.67999999999998, end: 96.55999999999997, name: "UNDLM_00413"},
    {start: 96.55999999999997, end: 103.35999999999997, name: "UNDLM_00414"},
    {start: 103.35999999999997, end: 107.27999999999997, name: "UNDLM_00415"},
    {start: 107.27999999999997, end: 112.75999999999998, name: "UNDLM_00416"},
    {start: 112.75999999999998, end: 115.67999999999998, name: "UNDLM_00417"},
    {start: 115.67999999999998, end: 121.87999999999998, name: "UNDLM_00418"},
    {start: 121.87999999999998, end: 123.51999999999998, name: "UNDLM_00419"},
    {start: 123.51999999999998, end: 131.39999999999998, name: "UNDLM_00420"},
    {start: 131.39999999999998, end: 136.11999999999998, name: "UNDLM_00421"},
    {start: 136.11999999999998, end: 140.55999999999997, name: "UNDLM_00422"},
    {start: 140.55999999999997, end: 164.79999999999998, name: "UNDLM_00423"},
    {start: 164.79999999999998, end: 178.35999999999999, name: "UNDLM_00424"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ23/_AE/SQ23_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 24;
var totalCount = 24;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ23 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(178.35999999999999 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ23_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ23:" + totalCount + ":" + gradedCount);
