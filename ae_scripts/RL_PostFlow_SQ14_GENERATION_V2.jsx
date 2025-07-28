
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ14 avec 19 plans
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


// Import plan EDIT 00249
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile249 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00249.mov");
var editFilePoignees249 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00249_AVEC_POIGNEES.mov");
var editFileBis249 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00249bis.mov");

var importSuccess249 = false;
var fileName249 = "";

// Tenter import standard
if (editFile249.exists) {
    try {
        var editFootage249 = project.importFile(new ImportOptions(editFile249));
        editFootage249.parentFolder = fromEditFolder;
        editFootage249.name = "UNDLM_00249";
        editSources[249] = editFootage249;
        editImportCount++;
        importSuccess249 = true;
        fileName249 = "UNDLM_00249.mov";
        logImportSuccess(249, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00249.mov", fileName249);
    } catch (e) {
        logImportError(249, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00249.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess249 && editFilePoignees249.exists) {
    try {
        var editFootage249 = project.importFile(new ImportOptions(editFilePoignees249));
        editFootage249.parentFolder = fromEditFolder;
        editFootage249.name = "UNDLM_00249_AVEC_POIGNEES";
        editSources[249] = editFootage249;
        editImportCount++;
        importSuccess249 = true;
        fileName249 = "UNDLM_00249_AVEC_POIGNEES.mov";
        logImportSuccess(249, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00249_AVEC_POIGNEES.mov", fileName249);
    } catch (e) {
        logImportError(249, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00249_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess249 && editFileBis249.exists) {
    try {
        var editFootage249 = project.importFile(new ImportOptions(editFileBis249));
        editFootage249.parentFolder = fromEditFolder;
        editFootage249.name = "UNDLM_00249bis";
        editSources[249] = editFootage249;
        editImportCount++;
        importSuccess249 = true;
        fileName249 = "UNDLM_00249bis.mov";
        logImportSuccess(249, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00249bis.mov", fileName249);
    } catch (e) {
        logImportError(249, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00249bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess249) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00249.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00250
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile250 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00250.mov");
var editFilePoignees250 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00250_AVEC_POIGNEES.mov");
var editFileBis250 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00250bis.mov");

var importSuccess250 = false;
var fileName250 = "";

// Tenter import standard
if (editFile250.exists) {
    try {
        var editFootage250 = project.importFile(new ImportOptions(editFile250));
        editFootage250.parentFolder = fromEditFolder;
        editFootage250.name = "UNDLM_00250";
        editSources[250] = editFootage250;
        editImportCount++;
        importSuccess250 = true;
        fileName250 = "UNDLM_00250.mov";
        logImportSuccess(250, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00250.mov", fileName250);
    } catch (e) {
        logImportError(250, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00250.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess250 && editFilePoignees250.exists) {
    try {
        var editFootage250 = project.importFile(new ImportOptions(editFilePoignees250));
        editFootage250.parentFolder = fromEditFolder;
        editFootage250.name = "UNDLM_00250_AVEC_POIGNEES";
        editSources[250] = editFootage250;
        editImportCount++;
        importSuccess250 = true;
        fileName250 = "UNDLM_00250_AVEC_POIGNEES.mov";
        logImportSuccess(250, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00250_AVEC_POIGNEES.mov", fileName250);
    } catch (e) {
        logImportError(250, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00250_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess250 && editFileBis250.exists) {
    try {
        var editFootage250 = project.importFile(new ImportOptions(editFileBis250));
        editFootage250.parentFolder = fromEditFolder;
        editFootage250.name = "UNDLM_00250bis";
        editSources[250] = editFootage250;
        editImportCount++;
        importSuccess250 = true;
        fileName250 = "UNDLM_00250bis.mov";
        logImportSuccess(250, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00250bis.mov", fileName250);
    } catch (e) {
        logImportError(250, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00250bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess250) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00250.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00251
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile251 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00251.mov");
var editFilePoignees251 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00251_AVEC_POIGNEES.mov");
var editFileBis251 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00251bis.mov");

var importSuccess251 = false;
var fileName251 = "";

// Tenter import standard
if (editFile251.exists) {
    try {
        var editFootage251 = project.importFile(new ImportOptions(editFile251));
        editFootage251.parentFolder = fromEditFolder;
        editFootage251.name = "UNDLM_00251";
        editSources[251] = editFootage251;
        editImportCount++;
        importSuccess251 = true;
        fileName251 = "UNDLM_00251.mov";
        logImportSuccess(251, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00251.mov", fileName251);
    } catch (e) {
        logImportError(251, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00251.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess251 && editFilePoignees251.exists) {
    try {
        var editFootage251 = project.importFile(new ImportOptions(editFilePoignees251));
        editFootage251.parentFolder = fromEditFolder;
        editFootage251.name = "UNDLM_00251_AVEC_POIGNEES";
        editSources[251] = editFootage251;
        editImportCount++;
        importSuccess251 = true;
        fileName251 = "UNDLM_00251_AVEC_POIGNEES.mov";
        logImportSuccess(251, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00251_AVEC_POIGNEES.mov", fileName251);
    } catch (e) {
        logImportError(251, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00251_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess251 && editFileBis251.exists) {
    try {
        var editFootage251 = project.importFile(new ImportOptions(editFileBis251));
        editFootage251.parentFolder = fromEditFolder;
        editFootage251.name = "UNDLM_00251bis";
        editSources[251] = editFootage251;
        editImportCount++;
        importSuccess251 = true;
        fileName251 = "UNDLM_00251bis.mov";
        logImportSuccess(251, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00251bis.mov", fileName251);
    } catch (e) {
        logImportError(251, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00251bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess251) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00251.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00252
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile252 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00252.mov");
var editFilePoignees252 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00252_AVEC_POIGNEES.mov");
var editFileBis252 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00252bis.mov");

var importSuccess252 = false;
var fileName252 = "";

// Tenter import standard
if (editFile252.exists) {
    try {
        var editFootage252 = project.importFile(new ImportOptions(editFile252));
        editFootage252.parentFolder = fromEditFolder;
        editFootage252.name = "UNDLM_00252";
        editSources[252] = editFootage252;
        editImportCount++;
        importSuccess252 = true;
        fileName252 = "UNDLM_00252.mov";
        logImportSuccess(252, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00252.mov", fileName252);
    } catch (e) {
        logImportError(252, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00252.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess252 && editFilePoignees252.exists) {
    try {
        var editFootage252 = project.importFile(new ImportOptions(editFilePoignees252));
        editFootage252.parentFolder = fromEditFolder;
        editFootage252.name = "UNDLM_00252_AVEC_POIGNEES";
        editSources[252] = editFootage252;
        editImportCount++;
        importSuccess252 = true;
        fileName252 = "UNDLM_00252_AVEC_POIGNEES.mov";
        logImportSuccess(252, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00252_AVEC_POIGNEES.mov", fileName252);
    } catch (e) {
        logImportError(252, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00252_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess252 && editFileBis252.exists) {
    try {
        var editFootage252 = project.importFile(new ImportOptions(editFileBis252));
        editFootage252.parentFolder = fromEditFolder;
        editFootage252.name = "UNDLM_00252bis";
        editSources[252] = editFootage252;
        editImportCount++;
        importSuccess252 = true;
        fileName252 = "UNDLM_00252bis.mov";
        logImportSuccess(252, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00252bis.mov", fileName252);
    } catch (e) {
        logImportError(252, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00252bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess252) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00252.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00253
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile253 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00253.mov");
var editFilePoignees253 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00253_AVEC_POIGNEES.mov");
var editFileBis253 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00253bis.mov");

var importSuccess253 = false;
var fileName253 = "";

// Tenter import standard
if (editFile253.exists) {
    try {
        var editFootage253 = project.importFile(new ImportOptions(editFile253));
        editFootage253.parentFolder = fromEditFolder;
        editFootage253.name = "UNDLM_00253";
        editSources[253] = editFootage253;
        editImportCount++;
        importSuccess253 = true;
        fileName253 = "UNDLM_00253.mov";
        logImportSuccess(253, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00253.mov", fileName253);
    } catch (e) {
        logImportError(253, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00253.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess253 && editFilePoignees253.exists) {
    try {
        var editFootage253 = project.importFile(new ImportOptions(editFilePoignees253));
        editFootage253.parentFolder = fromEditFolder;
        editFootage253.name = "UNDLM_00253_AVEC_POIGNEES";
        editSources[253] = editFootage253;
        editImportCount++;
        importSuccess253 = true;
        fileName253 = "UNDLM_00253_AVEC_POIGNEES.mov";
        logImportSuccess(253, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00253_AVEC_POIGNEES.mov", fileName253);
    } catch (e) {
        logImportError(253, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00253_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess253 && editFileBis253.exists) {
    try {
        var editFootage253 = project.importFile(new ImportOptions(editFileBis253));
        editFootage253.parentFolder = fromEditFolder;
        editFootage253.name = "UNDLM_00253bis";
        editSources[253] = editFootage253;
        editImportCount++;
        importSuccess253 = true;
        fileName253 = "UNDLM_00253bis.mov";
        logImportSuccess(253, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00253bis.mov", fileName253);
    } catch (e) {
        logImportError(253, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00253bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess253) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00253.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00254
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile254 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00254.mov");
var editFilePoignees254 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00254_AVEC_POIGNEES.mov");
var editFileBis254 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00254bis.mov");

var importSuccess254 = false;
var fileName254 = "";

// Tenter import standard
if (editFile254.exists) {
    try {
        var editFootage254 = project.importFile(new ImportOptions(editFile254));
        editFootage254.parentFolder = fromEditFolder;
        editFootage254.name = "UNDLM_00254";
        editSources[254] = editFootage254;
        editImportCount++;
        importSuccess254 = true;
        fileName254 = "UNDLM_00254.mov";
        logImportSuccess(254, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00254.mov", fileName254);
    } catch (e) {
        logImportError(254, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00254.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess254 && editFilePoignees254.exists) {
    try {
        var editFootage254 = project.importFile(new ImportOptions(editFilePoignees254));
        editFootage254.parentFolder = fromEditFolder;
        editFootage254.name = "UNDLM_00254_AVEC_POIGNEES";
        editSources[254] = editFootage254;
        editImportCount++;
        importSuccess254 = true;
        fileName254 = "UNDLM_00254_AVEC_POIGNEES.mov";
        logImportSuccess(254, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00254_AVEC_POIGNEES.mov", fileName254);
    } catch (e) {
        logImportError(254, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00254_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess254 && editFileBis254.exists) {
    try {
        var editFootage254 = project.importFile(new ImportOptions(editFileBis254));
        editFootage254.parentFolder = fromEditFolder;
        editFootage254.name = "UNDLM_00254bis";
        editSources[254] = editFootage254;
        editImportCount++;
        importSuccess254 = true;
        fileName254 = "UNDLM_00254bis.mov";
        logImportSuccess(254, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00254bis.mov", fileName254);
    } catch (e) {
        logImportError(254, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00254bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess254) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00254.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00255
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile255 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00255.mov");
var editFilePoignees255 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00255_AVEC_POIGNEES.mov");
var editFileBis255 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00255bis.mov");

var importSuccess255 = false;
var fileName255 = "";

// Tenter import standard
if (editFile255.exists) {
    try {
        var editFootage255 = project.importFile(new ImportOptions(editFile255));
        editFootage255.parentFolder = fromEditFolder;
        editFootage255.name = "UNDLM_00255";
        editSources[255] = editFootage255;
        editImportCount++;
        importSuccess255 = true;
        fileName255 = "UNDLM_00255.mov";
        logImportSuccess(255, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00255.mov", fileName255);
    } catch (e) {
        logImportError(255, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00255.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess255 && editFilePoignees255.exists) {
    try {
        var editFootage255 = project.importFile(new ImportOptions(editFilePoignees255));
        editFootage255.parentFolder = fromEditFolder;
        editFootage255.name = "UNDLM_00255_AVEC_POIGNEES";
        editSources[255] = editFootage255;
        editImportCount++;
        importSuccess255 = true;
        fileName255 = "UNDLM_00255_AVEC_POIGNEES.mov";
        logImportSuccess(255, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00255_AVEC_POIGNEES.mov", fileName255);
    } catch (e) {
        logImportError(255, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00255_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess255 && editFileBis255.exists) {
    try {
        var editFootage255 = project.importFile(new ImportOptions(editFileBis255));
        editFootage255.parentFolder = fromEditFolder;
        editFootage255.name = "UNDLM_00255bis";
        editSources[255] = editFootage255;
        editImportCount++;
        importSuccess255 = true;
        fileName255 = "UNDLM_00255bis.mov";
        logImportSuccess(255, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00255bis.mov", fileName255);
    } catch (e) {
        logImportError(255, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00255bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess255) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00255.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00256
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile256 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00256.mov");
var editFilePoignees256 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00256_AVEC_POIGNEES.mov");
var editFileBis256 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00256bis.mov");

var importSuccess256 = false;
var fileName256 = "";

// Tenter import standard
if (editFile256.exists) {
    try {
        var editFootage256 = project.importFile(new ImportOptions(editFile256));
        editFootage256.parentFolder = fromEditFolder;
        editFootage256.name = "UNDLM_00256";
        editSources[256] = editFootage256;
        editImportCount++;
        importSuccess256 = true;
        fileName256 = "UNDLM_00256.mov";
        logImportSuccess(256, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00256.mov", fileName256);
    } catch (e) {
        logImportError(256, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00256.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess256 && editFilePoignees256.exists) {
    try {
        var editFootage256 = project.importFile(new ImportOptions(editFilePoignees256));
        editFootage256.parentFolder = fromEditFolder;
        editFootage256.name = "UNDLM_00256_AVEC_POIGNEES";
        editSources[256] = editFootage256;
        editImportCount++;
        importSuccess256 = true;
        fileName256 = "UNDLM_00256_AVEC_POIGNEES.mov";
        logImportSuccess(256, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00256_AVEC_POIGNEES.mov", fileName256);
    } catch (e) {
        logImportError(256, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00256_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess256 && editFileBis256.exists) {
    try {
        var editFootage256 = project.importFile(new ImportOptions(editFileBis256));
        editFootage256.parentFolder = fromEditFolder;
        editFootage256.name = "UNDLM_00256bis";
        editSources[256] = editFootage256;
        editImportCount++;
        importSuccess256 = true;
        fileName256 = "UNDLM_00256bis.mov";
        logImportSuccess(256, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00256bis.mov", fileName256);
    } catch (e) {
        logImportError(256, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00256bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess256) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00256.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00257
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile257 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00257.mov");
var editFilePoignees257 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00257_AVEC_POIGNEES.mov");
var editFileBis257 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00257bis.mov");

var importSuccess257 = false;
var fileName257 = "";

// Tenter import standard
if (editFile257.exists) {
    try {
        var editFootage257 = project.importFile(new ImportOptions(editFile257));
        editFootage257.parentFolder = fromEditFolder;
        editFootage257.name = "UNDLM_00257";
        editSources[257] = editFootage257;
        editImportCount++;
        importSuccess257 = true;
        fileName257 = "UNDLM_00257.mov";
        logImportSuccess(257, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00257.mov", fileName257);
    } catch (e) {
        logImportError(257, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00257.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess257 && editFilePoignees257.exists) {
    try {
        var editFootage257 = project.importFile(new ImportOptions(editFilePoignees257));
        editFootage257.parentFolder = fromEditFolder;
        editFootage257.name = "UNDLM_00257_AVEC_POIGNEES";
        editSources[257] = editFootage257;
        editImportCount++;
        importSuccess257 = true;
        fileName257 = "UNDLM_00257_AVEC_POIGNEES.mov";
        logImportSuccess(257, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00257_AVEC_POIGNEES.mov", fileName257);
    } catch (e) {
        logImportError(257, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00257_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess257 && editFileBis257.exists) {
    try {
        var editFootage257 = project.importFile(new ImportOptions(editFileBis257));
        editFootage257.parentFolder = fromEditFolder;
        editFootage257.name = "UNDLM_00257bis";
        editSources[257] = editFootage257;
        editImportCount++;
        importSuccess257 = true;
        fileName257 = "UNDLM_00257bis.mov";
        logImportSuccess(257, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00257bis.mov", fileName257);
    } catch (e) {
        logImportError(257, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00257bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess257) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00257.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00258
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile258 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00258.mov");
var editFilePoignees258 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00258_AVEC_POIGNEES.mov");
var editFileBis258 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00258bis.mov");

var importSuccess258 = false;
var fileName258 = "";

// Tenter import standard
if (editFile258.exists) {
    try {
        var editFootage258 = project.importFile(new ImportOptions(editFile258));
        editFootage258.parentFolder = fromEditFolder;
        editFootage258.name = "UNDLM_00258";
        editSources[258] = editFootage258;
        editImportCount++;
        importSuccess258 = true;
        fileName258 = "UNDLM_00258.mov";
        logImportSuccess(258, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00258.mov", fileName258);
    } catch (e) {
        logImportError(258, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00258.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess258 && editFilePoignees258.exists) {
    try {
        var editFootage258 = project.importFile(new ImportOptions(editFilePoignees258));
        editFootage258.parentFolder = fromEditFolder;
        editFootage258.name = "UNDLM_00258_AVEC_POIGNEES";
        editSources[258] = editFootage258;
        editImportCount++;
        importSuccess258 = true;
        fileName258 = "UNDLM_00258_AVEC_POIGNEES.mov";
        logImportSuccess(258, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00258_AVEC_POIGNEES.mov", fileName258);
    } catch (e) {
        logImportError(258, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00258_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess258 && editFileBis258.exists) {
    try {
        var editFootage258 = project.importFile(new ImportOptions(editFileBis258));
        editFootage258.parentFolder = fromEditFolder;
        editFootage258.name = "UNDLM_00258bis";
        editSources[258] = editFootage258;
        editImportCount++;
        importSuccess258 = true;
        fileName258 = "UNDLM_00258bis.mov";
        logImportSuccess(258, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00258bis.mov", fileName258);
    } catch (e) {
        logImportError(258, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00258bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess258) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00258.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00259
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile259 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00259.mov");
var editFilePoignees259 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00259_AVEC_POIGNEES.mov");
var editFileBis259 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00259bis.mov");

var importSuccess259 = false;
var fileName259 = "";

// Tenter import standard
if (editFile259.exists) {
    try {
        var editFootage259 = project.importFile(new ImportOptions(editFile259));
        editFootage259.parentFolder = fromEditFolder;
        editFootage259.name = "UNDLM_00259";
        editSources[259] = editFootage259;
        editImportCount++;
        importSuccess259 = true;
        fileName259 = "UNDLM_00259.mov";
        logImportSuccess(259, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00259.mov", fileName259);
    } catch (e) {
        logImportError(259, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00259.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess259 && editFilePoignees259.exists) {
    try {
        var editFootage259 = project.importFile(new ImportOptions(editFilePoignees259));
        editFootage259.parentFolder = fromEditFolder;
        editFootage259.name = "UNDLM_00259_AVEC_POIGNEES";
        editSources[259] = editFootage259;
        editImportCount++;
        importSuccess259 = true;
        fileName259 = "UNDLM_00259_AVEC_POIGNEES.mov";
        logImportSuccess(259, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00259_AVEC_POIGNEES.mov", fileName259);
    } catch (e) {
        logImportError(259, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00259_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess259 && editFileBis259.exists) {
    try {
        var editFootage259 = project.importFile(new ImportOptions(editFileBis259));
        editFootage259.parentFolder = fromEditFolder;
        editFootage259.name = "UNDLM_00259bis";
        editSources[259] = editFootage259;
        editImportCount++;
        importSuccess259 = true;
        fileName259 = "UNDLM_00259bis.mov";
        logImportSuccess(259, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00259bis.mov", fileName259);
    } catch (e) {
        logImportError(259, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00259bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess259) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00259.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00260
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile260 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00260.mov");
var editFilePoignees260 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00260_AVEC_POIGNEES.mov");
var editFileBis260 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00260bis.mov");

var importSuccess260 = false;
var fileName260 = "";

// Tenter import standard
if (editFile260.exists) {
    try {
        var editFootage260 = project.importFile(new ImportOptions(editFile260));
        editFootage260.parentFolder = fromEditFolder;
        editFootage260.name = "UNDLM_00260";
        editSources[260] = editFootage260;
        editImportCount++;
        importSuccess260 = true;
        fileName260 = "UNDLM_00260.mov";
        logImportSuccess(260, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00260.mov", fileName260);
    } catch (e) {
        logImportError(260, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00260.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess260 && editFilePoignees260.exists) {
    try {
        var editFootage260 = project.importFile(new ImportOptions(editFilePoignees260));
        editFootage260.parentFolder = fromEditFolder;
        editFootage260.name = "UNDLM_00260_AVEC_POIGNEES";
        editSources[260] = editFootage260;
        editImportCount++;
        importSuccess260 = true;
        fileName260 = "UNDLM_00260_AVEC_POIGNEES.mov";
        logImportSuccess(260, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00260_AVEC_POIGNEES.mov", fileName260);
    } catch (e) {
        logImportError(260, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00260_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess260 && editFileBis260.exists) {
    try {
        var editFootage260 = project.importFile(new ImportOptions(editFileBis260));
        editFootage260.parentFolder = fromEditFolder;
        editFootage260.name = "UNDLM_00260bis";
        editSources[260] = editFootage260;
        editImportCount++;
        importSuccess260 = true;
        fileName260 = "UNDLM_00260bis.mov";
        logImportSuccess(260, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00260bis.mov", fileName260);
    } catch (e) {
        logImportError(260, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00260bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess260) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00260.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00261
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile261 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00261.mov");
var editFilePoignees261 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00261_AVEC_POIGNEES.mov");
var editFileBis261 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00261bis.mov");

var importSuccess261 = false;
var fileName261 = "";

// Tenter import standard
if (editFile261.exists) {
    try {
        var editFootage261 = project.importFile(new ImportOptions(editFile261));
        editFootage261.parentFolder = fromEditFolder;
        editFootage261.name = "UNDLM_00261";
        editSources[261] = editFootage261;
        editImportCount++;
        importSuccess261 = true;
        fileName261 = "UNDLM_00261.mov";
        logImportSuccess(261, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00261.mov", fileName261);
    } catch (e) {
        logImportError(261, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00261.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess261 && editFilePoignees261.exists) {
    try {
        var editFootage261 = project.importFile(new ImportOptions(editFilePoignees261));
        editFootage261.parentFolder = fromEditFolder;
        editFootage261.name = "UNDLM_00261_AVEC_POIGNEES";
        editSources[261] = editFootage261;
        editImportCount++;
        importSuccess261 = true;
        fileName261 = "UNDLM_00261_AVEC_POIGNEES.mov";
        logImportSuccess(261, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00261_AVEC_POIGNEES.mov", fileName261);
    } catch (e) {
        logImportError(261, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00261_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess261 && editFileBis261.exists) {
    try {
        var editFootage261 = project.importFile(new ImportOptions(editFileBis261));
        editFootage261.parentFolder = fromEditFolder;
        editFootage261.name = "UNDLM_00261bis";
        editSources[261] = editFootage261;
        editImportCount++;
        importSuccess261 = true;
        fileName261 = "UNDLM_00261bis.mov";
        logImportSuccess(261, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00261bis.mov", fileName261);
    } catch (e) {
        logImportError(261, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00261bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess261) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00261.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00262
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile262 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00262.mov");
var editFilePoignees262 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00262_AVEC_POIGNEES.mov");
var editFileBis262 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00262bis.mov");

var importSuccess262 = false;
var fileName262 = "";

// Tenter import standard
if (editFile262.exists) {
    try {
        var editFootage262 = project.importFile(new ImportOptions(editFile262));
        editFootage262.parentFolder = fromEditFolder;
        editFootage262.name = "UNDLM_00262";
        editSources[262] = editFootage262;
        editImportCount++;
        importSuccess262 = true;
        fileName262 = "UNDLM_00262.mov";
        logImportSuccess(262, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00262.mov", fileName262);
    } catch (e) {
        logImportError(262, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00262.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess262 && editFilePoignees262.exists) {
    try {
        var editFootage262 = project.importFile(new ImportOptions(editFilePoignees262));
        editFootage262.parentFolder = fromEditFolder;
        editFootage262.name = "UNDLM_00262_AVEC_POIGNEES";
        editSources[262] = editFootage262;
        editImportCount++;
        importSuccess262 = true;
        fileName262 = "UNDLM_00262_AVEC_POIGNEES.mov";
        logImportSuccess(262, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00262_AVEC_POIGNEES.mov", fileName262);
    } catch (e) {
        logImportError(262, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00262_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess262 && editFileBis262.exists) {
    try {
        var editFootage262 = project.importFile(new ImportOptions(editFileBis262));
        editFootage262.parentFolder = fromEditFolder;
        editFootage262.name = "UNDLM_00262bis";
        editSources[262] = editFootage262;
        editImportCount++;
        importSuccess262 = true;
        fileName262 = "UNDLM_00262bis.mov";
        logImportSuccess(262, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00262bis.mov", fileName262);
    } catch (e) {
        logImportError(262, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00262bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess262) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00262.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00263
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile263 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00263.mov");
var editFilePoignees263 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00263_AVEC_POIGNEES.mov");
var editFileBis263 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00263bis.mov");

var importSuccess263 = false;
var fileName263 = "";

// Tenter import standard
if (editFile263.exists) {
    try {
        var editFootage263 = project.importFile(new ImportOptions(editFile263));
        editFootage263.parentFolder = fromEditFolder;
        editFootage263.name = "UNDLM_00263";
        editSources[263] = editFootage263;
        editImportCount++;
        importSuccess263 = true;
        fileName263 = "UNDLM_00263.mov";
        logImportSuccess(263, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00263.mov", fileName263);
    } catch (e) {
        logImportError(263, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00263.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess263 && editFilePoignees263.exists) {
    try {
        var editFootage263 = project.importFile(new ImportOptions(editFilePoignees263));
        editFootage263.parentFolder = fromEditFolder;
        editFootage263.name = "UNDLM_00263_AVEC_POIGNEES";
        editSources[263] = editFootage263;
        editImportCount++;
        importSuccess263 = true;
        fileName263 = "UNDLM_00263_AVEC_POIGNEES.mov";
        logImportSuccess(263, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00263_AVEC_POIGNEES.mov", fileName263);
    } catch (e) {
        logImportError(263, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00263_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess263 && editFileBis263.exists) {
    try {
        var editFootage263 = project.importFile(new ImportOptions(editFileBis263));
        editFootage263.parentFolder = fromEditFolder;
        editFootage263.name = "UNDLM_00263bis";
        editSources[263] = editFootage263;
        editImportCount++;
        importSuccess263 = true;
        fileName263 = "UNDLM_00263bis.mov";
        logImportSuccess(263, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00263bis.mov", fileName263);
    } catch (e) {
        logImportError(263, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00263bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess263) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00263.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00264
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile264 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00264.mov");
var editFilePoignees264 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00264_AVEC_POIGNEES.mov");
var editFileBis264 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00264bis.mov");

var importSuccess264 = false;
var fileName264 = "";

// Tenter import standard
if (editFile264.exists) {
    try {
        var editFootage264 = project.importFile(new ImportOptions(editFile264));
        editFootage264.parentFolder = fromEditFolder;
        editFootage264.name = "UNDLM_00264";
        editSources[264] = editFootage264;
        editImportCount++;
        importSuccess264 = true;
        fileName264 = "UNDLM_00264.mov";
        logImportSuccess(264, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00264.mov", fileName264);
    } catch (e) {
        logImportError(264, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00264.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess264 && editFilePoignees264.exists) {
    try {
        var editFootage264 = project.importFile(new ImportOptions(editFilePoignees264));
        editFootage264.parentFolder = fromEditFolder;
        editFootage264.name = "UNDLM_00264_AVEC_POIGNEES";
        editSources[264] = editFootage264;
        editImportCount++;
        importSuccess264 = true;
        fileName264 = "UNDLM_00264_AVEC_POIGNEES.mov";
        logImportSuccess(264, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00264_AVEC_POIGNEES.mov", fileName264);
    } catch (e) {
        logImportError(264, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00264_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess264 && editFileBis264.exists) {
    try {
        var editFootage264 = project.importFile(new ImportOptions(editFileBis264));
        editFootage264.parentFolder = fromEditFolder;
        editFootage264.name = "UNDLM_00264bis";
        editSources[264] = editFootage264;
        editImportCount++;
        importSuccess264 = true;
        fileName264 = "UNDLM_00264bis.mov";
        logImportSuccess(264, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00264bis.mov", fileName264);
    } catch (e) {
        logImportError(264, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00264bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess264) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00264.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00265
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile265 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00265.mov");
var editFilePoignees265 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00265_AVEC_POIGNEES.mov");
var editFileBis265 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00265bis.mov");

var importSuccess265 = false;
var fileName265 = "";

// Tenter import standard
if (editFile265.exists) {
    try {
        var editFootage265 = project.importFile(new ImportOptions(editFile265));
        editFootage265.parentFolder = fromEditFolder;
        editFootage265.name = "UNDLM_00265";
        editSources[265] = editFootage265;
        editImportCount++;
        importSuccess265 = true;
        fileName265 = "UNDLM_00265.mov";
        logImportSuccess(265, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00265.mov", fileName265);
    } catch (e) {
        logImportError(265, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00265.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess265 && editFilePoignees265.exists) {
    try {
        var editFootage265 = project.importFile(new ImportOptions(editFilePoignees265));
        editFootage265.parentFolder = fromEditFolder;
        editFootage265.name = "UNDLM_00265_AVEC_POIGNEES";
        editSources[265] = editFootage265;
        editImportCount++;
        importSuccess265 = true;
        fileName265 = "UNDLM_00265_AVEC_POIGNEES.mov";
        logImportSuccess(265, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00265_AVEC_POIGNEES.mov", fileName265);
    } catch (e) {
        logImportError(265, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00265_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess265 && editFileBis265.exists) {
    try {
        var editFootage265 = project.importFile(new ImportOptions(editFileBis265));
        editFootage265.parentFolder = fromEditFolder;
        editFootage265.name = "UNDLM_00265bis";
        editSources[265] = editFootage265;
        editImportCount++;
        importSuccess265 = true;
        fileName265 = "UNDLM_00265bis.mov";
        logImportSuccess(265, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00265bis.mov", fileName265);
    } catch (e) {
        logImportError(265, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00265bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess265) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00265.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00266
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile266 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00266.mov");
var editFilePoignees266 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00266_AVEC_POIGNEES.mov");
var editFileBis266 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00266bis.mov");

var importSuccess266 = false;
var fileName266 = "";

// Tenter import standard
if (editFile266.exists) {
    try {
        var editFootage266 = project.importFile(new ImportOptions(editFile266));
        editFootage266.parentFolder = fromEditFolder;
        editFootage266.name = "UNDLM_00266";
        editSources[266] = editFootage266;
        editImportCount++;
        importSuccess266 = true;
        fileName266 = "UNDLM_00266.mov";
        logImportSuccess(266, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00266.mov", fileName266);
    } catch (e) {
        logImportError(266, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00266.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess266 && editFilePoignees266.exists) {
    try {
        var editFootage266 = project.importFile(new ImportOptions(editFilePoignees266));
        editFootage266.parentFolder = fromEditFolder;
        editFootage266.name = "UNDLM_00266_AVEC_POIGNEES";
        editSources[266] = editFootage266;
        editImportCount++;
        importSuccess266 = true;
        fileName266 = "UNDLM_00266_AVEC_POIGNEES.mov";
        logImportSuccess(266, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00266_AVEC_POIGNEES.mov", fileName266);
    } catch (e) {
        logImportError(266, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00266_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess266 && editFileBis266.exists) {
    try {
        var editFootage266 = project.importFile(new ImportOptions(editFileBis266));
        editFootage266.parentFolder = fromEditFolder;
        editFootage266.name = "UNDLM_00266bis";
        editSources[266] = editFootage266;
        editImportCount++;
        importSuccess266 = true;
        fileName266 = "UNDLM_00266bis.mov";
        logImportSuccess(266, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00266bis.mov", fileName266);
    } catch (e) {
        logImportError(266, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00266bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess266) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00266.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00267
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile267 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00267.mov");
var editFilePoignees267 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00267_AVEC_POIGNEES.mov");
var editFileBis267 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00267bis.mov");

var importSuccess267 = false;
var fileName267 = "";

// Tenter import standard
if (editFile267.exists) {
    try {
        var editFootage267 = project.importFile(new ImportOptions(editFile267));
        editFootage267.parentFolder = fromEditFolder;
        editFootage267.name = "UNDLM_00267";
        editSources[267] = editFootage267;
        editImportCount++;
        importSuccess267 = true;
        fileName267 = "UNDLM_00267.mov";
        logImportSuccess(267, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00267.mov", fileName267);
    } catch (e) {
        logImportError(267, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00267.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess267 && editFilePoignees267.exists) {
    try {
        var editFootage267 = project.importFile(new ImportOptions(editFilePoignees267));
        editFootage267.parentFolder = fromEditFolder;
        editFootage267.name = "UNDLM_00267_AVEC_POIGNEES";
        editSources[267] = editFootage267;
        editImportCount++;
        importSuccess267 = true;
        fileName267 = "UNDLM_00267_AVEC_POIGNEES.mov";
        logImportSuccess(267, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00267_AVEC_POIGNEES.mov", fileName267);
    } catch (e) {
        logImportError(267, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00267_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess267 && editFileBis267.exists) {
    try {
        var editFootage267 = project.importFile(new ImportOptions(editFileBis267));
        editFootage267.parentFolder = fromEditFolder;
        editFootage267.name = "UNDLM_00267bis";
        editSources[267] = editFootage267;
        editImportCount++;
        importSuccess267 = true;
        fileName267 = "UNDLM_00267bis.mov";
        logImportSuccess(267, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00267bis.mov", fileName267);
    } catch (e) {
        logImportError(267, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00267bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess267) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00267.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00249
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile249 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00249.mov");
var gradedFilePoignees249 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00249_AVEC_POIGNEES.mov");
var gradedFileBis249 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00249bis.mov");

var gradedImportSuccess249 = false;
var gradedFileName249 = "";

// Tenter import standard
if (gradedFile249.exists) {
    try {
        var gradedFootage249 = project.importFile(new ImportOptions(gradedFile249));
        gradedFootage249.parentFolder = fromGradingFolder;
        gradedFootage249.name = "UNDLM_00249";
        gradingSources[249] = gradedFootage249;
        gradingImportCount++;
        gradedImportSuccess249 = true;
        gradedFileName249 = "UNDLM_00249.mov";
        logImportSuccess(249, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00249.mov", gradedFileName249);
    } catch (e) {
        logImportError(249, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00249.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess249 && gradedFilePoignees249.exists) {
    try {
        var gradedFootage249 = project.importFile(new ImportOptions(gradedFilePoignees249));
        gradedFootage249.parentFolder = fromGradingFolder;
        gradedFootage249.name = "UNDLM_00249_AVEC_POIGNEES";
        gradingSources[249] = gradedFootage249;
        gradingImportCount++;
        gradedImportSuccess249 = true;
        gradedFileName249 = "UNDLM_00249_AVEC_POIGNEES.mov";
        logImportSuccess(249, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00249_AVEC_POIGNEES.mov", gradedFileName249);
    } catch (e) {
        logImportError(249, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00249_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess249 && gradedFileBis249.exists) {
    try {
        var gradedFootage249 = project.importFile(new ImportOptions(gradedFileBis249));
        gradedFootage249.parentFolder = fromGradingFolder;
        gradedFootage249.name = "UNDLM_00249bis";
        gradingSources[249] = gradedFootage249;
        gradingImportCount++;
        gradedImportSuccess249 = true;
        gradedFileName249 = "UNDLM_00249bis.mov";
        logImportSuccess(249, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00249bis.mov", gradedFileName249);
    } catch (e) {
        logImportError(249, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00249bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess249) {
    missingGradingCount++;
}

// Import plan GRADED 00250
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile250 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00250.mov");
var gradedFilePoignees250 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00250_AVEC_POIGNEES.mov");
var gradedFileBis250 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00250bis.mov");

var gradedImportSuccess250 = false;
var gradedFileName250 = "";

// Tenter import standard
if (gradedFile250.exists) {
    try {
        var gradedFootage250 = project.importFile(new ImportOptions(gradedFile250));
        gradedFootage250.parentFolder = fromGradingFolder;
        gradedFootage250.name = "UNDLM_00250";
        gradingSources[250] = gradedFootage250;
        gradingImportCount++;
        gradedImportSuccess250 = true;
        gradedFileName250 = "UNDLM_00250.mov";
        logImportSuccess(250, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00250.mov", gradedFileName250);
    } catch (e) {
        logImportError(250, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00250.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess250 && gradedFilePoignees250.exists) {
    try {
        var gradedFootage250 = project.importFile(new ImportOptions(gradedFilePoignees250));
        gradedFootage250.parentFolder = fromGradingFolder;
        gradedFootage250.name = "UNDLM_00250_AVEC_POIGNEES";
        gradingSources[250] = gradedFootage250;
        gradingImportCount++;
        gradedImportSuccess250 = true;
        gradedFileName250 = "UNDLM_00250_AVEC_POIGNEES.mov";
        logImportSuccess(250, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00250_AVEC_POIGNEES.mov", gradedFileName250);
    } catch (e) {
        logImportError(250, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00250_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess250 && gradedFileBis250.exists) {
    try {
        var gradedFootage250 = project.importFile(new ImportOptions(gradedFileBis250));
        gradedFootage250.parentFolder = fromGradingFolder;
        gradedFootage250.name = "UNDLM_00250bis";
        gradingSources[250] = gradedFootage250;
        gradingImportCount++;
        gradedImportSuccess250 = true;
        gradedFileName250 = "UNDLM_00250bis.mov";
        logImportSuccess(250, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00250bis.mov", gradedFileName250);
    } catch (e) {
        logImportError(250, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00250bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess250) {
    missingGradingCount++;
}

// Import plan GRADED 00251
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile251 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00251.mov");
var gradedFilePoignees251 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00251_AVEC_POIGNEES.mov");
var gradedFileBis251 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00251bis.mov");

var gradedImportSuccess251 = false;
var gradedFileName251 = "";

// Tenter import standard
if (gradedFile251.exists) {
    try {
        var gradedFootage251 = project.importFile(new ImportOptions(gradedFile251));
        gradedFootage251.parentFolder = fromGradingFolder;
        gradedFootage251.name = "UNDLM_00251";
        gradingSources[251] = gradedFootage251;
        gradingImportCount++;
        gradedImportSuccess251 = true;
        gradedFileName251 = "UNDLM_00251.mov";
        logImportSuccess(251, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00251.mov", gradedFileName251);
    } catch (e) {
        logImportError(251, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00251.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess251 && gradedFilePoignees251.exists) {
    try {
        var gradedFootage251 = project.importFile(new ImportOptions(gradedFilePoignees251));
        gradedFootage251.parentFolder = fromGradingFolder;
        gradedFootage251.name = "UNDLM_00251_AVEC_POIGNEES";
        gradingSources[251] = gradedFootage251;
        gradingImportCount++;
        gradedImportSuccess251 = true;
        gradedFileName251 = "UNDLM_00251_AVEC_POIGNEES.mov";
        logImportSuccess(251, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00251_AVEC_POIGNEES.mov", gradedFileName251);
    } catch (e) {
        logImportError(251, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00251_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess251 && gradedFileBis251.exists) {
    try {
        var gradedFootage251 = project.importFile(new ImportOptions(gradedFileBis251));
        gradedFootage251.parentFolder = fromGradingFolder;
        gradedFootage251.name = "UNDLM_00251bis";
        gradingSources[251] = gradedFootage251;
        gradingImportCount++;
        gradedImportSuccess251 = true;
        gradedFileName251 = "UNDLM_00251bis.mov";
        logImportSuccess(251, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00251bis.mov", gradedFileName251);
    } catch (e) {
        logImportError(251, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00251bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess251) {
    missingGradingCount++;
}

// Import plan GRADED 00252
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile252 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00252.mov");
var gradedFilePoignees252 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00252_AVEC_POIGNEES.mov");
var gradedFileBis252 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00252bis.mov");

var gradedImportSuccess252 = false;
var gradedFileName252 = "";

// Tenter import standard
if (gradedFile252.exists) {
    try {
        var gradedFootage252 = project.importFile(new ImportOptions(gradedFile252));
        gradedFootage252.parentFolder = fromGradingFolder;
        gradedFootage252.name = "UNDLM_00252";
        gradingSources[252] = gradedFootage252;
        gradingImportCount++;
        gradedImportSuccess252 = true;
        gradedFileName252 = "UNDLM_00252.mov";
        logImportSuccess(252, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00252.mov", gradedFileName252);
    } catch (e) {
        logImportError(252, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00252.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess252 && gradedFilePoignees252.exists) {
    try {
        var gradedFootage252 = project.importFile(new ImportOptions(gradedFilePoignees252));
        gradedFootage252.parentFolder = fromGradingFolder;
        gradedFootage252.name = "UNDLM_00252_AVEC_POIGNEES";
        gradingSources[252] = gradedFootage252;
        gradingImportCount++;
        gradedImportSuccess252 = true;
        gradedFileName252 = "UNDLM_00252_AVEC_POIGNEES.mov";
        logImportSuccess(252, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00252_AVEC_POIGNEES.mov", gradedFileName252);
    } catch (e) {
        logImportError(252, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00252_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess252 && gradedFileBis252.exists) {
    try {
        var gradedFootage252 = project.importFile(new ImportOptions(gradedFileBis252));
        gradedFootage252.parentFolder = fromGradingFolder;
        gradedFootage252.name = "UNDLM_00252bis";
        gradingSources[252] = gradedFootage252;
        gradingImportCount++;
        gradedImportSuccess252 = true;
        gradedFileName252 = "UNDLM_00252bis.mov";
        logImportSuccess(252, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00252bis.mov", gradedFileName252);
    } catch (e) {
        logImportError(252, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00252bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess252) {
    missingGradingCount++;
}

// Import plan GRADED 00253
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile253 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00253.mov");
var gradedFilePoignees253 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00253_AVEC_POIGNEES.mov");
var gradedFileBis253 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00253bis.mov");

var gradedImportSuccess253 = false;
var gradedFileName253 = "";

// Tenter import standard
if (gradedFile253.exists) {
    try {
        var gradedFootage253 = project.importFile(new ImportOptions(gradedFile253));
        gradedFootage253.parentFolder = fromGradingFolder;
        gradedFootage253.name = "UNDLM_00253";
        gradingSources[253] = gradedFootage253;
        gradingImportCount++;
        gradedImportSuccess253 = true;
        gradedFileName253 = "UNDLM_00253.mov";
        logImportSuccess(253, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00253.mov", gradedFileName253);
    } catch (e) {
        logImportError(253, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00253.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess253 && gradedFilePoignees253.exists) {
    try {
        var gradedFootage253 = project.importFile(new ImportOptions(gradedFilePoignees253));
        gradedFootage253.parentFolder = fromGradingFolder;
        gradedFootage253.name = "UNDLM_00253_AVEC_POIGNEES";
        gradingSources[253] = gradedFootage253;
        gradingImportCount++;
        gradedImportSuccess253 = true;
        gradedFileName253 = "UNDLM_00253_AVEC_POIGNEES.mov";
        logImportSuccess(253, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00253_AVEC_POIGNEES.mov", gradedFileName253);
    } catch (e) {
        logImportError(253, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00253_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess253 && gradedFileBis253.exists) {
    try {
        var gradedFootage253 = project.importFile(new ImportOptions(gradedFileBis253));
        gradedFootage253.parentFolder = fromGradingFolder;
        gradedFootage253.name = "UNDLM_00253bis";
        gradingSources[253] = gradedFootage253;
        gradingImportCount++;
        gradedImportSuccess253 = true;
        gradedFileName253 = "UNDLM_00253bis.mov";
        logImportSuccess(253, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00253bis.mov", gradedFileName253);
    } catch (e) {
        logImportError(253, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00253bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess253) {
    missingGradingCount++;
}

// Import plan GRADED 00254
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile254 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00254.mov");
var gradedFilePoignees254 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00254_AVEC_POIGNEES.mov");
var gradedFileBis254 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00254bis.mov");

var gradedImportSuccess254 = false;
var gradedFileName254 = "";

// Tenter import standard
if (gradedFile254.exists) {
    try {
        var gradedFootage254 = project.importFile(new ImportOptions(gradedFile254));
        gradedFootage254.parentFolder = fromGradingFolder;
        gradedFootage254.name = "UNDLM_00254";
        gradingSources[254] = gradedFootage254;
        gradingImportCount++;
        gradedImportSuccess254 = true;
        gradedFileName254 = "UNDLM_00254.mov";
        logImportSuccess(254, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00254.mov", gradedFileName254);
    } catch (e) {
        logImportError(254, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00254.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess254 && gradedFilePoignees254.exists) {
    try {
        var gradedFootage254 = project.importFile(new ImportOptions(gradedFilePoignees254));
        gradedFootage254.parentFolder = fromGradingFolder;
        gradedFootage254.name = "UNDLM_00254_AVEC_POIGNEES";
        gradingSources[254] = gradedFootage254;
        gradingImportCount++;
        gradedImportSuccess254 = true;
        gradedFileName254 = "UNDLM_00254_AVEC_POIGNEES.mov";
        logImportSuccess(254, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00254_AVEC_POIGNEES.mov", gradedFileName254);
    } catch (e) {
        logImportError(254, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00254_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess254 && gradedFileBis254.exists) {
    try {
        var gradedFootage254 = project.importFile(new ImportOptions(gradedFileBis254));
        gradedFootage254.parentFolder = fromGradingFolder;
        gradedFootage254.name = "UNDLM_00254bis";
        gradingSources[254] = gradedFootage254;
        gradingImportCount++;
        gradedImportSuccess254 = true;
        gradedFileName254 = "UNDLM_00254bis.mov";
        logImportSuccess(254, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00254bis.mov", gradedFileName254);
    } catch (e) {
        logImportError(254, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00254bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess254) {
    missingGradingCount++;
}

// Import plan GRADED 00255
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile255 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00255.mov");
var gradedFilePoignees255 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00255_AVEC_POIGNEES.mov");
var gradedFileBis255 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00255bis.mov");

var gradedImportSuccess255 = false;
var gradedFileName255 = "";

// Tenter import standard
if (gradedFile255.exists) {
    try {
        var gradedFootage255 = project.importFile(new ImportOptions(gradedFile255));
        gradedFootage255.parentFolder = fromGradingFolder;
        gradedFootage255.name = "UNDLM_00255";
        gradingSources[255] = gradedFootage255;
        gradingImportCount++;
        gradedImportSuccess255 = true;
        gradedFileName255 = "UNDLM_00255.mov";
        logImportSuccess(255, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00255.mov", gradedFileName255);
    } catch (e) {
        logImportError(255, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00255.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess255 && gradedFilePoignees255.exists) {
    try {
        var gradedFootage255 = project.importFile(new ImportOptions(gradedFilePoignees255));
        gradedFootage255.parentFolder = fromGradingFolder;
        gradedFootage255.name = "UNDLM_00255_AVEC_POIGNEES";
        gradingSources[255] = gradedFootage255;
        gradingImportCount++;
        gradedImportSuccess255 = true;
        gradedFileName255 = "UNDLM_00255_AVEC_POIGNEES.mov";
        logImportSuccess(255, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00255_AVEC_POIGNEES.mov", gradedFileName255);
    } catch (e) {
        logImportError(255, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00255_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess255 && gradedFileBis255.exists) {
    try {
        var gradedFootage255 = project.importFile(new ImportOptions(gradedFileBis255));
        gradedFootage255.parentFolder = fromGradingFolder;
        gradedFootage255.name = "UNDLM_00255bis";
        gradingSources[255] = gradedFootage255;
        gradingImportCount++;
        gradedImportSuccess255 = true;
        gradedFileName255 = "UNDLM_00255bis.mov";
        logImportSuccess(255, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00255bis.mov", gradedFileName255);
    } catch (e) {
        logImportError(255, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00255bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess255) {
    missingGradingCount++;
}

// Import plan GRADED 00256
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile256 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00256.mov");
var gradedFilePoignees256 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00256_AVEC_POIGNEES.mov");
var gradedFileBis256 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00256bis.mov");

var gradedImportSuccess256 = false;
var gradedFileName256 = "";

// Tenter import standard
if (gradedFile256.exists) {
    try {
        var gradedFootage256 = project.importFile(new ImportOptions(gradedFile256));
        gradedFootage256.parentFolder = fromGradingFolder;
        gradedFootage256.name = "UNDLM_00256";
        gradingSources[256] = gradedFootage256;
        gradingImportCount++;
        gradedImportSuccess256 = true;
        gradedFileName256 = "UNDLM_00256.mov";
        logImportSuccess(256, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00256.mov", gradedFileName256);
    } catch (e) {
        logImportError(256, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00256.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess256 && gradedFilePoignees256.exists) {
    try {
        var gradedFootage256 = project.importFile(new ImportOptions(gradedFilePoignees256));
        gradedFootage256.parentFolder = fromGradingFolder;
        gradedFootage256.name = "UNDLM_00256_AVEC_POIGNEES";
        gradingSources[256] = gradedFootage256;
        gradingImportCount++;
        gradedImportSuccess256 = true;
        gradedFileName256 = "UNDLM_00256_AVEC_POIGNEES.mov";
        logImportSuccess(256, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00256_AVEC_POIGNEES.mov", gradedFileName256);
    } catch (e) {
        logImportError(256, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00256_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess256 && gradedFileBis256.exists) {
    try {
        var gradedFootage256 = project.importFile(new ImportOptions(gradedFileBis256));
        gradedFootage256.parentFolder = fromGradingFolder;
        gradedFootage256.name = "UNDLM_00256bis";
        gradingSources[256] = gradedFootage256;
        gradingImportCount++;
        gradedImportSuccess256 = true;
        gradedFileName256 = "UNDLM_00256bis.mov";
        logImportSuccess(256, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00256bis.mov", gradedFileName256);
    } catch (e) {
        logImportError(256, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00256bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess256) {
    missingGradingCount++;
}

// Import plan GRADED 00257
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile257 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00257.mov");
var gradedFilePoignees257 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00257_AVEC_POIGNEES.mov");
var gradedFileBis257 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00257bis.mov");

var gradedImportSuccess257 = false;
var gradedFileName257 = "";

// Tenter import standard
if (gradedFile257.exists) {
    try {
        var gradedFootage257 = project.importFile(new ImportOptions(gradedFile257));
        gradedFootage257.parentFolder = fromGradingFolder;
        gradedFootage257.name = "UNDLM_00257";
        gradingSources[257] = gradedFootage257;
        gradingImportCount++;
        gradedImportSuccess257 = true;
        gradedFileName257 = "UNDLM_00257.mov";
        logImportSuccess(257, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00257.mov", gradedFileName257);
    } catch (e) {
        logImportError(257, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00257.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess257 && gradedFilePoignees257.exists) {
    try {
        var gradedFootage257 = project.importFile(new ImportOptions(gradedFilePoignees257));
        gradedFootage257.parentFolder = fromGradingFolder;
        gradedFootage257.name = "UNDLM_00257_AVEC_POIGNEES";
        gradingSources[257] = gradedFootage257;
        gradingImportCount++;
        gradedImportSuccess257 = true;
        gradedFileName257 = "UNDLM_00257_AVEC_POIGNEES.mov";
        logImportSuccess(257, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00257_AVEC_POIGNEES.mov", gradedFileName257);
    } catch (e) {
        logImportError(257, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00257_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess257 && gradedFileBis257.exists) {
    try {
        var gradedFootage257 = project.importFile(new ImportOptions(gradedFileBis257));
        gradedFootage257.parentFolder = fromGradingFolder;
        gradedFootage257.name = "UNDLM_00257bis";
        gradingSources[257] = gradedFootage257;
        gradingImportCount++;
        gradedImportSuccess257 = true;
        gradedFileName257 = "UNDLM_00257bis.mov";
        logImportSuccess(257, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00257bis.mov", gradedFileName257);
    } catch (e) {
        logImportError(257, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00257bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess257) {
    missingGradingCount++;
}

// Import plan GRADED 00258
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile258 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00258.mov");
var gradedFilePoignees258 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00258_AVEC_POIGNEES.mov");
var gradedFileBis258 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00258bis.mov");

var gradedImportSuccess258 = false;
var gradedFileName258 = "";

// Tenter import standard
if (gradedFile258.exists) {
    try {
        var gradedFootage258 = project.importFile(new ImportOptions(gradedFile258));
        gradedFootage258.parentFolder = fromGradingFolder;
        gradedFootage258.name = "UNDLM_00258";
        gradingSources[258] = gradedFootage258;
        gradingImportCount++;
        gradedImportSuccess258 = true;
        gradedFileName258 = "UNDLM_00258.mov";
        logImportSuccess(258, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00258.mov", gradedFileName258);
    } catch (e) {
        logImportError(258, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00258.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess258 && gradedFilePoignees258.exists) {
    try {
        var gradedFootage258 = project.importFile(new ImportOptions(gradedFilePoignees258));
        gradedFootage258.parentFolder = fromGradingFolder;
        gradedFootage258.name = "UNDLM_00258_AVEC_POIGNEES";
        gradingSources[258] = gradedFootage258;
        gradingImportCount++;
        gradedImportSuccess258 = true;
        gradedFileName258 = "UNDLM_00258_AVEC_POIGNEES.mov";
        logImportSuccess(258, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00258_AVEC_POIGNEES.mov", gradedFileName258);
    } catch (e) {
        logImportError(258, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00258_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess258 && gradedFileBis258.exists) {
    try {
        var gradedFootage258 = project.importFile(new ImportOptions(gradedFileBis258));
        gradedFootage258.parentFolder = fromGradingFolder;
        gradedFootage258.name = "UNDLM_00258bis";
        gradingSources[258] = gradedFootage258;
        gradingImportCount++;
        gradedImportSuccess258 = true;
        gradedFileName258 = "UNDLM_00258bis.mov";
        logImportSuccess(258, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00258bis.mov", gradedFileName258);
    } catch (e) {
        logImportError(258, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00258bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess258) {
    missingGradingCount++;
}

// Import plan GRADED 00259
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile259 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00259.mov");
var gradedFilePoignees259 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00259_AVEC_POIGNEES.mov");
var gradedFileBis259 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00259bis.mov");

var gradedImportSuccess259 = false;
var gradedFileName259 = "";

// Tenter import standard
if (gradedFile259.exists) {
    try {
        var gradedFootage259 = project.importFile(new ImportOptions(gradedFile259));
        gradedFootage259.parentFolder = fromGradingFolder;
        gradedFootage259.name = "UNDLM_00259";
        gradingSources[259] = gradedFootage259;
        gradingImportCount++;
        gradedImportSuccess259 = true;
        gradedFileName259 = "UNDLM_00259.mov";
        logImportSuccess(259, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00259.mov", gradedFileName259);
    } catch (e) {
        logImportError(259, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00259.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess259 && gradedFilePoignees259.exists) {
    try {
        var gradedFootage259 = project.importFile(new ImportOptions(gradedFilePoignees259));
        gradedFootage259.parentFolder = fromGradingFolder;
        gradedFootage259.name = "UNDLM_00259_AVEC_POIGNEES";
        gradingSources[259] = gradedFootage259;
        gradingImportCount++;
        gradedImportSuccess259 = true;
        gradedFileName259 = "UNDLM_00259_AVEC_POIGNEES.mov";
        logImportSuccess(259, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00259_AVEC_POIGNEES.mov", gradedFileName259);
    } catch (e) {
        logImportError(259, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00259_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess259 && gradedFileBis259.exists) {
    try {
        var gradedFootage259 = project.importFile(new ImportOptions(gradedFileBis259));
        gradedFootage259.parentFolder = fromGradingFolder;
        gradedFootage259.name = "UNDLM_00259bis";
        gradingSources[259] = gradedFootage259;
        gradingImportCount++;
        gradedImportSuccess259 = true;
        gradedFileName259 = "UNDLM_00259bis.mov";
        logImportSuccess(259, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00259bis.mov", gradedFileName259);
    } catch (e) {
        logImportError(259, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00259bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess259) {
    missingGradingCount++;
}

// Import plan GRADED 00260
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile260 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00260.mov");
var gradedFilePoignees260 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00260_AVEC_POIGNEES.mov");
var gradedFileBis260 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00260bis.mov");

var gradedImportSuccess260 = false;
var gradedFileName260 = "";

// Tenter import standard
if (gradedFile260.exists) {
    try {
        var gradedFootage260 = project.importFile(new ImportOptions(gradedFile260));
        gradedFootage260.parentFolder = fromGradingFolder;
        gradedFootage260.name = "UNDLM_00260";
        gradingSources[260] = gradedFootage260;
        gradingImportCount++;
        gradedImportSuccess260 = true;
        gradedFileName260 = "UNDLM_00260.mov";
        logImportSuccess(260, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00260.mov", gradedFileName260);
    } catch (e) {
        logImportError(260, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00260.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess260 && gradedFilePoignees260.exists) {
    try {
        var gradedFootage260 = project.importFile(new ImportOptions(gradedFilePoignees260));
        gradedFootage260.parentFolder = fromGradingFolder;
        gradedFootage260.name = "UNDLM_00260_AVEC_POIGNEES";
        gradingSources[260] = gradedFootage260;
        gradingImportCount++;
        gradedImportSuccess260 = true;
        gradedFileName260 = "UNDLM_00260_AVEC_POIGNEES.mov";
        logImportSuccess(260, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00260_AVEC_POIGNEES.mov", gradedFileName260);
    } catch (e) {
        logImportError(260, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00260_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess260 && gradedFileBis260.exists) {
    try {
        var gradedFootage260 = project.importFile(new ImportOptions(gradedFileBis260));
        gradedFootage260.parentFolder = fromGradingFolder;
        gradedFootage260.name = "UNDLM_00260bis";
        gradingSources[260] = gradedFootage260;
        gradingImportCount++;
        gradedImportSuccess260 = true;
        gradedFileName260 = "UNDLM_00260bis.mov";
        logImportSuccess(260, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00260bis.mov", gradedFileName260);
    } catch (e) {
        logImportError(260, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00260bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess260) {
    missingGradingCount++;
}

// Import plan GRADED 00261
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile261 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00261.mov");
var gradedFilePoignees261 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00261_AVEC_POIGNEES.mov");
var gradedFileBis261 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00261bis.mov");

var gradedImportSuccess261 = false;
var gradedFileName261 = "";

// Tenter import standard
if (gradedFile261.exists) {
    try {
        var gradedFootage261 = project.importFile(new ImportOptions(gradedFile261));
        gradedFootage261.parentFolder = fromGradingFolder;
        gradedFootage261.name = "UNDLM_00261";
        gradingSources[261] = gradedFootage261;
        gradingImportCount++;
        gradedImportSuccess261 = true;
        gradedFileName261 = "UNDLM_00261.mov";
        logImportSuccess(261, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00261.mov", gradedFileName261);
    } catch (e) {
        logImportError(261, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00261.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess261 && gradedFilePoignees261.exists) {
    try {
        var gradedFootage261 = project.importFile(new ImportOptions(gradedFilePoignees261));
        gradedFootage261.parentFolder = fromGradingFolder;
        gradedFootage261.name = "UNDLM_00261_AVEC_POIGNEES";
        gradingSources[261] = gradedFootage261;
        gradingImportCount++;
        gradedImportSuccess261 = true;
        gradedFileName261 = "UNDLM_00261_AVEC_POIGNEES.mov";
        logImportSuccess(261, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00261_AVEC_POIGNEES.mov", gradedFileName261);
    } catch (e) {
        logImportError(261, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00261_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess261 && gradedFileBis261.exists) {
    try {
        var gradedFootage261 = project.importFile(new ImportOptions(gradedFileBis261));
        gradedFootage261.parentFolder = fromGradingFolder;
        gradedFootage261.name = "UNDLM_00261bis";
        gradingSources[261] = gradedFootage261;
        gradingImportCount++;
        gradedImportSuccess261 = true;
        gradedFileName261 = "UNDLM_00261bis.mov";
        logImportSuccess(261, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00261bis.mov", gradedFileName261);
    } catch (e) {
        logImportError(261, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00261bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess261) {
    missingGradingCount++;
}

// Import plan GRADED 00262
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile262 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00262.mov");
var gradedFilePoignees262 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00262_AVEC_POIGNEES.mov");
var gradedFileBis262 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00262bis.mov");

var gradedImportSuccess262 = false;
var gradedFileName262 = "";

// Tenter import standard
if (gradedFile262.exists) {
    try {
        var gradedFootage262 = project.importFile(new ImportOptions(gradedFile262));
        gradedFootage262.parentFolder = fromGradingFolder;
        gradedFootage262.name = "UNDLM_00262";
        gradingSources[262] = gradedFootage262;
        gradingImportCount++;
        gradedImportSuccess262 = true;
        gradedFileName262 = "UNDLM_00262.mov";
        logImportSuccess(262, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00262.mov", gradedFileName262);
    } catch (e) {
        logImportError(262, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00262.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess262 && gradedFilePoignees262.exists) {
    try {
        var gradedFootage262 = project.importFile(new ImportOptions(gradedFilePoignees262));
        gradedFootage262.parentFolder = fromGradingFolder;
        gradedFootage262.name = "UNDLM_00262_AVEC_POIGNEES";
        gradingSources[262] = gradedFootage262;
        gradingImportCount++;
        gradedImportSuccess262 = true;
        gradedFileName262 = "UNDLM_00262_AVEC_POIGNEES.mov";
        logImportSuccess(262, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00262_AVEC_POIGNEES.mov", gradedFileName262);
    } catch (e) {
        logImportError(262, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00262_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess262 && gradedFileBis262.exists) {
    try {
        var gradedFootage262 = project.importFile(new ImportOptions(gradedFileBis262));
        gradedFootage262.parentFolder = fromGradingFolder;
        gradedFootage262.name = "UNDLM_00262bis";
        gradingSources[262] = gradedFootage262;
        gradingImportCount++;
        gradedImportSuccess262 = true;
        gradedFileName262 = "UNDLM_00262bis.mov";
        logImportSuccess(262, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00262bis.mov", gradedFileName262);
    } catch (e) {
        logImportError(262, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00262bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess262) {
    missingGradingCount++;
}

// Import plan GRADED 00263
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile263 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00263.mov");
var gradedFilePoignees263 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00263_AVEC_POIGNEES.mov");
var gradedFileBis263 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00263bis.mov");

var gradedImportSuccess263 = false;
var gradedFileName263 = "";

// Tenter import standard
if (gradedFile263.exists) {
    try {
        var gradedFootage263 = project.importFile(new ImportOptions(gradedFile263));
        gradedFootage263.parentFolder = fromGradingFolder;
        gradedFootage263.name = "UNDLM_00263";
        gradingSources[263] = gradedFootage263;
        gradingImportCount++;
        gradedImportSuccess263 = true;
        gradedFileName263 = "UNDLM_00263.mov";
        logImportSuccess(263, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00263.mov", gradedFileName263);
    } catch (e) {
        logImportError(263, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00263.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess263 && gradedFilePoignees263.exists) {
    try {
        var gradedFootage263 = project.importFile(new ImportOptions(gradedFilePoignees263));
        gradedFootage263.parentFolder = fromGradingFolder;
        gradedFootage263.name = "UNDLM_00263_AVEC_POIGNEES";
        gradingSources[263] = gradedFootage263;
        gradingImportCount++;
        gradedImportSuccess263 = true;
        gradedFileName263 = "UNDLM_00263_AVEC_POIGNEES.mov";
        logImportSuccess(263, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00263_AVEC_POIGNEES.mov", gradedFileName263);
    } catch (e) {
        logImportError(263, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00263_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess263 && gradedFileBis263.exists) {
    try {
        var gradedFootage263 = project.importFile(new ImportOptions(gradedFileBis263));
        gradedFootage263.parentFolder = fromGradingFolder;
        gradedFootage263.name = "UNDLM_00263bis";
        gradingSources[263] = gradedFootage263;
        gradingImportCount++;
        gradedImportSuccess263 = true;
        gradedFileName263 = "UNDLM_00263bis.mov";
        logImportSuccess(263, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00263bis.mov", gradedFileName263);
    } catch (e) {
        logImportError(263, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00263bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess263) {
    missingGradingCount++;
}

// Import plan GRADED 00264
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile264 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00264.mov");
var gradedFilePoignees264 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00264_AVEC_POIGNEES.mov");
var gradedFileBis264 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00264bis.mov");

var gradedImportSuccess264 = false;
var gradedFileName264 = "";

// Tenter import standard
if (gradedFile264.exists) {
    try {
        var gradedFootage264 = project.importFile(new ImportOptions(gradedFile264));
        gradedFootage264.parentFolder = fromGradingFolder;
        gradedFootage264.name = "UNDLM_00264";
        gradingSources[264] = gradedFootage264;
        gradingImportCount++;
        gradedImportSuccess264 = true;
        gradedFileName264 = "UNDLM_00264.mov";
        logImportSuccess(264, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00264.mov", gradedFileName264);
    } catch (e) {
        logImportError(264, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00264.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess264 && gradedFilePoignees264.exists) {
    try {
        var gradedFootage264 = project.importFile(new ImportOptions(gradedFilePoignees264));
        gradedFootage264.parentFolder = fromGradingFolder;
        gradedFootage264.name = "UNDLM_00264_AVEC_POIGNEES";
        gradingSources[264] = gradedFootage264;
        gradingImportCount++;
        gradedImportSuccess264 = true;
        gradedFileName264 = "UNDLM_00264_AVEC_POIGNEES.mov";
        logImportSuccess(264, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00264_AVEC_POIGNEES.mov", gradedFileName264);
    } catch (e) {
        logImportError(264, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00264_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess264 && gradedFileBis264.exists) {
    try {
        var gradedFootage264 = project.importFile(new ImportOptions(gradedFileBis264));
        gradedFootage264.parentFolder = fromGradingFolder;
        gradedFootage264.name = "UNDLM_00264bis";
        gradingSources[264] = gradedFootage264;
        gradingImportCount++;
        gradedImportSuccess264 = true;
        gradedFileName264 = "UNDLM_00264bis.mov";
        logImportSuccess(264, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00264bis.mov", gradedFileName264);
    } catch (e) {
        logImportError(264, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00264bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess264) {
    missingGradingCount++;
}

// Import plan GRADED 00265
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile265 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00265.mov");
var gradedFilePoignees265 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00265_AVEC_POIGNEES.mov");
var gradedFileBis265 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00265bis.mov");

var gradedImportSuccess265 = false;
var gradedFileName265 = "";

// Tenter import standard
if (gradedFile265.exists) {
    try {
        var gradedFootage265 = project.importFile(new ImportOptions(gradedFile265));
        gradedFootage265.parentFolder = fromGradingFolder;
        gradedFootage265.name = "UNDLM_00265";
        gradingSources[265] = gradedFootage265;
        gradingImportCount++;
        gradedImportSuccess265 = true;
        gradedFileName265 = "UNDLM_00265.mov";
        logImportSuccess(265, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00265.mov", gradedFileName265);
    } catch (e) {
        logImportError(265, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00265.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess265 && gradedFilePoignees265.exists) {
    try {
        var gradedFootage265 = project.importFile(new ImportOptions(gradedFilePoignees265));
        gradedFootage265.parentFolder = fromGradingFolder;
        gradedFootage265.name = "UNDLM_00265_AVEC_POIGNEES";
        gradingSources[265] = gradedFootage265;
        gradingImportCount++;
        gradedImportSuccess265 = true;
        gradedFileName265 = "UNDLM_00265_AVEC_POIGNEES.mov";
        logImportSuccess(265, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00265_AVEC_POIGNEES.mov", gradedFileName265);
    } catch (e) {
        logImportError(265, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00265_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess265 && gradedFileBis265.exists) {
    try {
        var gradedFootage265 = project.importFile(new ImportOptions(gradedFileBis265));
        gradedFootage265.parentFolder = fromGradingFolder;
        gradedFootage265.name = "UNDLM_00265bis";
        gradingSources[265] = gradedFootage265;
        gradingImportCount++;
        gradedImportSuccess265 = true;
        gradedFileName265 = "UNDLM_00265bis.mov";
        logImportSuccess(265, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00265bis.mov", gradedFileName265);
    } catch (e) {
        logImportError(265, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00265bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess265) {
    missingGradingCount++;
}

// Import plan GRADED 00266
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile266 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00266.mov");
var gradedFilePoignees266 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00266_AVEC_POIGNEES.mov");
var gradedFileBis266 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00266bis.mov");

var gradedImportSuccess266 = false;
var gradedFileName266 = "";

// Tenter import standard
if (gradedFile266.exists) {
    try {
        var gradedFootage266 = project.importFile(new ImportOptions(gradedFile266));
        gradedFootage266.parentFolder = fromGradingFolder;
        gradedFootage266.name = "UNDLM_00266";
        gradingSources[266] = gradedFootage266;
        gradingImportCount++;
        gradedImportSuccess266 = true;
        gradedFileName266 = "UNDLM_00266.mov";
        logImportSuccess(266, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00266.mov", gradedFileName266);
    } catch (e) {
        logImportError(266, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00266.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess266 && gradedFilePoignees266.exists) {
    try {
        var gradedFootage266 = project.importFile(new ImportOptions(gradedFilePoignees266));
        gradedFootage266.parentFolder = fromGradingFolder;
        gradedFootage266.name = "UNDLM_00266_AVEC_POIGNEES";
        gradingSources[266] = gradedFootage266;
        gradingImportCount++;
        gradedImportSuccess266 = true;
        gradedFileName266 = "UNDLM_00266_AVEC_POIGNEES.mov";
        logImportSuccess(266, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00266_AVEC_POIGNEES.mov", gradedFileName266);
    } catch (e) {
        logImportError(266, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00266_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess266 && gradedFileBis266.exists) {
    try {
        var gradedFootage266 = project.importFile(new ImportOptions(gradedFileBis266));
        gradedFootage266.parentFolder = fromGradingFolder;
        gradedFootage266.name = "UNDLM_00266bis";
        gradingSources[266] = gradedFootage266;
        gradingImportCount++;
        gradedImportSuccess266 = true;
        gradedFileName266 = "UNDLM_00266bis.mov";
        logImportSuccess(266, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00266bis.mov", gradedFileName266);
    } catch (e) {
        logImportError(266, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00266bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess266) {
    missingGradingCount++;
}

// Import plan GRADED 00267
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile267 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00267.mov");
var gradedFilePoignees267 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00267_AVEC_POIGNEES.mov");
var gradedFileBis267 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00267bis.mov");

var gradedImportSuccess267 = false;
var gradedFileName267 = "";

// Tenter import standard
if (gradedFile267.exists) {
    try {
        var gradedFootage267 = project.importFile(new ImportOptions(gradedFile267));
        gradedFootage267.parentFolder = fromGradingFolder;
        gradedFootage267.name = "UNDLM_00267";
        gradingSources[267] = gradedFootage267;
        gradingImportCount++;
        gradedImportSuccess267 = true;
        gradedFileName267 = "UNDLM_00267.mov";
        logImportSuccess(267, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00267.mov", gradedFileName267);
    } catch (e) {
        logImportError(267, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00267.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess267 && gradedFilePoignees267.exists) {
    try {
        var gradedFootage267 = project.importFile(new ImportOptions(gradedFilePoignees267));
        gradedFootage267.parentFolder = fromGradingFolder;
        gradedFootage267.name = "UNDLM_00267_AVEC_POIGNEES";
        gradingSources[267] = gradedFootage267;
        gradingImportCount++;
        gradedImportSuccess267 = true;
        gradedFileName267 = "UNDLM_00267_AVEC_POIGNEES.mov";
        logImportSuccess(267, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00267_AVEC_POIGNEES.mov", gradedFileName267);
    } catch (e) {
        logImportError(267, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00267_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess267 && gradedFileBis267.exists) {
    try {
        var gradedFootage267 = project.importFile(new ImportOptions(gradedFileBis267));
        gradedFootage267.parentFolder = fromGradingFolder;
        gradedFootage267.name = "UNDLM_00267bis";
        gradingSources[267] = gradedFootage267;
        gradingImportCount++;
        gradedImportSuccess267 = true;
        gradedFileName267 = "UNDLM_00267bis.mov";
        logImportSuccess(267, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00267bis.mov", gradedFileName267);
    } catch (e) {
        logImportError(267, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00267bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess267) {
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


// Composition pour plan 00249
var planComp249 = project.items.addComp(
    "SQ14_UNDLM_00249_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp249.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer249 = planComp249.layers.add(bgSolidComp);
bgLayer249.name = "BG_SOLID";
bgLayer249.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer249 = false;
if (gradingSources[249]) {
    var gradedLayer249 = planComp249.layers.add(gradingSources[249]);
    gradedLayer249.name = "UNDLM_00249_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer249.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer249.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer249 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer249 = false;
if (editSources[249]) {
    var editLayer249 = planComp249.layers.add(editSources[249]);
    editLayer249.name = "UNDLM_00249_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer249.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer249.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer249 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity249 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer249) {
    // EDIT toujours activé quand disponible
    editLayer249.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer249) {
        gradedLayer249.enabled = false;
    }
} else if (hasGradedLayer249) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer249.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText249 = planComp249.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText249.name = "WARNING_NO_EDIT";
    warningText249.property("Transform").property("Position").setValue([1280, 200]);
    warningText249.guideLayer = true;
    
    var warningTextDoc249 = warningText249.property("Source Text").value;
    warningTextDoc249.fontSize = 32;
    warningTextDoc249.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc249.font = "Arial-BoldMT";
    warningTextDoc249.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText249.property("Source Text").setValue(warningTextDoc249);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText249 = planComp249.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00249");
    errorText249.name = "ERROR_NO_SOURCE";
    errorText249.property("Transform").property("Position").setValue([1280, 720]);
    errorText249.guideLayer = true;
    
    var errorTextDoc249 = errorText249.property("Source Text").value;
    errorTextDoc249.fontSize = 48;
    errorTextDoc249.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc249.font = "Arial-BoldMT";
    errorTextDoc249.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText249.property("Source Text").setValue(errorTextDoc249);
}

planCompositions[249] = planComp249;


// Composition pour plan 00250
var planComp250 = project.items.addComp(
    "SQ14_UNDLM_00250_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp250.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer250 = planComp250.layers.add(bgSolidComp);
bgLayer250.name = "BG_SOLID";
bgLayer250.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer250 = false;
if (gradingSources[250]) {
    var gradedLayer250 = planComp250.layers.add(gradingSources[250]);
    gradedLayer250.name = "UNDLM_00250_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer250.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer250.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer250 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer250 = false;
if (editSources[250]) {
    var editLayer250 = planComp250.layers.add(editSources[250]);
    editLayer250.name = "UNDLM_00250_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer250.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer250.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer250 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity250 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer250) {
    // EDIT toujours activé quand disponible
    editLayer250.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer250) {
        gradedLayer250.enabled = false;
    }
} else if (hasGradedLayer250) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer250.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText250 = planComp250.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText250.name = "WARNING_NO_EDIT";
    warningText250.property("Transform").property("Position").setValue([1280, 200]);
    warningText250.guideLayer = true;
    
    var warningTextDoc250 = warningText250.property("Source Text").value;
    warningTextDoc250.fontSize = 32;
    warningTextDoc250.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc250.font = "Arial-BoldMT";
    warningTextDoc250.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText250.property("Source Text").setValue(warningTextDoc250);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText250 = planComp250.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00250");
    errorText250.name = "ERROR_NO_SOURCE";
    errorText250.property("Transform").property("Position").setValue([1280, 720]);
    errorText250.guideLayer = true;
    
    var errorTextDoc250 = errorText250.property("Source Text").value;
    errorTextDoc250.fontSize = 48;
    errorTextDoc250.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc250.font = "Arial-BoldMT";
    errorTextDoc250.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText250.property("Source Text").setValue(errorTextDoc250);
}

planCompositions[250] = planComp250;


// Composition pour plan 00251
var planComp251 = project.items.addComp(
    "SQ14_UNDLM_00251_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    11.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp251.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer251 = planComp251.layers.add(bgSolidComp);
bgLayer251.name = "BG_SOLID";
bgLayer251.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer251 = false;
if (gradingSources[251]) {
    var gradedLayer251 = planComp251.layers.add(gradingSources[251]);
    gradedLayer251.name = "UNDLM_00251_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer251.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer251.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer251 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer251 = false;
if (editSources[251]) {
    var editLayer251 = planComp251.layers.add(editSources[251]);
    editLayer251.name = "UNDLM_00251_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer251.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer251.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer251 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity251 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer251) {
    // EDIT toujours activé quand disponible
    editLayer251.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer251) {
        gradedLayer251.enabled = false;
    }
} else if (hasGradedLayer251) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer251.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText251 = planComp251.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText251.name = "WARNING_NO_EDIT";
    warningText251.property("Transform").property("Position").setValue([1280, 200]);
    warningText251.guideLayer = true;
    
    var warningTextDoc251 = warningText251.property("Source Text").value;
    warningTextDoc251.fontSize = 32;
    warningTextDoc251.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc251.font = "Arial-BoldMT";
    warningTextDoc251.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText251.property("Source Text").setValue(warningTextDoc251);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText251 = planComp251.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00251");
    errorText251.name = "ERROR_NO_SOURCE";
    errorText251.property("Transform").property("Position").setValue([1280, 720]);
    errorText251.guideLayer = true;
    
    var errorTextDoc251 = errorText251.property("Source Text").value;
    errorTextDoc251.fontSize = 48;
    errorTextDoc251.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc251.font = "Arial-BoldMT";
    errorTextDoc251.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText251.property("Source Text").setValue(errorTextDoc251);
}

planCompositions[251] = planComp251;


// Composition pour plan 00252
var planComp252 = project.items.addComp(
    "SQ14_UNDLM_00252_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    13.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp252.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer252 = planComp252.layers.add(bgSolidComp);
bgLayer252.name = "BG_SOLID";
bgLayer252.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer252 = false;
if (gradingSources[252]) {
    var gradedLayer252 = planComp252.layers.add(gradingSources[252]);
    gradedLayer252.name = "UNDLM_00252_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer252.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer252.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer252 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer252 = false;
if (editSources[252]) {
    var editLayer252 = planComp252.layers.add(editSources[252]);
    editLayer252.name = "UNDLM_00252_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer252.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer252.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer252 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity252 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer252) {
    // EDIT toujours activé quand disponible
    editLayer252.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer252) {
        gradedLayer252.enabled = false;
    }
} else if (hasGradedLayer252) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer252.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText252 = planComp252.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText252.name = "WARNING_NO_EDIT";
    warningText252.property("Transform").property("Position").setValue([1280, 200]);
    warningText252.guideLayer = true;
    
    var warningTextDoc252 = warningText252.property("Source Text").value;
    warningTextDoc252.fontSize = 32;
    warningTextDoc252.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc252.font = "Arial-BoldMT";
    warningTextDoc252.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText252.property("Source Text").setValue(warningTextDoc252);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText252 = planComp252.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00252");
    errorText252.name = "ERROR_NO_SOURCE";
    errorText252.property("Transform").property("Position").setValue([1280, 720]);
    errorText252.guideLayer = true;
    
    var errorTextDoc252 = errorText252.property("Source Text").value;
    errorTextDoc252.fontSize = 48;
    errorTextDoc252.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc252.font = "Arial-BoldMT";
    errorTextDoc252.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText252.property("Source Text").setValue(errorTextDoc252);
}

planCompositions[252] = planComp252;


// Composition pour plan 00253
var planComp253 = project.items.addComp(
    "SQ14_UNDLM_00253_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.64,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp253.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer253 = planComp253.layers.add(bgSolidComp);
bgLayer253.name = "BG_SOLID";
bgLayer253.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer253 = false;
if (gradingSources[253]) {
    var gradedLayer253 = planComp253.layers.add(gradingSources[253]);
    gradedLayer253.name = "UNDLM_00253_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer253.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer253.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer253 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer253 = false;
if (editSources[253]) {
    var editLayer253 = planComp253.layers.add(editSources[253]);
    editLayer253.name = "UNDLM_00253_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer253.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer253.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer253 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity253 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer253) {
    // EDIT toujours activé quand disponible
    editLayer253.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer253) {
        gradedLayer253.enabled = false;
    }
} else if (hasGradedLayer253) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer253.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText253 = planComp253.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText253.name = "WARNING_NO_EDIT";
    warningText253.property("Transform").property("Position").setValue([1280, 200]);
    warningText253.guideLayer = true;
    
    var warningTextDoc253 = warningText253.property("Source Text").value;
    warningTextDoc253.fontSize = 32;
    warningTextDoc253.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc253.font = "Arial-BoldMT";
    warningTextDoc253.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText253.property("Source Text").setValue(warningTextDoc253);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText253 = planComp253.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00253");
    errorText253.name = "ERROR_NO_SOURCE";
    errorText253.property("Transform").property("Position").setValue([1280, 720]);
    errorText253.guideLayer = true;
    
    var errorTextDoc253 = errorText253.property("Source Text").value;
    errorTextDoc253.fontSize = 48;
    errorTextDoc253.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc253.font = "Arial-BoldMT";
    errorTextDoc253.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText253.property("Source Text").setValue(errorTextDoc253);
}

planCompositions[253] = planComp253;


// Composition pour plan 00254
var planComp254 = project.items.addComp(
    "SQ14_UNDLM_00254_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp254.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer254 = planComp254.layers.add(bgSolidComp);
bgLayer254.name = "BG_SOLID";
bgLayer254.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer254 = false;
if (gradingSources[254]) {
    var gradedLayer254 = planComp254.layers.add(gradingSources[254]);
    gradedLayer254.name = "UNDLM_00254_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer254.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer254.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer254 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer254 = false;
if (editSources[254]) {
    var editLayer254 = planComp254.layers.add(editSources[254]);
    editLayer254.name = "UNDLM_00254_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer254.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer254.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer254 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity254 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer254) {
    // EDIT toujours activé quand disponible
    editLayer254.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer254) {
        gradedLayer254.enabled = false;
    }
} else if (hasGradedLayer254) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer254.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText254 = planComp254.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText254.name = "WARNING_NO_EDIT";
    warningText254.property("Transform").property("Position").setValue([1280, 200]);
    warningText254.guideLayer = true;
    
    var warningTextDoc254 = warningText254.property("Source Text").value;
    warningTextDoc254.fontSize = 32;
    warningTextDoc254.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc254.font = "Arial-BoldMT";
    warningTextDoc254.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText254.property("Source Text").setValue(warningTextDoc254);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText254 = planComp254.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00254");
    errorText254.name = "ERROR_NO_SOURCE";
    errorText254.property("Transform").property("Position").setValue([1280, 720]);
    errorText254.guideLayer = true;
    
    var errorTextDoc254 = errorText254.property("Source Text").value;
    errorTextDoc254.fontSize = 48;
    errorTextDoc254.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc254.font = "Arial-BoldMT";
    errorTextDoc254.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText254.property("Source Text").setValue(errorTextDoc254);
}

planCompositions[254] = planComp254;


// Composition pour plan 00255
var planComp255 = project.items.addComp(
    "SQ14_UNDLM_00255_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp255.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer255 = planComp255.layers.add(bgSolidComp);
bgLayer255.name = "BG_SOLID";
bgLayer255.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer255 = false;
if (gradingSources[255]) {
    var gradedLayer255 = planComp255.layers.add(gradingSources[255]);
    gradedLayer255.name = "UNDLM_00255_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer255.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer255.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer255 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer255 = false;
if (editSources[255]) {
    var editLayer255 = planComp255.layers.add(editSources[255]);
    editLayer255.name = "UNDLM_00255_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer255.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer255.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer255 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity255 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer255) {
    // EDIT toujours activé quand disponible
    editLayer255.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer255) {
        gradedLayer255.enabled = false;
    }
} else if (hasGradedLayer255) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer255.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText255 = planComp255.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText255.name = "WARNING_NO_EDIT";
    warningText255.property("Transform").property("Position").setValue([1280, 200]);
    warningText255.guideLayer = true;
    
    var warningTextDoc255 = warningText255.property("Source Text").value;
    warningTextDoc255.fontSize = 32;
    warningTextDoc255.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc255.font = "Arial-BoldMT";
    warningTextDoc255.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText255.property("Source Text").setValue(warningTextDoc255);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText255 = planComp255.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00255");
    errorText255.name = "ERROR_NO_SOURCE";
    errorText255.property("Transform").property("Position").setValue([1280, 720]);
    errorText255.guideLayer = true;
    
    var errorTextDoc255 = errorText255.property("Source Text").value;
    errorTextDoc255.fontSize = 48;
    errorTextDoc255.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc255.font = "Arial-BoldMT";
    errorTextDoc255.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText255.property("Source Text").setValue(errorTextDoc255);
}

planCompositions[255] = planComp255;


// Composition pour plan 00256
var planComp256 = project.items.addComp(
    "SQ14_UNDLM_00256_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.6400000000000001,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp256.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer256 = planComp256.layers.add(bgSolidComp);
bgLayer256.name = "BG_SOLID";
bgLayer256.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer256 = false;
if (gradingSources[256]) {
    var gradedLayer256 = planComp256.layers.add(gradingSources[256]);
    gradedLayer256.name = "UNDLM_00256_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer256.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer256.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer256 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer256 = false;
if (editSources[256]) {
    var editLayer256 = planComp256.layers.add(editSources[256]);
    editLayer256.name = "UNDLM_00256_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer256.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer256.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer256 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity256 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer256) {
    // EDIT toujours activé quand disponible
    editLayer256.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer256) {
        gradedLayer256.enabled = false;
    }
} else if (hasGradedLayer256) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer256.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText256 = planComp256.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText256.name = "WARNING_NO_EDIT";
    warningText256.property("Transform").property("Position").setValue([1280, 200]);
    warningText256.guideLayer = true;
    
    var warningTextDoc256 = warningText256.property("Source Text").value;
    warningTextDoc256.fontSize = 32;
    warningTextDoc256.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc256.font = "Arial-BoldMT";
    warningTextDoc256.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText256.property("Source Text").setValue(warningTextDoc256);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText256 = planComp256.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00256");
    errorText256.name = "ERROR_NO_SOURCE";
    errorText256.property("Transform").property("Position").setValue([1280, 720]);
    errorText256.guideLayer = true;
    
    var errorTextDoc256 = errorText256.property("Source Text").value;
    errorTextDoc256.fontSize = 48;
    errorTextDoc256.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc256.font = "Arial-BoldMT";
    errorTextDoc256.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText256.property("Source Text").setValue(errorTextDoc256);
}

planCompositions[256] = planComp256;


// Composition pour plan 00257
var planComp257 = project.items.addComp(
    "SQ14_UNDLM_00257_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp257.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer257 = planComp257.layers.add(bgSolidComp);
bgLayer257.name = "BG_SOLID";
bgLayer257.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer257 = false;
if (gradingSources[257]) {
    var gradedLayer257 = planComp257.layers.add(gradingSources[257]);
    gradedLayer257.name = "UNDLM_00257_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer257.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer257.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer257 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer257 = false;
if (editSources[257]) {
    var editLayer257 = planComp257.layers.add(editSources[257]);
    editLayer257.name = "UNDLM_00257_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer257.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer257.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer257 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity257 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer257) {
    // EDIT toujours activé quand disponible
    editLayer257.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer257) {
        gradedLayer257.enabled = false;
    }
} else if (hasGradedLayer257) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer257.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText257 = planComp257.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText257.name = "WARNING_NO_EDIT";
    warningText257.property("Transform").property("Position").setValue([1280, 200]);
    warningText257.guideLayer = true;
    
    var warningTextDoc257 = warningText257.property("Source Text").value;
    warningTextDoc257.fontSize = 32;
    warningTextDoc257.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc257.font = "Arial-BoldMT";
    warningTextDoc257.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText257.property("Source Text").setValue(warningTextDoc257);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText257 = planComp257.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00257");
    errorText257.name = "ERROR_NO_SOURCE";
    errorText257.property("Transform").property("Position").setValue([1280, 720]);
    errorText257.guideLayer = true;
    
    var errorTextDoc257 = errorText257.property("Source Text").value;
    errorTextDoc257.fontSize = 48;
    errorTextDoc257.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc257.font = "Arial-BoldMT";
    errorTextDoc257.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText257.property("Source Text").setValue(errorTextDoc257);
}

planCompositions[257] = planComp257;


// Composition pour plan 00258
var planComp258 = project.items.addComp(
    "SQ14_UNDLM_00258_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp258.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer258 = planComp258.layers.add(bgSolidComp);
bgLayer258.name = "BG_SOLID";
bgLayer258.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer258 = false;
if (gradingSources[258]) {
    var gradedLayer258 = planComp258.layers.add(gradingSources[258]);
    gradedLayer258.name = "UNDLM_00258_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer258.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer258.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer258 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer258 = false;
if (editSources[258]) {
    var editLayer258 = planComp258.layers.add(editSources[258]);
    editLayer258.name = "UNDLM_00258_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer258.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer258.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer258 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity258 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer258) {
    // EDIT toujours activé quand disponible
    editLayer258.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer258) {
        gradedLayer258.enabled = false;
    }
} else if (hasGradedLayer258) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer258.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText258 = planComp258.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText258.name = "WARNING_NO_EDIT";
    warningText258.property("Transform").property("Position").setValue([1280, 200]);
    warningText258.guideLayer = true;
    
    var warningTextDoc258 = warningText258.property("Source Text").value;
    warningTextDoc258.fontSize = 32;
    warningTextDoc258.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc258.font = "Arial-BoldMT";
    warningTextDoc258.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText258.property("Source Text").setValue(warningTextDoc258);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText258 = planComp258.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00258");
    errorText258.name = "ERROR_NO_SOURCE";
    errorText258.property("Transform").property("Position").setValue([1280, 720]);
    errorText258.guideLayer = true;
    
    var errorTextDoc258 = errorText258.property("Source Text").value;
    errorTextDoc258.fontSize = 48;
    errorTextDoc258.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc258.font = "Arial-BoldMT";
    errorTextDoc258.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText258.property("Source Text").setValue(errorTextDoc258);
}

planCompositions[258] = planComp258;


// Composition pour plan 00259
var planComp259 = project.items.addComp(
    "SQ14_UNDLM_00259_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp259.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer259 = planComp259.layers.add(bgSolidComp);
bgLayer259.name = "BG_SOLID";
bgLayer259.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer259 = false;
if (gradingSources[259]) {
    var gradedLayer259 = planComp259.layers.add(gradingSources[259]);
    gradedLayer259.name = "UNDLM_00259_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer259.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer259.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer259 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer259 = false;
if (editSources[259]) {
    var editLayer259 = planComp259.layers.add(editSources[259]);
    editLayer259.name = "UNDLM_00259_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer259.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer259.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer259 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity259 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer259) {
    // EDIT toujours activé quand disponible
    editLayer259.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer259) {
        gradedLayer259.enabled = false;
    }
} else if (hasGradedLayer259) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer259.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText259 = planComp259.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText259.name = "WARNING_NO_EDIT";
    warningText259.property("Transform").property("Position").setValue([1280, 200]);
    warningText259.guideLayer = true;
    
    var warningTextDoc259 = warningText259.property("Source Text").value;
    warningTextDoc259.fontSize = 32;
    warningTextDoc259.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc259.font = "Arial-BoldMT";
    warningTextDoc259.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText259.property("Source Text").setValue(warningTextDoc259);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText259 = planComp259.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00259");
    errorText259.name = "ERROR_NO_SOURCE";
    errorText259.property("Transform").property("Position").setValue([1280, 720]);
    errorText259.guideLayer = true;
    
    var errorTextDoc259 = errorText259.property("Source Text").value;
    errorTextDoc259.fontSize = 48;
    errorTextDoc259.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc259.font = "Arial-BoldMT";
    errorTextDoc259.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText259.property("Source Text").setValue(errorTextDoc259);
}

planCompositions[259] = planComp259;


// Composition pour plan 00260
var planComp260 = project.items.addComp(
    "SQ14_UNDLM_00260_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp260.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer260 = planComp260.layers.add(bgSolidComp);
bgLayer260.name = "BG_SOLID";
bgLayer260.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer260 = false;
if (gradingSources[260]) {
    var gradedLayer260 = planComp260.layers.add(gradingSources[260]);
    gradedLayer260.name = "UNDLM_00260_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer260.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer260.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer260 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer260 = false;
if (editSources[260]) {
    var editLayer260 = planComp260.layers.add(editSources[260]);
    editLayer260.name = "UNDLM_00260_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer260.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer260.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer260 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity260 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer260) {
    // EDIT toujours activé quand disponible
    editLayer260.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer260) {
        gradedLayer260.enabled = false;
    }
} else if (hasGradedLayer260) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer260.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText260 = planComp260.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText260.name = "WARNING_NO_EDIT";
    warningText260.property("Transform").property("Position").setValue([1280, 200]);
    warningText260.guideLayer = true;
    
    var warningTextDoc260 = warningText260.property("Source Text").value;
    warningTextDoc260.fontSize = 32;
    warningTextDoc260.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc260.font = "Arial-BoldMT";
    warningTextDoc260.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText260.property("Source Text").setValue(warningTextDoc260);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText260 = planComp260.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00260");
    errorText260.name = "ERROR_NO_SOURCE";
    errorText260.property("Transform").property("Position").setValue([1280, 720]);
    errorText260.guideLayer = true;
    
    var errorTextDoc260 = errorText260.property("Source Text").value;
    errorTextDoc260.fontSize = 48;
    errorTextDoc260.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc260.font = "Arial-BoldMT";
    errorTextDoc260.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText260.property("Source Text").setValue(errorTextDoc260);
}

planCompositions[260] = planComp260;


// Composition pour plan 00261
var planComp261 = project.items.addComp(
    "SQ14_UNDLM_00261_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp261.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer261 = planComp261.layers.add(bgSolidComp);
bgLayer261.name = "BG_SOLID";
bgLayer261.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer261 = false;
if (gradingSources[261]) {
    var gradedLayer261 = planComp261.layers.add(gradingSources[261]);
    gradedLayer261.name = "UNDLM_00261_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer261.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer261.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer261 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer261 = false;
if (editSources[261]) {
    var editLayer261 = planComp261.layers.add(editSources[261]);
    editLayer261.name = "UNDLM_00261_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer261.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer261.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer261 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity261 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer261) {
    // EDIT toujours activé quand disponible
    editLayer261.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer261) {
        gradedLayer261.enabled = false;
    }
} else if (hasGradedLayer261) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer261.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText261 = planComp261.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText261.name = "WARNING_NO_EDIT";
    warningText261.property("Transform").property("Position").setValue([1280, 200]);
    warningText261.guideLayer = true;
    
    var warningTextDoc261 = warningText261.property("Source Text").value;
    warningTextDoc261.fontSize = 32;
    warningTextDoc261.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc261.font = "Arial-BoldMT";
    warningTextDoc261.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText261.property("Source Text").setValue(warningTextDoc261);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText261 = planComp261.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00261");
    errorText261.name = "ERROR_NO_SOURCE";
    errorText261.property("Transform").property("Position").setValue([1280, 720]);
    errorText261.guideLayer = true;
    
    var errorTextDoc261 = errorText261.property("Source Text").value;
    errorTextDoc261.fontSize = 48;
    errorTextDoc261.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc261.font = "Arial-BoldMT";
    errorTextDoc261.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText261.property("Source Text").setValue(errorTextDoc261);
}

planCompositions[261] = planComp261;


// Composition pour plan 00262
var planComp262 = project.items.addComp(
    "SQ14_UNDLM_00262_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    16.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp262.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer262 = planComp262.layers.add(bgSolidComp);
bgLayer262.name = "BG_SOLID";
bgLayer262.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer262 = false;
if (gradingSources[262]) {
    var gradedLayer262 = planComp262.layers.add(gradingSources[262]);
    gradedLayer262.name = "UNDLM_00262_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer262.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer262.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer262 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer262 = false;
if (editSources[262]) {
    var editLayer262 = planComp262.layers.add(editSources[262]);
    editLayer262.name = "UNDLM_00262_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer262.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer262.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer262 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity262 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer262) {
    // EDIT toujours activé quand disponible
    editLayer262.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer262) {
        gradedLayer262.enabled = false;
    }
} else if (hasGradedLayer262) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer262.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText262 = planComp262.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText262.name = "WARNING_NO_EDIT";
    warningText262.property("Transform").property("Position").setValue([1280, 200]);
    warningText262.guideLayer = true;
    
    var warningTextDoc262 = warningText262.property("Source Text").value;
    warningTextDoc262.fontSize = 32;
    warningTextDoc262.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc262.font = "Arial-BoldMT";
    warningTextDoc262.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText262.property("Source Text").setValue(warningTextDoc262);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText262 = planComp262.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00262");
    errorText262.name = "ERROR_NO_SOURCE";
    errorText262.property("Transform").property("Position").setValue([1280, 720]);
    errorText262.guideLayer = true;
    
    var errorTextDoc262 = errorText262.property("Source Text").value;
    errorTextDoc262.fontSize = 48;
    errorTextDoc262.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc262.font = "Arial-BoldMT";
    errorTextDoc262.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText262.property("Source Text").setValue(errorTextDoc262);
}

planCompositions[262] = planComp262;


// Composition pour plan 00263
var planComp263 = project.items.addComp(
    "SQ14_UNDLM_00263_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    14.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp263.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer263 = planComp263.layers.add(bgSolidComp);
bgLayer263.name = "BG_SOLID";
bgLayer263.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer263 = false;
if (gradingSources[263]) {
    var gradedLayer263 = planComp263.layers.add(gradingSources[263]);
    gradedLayer263.name = "UNDLM_00263_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer263.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer263.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer263 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer263 = false;
if (editSources[263]) {
    var editLayer263 = planComp263.layers.add(editSources[263]);
    editLayer263.name = "UNDLM_00263_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer263.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer263.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer263 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity263 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer263) {
    // EDIT toujours activé quand disponible
    editLayer263.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer263) {
        gradedLayer263.enabled = false;
    }
} else if (hasGradedLayer263) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer263.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText263 = planComp263.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText263.name = "WARNING_NO_EDIT";
    warningText263.property("Transform").property("Position").setValue([1280, 200]);
    warningText263.guideLayer = true;
    
    var warningTextDoc263 = warningText263.property("Source Text").value;
    warningTextDoc263.fontSize = 32;
    warningTextDoc263.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc263.font = "Arial-BoldMT";
    warningTextDoc263.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText263.property("Source Text").setValue(warningTextDoc263);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText263 = planComp263.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00263");
    errorText263.name = "ERROR_NO_SOURCE";
    errorText263.property("Transform").property("Position").setValue([1280, 720]);
    errorText263.guideLayer = true;
    
    var errorTextDoc263 = errorText263.property("Source Text").value;
    errorTextDoc263.fontSize = 48;
    errorTextDoc263.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc263.font = "Arial-BoldMT";
    errorTextDoc263.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText263.property("Source Text").setValue(errorTextDoc263);
}

planCompositions[263] = planComp263;


// Composition pour plan 00264
var planComp264 = project.items.addComp(
    "SQ14_UNDLM_00264_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp264.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer264 = planComp264.layers.add(bgSolidComp);
bgLayer264.name = "BG_SOLID";
bgLayer264.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer264 = false;
if (gradingSources[264]) {
    var gradedLayer264 = planComp264.layers.add(gradingSources[264]);
    gradedLayer264.name = "UNDLM_00264_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer264.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer264.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer264 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer264 = false;
if (editSources[264]) {
    var editLayer264 = planComp264.layers.add(editSources[264]);
    editLayer264.name = "UNDLM_00264_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer264.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer264.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer264 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity264 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer264) {
    // EDIT toujours activé quand disponible
    editLayer264.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer264) {
        gradedLayer264.enabled = false;
    }
} else if (hasGradedLayer264) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer264.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText264 = planComp264.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText264.name = "WARNING_NO_EDIT";
    warningText264.property("Transform").property("Position").setValue([1280, 200]);
    warningText264.guideLayer = true;
    
    var warningTextDoc264 = warningText264.property("Source Text").value;
    warningTextDoc264.fontSize = 32;
    warningTextDoc264.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc264.font = "Arial-BoldMT";
    warningTextDoc264.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText264.property("Source Text").setValue(warningTextDoc264);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText264 = planComp264.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00264");
    errorText264.name = "ERROR_NO_SOURCE";
    errorText264.property("Transform").property("Position").setValue([1280, 720]);
    errorText264.guideLayer = true;
    
    var errorTextDoc264 = errorText264.property("Source Text").value;
    errorTextDoc264.fontSize = 48;
    errorTextDoc264.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc264.font = "Arial-BoldMT";
    errorTextDoc264.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText264.property("Source Text").setValue(errorTextDoc264);
}

planCompositions[264] = planComp264;


// Composition pour plan 00265
var planComp265 = project.items.addComp(
    "SQ14_UNDLM_00265_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp265.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer265 = planComp265.layers.add(bgSolidComp);
bgLayer265.name = "BG_SOLID";
bgLayer265.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer265 = false;
if (gradingSources[265]) {
    var gradedLayer265 = planComp265.layers.add(gradingSources[265]);
    gradedLayer265.name = "UNDLM_00265_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer265.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer265.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer265 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer265 = false;
if (editSources[265]) {
    var editLayer265 = planComp265.layers.add(editSources[265]);
    editLayer265.name = "UNDLM_00265_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer265.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer265.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer265 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity265 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer265) {
    // EDIT toujours activé quand disponible
    editLayer265.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer265) {
        gradedLayer265.enabled = false;
    }
} else if (hasGradedLayer265) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer265.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText265 = planComp265.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText265.name = "WARNING_NO_EDIT";
    warningText265.property("Transform").property("Position").setValue([1280, 200]);
    warningText265.guideLayer = true;
    
    var warningTextDoc265 = warningText265.property("Source Text").value;
    warningTextDoc265.fontSize = 32;
    warningTextDoc265.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc265.font = "Arial-BoldMT";
    warningTextDoc265.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText265.property("Source Text").setValue(warningTextDoc265);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText265 = planComp265.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00265");
    errorText265.name = "ERROR_NO_SOURCE";
    errorText265.property("Transform").property("Position").setValue([1280, 720]);
    errorText265.guideLayer = true;
    
    var errorTextDoc265 = errorText265.property("Source Text").value;
    errorTextDoc265.fontSize = 48;
    errorTextDoc265.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc265.font = "Arial-BoldMT";
    errorTextDoc265.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText265.property("Source Text").setValue(errorTextDoc265);
}

planCompositions[265] = planComp265;


// Composition pour plan 00266
var planComp266 = project.items.addComp(
    "SQ14_UNDLM_00266_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp266.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer266 = planComp266.layers.add(bgSolidComp);
bgLayer266.name = "BG_SOLID";
bgLayer266.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer266 = false;
if (gradingSources[266]) {
    var gradedLayer266 = planComp266.layers.add(gradingSources[266]);
    gradedLayer266.name = "UNDLM_00266_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer266.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer266.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer266 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer266 = false;
if (editSources[266]) {
    var editLayer266 = planComp266.layers.add(editSources[266]);
    editLayer266.name = "UNDLM_00266_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer266.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer266.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer266 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity266 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer266) {
    // EDIT toujours activé quand disponible
    editLayer266.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer266) {
        gradedLayer266.enabled = false;
    }
} else if (hasGradedLayer266) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer266.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText266 = planComp266.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText266.name = "WARNING_NO_EDIT";
    warningText266.property("Transform").property("Position").setValue([1280, 200]);
    warningText266.guideLayer = true;
    
    var warningTextDoc266 = warningText266.property("Source Text").value;
    warningTextDoc266.fontSize = 32;
    warningTextDoc266.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc266.font = "Arial-BoldMT";
    warningTextDoc266.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText266.property("Source Text").setValue(warningTextDoc266);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText266 = planComp266.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00266");
    errorText266.name = "ERROR_NO_SOURCE";
    errorText266.property("Transform").property("Position").setValue([1280, 720]);
    errorText266.guideLayer = true;
    
    var errorTextDoc266 = errorText266.property("Source Text").value;
    errorTextDoc266.fontSize = 48;
    errorTextDoc266.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc266.font = "Arial-BoldMT";
    errorTextDoc266.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText266.property("Source Text").setValue(errorTextDoc266);
}

planCompositions[266] = planComp266;


// Composition pour plan 00267
var planComp267 = project.items.addComp(
    "SQ14_UNDLM_00267_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp267.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer267 = planComp267.layers.add(bgSolidComp);
bgLayer267.name = "BG_SOLID";
bgLayer267.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer267 = false;
if (gradingSources[267]) {
    var gradedLayer267 = planComp267.layers.add(gradingSources[267]);
    gradedLayer267.name = "UNDLM_00267_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer267.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer267.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer267 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer267 = false;
if (editSources[267]) {
    var editLayer267 = planComp267.layers.add(editSources[267]);
    editLayer267.name = "UNDLM_00267_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer267.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer267.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer267 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity267 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer267) {
    // EDIT toujours activé quand disponible
    editLayer267.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer267) {
        gradedLayer267.enabled = false;
    }
} else if (hasGradedLayer267) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer267.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText267 = planComp267.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText267.name = "WARNING_NO_EDIT";
    warningText267.property("Transform").property("Position").setValue([1280, 200]);
    warningText267.guideLayer = true;
    
    var warningTextDoc267 = warningText267.property("Source Text").value;
    warningTextDoc267.fontSize = 32;
    warningTextDoc267.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc267.font = "Arial-BoldMT";
    warningTextDoc267.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText267.property("Source Text").setValue(warningTextDoc267);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText267 = planComp267.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00267");
    errorText267.name = "ERROR_NO_SOURCE";
    errorText267.property("Transform").property("Position").setValue([1280, 720]);
    errorText267.guideLayer = true;
    
    var errorTextDoc267 = errorText267.property("Source Text").value;
    errorTextDoc267.fontSize = 48;
    errorTextDoc267.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc267.font = "Arial-BoldMT";
    errorTextDoc267.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText267.property("Source Text").setValue(errorTextDoc267);
}

planCompositions[267] = planComp267;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ14_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    143.64000000000001, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00249 à la timeline master
if (planCompositions[249]) {
    var masterLayer249 = masterComp.layers.add(planCompositions[249]);
    masterLayer249.startTime = 0;
    masterLayer249.name = "UNDLM_00249";
    masterLayer249.label = 1; // Couleurs alternées
}

// Ajouter plan 00250 à la timeline master
if (planCompositions[250]) {
    var masterLayer250 = masterComp.layers.add(planCompositions[250]);
    masterLayer250.startTime = 4.72;
    masterLayer250.name = "UNDLM_00250";
    masterLayer250.label = 2; // Couleurs alternées
}

// Ajouter plan 00251 à la timeline master
if (planCompositions[251]) {
    var masterLayer251 = masterComp.layers.add(planCompositions[251]);
    masterLayer251.startTime = 15.68;
    masterLayer251.name = "UNDLM_00251";
    masterLayer251.label = 3; // Couleurs alternées
}

// Ajouter plan 00252 à la timeline master
if (planCompositions[252]) {
    var masterLayer252 = masterComp.layers.add(planCompositions[252]);
    masterLayer252.startTime = 26.799999999999997;
    masterLayer252.name = "UNDLM_00252";
    masterLayer252.label = 4; // Couleurs alternées
}

// Ajouter plan 00253 à la timeline master
if (planCompositions[253]) {
    var masterLayer253 = masterComp.layers.add(planCompositions[253]);
    masterLayer253.startTime = 39.8;
    masterLayer253.name = "UNDLM_00253";
    masterLayer253.label = 5; // Couleurs alternées
}

// Ajouter plan 00254 à la timeline master
if (planCompositions[254]) {
    var masterLayer254 = masterComp.layers.add(planCompositions[254]);
    masterLayer254.startTime = 50.44;
    masterLayer254.name = "UNDLM_00254";
    masterLayer254.label = 6; // Couleurs alternées
}

// Ajouter plan 00255 à la timeline master
if (planCompositions[255]) {
    var masterLayer255 = masterComp.layers.add(planCompositions[255]);
    masterLayer255.startTime = 58.839999999999996;
    masterLayer255.name = "UNDLM_00255";
    masterLayer255.label = 7; // Couleurs alternées
}

// Ajouter plan 00256 à la timeline master
if (planCompositions[256]) {
    var masterLayer256 = masterComp.layers.add(planCompositions[256]);
    masterLayer256.startTime = 62.36;
    masterLayer256.name = "UNDLM_00256";
    masterLayer256.label = 8; // Couleurs alternées
}

// Ajouter plan 00257 à la timeline master
if (planCompositions[257]) {
    var masterLayer257 = masterComp.layers.add(planCompositions[257]);
    masterLayer257.startTime = 64.0;
    masterLayer257.name = "UNDLM_00257";
    masterLayer257.label = 9; // Couleurs alternées
}

// Ajouter plan 00258 à la timeline master
if (planCompositions[258]) {
    var masterLayer258 = masterComp.layers.add(planCompositions[258]);
    masterLayer258.startTime = 68.84;
    masterLayer258.name = "UNDLM_00258";
    masterLayer258.label = 10; // Couleurs alternées
}

// Ajouter plan 00259 à la timeline master
if (planCompositions[259]) {
    var masterLayer259 = masterComp.layers.add(planCompositions[259]);
    masterLayer259.startTime = 79.24000000000001;
    masterLayer259.name = "UNDLM_00259";
    masterLayer259.label = 11; // Couleurs alternées
}

// Ajouter plan 00260 à la timeline master
if (planCompositions[260]) {
    var masterLayer260 = masterComp.layers.add(planCompositions[260]);
    masterLayer260.startTime = 88.12;
    masterLayer260.name = "UNDLM_00260";
    masterLayer260.label = 12; // Couleurs alternées
}

// Ajouter plan 00261 à la timeline master
if (planCompositions[261]) {
    var masterLayer261 = masterComp.layers.add(planCompositions[261]);
    masterLayer261.startTime = 91.2;
    masterLayer261.name = "UNDLM_00261";
    masterLayer261.label = 13; // Couleurs alternées
}

// Ajouter plan 00262 à la timeline master
if (planCompositions[262]) {
    var masterLayer262 = masterComp.layers.add(planCompositions[262]);
    masterLayer262.startTime = 97.24000000000001;
    masterLayer262.name = "UNDLM_00262";
    masterLayer262.label = 14; // Couleurs alternées
}

// Ajouter plan 00263 à la timeline master
if (planCompositions[263]) {
    var masterLayer263 = masterComp.layers.add(planCompositions[263]);
    masterLayer263.startTime = 114.20000000000002;
    masterLayer263.name = "UNDLM_00263";
    masterLayer263.label = 15; // Couleurs alternées
}

// Ajouter plan 00264 à la timeline master
if (planCompositions[264]) {
    var masterLayer264 = masterComp.layers.add(planCompositions[264]);
    masterLayer264.startTime = 129.04000000000002;
    masterLayer264.name = "UNDLM_00264";
    masterLayer264.label = 16; // Couleurs alternées
}

// Ajouter plan 00265 à la timeline master
if (planCompositions[265]) {
    var masterLayer265 = masterComp.layers.add(planCompositions[265]);
    masterLayer265.startTime = 132.52;
    masterLayer265.name = "UNDLM_00265";
    masterLayer265.label = 1; // Couleurs alternées
}

// Ajouter plan 00266 à la timeline master
if (planCompositions[266]) {
    var masterLayer266 = masterComp.layers.add(planCompositions[266]);
    masterLayer266.startTime = 135.88000000000002;
    masterLayer266.name = "UNDLM_00266";
    masterLayer266.label = 2; // Couleurs alternées
}

// Ajouter plan 00267 à la timeline master
if (planCompositions[267]) {
    var masterLayer267 = masterComp.layers.add(planCompositions[267]);
    masterLayer267.startTime = 138.92000000000002;
    masterLayer267.name = "UNDLM_00267";
    masterLayer267.label = 3; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ14";\n' +
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
    {start: 0, end: 4.72, name: "UNDLM_00249"},
    {start: 4.72, end: 15.68, name: "UNDLM_00250"},
    {start: 15.68, end: 26.799999999999997, name: "UNDLM_00251"},
    {start: 26.799999999999997, end: 39.8, name: "UNDLM_00252"},
    {start: 39.8, end: 50.44, name: "UNDLM_00253"},
    {start: 50.44, end: 58.839999999999996, name: "UNDLM_00254"},
    {start: 58.839999999999996, end: 62.36, name: "UNDLM_00255"},
    {start: 62.36, end: 64.0, name: "UNDLM_00256"},
    {start: 64.0, end: 68.84, name: "UNDLM_00257"},
    {start: 68.84, end: 79.24000000000001, name: "UNDLM_00258"},
    {start: 79.24000000000001, end: 88.12, name: "UNDLM_00259"},
    {start: 88.12, end: 91.2, name: "UNDLM_00260"},
    {start: 91.2, end: 97.24000000000001, name: "UNDLM_00261"},
    {start: 97.24000000000001, end: 114.20000000000002, name: "UNDLM_00262"},
    {start: 114.20000000000002, end: 129.04000000000002, name: "UNDLM_00263"},
    {start: 129.04000000000002, end: 132.52, name: "UNDLM_00264"},
    {start: 132.52, end: 135.88000000000002, name: "UNDLM_00265"},
    {start: 135.88000000000002, end: 138.92000000000002, name: "UNDLM_00266"},
    {start: 138.92000000000002, end: 143.64000000000001, name: "UNDLM_00267"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ14/_AE/SQ14_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 19;
var totalCount = 19;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ14 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(143.64000000000001 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ14_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ14:" + totalCount + ":" + gradedCount);
