
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ13 avec 14 plans
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


// Import plan EDIT 00234
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile234 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00234.mov");
var editFilePoignees234 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00234_AVEC_POIGNEES.mov");
var editFileBis234 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00234bis.mov");

var importSuccess234 = false;
var fileName234 = "";

// Tenter import standard
if (editFile234.exists) {
    try {
        var editFootage234 = project.importFile(new ImportOptions(editFile234));
        editFootage234.parentFolder = fromEditFolder;
        editFootage234.name = "UNDLM_00234";
        editSources[234] = editFootage234;
        editImportCount++;
        importSuccess234 = true;
        fileName234 = "UNDLM_00234.mov";
        logImportSuccess(234, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00234.mov", fileName234);
    } catch (e) {
        logImportError(234, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00234.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess234 && editFilePoignees234.exists) {
    try {
        var editFootage234 = project.importFile(new ImportOptions(editFilePoignees234));
        editFootage234.parentFolder = fromEditFolder;
        editFootage234.name = "UNDLM_00234_AVEC_POIGNEES";
        editSources[234] = editFootage234;
        editImportCount++;
        importSuccess234 = true;
        fileName234 = "UNDLM_00234_AVEC_POIGNEES.mov";
        logImportSuccess(234, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00234_AVEC_POIGNEES.mov", fileName234);
    } catch (e) {
        logImportError(234, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00234_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess234 && editFileBis234.exists) {
    try {
        var editFootage234 = project.importFile(new ImportOptions(editFileBis234));
        editFootage234.parentFolder = fromEditFolder;
        editFootage234.name = "UNDLM_00234bis";
        editSources[234] = editFootage234;
        editImportCount++;
        importSuccess234 = true;
        fileName234 = "UNDLM_00234bis.mov";
        logImportSuccess(234, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00234bis.mov", fileName234);
    } catch (e) {
        logImportError(234, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00234bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess234) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00234.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00235
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile235 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00235.mov");
var editFilePoignees235 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00235_AVEC_POIGNEES.mov");
var editFileBis235 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00235bis.mov");

var importSuccess235 = false;
var fileName235 = "";

// Tenter import standard
if (editFile235.exists) {
    try {
        var editFootage235 = project.importFile(new ImportOptions(editFile235));
        editFootage235.parentFolder = fromEditFolder;
        editFootage235.name = "UNDLM_00235";
        editSources[235] = editFootage235;
        editImportCount++;
        importSuccess235 = true;
        fileName235 = "UNDLM_00235.mov";
        logImportSuccess(235, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00235.mov", fileName235);
    } catch (e) {
        logImportError(235, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00235.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess235 && editFilePoignees235.exists) {
    try {
        var editFootage235 = project.importFile(new ImportOptions(editFilePoignees235));
        editFootage235.parentFolder = fromEditFolder;
        editFootage235.name = "UNDLM_00235_AVEC_POIGNEES";
        editSources[235] = editFootage235;
        editImportCount++;
        importSuccess235 = true;
        fileName235 = "UNDLM_00235_AVEC_POIGNEES.mov";
        logImportSuccess(235, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00235_AVEC_POIGNEES.mov", fileName235);
    } catch (e) {
        logImportError(235, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00235_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess235 && editFileBis235.exists) {
    try {
        var editFootage235 = project.importFile(new ImportOptions(editFileBis235));
        editFootage235.parentFolder = fromEditFolder;
        editFootage235.name = "UNDLM_00235bis";
        editSources[235] = editFootage235;
        editImportCount++;
        importSuccess235 = true;
        fileName235 = "UNDLM_00235bis.mov";
        logImportSuccess(235, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00235bis.mov", fileName235);
    } catch (e) {
        logImportError(235, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00235bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess235) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00235.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00236
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile236 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00236.mov");
var editFilePoignees236 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00236_AVEC_POIGNEES.mov");
var editFileBis236 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00236bis.mov");

var importSuccess236 = false;
var fileName236 = "";

// Tenter import standard
if (editFile236.exists) {
    try {
        var editFootage236 = project.importFile(new ImportOptions(editFile236));
        editFootage236.parentFolder = fromEditFolder;
        editFootage236.name = "UNDLM_00236";
        editSources[236] = editFootage236;
        editImportCount++;
        importSuccess236 = true;
        fileName236 = "UNDLM_00236.mov";
        logImportSuccess(236, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00236.mov", fileName236);
    } catch (e) {
        logImportError(236, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00236.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess236 && editFilePoignees236.exists) {
    try {
        var editFootage236 = project.importFile(new ImportOptions(editFilePoignees236));
        editFootage236.parentFolder = fromEditFolder;
        editFootage236.name = "UNDLM_00236_AVEC_POIGNEES";
        editSources[236] = editFootage236;
        editImportCount++;
        importSuccess236 = true;
        fileName236 = "UNDLM_00236_AVEC_POIGNEES.mov";
        logImportSuccess(236, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00236_AVEC_POIGNEES.mov", fileName236);
    } catch (e) {
        logImportError(236, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00236_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess236 && editFileBis236.exists) {
    try {
        var editFootage236 = project.importFile(new ImportOptions(editFileBis236));
        editFootage236.parentFolder = fromEditFolder;
        editFootage236.name = "UNDLM_00236bis";
        editSources[236] = editFootage236;
        editImportCount++;
        importSuccess236 = true;
        fileName236 = "UNDLM_00236bis.mov";
        logImportSuccess(236, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00236bis.mov", fileName236);
    } catch (e) {
        logImportError(236, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00236bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess236) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00236.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00237
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile237 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00237.mov");
var editFilePoignees237 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00237_AVEC_POIGNEES.mov");
var editFileBis237 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00237bis.mov");

var importSuccess237 = false;
var fileName237 = "";

// Tenter import standard
if (editFile237.exists) {
    try {
        var editFootage237 = project.importFile(new ImportOptions(editFile237));
        editFootage237.parentFolder = fromEditFolder;
        editFootage237.name = "UNDLM_00237";
        editSources[237] = editFootage237;
        editImportCount++;
        importSuccess237 = true;
        fileName237 = "UNDLM_00237.mov";
        logImportSuccess(237, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00237.mov", fileName237);
    } catch (e) {
        logImportError(237, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00237.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess237 && editFilePoignees237.exists) {
    try {
        var editFootage237 = project.importFile(new ImportOptions(editFilePoignees237));
        editFootage237.parentFolder = fromEditFolder;
        editFootage237.name = "UNDLM_00237_AVEC_POIGNEES";
        editSources[237] = editFootage237;
        editImportCount++;
        importSuccess237 = true;
        fileName237 = "UNDLM_00237_AVEC_POIGNEES.mov";
        logImportSuccess(237, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00237_AVEC_POIGNEES.mov", fileName237);
    } catch (e) {
        logImportError(237, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00237_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess237 && editFileBis237.exists) {
    try {
        var editFootage237 = project.importFile(new ImportOptions(editFileBis237));
        editFootage237.parentFolder = fromEditFolder;
        editFootage237.name = "UNDLM_00237bis";
        editSources[237] = editFootage237;
        editImportCount++;
        importSuccess237 = true;
        fileName237 = "UNDLM_00237bis.mov";
        logImportSuccess(237, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00237bis.mov", fileName237);
    } catch (e) {
        logImportError(237, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00237bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess237) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00237.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00238
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile238 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00238.mov");
var editFilePoignees238 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00238_AVEC_POIGNEES.mov");
var editFileBis238 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00238bis.mov");

var importSuccess238 = false;
var fileName238 = "";

// Tenter import standard
if (editFile238.exists) {
    try {
        var editFootage238 = project.importFile(new ImportOptions(editFile238));
        editFootage238.parentFolder = fromEditFolder;
        editFootage238.name = "UNDLM_00238";
        editSources[238] = editFootage238;
        editImportCount++;
        importSuccess238 = true;
        fileName238 = "UNDLM_00238.mov";
        logImportSuccess(238, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00238.mov", fileName238);
    } catch (e) {
        logImportError(238, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00238.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess238 && editFilePoignees238.exists) {
    try {
        var editFootage238 = project.importFile(new ImportOptions(editFilePoignees238));
        editFootage238.parentFolder = fromEditFolder;
        editFootage238.name = "UNDLM_00238_AVEC_POIGNEES";
        editSources[238] = editFootage238;
        editImportCount++;
        importSuccess238 = true;
        fileName238 = "UNDLM_00238_AVEC_POIGNEES.mov";
        logImportSuccess(238, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00238_AVEC_POIGNEES.mov", fileName238);
    } catch (e) {
        logImportError(238, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00238_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess238 && editFileBis238.exists) {
    try {
        var editFootage238 = project.importFile(new ImportOptions(editFileBis238));
        editFootage238.parentFolder = fromEditFolder;
        editFootage238.name = "UNDLM_00238bis";
        editSources[238] = editFootage238;
        editImportCount++;
        importSuccess238 = true;
        fileName238 = "UNDLM_00238bis.mov";
        logImportSuccess(238, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00238bis.mov", fileName238);
    } catch (e) {
        logImportError(238, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00238bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess238) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00238.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00239
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile239 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00239.mov");
var editFilePoignees239 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00239_AVEC_POIGNEES.mov");
var editFileBis239 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00239bis.mov");

var importSuccess239 = false;
var fileName239 = "";

// Tenter import standard
if (editFile239.exists) {
    try {
        var editFootage239 = project.importFile(new ImportOptions(editFile239));
        editFootage239.parentFolder = fromEditFolder;
        editFootage239.name = "UNDLM_00239";
        editSources[239] = editFootage239;
        editImportCount++;
        importSuccess239 = true;
        fileName239 = "UNDLM_00239.mov";
        logImportSuccess(239, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00239.mov", fileName239);
    } catch (e) {
        logImportError(239, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00239.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess239 && editFilePoignees239.exists) {
    try {
        var editFootage239 = project.importFile(new ImportOptions(editFilePoignees239));
        editFootage239.parentFolder = fromEditFolder;
        editFootage239.name = "UNDLM_00239_AVEC_POIGNEES";
        editSources[239] = editFootage239;
        editImportCount++;
        importSuccess239 = true;
        fileName239 = "UNDLM_00239_AVEC_POIGNEES.mov";
        logImportSuccess(239, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00239_AVEC_POIGNEES.mov", fileName239);
    } catch (e) {
        logImportError(239, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00239_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess239 && editFileBis239.exists) {
    try {
        var editFootage239 = project.importFile(new ImportOptions(editFileBis239));
        editFootage239.parentFolder = fromEditFolder;
        editFootage239.name = "UNDLM_00239bis";
        editSources[239] = editFootage239;
        editImportCount++;
        importSuccess239 = true;
        fileName239 = "UNDLM_00239bis.mov";
        logImportSuccess(239, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00239bis.mov", fileName239);
    } catch (e) {
        logImportError(239, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00239bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess239) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00239.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00240
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile240 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00240.mov");
var editFilePoignees240 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00240_AVEC_POIGNEES.mov");
var editFileBis240 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00240bis.mov");

var importSuccess240 = false;
var fileName240 = "";

// Tenter import standard
if (editFile240.exists) {
    try {
        var editFootage240 = project.importFile(new ImportOptions(editFile240));
        editFootage240.parentFolder = fromEditFolder;
        editFootage240.name = "UNDLM_00240";
        editSources[240] = editFootage240;
        editImportCount++;
        importSuccess240 = true;
        fileName240 = "UNDLM_00240.mov";
        logImportSuccess(240, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00240.mov", fileName240);
    } catch (e) {
        logImportError(240, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00240.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess240 && editFilePoignees240.exists) {
    try {
        var editFootage240 = project.importFile(new ImportOptions(editFilePoignees240));
        editFootage240.parentFolder = fromEditFolder;
        editFootage240.name = "UNDLM_00240_AVEC_POIGNEES";
        editSources[240] = editFootage240;
        editImportCount++;
        importSuccess240 = true;
        fileName240 = "UNDLM_00240_AVEC_POIGNEES.mov";
        logImportSuccess(240, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00240_AVEC_POIGNEES.mov", fileName240);
    } catch (e) {
        logImportError(240, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00240_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess240 && editFileBis240.exists) {
    try {
        var editFootage240 = project.importFile(new ImportOptions(editFileBis240));
        editFootage240.parentFolder = fromEditFolder;
        editFootage240.name = "UNDLM_00240bis";
        editSources[240] = editFootage240;
        editImportCount++;
        importSuccess240 = true;
        fileName240 = "UNDLM_00240bis.mov";
        logImportSuccess(240, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00240bis.mov", fileName240);
    } catch (e) {
        logImportError(240, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00240bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess240) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00240.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00242
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile242 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00242.mov");
var editFilePoignees242 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00242_AVEC_POIGNEES.mov");
var editFileBis242 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00242bis.mov");

var importSuccess242 = false;
var fileName242 = "";

// Tenter import standard
if (editFile242.exists) {
    try {
        var editFootage242 = project.importFile(new ImportOptions(editFile242));
        editFootage242.parentFolder = fromEditFolder;
        editFootage242.name = "UNDLM_00242";
        editSources[242] = editFootage242;
        editImportCount++;
        importSuccess242 = true;
        fileName242 = "UNDLM_00242.mov";
        logImportSuccess(242, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00242.mov", fileName242);
    } catch (e) {
        logImportError(242, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00242.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess242 && editFilePoignees242.exists) {
    try {
        var editFootage242 = project.importFile(new ImportOptions(editFilePoignees242));
        editFootage242.parentFolder = fromEditFolder;
        editFootage242.name = "UNDLM_00242_AVEC_POIGNEES";
        editSources[242] = editFootage242;
        editImportCount++;
        importSuccess242 = true;
        fileName242 = "UNDLM_00242_AVEC_POIGNEES.mov";
        logImportSuccess(242, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00242_AVEC_POIGNEES.mov", fileName242);
    } catch (e) {
        logImportError(242, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00242_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess242 && editFileBis242.exists) {
    try {
        var editFootage242 = project.importFile(new ImportOptions(editFileBis242));
        editFootage242.parentFolder = fromEditFolder;
        editFootage242.name = "UNDLM_00242bis";
        editSources[242] = editFootage242;
        editImportCount++;
        importSuccess242 = true;
        fileName242 = "UNDLM_00242bis.mov";
        logImportSuccess(242, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00242bis.mov", fileName242);
    } catch (e) {
        logImportError(242, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00242bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess242) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00242.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00243
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile243 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00243.mov");
var editFilePoignees243 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00243_AVEC_POIGNEES.mov");
var editFileBis243 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00243bis.mov");

var importSuccess243 = false;
var fileName243 = "";

// Tenter import standard
if (editFile243.exists) {
    try {
        var editFootage243 = project.importFile(new ImportOptions(editFile243));
        editFootage243.parentFolder = fromEditFolder;
        editFootage243.name = "UNDLM_00243";
        editSources[243] = editFootage243;
        editImportCount++;
        importSuccess243 = true;
        fileName243 = "UNDLM_00243.mov";
        logImportSuccess(243, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00243.mov", fileName243);
    } catch (e) {
        logImportError(243, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00243.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess243 && editFilePoignees243.exists) {
    try {
        var editFootage243 = project.importFile(new ImportOptions(editFilePoignees243));
        editFootage243.parentFolder = fromEditFolder;
        editFootage243.name = "UNDLM_00243_AVEC_POIGNEES";
        editSources[243] = editFootage243;
        editImportCount++;
        importSuccess243 = true;
        fileName243 = "UNDLM_00243_AVEC_POIGNEES.mov";
        logImportSuccess(243, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00243_AVEC_POIGNEES.mov", fileName243);
    } catch (e) {
        logImportError(243, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00243_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess243 && editFileBis243.exists) {
    try {
        var editFootage243 = project.importFile(new ImportOptions(editFileBis243));
        editFootage243.parentFolder = fromEditFolder;
        editFootage243.name = "UNDLM_00243bis";
        editSources[243] = editFootage243;
        editImportCount++;
        importSuccess243 = true;
        fileName243 = "UNDLM_00243bis.mov";
        logImportSuccess(243, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00243bis.mov", fileName243);
    } catch (e) {
        logImportError(243, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00243bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess243) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00243.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00244
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile244 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00244.mov");
var editFilePoignees244 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00244_AVEC_POIGNEES.mov");
var editFileBis244 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00244bis.mov");

var importSuccess244 = false;
var fileName244 = "";

// Tenter import standard
if (editFile244.exists) {
    try {
        var editFootage244 = project.importFile(new ImportOptions(editFile244));
        editFootage244.parentFolder = fromEditFolder;
        editFootage244.name = "UNDLM_00244";
        editSources[244] = editFootage244;
        editImportCount++;
        importSuccess244 = true;
        fileName244 = "UNDLM_00244.mov";
        logImportSuccess(244, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00244.mov", fileName244);
    } catch (e) {
        logImportError(244, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00244.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess244 && editFilePoignees244.exists) {
    try {
        var editFootage244 = project.importFile(new ImportOptions(editFilePoignees244));
        editFootage244.parentFolder = fromEditFolder;
        editFootage244.name = "UNDLM_00244_AVEC_POIGNEES";
        editSources[244] = editFootage244;
        editImportCount++;
        importSuccess244 = true;
        fileName244 = "UNDLM_00244_AVEC_POIGNEES.mov";
        logImportSuccess(244, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00244_AVEC_POIGNEES.mov", fileName244);
    } catch (e) {
        logImportError(244, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00244_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess244 && editFileBis244.exists) {
    try {
        var editFootage244 = project.importFile(new ImportOptions(editFileBis244));
        editFootage244.parentFolder = fromEditFolder;
        editFootage244.name = "UNDLM_00244bis";
        editSources[244] = editFootage244;
        editImportCount++;
        importSuccess244 = true;
        fileName244 = "UNDLM_00244bis.mov";
        logImportSuccess(244, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00244bis.mov", fileName244);
    } catch (e) {
        logImportError(244, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00244bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess244) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00244.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00245
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile245 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00245.mov");
var editFilePoignees245 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00245_AVEC_POIGNEES.mov");
var editFileBis245 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00245bis.mov");

var importSuccess245 = false;
var fileName245 = "";

// Tenter import standard
if (editFile245.exists) {
    try {
        var editFootage245 = project.importFile(new ImportOptions(editFile245));
        editFootage245.parentFolder = fromEditFolder;
        editFootage245.name = "UNDLM_00245";
        editSources[245] = editFootage245;
        editImportCount++;
        importSuccess245 = true;
        fileName245 = "UNDLM_00245.mov";
        logImportSuccess(245, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00245.mov", fileName245);
    } catch (e) {
        logImportError(245, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00245.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess245 && editFilePoignees245.exists) {
    try {
        var editFootage245 = project.importFile(new ImportOptions(editFilePoignees245));
        editFootage245.parentFolder = fromEditFolder;
        editFootage245.name = "UNDLM_00245_AVEC_POIGNEES";
        editSources[245] = editFootage245;
        editImportCount++;
        importSuccess245 = true;
        fileName245 = "UNDLM_00245_AVEC_POIGNEES.mov";
        logImportSuccess(245, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00245_AVEC_POIGNEES.mov", fileName245);
    } catch (e) {
        logImportError(245, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00245_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess245 && editFileBis245.exists) {
    try {
        var editFootage245 = project.importFile(new ImportOptions(editFileBis245));
        editFootage245.parentFolder = fromEditFolder;
        editFootage245.name = "UNDLM_00245bis";
        editSources[245] = editFootage245;
        editImportCount++;
        importSuccess245 = true;
        fileName245 = "UNDLM_00245bis.mov";
        logImportSuccess(245, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00245bis.mov", fileName245);
    } catch (e) {
        logImportError(245, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00245bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess245) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00245.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00246
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile246 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00246.mov");
var editFilePoignees246 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00246_AVEC_POIGNEES.mov");
var editFileBis246 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00246bis.mov");

var importSuccess246 = false;
var fileName246 = "";

// Tenter import standard
if (editFile246.exists) {
    try {
        var editFootage246 = project.importFile(new ImportOptions(editFile246));
        editFootage246.parentFolder = fromEditFolder;
        editFootage246.name = "UNDLM_00246";
        editSources[246] = editFootage246;
        editImportCount++;
        importSuccess246 = true;
        fileName246 = "UNDLM_00246.mov";
        logImportSuccess(246, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00246.mov", fileName246);
    } catch (e) {
        logImportError(246, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00246.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess246 && editFilePoignees246.exists) {
    try {
        var editFootage246 = project.importFile(new ImportOptions(editFilePoignees246));
        editFootage246.parentFolder = fromEditFolder;
        editFootage246.name = "UNDLM_00246_AVEC_POIGNEES";
        editSources[246] = editFootage246;
        editImportCount++;
        importSuccess246 = true;
        fileName246 = "UNDLM_00246_AVEC_POIGNEES.mov";
        logImportSuccess(246, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00246_AVEC_POIGNEES.mov", fileName246);
    } catch (e) {
        logImportError(246, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00246_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess246 && editFileBis246.exists) {
    try {
        var editFootage246 = project.importFile(new ImportOptions(editFileBis246));
        editFootage246.parentFolder = fromEditFolder;
        editFootage246.name = "UNDLM_00246bis";
        editSources[246] = editFootage246;
        editImportCount++;
        importSuccess246 = true;
        fileName246 = "UNDLM_00246bis.mov";
        logImportSuccess(246, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00246bis.mov", fileName246);
    } catch (e) {
        logImportError(246, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00246bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess246) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00246.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00247
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile247 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00247.mov");
var editFilePoignees247 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00247_AVEC_POIGNEES.mov");
var editFileBis247 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00247bis.mov");

var importSuccess247 = false;
var fileName247 = "";

// Tenter import standard
if (editFile247.exists) {
    try {
        var editFootage247 = project.importFile(new ImportOptions(editFile247));
        editFootage247.parentFolder = fromEditFolder;
        editFootage247.name = "UNDLM_00247";
        editSources[247] = editFootage247;
        editImportCount++;
        importSuccess247 = true;
        fileName247 = "UNDLM_00247.mov";
        logImportSuccess(247, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00247.mov", fileName247);
    } catch (e) {
        logImportError(247, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00247.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess247 && editFilePoignees247.exists) {
    try {
        var editFootage247 = project.importFile(new ImportOptions(editFilePoignees247));
        editFootage247.parentFolder = fromEditFolder;
        editFootage247.name = "UNDLM_00247_AVEC_POIGNEES";
        editSources[247] = editFootage247;
        editImportCount++;
        importSuccess247 = true;
        fileName247 = "UNDLM_00247_AVEC_POIGNEES.mov";
        logImportSuccess(247, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00247_AVEC_POIGNEES.mov", fileName247);
    } catch (e) {
        logImportError(247, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00247_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess247 && editFileBis247.exists) {
    try {
        var editFootage247 = project.importFile(new ImportOptions(editFileBis247));
        editFootage247.parentFolder = fromEditFolder;
        editFootage247.name = "UNDLM_00247bis";
        editSources[247] = editFootage247;
        editImportCount++;
        importSuccess247 = true;
        fileName247 = "UNDLM_00247bis.mov";
        logImportSuccess(247, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00247bis.mov", fileName247);
    } catch (e) {
        logImportError(247, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00247bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess247) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00247.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00248
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile248 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00248.mov");
var editFilePoignees248 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00248_AVEC_POIGNEES.mov");
var editFileBis248 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00248bis.mov");

var importSuccess248 = false;
var fileName248 = "";

// Tenter import standard
if (editFile248.exists) {
    try {
        var editFootage248 = project.importFile(new ImportOptions(editFile248));
        editFootage248.parentFolder = fromEditFolder;
        editFootage248.name = "UNDLM_00248";
        editSources[248] = editFootage248;
        editImportCount++;
        importSuccess248 = true;
        fileName248 = "UNDLM_00248.mov";
        logImportSuccess(248, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00248.mov", fileName248);
    } catch (e) {
        logImportError(248, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00248.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess248 && editFilePoignees248.exists) {
    try {
        var editFootage248 = project.importFile(new ImportOptions(editFilePoignees248));
        editFootage248.parentFolder = fromEditFolder;
        editFootage248.name = "UNDLM_00248_AVEC_POIGNEES";
        editSources[248] = editFootage248;
        editImportCount++;
        importSuccess248 = true;
        fileName248 = "UNDLM_00248_AVEC_POIGNEES.mov";
        logImportSuccess(248, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00248_AVEC_POIGNEES.mov", fileName248);
    } catch (e) {
        logImportError(248, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00248_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess248 && editFileBis248.exists) {
    try {
        var editFootage248 = project.importFile(new ImportOptions(editFileBis248));
        editFootage248.parentFolder = fromEditFolder;
        editFootage248.name = "UNDLM_00248bis";
        editSources[248] = editFootage248;
        editImportCount++;
        importSuccess248 = true;
        fileName248 = "UNDLM_00248bis.mov";
        logImportSuccess(248, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00248bis.mov", fileName248);
    } catch (e) {
        logImportError(248, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00248bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess248) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00248.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00234
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile234 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00234.mov");
var gradedFilePoignees234 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00234_AVEC_POIGNEES.mov");
var gradedFileBis234 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00234bis.mov");

var gradedImportSuccess234 = false;
var gradedFileName234 = "";

// Tenter import standard
if (gradedFile234.exists) {
    try {
        var gradedFootage234 = project.importFile(new ImportOptions(gradedFile234));
        gradedFootage234.parentFolder = fromGradingFolder;
        gradedFootage234.name = "UNDLM_00234";
        gradingSources[234] = gradedFootage234;
        gradingImportCount++;
        gradedImportSuccess234 = true;
        gradedFileName234 = "UNDLM_00234.mov";
        logImportSuccess(234, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00234.mov", gradedFileName234);
    } catch (e) {
        logImportError(234, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00234.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess234 && gradedFilePoignees234.exists) {
    try {
        var gradedFootage234 = project.importFile(new ImportOptions(gradedFilePoignees234));
        gradedFootage234.parentFolder = fromGradingFolder;
        gradedFootage234.name = "UNDLM_00234_AVEC_POIGNEES";
        gradingSources[234] = gradedFootage234;
        gradingImportCount++;
        gradedImportSuccess234 = true;
        gradedFileName234 = "UNDLM_00234_AVEC_POIGNEES.mov";
        logImportSuccess(234, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00234_AVEC_POIGNEES.mov", gradedFileName234);
    } catch (e) {
        logImportError(234, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00234_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess234 && gradedFileBis234.exists) {
    try {
        var gradedFootage234 = project.importFile(new ImportOptions(gradedFileBis234));
        gradedFootage234.parentFolder = fromGradingFolder;
        gradedFootage234.name = "UNDLM_00234bis";
        gradingSources[234] = gradedFootage234;
        gradingImportCount++;
        gradedImportSuccess234 = true;
        gradedFileName234 = "UNDLM_00234bis.mov";
        logImportSuccess(234, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00234bis.mov", gradedFileName234);
    } catch (e) {
        logImportError(234, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00234bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess234) {
    missingGradingCount++;
}

// Import plan GRADED 00235
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile235 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00235.mov");
var gradedFilePoignees235 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00235_AVEC_POIGNEES.mov");
var gradedFileBis235 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00235bis.mov");

var gradedImportSuccess235 = false;
var gradedFileName235 = "";

// Tenter import standard
if (gradedFile235.exists) {
    try {
        var gradedFootage235 = project.importFile(new ImportOptions(gradedFile235));
        gradedFootage235.parentFolder = fromGradingFolder;
        gradedFootage235.name = "UNDLM_00235";
        gradingSources[235] = gradedFootage235;
        gradingImportCount++;
        gradedImportSuccess235 = true;
        gradedFileName235 = "UNDLM_00235.mov";
        logImportSuccess(235, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00235.mov", gradedFileName235);
    } catch (e) {
        logImportError(235, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00235.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess235 && gradedFilePoignees235.exists) {
    try {
        var gradedFootage235 = project.importFile(new ImportOptions(gradedFilePoignees235));
        gradedFootage235.parentFolder = fromGradingFolder;
        gradedFootage235.name = "UNDLM_00235_AVEC_POIGNEES";
        gradingSources[235] = gradedFootage235;
        gradingImportCount++;
        gradedImportSuccess235 = true;
        gradedFileName235 = "UNDLM_00235_AVEC_POIGNEES.mov";
        logImportSuccess(235, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00235_AVEC_POIGNEES.mov", gradedFileName235);
    } catch (e) {
        logImportError(235, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00235_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess235 && gradedFileBis235.exists) {
    try {
        var gradedFootage235 = project.importFile(new ImportOptions(gradedFileBis235));
        gradedFootage235.parentFolder = fromGradingFolder;
        gradedFootage235.name = "UNDLM_00235bis";
        gradingSources[235] = gradedFootage235;
        gradingImportCount++;
        gradedImportSuccess235 = true;
        gradedFileName235 = "UNDLM_00235bis.mov";
        logImportSuccess(235, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00235bis.mov", gradedFileName235);
    } catch (e) {
        logImportError(235, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00235bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess235) {
    missingGradingCount++;
}

// Import plan GRADED 00236
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile236 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00236.mov");
var gradedFilePoignees236 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00236_AVEC_POIGNEES.mov");
var gradedFileBis236 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00236bis.mov");

var gradedImportSuccess236 = false;
var gradedFileName236 = "";

// Tenter import standard
if (gradedFile236.exists) {
    try {
        var gradedFootage236 = project.importFile(new ImportOptions(gradedFile236));
        gradedFootage236.parentFolder = fromGradingFolder;
        gradedFootage236.name = "UNDLM_00236";
        gradingSources[236] = gradedFootage236;
        gradingImportCount++;
        gradedImportSuccess236 = true;
        gradedFileName236 = "UNDLM_00236.mov";
        logImportSuccess(236, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00236.mov", gradedFileName236);
    } catch (e) {
        logImportError(236, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00236.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess236 && gradedFilePoignees236.exists) {
    try {
        var gradedFootage236 = project.importFile(new ImportOptions(gradedFilePoignees236));
        gradedFootage236.parentFolder = fromGradingFolder;
        gradedFootage236.name = "UNDLM_00236_AVEC_POIGNEES";
        gradingSources[236] = gradedFootage236;
        gradingImportCount++;
        gradedImportSuccess236 = true;
        gradedFileName236 = "UNDLM_00236_AVEC_POIGNEES.mov";
        logImportSuccess(236, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00236_AVEC_POIGNEES.mov", gradedFileName236);
    } catch (e) {
        logImportError(236, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00236_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess236 && gradedFileBis236.exists) {
    try {
        var gradedFootage236 = project.importFile(new ImportOptions(gradedFileBis236));
        gradedFootage236.parentFolder = fromGradingFolder;
        gradedFootage236.name = "UNDLM_00236bis";
        gradingSources[236] = gradedFootage236;
        gradingImportCount++;
        gradedImportSuccess236 = true;
        gradedFileName236 = "UNDLM_00236bis.mov";
        logImportSuccess(236, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00236bis.mov", gradedFileName236);
    } catch (e) {
        logImportError(236, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00236bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess236) {
    missingGradingCount++;
}

// Import plan GRADED 00237
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile237 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00237.mov");
var gradedFilePoignees237 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00237_AVEC_POIGNEES.mov");
var gradedFileBis237 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00237bis.mov");

var gradedImportSuccess237 = false;
var gradedFileName237 = "";

// Tenter import standard
if (gradedFile237.exists) {
    try {
        var gradedFootage237 = project.importFile(new ImportOptions(gradedFile237));
        gradedFootage237.parentFolder = fromGradingFolder;
        gradedFootage237.name = "UNDLM_00237";
        gradingSources[237] = gradedFootage237;
        gradingImportCount++;
        gradedImportSuccess237 = true;
        gradedFileName237 = "UNDLM_00237.mov";
        logImportSuccess(237, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00237.mov", gradedFileName237);
    } catch (e) {
        logImportError(237, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00237.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess237 && gradedFilePoignees237.exists) {
    try {
        var gradedFootage237 = project.importFile(new ImportOptions(gradedFilePoignees237));
        gradedFootage237.parentFolder = fromGradingFolder;
        gradedFootage237.name = "UNDLM_00237_AVEC_POIGNEES";
        gradingSources[237] = gradedFootage237;
        gradingImportCount++;
        gradedImportSuccess237 = true;
        gradedFileName237 = "UNDLM_00237_AVEC_POIGNEES.mov";
        logImportSuccess(237, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00237_AVEC_POIGNEES.mov", gradedFileName237);
    } catch (e) {
        logImportError(237, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00237_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess237 && gradedFileBis237.exists) {
    try {
        var gradedFootage237 = project.importFile(new ImportOptions(gradedFileBis237));
        gradedFootage237.parentFolder = fromGradingFolder;
        gradedFootage237.name = "UNDLM_00237bis";
        gradingSources[237] = gradedFootage237;
        gradingImportCount++;
        gradedImportSuccess237 = true;
        gradedFileName237 = "UNDLM_00237bis.mov";
        logImportSuccess(237, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00237bis.mov", gradedFileName237);
    } catch (e) {
        logImportError(237, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00237bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess237) {
    missingGradingCount++;
}

// Import plan GRADED 00238
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile238 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00238.mov");
var gradedFilePoignees238 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00238_AVEC_POIGNEES.mov");
var gradedFileBis238 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00238bis.mov");

var gradedImportSuccess238 = false;
var gradedFileName238 = "";

// Tenter import standard
if (gradedFile238.exists) {
    try {
        var gradedFootage238 = project.importFile(new ImportOptions(gradedFile238));
        gradedFootage238.parentFolder = fromGradingFolder;
        gradedFootage238.name = "UNDLM_00238";
        gradingSources[238] = gradedFootage238;
        gradingImportCount++;
        gradedImportSuccess238 = true;
        gradedFileName238 = "UNDLM_00238.mov";
        logImportSuccess(238, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00238.mov", gradedFileName238);
    } catch (e) {
        logImportError(238, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00238.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess238 && gradedFilePoignees238.exists) {
    try {
        var gradedFootage238 = project.importFile(new ImportOptions(gradedFilePoignees238));
        gradedFootage238.parentFolder = fromGradingFolder;
        gradedFootage238.name = "UNDLM_00238_AVEC_POIGNEES";
        gradingSources[238] = gradedFootage238;
        gradingImportCount++;
        gradedImportSuccess238 = true;
        gradedFileName238 = "UNDLM_00238_AVEC_POIGNEES.mov";
        logImportSuccess(238, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00238_AVEC_POIGNEES.mov", gradedFileName238);
    } catch (e) {
        logImportError(238, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00238_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess238 && gradedFileBis238.exists) {
    try {
        var gradedFootage238 = project.importFile(new ImportOptions(gradedFileBis238));
        gradedFootage238.parentFolder = fromGradingFolder;
        gradedFootage238.name = "UNDLM_00238bis";
        gradingSources[238] = gradedFootage238;
        gradingImportCount++;
        gradedImportSuccess238 = true;
        gradedFileName238 = "UNDLM_00238bis.mov";
        logImportSuccess(238, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00238bis.mov", gradedFileName238);
    } catch (e) {
        logImportError(238, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00238bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess238) {
    missingGradingCount++;
}

// Import plan GRADED 00239
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile239 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00239.mov");
var gradedFilePoignees239 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00239_AVEC_POIGNEES.mov");
var gradedFileBis239 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00239bis.mov");

var gradedImportSuccess239 = false;
var gradedFileName239 = "";

// Tenter import standard
if (gradedFile239.exists) {
    try {
        var gradedFootage239 = project.importFile(new ImportOptions(gradedFile239));
        gradedFootage239.parentFolder = fromGradingFolder;
        gradedFootage239.name = "UNDLM_00239";
        gradingSources[239] = gradedFootage239;
        gradingImportCount++;
        gradedImportSuccess239 = true;
        gradedFileName239 = "UNDLM_00239.mov";
        logImportSuccess(239, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00239.mov", gradedFileName239);
    } catch (e) {
        logImportError(239, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00239.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess239 && gradedFilePoignees239.exists) {
    try {
        var gradedFootage239 = project.importFile(new ImportOptions(gradedFilePoignees239));
        gradedFootage239.parentFolder = fromGradingFolder;
        gradedFootage239.name = "UNDLM_00239_AVEC_POIGNEES";
        gradingSources[239] = gradedFootage239;
        gradingImportCount++;
        gradedImportSuccess239 = true;
        gradedFileName239 = "UNDLM_00239_AVEC_POIGNEES.mov";
        logImportSuccess(239, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00239_AVEC_POIGNEES.mov", gradedFileName239);
    } catch (e) {
        logImportError(239, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00239_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess239 && gradedFileBis239.exists) {
    try {
        var gradedFootage239 = project.importFile(new ImportOptions(gradedFileBis239));
        gradedFootage239.parentFolder = fromGradingFolder;
        gradedFootage239.name = "UNDLM_00239bis";
        gradingSources[239] = gradedFootage239;
        gradingImportCount++;
        gradedImportSuccess239 = true;
        gradedFileName239 = "UNDLM_00239bis.mov";
        logImportSuccess(239, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00239bis.mov", gradedFileName239);
    } catch (e) {
        logImportError(239, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00239bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess239) {
    missingGradingCount++;
}

// Import plan GRADED 00240
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile240 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00240.mov");
var gradedFilePoignees240 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00240_AVEC_POIGNEES.mov");
var gradedFileBis240 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00240bis.mov");

var gradedImportSuccess240 = false;
var gradedFileName240 = "";

// Tenter import standard
if (gradedFile240.exists) {
    try {
        var gradedFootage240 = project.importFile(new ImportOptions(gradedFile240));
        gradedFootage240.parentFolder = fromGradingFolder;
        gradedFootage240.name = "UNDLM_00240";
        gradingSources[240] = gradedFootage240;
        gradingImportCount++;
        gradedImportSuccess240 = true;
        gradedFileName240 = "UNDLM_00240.mov";
        logImportSuccess(240, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00240.mov", gradedFileName240);
    } catch (e) {
        logImportError(240, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00240.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess240 && gradedFilePoignees240.exists) {
    try {
        var gradedFootage240 = project.importFile(new ImportOptions(gradedFilePoignees240));
        gradedFootage240.parentFolder = fromGradingFolder;
        gradedFootage240.name = "UNDLM_00240_AVEC_POIGNEES";
        gradingSources[240] = gradedFootage240;
        gradingImportCount++;
        gradedImportSuccess240 = true;
        gradedFileName240 = "UNDLM_00240_AVEC_POIGNEES.mov";
        logImportSuccess(240, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00240_AVEC_POIGNEES.mov", gradedFileName240);
    } catch (e) {
        logImportError(240, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00240_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess240 && gradedFileBis240.exists) {
    try {
        var gradedFootage240 = project.importFile(new ImportOptions(gradedFileBis240));
        gradedFootage240.parentFolder = fromGradingFolder;
        gradedFootage240.name = "UNDLM_00240bis";
        gradingSources[240] = gradedFootage240;
        gradingImportCount++;
        gradedImportSuccess240 = true;
        gradedFileName240 = "UNDLM_00240bis.mov";
        logImportSuccess(240, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00240bis.mov", gradedFileName240);
    } catch (e) {
        logImportError(240, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00240bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess240) {
    missingGradingCount++;
}

// Import plan GRADED 00242
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile242 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00242.mov");
var gradedFilePoignees242 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00242_AVEC_POIGNEES.mov");
var gradedFileBis242 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00242bis.mov");

var gradedImportSuccess242 = false;
var gradedFileName242 = "";

// Tenter import standard
if (gradedFile242.exists) {
    try {
        var gradedFootage242 = project.importFile(new ImportOptions(gradedFile242));
        gradedFootage242.parentFolder = fromGradingFolder;
        gradedFootage242.name = "UNDLM_00242";
        gradingSources[242] = gradedFootage242;
        gradingImportCount++;
        gradedImportSuccess242 = true;
        gradedFileName242 = "UNDLM_00242.mov";
        logImportSuccess(242, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00242.mov", gradedFileName242);
    } catch (e) {
        logImportError(242, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00242.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess242 && gradedFilePoignees242.exists) {
    try {
        var gradedFootage242 = project.importFile(new ImportOptions(gradedFilePoignees242));
        gradedFootage242.parentFolder = fromGradingFolder;
        gradedFootage242.name = "UNDLM_00242_AVEC_POIGNEES";
        gradingSources[242] = gradedFootage242;
        gradingImportCount++;
        gradedImportSuccess242 = true;
        gradedFileName242 = "UNDLM_00242_AVEC_POIGNEES.mov";
        logImportSuccess(242, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00242_AVEC_POIGNEES.mov", gradedFileName242);
    } catch (e) {
        logImportError(242, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00242_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess242 && gradedFileBis242.exists) {
    try {
        var gradedFootage242 = project.importFile(new ImportOptions(gradedFileBis242));
        gradedFootage242.parentFolder = fromGradingFolder;
        gradedFootage242.name = "UNDLM_00242bis";
        gradingSources[242] = gradedFootage242;
        gradingImportCount++;
        gradedImportSuccess242 = true;
        gradedFileName242 = "UNDLM_00242bis.mov";
        logImportSuccess(242, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00242bis.mov", gradedFileName242);
    } catch (e) {
        logImportError(242, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00242bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess242) {
    missingGradingCount++;
}

// Import plan GRADED 00243
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile243 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00243.mov");
var gradedFilePoignees243 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00243_AVEC_POIGNEES.mov");
var gradedFileBis243 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00243bis.mov");

var gradedImportSuccess243 = false;
var gradedFileName243 = "";

// Tenter import standard
if (gradedFile243.exists) {
    try {
        var gradedFootage243 = project.importFile(new ImportOptions(gradedFile243));
        gradedFootage243.parentFolder = fromGradingFolder;
        gradedFootage243.name = "UNDLM_00243";
        gradingSources[243] = gradedFootage243;
        gradingImportCount++;
        gradedImportSuccess243 = true;
        gradedFileName243 = "UNDLM_00243.mov";
        logImportSuccess(243, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00243.mov", gradedFileName243);
    } catch (e) {
        logImportError(243, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00243.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess243 && gradedFilePoignees243.exists) {
    try {
        var gradedFootage243 = project.importFile(new ImportOptions(gradedFilePoignees243));
        gradedFootage243.parentFolder = fromGradingFolder;
        gradedFootage243.name = "UNDLM_00243_AVEC_POIGNEES";
        gradingSources[243] = gradedFootage243;
        gradingImportCount++;
        gradedImportSuccess243 = true;
        gradedFileName243 = "UNDLM_00243_AVEC_POIGNEES.mov";
        logImportSuccess(243, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00243_AVEC_POIGNEES.mov", gradedFileName243);
    } catch (e) {
        logImportError(243, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00243_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess243 && gradedFileBis243.exists) {
    try {
        var gradedFootage243 = project.importFile(new ImportOptions(gradedFileBis243));
        gradedFootage243.parentFolder = fromGradingFolder;
        gradedFootage243.name = "UNDLM_00243bis";
        gradingSources[243] = gradedFootage243;
        gradingImportCount++;
        gradedImportSuccess243 = true;
        gradedFileName243 = "UNDLM_00243bis.mov";
        logImportSuccess(243, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00243bis.mov", gradedFileName243);
    } catch (e) {
        logImportError(243, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00243bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess243) {
    missingGradingCount++;
}

// Import plan GRADED 00244
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile244 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00244.mov");
var gradedFilePoignees244 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00244_AVEC_POIGNEES.mov");
var gradedFileBis244 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00244bis.mov");

var gradedImportSuccess244 = false;
var gradedFileName244 = "";

// Tenter import standard
if (gradedFile244.exists) {
    try {
        var gradedFootage244 = project.importFile(new ImportOptions(gradedFile244));
        gradedFootage244.parentFolder = fromGradingFolder;
        gradedFootage244.name = "UNDLM_00244";
        gradingSources[244] = gradedFootage244;
        gradingImportCount++;
        gradedImportSuccess244 = true;
        gradedFileName244 = "UNDLM_00244.mov";
        logImportSuccess(244, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00244.mov", gradedFileName244);
    } catch (e) {
        logImportError(244, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00244.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess244 && gradedFilePoignees244.exists) {
    try {
        var gradedFootage244 = project.importFile(new ImportOptions(gradedFilePoignees244));
        gradedFootage244.parentFolder = fromGradingFolder;
        gradedFootage244.name = "UNDLM_00244_AVEC_POIGNEES";
        gradingSources[244] = gradedFootage244;
        gradingImportCount++;
        gradedImportSuccess244 = true;
        gradedFileName244 = "UNDLM_00244_AVEC_POIGNEES.mov";
        logImportSuccess(244, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00244_AVEC_POIGNEES.mov", gradedFileName244);
    } catch (e) {
        logImportError(244, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00244_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess244 && gradedFileBis244.exists) {
    try {
        var gradedFootage244 = project.importFile(new ImportOptions(gradedFileBis244));
        gradedFootage244.parentFolder = fromGradingFolder;
        gradedFootage244.name = "UNDLM_00244bis";
        gradingSources[244] = gradedFootage244;
        gradingImportCount++;
        gradedImportSuccess244 = true;
        gradedFileName244 = "UNDLM_00244bis.mov";
        logImportSuccess(244, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00244bis.mov", gradedFileName244);
    } catch (e) {
        logImportError(244, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00244bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess244) {
    missingGradingCount++;
}

// Import plan GRADED 00245
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile245 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00245.mov");
var gradedFilePoignees245 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00245_AVEC_POIGNEES.mov");
var gradedFileBis245 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00245bis.mov");

var gradedImportSuccess245 = false;
var gradedFileName245 = "";

// Tenter import standard
if (gradedFile245.exists) {
    try {
        var gradedFootage245 = project.importFile(new ImportOptions(gradedFile245));
        gradedFootage245.parentFolder = fromGradingFolder;
        gradedFootage245.name = "UNDLM_00245";
        gradingSources[245] = gradedFootage245;
        gradingImportCount++;
        gradedImportSuccess245 = true;
        gradedFileName245 = "UNDLM_00245.mov";
        logImportSuccess(245, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00245.mov", gradedFileName245);
    } catch (e) {
        logImportError(245, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00245.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess245 && gradedFilePoignees245.exists) {
    try {
        var gradedFootage245 = project.importFile(new ImportOptions(gradedFilePoignees245));
        gradedFootage245.parentFolder = fromGradingFolder;
        gradedFootage245.name = "UNDLM_00245_AVEC_POIGNEES";
        gradingSources[245] = gradedFootage245;
        gradingImportCount++;
        gradedImportSuccess245 = true;
        gradedFileName245 = "UNDLM_00245_AVEC_POIGNEES.mov";
        logImportSuccess(245, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00245_AVEC_POIGNEES.mov", gradedFileName245);
    } catch (e) {
        logImportError(245, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00245_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess245 && gradedFileBis245.exists) {
    try {
        var gradedFootage245 = project.importFile(new ImportOptions(gradedFileBis245));
        gradedFootage245.parentFolder = fromGradingFolder;
        gradedFootage245.name = "UNDLM_00245bis";
        gradingSources[245] = gradedFootage245;
        gradingImportCount++;
        gradedImportSuccess245 = true;
        gradedFileName245 = "UNDLM_00245bis.mov";
        logImportSuccess(245, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00245bis.mov", gradedFileName245);
    } catch (e) {
        logImportError(245, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00245bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess245) {
    missingGradingCount++;
}

// Import plan GRADED 00246
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile246 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00246.mov");
var gradedFilePoignees246 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00246_AVEC_POIGNEES.mov");
var gradedFileBis246 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00246bis.mov");

var gradedImportSuccess246 = false;
var gradedFileName246 = "";

// Tenter import standard
if (gradedFile246.exists) {
    try {
        var gradedFootage246 = project.importFile(new ImportOptions(gradedFile246));
        gradedFootage246.parentFolder = fromGradingFolder;
        gradedFootage246.name = "UNDLM_00246";
        gradingSources[246] = gradedFootage246;
        gradingImportCount++;
        gradedImportSuccess246 = true;
        gradedFileName246 = "UNDLM_00246.mov";
        logImportSuccess(246, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00246.mov", gradedFileName246);
    } catch (e) {
        logImportError(246, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00246.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess246 && gradedFilePoignees246.exists) {
    try {
        var gradedFootage246 = project.importFile(new ImportOptions(gradedFilePoignees246));
        gradedFootage246.parentFolder = fromGradingFolder;
        gradedFootage246.name = "UNDLM_00246_AVEC_POIGNEES";
        gradingSources[246] = gradedFootage246;
        gradingImportCount++;
        gradedImportSuccess246 = true;
        gradedFileName246 = "UNDLM_00246_AVEC_POIGNEES.mov";
        logImportSuccess(246, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00246_AVEC_POIGNEES.mov", gradedFileName246);
    } catch (e) {
        logImportError(246, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00246_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess246 && gradedFileBis246.exists) {
    try {
        var gradedFootage246 = project.importFile(new ImportOptions(gradedFileBis246));
        gradedFootage246.parentFolder = fromGradingFolder;
        gradedFootage246.name = "UNDLM_00246bis";
        gradingSources[246] = gradedFootage246;
        gradingImportCount++;
        gradedImportSuccess246 = true;
        gradedFileName246 = "UNDLM_00246bis.mov";
        logImportSuccess(246, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00246bis.mov", gradedFileName246);
    } catch (e) {
        logImportError(246, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00246bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess246) {
    missingGradingCount++;
}

// Import plan GRADED 00247
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile247 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00247.mov");
var gradedFilePoignees247 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00247_AVEC_POIGNEES.mov");
var gradedFileBis247 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00247bis.mov");

var gradedImportSuccess247 = false;
var gradedFileName247 = "";

// Tenter import standard
if (gradedFile247.exists) {
    try {
        var gradedFootage247 = project.importFile(new ImportOptions(gradedFile247));
        gradedFootage247.parentFolder = fromGradingFolder;
        gradedFootage247.name = "UNDLM_00247";
        gradingSources[247] = gradedFootage247;
        gradingImportCount++;
        gradedImportSuccess247 = true;
        gradedFileName247 = "UNDLM_00247.mov";
        logImportSuccess(247, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00247.mov", gradedFileName247);
    } catch (e) {
        logImportError(247, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00247.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess247 && gradedFilePoignees247.exists) {
    try {
        var gradedFootage247 = project.importFile(new ImportOptions(gradedFilePoignees247));
        gradedFootage247.parentFolder = fromGradingFolder;
        gradedFootage247.name = "UNDLM_00247_AVEC_POIGNEES";
        gradingSources[247] = gradedFootage247;
        gradingImportCount++;
        gradedImportSuccess247 = true;
        gradedFileName247 = "UNDLM_00247_AVEC_POIGNEES.mov";
        logImportSuccess(247, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00247_AVEC_POIGNEES.mov", gradedFileName247);
    } catch (e) {
        logImportError(247, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00247_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess247 && gradedFileBis247.exists) {
    try {
        var gradedFootage247 = project.importFile(new ImportOptions(gradedFileBis247));
        gradedFootage247.parentFolder = fromGradingFolder;
        gradedFootage247.name = "UNDLM_00247bis";
        gradingSources[247] = gradedFootage247;
        gradingImportCount++;
        gradedImportSuccess247 = true;
        gradedFileName247 = "UNDLM_00247bis.mov";
        logImportSuccess(247, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00247bis.mov", gradedFileName247);
    } catch (e) {
        logImportError(247, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00247bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess247) {
    missingGradingCount++;
}

// Import plan GRADED 00248
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile248 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00248.mov");
var gradedFilePoignees248 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00248_AVEC_POIGNEES.mov");
var gradedFileBis248 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00248bis.mov");

var gradedImportSuccess248 = false;
var gradedFileName248 = "";

// Tenter import standard
if (gradedFile248.exists) {
    try {
        var gradedFootage248 = project.importFile(new ImportOptions(gradedFile248));
        gradedFootage248.parentFolder = fromGradingFolder;
        gradedFootage248.name = "UNDLM_00248";
        gradingSources[248] = gradedFootage248;
        gradingImportCount++;
        gradedImportSuccess248 = true;
        gradedFileName248 = "UNDLM_00248.mov";
        logImportSuccess(248, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00248.mov", gradedFileName248);
    } catch (e) {
        logImportError(248, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00248.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess248 && gradedFilePoignees248.exists) {
    try {
        var gradedFootage248 = project.importFile(new ImportOptions(gradedFilePoignees248));
        gradedFootage248.parentFolder = fromGradingFolder;
        gradedFootage248.name = "UNDLM_00248_AVEC_POIGNEES";
        gradingSources[248] = gradedFootage248;
        gradingImportCount++;
        gradedImportSuccess248 = true;
        gradedFileName248 = "UNDLM_00248_AVEC_POIGNEES.mov";
        logImportSuccess(248, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00248_AVEC_POIGNEES.mov", gradedFileName248);
    } catch (e) {
        logImportError(248, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00248_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess248 && gradedFileBis248.exists) {
    try {
        var gradedFootage248 = project.importFile(new ImportOptions(gradedFileBis248));
        gradedFootage248.parentFolder = fromGradingFolder;
        gradedFootage248.name = "UNDLM_00248bis";
        gradingSources[248] = gradedFootage248;
        gradingImportCount++;
        gradedImportSuccess248 = true;
        gradedFileName248 = "UNDLM_00248bis.mov";
        logImportSuccess(248, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00248bis.mov", gradedFileName248);
    } catch (e) {
        logImportError(248, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00248bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess248) {
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


// Composition pour plan 00234
var planComp234 = project.items.addComp(
    "SQ13_UNDLM_00234_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    17.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp234.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer234 = planComp234.layers.add(bgSolidComp);
bgLayer234.name = "BG_SOLID";
bgLayer234.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer234 = false;
if (gradingSources[234]) {
    var gradedLayer234 = planComp234.layers.add(gradingSources[234]);
    gradedLayer234.name = "UNDLM_00234_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer234.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer234.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer234 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer234 = false;
if (editSources[234]) {
    var editLayer234 = planComp234.layers.add(editSources[234]);
    editLayer234.name = "UNDLM_00234_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer234.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer234.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer234 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity234 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer234) {
    // EDIT toujours activé quand disponible
    editLayer234.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer234) {
        gradedLayer234.enabled = false;
    }
} else if (hasGradedLayer234) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer234.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText234 = planComp234.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText234.name = "WARNING_NO_EDIT";
    warningText234.property("Transform").property("Position").setValue([1280, 200]);
    warningText234.guideLayer = true;
    
    var warningTextDoc234 = warningText234.property("Source Text").value;
    warningTextDoc234.fontSize = 32;
    warningTextDoc234.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc234.font = "Arial-BoldMT";
    warningTextDoc234.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText234.property("Source Text").setValue(warningTextDoc234);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText234 = planComp234.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00234");
    errorText234.name = "ERROR_NO_SOURCE";
    errorText234.property("Transform").property("Position").setValue([1280, 720]);
    errorText234.guideLayer = true;
    
    var errorTextDoc234 = errorText234.property("Source Text").value;
    errorTextDoc234.fontSize = 48;
    errorTextDoc234.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc234.font = "Arial-BoldMT";
    errorTextDoc234.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText234.property("Source Text").setValue(errorTextDoc234);
}

planCompositions[234] = planComp234;


// Composition pour plan 00235
var planComp235 = project.items.addComp(
    "SQ13_UNDLM_00235_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp235.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer235 = planComp235.layers.add(bgSolidComp);
bgLayer235.name = "BG_SOLID";
bgLayer235.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer235 = false;
if (gradingSources[235]) {
    var gradedLayer235 = planComp235.layers.add(gradingSources[235]);
    gradedLayer235.name = "UNDLM_00235_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer235.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer235.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer235 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer235 = false;
if (editSources[235]) {
    var editLayer235 = planComp235.layers.add(editSources[235]);
    editLayer235.name = "UNDLM_00235_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer235.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer235.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer235 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity235 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer235) {
    // EDIT toujours activé quand disponible
    editLayer235.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer235) {
        gradedLayer235.enabled = false;
    }
} else if (hasGradedLayer235) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer235.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText235 = planComp235.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText235.name = "WARNING_NO_EDIT";
    warningText235.property("Transform").property("Position").setValue([1280, 200]);
    warningText235.guideLayer = true;
    
    var warningTextDoc235 = warningText235.property("Source Text").value;
    warningTextDoc235.fontSize = 32;
    warningTextDoc235.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc235.font = "Arial-BoldMT";
    warningTextDoc235.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText235.property("Source Text").setValue(warningTextDoc235);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText235 = planComp235.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00235");
    errorText235.name = "ERROR_NO_SOURCE";
    errorText235.property("Transform").property("Position").setValue([1280, 720]);
    errorText235.guideLayer = true;
    
    var errorTextDoc235 = errorText235.property("Source Text").value;
    errorTextDoc235.fontSize = 48;
    errorTextDoc235.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc235.font = "Arial-BoldMT";
    errorTextDoc235.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText235.property("Source Text").setValue(errorTextDoc235);
}

planCompositions[235] = planComp235;


// Composition pour plan 00236
var planComp236 = project.items.addComp(
    "SQ13_UNDLM_00236_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp236.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer236 = planComp236.layers.add(bgSolidComp);
bgLayer236.name = "BG_SOLID";
bgLayer236.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer236 = false;
if (gradingSources[236]) {
    var gradedLayer236 = planComp236.layers.add(gradingSources[236]);
    gradedLayer236.name = "UNDLM_00236_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer236.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer236.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer236 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer236 = false;
if (editSources[236]) {
    var editLayer236 = planComp236.layers.add(editSources[236]);
    editLayer236.name = "UNDLM_00236_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer236.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer236.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer236 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity236 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer236) {
    // EDIT toujours activé quand disponible
    editLayer236.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer236) {
        gradedLayer236.enabled = false;
    }
} else if (hasGradedLayer236) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer236.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText236 = planComp236.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText236.name = "WARNING_NO_EDIT";
    warningText236.property("Transform").property("Position").setValue([1280, 200]);
    warningText236.guideLayer = true;
    
    var warningTextDoc236 = warningText236.property("Source Text").value;
    warningTextDoc236.fontSize = 32;
    warningTextDoc236.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc236.font = "Arial-BoldMT";
    warningTextDoc236.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText236.property("Source Text").setValue(warningTextDoc236);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText236 = planComp236.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00236");
    errorText236.name = "ERROR_NO_SOURCE";
    errorText236.property("Transform").property("Position").setValue([1280, 720]);
    errorText236.guideLayer = true;
    
    var errorTextDoc236 = errorText236.property("Source Text").value;
    errorTextDoc236.fontSize = 48;
    errorTextDoc236.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc236.font = "Arial-BoldMT";
    errorTextDoc236.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText236.property("Source Text").setValue(errorTextDoc236);
}

planCompositions[236] = planComp236;


// Composition pour plan 00237
var planComp237 = project.items.addComp(
    "SQ13_UNDLM_00237_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp237.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer237 = planComp237.layers.add(bgSolidComp);
bgLayer237.name = "BG_SOLID";
bgLayer237.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer237 = false;
if (gradingSources[237]) {
    var gradedLayer237 = planComp237.layers.add(gradingSources[237]);
    gradedLayer237.name = "UNDLM_00237_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer237.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer237.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer237 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer237 = false;
if (editSources[237]) {
    var editLayer237 = planComp237.layers.add(editSources[237]);
    editLayer237.name = "UNDLM_00237_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer237.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer237.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer237 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity237 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer237) {
    // EDIT toujours activé quand disponible
    editLayer237.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer237) {
        gradedLayer237.enabled = false;
    }
} else if (hasGradedLayer237) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer237.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText237 = planComp237.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText237.name = "WARNING_NO_EDIT";
    warningText237.property("Transform").property("Position").setValue([1280, 200]);
    warningText237.guideLayer = true;
    
    var warningTextDoc237 = warningText237.property("Source Text").value;
    warningTextDoc237.fontSize = 32;
    warningTextDoc237.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc237.font = "Arial-BoldMT";
    warningTextDoc237.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText237.property("Source Text").setValue(warningTextDoc237);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText237 = planComp237.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00237");
    errorText237.name = "ERROR_NO_SOURCE";
    errorText237.property("Transform").property("Position").setValue([1280, 720]);
    errorText237.guideLayer = true;
    
    var errorTextDoc237 = errorText237.property("Source Text").value;
    errorTextDoc237.fontSize = 48;
    errorTextDoc237.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc237.font = "Arial-BoldMT";
    errorTextDoc237.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText237.property("Source Text").setValue(errorTextDoc237);
}

planCompositions[237] = planComp237;


// Composition pour plan 00238
var planComp238 = project.items.addComp(
    "SQ13_UNDLM_00238_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp238.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer238 = planComp238.layers.add(bgSolidComp);
bgLayer238.name = "BG_SOLID";
bgLayer238.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer238 = false;
if (gradingSources[238]) {
    var gradedLayer238 = planComp238.layers.add(gradingSources[238]);
    gradedLayer238.name = "UNDLM_00238_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer238.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer238.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer238 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer238 = false;
if (editSources[238]) {
    var editLayer238 = planComp238.layers.add(editSources[238]);
    editLayer238.name = "UNDLM_00238_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer238.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer238.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer238 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity238 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer238) {
    // EDIT toujours activé quand disponible
    editLayer238.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer238) {
        gradedLayer238.enabled = false;
    }
} else if (hasGradedLayer238) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer238.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText238 = planComp238.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText238.name = "WARNING_NO_EDIT";
    warningText238.property("Transform").property("Position").setValue([1280, 200]);
    warningText238.guideLayer = true;
    
    var warningTextDoc238 = warningText238.property("Source Text").value;
    warningTextDoc238.fontSize = 32;
    warningTextDoc238.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc238.font = "Arial-BoldMT";
    warningTextDoc238.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText238.property("Source Text").setValue(warningTextDoc238);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText238 = planComp238.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00238");
    errorText238.name = "ERROR_NO_SOURCE";
    errorText238.property("Transform").property("Position").setValue([1280, 720]);
    errorText238.guideLayer = true;
    
    var errorTextDoc238 = errorText238.property("Source Text").value;
    errorTextDoc238.fontSize = 48;
    errorTextDoc238.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc238.font = "Arial-BoldMT";
    errorTextDoc238.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText238.property("Source Text").setValue(errorTextDoc238);
}

planCompositions[238] = planComp238;


// Composition pour plan 00239
var planComp239 = project.items.addComp(
    "SQ13_UNDLM_00239_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp239.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer239 = planComp239.layers.add(bgSolidComp);
bgLayer239.name = "BG_SOLID";
bgLayer239.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer239 = false;
if (gradingSources[239]) {
    var gradedLayer239 = planComp239.layers.add(gradingSources[239]);
    gradedLayer239.name = "UNDLM_00239_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer239.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer239.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer239 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer239 = false;
if (editSources[239]) {
    var editLayer239 = planComp239.layers.add(editSources[239]);
    editLayer239.name = "UNDLM_00239_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer239.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer239.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer239 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity239 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer239) {
    // EDIT toujours activé quand disponible
    editLayer239.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer239) {
        gradedLayer239.enabled = false;
    }
} else if (hasGradedLayer239) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer239.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText239 = planComp239.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText239.name = "WARNING_NO_EDIT";
    warningText239.property("Transform").property("Position").setValue([1280, 200]);
    warningText239.guideLayer = true;
    
    var warningTextDoc239 = warningText239.property("Source Text").value;
    warningTextDoc239.fontSize = 32;
    warningTextDoc239.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc239.font = "Arial-BoldMT";
    warningTextDoc239.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText239.property("Source Text").setValue(warningTextDoc239);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText239 = planComp239.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00239");
    errorText239.name = "ERROR_NO_SOURCE";
    errorText239.property("Transform").property("Position").setValue([1280, 720]);
    errorText239.guideLayer = true;
    
    var errorTextDoc239 = errorText239.property("Source Text").value;
    errorTextDoc239.fontSize = 48;
    errorTextDoc239.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc239.font = "Arial-BoldMT";
    errorTextDoc239.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText239.property("Source Text").setValue(errorTextDoc239);
}

planCompositions[239] = planComp239;


// Composition pour plan 00240
var planComp240 = project.items.addComp(
    "SQ13_UNDLM_00240_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp240.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer240 = planComp240.layers.add(bgSolidComp);
bgLayer240.name = "BG_SOLID";
bgLayer240.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer240 = false;
if (gradingSources[240]) {
    var gradedLayer240 = planComp240.layers.add(gradingSources[240]);
    gradedLayer240.name = "UNDLM_00240_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer240.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer240.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer240 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer240 = false;
if (editSources[240]) {
    var editLayer240 = planComp240.layers.add(editSources[240]);
    editLayer240.name = "UNDLM_00240_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer240.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer240.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer240 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity240 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer240) {
    // EDIT toujours activé quand disponible
    editLayer240.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer240) {
        gradedLayer240.enabled = false;
    }
} else if (hasGradedLayer240) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer240.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText240 = planComp240.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText240.name = "WARNING_NO_EDIT";
    warningText240.property("Transform").property("Position").setValue([1280, 200]);
    warningText240.guideLayer = true;
    
    var warningTextDoc240 = warningText240.property("Source Text").value;
    warningTextDoc240.fontSize = 32;
    warningTextDoc240.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc240.font = "Arial-BoldMT";
    warningTextDoc240.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText240.property("Source Text").setValue(warningTextDoc240);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText240 = planComp240.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00240");
    errorText240.name = "ERROR_NO_SOURCE";
    errorText240.property("Transform").property("Position").setValue([1280, 720]);
    errorText240.guideLayer = true;
    
    var errorTextDoc240 = errorText240.property("Source Text").value;
    errorTextDoc240.fontSize = 48;
    errorTextDoc240.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc240.font = "Arial-BoldMT";
    errorTextDoc240.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText240.property("Source Text").setValue(errorTextDoc240);
}

planCompositions[240] = planComp240;


// Composition pour plan 00242
var planComp242 = project.items.addComp(
    "SQ13_UNDLM_00242_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp242.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer242 = planComp242.layers.add(bgSolidComp);
bgLayer242.name = "BG_SOLID";
bgLayer242.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer242 = false;
if (gradingSources[242]) {
    var gradedLayer242 = planComp242.layers.add(gradingSources[242]);
    gradedLayer242.name = "UNDLM_00242_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer242.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer242.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer242 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer242 = false;
if (editSources[242]) {
    var editLayer242 = planComp242.layers.add(editSources[242]);
    editLayer242.name = "UNDLM_00242_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer242.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer242.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer242 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity242 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer242) {
    // EDIT toujours activé quand disponible
    editLayer242.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer242) {
        gradedLayer242.enabled = false;
    }
} else if (hasGradedLayer242) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer242.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText242 = planComp242.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText242.name = "WARNING_NO_EDIT";
    warningText242.property("Transform").property("Position").setValue([1280, 200]);
    warningText242.guideLayer = true;
    
    var warningTextDoc242 = warningText242.property("Source Text").value;
    warningTextDoc242.fontSize = 32;
    warningTextDoc242.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc242.font = "Arial-BoldMT";
    warningTextDoc242.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText242.property("Source Text").setValue(warningTextDoc242);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText242 = planComp242.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00242");
    errorText242.name = "ERROR_NO_SOURCE";
    errorText242.property("Transform").property("Position").setValue([1280, 720]);
    errorText242.guideLayer = true;
    
    var errorTextDoc242 = errorText242.property("Source Text").value;
    errorTextDoc242.fontSize = 48;
    errorTextDoc242.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc242.font = "Arial-BoldMT";
    errorTextDoc242.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText242.property("Source Text").setValue(errorTextDoc242);
}

planCompositions[242] = planComp242;


// Composition pour plan 00243
var planComp243 = project.items.addComp(
    "SQ13_UNDLM_00243_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.6800000000000002,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp243.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer243 = planComp243.layers.add(bgSolidComp);
bgLayer243.name = "BG_SOLID";
bgLayer243.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer243 = false;
if (gradingSources[243]) {
    var gradedLayer243 = planComp243.layers.add(gradingSources[243]);
    gradedLayer243.name = "UNDLM_00243_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer243.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer243.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer243 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer243 = false;
if (editSources[243]) {
    var editLayer243 = planComp243.layers.add(editSources[243]);
    editLayer243.name = "UNDLM_00243_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer243.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer243.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer243 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity243 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer243) {
    // EDIT toujours activé quand disponible
    editLayer243.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer243) {
        gradedLayer243.enabled = false;
    }
} else if (hasGradedLayer243) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer243.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText243 = planComp243.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText243.name = "WARNING_NO_EDIT";
    warningText243.property("Transform").property("Position").setValue([1280, 200]);
    warningText243.guideLayer = true;
    
    var warningTextDoc243 = warningText243.property("Source Text").value;
    warningTextDoc243.fontSize = 32;
    warningTextDoc243.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc243.font = "Arial-BoldMT";
    warningTextDoc243.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText243.property("Source Text").setValue(warningTextDoc243);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText243 = planComp243.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00243");
    errorText243.name = "ERROR_NO_SOURCE";
    errorText243.property("Transform").property("Position").setValue([1280, 720]);
    errorText243.guideLayer = true;
    
    var errorTextDoc243 = errorText243.property("Source Text").value;
    errorTextDoc243.fontSize = 48;
    errorTextDoc243.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc243.font = "Arial-BoldMT";
    errorTextDoc243.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText243.property("Source Text").setValue(errorTextDoc243);
}

planCompositions[243] = planComp243;


// Composition pour plan 00244
var planComp244 = project.items.addComp(
    "SQ13_UNDLM_00244_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp244.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer244 = planComp244.layers.add(bgSolidComp);
bgLayer244.name = "BG_SOLID";
bgLayer244.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer244 = false;
if (gradingSources[244]) {
    var gradedLayer244 = planComp244.layers.add(gradingSources[244]);
    gradedLayer244.name = "UNDLM_00244_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer244.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer244.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer244 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer244 = false;
if (editSources[244]) {
    var editLayer244 = planComp244.layers.add(editSources[244]);
    editLayer244.name = "UNDLM_00244_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer244.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer244.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer244 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity244 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer244) {
    // EDIT toujours activé quand disponible
    editLayer244.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer244) {
        gradedLayer244.enabled = false;
    }
} else if (hasGradedLayer244) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer244.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText244 = planComp244.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText244.name = "WARNING_NO_EDIT";
    warningText244.property("Transform").property("Position").setValue([1280, 200]);
    warningText244.guideLayer = true;
    
    var warningTextDoc244 = warningText244.property("Source Text").value;
    warningTextDoc244.fontSize = 32;
    warningTextDoc244.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc244.font = "Arial-BoldMT";
    warningTextDoc244.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText244.property("Source Text").setValue(warningTextDoc244);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText244 = planComp244.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00244");
    errorText244.name = "ERROR_NO_SOURCE";
    errorText244.property("Transform").property("Position").setValue([1280, 720]);
    errorText244.guideLayer = true;
    
    var errorTextDoc244 = errorText244.property("Source Text").value;
    errorTextDoc244.fontSize = 48;
    errorTextDoc244.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc244.font = "Arial-BoldMT";
    errorTextDoc244.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText244.property("Source Text").setValue(errorTextDoc244);
}

planCompositions[244] = planComp244;


// Composition pour plan 00245
var planComp245 = project.items.addComp(
    "SQ13_UNDLM_00245_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp245.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer245 = planComp245.layers.add(bgSolidComp);
bgLayer245.name = "BG_SOLID";
bgLayer245.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer245 = false;
if (gradingSources[245]) {
    var gradedLayer245 = planComp245.layers.add(gradingSources[245]);
    gradedLayer245.name = "UNDLM_00245_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer245.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer245.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer245 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer245 = false;
if (editSources[245]) {
    var editLayer245 = planComp245.layers.add(editSources[245]);
    editLayer245.name = "UNDLM_00245_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer245.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer245.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer245 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity245 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer245) {
    // EDIT toujours activé quand disponible
    editLayer245.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer245) {
        gradedLayer245.enabled = false;
    }
} else if (hasGradedLayer245) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer245.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText245 = planComp245.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText245.name = "WARNING_NO_EDIT";
    warningText245.property("Transform").property("Position").setValue([1280, 200]);
    warningText245.guideLayer = true;
    
    var warningTextDoc245 = warningText245.property("Source Text").value;
    warningTextDoc245.fontSize = 32;
    warningTextDoc245.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc245.font = "Arial-BoldMT";
    warningTextDoc245.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText245.property("Source Text").setValue(warningTextDoc245);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText245 = planComp245.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00245");
    errorText245.name = "ERROR_NO_SOURCE";
    errorText245.property("Transform").property("Position").setValue([1280, 720]);
    errorText245.guideLayer = true;
    
    var errorTextDoc245 = errorText245.property("Source Text").value;
    errorTextDoc245.fontSize = 48;
    errorTextDoc245.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc245.font = "Arial-BoldMT";
    errorTextDoc245.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText245.property("Source Text").setValue(errorTextDoc245);
}

planCompositions[245] = planComp245;


// Composition pour plan 00246
var planComp246 = project.items.addComp(
    "SQ13_UNDLM_00246_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp246.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer246 = planComp246.layers.add(bgSolidComp);
bgLayer246.name = "BG_SOLID";
bgLayer246.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer246 = false;
if (gradingSources[246]) {
    var gradedLayer246 = planComp246.layers.add(gradingSources[246]);
    gradedLayer246.name = "UNDLM_00246_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer246.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer246.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer246 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer246 = false;
if (editSources[246]) {
    var editLayer246 = planComp246.layers.add(editSources[246]);
    editLayer246.name = "UNDLM_00246_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer246.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer246.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer246 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity246 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer246) {
    // EDIT toujours activé quand disponible
    editLayer246.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer246) {
        gradedLayer246.enabled = false;
    }
} else if (hasGradedLayer246) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer246.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText246 = planComp246.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText246.name = "WARNING_NO_EDIT";
    warningText246.property("Transform").property("Position").setValue([1280, 200]);
    warningText246.guideLayer = true;
    
    var warningTextDoc246 = warningText246.property("Source Text").value;
    warningTextDoc246.fontSize = 32;
    warningTextDoc246.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc246.font = "Arial-BoldMT";
    warningTextDoc246.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText246.property("Source Text").setValue(warningTextDoc246);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText246 = planComp246.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00246");
    errorText246.name = "ERROR_NO_SOURCE";
    errorText246.property("Transform").property("Position").setValue([1280, 720]);
    errorText246.guideLayer = true;
    
    var errorTextDoc246 = errorText246.property("Source Text").value;
    errorTextDoc246.fontSize = 48;
    errorTextDoc246.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc246.font = "Arial-BoldMT";
    errorTextDoc246.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText246.property("Source Text").setValue(errorTextDoc246);
}

planCompositions[246] = planComp246;


// Composition pour plan 00247
var planComp247 = project.items.addComp(
    "SQ13_UNDLM_00247_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.64,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp247.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer247 = planComp247.layers.add(bgSolidComp);
bgLayer247.name = "BG_SOLID";
bgLayer247.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer247 = false;
if (gradingSources[247]) {
    var gradedLayer247 = planComp247.layers.add(gradingSources[247]);
    gradedLayer247.name = "UNDLM_00247_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer247.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer247.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer247 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer247 = false;
if (editSources[247]) {
    var editLayer247 = planComp247.layers.add(editSources[247]);
    editLayer247.name = "UNDLM_00247_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer247.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer247.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer247 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity247 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer247) {
    // EDIT toujours activé quand disponible
    editLayer247.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer247) {
        gradedLayer247.enabled = false;
    }
} else if (hasGradedLayer247) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer247.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText247 = planComp247.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText247.name = "WARNING_NO_EDIT";
    warningText247.property("Transform").property("Position").setValue([1280, 200]);
    warningText247.guideLayer = true;
    
    var warningTextDoc247 = warningText247.property("Source Text").value;
    warningTextDoc247.fontSize = 32;
    warningTextDoc247.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc247.font = "Arial-BoldMT";
    warningTextDoc247.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText247.property("Source Text").setValue(warningTextDoc247);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText247 = planComp247.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00247");
    errorText247.name = "ERROR_NO_SOURCE";
    errorText247.property("Transform").property("Position").setValue([1280, 720]);
    errorText247.guideLayer = true;
    
    var errorTextDoc247 = errorText247.property("Source Text").value;
    errorTextDoc247.fontSize = 48;
    errorTextDoc247.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc247.font = "Arial-BoldMT";
    errorTextDoc247.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText247.property("Source Text").setValue(errorTextDoc247);
}

planCompositions[247] = planComp247;


// Composition pour plan 00248
var planComp248 = project.items.addComp(
    "SQ13_UNDLM_00248_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp248.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer248 = planComp248.layers.add(bgSolidComp);
bgLayer248.name = "BG_SOLID";
bgLayer248.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer248 = false;
if (gradingSources[248]) {
    var gradedLayer248 = planComp248.layers.add(gradingSources[248]);
    gradedLayer248.name = "UNDLM_00248_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer248.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer248.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer248 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer248 = false;
if (editSources[248]) {
    var editLayer248 = planComp248.layers.add(editSources[248]);
    editLayer248.name = "UNDLM_00248_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer248.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer248.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer248 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity248 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer248) {
    // EDIT toujours activé quand disponible
    editLayer248.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer248) {
        gradedLayer248.enabled = false;
    }
} else if (hasGradedLayer248) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer248.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText248 = planComp248.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText248.name = "WARNING_NO_EDIT";
    warningText248.property("Transform").property("Position").setValue([1280, 200]);
    warningText248.guideLayer = true;
    
    var warningTextDoc248 = warningText248.property("Source Text").value;
    warningTextDoc248.fontSize = 32;
    warningTextDoc248.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc248.font = "Arial-BoldMT";
    warningTextDoc248.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText248.property("Source Text").setValue(warningTextDoc248);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText248 = planComp248.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00248");
    errorText248.name = "ERROR_NO_SOURCE";
    errorText248.property("Transform").property("Position").setValue([1280, 720]);
    errorText248.guideLayer = true;
    
    var errorTextDoc248 = errorText248.property("Source Text").value;
    errorTextDoc248.fontSize = 48;
    errorTextDoc248.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc248.font = "Arial-BoldMT";
    errorTextDoc248.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText248.property("Source Text").setValue(errorTextDoc248);
}

planCompositions[248] = planComp248;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ13_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    60.239999999999995, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00234 à la timeline master
if (planCompositions[234]) {
    var masterLayer234 = masterComp.layers.add(planCompositions[234]);
    masterLayer234.startTime = 0;
    masterLayer234.name = "UNDLM_00234";
    masterLayer234.label = 1; // Couleurs alternées
}

// Ajouter plan 00235 à la timeline master
if (planCompositions[235]) {
    var masterLayer235 = masterComp.layers.add(planCompositions[235]);
    masterLayer235.startTime = 17.68;
    masterLayer235.name = "UNDLM_00235";
    masterLayer235.label = 2; // Couleurs alternées
}

// Ajouter plan 00236 à la timeline master
if (planCompositions[236]) {
    var masterLayer236 = masterComp.layers.add(planCompositions[236]);
    masterLayer236.startTime = 22.56;
    masterLayer236.name = "UNDLM_00236";
    masterLayer236.label = 3; // Couleurs alternées
}

// Ajouter plan 00237 à la timeline master
if (planCompositions[237]) {
    var masterLayer237 = masterComp.layers.add(planCompositions[237]);
    masterLayer237.startTime = 26.24;
    masterLayer237.name = "UNDLM_00237";
    masterLayer237.label = 4; // Couleurs alternées
}

// Ajouter plan 00238 à la timeline master
if (planCompositions[238]) {
    var masterLayer238 = masterComp.layers.add(planCompositions[238]);
    masterLayer238.startTime = 27.72;
    masterLayer238.name = "UNDLM_00238";
    masterLayer238.label = 5; // Couleurs alternées
}

// Ajouter plan 00239 à la timeline master
if (planCompositions[239]) {
    var masterLayer239 = masterComp.layers.add(planCompositions[239]);
    masterLayer239.startTime = 31.84;
    masterLayer239.name = "UNDLM_00239";
    masterLayer239.label = 6; // Couleurs alternées
}

// Ajouter plan 00240 à la timeline master
if (planCompositions[240]) {
    var masterLayer240 = masterComp.layers.add(planCompositions[240]);
    masterLayer240.startTime = 36.64;
    masterLayer240.name = "UNDLM_00240";
    masterLayer240.label = 7; // Couleurs alternées
}

// Ajouter plan 00242 à la timeline master
if (planCompositions[242]) {
    var masterLayer242 = masterComp.layers.add(planCompositions[242]);
    masterLayer242.startTime = 39.68;
    masterLayer242.name = "UNDLM_00242";
    masterLayer242.label = 8; // Couleurs alternées
}

// Ajouter plan 00243 à la timeline master
if (planCompositions[243]) {
    var masterLayer243 = masterComp.layers.add(planCompositions[243]);
    masterLayer243.startTime = 42.04;
    masterLayer243.name = "UNDLM_00243";
    masterLayer243.label = 9; // Couleurs alternées
}

// Ajouter plan 00244 à la timeline master
if (planCompositions[244]) {
    var masterLayer244 = masterComp.layers.add(planCompositions[244]);
    masterLayer244.startTime = 43.72;
    masterLayer244.name = "UNDLM_00244";
    masterLayer244.label = 10; // Couleurs alternées
}

// Ajouter plan 00245 à la timeline master
if (planCompositions[245]) {
    var masterLayer245 = masterComp.layers.add(planCompositions[245]);
    masterLayer245.startTime = 46.16;
    masterLayer245.name = "UNDLM_00245";
    masterLayer245.label = 11; // Couleurs alternées
}

// Ajouter plan 00246 à la timeline master
if (planCompositions[246]) {
    var masterLayer246 = masterComp.layers.add(planCompositions[246]);
    masterLayer246.startTime = 49.839999999999996;
    masterLayer246.name = "UNDLM_00246";
    masterLayer246.label = 12; // Couleurs alternées
}

// Ajouter plan 00247 à la timeline master
if (planCompositions[247]) {
    var masterLayer247 = masterComp.layers.add(planCompositions[247]);
    masterLayer247.startTime = 51.879999999999995;
    masterLayer247.name = "UNDLM_00247";
    masterLayer247.label = 13; // Couleurs alternées
}

// Ajouter plan 00248 à la timeline master
if (planCompositions[248]) {
    var masterLayer248 = masterComp.layers.add(planCompositions[248]);
    masterLayer248.startTime = 55.519999999999996;
    masterLayer248.name = "UNDLM_00248";
    masterLayer248.label = 14; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ13";\n' +
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
    {start: 0, end: 17.68, name: "UNDLM_00234"},
    {start: 17.68, end: 22.56, name: "UNDLM_00235"},
    {start: 22.56, end: 26.24, name: "UNDLM_00236"},
    {start: 26.24, end: 27.72, name: "UNDLM_00237"},
    {start: 27.72, end: 31.84, name: "UNDLM_00238"},
    {start: 31.84, end: 36.64, name: "UNDLM_00239"},
    {start: 36.64, end: 39.68, name: "UNDLM_00240"},
    {start: 39.68, end: 42.04, name: "UNDLM_00242"},
    {start: 42.04, end: 43.72, name: "UNDLM_00243"},
    {start: 43.72, end: 46.16, name: "UNDLM_00244"},
    {start: 46.16, end: 49.839999999999996, name: "UNDLM_00245"},
    {start: 49.839999999999996, end: 51.879999999999995, name: "UNDLM_00246"},
    {start: 51.879999999999995, end: 55.519999999999996, name: "UNDLM_00247"},
    {start: 55.519999999999996, end: 60.239999999999995, name: "UNDLM_00248"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ13/_AE/SQ13_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 14;
var totalCount = 14;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ13 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(60.239999999999995 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ13_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ13:" + totalCount + ":" + gradedCount);
