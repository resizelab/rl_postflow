
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ21 avec 33 plans
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


// Import plan EDIT 00347
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile347 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00347.mov");
var editFilePoignees347 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00347_AVEC_POIGNEES.mov");
var editFileBis347 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00347bis.mov");

var importSuccess347 = false;
var fileName347 = "";

// Tenter import standard
if (editFile347.exists) {
    try {
        var editFootage347 = project.importFile(new ImportOptions(editFile347));
        editFootage347.parentFolder = fromEditFolder;
        editFootage347.name = "UNDLM_00347";
        editSources[347] = editFootage347;
        editImportCount++;
        importSuccess347 = true;
        fileName347 = "UNDLM_00347.mov";
        logImportSuccess(347, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00347.mov", fileName347);
    } catch (e) {
        logImportError(347, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00347.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess347 && editFilePoignees347.exists) {
    try {
        var editFootage347 = project.importFile(new ImportOptions(editFilePoignees347));
        editFootage347.parentFolder = fromEditFolder;
        editFootage347.name = "UNDLM_00347_AVEC_POIGNEES";
        editSources[347] = editFootage347;
        editImportCount++;
        importSuccess347 = true;
        fileName347 = "UNDLM_00347_AVEC_POIGNEES.mov";
        logImportSuccess(347, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00347_AVEC_POIGNEES.mov", fileName347);
    } catch (e) {
        logImportError(347, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00347_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess347 && editFileBis347.exists) {
    try {
        var editFootage347 = project.importFile(new ImportOptions(editFileBis347));
        editFootage347.parentFolder = fromEditFolder;
        editFootage347.name = "UNDLM_00347bis";
        editSources[347] = editFootage347;
        editImportCount++;
        importSuccess347 = true;
        fileName347 = "UNDLM_00347bis.mov";
        logImportSuccess(347, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00347bis.mov", fileName347);
    } catch (e) {
        logImportError(347, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00347bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess347) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00347.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00348
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile348 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00348.mov");
var editFilePoignees348 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00348_AVEC_POIGNEES.mov");
var editFileBis348 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00348bis.mov");

var importSuccess348 = false;
var fileName348 = "";

// Tenter import standard
if (editFile348.exists) {
    try {
        var editFootage348 = project.importFile(new ImportOptions(editFile348));
        editFootage348.parentFolder = fromEditFolder;
        editFootage348.name = "UNDLM_00348";
        editSources[348] = editFootage348;
        editImportCount++;
        importSuccess348 = true;
        fileName348 = "UNDLM_00348.mov";
        logImportSuccess(348, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00348.mov", fileName348);
    } catch (e) {
        logImportError(348, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00348.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess348 && editFilePoignees348.exists) {
    try {
        var editFootage348 = project.importFile(new ImportOptions(editFilePoignees348));
        editFootage348.parentFolder = fromEditFolder;
        editFootage348.name = "UNDLM_00348_AVEC_POIGNEES";
        editSources[348] = editFootage348;
        editImportCount++;
        importSuccess348 = true;
        fileName348 = "UNDLM_00348_AVEC_POIGNEES.mov";
        logImportSuccess(348, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00348_AVEC_POIGNEES.mov", fileName348);
    } catch (e) {
        logImportError(348, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00348_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess348 && editFileBis348.exists) {
    try {
        var editFootage348 = project.importFile(new ImportOptions(editFileBis348));
        editFootage348.parentFolder = fromEditFolder;
        editFootage348.name = "UNDLM_00348bis";
        editSources[348] = editFootage348;
        editImportCount++;
        importSuccess348 = true;
        fileName348 = "UNDLM_00348bis.mov";
        logImportSuccess(348, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00348bis.mov", fileName348);
    } catch (e) {
        logImportError(348, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00348bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess348) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00348.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00349
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile349 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00349.mov");
var editFilePoignees349 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00349_AVEC_POIGNEES.mov");
var editFileBis349 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00349bis.mov");

var importSuccess349 = false;
var fileName349 = "";

// Tenter import standard
if (editFile349.exists) {
    try {
        var editFootage349 = project.importFile(new ImportOptions(editFile349));
        editFootage349.parentFolder = fromEditFolder;
        editFootage349.name = "UNDLM_00349";
        editSources[349] = editFootage349;
        editImportCount++;
        importSuccess349 = true;
        fileName349 = "UNDLM_00349.mov";
        logImportSuccess(349, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00349.mov", fileName349);
    } catch (e) {
        logImportError(349, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00349.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess349 && editFilePoignees349.exists) {
    try {
        var editFootage349 = project.importFile(new ImportOptions(editFilePoignees349));
        editFootage349.parentFolder = fromEditFolder;
        editFootage349.name = "UNDLM_00349_AVEC_POIGNEES";
        editSources[349] = editFootage349;
        editImportCount++;
        importSuccess349 = true;
        fileName349 = "UNDLM_00349_AVEC_POIGNEES.mov";
        logImportSuccess(349, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00349_AVEC_POIGNEES.mov", fileName349);
    } catch (e) {
        logImportError(349, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00349_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess349 && editFileBis349.exists) {
    try {
        var editFootage349 = project.importFile(new ImportOptions(editFileBis349));
        editFootage349.parentFolder = fromEditFolder;
        editFootage349.name = "UNDLM_00349bis";
        editSources[349] = editFootage349;
        editImportCount++;
        importSuccess349 = true;
        fileName349 = "UNDLM_00349bis.mov";
        logImportSuccess(349, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00349bis.mov", fileName349);
    } catch (e) {
        logImportError(349, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00349bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess349) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00349.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00350
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile350 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00350.mov");
var editFilePoignees350 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00350_AVEC_POIGNEES.mov");
var editFileBis350 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00350bis.mov");

var importSuccess350 = false;
var fileName350 = "";

// Tenter import standard
if (editFile350.exists) {
    try {
        var editFootage350 = project.importFile(new ImportOptions(editFile350));
        editFootage350.parentFolder = fromEditFolder;
        editFootage350.name = "UNDLM_00350";
        editSources[350] = editFootage350;
        editImportCount++;
        importSuccess350 = true;
        fileName350 = "UNDLM_00350.mov";
        logImportSuccess(350, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00350.mov", fileName350);
    } catch (e) {
        logImportError(350, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00350.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess350 && editFilePoignees350.exists) {
    try {
        var editFootage350 = project.importFile(new ImportOptions(editFilePoignees350));
        editFootage350.parentFolder = fromEditFolder;
        editFootage350.name = "UNDLM_00350_AVEC_POIGNEES";
        editSources[350] = editFootage350;
        editImportCount++;
        importSuccess350 = true;
        fileName350 = "UNDLM_00350_AVEC_POIGNEES.mov";
        logImportSuccess(350, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00350_AVEC_POIGNEES.mov", fileName350);
    } catch (e) {
        logImportError(350, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00350_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess350 && editFileBis350.exists) {
    try {
        var editFootage350 = project.importFile(new ImportOptions(editFileBis350));
        editFootage350.parentFolder = fromEditFolder;
        editFootage350.name = "UNDLM_00350bis";
        editSources[350] = editFootage350;
        editImportCount++;
        importSuccess350 = true;
        fileName350 = "UNDLM_00350bis.mov";
        logImportSuccess(350, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00350bis.mov", fileName350);
    } catch (e) {
        logImportError(350, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00350bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess350) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00350.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00351
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile351 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00351.mov");
var editFilePoignees351 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00351_AVEC_POIGNEES.mov");
var editFileBis351 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00351bis.mov");

var importSuccess351 = false;
var fileName351 = "";

// Tenter import standard
if (editFile351.exists) {
    try {
        var editFootage351 = project.importFile(new ImportOptions(editFile351));
        editFootage351.parentFolder = fromEditFolder;
        editFootage351.name = "UNDLM_00351";
        editSources[351] = editFootage351;
        editImportCount++;
        importSuccess351 = true;
        fileName351 = "UNDLM_00351.mov";
        logImportSuccess(351, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00351.mov", fileName351);
    } catch (e) {
        logImportError(351, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00351.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess351 && editFilePoignees351.exists) {
    try {
        var editFootage351 = project.importFile(new ImportOptions(editFilePoignees351));
        editFootage351.parentFolder = fromEditFolder;
        editFootage351.name = "UNDLM_00351_AVEC_POIGNEES";
        editSources[351] = editFootage351;
        editImportCount++;
        importSuccess351 = true;
        fileName351 = "UNDLM_00351_AVEC_POIGNEES.mov";
        logImportSuccess(351, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00351_AVEC_POIGNEES.mov", fileName351);
    } catch (e) {
        logImportError(351, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00351_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess351 && editFileBis351.exists) {
    try {
        var editFootage351 = project.importFile(new ImportOptions(editFileBis351));
        editFootage351.parentFolder = fromEditFolder;
        editFootage351.name = "UNDLM_00351bis";
        editSources[351] = editFootage351;
        editImportCount++;
        importSuccess351 = true;
        fileName351 = "UNDLM_00351bis.mov";
        logImportSuccess(351, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00351bis.mov", fileName351);
    } catch (e) {
        logImportError(351, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00351bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess351) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00351.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00352
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile352 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00352.mov");
var editFilePoignees352 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00352_AVEC_POIGNEES.mov");
var editFileBis352 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00352bis.mov");

var importSuccess352 = false;
var fileName352 = "";

// Tenter import standard
if (editFile352.exists) {
    try {
        var editFootage352 = project.importFile(new ImportOptions(editFile352));
        editFootage352.parentFolder = fromEditFolder;
        editFootage352.name = "UNDLM_00352";
        editSources[352] = editFootage352;
        editImportCount++;
        importSuccess352 = true;
        fileName352 = "UNDLM_00352.mov";
        logImportSuccess(352, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00352.mov", fileName352);
    } catch (e) {
        logImportError(352, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00352.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess352 && editFilePoignees352.exists) {
    try {
        var editFootage352 = project.importFile(new ImportOptions(editFilePoignees352));
        editFootage352.parentFolder = fromEditFolder;
        editFootage352.name = "UNDLM_00352_AVEC_POIGNEES";
        editSources[352] = editFootage352;
        editImportCount++;
        importSuccess352 = true;
        fileName352 = "UNDLM_00352_AVEC_POIGNEES.mov";
        logImportSuccess(352, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00352_AVEC_POIGNEES.mov", fileName352);
    } catch (e) {
        logImportError(352, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00352_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess352 && editFileBis352.exists) {
    try {
        var editFootage352 = project.importFile(new ImportOptions(editFileBis352));
        editFootage352.parentFolder = fromEditFolder;
        editFootage352.name = "UNDLM_00352bis";
        editSources[352] = editFootage352;
        editImportCount++;
        importSuccess352 = true;
        fileName352 = "UNDLM_00352bis.mov";
        logImportSuccess(352, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00352bis.mov", fileName352);
    } catch (e) {
        logImportError(352, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00352bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess352) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00352.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00353
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile353 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00353.mov");
var editFilePoignees353 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00353_AVEC_POIGNEES.mov");
var editFileBis353 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00353bis.mov");

var importSuccess353 = false;
var fileName353 = "";

// Tenter import standard
if (editFile353.exists) {
    try {
        var editFootage353 = project.importFile(new ImportOptions(editFile353));
        editFootage353.parentFolder = fromEditFolder;
        editFootage353.name = "UNDLM_00353";
        editSources[353] = editFootage353;
        editImportCount++;
        importSuccess353 = true;
        fileName353 = "UNDLM_00353.mov";
        logImportSuccess(353, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00353.mov", fileName353);
    } catch (e) {
        logImportError(353, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00353.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess353 && editFilePoignees353.exists) {
    try {
        var editFootage353 = project.importFile(new ImportOptions(editFilePoignees353));
        editFootage353.parentFolder = fromEditFolder;
        editFootage353.name = "UNDLM_00353_AVEC_POIGNEES";
        editSources[353] = editFootage353;
        editImportCount++;
        importSuccess353 = true;
        fileName353 = "UNDLM_00353_AVEC_POIGNEES.mov";
        logImportSuccess(353, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00353_AVEC_POIGNEES.mov", fileName353);
    } catch (e) {
        logImportError(353, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00353_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess353 && editFileBis353.exists) {
    try {
        var editFootage353 = project.importFile(new ImportOptions(editFileBis353));
        editFootage353.parentFolder = fromEditFolder;
        editFootage353.name = "UNDLM_00353bis";
        editSources[353] = editFootage353;
        editImportCount++;
        importSuccess353 = true;
        fileName353 = "UNDLM_00353bis.mov";
        logImportSuccess(353, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00353bis.mov", fileName353);
    } catch (e) {
        logImportError(353, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00353bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess353) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00353.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00354
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile354 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00354.mov");
var editFilePoignees354 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00354_AVEC_POIGNEES.mov");
var editFileBis354 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00354bis.mov");

var importSuccess354 = false;
var fileName354 = "";

// Tenter import standard
if (editFile354.exists) {
    try {
        var editFootage354 = project.importFile(new ImportOptions(editFile354));
        editFootage354.parentFolder = fromEditFolder;
        editFootage354.name = "UNDLM_00354";
        editSources[354] = editFootage354;
        editImportCount++;
        importSuccess354 = true;
        fileName354 = "UNDLM_00354.mov";
        logImportSuccess(354, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00354.mov", fileName354);
    } catch (e) {
        logImportError(354, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00354.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess354 && editFilePoignees354.exists) {
    try {
        var editFootage354 = project.importFile(new ImportOptions(editFilePoignees354));
        editFootage354.parentFolder = fromEditFolder;
        editFootage354.name = "UNDLM_00354_AVEC_POIGNEES";
        editSources[354] = editFootage354;
        editImportCount++;
        importSuccess354 = true;
        fileName354 = "UNDLM_00354_AVEC_POIGNEES.mov";
        logImportSuccess(354, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00354_AVEC_POIGNEES.mov", fileName354);
    } catch (e) {
        logImportError(354, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00354_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess354 && editFileBis354.exists) {
    try {
        var editFootage354 = project.importFile(new ImportOptions(editFileBis354));
        editFootage354.parentFolder = fromEditFolder;
        editFootage354.name = "UNDLM_00354bis";
        editSources[354] = editFootage354;
        editImportCount++;
        importSuccess354 = true;
        fileName354 = "UNDLM_00354bis.mov";
        logImportSuccess(354, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00354bis.mov", fileName354);
    } catch (e) {
        logImportError(354, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00354bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess354) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00354.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00355
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile355 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00355.mov");
var editFilePoignees355 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00355_AVEC_POIGNEES.mov");
var editFileBis355 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00355bis.mov");

var importSuccess355 = false;
var fileName355 = "";

// Tenter import standard
if (editFile355.exists) {
    try {
        var editFootage355 = project.importFile(new ImportOptions(editFile355));
        editFootage355.parentFolder = fromEditFolder;
        editFootage355.name = "UNDLM_00355";
        editSources[355] = editFootage355;
        editImportCount++;
        importSuccess355 = true;
        fileName355 = "UNDLM_00355.mov";
        logImportSuccess(355, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00355.mov", fileName355);
    } catch (e) {
        logImportError(355, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00355.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess355 && editFilePoignees355.exists) {
    try {
        var editFootage355 = project.importFile(new ImportOptions(editFilePoignees355));
        editFootage355.parentFolder = fromEditFolder;
        editFootage355.name = "UNDLM_00355_AVEC_POIGNEES";
        editSources[355] = editFootage355;
        editImportCount++;
        importSuccess355 = true;
        fileName355 = "UNDLM_00355_AVEC_POIGNEES.mov";
        logImportSuccess(355, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00355_AVEC_POIGNEES.mov", fileName355);
    } catch (e) {
        logImportError(355, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00355_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess355 && editFileBis355.exists) {
    try {
        var editFootage355 = project.importFile(new ImportOptions(editFileBis355));
        editFootage355.parentFolder = fromEditFolder;
        editFootage355.name = "UNDLM_00355bis";
        editSources[355] = editFootage355;
        editImportCount++;
        importSuccess355 = true;
        fileName355 = "UNDLM_00355bis.mov";
        logImportSuccess(355, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00355bis.mov", fileName355);
    } catch (e) {
        logImportError(355, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00355bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess355) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00355.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00356
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile356 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00356.mov");
var editFilePoignees356 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00356_AVEC_POIGNEES.mov");
var editFileBis356 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00356bis.mov");

var importSuccess356 = false;
var fileName356 = "";

// Tenter import standard
if (editFile356.exists) {
    try {
        var editFootage356 = project.importFile(new ImportOptions(editFile356));
        editFootage356.parentFolder = fromEditFolder;
        editFootage356.name = "UNDLM_00356";
        editSources[356] = editFootage356;
        editImportCount++;
        importSuccess356 = true;
        fileName356 = "UNDLM_00356.mov";
        logImportSuccess(356, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00356.mov", fileName356);
    } catch (e) {
        logImportError(356, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00356.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess356 && editFilePoignees356.exists) {
    try {
        var editFootage356 = project.importFile(new ImportOptions(editFilePoignees356));
        editFootage356.parentFolder = fromEditFolder;
        editFootage356.name = "UNDLM_00356_AVEC_POIGNEES";
        editSources[356] = editFootage356;
        editImportCount++;
        importSuccess356 = true;
        fileName356 = "UNDLM_00356_AVEC_POIGNEES.mov";
        logImportSuccess(356, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00356_AVEC_POIGNEES.mov", fileName356);
    } catch (e) {
        logImportError(356, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00356_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess356 && editFileBis356.exists) {
    try {
        var editFootage356 = project.importFile(new ImportOptions(editFileBis356));
        editFootage356.parentFolder = fromEditFolder;
        editFootage356.name = "UNDLM_00356bis";
        editSources[356] = editFootage356;
        editImportCount++;
        importSuccess356 = true;
        fileName356 = "UNDLM_00356bis.mov";
        logImportSuccess(356, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00356bis.mov", fileName356);
    } catch (e) {
        logImportError(356, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00356bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess356) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00356.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00357
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile357 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00357.mov");
var editFilePoignees357 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00357_AVEC_POIGNEES.mov");
var editFileBis357 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00357bis.mov");

var importSuccess357 = false;
var fileName357 = "";

// Tenter import standard
if (editFile357.exists) {
    try {
        var editFootage357 = project.importFile(new ImportOptions(editFile357));
        editFootage357.parentFolder = fromEditFolder;
        editFootage357.name = "UNDLM_00357";
        editSources[357] = editFootage357;
        editImportCount++;
        importSuccess357 = true;
        fileName357 = "UNDLM_00357.mov";
        logImportSuccess(357, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00357.mov", fileName357);
    } catch (e) {
        logImportError(357, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00357.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess357 && editFilePoignees357.exists) {
    try {
        var editFootage357 = project.importFile(new ImportOptions(editFilePoignees357));
        editFootage357.parentFolder = fromEditFolder;
        editFootage357.name = "UNDLM_00357_AVEC_POIGNEES";
        editSources[357] = editFootage357;
        editImportCount++;
        importSuccess357 = true;
        fileName357 = "UNDLM_00357_AVEC_POIGNEES.mov";
        logImportSuccess(357, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00357_AVEC_POIGNEES.mov", fileName357);
    } catch (e) {
        logImportError(357, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00357_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess357 && editFileBis357.exists) {
    try {
        var editFootage357 = project.importFile(new ImportOptions(editFileBis357));
        editFootage357.parentFolder = fromEditFolder;
        editFootage357.name = "UNDLM_00357bis";
        editSources[357] = editFootage357;
        editImportCount++;
        importSuccess357 = true;
        fileName357 = "UNDLM_00357bis.mov";
        logImportSuccess(357, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00357bis.mov", fileName357);
    } catch (e) {
        logImportError(357, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00357bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess357) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00357.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00358
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile358 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00358.mov");
var editFilePoignees358 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00358_AVEC_POIGNEES.mov");
var editFileBis358 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00358bis.mov");

var importSuccess358 = false;
var fileName358 = "";

// Tenter import standard
if (editFile358.exists) {
    try {
        var editFootage358 = project.importFile(new ImportOptions(editFile358));
        editFootage358.parentFolder = fromEditFolder;
        editFootage358.name = "UNDLM_00358";
        editSources[358] = editFootage358;
        editImportCount++;
        importSuccess358 = true;
        fileName358 = "UNDLM_00358.mov";
        logImportSuccess(358, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00358.mov", fileName358);
    } catch (e) {
        logImportError(358, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00358.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess358 && editFilePoignees358.exists) {
    try {
        var editFootage358 = project.importFile(new ImportOptions(editFilePoignees358));
        editFootage358.parentFolder = fromEditFolder;
        editFootage358.name = "UNDLM_00358_AVEC_POIGNEES";
        editSources[358] = editFootage358;
        editImportCount++;
        importSuccess358 = true;
        fileName358 = "UNDLM_00358_AVEC_POIGNEES.mov";
        logImportSuccess(358, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00358_AVEC_POIGNEES.mov", fileName358);
    } catch (e) {
        logImportError(358, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00358_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess358 && editFileBis358.exists) {
    try {
        var editFootage358 = project.importFile(new ImportOptions(editFileBis358));
        editFootage358.parentFolder = fromEditFolder;
        editFootage358.name = "UNDLM_00358bis";
        editSources[358] = editFootage358;
        editImportCount++;
        importSuccess358 = true;
        fileName358 = "UNDLM_00358bis.mov";
        logImportSuccess(358, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00358bis.mov", fileName358);
    } catch (e) {
        logImportError(358, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00358bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess358) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00358.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00359
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile359 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00359.mov");
var editFilePoignees359 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00359_AVEC_POIGNEES.mov");
var editFileBis359 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00359bis.mov");

var importSuccess359 = false;
var fileName359 = "";

// Tenter import standard
if (editFile359.exists) {
    try {
        var editFootage359 = project.importFile(new ImportOptions(editFile359));
        editFootage359.parentFolder = fromEditFolder;
        editFootage359.name = "UNDLM_00359";
        editSources[359] = editFootage359;
        editImportCount++;
        importSuccess359 = true;
        fileName359 = "UNDLM_00359.mov";
        logImportSuccess(359, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00359.mov", fileName359);
    } catch (e) {
        logImportError(359, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00359.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess359 && editFilePoignees359.exists) {
    try {
        var editFootage359 = project.importFile(new ImportOptions(editFilePoignees359));
        editFootage359.parentFolder = fromEditFolder;
        editFootage359.name = "UNDLM_00359_AVEC_POIGNEES";
        editSources[359] = editFootage359;
        editImportCount++;
        importSuccess359 = true;
        fileName359 = "UNDLM_00359_AVEC_POIGNEES.mov";
        logImportSuccess(359, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00359_AVEC_POIGNEES.mov", fileName359);
    } catch (e) {
        logImportError(359, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00359_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess359 && editFileBis359.exists) {
    try {
        var editFootage359 = project.importFile(new ImportOptions(editFileBis359));
        editFootage359.parentFolder = fromEditFolder;
        editFootage359.name = "UNDLM_00359bis";
        editSources[359] = editFootage359;
        editImportCount++;
        importSuccess359 = true;
        fileName359 = "UNDLM_00359bis.mov";
        logImportSuccess(359, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00359bis.mov", fileName359);
    } catch (e) {
        logImportError(359, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00359bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess359) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00359.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00360
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile360 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00360.mov");
var editFilePoignees360 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00360_AVEC_POIGNEES.mov");
var editFileBis360 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00360bis.mov");

var importSuccess360 = false;
var fileName360 = "";

// Tenter import standard
if (editFile360.exists) {
    try {
        var editFootage360 = project.importFile(new ImportOptions(editFile360));
        editFootage360.parentFolder = fromEditFolder;
        editFootage360.name = "UNDLM_00360";
        editSources[360] = editFootage360;
        editImportCount++;
        importSuccess360 = true;
        fileName360 = "UNDLM_00360.mov";
        logImportSuccess(360, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00360.mov", fileName360);
    } catch (e) {
        logImportError(360, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00360.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess360 && editFilePoignees360.exists) {
    try {
        var editFootage360 = project.importFile(new ImportOptions(editFilePoignees360));
        editFootage360.parentFolder = fromEditFolder;
        editFootage360.name = "UNDLM_00360_AVEC_POIGNEES";
        editSources[360] = editFootage360;
        editImportCount++;
        importSuccess360 = true;
        fileName360 = "UNDLM_00360_AVEC_POIGNEES.mov";
        logImportSuccess(360, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00360_AVEC_POIGNEES.mov", fileName360);
    } catch (e) {
        logImportError(360, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00360_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess360 && editFileBis360.exists) {
    try {
        var editFootage360 = project.importFile(new ImportOptions(editFileBis360));
        editFootage360.parentFolder = fromEditFolder;
        editFootage360.name = "UNDLM_00360bis";
        editSources[360] = editFootage360;
        editImportCount++;
        importSuccess360 = true;
        fileName360 = "UNDLM_00360bis.mov";
        logImportSuccess(360, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00360bis.mov", fileName360);
    } catch (e) {
        logImportError(360, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00360bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess360) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00360.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00361
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile361 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00361.mov");
var editFilePoignees361 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00361_AVEC_POIGNEES.mov");
var editFileBis361 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00361bis.mov");

var importSuccess361 = false;
var fileName361 = "";

// Tenter import standard
if (editFile361.exists) {
    try {
        var editFootage361 = project.importFile(new ImportOptions(editFile361));
        editFootage361.parentFolder = fromEditFolder;
        editFootage361.name = "UNDLM_00361";
        editSources[361] = editFootage361;
        editImportCount++;
        importSuccess361 = true;
        fileName361 = "UNDLM_00361.mov";
        logImportSuccess(361, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00361.mov", fileName361);
    } catch (e) {
        logImportError(361, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00361.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess361 && editFilePoignees361.exists) {
    try {
        var editFootage361 = project.importFile(new ImportOptions(editFilePoignees361));
        editFootage361.parentFolder = fromEditFolder;
        editFootage361.name = "UNDLM_00361_AVEC_POIGNEES";
        editSources[361] = editFootage361;
        editImportCount++;
        importSuccess361 = true;
        fileName361 = "UNDLM_00361_AVEC_POIGNEES.mov";
        logImportSuccess(361, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00361_AVEC_POIGNEES.mov", fileName361);
    } catch (e) {
        logImportError(361, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00361_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess361 && editFileBis361.exists) {
    try {
        var editFootage361 = project.importFile(new ImportOptions(editFileBis361));
        editFootage361.parentFolder = fromEditFolder;
        editFootage361.name = "UNDLM_00361bis";
        editSources[361] = editFootage361;
        editImportCount++;
        importSuccess361 = true;
        fileName361 = "UNDLM_00361bis.mov";
        logImportSuccess(361, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00361bis.mov", fileName361);
    } catch (e) {
        logImportError(361, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00361bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess361) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00361.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00362
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile362 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00362.mov");
var editFilePoignees362 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00362_AVEC_POIGNEES.mov");
var editFileBis362 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00362bis.mov");

var importSuccess362 = false;
var fileName362 = "";

// Tenter import standard
if (editFile362.exists) {
    try {
        var editFootage362 = project.importFile(new ImportOptions(editFile362));
        editFootage362.parentFolder = fromEditFolder;
        editFootage362.name = "UNDLM_00362";
        editSources[362] = editFootage362;
        editImportCount++;
        importSuccess362 = true;
        fileName362 = "UNDLM_00362.mov";
        logImportSuccess(362, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00362.mov", fileName362);
    } catch (e) {
        logImportError(362, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00362.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess362 && editFilePoignees362.exists) {
    try {
        var editFootage362 = project.importFile(new ImportOptions(editFilePoignees362));
        editFootage362.parentFolder = fromEditFolder;
        editFootage362.name = "UNDLM_00362_AVEC_POIGNEES";
        editSources[362] = editFootage362;
        editImportCount++;
        importSuccess362 = true;
        fileName362 = "UNDLM_00362_AVEC_POIGNEES.mov";
        logImportSuccess(362, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00362_AVEC_POIGNEES.mov", fileName362);
    } catch (e) {
        logImportError(362, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00362_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess362 && editFileBis362.exists) {
    try {
        var editFootage362 = project.importFile(new ImportOptions(editFileBis362));
        editFootage362.parentFolder = fromEditFolder;
        editFootage362.name = "UNDLM_00362bis";
        editSources[362] = editFootage362;
        editImportCount++;
        importSuccess362 = true;
        fileName362 = "UNDLM_00362bis.mov";
        logImportSuccess(362, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00362bis.mov", fileName362);
    } catch (e) {
        logImportError(362, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00362bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess362) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00362.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00363
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile363 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00363.mov");
var editFilePoignees363 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00363_AVEC_POIGNEES.mov");
var editFileBis363 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00363bis.mov");

var importSuccess363 = false;
var fileName363 = "";

// Tenter import standard
if (editFile363.exists) {
    try {
        var editFootage363 = project.importFile(new ImportOptions(editFile363));
        editFootage363.parentFolder = fromEditFolder;
        editFootage363.name = "UNDLM_00363";
        editSources[363] = editFootage363;
        editImportCount++;
        importSuccess363 = true;
        fileName363 = "UNDLM_00363.mov";
        logImportSuccess(363, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00363.mov", fileName363);
    } catch (e) {
        logImportError(363, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00363.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess363 && editFilePoignees363.exists) {
    try {
        var editFootage363 = project.importFile(new ImportOptions(editFilePoignees363));
        editFootage363.parentFolder = fromEditFolder;
        editFootage363.name = "UNDLM_00363_AVEC_POIGNEES";
        editSources[363] = editFootage363;
        editImportCount++;
        importSuccess363 = true;
        fileName363 = "UNDLM_00363_AVEC_POIGNEES.mov";
        logImportSuccess(363, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00363_AVEC_POIGNEES.mov", fileName363);
    } catch (e) {
        logImportError(363, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00363_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess363 && editFileBis363.exists) {
    try {
        var editFootage363 = project.importFile(new ImportOptions(editFileBis363));
        editFootage363.parentFolder = fromEditFolder;
        editFootage363.name = "UNDLM_00363bis";
        editSources[363] = editFootage363;
        editImportCount++;
        importSuccess363 = true;
        fileName363 = "UNDLM_00363bis.mov";
        logImportSuccess(363, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00363bis.mov", fileName363);
    } catch (e) {
        logImportError(363, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00363bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess363) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00363.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00364
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile364 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00364.mov");
var editFilePoignees364 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00364_AVEC_POIGNEES.mov");
var editFileBis364 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00364bis.mov");

var importSuccess364 = false;
var fileName364 = "";

// Tenter import standard
if (editFile364.exists) {
    try {
        var editFootage364 = project.importFile(new ImportOptions(editFile364));
        editFootage364.parentFolder = fromEditFolder;
        editFootage364.name = "UNDLM_00364";
        editSources[364] = editFootage364;
        editImportCount++;
        importSuccess364 = true;
        fileName364 = "UNDLM_00364.mov";
        logImportSuccess(364, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00364.mov", fileName364);
    } catch (e) {
        logImportError(364, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00364.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess364 && editFilePoignees364.exists) {
    try {
        var editFootage364 = project.importFile(new ImportOptions(editFilePoignees364));
        editFootage364.parentFolder = fromEditFolder;
        editFootage364.name = "UNDLM_00364_AVEC_POIGNEES";
        editSources[364] = editFootage364;
        editImportCount++;
        importSuccess364 = true;
        fileName364 = "UNDLM_00364_AVEC_POIGNEES.mov";
        logImportSuccess(364, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00364_AVEC_POIGNEES.mov", fileName364);
    } catch (e) {
        logImportError(364, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00364_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess364 && editFileBis364.exists) {
    try {
        var editFootage364 = project.importFile(new ImportOptions(editFileBis364));
        editFootage364.parentFolder = fromEditFolder;
        editFootage364.name = "UNDLM_00364bis";
        editSources[364] = editFootage364;
        editImportCount++;
        importSuccess364 = true;
        fileName364 = "UNDLM_00364bis.mov";
        logImportSuccess(364, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00364bis.mov", fileName364);
    } catch (e) {
        logImportError(364, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00364bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess364) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00364.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00365
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile365 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00365.mov");
var editFilePoignees365 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00365_AVEC_POIGNEES.mov");
var editFileBis365 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00365bis.mov");

var importSuccess365 = false;
var fileName365 = "";

// Tenter import standard
if (editFile365.exists) {
    try {
        var editFootage365 = project.importFile(new ImportOptions(editFile365));
        editFootage365.parentFolder = fromEditFolder;
        editFootage365.name = "UNDLM_00365";
        editSources[365] = editFootage365;
        editImportCount++;
        importSuccess365 = true;
        fileName365 = "UNDLM_00365.mov";
        logImportSuccess(365, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00365.mov", fileName365);
    } catch (e) {
        logImportError(365, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00365.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess365 && editFilePoignees365.exists) {
    try {
        var editFootage365 = project.importFile(new ImportOptions(editFilePoignees365));
        editFootage365.parentFolder = fromEditFolder;
        editFootage365.name = "UNDLM_00365_AVEC_POIGNEES";
        editSources[365] = editFootage365;
        editImportCount++;
        importSuccess365 = true;
        fileName365 = "UNDLM_00365_AVEC_POIGNEES.mov";
        logImportSuccess(365, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00365_AVEC_POIGNEES.mov", fileName365);
    } catch (e) {
        logImportError(365, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00365_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess365 && editFileBis365.exists) {
    try {
        var editFootage365 = project.importFile(new ImportOptions(editFileBis365));
        editFootage365.parentFolder = fromEditFolder;
        editFootage365.name = "UNDLM_00365bis";
        editSources[365] = editFootage365;
        editImportCount++;
        importSuccess365 = true;
        fileName365 = "UNDLM_00365bis.mov";
        logImportSuccess(365, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00365bis.mov", fileName365);
    } catch (e) {
        logImportError(365, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00365bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess365) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00365.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00366
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile366 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00366.mov");
var editFilePoignees366 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00366_AVEC_POIGNEES.mov");
var editFileBis366 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00366bis.mov");

var importSuccess366 = false;
var fileName366 = "";

// Tenter import standard
if (editFile366.exists) {
    try {
        var editFootage366 = project.importFile(new ImportOptions(editFile366));
        editFootage366.parentFolder = fromEditFolder;
        editFootage366.name = "UNDLM_00366";
        editSources[366] = editFootage366;
        editImportCount++;
        importSuccess366 = true;
        fileName366 = "UNDLM_00366.mov";
        logImportSuccess(366, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00366.mov", fileName366);
    } catch (e) {
        logImportError(366, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00366.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess366 && editFilePoignees366.exists) {
    try {
        var editFootage366 = project.importFile(new ImportOptions(editFilePoignees366));
        editFootage366.parentFolder = fromEditFolder;
        editFootage366.name = "UNDLM_00366_AVEC_POIGNEES";
        editSources[366] = editFootage366;
        editImportCount++;
        importSuccess366 = true;
        fileName366 = "UNDLM_00366_AVEC_POIGNEES.mov";
        logImportSuccess(366, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00366_AVEC_POIGNEES.mov", fileName366);
    } catch (e) {
        logImportError(366, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00366_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess366 && editFileBis366.exists) {
    try {
        var editFootage366 = project.importFile(new ImportOptions(editFileBis366));
        editFootage366.parentFolder = fromEditFolder;
        editFootage366.name = "UNDLM_00366bis";
        editSources[366] = editFootage366;
        editImportCount++;
        importSuccess366 = true;
        fileName366 = "UNDLM_00366bis.mov";
        logImportSuccess(366, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00366bis.mov", fileName366);
    } catch (e) {
        logImportError(366, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00366bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess366) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00366.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00367
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile367 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00367.mov");
var editFilePoignees367 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00367_AVEC_POIGNEES.mov");
var editFileBis367 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00367bis.mov");

var importSuccess367 = false;
var fileName367 = "";

// Tenter import standard
if (editFile367.exists) {
    try {
        var editFootage367 = project.importFile(new ImportOptions(editFile367));
        editFootage367.parentFolder = fromEditFolder;
        editFootage367.name = "UNDLM_00367";
        editSources[367] = editFootage367;
        editImportCount++;
        importSuccess367 = true;
        fileName367 = "UNDLM_00367.mov";
        logImportSuccess(367, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00367.mov", fileName367);
    } catch (e) {
        logImportError(367, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00367.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess367 && editFilePoignees367.exists) {
    try {
        var editFootage367 = project.importFile(new ImportOptions(editFilePoignees367));
        editFootage367.parentFolder = fromEditFolder;
        editFootage367.name = "UNDLM_00367_AVEC_POIGNEES";
        editSources[367] = editFootage367;
        editImportCount++;
        importSuccess367 = true;
        fileName367 = "UNDLM_00367_AVEC_POIGNEES.mov";
        logImportSuccess(367, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00367_AVEC_POIGNEES.mov", fileName367);
    } catch (e) {
        logImportError(367, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00367_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess367 && editFileBis367.exists) {
    try {
        var editFootage367 = project.importFile(new ImportOptions(editFileBis367));
        editFootage367.parentFolder = fromEditFolder;
        editFootage367.name = "UNDLM_00367bis";
        editSources[367] = editFootage367;
        editImportCount++;
        importSuccess367 = true;
        fileName367 = "UNDLM_00367bis.mov";
        logImportSuccess(367, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00367bis.mov", fileName367);
    } catch (e) {
        logImportError(367, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00367bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess367) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00367.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00368
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile368 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00368.mov");
var editFilePoignees368 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00368_AVEC_POIGNEES.mov");
var editFileBis368 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00368bis.mov");

var importSuccess368 = false;
var fileName368 = "";

// Tenter import standard
if (editFile368.exists) {
    try {
        var editFootage368 = project.importFile(new ImportOptions(editFile368));
        editFootage368.parentFolder = fromEditFolder;
        editFootage368.name = "UNDLM_00368";
        editSources[368] = editFootage368;
        editImportCount++;
        importSuccess368 = true;
        fileName368 = "UNDLM_00368.mov";
        logImportSuccess(368, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00368.mov", fileName368);
    } catch (e) {
        logImportError(368, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00368.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess368 && editFilePoignees368.exists) {
    try {
        var editFootage368 = project.importFile(new ImportOptions(editFilePoignees368));
        editFootage368.parentFolder = fromEditFolder;
        editFootage368.name = "UNDLM_00368_AVEC_POIGNEES";
        editSources[368] = editFootage368;
        editImportCount++;
        importSuccess368 = true;
        fileName368 = "UNDLM_00368_AVEC_POIGNEES.mov";
        logImportSuccess(368, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00368_AVEC_POIGNEES.mov", fileName368);
    } catch (e) {
        logImportError(368, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00368_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess368 && editFileBis368.exists) {
    try {
        var editFootage368 = project.importFile(new ImportOptions(editFileBis368));
        editFootage368.parentFolder = fromEditFolder;
        editFootage368.name = "UNDLM_00368bis";
        editSources[368] = editFootage368;
        editImportCount++;
        importSuccess368 = true;
        fileName368 = "UNDLM_00368bis.mov";
        logImportSuccess(368, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00368bis.mov", fileName368);
    } catch (e) {
        logImportError(368, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00368bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess368) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00368.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00369
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile369 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00369.mov");
var editFilePoignees369 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00369_AVEC_POIGNEES.mov");
var editFileBis369 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00369bis.mov");

var importSuccess369 = false;
var fileName369 = "";

// Tenter import standard
if (editFile369.exists) {
    try {
        var editFootage369 = project.importFile(new ImportOptions(editFile369));
        editFootage369.parentFolder = fromEditFolder;
        editFootage369.name = "UNDLM_00369";
        editSources[369] = editFootage369;
        editImportCount++;
        importSuccess369 = true;
        fileName369 = "UNDLM_00369.mov";
        logImportSuccess(369, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00369.mov", fileName369);
    } catch (e) {
        logImportError(369, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00369.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess369 && editFilePoignees369.exists) {
    try {
        var editFootage369 = project.importFile(new ImportOptions(editFilePoignees369));
        editFootage369.parentFolder = fromEditFolder;
        editFootage369.name = "UNDLM_00369_AVEC_POIGNEES";
        editSources[369] = editFootage369;
        editImportCount++;
        importSuccess369 = true;
        fileName369 = "UNDLM_00369_AVEC_POIGNEES.mov";
        logImportSuccess(369, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00369_AVEC_POIGNEES.mov", fileName369);
    } catch (e) {
        logImportError(369, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00369_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess369 && editFileBis369.exists) {
    try {
        var editFootage369 = project.importFile(new ImportOptions(editFileBis369));
        editFootage369.parentFolder = fromEditFolder;
        editFootage369.name = "UNDLM_00369bis";
        editSources[369] = editFootage369;
        editImportCount++;
        importSuccess369 = true;
        fileName369 = "UNDLM_00369bis.mov";
        logImportSuccess(369, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00369bis.mov", fileName369);
    } catch (e) {
        logImportError(369, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00369bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess369) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00369.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00370
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile370 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00370.mov");
var editFilePoignees370 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00370_AVEC_POIGNEES.mov");
var editFileBis370 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00370bis.mov");

var importSuccess370 = false;
var fileName370 = "";

// Tenter import standard
if (editFile370.exists) {
    try {
        var editFootage370 = project.importFile(new ImportOptions(editFile370));
        editFootage370.parentFolder = fromEditFolder;
        editFootage370.name = "UNDLM_00370";
        editSources[370] = editFootage370;
        editImportCount++;
        importSuccess370 = true;
        fileName370 = "UNDLM_00370.mov";
        logImportSuccess(370, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00370.mov", fileName370);
    } catch (e) {
        logImportError(370, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00370.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess370 && editFilePoignees370.exists) {
    try {
        var editFootage370 = project.importFile(new ImportOptions(editFilePoignees370));
        editFootage370.parentFolder = fromEditFolder;
        editFootage370.name = "UNDLM_00370_AVEC_POIGNEES";
        editSources[370] = editFootage370;
        editImportCount++;
        importSuccess370 = true;
        fileName370 = "UNDLM_00370_AVEC_POIGNEES.mov";
        logImportSuccess(370, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00370_AVEC_POIGNEES.mov", fileName370);
    } catch (e) {
        logImportError(370, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00370_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess370 && editFileBis370.exists) {
    try {
        var editFootage370 = project.importFile(new ImportOptions(editFileBis370));
        editFootage370.parentFolder = fromEditFolder;
        editFootage370.name = "UNDLM_00370bis";
        editSources[370] = editFootage370;
        editImportCount++;
        importSuccess370 = true;
        fileName370 = "UNDLM_00370bis.mov";
        logImportSuccess(370, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00370bis.mov", fileName370);
    } catch (e) {
        logImportError(370, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00370bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess370) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00370.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00371
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile371 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00371.mov");
var editFilePoignees371 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00371_AVEC_POIGNEES.mov");
var editFileBis371 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00371bis.mov");

var importSuccess371 = false;
var fileName371 = "";

// Tenter import standard
if (editFile371.exists) {
    try {
        var editFootage371 = project.importFile(new ImportOptions(editFile371));
        editFootage371.parentFolder = fromEditFolder;
        editFootage371.name = "UNDLM_00371";
        editSources[371] = editFootage371;
        editImportCount++;
        importSuccess371 = true;
        fileName371 = "UNDLM_00371.mov";
        logImportSuccess(371, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00371.mov", fileName371);
    } catch (e) {
        logImportError(371, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00371.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess371 && editFilePoignees371.exists) {
    try {
        var editFootage371 = project.importFile(new ImportOptions(editFilePoignees371));
        editFootage371.parentFolder = fromEditFolder;
        editFootage371.name = "UNDLM_00371_AVEC_POIGNEES";
        editSources[371] = editFootage371;
        editImportCount++;
        importSuccess371 = true;
        fileName371 = "UNDLM_00371_AVEC_POIGNEES.mov";
        logImportSuccess(371, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00371_AVEC_POIGNEES.mov", fileName371);
    } catch (e) {
        logImportError(371, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00371_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess371 && editFileBis371.exists) {
    try {
        var editFootage371 = project.importFile(new ImportOptions(editFileBis371));
        editFootage371.parentFolder = fromEditFolder;
        editFootage371.name = "UNDLM_00371bis";
        editSources[371] = editFootage371;
        editImportCount++;
        importSuccess371 = true;
        fileName371 = "UNDLM_00371bis.mov";
        logImportSuccess(371, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00371bis.mov", fileName371);
    } catch (e) {
        logImportError(371, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00371bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess371) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00371.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00372
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile372 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00372.mov");
var editFilePoignees372 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00372_AVEC_POIGNEES.mov");
var editFileBis372 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00372bis.mov");

var importSuccess372 = false;
var fileName372 = "";

// Tenter import standard
if (editFile372.exists) {
    try {
        var editFootage372 = project.importFile(new ImportOptions(editFile372));
        editFootage372.parentFolder = fromEditFolder;
        editFootage372.name = "UNDLM_00372";
        editSources[372] = editFootage372;
        editImportCount++;
        importSuccess372 = true;
        fileName372 = "UNDLM_00372.mov";
        logImportSuccess(372, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00372.mov", fileName372);
    } catch (e) {
        logImportError(372, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00372.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess372 && editFilePoignees372.exists) {
    try {
        var editFootage372 = project.importFile(new ImportOptions(editFilePoignees372));
        editFootage372.parentFolder = fromEditFolder;
        editFootage372.name = "UNDLM_00372_AVEC_POIGNEES";
        editSources[372] = editFootage372;
        editImportCount++;
        importSuccess372 = true;
        fileName372 = "UNDLM_00372_AVEC_POIGNEES.mov";
        logImportSuccess(372, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00372_AVEC_POIGNEES.mov", fileName372);
    } catch (e) {
        logImportError(372, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00372_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess372 && editFileBis372.exists) {
    try {
        var editFootage372 = project.importFile(new ImportOptions(editFileBis372));
        editFootage372.parentFolder = fromEditFolder;
        editFootage372.name = "UNDLM_00372bis";
        editSources[372] = editFootage372;
        editImportCount++;
        importSuccess372 = true;
        fileName372 = "UNDLM_00372bis.mov";
        logImportSuccess(372, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00372bis.mov", fileName372);
    } catch (e) {
        logImportError(372, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00372bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess372) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00372.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00373
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile373 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00373.mov");
var editFilePoignees373 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00373_AVEC_POIGNEES.mov");
var editFileBis373 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00373bis.mov");

var importSuccess373 = false;
var fileName373 = "";

// Tenter import standard
if (editFile373.exists) {
    try {
        var editFootage373 = project.importFile(new ImportOptions(editFile373));
        editFootage373.parentFolder = fromEditFolder;
        editFootage373.name = "UNDLM_00373";
        editSources[373] = editFootage373;
        editImportCount++;
        importSuccess373 = true;
        fileName373 = "UNDLM_00373.mov";
        logImportSuccess(373, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00373.mov", fileName373);
    } catch (e) {
        logImportError(373, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00373.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess373 && editFilePoignees373.exists) {
    try {
        var editFootage373 = project.importFile(new ImportOptions(editFilePoignees373));
        editFootage373.parentFolder = fromEditFolder;
        editFootage373.name = "UNDLM_00373_AVEC_POIGNEES";
        editSources[373] = editFootage373;
        editImportCount++;
        importSuccess373 = true;
        fileName373 = "UNDLM_00373_AVEC_POIGNEES.mov";
        logImportSuccess(373, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00373_AVEC_POIGNEES.mov", fileName373);
    } catch (e) {
        logImportError(373, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00373_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess373 && editFileBis373.exists) {
    try {
        var editFootage373 = project.importFile(new ImportOptions(editFileBis373));
        editFootage373.parentFolder = fromEditFolder;
        editFootage373.name = "UNDLM_00373bis";
        editSources[373] = editFootage373;
        editImportCount++;
        importSuccess373 = true;
        fileName373 = "UNDLM_00373bis.mov";
        logImportSuccess(373, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00373bis.mov", fileName373);
    } catch (e) {
        logImportError(373, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00373bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess373) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00373.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00374
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile374 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00374.mov");
var editFilePoignees374 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00374_AVEC_POIGNEES.mov");
var editFileBis374 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00374bis.mov");

var importSuccess374 = false;
var fileName374 = "";

// Tenter import standard
if (editFile374.exists) {
    try {
        var editFootage374 = project.importFile(new ImportOptions(editFile374));
        editFootage374.parentFolder = fromEditFolder;
        editFootage374.name = "UNDLM_00374";
        editSources[374] = editFootage374;
        editImportCount++;
        importSuccess374 = true;
        fileName374 = "UNDLM_00374.mov";
        logImportSuccess(374, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00374.mov", fileName374);
    } catch (e) {
        logImportError(374, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00374.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess374 && editFilePoignees374.exists) {
    try {
        var editFootage374 = project.importFile(new ImportOptions(editFilePoignees374));
        editFootage374.parentFolder = fromEditFolder;
        editFootage374.name = "UNDLM_00374_AVEC_POIGNEES";
        editSources[374] = editFootage374;
        editImportCount++;
        importSuccess374 = true;
        fileName374 = "UNDLM_00374_AVEC_POIGNEES.mov";
        logImportSuccess(374, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00374_AVEC_POIGNEES.mov", fileName374);
    } catch (e) {
        logImportError(374, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00374_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess374 && editFileBis374.exists) {
    try {
        var editFootage374 = project.importFile(new ImportOptions(editFileBis374));
        editFootage374.parentFolder = fromEditFolder;
        editFootage374.name = "UNDLM_00374bis";
        editSources[374] = editFootage374;
        editImportCount++;
        importSuccess374 = true;
        fileName374 = "UNDLM_00374bis.mov";
        logImportSuccess(374, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00374bis.mov", fileName374);
    } catch (e) {
        logImportError(374, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00374bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess374) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00374.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00375
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile375 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00375.mov");
var editFilePoignees375 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00375_AVEC_POIGNEES.mov");
var editFileBis375 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00375bis.mov");

var importSuccess375 = false;
var fileName375 = "";

// Tenter import standard
if (editFile375.exists) {
    try {
        var editFootage375 = project.importFile(new ImportOptions(editFile375));
        editFootage375.parentFolder = fromEditFolder;
        editFootage375.name = "UNDLM_00375";
        editSources[375] = editFootage375;
        editImportCount++;
        importSuccess375 = true;
        fileName375 = "UNDLM_00375.mov";
        logImportSuccess(375, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00375.mov", fileName375);
    } catch (e) {
        logImportError(375, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00375.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess375 && editFilePoignees375.exists) {
    try {
        var editFootage375 = project.importFile(new ImportOptions(editFilePoignees375));
        editFootage375.parentFolder = fromEditFolder;
        editFootage375.name = "UNDLM_00375_AVEC_POIGNEES";
        editSources[375] = editFootage375;
        editImportCount++;
        importSuccess375 = true;
        fileName375 = "UNDLM_00375_AVEC_POIGNEES.mov";
        logImportSuccess(375, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00375_AVEC_POIGNEES.mov", fileName375);
    } catch (e) {
        logImportError(375, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00375_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess375 && editFileBis375.exists) {
    try {
        var editFootage375 = project.importFile(new ImportOptions(editFileBis375));
        editFootage375.parentFolder = fromEditFolder;
        editFootage375.name = "UNDLM_00375bis";
        editSources[375] = editFootage375;
        editImportCount++;
        importSuccess375 = true;
        fileName375 = "UNDLM_00375bis.mov";
        logImportSuccess(375, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00375bis.mov", fileName375);
    } catch (e) {
        logImportError(375, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00375bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess375) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00375.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00376
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile376 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00376.mov");
var editFilePoignees376 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00376_AVEC_POIGNEES.mov");
var editFileBis376 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00376bis.mov");

var importSuccess376 = false;
var fileName376 = "";

// Tenter import standard
if (editFile376.exists) {
    try {
        var editFootage376 = project.importFile(new ImportOptions(editFile376));
        editFootage376.parentFolder = fromEditFolder;
        editFootage376.name = "UNDLM_00376";
        editSources[376] = editFootage376;
        editImportCount++;
        importSuccess376 = true;
        fileName376 = "UNDLM_00376.mov";
        logImportSuccess(376, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00376.mov", fileName376);
    } catch (e) {
        logImportError(376, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00376.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess376 && editFilePoignees376.exists) {
    try {
        var editFootage376 = project.importFile(new ImportOptions(editFilePoignees376));
        editFootage376.parentFolder = fromEditFolder;
        editFootage376.name = "UNDLM_00376_AVEC_POIGNEES";
        editSources[376] = editFootage376;
        editImportCount++;
        importSuccess376 = true;
        fileName376 = "UNDLM_00376_AVEC_POIGNEES.mov";
        logImportSuccess(376, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00376_AVEC_POIGNEES.mov", fileName376);
    } catch (e) {
        logImportError(376, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00376_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess376 && editFileBis376.exists) {
    try {
        var editFootage376 = project.importFile(new ImportOptions(editFileBis376));
        editFootage376.parentFolder = fromEditFolder;
        editFootage376.name = "UNDLM_00376bis";
        editSources[376] = editFootage376;
        editImportCount++;
        importSuccess376 = true;
        fileName376 = "UNDLM_00376bis.mov";
        logImportSuccess(376, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00376bis.mov", fileName376);
    } catch (e) {
        logImportError(376, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00376bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess376) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00376.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00377
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile377 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00377.mov");
var editFilePoignees377 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00377_AVEC_POIGNEES.mov");
var editFileBis377 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00377bis.mov");

var importSuccess377 = false;
var fileName377 = "";

// Tenter import standard
if (editFile377.exists) {
    try {
        var editFootage377 = project.importFile(new ImportOptions(editFile377));
        editFootage377.parentFolder = fromEditFolder;
        editFootage377.name = "UNDLM_00377";
        editSources[377] = editFootage377;
        editImportCount++;
        importSuccess377 = true;
        fileName377 = "UNDLM_00377.mov";
        logImportSuccess(377, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00377.mov", fileName377);
    } catch (e) {
        logImportError(377, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00377.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess377 && editFilePoignees377.exists) {
    try {
        var editFootage377 = project.importFile(new ImportOptions(editFilePoignees377));
        editFootage377.parentFolder = fromEditFolder;
        editFootage377.name = "UNDLM_00377_AVEC_POIGNEES";
        editSources[377] = editFootage377;
        editImportCount++;
        importSuccess377 = true;
        fileName377 = "UNDLM_00377_AVEC_POIGNEES.mov";
        logImportSuccess(377, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00377_AVEC_POIGNEES.mov", fileName377);
    } catch (e) {
        logImportError(377, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00377_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess377 && editFileBis377.exists) {
    try {
        var editFootage377 = project.importFile(new ImportOptions(editFileBis377));
        editFootage377.parentFolder = fromEditFolder;
        editFootage377.name = "UNDLM_00377bis";
        editSources[377] = editFootage377;
        editImportCount++;
        importSuccess377 = true;
        fileName377 = "UNDLM_00377bis.mov";
        logImportSuccess(377, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00377bis.mov", fileName377);
    } catch (e) {
        logImportError(377, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00377bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess377) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00377.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00378
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile378 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00378.mov");
var editFilePoignees378 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00378_AVEC_POIGNEES.mov");
var editFileBis378 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00378bis.mov");

var importSuccess378 = false;
var fileName378 = "";

// Tenter import standard
if (editFile378.exists) {
    try {
        var editFootage378 = project.importFile(new ImportOptions(editFile378));
        editFootage378.parentFolder = fromEditFolder;
        editFootage378.name = "UNDLM_00378";
        editSources[378] = editFootage378;
        editImportCount++;
        importSuccess378 = true;
        fileName378 = "UNDLM_00378.mov";
        logImportSuccess(378, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00378.mov", fileName378);
    } catch (e) {
        logImportError(378, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00378.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess378 && editFilePoignees378.exists) {
    try {
        var editFootage378 = project.importFile(new ImportOptions(editFilePoignees378));
        editFootage378.parentFolder = fromEditFolder;
        editFootage378.name = "UNDLM_00378_AVEC_POIGNEES";
        editSources[378] = editFootage378;
        editImportCount++;
        importSuccess378 = true;
        fileName378 = "UNDLM_00378_AVEC_POIGNEES.mov";
        logImportSuccess(378, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00378_AVEC_POIGNEES.mov", fileName378);
    } catch (e) {
        logImportError(378, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00378_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess378 && editFileBis378.exists) {
    try {
        var editFootage378 = project.importFile(new ImportOptions(editFileBis378));
        editFootage378.parentFolder = fromEditFolder;
        editFootage378.name = "UNDLM_00378bis";
        editSources[378] = editFootage378;
        editImportCount++;
        importSuccess378 = true;
        fileName378 = "UNDLM_00378bis.mov";
        logImportSuccess(378, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00378bis.mov", fileName378);
    } catch (e) {
        logImportError(378, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00378bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess378) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00378.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00379
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile379 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00379.mov");
var editFilePoignees379 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00379_AVEC_POIGNEES.mov");
var editFileBis379 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00379bis.mov");

var importSuccess379 = false;
var fileName379 = "";

// Tenter import standard
if (editFile379.exists) {
    try {
        var editFootage379 = project.importFile(new ImportOptions(editFile379));
        editFootage379.parentFolder = fromEditFolder;
        editFootage379.name = "UNDLM_00379";
        editSources[379] = editFootage379;
        editImportCount++;
        importSuccess379 = true;
        fileName379 = "UNDLM_00379.mov";
        logImportSuccess(379, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00379.mov", fileName379);
    } catch (e) {
        logImportError(379, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00379.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess379 && editFilePoignees379.exists) {
    try {
        var editFootage379 = project.importFile(new ImportOptions(editFilePoignees379));
        editFootage379.parentFolder = fromEditFolder;
        editFootage379.name = "UNDLM_00379_AVEC_POIGNEES";
        editSources[379] = editFootage379;
        editImportCount++;
        importSuccess379 = true;
        fileName379 = "UNDLM_00379_AVEC_POIGNEES.mov";
        logImportSuccess(379, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00379_AVEC_POIGNEES.mov", fileName379);
    } catch (e) {
        logImportError(379, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00379_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess379 && editFileBis379.exists) {
    try {
        var editFootage379 = project.importFile(new ImportOptions(editFileBis379));
        editFootage379.parentFolder = fromEditFolder;
        editFootage379.name = "UNDLM_00379bis";
        editSources[379] = editFootage379;
        editImportCount++;
        importSuccess379 = true;
        fileName379 = "UNDLM_00379bis.mov";
        logImportSuccess(379, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00379bis.mov", fileName379);
    } catch (e) {
        logImportError(379, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00379bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess379) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00379.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00347
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile347 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00347.mov");
var gradedFilePoignees347 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00347_AVEC_POIGNEES.mov");
var gradedFileBis347 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00347bis.mov");

var gradedImportSuccess347 = false;
var gradedFileName347 = "";

// Tenter import standard
if (gradedFile347.exists) {
    try {
        var gradedFootage347 = project.importFile(new ImportOptions(gradedFile347));
        gradedFootage347.parentFolder = fromGradingFolder;
        gradedFootage347.name = "UNDLM_00347";
        gradingSources[347] = gradedFootage347;
        gradingImportCount++;
        gradedImportSuccess347 = true;
        gradedFileName347 = "UNDLM_00347.mov";
        logImportSuccess(347, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00347.mov", gradedFileName347);
    } catch (e) {
        logImportError(347, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00347.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess347 && gradedFilePoignees347.exists) {
    try {
        var gradedFootage347 = project.importFile(new ImportOptions(gradedFilePoignees347));
        gradedFootage347.parentFolder = fromGradingFolder;
        gradedFootage347.name = "UNDLM_00347_AVEC_POIGNEES";
        gradingSources[347] = gradedFootage347;
        gradingImportCount++;
        gradedImportSuccess347 = true;
        gradedFileName347 = "UNDLM_00347_AVEC_POIGNEES.mov";
        logImportSuccess(347, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00347_AVEC_POIGNEES.mov", gradedFileName347);
    } catch (e) {
        logImportError(347, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00347_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess347 && gradedFileBis347.exists) {
    try {
        var gradedFootage347 = project.importFile(new ImportOptions(gradedFileBis347));
        gradedFootage347.parentFolder = fromGradingFolder;
        gradedFootage347.name = "UNDLM_00347bis";
        gradingSources[347] = gradedFootage347;
        gradingImportCount++;
        gradedImportSuccess347 = true;
        gradedFileName347 = "UNDLM_00347bis.mov";
        logImportSuccess(347, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00347bis.mov", gradedFileName347);
    } catch (e) {
        logImportError(347, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00347bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess347) {
    missingGradingCount++;
}

// Import plan GRADED 00348
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile348 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00348.mov");
var gradedFilePoignees348 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00348_AVEC_POIGNEES.mov");
var gradedFileBis348 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00348bis.mov");

var gradedImportSuccess348 = false;
var gradedFileName348 = "";

// Tenter import standard
if (gradedFile348.exists) {
    try {
        var gradedFootage348 = project.importFile(new ImportOptions(gradedFile348));
        gradedFootage348.parentFolder = fromGradingFolder;
        gradedFootage348.name = "UNDLM_00348";
        gradingSources[348] = gradedFootage348;
        gradingImportCount++;
        gradedImportSuccess348 = true;
        gradedFileName348 = "UNDLM_00348.mov";
        logImportSuccess(348, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00348.mov", gradedFileName348);
    } catch (e) {
        logImportError(348, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00348.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess348 && gradedFilePoignees348.exists) {
    try {
        var gradedFootage348 = project.importFile(new ImportOptions(gradedFilePoignees348));
        gradedFootage348.parentFolder = fromGradingFolder;
        gradedFootage348.name = "UNDLM_00348_AVEC_POIGNEES";
        gradingSources[348] = gradedFootage348;
        gradingImportCount++;
        gradedImportSuccess348 = true;
        gradedFileName348 = "UNDLM_00348_AVEC_POIGNEES.mov";
        logImportSuccess(348, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00348_AVEC_POIGNEES.mov", gradedFileName348);
    } catch (e) {
        logImportError(348, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00348_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess348 && gradedFileBis348.exists) {
    try {
        var gradedFootage348 = project.importFile(new ImportOptions(gradedFileBis348));
        gradedFootage348.parentFolder = fromGradingFolder;
        gradedFootage348.name = "UNDLM_00348bis";
        gradingSources[348] = gradedFootage348;
        gradingImportCount++;
        gradedImportSuccess348 = true;
        gradedFileName348 = "UNDLM_00348bis.mov";
        logImportSuccess(348, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00348bis.mov", gradedFileName348);
    } catch (e) {
        logImportError(348, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00348bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess348) {
    missingGradingCount++;
}

// Import plan GRADED 00349
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile349 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00349.mov");
var gradedFilePoignees349 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00349_AVEC_POIGNEES.mov");
var gradedFileBis349 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00349bis.mov");

var gradedImportSuccess349 = false;
var gradedFileName349 = "";

// Tenter import standard
if (gradedFile349.exists) {
    try {
        var gradedFootage349 = project.importFile(new ImportOptions(gradedFile349));
        gradedFootage349.parentFolder = fromGradingFolder;
        gradedFootage349.name = "UNDLM_00349";
        gradingSources[349] = gradedFootage349;
        gradingImportCount++;
        gradedImportSuccess349 = true;
        gradedFileName349 = "UNDLM_00349.mov";
        logImportSuccess(349, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00349.mov", gradedFileName349);
    } catch (e) {
        logImportError(349, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00349.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess349 && gradedFilePoignees349.exists) {
    try {
        var gradedFootage349 = project.importFile(new ImportOptions(gradedFilePoignees349));
        gradedFootage349.parentFolder = fromGradingFolder;
        gradedFootage349.name = "UNDLM_00349_AVEC_POIGNEES";
        gradingSources[349] = gradedFootage349;
        gradingImportCount++;
        gradedImportSuccess349 = true;
        gradedFileName349 = "UNDLM_00349_AVEC_POIGNEES.mov";
        logImportSuccess(349, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00349_AVEC_POIGNEES.mov", gradedFileName349);
    } catch (e) {
        logImportError(349, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00349_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess349 && gradedFileBis349.exists) {
    try {
        var gradedFootage349 = project.importFile(new ImportOptions(gradedFileBis349));
        gradedFootage349.parentFolder = fromGradingFolder;
        gradedFootage349.name = "UNDLM_00349bis";
        gradingSources[349] = gradedFootage349;
        gradingImportCount++;
        gradedImportSuccess349 = true;
        gradedFileName349 = "UNDLM_00349bis.mov";
        logImportSuccess(349, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00349bis.mov", gradedFileName349);
    } catch (e) {
        logImportError(349, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00349bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess349) {
    missingGradingCount++;
}

// Import plan GRADED 00350
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile350 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00350.mov");
var gradedFilePoignees350 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00350_AVEC_POIGNEES.mov");
var gradedFileBis350 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00350bis.mov");

var gradedImportSuccess350 = false;
var gradedFileName350 = "";

// Tenter import standard
if (gradedFile350.exists) {
    try {
        var gradedFootage350 = project.importFile(new ImportOptions(gradedFile350));
        gradedFootage350.parentFolder = fromGradingFolder;
        gradedFootage350.name = "UNDLM_00350";
        gradingSources[350] = gradedFootage350;
        gradingImportCount++;
        gradedImportSuccess350 = true;
        gradedFileName350 = "UNDLM_00350.mov";
        logImportSuccess(350, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00350.mov", gradedFileName350);
    } catch (e) {
        logImportError(350, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00350.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess350 && gradedFilePoignees350.exists) {
    try {
        var gradedFootage350 = project.importFile(new ImportOptions(gradedFilePoignees350));
        gradedFootage350.parentFolder = fromGradingFolder;
        gradedFootage350.name = "UNDLM_00350_AVEC_POIGNEES";
        gradingSources[350] = gradedFootage350;
        gradingImportCount++;
        gradedImportSuccess350 = true;
        gradedFileName350 = "UNDLM_00350_AVEC_POIGNEES.mov";
        logImportSuccess(350, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00350_AVEC_POIGNEES.mov", gradedFileName350);
    } catch (e) {
        logImportError(350, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00350_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess350 && gradedFileBis350.exists) {
    try {
        var gradedFootage350 = project.importFile(new ImportOptions(gradedFileBis350));
        gradedFootage350.parentFolder = fromGradingFolder;
        gradedFootage350.name = "UNDLM_00350bis";
        gradingSources[350] = gradedFootage350;
        gradingImportCount++;
        gradedImportSuccess350 = true;
        gradedFileName350 = "UNDLM_00350bis.mov";
        logImportSuccess(350, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00350bis.mov", gradedFileName350);
    } catch (e) {
        logImportError(350, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00350bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess350) {
    missingGradingCount++;
}

// Import plan GRADED 00351
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile351 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00351.mov");
var gradedFilePoignees351 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00351_AVEC_POIGNEES.mov");
var gradedFileBis351 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00351bis.mov");

var gradedImportSuccess351 = false;
var gradedFileName351 = "";

// Tenter import standard
if (gradedFile351.exists) {
    try {
        var gradedFootage351 = project.importFile(new ImportOptions(gradedFile351));
        gradedFootage351.parentFolder = fromGradingFolder;
        gradedFootage351.name = "UNDLM_00351";
        gradingSources[351] = gradedFootage351;
        gradingImportCount++;
        gradedImportSuccess351 = true;
        gradedFileName351 = "UNDLM_00351.mov";
        logImportSuccess(351, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00351.mov", gradedFileName351);
    } catch (e) {
        logImportError(351, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00351.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess351 && gradedFilePoignees351.exists) {
    try {
        var gradedFootage351 = project.importFile(new ImportOptions(gradedFilePoignees351));
        gradedFootage351.parentFolder = fromGradingFolder;
        gradedFootage351.name = "UNDLM_00351_AVEC_POIGNEES";
        gradingSources[351] = gradedFootage351;
        gradingImportCount++;
        gradedImportSuccess351 = true;
        gradedFileName351 = "UNDLM_00351_AVEC_POIGNEES.mov";
        logImportSuccess(351, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00351_AVEC_POIGNEES.mov", gradedFileName351);
    } catch (e) {
        logImportError(351, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00351_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess351 && gradedFileBis351.exists) {
    try {
        var gradedFootage351 = project.importFile(new ImportOptions(gradedFileBis351));
        gradedFootage351.parentFolder = fromGradingFolder;
        gradedFootage351.name = "UNDLM_00351bis";
        gradingSources[351] = gradedFootage351;
        gradingImportCount++;
        gradedImportSuccess351 = true;
        gradedFileName351 = "UNDLM_00351bis.mov";
        logImportSuccess(351, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00351bis.mov", gradedFileName351);
    } catch (e) {
        logImportError(351, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00351bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess351) {
    missingGradingCount++;
}

// Import plan GRADED 00352
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile352 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00352.mov");
var gradedFilePoignees352 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00352_AVEC_POIGNEES.mov");
var gradedFileBis352 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00352bis.mov");

var gradedImportSuccess352 = false;
var gradedFileName352 = "";

// Tenter import standard
if (gradedFile352.exists) {
    try {
        var gradedFootage352 = project.importFile(new ImportOptions(gradedFile352));
        gradedFootage352.parentFolder = fromGradingFolder;
        gradedFootage352.name = "UNDLM_00352";
        gradingSources[352] = gradedFootage352;
        gradingImportCount++;
        gradedImportSuccess352 = true;
        gradedFileName352 = "UNDLM_00352.mov";
        logImportSuccess(352, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00352.mov", gradedFileName352);
    } catch (e) {
        logImportError(352, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00352.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess352 && gradedFilePoignees352.exists) {
    try {
        var gradedFootage352 = project.importFile(new ImportOptions(gradedFilePoignees352));
        gradedFootage352.parentFolder = fromGradingFolder;
        gradedFootage352.name = "UNDLM_00352_AVEC_POIGNEES";
        gradingSources[352] = gradedFootage352;
        gradingImportCount++;
        gradedImportSuccess352 = true;
        gradedFileName352 = "UNDLM_00352_AVEC_POIGNEES.mov";
        logImportSuccess(352, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00352_AVEC_POIGNEES.mov", gradedFileName352);
    } catch (e) {
        logImportError(352, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00352_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess352 && gradedFileBis352.exists) {
    try {
        var gradedFootage352 = project.importFile(new ImportOptions(gradedFileBis352));
        gradedFootage352.parentFolder = fromGradingFolder;
        gradedFootage352.name = "UNDLM_00352bis";
        gradingSources[352] = gradedFootage352;
        gradingImportCount++;
        gradedImportSuccess352 = true;
        gradedFileName352 = "UNDLM_00352bis.mov";
        logImportSuccess(352, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00352bis.mov", gradedFileName352);
    } catch (e) {
        logImportError(352, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00352bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess352) {
    missingGradingCount++;
}

// Import plan GRADED 00353
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile353 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00353.mov");
var gradedFilePoignees353 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00353_AVEC_POIGNEES.mov");
var gradedFileBis353 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00353bis.mov");

var gradedImportSuccess353 = false;
var gradedFileName353 = "";

// Tenter import standard
if (gradedFile353.exists) {
    try {
        var gradedFootage353 = project.importFile(new ImportOptions(gradedFile353));
        gradedFootage353.parentFolder = fromGradingFolder;
        gradedFootage353.name = "UNDLM_00353";
        gradingSources[353] = gradedFootage353;
        gradingImportCount++;
        gradedImportSuccess353 = true;
        gradedFileName353 = "UNDLM_00353.mov";
        logImportSuccess(353, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00353.mov", gradedFileName353);
    } catch (e) {
        logImportError(353, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00353.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess353 && gradedFilePoignees353.exists) {
    try {
        var gradedFootage353 = project.importFile(new ImportOptions(gradedFilePoignees353));
        gradedFootage353.parentFolder = fromGradingFolder;
        gradedFootage353.name = "UNDLM_00353_AVEC_POIGNEES";
        gradingSources[353] = gradedFootage353;
        gradingImportCount++;
        gradedImportSuccess353 = true;
        gradedFileName353 = "UNDLM_00353_AVEC_POIGNEES.mov";
        logImportSuccess(353, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00353_AVEC_POIGNEES.mov", gradedFileName353);
    } catch (e) {
        logImportError(353, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00353_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess353 && gradedFileBis353.exists) {
    try {
        var gradedFootage353 = project.importFile(new ImportOptions(gradedFileBis353));
        gradedFootage353.parentFolder = fromGradingFolder;
        gradedFootage353.name = "UNDLM_00353bis";
        gradingSources[353] = gradedFootage353;
        gradingImportCount++;
        gradedImportSuccess353 = true;
        gradedFileName353 = "UNDLM_00353bis.mov";
        logImportSuccess(353, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00353bis.mov", gradedFileName353);
    } catch (e) {
        logImportError(353, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00353bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess353) {
    missingGradingCount++;
}

// Import plan GRADED 00354
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile354 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00354.mov");
var gradedFilePoignees354 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00354_AVEC_POIGNEES.mov");
var gradedFileBis354 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00354bis.mov");

var gradedImportSuccess354 = false;
var gradedFileName354 = "";

// Tenter import standard
if (gradedFile354.exists) {
    try {
        var gradedFootage354 = project.importFile(new ImportOptions(gradedFile354));
        gradedFootage354.parentFolder = fromGradingFolder;
        gradedFootage354.name = "UNDLM_00354";
        gradingSources[354] = gradedFootage354;
        gradingImportCount++;
        gradedImportSuccess354 = true;
        gradedFileName354 = "UNDLM_00354.mov";
        logImportSuccess(354, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00354.mov", gradedFileName354);
    } catch (e) {
        logImportError(354, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00354.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess354 && gradedFilePoignees354.exists) {
    try {
        var gradedFootage354 = project.importFile(new ImportOptions(gradedFilePoignees354));
        gradedFootage354.parentFolder = fromGradingFolder;
        gradedFootage354.name = "UNDLM_00354_AVEC_POIGNEES";
        gradingSources[354] = gradedFootage354;
        gradingImportCount++;
        gradedImportSuccess354 = true;
        gradedFileName354 = "UNDLM_00354_AVEC_POIGNEES.mov";
        logImportSuccess(354, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00354_AVEC_POIGNEES.mov", gradedFileName354);
    } catch (e) {
        logImportError(354, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00354_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess354 && gradedFileBis354.exists) {
    try {
        var gradedFootage354 = project.importFile(new ImportOptions(gradedFileBis354));
        gradedFootage354.parentFolder = fromGradingFolder;
        gradedFootage354.name = "UNDLM_00354bis";
        gradingSources[354] = gradedFootage354;
        gradingImportCount++;
        gradedImportSuccess354 = true;
        gradedFileName354 = "UNDLM_00354bis.mov";
        logImportSuccess(354, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00354bis.mov", gradedFileName354);
    } catch (e) {
        logImportError(354, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00354bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess354) {
    missingGradingCount++;
}

// Import plan GRADED 00355
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile355 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00355.mov");
var gradedFilePoignees355 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00355_AVEC_POIGNEES.mov");
var gradedFileBis355 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00355bis.mov");

var gradedImportSuccess355 = false;
var gradedFileName355 = "";

// Tenter import standard
if (gradedFile355.exists) {
    try {
        var gradedFootage355 = project.importFile(new ImportOptions(gradedFile355));
        gradedFootage355.parentFolder = fromGradingFolder;
        gradedFootage355.name = "UNDLM_00355";
        gradingSources[355] = gradedFootage355;
        gradingImportCount++;
        gradedImportSuccess355 = true;
        gradedFileName355 = "UNDLM_00355.mov";
        logImportSuccess(355, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00355.mov", gradedFileName355);
    } catch (e) {
        logImportError(355, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00355.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess355 && gradedFilePoignees355.exists) {
    try {
        var gradedFootage355 = project.importFile(new ImportOptions(gradedFilePoignees355));
        gradedFootage355.parentFolder = fromGradingFolder;
        gradedFootage355.name = "UNDLM_00355_AVEC_POIGNEES";
        gradingSources[355] = gradedFootage355;
        gradingImportCount++;
        gradedImportSuccess355 = true;
        gradedFileName355 = "UNDLM_00355_AVEC_POIGNEES.mov";
        logImportSuccess(355, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00355_AVEC_POIGNEES.mov", gradedFileName355);
    } catch (e) {
        logImportError(355, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00355_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess355 && gradedFileBis355.exists) {
    try {
        var gradedFootage355 = project.importFile(new ImportOptions(gradedFileBis355));
        gradedFootage355.parentFolder = fromGradingFolder;
        gradedFootage355.name = "UNDLM_00355bis";
        gradingSources[355] = gradedFootage355;
        gradingImportCount++;
        gradedImportSuccess355 = true;
        gradedFileName355 = "UNDLM_00355bis.mov";
        logImportSuccess(355, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00355bis.mov", gradedFileName355);
    } catch (e) {
        logImportError(355, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00355bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess355) {
    missingGradingCount++;
}

// Import plan GRADED 00356
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile356 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00356.mov");
var gradedFilePoignees356 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00356_AVEC_POIGNEES.mov");
var gradedFileBis356 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00356bis.mov");

var gradedImportSuccess356 = false;
var gradedFileName356 = "";

// Tenter import standard
if (gradedFile356.exists) {
    try {
        var gradedFootage356 = project.importFile(new ImportOptions(gradedFile356));
        gradedFootage356.parentFolder = fromGradingFolder;
        gradedFootage356.name = "UNDLM_00356";
        gradingSources[356] = gradedFootage356;
        gradingImportCount++;
        gradedImportSuccess356 = true;
        gradedFileName356 = "UNDLM_00356.mov";
        logImportSuccess(356, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00356.mov", gradedFileName356);
    } catch (e) {
        logImportError(356, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00356.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess356 && gradedFilePoignees356.exists) {
    try {
        var gradedFootage356 = project.importFile(new ImportOptions(gradedFilePoignees356));
        gradedFootage356.parentFolder = fromGradingFolder;
        gradedFootage356.name = "UNDLM_00356_AVEC_POIGNEES";
        gradingSources[356] = gradedFootage356;
        gradingImportCount++;
        gradedImportSuccess356 = true;
        gradedFileName356 = "UNDLM_00356_AVEC_POIGNEES.mov";
        logImportSuccess(356, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00356_AVEC_POIGNEES.mov", gradedFileName356);
    } catch (e) {
        logImportError(356, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00356_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess356 && gradedFileBis356.exists) {
    try {
        var gradedFootage356 = project.importFile(new ImportOptions(gradedFileBis356));
        gradedFootage356.parentFolder = fromGradingFolder;
        gradedFootage356.name = "UNDLM_00356bis";
        gradingSources[356] = gradedFootage356;
        gradingImportCount++;
        gradedImportSuccess356 = true;
        gradedFileName356 = "UNDLM_00356bis.mov";
        logImportSuccess(356, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00356bis.mov", gradedFileName356);
    } catch (e) {
        logImportError(356, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00356bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess356) {
    missingGradingCount++;
}

// Import plan GRADED 00357
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile357 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00357.mov");
var gradedFilePoignees357 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00357_AVEC_POIGNEES.mov");
var gradedFileBis357 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00357bis.mov");

var gradedImportSuccess357 = false;
var gradedFileName357 = "";

// Tenter import standard
if (gradedFile357.exists) {
    try {
        var gradedFootage357 = project.importFile(new ImportOptions(gradedFile357));
        gradedFootage357.parentFolder = fromGradingFolder;
        gradedFootage357.name = "UNDLM_00357";
        gradingSources[357] = gradedFootage357;
        gradingImportCount++;
        gradedImportSuccess357 = true;
        gradedFileName357 = "UNDLM_00357.mov";
        logImportSuccess(357, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00357.mov", gradedFileName357);
    } catch (e) {
        logImportError(357, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00357.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess357 && gradedFilePoignees357.exists) {
    try {
        var gradedFootage357 = project.importFile(new ImportOptions(gradedFilePoignees357));
        gradedFootage357.parentFolder = fromGradingFolder;
        gradedFootage357.name = "UNDLM_00357_AVEC_POIGNEES";
        gradingSources[357] = gradedFootage357;
        gradingImportCount++;
        gradedImportSuccess357 = true;
        gradedFileName357 = "UNDLM_00357_AVEC_POIGNEES.mov";
        logImportSuccess(357, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00357_AVEC_POIGNEES.mov", gradedFileName357);
    } catch (e) {
        logImportError(357, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00357_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess357 && gradedFileBis357.exists) {
    try {
        var gradedFootage357 = project.importFile(new ImportOptions(gradedFileBis357));
        gradedFootage357.parentFolder = fromGradingFolder;
        gradedFootage357.name = "UNDLM_00357bis";
        gradingSources[357] = gradedFootage357;
        gradingImportCount++;
        gradedImportSuccess357 = true;
        gradedFileName357 = "UNDLM_00357bis.mov";
        logImportSuccess(357, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00357bis.mov", gradedFileName357);
    } catch (e) {
        logImportError(357, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00357bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess357) {
    missingGradingCount++;
}

// Import plan GRADED 00358
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile358 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00358.mov");
var gradedFilePoignees358 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00358_AVEC_POIGNEES.mov");
var gradedFileBis358 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00358bis.mov");

var gradedImportSuccess358 = false;
var gradedFileName358 = "";

// Tenter import standard
if (gradedFile358.exists) {
    try {
        var gradedFootage358 = project.importFile(new ImportOptions(gradedFile358));
        gradedFootage358.parentFolder = fromGradingFolder;
        gradedFootage358.name = "UNDLM_00358";
        gradingSources[358] = gradedFootage358;
        gradingImportCount++;
        gradedImportSuccess358 = true;
        gradedFileName358 = "UNDLM_00358.mov";
        logImportSuccess(358, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00358.mov", gradedFileName358);
    } catch (e) {
        logImportError(358, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00358.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess358 && gradedFilePoignees358.exists) {
    try {
        var gradedFootage358 = project.importFile(new ImportOptions(gradedFilePoignees358));
        gradedFootage358.parentFolder = fromGradingFolder;
        gradedFootage358.name = "UNDLM_00358_AVEC_POIGNEES";
        gradingSources[358] = gradedFootage358;
        gradingImportCount++;
        gradedImportSuccess358 = true;
        gradedFileName358 = "UNDLM_00358_AVEC_POIGNEES.mov";
        logImportSuccess(358, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00358_AVEC_POIGNEES.mov", gradedFileName358);
    } catch (e) {
        logImportError(358, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00358_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess358 && gradedFileBis358.exists) {
    try {
        var gradedFootage358 = project.importFile(new ImportOptions(gradedFileBis358));
        gradedFootage358.parentFolder = fromGradingFolder;
        gradedFootage358.name = "UNDLM_00358bis";
        gradingSources[358] = gradedFootage358;
        gradingImportCount++;
        gradedImportSuccess358 = true;
        gradedFileName358 = "UNDLM_00358bis.mov";
        logImportSuccess(358, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00358bis.mov", gradedFileName358);
    } catch (e) {
        logImportError(358, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00358bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess358) {
    missingGradingCount++;
}

// Import plan GRADED 00359
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile359 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00359.mov");
var gradedFilePoignees359 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00359_AVEC_POIGNEES.mov");
var gradedFileBis359 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00359bis.mov");

var gradedImportSuccess359 = false;
var gradedFileName359 = "";

// Tenter import standard
if (gradedFile359.exists) {
    try {
        var gradedFootage359 = project.importFile(new ImportOptions(gradedFile359));
        gradedFootage359.parentFolder = fromGradingFolder;
        gradedFootage359.name = "UNDLM_00359";
        gradingSources[359] = gradedFootage359;
        gradingImportCount++;
        gradedImportSuccess359 = true;
        gradedFileName359 = "UNDLM_00359.mov";
        logImportSuccess(359, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00359.mov", gradedFileName359);
    } catch (e) {
        logImportError(359, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00359.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess359 && gradedFilePoignees359.exists) {
    try {
        var gradedFootage359 = project.importFile(new ImportOptions(gradedFilePoignees359));
        gradedFootage359.parentFolder = fromGradingFolder;
        gradedFootage359.name = "UNDLM_00359_AVEC_POIGNEES";
        gradingSources[359] = gradedFootage359;
        gradingImportCount++;
        gradedImportSuccess359 = true;
        gradedFileName359 = "UNDLM_00359_AVEC_POIGNEES.mov";
        logImportSuccess(359, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00359_AVEC_POIGNEES.mov", gradedFileName359);
    } catch (e) {
        logImportError(359, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00359_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess359 && gradedFileBis359.exists) {
    try {
        var gradedFootage359 = project.importFile(new ImportOptions(gradedFileBis359));
        gradedFootage359.parentFolder = fromGradingFolder;
        gradedFootage359.name = "UNDLM_00359bis";
        gradingSources[359] = gradedFootage359;
        gradingImportCount++;
        gradedImportSuccess359 = true;
        gradedFileName359 = "UNDLM_00359bis.mov";
        logImportSuccess(359, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00359bis.mov", gradedFileName359);
    } catch (e) {
        logImportError(359, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00359bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess359) {
    missingGradingCount++;
}

// Import plan GRADED 00360
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile360 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00360.mov");
var gradedFilePoignees360 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00360_AVEC_POIGNEES.mov");
var gradedFileBis360 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00360bis.mov");

var gradedImportSuccess360 = false;
var gradedFileName360 = "";

// Tenter import standard
if (gradedFile360.exists) {
    try {
        var gradedFootage360 = project.importFile(new ImportOptions(gradedFile360));
        gradedFootage360.parentFolder = fromGradingFolder;
        gradedFootage360.name = "UNDLM_00360";
        gradingSources[360] = gradedFootage360;
        gradingImportCount++;
        gradedImportSuccess360 = true;
        gradedFileName360 = "UNDLM_00360.mov";
        logImportSuccess(360, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00360.mov", gradedFileName360);
    } catch (e) {
        logImportError(360, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00360.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess360 && gradedFilePoignees360.exists) {
    try {
        var gradedFootage360 = project.importFile(new ImportOptions(gradedFilePoignees360));
        gradedFootage360.parentFolder = fromGradingFolder;
        gradedFootage360.name = "UNDLM_00360_AVEC_POIGNEES";
        gradingSources[360] = gradedFootage360;
        gradingImportCount++;
        gradedImportSuccess360 = true;
        gradedFileName360 = "UNDLM_00360_AVEC_POIGNEES.mov";
        logImportSuccess(360, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00360_AVEC_POIGNEES.mov", gradedFileName360);
    } catch (e) {
        logImportError(360, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00360_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess360 && gradedFileBis360.exists) {
    try {
        var gradedFootage360 = project.importFile(new ImportOptions(gradedFileBis360));
        gradedFootage360.parentFolder = fromGradingFolder;
        gradedFootage360.name = "UNDLM_00360bis";
        gradingSources[360] = gradedFootage360;
        gradingImportCount++;
        gradedImportSuccess360 = true;
        gradedFileName360 = "UNDLM_00360bis.mov";
        logImportSuccess(360, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00360bis.mov", gradedFileName360);
    } catch (e) {
        logImportError(360, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00360bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess360) {
    missingGradingCount++;
}

// Import plan GRADED 00361
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile361 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00361.mov");
var gradedFilePoignees361 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00361_AVEC_POIGNEES.mov");
var gradedFileBis361 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00361bis.mov");

var gradedImportSuccess361 = false;
var gradedFileName361 = "";

// Tenter import standard
if (gradedFile361.exists) {
    try {
        var gradedFootage361 = project.importFile(new ImportOptions(gradedFile361));
        gradedFootage361.parentFolder = fromGradingFolder;
        gradedFootage361.name = "UNDLM_00361";
        gradingSources[361] = gradedFootage361;
        gradingImportCount++;
        gradedImportSuccess361 = true;
        gradedFileName361 = "UNDLM_00361.mov";
        logImportSuccess(361, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00361.mov", gradedFileName361);
    } catch (e) {
        logImportError(361, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00361.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess361 && gradedFilePoignees361.exists) {
    try {
        var gradedFootage361 = project.importFile(new ImportOptions(gradedFilePoignees361));
        gradedFootage361.parentFolder = fromGradingFolder;
        gradedFootage361.name = "UNDLM_00361_AVEC_POIGNEES";
        gradingSources[361] = gradedFootage361;
        gradingImportCount++;
        gradedImportSuccess361 = true;
        gradedFileName361 = "UNDLM_00361_AVEC_POIGNEES.mov";
        logImportSuccess(361, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00361_AVEC_POIGNEES.mov", gradedFileName361);
    } catch (e) {
        logImportError(361, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00361_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess361 && gradedFileBis361.exists) {
    try {
        var gradedFootage361 = project.importFile(new ImportOptions(gradedFileBis361));
        gradedFootage361.parentFolder = fromGradingFolder;
        gradedFootage361.name = "UNDLM_00361bis";
        gradingSources[361] = gradedFootage361;
        gradingImportCount++;
        gradedImportSuccess361 = true;
        gradedFileName361 = "UNDLM_00361bis.mov";
        logImportSuccess(361, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00361bis.mov", gradedFileName361);
    } catch (e) {
        logImportError(361, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00361bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess361) {
    missingGradingCount++;
}

// Import plan GRADED 00362
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile362 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00362.mov");
var gradedFilePoignees362 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00362_AVEC_POIGNEES.mov");
var gradedFileBis362 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00362bis.mov");

var gradedImportSuccess362 = false;
var gradedFileName362 = "";

// Tenter import standard
if (gradedFile362.exists) {
    try {
        var gradedFootage362 = project.importFile(new ImportOptions(gradedFile362));
        gradedFootage362.parentFolder = fromGradingFolder;
        gradedFootage362.name = "UNDLM_00362";
        gradingSources[362] = gradedFootage362;
        gradingImportCount++;
        gradedImportSuccess362 = true;
        gradedFileName362 = "UNDLM_00362.mov";
        logImportSuccess(362, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00362.mov", gradedFileName362);
    } catch (e) {
        logImportError(362, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00362.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess362 && gradedFilePoignees362.exists) {
    try {
        var gradedFootage362 = project.importFile(new ImportOptions(gradedFilePoignees362));
        gradedFootage362.parentFolder = fromGradingFolder;
        gradedFootage362.name = "UNDLM_00362_AVEC_POIGNEES";
        gradingSources[362] = gradedFootage362;
        gradingImportCount++;
        gradedImportSuccess362 = true;
        gradedFileName362 = "UNDLM_00362_AVEC_POIGNEES.mov";
        logImportSuccess(362, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00362_AVEC_POIGNEES.mov", gradedFileName362);
    } catch (e) {
        logImportError(362, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00362_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess362 && gradedFileBis362.exists) {
    try {
        var gradedFootage362 = project.importFile(new ImportOptions(gradedFileBis362));
        gradedFootage362.parentFolder = fromGradingFolder;
        gradedFootage362.name = "UNDLM_00362bis";
        gradingSources[362] = gradedFootage362;
        gradingImportCount++;
        gradedImportSuccess362 = true;
        gradedFileName362 = "UNDLM_00362bis.mov";
        logImportSuccess(362, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00362bis.mov", gradedFileName362);
    } catch (e) {
        logImportError(362, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00362bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess362) {
    missingGradingCount++;
}

// Import plan GRADED 00363
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile363 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00363.mov");
var gradedFilePoignees363 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00363_AVEC_POIGNEES.mov");
var gradedFileBis363 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00363bis.mov");

var gradedImportSuccess363 = false;
var gradedFileName363 = "";

// Tenter import standard
if (gradedFile363.exists) {
    try {
        var gradedFootage363 = project.importFile(new ImportOptions(gradedFile363));
        gradedFootage363.parentFolder = fromGradingFolder;
        gradedFootage363.name = "UNDLM_00363";
        gradingSources[363] = gradedFootage363;
        gradingImportCount++;
        gradedImportSuccess363 = true;
        gradedFileName363 = "UNDLM_00363.mov";
        logImportSuccess(363, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00363.mov", gradedFileName363);
    } catch (e) {
        logImportError(363, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00363.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess363 && gradedFilePoignees363.exists) {
    try {
        var gradedFootage363 = project.importFile(new ImportOptions(gradedFilePoignees363));
        gradedFootage363.parentFolder = fromGradingFolder;
        gradedFootage363.name = "UNDLM_00363_AVEC_POIGNEES";
        gradingSources[363] = gradedFootage363;
        gradingImportCount++;
        gradedImportSuccess363 = true;
        gradedFileName363 = "UNDLM_00363_AVEC_POIGNEES.mov";
        logImportSuccess(363, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00363_AVEC_POIGNEES.mov", gradedFileName363);
    } catch (e) {
        logImportError(363, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00363_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess363 && gradedFileBis363.exists) {
    try {
        var gradedFootage363 = project.importFile(new ImportOptions(gradedFileBis363));
        gradedFootage363.parentFolder = fromGradingFolder;
        gradedFootage363.name = "UNDLM_00363bis";
        gradingSources[363] = gradedFootage363;
        gradingImportCount++;
        gradedImportSuccess363 = true;
        gradedFileName363 = "UNDLM_00363bis.mov";
        logImportSuccess(363, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00363bis.mov", gradedFileName363);
    } catch (e) {
        logImportError(363, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00363bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess363) {
    missingGradingCount++;
}

// Import plan GRADED 00364
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile364 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00364.mov");
var gradedFilePoignees364 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00364_AVEC_POIGNEES.mov");
var gradedFileBis364 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00364bis.mov");

var gradedImportSuccess364 = false;
var gradedFileName364 = "";

// Tenter import standard
if (gradedFile364.exists) {
    try {
        var gradedFootage364 = project.importFile(new ImportOptions(gradedFile364));
        gradedFootage364.parentFolder = fromGradingFolder;
        gradedFootage364.name = "UNDLM_00364";
        gradingSources[364] = gradedFootage364;
        gradingImportCount++;
        gradedImportSuccess364 = true;
        gradedFileName364 = "UNDLM_00364.mov";
        logImportSuccess(364, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00364.mov", gradedFileName364);
    } catch (e) {
        logImportError(364, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00364.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess364 && gradedFilePoignees364.exists) {
    try {
        var gradedFootage364 = project.importFile(new ImportOptions(gradedFilePoignees364));
        gradedFootage364.parentFolder = fromGradingFolder;
        gradedFootage364.name = "UNDLM_00364_AVEC_POIGNEES";
        gradingSources[364] = gradedFootage364;
        gradingImportCount++;
        gradedImportSuccess364 = true;
        gradedFileName364 = "UNDLM_00364_AVEC_POIGNEES.mov";
        logImportSuccess(364, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00364_AVEC_POIGNEES.mov", gradedFileName364);
    } catch (e) {
        logImportError(364, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00364_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess364 && gradedFileBis364.exists) {
    try {
        var gradedFootage364 = project.importFile(new ImportOptions(gradedFileBis364));
        gradedFootage364.parentFolder = fromGradingFolder;
        gradedFootage364.name = "UNDLM_00364bis";
        gradingSources[364] = gradedFootage364;
        gradingImportCount++;
        gradedImportSuccess364 = true;
        gradedFileName364 = "UNDLM_00364bis.mov";
        logImportSuccess(364, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00364bis.mov", gradedFileName364);
    } catch (e) {
        logImportError(364, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00364bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess364) {
    missingGradingCount++;
}

// Import plan GRADED 00365
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile365 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00365.mov");
var gradedFilePoignees365 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00365_AVEC_POIGNEES.mov");
var gradedFileBis365 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00365bis.mov");

var gradedImportSuccess365 = false;
var gradedFileName365 = "";

// Tenter import standard
if (gradedFile365.exists) {
    try {
        var gradedFootage365 = project.importFile(new ImportOptions(gradedFile365));
        gradedFootage365.parentFolder = fromGradingFolder;
        gradedFootage365.name = "UNDLM_00365";
        gradingSources[365] = gradedFootage365;
        gradingImportCount++;
        gradedImportSuccess365 = true;
        gradedFileName365 = "UNDLM_00365.mov";
        logImportSuccess(365, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00365.mov", gradedFileName365);
    } catch (e) {
        logImportError(365, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00365.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess365 && gradedFilePoignees365.exists) {
    try {
        var gradedFootage365 = project.importFile(new ImportOptions(gradedFilePoignees365));
        gradedFootage365.parentFolder = fromGradingFolder;
        gradedFootage365.name = "UNDLM_00365_AVEC_POIGNEES";
        gradingSources[365] = gradedFootage365;
        gradingImportCount++;
        gradedImportSuccess365 = true;
        gradedFileName365 = "UNDLM_00365_AVEC_POIGNEES.mov";
        logImportSuccess(365, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00365_AVEC_POIGNEES.mov", gradedFileName365);
    } catch (e) {
        logImportError(365, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00365_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess365 && gradedFileBis365.exists) {
    try {
        var gradedFootage365 = project.importFile(new ImportOptions(gradedFileBis365));
        gradedFootage365.parentFolder = fromGradingFolder;
        gradedFootage365.name = "UNDLM_00365bis";
        gradingSources[365] = gradedFootage365;
        gradingImportCount++;
        gradedImportSuccess365 = true;
        gradedFileName365 = "UNDLM_00365bis.mov";
        logImportSuccess(365, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00365bis.mov", gradedFileName365);
    } catch (e) {
        logImportError(365, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00365bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess365) {
    missingGradingCount++;
}

// Import plan GRADED 00366
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile366 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00366.mov");
var gradedFilePoignees366 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00366_AVEC_POIGNEES.mov");
var gradedFileBis366 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00366bis.mov");

var gradedImportSuccess366 = false;
var gradedFileName366 = "";

// Tenter import standard
if (gradedFile366.exists) {
    try {
        var gradedFootage366 = project.importFile(new ImportOptions(gradedFile366));
        gradedFootage366.parentFolder = fromGradingFolder;
        gradedFootage366.name = "UNDLM_00366";
        gradingSources[366] = gradedFootage366;
        gradingImportCount++;
        gradedImportSuccess366 = true;
        gradedFileName366 = "UNDLM_00366.mov";
        logImportSuccess(366, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00366.mov", gradedFileName366);
    } catch (e) {
        logImportError(366, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00366.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess366 && gradedFilePoignees366.exists) {
    try {
        var gradedFootage366 = project.importFile(new ImportOptions(gradedFilePoignees366));
        gradedFootage366.parentFolder = fromGradingFolder;
        gradedFootage366.name = "UNDLM_00366_AVEC_POIGNEES";
        gradingSources[366] = gradedFootage366;
        gradingImportCount++;
        gradedImportSuccess366 = true;
        gradedFileName366 = "UNDLM_00366_AVEC_POIGNEES.mov";
        logImportSuccess(366, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00366_AVEC_POIGNEES.mov", gradedFileName366);
    } catch (e) {
        logImportError(366, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00366_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess366 && gradedFileBis366.exists) {
    try {
        var gradedFootage366 = project.importFile(new ImportOptions(gradedFileBis366));
        gradedFootage366.parentFolder = fromGradingFolder;
        gradedFootage366.name = "UNDLM_00366bis";
        gradingSources[366] = gradedFootage366;
        gradingImportCount++;
        gradedImportSuccess366 = true;
        gradedFileName366 = "UNDLM_00366bis.mov";
        logImportSuccess(366, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00366bis.mov", gradedFileName366);
    } catch (e) {
        logImportError(366, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00366bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess366) {
    missingGradingCount++;
}

// Import plan GRADED 00367
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile367 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00367.mov");
var gradedFilePoignees367 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00367_AVEC_POIGNEES.mov");
var gradedFileBis367 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00367bis.mov");

var gradedImportSuccess367 = false;
var gradedFileName367 = "";

// Tenter import standard
if (gradedFile367.exists) {
    try {
        var gradedFootage367 = project.importFile(new ImportOptions(gradedFile367));
        gradedFootage367.parentFolder = fromGradingFolder;
        gradedFootage367.name = "UNDLM_00367";
        gradingSources[367] = gradedFootage367;
        gradingImportCount++;
        gradedImportSuccess367 = true;
        gradedFileName367 = "UNDLM_00367.mov";
        logImportSuccess(367, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00367.mov", gradedFileName367);
    } catch (e) {
        logImportError(367, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00367.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess367 && gradedFilePoignees367.exists) {
    try {
        var gradedFootage367 = project.importFile(new ImportOptions(gradedFilePoignees367));
        gradedFootage367.parentFolder = fromGradingFolder;
        gradedFootage367.name = "UNDLM_00367_AVEC_POIGNEES";
        gradingSources[367] = gradedFootage367;
        gradingImportCount++;
        gradedImportSuccess367 = true;
        gradedFileName367 = "UNDLM_00367_AVEC_POIGNEES.mov";
        logImportSuccess(367, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00367_AVEC_POIGNEES.mov", gradedFileName367);
    } catch (e) {
        logImportError(367, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00367_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess367 && gradedFileBis367.exists) {
    try {
        var gradedFootage367 = project.importFile(new ImportOptions(gradedFileBis367));
        gradedFootage367.parentFolder = fromGradingFolder;
        gradedFootage367.name = "UNDLM_00367bis";
        gradingSources[367] = gradedFootage367;
        gradingImportCount++;
        gradedImportSuccess367 = true;
        gradedFileName367 = "UNDLM_00367bis.mov";
        logImportSuccess(367, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00367bis.mov", gradedFileName367);
    } catch (e) {
        logImportError(367, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00367bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess367) {
    missingGradingCount++;
}

// Import plan GRADED 00368
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile368 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00368.mov");
var gradedFilePoignees368 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00368_AVEC_POIGNEES.mov");
var gradedFileBis368 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00368bis.mov");

var gradedImportSuccess368 = false;
var gradedFileName368 = "";

// Tenter import standard
if (gradedFile368.exists) {
    try {
        var gradedFootage368 = project.importFile(new ImportOptions(gradedFile368));
        gradedFootage368.parentFolder = fromGradingFolder;
        gradedFootage368.name = "UNDLM_00368";
        gradingSources[368] = gradedFootage368;
        gradingImportCount++;
        gradedImportSuccess368 = true;
        gradedFileName368 = "UNDLM_00368.mov";
        logImportSuccess(368, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00368.mov", gradedFileName368);
    } catch (e) {
        logImportError(368, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00368.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess368 && gradedFilePoignees368.exists) {
    try {
        var gradedFootage368 = project.importFile(new ImportOptions(gradedFilePoignees368));
        gradedFootage368.parentFolder = fromGradingFolder;
        gradedFootage368.name = "UNDLM_00368_AVEC_POIGNEES";
        gradingSources[368] = gradedFootage368;
        gradingImportCount++;
        gradedImportSuccess368 = true;
        gradedFileName368 = "UNDLM_00368_AVEC_POIGNEES.mov";
        logImportSuccess(368, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00368_AVEC_POIGNEES.mov", gradedFileName368);
    } catch (e) {
        logImportError(368, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00368_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess368 && gradedFileBis368.exists) {
    try {
        var gradedFootage368 = project.importFile(new ImportOptions(gradedFileBis368));
        gradedFootage368.parentFolder = fromGradingFolder;
        gradedFootage368.name = "UNDLM_00368bis";
        gradingSources[368] = gradedFootage368;
        gradingImportCount++;
        gradedImportSuccess368 = true;
        gradedFileName368 = "UNDLM_00368bis.mov";
        logImportSuccess(368, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00368bis.mov", gradedFileName368);
    } catch (e) {
        logImportError(368, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00368bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess368) {
    missingGradingCount++;
}

// Import plan GRADED 00369
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile369 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00369.mov");
var gradedFilePoignees369 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00369_AVEC_POIGNEES.mov");
var gradedFileBis369 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00369bis.mov");

var gradedImportSuccess369 = false;
var gradedFileName369 = "";

// Tenter import standard
if (gradedFile369.exists) {
    try {
        var gradedFootage369 = project.importFile(new ImportOptions(gradedFile369));
        gradedFootage369.parentFolder = fromGradingFolder;
        gradedFootage369.name = "UNDLM_00369";
        gradingSources[369] = gradedFootage369;
        gradingImportCount++;
        gradedImportSuccess369 = true;
        gradedFileName369 = "UNDLM_00369.mov";
        logImportSuccess(369, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00369.mov", gradedFileName369);
    } catch (e) {
        logImportError(369, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00369.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess369 && gradedFilePoignees369.exists) {
    try {
        var gradedFootage369 = project.importFile(new ImportOptions(gradedFilePoignees369));
        gradedFootage369.parentFolder = fromGradingFolder;
        gradedFootage369.name = "UNDLM_00369_AVEC_POIGNEES";
        gradingSources[369] = gradedFootage369;
        gradingImportCount++;
        gradedImportSuccess369 = true;
        gradedFileName369 = "UNDLM_00369_AVEC_POIGNEES.mov";
        logImportSuccess(369, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00369_AVEC_POIGNEES.mov", gradedFileName369);
    } catch (e) {
        logImportError(369, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00369_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess369 && gradedFileBis369.exists) {
    try {
        var gradedFootage369 = project.importFile(new ImportOptions(gradedFileBis369));
        gradedFootage369.parentFolder = fromGradingFolder;
        gradedFootage369.name = "UNDLM_00369bis";
        gradingSources[369] = gradedFootage369;
        gradingImportCount++;
        gradedImportSuccess369 = true;
        gradedFileName369 = "UNDLM_00369bis.mov";
        logImportSuccess(369, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00369bis.mov", gradedFileName369);
    } catch (e) {
        logImportError(369, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00369bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess369) {
    missingGradingCount++;
}

// Import plan GRADED 00370
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile370 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00370.mov");
var gradedFilePoignees370 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00370_AVEC_POIGNEES.mov");
var gradedFileBis370 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00370bis.mov");

var gradedImportSuccess370 = false;
var gradedFileName370 = "";

// Tenter import standard
if (gradedFile370.exists) {
    try {
        var gradedFootage370 = project.importFile(new ImportOptions(gradedFile370));
        gradedFootage370.parentFolder = fromGradingFolder;
        gradedFootage370.name = "UNDLM_00370";
        gradingSources[370] = gradedFootage370;
        gradingImportCount++;
        gradedImportSuccess370 = true;
        gradedFileName370 = "UNDLM_00370.mov";
        logImportSuccess(370, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00370.mov", gradedFileName370);
    } catch (e) {
        logImportError(370, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00370.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess370 && gradedFilePoignees370.exists) {
    try {
        var gradedFootage370 = project.importFile(new ImportOptions(gradedFilePoignees370));
        gradedFootage370.parentFolder = fromGradingFolder;
        gradedFootage370.name = "UNDLM_00370_AVEC_POIGNEES";
        gradingSources[370] = gradedFootage370;
        gradingImportCount++;
        gradedImportSuccess370 = true;
        gradedFileName370 = "UNDLM_00370_AVEC_POIGNEES.mov";
        logImportSuccess(370, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00370_AVEC_POIGNEES.mov", gradedFileName370);
    } catch (e) {
        logImportError(370, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00370_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess370 && gradedFileBis370.exists) {
    try {
        var gradedFootage370 = project.importFile(new ImportOptions(gradedFileBis370));
        gradedFootage370.parentFolder = fromGradingFolder;
        gradedFootage370.name = "UNDLM_00370bis";
        gradingSources[370] = gradedFootage370;
        gradingImportCount++;
        gradedImportSuccess370 = true;
        gradedFileName370 = "UNDLM_00370bis.mov";
        logImportSuccess(370, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00370bis.mov", gradedFileName370);
    } catch (e) {
        logImportError(370, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00370bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess370) {
    missingGradingCount++;
}

// Import plan GRADED 00371
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile371 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00371.mov");
var gradedFilePoignees371 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00371_AVEC_POIGNEES.mov");
var gradedFileBis371 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00371bis.mov");

var gradedImportSuccess371 = false;
var gradedFileName371 = "";

// Tenter import standard
if (gradedFile371.exists) {
    try {
        var gradedFootage371 = project.importFile(new ImportOptions(gradedFile371));
        gradedFootage371.parentFolder = fromGradingFolder;
        gradedFootage371.name = "UNDLM_00371";
        gradingSources[371] = gradedFootage371;
        gradingImportCount++;
        gradedImportSuccess371 = true;
        gradedFileName371 = "UNDLM_00371.mov";
        logImportSuccess(371, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00371.mov", gradedFileName371);
    } catch (e) {
        logImportError(371, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00371.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess371 && gradedFilePoignees371.exists) {
    try {
        var gradedFootage371 = project.importFile(new ImportOptions(gradedFilePoignees371));
        gradedFootage371.parentFolder = fromGradingFolder;
        gradedFootage371.name = "UNDLM_00371_AVEC_POIGNEES";
        gradingSources[371] = gradedFootage371;
        gradingImportCount++;
        gradedImportSuccess371 = true;
        gradedFileName371 = "UNDLM_00371_AVEC_POIGNEES.mov";
        logImportSuccess(371, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00371_AVEC_POIGNEES.mov", gradedFileName371);
    } catch (e) {
        logImportError(371, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00371_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess371 && gradedFileBis371.exists) {
    try {
        var gradedFootage371 = project.importFile(new ImportOptions(gradedFileBis371));
        gradedFootage371.parentFolder = fromGradingFolder;
        gradedFootage371.name = "UNDLM_00371bis";
        gradingSources[371] = gradedFootage371;
        gradingImportCount++;
        gradedImportSuccess371 = true;
        gradedFileName371 = "UNDLM_00371bis.mov";
        logImportSuccess(371, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00371bis.mov", gradedFileName371);
    } catch (e) {
        logImportError(371, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00371bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess371) {
    missingGradingCount++;
}

// Import plan GRADED 00372
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile372 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00372.mov");
var gradedFilePoignees372 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00372_AVEC_POIGNEES.mov");
var gradedFileBis372 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00372bis.mov");

var gradedImportSuccess372 = false;
var gradedFileName372 = "";

// Tenter import standard
if (gradedFile372.exists) {
    try {
        var gradedFootage372 = project.importFile(new ImportOptions(gradedFile372));
        gradedFootage372.parentFolder = fromGradingFolder;
        gradedFootage372.name = "UNDLM_00372";
        gradingSources[372] = gradedFootage372;
        gradingImportCount++;
        gradedImportSuccess372 = true;
        gradedFileName372 = "UNDLM_00372.mov";
        logImportSuccess(372, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00372.mov", gradedFileName372);
    } catch (e) {
        logImportError(372, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00372.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess372 && gradedFilePoignees372.exists) {
    try {
        var gradedFootage372 = project.importFile(new ImportOptions(gradedFilePoignees372));
        gradedFootage372.parentFolder = fromGradingFolder;
        gradedFootage372.name = "UNDLM_00372_AVEC_POIGNEES";
        gradingSources[372] = gradedFootage372;
        gradingImportCount++;
        gradedImportSuccess372 = true;
        gradedFileName372 = "UNDLM_00372_AVEC_POIGNEES.mov";
        logImportSuccess(372, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00372_AVEC_POIGNEES.mov", gradedFileName372);
    } catch (e) {
        logImportError(372, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00372_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess372 && gradedFileBis372.exists) {
    try {
        var gradedFootage372 = project.importFile(new ImportOptions(gradedFileBis372));
        gradedFootage372.parentFolder = fromGradingFolder;
        gradedFootage372.name = "UNDLM_00372bis";
        gradingSources[372] = gradedFootage372;
        gradingImportCount++;
        gradedImportSuccess372 = true;
        gradedFileName372 = "UNDLM_00372bis.mov";
        logImportSuccess(372, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00372bis.mov", gradedFileName372);
    } catch (e) {
        logImportError(372, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00372bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess372) {
    missingGradingCount++;
}

// Import plan GRADED 00373
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile373 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00373.mov");
var gradedFilePoignees373 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00373_AVEC_POIGNEES.mov");
var gradedFileBis373 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00373bis.mov");

var gradedImportSuccess373 = false;
var gradedFileName373 = "";

// Tenter import standard
if (gradedFile373.exists) {
    try {
        var gradedFootage373 = project.importFile(new ImportOptions(gradedFile373));
        gradedFootage373.parentFolder = fromGradingFolder;
        gradedFootage373.name = "UNDLM_00373";
        gradingSources[373] = gradedFootage373;
        gradingImportCount++;
        gradedImportSuccess373 = true;
        gradedFileName373 = "UNDLM_00373.mov";
        logImportSuccess(373, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00373.mov", gradedFileName373);
    } catch (e) {
        logImportError(373, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00373.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess373 && gradedFilePoignees373.exists) {
    try {
        var gradedFootage373 = project.importFile(new ImportOptions(gradedFilePoignees373));
        gradedFootage373.parentFolder = fromGradingFolder;
        gradedFootage373.name = "UNDLM_00373_AVEC_POIGNEES";
        gradingSources[373] = gradedFootage373;
        gradingImportCount++;
        gradedImportSuccess373 = true;
        gradedFileName373 = "UNDLM_00373_AVEC_POIGNEES.mov";
        logImportSuccess(373, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00373_AVEC_POIGNEES.mov", gradedFileName373);
    } catch (e) {
        logImportError(373, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00373_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess373 && gradedFileBis373.exists) {
    try {
        var gradedFootage373 = project.importFile(new ImportOptions(gradedFileBis373));
        gradedFootage373.parentFolder = fromGradingFolder;
        gradedFootage373.name = "UNDLM_00373bis";
        gradingSources[373] = gradedFootage373;
        gradingImportCount++;
        gradedImportSuccess373 = true;
        gradedFileName373 = "UNDLM_00373bis.mov";
        logImportSuccess(373, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00373bis.mov", gradedFileName373);
    } catch (e) {
        logImportError(373, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00373bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess373) {
    missingGradingCount++;
}

// Import plan GRADED 00374
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile374 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00374.mov");
var gradedFilePoignees374 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00374_AVEC_POIGNEES.mov");
var gradedFileBis374 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00374bis.mov");

var gradedImportSuccess374 = false;
var gradedFileName374 = "";

// Tenter import standard
if (gradedFile374.exists) {
    try {
        var gradedFootage374 = project.importFile(new ImportOptions(gradedFile374));
        gradedFootage374.parentFolder = fromGradingFolder;
        gradedFootage374.name = "UNDLM_00374";
        gradingSources[374] = gradedFootage374;
        gradingImportCount++;
        gradedImportSuccess374 = true;
        gradedFileName374 = "UNDLM_00374.mov";
        logImportSuccess(374, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00374.mov", gradedFileName374);
    } catch (e) {
        logImportError(374, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00374.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess374 && gradedFilePoignees374.exists) {
    try {
        var gradedFootage374 = project.importFile(new ImportOptions(gradedFilePoignees374));
        gradedFootage374.parentFolder = fromGradingFolder;
        gradedFootage374.name = "UNDLM_00374_AVEC_POIGNEES";
        gradingSources[374] = gradedFootage374;
        gradingImportCount++;
        gradedImportSuccess374 = true;
        gradedFileName374 = "UNDLM_00374_AVEC_POIGNEES.mov";
        logImportSuccess(374, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00374_AVEC_POIGNEES.mov", gradedFileName374);
    } catch (e) {
        logImportError(374, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00374_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess374 && gradedFileBis374.exists) {
    try {
        var gradedFootage374 = project.importFile(new ImportOptions(gradedFileBis374));
        gradedFootage374.parentFolder = fromGradingFolder;
        gradedFootage374.name = "UNDLM_00374bis";
        gradingSources[374] = gradedFootage374;
        gradingImportCount++;
        gradedImportSuccess374 = true;
        gradedFileName374 = "UNDLM_00374bis.mov";
        logImportSuccess(374, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00374bis.mov", gradedFileName374);
    } catch (e) {
        logImportError(374, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00374bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess374) {
    missingGradingCount++;
}

// Import plan GRADED 00375
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile375 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00375.mov");
var gradedFilePoignees375 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00375_AVEC_POIGNEES.mov");
var gradedFileBis375 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00375bis.mov");

var gradedImportSuccess375 = false;
var gradedFileName375 = "";

// Tenter import standard
if (gradedFile375.exists) {
    try {
        var gradedFootage375 = project.importFile(new ImportOptions(gradedFile375));
        gradedFootage375.parentFolder = fromGradingFolder;
        gradedFootage375.name = "UNDLM_00375";
        gradingSources[375] = gradedFootage375;
        gradingImportCount++;
        gradedImportSuccess375 = true;
        gradedFileName375 = "UNDLM_00375.mov";
        logImportSuccess(375, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00375.mov", gradedFileName375);
    } catch (e) {
        logImportError(375, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00375.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess375 && gradedFilePoignees375.exists) {
    try {
        var gradedFootage375 = project.importFile(new ImportOptions(gradedFilePoignees375));
        gradedFootage375.parentFolder = fromGradingFolder;
        gradedFootage375.name = "UNDLM_00375_AVEC_POIGNEES";
        gradingSources[375] = gradedFootage375;
        gradingImportCount++;
        gradedImportSuccess375 = true;
        gradedFileName375 = "UNDLM_00375_AVEC_POIGNEES.mov";
        logImportSuccess(375, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00375_AVEC_POIGNEES.mov", gradedFileName375);
    } catch (e) {
        logImportError(375, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00375_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess375 && gradedFileBis375.exists) {
    try {
        var gradedFootage375 = project.importFile(new ImportOptions(gradedFileBis375));
        gradedFootage375.parentFolder = fromGradingFolder;
        gradedFootage375.name = "UNDLM_00375bis";
        gradingSources[375] = gradedFootage375;
        gradingImportCount++;
        gradedImportSuccess375 = true;
        gradedFileName375 = "UNDLM_00375bis.mov";
        logImportSuccess(375, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00375bis.mov", gradedFileName375);
    } catch (e) {
        logImportError(375, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00375bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess375) {
    missingGradingCount++;
}

// Import plan GRADED 00376
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile376 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00376.mov");
var gradedFilePoignees376 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00376_AVEC_POIGNEES.mov");
var gradedFileBis376 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00376bis.mov");

var gradedImportSuccess376 = false;
var gradedFileName376 = "";

// Tenter import standard
if (gradedFile376.exists) {
    try {
        var gradedFootage376 = project.importFile(new ImportOptions(gradedFile376));
        gradedFootage376.parentFolder = fromGradingFolder;
        gradedFootage376.name = "UNDLM_00376";
        gradingSources[376] = gradedFootage376;
        gradingImportCount++;
        gradedImportSuccess376 = true;
        gradedFileName376 = "UNDLM_00376.mov";
        logImportSuccess(376, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00376.mov", gradedFileName376);
    } catch (e) {
        logImportError(376, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00376.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess376 && gradedFilePoignees376.exists) {
    try {
        var gradedFootage376 = project.importFile(new ImportOptions(gradedFilePoignees376));
        gradedFootage376.parentFolder = fromGradingFolder;
        gradedFootage376.name = "UNDLM_00376_AVEC_POIGNEES";
        gradingSources[376] = gradedFootage376;
        gradingImportCount++;
        gradedImportSuccess376 = true;
        gradedFileName376 = "UNDLM_00376_AVEC_POIGNEES.mov";
        logImportSuccess(376, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00376_AVEC_POIGNEES.mov", gradedFileName376);
    } catch (e) {
        logImportError(376, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00376_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess376 && gradedFileBis376.exists) {
    try {
        var gradedFootage376 = project.importFile(new ImportOptions(gradedFileBis376));
        gradedFootage376.parentFolder = fromGradingFolder;
        gradedFootage376.name = "UNDLM_00376bis";
        gradingSources[376] = gradedFootage376;
        gradingImportCount++;
        gradedImportSuccess376 = true;
        gradedFileName376 = "UNDLM_00376bis.mov";
        logImportSuccess(376, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00376bis.mov", gradedFileName376);
    } catch (e) {
        logImportError(376, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00376bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess376) {
    missingGradingCount++;
}

// Import plan GRADED 00377
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile377 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00377.mov");
var gradedFilePoignees377 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00377_AVEC_POIGNEES.mov");
var gradedFileBis377 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00377bis.mov");

var gradedImportSuccess377 = false;
var gradedFileName377 = "";

// Tenter import standard
if (gradedFile377.exists) {
    try {
        var gradedFootage377 = project.importFile(new ImportOptions(gradedFile377));
        gradedFootage377.parentFolder = fromGradingFolder;
        gradedFootage377.name = "UNDLM_00377";
        gradingSources[377] = gradedFootage377;
        gradingImportCount++;
        gradedImportSuccess377 = true;
        gradedFileName377 = "UNDLM_00377.mov";
        logImportSuccess(377, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00377.mov", gradedFileName377);
    } catch (e) {
        logImportError(377, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00377.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess377 && gradedFilePoignees377.exists) {
    try {
        var gradedFootage377 = project.importFile(new ImportOptions(gradedFilePoignees377));
        gradedFootage377.parentFolder = fromGradingFolder;
        gradedFootage377.name = "UNDLM_00377_AVEC_POIGNEES";
        gradingSources[377] = gradedFootage377;
        gradingImportCount++;
        gradedImportSuccess377 = true;
        gradedFileName377 = "UNDLM_00377_AVEC_POIGNEES.mov";
        logImportSuccess(377, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00377_AVEC_POIGNEES.mov", gradedFileName377);
    } catch (e) {
        logImportError(377, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00377_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess377 && gradedFileBis377.exists) {
    try {
        var gradedFootage377 = project.importFile(new ImportOptions(gradedFileBis377));
        gradedFootage377.parentFolder = fromGradingFolder;
        gradedFootage377.name = "UNDLM_00377bis";
        gradingSources[377] = gradedFootage377;
        gradingImportCount++;
        gradedImportSuccess377 = true;
        gradedFileName377 = "UNDLM_00377bis.mov";
        logImportSuccess(377, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00377bis.mov", gradedFileName377);
    } catch (e) {
        logImportError(377, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00377bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess377) {
    missingGradingCount++;
}

// Import plan GRADED 00378
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile378 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00378.mov");
var gradedFilePoignees378 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00378_AVEC_POIGNEES.mov");
var gradedFileBis378 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00378bis.mov");

var gradedImportSuccess378 = false;
var gradedFileName378 = "";

// Tenter import standard
if (gradedFile378.exists) {
    try {
        var gradedFootage378 = project.importFile(new ImportOptions(gradedFile378));
        gradedFootage378.parentFolder = fromGradingFolder;
        gradedFootage378.name = "UNDLM_00378";
        gradingSources[378] = gradedFootage378;
        gradingImportCount++;
        gradedImportSuccess378 = true;
        gradedFileName378 = "UNDLM_00378.mov";
        logImportSuccess(378, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00378.mov", gradedFileName378);
    } catch (e) {
        logImportError(378, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00378.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess378 && gradedFilePoignees378.exists) {
    try {
        var gradedFootage378 = project.importFile(new ImportOptions(gradedFilePoignees378));
        gradedFootage378.parentFolder = fromGradingFolder;
        gradedFootage378.name = "UNDLM_00378_AVEC_POIGNEES";
        gradingSources[378] = gradedFootage378;
        gradingImportCount++;
        gradedImportSuccess378 = true;
        gradedFileName378 = "UNDLM_00378_AVEC_POIGNEES.mov";
        logImportSuccess(378, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00378_AVEC_POIGNEES.mov", gradedFileName378);
    } catch (e) {
        logImportError(378, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00378_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess378 && gradedFileBis378.exists) {
    try {
        var gradedFootage378 = project.importFile(new ImportOptions(gradedFileBis378));
        gradedFootage378.parentFolder = fromGradingFolder;
        gradedFootage378.name = "UNDLM_00378bis";
        gradingSources[378] = gradedFootage378;
        gradingImportCount++;
        gradedImportSuccess378 = true;
        gradedFileName378 = "UNDLM_00378bis.mov";
        logImportSuccess(378, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00378bis.mov", gradedFileName378);
    } catch (e) {
        logImportError(378, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00378bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess378) {
    missingGradingCount++;
}

// Import plan GRADED 00379
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile379 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00379.mov");
var gradedFilePoignees379 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00379_AVEC_POIGNEES.mov");
var gradedFileBis379 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00379bis.mov");

var gradedImportSuccess379 = false;
var gradedFileName379 = "";

// Tenter import standard
if (gradedFile379.exists) {
    try {
        var gradedFootage379 = project.importFile(new ImportOptions(gradedFile379));
        gradedFootage379.parentFolder = fromGradingFolder;
        gradedFootage379.name = "UNDLM_00379";
        gradingSources[379] = gradedFootage379;
        gradingImportCount++;
        gradedImportSuccess379 = true;
        gradedFileName379 = "UNDLM_00379.mov";
        logImportSuccess(379, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00379.mov", gradedFileName379);
    } catch (e) {
        logImportError(379, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00379.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess379 && gradedFilePoignees379.exists) {
    try {
        var gradedFootage379 = project.importFile(new ImportOptions(gradedFilePoignees379));
        gradedFootage379.parentFolder = fromGradingFolder;
        gradedFootage379.name = "UNDLM_00379_AVEC_POIGNEES";
        gradingSources[379] = gradedFootage379;
        gradingImportCount++;
        gradedImportSuccess379 = true;
        gradedFileName379 = "UNDLM_00379_AVEC_POIGNEES.mov";
        logImportSuccess(379, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00379_AVEC_POIGNEES.mov", gradedFileName379);
    } catch (e) {
        logImportError(379, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00379_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess379 && gradedFileBis379.exists) {
    try {
        var gradedFootage379 = project.importFile(new ImportOptions(gradedFileBis379));
        gradedFootage379.parentFolder = fromGradingFolder;
        gradedFootage379.name = "UNDLM_00379bis";
        gradingSources[379] = gradedFootage379;
        gradingImportCount++;
        gradedImportSuccess379 = true;
        gradedFileName379 = "UNDLM_00379bis.mov";
        logImportSuccess(379, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00379bis.mov", gradedFileName379);
    } catch (e) {
        logImportError(379, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00379bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess379) {
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


// Composition pour plan 00347
var planComp347 = project.items.addComp(
    "SQ21_UNDLM_00347_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp347.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer347 = planComp347.layers.add(bgSolidComp);
bgLayer347.name = "BG_SOLID";
bgLayer347.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer347 = false;
if (gradingSources[347]) {
    var gradedLayer347 = planComp347.layers.add(gradingSources[347]);
    gradedLayer347.name = "UNDLM_00347_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer347.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer347.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer347 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer347 = false;
if (editSources[347]) {
    var editLayer347 = planComp347.layers.add(editSources[347]);
    editLayer347.name = "UNDLM_00347_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer347.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer347.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer347 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity347 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer347) {
    // EDIT toujours activé quand disponible
    editLayer347.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer347) {
        gradedLayer347.enabled = false;
    }
} else if (hasGradedLayer347) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer347.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText347 = planComp347.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText347.name = "WARNING_NO_EDIT";
    warningText347.property("Transform").property("Position").setValue([1280, 200]);
    warningText347.guideLayer = true;
    
    var warningTextDoc347 = warningText347.property("Source Text").value;
    warningTextDoc347.fontSize = 32;
    warningTextDoc347.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc347.font = "Arial-BoldMT";
    warningTextDoc347.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText347.property("Source Text").setValue(warningTextDoc347);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText347 = planComp347.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00347");
    errorText347.name = "ERROR_NO_SOURCE";
    errorText347.property("Transform").property("Position").setValue([1280, 720]);
    errorText347.guideLayer = true;
    
    var errorTextDoc347 = errorText347.property("Source Text").value;
    errorTextDoc347.fontSize = 48;
    errorTextDoc347.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc347.font = "Arial-BoldMT";
    errorTextDoc347.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText347.property("Source Text").setValue(errorTextDoc347);
}

planCompositions[347] = planComp347;


// Composition pour plan 00348
var planComp348 = project.items.addComp(
    "SQ21_UNDLM_00348_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp348.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer348 = planComp348.layers.add(bgSolidComp);
bgLayer348.name = "BG_SOLID";
bgLayer348.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer348 = false;
if (gradingSources[348]) {
    var gradedLayer348 = planComp348.layers.add(gradingSources[348]);
    gradedLayer348.name = "UNDLM_00348_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer348.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer348.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer348 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer348 = false;
if (editSources[348]) {
    var editLayer348 = planComp348.layers.add(editSources[348]);
    editLayer348.name = "UNDLM_00348_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer348.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer348.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer348 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity348 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer348) {
    // EDIT toujours activé quand disponible
    editLayer348.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer348) {
        gradedLayer348.enabled = false;
    }
} else if (hasGradedLayer348) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer348.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText348 = planComp348.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText348.name = "WARNING_NO_EDIT";
    warningText348.property("Transform").property("Position").setValue([1280, 200]);
    warningText348.guideLayer = true;
    
    var warningTextDoc348 = warningText348.property("Source Text").value;
    warningTextDoc348.fontSize = 32;
    warningTextDoc348.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc348.font = "Arial-BoldMT";
    warningTextDoc348.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText348.property("Source Text").setValue(warningTextDoc348);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText348 = planComp348.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00348");
    errorText348.name = "ERROR_NO_SOURCE";
    errorText348.property("Transform").property("Position").setValue([1280, 720]);
    errorText348.guideLayer = true;
    
    var errorTextDoc348 = errorText348.property("Source Text").value;
    errorTextDoc348.fontSize = 48;
    errorTextDoc348.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc348.font = "Arial-BoldMT";
    errorTextDoc348.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText348.property("Source Text").setValue(errorTextDoc348);
}

planCompositions[348] = planComp348;


// Composition pour plan 00349
var planComp349 = project.items.addComp(
    "SQ21_UNDLM_00349_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp349.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer349 = planComp349.layers.add(bgSolidComp);
bgLayer349.name = "BG_SOLID";
bgLayer349.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer349 = false;
if (gradingSources[349]) {
    var gradedLayer349 = planComp349.layers.add(gradingSources[349]);
    gradedLayer349.name = "UNDLM_00349_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer349.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer349.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer349 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer349 = false;
if (editSources[349]) {
    var editLayer349 = planComp349.layers.add(editSources[349]);
    editLayer349.name = "UNDLM_00349_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer349.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer349.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer349 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity349 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer349) {
    // EDIT toujours activé quand disponible
    editLayer349.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer349) {
        gradedLayer349.enabled = false;
    }
} else if (hasGradedLayer349) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer349.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText349 = planComp349.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText349.name = "WARNING_NO_EDIT";
    warningText349.property("Transform").property("Position").setValue([1280, 200]);
    warningText349.guideLayer = true;
    
    var warningTextDoc349 = warningText349.property("Source Text").value;
    warningTextDoc349.fontSize = 32;
    warningTextDoc349.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc349.font = "Arial-BoldMT";
    warningTextDoc349.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText349.property("Source Text").setValue(warningTextDoc349);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText349 = planComp349.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00349");
    errorText349.name = "ERROR_NO_SOURCE";
    errorText349.property("Transform").property("Position").setValue([1280, 720]);
    errorText349.guideLayer = true;
    
    var errorTextDoc349 = errorText349.property("Source Text").value;
    errorTextDoc349.fontSize = 48;
    errorTextDoc349.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc349.font = "Arial-BoldMT";
    errorTextDoc349.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText349.property("Source Text").setValue(errorTextDoc349);
}

planCompositions[349] = planComp349;


// Composition pour plan 00350
var planComp350 = project.items.addComp(
    "SQ21_UNDLM_00350_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp350.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer350 = planComp350.layers.add(bgSolidComp);
bgLayer350.name = "BG_SOLID";
bgLayer350.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer350 = false;
if (gradingSources[350]) {
    var gradedLayer350 = planComp350.layers.add(gradingSources[350]);
    gradedLayer350.name = "UNDLM_00350_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer350.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer350.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer350 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer350 = false;
if (editSources[350]) {
    var editLayer350 = planComp350.layers.add(editSources[350]);
    editLayer350.name = "UNDLM_00350_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer350.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer350.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer350 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity350 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer350) {
    // EDIT toujours activé quand disponible
    editLayer350.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer350) {
        gradedLayer350.enabled = false;
    }
} else if (hasGradedLayer350) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer350.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText350 = planComp350.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText350.name = "WARNING_NO_EDIT";
    warningText350.property("Transform").property("Position").setValue([1280, 200]);
    warningText350.guideLayer = true;
    
    var warningTextDoc350 = warningText350.property("Source Text").value;
    warningTextDoc350.fontSize = 32;
    warningTextDoc350.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc350.font = "Arial-BoldMT";
    warningTextDoc350.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText350.property("Source Text").setValue(warningTextDoc350);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText350 = planComp350.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00350");
    errorText350.name = "ERROR_NO_SOURCE";
    errorText350.property("Transform").property("Position").setValue([1280, 720]);
    errorText350.guideLayer = true;
    
    var errorTextDoc350 = errorText350.property("Source Text").value;
    errorTextDoc350.fontSize = 48;
    errorTextDoc350.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc350.font = "Arial-BoldMT";
    errorTextDoc350.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText350.property("Source Text").setValue(errorTextDoc350);
}

planCompositions[350] = planComp350;


// Composition pour plan 00351
var planComp351 = project.items.addComp(
    "SQ21_UNDLM_00351_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp351.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer351 = planComp351.layers.add(bgSolidComp);
bgLayer351.name = "BG_SOLID";
bgLayer351.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer351 = false;
if (gradingSources[351]) {
    var gradedLayer351 = planComp351.layers.add(gradingSources[351]);
    gradedLayer351.name = "UNDLM_00351_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer351.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer351.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer351 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer351 = false;
if (editSources[351]) {
    var editLayer351 = planComp351.layers.add(editSources[351]);
    editLayer351.name = "UNDLM_00351_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer351.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer351.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer351 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity351 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer351) {
    // EDIT toujours activé quand disponible
    editLayer351.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer351) {
        gradedLayer351.enabled = false;
    }
} else if (hasGradedLayer351) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer351.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText351 = planComp351.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText351.name = "WARNING_NO_EDIT";
    warningText351.property("Transform").property("Position").setValue([1280, 200]);
    warningText351.guideLayer = true;
    
    var warningTextDoc351 = warningText351.property("Source Text").value;
    warningTextDoc351.fontSize = 32;
    warningTextDoc351.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc351.font = "Arial-BoldMT";
    warningTextDoc351.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText351.property("Source Text").setValue(warningTextDoc351);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText351 = planComp351.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00351");
    errorText351.name = "ERROR_NO_SOURCE";
    errorText351.property("Transform").property("Position").setValue([1280, 720]);
    errorText351.guideLayer = true;
    
    var errorTextDoc351 = errorText351.property("Source Text").value;
    errorTextDoc351.fontSize = 48;
    errorTextDoc351.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc351.font = "Arial-BoldMT";
    errorTextDoc351.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText351.property("Source Text").setValue(errorTextDoc351);
}

planCompositions[351] = planComp351;


// Composition pour plan 00352
var planComp352 = project.items.addComp(
    "SQ21_UNDLM_00352_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.32,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp352.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer352 = planComp352.layers.add(bgSolidComp);
bgLayer352.name = "BG_SOLID";
bgLayer352.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer352 = false;
if (gradingSources[352]) {
    var gradedLayer352 = planComp352.layers.add(gradingSources[352]);
    gradedLayer352.name = "UNDLM_00352_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer352.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer352.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer352 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer352 = false;
if (editSources[352]) {
    var editLayer352 = planComp352.layers.add(editSources[352]);
    editLayer352.name = "UNDLM_00352_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer352.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer352.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer352 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity352 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer352) {
    // EDIT toujours activé quand disponible
    editLayer352.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer352) {
        gradedLayer352.enabled = false;
    }
} else if (hasGradedLayer352) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer352.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText352 = planComp352.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText352.name = "WARNING_NO_EDIT";
    warningText352.property("Transform").property("Position").setValue([1280, 200]);
    warningText352.guideLayer = true;
    
    var warningTextDoc352 = warningText352.property("Source Text").value;
    warningTextDoc352.fontSize = 32;
    warningTextDoc352.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc352.font = "Arial-BoldMT";
    warningTextDoc352.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText352.property("Source Text").setValue(warningTextDoc352);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText352 = planComp352.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00352");
    errorText352.name = "ERROR_NO_SOURCE";
    errorText352.property("Transform").property("Position").setValue([1280, 720]);
    errorText352.guideLayer = true;
    
    var errorTextDoc352 = errorText352.property("Source Text").value;
    errorTextDoc352.fontSize = 48;
    errorTextDoc352.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc352.font = "Arial-BoldMT";
    errorTextDoc352.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText352.property("Source Text").setValue(errorTextDoc352);
}

planCompositions[352] = planComp352;


// Composition pour plan 00353
var planComp353 = project.items.addComp(
    "SQ21_UNDLM_00353_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp353.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer353 = planComp353.layers.add(bgSolidComp);
bgLayer353.name = "BG_SOLID";
bgLayer353.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer353 = false;
if (gradingSources[353]) {
    var gradedLayer353 = planComp353.layers.add(gradingSources[353]);
    gradedLayer353.name = "UNDLM_00353_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer353.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer353.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer353 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer353 = false;
if (editSources[353]) {
    var editLayer353 = planComp353.layers.add(editSources[353]);
    editLayer353.name = "UNDLM_00353_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer353.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer353.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer353 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity353 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer353) {
    // EDIT toujours activé quand disponible
    editLayer353.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer353) {
        gradedLayer353.enabled = false;
    }
} else if (hasGradedLayer353) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer353.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText353 = planComp353.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText353.name = "WARNING_NO_EDIT";
    warningText353.property("Transform").property("Position").setValue([1280, 200]);
    warningText353.guideLayer = true;
    
    var warningTextDoc353 = warningText353.property("Source Text").value;
    warningTextDoc353.fontSize = 32;
    warningTextDoc353.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc353.font = "Arial-BoldMT";
    warningTextDoc353.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText353.property("Source Text").setValue(warningTextDoc353);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText353 = planComp353.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00353");
    errorText353.name = "ERROR_NO_SOURCE";
    errorText353.property("Transform").property("Position").setValue([1280, 720]);
    errorText353.guideLayer = true;
    
    var errorTextDoc353 = errorText353.property("Source Text").value;
    errorTextDoc353.fontSize = 48;
    errorTextDoc353.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc353.font = "Arial-BoldMT";
    errorTextDoc353.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText353.property("Source Text").setValue(errorTextDoc353);
}

planCompositions[353] = planComp353;


// Composition pour plan 00354
var planComp354 = project.items.addComp(
    "SQ21_UNDLM_00354_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.56,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp354.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer354 = planComp354.layers.add(bgSolidComp);
bgLayer354.name = "BG_SOLID";
bgLayer354.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer354 = false;
if (gradingSources[354]) {
    var gradedLayer354 = planComp354.layers.add(gradingSources[354]);
    gradedLayer354.name = "UNDLM_00354_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer354.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer354.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer354 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer354 = false;
if (editSources[354]) {
    var editLayer354 = planComp354.layers.add(editSources[354]);
    editLayer354.name = "UNDLM_00354_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer354.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer354.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer354 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity354 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer354) {
    // EDIT toujours activé quand disponible
    editLayer354.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer354) {
        gradedLayer354.enabled = false;
    }
} else if (hasGradedLayer354) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer354.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText354 = planComp354.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText354.name = "WARNING_NO_EDIT";
    warningText354.property("Transform").property("Position").setValue([1280, 200]);
    warningText354.guideLayer = true;
    
    var warningTextDoc354 = warningText354.property("Source Text").value;
    warningTextDoc354.fontSize = 32;
    warningTextDoc354.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc354.font = "Arial-BoldMT";
    warningTextDoc354.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText354.property("Source Text").setValue(warningTextDoc354);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText354 = planComp354.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00354");
    errorText354.name = "ERROR_NO_SOURCE";
    errorText354.property("Transform").property("Position").setValue([1280, 720]);
    errorText354.guideLayer = true;
    
    var errorTextDoc354 = errorText354.property("Source Text").value;
    errorTextDoc354.fontSize = 48;
    errorTextDoc354.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc354.font = "Arial-BoldMT";
    errorTextDoc354.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText354.property("Source Text").setValue(errorTextDoc354);
}

planCompositions[354] = planComp354;


// Composition pour plan 00355
var planComp355 = project.items.addComp(
    "SQ21_UNDLM_00355_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp355.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer355 = planComp355.layers.add(bgSolidComp);
bgLayer355.name = "BG_SOLID";
bgLayer355.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer355 = false;
if (gradingSources[355]) {
    var gradedLayer355 = planComp355.layers.add(gradingSources[355]);
    gradedLayer355.name = "UNDLM_00355_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer355.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer355.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer355 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer355 = false;
if (editSources[355]) {
    var editLayer355 = planComp355.layers.add(editSources[355]);
    editLayer355.name = "UNDLM_00355_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer355.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer355.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer355 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity355 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer355) {
    // EDIT toujours activé quand disponible
    editLayer355.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer355) {
        gradedLayer355.enabled = false;
    }
} else if (hasGradedLayer355) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer355.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText355 = planComp355.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText355.name = "WARNING_NO_EDIT";
    warningText355.property("Transform").property("Position").setValue([1280, 200]);
    warningText355.guideLayer = true;
    
    var warningTextDoc355 = warningText355.property("Source Text").value;
    warningTextDoc355.fontSize = 32;
    warningTextDoc355.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc355.font = "Arial-BoldMT";
    warningTextDoc355.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText355.property("Source Text").setValue(warningTextDoc355);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText355 = planComp355.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00355");
    errorText355.name = "ERROR_NO_SOURCE";
    errorText355.property("Transform").property("Position").setValue([1280, 720]);
    errorText355.guideLayer = true;
    
    var errorTextDoc355 = errorText355.property("Source Text").value;
    errorTextDoc355.fontSize = 48;
    errorTextDoc355.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc355.font = "Arial-BoldMT";
    errorTextDoc355.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText355.property("Source Text").setValue(errorTextDoc355);
}

planCompositions[355] = planComp355;


// Composition pour plan 00356
var planComp356 = project.items.addComp(
    "SQ21_UNDLM_00356_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.7199999999999998,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp356.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer356 = planComp356.layers.add(bgSolidComp);
bgLayer356.name = "BG_SOLID";
bgLayer356.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer356 = false;
if (gradingSources[356]) {
    var gradedLayer356 = planComp356.layers.add(gradingSources[356]);
    gradedLayer356.name = "UNDLM_00356_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer356.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer356.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer356 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer356 = false;
if (editSources[356]) {
    var editLayer356 = planComp356.layers.add(editSources[356]);
    editLayer356.name = "UNDLM_00356_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer356.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer356.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer356 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity356 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer356) {
    // EDIT toujours activé quand disponible
    editLayer356.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer356) {
        gradedLayer356.enabled = false;
    }
} else if (hasGradedLayer356) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer356.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText356 = planComp356.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText356.name = "WARNING_NO_EDIT";
    warningText356.property("Transform").property("Position").setValue([1280, 200]);
    warningText356.guideLayer = true;
    
    var warningTextDoc356 = warningText356.property("Source Text").value;
    warningTextDoc356.fontSize = 32;
    warningTextDoc356.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc356.font = "Arial-BoldMT";
    warningTextDoc356.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText356.property("Source Text").setValue(warningTextDoc356);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText356 = planComp356.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00356");
    errorText356.name = "ERROR_NO_SOURCE";
    errorText356.property("Transform").property("Position").setValue([1280, 720]);
    errorText356.guideLayer = true;
    
    var errorTextDoc356 = errorText356.property("Source Text").value;
    errorTextDoc356.fontSize = 48;
    errorTextDoc356.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc356.font = "Arial-BoldMT";
    errorTextDoc356.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText356.property("Source Text").setValue(errorTextDoc356);
}

planCompositions[356] = planComp356;


// Composition pour plan 00357
var planComp357 = project.items.addComp(
    "SQ21_UNDLM_00357_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp357.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer357 = planComp357.layers.add(bgSolidComp);
bgLayer357.name = "BG_SOLID";
bgLayer357.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer357 = false;
if (gradingSources[357]) {
    var gradedLayer357 = planComp357.layers.add(gradingSources[357]);
    gradedLayer357.name = "UNDLM_00357_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer357.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer357.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer357 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer357 = false;
if (editSources[357]) {
    var editLayer357 = planComp357.layers.add(editSources[357]);
    editLayer357.name = "UNDLM_00357_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer357.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer357.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer357 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity357 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer357) {
    // EDIT toujours activé quand disponible
    editLayer357.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer357) {
        gradedLayer357.enabled = false;
    }
} else if (hasGradedLayer357) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer357.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText357 = planComp357.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText357.name = "WARNING_NO_EDIT";
    warningText357.property("Transform").property("Position").setValue([1280, 200]);
    warningText357.guideLayer = true;
    
    var warningTextDoc357 = warningText357.property("Source Text").value;
    warningTextDoc357.fontSize = 32;
    warningTextDoc357.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc357.font = "Arial-BoldMT";
    warningTextDoc357.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText357.property("Source Text").setValue(warningTextDoc357);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText357 = planComp357.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00357");
    errorText357.name = "ERROR_NO_SOURCE";
    errorText357.property("Transform").property("Position").setValue([1280, 720]);
    errorText357.guideLayer = true;
    
    var errorTextDoc357 = errorText357.property("Source Text").value;
    errorTextDoc357.fontSize = 48;
    errorTextDoc357.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc357.font = "Arial-BoldMT";
    errorTextDoc357.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText357.property("Source Text").setValue(errorTextDoc357);
}

planCompositions[357] = planComp357;


// Composition pour plan 00358
var planComp358 = project.items.addComp(
    "SQ21_UNDLM_00358_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp358.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer358 = planComp358.layers.add(bgSolidComp);
bgLayer358.name = "BG_SOLID";
bgLayer358.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer358 = false;
if (gradingSources[358]) {
    var gradedLayer358 = planComp358.layers.add(gradingSources[358]);
    gradedLayer358.name = "UNDLM_00358_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer358.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer358.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer358 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer358 = false;
if (editSources[358]) {
    var editLayer358 = planComp358.layers.add(editSources[358]);
    editLayer358.name = "UNDLM_00358_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer358.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer358.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer358 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity358 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer358) {
    // EDIT toujours activé quand disponible
    editLayer358.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer358) {
        gradedLayer358.enabled = false;
    }
} else if (hasGradedLayer358) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer358.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText358 = planComp358.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText358.name = "WARNING_NO_EDIT";
    warningText358.property("Transform").property("Position").setValue([1280, 200]);
    warningText358.guideLayer = true;
    
    var warningTextDoc358 = warningText358.property("Source Text").value;
    warningTextDoc358.fontSize = 32;
    warningTextDoc358.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc358.font = "Arial-BoldMT";
    warningTextDoc358.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText358.property("Source Text").setValue(warningTextDoc358);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText358 = planComp358.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00358");
    errorText358.name = "ERROR_NO_SOURCE";
    errorText358.property("Transform").property("Position").setValue([1280, 720]);
    errorText358.guideLayer = true;
    
    var errorTextDoc358 = errorText358.property("Source Text").value;
    errorTextDoc358.fontSize = 48;
    errorTextDoc358.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc358.font = "Arial-BoldMT";
    errorTextDoc358.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText358.property("Source Text").setValue(errorTextDoc358);
}

planCompositions[358] = planComp358;


// Composition pour plan 00359
var planComp359 = project.items.addComp(
    "SQ21_UNDLM_00359_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp359.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer359 = planComp359.layers.add(bgSolidComp);
bgLayer359.name = "BG_SOLID";
bgLayer359.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer359 = false;
if (gradingSources[359]) {
    var gradedLayer359 = planComp359.layers.add(gradingSources[359]);
    gradedLayer359.name = "UNDLM_00359_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer359.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer359.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer359 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer359 = false;
if (editSources[359]) {
    var editLayer359 = planComp359.layers.add(editSources[359]);
    editLayer359.name = "UNDLM_00359_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer359.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer359.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer359 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity359 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer359) {
    // EDIT toujours activé quand disponible
    editLayer359.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer359) {
        gradedLayer359.enabled = false;
    }
} else if (hasGradedLayer359) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer359.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText359 = planComp359.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText359.name = "WARNING_NO_EDIT";
    warningText359.property("Transform").property("Position").setValue([1280, 200]);
    warningText359.guideLayer = true;
    
    var warningTextDoc359 = warningText359.property("Source Text").value;
    warningTextDoc359.fontSize = 32;
    warningTextDoc359.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc359.font = "Arial-BoldMT";
    warningTextDoc359.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText359.property("Source Text").setValue(warningTextDoc359);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText359 = planComp359.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00359");
    errorText359.name = "ERROR_NO_SOURCE";
    errorText359.property("Transform").property("Position").setValue([1280, 720]);
    errorText359.guideLayer = true;
    
    var errorTextDoc359 = errorText359.property("Source Text").value;
    errorTextDoc359.fontSize = 48;
    errorTextDoc359.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc359.font = "Arial-BoldMT";
    errorTextDoc359.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText359.property("Source Text").setValue(errorTextDoc359);
}

planCompositions[359] = planComp359;


// Composition pour plan 00360
var planComp360 = project.items.addComp(
    "SQ21_UNDLM_00360_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp360.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer360 = planComp360.layers.add(bgSolidComp);
bgLayer360.name = "BG_SOLID";
bgLayer360.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer360 = false;
if (gradingSources[360]) {
    var gradedLayer360 = planComp360.layers.add(gradingSources[360]);
    gradedLayer360.name = "UNDLM_00360_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer360.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer360.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer360 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer360 = false;
if (editSources[360]) {
    var editLayer360 = planComp360.layers.add(editSources[360]);
    editLayer360.name = "UNDLM_00360_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer360.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer360.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer360 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity360 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer360) {
    // EDIT toujours activé quand disponible
    editLayer360.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer360) {
        gradedLayer360.enabled = false;
    }
} else if (hasGradedLayer360) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer360.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText360 = planComp360.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText360.name = "WARNING_NO_EDIT";
    warningText360.property("Transform").property("Position").setValue([1280, 200]);
    warningText360.guideLayer = true;
    
    var warningTextDoc360 = warningText360.property("Source Text").value;
    warningTextDoc360.fontSize = 32;
    warningTextDoc360.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc360.font = "Arial-BoldMT";
    warningTextDoc360.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText360.property("Source Text").setValue(warningTextDoc360);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText360 = planComp360.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00360");
    errorText360.name = "ERROR_NO_SOURCE";
    errorText360.property("Transform").property("Position").setValue([1280, 720]);
    errorText360.guideLayer = true;
    
    var errorTextDoc360 = errorText360.property("Source Text").value;
    errorTextDoc360.fontSize = 48;
    errorTextDoc360.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc360.font = "Arial-BoldMT";
    errorTextDoc360.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText360.property("Source Text").setValue(errorTextDoc360);
}

planCompositions[360] = planComp360;


// Composition pour plan 00361
var planComp361 = project.items.addComp(
    "SQ21_UNDLM_00361_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp361.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer361 = planComp361.layers.add(bgSolidComp);
bgLayer361.name = "BG_SOLID";
bgLayer361.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer361 = false;
if (gradingSources[361]) {
    var gradedLayer361 = planComp361.layers.add(gradingSources[361]);
    gradedLayer361.name = "UNDLM_00361_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer361.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer361.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer361 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer361 = false;
if (editSources[361]) {
    var editLayer361 = planComp361.layers.add(editSources[361]);
    editLayer361.name = "UNDLM_00361_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer361.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer361.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer361 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity361 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer361) {
    // EDIT toujours activé quand disponible
    editLayer361.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer361) {
        gradedLayer361.enabled = false;
    }
} else if (hasGradedLayer361) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer361.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText361 = planComp361.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText361.name = "WARNING_NO_EDIT";
    warningText361.property("Transform").property("Position").setValue([1280, 200]);
    warningText361.guideLayer = true;
    
    var warningTextDoc361 = warningText361.property("Source Text").value;
    warningTextDoc361.fontSize = 32;
    warningTextDoc361.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc361.font = "Arial-BoldMT";
    warningTextDoc361.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText361.property("Source Text").setValue(warningTextDoc361);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText361 = planComp361.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00361");
    errorText361.name = "ERROR_NO_SOURCE";
    errorText361.property("Transform").property("Position").setValue([1280, 720]);
    errorText361.guideLayer = true;
    
    var errorTextDoc361 = errorText361.property("Source Text").value;
    errorTextDoc361.fontSize = 48;
    errorTextDoc361.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc361.font = "Arial-BoldMT";
    errorTextDoc361.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText361.property("Source Text").setValue(errorTextDoc361);
}

planCompositions[361] = planComp361;


// Composition pour plan 00362
var planComp362 = project.items.addComp(
    "SQ21_UNDLM_00362_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp362.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer362 = planComp362.layers.add(bgSolidComp);
bgLayer362.name = "BG_SOLID";
bgLayer362.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer362 = false;
if (gradingSources[362]) {
    var gradedLayer362 = planComp362.layers.add(gradingSources[362]);
    gradedLayer362.name = "UNDLM_00362_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer362.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer362.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer362 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer362 = false;
if (editSources[362]) {
    var editLayer362 = planComp362.layers.add(editSources[362]);
    editLayer362.name = "UNDLM_00362_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer362.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer362.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer362 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity362 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer362) {
    // EDIT toujours activé quand disponible
    editLayer362.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer362) {
        gradedLayer362.enabled = false;
    }
} else if (hasGradedLayer362) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer362.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText362 = planComp362.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText362.name = "WARNING_NO_EDIT";
    warningText362.property("Transform").property("Position").setValue([1280, 200]);
    warningText362.guideLayer = true;
    
    var warningTextDoc362 = warningText362.property("Source Text").value;
    warningTextDoc362.fontSize = 32;
    warningTextDoc362.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc362.font = "Arial-BoldMT";
    warningTextDoc362.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText362.property("Source Text").setValue(warningTextDoc362);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText362 = planComp362.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00362");
    errorText362.name = "ERROR_NO_SOURCE";
    errorText362.property("Transform").property("Position").setValue([1280, 720]);
    errorText362.guideLayer = true;
    
    var errorTextDoc362 = errorText362.property("Source Text").value;
    errorTextDoc362.fontSize = 48;
    errorTextDoc362.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc362.font = "Arial-BoldMT";
    errorTextDoc362.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText362.property("Source Text").setValue(errorTextDoc362);
}

planCompositions[362] = planComp362;


// Composition pour plan 00363
var planComp363 = project.items.addComp(
    "SQ21_UNDLM_00363_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.7199999999999998,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp363.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer363 = planComp363.layers.add(bgSolidComp);
bgLayer363.name = "BG_SOLID";
bgLayer363.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer363 = false;
if (gradingSources[363]) {
    var gradedLayer363 = planComp363.layers.add(gradingSources[363]);
    gradedLayer363.name = "UNDLM_00363_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer363.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer363.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer363 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer363 = false;
if (editSources[363]) {
    var editLayer363 = planComp363.layers.add(editSources[363]);
    editLayer363.name = "UNDLM_00363_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer363.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer363.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer363 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity363 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer363) {
    // EDIT toujours activé quand disponible
    editLayer363.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer363) {
        gradedLayer363.enabled = false;
    }
} else if (hasGradedLayer363) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer363.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText363 = planComp363.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText363.name = "WARNING_NO_EDIT";
    warningText363.property("Transform").property("Position").setValue([1280, 200]);
    warningText363.guideLayer = true;
    
    var warningTextDoc363 = warningText363.property("Source Text").value;
    warningTextDoc363.fontSize = 32;
    warningTextDoc363.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc363.font = "Arial-BoldMT";
    warningTextDoc363.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText363.property("Source Text").setValue(warningTextDoc363);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText363 = planComp363.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00363");
    errorText363.name = "ERROR_NO_SOURCE";
    errorText363.property("Transform").property("Position").setValue([1280, 720]);
    errorText363.guideLayer = true;
    
    var errorTextDoc363 = errorText363.property("Source Text").value;
    errorTextDoc363.fontSize = 48;
    errorTextDoc363.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc363.font = "Arial-BoldMT";
    errorTextDoc363.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText363.property("Source Text").setValue(errorTextDoc363);
}

planCompositions[363] = planComp363;


// Composition pour plan 00364
var planComp364 = project.items.addComp(
    "SQ21_UNDLM_00364_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp364.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer364 = planComp364.layers.add(bgSolidComp);
bgLayer364.name = "BG_SOLID";
bgLayer364.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer364 = false;
if (gradingSources[364]) {
    var gradedLayer364 = planComp364.layers.add(gradingSources[364]);
    gradedLayer364.name = "UNDLM_00364_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer364.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer364.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer364 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer364 = false;
if (editSources[364]) {
    var editLayer364 = planComp364.layers.add(editSources[364]);
    editLayer364.name = "UNDLM_00364_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer364.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer364.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer364 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity364 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer364) {
    // EDIT toujours activé quand disponible
    editLayer364.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer364) {
        gradedLayer364.enabled = false;
    }
} else if (hasGradedLayer364) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer364.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText364 = planComp364.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText364.name = "WARNING_NO_EDIT";
    warningText364.property("Transform").property("Position").setValue([1280, 200]);
    warningText364.guideLayer = true;
    
    var warningTextDoc364 = warningText364.property("Source Text").value;
    warningTextDoc364.fontSize = 32;
    warningTextDoc364.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc364.font = "Arial-BoldMT";
    warningTextDoc364.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText364.property("Source Text").setValue(warningTextDoc364);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText364 = planComp364.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00364");
    errorText364.name = "ERROR_NO_SOURCE";
    errorText364.property("Transform").property("Position").setValue([1280, 720]);
    errorText364.guideLayer = true;
    
    var errorTextDoc364 = errorText364.property("Source Text").value;
    errorTextDoc364.fontSize = 48;
    errorTextDoc364.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc364.font = "Arial-BoldMT";
    errorTextDoc364.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText364.property("Source Text").setValue(errorTextDoc364);
}

planCompositions[364] = planComp364;


// Composition pour plan 00365
var planComp365 = project.items.addComp(
    "SQ21_UNDLM_00365_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp365.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer365 = planComp365.layers.add(bgSolidComp);
bgLayer365.name = "BG_SOLID";
bgLayer365.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer365 = false;
if (gradingSources[365]) {
    var gradedLayer365 = planComp365.layers.add(gradingSources[365]);
    gradedLayer365.name = "UNDLM_00365_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer365.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer365.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer365 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer365 = false;
if (editSources[365]) {
    var editLayer365 = planComp365.layers.add(editSources[365]);
    editLayer365.name = "UNDLM_00365_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer365.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer365.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer365 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity365 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer365) {
    // EDIT toujours activé quand disponible
    editLayer365.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer365) {
        gradedLayer365.enabled = false;
    }
} else if (hasGradedLayer365) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer365.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText365 = planComp365.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText365.name = "WARNING_NO_EDIT";
    warningText365.property("Transform").property("Position").setValue([1280, 200]);
    warningText365.guideLayer = true;
    
    var warningTextDoc365 = warningText365.property("Source Text").value;
    warningTextDoc365.fontSize = 32;
    warningTextDoc365.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc365.font = "Arial-BoldMT";
    warningTextDoc365.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText365.property("Source Text").setValue(warningTextDoc365);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText365 = planComp365.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00365");
    errorText365.name = "ERROR_NO_SOURCE";
    errorText365.property("Transform").property("Position").setValue([1280, 720]);
    errorText365.guideLayer = true;
    
    var errorTextDoc365 = errorText365.property("Source Text").value;
    errorTextDoc365.fontSize = 48;
    errorTextDoc365.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc365.font = "Arial-BoldMT";
    errorTextDoc365.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText365.property("Source Text").setValue(errorTextDoc365);
}

planCompositions[365] = planComp365;


// Composition pour plan 00366
var planComp366 = project.items.addComp(
    "SQ21_UNDLM_00366_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp366.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer366 = planComp366.layers.add(bgSolidComp);
bgLayer366.name = "BG_SOLID";
bgLayer366.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer366 = false;
if (gradingSources[366]) {
    var gradedLayer366 = planComp366.layers.add(gradingSources[366]);
    gradedLayer366.name = "UNDLM_00366_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer366.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer366.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer366 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer366 = false;
if (editSources[366]) {
    var editLayer366 = planComp366.layers.add(editSources[366]);
    editLayer366.name = "UNDLM_00366_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer366.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer366.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer366 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity366 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer366) {
    // EDIT toujours activé quand disponible
    editLayer366.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer366) {
        gradedLayer366.enabled = false;
    }
} else if (hasGradedLayer366) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer366.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText366 = planComp366.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText366.name = "WARNING_NO_EDIT";
    warningText366.property("Transform").property("Position").setValue([1280, 200]);
    warningText366.guideLayer = true;
    
    var warningTextDoc366 = warningText366.property("Source Text").value;
    warningTextDoc366.fontSize = 32;
    warningTextDoc366.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc366.font = "Arial-BoldMT";
    warningTextDoc366.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText366.property("Source Text").setValue(warningTextDoc366);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText366 = planComp366.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00366");
    errorText366.name = "ERROR_NO_SOURCE";
    errorText366.property("Transform").property("Position").setValue([1280, 720]);
    errorText366.guideLayer = true;
    
    var errorTextDoc366 = errorText366.property("Source Text").value;
    errorTextDoc366.fontSize = 48;
    errorTextDoc366.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc366.font = "Arial-BoldMT";
    errorTextDoc366.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText366.property("Source Text").setValue(errorTextDoc366);
}

planCompositions[366] = planComp366;


// Composition pour plan 00367
var planComp367 = project.items.addComp(
    "SQ21_UNDLM_00367_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp367.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer367 = planComp367.layers.add(bgSolidComp);
bgLayer367.name = "BG_SOLID";
bgLayer367.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer367 = false;
if (gradingSources[367]) {
    var gradedLayer367 = planComp367.layers.add(gradingSources[367]);
    gradedLayer367.name = "UNDLM_00367_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer367.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer367.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer367 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer367 = false;
if (editSources[367]) {
    var editLayer367 = planComp367.layers.add(editSources[367]);
    editLayer367.name = "UNDLM_00367_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer367.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer367.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer367 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity367 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer367) {
    // EDIT toujours activé quand disponible
    editLayer367.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer367) {
        gradedLayer367.enabled = false;
    }
} else if (hasGradedLayer367) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer367.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText367 = planComp367.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText367.name = "WARNING_NO_EDIT";
    warningText367.property("Transform").property("Position").setValue([1280, 200]);
    warningText367.guideLayer = true;
    
    var warningTextDoc367 = warningText367.property("Source Text").value;
    warningTextDoc367.fontSize = 32;
    warningTextDoc367.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc367.font = "Arial-BoldMT";
    warningTextDoc367.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText367.property("Source Text").setValue(warningTextDoc367);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText367 = planComp367.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00367");
    errorText367.name = "ERROR_NO_SOURCE";
    errorText367.property("Transform").property("Position").setValue([1280, 720]);
    errorText367.guideLayer = true;
    
    var errorTextDoc367 = errorText367.property("Source Text").value;
    errorTextDoc367.fontSize = 48;
    errorTextDoc367.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc367.font = "Arial-BoldMT";
    errorTextDoc367.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText367.property("Source Text").setValue(errorTextDoc367);
}

planCompositions[367] = planComp367;


// Composition pour plan 00368
var planComp368 = project.items.addComp(
    "SQ21_UNDLM_00368_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp368.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer368 = planComp368.layers.add(bgSolidComp);
bgLayer368.name = "BG_SOLID";
bgLayer368.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer368 = false;
if (gradingSources[368]) {
    var gradedLayer368 = planComp368.layers.add(gradingSources[368]);
    gradedLayer368.name = "UNDLM_00368_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer368.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer368.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer368 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer368 = false;
if (editSources[368]) {
    var editLayer368 = planComp368.layers.add(editSources[368]);
    editLayer368.name = "UNDLM_00368_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer368.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer368.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer368 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity368 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer368) {
    // EDIT toujours activé quand disponible
    editLayer368.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer368) {
        gradedLayer368.enabled = false;
    }
} else if (hasGradedLayer368) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer368.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText368 = planComp368.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText368.name = "WARNING_NO_EDIT";
    warningText368.property("Transform").property("Position").setValue([1280, 200]);
    warningText368.guideLayer = true;
    
    var warningTextDoc368 = warningText368.property("Source Text").value;
    warningTextDoc368.fontSize = 32;
    warningTextDoc368.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc368.font = "Arial-BoldMT";
    warningTextDoc368.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText368.property("Source Text").setValue(warningTextDoc368);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText368 = planComp368.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00368");
    errorText368.name = "ERROR_NO_SOURCE";
    errorText368.property("Transform").property("Position").setValue([1280, 720]);
    errorText368.guideLayer = true;
    
    var errorTextDoc368 = errorText368.property("Source Text").value;
    errorTextDoc368.fontSize = 48;
    errorTextDoc368.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc368.font = "Arial-BoldMT";
    errorTextDoc368.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText368.property("Source Text").setValue(errorTextDoc368);
}

planCompositions[368] = planComp368;


// Composition pour plan 00369
var planComp369 = project.items.addComp(
    "SQ21_UNDLM_00369_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp369.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer369 = planComp369.layers.add(bgSolidComp);
bgLayer369.name = "BG_SOLID";
bgLayer369.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer369 = false;
if (gradingSources[369]) {
    var gradedLayer369 = planComp369.layers.add(gradingSources[369]);
    gradedLayer369.name = "UNDLM_00369_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer369.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer369.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer369 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer369 = false;
if (editSources[369]) {
    var editLayer369 = planComp369.layers.add(editSources[369]);
    editLayer369.name = "UNDLM_00369_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer369.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer369.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer369 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity369 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer369) {
    // EDIT toujours activé quand disponible
    editLayer369.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer369) {
        gradedLayer369.enabled = false;
    }
} else if (hasGradedLayer369) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer369.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText369 = planComp369.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText369.name = "WARNING_NO_EDIT";
    warningText369.property("Transform").property("Position").setValue([1280, 200]);
    warningText369.guideLayer = true;
    
    var warningTextDoc369 = warningText369.property("Source Text").value;
    warningTextDoc369.fontSize = 32;
    warningTextDoc369.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc369.font = "Arial-BoldMT";
    warningTextDoc369.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText369.property("Source Text").setValue(warningTextDoc369);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText369 = planComp369.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00369");
    errorText369.name = "ERROR_NO_SOURCE";
    errorText369.property("Transform").property("Position").setValue([1280, 720]);
    errorText369.guideLayer = true;
    
    var errorTextDoc369 = errorText369.property("Source Text").value;
    errorTextDoc369.fontSize = 48;
    errorTextDoc369.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc369.font = "Arial-BoldMT";
    errorTextDoc369.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText369.property("Source Text").setValue(errorTextDoc369);
}

planCompositions[369] = planComp369;


// Composition pour plan 00370
var planComp370 = project.items.addComp(
    "SQ21_UNDLM_00370_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp370.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer370 = planComp370.layers.add(bgSolidComp);
bgLayer370.name = "BG_SOLID";
bgLayer370.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer370 = false;
if (gradingSources[370]) {
    var gradedLayer370 = planComp370.layers.add(gradingSources[370]);
    gradedLayer370.name = "UNDLM_00370_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer370.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer370.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer370 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer370 = false;
if (editSources[370]) {
    var editLayer370 = planComp370.layers.add(editSources[370]);
    editLayer370.name = "UNDLM_00370_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer370.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer370.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer370 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity370 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer370) {
    // EDIT toujours activé quand disponible
    editLayer370.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer370) {
        gradedLayer370.enabled = false;
    }
} else if (hasGradedLayer370) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer370.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText370 = planComp370.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText370.name = "WARNING_NO_EDIT";
    warningText370.property("Transform").property("Position").setValue([1280, 200]);
    warningText370.guideLayer = true;
    
    var warningTextDoc370 = warningText370.property("Source Text").value;
    warningTextDoc370.fontSize = 32;
    warningTextDoc370.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc370.font = "Arial-BoldMT";
    warningTextDoc370.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText370.property("Source Text").setValue(warningTextDoc370);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText370 = planComp370.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00370");
    errorText370.name = "ERROR_NO_SOURCE";
    errorText370.property("Transform").property("Position").setValue([1280, 720]);
    errorText370.guideLayer = true;
    
    var errorTextDoc370 = errorText370.property("Source Text").value;
    errorTextDoc370.fontSize = 48;
    errorTextDoc370.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc370.font = "Arial-BoldMT";
    errorTextDoc370.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText370.property("Source Text").setValue(errorTextDoc370);
}

planCompositions[370] = planComp370;


// Composition pour plan 00371
var planComp371 = project.items.addComp(
    "SQ21_UNDLM_00371_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp371.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer371 = planComp371.layers.add(bgSolidComp);
bgLayer371.name = "BG_SOLID";
bgLayer371.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer371 = false;
if (gradingSources[371]) {
    var gradedLayer371 = planComp371.layers.add(gradingSources[371]);
    gradedLayer371.name = "UNDLM_00371_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer371.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer371.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer371 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer371 = false;
if (editSources[371]) {
    var editLayer371 = planComp371.layers.add(editSources[371]);
    editLayer371.name = "UNDLM_00371_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer371.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer371.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer371 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity371 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer371) {
    // EDIT toujours activé quand disponible
    editLayer371.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer371) {
        gradedLayer371.enabled = false;
    }
} else if (hasGradedLayer371) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer371.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText371 = planComp371.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText371.name = "WARNING_NO_EDIT";
    warningText371.property("Transform").property("Position").setValue([1280, 200]);
    warningText371.guideLayer = true;
    
    var warningTextDoc371 = warningText371.property("Source Text").value;
    warningTextDoc371.fontSize = 32;
    warningTextDoc371.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc371.font = "Arial-BoldMT";
    warningTextDoc371.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText371.property("Source Text").setValue(warningTextDoc371);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText371 = planComp371.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00371");
    errorText371.name = "ERROR_NO_SOURCE";
    errorText371.property("Transform").property("Position").setValue([1280, 720]);
    errorText371.guideLayer = true;
    
    var errorTextDoc371 = errorText371.property("Source Text").value;
    errorTextDoc371.fontSize = 48;
    errorTextDoc371.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc371.font = "Arial-BoldMT";
    errorTextDoc371.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText371.property("Source Text").setValue(errorTextDoc371);
}

planCompositions[371] = planComp371;


// Composition pour plan 00372
var planComp372 = project.items.addComp(
    "SQ21_UNDLM_00372_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp372.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer372 = planComp372.layers.add(bgSolidComp);
bgLayer372.name = "BG_SOLID";
bgLayer372.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer372 = false;
if (gradingSources[372]) {
    var gradedLayer372 = planComp372.layers.add(gradingSources[372]);
    gradedLayer372.name = "UNDLM_00372_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer372.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer372.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer372 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer372 = false;
if (editSources[372]) {
    var editLayer372 = planComp372.layers.add(editSources[372]);
    editLayer372.name = "UNDLM_00372_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer372.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer372.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer372 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity372 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer372) {
    // EDIT toujours activé quand disponible
    editLayer372.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer372) {
        gradedLayer372.enabled = false;
    }
} else if (hasGradedLayer372) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer372.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText372 = planComp372.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText372.name = "WARNING_NO_EDIT";
    warningText372.property("Transform").property("Position").setValue([1280, 200]);
    warningText372.guideLayer = true;
    
    var warningTextDoc372 = warningText372.property("Source Text").value;
    warningTextDoc372.fontSize = 32;
    warningTextDoc372.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc372.font = "Arial-BoldMT";
    warningTextDoc372.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText372.property("Source Text").setValue(warningTextDoc372);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText372 = planComp372.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00372");
    errorText372.name = "ERROR_NO_SOURCE";
    errorText372.property("Transform").property("Position").setValue([1280, 720]);
    errorText372.guideLayer = true;
    
    var errorTextDoc372 = errorText372.property("Source Text").value;
    errorTextDoc372.fontSize = 48;
    errorTextDoc372.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc372.font = "Arial-BoldMT";
    errorTextDoc372.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText372.property("Source Text").setValue(errorTextDoc372);
}

planCompositions[372] = planComp372;


// Composition pour plan 00373
var planComp373 = project.items.addComp(
    "SQ21_UNDLM_00373_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp373.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer373 = planComp373.layers.add(bgSolidComp);
bgLayer373.name = "BG_SOLID";
bgLayer373.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer373 = false;
if (gradingSources[373]) {
    var gradedLayer373 = planComp373.layers.add(gradingSources[373]);
    gradedLayer373.name = "UNDLM_00373_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer373.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer373.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer373 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer373 = false;
if (editSources[373]) {
    var editLayer373 = planComp373.layers.add(editSources[373]);
    editLayer373.name = "UNDLM_00373_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer373.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer373.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer373 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity373 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer373) {
    // EDIT toujours activé quand disponible
    editLayer373.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer373) {
        gradedLayer373.enabled = false;
    }
} else if (hasGradedLayer373) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer373.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText373 = planComp373.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText373.name = "WARNING_NO_EDIT";
    warningText373.property("Transform").property("Position").setValue([1280, 200]);
    warningText373.guideLayer = true;
    
    var warningTextDoc373 = warningText373.property("Source Text").value;
    warningTextDoc373.fontSize = 32;
    warningTextDoc373.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc373.font = "Arial-BoldMT";
    warningTextDoc373.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText373.property("Source Text").setValue(warningTextDoc373);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText373 = planComp373.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00373");
    errorText373.name = "ERROR_NO_SOURCE";
    errorText373.property("Transform").property("Position").setValue([1280, 720]);
    errorText373.guideLayer = true;
    
    var errorTextDoc373 = errorText373.property("Source Text").value;
    errorTextDoc373.fontSize = 48;
    errorTextDoc373.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc373.font = "Arial-BoldMT";
    errorTextDoc373.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText373.property("Source Text").setValue(errorTextDoc373);
}

planCompositions[373] = planComp373;


// Composition pour plan 00374
var planComp374 = project.items.addComp(
    "SQ21_UNDLM_00374_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp374.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer374 = planComp374.layers.add(bgSolidComp);
bgLayer374.name = "BG_SOLID";
bgLayer374.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer374 = false;
if (gradingSources[374]) {
    var gradedLayer374 = planComp374.layers.add(gradingSources[374]);
    gradedLayer374.name = "UNDLM_00374_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer374.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer374.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer374 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer374 = false;
if (editSources[374]) {
    var editLayer374 = planComp374.layers.add(editSources[374]);
    editLayer374.name = "UNDLM_00374_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer374.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer374.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer374 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity374 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer374) {
    // EDIT toujours activé quand disponible
    editLayer374.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer374) {
        gradedLayer374.enabled = false;
    }
} else if (hasGradedLayer374) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer374.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText374 = planComp374.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText374.name = "WARNING_NO_EDIT";
    warningText374.property("Transform").property("Position").setValue([1280, 200]);
    warningText374.guideLayer = true;
    
    var warningTextDoc374 = warningText374.property("Source Text").value;
    warningTextDoc374.fontSize = 32;
    warningTextDoc374.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc374.font = "Arial-BoldMT";
    warningTextDoc374.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText374.property("Source Text").setValue(warningTextDoc374);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText374 = planComp374.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00374");
    errorText374.name = "ERROR_NO_SOURCE";
    errorText374.property("Transform").property("Position").setValue([1280, 720]);
    errorText374.guideLayer = true;
    
    var errorTextDoc374 = errorText374.property("Source Text").value;
    errorTextDoc374.fontSize = 48;
    errorTextDoc374.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc374.font = "Arial-BoldMT";
    errorTextDoc374.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText374.property("Source Text").setValue(errorTextDoc374);
}

planCompositions[374] = planComp374;


// Composition pour plan 00375
var planComp375 = project.items.addComp(
    "SQ21_UNDLM_00375_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    16.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp375.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer375 = planComp375.layers.add(bgSolidComp);
bgLayer375.name = "BG_SOLID";
bgLayer375.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer375 = false;
if (gradingSources[375]) {
    var gradedLayer375 = planComp375.layers.add(gradingSources[375]);
    gradedLayer375.name = "UNDLM_00375_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer375.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer375.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer375 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer375 = false;
if (editSources[375]) {
    var editLayer375 = planComp375.layers.add(editSources[375]);
    editLayer375.name = "UNDLM_00375_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer375.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer375.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer375 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity375 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer375) {
    // EDIT toujours activé quand disponible
    editLayer375.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer375) {
        gradedLayer375.enabled = false;
    }
} else if (hasGradedLayer375) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer375.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText375 = planComp375.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText375.name = "WARNING_NO_EDIT";
    warningText375.property("Transform").property("Position").setValue([1280, 200]);
    warningText375.guideLayer = true;
    
    var warningTextDoc375 = warningText375.property("Source Text").value;
    warningTextDoc375.fontSize = 32;
    warningTextDoc375.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc375.font = "Arial-BoldMT";
    warningTextDoc375.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText375.property("Source Text").setValue(warningTextDoc375);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText375 = planComp375.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00375");
    errorText375.name = "ERROR_NO_SOURCE";
    errorText375.property("Transform").property("Position").setValue([1280, 720]);
    errorText375.guideLayer = true;
    
    var errorTextDoc375 = errorText375.property("Source Text").value;
    errorTextDoc375.fontSize = 48;
    errorTextDoc375.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc375.font = "Arial-BoldMT";
    errorTextDoc375.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText375.property("Source Text").setValue(errorTextDoc375);
}

planCompositions[375] = planComp375;


// Composition pour plan 00376
var planComp376 = project.items.addComp(
    "SQ21_UNDLM_00376_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp376.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer376 = planComp376.layers.add(bgSolidComp);
bgLayer376.name = "BG_SOLID";
bgLayer376.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer376 = false;
if (gradingSources[376]) {
    var gradedLayer376 = planComp376.layers.add(gradingSources[376]);
    gradedLayer376.name = "UNDLM_00376_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer376.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer376.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer376 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer376 = false;
if (editSources[376]) {
    var editLayer376 = planComp376.layers.add(editSources[376]);
    editLayer376.name = "UNDLM_00376_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer376.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer376.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer376 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity376 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer376) {
    // EDIT toujours activé quand disponible
    editLayer376.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer376) {
        gradedLayer376.enabled = false;
    }
} else if (hasGradedLayer376) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer376.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText376 = planComp376.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText376.name = "WARNING_NO_EDIT";
    warningText376.property("Transform").property("Position").setValue([1280, 200]);
    warningText376.guideLayer = true;
    
    var warningTextDoc376 = warningText376.property("Source Text").value;
    warningTextDoc376.fontSize = 32;
    warningTextDoc376.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc376.font = "Arial-BoldMT";
    warningTextDoc376.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText376.property("Source Text").setValue(warningTextDoc376);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText376 = planComp376.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00376");
    errorText376.name = "ERROR_NO_SOURCE";
    errorText376.property("Transform").property("Position").setValue([1280, 720]);
    errorText376.guideLayer = true;
    
    var errorTextDoc376 = errorText376.property("Source Text").value;
    errorTextDoc376.fontSize = 48;
    errorTextDoc376.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc376.font = "Arial-BoldMT";
    errorTextDoc376.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText376.property("Source Text").setValue(errorTextDoc376);
}

planCompositions[376] = planComp376;


// Composition pour plan 00377
var planComp377 = project.items.addComp(
    "SQ21_UNDLM_00377_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp377.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer377 = planComp377.layers.add(bgSolidComp);
bgLayer377.name = "BG_SOLID";
bgLayer377.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer377 = false;
if (gradingSources[377]) {
    var gradedLayer377 = planComp377.layers.add(gradingSources[377]);
    gradedLayer377.name = "UNDLM_00377_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer377.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer377.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer377 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer377 = false;
if (editSources[377]) {
    var editLayer377 = planComp377.layers.add(editSources[377]);
    editLayer377.name = "UNDLM_00377_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer377.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer377.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer377 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity377 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer377) {
    // EDIT toujours activé quand disponible
    editLayer377.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer377) {
        gradedLayer377.enabled = false;
    }
} else if (hasGradedLayer377) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer377.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText377 = planComp377.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText377.name = "WARNING_NO_EDIT";
    warningText377.property("Transform").property("Position").setValue([1280, 200]);
    warningText377.guideLayer = true;
    
    var warningTextDoc377 = warningText377.property("Source Text").value;
    warningTextDoc377.fontSize = 32;
    warningTextDoc377.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc377.font = "Arial-BoldMT";
    warningTextDoc377.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText377.property("Source Text").setValue(warningTextDoc377);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText377 = planComp377.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00377");
    errorText377.name = "ERROR_NO_SOURCE";
    errorText377.property("Transform").property("Position").setValue([1280, 720]);
    errorText377.guideLayer = true;
    
    var errorTextDoc377 = errorText377.property("Source Text").value;
    errorTextDoc377.fontSize = 48;
    errorTextDoc377.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc377.font = "Arial-BoldMT";
    errorTextDoc377.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText377.property("Source Text").setValue(errorTextDoc377);
}

planCompositions[377] = planComp377;


// Composition pour plan 00378
var planComp378 = project.items.addComp(
    "SQ21_UNDLM_00378_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp378.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer378 = planComp378.layers.add(bgSolidComp);
bgLayer378.name = "BG_SOLID";
bgLayer378.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer378 = false;
if (gradingSources[378]) {
    var gradedLayer378 = planComp378.layers.add(gradingSources[378]);
    gradedLayer378.name = "UNDLM_00378_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer378.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer378.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer378 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer378 = false;
if (editSources[378]) {
    var editLayer378 = planComp378.layers.add(editSources[378]);
    editLayer378.name = "UNDLM_00378_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer378.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer378.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer378 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity378 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer378) {
    // EDIT toujours activé quand disponible
    editLayer378.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer378) {
        gradedLayer378.enabled = false;
    }
} else if (hasGradedLayer378) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer378.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText378 = planComp378.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText378.name = "WARNING_NO_EDIT";
    warningText378.property("Transform").property("Position").setValue([1280, 200]);
    warningText378.guideLayer = true;
    
    var warningTextDoc378 = warningText378.property("Source Text").value;
    warningTextDoc378.fontSize = 32;
    warningTextDoc378.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc378.font = "Arial-BoldMT";
    warningTextDoc378.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText378.property("Source Text").setValue(warningTextDoc378);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText378 = planComp378.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00378");
    errorText378.name = "ERROR_NO_SOURCE";
    errorText378.property("Transform").property("Position").setValue([1280, 720]);
    errorText378.guideLayer = true;
    
    var errorTextDoc378 = errorText378.property("Source Text").value;
    errorTextDoc378.fontSize = 48;
    errorTextDoc378.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc378.font = "Arial-BoldMT";
    errorTextDoc378.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText378.property("Source Text").setValue(errorTextDoc378);
}

planCompositions[378] = planComp378;


// Composition pour plan 00379
var planComp379 = project.items.addComp(
    "SQ21_UNDLM_00379_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp379.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer379 = planComp379.layers.add(bgSolidComp);
bgLayer379.name = "BG_SOLID";
bgLayer379.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer379 = false;
if (gradingSources[379]) {
    var gradedLayer379 = planComp379.layers.add(gradingSources[379]);
    gradedLayer379.name = "UNDLM_00379_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer379.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer379.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer379 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer379 = false;
if (editSources[379]) {
    var editLayer379 = planComp379.layers.add(editSources[379]);
    editLayer379.name = "UNDLM_00379_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer379.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer379.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer379 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity379 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer379) {
    // EDIT toujours activé quand disponible
    editLayer379.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer379) {
        gradedLayer379.enabled = false;
    }
} else if (hasGradedLayer379) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer379.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText379 = planComp379.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText379.name = "WARNING_NO_EDIT";
    warningText379.property("Transform").property("Position").setValue([1280, 200]);
    warningText379.guideLayer = true;
    
    var warningTextDoc379 = warningText379.property("Source Text").value;
    warningTextDoc379.fontSize = 32;
    warningTextDoc379.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc379.font = "Arial-BoldMT";
    warningTextDoc379.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText379.property("Source Text").setValue(warningTextDoc379);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText379 = planComp379.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00379");
    errorText379.name = "ERROR_NO_SOURCE";
    errorText379.property("Transform").property("Position").setValue([1280, 720]);
    errorText379.guideLayer = true;
    
    var errorTextDoc379 = errorText379.property("Source Text").value;
    errorTextDoc379.fontSize = 48;
    errorTextDoc379.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc379.font = "Arial-BoldMT";
    errorTextDoc379.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText379.property("Source Text").setValue(errorTextDoc379);
}

planCompositions[379] = planComp379;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ21_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    176.4, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00347 à la timeline master
if (planCompositions[347]) {
    var masterLayer347 = masterComp.layers.add(planCompositions[347]);
    masterLayer347.startTime = 0;
    masterLayer347.name = "UNDLM_00347";
    masterLayer347.label = 1; // Couleurs alternées
}

// Ajouter plan 00348 à la timeline master
if (planCompositions[348]) {
    var masterLayer348 = masterComp.layers.add(planCompositions[348]);
    masterLayer348.startTime = 3.6;
    masterLayer348.name = "UNDLM_00348";
    masterLayer348.label = 2; // Couleurs alternées
}

// Ajouter plan 00349 à la timeline master
if (planCompositions[349]) {
    var masterLayer349 = masterComp.layers.add(planCompositions[349]);
    masterLayer349.startTime = 5.76;
    masterLayer349.name = "UNDLM_00349";
    masterLayer349.label = 3; // Couleurs alternées
}

// Ajouter plan 00350 à la timeline master
if (planCompositions[350]) {
    var masterLayer350 = masterComp.layers.add(planCompositions[350]);
    masterLayer350.startTime = 7.8;
    masterLayer350.name = "UNDLM_00350";
    masterLayer350.label = 4; // Couleurs alternées
}

// Ajouter plan 00351 à la timeline master
if (planCompositions[351]) {
    var masterLayer351 = masterComp.layers.add(planCompositions[351]);
    masterLayer351.startTime = 10.559999999999999;
    masterLayer351.name = "UNDLM_00351";
    masterLayer351.label = 5; // Couleurs alternées
}

// Ajouter plan 00352 à la timeline master
if (planCompositions[352]) {
    var masterLayer352 = masterComp.layers.add(planCompositions[352]);
    masterLayer352.startTime = 17.96;
    masterLayer352.name = "UNDLM_00352";
    masterLayer352.label = 6; // Couleurs alternées
}

// Ajouter plan 00353 à la timeline master
if (planCompositions[353]) {
    var masterLayer353 = masterComp.layers.add(planCompositions[353]);
    masterLayer353.startTime = 27.28;
    masterLayer353.name = "UNDLM_00353";
    masterLayer353.label = 7; // Couleurs alternées
}

// Ajouter plan 00354 à la timeline master
if (planCompositions[354]) {
    var masterLayer354 = masterComp.layers.add(planCompositions[354]);
    masterLayer354.startTime = 31.96;
    masterLayer354.name = "UNDLM_00354";
    masterLayer354.label = 8; // Couleurs alternées
}

// Ajouter plan 00355 à la timeline master
if (planCompositions[355]) {
    var masterLayer355 = masterComp.layers.add(planCompositions[355]);
    masterLayer355.startTime = 35.52;
    masterLayer355.name = "UNDLM_00355";
    masterLayer355.label = 9; // Couleurs alternées
}

// Ajouter plan 00356 à la timeline master
if (planCompositions[356]) {
    var masterLayer356 = masterComp.layers.add(planCompositions[356]);
    masterLayer356.startTime = 43.24;
    masterLayer356.name = "UNDLM_00356";
    masterLayer356.label = 10; // Couleurs alternées
}

// Ajouter plan 00357 à la timeline master
if (planCompositions[357]) {
    var masterLayer357 = masterComp.layers.add(planCompositions[357]);
    masterLayer357.startTime = 46.96;
    masterLayer357.name = "UNDLM_00357";
    masterLayer357.label = 11; // Couleurs alternées
}

// Ajouter plan 00358 à la timeline master
if (planCompositions[358]) {
    var masterLayer358 = masterComp.layers.add(planCompositions[358]);
    masterLayer358.startTime = 51.160000000000004;
    masterLayer358.name = "UNDLM_00358";
    masterLayer358.label = 12; // Couleurs alternées
}

// Ajouter plan 00359 à la timeline master
if (planCompositions[359]) {
    var masterLayer359 = masterComp.layers.add(planCompositions[359]);
    masterLayer359.startTime = 53.080000000000005;
    masterLayer359.name = "UNDLM_00359";
    masterLayer359.label = 13; // Couleurs alternées
}

// Ajouter plan 00360 à la timeline master
if (planCompositions[360]) {
    var masterLayer360 = masterComp.layers.add(planCompositions[360]);
    masterLayer360.startTime = 56.080000000000005;
    masterLayer360.name = "UNDLM_00360";
    masterLayer360.label = 14; // Couleurs alternées
}

// Ajouter plan 00361 à la timeline master
if (planCompositions[361]) {
    var masterLayer361 = masterComp.layers.add(planCompositions[361]);
    masterLayer361.startTime = 58.120000000000005;
    masterLayer361.name = "UNDLM_00361";
    masterLayer361.label = 15; // Couleurs alternées
}

// Ajouter plan 00362 à la timeline master
if (planCompositions[362]) {
    var masterLayer362 = masterComp.layers.add(planCompositions[362]);
    masterLayer362.startTime = 60.96000000000001;
    masterLayer362.name = "UNDLM_00362";
    masterLayer362.label = 16; // Couleurs alternées
}

// Ajouter plan 00363 à la timeline master
if (planCompositions[363]) {
    var masterLayer363 = masterComp.layers.add(planCompositions[363]);
    masterLayer363.startTime = 65.2;
    masterLayer363.name = "UNDLM_00363";
    masterLayer363.label = 1; // Couleurs alternées
}

// Ajouter plan 00364 à la timeline master
if (planCompositions[364]) {
    var masterLayer364 = masterComp.layers.add(planCompositions[364]);
    masterLayer364.startTime = 68.92;
    masterLayer364.name = "UNDLM_00364";
    masterLayer364.label = 2; // Couleurs alternées
}

// Ajouter plan 00365 à la timeline master
if (planCompositions[365]) {
    var masterLayer365 = masterComp.layers.add(planCompositions[365]);
    masterLayer365.startTime = 77.52;
    masterLayer365.name = "UNDLM_00365";
    masterLayer365.label = 3; // Couleurs alternées
}

// Ajouter plan 00366 à la timeline master
if (planCompositions[366]) {
    var masterLayer366 = masterComp.layers.add(planCompositions[366]);
    masterLayer366.startTime = 81.88;
    masterLayer366.name = "UNDLM_00366";
    masterLayer366.label = 4; // Couleurs alternées
}

// Ajouter plan 00367 à la timeline master
if (planCompositions[367]) {
    var masterLayer367 = masterComp.layers.add(planCompositions[367]);
    masterLayer367.startTime = 86.67999999999999;
    masterLayer367.name = "UNDLM_00367";
    masterLayer367.label = 5; // Couleurs alternées
}

// Ajouter plan 00368 à la timeline master
if (planCompositions[368]) {
    var masterLayer368 = masterComp.layers.add(planCompositions[368]);
    masterLayer368.startTime = 91.96;
    masterLayer368.name = "UNDLM_00368";
    masterLayer368.label = 6; // Couleurs alternées
}

// Ajouter plan 00369 à la timeline master
if (planCompositions[369]) {
    var masterLayer369 = masterComp.layers.add(planCompositions[369]);
    masterLayer369.startTime = 97.03999999999999;
    masterLayer369.name = "UNDLM_00369";
    masterLayer369.label = 7; // Couleurs alternées
}

// Ajouter plan 00370 à la timeline master
if (planCompositions[370]) {
    var masterLayer370 = masterComp.layers.add(planCompositions[370]);
    masterLayer370.startTime = 105.8;
    masterLayer370.name = "UNDLM_00370";
    masterLayer370.label = 8; // Couleurs alternées
}

// Ajouter plan 00371 à la timeline master
if (planCompositions[371]) {
    var masterLayer371 = masterComp.layers.add(planCompositions[371]);
    masterLayer371.startTime = 110.56;
    masterLayer371.name = "UNDLM_00371";
    masterLayer371.label = 9; // Couleurs alternées
}

// Ajouter plan 00372 à la timeline master
if (planCompositions[372]) {
    var masterLayer372 = masterComp.layers.add(planCompositions[372]);
    masterLayer372.startTime = 112.72;
    masterLayer372.name = "UNDLM_00372";
    masterLayer372.label = 10; // Couleurs alternées
}

// Ajouter plan 00373 à la timeline master
if (planCompositions[373]) {
    var masterLayer373 = masterComp.layers.add(planCompositions[373]);
    masterLayer373.startTime = 116.56;
    masterLayer373.name = "UNDLM_00373";
    masterLayer373.label = 11; // Couleurs alternées
}

// Ajouter plan 00374 à la timeline master
if (planCompositions[374]) {
    var masterLayer374 = masterComp.layers.add(planCompositions[374]);
    masterLayer374.startTime = 123.08;
    masterLayer374.name = "UNDLM_00374";
    masterLayer374.label = 12; // Couleurs alternées
}

// Ajouter plan 00375 à la timeline master
if (planCompositions[375]) {
    var masterLayer375 = masterComp.layers.add(planCompositions[375]);
    masterLayer375.startTime = 129.12;
    masterLayer375.name = "UNDLM_00375";
    masterLayer375.label = 13; // Couleurs alternées
}

// Ajouter plan 00376 à la timeline master
if (planCompositions[376]) {
    var masterLayer376 = masterComp.layers.add(planCompositions[376]);
    masterLayer376.startTime = 145.84;
    masterLayer376.name = "UNDLM_00376";
    masterLayer376.label = 14; // Couleurs alternées
}

// Ajouter plan 00377 à la timeline master
if (planCompositions[377]) {
    var masterLayer377 = masterComp.layers.add(planCompositions[377]);
    masterLayer377.startTime = 156.32;
    masterLayer377.name = "UNDLM_00377";
    masterLayer377.label = 15; // Couleurs alternées
}

// Ajouter plan 00378 à la timeline master
if (planCompositions[378]) {
    var masterLayer378 = masterComp.layers.add(planCompositions[378]);
    masterLayer378.startTime = 161.28;
    masterLayer378.name = "UNDLM_00378";
    masterLayer378.label = 16; // Couleurs alternées
}

// Ajouter plan 00379 à la timeline master
if (planCompositions[379]) {
    var masterLayer379 = masterComp.layers.add(planCompositions[379]);
    masterLayer379.startTime = 168.32;
    masterLayer379.name = "UNDLM_00379";
    masterLayer379.label = 1; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ21";\n' +
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
    {start: 0, end: 3.6, name: "UNDLM_00347"},
    {start: 3.6, end: 5.76, name: "UNDLM_00348"},
    {start: 5.76, end: 7.8, name: "UNDLM_00349"},
    {start: 7.8, end: 10.559999999999999, name: "UNDLM_00350"},
    {start: 10.559999999999999, end: 17.96, name: "UNDLM_00351"},
    {start: 17.96, end: 27.28, name: "UNDLM_00352"},
    {start: 27.28, end: 31.96, name: "UNDLM_00353"},
    {start: 31.96, end: 35.52, name: "UNDLM_00354"},
    {start: 35.52, end: 43.24, name: "UNDLM_00355"},
    {start: 43.24, end: 46.96, name: "UNDLM_00356"},
    {start: 46.96, end: 51.160000000000004, name: "UNDLM_00357"},
    {start: 51.160000000000004, end: 53.080000000000005, name: "UNDLM_00358"},
    {start: 53.080000000000005, end: 56.080000000000005, name: "UNDLM_00359"},
    {start: 56.080000000000005, end: 58.120000000000005, name: "UNDLM_00360"},
    {start: 58.120000000000005, end: 60.96000000000001, name: "UNDLM_00361"},
    {start: 60.96000000000001, end: 65.2, name: "UNDLM_00362"},
    {start: 65.2, end: 68.92, name: "UNDLM_00363"},
    {start: 68.92, end: 77.52, name: "UNDLM_00364"},
    {start: 77.52, end: 81.88, name: "UNDLM_00365"},
    {start: 81.88, end: 86.67999999999999, name: "UNDLM_00366"},
    {start: 86.67999999999999, end: 91.96, name: "UNDLM_00367"},
    {start: 91.96, end: 97.03999999999999, name: "UNDLM_00368"},
    {start: 97.03999999999999, end: 105.8, name: "UNDLM_00369"},
    {start: 105.8, end: 110.56, name: "UNDLM_00370"},
    {start: 110.56, end: 112.72, name: "UNDLM_00371"},
    {start: 112.72, end: 116.56, name: "UNDLM_00372"},
    {start: 116.56, end: 123.08, name: "UNDLM_00373"},
    {start: 123.08, end: 129.12, name: "UNDLM_00374"},
    {start: 129.12, end: 145.84, name: "UNDLM_00375"},
    {start: 145.84, end: 156.32, name: "UNDLM_00376"},
    {start: 156.32, end: 161.28, name: "UNDLM_00377"},
    {start: 161.28, end: 168.32, name: "UNDLM_00378"},
    {start: 168.32, end: 176.4, name: "UNDLM_00379"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ21/_AE/SQ21_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 33;
var totalCount = 33;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ21 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(176.4 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ21_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ21:" + totalCount + ":" + gradedCount);
