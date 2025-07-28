
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ18 avec 8 plans
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


// Import plan EDIT 00310
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile310 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00310.mov");
var editFilePoignees310 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00310_AVEC_POIGNEES.mov");
var editFileBis310 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00310bis.mov");

var importSuccess310 = false;
var fileName310 = "";

// Tenter import standard
if (editFile310.exists) {
    try {
        var editFootage310 = project.importFile(new ImportOptions(editFile310));
        editFootage310.parentFolder = fromEditFolder;
        editFootage310.name = "UNDLM_00310";
        editSources[310] = editFootage310;
        editImportCount++;
        importSuccess310 = true;
        fileName310 = "UNDLM_00310.mov";
        logImportSuccess(310, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00310.mov", fileName310);
    } catch (e) {
        logImportError(310, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00310.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess310 && editFilePoignees310.exists) {
    try {
        var editFootage310 = project.importFile(new ImportOptions(editFilePoignees310));
        editFootage310.parentFolder = fromEditFolder;
        editFootage310.name = "UNDLM_00310_AVEC_POIGNEES";
        editSources[310] = editFootage310;
        editImportCount++;
        importSuccess310 = true;
        fileName310 = "UNDLM_00310_AVEC_POIGNEES.mov";
        logImportSuccess(310, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00310_AVEC_POIGNEES.mov", fileName310);
    } catch (e) {
        logImportError(310, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00310_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess310 && editFileBis310.exists) {
    try {
        var editFootage310 = project.importFile(new ImportOptions(editFileBis310));
        editFootage310.parentFolder = fromEditFolder;
        editFootage310.name = "UNDLM_00310bis";
        editSources[310] = editFootage310;
        editImportCount++;
        importSuccess310 = true;
        fileName310 = "UNDLM_00310bis.mov";
        logImportSuccess(310, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00310bis.mov", fileName310);
    } catch (e) {
        logImportError(310, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00310bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess310) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00310.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00311
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile311 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00311.mov");
var editFilePoignees311 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00311_AVEC_POIGNEES.mov");
var editFileBis311 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00311bis.mov");

var importSuccess311 = false;
var fileName311 = "";

// Tenter import standard
if (editFile311.exists) {
    try {
        var editFootage311 = project.importFile(new ImportOptions(editFile311));
        editFootage311.parentFolder = fromEditFolder;
        editFootage311.name = "UNDLM_00311";
        editSources[311] = editFootage311;
        editImportCount++;
        importSuccess311 = true;
        fileName311 = "UNDLM_00311.mov";
        logImportSuccess(311, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00311.mov", fileName311);
    } catch (e) {
        logImportError(311, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00311.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess311 && editFilePoignees311.exists) {
    try {
        var editFootage311 = project.importFile(new ImportOptions(editFilePoignees311));
        editFootage311.parentFolder = fromEditFolder;
        editFootage311.name = "UNDLM_00311_AVEC_POIGNEES";
        editSources[311] = editFootage311;
        editImportCount++;
        importSuccess311 = true;
        fileName311 = "UNDLM_00311_AVEC_POIGNEES.mov";
        logImportSuccess(311, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00311_AVEC_POIGNEES.mov", fileName311);
    } catch (e) {
        logImportError(311, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00311_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess311 && editFileBis311.exists) {
    try {
        var editFootage311 = project.importFile(new ImportOptions(editFileBis311));
        editFootage311.parentFolder = fromEditFolder;
        editFootage311.name = "UNDLM_00311bis";
        editSources[311] = editFootage311;
        editImportCount++;
        importSuccess311 = true;
        fileName311 = "UNDLM_00311bis.mov";
        logImportSuccess(311, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00311bis.mov", fileName311);
    } catch (e) {
        logImportError(311, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00311bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess311) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00311.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00312
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile312 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00312.mov");
var editFilePoignees312 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00312_AVEC_POIGNEES.mov");
var editFileBis312 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00312bis.mov");

var importSuccess312 = false;
var fileName312 = "";

// Tenter import standard
if (editFile312.exists) {
    try {
        var editFootage312 = project.importFile(new ImportOptions(editFile312));
        editFootage312.parentFolder = fromEditFolder;
        editFootage312.name = "UNDLM_00312";
        editSources[312] = editFootage312;
        editImportCount++;
        importSuccess312 = true;
        fileName312 = "UNDLM_00312.mov";
        logImportSuccess(312, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00312.mov", fileName312);
    } catch (e) {
        logImportError(312, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00312.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess312 && editFilePoignees312.exists) {
    try {
        var editFootage312 = project.importFile(new ImportOptions(editFilePoignees312));
        editFootage312.parentFolder = fromEditFolder;
        editFootage312.name = "UNDLM_00312_AVEC_POIGNEES";
        editSources[312] = editFootage312;
        editImportCount++;
        importSuccess312 = true;
        fileName312 = "UNDLM_00312_AVEC_POIGNEES.mov";
        logImportSuccess(312, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00312_AVEC_POIGNEES.mov", fileName312);
    } catch (e) {
        logImportError(312, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00312_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess312 && editFileBis312.exists) {
    try {
        var editFootage312 = project.importFile(new ImportOptions(editFileBis312));
        editFootage312.parentFolder = fromEditFolder;
        editFootage312.name = "UNDLM_00312bis";
        editSources[312] = editFootage312;
        editImportCount++;
        importSuccess312 = true;
        fileName312 = "UNDLM_00312bis.mov";
        logImportSuccess(312, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00312bis.mov", fileName312);
    } catch (e) {
        logImportError(312, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00312bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess312) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00312.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00313
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile313 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00313.mov");
var editFilePoignees313 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00313_AVEC_POIGNEES.mov");
var editFileBis313 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00313bis.mov");

var importSuccess313 = false;
var fileName313 = "";

// Tenter import standard
if (editFile313.exists) {
    try {
        var editFootage313 = project.importFile(new ImportOptions(editFile313));
        editFootage313.parentFolder = fromEditFolder;
        editFootage313.name = "UNDLM_00313";
        editSources[313] = editFootage313;
        editImportCount++;
        importSuccess313 = true;
        fileName313 = "UNDLM_00313.mov";
        logImportSuccess(313, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00313.mov", fileName313);
    } catch (e) {
        logImportError(313, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00313.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess313 && editFilePoignees313.exists) {
    try {
        var editFootage313 = project.importFile(new ImportOptions(editFilePoignees313));
        editFootage313.parentFolder = fromEditFolder;
        editFootage313.name = "UNDLM_00313_AVEC_POIGNEES";
        editSources[313] = editFootage313;
        editImportCount++;
        importSuccess313 = true;
        fileName313 = "UNDLM_00313_AVEC_POIGNEES.mov";
        logImportSuccess(313, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00313_AVEC_POIGNEES.mov", fileName313);
    } catch (e) {
        logImportError(313, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00313_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess313 && editFileBis313.exists) {
    try {
        var editFootage313 = project.importFile(new ImportOptions(editFileBis313));
        editFootage313.parentFolder = fromEditFolder;
        editFootage313.name = "UNDLM_00313bis";
        editSources[313] = editFootage313;
        editImportCount++;
        importSuccess313 = true;
        fileName313 = "UNDLM_00313bis.mov";
        logImportSuccess(313, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00313bis.mov", fileName313);
    } catch (e) {
        logImportError(313, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00313bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess313) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00313.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00314
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile314 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00314.mov");
var editFilePoignees314 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00314_AVEC_POIGNEES.mov");
var editFileBis314 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00314bis.mov");

var importSuccess314 = false;
var fileName314 = "";

// Tenter import standard
if (editFile314.exists) {
    try {
        var editFootage314 = project.importFile(new ImportOptions(editFile314));
        editFootage314.parentFolder = fromEditFolder;
        editFootage314.name = "UNDLM_00314";
        editSources[314] = editFootage314;
        editImportCount++;
        importSuccess314 = true;
        fileName314 = "UNDLM_00314.mov";
        logImportSuccess(314, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00314.mov", fileName314);
    } catch (e) {
        logImportError(314, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00314.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess314 && editFilePoignees314.exists) {
    try {
        var editFootage314 = project.importFile(new ImportOptions(editFilePoignees314));
        editFootage314.parentFolder = fromEditFolder;
        editFootage314.name = "UNDLM_00314_AVEC_POIGNEES";
        editSources[314] = editFootage314;
        editImportCount++;
        importSuccess314 = true;
        fileName314 = "UNDLM_00314_AVEC_POIGNEES.mov";
        logImportSuccess(314, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00314_AVEC_POIGNEES.mov", fileName314);
    } catch (e) {
        logImportError(314, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00314_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess314 && editFileBis314.exists) {
    try {
        var editFootage314 = project.importFile(new ImportOptions(editFileBis314));
        editFootage314.parentFolder = fromEditFolder;
        editFootage314.name = "UNDLM_00314bis";
        editSources[314] = editFootage314;
        editImportCount++;
        importSuccess314 = true;
        fileName314 = "UNDLM_00314bis.mov";
        logImportSuccess(314, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00314bis.mov", fileName314);
    } catch (e) {
        logImportError(314, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00314bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess314) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00314.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00315
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile315 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00315.mov");
var editFilePoignees315 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00315_AVEC_POIGNEES.mov");
var editFileBis315 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00315bis.mov");

var importSuccess315 = false;
var fileName315 = "";

// Tenter import standard
if (editFile315.exists) {
    try {
        var editFootage315 = project.importFile(new ImportOptions(editFile315));
        editFootage315.parentFolder = fromEditFolder;
        editFootage315.name = "UNDLM_00315";
        editSources[315] = editFootage315;
        editImportCount++;
        importSuccess315 = true;
        fileName315 = "UNDLM_00315.mov";
        logImportSuccess(315, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00315.mov", fileName315);
    } catch (e) {
        logImportError(315, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00315.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess315 && editFilePoignees315.exists) {
    try {
        var editFootage315 = project.importFile(new ImportOptions(editFilePoignees315));
        editFootage315.parentFolder = fromEditFolder;
        editFootage315.name = "UNDLM_00315_AVEC_POIGNEES";
        editSources[315] = editFootage315;
        editImportCount++;
        importSuccess315 = true;
        fileName315 = "UNDLM_00315_AVEC_POIGNEES.mov";
        logImportSuccess(315, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00315_AVEC_POIGNEES.mov", fileName315);
    } catch (e) {
        logImportError(315, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00315_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess315 && editFileBis315.exists) {
    try {
        var editFootage315 = project.importFile(new ImportOptions(editFileBis315));
        editFootage315.parentFolder = fromEditFolder;
        editFootage315.name = "UNDLM_00315bis";
        editSources[315] = editFootage315;
        editImportCount++;
        importSuccess315 = true;
        fileName315 = "UNDLM_00315bis.mov";
        logImportSuccess(315, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00315bis.mov", fileName315);
    } catch (e) {
        logImportError(315, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00315bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess315) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00315.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00316
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile316 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00316.mov");
var editFilePoignees316 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00316_AVEC_POIGNEES.mov");
var editFileBis316 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00316bis.mov");

var importSuccess316 = false;
var fileName316 = "";

// Tenter import standard
if (editFile316.exists) {
    try {
        var editFootage316 = project.importFile(new ImportOptions(editFile316));
        editFootage316.parentFolder = fromEditFolder;
        editFootage316.name = "UNDLM_00316";
        editSources[316] = editFootage316;
        editImportCount++;
        importSuccess316 = true;
        fileName316 = "UNDLM_00316.mov";
        logImportSuccess(316, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00316.mov", fileName316);
    } catch (e) {
        logImportError(316, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00316.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess316 && editFilePoignees316.exists) {
    try {
        var editFootage316 = project.importFile(new ImportOptions(editFilePoignees316));
        editFootage316.parentFolder = fromEditFolder;
        editFootage316.name = "UNDLM_00316_AVEC_POIGNEES";
        editSources[316] = editFootage316;
        editImportCount++;
        importSuccess316 = true;
        fileName316 = "UNDLM_00316_AVEC_POIGNEES.mov";
        logImportSuccess(316, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00316_AVEC_POIGNEES.mov", fileName316);
    } catch (e) {
        logImportError(316, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00316_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess316 && editFileBis316.exists) {
    try {
        var editFootage316 = project.importFile(new ImportOptions(editFileBis316));
        editFootage316.parentFolder = fromEditFolder;
        editFootage316.name = "UNDLM_00316bis";
        editSources[316] = editFootage316;
        editImportCount++;
        importSuccess316 = true;
        fileName316 = "UNDLM_00316bis.mov";
        logImportSuccess(316, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00316bis.mov", fileName316);
    } catch (e) {
        logImportError(316, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00316bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess316) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00316.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00317
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile317 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00317.mov");
var editFilePoignees317 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00317_AVEC_POIGNEES.mov");
var editFileBis317 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00317bis.mov");

var importSuccess317 = false;
var fileName317 = "";

// Tenter import standard
if (editFile317.exists) {
    try {
        var editFootage317 = project.importFile(new ImportOptions(editFile317));
        editFootage317.parentFolder = fromEditFolder;
        editFootage317.name = "UNDLM_00317";
        editSources[317] = editFootage317;
        editImportCount++;
        importSuccess317 = true;
        fileName317 = "UNDLM_00317.mov";
        logImportSuccess(317, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00317.mov", fileName317);
    } catch (e) {
        logImportError(317, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00317.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess317 && editFilePoignees317.exists) {
    try {
        var editFootage317 = project.importFile(new ImportOptions(editFilePoignees317));
        editFootage317.parentFolder = fromEditFolder;
        editFootage317.name = "UNDLM_00317_AVEC_POIGNEES";
        editSources[317] = editFootage317;
        editImportCount++;
        importSuccess317 = true;
        fileName317 = "UNDLM_00317_AVEC_POIGNEES.mov";
        logImportSuccess(317, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00317_AVEC_POIGNEES.mov", fileName317);
    } catch (e) {
        logImportError(317, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00317_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess317 && editFileBis317.exists) {
    try {
        var editFootage317 = project.importFile(new ImportOptions(editFileBis317));
        editFootage317.parentFolder = fromEditFolder;
        editFootage317.name = "UNDLM_00317bis";
        editSources[317] = editFootage317;
        editImportCount++;
        importSuccess317 = true;
        fileName317 = "UNDLM_00317bis.mov";
        logImportSuccess(317, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00317bis.mov", fileName317);
    } catch (e) {
        logImportError(317, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00317bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess317) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00317.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00310
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile310 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00310.mov");
var gradedFilePoignees310 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00310_AVEC_POIGNEES.mov");
var gradedFileBis310 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00310bis.mov");

var gradedImportSuccess310 = false;
var gradedFileName310 = "";

// Tenter import standard
if (gradedFile310.exists) {
    try {
        var gradedFootage310 = project.importFile(new ImportOptions(gradedFile310));
        gradedFootage310.parentFolder = fromGradingFolder;
        gradedFootage310.name = "UNDLM_00310";
        gradingSources[310] = gradedFootage310;
        gradingImportCount++;
        gradedImportSuccess310 = true;
        gradedFileName310 = "UNDLM_00310.mov";
        logImportSuccess(310, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00310.mov", gradedFileName310);
    } catch (e) {
        logImportError(310, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00310.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess310 && gradedFilePoignees310.exists) {
    try {
        var gradedFootage310 = project.importFile(new ImportOptions(gradedFilePoignees310));
        gradedFootage310.parentFolder = fromGradingFolder;
        gradedFootage310.name = "UNDLM_00310_AVEC_POIGNEES";
        gradingSources[310] = gradedFootage310;
        gradingImportCount++;
        gradedImportSuccess310 = true;
        gradedFileName310 = "UNDLM_00310_AVEC_POIGNEES.mov";
        logImportSuccess(310, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00310_AVEC_POIGNEES.mov", gradedFileName310);
    } catch (e) {
        logImportError(310, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00310_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess310 && gradedFileBis310.exists) {
    try {
        var gradedFootage310 = project.importFile(new ImportOptions(gradedFileBis310));
        gradedFootage310.parentFolder = fromGradingFolder;
        gradedFootage310.name = "UNDLM_00310bis";
        gradingSources[310] = gradedFootage310;
        gradingImportCount++;
        gradedImportSuccess310 = true;
        gradedFileName310 = "UNDLM_00310bis.mov";
        logImportSuccess(310, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00310bis.mov", gradedFileName310);
    } catch (e) {
        logImportError(310, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00310bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess310) {
    missingGradingCount++;
}

// Import plan GRADED 00311
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile311 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00311.mov");
var gradedFilePoignees311 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00311_AVEC_POIGNEES.mov");
var gradedFileBis311 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00311bis.mov");

var gradedImportSuccess311 = false;
var gradedFileName311 = "";

// Tenter import standard
if (gradedFile311.exists) {
    try {
        var gradedFootage311 = project.importFile(new ImportOptions(gradedFile311));
        gradedFootage311.parentFolder = fromGradingFolder;
        gradedFootage311.name = "UNDLM_00311";
        gradingSources[311] = gradedFootage311;
        gradingImportCount++;
        gradedImportSuccess311 = true;
        gradedFileName311 = "UNDLM_00311.mov";
        logImportSuccess(311, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00311.mov", gradedFileName311);
    } catch (e) {
        logImportError(311, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00311.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess311 && gradedFilePoignees311.exists) {
    try {
        var gradedFootage311 = project.importFile(new ImportOptions(gradedFilePoignees311));
        gradedFootage311.parentFolder = fromGradingFolder;
        gradedFootage311.name = "UNDLM_00311_AVEC_POIGNEES";
        gradingSources[311] = gradedFootage311;
        gradingImportCount++;
        gradedImportSuccess311 = true;
        gradedFileName311 = "UNDLM_00311_AVEC_POIGNEES.mov";
        logImportSuccess(311, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00311_AVEC_POIGNEES.mov", gradedFileName311);
    } catch (e) {
        logImportError(311, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00311_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess311 && gradedFileBis311.exists) {
    try {
        var gradedFootage311 = project.importFile(new ImportOptions(gradedFileBis311));
        gradedFootage311.parentFolder = fromGradingFolder;
        gradedFootage311.name = "UNDLM_00311bis";
        gradingSources[311] = gradedFootage311;
        gradingImportCount++;
        gradedImportSuccess311 = true;
        gradedFileName311 = "UNDLM_00311bis.mov";
        logImportSuccess(311, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00311bis.mov", gradedFileName311);
    } catch (e) {
        logImportError(311, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00311bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess311) {
    missingGradingCount++;
}

// Import plan GRADED 00312
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile312 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00312.mov");
var gradedFilePoignees312 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00312_AVEC_POIGNEES.mov");
var gradedFileBis312 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00312bis.mov");

var gradedImportSuccess312 = false;
var gradedFileName312 = "";

// Tenter import standard
if (gradedFile312.exists) {
    try {
        var gradedFootage312 = project.importFile(new ImportOptions(gradedFile312));
        gradedFootage312.parentFolder = fromGradingFolder;
        gradedFootage312.name = "UNDLM_00312";
        gradingSources[312] = gradedFootage312;
        gradingImportCount++;
        gradedImportSuccess312 = true;
        gradedFileName312 = "UNDLM_00312.mov";
        logImportSuccess(312, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00312.mov", gradedFileName312);
    } catch (e) {
        logImportError(312, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00312.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess312 && gradedFilePoignees312.exists) {
    try {
        var gradedFootage312 = project.importFile(new ImportOptions(gradedFilePoignees312));
        gradedFootage312.parentFolder = fromGradingFolder;
        gradedFootage312.name = "UNDLM_00312_AVEC_POIGNEES";
        gradingSources[312] = gradedFootage312;
        gradingImportCount++;
        gradedImportSuccess312 = true;
        gradedFileName312 = "UNDLM_00312_AVEC_POIGNEES.mov";
        logImportSuccess(312, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00312_AVEC_POIGNEES.mov", gradedFileName312);
    } catch (e) {
        logImportError(312, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00312_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess312 && gradedFileBis312.exists) {
    try {
        var gradedFootage312 = project.importFile(new ImportOptions(gradedFileBis312));
        gradedFootage312.parentFolder = fromGradingFolder;
        gradedFootage312.name = "UNDLM_00312bis";
        gradingSources[312] = gradedFootage312;
        gradingImportCount++;
        gradedImportSuccess312 = true;
        gradedFileName312 = "UNDLM_00312bis.mov";
        logImportSuccess(312, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00312bis.mov", gradedFileName312);
    } catch (e) {
        logImportError(312, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00312bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess312) {
    missingGradingCount++;
}

// Import plan GRADED 00313
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile313 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00313.mov");
var gradedFilePoignees313 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00313_AVEC_POIGNEES.mov");
var gradedFileBis313 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00313bis.mov");

var gradedImportSuccess313 = false;
var gradedFileName313 = "";

// Tenter import standard
if (gradedFile313.exists) {
    try {
        var gradedFootage313 = project.importFile(new ImportOptions(gradedFile313));
        gradedFootage313.parentFolder = fromGradingFolder;
        gradedFootage313.name = "UNDLM_00313";
        gradingSources[313] = gradedFootage313;
        gradingImportCount++;
        gradedImportSuccess313 = true;
        gradedFileName313 = "UNDLM_00313.mov";
        logImportSuccess(313, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00313.mov", gradedFileName313);
    } catch (e) {
        logImportError(313, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00313.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess313 && gradedFilePoignees313.exists) {
    try {
        var gradedFootage313 = project.importFile(new ImportOptions(gradedFilePoignees313));
        gradedFootage313.parentFolder = fromGradingFolder;
        gradedFootage313.name = "UNDLM_00313_AVEC_POIGNEES";
        gradingSources[313] = gradedFootage313;
        gradingImportCount++;
        gradedImportSuccess313 = true;
        gradedFileName313 = "UNDLM_00313_AVEC_POIGNEES.mov";
        logImportSuccess(313, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00313_AVEC_POIGNEES.mov", gradedFileName313);
    } catch (e) {
        logImportError(313, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00313_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess313 && gradedFileBis313.exists) {
    try {
        var gradedFootage313 = project.importFile(new ImportOptions(gradedFileBis313));
        gradedFootage313.parentFolder = fromGradingFolder;
        gradedFootage313.name = "UNDLM_00313bis";
        gradingSources[313] = gradedFootage313;
        gradingImportCount++;
        gradedImportSuccess313 = true;
        gradedFileName313 = "UNDLM_00313bis.mov";
        logImportSuccess(313, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00313bis.mov", gradedFileName313);
    } catch (e) {
        logImportError(313, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00313bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess313) {
    missingGradingCount++;
}

// Import plan GRADED 00314
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile314 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00314.mov");
var gradedFilePoignees314 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00314_AVEC_POIGNEES.mov");
var gradedFileBis314 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00314bis.mov");

var gradedImportSuccess314 = false;
var gradedFileName314 = "";

// Tenter import standard
if (gradedFile314.exists) {
    try {
        var gradedFootage314 = project.importFile(new ImportOptions(gradedFile314));
        gradedFootage314.parentFolder = fromGradingFolder;
        gradedFootage314.name = "UNDLM_00314";
        gradingSources[314] = gradedFootage314;
        gradingImportCount++;
        gradedImportSuccess314 = true;
        gradedFileName314 = "UNDLM_00314.mov";
        logImportSuccess(314, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00314.mov", gradedFileName314);
    } catch (e) {
        logImportError(314, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00314.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess314 && gradedFilePoignees314.exists) {
    try {
        var gradedFootage314 = project.importFile(new ImportOptions(gradedFilePoignees314));
        gradedFootage314.parentFolder = fromGradingFolder;
        gradedFootage314.name = "UNDLM_00314_AVEC_POIGNEES";
        gradingSources[314] = gradedFootage314;
        gradingImportCount++;
        gradedImportSuccess314 = true;
        gradedFileName314 = "UNDLM_00314_AVEC_POIGNEES.mov";
        logImportSuccess(314, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00314_AVEC_POIGNEES.mov", gradedFileName314);
    } catch (e) {
        logImportError(314, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00314_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess314 && gradedFileBis314.exists) {
    try {
        var gradedFootage314 = project.importFile(new ImportOptions(gradedFileBis314));
        gradedFootage314.parentFolder = fromGradingFolder;
        gradedFootage314.name = "UNDLM_00314bis";
        gradingSources[314] = gradedFootage314;
        gradingImportCount++;
        gradedImportSuccess314 = true;
        gradedFileName314 = "UNDLM_00314bis.mov";
        logImportSuccess(314, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00314bis.mov", gradedFileName314);
    } catch (e) {
        logImportError(314, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00314bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess314) {
    missingGradingCount++;
}

// Import plan GRADED 00315
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile315 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00315.mov");
var gradedFilePoignees315 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00315_AVEC_POIGNEES.mov");
var gradedFileBis315 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00315bis.mov");

var gradedImportSuccess315 = false;
var gradedFileName315 = "";

// Tenter import standard
if (gradedFile315.exists) {
    try {
        var gradedFootage315 = project.importFile(new ImportOptions(gradedFile315));
        gradedFootage315.parentFolder = fromGradingFolder;
        gradedFootage315.name = "UNDLM_00315";
        gradingSources[315] = gradedFootage315;
        gradingImportCount++;
        gradedImportSuccess315 = true;
        gradedFileName315 = "UNDLM_00315.mov";
        logImportSuccess(315, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00315.mov", gradedFileName315);
    } catch (e) {
        logImportError(315, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00315.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess315 && gradedFilePoignees315.exists) {
    try {
        var gradedFootage315 = project.importFile(new ImportOptions(gradedFilePoignees315));
        gradedFootage315.parentFolder = fromGradingFolder;
        gradedFootage315.name = "UNDLM_00315_AVEC_POIGNEES";
        gradingSources[315] = gradedFootage315;
        gradingImportCount++;
        gradedImportSuccess315 = true;
        gradedFileName315 = "UNDLM_00315_AVEC_POIGNEES.mov";
        logImportSuccess(315, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00315_AVEC_POIGNEES.mov", gradedFileName315);
    } catch (e) {
        logImportError(315, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00315_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess315 && gradedFileBis315.exists) {
    try {
        var gradedFootage315 = project.importFile(new ImportOptions(gradedFileBis315));
        gradedFootage315.parentFolder = fromGradingFolder;
        gradedFootage315.name = "UNDLM_00315bis";
        gradingSources[315] = gradedFootage315;
        gradingImportCount++;
        gradedImportSuccess315 = true;
        gradedFileName315 = "UNDLM_00315bis.mov";
        logImportSuccess(315, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00315bis.mov", gradedFileName315);
    } catch (e) {
        logImportError(315, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00315bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess315) {
    missingGradingCount++;
}

// Import plan GRADED 00316
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile316 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00316.mov");
var gradedFilePoignees316 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00316_AVEC_POIGNEES.mov");
var gradedFileBis316 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00316bis.mov");

var gradedImportSuccess316 = false;
var gradedFileName316 = "";

// Tenter import standard
if (gradedFile316.exists) {
    try {
        var gradedFootage316 = project.importFile(new ImportOptions(gradedFile316));
        gradedFootage316.parentFolder = fromGradingFolder;
        gradedFootage316.name = "UNDLM_00316";
        gradingSources[316] = gradedFootage316;
        gradingImportCount++;
        gradedImportSuccess316 = true;
        gradedFileName316 = "UNDLM_00316.mov";
        logImportSuccess(316, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00316.mov", gradedFileName316);
    } catch (e) {
        logImportError(316, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00316.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess316 && gradedFilePoignees316.exists) {
    try {
        var gradedFootage316 = project.importFile(new ImportOptions(gradedFilePoignees316));
        gradedFootage316.parentFolder = fromGradingFolder;
        gradedFootage316.name = "UNDLM_00316_AVEC_POIGNEES";
        gradingSources[316] = gradedFootage316;
        gradingImportCount++;
        gradedImportSuccess316 = true;
        gradedFileName316 = "UNDLM_00316_AVEC_POIGNEES.mov";
        logImportSuccess(316, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00316_AVEC_POIGNEES.mov", gradedFileName316);
    } catch (e) {
        logImportError(316, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00316_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess316 && gradedFileBis316.exists) {
    try {
        var gradedFootage316 = project.importFile(new ImportOptions(gradedFileBis316));
        gradedFootage316.parentFolder = fromGradingFolder;
        gradedFootage316.name = "UNDLM_00316bis";
        gradingSources[316] = gradedFootage316;
        gradingImportCount++;
        gradedImportSuccess316 = true;
        gradedFileName316 = "UNDLM_00316bis.mov";
        logImportSuccess(316, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00316bis.mov", gradedFileName316);
    } catch (e) {
        logImportError(316, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00316bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess316) {
    missingGradingCount++;
}

// Import plan GRADED 00317
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile317 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00317.mov");
var gradedFilePoignees317 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00317_AVEC_POIGNEES.mov");
var gradedFileBis317 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00317bis.mov");

var gradedImportSuccess317 = false;
var gradedFileName317 = "";

// Tenter import standard
if (gradedFile317.exists) {
    try {
        var gradedFootage317 = project.importFile(new ImportOptions(gradedFile317));
        gradedFootage317.parentFolder = fromGradingFolder;
        gradedFootage317.name = "UNDLM_00317";
        gradingSources[317] = gradedFootage317;
        gradingImportCount++;
        gradedImportSuccess317 = true;
        gradedFileName317 = "UNDLM_00317.mov";
        logImportSuccess(317, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00317.mov", gradedFileName317);
    } catch (e) {
        logImportError(317, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00317.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess317 && gradedFilePoignees317.exists) {
    try {
        var gradedFootage317 = project.importFile(new ImportOptions(gradedFilePoignees317));
        gradedFootage317.parentFolder = fromGradingFolder;
        gradedFootage317.name = "UNDLM_00317_AVEC_POIGNEES";
        gradingSources[317] = gradedFootage317;
        gradingImportCount++;
        gradedImportSuccess317 = true;
        gradedFileName317 = "UNDLM_00317_AVEC_POIGNEES.mov";
        logImportSuccess(317, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00317_AVEC_POIGNEES.mov", gradedFileName317);
    } catch (e) {
        logImportError(317, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00317_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess317 && gradedFileBis317.exists) {
    try {
        var gradedFootage317 = project.importFile(new ImportOptions(gradedFileBis317));
        gradedFootage317.parentFolder = fromGradingFolder;
        gradedFootage317.name = "UNDLM_00317bis";
        gradingSources[317] = gradedFootage317;
        gradingImportCount++;
        gradedImportSuccess317 = true;
        gradedFileName317 = "UNDLM_00317bis.mov";
        logImportSuccess(317, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00317bis.mov", gradedFileName317);
    } catch (e) {
        logImportError(317, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00317bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess317) {
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


// Composition pour plan 00310
var planComp310 = project.items.addComp(
    "SQ18_UNDLM_00310_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp310.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer310 = planComp310.layers.add(bgSolidComp);
bgLayer310.name = "BG_SOLID";
bgLayer310.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer310 = false;
if (gradingSources[310]) {
    var gradedLayer310 = planComp310.layers.add(gradingSources[310]);
    gradedLayer310.name = "UNDLM_00310_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer310.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer310.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer310 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer310 = false;
if (editSources[310]) {
    var editLayer310 = planComp310.layers.add(editSources[310]);
    editLayer310.name = "UNDLM_00310_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer310.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer310.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer310 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity310 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer310) {
    // EDIT toujours activé quand disponible
    editLayer310.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer310) {
        gradedLayer310.enabled = false;
    }
} else if (hasGradedLayer310) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer310.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText310 = planComp310.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText310.name = "WARNING_NO_EDIT";
    warningText310.property("Transform").property("Position").setValue([1280, 200]);
    warningText310.guideLayer = true;
    
    var warningTextDoc310 = warningText310.property("Source Text").value;
    warningTextDoc310.fontSize = 32;
    warningTextDoc310.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc310.font = "Arial-BoldMT";
    warningTextDoc310.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText310.property("Source Text").setValue(warningTextDoc310);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText310 = planComp310.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00310");
    errorText310.name = "ERROR_NO_SOURCE";
    errorText310.property("Transform").property("Position").setValue([1280, 720]);
    errorText310.guideLayer = true;
    
    var errorTextDoc310 = errorText310.property("Source Text").value;
    errorTextDoc310.fontSize = 48;
    errorTextDoc310.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc310.font = "Arial-BoldMT";
    errorTextDoc310.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText310.property("Source Text").setValue(errorTextDoc310);
}

planCompositions[310] = planComp310;


// Composition pour plan 00311
var planComp311 = project.items.addComp(
    "SQ18_UNDLM_00311_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp311.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer311 = planComp311.layers.add(bgSolidComp);
bgLayer311.name = "BG_SOLID";
bgLayer311.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer311 = false;
if (gradingSources[311]) {
    var gradedLayer311 = planComp311.layers.add(gradingSources[311]);
    gradedLayer311.name = "UNDLM_00311_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer311.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer311.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer311 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer311 = false;
if (editSources[311]) {
    var editLayer311 = planComp311.layers.add(editSources[311]);
    editLayer311.name = "UNDLM_00311_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer311.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer311.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer311 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity311 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer311) {
    // EDIT toujours activé quand disponible
    editLayer311.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer311) {
        gradedLayer311.enabled = false;
    }
} else if (hasGradedLayer311) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer311.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText311 = planComp311.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText311.name = "WARNING_NO_EDIT";
    warningText311.property("Transform").property("Position").setValue([1280, 200]);
    warningText311.guideLayer = true;
    
    var warningTextDoc311 = warningText311.property("Source Text").value;
    warningTextDoc311.fontSize = 32;
    warningTextDoc311.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc311.font = "Arial-BoldMT";
    warningTextDoc311.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText311.property("Source Text").setValue(warningTextDoc311);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText311 = planComp311.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00311");
    errorText311.name = "ERROR_NO_SOURCE";
    errorText311.property("Transform").property("Position").setValue([1280, 720]);
    errorText311.guideLayer = true;
    
    var errorTextDoc311 = errorText311.property("Source Text").value;
    errorTextDoc311.fontSize = 48;
    errorTextDoc311.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc311.font = "Arial-BoldMT";
    errorTextDoc311.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText311.property("Source Text").setValue(errorTextDoc311);
}

planCompositions[311] = planComp311;


// Composition pour plan 00312
var planComp312 = project.items.addComp(
    "SQ18_UNDLM_00312_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    19.32,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp312.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer312 = planComp312.layers.add(bgSolidComp);
bgLayer312.name = "BG_SOLID";
bgLayer312.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer312 = false;
if (gradingSources[312]) {
    var gradedLayer312 = planComp312.layers.add(gradingSources[312]);
    gradedLayer312.name = "UNDLM_00312_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer312.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer312.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer312 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer312 = false;
if (editSources[312]) {
    var editLayer312 = planComp312.layers.add(editSources[312]);
    editLayer312.name = "UNDLM_00312_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer312.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer312.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer312 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity312 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer312) {
    // EDIT toujours activé quand disponible
    editLayer312.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer312) {
        gradedLayer312.enabled = false;
    }
} else if (hasGradedLayer312) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer312.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText312 = planComp312.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText312.name = "WARNING_NO_EDIT";
    warningText312.property("Transform").property("Position").setValue([1280, 200]);
    warningText312.guideLayer = true;
    
    var warningTextDoc312 = warningText312.property("Source Text").value;
    warningTextDoc312.fontSize = 32;
    warningTextDoc312.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc312.font = "Arial-BoldMT";
    warningTextDoc312.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText312.property("Source Text").setValue(warningTextDoc312);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText312 = planComp312.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00312");
    errorText312.name = "ERROR_NO_SOURCE";
    errorText312.property("Transform").property("Position").setValue([1280, 720]);
    errorText312.guideLayer = true;
    
    var errorTextDoc312 = errorText312.property("Source Text").value;
    errorTextDoc312.fontSize = 48;
    errorTextDoc312.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc312.font = "Arial-BoldMT";
    errorTextDoc312.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText312.property("Source Text").setValue(errorTextDoc312);
}

planCompositions[312] = planComp312;


// Composition pour plan 00313
var planComp313 = project.items.addComp(
    "SQ18_UNDLM_00313_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.56,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp313.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer313 = planComp313.layers.add(bgSolidComp);
bgLayer313.name = "BG_SOLID";
bgLayer313.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer313 = false;
if (gradingSources[313]) {
    var gradedLayer313 = planComp313.layers.add(gradingSources[313]);
    gradedLayer313.name = "UNDLM_00313_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer313.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer313.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer313 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer313 = false;
if (editSources[313]) {
    var editLayer313 = planComp313.layers.add(editSources[313]);
    editLayer313.name = "UNDLM_00313_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer313.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer313.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer313 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity313 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer313) {
    // EDIT toujours activé quand disponible
    editLayer313.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer313) {
        gradedLayer313.enabled = false;
    }
} else if (hasGradedLayer313) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer313.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText313 = planComp313.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText313.name = "WARNING_NO_EDIT";
    warningText313.property("Transform").property("Position").setValue([1280, 200]);
    warningText313.guideLayer = true;
    
    var warningTextDoc313 = warningText313.property("Source Text").value;
    warningTextDoc313.fontSize = 32;
    warningTextDoc313.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc313.font = "Arial-BoldMT";
    warningTextDoc313.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText313.property("Source Text").setValue(warningTextDoc313);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText313 = planComp313.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00313");
    errorText313.name = "ERROR_NO_SOURCE";
    errorText313.property("Transform").property("Position").setValue([1280, 720]);
    errorText313.guideLayer = true;
    
    var errorTextDoc313 = errorText313.property("Source Text").value;
    errorTextDoc313.fontSize = 48;
    errorTextDoc313.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc313.font = "Arial-BoldMT";
    errorTextDoc313.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText313.property("Source Text").setValue(errorTextDoc313);
}

planCompositions[313] = planComp313;


// Composition pour plan 00314
var planComp314 = project.items.addComp(
    "SQ18_UNDLM_00314_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp314.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer314 = planComp314.layers.add(bgSolidComp);
bgLayer314.name = "BG_SOLID";
bgLayer314.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer314 = false;
if (gradingSources[314]) {
    var gradedLayer314 = planComp314.layers.add(gradingSources[314]);
    gradedLayer314.name = "UNDLM_00314_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer314.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer314.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer314 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer314 = false;
if (editSources[314]) {
    var editLayer314 = planComp314.layers.add(editSources[314]);
    editLayer314.name = "UNDLM_00314_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer314.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer314.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer314 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity314 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer314) {
    // EDIT toujours activé quand disponible
    editLayer314.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer314) {
        gradedLayer314.enabled = false;
    }
} else if (hasGradedLayer314) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer314.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText314 = planComp314.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText314.name = "WARNING_NO_EDIT";
    warningText314.property("Transform").property("Position").setValue([1280, 200]);
    warningText314.guideLayer = true;
    
    var warningTextDoc314 = warningText314.property("Source Text").value;
    warningTextDoc314.fontSize = 32;
    warningTextDoc314.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc314.font = "Arial-BoldMT";
    warningTextDoc314.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText314.property("Source Text").setValue(warningTextDoc314);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText314 = planComp314.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00314");
    errorText314.name = "ERROR_NO_SOURCE";
    errorText314.property("Transform").property("Position").setValue([1280, 720]);
    errorText314.guideLayer = true;
    
    var errorTextDoc314 = errorText314.property("Source Text").value;
    errorTextDoc314.fontSize = 48;
    errorTextDoc314.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc314.font = "Arial-BoldMT";
    errorTextDoc314.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText314.property("Source Text").setValue(errorTextDoc314);
}

planCompositions[314] = planComp314;


// Composition pour plan 00315
var planComp315 = project.items.addComp(
    "SQ18_UNDLM_00315_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    12.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp315.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer315 = planComp315.layers.add(bgSolidComp);
bgLayer315.name = "BG_SOLID";
bgLayer315.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer315 = false;
if (gradingSources[315]) {
    var gradedLayer315 = planComp315.layers.add(gradingSources[315]);
    gradedLayer315.name = "UNDLM_00315_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer315.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer315.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer315 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer315 = false;
if (editSources[315]) {
    var editLayer315 = planComp315.layers.add(editSources[315]);
    editLayer315.name = "UNDLM_00315_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer315.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer315.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer315 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity315 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer315) {
    // EDIT toujours activé quand disponible
    editLayer315.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer315) {
        gradedLayer315.enabled = false;
    }
} else if (hasGradedLayer315) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer315.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText315 = planComp315.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText315.name = "WARNING_NO_EDIT";
    warningText315.property("Transform").property("Position").setValue([1280, 200]);
    warningText315.guideLayer = true;
    
    var warningTextDoc315 = warningText315.property("Source Text").value;
    warningTextDoc315.fontSize = 32;
    warningTextDoc315.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc315.font = "Arial-BoldMT";
    warningTextDoc315.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText315.property("Source Text").setValue(warningTextDoc315);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText315 = planComp315.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00315");
    errorText315.name = "ERROR_NO_SOURCE";
    errorText315.property("Transform").property("Position").setValue([1280, 720]);
    errorText315.guideLayer = true;
    
    var errorTextDoc315 = errorText315.property("Source Text").value;
    errorTextDoc315.fontSize = 48;
    errorTextDoc315.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc315.font = "Arial-BoldMT";
    errorTextDoc315.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText315.property("Source Text").setValue(errorTextDoc315);
}

planCompositions[315] = planComp315;


// Composition pour plan 00316
var planComp316 = project.items.addComp(
    "SQ18_UNDLM_00316_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    26.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp316.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer316 = planComp316.layers.add(bgSolidComp);
bgLayer316.name = "BG_SOLID";
bgLayer316.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer316 = false;
if (gradingSources[316]) {
    var gradedLayer316 = planComp316.layers.add(gradingSources[316]);
    gradedLayer316.name = "UNDLM_00316_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer316.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer316.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer316 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer316 = false;
if (editSources[316]) {
    var editLayer316 = planComp316.layers.add(editSources[316]);
    editLayer316.name = "UNDLM_00316_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer316.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer316.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer316 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity316 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer316) {
    // EDIT toujours activé quand disponible
    editLayer316.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer316) {
        gradedLayer316.enabled = false;
    }
} else if (hasGradedLayer316) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer316.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText316 = planComp316.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText316.name = "WARNING_NO_EDIT";
    warningText316.property("Transform").property("Position").setValue([1280, 200]);
    warningText316.guideLayer = true;
    
    var warningTextDoc316 = warningText316.property("Source Text").value;
    warningTextDoc316.fontSize = 32;
    warningTextDoc316.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc316.font = "Arial-BoldMT";
    warningTextDoc316.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText316.property("Source Text").setValue(warningTextDoc316);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText316 = planComp316.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00316");
    errorText316.name = "ERROR_NO_SOURCE";
    errorText316.property("Transform").property("Position").setValue([1280, 720]);
    errorText316.guideLayer = true;
    
    var errorTextDoc316 = errorText316.property("Source Text").value;
    errorTextDoc316.fontSize = 48;
    errorTextDoc316.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc316.font = "Arial-BoldMT";
    errorTextDoc316.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText316.property("Source Text").setValue(errorTextDoc316);
}

planCompositions[316] = planComp316;


// Composition pour plan 00317
var planComp317 = project.items.addComp(
    "SQ18_UNDLM_00317_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp317.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer317 = planComp317.layers.add(bgSolidComp);
bgLayer317.name = "BG_SOLID";
bgLayer317.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer317 = false;
if (gradingSources[317]) {
    var gradedLayer317 = planComp317.layers.add(gradingSources[317]);
    gradedLayer317.name = "UNDLM_00317_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer317.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer317.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer317 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer317 = false;
if (editSources[317]) {
    var editLayer317 = planComp317.layers.add(editSources[317]);
    editLayer317.name = "UNDLM_00317_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer317.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer317.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer317 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity317 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer317) {
    // EDIT toujours activé quand disponible
    editLayer317.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer317) {
        gradedLayer317.enabled = false;
    }
} else if (hasGradedLayer317) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer317.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText317 = planComp317.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText317.name = "WARNING_NO_EDIT";
    warningText317.property("Transform").property("Position").setValue([1280, 200]);
    warningText317.guideLayer = true;
    
    var warningTextDoc317 = warningText317.property("Source Text").value;
    warningTextDoc317.fontSize = 32;
    warningTextDoc317.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc317.font = "Arial-BoldMT";
    warningTextDoc317.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText317.property("Source Text").setValue(warningTextDoc317);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText317 = planComp317.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00317");
    errorText317.name = "ERROR_NO_SOURCE";
    errorText317.property("Transform").property("Position").setValue([1280, 720]);
    errorText317.guideLayer = true;
    
    var errorTextDoc317 = errorText317.property("Source Text").value;
    errorTextDoc317.fontSize = 48;
    errorTextDoc317.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc317.font = "Arial-BoldMT";
    errorTextDoc317.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText317.property("Source Text").setValue(errorTextDoc317);
}

planCompositions[317] = planComp317;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ18_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    98.36, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00310 à la timeline master
if (planCompositions[310]) {
    var masterLayer310 = masterComp.layers.add(planCompositions[310]);
    masterLayer310.startTime = 0;
    masterLayer310.name = "UNDLM_00310";
    masterLayer310.label = 1; // Couleurs alternées
}

// Ajouter plan 00311 à la timeline master
if (planCompositions[311]) {
    var masterLayer311 = masterComp.layers.add(planCompositions[311]);
    masterLayer311.startTime = 10.48;
    masterLayer311.name = "UNDLM_00311";
    masterLayer311.label = 2; // Couleurs alternées
}

// Ajouter plan 00312 à la timeline master
if (planCompositions[312]) {
    var masterLayer312 = masterComp.layers.add(planCompositions[312]);
    masterLayer312.startTime = 14.440000000000001;
    masterLayer312.name = "UNDLM_00312";
    masterLayer312.label = 3; // Couleurs alternées
}

// Ajouter plan 00313 à la timeline master
if (planCompositions[313]) {
    var masterLayer313 = masterComp.layers.add(planCompositions[313]);
    masterLayer313.startTime = 33.760000000000005;
    masterLayer313.name = "UNDLM_00313";
    masterLayer313.label = 4; // Couleurs alternées
}

// Ajouter plan 00314 à la timeline master
if (planCompositions[314]) {
    var masterLayer314 = masterComp.layers.add(planCompositions[314]);
    masterLayer314.startTime = 42.32000000000001;
    masterLayer314.name = "UNDLM_00314";
    masterLayer314.label = 5; // Couleurs alternées
}

// Ajouter plan 00315 à la timeline master
if (planCompositions[315]) {
    var masterLayer315 = masterComp.layers.add(planCompositions[315]);
    masterLayer315.startTime = 53.040000000000006;
    masterLayer315.name = "UNDLM_00315";
    masterLayer315.label = 6; // Couleurs alternées
}

// Ajouter plan 00316 à la timeline master
if (planCompositions[316]) {
    var masterLayer316 = masterComp.layers.add(planCompositions[316]);
    masterLayer316.startTime = 65.64;
    masterLayer316.name = "UNDLM_00316";
    masterLayer316.label = 7; // Couleurs alternées
}

// Ajouter plan 00317 à la timeline master
if (planCompositions[317]) {
    var masterLayer317 = masterComp.layers.add(planCompositions[317]);
    masterLayer317.startTime = 92.36;
    masterLayer317.name = "UNDLM_00317";
    masterLayer317.label = 8; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ18";\n' +
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
    {start: 0, end: 10.48, name: "UNDLM_00310"},
    {start: 10.48, end: 14.440000000000001, name: "UNDLM_00311"},
    {start: 14.440000000000001, end: 33.760000000000005, name: "UNDLM_00312"},
    {start: 33.760000000000005, end: 42.32000000000001, name: "UNDLM_00313"},
    {start: 42.32000000000001, end: 53.040000000000006, name: "UNDLM_00314"},
    {start: 53.040000000000006, end: 65.64, name: "UNDLM_00315"},
    {start: 65.64, end: 92.36, name: "UNDLM_00316"},
    {start: 92.36, end: 98.36, name: "UNDLM_00317"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ18/_AE/SQ18_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 8;
var totalCount = 8;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ18 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(98.36 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ18_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ18:" + totalCount + ":" + gradedCount);
