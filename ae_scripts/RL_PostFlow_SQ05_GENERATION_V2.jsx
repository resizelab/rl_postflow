
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ05 avec 16 plans
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


// Import plan EDIT 00118
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile118 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00118.mov");
var editFilePoignees118 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00118_AVEC_POIGNEES.mov");
var editFileBis118 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00118bis.mov");

var importSuccess118 = false;
var fileName118 = "";

// Tenter import standard
if (editFile118.exists) {
    try {
        var editFootage118 = project.importFile(new ImportOptions(editFile118));
        editFootage118.parentFolder = fromEditFolder;
        editFootage118.name = "UNDLM_00118";
        editSources[118] = editFootage118;
        editImportCount++;
        importSuccess118 = true;
        fileName118 = "UNDLM_00118.mov";
        logImportSuccess(118, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00118.mov", fileName118);
    } catch (e) {
        logImportError(118, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00118.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess118 && editFilePoignees118.exists) {
    try {
        var editFootage118 = project.importFile(new ImportOptions(editFilePoignees118));
        editFootage118.parentFolder = fromEditFolder;
        editFootage118.name = "UNDLM_00118_AVEC_POIGNEES";
        editSources[118] = editFootage118;
        editImportCount++;
        importSuccess118 = true;
        fileName118 = "UNDLM_00118_AVEC_POIGNEES.mov";
        logImportSuccess(118, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00118_AVEC_POIGNEES.mov", fileName118);
    } catch (e) {
        logImportError(118, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00118_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess118 && editFileBis118.exists) {
    try {
        var editFootage118 = project.importFile(new ImportOptions(editFileBis118));
        editFootage118.parentFolder = fromEditFolder;
        editFootage118.name = "UNDLM_00118bis";
        editSources[118] = editFootage118;
        editImportCount++;
        importSuccess118 = true;
        fileName118 = "UNDLM_00118bis.mov";
        logImportSuccess(118, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00118bis.mov", fileName118);
    } catch (e) {
        logImportError(118, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00118bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess118) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00118.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00119
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile119 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00119.mov");
var editFilePoignees119 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00119_AVEC_POIGNEES.mov");
var editFileBis119 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00119bis.mov");

var importSuccess119 = false;
var fileName119 = "";

// Tenter import standard
if (editFile119.exists) {
    try {
        var editFootage119 = project.importFile(new ImportOptions(editFile119));
        editFootage119.parentFolder = fromEditFolder;
        editFootage119.name = "UNDLM_00119";
        editSources[119] = editFootage119;
        editImportCount++;
        importSuccess119 = true;
        fileName119 = "UNDLM_00119.mov";
        logImportSuccess(119, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00119.mov", fileName119);
    } catch (e) {
        logImportError(119, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00119.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess119 && editFilePoignees119.exists) {
    try {
        var editFootage119 = project.importFile(new ImportOptions(editFilePoignees119));
        editFootage119.parentFolder = fromEditFolder;
        editFootage119.name = "UNDLM_00119_AVEC_POIGNEES";
        editSources[119] = editFootage119;
        editImportCount++;
        importSuccess119 = true;
        fileName119 = "UNDLM_00119_AVEC_POIGNEES.mov";
        logImportSuccess(119, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00119_AVEC_POIGNEES.mov", fileName119);
    } catch (e) {
        logImportError(119, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00119_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess119 && editFileBis119.exists) {
    try {
        var editFootage119 = project.importFile(new ImportOptions(editFileBis119));
        editFootage119.parentFolder = fromEditFolder;
        editFootage119.name = "UNDLM_00119bis";
        editSources[119] = editFootage119;
        editImportCount++;
        importSuccess119 = true;
        fileName119 = "UNDLM_00119bis.mov";
        logImportSuccess(119, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00119bis.mov", fileName119);
    } catch (e) {
        logImportError(119, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00119bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess119) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00119.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00120
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile120 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00120.mov");
var editFilePoignees120 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00120_AVEC_POIGNEES.mov");
var editFileBis120 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00120bis.mov");

var importSuccess120 = false;
var fileName120 = "";

// Tenter import standard
if (editFile120.exists) {
    try {
        var editFootage120 = project.importFile(new ImportOptions(editFile120));
        editFootage120.parentFolder = fromEditFolder;
        editFootage120.name = "UNDLM_00120";
        editSources[120] = editFootage120;
        editImportCount++;
        importSuccess120 = true;
        fileName120 = "UNDLM_00120.mov";
        logImportSuccess(120, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00120.mov", fileName120);
    } catch (e) {
        logImportError(120, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00120.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess120 && editFilePoignees120.exists) {
    try {
        var editFootage120 = project.importFile(new ImportOptions(editFilePoignees120));
        editFootage120.parentFolder = fromEditFolder;
        editFootage120.name = "UNDLM_00120_AVEC_POIGNEES";
        editSources[120] = editFootage120;
        editImportCount++;
        importSuccess120 = true;
        fileName120 = "UNDLM_00120_AVEC_POIGNEES.mov";
        logImportSuccess(120, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00120_AVEC_POIGNEES.mov", fileName120);
    } catch (e) {
        logImportError(120, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00120_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess120 && editFileBis120.exists) {
    try {
        var editFootage120 = project.importFile(new ImportOptions(editFileBis120));
        editFootage120.parentFolder = fromEditFolder;
        editFootage120.name = "UNDLM_00120bis";
        editSources[120] = editFootage120;
        editImportCount++;
        importSuccess120 = true;
        fileName120 = "UNDLM_00120bis.mov";
        logImportSuccess(120, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00120bis.mov", fileName120);
    } catch (e) {
        logImportError(120, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00120bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess120) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00120.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00121
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile121 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00121.mov");
var editFilePoignees121 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00121_AVEC_POIGNEES.mov");
var editFileBis121 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00121bis.mov");

var importSuccess121 = false;
var fileName121 = "";

// Tenter import standard
if (editFile121.exists) {
    try {
        var editFootage121 = project.importFile(new ImportOptions(editFile121));
        editFootage121.parentFolder = fromEditFolder;
        editFootage121.name = "UNDLM_00121";
        editSources[121] = editFootage121;
        editImportCount++;
        importSuccess121 = true;
        fileName121 = "UNDLM_00121.mov";
        logImportSuccess(121, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00121.mov", fileName121);
    } catch (e) {
        logImportError(121, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00121.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess121 && editFilePoignees121.exists) {
    try {
        var editFootage121 = project.importFile(new ImportOptions(editFilePoignees121));
        editFootage121.parentFolder = fromEditFolder;
        editFootage121.name = "UNDLM_00121_AVEC_POIGNEES";
        editSources[121] = editFootage121;
        editImportCount++;
        importSuccess121 = true;
        fileName121 = "UNDLM_00121_AVEC_POIGNEES.mov";
        logImportSuccess(121, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00121_AVEC_POIGNEES.mov", fileName121);
    } catch (e) {
        logImportError(121, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00121_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess121 && editFileBis121.exists) {
    try {
        var editFootage121 = project.importFile(new ImportOptions(editFileBis121));
        editFootage121.parentFolder = fromEditFolder;
        editFootage121.name = "UNDLM_00121bis";
        editSources[121] = editFootage121;
        editImportCount++;
        importSuccess121 = true;
        fileName121 = "UNDLM_00121bis.mov";
        logImportSuccess(121, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00121bis.mov", fileName121);
    } catch (e) {
        logImportError(121, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00121bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess121) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00121.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00122
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile122 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00122.mov");
var editFilePoignees122 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00122_AVEC_POIGNEES.mov");
var editFileBis122 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00122bis.mov");

var importSuccess122 = false;
var fileName122 = "";

// Tenter import standard
if (editFile122.exists) {
    try {
        var editFootage122 = project.importFile(new ImportOptions(editFile122));
        editFootage122.parentFolder = fromEditFolder;
        editFootage122.name = "UNDLM_00122";
        editSources[122] = editFootage122;
        editImportCount++;
        importSuccess122 = true;
        fileName122 = "UNDLM_00122.mov";
        logImportSuccess(122, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00122.mov", fileName122);
    } catch (e) {
        logImportError(122, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00122.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess122 && editFilePoignees122.exists) {
    try {
        var editFootage122 = project.importFile(new ImportOptions(editFilePoignees122));
        editFootage122.parentFolder = fromEditFolder;
        editFootage122.name = "UNDLM_00122_AVEC_POIGNEES";
        editSources[122] = editFootage122;
        editImportCount++;
        importSuccess122 = true;
        fileName122 = "UNDLM_00122_AVEC_POIGNEES.mov";
        logImportSuccess(122, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00122_AVEC_POIGNEES.mov", fileName122);
    } catch (e) {
        logImportError(122, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00122_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess122 && editFileBis122.exists) {
    try {
        var editFootage122 = project.importFile(new ImportOptions(editFileBis122));
        editFootage122.parentFolder = fromEditFolder;
        editFootage122.name = "UNDLM_00122bis";
        editSources[122] = editFootage122;
        editImportCount++;
        importSuccess122 = true;
        fileName122 = "UNDLM_00122bis.mov";
        logImportSuccess(122, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00122bis.mov", fileName122);
    } catch (e) {
        logImportError(122, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00122bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess122) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00122.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00123
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile123 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00123.mov");
var editFilePoignees123 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00123_AVEC_POIGNEES.mov");
var editFileBis123 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00123bis.mov");

var importSuccess123 = false;
var fileName123 = "";

// Tenter import standard
if (editFile123.exists) {
    try {
        var editFootage123 = project.importFile(new ImportOptions(editFile123));
        editFootage123.parentFolder = fromEditFolder;
        editFootage123.name = "UNDLM_00123";
        editSources[123] = editFootage123;
        editImportCount++;
        importSuccess123 = true;
        fileName123 = "UNDLM_00123.mov";
        logImportSuccess(123, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00123.mov", fileName123);
    } catch (e) {
        logImportError(123, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00123.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess123 && editFilePoignees123.exists) {
    try {
        var editFootage123 = project.importFile(new ImportOptions(editFilePoignees123));
        editFootage123.parentFolder = fromEditFolder;
        editFootage123.name = "UNDLM_00123_AVEC_POIGNEES";
        editSources[123] = editFootage123;
        editImportCount++;
        importSuccess123 = true;
        fileName123 = "UNDLM_00123_AVEC_POIGNEES.mov";
        logImportSuccess(123, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00123_AVEC_POIGNEES.mov", fileName123);
    } catch (e) {
        logImportError(123, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00123_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess123 && editFileBis123.exists) {
    try {
        var editFootage123 = project.importFile(new ImportOptions(editFileBis123));
        editFootage123.parentFolder = fromEditFolder;
        editFootage123.name = "UNDLM_00123bis";
        editSources[123] = editFootage123;
        editImportCount++;
        importSuccess123 = true;
        fileName123 = "UNDLM_00123bis.mov";
        logImportSuccess(123, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00123bis.mov", fileName123);
    } catch (e) {
        logImportError(123, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00123bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess123) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00123.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00124
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile124 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00124.mov");
var editFilePoignees124 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00124_AVEC_POIGNEES.mov");
var editFileBis124 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00124bis.mov");

var importSuccess124 = false;
var fileName124 = "";

// Tenter import standard
if (editFile124.exists) {
    try {
        var editFootage124 = project.importFile(new ImportOptions(editFile124));
        editFootage124.parentFolder = fromEditFolder;
        editFootage124.name = "UNDLM_00124";
        editSources[124] = editFootage124;
        editImportCount++;
        importSuccess124 = true;
        fileName124 = "UNDLM_00124.mov";
        logImportSuccess(124, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00124.mov", fileName124);
    } catch (e) {
        logImportError(124, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00124.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess124 && editFilePoignees124.exists) {
    try {
        var editFootage124 = project.importFile(new ImportOptions(editFilePoignees124));
        editFootage124.parentFolder = fromEditFolder;
        editFootage124.name = "UNDLM_00124_AVEC_POIGNEES";
        editSources[124] = editFootage124;
        editImportCount++;
        importSuccess124 = true;
        fileName124 = "UNDLM_00124_AVEC_POIGNEES.mov";
        logImportSuccess(124, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00124_AVEC_POIGNEES.mov", fileName124);
    } catch (e) {
        logImportError(124, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00124_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess124 && editFileBis124.exists) {
    try {
        var editFootage124 = project.importFile(new ImportOptions(editFileBis124));
        editFootage124.parentFolder = fromEditFolder;
        editFootage124.name = "UNDLM_00124bis";
        editSources[124] = editFootage124;
        editImportCount++;
        importSuccess124 = true;
        fileName124 = "UNDLM_00124bis.mov";
        logImportSuccess(124, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00124bis.mov", fileName124);
    } catch (e) {
        logImportError(124, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00124bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess124) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00124.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00125
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile125 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00125.mov");
var editFilePoignees125 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00125_AVEC_POIGNEES.mov");
var editFileBis125 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00125bis.mov");

var importSuccess125 = false;
var fileName125 = "";

// Tenter import standard
if (editFile125.exists) {
    try {
        var editFootage125 = project.importFile(new ImportOptions(editFile125));
        editFootage125.parentFolder = fromEditFolder;
        editFootage125.name = "UNDLM_00125";
        editSources[125] = editFootage125;
        editImportCount++;
        importSuccess125 = true;
        fileName125 = "UNDLM_00125.mov";
        logImportSuccess(125, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00125.mov", fileName125);
    } catch (e) {
        logImportError(125, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00125.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess125 && editFilePoignees125.exists) {
    try {
        var editFootage125 = project.importFile(new ImportOptions(editFilePoignees125));
        editFootage125.parentFolder = fromEditFolder;
        editFootage125.name = "UNDLM_00125_AVEC_POIGNEES";
        editSources[125] = editFootage125;
        editImportCount++;
        importSuccess125 = true;
        fileName125 = "UNDLM_00125_AVEC_POIGNEES.mov";
        logImportSuccess(125, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00125_AVEC_POIGNEES.mov", fileName125);
    } catch (e) {
        logImportError(125, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00125_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess125 && editFileBis125.exists) {
    try {
        var editFootage125 = project.importFile(new ImportOptions(editFileBis125));
        editFootage125.parentFolder = fromEditFolder;
        editFootage125.name = "UNDLM_00125bis";
        editSources[125] = editFootage125;
        editImportCount++;
        importSuccess125 = true;
        fileName125 = "UNDLM_00125bis.mov";
        logImportSuccess(125, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00125bis.mov", fileName125);
    } catch (e) {
        logImportError(125, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00125bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess125) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00125.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00126
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile126 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00126.mov");
var editFilePoignees126 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00126_AVEC_POIGNEES.mov");
var editFileBis126 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00126bis.mov");

var importSuccess126 = false;
var fileName126 = "";

// Tenter import standard
if (editFile126.exists) {
    try {
        var editFootage126 = project.importFile(new ImportOptions(editFile126));
        editFootage126.parentFolder = fromEditFolder;
        editFootage126.name = "UNDLM_00126";
        editSources[126] = editFootage126;
        editImportCount++;
        importSuccess126 = true;
        fileName126 = "UNDLM_00126.mov";
        logImportSuccess(126, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00126.mov", fileName126);
    } catch (e) {
        logImportError(126, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00126.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess126 && editFilePoignees126.exists) {
    try {
        var editFootage126 = project.importFile(new ImportOptions(editFilePoignees126));
        editFootage126.parentFolder = fromEditFolder;
        editFootage126.name = "UNDLM_00126_AVEC_POIGNEES";
        editSources[126] = editFootage126;
        editImportCount++;
        importSuccess126 = true;
        fileName126 = "UNDLM_00126_AVEC_POIGNEES.mov";
        logImportSuccess(126, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00126_AVEC_POIGNEES.mov", fileName126);
    } catch (e) {
        logImportError(126, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00126_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess126 && editFileBis126.exists) {
    try {
        var editFootage126 = project.importFile(new ImportOptions(editFileBis126));
        editFootage126.parentFolder = fromEditFolder;
        editFootage126.name = "UNDLM_00126bis";
        editSources[126] = editFootage126;
        editImportCount++;
        importSuccess126 = true;
        fileName126 = "UNDLM_00126bis.mov";
        logImportSuccess(126, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00126bis.mov", fileName126);
    } catch (e) {
        logImportError(126, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00126bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess126) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00126.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00127
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile127 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00127.mov");
var editFilePoignees127 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00127_AVEC_POIGNEES.mov");
var editFileBis127 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00127bis.mov");

var importSuccess127 = false;
var fileName127 = "";

// Tenter import standard
if (editFile127.exists) {
    try {
        var editFootage127 = project.importFile(new ImportOptions(editFile127));
        editFootage127.parentFolder = fromEditFolder;
        editFootage127.name = "UNDLM_00127";
        editSources[127] = editFootage127;
        editImportCount++;
        importSuccess127 = true;
        fileName127 = "UNDLM_00127.mov";
        logImportSuccess(127, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00127.mov", fileName127);
    } catch (e) {
        logImportError(127, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00127.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess127 && editFilePoignees127.exists) {
    try {
        var editFootage127 = project.importFile(new ImportOptions(editFilePoignees127));
        editFootage127.parentFolder = fromEditFolder;
        editFootage127.name = "UNDLM_00127_AVEC_POIGNEES";
        editSources[127] = editFootage127;
        editImportCount++;
        importSuccess127 = true;
        fileName127 = "UNDLM_00127_AVEC_POIGNEES.mov";
        logImportSuccess(127, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00127_AVEC_POIGNEES.mov", fileName127);
    } catch (e) {
        logImportError(127, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00127_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess127 && editFileBis127.exists) {
    try {
        var editFootage127 = project.importFile(new ImportOptions(editFileBis127));
        editFootage127.parentFolder = fromEditFolder;
        editFootage127.name = "UNDLM_00127bis";
        editSources[127] = editFootage127;
        editImportCount++;
        importSuccess127 = true;
        fileName127 = "UNDLM_00127bis.mov";
        logImportSuccess(127, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00127bis.mov", fileName127);
    } catch (e) {
        logImportError(127, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00127bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess127) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00127.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00128
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile128 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00128.mov");
var editFilePoignees128 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00128_AVEC_POIGNEES.mov");
var editFileBis128 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00128bis.mov");

var importSuccess128 = false;
var fileName128 = "";

// Tenter import standard
if (editFile128.exists) {
    try {
        var editFootage128 = project.importFile(new ImportOptions(editFile128));
        editFootage128.parentFolder = fromEditFolder;
        editFootage128.name = "UNDLM_00128";
        editSources[128] = editFootage128;
        editImportCount++;
        importSuccess128 = true;
        fileName128 = "UNDLM_00128.mov";
        logImportSuccess(128, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00128.mov", fileName128);
    } catch (e) {
        logImportError(128, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00128.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess128 && editFilePoignees128.exists) {
    try {
        var editFootage128 = project.importFile(new ImportOptions(editFilePoignees128));
        editFootage128.parentFolder = fromEditFolder;
        editFootage128.name = "UNDLM_00128_AVEC_POIGNEES";
        editSources[128] = editFootage128;
        editImportCount++;
        importSuccess128 = true;
        fileName128 = "UNDLM_00128_AVEC_POIGNEES.mov";
        logImportSuccess(128, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00128_AVEC_POIGNEES.mov", fileName128);
    } catch (e) {
        logImportError(128, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00128_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess128 && editFileBis128.exists) {
    try {
        var editFootage128 = project.importFile(new ImportOptions(editFileBis128));
        editFootage128.parentFolder = fromEditFolder;
        editFootage128.name = "UNDLM_00128bis";
        editSources[128] = editFootage128;
        editImportCount++;
        importSuccess128 = true;
        fileName128 = "UNDLM_00128bis.mov";
        logImportSuccess(128, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00128bis.mov", fileName128);
    } catch (e) {
        logImportError(128, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00128bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess128) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00128.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00129
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile129 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00129.mov");
var editFilePoignees129 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00129_AVEC_POIGNEES.mov");
var editFileBis129 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00129bis.mov");

var importSuccess129 = false;
var fileName129 = "";

// Tenter import standard
if (editFile129.exists) {
    try {
        var editFootage129 = project.importFile(new ImportOptions(editFile129));
        editFootage129.parentFolder = fromEditFolder;
        editFootage129.name = "UNDLM_00129";
        editSources[129] = editFootage129;
        editImportCount++;
        importSuccess129 = true;
        fileName129 = "UNDLM_00129.mov";
        logImportSuccess(129, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00129.mov", fileName129);
    } catch (e) {
        logImportError(129, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00129.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess129 && editFilePoignees129.exists) {
    try {
        var editFootage129 = project.importFile(new ImportOptions(editFilePoignees129));
        editFootage129.parentFolder = fromEditFolder;
        editFootage129.name = "UNDLM_00129_AVEC_POIGNEES";
        editSources[129] = editFootage129;
        editImportCount++;
        importSuccess129 = true;
        fileName129 = "UNDLM_00129_AVEC_POIGNEES.mov";
        logImportSuccess(129, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00129_AVEC_POIGNEES.mov", fileName129);
    } catch (e) {
        logImportError(129, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00129_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess129 && editFileBis129.exists) {
    try {
        var editFootage129 = project.importFile(new ImportOptions(editFileBis129));
        editFootage129.parentFolder = fromEditFolder;
        editFootage129.name = "UNDLM_00129bis";
        editSources[129] = editFootage129;
        editImportCount++;
        importSuccess129 = true;
        fileName129 = "UNDLM_00129bis.mov";
        logImportSuccess(129, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00129bis.mov", fileName129);
    } catch (e) {
        logImportError(129, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00129bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess129) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00129.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00130
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile130 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00130.mov");
var editFilePoignees130 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00130_AVEC_POIGNEES.mov");
var editFileBis130 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00130bis.mov");

var importSuccess130 = false;
var fileName130 = "";

// Tenter import standard
if (editFile130.exists) {
    try {
        var editFootage130 = project.importFile(new ImportOptions(editFile130));
        editFootage130.parentFolder = fromEditFolder;
        editFootage130.name = "UNDLM_00130";
        editSources[130] = editFootage130;
        editImportCount++;
        importSuccess130 = true;
        fileName130 = "UNDLM_00130.mov";
        logImportSuccess(130, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00130.mov", fileName130);
    } catch (e) {
        logImportError(130, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00130.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess130 && editFilePoignees130.exists) {
    try {
        var editFootage130 = project.importFile(new ImportOptions(editFilePoignees130));
        editFootage130.parentFolder = fromEditFolder;
        editFootage130.name = "UNDLM_00130_AVEC_POIGNEES";
        editSources[130] = editFootage130;
        editImportCount++;
        importSuccess130 = true;
        fileName130 = "UNDLM_00130_AVEC_POIGNEES.mov";
        logImportSuccess(130, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00130_AVEC_POIGNEES.mov", fileName130);
    } catch (e) {
        logImportError(130, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00130_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess130 && editFileBis130.exists) {
    try {
        var editFootage130 = project.importFile(new ImportOptions(editFileBis130));
        editFootage130.parentFolder = fromEditFolder;
        editFootage130.name = "UNDLM_00130bis";
        editSources[130] = editFootage130;
        editImportCount++;
        importSuccess130 = true;
        fileName130 = "UNDLM_00130bis.mov";
        logImportSuccess(130, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00130bis.mov", fileName130);
    } catch (e) {
        logImportError(130, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00130bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess130) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00130.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00131
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile131 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00131.mov");
var editFilePoignees131 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00131_AVEC_POIGNEES.mov");
var editFileBis131 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00131bis.mov");

var importSuccess131 = false;
var fileName131 = "";

// Tenter import standard
if (editFile131.exists) {
    try {
        var editFootage131 = project.importFile(new ImportOptions(editFile131));
        editFootage131.parentFolder = fromEditFolder;
        editFootage131.name = "UNDLM_00131";
        editSources[131] = editFootage131;
        editImportCount++;
        importSuccess131 = true;
        fileName131 = "UNDLM_00131.mov";
        logImportSuccess(131, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00131.mov", fileName131);
    } catch (e) {
        logImportError(131, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00131.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess131 && editFilePoignees131.exists) {
    try {
        var editFootage131 = project.importFile(new ImportOptions(editFilePoignees131));
        editFootage131.parentFolder = fromEditFolder;
        editFootage131.name = "UNDLM_00131_AVEC_POIGNEES";
        editSources[131] = editFootage131;
        editImportCount++;
        importSuccess131 = true;
        fileName131 = "UNDLM_00131_AVEC_POIGNEES.mov";
        logImportSuccess(131, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00131_AVEC_POIGNEES.mov", fileName131);
    } catch (e) {
        logImportError(131, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00131_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess131 && editFileBis131.exists) {
    try {
        var editFootage131 = project.importFile(new ImportOptions(editFileBis131));
        editFootage131.parentFolder = fromEditFolder;
        editFootage131.name = "UNDLM_00131bis";
        editSources[131] = editFootage131;
        editImportCount++;
        importSuccess131 = true;
        fileName131 = "UNDLM_00131bis.mov";
        logImportSuccess(131, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00131bis.mov", fileName131);
    } catch (e) {
        logImportError(131, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00131bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess131) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00131.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00132
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile132 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00132.mov");
var editFilePoignees132 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00132_AVEC_POIGNEES.mov");
var editFileBis132 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00132bis.mov");

var importSuccess132 = false;
var fileName132 = "";

// Tenter import standard
if (editFile132.exists) {
    try {
        var editFootage132 = project.importFile(new ImportOptions(editFile132));
        editFootage132.parentFolder = fromEditFolder;
        editFootage132.name = "UNDLM_00132";
        editSources[132] = editFootage132;
        editImportCount++;
        importSuccess132 = true;
        fileName132 = "UNDLM_00132.mov";
        logImportSuccess(132, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00132.mov", fileName132);
    } catch (e) {
        logImportError(132, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00132.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess132 && editFilePoignees132.exists) {
    try {
        var editFootage132 = project.importFile(new ImportOptions(editFilePoignees132));
        editFootage132.parentFolder = fromEditFolder;
        editFootage132.name = "UNDLM_00132_AVEC_POIGNEES";
        editSources[132] = editFootage132;
        editImportCount++;
        importSuccess132 = true;
        fileName132 = "UNDLM_00132_AVEC_POIGNEES.mov";
        logImportSuccess(132, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00132_AVEC_POIGNEES.mov", fileName132);
    } catch (e) {
        logImportError(132, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00132_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess132 && editFileBis132.exists) {
    try {
        var editFootage132 = project.importFile(new ImportOptions(editFileBis132));
        editFootage132.parentFolder = fromEditFolder;
        editFootage132.name = "UNDLM_00132bis";
        editSources[132] = editFootage132;
        editImportCount++;
        importSuccess132 = true;
        fileName132 = "UNDLM_00132bis.mov";
        logImportSuccess(132, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00132bis.mov", fileName132);
    } catch (e) {
        logImportError(132, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00132bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess132) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00132.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00133
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile133 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00133.mov");
var editFilePoignees133 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00133_AVEC_POIGNEES.mov");
var editFileBis133 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00133bis.mov");

var importSuccess133 = false;
var fileName133 = "";

// Tenter import standard
if (editFile133.exists) {
    try {
        var editFootage133 = project.importFile(new ImportOptions(editFile133));
        editFootage133.parentFolder = fromEditFolder;
        editFootage133.name = "UNDLM_00133";
        editSources[133] = editFootage133;
        editImportCount++;
        importSuccess133 = true;
        fileName133 = "UNDLM_00133.mov";
        logImportSuccess(133, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00133.mov", fileName133);
    } catch (e) {
        logImportError(133, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00133.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess133 && editFilePoignees133.exists) {
    try {
        var editFootage133 = project.importFile(new ImportOptions(editFilePoignees133));
        editFootage133.parentFolder = fromEditFolder;
        editFootage133.name = "UNDLM_00133_AVEC_POIGNEES";
        editSources[133] = editFootage133;
        editImportCount++;
        importSuccess133 = true;
        fileName133 = "UNDLM_00133_AVEC_POIGNEES.mov";
        logImportSuccess(133, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00133_AVEC_POIGNEES.mov", fileName133);
    } catch (e) {
        logImportError(133, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00133_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess133 && editFileBis133.exists) {
    try {
        var editFootage133 = project.importFile(new ImportOptions(editFileBis133));
        editFootage133.parentFolder = fromEditFolder;
        editFootage133.name = "UNDLM_00133bis";
        editSources[133] = editFootage133;
        editImportCount++;
        importSuccess133 = true;
        fileName133 = "UNDLM_00133bis.mov";
        logImportSuccess(133, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00133bis.mov", fileName133);
    } catch (e) {
        logImportError(133, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00133bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess133) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00133.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00118
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile118 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00118.mov");
var gradedFilePoignees118 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00118_AVEC_POIGNEES.mov");
var gradedFileBis118 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00118bis.mov");

var gradedImportSuccess118 = false;
var gradedFileName118 = "";

// Tenter import standard
if (gradedFile118.exists) {
    try {
        var gradedFootage118 = project.importFile(new ImportOptions(gradedFile118));
        gradedFootage118.parentFolder = fromGradingFolder;
        gradedFootage118.name = "UNDLM_00118";
        gradingSources[118] = gradedFootage118;
        gradingImportCount++;
        gradedImportSuccess118 = true;
        gradedFileName118 = "UNDLM_00118.mov";
        logImportSuccess(118, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00118.mov", gradedFileName118);
    } catch (e) {
        logImportError(118, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00118.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess118 && gradedFilePoignees118.exists) {
    try {
        var gradedFootage118 = project.importFile(new ImportOptions(gradedFilePoignees118));
        gradedFootage118.parentFolder = fromGradingFolder;
        gradedFootage118.name = "UNDLM_00118_AVEC_POIGNEES";
        gradingSources[118] = gradedFootage118;
        gradingImportCount++;
        gradedImportSuccess118 = true;
        gradedFileName118 = "UNDLM_00118_AVEC_POIGNEES.mov";
        logImportSuccess(118, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00118_AVEC_POIGNEES.mov", gradedFileName118);
    } catch (e) {
        logImportError(118, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00118_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess118 && gradedFileBis118.exists) {
    try {
        var gradedFootage118 = project.importFile(new ImportOptions(gradedFileBis118));
        gradedFootage118.parentFolder = fromGradingFolder;
        gradedFootage118.name = "UNDLM_00118bis";
        gradingSources[118] = gradedFootage118;
        gradingImportCount++;
        gradedImportSuccess118 = true;
        gradedFileName118 = "UNDLM_00118bis.mov";
        logImportSuccess(118, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00118bis.mov", gradedFileName118);
    } catch (e) {
        logImportError(118, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00118bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess118) {
    missingGradingCount++;
}

// Import plan GRADED 00119
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile119 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00119.mov");
var gradedFilePoignees119 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00119_AVEC_POIGNEES.mov");
var gradedFileBis119 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00119bis.mov");

var gradedImportSuccess119 = false;
var gradedFileName119 = "";

// Tenter import standard
if (gradedFile119.exists) {
    try {
        var gradedFootage119 = project.importFile(new ImportOptions(gradedFile119));
        gradedFootage119.parentFolder = fromGradingFolder;
        gradedFootage119.name = "UNDLM_00119";
        gradingSources[119] = gradedFootage119;
        gradingImportCount++;
        gradedImportSuccess119 = true;
        gradedFileName119 = "UNDLM_00119.mov";
        logImportSuccess(119, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00119.mov", gradedFileName119);
    } catch (e) {
        logImportError(119, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00119.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess119 && gradedFilePoignees119.exists) {
    try {
        var gradedFootage119 = project.importFile(new ImportOptions(gradedFilePoignees119));
        gradedFootage119.parentFolder = fromGradingFolder;
        gradedFootage119.name = "UNDLM_00119_AVEC_POIGNEES";
        gradingSources[119] = gradedFootage119;
        gradingImportCount++;
        gradedImportSuccess119 = true;
        gradedFileName119 = "UNDLM_00119_AVEC_POIGNEES.mov";
        logImportSuccess(119, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00119_AVEC_POIGNEES.mov", gradedFileName119);
    } catch (e) {
        logImportError(119, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00119_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess119 && gradedFileBis119.exists) {
    try {
        var gradedFootage119 = project.importFile(new ImportOptions(gradedFileBis119));
        gradedFootage119.parentFolder = fromGradingFolder;
        gradedFootage119.name = "UNDLM_00119bis";
        gradingSources[119] = gradedFootage119;
        gradingImportCount++;
        gradedImportSuccess119 = true;
        gradedFileName119 = "UNDLM_00119bis.mov";
        logImportSuccess(119, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00119bis.mov", gradedFileName119);
    } catch (e) {
        logImportError(119, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00119bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess119) {
    missingGradingCount++;
}

// Import plan GRADED 00120
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile120 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00120.mov");
var gradedFilePoignees120 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00120_AVEC_POIGNEES.mov");
var gradedFileBis120 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00120bis.mov");

var gradedImportSuccess120 = false;
var gradedFileName120 = "";

// Tenter import standard
if (gradedFile120.exists) {
    try {
        var gradedFootage120 = project.importFile(new ImportOptions(gradedFile120));
        gradedFootage120.parentFolder = fromGradingFolder;
        gradedFootage120.name = "UNDLM_00120";
        gradingSources[120] = gradedFootage120;
        gradingImportCount++;
        gradedImportSuccess120 = true;
        gradedFileName120 = "UNDLM_00120.mov";
        logImportSuccess(120, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00120.mov", gradedFileName120);
    } catch (e) {
        logImportError(120, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00120.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess120 && gradedFilePoignees120.exists) {
    try {
        var gradedFootage120 = project.importFile(new ImportOptions(gradedFilePoignees120));
        gradedFootage120.parentFolder = fromGradingFolder;
        gradedFootage120.name = "UNDLM_00120_AVEC_POIGNEES";
        gradingSources[120] = gradedFootage120;
        gradingImportCount++;
        gradedImportSuccess120 = true;
        gradedFileName120 = "UNDLM_00120_AVEC_POIGNEES.mov";
        logImportSuccess(120, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00120_AVEC_POIGNEES.mov", gradedFileName120);
    } catch (e) {
        logImportError(120, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00120_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess120 && gradedFileBis120.exists) {
    try {
        var gradedFootage120 = project.importFile(new ImportOptions(gradedFileBis120));
        gradedFootage120.parentFolder = fromGradingFolder;
        gradedFootage120.name = "UNDLM_00120bis";
        gradingSources[120] = gradedFootage120;
        gradingImportCount++;
        gradedImportSuccess120 = true;
        gradedFileName120 = "UNDLM_00120bis.mov";
        logImportSuccess(120, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00120bis.mov", gradedFileName120);
    } catch (e) {
        logImportError(120, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00120bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess120) {
    missingGradingCount++;
}

// Import plan GRADED 00121
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile121 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00121.mov");
var gradedFilePoignees121 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00121_AVEC_POIGNEES.mov");
var gradedFileBis121 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00121bis.mov");

var gradedImportSuccess121 = false;
var gradedFileName121 = "";

// Tenter import standard
if (gradedFile121.exists) {
    try {
        var gradedFootage121 = project.importFile(new ImportOptions(gradedFile121));
        gradedFootage121.parentFolder = fromGradingFolder;
        gradedFootage121.name = "UNDLM_00121";
        gradingSources[121] = gradedFootage121;
        gradingImportCount++;
        gradedImportSuccess121 = true;
        gradedFileName121 = "UNDLM_00121.mov";
        logImportSuccess(121, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00121.mov", gradedFileName121);
    } catch (e) {
        logImportError(121, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00121.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess121 && gradedFilePoignees121.exists) {
    try {
        var gradedFootage121 = project.importFile(new ImportOptions(gradedFilePoignees121));
        gradedFootage121.parentFolder = fromGradingFolder;
        gradedFootage121.name = "UNDLM_00121_AVEC_POIGNEES";
        gradingSources[121] = gradedFootage121;
        gradingImportCount++;
        gradedImportSuccess121 = true;
        gradedFileName121 = "UNDLM_00121_AVEC_POIGNEES.mov";
        logImportSuccess(121, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00121_AVEC_POIGNEES.mov", gradedFileName121);
    } catch (e) {
        logImportError(121, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00121_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess121 && gradedFileBis121.exists) {
    try {
        var gradedFootage121 = project.importFile(new ImportOptions(gradedFileBis121));
        gradedFootage121.parentFolder = fromGradingFolder;
        gradedFootage121.name = "UNDLM_00121bis";
        gradingSources[121] = gradedFootage121;
        gradingImportCount++;
        gradedImportSuccess121 = true;
        gradedFileName121 = "UNDLM_00121bis.mov";
        logImportSuccess(121, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00121bis.mov", gradedFileName121);
    } catch (e) {
        logImportError(121, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00121bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess121) {
    missingGradingCount++;
}

// Import plan GRADED 00122
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile122 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00122.mov");
var gradedFilePoignees122 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00122_AVEC_POIGNEES.mov");
var gradedFileBis122 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00122bis.mov");

var gradedImportSuccess122 = false;
var gradedFileName122 = "";

// Tenter import standard
if (gradedFile122.exists) {
    try {
        var gradedFootage122 = project.importFile(new ImportOptions(gradedFile122));
        gradedFootage122.parentFolder = fromGradingFolder;
        gradedFootage122.name = "UNDLM_00122";
        gradingSources[122] = gradedFootage122;
        gradingImportCount++;
        gradedImportSuccess122 = true;
        gradedFileName122 = "UNDLM_00122.mov";
        logImportSuccess(122, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00122.mov", gradedFileName122);
    } catch (e) {
        logImportError(122, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00122.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess122 && gradedFilePoignees122.exists) {
    try {
        var gradedFootage122 = project.importFile(new ImportOptions(gradedFilePoignees122));
        gradedFootage122.parentFolder = fromGradingFolder;
        gradedFootage122.name = "UNDLM_00122_AVEC_POIGNEES";
        gradingSources[122] = gradedFootage122;
        gradingImportCount++;
        gradedImportSuccess122 = true;
        gradedFileName122 = "UNDLM_00122_AVEC_POIGNEES.mov";
        logImportSuccess(122, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00122_AVEC_POIGNEES.mov", gradedFileName122);
    } catch (e) {
        logImportError(122, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00122_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess122 && gradedFileBis122.exists) {
    try {
        var gradedFootage122 = project.importFile(new ImportOptions(gradedFileBis122));
        gradedFootage122.parentFolder = fromGradingFolder;
        gradedFootage122.name = "UNDLM_00122bis";
        gradingSources[122] = gradedFootage122;
        gradingImportCount++;
        gradedImportSuccess122 = true;
        gradedFileName122 = "UNDLM_00122bis.mov";
        logImportSuccess(122, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00122bis.mov", gradedFileName122);
    } catch (e) {
        logImportError(122, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00122bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess122) {
    missingGradingCount++;
}

// Import plan GRADED 00123
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile123 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00123.mov");
var gradedFilePoignees123 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00123_AVEC_POIGNEES.mov");
var gradedFileBis123 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00123bis.mov");

var gradedImportSuccess123 = false;
var gradedFileName123 = "";

// Tenter import standard
if (gradedFile123.exists) {
    try {
        var gradedFootage123 = project.importFile(new ImportOptions(gradedFile123));
        gradedFootage123.parentFolder = fromGradingFolder;
        gradedFootage123.name = "UNDLM_00123";
        gradingSources[123] = gradedFootage123;
        gradingImportCount++;
        gradedImportSuccess123 = true;
        gradedFileName123 = "UNDLM_00123.mov";
        logImportSuccess(123, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00123.mov", gradedFileName123);
    } catch (e) {
        logImportError(123, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00123.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess123 && gradedFilePoignees123.exists) {
    try {
        var gradedFootage123 = project.importFile(new ImportOptions(gradedFilePoignees123));
        gradedFootage123.parentFolder = fromGradingFolder;
        gradedFootage123.name = "UNDLM_00123_AVEC_POIGNEES";
        gradingSources[123] = gradedFootage123;
        gradingImportCount++;
        gradedImportSuccess123 = true;
        gradedFileName123 = "UNDLM_00123_AVEC_POIGNEES.mov";
        logImportSuccess(123, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00123_AVEC_POIGNEES.mov", gradedFileName123);
    } catch (e) {
        logImportError(123, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00123_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess123 && gradedFileBis123.exists) {
    try {
        var gradedFootage123 = project.importFile(new ImportOptions(gradedFileBis123));
        gradedFootage123.parentFolder = fromGradingFolder;
        gradedFootage123.name = "UNDLM_00123bis";
        gradingSources[123] = gradedFootage123;
        gradingImportCount++;
        gradedImportSuccess123 = true;
        gradedFileName123 = "UNDLM_00123bis.mov";
        logImportSuccess(123, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00123bis.mov", gradedFileName123);
    } catch (e) {
        logImportError(123, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00123bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess123) {
    missingGradingCount++;
}

// Import plan GRADED 00124
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile124 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00124.mov");
var gradedFilePoignees124 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00124_AVEC_POIGNEES.mov");
var gradedFileBis124 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00124bis.mov");

var gradedImportSuccess124 = false;
var gradedFileName124 = "";

// Tenter import standard
if (gradedFile124.exists) {
    try {
        var gradedFootage124 = project.importFile(new ImportOptions(gradedFile124));
        gradedFootage124.parentFolder = fromGradingFolder;
        gradedFootage124.name = "UNDLM_00124";
        gradingSources[124] = gradedFootage124;
        gradingImportCount++;
        gradedImportSuccess124 = true;
        gradedFileName124 = "UNDLM_00124.mov";
        logImportSuccess(124, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00124.mov", gradedFileName124);
    } catch (e) {
        logImportError(124, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00124.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess124 && gradedFilePoignees124.exists) {
    try {
        var gradedFootage124 = project.importFile(new ImportOptions(gradedFilePoignees124));
        gradedFootage124.parentFolder = fromGradingFolder;
        gradedFootage124.name = "UNDLM_00124_AVEC_POIGNEES";
        gradingSources[124] = gradedFootage124;
        gradingImportCount++;
        gradedImportSuccess124 = true;
        gradedFileName124 = "UNDLM_00124_AVEC_POIGNEES.mov";
        logImportSuccess(124, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00124_AVEC_POIGNEES.mov", gradedFileName124);
    } catch (e) {
        logImportError(124, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00124_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess124 && gradedFileBis124.exists) {
    try {
        var gradedFootage124 = project.importFile(new ImportOptions(gradedFileBis124));
        gradedFootage124.parentFolder = fromGradingFolder;
        gradedFootage124.name = "UNDLM_00124bis";
        gradingSources[124] = gradedFootage124;
        gradingImportCount++;
        gradedImportSuccess124 = true;
        gradedFileName124 = "UNDLM_00124bis.mov";
        logImportSuccess(124, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00124bis.mov", gradedFileName124);
    } catch (e) {
        logImportError(124, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00124bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess124) {
    missingGradingCount++;
}

// Import plan GRADED 00125
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile125 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00125.mov");
var gradedFilePoignees125 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00125_AVEC_POIGNEES.mov");
var gradedFileBis125 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00125bis.mov");

var gradedImportSuccess125 = false;
var gradedFileName125 = "";

// Tenter import standard
if (gradedFile125.exists) {
    try {
        var gradedFootage125 = project.importFile(new ImportOptions(gradedFile125));
        gradedFootage125.parentFolder = fromGradingFolder;
        gradedFootage125.name = "UNDLM_00125";
        gradingSources[125] = gradedFootage125;
        gradingImportCount++;
        gradedImportSuccess125 = true;
        gradedFileName125 = "UNDLM_00125.mov";
        logImportSuccess(125, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00125.mov", gradedFileName125);
    } catch (e) {
        logImportError(125, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00125.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess125 && gradedFilePoignees125.exists) {
    try {
        var gradedFootage125 = project.importFile(new ImportOptions(gradedFilePoignees125));
        gradedFootage125.parentFolder = fromGradingFolder;
        gradedFootage125.name = "UNDLM_00125_AVEC_POIGNEES";
        gradingSources[125] = gradedFootage125;
        gradingImportCount++;
        gradedImportSuccess125 = true;
        gradedFileName125 = "UNDLM_00125_AVEC_POIGNEES.mov";
        logImportSuccess(125, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00125_AVEC_POIGNEES.mov", gradedFileName125);
    } catch (e) {
        logImportError(125, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00125_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess125 && gradedFileBis125.exists) {
    try {
        var gradedFootage125 = project.importFile(new ImportOptions(gradedFileBis125));
        gradedFootage125.parentFolder = fromGradingFolder;
        gradedFootage125.name = "UNDLM_00125bis";
        gradingSources[125] = gradedFootage125;
        gradingImportCount++;
        gradedImportSuccess125 = true;
        gradedFileName125 = "UNDLM_00125bis.mov";
        logImportSuccess(125, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00125bis.mov", gradedFileName125);
    } catch (e) {
        logImportError(125, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00125bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess125) {
    missingGradingCount++;
}

// Import plan GRADED 00126
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile126 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00126.mov");
var gradedFilePoignees126 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00126_AVEC_POIGNEES.mov");
var gradedFileBis126 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00126bis.mov");

var gradedImportSuccess126 = false;
var gradedFileName126 = "";

// Tenter import standard
if (gradedFile126.exists) {
    try {
        var gradedFootage126 = project.importFile(new ImportOptions(gradedFile126));
        gradedFootage126.parentFolder = fromGradingFolder;
        gradedFootage126.name = "UNDLM_00126";
        gradingSources[126] = gradedFootage126;
        gradingImportCount++;
        gradedImportSuccess126 = true;
        gradedFileName126 = "UNDLM_00126.mov";
        logImportSuccess(126, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00126.mov", gradedFileName126);
    } catch (e) {
        logImportError(126, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00126.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess126 && gradedFilePoignees126.exists) {
    try {
        var gradedFootage126 = project.importFile(new ImportOptions(gradedFilePoignees126));
        gradedFootage126.parentFolder = fromGradingFolder;
        gradedFootage126.name = "UNDLM_00126_AVEC_POIGNEES";
        gradingSources[126] = gradedFootage126;
        gradingImportCount++;
        gradedImportSuccess126 = true;
        gradedFileName126 = "UNDLM_00126_AVEC_POIGNEES.mov";
        logImportSuccess(126, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00126_AVEC_POIGNEES.mov", gradedFileName126);
    } catch (e) {
        logImportError(126, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00126_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess126 && gradedFileBis126.exists) {
    try {
        var gradedFootage126 = project.importFile(new ImportOptions(gradedFileBis126));
        gradedFootage126.parentFolder = fromGradingFolder;
        gradedFootage126.name = "UNDLM_00126bis";
        gradingSources[126] = gradedFootage126;
        gradingImportCount++;
        gradedImportSuccess126 = true;
        gradedFileName126 = "UNDLM_00126bis.mov";
        logImportSuccess(126, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00126bis.mov", gradedFileName126);
    } catch (e) {
        logImportError(126, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00126bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess126) {
    missingGradingCount++;
}

// Import plan GRADED 00127
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile127 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00127.mov");
var gradedFilePoignees127 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00127_AVEC_POIGNEES.mov");
var gradedFileBis127 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00127bis.mov");

var gradedImportSuccess127 = false;
var gradedFileName127 = "";

// Tenter import standard
if (gradedFile127.exists) {
    try {
        var gradedFootage127 = project.importFile(new ImportOptions(gradedFile127));
        gradedFootage127.parentFolder = fromGradingFolder;
        gradedFootage127.name = "UNDLM_00127";
        gradingSources[127] = gradedFootage127;
        gradingImportCount++;
        gradedImportSuccess127 = true;
        gradedFileName127 = "UNDLM_00127.mov";
        logImportSuccess(127, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00127.mov", gradedFileName127);
    } catch (e) {
        logImportError(127, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00127.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess127 && gradedFilePoignees127.exists) {
    try {
        var gradedFootage127 = project.importFile(new ImportOptions(gradedFilePoignees127));
        gradedFootage127.parentFolder = fromGradingFolder;
        gradedFootage127.name = "UNDLM_00127_AVEC_POIGNEES";
        gradingSources[127] = gradedFootage127;
        gradingImportCount++;
        gradedImportSuccess127 = true;
        gradedFileName127 = "UNDLM_00127_AVEC_POIGNEES.mov";
        logImportSuccess(127, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00127_AVEC_POIGNEES.mov", gradedFileName127);
    } catch (e) {
        logImportError(127, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00127_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess127 && gradedFileBis127.exists) {
    try {
        var gradedFootage127 = project.importFile(new ImportOptions(gradedFileBis127));
        gradedFootage127.parentFolder = fromGradingFolder;
        gradedFootage127.name = "UNDLM_00127bis";
        gradingSources[127] = gradedFootage127;
        gradingImportCount++;
        gradedImportSuccess127 = true;
        gradedFileName127 = "UNDLM_00127bis.mov";
        logImportSuccess(127, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00127bis.mov", gradedFileName127);
    } catch (e) {
        logImportError(127, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00127bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess127) {
    missingGradingCount++;
}

// Import plan GRADED 00128
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile128 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00128.mov");
var gradedFilePoignees128 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00128_AVEC_POIGNEES.mov");
var gradedFileBis128 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00128bis.mov");

var gradedImportSuccess128 = false;
var gradedFileName128 = "";

// Tenter import standard
if (gradedFile128.exists) {
    try {
        var gradedFootage128 = project.importFile(new ImportOptions(gradedFile128));
        gradedFootage128.parentFolder = fromGradingFolder;
        gradedFootage128.name = "UNDLM_00128";
        gradingSources[128] = gradedFootage128;
        gradingImportCount++;
        gradedImportSuccess128 = true;
        gradedFileName128 = "UNDLM_00128.mov";
        logImportSuccess(128, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00128.mov", gradedFileName128);
    } catch (e) {
        logImportError(128, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00128.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess128 && gradedFilePoignees128.exists) {
    try {
        var gradedFootage128 = project.importFile(new ImportOptions(gradedFilePoignees128));
        gradedFootage128.parentFolder = fromGradingFolder;
        gradedFootage128.name = "UNDLM_00128_AVEC_POIGNEES";
        gradingSources[128] = gradedFootage128;
        gradingImportCount++;
        gradedImportSuccess128 = true;
        gradedFileName128 = "UNDLM_00128_AVEC_POIGNEES.mov";
        logImportSuccess(128, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00128_AVEC_POIGNEES.mov", gradedFileName128);
    } catch (e) {
        logImportError(128, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00128_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess128 && gradedFileBis128.exists) {
    try {
        var gradedFootage128 = project.importFile(new ImportOptions(gradedFileBis128));
        gradedFootage128.parentFolder = fromGradingFolder;
        gradedFootage128.name = "UNDLM_00128bis";
        gradingSources[128] = gradedFootage128;
        gradingImportCount++;
        gradedImportSuccess128 = true;
        gradedFileName128 = "UNDLM_00128bis.mov";
        logImportSuccess(128, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00128bis.mov", gradedFileName128);
    } catch (e) {
        logImportError(128, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00128bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess128) {
    missingGradingCount++;
}

// Import plan GRADED 00129
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile129 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00129.mov");
var gradedFilePoignees129 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00129_AVEC_POIGNEES.mov");
var gradedFileBis129 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00129bis.mov");

var gradedImportSuccess129 = false;
var gradedFileName129 = "";

// Tenter import standard
if (gradedFile129.exists) {
    try {
        var gradedFootage129 = project.importFile(new ImportOptions(gradedFile129));
        gradedFootage129.parentFolder = fromGradingFolder;
        gradedFootage129.name = "UNDLM_00129";
        gradingSources[129] = gradedFootage129;
        gradingImportCount++;
        gradedImportSuccess129 = true;
        gradedFileName129 = "UNDLM_00129.mov";
        logImportSuccess(129, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00129.mov", gradedFileName129);
    } catch (e) {
        logImportError(129, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00129.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess129 && gradedFilePoignees129.exists) {
    try {
        var gradedFootage129 = project.importFile(new ImportOptions(gradedFilePoignees129));
        gradedFootage129.parentFolder = fromGradingFolder;
        gradedFootage129.name = "UNDLM_00129_AVEC_POIGNEES";
        gradingSources[129] = gradedFootage129;
        gradingImportCount++;
        gradedImportSuccess129 = true;
        gradedFileName129 = "UNDLM_00129_AVEC_POIGNEES.mov";
        logImportSuccess(129, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00129_AVEC_POIGNEES.mov", gradedFileName129);
    } catch (e) {
        logImportError(129, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00129_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess129 && gradedFileBis129.exists) {
    try {
        var gradedFootage129 = project.importFile(new ImportOptions(gradedFileBis129));
        gradedFootage129.parentFolder = fromGradingFolder;
        gradedFootage129.name = "UNDLM_00129bis";
        gradingSources[129] = gradedFootage129;
        gradingImportCount++;
        gradedImportSuccess129 = true;
        gradedFileName129 = "UNDLM_00129bis.mov";
        logImportSuccess(129, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00129bis.mov", gradedFileName129);
    } catch (e) {
        logImportError(129, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00129bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess129) {
    missingGradingCount++;
}

// Import plan GRADED 00130
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile130 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00130.mov");
var gradedFilePoignees130 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00130_AVEC_POIGNEES.mov");
var gradedFileBis130 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00130bis.mov");

var gradedImportSuccess130 = false;
var gradedFileName130 = "";

// Tenter import standard
if (gradedFile130.exists) {
    try {
        var gradedFootage130 = project.importFile(new ImportOptions(gradedFile130));
        gradedFootage130.parentFolder = fromGradingFolder;
        gradedFootage130.name = "UNDLM_00130";
        gradingSources[130] = gradedFootage130;
        gradingImportCount++;
        gradedImportSuccess130 = true;
        gradedFileName130 = "UNDLM_00130.mov";
        logImportSuccess(130, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00130.mov", gradedFileName130);
    } catch (e) {
        logImportError(130, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00130.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess130 && gradedFilePoignees130.exists) {
    try {
        var gradedFootage130 = project.importFile(new ImportOptions(gradedFilePoignees130));
        gradedFootage130.parentFolder = fromGradingFolder;
        gradedFootage130.name = "UNDLM_00130_AVEC_POIGNEES";
        gradingSources[130] = gradedFootage130;
        gradingImportCount++;
        gradedImportSuccess130 = true;
        gradedFileName130 = "UNDLM_00130_AVEC_POIGNEES.mov";
        logImportSuccess(130, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00130_AVEC_POIGNEES.mov", gradedFileName130);
    } catch (e) {
        logImportError(130, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00130_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess130 && gradedFileBis130.exists) {
    try {
        var gradedFootage130 = project.importFile(new ImportOptions(gradedFileBis130));
        gradedFootage130.parentFolder = fromGradingFolder;
        gradedFootage130.name = "UNDLM_00130bis";
        gradingSources[130] = gradedFootage130;
        gradingImportCount++;
        gradedImportSuccess130 = true;
        gradedFileName130 = "UNDLM_00130bis.mov";
        logImportSuccess(130, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00130bis.mov", gradedFileName130);
    } catch (e) {
        logImportError(130, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00130bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess130) {
    missingGradingCount++;
}

// Import plan GRADED 00131
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile131 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00131.mov");
var gradedFilePoignees131 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00131_AVEC_POIGNEES.mov");
var gradedFileBis131 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00131bis.mov");

var gradedImportSuccess131 = false;
var gradedFileName131 = "";

// Tenter import standard
if (gradedFile131.exists) {
    try {
        var gradedFootage131 = project.importFile(new ImportOptions(gradedFile131));
        gradedFootage131.parentFolder = fromGradingFolder;
        gradedFootage131.name = "UNDLM_00131";
        gradingSources[131] = gradedFootage131;
        gradingImportCount++;
        gradedImportSuccess131 = true;
        gradedFileName131 = "UNDLM_00131.mov";
        logImportSuccess(131, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00131.mov", gradedFileName131);
    } catch (e) {
        logImportError(131, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00131.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess131 && gradedFilePoignees131.exists) {
    try {
        var gradedFootage131 = project.importFile(new ImportOptions(gradedFilePoignees131));
        gradedFootage131.parentFolder = fromGradingFolder;
        gradedFootage131.name = "UNDLM_00131_AVEC_POIGNEES";
        gradingSources[131] = gradedFootage131;
        gradingImportCount++;
        gradedImportSuccess131 = true;
        gradedFileName131 = "UNDLM_00131_AVEC_POIGNEES.mov";
        logImportSuccess(131, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00131_AVEC_POIGNEES.mov", gradedFileName131);
    } catch (e) {
        logImportError(131, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00131_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess131 && gradedFileBis131.exists) {
    try {
        var gradedFootage131 = project.importFile(new ImportOptions(gradedFileBis131));
        gradedFootage131.parentFolder = fromGradingFolder;
        gradedFootage131.name = "UNDLM_00131bis";
        gradingSources[131] = gradedFootage131;
        gradingImportCount++;
        gradedImportSuccess131 = true;
        gradedFileName131 = "UNDLM_00131bis.mov";
        logImportSuccess(131, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00131bis.mov", gradedFileName131);
    } catch (e) {
        logImportError(131, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00131bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess131) {
    missingGradingCount++;
}

// Import plan GRADED 00132
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile132 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00132.mov");
var gradedFilePoignees132 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00132_AVEC_POIGNEES.mov");
var gradedFileBis132 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00132bis.mov");

var gradedImportSuccess132 = false;
var gradedFileName132 = "";

// Tenter import standard
if (gradedFile132.exists) {
    try {
        var gradedFootage132 = project.importFile(new ImportOptions(gradedFile132));
        gradedFootage132.parentFolder = fromGradingFolder;
        gradedFootage132.name = "UNDLM_00132";
        gradingSources[132] = gradedFootage132;
        gradingImportCount++;
        gradedImportSuccess132 = true;
        gradedFileName132 = "UNDLM_00132.mov";
        logImportSuccess(132, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00132.mov", gradedFileName132);
    } catch (e) {
        logImportError(132, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00132.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess132 && gradedFilePoignees132.exists) {
    try {
        var gradedFootage132 = project.importFile(new ImportOptions(gradedFilePoignees132));
        gradedFootage132.parentFolder = fromGradingFolder;
        gradedFootage132.name = "UNDLM_00132_AVEC_POIGNEES";
        gradingSources[132] = gradedFootage132;
        gradingImportCount++;
        gradedImportSuccess132 = true;
        gradedFileName132 = "UNDLM_00132_AVEC_POIGNEES.mov";
        logImportSuccess(132, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00132_AVEC_POIGNEES.mov", gradedFileName132);
    } catch (e) {
        logImportError(132, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00132_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess132 && gradedFileBis132.exists) {
    try {
        var gradedFootage132 = project.importFile(new ImportOptions(gradedFileBis132));
        gradedFootage132.parentFolder = fromGradingFolder;
        gradedFootage132.name = "UNDLM_00132bis";
        gradingSources[132] = gradedFootage132;
        gradingImportCount++;
        gradedImportSuccess132 = true;
        gradedFileName132 = "UNDLM_00132bis.mov";
        logImportSuccess(132, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00132bis.mov", gradedFileName132);
    } catch (e) {
        logImportError(132, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00132bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess132) {
    missingGradingCount++;
}

// Import plan GRADED 00133
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile133 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00133.mov");
var gradedFilePoignees133 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00133_AVEC_POIGNEES.mov");
var gradedFileBis133 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00133bis.mov");

var gradedImportSuccess133 = false;
var gradedFileName133 = "";

// Tenter import standard
if (gradedFile133.exists) {
    try {
        var gradedFootage133 = project.importFile(new ImportOptions(gradedFile133));
        gradedFootage133.parentFolder = fromGradingFolder;
        gradedFootage133.name = "UNDLM_00133";
        gradingSources[133] = gradedFootage133;
        gradingImportCount++;
        gradedImportSuccess133 = true;
        gradedFileName133 = "UNDLM_00133.mov";
        logImportSuccess(133, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00133.mov", gradedFileName133);
    } catch (e) {
        logImportError(133, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00133.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess133 && gradedFilePoignees133.exists) {
    try {
        var gradedFootage133 = project.importFile(new ImportOptions(gradedFilePoignees133));
        gradedFootage133.parentFolder = fromGradingFolder;
        gradedFootage133.name = "UNDLM_00133_AVEC_POIGNEES";
        gradingSources[133] = gradedFootage133;
        gradingImportCount++;
        gradedImportSuccess133 = true;
        gradedFileName133 = "UNDLM_00133_AVEC_POIGNEES.mov";
        logImportSuccess(133, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00133_AVEC_POIGNEES.mov", gradedFileName133);
    } catch (e) {
        logImportError(133, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00133_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess133 && gradedFileBis133.exists) {
    try {
        var gradedFootage133 = project.importFile(new ImportOptions(gradedFileBis133));
        gradedFootage133.parentFolder = fromGradingFolder;
        gradedFootage133.name = "UNDLM_00133bis";
        gradingSources[133] = gradedFootage133;
        gradingImportCount++;
        gradedImportSuccess133 = true;
        gradedFileName133 = "UNDLM_00133bis.mov";
        logImportSuccess(133, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00133bis.mov", gradedFileName133);
    } catch (e) {
        logImportError(133, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00133bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess133) {
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


// Composition pour plan 00118
var planComp118 = project.items.addComp(
    "SQ05_UNDLM_00118_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp118.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer118 = planComp118.layers.add(bgSolidComp);
bgLayer118.name = "BG_SOLID";
bgLayer118.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer118 = false;
if (gradingSources[118]) {
    var gradedLayer118 = planComp118.layers.add(gradingSources[118]);
    gradedLayer118.name = "UNDLM_00118_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer118.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer118.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer118 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer118 = false;
if (editSources[118]) {
    var editLayer118 = planComp118.layers.add(editSources[118]);
    editLayer118.name = "UNDLM_00118_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer118.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer118.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer118 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity118 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer118) {
    // EDIT toujours activé quand disponible
    editLayer118.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer118) {
        gradedLayer118.enabled = false;
    }
} else if (hasGradedLayer118) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer118.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText118 = planComp118.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText118.name = "WARNING_NO_EDIT";
    warningText118.property("Transform").property("Position").setValue([1280, 200]);
    warningText118.guideLayer = true;
    
    var warningTextDoc118 = warningText118.property("Source Text").value;
    warningTextDoc118.fontSize = 32;
    warningTextDoc118.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc118.font = "Arial-BoldMT";
    warningTextDoc118.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText118.property("Source Text").setValue(warningTextDoc118);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText118 = planComp118.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00118");
    errorText118.name = "ERROR_NO_SOURCE";
    errorText118.property("Transform").property("Position").setValue([1280, 720]);
    errorText118.guideLayer = true;
    
    var errorTextDoc118 = errorText118.property("Source Text").value;
    errorTextDoc118.fontSize = 48;
    errorTextDoc118.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc118.font = "Arial-BoldMT";
    errorTextDoc118.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText118.property("Source Text").setValue(errorTextDoc118);
}

planCompositions[118] = planComp118;


// Composition pour plan 00119
var planComp119 = project.items.addComp(
    "SQ05_UNDLM_00119_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp119.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer119 = planComp119.layers.add(bgSolidComp);
bgLayer119.name = "BG_SOLID";
bgLayer119.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer119 = false;
if (gradingSources[119]) {
    var gradedLayer119 = planComp119.layers.add(gradingSources[119]);
    gradedLayer119.name = "UNDLM_00119_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer119.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer119.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer119 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer119 = false;
if (editSources[119]) {
    var editLayer119 = planComp119.layers.add(editSources[119]);
    editLayer119.name = "UNDLM_00119_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer119.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer119.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer119 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity119 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer119) {
    // EDIT toujours activé quand disponible
    editLayer119.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer119) {
        gradedLayer119.enabled = false;
    }
} else if (hasGradedLayer119) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer119.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText119 = planComp119.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText119.name = "WARNING_NO_EDIT";
    warningText119.property("Transform").property("Position").setValue([1280, 200]);
    warningText119.guideLayer = true;
    
    var warningTextDoc119 = warningText119.property("Source Text").value;
    warningTextDoc119.fontSize = 32;
    warningTextDoc119.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc119.font = "Arial-BoldMT";
    warningTextDoc119.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText119.property("Source Text").setValue(warningTextDoc119);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText119 = planComp119.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00119");
    errorText119.name = "ERROR_NO_SOURCE";
    errorText119.property("Transform").property("Position").setValue([1280, 720]);
    errorText119.guideLayer = true;
    
    var errorTextDoc119 = errorText119.property("Source Text").value;
    errorTextDoc119.fontSize = 48;
    errorTextDoc119.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc119.font = "Arial-BoldMT";
    errorTextDoc119.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText119.property("Source Text").setValue(errorTextDoc119);
}

planCompositions[119] = planComp119;


// Composition pour plan 00120
var planComp120 = project.items.addComp(
    "SQ05_UNDLM_00120_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp120.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer120 = planComp120.layers.add(bgSolidComp);
bgLayer120.name = "BG_SOLID";
bgLayer120.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer120 = false;
if (gradingSources[120]) {
    var gradedLayer120 = planComp120.layers.add(gradingSources[120]);
    gradedLayer120.name = "UNDLM_00120_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer120.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer120.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer120 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer120 = false;
if (editSources[120]) {
    var editLayer120 = planComp120.layers.add(editSources[120]);
    editLayer120.name = "UNDLM_00120_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer120.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer120.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer120 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity120 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer120) {
    // EDIT toujours activé quand disponible
    editLayer120.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer120) {
        gradedLayer120.enabled = false;
    }
} else if (hasGradedLayer120) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer120.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText120 = planComp120.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText120.name = "WARNING_NO_EDIT";
    warningText120.property("Transform").property("Position").setValue([1280, 200]);
    warningText120.guideLayer = true;
    
    var warningTextDoc120 = warningText120.property("Source Text").value;
    warningTextDoc120.fontSize = 32;
    warningTextDoc120.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc120.font = "Arial-BoldMT";
    warningTextDoc120.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText120.property("Source Text").setValue(warningTextDoc120);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText120 = planComp120.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00120");
    errorText120.name = "ERROR_NO_SOURCE";
    errorText120.property("Transform").property("Position").setValue([1280, 720]);
    errorText120.guideLayer = true;
    
    var errorTextDoc120 = errorText120.property("Source Text").value;
    errorTextDoc120.fontSize = 48;
    errorTextDoc120.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc120.font = "Arial-BoldMT";
    errorTextDoc120.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText120.property("Source Text").setValue(errorTextDoc120);
}

planCompositions[120] = planComp120;


// Composition pour plan 00121
var planComp121 = project.items.addComp(
    "SQ05_UNDLM_00121_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp121.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer121 = planComp121.layers.add(bgSolidComp);
bgLayer121.name = "BG_SOLID";
bgLayer121.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer121 = false;
if (gradingSources[121]) {
    var gradedLayer121 = planComp121.layers.add(gradingSources[121]);
    gradedLayer121.name = "UNDLM_00121_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer121.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer121.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer121 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer121 = false;
if (editSources[121]) {
    var editLayer121 = planComp121.layers.add(editSources[121]);
    editLayer121.name = "UNDLM_00121_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer121.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer121.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer121 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity121 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer121) {
    // EDIT toujours activé quand disponible
    editLayer121.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer121) {
        gradedLayer121.enabled = false;
    }
} else if (hasGradedLayer121) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer121.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText121 = planComp121.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText121.name = "WARNING_NO_EDIT";
    warningText121.property("Transform").property("Position").setValue([1280, 200]);
    warningText121.guideLayer = true;
    
    var warningTextDoc121 = warningText121.property("Source Text").value;
    warningTextDoc121.fontSize = 32;
    warningTextDoc121.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc121.font = "Arial-BoldMT";
    warningTextDoc121.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText121.property("Source Text").setValue(warningTextDoc121);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText121 = planComp121.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00121");
    errorText121.name = "ERROR_NO_SOURCE";
    errorText121.property("Transform").property("Position").setValue([1280, 720]);
    errorText121.guideLayer = true;
    
    var errorTextDoc121 = errorText121.property("Source Text").value;
    errorTextDoc121.fontSize = 48;
    errorTextDoc121.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc121.font = "Arial-BoldMT";
    errorTextDoc121.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText121.property("Source Text").setValue(errorTextDoc121);
}

planCompositions[121] = planComp121;


// Composition pour plan 00122
var planComp122 = project.items.addComp(
    "SQ05_UNDLM_00122_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp122.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer122 = planComp122.layers.add(bgSolidComp);
bgLayer122.name = "BG_SOLID";
bgLayer122.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer122 = false;
if (gradingSources[122]) {
    var gradedLayer122 = planComp122.layers.add(gradingSources[122]);
    gradedLayer122.name = "UNDLM_00122_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer122.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer122.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer122 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer122 = false;
if (editSources[122]) {
    var editLayer122 = planComp122.layers.add(editSources[122]);
    editLayer122.name = "UNDLM_00122_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer122.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer122.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer122 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity122 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer122) {
    // EDIT toujours activé quand disponible
    editLayer122.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer122) {
        gradedLayer122.enabled = false;
    }
} else if (hasGradedLayer122) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer122.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText122 = planComp122.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText122.name = "WARNING_NO_EDIT";
    warningText122.property("Transform").property("Position").setValue([1280, 200]);
    warningText122.guideLayer = true;
    
    var warningTextDoc122 = warningText122.property("Source Text").value;
    warningTextDoc122.fontSize = 32;
    warningTextDoc122.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc122.font = "Arial-BoldMT";
    warningTextDoc122.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText122.property("Source Text").setValue(warningTextDoc122);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText122 = planComp122.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00122");
    errorText122.name = "ERROR_NO_SOURCE";
    errorText122.property("Transform").property("Position").setValue([1280, 720]);
    errorText122.guideLayer = true;
    
    var errorTextDoc122 = errorText122.property("Source Text").value;
    errorTextDoc122.fontSize = 48;
    errorTextDoc122.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc122.font = "Arial-BoldMT";
    errorTextDoc122.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText122.property("Source Text").setValue(errorTextDoc122);
}

planCompositions[122] = planComp122;


// Composition pour plan 00123
var planComp123 = project.items.addComp(
    "SQ05_UNDLM_00123_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.32,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp123.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer123 = planComp123.layers.add(bgSolidComp);
bgLayer123.name = "BG_SOLID";
bgLayer123.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer123 = false;
if (gradingSources[123]) {
    var gradedLayer123 = planComp123.layers.add(gradingSources[123]);
    gradedLayer123.name = "UNDLM_00123_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer123.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer123.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer123 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer123 = false;
if (editSources[123]) {
    var editLayer123 = planComp123.layers.add(editSources[123]);
    editLayer123.name = "UNDLM_00123_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer123.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer123.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer123 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity123 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer123) {
    // EDIT toujours activé quand disponible
    editLayer123.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer123) {
        gradedLayer123.enabled = false;
    }
} else if (hasGradedLayer123) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer123.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText123 = planComp123.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText123.name = "WARNING_NO_EDIT";
    warningText123.property("Transform").property("Position").setValue([1280, 200]);
    warningText123.guideLayer = true;
    
    var warningTextDoc123 = warningText123.property("Source Text").value;
    warningTextDoc123.fontSize = 32;
    warningTextDoc123.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc123.font = "Arial-BoldMT";
    warningTextDoc123.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText123.property("Source Text").setValue(warningTextDoc123);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText123 = planComp123.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00123");
    errorText123.name = "ERROR_NO_SOURCE";
    errorText123.property("Transform").property("Position").setValue([1280, 720]);
    errorText123.guideLayer = true;
    
    var errorTextDoc123 = errorText123.property("Source Text").value;
    errorTextDoc123.fontSize = 48;
    errorTextDoc123.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc123.font = "Arial-BoldMT";
    errorTextDoc123.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText123.property("Source Text").setValue(errorTextDoc123);
}

planCompositions[123] = planComp123;


// Composition pour plan 00124
var planComp124 = project.items.addComp(
    "SQ05_UNDLM_00124_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp124.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer124 = planComp124.layers.add(bgSolidComp);
bgLayer124.name = "BG_SOLID";
bgLayer124.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer124 = false;
if (gradingSources[124]) {
    var gradedLayer124 = planComp124.layers.add(gradingSources[124]);
    gradedLayer124.name = "UNDLM_00124_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer124.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer124.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer124 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer124 = false;
if (editSources[124]) {
    var editLayer124 = planComp124.layers.add(editSources[124]);
    editLayer124.name = "UNDLM_00124_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer124.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer124.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer124 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity124 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer124) {
    // EDIT toujours activé quand disponible
    editLayer124.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer124) {
        gradedLayer124.enabled = false;
    }
} else if (hasGradedLayer124) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer124.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText124 = planComp124.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText124.name = "WARNING_NO_EDIT";
    warningText124.property("Transform").property("Position").setValue([1280, 200]);
    warningText124.guideLayer = true;
    
    var warningTextDoc124 = warningText124.property("Source Text").value;
    warningTextDoc124.fontSize = 32;
    warningTextDoc124.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc124.font = "Arial-BoldMT";
    warningTextDoc124.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText124.property("Source Text").setValue(warningTextDoc124);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText124 = planComp124.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00124");
    errorText124.name = "ERROR_NO_SOURCE";
    errorText124.property("Transform").property("Position").setValue([1280, 720]);
    errorText124.guideLayer = true;
    
    var errorTextDoc124 = errorText124.property("Source Text").value;
    errorTextDoc124.fontSize = 48;
    errorTextDoc124.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc124.font = "Arial-BoldMT";
    errorTextDoc124.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText124.property("Source Text").setValue(errorTextDoc124);
}

planCompositions[124] = planComp124;


// Composition pour plan 00125
var planComp125 = project.items.addComp(
    "SQ05_UNDLM_00125_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp125.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer125 = planComp125.layers.add(bgSolidComp);
bgLayer125.name = "BG_SOLID";
bgLayer125.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer125 = false;
if (gradingSources[125]) {
    var gradedLayer125 = planComp125.layers.add(gradingSources[125]);
    gradedLayer125.name = "UNDLM_00125_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer125.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer125.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer125 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer125 = false;
if (editSources[125]) {
    var editLayer125 = planComp125.layers.add(editSources[125]);
    editLayer125.name = "UNDLM_00125_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer125.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer125.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer125 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity125 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer125) {
    // EDIT toujours activé quand disponible
    editLayer125.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer125) {
        gradedLayer125.enabled = false;
    }
} else if (hasGradedLayer125) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer125.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText125 = planComp125.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText125.name = "WARNING_NO_EDIT";
    warningText125.property("Transform").property("Position").setValue([1280, 200]);
    warningText125.guideLayer = true;
    
    var warningTextDoc125 = warningText125.property("Source Text").value;
    warningTextDoc125.fontSize = 32;
    warningTextDoc125.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc125.font = "Arial-BoldMT";
    warningTextDoc125.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText125.property("Source Text").setValue(warningTextDoc125);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText125 = planComp125.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00125");
    errorText125.name = "ERROR_NO_SOURCE";
    errorText125.property("Transform").property("Position").setValue([1280, 720]);
    errorText125.guideLayer = true;
    
    var errorTextDoc125 = errorText125.property("Source Text").value;
    errorTextDoc125.fontSize = 48;
    errorTextDoc125.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc125.font = "Arial-BoldMT";
    errorTextDoc125.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText125.property("Source Text").setValue(errorTextDoc125);
}

planCompositions[125] = planComp125;


// Composition pour plan 00126
var planComp126 = project.items.addComp(
    "SQ05_UNDLM_00126_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp126.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer126 = planComp126.layers.add(bgSolidComp);
bgLayer126.name = "BG_SOLID";
bgLayer126.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer126 = false;
if (gradingSources[126]) {
    var gradedLayer126 = planComp126.layers.add(gradingSources[126]);
    gradedLayer126.name = "UNDLM_00126_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer126.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer126.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer126 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer126 = false;
if (editSources[126]) {
    var editLayer126 = planComp126.layers.add(editSources[126]);
    editLayer126.name = "UNDLM_00126_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer126.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer126.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer126 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity126 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer126) {
    // EDIT toujours activé quand disponible
    editLayer126.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer126) {
        gradedLayer126.enabled = false;
    }
} else if (hasGradedLayer126) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer126.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText126 = planComp126.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText126.name = "WARNING_NO_EDIT";
    warningText126.property("Transform").property("Position").setValue([1280, 200]);
    warningText126.guideLayer = true;
    
    var warningTextDoc126 = warningText126.property("Source Text").value;
    warningTextDoc126.fontSize = 32;
    warningTextDoc126.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc126.font = "Arial-BoldMT";
    warningTextDoc126.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText126.property("Source Text").setValue(warningTextDoc126);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText126 = planComp126.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00126");
    errorText126.name = "ERROR_NO_SOURCE";
    errorText126.property("Transform").property("Position").setValue([1280, 720]);
    errorText126.guideLayer = true;
    
    var errorTextDoc126 = errorText126.property("Source Text").value;
    errorTextDoc126.fontSize = 48;
    errorTextDoc126.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc126.font = "Arial-BoldMT";
    errorTextDoc126.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText126.property("Source Text").setValue(errorTextDoc126);
}

planCompositions[126] = planComp126;


// Composition pour plan 00127
var planComp127 = project.items.addComp(
    "SQ05_UNDLM_00127_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp127.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer127 = planComp127.layers.add(bgSolidComp);
bgLayer127.name = "BG_SOLID";
bgLayer127.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer127 = false;
if (gradingSources[127]) {
    var gradedLayer127 = planComp127.layers.add(gradingSources[127]);
    gradedLayer127.name = "UNDLM_00127_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer127.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer127.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer127 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer127 = false;
if (editSources[127]) {
    var editLayer127 = planComp127.layers.add(editSources[127]);
    editLayer127.name = "UNDLM_00127_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer127.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer127.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer127 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity127 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer127) {
    // EDIT toujours activé quand disponible
    editLayer127.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer127) {
        gradedLayer127.enabled = false;
    }
} else if (hasGradedLayer127) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer127.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText127 = planComp127.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText127.name = "WARNING_NO_EDIT";
    warningText127.property("Transform").property("Position").setValue([1280, 200]);
    warningText127.guideLayer = true;
    
    var warningTextDoc127 = warningText127.property("Source Text").value;
    warningTextDoc127.fontSize = 32;
    warningTextDoc127.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc127.font = "Arial-BoldMT";
    warningTextDoc127.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText127.property("Source Text").setValue(warningTextDoc127);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText127 = planComp127.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00127");
    errorText127.name = "ERROR_NO_SOURCE";
    errorText127.property("Transform").property("Position").setValue([1280, 720]);
    errorText127.guideLayer = true;
    
    var errorTextDoc127 = errorText127.property("Source Text").value;
    errorTextDoc127.fontSize = 48;
    errorTextDoc127.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc127.font = "Arial-BoldMT";
    errorTextDoc127.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText127.property("Source Text").setValue(errorTextDoc127);
}

planCompositions[127] = planComp127;


// Composition pour plan 00128
var planComp128 = project.items.addComp(
    "SQ05_UNDLM_00128_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp128.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer128 = planComp128.layers.add(bgSolidComp);
bgLayer128.name = "BG_SOLID";
bgLayer128.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer128 = false;
if (gradingSources[128]) {
    var gradedLayer128 = planComp128.layers.add(gradingSources[128]);
    gradedLayer128.name = "UNDLM_00128_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer128.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer128.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer128 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer128 = false;
if (editSources[128]) {
    var editLayer128 = planComp128.layers.add(editSources[128]);
    editLayer128.name = "UNDLM_00128_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer128.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer128.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer128 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity128 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer128) {
    // EDIT toujours activé quand disponible
    editLayer128.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer128) {
        gradedLayer128.enabled = false;
    }
} else if (hasGradedLayer128) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer128.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText128 = planComp128.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText128.name = "WARNING_NO_EDIT";
    warningText128.property("Transform").property("Position").setValue([1280, 200]);
    warningText128.guideLayer = true;
    
    var warningTextDoc128 = warningText128.property("Source Text").value;
    warningTextDoc128.fontSize = 32;
    warningTextDoc128.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc128.font = "Arial-BoldMT";
    warningTextDoc128.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText128.property("Source Text").setValue(warningTextDoc128);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText128 = planComp128.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00128");
    errorText128.name = "ERROR_NO_SOURCE";
    errorText128.property("Transform").property("Position").setValue([1280, 720]);
    errorText128.guideLayer = true;
    
    var errorTextDoc128 = errorText128.property("Source Text").value;
    errorTextDoc128.fontSize = 48;
    errorTextDoc128.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc128.font = "Arial-BoldMT";
    errorTextDoc128.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText128.property("Source Text").setValue(errorTextDoc128);
}

planCompositions[128] = planComp128;


// Composition pour plan 00129
var planComp129 = project.items.addComp(
    "SQ05_UNDLM_00129_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp129.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer129 = planComp129.layers.add(bgSolidComp);
bgLayer129.name = "BG_SOLID";
bgLayer129.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer129 = false;
if (gradingSources[129]) {
    var gradedLayer129 = planComp129.layers.add(gradingSources[129]);
    gradedLayer129.name = "UNDLM_00129_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer129.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer129.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer129 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer129 = false;
if (editSources[129]) {
    var editLayer129 = planComp129.layers.add(editSources[129]);
    editLayer129.name = "UNDLM_00129_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer129.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer129.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer129 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity129 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer129) {
    // EDIT toujours activé quand disponible
    editLayer129.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer129) {
        gradedLayer129.enabled = false;
    }
} else if (hasGradedLayer129) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer129.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText129 = planComp129.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText129.name = "WARNING_NO_EDIT";
    warningText129.property("Transform").property("Position").setValue([1280, 200]);
    warningText129.guideLayer = true;
    
    var warningTextDoc129 = warningText129.property("Source Text").value;
    warningTextDoc129.fontSize = 32;
    warningTextDoc129.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc129.font = "Arial-BoldMT";
    warningTextDoc129.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText129.property("Source Text").setValue(warningTextDoc129);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText129 = planComp129.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00129");
    errorText129.name = "ERROR_NO_SOURCE";
    errorText129.property("Transform").property("Position").setValue([1280, 720]);
    errorText129.guideLayer = true;
    
    var errorTextDoc129 = errorText129.property("Source Text").value;
    errorTextDoc129.fontSize = 48;
    errorTextDoc129.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc129.font = "Arial-BoldMT";
    errorTextDoc129.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText129.property("Source Text").setValue(errorTextDoc129);
}

planCompositions[129] = planComp129;


// Composition pour plan 00130
var planComp130 = project.items.addComp(
    "SQ05_UNDLM_00130_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp130.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer130 = planComp130.layers.add(bgSolidComp);
bgLayer130.name = "BG_SOLID";
bgLayer130.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer130 = false;
if (gradingSources[130]) {
    var gradedLayer130 = planComp130.layers.add(gradingSources[130]);
    gradedLayer130.name = "UNDLM_00130_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer130.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer130.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer130 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer130 = false;
if (editSources[130]) {
    var editLayer130 = planComp130.layers.add(editSources[130]);
    editLayer130.name = "UNDLM_00130_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer130.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer130.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer130 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity130 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer130) {
    // EDIT toujours activé quand disponible
    editLayer130.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer130) {
        gradedLayer130.enabled = false;
    }
} else if (hasGradedLayer130) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer130.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText130 = planComp130.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText130.name = "WARNING_NO_EDIT";
    warningText130.property("Transform").property("Position").setValue([1280, 200]);
    warningText130.guideLayer = true;
    
    var warningTextDoc130 = warningText130.property("Source Text").value;
    warningTextDoc130.fontSize = 32;
    warningTextDoc130.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc130.font = "Arial-BoldMT";
    warningTextDoc130.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText130.property("Source Text").setValue(warningTextDoc130);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText130 = planComp130.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00130");
    errorText130.name = "ERROR_NO_SOURCE";
    errorText130.property("Transform").property("Position").setValue([1280, 720]);
    errorText130.guideLayer = true;
    
    var errorTextDoc130 = errorText130.property("Source Text").value;
    errorTextDoc130.fontSize = 48;
    errorTextDoc130.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc130.font = "Arial-BoldMT";
    errorTextDoc130.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText130.property("Source Text").setValue(errorTextDoc130);
}

planCompositions[130] = planComp130;


// Composition pour plan 00131
var planComp131 = project.items.addComp(
    "SQ05_UNDLM_00131_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp131.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer131 = planComp131.layers.add(bgSolidComp);
bgLayer131.name = "BG_SOLID";
bgLayer131.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer131 = false;
if (gradingSources[131]) {
    var gradedLayer131 = planComp131.layers.add(gradingSources[131]);
    gradedLayer131.name = "UNDLM_00131_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer131.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer131.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer131 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer131 = false;
if (editSources[131]) {
    var editLayer131 = planComp131.layers.add(editSources[131]);
    editLayer131.name = "UNDLM_00131_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer131.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer131.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer131 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity131 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer131) {
    // EDIT toujours activé quand disponible
    editLayer131.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer131) {
        gradedLayer131.enabled = false;
    }
} else if (hasGradedLayer131) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer131.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText131 = planComp131.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText131.name = "WARNING_NO_EDIT";
    warningText131.property("Transform").property("Position").setValue([1280, 200]);
    warningText131.guideLayer = true;
    
    var warningTextDoc131 = warningText131.property("Source Text").value;
    warningTextDoc131.fontSize = 32;
    warningTextDoc131.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc131.font = "Arial-BoldMT";
    warningTextDoc131.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText131.property("Source Text").setValue(warningTextDoc131);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText131 = planComp131.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00131");
    errorText131.name = "ERROR_NO_SOURCE";
    errorText131.property("Transform").property("Position").setValue([1280, 720]);
    errorText131.guideLayer = true;
    
    var errorTextDoc131 = errorText131.property("Source Text").value;
    errorTextDoc131.fontSize = 48;
    errorTextDoc131.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc131.font = "Arial-BoldMT";
    errorTextDoc131.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText131.property("Source Text").setValue(errorTextDoc131);
}

planCompositions[131] = planComp131;


// Composition pour plan 00132
var planComp132 = project.items.addComp(
    "SQ05_UNDLM_00132_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.64,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp132.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer132 = planComp132.layers.add(bgSolidComp);
bgLayer132.name = "BG_SOLID";
bgLayer132.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer132 = false;
if (gradingSources[132]) {
    var gradedLayer132 = planComp132.layers.add(gradingSources[132]);
    gradedLayer132.name = "UNDLM_00132_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer132.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer132.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer132 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer132 = false;
if (editSources[132]) {
    var editLayer132 = planComp132.layers.add(editSources[132]);
    editLayer132.name = "UNDLM_00132_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer132.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer132.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer132 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity132 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer132) {
    // EDIT toujours activé quand disponible
    editLayer132.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer132) {
        gradedLayer132.enabled = false;
    }
} else if (hasGradedLayer132) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer132.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText132 = planComp132.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText132.name = "WARNING_NO_EDIT";
    warningText132.property("Transform").property("Position").setValue([1280, 200]);
    warningText132.guideLayer = true;
    
    var warningTextDoc132 = warningText132.property("Source Text").value;
    warningTextDoc132.fontSize = 32;
    warningTextDoc132.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc132.font = "Arial-BoldMT";
    warningTextDoc132.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText132.property("Source Text").setValue(warningTextDoc132);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText132 = planComp132.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00132");
    errorText132.name = "ERROR_NO_SOURCE";
    errorText132.property("Transform").property("Position").setValue([1280, 720]);
    errorText132.guideLayer = true;
    
    var errorTextDoc132 = errorText132.property("Source Text").value;
    errorTextDoc132.fontSize = 48;
    errorTextDoc132.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc132.font = "Arial-BoldMT";
    errorTextDoc132.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText132.property("Source Text").setValue(errorTextDoc132);
}

planCompositions[132] = planComp132;


// Composition pour plan 00133
var planComp133 = project.items.addComp(
    "SQ05_UNDLM_00133_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.32,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp133.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer133 = planComp133.layers.add(bgSolidComp);
bgLayer133.name = "BG_SOLID";
bgLayer133.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer133 = false;
if (gradingSources[133]) {
    var gradedLayer133 = planComp133.layers.add(gradingSources[133]);
    gradedLayer133.name = "UNDLM_00133_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer133.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer133.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer133 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer133 = false;
if (editSources[133]) {
    var editLayer133 = planComp133.layers.add(editSources[133]);
    editLayer133.name = "UNDLM_00133_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer133.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer133.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer133 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity133 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer133) {
    // EDIT toujours activé quand disponible
    editLayer133.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer133) {
        gradedLayer133.enabled = false;
    }
} else if (hasGradedLayer133) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer133.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText133 = planComp133.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText133.name = "WARNING_NO_EDIT";
    warningText133.property("Transform").property("Position").setValue([1280, 200]);
    warningText133.guideLayer = true;
    
    var warningTextDoc133 = warningText133.property("Source Text").value;
    warningTextDoc133.fontSize = 32;
    warningTextDoc133.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc133.font = "Arial-BoldMT";
    warningTextDoc133.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText133.property("Source Text").setValue(warningTextDoc133);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText133 = planComp133.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00133");
    errorText133.name = "ERROR_NO_SOURCE";
    errorText133.property("Transform").property("Position").setValue([1280, 720]);
    errorText133.guideLayer = true;
    
    var errorTextDoc133 = errorText133.property("Source Text").value;
    errorTextDoc133.fontSize = 48;
    errorTextDoc133.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc133.font = "Arial-BoldMT";
    errorTextDoc133.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText133.property("Source Text").setValue(errorTextDoc133);
}

planCompositions[133] = planComp133;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ05_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    74.88, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00118 à la timeline master
if (planCompositions[118]) {
    var masterLayer118 = masterComp.layers.add(planCompositions[118]);
    masterLayer118.startTime = 0;
    masterLayer118.name = "UNDLM_00118";
    masterLayer118.label = 1; // Couleurs alternées
}

// Ajouter plan 00119 à la timeline master
if (planCompositions[119]) {
    var masterLayer119 = masterComp.layers.add(planCompositions[119]);
    masterLayer119.startTime = 3.6;
    masterLayer119.name = "UNDLM_00119";
    masterLayer119.label = 2; // Couleurs alternées
}

// Ajouter plan 00120 à la timeline master
if (planCompositions[120]) {
    var masterLayer120 = masterComp.layers.add(planCompositions[120]);
    masterLayer120.startTime = 10.0;
    masterLayer120.name = "UNDLM_00120";
    masterLayer120.label = 3; // Couleurs alternées
}

// Ajouter plan 00121 à la timeline master
if (planCompositions[121]) {
    var masterLayer121 = masterComp.layers.add(planCompositions[121]);
    masterLayer121.startTime = 14.879999999999999;
    masterLayer121.name = "UNDLM_00121";
    masterLayer121.label = 4; // Couleurs alternées
}

// Ajouter plan 00122 à la timeline master
if (planCompositions[122]) {
    var masterLayer122 = masterComp.layers.add(planCompositions[122]);
    masterLayer122.startTime = 19.72;
    masterLayer122.name = "UNDLM_00122";
    masterLayer122.label = 5; // Couleurs alternées
}

// Ajouter plan 00123 à la timeline master
if (planCompositions[123]) {
    var masterLayer123 = masterComp.layers.add(planCompositions[123]);
    masterLayer123.startTime = 23.88;
    masterLayer123.name = "UNDLM_00123";
    masterLayer123.label = 6; // Couleurs alternées
}

// Ajouter plan 00124 à la timeline master
if (planCompositions[124]) {
    var masterLayer124 = masterComp.layers.add(planCompositions[124]);
    masterLayer124.startTime = 25.2;
    masterLayer124.name = "UNDLM_00124";
    masterLayer124.label = 7; // Couleurs alternées
}

// Ajouter plan 00125 à la timeline master
if (planCompositions[125]) {
    var masterLayer125 = masterComp.layers.add(planCompositions[125]);
    masterLayer125.startTime = 31.119999999999997;
    masterLayer125.name = "UNDLM_00125";
    masterLayer125.label = 8; // Couleurs alternées
}

// Ajouter plan 00126 à la timeline master
if (planCompositions[126]) {
    var masterLayer126 = masterComp.layers.add(planCompositions[126]);
    masterLayer126.startTime = 38.32;
    masterLayer126.name = "UNDLM_00126";
    masterLayer126.label = 9; // Couleurs alternées
}

// Ajouter plan 00127 à la timeline master
if (planCompositions[127]) {
    var masterLayer127 = masterComp.layers.add(planCompositions[127]);
    masterLayer127.startTime = 41.72;
    masterLayer127.name = "UNDLM_00127";
    masterLayer127.label = 10; // Couleurs alternées
}

// Ajouter plan 00128 à la timeline master
if (planCompositions[128]) {
    var masterLayer128 = masterComp.layers.add(planCompositions[128]);
    masterLayer128.startTime = 48.64;
    masterLayer128.name = "UNDLM_00128";
    masterLayer128.label = 11; // Couleurs alternées
}

// Ajouter plan 00129 à la timeline master
if (planCompositions[129]) {
    var masterLayer129 = masterComp.layers.add(planCompositions[129]);
    masterLayer129.startTime = 52.4;
    masterLayer129.name = "UNDLM_00129";
    masterLayer129.label = 12; // Couleurs alternées
}

// Ajouter plan 00130 à la timeline master
if (planCompositions[130]) {
    var masterLayer130 = masterComp.layers.add(planCompositions[130]);
    masterLayer130.startTime = 55.199999999999996;
    masterLayer130.name = "UNDLM_00130";
    masterLayer130.label = 13; // Couleurs alternées
}

// Ajouter plan 00131 à la timeline master
if (planCompositions[131]) {
    var masterLayer131 = masterComp.layers.add(planCompositions[131]);
    masterLayer131.startTime = 58.99999999999999;
    masterLayer131.name = "UNDLM_00131";
    masterLayer131.label = 14; // Couleurs alternées
}

// Ajouter plan 00132 à la timeline master
if (planCompositions[132]) {
    var masterLayer132 = masterComp.layers.add(planCompositions[132]);
    masterLayer132.startTime = 64.91999999999999;
    masterLayer132.name = "UNDLM_00132";
    masterLayer132.label = 15; // Couleurs alternées
}

// Ajouter plan 00133 à la timeline master
if (planCompositions[133]) {
    var masterLayer133 = masterComp.layers.add(planCompositions[133]);
    masterLayer133.startTime = 70.55999999999999;
    masterLayer133.name = "UNDLM_00133";
    masterLayer133.label = 16; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ05";\n' +
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
    {start: 0, end: 3.6, name: "UNDLM_00118"},
    {start: 3.6, end: 10.0, name: "UNDLM_00119"},
    {start: 10.0, end: 14.879999999999999, name: "UNDLM_00120"},
    {start: 14.879999999999999, end: 19.72, name: "UNDLM_00121"},
    {start: 19.72, end: 23.88, name: "UNDLM_00122"},
    {start: 23.88, end: 25.2, name: "UNDLM_00123"},
    {start: 25.2, end: 31.119999999999997, name: "UNDLM_00124"},
    {start: 31.119999999999997, end: 38.32, name: "UNDLM_00125"},
    {start: 38.32, end: 41.72, name: "UNDLM_00126"},
    {start: 41.72, end: 48.64, name: "UNDLM_00127"},
    {start: 48.64, end: 52.4, name: "UNDLM_00128"},
    {start: 52.4, end: 55.199999999999996, name: "UNDLM_00129"},
    {start: 55.199999999999996, end: 58.99999999999999, name: "UNDLM_00130"},
    {start: 58.99999999999999, end: 64.91999999999999, name: "UNDLM_00131"},
    {start: 64.91999999999999, end: 70.55999999999999, name: "UNDLM_00132"},
    {start: 70.55999999999999, end: 74.88, name: "UNDLM_00133"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ05/_AE/SQ05_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 16;
var totalCount = 16;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ05 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(74.88 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ05_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ05:" + totalCount + ":" + gradedCount);
