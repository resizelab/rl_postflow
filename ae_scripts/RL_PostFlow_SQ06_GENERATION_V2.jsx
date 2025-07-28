
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ06 avec 11 plans
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


// Import plan EDIT 00134
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile134 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00134.mov");
var editFilePoignees134 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00134_AVEC_POIGNEES.mov");
var editFileBis134 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00134bis.mov");

var importSuccess134 = false;
var fileName134 = "";

// Tenter import standard
if (editFile134.exists) {
    try {
        var editFootage134 = project.importFile(new ImportOptions(editFile134));
        editFootage134.parentFolder = fromEditFolder;
        editFootage134.name = "UNDLM_00134";
        editSources[134] = editFootage134;
        editImportCount++;
        importSuccess134 = true;
        fileName134 = "UNDLM_00134.mov";
        logImportSuccess(134, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00134.mov", fileName134);
    } catch (e) {
        logImportError(134, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00134.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess134 && editFilePoignees134.exists) {
    try {
        var editFootage134 = project.importFile(new ImportOptions(editFilePoignees134));
        editFootage134.parentFolder = fromEditFolder;
        editFootage134.name = "UNDLM_00134_AVEC_POIGNEES";
        editSources[134] = editFootage134;
        editImportCount++;
        importSuccess134 = true;
        fileName134 = "UNDLM_00134_AVEC_POIGNEES.mov";
        logImportSuccess(134, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00134_AVEC_POIGNEES.mov", fileName134);
    } catch (e) {
        logImportError(134, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00134_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess134 && editFileBis134.exists) {
    try {
        var editFootage134 = project.importFile(new ImportOptions(editFileBis134));
        editFootage134.parentFolder = fromEditFolder;
        editFootage134.name = "UNDLM_00134bis";
        editSources[134] = editFootage134;
        editImportCount++;
        importSuccess134 = true;
        fileName134 = "UNDLM_00134bis.mov";
        logImportSuccess(134, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00134bis.mov", fileName134);
    } catch (e) {
        logImportError(134, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00134bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess134) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00134.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00135
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile135 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00135.mov");
var editFilePoignees135 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00135_AVEC_POIGNEES.mov");
var editFileBis135 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00135bis.mov");

var importSuccess135 = false;
var fileName135 = "";

// Tenter import standard
if (editFile135.exists) {
    try {
        var editFootage135 = project.importFile(new ImportOptions(editFile135));
        editFootage135.parentFolder = fromEditFolder;
        editFootage135.name = "UNDLM_00135";
        editSources[135] = editFootage135;
        editImportCount++;
        importSuccess135 = true;
        fileName135 = "UNDLM_00135.mov";
        logImportSuccess(135, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00135.mov", fileName135);
    } catch (e) {
        logImportError(135, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00135.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess135 && editFilePoignees135.exists) {
    try {
        var editFootage135 = project.importFile(new ImportOptions(editFilePoignees135));
        editFootage135.parentFolder = fromEditFolder;
        editFootage135.name = "UNDLM_00135_AVEC_POIGNEES";
        editSources[135] = editFootage135;
        editImportCount++;
        importSuccess135 = true;
        fileName135 = "UNDLM_00135_AVEC_POIGNEES.mov";
        logImportSuccess(135, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00135_AVEC_POIGNEES.mov", fileName135);
    } catch (e) {
        logImportError(135, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00135_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess135 && editFileBis135.exists) {
    try {
        var editFootage135 = project.importFile(new ImportOptions(editFileBis135));
        editFootage135.parentFolder = fromEditFolder;
        editFootage135.name = "UNDLM_00135bis";
        editSources[135] = editFootage135;
        editImportCount++;
        importSuccess135 = true;
        fileName135 = "UNDLM_00135bis.mov";
        logImportSuccess(135, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00135bis.mov", fileName135);
    } catch (e) {
        logImportError(135, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00135bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess135) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00135.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00136
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile136 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00136.mov");
var editFilePoignees136 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00136_AVEC_POIGNEES.mov");
var editFileBis136 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00136bis.mov");

var importSuccess136 = false;
var fileName136 = "";

// Tenter import standard
if (editFile136.exists) {
    try {
        var editFootage136 = project.importFile(new ImportOptions(editFile136));
        editFootage136.parentFolder = fromEditFolder;
        editFootage136.name = "UNDLM_00136";
        editSources[136] = editFootage136;
        editImportCount++;
        importSuccess136 = true;
        fileName136 = "UNDLM_00136.mov";
        logImportSuccess(136, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00136.mov", fileName136);
    } catch (e) {
        logImportError(136, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00136.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess136 && editFilePoignees136.exists) {
    try {
        var editFootage136 = project.importFile(new ImportOptions(editFilePoignees136));
        editFootage136.parentFolder = fromEditFolder;
        editFootage136.name = "UNDLM_00136_AVEC_POIGNEES";
        editSources[136] = editFootage136;
        editImportCount++;
        importSuccess136 = true;
        fileName136 = "UNDLM_00136_AVEC_POIGNEES.mov";
        logImportSuccess(136, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00136_AVEC_POIGNEES.mov", fileName136);
    } catch (e) {
        logImportError(136, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00136_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess136 && editFileBis136.exists) {
    try {
        var editFootage136 = project.importFile(new ImportOptions(editFileBis136));
        editFootage136.parentFolder = fromEditFolder;
        editFootage136.name = "UNDLM_00136bis";
        editSources[136] = editFootage136;
        editImportCount++;
        importSuccess136 = true;
        fileName136 = "UNDLM_00136bis.mov";
        logImportSuccess(136, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00136bis.mov", fileName136);
    } catch (e) {
        logImportError(136, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00136bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess136) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00136.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00137
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile137 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00137.mov");
var editFilePoignees137 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00137_AVEC_POIGNEES.mov");
var editFileBis137 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00137bis.mov");

var importSuccess137 = false;
var fileName137 = "";

// Tenter import standard
if (editFile137.exists) {
    try {
        var editFootage137 = project.importFile(new ImportOptions(editFile137));
        editFootage137.parentFolder = fromEditFolder;
        editFootage137.name = "UNDLM_00137";
        editSources[137] = editFootage137;
        editImportCount++;
        importSuccess137 = true;
        fileName137 = "UNDLM_00137.mov";
        logImportSuccess(137, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00137.mov", fileName137);
    } catch (e) {
        logImportError(137, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00137.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess137 && editFilePoignees137.exists) {
    try {
        var editFootage137 = project.importFile(new ImportOptions(editFilePoignees137));
        editFootage137.parentFolder = fromEditFolder;
        editFootage137.name = "UNDLM_00137_AVEC_POIGNEES";
        editSources[137] = editFootage137;
        editImportCount++;
        importSuccess137 = true;
        fileName137 = "UNDLM_00137_AVEC_POIGNEES.mov";
        logImportSuccess(137, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00137_AVEC_POIGNEES.mov", fileName137);
    } catch (e) {
        logImportError(137, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00137_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess137 && editFileBis137.exists) {
    try {
        var editFootage137 = project.importFile(new ImportOptions(editFileBis137));
        editFootage137.parentFolder = fromEditFolder;
        editFootage137.name = "UNDLM_00137bis";
        editSources[137] = editFootage137;
        editImportCount++;
        importSuccess137 = true;
        fileName137 = "UNDLM_00137bis.mov";
        logImportSuccess(137, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00137bis.mov", fileName137);
    } catch (e) {
        logImportError(137, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00137bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess137) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00137.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00138
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile138 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00138.mov");
var editFilePoignees138 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00138_AVEC_POIGNEES.mov");
var editFileBis138 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00138bis.mov");

var importSuccess138 = false;
var fileName138 = "";

// Tenter import standard
if (editFile138.exists) {
    try {
        var editFootage138 = project.importFile(new ImportOptions(editFile138));
        editFootage138.parentFolder = fromEditFolder;
        editFootage138.name = "UNDLM_00138";
        editSources[138] = editFootage138;
        editImportCount++;
        importSuccess138 = true;
        fileName138 = "UNDLM_00138.mov";
        logImportSuccess(138, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00138.mov", fileName138);
    } catch (e) {
        logImportError(138, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00138.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess138 && editFilePoignees138.exists) {
    try {
        var editFootage138 = project.importFile(new ImportOptions(editFilePoignees138));
        editFootage138.parentFolder = fromEditFolder;
        editFootage138.name = "UNDLM_00138_AVEC_POIGNEES";
        editSources[138] = editFootage138;
        editImportCount++;
        importSuccess138 = true;
        fileName138 = "UNDLM_00138_AVEC_POIGNEES.mov";
        logImportSuccess(138, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00138_AVEC_POIGNEES.mov", fileName138);
    } catch (e) {
        logImportError(138, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00138_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess138 && editFileBis138.exists) {
    try {
        var editFootage138 = project.importFile(new ImportOptions(editFileBis138));
        editFootage138.parentFolder = fromEditFolder;
        editFootage138.name = "UNDLM_00138bis";
        editSources[138] = editFootage138;
        editImportCount++;
        importSuccess138 = true;
        fileName138 = "UNDLM_00138bis.mov";
        logImportSuccess(138, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00138bis.mov", fileName138);
    } catch (e) {
        logImportError(138, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00138bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess138) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00138.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00139
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile139 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00139.mov");
var editFilePoignees139 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00139_AVEC_POIGNEES.mov");
var editFileBis139 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00139bis.mov");

var importSuccess139 = false;
var fileName139 = "";

// Tenter import standard
if (editFile139.exists) {
    try {
        var editFootage139 = project.importFile(new ImportOptions(editFile139));
        editFootage139.parentFolder = fromEditFolder;
        editFootage139.name = "UNDLM_00139";
        editSources[139] = editFootage139;
        editImportCount++;
        importSuccess139 = true;
        fileName139 = "UNDLM_00139.mov";
        logImportSuccess(139, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00139.mov", fileName139);
    } catch (e) {
        logImportError(139, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00139.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess139 && editFilePoignees139.exists) {
    try {
        var editFootage139 = project.importFile(new ImportOptions(editFilePoignees139));
        editFootage139.parentFolder = fromEditFolder;
        editFootage139.name = "UNDLM_00139_AVEC_POIGNEES";
        editSources[139] = editFootage139;
        editImportCount++;
        importSuccess139 = true;
        fileName139 = "UNDLM_00139_AVEC_POIGNEES.mov";
        logImportSuccess(139, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00139_AVEC_POIGNEES.mov", fileName139);
    } catch (e) {
        logImportError(139, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00139_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess139 && editFileBis139.exists) {
    try {
        var editFootage139 = project.importFile(new ImportOptions(editFileBis139));
        editFootage139.parentFolder = fromEditFolder;
        editFootage139.name = "UNDLM_00139bis";
        editSources[139] = editFootage139;
        editImportCount++;
        importSuccess139 = true;
        fileName139 = "UNDLM_00139bis.mov";
        logImportSuccess(139, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00139bis.mov", fileName139);
    } catch (e) {
        logImportError(139, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00139bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess139) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00139.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00140
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile140 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00140.mov");
var editFilePoignees140 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00140_AVEC_POIGNEES.mov");
var editFileBis140 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00140bis.mov");

var importSuccess140 = false;
var fileName140 = "";

// Tenter import standard
if (editFile140.exists) {
    try {
        var editFootage140 = project.importFile(new ImportOptions(editFile140));
        editFootage140.parentFolder = fromEditFolder;
        editFootage140.name = "UNDLM_00140";
        editSources[140] = editFootage140;
        editImportCount++;
        importSuccess140 = true;
        fileName140 = "UNDLM_00140.mov";
        logImportSuccess(140, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00140.mov", fileName140);
    } catch (e) {
        logImportError(140, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00140.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess140 && editFilePoignees140.exists) {
    try {
        var editFootage140 = project.importFile(new ImportOptions(editFilePoignees140));
        editFootage140.parentFolder = fromEditFolder;
        editFootage140.name = "UNDLM_00140_AVEC_POIGNEES";
        editSources[140] = editFootage140;
        editImportCount++;
        importSuccess140 = true;
        fileName140 = "UNDLM_00140_AVEC_POIGNEES.mov";
        logImportSuccess(140, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00140_AVEC_POIGNEES.mov", fileName140);
    } catch (e) {
        logImportError(140, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00140_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess140 && editFileBis140.exists) {
    try {
        var editFootage140 = project.importFile(new ImportOptions(editFileBis140));
        editFootage140.parentFolder = fromEditFolder;
        editFootage140.name = "UNDLM_00140bis";
        editSources[140] = editFootage140;
        editImportCount++;
        importSuccess140 = true;
        fileName140 = "UNDLM_00140bis.mov";
        logImportSuccess(140, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00140bis.mov", fileName140);
    } catch (e) {
        logImportError(140, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00140bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess140) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00140.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00141
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile141 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00141.mov");
var editFilePoignees141 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00141_AVEC_POIGNEES.mov");
var editFileBis141 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00141bis.mov");

var importSuccess141 = false;
var fileName141 = "";

// Tenter import standard
if (editFile141.exists) {
    try {
        var editFootage141 = project.importFile(new ImportOptions(editFile141));
        editFootage141.parentFolder = fromEditFolder;
        editFootage141.name = "UNDLM_00141";
        editSources[141] = editFootage141;
        editImportCount++;
        importSuccess141 = true;
        fileName141 = "UNDLM_00141.mov";
        logImportSuccess(141, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00141.mov", fileName141);
    } catch (e) {
        logImportError(141, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00141.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess141 && editFilePoignees141.exists) {
    try {
        var editFootage141 = project.importFile(new ImportOptions(editFilePoignees141));
        editFootage141.parentFolder = fromEditFolder;
        editFootage141.name = "UNDLM_00141_AVEC_POIGNEES";
        editSources[141] = editFootage141;
        editImportCount++;
        importSuccess141 = true;
        fileName141 = "UNDLM_00141_AVEC_POIGNEES.mov";
        logImportSuccess(141, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00141_AVEC_POIGNEES.mov", fileName141);
    } catch (e) {
        logImportError(141, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00141_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess141 && editFileBis141.exists) {
    try {
        var editFootage141 = project.importFile(new ImportOptions(editFileBis141));
        editFootage141.parentFolder = fromEditFolder;
        editFootage141.name = "UNDLM_00141bis";
        editSources[141] = editFootage141;
        editImportCount++;
        importSuccess141 = true;
        fileName141 = "UNDLM_00141bis.mov";
        logImportSuccess(141, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00141bis.mov", fileName141);
    } catch (e) {
        logImportError(141, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00141bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess141) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00141.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00142
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile142 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00142.mov");
var editFilePoignees142 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00142_AVEC_POIGNEES.mov");
var editFileBis142 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00142bis.mov");

var importSuccess142 = false;
var fileName142 = "";

// Tenter import standard
if (editFile142.exists) {
    try {
        var editFootage142 = project.importFile(new ImportOptions(editFile142));
        editFootage142.parentFolder = fromEditFolder;
        editFootage142.name = "UNDLM_00142";
        editSources[142] = editFootage142;
        editImportCount++;
        importSuccess142 = true;
        fileName142 = "UNDLM_00142.mov";
        logImportSuccess(142, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00142.mov", fileName142);
    } catch (e) {
        logImportError(142, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00142.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess142 && editFilePoignees142.exists) {
    try {
        var editFootage142 = project.importFile(new ImportOptions(editFilePoignees142));
        editFootage142.parentFolder = fromEditFolder;
        editFootage142.name = "UNDLM_00142_AVEC_POIGNEES";
        editSources[142] = editFootage142;
        editImportCount++;
        importSuccess142 = true;
        fileName142 = "UNDLM_00142_AVEC_POIGNEES.mov";
        logImportSuccess(142, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00142_AVEC_POIGNEES.mov", fileName142);
    } catch (e) {
        logImportError(142, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00142_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess142 && editFileBis142.exists) {
    try {
        var editFootage142 = project.importFile(new ImportOptions(editFileBis142));
        editFootage142.parentFolder = fromEditFolder;
        editFootage142.name = "UNDLM_00142bis";
        editSources[142] = editFootage142;
        editImportCount++;
        importSuccess142 = true;
        fileName142 = "UNDLM_00142bis.mov";
        logImportSuccess(142, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00142bis.mov", fileName142);
    } catch (e) {
        logImportError(142, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00142bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess142) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00142.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00144
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile144 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00144.mov");
var editFilePoignees144 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00144_AVEC_POIGNEES.mov");
var editFileBis144 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00144bis.mov");

var importSuccess144 = false;
var fileName144 = "";

// Tenter import standard
if (editFile144.exists) {
    try {
        var editFootage144 = project.importFile(new ImportOptions(editFile144));
        editFootage144.parentFolder = fromEditFolder;
        editFootage144.name = "UNDLM_00144";
        editSources[144] = editFootage144;
        editImportCount++;
        importSuccess144 = true;
        fileName144 = "UNDLM_00144.mov";
        logImportSuccess(144, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00144.mov", fileName144);
    } catch (e) {
        logImportError(144, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00144.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess144 && editFilePoignees144.exists) {
    try {
        var editFootage144 = project.importFile(new ImportOptions(editFilePoignees144));
        editFootage144.parentFolder = fromEditFolder;
        editFootage144.name = "UNDLM_00144_AVEC_POIGNEES";
        editSources[144] = editFootage144;
        editImportCount++;
        importSuccess144 = true;
        fileName144 = "UNDLM_00144_AVEC_POIGNEES.mov";
        logImportSuccess(144, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00144_AVEC_POIGNEES.mov", fileName144);
    } catch (e) {
        logImportError(144, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00144_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess144 && editFileBis144.exists) {
    try {
        var editFootage144 = project.importFile(new ImportOptions(editFileBis144));
        editFootage144.parentFolder = fromEditFolder;
        editFootage144.name = "UNDLM_00144bis";
        editSources[144] = editFootage144;
        editImportCount++;
        importSuccess144 = true;
        fileName144 = "UNDLM_00144bis.mov";
        logImportSuccess(144, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00144bis.mov", fileName144);
    } catch (e) {
        logImportError(144, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00144bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess144) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00144.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00145
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile145 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00145.mov");
var editFilePoignees145 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00145_AVEC_POIGNEES.mov");
var editFileBis145 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00145bis.mov");

var importSuccess145 = false;
var fileName145 = "";

// Tenter import standard
if (editFile145.exists) {
    try {
        var editFootage145 = project.importFile(new ImportOptions(editFile145));
        editFootage145.parentFolder = fromEditFolder;
        editFootage145.name = "UNDLM_00145";
        editSources[145] = editFootage145;
        editImportCount++;
        importSuccess145 = true;
        fileName145 = "UNDLM_00145.mov";
        logImportSuccess(145, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00145.mov", fileName145);
    } catch (e) {
        logImportError(145, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00145.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess145 && editFilePoignees145.exists) {
    try {
        var editFootage145 = project.importFile(new ImportOptions(editFilePoignees145));
        editFootage145.parentFolder = fromEditFolder;
        editFootage145.name = "UNDLM_00145_AVEC_POIGNEES";
        editSources[145] = editFootage145;
        editImportCount++;
        importSuccess145 = true;
        fileName145 = "UNDLM_00145_AVEC_POIGNEES.mov";
        logImportSuccess(145, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00145_AVEC_POIGNEES.mov", fileName145);
    } catch (e) {
        logImportError(145, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00145_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess145 && editFileBis145.exists) {
    try {
        var editFootage145 = project.importFile(new ImportOptions(editFileBis145));
        editFootage145.parentFolder = fromEditFolder;
        editFootage145.name = "UNDLM_00145bis";
        editSources[145] = editFootage145;
        editImportCount++;
        importSuccess145 = true;
        fileName145 = "UNDLM_00145bis.mov";
        logImportSuccess(145, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00145bis.mov", fileName145);
    } catch (e) {
        logImportError(145, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00145bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess145) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00145.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00134
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile134 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00134.mov");
var gradedFilePoignees134 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00134_AVEC_POIGNEES.mov");
var gradedFileBis134 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00134bis.mov");

var gradedImportSuccess134 = false;
var gradedFileName134 = "";

// Tenter import standard
if (gradedFile134.exists) {
    try {
        var gradedFootage134 = project.importFile(new ImportOptions(gradedFile134));
        gradedFootage134.parentFolder = fromGradingFolder;
        gradedFootage134.name = "UNDLM_00134";
        gradingSources[134] = gradedFootage134;
        gradingImportCount++;
        gradedImportSuccess134 = true;
        gradedFileName134 = "UNDLM_00134.mov";
        logImportSuccess(134, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00134.mov", gradedFileName134);
    } catch (e) {
        logImportError(134, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00134.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess134 && gradedFilePoignees134.exists) {
    try {
        var gradedFootage134 = project.importFile(new ImportOptions(gradedFilePoignees134));
        gradedFootage134.parentFolder = fromGradingFolder;
        gradedFootage134.name = "UNDLM_00134_AVEC_POIGNEES";
        gradingSources[134] = gradedFootage134;
        gradingImportCount++;
        gradedImportSuccess134 = true;
        gradedFileName134 = "UNDLM_00134_AVEC_POIGNEES.mov";
        logImportSuccess(134, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00134_AVEC_POIGNEES.mov", gradedFileName134);
    } catch (e) {
        logImportError(134, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00134_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess134 && gradedFileBis134.exists) {
    try {
        var gradedFootage134 = project.importFile(new ImportOptions(gradedFileBis134));
        gradedFootage134.parentFolder = fromGradingFolder;
        gradedFootage134.name = "UNDLM_00134bis";
        gradingSources[134] = gradedFootage134;
        gradingImportCount++;
        gradedImportSuccess134 = true;
        gradedFileName134 = "UNDLM_00134bis.mov";
        logImportSuccess(134, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00134bis.mov", gradedFileName134);
    } catch (e) {
        logImportError(134, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00134bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess134) {
    missingGradingCount++;
}

// Import plan GRADED 00135
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile135 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00135.mov");
var gradedFilePoignees135 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00135_AVEC_POIGNEES.mov");
var gradedFileBis135 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00135bis.mov");

var gradedImportSuccess135 = false;
var gradedFileName135 = "";

// Tenter import standard
if (gradedFile135.exists) {
    try {
        var gradedFootage135 = project.importFile(new ImportOptions(gradedFile135));
        gradedFootage135.parentFolder = fromGradingFolder;
        gradedFootage135.name = "UNDLM_00135";
        gradingSources[135] = gradedFootage135;
        gradingImportCount++;
        gradedImportSuccess135 = true;
        gradedFileName135 = "UNDLM_00135.mov";
        logImportSuccess(135, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00135.mov", gradedFileName135);
    } catch (e) {
        logImportError(135, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00135.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess135 && gradedFilePoignees135.exists) {
    try {
        var gradedFootage135 = project.importFile(new ImportOptions(gradedFilePoignees135));
        gradedFootage135.parentFolder = fromGradingFolder;
        gradedFootage135.name = "UNDLM_00135_AVEC_POIGNEES";
        gradingSources[135] = gradedFootage135;
        gradingImportCount++;
        gradedImportSuccess135 = true;
        gradedFileName135 = "UNDLM_00135_AVEC_POIGNEES.mov";
        logImportSuccess(135, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00135_AVEC_POIGNEES.mov", gradedFileName135);
    } catch (e) {
        logImportError(135, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00135_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess135 && gradedFileBis135.exists) {
    try {
        var gradedFootage135 = project.importFile(new ImportOptions(gradedFileBis135));
        gradedFootage135.parentFolder = fromGradingFolder;
        gradedFootage135.name = "UNDLM_00135bis";
        gradingSources[135] = gradedFootage135;
        gradingImportCount++;
        gradedImportSuccess135 = true;
        gradedFileName135 = "UNDLM_00135bis.mov";
        logImportSuccess(135, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00135bis.mov", gradedFileName135);
    } catch (e) {
        logImportError(135, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00135bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess135) {
    missingGradingCount++;
}

// Import plan GRADED 00136
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile136 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00136.mov");
var gradedFilePoignees136 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00136_AVEC_POIGNEES.mov");
var gradedFileBis136 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00136bis.mov");

var gradedImportSuccess136 = false;
var gradedFileName136 = "";

// Tenter import standard
if (gradedFile136.exists) {
    try {
        var gradedFootage136 = project.importFile(new ImportOptions(gradedFile136));
        gradedFootage136.parentFolder = fromGradingFolder;
        gradedFootage136.name = "UNDLM_00136";
        gradingSources[136] = gradedFootage136;
        gradingImportCount++;
        gradedImportSuccess136 = true;
        gradedFileName136 = "UNDLM_00136.mov";
        logImportSuccess(136, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00136.mov", gradedFileName136);
    } catch (e) {
        logImportError(136, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00136.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess136 && gradedFilePoignees136.exists) {
    try {
        var gradedFootage136 = project.importFile(new ImportOptions(gradedFilePoignees136));
        gradedFootage136.parentFolder = fromGradingFolder;
        gradedFootage136.name = "UNDLM_00136_AVEC_POIGNEES";
        gradingSources[136] = gradedFootage136;
        gradingImportCount++;
        gradedImportSuccess136 = true;
        gradedFileName136 = "UNDLM_00136_AVEC_POIGNEES.mov";
        logImportSuccess(136, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00136_AVEC_POIGNEES.mov", gradedFileName136);
    } catch (e) {
        logImportError(136, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00136_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess136 && gradedFileBis136.exists) {
    try {
        var gradedFootage136 = project.importFile(new ImportOptions(gradedFileBis136));
        gradedFootage136.parentFolder = fromGradingFolder;
        gradedFootage136.name = "UNDLM_00136bis";
        gradingSources[136] = gradedFootage136;
        gradingImportCount++;
        gradedImportSuccess136 = true;
        gradedFileName136 = "UNDLM_00136bis.mov";
        logImportSuccess(136, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00136bis.mov", gradedFileName136);
    } catch (e) {
        logImportError(136, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00136bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess136) {
    missingGradingCount++;
}

// Import plan GRADED 00137
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile137 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00137.mov");
var gradedFilePoignees137 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00137_AVEC_POIGNEES.mov");
var gradedFileBis137 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00137bis.mov");

var gradedImportSuccess137 = false;
var gradedFileName137 = "";

// Tenter import standard
if (gradedFile137.exists) {
    try {
        var gradedFootage137 = project.importFile(new ImportOptions(gradedFile137));
        gradedFootage137.parentFolder = fromGradingFolder;
        gradedFootage137.name = "UNDLM_00137";
        gradingSources[137] = gradedFootage137;
        gradingImportCount++;
        gradedImportSuccess137 = true;
        gradedFileName137 = "UNDLM_00137.mov";
        logImportSuccess(137, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00137.mov", gradedFileName137);
    } catch (e) {
        logImportError(137, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00137.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess137 && gradedFilePoignees137.exists) {
    try {
        var gradedFootage137 = project.importFile(new ImportOptions(gradedFilePoignees137));
        gradedFootage137.parentFolder = fromGradingFolder;
        gradedFootage137.name = "UNDLM_00137_AVEC_POIGNEES";
        gradingSources[137] = gradedFootage137;
        gradingImportCount++;
        gradedImportSuccess137 = true;
        gradedFileName137 = "UNDLM_00137_AVEC_POIGNEES.mov";
        logImportSuccess(137, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00137_AVEC_POIGNEES.mov", gradedFileName137);
    } catch (e) {
        logImportError(137, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00137_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess137 && gradedFileBis137.exists) {
    try {
        var gradedFootage137 = project.importFile(new ImportOptions(gradedFileBis137));
        gradedFootage137.parentFolder = fromGradingFolder;
        gradedFootage137.name = "UNDLM_00137bis";
        gradingSources[137] = gradedFootage137;
        gradingImportCount++;
        gradedImportSuccess137 = true;
        gradedFileName137 = "UNDLM_00137bis.mov";
        logImportSuccess(137, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00137bis.mov", gradedFileName137);
    } catch (e) {
        logImportError(137, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00137bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess137) {
    missingGradingCount++;
}

// Import plan GRADED 00138
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile138 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00138.mov");
var gradedFilePoignees138 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00138_AVEC_POIGNEES.mov");
var gradedFileBis138 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00138bis.mov");

var gradedImportSuccess138 = false;
var gradedFileName138 = "";

// Tenter import standard
if (gradedFile138.exists) {
    try {
        var gradedFootage138 = project.importFile(new ImportOptions(gradedFile138));
        gradedFootage138.parentFolder = fromGradingFolder;
        gradedFootage138.name = "UNDLM_00138";
        gradingSources[138] = gradedFootage138;
        gradingImportCount++;
        gradedImportSuccess138 = true;
        gradedFileName138 = "UNDLM_00138.mov";
        logImportSuccess(138, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00138.mov", gradedFileName138);
    } catch (e) {
        logImportError(138, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00138.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess138 && gradedFilePoignees138.exists) {
    try {
        var gradedFootage138 = project.importFile(new ImportOptions(gradedFilePoignees138));
        gradedFootage138.parentFolder = fromGradingFolder;
        gradedFootage138.name = "UNDLM_00138_AVEC_POIGNEES";
        gradingSources[138] = gradedFootage138;
        gradingImportCount++;
        gradedImportSuccess138 = true;
        gradedFileName138 = "UNDLM_00138_AVEC_POIGNEES.mov";
        logImportSuccess(138, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00138_AVEC_POIGNEES.mov", gradedFileName138);
    } catch (e) {
        logImportError(138, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00138_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess138 && gradedFileBis138.exists) {
    try {
        var gradedFootage138 = project.importFile(new ImportOptions(gradedFileBis138));
        gradedFootage138.parentFolder = fromGradingFolder;
        gradedFootage138.name = "UNDLM_00138bis";
        gradingSources[138] = gradedFootage138;
        gradingImportCount++;
        gradedImportSuccess138 = true;
        gradedFileName138 = "UNDLM_00138bis.mov";
        logImportSuccess(138, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00138bis.mov", gradedFileName138);
    } catch (e) {
        logImportError(138, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00138bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess138) {
    missingGradingCount++;
}

// Import plan GRADED 00139
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile139 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00139.mov");
var gradedFilePoignees139 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00139_AVEC_POIGNEES.mov");
var gradedFileBis139 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00139bis.mov");

var gradedImportSuccess139 = false;
var gradedFileName139 = "";

// Tenter import standard
if (gradedFile139.exists) {
    try {
        var gradedFootage139 = project.importFile(new ImportOptions(gradedFile139));
        gradedFootage139.parentFolder = fromGradingFolder;
        gradedFootage139.name = "UNDLM_00139";
        gradingSources[139] = gradedFootage139;
        gradingImportCount++;
        gradedImportSuccess139 = true;
        gradedFileName139 = "UNDLM_00139.mov";
        logImportSuccess(139, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00139.mov", gradedFileName139);
    } catch (e) {
        logImportError(139, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00139.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess139 && gradedFilePoignees139.exists) {
    try {
        var gradedFootage139 = project.importFile(new ImportOptions(gradedFilePoignees139));
        gradedFootage139.parentFolder = fromGradingFolder;
        gradedFootage139.name = "UNDLM_00139_AVEC_POIGNEES";
        gradingSources[139] = gradedFootage139;
        gradingImportCount++;
        gradedImportSuccess139 = true;
        gradedFileName139 = "UNDLM_00139_AVEC_POIGNEES.mov";
        logImportSuccess(139, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00139_AVEC_POIGNEES.mov", gradedFileName139);
    } catch (e) {
        logImportError(139, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00139_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess139 && gradedFileBis139.exists) {
    try {
        var gradedFootage139 = project.importFile(new ImportOptions(gradedFileBis139));
        gradedFootage139.parentFolder = fromGradingFolder;
        gradedFootage139.name = "UNDLM_00139bis";
        gradingSources[139] = gradedFootage139;
        gradingImportCount++;
        gradedImportSuccess139 = true;
        gradedFileName139 = "UNDLM_00139bis.mov";
        logImportSuccess(139, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00139bis.mov", gradedFileName139);
    } catch (e) {
        logImportError(139, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00139bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess139) {
    missingGradingCount++;
}

// Import plan GRADED 00140
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile140 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00140.mov");
var gradedFilePoignees140 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00140_AVEC_POIGNEES.mov");
var gradedFileBis140 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00140bis.mov");

var gradedImportSuccess140 = false;
var gradedFileName140 = "";

// Tenter import standard
if (gradedFile140.exists) {
    try {
        var gradedFootage140 = project.importFile(new ImportOptions(gradedFile140));
        gradedFootage140.parentFolder = fromGradingFolder;
        gradedFootage140.name = "UNDLM_00140";
        gradingSources[140] = gradedFootage140;
        gradingImportCount++;
        gradedImportSuccess140 = true;
        gradedFileName140 = "UNDLM_00140.mov";
        logImportSuccess(140, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00140.mov", gradedFileName140);
    } catch (e) {
        logImportError(140, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00140.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess140 && gradedFilePoignees140.exists) {
    try {
        var gradedFootage140 = project.importFile(new ImportOptions(gradedFilePoignees140));
        gradedFootage140.parentFolder = fromGradingFolder;
        gradedFootage140.name = "UNDLM_00140_AVEC_POIGNEES";
        gradingSources[140] = gradedFootage140;
        gradingImportCount++;
        gradedImportSuccess140 = true;
        gradedFileName140 = "UNDLM_00140_AVEC_POIGNEES.mov";
        logImportSuccess(140, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00140_AVEC_POIGNEES.mov", gradedFileName140);
    } catch (e) {
        logImportError(140, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00140_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess140 && gradedFileBis140.exists) {
    try {
        var gradedFootage140 = project.importFile(new ImportOptions(gradedFileBis140));
        gradedFootage140.parentFolder = fromGradingFolder;
        gradedFootage140.name = "UNDLM_00140bis";
        gradingSources[140] = gradedFootage140;
        gradingImportCount++;
        gradedImportSuccess140 = true;
        gradedFileName140 = "UNDLM_00140bis.mov";
        logImportSuccess(140, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00140bis.mov", gradedFileName140);
    } catch (e) {
        logImportError(140, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00140bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess140) {
    missingGradingCount++;
}

// Import plan GRADED 00141
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile141 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00141.mov");
var gradedFilePoignees141 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00141_AVEC_POIGNEES.mov");
var gradedFileBis141 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00141bis.mov");

var gradedImportSuccess141 = false;
var gradedFileName141 = "";

// Tenter import standard
if (gradedFile141.exists) {
    try {
        var gradedFootage141 = project.importFile(new ImportOptions(gradedFile141));
        gradedFootage141.parentFolder = fromGradingFolder;
        gradedFootage141.name = "UNDLM_00141";
        gradingSources[141] = gradedFootage141;
        gradingImportCount++;
        gradedImportSuccess141 = true;
        gradedFileName141 = "UNDLM_00141.mov";
        logImportSuccess(141, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00141.mov", gradedFileName141);
    } catch (e) {
        logImportError(141, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00141.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess141 && gradedFilePoignees141.exists) {
    try {
        var gradedFootage141 = project.importFile(new ImportOptions(gradedFilePoignees141));
        gradedFootage141.parentFolder = fromGradingFolder;
        gradedFootage141.name = "UNDLM_00141_AVEC_POIGNEES";
        gradingSources[141] = gradedFootage141;
        gradingImportCount++;
        gradedImportSuccess141 = true;
        gradedFileName141 = "UNDLM_00141_AVEC_POIGNEES.mov";
        logImportSuccess(141, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00141_AVEC_POIGNEES.mov", gradedFileName141);
    } catch (e) {
        logImportError(141, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00141_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess141 && gradedFileBis141.exists) {
    try {
        var gradedFootage141 = project.importFile(new ImportOptions(gradedFileBis141));
        gradedFootage141.parentFolder = fromGradingFolder;
        gradedFootage141.name = "UNDLM_00141bis";
        gradingSources[141] = gradedFootage141;
        gradingImportCount++;
        gradedImportSuccess141 = true;
        gradedFileName141 = "UNDLM_00141bis.mov";
        logImportSuccess(141, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00141bis.mov", gradedFileName141);
    } catch (e) {
        logImportError(141, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00141bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess141) {
    missingGradingCount++;
}

// Import plan GRADED 00142
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile142 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00142.mov");
var gradedFilePoignees142 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00142_AVEC_POIGNEES.mov");
var gradedFileBis142 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00142bis.mov");

var gradedImportSuccess142 = false;
var gradedFileName142 = "";

// Tenter import standard
if (gradedFile142.exists) {
    try {
        var gradedFootage142 = project.importFile(new ImportOptions(gradedFile142));
        gradedFootage142.parentFolder = fromGradingFolder;
        gradedFootage142.name = "UNDLM_00142";
        gradingSources[142] = gradedFootage142;
        gradingImportCount++;
        gradedImportSuccess142 = true;
        gradedFileName142 = "UNDLM_00142.mov";
        logImportSuccess(142, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00142.mov", gradedFileName142);
    } catch (e) {
        logImportError(142, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00142.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess142 && gradedFilePoignees142.exists) {
    try {
        var gradedFootage142 = project.importFile(new ImportOptions(gradedFilePoignees142));
        gradedFootage142.parentFolder = fromGradingFolder;
        gradedFootage142.name = "UNDLM_00142_AVEC_POIGNEES";
        gradingSources[142] = gradedFootage142;
        gradingImportCount++;
        gradedImportSuccess142 = true;
        gradedFileName142 = "UNDLM_00142_AVEC_POIGNEES.mov";
        logImportSuccess(142, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00142_AVEC_POIGNEES.mov", gradedFileName142);
    } catch (e) {
        logImportError(142, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00142_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess142 && gradedFileBis142.exists) {
    try {
        var gradedFootage142 = project.importFile(new ImportOptions(gradedFileBis142));
        gradedFootage142.parentFolder = fromGradingFolder;
        gradedFootage142.name = "UNDLM_00142bis";
        gradingSources[142] = gradedFootage142;
        gradingImportCount++;
        gradedImportSuccess142 = true;
        gradedFileName142 = "UNDLM_00142bis.mov";
        logImportSuccess(142, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00142bis.mov", gradedFileName142);
    } catch (e) {
        logImportError(142, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00142bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess142) {
    missingGradingCount++;
}

// Import plan GRADED 00144
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile144 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00144.mov");
var gradedFilePoignees144 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00144_AVEC_POIGNEES.mov");
var gradedFileBis144 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00144bis.mov");

var gradedImportSuccess144 = false;
var gradedFileName144 = "";

// Tenter import standard
if (gradedFile144.exists) {
    try {
        var gradedFootage144 = project.importFile(new ImportOptions(gradedFile144));
        gradedFootage144.parentFolder = fromGradingFolder;
        gradedFootage144.name = "UNDLM_00144";
        gradingSources[144] = gradedFootage144;
        gradingImportCount++;
        gradedImportSuccess144 = true;
        gradedFileName144 = "UNDLM_00144.mov";
        logImportSuccess(144, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00144.mov", gradedFileName144);
    } catch (e) {
        logImportError(144, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00144.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess144 && gradedFilePoignees144.exists) {
    try {
        var gradedFootage144 = project.importFile(new ImportOptions(gradedFilePoignees144));
        gradedFootage144.parentFolder = fromGradingFolder;
        gradedFootage144.name = "UNDLM_00144_AVEC_POIGNEES";
        gradingSources[144] = gradedFootage144;
        gradingImportCount++;
        gradedImportSuccess144 = true;
        gradedFileName144 = "UNDLM_00144_AVEC_POIGNEES.mov";
        logImportSuccess(144, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00144_AVEC_POIGNEES.mov", gradedFileName144);
    } catch (e) {
        logImportError(144, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00144_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess144 && gradedFileBis144.exists) {
    try {
        var gradedFootage144 = project.importFile(new ImportOptions(gradedFileBis144));
        gradedFootage144.parentFolder = fromGradingFolder;
        gradedFootage144.name = "UNDLM_00144bis";
        gradingSources[144] = gradedFootage144;
        gradingImportCount++;
        gradedImportSuccess144 = true;
        gradedFileName144 = "UNDLM_00144bis.mov";
        logImportSuccess(144, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00144bis.mov", gradedFileName144);
    } catch (e) {
        logImportError(144, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00144bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess144) {
    missingGradingCount++;
}

// Import plan GRADED 00145
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile145 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00145.mov");
var gradedFilePoignees145 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00145_AVEC_POIGNEES.mov");
var gradedFileBis145 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00145bis.mov");

var gradedImportSuccess145 = false;
var gradedFileName145 = "";

// Tenter import standard
if (gradedFile145.exists) {
    try {
        var gradedFootage145 = project.importFile(new ImportOptions(gradedFile145));
        gradedFootage145.parentFolder = fromGradingFolder;
        gradedFootage145.name = "UNDLM_00145";
        gradingSources[145] = gradedFootage145;
        gradingImportCount++;
        gradedImportSuccess145 = true;
        gradedFileName145 = "UNDLM_00145.mov";
        logImportSuccess(145, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00145.mov", gradedFileName145);
    } catch (e) {
        logImportError(145, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00145.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess145 && gradedFilePoignees145.exists) {
    try {
        var gradedFootage145 = project.importFile(new ImportOptions(gradedFilePoignees145));
        gradedFootage145.parentFolder = fromGradingFolder;
        gradedFootage145.name = "UNDLM_00145_AVEC_POIGNEES";
        gradingSources[145] = gradedFootage145;
        gradingImportCount++;
        gradedImportSuccess145 = true;
        gradedFileName145 = "UNDLM_00145_AVEC_POIGNEES.mov";
        logImportSuccess(145, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00145_AVEC_POIGNEES.mov", gradedFileName145);
    } catch (e) {
        logImportError(145, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00145_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess145 && gradedFileBis145.exists) {
    try {
        var gradedFootage145 = project.importFile(new ImportOptions(gradedFileBis145));
        gradedFootage145.parentFolder = fromGradingFolder;
        gradedFootage145.name = "UNDLM_00145bis";
        gradingSources[145] = gradedFootage145;
        gradingImportCount++;
        gradedImportSuccess145 = true;
        gradedFileName145 = "UNDLM_00145bis.mov";
        logImportSuccess(145, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00145bis.mov", gradedFileName145);
    } catch (e) {
        logImportError(145, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00145bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess145) {
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


// Composition pour plan 00134
var planComp134 = project.items.addComp(
    "SQ06_UNDLM_00134_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp134.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer134 = planComp134.layers.add(bgSolidComp);
bgLayer134.name = "BG_SOLID";
bgLayer134.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer134 = false;
if (gradingSources[134]) {
    var gradedLayer134 = planComp134.layers.add(gradingSources[134]);
    gradedLayer134.name = "UNDLM_00134_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer134.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer134.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer134 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer134 = false;
if (editSources[134]) {
    var editLayer134 = planComp134.layers.add(editSources[134]);
    editLayer134.name = "UNDLM_00134_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer134.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer134.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer134 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity134 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer134) {
    // EDIT toujours activé quand disponible
    editLayer134.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer134) {
        gradedLayer134.enabled = false;
    }
} else if (hasGradedLayer134) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer134.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText134 = planComp134.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText134.name = "WARNING_NO_EDIT";
    warningText134.property("Transform").property("Position").setValue([1280, 200]);
    warningText134.guideLayer = true;
    
    var warningTextDoc134 = warningText134.property("Source Text").value;
    warningTextDoc134.fontSize = 32;
    warningTextDoc134.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc134.font = "Arial-BoldMT";
    warningTextDoc134.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText134.property("Source Text").setValue(warningTextDoc134);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText134 = planComp134.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00134");
    errorText134.name = "ERROR_NO_SOURCE";
    errorText134.property("Transform").property("Position").setValue([1280, 720]);
    errorText134.guideLayer = true;
    
    var errorTextDoc134 = errorText134.property("Source Text").value;
    errorTextDoc134.fontSize = 48;
    errorTextDoc134.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc134.font = "Arial-BoldMT";
    errorTextDoc134.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText134.property("Source Text").setValue(errorTextDoc134);
}

planCompositions[134] = planComp134;


// Composition pour plan 00135
var planComp135 = project.items.addComp(
    "SQ06_UNDLM_00135_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp135.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer135 = planComp135.layers.add(bgSolidComp);
bgLayer135.name = "BG_SOLID";
bgLayer135.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer135 = false;
if (gradingSources[135]) {
    var gradedLayer135 = planComp135.layers.add(gradingSources[135]);
    gradedLayer135.name = "UNDLM_00135_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer135.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer135.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer135 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer135 = false;
if (editSources[135]) {
    var editLayer135 = planComp135.layers.add(editSources[135]);
    editLayer135.name = "UNDLM_00135_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer135.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer135.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer135 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity135 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer135) {
    // EDIT toujours activé quand disponible
    editLayer135.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer135) {
        gradedLayer135.enabled = false;
    }
} else if (hasGradedLayer135) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer135.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText135 = planComp135.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText135.name = "WARNING_NO_EDIT";
    warningText135.property("Transform").property("Position").setValue([1280, 200]);
    warningText135.guideLayer = true;
    
    var warningTextDoc135 = warningText135.property("Source Text").value;
    warningTextDoc135.fontSize = 32;
    warningTextDoc135.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc135.font = "Arial-BoldMT";
    warningTextDoc135.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText135.property("Source Text").setValue(warningTextDoc135);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText135 = planComp135.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00135");
    errorText135.name = "ERROR_NO_SOURCE";
    errorText135.property("Transform").property("Position").setValue([1280, 720]);
    errorText135.guideLayer = true;
    
    var errorTextDoc135 = errorText135.property("Source Text").value;
    errorTextDoc135.fontSize = 48;
    errorTextDoc135.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc135.font = "Arial-BoldMT";
    errorTextDoc135.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText135.property("Source Text").setValue(errorTextDoc135);
}

planCompositions[135] = planComp135;


// Composition pour plan 00136
var planComp136 = project.items.addComp(
    "SQ06_UNDLM_00136_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp136.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer136 = planComp136.layers.add(bgSolidComp);
bgLayer136.name = "BG_SOLID";
bgLayer136.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer136 = false;
if (gradingSources[136]) {
    var gradedLayer136 = planComp136.layers.add(gradingSources[136]);
    gradedLayer136.name = "UNDLM_00136_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer136.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer136.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer136 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer136 = false;
if (editSources[136]) {
    var editLayer136 = planComp136.layers.add(editSources[136]);
    editLayer136.name = "UNDLM_00136_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer136.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer136.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer136 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity136 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer136) {
    // EDIT toujours activé quand disponible
    editLayer136.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer136) {
        gradedLayer136.enabled = false;
    }
} else if (hasGradedLayer136) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer136.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText136 = planComp136.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText136.name = "WARNING_NO_EDIT";
    warningText136.property("Transform").property("Position").setValue([1280, 200]);
    warningText136.guideLayer = true;
    
    var warningTextDoc136 = warningText136.property("Source Text").value;
    warningTextDoc136.fontSize = 32;
    warningTextDoc136.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc136.font = "Arial-BoldMT";
    warningTextDoc136.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText136.property("Source Text").setValue(warningTextDoc136);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText136 = planComp136.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00136");
    errorText136.name = "ERROR_NO_SOURCE";
    errorText136.property("Transform").property("Position").setValue([1280, 720]);
    errorText136.guideLayer = true;
    
    var errorTextDoc136 = errorText136.property("Source Text").value;
    errorTextDoc136.fontSize = 48;
    errorTextDoc136.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc136.font = "Arial-BoldMT";
    errorTextDoc136.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText136.property("Source Text").setValue(errorTextDoc136);
}

planCompositions[136] = planComp136;


// Composition pour plan 00137
var planComp137 = project.items.addComp(
    "SQ06_UNDLM_00137_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp137.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer137 = planComp137.layers.add(bgSolidComp);
bgLayer137.name = "BG_SOLID";
bgLayer137.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer137 = false;
if (gradingSources[137]) {
    var gradedLayer137 = planComp137.layers.add(gradingSources[137]);
    gradedLayer137.name = "UNDLM_00137_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer137.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer137.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer137 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer137 = false;
if (editSources[137]) {
    var editLayer137 = planComp137.layers.add(editSources[137]);
    editLayer137.name = "UNDLM_00137_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer137.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer137.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer137 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity137 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer137) {
    // EDIT toujours activé quand disponible
    editLayer137.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer137) {
        gradedLayer137.enabled = false;
    }
} else if (hasGradedLayer137) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer137.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText137 = planComp137.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText137.name = "WARNING_NO_EDIT";
    warningText137.property("Transform").property("Position").setValue([1280, 200]);
    warningText137.guideLayer = true;
    
    var warningTextDoc137 = warningText137.property("Source Text").value;
    warningTextDoc137.fontSize = 32;
    warningTextDoc137.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc137.font = "Arial-BoldMT";
    warningTextDoc137.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText137.property("Source Text").setValue(warningTextDoc137);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText137 = planComp137.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00137");
    errorText137.name = "ERROR_NO_SOURCE";
    errorText137.property("Transform").property("Position").setValue([1280, 720]);
    errorText137.guideLayer = true;
    
    var errorTextDoc137 = errorText137.property("Source Text").value;
    errorTextDoc137.fontSize = 48;
    errorTextDoc137.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc137.font = "Arial-BoldMT";
    errorTextDoc137.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText137.property("Source Text").setValue(errorTextDoc137);
}

planCompositions[137] = planComp137;


// Composition pour plan 00138
var planComp138 = project.items.addComp(
    "SQ06_UNDLM_00138_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    12.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp138.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer138 = planComp138.layers.add(bgSolidComp);
bgLayer138.name = "BG_SOLID";
bgLayer138.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer138 = false;
if (gradingSources[138]) {
    var gradedLayer138 = planComp138.layers.add(gradingSources[138]);
    gradedLayer138.name = "UNDLM_00138_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer138.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer138.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer138 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer138 = false;
if (editSources[138]) {
    var editLayer138 = planComp138.layers.add(editSources[138]);
    editLayer138.name = "UNDLM_00138_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer138.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer138.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer138 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity138 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer138) {
    // EDIT toujours activé quand disponible
    editLayer138.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer138) {
        gradedLayer138.enabled = false;
    }
} else if (hasGradedLayer138) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer138.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText138 = planComp138.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText138.name = "WARNING_NO_EDIT";
    warningText138.property("Transform").property("Position").setValue([1280, 200]);
    warningText138.guideLayer = true;
    
    var warningTextDoc138 = warningText138.property("Source Text").value;
    warningTextDoc138.fontSize = 32;
    warningTextDoc138.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc138.font = "Arial-BoldMT";
    warningTextDoc138.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText138.property("Source Text").setValue(warningTextDoc138);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText138 = planComp138.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00138");
    errorText138.name = "ERROR_NO_SOURCE";
    errorText138.property("Transform").property("Position").setValue([1280, 720]);
    errorText138.guideLayer = true;
    
    var errorTextDoc138 = errorText138.property("Source Text").value;
    errorTextDoc138.fontSize = 48;
    errorTextDoc138.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc138.font = "Arial-BoldMT";
    errorTextDoc138.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText138.property("Source Text").setValue(errorTextDoc138);
}

planCompositions[138] = planComp138;


// Composition pour plan 00139
var planComp139 = project.items.addComp(
    "SQ06_UNDLM_00139_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.7199999999999998,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp139.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer139 = planComp139.layers.add(bgSolidComp);
bgLayer139.name = "BG_SOLID";
bgLayer139.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer139 = false;
if (gradingSources[139]) {
    var gradedLayer139 = planComp139.layers.add(gradingSources[139]);
    gradedLayer139.name = "UNDLM_00139_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer139.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer139.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer139 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer139 = false;
if (editSources[139]) {
    var editLayer139 = planComp139.layers.add(editSources[139]);
    editLayer139.name = "UNDLM_00139_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer139.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer139.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer139 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity139 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer139) {
    // EDIT toujours activé quand disponible
    editLayer139.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer139) {
        gradedLayer139.enabled = false;
    }
} else if (hasGradedLayer139) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer139.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText139 = planComp139.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText139.name = "WARNING_NO_EDIT";
    warningText139.property("Transform").property("Position").setValue([1280, 200]);
    warningText139.guideLayer = true;
    
    var warningTextDoc139 = warningText139.property("Source Text").value;
    warningTextDoc139.fontSize = 32;
    warningTextDoc139.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc139.font = "Arial-BoldMT";
    warningTextDoc139.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText139.property("Source Text").setValue(warningTextDoc139);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText139 = planComp139.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00139");
    errorText139.name = "ERROR_NO_SOURCE";
    errorText139.property("Transform").property("Position").setValue([1280, 720]);
    errorText139.guideLayer = true;
    
    var errorTextDoc139 = errorText139.property("Source Text").value;
    errorTextDoc139.fontSize = 48;
    errorTextDoc139.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc139.font = "Arial-BoldMT";
    errorTextDoc139.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText139.property("Source Text").setValue(errorTextDoc139);
}

planCompositions[139] = planComp139;


// Composition pour plan 00140
var planComp140 = project.items.addComp(
    "SQ06_UNDLM_00140_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp140.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer140 = planComp140.layers.add(bgSolidComp);
bgLayer140.name = "BG_SOLID";
bgLayer140.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer140 = false;
if (gradingSources[140]) {
    var gradedLayer140 = planComp140.layers.add(gradingSources[140]);
    gradedLayer140.name = "UNDLM_00140_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer140.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer140.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer140 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer140 = false;
if (editSources[140]) {
    var editLayer140 = planComp140.layers.add(editSources[140]);
    editLayer140.name = "UNDLM_00140_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer140.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer140.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer140 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity140 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer140) {
    // EDIT toujours activé quand disponible
    editLayer140.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer140) {
        gradedLayer140.enabled = false;
    }
} else if (hasGradedLayer140) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer140.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText140 = planComp140.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText140.name = "WARNING_NO_EDIT";
    warningText140.property("Transform").property("Position").setValue([1280, 200]);
    warningText140.guideLayer = true;
    
    var warningTextDoc140 = warningText140.property("Source Text").value;
    warningTextDoc140.fontSize = 32;
    warningTextDoc140.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc140.font = "Arial-BoldMT";
    warningTextDoc140.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText140.property("Source Text").setValue(warningTextDoc140);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText140 = planComp140.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00140");
    errorText140.name = "ERROR_NO_SOURCE";
    errorText140.property("Transform").property("Position").setValue([1280, 720]);
    errorText140.guideLayer = true;
    
    var errorTextDoc140 = errorText140.property("Source Text").value;
    errorTextDoc140.fontSize = 48;
    errorTextDoc140.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc140.font = "Arial-BoldMT";
    errorTextDoc140.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText140.property("Source Text").setValue(errorTextDoc140);
}

planCompositions[140] = planComp140;


// Composition pour plan 00141
var planComp141 = project.items.addComp(
    "SQ06_UNDLM_00141_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp141.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer141 = planComp141.layers.add(bgSolidComp);
bgLayer141.name = "BG_SOLID";
bgLayer141.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer141 = false;
if (gradingSources[141]) {
    var gradedLayer141 = planComp141.layers.add(gradingSources[141]);
    gradedLayer141.name = "UNDLM_00141_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer141.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer141.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer141 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer141 = false;
if (editSources[141]) {
    var editLayer141 = planComp141.layers.add(editSources[141]);
    editLayer141.name = "UNDLM_00141_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer141.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer141.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer141 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity141 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer141) {
    // EDIT toujours activé quand disponible
    editLayer141.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer141) {
        gradedLayer141.enabled = false;
    }
} else if (hasGradedLayer141) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer141.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText141 = planComp141.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText141.name = "WARNING_NO_EDIT";
    warningText141.property("Transform").property("Position").setValue([1280, 200]);
    warningText141.guideLayer = true;
    
    var warningTextDoc141 = warningText141.property("Source Text").value;
    warningTextDoc141.fontSize = 32;
    warningTextDoc141.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc141.font = "Arial-BoldMT";
    warningTextDoc141.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText141.property("Source Text").setValue(warningTextDoc141);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText141 = planComp141.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00141");
    errorText141.name = "ERROR_NO_SOURCE";
    errorText141.property("Transform").property("Position").setValue([1280, 720]);
    errorText141.guideLayer = true;
    
    var errorTextDoc141 = errorText141.property("Source Text").value;
    errorTextDoc141.fontSize = 48;
    errorTextDoc141.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc141.font = "Arial-BoldMT";
    errorTextDoc141.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText141.property("Source Text").setValue(errorTextDoc141);
}

planCompositions[141] = planComp141;


// Composition pour plan 00142
var planComp142 = project.items.addComp(
    "SQ06_UNDLM_00142_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.7199999999999998,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp142.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer142 = planComp142.layers.add(bgSolidComp);
bgLayer142.name = "BG_SOLID";
bgLayer142.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer142 = false;
if (gradingSources[142]) {
    var gradedLayer142 = planComp142.layers.add(gradingSources[142]);
    gradedLayer142.name = "UNDLM_00142_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer142.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer142.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer142 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer142 = false;
if (editSources[142]) {
    var editLayer142 = planComp142.layers.add(editSources[142]);
    editLayer142.name = "UNDLM_00142_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer142.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer142.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer142 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity142 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer142) {
    // EDIT toujours activé quand disponible
    editLayer142.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer142) {
        gradedLayer142.enabled = false;
    }
} else if (hasGradedLayer142) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer142.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText142 = planComp142.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText142.name = "WARNING_NO_EDIT";
    warningText142.property("Transform").property("Position").setValue([1280, 200]);
    warningText142.guideLayer = true;
    
    var warningTextDoc142 = warningText142.property("Source Text").value;
    warningTextDoc142.fontSize = 32;
    warningTextDoc142.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc142.font = "Arial-BoldMT";
    warningTextDoc142.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText142.property("Source Text").setValue(warningTextDoc142);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText142 = planComp142.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00142");
    errorText142.name = "ERROR_NO_SOURCE";
    errorText142.property("Transform").property("Position").setValue([1280, 720]);
    errorText142.guideLayer = true;
    
    var errorTextDoc142 = errorText142.property("Source Text").value;
    errorTextDoc142.fontSize = 48;
    errorTextDoc142.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc142.font = "Arial-BoldMT";
    errorTextDoc142.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText142.property("Source Text").setValue(errorTextDoc142);
}

planCompositions[142] = planComp142;


// Composition pour plan 00144
var planComp144 = project.items.addComp(
    "SQ06_UNDLM_00144_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp144.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer144 = planComp144.layers.add(bgSolidComp);
bgLayer144.name = "BG_SOLID";
bgLayer144.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer144 = false;
if (gradingSources[144]) {
    var gradedLayer144 = planComp144.layers.add(gradingSources[144]);
    gradedLayer144.name = "UNDLM_00144_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer144.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer144.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer144 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer144 = false;
if (editSources[144]) {
    var editLayer144 = planComp144.layers.add(editSources[144]);
    editLayer144.name = "UNDLM_00144_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer144.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer144.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer144 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity144 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer144) {
    // EDIT toujours activé quand disponible
    editLayer144.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer144) {
        gradedLayer144.enabled = false;
    }
} else if (hasGradedLayer144) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer144.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText144 = planComp144.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText144.name = "WARNING_NO_EDIT";
    warningText144.property("Transform").property("Position").setValue([1280, 200]);
    warningText144.guideLayer = true;
    
    var warningTextDoc144 = warningText144.property("Source Text").value;
    warningTextDoc144.fontSize = 32;
    warningTextDoc144.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc144.font = "Arial-BoldMT";
    warningTextDoc144.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText144.property("Source Text").setValue(warningTextDoc144);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText144 = planComp144.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00144");
    errorText144.name = "ERROR_NO_SOURCE";
    errorText144.property("Transform").property("Position").setValue([1280, 720]);
    errorText144.guideLayer = true;
    
    var errorTextDoc144 = errorText144.property("Source Text").value;
    errorTextDoc144.fontSize = 48;
    errorTextDoc144.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc144.font = "Arial-BoldMT";
    errorTextDoc144.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText144.property("Source Text").setValue(errorTextDoc144);
}

planCompositions[144] = planComp144;


// Composition pour plan 00145
var planComp145 = project.items.addComp(
    "SQ06_UNDLM_00145_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp145.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer145 = planComp145.layers.add(bgSolidComp);
bgLayer145.name = "BG_SOLID";
bgLayer145.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer145 = false;
if (gradingSources[145]) {
    var gradedLayer145 = planComp145.layers.add(gradingSources[145]);
    gradedLayer145.name = "UNDLM_00145_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer145.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer145.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer145 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer145 = false;
if (editSources[145]) {
    var editLayer145 = planComp145.layers.add(editSources[145]);
    editLayer145.name = "UNDLM_00145_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer145.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer145.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer145 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity145 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer145) {
    // EDIT toujours activé quand disponible
    editLayer145.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer145) {
        gradedLayer145.enabled = false;
    }
} else if (hasGradedLayer145) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer145.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText145 = planComp145.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText145.name = "WARNING_NO_EDIT";
    warningText145.property("Transform").property("Position").setValue([1280, 200]);
    warningText145.guideLayer = true;
    
    var warningTextDoc145 = warningText145.property("Source Text").value;
    warningTextDoc145.fontSize = 32;
    warningTextDoc145.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc145.font = "Arial-BoldMT";
    warningTextDoc145.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText145.property("Source Text").setValue(warningTextDoc145);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText145 = planComp145.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00145");
    errorText145.name = "ERROR_NO_SOURCE";
    errorText145.property("Transform").property("Position").setValue([1280, 720]);
    errorText145.guideLayer = true;
    
    var errorTextDoc145 = errorText145.property("Source Text").value;
    errorTextDoc145.fontSize = 48;
    errorTextDoc145.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc145.font = "Arial-BoldMT";
    errorTextDoc145.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText145.property("Source Text").setValue(errorTextDoc145);
}

planCompositions[145] = planComp145;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ06_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    64.88, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00134 à la timeline master
if (planCompositions[134]) {
    var masterLayer134 = masterComp.layers.add(planCompositions[134]);
    masterLayer134.startTime = 0;
    masterLayer134.name = "UNDLM_00134";
    masterLayer134.label = 1; // Couleurs alternées
}

// Ajouter plan 00135 à la timeline master
if (planCompositions[135]) {
    var masterLayer135 = masterComp.layers.add(planCompositions[135]);
    masterLayer135.startTime = 8.28;
    masterLayer135.name = "UNDLM_00135";
    masterLayer135.label = 2; // Couleurs alternées
}

// Ajouter plan 00136 à la timeline master
if (planCompositions[136]) {
    var masterLayer136 = masterComp.layers.add(planCompositions[136]);
    masterLayer136.startTime = 11.959999999999999;
    masterLayer136.name = "UNDLM_00136";
    masterLayer136.label = 3; // Couleurs alternées
}

// Ajouter plan 00137 à la timeline master
if (planCompositions[137]) {
    var masterLayer137 = masterComp.layers.add(planCompositions[137]);
    masterLayer137.startTime = 17.04;
    masterLayer137.name = "UNDLM_00137";
    masterLayer137.label = 4; // Couleurs alternées
}

// Ajouter plan 00138 à la timeline master
if (planCompositions[138]) {
    var masterLayer138 = masterComp.layers.add(planCompositions[138]);
    masterLayer138.startTime = 22.84;
    masterLayer138.name = "UNDLM_00138";
    masterLayer138.label = 5; // Couleurs alternées
}

// Ajouter plan 00139 à la timeline master
if (planCompositions[139]) {
    var masterLayer139 = masterComp.layers.add(planCompositions[139]);
    masterLayer139.startTime = 35.0;
    masterLayer139.name = "UNDLM_00139";
    masterLayer139.label = 6; // Couleurs alternées
}

// Ajouter plan 00140 à la timeline master
if (planCompositions[140]) {
    var masterLayer140 = masterComp.layers.add(planCompositions[140]);
    masterLayer140.startTime = 38.72;
    masterLayer140.name = "UNDLM_00140";
    masterLayer140.label = 7; // Couleurs alternées
}

// Ajouter plan 00141 à la timeline master
if (planCompositions[141]) {
    var masterLayer141 = masterComp.layers.add(planCompositions[141]);
    masterLayer141.startTime = 43.32;
    masterLayer141.name = "UNDLM_00141";
    masterLayer141.label = 8; // Couleurs alternées
}

// Ajouter plan 00142 à la timeline master
if (planCompositions[142]) {
    var masterLayer142 = masterComp.layers.add(planCompositions[142]);
    masterLayer142.startTime = 45.76;
    masterLayer142.name = "UNDLM_00142";
    masterLayer142.label = 9; // Couleurs alternées
}

// Ajouter plan 00144 à la timeline master
if (planCompositions[144]) {
    var masterLayer144 = masterComp.layers.add(planCompositions[144]);
    masterLayer144.startTime = 49.48;
    masterLayer144.name = "UNDLM_00144";
    masterLayer144.label = 10; // Couleurs alternées
}

// Ajouter plan 00145 à la timeline master
if (planCompositions[145]) {
    var masterLayer145 = masterComp.layers.add(planCompositions[145]);
    masterLayer145.startTime = 56.64;
    masterLayer145.name = "UNDLM_00145";
    masterLayer145.label = 11; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ06";\n' +
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
    {start: 0, end: 8.28, name: "UNDLM_00134"},
    {start: 8.28, end: 11.959999999999999, name: "UNDLM_00135"},
    {start: 11.959999999999999, end: 17.04, name: "UNDLM_00136"},
    {start: 17.04, end: 22.84, name: "UNDLM_00137"},
    {start: 22.84, end: 35.0, name: "UNDLM_00138"},
    {start: 35.0, end: 38.72, name: "UNDLM_00139"},
    {start: 38.72, end: 43.32, name: "UNDLM_00140"},
    {start: 43.32, end: 45.76, name: "UNDLM_00141"},
    {start: 45.76, end: 49.48, name: "UNDLM_00142"},
    {start: 49.48, end: 56.64, name: "UNDLM_00144"},
    {start: 56.64, end: 64.88, name: "UNDLM_00145"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ06/_AE/SQ06_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 11;
var totalCount = 11;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ06 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(64.88 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ06_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ06:" + totalCount + ":" + gradedCount);
