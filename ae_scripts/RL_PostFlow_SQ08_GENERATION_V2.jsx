
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ08 avec 11 plans
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


// Import plan EDIT 00165
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile165 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00165.mov");
var editFilePoignees165 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00165_AVEC_POIGNEES.mov");
var editFileBis165 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00165bis.mov");

var importSuccess165 = false;
var fileName165 = "";

// Tenter import standard
if (editFile165.exists) {
    try {
        var editFootage165 = project.importFile(new ImportOptions(editFile165));
        editFootage165.parentFolder = fromEditFolder;
        editFootage165.name = "UNDLM_00165";
        editSources[165] = editFootage165;
        editImportCount++;
        importSuccess165 = true;
        fileName165 = "UNDLM_00165.mov";
        logImportSuccess(165, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00165.mov", fileName165);
    } catch (e) {
        logImportError(165, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00165.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess165 && editFilePoignees165.exists) {
    try {
        var editFootage165 = project.importFile(new ImportOptions(editFilePoignees165));
        editFootage165.parentFolder = fromEditFolder;
        editFootage165.name = "UNDLM_00165_AVEC_POIGNEES";
        editSources[165] = editFootage165;
        editImportCount++;
        importSuccess165 = true;
        fileName165 = "UNDLM_00165_AVEC_POIGNEES.mov";
        logImportSuccess(165, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00165_AVEC_POIGNEES.mov", fileName165);
    } catch (e) {
        logImportError(165, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00165_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess165 && editFileBis165.exists) {
    try {
        var editFootage165 = project.importFile(new ImportOptions(editFileBis165));
        editFootage165.parentFolder = fromEditFolder;
        editFootage165.name = "UNDLM_00165bis";
        editSources[165] = editFootage165;
        editImportCount++;
        importSuccess165 = true;
        fileName165 = "UNDLM_00165bis.mov";
        logImportSuccess(165, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00165bis.mov", fileName165);
    } catch (e) {
        logImportError(165, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00165bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess165) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00165.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00166
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile166 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00166.mov");
var editFilePoignees166 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00166_AVEC_POIGNEES.mov");
var editFileBis166 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00166bis.mov");

var importSuccess166 = false;
var fileName166 = "";

// Tenter import standard
if (editFile166.exists) {
    try {
        var editFootage166 = project.importFile(new ImportOptions(editFile166));
        editFootage166.parentFolder = fromEditFolder;
        editFootage166.name = "UNDLM_00166";
        editSources[166] = editFootage166;
        editImportCount++;
        importSuccess166 = true;
        fileName166 = "UNDLM_00166.mov";
        logImportSuccess(166, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00166.mov", fileName166);
    } catch (e) {
        logImportError(166, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00166.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess166 && editFilePoignees166.exists) {
    try {
        var editFootage166 = project.importFile(new ImportOptions(editFilePoignees166));
        editFootage166.parentFolder = fromEditFolder;
        editFootage166.name = "UNDLM_00166_AVEC_POIGNEES";
        editSources[166] = editFootage166;
        editImportCount++;
        importSuccess166 = true;
        fileName166 = "UNDLM_00166_AVEC_POIGNEES.mov";
        logImportSuccess(166, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00166_AVEC_POIGNEES.mov", fileName166);
    } catch (e) {
        logImportError(166, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00166_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess166 && editFileBis166.exists) {
    try {
        var editFootage166 = project.importFile(new ImportOptions(editFileBis166));
        editFootage166.parentFolder = fromEditFolder;
        editFootage166.name = "UNDLM_00166bis";
        editSources[166] = editFootage166;
        editImportCount++;
        importSuccess166 = true;
        fileName166 = "UNDLM_00166bis.mov";
        logImportSuccess(166, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00166bis.mov", fileName166);
    } catch (e) {
        logImportError(166, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00166bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess166) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00166.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00167
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile167 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00167.mov");
var editFilePoignees167 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00167_AVEC_POIGNEES.mov");
var editFileBis167 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00167bis.mov");

var importSuccess167 = false;
var fileName167 = "";

// Tenter import standard
if (editFile167.exists) {
    try {
        var editFootage167 = project.importFile(new ImportOptions(editFile167));
        editFootage167.parentFolder = fromEditFolder;
        editFootage167.name = "UNDLM_00167";
        editSources[167] = editFootage167;
        editImportCount++;
        importSuccess167 = true;
        fileName167 = "UNDLM_00167.mov";
        logImportSuccess(167, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00167.mov", fileName167);
    } catch (e) {
        logImportError(167, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00167.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess167 && editFilePoignees167.exists) {
    try {
        var editFootage167 = project.importFile(new ImportOptions(editFilePoignees167));
        editFootage167.parentFolder = fromEditFolder;
        editFootage167.name = "UNDLM_00167_AVEC_POIGNEES";
        editSources[167] = editFootage167;
        editImportCount++;
        importSuccess167 = true;
        fileName167 = "UNDLM_00167_AVEC_POIGNEES.mov";
        logImportSuccess(167, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00167_AVEC_POIGNEES.mov", fileName167);
    } catch (e) {
        logImportError(167, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00167_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess167 && editFileBis167.exists) {
    try {
        var editFootage167 = project.importFile(new ImportOptions(editFileBis167));
        editFootage167.parentFolder = fromEditFolder;
        editFootage167.name = "UNDLM_00167bis";
        editSources[167] = editFootage167;
        editImportCount++;
        importSuccess167 = true;
        fileName167 = "UNDLM_00167bis.mov";
        logImportSuccess(167, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00167bis.mov", fileName167);
    } catch (e) {
        logImportError(167, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00167bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess167) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00167.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00168
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile168 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00168.mov");
var editFilePoignees168 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00168_AVEC_POIGNEES.mov");
var editFileBis168 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00168bis.mov");

var importSuccess168 = false;
var fileName168 = "";

// Tenter import standard
if (editFile168.exists) {
    try {
        var editFootage168 = project.importFile(new ImportOptions(editFile168));
        editFootage168.parentFolder = fromEditFolder;
        editFootage168.name = "UNDLM_00168";
        editSources[168] = editFootage168;
        editImportCount++;
        importSuccess168 = true;
        fileName168 = "UNDLM_00168.mov";
        logImportSuccess(168, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00168.mov", fileName168);
    } catch (e) {
        logImportError(168, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00168.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess168 && editFilePoignees168.exists) {
    try {
        var editFootage168 = project.importFile(new ImportOptions(editFilePoignees168));
        editFootage168.parentFolder = fromEditFolder;
        editFootage168.name = "UNDLM_00168_AVEC_POIGNEES";
        editSources[168] = editFootage168;
        editImportCount++;
        importSuccess168 = true;
        fileName168 = "UNDLM_00168_AVEC_POIGNEES.mov";
        logImportSuccess(168, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00168_AVEC_POIGNEES.mov", fileName168);
    } catch (e) {
        logImportError(168, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00168_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess168 && editFileBis168.exists) {
    try {
        var editFootage168 = project.importFile(new ImportOptions(editFileBis168));
        editFootage168.parentFolder = fromEditFolder;
        editFootage168.name = "UNDLM_00168bis";
        editSources[168] = editFootage168;
        editImportCount++;
        importSuccess168 = true;
        fileName168 = "UNDLM_00168bis.mov";
        logImportSuccess(168, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00168bis.mov", fileName168);
    } catch (e) {
        logImportError(168, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00168bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess168) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00168.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00169
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile169 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00169.mov");
var editFilePoignees169 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00169_AVEC_POIGNEES.mov");
var editFileBis169 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00169bis.mov");

var importSuccess169 = false;
var fileName169 = "";

// Tenter import standard
if (editFile169.exists) {
    try {
        var editFootage169 = project.importFile(new ImportOptions(editFile169));
        editFootage169.parentFolder = fromEditFolder;
        editFootage169.name = "UNDLM_00169";
        editSources[169] = editFootage169;
        editImportCount++;
        importSuccess169 = true;
        fileName169 = "UNDLM_00169.mov";
        logImportSuccess(169, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00169.mov", fileName169);
    } catch (e) {
        logImportError(169, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00169.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess169 && editFilePoignees169.exists) {
    try {
        var editFootage169 = project.importFile(new ImportOptions(editFilePoignees169));
        editFootage169.parentFolder = fromEditFolder;
        editFootage169.name = "UNDLM_00169_AVEC_POIGNEES";
        editSources[169] = editFootage169;
        editImportCount++;
        importSuccess169 = true;
        fileName169 = "UNDLM_00169_AVEC_POIGNEES.mov";
        logImportSuccess(169, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00169_AVEC_POIGNEES.mov", fileName169);
    } catch (e) {
        logImportError(169, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00169_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess169 && editFileBis169.exists) {
    try {
        var editFootage169 = project.importFile(new ImportOptions(editFileBis169));
        editFootage169.parentFolder = fromEditFolder;
        editFootage169.name = "UNDLM_00169bis";
        editSources[169] = editFootage169;
        editImportCount++;
        importSuccess169 = true;
        fileName169 = "UNDLM_00169bis.mov";
        logImportSuccess(169, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00169bis.mov", fileName169);
    } catch (e) {
        logImportError(169, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00169bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess169) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00169.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00170
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile170 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00170.mov");
var editFilePoignees170 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00170_AVEC_POIGNEES.mov");
var editFileBis170 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00170bis.mov");

var importSuccess170 = false;
var fileName170 = "";

// Tenter import standard
if (editFile170.exists) {
    try {
        var editFootage170 = project.importFile(new ImportOptions(editFile170));
        editFootage170.parentFolder = fromEditFolder;
        editFootage170.name = "UNDLM_00170";
        editSources[170] = editFootage170;
        editImportCount++;
        importSuccess170 = true;
        fileName170 = "UNDLM_00170.mov";
        logImportSuccess(170, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00170.mov", fileName170);
    } catch (e) {
        logImportError(170, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00170.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess170 && editFilePoignees170.exists) {
    try {
        var editFootage170 = project.importFile(new ImportOptions(editFilePoignees170));
        editFootage170.parentFolder = fromEditFolder;
        editFootage170.name = "UNDLM_00170_AVEC_POIGNEES";
        editSources[170] = editFootage170;
        editImportCount++;
        importSuccess170 = true;
        fileName170 = "UNDLM_00170_AVEC_POIGNEES.mov";
        logImportSuccess(170, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00170_AVEC_POIGNEES.mov", fileName170);
    } catch (e) {
        logImportError(170, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00170_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess170 && editFileBis170.exists) {
    try {
        var editFootage170 = project.importFile(new ImportOptions(editFileBis170));
        editFootage170.parentFolder = fromEditFolder;
        editFootage170.name = "UNDLM_00170bis";
        editSources[170] = editFootage170;
        editImportCount++;
        importSuccess170 = true;
        fileName170 = "UNDLM_00170bis.mov";
        logImportSuccess(170, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00170bis.mov", fileName170);
    } catch (e) {
        logImportError(170, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00170bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess170) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00170.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00171
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile171 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00171.mov");
var editFilePoignees171 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00171_AVEC_POIGNEES.mov");
var editFileBis171 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00171bis.mov");

var importSuccess171 = false;
var fileName171 = "";

// Tenter import standard
if (editFile171.exists) {
    try {
        var editFootage171 = project.importFile(new ImportOptions(editFile171));
        editFootage171.parentFolder = fromEditFolder;
        editFootage171.name = "UNDLM_00171";
        editSources[171] = editFootage171;
        editImportCount++;
        importSuccess171 = true;
        fileName171 = "UNDLM_00171.mov";
        logImportSuccess(171, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00171.mov", fileName171);
    } catch (e) {
        logImportError(171, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00171.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess171 && editFilePoignees171.exists) {
    try {
        var editFootage171 = project.importFile(new ImportOptions(editFilePoignees171));
        editFootage171.parentFolder = fromEditFolder;
        editFootage171.name = "UNDLM_00171_AVEC_POIGNEES";
        editSources[171] = editFootage171;
        editImportCount++;
        importSuccess171 = true;
        fileName171 = "UNDLM_00171_AVEC_POIGNEES.mov";
        logImportSuccess(171, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00171_AVEC_POIGNEES.mov", fileName171);
    } catch (e) {
        logImportError(171, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00171_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess171 && editFileBis171.exists) {
    try {
        var editFootage171 = project.importFile(new ImportOptions(editFileBis171));
        editFootage171.parentFolder = fromEditFolder;
        editFootage171.name = "UNDLM_00171bis";
        editSources[171] = editFootage171;
        editImportCount++;
        importSuccess171 = true;
        fileName171 = "UNDLM_00171bis.mov";
        logImportSuccess(171, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00171bis.mov", fileName171);
    } catch (e) {
        logImportError(171, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00171bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess171) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00171.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00172
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile172 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00172.mov");
var editFilePoignees172 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00172_AVEC_POIGNEES.mov");
var editFileBis172 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00172bis.mov");

var importSuccess172 = false;
var fileName172 = "";

// Tenter import standard
if (editFile172.exists) {
    try {
        var editFootage172 = project.importFile(new ImportOptions(editFile172));
        editFootage172.parentFolder = fromEditFolder;
        editFootage172.name = "UNDLM_00172";
        editSources[172] = editFootage172;
        editImportCount++;
        importSuccess172 = true;
        fileName172 = "UNDLM_00172.mov";
        logImportSuccess(172, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00172.mov", fileName172);
    } catch (e) {
        logImportError(172, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00172.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess172 && editFilePoignees172.exists) {
    try {
        var editFootage172 = project.importFile(new ImportOptions(editFilePoignees172));
        editFootage172.parentFolder = fromEditFolder;
        editFootage172.name = "UNDLM_00172_AVEC_POIGNEES";
        editSources[172] = editFootage172;
        editImportCount++;
        importSuccess172 = true;
        fileName172 = "UNDLM_00172_AVEC_POIGNEES.mov";
        logImportSuccess(172, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00172_AVEC_POIGNEES.mov", fileName172);
    } catch (e) {
        logImportError(172, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00172_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess172 && editFileBis172.exists) {
    try {
        var editFootage172 = project.importFile(new ImportOptions(editFileBis172));
        editFootage172.parentFolder = fromEditFolder;
        editFootage172.name = "UNDLM_00172bis";
        editSources[172] = editFootage172;
        editImportCount++;
        importSuccess172 = true;
        fileName172 = "UNDLM_00172bis.mov";
        logImportSuccess(172, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00172bis.mov", fileName172);
    } catch (e) {
        logImportError(172, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00172bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess172) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00172.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00173
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile173 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00173.mov");
var editFilePoignees173 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00173_AVEC_POIGNEES.mov");
var editFileBis173 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00173bis.mov");

var importSuccess173 = false;
var fileName173 = "";

// Tenter import standard
if (editFile173.exists) {
    try {
        var editFootage173 = project.importFile(new ImportOptions(editFile173));
        editFootage173.parentFolder = fromEditFolder;
        editFootage173.name = "UNDLM_00173";
        editSources[173] = editFootage173;
        editImportCount++;
        importSuccess173 = true;
        fileName173 = "UNDLM_00173.mov";
        logImportSuccess(173, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00173.mov", fileName173);
    } catch (e) {
        logImportError(173, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00173.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess173 && editFilePoignees173.exists) {
    try {
        var editFootage173 = project.importFile(new ImportOptions(editFilePoignees173));
        editFootage173.parentFolder = fromEditFolder;
        editFootage173.name = "UNDLM_00173_AVEC_POIGNEES";
        editSources[173] = editFootage173;
        editImportCount++;
        importSuccess173 = true;
        fileName173 = "UNDLM_00173_AVEC_POIGNEES.mov";
        logImportSuccess(173, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00173_AVEC_POIGNEES.mov", fileName173);
    } catch (e) {
        logImportError(173, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00173_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess173 && editFileBis173.exists) {
    try {
        var editFootage173 = project.importFile(new ImportOptions(editFileBis173));
        editFootage173.parentFolder = fromEditFolder;
        editFootage173.name = "UNDLM_00173bis";
        editSources[173] = editFootage173;
        editImportCount++;
        importSuccess173 = true;
        fileName173 = "UNDLM_00173bis.mov";
        logImportSuccess(173, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00173bis.mov", fileName173);
    } catch (e) {
        logImportError(173, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00173bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess173) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00173.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00174
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile174 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00174.mov");
var editFilePoignees174 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00174_AVEC_POIGNEES.mov");
var editFileBis174 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00174bis.mov");

var importSuccess174 = false;
var fileName174 = "";

// Tenter import standard
if (editFile174.exists) {
    try {
        var editFootage174 = project.importFile(new ImportOptions(editFile174));
        editFootage174.parentFolder = fromEditFolder;
        editFootage174.name = "UNDLM_00174";
        editSources[174] = editFootage174;
        editImportCount++;
        importSuccess174 = true;
        fileName174 = "UNDLM_00174.mov";
        logImportSuccess(174, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00174.mov", fileName174);
    } catch (e) {
        logImportError(174, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00174.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess174 && editFilePoignees174.exists) {
    try {
        var editFootage174 = project.importFile(new ImportOptions(editFilePoignees174));
        editFootage174.parentFolder = fromEditFolder;
        editFootage174.name = "UNDLM_00174_AVEC_POIGNEES";
        editSources[174] = editFootage174;
        editImportCount++;
        importSuccess174 = true;
        fileName174 = "UNDLM_00174_AVEC_POIGNEES.mov";
        logImportSuccess(174, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00174_AVEC_POIGNEES.mov", fileName174);
    } catch (e) {
        logImportError(174, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00174_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess174 && editFileBis174.exists) {
    try {
        var editFootage174 = project.importFile(new ImportOptions(editFileBis174));
        editFootage174.parentFolder = fromEditFolder;
        editFootage174.name = "UNDLM_00174bis";
        editSources[174] = editFootage174;
        editImportCount++;
        importSuccess174 = true;
        fileName174 = "UNDLM_00174bis.mov";
        logImportSuccess(174, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00174bis.mov", fileName174);
    } catch (e) {
        logImportError(174, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00174bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess174) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00174.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00175
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile175 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00175.mov");
var editFilePoignees175 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00175_AVEC_POIGNEES.mov");
var editFileBis175 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00175bis.mov");

var importSuccess175 = false;
var fileName175 = "";

// Tenter import standard
if (editFile175.exists) {
    try {
        var editFootage175 = project.importFile(new ImportOptions(editFile175));
        editFootage175.parentFolder = fromEditFolder;
        editFootage175.name = "UNDLM_00175";
        editSources[175] = editFootage175;
        editImportCount++;
        importSuccess175 = true;
        fileName175 = "UNDLM_00175.mov";
        logImportSuccess(175, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00175.mov", fileName175);
    } catch (e) {
        logImportError(175, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00175.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess175 && editFilePoignees175.exists) {
    try {
        var editFootage175 = project.importFile(new ImportOptions(editFilePoignees175));
        editFootage175.parentFolder = fromEditFolder;
        editFootage175.name = "UNDLM_00175_AVEC_POIGNEES";
        editSources[175] = editFootage175;
        editImportCount++;
        importSuccess175 = true;
        fileName175 = "UNDLM_00175_AVEC_POIGNEES.mov";
        logImportSuccess(175, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00175_AVEC_POIGNEES.mov", fileName175);
    } catch (e) {
        logImportError(175, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00175_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess175 && editFileBis175.exists) {
    try {
        var editFootage175 = project.importFile(new ImportOptions(editFileBis175));
        editFootage175.parentFolder = fromEditFolder;
        editFootage175.name = "UNDLM_00175bis";
        editSources[175] = editFootage175;
        editImportCount++;
        importSuccess175 = true;
        fileName175 = "UNDLM_00175bis.mov";
        logImportSuccess(175, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00175bis.mov", fileName175);
    } catch (e) {
        logImportError(175, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00175bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess175) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00175.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00165
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile165 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00165.mov");
var gradedFilePoignees165 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00165_AVEC_POIGNEES.mov");
var gradedFileBis165 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00165bis.mov");

var gradedImportSuccess165 = false;
var gradedFileName165 = "";

// Tenter import standard
if (gradedFile165.exists) {
    try {
        var gradedFootage165 = project.importFile(new ImportOptions(gradedFile165));
        gradedFootage165.parentFolder = fromGradingFolder;
        gradedFootage165.name = "UNDLM_00165";
        gradingSources[165] = gradedFootage165;
        gradingImportCount++;
        gradedImportSuccess165 = true;
        gradedFileName165 = "UNDLM_00165.mov";
        logImportSuccess(165, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00165.mov", gradedFileName165);
    } catch (e) {
        logImportError(165, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00165.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess165 && gradedFilePoignees165.exists) {
    try {
        var gradedFootage165 = project.importFile(new ImportOptions(gradedFilePoignees165));
        gradedFootage165.parentFolder = fromGradingFolder;
        gradedFootage165.name = "UNDLM_00165_AVEC_POIGNEES";
        gradingSources[165] = gradedFootage165;
        gradingImportCount++;
        gradedImportSuccess165 = true;
        gradedFileName165 = "UNDLM_00165_AVEC_POIGNEES.mov";
        logImportSuccess(165, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00165_AVEC_POIGNEES.mov", gradedFileName165);
    } catch (e) {
        logImportError(165, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00165_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess165 && gradedFileBis165.exists) {
    try {
        var gradedFootage165 = project.importFile(new ImportOptions(gradedFileBis165));
        gradedFootage165.parentFolder = fromGradingFolder;
        gradedFootage165.name = "UNDLM_00165bis";
        gradingSources[165] = gradedFootage165;
        gradingImportCount++;
        gradedImportSuccess165 = true;
        gradedFileName165 = "UNDLM_00165bis.mov";
        logImportSuccess(165, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00165bis.mov", gradedFileName165);
    } catch (e) {
        logImportError(165, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00165bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess165) {
    missingGradingCount++;
}

// Import plan GRADED 00166
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile166 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00166.mov");
var gradedFilePoignees166 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00166_AVEC_POIGNEES.mov");
var gradedFileBis166 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00166bis.mov");

var gradedImportSuccess166 = false;
var gradedFileName166 = "";

// Tenter import standard
if (gradedFile166.exists) {
    try {
        var gradedFootage166 = project.importFile(new ImportOptions(gradedFile166));
        gradedFootage166.parentFolder = fromGradingFolder;
        gradedFootage166.name = "UNDLM_00166";
        gradingSources[166] = gradedFootage166;
        gradingImportCount++;
        gradedImportSuccess166 = true;
        gradedFileName166 = "UNDLM_00166.mov";
        logImportSuccess(166, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00166.mov", gradedFileName166);
    } catch (e) {
        logImportError(166, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00166.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess166 && gradedFilePoignees166.exists) {
    try {
        var gradedFootage166 = project.importFile(new ImportOptions(gradedFilePoignees166));
        gradedFootage166.parentFolder = fromGradingFolder;
        gradedFootage166.name = "UNDLM_00166_AVEC_POIGNEES";
        gradingSources[166] = gradedFootage166;
        gradingImportCount++;
        gradedImportSuccess166 = true;
        gradedFileName166 = "UNDLM_00166_AVEC_POIGNEES.mov";
        logImportSuccess(166, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00166_AVEC_POIGNEES.mov", gradedFileName166);
    } catch (e) {
        logImportError(166, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00166_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess166 && gradedFileBis166.exists) {
    try {
        var gradedFootage166 = project.importFile(new ImportOptions(gradedFileBis166));
        gradedFootage166.parentFolder = fromGradingFolder;
        gradedFootage166.name = "UNDLM_00166bis";
        gradingSources[166] = gradedFootage166;
        gradingImportCount++;
        gradedImportSuccess166 = true;
        gradedFileName166 = "UNDLM_00166bis.mov";
        logImportSuccess(166, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00166bis.mov", gradedFileName166);
    } catch (e) {
        logImportError(166, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00166bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess166) {
    missingGradingCount++;
}

// Import plan GRADED 00167
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile167 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00167.mov");
var gradedFilePoignees167 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00167_AVEC_POIGNEES.mov");
var gradedFileBis167 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00167bis.mov");

var gradedImportSuccess167 = false;
var gradedFileName167 = "";

// Tenter import standard
if (gradedFile167.exists) {
    try {
        var gradedFootage167 = project.importFile(new ImportOptions(gradedFile167));
        gradedFootage167.parentFolder = fromGradingFolder;
        gradedFootage167.name = "UNDLM_00167";
        gradingSources[167] = gradedFootage167;
        gradingImportCount++;
        gradedImportSuccess167 = true;
        gradedFileName167 = "UNDLM_00167.mov";
        logImportSuccess(167, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00167.mov", gradedFileName167);
    } catch (e) {
        logImportError(167, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00167.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess167 && gradedFilePoignees167.exists) {
    try {
        var gradedFootage167 = project.importFile(new ImportOptions(gradedFilePoignees167));
        gradedFootage167.parentFolder = fromGradingFolder;
        gradedFootage167.name = "UNDLM_00167_AVEC_POIGNEES";
        gradingSources[167] = gradedFootage167;
        gradingImportCount++;
        gradedImportSuccess167 = true;
        gradedFileName167 = "UNDLM_00167_AVEC_POIGNEES.mov";
        logImportSuccess(167, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00167_AVEC_POIGNEES.mov", gradedFileName167);
    } catch (e) {
        logImportError(167, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00167_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess167 && gradedFileBis167.exists) {
    try {
        var gradedFootage167 = project.importFile(new ImportOptions(gradedFileBis167));
        gradedFootage167.parentFolder = fromGradingFolder;
        gradedFootage167.name = "UNDLM_00167bis";
        gradingSources[167] = gradedFootage167;
        gradingImportCount++;
        gradedImportSuccess167 = true;
        gradedFileName167 = "UNDLM_00167bis.mov";
        logImportSuccess(167, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00167bis.mov", gradedFileName167);
    } catch (e) {
        logImportError(167, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00167bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess167) {
    missingGradingCount++;
}

// Import plan GRADED 00168
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile168 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00168.mov");
var gradedFilePoignees168 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00168_AVEC_POIGNEES.mov");
var gradedFileBis168 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00168bis.mov");

var gradedImportSuccess168 = false;
var gradedFileName168 = "";

// Tenter import standard
if (gradedFile168.exists) {
    try {
        var gradedFootage168 = project.importFile(new ImportOptions(gradedFile168));
        gradedFootage168.parentFolder = fromGradingFolder;
        gradedFootage168.name = "UNDLM_00168";
        gradingSources[168] = gradedFootage168;
        gradingImportCount++;
        gradedImportSuccess168 = true;
        gradedFileName168 = "UNDLM_00168.mov";
        logImportSuccess(168, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00168.mov", gradedFileName168);
    } catch (e) {
        logImportError(168, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00168.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess168 && gradedFilePoignees168.exists) {
    try {
        var gradedFootage168 = project.importFile(new ImportOptions(gradedFilePoignees168));
        gradedFootage168.parentFolder = fromGradingFolder;
        gradedFootage168.name = "UNDLM_00168_AVEC_POIGNEES";
        gradingSources[168] = gradedFootage168;
        gradingImportCount++;
        gradedImportSuccess168 = true;
        gradedFileName168 = "UNDLM_00168_AVEC_POIGNEES.mov";
        logImportSuccess(168, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00168_AVEC_POIGNEES.mov", gradedFileName168);
    } catch (e) {
        logImportError(168, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00168_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess168 && gradedFileBis168.exists) {
    try {
        var gradedFootage168 = project.importFile(new ImportOptions(gradedFileBis168));
        gradedFootage168.parentFolder = fromGradingFolder;
        gradedFootage168.name = "UNDLM_00168bis";
        gradingSources[168] = gradedFootage168;
        gradingImportCount++;
        gradedImportSuccess168 = true;
        gradedFileName168 = "UNDLM_00168bis.mov";
        logImportSuccess(168, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00168bis.mov", gradedFileName168);
    } catch (e) {
        logImportError(168, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00168bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess168) {
    missingGradingCount++;
}

// Import plan GRADED 00169
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile169 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00169.mov");
var gradedFilePoignees169 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00169_AVEC_POIGNEES.mov");
var gradedFileBis169 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00169bis.mov");

var gradedImportSuccess169 = false;
var gradedFileName169 = "";

// Tenter import standard
if (gradedFile169.exists) {
    try {
        var gradedFootage169 = project.importFile(new ImportOptions(gradedFile169));
        gradedFootage169.parentFolder = fromGradingFolder;
        gradedFootage169.name = "UNDLM_00169";
        gradingSources[169] = gradedFootage169;
        gradingImportCount++;
        gradedImportSuccess169 = true;
        gradedFileName169 = "UNDLM_00169.mov";
        logImportSuccess(169, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00169.mov", gradedFileName169);
    } catch (e) {
        logImportError(169, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00169.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess169 && gradedFilePoignees169.exists) {
    try {
        var gradedFootage169 = project.importFile(new ImportOptions(gradedFilePoignees169));
        gradedFootage169.parentFolder = fromGradingFolder;
        gradedFootage169.name = "UNDLM_00169_AVEC_POIGNEES";
        gradingSources[169] = gradedFootage169;
        gradingImportCount++;
        gradedImportSuccess169 = true;
        gradedFileName169 = "UNDLM_00169_AVEC_POIGNEES.mov";
        logImportSuccess(169, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00169_AVEC_POIGNEES.mov", gradedFileName169);
    } catch (e) {
        logImportError(169, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00169_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess169 && gradedFileBis169.exists) {
    try {
        var gradedFootage169 = project.importFile(new ImportOptions(gradedFileBis169));
        gradedFootage169.parentFolder = fromGradingFolder;
        gradedFootage169.name = "UNDLM_00169bis";
        gradingSources[169] = gradedFootage169;
        gradingImportCount++;
        gradedImportSuccess169 = true;
        gradedFileName169 = "UNDLM_00169bis.mov";
        logImportSuccess(169, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00169bis.mov", gradedFileName169);
    } catch (e) {
        logImportError(169, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00169bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess169) {
    missingGradingCount++;
}

// Import plan GRADED 00170
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile170 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00170.mov");
var gradedFilePoignees170 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00170_AVEC_POIGNEES.mov");
var gradedFileBis170 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00170bis.mov");

var gradedImportSuccess170 = false;
var gradedFileName170 = "";

// Tenter import standard
if (gradedFile170.exists) {
    try {
        var gradedFootage170 = project.importFile(new ImportOptions(gradedFile170));
        gradedFootage170.parentFolder = fromGradingFolder;
        gradedFootage170.name = "UNDLM_00170";
        gradingSources[170] = gradedFootage170;
        gradingImportCount++;
        gradedImportSuccess170 = true;
        gradedFileName170 = "UNDLM_00170.mov";
        logImportSuccess(170, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00170.mov", gradedFileName170);
    } catch (e) {
        logImportError(170, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00170.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess170 && gradedFilePoignees170.exists) {
    try {
        var gradedFootage170 = project.importFile(new ImportOptions(gradedFilePoignees170));
        gradedFootage170.parentFolder = fromGradingFolder;
        gradedFootage170.name = "UNDLM_00170_AVEC_POIGNEES";
        gradingSources[170] = gradedFootage170;
        gradingImportCount++;
        gradedImportSuccess170 = true;
        gradedFileName170 = "UNDLM_00170_AVEC_POIGNEES.mov";
        logImportSuccess(170, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00170_AVEC_POIGNEES.mov", gradedFileName170);
    } catch (e) {
        logImportError(170, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00170_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess170 && gradedFileBis170.exists) {
    try {
        var gradedFootage170 = project.importFile(new ImportOptions(gradedFileBis170));
        gradedFootage170.parentFolder = fromGradingFolder;
        gradedFootage170.name = "UNDLM_00170bis";
        gradingSources[170] = gradedFootage170;
        gradingImportCount++;
        gradedImportSuccess170 = true;
        gradedFileName170 = "UNDLM_00170bis.mov";
        logImportSuccess(170, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00170bis.mov", gradedFileName170);
    } catch (e) {
        logImportError(170, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00170bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess170) {
    missingGradingCount++;
}

// Import plan GRADED 00171
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile171 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00171.mov");
var gradedFilePoignees171 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00171_AVEC_POIGNEES.mov");
var gradedFileBis171 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00171bis.mov");

var gradedImportSuccess171 = false;
var gradedFileName171 = "";

// Tenter import standard
if (gradedFile171.exists) {
    try {
        var gradedFootage171 = project.importFile(new ImportOptions(gradedFile171));
        gradedFootage171.parentFolder = fromGradingFolder;
        gradedFootage171.name = "UNDLM_00171";
        gradingSources[171] = gradedFootage171;
        gradingImportCount++;
        gradedImportSuccess171 = true;
        gradedFileName171 = "UNDLM_00171.mov";
        logImportSuccess(171, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00171.mov", gradedFileName171);
    } catch (e) {
        logImportError(171, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00171.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess171 && gradedFilePoignees171.exists) {
    try {
        var gradedFootage171 = project.importFile(new ImportOptions(gradedFilePoignees171));
        gradedFootage171.parentFolder = fromGradingFolder;
        gradedFootage171.name = "UNDLM_00171_AVEC_POIGNEES";
        gradingSources[171] = gradedFootage171;
        gradingImportCount++;
        gradedImportSuccess171 = true;
        gradedFileName171 = "UNDLM_00171_AVEC_POIGNEES.mov";
        logImportSuccess(171, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00171_AVEC_POIGNEES.mov", gradedFileName171);
    } catch (e) {
        logImportError(171, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00171_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess171 && gradedFileBis171.exists) {
    try {
        var gradedFootage171 = project.importFile(new ImportOptions(gradedFileBis171));
        gradedFootage171.parentFolder = fromGradingFolder;
        gradedFootage171.name = "UNDLM_00171bis";
        gradingSources[171] = gradedFootage171;
        gradingImportCount++;
        gradedImportSuccess171 = true;
        gradedFileName171 = "UNDLM_00171bis.mov";
        logImportSuccess(171, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00171bis.mov", gradedFileName171);
    } catch (e) {
        logImportError(171, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00171bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess171) {
    missingGradingCount++;
}

// Import plan GRADED 00172
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile172 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00172.mov");
var gradedFilePoignees172 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00172_AVEC_POIGNEES.mov");
var gradedFileBis172 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00172bis.mov");

var gradedImportSuccess172 = false;
var gradedFileName172 = "";

// Tenter import standard
if (gradedFile172.exists) {
    try {
        var gradedFootage172 = project.importFile(new ImportOptions(gradedFile172));
        gradedFootage172.parentFolder = fromGradingFolder;
        gradedFootage172.name = "UNDLM_00172";
        gradingSources[172] = gradedFootage172;
        gradingImportCount++;
        gradedImportSuccess172 = true;
        gradedFileName172 = "UNDLM_00172.mov";
        logImportSuccess(172, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00172.mov", gradedFileName172);
    } catch (e) {
        logImportError(172, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00172.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess172 && gradedFilePoignees172.exists) {
    try {
        var gradedFootage172 = project.importFile(new ImportOptions(gradedFilePoignees172));
        gradedFootage172.parentFolder = fromGradingFolder;
        gradedFootage172.name = "UNDLM_00172_AVEC_POIGNEES";
        gradingSources[172] = gradedFootage172;
        gradingImportCount++;
        gradedImportSuccess172 = true;
        gradedFileName172 = "UNDLM_00172_AVEC_POIGNEES.mov";
        logImportSuccess(172, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00172_AVEC_POIGNEES.mov", gradedFileName172);
    } catch (e) {
        logImportError(172, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00172_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess172 && gradedFileBis172.exists) {
    try {
        var gradedFootage172 = project.importFile(new ImportOptions(gradedFileBis172));
        gradedFootage172.parentFolder = fromGradingFolder;
        gradedFootage172.name = "UNDLM_00172bis";
        gradingSources[172] = gradedFootage172;
        gradingImportCount++;
        gradedImportSuccess172 = true;
        gradedFileName172 = "UNDLM_00172bis.mov";
        logImportSuccess(172, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00172bis.mov", gradedFileName172);
    } catch (e) {
        logImportError(172, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00172bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess172) {
    missingGradingCount++;
}

// Import plan GRADED 00173
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile173 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00173.mov");
var gradedFilePoignees173 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00173_AVEC_POIGNEES.mov");
var gradedFileBis173 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00173bis.mov");

var gradedImportSuccess173 = false;
var gradedFileName173 = "";

// Tenter import standard
if (gradedFile173.exists) {
    try {
        var gradedFootage173 = project.importFile(new ImportOptions(gradedFile173));
        gradedFootage173.parentFolder = fromGradingFolder;
        gradedFootage173.name = "UNDLM_00173";
        gradingSources[173] = gradedFootage173;
        gradingImportCount++;
        gradedImportSuccess173 = true;
        gradedFileName173 = "UNDLM_00173.mov";
        logImportSuccess(173, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00173.mov", gradedFileName173);
    } catch (e) {
        logImportError(173, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00173.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess173 && gradedFilePoignees173.exists) {
    try {
        var gradedFootage173 = project.importFile(new ImportOptions(gradedFilePoignees173));
        gradedFootage173.parentFolder = fromGradingFolder;
        gradedFootage173.name = "UNDLM_00173_AVEC_POIGNEES";
        gradingSources[173] = gradedFootage173;
        gradingImportCount++;
        gradedImportSuccess173 = true;
        gradedFileName173 = "UNDLM_00173_AVEC_POIGNEES.mov";
        logImportSuccess(173, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00173_AVEC_POIGNEES.mov", gradedFileName173);
    } catch (e) {
        logImportError(173, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00173_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess173 && gradedFileBis173.exists) {
    try {
        var gradedFootage173 = project.importFile(new ImportOptions(gradedFileBis173));
        gradedFootage173.parentFolder = fromGradingFolder;
        gradedFootage173.name = "UNDLM_00173bis";
        gradingSources[173] = gradedFootage173;
        gradingImportCount++;
        gradedImportSuccess173 = true;
        gradedFileName173 = "UNDLM_00173bis.mov";
        logImportSuccess(173, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00173bis.mov", gradedFileName173);
    } catch (e) {
        logImportError(173, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00173bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess173) {
    missingGradingCount++;
}

// Import plan GRADED 00174
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile174 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00174.mov");
var gradedFilePoignees174 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00174_AVEC_POIGNEES.mov");
var gradedFileBis174 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00174bis.mov");

var gradedImportSuccess174 = false;
var gradedFileName174 = "";

// Tenter import standard
if (gradedFile174.exists) {
    try {
        var gradedFootage174 = project.importFile(new ImportOptions(gradedFile174));
        gradedFootage174.parentFolder = fromGradingFolder;
        gradedFootage174.name = "UNDLM_00174";
        gradingSources[174] = gradedFootage174;
        gradingImportCount++;
        gradedImportSuccess174 = true;
        gradedFileName174 = "UNDLM_00174.mov";
        logImportSuccess(174, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00174.mov", gradedFileName174);
    } catch (e) {
        logImportError(174, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00174.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess174 && gradedFilePoignees174.exists) {
    try {
        var gradedFootage174 = project.importFile(new ImportOptions(gradedFilePoignees174));
        gradedFootage174.parentFolder = fromGradingFolder;
        gradedFootage174.name = "UNDLM_00174_AVEC_POIGNEES";
        gradingSources[174] = gradedFootage174;
        gradingImportCount++;
        gradedImportSuccess174 = true;
        gradedFileName174 = "UNDLM_00174_AVEC_POIGNEES.mov";
        logImportSuccess(174, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00174_AVEC_POIGNEES.mov", gradedFileName174);
    } catch (e) {
        logImportError(174, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00174_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess174 && gradedFileBis174.exists) {
    try {
        var gradedFootage174 = project.importFile(new ImportOptions(gradedFileBis174));
        gradedFootage174.parentFolder = fromGradingFolder;
        gradedFootage174.name = "UNDLM_00174bis";
        gradingSources[174] = gradedFootage174;
        gradingImportCount++;
        gradedImportSuccess174 = true;
        gradedFileName174 = "UNDLM_00174bis.mov";
        logImportSuccess(174, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00174bis.mov", gradedFileName174);
    } catch (e) {
        logImportError(174, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00174bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess174) {
    missingGradingCount++;
}

// Import plan GRADED 00175
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile175 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00175.mov");
var gradedFilePoignees175 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00175_AVEC_POIGNEES.mov");
var gradedFileBis175 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00175bis.mov");

var gradedImportSuccess175 = false;
var gradedFileName175 = "";

// Tenter import standard
if (gradedFile175.exists) {
    try {
        var gradedFootage175 = project.importFile(new ImportOptions(gradedFile175));
        gradedFootage175.parentFolder = fromGradingFolder;
        gradedFootage175.name = "UNDLM_00175";
        gradingSources[175] = gradedFootage175;
        gradingImportCount++;
        gradedImportSuccess175 = true;
        gradedFileName175 = "UNDLM_00175.mov";
        logImportSuccess(175, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00175.mov", gradedFileName175);
    } catch (e) {
        logImportError(175, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00175.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess175 && gradedFilePoignees175.exists) {
    try {
        var gradedFootage175 = project.importFile(new ImportOptions(gradedFilePoignees175));
        gradedFootage175.parentFolder = fromGradingFolder;
        gradedFootage175.name = "UNDLM_00175_AVEC_POIGNEES";
        gradingSources[175] = gradedFootage175;
        gradingImportCount++;
        gradedImportSuccess175 = true;
        gradedFileName175 = "UNDLM_00175_AVEC_POIGNEES.mov";
        logImportSuccess(175, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00175_AVEC_POIGNEES.mov", gradedFileName175);
    } catch (e) {
        logImportError(175, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00175_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess175 && gradedFileBis175.exists) {
    try {
        var gradedFootage175 = project.importFile(new ImportOptions(gradedFileBis175));
        gradedFootage175.parentFolder = fromGradingFolder;
        gradedFootage175.name = "UNDLM_00175bis";
        gradingSources[175] = gradedFootage175;
        gradingImportCount++;
        gradedImportSuccess175 = true;
        gradedFileName175 = "UNDLM_00175bis.mov";
        logImportSuccess(175, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00175bis.mov", gradedFileName175);
    } catch (e) {
        logImportError(175, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00175bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess175) {
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


// Composition pour plan 00165
var planComp165 = project.items.addComp(
    "SQ08_UNDLM_00165_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp165.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer165 = planComp165.layers.add(bgSolidComp);
bgLayer165.name = "BG_SOLID";
bgLayer165.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer165 = false;
if (gradingSources[165]) {
    var gradedLayer165 = planComp165.layers.add(gradingSources[165]);
    gradedLayer165.name = "UNDLM_00165_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer165.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer165.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer165 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer165 = false;
if (editSources[165]) {
    var editLayer165 = planComp165.layers.add(editSources[165]);
    editLayer165.name = "UNDLM_00165_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer165.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer165.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer165 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity165 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer165) {
    // EDIT toujours activé quand disponible
    editLayer165.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer165) {
        gradedLayer165.enabled = false;
    }
} else if (hasGradedLayer165) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer165.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText165 = planComp165.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText165.name = "WARNING_NO_EDIT";
    warningText165.property("Transform").property("Position").setValue([1280, 200]);
    warningText165.guideLayer = true;
    
    var warningTextDoc165 = warningText165.property("Source Text").value;
    warningTextDoc165.fontSize = 32;
    warningTextDoc165.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc165.font = "Arial-BoldMT";
    warningTextDoc165.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText165.property("Source Text").setValue(warningTextDoc165);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText165 = planComp165.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00165");
    errorText165.name = "ERROR_NO_SOURCE";
    errorText165.property("Transform").property("Position").setValue([1280, 720]);
    errorText165.guideLayer = true;
    
    var errorTextDoc165 = errorText165.property("Source Text").value;
    errorTextDoc165.fontSize = 48;
    errorTextDoc165.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc165.font = "Arial-BoldMT";
    errorTextDoc165.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText165.property("Source Text").setValue(errorTextDoc165);
}

planCompositions[165] = planComp165;


// Composition pour plan 00166
var planComp166 = project.items.addComp(
    "SQ08_UNDLM_00166_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    11.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp166.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer166 = planComp166.layers.add(bgSolidComp);
bgLayer166.name = "BG_SOLID";
bgLayer166.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer166 = false;
if (gradingSources[166]) {
    var gradedLayer166 = planComp166.layers.add(gradingSources[166]);
    gradedLayer166.name = "UNDLM_00166_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer166.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer166.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer166 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer166 = false;
if (editSources[166]) {
    var editLayer166 = planComp166.layers.add(editSources[166]);
    editLayer166.name = "UNDLM_00166_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer166.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer166.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer166 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity166 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer166) {
    // EDIT toujours activé quand disponible
    editLayer166.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer166) {
        gradedLayer166.enabled = false;
    }
} else if (hasGradedLayer166) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer166.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText166 = planComp166.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText166.name = "WARNING_NO_EDIT";
    warningText166.property("Transform").property("Position").setValue([1280, 200]);
    warningText166.guideLayer = true;
    
    var warningTextDoc166 = warningText166.property("Source Text").value;
    warningTextDoc166.fontSize = 32;
    warningTextDoc166.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc166.font = "Arial-BoldMT";
    warningTextDoc166.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText166.property("Source Text").setValue(warningTextDoc166);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText166 = planComp166.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00166");
    errorText166.name = "ERROR_NO_SOURCE";
    errorText166.property("Transform").property("Position").setValue([1280, 720]);
    errorText166.guideLayer = true;
    
    var errorTextDoc166 = errorText166.property("Source Text").value;
    errorTextDoc166.fontSize = 48;
    errorTextDoc166.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc166.font = "Arial-BoldMT";
    errorTextDoc166.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText166.property("Source Text").setValue(errorTextDoc166);
}

planCompositions[166] = planComp166;


// Composition pour plan 00167
var planComp167 = project.items.addComp(
    "SQ08_UNDLM_00167_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.5600000000000005,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp167.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer167 = planComp167.layers.add(bgSolidComp);
bgLayer167.name = "BG_SOLID";
bgLayer167.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer167 = false;
if (gradingSources[167]) {
    var gradedLayer167 = planComp167.layers.add(gradingSources[167]);
    gradedLayer167.name = "UNDLM_00167_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer167.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer167.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer167 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer167 = false;
if (editSources[167]) {
    var editLayer167 = planComp167.layers.add(editSources[167]);
    editLayer167.name = "UNDLM_00167_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer167.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer167.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer167 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity167 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer167) {
    // EDIT toujours activé quand disponible
    editLayer167.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer167) {
        gradedLayer167.enabled = false;
    }
} else if (hasGradedLayer167) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer167.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText167 = planComp167.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText167.name = "WARNING_NO_EDIT";
    warningText167.property("Transform").property("Position").setValue([1280, 200]);
    warningText167.guideLayer = true;
    
    var warningTextDoc167 = warningText167.property("Source Text").value;
    warningTextDoc167.fontSize = 32;
    warningTextDoc167.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc167.font = "Arial-BoldMT";
    warningTextDoc167.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText167.property("Source Text").setValue(warningTextDoc167);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText167 = planComp167.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00167");
    errorText167.name = "ERROR_NO_SOURCE";
    errorText167.property("Transform").property("Position").setValue([1280, 720]);
    errorText167.guideLayer = true;
    
    var errorTextDoc167 = errorText167.property("Source Text").value;
    errorTextDoc167.fontSize = 48;
    errorTextDoc167.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc167.font = "Arial-BoldMT";
    errorTextDoc167.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText167.property("Source Text").setValue(errorTextDoc167);
}

planCompositions[167] = planComp167;


// Composition pour plan 00168
var planComp168 = project.items.addComp(
    "SQ08_UNDLM_00168_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp168.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer168 = planComp168.layers.add(bgSolidComp);
bgLayer168.name = "BG_SOLID";
bgLayer168.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer168 = false;
if (gradingSources[168]) {
    var gradedLayer168 = planComp168.layers.add(gradingSources[168]);
    gradedLayer168.name = "UNDLM_00168_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer168.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer168.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer168 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer168 = false;
if (editSources[168]) {
    var editLayer168 = planComp168.layers.add(editSources[168]);
    editLayer168.name = "UNDLM_00168_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer168.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer168.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer168 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity168 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer168) {
    // EDIT toujours activé quand disponible
    editLayer168.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer168) {
        gradedLayer168.enabled = false;
    }
} else if (hasGradedLayer168) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer168.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText168 = planComp168.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText168.name = "WARNING_NO_EDIT";
    warningText168.property("Transform").property("Position").setValue([1280, 200]);
    warningText168.guideLayer = true;
    
    var warningTextDoc168 = warningText168.property("Source Text").value;
    warningTextDoc168.fontSize = 32;
    warningTextDoc168.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc168.font = "Arial-BoldMT";
    warningTextDoc168.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText168.property("Source Text").setValue(warningTextDoc168);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText168 = planComp168.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00168");
    errorText168.name = "ERROR_NO_SOURCE";
    errorText168.property("Transform").property("Position").setValue([1280, 720]);
    errorText168.guideLayer = true;
    
    var errorTextDoc168 = errorText168.property("Source Text").value;
    errorTextDoc168.fontSize = 48;
    errorTextDoc168.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc168.font = "Arial-BoldMT";
    errorTextDoc168.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText168.property("Source Text").setValue(errorTextDoc168);
}

planCompositions[168] = planComp168;


// Composition pour plan 00169
var planComp169 = project.items.addComp(
    "SQ08_UNDLM_00169_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp169.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer169 = planComp169.layers.add(bgSolidComp);
bgLayer169.name = "BG_SOLID";
bgLayer169.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer169 = false;
if (gradingSources[169]) {
    var gradedLayer169 = planComp169.layers.add(gradingSources[169]);
    gradedLayer169.name = "UNDLM_00169_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer169.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer169.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer169 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer169 = false;
if (editSources[169]) {
    var editLayer169 = planComp169.layers.add(editSources[169]);
    editLayer169.name = "UNDLM_00169_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer169.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer169.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer169 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity169 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer169) {
    // EDIT toujours activé quand disponible
    editLayer169.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer169) {
        gradedLayer169.enabled = false;
    }
} else if (hasGradedLayer169) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer169.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText169 = planComp169.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText169.name = "WARNING_NO_EDIT";
    warningText169.property("Transform").property("Position").setValue([1280, 200]);
    warningText169.guideLayer = true;
    
    var warningTextDoc169 = warningText169.property("Source Text").value;
    warningTextDoc169.fontSize = 32;
    warningTextDoc169.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc169.font = "Arial-BoldMT";
    warningTextDoc169.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText169.property("Source Text").setValue(warningTextDoc169);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText169 = planComp169.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00169");
    errorText169.name = "ERROR_NO_SOURCE";
    errorText169.property("Transform").property("Position").setValue([1280, 720]);
    errorText169.guideLayer = true;
    
    var errorTextDoc169 = errorText169.property("Source Text").value;
    errorTextDoc169.fontSize = 48;
    errorTextDoc169.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc169.font = "Arial-BoldMT";
    errorTextDoc169.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText169.property("Source Text").setValue(errorTextDoc169);
}

planCompositions[169] = planComp169;


// Composition pour plan 00170
var planComp170 = project.items.addComp(
    "SQ08_UNDLM_00170_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp170.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer170 = planComp170.layers.add(bgSolidComp);
bgLayer170.name = "BG_SOLID";
bgLayer170.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer170 = false;
if (gradingSources[170]) {
    var gradedLayer170 = planComp170.layers.add(gradingSources[170]);
    gradedLayer170.name = "UNDLM_00170_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer170.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer170.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer170 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer170 = false;
if (editSources[170]) {
    var editLayer170 = planComp170.layers.add(editSources[170]);
    editLayer170.name = "UNDLM_00170_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer170.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer170.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer170 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity170 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer170) {
    // EDIT toujours activé quand disponible
    editLayer170.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer170) {
        gradedLayer170.enabled = false;
    }
} else if (hasGradedLayer170) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer170.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText170 = planComp170.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText170.name = "WARNING_NO_EDIT";
    warningText170.property("Transform").property("Position").setValue([1280, 200]);
    warningText170.guideLayer = true;
    
    var warningTextDoc170 = warningText170.property("Source Text").value;
    warningTextDoc170.fontSize = 32;
    warningTextDoc170.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc170.font = "Arial-BoldMT";
    warningTextDoc170.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText170.property("Source Text").setValue(warningTextDoc170);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText170 = planComp170.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00170");
    errorText170.name = "ERROR_NO_SOURCE";
    errorText170.property("Transform").property("Position").setValue([1280, 720]);
    errorText170.guideLayer = true;
    
    var errorTextDoc170 = errorText170.property("Source Text").value;
    errorTextDoc170.fontSize = 48;
    errorTextDoc170.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc170.font = "Arial-BoldMT";
    errorTextDoc170.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText170.property("Source Text").setValue(errorTextDoc170);
}

planCompositions[170] = planComp170;


// Composition pour plan 00171
var planComp171 = project.items.addComp(
    "SQ08_UNDLM_00171_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp171.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer171 = planComp171.layers.add(bgSolidComp);
bgLayer171.name = "BG_SOLID";
bgLayer171.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer171 = false;
if (gradingSources[171]) {
    var gradedLayer171 = planComp171.layers.add(gradingSources[171]);
    gradedLayer171.name = "UNDLM_00171_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer171.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer171.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer171 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer171 = false;
if (editSources[171]) {
    var editLayer171 = planComp171.layers.add(editSources[171]);
    editLayer171.name = "UNDLM_00171_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer171.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer171.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer171 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity171 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer171) {
    // EDIT toujours activé quand disponible
    editLayer171.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer171) {
        gradedLayer171.enabled = false;
    }
} else if (hasGradedLayer171) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer171.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText171 = planComp171.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText171.name = "WARNING_NO_EDIT";
    warningText171.property("Transform").property("Position").setValue([1280, 200]);
    warningText171.guideLayer = true;
    
    var warningTextDoc171 = warningText171.property("Source Text").value;
    warningTextDoc171.fontSize = 32;
    warningTextDoc171.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc171.font = "Arial-BoldMT";
    warningTextDoc171.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText171.property("Source Text").setValue(warningTextDoc171);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText171 = planComp171.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00171");
    errorText171.name = "ERROR_NO_SOURCE";
    errorText171.property("Transform").property("Position").setValue([1280, 720]);
    errorText171.guideLayer = true;
    
    var errorTextDoc171 = errorText171.property("Source Text").value;
    errorTextDoc171.fontSize = 48;
    errorTextDoc171.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc171.font = "Arial-BoldMT";
    errorTextDoc171.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText171.property("Source Text").setValue(errorTextDoc171);
}

planCompositions[171] = planComp171;


// Composition pour plan 00172
var planComp172 = project.items.addComp(
    "SQ08_UNDLM_00172_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp172.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer172 = planComp172.layers.add(bgSolidComp);
bgLayer172.name = "BG_SOLID";
bgLayer172.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer172 = false;
if (gradingSources[172]) {
    var gradedLayer172 = planComp172.layers.add(gradingSources[172]);
    gradedLayer172.name = "UNDLM_00172_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer172.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer172.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer172 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer172 = false;
if (editSources[172]) {
    var editLayer172 = planComp172.layers.add(editSources[172]);
    editLayer172.name = "UNDLM_00172_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer172.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer172.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer172 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity172 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer172) {
    // EDIT toujours activé quand disponible
    editLayer172.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer172) {
        gradedLayer172.enabled = false;
    }
} else if (hasGradedLayer172) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer172.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText172 = planComp172.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText172.name = "WARNING_NO_EDIT";
    warningText172.property("Transform").property("Position").setValue([1280, 200]);
    warningText172.guideLayer = true;
    
    var warningTextDoc172 = warningText172.property("Source Text").value;
    warningTextDoc172.fontSize = 32;
    warningTextDoc172.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc172.font = "Arial-BoldMT";
    warningTextDoc172.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText172.property("Source Text").setValue(warningTextDoc172);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText172 = planComp172.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00172");
    errorText172.name = "ERROR_NO_SOURCE";
    errorText172.property("Transform").property("Position").setValue([1280, 720]);
    errorText172.guideLayer = true;
    
    var errorTextDoc172 = errorText172.property("Source Text").value;
    errorTextDoc172.fontSize = 48;
    errorTextDoc172.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc172.font = "Arial-BoldMT";
    errorTextDoc172.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText172.property("Source Text").setValue(errorTextDoc172);
}

planCompositions[172] = planComp172;


// Composition pour plan 00173
var planComp173 = project.items.addComp(
    "SQ08_UNDLM_00173_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp173.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer173 = planComp173.layers.add(bgSolidComp);
bgLayer173.name = "BG_SOLID";
bgLayer173.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer173 = false;
if (gradingSources[173]) {
    var gradedLayer173 = planComp173.layers.add(gradingSources[173]);
    gradedLayer173.name = "UNDLM_00173_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer173.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer173.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer173 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer173 = false;
if (editSources[173]) {
    var editLayer173 = planComp173.layers.add(editSources[173]);
    editLayer173.name = "UNDLM_00173_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer173.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer173.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer173 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity173 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer173) {
    // EDIT toujours activé quand disponible
    editLayer173.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer173) {
        gradedLayer173.enabled = false;
    }
} else if (hasGradedLayer173) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer173.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText173 = planComp173.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText173.name = "WARNING_NO_EDIT";
    warningText173.property("Transform").property("Position").setValue([1280, 200]);
    warningText173.guideLayer = true;
    
    var warningTextDoc173 = warningText173.property("Source Text").value;
    warningTextDoc173.fontSize = 32;
    warningTextDoc173.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc173.font = "Arial-BoldMT";
    warningTextDoc173.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText173.property("Source Text").setValue(warningTextDoc173);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText173 = planComp173.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00173");
    errorText173.name = "ERROR_NO_SOURCE";
    errorText173.property("Transform").property("Position").setValue([1280, 720]);
    errorText173.guideLayer = true;
    
    var errorTextDoc173 = errorText173.property("Source Text").value;
    errorTextDoc173.fontSize = 48;
    errorTextDoc173.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc173.font = "Arial-BoldMT";
    errorTextDoc173.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText173.property("Source Text").setValue(errorTextDoc173);
}

planCompositions[173] = planComp173;


// Composition pour plan 00174
var planComp174 = project.items.addComp(
    "SQ08_UNDLM_00174_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp174.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer174 = planComp174.layers.add(bgSolidComp);
bgLayer174.name = "BG_SOLID";
bgLayer174.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer174 = false;
if (gradingSources[174]) {
    var gradedLayer174 = planComp174.layers.add(gradingSources[174]);
    gradedLayer174.name = "UNDLM_00174_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer174.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer174.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer174 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer174 = false;
if (editSources[174]) {
    var editLayer174 = planComp174.layers.add(editSources[174]);
    editLayer174.name = "UNDLM_00174_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer174.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer174.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer174 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity174 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer174) {
    // EDIT toujours activé quand disponible
    editLayer174.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer174) {
        gradedLayer174.enabled = false;
    }
} else if (hasGradedLayer174) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer174.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText174 = planComp174.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText174.name = "WARNING_NO_EDIT";
    warningText174.property("Transform").property("Position").setValue([1280, 200]);
    warningText174.guideLayer = true;
    
    var warningTextDoc174 = warningText174.property("Source Text").value;
    warningTextDoc174.fontSize = 32;
    warningTextDoc174.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc174.font = "Arial-BoldMT";
    warningTextDoc174.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText174.property("Source Text").setValue(warningTextDoc174);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText174 = planComp174.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00174");
    errorText174.name = "ERROR_NO_SOURCE";
    errorText174.property("Transform").property("Position").setValue([1280, 720]);
    errorText174.guideLayer = true;
    
    var errorTextDoc174 = errorText174.property("Source Text").value;
    errorTextDoc174.fontSize = 48;
    errorTextDoc174.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc174.font = "Arial-BoldMT";
    errorTextDoc174.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText174.property("Source Text").setValue(errorTextDoc174);
}

planCompositions[174] = planComp174;


// Composition pour plan 00175
var planComp175 = project.items.addComp(
    "SQ08_UNDLM_00175_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp175.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer175 = planComp175.layers.add(bgSolidComp);
bgLayer175.name = "BG_SOLID";
bgLayer175.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer175 = false;
if (gradingSources[175]) {
    var gradedLayer175 = planComp175.layers.add(gradingSources[175]);
    gradedLayer175.name = "UNDLM_00175_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer175.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer175.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer175 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer175 = false;
if (editSources[175]) {
    var editLayer175 = planComp175.layers.add(editSources[175]);
    editLayer175.name = "UNDLM_00175_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer175.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer175.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer175 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity175 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer175) {
    // EDIT toujours activé quand disponible
    editLayer175.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer175) {
        gradedLayer175.enabled = false;
    }
} else if (hasGradedLayer175) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer175.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText175 = planComp175.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText175.name = "WARNING_NO_EDIT";
    warningText175.property("Transform").property("Position").setValue([1280, 200]);
    warningText175.guideLayer = true;
    
    var warningTextDoc175 = warningText175.property("Source Text").value;
    warningTextDoc175.fontSize = 32;
    warningTextDoc175.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc175.font = "Arial-BoldMT";
    warningTextDoc175.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText175.property("Source Text").setValue(warningTextDoc175);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText175 = planComp175.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00175");
    errorText175.name = "ERROR_NO_SOURCE";
    errorText175.property("Transform").property("Position").setValue([1280, 720]);
    errorText175.guideLayer = true;
    
    var errorTextDoc175 = errorText175.property("Source Text").value;
    errorTextDoc175.fontSize = 48;
    errorTextDoc175.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc175.font = "Arial-BoldMT";
    errorTextDoc175.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText175.property("Source Text").setValue(errorTextDoc175);
}

planCompositions[175] = planComp175;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ08_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    67.28, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00165 à la timeline master
if (planCompositions[165]) {
    var masterLayer165 = masterComp.layers.add(planCompositions[165]);
    masterLayer165.startTime = 0;
    masterLayer165.name = "UNDLM_00165";
    masterLayer165.label = 1; // Couleurs alternées
}

// Ajouter plan 00166 à la timeline master
if (planCompositions[166]) {
    var masterLayer166 = masterComp.layers.add(planCompositions[166]);
    masterLayer166.startTime = 5.12;
    masterLayer166.name = "UNDLM_00166";
    masterLayer166.label = 2; // Couleurs alternées
}

// Ajouter plan 00167 à la timeline master
if (planCompositions[167]) {
    var masterLayer167 = masterComp.layers.add(planCompositions[167]);
    masterLayer167.startTime = 16.4;
    masterLayer167.name = "UNDLM_00167";
    masterLayer167.label = 3; // Couleurs alternées
}

// Ajouter plan 00168 à la timeline master
if (planCompositions[168]) {
    var masterLayer168 = masterComp.layers.add(planCompositions[168]);
    masterLayer168.startTime = 20.96;
    masterLayer168.name = "UNDLM_00168";
    masterLayer168.label = 4; // Couleurs alternées
}

// Ajouter plan 00169 à la timeline master
if (planCompositions[169]) {
    var masterLayer169 = masterComp.layers.add(planCompositions[169]);
    masterLayer169.startTime = 24.32;
    masterLayer169.name = "UNDLM_00169";
    masterLayer169.label = 5; // Couleurs alternées
}

// Ajouter plan 00170 à la timeline master
if (planCompositions[170]) {
    var masterLayer170 = masterComp.layers.add(planCompositions[170]);
    masterLayer170.startTime = 29.48;
    masterLayer170.name = "UNDLM_00170";
    masterLayer170.label = 6; // Couleurs alternées
}

// Ajouter plan 00171 à la timeline master
if (planCompositions[171]) {
    var masterLayer171 = masterComp.layers.add(planCompositions[171]);
    masterLayer171.startTime = 35.24;
    masterLayer171.name = "UNDLM_00171";
    masterLayer171.label = 7; // Couleurs alternées
}

// Ajouter plan 00172 à la timeline master
if (planCompositions[172]) {
    var masterLayer172 = masterComp.layers.add(planCompositions[172]);
    masterLayer172.startTime = 43.04;
    masterLayer172.name = "UNDLM_00172";
    masterLayer172.label = 8; // Couleurs alternées
}

// Ajouter plan 00173 à la timeline master
if (planCompositions[173]) {
    var masterLayer173 = masterComp.layers.add(planCompositions[173]);
    masterLayer173.startTime = 49.76;
    masterLayer173.name = "UNDLM_00173";
    masterLayer173.label = 9; // Couleurs alternées
}

// Ajouter plan 00174 à la timeline master
if (planCompositions[174]) {
    var masterLayer174 = masterComp.layers.add(planCompositions[174]);
    masterLayer174.startTime = 58.48;
    masterLayer174.name = "UNDLM_00174";
    masterLayer174.label = 10; // Couleurs alternées
}

// Ajouter plan 00175 à la timeline master
if (planCompositions[175]) {
    var masterLayer175 = masterComp.layers.add(planCompositions[175]);
    masterLayer175.startTime = 62.519999999999996;
    masterLayer175.name = "UNDLM_00175";
    masterLayer175.label = 11; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ08";\n' +
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
    {start: 0, end: 5.12, name: "UNDLM_00165"},
    {start: 5.12, end: 16.4, name: "UNDLM_00166"},
    {start: 16.4, end: 20.96, name: "UNDLM_00167"},
    {start: 20.96, end: 24.32, name: "UNDLM_00168"},
    {start: 24.32, end: 29.48, name: "UNDLM_00169"},
    {start: 29.48, end: 35.24, name: "UNDLM_00170"},
    {start: 35.24, end: 43.04, name: "UNDLM_00171"},
    {start: 43.04, end: 49.76, name: "UNDLM_00172"},
    {start: 49.76, end: 58.48, name: "UNDLM_00173"},
    {start: 58.48, end: 62.519999999999996, name: "UNDLM_00174"},
    {start: 62.519999999999996, end: 67.28, name: "UNDLM_00175"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ08/_AE/SQ08_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 11;
var totalCount = 11;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ08 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(67.28 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ08_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ08:" + totalCount + ":" + gradedCount);
