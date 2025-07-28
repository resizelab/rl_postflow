
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ07 avec 19 plans
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


// Import plan EDIT 00146
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile146 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00146.mov");
var editFilePoignees146 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00146_AVEC_POIGNEES.mov");
var editFileBis146 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00146bis.mov");

var importSuccess146 = false;
var fileName146 = "";

// Tenter import standard
if (editFile146.exists) {
    try {
        var editFootage146 = project.importFile(new ImportOptions(editFile146));
        editFootage146.parentFolder = fromEditFolder;
        editFootage146.name = "UNDLM_00146";
        editSources[146] = editFootage146;
        editImportCount++;
        importSuccess146 = true;
        fileName146 = "UNDLM_00146.mov";
        logImportSuccess(146, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00146.mov", fileName146);
    } catch (e) {
        logImportError(146, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00146.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess146 && editFilePoignees146.exists) {
    try {
        var editFootage146 = project.importFile(new ImportOptions(editFilePoignees146));
        editFootage146.parentFolder = fromEditFolder;
        editFootage146.name = "UNDLM_00146_AVEC_POIGNEES";
        editSources[146] = editFootage146;
        editImportCount++;
        importSuccess146 = true;
        fileName146 = "UNDLM_00146_AVEC_POIGNEES.mov";
        logImportSuccess(146, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00146_AVEC_POIGNEES.mov", fileName146);
    } catch (e) {
        logImportError(146, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00146_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess146 && editFileBis146.exists) {
    try {
        var editFootage146 = project.importFile(new ImportOptions(editFileBis146));
        editFootage146.parentFolder = fromEditFolder;
        editFootage146.name = "UNDLM_00146bis";
        editSources[146] = editFootage146;
        editImportCount++;
        importSuccess146 = true;
        fileName146 = "UNDLM_00146bis.mov";
        logImportSuccess(146, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00146bis.mov", fileName146);
    } catch (e) {
        logImportError(146, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00146bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess146) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00146.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00147
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile147 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00147.mov");
var editFilePoignees147 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00147_AVEC_POIGNEES.mov");
var editFileBis147 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00147bis.mov");

var importSuccess147 = false;
var fileName147 = "";

// Tenter import standard
if (editFile147.exists) {
    try {
        var editFootage147 = project.importFile(new ImportOptions(editFile147));
        editFootage147.parentFolder = fromEditFolder;
        editFootage147.name = "UNDLM_00147";
        editSources[147] = editFootage147;
        editImportCount++;
        importSuccess147 = true;
        fileName147 = "UNDLM_00147.mov";
        logImportSuccess(147, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00147.mov", fileName147);
    } catch (e) {
        logImportError(147, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00147.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess147 && editFilePoignees147.exists) {
    try {
        var editFootage147 = project.importFile(new ImportOptions(editFilePoignees147));
        editFootage147.parentFolder = fromEditFolder;
        editFootage147.name = "UNDLM_00147_AVEC_POIGNEES";
        editSources[147] = editFootage147;
        editImportCount++;
        importSuccess147 = true;
        fileName147 = "UNDLM_00147_AVEC_POIGNEES.mov";
        logImportSuccess(147, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00147_AVEC_POIGNEES.mov", fileName147);
    } catch (e) {
        logImportError(147, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00147_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess147 && editFileBis147.exists) {
    try {
        var editFootage147 = project.importFile(new ImportOptions(editFileBis147));
        editFootage147.parentFolder = fromEditFolder;
        editFootage147.name = "UNDLM_00147bis";
        editSources[147] = editFootage147;
        editImportCount++;
        importSuccess147 = true;
        fileName147 = "UNDLM_00147bis.mov";
        logImportSuccess(147, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00147bis.mov", fileName147);
    } catch (e) {
        logImportError(147, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00147bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess147) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00147.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00148
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile148 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00148.mov");
var editFilePoignees148 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00148_AVEC_POIGNEES.mov");
var editFileBis148 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00148bis.mov");

var importSuccess148 = false;
var fileName148 = "";

// Tenter import standard
if (editFile148.exists) {
    try {
        var editFootage148 = project.importFile(new ImportOptions(editFile148));
        editFootage148.parentFolder = fromEditFolder;
        editFootage148.name = "UNDLM_00148";
        editSources[148] = editFootage148;
        editImportCount++;
        importSuccess148 = true;
        fileName148 = "UNDLM_00148.mov";
        logImportSuccess(148, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00148.mov", fileName148);
    } catch (e) {
        logImportError(148, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00148.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess148 && editFilePoignees148.exists) {
    try {
        var editFootage148 = project.importFile(new ImportOptions(editFilePoignees148));
        editFootage148.parentFolder = fromEditFolder;
        editFootage148.name = "UNDLM_00148_AVEC_POIGNEES";
        editSources[148] = editFootage148;
        editImportCount++;
        importSuccess148 = true;
        fileName148 = "UNDLM_00148_AVEC_POIGNEES.mov";
        logImportSuccess(148, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00148_AVEC_POIGNEES.mov", fileName148);
    } catch (e) {
        logImportError(148, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00148_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess148 && editFileBis148.exists) {
    try {
        var editFootage148 = project.importFile(new ImportOptions(editFileBis148));
        editFootage148.parentFolder = fromEditFolder;
        editFootage148.name = "UNDLM_00148bis";
        editSources[148] = editFootage148;
        editImportCount++;
        importSuccess148 = true;
        fileName148 = "UNDLM_00148bis.mov";
        logImportSuccess(148, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00148bis.mov", fileName148);
    } catch (e) {
        logImportError(148, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00148bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess148) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00148.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00149
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile149 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00149.mov");
var editFilePoignees149 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00149_AVEC_POIGNEES.mov");
var editFileBis149 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00149bis.mov");

var importSuccess149 = false;
var fileName149 = "";

// Tenter import standard
if (editFile149.exists) {
    try {
        var editFootage149 = project.importFile(new ImportOptions(editFile149));
        editFootage149.parentFolder = fromEditFolder;
        editFootage149.name = "UNDLM_00149";
        editSources[149] = editFootage149;
        editImportCount++;
        importSuccess149 = true;
        fileName149 = "UNDLM_00149.mov";
        logImportSuccess(149, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00149.mov", fileName149);
    } catch (e) {
        logImportError(149, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00149.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess149 && editFilePoignees149.exists) {
    try {
        var editFootage149 = project.importFile(new ImportOptions(editFilePoignees149));
        editFootage149.parentFolder = fromEditFolder;
        editFootage149.name = "UNDLM_00149_AVEC_POIGNEES";
        editSources[149] = editFootage149;
        editImportCount++;
        importSuccess149 = true;
        fileName149 = "UNDLM_00149_AVEC_POIGNEES.mov";
        logImportSuccess(149, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00149_AVEC_POIGNEES.mov", fileName149);
    } catch (e) {
        logImportError(149, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00149_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess149 && editFileBis149.exists) {
    try {
        var editFootage149 = project.importFile(new ImportOptions(editFileBis149));
        editFootage149.parentFolder = fromEditFolder;
        editFootage149.name = "UNDLM_00149bis";
        editSources[149] = editFootage149;
        editImportCount++;
        importSuccess149 = true;
        fileName149 = "UNDLM_00149bis.mov";
        logImportSuccess(149, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00149bis.mov", fileName149);
    } catch (e) {
        logImportError(149, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00149bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess149) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00149.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00150
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile150 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00150.mov");
var editFilePoignees150 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00150_AVEC_POIGNEES.mov");
var editFileBis150 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00150bis.mov");

var importSuccess150 = false;
var fileName150 = "";

// Tenter import standard
if (editFile150.exists) {
    try {
        var editFootage150 = project.importFile(new ImportOptions(editFile150));
        editFootage150.parentFolder = fromEditFolder;
        editFootage150.name = "UNDLM_00150";
        editSources[150] = editFootage150;
        editImportCount++;
        importSuccess150 = true;
        fileName150 = "UNDLM_00150.mov";
        logImportSuccess(150, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00150.mov", fileName150);
    } catch (e) {
        logImportError(150, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00150.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess150 && editFilePoignees150.exists) {
    try {
        var editFootage150 = project.importFile(new ImportOptions(editFilePoignees150));
        editFootage150.parentFolder = fromEditFolder;
        editFootage150.name = "UNDLM_00150_AVEC_POIGNEES";
        editSources[150] = editFootage150;
        editImportCount++;
        importSuccess150 = true;
        fileName150 = "UNDLM_00150_AVEC_POIGNEES.mov";
        logImportSuccess(150, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00150_AVEC_POIGNEES.mov", fileName150);
    } catch (e) {
        logImportError(150, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00150_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess150 && editFileBis150.exists) {
    try {
        var editFootage150 = project.importFile(new ImportOptions(editFileBis150));
        editFootage150.parentFolder = fromEditFolder;
        editFootage150.name = "UNDLM_00150bis";
        editSources[150] = editFootage150;
        editImportCount++;
        importSuccess150 = true;
        fileName150 = "UNDLM_00150bis.mov";
        logImportSuccess(150, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00150bis.mov", fileName150);
    } catch (e) {
        logImportError(150, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00150bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess150) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00150.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00151
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile151 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00151.mov");
var editFilePoignees151 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00151_AVEC_POIGNEES.mov");
var editFileBis151 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00151bis.mov");

var importSuccess151 = false;
var fileName151 = "";

// Tenter import standard
if (editFile151.exists) {
    try {
        var editFootage151 = project.importFile(new ImportOptions(editFile151));
        editFootage151.parentFolder = fromEditFolder;
        editFootage151.name = "UNDLM_00151";
        editSources[151] = editFootage151;
        editImportCount++;
        importSuccess151 = true;
        fileName151 = "UNDLM_00151.mov";
        logImportSuccess(151, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00151.mov", fileName151);
    } catch (e) {
        logImportError(151, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00151.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess151 && editFilePoignees151.exists) {
    try {
        var editFootage151 = project.importFile(new ImportOptions(editFilePoignees151));
        editFootage151.parentFolder = fromEditFolder;
        editFootage151.name = "UNDLM_00151_AVEC_POIGNEES";
        editSources[151] = editFootage151;
        editImportCount++;
        importSuccess151 = true;
        fileName151 = "UNDLM_00151_AVEC_POIGNEES.mov";
        logImportSuccess(151, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00151_AVEC_POIGNEES.mov", fileName151);
    } catch (e) {
        logImportError(151, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00151_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess151 && editFileBis151.exists) {
    try {
        var editFootage151 = project.importFile(new ImportOptions(editFileBis151));
        editFootage151.parentFolder = fromEditFolder;
        editFootage151.name = "UNDLM_00151bis";
        editSources[151] = editFootage151;
        editImportCount++;
        importSuccess151 = true;
        fileName151 = "UNDLM_00151bis.mov";
        logImportSuccess(151, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00151bis.mov", fileName151);
    } catch (e) {
        logImportError(151, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00151bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess151) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00151.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00152
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile152 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00152.mov");
var editFilePoignees152 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00152_AVEC_POIGNEES.mov");
var editFileBis152 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00152bis.mov");

var importSuccess152 = false;
var fileName152 = "";

// Tenter import standard
if (editFile152.exists) {
    try {
        var editFootage152 = project.importFile(new ImportOptions(editFile152));
        editFootage152.parentFolder = fromEditFolder;
        editFootage152.name = "UNDLM_00152";
        editSources[152] = editFootage152;
        editImportCount++;
        importSuccess152 = true;
        fileName152 = "UNDLM_00152.mov";
        logImportSuccess(152, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00152.mov", fileName152);
    } catch (e) {
        logImportError(152, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00152.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess152 && editFilePoignees152.exists) {
    try {
        var editFootage152 = project.importFile(new ImportOptions(editFilePoignees152));
        editFootage152.parentFolder = fromEditFolder;
        editFootage152.name = "UNDLM_00152_AVEC_POIGNEES";
        editSources[152] = editFootage152;
        editImportCount++;
        importSuccess152 = true;
        fileName152 = "UNDLM_00152_AVEC_POIGNEES.mov";
        logImportSuccess(152, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00152_AVEC_POIGNEES.mov", fileName152);
    } catch (e) {
        logImportError(152, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00152_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess152 && editFileBis152.exists) {
    try {
        var editFootage152 = project.importFile(new ImportOptions(editFileBis152));
        editFootage152.parentFolder = fromEditFolder;
        editFootage152.name = "UNDLM_00152bis";
        editSources[152] = editFootage152;
        editImportCount++;
        importSuccess152 = true;
        fileName152 = "UNDLM_00152bis.mov";
        logImportSuccess(152, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00152bis.mov", fileName152);
    } catch (e) {
        logImportError(152, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00152bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess152) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00152.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00153
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile153 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00153.mov");
var editFilePoignees153 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00153_AVEC_POIGNEES.mov");
var editFileBis153 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00153bis.mov");

var importSuccess153 = false;
var fileName153 = "";

// Tenter import standard
if (editFile153.exists) {
    try {
        var editFootage153 = project.importFile(new ImportOptions(editFile153));
        editFootage153.parentFolder = fromEditFolder;
        editFootage153.name = "UNDLM_00153";
        editSources[153] = editFootage153;
        editImportCount++;
        importSuccess153 = true;
        fileName153 = "UNDLM_00153.mov";
        logImportSuccess(153, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00153.mov", fileName153);
    } catch (e) {
        logImportError(153, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00153.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess153 && editFilePoignees153.exists) {
    try {
        var editFootage153 = project.importFile(new ImportOptions(editFilePoignees153));
        editFootage153.parentFolder = fromEditFolder;
        editFootage153.name = "UNDLM_00153_AVEC_POIGNEES";
        editSources[153] = editFootage153;
        editImportCount++;
        importSuccess153 = true;
        fileName153 = "UNDLM_00153_AVEC_POIGNEES.mov";
        logImportSuccess(153, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00153_AVEC_POIGNEES.mov", fileName153);
    } catch (e) {
        logImportError(153, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00153_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess153 && editFileBis153.exists) {
    try {
        var editFootage153 = project.importFile(new ImportOptions(editFileBis153));
        editFootage153.parentFolder = fromEditFolder;
        editFootage153.name = "UNDLM_00153bis";
        editSources[153] = editFootage153;
        editImportCount++;
        importSuccess153 = true;
        fileName153 = "UNDLM_00153bis.mov";
        logImportSuccess(153, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00153bis.mov", fileName153);
    } catch (e) {
        logImportError(153, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00153bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess153) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00153.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00154
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile154 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00154.mov");
var editFilePoignees154 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00154_AVEC_POIGNEES.mov");
var editFileBis154 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00154bis.mov");

var importSuccess154 = false;
var fileName154 = "";

// Tenter import standard
if (editFile154.exists) {
    try {
        var editFootage154 = project.importFile(new ImportOptions(editFile154));
        editFootage154.parentFolder = fromEditFolder;
        editFootage154.name = "UNDLM_00154";
        editSources[154] = editFootage154;
        editImportCount++;
        importSuccess154 = true;
        fileName154 = "UNDLM_00154.mov";
        logImportSuccess(154, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00154.mov", fileName154);
    } catch (e) {
        logImportError(154, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00154.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess154 && editFilePoignees154.exists) {
    try {
        var editFootage154 = project.importFile(new ImportOptions(editFilePoignees154));
        editFootage154.parentFolder = fromEditFolder;
        editFootage154.name = "UNDLM_00154_AVEC_POIGNEES";
        editSources[154] = editFootage154;
        editImportCount++;
        importSuccess154 = true;
        fileName154 = "UNDLM_00154_AVEC_POIGNEES.mov";
        logImportSuccess(154, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00154_AVEC_POIGNEES.mov", fileName154);
    } catch (e) {
        logImportError(154, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00154_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess154 && editFileBis154.exists) {
    try {
        var editFootage154 = project.importFile(new ImportOptions(editFileBis154));
        editFootage154.parentFolder = fromEditFolder;
        editFootage154.name = "UNDLM_00154bis";
        editSources[154] = editFootage154;
        editImportCount++;
        importSuccess154 = true;
        fileName154 = "UNDLM_00154bis.mov";
        logImportSuccess(154, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00154bis.mov", fileName154);
    } catch (e) {
        logImportError(154, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00154bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess154) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00154.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00155
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile155 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00155.mov");
var editFilePoignees155 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00155_AVEC_POIGNEES.mov");
var editFileBis155 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00155bis.mov");

var importSuccess155 = false;
var fileName155 = "";

// Tenter import standard
if (editFile155.exists) {
    try {
        var editFootage155 = project.importFile(new ImportOptions(editFile155));
        editFootage155.parentFolder = fromEditFolder;
        editFootage155.name = "UNDLM_00155";
        editSources[155] = editFootage155;
        editImportCount++;
        importSuccess155 = true;
        fileName155 = "UNDLM_00155.mov";
        logImportSuccess(155, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00155.mov", fileName155);
    } catch (e) {
        logImportError(155, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00155.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess155 && editFilePoignees155.exists) {
    try {
        var editFootage155 = project.importFile(new ImportOptions(editFilePoignees155));
        editFootage155.parentFolder = fromEditFolder;
        editFootage155.name = "UNDLM_00155_AVEC_POIGNEES";
        editSources[155] = editFootage155;
        editImportCount++;
        importSuccess155 = true;
        fileName155 = "UNDLM_00155_AVEC_POIGNEES.mov";
        logImportSuccess(155, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00155_AVEC_POIGNEES.mov", fileName155);
    } catch (e) {
        logImportError(155, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00155_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess155 && editFileBis155.exists) {
    try {
        var editFootage155 = project.importFile(new ImportOptions(editFileBis155));
        editFootage155.parentFolder = fromEditFolder;
        editFootage155.name = "UNDLM_00155bis";
        editSources[155] = editFootage155;
        editImportCount++;
        importSuccess155 = true;
        fileName155 = "UNDLM_00155bis.mov";
        logImportSuccess(155, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00155bis.mov", fileName155);
    } catch (e) {
        logImportError(155, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00155bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess155) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00155.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00156
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile156 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00156.mov");
var editFilePoignees156 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00156_AVEC_POIGNEES.mov");
var editFileBis156 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00156bis.mov");

var importSuccess156 = false;
var fileName156 = "";

// Tenter import standard
if (editFile156.exists) {
    try {
        var editFootage156 = project.importFile(new ImportOptions(editFile156));
        editFootage156.parentFolder = fromEditFolder;
        editFootage156.name = "UNDLM_00156";
        editSources[156] = editFootage156;
        editImportCount++;
        importSuccess156 = true;
        fileName156 = "UNDLM_00156.mov";
        logImportSuccess(156, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00156.mov", fileName156);
    } catch (e) {
        logImportError(156, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00156.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess156 && editFilePoignees156.exists) {
    try {
        var editFootage156 = project.importFile(new ImportOptions(editFilePoignees156));
        editFootage156.parentFolder = fromEditFolder;
        editFootage156.name = "UNDLM_00156_AVEC_POIGNEES";
        editSources[156] = editFootage156;
        editImportCount++;
        importSuccess156 = true;
        fileName156 = "UNDLM_00156_AVEC_POIGNEES.mov";
        logImportSuccess(156, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00156_AVEC_POIGNEES.mov", fileName156);
    } catch (e) {
        logImportError(156, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00156_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess156 && editFileBis156.exists) {
    try {
        var editFootage156 = project.importFile(new ImportOptions(editFileBis156));
        editFootage156.parentFolder = fromEditFolder;
        editFootage156.name = "UNDLM_00156bis";
        editSources[156] = editFootage156;
        editImportCount++;
        importSuccess156 = true;
        fileName156 = "UNDLM_00156bis.mov";
        logImportSuccess(156, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00156bis.mov", fileName156);
    } catch (e) {
        logImportError(156, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00156bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess156) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00156.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00157
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile157 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00157.mov");
var editFilePoignees157 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00157_AVEC_POIGNEES.mov");
var editFileBis157 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00157bis.mov");

var importSuccess157 = false;
var fileName157 = "";

// Tenter import standard
if (editFile157.exists) {
    try {
        var editFootage157 = project.importFile(new ImportOptions(editFile157));
        editFootage157.parentFolder = fromEditFolder;
        editFootage157.name = "UNDLM_00157";
        editSources[157] = editFootage157;
        editImportCount++;
        importSuccess157 = true;
        fileName157 = "UNDLM_00157.mov";
        logImportSuccess(157, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00157.mov", fileName157);
    } catch (e) {
        logImportError(157, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00157.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess157 && editFilePoignees157.exists) {
    try {
        var editFootage157 = project.importFile(new ImportOptions(editFilePoignees157));
        editFootage157.parentFolder = fromEditFolder;
        editFootage157.name = "UNDLM_00157_AVEC_POIGNEES";
        editSources[157] = editFootage157;
        editImportCount++;
        importSuccess157 = true;
        fileName157 = "UNDLM_00157_AVEC_POIGNEES.mov";
        logImportSuccess(157, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00157_AVEC_POIGNEES.mov", fileName157);
    } catch (e) {
        logImportError(157, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00157_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess157 && editFileBis157.exists) {
    try {
        var editFootage157 = project.importFile(new ImportOptions(editFileBis157));
        editFootage157.parentFolder = fromEditFolder;
        editFootage157.name = "UNDLM_00157bis";
        editSources[157] = editFootage157;
        editImportCount++;
        importSuccess157 = true;
        fileName157 = "UNDLM_00157bis.mov";
        logImportSuccess(157, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00157bis.mov", fileName157);
    } catch (e) {
        logImportError(157, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00157bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess157) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00157.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00158
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile158 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00158.mov");
var editFilePoignees158 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00158_AVEC_POIGNEES.mov");
var editFileBis158 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00158bis.mov");

var importSuccess158 = false;
var fileName158 = "";

// Tenter import standard
if (editFile158.exists) {
    try {
        var editFootage158 = project.importFile(new ImportOptions(editFile158));
        editFootage158.parentFolder = fromEditFolder;
        editFootage158.name = "UNDLM_00158";
        editSources[158] = editFootage158;
        editImportCount++;
        importSuccess158 = true;
        fileName158 = "UNDLM_00158.mov";
        logImportSuccess(158, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00158.mov", fileName158);
    } catch (e) {
        logImportError(158, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00158.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess158 && editFilePoignees158.exists) {
    try {
        var editFootage158 = project.importFile(new ImportOptions(editFilePoignees158));
        editFootage158.parentFolder = fromEditFolder;
        editFootage158.name = "UNDLM_00158_AVEC_POIGNEES";
        editSources[158] = editFootage158;
        editImportCount++;
        importSuccess158 = true;
        fileName158 = "UNDLM_00158_AVEC_POIGNEES.mov";
        logImportSuccess(158, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00158_AVEC_POIGNEES.mov", fileName158);
    } catch (e) {
        logImportError(158, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00158_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess158 && editFileBis158.exists) {
    try {
        var editFootage158 = project.importFile(new ImportOptions(editFileBis158));
        editFootage158.parentFolder = fromEditFolder;
        editFootage158.name = "UNDLM_00158bis";
        editSources[158] = editFootage158;
        editImportCount++;
        importSuccess158 = true;
        fileName158 = "UNDLM_00158bis.mov";
        logImportSuccess(158, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00158bis.mov", fileName158);
    } catch (e) {
        logImportError(158, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00158bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess158) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00158.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00159
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile159 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00159.mov");
var editFilePoignees159 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00159_AVEC_POIGNEES.mov");
var editFileBis159 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00159bis.mov");

var importSuccess159 = false;
var fileName159 = "";

// Tenter import standard
if (editFile159.exists) {
    try {
        var editFootage159 = project.importFile(new ImportOptions(editFile159));
        editFootage159.parentFolder = fromEditFolder;
        editFootage159.name = "UNDLM_00159";
        editSources[159] = editFootage159;
        editImportCount++;
        importSuccess159 = true;
        fileName159 = "UNDLM_00159.mov";
        logImportSuccess(159, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00159.mov", fileName159);
    } catch (e) {
        logImportError(159, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00159.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess159 && editFilePoignees159.exists) {
    try {
        var editFootage159 = project.importFile(new ImportOptions(editFilePoignees159));
        editFootage159.parentFolder = fromEditFolder;
        editFootage159.name = "UNDLM_00159_AVEC_POIGNEES";
        editSources[159] = editFootage159;
        editImportCount++;
        importSuccess159 = true;
        fileName159 = "UNDLM_00159_AVEC_POIGNEES.mov";
        logImportSuccess(159, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00159_AVEC_POIGNEES.mov", fileName159);
    } catch (e) {
        logImportError(159, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00159_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess159 && editFileBis159.exists) {
    try {
        var editFootage159 = project.importFile(new ImportOptions(editFileBis159));
        editFootage159.parentFolder = fromEditFolder;
        editFootage159.name = "UNDLM_00159bis";
        editSources[159] = editFootage159;
        editImportCount++;
        importSuccess159 = true;
        fileName159 = "UNDLM_00159bis.mov";
        logImportSuccess(159, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00159bis.mov", fileName159);
    } catch (e) {
        logImportError(159, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00159bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess159) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00159.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00160
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile160 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00160.mov");
var editFilePoignees160 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00160_AVEC_POIGNEES.mov");
var editFileBis160 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00160bis.mov");

var importSuccess160 = false;
var fileName160 = "";

// Tenter import standard
if (editFile160.exists) {
    try {
        var editFootage160 = project.importFile(new ImportOptions(editFile160));
        editFootage160.parentFolder = fromEditFolder;
        editFootage160.name = "UNDLM_00160";
        editSources[160] = editFootage160;
        editImportCount++;
        importSuccess160 = true;
        fileName160 = "UNDLM_00160.mov";
        logImportSuccess(160, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00160.mov", fileName160);
    } catch (e) {
        logImportError(160, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00160.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess160 && editFilePoignees160.exists) {
    try {
        var editFootage160 = project.importFile(new ImportOptions(editFilePoignees160));
        editFootage160.parentFolder = fromEditFolder;
        editFootage160.name = "UNDLM_00160_AVEC_POIGNEES";
        editSources[160] = editFootage160;
        editImportCount++;
        importSuccess160 = true;
        fileName160 = "UNDLM_00160_AVEC_POIGNEES.mov";
        logImportSuccess(160, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00160_AVEC_POIGNEES.mov", fileName160);
    } catch (e) {
        logImportError(160, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00160_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess160 && editFileBis160.exists) {
    try {
        var editFootage160 = project.importFile(new ImportOptions(editFileBis160));
        editFootage160.parentFolder = fromEditFolder;
        editFootage160.name = "UNDLM_00160bis";
        editSources[160] = editFootage160;
        editImportCount++;
        importSuccess160 = true;
        fileName160 = "UNDLM_00160bis.mov";
        logImportSuccess(160, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00160bis.mov", fileName160);
    } catch (e) {
        logImportError(160, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00160bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess160) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00160.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00161
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile161 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00161.mov");
var editFilePoignees161 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00161_AVEC_POIGNEES.mov");
var editFileBis161 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00161bis.mov");

var importSuccess161 = false;
var fileName161 = "";

// Tenter import standard
if (editFile161.exists) {
    try {
        var editFootage161 = project.importFile(new ImportOptions(editFile161));
        editFootage161.parentFolder = fromEditFolder;
        editFootage161.name = "UNDLM_00161";
        editSources[161] = editFootage161;
        editImportCount++;
        importSuccess161 = true;
        fileName161 = "UNDLM_00161.mov";
        logImportSuccess(161, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00161.mov", fileName161);
    } catch (e) {
        logImportError(161, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00161.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess161 && editFilePoignees161.exists) {
    try {
        var editFootage161 = project.importFile(new ImportOptions(editFilePoignees161));
        editFootage161.parentFolder = fromEditFolder;
        editFootage161.name = "UNDLM_00161_AVEC_POIGNEES";
        editSources[161] = editFootage161;
        editImportCount++;
        importSuccess161 = true;
        fileName161 = "UNDLM_00161_AVEC_POIGNEES.mov";
        logImportSuccess(161, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00161_AVEC_POIGNEES.mov", fileName161);
    } catch (e) {
        logImportError(161, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00161_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess161 && editFileBis161.exists) {
    try {
        var editFootage161 = project.importFile(new ImportOptions(editFileBis161));
        editFootage161.parentFolder = fromEditFolder;
        editFootage161.name = "UNDLM_00161bis";
        editSources[161] = editFootage161;
        editImportCount++;
        importSuccess161 = true;
        fileName161 = "UNDLM_00161bis.mov";
        logImportSuccess(161, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00161bis.mov", fileName161);
    } catch (e) {
        logImportError(161, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00161bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess161) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00161.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00162
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile162 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00162.mov");
var editFilePoignees162 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00162_AVEC_POIGNEES.mov");
var editFileBis162 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00162bis.mov");

var importSuccess162 = false;
var fileName162 = "";

// Tenter import standard
if (editFile162.exists) {
    try {
        var editFootage162 = project.importFile(new ImportOptions(editFile162));
        editFootage162.parentFolder = fromEditFolder;
        editFootage162.name = "UNDLM_00162";
        editSources[162] = editFootage162;
        editImportCount++;
        importSuccess162 = true;
        fileName162 = "UNDLM_00162.mov";
        logImportSuccess(162, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00162.mov", fileName162);
    } catch (e) {
        logImportError(162, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00162.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess162 && editFilePoignees162.exists) {
    try {
        var editFootage162 = project.importFile(new ImportOptions(editFilePoignees162));
        editFootage162.parentFolder = fromEditFolder;
        editFootage162.name = "UNDLM_00162_AVEC_POIGNEES";
        editSources[162] = editFootage162;
        editImportCount++;
        importSuccess162 = true;
        fileName162 = "UNDLM_00162_AVEC_POIGNEES.mov";
        logImportSuccess(162, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00162_AVEC_POIGNEES.mov", fileName162);
    } catch (e) {
        logImportError(162, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00162_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess162 && editFileBis162.exists) {
    try {
        var editFootage162 = project.importFile(new ImportOptions(editFileBis162));
        editFootage162.parentFolder = fromEditFolder;
        editFootage162.name = "UNDLM_00162bis";
        editSources[162] = editFootage162;
        editImportCount++;
        importSuccess162 = true;
        fileName162 = "UNDLM_00162bis.mov";
        logImportSuccess(162, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00162bis.mov", fileName162);
    } catch (e) {
        logImportError(162, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00162bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess162) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00162.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00163
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile163 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00163.mov");
var editFilePoignees163 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00163_AVEC_POIGNEES.mov");
var editFileBis163 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00163bis.mov");

var importSuccess163 = false;
var fileName163 = "";

// Tenter import standard
if (editFile163.exists) {
    try {
        var editFootage163 = project.importFile(new ImportOptions(editFile163));
        editFootage163.parentFolder = fromEditFolder;
        editFootage163.name = "UNDLM_00163";
        editSources[163] = editFootage163;
        editImportCount++;
        importSuccess163 = true;
        fileName163 = "UNDLM_00163.mov";
        logImportSuccess(163, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00163.mov", fileName163);
    } catch (e) {
        logImportError(163, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00163.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess163 && editFilePoignees163.exists) {
    try {
        var editFootage163 = project.importFile(new ImportOptions(editFilePoignees163));
        editFootage163.parentFolder = fromEditFolder;
        editFootage163.name = "UNDLM_00163_AVEC_POIGNEES";
        editSources[163] = editFootage163;
        editImportCount++;
        importSuccess163 = true;
        fileName163 = "UNDLM_00163_AVEC_POIGNEES.mov";
        logImportSuccess(163, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00163_AVEC_POIGNEES.mov", fileName163);
    } catch (e) {
        logImportError(163, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00163_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess163 && editFileBis163.exists) {
    try {
        var editFootage163 = project.importFile(new ImportOptions(editFileBis163));
        editFootage163.parentFolder = fromEditFolder;
        editFootage163.name = "UNDLM_00163bis";
        editSources[163] = editFootage163;
        editImportCount++;
        importSuccess163 = true;
        fileName163 = "UNDLM_00163bis.mov";
        logImportSuccess(163, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00163bis.mov", fileName163);
    } catch (e) {
        logImportError(163, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00163bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess163) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00163.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00164
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile164 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00164.mov");
var editFilePoignees164 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00164_AVEC_POIGNEES.mov");
var editFileBis164 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00164bis.mov");

var importSuccess164 = false;
var fileName164 = "";

// Tenter import standard
if (editFile164.exists) {
    try {
        var editFootage164 = project.importFile(new ImportOptions(editFile164));
        editFootage164.parentFolder = fromEditFolder;
        editFootage164.name = "UNDLM_00164";
        editSources[164] = editFootage164;
        editImportCount++;
        importSuccess164 = true;
        fileName164 = "UNDLM_00164.mov";
        logImportSuccess(164, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00164.mov", fileName164);
    } catch (e) {
        logImportError(164, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00164.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess164 && editFilePoignees164.exists) {
    try {
        var editFootage164 = project.importFile(new ImportOptions(editFilePoignees164));
        editFootage164.parentFolder = fromEditFolder;
        editFootage164.name = "UNDLM_00164_AVEC_POIGNEES";
        editSources[164] = editFootage164;
        editImportCount++;
        importSuccess164 = true;
        fileName164 = "UNDLM_00164_AVEC_POIGNEES.mov";
        logImportSuccess(164, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00164_AVEC_POIGNEES.mov", fileName164);
    } catch (e) {
        logImportError(164, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00164_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess164 && editFileBis164.exists) {
    try {
        var editFootage164 = project.importFile(new ImportOptions(editFileBis164));
        editFootage164.parentFolder = fromEditFolder;
        editFootage164.name = "UNDLM_00164bis";
        editSources[164] = editFootage164;
        editImportCount++;
        importSuccess164 = true;
        fileName164 = "UNDLM_00164bis.mov";
        logImportSuccess(164, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00164bis.mov", fileName164);
    } catch (e) {
        logImportError(164, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00164bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess164) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00164.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00146
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile146 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00146.mov");
var gradedFilePoignees146 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00146_AVEC_POIGNEES.mov");
var gradedFileBis146 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00146bis.mov");

var gradedImportSuccess146 = false;
var gradedFileName146 = "";

// Tenter import standard
if (gradedFile146.exists) {
    try {
        var gradedFootage146 = project.importFile(new ImportOptions(gradedFile146));
        gradedFootage146.parentFolder = fromGradingFolder;
        gradedFootage146.name = "UNDLM_00146";
        gradingSources[146] = gradedFootage146;
        gradingImportCount++;
        gradedImportSuccess146 = true;
        gradedFileName146 = "UNDLM_00146.mov";
        logImportSuccess(146, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00146.mov", gradedFileName146);
    } catch (e) {
        logImportError(146, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00146.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess146 && gradedFilePoignees146.exists) {
    try {
        var gradedFootage146 = project.importFile(new ImportOptions(gradedFilePoignees146));
        gradedFootage146.parentFolder = fromGradingFolder;
        gradedFootage146.name = "UNDLM_00146_AVEC_POIGNEES";
        gradingSources[146] = gradedFootage146;
        gradingImportCount++;
        gradedImportSuccess146 = true;
        gradedFileName146 = "UNDLM_00146_AVEC_POIGNEES.mov";
        logImportSuccess(146, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00146_AVEC_POIGNEES.mov", gradedFileName146);
    } catch (e) {
        logImportError(146, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00146_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess146 && gradedFileBis146.exists) {
    try {
        var gradedFootage146 = project.importFile(new ImportOptions(gradedFileBis146));
        gradedFootage146.parentFolder = fromGradingFolder;
        gradedFootage146.name = "UNDLM_00146bis";
        gradingSources[146] = gradedFootage146;
        gradingImportCount++;
        gradedImportSuccess146 = true;
        gradedFileName146 = "UNDLM_00146bis.mov";
        logImportSuccess(146, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00146bis.mov", gradedFileName146);
    } catch (e) {
        logImportError(146, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00146bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess146) {
    missingGradingCount++;
}

// Import plan GRADED 00147
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile147 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00147.mov");
var gradedFilePoignees147 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00147_AVEC_POIGNEES.mov");
var gradedFileBis147 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00147bis.mov");

var gradedImportSuccess147 = false;
var gradedFileName147 = "";

// Tenter import standard
if (gradedFile147.exists) {
    try {
        var gradedFootage147 = project.importFile(new ImportOptions(gradedFile147));
        gradedFootage147.parentFolder = fromGradingFolder;
        gradedFootage147.name = "UNDLM_00147";
        gradingSources[147] = gradedFootage147;
        gradingImportCount++;
        gradedImportSuccess147 = true;
        gradedFileName147 = "UNDLM_00147.mov";
        logImportSuccess(147, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00147.mov", gradedFileName147);
    } catch (e) {
        logImportError(147, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00147.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess147 && gradedFilePoignees147.exists) {
    try {
        var gradedFootage147 = project.importFile(new ImportOptions(gradedFilePoignees147));
        gradedFootage147.parentFolder = fromGradingFolder;
        gradedFootage147.name = "UNDLM_00147_AVEC_POIGNEES";
        gradingSources[147] = gradedFootage147;
        gradingImportCount++;
        gradedImportSuccess147 = true;
        gradedFileName147 = "UNDLM_00147_AVEC_POIGNEES.mov";
        logImportSuccess(147, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00147_AVEC_POIGNEES.mov", gradedFileName147);
    } catch (e) {
        logImportError(147, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00147_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess147 && gradedFileBis147.exists) {
    try {
        var gradedFootage147 = project.importFile(new ImportOptions(gradedFileBis147));
        gradedFootage147.parentFolder = fromGradingFolder;
        gradedFootage147.name = "UNDLM_00147bis";
        gradingSources[147] = gradedFootage147;
        gradingImportCount++;
        gradedImportSuccess147 = true;
        gradedFileName147 = "UNDLM_00147bis.mov";
        logImportSuccess(147, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00147bis.mov", gradedFileName147);
    } catch (e) {
        logImportError(147, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00147bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess147) {
    missingGradingCount++;
}

// Import plan GRADED 00148
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile148 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00148.mov");
var gradedFilePoignees148 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00148_AVEC_POIGNEES.mov");
var gradedFileBis148 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00148bis.mov");

var gradedImportSuccess148 = false;
var gradedFileName148 = "";

// Tenter import standard
if (gradedFile148.exists) {
    try {
        var gradedFootage148 = project.importFile(new ImportOptions(gradedFile148));
        gradedFootage148.parentFolder = fromGradingFolder;
        gradedFootage148.name = "UNDLM_00148";
        gradingSources[148] = gradedFootage148;
        gradingImportCount++;
        gradedImportSuccess148 = true;
        gradedFileName148 = "UNDLM_00148.mov";
        logImportSuccess(148, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00148.mov", gradedFileName148);
    } catch (e) {
        logImportError(148, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00148.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess148 && gradedFilePoignees148.exists) {
    try {
        var gradedFootage148 = project.importFile(new ImportOptions(gradedFilePoignees148));
        gradedFootage148.parentFolder = fromGradingFolder;
        gradedFootage148.name = "UNDLM_00148_AVEC_POIGNEES";
        gradingSources[148] = gradedFootage148;
        gradingImportCount++;
        gradedImportSuccess148 = true;
        gradedFileName148 = "UNDLM_00148_AVEC_POIGNEES.mov";
        logImportSuccess(148, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00148_AVEC_POIGNEES.mov", gradedFileName148);
    } catch (e) {
        logImportError(148, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00148_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess148 && gradedFileBis148.exists) {
    try {
        var gradedFootage148 = project.importFile(new ImportOptions(gradedFileBis148));
        gradedFootage148.parentFolder = fromGradingFolder;
        gradedFootage148.name = "UNDLM_00148bis";
        gradingSources[148] = gradedFootage148;
        gradingImportCount++;
        gradedImportSuccess148 = true;
        gradedFileName148 = "UNDLM_00148bis.mov";
        logImportSuccess(148, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00148bis.mov", gradedFileName148);
    } catch (e) {
        logImportError(148, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00148bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess148) {
    missingGradingCount++;
}

// Import plan GRADED 00149
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile149 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00149.mov");
var gradedFilePoignees149 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00149_AVEC_POIGNEES.mov");
var gradedFileBis149 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00149bis.mov");

var gradedImportSuccess149 = false;
var gradedFileName149 = "";

// Tenter import standard
if (gradedFile149.exists) {
    try {
        var gradedFootage149 = project.importFile(new ImportOptions(gradedFile149));
        gradedFootage149.parentFolder = fromGradingFolder;
        gradedFootage149.name = "UNDLM_00149";
        gradingSources[149] = gradedFootage149;
        gradingImportCount++;
        gradedImportSuccess149 = true;
        gradedFileName149 = "UNDLM_00149.mov";
        logImportSuccess(149, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00149.mov", gradedFileName149);
    } catch (e) {
        logImportError(149, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00149.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess149 && gradedFilePoignees149.exists) {
    try {
        var gradedFootage149 = project.importFile(new ImportOptions(gradedFilePoignees149));
        gradedFootage149.parentFolder = fromGradingFolder;
        gradedFootage149.name = "UNDLM_00149_AVEC_POIGNEES";
        gradingSources[149] = gradedFootage149;
        gradingImportCount++;
        gradedImportSuccess149 = true;
        gradedFileName149 = "UNDLM_00149_AVEC_POIGNEES.mov";
        logImportSuccess(149, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00149_AVEC_POIGNEES.mov", gradedFileName149);
    } catch (e) {
        logImportError(149, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00149_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess149 && gradedFileBis149.exists) {
    try {
        var gradedFootage149 = project.importFile(new ImportOptions(gradedFileBis149));
        gradedFootage149.parentFolder = fromGradingFolder;
        gradedFootage149.name = "UNDLM_00149bis";
        gradingSources[149] = gradedFootage149;
        gradingImportCount++;
        gradedImportSuccess149 = true;
        gradedFileName149 = "UNDLM_00149bis.mov";
        logImportSuccess(149, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00149bis.mov", gradedFileName149);
    } catch (e) {
        logImportError(149, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00149bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess149) {
    missingGradingCount++;
}

// Import plan GRADED 00150
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile150 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00150.mov");
var gradedFilePoignees150 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00150_AVEC_POIGNEES.mov");
var gradedFileBis150 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00150bis.mov");

var gradedImportSuccess150 = false;
var gradedFileName150 = "";

// Tenter import standard
if (gradedFile150.exists) {
    try {
        var gradedFootage150 = project.importFile(new ImportOptions(gradedFile150));
        gradedFootage150.parentFolder = fromGradingFolder;
        gradedFootage150.name = "UNDLM_00150";
        gradingSources[150] = gradedFootage150;
        gradingImportCount++;
        gradedImportSuccess150 = true;
        gradedFileName150 = "UNDLM_00150.mov";
        logImportSuccess(150, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00150.mov", gradedFileName150);
    } catch (e) {
        logImportError(150, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00150.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess150 && gradedFilePoignees150.exists) {
    try {
        var gradedFootage150 = project.importFile(new ImportOptions(gradedFilePoignees150));
        gradedFootage150.parentFolder = fromGradingFolder;
        gradedFootage150.name = "UNDLM_00150_AVEC_POIGNEES";
        gradingSources[150] = gradedFootage150;
        gradingImportCount++;
        gradedImportSuccess150 = true;
        gradedFileName150 = "UNDLM_00150_AVEC_POIGNEES.mov";
        logImportSuccess(150, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00150_AVEC_POIGNEES.mov", gradedFileName150);
    } catch (e) {
        logImportError(150, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00150_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess150 && gradedFileBis150.exists) {
    try {
        var gradedFootage150 = project.importFile(new ImportOptions(gradedFileBis150));
        gradedFootage150.parentFolder = fromGradingFolder;
        gradedFootage150.name = "UNDLM_00150bis";
        gradingSources[150] = gradedFootage150;
        gradingImportCount++;
        gradedImportSuccess150 = true;
        gradedFileName150 = "UNDLM_00150bis.mov";
        logImportSuccess(150, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00150bis.mov", gradedFileName150);
    } catch (e) {
        logImportError(150, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00150bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess150) {
    missingGradingCount++;
}

// Import plan GRADED 00151
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile151 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00151.mov");
var gradedFilePoignees151 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00151_AVEC_POIGNEES.mov");
var gradedFileBis151 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00151bis.mov");

var gradedImportSuccess151 = false;
var gradedFileName151 = "";

// Tenter import standard
if (gradedFile151.exists) {
    try {
        var gradedFootage151 = project.importFile(new ImportOptions(gradedFile151));
        gradedFootage151.parentFolder = fromGradingFolder;
        gradedFootage151.name = "UNDLM_00151";
        gradingSources[151] = gradedFootage151;
        gradingImportCount++;
        gradedImportSuccess151 = true;
        gradedFileName151 = "UNDLM_00151.mov";
        logImportSuccess(151, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00151.mov", gradedFileName151);
    } catch (e) {
        logImportError(151, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00151.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess151 && gradedFilePoignees151.exists) {
    try {
        var gradedFootage151 = project.importFile(new ImportOptions(gradedFilePoignees151));
        gradedFootage151.parentFolder = fromGradingFolder;
        gradedFootage151.name = "UNDLM_00151_AVEC_POIGNEES";
        gradingSources[151] = gradedFootage151;
        gradingImportCount++;
        gradedImportSuccess151 = true;
        gradedFileName151 = "UNDLM_00151_AVEC_POIGNEES.mov";
        logImportSuccess(151, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00151_AVEC_POIGNEES.mov", gradedFileName151);
    } catch (e) {
        logImportError(151, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00151_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess151 && gradedFileBis151.exists) {
    try {
        var gradedFootage151 = project.importFile(new ImportOptions(gradedFileBis151));
        gradedFootage151.parentFolder = fromGradingFolder;
        gradedFootage151.name = "UNDLM_00151bis";
        gradingSources[151] = gradedFootage151;
        gradingImportCount++;
        gradedImportSuccess151 = true;
        gradedFileName151 = "UNDLM_00151bis.mov";
        logImportSuccess(151, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00151bis.mov", gradedFileName151);
    } catch (e) {
        logImportError(151, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00151bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess151) {
    missingGradingCount++;
}

// Import plan GRADED 00152
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile152 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00152.mov");
var gradedFilePoignees152 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00152_AVEC_POIGNEES.mov");
var gradedFileBis152 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00152bis.mov");

var gradedImportSuccess152 = false;
var gradedFileName152 = "";

// Tenter import standard
if (gradedFile152.exists) {
    try {
        var gradedFootage152 = project.importFile(new ImportOptions(gradedFile152));
        gradedFootage152.parentFolder = fromGradingFolder;
        gradedFootage152.name = "UNDLM_00152";
        gradingSources[152] = gradedFootage152;
        gradingImportCount++;
        gradedImportSuccess152 = true;
        gradedFileName152 = "UNDLM_00152.mov";
        logImportSuccess(152, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00152.mov", gradedFileName152);
    } catch (e) {
        logImportError(152, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00152.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess152 && gradedFilePoignees152.exists) {
    try {
        var gradedFootage152 = project.importFile(new ImportOptions(gradedFilePoignees152));
        gradedFootage152.parentFolder = fromGradingFolder;
        gradedFootage152.name = "UNDLM_00152_AVEC_POIGNEES";
        gradingSources[152] = gradedFootage152;
        gradingImportCount++;
        gradedImportSuccess152 = true;
        gradedFileName152 = "UNDLM_00152_AVEC_POIGNEES.mov";
        logImportSuccess(152, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00152_AVEC_POIGNEES.mov", gradedFileName152);
    } catch (e) {
        logImportError(152, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00152_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess152 && gradedFileBis152.exists) {
    try {
        var gradedFootage152 = project.importFile(new ImportOptions(gradedFileBis152));
        gradedFootage152.parentFolder = fromGradingFolder;
        gradedFootage152.name = "UNDLM_00152bis";
        gradingSources[152] = gradedFootage152;
        gradingImportCount++;
        gradedImportSuccess152 = true;
        gradedFileName152 = "UNDLM_00152bis.mov";
        logImportSuccess(152, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00152bis.mov", gradedFileName152);
    } catch (e) {
        logImportError(152, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00152bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess152) {
    missingGradingCount++;
}

// Import plan GRADED 00153
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile153 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00153.mov");
var gradedFilePoignees153 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00153_AVEC_POIGNEES.mov");
var gradedFileBis153 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00153bis.mov");

var gradedImportSuccess153 = false;
var gradedFileName153 = "";

// Tenter import standard
if (gradedFile153.exists) {
    try {
        var gradedFootage153 = project.importFile(new ImportOptions(gradedFile153));
        gradedFootage153.parentFolder = fromGradingFolder;
        gradedFootage153.name = "UNDLM_00153";
        gradingSources[153] = gradedFootage153;
        gradingImportCount++;
        gradedImportSuccess153 = true;
        gradedFileName153 = "UNDLM_00153.mov";
        logImportSuccess(153, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00153.mov", gradedFileName153);
    } catch (e) {
        logImportError(153, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00153.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess153 && gradedFilePoignees153.exists) {
    try {
        var gradedFootage153 = project.importFile(new ImportOptions(gradedFilePoignees153));
        gradedFootage153.parentFolder = fromGradingFolder;
        gradedFootage153.name = "UNDLM_00153_AVEC_POIGNEES";
        gradingSources[153] = gradedFootage153;
        gradingImportCount++;
        gradedImportSuccess153 = true;
        gradedFileName153 = "UNDLM_00153_AVEC_POIGNEES.mov";
        logImportSuccess(153, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00153_AVEC_POIGNEES.mov", gradedFileName153);
    } catch (e) {
        logImportError(153, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00153_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess153 && gradedFileBis153.exists) {
    try {
        var gradedFootage153 = project.importFile(new ImportOptions(gradedFileBis153));
        gradedFootage153.parentFolder = fromGradingFolder;
        gradedFootage153.name = "UNDLM_00153bis";
        gradingSources[153] = gradedFootage153;
        gradingImportCount++;
        gradedImportSuccess153 = true;
        gradedFileName153 = "UNDLM_00153bis.mov";
        logImportSuccess(153, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00153bis.mov", gradedFileName153);
    } catch (e) {
        logImportError(153, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00153bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess153) {
    missingGradingCount++;
}

// Import plan GRADED 00154
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile154 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00154.mov");
var gradedFilePoignees154 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00154_AVEC_POIGNEES.mov");
var gradedFileBis154 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00154bis.mov");

var gradedImportSuccess154 = false;
var gradedFileName154 = "";

// Tenter import standard
if (gradedFile154.exists) {
    try {
        var gradedFootage154 = project.importFile(new ImportOptions(gradedFile154));
        gradedFootage154.parentFolder = fromGradingFolder;
        gradedFootage154.name = "UNDLM_00154";
        gradingSources[154] = gradedFootage154;
        gradingImportCount++;
        gradedImportSuccess154 = true;
        gradedFileName154 = "UNDLM_00154.mov";
        logImportSuccess(154, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00154.mov", gradedFileName154);
    } catch (e) {
        logImportError(154, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00154.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess154 && gradedFilePoignees154.exists) {
    try {
        var gradedFootage154 = project.importFile(new ImportOptions(gradedFilePoignees154));
        gradedFootage154.parentFolder = fromGradingFolder;
        gradedFootage154.name = "UNDLM_00154_AVEC_POIGNEES";
        gradingSources[154] = gradedFootage154;
        gradingImportCount++;
        gradedImportSuccess154 = true;
        gradedFileName154 = "UNDLM_00154_AVEC_POIGNEES.mov";
        logImportSuccess(154, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00154_AVEC_POIGNEES.mov", gradedFileName154);
    } catch (e) {
        logImportError(154, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00154_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess154 && gradedFileBis154.exists) {
    try {
        var gradedFootage154 = project.importFile(new ImportOptions(gradedFileBis154));
        gradedFootage154.parentFolder = fromGradingFolder;
        gradedFootage154.name = "UNDLM_00154bis";
        gradingSources[154] = gradedFootage154;
        gradingImportCount++;
        gradedImportSuccess154 = true;
        gradedFileName154 = "UNDLM_00154bis.mov";
        logImportSuccess(154, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00154bis.mov", gradedFileName154);
    } catch (e) {
        logImportError(154, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00154bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess154) {
    missingGradingCount++;
}

// Import plan GRADED 00155
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile155 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00155.mov");
var gradedFilePoignees155 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00155_AVEC_POIGNEES.mov");
var gradedFileBis155 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00155bis.mov");

var gradedImportSuccess155 = false;
var gradedFileName155 = "";

// Tenter import standard
if (gradedFile155.exists) {
    try {
        var gradedFootage155 = project.importFile(new ImportOptions(gradedFile155));
        gradedFootage155.parentFolder = fromGradingFolder;
        gradedFootage155.name = "UNDLM_00155";
        gradingSources[155] = gradedFootage155;
        gradingImportCount++;
        gradedImportSuccess155 = true;
        gradedFileName155 = "UNDLM_00155.mov";
        logImportSuccess(155, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00155.mov", gradedFileName155);
    } catch (e) {
        logImportError(155, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00155.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess155 && gradedFilePoignees155.exists) {
    try {
        var gradedFootage155 = project.importFile(new ImportOptions(gradedFilePoignees155));
        gradedFootage155.parentFolder = fromGradingFolder;
        gradedFootage155.name = "UNDLM_00155_AVEC_POIGNEES";
        gradingSources[155] = gradedFootage155;
        gradingImportCount++;
        gradedImportSuccess155 = true;
        gradedFileName155 = "UNDLM_00155_AVEC_POIGNEES.mov";
        logImportSuccess(155, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00155_AVEC_POIGNEES.mov", gradedFileName155);
    } catch (e) {
        logImportError(155, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00155_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess155 && gradedFileBis155.exists) {
    try {
        var gradedFootage155 = project.importFile(new ImportOptions(gradedFileBis155));
        gradedFootage155.parentFolder = fromGradingFolder;
        gradedFootage155.name = "UNDLM_00155bis";
        gradingSources[155] = gradedFootage155;
        gradingImportCount++;
        gradedImportSuccess155 = true;
        gradedFileName155 = "UNDLM_00155bis.mov";
        logImportSuccess(155, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00155bis.mov", gradedFileName155);
    } catch (e) {
        logImportError(155, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00155bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess155) {
    missingGradingCount++;
}

// Import plan GRADED 00156
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile156 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00156.mov");
var gradedFilePoignees156 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00156_AVEC_POIGNEES.mov");
var gradedFileBis156 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00156bis.mov");

var gradedImportSuccess156 = false;
var gradedFileName156 = "";

// Tenter import standard
if (gradedFile156.exists) {
    try {
        var gradedFootage156 = project.importFile(new ImportOptions(gradedFile156));
        gradedFootage156.parentFolder = fromGradingFolder;
        gradedFootage156.name = "UNDLM_00156";
        gradingSources[156] = gradedFootage156;
        gradingImportCount++;
        gradedImportSuccess156 = true;
        gradedFileName156 = "UNDLM_00156.mov";
        logImportSuccess(156, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00156.mov", gradedFileName156);
    } catch (e) {
        logImportError(156, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00156.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess156 && gradedFilePoignees156.exists) {
    try {
        var gradedFootage156 = project.importFile(new ImportOptions(gradedFilePoignees156));
        gradedFootage156.parentFolder = fromGradingFolder;
        gradedFootage156.name = "UNDLM_00156_AVEC_POIGNEES";
        gradingSources[156] = gradedFootage156;
        gradingImportCount++;
        gradedImportSuccess156 = true;
        gradedFileName156 = "UNDLM_00156_AVEC_POIGNEES.mov";
        logImportSuccess(156, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00156_AVEC_POIGNEES.mov", gradedFileName156);
    } catch (e) {
        logImportError(156, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00156_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess156 && gradedFileBis156.exists) {
    try {
        var gradedFootage156 = project.importFile(new ImportOptions(gradedFileBis156));
        gradedFootage156.parentFolder = fromGradingFolder;
        gradedFootage156.name = "UNDLM_00156bis";
        gradingSources[156] = gradedFootage156;
        gradingImportCount++;
        gradedImportSuccess156 = true;
        gradedFileName156 = "UNDLM_00156bis.mov";
        logImportSuccess(156, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00156bis.mov", gradedFileName156);
    } catch (e) {
        logImportError(156, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00156bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess156) {
    missingGradingCount++;
}

// Import plan GRADED 00157
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile157 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00157.mov");
var gradedFilePoignees157 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00157_AVEC_POIGNEES.mov");
var gradedFileBis157 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00157bis.mov");

var gradedImportSuccess157 = false;
var gradedFileName157 = "";

// Tenter import standard
if (gradedFile157.exists) {
    try {
        var gradedFootage157 = project.importFile(new ImportOptions(gradedFile157));
        gradedFootage157.parentFolder = fromGradingFolder;
        gradedFootage157.name = "UNDLM_00157";
        gradingSources[157] = gradedFootage157;
        gradingImportCount++;
        gradedImportSuccess157 = true;
        gradedFileName157 = "UNDLM_00157.mov";
        logImportSuccess(157, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00157.mov", gradedFileName157);
    } catch (e) {
        logImportError(157, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00157.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess157 && gradedFilePoignees157.exists) {
    try {
        var gradedFootage157 = project.importFile(new ImportOptions(gradedFilePoignees157));
        gradedFootage157.parentFolder = fromGradingFolder;
        gradedFootage157.name = "UNDLM_00157_AVEC_POIGNEES";
        gradingSources[157] = gradedFootage157;
        gradingImportCount++;
        gradedImportSuccess157 = true;
        gradedFileName157 = "UNDLM_00157_AVEC_POIGNEES.mov";
        logImportSuccess(157, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00157_AVEC_POIGNEES.mov", gradedFileName157);
    } catch (e) {
        logImportError(157, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00157_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess157 && gradedFileBis157.exists) {
    try {
        var gradedFootage157 = project.importFile(new ImportOptions(gradedFileBis157));
        gradedFootage157.parentFolder = fromGradingFolder;
        gradedFootage157.name = "UNDLM_00157bis";
        gradingSources[157] = gradedFootage157;
        gradingImportCount++;
        gradedImportSuccess157 = true;
        gradedFileName157 = "UNDLM_00157bis.mov";
        logImportSuccess(157, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00157bis.mov", gradedFileName157);
    } catch (e) {
        logImportError(157, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00157bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess157) {
    missingGradingCount++;
}

// Import plan GRADED 00158
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile158 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00158.mov");
var gradedFilePoignees158 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00158_AVEC_POIGNEES.mov");
var gradedFileBis158 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00158bis.mov");

var gradedImportSuccess158 = false;
var gradedFileName158 = "";

// Tenter import standard
if (gradedFile158.exists) {
    try {
        var gradedFootage158 = project.importFile(new ImportOptions(gradedFile158));
        gradedFootage158.parentFolder = fromGradingFolder;
        gradedFootage158.name = "UNDLM_00158";
        gradingSources[158] = gradedFootage158;
        gradingImportCount++;
        gradedImportSuccess158 = true;
        gradedFileName158 = "UNDLM_00158.mov";
        logImportSuccess(158, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00158.mov", gradedFileName158);
    } catch (e) {
        logImportError(158, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00158.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess158 && gradedFilePoignees158.exists) {
    try {
        var gradedFootage158 = project.importFile(new ImportOptions(gradedFilePoignees158));
        gradedFootage158.parentFolder = fromGradingFolder;
        gradedFootage158.name = "UNDLM_00158_AVEC_POIGNEES";
        gradingSources[158] = gradedFootage158;
        gradingImportCount++;
        gradedImportSuccess158 = true;
        gradedFileName158 = "UNDLM_00158_AVEC_POIGNEES.mov";
        logImportSuccess(158, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00158_AVEC_POIGNEES.mov", gradedFileName158);
    } catch (e) {
        logImportError(158, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00158_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess158 && gradedFileBis158.exists) {
    try {
        var gradedFootage158 = project.importFile(new ImportOptions(gradedFileBis158));
        gradedFootage158.parentFolder = fromGradingFolder;
        gradedFootage158.name = "UNDLM_00158bis";
        gradingSources[158] = gradedFootage158;
        gradingImportCount++;
        gradedImportSuccess158 = true;
        gradedFileName158 = "UNDLM_00158bis.mov";
        logImportSuccess(158, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00158bis.mov", gradedFileName158);
    } catch (e) {
        logImportError(158, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00158bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess158) {
    missingGradingCount++;
}

// Import plan GRADED 00159
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile159 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00159.mov");
var gradedFilePoignees159 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00159_AVEC_POIGNEES.mov");
var gradedFileBis159 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00159bis.mov");

var gradedImportSuccess159 = false;
var gradedFileName159 = "";

// Tenter import standard
if (gradedFile159.exists) {
    try {
        var gradedFootage159 = project.importFile(new ImportOptions(gradedFile159));
        gradedFootage159.parentFolder = fromGradingFolder;
        gradedFootage159.name = "UNDLM_00159";
        gradingSources[159] = gradedFootage159;
        gradingImportCount++;
        gradedImportSuccess159 = true;
        gradedFileName159 = "UNDLM_00159.mov";
        logImportSuccess(159, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00159.mov", gradedFileName159);
    } catch (e) {
        logImportError(159, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00159.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess159 && gradedFilePoignees159.exists) {
    try {
        var gradedFootage159 = project.importFile(new ImportOptions(gradedFilePoignees159));
        gradedFootage159.parentFolder = fromGradingFolder;
        gradedFootage159.name = "UNDLM_00159_AVEC_POIGNEES";
        gradingSources[159] = gradedFootage159;
        gradingImportCount++;
        gradedImportSuccess159 = true;
        gradedFileName159 = "UNDLM_00159_AVEC_POIGNEES.mov";
        logImportSuccess(159, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00159_AVEC_POIGNEES.mov", gradedFileName159);
    } catch (e) {
        logImportError(159, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00159_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess159 && gradedFileBis159.exists) {
    try {
        var gradedFootage159 = project.importFile(new ImportOptions(gradedFileBis159));
        gradedFootage159.parentFolder = fromGradingFolder;
        gradedFootage159.name = "UNDLM_00159bis";
        gradingSources[159] = gradedFootage159;
        gradingImportCount++;
        gradedImportSuccess159 = true;
        gradedFileName159 = "UNDLM_00159bis.mov";
        logImportSuccess(159, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00159bis.mov", gradedFileName159);
    } catch (e) {
        logImportError(159, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00159bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess159) {
    missingGradingCount++;
}

// Import plan GRADED 00160
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile160 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00160.mov");
var gradedFilePoignees160 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00160_AVEC_POIGNEES.mov");
var gradedFileBis160 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00160bis.mov");

var gradedImportSuccess160 = false;
var gradedFileName160 = "";

// Tenter import standard
if (gradedFile160.exists) {
    try {
        var gradedFootage160 = project.importFile(new ImportOptions(gradedFile160));
        gradedFootage160.parentFolder = fromGradingFolder;
        gradedFootage160.name = "UNDLM_00160";
        gradingSources[160] = gradedFootage160;
        gradingImportCount++;
        gradedImportSuccess160 = true;
        gradedFileName160 = "UNDLM_00160.mov";
        logImportSuccess(160, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00160.mov", gradedFileName160);
    } catch (e) {
        logImportError(160, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00160.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess160 && gradedFilePoignees160.exists) {
    try {
        var gradedFootage160 = project.importFile(new ImportOptions(gradedFilePoignees160));
        gradedFootage160.parentFolder = fromGradingFolder;
        gradedFootage160.name = "UNDLM_00160_AVEC_POIGNEES";
        gradingSources[160] = gradedFootage160;
        gradingImportCount++;
        gradedImportSuccess160 = true;
        gradedFileName160 = "UNDLM_00160_AVEC_POIGNEES.mov";
        logImportSuccess(160, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00160_AVEC_POIGNEES.mov", gradedFileName160);
    } catch (e) {
        logImportError(160, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00160_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess160 && gradedFileBis160.exists) {
    try {
        var gradedFootage160 = project.importFile(new ImportOptions(gradedFileBis160));
        gradedFootage160.parentFolder = fromGradingFolder;
        gradedFootage160.name = "UNDLM_00160bis";
        gradingSources[160] = gradedFootage160;
        gradingImportCount++;
        gradedImportSuccess160 = true;
        gradedFileName160 = "UNDLM_00160bis.mov";
        logImportSuccess(160, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00160bis.mov", gradedFileName160);
    } catch (e) {
        logImportError(160, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00160bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess160) {
    missingGradingCount++;
}

// Import plan GRADED 00161
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile161 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00161.mov");
var gradedFilePoignees161 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00161_AVEC_POIGNEES.mov");
var gradedFileBis161 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00161bis.mov");

var gradedImportSuccess161 = false;
var gradedFileName161 = "";

// Tenter import standard
if (gradedFile161.exists) {
    try {
        var gradedFootage161 = project.importFile(new ImportOptions(gradedFile161));
        gradedFootage161.parentFolder = fromGradingFolder;
        gradedFootage161.name = "UNDLM_00161";
        gradingSources[161] = gradedFootage161;
        gradingImportCount++;
        gradedImportSuccess161 = true;
        gradedFileName161 = "UNDLM_00161.mov";
        logImportSuccess(161, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00161.mov", gradedFileName161);
    } catch (e) {
        logImportError(161, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00161.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess161 && gradedFilePoignees161.exists) {
    try {
        var gradedFootage161 = project.importFile(new ImportOptions(gradedFilePoignees161));
        gradedFootage161.parentFolder = fromGradingFolder;
        gradedFootage161.name = "UNDLM_00161_AVEC_POIGNEES";
        gradingSources[161] = gradedFootage161;
        gradingImportCount++;
        gradedImportSuccess161 = true;
        gradedFileName161 = "UNDLM_00161_AVEC_POIGNEES.mov";
        logImportSuccess(161, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00161_AVEC_POIGNEES.mov", gradedFileName161);
    } catch (e) {
        logImportError(161, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00161_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess161 && gradedFileBis161.exists) {
    try {
        var gradedFootage161 = project.importFile(new ImportOptions(gradedFileBis161));
        gradedFootage161.parentFolder = fromGradingFolder;
        gradedFootage161.name = "UNDLM_00161bis";
        gradingSources[161] = gradedFootage161;
        gradingImportCount++;
        gradedImportSuccess161 = true;
        gradedFileName161 = "UNDLM_00161bis.mov";
        logImportSuccess(161, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00161bis.mov", gradedFileName161);
    } catch (e) {
        logImportError(161, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00161bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess161) {
    missingGradingCount++;
}

// Import plan GRADED 00162
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile162 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00162.mov");
var gradedFilePoignees162 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00162_AVEC_POIGNEES.mov");
var gradedFileBis162 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00162bis.mov");

var gradedImportSuccess162 = false;
var gradedFileName162 = "";

// Tenter import standard
if (gradedFile162.exists) {
    try {
        var gradedFootage162 = project.importFile(new ImportOptions(gradedFile162));
        gradedFootage162.parentFolder = fromGradingFolder;
        gradedFootage162.name = "UNDLM_00162";
        gradingSources[162] = gradedFootage162;
        gradingImportCount++;
        gradedImportSuccess162 = true;
        gradedFileName162 = "UNDLM_00162.mov";
        logImportSuccess(162, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00162.mov", gradedFileName162);
    } catch (e) {
        logImportError(162, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00162.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess162 && gradedFilePoignees162.exists) {
    try {
        var gradedFootage162 = project.importFile(new ImportOptions(gradedFilePoignees162));
        gradedFootage162.parentFolder = fromGradingFolder;
        gradedFootage162.name = "UNDLM_00162_AVEC_POIGNEES";
        gradingSources[162] = gradedFootage162;
        gradingImportCount++;
        gradedImportSuccess162 = true;
        gradedFileName162 = "UNDLM_00162_AVEC_POIGNEES.mov";
        logImportSuccess(162, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00162_AVEC_POIGNEES.mov", gradedFileName162);
    } catch (e) {
        logImportError(162, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00162_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess162 && gradedFileBis162.exists) {
    try {
        var gradedFootage162 = project.importFile(new ImportOptions(gradedFileBis162));
        gradedFootage162.parentFolder = fromGradingFolder;
        gradedFootage162.name = "UNDLM_00162bis";
        gradingSources[162] = gradedFootage162;
        gradingImportCount++;
        gradedImportSuccess162 = true;
        gradedFileName162 = "UNDLM_00162bis.mov";
        logImportSuccess(162, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00162bis.mov", gradedFileName162);
    } catch (e) {
        logImportError(162, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00162bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess162) {
    missingGradingCount++;
}

// Import plan GRADED 00163
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile163 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00163.mov");
var gradedFilePoignees163 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00163_AVEC_POIGNEES.mov");
var gradedFileBis163 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00163bis.mov");

var gradedImportSuccess163 = false;
var gradedFileName163 = "";

// Tenter import standard
if (gradedFile163.exists) {
    try {
        var gradedFootage163 = project.importFile(new ImportOptions(gradedFile163));
        gradedFootage163.parentFolder = fromGradingFolder;
        gradedFootage163.name = "UNDLM_00163";
        gradingSources[163] = gradedFootage163;
        gradingImportCount++;
        gradedImportSuccess163 = true;
        gradedFileName163 = "UNDLM_00163.mov";
        logImportSuccess(163, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00163.mov", gradedFileName163);
    } catch (e) {
        logImportError(163, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00163.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess163 && gradedFilePoignees163.exists) {
    try {
        var gradedFootage163 = project.importFile(new ImportOptions(gradedFilePoignees163));
        gradedFootage163.parentFolder = fromGradingFolder;
        gradedFootage163.name = "UNDLM_00163_AVEC_POIGNEES";
        gradingSources[163] = gradedFootage163;
        gradingImportCount++;
        gradedImportSuccess163 = true;
        gradedFileName163 = "UNDLM_00163_AVEC_POIGNEES.mov";
        logImportSuccess(163, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00163_AVEC_POIGNEES.mov", gradedFileName163);
    } catch (e) {
        logImportError(163, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00163_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess163 && gradedFileBis163.exists) {
    try {
        var gradedFootage163 = project.importFile(new ImportOptions(gradedFileBis163));
        gradedFootage163.parentFolder = fromGradingFolder;
        gradedFootage163.name = "UNDLM_00163bis";
        gradingSources[163] = gradedFootage163;
        gradingImportCount++;
        gradedImportSuccess163 = true;
        gradedFileName163 = "UNDLM_00163bis.mov";
        logImportSuccess(163, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00163bis.mov", gradedFileName163);
    } catch (e) {
        logImportError(163, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00163bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess163) {
    missingGradingCount++;
}

// Import plan GRADED 00164
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile164 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00164.mov");
var gradedFilePoignees164 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00164_AVEC_POIGNEES.mov");
var gradedFileBis164 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00164bis.mov");

var gradedImportSuccess164 = false;
var gradedFileName164 = "";

// Tenter import standard
if (gradedFile164.exists) {
    try {
        var gradedFootage164 = project.importFile(new ImportOptions(gradedFile164));
        gradedFootage164.parentFolder = fromGradingFolder;
        gradedFootage164.name = "UNDLM_00164";
        gradingSources[164] = gradedFootage164;
        gradingImportCount++;
        gradedImportSuccess164 = true;
        gradedFileName164 = "UNDLM_00164.mov";
        logImportSuccess(164, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00164.mov", gradedFileName164);
    } catch (e) {
        logImportError(164, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00164.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess164 && gradedFilePoignees164.exists) {
    try {
        var gradedFootage164 = project.importFile(new ImportOptions(gradedFilePoignees164));
        gradedFootage164.parentFolder = fromGradingFolder;
        gradedFootage164.name = "UNDLM_00164_AVEC_POIGNEES";
        gradingSources[164] = gradedFootage164;
        gradingImportCount++;
        gradedImportSuccess164 = true;
        gradedFileName164 = "UNDLM_00164_AVEC_POIGNEES.mov";
        logImportSuccess(164, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00164_AVEC_POIGNEES.mov", gradedFileName164);
    } catch (e) {
        logImportError(164, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00164_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess164 && gradedFileBis164.exists) {
    try {
        var gradedFootage164 = project.importFile(new ImportOptions(gradedFileBis164));
        gradedFootage164.parentFolder = fromGradingFolder;
        gradedFootage164.name = "UNDLM_00164bis";
        gradingSources[164] = gradedFootage164;
        gradingImportCount++;
        gradedImportSuccess164 = true;
        gradedFileName164 = "UNDLM_00164bis.mov";
        logImportSuccess(164, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00164bis.mov", gradedFileName164);
    } catch (e) {
        logImportError(164, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00164bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess164) {
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


// Composition pour plan 00146
var planComp146 = project.items.addComp(
    "SQ07_UNDLM_00146_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp146.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer146 = planComp146.layers.add(bgSolidComp);
bgLayer146.name = "BG_SOLID";
bgLayer146.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer146 = false;
if (gradingSources[146]) {
    var gradedLayer146 = planComp146.layers.add(gradingSources[146]);
    gradedLayer146.name = "UNDLM_00146_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer146.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer146.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer146 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer146 = false;
if (editSources[146]) {
    var editLayer146 = planComp146.layers.add(editSources[146]);
    editLayer146.name = "UNDLM_00146_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer146.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer146.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer146 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity146 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer146) {
    // EDIT toujours activé quand disponible
    editLayer146.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer146) {
        gradedLayer146.enabled = false;
    }
} else if (hasGradedLayer146) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer146.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText146 = planComp146.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText146.name = "WARNING_NO_EDIT";
    warningText146.property("Transform").property("Position").setValue([1280, 200]);
    warningText146.guideLayer = true;
    
    var warningTextDoc146 = warningText146.property("Source Text").value;
    warningTextDoc146.fontSize = 32;
    warningTextDoc146.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc146.font = "Arial-BoldMT";
    warningTextDoc146.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText146.property("Source Text").setValue(warningTextDoc146);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText146 = planComp146.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00146");
    errorText146.name = "ERROR_NO_SOURCE";
    errorText146.property("Transform").property("Position").setValue([1280, 720]);
    errorText146.guideLayer = true;
    
    var errorTextDoc146 = errorText146.property("Source Text").value;
    errorTextDoc146.fontSize = 48;
    errorTextDoc146.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc146.font = "Arial-BoldMT";
    errorTextDoc146.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText146.property("Source Text").setValue(errorTextDoc146);
}

planCompositions[146] = planComp146;


// Composition pour plan 00147
var planComp147 = project.items.addComp(
    "SQ07_UNDLM_00147_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp147.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer147 = planComp147.layers.add(bgSolidComp);
bgLayer147.name = "BG_SOLID";
bgLayer147.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer147 = false;
if (gradingSources[147]) {
    var gradedLayer147 = planComp147.layers.add(gradingSources[147]);
    gradedLayer147.name = "UNDLM_00147_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer147.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer147.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer147 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer147 = false;
if (editSources[147]) {
    var editLayer147 = planComp147.layers.add(editSources[147]);
    editLayer147.name = "UNDLM_00147_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer147.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer147.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer147 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity147 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer147) {
    // EDIT toujours activé quand disponible
    editLayer147.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer147) {
        gradedLayer147.enabled = false;
    }
} else if (hasGradedLayer147) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer147.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText147 = planComp147.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText147.name = "WARNING_NO_EDIT";
    warningText147.property("Transform").property("Position").setValue([1280, 200]);
    warningText147.guideLayer = true;
    
    var warningTextDoc147 = warningText147.property("Source Text").value;
    warningTextDoc147.fontSize = 32;
    warningTextDoc147.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc147.font = "Arial-BoldMT";
    warningTextDoc147.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText147.property("Source Text").setValue(warningTextDoc147);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText147 = planComp147.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00147");
    errorText147.name = "ERROR_NO_SOURCE";
    errorText147.property("Transform").property("Position").setValue([1280, 720]);
    errorText147.guideLayer = true;
    
    var errorTextDoc147 = errorText147.property("Source Text").value;
    errorTextDoc147.fontSize = 48;
    errorTextDoc147.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc147.font = "Arial-BoldMT";
    errorTextDoc147.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText147.property("Source Text").setValue(errorTextDoc147);
}

planCompositions[147] = planComp147;


// Composition pour plan 00148
var planComp148 = project.items.addComp(
    "SQ07_UNDLM_00148_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp148.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer148 = planComp148.layers.add(bgSolidComp);
bgLayer148.name = "BG_SOLID";
bgLayer148.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer148 = false;
if (gradingSources[148]) {
    var gradedLayer148 = planComp148.layers.add(gradingSources[148]);
    gradedLayer148.name = "UNDLM_00148_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer148.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer148.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer148 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer148 = false;
if (editSources[148]) {
    var editLayer148 = planComp148.layers.add(editSources[148]);
    editLayer148.name = "UNDLM_00148_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer148.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer148.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer148 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity148 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer148) {
    // EDIT toujours activé quand disponible
    editLayer148.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer148) {
        gradedLayer148.enabled = false;
    }
} else if (hasGradedLayer148) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer148.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText148 = planComp148.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText148.name = "WARNING_NO_EDIT";
    warningText148.property("Transform").property("Position").setValue([1280, 200]);
    warningText148.guideLayer = true;
    
    var warningTextDoc148 = warningText148.property("Source Text").value;
    warningTextDoc148.fontSize = 32;
    warningTextDoc148.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc148.font = "Arial-BoldMT";
    warningTextDoc148.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText148.property("Source Text").setValue(warningTextDoc148);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText148 = planComp148.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00148");
    errorText148.name = "ERROR_NO_SOURCE";
    errorText148.property("Transform").property("Position").setValue([1280, 720]);
    errorText148.guideLayer = true;
    
    var errorTextDoc148 = errorText148.property("Source Text").value;
    errorTextDoc148.fontSize = 48;
    errorTextDoc148.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc148.font = "Arial-BoldMT";
    errorTextDoc148.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText148.property("Source Text").setValue(errorTextDoc148);
}

planCompositions[148] = planComp148;


// Composition pour plan 00149
var planComp149 = project.items.addComp(
    "SQ07_UNDLM_00149_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp149.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer149 = planComp149.layers.add(bgSolidComp);
bgLayer149.name = "BG_SOLID";
bgLayer149.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer149 = false;
if (gradingSources[149]) {
    var gradedLayer149 = planComp149.layers.add(gradingSources[149]);
    gradedLayer149.name = "UNDLM_00149_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer149.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer149.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer149 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer149 = false;
if (editSources[149]) {
    var editLayer149 = planComp149.layers.add(editSources[149]);
    editLayer149.name = "UNDLM_00149_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer149.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer149.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer149 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity149 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer149) {
    // EDIT toujours activé quand disponible
    editLayer149.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer149) {
        gradedLayer149.enabled = false;
    }
} else if (hasGradedLayer149) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer149.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText149 = planComp149.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText149.name = "WARNING_NO_EDIT";
    warningText149.property("Transform").property("Position").setValue([1280, 200]);
    warningText149.guideLayer = true;
    
    var warningTextDoc149 = warningText149.property("Source Text").value;
    warningTextDoc149.fontSize = 32;
    warningTextDoc149.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc149.font = "Arial-BoldMT";
    warningTextDoc149.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText149.property("Source Text").setValue(warningTextDoc149);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText149 = planComp149.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00149");
    errorText149.name = "ERROR_NO_SOURCE";
    errorText149.property("Transform").property("Position").setValue([1280, 720]);
    errorText149.guideLayer = true;
    
    var errorTextDoc149 = errorText149.property("Source Text").value;
    errorTextDoc149.fontSize = 48;
    errorTextDoc149.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc149.font = "Arial-BoldMT";
    errorTextDoc149.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText149.property("Source Text").setValue(errorTextDoc149);
}

planCompositions[149] = planComp149;


// Composition pour plan 00150
var planComp150 = project.items.addComp(
    "SQ07_UNDLM_00150_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp150.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer150 = planComp150.layers.add(bgSolidComp);
bgLayer150.name = "BG_SOLID";
bgLayer150.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer150 = false;
if (gradingSources[150]) {
    var gradedLayer150 = planComp150.layers.add(gradingSources[150]);
    gradedLayer150.name = "UNDLM_00150_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer150.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer150.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer150 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer150 = false;
if (editSources[150]) {
    var editLayer150 = planComp150.layers.add(editSources[150]);
    editLayer150.name = "UNDLM_00150_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer150.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer150.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer150 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity150 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer150) {
    // EDIT toujours activé quand disponible
    editLayer150.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer150) {
        gradedLayer150.enabled = false;
    }
} else if (hasGradedLayer150) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer150.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText150 = planComp150.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText150.name = "WARNING_NO_EDIT";
    warningText150.property("Transform").property("Position").setValue([1280, 200]);
    warningText150.guideLayer = true;
    
    var warningTextDoc150 = warningText150.property("Source Text").value;
    warningTextDoc150.fontSize = 32;
    warningTextDoc150.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc150.font = "Arial-BoldMT";
    warningTextDoc150.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText150.property("Source Text").setValue(warningTextDoc150);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText150 = planComp150.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00150");
    errorText150.name = "ERROR_NO_SOURCE";
    errorText150.property("Transform").property("Position").setValue([1280, 720]);
    errorText150.guideLayer = true;
    
    var errorTextDoc150 = errorText150.property("Source Text").value;
    errorTextDoc150.fontSize = 48;
    errorTextDoc150.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc150.font = "Arial-BoldMT";
    errorTextDoc150.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText150.property("Source Text").setValue(errorTextDoc150);
}

planCompositions[150] = planComp150;


// Composition pour plan 00151
var planComp151 = project.items.addComp(
    "SQ07_UNDLM_00151_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.64,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp151.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer151 = planComp151.layers.add(bgSolidComp);
bgLayer151.name = "BG_SOLID";
bgLayer151.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer151 = false;
if (gradingSources[151]) {
    var gradedLayer151 = planComp151.layers.add(gradingSources[151]);
    gradedLayer151.name = "UNDLM_00151_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer151.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer151.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer151 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer151 = false;
if (editSources[151]) {
    var editLayer151 = planComp151.layers.add(editSources[151]);
    editLayer151.name = "UNDLM_00151_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer151.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer151.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer151 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity151 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer151) {
    // EDIT toujours activé quand disponible
    editLayer151.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer151) {
        gradedLayer151.enabled = false;
    }
} else if (hasGradedLayer151) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer151.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText151 = planComp151.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText151.name = "WARNING_NO_EDIT";
    warningText151.property("Transform").property("Position").setValue([1280, 200]);
    warningText151.guideLayer = true;
    
    var warningTextDoc151 = warningText151.property("Source Text").value;
    warningTextDoc151.fontSize = 32;
    warningTextDoc151.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc151.font = "Arial-BoldMT";
    warningTextDoc151.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText151.property("Source Text").setValue(warningTextDoc151);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText151 = planComp151.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00151");
    errorText151.name = "ERROR_NO_SOURCE";
    errorText151.property("Transform").property("Position").setValue([1280, 720]);
    errorText151.guideLayer = true;
    
    var errorTextDoc151 = errorText151.property("Source Text").value;
    errorTextDoc151.fontSize = 48;
    errorTextDoc151.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc151.font = "Arial-BoldMT";
    errorTextDoc151.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText151.property("Source Text").setValue(errorTextDoc151);
}

planCompositions[151] = planComp151;


// Composition pour plan 00152
var planComp152 = project.items.addComp(
    "SQ07_UNDLM_00152_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp152.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer152 = planComp152.layers.add(bgSolidComp);
bgLayer152.name = "BG_SOLID";
bgLayer152.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer152 = false;
if (gradingSources[152]) {
    var gradedLayer152 = planComp152.layers.add(gradingSources[152]);
    gradedLayer152.name = "UNDLM_00152_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer152.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer152.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer152 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer152 = false;
if (editSources[152]) {
    var editLayer152 = planComp152.layers.add(editSources[152]);
    editLayer152.name = "UNDLM_00152_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer152.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer152.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer152 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity152 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer152) {
    // EDIT toujours activé quand disponible
    editLayer152.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer152) {
        gradedLayer152.enabled = false;
    }
} else if (hasGradedLayer152) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer152.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText152 = planComp152.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText152.name = "WARNING_NO_EDIT";
    warningText152.property("Transform").property("Position").setValue([1280, 200]);
    warningText152.guideLayer = true;
    
    var warningTextDoc152 = warningText152.property("Source Text").value;
    warningTextDoc152.fontSize = 32;
    warningTextDoc152.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc152.font = "Arial-BoldMT";
    warningTextDoc152.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText152.property("Source Text").setValue(warningTextDoc152);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText152 = planComp152.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00152");
    errorText152.name = "ERROR_NO_SOURCE";
    errorText152.property("Transform").property("Position").setValue([1280, 720]);
    errorText152.guideLayer = true;
    
    var errorTextDoc152 = errorText152.property("Source Text").value;
    errorTextDoc152.fontSize = 48;
    errorTextDoc152.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc152.font = "Arial-BoldMT";
    errorTextDoc152.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText152.property("Source Text").setValue(errorTextDoc152);
}

planCompositions[152] = planComp152;


// Composition pour plan 00153
var planComp153 = project.items.addComp(
    "SQ07_UNDLM_00153_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.2800000000000002,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp153.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer153 = planComp153.layers.add(bgSolidComp);
bgLayer153.name = "BG_SOLID";
bgLayer153.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer153 = false;
if (gradingSources[153]) {
    var gradedLayer153 = planComp153.layers.add(gradingSources[153]);
    gradedLayer153.name = "UNDLM_00153_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer153.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer153.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer153 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer153 = false;
if (editSources[153]) {
    var editLayer153 = planComp153.layers.add(editSources[153]);
    editLayer153.name = "UNDLM_00153_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer153.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer153.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer153 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity153 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer153) {
    // EDIT toujours activé quand disponible
    editLayer153.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer153) {
        gradedLayer153.enabled = false;
    }
} else if (hasGradedLayer153) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer153.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText153 = planComp153.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText153.name = "WARNING_NO_EDIT";
    warningText153.property("Transform").property("Position").setValue([1280, 200]);
    warningText153.guideLayer = true;
    
    var warningTextDoc153 = warningText153.property("Source Text").value;
    warningTextDoc153.fontSize = 32;
    warningTextDoc153.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc153.font = "Arial-BoldMT";
    warningTextDoc153.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText153.property("Source Text").setValue(warningTextDoc153);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText153 = planComp153.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00153");
    errorText153.name = "ERROR_NO_SOURCE";
    errorText153.property("Transform").property("Position").setValue([1280, 720]);
    errorText153.guideLayer = true;
    
    var errorTextDoc153 = errorText153.property("Source Text").value;
    errorTextDoc153.fontSize = 48;
    errorTextDoc153.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc153.font = "Arial-BoldMT";
    errorTextDoc153.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText153.property("Source Text").setValue(errorTextDoc153);
}

planCompositions[153] = planComp153;


// Composition pour plan 00154
var planComp154 = project.items.addComp(
    "SQ07_UNDLM_00154_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp154.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer154 = planComp154.layers.add(bgSolidComp);
bgLayer154.name = "BG_SOLID";
bgLayer154.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer154 = false;
if (gradingSources[154]) {
    var gradedLayer154 = planComp154.layers.add(gradingSources[154]);
    gradedLayer154.name = "UNDLM_00154_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer154.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer154.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer154 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer154 = false;
if (editSources[154]) {
    var editLayer154 = planComp154.layers.add(editSources[154]);
    editLayer154.name = "UNDLM_00154_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer154.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer154.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer154 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity154 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer154) {
    // EDIT toujours activé quand disponible
    editLayer154.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer154) {
        gradedLayer154.enabled = false;
    }
} else if (hasGradedLayer154) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer154.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText154 = planComp154.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText154.name = "WARNING_NO_EDIT";
    warningText154.property("Transform").property("Position").setValue([1280, 200]);
    warningText154.guideLayer = true;
    
    var warningTextDoc154 = warningText154.property("Source Text").value;
    warningTextDoc154.fontSize = 32;
    warningTextDoc154.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc154.font = "Arial-BoldMT";
    warningTextDoc154.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText154.property("Source Text").setValue(warningTextDoc154);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText154 = planComp154.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00154");
    errorText154.name = "ERROR_NO_SOURCE";
    errorText154.property("Transform").property("Position").setValue([1280, 720]);
    errorText154.guideLayer = true;
    
    var errorTextDoc154 = errorText154.property("Source Text").value;
    errorTextDoc154.fontSize = 48;
    errorTextDoc154.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc154.font = "Arial-BoldMT";
    errorTextDoc154.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText154.property("Source Text").setValue(errorTextDoc154);
}

planCompositions[154] = planComp154;


// Composition pour plan 00155
var planComp155 = project.items.addComp(
    "SQ07_UNDLM_00155_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp155.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer155 = planComp155.layers.add(bgSolidComp);
bgLayer155.name = "BG_SOLID";
bgLayer155.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer155 = false;
if (gradingSources[155]) {
    var gradedLayer155 = planComp155.layers.add(gradingSources[155]);
    gradedLayer155.name = "UNDLM_00155_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer155.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer155.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer155 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer155 = false;
if (editSources[155]) {
    var editLayer155 = planComp155.layers.add(editSources[155]);
    editLayer155.name = "UNDLM_00155_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer155.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer155.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer155 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity155 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer155) {
    // EDIT toujours activé quand disponible
    editLayer155.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer155) {
        gradedLayer155.enabled = false;
    }
} else if (hasGradedLayer155) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer155.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText155 = planComp155.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText155.name = "WARNING_NO_EDIT";
    warningText155.property("Transform").property("Position").setValue([1280, 200]);
    warningText155.guideLayer = true;
    
    var warningTextDoc155 = warningText155.property("Source Text").value;
    warningTextDoc155.fontSize = 32;
    warningTextDoc155.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc155.font = "Arial-BoldMT";
    warningTextDoc155.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText155.property("Source Text").setValue(warningTextDoc155);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText155 = planComp155.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00155");
    errorText155.name = "ERROR_NO_SOURCE";
    errorText155.property("Transform").property("Position").setValue([1280, 720]);
    errorText155.guideLayer = true;
    
    var errorTextDoc155 = errorText155.property("Source Text").value;
    errorTextDoc155.fontSize = 48;
    errorTextDoc155.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc155.font = "Arial-BoldMT";
    errorTextDoc155.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText155.property("Source Text").setValue(errorTextDoc155);
}

planCompositions[155] = planComp155;


// Composition pour plan 00156
var planComp156 = project.items.addComp(
    "SQ07_UNDLM_00156_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp156.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer156 = planComp156.layers.add(bgSolidComp);
bgLayer156.name = "BG_SOLID";
bgLayer156.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer156 = false;
if (gradingSources[156]) {
    var gradedLayer156 = planComp156.layers.add(gradingSources[156]);
    gradedLayer156.name = "UNDLM_00156_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer156.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer156.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer156 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer156 = false;
if (editSources[156]) {
    var editLayer156 = planComp156.layers.add(editSources[156]);
    editLayer156.name = "UNDLM_00156_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer156.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer156.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer156 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity156 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer156) {
    // EDIT toujours activé quand disponible
    editLayer156.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer156) {
        gradedLayer156.enabled = false;
    }
} else if (hasGradedLayer156) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer156.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText156 = planComp156.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText156.name = "WARNING_NO_EDIT";
    warningText156.property("Transform").property("Position").setValue([1280, 200]);
    warningText156.guideLayer = true;
    
    var warningTextDoc156 = warningText156.property("Source Text").value;
    warningTextDoc156.fontSize = 32;
    warningTextDoc156.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc156.font = "Arial-BoldMT";
    warningTextDoc156.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText156.property("Source Text").setValue(warningTextDoc156);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText156 = planComp156.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00156");
    errorText156.name = "ERROR_NO_SOURCE";
    errorText156.property("Transform").property("Position").setValue([1280, 720]);
    errorText156.guideLayer = true;
    
    var errorTextDoc156 = errorText156.property("Source Text").value;
    errorTextDoc156.fontSize = 48;
    errorTextDoc156.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc156.font = "Arial-BoldMT";
    errorTextDoc156.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText156.property("Source Text").setValue(errorTextDoc156);
}

planCompositions[156] = planComp156;


// Composition pour plan 00157
var planComp157 = project.items.addComp(
    "SQ07_UNDLM_00157_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp157.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer157 = planComp157.layers.add(bgSolidComp);
bgLayer157.name = "BG_SOLID";
bgLayer157.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer157 = false;
if (gradingSources[157]) {
    var gradedLayer157 = planComp157.layers.add(gradingSources[157]);
    gradedLayer157.name = "UNDLM_00157_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer157.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer157.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer157 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer157 = false;
if (editSources[157]) {
    var editLayer157 = planComp157.layers.add(editSources[157]);
    editLayer157.name = "UNDLM_00157_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer157.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer157.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer157 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity157 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer157) {
    // EDIT toujours activé quand disponible
    editLayer157.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer157) {
        gradedLayer157.enabled = false;
    }
} else if (hasGradedLayer157) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer157.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText157 = planComp157.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText157.name = "WARNING_NO_EDIT";
    warningText157.property("Transform").property("Position").setValue([1280, 200]);
    warningText157.guideLayer = true;
    
    var warningTextDoc157 = warningText157.property("Source Text").value;
    warningTextDoc157.fontSize = 32;
    warningTextDoc157.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc157.font = "Arial-BoldMT";
    warningTextDoc157.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText157.property("Source Text").setValue(warningTextDoc157);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText157 = planComp157.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00157");
    errorText157.name = "ERROR_NO_SOURCE";
    errorText157.property("Transform").property("Position").setValue([1280, 720]);
    errorText157.guideLayer = true;
    
    var errorTextDoc157 = errorText157.property("Source Text").value;
    errorTextDoc157.fontSize = 48;
    errorTextDoc157.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc157.font = "Arial-BoldMT";
    errorTextDoc157.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText157.property("Source Text").setValue(errorTextDoc157);
}

planCompositions[157] = planComp157;


// Composition pour plan 00158
var planComp158 = project.items.addComp(
    "SQ07_UNDLM_00158_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp158.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer158 = planComp158.layers.add(bgSolidComp);
bgLayer158.name = "BG_SOLID";
bgLayer158.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer158 = false;
if (gradingSources[158]) {
    var gradedLayer158 = planComp158.layers.add(gradingSources[158]);
    gradedLayer158.name = "UNDLM_00158_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer158.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer158.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer158 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer158 = false;
if (editSources[158]) {
    var editLayer158 = planComp158.layers.add(editSources[158]);
    editLayer158.name = "UNDLM_00158_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer158.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer158.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer158 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity158 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer158) {
    // EDIT toujours activé quand disponible
    editLayer158.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer158) {
        gradedLayer158.enabled = false;
    }
} else if (hasGradedLayer158) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer158.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText158 = planComp158.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText158.name = "WARNING_NO_EDIT";
    warningText158.property("Transform").property("Position").setValue([1280, 200]);
    warningText158.guideLayer = true;
    
    var warningTextDoc158 = warningText158.property("Source Text").value;
    warningTextDoc158.fontSize = 32;
    warningTextDoc158.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc158.font = "Arial-BoldMT";
    warningTextDoc158.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText158.property("Source Text").setValue(warningTextDoc158);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText158 = planComp158.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00158");
    errorText158.name = "ERROR_NO_SOURCE";
    errorText158.property("Transform").property("Position").setValue([1280, 720]);
    errorText158.guideLayer = true;
    
    var errorTextDoc158 = errorText158.property("Source Text").value;
    errorTextDoc158.fontSize = 48;
    errorTextDoc158.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc158.font = "Arial-BoldMT";
    errorTextDoc158.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText158.property("Source Text").setValue(errorTextDoc158);
}

planCompositions[158] = planComp158;


// Composition pour plan 00159
var planComp159 = project.items.addComp(
    "SQ07_UNDLM_00159_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp159.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer159 = planComp159.layers.add(bgSolidComp);
bgLayer159.name = "BG_SOLID";
bgLayer159.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer159 = false;
if (gradingSources[159]) {
    var gradedLayer159 = planComp159.layers.add(gradingSources[159]);
    gradedLayer159.name = "UNDLM_00159_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer159.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer159.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer159 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer159 = false;
if (editSources[159]) {
    var editLayer159 = planComp159.layers.add(editSources[159]);
    editLayer159.name = "UNDLM_00159_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer159.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer159.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer159 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity159 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer159) {
    // EDIT toujours activé quand disponible
    editLayer159.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer159) {
        gradedLayer159.enabled = false;
    }
} else if (hasGradedLayer159) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer159.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText159 = planComp159.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText159.name = "WARNING_NO_EDIT";
    warningText159.property("Transform").property("Position").setValue([1280, 200]);
    warningText159.guideLayer = true;
    
    var warningTextDoc159 = warningText159.property("Source Text").value;
    warningTextDoc159.fontSize = 32;
    warningTextDoc159.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc159.font = "Arial-BoldMT";
    warningTextDoc159.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText159.property("Source Text").setValue(warningTextDoc159);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText159 = planComp159.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00159");
    errorText159.name = "ERROR_NO_SOURCE";
    errorText159.property("Transform").property("Position").setValue([1280, 720]);
    errorText159.guideLayer = true;
    
    var errorTextDoc159 = errorText159.property("Source Text").value;
    errorTextDoc159.fontSize = 48;
    errorTextDoc159.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc159.font = "Arial-BoldMT";
    errorTextDoc159.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText159.property("Source Text").setValue(errorTextDoc159);
}

planCompositions[159] = planComp159;


// Composition pour plan 00160
var planComp160 = project.items.addComp(
    "SQ07_UNDLM_00160_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp160.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer160 = planComp160.layers.add(bgSolidComp);
bgLayer160.name = "BG_SOLID";
bgLayer160.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer160 = false;
if (gradingSources[160]) {
    var gradedLayer160 = planComp160.layers.add(gradingSources[160]);
    gradedLayer160.name = "UNDLM_00160_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer160.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer160.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer160 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer160 = false;
if (editSources[160]) {
    var editLayer160 = planComp160.layers.add(editSources[160]);
    editLayer160.name = "UNDLM_00160_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer160.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer160.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer160 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity160 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer160) {
    // EDIT toujours activé quand disponible
    editLayer160.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer160) {
        gradedLayer160.enabled = false;
    }
} else if (hasGradedLayer160) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer160.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText160 = planComp160.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText160.name = "WARNING_NO_EDIT";
    warningText160.property("Transform").property("Position").setValue([1280, 200]);
    warningText160.guideLayer = true;
    
    var warningTextDoc160 = warningText160.property("Source Text").value;
    warningTextDoc160.fontSize = 32;
    warningTextDoc160.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc160.font = "Arial-BoldMT";
    warningTextDoc160.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText160.property("Source Text").setValue(warningTextDoc160);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText160 = planComp160.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00160");
    errorText160.name = "ERROR_NO_SOURCE";
    errorText160.property("Transform").property("Position").setValue([1280, 720]);
    errorText160.guideLayer = true;
    
    var errorTextDoc160 = errorText160.property("Source Text").value;
    errorTextDoc160.fontSize = 48;
    errorTextDoc160.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc160.font = "Arial-BoldMT";
    errorTextDoc160.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText160.property("Source Text").setValue(errorTextDoc160);
}

planCompositions[160] = planComp160;


// Composition pour plan 00161
var planComp161 = project.items.addComp(
    "SQ07_UNDLM_00161_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp161.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer161 = planComp161.layers.add(bgSolidComp);
bgLayer161.name = "BG_SOLID";
bgLayer161.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer161 = false;
if (gradingSources[161]) {
    var gradedLayer161 = planComp161.layers.add(gradingSources[161]);
    gradedLayer161.name = "UNDLM_00161_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer161.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer161.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer161 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer161 = false;
if (editSources[161]) {
    var editLayer161 = planComp161.layers.add(editSources[161]);
    editLayer161.name = "UNDLM_00161_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer161.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer161.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer161 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity161 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer161) {
    // EDIT toujours activé quand disponible
    editLayer161.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer161) {
        gradedLayer161.enabled = false;
    }
} else if (hasGradedLayer161) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer161.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText161 = planComp161.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText161.name = "WARNING_NO_EDIT";
    warningText161.property("Transform").property("Position").setValue([1280, 200]);
    warningText161.guideLayer = true;
    
    var warningTextDoc161 = warningText161.property("Source Text").value;
    warningTextDoc161.fontSize = 32;
    warningTextDoc161.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc161.font = "Arial-BoldMT";
    warningTextDoc161.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText161.property("Source Text").setValue(warningTextDoc161);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText161 = planComp161.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00161");
    errorText161.name = "ERROR_NO_SOURCE";
    errorText161.property("Transform").property("Position").setValue([1280, 720]);
    errorText161.guideLayer = true;
    
    var errorTextDoc161 = errorText161.property("Source Text").value;
    errorTextDoc161.fontSize = 48;
    errorTextDoc161.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc161.font = "Arial-BoldMT";
    errorTextDoc161.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText161.property("Source Text").setValue(errorTextDoc161);
}

planCompositions[161] = planComp161;


// Composition pour plan 00162
var planComp162 = project.items.addComp(
    "SQ07_UNDLM_00162_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp162.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer162 = planComp162.layers.add(bgSolidComp);
bgLayer162.name = "BG_SOLID";
bgLayer162.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer162 = false;
if (gradingSources[162]) {
    var gradedLayer162 = planComp162.layers.add(gradingSources[162]);
    gradedLayer162.name = "UNDLM_00162_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer162.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer162.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer162 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer162 = false;
if (editSources[162]) {
    var editLayer162 = planComp162.layers.add(editSources[162]);
    editLayer162.name = "UNDLM_00162_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer162.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer162.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer162 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity162 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer162) {
    // EDIT toujours activé quand disponible
    editLayer162.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer162) {
        gradedLayer162.enabled = false;
    }
} else if (hasGradedLayer162) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer162.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText162 = planComp162.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText162.name = "WARNING_NO_EDIT";
    warningText162.property("Transform").property("Position").setValue([1280, 200]);
    warningText162.guideLayer = true;
    
    var warningTextDoc162 = warningText162.property("Source Text").value;
    warningTextDoc162.fontSize = 32;
    warningTextDoc162.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc162.font = "Arial-BoldMT";
    warningTextDoc162.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText162.property("Source Text").setValue(warningTextDoc162);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText162 = planComp162.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00162");
    errorText162.name = "ERROR_NO_SOURCE";
    errorText162.property("Transform").property("Position").setValue([1280, 720]);
    errorText162.guideLayer = true;
    
    var errorTextDoc162 = errorText162.property("Source Text").value;
    errorTextDoc162.fontSize = 48;
    errorTextDoc162.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc162.font = "Arial-BoldMT";
    errorTextDoc162.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText162.property("Source Text").setValue(errorTextDoc162);
}

planCompositions[162] = planComp162;


// Composition pour plan 00163
var planComp163 = project.items.addComp(
    "SQ07_UNDLM_00163_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.64,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp163.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer163 = planComp163.layers.add(bgSolidComp);
bgLayer163.name = "BG_SOLID";
bgLayer163.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer163 = false;
if (gradingSources[163]) {
    var gradedLayer163 = planComp163.layers.add(gradingSources[163]);
    gradedLayer163.name = "UNDLM_00163_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer163.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer163.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer163 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer163 = false;
if (editSources[163]) {
    var editLayer163 = planComp163.layers.add(editSources[163]);
    editLayer163.name = "UNDLM_00163_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer163.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer163.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer163 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity163 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer163) {
    // EDIT toujours activé quand disponible
    editLayer163.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer163) {
        gradedLayer163.enabled = false;
    }
} else if (hasGradedLayer163) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer163.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText163 = planComp163.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText163.name = "WARNING_NO_EDIT";
    warningText163.property("Transform").property("Position").setValue([1280, 200]);
    warningText163.guideLayer = true;
    
    var warningTextDoc163 = warningText163.property("Source Text").value;
    warningTextDoc163.fontSize = 32;
    warningTextDoc163.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc163.font = "Arial-BoldMT";
    warningTextDoc163.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText163.property("Source Text").setValue(warningTextDoc163);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText163 = planComp163.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00163");
    errorText163.name = "ERROR_NO_SOURCE";
    errorText163.property("Transform").property("Position").setValue([1280, 720]);
    errorText163.guideLayer = true;
    
    var errorTextDoc163 = errorText163.property("Source Text").value;
    errorTextDoc163.fontSize = 48;
    errorTextDoc163.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc163.font = "Arial-BoldMT";
    errorTextDoc163.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText163.property("Source Text").setValue(errorTextDoc163);
}

planCompositions[163] = planComp163;


// Composition pour plan 00164
var planComp164 = project.items.addComp(
    "SQ07_UNDLM_00164_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp164.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer164 = planComp164.layers.add(bgSolidComp);
bgLayer164.name = "BG_SOLID";
bgLayer164.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer164 = false;
if (gradingSources[164]) {
    var gradedLayer164 = planComp164.layers.add(gradingSources[164]);
    gradedLayer164.name = "UNDLM_00164_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer164.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer164.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer164 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer164 = false;
if (editSources[164]) {
    var editLayer164 = planComp164.layers.add(editSources[164]);
    editLayer164.name = "UNDLM_00164_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer164.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer164.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer164 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity164 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer164) {
    // EDIT toujours activé quand disponible
    editLayer164.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer164) {
        gradedLayer164.enabled = false;
    }
} else if (hasGradedLayer164) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer164.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText164 = planComp164.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText164.name = "WARNING_NO_EDIT";
    warningText164.property("Transform").property("Position").setValue([1280, 200]);
    warningText164.guideLayer = true;
    
    var warningTextDoc164 = warningText164.property("Source Text").value;
    warningTextDoc164.fontSize = 32;
    warningTextDoc164.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc164.font = "Arial-BoldMT";
    warningTextDoc164.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText164.property("Source Text").setValue(warningTextDoc164);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText164 = planComp164.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00164");
    errorText164.name = "ERROR_NO_SOURCE";
    errorText164.property("Transform").property("Position").setValue([1280, 720]);
    errorText164.guideLayer = true;
    
    var errorTextDoc164 = errorText164.property("Source Text").value;
    errorTextDoc164.fontSize = 48;
    errorTextDoc164.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc164.font = "Arial-BoldMT";
    errorTextDoc164.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText164.property("Source Text").setValue(errorTextDoc164);
}

planCompositions[164] = planComp164;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ07_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    126.2, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00146 à la timeline master
if (planCompositions[146]) {
    var masterLayer146 = masterComp.layers.add(planCompositions[146]);
    masterLayer146.startTime = 0;
    masterLayer146.name = "UNDLM_00146";
    masterLayer146.label = 1; // Couleurs alternées
}

// Ajouter plan 00147 à la timeline master
if (planCompositions[147]) {
    var masterLayer147 = masterComp.layers.add(planCompositions[147]);
    masterLayer147.startTime = 10.0;
    masterLayer147.name = "UNDLM_00147";
    masterLayer147.label = 2; // Couleurs alternées
}

// Ajouter plan 00148 à la timeline master
if (planCompositions[148]) {
    var masterLayer148 = masterComp.layers.add(planCompositions[148]);
    masterLayer148.startTime = 19.4;
    masterLayer148.name = "UNDLM_00148";
    masterLayer148.label = 3; // Couleurs alternées
}

// Ajouter plan 00149 à la timeline master
if (planCompositions[149]) {
    var masterLayer149 = masterComp.layers.add(planCompositions[149]);
    masterLayer149.startTime = 27.2;
    masterLayer149.name = "UNDLM_00149";
    masterLayer149.label = 4; // Couleurs alternées
}

// Ajouter plan 00150 à la timeline master
if (planCompositions[150]) {
    var masterLayer150 = masterComp.layers.add(planCompositions[150]);
    masterLayer150.startTime = 35.239999999999995;
    masterLayer150.name = "UNDLM_00150";
    masterLayer150.label = 5; // Couleurs alternées
}

// Ajouter plan 00151 à la timeline master
if (planCompositions[151]) {
    var masterLayer151 = masterComp.layers.add(planCompositions[151]);
    masterLayer151.startTime = 39.48;
    masterLayer151.name = "UNDLM_00151";
    masterLayer151.label = 6; // Couleurs alternées
}

// Ajouter plan 00152 à la timeline master
if (planCompositions[152]) {
    var masterLayer152 = masterComp.layers.add(planCompositions[152]);
    masterLayer152.startTime = 43.12;
    masterLayer152.name = "UNDLM_00152";
    masterLayer152.label = 7; // Couleurs alternées
}

// Ajouter plan 00153 à la timeline master
if (planCompositions[153]) {
    var masterLayer153 = masterComp.layers.add(planCompositions[153]);
    masterLayer153.startTime = 52.92;
    masterLayer153.name = "UNDLM_00153";
    masterLayer153.label = 8; // Couleurs alternées
}

// Ajouter plan 00154 à la timeline master
if (planCompositions[154]) {
    var masterLayer154 = masterComp.layers.add(planCompositions[154]);
    masterLayer154.startTime = 56.2;
    masterLayer154.name = "UNDLM_00154";
    masterLayer154.label = 9; // Couleurs alternées
}

// Ajouter plan 00155 à la timeline master
if (planCompositions[155]) {
    var masterLayer155 = masterComp.layers.add(planCompositions[155]);
    masterLayer155.startTime = 60.040000000000006;
    masterLayer155.name = "UNDLM_00155";
    masterLayer155.label = 10; // Couleurs alternées
}

// Ajouter plan 00156 à la timeline master
if (planCompositions[156]) {
    var masterLayer156 = masterComp.layers.add(planCompositions[156]);
    masterLayer156.startTime = 70.32000000000001;
    masterLayer156.name = "UNDLM_00156";
    masterLayer156.label = 11; // Couleurs alternées
}

// Ajouter plan 00157 à la timeline master
if (planCompositions[157]) {
    var masterLayer157 = masterComp.layers.add(planCompositions[157]);
    masterLayer157.startTime = 72.12;
    masterLayer157.name = "UNDLM_00157";
    masterLayer157.label = 12; // Couleurs alternées
}

// Ajouter plan 00158 à la timeline master
if (planCompositions[158]) {
    var masterLayer158 = masterComp.layers.add(planCompositions[158]);
    masterLayer158.startTime = 75.12;
    masterLayer158.name = "UNDLM_00158";
    masterLayer158.label = 13; // Couleurs alternées
}

// Ajouter plan 00159 à la timeline master
if (planCompositions[159]) {
    var masterLayer159 = masterComp.layers.add(planCompositions[159]);
    masterLayer159.startTime = 79.24000000000001;
    masterLayer159.name = "UNDLM_00159";
    masterLayer159.label = 14; // Couleurs alternées
}

// Ajouter plan 00160 à la timeline master
if (planCompositions[160]) {
    var masterLayer160 = masterComp.layers.add(planCompositions[160]);
    masterLayer160.startTime = 88.4;
    masterLayer160.name = "UNDLM_00160";
    masterLayer160.label = 15; // Couleurs alternées
}

// Ajouter plan 00161 à la timeline master
if (planCompositions[161]) {
    var masterLayer161 = masterComp.layers.add(planCompositions[161]);
    masterLayer161.startTime = 94.52000000000001;
    masterLayer161.name = "UNDLM_00161";
    masterLayer161.label = 16; // Couleurs alternées
}

// Ajouter plan 00162 à la timeline master
if (planCompositions[162]) {
    var masterLayer162 = masterComp.layers.add(planCompositions[162]);
    masterLayer162.startTime = 98.04;
    masterLayer162.name = "UNDLM_00162";
    masterLayer162.label = 1; // Couleurs alternées
}

// Ajouter plan 00163 à la timeline master
if (planCompositions[163]) {
    var masterLayer163 = masterComp.layers.add(planCompositions[163]);
    masterLayer163.startTime = 106.4;
    masterLayer163.name = "UNDLM_00163";
    masterLayer163.label = 2; // Couleurs alternées
}

// Ajouter plan 00164 à la timeline master
if (planCompositions[164]) {
    var masterLayer164 = masterComp.layers.add(planCompositions[164]);
    masterLayer164.startTime = 117.04;
    masterLayer164.name = "UNDLM_00164";
    masterLayer164.label = 3; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ07";\n' +
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
    {start: 0, end: 10.0, name: "UNDLM_00146"},
    {start: 10.0, end: 19.4, name: "UNDLM_00147"},
    {start: 19.4, end: 27.2, name: "UNDLM_00148"},
    {start: 27.2, end: 35.239999999999995, name: "UNDLM_00149"},
    {start: 35.239999999999995, end: 39.48, name: "UNDLM_00150"},
    {start: 39.48, end: 43.12, name: "UNDLM_00151"},
    {start: 43.12, end: 52.92, name: "UNDLM_00152"},
    {start: 52.92, end: 56.2, name: "UNDLM_00153"},
    {start: 56.2, end: 60.040000000000006, name: "UNDLM_00154"},
    {start: 60.040000000000006, end: 70.32000000000001, name: "UNDLM_00155"},
    {start: 70.32000000000001, end: 72.12, name: "UNDLM_00156"},
    {start: 72.12, end: 75.12, name: "UNDLM_00157"},
    {start: 75.12, end: 79.24000000000001, name: "UNDLM_00158"},
    {start: 79.24000000000001, end: 88.4, name: "UNDLM_00159"},
    {start: 88.4, end: 94.52000000000001, name: "UNDLM_00160"},
    {start: 94.52000000000001, end: 98.04, name: "UNDLM_00161"},
    {start: 98.04, end: 106.4, name: "UNDLM_00162"},
    {start: 106.4, end: 117.04, name: "UNDLM_00163"},
    {start: 117.04, end: 126.2, name: "UNDLM_00164"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ07/_AE/SQ07_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 19;
var totalCount = 19;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ07 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(126.2 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ07_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ07:" + totalCount + ":" + gradedCount);
