// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence P03_ALL avec 21 plans
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
alert("🔍 DIAGNOSTIC DOSSIERS:\n" +
      "EDIT existe: " + editFolder.exists + "\n" +
      "GRADING existe: " + gradingFolder.exists + "\n\n" +
      "Chemins testés:\n" +
      "EDIT: /Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS\n" +
      "GRADING: /Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS");

if (!editFolder.exists) {
    alert("❌ ERREUR CRITIQUE: Dossier EDIT non accessible!\n" +
          "Chemin: /Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS");
}


// Import plan EDIT 00202
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile202 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00202.mov");
var editFilePoignees202 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00202_AVEC_POIGNEES.mov");
var editFileBis202 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00202bis.mov");

var importSuccess202 = false;
var fileName202 = "";

// Tenter import standard
if (editFile202.exists) {
    try {
        var editFootage202 = project.importFile(new ImportOptions(editFile202));
        editFootage202.parentFolder = fromEditFolder;
        editFootage202.name = "UNDLM_00202";
        editSources[202] = editFootage202;
        fileName202 = "UNDLM_00202.mov";
        importSuccess202 = true;
        editImportCount++;
        logImportSuccess(202, "EDIT", editFile202.fsName, fileName202);
    } catch (e) {
        logImportError(202, "EDIT", editFile202.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess202 && editFilePoignees202.exists) {
    try {
        var editFootage202 = project.importFile(new ImportOptions(editFilePoignees202));
        editFootage202.parentFolder = fromEditFolder;
        editFootage202.name = "UNDLM_00202";
        editSources[202] = editFootage202;
        fileName202 = "UNDLM_00202_AVEC_POIGNEES.mov";
        importSuccess202 = true;
        editImportCount++;
        logImportSuccess(202, "EDIT", editFilePoignees202.fsName, fileName202);
    } catch (e) {
        logImportError(202, "EDIT", editFilePoignees202.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess202 && editFileBis202.exists) {
    try {
        var editFootage202 = project.importFile(new ImportOptions(editFileBis202));
        editFootage202.parentFolder = fromEditFolder;
        editFootage202.name = "UNDLM_00202";
        editSources[202] = editFootage202;
        fileName202 = "UNDLM_00202bis.mov";
        importSuccess202 = true;
        editImportCount++;
        logImportSuccess(202, "EDIT", editFileBis202.fsName, fileName202);
    } catch (e) {
        logImportError(202, "EDIT", editFileBis202.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess202) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00202.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00202.mov: " + editFile202.exists + "\n" +
          "• UNDLM_00202_AVEC_POIGNEES.mov: " + editFilePoignees202.exists + "\n" +
          "• UNDLM_00202bis.mov: " + editFileBis202.exists);
}

// Import plan EDIT 00214
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile214 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00214.mov");
var editFilePoignees214 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00214_AVEC_POIGNEES.mov");
var editFileBis214 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00214bis.mov");

var importSuccess214 = false;
var fileName214 = "";

// Tenter import standard
if (editFile214.exists) {
    try {
        var editFootage214 = project.importFile(new ImportOptions(editFile214));
        editFootage214.parentFolder = fromEditFolder;
        editFootage214.name = "UNDLM_00214";
        editSources[214] = editFootage214;
        fileName214 = "UNDLM_00214.mov";
        importSuccess214 = true;
        editImportCount++;
        logImportSuccess(214, "EDIT", editFile214.fsName, fileName214);
    } catch (e) {
        logImportError(214, "EDIT", editFile214.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess214 && editFilePoignees214.exists) {
    try {
        var editFootage214 = project.importFile(new ImportOptions(editFilePoignees214));
        editFootage214.parentFolder = fromEditFolder;
        editFootage214.name = "UNDLM_00214";
        editSources[214] = editFootage214;
        fileName214 = "UNDLM_00214_AVEC_POIGNEES.mov";
        importSuccess214 = true;
        editImportCount++;
        logImportSuccess(214, "EDIT", editFilePoignees214.fsName, fileName214);
    } catch (e) {
        logImportError(214, "EDIT", editFilePoignees214.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess214 && editFileBis214.exists) {
    try {
        var editFootage214 = project.importFile(new ImportOptions(editFileBis214));
        editFootage214.parentFolder = fromEditFolder;
        editFootage214.name = "UNDLM_00214";
        editSources[214] = editFootage214;
        fileName214 = "UNDLM_00214bis.mov";
        importSuccess214 = true;
        editImportCount++;
        logImportSuccess(214, "EDIT", editFileBis214.fsName, fileName214);
    } catch (e) {
        logImportError(214, "EDIT", editFileBis214.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess214) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00214.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00214.mov: " + editFile214.exists + "\n" +
          "• UNDLM_00214_AVEC_POIGNEES.mov: " + editFilePoignees214.exists + "\n" +
          "• UNDLM_00214bis.mov: " + editFileBis214.exists);
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
        fileName240 = "UNDLM_00240.mov";
        importSuccess240 = true;
        editImportCount++;
        logImportSuccess(240, "EDIT", editFile240.fsName, fileName240);
    } catch (e) {
        logImportError(240, "EDIT", editFile240.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess240 && editFilePoignees240.exists) {
    try {
        var editFootage240 = project.importFile(new ImportOptions(editFilePoignees240));
        editFootage240.parentFolder = fromEditFolder;
        editFootage240.name = "UNDLM_00240";
        editSources[240] = editFootage240;
        fileName240 = "UNDLM_00240_AVEC_POIGNEES.mov";
        importSuccess240 = true;
        editImportCount++;
        logImportSuccess(240, "EDIT", editFilePoignees240.fsName, fileName240);
    } catch (e) {
        logImportError(240, "EDIT", editFilePoignees240.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess240 && editFileBis240.exists) {
    try {
        var editFootage240 = project.importFile(new ImportOptions(editFileBis240));
        editFootage240.parentFolder = fromEditFolder;
        editFootage240.name = "UNDLM_00240";
        editSources[240] = editFootage240;
        fileName240 = "UNDLM_00240bis.mov";
        importSuccess240 = true;
        editImportCount++;
        logImportSuccess(240, "EDIT", editFileBis240.fsName, fileName240);
    } catch (e) {
        logImportError(240, "EDIT", editFileBis240.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess240) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00240.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00240.mov: " + editFile240.exists + "\n" +
          "• UNDLM_00240_AVEC_POIGNEES.mov: " + editFilePoignees240.exists + "\n" +
          "• UNDLM_00240bis.mov: " + editFileBis240.exists);
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
        fileName253 = "UNDLM_00253.mov";
        importSuccess253 = true;
        editImportCount++;
        logImportSuccess(253, "EDIT", editFile253.fsName, fileName253);
    } catch (e) {
        logImportError(253, "EDIT", editFile253.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess253 && editFilePoignees253.exists) {
    try {
        var editFootage253 = project.importFile(new ImportOptions(editFilePoignees253));
        editFootage253.parentFolder = fromEditFolder;
        editFootage253.name = "UNDLM_00253";
        editSources[253] = editFootage253;
        fileName253 = "UNDLM_00253_AVEC_POIGNEES.mov";
        importSuccess253 = true;
        editImportCount++;
        logImportSuccess(253, "EDIT", editFilePoignees253.fsName, fileName253);
    } catch (e) {
        logImportError(253, "EDIT", editFilePoignees253.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess253 && editFileBis253.exists) {
    try {
        var editFootage253 = project.importFile(new ImportOptions(editFileBis253));
        editFootage253.parentFolder = fromEditFolder;
        editFootage253.name = "UNDLM_00253";
        editSources[253] = editFootage253;
        fileName253 = "UNDLM_00253bis.mov";
        importSuccess253 = true;
        editImportCount++;
        logImportSuccess(253, "EDIT", editFileBis253.fsName, fileName253);
    } catch (e) {
        logImportError(253, "EDIT", editFileBis253.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess253) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00253.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00253.mov: " + editFile253.exists + "\n" +
          "• UNDLM_00253_AVEC_POIGNEES.mov: " + editFilePoignees253.exists + "\n" +
          "• UNDLM_00253bis.mov: " + editFileBis253.exists);
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
        fileName257 = "UNDLM_00257.mov";
        importSuccess257 = true;
        editImportCount++;
        logImportSuccess(257, "EDIT", editFile257.fsName, fileName257);
    } catch (e) {
        logImportError(257, "EDIT", editFile257.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess257 && editFilePoignees257.exists) {
    try {
        var editFootage257 = project.importFile(new ImportOptions(editFilePoignees257));
        editFootage257.parentFolder = fromEditFolder;
        editFootage257.name = "UNDLM_00257";
        editSources[257] = editFootage257;
        fileName257 = "UNDLM_00257_AVEC_POIGNEES.mov";
        importSuccess257 = true;
        editImportCount++;
        logImportSuccess(257, "EDIT", editFilePoignees257.fsName, fileName257);
    } catch (e) {
        logImportError(257, "EDIT", editFilePoignees257.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess257 && editFileBis257.exists) {
    try {
        var editFootage257 = project.importFile(new ImportOptions(editFileBis257));
        editFootage257.parentFolder = fromEditFolder;
        editFootage257.name = "UNDLM_00257";
        editSources[257] = editFootage257;
        fileName257 = "UNDLM_00257bis.mov";
        importSuccess257 = true;
        editImportCount++;
        logImportSuccess(257, "EDIT", editFileBis257.fsName, fileName257);
    } catch (e) {
        logImportError(257, "EDIT", editFileBis257.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess257) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00257.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00257.mov: " + editFile257.exists + "\n" +
          "• UNDLM_00257_AVEC_POIGNEES.mov: " + editFilePoignees257.exists + "\n" +
          "• UNDLM_00257bis.mov: " + editFileBis257.exists);
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
        fileName259 = "UNDLM_00259.mov";
        importSuccess259 = true;
        editImportCount++;
        logImportSuccess(259, "EDIT", editFile259.fsName, fileName259);
    } catch (e) {
        logImportError(259, "EDIT", editFile259.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess259 && editFilePoignees259.exists) {
    try {
        var editFootage259 = project.importFile(new ImportOptions(editFilePoignees259));
        editFootage259.parentFolder = fromEditFolder;
        editFootage259.name = "UNDLM_00259";
        editSources[259] = editFootage259;
        fileName259 = "UNDLM_00259_AVEC_POIGNEES.mov";
        importSuccess259 = true;
        editImportCount++;
        logImportSuccess(259, "EDIT", editFilePoignees259.fsName, fileName259);
    } catch (e) {
        logImportError(259, "EDIT", editFilePoignees259.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess259 && editFileBis259.exists) {
    try {
        var editFootage259 = project.importFile(new ImportOptions(editFileBis259));
        editFootage259.parentFolder = fromEditFolder;
        editFootage259.name = "UNDLM_00259";
        editSources[259] = editFootage259;
        fileName259 = "UNDLM_00259bis.mov";
        importSuccess259 = true;
        editImportCount++;
        logImportSuccess(259, "EDIT", editFileBis259.fsName, fileName259);
    } catch (e) {
        logImportError(259, "EDIT", editFileBis259.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess259) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00259.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00259.mov: " + editFile259.exists + "\n" +
          "• UNDLM_00259_AVEC_POIGNEES.mov: " + editFilePoignees259.exists + "\n" +
          "• UNDLM_00259bis.mov: " + editFileBis259.exists);
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
        fileName260 = "UNDLM_00260.mov";
        importSuccess260 = true;
        editImportCount++;
        logImportSuccess(260, "EDIT", editFile260.fsName, fileName260);
    } catch (e) {
        logImportError(260, "EDIT", editFile260.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess260 && editFilePoignees260.exists) {
    try {
        var editFootage260 = project.importFile(new ImportOptions(editFilePoignees260));
        editFootage260.parentFolder = fromEditFolder;
        editFootage260.name = "UNDLM_00260";
        editSources[260] = editFootage260;
        fileName260 = "UNDLM_00260_AVEC_POIGNEES.mov";
        importSuccess260 = true;
        editImportCount++;
        logImportSuccess(260, "EDIT", editFilePoignees260.fsName, fileName260);
    } catch (e) {
        logImportError(260, "EDIT", editFilePoignees260.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess260 && editFileBis260.exists) {
    try {
        var editFootage260 = project.importFile(new ImportOptions(editFileBis260));
        editFootage260.parentFolder = fromEditFolder;
        editFootage260.name = "UNDLM_00260";
        editSources[260] = editFootage260;
        fileName260 = "UNDLM_00260bis.mov";
        importSuccess260 = true;
        editImportCount++;
        logImportSuccess(260, "EDIT", editFileBis260.fsName, fileName260);
    } catch (e) {
        logImportError(260, "EDIT", editFileBis260.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess260) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00260.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00260.mov: " + editFile260.exists + "\n" +
          "• UNDLM_00260_AVEC_POIGNEES.mov: " + editFilePoignees260.exists + "\n" +
          "• UNDLM_00260bis.mov: " + editFileBis260.exists);
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
        fileName261 = "UNDLM_00261.mov";
        importSuccess261 = true;
        editImportCount++;
        logImportSuccess(261, "EDIT", editFile261.fsName, fileName261);
    } catch (e) {
        logImportError(261, "EDIT", editFile261.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess261 && editFilePoignees261.exists) {
    try {
        var editFootage261 = project.importFile(new ImportOptions(editFilePoignees261));
        editFootage261.parentFolder = fromEditFolder;
        editFootage261.name = "UNDLM_00261";
        editSources[261] = editFootage261;
        fileName261 = "UNDLM_00261_AVEC_POIGNEES.mov";
        importSuccess261 = true;
        editImportCount++;
        logImportSuccess(261, "EDIT", editFilePoignees261.fsName, fileName261);
    } catch (e) {
        logImportError(261, "EDIT", editFilePoignees261.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess261 && editFileBis261.exists) {
    try {
        var editFootage261 = project.importFile(new ImportOptions(editFileBis261));
        editFootage261.parentFolder = fromEditFolder;
        editFootage261.name = "UNDLM_00261";
        editSources[261] = editFootage261;
        fileName261 = "UNDLM_00261bis.mov";
        importSuccess261 = true;
        editImportCount++;
        logImportSuccess(261, "EDIT", editFileBis261.fsName, fileName261);
    } catch (e) {
        logImportError(261, "EDIT", editFileBis261.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess261) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00261.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00261.mov: " + editFile261.exists + "\n" +
          "• UNDLM_00261_AVEC_POIGNEES.mov: " + editFilePoignees261.exists + "\n" +
          "• UNDLM_00261bis.mov: " + editFileBis261.exists);
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
        fileName264 = "UNDLM_00264.mov";
        importSuccess264 = true;
        editImportCount++;
        logImportSuccess(264, "EDIT", editFile264.fsName, fileName264);
    } catch (e) {
        logImportError(264, "EDIT", editFile264.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess264 && editFilePoignees264.exists) {
    try {
        var editFootage264 = project.importFile(new ImportOptions(editFilePoignees264));
        editFootage264.parentFolder = fromEditFolder;
        editFootage264.name = "UNDLM_00264";
        editSources[264] = editFootage264;
        fileName264 = "UNDLM_00264_AVEC_POIGNEES.mov";
        importSuccess264 = true;
        editImportCount++;
        logImportSuccess(264, "EDIT", editFilePoignees264.fsName, fileName264);
    } catch (e) {
        logImportError(264, "EDIT", editFilePoignees264.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess264 && editFileBis264.exists) {
    try {
        var editFootage264 = project.importFile(new ImportOptions(editFileBis264));
        editFootage264.parentFolder = fromEditFolder;
        editFootage264.name = "UNDLM_00264";
        editSources[264] = editFootage264;
        fileName264 = "UNDLM_00264bis.mov";
        importSuccess264 = true;
        editImportCount++;
        logImportSuccess(264, "EDIT", editFileBis264.fsName, fileName264);
    } catch (e) {
        logImportError(264, "EDIT", editFileBis264.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess264) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00264.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00264.mov: " + editFile264.exists + "\n" +
          "• UNDLM_00264_AVEC_POIGNEES.mov: " + editFilePoignees264.exists + "\n" +
          "• UNDLM_00264bis.mov: " + editFileBis264.exists);
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
        fileName265 = "UNDLM_00265.mov";
        importSuccess265 = true;
        editImportCount++;
        logImportSuccess(265, "EDIT", editFile265.fsName, fileName265);
    } catch (e) {
        logImportError(265, "EDIT", editFile265.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess265 && editFilePoignees265.exists) {
    try {
        var editFootage265 = project.importFile(new ImportOptions(editFilePoignees265));
        editFootage265.parentFolder = fromEditFolder;
        editFootage265.name = "UNDLM_00265";
        editSources[265] = editFootage265;
        fileName265 = "UNDLM_00265_AVEC_POIGNEES.mov";
        importSuccess265 = true;
        editImportCount++;
        logImportSuccess(265, "EDIT", editFilePoignees265.fsName, fileName265);
    } catch (e) {
        logImportError(265, "EDIT", editFilePoignees265.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess265 && editFileBis265.exists) {
    try {
        var editFootage265 = project.importFile(new ImportOptions(editFileBis265));
        editFootage265.parentFolder = fromEditFolder;
        editFootage265.name = "UNDLM_00265";
        editSources[265] = editFootage265;
        fileName265 = "UNDLM_00265bis.mov";
        importSuccess265 = true;
        editImportCount++;
        logImportSuccess(265, "EDIT", editFileBis265.fsName, fileName265);
    } catch (e) {
        logImportError(265, "EDIT", editFileBis265.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess265) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00265.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00265.mov: " + editFile265.exists + "\n" +
          "• UNDLM_00265_AVEC_POIGNEES.mov: " + editFilePoignees265.exists + "\n" +
          "• UNDLM_00265bis.mov: " + editFileBis265.exists);
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
        fileName266 = "UNDLM_00266.mov";
        importSuccess266 = true;
        editImportCount++;
        logImportSuccess(266, "EDIT", editFile266.fsName, fileName266);
    } catch (e) {
        logImportError(266, "EDIT", editFile266.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess266 && editFilePoignees266.exists) {
    try {
        var editFootage266 = project.importFile(new ImportOptions(editFilePoignees266));
        editFootage266.parentFolder = fromEditFolder;
        editFootage266.name = "UNDLM_00266";
        editSources[266] = editFootage266;
        fileName266 = "UNDLM_00266_AVEC_POIGNEES.mov";
        importSuccess266 = true;
        editImportCount++;
        logImportSuccess(266, "EDIT", editFilePoignees266.fsName, fileName266);
    } catch (e) {
        logImportError(266, "EDIT", editFilePoignees266.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess266 && editFileBis266.exists) {
    try {
        var editFootage266 = project.importFile(new ImportOptions(editFileBis266));
        editFootage266.parentFolder = fromEditFolder;
        editFootage266.name = "UNDLM_00266";
        editSources[266] = editFootage266;
        fileName266 = "UNDLM_00266bis.mov";
        importSuccess266 = true;
        editImportCount++;
        logImportSuccess(266, "EDIT", editFileBis266.fsName, fileName266);
    } catch (e) {
        logImportError(266, "EDIT", editFileBis266.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess266) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00266.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00266.mov: " + editFile266.exists + "\n" +
          "• UNDLM_00266_AVEC_POIGNEES.mov: " + editFilePoignees266.exists + "\n" +
          "• UNDLM_00266bis.mov: " + editFileBis266.exists);
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
        fileName267 = "UNDLM_00267.mov";
        importSuccess267 = true;
        editImportCount++;
        logImportSuccess(267, "EDIT", editFile267.fsName, fileName267);
    } catch (e) {
        logImportError(267, "EDIT", editFile267.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess267 && editFilePoignees267.exists) {
    try {
        var editFootage267 = project.importFile(new ImportOptions(editFilePoignees267));
        editFootage267.parentFolder = fromEditFolder;
        editFootage267.name = "UNDLM_00267";
        editSources[267] = editFootage267;
        fileName267 = "UNDLM_00267_AVEC_POIGNEES.mov";
        importSuccess267 = true;
        editImportCount++;
        logImportSuccess(267, "EDIT", editFilePoignees267.fsName, fileName267);
    } catch (e) {
        logImportError(267, "EDIT", editFilePoignees267.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess267 && editFileBis267.exists) {
    try {
        var editFootage267 = project.importFile(new ImportOptions(editFileBis267));
        editFootage267.parentFolder = fromEditFolder;
        editFootage267.name = "UNDLM_00267";
        editSources[267] = editFootage267;
        fileName267 = "UNDLM_00267bis.mov";
        importSuccess267 = true;
        editImportCount++;
        logImportSuccess(267, "EDIT", editFileBis267.fsName, fileName267);
    } catch (e) {
        logImportError(267, "EDIT", editFileBis267.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess267) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00267.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00267.mov: " + editFile267.exists + "\n" +
          "• UNDLM_00267_AVEC_POIGNEES.mov: " + editFilePoignees267.exists + "\n" +
          "• UNDLM_00267bis.mov: " + editFileBis267.exists);
}

// Import plan EDIT 00278
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile278 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00278.mov");
var editFilePoignees278 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00278_AVEC_POIGNEES.mov");
var editFileBis278 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00278bis.mov");

var importSuccess278 = false;
var fileName278 = "";

// Tenter import standard
if (editFile278.exists) {
    try {
        var editFootage278 = project.importFile(new ImportOptions(editFile278));
        editFootage278.parentFolder = fromEditFolder;
        editFootage278.name = "UNDLM_00278";
        editSources[278] = editFootage278;
        fileName278 = "UNDLM_00278.mov";
        importSuccess278 = true;
        editImportCount++;
        logImportSuccess(278, "EDIT", editFile278.fsName, fileName278);
    } catch (e) {
        logImportError(278, "EDIT", editFile278.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess278 && editFilePoignees278.exists) {
    try {
        var editFootage278 = project.importFile(new ImportOptions(editFilePoignees278));
        editFootage278.parentFolder = fromEditFolder;
        editFootage278.name = "UNDLM_00278";
        editSources[278] = editFootage278;
        fileName278 = "UNDLM_00278_AVEC_POIGNEES.mov";
        importSuccess278 = true;
        editImportCount++;
        logImportSuccess(278, "EDIT", editFilePoignees278.fsName, fileName278);
    } catch (e) {
        logImportError(278, "EDIT", editFilePoignees278.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess278 && editFileBis278.exists) {
    try {
        var editFootage278 = project.importFile(new ImportOptions(editFileBis278));
        editFootage278.parentFolder = fromEditFolder;
        editFootage278.name = "UNDLM_00278";
        editSources[278] = editFootage278;
        fileName278 = "UNDLM_00278bis.mov";
        importSuccess278 = true;
        editImportCount++;
        logImportSuccess(278, "EDIT", editFileBis278.fsName, fileName278);
    } catch (e) {
        logImportError(278, "EDIT", editFileBis278.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess278) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00278.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00278.mov: " + editFile278.exists + "\n" +
          "• UNDLM_00278_AVEC_POIGNEES.mov: " + editFilePoignees278.exists + "\n" +
          "• UNDLM_00278bis.mov: " + editFileBis278.exists);
}

// Import plan EDIT 00281
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile281 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00281.mov");
var editFilePoignees281 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00281_AVEC_POIGNEES.mov");
var editFileBis281 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00281bis.mov");

var importSuccess281 = false;
var fileName281 = "";

// Tenter import standard
if (editFile281.exists) {
    try {
        var editFootage281 = project.importFile(new ImportOptions(editFile281));
        editFootage281.parentFolder = fromEditFolder;
        editFootage281.name = "UNDLM_00281";
        editSources[281] = editFootage281;
        fileName281 = "UNDLM_00281.mov";
        importSuccess281 = true;
        editImportCount++;
        logImportSuccess(281, "EDIT", editFile281.fsName, fileName281);
    } catch (e) {
        logImportError(281, "EDIT", editFile281.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess281 && editFilePoignees281.exists) {
    try {
        var editFootage281 = project.importFile(new ImportOptions(editFilePoignees281));
        editFootage281.parentFolder = fromEditFolder;
        editFootage281.name = "UNDLM_00281";
        editSources[281] = editFootage281;
        fileName281 = "UNDLM_00281_AVEC_POIGNEES.mov";
        importSuccess281 = true;
        editImportCount++;
        logImportSuccess(281, "EDIT", editFilePoignees281.fsName, fileName281);
    } catch (e) {
        logImportError(281, "EDIT", editFilePoignees281.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess281 && editFileBis281.exists) {
    try {
        var editFootage281 = project.importFile(new ImportOptions(editFileBis281));
        editFootage281.parentFolder = fromEditFolder;
        editFootage281.name = "UNDLM_00281";
        editSources[281] = editFootage281;
        fileName281 = "UNDLM_00281bis.mov";
        importSuccess281 = true;
        editImportCount++;
        logImportSuccess(281, "EDIT", editFileBis281.fsName, fileName281);
    } catch (e) {
        logImportError(281, "EDIT", editFileBis281.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess281) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00281.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00281.mov: " + editFile281.exists + "\n" +
          "• UNDLM_00281_AVEC_POIGNEES.mov: " + editFilePoignees281.exists + "\n" +
          "• UNDLM_00281bis.mov: " + editFileBis281.exists);
}

// Import plan EDIT 00284
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile284 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00284.mov");
var editFilePoignees284 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00284_AVEC_POIGNEES.mov");
var editFileBis284 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00284bis.mov");

var importSuccess284 = false;
var fileName284 = "";

// Tenter import standard
if (editFile284.exists) {
    try {
        var editFootage284 = project.importFile(new ImportOptions(editFile284));
        editFootage284.parentFolder = fromEditFolder;
        editFootage284.name = "UNDLM_00284";
        editSources[284] = editFootage284;
        fileName284 = "UNDLM_00284.mov";
        importSuccess284 = true;
        editImportCount++;
        logImportSuccess(284, "EDIT", editFile284.fsName, fileName284);
    } catch (e) {
        logImportError(284, "EDIT", editFile284.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess284 && editFilePoignees284.exists) {
    try {
        var editFootage284 = project.importFile(new ImportOptions(editFilePoignees284));
        editFootage284.parentFolder = fromEditFolder;
        editFootage284.name = "UNDLM_00284";
        editSources[284] = editFootage284;
        fileName284 = "UNDLM_00284_AVEC_POIGNEES.mov";
        importSuccess284 = true;
        editImportCount++;
        logImportSuccess(284, "EDIT", editFilePoignees284.fsName, fileName284);
    } catch (e) {
        logImportError(284, "EDIT", editFilePoignees284.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess284 && editFileBis284.exists) {
    try {
        var editFootage284 = project.importFile(new ImportOptions(editFileBis284));
        editFootage284.parentFolder = fromEditFolder;
        editFootage284.name = "UNDLM_00284";
        editSources[284] = editFootage284;
        fileName284 = "UNDLM_00284bis.mov";
        importSuccess284 = true;
        editImportCount++;
        logImportSuccess(284, "EDIT", editFileBis284.fsName, fileName284);
    } catch (e) {
        logImportError(284, "EDIT", editFileBis284.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess284) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00284.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00284.mov: " + editFile284.exists + "\n" +
          "• UNDLM_00284_AVEC_POIGNEES.mov: " + editFilePoignees284.exists + "\n" +
          "• UNDLM_00284bis.mov: " + editFileBis284.exists);
}

// Import plan EDIT 00286
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile286 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00286.mov");
var editFilePoignees286 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00286_AVEC_POIGNEES.mov");
var editFileBis286 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00286bis.mov");

var importSuccess286 = false;
var fileName286 = "";

// Tenter import standard
if (editFile286.exists) {
    try {
        var editFootage286 = project.importFile(new ImportOptions(editFile286));
        editFootage286.parentFolder = fromEditFolder;
        editFootage286.name = "UNDLM_00286";
        editSources[286] = editFootage286;
        fileName286 = "UNDLM_00286.mov";
        importSuccess286 = true;
        editImportCount++;
        logImportSuccess(286, "EDIT", editFile286.fsName, fileName286);
    } catch (e) {
        logImportError(286, "EDIT", editFile286.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess286 && editFilePoignees286.exists) {
    try {
        var editFootage286 = project.importFile(new ImportOptions(editFilePoignees286));
        editFootage286.parentFolder = fromEditFolder;
        editFootage286.name = "UNDLM_00286";
        editSources[286] = editFootage286;
        fileName286 = "UNDLM_00286_AVEC_POIGNEES.mov";
        importSuccess286 = true;
        editImportCount++;
        logImportSuccess(286, "EDIT", editFilePoignees286.fsName, fileName286);
    } catch (e) {
        logImportError(286, "EDIT", editFilePoignees286.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess286 && editFileBis286.exists) {
    try {
        var editFootage286 = project.importFile(new ImportOptions(editFileBis286));
        editFootage286.parentFolder = fromEditFolder;
        editFootage286.name = "UNDLM_00286";
        editSources[286] = editFootage286;
        fileName286 = "UNDLM_00286bis.mov";
        importSuccess286 = true;
        editImportCount++;
        logImportSuccess(286, "EDIT", editFileBis286.fsName, fileName286);
    } catch (e) {
        logImportError(286, "EDIT", editFileBis286.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess286) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00286.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00286.mov: " + editFile286.exists + "\n" +
          "• UNDLM_00286_AVEC_POIGNEES.mov: " + editFilePoignees286.exists + "\n" +
          "• UNDLM_00286bis.mov: " + editFileBis286.exists);
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
        fileName332 = "UNDLM_00332.mov";
        importSuccess332 = true;
        editImportCount++;
        logImportSuccess(332, "EDIT", editFile332.fsName, fileName332);
    } catch (e) {
        logImportError(332, "EDIT", editFile332.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess332 && editFilePoignees332.exists) {
    try {
        var editFootage332 = project.importFile(new ImportOptions(editFilePoignees332));
        editFootage332.parentFolder = fromEditFolder;
        editFootage332.name = "UNDLM_00332";
        editSources[332] = editFootage332;
        fileName332 = "UNDLM_00332_AVEC_POIGNEES.mov";
        importSuccess332 = true;
        editImportCount++;
        logImportSuccess(332, "EDIT", editFilePoignees332.fsName, fileName332);
    } catch (e) {
        logImportError(332, "EDIT", editFilePoignees332.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess332 && editFileBis332.exists) {
    try {
        var editFootage332 = project.importFile(new ImportOptions(editFileBis332));
        editFootage332.parentFolder = fromEditFolder;
        editFootage332.name = "UNDLM_00332";
        editSources[332] = editFootage332;
        fileName332 = "UNDLM_00332bis.mov";
        importSuccess332 = true;
        editImportCount++;
        logImportSuccess(332, "EDIT", editFileBis332.fsName, fileName332);
    } catch (e) {
        logImportError(332, "EDIT", editFileBis332.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess332) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00332.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00332.mov: " + editFile332.exists + "\n" +
          "• UNDLM_00332_AVEC_POIGNEES.mov: " + editFilePoignees332.exists + "\n" +
          "• UNDLM_00332bis.mov: " + editFileBis332.exists);
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
        fileName333 = "UNDLM_00333.mov";
        importSuccess333 = true;
        editImportCount++;
        logImportSuccess(333, "EDIT", editFile333.fsName, fileName333);
    } catch (e) {
        logImportError(333, "EDIT", editFile333.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess333 && editFilePoignees333.exists) {
    try {
        var editFootage333 = project.importFile(new ImportOptions(editFilePoignees333));
        editFootage333.parentFolder = fromEditFolder;
        editFootage333.name = "UNDLM_00333";
        editSources[333] = editFootage333;
        fileName333 = "UNDLM_00333_AVEC_POIGNEES.mov";
        importSuccess333 = true;
        editImportCount++;
        logImportSuccess(333, "EDIT", editFilePoignees333.fsName, fileName333);
    } catch (e) {
        logImportError(333, "EDIT", editFilePoignees333.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess333 && editFileBis333.exists) {
    try {
        var editFootage333 = project.importFile(new ImportOptions(editFileBis333));
        editFootage333.parentFolder = fromEditFolder;
        editFootage333.name = "UNDLM_00333";
        editSources[333] = editFootage333;
        fileName333 = "UNDLM_00333bis.mov";
        importSuccess333 = true;
        editImportCount++;
        logImportSuccess(333, "EDIT", editFileBis333.fsName, fileName333);
    } catch (e) {
        logImportError(333, "EDIT", editFileBis333.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess333) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00333.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00333.mov: " + editFile333.exists + "\n" +
          "• UNDLM_00333_AVEC_POIGNEES.mov: " + editFilePoignees333.exists + "\n" +
          "• UNDLM_00333bis.mov: " + editFileBis333.exists);
}

// Import plan EDIT 00383
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile383 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00383.mov");
var editFilePoignees383 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00383_AVEC_POIGNEES.mov");
var editFileBis383 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00383bis.mov");

var importSuccess383 = false;
var fileName383 = "";

// Tenter import standard
if (editFile383.exists) {
    try {
        var editFootage383 = project.importFile(new ImportOptions(editFile383));
        editFootage383.parentFolder = fromEditFolder;
        editFootage383.name = "UNDLM_00383";
        editSources[383] = editFootage383;
        fileName383 = "UNDLM_00383.mov";
        importSuccess383 = true;
        editImportCount++;
        logImportSuccess(383, "EDIT", editFile383.fsName, fileName383);
    } catch (e) {
        logImportError(383, "EDIT", editFile383.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess383 && editFilePoignees383.exists) {
    try {
        var editFootage383 = project.importFile(new ImportOptions(editFilePoignees383));
        editFootage383.parentFolder = fromEditFolder;
        editFootage383.name = "UNDLM_00383";
        editSources[383] = editFootage383;
        fileName383 = "UNDLM_00383_AVEC_POIGNEES.mov";
        importSuccess383 = true;
        editImportCount++;
        logImportSuccess(383, "EDIT", editFilePoignees383.fsName, fileName383);
    } catch (e) {
        logImportError(383, "EDIT", editFilePoignees383.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess383 && editFileBis383.exists) {
    try {
        var editFootage383 = project.importFile(new ImportOptions(editFileBis383));
        editFootage383.parentFolder = fromEditFolder;
        editFootage383.name = "UNDLM_00383";
        editSources[383] = editFootage383;
        fileName383 = "UNDLM_00383bis.mov";
        importSuccess383 = true;
        editImportCount++;
        logImportSuccess(383, "EDIT", editFileBis383.fsName, fileName383);
    } catch (e) {
        logImportError(383, "EDIT", editFileBis383.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess383) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00383.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00383.mov: " + editFile383.exists + "\n" +
          "• UNDLM_00383_AVEC_POIGNEES.mov: " + editFilePoignees383.exists + "\n" +
          "• UNDLM_00383bis.mov: " + editFileBis383.exists);
}

// Import plan EDIT 00388
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile388 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00388.mov");
var editFilePoignees388 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00388_AVEC_POIGNEES.mov");
var editFileBis388 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00388bis.mov");

var importSuccess388 = false;
var fileName388 = "";

// Tenter import standard
if (editFile388.exists) {
    try {
        var editFootage388 = project.importFile(new ImportOptions(editFile388));
        editFootage388.parentFolder = fromEditFolder;
        editFootage388.name = "UNDLM_00388";
        editSources[388] = editFootage388;
        fileName388 = "UNDLM_00388.mov";
        importSuccess388 = true;
        editImportCount++;
        logImportSuccess(388, "EDIT", editFile388.fsName, fileName388);
    } catch (e) {
        logImportError(388, "EDIT", editFile388.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess388 && editFilePoignees388.exists) {
    try {
        var editFootage388 = project.importFile(new ImportOptions(editFilePoignees388));
        editFootage388.parentFolder = fromEditFolder;
        editFootage388.name = "UNDLM_00388";
        editSources[388] = editFootage388;
        fileName388 = "UNDLM_00388_AVEC_POIGNEES.mov";
        importSuccess388 = true;
        editImportCount++;
        logImportSuccess(388, "EDIT", editFilePoignees388.fsName, fileName388);
    } catch (e) {
        logImportError(388, "EDIT", editFilePoignees388.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess388 && editFileBis388.exists) {
    try {
        var editFootage388 = project.importFile(new ImportOptions(editFileBis388));
        editFootage388.parentFolder = fromEditFolder;
        editFootage388.name = "UNDLM_00388";
        editSources[388] = editFootage388;
        fileName388 = "UNDLM_00388bis.mov";
        importSuccess388 = true;
        editImportCount++;
        logImportSuccess(388, "EDIT", editFileBis388.fsName, fileName388);
    } catch (e) {
        logImportError(388, "EDIT", editFileBis388.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess388) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00388.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00388.mov: " + editFile388.exists + "\n" +
          "• UNDLM_00388_AVEC_POIGNEES.mov: " + editFilePoignees388.exists + "\n" +
          "• UNDLM_00388bis.mov: " + editFileBis388.exists);
}

// Import plan EDIT 00392
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile392 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00392.mov");
var editFilePoignees392 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00392_AVEC_POIGNEES.mov");
var editFileBis392 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00392bis.mov");

var importSuccess392 = false;
var fileName392 = "";

// Tenter import standard
if (editFile392.exists) {
    try {
        var editFootage392 = project.importFile(new ImportOptions(editFile392));
        editFootage392.parentFolder = fromEditFolder;
        editFootage392.name = "UNDLM_00392";
        editSources[392] = editFootage392;
        fileName392 = "UNDLM_00392.mov";
        importSuccess392 = true;
        editImportCount++;
        logImportSuccess(392, "EDIT", editFile392.fsName, fileName392);
    } catch (e) {
        logImportError(392, "EDIT", editFile392.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess392 && editFilePoignees392.exists) {
    try {
        var editFootage392 = project.importFile(new ImportOptions(editFilePoignees392));
        editFootage392.parentFolder = fromEditFolder;
        editFootage392.name = "UNDLM_00392";
        editSources[392] = editFootage392;
        fileName392 = "UNDLM_00392_AVEC_POIGNEES.mov";
        importSuccess392 = true;
        editImportCount++;
        logImportSuccess(392, "EDIT", editFilePoignees392.fsName, fileName392);
    } catch (e) {
        logImportError(392, "EDIT", editFilePoignees392.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess392 && editFileBis392.exists) {
    try {
        var editFootage392 = project.importFile(new ImportOptions(editFileBis392));
        editFootage392.parentFolder = fromEditFolder;
        editFootage392.name = "UNDLM_00392";
        editSources[392] = editFootage392;
        fileName392 = "UNDLM_00392bis.mov";
        importSuccess392 = true;
        editImportCount++;
        logImportSuccess(392, "EDIT", editFileBis392.fsName, fileName392);
    } catch (e) {
        logImportError(392, "EDIT", editFileBis392.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess392) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00392.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00392.mov: " + editFile392.exists + "\n" +
          "• UNDLM_00392_AVEC_POIGNEES.mov: " + editFilePoignees392.exists + "\n" +
          "• UNDLM_00392bis.mov: " + editFileBis392.exists);
}

// Import plan GRADED 00202
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile202 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00202.mov");
var gradedFilePoignees202 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00202_AVEC_POIGNEES.mov");
var gradedFileBis202 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00202bis.mov");

var gradedImportSuccess202 = false;
var gradedFileName202 = "";

// Tenter import standard
if (gradedFile202.exists) {
    try {
        var gradedFootage202 = project.importFile(new ImportOptions(gradedFile202));
        gradedFootage202.parentFolder = fromGradingFolder;
        gradedFootage202.name = "UNDLM_00202";
        gradingSources[202] = gradedFootage202;
        gradedFileName202 = "UNDLM_00202.mov";
        gradedImportSuccess202 = true;
        gradingImportCount++;
        logImportSuccess(202, "GRADED", gradedFile202.fsName, gradedFileName202);
    } catch (e) {
        logImportError(202, "GRADED", gradedFile202.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess202 && gradedFilePoignees202.exists) {
    try {
        var gradedFootage202 = project.importFile(new ImportOptions(gradedFilePoignees202));
        gradedFootage202.parentFolder = fromGradingFolder;
        gradedFootage202.name = "UNDLM_00202";
        gradingSources[202] = gradedFootage202;
        gradedFileName202 = "UNDLM_00202_AVEC_POIGNEES.mov";
        gradedImportSuccess202 = true;
        gradingImportCount++;
        logImportSuccess(202, "GRADED", gradedFilePoignees202.fsName, gradedFileName202);
    } catch (e) {
        logImportError(202, "GRADED", gradedFilePoignees202.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess202 && gradedFileBis202.exists) {
    try {
        var gradedFootage202 = project.importFile(new ImportOptions(gradedFileBis202));
        gradedFootage202.parentFolder = fromGradingFolder;
        gradedFootage202.name = "UNDLM_00202";
        gradingSources[202] = gradedFootage202;
        gradedFileName202 = "UNDLM_00202bis.mov";
        gradedImportSuccess202 = true;
        gradingImportCount++;
        logImportSuccess(202, "GRADED", gradedFileBis202.fsName, gradedFileName202);
    } catch (e) {
        logImportError(202, "GRADED", gradedFileBis202.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess202) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00202 (normal)");
}

// Import plan GRADED 00214
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile214 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00214.mov");
var gradedFilePoignees214 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00214_AVEC_POIGNEES.mov");
var gradedFileBis214 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00214bis.mov");

var gradedImportSuccess214 = false;
var gradedFileName214 = "";

// Tenter import standard
if (gradedFile214.exists) {
    try {
        var gradedFootage214 = project.importFile(new ImportOptions(gradedFile214));
        gradedFootage214.parentFolder = fromGradingFolder;
        gradedFootage214.name = "UNDLM_00214";
        gradingSources[214] = gradedFootage214;
        gradedFileName214 = "UNDLM_00214.mov";
        gradedImportSuccess214 = true;
        gradingImportCount++;
        logImportSuccess(214, "GRADED", gradedFile214.fsName, gradedFileName214);
    } catch (e) {
        logImportError(214, "GRADED", gradedFile214.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess214 && gradedFilePoignees214.exists) {
    try {
        var gradedFootage214 = project.importFile(new ImportOptions(gradedFilePoignees214));
        gradedFootage214.parentFolder = fromGradingFolder;
        gradedFootage214.name = "UNDLM_00214";
        gradingSources[214] = gradedFootage214;
        gradedFileName214 = "UNDLM_00214_AVEC_POIGNEES.mov";
        gradedImportSuccess214 = true;
        gradingImportCount++;
        logImportSuccess(214, "GRADED", gradedFilePoignees214.fsName, gradedFileName214);
    } catch (e) {
        logImportError(214, "GRADED", gradedFilePoignees214.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess214 && gradedFileBis214.exists) {
    try {
        var gradedFootage214 = project.importFile(new ImportOptions(gradedFileBis214));
        gradedFootage214.parentFolder = fromGradingFolder;
        gradedFootage214.name = "UNDLM_00214";
        gradingSources[214] = gradedFootage214;
        gradedFileName214 = "UNDLM_00214bis.mov";
        gradedImportSuccess214 = true;
        gradingImportCount++;
        logImportSuccess(214, "GRADED", gradedFileBis214.fsName, gradedFileName214);
    } catch (e) {
        logImportError(214, "GRADED", gradedFileBis214.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess214) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00214 (normal)");
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
        gradedFileName240 = "UNDLM_00240.mov";
        gradedImportSuccess240 = true;
        gradingImportCount++;
        logImportSuccess(240, "GRADED", gradedFile240.fsName, gradedFileName240);
    } catch (e) {
        logImportError(240, "GRADED", gradedFile240.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess240 && gradedFilePoignees240.exists) {
    try {
        var gradedFootage240 = project.importFile(new ImportOptions(gradedFilePoignees240));
        gradedFootage240.parentFolder = fromGradingFolder;
        gradedFootage240.name = "UNDLM_00240";
        gradingSources[240] = gradedFootage240;
        gradedFileName240 = "UNDLM_00240_AVEC_POIGNEES.mov";
        gradedImportSuccess240 = true;
        gradingImportCount++;
        logImportSuccess(240, "GRADED", gradedFilePoignees240.fsName, gradedFileName240);
    } catch (e) {
        logImportError(240, "GRADED", gradedFilePoignees240.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess240 && gradedFileBis240.exists) {
    try {
        var gradedFootage240 = project.importFile(new ImportOptions(gradedFileBis240));
        gradedFootage240.parentFolder = fromGradingFolder;
        gradedFootage240.name = "UNDLM_00240";
        gradingSources[240] = gradedFootage240;
        gradedFileName240 = "UNDLM_00240bis.mov";
        gradedImportSuccess240 = true;
        gradingImportCount++;
        logImportSuccess(240, "GRADED", gradedFileBis240.fsName, gradedFileName240);
    } catch (e) {
        logImportError(240, "GRADED", gradedFileBis240.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess240) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00240 (normal)");
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
        gradedFileName253 = "UNDLM_00253.mov";
        gradedImportSuccess253 = true;
        gradingImportCount++;
        logImportSuccess(253, "GRADED", gradedFile253.fsName, gradedFileName253);
    } catch (e) {
        logImportError(253, "GRADED", gradedFile253.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess253 && gradedFilePoignees253.exists) {
    try {
        var gradedFootage253 = project.importFile(new ImportOptions(gradedFilePoignees253));
        gradedFootage253.parentFolder = fromGradingFolder;
        gradedFootage253.name = "UNDLM_00253";
        gradingSources[253] = gradedFootage253;
        gradedFileName253 = "UNDLM_00253_AVEC_POIGNEES.mov";
        gradedImportSuccess253 = true;
        gradingImportCount++;
        logImportSuccess(253, "GRADED", gradedFilePoignees253.fsName, gradedFileName253);
    } catch (e) {
        logImportError(253, "GRADED", gradedFilePoignees253.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess253 && gradedFileBis253.exists) {
    try {
        var gradedFootage253 = project.importFile(new ImportOptions(gradedFileBis253));
        gradedFootage253.parentFolder = fromGradingFolder;
        gradedFootage253.name = "UNDLM_00253";
        gradingSources[253] = gradedFootage253;
        gradedFileName253 = "UNDLM_00253bis.mov";
        gradedImportSuccess253 = true;
        gradingImportCount++;
        logImportSuccess(253, "GRADED", gradedFileBis253.fsName, gradedFileName253);
    } catch (e) {
        logImportError(253, "GRADED", gradedFileBis253.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess253) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00253 (normal)");
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
        gradedFileName257 = "UNDLM_00257.mov";
        gradedImportSuccess257 = true;
        gradingImportCount++;
        logImportSuccess(257, "GRADED", gradedFile257.fsName, gradedFileName257);
    } catch (e) {
        logImportError(257, "GRADED", gradedFile257.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess257 && gradedFilePoignees257.exists) {
    try {
        var gradedFootage257 = project.importFile(new ImportOptions(gradedFilePoignees257));
        gradedFootage257.parentFolder = fromGradingFolder;
        gradedFootage257.name = "UNDLM_00257";
        gradingSources[257] = gradedFootage257;
        gradedFileName257 = "UNDLM_00257_AVEC_POIGNEES.mov";
        gradedImportSuccess257 = true;
        gradingImportCount++;
        logImportSuccess(257, "GRADED", gradedFilePoignees257.fsName, gradedFileName257);
    } catch (e) {
        logImportError(257, "GRADED", gradedFilePoignees257.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess257 && gradedFileBis257.exists) {
    try {
        var gradedFootage257 = project.importFile(new ImportOptions(gradedFileBis257));
        gradedFootage257.parentFolder = fromGradingFolder;
        gradedFootage257.name = "UNDLM_00257";
        gradingSources[257] = gradedFootage257;
        gradedFileName257 = "UNDLM_00257bis.mov";
        gradedImportSuccess257 = true;
        gradingImportCount++;
        logImportSuccess(257, "GRADED", gradedFileBis257.fsName, gradedFileName257);
    } catch (e) {
        logImportError(257, "GRADED", gradedFileBis257.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess257) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00257 (normal)");
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
        gradedFileName259 = "UNDLM_00259.mov";
        gradedImportSuccess259 = true;
        gradingImportCount++;
        logImportSuccess(259, "GRADED", gradedFile259.fsName, gradedFileName259);
    } catch (e) {
        logImportError(259, "GRADED", gradedFile259.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess259 && gradedFilePoignees259.exists) {
    try {
        var gradedFootage259 = project.importFile(new ImportOptions(gradedFilePoignees259));
        gradedFootage259.parentFolder = fromGradingFolder;
        gradedFootage259.name = "UNDLM_00259";
        gradingSources[259] = gradedFootage259;
        gradedFileName259 = "UNDLM_00259_AVEC_POIGNEES.mov";
        gradedImportSuccess259 = true;
        gradingImportCount++;
        logImportSuccess(259, "GRADED", gradedFilePoignees259.fsName, gradedFileName259);
    } catch (e) {
        logImportError(259, "GRADED", gradedFilePoignees259.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess259 && gradedFileBis259.exists) {
    try {
        var gradedFootage259 = project.importFile(new ImportOptions(gradedFileBis259));
        gradedFootage259.parentFolder = fromGradingFolder;
        gradedFootage259.name = "UNDLM_00259";
        gradingSources[259] = gradedFootage259;
        gradedFileName259 = "UNDLM_00259bis.mov";
        gradedImportSuccess259 = true;
        gradingImportCount++;
        logImportSuccess(259, "GRADED", gradedFileBis259.fsName, gradedFileName259);
    } catch (e) {
        logImportError(259, "GRADED", gradedFileBis259.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess259) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00259 (normal)");
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
        gradedFileName260 = "UNDLM_00260.mov";
        gradedImportSuccess260 = true;
        gradingImportCount++;
        logImportSuccess(260, "GRADED", gradedFile260.fsName, gradedFileName260);
    } catch (e) {
        logImportError(260, "GRADED", gradedFile260.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess260 && gradedFilePoignees260.exists) {
    try {
        var gradedFootage260 = project.importFile(new ImportOptions(gradedFilePoignees260));
        gradedFootage260.parentFolder = fromGradingFolder;
        gradedFootage260.name = "UNDLM_00260";
        gradingSources[260] = gradedFootage260;
        gradedFileName260 = "UNDLM_00260_AVEC_POIGNEES.mov";
        gradedImportSuccess260 = true;
        gradingImportCount++;
        logImportSuccess(260, "GRADED", gradedFilePoignees260.fsName, gradedFileName260);
    } catch (e) {
        logImportError(260, "GRADED", gradedFilePoignees260.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess260 && gradedFileBis260.exists) {
    try {
        var gradedFootage260 = project.importFile(new ImportOptions(gradedFileBis260));
        gradedFootage260.parentFolder = fromGradingFolder;
        gradedFootage260.name = "UNDLM_00260";
        gradingSources[260] = gradedFootage260;
        gradedFileName260 = "UNDLM_00260bis.mov";
        gradedImportSuccess260 = true;
        gradingImportCount++;
        logImportSuccess(260, "GRADED", gradedFileBis260.fsName, gradedFileName260);
    } catch (e) {
        logImportError(260, "GRADED", gradedFileBis260.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess260) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00260 (normal)");
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
        gradedFileName261 = "UNDLM_00261.mov";
        gradedImportSuccess261 = true;
        gradingImportCount++;
        logImportSuccess(261, "GRADED", gradedFile261.fsName, gradedFileName261);
    } catch (e) {
        logImportError(261, "GRADED", gradedFile261.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess261 && gradedFilePoignees261.exists) {
    try {
        var gradedFootage261 = project.importFile(new ImportOptions(gradedFilePoignees261));
        gradedFootage261.parentFolder = fromGradingFolder;
        gradedFootage261.name = "UNDLM_00261";
        gradingSources[261] = gradedFootage261;
        gradedFileName261 = "UNDLM_00261_AVEC_POIGNEES.mov";
        gradedImportSuccess261 = true;
        gradingImportCount++;
        logImportSuccess(261, "GRADED", gradedFilePoignees261.fsName, gradedFileName261);
    } catch (e) {
        logImportError(261, "GRADED", gradedFilePoignees261.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess261 && gradedFileBis261.exists) {
    try {
        var gradedFootage261 = project.importFile(new ImportOptions(gradedFileBis261));
        gradedFootage261.parentFolder = fromGradingFolder;
        gradedFootage261.name = "UNDLM_00261";
        gradingSources[261] = gradedFootage261;
        gradedFileName261 = "UNDLM_00261bis.mov";
        gradedImportSuccess261 = true;
        gradingImportCount++;
        logImportSuccess(261, "GRADED", gradedFileBis261.fsName, gradedFileName261);
    } catch (e) {
        logImportError(261, "GRADED", gradedFileBis261.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess261) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00261 (normal)");
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
        gradedFileName264 = "UNDLM_00264.mov";
        gradedImportSuccess264 = true;
        gradingImportCount++;
        logImportSuccess(264, "GRADED", gradedFile264.fsName, gradedFileName264);
    } catch (e) {
        logImportError(264, "GRADED", gradedFile264.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess264 && gradedFilePoignees264.exists) {
    try {
        var gradedFootage264 = project.importFile(new ImportOptions(gradedFilePoignees264));
        gradedFootage264.parentFolder = fromGradingFolder;
        gradedFootage264.name = "UNDLM_00264";
        gradingSources[264] = gradedFootage264;
        gradedFileName264 = "UNDLM_00264_AVEC_POIGNEES.mov";
        gradedImportSuccess264 = true;
        gradingImportCount++;
        logImportSuccess(264, "GRADED", gradedFilePoignees264.fsName, gradedFileName264);
    } catch (e) {
        logImportError(264, "GRADED", gradedFilePoignees264.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess264 && gradedFileBis264.exists) {
    try {
        var gradedFootage264 = project.importFile(new ImportOptions(gradedFileBis264));
        gradedFootage264.parentFolder = fromGradingFolder;
        gradedFootage264.name = "UNDLM_00264";
        gradingSources[264] = gradedFootage264;
        gradedFileName264 = "UNDLM_00264bis.mov";
        gradedImportSuccess264 = true;
        gradingImportCount++;
        logImportSuccess(264, "GRADED", gradedFileBis264.fsName, gradedFileName264);
    } catch (e) {
        logImportError(264, "GRADED", gradedFileBis264.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess264) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00264 (normal)");
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
        gradedFileName265 = "UNDLM_00265.mov";
        gradedImportSuccess265 = true;
        gradingImportCount++;
        logImportSuccess(265, "GRADED", gradedFile265.fsName, gradedFileName265);
    } catch (e) {
        logImportError(265, "GRADED", gradedFile265.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess265 && gradedFilePoignees265.exists) {
    try {
        var gradedFootage265 = project.importFile(new ImportOptions(gradedFilePoignees265));
        gradedFootage265.parentFolder = fromGradingFolder;
        gradedFootage265.name = "UNDLM_00265";
        gradingSources[265] = gradedFootage265;
        gradedFileName265 = "UNDLM_00265_AVEC_POIGNEES.mov";
        gradedImportSuccess265 = true;
        gradingImportCount++;
        logImportSuccess(265, "GRADED", gradedFilePoignees265.fsName, gradedFileName265);
    } catch (e) {
        logImportError(265, "GRADED", gradedFilePoignees265.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess265 && gradedFileBis265.exists) {
    try {
        var gradedFootage265 = project.importFile(new ImportOptions(gradedFileBis265));
        gradedFootage265.parentFolder = fromGradingFolder;
        gradedFootage265.name = "UNDLM_00265";
        gradingSources[265] = gradedFootage265;
        gradedFileName265 = "UNDLM_00265bis.mov";
        gradedImportSuccess265 = true;
        gradingImportCount++;
        logImportSuccess(265, "GRADED", gradedFileBis265.fsName, gradedFileName265);
    } catch (e) {
        logImportError(265, "GRADED", gradedFileBis265.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess265) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00265 (normal)");
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
        gradedFileName266 = "UNDLM_00266.mov";
        gradedImportSuccess266 = true;
        gradingImportCount++;
        logImportSuccess(266, "GRADED", gradedFile266.fsName, gradedFileName266);
    } catch (e) {
        logImportError(266, "GRADED", gradedFile266.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess266 && gradedFilePoignees266.exists) {
    try {
        var gradedFootage266 = project.importFile(new ImportOptions(gradedFilePoignees266));
        gradedFootage266.parentFolder = fromGradingFolder;
        gradedFootage266.name = "UNDLM_00266";
        gradingSources[266] = gradedFootage266;
        gradedFileName266 = "UNDLM_00266_AVEC_POIGNEES.mov";
        gradedImportSuccess266 = true;
        gradingImportCount++;
        logImportSuccess(266, "GRADED", gradedFilePoignees266.fsName, gradedFileName266);
    } catch (e) {
        logImportError(266, "GRADED", gradedFilePoignees266.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess266 && gradedFileBis266.exists) {
    try {
        var gradedFootage266 = project.importFile(new ImportOptions(gradedFileBis266));
        gradedFootage266.parentFolder = fromGradingFolder;
        gradedFootage266.name = "UNDLM_00266";
        gradingSources[266] = gradedFootage266;
        gradedFileName266 = "UNDLM_00266bis.mov";
        gradedImportSuccess266 = true;
        gradingImportCount++;
        logImportSuccess(266, "GRADED", gradedFileBis266.fsName, gradedFileName266);
    } catch (e) {
        logImportError(266, "GRADED", gradedFileBis266.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess266) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00266 (normal)");
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
        gradedFileName267 = "UNDLM_00267.mov";
        gradedImportSuccess267 = true;
        gradingImportCount++;
        logImportSuccess(267, "GRADED", gradedFile267.fsName, gradedFileName267);
    } catch (e) {
        logImportError(267, "GRADED", gradedFile267.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess267 && gradedFilePoignees267.exists) {
    try {
        var gradedFootage267 = project.importFile(new ImportOptions(gradedFilePoignees267));
        gradedFootage267.parentFolder = fromGradingFolder;
        gradedFootage267.name = "UNDLM_00267";
        gradingSources[267] = gradedFootage267;
        gradedFileName267 = "UNDLM_00267_AVEC_POIGNEES.mov";
        gradedImportSuccess267 = true;
        gradingImportCount++;
        logImportSuccess(267, "GRADED", gradedFilePoignees267.fsName, gradedFileName267);
    } catch (e) {
        logImportError(267, "GRADED", gradedFilePoignees267.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess267 && gradedFileBis267.exists) {
    try {
        var gradedFootage267 = project.importFile(new ImportOptions(gradedFileBis267));
        gradedFootage267.parentFolder = fromGradingFolder;
        gradedFootage267.name = "UNDLM_00267";
        gradingSources[267] = gradedFootage267;
        gradedFileName267 = "UNDLM_00267bis.mov";
        gradedImportSuccess267 = true;
        gradingImportCount++;
        logImportSuccess(267, "GRADED", gradedFileBis267.fsName, gradedFileName267);
    } catch (e) {
        logImportError(267, "GRADED", gradedFileBis267.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess267) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00267 (normal)");
}

// Import plan GRADED 00278
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile278 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00278.mov");
var gradedFilePoignees278 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00278_AVEC_POIGNEES.mov");
var gradedFileBis278 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00278bis.mov");

var gradedImportSuccess278 = false;
var gradedFileName278 = "";

// Tenter import standard
if (gradedFile278.exists) {
    try {
        var gradedFootage278 = project.importFile(new ImportOptions(gradedFile278));
        gradedFootage278.parentFolder = fromGradingFolder;
        gradedFootage278.name = "UNDLM_00278";
        gradingSources[278] = gradedFootage278;
        gradedFileName278 = "UNDLM_00278.mov";
        gradedImportSuccess278 = true;
        gradingImportCount++;
        logImportSuccess(278, "GRADED", gradedFile278.fsName, gradedFileName278);
    } catch (e) {
        logImportError(278, "GRADED", gradedFile278.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess278 && gradedFilePoignees278.exists) {
    try {
        var gradedFootage278 = project.importFile(new ImportOptions(gradedFilePoignees278));
        gradedFootage278.parentFolder = fromGradingFolder;
        gradedFootage278.name = "UNDLM_00278";
        gradingSources[278] = gradedFootage278;
        gradedFileName278 = "UNDLM_00278_AVEC_POIGNEES.mov";
        gradedImportSuccess278 = true;
        gradingImportCount++;
        logImportSuccess(278, "GRADED", gradedFilePoignees278.fsName, gradedFileName278);
    } catch (e) {
        logImportError(278, "GRADED", gradedFilePoignees278.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess278 && gradedFileBis278.exists) {
    try {
        var gradedFootage278 = project.importFile(new ImportOptions(gradedFileBis278));
        gradedFootage278.parentFolder = fromGradingFolder;
        gradedFootage278.name = "UNDLM_00278";
        gradingSources[278] = gradedFootage278;
        gradedFileName278 = "UNDLM_00278bis.mov";
        gradedImportSuccess278 = true;
        gradingImportCount++;
        logImportSuccess(278, "GRADED", gradedFileBis278.fsName, gradedFileName278);
    } catch (e) {
        logImportError(278, "GRADED", gradedFileBis278.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess278) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00278 (normal)");
}

// Import plan GRADED 00281
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile281 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00281.mov");
var gradedFilePoignees281 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00281_AVEC_POIGNEES.mov");
var gradedFileBis281 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00281bis.mov");

var gradedImportSuccess281 = false;
var gradedFileName281 = "";

// Tenter import standard
if (gradedFile281.exists) {
    try {
        var gradedFootage281 = project.importFile(new ImportOptions(gradedFile281));
        gradedFootage281.parentFolder = fromGradingFolder;
        gradedFootage281.name = "UNDLM_00281";
        gradingSources[281] = gradedFootage281;
        gradedFileName281 = "UNDLM_00281.mov";
        gradedImportSuccess281 = true;
        gradingImportCount++;
        logImportSuccess(281, "GRADED", gradedFile281.fsName, gradedFileName281);
    } catch (e) {
        logImportError(281, "GRADED", gradedFile281.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess281 && gradedFilePoignees281.exists) {
    try {
        var gradedFootage281 = project.importFile(new ImportOptions(gradedFilePoignees281));
        gradedFootage281.parentFolder = fromGradingFolder;
        gradedFootage281.name = "UNDLM_00281";
        gradingSources[281] = gradedFootage281;
        gradedFileName281 = "UNDLM_00281_AVEC_POIGNEES.mov";
        gradedImportSuccess281 = true;
        gradingImportCount++;
        logImportSuccess(281, "GRADED", gradedFilePoignees281.fsName, gradedFileName281);
    } catch (e) {
        logImportError(281, "GRADED", gradedFilePoignees281.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess281 && gradedFileBis281.exists) {
    try {
        var gradedFootage281 = project.importFile(new ImportOptions(gradedFileBis281));
        gradedFootage281.parentFolder = fromGradingFolder;
        gradedFootage281.name = "UNDLM_00281";
        gradingSources[281] = gradedFootage281;
        gradedFileName281 = "UNDLM_00281bis.mov";
        gradedImportSuccess281 = true;
        gradingImportCount++;
        logImportSuccess(281, "GRADED", gradedFileBis281.fsName, gradedFileName281);
    } catch (e) {
        logImportError(281, "GRADED", gradedFileBis281.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess281) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00281 (normal)");
}

// Import plan GRADED 00284
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile284 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00284.mov");
var gradedFilePoignees284 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00284_AVEC_POIGNEES.mov");
var gradedFileBis284 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00284bis.mov");

var gradedImportSuccess284 = false;
var gradedFileName284 = "";

// Tenter import standard
if (gradedFile284.exists) {
    try {
        var gradedFootage284 = project.importFile(new ImportOptions(gradedFile284));
        gradedFootage284.parentFolder = fromGradingFolder;
        gradedFootage284.name = "UNDLM_00284";
        gradingSources[284] = gradedFootage284;
        gradedFileName284 = "UNDLM_00284.mov";
        gradedImportSuccess284 = true;
        gradingImportCount++;
        logImportSuccess(284, "GRADED", gradedFile284.fsName, gradedFileName284);
    } catch (e) {
        logImportError(284, "GRADED", gradedFile284.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess284 && gradedFilePoignees284.exists) {
    try {
        var gradedFootage284 = project.importFile(new ImportOptions(gradedFilePoignees284));
        gradedFootage284.parentFolder = fromGradingFolder;
        gradedFootage284.name = "UNDLM_00284";
        gradingSources[284] = gradedFootage284;
        gradedFileName284 = "UNDLM_00284_AVEC_POIGNEES.mov";
        gradedImportSuccess284 = true;
        gradingImportCount++;
        logImportSuccess(284, "GRADED", gradedFilePoignees284.fsName, gradedFileName284);
    } catch (e) {
        logImportError(284, "GRADED", gradedFilePoignees284.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess284 && gradedFileBis284.exists) {
    try {
        var gradedFootage284 = project.importFile(new ImportOptions(gradedFileBis284));
        gradedFootage284.parentFolder = fromGradingFolder;
        gradedFootage284.name = "UNDLM_00284";
        gradingSources[284] = gradedFootage284;
        gradedFileName284 = "UNDLM_00284bis.mov";
        gradedImportSuccess284 = true;
        gradingImportCount++;
        logImportSuccess(284, "GRADED", gradedFileBis284.fsName, gradedFileName284);
    } catch (e) {
        logImportError(284, "GRADED", gradedFileBis284.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess284) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00284 (normal)");
}

// Import plan GRADED 00286
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile286 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00286.mov");
var gradedFilePoignees286 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00286_AVEC_POIGNEES.mov");
var gradedFileBis286 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00286bis.mov");

var gradedImportSuccess286 = false;
var gradedFileName286 = "";

// Tenter import standard
if (gradedFile286.exists) {
    try {
        var gradedFootage286 = project.importFile(new ImportOptions(gradedFile286));
        gradedFootage286.parentFolder = fromGradingFolder;
        gradedFootage286.name = "UNDLM_00286";
        gradingSources[286] = gradedFootage286;
        gradedFileName286 = "UNDLM_00286.mov";
        gradedImportSuccess286 = true;
        gradingImportCount++;
        logImportSuccess(286, "GRADED", gradedFile286.fsName, gradedFileName286);
    } catch (e) {
        logImportError(286, "GRADED", gradedFile286.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess286 && gradedFilePoignees286.exists) {
    try {
        var gradedFootage286 = project.importFile(new ImportOptions(gradedFilePoignees286));
        gradedFootage286.parentFolder = fromGradingFolder;
        gradedFootage286.name = "UNDLM_00286";
        gradingSources[286] = gradedFootage286;
        gradedFileName286 = "UNDLM_00286_AVEC_POIGNEES.mov";
        gradedImportSuccess286 = true;
        gradingImportCount++;
        logImportSuccess(286, "GRADED", gradedFilePoignees286.fsName, gradedFileName286);
    } catch (e) {
        logImportError(286, "GRADED", gradedFilePoignees286.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess286 && gradedFileBis286.exists) {
    try {
        var gradedFootage286 = project.importFile(new ImportOptions(gradedFileBis286));
        gradedFootage286.parentFolder = fromGradingFolder;
        gradedFootage286.name = "UNDLM_00286";
        gradingSources[286] = gradedFootage286;
        gradedFileName286 = "UNDLM_00286bis.mov";
        gradedImportSuccess286 = true;
        gradingImportCount++;
        logImportSuccess(286, "GRADED", gradedFileBis286.fsName, gradedFileName286);
    } catch (e) {
        logImportError(286, "GRADED", gradedFileBis286.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess286) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00286 (normal)");
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
        gradedFileName332 = "UNDLM_00332.mov";
        gradedImportSuccess332 = true;
        gradingImportCount++;
        logImportSuccess(332, "GRADED", gradedFile332.fsName, gradedFileName332);
    } catch (e) {
        logImportError(332, "GRADED", gradedFile332.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess332 && gradedFilePoignees332.exists) {
    try {
        var gradedFootage332 = project.importFile(new ImportOptions(gradedFilePoignees332));
        gradedFootage332.parentFolder = fromGradingFolder;
        gradedFootage332.name = "UNDLM_00332";
        gradingSources[332] = gradedFootage332;
        gradedFileName332 = "UNDLM_00332_AVEC_POIGNEES.mov";
        gradedImportSuccess332 = true;
        gradingImportCount++;
        logImportSuccess(332, "GRADED", gradedFilePoignees332.fsName, gradedFileName332);
    } catch (e) {
        logImportError(332, "GRADED", gradedFilePoignees332.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess332 && gradedFileBis332.exists) {
    try {
        var gradedFootage332 = project.importFile(new ImportOptions(gradedFileBis332));
        gradedFootage332.parentFolder = fromGradingFolder;
        gradedFootage332.name = "UNDLM_00332";
        gradingSources[332] = gradedFootage332;
        gradedFileName332 = "UNDLM_00332bis.mov";
        gradedImportSuccess332 = true;
        gradingImportCount++;
        logImportSuccess(332, "GRADED", gradedFileBis332.fsName, gradedFileName332);
    } catch (e) {
        logImportError(332, "GRADED", gradedFileBis332.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess332) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00332 (normal)");
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
        gradedFileName333 = "UNDLM_00333.mov";
        gradedImportSuccess333 = true;
        gradingImportCount++;
        logImportSuccess(333, "GRADED", gradedFile333.fsName, gradedFileName333);
    } catch (e) {
        logImportError(333, "GRADED", gradedFile333.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess333 && gradedFilePoignees333.exists) {
    try {
        var gradedFootage333 = project.importFile(new ImportOptions(gradedFilePoignees333));
        gradedFootage333.parentFolder = fromGradingFolder;
        gradedFootage333.name = "UNDLM_00333";
        gradingSources[333] = gradedFootage333;
        gradedFileName333 = "UNDLM_00333_AVEC_POIGNEES.mov";
        gradedImportSuccess333 = true;
        gradingImportCount++;
        logImportSuccess(333, "GRADED", gradedFilePoignees333.fsName, gradedFileName333);
    } catch (e) {
        logImportError(333, "GRADED", gradedFilePoignees333.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess333 && gradedFileBis333.exists) {
    try {
        var gradedFootage333 = project.importFile(new ImportOptions(gradedFileBis333));
        gradedFootage333.parentFolder = fromGradingFolder;
        gradedFootage333.name = "UNDLM_00333";
        gradingSources[333] = gradedFootage333;
        gradedFileName333 = "UNDLM_00333bis.mov";
        gradedImportSuccess333 = true;
        gradingImportCount++;
        logImportSuccess(333, "GRADED", gradedFileBis333.fsName, gradedFileName333);
    } catch (e) {
        logImportError(333, "GRADED", gradedFileBis333.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess333) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00333 (normal)");
}

// Import plan GRADED 00383
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile383 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00383.mov");
var gradedFilePoignees383 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00383_AVEC_POIGNEES.mov");
var gradedFileBis383 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00383bis.mov");

var gradedImportSuccess383 = false;
var gradedFileName383 = "";

// Tenter import standard
if (gradedFile383.exists) {
    try {
        var gradedFootage383 = project.importFile(new ImportOptions(gradedFile383));
        gradedFootage383.parentFolder = fromGradingFolder;
        gradedFootage383.name = "UNDLM_00383";
        gradingSources[383] = gradedFootage383;
        gradedFileName383 = "UNDLM_00383.mov";
        gradedImportSuccess383 = true;
        gradingImportCount++;
        logImportSuccess(383, "GRADED", gradedFile383.fsName, gradedFileName383);
    } catch (e) {
        logImportError(383, "GRADED", gradedFile383.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess383 && gradedFilePoignees383.exists) {
    try {
        var gradedFootage383 = project.importFile(new ImportOptions(gradedFilePoignees383));
        gradedFootage383.parentFolder = fromGradingFolder;
        gradedFootage383.name = "UNDLM_00383";
        gradingSources[383] = gradedFootage383;
        gradedFileName383 = "UNDLM_00383_AVEC_POIGNEES.mov";
        gradedImportSuccess383 = true;
        gradingImportCount++;
        logImportSuccess(383, "GRADED", gradedFilePoignees383.fsName, gradedFileName383);
    } catch (e) {
        logImportError(383, "GRADED", gradedFilePoignees383.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess383 && gradedFileBis383.exists) {
    try {
        var gradedFootage383 = project.importFile(new ImportOptions(gradedFileBis383));
        gradedFootage383.parentFolder = fromGradingFolder;
        gradedFootage383.name = "UNDLM_00383";
        gradingSources[383] = gradedFootage383;
        gradedFileName383 = "UNDLM_00383bis.mov";
        gradedImportSuccess383 = true;
        gradingImportCount++;
        logImportSuccess(383, "GRADED", gradedFileBis383.fsName, gradedFileName383);
    } catch (e) {
        logImportError(383, "GRADED", gradedFileBis383.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess383) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00383 (normal)");
}

// Import plan GRADED 00388
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile388 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00388.mov");
var gradedFilePoignees388 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00388_AVEC_POIGNEES.mov");
var gradedFileBis388 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00388bis.mov");

var gradedImportSuccess388 = false;
var gradedFileName388 = "";

// Tenter import standard
if (gradedFile388.exists) {
    try {
        var gradedFootage388 = project.importFile(new ImportOptions(gradedFile388));
        gradedFootage388.parentFolder = fromGradingFolder;
        gradedFootage388.name = "UNDLM_00388";
        gradingSources[388] = gradedFootage388;
        gradedFileName388 = "UNDLM_00388.mov";
        gradedImportSuccess388 = true;
        gradingImportCount++;
        logImportSuccess(388, "GRADED", gradedFile388.fsName, gradedFileName388);
    } catch (e) {
        logImportError(388, "GRADED", gradedFile388.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess388 && gradedFilePoignees388.exists) {
    try {
        var gradedFootage388 = project.importFile(new ImportOptions(gradedFilePoignees388));
        gradedFootage388.parentFolder = fromGradingFolder;
        gradedFootage388.name = "UNDLM_00388";
        gradingSources[388] = gradedFootage388;
        gradedFileName388 = "UNDLM_00388_AVEC_POIGNEES.mov";
        gradedImportSuccess388 = true;
        gradingImportCount++;
        logImportSuccess(388, "GRADED", gradedFilePoignees388.fsName, gradedFileName388);
    } catch (e) {
        logImportError(388, "GRADED", gradedFilePoignees388.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess388 && gradedFileBis388.exists) {
    try {
        var gradedFootage388 = project.importFile(new ImportOptions(gradedFileBis388));
        gradedFootage388.parentFolder = fromGradingFolder;
        gradedFootage388.name = "UNDLM_00388";
        gradingSources[388] = gradedFootage388;
        gradedFileName388 = "UNDLM_00388bis.mov";
        gradedImportSuccess388 = true;
        gradingImportCount++;
        logImportSuccess(388, "GRADED", gradedFileBis388.fsName, gradedFileName388);
    } catch (e) {
        logImportError(388, "GRADED", gradedFileBis388.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess388) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00388 (normal)");
}

// Import plan GRADED 00392
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile392 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00392.mov");
var gradedFilePoignees392 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00392_AVEC_POIGNEES.mov");
var gradedFileBis392 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00392bis.mov");

var gradedImportSuccess392 = false;
var gradedFileName392 = "";

// Tenter import standard
if (gradedFile392.exists) {
    try {
        var gradedFootage392 = project.importFile(new ImportOptions(gradedFile392));
        gradedFootage392.parentFolder = fromGradingFolder;
        gradedFootage392.name = "UNDLM_00392";
        gradingSources[392] = gradedFootage392;
        gradedFileName392 = "UNDLM_00392.mov";
        gradedImportSuccess392 = true;
        gradingImportCount++;
        logImportSuccess(392, "GRADED", gradedFile392.fsName, gradedFileName392);
    } catch (e) {
        logImportError(392, "GRADED", gradedFile392.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess392 && gradedFilePoignees392.exists) {
    try {
        var gradedFootage392 = project.importFile(new ImportOptions(gradedFilePoignees392));
        gradedFootage392.parentFolder = fromGradingFolder;
        gradedFootage392.name = "UNDLM_00392";
        gradingSources[392] = gradedFootage392;
        gradedFileName392 = "UNDLM_00392_AVEC_POIGNEES.mov";
        gradedImportSuccess392 = true;
        gradingImportCount++;
        logImportSuccess(392, "GRADED", gradedFilePoignees392.fsName, gradedFileName392);
    } catch (e) {
        logImportError(392, "GRADED", gradedFilePoignees392.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess392 && gradedFileBis392.exists) {
    try {
        var gradedFootage392 = project.importFile(new ImportOptions(gradedFileBis392));
        gradedFootage392.parentFolder = fromGradingFolder;
        gradedFootage392.name = "UNDLM_00392";
        gradingSources[392] = gradedFootage392;
        gradedFileName392 = "UNDLM_00392bis.mov";
        gradedImportSuccess392 = true;
        gradingImportCount++;
        logImportSuccess(392, "GRADED", gradedFileBis392.fsName, gradedFileName392);
    } catch (e) {
        logImportError(392, "GRADED", gradedFileBis392.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess392) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00392 (normal)");
}

// Rapport final d'import
alert("📊 RAPPORT D'IMPORT FINAL:" + "\n" +
      "EDIT importés: " + editImportCount + "/21" + "\n" +
      "GRADED importés: " + gradingImportCount + "/21" + "\n" +
      "EDIT manquants: " + missingEditCount + "\n" +
      "GRADED manquants: " + missingGradingCount + "\n" + "\n" +
      "Erreurs d'import: " + importErrors.length + "\n" +
      "Imports réussis: " + successfulImports.length);



// ==========================================
// 3. CRÉATION DES COMPOSITIONS DE PLANS
// ==========================================

// Array pour stocker les compositions de plans
var planCompositions = {};

// Créer une composition de solid réutilisable dans WORK_LAYERS
var bgSolidComp = project.items.addComp("BG_SOLID_BLACK", 2560, 1440, 1.0, 10.0, 25);
bgSolidComp.parentFolder = workLayersFolder;
var bgSolidLayer = bgSolidComp.layers.addSolid([0.05, 0.05, 0.05], "BG_SOLID", 2560, 1440, 1.0);


// Composition pour plan 00202
var planComp202 = project.items.addComp(
    "P03_ALL_UNDLM_00202_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    11.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp202.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer202 = planComp202.layers.add(bgSolidComp);
bgLayer202.name = "BG_SOLID";
bgLayer202.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer202 = false;
if (gradingSources[202]) {
    var gradedLayer202 = planComp202.layers.add(gradingSources[202]);
    gradedLayer202.name = "UNDLM_00202_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer202.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer202.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer202 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer202 = false;
if (editSources[202]) {
    var editLayer202 = planComp202.layers.add(editSources[202]);
    editLayer202.name = "UNDLM_00202_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer202.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer202.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer202 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer202) {
    // EDIT toujours activé quand disponible
    editLayer202.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer202) {
        gradedLayer202.enabled = false;
    }
} else if (hasGradedLayer202) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer202.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText202 = planComp202.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText202.name = "WARNING_NO_EDIT";
    warningText202.property("Transform").property("Position").setValue([1280, 200]);
    warningText202.guideLayer = true;
    
    var warningTextDoc202 = warningText202.property("Source Text").value;
    warningTextDoc202.fontSize = 32;
    warningTextDoc202.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc202.font = "Arial-BoldMT";
    warningTextDoc202.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText202.property("Source Text").setValue(warningTextDoc202);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText202 = planComp202.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00202");
    errorText202.name = "ERROR_NO_SOURCE";
    errorText202.property("Transform").property("Position").setValue([1280, 720]);
    errorText202.guideLayer = true;
    
    var errorTextDoc202 = errorText202.property("Source Text").value;
    errorTextDoc202.fontSize = 48;
    errorTextDoc202.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc202.font = "Arial-BoldMT";
    errorTextDoc202.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText202.property("Source Text").setValue(errorTextDoc202);
}

planCompositions[202] = planComp202;


// Composition pour plan 00214
var planComp214 = project.items.addComp(
    "P03_ALL_UNDLM_00214_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp214.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer214 = planComp214.layers.add(bgSolidComp);
bgLayer214.name = "BG_SOLID";
bgLayer214.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer214 = false;
if (gradingSources[214]) {
    var gradedLayer214 = planComp214.layers.add(gradingSources[214]);
    gradedLayer214.name = "UNDLM_00214_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer214.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer214.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer214 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer214 = false;
if (editSources[214]) {
    var editLayer214 = planComp214.layers.add(editSources[214]);
    editLayer214.name = "UNDLM_00214_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer214.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer214.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer214 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer214) {
    // EDIT toujours activé quand disponible
    editLayer214.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer214) {
        gradedLayer214.enabled = false;
    }
} else if (hasGradedLayer214) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer214.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText214 = planComp214.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText214.name = "WARNING_NO_EDIT";
    warningText214.property("Transform").property("Position").setValue([1280, 200]);
    warningText214.guideLayer = true;
    
    var warningTextDoc214 = warningText214.property("Source Text").value;
    warningTextDoc214.fontSize = 32;
    warningTextDoc214.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc214.font = "Arial-BoldMT";
    warningTextDoc214.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText214.property("Source Text").setValue(warningTextDoc214);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText214 = planComp214.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00214");
    errorText214.name = "ERROR_NO_SOURCE";
    errorText214.property("Transform").property("Position").setValue([1280, 720]);
    errorText214.guideLayer = true;
    
    var errorTextDoc214 = errorText214.property("Source Text").value;
    errorTextDoc214.fontSize = 48;
    errorTextDoc214.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc214.font = "Arial-BoldMT";
    errorTextDoc214.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText214.property("Source Text").setValue(errorTextDoc214);
}

planCompositions[214] = planComp214;


// Composition pour plan 00240
var planComp240 = project.items.addComp(
    "P03_ALL_UNDLM_00240_v001",
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


// Composition pour plan 00253
var planComp253 = project.items.addComp(
    "P03_ALL_UNDLM_00253_v001",
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


// Composition pour plan 00257
var planComp257 = project.items.addComp(
    "P03_ALL_UNDLM_00257_v001",
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


// Composition pour plan 00259
var planComp259 = project.items.addComp(
    "P03_ALL_UNDLM_00259_v001",
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
    "P03_ALL_UNDLM_00260_v001",
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
    "P03_ALL_UNDLM_00261_v001",
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


// Composition pour plan 00264
var planComp264 = project.items.addComp(
    "P03_ALL_UNDLM_00264_v001",
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
    "P03_ALL_UNDLM_00265_v001",
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
    "P03_ALL_UNDLM_00266_v001",
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
    "P03_ALL_UNDLM_00267_v001",
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


// Composition pour plan 00278
var planComp278 = project.items.addComp(
    "P03_ALL_UNDLM_00278_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp278.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer278 = planComp278.layers.add(bgSolidComp);
bgLayer278.name = "BG_SOLID";
bgLayer278.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer278 = false;
if (gradingSources[278]) {
    var gradedLayer278 = planComp278.layers.add(gradingSources[278]);
    gradedLayer278.name = "UNDLM_00278_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer278.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer278.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer278 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer278 = false;
if (editSources[278]) {
    var editLayer278 = planComp278.layers.add(editSources[278]);
    editLayer278.name = "UNDLM_00278_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer278.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer278.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer278 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer278) {
    // EDIT toujours activé quand disponible
    editLayer278.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer278) {
        gradedLayer278.enabled = false;
    }
} else if (hasGradedLayer278) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer278.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText278 = planComp278.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText278.name = "WARNING_NO_EDIT";
    warningText278.property("Transform").property("Position").setValue([1280, 200]);
    warningText278.guideLayer = true;
    
    var warningTextDoc278 = warningText278.property("Source Text").value;
    warningTextDoc278.fontSize = 32;
    warningTextDoc278.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc278.font = "Arial-BoldMT";
    warningTextDoc278.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText278.property("Source Text").setValue(warningTextDoc278);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText278 = planComp278.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00278");
    errorText278.name = "ERROR_NO_SOURCE";
    errorText278.property("Transform").property("Position").setValue([1280, 720]);
    errorText278.guideLayer = true;
    
    var errorTextDoc278 = errorText278.property("Source Text").value;
    errorTextDoc278.fontSize = 48;
    errorTextDoc278.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc278.font = "Arial-BoldMT";
    errorTextDoc278.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText278.property("Source Text").setValue(errorTextDoc278);
}

planCompositions[278] = planComp278;


// Composition pour plan 00281
var planComp281 = project.items.addComp(
    "P03_ALL_UNDLM_00281_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp281.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer281 = planComp281.layers.add(bgSolidComp);
bgLayer281.name = "BG_SOLID";
bgLayer281.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer281 = false;
if (gradingSources[281]) {
    var gradedLayer281 = planComp281.layers.add(gradingSources[281]);
    gradedLayer281.name = "UNDLM_00281_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer281.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer281.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer281 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer281 = false;
if (editSources[281]) {
    var editLayer281 = planComp281.layers.add(editSources[281]);
    editLayer281.name = "UNDLM_00281_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer281.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer281.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer281 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer281) {
    // EDIT toujours activé quand disponible
    editLayer281.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer281) {
        gradedLayer281.enabled = false;
    }
} else if (hasGradedLayer281) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer281.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText281 = planComp281.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText281.name = "WARNING_NO_EDIT";
    warningText281.property("Transform").property("Position").setValue([1280, 200]);
    warningText281.guideLayer = true;
    
    var warningTextDoc281 = warningText281.property("Source Text").value;
    warningTextDoc281.fontSize = 32;
    warningTextDoc281.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc281.font = "Arial-BoldMT";
    warningTextDoc281.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText281.property("Source Text").setValue(warningTextDoc281);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText281 = planComp281.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00281");
    errorText281.name = "ERROR_NO_SOURCE";
    errorText281.property("Transform").property("Position").setValue([1280, 720]);
    errorText281.guideLayer = true;
    
    var errorTextDoc281 = errorText281.property("Source Text").value;
    errorTextDoc281.fontSize = 48;
    errorTextDoc281.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc281.font = "Arial-BoldMT";
    errorTextDoc281.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText281.property("Source Text").setValue(errorTextDoc281);
}

planCompositions[281] = planComp281;


// Composition pour plan 00284
var planComp284 = project.items.addComp(
    "P03_ALL_UNDLM_00284_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp284.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer284 = planComp284.layers.add(bgSolidComp);
bgLayer284.name = "BG_SOLID";
bgLayer284.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer284 = false;
if (gradingSources[284]) {
    var gradedLayer284 = planComp284.layers.add(gradingSources[284]);
    gradedLayer284.name = "UNDLM_00284_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer284.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer284.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer284 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer284 = false;
if (editSources[284]) {
    var editLayer284 = planComp284.layers.add(editSources[284]);
    editLayer284.name = "UNDLM_00284_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer284.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer284.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer284 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer284) {
    // EDIT toujours activé quand disponible
    editLayer284.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer284) {
        gradedLayer284.enabled = false;
    }
} else if (hasGradedLayer284) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer284.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText284 = planComp284.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText284.name = "WARNING_NO_EDIT";
    warningText284.property("Transform").property("Position").setValue([1280, 200]);
    warningText284.guideLayer = true;
    
    var warningTextDoc284 = warningText284.property("Source Text").value;
    warningTextDoc284.fontSize = 32;
    warningTextDoc284.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc284.font = "Arial-BoldMT";
    warningTextDoc284.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText284.property("Source Text").setValue(warningTextDoc284);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText284 = planComp284.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00284");
    errorText284.name = "ERROR_NO_SOURCE";
    errorText284.property("Transform").property("Position").setValue([1280, 720]);
    errorText284.guideLayer = true;
    
    var errorTextDoc284 = errorText284.property("Source Text").value;
    errorTextDoc284.fontSize = 48;
    errorTextDoc284.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc284.font = "Arial-BoldMT";
    errorTextDoc284.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText284.property("Source Text").setValue(errorTextDoc284);
}

planCompositions[284] = planComp284;


// Composition pour plan 00286
var planComp286 = project.items.addComp(
    "P03_ALL_UNDLM_00286_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp286.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer286 = planComp286.layers.add(bgSolidComp);
bgLayer286.name = "BG_SOLID";
bgLayer286.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer286 = false;
if (gradingSources[286]) {
    var gradedLayer286 = planComp286.layers.add(gradingSources[286]);
    gradedLayer286.name = "UNDLM_00286_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer286.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer286.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer286 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer286 = false;
if (editSources[286]) {
    var editLayer286 = planComp286.layers.add(editSources[286]);
    editLayer286.name = "UNDLM_00286_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer286.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer286.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer286 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer286) {
    // EDIT toujours activé quand disponible
    editLayer286.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer286) {
        gradedLayer286.enabled = false;
    }
} else if (hasGradedLayer286) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer286.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText286 = planComp286.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText286.name = "WARNING_NO_EDIT";
    warningText286.property("Transform").property("Position").setValue([1280, 200]);
    warningText286.guideLayer = true;
    
    var warningTextDoc286 = warningText286.property("Source Text").value;
    warningTextDoc286.fontSize = 32;
    warningTextDoc286.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc286.font = "Arial-BoldMT";
    warningTextDoc286.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText286.property("Source Text").setValue(warningTextDoc286);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText286 = planComp286.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00286");
    errorText286.name = "ERROR_NO_SOURCE";
    errorText286.property("Transform").property("Position").setValue([1280, 720]);
    errorText286.guideLayer = true;
    
    var errorTextDoc286 = errorText286.property("Source Text").value;
    errorTextDoc286.fontSize = 48;
    errorTextDoc286.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc286.font = "Arial-BoldMT";
    errorTextDoc286.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText286.property("Source Text").setValue(errorTextDoc286);
}

planCompositions[286] = planComp286;


// Composition pour plan 00332
var planComp332 = project.items.addComp(
    "P03_ALL_UNDLM_00332_v001",
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
    "P03_ALL_UNDLM_00333_v001",
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


// Composition pour plan 00383
var planComp383 = project.items.addComp(
    "P03_ALL_UNDLM_00383_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp383.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer383 = planComp383.layers.add(bgSolidComp);
bgLayer383.name = "BG_SOLID";
bgLayer383.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer383 = false;
if (gradingSources[383]) {
    var gradedLayer383 = planComp383.layers.add(gradingSources[383]);
    gradedLayer383.name = "UNDLM_00383_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer383.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer383.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer383 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer383 = false;
if (editSources[383]) {
    var editLayer383 = planComp383.layers.add(editSources[383]);
    editLayer383.name = "UNDLM_00383_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer383.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer383.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer383 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer383) {
    // EDIT toujours activé quand disponible
    editLayer383.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer383) {
        gradedLayer383.enabled = false;
    }
} else if (hasGradedLayer383) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer383.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText383 = planComp383.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText383.name = "WARNING_NO_EDIT";
    warningText383.property("Transform").property("Position").setValue([1280, 200]);
    warningText383.guideLayer = true;
    
    var warningTextDoc383 = warningText383.property("Source Text").value;
    warningTextDoc383.fontSize = 32;
    warningTextDoc383.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc383.font = "Arial-BoldMT";
    warningTextDoc383.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText383.property("Source Text").setValue(warningTextDoc383);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText383 = planComp383.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00383");
    errorText383.name = "ERROR_NO_SOURCE";
    errorText383.property("Transform").property("Position").setValue([1280, 720]);
    errorText383.guideLayer = true;
    
    var errorTextDoc383 = errorText383.property("Source Text").value;
    errorTextDoc383.fontSize = 48;
    errorTextDoc383.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc383.font = "Arial-BoldMT";
    errorTextDoc383.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText383.property("Source Text").setValue(errorTextDoc383);
}

planCompositions[383] = planComp383;


// Composition pour plan 00388
var planComp388 = project.items.addComp(
    "P03_ALL_UNDLM_00388_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.7199999999999998,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp388.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer388 = planComp388.layers.add(bgSolidComp);
bgLayer388.name = "BG_SOLID";
bgLayer388.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer388 = false;
if (gradingSources[388]) {
    var gradedLayer388 = planComp388.layers.add(gradingSources[388]);
    gradedLayer388.name = "UNDLM_00388_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer388.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer388.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer388 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer388 = false;
if (editSources[388]) {
    var editLayer388 = planComp388.layers.add(editSources[388]);
    editLayer388.name = "UNDLM_00388_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer388.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer388.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer388 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer388) {
    // EDIT toujours activé quand disponible
    editLayer388.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer388) {
        gradedLayer388.enabled = false;
    }
} else if (hasGradedLayer388) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer388.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText388 = planComp388.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText388.name = "WARNING_NO_EDIT";
    warningText388.property("Transform").property("Position").setValue([1280, 200]);
    warningText388.guideLayer = true;
    
    var warningTextDoc388 = warningText388.property("Source Text").value;
    warningTextDoc388.fontSize = 32;
    warningTextDoc388.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc388.font = "Arial-BoldMT";
    warningTextDoc388.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText388.property("Source Text").setValue(warningTextDoc388);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText388 = planComp388.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00388");
    errorText388.name = "ERROR_NO_SOURCE";
    errorText388.property("Transform").property("Position").setValue([1280, 720]);
    errorText388.guideLayer = true;
    
    var errorTextDoc388 = errorText388.property("Source Text").value;
    errorTextDoc388.fontSize = 48;
    errorTextDoc388.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc388.font = "Arial-BoldMT";
    errorTextDoc388.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText388.property("Source Text").setValue(errorTextDoc388);
}

planCompositions[388] = planComp388;


// Composition pour plan 00392
var planComp392 = project.items.addComp(
    "P03_ALL_UNDLM_00392_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp392.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer392 = planComp392.layers.add(bgSolidComp);
bgLayer392.name = "BG_SOLID";
bgLayer392.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer392 = false;
if (gradingSources[392]) {
    var gradedLayer392 = planComp392.layers.add(gradingSources[392]);
    gradedLayer392.name = "UNDLM_00392_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer392.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer392.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer392 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer392 = false;
if (editSources[392]) {
    var editLayer392 = planComp392.layers.add(editSources[392]);
    editLayer392.name = "UNDLM_00392_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer392.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer392.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer392 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer392) {
    // EDIT toujours activé quand disponible
    editLayer392.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer392) {
        gradedLayer392.enabled = false;
    }
} else if (hasGradedLayer392) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer392.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText392 = planComp392.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText392.name = "WARNING_NO_EDIT";
    warningText392.property("Transform").property("Position").setValue([1280, 200]);
    warningText392.guideLayer = true;
    
    var warningTextDoc392 = warningText392.property("Source Text").value;
    warningTextDoc392.fontSize = 32;
    warningTextDoc392.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc392.font = "Arial-BoldMT";
    warningTextDoc392.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText392.property("Source Text").setValue(warningTextDoc392);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText392 = planComp392.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00392");
    errorText392.name = "ERROR_NO_SOURCE";
    errorText392.property("Transform").property("Position").setValue([1280, 720]);
    errorText392.guideLayer = true;
    
    var errorTextDoc392 = errorText392.property("Source Text").value;
    errorTextDoc392.fontSize = 48;
    errorTextDoc392.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc392.font = "Arial-BoldMT";
    errorTextDoc392.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText392.property("Source Text").setValue(errorTextDoc392);
}

planCompositions[392] = planComp392;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "P03_ALL_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    112.52, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00202 à la timeline master
if (planCompositions[202]) {
    var masterLayer202 = masterComp.layers.add(planCompositions[202]);
    masterLayer202.startTime = 0;
    masterLayer202.name = "UNDLM_00202";
    masterLayer202.label = 1; // Couleurs alternées
}

// Ajouter plan 00214 à la timeline master
if (planCompositions[214]) {
    var masterLayer214 = masterComp.layers.add(planCompositions[214]);
    masterLayer214.startTime = 11.28;
    masterLayer214.name = "UNDLM_00214";
    masterLayer214.label = 2; // Couleurs alternées
}

// Ajouter plan 00240 à la timeline master
if (planCompositions[240]) {
    var masterLayer240 = masterComp.layers.add(planCompositions[240]);
    masterLayer240.startTime = 15.399999999999999;
    masterLayer240.name = "UNDLM_00240";
    masterLayer240.label = 3; // Couleurs alternées
}

// Ajouter plan 00253 à la timeline master
if (planCompositions[253]) {
    var masterLayer253 = masterComp.layers.add(planCompositions[253]);
    masterLayer253.startTime = 18.439999999999998;
    masterLayer253.name = "UNDLM_00253";
    masterLayer253.label = 4; // Couleurs alternées
}

// Ajouter plan 00257 à la timeline master
if (planCompositions[257]) {
    var masterLayer257 = masterComp.layers.add(planCompositions[257]);
    masterLayer257.startTime = 29.08;
    masterLayer257.name = "UNDLM_00257";
    masterLayer257.label = 5; // Couleurs alternées
}

// Ajouter plan 00259 à la timeline master
if (planCompositions[259]) {
    var masterLayer259 = masterComp.layers.add(planCompositions[259]);
    masterLayer259.startTime = 33.92;
    masterLayer259.name = "UNDLM_00259";
    masterLayer259.label = 6; // Couleurs alternées
}

// Ajouter plan 00260 à la timeline master
if (planCompositions[260]) {
    var masterLayer260 = masterComp.layers.add(planCompositions[260]);
    masterLayer260.startTime = 42.800000000000004;
    masterLayer260.name = "UNDLM_00260";
    masterLayer260.label = 7; // Couleurs alternées
}

// Ajouter plan 00261 à la timeline master
if (planCompositions[261]) {
    var masterLayer261 = masterComp.layers.add(planCompositions[261]);
    masterLayer261.startTime = 45.88;
    masterLayer261.name = "UNDLM_00261";
    masterLayer261.label = 8; // Couleurs alternées
}

// Ajouter plan 00264 à la timeline master
if (planCompositions[264]) {
    var masterLayer264 = masterComp.layers.add(planCompositions[264]);
    masterLayer264.startTime = 51.92;
    masterLayer264.name = "UNDLM_00264";
    masterLayer264.label = 9; // Couleurs alternées
}

// Ajouter plan 00265 à la timeline master
if (planCompositions[265]) {
    var masterLayer265 = masterComp.layers.add(planCompositions[265]);
    masterLayer265.startTime = 55.4;
    masterLayer265.name = "UNDLM_00265";
    masterLayer265.label = 10; // Couleurs alternées
}

// Ajouter plan 00266 à la timeline master
if (planCompositions[266]) {
    var masterLayer266 = masterComp.layers.add(planCompositions[266]);
    masterLayer266.startTime = 58.76;
    masterLayer266.name = "UNDLM_00266";
    masterLayer266.label = 11; // Couleurs alternées
}

// Ajouter plan 00267 à la timeline master
if (planCompositions[267]) {
    var masterLayer267 = masterComp.layers.add(planCompositions[267]);
    masterLayer267.startTime = 61.8;
    masterLayer267.name = "UNDLM_00267";
    masterLayer267.label = 12; // Couleurs alternées
}

// Ajouter plan 00278 à la timeline master
if (planCompositions[278]) {
    var masterLayer278 = masterComp.layers.add(planCompositions[278]);
    masterLayer278.startTime = 66.52;
    masterLayer278.name = "UNDLM_00278";
    masterLayer278.label = 13; // Couleurs alternées
}

// Ajouter plan 00281 à la timeline master
if (planCompositions[281]) {
    var masterLayer281 = masterComp.layers.add(planCompositions[281]);
    masterLayer281.startTime = 70.44;
    masterLayer281.name = "UNDLM_00281";
    masterLayer281.label = 14; // Couleurs alternées
}

// Ajouter plan 00284 à la timeline master
if (planCompositions[284]) {
    var masterLayer284 = masterComp.layers.add(planCompositions[284]);
    masterLayer284.startTime = 74.92;
    masterLayer284.name = "UNDLM_00284";
    masterLayer284.label = 15; // Couleurs alternées
}

// Ajouter plan 00286 à la timeline master
if (planCompositions[286]) {
    var masterLayer286 = masterComp.layers.add(planCompositions[286]);
    masterLayer286.startTime = 83.44;
    masterLayer286.name = "UNDLM_00286";
    masterLayer286.label = 16; // Couleurs alternées
}

// Ajouter plan 00332 à la timeline master
if (planCompositions[332]) {
    var masterLayer332 = masterComp.layers.add(planCompositions[332]);
    masterLayer332.startTime = 89.12;
    masterLayer332.name = "UNDLM_00332";
    masterLayer332.label = 1; // Couleurs alternées
}

// Ajouter plan 00333 à la timeline master
if (planCompositions[333]) {
    var masterLayer333 = masterComp.layers.add(planCompositions[333]);
    masterLayer333.startTime = 92.4;
    masterLayer333.name = "UNDLM_00333";
    masterLayer333.label = 2; // Couleurs alternées
}

// Ajouter plan 00383 à la timeline master
if (planCompositions[383]) {
    var masterLayer383 = masterComp.layers.add(planCompositions[383]);
    masterLayer383.startTime = 95.64;
    masterLayer383.name = "UNDLM_00383";
    masterLayer383.label = 3; // Couleurs alternées
}

// Ajouter plan 00388 à la timeline master
if (planCompositions[388]) {
    var masterLayer388 = masterComp.layers.add(planCompositions[388]);
    masterLayer388.startTime = 105.6;
    masterLayer388.name = "UNDLM_00388";
    masterLayer388.label = 4; // Couleurs alternées
}

// Ajouter plan 00392 à la timeline master
if (planCompositions[392]) {
    var masterLayer392 = masterComp.layers.add(planCompositions[392]);
    masterLayer392.startTime = 108.32;
    masterLayer392.name = "UNDLM_00392";
    masterLayer392.label = 5; // Couleurs alternées
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
    $.writeln("Effet Timecode non disponible, ajout manuel requis");
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
var seqExpression = 'var seqName = "P03_ALL";' + String.fromCharCode(13) +
'var seqVersion = "v001";' + String.fromCharCode(13) +
'// Détecter la version de la comp master courante' + String.fromCharCode(13) +
'var masterComp = thisComp;' + String.fromCharCode(13) +
'if (masterComp) {' + String.fromCharCode(13) +
'  var compName = masterComp.name;' + String.fromCharCode(13) +
'  var versionMatch = compName.match(/v(\\d{3})/);' + String.fromCharCode(13) +
'  if (versionMatch) seqVersion = versionMatch[0];' + String.fromCharCode(13) +
'}' + String.fromCharCode(13) +
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
var planExpression = 'var currentTime = time;' + String.fromCharCode(13) +
'var planName = "PLAN_INDETERMINE";' + String.fromCharCode(13) +
'var planVersion = "v001";' + String.fromCharCode(13) +
'' + String.fromCharCode(13) +
'// Détecter la version du plan actif depuis la source de la composition' + String.fromCharCode(13) +
'var masterComp = thisComp;' + String.fromCharCode(13) +
'for (var i = 1; i <= masterComp.numLayers; i++) {' + String.fromCharCode(13) +
'  try {' + String.fromCharCode(13) +
'    var layer = masterComp.layer(i);' + String.fromCharCode(13) +
'    // Vérifier que le layer a une source ET que c\'est le bon temps' + String.fromCharCode(13) +
'    if (layer.source && layer.startTime <= currentTime && (layer.startTime + layer.outPoint - layer.inPoint) > currentTime) {' + String.fromCharCode(13) +
'      if (layer.source.name && layer.source.name.indexOf("UNDLM_") !== -1) {' + String.fromCharCode(13) +
'        var compName = layer.source.name;' + String.fromCharCode(13) +
'        var versionMatch = compName.match(/v(\\d{3})/);' + String.fromCharCode(13) +
'        if (versionMatch) planVersion = versionMatch[0];' + String.fromCharCode(13) +
'        break;' + String.fromCharCode(13) +
'      }' + String.fromCharCode(13) +
'    }' + String.fromCharCode(13) +
'  } catch (e) {' + String.fromCharCode(13) +
'    // Ignorer les layers sans source' + String.fromCharCode(13) +
'  }' + String.fromCharCode(13) +
'}' + String.fromCharCode(13);

// Ajouter la logique pour chaque plan dans l'expression (simplifié)
var planTimeRanges = [
    {start: 0, end: 11.28, name: "UNDLM_00202"},
    {start: 11.28, end: 15.399999999999999, name: "UNDLM_00214"},
    {start: 15.399999999999999, end: 18.439999999999998, name: "UNDLM_00240"},
    {start: 18.439999999999998, end: 29.08, name: "UNDLM_00253"},
    {start: 29.08, end: 33.92, name: "UNDLM_00257"},
    {start: 33.92, end: 42.800000000000004, name: "UNDLM_00259"},
    {start: 42.800000000000004, end: 45.88, name: "UNDLM_00260"},
    {start: 45.88, end: 51.92, name: "UNDLM_00261"},
    {start: 51.92, end: 55.4, name: "UNDLM_00264"},
    {start: 55.4, end: 58.76, name: "UNDLM_00265"},
    {start: 58.76, end: 61.8, name: "UNDLM_00266"},
    {start: 61.8, end: 66.52, name: "UNDLM_00267"},
    {start: 66.52, end: 70.44, name: "UNDLM_00278"},
    {start: 70.44, end: 74.92, name: "UNDLM_00281"},
    {start: 74.92, end: 83.44, name: "UNDLM_00284"},
    {start: 83.44, end: 89.12, name: "UNDLM_00286"},
    {start: 89.12, end: 92.4, name: "UNDLM_00332"},
    {start: 92.4, end: 95.64, name: "UNDLM_00333"},
    {start: 95.64, end: 105.6, name: "UNDLM_00383"},
    {start: 105.6, end: 108.32, name: "UNDLM_00388"},
    {start: 108.32, end: 112.52, name: "UNDLM_00392"},
];

// Finaliser l'expression simplifiée avec version
for (var i = 0; i < planTimeRanges.length; i++) {
    planExpression += 'if (currentTime >= ' + planTimeRanges[i].start + ' && currentTime < ' + planTimeRanges[i].end + ') {' + String.fromCharCode(13);
    planExpression += '  planName = "' + planTimeRanges[i].name + '";' + String.fromCharCode(13);
    planExpression += '}' + String.fromCharCode(13);
}

planExpression += String.fromCharCode(13) +
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/P03_ALL/_AE/P03_ALL_01.aep");
project.save(saveFile);

// Statistiques finales détaillées
var gradedCount = 21;
var totalCount = 21;
var editOnlyCount = totalCount - gradedCount;

// Calcul des statistiques réelles d'import
var actualEditImported = editImportCount;
var actualGradedImported = gradingImportCount;
var editSuccessRate = Math.round((actualEditImported / totalCount) * 100);
var gradedSuccessRate = gradedCount > 0 ? Math.round((actualGradedImported / gradedCount) * 100) : 0;

alert("🎬 Séquence P03_ALL créée avec succès!" + "\n" + "\n" + "📊 Statistiques Détaillées:" + "\n" + "• Plans total: " + totalCount + "\n" + "• Plans EDIT importés: " + actualEditImported + "/" + totalCount + " (" + editSuccessRate + "%)" + "\n" + "• Plans GRADED importés: " + actualGradedImported + "/" + gradedCount + " (" + gradedSuccessRate + "%)" + "\n" + "• Plans EDIT manquants: " + missingEditCount + "\n" + "• Plans GRADED manquants: " + missingGradingCount + "\n" + "• Durée séquence: " + Math.round(112.52 * 100) / 100 + "s" + "\n" + "\n" + "💾 Sauvegardé: P03_ALL_01.aep" + "\n" + "\n" + "✅ Structure conforme au template AE" + "\n" + "✅ Sources UHD mises à l'échelle en 1440p" + "\n" + "✅ Import Edit + Graded avec variantes" + "\n" + "✅ Burn-ins avancés avec expressions dynamiques" + "\n" + "✅ Gestion intelligente EDIT vs GRADED" + "\n" + "✅ Messages d'avertissement et d'erreur" + "\n" + "\n" + "🔥 FONCTIONNALITÉS AVANCÉES:" + "\n" + "• Burn-in séquence (haut droite): P03_ALL v001" + "\n" + "• Burn-in plan courant (bas gauche): dynamique" + "\n" + "• Scope burn-in (centré): PNG ou texte fallback" + "\n" + "• Expressions avec détection de version" + "\n" + "• Drop shadows sur tous les burn-ins" + "\n" + "• Timecode automatique sur adjustment layer");

// Log détaillé pour Python avec toutes les métriques
$.writeln("AE_GENERATION_V2_SUCCESS:P03_ALL:" + totalCount + ":" + gradedCount + ":" +
          actualEditImported + ":" + actualGradedImported + ":" + missingEditCount + ":" + missingGradingCount);

// Log des erreurs pour debugging
if (importErrors.length > 0) {
    $.writeln("IMPORT_ERRORS:" + importErrors.join("|"));
}

// Log des succès pour validation
$.writeln("IMPORT_SUCCESS_COUNT:" + successfulImports.length);